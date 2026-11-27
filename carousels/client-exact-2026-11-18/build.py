"""Client carousels built from scratch with the client's EXACT slide text (18 Nov 2026 brief), and the real Tooth Referral
app UI (cropped screenshots of the app and the app-faithful rebuilt note screens) shown as layered 3D cards.

  ToothReferral-Endo-Insurance-Carousel-Exact.pdf     7 slides + the client's LinkedIn post copy (kept for later use)
  ToothReferral-Oral-Surgery-3-Tasks-Carousel-Exact.pdf 5 slides + caption

Text is the client's, word for word. Only two production notes are not printed on a slide: "Formatted as a slides-only
PDF to be uploaded as a swipeable LinkedIn document" (an upload instruction) and "[link removed]" (shown as
toothreferral.com). The "Visual Concept" lines direct the graphics. Vector PDF (Chromium print): sharp at any zoom."""
import html, json, os, subprocess, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import ui as UI
from pypdf import PdfReader, PdfWriter

HERE = os.path.dirname(os.path.abspath(__file__))
PUB = '/home/user/awesome-opus-5-5-prompts/reel/public'
FONTS = PUB + '/fonts'
E = html.escape
IMG = lambda f: 'file://' + os.path.join(HERE, 'img', f)
LOGO = 'file://' + PUB + '/tr/logo.png'

CSS = f'''
@font-face {{ font-family: J; src: url(file://{FONTS}/plus-jakarta-sans-latin-800-normal.woff2); font-weight: 800; }}
@font-face {{ font-family: J; src: url(file://{FONTS}/plus-jakarta-sans-latin-700-normal.woff2); font-weight: 700; }}
@font-face {{ font-family: I; src: url(file://{FONTS}/inter-latin-500-normal.woff2); font-weight: 500; }}
@font-face {{ font-family: I; src: url(file://{FONTS}/inter-latin-700-normal.woff2); font-weight: 700; }}
@page {{ size: 1080px 1350px; margin: 0; }}
* {{ box-sizing: border-box; margin: 0; }}
body {{ width: 1080px; height: 1350px; overflow: hidden; font-family: I; color: #16132B; position: relative;
  background: radial-gradient(ellipse at 80% 85%, #DCCFFF 0%, transparent 55%), linear-gradient(170deg, #FBFAFF 0%, #EFEAFF 60%, #E6DDFF 100%); }}
body.dark {{ color: #fff; background: radial-gradient(ellipse at 75% 80%, #5B34D6 0%, transparent 55%), linear-gradient(165deg, #1B1240 0%, #120B2E 100%); }}
.dots {{ position: absolute; inset: 0; background-image: radial-gradient(rgba(109,74,232,.10) 1.5px, transparent 1.6px); background-size: 36px 36px; }}
body.dark .dots {{ background-image: radial-gradient(rgba(196,181,253,.10) 1.5px, transparent 1.6px); }}
.page {{ position: absolute; inset: 0; padding: 52px 64px 44px; display: flex; flex-direction: column; }}
.top {{ display: flex; justify-content: space-between; align-items: center; }}
.top img {{ height: 58px; }} body.dark .top img {{ filter: brightness(0) invert(1); }}
.pg {{ font-weight: 700; color: #6D4AE8; font-size: 21px; letter-spacing: .12em; }} body.dark .pg {{ color: #C4B5FD; }}
.k {{ margin-top: 30px; display: flex; flex-wrap: wrap; gap: 10px; align-items: center; }}
.lab {{ font-weight: 700; color: #6D4AE8; font-size: 21px; letter-spacing: .12em; text-transform: uppercase; }} body.dark .lab {{ color: #C4B5FD; }}
.aud {{ font-size: 18px; font-weight: 700; padding: 6px 14px; border-radius: 999px; background: #EFEAFF; color: #4B2BB8; border: 1.5px solid #D9CCFB; }}
body.dark .aud {{ background: rgba(255,255,255,.1); color: #E9E2FF; border-color: rgba(196,181,253,.4); }}
.def {{ margin-top: 14px; font-size: 19px; line-height: 1.4; color: #4B2BB8; font-weight: 700; padding: 10px 16px; border-left: 4px solid #6D4AE8; background: rgba(255,255,255,.6); border-radius: 0 10px 10px 0; }}
body.dark .def {{ color: #E9E2FF; background: rgba(255,255,255,.08); border-color: #A78BFA; }}
h1 {{ font-family: J; font-weight: 800; letter-spacing: -.03em; line-height: 1.05; margin-top: 14px; }}
.main {{ margin-top: 14px; font-size: 25px; font-weight: 700; line-height: 1.35; color: #2B2350; }} body.dark .main {{ color: #F1ECFF; }}
.body {{ margin-top: 12px; font-size: 22px; line-height: 1.45; color: #423C5C; }} body.dark .body {{ color: #DDD6FE; }}
.kb {{ margin-top: 14px; display: flex; gap: 12px; align-items: flex-start; font-size: 21px; line-height: 1.4; padding: 12px 16px; border-radius: 14px; background: #fff; border: 1.5px solid #E4DBFF; }}
.kb b {{ color: #1F9D6B; white-space: nowrap; }}
.rows {{ margin-top: 16px; display: flex; flex-direction: column; gap: 10px; }}
.row {{ display: flex; gap: 14px; font-size: 21px; line-height: 1.38; padding: 12px 16px; border-radius: 14px; background: rgba(255,255,255,.85); border: 1.5px solid #E4DBFF; }}
body.dark .row {{ background: rgba(255,255,255,.07); border-color: rgba(196,181,253,.3); }}
.row b {{ color: #4B2BB8; flex: none; width: 230px; }} body.dark .row b {{ color: #C4B5FD; }}
.stage {{ flex: 1; position: relative; margin-top: 18px; min-height: 0; }}
.card3 {{ position: absolute; border-radius: 14px; overflow: visible; background: transparent; box-shadow: 0 34px 60px -10px rgba(40,20,110,.30), 0 8px 18px rgba(40,20,110,.12);
  box-shadow: 0 40px 80px rgba(40,20,110,.30), 0 6px 18px rgba(40,20,110,.18); border: 1.5px solid rgba(109,74,232,.25); }}


.tag3 {{ position: absolute; display: inline-flex; gap: 10px; align-items: center; padding: 12px 20px; border-radius: 999px; color: #fff; font-weight: 700; font-size: 21px; box-shadow: 0 14px 30px rgba(40,20,110,.28); }}
.g {{ background: #1F9D6B; }} .p {{ background: #6D4AE8; }} .a {{ background: #E89D15; }}
.foot {{ margin-top: 16px; display: flex; justify-content: space-between; align-items: center; font-size: 20px; font-weight: 700; color: #6D4AE8; }}
body.dark .foot {{ color: #C4B5FD; }}
.cta {{ display: inline-block; margin-top: 16px; padding: 18px 34px; border-radius: 999px; background: #6D4AE8; color: #fff; font-weight: 700; font-size: 27px; }}
body.dark .cta {{ background: #fff; color: #4B2BB8; }}
'''


def card(img, left, top, width, rx=10, ry=-16, rz=0, z=0):
    """An app screen (HTML rebuilt from the real app, ui.py) tilted in real 3D with soft layered shadows.
    Pages are rendered at 4x by Chromium, so the screens stay sharp while shadows and depth stay smooth."""
    return (f'<div class="card3" style="left:{left}px;top:{top}px;width:{width}px;'
            f'transform:perspective(1800px) rotateY({ry * 0.75:.1f}deg) rotateX({rx * 0.5:.1f}deg) rotateZ({rz}deg)">{UI.ui(img, width)}</div>')


def tag(text, left, top, tone='g', rot=0):
    return f'<div class="tag3 {tone}" style="left:{left}px;top:{top}px;transform:rotate({rot}deg);z-index:9">{E(text)}</div>'


def slide(n, total, tag_, text, visual, dark=False):
    return (f'<html><head><meta charset="utf-8"><style>{CSS}{UI.CSS}</style></head><body class="{"dark" if dark else ""}"><div class="dots"></div>'
            f'<div class="page"><div class="top"><img src="{LOGO}"><span class="pg">{tag_} · {n}/{total}</span></div>{text}'
            f'<div class="stage">{visual}</div>'
            f'<div class="foot"><span>toothreferral.com</span><span>{"Swipe →" if n < total else ""}</span></div></div></body></html>')


def head(label, h, size, aud=None):
    return (f'<div class="k"><span class="lab">{E(label)}</span>{f"<span class=aud>{E(aud)}</span>" if aud else ""}</div>'
            f'<h1 style="font-size:{size}px">{E(h)}</h1>')


# ============================================================ INSURANCE (client text, word for word)
INS = [
 (head('Slide 1 · Hook & Audience', 'Endodontists put your front desk on automation without outsourcing!', 60)
  + '<div class="main">Your patient already has the insurance card in their wallet. Let them send it to you in one secure step.</div>'
  + '<div class="body">ToothReferral\'s embedded referral software collects your referred patients\' dental insurance for you, built for endodontists, oral surgeons and the general dentists who refer to them.</div>',
  card('ui-static-form.png', 70, 60, 450, rx=12, ry=24, rz=-4, z=-60) + card('ui-insurance-cards.png', 420, 20, 540, rx=10, ry=-20, rz=2, z=60)
  + tag('Static, one-way form', 60, 360, 'a', -4) + tag('Card collected automatically', 560, 380, 'g', 3), True),
 (head('Slide 2 · The Core Problem', 'The Daily Endodontic Front Desk Struggle', 62)
  + '<div class="body" style="font-size:25px">Every new referral starts the same way: call the patient, ask for the card, wait for a reply, then call again. Your front desk spends the day following up instead of scheduling, and the coverage check waits with them.</div>',
  card('ui-static-form.png', 110, 30, 560, rx=14, ry=20, rz=-3, z=-40)
  + tag('1 · Call the patient', 560, 40, 'a', 4) + tag('2 · Ask for the card', 540, 160, 'a', -3)
  + tag('3 · Wait, then call again', 500, 280, 'a', 2), False),
 (head('Slide 3 · The Solution', 'Endodontic offices streamline obtaining your referred patients dental insurance information', 48)
  + '<div class="body">ToothReferral replaces the static, one-way referral form with a referral case both offices share. One click on the case sends the patient a HIPAA-compliant secure link, protected by Cloudflare. The patient photographs the front and back of the card on their phone, no account needed, and both images arrive on the referral with the policy and group numbers.</div>',
  card('ui-secure-link.png', 60, 10, 560, rx=10, ry=18, rz=-2, z=-30) + card('ui-insurance-cards.png', 470, 90, 480, rx=10, ry=-18, rz=2, z=70)
  + tag('One click: secure link sent', 70, 300, 'g', -3) + tag('Cloudflare protected', 600, 20, 'p', 3), False),
 (head('Slide 4 · Key Benefits & Trust', 'Endodontic out of network offices', 62)
  + '<div class="body" style="font-size:25px">Out of network and filing claims for your patients? The coverage details are on the case before anyone picks up the phone, so your team can talk through costs early and patients can say yes with confidence.</div>',
  card('ui-insurance-cards.png', 90, 20, 620, rx=10, ry=16, rz=-2, z=-20) + card('ui-activity.png', 520, 200, 420, rx=10, ry=-18, rz=2, z=80)
  + tag('Coverage on the case', 90, 340, 'g', -3) + tag('Before the first call', 650, 40, 'p', 4), False),
 (head('Slide 5 · Call to Action', 'Automate Your Endodontic Front Desk', 64)
  + '<div class="body" style="font-size:26px">Start the referral process without a phone call. Switch today and see how ToothReferral referral software replaces your outdated form.</div>',
  card('ui-incoming.png', 60, 20, 600, rx=10, ry=18, rz=-2, z=-30) + card('ui-secure-link.png', 520, 140, 420, rx=10, ry=-18, rz=2, z=80)
  + tag('Referral starts without a phone call', 80, 400, 'g', -3), False),
 (head('Slide 6 · Value for Everyone', 'Why Practices Replace Generic Web Forms with ToothReferral', 50)
  + '<div class="rows">'
  + ''.join(f'<div class="row"><b>{a}</b><span>{E(t)}</span></div>' for a, t in [
      ('Front Desk', 'Eliminates unencrypted web forms, illegible card uploads, missing back images, and manual verification calls.'),
      ('Specialist Office', 'Full coverage details—including policy, group info, and card images—are attached to the case before the consultation.'),
      ('General Dentist', 'Refers patients instantly without administrative delays or waiting on insurance card collection.'),
      ('The Patient', 'A fast, 1-click HIPAA-secure mobile upload with zero account creation required.')]) + '</div>',
  card('ui-insurance-cards.png', 300, 10, 480, rx=12, ry=-14, rz=1, z=0), False),
 (head('Slide 7 · Upgrade Your Referral Workflow', 'Move Beyond Basic Web Forms.', 58)
  + '<div class="rows">'
  + ''.join(f'<div class="row"><b>{a}</b><span>{E(t)}</span></div>' for a, t in [
      ('Stop Chasing Cards & Data', 'Generic web forms leave gaps. ToothReferral delivers complete, HIPAA-compliant patient coverage directly to the referral record.'),
      ('Automated Audit Trail', 'Track requests, uploads, and coverage verifications in real time with built-in activity logging.'),
      ('Call to Action', 'Eliminate insurance chaos and streamline your practice network today.')]) + '</div>'
  + '<div class="cta">Get started free at toothreferral.com</div>',
  card('ui-activity.png', 200, 10, 640, rx=12, ry=-14, rz=1, z=0), True),
]

# ============================================================ ORAL SURGERY (client text, word for word)
OS = [
 (head('Slide 1 · Title & Core Objective', 'TIME TO UPGRADE YOUR REFERRAL WORKFLOW IN 2026', 52, 'Oral Surgery Practices, Lead Oral Surgeons, Surgical Assistants, and Practice Managers')
  + '<div class="def">Tooth Referral is a cloud-native, specialized SaaS dental platform built to replace traditional static one-way referral forms with real-time, two-way data integration.</div>'
  + '<div class="main">While your existing web or paper referral form has served your practice well for years with zero maintenance, it’s time to evolve.</div>'
  + '<div class="body">Free your administrative and surgical team from mundane habits so you can focus on patient care and showcase your best clinical work. Upgrading to Tooth Referral gives your oral surgery team a purpose-built platform that streamlines obtaining referrals and eliminates administrative friction.</div>',
  card('ui-static-form.png', 40, 20, 400, rx=12, ry=24, rz=-4, z=-60) + card('ui-incoming.png', 400, 0, 540, rx=10, ry=-20, rz=2, z=40)
  + card('ui-statuses.png', 640, 150, 300, rx=10, ry=-20, rz=2, z=110), True),
 (head('Slide 2', 'STOP BURYING CASE CORRESPONDENCE IN EMAIL', 50, 'Oral Surgery Administrative Staff & Referring Dental Practices')
  + '<div class="main">Case emails sent to referring offices often get buried in patient files or cluttered inboxes.</div>'
  + '<div class="body">Instead of emailing PDF attachments or texting back and forth, Tooth Referral gives your referring general dentists access to the exact same software your oral surgery office uses. Data merges seamlessly inside the shared referral—eliminating lost emails, phone calls, text messages, and security breaches.</div>'
  + '<div class="kb"><b>Key Benefit</b><span>Secure, direct two-way data merging between your oral surgery office and referring dentists without relying on email chains.</span></div>',
  card('ui-messages.png', 90, 10, 820, rx=10, ry=14, rz=-1.5, z=0) + tag('Shared, live case file · both practices', 420, 230, 'g', 3), False),
 (head('Slide 3', 'MAINTAIN REAL-TIME VISIBILITY ACROSS YOUR SURGICAL TEAM', 46, 'Oral Surgery Practice Managers & Front Desk Teams')
  + '<div class="main">Never guess a referral\'s status when staff members forget to log notes or are out sick.</div>'
  + '<div class="body">When busy team members forget to enter referral statuses into your Practice Management Software (PMS), tracking case progress grinds to a halt—especially if someone calls in sick. Tooth Referral automatically generates administrative notes ready to copy and paste straight into your PMS, giving your entire oral surgery team instant, real-time visibility into every patient’s status.</div>'
  + '<div class="kb"><b>Key Benefit</b><span>Total team continuity and PMS chart alignment, regardless of staffing changes or unexpected absences.</span></div>',
  card('ui-status-schedule.png', 80, 0, 400, rx=10, ry=18, rz=-2, z=-20) + card('ui-admin-journey.png', 520, 30, 400, rx=10, ry=-18, rz=2, z=60), False),
 (head('Slide 4', 'LET STAFF PREPARE NOTES; SURGEONS SIGN IN SECONDS', 48, 'Oral Surgeons & Surgical Assistants')
  + '<div class="main">Free your surgical team from mundane manual typing while protecting the oral surgeon\'s valuable clinical time.</div>'
  + '<div class="body">Surgical assistants use Tooth Referral’s smart templates to draft complete consultation notes with auto-filled patient info, tooth numbers, dates, and X-rays. Once prepared, notes route directly to the oral surgeon for quick authorization via built-in e-signatures or seamless DocuSign integration.</div>'
  + '<div class="kb"><b>Key Benefit</b><span>Maximum clinical efficiency for oral surgeons, empowering surgical assistants to handle documentation.</span></div>',
  card('ui-template.png', 40, 0, 560, rx=10, ry=18, rz=-2, z=-30) + card('ui-docusign.png', 470, 60, 480, rx=10, ry=-18, rz=2, z=70)
  + tag('Routed to the oral surgeon · DocuSign', 80, 250, 'g', -3), False),
 (head('Slide 5 · Built on Robust Code', 'PLATFORM STABILITY OVER AI HYPE', 54, 'Oral Surgeons, Practice Owners, & Operations Leaders')
  + '<div class="def">Tooth Referral is real, deterministic coded software built on a robust tech platform—not speculative or unverified AI hype.</div>'
  + '<div class="main">Stand out to referring general dentists with rock-solid security, deterministic accuracy, and zero compliance risks.</div>'
  + '<div class="body">Tooth Referral guarantees the confidentiality of patient information, the prevention of security breaches, and the avoidance of operational disruptions. It provides your oral surgery practice with a contemporary and professional workflow that enhances your practice’s reputation.</div>'
  + '<div class="rows">' + ''.join(f'<div class="row"><b>{a}</b><span>{E(t)}</span></div>' for a, t in [
      ('Zero Security Breaches', 'Fully compliant, secure SaaS architecture.'),
      ('5-Minute Implementation', 'Up and running instantly across your oral surgery practice with zero complex IT maintenance.'),
      ('Showcase Your Work', 'Deliver a seamless referral experience that referring dentists love.')]) + '</div>'
  + '<div class="cta">Upgrade your oral surgery practice today at toothreferral.com</div>',
  card('ui-secure-link.png', 160, 20, 380, rx=10, ry=18, rz=-2, z=-20) + card('ui-doc.png', 560, 60, 360, rx=10, ry=-18, rz=2, z=60), True),
]

POST_INS = ('LinkedIn post copy', open(os.path.join(HERE, 'Post-Copy-Endo-Insurance-Revised.md')).read().split('\n', 1)[1].strip())
POST_OS = ('LinkedIn caption', "Three tasks still take hours in most oral surgery practices: emailing case updates to referring dentists, tracking statuses that never reached the practice management software, and typing consultation notes by hand.\n\n"
           "Tooth Referral replaces your referral form with one shared case per referral. The referring general dentist works in the same case, so messages and X-rays stay with the patient. Every status change is recorded, with a note ready to copy into your PMS. Surgical assistants prepare consultation notes from your templates and route them to the oral surgeon to sign with DocuSign.\n\n"
           "Swipe through the three tasks.\n\n#OralSurgery #OralSurgeon #DentalReferrals #DentalPracticeManagement #DentalAssistant")


def text_page(title, body):
    return (f'<html><head><meta charset="utf-8"><style>{CSS}{UI.CSS}</style></head><body><div class="dots"></div><div class="page"><div class="top"><img src="{LOGO}"><span class="pg">CAPTION</span></div>'
            f'<div class="k"><span class="lab">{E(title)}</span></div><div style="margin-top:20px;background:#fff;border:1.5px solid #E4DBFF;border-radius:20px;padding:26px 30px;font-size:19.5px;line-height:1.5;white-space:pre-wrap">{E(body)}</div></div></body></html>')


CHECK = '''() => { const s = document.querySelector('.stage').getBoundingClientRect(); const out = [];
 if (s.height < 160 && document.querySelectorAll('.card3').length) out.push('stage too small: ' + Math.round(s.height));
 document.querySelectorAll('.card3,.tag3').forEach(e => { const r = e.getBoundingClientRect(); if (r.bottom > s.bottom + 6) out.push('graphic below stage ' + Math.round(r.bottom - s.bottom)); if (r.right > 1080 - 20 || r.left < 20) out.push('graphic off side'); });
 let mb = 0; document.querySelectorAll('.card3,.tag3').forEach(e => { mb = Math.max(mb, e.getBoundingClientRect().bottom - s.top); });
 return {stage: Math.round(s.height), content: Math.round(mb), issues: out}; }'''


def fit(visual, stage_h):
    """Scale the 3D group to the room left under the text (the stage height differs per slide)."""
    if not visual: return ''
    stage_h, content_h = stage_h if isinstance(stage_h, tuple) else (stage_h, 470)
    k = max(0.4, min(1.04, (stage_h - 16) / max(content_h, 1)))
    top = max(0, (stage_h - content_h * k) / 2)
    return f'<div style="position:absolute;left:20px;top:{top:.0f}px;width:1080px;height:600px;transform:scale({k:.3f});transform-origin:50% 0">{visual}</div>'


def build(slides, tag_, post, out):
    total = len(slides)
    # pass 1: measure the stage height per slide
    # pass 1: render each slide with its graphics at scale 1 to measure the room and the graphics' height
    probe = lambda v: f'<div style="position:absolute;left:20px;top:0;width:1080px;height:600px">{v}</div>' if v else ''
    hs = run([slide(i, total, tag_, t, probe(v), d) for i, (t, v, d) in enumerate(slides, 1)], measure=True)
    pages = [slide(i, total, tag_, t, fit(v, (hs[i - 1]['stage'], hs[i - 1]['content'])), d) for i, (t, v, d) in enumerate(slides, 1)]
    pages.append(text_page(*post))
    res = run(pages, pdf_out=out)
    for i, r in enumerate(res[:total], 1):
        if r['issues']: print(tag_, i, r)
    print(out, len(pages), 'pages; stage heights', [h['stage'] for h in hs])


def run(pages, measure=False, pdf_out=None):
    paths = []
    for i, h in enumerate(pages):
        p = os.path.join(HERE, f'_{i:02d}.html'); open(p, 'w').write(h); paths.append(p)
    js = os.path.join(HERE, '_r.cjs'); rj = os.path.join(HERE, '_r.json')
    open(js, 'w').write("const {chromium}=require('playwright');(async()=>{const b=await chromium.launch();const pg=await b.newPage({viewport:{width:1080,height:1350},deviceScaleFactor:" + ("1" if measure else "4") + "});const R=[];for(const f of "
                        + json.dumps(paths) + "){await pg.goto('file://'+f);await pg.evaluate(()=>document.fonts.ready);await pg.waitForTimeout(250);"
                        + "R.push(await pg.evaluate(()=>document.querySelector('.stage')?(" + CHECK + ")():{stage:0,issues:[]}));"
                        + ("" if measure else "await pg.screenshot({path:f.replace('.html','.png')});")
                        + "}require('fs').writeFileSync('" + rj + "',JSON.stringify(R));await b.close();})();")
    subprocess.run(['node', js], check=True, cwd='/home/user/awesome-opus-5-5-prompts/reel')
    R = json.load(open(rj)); os.remove(rj); os.remove(js)
    if pdf_out:
        import img2pdf
        os.makedirs(os.path.join(HERE, 'preview'), exist_ok=True); pngs = []
        for i, p in enumerate(paths):
            dst = os.path.join(HERE, 'preview', f'{"os" if "Oral" in pdf_out else "ins"}-{i + 1:02d}.png')
            os.replace(p.replace('.html', '.png'), dst); pngs.append(dst)
        lay = img2pdf.get_layout_fun((1080, 1350))  # points; 4x pixels inside = ~288 dpi equivalent at full size
        from PIL import Image
        jpgs = []
        for q in pngs:  # high-quality JPEG (4:4:4, q92) keeps text crisp at 4x and keeps each PDF well under 30 MB
            j = q.replace('.png', '.jpg'); Image.open(q).convert('RGB').save(j, quality=92, subsampling=0, optimize=True); jpgs.append(j)
        open(os.path.join(HERE, pdf_out), 'wb').write(img2pdf.convert(jpgs, layout_fun=lay))
    for p in paths: os.remove(p)
    return R


if __name__ == '__main__':
    build(INS, 'INSURANCE', POST_INS, 'ToothReferral-Endo-Insurance-Carousel-Exact.pdf')
    build(OS, 'ORAL SURGERY', POST_OS, 'ToothReferral-Oral-Surgery-3-Tasks-Carousel-Exact.pdf')
