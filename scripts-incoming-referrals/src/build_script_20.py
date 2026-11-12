"""Script 20 "Did They Ever Send It?" -> Markdown + PDF with Google Flow prompts.

Built from Buried in Emails v2 (Vejay's foundation), but a different problem: the referral loop that never closes.
A patient comes back to her general dentist for the crown after an implant, and the specialist's signed completion
note never arrived. Both offices are shown (general dentist AND specialist), both directions of the conversation,
new avatars, two front-office backgrounds, walking and natural movement. Nobody is blamed: every office just sends
things a different way. A month later the same people work with Tooth Referral: signed note on the case, copied into
the electronic health record, messages on the case, status visible, X-rays and a secure insurance link, 5-minute setup.
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

# ---------- the two offices
SET = {
 'GD': ('Gentle Dental, the front office of a real, bright, family general dentist practice (the same room as the Gentle Dental background '
        'image): a white reception counter with a walnut top and a raised ledge, two workstations with slim monitors angled away from the '
        'camera (soft glow, no readable screen), a black desk phone, a pen cup, a few manila patient folders and a small tooth model. Behind '
        'the counter is a soft powder-blue accent wall with a blank brushed-metal sign shape. A glass entry door with morning daylight on the '
        'left, a light-grey sofa, a small kids\' corner with a low bookshelf and a few picture books, a potted olive tree. Behind the counter a '
        'short hallway leads to a small office with a glass window. Light oak floor, warm ceiling lights, lived-in details: sticky notes, a '
        'coffee mug, a calendar on the wall with no readable text.'),
 'SA': ('St. Andrew\'s Family Dental, the front office of a real, calm, upscale dental specialist practice (the same room as the St. Andrew\'s '
        'background image): a curved reception desk with fluted white panels and a warm wood top, two workstations with slim monitors angled '
        'away from the camera (soft glow, no readable screen), a black desk phone, a paper tray with a few printed pages, a pen cup and a '
        'small stack of folders. Behind the desk is a deep navy feature wall with a blank brushed-brass sign shape. On the right a hallway '
        'leads to treatment rooms with frosted glass doors and a glimpse of a dental chair and an overhead light. Warm greige walls, wood '
        'floors, three brass pendant lights over the desk, a large fiddle-leaf fig, a tall window with soft late-afternoon golden light.'),
}
BG = {
 'GD': ('Horizontal 16:9 photograph of the front office of a real, bright, family general dentist practice, shot from the waiting area '
        'looking at the reception counter, eye level, 35mm lens, f/2.8, a professional interiors photo. A white reception counter with a '
        'walnut top and a raised ledge; behind it two workstations, each with a slim black monitor angled away from the camera, a keyboard, '
        'a black desk phone, a pen cup, manila patient folders and a small tooth model. A soft powder-blue accent wall behind the counter with '
        'a blank brushed-metal sign shape (no letters). On the left a glass entry door with bright morning daylight. A light-grey sofa, a small '
        'kids\' corner with a low bookshelf and picture books, a potted olive tree. Behind the counter a short hallway leads to a small office '
        'with a glass window and a desk inside. Light oak floor, warm recessed lights plus daylight, true-to-life colours, lived-in details '
        '(sticky notes, a coffee mug, a wall calendar with no readable text). Real-photo texture, subtle grain. No people, no readable text, '
        'no logos, no red objects, no CGI look.'),
 'SA': ('Horizontal 16:9 photograph of the front office of a real, calm, upscale dental specialist practice, shot from the waiting area '
        'looking at the reception desk, eye level, 35mm lens, f/2.8, a professional interiors photo. A curved reception desk with fluted '
        'white panels and a warm wood top; behind it two workstations with slim black monitors angled away from the camera, keyboards, a '
        'black desk phone, a paper tray with printed pages, a pen cup and folders. A deep navy feature wall behind the desk with a blank '
        'brushed-brass sign shape (no letters). On the right a hallway to treatment rooms with frosted glass doors and a glimpse of a modern '
        'dental chair and overhead light. Warm greige walls, wood floors, three brass pendant lights over the desk, a large fiddle-leaf fig, '
        'a tall window with soft late-afternoon golden light. Real-photo texture, subtle grain. No people, no readable text, no logos, no red '
        'objects, no CGI look.'),
}
REF = {
 'GD': 'Use the Gentle Dental cast image as the reference, so the room and every person look exactly the same in every Gentle Dental clip.',
 'SA': 'Use the St. Andrew\'s cast image as the reference, so the room and both women look exactly the same in every St. Andrew\'s clip.',
}

# ---------- people (short descriptions used inside every clip prompt)
P = {
 'GREG': 'GREG, a man in his late 20s with warm brown skin, short black curly hair, a neatly trimmed beard, ceil-blue scrubs, a black smartwatch and a small blank white name badge,',
 'BARBARA': 'BARBARA, a woman in her early 50s with a silver-blonde chin-length bob, reading glasses pushed up on her head, a soft blue blouse under a navy cardigan and a small blank white name badge on a lanyard,',
 'SARAH': 'SARAH, a patient in her late 50s with short grey hair, a cream knit sweater, a camel coat over her arm and a brown handbag,',
 'DAVID': 'DAVID, a patient in his mid-40s with light stubble, short brown hair, a navy quarter-zip pullover and car keys in his hand,',
 'TANYA': 'TANYA, a woman in her late 20s with long dark curly hair in a high ponytail, lavender scrubs, small gold hoop earrings and a small blank white name badge,',
 'AMANDA': 'AMANDA, a woman in her early 40s with straight black hair in a neat low bun, black-framed glasses, an olive-green scrub top over a white long-sleeve undershirt and a small blank white name badge,',
}
VOICE = {
 'GREG': 'a friendly, easy late-20s male voice with a natural neutral American accent',
 'BARBARA': 'a warm, steady early-50s female voice with a natural neutral American accent',
 'SARAH': 'a pleasant late-50s female voice with a natural neutral American accent',
 'DAVID': 'a relaxed mid-40s male voice with a natural neutral American accent',
 'TANYA': 'a bright, quick late-20s female voice with a natural neutral American accent',
 'AMANDA': 'a calm, warm early-40s female voice with a natural neutral American accent',
}
AV = {  # avatar portraits
 'GREG': ('GREG, a dental front-desk coordinator in his late 20s, standing behind a white reception counter with a walnut top, one hand on '
          'the counter. Warm brown skin, short black curly hair, a neatly trimmed beard, warm dark-brown eyes, a black smartwatch. He wears '
          'ceil-blue scrubs and a small blank white name badge (no text). Friendly, upbeat, a natural open smile.', 'GD'),
 'BARBARA': ('BARBARA, a dental office manager in her early 50s, sitting at a desk in a small office with a glass window, a few folders and '
             'a desk phone beside her. Silver-blonde chin-length bob, reading glasses pushed up on her head, blue-grey eyes, light natural '
             'makeup, small pearl earrings. She wears a soft blue blouse under a navy cardigan and a small blank white name badge on a navy '
             'lanyard (no text). Experienced, warm, calm: a kind, slightly tired smile.', 'GD'),
 'SARAH': ('SARAH, a dental patient in her late 50s, standing at the reception counter. Short grey hair, warm green eyes, light makeup, small '
           'silver earrings. She wears a cream knit sweater, carries a camel coat over her arm and a brown leather handbag. Friendly, cheerful, '
           'relieved: a happy smile.', 'GD'),
 'DAVID': ('DAVID, a dental patient in his mid-40s, standing at the reception counter. Short brown hair, light stubble, hazel eyes. He wears a '
           'navy quarter-zip pullover over a white T-shirt and holds car keys in one hand. Relaxed and polite: an easy smile.', 'GD'),
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
        'man from the Greg avatar: late 20s, short black curly hair, trimmed beard, ceil-blue scrubs) sits behind the counter at the left '
        'workstation, looking up with a welcoming smile. SARAH (the woman from the Sarah avatar: late 50s, short grey hair, cream sweater, '
        'camel coat over her arm, brown handbag) has just come in through the glass door and walks toward the counter, mid-stride. In the '
        'background, through the glass window of the small office at the end of the hallway, BARBARA (the woman from the Barbara avatar: '
        'silver-blonde bob, glasses on her head, blue blouse, navy cardigan) works at her desk, softly out of focus. Natural, candid. No '
        'readable text, no logos, no red objects, no extra people, no warped hands.'),
 'SA': ('Horizontal 16:9 photograph, the same St. Andrew\'s front office as the background image, shot from the waiting area looking at '
        'the curved reception desk, eye level, 35mm lens, late-afternoon golden light plus brass pendant lights, real-photo texture, subtle '
        'grain. AMANDA (the woman from the Amanda avatar: early 40s, black hair in a low bun, black-framed glasses, olive-green scrub top) '
        'sits at the right workstation typing. TANYA (the woman from the Tanya avatar: late 20s, dark curly high ponytail, lavender scrubs, '
        'gold hoops) walks out of the treatment-room hallway toward the desk holding a manila folder, mid-stride, glancing at the desk phone. '
        'Natural, candid. No readable text, no logos, no red objects, no extra people, no warped hands.'),
}
NEG = ('No music, no subtitles, no captions, no on-screen text, no readable screens, no logos, no red clothing or props, no extra people, '
       'no warped hands or fingers, no lip-sync drift, no sudden objects appearing in hands.')

# (title, location, [(speaker, line, delivery)], action, camera, sounds, edit note)
CLIPS = [
 # ---------------- Act 1: the problem, at the general dentist's office
 ('Crown day', 'GD',
  [('GREG', 'Hi Sarah! Crown day.', 'warm, upbeat'),
   ('SARAH', 'Finally! The specialist said my implant healed perfectly.', 'happy, chatty')],
  '{SARAH} pushes the glass entry door open, steps in and walks across the waiting area to the counter (0 to 3 seconds), resting her coat and handbag on the ledge. Behind the counter {GREG} looks up from his monitor, smiles and greets her, then she answers, beaming.',
  'medium-wide shot from the side of the waiting area, eye level, the counter in the middle of frame; the camera pans gently with Sarah as she walks in, then settles on a two-shot across the counter.',
  'the door opening and closing, footsteps on the wood floor',
  'Full frame. Small lower-third: "Gentle Dental · general dentist".'),
 ('Not here yet', 'GD',
  [('GREG', "That's great. I just... don't see anything from them yet. One second, okay?", 'friendly, covering a small worry')],
  '{GREG} types and scrolls with the mouse, glancing at the monitor; his smile fades slightly as he looks for something. He looks back up at Sarah with an easy, reassuring smile, raises one finger on "one second", pushes his chair back and stands up. {SARAH} nods and smiles, unbothered.',
  'medium close-up on Greg from across the counter, Sarah\'s shoulder soft in the right foreground, eye level, static; Greg rises out of the frame at the end.',
  'keyboard typing, a mouse click, a chair rolling back',
  'Amber pop-up beside the monitor: "Completion note: not received".'),
 ('Twice last week', 'GD',
  [('GREG', "Barbara, did St. Andrew's ever send Sarah's completion note?", 'quiet, quick'),
   ('BARBARA', 'I emailed them twice last week.', 'tired, a little frustrated')],
  '{GREG} walks down the short hallway behind the counter toward the small office with the glass window (0 to 3 seconds), knocks lightly on the open door frame and leans in. Inside, {BARBARA} looks up from a stack of folders, pulls her reading glasses down off her head, and sighs.',
  'handheld follow shot behind Greg as he walks down the hallway, smooth and steady, ending in a medium shot through the doorway with Barbara at her desk and Greg in the left foreground.',
  'footsteps, a light knock on the door frame',
  'Two sent emails stack up beside Barbara, both "No reply".'),
 ('On hold', 'GD',
  [('BARBARA', 'On hold. Of course.', 'dry, half-smiling'),
   ('GREG', "She's in the chair in ten minutes.", 'gentle, a little anxious'),
   ('BARBARA', 'I know, I know.', 'calm, patient')],
  '{BARBARA} picks up her desk phone, dials, holds it to her ear and covers the mouthpiece with her hand, rolling her eyes kindly. {GREG} leans on the door frame, glances back down the hallway toward the waiting area, then back at her. Barbara taps a pen on the desk while she waits.',
  'medium two-shot inside the small office, eye level, very slow push-in toward Barbara.',
  'faint hold music from the phone earpiece, a pen tapping',
  'Small amber timer chip: "On hold".'),
 # ---------------- Act 1b: the same problem, at the specialist's office
 ('The other side', 'SA',
  [('TANYA', "St. Andrew's Family Dental, this is Tanya... Sarah Collins? Sure, one moment.", 'bright, a little out of breath')],
  'The desk phone rings. {TANYA} walks quickly out of the treatment-room hallway holding a manila folder (0 to 3 seconds), sets the folder down on the desk, picks up the phone, and answers while still standing. {AMANDA} keeps typing at the other workstation and glances over.',
  'medium-wide shot from the waiting area, eye level, the camera pans gently with Tanya as she walks from the hallway to the desk, then holds.',
  'a desk phone ringing, quick footsteps, a folder set down on the desk',
  'Lower-third: "St. Andrew\'s Family Dental · specialist". Split line connects the two offices.'),
 ('Email or fax?', 'SA',
  [('TANYA', "Gentle Dental needs Sarah Collins' completion note.", 'quiet, phone against her shoulder'),
   ('AMANDA', 'It was signed Friday. Did it go out by email or fax?', 'thinking, calm'),
   ('TANYA', "I'll find it.", 'determined, a small sigh')],
  '{TANYA} presses the phone against her shoulder to mute it and turns to {AMANDA}. Amanda pushes her glasses up, thinks for a second, and asks. Tanya shrugs, sits down and starts flipping through the printed pages in the paper tray, then looks at her monitor.',
  'medium two-shot across the desk, eye level, static.',
  'papers being flipped',
  'Where did it go? The note splits into an email, a fax page and a sticky note, scattered.'),
 ('Every office is different', 'GD',
  [('BARBARA', "It's nobody's fault. Every office sends things a different way...", 'calm, fair, honest'),
   ('GREG', '...and the patient waits.', 'quiet, matter-of-fact')],
  '{BARBARA} hangs up the phone gently and leans back in her chair, taking her glasses off. {GREG}, still at the door frame, looks toward the waiting area where Sarah is sitting on the grey sofa, softly out of focus, looking at her phone.',
  'medium shot through the office doorway, eye level, slow rack focus from Barbara to Sarah waiting in the background on Greg\'s line.',
  'the phone being set down',
  'Soft amber card: "Patient waiting".'),
 # ---------------- Bridge: two characters introduce Tooth Referral
 ('Let\'s set up Tooth Referral', 'SA',
  [('AMANDA', "This keeps happening. Let's set up Tooth Referral.", 'calm, decided'),
   ('TANYA', 'Tooth Referral?', 'curious'),
   ('AMANDA', 'One case for every referral. Both offices on it.', 'clear, easy')],
  '{TANYA} hangs up the phone and lets out a long breath, sliding a faxed page into a folder. {AMANDA} gets up from her workstation, walks around behind Tanya (0 to 3 seconds), rolls a spare chair over and sits down next to her, turning Tanya\'s monitor slightly toward them both (soft glow, screen not readable). Tanya turns her chair toward Amanda, interested.',
  'medium-wide two-shot from the waiting area, eye level, the camera drifts gently with Amanda as she walks over, then holds on the two of them.',
  'the phone set down, footsteps, a chair rolling',
  'The Tooth Referral logo appears beside Amanda, then a single case card: "One case per referral · both offices".'),
 ('How it works', 'SA',
  [('AMANDA', 'Messages, X-rays, insurance, the signed note. All on the case. Gentle Dental sees it too.', 'explaining to a friend'),
   ('TANYA', "Let's invite them today.", 'smiling, energised')],
  '{AMANDA} counts the four items on her fingers, then gestures with an open palm toward the monitor on "all on the case" and points out toward the window on "Gentle Dental". {TANYA} nods along, breaks into a smile, and pulls her keyboard closer.',
  'medium close-up two-shot, eye level, very slow push-in, soft golden light on both faces.',
  'a keyboard pulled across the desk',
  'Split screen: the Tooth Referral case with messages, an X-ray, the insurance card and the signed note; then "Invite your network" sends an invite to Gentle Dental. White flash cut to: "One month later".'),
 # ---------------- Act 2: one month later, with Tooth Referral
 ('Already here', 'GD',
  [('GREG', "Your specialist already sent the signed note. You're all set for your crown.", 'relaxed, confident'),
   ('DAVID', 'That was fast.', 'pleasantly surprised')],
  '{DAVID} walks up to the counter spinning his car keys on one finger. Behind the counter {GREG} glances at his monitor, smiles and turns back to David, giving a small thumbs-up. David puts his keys in his pocket and smiles.',
  'medium two-shot across the counter from the waiting-area side, eye level, slow push-in.',
  'footsteps, keys jingling, a mouse click',
  'Split screen: the Tooth Referral case, status "Treatment completed", the signed completion note with its e-signature.'),
 ('Copied it in', 'GD',
  [('BARBARA', 'I copied it from Tooth Referral into our electronic health record this morning.', 'easy, warm'),
   ('GREG', 'And his follow-up?', 'casual'),
   ('BARBARA', 'Right on the case.', 'smiling, simple')],
  '{BARBARA} walks along behind the counter carrying a coffee mug and a folder (0 to 3 seconds), pauses behind Greg\'s chair and glances at his screen. {GREG} looks up at her over his shoulder. Barbara gives a small nod and keeps walking toward her office.',
  'medium shot from across the counter, eye level, the camera follows Barbara as she walks in from the left, holds on the two of them, then lets her walk out of frame on the right.',
  'footsteps',
  'Split screen: "Copy into your electronic health record" on the note, then a message on the case to St. Andrew\'s.'),
 ('Quiet phone', 'SA',
  [('TANYA', "Gentle Dental hasn't called once this week.", 'amused, a little surprised'),
   ('AMANDA', "They don't need to. They see the status, and they message us right on the case.", 'calm, matter-of-fact')],
  '{TANYA} walks out of the treatment-room hallway holding a folder, passes the desk phone, looks at it (it stays silent) and laughs softly, then sits down. {AMANDA} rolls her chair over next to her and points at Tanya\'s monitor with her pen.',
  'medium-wide shot from the waiting area, eye level, the camera pans with Tanya to the desk, then a slow push-in on the two of them.',
  'footsteps, a chair rolling, a soft laugh',
  'Split screen: the status timeline both offices see, and a message thread between Barbara and Tanya on the case.'),
 ('Same place', 'SA',
  [('TANYA', 'And when we need an X-ray or insurance from them?', 'curious'),
   ('AMANDA', 'Same place. Insurance is one secure link. Setup took five minutes.', 'easy, sure')],
  '{TANYA} turns to {AMANDA} with her question. Amanda taps the desk once on "same place", then leans back with her arms crossed and a small smile. Tanya nods slowly, impressed.',
  'medium close-up two-shot, eye level, static, soft golden light on both faces.',
  '',
  'Split screen: an X-ray attached on the case, then the HIPAA-secure insurance request link. Chip: "Set up in about 5 minutes".'),
 ('One conversation', 'SA',
  [('TANYA', "Feels like we're one office.", 'warm, smiling'),
   ('AMANDA', "Two offices. One conversation. That's Tooth Referral.", 'warm, simple')],
  '{TANYA} smiles and types a quick message on her keyboard. {AMANDA} stands up, picks up her folder, gives Tanya a light tap on the shoulder and walks off toward the treatment-room hallway, glancing back with a smile.',
  'medium-wide shot from the waiting area, eye level, static, Amanda walking out of frame toward the hallway at the end.',
  'keyboard typing, footsteps',
  'Split screen to both offices side by side (Greg and Barbara at Gentle Dental, Tanya at St. Andrew\'s), joined by one case. End card: "Tooth Referral. Two offices, one conversation." · toothreferral.com'),
]


# Full avatar looks (the same details as the avatar image prompts, without the portrait pose), pasted into every clip
APPEAR = {
 'GREG': ('GREG (Front Desk, Gentle Dental): a man in his late 20s with warm brown skin, short black curly hair, a neatly trimmed '
          'beard, warm dark-brown eyes and a black smartwatch. He wears ceil-blue scrubs and a small blank white name badge (no text). '
          'Friendly and upbeat, with a natural open smile.'),
 'BARBARA': ('BARBARA (Office Manager, Gentle Dental): a woman in her early 50s with a silver-blonde chin-length bob, reading glasses '
             'pushed up on her head, blue-grey eyes, light natural makeup and small pearl earrings. She wears a soft blue blouse under a '
             'navy cardigan and a small blank white name badge on a navy lanyard (no text). Experienced, warm and calm.'),
 'SARAH': ('SARAH (patient): a woman in her late 50s with short grey hair, warm green eyes, light makeup and small silver earrings. She '
           'wears a cream knit sweater and carries a camel coat over her arm and a brown leather handbag. Friendly and cheerful.'),
 'DAVID': ('DAVID (patient): a man in his mid-40s with short brown hair, light stubble and hazel eyes. He wears a navy quarter-zip '
           'pullover over a white T-shirt and holds car keys. Relaxed and polite.'),
 'TANYA': ('TANYA (Front Desk, St. Andrew\'s Family Dental): a woman in her late 20s with long dark curly hair in a high ponytail, warm '
           'brown eyes, light natural makeup and small gold hoop earrings. She wears lavender scrubs and a small blank white name badge '
           '(no text). Energetic, quick and friendly.'),
 'AMANDA': ('AMANDA (Treatment Coordinator, St. Andrew\'s Family Dental): a woman in her early 40s with straight black hair in a neat '
            'low bun, black-framed glasses, dark brown eyes, light natural makeup and small silver studs. She wears an olive-green scrub '
            'top over a white long-sleeve undershirt and a small blank white name badge (no text). Calm, organised and thoughtful.'),
}


def background(loc):
    """The background image prompt, as a scene description (camera framing and the 'no people' line removed)."""
    t = BG[loc].replace('Horizontal 16:9 photograph of the', 'The')
    t = t.split(', shot from the waiting area', 1)[0] + '.' + t.split('a professional interiors photo.', 1)[1]
    return t.replace(' No people, no readable text, no logos, no red objects, no CGI look.', '').strip()


def cast_in(c):
    _, _, lines, action, _, _, _ = c
    speakers = {sp for sp, _, _ in lines}
    return [k for k in ORDER if '{' + k + '}' in action or k in speakers or k.capitalize() in action]


def prompt(c):
    title, loc, lines, action, camera, sounds, _ = c
    act = action.format(**{k: k for k in P})
    who = '\n'.join(APPEAR[k] for k in cast_in(c))
    talk = ' '.join(f'{sp} speaks with {VOICE[sp]}, {how}. Perfectly lip-synced: "{ln}"' for sp, ln, how in lines)
    snd = f', {sounds}' if sounds else ''
    return (f'{REF[loc]}\n{LOOK}\nBackground (exactly as the {LOCNAME[loc]} background image): {background(loc)}\n'
            f'Characters (exactly as their avatar images):\n{who}\nAction: {act}\nCamera: {camera}\n{talk}\n'
            f'Audio: only the spoken lines{snd} and quiet office room tone. {NEG}')


LOCNAME = {'GD': 'Gentle Dental', 'SA': "St. Andrew's"}
ORDER = ['GREG', 'BARBARA', 'SARAH', 'DAVID', 'TANYA', 'AMANDA']
ROLE = {'GREG': 'Front Desk, Gentle Dental', 'BARBARA': 'Office Manager, Gentle Dental', 'SARAH': 'Patient (Sarah Collins)',
        'DAVID': 'Patient (David Ross)', 'TANYA': "Front Desk, St. Andrew's Family Dental",
        'AMANDA': "Treatment Coordinator, St. Andrew's Family Dental"}
ELEVEN = {'GREG': 'Chris', 'DAVID': 'a second premade male voice', 'BARBARA': 'a mature premade female voice', 'SARAH': 'a mature premade female voice (different from Barbara)',
          'TANYA': 'Bella', 'AMANDA': 'a calm premade female voice'}
n = len(CLIPS)
SUMMARY = (f'{n} clips × 8 s ≈ {n*8} s · horizontal 16:9 · two offices: Gentle Dental (general dentist) and St. Andrew\'s Family Dental '
           '(specialist) · professional live-action look.')

# ---------------- Markdown
md = ['# Script 20: "Did They Ever Send It?" · Google Flow prompts', '', SUMMARY, '',
      'Problem: the referral loop that never closes. A patient comes back to her general dentist for the crown, and the specialist\'s '
      'signed completion note never arrived. Both offices are doing their job; every office just sends things a different way. One month '
      'later, the same people on Tooth Referral.', '', '## The script', '']
acts = {0: '### Act 1 · Gentle Dental (general dentist), the problem', 4: "### Act 1 · St. Andrew's Family Dental (specialist), the other side",
        6: '### Act 1 · back at Gentle Dental', 7: "### Introducing Tooth Referral · St. Andrew's (Amanda and Tanya)", 9: '### Act 2 · one month later, with Tooth Referral'}
for i, c in enumerate(CLIPS):
    if i in acts: md += [acts[i], '']
    md.append(f'**{i+1:02d} · {c[0]}** ({LOCNAME[c[1]]})  ')
    for sp, ln, _ in c[2]:
        md.append(f'{sp.capitalize()}: "{ln}"  ')
    md.append('')
md += ['## Cast', '']
for k in ORDER:
    md.append(f'- **{k.capitalize()}**, {ROLE[k]}. Voice: {VOICE[k]}.')
md += ['', '## Step 1 · Reference images (generate these first, in this order)', '',
       '### 1. Gentle Dental background', '', '> ' + BG['GD'], '', "### 2. St. Andrew's background", '', '> ' + BG['SA'], '']
num = 3
for k in ORDER:
    md += [f'### {num}. {k.capitalize()} avatar', '', '> ' + avatar(k), '']; num += 1
md += [f'### {num}. Gentle Dental cast image (Greg at the counter, Sarah walking in, Barbara in her office)', '', '> ' + CAST['GD'], '',
       f"### {num+1}. St. Andrew's cast image (Amanda at the desk, Tanya walking in)", '', '> ' + CAST['SA'], '',
       'For clips 10 and 11, also add the David avatar as a reference.', '', '## Clip prompts', '']
for i, c in enumerate(CLIPS, 1):
    md += [f'### CLIP {i:02d} · {c[0]} ({LOCNAME[c[1]]})', '**Dialogue:** ' + ' · '.join(f'{sp}: "{ln}"' for sp, ln, _ in c[2]), '',
           '\n'.join('> ' + l for l in prompt(c).split('\n')), '', f'*Edit:* {c[6]}', '']
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
.prompt {{ font-size: 8.6pt; line-height: 1.45; white-space: pre-wrap; background: #F6F3FF; border-left: 3px solid #6D4AE8; padding: 3mm 4mm; border-radius: 1.5mm; }}
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
        f'<div class="ln"><span class="sp">{sp.capitalize()}</span>“{E(ln)}”</div>' for sp, ln, _ in c[2]) + '</div>')
cast = ''.join(f'<li><b>{k.capitalize()}</b>, {E(ROLE[k])}. ElevenLabs voice: {E(ELEVEN[k])}.</li>' for k in ORDER)
parts = [f'''<div class="k">Tooth Referral · Script 20 · Google Flow</div>
<h1>Did They Ever Send It?</h1>
<p>{E(SUMMARY)}</p>
<div class="box"><b>The idea</b><ul>
<li><b>A different problem from Buried in Emails:</b> the referral loop that never closes. Sarah comes back to her general dentist for the crown after her implant, and the specialist's signed completion note never arrived.</li>
<li><b>Both sides of the referral:</b> we see the general dentist's office (Greg, Barbara) waiting, and the specialist's office (Tanya, Amanda) hunting for a note that was signed on Friday. Nobody is blamed: "Every office sends things a different way."</li>
<li><b>Two characters introduce Tooth Referral by name:</b> after the call, Amanda sits down with Tanya: "Let's set up Tooth Referral." She explains it in plain words (one case per referral, both offices on it; messages, X-rays, insurance and the signed note on the case) and Tanya decides to invite Gentle Dental that day.</li>
<li><b>Same people, one month later, with Tooth Referral:</b> the signed note is already on the case, copied into the electronic health record, follow-up asked right on the case, the phone stays quiet because both offices see the status, X-rays and the secure insurance link live in the same place, and setup took five minutes.</li>
<li><b>Natural movement in every clip:</b> walking in through the door, walking down the hallway, the phone ringing, rolling chairs, a coffee walk-by. Two real-looking front offices.</li></ul></div>
<h2>The script</h2>{script}''',
 f'''<div class="clip"><div class="k">Cast and voices</div><h2>Who is who</h2><ul>{cast}</ul>
<p class="small">Run each speaker's lines through one consistent ElevenLabs voice so the voice never drifts between clips. Staff names follow the client rules (Barbara, Tanya, Amanda, Greg); no doctors appear or are named.</p>
<div class="k" style="margin-top:4mm">Step 1 · reference images (generate these first)</div>
<p>Create the backgrounds, then the six avatars, then the two cast images. Add the matching cast image as the reference (ingredient) in Google Flow for every clip in that office, so the rooms and people never change.</p>
<h2>1. Gentle Dental background</h2><div class="prompt">{E(BG['GD'])}</div></div>''',
 f'''<div class="clip"><h2>2. St. Andrew's background</h2><div class="prompt">{E(BG['SA'])}</div>
<h2>3. Greg avatar</h2><div class="prompt">{E(avatar('GREG'))}</div></div>''',
 f'''<div class="clip"><h2>4. Barbara avatar</h2><div class="prompt">{E(avatar('BARBARA'))}</div>
<h2>5. Sarah avatar (patient)</h2><div class="prompt">{E(avatar('SARAH'))}</div></div>''',
 f'''<div class="clip"><h2>6. David avatar (patient)</h2><div class="prompt">{E(avatar('DAVID'))}</div>
<h2>7. Tanya avatar</h2><div class="prompt">{E(avatar('TANYA'))}</div></div>''',
 f'''<div class="clip"><h2>8. Amanda avatar</h2><div class="prompt">{E(avatar('AMANDA'))}</div>
<h2>9. Gentle Dental cast image</h2><p class="small">Use the Gentle Dental background and the Greg, Sarah and Barbara avatars as references. Starting frame for clip 01.</p><div class="prompt">{E(CAST['GD'])}</div></div>''',
 f'''<div class="clip"><h2>10. St. Andrew's cast image</h2><p class="small">Use the St. Andrew's background and the Tanya and Amanda avatars as references. Starting frame for clip 05.</p><div class="prompt">{E(CAST['SA'])}</div>
<p class="small">For clips 10 and 11, add the David avatar as an extra reference.</p></div>''']
for i, c in enumerate(CLIPS, 1):
    dl = ''.join(f'<div class="ln"><span class="sp">{sp.capitalize()}</span>“{E(ln)}” <span class="small">({E(how)})</span></div>' for sp, ln, how in c[2])
    parts.append(f'''<div class="clip"><div class="k">Clip {i:02d} · {E(LOCNAME[c[1]])} · 8 seconds</div><h2>{E(c[0])}</h2>
<div class="box">{dl}<div class="small" style="margin-top:2mm"><b>Edit:</b> {E(c[6])}</div></div>
<div class="k" style="margin-top:3mm">Google Flow prompt (copy all)</div><div class="prompt">{E(prompt(c))}</div></div>''')
doc = os.path.join(D, 'src', '_s20.html'); js = os.path.join(D, 'src', '_s20.cjs')
open(doc, 'w').write(f'<html><head><meta charset="utf-8"><style>{css}</style></head><body>{"".join(parts)}</body></html>')
open(js, 'w').write(f'''const {{ chromium }} = require('playwright');
(async () => {{ const b = await chromium.launch(); const p = await b.newPage(); await p.goto('file://{doc}');
await p.evaluate(() => document.fonts.ready); await p.pdf({{ path: '{PDF}', format: 'A4', printBackground: true }}); await b.close(); }})();''')
subprocess.run(['node', js], check=True)
os.remove(doc); os.remove(js)
for i, c in enumerate(CLIPS, 1):
    words = sum(len(ln.split()) for _, ln, _ in c[2])
    print(f'{i:02d} {words:2d} words  {c[0]}')
