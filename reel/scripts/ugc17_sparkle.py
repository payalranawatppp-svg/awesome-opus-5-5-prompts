"""Remove the drifting copy of the Veo sparkle that Flow baked into the scene (UGC17 Ethan clips: it rides along with
the mug, so a fixed delogo box misses it). Template = the static watermark at (572,1132,56,56) on frame 0; each frame is
searched below/around it, the static box is ignored, and a match above THRESH is inpainted.

    python scripts/ugc17_sparkle.py in.mp4 out.mp4      (720x1280 Flow clip in, same size out, audio copied)
"""
import subprocess, sys
import cv2, numpy as np

src, dst = sys.argv[1], sys.argv[2]
THRESH = 0.55
cap = cv2.VideoCapture(src)
fps = cap.get(cv2.CAP_PROP_FPS)
ok, f0 = cap.read()
assert ok
hp = lambda g: cv2.subtract(g, cv2.GaussianBlur(g, (0, 0), 6))  # the sparkle is a faint bright shape: match its high-pass
tpl = hp(cv2.cvtColor(f0[1136:1184, 576:624], cv2.COLOR_BGR2GRAY))
shape = cv2.dilate((tpl > 3).astype(np.uint8) * 255, np.ones((11, 11), np.uint8))  # the sparkle's own outline, not a disc
X0, Y0, X1, Y1 = 470, 1040, 720, 1280  # search window
cap.set(cv2.CAP_PROP_POS_FRAMES, 0)
h, w = f0.shape[:2]
ff = subprocess.Popen(["ffmpeg", "-v", "error", "-y", "-f", "rawvideo", "-pix_fmt", "bgr24", "-s", f"{w}x{h}", "-r", str(fps), "-i", "-",
                       "-i", src, "-map", "0:v", "-map", "1:a", "-c:v", "libx264", "-crf", "10", "-preset", "slow", "-pix_fmt", "yuv420p",
                       "-c:a", "copy", dst], stdin=subprocess.PIPE)
hits = 0
while True:
    ok, fr = cap.read()
    if not ok:
        break
    g = hp(cv2.cvtColor(fr[Y0:Y1, X0:X1], cv2.COLOR_BGR2GRAY))
    r = cv2.matchTemplate(g, tpl, cv2.TM_CCOEFF_NORMED)
    # ignore the static watermark (delogo handles it)
    sy, sx = 1136 - Y0, 576 - X0
    r[max(0, sy - 20):sy + 20, max(0, sx - 20):sx + 20] = -1
    _, mx, _, (px, py) = cv2.minMaxLoc(r)
    if mx > THRESH:
        m = np.zeros(fr.shape[:2], np.uint8)
        m[Y0 + py:Y0 + py + 48, X0 + px:X0 + px + 48] = shape
        fr = cv2.inpaint(fr, m, 4, cv2.INPAINT_TELEA)
        hits += 1
    ff.stdin.write(fr.tobytes())
ff.stdin.close(); ff.wait()
print(src, "sparkle removed on", hits, "frames")
