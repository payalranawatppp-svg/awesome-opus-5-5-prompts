import os
import numpy as np, subprocess, sys
from PIL import Image
from scipy.ndimage import binary_dilation, gaussian_filter, maximum_filter, label, find_objects
Image.MAX_IMAGE_PIXELS = None
P = np.asarray(Image.open('../rec4/plate.png').convert('RGB')).astype(np.int16)
E = np.asarray(Image.open('edit.png').convert('RGB')).astype(np.int16)
ys = np.load('../rec4/ys30.npy')
W, H = 1920, 842
M = (np.abs(E - P).max(2) > 2)
M = binary_dilation(M, iterations=3)
Mf = gaussian_filter(M.astype(np.float32), 1.0)  # soft edge
# pixels usable to measure hover tint: unchanged by the edit and flat in the plate (no ink nearby)
gy = np.abs(np.diff(P.astype(np.float32).mean(2), axis=0, prepend=0)); gx = np.abs(np.diff(P.astype(np.float32).mean(2), axis=1, prepend=0))
FLAT = (maximum_filter(np.maximum(gx, gy), size=7) < 3) & ~binary_dilation(np.abs(E - P).max(2) > 2, iterations=4)
print('mask px', M.sum())
out = sys.argv[1]; limit = int(sys.argv[2]) if len(sys.argv) > 2 else 10**9
dec = subprocess.Popen(['ffmpeg', '-v', 'error', '-i', '../rec4/rec4.mp4', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-'], stdout=subprocess.PIPE)
enc = subprocess.Popen(['ffmpeg', '-v', 'error', '-y', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-s', f'{W}x{H}', '-r', '30', '-i', '-',
                        '-c:v', 'libx264', '-preset', 'slow', *os.environ.get('X264', '-crf 15').split(), '-pix_fmt', 'yuv420p', '-movflags', '+faststart', out], stdin=subprocess.PIPE)
fixed = np.zeros((H, W), bool); fixed[728:828, 1788:1884] = True; fixed[:, 1898:] = True
start = int(sys.argv[3]) if len(sys.argv) > 3 else 0
i = 0
while i < limit:
    b = dec.stdout.read(W * H * 3)
    if len(b) < W * H * 3: break
    F = np.frombuffer(b, np.uint8).reshape(H, W, 3).astype(np.int16)
    if i < start:
        i += 1; continue
    y = int(ys[i])
    m = Mf[y:y + H].copy(); m[fixed] = 0
    if m.max() > 0:
        rows = np.nonzero(m.max(1) > 0)[0]; r0, r1 = rows.min(), rows.max() + 1
        Fp = F[r0:r1]; Pp = P[y + r0:y + r1]; Ep = E[y + r0:y + r1]
        d = (Fp - Pp).astype(np.float32)
        ad = np.abs(d).max(2)
        # cursor: compact blob of large difference; restore only its pixels from the real frame
        keep = np.zeros(ad.shape, bool)
        lab, n = label(ad > 40)
        for k, sl in enumerate(find_objects(lab), 1):
            if sl is None: continue
            h_, w_ = sl[0].stop - sl[0].start, sl[1].stop - sl[1].start
            cnt = (lab[sl] == k).sum()
            if h_ <= 52 and w_ <= 46 and cnt >= 35 and cnt / (h_ * w_) > 0.12 and h_ >= 14:
                ys_ = slice(max(0, sl[0].start - 3), sl[0].stop + 3); xs_ = slice(max(0, sl[1].start - 3), sl[1].stop + 3)
                keep[ys_, xs_] |= ad[ys_, xs_] > 14
        fl = FLAT[y + r0:y + r1].astype(np.float32)
        den = gaussian_filter(fl, 12) + 1e-3
        tint = np.stack([gaussian_filter(np.clip(d[..., c], -10, 10) * fl, 12) / den for c in range(3)], -1)
        tint *= (den > 0.05)[..., None]
        tint *= (np.abs(tint).max(2, keepdims=True) > 2.5)  # only real hover tints, not codec noise
        new = np.clip(Ep + tint, 0, 255)
        mm = (m[r0:r1] * (~keep))[..., None]
        F[r0:r1] = (Fp * (1 - mm) + new * mm).round().astype(np.int16)
    enc.stdin.write(F.astype(np.uint8).tobytes())
    i += 1
enc.stdin.close(); enc.wait(); print('frames', i)
