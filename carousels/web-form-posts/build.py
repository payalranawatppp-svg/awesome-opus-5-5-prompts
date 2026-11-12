"""Social posts for the three web-form videos: three carousels (1080x1350) and two single-image posts, with
captions, keywords and hashtags, all in one PDF (Web-Form-Posts-Carousels-and-Captions.pdf).

  Carousel 1  "Same patient, two endings"     -> renders/camp-form-vs-software.mp4
  Carousel 2  "What a referral form should do" -> renders/camp-form-compare-v2.mp4
  Carousel 3  "One referral, eight days"       -> renders/camp-same-referral-two-ways.mp4
  Post 4      quote card: a web form sends an email
  Post 5      checklist: 5 questions to ask your referral form

Client rules kept: no competitor names or screens, no doctor names, "general dentist" (never GP), no red in our
graphics, staff names only from the approved list, front desks treated with respect. Every product claim matches the
sourced compare sheet (carousels/vejay-brief/Referral-Form-Compare-Sheet-...pdf); analytics numbers come from the
canonical analytics reference (reel/public/analytics-ref). Demo data is fictional."""
import os, subprocess, html, json
HERE = os.path.dirname(os.path.abspath(__file__))
PUB = '/home/user/awesome-opus-5-5-prompts/reel/public'
F = lambda p: 'file://' + os.path.join(PUB, p)
E = html.escape

CSS = f'''
@font-face {{ font-family: Jakarta; src: url({F("fonts/plus-jakarta-sans-latin-800-normal.woff2")}); font-weight: 800; }}
@font-face {{ font-family: Jakarta; src: url({F("fonts/plus-jakarta-sans-latin-700-normal.woff2")}); font-weight: 700; }}
@font-face {{ font-family: InterW; src: url({F("fonts/inter-latin-500-normal.woff2")}); font-weight: 500; }}
@font-face {{ font-family: InterW; src: url({F("fonts/inter-latin-700-normal.woff2")}); font-weight: 700; }}
* {{ box-sizing: border-box; margin: 0; }}
body {{ width: 1080px; height: 1350px; overflow: hidden; font-family: InterW, Inter, sans-serif; color: #16132B;
  background: linear-gradient(170deg, #FBFAFF 0%, #EFEAFF 62%, #E4DBFF 100%); position: relative; }}
body.dark {{ background: linear-gradient(165deg, #1B1240 0%, #2A1A6B 60%, #3B1E8F 100%); color: #fff; }}
.dots {{ position: absolute; inset: 0; background-image: radial-gradient(rgba(109,74,232,0.10) 1.5px, transparent 1.6px); background-size: 36px 36px; }}
.dark .dots {{ background-image: radial-gradient(rgba(255,255,255,0.07) 1.5px, transparent 1.6px); }}
.top {{ position: absolute; top: 56px; left: 72px; right: 72px; display: flex; justify-content: space-between; align-items: center; }}
.top img {{ height: 64px; }}
.dark .top img {{ filter: brightness(0) invert(1); }}
.pg {{ font-weight: 700; color: #6D4AE8; font-size: 24px; letter-spacing: .12em; }}
.dark .pg, .dark .k, .dark .foot {{ color: #C9B8FF; }}
.k {{ font-weight: 700; color: #6D4AE8; font-size: 28px; letter-spacing: .14em; text-transform: uppercase; }}
h1 {{ font-family: Jakarta; font-weight: 800; font-size: 86px; line-height: 1.02; letter-spacing: -.035em; margin-top: 14px; }}
h2 {{ font-family: Jakarta; font-weight: 800; font-size: 62px; line-height: 1.05; letter-spacing: -.03em; margin-top: 12px; }}
.p {{ font-size: 32px; line-height: 1.4; color: #3a3552; margin-top: 22px; }}
.dark .p {{ color: #E3DBFF; }}
.main {{ position: absolute; top: 170px; left: 72px; right: 72px; }}
.card {{ border-radius: 28px; overflow: hidden; background: #fff; box-shadow: 0 34px 80px rgba(40,20,110,.25); border: 1.5px solid rgba(109,74,232,.18); position: relative; }}
.chips {{ display: flex; flex-wrap: wrap; gap: 14px; margin-top: 26px; }}
.chip {{ padding: 12px 26px; border-radius: 999px; color: #fff; font-weight: 700; font-size: 30px; }}
.pu {{ background: #6D4AE8; }} .gr {{ background: #1F9D6B; }} .am {{ background: #E89D15; }} .ink {{ background: #16132B; }}
.li {{ display: flex; gap: 18px; font-size: 34px; line-height: 1.32; margin-top: 26px; }}
.li b.n {{ color: #6D4AE8; font-family: Jakarta; font-size: 40px; width: 50px; flex: none; }}
.foot {{ position: absolute; bottom: 52px; left: 72px; right: 72px; display: flex; justify-content: space-between; font-size: 24px; color: #6D4AE8; font-weight: 700; }}
.cta {{ display: inline-block; margin-top: 34px; padding: 22px 44px; border-radius: 999px; background: #6D4AE8; color: #fff; font-weight: 700; font-size: 36px; }}
.split {{ display: flex; gap: 24px; margin-top: 34px; }}
.col {{ flex: 1; border-radius: 26px; padding: 28px; background: #fff; box-shadow: 0 20px 50px rgba(40,20,110,.16); }}
.col h3 {{ font-family: Jakarta; font-size: 40px; margin-bottom: 14px; }}
.col.form h3 {{ color: #8A7A63; }} .col.tr h3 {{ color: #6D4AE8; }}
.row {{ display: flex; gap: 14px; font-size: 32px; line-height: 1.3; padding: 12px 0; border-bottom: 1.5px solid rgba(109,74,232,.10); }}
.row:last-child {{ border-bottom: none; }}
.dotA {{ width: 16px; height: 16px; border-radius: 16px; background: #E89D15; flex: none; margin-top: 9px; }}
.dotG {{ width: 16px; height: 16px; border-radius: 16px; background: #1F9D6B; flex: none; margin-top: 9px; }}
.tl {{ margin-top: 30px; }}
.ti {{ display: flex; gap: 26px; padding: 18px 0; }}
.ti .t {{ width: 210px; flex: none; font-family: Jakarta; font-weight: 800; font-size: 34px; color: #6D4AE8; }}
.ti .d {{ font-size: 31px; line-height: 1.35; }}
.big {{ font-family: Jakarta; font-weight: 800; letter-spacing: -.05em; line-height: .95; color: #6D4AE8; }}
.q {{ font-family: Jakarta; font-weight: 800; font-size: 96px; line-height: 1.04; letter-spacing: -.035em; }}
.q span {{ color: #C9B8FF; }}
'''

IMG = {'camp/mock.png': (2004, 1600), 'camp/mail.png': (2000, 1600), 'camp/tr-embed-form.jpg': (920, 1060),
       'camp/tr-chart.jpg': (920, 1050), 'camp/tr-insurance.jpg': (980, 680), 'camp/tr-uploads.jpg': (920, 640),
       'dash3c/r3c-incoming.jpg': (1920, 912), 'dash3c/r3c-activity-log.jpg': (1920, 912), 'dash3c/r3c-messages.jpg': (1920, 912),
       'dash3c/r3c-status-xrays.jpg': (1920, 912), 'dash3c/r3c-admin-notes.jpg': (1920, 912), 'dash3c/r3c-insurance.jpg': (1920, 912), 'dash2c/cs-07-signed-success.jpg': (1904, 868), 'analytics-ref/01-header-kpis.png': (1920, 640)}


def crop(img, x, y, w, h, out_w, out_h):
    s = out_w / w
    return f'<div class="card" style="width:{out_w}px;height:{out_h}px"><img src="{F(img)}" style="position:absolute;left:{-x * s}px;top:{-y * s}px;width:{IMG[img][0] * s}px;max-width:none"></div>'


def slide(body, n, total, tag, dark=False):
    foot_r = 'Swipe →' if n < total else 'Set up in about 5 minutes'
    if total == 1: foot_r = 'Set up in about 5 minutes'
    pg = f'{tag} · {n}/{total}' if total > 1 else tag
    return f'''<html><head><meta charset="utf-8"><style>{CSS}</style></head><body class="{'dark' if dark else ''}"><div class="dots"></div>
<div class="top"><img src="{F('tr/logo.png')}"><span class="pg">{pg}</span></div>
<div class="main">{body}</div><div class="foot"><span>toothreferral.com</span><span>{foot_r}</span></div></body></html>'''


# ---------------------------------------------------------------------------------------------------------------
# v2 (Vejay, 2026-11-11): one clear message per post. Not just a form: a system for the team.
# No "shared inbox", no contact page. Web form vs system said plainly. Direct cloud messages, the whole team, notes.

# Carousel 1: A web form submits. A system keeps working.
C1 = [
 '''<div class="k">For dental specialists</div><h1>A web form submits. A system keeps working.</h1>
<div class="p">They look alike on your website. What happens after a dentist hits Submit is completely different.</div>
<div class="split" style="margin-top:60px">
 <div class="col form"><h3>A web form</h3><div class="row"><span class="dotA"></span>Collects the details once</div><div class="row"><span class="dotA"></span>Sends an email</div><div class="row"><span class="dotA"></span>Stops there</div></div>
 <div class="col tr"><h3>A referral system</h3><div class="row"><span class="dotG"></span>Opens a case</div><div class="row"><span class="dotG"></span>Keeps everything on it</div><div class="row"><span class="dotG"></span>Brings in the whole team</div></div>
</div>''',
 f'''<div class="k">The web form</div><h2>Its job ends at "Submit".</h2>
<div class="p">The referral becomes an email in someone's inbox. Finding it, forwarding it, calling back and keeping track all depend on one person remembering.</div>
<div style="margin-top:34px">{crop('camp/mock.png', 0, 0, 2004, 1300, 936, 607)}</div>''',
 f'''<div class="k">The system</div><h2>Every referral becomes one case.</h2>
<div class="p">The details, X-rays, insurance, messages, status and notes stay together, from the first click to the signed note.</div>
<div style="margin-top:34px">{crop('dash3c/r3c-incoming.jpg', 360, 150, 1500, 700, 936, 437)}</div>''',
 f'''<div class="k">Direct communication</div><h2>Talk to the referring office on the case.</h2>
<div class="p">Secure cloud messages between both offices, right on the referral. No phone tag, no voicemail, no email chain.</div>
<div style="margin-top:30px">{crop('dash3c/r3c-messages.jpg', 690, 220, 1100, 520, 936, 442)}</div>''',
 f'''<div class="k">Notes your team actually uses</div><h2>Build notes, use templates, copy them into your electronic health record.</h2>
<div class="p">Staff write notes on the case, start from custom templates, and copy and paste them straight into your own electronic health record. Administrative notes stay private to your team.</div>
<div style="margin-top:30px;display:flex;justify-content:center">{crop('dash3c/r3c-insurance.jpg', 1385, 290, 480, 520, 520, 563)}</div>''',
 '''<div class="k">The difference</div><h1>It's not just a form. It's a system for your team.</h1>
<div class="p">One case per referral, direct messages with the referring office, and every team member working from the same information.</div>
<span class="cta">Set up in about 5 minutes</span>''',
]

# Carousel 2: One referral, the whole team (the journey and the value to each team member)
C2 = [
 '''<div class="k">One referral, the whole team</div><h1>Who touches a referral in your office?</h1>
<div class="p">More people than you think. When all of them work from one system, every one of them gets time back.</div>
<div class="chips" style="margin-top:50px"><span class="chip pu">Front desk</span><span class="chip pu">Office manager</span><span class="chip pu">Assistant</span><span class="chip pu">Specialist</span><span class="chip gr">The referring office</span></div>''',
 f'''<div class="k">The referring office</div><h2>Sends it once, complete.</h2>
<div class="p">Procedure, tooth, X-rays and the patient's insurance through a secure link, in three short steps. Then they can see where it stands without calling.</div>
<div style="margin-top:30px">{crop('camp/tr-embed-form.jpg', 0, 0, 920, 600, 936, 610)}</div>''',
 f'''<div class="k">The front desk</div><h2>Every new referral in one list.</h2>
<div class="p">No hunting through emails, voicemails and faxes. Status, received time and the sending office on every row.</div>
<div style="margin-top:30px">{crop('dash3c/r3c-incoming.jpg', 360, 150, 1500, 700, 936, 437)}</div>''',
 f'''<div class="k">The office manager</div><h2>Who did what, and when.</h2>
<div class="p">Every step is logged on the case. If someone is out, anyone can pick it up and see exactly where it stands.</div>
<div style="margin-top:30px">{crop('dash3c/r3c-activity-log.jpg', 380, 0, 920, 520, 936, 529)}</div>''',
 f'''<div class="k">The assistant</div><h2>The X-rays are already on the case.</h2>
<div class="p">Need a newer image? Ask the referring office in a message on the case and it arrives the same day.</div>
<div style="margin-top:30px">{crop('dash3c/r3c-status-xrays.jpg', 385, 440, 910, 440, 936, 453)}</div>''',
 f'''<div class="k">The specialist</div><h2>Notes, templates and a signed note back.</h2>
<div class="p">Build notes from your own templates, copy them into your electronic health record, and send the signed completion note to the referring dentist from the case.</div>
<div style="margin-top:30px;display:flex;justify-content:center">{crop('dash3c/r3c-admin-notes.jpg', 1385, 480, 490, 430, 600, 527)}</div>''',
 '''<div class="k">The result</div><h1>When everyone sees the value, everyone works better.</h1>
<div class="p">One referral system for the whole team, instead of one web form and a lot of follow-up.</div>
<span class="cta">Set up in about 5 minutes</span>''',
]

# Carousel 3: Direct communication (cloud messages instead of phone tag)
C3 = [
 '''<div class="k">Direct communication</div><h1>"Do you have a newer X-ray?"</h1>
<div class="p">One small question between two offices. Here's how long it takes each way.</div>
<div class="big" style="font-size:200px;margin-top:60px">?</div>''',
 '''<div class="k">Without a system</div><h2>A call, a voicemail, a callback.</h2>
<div class="tl">
 <div class="ti"><span class="t">11:20 am</span><span class="d">Your front desk calls the referring office. Nobody picks up.</span></div>
 <div class="ti"><span class="t">11:22 am</span><span class="d">A voicemail. Then an email to someone's inbox.</span></div>
 <div class="ti"><span class="t">Next day</span><span class="d">A callback while you're with a patient. The X-ray still isn't here.</span></div>
</div>''',
 f'''<div class="k">With Tooth Referral</div><h2>A message on the case.</h2>
<div class="p">Amanda asks right on the referral. Greg at the referring office uploads a current X-ray that afternoon and replies in the same thread.</div>
<div style="margin-top:30px">{crop('dash3c/r3c-messages.jpg', 690, 220, 1100, 520, 936, 442)}</div>''',
 f'''<div class="k">Secure cloud messages</div><h2>Both offices, one conversation, on the case.</h2>
<div class="li"><b class="n">✓</b><span>HIPAA compliant and encrypted</span></div>
<div class="li"><b class="n">✓</b><span>@mention the right person on either team</span></div>
<div class="li"><b class="n">✓</b><span>Every message stays with the patient's referral</span></div>
<div class="li"><b class="n">✓</b><span>The referring office sees each status update</span></div>''',
 f'''<div class="k">Inside your own team</div><h2>Notes that never leave your office.</h2>
<div class="p">Administrative notes are private to your team. @mention a colleague instead of walking over or leaving a sticky note.</div>
<div style="margin-top:30px;display:flex;justify-content:center">{crop('dash3c/r3c-insurance.jpg', 1385, 290, 480, 520, 520, 563)}</div>''',
 '''<div class="k">Operational efficiency</div><h1>Less phone tag. More time for patients.</h1>
<div class="p">When both offices and every team member talk on the case, referrals move faster and nobody has to chase them.</div>
<span class="cta">Set up in about 5 minutes</span>''',
]

# Single-image posts
P4 = ['''<div style="margin-top:150px" class="q">It's not just a form.<br><span>It's a system for your team.</span></div>
<div class="p" style="margin-top:60px;font-size:36px">One case per referral. Direct messages with the referring office. Notes, templates and a signed note back. Every team member on the same page.</div>''']

P5 = ['''<div class="k">Web form or system?</div><h1 style="font-size:76px">5 questions to ask about your referrals</h1>
<div class="li"><b class="n">1</b><span>Does each referral become <b>one case</b>, or one more email?</span></div>
<div class="li"><b class="n">2</b><span>Can you <b>message the referring office</b> right on the referral?</span></div>
<div class="li"><b class="n">3</b><span>Can <b>anyone on your team</b> pick it up and see where it stands?</span></div>
<div class="li"><b class="n">4</b><span>Can staff <b>build notes from templates</b> and copy them into your electronic health record?</span></div>
<div class="li"><b class="n">5</b><span>Does a <b>signed completion note</b> go back when treatment is done?</span></div>
<div class="p" style="margin-top:44px;color:#16132B"><b>Mostly no? You have a web form, not a referral system.</b></div>''']

POSTS = [
 dict(id='carousel-1-web-form-vs-system', kind='Carousel · 6 slides', title='A web form submits. A system keeps working.', video='Buried in Emails v2 / Form vs Software', tag='FORM VS SYSTEM', slides=C1),
 dict(id='carousel-2-the-whole-team', kind='Carousel · 7 slides', title='One referral, the whole team', video='Buried in Emails v2', tag='THE WHOLE TEAM', slides=C2),
 dict(id='carousel-3-direct-communication', kind='Carousel · 6 slides', title='Direct communication on the case', video='Same Referral, Two Ways', tag='DIRECT COMMUNICATION', slides=C3),
 dict(id='post-4-a-system-for-your-team', kind='Single image', title="It's not just a form. It's a system for your team.", video='all', tag='TOOTH REFERRAL', slides=P4, dark=True),
 dict(id='post-5-web-form-or-system', kind='Single image', title='Web form or system? 5 questions', video='all', tag='CHECKLIST', slides=P5),
]

CAP = json.load(open(os.path.join(HERE, 'captions.json')))


def render():
    out = os.path.join(HERE, 'slides'); os.makedirs(out, exist_ok=True)
    jobs = []
    for p in POSTS:
        d = os.path.join(out, p['id']); os.makedirs(d, exist_ok=True)
        for i, b in enumerate(p['slides'], 1):
            h = os.path.join(d, f'{i:02d}.html')
            open(h, 'w').write(slide(b, i, len(p['slides']), p['tag'], p.get('dark', False)))
            jobs.append(h)
    js = f'''const {{ chromium }} = require('playwright');
(async () => {{ const b = await chromium.launch(); const pg = await b.newPage({{ viewport: {{ width: 1080, height: 1350 }} }});
for (const p of {jobs!r}) {{ await pg.goto('file://' + p); await pg.evaluate(() => document.fonts.ready); await pg.waitForTimeout(250);
  await pg.screenshot({{ path: p.replace('.html', '.png') }}); }}
await b.close(); }})();'''
    open(os.path.join(out, 'shot.cjs'), 'w').write(js)
    subprocess.run(['node', os.path.join(out, 'shot.cjs')], check=True)
    for h in jobs: os.remove(h)
    os.remove(os.path.join(out, 'shot.cjs'))


def pdf():
    css = '''@page { size: A4; margin: 16mm 14mm; }
body { font-family: InterW, Inter, sans-serif; color: #16132B; font-size: 10.5pt; line-height: 1.5; }
@font-face { font-family: Jakarta; src: url(%s); font-weight: 800; }
@font-face { font-family: InterW; src: url(%s); font-weight: 500; }
@font-face { font-family: InterW; src: url(%s); font-weight: 700; }
h1 { font-family: Jakarta; font-size: 26pt; letter-spacing: -.02em; margin: 0 0 4mm; }
h2 { font-family: Jakarta; font-size: 17pt; margin: 0 0 1mm; }
.meta { color: #6D4AE8; font-weight: 700; font-size: 9pt; letter-spacing: .1em; text-transform: uppercase; }
.post { page-break-before: always; }
.grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 3mm; margin: 4mm 0 5mm; }
.grid.one { grid-template-columns: 70mm; }
.grid img { width: 100%%; border-radius: 2mm; box-shadow: 0 1mm 3mm rgba(40,20,110,.2); }
.box { border: 1px solid #E4DBFF; border-radius: 3mm; padding: 4mm 5mm; margin-bottom: 4mm; background: #FBFAFF; page-break-inside: avoid; }
.box h3 { font-family: Jakarta; font-size: 11pt; margin: 0 0 2mm; color: #6D4AE8; }
.cap { white-space: pre-wrap; }
.tags { color: #3B1E8F; font-weight: 700; }
.kw span { display: inline-block; background: #EFEAFF; color: #3B1E8F; border-radius: 9pt; padding: .5mm 2.5mm; margin: 0 1.5mm 1.5mm 0; font-size: 9pt; }
.full { page-break-before: always; text-align: center; }
.full img { height: 245mm; border-radius: 3mm; }
.small { color: #6B7085; font-size: 9pt; }
ul { margin: 2mm 0; padding-left: 5mm; }
''' % (F('fonts/plus-jakarta-sans-latin-800-normal.woff2'), F('fonts/inter-latin-500-normal.woff2'), F('fonts/inter-latin-700-normal.woff2'))
    parts = [f'''<div><div class="meta">Tooth Referral · social posts</div><h1>Not just a form: a system for your team · LinkedIn posts (3 carousels + 2 images)</h1>
<p>LinkedIn posts to run alongside the three web-form videos. Each post has the slides, the LinkedIn caption (with the hook first), hashtags and trending keywords. Slides are 1080 × 1350 (4:5); the PNG files are in <b>carousels/web-form-posts/slides/</b>.</p>
<div class="box"><h3>How to post</h3><ul>
<li>Upload the carousel as a <b>document</b> (the slides-only PDF) so it swipes in the feed; single images upload as images.</li>
<li>Paste the caption as written and keep the 3 to 5 hashtags at the end.</li>
<li>Put one or two of the trending keywords in the first comment, and reply to comments in the first hour.</li>
<li><b>Pair with the video:</b> post the carousel 2 to 3 days after its video, or pin the video in the comments.</li>
<li>Best windows for dental audiences: Tuesday to Thursday, 7 to 9 am or 12 to 1 pm local time.</li></ul></div>
<div class="box"><h3>The posts</h3><ul>''' + ''.join(f'<li><b>{E(p["title"])}</b> · {E(p["kind"])} · pairs with {E(p["video"])}</li>' for p in POSTS) + '''</ul>
<p class="small">Claims match the sourced compare sheet; analytics numbers come from the canonical analytics reference. Offices, patients and staff in the examples are fictional. No competitors are named or shown.</p></div></div>''']
    for i, p in enumerate(POSTS, 1):
        c = CAP[p['id']]
        d = os.path.join(HERE, 'slides', p['id'])
        imgs = ''.join(f'<img src="file://{os.path.join(d, f"{k:02d}.png")}">' for k in range(1, len(p['slides']) + 1))
        parts.append(f'''<div class="post"><div class="meta">Post {i} · {E(p["kind"])} · pairs with {E(p["video"])}</div><h2>{E(p["title"])}</h2>
<div class="grid {'one' if len(p['slides']) == 1 else ''}">{imgs}</div>
<div class="box"><h3>Hook (first line)</h3><div class="cap"><b>{E(c["hook"])}</b></div></div>
<div class="box"><h3>Caption</h3><div class="cap">{E(c["linkedin"])}</div><p class="tags">{E(" ".join(c["hashtags_linkedin"]))}</p></div>
<div class="box kw"><h3>Trending keywords (use in alt text and the first comment)</h3>{''.join(f"<span>{E(k)}</span>" for k in c["keywords"])}
<p class="small"><b>Alt text:</b> {E(c["alt"])}</p></div></div>''')
        for k in range(1, len(p['slides']) + 1):
            parts.append(f'<div class="full"><div class="meta">Post {i} · slide {k} of {len(p["slides"])}</div><img src="file://{os.path.join(d, f"{k:02d}.png")}"></div>')
    doc = os.path.join(HERE, 'doc.html')
    open(doc, 'w').write(f'<html><head><meta charset="utf-8"><style>{css}</style></head><body>{"".join(parts)}</body></html>')
    js = f'''const {{ chromium }} = require('playwright');
(async () => {{ const b = await chromium.launch(); const pg = await b.newPage();
await pg.goto('file://{doc}'); await pg.evaluate(() => document.fonts.ready); await pg.waitForTimeout(500);
await pg.pdf({{ path: '{os.path.join(HERE, "Web-Form-Posts-Carousels-and-Captions.pdf")}', format: 'A4', printBackground: true }});
await b.close(); }})();'''
    open(os.path.join(HERE, 'pdf.cjs'), 'w').write(js)
    subprocess.run(['node', os.path.join(HERE, 'pdf.cjs')], check=True)
    os.remove(doc); os.remove(os.path.join(HERE, 'pdf.cjs'))


if __name__ == '__main__':
    render()
    pdf()
    print('ok')
