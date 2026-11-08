"""Report for Vejay: referral forms vs Tooth Referral, the same referral as two journeys, the program's features,
"Day in the Life of an Endodontic Start-up", and the brand-awareness content plan. HTML -> PDF (Chrome)."""
import html, os, subprocess
E = html.escape
HERE = os.path.dirname(os.path.abspath(__file__))
SC = '/tmp/claude-0/-home-user-awesome-opus-5-5-prompts/61ad0f1a-77a7-5e04-8546-bd1e8a80b8f4/scratchpad/forms'
PUB = '/home/user/awesome-opus-5-5-prompts/reel/public'
OUT = os.path.join(HERE, 'ToothReferral-Form-vs-Software-and-Campaign.pdf')
f = lambda p: 'file://' + p

ROWS = [
 ('What the referring office does', 'Fills a long form; some also print a PDF and fax it', 'Picks a location, fills 3 short steps; repeat offices are already connected'),
 ('What happens after Submit', 'An email (or fax) to the practice inbox', 'A referral case appears in the specialist\'s Incoming list, with a status'),
 ('Confirmation for the referring office', 'None shown on any of the pages we reviewed', 'The referral appears in the referring office\'s own dashboard (Outgoing) with live status'),
 ('X-rays', 'Yes/No question or a single 10 MB upload; usually emailed or faxed separately', 'Attached to the case, shared with both offices, downloadable, editable'),
 ('Insurance', 'Not asked, or typed by hand', 'Secure link for the patient to upload the card, manual upload, or added later; outstanding requests flagged after 48 h'),
 ('Sensitive data', 'One form asks for the patient\'s Social Security number on a public page', 'HIPAA compliant and encrypted; data lives in the case, not in an inbox'),
 ('Access for the referring office', 'Portal: Doctor ID + password + math question, first-time setup', 'No access codes or portal links: both offices log into their own dashboard on the same network'),
 ('Status updates', 'Phone call to ask', 'Automatic: Received, Contacted, Left a Voice Message, Consultation Scheduled, Completed... every change notifies'),
 ('Communication', 'Phone tag, emails, faxes', 'Office Communication on the case: messages, @mentions, threaded replies'),
 ('Internal notes', 'Sticky notes', 'Administrative Notes, private to your office'),
 ('Who did what, when', 'Nobody knows', 'Activity log / audit trail on every case'),
 ('Closing the loop', 'Print, sign, scan, fax the completion letter', 'Consultation note from a template, signed with DocuSign inside Tooth Referral, sent automatically'),
 ('Follow-up safety net', 'None', 'Needs attention: past appointments with no note, ghost referrals (3+ attempts) with Re-assign, insurance outstanding'),
 ('Analytics', 'None', 'Volume vs prior, time to first contact, case acceptance, ghost rate, top senders, funnel, lifecycle clocks, staff responsiveness'),
 ('Marketing to referring offices', 'Static page', 'Announcements, CE event RSVPs, "What we are known for", insurance accepted, multi-location doctor picker (seen on NC Endodontics)'),
 ('Website patient leads', 'Contact form to an inbox', 'Lead-generating Contact Us form: Submit Insurance, No Insurance (membership plans), custom buttons, leads land in the dashboard'),
 ('When a staff member leaves', 'Their inbox and memory leave with them', 'Everything stays in the system: status board, logs, notes'),
]

JOURNEY = [
 ('Mon 9:41 am', 'Gentle Dental fills the specialist\'s web form and hits Submit. A thank-you page shows. Nothing else.', 'Greg (Gentle Dental) creates the referral in Tooth Referral: location, reason, tooth #19, X-rays attached, insurance link sent to the patient.', 'Greg (Mon 9:41 am) new referral created for Periodontal Associates'),
 ('Mon 9:45 am', 'The form arrives as an email in a shared inbox, between a supply order and a voicemail notice.', 'The case appears in Periodontal Associates\' Incoming list as New; the team is notified.', 'Amanda (Mon 9:45 am) received Referral'),
 ('Mon 10:02 am', 'X-rays are not attached; the specialist emails or calls to ask. Gentle Dental faxes them that afternoon.', 'The patient uploads the insurance card from the secure link; the X-rays are already on the case.', 'Tanya (Mon 10:02 am) updated: x-rays added; insurance card added'),
 ('Mon 11:30 am', 'Someone calls the patient and leaves a voicemail. Only that person knows.', 'Status: Left a Voice Message. Everyone sees it on the status board.', 'Tanya (Mon 11:30 am) changed status to Left a Voice Message'),
 ('Tue', 'That person is out sick. Nobody calls back.', 'The patient calls back; whoever answers sees the case and books the consult.', 'Amanda (Tue 9:55 am) scheduled Referral, Consultation Scheduled 12/07'),
 ('Wed', 'Gentle Dental\'s patient calls them: "When is my appointment?" Gentle Dental calls the specialist and waits on hold.', 'Gentle Dental sees "Consultation Scheduled" in their own dashboard and messages on the case: "@Amanda all set?" Reply in a minute.', 'Office Communication: Greg @Amanda / Amanda replies'),
 ('Consult day', 'Notes are written in the practice software; the referring office hears nothing.', 'Consultation Completed; the note is written from a template.', 'Barbara Smith (12/07) consultation completed Referral, administrative note added'),
 ('Same day', 'A letter is printed, signed, scanned and faxed, if someone remembers.', 'The completion note is signed with DocuSign inside Tooth Referral and sent automatically; the row shows Signed Referral.', 'Consultation Note signed and sent successfully'),
 ('Month end', 'No numbers. Did we lose any referrals? Unknown.', 'Analytics: volume, time to first contact, case acceptance, ghost rate, top senders, funnel leaks.', 'Needs attention: nothing past due'),
]

FEATURES = [
 ('Referrals', 'Incoming / Outgoing / Cases Completed lists, search, status and month filters, archive, Add patient, @mention badges, connected-network dot, Signed Referral link.'),
 ('Case detail', 'Patient block, referral status and requested treatments with tooth numbers, Edit referral, Download PDF (office and patient versions).'),
 ('Attachments', 'X-rays, documents and insurance cards (front and back, policy, group, subscriber), shared with both offices; Request from patient.'),
 ('Communication', 'Office Communication chat on the case, @mentions, threaded replies, unread counts; HIPAA compliant and encrypted. Administrative Notes private to your office.'),
 ('Status and schedule', '13 statuses incl. Left a Voice Message, Callback Requested, Unable to Contact, Consultation Scheduled/Completed, Scheduled, Completed, Declined, Referred Out; Update Status notifies the other office; Schedule; Create a Note; email notification settings.'),
 ('Audit trail', 'Activity log: who did what and when, on every case.'),
 ('Closing the loop', 'Consultation note templates with variables (patient, DOB, referring doctor, completion date), Save as template, sign and send with DocuSign inside the app.'),
 ('Network', 'Invite your Network; connected offices refer to each other without portals or access codes; both see the same case.'),
 ('Embedded referral form', 'Tooth Referral form on your website: multi-location picker with doctors, referral status, 3 steps, insurance by secure link or upload, announcements, CE event RSVPs, insurance accepted, "What we are known for".'),
 ('Website Lead Forms', 'Lead-generating referral form and Contact Us page: welcome message, skills chips, map, Ready to Schedule treatment list, Submit Insurance, No Insurance (membership plans), up to 5 custom buttons; leads land in the dashboard.'),
 ('Analytics', 'Received/Sent, date range, specialty filter, Export PDF; KPIs (volume, time to first contact, case acceptance, ghost rate); top senders and procedures; volume chart; referral funnel with leaks; lifecycle clocks; consultation KPIs; Needs attention with one-click actions; staff responsiveness; outcomes and sources; status board.'),
 ('Everywhere', 'Provider\'s Day-Prep Station, AI assistant ("Ask how to embed, forward, invite..."), New Referral, office switcher, notifications.'),
]

STORY = [
 ('Day 1, 7:00 am', 'The chairs are in, the CBCT works, the website goes live tomorrow. The practice is ready; the referral process is not.'),
 ('11:00 am, building the website', 'Every template has a referral form. One question changes the plan: what happens after a dentist hits submit? It becomes an email.'),
 ('2:00 pm, choosing referral software', 'Form vs software, side by side: inbox vs tracked case, fax vs attachments, phone call vs live status, nothing vs an audit trail, print-and-fax vs signed in app, no data vs analytics.'),
 ('3:30 pm, embedding Tooth Referral', 'The Tooth Referral form goes on the website: location picker, referral status, X-rays, insurance by secure patient link. Announcements and "What we are known for" market the practice to referring offices.'),
 ('5:00 pm, inviting the network', 'The founder invites the general dentists they already know. Each becomes a connected network member: same case, same messages, same status. No portal logins.'),
 ('Week 1', 'First referrals arrive. The front desk works the status board; a voicemail is a status, not a sticky note.'),
 ('Week 2', 'The first consultation note is signed and sent from the app; the referring office books the crown the same day.'),
 ('Week 4', 'Analytics: 28 referrals, first contact in 3.7 hours, case acceptance 76%, top sender St. Andrew\'s Family Dental. The founder sends thank-you notes to top senders.'),
 ('The lesson', 'Start with a system, not a sticky note. Starting a practice is hard; losing referrals shouldn\'t be part of it.'),
]

PLAN = [
 ('Video', 'Form vs Software: "Same referral, two endings"', 'Produced (45 s, voice-over, real screens)', 'Concept 1'),
 ('Video', 'Day in the Life of an Endodontic Start-up', 'Produced (52 s, voice-over, real screens)', 'Concept 2'),
 ('Video', 'What happens after Submit? (screen recording of the inbox vs the case, 20 s)', 'Script ready: Script 13/18 style', 'Concept 1'),
 ('Video', 'The SSN question: why patient data doesn\'t belong in a web form (talking head, 30 s)', 'Script in this report (section 5)', 'Concept 1'),
 ('Video', 'Start-up diary ep. 2: inviting my network (Flow, two offices, 45 s)', 'Story beat 5', 'Concept 2'),
 ('Video', 'Start-up diary ep. 3: week 4 analytics (real analytics recording)', 'Uses renders/analytics-demo.mp4', 'Concept 2'),
 ('Video', 'Patient POV: Nothing to Fill Out (Script 14, Flow)', 'Flow prompts ready', 'Both'),
 ('Video', 'Front desk: Two Calls, Two Times (Script 18-B)', 'Dialogue ready', 'Concept 1'),
 ('Carousel', 'Your referral form is a digital fax machine (8 slides)', 'Produced', 'Concept 1'),
 ('Carousel', 'A day in the life of an endodontic start-up (8 slides)', 'Produced', 'Concept 2'),
 ('Carousel', '17 things a web form can\'t do (feature map)', 'Copy in section 3', 'Concept 1'),
 ('Carousel', 'Start-up checklist: referrals before your first patient', 'Copy in section 6', 'Concept 2'),
]

CAPTIONS = [
 ('Carousel A / Video 1', 'Your referral form ends at "Submit". Then it is one more email in a shared inbox: no confirmation for the referring office, no status, nobody assigned. Tooth Referral starts a tracked, shared case instead: X-rays and insurance attached, every step logged, a signed completion note sent automatically. Replace your web form in about five minutes. #endodontics #periodontics #oralsurgery #dentalpractice #referrals'),
 ('Carousel B / Video 2', 'Day 1 of my endodontic start-up: chairs in, CBCT working, website live tomorrow. The one decision I almost got wrong was the referral form. Here is how I set up referrals before my first patient walked in, and what week 4 looked like. #endostartup #dentalbusiness #endodontist #practicegrowth'),
]


def thumbs():
    items = [('durham_t.jpg', 'Durham Endodontics', 'Long web form (Televox). Asks for the patient\'s Social Security number and birthdate; X-rays only as a Yes/No question; no insurance; reCAPTCHA; no confirmation or status.'),
             ('renovo_t.jpg', 'Renovo Endodontic Studio', 'Web form plus downloadable PDF. Tooth chart, one file upload up to 10 MB, preferred office; no insurance, no confirmation or status. Separate "Doctor Portal".'),
             ('tdo_t.jpg', 'Levin Endodontics (TDO portal)', 'Referring-doctor login: Doctor ID, password and a math question; first-time setup link; PDF referral form to download.'),
             ('tr_t.jpg', 'North Carolina Endodontics (Tooth Referral)', 'Tooth Referral embedded: 3 steps, multi-location picker with doctors, referral status, contact preferences, insurance by secure patient link or upload, announcements, CE RSVPs, insurance accepted, "What we are known for".')]
    out = []
    for img, name, note in items:
        out.append(f'<div class="th"><img src="{f(os.path.join(SC, img))}"><div><b>{E(name)}</b><p>{E(note)}</p></div></div>')
    return ''.join(out)


doc = f'''<!doctype html><html><head><meta charset="utf-8"><style>
@page {{ size: Letter; margin: 0.55in 0.6in 0.6in; }}
body {{ font-family: Inter, sans-serif; color: #1B1830; font-size: 10pt; line-height: 1.42; margin: 0; }}
.cover {{ page-break-after: always; padding-top: .3in; }}
.brand {{ color: #6D4AE8; font-weight: 700; letter-spacing: .08em; font-size: 10pt; text-transform: uppercase; }}
h1 {{ font-size: 28pt; line-height: 1.08; margin: 10px 0; }}
h2 {{ font-size: 16pt; margin: 22px 0 6px; page-break-after: avoid; }}
h2 small {{ color: #6D4AE8; font-size: 9pt; letter-spacing: .08em; display: block; text-transform: uppercase; }}
.sub {{ color: #6B6880; font-size: 11.5pt; }}
.box {{ background: #F1ECFE; border-radius: 10px; padding: 10px 14px; margin: 10px 0; }}
.box b {{ color: #6D4AE8; }}
ul {{ margin: 4px 0; padding-left: 18px; }} li {{ margin: 3px 0; }}
table {{ border-collapse: collapse; width: 100%; font-size: 8.8pt; }}
th {{ text-align: left; background: #F1ECFE; padding: 6px 8px; }}
td {{ border-top: 1px solid #E6E3EF; padding: 5px 8px; vertical-align: top; }}
td.k {{ font-weight: 700; width: 22%; }} td.no {{ color: #8A6400; }} td.yes {{ color: #156E4B; }}
tr {{ page-break-inside: avoid; }}
.th {{ display: flex; gap: 12px; margin: 8px 0; page-break-inside: avoid; }}
.th img {{ width: 190px; height: 230px; object-fit: cover; object-position: top; border: 1px solid #ddd; border-radius: 6px; }}
.th p {{ margin: 4px 0 0; color: #3a3552; }}
.log {{ font-family: "JetBrains Mono", monospace; font-size: 8pt; color: #4A3BB0; }}
.mut {{ color: #6B6880; }}
.pb {{ page-break-before: always; }}
</style></head><body>
<div class="cover"><div class="brand">Tooth Referral · Prepared for Vejay</div>
<h1>Web form vs referral software: the comparison, the referral journey, and the brand-awareness campaign</h1>
<div class="sub">Four real referral pages reviewed, one referral recreated two ways, every program feature mapped, "Day in the Life of an Endodontic Start-up", and the first videos and carousels.</div>
<div class="box"><b>What we found, in one line.</b> Every web form we reviewed ends at "Submit": an email, a PDF, or a portal login. Tooth Referral is the only one that turns a referral into a tracked, shared case that both offices can see, update and close.</div>
<h2><small>Summary</small>Five reasons a specialist should replace the web form</h2>
<ul>
<li><b>A form has no "after".</b> No confirmation, no status, no owner. The referral becomes an email and depends on someone remembering it.</li>
<li><b>The referring office is left in the dark.</b> General dentists stop referring over silence. Tooth Referral shows them every status change automatically and lets them message on the case.</li>
<li><b>Paperwork travels separately.</b> X-rays and insurance arrive by fax or email, or not at all. In Tooth Referral they are on the case, and the patient can upload the insurance card through a secure link.</li>
<li><b>Security and friction.</b> One page asks for Social Security numbers on a public form; another needs a Doctor ID, password and a math question. Tooth Referral is HIPAA compliant and encrypted, with no access codes.</li>
<li><b>No data, no safety net.</b> A form can't flag a cold referral or a missing completion note. Tooth Referral's Needs attention and analytics do, and the system survives staff turnover.</li>
</ul>
<div class="box"><b>Produced with this report:</b> 2 short videos (carousels/vejay-brief and reel/renders: camp-form-vs-software.mp4, camp-day-in-the-life.mp4) and 2 carousels of 8 slides (PDF + PNG). Earlier deliverables that support the campaign: the analytics demo video, scripts 13-18, the Flow prompts.</div>
</div>

<h2><small>1 · Research</small>The four referral pages we reviewed</h2>
{thumbs()}

<h2 class="pb"><small>2 · Comparison</small>Web form vs Tooth Referral, point by point</h2>
<table><tr><th></th><th>Typical web form / portal (what we saw)</th><th>Tooth Referral</th></tr>
{''.join(f'<tr><td class="k">{E(a)}</td><td class="no">{E(b)}</td><td class="yes">{E(c)}</td></tr>' for a, b, c in ROWS)}</table>

<h2 class="pb"><small>3 · The referral, recreated</small>Same referral, two journeys (with the audit trail)</h2>
<p class="mut">The invitation to Periodontal Associates goes to your account, so we could not open that office from here. This timeline recreates the same kind of referral from the product's documented behaviour and the activity-log format in the dashboard recordings (who, when, what). Send us a screen recording or screenshots of the Periodontal Associates conversation and audit trail and we will mirror the exact events, timestamps and messages in the video.</p>
<table><tr><th style="width:12%">When</th><th style="width:30%">With a web form</th><th style="width:30%">With Tooth Referral</th><th>Audit trail entry</th></tr>
{''.join(f'<tr><td class="k">{E(a)}</td><td class="no">{E(b)}</td><td class="yes">{E(c)}</td><td class="log">{E(d)}</td></tr>' for a, b, c, d in JOURNEY)}</table>
<div class="box"><b>The difference in one sentence:</b> with a form, the referral's history lives in inboxes, voicemails and people's memory; with Tooth Referral it lives on the case, and both offices can see it.</div>

<h2><small>4 · Why it's necessary</small>The business case (from the client call of Nov 5)</h2>
<ul><li>Cost about $150-$300 a month. Saving referrals that would have slipped: potentially about $5,000 a year. New referrals from the network: potentially $5,000-$10,000 a year.</li>
<li>Over 10 years, up to about $150,000 back on $10,000-$15,000 spent (roughly 10x), including about 5-10% practice value from a turnkey, data-backed referral system.</li>
<li>One referral that doesn't leak pays for the system; one saved after staff turnover covers a whole year. Set-up takes about five minutes.</li></ul>

<h2 class="pb"><small>5 · Product knowledge</small>Every feature, mapped</h2>
<table>{''.join(f'<tr><td class="k">{E(a)}</td><td>{E(b)}</td></tr>' for a, b in FEATURES)}</table>
<p class="mut">Talking-head script, "The SSN question" (30 s): "I looked at specialist referral forms this week. One of them asks the referring office for the patient's Social Security number, on a public web page. That's not a referral system. That's a liability. With Tooth Referral, the referral is a case: HIPAA compliant, encrypted, shared only with the two offices, and nobody types a Social Security number into a website. Set up in about five minutes."</p>

<h2 class="pb"><small>6 · Story</small>Day in the Life of an Endodontic Start-up</h2>
<table>{''.join(f'<tr><td class="k">{E(a)}</td><td>{E(b)}</td></tr>' for a, b in STORY)}</table>
<div class="box"><b>Video 2 narration (produced):</b> "Day one of my endodontic practice. The chairs are in, the CBCT works, and the website goes live tomorrow. Every specialist website has a referral form. Mine almost did too. Then I asked one question: what happens after a dentist hits submit? With a form, it lands in an inbox. With Tooth Referral, it lands in a pipeline. So I embedded Tooth Referral on my website... Week four, my analytics show every referral, who sent it, and how fast we called. Twenty-eight referrals, first contact in under four hours. Starting a practice is hard. Losing referrals shouldn't be part of it."</div>
<p class="mut">Start-up checklist (carousel copy): website live with the Tooth Referral form embedded; locations and doctors added; insurance accepted listed; "What we are known for" filled; network invited; consultation note template saved; email notifications set; first analytics review at week 4.</p>

<h2 class="pb"><small>7 · Campaign</small>Brand-awareness content plan (two concepts)</h2>
<table><tr><th>Format</th><th>Piece</th><th>Status</th><th>Concept</th></tr>
{''.join(f'<tr><td class="k">{E(a)}</td><td>{E(b)}</td><td>{E(c)}</td><td>{E(d)}</td></tr>' for a, b, c, d in PLAN)}</table>
<h2>Post captions (ready to use)</h2>
<table>{''.join(f'<tr><td class="k">{E(a)}</td><td>{E(b)}</td></tr>' for a, b in CAPTIONS)}</table>
<p class="mut">Rules applied: competitors are never named or shown in public posts (the web form and inbox in the videos are neutral mock-ups); "general dentist", never "GP"; staff names only, no doctors' names; the front desk is never the joke. Analytics numbers come from the canonical analytics reference.</p>
</body></html>'''

H = os.path.join(HERE, 'report.html')
open(H, 'w').write(doc)
js = f'''const {{ chromium }} = require('playwright');
(async () => {{ const b = await chromium.launch(); const p = await b.newPage(); await p.goto('file://{H}'); await p.evaluate(() => document.fonts.ready);
await p.pdf({{ path: '{OUT}', format: 'Letter', printBackground: true, preferCSSPageSize: true, displayHeaderFooter: true, headerTemplate: '<div></div>',
footerTemplate: '<div style="font-family:Inter;font-size:8px;color:#8a879a;width:100%;padding:0 0.6in;display:flex;justify-content:space-between"><span>Tooth Referral · Form vs Software and campaign</span><span class="pageNumber"></span></div>' }});
await b.close(); }})();'''
open(os.path.join(HERE, 'report.cjs'), 'w').write(js)
subprocess.run(['node', os.path.join(HERE, 'report.cjs')], check=True)
os.remove(os.path.join(HERE, 'report.cjs'))
os.remove(H)
print(OUT)
