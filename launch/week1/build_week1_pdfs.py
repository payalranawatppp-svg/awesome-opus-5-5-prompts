"""Week 1 launch, as PDFs for Vejay:
  ToothReferral-Week-1-Schedule.pdf   one document: workflow graphic, then one page per day (thumbnail, link, message,
                                      goal, caption, hashtags)
  Day-5-Image-Post.pdf                the single-image post (made earlier in carousels/web-form-posts, post 4) with its
                                      caption, hashtags and alt text
Captions come from build_week1_plan.py (CAPTIONS)."""
import html, json, os, subprocess, sys
HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = '/home/user/awesome-opus-5-5-prompts'
FONTS = os.path.join(ROOT, 'reel/public/fonts')
E = html.escape
sys.argv = [sys.argv[0]]
import importlib.util
spec = importlib.util.spec_from_file_location('plan', os.path.join(HERE, 'build_week1_plan.py'))
plan = importlib.util.module_from_spec(spec); spec.loader.exec_module(plan)
CAP = {r[0]: r for r in plan.CAPTIONS}
LOGO = 'file://' + os.path.join(ROOT, 'reel/public/tr/logo.png')
IMG = lambda f: 'file://' + os.path.join(HERE, 'img', f)
ALT5 = json.load(open(os.path.join(ROOT, 'carousels/web-form-posts/captions.json')))['post-4-a-system-for-your-team']['alt']

DAYS = [
    dict(day='Day 1', fmt='Video', length='1:10 · vertical 9:16', title='Buried in Emails, version 1', img='day1.jpg', role='The problem',
         link=plan.LINK['v1'], msg='Referrals get lost because the work is spread across emails, voicemails and faxes. Tooth Referral puts it in one system.',
         goal='Open the campaign on a problem every front desk recognises, then introduce Tooth Referral by name.'),
    dict(day='Day 2', fmt='Carousel', length='7 slides', title='Stop chasing insurance cards', img='day2.png', role='Proof: insurance',
         link=plan.LINK['c1'], msg='One click, Request from patient, sends a secure link; the patient\'s card lands on the referral.',
         goal='Back up Day 1 with one concrete time-saver that either office can use from day one.'),
    dict(day='Day 3', fmt='Video', length='1:16 · vertical 9:16', title='Buried in Emails, version 2', img='day3.jpg', role='The system for the team',
         link=plan.LINK['v2'], msg='Every referral comes in as one case, so the office keeps running whoever is out, and the referring office sees the status itself.',
         goal='Build the "system for the team" idea on the Day 1 story.'),
    dict(day='Day 4', fmt='Carousel', length='8 slides', title='Notes that write themselves', img='day4.png', role='Proof: notes',
         link=plan.LINK['c2'], msg='Letters fill in from your own templates, go to the doctor to e-sign, and land on the case for both offices.',
         goal='Show the value for the doctor and the owner as well as the front desk.'),
    dict(day='Day 5', fmt='Image', length='Single image · 1080 x 1350', title='It\'s not just a form. It\'s a system for your team.', img='day5.png', role='The summary',
         link=None, msg='A web form sends an email and stops. Tooth Referral turns each referral into a case the whole team and the referring office can work on.',
         goal='Close the week with one clear positioning line people can repeat.'),
]
ICON = {
    'Video': '<path d="M3 6h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2zM17 10l5-3v10l-5-3"/>',
    'Carousel': '<path d="M7 4h10v16H7zM3 7v10M21 7v10"/>',
    'Image': '<path d="M3 4h18v16H3zM3 16l5-5 4 4 3-3 6 6"/><circle cx="16" cy="9" r="1.6"/>',
}
ico = lambda k, c='#fff', s=22: f'<svg width="{s}" height="{s}" viewBox="0 0 24 24" fill="none" stroke="{c}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">{ICON[k]}</svg>'

CSS = f'''@page {{ size: A4; margin: 0; }}
@font-face {{ font-family: Jakarta; src: url(file://{FONTS}/plus-jakarta-sans-latin-800-normal.woff2); font-weight: 800; }}
@font-face {{ font-family: Jakarta; src: url(file://{FONTS}/plus-jakarta-sans-latin-700-normal.woff2); font-weight: 700; }}
@font-face {{ font-family: InterW; src: url(file://{FONTS}/inter-latin-500-normal.woff2); font-weight: 500; }}
@font-face {{ font-family: InterW; src: url(file://{FONTS}/inter-latin-700-normal.woff2); font-weight: 700; }}
* {{ box-sizing: border-box; margin: 0; padding: 0; }}
body {{ font-family: InterW, sans-serif; color: #16132B; font-size: 10pt; line-height: 1.5; }}
.page {{ width: 210mm; height: 297mm; padding: 16mm 15mm 14mm; position: relative; page-break-after: always; overflow: hidden; }}
.page:last-child {{ page-break-after: auto; }}
.top {{ display: flex; justify-content: space-between; align-items: center; margin-bottom: 7mm; }}
.top img {{ height: 11mm; }}
.top span {{ color: #6D4AE8; font-weight: 700; font-size: 8pt; letter-spacing: .14em; text-transform: uppercase; }}
.k {{ color: #6D4AE8; font-weight: 700; font-size: 8.5pt; letter-spacing: .14em; text-transform: uppercase; }}
h1 {{ font-family: Jakarta; font-weight: 800; font-size: 25pt; line-height: 1.08; letter-spacing: -.02em; margin: 2mm 0 3mm; }}
h2 {{ font-family: Jakarta; font-weight: 800; font-size: 17pt; line-height: 1.15; letter-spacing: -.01em; }}
.lead {{ font-size: 11pt; color: #3a3552; max-width: 165mm; }}
.foot {{ position: absolute; left: 15mm; right: 15mm; bottom: 9mm; display: flex; justify-content: space-between; font-size: 7.5pt; color: #8A86A0; }}
/* workflow */
.flow {{ display: flex; align-items: stretch; gap: 0; margin-top: 7mm; }}
.node {{ flex: 1; display: flex; flex-direction: column; align-items: center; text-align: center; }}
.thumb {{ width: 27mm; height: 33.75mm; border-radius: 3mm; overflow: hidden; box-shadow: 0 3mm 7mm rgba(40,20,110,.22); border: .6mm solid #fff; background: #EEE; }}
.thumb img {{ width: 100%; height: 100%; object-fit: cover; display: block; }}
.badge {{ margin-top: -4mm; display: inline-flex; align-items: center; gap: 1.5mm; padding: 1.2mm 3mm; border-radius: 99px; color: #fff; font-weight: 700; font-size: 7.5pt; position: relative; }}
.v {{ background: #6D4AE8; }} .c {{ background: #1F9D6B; }} .i {{ background: #E89D15; }}
.dlab {{ font-family: Jakarta; font-weight: 800; font-size: 11pt; margin-top: 2.5mm; }}
.role {{ font-size: 8.5pt; color: #5a5472; line-height: 1.3; margin-top: .8mm; padding: 0 1mm; }}
.arrow {{ width: 6mm; display: flex; align-items: center; justify-content: center; padding-bottom: 14mm; }}
.band {{ display: flex; margin-top: 5mm; border-radius: 3mm; overflow: hidden; font-weight: 700; font-size: 8pt; text-align: center; }}
.band div {{ flex: 1; padding: 2.4mm 1mm; color: #fff; }}
.legend {{ display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 4mm; margin-top: 5mm; font-size: 8.6pt; line-height: 1.4; }}
.lg {{ border: .3mm solid #E4DBFF; border-radius: 3mm; padding: 3mm 3.5mm; background: #FBFAFF; }}
.lg b {{ font-family: Jakarta; display: block; font-size: 10.5pt; margin-bottom: 1mm; }}
table {{ width: 100%; border-collapse: collapse; margin-top: 5mm; font-size: 8.6pt; line-height: 1.4; }}
th {{ text-align: left; color: #6D4AE8; font-size: 7.5pt; letter-spacing: .1em; text-transform: uppercase; border-bottom: .5mm solid #6D4AE8; padding: 2mm; }}
td {{ padding: 1.8mm 2mm; border-bottom: .3mm solid #ECE8FA; vertical-align: top; }}
td a {{ color: #1D4ED8; text-decoration: none; }}
/* day pages */
.dayhead {{ display: flex; align-items: center; gap: 4mm; }}
.dnum {{ font-family: Jakarta; font-weight: 800; font-size: 11pt; color: #fff; background: #16132B; border-radius: 2.5mm; padding: 1.6mm 4mm; }}
.grid {{ display: flex; gap: 8mm; margin-top: 7mm; }}
.big {{ width: 62mm; flex: none; }}
.big .thumb {{ width: 62mm; height: 77.5mm; }}
.facts {{ flex: 1; }}
.fact {{ margin-bottom: 4.5mm; }}
.fact .k {{ font-size: 7.5pt; margin-bottom: .8mm; }}
.btn {{ display: inline-block; padding: 2mm 4mm; border-radius: 99px; background: #6D4AE8; color: #fff; font-weight: 700; font-size: 8.5pt; text-decoration: none; }}
.url {{ font-size: 7pt; color: #8A86A0; word-break: break-all; margin-top: 1.5mm; }}
.cap {{ margin-top: 7mm; border-radius: 3mm; background: #F6F3FF; border-left: 1mm solid #6D4AE8; padding: 5mm 6mm; font-size: 10pt; line-height: 1.55; white-space: pre-wrap; }}
.tags {{ margin-top: 3.5mm; display: flex; flex-wrap: wrap; gap: 2mm; }}
.tag {{ padding: 1.2mm 3mm; border-radius: 99px; background: #EFEAFF; color: #4B2BB8; font-weight: 700; font-size: 8pt; }}
.alt {{ margin-top: 5mm; font-size: 8.5pt; color: #5a5472; }}
'''
FMT = {'Video': 'v', 'Carousel': 'c', 'Image': 'i'}
ARROW = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#B9A9F5" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>'


def foot(n, total):
    return f'<div class="foot"><span>Tooth Referral · Week 1 launch schedule</span><span>{n} / {total}</span></div>'


def cover(total):
    nodes = []
    for i, d in enumerate(DAYS):
        nodes.append(f'''<div class="node"><div class="thumb"><img src="{IMG(d['img'])}" style="object-position:{'50% 0%' if d['day']=='Day 1' else '50% 50%'}"></div>
<span class="badge {FMT[d['fmt']]}">{ico(d['fmt'], s=11)} {d['fmt']}</span><div class="dlab">{d['day']}</div><div class="role">{E(d['role'])}</div></div>''')
        if i < len(DAYS) - 1:
            nodes.append(f'<div class="arrow">{ARROW}</div>')
    rows = ''.join(f'''<tr><td><b>{d['day']}</b></td><td>{d['fmt']}<br><span style="color:#8A86A0">{E(d['length'])}</span></td><td><b>{E(d['title'])}</b><br><span style="color:#5a5472">{E(d['msg'])}</span></td>
<td>{f'<a href="{d["link"]}">Open in Drive</a>' if d['link'] else 'Attached (Day 5 PDF)'}</td></tr>''' for d in DAYS)
    return f'''<div class="page"><div class="top"><img src="{LOGO}"><span>Week 1 launch schedule</span></div>
<div class="k">Brand awareness · LinkedIn · 5 posts</div>
<h1>One referral, one case,<br>and the whole team on it.</h1>
<div class="lead">Week 1 opens on a problem every dental office recognises: referrals lost between emails, voicemails and faxes. Each day then adds one piece, alternating the story videos with a single feature, and Friday sums the week up in one line.</div>
<div class="flow">{''.join(nodes)}</div>
<div class="band"><div style="background:#6D4AE8">Story</div><div style="background:#1F9D6B">Feature</div><div style="background:#6D4AE8">Story</div><div style="background:#1F9D6B">Feature</div><div style="background:#E89D15">Summary</div></div>
<table><tr><th style="width:12%">Day</th><th style="width:16%">Format</th><th>Post and intended message</th><th style="width:16%">File</th></tr>{rows}</table>
<div class="legend">
<div class="lg"><b>Audience</b>Front desks and office managers, at both referring and receiving offices.</div>
<div class="lg"><b>One message per post</b>Each post carries one idea, so the week builds day by day.</div>
<div class="lg"><b>How to post</b>Videos as native uploads, carousels as PDF documents, Day 5 as an image.</div>
</div>{foot(1, total)}</div>'''


def day_page(d, n, total):
    c = CAP[d['day']]
    tags = ''.join(f'<span class="tag">{E(t)}</span>' for t in c[3].split())
    link = (f'<a class="btn" href="{d["link"]}">Open in Google Drive</a><div class="url">{E(d["link"])}</div>' if d['link']
            else '<span class="btn" style="background:#E89D15">Attached: Day-5-Image-Post.pdf</span>')
    return f'''<div class="page"><div class="top"><img src="{LOGO}"><span>Week 1 · {d['day']}</span></div>
<div class="dayhead"><span class="dnum">{d['day']}</span><span class="badge {FMT[d['fmt']]}" style="margin:0">{ico(d['fmt'], s=11)} {d['fmt']}</span><span class="k" style="margin-left:auto">{E(d['role'])}</span></div>
<h2 style="margin-top:4mm">{E(d['title'])}</h2>
<div class="grid"><div class="big"><div class="thumb"><img src="{IMG(d['img'])}" style="object-position:{'50% 0%' if d['day']=='Day 1' else '50% 50%'}"></div></div>
<div class="facts">
<div class="fact"><div class="k">File</div>{link}</div>
<div class="fact"><div class="k">Length</div>{E(d['length'])}</div>
<div class="fact"><div class="k">Intended message</div>{E(d['msg'])}</div>
<div class="fact"><div class="k">Goal</div>{E(d['goal'])}</div>
</div></div>
<div class="k" style="margin-top:7mm">Caption</div>
<div class="cap" style="margin-top:2mm">{E(c[2])}</div>
<div class="tags">{tags}</div>
{f'<div class="alt"><b>Alt text:</b> {E(ALT5)}</div>' if d['day'] == 'Day 5' else ''}
{foot(n, total)}</div>'''


def render(pages, out):
    doc = os.path.join(HERE, '_tmp.html'); js = os.path.join(HERE, '_tmp.cjs')
    open(doc, 'w').write(f'<html><head><meta charset="utf-8"><style>{CSS}</style></head><body>{"".join(pages)}</body></html>')
    open(js, 'w').write(f'''const {{ chromium }} = require('playwright');
(async () => {{ const b = await chromium.launch(); const p = await b.newPage(); await p.goto('file://{doc}');
await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(300); await p.pdf({{ path: '{out}', format: 'A4', printBackground: true }}); await b.close(); }})();''')
    subprocess.run(['node', js], check=True)
    os.remove(doc); os.remove(js)
    print(out)


total = 1 + len(DAYS)
render([cover(total)] + [day_page(d, i + 2, total) for i, d in enumerate(DAYS)], os.path.join(HERE, 'ToothReferral-Week-1-Schedule.pdf'))

# Day 5 image post on its own: the image, then caption, hashtags and alt text
d5 = DAYS[4]; c5 = CAP['Day 5']
p1 = f'''<div class="page" style="padding:14mm"><div class="top"><img src="{LOGO}"><span>Day 5 · Image post</span></div>
<div style="display:flex;justify-content:center"><div style="width:150mm;border-radius:4mm;overflow:hidden;box-shadow:0 4mm 10mm rgba(40,20,110,.25)"><img src="{IMG('day5.png')}" style="width:100%;display:block"></div></div>
<div style="text-align:center;margin-top:6mm;color:#8A86A0;font-size:8.5pt">1080 x 1350 · upload as an image</div>{foot(1, 2).replace('Week 1 launch schedule', 'Day 5 image post')}</div>'''
tags = ''.join(f'<span class="tag">{E(t)}</span>' for t in c5[3].split())
p2 = f'''<div class="page"><div class="top"><img src="{LOGO}"><span>Day 5 · Caption</span></div>
<div class="k">LinkedIn caption</div><h2 style="margin-top:2mm">{E(d5['title'])}</h2>
<div class="cap">{E(c5[2])}</div><div class="tags">{tags}</div>
<div class="alt"><b>Alt text:</b> {E(ALT5)}</div>{foot(2, 2).replace('Week 1 launch schedule', 'Day 5 image post')}</div>'''
render([p1, p2], os.path.join(HERE, 'Day-5-Image-Post.pdf'))
