"""Remove burned-in subtitles that Google Flow sometimes adds near the bottom of a take.

usage: python remove_subtitles.py IN.mp4 OUT.mp4 --band Y0 Y1 --clean T0 T1 [--x0 X0 --x1 X1]

A clean plate is the per-pixel median of the take between --clean T0..T1 seconds (a stretch with no subtitle). In every
frame, inside the band, pixels that are near-white or near-black (the text and its outline) AND differ from the plate are
masked, dilated, and replaced by the plate with a feathered edge. Everything outside the band (and the "Veo" mark, which
sits below the band) is untouched. Audio is copied.
"""
import argparse
import subprocess

import cv2
import numpy as np

ap = argparse.ArgumentParser()
ap.add_argument("src")
ap.add_argument("dst")
ap.add_argument("--band", nargs=2, type=int, required=True)
ap.add_argument("--clean", nargs=2, type=float, required=True)
ap.add_argument("--x0", type=int, default=0)
ap.add_argument("--x1", type=int, default=10_000)
a = ap.parse_args()

cap = cv2.VideoCapture(a.src)
fps = cap.get(cv2.CAP_PROP_FPS)
frames = []
while True:
    ok, f = cap.read()
    if not ok:
        break
    frames.append(f)
h, w = frames[0].shape[:2]
y0, y1 = a.band
x0, x1 = max(0, a.x0), min(w, a.x1)
clean = [frames[i] for i in range(int(a.clean[0] * fps), min(len(frames), int(a.clean[1] * fps)))]
plate = np.median(np.stack([c[y0:y1, x0:x1] for c in clean]), axis=0).astype(np.uint8)

enc = subprocess.Popen(["ffmpeg", "-v", "error", "-y", "-f", "rawvideo", "-pix_fmt", "bgr24", "-s", f"{w}x{h}", "-r", str(fps), "-i", "-",
                        "-i", a.src, "-map", "0:v", "-map", "1:a?", "-c:v", "libx264", "-crf", "12", "-preset", "slow", "-pix_fmt", "yuv420p",
                        "-c:a", "copy", a.dst], stdin=subprocess.PIPE)
k3 = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (7, 7))
k5 = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (5, 5))
fixed = 0
for f in frames:
    sub = f[y0:y1, x0:x1]
    gray = cv2.cvtColor(sub, cv2.COLOR_BGR2GRAY)
    diff = np.abs(sub.astype(np.int16) - plate.astype(np.int16)).max(axis=2)
    white = (gray > 232).astype(np.uint8)
    dark = (gray < 62).astype(np.uint8)
    # subtitle glyphs: pure white strokes with a dark outline right next to them, and not part of the static scene
    glyph = ((white & cv2.dilate(dark, k3)) | (dark & cv2.dilate(white, k3))) & (diff > 40)
    if glyph.sum() > 250:
        glyph = cv2.morphologyEx(glyph, cv2.MORPH_CLOSE, k3)
        m = cv2.dilate(glyph, k5, iterations=3)
        soft = cv2.GaussianBlur(m.astype(np.float32), (0, 0), 2.5)[..., None]
        soft = np.clip(soft * 1.4, 0, 1)
        f[y0:y1, x0:x1] = (plate * soft + sub * (1 - soft)).astype(np.uint8)
        fixed += 1
    enc.stdin.write(f.tobytes())
enc.stdin.close()
enc.wait()
print(f"{a.src}: {fixed}/{len(frames)} frames cleaned")
