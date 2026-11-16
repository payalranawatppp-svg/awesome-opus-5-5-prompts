"""Episode 4 "Front Row" -> avatars, backgrounds, cast images and Google Flow clip prompts (Markdown + PDF).

From the user's Episode 4 script (16 Nov 2026). Oakridge Oral Surgery is Dr. Vance's practice (user's script names it);
Gentle Dental is the referring office. Tanya, Amanda, Dr. Vance and Barbara keep their exact Episode 2 look and Greg his
Script 20 look, so the series stays continuous. Every clip page carries the dialogue, the full prompt (background, every
character's full look, emotion, action, camera, speech, no-animation/no-text) and the avatar prompts for that clip.
Dashboard screens are never generated in Flow: monitors and tablets stay angled away / unreadable and the rebuilt
ToothReferral screens go into the split screens in the edit."""
import html, os, subprocess
E = html.escape
D = '/home/user/awesome-opus-5-5-prompts/scripts-incoming-referrals'
NAME = 'Episode-4-Front-Row-Avatars-and-Google-Flow'
MD, PDF = os.path.join(D, NAME + '.md'), os.path.join(D, NAME + '.pdf')
FONTS = '/home/user/awesome-opus-5-5-prompts/reel/public/fonts'
NOANIM = ('No animation, no cartoon, CGI or illustrated look, no motion graphics, no on-screen text, no text overlays, no titles, '
          'no captions, no subtitles, no readable text anywhere.')
LOOK = ('Horizontal 16:9 video, 8 seconds, one continuous shot. Photorealistic live-action footage that looks professionally filmed, '
        'not AI-generated: shot on a cinema camera (Sony FX3 look) with a 35mm lens, natural daylight plus soft practical lights, '
        'true-to-life colours, real skin texture with pores, subtle film grain, natural imperfections, natural unhurried movement, no glossy '
        'or plastic look.')

# ---------------------------------------------------------------- locations
OAK_DESK = ('the front office of Oakridge Oral Surgery, a real, calm, upscale oral surgery practice, shot from the waiting area looking at '
            'the reception desk, eye level, 35mm lens, f/2.8, a professional interiors photo. A curved reception desk with fluted white '
            'panels and a warm wood top; behind it two workstations with slim black monitors angled away from the camera (screens not '
            'readable), keyboards, a black desk phone, a paper tray, a pen cup and folders, and a spare rolling chair. On the left '
            'workstation a small silver photo frame standing on the desk. A deep navy feature wall behind the desk with a blank '
            'brushed-brass sign shape (no letters). On the right a hallway to treatment rooms with frosted glass doors. Warm greige walls, '
            'wood floors, three brass pendant lights over the desk, a large fiddle-leaf fig, a round analog wall clock with a white face '
            'and plain black hands (no numbers or brand) on the wall beside the desk, a tall window.')
BG = {
 'OAK': ('Horizontal 16:9 photograph of ' + OAK_DESK + ' Soft morning daylight through the window. Real-photo texture, subtle grain. '
         'No people, no readable text, no logos, no red objects, no CGI look.'),
 'NIGHT': ('Horizontal 16:9 photograph of ' + OAK_DESK + ' Night: the window is dark blue-black, the pendant lights are dimmed, the '
           'room is lit mostly by a desk lamp and the glow of the monitors, the rest of the office empty and shadowy, a cold coffee mug '
           'and a small stack of printed letters on the desk. Real-photo texture, subtle grain. No people, no readable text, no logos, '
           'no red objects, no CGI look.'),
 'HALL': ('Horizontal 16:9 photograph of the treatment-room hallway of the same Oakridge Oral Surgery practice, eye level, 35mm lens, '
          'f/2.8, a professional interiors photo. A calm corridor with warm greige walls, frosted glass doors to treatment rooms on both '
          'sides, light wood floor, recessed warm lights, a small framed abstract print (no text), a hand-sanitiser station, the navy '
          'front-desk wall visible softly at the far end. Afternoon light. Real-photo texture, subtle grain. No people, no readable text, '
          'no logos, no red objects, no CGI look.'),
 'GD': ('Horizontal 16:9 photograph of the front office of a real, bright, family general dentist practice (Gentle Dental), shot from '
        'the waiting area looking at the reception counter, eye level, 35mm lens, f/2.8, a professional interiors photo. A white reception '
        'counter with a walnut top and a raised ledge; behind it two workstations, each with a slim black monitor angled away from the '
        'camera, a keyboard, a pen cup, manila patient folders and a small tooth model, and a black cordless desk phone in its charging '
        'base. A soft powder-blue accent wall behind the counter with a blank brushed-metal sign shape (no letters). On the left a glass '
        'entry door and a tall window with afternoon daylight. A light-grey sofa, a small kids\' corner with a low bookshelf, a potted '
        'olive tree. Light oak floor, warm recessed lights plus daylight. Real-photo texture, subtle grain. No people, no readable text, '
        'no logos, no red objects, no CGI look.'),
 'AUD': ('Horizontal 16:9 photograph of a small, warmly lit school auditorium for a children\'s piano recital, seen from beside the front '
         'row toward the stage, eye level, 35mm lens, f/2.0, a real event photo. A shiny black grand piano centre stage with its lid '
         'raised and a padded bench, a soft warm spotlight on it, deep navy-blue stage curtains, a few bouquets of white and yellow '
         'flowers at the edge of the stage, rows of upholstered seats in warm amber light, the front row empty and in the foreground. '
         'Real-photo texture, subtle grain. No people, no readable text, no logos, no red objects or red curtains, no CGI look.'),
}
LOCNAME = {'OAK': 'Oakridge front desk', 'NIGHT': 'Oakridge front desk at night (last spring)', 'HALL': 'Oakridge hallway',
           'GD': 'Gentle Dental front office', 'AUD': 'recital auditorium'}

# ---------------------------------------------------------------- characters
ORDER = ['TANYA', 'GREG', 'AMANDA', 'VANCE', 'BARBARA', 'LILY']
NAMEOF = {'TANYA': 'Tanya', 'GREG': 'Greg', 'AMANDA': 'Amanda', 'VANCE': 'Dr. Vance', 'BARBARA': 'Barbara', 'LILY': 'Lily'}
CAPS = {'VANCE': 'DR. VANCE'}
ROLE = {'TANYA': 'Front Desk Coordinator at Oakridge Oral Surgery; mother of Lily.',
        'GREG': 'Front Desk Coordinator at Oakridge Oral Surgery.',
        'AMANDA': 'Office Manager / Treatment Coordinator at Oakridge Oral Surgery.',
        'VANCE': 'Oral surgeon at Oakridge Oral Surgery.',
        'BARBARA': 'Front Desk Coordinator at Gentle Dental (the referring office).',
        'LILY': "Tanya's young daughter, playing her first piano solo."}
EMO = {'TANYA': 'Warm and hopeful in the morning; stressed in last spring\'s flashback; anxious at 4:17 PM; amazed as the templates fill in; genuinely relieved; proud in the front row.',
       'GREG': 'Friendly and practical; pleased and a little proud the next morning.',
       'AMANDA': 'Calm, confident coach; smiles knowingly at the end.',
       'VANCE': 'Unhurried and pleased: signing takes seconds.',
       'BARBARA': 'Pleasantly surprised the signed letter is already there.',
       'LILY': 'A little nervous, then beaming as she takes her bow.'}
VOICE = {'TANYA': 'a bright, quick late-20s female voice with a natural neutral American accent',
         'GREG': 'a friendly, easy late-20s male voice with a natural neutral American accent',
         'AMANDA': 'a calm, warm early-40s female voice with a natural neutral American accent',
         'VANCE': 'a calm, warm, low mid-50s male voice with a natural neutral American accent',
         'BARBARA': 'a warm, steady mid-50s female voice with a natural neutral American accent',
         'LILY': 'a small, sweet child\'s voice'}
ELEVEN = {'TANYA': 'Jessica', 'GREG': 'Will', 'AMANDA': 'Bella', 'VANCE': 'Eric', 'BARBARA': 'Matilda', 'LILY': '— (no lines)'}
APPEAR = {
 'TANYA': ('TANYA (Front Desk Coordinator, Oakridge Oral Surgery): a woman in her late 20s with long dark curly hair in a high ponytail, '
           'warm brown eyes, light natural makeup and small gold hoop earrings. She wears lavender scrubs and a small blank white name badge '
           '(no text). Energetic, quick and friendly.'),
 'GREG': ('GREG (Front Desk Coordinator, Oakridge Oral Surgery): a man in his late 20s with warm brown skin, short black curly hair, a '
          'neatly trimmed beard, warm dark-brown eyes and a black smartwatch. He wears ceil-blue scrubs and a small blank white name badge '
          '(no text). Friendly and upbeat, with a natural open smile.'),
 'AMANDA': ('AMANDA (Office Manager / Treatment Coordinator, Oakridge Oral Surgery): a woman in her early 40s with straight black hair in a '
            'neat low bun, black-framed glasses, dark brown eyes, light natural makeup and small silver studs. She wears an olive-green '
            'scrub top over a white long-sleeve undershirt and a small blank white name badge (no text). Calm, organised and thoughtful.'),
 'VANCE': ('DR. VANCE (oral surgeon, Oakridge Oral Surgery): a man in his mid-50s with light olive skin, short silver-grey hair, a neatly '
           'trimmed salt-and-pepper beard, kind grey-blue eyes and thin silver-rimmed glasses. He wears navy surgical scrubs under an open '
           'white clinic coat with a small blank white name badge (no text) and a steel wristwatch. Calm, assured, kind.'),
 'BARBARA': ('BARBARA (Front Desk Coordinator, Gentle Dental): a woman in her mid-50s with fair skin, a short silver bob, warm hazel eyes '
             'and reading glasses on a thin beaded chain. She wears teal scrubs with a white long-sleeve undershirt and a small blank white '
             'name badge (no text). Warm, steady and kind.'),
 'LILY': ('LILY (Tanya\'s daughter): a girl of about 8 with light-brown skin, long dark curly hair in a half-up style with a small '
          'lavender ribbon, warm brown eyes and a gap-toothed smile. She wears a navy-blue velvet recital dress with a white round collar, '
          'white tights and black patent shoes.'),
}
AV = {
 'TANYA': ('TANYA, a dental front-desk coordinator in her late 20s, standing beside the reception desk holding a manila folder. Long dark '
           'curly hair in a high ponytail, warm brown eyes, light natural makeup, small gold hoop earrings. She wears lavender scrubs and a '
           'small blank white name badge (no text). Energetic, quick, friendly: a bright smile.', 'OAK'),
 'GREG': ('GREG, a dental front-desk coordinator in his late 20s, standing behind the reception desk, one hand on the desk. Warm brown '
          'skin, short black curly hair, a neatly trimmed beard, warm dark-brown eyes, a black smartwatch. He wears ceil-blue scrubs and a '
          'small blank white name badge (no text). Friendly, upbeat, a natural open smile.', 'OAK'),
 'AMANDA': ('AMANDA, a dental office manager and treatment coordinator in her early 40s, sitting at a reception workstation turned toward '
            'the camera. Straight black hair in a neat low bun, black-framed glasses, dark brown eyes, light natural makeup, small silver '
            'studs. She wears an olive-green scrub top over a white long-sleeve undershirt and a small blank white name badge (no text). '
            'Calm, organised, thoughtful: a quiet, warm smile.', 'OAK'),
 'VANCE': ('DR. VANCE, an oral surgeon in his mid-50s, standing in a clinic hallway holding a tablet against his chest. Light olive skin, '
           'short silver-grey hair, neatly trimmed salt-and-pepper beard, kind grey-blue eyes, thin silver-rimmed glasses. He wears navy '
           'surgical scrubs under an open white clinic coat, a small blank white name badge (no text) and a steel wristwatch. Calm, '
           'assured, a kind closed-mouth smile.', 'HALL'),
 'BARBARA': ('BARBARA, a dental front-desk coordinator in her mid-50s, sitting at a reception workstation turned toward the camera. Fair '
             'skin, a short silver bob, warm hazel eyes, reading glasses on a thin beaded chain. She wears teal scrubs with a white '
             'long-sleeve undershirt and a small blank white name badge (no text). Warm, steady, kind: a friendly smile.', 'GD'),
 'LILY': ('LILY, a girl of about 8, standing beside a black grand piano on a stage. Light-brown skin, long dark curly hair in a half-up '
          'style with a small lavender ribbon, warm brown eyes, a gap-toothed smile. She wears a navy-blue velvet recital dress with a white '
          'round collar, white tights and black patent shoes. Shy but proud.', 'AUD'),
}
AV_BACK = {
 'OAK': 'Behind, softly out of focus: the same Oakridge front office as the background image (navy feature wall, fluted white desk, brass pendant lights, soft daylight).',
 'HALL': 'Behind, softly out of focus: the same Oakridge hallway as the background image (frosted glass doors, warm greige walls, recessed lights).',
 'GD': 'Behind, softly out of focus: the same Gentle Dental front office as the background image (powder-blue accent wall, white and walnut counter, glass entry door).',
 'AUD': 'Behind, softly out of focus: the same auditorium as the background image (navy curtains, warm spotlight, rows of seats).',
}
def avatar(k):
    desc, loc = AV[k]
    where = 'a children\'s recital stage' if loc == 'AUD' else 'a dental office'
    return ('Horizontal 16:9 photorealistic portrait, medium shot from the waist up (full figure for a child), eye level, 50mm lens, f/2.8, '
            f'a real photo taken in {where}, natural light plus warm practical lights, true-to-life colours, real skin texture with pores, '
            f'subtle grain, no beauty filter. {desc} {AV_BACK[loc]} Real, lived-in. No readable text, no logos, no red clothing or objects, '
            f'no extra people, no warped hands or fingers. {NOANIM}')

CAST = {
 'OAK': ('Horizontal 16:9 photograph, the same Oakridge front office as the background image, shot from the waiting area looking at the '
         'curved reception desk, eye level, 35mm lens, soft morning daylight plus brass pendant lights, real-photo texture, subtle grain. '
         'TANYA (the woman from the Tanya avatar: late 20s, dark curly high ponytail, lavender scrubs, gold hoops) sits at the left '
         'workstation, holding the small silver photo frame in both hands and smiling softly at it; the photo shows a little girl in a navy '
         'dress sitting at a black piano. AMANDA (the woman from the Amanda avatar) sits at the right workstation looking at her monitor. '
         'Nobody else in the room. Natural, candid. ' + NOANIM + ' No logos, no red objects, no extra people, no warped hands.'),
 'NIGHT': ('Horizontal 16:9 photograph, the same Oakridge front office at night as the night background image, eye level, 35mm lens, lit '
           'by the desk lamp and monitor glow, real-photo texture, subtle grain. TANYA (the woman from the Tanya avatar: late 20s, dark curly '
           'high ponytail, lavender scrubs, gold hoops) sits alone at the left workstation, leaning toward the monitor (screen not '
           'readable), typing fast, tired and tense, a cold coffee mug and a stack of printed letters beside her, her phone face-up on '
           'the desk. Nobody else in the room. ' + NOANIM + ' No logos, no red objects, no extra people, no warped hands.'),
 'HALL': ('Horizontal 16:9 photograph, the same Oakridge hallway as the background image, eye level, 35mm lens, afternoon light, '
          'real-photo texture, subtle grain. DR. VANCE (the man from the Dr. Vance avatar: mid-50s, silver-grey hair, trimmed beard, '
          'silver-rimmed glasses, navy scrubs under an open white coat) walks slowly down the hallway toward the camera, a tablet held '
          'loosely in one hand, screen facing him. Nobody else in the hallway. ' + NOANIM + ' No logos, no red objects, no extra people, '
          'no warped hands.'),
 'GD': ('Horizontal 16:9 photograph, the same Gentle Dental front office as the background image, shot from the waiting area looking at '
        'the reception counter, eye level, 35mm lens, afternoon daylight plus warm ceiling lights, real-photo texture, subtle grain. BARBARA '
        '(the woman from the Barbara avatar: mid-50s, short silver bob, reading glasses on a beaded chain, teal scrubs) sits alone behind '
        'the counter at the left workstation, facing the monitor (screen not readable), right hand on the mouse, a calm expression. Nobody '
        'else in the room. ' + NOANIM + ' No logos, no red objects, no extra people, no warped hands.'),
 'AUD': ('Horizontal 16:9 photograph, the same recital auditorium as the background image, seen from beside the front row toward the '
         'stage, eye level, 35mm lens, warm stage light, real-photo texture, subtle grain. TANYA (the woman from the Tanya avatar: late 20s, '
         'dark curly hair now loose over her shoulders, gold hoops, a camel wool coat over a cream sweater) sits in the middle of the front '
         'row, hands pressed together under her chin, eyes on the stage. On stage, LILY (the girl from the Lily avatar: about 8, navy '
         'velvet dress with a white collar, lavender ribbon) has just stood up from the piano bench beside the black grand piano. A few '
         'blurred audience members sit in the rows behind Tanya, backs of heads only, softly out of focus. ' + NOANIM + ' No logos, no red '
         'objects, no warped hands.'),
 'MORN': ('Horizontal 16:9 photograph, the same Oakridge front office as the background image, the next morning, shot from the waiting '
          'area, eye level, 35mm lens, bright morning daylight plus brass pendant lights, real-photo texture, subtle grain. GREG (the man '
          'from the Greg avatar: late 20s, warm brown skin, short black curly hair, trimmed beard, ceil-blue scrubs, black smartwatch) sits '
          'at the left workstation with one hand on the mouse; AMANDA (the woman from the Amanda avatar) stands beside him leaning in, one '
          'hand on the back of his chair; both look at his monitor (screen angled away, not readable), relaxed, coffee cups on the desk. '
          'Nobody else in the room. ' + NOANIM + ' No logos, no red objects, no extra people, no warped hands.'),
}
CASTNAME = {'OAK': 'the Oakridge morning cast image', 'NIGHT': 'the Oakridge night cast image', 'HALL': 'the hallway cast image',
            'GD': 'the Gentle Dental cast image', 'AUD': 'the auditorium cast image', 'MORN': 'the next-morning cast image'}
CASTLOC = {'OAK': 'OAK', 'NIGHT': 'NIGHT', 'HALL': 'HALL', 'GD': 'GD', 'AUD': 'AUD', 'MORN': 'OAK'}
CASTREF = {'OAK': 'Oakridge background + Tanya and Amanda avatars', 'NIGHT': 'Oakridge night background + Tanya avatar',
           'HALL': 'hallway background + Dr. Vance avatar', 'GD': 'Gentle Dental background + Barbara avatar',
           'AUD': 'auditorium background + Tanya and Lily avatars', 'MORN': 'Oakridge background + Greg and Amanda avatars'}
NEG = (NOANIM + ' No music, no readable screens (monitors and tablets angled away or blurred), no logos, no red clothing or props, no '
       'extra people, no warped hands or fingers, no lip-sync drift, no sudden objects appearing in hands, no jump cut or reset at the start.')
def LAST(n): return f'the last frame of clip {n}'

# (title, loc, start image, start position, [(speaker, line, delivery)], script direction, emotion, action, camera, sounds, edit note, vo)
# vo = (speaker, line, delivery) for voice-over clips
CLIPS = [
 ('01', 'Front row', 'OAK', CASTNAME['OAK'],
  'TANYA sits at the left workstation holding the small silver photo frame in both hands, smiling softly at it; AMANDA sits at the right workstation looking at her monitor.',
  [('TANYA', 'Front row. She made me promise. Her first solo is at 5:30 tonight.', 'soft, warm, a little emotional, half to herself')],
  'Morning at the front desk. Tanya is back and healthy, looking at a framed photo on her desk of her young daughter, Lily, sitting at a piano.',
  'Warm, hopeful, proud mother; a quiet determination on "front row".',
  'TANYA looks at the photo, smiles, tilts it slightly toward AMANDA as she says the line, then sets the frame back on the desk beside her keyboard, facing her. Amanda glances over and smiles.',
  'medium close-up on Tanya from across the desk, eye level, very slow push-in; the frame in the lower foreground.',
  'quiet morning office room tone', 'Lower third: "Oakridge Oral Surgery · Tanya, Front Desk Coordinator".', None),
 ('02', 'Last spring', 'NIGHT', CASTNAME['NIGHT'],
  'TANYA sits alone at the left workstation at night, leaning toward the monitor, typing fast, tired and tense; her phone lies face-up on the desk.',
  [], 'Flashback: Tanya stressed at her desk after dark last spring, furiously typing a Word document while her phone buzzes with missed texts from the recital.',
  'Stressed, rushed, guilty.',
  'TANYA types fast, stops, rubs her forehead, keeps typing. Her phone on the desk lights up and vibrates twice (screen not readable); she glances at it, winces, turns it face-down and goes back to typing. Her mouth stays closed.',
  'medium shot from the side of the desk, eye level, handheld and slightly unsteady, the monitor glow on her face.',
  'fast keyboard typing, a phone vibrating on the desk twice', 'Flashback look in the edit: cooler grade, soft vignette, label "Last spring".',
  ('TANYA', 'Last spring I missed the entire first half of her recital typing completion letters.', 'quiet, regretful')),
 ('03', 'Three finished cases', 'OAK', LAST('01'),
  'TANYA sits at the left workstation; the photo frame stands beside her keyboard; AMANDA sits at the right workstation, exactly as at the end of clip 01, now in later afternoon light.',
  [('GREG', 'Three finished cases just wrapped up, including Mr. Turner.', 'friendly, matter-of-fact')],
  'Cut to 4:15 PM today. Three completed patient charts land on Tanya\'s desk, including Mr. Turner\'s finished implant consult.',
  'Greg: friendly, practical. Tanya: a flicker of worry.',
  'GREG walks in from the hallway on the right carrying three closed manila patient folders, sets them down on the desk in front of TANYA and says the line. Tanya looks up at the folders, then at the photo frame.',
  'medium two-shot across the desk, eye level, static; late-afternoon golden light through the window.',
  'footsteps, folders set down on the desk', 'Chip: "4:15 PM". Insert: the top folder (blank cover).', None),
 ('04', '4:17', 'OAK', LAST('03'),
  'TANYA sits at the left workstation looking at the three folders GREG has just set down; Greg stands beside the desk; AMANDA at the right workstation, exactly as at the end of clip 03.',
  [('TANYA', "Normally this would take me past five, and I'd be stuck in traffic missing the opening song.", 'worried, a small sigh, honest')],
  'Tanya glances at the clock reading 4:17 PM. Traffic takes thirty minutes, and she has forty-three minutes to close three referrals.',
  'Anxious, racing against the clock.',
  'TANYA turns her head and looks up at the round analog wall clock (hands showing 4:17), lets out a small sigh, then looks back at the folders and says the line, tapping the top folder with two fingers. Greg grimaces sympathetically.',
  'medium close-up on Tanya, eye level, a quick rack-focus to the wall clock and back.',
  'a wall clock ticking, a small sigh', 'Clock insert 4:17; chip "43 minutes · 3 referrals".', None),
 ('05', 'Templates', 'OAK', LAST('04'),
  'TANYA sits at the left workstation with her hand on the top folder; GREG stands beside the desk; AMANDA sits at the right workstation, exactly as at the end of clip 04.',
  [('AMANDA', "Don't open Word. Use the templates we imported from Oakridge's existing letters.", 'calm, confident, a reassuring half-smile')],
  'Split-screen dashboard: Tanya opens Mr. Turner\'s case in ToothReferral and clicks Create Completion Note.',
  'Amanda: calm coach. Tanya: hopeful.',
  'AMANDA rolls her chair over next to TANYA and says the line, pointing at Tanya\'s monitor (screen angled away, not readable). Tanya nods, puts her hand on the mouse and clicks twice. Greg steps back and heads off toward the hallway.',
  'medium two-shot from across the desk, eye level, static; frame Tanya and Amanda on the left half of the picture (the right half will hold the dashboard).',
  'a chair rolling, two mouse clicks', 'SPLIT SCREEN: right half = ToothReferral case → Create Completion Note.', None),
 ('06', 'Already filled in', 'OAK', LAST('05'),
  'TANYA and AMANDA sit side by side at the left workstation, Tanya\'s hand on the mouse, exactly as at the end of clip 05.',
  [('TANYA', 'Wait, it already filled in the patient info, the tooth number, and the referring doctor at Gentle Dental?', 'surprised, amazed, a little laugh in her voice')],
  'Tanya selects her custom Word template on Oakridge Oral Surgery letterhead, and ToothReferral automatically pulls in Mr. Turner\'s demographics, procedure details, and X-rays.',
  'Amazed, delighted.',
  'TANYA clicks once, leans in toward the screen, her eyebrows rise, and she turns to AMANDA with the question. Amanda smiles and nods.',
  'close-up on Tanya\'s face lit by the monitor glow, slight angle from the side of the screen, slow push-in.',
  'a mouse click', 'SPLIT SCREEN / CLOSE-UP: template on letterhead filling in variables (patient, tooth #, referring doctor, X-rays).', None),
 ('07', 'Route to Dr. Vance', 'OAK', LAST('06'),
  'TANYA sits at the left workstation turned toward AMANDA; Amanda smiles and nods beside her, exactly as at the end of clip 06.',
  [], 'Tanya types two quick clinical sentences and clicks Route to Doctor.',
  'Focused, efficient, light.',
  'TANYA turns back to the keyboard, types two short lines quickly, then clicks the mouse once with a small decisive tap and sits back. AMANDA gives a small approving nod. Both mouths stay closed.',
  'medium close-up two-shot, eye level, static.',
  'quick typing, a mouse click, a soft notification chime', 'SPLIT SCREEN: two sentences typed → "Route to a doctor to sign".',
  ('AMANDA', 'You just add the final note and route it straight to the doctor to sign.', 'easy, confident')),
 ('08', 'Signed and sent', 'HALL', CASTNAME['HALL'],
  'DR. VANCE walks slowly down the hallway toward the camera, a tablet held loosely in one hand, screen facing him.',
  [('VANCE', "Signed and sent. That couldn't be easier.", 'pleased, unhurried, a small smile')],
  'Dr. Vance\'s tablet chimes. He reviews the letter on his tablet, taps his eSignature with his finger, and hits approve, all without walking back to his office.',
  'Unhurried, pleased.',
  'The tablet chimes. DR. VANCE stops walking, lifts the tablet, reads for a moment (screen facing him, not readable), signs on it with his index finger in one smooth stroke, taps once more, lowers the tablet and says the line with a small smile, then walks on past the camera.',
  'medium shot in the hallway, eye level, the camera drifts back slightly as he walks, then holds.',
  'a soft tablet chime, a finger tap', 'Insert: e-signature stroke + "Approved" chip.', None),
 ('09', 'Already on the case', 'OAK', LAST('07'),
  'TANYA sits back at the left workstation and AMANDA sits beside her, exactly as at the end of clip 07.',
  [('TANYA', 'So Gentle Dental already has the signed letter on the case?', 'curious, impressed')],
  'Split-screen: the signed Oakridge letter automatically attaches to Mr. Turner\'s case for both offices; Barbara at Gentle Dental sees the completed note pop up instantly.',
  'Curious, impressed.',
  'A soft chime from the computer. TANYA leans in, looks at the screen, then turns to AMANDA and asks the question. Amanda nods.',
  'medium two-shot, eye level, static; Tanya and Amanda on the left half of the frame.',
  'a soft chime', 'SPLIT SCREEN: left = this clip; right = clip 09B (Barbara) with the signed note on the case.', None),
 ('09B', 'Barbara sees it (split-screen insert)', 'GD', CASTNAME['GD'],
  'BARBARA sits alone behind the counter at the left workstation, facing the monitor, right hand on the mouse, a calm expression.',
  [], 'On the right, Barbara at Gentle Dental sees the completed note pop up instantly.',
  'Pleasantly surprised, then pleased.',
  'A soft chime. BARBARA looks at the screen, her eyebrows lift, she smiles, clicks once and nods to herself, pleased. Her mouth stays closed.',
  'medium shot from across the counter, eye level, static; Barbara on the right half of the frame.',
  'a soft notification chime, a mouse click', 'Right half of the clip 09 split screen (only 4 s needed).', None),
 ('10', 'Copy to PMS', 'OAK', LAST('09'),
  'TANYA and AMANDA sit side by side at the left workstation, Amanda nodding, exactly as at the end of clip 09.',
  [('AMANDA', 'Yes. And with one click, you copy it straight into our PMS. No scanning, no printing, and no faxing.', 'calm, clear, a little proud')],
  'Amanda points to the Copy to PMS button at the top of the completed note. Tanya clicks it, and the formatted note transfers into Oakridge\'s practice management system.',
  'Calm, a little proud.',
  'AMANDA points at the top of TANYA\'s screen with her pen while she speaks. Tanya clicks once, watches the screen, and smiles.',
  'medium close-up two-shot, eye level, static.',
  'a mouse click', 'SPLIT SCREEN: "Copy to PMS" button → note lands in the practice management system.', None),
 ('11', 'Two more', 'OAK', LAST('10'),
  'TANYA sits at the left workstation smiling at her screen; AMANDA beside her with her pen, exactly as at the end of clip 10.',
  [], 'Fast montage: Tanya knocks out the second and third completion letters in rapid succession: auto-fill, route, eSign, copy to PMS.',
  'Energised, in the flow, quietly delighted.',
  'TANYA works quickly: she picks up the second folder, glances at it, clicks, types a line, clicks; puts it aside; picks up the third folder, clicks, types, clicks; stacks both folders neatly. AMANDA watches, impressed. Mouths stay closed.',
  'medium shot from across the desk, eye level, static (sped up in the edit).',
  'quick typing, clicks, folders stacked', 'Montage at 2x with three quick dashboard inserts; counter "3/3 closed".',
  ('TANYA', 'Three referrals closed, three referring offices updated, and I still have twenty minutes to spare.', 'bright, relieved, a little amazed')),
 ('12', 'Time to park', 'OAK', 'no start image (ingredients only)',
  'The three are already seated together behind the reception desk in the middle of a relaxed conversation: TANYA sits in her chair at the left workstation, turned toward the others, beside a neat stack of three closed manila folders; AMANDA sits next to her at the right workstation, turned toward Tanya; GREG sits on the spare rolling chair at the end of the desk, angled in toward both of them, one forearm resting on the desk. Tanya\'s camel coat hangs over the back of her chair and her purse sits on the desk. All three are relaxed and smiling, as if they have been chatting for a while.',
  [('TANYA', "I'm actually going to make it, with time to park.", 'genuinely relieved, laughing softly')],
  'Tanya looks at the clock: 4:38 PM. She grabs her purse and coat, genuinely relieved as she looks at Amanda and Greg.',
  'Genuinely relieved, happy.',
  'The conversation is already under way when the clip begins: GREG finishes a small laugh, AMANDA nods along. TANYA glances up at the wall clock (hands showing 4:38), her face lights up, she turns back to AMANDA and GREG and says the line while laughing softly, still seated. Amanda and Greg smile warmly and Greg gives a small "go on" wave toward the door. In the last two seconds Tanya reaches for her purse and the coat on the back of her chair and starts to rise. Everyone stays in the same place; nobody walks in or out.',
  'medium-wide three-shot from the waiting area across the reception desk, eye level, static; all three faces clearly visible.',
  'a soft laugh, a chair creaking, a coat lifted off the chair', 'Clock insert 4:38; chip "Left on time".', None),
 ('13', 'Front row', 'AUD', CASTNAME['AUD'],
  'TANYA sits in the middle of the front row, hands pressed together under her chin; LILY has just stood up from the piano bench on stage.',
  [], 'Cut to 5:25 PM in a warmly lit auditorium. Tanya sits right in the front row, smiling proudly as Lily takes her bow at the grand piano.',
  'Proud, emotional, joyful; Lily beaming.',
  'LILY steps beside the piano and takes a small, careful bow, then looks straight at the front row and beams. TANYA claps, eyes shining, and gives her a little wave. Mouths stay closed.',
  'medium-wide shot from beside the front row toward the stage, eye level, slow push-in toward Tanya\'s face at the end.',
  'gentle applause from a small audience', 'Chip "5:25 PM". Warm grade.',
  ('TANYA', 'When the loop closes on time, everybody wins. Especially at home.', 'warm, soft, content')),
 ('14', 'Next morning', 'OAK', CASTNAME['MORN'],
  'GREG sits at the left workstation with one hand on the mouse; AMANDA stands beside him leaning in, one hand on the back of his chair; both look at his monitor.',
  [('GREG', "We didn't lose a single referral this week, and Tanya left on time every day.", 'pleased, a little proud')],
  'The next morning. Greg and Amanda are looking at the ToothReferral dashboard, reviewing how smoothly the week ran.',
  'Pleased, proud.',
  'GREG scrolls slowly, nods, and turns his head to AMANDA as he says the line. Amanda smiles.',
  'medium two-shot from across the desk, eye level, static; on the left half of the frame.',
  'mouse scroll, coffee cup set down', 'SPLIT SCREEN: referral list with every case closed.', None),
 ('15', 'From the owner\'s side', 'OAK', LAST('14'),
  'GREG sits at the left workstation turned toward AMANDA; Amanda leans beside him smiling, exactly as at the end of clip 14.',
  [('GREG', "Dr. Vance should see this from the owner's side.", 'thoughtful, a little sly')],
  'Greg clicks over toward the Analytics tab, eyeing Oakridge\'s charts and referral volume metrics.',
  'Thoughtful, curious.',
  'GREG turns back to the screen, moves the mouse and clicks once, leans in to look, then says the line glancing up at AMANDA.',
  'medium close-up on Greg, Amanda at the edge of frame, eye level, slow push-in.',
  'a mouse click', 'SPLIT SCREEN: Analytics tab (canonical analytics page only).', None),
 ('16', 'A whole other story', 'OAK', LAST('15'),
  'GREG sits at the left workstation looking up at AMANDA; Amanda leans beside him, exactly as at the end of clip 15.',
  [('AMANDA', "The numbers? That's a whole other story.", 'smiling knowingly, playful')],
  'Amanda smiles knowingly, tapping the Analytics icon on the screen as the camera pushes in.',
  'Knowing, playful.',
  'AMANDA smiles knowingly, reaches past GREG and taps the monitor with one finger (screen angled away), then says the line, looking at the camera for a split second at the end.',
  'medium close-up on Amanda, eye level, steady push-in.',
  'a finger tap on the screen', 'End card: Tooth Referral logo + "Next: the numbers".', None),
]


def background(loc):
    t = BG[loc].replace('Horizontal 16:9 photograph of ', '')
    t = t[0].upper() + t[1:]
    return t.replace(' No people, no readable text, no logos, no red objects, no CGI look.', '').replace(' No people, no readable text, no logos, no red objects or red curtains, no CGI look.', '').strip()


def cast_in(c):
    start, lines, action, vo = c[4], c[5], c[8], c[12]
    txt = start + ' ' + action
    return [k for k in ORDER if APPEAR[k].split(' (')[0] in txt or k in {sp for sp, _, _ in lines}]


def names(xs):
    return xs[0] if len(xs) == 1 else ', '.join(xs[:-1]) + ' and ' + xs[-1] if xs else ''


def secs(line):
    """Rough spoken length at a natural pace (about 2.7 words a second)."""
    return max(2.0, round(len(line.split()) / 2.7 * 2) / 2)


def speech(c):
    """The DIALOGUE / VOICE-OVER block of a clip prompt: who speaks, on camera or off, the exact words, delivery and timing."""
    lines, vo = c[5], c[12]
    others = [CAPS.get(k, k) for k in cast_in(c)]
    if lines:
        sp, ln, how = lines[0]
        quiet = [o for o in others if o != CAPS.get(sp, sp)]
        t = secs(ln); start = 1.0 if t <= 5 else 0.5
        return (f'DIALOGUE (on camera, lip-synced). Exactly one spoken line in this clip. VOICE-OVER: none.\n'
                f'Speaker: {CAPS.get(sp, sp)}, visible on screen, face toward camera enough to read the lips.\n'
                f'Voice: {VOICE[sp]}. Delivery: {how}.\n'
                f'Line (say it once, word for word, nothing added, nothing left out): "{ln}"\n'
                f'Timing: {CAPS.get(sp, sp)} starts speaking at about {start:g} s and finishes by about {start + t:g} s, '
                'then holds the expression to the end of the clip.\n'
                f'Lip sync: mouth movement matches every word exactly. '
                + (f'{names(quiet)} {"stays silent, mouth closed" if len(quiet) == 1 else "stay silent, mouths closed"} (smiles and nods only). ' if quiet else '')
                + 'No narration, no extra words, no background chatter, no music.')
    if vo:
        sp, ln, how = vo
        t = secs(ln)
        return (f'VOICE-OVER (off screen, NOT lip-synced). DIALOGUE on camera: none.\n'
                f'Narrator: {CAPS.get(sp, sp)}, heard over the picture as a voice-over, not speaking on screen.\n'
                f'Voice: {VOICE[sp]}. Delivery: {how}.\n'
                f'Line (heard once, word for word, nothing added, nothing left out): "{ln}"\n'
                f'Timing: the voice-over starts at about 1 s and finishes by about {1 + t:g} s.\n'
                f'Every mouth on screen ({names(others) or "everyone"}) stays closed for the whole clip; nobody on screen talks '
                'or moves their lips. No other voices, no background chatter, no music.')
    return ('DIALOGUE: none. VOICE-OVER: none. Nobody speaks in this clip; every mouth stays closed. '
            'Natural sound only. No background chatter, no music.')


def prompt(c):
    num, title, loc, src, start, lines, direction, emo, action, camera, sounds, _, vo = c
    who = '\n'.join(APPEAR[k] for k in cast_in(c)) or 'No characters in this shot.'
    talk = speech(c)
    snd = (f' and {sounds}' if 'room tone' in sounds else f', {sounds}') if sounds else ''
    ings = ', '.join([f'the {LOCNAME[loc]} background image'] + [f'the {NAMEOF[k]} avatar image' for k in cast_in(c)])
    opening = (f'Ingredients: {ings}. No start image. The clip opens mid-scene, as if the camera has been rolling for a while: the '
               'characters are already in place and already talking; nobody enters, sits down or settles in. '
               f'Starting position: {start}\n') if src.startswith('no start image') else (
              f'Ingredients: {ings}. Start image: {src}. Continue from the exact position in the start image: the clip begins on that frame, '
              'with the same camera angle, framing, lighting, props, and the same position, pose and expression of every character, and the '
              f'action continues naturally from there, with no jump, reset or change of outfit. Starting position: {start}\n')
    return (opening +
            f'{LOOK}\nBackground (exactly as the {LOCNAME[loc]} background image): {background(loc)}\n'
            f'Characters (exactly as their avatar images):\n{who}\nEmotion: {emo}\nAction: {action}\nCamera: {camera}\n{talk}\n'
            f'Audio: only {"the one spoken line" if lines else ("the one voice-over line" if vo else "natural sound")}{snd}{"" if "room tone" in sounds else " and quiet room tone"}. {NEG}')


BGP = {k: v + ' ' + NOANIM for k, v in BG.items()}
n = len(CLIPS)
SUMMARY = (f'{n} clips (16 story clips + one 4-second split-screen insert) × 8 s, about 2:10 · horizontal 16:9 with split-screen '
           'dashboards · six characters · professional live-action look. The ToothReferral screens are not generated in Flow: they go '
           'into the split screens in the edit (completion-note template, auto-fill, route to a doctor, e-signature, signed note on the '
           'case, Copy to PMS, analytics).')
START_NOTE = ('How to keep every clip continuous: clips 01, 02, 08, 09B, 13 and 14 start from a cast image. Every other clip starts from '
              'the last frame of the clip named in its prompt (in Google Flow, save that last frame and use it as the start frame, or use '
              '"Extend"). Add the background and avatar images as ingredients too.')
VO_NOTE = ('Clips 02, 07, 11 and 13 carry the voice-over line inside the prompt as off-screen speech (no lip sync). If Flow\'s voice '
           'drifts, re-record that line in ElevenLabs with the same voice and lay it over.')

# ---------------- Markdown
md = ['# Episode 4: Front Row · avatars and Google Flow prompts', '', SUMMARY, '', '## Cast', '']
for k in ORDER:
    md.append(f'- **{NAMEOF[k]}**: {ROLE[k]} Emotion arc: {EMO[k]} ElevenLabs voice: {ELEVEN[k]}.')
md += ['', '## Step 1 · Backgrounds', '']
num = 1
for loc in BG:
    md += [f'### {num}. {LOCNAME[loc]} background', '', '> ' + BGP[loc], '']; num += 1
md += ['## Step 2 · Avatars', '']
for k in ORDER:
    md += [f'### {num}. {NAMEOF[k]} avatar', '', '> ' + avatar(k), '']; num += 1
md += ['## Step 3 · Cast images (start frames)', '']
for key in CAST:
    md += [f'### {num}. {CASTNAME[key][4:]}', f'References: {CASTREF[key]}.', '', '> ' + CAST[key], '']; num += 1
md += [START_NOTE, '', VO_NOTE, '', '## Clip prompts', '']
for c in CLIPS:
    dl = (' · '.join(f'{NAMEOF[sp]} (on camera, lip-synced): "{ln}"' for sp, ln, _ in c[5])
          or (f'{NAMEOF[c[12][0]]} (voice-over, off screen, not lip-synced): "{c[12][1]}"' if c[12] else 'none (no dialogue, no voice-over)'))
    md += [f'### CLIP {c[0]} · {c[1]} ({LOCNAME[c[2]]}){" · V.O." if c[12] else ""} · start: {c[3]}',
           f'**Script direction:** {c[6]}  ', f'**Emotion:** {c[7]}  ', f'**Dialogue / voice-over:** {dl}  ', f'**Edit:** {c[11]}', '',
           '\n'.join('> ' + l for l in prompt(c).split('\n')), '']
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
def spoken(c):
    if c[5]: return f'{NAMEOF[c[5][0][0]]} on camera (lip-synced)'
    if c[12]: return f'{NAMEOF[c[12][0]]} voice-over (off screen)'
    return 'none'


plan_rows = ''.join(f'<tr><td>{c[0]}</td><td><b>{E(c[1])}</b><div class="small">{E(LOCNAME[c[2]])}</div></td><td>{E(spoken(c))}</td><td>{E(c[7])}</td></tr>' for c in CLIPS)
parts = [f'''<div class="k">Tooth Referral · Episode 4 · Avatars and Google Flow</div>
<h1>Front Row</h1>
<p>{E(SUMMARY)}</p>
<div class="box"><b>How to use this</b><ul>
<li>Generate the reference images first (5 backgrounds, 6 avatars, 6 cast images), then the clips in order.</li>
<li><b>Every clip page has the dialogue, the full prompt and the avatar prompts for the characters in it, together.</b> Every prompt says: no animation, no text.</li>
<li>Tanya, Amanda, Dr. Vance and Barbara look exactly as in Episode 2; Greg as in Script 20. Oakridge Oral Surgery is Dr. Vance's practice.</li>
<li>Split-screen clips (05, 06, 07, 09, 10, 11, 14, 15) keep the people on the left half; the right half is for the dashboard in the edit. Clip 09B is a short Gentle Dental insert for the clip 09 split screen.</li>
<li>{E(START_NOTE)}</li>
<li>{E(VO_NOTE)}</li></ul></div>
<h2>Cast and emotion arcs</h2><table><tr><th>Character</th><th>Role</th><th>Emotion arc</th><th>ElevenLabs</th></tr>{cast_rows}</table>
<h2>Clip plan</h2><table><tr><th>#</th><th>Clip</th><th>Who speaks</th><th>Emotion</th></tr>{plan_rows}</table>''']
num = 1
locs = list(BG)
for j in range(0, len(locs), 2):
    pg = '<div class="clip">' + ('<div class="k">Step 1 · backgrounds</div>' if j == 0 else '')
    for loc in locs[j:j + 2]:
        pg += f'<h2>{num}. {E(LOCNAME[loc])}</h2><div class="prompt">{E(BGP[loc])}</div>'; num += 1
    parts.append(pg + '</div>')
for j in range(0, len(ORDER), 2):
    pg = '<div class="clip">' + ('<div class="k">Step 2 · avatars</div>' if j == 0 else '')
    for k in ORDER[j:j + 2]:
        pg += f'<h2>{num}. {E(NAMEOF[k])} avatar</h2><p class="small">{E(ROLE[k])} Emotion arc: {E(EMO[k])}</p><div class="prompt">{E(avatar(k))}</div>'; num += 1
    parts.append(pg + '</div>')
keys = list(CAST)
for j in range(0, len(keys), 2):
    pg = '<div class="clip">' + ('<div class="k">Step 3 · cast images (start frames)</div>' if j == 0 else '')
    for key in keys[j:j + 2]:
        use = ', '.join(c[0] for c in CLIPS if c[3] == CASTNAME[key])
        pg += f'<h2>{num}. {E(CASTNAME[key][4:].capitalize())}</h2><p class="small">References: {E(CASTREF[key])}. Start image for clip {E(use)}.</p><div class="prompt">{E(CAST[key])}</div>'; num += 1
    parts.append(pg + '</div>')
for c in CLIPS:
    if c[5]:
        sp, ln, how = c[5][0]
        head = 'On-camera dialogue · lip-synced · no voice-over'
        dl = (f'<div class="ln"><span class="sp">{E(NAMEOF[sp])} (on camera):</span> “{E(ln)}”</div>'
              f'<div class="small">Delivery: {E(how)} · about {secs(ln):g} s · {E(NAMEOF[sp])} speaks on screen, everyone else keeps their mouth closed.</div>')
    elif c[12]:
        sp, ln, how = c[12]
        head = 'Voice-over · off screen · not lip-synced · no on-camera dialogue'
        dl = (f'<div class="ln"><span class="sp">{E(NAMEOF[sp])} (V.O.):</span> “{E(ln)}”</div>'
              f'<div class="small">Delivery: {E(how)} · about {secs(ln):g} s · heard over the picture; nobody on screen moves their lips. '
              'If Flow’s voice drifts, re-record in ElevenLabs with the same voice.</div>')
    else:
        head = 'No dialogue · no voice-over'
        dl = '<div class="small">Nobody speaks. Natural sound only.</div>'
    dl = f'<div class="k" style="font-size:8pt;margin-bottom:1.5mm">{head}</div>' + dl
    avs = ''.join(f'<p style="margin:2mm 0 1mm"><b>{E(NAMEOF[k])} avatar</b></p><div class="prompt">{E(avatar(k))}</div>' for k in cast_in(c))
    parts.append(f'''<div class="clip"><div class="k">Clip {c[0]} · {E(LOCNAME[c[2]])} · 8 seconds{" · V.O." if c[12] else ""} · start: {E(c[3])}</div><h2>{E(c[1])}</h2>
<div class="emo"><b>Script direction:</b> “{E(c[6])}”<br><b>Emotion:</b> {E(c[7])}</div>
<div class="k">Dialogue and voice-over</div><div class="box">{dl}<div class="small" style="margin-top:2mm"><b>Edit:</b> {E(c[11])}</div></div>
<div class="k" style="margin-top:3mm">Google Flow prompt (copy all)</div><div class="prompt">{E(prompt(c))}</div>
<div class="k" style="margin-top:4mm">Avatars in this clip (attach as ingredients)</div>{avs}</div>''')
doc = os.path.join(D, 'src', '_ep4.html'); js = os.path.join(D, 'src', '_ep4.cjs')
open(doc, 'w').write(f'<html><head><meta charset="utf-8"><style>{css}</style></head><body>{"".join(parts)}</body></html>')
open(js, 'w').write(f'''const {{ chromium }} = require('playwright');
(async () => {{ const b = await chromium.launch(); const p = await b.newPage(); await p.goto('file://{doc}');
await p.evaluate(() => document.fonts.ready); await p.pdf({{ path: '{PDF}', format: 'A4', printBackground: true }}); await b.close(); }})();''')
subprocess.run(['node', js], check=True)
os.remove(doc); os.remove(js)
for c in CLIPS:
    words = sum(len(ln.split()) for _, ln, _ in c[5]) + (len(c[12][1].split()) if c[12] else 0)
    print(f'{c[0]:>3} {words:2d}w {c[1]:28s} [{", ".join(cast_in(c))}]')
