"""Client revisions v2, 18 Nov 2026: every slide of the client's outline implemented, in the client's order, rewritten as
professional copy, with layered 3D app graphics (the feature-posts 3D system: carousels/feature-posts/build.py).

  Insurance carousel (7 slides, endodontists)      -> ToothReferral-Endo-Insurance-Carousel.pdf
  Oral surgery carousel (5 slides, 3 tasks, 2026)   -> ToothReferral-Oral-Surgery-3-Tasks-Carousel.pdf

Each PDF = vector slides (Chromium print, sharp at any zoom) + a caption page; the insurance PDF also carries the
client's original post copy, unchanged, for later use. Each slide ends with a "Next" line into the following slide.
Claims: only what the platform does or the user confirmed (Cloudflare spam protection, 18 Nov). Absolute promises in
the draft ("guarantees", "zero security breaches", "zero compliance risks") are stated as what the product does.
Brand rules: "general dentist" written out, no "EHR", no red, no doctors' names, CTA "Set up in about 5 minutes"."""
import html, importlib.util, json, os, subprocess
from pypdf import PdfReader, PdfWriter

HERE = os.path.dirname(os.path.abspath(__file__))
FP = os.path.join(HERE, '..', 'feature-posts', 'build.py')
spec = importlib.util.spec_from_file_location('fp', FP); fp = importlib.util.module_from_spec(spec); spec.loader.exec_module(fp)
E = html.escape
place, stage, chip, ic = fp.place, fp.stage, fp.chip, fp.ic
FONTS = '/home/user/awesome-opus-5-5-prompts/reel/public/fonts'

NEXT = lambda t, dark=False: f'<div style="position:absolute;left:76px;top:1176px;z-index:20;padding:10px 22px;border-radius:999px;font:700 26px InterW;background:{"rgba(20,12,48,.85)" if dark else "rgba(255,255,255,.92)"};color:{"#C4B5FD" if dark else "#6D3DF0"};box-shadow:0 8px 24px rgba(40,20,110,.15)">Next: {E(t)} →</div>'
TXT = lambda k, h, p='', size=None: (f'<div class="txt"><div class="k">{k}</div><h2{f" style=\"font-size:{size}px\"" if size else ""}>{h}</h2>'
                                      + (f'<div class="p">{p}</div>' if p else '') + '</div>')


def os_case(w=700):
    """Case card for an oral surgery referral (implant consultation)."""
    return fp.case_card(w).replace('Root canal · Tooth #19', 'Implant consultation · Tooth #30')


def web_form(w=520):
    rows = ''.join(f'<div style="margin-top:14px"><div style="font:500 17px InterW;color:#6B7085">{t}</div><div style="height:34px;border:1.5px solid #D8D4E6;border-radius:6px;margin-top:6px;background:#FAFAFC"></div></div>'
                   for t in ['Referring doctor', 'Patient name', 'Date of birth', 'Reason for referral'])
    return f'''<div class="card" style="width:{w}px;background:#F7F5EF"><div style="padding:24px 28px 28px;font-family:Georgia,serif">
  <div style="font:400 30px Georgia;color:#333">Patient Referral Form</div><div style="font:400 15px InterW;color:#888;margin-top:6px">Sends one email. No status, no reply.</div>
  {rows}<div style="margin-top:20px;display:inline-block;padding:8px 22px;border:1.5px solid #999;border-radius:4px;font:400 17px InterW;color:#555">Submit</div></div></div>'''


def act(rows, w=680):
    return fp.activity(w, rows)


# ================================================================== INSURANCE (endodontists), client order 1-7
INS = [
 dict(dark=True, body=TXT('For endodontists and their front desks',
   'Endodontists, put down the microscope for a second.',
   "Don't worry, you'll still find the MB2. Picture yourself as the patient: how does your office collect a referred patient's dental insurance card?", 70)
   + stage(660, place(web_form(440), 90, 40, rx=14, ry=22, rz=-4, z=-60) + place(fp.ins_dash(False, 600), 430, 0, rx=12, ry=-18, rz=2, z=40, scale=.9)
           + chip(110, 330, 'One-way form', 'x', '#E08A00', -4) + chip(680, 380, 'Tooth Referral', 'check', '#1F9D6B', 3))
   + NEXT('the daily insurance chase', True)),
 dict(body=TXT('The problem', 'The daily insurance chase at the endodontic front desk.',
   'Card photos sent to personal phones, faxes missing the back of the card, and patients rescheduled because coverage was not checked in time. Each of those photos is patient data on a staff member\'s phone.')
   + stage(720, place(fp.call_card('phone', 'Text from a patient', 'IMG_2231.jpg · back of card missing'), 140, 0, rx=18, ry=-14, rz=-4)
             + place(fp.call_card('doc', 'Fax received', 'Page 2 of 3 unreadable'), 320, 150, rx=18, ry=-14, rz=-4, z=30)
             + place(fp.call_card('clock', 'Appointment rescheduled', 'Coverage not verified'), 220, 300, rx=18, ry=-14, rz=-4, z=60))
   + NEXT('how Tooth Referral collects the card')),
 dict(body=TXT('The solution · Tooth Referral', 'Collect the card securely, with one click.',
   'Tooth Referral replaces the referral form on your website. On any referral, Request from patient sends a HIPAA-compliant secure link, protected by Cloudflare spam protection. The patient photographs the front and back of the card on their phone, with no account to create.')
   + stage(700, place(fp.ins_dash(False, 720), 70, 0, rx=12, ry=16, rz=-1.5) + place(fp.phone(280), 720, -40, rx=6, ry=-18, rz=2, z=120)
             + place(fp.toast('Insurance request sent', 'Secure link sent to the patient', 470), 140, 300, rx=12, ry=16, rz=-1.5, z=140))
   + NEXT('offices that file insurance for patients')),
 dict(body=TXT('Out-of-network endodontic offices', 'Filing insurance for referred patients?',
   'Out-of-network offices that file on the patient\'s behalf get the card, policy and group numbers before the first call. Patients see what their coverage means before treatment, which makes it easier to say yes.')
   + stage(700, place(os_case(720).replace('Implant consultation · Tooth #30', 'Root canal · Tooth #19'), 70, 0, rx=12, ry=18, rz=-2, z=-30, scale=.95)
             + chip(560, 310, 'Card on file before the call', 'card', '#1F9D6B', 3) + chip(110, 340, 'No calls to collect it', 'phone', '#6D3DF0', -3))
   + NEXT('no phone call to start')),
 dict(body=TXT('Automate your endodontic front desk', 'Start every referral without a phone call.',
   'The general dentist submits the referral on your website form; the insurance request goes to the patient automatically, and the card arrives on the case. Your front desk picks it up from there.')
   + stage(640, place(fp.phone(280), 120, 0, rx=6, ry=16, rz=-2, z=40)
             + place(act([('Gentle Dental', 'submitted a referral from your website', '9:41 AM'), ('Tooth Referral', 'sent the secure insurance link to the patient', '9:41 AM'), ('Patient', 'uploaded insurance (front and back)', '10:12 AM')], 560), 440, 120, rx=10, ry=-16, rz=1.5, z=60))
   + NEXT('what each person gains')),
 dict(body='<div class="txt"><div class="k">Value for everyone</div><h2>Why practices replace generic web forms with Tooth Referral.</h2>'
   + fp.team_rows([('users', 'Front desk', 'No unencrypted uploads, unreadable photos, missing backs of cards or verification calls.'),
                   ('card', 'Specialist office', 'Policy, group and card images are on the case before the consultation.'),
                   ('send', 'General dentist', 'Refers right away, without collecting the insurance card first.'),
                   ('shield', 'The patient', 'One secure upload from their phone, with no account to create.')])
   + '</div>' + NEXT('how to switch')),
 dict(body=TXT('Upgrade your referral workflow', 'Move beyond basic web forms. Just refer it.',
   'Every request, upload and verification is logged on the case, with who did it and when. Replace your one-way form and stop chasing insurance cards.')
   + stage(640, place(act([('Barbara', 'sent secure insurance request to patient', '9:41 AM'), ('Patient', 'submitted insurance (front and back)', '10:12 AM'), ('Amanda', 'verified coverage and scheduled the consultation', '10:30 AM')], 820), 120, 0, rx=12, ry=14, rz=-1.5))
   + '<div style="position:absolute;left:76px;top:1120px;z-index:6"><span class="cta" style="display:inline-block;padding:22px 42px;border-radius:999px;background:#6D3DF0;color:#fff;font:700 34px InterW">Set up in about 5 minutes · toothreferral.com</span></div>'),
]

# ================================================================== ORAL SURGERY, 3 tasks, client order 1-5
OS = [
 dict(dark=True, body=TXT('For oral surgery practices · 2026', 'Time to upgrade your referral workflow.',
   'Your web or paper referral form has served you for years. Tooth Referral replaces it with one shared case per referral, so your surgical and front-desk teams spend less time on paperwork. Here are 3 tasks it takes off their plate.', 74)
   + stage(680, place(web_form(420), 90, 30, rx=14, ry=22, rz=-4, z=-60) + place(os_case(620), 400, 0, rx=12, ry=-18, rz=2, z=40, scale=.92)
           + place(fp.status_card(470), 520, 300, rx=12, ry=-18, rz=2, z=110, scale=.85))
   + NEXT('Task 1, case emails', True)),
 dict(body=TXT('Task 1', 'Stop burying case correspondence in email.',
   'Emailed PDFs and texts to referring offices get lost in inboxes. With Tooth Referral, the referring general dentist works in the same case as your office: messages, X-rays and files stay with the patient, encrypted, for both offices.')
   + stage(660, place(fp.thread('xray', False, 820), 130, -20, rx=12, ry=16, rz=-1.5, scale=.82, origin='50% 0%') + chip(90, 300, 'One case, both offices', 'users', '#1F9D6B', -3) + chip(700, 360, 'No email chains', 'mail', '#6D3DF0', 3))
   + NEXT('Task 2, status visibility')),
 dict(body=TXT('Task 2', 'Know every referral\'s status, even when someone is out sick.',
   'When a status never makes it into your practice management software (PMS), the case stalls. Tooth Referral records every status change with a name and time, and writes the note ready to copy into your PMS, so anyone on the team can pick up the case.')
   + stage(740, place(fp.status_card(560), 90, 0, rx=12, ry=18, rz=-2, z=-20)
             + place(act([('Tanya', 'Left a voicemail', 'Mon 4:10 PM'), ('Greg', 'Consultation scheduled', 'Tue 8:15 AM'), ('Greg', 'Copied the note into the PMS', 'Tue 8:16 AM')], 560), 430, 150, rx=12, ry=-16, rz=1.5, z=70))
   + NEXT('Task 3, consultation notes')),
 dict(body=TXT('Task 3', 'Assistants prepare the note. The surgeon signs in seconds.',
   'A surgical assistant starts from your template, and the patient, tooth number, dates and X-rays fill in from the case. The note is routed to the oral surgeon, who signs with DocuSign, and the signed note goes to the referring office.')
   + stage(720, place(fp.note_card(False, 700), 60, 0, rx=12, ry=18, rz=-2, z=-40, scale=.9)
             + place(fp.signer_card(500), 560, 150, rx=12, ry=-16, rz=1.5, z=80, scale=.85) + chip(90, 380, 'Signed with DocuSign', 'pen', '#1F9D6B', -3))
   + NEXT('why it matters to referring dentists')),
 dict(dark=True, body='<div class="txt"><div class="k">Platform stability over AI hype</div><h2>Built on deterministic code your referring dentists can rely on.</h2>'
   '<div class="p">Tooth Referral is rule-based software, not AI guesswork: the same input gives the same result, every time. It keeps patient information encrypted and gives your practice a modern, professional referral experience.</div>'
   + fp.team_rows([('shield', 'Secure by design', 'HIPAA-compliant messaging and files, encrypted, with Cloudflare spam protection.'),
                   ('clock', 'Set up in about 5 minutes', 'No IT project and no ongoing maintenance.'),
                   ('users', 'Show your best work', 'Referring dentists see each update and the signed note on the case.')])
   + '</div><style>body.dark .li{background:rgba(255,255,255,.08)!important;border:1.5px solid rgba(196,181,253,.35)!important} body.dark .li b{color:#fff!important} body.dark .li span{color:#DDD6FE!important}</style><div style="position:absolute;left:76px;top:1150px;z-index:6"><span style="display:inline-block;padding:20px 40px;border-radius:999px;background:#fff;color:#4B2BB8;font:700 32px InterW">Upgrade your practice · toothreferral.com</span></div>'),
]

CAPTIONS = {
 'ins': ('Insurance cards, without the chase',
  "Endodontists, put down the microscope for a second. You'll still find the MB2.\n\n"
  "How does your office collect a referred patient's insurance card? For many front desks it means photos on personal phones, faxes missing the back of the card, and patients rescheduled because coverage was not checked in time.\n\n"
  "Tooth Referral replaces the referral form on your website. On any referral, one click sends the patient a HIPAA-compliant secure link, protected by Cloudflare spam protection. The patient photographs the front and back of the card on their phone, with no account to create, and it arrives on the case with the policy and group numbers. Out-of-network offices that file for their patients have the details before the first call.\n\n"
  "Swipe through to see each step.",
  '#DentalInsurance #Endodontics #DentalReferrals #DentalFrontDesk #DentalPracticeManagement',
  'Audience: endodontic front desks and office managers (also works for oral surgeons and other specialists).  Ask: set up Tooth Referral (about 5 minutes).\n\n'
  'First comment: dental insurance verification, secure insurance upload, patient insurance link, HIPAA secure patient forms\n\n'
  'Alt text: Carousel with 3D graphics of the Tooth Referral insurance feature: a referral form compared with the dashboard, the Request from patient link, the patient uploading the card on a phone, and the activity log on the case.'),
 'os': ('3 tasks oral surgery practices can do more efficiently in 2026',
  "Three tasks still take hours in most oral surgery practices: emailing case updates to referring dentists, tracking statuses that never reached the practice management software, and typing consultation notes by hand.\n\n"
  "Tooth Referral replaces your referral form with one shared case per referral. The referring general dentist works in the same case, so messages and X-rays stay with the patient. Every status change is recorded, with a note ready to copy into your PMS. Surgical assistants prepare consultation notes from your templates and route them to the oral surgeon to sign with DocuSign.\n\n"
  "Swipe through the three tasks. Setup takes about five minutes.",
  '#OralSurgery #OralSurgeon #DentalReferrals #DentalPracticeManagement #DentalAssistant',
  'Audience: oral surgeons, surgical assistants and practice managers.  Ask: set up Tooth Referral (about 5 minutes).\n\n'
  'Alt text: Carousel with 3D graphics of Tooth Referral: a referral form compared with a shared case, messages with the referring office, the status board and activity log, a consultation note template routed to the surgeon for DocuSign signature.'),
}

PG_CSS = f'''@page {{ size: 1080px 1350px; margin: 0; }}
@font-face {{ font-family: J; src: url(file://{FONTS}/plus-jakarta-sans-latin-800-normal.woff2); }}
@font-face {{ font-family: I; src: url(file://{FONTS}/inter-latin-500-normal.woff2); }}
body {{ margin: 0; font-family: I; color: #16132B; }}
.pg {{ width: 1080px; height: 1350px; box-sizing: border-box; padding: 80px 76px; background: linear-gradient(170deg,#FBFAFF,#EFEAFF); page-break-after: always; overflow: hidden; }}
.k {{ color: #6D3DF0; font-weight: 700; letter-spacing: .14em; font-size: 22px; text-transform: uppercase; }}
h1 {{ font-family: J; font-size: 46px; line-height: 1.1; margin: 12px 0 24px; }}
.box {{ background: #fff; border: 1.5px solid rgba(109,74,232,.2); border-radius: 22px; padding: 28px 32px; font-size: 22px; line-height: 1.5; white-space: pre-wrap; }}
.tags {{ margin-top: 16px; font-size: 21px; color: #4B2BB8; font-weight: 700; }}
.s {{ font-size: 19px; color: #4a4560; line-height: 1.5; margin-top: 20px; white-space: pre-wrap; }}'''


def chromium_pdf(html_pages, out):
    """Each HTML page printed by Chromium to one PDF page (vector)."""
    paths = []
    for i, h in enumerate(html_pages):
        p = os.path.join(HERE, f'_p{i:02d}.html'); open(p, 'w').write(h); paths.append(p)
    js = os.path.join(HERE, '_p.cjs')
    open(js, 'w').write("const {chromium}=require('playwright');(async()=>{const b=await chromium.launch();const pg=await b.newPage({viewport:{width:1080,height:1350}});const rep={};for(const f of "
                        + json.dumps(paths) + "){await pg.goto('file://'+f);await pg.evaluate(()=>document.fonts.ready);await pg.waitForTimeout(250);"
                        + "await pg.screenshot({path:f.replace('.html','.png')});await pg.pdf({path:f.replace('.html','.pdf'),width:'1080px',height:'1350px',printBackground:true,pageRanges:'1'});}await b.close();})();")
    subprocess.run(['node', js], check=True, cwd='/home/user/awesome-opus-5-5-prompts/reel')
    w = PdfWriter(); pngs = []
    for p in paths:
        for pgx in PdfReader(p.replace('.html', '.pdf')).pages: w.add_page(pgx)
        pngs.append(p.replace('.html', '.png')); os.remove(p); os.remove(p.replace('.html', '.pdf'))
    os.remove(js); w.write(out)
    return pngs


def caption_page(kind, title, body, tags, extra):
    return (f'<html><head><meta charset="utf-8"><style>{PG_CSS}</style></head><body><div class="pg"><div class="k">{E(kind)}</div><h1>{E(title)}</h1>'
            f'<div class="box">{E(body)}</div><div class="tags">{E(tags)}</div><div class="s">{E(extra)}</div></div></body></html>')


def check(slides, tag):
    """Layout check with the feature-posts rules (text into footer, graphics over headline, off canvas)."""
    jobs = []
    for i, s in enumerate(slides, 1):
        h = os.path.join(HERE, f'_k{i:02d}.html'); open(h, 'w').write(fp.page(s, i, len(slides), tag)); jobs.append(h)
    js = os.path.join(HERE, '_k.cjs')
    open(js, 'w').write("const {chromium}=require('playwright');(async()=>{const b=await chromium.launch();const pg=await b.newPage({viewport:{width:1080,height:1350}});const r={};for(const f of "
                        + json.dumps(jobs) + "){await pg.goto('file://'+f);await pg.evaluate(()=>document.fonts.ready);await pg.waitForTimeout(200);r[f]=await pg.evaluate(" + fp.CHECK_JS + ");}"
                        + "require('fs').writeFileSync('" + os.path.join(HERE, '_k.json') + "',JSON.stringify(r));await b.close();})();")
    subprocess.run(['node', js], check=True, cwd='/home/user/awesome-opus-5-5-prompts/reel')
    r = json.load(open(os.path.join(HERE, '_k.json')))
    for h in jobs: os.remove(h)
    os.remove(js); os.remove(os.path.join(HERE, '_k.json'))
    return {os.path.basename(k): v for k, v in r.items() if v}


if __name__ == '__main__':
    saved = open(os.path.join(HERE, 'Saved-Post-Copy-Endo-Insurance-Original.md')).read().split('\n', 1)[1].strip()
    for key, slides, tag, out in [('ins', INS, 'INSURANCE', 'ToothReferral-Endo-Insurance-Carousel.pdf'),
                                  ('os', OS, '3 TASKS', 'ToothReferral-Oral-Surgery-3-Tasks-Carousel.pdf')]:
        print(tag, check(slides, tag) or 'layout ok')
        title, body, tags, extra = CAPTIONS[key]
        pages = [fp.page(s, i, len(slides), tag) for i, s in enumerate(slides, 1)] + [caption_page('LinkedIn caption', title, body, tags, extra)]
        if key == 'ins':
            pages.append(caption_page('Saved for later · original copy', "Client's endodontic insurance post (unchanged)", saved, '', ''))
        pngs = chromium_pdf(pages, os.path.join(HERE, out))
        os.makedirs(os.path.join(HERE, 'preview'), exist_ok=True)
        for i, p in enumerate(pngs, 1): os.replace(p, os.path.join(HERE, 'preview', f'{key}-{i:02d}.png'))
        print(out, len(pngs), 'pages')
