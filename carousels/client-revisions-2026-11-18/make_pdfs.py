"""Two deliverable PDFs: each carousel's slides followed by its caption page (and, for insurance, Vejay's saved copy)."""
import html, os, re, subprocess
from pypdf import PdfReader, PdfWriter
HERE = os.path.dirname(os.path.abspath(__file__)); E = html.escape
FONTS = '/home/user/awesome-opus-5-5-prompts/reel/public/fonts'
md = open(os.path.join(HERE, 'Captions-and-Notes.md')).read()
sec = {k: v for k, v in zip(['A', 'B'], md.split('\n## ')[1:3])}
notes = md.split('## What changed from the draft, and why')[1]
saved = open(os.path.join(HERE, 'Saved-Post-Copy-Endo-Insurance-Original.md')).read().split('\n', 1)[1].strip()
CSS = f'''@page {{ size: 1080px 1350px; margin: 0; }}
@font-face {{ font-family: J; src: url(file://{FONTS}/plus-jakarta-sans-latin-800-normal.woff2); }}
@font-face {{ font-family: I; src: url(file://{FONTS}/inter-latin-500-normal.woff2); }}
body {{ margin: 0; font-family: I; color: #16132B; }}
.pg {{ width: 1080px; height: 1350px; box-sizing: border-box; padding: 80px 76px; background: linear-gradient(170deg,#FBFAFF,#EFEAFF); page-break-after: always; overflow: hidden; }}
.k {{ color: #6D4AE8; font-weight: 700; letter-spacing: .14em; font-size: 22px; text-transform: uppercase; }}
h1 {{ font-family: J; font-size: 48px; line-height: 1.1; margin: 12px 0 26px; }}
.box {{ background: #fff; border: 1.5px solid rgba(109,74,232,.2); border-radius: 22px; padding: 30px 34px; font-size: 23px; line-height: 1.5; white-space: pre-wrap; }}
.s {{ font-size: 20px; color: #4a4560; line-height: 1.5; margin-top: 22px; white-space: pre-wrap; }}'''
def clean(t): return re.sub(r'\*\*(.*?)\*\*', r'\1', t).strip()
def page(kind, title, body, extra=''):
    return f'<div class="pg"><div class="k">{E(kind)}</div><h1>{E(title)}</h1><div class="box">{E(body)}</div><div class="s">{E(extra)}</div></div>'
def render(pages, out):
    h = os.path.join(HERE, '_c.html'); j = os.path.join(HERE, '_c.cjs')
    open(h, 'w').write(f'<html><head><meta charset="utf-8"><style>{CSS}</style></head><body>{"".join(pages)}</body></html>')
    open(j, 'w').write(f"const {{chromium}}=require('playwright');(async()=>{{const b=await chromium.launch();const p=await b.newPage();await p.goto('file://{h}');await p.evaluate(()=>document.fonts.ready);await p.pdf({{path:'{out}',width:'1080px',height:'1350px',printBackground:true}});await b.close();}})();")
    subprocess.run(['node', j], check=True, cwd='/home/user/awesome-opus-5-5-prompts/reel'); os.remove(h); os.remove(j)
def parts(s):
    head, rest = s.split('\n', 1)
    cap = rest.split('**Caption**')[1]
    meta = rest.split('**Caption**')[0].strip()
    body, *tail = cap.split('**First comment')
    tags = [l for l in body.strip().split('\n') if l.startswith('#')]
    body = '\n'.join(l for l in body.strip().split('\n') if not l.startswith('#')).strip()
    extra = meta + '\n\nHashtags: ' + ' '.join(tags) + ('\n\nFirst comment' + clean(tail[0]).replace('**', '') if tail else '')
    return head.split('·', 1)[1].strip(), body, extra.replace('**', '')
for key, slides, out, more in [
    ('A', 'carousel-A-oral-surgery-3-tasks.pdf', 'ToothReferral-Oral-Surgery-3-Tasks-Carousel.pdf', []),
    ('B', 'carousel-B-endo-insurance.pdf', 'ToothReferral-Endo-Insurance-Carousel.pdf',
     [page('Saved for later · original copy', "Vejay's endodontic insurance post (unchanged)", saved)])]:
    title, body, extra = parts(sec[key])
    tmp = os.path.join(HERE, '_cap.pdf')
    render([page('LinkedIn caption', title, body, extra)] + more, tmp)
    w = PdfWriter()
    for f in (slides, tmp):
        for p in PdfReader(os.path.join(HERE, f)).pages: w.add_page(p)
    w.write(os.path.join(HERE, out)); os.remove(tmp); print(out, len(w.pages))
