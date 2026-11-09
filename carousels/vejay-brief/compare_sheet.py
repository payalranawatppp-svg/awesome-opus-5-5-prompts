"""Compare sheet: the Tooth Referral web form (as embedded on North Carolina Endodontics) vs three specialist referral
forms (Durham Endodontics, Renovo Endodontic Studio, Levin Endodontics). Every Tooth Referral advantage is either
observed on the live form or quoted from toothreferral.com; nothing was submitted. HTML -> PDF (Chrome)."""
import html, os, subprocess
from PIL import Image
E = html.escape
HERE = os.path.dirname(os.path.abspath(__file__))
SC = '/tmp/claude-0/-home-user-awesome-opus-5-5-prompts/61ad0f1a-77a7-5e04-8546-bd1e8a80b8f4/scratchpad/forms'
OUT = os.path.join(HERE, 'Referral-Form-Compare-Sheet-ToothReferral-vs-Web-Forms.pdf')
f = lambda p: 'file://' + os.path.join(SC, p)

# fresh insurance crop (top of the Patient Insurance block)
Image.open(os.path.join(SC, 'tr-1.png')).convert('RGB').crop((150, 2330, 1130, 3010)).save(os.path.join(SC, 'cs_insurance.jpg'), quality=88)

Y, P, N = 'y', 'p', 'n'  # yes / partial / no (or not stated)
COLS = ['Tooth Referral form<br><span>NC Endodontics (embedded)</span>', 'Durham Endodontics<br><span>Televox site form</span>', 'Renovo Endodontic Studio<br><span>Gravity Forms (WordPress)</span>', 'Levin Endodontics<br><span>TDO portal + PDF</span>']

GROUPS = [
 ('Security and privacy', [
  ('HIPAA security', (Y, '"All communications are HIPAA compliant and encrypted"; Business Associate Agreement offered; AWS hosting, Cloudflare protection, complete audit trails on every plan'),
                     (N, 'No security or HIPAA statement on the form; posts to the site\'s "thank-you" page'),
                     (N, 'No security statement on the form; site links only the patient HIPAA notice'),
                     (P, 'Portal states "256 bit encryption"; the PDF route is print and fax')),
  ('Sensitive data requested', (Y, 'Name, date of birth, contact, insurance company. No Social Security number'),
                               (N, 'Asks for the patient\'s Social Security number on a public web form'),
                               (Y, 'No SSN'), (P, 'Not visible before login')),
  ('Spam and bot protection', (Y, '"Filters out spam, bot submissions, and phishing attempts" into a secure cloud inbox'), (P, 'reCAPTCHA'), (P, 'reCAPTCHA'), (P, 'Math question at login')),
  ('Access for the referring office', (Y, 'No login needed; existing Tooth Referral users enter zip code + office PIN and their details autofill'), (Y, 'No login; retypes doctor details every time'), (Y, 'No login; retypes details'), (N, 'Doctor ID + password + math question; first-time setup')),
 ]),
 ('Marketing and SEO', [
  ('Backlinks / SEO', (Y, '"Integrates seamlessly into your existing website, generating high-quality backlinks to your domain to drive higher local Google search rankings"; "Boosts SEO & Domain Authority"'), (N, 'Plain form, no SEO benefit stated'), (N, 'Plain form, no SEO benefit stated'), (N, 'Login page')),
  ('Markets the practice to referring offices', (Y, 'Announcements (new office, open house, door prize), CE event RSVPs, "Insurance accepted" in/out-of-network carrier logos, "What we are known for" chips'), (N, 'Thank-you paragraph only'), (N, 'Heading and office list on the page'), (N, 'None')),
  ('Multi-location', (Y, 'Pick one or more offices; each card shows address (Google Maps link), phone and doctors'), (N, 'Single office'), (P, 'Preferred office radio buttons'), (N, 'Single office')),
  ('Customisable and professional', (Y, 'Practice logo and branding, own procedure list, announcements, skills chips; "Custom referral form fields" (Pro plan); modern 3-step layout with progress bar'), (N, 'Long single page, fixed fields'), (N, 'Long single page, fixed fields'), (N, 'Login box and PDF')),
  ('Form performance report', (Y, '"Your embedded form sends a monthly report": visitors per day, time on the form, where referrals stall'), (N, 'None'), (N, 'None'), (N, 'None')),
 ]),
 ('Clinical completeness', [
  ('Referral urgency', (Y, 'Urgent, Routine, Symptomatic, Elective, Consultation'), (P, '"Health indications" checkbox'), (N, 'None'), (N, 'Not visible')),
  ('Procedures', (Y, 'Specialty list (NSRCT, Retreatment, Broken/Separated Instrument, Diagnose and Treat, Resorption, Cracked Tooth, Apicoectomy, Trauma, Internal Bleaching, Extract and Place Implant); add several; live summary preview'), (P, '8 reason checkboxes'), (P, '5 options'), (N, 'PDF')),
  ('Tooth selection', (Y, 'Interactive chart per procedure, adult and pediatric'), (Y, 'Checkbox grid, adult and primary'), (P, 'Checkbox list, adult only'), (N, 'PDF')),
  ('Diagnosis and treatment requests', (Y, 'Pulpal and periodontal diagnosis menus; treatment requests (restore access, tooth non-restorable); notes per procedure; chief complaint'), (P, 'Free-text comments'), (P, 'Special instructions box'), (N, 'PDF')),
  ('X-rays and documents', (Y, 'Up to 10 X-rays (JPEG/PNG) and 10 documents (PDF/DOC/DOCX), drag and drop'), (N, '"Are X-rays available? Yes/No", no upload'), (P, 'One file, up to 10 MB'), (N, 'Fax with the PDF')),
  ('Insurance', (Y, 'Insurance company field, plus: send the patient a secure link to upload their card, upload it now, or add it later'), (N, 'None'), (N, 'None'), (N, 'Not visible')),
  ('Patient contact preference', (Y, 'Patient will contact / contact patient / contact guardian'), (P, '"May we call the patient?" yes/no'), (N, 'Phone only'), (N, 'Not visible')),
 ]),
 ('After "Send"', [
  ('Where the referral goes', (Y, 'A case in the specialist\'s Tooth Referral dashboard, with a status'), (N, 'Website form handler; not stated'), (N, 'Website form handler; not stated'), (P, 'Portal; contents not visible')),
  ('Status for the referring office', (Y, 'Live status and notifications (Received, Contacted, Consultation Scheduled, Completed...)'), (N, 'None stated'), (N, 'None stated'), (P, 'Not visible before login')),
  ('Messages between offices', (Y, 'Encrypted Office Communication on the case, @mentions'), (N, 'Phone, email, fax'), (N, 'Phone, email, fax'), (N, 'Not visible')),
  ('Closing the loop', (Y, 'Consultation note signed with DocuSign inside Tooth Referral, sent back automatically'), (N, 'None'), (N, 'None'), (N, 'Not visible')),
  ('Audit trail', (Y, 'Activity log: who did what and when'), (N, 'None'), (N, 'None'), (N, 'Not visible')),
 ]),
]

ICON = {Y: ('✓', '#1F9D6B', '#E7F7F0'), P: ('◐', '#A86B00', '#FFF4DE'), N: ('✕', '#8A8796', '#F3F2F6')}


def cell(v):
    k, txt = v
    ic, c, bg = ICON[k]
    return f'<td style="background:{bg}"><span class="ic" style="color:{c}">{ic}</span>{E(txt)}</td>'


rows = ''
for g, items in GROUPS:
    rows += f'<tr class="grp"><td colspan="5">{E(g)}</td></tr>'
    for name, *vals in items:
        rows += f'<tr><td class="k">{E(name)}</td>{"".join(cell(v) for v in vals)}</tr>'
score = [sum(1 for _, it in GROUPS for row in it if row[1 + i][0] == Y) for i in range(4)]
total = sum(len(it) for _, it in GROUPS)

ADV = [
 ('HIPAA-secure and encrypted', 'Every message is encrypted ("All communications are HIPAA compliant and encrypted"), with a Business Associate Agreement, AWS hosting, Cloudflare protection and audit trails. Durham\'s form asks for a Social Security number with no security statement.'),
 ('Free backlinks to your own domain', 'Tooth Referral\'s website forms "integrate seamlessly into your existing website, generating high-quality backlinks to your domain to drive higher local Google search rankings". A plain web form gives no SEO benefit.'),
 ('Customisable and professional', 'Your logo, your locations and doctors, your procedure list, announcements, CE event RSVPs, insurance accepted and "What we are known for", in a modern 3-step form. Custom form fields on the Pro plan. Not another long, grey dental form.'),
 ('Clinically complete', 'Urgency, specialty procedures, an interactive tooth chart (adult and pediatric), pulpal and periodontal diagnosis, treatment requests, up to 10 X-rays and 10 documents.'),
 ('Insurance before the visit', 'The referring office can send the patient a secure link to upload their own insurance card, or upload it now or later. None of the other forms collect insurance.'),
 ('A pipeline, not an inbox', 'Every referral becomes a tracked case: status, encrypted messages, a signed completion note and an audit trail, plus a monthly report on how the form performs.'),
]

SHOTS = [('cs_marketing.jpg', 'Practice marketing on the form: announcements, CE RSVPs, insurance accepted, "What we are known for"'),
         ('cs_locations.jpg', 'Step 1: pick locations (address, phone, doctors) and urgency'),
         ('cs_chart.jpg', 'Step 2: tooth chart, pulpal and periodontal diagnosis, treatment requests'),
         ('cs_uploads.jpg', 'Step 2: procedure summary, up to 10 X-rays and 10 documents'),
         ('cs_insurance.jpg', 'Insurance: secure link to the patient, upload now, or later'),
         ('cs_step3.jpg', 'Step 3: existing users autofill with zip code + office PIN')]

doc = f'''<!doctype html><html><head><meta charset="utf-8"><style>
@page {{ size: Letter landscape; margin: 0.4in 0.45in 0.5in; }}
body {{ font-family: Inter, sans-serif; color: #1B1830; margin: 0; font-size: 8.6pt; line-height: 1.32; }}
.brand {{ color: #6D4AE8; font-weight: 800; letter-spacing: .08em; font-size: 9pt; text-transform: uppercase; }}
h1 {{ font-size: 22pt; margin: 4px 0 4px; line-height: 1.1; }}
h2 {{ font-size: 13pt; margin: 14px 0 6px; }}
.sub {{ color: #6B6880; font-size: 10pt; }}
.adv {{ display: grid; grid-template-columns: repeat(3, 1fr); gap: 9px; margin-top: 12px; }}
.a {{ background: #F1ECFE; border-radius: 10px; padding: 9px 12px; }}
.a b {{ display: block; color: #6D4AE8; font-size: 10.5pt; margin-bottom: 3px; }}
.score {{ display: flex; gap: 10px; margin-top: 12px; }}
.s {{ flex: 1; border: 1px solid #E6E3EF; border-radius: 10px; padding: 8px 12px; }}
.s .n {{ font-size: 20pt; font-weight: 800; }} .s.tr {{ border: 2px solid #6D4AE8; background: #F7F4FF; }}
table {{ border-collapse: separate; border-spacing: 2px; width: 100%; }}
th {{ background: #16132B; color: #fff; text-align: left; padding: 6px 8px; font-size: 9pt; border-radius: 4px; }}
th:nth-child(2) {{ background: #6D4AE8; }}
th span {{ font-weight: 500; opacity: .8; font-size: 7.6pt; }}
td {{ padding: 5px 7px; vertical-align: top; border-radius: 4px; }}
td.k {{ font-weight: 700; width: 13%; background: #FAF9FC; }}
td:nth-child(2) {{ width: 31%; }}
.grp td {{ background: none; color: #6D4AE8; font-weight: 800; font-size: 9pt; letter-spacing: .06em; text-transform: uppercase; padding-top: 8px; }}
.ic {{ font-weight: 800; margin-right: 5px; }}
tr {{ page-break-inside: avoid; }}
.pb {{ page-break-before: always; }}
.thumbs {{ display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; }}
.thumbs div {{ border: 1px solid #E6E3EF; border-radius: 8px; padding: 6px; }}
.thumbs img {{ width: 100%; height: 300px; object-fit: cover; object-position: top; border-radius: 4px; }}
.shots {{ display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }}
.shots div {{ border: 1px solid #E6E3EF; border-radius: 8px; padding: 6px; background: #fff; }}
.shots img {{ width: 100%; height: 205px; object-fit: cover; object-position: top; border-radius: 4px; }}
.cap {{ font-size: 8pt; color: #3a3552; margin-top: 4px; }}
.mut {{ color: #6B6880; font-size: 8pt; }}
.legend span {{ margin-right: 14px; }}
</style></head><body>
<div class="brand">Tooth Referral · Referral form compare sheet</div>
<h1>The Tooth Referral web form vs typical specialist referral forms</h1>
<div class="sub">We compared the Tooth Referral form embedded on North Carolina Endodontics with three other specialist referral pages: Durham Endodontics, Renovo Endodontic Studio and Levin Endodontics. Every Tooth Referral advantage below is either visible on the live form or quoted from toothreferral.com. Nothing was submitted.</div>
<div class="adv">{''.join(f'<div class="a"><b>{i}. {E(t)}</b>{E(d)}</div>' for i, (t, d) in enumerate(ADV, 1))}</div>
<div class="score">{''.join(f'<div class="s{" tr" if i == 0 else ""}"><div class="n" style="color:{"#6D4AE8" if i == 0 else "#1B1830"}">{score[i]}/{total}</div>{COLS[i].split("<br>")[0]}<div class="mut">features fully present</div></div>' for i in range(4))}</div>

<h2 class="pb">Point-by-point comparison</h2>
<div class="legend mut"><span>✓ present</span><span>◐ partial</span><span>✕ not present or not stated on the page</span></div>
<table><tr><th></th>{''.join(f'<th>{c}</th>' for c in COLS)}</tr>{rows}</table>

<h2 class="pb">Inside the Tooth Referral form (NC Endodontics, live)</h2>
<div class="shots">{''.join(f'<div><img src="{f(i)}"><div class="cap">{E(c)}</div></div>' for i, c in SHOTS)}</div>
<h2 class="pb">The other forms (live pages)</h2>
<div class="thumbs">
<div><img src="{f('tr_t.jpg')}"><div class="cap"><b>Tooth Referral (NC Endodontics):</b> branded, 3 steps, locations, insurance link</div></div>
<div><img src="{f('durham_t.jpg')}"><div class="cap"><b>Durham Endodontics:</b> generic site form, 93 inputs, asks for SSN, no upload</div></div>
<div><img src="{f('renovo_t.jpg')}"><div class="cap"><b>Renovo Endodontic Studio:</b> Gravity Forms, one upload, PDF option</div></div>
<div><img src="{f('tdo_t.jpg')}"><div class="cap"><b>Levin Endodontics:</b> portal login (ID, password, math question), PDF form</div></div>
</div>

<h2 class="pb">Sources and method</h2>
<table>
<tr><td class="k">Tooth Referral form</td><td colspan="4">northcarolinaendodontics.com/referring-doctors/referral-form (the embedded form at toothreferral.com/embed/...). We stepped through all 3 steps in a browser with test data and did not submit. Observed: announcements, CE RSVPs, insurance accepted, "What we are known for", location cards with doctors, urgency, demographics, contact preference, insurance options, procedure list, tooth chart (adult/pediatric), pulpal and periodontal diagnosis, treatment requests, X-ray and document uploads (10 each), zip code + office PIN autofill, "Powered by ToothReferral".</td></tr>
<tr><td class="k">toothreferral.com claims</td><td colspan="4">Home page: "All communications are HIPAA compliant and encrypted", "HIPAA-compliant, encrypted and audited referrals"; footer: Business Associate Agreement. toothreferral.com/contact-us-builder: "Integrates seamlessly into your existing website, generating high-quality backlinks to your domain to drive higher local Google search rankings", "Boosts SEO & Domain Authority", "filters out spam, bot submissions, and phishing attempts". grow.toothreferral.com: "Your embedded form sends a monthly report on your referral form performance", "Custom referral form fields" (Pro), "All plans include: HIPAA compliance, AWS cloud hosting, Cloudflare protection, complete audit trails"; plans Solo $150, Pro $200, Enterprise from $350 a month, 30-day free trial.</td></tr>
<tr><td class="k">Durham Endodontics</td><td colspan="4">durhamendo.com/referring-doctors/patient-referral: Televox form (id "appointmentrequest") posting to /thank-you, reCAPTCHA, 93 inputs, no file input, fields include Social Security Number, birthdate, reasons, tooth grid. No security statement on the page.</td></tr>
<tr><td class="k">Renovo Endodontic Studio</td><td colspan="4">renovoendo.com/referral: Gravity Forms (gform_5), reCAPTCHA, one file input (jpg/png/pdf/doc, 10 MB), referred-for options, tooth list, preferred office, post space, downloadable PDF. Site links a patient HIPAA notice; no security statement on the form.</td></tr>
<tr><td class="k">Levin Endodontics</td><td colspan="4">securesite155.tdo4endo.com/refdocslogin.aspx: TDO referring-doctor login (Doctor ID, password, math question), "256 bit encryption" notice, PDF referral form. Contents after login not visible.</td></tr>
</table>
<p class="mut">Checked on November 8-9, 2026. "Not stated" means the page does not say; it does not prove the feature is missing behind the scenes.</p>
</body></html>'''

H = os.path.join(HERE, 'compare.html')
open(H, 'w').write(doc)
js = f'''const {{ chromium }} = require('playwright');
(async () => {{ const b = await chromium.launch(); const p = await b.newPage(); await p.goto('file://{H}'); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(500);
await p.pdf({{ path: '{OUT}', printBackground: true, preferCSSPageSize: true, displayHeaderFooter: true, headerTemplate: '<div></div>',
footerTemplate: '<div style="font-family:Inter;font-size:7px;color:#8a879a;width:100%;padding:0 0.45in;display:flex;justify-content:space-between"><span>Tooth Referral · Referral form compare sheet</span><span class="pageNumber"></span></div>' }});
await b.close(); }})();'''
open(os.path.join(HERE, 'compare.cjs'), 'w').write(js)
subprocess.run(['node', os.path.join(HERE, 'compare.cjs')], check=True)
os.remove(os.path.join(HERE, 'compare.cjs'))
os.remove(H)
print(OUT, score, total)
