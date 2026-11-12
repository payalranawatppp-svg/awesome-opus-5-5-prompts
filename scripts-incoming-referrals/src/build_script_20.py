"""Script 20 "Did They Ever Send It?" -> Markdown + PDF with Google Flow prompts.

Built from Buried in Emails v2 (Vejay's foundation), but a different problem: the referral loop that never closes.
A patient is about to get her crown at the general dentist's office, and the specialist's signed completion note never
arrived. Three characters only (user, 2026-11-12): Greg (Front Desk, Gentle Dental, general dentist), Tanya (Front
Desk, St. Andrew's Family Dental, specialist) and Amanda (Treatment Coordinator, St. Andrew's). Greg and Tanya talk by
phone across the two offices; Amanda and Tanya introduce Tooth Referral by name. Every clip prompt carries the full
background, the full look of each character in the shot, and a "continue from the start image" line with the exact
starting position, so each clip picks up from the last frame of the one before it in the same office.
Rules: no "GP", no doctors' names, staff only Barbara/Tanya/Amanda/Greg, no red, no "EHR", no "shared inbox"."""
import html, os, subprocess
E = html.escape
D = '/home/user/awesome-opus-5-5-prompts/scripts-incoming-referrals'
NAME = 'Script-20-Did-They-Ever-Send-It-Google-Flow'
MD = os.path.join(D, NAME + '.md')
PDF = os.path.join(D, NAME + '.pdf')
FONTS = '/home/user/awesome-opus-5-5-prompts/reel/public/fonts'

LOOK = ('Horizontal 16:9 video, 8 seconds, one continuous shot. Photorealistic live-action footage that looks professionally filmed, '
        'not AI-generated: shot on a cinema camera (Sony FX3 look) with a 35mm lens, natural daylight plus soft practical office lights, '
        'true-to-life colours, real skin texture with pores, subtle film grain, natural imperfections, natural unhurried movement, no glossy '
        'or plastic look.')

BG = {
 'GD': ('Horizontal 16:9 photograph of the front office of a real, bright, family general dentist practice, shot from the waiting area '
        'looking at the reception counter, eye level, 35mm lens, f/2.8, a professional interiors photo. A white reception counter with a '
        'walnut top and a raised ledge; behind it two workstations, each with a slim black monitor angled away from the camera, a keyboard, '
        'a pen cup, manila patient folders and a small tooth model, and a black cordless desk phone standing in its charging base. A soft '
        'powder-blue accent wall behind the counter with a blank brushed-metal sign shape (no letters). On the left a glass entry door and a '
        'tall window with bright morning daylight. A light-grey sofa, a small kids\' corner with a low bookshelf and picture books, a potted '
        'olive tree. Light oak floor, warm recessed lights plus daylight, true-to-life colours, lived-in details (sticky notes, a coffee mug, '
        'a wall calendar with no readable text). Real-photo texture, subtle grain. No people, no readable text, no logos, no red objects, no '
        'CGI look.'),
 'SA': ('Horizontal 16:9 photograph of the front office of a real, calm, upscale dental specialist practice, shot from the waiting area '
        'looking at the reception desk, eye level, 35mm lens, f/2.8, a professional interiors photo. A curved reception desk with fluted '
        'white panels and a warm wood top; behind it two workstations with slim black monitors angled away from the camera, keyboards, a '
        'black desk phone, a paper tray with printed pages, a pen cup and folders, and a spare rolling chair. A deep navy feature wall behind '
        'the desk with a blank brushed-brass sign shape (no letters). On the right a hallway to treatment rooms with frosted glass doors and a '
        'glimpse of a modern dental chair and overhead light. Warm greige walls, wood floors, three brass pendant lights over the desk, a '
        'large fiddle-leaf fig, a tall window with soft late-afternoon golden light. Real-photo texture, subtle grain. No people, no readable '
        'text, no logos, no red objects, no CGI look.'),
}
LOCNAME = {'GD': 'Gentle Dental', 'SA': "St. Andrew's"}

ORDER = ['GREG', 'TANYA', 'AMANDA']
ROLE = {'GREG': 'Front Desk, Gentle Dental (general dentist)', 'TANYA': "Front Desk, St. Andrew's Family Dental (specialist)",
        'AMANDA': "Treatment Coordinator, St. Andrew's Family Dental (specialist)"}
VOICE = {
 'GREG': 'a friendly, easy late-20s male voice with a natural neutral American accent',
 'TANYA': 'a bright, quick late-20s female voice with a natural neutral American accent',
 'AMANDA': 'a calm, warm early-40s female voice with a natural neutral American accent',
}
ELEVEN = {'GREG': 'Chris', 'TANYA': 'Bella', 'AMANDA': 'a calm, warm premade female voice (different from Bella)'}
APPEAR = {
 'GREG': ('GREG (Front Desk, Gentle Dental): a man in his late 20s with warm brown skin, short black curly hair, a neatly trimmed '
          'beard, warm dark-brown eyes and a black smartwatch. He wears ceil-blue scrubs and a small blank white name badge (no text). '
          'Friendly and upbeat, with a natural open smile.'),
 'TANYA': ('TANYA (Front Desk, St. Andrew\'s Family Dental): a woman in her late 20s with long dark curly hair in a high ponytail, warm '
           'brown eyes, light natural makeup and small gold hoop earrings. She wears lavender scrubs and a small blank white name badge '
           '(no text). Energetic, quick and friendly.'),
 'AMANDA': ('AMANDA (Treatment Coordinator, St. Andrew\'s Family Dental): a woman in her early 40s with straight black hair in a neat '
            'low bun, black-framed glasses, dark brown eyes, light natural makeup and small silver studs. She wears an olive-green scrub '
            'top over a white long-sleeve undershirt and a small blank white name badge (no text). Calm, organised and thoughtful.'),
}
AV = {
 'GREG': ('GREG, a dental front-desk coordinator in his late 20s, standing behind a white reception counter with a walnut top, one hand on '
          'the counter. Warm brown skin, short black curly hair, a neatly trimmed beard, warm dark-brown eyes, a black smartwatch. He wears '
          'ceil-blue scrubs and a small blank white name badge (no text). Friendly, upbeat, a natural open smile.', 'GD'),
 'TANYA': ('TANYA, a dental front-desk coordinator in her late 20s, standing in the hallway beside the reception desk holding a manila folder. '
           'Long dark curly hair in a high ponytail, warm brown eyes, light natural makeup, small gold hoop earrings. She wears lavender scrubs '
           'and a small blank white name badge (no text). Energetic, quick, friendly: a bright smile.', 'SA'),
 'AMANDA': ('AMANDA, a dental treatment coordinator in her early 40s, sitting at a reception workstation turned toward the camera. Straight '
            'black hair in a neat low bun, black-framed glasses, dark brown eyes, light natural makeup, small silver studs. She wears an '
            'olive-green scrub top over a white long-sleeve undershirt and a small blank white name badge (no text). Calm, organised, '
            'thoughtful: a quiet, warm smile.', 'SA'),
}
AV_BACK = {
 'GD': 'Behind, softly out of focus: the same Gentle Dental front office as the background image (powder-blue accent wall, white and walnut counter, glass entry door with morning daylight).',
 'SA': 'Behind, softly out of focus: the same St. Andrew\'s front office as the background image (navy feature wall, fluted white desk, brass pendant lights, warm late-afternoon light).',
}
def avatar(k):
    desc, loc = AV[k]
    return ('Horizontal 16:9 photorealistic portrait, medium shot from the waist up, eye level, 50mm lens, f/2.8, a real photo taken in a '
            'dental office, natural daylight plus warm ceiling lights, true-to-life colours, real skin texture with pores, subtle grain, no '
            f'beauty filter. {desc} {AV_BACK[loc]} Real, professional, lived-in. No readable text, no logos, no red clothing or objects, no '
            'extra people, no warped hands or fingers.')

CAST = {
 'GD': ('Horizontal 16:9 photograph, the same Gentle Dental front office as the background image, shot from the waiting area looking at '
        'the reception counter, eye level, 35mm lens, morning daylight plus warm ceiling lights, real-photo texture, subtle grain. GREG (the '
        'man from the Greg avatar: late 20s, warm brown skin, short black curly hair, trimmed beard, ceil-blue scrubs, black smartwatch, '
        'blank name badge) sits alone behind the counter at the left workstation, facing the monitor (soft glow, screen not readable), his '
        'right hand on the mouse, the black cordless phone in its base beside him, a slight frown. Nobody else in the room. Natural, candid. '
        'No readable text, no logos, no red objects, no extra people, no warped hands.'),
 'SA': ('Horizontal 16:9 photograph, the same St. Andrew\'s front office as the background image, shot from the waiting area looking at '
        'the curved reception desk, eye level, 35mm lens, late-afternoon golden light plus brass pendant lights, real-photo texture, subtle '
        'grain. AMANDA (the woman from the Amanda avatar: early 40s, black hair in a low bun, black-framed glasses, olive-green scrub top over '
        'a white long-sleeve undershirt) sits at the right workstation typing. TANYA (the woman from the Tanya avatar: late 20s, dark curly '
        'high ponytail, lavender scrubs, gold hoops) walks out of the treatment-room hallway toward the desk holding a manila folder, '
        'mid-stride. Nobody else in the room. Natural, candid. No readable text, no logos, no red objects, no extra people, no warped hands.'),
}
NEG = ('No music, no subtitles, no captions, no on-screen text, no readable screens, no logos, no red clothing or props, no extra people, '
       'no warped hands or fingers, no lip-sync drift, no sudden objects appearing in hands, no jump cut or reset at the start.')

# start image sources
CAST_GD = 'the Gentle Dental cast image'
CAST_SA = "the St. Andrew's cast image"
def LAST(n): return f'the last frame of clip {n:02d}'

# (title, loc, start image, start position, [(speaker, line, delivery)], action, camera, sounds, edit note)
CLIPS = [
 # ---------------- the problem
 ('Ten minutes', 'GD', CAST_GD,
  'GREG sits alone behind the counter at the left workstation, facing the monitor, right hand on the mouse, the cordless phone in its base beside him, a slight frown.',
  [('GREG', "Sarah's crown is in ten minutes... and her completion note never came.", 'muttering to himself, worried but calm')],
  'GREG scrolls once more, sighs, glances toward the waiting area off-frame on the left, then lifts the cordless phone out of its base, dials a number with his thumb and holds the phone to his ear while he says the line under his breath.',
  'medium shot from across the counter, eye level, static, with a very slow push-in.',
  'a mouse click, phone keypad beeps',
  'Amber pop-up beside the monitor: "Completion note: not received". Lower-third: "Gentle Dental · general dentist".'),
 ('The other side', 'SA', CAST_SA,
  'AMANDA sits at the right workstation typing; TANYA is walking out of the treatment-room hallway toward the desk holding a manila folder, mid-stride.',
  [('TANYA', "St. Andrew's Family Dental, this is Tanya.", 'bright, a little out of breath')],
  'The desk phone rings. TANYA keeps walking and speeds up (0 to 3 seconds), sets the folder down on the desk at the left workstation, picks up the receiver and answers while still standing. AMANDA keeps typing and glances over.',
  'medium-wide shot from the waiting area, eye level, the camera pans gently with Tanya as she walks to the desk, then holds.',
  'a desk phone ringing, quick footsteps, a folder set down on the desk',
  'Lower-third: "St. Andrew\'s Family Dental · specialist". A thin line links the two offices.'),
 ('Emailed twice', 'GD', LAST(1),
  'GREG sits at the left workstation with the cordless phone at his ear, exactly as at the end of clip 01.',
  [('GREG', "Hi Tanya, it's Greg at Gentle Dental. Did Sarah Collins' completion note go out? I emailed twice.", 'polite, friendly, a little rushed')],
  'GREG stands up with the phone at his ear and walks a few slow steps along behind the counter toward the window while he talks, glancing out toward the waiting area, his free hand resting on the counter as he walks.',
  'medium shot from across the counter, eye level, the camera tracks slowly sideways with Greg as he walks, then holds.',
  'footsteps on the wood floor',
  'Two sent emails stack up beside Greg, both "No reply".'),
 ('Email or fax?', 'SA', LAST(2),
  'TANYA stands at the left workstation with the phone receiver at her ear; AMANDA sits at the right workstation, exactly as at the end of clip 02.',
  [('TANYA', 'One second, Greg.', 'into the phone, friendly'),
   ('TANYA', 'Did Sarah Collins\' note go out by email or fax?', 'quiet, turning to Amanda'),
   ('AMANDA', 'Fax, I think. Check the tray.', 'thinking, calm')],
  'TANYA says the first line into the phone, then presses the receiver against her shoulder, turns to AMANDA and asks. Amanda pushes her glasses up, thinks for a second and points her pen at the paper tray. Tanya sits down in her chair, the receiver still on her shoulder, and reaches for the paper tray.',
  'medium two-shot across the desk, eye level, static.',
  'a chair creaking',
  'The note splits into an email, a fax page and a sticky note, scattered: "Where did it go?"'),
 ('Found it', 'SA', LAST(4),
  'TANYA sits at the left workstation with the receiver on her shoulder and one hand on the paper tray; AMANDA sits at the right workstation, exactly as at the end of clip 04.',
  [('TANYA', "Found it. Greg, I'm so sorry, I'm faxing it right now.", 'relieved, apologetic, warm')],
  'TANYA flips through the printed pages, pulls one out, looks at it and lets out a breath, then lifts the receiver back to her ear and says the line, holding the page up. She hangs up and leans back in her chair with the page in her hand. AMANDA watches her with a sympathetic half-smile.',
  'medium close-up on Tanya, Amanda soft at the right edge, eye level, static.',
  'papers being flipped, the receiver set down',
  'Amber clock chip: "Patient waiting".'),
 ('The patient waits', 'GD', LAST(3),
  'GREG stands behind the counter near the window with the cordless phone at his ear, exactly as at the end of clip 03.',
  [('GREG', 'Thanks, Tanya.', 'into the phone, kind'),
   ('GREG', 'Every office sends things a different way... and the patient waits.', 'quietly, to himself, honest')],
  'GREG listens, nods, says thanks and lowers the phone. He walks back along the counter to his workstation, sets the phone in its base, sits down, leans his elbows on the counter and rubs his face with both hands, then looks out toward the waiting area as he says the last line.',
  'medium shot from across the counter, eye level, the camera tracks slowly with Greg back to his chair, then holds with a slow push-in.',
  'footsteps, the phone clicking into its base',
  'Soft amber card: "Nobody\'s fault. Every office works differently."'),
 # ---------------- Amanda and Tanya introduce Tooth Referral
 ("Let's set up Tooth Referral", 'SA', LAST(5),
  'TANYA sits at the left workstation leaning back, holding the printed page; AMANDA sits at the right workstation, exactly as at the end of clip 05.',
  [('AMANDA', "This keeps happening. Let's set up Tooth Referral.", 'calm, decided'),
   ('TANYA', 'Tooth Referral?', 'curious'),
   ('AMANDA', 'One case for every referral. Both offices on it.', 'clear, easy')],
  'AMANDA gets up from her chair, walks around behind Tanya (0 to 3 seconds), pulls the spare rolling chair over and sits down next to her, turning Tanya\'s monitor slightly toward them both (soft glow, screen not readable). TANYA puts the page down and turns her chair toward Amanda, interested.',
  'medium-wide two-shot from the waiting area, eye level, the camera drifts gently with Amanda as she walks over, then holds on the two of them.',
  'footsteps, a chair rolling',
  'The Tooth Referral logo appears beside Amanda, then a single case card: "One case per referral · both offices".'),
 ('How it works', 'SA', LAST(7),
  'TANYA and AMANDA sit side by side at the left workstation, the monitor turned slightly toward them, exactly as at the end of clip 07.',
  [('AMANDA', 'Messages, X-rays, insurance, the signed note. All on the case. Gentle Dental sees it too.', 'explaining to a friend'),
   ('TANYA', "Let's invite Greg's office today.", 'smiling, energised')],
  'AMANDA counts the four items on her fingers, then gestures with an open palm toward the monitor on "all on the case" and points out toward the window on "Gentle Dental". TANYA nods along, breaks into a smile and pulls her keyboard closer.',
  'medium close-up two-shot, eye level, very slow push-in, soft golden light on both faces.',
  'a keyboard pulled across the desk',
  'Split screen: the Tooth Referral case with messages, an X-ray, the insurance card and the signed note; then "Invite your network" sends an invite to Gentle Dental. White flash cut to: "One month later".'),
 # ---------------- one month later
 ('Already on the case', 'GD', CAST_GD,
  'GREG sits behind the counter at the left workstation, facing the monitor, right hand on the mouse, the cordless phone in its base beside him (the same position as the Gentle Dental cast image, but now relaxed, with no frown).',
  [('GREG', "David's signed note is already on the case. Copying it into our electronic health record... done.", 'relaxed, pleased, reading aloud as he works')],
  'GREG clicks, reads the screen and smiles, clicks twice more, then taps one key with a small flourish on "done" and leans back in his chair with his hands behind his head. The cordless phone stays silent in its base.',
  'medium shot from across the counter, eye level, static, with a very slow push-in.',
  'mouse clicks, a key tap, a relaxed exhale',
  'Split screen: the case with status "Treatment completed", the signed note with its e-signature, then "Copy into your electronic health record".'),
 ('Quiet phone', 'SA', CAST_SA,
  'AMANDA sits at the right workstation typing; TANYA is walking out of the treatment-room hallway toward the desk holding a manila folder, mid-stride (the same position as the St. Andrew\'s cast image).',
  [('TANYA', "Gentle Dental hasn't called once this week.", 'amused, a little surprised'),
   ('AMANDA', "They don't need to. They see the status, and they message us right on the case.", 'calm, matter-of-fact')],
  'TANYA walks to the desk, passes the desk phone, looks at it (it stays silent) and laughs softly, then sits down at the left workstation. AMANDA rolls her chair over next to her and points at Tanya\'s monitor with her pen.',
  'medium-wide shot from the waiting area, eye level, the camera pans with Tanya to the desk, then a slow push-in on the two of them.',
  'footsteps, a chair rolling, a soft laugh',
  'Split screen: the status timeline both offices see, and a message from Greg on the case.'),
 ('Same place', 'SA', LAST(10),
  'TANYA sits at the left workstation and AMANDA sits beside her, pen in hand, exactly as at the end of clip 10.',
  [('TANYA', 'And when we need an X-ray or insurance from them?', 'curious'),
   ('AMANDA', 'Same place. Insurance is one secure link. Setup took five minutes.', 'easy, sure')],
  'TANYA turns to AMANDA with her question. Amanda taps the desk once with her pen on "same place", then leans back with her arms crossed and a small smile. Tanya nods slowly, impressed.',
  'medium close-up two-shot, eye level, static, soft golden light on both faces.',
  '',
  'Split screen: an X-ray attached on the case, then the HIPAA-secure insurance request link. Chip: "Set up in about 5 minutes".'),
 ('One conversation', 'SA', LAST(11),
  'TANYA sits at the left workstation; AMANDA sits beside her leaning back with her arms crossed, exactly as at the end of clip 11.',
  [('TANYA', "Feels like we're one office.", 'warm, smiling'),
   ('AMANDA', "Two offices. One conversation. That's Tooth Referral.", 'warm, simple')],
  'TANYA smiles and types a quick message on her keyboard. AMANDA stands up, picks up a folder from the desk, gives Tanya a light tap on the shoulder and walks off toward the treatment-room hallway, glancing back with a smile.',
  'medium-wide shot from the waiting area, eye level, static, Amanda walking out of frame toward the hallway at the end.',
  'keyboard typing, footsteps',
  'Split screen of both offices side by side (Greg at Gentle Dental, Tanya at St. Andrew\'s), joined by one case. End card: "Tooth Referral. Two offices, one conversation." · toothreferral.com'),
]


def background(loc):
    """The background image prompt, as a scene description (camera framing and the 'no people' line removed)."""
    t = BG[loc].replace('Horizontal 16:9 photograph of the', 'The')
    t = t.split(', shot from the waiting area', 1)[0] + '.' + t.split('a professional interiors photo.', 1)[1]
    return t.replace(' No people, no readable text, no logos, no red objects, no CGI look.', '').strip()


def cast_in(c):
    start, lines, action = c[3], c[4], c[5]
    return [k for k in ORDER if k in action or k in start or k in {sp for sp, _, _ in lines}]


def prompt(c):
    title, loc, src, start, lines, action, camera, sounds, _ = c
    who = '\n'.join(APPEAR[k] for k in cast_in(c))
    talk = ' '.join(f'{sp} speaks with {VOICE[sp]}, {how}. Perfectly lip-synced: "{ln}"' for sp, ln, how in lines)
    snd = f', {sounds}' if sounds else ''
    return (f'Start image: {src}. Continue from the exact position in the start image: the clip begins on that frame, with the same camera '
            f'angle, framing, lighting, props, and the same position, pose and expression of every character, and the action continues '
            f'naturally from there, with no jump, reset or change of outfit. Starting position: {start}\n'
            f'{LOOK}\nBackground (exactly as the {LOCNAME[loc]} background image): {background(loc)}\n'
            f'Characters (exactly as their avatar images):\n{who}\nAction: {action}\nCamera: {camera}\n{talk}\n'
            f'Audio: only the spoken lines{snd} and quiet office room tone. {NEG}')


n = len(CLIPS)
SUMMARY = (f'{n} clips × 8 s ≈ {n*8} s · horizontal 16:9 · three characters: Greg (Gentle Dental, general dentist), Tanya and Amanda '
           '(St. Andrew\'s Family Dental, specialist) · professional live-action look.')
acts = {0: '### Act 1 · the problem (Greg calls Tanya)', 6: "### Amanda and Tanya introduce Tooth Referral",
        8: '### Act 2 · one month later, with Tooth Referral'}
START_NOTE = ('How to keep every clip continuous: clips 01 and 09 start from the Gentle Dental cast image, clips 02 and 10 from the '
              'St. Andrew\'s cast image. Every other clip starts from the last frame of the clip named in its prompt (in Google Flow, '
              'save that last frame and use it as the start frame, or use "Extend" on that clip). Add the background and avatar images '
              'as ingredients too.')

# ---------------- Markdown
md = ['# Script 20: "Did They Ever Send It?" · Google Flow prompts', '', SUMMARY, '',
      'Problem: the referral loop that never closes. Sarah is about to get her crown at Gentle Dental, and the specialist\'s signed '
      'completion note never arrived. Greg calls Tanya at St. Andrew\'s; the note was signed Friday but nobody is sure how it went out. '
      'Nobody is blamed: every office sends things a different way. Amanda introduces Tooth Referral to Tanya, they invite Greg\'s office, '
      'and one month later it all lives on the case.', '', '## The script', '']
for i, c in enumerate(CLIPS):
    if i in acts: md += [acts[i], '']
    md.append(f'**{i+1:02d} · {c[0]}** ({LOCNAME[c[1]]})  ')
    for sp, ln, _ in c[4]:
        md.append(f'{sp.capitalize()}: "{ln}"  ')
    md.append('')
md += ['## Cast (three characters)', '']
for k in ORDER:
    md.append(f'- **{k.capitalize()}**, {ROLE[k]}. Voice: {VOICE[k]}.')
md += ['', '## Step 1 · Reference images (generate these first, in this order)', '',
       '### 1. Gentle Dental background', '', '> ' + BG['GD'], '', "### 2. St. Andrew's background", '', '> ' + BG['SA'], '']
num = 3
for k in ORDER:
    md += [f'### {num}. {k.capitalize()} avatar', '', '> ' + avatar(k), '']; num += 1
md += [f'### {num}. Gentle Dental cast image (Greg alone at his workstation)', '', '> ' + CAST['GD'], '',
       f"### {num+1}. St. Andrew's cast image (Amanda at the desk, Tanya walking in)", '', '> ' + CAST['SA'], '',
       START_NOTE, '', '## Clip prompts', '']
for i, c in enumerate(CLIPS, 1):
    md += [f'### CLIP {i:02d} · {c[0]} ({LOCNAME[c[1]]}) · start: {c[2]}',
           '**Dialogue:** ' + ' · '.join(f'{sp}: "{ln}"' for sp, ln, _ in c[4]), '',
           '\n'.join('> ' + l for l in prompt(c).split('\n')), '', f'*Edit:* {c[8]}', '']
open(MD, 'w').write('\n'.join(md))

# ---------------- PDF
css = f'''@page {{ size: A4; margin: 16mm 15mm; }}
@font-face {{ font-family: Jakarta; src: url(file://{FONTS}/plus-jakarta-sans-latin-800-normal.woff2); font-weight: 800; }}
@font-face {{ font-family: InterW; src: url(file://{FONTS}/inter-latin-500-normal.woff2); font-weight: 500; }}
@font-face {{ font-family: InterW; src: url(file://{FONTS}/inter-latin-700-normal.woff2); font-weight: 700; }}
body {{ font-family: InterW, sans-serif; color: #16132B; font-size: 10.5pt; line-height: 1.5; }}
h1 {{ font-family: Jakarta; font-size: 26pt; letter-spacing: -.02em; margin: 2mm 0 3mm; line-height: 1.1; }}
h2 {{ font-family: Jakarta; font-size: 16pt; margin: 4mm 0 2mm; }}
h3 {{ font-family: Jakarta; font-size: 11pt; margin: 4mm 0 1.5mm; color: #16132B; }}
.k {{ color: #6D4AE8; font-weight: 700; font-size: 9pt; letter-spacing: .12em; text-transform: uppercase; }}
.box {{ border: 1px solid #E4DBFF; border-radius: 3mm; padding: 4mm 5mm; margin: 3mm 0; background: #FBFAFF; page-break-inside: avoid; }}
.prompt {{ font-size: 8.4pt; line-height: 1.42; white-space: pre-wrap; background: #F6F3FF; border-left: 3px solid #6D4AE8; padding: 3mm 4mm; border-radius: 1.5mm; }}
.sc {{ margin: 0 0 3mm; page-break-inside: avoid; }}
.sc .h {{ font-weight: 700; color: #6D4AE8; font-size: 9.5pt; }}
.sp {{ font-weight: 700; display: inline-block; width: 22mm; }}
.ln {{ font-size: 11pt; }}
.clip {{ page-break-before: always; }}
.small {{ color: #6B7085; font-size: 9pt; }}
ul {{ margin: 1mm 0; padding-left: 5mm; }}'''
script = ''
for i, c in enumerate(CLIPS):
    if i in acts: script += f'<h3>{E(acts[i][4:])}</h3>'
    script += (f'<div class="sc"><div class="h">{i+1:02d} · {E(c[0])} <span class="small">({E(LOCNAME[c[1]])})</span></div>' + ''.join(
        f'<div class="ln"><span class="sp">{sp.capitalize()}</span>“{E(ln)}”</div>' for sp, ln, _ in c[4]) + '</div>')
cast = ''.join(f'<li><b>{k.capitalize()}</b>, {E(ROLE[k])}. ElevenLabs voice: {E(ELEVEN[k])}.</li>' for k in ORDER)
parts = [f'''<div class="k">Tooth Referral · Script 20 · Google Flow</div>
<h1>Did They Ever Send It?</h1>
<p>{E(SUMMARY)}</p>
<div class="box"><b>The idea</b><ul>
<li><b>A different problem from Buried in Emails:</b> the referral loop that never closes. Sarah is about to get her crown at Gentle Dental, and the specialist's signed completion note never arrived.</li>
<li><b>Three characters, two offices:</b> Greg at the general dentist's office calls Tanya at the specialist's office; the note was signed Friday, but nobody is sure whether it went by email or fax. Nobody is blamed: "Every office sends things a different way."</li>
<li><b>Amanda and Tanya introduce Tooth Referral by name:</b> one case for every referral, both offices on it; messages, X-rays, insurance and the signed note on the case. They invite Greg's office.</li>
<li><b>One month later:</b> Greg finds the signed note already on the case and copies it into the electronic health record; Tanya's phone stays quiet; X-rays and the secure insurance link live in the same place; setup took five minutes.</li>
<li><b>Continuous clips:</b> every prompt starts from a named start image and the exact starting position, so each clip continues from the last frame of the one before it.</li></ul></div>
<h2>The script</h2>{script}''',
 f'''<div class="clip"><div class="k">Cast and voices</div><h2>Who is who</h2><ul>{cast}</ul>
<p class="small">Sarah and David are patients who are only mentioned, never on screen. Run each speaker's lines through one consistent ElevenLabs voice so the voice never drifts between clips.</p>
<div class="box"><b>Keeping every clip continuous</b><br>{E(START_NOTE)}</div>
<div class="k" style="margin-top:4mm">Step 1 · reference images (generate these first)</div>
<h2>1. Gentle Dental background</h2><div class="prompt">{E(BG['GD'])}</div>
<h2>2. St. Andrew's background</h2><div class="prompt">{E(BG['SA'])}</div></div>''',
 f'''<div class="clip"><h2>3. Greg avatar</h2><div class="prompt">{E(avatar('GREG'))}</div>
<h2>4. Tanya avatar</h2><div class="prompt">{E(avatar('TANYA'))}</div>
<h2>5. Amanda avatar</h2><div class="prompt">{E(avatar('AMANDA'))}</div></div>''',
 f'''<div class="clip"><h2>6. Gentle Dental cast image</h2><p class="small">Use the Gentle Dental background and the Greg avatar as references. Start image for clips 01 and 09.</p><div class="prompt">{E(CAST['GD'])}</div>
<h2>7. St. Andrew's cast image</h2><p class="small">Use the St. Andrew's background and the Tanya and Amanda avatars as references. Start image for clips 02 and 10.</p><div class="prompt">{E(CAST['SA'])}</div></div>''']
for i, c in enumerate(CLIPS, 1):
    dl = ''.join(f'<div class="ln"><span class="sp">{sp.capitalize()}</span>“{E(ln)}” <span class="small">({E(how)})</span></div>' for sp, ln, how in c[4])
    parts.append(f'''<div class="clip"><div class="k">Clip {i:02d} · {E(LOCNAME[c[1]])} · 8 seconds · start: {E(c[2])}</div><h2>{E(c[0])}</h2>
<div class="box">{dl}<div class="small" style="margin-top:2mm"><b>Edit:</b> {E(c[8])}</div></div>
<div class="k" style="margin-top:3mm">Google Flow prompt (copy all)</div><div class="prompt">{E(prompt(c))}</div></div>''')
doc = os.path.join(D, 'src', '_s20.html'); js = os.path.join(D, 'src', '_s20.cjs')
open(doc, 'w').write(f'<html><head><meta charset="utf-8"><style>{css}</style></head><body>{"".join(parts)}</body></html>')
open(js, 'w').write(f'''const {{ chromium }} = require('playwright');
(async () => {{ const b = await chromium.launch(); const p = await b.newPage(); await p.goto('file://{doc}');
await p.evaluate(() => document.fonts.ready); await p.pdf({{ path: '{PDF}', format: 'A4', printBackground: true }}); await b.close(); }})();''')
subprocess.run(['node', js], check=True)
os.remove(doc); os.remove(js)
for i, c in enumerate(CLIPS, 1):
    words = sum(len(ln.split()) for _, ln, _ in c[4])
    print(f'{i:02d} {words:2d} words  {c[0]}  [{", ".join(cast_in(c))}]')
