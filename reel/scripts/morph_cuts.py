"""Hide jump cuts in a talking-head edit with morph cuts, so the edit reads as one continuous take.

At each jump (a cut, or a join between two source clips) the frames k-N .. k+N-1 around the first frame k of the new
shot are replaced by an aligned blend between the last clean frame before (k-N-1) and the first clean frame after
(k+N): each side is warped toward the other along an affine fit of the speaker and the two are blended on a
smoothstep curve, so the head glides into its new position instead of snapping. The frame count never changes, so the audio
(and lip sync) stays exactly where it was; cuts sit in pauses, so the replaced frames are breaths, not words.

Jumps are found by scoring every cut in <cut>.json and every source-clip join that falls inside a kept segment:
the picture change across the join against the motion just around it (--all morphs every candidate).

usage: python morph_cuts.py IN.mp4 CUT.json OUT.mp4 [--clip-lens 8,8,...] [--half 3] [--all] [--mic mask.png]
Needs opencv-python-headless, numpy, ffmpeg.
"""
import argparse
import json
import subprocess
from collections import deque

import cv2
import numpy as np

ap = argparse.ArgumentParser()
ap.add_argument("src")
ap.add_argument("cut")
ap.add_argument("out")
ap.add_argument("--clip-lens", default="", help="source clip lengths in seconds, to find clip joins inside segments")
ap.add_argument("--half", type=int, default=3, help="frames replaced on each side of a jump")
ap.add_argument("--all", action="store_true", help="morph every candidate, not only visible jumps")
ap.add_argument("--mic", default="", help="RGBA mask of anything fixed in front of the speaker (kept unwarped)")
a = ap.parse_args()

fps = 30
w, h = map(int, subprocess.run(["ffprobe", "-v", "error", "-select_streams", "v:0", "-show_entries", "stream=width,height",
                                "-of", "csv=p=0", a.src], capture_output=True, text=True).stdout.strip().split(","))
seg = json.load(open(a.cut))["segments"]

cand = {round(g["at"] * fps) for g in seg[1:]}
if a.clip_lens:
    joins = np.cumsum([float(x) for x in a.clip_lens.split(",")])[:-1]
    for j in joins:
        for g in seg:
            if g["in"] + 0.02 < j < g["out"] - 0.02:
                cand.add(round((g["at"] + j - g["in"]) * fps))


def frames(scale=None):
    vf = ["-vf", f"scale={scale[0]}:{scale[1]}"] if scale else []
    fw, fh = scale or (w, h)
    pix, ch = ("gray", 1) if scale else ("bgr24", 3)
    p = subprocess.Popen(["ffmpeg", "-v", "error", "-i", a.src, *vf, "-f", "rawvideo", "-pix_fmt", pix, "-"], stdout=subprocess.PIPE)
    n = fw * fh * ch
    while True:
        b = p.stdout.read(n)
        if len(b) < n:
            return
        yield np.frombuffer(b, np.uint8).reshape(fh, fw, ch) if ch == 3 else np.frombuffer(b, np.uint8).astype(np.float32)


# 1. score the candidates on a small grey copy
small = list(frames((180, 320)))
d = np.array([np.abs(small[i + 1] - small[i]).mean() for i in range(len(small) - 1)])
targets = []
for k in sorted(cand):
    if k < a.half + 2 or k > len(small) - a.half - 2:
        continue
    local = np.percentile(np.r_[d[k - 8:k - 2], d[k + 1:k + 7]], 90)
    if a.all or d[k - 1] > 1.3 * local:
        targets.append(k)
print(f"{len(cand)} candidates, morphing {len(targets)}: {targets}")
del small

# 2. stream the full-size frames, rewriting each window as it passes
# The two shots differ mostly by where the head and shoulders sit, so each side is aligned to the other with an affine
# fit (ECC, coarse to fine, mic excluded) and they meet halfway while cross-blending. Dense optical flow cannot follow
# a jump this large between two different takes and ghosts. The mic never moves between takes, so it is restored
# from the untouched frames afterwards.
mic = cv2.imread(a.mic, cv2.IMREAD_UNCHANGED)[..., 3].astype(np.float32) / 255 if a.mic else np.zeros((h, w), np.float32)
mic = cv2.GaussianBlur(cv2.dilate(mic, np.ones((9, 9), np.uint8)), (0, 0), 3)[..., None]
eye = np.eye(2, 3, dtype=np.float32)


def align(A, B):
    """Affine W with B(x) ~ A(W x), estimated coarse to fine with the mic masked out."""
    W = eye.copy()
    for s in (0.25, 0.5):
        ga = cv2.resize(cv2.cvtColor(A, cv2.COLOR_BGR2GRAY), None, fx=s, fy=s).astype(np.float32)
        gb = cv2.resize(cv2.cvtColor(B, cv2.COLOR_BGR2GRAY), None, fx=s, fy=s).astype(np.float32)
        m = (cv2.resize(mic[..., 0], None, fx=s, fy=s) < 0.05).astype(np.uint8)
        Ws = W.copy()
        Ws[:, 2] *= s
        try:
            _, Ws = cv2.findTransformECC(gb, ga, Ws, cv2.MOTION_AFFINE,
                                         (cv2.TERM_CRITERIA_EPS | cv2.TERM_CRITERIA_COUNT, 200, 1e-5), m, 5)
        except cv2.error:
            return W
        W = Ws.copy()
        W[:, 2] /= s
    return W


def lerp_warp(img, W, t):
    Wt = eye + t * (W - eye)
    return cv2.warpAffine(img, Wt, (w, h), flags=cv2.INTER_LINEAR | cv2.WARP_INVERSE_MAP, borderMode=cv2.BORDER_REPLICATE)


def morph(A, B, n):
    W = align(A, B)
    Wi = cv2.invertAffineTransform(W)
    out = []
    for i in range(1, n + 1):
        t = i / (n + 1)
        t = t * t * (3 - 2 * t)  # smoothstep: leaves and lands gently
        m = cv2.addWeighted(lerp_warp(A, W, t), 1 - t, lerp_warp(B, Wi, 1 - t), t, 0).astype(np.float32)
        still = cv2.addWeighted(A, 1 - t, B, t, 0).astype(np.float32)
        out.append((m * (1 - mic) + still * mic).astype(np.uint8))
    return out


enc = subprocess.Popen(["ffmpeg", "-v", "error", "-y", "-f", "rawvideo", "-pix_fmt", "bgr24", "-s", f"{w}x{h}", "-r", str(fps),
                        "-i", "-", "-i", a.src, "-map", "0:v", "-map", "1:a?", "-c:v", "libx264", "-crf", "12", "-preset", "slow",
                        "-pix_fmt", "yuv420p", "-c:a", "copy", a.out], stdin=subprocess.PIPE)
buf = deque()
pending = deque(targets)
H = a.half
for idx, f in enumerate(frames()):
    buf.append([idx, f])
    # the window for target k needs frames k-H-1 .. k+H; run it as soon as k+H arrives
    while pending and idx == pending[0] + H:
        k = pending.popleft()
        lo = next(e for e in buf if e[0] == k - H - 1)[1]
        hi = next(e for e in buf if e[0] == k + H)[1]
        for e, m in zip([e for e in buf if k - H <= e[0] <= k + H - 1], morph(lo, hi, 2 * H)):
            e[1] = m
    while len(buf) > 4 * H + 4:
        enc.stdin.write(np.ascontiguousarray(buf.popleft()[1]).tobytes())
while buf:
    enc.stdin.write(np.ascontiguousarray(buf.popleft()[1]).tobytes())
enc.stdin.close()
enc.wait()
print("wrote", a.out)
