"""Scripts 21-23: the feature series that builds from Buried in Emails (Vejay, 2026-11-13).

Vejay: "It's time to build from the first video, the buried one. The second supports the first but does not show
Tooth Referral as a software solution. Focus on showing the features of the software. The hook was established; now
people need to turn the page with curiosity. The new video needs to reinforce the hook. Send me topics before you
produce the next video: hook, goal, and how it builds from the first video."
So: same front desk and people as Buried in Emails (Tanya, Amanda, then Greg), each episode pays off a promise made
in video 1 by showing the real screens, and each ends on a question that opens the next one. Script only, no prompts.
Features are limited to PLATFORM-FEATURES.md. Rules: no "GP", no doctors' names, no "EHR" abbreviation, no red."""
import html, os, subprocess
E = html.escape
D = '/home/user/awesome-opus-5-5-prompts/scripts-incoming-referrals'
PDF = os.path.join(D, 'Scripts-21-23-Feature-Series-After-Buried-In-Emails.pdf')
FONTS = '/home/user/awesome-opus-5-5-prompts/reel/public/fonts'

SCRIPTS = [
 dict(n=21, ep=2, title="The Form That Isn't a Form", sub='How a referral arrives: the website referral form',
  cast='Tanya and Amanda, at the same front desk as Buried in Emails. The morning after the team meeting.',
  topic='The website referral form: build it yourself in minutes, put it on your site, and every referral it receives starts a case instead of an email.',
  hook='"The team said yes. So where do we even start?" · "With the form on our website. The one that just sends an email."',
  goal='Show the first thing a new office does in the software, on screen, step by step. The viewer should think: "I could set that up this afternoon."',
  builds='In video 1 Amanda said: "We replaced the form on our website with Tooth Referral. Every referral came in as one case." Video 1 only said it. This episode shows the replacement being built and the first test referral landing as one case.',
  features=['Website Lead Forms · Referral Web Form', 'Logo and welcome message', 'Insurance Accepted display', '"What we are known for" skill tags', 'Specialty and doctor routing', 'Form field toggles (tooth numbers, chief complaint, X-rays)', 'Live preview', 'Referral Access Code for regular referring offices', 'Get embed code', 'The referral lands in Incoming as one case'],
  turn='Ends on: "That\'s just how it arrives. Tomorrow, let\'s see how Greg does without you." (opens Script 22)',
  end='Tooth Referral. Not just a form. A system. · toothreferral.com',
  clips=[
   ('Where do we start?', [('Tanya', 'The team said yes. So where do we even start?'), ('Amanda', 'With the form on our website. The one that just sends an email.')],
    'Full frame. The old website form from video 1 appears small beside them with an email icon, greyed out.'),
   ('Replace it', [('Amanda', 'Website Lead Forms. Referral Web Form. This replaces it.'), ('Tanya', 'We build it ourselves?')],
    'Website Lead Forms page: the "Referral Web Form for Dental Specialists" card. Amanda clicks it; the builder opens.'),
   ('Make it ours', [('Amanda', 'Our logo. A welcome message. And the insurance we accept, so nobody has to call and ask.')],
    'Builder, left side: logo upload, welcome message, the Insurance Accepted display. Each lights up as she names it.'),
   ('Known for', [('Tanya', "'What we are known for.' Implants, wisdom teeth..."), ('Amanda', 'And it routes each referral to the right doctor.')],
    'The "What we are known for!" skill tags being added, then Specialty & Doctor Routing.'),
   ('Click, click, click', [('Amanda', 'Now pick what the dentist fills in. Tooth numbers. Chief complaint. X-rays.'), ('Tanya', 'Click, click, click.')],
    'The toggles switch on one by one: Tooth Numbers, Chief Complaint, Referral Status, uploads.'),
   ('Live preview', [('Tanya', "And that's what they'll see?"), ('Amanda', 'Live preview. Exactly what Gentle Dental sees on our site.')],
    'The Live patient preview on the right updates as each toggle changes: "Create New Referral".'),
   ('Access code', [('Amanda', 'Offices that refer to us a lot get an access code. Their details fill in by themselves.'), ('Tanya', 'So Greg never types his address again.')],
    'Referral Access Code (Company Access PIN). On the form, entering the PIN auto-fills the referring office details.'),
   ('Embed', [('Amanda', 'Get embed code. Paste it on the website. Done.'), ('Tanya', "That's it?")],
    'The "Get embed code" button, the code copied, then the form live on the practice website.'),
   ('Test it', [('Tanya', "Okay, test it. I'm Gentle Dental, sending a patient... Submit.")],
    'The website form filled in quickly (patient, tooth number, X-ray attached) and submitted.'),
   ('Not an email', [('Amanda', 'Now look at Incoming.'), ('Tanya', "It's already here. One case. Not an email.")],
    'Incoming referrals list: the new row slides in with status "New". The greyed-out email icon from clip 1 dissolves.'),
   ('A system behind it', [('Tanya', 'Same form on the outside. A whole system behind it.'), ('Amanda', "That's just how it arrives. Tomorrow, let's see how Greg does without you.")],
    'Full frame. End card.'),
  ]),
 dict(n=22, ep=3, title="Tanya's Day Off", sub='How a referral is worked: anyone can pick it up',
  cast='Greg and Amanda, same front desk, the next morning. Tanya is out.',
  topic='Tracking and follow-up when a person is out: statuses on every referral, next-step reminders, automatic updates to the referring office, the insurance request link and the notifications feed.',
  hook='"Tanya\'s out today. A month ago, that meant her referrals were out too."',
  goal='Prove the "system for the team" idea with features. The viewer sees a colleague pick up every open referral in minutes and understands this is what protects the practice when staff are out.',
  builds='In video 1 Tanya asked: "So if I\'m out tomorrow..." and Amanda answered: "Greg opens it and knows exactly where it stands. No digging through anyone\'s email." This episode is that exact day. It also answers the old problem from video 1: "every referral lives in someone\'s inbox or someone\'s head".',
  features=['Incoming list with status filter', 'Contact statuses (Left a Voicemail, Callback Requested)', 'Next-step reminders', 'Scheduling from the status chips', 'Automatic status updates to the referring office', 'Request insurance from the patient (secure link)', 'Notifications feed'],
  turn='Ends on: "What about the letters after treatment?" · "Oh, those write themselves. Ask Tanya tomorrow." (opens Script 23)',
  end='Tooth Referral. Whoever opens it knows where it stands. · toothreferral.com',
  clips=[
   ('Out today', [('Amanda', "Morning, Greg. Tanya's out today."), ('Greg', "I know. A month ago, that would've scared me.")],
    'Full frame. Amanda walks in with coffee; Greg is already at Tanya\'s workstation. Chip: "Tanya · out today".'),
   ('Everything she had', [('Greg', 'Now I just open Incoming. Everything she was working on. Each one with a status.')],
    'Incoming referrals list: rows with different status pills. He uses the Status filter.'),
   ('Where she stopped', [('Greg', "Michael Turner. 'Left a voicemail', yesterday, ten past four."), ('Amanda', 'So you know exactly where she stopped.')],
    'The case: Status & Schedule chips with "Left a Voicemail" selected and the time it was set.'),
   ('The reminder', [('Greg', "And she set a reminder. 'Check back in two business days.' It came to me this morning.")],
    '"Next Step: Check back in 2 business days? Remind me on..." Then the reminder notification arriving today.'),
   ('He called back', [('Greg', 'He just called back. Consultation scheduled. Tuesday, ten a.m.')],
    'Greg clicks Consultation Scheduled, picks the date, Save & update status. Green success toast.'),
   ('They already know', [('Amanda', 'Does his dentist need a call?'), ('Greg', 'They get the update automatically. Every status change.')],
    'Split: the referring office (Gentle Dental) sees the same referral now marked "Consultation Scheduled".'),
   ('Missing insurance', [('Greg', "This one's missing insurance. Before, I'd be calling the patient all day."), ('Amanda', 'And now?')],
    'Another case: the Insurance cards panel is empty. The button "Request from patient" pulses.'),
   ('Request from patient', [('Greg', 'Request from patient. She gets a secure link and takes a picture of her card. Sent.')],
    'Click on Request from patient. Green toast: "Success · Insurance request sent".'),
   ('She sent it', [('Amanda', 'And we find out how?'), ('Greg', "Right here. 'Patient submitted insurance.' Front and back, on the case.")],
    'Notifications feed: "patient submitted insurance". The card images appear in the Insurance panel.'),
   ('Everything that moved', [('Greg', 'Notifications shows me everything that moved. Every office we work with, one feed.')],
    'Notifications feed with the tabs All / Unread / Read and the Type filter (Status, Mentions, Insurance Submission).'),
   ('Twenty minutes', [('Amanda', "Twenty minutes, and nothing's waiting on Tanya."), ('Greg', 'What about the letters after treatment?'), ('Amanda', 'Oh, those write themselves. Ask Tanya tomorrow.')],
    'Full frame. Behind them, every row on the Incoming list has moved on one step. End card.'),
  ]),
 dict(n=23, ep=4, title='The Letter That Writes Itself', sub='How a referral is closed: notes, signed and sent before five',
  cast='Tanya and Amanda, same front desk, late afternoon. Amanda has her coat on.',
  topic='Notes: templates that fill themselves in, your own letter imported from Word, e-signature, the signed note on the case for both offices, and copy into your electronic health record.',
  hook='"It\'s ten to five, and Tanya has three completion letters to send. Why does she look so calm?"',
  goal='Show the feature most offices do not expect from a "referral form": the paperwork after treatment. The viewer should see the letter fill itself in and get signed, and want to try it on their own letters.',
  builds='Video 1 opened with a patient who never got a call back and a team "losing steam". This is the other end of the same referral: the loop closes on time, without staying late. It completes the journey the series has followed since video 1: arrives (21), worked (22), closed (23).',
  features=['Status change prompts the note', 'Note templates with smart variables (auto-filled)', 'Import your own letter from Word or PDF', 'Show values / preview', 'Who signs: route to a doctor to sign', 'E-signature (DocuSign)', 'Signed notes visible to both offices', 'Copy into your electronic health record', 'Save as a new template'],
  turn='Ends on: "You know who should see this? The doctor." · "From the owner\'s chair? The numbers are a whole other conversation." (opens the Analytics episode)',
  end='Tooth Referral. Completion letters that write themselves. · toothreferral.com',
  clips=[
   ('Ten to five', [('Amanda', "It's ten to five. Why do you look so calm?"), ('Tanya', 'Three completion letters to send. Watch this.')],
    'Full frame. Clock chip: 4:50 PM. A small stack of three "Completion letter" cards beside Tanya.'),
   ('It asks for the note', [('Tanya', "Emma Park's treatment is done. I mark it Completed..."), ('Amanda', '...and it asks you for the note.')],
    'She clicks Completed. The note creator opens by itself ("Prepare note").'),
   ('Our own letter', [('Tanya', "That's our own letter. We imported it from Word. Now look at the names.")],
    'Template picker, then the letter. "Import from Word / PDF" button visible. The purple variable chips light up one by one.'),
   ('All filled in', [('Tanya', "Her name, date of birth, the referring office, today's date. All filled in."), ('Amanda', "You didn't type any of that?")],
    'Close-up of the letter: Patient Name, Patient DOB, Referring Office Name, Today\'s Date switch from codes to real values (Show values).'),
   ('Two lines', [('Tanya', 'It pulls it from the case. I just add two lines about the visit.')],
    'She types two short lines in the body. Preview.'),
   ('Route it', [('Amanda', 'But the doctor has to sign it.'), ('Tanya', 'So I route it to the doctor. One click.')],
    '"Who signs this note?" · I\'ll sign it myself · Sign on behalf of a doctor · Route to a doctor to sign (selected).'),
   ('Signed', [('Tanya', 'Signed. No printing, no scanning, no fax.')],
    'The e-signature step: signature placed, Finish, then "All done — your document is signed!" and the green success toast.'),
   ('Both offices', [('Amanda', 'And Gentle Dental?'), ('Tanya', "It's on the case. Greg can open it right now.")],
    'Signed notes panel: "Completion Note · Signed · Visible to both offices". Split: the same note on Gentle Dental\'s side.'),
   ('Our chart', [('Amanda', 'What about our own chart?'), ('Tanya', 'Copy, paste. Straight into our electronic health record.')],
    'The line "Copy and paste into your patient electronic health record as a note" with the copy action highlighted.'),
   ('Next time', [('Tanya', "And I saved it as a new template. Next time, it's one click."), ('Amanda', 'We used to stay late for those letters.')],
    '"Save as New Template". The three letter cards from clip 1 tick off: sent, sent, sent. Clock chip: 4:58 PM.'),
   ("The owner's chair", [('Amanda', 'You know who should see this? The doctor.'), ('Tanya', "From the owner's chair? Oh, the numbers are a whole other conversation.")],
    'Full frame. Tanya picks up her bag. A one-second glimpse of the Analytics page, blurred. End card.'),
  ]),
]

css = f'''@page {{ size: A4; margin: 15mm 14mm; }}
@font-face {{ font-family: Jakarta; src: url(file://{FONTS}/plus-jakarta-sans-latin-800-normal.woff2); font-weight: 800; }}
@font-face {{ font-family: InterW; src: url(file://{FONTS}/inter-latin-500-normal.woff2); font-weight: 500; }}
@font-face {{ font-family: InterW; src: url(file://{FONTS}/inter-latin-700-normal.woff2); font-weight: 700; }}
body {{ font-family: InterW, sans-serif; color: #16132B; font-size: 10.2pt; line-height: 1.48; }}
h1 {{ font-family: Jakarta; font-size: 25pt; letter-spacing: -.02em; margin: 1mm 0 2mm; line-height: 1.08; }}
h2 {{ font-family: Jakarta; font-size: 15pt; margin: 5mm 0 2mm; }}
.k {{ color: #6D4AE8; font-weight: 700; font-size: 8.6pt; letter-spacing: .12em; text-transform: uppercase; }}
.box {{ border: 1px solid #E4DBFF; border-radius: 3mm; padding: 3.5mm 4.5mm; margin: 3mm 0; background: #FBFAFF; page-break-inside: avoid; }}
.amber {{ border-color: #F3D9A4; background: #FFF8EA; }}
.page {{ page-break-before: always; }}
.small {{ color: #6B7085; font-size: 8.8pt; }}
table {{ width: 100%; border-collapse: collapse; }}
td, th {{ vertical-align: top; padding: 2.2mm 2.5mm; border-bottom: 1px solid #ECE8FA; text-align: left; }}
th {{ font-size: 8.4pt; letter-spacing: .1em; text-transform: uppercase; color: #6D4AE8; border-bottom: 1.5px solid #6D4AE8; }}
tr {{ page-break-inside: avoid; }}
.n {{ font-family: Jakarta; font-size: 13pt; color: #6D4AE8; width: 9mm; }}
.t {{ font-weight: 700; font-size: 9.2pt; color: #6D4AE8; }}
.sp {{ font-weight: 700; }}
.ln {{ font-size: 10.6pt; margin-top: .6mm; }}
.scr {{ font-size: 8.9pt; color: #3A3F55; width: 62mm; }}
.grid td {{ border: none; padding: 1.2mm 2mm 1.2mm 0; }}
.grid td:first-child {{ font-weight: 700; width: 36mm; color: #6D4AE8; }}
.chips span {{ display: inline-block; background: #F1ECFF; color: #4B2FB8; border-radius: 3mm; padding: .6mm 2.4mm; margin: .7mm 1mm .7mm 0; font-size: 8.6pt; font-weight: 700; }}
ul {{ margin: 1mm 0; padding-left: 5mm; }}'''

def words(s): return sum(len(l.split()) for c in s['clips'] for _, l in c[1])
over = ''.join(f'''<div class="box"><div class="sp" style="font-size:11.5pt">Script {s['n']} · Episode {s['ep']} · {E(s['title'])} <span class="small">({E(s['sub'])})</span></div>
<table class="grid" style="margin-top:1.5mm"><tr><td>Topic</td><td>{E(s['topic'])}</td></tr><tr><td>Hook</td><td>{E(s['hook'])}</td></tr><tr><td>Goal</td><td>{E(s['goal'])}</td></tr>
<tr><td>Builds from video 1</td><td>{E(s['builds'])}</td></tr><tr><td>Turns the page</td><td>{E(s['turn'])}</td></tr></table></div>''' for s in SCRIPTS)
parts = [f'''<div class="k">Tooth Referral · Scripts 21 to 23 · the feature series</div>
<h1>After "Buried in Emails": now show the software</h1>
<p>Three scripts that build from the first video. Same front desk, same people (Tanya and Amanda, then Greg). Video 1 set the hook: referrals buried in emails, voicemails and faxes, and one promise, "every referral came in as one case". Each new episode takes one part of that promise and <b>shows it on the real screens</b>, feature by feature, and ends on a question that makes the viewer want the next one.</p>
<div class="box amber"><b>Vejay's notes this answers (13 Nov)</b><ul>
<li>"Build from the first video, the buried one." Every episode quotes a line from video 1 and pays it off.</li>
<li>"Focus on showing the features of the software." Each clip names the exact Tooth Referral screen on view; the dialogue is two colleagues using it, not describing it.</li>
<li><b>A different feature set in every script (no repeats):</b> 21 is how a referral <b>arrives</b> (the website form), 22 is how it is <b>worked</b> (statuses, reminders, insurance request, notifications), 23 is how it is <b>closed</b> (notes and e-signature).</li>
<li>"People need to turn the page with curiosity." Each script ends on an open question that the next episode answers.</li>
<li>"Send me topics before you produce: hook, goal, and how it builds from the first video." The topics are below; nothing gets produced until you approve them.</li></ul></div>
<h2>Topics for approval</h2>
{over}
<p class="small" style="margin-top:3mm">Each script: 11 clips of about 8 seconds (about 90 seconds). Horizontal 16:9 like video 1, with the split-screen dashboard. Script only; filming prompts come after approval. Demo data: Gentle Dental (general dentist) refers to the specialist office where Tanya, Amanda and Greg work. No doctors are named.</p>''']
for s in SCRIPTS:
    rows = ''.join(f'''<tr><td class="n">{i:02d}</td><td><div class="t">{E(c[0])}</div>{''.join(f'<div class="ln"><span class="sp">{E(sp)}:</span> “{E(l)}”</div>' for sp, l in c[1])}</td><td class="scr">{E(c[2])}</td></tr>''' for i, c in enumerate(s['clips'], 1))
    parts.append(f'''<div class="page"><div class="k">Script {s['n']} · Episode {s['ep']} of the series</div>
<h1>{E(s['title'])}</h1><p class="small" style="font-size:10.5pt">{E(s['sub'])} · 11 clips · about 90 seconds · {words(s)} spoken words</p>
<div class="box"><table class="grid">
<tr><td>Topic</td><td>{E(s['topic'])}</td></tr>
<tr><td>Hook</td><td>{E(s['hook'])}</td></tr>
<tr><td>Goal</td><td>{E(s['goal'])}</td></tr>
<tr><td>Builds from video 1</td><td>{E(s['builds'])}</td></tr>
<tr><td>Turns the page</td><td>{E(s['turn'])}</td></tr>
<tr><td>Cast and set</td><td>{E(s['cast'])}</td></tr></table>
<div class="chips" style="margin-top:2mm"><b style="font-size:8.6pt;color:#6D4AE8">FEATURES SHOWN</b><br>{''.join(f'<span>{E(f)}</span>' for f in s['features'])}</div></div>
<h2>The script</h2>
<table><tr><th></th><th>Dialogue</th><th>On screen (Tooth Referral)</th></tr>{rows}</table>
<div class="box" style="margin-top:4mm"><b>End card:</b> {E(s['end'])}</div></div>''')
doc = os.path.join(D, 'src', '_s2123.html'); js = os.path.join(D, 'src', '_s2123.cjs')
open(doc, 'w').write(f'<html><head><meta charset="utf-8"><style>{css}</style></head><body>{"".join(parts)}</body></html>')
open(js, 'w').write(f'''const {{ chromium }} = require('playwright');
(async () => {{ const b = await chromium.launch(); const p = await b.newPage(); await p.goto('file://{doc}');
await p.evaluate(() => document.fonts.ready); await p.pdf({{ path: '{PDF}', format: 'A4', printBackground: true }}); await b.close(); }})();''')
subprocess.run(['node', js], check=True)
os.remove(doc); os.remove(js)
for s in SCRIPTS:
    print(s['n'], s['title'], words(s), 'words', max(sum(len(l.split()) for _, l in c[1]) for c in s['clips']), 'max/clip')
