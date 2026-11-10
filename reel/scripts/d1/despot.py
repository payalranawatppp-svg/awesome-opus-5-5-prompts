"""Skin clean-up for the Day One cut: removes small dark spots (freckles, blemishes) on skin, frame by frame.
Only pixels that are (a) skin-coloured, (b) inside the face/neck area and (c) noticeably darker than the skin around
them are lifted to the local skin tone. Eyes, brows, glasses band and lips are excluded, so expression, lip sync and
the glasses are untouched. Frame count and timing are unchanged.
usage: python despot.py <in> <out.mp4> [start_s dur_s]"""
import sys, subprocess, numpy as np, cv2
from insightface.app import FaceAnalysis

INP, OUT = sys.argv[1:3]
SS = sys.argv[3:5]
W, H = 1080, 1920
app = FaceAnalysis(name='buffalo_l', root='.', providers=['CPUExecutionProvider'], allowed_modules=['detection'])
app.prepare(ctx_id=-1, det_size=(640, 640))

def clean(fr, f):
    x0, y0, x1, y1 = f.bbox
    fw, fh = x1 - x0, y1 - y0
    # face + neck + upper chest area
    X0, X1 = int(max(0, x0 - 0.55 * fw)), int(min(W, x1 + 0.55 * fw))
    Y0, Y1 = int(max(0, y0 - 0.45 * fh)), int(min(H, y1 + 1.6 * fh))
    if X1 - X0 < 40 or Y1 - Y0 < 40: return fr
    roi = fr[Y0:Y1, X0:X1]
    k = int(max(11, (fw / 11)) // 2 * 2 + 1)            # spot scale relative to face size
    med = cv2.medianBlur(roi, k)
    med = cv2.GaussianBlur(med, (0, 0), k / 4)
    L = cv2.cvtColor(roi, cv2.COLOR_BGR2LAB)[:, :, 0].astype(np.float32)
    Lm = cv2.cvtColor(med, cv2.COLOR_BGR2LAB)[:, :, 0].astype(np.float32)
    dark = np.clip((Lm - L - 5.0) / 10.0, 0, 1)          # how much darker than the surrounding skin
    ycc = cv2.cvtColor(med, cv2.COLOR_BGR2YCrCb).astype(np.float32)
    skin = ((ycc[:, :, 1] > 133) & (ycc[:, :, 1] < 178) & (ycc[:, :, 2] > 80) & (ycc[:, :, 2] < 130) & (ycc[:, :, 0] > 70)).astype(np.float32)
    skin = cv2.erode(skin, np.ones((5, 5), np.uint8))
    keep = np.ones_like(skin)
    kp = f.kps - [X0, Y0]
    le, re, nose, ml, mr = kp
    ed = np.linalg.norm(re - le)
    ey = (le[1] + re[1]) / 2
    # eyes (safety)
    for e in (le, re):
        cv2.ellipse(keep, (int(e[0]), int(e[1])), (int(0.32 * ed), int(0.2 * ed)), 0, 0, 360, 0, -1)
    # glasses frames: a thick outline around each lens, the bridge and the temple arms (the lens interior is cleaned)
    ux = (re - le) / ed; uy = np.array([-ux[1], ux[0]])
    ang = float(np.degrees(np.arctan2(ux[1], ux[0])))
    th = max(3, int(0.27 * ed))
    for e in (le, re):
        c = e + uy * 0.1 * ed
        box = cv2.boxPoints(((float(c[0]), float(c[1])), (1.28 * ed, 0.95 * ed), ang)).astype(np.int32)
        cv2.polylines(keep, [box], True, 0, th)
    tl = le - ux * 0.54 * ed - uy * 0.35 * ed; tr = re + ux * 0.54 * ed - uy * 0.35 * ed
    cv2.line(keep, tuple((le + ux * 0.5 * ed - uy * 0.3 * ed).astype(int)), tuple((re - ux * 0.5 * ed - uy * 0.3 * ed).astype(int)), 0, th)
    cv2.line(keep, tuple(tl.astype(int)), tuple((tl - ux * 0.8 * ed).astype(int)), 0, th)
    cv2.line(keep, tuple(tr.astype(int)), tuple((tr + ux * 0.8 * ed).astype(int)), 0, th)
    # only small isolated dots count as spots: long/large dark shapes (glasses rims and their pattern, forehead
    # lines, brows, lashes, hairline) are found as big connected components and protected with a margin
    sp = ((Lm - L) > 15.0).astype(np.uint8)
    n, lab, st, _ = cv2.connectedComponentsWithStats(sp, 8)
    amax = (0.11 * ed) ** 2; lmax = 0.2 * ed
    big = (st[:, cv2.CC_STAT_AREA] > amax) | (np.maximum(st[:, cv2.CC_STAT_WIDTH], st[:, cv2.CC_STAT_HEIGHT]) > lmax)
    big[0] = False
    prot = big[lab].astype(np.uint8)
    prot = cv2.dilate(prot, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (int(0.08 * ed) | 1, int(0.08 * ed) | 1)))
    keep = keep * (1 - prot.astype(np.float32))
    # lips / teeth
    mc = (ml + mr) / 2; mw = np.linalg.norm(mr - ml)
    cv2.ellipse(keep, (int(mc[0]), int(mc[1])), (int(mw * 0.85), int(mw * 0.55)), 0, 0, 360, 0, -1)
    # nostrils
    cv2.ellipse(keep, (int(nose[0]), int(nose[1] + 0.08 * ed)), (int(0.42 * ed), int(0.22 * ed)), 0, 0, 360, 0, -1)
    keep = cv2.GaussianBlur(keep, (0, 0), 2)
    m = dark * skin * keep
    m = cv2.GaussianBlur(cv2.dilate(m, np.ones((3, 3), np.uint8)), (0, 0), 1.2)[..., None]
    # lift the spot to the local skin tone, keep a little of the original texture
    out = roi.astype(np.float32) * (1 - m) + (med.astype(np.float32) * 0.95 + roi.astype(np.float32) * 0.05) * m
    fr[Y0:Y1, X0:X1] = np.clip(out, 0, 255).astype(np.uint8)
    return fr

args_in = ['ffmpeg', '-v', 'error'] + (['-ss', SS[0], '-t', SS[1]] if SS else []) + ['-i', INP, '-f', 'rawvideo', '-pix_fmt', 'bgr24', '-']
rd = subprocess.Popen(args_in, stdout=subprocess.PIPE)
wr = subprocess.Popen(['ffmpeg', '-v', 'error', '-y', '-f', 'rawvideo', '-pix_fmt', 'bgr24', '-s', f'{W}x{H}', '-r', '30', '-i', '-',
                       '-c:v', 'libx264', '-crf', '15', '-preset', 'medium', '-pix_fmt', 'yuv420p', OUT], stdin=subprocess.PIPE)
n = 0; last = None; miss = 0
while True:
    buf = rd.stdout.read(W * H * 3)
    if len(buf) < W * H * 3: break
    fr = np.frombuffer(buf, np.uint8).reshape(H, W, 3).copy()
    faces = app.get(cv2.resize(fr, (540, 960)))
    if faces:
        f = max(faces, key=lambda f: (f.bbox[2] - f.bbox[0]) * (f.bbox[3] - f.bbox[1]))
        f.bbox = f.bbox * 2; f.kps = f.kps * 2; last = f
    else:
        f = last; miss += 1
    if f is not None: fr = clean(clean(fr, f), f)
    wr.stdin.write(fr.tobytes()); n += 1
    if n % 300 == 0: print(n, 'frames', flush=True)
wr.stdin.close(); wr.wait()
print('done', n, 'frames, detector misses', miss)
