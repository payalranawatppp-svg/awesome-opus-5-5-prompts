"""Verify the no-overlap layout rule on every frame of the LayoutQA render.

LayoutQA renders three side-by-side panels with all visible pixels forced to white:
captions | motion-graphics stage | avatar keep-out box. This script ANDs the panels per
frame and fails if captions, graphics and the avatar touch anywhere (after a small
threshold that ignores faint glow/shadow tails).

    python3 scripts/check_layout_qa.py out/layout-qa      # directory of PNG frames
Requires numpy and ffmpeg.
"""
import subprocess
import sys
from pathlib import Path

import numpy as np

THRESHOLD = 48  # 0-255: pixels fainter than this (soft shadows/glows) don't count as content
src = Path(sys.argv[1])
frames = sorted(src.glob("*.png"))
if not frames:
    sys.exit(f"no PNG frames in {src}")

probe = subprocess.run(
    ["ffprobe", "-v", "error", "-select_streams", "v:0", "-show_entries", "stream=width,height", "-of", "csv=p=0", str(frames[0])],
    capture_output=True, text=True, check=True,
).stdout.strip()
W, H = map(int, probe.split(","))
raw = subprocess.run(
    ["ffmpeg", "-v", "error", "-f", "image2", "-pattern_type", "glob", "-i", str(src / "*.png"), "-f", "rawvideo", "-pix_fmt", "gray", "-"],
    capture_output=True, check=True,
).stdout
video = np.frombuffer(raw, np.uint8).reshape(-1, H, W)
pw = W // 3
scale = 1080 / pw

def dilate(m, r):
    """Grow a mask by r pixels (box), to measure clearance rather than just contact."""
    out = m.copy()
    for dy in range(-r, r + 1):
        for dx in range(-r, r + 1):
            out |= np.roll(np.roll(m, dy, axis=0), dx, axis=1)
    return out


worst_avatar = None
failures = []
crowded = []
CAPTION_STAGE_MIN = 8  # px (output scale) of clear space required between captions and graphics
r = max(1, round(CAPTION_STAGE_MIN / scale))
for i, fr in enumerate(video):
    cap, stage, avatar = (fr[:, k * pw : (k + 1) * pw] > THRESHOLD for k in range(3))
    pairs = {"caption∩avatar": cap & avatar, "stage∩avatar": stage & avatar, "caption∩stage": cap & stage}
    for name, m in pairs.items():
        n = int(m.sum())
        if n:
            failures.append((i, name, n))
    if cap.any() and stage.any() and (dilate(cap, r) & stage).any():
        crowded.append(i)
    if avatar.any():
        av_top = np.argmax(avatar.any(axis=1))
        rows = np.where((cap | stage).any(axis=1))[0]
        if len(rows):
            gap = (av_top - rows.max()) * scale
            if worst_avatar is None or gap < worst_avatar[0]:
                worst_avatar = (gap, i)

print(f"checked {len(video)} frames ({pw}x{H} per panel, threshold {THRESHOLD})")
if worst_avatar:
    print(f"tightest clearance between overlays and avatar: {worst_avatar[0]:.0f}px (frame {worst_avatar[1]})")
if crowded:
    failures += [(i, f"caption-stage clearance < {CAPTION_STAGE_MIN}px", 0) for i in crowded]
else:
    print(f"captions and graphics keep ≥{CAPTION_STAGE_MIN}px clearance on every frame")
if failures:
    for i, name, n in failures[:40]:
        print(f"  frame {i}: {name}" + (f" overlap of {n} px" if n else ""))
    sys.exit(f"FAIL: {len(failures)} overlapping frame/pair instances")
print("PASS: no caption, graphic or avatar overlap on any frame")
