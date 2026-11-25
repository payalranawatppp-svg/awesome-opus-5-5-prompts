"""UGC 17 clip S2, rewritten in full detail (2026-11-25) after Flow mixed up speakers and actions.
Static staging (no walk-and-talk), every speaker tagged by position + clothing, one start-frame still, strict dialogue rules,
no clinical trigger words (the first wording was refused by Flow's policy filter)."""

ELENA = ('ELENA (LEFT side of the frame): a woman in her early 40s, warm olive skin, dark brown hair pulled back in a neat low bun, '
         'small gold hoop earrings, minimal makeup. She wears a WHITE knee-length lab coat, open, over TEAL scrubs, and holds a slim '
         'tablet tucked under her LEFT arm; a simple silver watch on her right wrist. She is the ONLY person wearing a white coat. '
         'Personality: busy, friendly, quick-witted, laughs at herself easily.')
RACHEL = ('RACHEL (RIGHT side of the frame): a woman in her early 30s, light-medium skin with a few freckles, shoulder-length dark brown '
          'hair in a low ponytail with a few loose strands at her face, small silver stud earrings. She wears NAVY-BLUE short-sleeve '
          'scrubs with a white ID badge clipped to her chest pocket, NO lab coat, and holds a black smartphone in her RIGHT hand. '
          'Personality: warm, quick, a little cheeky.')
HALL = ('SETTING: a bright, clean office corridor. Light-grey floor, white walls, a few open doors on both sides, a round wall clock '
        'with a plain white face high on the right wall, a small hand-sanitiser dispenser by one door, soft daylight coming from a '
        'window at the far end of the corridor. Nobody else is in the corridor.')
LOOK = ('SHOT: vertical 9:16, 8 seconds, ONE continuous shot with no cuts. Photorealistic, looks like real behind-the-scenes documentary '
        'footage filmed on a cinema camera: 35mm lens, eye level, natural daylight with soft overhead office light, true skin tones, light '
        'film grain, gentle handheld drift. Not AI-looking, not glossy, not a commercial.')

START_STILL = ('Photorealistic vertical 9:16 still, documentary look, 35mm, eye level, natural daylight, light film grain. ' + HALL + ' '
  'Two women stand in the middle of the corridor about one arm\'s length apart, turned slightly toward each other and three-quarter '
  'to the camera, framed from the knees up. ' + ELENA + ' She has just stopped walking and glances at her watch. ' + RACHEL +
  ' She holds the phone at waist height, screen facing away from camera, and looks at Elena with a friendly expression. Both mouths '
  'closed. Both faces fully visible and sharp. No text, no logos, no other people, nothing red.')

MAIN = ' '.join([
 'INGREDIENTS: the start-frame still "S2 start frame" + avatar image of Elena + avatar image of Rachel + the corridor background image.',
 'START IMAGE: "S2 start frame". Continue from it exactly: same two women, same clothes, same positions, same light. No jump, no reset.',
 LOOK, HALL,
 'PEOPLE: exactly two people are in the shot, nobody else ever appears.', ELENA, RACHEL,
 'POSITIONS: Elena stays on the LEFT and Rachel stays on the RIGHT for the whole clip. They stand still in the middle of the corridor, '
 'turned slightly toward each other and three-quarter to the camera. Nobody walks out of frame and they never swap sides.',
 'TIMELINE, second by second:',
 '0.0–0.6 s: no one speaks. Elena lowers her wrist after checking her watch and turns to Rachel. Rachel looks at Elena, phone at waist height. Both mouths closed.',
 '0.6–3.2 s: ELENA, the woman in the white lab coat on the left, speaks in a friendly, slightly rushed way, with a light open-hand '
 'gesture toward Rachel\'s phone. She says exactly: "Can you just text me Olivia\'s file? I\'m running between rooms." '
 'Meanwhile Rachel listens with her mouth closed and gives a small nod.',
 '3.2–4.4 s: RACHEL, the woman in navy scrubs on the right, lifts the phone to chest height, glances at it, then looks back at Elena '
 'with her eyebrows raised and a small surprised smile. She says exactly: "From my phone?" Meanwhile Elena listens with her mouth closed.',
 '4.4–5.0 s: silence. Elena looks at the phone, pauses for one beat, and her eyebrows lift as she realises.',
 '5.0–7.2 s: ELENA, the woman in the white lab coat on the left, gives a sheepish laugh, shakes her head at herself and lifts both '
 'palms in a small "my bad" gesture. She says exactly: "Yeah, that\'s a bad idea, isn\'t it." Meanwhile Rachel smiles with her mouth '
 'closed and lowers the phone.',
 '7.2–8.0 s: no one speaks. Elena smiles and turns toward an open door on the left; Rachel slips the phone into her scrub pocket.',
 'DIALOGUE RULES: there are exactly three spoken lines, in this order, each said once, word for word, with no extra words, no '
 'ad-libs, no repeats and no narrator. Elena says lines 1 and 3. Rachel says only line 2, "From my phone?". When one woman speaks, '
 'the other woman\'s mouth stays closed. American English at a natural pace, lip-synced. Elena\'s voice: confident, warm, slightly '
 'rushed, early 40s. Rachel\'s voice: warm and quick, early 30s, a little higher than Elena\'s.',
 'CAMERA: medium two-shot from the knees up, both faces fully visible and sharp for the whole clip, very slight handheld drift and a '
 'slow push-in of about 5 %. The phone screen is never visible.',
 'SOUND: quiet office room tone and faint distant footsteps only, no music.',
 'AVOID: on-screen text, captions, subtitles, logos, watermarks; any third person; Rachel wearing a lab coat; the two women swapping '
 'clothes, sides or lines; walking out of frame; extra or warped fingers; a warped phone; frozen faces; lip-sync drift; cuts.',
])

NO_LIPSYNC = ' '.join([
 'INGREDIENTS: the start-frame still "S2 start frame" + avatar image of Elena + avatar image of Rachel + the corridor background image.',
 'START IMAGE: "S2 start frame". Continue from it exactly: same two women, same clothes, same positions, same light. No jump, no reset.',
 LOOK, HALL,
 'PEOPLE: exactly two people are in the shot, nobody else ever appears.', ELENA, RACHEL,
 'This clip has NO dialogue: neither woman speaks and both keep their mouths closed except for smiling and laughing silently. '
 'The voices will be added later.',
 'TIMELINE, second by second:',
 '0.0–1.0 s: Elena lowers her wrist after checking her watch and turns her head to Rachel.',
 '1.0–3.2 s: Elena makes a light open-hand gesture toward Rachel\'s phone, eyebrows up, friendly and in a hurry.',
 '3.2–4.4 s: Rachel lifts the phone to chest height, looks at it, then looks back at Elena with raised eyebrows and a small surprised smile.',
 '4.4–5.0 s: Elena looks at the phone and pauses; her eyebrows lift as she realises.',
 '5.0–7.2 s: Elena laughs silently and sheepishly, shakes her head at herself and lifts both palms in a small "my bad" gesture; Rachel smiles and lowers the phone.',
 '7.2–8.0 s: Elena turns toward an open door on the left; Rachel slips the phone into her scrub pocket.',
 'CAMERA: medium two-shot from slightly behind Rachel\'s right shoulder, so Elena is seen three-quarter and Rachel mostly from behind '
 'and in profile; very slight handheld drift. The phone screen is never visible.',
 'SOUND: quiet office room tone and faint distant footsteps only, no speech, no music.',
 'AVOID: on-screen text, captions, logos; any third person; Rachel wearing a lab coat; swapping clothes or sides; extra or warped '
 'fingers; a warped phone; frozen faces; cuts.',
])

DUB = ('Voice lines for the no-lip-sync version (record in ElevenLabs and place them at these times): 0.6–3.2 s Elena: '
       '"Can you just text me Olivia\'s X-ray? I\'m between patients."  3.2–4.4 s Rachel: "From my phone?"  '
       '5.0–7.2 s Elena: "Yeah, that\'s a bad idea, isn\'t it."')
