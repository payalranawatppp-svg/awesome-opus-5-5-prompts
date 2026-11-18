"""Compare a coded app page with its reference screenshot.
usage: python scripts/app_diff.py <composition-id> <reference.jpg> <out-prefix>
Writes <out>-render.png, <out>-side.png (reference | render), <out>-diff.png (heat map of differences) and prints the
share of pixels that match within a small tolerance, plus the worst 8 regions (64 px blocks) to fix next."""
import subprocess, sys
import numpy as np
from PIL import Image, ImageFilter

comp, ref, out = sys.argv[1], sys.argv[2], sys.argv[3]
subprocess.run(['npx', 'remotion', 'still', comp, f'{out}-render.png', '--frame=0', '--log=error'], check=True)
a = Image.open(ref).convert('RGB'); b = Image.open(f'{out}-render.png').convert('RGB').resize(a.size)
A = np.asarray(a.filter(ImageFilter.GaussianBlur(1.2))).astype(int); B = np.asarray(b.filter(ImageFilter.GaussianBlur(1.2))).astype(int)
d = np.abs(A - B).max(2)
ok = (d < 24).mean()
print(f'match {ok * 100:.1f}% of pixels (tolerance 24/255 after a light blur)')
H, W = d.shape; blocks = []
for y in range(0, H - 63, 64):
    for x in range(0, W - 63, 64):
        blocks.append((float((d[y:y + 64, x:x + 64] >= 24).mean()), x, y))
for s, x, y in sorted(blocks, reverse=True)[:8]: print(f'  block x={x} y={y}: {s * 100:.0f}% off')
heat = Image.fromarray(np.clip(d * 3, 0, 255).astype(np.uint8))
heat.save(f'{out}-diff.png')
side = Image.new('RGB', (a.width * 2, a.height)); side.paste(a, (0, 0)); side.paste(b, (a.width, 0)); side.save(f'{out}-side.png')
