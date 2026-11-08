"""Two LinkedIn/Instagram carousels (1080x1350) for Vejay's brief: Form vs Software, and Day in the Life of an
Endodontic Start-up. HTML slides -> PNG (Playwright) -> PDF. Images are real ToothReferral screens plus neutral
mock-ups of a generic web form and an inbox; competitors are never named or shown."""
import os, subprocess, html
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
.dots {{ position: absolute; inset: 0; background-image: radial-gradient(rgba(109,74,232,0.10) 1.5px, transparent 1.6px); background-size: 36px 36px; }}
.top {{ position: absolute; top: 56px; left: 72px; right: 72px; display: flex; justify-content: space-between; align-items: center; }}
.top img {{ height: 64px; }}
.pg {{ font-weight: 700; color: #6D4AE8; font-size: 24px; letter-spacing: .12em; }}
.k {{ font-weight: 700; color: #6D4AE8; font-size: 28px; letter-spacing: .14em; text-transform: uppercase; }}
h1 {{ font-family: Jakarta; font-weight: 800; font-size: 84px; line-height: 1.02; letter-spacing: -.035em; margin-top: 14px; }}
h2 {{ font-family: Jakarta; font-weight: 800; font-size: 62px; line-height: 1.05; letter-spacing: -.03em; margin-top: 12px; }}
.p {{ font-size: 32px; line-height: 1.4; color: #3a3552; margin-top: 22px; }}
.main {{ position: absolute; top: 170px; left: 72px; right: 72px; }}
.card {{ border-radius: 28px; overflow: hidden; background: #fff; box-shadow: 0 34px 80px rgba(40,20,110,.25); border: 1.5px solid rgba(109,74,232,.18); position: relative; }}
.card img {{ display: block; }}
.chips {{ display: flex; flex-wrap: wrap; gap: 14px; margin-top: 26px; }}
.chip {{ padding: 12px 26px; border-radius: 999px; color: #fff; font-weight: 700; font-size: 30px; }}
.pu {{ background: #6D4AE8; }} .gr {{ background: #1F9D6B; }} .am {{ background: #E89D15; }}
.li {{ display: flex; gap: 18px; font-size: 34px; line-height: 1.32; margin-top: 26px; }}
.li b {{ color: #6D4AE8; font-family: Jakarta; font-size: 40px; width: 46px; flex: none; }}
.foot {{ position: absolute; bottom: 52px; left: 72px; right: 72px; display: flex; justify-content: space-between; font-size: 24px; color: #6D4AE8; font-weight: 700; }}
.cta {{ display: inline-block; margin-top: 30px; padding: 22px 44px; border-radius: 999px; background: #6D4AE8; color: #fff; font-weight: 700; font-size: 36px; }}
table {{ border-collapse: collapse; width: 100%; margin-top: 30px; font-size: 30px; }}
td, th {{ padding: 18px 16px; border-bottom: 1.5px solid rgba(109,74,232,.15); text-align: left; vertical-align: top; }}
th {{ font-family: Jakarta; font-size: 30px; }}
.no {{ color: #B7791F; }} .yes {{ color: #1F9D6B; font-weight: 700; }}
'''


def crop(img, x, y, w, h, out_w, out_h):
    """an <img> showing the (x, y, w, h) region of a picture inside an out_w x out_h box"""
    s = out_w / w
    return f'<div class="card" style="width:{out_w}px;height:{out_h}px"><img src="{F(img)}" style="position:absolute;left:{-x * s}px;top:{-y * s}px;width:{IMG[img][0] * s}px;height:{IMG[img][1] * s}px;max-width:none"></div>'


IMG = {'camp/mock.png': (2004, 1600), 'camp/mail.png': (2000, 1600), 'camp/tr-embed-form.jpg': (920, 1060),
       'dash3c/r3c-incoming.jpg': (1920, 912), 'dash3c/r3c-insurance.jpg': (1920, 912), 'dash3c/r3c-activity-log.jpg': (1920, 912),
       'dash3c/r3c-messages.jpg': (1920, 912), 'dash3c/r3c-referral-source.jpg': (1920, 912), 'dash2c/cs-07-signed-success.jpg': (1904, 868),
       'analytics-ref/01-header-kpis.png': (1920, 640), 'analytics-ref/02-senders-procedures.png': (1460, 450)}


def slide(body, n, total, tag):
    return f'''<html><head><meta charset="utf-8"><style>{CSS}</style></head><body><div class="dots"></div>
<div class="top"><img src="{F('tr/logo.png')}"><span class="pg">{tag} · {n}/{total}</span></div>
<div class="main">{body}</div><div class="foot"><span>toothreferral.com</span><span>{'Swipe →' if n < total else 'Set up in about 5 minutes'}</span></div></body></html>'''


A = [
 f'''<div class="k">For dental specialists</div><h1>Your referral form is a digital fax machine.</h1>
<div class="p">Here's what really happens after a general dentist hits <b>Submit</b> on your website.</div>
<div style="margin-top:44px">{crop('camp/mock.png', 0, 0, 2004, 1500, 936, 700)}</div>''',
 f'''<div class="k">The web form</div><h2>It ends at "Submit".</h2>
<div class="p">The referral becomes one more email in a shared inbox, between supply orders and voicemails.</div>
<div style="margin-top:34px">{crop('camp/mail.png', 0, 0, 2000, 1100, 936, 515)}</div>
<div class="chips"><span class="chip am">No confirmation</span><span class="chip am">No status</span><span class="chip am">Nobody assigned</span><span class="chip am">No reply to the dentist</span></div>''',
 '''<div class="k">What we found</div><h2>We reviewed real specialist referral pages.</h2>
<div class="li"><b>1</b><span>One asks referring offices for the patient's <b>Social Security number</b> on a public web form.</span></div>
<div class="li"><b>2</b><span>One needs a <b>Doctor ID, a password and a math question</b> before a dentist can refer.</span></div>
<div class="li"><b>3</b><span>Most still offer a <b>PDF to print and fax</b>.</span></div>
<div class="li"><b>4</b><span><b>None</b> show the referring office what happened next.</span></div>''',
 f'''<div class="k">Tooth Referral</div><h2>It starts a case, not an email.</h2>
<div class="p">Every referral lands in one list, with its status and the office that sent it.</div>
<div style="margin-top:34px">{crop('dash3c/r3c-incoming.jpg', 360, 150, 1500, 700, 936, 437)}</div>
<div class="chips"><span class="chip pu">One list</span><span class="chip pu">Live status</span><span class="chip gr">Connected network member</span></div>''',
 f'''<div class="k">Everything travels with it</div><h2>X-rays and insurance, on the case.</h2>
<div class="p">Or send the patient a secure link to upload their own insurance card.</div>
<div style="margin-top:34px">{crop('dash3c/r3c-insurance.jpg', 180, 380, 900, 520, 936, 541)}</div>''',
 f'''<div class="k">The audit trail</div><h2>Every step, who did it, and when.</h2>
<div style="margin-top:30px">{crop('dash3c/r3c-activity-log.jpg', 380, 0, 920, 520, 936, 529)}</div>
<div class="chips"><span class="chip pu">Received</span><span class="chip pu">Contacted</span><span class="chip gr">Consultation scheduled</span><span class="chip gr">Completed</span></div>''',
 f'''<div class="k">Both offices</div><h2>One conversation. One signed note.</h2>
<div class="p">Message the general dentist right on the case. When treatment is done, the signed completion note goes back automatically.</div>
<div style="margin-top:30px">{crop('dash3c/r3c-messages.jpg', 690, 220, 1100, 520, 936, 442)}</div>''',
 f'''<div class="k">What a form can't show you</div><h2>Your referrals, measured.</h2>
<div style="margin-top:30px">{crop('analytics-ref/01-header-kpis.png', 380, 380, 1480, 250, 936, 158)}</div>
<div class="li"><b>✓</b><span>28 referrals this month, first contact in 3.7 hours, 76% case acceptance.</span></div>
<div class="p" style="font-size:34px;color:#16132B"><b>Replace your web form with a referral pipeline.</b></div>
<span class="cta">Set up in about 5 minutes</span>''',
]

B = [
 f'''<div class="k">Endo start-up diary</div><h1>A day in the life of an endodontic start-up.</h1>
<div class="p">How I set up referrals before my first patient walked in.</div>
<div style="margin-top:50px;font-family:Jakarta;font-weight:800;font-size:260px;color:#6D4AE8;letter-spacing:-.05em;line-height:1">Day 1</div>''',
 '''<div class="k">7:00 am</div><h2>The chairs are in. The CBCT works.</h2>
<div class="li"><b>✓</b><span>Operatories set up</span></div><div class="li"><b>✓</b><span>CBCT calibrated</span></div>
<div class="li"><b>✓</b><span>Staff hired: front desk, assistant</span></div><div class="li"><b style="color:#E89D15">○</b><span>Website goes live tomorrow</span></div>
<div class="p">The practice is ready. The question is: how will referrals reach us?</div>''',
 f'''<div class="k">11:00 am · building the website</div><h2>Every template comes with a referral form.</h2>
<div style="margin-top:30px">{crop('camp/mock.png', 0, 0, 2004, 1200, 936, 560)}</div>
<div class="p">So I asked one question: <b>what happens after a dentist hits submit?</b></div>''',
 '''<div class="k">2:00 pm · choosing referral software</div><h2>Form vs. software</h2>
<table><tr><th></th><th>Web form</th><th>Tooth Referral</th></tr>
<tr><td>Lands in</td><td class="no">an inbox</td><td class="yes">a tracked case</td></tr>
<tr><td>X-rays &amp; insurance</td><td class="no">email or fax</td><td class="yes">on the case</td></tr>
<tr><td>Status for the dentist</td><td class="no">a phone call</td><td class="yes">live, automatic</td></tr>
<tr><td>Who did what</td><td class="no">nobody knows</td><td class="yes">audit trail</td></tr>
<tr><td>Completion note</td><td class="no">print, sign, fax</td><td class="yes">signed in app</td></tr>
<tr><td>Analytics</td><td class="no">none</td><td class="yes">every referral</td></tr></table>''',
 f'''<div class="k">3:30 pm · on my website</div><h2>I embedded Tooth Referral.</h2>
<div class="p">Offices pick a location, attach X-rays and send insurance through a secure patient link.</div>
<div style="margin-top:30px">{crop('camp/tr-embed-form.jpg', 0, 500, 920, 560, 936, 570)}</div>''',
 f'''<div class="k">5:00 pm · my network</div><h2>I invited the dentists I already know.</h2>
<div class="p">Now we share the same case, the same messages and the same status. No portal logins, no access codes.</div>
<div style="margin-top:30px">{crop('dash3c/r3c-referral-source.jpg', 380, 380, 900, 420, 936, 437)}</div>''',
 f'''<div class="k">Week 4</div><h2>Every referral, who sent it, how fast we called.</h2>
<div style="margin-top:30px">{crop('analytics-ref/01-header-kpis.png', 380, 380, 1480, 250, 936, 158)}</div>
<div style="margin-top:24px">{crop('analytics-ref/02-senders-procedures.png', 0, 0, 900, 450, 936, 468)}</div>''',
 '''<div class="k">The lesson</div><h1>Start with a system, not a sticky note.</h1>
<div class="p">Starting a practice is hard. Losing referrals shouldn't be part of it.</div>
<span class="cta">Set up in about 5 minutes</span>
<div class="p" style="margin-top:30px">toothreferral.com</div>''',
]


def build(name, slides, tag):
    out = os.path.join(HERE, name)
    os.makedirs(out, exist_ok=True)
    paths = []
    for i, b in enumerate(slides, 1):
        p = os.path.join(out, f'{i:02d}.html')
        open(p, 'w').write(slide(b, i, len(slides), tag))
        paths.append(p)
    js = f'''const {{ chromium }} = require('playwright');
(async () => {{ const b = await chromium.launch(); const pg = await b.newPage({{ viewport: {{ width: 1080, height: 1350 }} }});
for (const p of {paths!r}) {{ await pg.goto('file://' + p); await pg.evaluate(() => document.fonts.ready); await pg.waitForTimeout(300);
  await pg.screenshot({{ path: p.replace('.html', '.png') }}); }}
await b.close(); }})();'''
    open(os.path.join(out, 'shot.cjs'), 'w').write(js)
    subprocess.run(['node', os.path.join(out, 'shot.cjs')], check=True)
    from PIL import Image
    ims = [Image.open(p.replace('.html', '.png')).convert('RGB') for p in paths]
    ims[0].save(os.path.join(HERE, f'{name}.pdf'), save_all=True, append_images=ims[1:], resolution=144)
    for p in paths:
        os.remove(p)
    os.remove(os.path.join(out, 'shot.cjs'))
    print(name, len(ims))


build('carousel-A-form-vs-software', A, 'FORM VS SOFTWARE')
build('carousel-B-day-in-the-life', B, 'DAY IN THE LIFE')
