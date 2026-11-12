"""Build one LinkedIn-Caption-and-Slides PDF and one Slides-Only PDF per web-form post (pdf/), from slides/ and captions.json."""
import os, json, subprocess, html, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'feature-posts'))
from PIL import Image
HERE = os.path.dirname(os.path.abspath(__file__)); E = html.escape
FONTS = os.path.abspath(os.path.join(HERE, '..', '..', 'reel', 'public', 'fonts'))
POSTS = [
 ('carousel-1-web-form-vs-system', 'Post-1-Carousel-Web-Form-vs-System', 'Post 1 · Carousel · 6 slides · pairs with Buried in Emails v2 / Form vs software', 'A web form submits. A system keeps working.'),
 ('carousel-2-the-whole-team', 'Post-2-Carousel-One-Referral-The-Whole-Team', 'Post 2 · Carousel · 7 slides · pairs with Buried in Emails v2', 'One referral, the whole team'),
 ('carousel-3-direct-communication', 'Post-3-Carousel-Direct-Communication', 'Post 3 · Carousel · 6 slides · pairs with Same referral, two ways', 'Direct communication on the case'),
 ('post-4-a-system-for-your-team', 'Post-4-Image-A-System-For-Your-Team', 'Post 4 · Single image · pairs with all', "It's not just a form. It's a system for your team."),
 ('post-5-web-form-or-system', 'Post-5-Image-Web-Form-or-System', 'Post 5 · Single image · pairs with all', 'Web form or system? 5 questions'),
]
css = f'''@page {{ size: A4; margin: 16mm 14mm; }}
@font-face {{ font-family: Jakarta; src: url(file://{FONTS}/plus-jakarta-sans-latin-800-normal.woff2); font-weight: 800; }}
@font-face {{ font-family: InterW; src: url(file://{FONTS}/inter-latin-500-normal.woff2); font-weight: 500; }}
@font-face {{ font-family: InterW; src: url(file://{FONTS}/inter-latin-700-normal.woff2); font-weight: 700; }}
body {{ font-family: InterW; color: #16132B; font-size: 10.5pt; line-height: 1.5; }}
h1 {{ font-family: Jakarta; font-size: 22pt; margin: 2mm 0 2mm; }}
.meta {{ color: #6D3DF0; font-weight: 700; font-size: 9pt; letter-spacing: .1em; text-transform: uppercase; }}
.grid {{ display: grid; grid-template-columns: repeat(4, 1fr); gap: 3mm; margin: 4mm 0 5mm; }}
.grid img {{ width: 100%; border-radius: 2mm; box-shadow: 0 1mm 3mm rgba(40,20,110,.2); }}
.box {{ border: 1px solid #E4DBFF; border-radius: 3mm; padding: 4mm 5mm; margin-bottom: 4mm; background: #FBFAFF; page-break-inside: avoid; }}
.box h3 {{ font-family: Jakarta; font-size: 11pt; margin: 0 0 2mm; color: #6D3DF0; }}
.cap {{ white-space: pre-wrap; }} .tags {{ color: #3B1E8F; font-weight: 700; }}
.kw span {{ display: inline-block; background: #EFEAFF; color: #3B1E8F; border-radius: 9pt; padding: .5mm 2.5mm; margin: 0 1.5mm 1.5mm 0; font-size: 9pt; }}
.small {{ color: #6B7085; font-size: 9pt; }}
.full {{ page-break-before: always; text-align: center; }} .full img {{ height: 245mm; border-radius: 3mm; }}'''
cap = json.load(open(os.path.join(HERE, 'captions.json')))
for pid, name, meta, title in POSTS:
    c = cap[pid]; d = os.path.join(HERE, 'slides', pid)
    files = sorted(os.path.join(d, f) for f in os.listdir(d) if f.endswith('.png'))
    body = f'''<div class="meta">{E(meta)}</div><h1>{E(title)}</h1>
<div class="grid">{''.join(f'<img src="file://{f}">' for f in files)}</div>
<div class="box"><h3>Hook (first line)</h3><div class="cap"><b>{E(c["hook"])}</b></div></div>
<div class="box"><h3>Caption</h3><div class="cap">{E(c["linkedin"])}</div><p class="tags">{E(" ".join(c["hashtags_linkedin"]))}</p></div>
<div class="box kw"><h3>Keywords (first comment and alt text)</h3>{''.join(f"<span>{E(k)}</span>" for k in c["keywords"])}<p class="small"><b>Alt text:</b> {E(c["alt"])}</p></div>''' + ''.join(f'<div class="full"><div class="meta">Slide {k} of {len(files)}</div><img src="file://{f}"></div>' for k, f in enumerate(files, 1))
    doc = os.path.join(HERE, '_doc.html'); open(doc, 'w').write(f'<html><head><meta charset="utf-8"><style>{css}</style></head><body>{body}</body></html>')
    out = os.path.join(HERE, 'pdf', f'{name}-LinkedIn-Caption-and-Slides.pdf')
    js = os.path.join(HERE, '_pdf.cjs'); open(js, 'w').write(f'''const {{ chromium }} = require('playwright');
(async () => {{ const b = await chromium.launch(); const pg = await b.newPage(); await pg.goto('file://{doc}'); await pg.evaluate(() => document.fonts.ready); await pg.waitForTimeout(400);
await pg.pdf({{ path: '{out}', format: 'A4', printBackground: true }}); await b.close(); }})();''')
    subprocess.run(['node', js], check=True); os.remove(doc); os.remove(js)
    ims = [Image.open(f).convert('RGB') for f in files]
    ims[0].save(os.path.join(HERE, 'pdf', f'{name}-Slides-Only.pdf'), save_all=True, append_images=ims[1:], resolution=72)
    print(name)
