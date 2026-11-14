"""Script 21 v2 "Episode 2: No More Phone Tag" — from the user's own draft (2026-11-14), production script with
editing instructions. The user will share a screen recording of the Pre-Op viewer (the app's "Provider's Day-Prep
Station") for the edit. Client rules applied: no doctors' names (the user's "Dr. Vance" is "the doctor"), staff
Barbara/Tanya/Amanda/Greg only, no red, no "EHR", no "shared inbox", only confirmed features."""
import html, os, subprocess
E = html.escape
D = '/home/user/awesome-opus-5-5-prompts/scripts-incoming-referrals'
PDF = os.path.join(D, 'Script-21-v2-No-More-Phone-Tag.pdf')
FONTS = '/home/user/awesome-opus-5-5-prompts/reel/public/fonts'

CAST = [
    ('Mrs. Ortiz', 'Patient, 60s. In for an implant consult and scared of it.', 'Sarah (mature, reassuring)'),
    ('The doctor', 'Oral surgeon at the specialist office. Never named on screen or in dialogue (client rule).', 'Eric (smooth, trustworthy)'),
    ('Amanda', 'Office manager and treatment coordinator at the specialist office.', 'Bella (calm, professional)'),
    ('Tanya', 'Front desk coordinator at the specialist office.', 'Jessica (bright, quick)'),
    ('Barbara', 'Front desk coordinator at Gentle Dental, the referring general dentist.', 'Matilda (warm, steady)'),
]

# (time, title, visual, [(speaker, line)], edit instructions)
BEATS = [
 ('0:00–0:06', 'Hook · shaking hands',
  'Close-up: Mrs. Ortiz in the dental chair, gripping the armrests, trying to smile at the assistant.',
  [('Mrs. Ortiz', 'Is it bad that my hands are shaking?')],
  ['Open cold on her face, no logo, no music for the first 2 s (room tone only).', 'Push in slowly (100 → 108%).', 'Text-behind word "NERVOUS" behind her head, soft amber, 1.5 s.', 'Caption style: word-by-word, keyword pill on "shaking".']),
 ('0:06–0:15', 'The doctor sees the gap',
  'The doctor at his workstation, reviewing the day in the Provider\'s Day-Prep Station. He opens Mrs. Ortiz\'s case: the newest panoramic X-ray is missing.',
  [('The doctor (V.O.)', "Before every consult I go through my day here. Mrs. Ortiz's chart is ready... except her newest X-ray.")],
  ['SCREEN: Day-Prep Station recording (the video you will share). Show it in a 3D floating window, slight tilt, over a blurred office background.', 'Zoom into today\'s list, then Mrs. Ortiz\'s row. Purple highlight box on her name.', 'Amber pulse on the empty X-ray slot. Chip: "Newest X-ray · missing".', 'Blur every real name, date of birth and office in the recording; overlay Mrs. Ortiz / Gentle Dental.']),
 ('0:15–0:22', 'A note, not a walk',
  'The doctor types a quick Administrative Note inside her case.',
  [('The doctor (V.O.)', "I don't walk to the front desk or call around. One note on her case, and my team sees it.")],
  ['SCREEN: Administrative Notes panel ("Company-private notes. Not shared with other parties."). Typing animation: "@Amanda need Mrs. Ortiz\'s newest pano before her consult."', 'Small lock icon + label "Private to our team".', 'Whoosh as the note sends; the note card flies off-screen toward the front desk shot.']),
 ('0:22–0:30', 'The old way begins',
  'Amanda sees the note pop up, flags Tanya. Tanya picks up the phone and dials Gentle Dental. Cut: the phone ringing at Gentle Dental, going to voicemail.',
  [('Tanya', "Hi Barbara, it's Tanya at the specialist office. Please call me back about Mrs. Ortiz.")],
  ['Montage pace: cuts every 1–1.5 s.', 'Notification ping SFX as the note appears on Amanda\'s screen.', 'Split screen for the call: Tanya left, empty Gentle Dental desk with ringing phone right.', 'Chip: "Voicemail · 1".']),
 ('0:30–0:38', 'Ten minutes',
  'Wall clock ticks forward ten minutes (time-lapse). Mrs. Ortiz still in the chair.',
  [('Amanda (V.O.)', 'Ten minutes later, Mrs. Ortiz is still in that chair. And Tanya is stuck in phone tag.')],
  ['Clock time-lapse with tick SFX; light flicker to show time passing.', 'Cut back to Mrs. Ortiz: tighter framing than the hook, she glances at the door.', 'Text-behind "10 MINUTES" behind Mrs. Ortiz, amber.']),
 ('0:38–0:50', 'The missed call',
  'Tanya hangs up. A patient walks up to the desk with a question. While Tanya helps, the office phone rings: Barbara calling back. Nobody can grab it. Missed.',
  [('Tanya', "We called, got voicemail. They called back while I was checking someone out. We're right back at square one.")],
  ['The ring should be loud and slightly annoying, then cut off mid-ring.', 'Missed-call light blinking (amber, not red). Chip: "Missed call · Gentle Dental".', 'Small camera shake on the cut-off ring. Tanya\'s line over a slow push-in on her face.']),
 ('0:50–0:58', 'Move it onto the case',
  'Amanda steps in beside Tanya and opens Mrs. Ortiz\'s case.',
  [('Amanda', "Remember what we set up? Stop calling. Move the conversation onto the case.")],
  ['Music changes here: the bed lifts from tense to light.', 'SCREEN: Mrs. Ortiz\'s case opens in a 3D window that swings in from the right. Label chip: "Tooth Referral · one case, both offices".', 'Whip transition from the phone to the screen.']),
 ('0:58–1:08', '@Barbara',
  'Amanda clicks the Messages tab and types to Barbara.',
  [('Amanda (V.O.)', 'Both offices share the case. So I just mention Barbara.')],
  ['SCREEN: Messages tab / Office Communication. Typing: "@Barbara Mrs. Ortiz is in the chair. Could you attach her newest pano here?"', '"@Barbara" highlights purple as a mention. Send click SFX.', 'Show the message landing in the thread with name, office, role and time.']),
 ('1:08–1:20', 'Barbara answers',
  'Cut to Barbara at Gentle Dental. A notification chimes. She opens it, replies under Amanda\'s message (quoted reply), drags the X-ray into the chat and sends.',
  [('Amanda (V.O.)', "Barbara sees it right away, replies in the same thread, and drops the X-ray in. It saves to the case for both offices. No downloading, no scanning, no chasing emails.")],
  ['Split screen: Barbara\'s desk left, the thread right.', 'Notification chime, then the quoted reply bubble building with the original question above it.', 'Drag-and-drop animation of the X-ray file into the chat; the file then flies into Attachments, labelled "Shared with both offices".', 'Green check sparkle when it saves. Timer chip counts up and stops at "0:30".']),
 ('1:20–1:30', 'Ready',
  'The doctor refreshes the Day-Prep Station: the new X-ray is there. He picks up his tablet and walks into the operatory to a relieved Mrs. Ortiz.',
  [('The doctor', "Good morning, Mrs. Ortiz. I've got your latest X-ray right here, and everything looks very straightforward. Let's take a look together.")],
  ['SCREEN: back to the Day-Prep Station recording; the X-ray slot fills (cross-fade from empty to image). Green "Ready" chip.', 'Cut to the operatory: Mrs. Ortiz lets go of the armrest. Hold on her face for a beat.', 'Music swells gently, no SFX.']),
 ('1:30–1:40', 'Cliffhanger',
  'Back at the front desk. Tanya stares at the screen. Amanda grabs her bag to leave.',
  [('Tanya', 'That took thirty seconds. Why are we still calling each other?'), ('Amanda', "We aren't anymore. Good thing, because tomorrow's the real test. You're out, and Greg's on his own.")],
  ['Text-behind "30 SECONDS" behind Tanya, purple.', 'Tiny beat of silence after "Greg\'s on his own", then hard cut to the end card.', 'End card: Tooth Referral logo reveal, tagline "Stop calling. Start collaborating." · toothreferral.com. Teaser line under it: "Next: Greg\'s on his own".']),
]

GENERAL = [
 ('Format', 'Vertical 1080×1920, 30 fps, about 1:40. Characters are filmed horizontally and punched in; screen recordings sit in 3D floating windows with a soft shadow and a purple edge glow.'),
 ('The Day-Prep Station video you will share', 'Used in beats 0:06–0:15 and 1:20–1:30. I will cut only the seconds needed, crop to the app area, slow any scrolling, and add the highlight boxes and chips listed above. Every real patient, provider, office, date of birth and email in it gets blurred and replaced with the story names (Mrs. Ortiz, Gentle Dental).'),
 ('Other product screens', 'Administrative Notes, the Messages tab with @mention and quoted reply, Attachments "shared with both offices": from the existing dashboard recordings and stills, rebuilt with the story\'s names where the recording shows other names.'),
 ('Voices', 'One ElevenLabs voice per character, kept for the whole series (cast list above). Speech-to-speech on the filmed takes so emotion and lip sync stay; the doctor\'s V.O. lines are generated in the same voice as his on-screen line.'),
 ('Captions', 'Word-by-word, white with a soft dark outline, keyword pills (amber for the problem, purple for Tooth Referral, green for wins). Text-behind words at four moments: NERVOUS, 10 MINUTES, 30 SECONDS, plus the end card.'),
 ('Sound', 'Room tone throughout. Tense pulse under 0:00–0:50, lifting to a light, warm bed from 0:50. SFX: notification ping, phone ring cut off, clock ticks, whoosh on screen transitions, send click, chime, sparkle on save.'),
 ('Colour and rules', 'Problems in amber, never red. No doctors\' names anywhere (on screen, captions or audio). No "EHR" abbreviation, no "shared inbox". Nobody at the front desk is blamed: the phone is the problem, not Tanya.'),
 ('Layout check', 'Cards and screens stay in the middle band, captions in the bottom band, text-behind words in the top band, so nothing covers a face or a caption. Frame-by-frame check before export.'),
]

css = f'''@page {{ size: A4; margin: 14mm 13mm; }}
@font-face {{ font-family: Jakarta; src: url(file://{FONTS}/plus-jakarta-sans-latin-800-normal.woff2); font-weight: 800; }}
@font-face {{ font-family: InterW; src: url(file://{FONTS}/inter-latin-500-normal.woff2); font-weight: 500; }}
@font-face {{ font-family: InterW; src: url(file://{FONTS}/inter-latin-700-normal.woff2); font-weight: 700; }}
body {{ font-family: InterW, sans-serif; color: #16132B; font-size: 9.8pt; line-height: 1.45; }}
h1 {{ font-family: Jakarta; font-size: 26pt; letter-spacing: -.02em; margin: 1mm 0 2mm; line-height: 1.06; }}
h2 {{ font-family: Jakarta; font-size: 14pt; margin: 5mm 0 2mm; }}
.k {{ color: #6D4AE8; font-weight: 700; font-size: 8.6pt; letter-spacing: .12em; text-transform: uppercase; }}
.box {{ border: 1px solid #E4DBFF; border-radius: 3mm; padding: 3.5mm 4.5mm; margin: 3mm 0; background: #FBFAFF; page-break-inside: avoid; }}
.amber {{ border-color: #F3D9A4; background: #FFF8EA; }}
.small {{ color: #6B7085; font-size: 8.6pt; }}
table {{ width: 100%; border-collapse: collapse; }}
td, th {{ vertical-align: top; padding: 2.2mm 2.4mm; border-bottom: 1px solid #ECE8FA; text-align: left; }}
th {{ font-size: 8.2pt; letter-spacing: .1em; text-transform: uppercase; color: #6D4AE8; border-bottom: 1.5px solid #6D4AE8; }}
tr {{ page-break-inside: avoid; }}
.tc {{ font-family: Jakarta; font-size: 9.5pt; color: #6D4AE8; width: 17mm; white-space: nowrap; }}
.t {{ font-weight: 700; font-size: 9.6pt; }}
.vis {{ color: #3A3F55; font-size: 8.9pt; margin: .8mm 0 1.4mm; }}
.ln {{ font-size: 10.2pt; margin-top: .5mm; }}
.sp {{ font-weight: 700; }}
.ed {{ width: 70mm; font-size: 8.6pt; color: #3A3F55; }}
.ed ul {{ margin: 0; padding-left: 4mm; }}
.grid td {{ border: none; padding: 1.3mm 2mm 1.3mm 0; }}
.grid td:first-child {{ font-weight: 700; width: 42mm; color: #6D4AE8; }}'''
cast = ''.join(f'<tr><td>{E(n)}</td><td>{E(r)}</td><td class="small">{E(v)}</td></tr>' for n, r, v in CAST)
beats = ''.join(f'''<tr><td class="tc">{E(t)}</td><td><div class="t">{E(ti)}</div><div class="vis">{E(vi)}</div>
{''.join(f'<div class="ln"><span class="sp">{E(sp)}:</span> “{E(l)}”</div>' for sp, l in lines)}</td>
<td class="ed"><ul>{''.join(f'<li>{E(x)}</li>' for x in ed)}</ul></td></tr>''' for t, ti, vi, lines, ed in BEATS)
general = ''.join(f'<tr><td>{E(a)}</td><td>{E(b)}</td></tr>' for a, b in GENERAL)
words = sum(len(l.split()) for b in BEATS for _, l in b[3])
html_doc = f'''<div class="k">Tooth Referral · Script 21 v2 · Episode 2 of the series after "Buried in Emails"</div>
<h1>No More Phone Tag</h1>
<p class="small" style="font-size:10.5pt">About 1 minute 40 seconds · {len(BEATS)} beats · {words} spoken words · from your draft, with editing instructions</p>
<div class="box"><table class="grid">
<tr><td>Hook</td><td>"Is it bad that my hands are shaking?" A scared patient in the chair, and the one file the doctor needs is missing.</td></tr>
<tr><td>Goal</td><td>Show how the team and the two offices talk inside Tooth Referral: the doctor's private note to his own team, then one @mention to the referring office that ends ten minutes of phone tag in thirty seconds.</td></tr>
<tr><td>Builds from video 1</td><td>Video 1: "the dentist's office calls us constantly" and "they can message us right on the case". This episode shows both: the calls, then the case.</td></tr>
<tr><td>Features shown</td><td>Provider's Day-Prep Station (your Pre-Op viewer) · Administrative Notes (private to the team, @mention) · Messages tab / Office Communication with @mention · quoted reply · file sent in the chat saved to Attachments, shared with both offices.</td></tr>
<tr><td>Cliffhanger</td><td>"Tomorrow's the real test. You're out, and Greg's on his own." (opens Episode 3, Tanya's Day Off)</td></tr></table></div>
<div class="box amber"><b>Changes from your draft</b><ul style="margin:1mm 0;padding-left:5mm">
<li>"Dr. Vance" is "the doctor": the client rule is no doctors' names anywhere (dialogue, captions, screens).</li>
<li>"Pre-Op Day Viewer" is called <b>Provider's Day-Prep Station</b> in the app; on-screen labels use that name. "Direct Messages tab" is the <b>Messages tab (Office Communication)</b>.</li>
<li>The doctor's V.O. lines are shortened so they sound like him talking, not a feature list. Amanda's V.O. keeps your "no downloading, no scanning, no chasing emails".</li>
<li>Tanya's voicemail line is added at 0:22 so the phone tag is heard, not just told. Your ending, logo and tagline are kept.</li></ul></div>
<h2>Cast and voices</h2><table><tr><th>Character</th><th>Who</th><th>ElevenLabs voice</th></tr>{cast}</table>
<h2>Script and editing instructions</h2>
<table><tr><th>Time</th><th>Picture and dialogue</th><th>Editing instructions</th></tr>{beats}</table>
<h2 style="page-break-before:always">Editing notes for the whole video</h2>
<div class="box"><table class="grid">{general}</table></div>
<p class="small">Waiting on: the Provider's Day-Prep Station screen recording (you are sharing it). Once it arrives I will log its timestamps here and cut beats 0:06–0:15 and 1:20–1:30 from it.</p>'''
doc = os.path.join(D, 'src', '_s21v2.html'); js = os.path.join(D, 'src', '_s21v2.cjs')
open(doc, 'w').write(f'<html><head><meta charset="utf-8"><style>{css}</style></head><body>{html_doc}</body></html>')
open(js, 'w').write(f'''const {{ chromium }} = require('playwright');
(async () => {{ const b = await chromium.launch(); const p = await b.newPage(); await p.goto('file://{doc}');
await p.evaluate(() => document.fonts.ready); await p.pdf({{ path: '{PDF}', format: 'A4', printBackground: true }}); await b.close(); }})();''')
subprocess.run(['node', js], check=True)
os.remove(doc); os.remove(js)
print(len(BEATS), 'beats', words, 'words')
