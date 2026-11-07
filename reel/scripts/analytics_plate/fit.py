"""Fit text style by identity re-render: for each original string, render candidates in place and minimise pixel diff."""
import json, sys, numpy as np, itertools
from lib import Ed, PLATE
def fit(items, sizes_by, weights=(400, 500, 600, 700)):
    # one big render: each candidate drawn in its own copy region? -> render candidates to separate y-offset canvas
    import subprocess, html, os
    from PIL import Image, ImageFilter
    cands = []
    svg = []; Y = 0
    for i, (name, s, box, color, anchor) in enumerate(items):
        ink = Ed().ink(box)
        for size in sizes_by[name]:
            for w in weights:
                bx = 10 if anchor == 'start' else 590
                svg.append(f'<text x="{bx}" y="{Y + 70}" font-family="Inter" font-size="{size * 1.25}" font-weight="{w}" fill="rgb{tuple(color)}" text-anchor="{anchor}">{html.escape(s)}</text>')
                cands.append((i, size, w, Y)); Y += 90
    doc = f'<html><body style="margin:0"><svg xmlns="http://www.w3.org/2000/svg" width="{600/1.25}" height="{Y/1.25}" viewBox="0 0 600 {Y}">' + ''.join(svg) + '</svg></body></html>'
    open('fit.html', 'w').write(doc)
    subprocess.run(['node', 'shot.js', os.path.abspath('fit.html'), 'fit.png', str(int(600/1.25)), '800', '1.25'], check=True)
    L = Image.open('fit.png').convert('RGBA')
    res = {}
    for blur in (0.3, 0.45, 0.6, 0.8):
        Lb = np.asarray(L.filter(ImageFilter.GaussianBlur(blur))).astype(np.float32)
        for (i, size, w, Y0) in cands:
            name, s, box, color, anchor = items[i]
            x0, y0, x1, y1 = box
            o = PLATE[y0:y1, x0:x1].astype(np.float32)
            bg = np.median(np.concatenate([o[0], o[-1], o[:, 0], o[:, -1]]), axis=0)
            cell = Lb[Y0:Y0 + 90]
            a = cell[..., 3:4] / 255
            comp = bg * (1 - a) + cell[..., :3] * a
            # align by ink bbox of comp vs orig
            def bb(img):
                d = np.abs(img - bg).max(axis=2); ys, xs = np.nonzero(d > 40)
                return xs.min(), ys.min(), xs.max(), ys.max()
            try:
                ox0, oy0, ox1, oy1 = bb(o); cx0, cy0, cx1, cy1 = bb(comp)
            except ValueError:
                continue
            # anchor alignment: left for start, right for end; baseline by bottom of ink
            dx = (ox0 - cx0) if anchor == 'start' else (ox1 - cx1)
            dy = oy1 - cy1
            best = None
            for ddx in (-1, 0, 1):
                for ddy in (-1, 0, 1):
                    sh = np.full_like(o, 0) + bg
                    X0 = dx + ddx; Y1 = dy + ddy
                    # place comp into orig frame
                    hh, ww = o.shape[:2]
                    src = comp[max(0, -Y1):, max(0, -X0):]
                    tgt_y, tgt_x = max(0, Y1), max(0, X0)
                    hh2 = min(hh - tgt_y, src.shape[0]); ww2 = min(ww - tgt_x, src.shape[1])
                    sh[tgt_y:tgt_y + hh2, tgt_x:tgt_x + ww2] = src[:hh2, :ww2]
                    err = np.abs(sh - o).mean()
                    if best is None or err < best[0]:
                        best = (err, X0, Y1)
            err, X0, Y1 = best
            # translate to plate coords: text anchor x and baseline y
            bx = 10 if anchor == 'start' else 590
            ax = x0 + X0 + bx; ay = y0 + Y1 + 70 - Y0 * 0  # cell y origin: baseline at 70 within cell
            ay = y0 + Y1 + 70
            key = name
            if key not in res or err < res[key]['err']:
                res[key] = dict(err=round(float(err), 3), size=size, weight=w, blur=blur, x=int(ax), y=int(ay), anchor=anchor)
    return res
if __name__ == '__main__':
    spec = json.load(open(sys.argv[1]))
    items = [tuple(x) for x in spec]
    sizes = {it[0]: [x / 4 for x in range(int(it[5][0] * 4), int(it[5][1] * 4) + 1)] for it in spec}
    r = fit([it[:5] for it in items], sizes)
    json.dump(r, open(sys.argv[1].replace('.json', '.fit.json'), 'w'), indent=1)
    for k, v in r.items(): print(k, v)
