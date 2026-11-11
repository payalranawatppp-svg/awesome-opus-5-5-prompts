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
       'dash3c/r3c-status-xrays.jpg': (1920, 912), 'dash2c/cs-07-signed-success.jpg': (1904, 868), 'analytics-ref/01-header-kpis.png': (1920, 640)}


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
# Carousel 1: Same patient, two endings  (video: Form vs Software)

C1 = [
 '''<div class="k">For dental specialists</div><h1>Same patient. Same referral. Two very different endings.</h1>
<div class="p">What happens after a general dentist hits Submit depends on what's behind your website.</div>
<div class="split" style="margin-top:60px">
 <div class="col form"><h3>A web form</h3><div class="row"><span class="dotA"></span>Turns into an email</div><div class="row"><span class="dotA"></span>Sits in a shared inbox</div><div class="row"><span class="dotA"></span>Nobody knows what's next</div></div>
 <div class="col tr"><h3>Tooth Referral</h3><div class="row"><span class="dotG"></span>Lands as a case</div><div class="row"><span class="dotG"></span>X-rays and insurance attached</div><div class="row"><span class="dotG"></span>Every step logged</div></div>
</div>''',
 f'''<div class="k">Ending one · the web form</div><h2>You hit Submit. It becomes an email.</h2>
<div class="p">One more message in an inbox, between supply orders and voicemails.</div>
<div style="margin-top:34px">{crop('camp/mail.png', 0, 0, 2000, 1100, 936, 515)}</div>
<div class="chips"><span class="chip am">No confirmation</span><span class="chip am">No status</span></div>''',
 '''<div class="k">The question nobody can answer</div><h1>Did anyone call the patient?</h1>
<div class="p">The referring office doesn't know. The specialist's team may not know either. So someone picks up the phone and asks.</div>
<div class="big" style="font-size:300px;margin-top:60px">?</div>''',
 f'''<div class="k">Ending two · Tooth Referral</div><h2>The referral lands as a case.</h2>
<div class="p">X-rays and insurance arrive with it, and the specialist's team sees it right away.</div>
<div style="margin-top:34px">{crop('dash3c/r3c-incoming.jpg', 360, 150, 1500, 700, 936, 437)}</div>''',
 f'''<div class="k">Every step, logged</div><h2>Received. Contacted. Consultation scheduled.</h2>
<div style="margin-top:34px">{crop('dash3c/r3c-activity-log.jpg', 380, 0, 920, 520, 936, 529)}</div>
<div class="p">Who did it and when, on one shared timeline.</div>''',
 f'''<div class="k">Both offices, one case</div><h2>The general dentist sees every update.</h2>
<div class="p">They can message the specialist right on the case. When treatment is done, a signed completion note goes back automatically.</div>
<div style="margin-top:30px">{crop('dash3c/r3c-messages.jpg', 690, 220, 1100, 520, 936, 442)}</div>''',
 '''<div class="k">The difference</div><h1>A web form sends an email. Tooth Referral starts a tracked, shared case.</h1>
<div class="p">It takes about five minutes to set up.</div>
<span class="cta">Set up in about 5 minutes</span>''',
]

# ---------------------------------------------------------------------------------------------------------------
# Carousel 2: What a referral form should do  (video: Form vs Form v2)

C2 = [
 f'''<div class="k">Specialist websites</div><h1>Most referral forms look the same.</h1>
<div class="p">A long page of boxes, a Submit button, and an email nobody tracks. Some even ask for a Social Security number.</div>
<div style="margin-top:40px">{crop('camp/mock.png', 0, 0, 2004, 1300, 936, 607)}</div>''',
 '''<div class="k">1 · Secure</div><h2>Built for patient information.</h2>
<div class="li"><b class="n">✓</b><span>Every referral and every message is <b>HIPAA compliant and encrypted</b>.</span></div>
<div class="li"><b class="n">✓</b><span><b>Spam and bots are filtered out</b>, so your team only sees real referrals.</span></div>
<div class="li"><b class="n">✓</b><span>No Social Security numbers on a public web page.</span></div>
<div class="big" style="font-size:210px;margin-top:70px">HIPAA</div>''',
 f'''<div class="k">2 · Yours</div><h2>It looks like your practice, not ours.</h2>
<div class="p">On your own website: your logo, your locations, your announcements, the insurance you accept and what you're known for.</div>
<div style="margin-top:30px">{crop('camp/tr-embed-form.jpg', 0, 0, 920, 600, 936, 610)}</div>
<div class="chips"><span class="chip pu">Backlinks to your own website</span></div>''',
 f'''<div class="k">3 · Complete</div><h2>Everything you need for a first visit.</h2>
<div class="p">Urgency, procedures, an interactive tooth chart, diagnosis, and up to 10 X-rays and 10 documents.</div>
<div style="margin-top:30px">{crop('camp/tr-chart.jpg', 0, 0, 920, 560, 936, 570)}</div>''',
 f'''<div class="k">4 · Easy</div><h2>Three short steps. No login.</h2>
<div class="p">The patient uploads their own insurance card through a secure link, so the front desk isn't retyping it.</div>
<div style="margin-top:30px">{crop('camp/tr-insurance.jpg', 0, 100, 980, 480, 936, 458)}</div>''',
 f'''<div class="k">5 · It keeps working</div><h2>It doesn't end at Submit.</h2>
<div class="p">Every referral becomes a tracked case with status updates, messages, a signed completion note, and a monthly report on your form.</div>
<div style="margin-top:30px">{crop('dash3c/r3c-status-xrays.jpg', 380, 120, 1400, 700, 936, 468)}</div>''',
 '''<div class="k">The checklist</div><h2>Secure. Yours. Complete. Easy. Still working after Submit.</h2>
<div class="p">If your referral form misses one of these, it's costing you referrals you never see.</div>
<div class="p" style="color:#16132B;font-size:40px;font-family:Jakarta;font-weight:800;margin-top:40px">The referral form that keeps working after you hit submit.</div>
<span class="cta">Set up in about 5 minutes</span>''',
]

# ---------------------------------------------------------------------------------------------------------------
# Carousel 3: One referral, eight days  (video: Same referral, two ways)

C3 = [
 '''<div class="k">One referral, two ways</div><h1>A root canal on tooth #19. Let's follow it.</h1>
<div class="p">Monday morning, a general dentist refers a patient to an endodontist. Same patient, same X-rays. One goes through a web form, one through Tooth Referral.</div>
<div class="big" style="font-size:230px;margin-top:70px">#19</div>''',
 f'''<div class="k">Monday · 9:41 am</div><h2>The referral goes out.</h2>
<div class="split"><div class="col form"><h3>Web form</h3><div class="row"><span class="dotA"></span>Lands in a shared inbox</div><div class="row"><span class="dotA"></span>Waits until someone opens it</div></div>
<div class="col tr"><h3>Tooth Referral</h3><div class="row"><span class="dotG"></span>The specialist's team has the case in minutes</div><div class="row"><span class="dotG"></span>X-rays and insurance attached</div></div></div>
<div style="margin-top:34px">{crop('dash3c/r3c-incoming.jpg', 360, 150, 1500, 560, 936, 350)}</div>''',
 f'''<div class="k">Monday · 11:20 am</div><h2>The X-ray on file is from 2022.</h2>
<div class="split"><div class="col form"><h3>Web form</h3><div class="row"><span class="dotA"></span>A phone call</div><div class="row"><span class="dotA"></span>A voicemail</div><div class="row"><span class="dotA"></span>A callback tomorrow, maybe</div></div>
<div class="col tr"><h3>Tooth Referral</h3><div class="row"><span class="dotG"></span>Amanda asks on the case</div><div class="row"><span class="dotG"></span>Greg uploads a current X-ray that afternoon</div></div></div>
<div style="margin-top:34px">{crop('dash3c/r3c-messages.jpg', 690, 220, 1100, 420, 936, 357)}</div>''',
 f'''<div class="k">Monday · 3:40 pm</div><h2>The consultation is booked.</h2>
<div class="p">Amanda calls the patient and books the consultation for Thursday. The referring office sees it right away, without picking up the phone.</div>
<div class="chips" style="margin-top:34px"><span class="chip gr">Received</span><span class="chip gr">Contacted</span><span class="chip gr">Consultation scheduled</span></div>
<div style="margin-top:34px">{crop('dash3c/r3c-activity-log.jpg', 380, 0, 920, 520, 936, 529)}</div>''',
 f'''<div class="k">Thursday → next Tuesday</div><h2>Consultation done. Root canal complete.</h2>
<div class="tl">
 <div class="ti"><span class="t">Thursday</span><span class="d">The consultation is done and logged on the case.</span></div>
 <div class="ti"><span class="t">Next Tuesday</span><span class="d">The root canal is complete. The signed completion note goes back to the general dentist the same day.</span></div>
</div>
<div class="card" style="margin-top:30px;padding:34px 38px">
 <div style="display:flex;justify-content:space-between;align-items:center"><div style="font-family:Jakarta;font-weight:800;font-size:40px">Completion note</div><span class="chip gr">Signed ✓</span></div>
 <div class="row" style="margin-top:16px"><span style="width:240px;color:#6B7085">Procedure</span><b>Root canal (NSRCT)</b></div>
 <div class="row"><span style="width:240px;color:#6B7085">Tooth</span><b>#19</b></div>
 <div class="row"><span style="width:240px;color:#6B7085">Sent to</span><b>Gentle Dental · same day</b></div>
 <div class="row"><span style="width:240px;color:#6B7085">Total time</span><b>8 days, every step logged</b></div>
</div>''',
 '''<div class="k">The result</div><div class="big" style="font-size:260px;margin-top:20px">8 days</div>
<h2 style="margin-top:20px">Every step logged. No phone tag.</h2>
<div class="p">Same patient, same dentists, same X-ray problem. The only thing that changed was what sat behind the website.</div>''',
 '''<div class="k">The difference</div><h1>A web form sends an email. Tooth Referral runs the referral.</h1>
<span class="cta">Set up in about 5 minutes</span>
<div class="p" style="margin-top:30px">toothreferral.com</div>''',
]

# ---------------------------------------------------------------------------------------------------------------
# Single-image posts

P4 = ['''<div style="margin-top:150px" class="q">A web form sends an email.<br><span>Tooth Referral starts a case.</span></div>
<div class="p" style="margin-top:60px;font-size:36px">Status, messages, X-rays, insurance and a signed completion note, on one shared case for both offices.</div>''']

P5 = ['''<div class="k">Before your next referral</div><h1 style="font-size:76px">5 questions to ask your referral form</h1>
<div class="li"><b class="n">1</b><span>Is it <b>HIPAA compliant and encrypted</b>?</span></div>
<div class="li"><b class="n">2</b><span>Does it carry <b>X-rays and insurance</b>, or just a name?</span></div>
<div class="li"><b class="n">3</b><span>Can the referring dentist <b>see the status</b> without calling?</span></div>
<div class="li"><b class="n">4</b><span>Does a <b>signed completion note</b> go back when treatment is done?</span></div>
<div class="li"><b class="n">5</b><span>Can you see <b>who refers, and how fast you called</b>?</span></div>
<div class="p" style="margin-top:44px;color:#16132B"><b>Five no's? Your form is sending emails, not referrals.</b></div>''']

POSTS = [
 dict(id='carousel-1-same-patient-two-endings', kind='Carousel · 7 slides', title='Same patient, two endings', video='camp-form-vs-software.mp4', tag='TWO ENDINGS', slides=C1),
 dict(id='carousel-2-what-a-referral-form-should-do', kind='Carousel · 7 slides', title='What a referral form should do', video='camp-form-compare-v2.mp4', tag='YOUR REFERRAL FORM', slides=C2),
 dict(id='carousel-3-one-referral-eight-days', kind='Carousel · 7 slides', title='One referral, eight days', video='camp-same-referral-two-ways.mp4', tag='ONE REFERRAL', slides=C3),
 dict(id='post-4-email-vs-case', kind='Single image', title='A web form sends an email', video='all three', tag='TOOTH REFERRAL', slides=P4, dark=True),
 dict(id='post-5-five-questions', kind='Single image', title='5 questions to ask your referral form', video='all three', tag='CHECKLIST', slides=P5),
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
    parts = [f'''<div><div class="meta">Tooth Referral · social posts</div><h1>Web form videos: LinkedIn posts (3 carousels + 2 images)</h1>
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
