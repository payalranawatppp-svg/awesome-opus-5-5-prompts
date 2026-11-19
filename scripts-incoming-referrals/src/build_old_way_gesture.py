"""'The Old Way vs. Tooth Referral': a 9 x 8-second hand-gesture talking-head script, with Google Flow prompts (MD + PDF).

Format taken from the user's reference reel (a single presenter in a dim, warm room points to one corner of the frame for the bad
option and to the other corner for the good option; the pointing hand holds while he talks). One male avatar, vertical 9:16.
Every clip: the old way in 3-4 very short lines (one hand to the top-right of the frame), then the Tooth Referral benefit in one
sentence (the other hand to the top-left). Each clip starts on the last frame of the previous clip (resting pose), so the clips
cut together as one take. No graphics are generated: labels and icons are added in the edit.
Client rules: no names, "general dentist" written out, no "EHR", no "shared inbox", no front-desk blame, no contact CTA, no red."""
import html, os, subprocess
E = html.escape
D = '/home/user/awesome-opus-5-5-prompts/scripts-incoming-referrals'
NAME = 'Old-Way-vs-Tooth-Referral-8s-Clips-Google-Flow'
MD, PDF = os.path.join(D, NAME + '.md'), os.path.join(D, NAME + '.pdf')
FONTS = '/home/user/awesome-opus-5-5-prompts/reel/public/fonts'

NOANIM = ('No animation, no cartoon, CGI or illustrated look, no motion graphics, no on-screen text, no text overlays, no titles, '
          'no captions, no subtitles, no readable text anywhere.')
NEG = (NOANIM + ' No icons, no floating graphics or phone mock-ups, no music, no logos, no red clothing, props or lights, no extra people, '
       'no warped hands or extra fingers, no lip-sync drift, no sudden objects appearing in hands, no jump cut or reset at the start, '
       'no camera cut.')

BG = ('a moody, cosy home studio office in the evening, shot as a real photograph, vertical 9:16, eye level, 35mm lens, f/2.0, shallow '
      'depth of field so the whole background is a soft, creamy blur. Dark charcoal walls; behind the subject, slightly left, dark '
      'walnut open shelving with a few books, small potted plants and two glowing warm Edison-bulb table lamps; on the right a tall '
      'dark bookcase edge and a cognac-brown leather armchair back, softly out of focus; a faint warm string of fairy lights along a '
      'shelf, and one low, subtle teal ambient glow near the floor on the right for depth. Warm amber practical light pools, deep '
      'shadows, cinematic low-key look, gentle haze. Real-photo texture, subtle grain. The centre of the frame is empty (space for a '
      'person from the chest up). No people, no readable text, no logos, no red objects or red light, no screens.')

AV_LOOK = ('a man in his early 30s, the host of a dental-practice software channel: short dark-brown textured hair with a soft '
           'low fade, a neatly trimmed short dark beard, warm hazel eyes, light olive skin, natural brows. He wears a black heavyweight '
           'crew-neck knit sweater, a thin silver chain just visible at the collar, and one plain silver ring on his left index finger. '
           'Confident, friendly, credible: a peer who has run a busy practice, never salesy.')
AVATAR = ('Vertical 9:16 photorealistic portrait, framed from mid-chest up, centred, eye level, 50mm lens, f/2.0, a real photo, soft warm '
          'key light from camera left plus a gentle amber rim light from behind, true-to-life colours, real skin texture with pores, '
          'subtle grain, no beauty filter. THE HOST: ' + AV_LOOK + ' He looks straight into the lens with a relaxed half-smile; both '
          'hands rest together at the centre of his chest, fingertips lightly touching (his "rest pose"). Leave room above his head and '
          'on both upper corners of the frame (his pointing space). Behind him, softly out of focus: ' + BG + ' No readable text, no '
          'logos, no red clothing or objects, no extra people, no warped hands or fingers. ' + NOANIM)
START = ('Vertical 9:16 photograph, the host (the man from the Host avatar image: early 30s, short dark-brown textured hair with a low fade, '
         'trimmed short beard, black crew-neck knit sweater, thin silver chain, silver ring on his left index finger) framed from '
         'mid-chest up, centred, in front of the Host studio background, eye level, 50mm lens, f/2.0, warm key light from camera left, '
         'amber rim light. REST POSE: both hands together at the centre of his chest, fingertips lightly touching, shoulders relaxed, '
         'looking straight into the lens with a relaxed half-smile, mouth closed. Both upper corners of the frame are clear. ' + NOANIM +
         ' No logos, no red objects, no extra people, no warped hands.')

LOOK = ('Vertical 9:16 video, 8 seconds, one continuous shot, locked-off camera (no zoom, no cut). Photorealistic live-action footage '
        'that looks professionally filmed, not AI-generated: cinema camera (Sony FX3 look), 50mm lens, f/2.0, warm key light from '
        'camera left and an amber rim light, true-to-life colours, real skin texture with pores, subtle film grain, natural '
        'imperfections, natural unhurried movement, no glossy or plastic look.')
VOICE = ('a warm, clear male voice in his early 30s with a natural neutral American accent: confident, conversational, peer to peer, '
         'medium-fast pace with crisp pauses between the short lines')
REST = ('REST POSE: both hands together at the centre of his chest, fingertips lightly touching, looking straight into the lens, '
        'relaxed half-smile, mouth closed')
OLD_HAND = ('his LEFT hand (it appears on the RIGHT side of the frame) rises to just above shoulder height, index finger extended, '
            'pointing up toward the TOP-RIGHT corner of the frame, and holds there steadily')
NEW_HAND = ('his RIGHT hand (it appears on the LEFT side of the frame) rises to just above shoulder height, index finger extended, '
            'pointing up toward the TOP-LEFT corner of the frame, and holds there steadily')

# (n, title, old lines, benefit, beats [(time, gesture/head)], emotion, edit labels (old, new))
CLIPS = [
 ('01', 'The hook', 'Still running referrals the old way?', 'Here’s the old way… and the Tooth Referral way.',
  [('0.0–0.5 s', 'Starts in the rest pose.'),
   ('0.5–2.6 s', 'On "Still running referrals the old way?": his right hand lifts his index finger straight up in front of his chest (a "listen" gesture); head tilts slightly to his right, one eyebrow raised, playful challenge.'),
   ('2.7–4.6 s', 'On "Here’s the old way…": the right hand lowers back to the chest and ' + OLD_HAND + '; a small sceptical head shake.'),
   ('4.7–7.0 s', 'On "and the Tooth Referral way": the left hand lowers to the chest and ' + NEW_HAND + '; eyebrows lift, a confident smile, a small nod.'),
   ('7.0–8.0 s', 'The right hand lowers smoothly; he ends in the rest pose, smiling into the lens.')],
  'Curious, confident, a playful challenge.', ('', '')),
 ('02', 'How referrals arrive', 'Faxes. PDFs. Voicemails. Missing X-rays.', 'With Tooth Referral, every referral arrives complete, X-rays attached.',
  [('0.0–0.4 s', 'Starts in the rest pose (the last frame of clip 01).'),
   ('0.4–3.6 s', OLD_HAND[0].upper() + OLD_HAND[1:] + ' through the four short lines; on each word ("Faxes. PDFs. Voicemails. Missing X-rays.") a tiny tap of the finger in the air, as if ticking off a list; head gives a slow, slightly weary shake; brows pinched.'),
   ('3.7–7.2 s', 'The left hand returns to the chest and ' + NEW_HAND + '; head turns a few degrees toward the raised hand and back to the lens; a warm smile and a firm nod on "complete".'),
   ('7.2–8.0 s', 'The right hand lowers; back to the rest pose.')],
  'Mildly exasperated, then relieved and sure.', ('Faxes · PDFs · Voicemails', 'One complete referral, X-rays attached')),
 ('03', 'Talking to the referring office', 'Then the updates. Email chains. Phone tag. Lost letters.', 'Tooth Referral puts both offices in the same case.',
  [('0.0–0.4 s', 'Starts in the rest pose (the last frame of clip 02).'),
   ('0.4–4.0 s', 'On "Then the updates.": a small open-palm gesture at chest height. Then ' + OLD_HAND + ' for "Email chains. Phone tag. Lost letters."; on "Phone tag" a quick eye-roll and half-smile toward the lens.'),
   ('4.1–7.2 s', 'The left hand returns to the chest and ' + NEW_HAND + '; on "same case" both hands briefly come together at the centre, palms meeting (a "joined" gesture), then the hands part; a reassuring nod.'),
   ('7.2–8.0 s', 'Back to the rest pose.')],
  'Wry, then reassuring.', ('Email chains · Phone tag', 'Both offices, one case')),
 ('xx', 'Talking to each other', 'Who called back? Voicemail on voicemail. Scrap paper.', 'Tooth Referral keeps every message with the patient.',
  [('0.0–0.4 s', 'Starts in the rest pose (the last frame of clip xx).'),
   ('0.4–3.9 s', 'On "Who called back?": he mimes holding a phone to his ear with his right hand for one beat, eyebrows up. Then ' + OLD_HAND + ' for "Voicemail on voicemail. Scrap paper."; a small, tired head shake.'),
   ('4.0–7.2 s', 'The left hand returns to the chest and ' + NEW_HAND + '; on "every message" the finger gives one small tap in the air; head tilts toward the raised hand and back to the lens, a warm nod.'),
   ('7.2–8.0 s', 'Back to the rest pose.')],
  'Wry, then warm and organised.', ('Voicemail on voicemail', 'Every message with the patient')),
 ('04', 'Knowing the status', 'Status? Sticky notes. Guesswork. Someone’s out sick.', 'Tooth Referral logs every step, notes ready to copy.',
  [('0.0–0.4 s', 'Starts in the rest pose (the last frame of clip 03).'),
   ('0.4–4.0 s', 'On "Status?": head tilts, brows up, a questioning look. Then ' + OLD_HAND + ' for "Sticky notes. Guesswork."; on "Someone’s out sick" the raised hand turns palm-up in a small shrug.'),
   ('4.1–7.2 s', 'The left hand returns to the chest and ' + NEW_HAND + '; on "every step" the finger makes two small taps in the air (checking boxes); a confident nod.'),
   ('7.2–8.0 s', 'Back to the rest pose.')],
  'Questioning, then confident.', ('Sticky notes · Guesswork', 'Every step logged, notes ready')),
 ('xx', 'Insurance', 'Insurance? Texted card photos. Blurry. Days late.', 'Tooth Referral requests the card and flags stalled checks.',
  [('0.0–0.4 s', 'Starts in the rest pose (the last frame of clip xx).'),
   ('0.4–3.9 s', 'On "Insurance?": a small questioning head tilt. Then ' + OLD_HAND + '; on "Blurry" he squints slightly as if trying to read something; on "Days late" a slow head shake.'),
   ('4.0–7.2 s', 'The left hand returns to the chest and ' + NEW_HAND + '; on "flags stalled checks" the finger gives one firm tap in the air; a confident nod.'),
   ('7.2–8.0 s', 'Back to the rest pose.')],
  'Frustrated, then in control.', ('Texted photos · Blurry · Days late', 'Card requested · Stalled checks flagged')),
 ('05', 'Consultation notes', 'Consult notes? Typed. Printed. Faxed back.', 'Tooth Referral drafts them from templates; the doctor signs in seconds.',
  [('0.0–0.4 s', 'Starts in the rest pose (the last frame of clip 04).'),
   ('0.4–3.8 s', OLD_HAND[0].upper() + OLD_HAND[1:] + '; on "Typed" his right hand mimes two seconds of quick typing at chest height; a slight head shake, tired half-smile.'),
   ('3.9–7.2 s', 'The left hand returns to the chest and ' + NEW_HAND + '; on "signs in seconds" the right hand makes one small quick signature flick in the air; a satisfied smile.'),
   ('7.2–8.0 s', 'Back to the rest pose.')],
  'Tired of the busywork, then satisfied.', ('Typed · Printed · Faxed', 'Templates + e-signature (DocuSign)')),
 ('xx', 'Efficiency', 'Retyping names. Re-scanning X-rays. Same data, three systems.', 'Tooth Referral enters it once and fills it in everywhere.',
  [('0.0–0.4 s', 'Starts in the rest pose (the last frame of clip xx).'),
   ('0.4–3.9 s', OLD_HAND[0].upper() + OLD_HAND[1:] + '; on "Same data, three systems" his right hand holds up three fingers at chest height; brows pinched, a weary half-smile.'),
   ('4.0–7.2 s', 'The right hand returns to the chest and the left hand lowers; then ' + NEW_HAND + ' on "enters it once" (one finger, a single firm point); on "fills it in everywhere" the hand opens and sweeps outward in a small arc; a satisfied smile.'),
   ('7.2–8.0 s', 'Back to the rest pose.')],
  'Weary of busywork, then satisfied.', ('Retyping · Re-scanning · 3 systems', 'Enter once, filled in everywhere')),
 ('06', 'New patients from your website', 'Website form? Static. Lands in an inbox. Missed.', 'Tooth Referral sends every lead to your referral list.',
  [('0.0–0.4 s', 'Starts in the rest pose (the last frame of clip 05).'),
   ('0.4–3.8 s', OLD_HAND[0].upper() + OLD_HAND[1:] + '; on "Missed" the raised hand opens and drops a few centimetres (a "dropped it" gesture); head shakes once.'),
   ('3.9–7.2 s', 'The left hand returns to the chest and ' + NEW_HAND + '; on "to your referral list" the right hand sweeps gently in toward his chest (bringing it to you); a nod.'),
   ('7.2–8.0 s', 'Back to the rest pose.')],
  'Matter-of-fact, then upbeat.', ('Static form → inbox', 'Every lead in your referral list')),
 ('07', 'Knowing your numbers', 'Your numbers? Spreadsheets. Hunches. Monthly guesswork.', 'Tooth Referral shows live analytics: who refers, how fast, what slips.',
  [('0.0–0.4 s', 'Starts in the rest pose (the last frame of clip 06).'),
   ('0.4–3.6 s', OLD_HAND[0].upper() + OLD_HAND[1:] + '; head tilts, a sceptical squint on "Hunches".'),
   ('3.7–7.3 s', 'The left hand returns to the chest and ' + NEW_HAND + ' on "live analytics"; then the right hand counts on three fingers at chest height: one on "who refers", two on "how fast", three on "what slips".'),
   ('7.3–8.0 s', 'Back to the rest pose.')],
  'Sceptical, then sharp and clear.', ('Spreadsheets · Hunches', 'Live referral analytics')),
 ('08', 'Why Tooth Referral is different', 'Not a form. Not an inbox. Not AI guesswork.', 'Tooth Referral: real two-way software, secure, HIPAA compliant.',
  [('0.0–0.4 s', 'Starts in the rest pose (the last frame of clip 07).'),
   ('0.4–3.9 s', OLD_HAND[0].upper() + OLD_HAND[1:] + '; on each "Not…" the finger gives a small side-to-side "no" wag (three wags).'),
   ('4.0–7.2 s', 'The left hand returns to the chest and ' + NEW_HAND + ' on "real two-way software"; on "secure" he brings both palms together at the chest; on "HIPAA compliant" his hands open outward.'),
   ('7.2–8.0 s', 'Back to the rest pose.')],
  'Emphatic, then calm and trustworthy.', ('Not a form · not an inbox · not AI guesswork', 'Two-way · Secure · HIPAA compliant')),
 ('09', 'The close', 'Stop chasing referrals.', 'Start working them, together. Tooth Referral.',
  [('0.0–0.4 s', 'Starts in the rest pose (the last frame of clip 08).'),
   ('0.4–2.6 s', OLD_HAND[0].upper() + OLD_HAND[1:] + ' on "Stop chasing referrals"; a small knowing head shake.'),
   ('2.7–5.4 s', 'The left hand returns to the chest and ' + NEW_HAND + ' on "Start working them"; on "together" both hands come to the centre and the fingers interlock.'),
   ('5.5–8.0 s', 'On "Tooth Referral" he opens his right palm toward the lens with a confident, warm smile and holds it still to the end (a clean last frame for the end card).')],
  'Confident, warm, final.', ('Stop chasing', 'Start working them, together')),
]


import re
_rn = []
for i, c in enumerate(CLIPS, 1):
    beats = [(t, re.sub(r'last frame of clip \w\w', f'last frame of clip {i - 1:02d}', g)) for t, g in c[4]]
    _rn.append((f'{i:02d}', c[1], c[2], c[3], beats) + tuple(c[5:]))
CLIPS = _rn


def line(c): return f'{c[2]} {c[3]}'
def words(c): return len(line(c).replace('…', ' ').split())


def prompt(c):
    start = 'the Host start frame image' if c[0] == '01' else f'the last frame of clip {int(c[0]) - 1:02d}'
    beats = ' '.join(f'{t}: {g}' for t, g in c[4])
    return '\n'.join([
        f'Ingredients: the Host studio background image, the Host avatar image. Start image: {start}. Continue from the exact position '
        'in the start image: the clip begins on that frame, with the same camera angle, framing, lighting and background, and the same '
        'pose, hands and expression, and the action continues naturally from there, with no jump, reset or change of outfit. '
        f'Starting position: {REST}.',
        LOOK,
        'Background (exactly as the Host studio background image): ' + BG,
        'Character (exactly as the Host avatar image): THE HOST: ' + AV_LOOK,
        f'Emotion: {c[5]}',
        'Hand gestures and head movement, one by one, in this order (only one hand points at a time; the other hand rests at the chest; '
        'his eyes stay on the lens, never following the finger): ' + beats,
        'Framing: mid-chest up, centred, locked-off; both raised hands stay fully inside the frame, finger tips well below the top edge.',
        'DIALOGUE (on camera, lip-synced). Exactly one spoken line in this clip. VOICE-OVER: none.',
        f'Speaker: THE HOST, facing the camera. Voice: {VOICE}.',
        f'Line (say it once, word for word, nothing added, nothing left out): "{line(c)}"',
        'Timing: he starts speaking at about 0.5 s and finishes by about 7.4 s, matching the gesture beats above, then holds the final pose.',
        'Lip sync: mouth movement matches every word exactly. No narration, no extra words.',
        'Audio: only the one spoken line and quiet, warm room tone. ' + NEG])


css = f'''@page {{ size: A4; margin: 16mm 15mm; }}
@font-face {{ font-family: Jakarta; src: url(file://{FONTS}/plus-jakarta-sans-latin-800-normal.woff2); font-weight: 800; }}
@font-face {{ font-family: InterW; src: url(file://{FONTS}/inter-latin-500-normal.woff2); font-weight: 500; }}
@font-face {{ font-family: InterW; src: url(file://{FONTS}/inter-latin-700-normal.woff2); font-weight: 700; }}
body {{ font-family: InterW, sans-serif; color: #16132B; font-size: 10.3pt; line-height: 1.5; }}
h1 {{ font-family: Jakarta; font-size: 26pt; letter-spacing: -.02em; margin: 2mm 0 3mm; line-height: 1.1; }}
h2 {{ font-family: Jakarta; font-size: 15pt; margin: 4mm 0 2mm; }}
.k {{ color: #6D4AE8; font-weight: 700; font-size: 9pt; letter-spacing: .12em; text-transform: uppercase; }}
.box {{ border: 1px solid #E4DBFF; border-radius: 3mm; padding: 4mm 5mm; margin: 3mm 0; background: #FBFAFF; page-break-inside: avoid; }}
.emo {{ border: 1px solid #F3D9A4; background: #FFF8EA; border-radius: 3mm; padding: 3mm 4.5mm; margin: 3mm 0; }}
.prompt {{ font-size: 8.3pt; line-height: 1.42; white-space: pre-wrap; background: #F6F3FF; border-left: 3px solid #6D4AE8; padding: 3mm 4mm; border-radius: 1.5mm; }}
.old {{ color: #8A5A00; font-weight: 700; }} .new {{ color: #157A4A; font-weight: 700; }}
.clip {{ page-break-before: always; }}
.small {{ color: #6B7085; font-size: 9pt; }}
table {{ width: 100%; border-collapse: collapse; }}
td, th {{ vertical-align: top; padding: 2mm 2.4mm; border-bottom: 1px solid #ECE8FA; text-align: left; font-size: 9.3pt; }}
th {{ font-size: 8pt; letter-spacing: .1em; text-transform: uppercase; color: #6D4AE8; border-bottom: 1.5px solid #6D4AE8; }}
ul {{ margin: 1mm 0; padding-left: 5mm; }}'''

SUMMARY = (f'{len(CLIPS)} clips of 8 seconds (about {len(CLIPS) * 8 // 60}:{len(CLIPS) * 8 % 60:02d}), vertical 9:16, one male host in a dim, warm studio, in the style of the reference reel: '
           'for each problem he points to the top-right of the frame for the old way (3–4 very short lines), then to the top-left for '
           'the Tooth Referral benefit (one sentence). Every clip starts on the last frame of the one before, so the clips cut together '
           'as one continuous take. No graphics are generated: the labels and icons go in during the edit.')
HOW = ['Generate the 3 reference images first (studio background, host avatar, host start frame), then the clips in order 01–' + f'{len(CLIPS):02d}.',
       'For each clip after 01, use the last frame of the previous clip as the start image (in Flow: extend / use last frame), plus the background and avatar images as ingredients.',
       'His LEFT hand appears on the RIGHT of the frame: put the "old way" labels top-right and the "Tooth Referral" labels top-left, above each finger.',
       'Every prompt ends in the same rest pose, so cuts between clips are invisible.',
       'If Flow’s voice drifts between clips, re-record the full voice-over below in ElevenLabs with one male voice and lip-sync to it.']

plan = ''.join(f'<tr><td>{c[0]}</td><td><b>{E(c[1])}</b></td><td><span class="old">{E(c[2])}</span><br><span class="new">{E(c[3])}</span></td><td>{words(c)}</td></tr>' for c in CLIPS)
vo = ' '.join(line(c) for c in CLIPS)
parts = [f'''<div class="k">Tooth Referral · hand-gesture series · Google Flow</div><h1>The Old Way vs. Tooth Referral</h1>
<p>{E(SUMMARY)}</p><div class="box"><b>How to use this</b><ul>{''.join(f'<li>{E(h)}</li>' for h in HOW)}</ul></div>
<h2>Clip plan</h2><table><tr><th>#</th><th>Clip</th><th>Line (<span class="old">old way</span> → <span class="new">Tooth Referral</span>)</th><th>Words</th></tr>{plan}</table>
<h2>Full voice-over</h2><div class="box">{E(vo)}</div>''',
 f'''<div class="clip"><div class="k">Step 1 · reference images</div>
<h2>1. Host studio background</h2><div class="prompt">{E('Vertical 9:16 photograph of ' + BG + ' ' + NOANIM)}</div>
<h2>2. Host avatar (male)</h2><div class="prompt">{E(AVATAR)}</div>
<h2>3. Host start frame (rest pose) · start image for clip 01</h2><p class="small">References: background + host avatar.</p><div class="prompt">{E(START)}</div></div>''']
for c in CLIPS:
    beats = ''.join(f'<li><b>{E(t)}</b> — {E(g)}</li>' for t, g in c[4])
    edit = (f'Labels: top-right “{E(c[6][0])}”; top-left “{E(c[6][1])}”.' if c[6][0] else 'No labels (hook); optional title in the edit.')
    parts.append(f'''<div class="clip"><div class="k">Clip {c[0]} · 8 seconds · start: {'host start frame' if c[0] == '01' else 'last frame of clip ' + f'{int(c[0]) - 1:02d}'}</div><h2>{E(c[1])}</h2>
<div class="box"><div class="k" style="font-size:8pt">On-camera line · lip-synced · {words(c)} words</div>
<div style="font-size:11pt"><span class="old">Old way:</span> “{E(c[2])}”<br><span class="new">Tooth Referral:</span> “{E(c[3])}”</div>
<div class="small" style="margin-top:2mm"><b>Edit:</b> {edit}</div></div>
<div class="emo"><b>Gestures, one by one</b><ul>{beats}</ul><b>Emotion:</b> {E(c[5])}</div>
<div class="k" style="margin-top:3mm">Google Flow prompt (copy all)</div><div class="prompt">{E(prompt(c))}</div></div>''')

doc = os.path.join(D, 'src', '_ow.html'); js = os.path.join(D, 'src', '_ow.cjs')
open(doc, 'w').write(f'<html><head><meta charset="utf-8"><style>{css}</style></head><body>{"".join(parts)}</body></html>')
open(js, 'w').write(f'''const {{ chromium }} = require('playwright');
(async () => {{ const b = await chromium.launch(); const p = await b.newPage(); await p.goto('file://{doc}');
await p.evaluate(() => document.fonts.ready); await p.pdf({{ path: '{PDF}', format: 'A4', printBackground: true }}); await b.close(); }})();''')
subprocess.run(['node', js], check=True, cwd='/home/user/awesome-opus-5-5-prompts/reel')
os.remove(doc); os.remove(js)

md = [f'# The Old Way vs. Tooth Referral · 8-second clips + Google Flow\n\n{SUMMARY}\n\n## How to use this\n'] + [f'- {h}' for h in HOW]
md += ['\n## Full voice-over\n', '> ' + vo, '\n## Step 1 · Reference images\n', '### 1. Host studio background\n',
       '> Vertical 9:16 photograph of ' + BG + ' ' + NOANIM, '\n### 2. Host avatar (male)\n', '> ' + AVATAR, '\n### 3. Host start frame (rest pose)\n', '> ' + START,
       '\n## Clips\n']
for c in CLIPS:
    md += [f'### Clip {c[0]} · {c[1]} · 8 s\n', f'- **Old way:** "{c[2]}"', f'- **Tooth Referral:** "{c[3]}"',
           f'- **Emotion:** {c[5]}', '- **Gestures:**'] + [f'  - {t}: {g}' for t, g in c[4]] + ['', '> ' + prompt(c).replace('\n', '\n> '), '']
open(MD, 'w').write('\n'.join(md))
for c in CLIPS: print(c[0], words(c), 'words', round(words(c) / 2.4, 1), 's at 2.4 w/s')
