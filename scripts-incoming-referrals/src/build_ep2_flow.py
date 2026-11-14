"""Episode 2 "No More Phone Tag" (Script 21 v2) -> avatars + Google Flow clip prompts (Markdown + PDF).

Emotions come from the stage directions in Vejay's Episode 2 draft (e.g. "gripping the armrests, visibly anxious",
"trying to smile", "sighing", "warmly", "visibly relaxes", "in disbelief", "smiling, grabbing her bag"); each clip
quotes the direction it plays. Tanya, Amanda and the two front offices keep the exact look from Script 20 so the
series stays continuous. Screens are not generated in Flow: the app screens come from the rebuilt Remotion clips.
Rules: Dr. Vance named (series exception), staff Barbara/Tanya/Amanda/Greg, no red, no "EHR", no "shared inbox"."""
import html, os, subprocess
E = html.escape
D = '/home/user/awesome-opus-5-5-prompts/scripts-incoming-referrals'
NAME = 'Episode-2-No-More-Phone-Tag-Avatars-and-Google-Flow'
MD, PDF = os.path.join(D, NAME + '.md'), os.path.join(D, NAME + '.pdf')
FONTS = '/home/user/awesome-opus-5-5-prompts/reel/public/fonts'

LOOK = ('Horizontal 16:9 video, 8 seconds, one continuous shot. Photorealistic live-action footage that looks professionally filmed, '
        'not AI-generated: shot on a cinema camera (Sony FX3 look) with a 35mm lens, natural daylight plus soft practical office lights, '
        'true-to-life colours, real skin texture with pores, subtle film grain, natural imperfections, natural unhurried movement, no glossy '
        'or plastic look.')

# ---------------------------------------------------------------- locations (GD and SA identical to Script 20)
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
        'black desk phone with a small amber message light, a paper tray with printed pages, a pen cup and folders, and a spare rolling '
        'chair. A deep navy feature wall behind the desk with a blank brushed-brass sign shape (no letters). On the right a hallway to '
        'treatment rooms with frosted glass doors. Warm greige walls, wood floors, three brass pendant lights over the desk, a large '
        'fiddle-leaf fig, a round analog wall clock with a white face and plain black hands (no numbers or brand), a tall window with soft '
        'morning light. Real-photo texture, subtle grain. No people, no readable text, no logos, no red objects, no CGI look.'),
 'OP': ('Horizontal 16:9 photograph of a real, calm, modern dental surgery treatment room (operatory) in an upscale oral surgery '
        'practice, shot from the foot of the chair at seated eye level, 35mm lens, f/2.8, a professional interiors photo. A pale-grey '
        'reclining dental chair with soft upholstery and armrests, an overhead LED dental light switched off, a slim wall-mounted monitor '
        '(dark, nothing on it), a white cabinet run with a light-wood countertop, neatly covered instrument tray, a box of gloves, a small '
        'succulent. A frosted glass door on the left, a window with sheer curtains and soft morning daylight on the right, a round analog '
        'wall clock with a white face and plain black hands (no numbers or brand). Warm greige walls, light wood floor, calm and clean, '
        'not clinical-cold. Real-photo texture, subtle grain. No people, no readable text, no logos, no red objects, no CGI look.'),
 'DV': ('Horizontal 16:9 photograph of a real oral surgeon\'s private consult office inside an upscale dental specialist practice, shot '
        'from the doorway at eye level, 35mm lens, f/2.8, a professional interiors photo. A walnut desk with one large black monitor angled '
        'away from the camera (soft glow, screen not readable), a keyboard and mouse, a closed tablet, a coffee cup, a small tooth and jaw '
        'model, a neat stack of folders. Behind the desk a navy-blue wall with framed abstract prints (no text) and a shelf of dental books '
        'with blank spines, a tall window with soft morning light and a potted plant. Warm, quiet, professional. Real-photo texture, subtle '
        'grain. No people, no readable text, no logos, no red objects, no CGI look.'),
}
LOCNAME = {'GD': 'Gentle Dental front office', 'SA': "St. Andrew's front desk", 'OP': "St. Andrew's treatment room (Op 2)", 'DV': "Dr. Vance office"}

# ---------------------------------------------------------------- characters
ORDER = ['ORTIZ', 'VANCE', 'AMANDA', 'TANYA', 'BARBARA']
NAMEOF = {'ORTIZ': 'Mrs. Ortiz', 'VANCE': 'Dr. Vance', 'AMANDA': 'Amanda', 'TANYA': 'Tanya', 'BARBARA': 'Barbara'}
ROLE = {'ORTIZ': 'Nervous patient in for an implant consult.', 'VANCE': 'Oral surgeon / specialist.',
        'AMANDA': "Office Manager / Treatment Coordinator at Dr. Vance's practice (St. Andrew's Family Dental).",
        'TANYA': "Front Desk Coordinator at Dr. Vance's practice (St. Andrew's Family Dental).",
        'BARBARA': 'Front Desk Coordinator at Gentle Dental (the referring office).'}
EMO = {'ORTIZ': 'Nervous at first ("visibly anxious", "trying to smile"), then visibly relaxed and relieved.',
       'VANCE': 'Calm, focused and quietly concerned when the X-ray is missing; warm and reassuring with the patient.',
       'AMANDA': 'Calm, organised, steady; a confident half-smile when she fixes the problem; smiling at the end.',
       'TANYA': 'Busy and friendly, then frustrated and sighing at the phone tag, then disbelief at how fast it worked.',
       'BARBARA': 'Warm, steady and helpful; replies quickly with a small smile.'}
VOICE = {
 'ORTIZ': 'a soft, slightly shaky early-60s female voice with a light Latina accent',
 'VANCE': 'a calm, warm, low mid-50s male voice with a natural neutral American accent',
 'AMANDA': 'a calm, warm early-40s female voice with a natural neutral American accent',
 'TANYA': 'a bright, quick late-20s female voice with a natural neutral American accent',
 'BARBARA': 'a warm, steady mid-50s female voice with a natural neutral American accent',
}
ELEVEN = {'ORTIZ': 'Sarah', 'VANCE': 'Eric', 'AMANDA': 'Bella', 'TANYA': 'Jessica', 'BARBARA': 'Matilda'}
APPEAR = {
 'ORTIZ': ('MRS. ORTIZ (patient): a Latina woman in her early 60s with shoulder-length dark-brown wavy hair with soft grey streaks, warm '
           'brown eyes, light natural makeup and small pearl stud earrings. She wears a soft lilac cardigan over a cream blouse and a light-'
           'blue disposable dental bib clipped at her neck. Gentle and polite.'),
 'VANCE': ('DR. VANCE (oral surgeon): a man in his mid-50s with light olive skin, short silver-grey hair, a neatly trimmed salt-and-pepper '
           'beard, kind grey-blue eyes and thin silver-rimmed glasses. He wears navy surgical scrubs under an open white clinic coat with a '
           'small blank white name badge (no text) and a steel wristwatch. Calm, assured, kind.'),
 'AMANDA': ('AMANDA (Office Manager / Treatment Coordinator, St. Andrew\'s): a woman in her early 40s with straight black hair in a neat low '
            'bun, black-framed glasses, dark brown eyes, light natural makeup and small silver studs. She wears an olive-green scrub top '
            'over a white long-sleeve undershirt and a small blank white name badge (no text). Calm, organised and thoughtful.'),
 'TANYA': ('TANYA (Front Desk Coordinator, St. Andrew\'s): a woman in her late 20s with long dark curly hair in a high ponytail, warm brown '
           'eyes, light natural makeup and small gold hoop earrings. She wears lavender scrubs and a small blank white name badge (no text). '
           'Energetic, quick and friendly.'),
 'BARBARA': ('BARBARA (Front Desk Coordinator, Gentle Dental): a woman in her mid-50s with fair skin, a short silver bob, warm hazel eyes '
             'and reading glasses on a thin beaded chain. She wears teal scrubs with a white long-sleeve undershirt and a small blank white '
             'name badge (no text). Warm, steady and kind.'),
}
AV = {
 'ORTIZ': ('MRS. ORTIZ, a dental patient in her early 60s, sitting upright in a pale-grey dental chair, both hands resting on the armrests. '
           'Latina, shoulder-length dark-brown wavy hair with soft grey streaks, warm brown eyes, light natural makeup, small pearl stud '
           'earrings. She wears a soft lilac cardigan over a cream blouse and a light-blue disposable dental bib clipped at her neck. A '
           'polite, slightly nervous smile.', 'OP'),
 'VANCE': ('DR. VANCE, an oral surgeon in his mid-50s, standing beside his walnut desk with one hand on the back of his chair. Light olive '
           'skin, short silver-grey hair, neatly trimmed salt-and-pepper beard, kind grey-blue eyes, thin silver-rimmed glasses. He wears navy '
           'surgical scrubs under an open white clinic coat, a small blank white name badge (no text) and a steel wristwatch. Calm, assured, '
           'a kind closed-mouth smile.', 'DV'),
 'AMANDA': ('AMANDA, a dental office manager and treatment coordinator in her early 40s, sitting at a reception workstation turned toward '
            'the camera. Straight black hair in a neat low bun, black-framed glasses, dark brown eyes, light natural makeup, small silver '
            'studs. She wears an olive-green scrub top over a white long-sleeve undershirt and a small blank white name badge (no text). '
            'Calm, organised, thoughtful: a quiet, warm smile.', 'SA'),
 'TANYA': ('TANYA, a dental front-desk coordinator in her late 20s, standing in the hallway beside the reception desk holding a manila '
           'folder. Long dark curly hair in a high ponytail, warm brown eyes, light natural makeup, small gold hoop earrings. She wears '
           'lavender scrubs and a small blank white name badge (no text). Energetic, quick, friendly: a bright smile.', 'SA'),
 'BARBARA': ('BARBARA, a dental front-desk coordinator in her mid-50s, sitting at a reception workstation turned toward the camera. Fair '
             'skin, a short silver bob, warm hazel eyes, reading glasses on a thin beaded chain. She wears teal scrubs with a white '
             'long-sleeve undershirt and a small blank white name badge (no text). Warm, steady, kind: a friendly smile.', 'GD'),
}
AV_BACK = {
 'GD': 'Behind, softly out of focus: the same Gentle Dental front office as the background image (powder-blue accent wall, white and walnut counter, glass entry door with morning daylight).',
 'SA': 'Behind, softly out of focus: the same St. Andrew\'s front office as the background image (navy feature wall, fluted white desk, brass pendant lights, soft morning light).',
 'OP': 'Behind, softly out of focus: the same treatment room as the background image (white cabinets with a light-wood top, window with sheer curtains, overhead dental light switched off).',
 'DV': 'Behind, softly out of focus: the same consult office as the background image (navy wall with abstract prints, bookshelf, tall window with morning light).',
}
def avatar(k):
    desc, loc = AV[k]
    return ('Horizontal 16:9 photorealistic portrait, medium shot from the waist up, eye level, 50mm lens, f/2.8, a real photo taken in a '
            'dental office, natural daylight plus warm ceiling lights, true-to-life colours, real skin texture with pores, subtle grain, no '
            f'beauty filter. {desc} {AV_BACK[loc]} Real, professional, lived-in. No readable text, no logos, no red clothing or objects, no '
            'extra people, no warped hands or fingers. No animation, no cartoon, CGI or illustrated look, no motion graphics, no on-screen text, no text overlays, no titles, no captions, no subtitles, no readable text anywhere.')

CAST = {
 'OP': ('Horizontal 16:9 photograph, the same treatment room as the Op 2 background image, shot from the foot of the dental chair, '
        'slightly to the side, seated eye level, 35mm lens, soft morning daylight, real-photo texture, subtle grain. MRS. ORTIZ (the woman '
        'from the Mrs. Ortiz avatar: early 60s, dark wavy hair with grey streaks, lilac cardigan, light-blue dental bib, pearl studs) sits '
        'reclined slightly in the dental chair, both hands gripping the armrests, knuckles tense, looking up and slightly to the left at '
        'someone off-frame, with a small forced smile. Nobody else in the frame. Natural, candid. No readable text, no logos, no red objects, '
        'no extra people, no warped hands.'),
 'DV': ('Horizontal 16:9 photograph, the same consult office as Dr. Vance\'s office background image, shot from the doorway at eye level, '
        '35mm lens, soft morning light, real-photo texture, subtle grain. DR. VANCE (the man from the Dr. Vance avatar: mid-50s, silver-grey '
        'hair, trimmed salt-and-pepper beard, silver-rimmed glasses, navy scrubs under an open white coat) sits at his walnut desk facing '
        'the large monitor (soft glow, screen not readable), right hand on the mouse, reading carefully with a neutral, focused expression. '
        'Nobody else in the room. Natural, candid. No readable text, no logos, no red objects, no extra people, no warped hands.'),
 'SA': ('Horizontal 16:9 photograph, the same St. Andrew\'s front office as the background image, shot from the waiting area looking at '
        'the curved reception desk, eye level, 35mm lens, soft morning light plus brass pendant lights, real-photo texture, subtle grain. '
        'AMANDA (the woman from the Amanda avatar: early 40s, black hair in a low bun, black-framed glasses, olive-green scrub top over a '
        'white long-sleeve undershirt) sits at the right workstation looking at her monitor. TANYA (the woman from the Tanya avatar: late '
        '20s, dark curly high ponytail, lavender scrubs, gold hoops) sits at the left workstation typing, the black desk phone beside her. '
        'Nobody else in the room. Natural, candid. No readable text, no logos, no red objects, no extra people, no warped hands.'),
 'GD': ('Horizontal 16:9 photograph, the same Gentle Dental front office as the background image, shot from the waiting area looking at '
        'the reception counter, eye level, 35mm lens, morning daylight plus warm ceiling lights, real-photo texture, subtle grain. BARBARA '
        '(the woman from the Barbara avatar: mid-50s, short silver bob, reading glasses on a beaded chain, teal scrubs) sits alone behind '
        'the counter at the left workstation, facing the monitor (soft glow, screen not readable), right hand on the mouse, a calm, '
        'pleasant expression. Nobody else in the room. Natural, candid. No readable text, no logos, no red objects, no extra people, no '
        'warped hands.'),
}
CASTNAME = {'OP': 'the Op 2 cast image', 'DV': "the Dr. Vance office cast image", 'SA': "the St. Andrew's cast image", 'GD': 'the Gentle Dental cast image'}
NEG = ('No animation, no cartoon, CGI or illustrated look, no motion graphics, no on-screen text, no text overlays, no titles, no captions, no subtitles, no readable text anywhere. No music, no readable screens, no logos, no red clothing or props, no extra people, '
       'no warped hands or fingers, no lip-sync drift, no sudden objects appearing in hands, no jump cut or reset at the start.')
def LAST(n): return f'the last frame of clip {n:02d}'
GD_EMPTY = 'the Gentle Dental background image (empty office)'

# (title, loc, start image, start position, [(speaker, line, delivery)], Vejay's direction, emotion, action, camera, sounds, edit, vo)
CLIPS = [
 ('Shaking hands', 'OP', CASTNAME['OP'],
  'MRS. ORTIZ sits reclined slightly in the dental chair, both hands gripping the armrests, looking up and slightly left at someone off-frame, with a small forced smile.',
  [('ORTIZ', 'Is it bad that my hands are shaking?', 'softly, a nervous little laugh in her voice, trying to smile')],
  'Sitting in the dental chair, gripping the armrests, visibly anxious. Looking up at the assistant, trying to smile.',
  'Visibly anxious, trying to smile through it.',
  'MRS. ORTIZ glances down at her own hands on the armrests, lifts one hand slightly so we see it tremble, gives a small embarrassed laugh, then looks back up at the person off-frame and asks the question with a brave, wobbly smile. She grips the armrest again.',
  'close-up from the side of the chair, eye level, static, with a very slow push-in on her face.',
  'a soft nervous exhale',
  'Beat 0:00–0:06 (hook). Text-behind "NERVOUS".', False),
 ('The missing X-ray', 'DV', CASTNAME['DV'],
  'DR. VANCE sits at his walnut desk facing the monitor, right hand on the mouse, reading carefully with a neutral, focused expression.',
  [], 'Reviewing his schedule in the Pre-Op Day Viewer. He clicks into Mrs. Ortiz\'s case and realizes he needs her newest panoramic X-ray.',
  'Focused, then a small, concerned frown as he spots the gap.',
  'DR. VANCE scrolls with the mouse, clicks once, leans in toward the screen and reads. He pauses, his brow tightens slightly, he takes off his glasses for a second, rubs the bridge of his nose and puts them back on, looking at the screen with quiet concern. His mouth stays closed: he does not speak.',
  'medium shot from the doorway, eye level, very slow push-in toward his face.',
  'mouse clicks', 'Beat 0:06–0:15. Cut to the Day-Prep Station screen (DayPrep-Clean, Dr. Vance, MARIA ORTIZ).', True),
 ('A quick note', 'DV', LAST(2),
  'DR. VANCE sits at his desk facing the monitor, glasses back on, a slight concerned frown, exactly as at the end of clip 02.',
  [], 'Types quickly into the Administrative Notes feature right inside the patient\'s case.',
  'Decisive and calm: a small nod, problem handed off.',
  'DR. VANCE pulls the keyboard closer and types quickly with both hands for a few seconds, presses one key firmly to send, gives a small satisfied nod and leans back, picking up his coffee cup. His mouth stays closed: he does not speak.',
  'medium close-up from slightly behind his shoulder and to the side, the monitor glow on his face (screen not readable), static.',
  'fast keyboard typing, one firm key press', 'Beat 0:15–0:22. Cut to the Administrative notes panel: Dr. Vance types "@Amanda …" and adds the note.', True),
 ('Amanda flags Tanya', 'SA', CASTNAME['SA'],
  'AMANDA sits at the right workstation looking at her monitor; TANYA sits at the left workstation typing, the black desk phone beside her.',
  [('TANYA', "Hi Barbara, it's Tanya at the specialist office. Please call me back about Mrs. Ortiz.", 'friendly but hurried, into the phone')],
  'Amanda sees the administrative note pop up on her screen and flags Tanya at the front desk. Tanya picks up the office phone and dials.',
  'Amanda: alert, purposeful. Tanya: quick and willing, a little rushed.',
  'AMANDA reads her screen, turns and taps TANYA lightly on the arm, pointing at her own monitor. Tanya nods, picks up the desk phone receiver, dials quickly with one finger, waits a beat with the receiver at her ear, then leaves the voicemail line, speaking fast.',
  'medium-wide two-shot from the waiting area, eye level, static, then a slow push-in on Tanya.',
  'a soft notification ping, desk phone keypad beeps, a distant ring tone', 'Beat 0:22–0:30. Split screen with clip 05.', False),
 ('Voicemail', 'GD', GD_EMPTY,
  'The Gentle Dental front office is empty; the black cordless phone stands in its charging base on the counter.',
  [], 'Cut to a ringing phone at Gentle Dental, going straight to voicemail.',
  'Empty and unanswered: nobody there to pick up.',
  'The black cordless phone on the counter rings (its small screen lights up, not readable) four times. Nobody comes. The light stops; the room is still. Daylight from the window, the empty chair behind the counter slowly rocks to a stop.',
  'medium shot on the counter and the phone, eye level, static, shallow focus on the phone.',
  'a cordless phone ringing four times, then silence', 'Beat 0:22–0:30, right half of the split screen. Chip: "Voicemail · 1".', True),
 ('Ten minutes later', 'OP', LAST(1),
  'MRS. ORTIZ sits in the dental chair, gripping the armrest again, looking up at someone off-frame, exactly as at the end of clip 01.',
  [], 'A digital clock on the wall ticks forward ten minutes. Mrs. Ortiz is still sitting in that chair, getting more nervous by the minute.',
  'More nervous by the minute: fidgeting, glancing at the door.',
  'MRS. ORTIZ waits alone. She smooths the dental bib, rubs her thumb over her knuckles, glances at the wall clock, then toward the frosted glass door, takes a slow breath and grips the armrest again. Her mouth stays closed: she does not speak.',
  'medium shot from the foot of the chair, eye level, static, with the wall clock soft in the background.',
  'a quiet wall clock ticking', 'Beat 0:30–0:38. Clock time-lapse insert; text-behind "10 MINUTES". Amanda V.O. over it.', True),
 ('The missed call', 'SA', LAST(4),
  'TANYA sits at the left workstation with the desk phone receiver at her ear; AMANDA sits at the right workstation, exactly as at the end of clip 04.',
  [], 'Tanya hangs up from leaving a voicemail. A new patient walks up to the front desk asking a question. While Tanya helps them, the office phone rings. Nobody can grab it, and the call drops to missed.',
  'Tanya: busy and polite, then a flash of frustration.',
  'TANYA hangs up the receiver. A patient (a man in his 40s in a grey quarter-zip, seen mostly from behind, the only extra person) walks up to the desk; Tanya turns to him with a polite smile and points down the hallway, explaining. The desk phone starts ringing beside her; she glances at it, raises one finger to the patient, reaches for it, but it stops just before her hand gets there. The small amber message light on the phone starts blinking. Nobody speaks clearly; the patient\'s words are a soft murmur.',
  'medium shot across the desk, eye level, static.',
  'footsteps, a desk phone ringing then cutting off mid-ring, a soft murmur', 'Beat 0:38–0:50. Chip: "Missed call · Gentle Dental". Amber, never red.', True),
 ('Square one', 'SA', LAST(7),
  'TANYA sits at the left workstation, her hand just short of the desk phone, the amber message light blinking; the patient has stepped away out of frame. AMANDA sits at the right workstation.',
  [('TANYA', "We called, got voicemail. They called back while I was checking someone out. We're right back at square one.", 'sighing, deflated, a little frustrated')],
  'Sighing, looking at the blinking missed-call light.',
  'Sighing, deflated, looking at the blinking light.',
  'TANYA pulls her hand back, lets out a long sigh and stares at the blinking amber light, then turns her head toward AMANDA and says the line, shoulders dropping. Amanda listens with a sympathetic look.',
  'medium close-up on Tanya, Amanda soft at the right edge, eye level, slow push-in.',
  'a long sigh', 'Beat 0:38–0:50, Tanya\'s line. Small camera shake on the cut-off ring before it.', False),
 ('Stop calling', 'SA', LAST(8),
  'TANYA sits at the left workstation looking at AMANDA, shoulders dropped; AMANDA sits at the right workstation with a sympathetic look, exactly as at the end of clip 08.',
  [('AMANDA', 'Remember what we set up? Stop calling. Move the conversation onto the case.', 'calm, confident, a reassuring half-smile')],
  'Amanda steps in beside Tanya, opening the software\'s case view for Mrs. Ortiz.',
  'Calm, confident, reassuring.',
  'AMANDA stands up, rolls the spare chair next to TANYA and sits beside her, gently moves Tanya\'s mouse and clicks, turning the monitor slightly toward them both (soft glow, screen not readable), and says the line with a half-smile. Tanya straightens up, interested.',
  'medium-wide two-shot from the waiting area, eye level, the camera drifts gently with Amanda, then holds.',
  'a chair rolling, a mouse click', 'Beat 0:50–0:58. Music lifts here. Whip to the case screen.', False),
 ('@Barbara', 'SA', LAST(9),
  'TANYA and AMANDA sit side by side at the left workstation, the monitor turned slightly toward them, exactly as at the end of clip 09.',
  [], 'Amanda types @Barbara and sends a quick message.',
  'Focused and efficient; Tanya watching, curious.',
  'AMANDA types a short message quickly, presses Enter with a small decisive tap and sits back. TANYA leans in toward the screen, curious, eyebrows raised. Both mouths stay closed: nobody speaks.',
  'medium close-up two-shot, eye level, static, monitor glow on both faces.',
  'keyboard typing, a send click', 'Beat 0:58–1:08. Cut to CaseChat-Clean (Amanda @Barbara).', True),
 ('Barbara replies', 'GD', CASTNAME['GD'],
  'BARBARA sits alone behind the counter at the left workstation, facing the monitor, right hand on the mouse, a calm, pleasant expression.',
  [], 'A subtle notification chimes on her screen. She clicks it, uses the quoted reply to respond directly to Amanda\'s message, drags the X-ray file straight into the chat box, and hits send.',
  'Warm, helpful, quick: a small smile.',
  'A soft chime. BARBARA looks up at the screen, reads, smiles, clicks, types a short reply, then drags with the mouse across the screen, clicks once more to send and nods to herself with a small satisfied smile. Her mouth stays closed: she does not speak.',
  'medium shot from across the counter, eye level, static, with a very slow push-in.',
  'a soft notification chime, mouse clicks, light typing', 'Beat 1:08–1:20. Split screen with CaseChat-Clean (Barbara\'s reply with the pano, then Amanda replies to her).', True),
 ('It\'s there', 'DV', LAST(3),
  'DR. VANCE sits leaning back at his desk holding his coffee cup, facing the monitor, exactly as at the end of clip 03.',
  [], 'Dr. Vance refreshes his Pre-Op Day Viewer: the new X-ray is right there in high resolution. He smiles and grabs his tablet.',
  'Relieved and pleased: a warm smile.',
  'DR. VANCE sets the coffee down, clicks the mouse once, leans in and looks at the screen; a warm smile spreads across his face. He picks up the tablet from the desk, stands up, tucks it under his arm and walks out of frame toward the door.',
  'medium shot from the doorway, eye level, static; he walks past the camera at the end.',
  'a mouse click, a chair rolling back, footsteps', 'Beat 1:20–1:30. Cut to DayPrep-Clean: the new pano appears, "taken Nov 2026".', True),
 ('Good morning, Mrs. Ortiz', 'OP', LAST(6),
  'MRS. ORTIZ sits in the dental chair gripping the armrest, glancing at the door, exactly as at the end of clip 06.',
  [('VANCE', "Good morning, Mrs. Ortiz. I've got your latest X-ray right here, and everything looks very straightforward. Let's take a look together.", 'warmly, gently, unhurried')],
  'Dr. Vance walks into Op 2 to greet a relieved Mrs. Ortiz. Warmly, to Mrs. Ortiz. Mrs. Ortiz visibly relaxes, letting go of the armrest.',
  'Dr. Vance: warm and reassuring. Mrs. Ortiz: visible relief.',
  'The frosted glass door opens and DR. VANCE (with the tablet) walks in, pulls a stool close, sits at eye level beside her and turns the tablet toward her (screen not readable) while he says the line warmly. MRS. ORTIZ lets go of the armrest, her shoulders drop, she lets out a breath and smiles with real relief.',
  'medium two-shot from the foot of the chair, eye level, slow push-in on Mrs. Ortiz\'s face at the end.',
  'a door opening, a stool rolling, a relieved exhale', 'Beat 1:20–1:30. Hold on her face for a beat; music swells gently.', False),
 ('Thirty seconds', 'SA', LAST(10),
  'TANYA and AMANDA sit side by side at the left workstation, Tanya leaning in toward the screen, exactly as at the end of clip 10.',
  [('TANYA', 'That took thirty seconds. Why are we still calling each other?', 'in disbelief, a surprised laugh')],
  'Tanya looks at the screen in disbelief at how fast that resolved.',
  'Disbelief, then amused delight.',
  'TANYA stares at the screen, sits back, looks at AMANDA in disbelief and laughs, gesturing at the desk phone on "calling each other". Amanda smiles and stands up.',
  'medium close-up on Tanya, Amanda at the right edge, eye level, static.',
  'a surprised laugh', 'Beat 1:30–1:40. Text-behind "30 SECONDS".', False),
 ('Greg\'s on his own', 'SA', LAST(14),
  'TANYA sits at the left workstation laughing; AMANDA has just stood up beside her, exactly as at the end of clip 14.',
  [('AMANDA', "We aren't anymore. Good thing, because tomorrow's the real test. You're out, and Greg's on his own.", 'smiling, light, a teasing tone on the last line')],
  'Smiling, grabbing her bag to leave for the day.',
  'Smiling, light, teasing on the cliffhanger.',
  'AMANDA picks up her handbag from the desk, slings it over her shoulder and says the line with a smile, raising an eyebrow on "Greg\'s on his own". TANYA\'s laugh fades into a wide-eyed, mock-worried look. Amanda walks off toward the hallway.',
  'medium-wide shot from the waiting area, eye level, static, Amanda walking out of frame at the end.',
  'a bag picked up, footsteps', 'Beat 1:30–1:40. Beat of silence, hard cut to the end card "Stop calling. Start collaborating."', False),
]


BGP = {k: v + ' No animation, no cartoon, CGI or illustrated look, no motion graphics, no on-screen text, no text overlays, no titles, no captions, no subtitles, no readable text anywhere.' for k, v in BG.items()}
CASTP = {k: v + ' No animation, no cartoon, CGI or illustrated look, no motion graphics, no on-screen text, no text overlays, no titles, no captions, no subtitles, no readable text anywhere.' for k, v in CAST.items()}

def background(loc):
    t = BG[loc].replace('Horizontal 16:9 photograph of ', '').strip()
    t = t[0].upper() + t[1:]
    t = t.split(', shot from', 1)[0] + '.' + t.split('a professional interiors photo.', 1)[1]
    return t.replace(' No people, no readable text, no logos, no red objects, no CGI look.', '').strip()


def cast_in(c):
    start, lines, action = c[3], c[4], c[7]
    return [k for k in ORDER if APPEAR[k].split(' (')[0] in (start + ' ' + action) or k in {sp for sp, _, _ in lines}]


def prompt(c, i=None):
    title, loc, src, start, lines, direction, emo, action, camera, sounds, _, vo = c
    who = '\n'.join(APPEAR[k] for k in cast_in(c)) or 'No characters in this shot.'
    CAPS = {'ORTIZ': 'MRS. ORTIZ', 'VANCE': 'DR. VANCE'}
    talk = ' '.join(f'{CAPS.get(sp, sp)} speaks with {VOICE[sp]}, {how}. Perfectly lip-synced: "{ln}"' for sp, ln, how in lines)
    if not lines and i in SCRIPT_LINES:
        nm, ln = SCRIPT_LINES[i]; k = 'VANCE' if nm.startswith('Dr') else 'AMANDA'
        talk = (f'Voice-over (off-screen, not lip-synced): {CAPS.get(k, k)} speaks with {VOICE[k]}, {VO_HOW[i]}: "{ln}" '
                f'Every mouth on screen stays closed during the voice-over.')
    elif not lines: talk = 'Nobody speaks in this clip; mouths stay closed.'
    snd = f', {sounds}' if sounds else ''
    ings = ', '.join([f'the {LOCNAME[loc]} background image'] + [f'the {NAMEOF[k]} avatar image' for k in cast_in(c)])
    return (f'Ingredients: {ings}. Start image: {src}. Continue from the exact position in the start image: the clip begins on that frame, with the same camera '
            f'angle, framing, lighting, props, and the same position, pose and expression of every character, and the action continues '
            f'naturally from there, with no jump, reset or change of outfit. Starting position: {start}\n'
            f'{LOOK}\nBackground (exactly as the {LOCNAME[loc]} background image): {background(loc)}\n'
            f'Characters (exactly as their avatar images):\n{who}\nEmotion: {emo}\nAction: {action}\nCamera: {camera}\n{talk}\n'
            f'Audio: only {"the spoken lines" if lines else ("the voice-over" if i in SCRIPT_LINES else "natural sound")}{snd} and quiet room tone. {NEG}')


n = len(CLIPS)
SUMMARY = (f'{n} clips × 8 s (trim to about 1:40 in the edit) · horizontal 16:9 · five characters · professional live-action look. '
           'The app screens are not generated in Flow: they come from the rebuilt screen clips (Day-Prep Station, Administrative notes, '
           'Office Communication).')
START_NOTE = ('How to keep every clip continuous: clips 01, 02, 04 and 11 start from a cast image, clip 05 from the empty Gentle Dental '
              'background. Every other clip starts from the last frame of the clip named in its prompt (in Google Flow, save that last '
              'frame and use it as the start frame, or use "Extend" on that clip). Add the background and avatar images as ingredients too.')
VO_NOTE = ('Clips marked V.O. carry the voice-over line inside the prompt as off-screen speech (no lip sync). If Flow\'s voice '
           'drifts, re-record that line in ElevenLabs with the same voice and lay it over.')
VO_HOW = {2: 'calm, thoughtful, a hint of concern', 3: 'matter-of-fact, quietly confident', 6: 'calm, sympathetic, a little urgent', 10: 'easy, confident', 11: 'warm, pleased, clear'}
SCRIPT_LINES = {2: ('Dr. Vance (V.O.)', "Before every consult I go through my day here. Mrs. Ortiz's chart is ready... except her newest X-ray."),
                3: ('Dr. Vance (V.O.)', "I don't walk to the front desk or call around. One note on her case, and my team sees it."),
                6: ('Amanda (V.O.)', 'Ten minutes later, Mrs. Ortiz is still in that chair. And Tanya is stuck in phone tag.'),
                10: ('Amanda (V.O.)', 'Both offices share the case. So I just mention Barbara.'),
                11: ('Amanda (V.O.)', 'Barbara sees it right away, replies in the same thread, and drops the X-ray in. It saves to the case for both offices. No downloading, no scanning, no chasing emails.')}

# ---------------- Markdown
md = ['# Episode 2: No More Phone Tag · avatars and Google Flow prompts', '', SUMMARY, '', '## Cast', '']
for k in ORDER:
    md.append(f'- **{NAMEOF[k]}**: {ROLE[k]} Emotion arc: {EMO[k]} ElevenLabs voice: {ELEVEN[k]}.')
md += ['', '## Step 1 · Reference images (generate these first)', '']
num = 1
for loc in ['OP', 'DV', 'SA', 'GD']:
    md += [f'### {num}. {LOCNAME[loc]} background', '', '> ' + BGP[loc], '']; num += 1
for k in ORDER:
    md += [f'### {num}. {NAMEOF[k]} avatar', '', '> ' + avatar(k), '']; num += 1
for loc in ['OP', 'DV', 'SA', 'GD']:
    md += [f'### {num}. {CASTNAME[loc][4:]}', '', '> ' + CASTP[loc], '']; num += 1
md += [START_NOTE, '', VO_NOTE, '', '## Clip prompts', '']
for i, c in enumerate(CLIPS, 1):
    dl = ' · '.join(f'{NAMEOF[sp]}: "{ln}"' for sp, ln, _ in c[4]) or (f'{SCRIPT_LINES[i][0]}: "{SCRIPT_LINES[i][1]}"' if i in SCRIPT_LINES else 'none')
    md += [f'### CLIP {i:02d} · {c[0]} ({LOCNAME[c[1]]}){" · V.O." if c[11] else ""} · start: {c[2]}',
           f'**Vejay\'s direction:** {c[5]}  ', f'**Emotion:** {c[6]}  ', f'**Dialogue:** {dl}', '',
           '\n'.join('> ' + l for l in prompt(c, i).split('\n')), '']
open(MD, 'w').write('\n'.join(md))

# ---------------- PDF
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
.sp {{ font-weight: 700; }}
.ln {{ font-size: 10.5pt; }}
.clip {{ page-break-before: always; }}
.small {{ color: #6B7085; font-size: 9pt; }}
table {{ width: 100%; border-collapse: collapse; }}
td, th {{ vertical-align: top; padding: 2mm 2.4mm; border-bottom: 1px solid #ECE8FA; text-align: left; font-size: 9.3pt; }}
th {{ font-size: 8pt; letter-spacing: .1em; text-transform: uppercase; color: #6D4AE8; border-bottom: 1.5px solid #6D4AE8; }}
ul {{ margin: 1mm 0; padding-left: 5mm; }}'''
cast_rows = ''.join(f'<tr><td><b>{E(NAMEOF[k])}</b></td><td>{E(ROLE[k])}</td><td>{E(EMO[k])}</td><td>{E(ELEVEN[k])}</td></tr>' for k in ORDER)
plan_rows = ''.join(f'<tr><td>{i:02d}</td><td><b>{E(c[0])}</b>{" · V.O." if c[11] else ""}<div class="small">{E(LOCNAME[c[1]])}</div></td><td>{E(c[6])}</td></tr>' for i, c in enumerate(CLIPS, 1))
parts = [f'''<div class="k">Tooth Referral · Episode 2 · Avatars and Google Flow</div>
<h1>No More Phone Tag</h1>
<p>{E(SUMMARY)}</p>
<div class="box"><b>How to use this</b><ul>
<li>Generate the reference images first (4 backgrounds, 5 avatars, 4 cast images), then the 15 clips in order.</li>
<li><b>Every clip page has the dialogue, the full prompt and the avatar prompts for the characters in it, together.</b> Every prompt says: no animation, no text.</li>
<li><b>Emotion:</b> every clip quotes Vejay's stage direction from the Episode 2 draft and turns it into an "Emotion" line and visible acting in the prompt.</li>
<li>Tanya, Amanda and both front offices look exactly as in Script 20, so the series stays continuous.</li>
<li>{E(START_NOTE)}</li>
<li>{E(VO_NOTE)}</li></ul></div>
<h2>Cast and emotion arcs</h2><table><tr><th>Character</th><th>Role</th><th>Emotion arc</th><th>ElevenLabs</th></tr>{cast_rows}</table>
<h2>Clip plan</h2><table><tr><th>#</th><th>Clip</th><th>Emotion</th></tr>{plan_rows}</table>''']
num = 1
pg = '<div class="clip"><div class="k">Step 1 · backgrounds</div>'
for loc in ['OP', 'DV', 'SA', 'GD']:
    pg += f'<h2>{num}. {E(LOCNAME[loc])}</h2><div class="prompt">{E(BGP[loc])}</div>'; num += 1
    if loc == 'DV': parts.append(pg + '</div>'); pg = '<div class="clip">'
parts.append(pg + '</div>')
pg = '<div class="clip"><div class="k">Step 2 · avatars</div>'
for j, k in enumerate(ORDER):
    pg += f'<h2>{num}. {E(NAMEOF[k])} avatar</h2><p class="small">{E(ROLE[k])} Emotion arc: {E(EMO[k])}</p><div class="prompt">{E(avatar(k))}</div>'; num += 1
    if j in (1, 3): parts.append(pg + '</div>'); pg = '<div class="clip">'
parts.append(pg + '</div>')
use = {'OP': 'clip 01', 'DV': 'clip 02', 'SA': 'clip 04', 'GD': 'clip 11'}
refs = {'OP': 'Op 2 background + Mrs. Ortiz avatar', 'DV': "Dr. Vance's office background + Dr. Vance avatar", 'SA': "St. Andrew's background + Amanda and Tanya avatars", 'GD': 'Gentle Dental background + Barbara avatar'}
pg = '<div class="clip"><div class="k">Step 3 · cast images (start frames)</div>'
for j, loc in enumerate(['OP', 'DV', 'SA', 'GD']):
    pg += f'<h2>{num}. {E(CASTNAME[loc][4:].capitalize())}</h2><p class="small">References: {E(refs[loc])}. Start image for {use[loc]}.</p><div class="prompt">{E(CASTP[loc])}</div>'; num += 1
    if j == 1: parts.append(pg + '</div>'); pg = '<div class="clip">'
parts.append(pg + '</div>')
for i, c in enumerate(CLIPS, 1):
    dl = ''.join(f'<div class="ln"><span class="sp">{E(NAMEOF[sp])}:</span> “{E(ln)}” <span class="small">({E(how)})</span></div>' for sp, ln, how in c[4])
    if not dl and i in SCRIPT_LINES: dl = f'<div class="ln"><span class="sp">{E(SCRIPT_LINES[i][0])}:</span> “{E(SCRIPT_LINES[i][1])}” <span class="small">(voice-over, included in the prompt)</span></div>'
    if not dl: dl = '<div class="small">No dialogue (natural sound only).</div>'
    avs = ''.join(f'<p style="margin:2mm 0 1mm"><b>{E(NAMEOF[k])} avatar</b></p><div class="prompt">{E(avatar(k))}</div>' for k in cast_in(c)) or '<p class="small">No characters: use only the Gentle Dental background image.</p>'
    parts.append(f'''<div class="clip"><div class="k">Clip {i:02d} · {E(LOCNAME[c[1]])} · 8 seconds{" · V.O." if c[11] else ""} · start: {E(c[2])}</div><h2>{E(c[0])}</h2>
<div class="emo"><b>Vejay's direction:</b> “{E(c[5])}”<br><b>Emotion:</b> {E(c[6])}</div>
<div class="k">Dialogue</div><div class="box">{dl}</div>
<div class="k" style="margin-top:3mm">Google Flow prompt (copy all)</div><div class="prompt">{E(prompt(c, i))}</div>
<div class="k" style="margin-top:4mm">Avatars in this clip (attach as ingredients)</div>{avs}</div>''')
doc = os.path.join(D, 'src', '_ep2.html'); js = os.path.join(D, 'src', '_ep2.cjs')
open(doc, 'w').write(f'<html><head><meta charset="utf-8"><style>{css}</style></head><body>{"".join(parts)}</body></html>')
open(js, 'w').write(f'''const {{ chromium }} = require('playwright');
(async () => {{ const b = await chromium.launch(); const p = await b.newPage(); await p.goto('file://{doc}');
await p.evaluate(() => document.fonts.ready); await p.pdf({{ path: '{PDF}', format: 'A4', printBackground: true }}); await b.close(); }})();''')
subprocess.run(['node', js], check=True)
os.remove(doc); os.remove(js)
for i, c in enumerate(CLIPS, 1):
    words = sum(len(ln.split()) for _, ln, _ in c[4])
    print(f'{i:02d} {words:2d}w {c[0]:24s} [{", ".join(cast_in(c))}]')
