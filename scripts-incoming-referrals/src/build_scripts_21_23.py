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
 dict(n=21, ep=2, title='One Case', sub='The first referral arrives',
  cast='Tanya and Amanda, at the same front desk as Buried in Emails. Monday morning, first day on Tooth Referral.',
  topic='What a referral looks like when it arrives in Tooth Referral: one case, already complete.',
  hook='"Last week this referral would have been an email, a voicemail and a fax. Watch it arrive today."',
  goal='Show the product, not talk about it. The viewer sees one referral open as one case and thinks: "I want my Monday to look like that."',
  builds='In video 1 Amanda promised: "Every referral came in as one case... X-rays, insurance, messages, status. Whoever opens it sees everything." This episode shows exactly that promise on screen, one click at a time, with the same email-voicemail-fax referral from video 1.',
  features=['Incoming referrals list', 'The case: procedures, tooth number, chief complaint', 'X-rays and the signed referral, shared with both offices', 'Insurance cards (front and back)', 'Office Communication with @mentions', 'Status chips and scheduling', 'Status updates to the referring office', 'Activity log'],
  turn='Ends on: "Wait till you see what it does with the completion letter." (opens Script 22)',
  end='Tooth Referral. One case for every referral. · toothreferral.com',
  clips=[
   ('First morning', [('Tanya', "Okay. First morning on Tooth Referral. Last week, this one referral was an email, a voicemail and a fax."), ('Amanda', 'And today?')],
    'Full frame on the two of them. The three pop-ups from video 1 (email, voicemail, fax) appear greyed out, then fade.'),
   ('One line', [('Tanya', "One line. Emma Park, from Gentle Dental. It just says... New.")],
    'Incoming referrals list. A new row slides in: patient, referring office, status "New", the green Connected Network Member dot.'),
   ('Already here', [('Tanya', "Wait. Her X-rays are already here. And the signed referral."), ('Amanda', 'Gentle Dental attached them when they sent it.')],
    'Inside the case: Attachments "shared with both offices" (X-rays), then Signed notes "Visible to both offices".'),
   ('Nothing to ask', [('Tanya', "Tooth number, chief complaint, 'please consult and treat'. I don't have to call and ask anything.")],
    'Referral Status block: type, chief complaint, numbered procedure with tooth and diagnosis. Purple highlight on each as she reads.'),
   ('The card', [('Amanda', 'Check the insurance.'), ('Tanya', "Front and back of the card. Policy, group. I'm not retyping a thing.")],
    'Insurance cards panel: front and back images, policy and group numbers.'),
   ('Ask on the case', [('Tanya', 'I do have one question for them, though.'), ('Amanda', "Ask it right there. Type 'at Greg'.")],
    'Office Communication panel opens. Cursor in the message box, "@" brings up Greg (Gentle Dental).'),
   ('He answered', [('Tanya', "'Is she okay with mornings?'... He already answered. 'Mornings are perfect.'")],
    'The message sends with the @Greg mention highlighted; the reply from Greg (Gentle Dental · Front Desk) arrives under it.'),
   ('Set the status', [('Amanda', 'Now set the status.'), ('Tanya', 'Consultation scheduled. Thursday, nine a.m.')],
    'Status & Schedule chips. She clicks Consultation Scheduled, picks the date, Save & update status. Green success toast.'),
   ('They already know', [('Tanya', "Does Gentle Dental know she's booked?"), ('Amanda', 'They just got the update. Nobody has to call anybody.')],
    'Split: on Gentle Dental\'s side the same case now shows "Consultation Scheduled". A notification: "consultation scheduled".'),
   ('Every step', [('Tanya', 'And down here... every step. Who did it, and when.'), ('Amanda', "So if you're out, I'm not guessing.")],
    'Activity log: created by Gentle Dental, X-rays added, message sent, consultation scheduled, each with a name and time.'),
   ('Four minutes', [('Tanya', 'That took four minutes. Last week it was half my morning.'), ('Amanda', 'Wait till you see what it does with the completion letter.')],
    'Back to full frame. Tanya leans back, surprised. End card.'),
  ]),
 dict(n=22, ep=3, title='The Letter That Writes Itself', sub='Completion notes, signed and sent before five',
  cast='Tanya and Amanda, same front desk, late afternoon. Amanda has her coat on.',
  topic='Notes: templates that fill themselves in, e-signature, the signed note on the case for both offices, and copy into your electronic health record.',
  hook='"It\'s ten to five, and Tanya has three completion letters to send. Why does she look so calm?"',
  goal='Show the feature most offices do not expect from a "referral form": the paperwork after treatment. The viewer should see the letter fill itself in and get signed, and want to try it on their own letters.',
  builds='Video 1 opened with a patient who never got a call back and a team "losing steam". This is the other end of the same referral: the loop closes on time, without staying late. It also pays off the last line of Script 21 ("wait till you see what it does with the completion letter").',
  features=['Status change prompts the note', 'Note templates with smart variables (auto-filled)', 'Import your own letter from Word or PDF', 'Who signs: route to a doctor to sign', 'E-signature (DocuSign)', 'Signed notes visible to both offices', 'Copy into your electronic health record', 'Private Administrative Notes and reminders'],
  turn='Ends on: "So what happens when one of us is out?" · "Ask Greg tomorrow. I\'m taking the day off." (opens Script 23)',
  end='Tooth Referral. Completion letters that write themselves. · toothreferral.com',
  clips=[
   ('Ten to five', [('Amanda', "It's ten to five. Why do you look so calm?"), ('Tanya', 'Three completion letters to send. Watch this.')],
    'Full frame. Clock chip: 4:50 PM. A small stack of three "Completion letter" cards beside Tanya.'),
   ('It asks for the note', [('Tanya', "Emma Park's treatment is done. I change the status to Completed..."), ('Amanda', '...and it asks you for the note.')],
    'Status chips: she clicks Completed. The note creator opens by itself ("Prepare note").'),
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
   ('Just for us', [('Tanya', "And this stays with us. 'Call Emma Friday.' With a reminder."), ('Amanda', 'We used to stay late for those letters.')],
    'Administrative Notes: "Company-private notes. Not shared with other parties." Then "Remind me on Friday".'),
   ('Day off', [('Amanda', 'So what happens when one of us is out?'), ('Tanya', "Ask Greg tomorrow. I'm taking the day off.")],
    'Full frame. Tanya picks up her bag, smiling. Clock chip: 4:58 PM. End card.'),
  ]),
 dict(n=23, ep=4, title="Tanya's Day Off", sub='Anyone can pick it up',
  cast='Greg and Amanda, same front desk, the next morning. Tanya is out.',
  topic='The system keeps working when a person is out: statuses, private notes, reminders, the insurance request link and the notifications feed.',
  hook='"Tanya\'s out today. A month ago, that meant her referrals were out too."',
  goal='Prove the "system for the team" idea with features. The viewer sees a colleague pick up every open referral in minutes and understands this is what protects the practice when staff are out.',
  builds='In video 1 Tanya asked: "So if I\'m out tomorrow..." and Amanda answered: "Greg opens it and knows exactly where it stands. No digging through anyone\'s email." This episode is that exact day. It also answers the old problem from video 1: "every referral lives in someone\'s inbox or someone\'s head".',
  features=['Incoming list with statuses and filters', 'Contact statuses (Left a Voicemail, Callback Requested)', 'Private Administrative Notes', 'Next-step reminders', 'Request insurance from the patient (secure link)', 'Notifications feed (patient submitted insurance, messages, notes signed)', 'Office Communication with the referring office'],
  turn='Ends on: "The doctor should see what this looks like from the owner\'s chair." · "The numbers? That\'s a whole other conversation." (opens the Analytics episode)',
  end='Tooth Referral. Whoever opens it knows where it stands. · toothreferral.com',
  clips=[
   ('Out today', [('Amanda', "Morning, Greg. Tanya's out today."), ('Greg', "I know. A month ago, that would've scared me.")],
    'Full frame. Amanda walks in with coffee; Greg is already at Tanya\'s workstation. Chip: "Tanya · out today".'),
   ('Everything she had', [('Greg', 'Now I just open Incoming. Everything she was working on. Each one with a status.')],
    'Incoming referrals list: rows with different status pills. He uses the Status filter.'),
   ('Where she stopped', [('Greg', "Michael Turner. 'Left a voicemail', yesterday, ten past four. And her note: 'Try his cell after lunch.'")],
    'The case: status "Left a Voicemail" with the time. Administrative Notes shows Tanya\'s private note.'),
   ('The reminder', [('Amanda', 'So you know exactly where she stopped.'), ('Greg', 'And the reminder came to me this morning.')],
    'Notification: reminder for Michael Turner today. "Next step: Remind me on..." shown on the case.'),
   ('Missing insurance', [('Greg', "This one's missing insurance. Before, I'd be calling the patient all day."), ('Amanda', 'And now?')],
    'Another case: the Insurance cards panel is empty. The button "Request from patient" pulses.'),
   ('Request from patient', [('Greg', 'Request from patient. She gets a secure link and takes a picture of her card. Sent.')],
    'Click on Request from patient. Green toast: "Success · Insurance request sent". The Activity log adds the entry.'),
   ('She sent it', [('Amanda', 'And we find out how?'), ('Greg', "Right here. 'Patient submitted insurance.' Front and back, on the case.")],
    'Notifications feed: "patient submitted insurance". Then the card images appear in the Insurance panel.'),
   ('Everything that moved', [('Greg', 'Notifications shows me everything that moved. A new referral, a message, a note signed.'), ('Amanda', 'From every office we work with.')],
    'Notifications feed with the tabs All / Unread / Read and the Type filter (Status, Mentions, Insurance Submission).'),
   ('Any update?', [('Amanda', 'Gentle Dental just messaged.'), ('Greg', "'Any update on Michael Turner?' I answer on the case. 'Scheduled for Tuesday.'")],
    'Office Communication: the question from Gentle Dental, Greg\'s reply. The status chip changes to Scheduled.'),
   ('Twenty minutes', [('Amanda', "You've been here twenty minutes."), ('Greg', "And nothing's waiting on Tanya coming back.")],
    'Full frame. The Incoming list behind them: every row has moved on one step. Chip: "0 waiting on Tanya".'),
   ("The owner's chair", [('Greg', "Honestly? The doctor should see what this looks like from the owner's chair."), ('Amanda', "The numbers? Oh, that's a whole other conversation.")],
    'Full frame. A one-second glimpse of the Analytics page, blurred. End card.'),
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
