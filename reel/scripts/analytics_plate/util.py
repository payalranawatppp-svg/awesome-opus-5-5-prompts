from PIL import ImageFont
FILES = {400: 'Regular', 500: 'Medium', 600: 'SemiBold', 700: 'Bold', 800: 'ExtraBold'}
_c = {}
def adv(s, size, weight):
    k = (size, weight)
    if k not in _c:
        _c[k] = ImageFont.truetype(f'/usr/share/fonts/opentype/inter/Inter-{FILES[weight]}.otf', size * 1.25)
    return _c[k].getlength(s)
def monotone(pts):
    """SVG path through points with monotone cubic interpolation (no overshoot)."""
    n = len(pts)
    if n < 2: return ''
    xs = [p[0] for p in pts]; ys = [p[1] for p in pts]
    d = [(ys[i + 1] - ys[i]) / (xs[i + 1] - xs[i]) for i in range(n - 1)]
    m = [d[0]] + [0 if d[i - 1] * d[i] <= 0 else (d[i - 1] + d[i]) / 2 for i in range(1, n - 1)] + [d[-1]]
    for i in range(n - 1):
        if d[i] == 0: m[i] = m[i + 1] = 0
    out = f'M{xs[0]:.1f},{ys[0]:.1f}'
    for i in range(n - 1):
        h = xs[i + 1] - xs[i]
        out += f' C{xs[i] + h / 3:.1f},{ys[i] + m[i] * h / 3:.1f} {xs[i + 1] - h / 3:.1f},{ys[i + 1] - m[i + 1] * h / 3:.1f} {xs[i + 1]:.1f},{ys[i + 1]:.1f}'
    return out
def poly(pts):
    return 'M' + ' L'.join(f'{x:.1f},{y:.1f}' for x, y in pts)
def series_pts(vals, x0, x1, ybase, ytop, vmax=None, vmin=0):
    vals = [0 if v is None else v for v in vals]
    vmax = vmax if vmax is not None else (max(vals) or 1)
    n = len(vals)
    return [(x0 + (x1 - x0) * i / (n - 1), ybase - (ybase - ytop) * (v - vmin) / ((vmax - vmin) or 1)) for i, v in enumerate(vals)]
def inkbox(s, size, weight):
    adv(s, size, weight)
    return _c[(size, weight)].getbbox(s, anchor='ls')  # (l, t, r, b) relative to origin on baseline
