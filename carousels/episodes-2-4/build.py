"""Carousel (1080x1350, 7 slides) from Episodes 2-4: "Three days at one front desk".
Ep 2 Phone Tag -> messages on the case; Ep 3 Tanya's Day Off -> Greg picks up from the activity log; Ep 4 Front Row ->
letters from templates, routed, signed, copied to PMS before 5. One message (Vejay): a system for the whole team.
Vejay's rules applied: no doctors' names (screens rendered with CompletionNote anon=true), staff only Tanya/Greg/Amanda/
Barbara, "general dentist" (never the abbreviation), no "shared inbox", no red (amber), problem framed as human error,
not staff fault, both sides of the referral, CTA "Set up in about 5 minutes" (no contact CTA).
Images: real app screens (dash3c), the rebuilt completion-note screens, and two frames from the episodes."""
import os, subprocess, html
HERE = os.path.dirname(os.path.abspath(__file__))
PUB = '/home/user/awesome-opus-5-5-prompts/reel/public'
F = lambda p: 'file://' + os.path.join(PUB, p)
I = lambda p: 'file://' + os.path.join(HERE, 'img', p)
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
.top {{ position: absolute; top: 56px; left: 72px; right: 72px; display: flex; justify-content: space-between; align-items: center; z-index: 3; }}
.top img {{ height: 64px; }}
.pg {{ font-weight: 700; color: #6D4AE8; font-size: 24px; letter-spacing: .12em; }}
.k {{ font-weight: 700; color: #6D4AE8; font-size: 28px; letter-spacing: .14em; text-transform: uppercase; }}
h1 {{ font-family: Jakarta; font-weight: 800; font-size: 82px; line-height: 1.02; letter-spacing: -.035em; margin-top: 14px; }}
h2 {{ font-family: Jakarta; font-weight: 800; font-size: 60px; line-height: 1.05; letter-spacing: -.03em; margin-top: 12px; }}
.p {{ font-size: 32px; line-height: 1.4; color: #3a3552; margin-top: 22px; }}
.main {{ position: absolute; top: 170px; left: 72px; right: 72px; z-index: 2; }}
.card {{ border-radius: 26px; overflow: hidden; background: #fff; box-shadow: 0 34px 80px rgba(40,20,110,.22); border: 1.5px solid rgba(109,74,232,.18); }}
.card img {{ display: block; width: 100%; }}
.chips {{ display: flex; flex-wrap: wrap; gap: 14px; margin-top: 26px; }}
.chip {{ padding: 12px 24px; border-radius: 999px; color: #fff; font-weight: 700; font-size: 28px; }}
.pu {{ background: #6D4AE8; }} .gr {{ background: #1F9D6B; }} .am {{ background: #E89D15; }}
.li {{ display: flex; gap: 20px; font-size: 33px; line-height: 1.32; margin-top: 30px; align-items: flex-start; }}
.li b.n {{ color: #fff; background: #E89D15; font-family: Jakarta; font-size: 30px; width: 54px; height: 54px; border-radius: 16px; flex: none; display: flex; align-items: center; justify-content: center; }}
.who {{ display: flex; gap: 22px; padding: 20px 0; border-bottom: 1.5px solid rgba(109,74,232,.14); font-size: 31px; line-height: 1.3; }}
.who b {{ width: 270px; flex: none; font-family: Jakarta; color: #6D4AE8; }}
.day {{ display: inline-block; padding: 10px 22px; border-radius: 14px; background: #16132B; color: #fff; font-weight: 700; font-size: 26px; letter-spacing: .06em; }}
.ep {{ font-size: 24px; color: #6D4AE8; font-weight: 700; margin-left: 14px; letter-spacing: .04em; }}
.foot {{ position: absolute; bottom: 52px; left: 72px; right: 72px; display: flex; justify-content: space-between; font-size: 24px; color: #6D4AE8; font-weight: 700; z-index: 3; }}
.cta {{ display: inline-block; margin-top: 34px; padding: 22px 44px; border-radius: 999px; background: #6D4AE8; color: #fff; font-weight: 700; font-size: 36px; }}
.photo {{ border-radius: 30px; overflow: hidden; box-shadow: 0 30px 70px rgba(40,20,110,.28); border: 6px solid #fff; }}
.photo img {{ display: block; width: 100%; height: 100%; object-fit: cover; }}
.note {{ font-size: 24px; color: #6B6585; margin-top: 18px; }}
'''


def slide(body, n, total, tag):
    return f'''<html><head><meta charset="utf-8"><style>{CSS}</style></head><body><div class="dots"></div>
<div class="top"><img src="{F('tr/logo.png')}"><span class="pg">{tag} · {n}/{total}</span></div>
<div class="main">{body}</div><div class="foot"><span>toothreferral.com</span><span>{'Swipe →' if n < total else 'Set up in about 5 minutes'}</span></div></body></html>'''


SLIDES = [
 # 1 cover
 f'''<div class="k">One front desk · three days</div>
<h1>Phone tag. A sick day. Three letters by 5:00.</h1>
<div class="p">Every dental office has weeks like this. Here's how one team got through it, without a single extra call.</div>
<div style="display:flex; gap:26px; margin-top:44px; height:640px">
  <div class="photo" style="flex:1; transform: rotate(-2deg)"><img src="{I('tanya-phone.jpg')}" style="object-position: 40% 30%"></div>
  <div class="photo" style="flex:1; transform: rotate(2deg) translateY(24px)"><img src="{I('tanya-amanda.jpg')}" style="object-position: 50% 30%"></div>
</div>''',
 # 2 the problem, as human error
 '''<div class="k">The real problem</div>
<h2>It's not the people. It's where the work lives.</h2>
<div class="li"><b class="n">1</b><span>A question about an X-ray turns into <b>voicemail tag</b> between two offices.</span></div>
<div class="li"><b class="n">2</b><span>Someone is out sick, and their follow-ups are <b>on sticky notes and in their head</b>.</span></div>
<div class="li"><b class="n">3</b><span>Completion letters typed in Word, printed, signed, scanned, faxed, <b>long after 5:00</b>.</span></div>
<div class="p" style="margin-top:44px">Nobody did anything wrong. Whether you refer or receive, it's the same on both sides of the referral.</div>''',
 # 3 day 1 (episode 2)
 f'''<span class="day">DAY 1</span><span class="ep">PHONE TAG</span>
<h2>Stop calling. Ask on the case.</h2>
<div class="p">The specialist's office asks for a newer X-ray right on the patient's case. The general dentist's office answers there, and the file saves for both offices.</div>
<div class="card" style="margin-top:34px"><img src="{I('messages.png')}"></div>
<div class="chips"><span class="chip pu">@mention the other office</span><span class="chip pu">Files on the case</span><span class="chip gr">No voicemail</span></div>''',
 # 4 day 2 (episode 3)
 f'''<span class="day">DAY 2</span><span class="ep">TANYA'S DAY OFF</span>
<h2>Tanya's out. Greg picks it up.</h2>
<div class="p">Every call, status and update is on the case with a name and a time. Greg sees exactly where Tanya left off, and the referring office sees each update without calling.</div>
<div class="card" style="margin-top:34px"><img src="{I('activity.png')}"></div>
<div class="chips"><span class="chip pu">Who did what, and when</span><span class="chip pu">Reminders</span><span class="chip gr">Automatic updates</span></div>''',
 # 5 day 3 (episode 4)
 f'''<span class="day">DAY 3</span><span class="ep">FRONT ROW</span>
<h2>Three letters closed before 5:00.</h2>
<div class="p">Your own letter template fills in the patient, tooth and referring office. Add the final note, route it to the doctor to sign, and copy it straight into your practice software.</div>
<div class="card" style="margin-top:30px"><img src="{I('letter.png')}"></div>
<div style="display:flex; gap:24px; margin-top:24px; align-items:flex-start"><div class="card" style="width:600px; flex:none"><img src="{I('doc.png')}"></div>
<div class="chips" style="flex-direction:column; margin-top:6px"><span class="chip pu">Your templates</span><span class="chip pu">Route to sign</span><span class="chip gr">Copy to PMS</span></div></div>''',
 # 6 every team member
 '''<div class="k">A system, not a web form</div>
<h2>One case. Everyone on the team gains.</h2>
<div style="margin-top:26px">
<div class="who"><b>Front desk</b><span>No phone tag, no digging through email for an X-ray.</span></div>
<div class="who"><b>Whoever covers</b><span>Knows where every referral stands on their first morning.</span></div>
<div class="who"><b>Office manager</b><span>Sees every referral and what's next, without asking around.</span></div>
<div class="who"><b>The doctor</b><span>Reviews and signs the letter from a tablet, between patients.</span></div>
<div class="who" style="border:none"><b>Referring office</b><span>Sees every update and the signed letter on the case. No calls.</span></div>
</div>
<div class="p" style="margin-top:30px; padding:26px 30px; border-radius:24px; background:#fff; border:1.5px solid rgba(109,74,232,.18)">A web form sends one email and stops. Tooth Referral keeps every message, file, status and note on one case, for both offices.</div>''',
 # 7 close
 f'''<div class="k">Tooth Referral</div>
<h1>Not a web form. A system for the whole team.</h1>
<div class="p">Tanya made it to her daughter's recital, front row. Your team can go home on time too.</div>
<div class="photo" style="margin-top:36px; height:450px"><img src="{I('tanya-amanda.jpg')}" style="object-position: 50% 38%"></div>
<span class="cta">Set up in about 5 minutes</span>''',
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


build('carousel-three-days-one-front-desk', SLIDES, 'THREE DAYS')
