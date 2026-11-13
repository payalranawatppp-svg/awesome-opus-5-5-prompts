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

A = lambda t: ('ACT', [], t)
SCRIPTS = [
 dict(n=21, ep=2, title='Last Tuesday', sub='How a referral arrives: the website referral form',
  cast='Tanya and Amanda at the same front desk as Buried in Emails. Barbara (office manager at Gentle Dental, the general dentist down the street) on the phone. Mrs. Ortiz, the patient, on the phone.',
  story='A good Monday. Tanya brings in donuts. Barbara from Gentle Dental calls, just to chat, and asks how Mrs. Ortiz is doing. Nobody at St. Andrew\'s has ever heard of Mrs. Ortiz. She was sent a week ago, through the website.',
  topic='The website referral form: replaced by one that starts a case in Tooth Referral instead of sending an email.',
  hook='"How did Mrs. Ortiz do? She was so nervous." · "...Mrs. Ortiz?"',
  goal='Make the viewer feel a lost referral as a person (a nervous patient who thinks nobody wanted her), not as a statistic. The software only appears after that, as the obvious thing to do. The viewer leaves asking: "Where does OUR website form go?"',
  builds='In video 1 Amanda said: "We replaced the form on our website with Tooth Referral." Video 1 only said it. This episode shows the day that made them do it, and the moment the first referral arrives the new way.',
  features=['Website referral form with your logo, welcome message and insurance accepted', 'Routes each referral to the right doctor', 'Live preview of what the referring office sees', 'Access code so regular offices never retype their details', 'Embed code for your own website', 'Every form submission arrives in Incoming as one case'],
  turn='Ends on Amanda: "Tomorrow\'s the real test. You\'re out, and Greg\'s on his own." (opens Script 22)',
  end='Tooth Referral. Not just a form. A system. · toothreferral.com',
  clips=[
   A('Act 1 · A good Monday'),
   ('Donuts', [('Amanda', 'Donuts? On a Monday?'), ('Tanya', "We survived last week. And the team said yes. That deserves donuts.")],
    'STORY. Full frame. Tanya puts a box of donuts on the front desk. Morning light, an easy, happy start.'),
   ('Barbara', [('Tanya', "St. Andrew's, this is Tanya... Barbara! How's the new puppy?")],
    'STORY. The phone rings. Tanya answers with a donut in her other hand, laughing. Barbara is only a voice.'),
   ('Just checking', [('Tanya', "Ha! Oh no... Anyway, what can I do for you?"), ('Barbara', 'Just checking in. How did Mrs. Ortiz do? She was so nervous.')],
    'STORY. Tanya smiling, listening. Small lower-third: "Barbara · Gentle Dental".'),
   A('Act 2 · Who is Mrs. Ortiz?'),
   ('Last Tuesday', [('Tanya', '...Mrs. Ortiz?'), ('Barbara', 'We sent her last Tuesday. Through your website.')],
    'STORY. The smile fades. Tanya puts the donut down. Amanda looks over.'),
   ('Nothing', [('Tanya', "Barbara, can I call you right back?"), ('Tanya', "There's nothing. Not in my inbox, not in the fax tray. Nothing.")],
    'STORY. Tanya hangs up and searches her email. Amanda checks the fax tray. Small pop-up: "0 results".'),
   ('A week', [('Amanda', 'A week. She thinks we never called.'), ('Tanya', "I'm calling her. Right now.")],
    'STORY. Tanya dials. Amanda stands behind her.'),
   ('I thought', [('Mrs. Ortiz', "Hello? ...Oh. I thought maybe you weren't taking new patients."), ('Tanya', "No, no. Mrs. Ortiz, I'm so sorry. That was our mistake.")],
    'STORY. Close on Tanya. The patient is only a soft voice. This is the emotional low point.'),
   ('Thursday', [('Tanya', "Thursday at nine? ...Yes, we'll take good care of you. I promise.")],
    'STORY. Tanya books her, writing on a sticky note out of habit. She hangs up and exhales.'),
   ('The old address', [('Amanda', "Found it. The website form sends to the old front-desk email. Nobody's opened it since spring.")],
    'STORY. Amanda at the second monitor. A dusty mailbox graphic: "frontdesk-old · 214 unread".'),
   ('More', [('Tanya', 'How many more are in there?'), ('Amanda', '...Two more referrals. From March.')],
    'STORY. They scroll in silence. Two more referral emails highlighted, months old. The donuts sit untouched.'),
   A('Act 3 · Not one more'),
   ('Not one more', [('Amanda', 'We said we\'d switch next month.'), ('Tanya', "Not next month. Today. Not one more Mrs. Ortiz.")],
    'Turning point. Amanda opens Tooth Referral and goes to the website referral form.'),
   ('Ours', [('Amanda', "Our logo, our welcome message. Which insurance we take, so nobody has to call and ask."), ('Tanya', 'And it goes to the right doctor?'), ('Amanda', 'Every time.')],
    'Quick montage over their talk: logo, welcome message, Insurance Accepted, Specialty & Doctor Routing light up.'),
   ('What Barbara sees', [('Tanya', "That's what Barbara will see?"), ('Amanda', "Exactly that. And she gets a code, so her office details fill in by themselves.")],
    'Live preview of the form; the Referral Access Code auto-filling Gentle Dental\'s details.'),
   ('On the website', [('Amanda', 'Copy this, paste it on our site... and that old email address is gone for good.')],
    '"Get embed code", the new form live on the practice website. The dusty mailbox graphic fades away.'),
   A('Act 4 · The call back'),
   ('Try it', [('Tanya', "Barbara? It's Tanya. Mrs. Ortiz is booked for Thursday. And... could you try our website one more time?")],
    'STORY. Tanya on the phone again, calmer now.'),
   ('Already here', [('Tanya', '...Got it. It\'s already here. Name, X-rays, everything.'), ('Barbara', "That fast? I'll tell her you said hi.")],
    'Incoming referrals list: the new referral slides in as one case, status "New". Tanya smiles for the first time since the call.'),
   ('Donuts', [('Amanda', 'Donut?'), ('Tanya', 'Now I deserve one.'), ('Amanda', "Tomorrow's the real test. You're out, and Greg's on his own.")],
    'STORY. Full frame. Tanya finally takes a bite. End card.'),
  ]),
 dict(n=22, ep=3, title="Tanya's Day Off", sub='How a referral is worked: anyone can pick it up',
  cast='Tanya and Amanda (evening), then Greg, the newer front-desk colleague, covering alone the next morning. Mr. Turner, a patient, on the phone.',
  story='Tanya is sick but won\'t go home: she left Mr. Turner a voicemail and promised herself she\'d call back. The next morning Greg is alone at the desk for the first time, Mr. Turner calls, a little annoyed, and Greg has no idea who called him.',
  topic='Picking up someone else\'s work: statuses on every referral, next-step reminders, automatic updates to the referring office, the insurance request link and the notifications feed.',
  hook='"Somebody called me yesterday. I\'ve been waiting by the phone all morning." · Greg didn\'t call him. The person who did is home sick.',
  goal='Put the viewer in a moment every office knows (a call about work someone else started) and let them feel Greg\'s panic before showing the calm answer. The "system for the team" idea is never said; it is felt.',
  builds='In video 1 Tanya asked: "So if I\'m out tomorrow..." and Amanda answered: "Greg opens it and knows exactly where it stands." This is that exact day, and Greg\'s first real test. It also answers video 1\'s old problem: "every referral lives in someone\'s inbox or someone\'s head".',
  features=['Incoming list with a status on every referral', 'Contact statuses (Left a Voicemail) with time and name', 'Scheduling from the status chips', 'Automatic status updates to the referring office', 'Next-step reminders', 'Request insurance from the patient (secure link)', 'Notifications feed'],
  turn='Ends on Tanya\'s text back: "Tomorrow I have three letters and a recital. Pray for me." (opens Script 23)',
  end='Tooth Referral. Whoever opens it knows where it stands. · toothreferral.com',
  clips=[
   A('Act 1 · The night before'),
   ('Go home', [('Amanda', "You sound terrible. Go home."), ('Tanya', "I can't. I left Mr. Turner a voicemail at four. I promised myself I'd call him back.")],
    'STORY. Evening, the office almost empty. Tanya coughing, coat half on. Amanda by the desk.'),
   ('Greg', [('Amanda', "Greg's here tomorrow."), ('Tanya', "Greg's been here three weeks."), ('Amanda', 'Go. Home.')],
    'STORY. Tanya hesitates, looks at her screen, then leaves. Lights go off.'),
   A('Act 2 · Greg, alone'),
   ('First time', [('Greg', "Okay. Just me today. It's fine. It's fine.")],
    'STORY. Next morning. Greg alone at the front desk, nervous, adjusting his chair. Amanda\'s chair empty ("With a patient" sign).'),
   ('The call', [('Greg', "St. Andrew's, this is Greg."), ('Mr. Turner', "Somebody called me yesterday. I've been waiting by the phone all morning.")],
    'STORY. The phone rings. A gruff older voice. Greg freezes.'),
   ('Sticky notes', [('Greg', 'Uh... one moment, sir.')],
    'STORY. Greg puts him on hold, looks at Tanya\'s monitor: sticky notes everywhere. One just says "call T back??". He groans.'),
   ('Wait', [('Greg', '...Wait. She never works off sticky notes anymore.')],
    'STORY turns. Greg sits up, types "Turner" into Tooth Referral.'),
   A('Act 3 · Where she left off'),
   ('Ten past four', [('Greg', "Michael Turner. 'Left a voicemail.' Yesterday, 4:10 p.m. Tanya.")],
    'The case: Status & Schedule chips with "Left a Voicemail", the time and Tanya\'s name.'),
   ('Booked', [('Greg', "Mr. Turner? Thanks for holding. Tanya was calling to book your consultation. Tuesday at ten?")],
    'Greg clicks Consultation Scheduled, picks Tuesday 10:00, saves. Green success toast.'),
   ('Thank you', [('Mr. Turner', "Tuesday's fine. Tell the young lady who called, thank you."), ('Greg', 'I will, sir.')],
    'STORY. The gruff voice softens. Greg breathes out.'),
   ('His dentist', [('Greg', "Should I call his dentist?... No. They already got the update.")],
    'Split: the referring office (Gentle Dental) sees the same referral now "Consultation Scheduled".'),
   ('She thought ahead', [('Greg', "And she'd set a reminder to check on him today. It came to me this morning. I just didn't look.")],
    '"Next Step: Remind me on..." and the reminder notification Greg missed at 8:02 AM. He laughs at himself.'),
   ('On a roll', [('Greg', "Next. Missing insurance. Request from patient... sent.")],
    'Faster now, confident: Request from patient, green toast "Insurance request sent".'),
   ('She sent it', [('Greg', 'Already? Front and back of her card. On the case.')],
    'Notifications feed: "patient submitted insurance". The card images appear in the Insurance panel.'),
   A('Act 4 · Nothing waiting'),
   ('How is it going', [('Amanda', 'How are you holding up?'), ('Greg', "Honestly? Fine. Everything she touched, it's right there.")],
    'STORY. Amanda comes back from the treatment room. The Notifications feed shows a calm, moving morning.'),
   ('The text', [('Greg', "'Mr. Turner booked for Tuesday. He says thank you. Go back to sleep.'")],
    'STORY. Greg texts Tanya. Cut to Tanya on her couch, blanket, tea, reading it and smiling.'),
   ('Pray for me', [('Tanya', "'Thank you. Tomorrow I have three letters and a recital. Pray for me.'")],
    'STORY. Her reply on Greg\'s phone. He shows Amanda; they both laugh. End card.'),
  ]),
 dict(n=23, ep=4, title='Front Row', sub='How a referral is closed: notes, signed and sent before five',
  cast='Tanya and Amanda at the front desk, Greg in the background. Lily, Tanya\'s daughter, is only seen in a photo and a video on a phone.',
  story='Tanya\'s daughter Lily has her first piano solo at 5:30. Tanya promised her the front row. Last spring she missed the first half of the recital typing completion letters. At 4:15 three finished cases land on her desk.',
  topic='Closing the loop: note templates that fill themselves in, your own letter imported from Word, routing to the doctor to sign, e-signature, the signed note on the case for both offices, copy into your electronic health record.',
  hook='"Front row. She made me promise." · At 4:15, three completion letters land on her desk.',
  goal='Give the paperwork a human stake (a promise to a child) and let the software quietly win. The viewer should want those 20 minutes back in their own day.',
  builds='Video 1 opened with a team "losing steam" and a patient nobody called back. This is the other end of the same journey: the loop closes on time and the people go home. Together with 21 and 22 the series follows one referral: it arrives, it is worked, it is closed.',
  features=['Changing the status to Completed opens the note', 'Templates with smart fields that fill themselves in', 'Your own letter imported from Word', 'Route to the doctor to sign', 'E-signature', 'Signed note on the case, visible to both offices', 'Copy into your electronic health record', 'Save as a new template'],
  turn='Ends on Greg: "The doctor should see this from the owner\'s side." · Amanda: "The numbers? That\'s a whole other story." (opens the Analytics episode)',
  end='Tooth Referral. Completion letters that write themselves. · toothreferral.com',
  clips=[
   A('Act 1 · The promise'),
   ('Her first solo', [('Tanya', "Look. Her first solo. 5:30 tonight."), ('Amanda', "That dress! She's going to be amazing.")],
    'STORY. Morning. Tanya, back from being sick, shows Amanda a photo of Lily at a piano on her phone.'),
   ('Front row', [('Tanya', 'I promised her the front row. Last spring I missed the whole first half.'), ('Amanda', 'Letters?'), ('Tanya', "Letters. Typing 'thank you for referring' until six.")],
    'STORY. Tanya tapes the photo to her monitor. A small, real sting in her voice.'),
   A('Act 2 · 4:15'),
   ('Three cases', [('Greg', "The doctor just finished these three. Gentle Dental's asking for the letters today.")],
    'STORY. Afternoon. Greg sets down a note with three patient names. Clock chip: 4:15 PM. Tanya glances at the photo.'),
   ('The old way', [('Amanda', "That's an hour, easy. Print, sign, scan, fax..."), ('Tanya', "Not anymore. I'm leaving at five.")],
    'STORY. Amanda already has her coat on. Tanya rolls up her sleeves.'),
   A('Act 3 · Ten minutes'),
   ('It asks', [('Tanya', "Emma Park. Treatment done. I mark it Completed... and it opens the letter for me.")],
    'Status chips: Completed. The note creator opens by itself.'),
   ('Our letter', [('Tanya', "That's our own letter. And look: her name, her birthday, Gentle Dental, today's date. Already in.")],
    'The letter with smart fields switching from codes to real values (Patient Name, Patient DOB, Referring Office, Today\'s Date).'),
   ('Two lines', [('Amanda', "You didn't type any of that?"), ('Tanya', 'Two lines about the visit. That\'s all I type.')],
    'She types two short lines. Preview.'),
   ('The doctor', [('Amanda', "And the doctor's signature?"), ('Tanya', 'Sent to the doctor to sign. Right... now.')],
    '"Who signs this note?" · Route to a doctor to sign. Then the e-signature: "All done, your document is signed!"'),
   ('Both offices', [('Tanya', "And it's on the case. Barbara can open it from her desk.")],
    'Signed notes: "Completion Note · Signed · visible to both offices". Split: the same note on Gentle Dental\'s side.'),
   ('Our chart', [('Amanda', 'Our own chart?'), ('Tanya', 'Copy... paste. Into our electronic health record. Done.')],
    'The "copy into your electronic health record" step highlighted.'),
   ('One click', [('Tanya', "Saved as a template. The other two... one click each.")],
    '"Save as New Template". The three names tick off: sent, sent, sent. Clock chip: 4:51 PM.'),
   A('Act 4 · Front row'),
   ('Go', [('Amanda', "Four fifty-one. Go!"), ('Tanya', 'Front row!')],
    'STORY. Tanya grabs her coat and the photo off the monitor and runs out. Amanda laughs.'),
   ('The video', [('Amanda', 'Greg. Look.')],
    'STORY. Later. Amanda\'s phone: a short video from Tanya, Lily at the piano, filmed from the front row. Text: "Made it. Front row."'),
   ("The owner's side", [('Greg', "The doctor should see this from the owner's side."), ('Amanda', "The numbers? That's a whole other story.")],
    'STORY. The two of them smiling at the phone. A one-second glimpse of the Analytics page, blurred. End card.'),
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
def nclips(s): return sum(1 for c in s['clips'] if c[0] != 'ACT')
def secs(s): return round(nclips(s) * 8 / 10) * 10
over = ''.join(f'''<div class="box" style="page-break-inside:auto"><div class="sp" style="font-size:11.5pt">Script {s['n']} · Episode {s['ep']} · {E(s['title'])} <span class="small">({E(s['sub'])})</span></div>
<table class="grid" style="margin-top:1.5mm"><tr><td>Story</td><td>{E(s['story'])}</td></tr><tr><td>Topic</td><td>{E(s['topic'])}</td></tr><tr><td>Hook</td><td>{E(s['hook'])}</td></tr><tr><td>Goal</td><td>{E(s['goal'])}</td></tr>
<tr><td>Builds from video 1</td><td>{E(s['builds'])}</td></tr><tr><td>Turns the page</td><td>{E(s['turn'])}</td></tr></table></div>''' for s in SCRIPTS)
parts = [f'''<div class="k">Tooth Referral · Scripts 21 to 23 · the feature series</div>
<h1>After "Buried in Emails": now show the software</h1>
<p>Three scripts that build from the first video. Same front desk, same people (Tanya and Amanda, then Greg). Video 1 set the hook: referrals buried in emails, voicemails and faxes, and one promise, "every referral came in as one case". Each new episode takes one part of that promise and <b>shows it on the real screens</b>, feature by feature, and ends on a question that makes the viewer want the next one.</p>
<div class="box amber"><b>Vejay's notes this answers (13 Nov)</b><ul>
<li>"Build from the first video, the buried one." Every episode quotes a line from video 1 and pays it off.</li>
<li>"Focus on showing the features of the software." Each clip names the exact Tooth Referral screen on view; the dialogue is two colleagues using it, not describing it.</li>
<li><b>A real story, not problem → solution:</b> each script is told in four acts. Act 1 sets up the people and a normal day. Act 2 lets things go wrong slowly, with a human cost (a nervous patient who thinks nobody wanted her, a new colleague alone for the first time, a mother's promise to her daughter). Act 3 is the turn, where the software appears the way a colleague would actually use it. Act 4 pays off the story, not the feature. Clips marked STORY carry no product graphics.</li>
<li><b>A different feature set in every script (no repeats):</b> 21 is how a referral <b>arrives</b> (the website form), 22 is how it is <b>worked</b> (statuses, reminders, insurance request, notifications), 23 is how it is <b>closed</b> (notes and e-signature).</li>
<li>"People need to turn the page with curiosity." Each script ends on an open question that the next episode answers.</li>
<li>"Send me topics before you produce: hook, goal, and how it builds from the first video." The topics are below; nothing gets produced until you approve them.</li></ul></div>
<h2>Topics for approval</h2>
{over}
<p class="small" style="margin-top:3mm">Each script: 14 to 17 clips of about 8 seconds (about 2 minutes), in four acts. Horizontal 16:9 like video 1, with the split-screen dashboard. Script only; filming prompts come after approval. Demo data: Gentle Dental (general dentist) refers to the specialist office where Tanya, Amanda and Greg work. No doctors are named.</p>''']
for s in SCRIPTS:
    rows, k = '', 0
    for c in s['clips']:
        if c[0] == 'ACT':
            rows += f'<tr><td colspan="3" style="padding-top:4mm;border-bottom:1.5px solid #6D4AE8"><span style="font-family:Jakarta;font-size:11.5pt;color:#16132B">{E(c[2])}</span></td></tr>'
            continue
        k += 1
        rows += f'''<tr><td class="n">{k:02d}</td><td><div class="t">{E(c[0])}</div>{''.join(f'<div class="ln"><span class="sp">{E(sp)}:</span> “{E(l)}”</div>' for sp, l in c[1])}</td><td class="scr">{E(c[2])}</td></tr>'''
    parts.append(f'''<div class="page"><div class="k">Script {s['n']} · Episode {s['ep']} of the series</div>
<h1>{E(s['title'])}</h1><p class="small" style="font-size:10.5pt">{E(s['sub'])} · {nclips(s)} clips · about {secs(s)} seconds · {words(s)} spoken words</p>
<div class="box"><table class="grid">
<tr><td>Story</td><td>{E(s['story'])}</td></tr>
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
    print(s['n'], s['title'], nclips(s), 'clips', words(s), 'words', max(sum(len(l.split()) for _, l in c[1]) for c in s['clips'] if c[0] != 'ACT'), 'max/clip')
