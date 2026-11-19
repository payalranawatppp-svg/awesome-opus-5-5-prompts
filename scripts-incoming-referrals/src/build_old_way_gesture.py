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
RIGHT_UP = ('RIGHT-HAND POINT: his RIGHT hand raised just above shoulder height, index finger extended, pointing up toward the TOP-LEFT '
            'corner of the frame and held still; his LEFT hand down, relaxed at his side/lower chest, out of the way')


def beats(old, new, old_acc, new_acc, first=False, last=False):
    start = ('Starts in the rest pose.' if first else
             'Starts exactly as the last frame of clip xx: the RIGHT-HAND POINT (right hand still raised toward the top-left, left hand down).')
    switch_in = ('his hands part from the chest' if first else 'his RIGHT hand lowers all the way down, out of the gesture')
    return [
        ('0.0–0.4 s', start),
        ('0.4–0.9 s', f'In one smooth move {switch_in} and his LEFT hand (it appears on the RIGHT side of the frame) rises to just above '
                          'shoulder height, index finger extended, pointing up toward the TOP-RIGHT corner of the frame.'),
        ('0.9–3.7 s', f'He HOLDS that left-hand point completely still, finger locked toward the top-right, the WHOLE time he says "{old}". '
                          'The finger does not move, tap or drop until the line is finished; only his head and face react: ' + old_acc),
        ('3.7–4.2 s', 'The switch, in one smooth move: his LEFT hand drops all the way down (out of the gesture) as his RIGHT hand (it '
                          'appears on the LEFT side of the frame) rises to just above shoulder height, index finger extended, pointing up '
                          'toward the TOP-LEFT corner of the frame. Only one hand is ever up.'),
        ('4.2–8.0 s', f'He HOLDS that right-hand point completely still, finger locked toward the top-left, the WHOLE time he says "{new}", '
                          'and KEEPS holding it after the line, all the way to the last frame of the clip (the next clip starts from this pose). '
                          'Only his head and face react: ' + new_acc + (' ' + last if last else '')),
    ]


SKEP = 'a small sceptical head shake, brows pinched.'
YES = 'head turns a few degrees toward the raised hand and back to the lens, eyebrows lift, a confident smile and a small nod.'
# (n, title, old line, new line, beats, emotion, edit labels (old, new)) - lines kept as short as the reference reel
_C = [
 ('The hook', 'Still doing referrals the old way?', 'Here’s the Tooth Referral way.',
  'one eyebrow raised, head tilted, a playful challenge.', YES, 'Curious, playful challenge, then confident.', ('', '')),
 ('How referrals arrive', 'Faxes. PDFs. Voicemails.', 'Tooth Referral: one complete referral.',
  'a slow, weary head shake across the three words, brows pinched.', YES, 'Mildly exasperated, then sure.', ('Faxes · PDFs · Voicemails', 'One complete referral')),
 ('Updates', 'Email chains.', 'One case. Both offices.', SKEP, YES, 'Wry, then reassuring.', ('Email chains', 'One case, both offices')),
 ('Communication', 'Phone tag.', 'Every message, with the patient.', 'a quick eye-roll and half-smile toward the lens.', YES, 'Wry, then warm.', ('Phone tag', 'Every message with the patient')),
 ('Status', 'Sticky notes.', 'Every step, logged.', 'head tilts, a questioning look.', 'two small confident nods.', 'Questioning, then sure.', ('Sticky notes', 'Every step logged')),
 ('Insurance', 'Blurry card photos.', 'Card requested. Checks tracked.', 'he squints slightly, as if trying to read something.', 'a firm, confident nod.', 'Frustrated, then in control.', ('Blurry card photos', 'Card requested · Checks tracked')),
 ('Consultation notes', 'Typed by hand.', 'Templates. Signed in seconds.', SKEP, 'a satisfied smile and a small nod.', 'Tired, then satisfied.', ('Typed by hand', 'Templates · e-signature')),
 ('Efficiency', 'Same data, three systems.', 'Enter once. Done.', 'brows pinched, a weary half-smile.', 'a firm nod on "once", then a satisfied smile.', 'Weary, then satisfied.', ('Same data × 3 systems', 'Enter once')),
 ('Website leads', 'Web form to an inbox.', 'Leads, straight to your list.', SKEP, YES, 'Matter-of-fact, then upbeat.', ('Form → inbox', 'Leads → your list')),
 ('Your numbers', 'Gut feeling.', 'Live analytics.', 'head tilts, a sceptical squint.', YES, 'Sceptical, then sharp.', ('Gut feeling', 'Live analytics')),
 ('What makes it different', 'Not a form. Not AI hype.', 'Real two-way software. HIPAA compliant.',
  'a small side-to-side head shake on each "Not".', 'serious, trustworthy eye contact and a slow nod.', 'Emphatic, then trustworthy.', ('Not a form · Not AI hype', 'Two-way · HIPAA compliant')),
 ('The close', 'Stop chasing referrals.', 'Start working them. Together.', 'a small knowing head shake.', 'a warm smile.', 'Confident, warm, final.', ('Stop chasing', 'Start working them')),
]
CLIPS = []
for i, (t, o, n, oa, na, emo, lab) in enumerate(_C, 1):
    last = ('This is the final clip: the right-hand point holds still to the very last frame, with a confident warm smile into the lens (a clean last frame for the end card).'
            if i == len(_C) else None)
    CLIPS.append(('xx', t, o, n, beats(o, n, oa, na, first=i == 1, last=last), emo, lab))


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
        f'Starting position: {REST if c[0] == "01" else RIGHT_UP}.',
        LOOK,
        'Background (exactly as the Host studio background image): ' + BG,
        'Character (exactly as the Host avatar image): THE HOST: ' + AV_LOOK,
        f'Emotion: {c[5]}',
        'Hand gestures and head movement, one by one, in this order. One hand points at a time and HOLDS its point the whole time he talks about that side; '
        'the other hand is down. His eyes stay on the lens, never following the finger: ' + beats,
        'Framing: mid-chest up, centred, locked-off; both raised hands stay fully inside the frame, finger tips well below the top edge.',
        'DIALOGUE (on camera, lip-synced). Exactly one spoken line in this clip. VOICE-OVER: none.',
        f'Speaker: THE HOST, facing the camera. Voice: {VOICE}.',
        f'Line (say it once, word for word, nothing added, nothing left out, with a clear pause of about one second between the two halves): "{c[2]} … {c[3]}"',
        'Timing: two short, punchy halves with a silent hold between them: the first half at about 0.6 s, the second half at about 4.0 s, each followed by a held pointing pose; finished speaking by about 6.5 s.',
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
           'for each problem he points to the top-right of the frame for the old way (a few punchy words), then to the top-left for '
           'the better way (a few punchy words), holding each point like the reference reel. The brand name is said only twice (clips 01–02). Every clip starts on the last frame of the one before, so the clips cut together '
           'as one continuous take. No graphics are generated: the labels and icons go in during the edit.')
HOW = ['Generate the 3 reference images first (studio background, host avatar, host start frame), then the clips in order 01–' + f'{len(CLIPS):02d}.',
       'For each clip after 01, use the last frame of the previous clip as the start image (in Flow: extend / use last frame), plus the background and avatar images as ingredients.',
       'His LEFT hand appears on the RIGHT of the frame: put the "old way" labels top-right and the "Tooth Referral" labels top-left, above each finger.',
       'The old way is always his LEFT hand pointing up to the top-right of the frame, held for the whole old-way line; then that hand drops and his RIGHT hand points up to the top-left, held for the whole Tooth Referral line and to the end of the clip. Each next clip starts from that right-hand point, so the cuts are invisible.',
       'Lines are short on purpose, like the reference reel. Each clip is generated at 8 s with held points; in the edit, trim the silent holds so each pair lands in about 3–5 s (the whole video then runs about 45–55 s).',
       'The name “Tooth Referral” is spoken only in clips 01 and 02; after that, the logo and labels carry the brand.',
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
