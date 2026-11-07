"""Plate editing toolkit: pixel ops on the stitched page + an SVG layer rendered by Chrome at DSF 1.25."""
import numpy as np, subprocess, os, html
from PIL import Image, ImageFilter
Image.MAX_IMAGE_PIXELS = None
HERE = os.path.dirname(os.path.abspath(__file__))
PLATE = np.asarray(Image.open(os.path.join(HERE, '../rec4/plate.png')).convert('RGB')).copy()
H, W = PLATE.shape[:2]
DSF = 1.25

class Ed:
    def __init__(self):
        self.img = PLATE.copy().astype(np.float32)
        self.svg = []
    # ---------- measurement
    def ink(self, box, thr=40, src=None):
        x0, y0, x1, y1 = box
        a = (PLATE if src is None else src)[y0:y1, x0:x1].astype(int)
        bg = np.median(np.concatenate([a[0], a[-1], a[:, 0], a[:, -1]]), axis=0)
        d = np.abs(a - bg).max(axis=2)
        ys, xs = np.nonzero(d > thr)
        return (x0 + xs.min(), y0 + ys.min(), x0 + xs.max() + 1, y0 + ys.max() + 1) if len(xs) else None
    def color(self, x, y):
        return tuple(int(v) for v in PLATE[y, x])
    # ---------- pixel ops
    def fill(self, box, color=None):
        x0, y0, x1, y1 = [int(round(v)) for v in box]
        if color is None:
            ring = np.concatenate([PLATE[y0 - 1, x0:x1], PLATE[y1, x0:x1], PLATE[y0:y1, x0 - 1], PLATE[y0:y1, x1]])
            color = np.median(ring, axis=0)
        self.img[y0:y1, x0:x1] = color
    def fill_bg(self, box, q=85):
        """fill each row of the box with that row's bright percentile (removes ink, keeps hover tints)"""
        x0, y0, x1, y1 = [int(round(v)) for v in box]
        a = PLATE[y0:y1, x0:x1].astype(np.float32)
        self.img[y0:y1, x0:x1] = np.percentile(a, q, axis=1)[:, None, :]
    def fill_rows(self, box, src_x):
        """fill a box with the plate column at src_x repeated (keeps vertical gradients/borders)"""
        x0, y0, x1, y1 = box
        self.img[y0:y1, x0:x1] = PLATE[y0:y1, src_x:src_x + 1].astype(np.float32)
    def fill_cols(self, box, src_y):
        x0, y0, x1, y1 = box
        self.img[y0:y1, x0:x1] = PLATE[src_y:src_y + 1, x0:x1].astype(np.float32)
    def copy(self, box, dx, dy, src=None):
        x0, y0, x1, y1 = box
        s = PLATE if src is None else src
        self.img[y0 + dy:y1 + dy, x0 + dx:x1 + dx] = s[y0:y1, x0:x1]
    def recolor(self, box, src_rgb, dst_rgb, bg=(255, 255, 255)):
        """map colors along the bg->src line onto bg->dst (keeps antialiasing)"""
        x0, y0, x1, y1 = box
        a = self.img[y0:y1, x0:x1]
        bg = np.array(bg, np.float32); s = np.array(src_rgb, np.float32) - bg; d = np.array(dst_rgb, np.float32) - bg
        t = np.clip(((a - bg) @ s) / (s @ s), 0, 1.2)[..., None]
        resid = (a - bg) - t * s
        mask = (np.linalg.norm(resid, axis=2) < 40)[..., None]
        self.img[y0:y1, x0:x1] = np.where(mask, bg + t * d + resid, a)
    # ---------- svg layer (device px coords)
    def text(self, x, y, s, size, weight=400, color=(0, 0, 0), anchor='start', ls=0, family='Inter'):
        c = 'rgb(%d,%d,%d)' % tuple(color)
        self.svg.append(f'<text xml:space="preserve" x="{x}" y="{y}" font-family="{family}" font-size="{size * DSF}" font-weight="{weight}" fill="{c}" text-anchor="{anchor}" letter-spacing="{ls * DSF}">{html.escape(s)}</text>')
    def tspans(self, x, y, parts, anchor='start'):
        """parts: list of (text, size, weight, color, dx)"""
        out = [f'<text xml:space="preserve" x="{x}" y="{y}" font-family="Inter" text-anchor="{anchor}">']
        for t, size, weight, color, dx in parts:
            out.append(f'<tspan dx="{dx}" font-size="{size * DSF}" font-weight="{weight}" fill="rgb({color[0]},{color[1]},{color[2]})">{html.escape(t)}</tspan>')
        self.svg.append(''.join(out) + '</text>')
    def raw(self, s):
        self.svg.append(s)
    def rect(self, x, y, w, h, color, rx=0, stroke=None, sw=1):
        st = f' stroke="rgb{tuple(stroke)}" stroke-width="{sw}"' if stroke else ''
        self.svg.append(f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{rx}" fill="rgb({color[0]},{color[1]},{color[2]})"{st}/>')
    # ---------- render
    def render(self, out, blur=0.45, y_range=None):
        y0, y1 = y_range or (0, H)
        doc = (f'<html><body style="margin:0;background:transparent"><svg xmlns="http://www.w3.org/2000/svg" width="{W / DSF}" height="{(y1 - y0) / DSF}" '
               f'viewBox="0 {y0} {W} {y1 - y0}" style="display:block">' + ''.join(self.svg) + '</svg></body></html>')
        open(os.path.join(HERE, 'layer.html'), 'w').write(doc)
        subprocess.run(['node', os.path.join(HERE, 'shot.js'), os.path.join(HERE, 'layer.html'), os.path.join(HERE, 'layer.png'), str(int(W / DSF)), str(int((y1 - y0) / DSF)), str(DSF)], check=True)
        L = np.asarray(Image.open(os.path.join(HERE, 'layer.png')).convert('RGBA')).astype(np.float32)[: y1 - y0, :W]
        a = L[..., 3:4] / 255
        pm = L[..., :3] * a
        if blur:
            from scipy.ndimage import gaussian_filter
            pm = np.stack([gaussian_filter(pm[..., c], blur) for c in range(3)], -1)
            a = gaussian_filter(a[..., 0], blur)[..., None]
        base = self.img[y0:y0 + L.shape[0]]
        base[:] = base * (1 - a) + pm
        res = np.clip(self.img, 0, 255).astype(np.uint8)
        Image.fromarray(res).save(out)
        return res
