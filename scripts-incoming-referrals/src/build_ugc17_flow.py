"""UGC 17 "Five moments every specialist office knows": detailed Google Flow prompts (PDF + MD).

Source script: the user's UGC17_old_way_vs_dashboard.pdf (v5, 2026-11-26). Flow clips are only the on-camera parts
(5 office scenes + Ethan's hook and close). Ethan's five fix voice-overs play over the coded dashboard, so they are in
the script section of the PDF only, never inside a Flow prompt (user, 2026-11-25). Every clip prompt repeats the full
background and the full description of every person in the shot, and each clip page carries the avatar image
prompts for its cast.
"""
import html, os, subprocess

D = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
NAME = 'UGC17-Five-Moments-Google-Flow-Prompts'
MD, PDF = os.path.join(D, NAME + '.md'), os.path.join(D, NAME + '.pdf')

LOOK = ('Photorealistic, filmed like real behind-the-scenes footage inside a working dental office: handheld with subtle natural '
        'sway, Sony FX3 look, 35mm lens, shallow but natural depth of field, soft daylight from windows mixed with overhead office '
        'light, true-to-life skin tones and colour, light natural film grain. It must look like a real phone-free documentary moment, '
        'not AI, not a commercial, not staged.')
NEG = ('NEGATIVES: no animation, no cartoon, no CGI look, no glossy plastic skin, no on-screen text, no subtitles, no captions, no titles, '
       'no logos, no watermarks, no readable screens or readable paper, no red clothing or red props, no extra people, no background '
       'extras walking through, no warped or extra fingers, no frozen faces, no lip-sync drift, no repeated or skipped words, no jump cut, '
       'no camera cut, no music.')

# ---------------------------------------------------------------- characters (avatar image prompt + in-clip description)
CAST = {
 'Rachel': dict(
  role='Rachel Moore, treatment coordinator, Harborview Dental Group (specialist office)',
  desc=('RACHEL MOORE: woman in her early 30s, light-medium skin with a few freckles, shoulder-length dark brown hair pulled into a '
        'low ponytail with a few loose strands framing her face, natural makeup, small silver stud earrings. Navy-blue short-sleeve '
        'scrubs, white ID badge on a retractable clip at her chest pocket, a black pen in the pocket, slim silver watch on her left wrist. '
        'Warm, quick and capable, slightly tired around the eyes; expressive hands, talks with small open-palm gestures.'),
  voice='warm mid-range American female voice, early 30s, quick and natural, a little tired but friendly',
  avatar=('Photorealistic portrait reference sheet of one woman: early 30s, light-medium skin with a few freckles, shoulder-length dark '
          'brown hair in a low ponytail with loose face-framing strands, natural makeup, small silver stud earrings, navy-blue short-sleeve '
          'scrubs, white ID badge on a retractable clip at the chest pocket, black pen in the pocket, slim silver watch on the left wrist. '
          'Warm, capable, slightly tired expression with a small genuine smile. Three views side by side (front, three-quarter, profile) '
          'plus one waist-up shot, plain light-grey studio background, soft even daylight, 35mm, natural skin texture, no text, no logos.')),
 'Kevin': dict(
  role='Kevin Tran, front desk, Harborview Dental Group',
  desc=('KEVIN TRAN: man in his late 20s, East Asian, short black hair slightly tousled on top, clean-shaven, friendly open face, '
        'thin black-framed glasses. Light-blue scrub top over a white long-sleeve tee (sleeves pushed to the forearms), black smartwatch '
        'on the left wrist. Easy-going, upbeat energy, leans in when he talks, uses his hands loosely.'),
  voice='friendly light American male voice, late 20s, casual and upbeat',
  avatar=('Photorealistic portrait reference sheet of one man: late 20s, East Asian, short slightly tousled black hair, clean-shaven, '
          'thin black-framed glasses, light-blue scrub top over a white long-sleeve tee with sleeves pushed to the forearms, black '
          'smartwatch on the left wrist. Friendly, upbeat expression. Three views side by side (front, three-quarter, profile) plus one '
          'waist-up shot, plain light-grey studio background, soft even daylight, 35mm, natural skin texture, no text, no logos.')),
 'Ruiz': dict(
  role='Dr. Elena Ruiz, associate dentist, Harborview Dental Group',
  desc=('DR. ELENA RUIZ: woman in her early 40s, Latina, warm olive skin, dark brown hair in a neat low bun, minimal makeup, small gold '
        'hoop earrings. White knee-length lab coat open over teal scrubs, dental loupes pushed up on top of her head, a surgical mask '
        'hanging loose from one ear. Fast, confident, good-humoured; talks while moving, quick decisive hand gestures, laughs at herself easily.'),
  voice='confident, brisk American female voice, early 40s, warm with a touch of humour',
  avatar=('Photorealistic portrait reference sheet of one woman: early 40s, Latina, warm olive skin, dark brown hair in a neat low bun, '
          'minimal makeup, small gold hoop earrings, white knee-length lab coat open over teal scrubs, dental loupes pushed up on top of her '
          'head. Confident, friendly expression. Three views side by side (front, three-quarter, profile) plus one waist-up shot, plain '
          'light-grey studio background, soft even daylight, 35mm, natural skin texture, no text, no logos.')),
 'Whitaker': dict(
  role='Dr. James Whitaker, owner dentist, Lakeside Family Dental (referring general dentist)',
  desc=('DR. JAMES WHITAKER: man in his mid 50s, fair skin with light laugh lines, short neatly combed grey hair, rectangular '
        'tortoiseshell glasses. Light-blue button-down shirt (top button open, no tie) under a white lab coat, holds a tablet in a grey '
        'case. Kind, thoughtful, slightly puzzled; slow deliberate movements, taps the tablet edge with a finger when he thinks.'),
  voice='calm, deep American male voice, mid 50s, kind and a little puzzled',
  avatar=('Photorealistic portrait reference sheet of one man: mid 50s, fair skin with light laugh lines, short neatly combed grey hair, '
          'rectangular tortoiseshell glasses, light-blue button-down shirt with the top button open under a white lab coat, holding a '
          'tablet in a grey case. Kind, thoughtful expression. Three views side by side (front, three-quarter, profile) plus one waist-up '
          'shot, plain light-grey studio background, soft even daylight, 35mm, natural skin texture, no text, no logos.')),
 'Megan': dict(
  role='Megan Cole, office manager, Lakeside Family Dental',
  desc=('MEGAN COLE: woman in her late 30s, fair skin, shoulder-length auburn hair worn down and tucked behind one ear, reading glasses '
        'hanging on a beaded lanyard around her neck. Deep plum scrubs (plum, not red) with a grey zip fleece vest, a pen tucked behind '
        'her ear. Warm and honest; when unsure she pauses, touches her glasses and gives a small helpless shrug with open palms.'),
  voice='warm American female voice, late 30s, honest, hesitant on this line',
  avatar=('Photorealistic portrait reference sheet of one woman: late 30s, fair skin, shoulder-length auburn hair tucked behind one ear, '
          'reading glasses on a beaded lanyard, deep plum scrubs (not red) with a grey zip fleece vest, a pen tucked behind her ear. Warm, '
          'honest expression. Three views side by side (front, three-quarter, profile) plus one waist-up shot, plain light-grey studio '
          'background, soft even daylight, 35mm, natural skin texture, no text, no logos.')),
 'Ethan': dict(
  role='Ethan, the host (on camera for the hook and the close; his fix lines are voice-over on the dashboard)',
  desc=('ETHAN: man in his early 30s, light-tan skin, short dark-brown hair with a natural textured quiff, neatly trimmed short beard, '
        'friendly bright eyes. Heather-grey crew-neck sweater with the sleeves pushed up to the forearms over a white T-shirt collar, '
        'simple black watch on the left wrist. Seated at a light-oak desk. Natural creator energy: talks straight to the lens like he is '
        'telling a friend something useful, expressive eyebrows, lively but relaxed hand gestures at chest height, small head tilts and leans.'),
  voice='energetic, friendly American male voice, early 30s, conversational, clear and upbeat, never salesy',
  avatar=('Photorealistic portrait reference sheet of one man: early 30s, light-tan skin, short dark-brown hair with a natural textured '
          'quiff, neatly trimmed short beard, heather-grey crew-neck sweater with sleeves pushed up over a white T-shirt collar, simple '
          'black watch on the left wrist. Friendly, confident, approachable expression. Three views side by side (front, three-quarter, '
          'profile) plus one waist-up shot seated at a desk, plain light-grey studio background, soft even daylight, 35mm, natural skin '
          'texture, no text, no logos.')),
}

# ---------------------------------------------------------------- backgrounds (image prompt + in-clip description)
BG = {
 'desk': dict(name='Harborview front desk (morning)',
  desc=('HARBORVIEW DENTAL GROUP front desk, morning: a modern specialist dental office. White and light-oak front desk with two monitors '
        'angled away from camera (screens not readable), a desk phone, a small plant, a pen cup and a neat stack of folders. Behind it a '
        'glass door to a bright hallway of operatories, neutral warm-grey walls, a large window on the left with soft morning daylight, '
        'overhead panel lights on. Calm, clean, real-office details, nothing red.'),
  img=('Photorealistic empty interior, vertical 9:16: modern specialist dental office front desk in the morning, white and light-oak desk '
       'with two monitors angled away from camera (screens not visible), desk phone, small plant, pen cup, neat folders, a glass door '
       'behind leading to a bright hallway of operatories, warm-grey walls, large window on the left with soft morning daylight, overhead '
       'panel lights. 35mm, eye level, natural colour, no people, no text, no logos, nothing red.')),
 'hall': dict(name='Harborview hallway between operatories',
  desc=('HARBORVIEW hallway between operatories: a bright corridor with light-grey vinyl floor, white walls, open operatory doors on both '
        'sides showing the edge of a dental chair and an overhead light, a wall-mounted hand-sanitiser dispenser, a round analogue wall '
        'clock with a plain white face (no brand), daylight from the far end of the corridor. Clean, busy-clinic feel.'),
  img=('Photorealistic empty interior, vertical 9:16: bright dental-clinic corridor between operatories, light-grey vinyl floor, white '
       'walls, open doors on both sides showing the edge of dental chairs and overhead lights, wall hand-sanitiser dispenser, round analogue '
       'wall clock with a plain white face, daylight at the far end. 35mm, eye level, natural colour, no people, no text, no logos.')),
 'evening': dict(name='Harborview front office (evening)',
  desc=('HARBORVIEW front office, evening after closing: the same white and light-oak front desk and two monitors (angled away, not readable), '
        'half the overhead lights switched off, a warm desk lamp on, the window behind now dark blue with dusk, empty waiting-room chairs '
        'in soft focus, a coffee mug on the desk. Quiet, tired end-of-day mood.'),
  img=('Photorealistic empty interior, vertical 9:16: the same modern dental front desk in the evening after closing, half the overhead '
       'lights off, warm desk lamp on, dusk-blue window, empty waiting-room chairs in soft focus, coffee mug on the desk, monitors angled '
       'away (screens not visible). 35mm, eye level, natural colour, no people, no text, no logos, nothing red.')),
 'lakeside': dict(name='Lakeside Family Dental recall operatory',
  desc=('LAKESIDE FAMILY DENTAL, a small friendly general dental office: a recall/hygiene operatory with warm wood cabinets, a light-blue '
        'dental chair (empty, the patient has just stepped out), an overhead dental light, a window with soft afternoon daylight and a plant '
        'on the sill, a doorway on the right leading to the front office. Homely, lived-in, nothing red.'),
  img=('Photorealistic empty interior, vertical 9:16: small friendly general-dentist hygiene operatory, warm wood cabinets, empty light-blue '
       'dental chair, overhead dental light, window with soft afternoon daylight and a plant on the sill, doorway on the right to the front '
       'office. 35mm, eye level, natural colour, no people, no text, no logos, nothing red.')),
 'studio': dict(name="Ethan's studio",
  desc=("ETHAN'S STUDIO: a warm, tidy home studio. Ethan sits at a light-oak desk; behind him, slightly out of focus, a wooden bookshelf "
        'with a few books, a small green plant and a warm table lamp, a soft beige wall with gentle daylight from a window on the left. '
        'Soft key light from camera-left, warm practical lamp glow behind. Cozy, credible creator set, nothing red.'),
  img=('Photorealistic empty interior, vertical 9:16: warm tidy home studio, light-oak desk in the foreground, wooden bookshelf with a few '
       'books, small green plant and a warm table lamp behind, soft beige wall, gentle daylight from a window on the left, soft key light. '
       '35mm, eye level at seated head height, natural colour, no people, no text, no logos, nothing red.')),
}

# ---------------------------------------------------------------- clips
CLIPS = [
 dict(id='S1', seg='Cold open + scene for case 1 (0–7 s)', bg='desk', cast=['Rachel', 'Kevin'],
  start='the hero still "Harborview front desk with Rachel and Kevin" (generate it first, see the Cast page)',
  pos='Rachel sits at the front desk facing the monitors, three-quarter to camera, hands on the keyboard. Kevin stands behind her right shoulder, one hand on the back of her chair.',
  emotion='Kevin: light, slightly urgent, apologetic. Rachel: caught off guard, then a stressed little sigh and a helpless half-laugh. Real, quick, relatable, never incompetent: the problem is the missing history, not her.',
  action=[('0.0–0.6 s', 'Rachel types fast; Kevin leans in over her right shoulder, one hand on the chair back, the other pointing loosely at the screen.'),
          ('0.6–3.0 s', 'Kevin says his line, eyebrows up, a small apologetic wince on "Bennett referral", his free hand making a quick "what do we tell them?" open-palm gesture.'),
          ('3.0–3.4 s', 'Rachel stops typing, fingers still on the keys, turns her head up to him; a short breath out.'),
          ('3.4–6.8 s', 'Rachel answers: shakes her head on "No idea", lifts both hands off the keyboard and spreads them on "Jenna handled that one", then lets them drop onto the desk on "Friday was her last day" with a tired half-laugh. Kevin rubs the back of his neck and grimaces.'),
          ('6.8–8.0 s', 'Both hold the look for a beat; Rachel glances back at the monitor and presses her lips together. Kevin straightens up.')],
  camera='Handheld medium two-shot at desk height from the front-left corner of the desk, slow gentle push-in of about 10 % over the clip, both faces always fully visible, monitors stay angled away.',
  lines=[('Kevin', "Lakeside's asking where we are on the Bennett referral.", '0.6–3.0 s'),
         ('Rachel', 'No idea. Jenna handled that one, and Friday was her last day.', '3.4–6.8 s')]),
 dict(id='S2', seg='Case 2: "Can you just text me that X-ray?" (≈20–27 s)', bg='hall', cast=['Ruiz', 'Rachel'],
  start='the background image "Harborview hallway" with Dr. Ruiz and Rachel already walking toward camera from mid-corridor',
  pos='Dr. Ruiz walks toward camera on the left, pulling off a blue nitrile glove; Rachel walks beside her on the right holding her own phone at chest height.',
  emotion='Dr. Ruiz: rushed, friendly, then catches herself and laughs at the idea. Rachel: polite surprise, eyebrows up, a gentle "really?" look. Light comedy, both likeable.',
  action=[('0.0–0.5 s', 'Both walk briskly toward camera; Dr. Ruiz snaps off the first glove.'),
          ('0.5–3.0 s', 'Dr. Ruiz, still walking, says her first line, pulling off the second glove and flicking a hand toward Rachel\'s phone; a quick glance back at an operatory door.'),
          ('3.0–4.2 s', 'Rachel lifts her phone slightly and tilts it toward herself, eyebrows up, a small disbelieving smile: says "From my phone?"'),
          ('4.2–4.8 s', 'Dr. Ruiz stops walking, looks at the phone, a beat of realisation.'),
          ('4.8–7.2 s', 'Dr. Ruiz winces with a small laugh, presses her fingertips to her forehead, then points at Rachel with a grin as she says her last line. Rachel laughs and lowers the phone.'),
          ('7.2–8.0 s', 'Dr. Ruiz shakes her head, still smiling, and turns toward an operatory door; Rachel slips the phone into her pocket.')],
  camera='Handheld walking shot, the camera backs up in front of them at their pace, medium two-shot, then settles still when they stop at 4.2 s. Faces always clear.',
  lines=[('Dr. Ruiz', "Can you just text me Olivia's X-ray? I'm between patients.", '0.5–3.0 s'),
         ('Rachel', 'From my phone?', '3.0–4.2 s'),
         ('Dr. Ruiz', "Yeah, that's a bad idea, isn't it.", '4.8–7.2 s')]),
 dict(id='S3', seg='Case 3: the hallway question nobody remembers (≈35–42 s)', bg='hall', cast=['Rachel', 'Ruiz'],
  start='the background image "Harborview hallway", later in the day; Rachel stands at an open operatory door, Dr. Ruiz arrives from the right',
  pos='Rachel stands beside an open operatory door on the left of frame; Dr. Ruiz enters frame from the right, loupes on her head, mask in hand, heading for the door.',
  emotion='Rachel: proactive, quick and professional, a little hopeful. Dr. Ruiz: genuinely busy, kind, distracted, already half in the room. End beat: Rachel\'s amused "here we go" look at the clock. Natural, no blame.',
  action=[('0.0–0.5 s', 'Dr. Ruiz strides in from the right toward the operatory door; Rachel steps half a pace forward to catch her, one hand lifted.'),
          ('0.5–4.0 s', 'Rachel asks her question quickly, counting the point on two fingers on "from 2023", then a small open-palm "what do you think?" on "before her consult".'),
          ('4.0–6.0 s', 'Dr. Ruiz, already stepping through the door, turns her head back over her shoulder, points a finger at Rachel and says her line with a quick smile, then disappears into the operatory.'),
          ('6.0–7.2 s', 'Rachel stays in the doorway, lets her hand drop, turns her head and looks up at the round wall clock, a small knowing exhale through the nose.'),
          ('7.2–8.0 s', 'Hold on Rachel\'s face, a tiny wry smile.')],
  camera='Handheld medium shot from across the corridor, eye level; a slight pan to follow Dr. Ruiz into the door, then a gentle settle on Rachel for the clock look. The clock face is visible but plain.',
  lines=[('Rachel', "Doc, Olivia's pano is from 2023. Do we take a new one before her consult?", '0.5–4.0 s'),
         ('Dr. Ruiz', 'Good question. Remind me after lunch.', '4.0–6.0 s')]),
 dict(id='S4', seg='Case 4: the consult letter retyped at 6:40 p.m. (≈50–57 s)', bg='evening', cast=['Kevin', 'Rachel'],
  start='the background image "Harborview front office (evening)" with Rachel seated at the desk and Kevin walking in from the hallway door',
  pos='Rachel sits at the desk in the lamp light, typing. Kevin enters from the glass hallway door behind her on the right, jacket on, bag over one shoulder, keys in hand.',
  emotion='Kevin: surprised, caring. Rachel: worn out but good-humoured, a little exasperated at the task, not at anyone. Quiet end-of-day energy, a real human moment.',
  action=[('0.0–0.8 s', 'Kevin walks in zipping his jacket, keys jingling; he slows when he sees Rachel still there.'),
          ('0.8–2.0 s', 'Kevin stops, tilts his head, says "You\'re still here?" with a half-smile, keys hanging from one finger.'),
          ('2.0–2.4 s', 'Rachel stops typing, lifts her hands off the keyboard and rubs her eyes with thumb and finger.'),
          ('2.4–6.6 s', 'Rachel answers without fully turning: a tired laugh on "Retyping", a flat-hand gesture at the monitor on "Same letter", then a little circular "again and again" hand roll on "new patient name, every time." Kevin puffs his cheeks and nods in sympathy.'),
          ('6.6–8.0 s', 'Rachel puts her hands back on the keyboard and starts typing again; Kevin hesitates in the doorway, glancing at the clock.')],
  camera='Handheld medium-wide from the side of the desk, warm lamp light on Rachel\'s face, Kevin in the background then sharpening into focus as he speaks (subtle rack focus), slow drift in.',
  lines=[('Kevin', "You're still here?", '0.8–2.0 s'),
         ('Rachel', "Retyping Dr. Ruiz's consult letter. Same letter, new patient name, every time.", '2.4–6.6 s')]),
 dict(id='S5', seg='Case 5: the patient declined, nobody told the referring dentist (≈65–72 s)', bg='lakeside', cast=['Whitaker', 'Megan'],
  start='the background image "Lakeside Family Dental recall operatory" with Dr. Whitaker standing by the empty chair reading the tablet; Megan in the doorway on the right',
  pos='Dr. Whitaker stands next to the empty dental chair, reading a tablet (screen facing away from camera). Megan stands in the doorway on the right, one shoulder against the frame.',
  emotion='Dr. Whitaker: puzzled, concerned for his patient, not angry. Megan: honest, a little embarrassed, a small helpless shrug. Quiet realisation that the loop was never closed.',
  action=[('0.0–0.8 s', 'Dr. Whitaker scrolls on the tablet with one finger, frowns slightly, lowers his glasses a touch.'),
          ('0.8–4.4 s', 'He turns his head toward Megan and says his line, tapping the edge of the tablet twice on "that implant", eyebrows raised.'),
          ('4.4–5.0 s', 'Megan opens her mouth, pauses, touches her reading glasses on the lanyard.'),
          ('5.0–7.2 s', 'Megan says her line slowly, with a small helpless shrug and open palms on "Nobody ever told us." Dr. Whitaker nods slowly and looks back at the tablet.'),
          ('7.2–8.0 s', 'Dr. Whitaker exhales and lowers the tablet; Megan bites her lip.')],
  camera='Handheld medium two-shot from beside the dental chair, eye level, gentle drift; Megan sharp in the doorway when she answers. Tablet screen never visible.',
  lines=[('Dr. Whitaker', 'Daniel Ortiz is back for his cleaning. Did he ever have that implant done?', '0.8–4.4 s'),
         ('Megan', "I… don't know. Nobody ever told us.", '5.0–7.2 s')]),
 dict(id='E1', seg='Hook: Ethan on camera (7–12 s)', bg='studio', cast=['Ethan'],
  start='the hero still "Ethan at his desk" (generate it first, see the Cast page)',
  pos='Ethan sits at the light-oak desk, centred, forearms resting on the desk, looking straight into the lens.',
  emotion='Energetic, warm, a knowing "I\'ve been there" smile. Confident, friendly, a creator talking to peers, not a salesman.',
  action=[('0.0–0.5 s', 'Ethan looks into the lens, small knowing smile, eyebrows lift.'),
          ('0.5–1.6 s', '"Sound familiar?": a playful head tilt and a little point toward the viewer with his right index finger.'),
          ('1.6–4.4 s', 'He leans in slightly; on "five moments" he raises his right hand and holds up five fingers, palm to camera, at chest height, and keeps them up.'),
          ('4.4–6.4 s', 'On "and how to handle each one" he turns the five-finger hand into an open palm and makes a small confident sweep, then rests both hands on the desk with a nod.'),
          ('6.4–8.0 s', 'He holds eye contact, bright smile, a tiny nod as if to say "let\'s go"; natural blink.')],
  camera='Locked-off medium close-up at seated eye level (head and chest, hands in frame), very subtle handheld breathing, background softly out of focus.',
  lines=[('Ethan', 'Sound familiar? Here are five moments every specialist office knows, and how to handle each one.', '0.5–6.4 s')]),
 dict(id='E7a', seg='Close, part 1: Ethan on camera (80–84 s)', bg='studio', cast=['Ethan'],
  start='the last frame of E1 (same position, same outfit, same light)',
  pos='Ethan sits at the desk exactly as at the end of E1, hands resting on the desk.',
  emotion='Calm, thoughtful, then a little emphasis: honest advice from someone who gets it.',
  action=[('0.0–0.4 s', 'Ethan settles back a little in his chair, small smile.'),
          ('0.4–3.4 s', '"None of these are big problems on their own.": a relaxed shrug with both palms up, slight head shake.'),
          ('3.4–6.6 s', '"Together, they\'re where referrals slip.": he brings both hands together in front of his chest, fingers interlacing on "Together", then opens one hand and lets it slide down and away on "slip".'),
          ('6.6–8.0 s', 'He holds the look, a small serious nod, then the corner of a smile.')],
  camera='Same locked-off medium close-up as E1, eye level, no cut.',
  lines=[('Ethan', "None of these are big problems on their own. Together, they're where referrals slip.", '0.4–6.6 s')]),
 dict(id='E7b', seg='Close, part 2: Ethan on camera (84–87 s, then the end card)', bg='studio', cast=['Ethan'],
  start='the last frame of E7a (same position, same outfit, same light)',
  pos='Ethan sits at the desk exactly as at the end of E7a.',
  emotion='Warm, proud, relaxed; a friendly payoff.',
  action=[('0.0–0.5 s', 'Ethan leans back slightly, warm smile.'),
          ('0.5–3.6 s', '"The dashboard you just saw": a small gesture with his right hand toward the lower right of the frame, as if pointing back at what we watched; on "is Tooth Referral" he looks back to the lens with a confident nod.'),
          ('3.6–8.0 s', 'Relaxed lean back, arms resting, bright smile held to the lens; one natural blink and a slight nod. Hold still enough for the end card to fade in.')],
  camera='Same locked-off medium close-up as E1, eye level, no cut.',
  lines=[('Ethan', 'The dashboard you just saw is Tooth Referral.', '0.5–3.6 s')]),
]

VO = [  # Ethan voice-overs over the dashboard: in the PDF only, not in any Flow prompt
 ('1', 'Someone leaves, and the referral history leaves with them (12–20 s)', 'Referral timeline and history: entries pop in with a name and a time ("Received · Rachel Moore · Nov 5, 9:12 AM").',
  "When someone leaves, the referral shouldn't leave with them. Every update and message stays on the case, so it lives in the platform, not one person's head.", '✕ "Jenna knew" → ✓ Full history on the case'),
 ('2', '"Can you just text me that X-ray?" (20–35 s)', 'Referral detail page; the cursor opens the X-ray and attachments.',
  'Texting X-rays from a personal phone is one of the most common HIPAA slip-ups. Keep it on the case, and open it from any browser.', '✕ Personal phone → ✓ On the case, secure'),
 ('3', 'The hallway question nobody remembers (35–50 s)', 'Administrative Notes: Rachel\'s @mention about the 2023 pano, the "1 unread @mention" pill, Dr. Ruiz\'s quoted reply, Kevin confirms. Label "Private · only your office".',
  'Hallway questions disappear. Put it in a private note and tag the doctor. The answer waits on the case, and the other office never sees it.', '✕ "Remind me after lunch" → ✓ Tagged, answered, private'),
 ('4', 'The consult letter retyped at 6:40 p.m. (50–65 s)', 'Prepare Consultation Note: the letter fills in from the template, Show values ↔ Show codes, Sign and Send, signature draws, "All done", success toast.',
  'Turn that Word letter into a template once. Patient and doctor details fill themselves in, the doctor signs digitally, and it goes straight back.', '✕ Retyped every time → ✓ Template, signed, sent'),
 ('5', 'The patient declined, and nobody told the referring dentist (65–80 s)', 'Status picker on Daniel Ortiz\'s case → Declined Appointment, a short note posts to Office Communication, and the referring office sees it on their side.',
  'If a patient declines, mark it on the case with a short note. The referring dentist sees it the same day, not at the next recall.', '✕ Found out at recall → ✓ Same-day update'),
]

HERO = [
 ('Hero still: Harborview front desk with Rachel and Kevin (start image for S1, reference for S2–S4)',
  'Photorealistic vertical 9:16 still, behind-the-scenes documentary look, 35mm, soft morning daylight from a window on the left mixed with overhead office light, light film grain. '
  + BG['desk']['desc'] + ' ' + CAST['Rachel']['desc'] + ' She sits at the desk typing, three-quarter to camera. ' + CAST['Kevin']['desc']
  + ' He stands behind her right shoulder, one hand on her chair back, leaning in. Both faces clearly visible, natural expressions. No text, no logos, no readable screens, nothing red.'),
 ('Hero still: Ethan at his desk (start image for E1)',
  'Photorealistic vertical 9:16 still, 35mm, soft key light from camera-left, light film grain. ' + BG['studio']['desc'] + ' ' + CAST['Ethan']['desc']
  + ' Medium close-up, seated, forearms on the desk, looking straight into the lens with a friendly knowing smile. No text, no logos, nothing red.'),
]


def prompt(c):
    b = BG[c['bg']]
    who = [CAST[k] for k in c['cast']]
    LBL = {'Kevin': 'Kevin', 'Rachel': 'Rachel', 'Dr. Ruiz': 'Ruiz', 'Dr. Whitaker': 'Whitaker', 'Megan': 'Megan', 'Ethan': 'Ethan'}
    NM = {'Ruiz': 'Dr. Elena Ruiz', 'Whitaker': 'Dr. James Whitaker', 'Rachel': 'Rachel Moore', 'Kevin': 'Kevin Tran', 'Megan': 'Megan Cole', 'Ethan': 'Ethan'}
    ing = f'background image "{b["name"]}" + ' + ' + '.join(f'avatar image "{NM[k]}"' for k in c['cast'])
    speakers = [f'{s} ({CAST[LBL[s]]["voice"]}), {tm}: {t}' for s, t, tm in c['lines']]
    p = [
     f'INGREDIENTS: {ing}.',
     f'START IMAGE: {c["start"]}. Continue from the exact positions in the start image, no jump, no reset, no change of outfit, hair, props or lighting. Starting positions: {c["pos"]}',
     f'FORMAT: Vertical 9:16, 8 seconds, one continuous shot, 24 fps. {LOOK}',
     f'BACKGROUND: {b["desc"]}',
     'CHARACTERS (only these people are in the shot): ' + ' '.join(w['desc'] for w in who),
     f'EMOTION AND ENERGY: {c["emotion"]} Natural, energetic and engaging: real people mid-workday, lively faces, eyebrows and eyes that react while listening, small head movements, natural blinks and breathing, hands that move with the words; never stiff, never posed, never over-acted.',
     'ACTION (second by second): ' + ' '.join(f'{t}: {a}' for t, a in c['action']),
     f'CAMERA: {c["camera"]}',
     'DIALOGUE (on camera, lip-synced, English): ' + ' '.join(speakers)
     + ' Say each line once, word for word, at a natural conversational pace, with no extra words. Only the person speaking moves their lips; '
       'everyone else keeps their mouth closed and reacts silently while listening.',
     'AUDIO: natural room tone of the space only (soft footsteps, keyboard, keys, distant clinic sounds as fitting), only the people in the shot speak, no music, no narrator.',
     NEG,
    ]
    return p


def esc(s): return html.escape(s)


def build():
    md = ['# UGC 17: "Five moments every specialist office knows" — Google Flow prompts', '',
          'Vertical 9:16 · ≈87 s · 24 fps · Veo 3.1 in Google Flow. 8 Flow clips: 5 office scenes (S1–S5) + Ethan\'s hook (E1) and close (E7a, E7b). '
          'Ethan\'s five fix lines are voice-over on the dashboard: they are in the script below, not in any prompt.', '']
    css = '''<style>@page{size:A4;margin:14mm}body{font:10.5pt/1.5 Inter,Arial,sans-serif;color:#1c1f33}
h1{color:#4b2fc4;font-size:21pt;margin:0 0 6px}h2{color:#4b2fc4;border-bottom:2px solid #e4defa;padding-bottom:4px;margin:18px 0 8px}
h3{color:#2a1a7a;margin:12px 0 4px}table{border-collapse:collapse;width:100%;font-size:9.5pt;margin:6px 0}td,th{border:1px solid #d9d3f0;padding:5px 7px;vertical-align:top}th{background:#f1edff;text-align:left}
.p{background:#f7f5ff;border:1px solid #d9d3f0;border-left:4px solid #6d4ae8;border-radius:6px;padding:9px 11px;font-size:9.2pt;white-space:pre-wrap;margin:6px 0}
.vo{background:#fff8e6;border-left:4px solid #e89d15;padding:7px 10px;border-radius:6px;margin:4px 0}.k{font-weight:700;color:#4b2fc4}.pb{break-before:page}
.dl{background:#eefaf3;border-left:4px solid #1f9d61;padding:7px 10px;border-radius:6px;margin:4px 0}.small{font-size:9pt;color:#555}</style>'''
    h = ['<!doctype html><meta charset=utf-8>' + css,
         '<h1>UGC 17: "Five moments every specialist office knows"</h1>',
         '<p class=small>Google Flow (Veo 3.1) prompts · vertical 9:16 · ≈87 s · 24 fps · from the script v5 (2026-11-26). '
         'Natural, energetic, engaging performances with real hand movements.</p>',
         '<h2>How to use this PDF</h2><ol>'
         '<li>Generate the avatar reference images and background images first (Cast page), then the two hero stills.</li>'
         '<li>In Flow, add the background and avatar images as <b>Ingredients</b> for each clip, set the <b>start image</b> named in the clip, and paste the clip prompt unchanged.</li>'
         '<li>Each prompt repeats the full background and the full description of everyone in the shot, so Flow never mixes people up.</li>'
         '<li>Ethan\'s five fix lines are <b>voice-over only</b> (orange boxes). They are not in any Flow prompt: record them in Ethan\'s voice (ElevenLabs voice clone from E1/E7) and lay them over the dashboard shots.</li>'
         '<li>Clips are 8 s; each scene has a short head and tail for trimming to ≈7 s in the edit.</li></ol>',
         '<h2>Clip plan</h2><table><tr><th>Clip</th><th>Segment</th><th>On camera</th><th>Background</th></tr>'
         + ''.join(f'<tr><td><b>{c["id"]}</b></td><td>{esc(c["seg"])}</td><td>{", ".join(CAST[k]["role"].split(",")[0] for k in c["cast"])}</td><td>{BG[c["bg"]]["name"]}</td></tr>' for c in CLIPS)
         + '<tr><td>VO 1–5</td><td>Ethan\'s fix lines over the coded dashboard</td><td>no one (dashboard)</td><td>—</td></tr></table>']
    md += ['## Clip plan', '', '| Clip | Segment | On camera | Background |', '|---|---|---|---|']
    md += [f'| {c["id"]} | {c["seg"]} | {", ".join(CAST[k]["role"].split(",")[0] for k in c["cast"])} | {BG[c["bg"]]["name"]} |' for c in CLIPS]
    md += ['| VO 1–5 | Ethan\'s fix lines over the coded dashboard | dashboard | — |', '']

    # full script with dialogue and VO (VO here only)
    h.append('<h2 class=pb>Full script (dialogue, voice-overs, dashboard beats)</h2>')
    md += ['## Full script', '']
    order = [('S1', None), ('E1', None), ('VO', 0), ('S2', None), ('VO', 1), ('S3', None), ('VO', 2), ('S4', None), ('VO', 3), ('S5', None), ('VO', 4), ('E7a', None), ('E7b', None)]
    CB = {c['id']: c for c in CLIPS}
    for k, i in order:
        if k == 'VO':
            n, title, dash, line, chips = VO[i]
            h.append(f'<h3>Fix {n} · {esc(title)} — dashboard</h3><p class=small>{esc(dash)}</p>'
                     f'<div class=vo><span class=k>Ethan (voice-over, not in a Flow prompt):</span> {esc(line)}</div><p class=small>Chips: {esc(chips)}</p>')
            md += [f'### Fix {n} · {title} — dashboard', '', dash, '', f'> **Ethan (VO, not in a prompt):** {line}', '', f'Chips: {chips}', '']
        else:
            c = CB[k]
            h.append(f'<h3>{c["id"]} · {esc(c["seg"])}</h3>' + ''.join(f'<div class=dl><span class=k>{esc(s)}:</span> {esc(t)}</div>' for s, t, _ in c['lines']))
            md += [f'### {c["id"]} · {c["seg"]}', ''] + [f'- **{s}:** {t}' for s, t, _ in c['lines']] + ['']
    h.append('<p class=small>End card (60 frames): logo + toothreferral.com + "Save this for your next team meeting." No contact CTA. To cut to ≈70 s, drop case 2 or case 5.</p>')

    # cast + backgrounds
    h.append('<h2 class=pb>Cast: avatar image prompts</h2>')
    md += ['## Cast: avatar image prompts', '']
    for k, v in CAST.items():
        h.append(f'<h3>{esc(v["role"])}</h3><div class=p>{esc(v["avatar"])}</div><p class=small>Voice: {esc(v["voice"])}</p>')
        md += [f'### {v["role"]}', '', '```', v['avatar'], '```', f'Voice: {v["voice"]}', '']
    h.append('<h2>Background image prompts</h2>')
    md += ['## Background image prompts', '']
    for v in BG.values():
        h.append(f'<h3>{esc(v["name"])}</h3><div class=p>{esc(v["img"])}</div>')
        md += [f'### {v["name"]}', '', '```', v['img'], '```', '']
    h.append('<h2>Hero stills (start images)</h2>')
    md += ['## Hero stills', '']
    for t, p in HERO:
        h.append(f'<h3>{esc(t)}</h3><div class=p>{esc(p)}</div>')
        md += [f'### {t}', '', '```', p, '```', '']

    # clip pages
    for c in CLIPS:
        p = prompt(c)
        h.append(f'<h2 class=pb>Clip {c["id"]} · {esc(c["seg"])}</h2>'
                 f'<p><b>Script direction:</b> {esc(c["pos"])}</p><p><b>Emotion:</b> {esc(c["emotion"])}</p>'
                 + ''.join(f'<div class=dl><span class=k>{esc(s)} ({tm}):</span> {esc(t)}</div>' for s, t, tm in c['lines'])
                 + '<h3>Google Flow prompt (paste as is)</h3><div class=p>' + esc('\n\n'.join(p)) + '</div>'
                 + '<h3>Avatar prompts for this clip</h3>' + ''.join(f'<div class=p><b>{esc(CAST[k]["role"])}</b>\n{esc(CAST[k]["avatar"])}</div>' for k in c['cast'])
                 + f'<h3>Background image prompt</h3><div class=p>{esc(BG[c["bg"]]["img"])}</div>')
        md += [f'## Clip {c["id"]} · {c["seg"]}', '', f'**Script direction:** {c["pos"]}', '', f'**Emotion:** {c["emotion"]}', '']
        md += [f'- **{s} ({tm}):** {t}' for s, t, tm in c['lines']] + ['', '### Google Flow prompt', '', '```', '\n\n'.join(p), '```', '', '### Avatar prompts for this clip', '']
        for k in c['cast']: md += [f'**{CAST[k]["role"]}**', '', '```', CAST[k]['avatar'], '```', '']
        md += ['### Background image prompt', '', '```', BG[c['bg']]['img'], '```', '']

    open(MD, 'w').write('\n'.join(md))
    hp = os.path.join(D, '_ugc17.html'); open(hp, 'w').write('\n'.join(h))
    js = os.path.join(D, '_ugc17.cjs')
    open(js, 'w').write(f'''const {{ chromium }} = require('playwright');
(async () => {{ const b = await chromium.launch(); const p = await b.newPage(); await p.goto('file://{hp}');
await p.evaluate(() => document.fonts.ready); await p.pdf({{ path: '{PDF}', format: 'A4', printBackground: true, margin: {{ top: '14mm', bottom: '14mm', left: '13mm', right: '13mm' }} }}); await b.close(); }})();''')
    subprocess.run(['node', js], check=True, cwd='/home/user/awesome-opus-5-5-prompts/reel')
    os.remove(hp); os.remove(js)
    for c in CLIPS:
        w = sum(len(t.split()) for _, t, _ in c['lines'])
        print(c['id'], 'words', w, 'prompt chars', len('\n\n'.join(prompt(c))))


if __name__ == '__main__':
    build()
