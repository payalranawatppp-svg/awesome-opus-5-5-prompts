"""Match the colour of several takes of one set-up to a reference take, so a join never shows a jump.

Generated takes drift: one comes out brighter, the next warmer or more magenta. For every clip this measures the mean
and spread of each Lab channel over the whole clip (a sample of frames, so a hand passing through does not move it),
then maps every frame of that clip onto the reference clip's statistics with one fixed affine per channel. One
correction per clip, constant in time: nothing can flicker. The look itself (contrast, saturation) is applied later,
once, over the whole edit.

usage: python match_grade.py --ref N OUT_DIR clip1.mp4 clip2.mp4 ...   (N = index of the reference clip, from 0)
writes OUT_DIR/<clip name>.mp4 (video CRF 12, audio copied) and prints the before/after statistics.
Needs opencv-python-headless, numpy, ffmpeg.
"""
import argparse
import os
import subprocess

import cv2
import numpy as np

ap = argparse.ArgumentParser()
ap.add_argument("--ref", type=int, default=0)
ap.add_argument("out")
ap.add_argument("clips", nargs="+")
a = ap.parse_args()
os.makedirs(a.out, exist_ok=True)


def stats(path, every=6):
    cap = cv2.VideoCapture(path)
    acc, i = [], 0
    while True:
        ok, f = cap.read()
        if not ok:
            break
        if i % every == 0:
            acc.append(cv2.cvtColor(f, cv2.COLOR_BGR2LAB).reshape(-1, 3).astype(np.float32)[::7])
        i += 1
    x = np.concatenate(acc)
    return x.mean(0), x.std(0)


S = [stats(c) for c in a.clips]
rm, rs = S[a.ref]
for c, (m, s) in zip(a.clips, S):
    gain = rs / np.maximum(s, 1e-3)
    off = rm - m * gain
    cap = cv2.VideoCapture(c)
    fps = cap.get(cv2.CAP_PROP_FPS)
    w, h = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH)), int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
    name = os.path.splitext(os.path.basename(c))[0]
    dst = os.path.join(a.out, name + ".mp4")
    enc = subprocess.Popen(["ffmpeg", "-v", "error", "-y", "-f", "rawvideo", "-pix_fmt", "bgr24", "-s", f"{w}x{h}", "-r", f"{fps}",
                            "-i", "-", "-i", c, "-map", "0:v", "-map", "1:a?", "-c:v", "libx264", "-crf", "12", "-preset", "slow",
                            "-pix_fmt", "yuv420p", "-c:a", "copy", dst], stdin=subprocess.PIPE)
    while True:
        ok, f = cap.read()
        if not ok:
            break
        lab = cv2.cvtColor(f, cv2.COLOR_BGR2LAB).astype(np.float32) * gain + off
        enc.stdin.write(cv2.cvtColor(np.clip(lab, 0, 255).astype(np.uint8), cv2.COLOR_LAB2BGR).tobytes())
    enc.stdin.close()
    enc.wait()
    m2, s2 = stats(dst)
    print(f"{name:16s} L {m[0]:6.1f} -> {m2[0]:6.1f}  a {m[1] - 128:5.1f} -> {m2[1] - 128:5.1f}  b {m[2] - 128:5.1f} -> {m2[2] - 128:5.1f}"
          f"  (ref L {rm[0]:.1f} a {rm[1] - 128:.1f} b {rm[2] - 128:.1f})")
