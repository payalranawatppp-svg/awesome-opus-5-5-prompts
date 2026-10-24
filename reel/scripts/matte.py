"""Cut the speaker out of a talking-head clip, for the effects in src/effects/.

Runs Robust Video Matting (RVM, MobileNetV3, ONNX) frame by frame with its recurrent state, so the
alpha is temporally stable (no edge flicker), and writes:

  <out>/<name>.webm        the speaker with an alpha channel (VP9, yuva420p), same size and fps as the source
  <out>/<name>-plate.jpg   a clean plate: the background with the speaker removed (median of every
                           revealed pixel, the never-revealed region inpainted). Used by Vertigo.
  <out>/<name>-matte.mp4   the raw RVM alpha as a greyscale video (check it by eye; --reuse-matte reads it back)
  <clip-dir>/<name>.webm   a VP9 copy of the full clip, if missing. The render browser cannot decode
                           H.264, and an H.264 <Video> silently drops @remotion/effects.

The cutout keeps only the main figure (small stray blobs such as a corner watermark are dropped), and
--fade-bottom Y0:Y1 fades the alpha out between source rows Y0 and Y1, for clips with burned-in text
or a watermark low in the frame (the bundled clips use 980:1040).

usage: python matte.py <clip.mp4> <out-dir> [--model rvm_mobilenetv3_fp32.onnx] [--ratio 0.4]
                       [--fade-bottom 980:1040] [--reuse-matte]

Needs: onnxruntime, opencv-python-headless<5, numpy, ffmpeg with libvpx-vp9.
The model (GPL-3.0, ~15 MB) is not in the repo; download it once with
  curl -L -o rvm_mobilenetv3_fp32.onnx \\
    https://github.com/PeterL1n/RobustVideoMatting/releases/download/v1.0.0/rvm_mobilenetv3_fp32.onnx
"""
import argparse
import json
import subprocess
from pathlib import Path

import cv2
import numpy as np
import onnxruntime as ort

ap = argparse.ArgumentParser()
ap.add_argument("clip")
ap.add_argument("out")
ap.add_argument("--model", default="rvm_mobilenetv3_fp32.onnx")
ap.add_argument("--ratio", type=float, default=0.4, help="RVM downsample ratio (0.4 suits 720x1280)")
ap.add_argument("--warmup", type=int, default=24, help="frames run once first to settle the recurrent state")
ap.add_argument("--fade-bottom", default=None, help="Y0:Y1 source rows over which the cutout fades out")
ap.add_argument("--reuse-matte", action="store_true", help="read <out>/<name>-matte.mp4 instead of running RVM")
ap.add_argument("--no-plate", action="store_true", help="skip the clean plate (it needs several GB of RAM on long clips)")
args = ap.parse_args()

clip, out = Path(args.clip), Path(args.out)
out.mkdir(parents=True, exist_ok=True)
name = clip.stem

probe = json.loads(subprocess.run(
    ["ffprobe", "-v", "error", "-select_streams", "v:0", "-show_entries", "stream=width,height,r_frame_rate",
     "-of", "json", str(clip)], capture_output=True, check=True, text=True).stdout)["streams"][0]
w, h, fps = probe["width"], probe["height"], probe["r_frame_rate"]

cap = cv2.VideoCapture(str(clip))
frames = []
while True:
    ok, f = cap.read()
    if not ok:
        break
    frames.append(f)
cap.release()

matte_path = out / f"{name}-matte.mp4"
reuse = args.reuse_matte and matte_path.exists()
if not reuse:
    sess = ort.InferenceSession(args.model, providers=["CPUExecutionProvider"])
    ratio = np.array([args.ratio], dtype=np.float32)


def run(seq, state):
    alphas = []
    for f in seq:
        src = cv2.cvtColor(f, cv2.COLOR_BGR2RGB).astype(np.float32).transpose(2, 0, 1)[None] / 255.0
        fgr, pha, *state = sess.run(None, {"src": src, "r1i": state[0], "r2i": state[1], "r3i": state[2],
                                           "r4i": state[3], "downsample_ratio": ratio})
        alphas.append(pha[0, 0])
    return alphas, state


if reuse:
    cap = cv2.VideoCapture(str(matte_path))
    raw = []
    while True:
        ok, f = cap.read()
        if not ok:
            break
        raw.append(f[..., 0].astype(np.float32) / 255)
    cap.release()
    assert len(raw) == len(frames), (len(raw), len(frames))
else:
    zero = [np.zeros((1, 1, 1, 1), dtype=np.float32)] * 4
    _, warm = run(frames[: args.warmup], zero)      # settle the recurrent state, then matte from frame 0
    raw, _ = run(frames, warm)


def clean(a):
    """Keep the main figure only, then apply the bottom fade."""
    n, lab, stats, _ = cv2.connectedComponentsWithStats((a > 0.1).astype(np.uint8), connectivity=8)
    if n > 2:
        areas = stats[1:, cv2.CC_STAT_AREA]
        keep = np.zeros(n, bool)
        keep[1:] = areas >= 0.02 * areas.max()
        a = a * cv2.dilate(keep[lab].astype(np.uint8), np.ones((5, 5), np.uint8))
    if args.fade_bottom:
        y0, y1 = (int(v) for v in args.fade_bottom.split(":"))
        ramp = np.clip((y1 - np.arange(h, dtype=np.float32)) / max(y1 - y0, 1), 0, 1)
        a = a * (ramp * ramp * (3 - 2 * ramp))[:, None]
    return a


alphas = [clean(a) for a in raw]

# 1. cutout: source colour + alpha, VP9 with alpha
enc = subprocess.Popen(
    ["ffmpeg", "-v", "error", "-y", "-f", "rawvideo", "-pix_fmt", "rgba", "-s", f"{w}x{h}", "-r", fps, "-i", "-",
     "-c:v", "libvpx-vp9", "-pix_fmt", "yuva420p", "-b:v", "0", "-crf", "28", "-row-mt", "1",
     "-auto-alt-ref", "0", str(out / f"{name}.webm")], stdin=subprocess.PIPE)
mat = subprocess.Popen(
    ["ffmpeg", "-v", "error", "-y", "-f", "rawvideo", "-pix_fmt", "gray", "-s", f"{w}x{h}", "-r", fps, "-i", "-",
     "-c:v", "libx264", "-crf", "12", "-pix_fmt", "yuv420p",
     str(matte_path if not reuse else out / f"{name}-matte.tmp.mp4")], stdin=subprocess.PIPE)
for f, a in zip(frames, alphas):
    a8 = np.clip(a * 255 + 0.5, 0, 255).astype(np.uint8)
    rgba = np.dstack([cv2.cvtColor(f, cv2.COLOR_BGR2RGB), a8])
    enc.stdin.write(rgba.tobytes())
if not reuse:
    for r in raw:
        mat.stdin.write(np.clip(r * 255 + 0.5, 0, 255).astype(np.uint8).tobytes())
for p in (enc, mat):
    p.stdin.close()
    p.wait()

hole = np.zeros(1)
if not args.no_plate:
    # 2. clean plate: per-pixel median of the frames where that pixel is clearly background
    stack = np.stack(frames[::3]).astype(np.float32)                    # (n, h, w, 3)
    # a pixel counts as background only when the speaker is >= 12 px away (hair edges and motion blur stain the edge)
    bg = np.stack([cv2.dilate((r > 0.02).astype(np.uint8), np.ones((25, 25), np.uint8)) == 0 for r in raw[::3]])
    masked = np.where(bg[..., None], stack, np.nan)
    with np.errstate(all="ignore"), __import__("warnings").catch_warnings():
        __import__("warnings").simplefilter("ignore", RuntimeWarning)
        plate = np.nanmedian(masked, axis=0)
    hole = np.isnan(plate[..., 0])
    plate = np.nan_to_num(plate).astype(np.uint8)
    grow = cv2.dilate(hole.astype(np.uint8) * 255, np.ones((15, 15), np.uint8))   # also redo the hole's rim
    small = cv2.resize(plate, (w // 4, h // 4), interpolation=cv2.INTER_AREA)
    small_hole = cv2.dilate(cv2.resize(grow, (w // 4, h // 4), interpolation=cv2.INTER_NEAREST), np.ones((3, 3), np.uint8))
    filled = cv2.inpaint(small, small_hole, 12, cv2.INPAINT_TELEA)
    filled = cv2.GaussianBlur(cv2.resize(filled, (w, h), interpolation=cv2.INTER_CUBIC), (0, 0), 6)
    soft = np.maximum(cv2.GaussianBlur(grow.astype(np.float32) / 255, (0, 0), 4), hole)[..., None]   # 1 on the hole
    plate = (plate * (1 - soft) + filled * soft).astype(np.uint8)
    cv2.imwrite(str(out / f"{name}-plate.jpg"), plate, [cv2.IMWRITE_JPEG_QUALITY, 92])

(out / f"{name}-matte.tmp.mp4").unlink(missing_ok=True)
full_webm = clip.with_suffix(".webm")
if clip.suffix != ".webm" and not full_webm.exists():
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", str(clip), "-c:v", "libvpx-vp9", "-b:v", "0", "-crf", "24",
                    "-row-mt", "1", "-an", str(full_webm)], check=True)
cover = float(np.mean([a.mean() for a in alphas]))
print(f"{name}: {len(frames)} frames {w}x{h}@{fps}, speaker covers {cover:.0%} of the frame, "
      f"plate hole {hole.mean():.0%}")
