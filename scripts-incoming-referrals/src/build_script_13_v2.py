"""Script 13 v2 "Buried in Emails" (natural rewrite after Nitesh's notes) -> Markdown + PDF with Google Flow prompts.

Nitesh's notes, built in:
  - no "we lost 20 referrals" (an exaggeration); the pain is keeping up with emails, phone calls and voicemails and
    tracking each referral's status
  - patients get upset and leave when communication slips
  - staff calling out and the holidays make it worse: "we're losing steam"
  - "that's the old way"
  - Tooth Referral is the referral system that replaces the web form and pulls every message about a referral into one
    seamless workflow
  - the point: the office runs as one system instead of depending on who happens to be in that day (never blaming
    staff; the front desk is never talked down to)
Same two characters, same front desk. Amanda brings it up from her own experience, so it never sounds like a pitch."""
import html, os, subprocess
E = html.escape
D = '/home/user/awesome-opus-5-5-prompts/scripts-incoming-referrals'
MD = os.path.join(D, 'Script-13-v2-Buried-In-Emails-Natural-Google-Flow.md')
PDF = os.path.join(D, 'Script-13-v2-Buried-In-Emails-Natural-Google-Flow.pdf')
FONTS = '/home/user/awesome-opus-5-5-prompts/reel/public/fonts'

LOOK = ('Horizontal 16:9 video, 8 seconds, one continuous shot. Photorealistic live-action footage that looks professionally filmed, '
        'not AI-generated: shot on a cinema camera (Sony FX3 look) with a 35mm lens, natural window daylight plus soft practical office '
        'lights, true-to-life colours, real skin texture with pores, subtle film grain, natural imperfections, no glossy or plastic look.')
SET = ('The front office of a real, modern dental practice (the same room as the background image): a long front desk with a white '
       'quartz top and a light-oak front panel, a raised ledge, a slim monitor angled away from the camera (soft glow, no readable screen), '
       'a black multi-line desk phone, a small paper tray with a few printed pages, a pen cup, manila patient folders, a card reader and a '
       'small tooth model. Behind the desk is a sage-green feature wall with a blank brushed-metal sign shape and a framed smiling-tooth '
       'illustration. An open doorway on the right shows a treatment room with a dental chair and an overhead dental light. On the left, '
       'a window with sheer blinds and soft winter daylight, a small silver-and-white holiday garland along the window ledge, a potted fig '
       'and beige waiting chairs. Warm recessed ceiling lights. Lived-in details: a few papers and sticky notes.')
TANYA = ('TANYA, a woman in her mid-30s with dark brown hair in a low side ponytail over her left shoulder, navy short-sleeve V-neck '
         'scrubs and a small blank white name badge')
AMANDA = ('AMANDA, a woman in her early 30s with shoulder-length light-brown wavy hair worn down, a soft teal scrub top under a light '
          'grey cardigan and a small blank white name badge')
TV = 'a warm, mid-to-low mid-30s female voice with a natural neutral American accent'
AV = 'a bright, friendly early-30s female voice with a natural neutral American accent'
NEG = ('No music, no subtitles, no captions, no on-screen text, no readable screens, no logos, no red clothing or props, no extra people, '
       'no warped hands or fingers, no lip-sync drift, no sudden objects appearing in hands.')

REF = ('Use the front-office background image, the Tanya avatar image and the Amanda avatar image as references, so the room and both '
       'women look exactly the same in every clip.')
TANYA_AV = ('Horizontal 16:9 photorealistic portrait, medium shot from the waist up, eye level, 50mm lens, f/2.8, a real photo taken in a '
            'dental office, natural daylight plus warm ceiling lights, true-to-life colours, real skin texture with pores, subtle grain, no beauty '
            'filter. TANYA, a dental front-desk coordinator in her mid-30s, sitting at a reception workstation and turned slightly toward the '
            'camera. Dark brown hair pulled into a low side ponytail resting over her left shoulder, a few loose strands near her face. Warm hazel '
            'eyes, light natural makeup, small silver stud earrings, a slim silver watch. She wears navy short-sleeve V-neck scrubs and a small '
            'blank white name badge clipped on the left (no text). Calm, capable, a little tired: a soft, polite smile. Behind her, softly out of '
            'focus: the same front office as the background image (white quartz and light-oak desk, a monitor angled away with a soft glow, a desk '
            'phone, a sage-green feature wall, the doorway to a treatment room with a dental chair). Real, professional, lived-in. No readable text, '
            'no logos, no red clothing or objects, no extra people, no warped hands or fingers.')
AMANDA_AV = ('Horizontal 16:9 photorealistic portrait, medium shot from the waist up, eye level, 50mm lens, f/2.8, a real photo taken in a '
             'dental office, natural daylight plus warm ceiling lights, true-to-life colours, real skin texture with pores, subtle grain, no beauty '
             'filter. AMANDA, a dental office team member in her early 30s, standing beside the front desk holding a white coffee mug in her right '
             'hand. Shoulder-length light-brown wavy hair worn down, warm brown eyes, clear, even skin, light natural makeup, small gold '
             'hoop earrings. She wears a soft teal scrub top under an open light grey cardigan and a small blank white name badge (no text). Friendly, '
             'relaxed and easy-going: a warm, open smile. Behind her, softly out of focus: the same front office as the background image (white '
             'quartz and light-oak desk, a sage-green feature wall, the window with sheer blinds and a small silver-and-white holiday garland, beige '
             'waiting chairs). Real, professional, lived-in. No readable text, no logos, no red clothing or objects, no extra people, no warped hands '
             'or fingers.')
CAST = ('Horizontal 16:9 photograph, the same dental front office as the background image, shot from the waiting-room side looking '
        'across the front desk, eye level, 35mm lens, natural daylight plus warm ceiling lights, real-photo texture, subtle grain. TANYA (the '
        'woman from the Tanya avatar image: mid-30s, dark brown low side ponytail, navy short-sleeve V-neck scrubs, blank name badge) sits alone '
        'behind the front desk at the left workstation, facing the monitor (soft glow, screen not readable), one hand on the mouse, the other '
        'rubbing her temple, looking stressed. In the background, AMANDA (the woman from the Amanda avatar image: early 30s, shoulder-length '
        'light-brown wavy hair, teal scrub top under a light grey cardigan, blank name badge) is just stepping out of the treatment-room doorway '
        'behind the desk, holding a white coffee mug, mid-stride, glancing toward Tanya. Tanya in sharp focus, Amanda slightly softer. Natural, '
        'candid, professional. No readable text, no logos, no red objects, no extra people, no warped hands.')

# (title, [(speaker, line, delivery)], action, camera, sounds, edit note)
CLIPS = [
 ('Since lunch',
  [('AMANDA', "You've been staring at that screen since lunch. What's going on?", 'light and teasing, but caring')],
  f'The clip opens on {TANYA}, sitting alone behind the front desk at the left workstation, facing the monitor. She scrolls with the mouse, eyebrows pulled together, rubs her temple with two fingers and lets out a quiet sigh. Behind her, {AMANDA} steps out of the treatment-room doorway holding a white coffee mug, notices Tanya, and walks around the end of the desk toward her (0 to 3 seconds). She stops beside Tanya\'s chair, leans one hip against the edge of the desk, tilts her head and asks the line with a small, caring half-smile (3 to 8 seconds). Tanya keeps looking at the screen while Amanda talks.',
  'medium-wide shot from the waiting-room side, looking across the front desk at eye level, Tanya seated in the foreground of the desk and the treatment-room doorway behind her, so Amanda walks into the frame from the back; static on a tripod with a very slow, smooth push-in as Amanda arrives.',
  'soft footsteps on the floor, a mouse click', 'Full frame. No graphics yet.'),
 ('None of them match',
  [('TANYA', "I'm trying to figure out where one referral even stands. There's an email, a voicemail, a fax... and none of them match.", 'tired, a little flat, not dramatic')],
  f'{TANYA} turns her chair slightly toward Amanda. On "an email" she taps the edge of the monitor, on "a voicemail" she points at the desk phone (a small light blinking on it), on "a fax" she lifts one printed page from the paper tray and lets it drop back. {AMANDA} listens, holding her mug, and gives a slow "oh no" nod.',
  'medium close-up favouring Tanya, eye level, Amanda partly in frame on the right, static.',
  'paper rustle', 'Pop-ups appear one by one beside Tanya: an email, a voicemail, a fax page, a sticky note.'),
 ('She\'s right',
  [('TANYA', "And a patient just called, upset. She said nobody ever got back to her. Honestly? She's right.", 'quieter, guilty, honest')],
  f'{TANYA} lowers her voice, glances toward the waiting room on "a patient", then looks down at the desk and lets out a small sigh on "she\'s right". {AMANDA}\'s face softens; she sets her mug on the desk.',
  'medium two-shot across the desk, eye level, static.',
  '', 'Soft amber card: "Patient waiting for a call back".'),
 ('Losing steam',
  [('AMANDA', "Hey, it's not you. Half the team's been out, it's the holidays...", 'gentle, reassuring'),
   ('TANYA', "...and we're losing steam.", 'a tired little laugh')],
  f'{AMANDA} rests a hand on the back of Tanya\'s chair and glances toward the window with the holiday garland on "the holidays". {TANYA} leans back in her chair, lets out a tired little laugh and finishes the sentence, rubbing her eyes for a second.',
  'medium two-shot, eye level, very slow push-in.',
  '', 'Calendar chips: "2 out today", "Holiday week".'),
 ('The old way',
  [('TANYA', "Every referral lives in someone's inbox or someone's head. If they're out, it's just... gone.", 'matter-of-fact, frustrated'),
   ('AMANDA', "Yeah. That's the old way.", 'calm, knowing, a small nod')],
  f'{TANYA} taps her own temple on "someone\'s head", then opens her hand flat and lets it drop on "gone". {AMANDA} nods slowly, takes a sip from her mug, then says her line calmly while looking at Tanya.',
  'medium close-up on Tanya, Amanda in soft focus at the right edge; on Amanda\'s line a gentle rack focus to Amanda.',
  '', 'The pop-ups from clip 2 fade to grey and stack into the words "the old way".'),
 ('At my last office',
  [('AMANDA', "At my last office, we replaced the form on our website with Tooth Referral. Every referral came in as one case.", 'relaxed, remembering, conversational'),
   ('TANYA', 'One case?', 'curious')],
  f'{AMANDA} pulls a rolling chair over and sits down next to Tanya, half-smiling as she remembers, one hand making a small "one" gesture on "one case". {TANYA} turns her chair fully toward Amanda, curious.',
  'medium two-shot of both seated at the desk, eye level, static.',
  'a chair rolling on the floor', 'Split screen starts: the referral form on a practice website becomes a single Tooth Referral case.'),
 ('All in one place',
  [('AMANDA', "It puts all the communication about that referral in one place. X-rays, insurance, messages, status. Whoever opens it sees everything.", 'clear and easy, like explaining to a friend')],
  f'{AMANDA} brings both hands together as if gathering things into one pile on "in one place", then counts the four items on her fingers and gestures toward the monitor (soft glow only, screen not readable) with an open palm on "sees everything". {TANYA} follows her hand to the monitor and back, listening closely.',
  'medium close-up favouring Amanda, Tanya in the foreground at the left edge, eye level, static.',
  '', 'Split screen: the email, voicemail and fax from clip 2 fly into one Tooth Referral case, which shows the X-rays, insurance, messages and status.'),
 ('If I\'m out tomorrow',
  [('TANYA', "So if I'm out tomorrow...", 'thinking it through'),
   ('AMANDA', 'Greg opens it and knows exactly where it stands. No digging through anyone\'s email.', 'simple, confident')],
  f'{TANYA} raises her eyebrows and points a finger at herself on "if I\'m out". {AMANDA} shrugs easily, tilts her head toward the empty second workstation on "Greg", then smiles.',
  'medium two-shot, eye level, static.',
  '', 'Split screen: the activity log, every step with who did it and when.'),
 ('They call constantly',
  [('TANYA', 'And the dentist\'s office? They call us constantly.', 'half-joking, half-exhausted'),
   ('AMANDA', 'They see the status themselves. And they can message us right on the case.', 'reassuring')],
  f'The desk phone gives one short ring and its light blinks; {TANYA} glances at it and says her line with a tired smile. {AMANDA} answers calmly, tapping the desk once on "right on the case".',
  'medium two-shot, eye level, very slow push-in.',
  'one short desk-phone ring at the start', 'Split screen: messages between the two offices on the referral.'),
 ('It just ran',
  [('AMANDA', "That's what I liked. It didn't depend on who was working that day. The whole office just ran.", 'sincere, warm'),
   ('TANYA', "That's what we need.", 'quiet, decided')],
  f'{AMANDA} leans back in her chair and says it sincerely, looking at Tanya. {TANYA} nods slowly, her shoulders relaxing for the first time, and says her line with quiet determination.',
  'medium close-up two-shot, eye level, static, soft daylight on both faces.',
  '', 'Split screen: the whole team on one referral list, statuses moving.'),
 ('Team meeting',
  [('TANYA', "Okay. I'm bringing this to the team meeting.", 'energised, a small smile'),
   ('AMANDA', "Bring it. You might actually get to eat lunch.", 'playful, warm')],
  f'{TANYA} grabs a sticky note and a pen and writes something quickly, smiling. {AMANDA} stands up with her mug, gives Tanya a light pat on the shoulder, says her line with a grin and walks back toward the doorway. Tanya laughs softly.',
  'medium-wide two-shot from across the desk, eye level, static.',
  'pen on paper, a soft laugh', 'End card: "Tooth Referral. Every conversation about a referral, in one place." · toothreferral.com'),
]


def prompt(c):
    title, lines, action, camera, sounds, _ = c
    talk = ' '.join(
        f'{sp} speaks with {TV if sp == "TANYA" else AV}, {how}. Perfectly lip-synced: "{ln}"' for sp, ln, how in lines)
    who = ' and '.join(sorted({sp.lower().capitalize() for sp, _, _ in lines}))
    snd = f', {sounds}' if sounds else ''
    return f'{REF}\n{LOOK} {SET}\n{action}\nCamera: {camera}\n{talk}\nAudio: only the spoken lines{snd} and quiet office room tone. {NEG}'


BG = ('Horizontal 16:9 photograph of the front office of a real, modern, upscale dental practice, shot from the waiting-room side '
      'looking at the reception desk, eye level, 35mm lens, f/2.8, a professional interiors photo. A long front desk with a white quartz '
      'top and a warm light-oak front panel, a raised transaction ledge, and two workstations behind it. Each workstation has a slim black '
      'monitor angled away from the camera, a keyboard and mouse, a black multi-line desk phone, a pen cup, a small stack of manila patient '
      'folders, a small paper tray and a small tooth model. On the wall behind the desk is a calm sage-green feature wall with a brushed-metal '
      'sign shape (blank, no readable letters) and a framed smiling-tooth illustration. To the right, an open doorway shows a treatment room '
      'with a modern dental chair and an overhead dental light. To the left are a tall window with soft winter daylight through sheer blinds, '
      'a small silver-and-white holiday garland along the window ledge, a potted fiddle-leaf fig and a few beige waiting chairs. Warm recessed '
      'ceiling lights plus natural daylight, soft shadows, true-to-life colours. Lived-in, realistic details: a few papers, sticky notes, cables '
      'neatly tucked. Real-photo texture, subtle grain. No people, no readable text, no logos, no red objects, no CGI look.')

# ---------------- Markdown
md = ['# Script 13 v2: "Buried in Emails" (natural rewrite) · Google Flow prompts', '',
      '11 clips × 8 s ≈ 88 s · horizontal 16:9 · Tanya and Amanda at the front desk · professional live-action look.', '',
      '## The script', '']
for i, c in enumerate(CLIPS, 1):
    md.append(f'**{i:02d} · {c[0]}**  ')
    for sp, ln, _ in c[1]:
        md.append(f'{sp.capitalize()}: "{ln}"  ')
    md.append('')
md += ['## Step 1 · Reference images (generate these first, in this order)', '', '### 1. Front office background', '', '> ' + BG, '',
       '### 2. Tanya avatar', '', '> ' + TANYA_AV, '', '### 3. Amanda avatar', '', '> ' + AMANDA_AV, '',
       '### 4. Opening frame (Tanya at the desk, Amanda coming in)', '', '> ' + CAST, '', '## Clip prompts', '']
for i, c in enumerate(CLIPS, 1):
    md += [f'### CLIP {i:02d} · {c[0]}', '**Dialogue:** ' + ' · '.join(f'{sp}: "{ln}"' for sp, ln, _ in c[1]), '',
           '\n'.join('> ' + l for l in prompt(c).split('\n')), '', f'*Edit:* {c[5]}', '']
open(MD, 'w').write('\n'.join(md))

# ---------------- PDF
css = f'''@page {{ size: A4; margin: 16mm 15mm; }}
@font-face {{ font-family: Jakarta; src: url(file://{FONTS}/plus-jakarta-sans-latin-800-normal.woff2); font-weight: 800; }}
@font-face {{ font-family: InterW; src: url(file://{FONTS}/inter-latin-500-normal.woff2); font-weight: 500; }}
@font-face {{ font-family: InterW; src: url(file://{FONTS}/inter-latin-700-normal.woff2); font-weight: 700; }}
body {{ font-family: InterW, sans-serif; color: #16132B; font-size: 10.5pt; line-height: 1.5; }}
h1 {{ font-family: Jakarta; font-size: 26pt; letter-spacing: -.02em; margin: 2mm 0 3mm; line-height: 1.1; }}
h2 {{ font-family: Jakarta; font-size: 16pt; margin: 4mm 0 2mm; }}
.k {{ color: #6D4AE8; font-weight: 700; font-size: 9pt; letter-spacing: .12em; text-transform: uppercase; }}
.box {{ border: 1px solid #E4DBFF; border-radius: 3mm; padding: 4mm 5mm; margin: 3mm 0; background: #FBFAFF; page-break-inside: avoid; }}
.prompt {{ font-size: 8.6pt; line-height: 1.45; white-space: pre-wrap; background: #F6F3FF; border-left: 3px solid #6D4AE8; padding: 3mm 4mm; border-radius: 1.5mm; }}
.sc {{ margin: 0 0 3.2mm; page-break-inside: avoid; }}
.sc .h {{ font-weight: 700; color: #6D4AE8; font-size: 9.5pt; }}
.sp {{ font-weight: 700; display: inline-block; width: 22mm; }}
.ln {{ font-size: 11pt; }}
.clip {{ page-break-before: always; }}
.small {{ color: #6B7085; font-size: 9pt; }}
ul {{ margin: 1mm 0; padding-left: 5mm; }}'''
script = ''.join(f'<div class="sc"><div class="h">{i:02d} · {E(c[0])}</div>' + ''.join(
    f'<div class="ln"><span class="sp">{sp.capitalize()}</span>“{E(ln)}”</div>' for sp, ln, _ in c[1]) + '</div>' for i, c in enumerate(CLIPS, 1))
parts = [f'''<div class="k">Tooth Referral · Script 13 v2 · Google Flow</div>
<h1>Buried in Emails (natural rewrite)</h1>
<p>Tanya and Amanda at the front desk, eleven 8-second clips (about 88 seconds, horizontal 16:9). Rewritten from Nitesh's notes: the problem is keeping up with emails, phone calls and voicemails and tracking where each referral stands; patients get upset when it slips; staff out and the holidays make it worse. Amanda brings up Tooth Referral from her last office, so it comes out of the conversation instead of a pitch.</p>
<div class="box"><b>What changed from v1</b><ul>
<li>No "we lost twenty referrals". The pain is the juggling: emails, phone calls, voicemails, faxes and not knowing the status.</li>
<li>The patient who never got a call back, and the team stretched thin over the holidays ("we're losing steam").</li>
<li>"That's the old way": every referral living in someone's inbox or someone's head.</li>
<li>Tooth Referral as the system that <b>replaces the web form</b> and <b>merges all the communication about each referral in one place</b>, with the X-rays, insurance and status.</li>
<li>The close: the office runs as one system, whoever is in that day. Nobody on the team is blamed.</li>
<li>No hard sell or free-trial line in the dialogue; the call to action lives on the end card.</li></ul></div>
<h2>The script</h2>{script}''',
 f'''<div class="clip"><div class="k">Step 1 · reference images (generate these first)</div><h2>1. Front office background</h2>
<p>Create these four images before any clip, then add them as references (ingredients) in Google Flow for every clip, so the room, Tanya and Amanda never change.</p>
<div class="prompt">{E(BG)}</div>
<h2>2. Tanya avatar</h2><p class="small">Tanya: mid-30s, dark brown low side ponytail, navy short-sleeve V-neck scrubs, blank name badge. Voice: warm, mid-to-low; tired at first, then decided.</p>
<div class="prompt">{E(TANYA_AV)}</div></div>''',
 f'''<div class="clip"><div class="k">Step 1 · reference images (continued)</div><h2>3. Amanda avatar</h2><p class="small">Amanda: early 30s, shoulder-length light-brown wavy hair, teal scrub top under a light grey cardigan, blank name badge, white mug. Voice: bright and friendly; calm and easy-going.</p>
<div class="prompt">{E(AMANDA_AV)}</div>
<h2>4. Opening frame (Tanya at the desk, Amanda coming in)</h2><p class="small">Use the three images above as references when you create this one; it becomes the starting frame for clip 01.</p>
<div class="prompt">{E(CAST)}</div></div>''']
for i, c in enumerate(CLIPS, 1):
    dl = ''.join(f'<div class="ln"><span class="sp">{sp.capitalize()}</span>“{E(ln)}” <span class="small">({E(how)})</span></div>' for sp, ln, how in c[1])
    parts.append(f'''<div class="clip"><div class="k">Clip {i:02d} · 8 seconds</div><h2>{E(c[0])}</h2>
<div class="box">{dl}<div class="small" style="margin-top:2mm"><b>Edit:</b> {E(c[5])}</div></div>
<div class="k" style="margin-top:3mm">Google Flow prompt (copy all)</div><div class="prompt">{E(prompt(c))}</div></div>''')
doc = os.path.join(D, 'src', '_s13v2.html'); js = os.path.join(D, 'src', '_s13v2.cjs')
open(doc, 'w').write(f'<html><head><meta charset="utf-8"><style>{css}</style></head><body>{"".join(parts)}</body></html>')
open(js, 'w').write(f'''const {{ chromium }} = require('playwright');
(async () => {{ const b = await chromium.launch(); const p = await b.newPage(); await p.goto('file://{doc}');
await p.evaluate(() => document.fonts.ready); await p.pdf({{ path: '{PDF}', format: 'A4', printBackground: true }}); await b.close(); }})();''')
subprocess.run(['node', js], check=True)
os.remove(doc); os.remove(js)
for i, c in enumerate(CLIPS, 1):
    words = sum(len(ln.split()) for _, ln, _ in c[1])
    print(f'{i:02d} {words:2d} words  {c[0]}')
