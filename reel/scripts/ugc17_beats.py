"""beats.png: one frame per beat of UGC17, taken from the final render (frame at 65% of each beat)."""
import json, subprocess, sys
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[1]
video = sys.argv[1] if len(sys.argv) > 1 else str(ROOT / "renders/ugc17/ugc17-five-moments.mp4")
out = ROOT / "renders/ugc17/beats.png"
beats = json.load(open(ROOT / "src/ugc17/edl.json"))["beats"]
tmp = ROOT / "tmp17/beats"; tmp.mkdir(parents=True, exist_ok=True)
TW, TH, COLS = 270, 480, 7
rows = -(-len(beats) // COLS)
sheet = Image.new("RGB", (COLS * TW, rows * (TH + 34)), (18, 16, 30))
d = ImageDraw.Draw(sheet)
font = ImageFont.truetype("arial.ttf", 20)
for i, b in enumerate(beats):
    f = b["f0"] + int((b["f1"] - b["f0"]) * 0.65)
    p = tmp / f"{b['id']}.png"
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-ss", f"{f / 30:.3f}", "-i", video, "-frames:v", "1", str(p)], check=True)
    x, y = (i % COLS) * TW, (i // COLS) * (TH + 34)
    sheet.paste(Image.open(p).resize((TW, TH), Image.LANCZOS), (x, y + 34))
    d.text((x + 8, y + 6), f"{b['id']}  {b['f0'] / 30:.1f}-{b['f1'] / 30:.1f}s", fill=(230, 225, 255), font=font)
sheet.save(out)
print(out)
