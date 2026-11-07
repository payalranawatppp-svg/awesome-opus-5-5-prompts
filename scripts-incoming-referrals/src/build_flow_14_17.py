"""Google Flow versions of conversational stories 14-17 -> HTML -> PDF."""
import html, subprocess, os

OUT = '/home/user/awesome-opus-5-5-prompts/scripts-incoming-referrals/Conversational-Stories-14-17-Google-Flow.pdf'
E = html.escape

STYLE = ('Vertical 9:16 video, 8 seconds, one continuous shot. Photorealistic live-action footage that looks professionally '
         'filmed, not AI-generated: cinema camera (Sony FX3 look), 35mm lens, natural daylight plus soft practical lights, '
         'true-to-life colours, real skin texture with pores, subtle film grain, natural imperfections, no glossy or plastic look.')
NEG = ('Audio: only the spoken line and quiet room tone{extra}. No music, no subtitles, no captions, no on-screen text, '
       'no readable screens, no logos, no red clothing or props, no extra people, no warping hands or faces.')

SETS = {
    'car': 'Inside a parked silver mid-size sedan in a sunny dental-office parking lot, morning. Light-grey fabric seats, a phone in a dashboard mount, a thick manila folder on the passenger seat. Through the windshield, a modern single-storey dental building with a glass entrance (no readable sign).',
    'sa_desk': "The front desk of a bright, modern specialist dental office (St. Andrew's Family Dental): a long white quartz counter with a light-oak front panel, a slim monitor angled away from camera (soft glow, no readable screen), a black desk phone, a pen cup, a small tooth model, a sage-green wall with a framed smiling-tooth illustration, a doorway behind showing a dental chair and an overhead dental light, beige waiting chairs and a window with sheer blinds and soft daylight.",
    'flash': 'A crowded, older dental waiting room: beige walls, fluorescent lights, a reception window with a sliding glass panel, stacks of paper forms, a fax machine on a side counter, plastic chairs. Desaturated, slightly cool colour grade (flashback look).',
    'gd_break': 'A small, cosy staff break room in a general dentist office (Gentle Dental): a round light-wood table, two takeout containers and forks, a coffee maker, a fridge with a few magnets, a window with daylight, a desk phone on the wall counter.',
    'gd_desk': 'The front desk of a friendly general dentist office (Gentle Dental): a warm white counter, a monitor angled away from camera (soft glow, no readable screen), a desk phone with a shoulder-rest handset, a pen cup, a small plant, a light-blue wall with a framed smiling-tooth poster, a doorway to a treatment room.',
    'hall': "A bright hallway in a modern specialist dental office (St. Andrew's Family Dental): white walls, light-oak doors, framed smile photos, a small break room visible through a doorway with a coffee machine, soft daylight.",
    'kitchen': 'A warm home kitchen in the evening: a light-wood table, a laptop open (screen glow, no readable screen), a glass of water, pendant lights, a dark window behind.',
}

def who(desc):
    return desc

STORIES = []

# ----------------------------------------------------------------------------- 14
STORIES.append(dict(
    num=14, title='Nothing to Fill Out', tag='Patient story', clips_note='11 clips x 8 s = about 88 s',
    hook='A nervous patient brings a folder of paperwork to his implant consult, and finds out he doesn\'t need any of it.',
    problem='Patients end up as the courier between two offices: clipboards, insurance numbers read out loud, X-rays that never arrive by fax and have to be retaken.',
    solution='With Tooth Referral, Gentle Dental sends one referral case with the X-rays attached. The specialist taps "Request from patient", the patient photographs his insurance card through a secure link, and both offices see the same case. After the consult, Tooth Referral sends the signed consult note back to the general dentist automatically.',
    cast={
        'BOB': ('Bob Smith, the patient', 'a man in his early 50s with short salt-and-pepper hair, a short trimmed grey beard, kind eyes, a navy quarter-zip sweater over a light-blue collared shirt and khaki trousers', 'a warm, slightly gravelly male voice in his early 50s, natural neutral American accent, friendly and a little nervous at first, relaxed by the end'),
        'GREG': ("Greg, front desk at St. Andrew's Family Dental", 'a man in his late 20s with short dark-brown hair, clean-shaven, a friendly open face, charcoal-grey scrubs and a small blank white name badge', 'a clear, warm, upbeat male voice in his late 20s, natural neutral American accent, calm and welcoming'),
        'TANYA': ('Tanya, front desk at Gentle Dental', 'a woman in her mid-30s with dark-brown hair in a low side ponytail, navy short-sleeve V-neck scrubs and a small blank white name badge', 'a warm mid-to-low female voice in her mid-30s, natural neutral American accent'),
    },
    sets=['car', 'sa_desk', 'flash'],
    clips=[
        ('car', 'Parked and ready', ['BOB'], 'BOB', "I just parked. I brought everything this time. Insurance card, the X-ray CD, the referral letter.",
         'Bob sits in the driver\'s seat, talking to his wife on speaker. His right hand pats the thick manila folder on the passenger seat on "everything"; his left hand rests on the steering wheel.',
         'A small nervous smile, eyebrows slightly raised.', 'He glances down at the folder, then back to the phone.',
         'Medium close-up through the passenger side, eye level, static with a very slow push-in.'),
        ('car', 'Wish me luck', ['BOB'], 'BOB', "Last time I sat there forty minutes with a clipboard. Okay. Love you. Wish me luck.",
         'He picks up the folder, tucks it under his arm and reaches for the door handle on "wish me luck".',
         'A wry laugh on "forty minutes", then a deep breath.', 'A small shake of the head at the memory, then a nod to himself.',
         'Same framing, static.'),
        ('sa_desk', 'The welcome', ['GREG', 'BOB'], 'GREG', "Morning! You must be Bob. Gentle Dental sent you over for your implant consult, right?",
         'Greg looks up from the monitor and stands as Bob walks up to the counter holding his folder. Greg gives a small open-hand wave.',
         'A genuine, welcoming smile.', 'A slight friendly head tilt.',
         'Medium two-shot from the waiting-room side across the counter, eye level, static.'),
        ('sa_desk', 'The folder', ['BOB', 'GREG'], 'BOB', "That's me. My insurance card is right here, and the X-rays are on this CD somewhere.",
         'Bob opens the folder on the counter and fumbles through papers, pulling out an insurance card and a CD case. Greg watches with an amused, kind smile.',
         'Bob: slightly flustered, focused on the folder.', 'Bob looks down at the papers, then up at Greg.',
         'Medium close-up favouring Bob, Greg in soft focus on the right, static.'),
        ('sa_desk', 'Already here', ['GREG', 'BOB'], 'GREG', "You can keep those. We already have your X-rays and both sides of your insurance card.",
         'Greg gently raises one open palm on "keep those", then points two fingers at his monitor on "already have".',
         'Greg: reassuring, warm. Bob: surprised, mouth slightly open.', 'Greg nods once; Bob leans back a little.',
         'Over-the-shoulder from behind Bob onto Greg, static.'),
        ('sa_desk', 'I filled nothing out', ['BOB', 'GREG'], 'BOB', "Wait. I didn't fill anything out.",
         'Bob holds the folder in both hands like he doesn\'t know what to do with it, then lowers it to the counter.',
         'Genuine disbelief turning into a laugh.', 'He looks from the folder to Greg and back.',
         'Close-up on Bob, eye level, static. (Line is short: let him hold the moment and laugh.)'),
        ('flash', 'The old way (flashback)', ['BOB'], 'BOB', "Last time, their fax never showed up. They took new X-rays, and I paid for them twice.",
         'Bob, in the same clothes, sits in a plastic chair filling in a long paper form on a clipboard; he flips a page, sighs and clicks the pen. In the background, a receptionist on the phone with the fax machine beside her.',
         'Tired, mildly annoyed.', 'He rubs his temple once.',
         'Medium shot, slightly handheld, desaturated cool grade. The line is voice-over in Bob\'s voice (his lips do not move).'),
        ('sa_desk', 'How it arrived', ['GREG', 'BOB'], 'GREG', "Gentle Dental sent you through Tooth Referral. The referral, your X-rays and your insurance all came in as one case.",
         'Greg turns the conversation toward the monitor, gesturing to it with an open hand, then brings both hands together on "one case".',
         'Greg: proud of the system, friendly. Bob: interested, nodding.', 'Greg glances at the monitor, then back to Bob.',
         'Medium two-shot, static. Pronounce it "tooth referral".'),
        ('sa_desk', 'Request from patient', ['GREG', 'BOB'], 'GREG', "If anything's missing, I tap request from patient, and you send it from your phone. Remember Tuesday's link?",
         'Greg mimes a tap on the desk, then mimes holding a phone and taking a photo. Bob pulls his phone out of his pocket and looks at it, recognising the message.',
         'Bob: a dawning smile. Greg: playful.', 'Bob nods slowly.',
         'Medium two-shot, static.'),
        ('sa_desk', 'Closing the loop', ['BOB', 'GREG'], 'BOB', "Should I call my dentist and tell them how it went?",
         'Checkout after the consult: Bob is relaxed, jacket over his arm. GREG answers in the same take: "No need. Tooth Referral sends them your signed consult note today."',
         'Bob: relaxed, curious. Greg: confident.', 'Greg shakes his head lightly on "No need".',
         'Medium two-shot, static. Two lines in one clip: Bob first (about 3 s), then Greg (about 4 s).'),
        ('car', 'Best visit', ['BOB'], 'BOB', "Best dental visit I've ever had. I didn't even sit down in the waiting room.",
         'Back in the car, the folder untouched on the passenger seat. Bob talks on speaker again, one hand relaxed on the wheel.',
         'A big, easy smile.', 'He leans back against the headrest and laughs.',
         'Medium close-up through the passenger side, static, warm light.'),
    ],
    inserts=['Clip 5: the case detail Attachments "shared with both offices" (X-rays, Insurance cards) - reel/public/dash2/cs-01-case-detail.',
             'Clip 8: the referral arriving in the Incoming list - in-01-incoming-list.',
             'Clip 9: Insurance cards with the "Request from patient" button - cs-01-case-detail (crop to the insurance block).',
             'Clip 10: "Consultation Note signed and sent successfully" - cs-07-signed-success.'],
    vo='When the referral, the X-rays and the insurance arrive together in Tooth Referral, your patient walks in ready. Set up takes about five minutes.',
    roi='Smooth intake protects case acceptance (76% on the analytics reference) and saves repeat X-rays and re-verification. One case that doesn\'t walk out pays for the software.',
))

# ----------------------------------------------------------------------------- 15
STORIES.append(dict(
    num=15, title='The Sick Day', tag='Front desk story', clips_note='11 clips x 8 s = about 88 s',
    hook='Tanya comes back from a sick day and finds out the voicemail she left on Friday was never followed up.',
    problem='A voicemail was left, then the person who left it was out sick. The call-back only lived on a sticky note, so nobody else knew a patient was waiting.',
    solution='In Tooth Referral, "Left a Voice Message" is a status the whole team sees on the status board, every change is time-stamped in the patient\'s activity log, and referrals tried three or more times show up under Needs Attention with a one-click Re-assign, so whoever is at the desk picks them up.',
    cast={
        'TANYA': ("Tanya, front desk at St. Andrew's Family Dental", 'a woman in her mid-30s with dark-brown hair in a low side ponytail over her left shoulder, navy short-sleeve V-neck scrubs and a small blank white name badge, light natural makeup, a little pale (just back from a sick day)', 'a warm mid-to-low female voice in her mid-30s, natural neutral American accent; tired at first, then relieved'),
        'AMANDA': ("Amanda, office manager at St. Andrew's Family Dental", 'a woman in her early 30s with shoulder-length light-brown wavy hair worn down, a soft teal scrub top under a light-grey cardigan and a small blank white name badge', 'a bright, friendly, slightly higher female voice in her early 30s, natural neutral American accent; calm and reassuring'),
    },
    sets=['sa_desk'],
    clips=[
        ('sa_desk', 'Welcome back', ['AMANDA', 'TANYA'], 'AMANDA', "Look who's back! Feeling better?",
         'Tanya hangs her coat on a hook and sits at the desk. Amanda slides a white mug of tea across the counter to her. TANYA answers in the same take: "Mostly. Two days of soup and bad TV."',
         'Amanda: a big warm smile. Tanya: a tired laugh.', 'Tanya rolls her eyes playfully on "bad TV".',
         'Medium two-shot across the desk, eye level, static. Two lines: Amanda (about 2 s), then Tanya (about 3 s).'),
        ('sa_desk', 'The question', ['TANYA', 'AMANDA'], 'TANYA', "Okay, what did I miss? Did Chloe Henderson call back? I left her a voicemail Friday.",
         'Tanya wraps both hands around the mug, then sets it down and wakes up the monitor with the mouse.',
         'Focused, a little worried on "Friday".', 'She looks from the screen up to Amanda.',
         'Medium close-up favouring Tanya, Amanda soft on the right, static.'),
        ('sa_desk', 'The sticky note', ['AMANDA', 'TANYA'], 'AMANDA', "I didn't know you'd called her.",
         'A beat of silence first. Then Tanya peels a yellow sticky note off the edge of her monitor and holds it up. TANYA answers in the same take: "It was on this sticky note."',
         'Amanda: surprised. Tanya: a sinking look.', 'Tanya slowly lowers the note.',
         'Medium two-shot, static. Leave 1 s of silence before Amanda speaks.'),
        ('sa_desk', 'Not on you', ['TANYA', 'AMANDA'], 'TANYA', "So she's been waiting four days for her bone graft consult.",
         'Tanya puts the sticky note down and rubs her forehead with her fingertips. Amanda puts a hand on Tanya\'s shoulder. AMANDA answers in the same take: "That\'s not on you. You were sick."',
         'Tanya: guilty, deflated. Amanda: kind, firm.', 'Amanda shakes her head gently.',
         'Medium two-shot, static.'),
        ('sa_desk', 'Put it in Tooth Referral', ['AMANDA', 'TANYA'], 'AMANDA', "The problem is the follow-up lived on a sticky note. From now on, it goes in Tooth Referral.",
         'Amanda pulls a chair next to Tanya and sits, pointing at the monitor on "Tooth Referral".',
         'Amanda: practical, upbeat. Tanya: listening, nodding.', 'Amanda leans toward the screen.',
         'Medium two-shot from the side of the desk, both facing the monitor, static. Pronounce it "tooth referral".'),
        ('sa_desk', 'Left a voice message', ['TANYA', 'AMANDA'], 'TANYA', "Okay. Chloe Henderson. Status: left a voice message. So now the whole team can see it.",
         'Tanya clicks with the mouse twice, then sits back and turns to Amanda on "the whole team".',
         'Tanya: relief starting.', 'A small nod at the screen.',
         'Over-the-shoulder onto the monitor (glow only, no readable screen), static.'),
        ('sa_desk', 'The activity log', ['AMANDA', 'TANYA'], 'AMANDA', "And every status change shows on her activity log. Who did it, and exactly when. Nobody has to guess.",
         'Amanda traces a short line down the screen with one finger on "activity log", then taps the desk on "nobody has to guess".',
         'Amanda: confident, warm.', 'She turns from the screen to Tanya.',
         'Medium two-shot, static.'),
        ('sa_desk', 'Three tries, no answer', ['TANYA', 'AMANDA'], 'TANYA', "And if somebody's been called three times and never picks up?",
         'Tanya turns her chair toward Amanda. AMANDA answers in the same take: "Tooth Referral flags them under Needs Attention."',
         'Tanya: curious. Amanda: a knowing smile.', 'Amanda points back at the monitor.',
         'Medium two-shot, static.'),
        ('sa_desk', 'One click', ['AMANDA', 'TANYA'], 'AMANDA', "One click, re-assign, and whoever's at the desk picks it up. Even on your sick days.",
         'Amanda mimes a single mouse click on "one click", then gives Tanya a light playful nudge on "sick days".',
         'Amanda: teasing, kind. Tanya: laughs.', 'Tanya tilts her head back as she laughs.',
         'Medium two-shot, static.'),
        ('sa_desk', 'The call back', ['AMANDA', 'TANYA'], 'AMANDA', "St. Andrew's Family Dental, this is Amanda. Hi Chloe! Yes, let's get you booked right now.",
         'The desk phone rings. Amanda picks up the handset, brightening on "Hi Chloe". Tanya watches and mouths "thank you".',
         'Amanda: bright, professional. Tanya: grateful.', 'Tanya puts a hand on her heart.',
         'Medium two-shot, static.'),
        ('sa_desk', 'The button', ['TANYA', 'AMANDA'], 'TANYA', "People get sick. The follow-up shouldn't.",
         'Amanda hangs up. Both relax back in their chairs. Amanda raises her mug. AMANDA answers in the same take: "Not anymore."',
         'Both smiling, relaxed.', 'They clink mugs lightly.',
         'Medium two-shot, very slow push-in, static.'),
    ],
    inserts=['Clip 6: status update and the toast "Status updated successfully!" (real recording).',
             'Clip 6-7: Status board card "Left a Voice Message - 3" with Lily Cox, Chloe Henderson, Owen Ward - reel/public/analytics-ref/08-status-board.',
             'Clip 7: the patient activity log - reel/public/dash3c/r3c-activity-log.',
             'Clip 8-9: Needs attention "2 ghost referrals ... 3+ attempts logged - Re-assign" - reel/public/analytics-ref/06-needs-staff.'],
    vo='People get sick. People forget. With Tooth Referral, the follow-up never depends on one person. Set up takes about five minutes.',
    roi='One referral that doesn\'t slip through the cracks pays for the software; saving referrals like this one adds up to potentially about $5,000 a year.',
))

# ----------------------------------------------------------------------------- 16
STORIES.append(dict(
    num=16, title='"Where\'s My Patient?"', tag='Referring office story', clips_note='11 clips x 8 s = about 88 s',
    hook='A general dentist\'s office manager keeps getting calls from a patient asking when her surgery is, and has no idea what the specialist did.',
    problem='The communication black hole: the referral goes out, then silence. The patient blames her own dentist, and the office spends its lunch break on hold.',
    solution='With Tooth Referral both offices work in the same case from their own dashboard: Barbara sees the live status (Consultation Scheduled, Thursday), messages St. Andrew\'s with an @mention right on the case, gets an answer in a minute, and receives the signed consult note automatically. No access codes, no portal links, no fax.',
    cast={
        'BARBARA': ('Barbara, office manager at Gentle Dental', 'a woman in her early 50s with chin-length silver-blonde hair, reading glasses pushed up on her head, a lavender scrub top under a navy cardigan and a small blank white name badge', 'a warm, steady female voice in her early 50s, natural neutral American accent; patient, a little exasperated at first, then satisfied'),
        'GREG': ('Greg, front desk at Gentle Dental', 'a man in his late 20s with short dark-brown hair, clean-shaven, charcoal-grey scrubs and a small blank white name badge', 'a clear, warm male voice in his late 20s, natural neutral American accent, light and friendly'),
        'AMANDA': ("Amanda, office manager at St. Andrew's Family Dental", 'a woman in her early 30s with shoulder-length light-brown wavy hair worn down, a soft teal scrub top under a light-grey cardigan and a small blank white name badge', 'a bright, friendly, slightly higher female voice in her early 30s, natural neutral American accent'),
    },
    sets=['gd_break', 'gd_desk', 'sa_desk'],
    clips=[
        ('gd_break', 'Lunch', ['GREG', 'BARBARA'], 'GREG', "So how's your daughter liking college?",
         'Barbara and Greg eat takeout at the round table. BARBARA answers in the same take: "She calls me every day about laundry. So, great."',
         'Greg: friendly. Barbara: an affectionate eye-roll and a laugh.', 'Barbara shakes her head, smiling.',
         'Medium two-shot across the table, eye level, static.'),
        ('gd_break', 'Line two', ['GREG', 'BARBARA'], 'GREG', "And Mrs. Parker's on line two. Again. She's asking about her surgery date.",
         'Greg\'s phone buzzes; he checks it and winces. Barbara puts down her fork and wipes her hands on a napkin.',
         'Greg: apologetic. Barbara: a resigned sigh.', 'Barbara closes her eyes for a second.',
         'Medium two-shot, static.'),
        ('gd_desk', 'The call', ['BARBARA'], 'BARBARA', "Hi Mrs. Parker. We sent your referral two weeks ago. Let me check and call you right back.",
         'Barbara holds the desk-phone handset, pulling her glasses down onto her nose, writing a quick note on a pad.',
         'Professional and kind, hiding frustration.', 'She nods along as she listens.',
         'Medium close-up, eye level, static.'),
        ('gd_desk', 'No idea', ['BARBARA', 'GREG'], 'BARBARA', "She thinks we forgot about her. And honestly, I have no idea what's happening over there.",
         'Barbara hangs up and turns to Greg, who leans on the counter. She lifts both hands in a small helpless shrug on "no idea".',
         'Barbara: frustrated, honest. Greg: sympathetic.', 'Barbara lets her head drop slightly.',
         'Medium two-shot, static.'),
        ('gd_desk', 'On hold', ['BARBARA'], 'BARBARA', "Nine minutes on hold for one surgery date.",
         'Barbara has the handset wedged between her ear and shoulder, drumming her fingers on the counter, looking at the wall clock. Tinny hold music plays from the handset.',
         'Bored, mildly exasperated.', 'She tips her head back against the shoulder rest.',
         'Medium shot, static. She mutters the line to herself. Audio: faint hold music from the phone plus her line.'),
        ('gd_desk', 'A few weeks later', ['BARBARA'], 'BARBARA', "Now I just open Tooth Referral. Mrs. Parker. Consultation scheduled, Thursday.",
         'A few weeks later, calm morning light. Barbara scrolls with the mouse, glasses on, then taps the screen with one finger on "Thursday".',
         'Calm, in control, a small satisfied smile.', 'A small nod.',
         'Over-the-shoulder onto the monitor (glow only), static. Pronounce it "tooth referral".'),
        ('gd_desk', 'Message on the case', ['BARBARA'], 'BARBARA', "And if I have a question, I message St. Andrew's right on her case. At Amanda, is she all set?",
         'Barbara types on the keyboard, reading her message aloud as she types the last sentence.',
         'Focused, friendly.', 'She glances up at the camera-side as if to Greg, then back.',
         'Medium close-up, static.'),
        ('sa_desk', 'The reply', ['AMANDA'], 'AMANDA', "Yes! Thursday at ten. We already have her insurance and her X-rays.",
         "At St. Andrew's, Amanda notices the message, smiles and types, reading her reply aloud.",
         'Bright, helpful.', 'A small nod at the screen.',
         'Medium close-up, static.'),
        ('gd_desk', 'Booked', ['BARBARA'], 'BARBARA', "Mrs. Parker? You're booked Thursday at ten. You're very welcome.",
         'Barbara on the phone again, relaxed this time, leaning back in her chair.',
         'Warm, relieved smile.', 'She nods as the patient thanks her.',
         'Medium close-up, static.'),
        ('gd_desk', 'The signed note', ['BARBARA', 'GREG'], 'BARBARA', "Look. St. Andrew's already sent the signed consult note, right inside Tooth Referral. No fax.",
         'A few days later. Barbara turns the monitor slightly toward Greg (screen still unreadable) and points at it.',
         'Pleased, a little impressed.', 'Greg leans in to look.',
         'Medium two-shot, static.'),
        ('gd_desk', 'The button', ['BARBARA', 'GREG'], 'BARBARA', "No access codes, no portals. Next wisdom teeth case? St. Andrew's. They actually talk to us.",
         'Barbara hands Greg a referral folder on "next wisdom teeth case" and taps it.',
         'Confident, decisive. Greg grins.', 'Barbara gives a firm nod.',
         'Medium two-shot, slow push-in.'),
    ],
    inserts=['Clip 6: the Outgoing list with the status "Consultation Scheduled" (real recording, Outgoing tab).',
             'Clip 7-8: Office Communication with the @mention; "All communications are HIPAA compliant and encrypted" - cs-08-case-messages.',
             'Clip 10: DocuSign completion note signed and the "Signed Referral" row - cs-06-signed-done / cs-07-signed-success.'],
    vo='General dentists don\'t stop referring over clinical skill. They stop over silence. Tooth Referral puts both offices on one case. Set up takes about five minutes.',
    roi='Offices refer more to specialists who keep them updated: new referrals from the network are worth potentially $5,000-$10,000 a year. St. Andrew\'s Family Dental is already the top sender on the analytics reference (7 of 28).',
))

# ----------------------------------------------------------------------------- 17
STORIES.append(dict(
    num=17, title='First Day, No Notebook', tag='Turnover and owner story', clips_note='11 clips x 8 s = about 88 s',
    hook='A new front-desk hire asks for the last coordinator\'s notes, and learns that this time, the notes live in the software.',
    problem='When a coordinator leaves, nobody knows what still needs to be done: pending call-backs, consults with no note, half-verified insurance. It lived in one person\'s head.',
    solution='Tooth Referral\'s status board shows every patient, their status and how long they\'ve waited, so a new hire knows exactly who to call first. Each status update notifies the referring office automatically, and the owner checks the analytics page any evening: 28 referrals, first contact in 3.7 hours, nothing to chase.',
    cast={
        'GREG': ("Greg, new front-desk hire at St. Andrew's Family Dental", 'a man in his late 20s with short dark-brown hair, clean-shaven, charcoal-grey scrubs and a small blank white name badge, eager first-day energy', 'a clear, warm male voice in his late 20s, natural neutral American accent, curious and upbeat'),
        'AMANDA': ("Amanda, office manager at St. Andrew's Family Dental", 'a woman in her early 30s with shoulder-length light-brown wavy hair worn down, a soft teal scrub top under a light-grey cardigan and a small blank white name badge', 'a bright, friendly, slightly higher female voice in her early 30s, natural neutral American accent; warm, honest'),
        'OWNER': ('The practice owner (no name)', 'a specialist in their late 40s in a navy quarter-zip over a white shirt, seen mostly from behind or in profile at the laptop, face never in sharp close-up', 'a calm, measured voice in the late 40s, natural neutral American accent'),
    },
    sets=['hall', 'sa_desk', 'kitchen'],
    clips=[
        ('hall', 'The tour', ['AMANDA', 'GREG'], 'AMANDA', "Break room, bathroom, and the coffee machine. Be nice to it. It has moods.",
         'Amanda and Greg walk down the hallway side by side. Amanda hands Greg a paper coffee cup and points at the doors as they pass.',
         'Amanda: playful. Greg: laughs.', 'Amanda glances sideways at Greg on "it has moods".',
         'Walk-and-talk: the camera tracks backward in front of them on a gimbal, smooth, eye level.'),
        ('hall', 'The notes?', ['GREG', 'AMANDA'], 'GREG', "Noted. So did the last coordinator leave notes? Like who still needs a call back?",
         'Still walking, Greg takes a sip of coffee, then asks, eager.',
         'Greg: keen, curious.', 'He turns his head to Amanda.',
         'Same walk-and-talk tracking shot.'),
        ('hall', 'All in her head', ['AMANDA', 'GREG'], 'AMANDA', "When she left, we found three sticky notes and forty voicemails. She was great. It was all in her head.",
         'Amanda stops walking and turns to Greg. She holds up three fingers on "three sticky notes".',
         'Honest, a little rueful, never blaming.', 'A small shrug on "all in her head".',
         'Medium two-shot, static.'),
        ('hall', 'Weeks', ['AMANDA', 'GREG'], 'AMANDA', "It took us weeks to figure out who was still waiting. Some of those patients never came back.",
         'Amanda looks down for a moment, then back at Greg. Greg\'s smile fades into understanding.',
         'Amanda: serious, quiet. Greg: attentive.', 'Greg nods slowly.',
         'Medium close-up favouring Amanda, static.'),
        ('sa_desk', 'Your notebook', ['AMANDA', 'GREG'], 'AMANDA', "This time, everything's in Tooth Referral. This status board is your notebook.",
         'At the front desk. Greg sits; Amanda stands behind his chair and reaches past him to tap the monitor.',
         'Amanda: confident, upbeat. Greg: intrigued.', 'Greg leans toward the screen.',
         'Medium two-shot from the side, static. Pronounce it "tooth referral".'),
        ('sa_desk', 'Start here', ['AMANDA', 'GREG'], 'AMANDA', "Every patient, every status, how long they've waited. New ones on top. Start with Ryan Bailey.",
         'Amanda moves her finger down the screen as she lists, then taps once on "Ryan Bailey".',
         'Practical and warm.', 'She looks at Greg on "start with".',
         'Over-the-shoulder onto the monitor (glow only), static.'),
        ('sa_desk', 'The first call', ['GREG'], 'GREG', "Hi Ryan, this is Greg from St. Andrew's Family Dental. I'm calling about your referral.",
         'Greg picks up the desk-phone handset and smiles as he speaks, pen in his other hand.',
         'Friendly, a touch nervous, then confident.', 'He nods as Ryan answers.',
         'Medium close-up, static.'),
        ('sa_desk', 'It tells them?', ['GREG', 'AMANDA'], 'GREG', "That's it? I update the status, and the referring office already sees it?",
         'Greg hangs up, clicks the mouse twice and turns to Amanda. AMANDA answers in the same take: "Automatically."',
         'Greg: pleasantly surprised. Amanda: a proud smile.', 'Amanda gives a small, satisfied nod.',
         'Medium two-shot, static.'),
        ('kitchen', 'The owner, that evening', ['OWNER'], 'OWNER', "I used to find out about problems months later. Now I just open the analytics.",
         'Evening. The owner sits at the kitchen table with the laptop, a glass of water nearby, scrolling the trackpad.',
         'Calm, relieved (seen in profile).', 'A slow nod at the screen.',
         'Medium shot from behind the shoulder and side, laptop glow on their face, static.'),
        ('kitchen', 'Twenty-eight', ['OWNER'], 'OWNER', "Twenty-eight referrals this month. First call in under four hours. And I didn't have to ask anyone.",
         'The owner leans back in the chair and closes the laptop halfway with a small smile.',
         'Content, quietly proud of the team.', 'A small exhale.',
         'Same framing, slow push-in.'),
        ('sa_desk', 'Day two', ['AMANDA', 'GREG'], 'AMANDA', "Look at you. Day two, and you already know everything.",
         'Next morning: Greg is already at the desk with his coffee, the monitor on. Amanda walks up. GREG answers in the same take: "It\'s all right here in Tooth Referral."',
         'Amanda: impressed, teasing. Greg: easy confidence.', 'Greg gestures at the screen with his cup.',
         'Medium two-shot, static.'),
    ],
    inserts=['Clip 5-6: Status board (New 2, Received 1, In Progress 1, Left a Voice Message 3, Consultation Scheduled 3, Consultation Completed 4, Scheduled 4) - reel/public/analytics-ref/08-status-board.',
             'Clip 8: Update Status and the toast "Status updated successfully! A notification has been created." (real recording).',
             'Clip 9-10: Analytics KPIs - 28 received (+27% vs prior), time to first contact 3.7 h, case acceptance 76% - reel/public/analytics-ref/01-header-kpis; or a clip of reel/renders/analytics-demo.mp4.',
             'Clip 10: Needs attention 2 / 2 / 3 - reel/public/analytics-ref/06-needs-staff.'],
    vo='Even if your whole front desk changes tomorrow, your referrals don\'t skip a beat. A practice that runs on Tooth Referral, not on memory, is worth more. Set up takes about five minutes.',
    roi='One referral missed because someone left can pay for a whole year of the software. A turnkey, data-backed referral system can raise practice value about 5-10% (about $50,000-$100,000 on a $1M practice).',
))


def prompt(s, c):
    loc, name, people, spk, line, action, face, head, cam = c
    extra = ''
    if 'in the same take:' in action:
        pre, post = action.split('in the same take:')
        extra = post.split('"')[1]
        other = [p for p in people if p != spk][0]
        pre = pre.rstrip()
        for tail in (f'{other} answers', f'{other} answers in the same take'):
            if pre.endswith(tail): pre = pre[: -len(tail)].rstrip()
        action = pre + f' Then {other} answers (second line below).' + post.split('"', 2)[2]
    parts = [STYLE, SETS[loc]]
    for p in people:
        role, look, voice = s['cast'][p]
        parts.append(f'{p}: {look}.')
    parts.append(f'Action and hands: {action}')
    parts.append(f'Face: {face} Head: {head}')
    parts.append(f'Camera: {cam}')
    voice = s['cast'][spk][2]
    parts.append(f'{spk} speaks first, with {voice}. Perfectly lip-synced: "{line}"' if extra else f'{spk} speaks with {voice}. Perfectly lip-synced: "{line}"')
    if extra:
        parts.append(f'Then {other} answers, with {s["cast"][other][2]}. Perfectly lip-synced: "{extra}"')
    extra = ', a soft phone ring' if 'rings' in action else (', faint hold music from the handset' if 'hold music' in action.lower() else '')
    parts.append(NEG.format(extra=extra))
    return '\n'.join(parts)


def words(t):
    return len([w for w in t.replace('"', ' ').split() if w.strip('.,!?')])


def story_html(s):
    cast = ''.join(f'<tr><td class="who">{E(k)}</td><td><b>{E(v[0])}</b><br>{E(v[1])}<br><span class="mut">Voice: {E(v[2])}</span></td></tr>' for k, v in s['cast'].items())
    sets = ''.join(f'<li><b>{E(k)}</b>: {E(SETS[k])}</li>' for k in s['sets'])
    clips = []
    t = 0
    for i, c in enumerate(s['clips'], 1):
        loc, name, people, spk, line, action, face, head, cam = c
        extra = ''
        if 'in the same take:' in action:
            extra = action.split('in the same take:')[1].split('"')[1]
        dlg = f'<div class="dl"><span class="sp">{E(spk)}</span> "{E(line)}"</div>'
        if extra:
            other = [p for p in people if p != spk][0]
            dlg += f'<div class="dl"><span class="sp">{E(other)}</span> "{E(extra)}"</div>'
        wc = words(line) + words(extra)
        clips.append(f'''<div class="clip"><div class="ch"><span class="cn">CLIP {i:02d}</span><span class="ct">{E(name)}</span><span class="tc">{t}-{t + 8} s · {wc} words</span></div>
        {dlg}<div class="pl">Flow prompt (paste as is)</div><pre>{E(prompt(s, c))}</pre></div>''')
        t += 8
    ins = ''.join(f'<li>{E(x)}</li>' for x in s['inserts'])
    return f'''<section class="story">
  <div class="kicker">Script {s['num']} · {E(s['tag'])} · Google Flow</div>
  <h1>{E(s['title'])}</h1>
  <p class="pov">{E(s['hook'])}</p>
  <div class="grid"><div class="box prob"><div class="bl">The problem</div>{E(s['problem'])}</div>
  <div class="box fix"><div class="bl">How Tooth Referral solves it</div>{E(s['solution'])}</div></div>
  <table class="meta"><tr><td class="k">Format</td><td>Vertical 9:16, {E(s['clips_note'])}, live-action look. Generate one background still per location first (Imagen), then every clip from it, so rooms never change.</td></tr></table>
  <h2>Characters (built into every prompt)</h2><table class="cast">{cast}</table>
  <h2>Locations</h2><ul class="sets">{sets}</ul>
  <h2>Clips</h2>{''.join(clips)}
  <div class="grid end"><div class="box roi"><div class="bl">Edit plan: real dashboard inserts (split screen)</div><ul>{ins}</ul>The monitors in the footage never show text, so the real screens go on top in the edit.</div>
  <div class="box roi"><div class="bl">Closing voice-over (record in ElevenLabs, female presenter "Bella")</div>"{E(s['vo'])}"<div class="bl" style="margin-top:8px">ROI line for the caption / end card</div>{E(s['roi'])}</div></div>
</section>'''


overview = ''.join(f'<tr><td class="n">{s["num"]}</td><td><b>{E(s["title"])}</b><br><span class="mut">{E(s["tag"])}</span></td><td>{E(s["problem"])}</td></tr>' for s in STORIES)

doc = f'''<!doctype html><html><head><meta charset="utf-8"><style>
@page {{ size: Letter; margin: 0.5in 0.55in 0.6in; }}
:root {{ --p:#6D4AE8; --pl:#F1ECFE; --ink:#1B1830; --mut:#6B6880; --line:#E6E3EF; --ambl:#FFF4DE; --grn:#1F9D6B; --grnl:#E7F7F0; }}
* {{ box-sizing: border-box; }}
body {{ font-family: Inter, sans-serif; color: var(--ink); font-size: 9.6pt; line-height: 1.38; margin: 0; }}
.cover {{ page-break-after: always; padding-top: 0.1in; }}
.brand {{ color: var(--p); font-weight: 700; letter-spacing: .08em; font-size: 10pt; text-transform: uppercase; }}
.cover h1 {{ font-size: 26pt; line-height: 1.08; margin: 12px 0 10px; }}
.sub {{ font-size: 12pt; color: var(--mut); max-width: 6.2in; }}
.how {{ background: var(--pl); border-radius: 10px; padding: 8px 14px; margin: 12px 0; font-size: 9pt; }}
.how b {{ color: var(--p); }}
.how li {{ margin: 3px 0; }}
table {{ border-collapse: collapse; width: 100%; }}
.ov td {{ border-top: 1px solid var(--line); padding: 8px; vertical-align: top; }}
.ov td.n {{ color: var(--p); font-weight: 700; font-size: 14pt; width: 34px; }}
.mut {{ color: var(--mut); font-size: 8.8pt; }}
.rules {{ margin-top: 16px; font-size: 8.8pt; color: var(--mut); border-left: 3px solid var(--p); padding: 6px 12px; }}
.story {{ page-break-before: always; }}
.kicker {{ color: var(--p); font-weight: 700; font-size: 9pt; letter-spacing: .08em; text-transform: uppercase; }}
h1 {{ font-size: 22pt; margin: 4px 0; }}
.pov {{ color: var(--mut); margin: 0 0 10px; font-size: 10.5pt; }}
h2 {{ font-size: 10pt; text-transform: uppercase; letter-spacing: .07em; color: var(--p); margin: 12px 0 4px; }}
.grid {{ display: flex; gap: 10px; }}
.box {{ flex: 1; border-radius: 10px; padding: 10px 12px; }}
.box .bl {{ font-weight: 700; font-size: 8.5pt; text-transform: uppercase; letter-spacing: .06em; margin-bottom: 4px; }}
.prob {{ background: var(--ambl); }} .prob .bl {{ color: #A86B00; }}
.fix {{ background: var(--grnl); }} .fix .bl {{ color: var(--grn); }}
.roi {{ background: var(--pl); }} .roi .bl {{ color: var(--p); }} .roi ul {{ margin: 0 0 6px; padding-left: 16px; }}
.end {{ margin-top: 10px; page-break-inside: avoid; }}
.meta {{ margin-top: 8px; }} .meta td {{ padding: 2px 8px 2px 0; vertical-align: top; }} .meta .k {{ color: var(--mut); width: 60px; font-weight: 600; }}
.cast td {{ padding: 5px 8px 5px 0; border-top: 1px solid var(--line); vertical-align: top; }} .cast .who {{ font-weight: 800; width: 80px; color: var(--p); }}
.sets {{ margin: 0; padding-left: 16px; }} .sets li {{ margin: 2px 0; }}
.clip {{ border: 1px solid var(--line); border-radius: 10px; padding: 8px 11px; margin: 7px 0; page-break-inside: avoid; }}
.ch {{ display: flex; gap: 8px; align-items: baseline; }}
.cn {{ color: var(--p); font-weight: 800; }} .ct {{ font-weight: 700; flex: 1; }} .tc {{ color: var(--mut); font-size: 8.5pt; }}
.dl {{ margin: 4px 0 2px; font-size: 10pt; }} .dl .sp {{ font-weight: 800; font-size: 8.8pt; letter-spacing: .03em; margin-right: 6px; }}
.pl {{ font-size: 7.8pt; text-transform: uppercase; letter-spacing: .06em; color: var(--mut); margin-top: 5px; }}
pre {{ white-space: pre-wrap; font-family: Inter, sans-serif; font-size: 8.4pt; line-height: 1.34; background: #F7F6FB; border-radius: 6px; padding: 7px 9px; margin: 3px 0 0; color: #2A2740; }}
</style></head><body>
<div class="cover">
  <div class="brand">Tooth Referral · Google Flow scripts</div>
  <h1>Four conversational stories, ready for Google Flow</h1>
  <div class="sub">Scripts 14-17 rewritten for Flow: each story is a set of 8-second clips with the exact dialogue and a complete prompt per clip. Every story names Tooth Referral and shows, in a little detail, how it solves the problem, in a natural conversation.</div>
  <div class="how"><b>How to use in Flow</b><ul>
    <li>Make a background still for each location first (Imagen), then generate each clip from it so the room stays the same.</li>
    <li>Paste each clip prompt as it is. Each one is self-contained: look, set, characters, hands, face, head, camera, the line and the voice.</li>
    <li>Dialogue is kept to about 20 words per 8-second clip so the lip-sync fits. Where two people speak in one clip, the prompt says who goes first.</li>
    <li>Flow sometimes says "Tute Referral": write it as two words, "Tooth Referral", as in these prompts. If it still slips, re-voice that line in ElevenLabs.</li>
    <li>For continuity, extend from the last frame of the previous clip (Flow "Extend" / frames-to-video).</li>
    <li>The real dashboard screens are added in the edit (split screen), never generated, so the product looks exactly like it is.</li></ul></div>
  <table class="ov">{overview}</table>
  <div class="rules">Client rules applied: "general dentist", never "GP"; offices Gentle Dental (referring) and St. Andrew's Family Dental (specialist); staff only Barbara, Tanya, Amanda, Greg; no doctors' names; no red in the frame or our graphics; the front desk is always the hero. Dashboard numbers come from the canonical analytics reference (reel/public/analytics-ref). ROI figures are "potential", from the client call of Nov 5.</div>
</div>
{''.join(story_html(s) for s in STORIES)}
</body></html>'''

D = os.path.dirname(os.path.abspath(__file__))
H = os.path.join(D, 'flow.html')
open(H, 'w').write(doc)
js = f'''const {{ chromium }} = require('playwright');
(async () => {{ const b = await chromium.launch(); const p = await b.newPage();
  await p.goto('file://{H}'); await p.evaluate(() => document.fonts.ready);
  await p.pdf({{ path: '{OUT}', format: 'Letter', printBackground: true, preferCSSPageSize: true, displayHeaderFooter: true, headerTemplate: '<div></div>',
    footerTemplate: '<div style="font-family:Inter;font-size:8px;color:#8a879a;width:100%;padding:0 0.55in;display:flex;justify-content:space-between"><span>Tooth Referral · Google Flow scripts 14-17</span><span class="pageNumber"></span></div>' }});
  await b.close(); }})();'''
open(os.path.join(D, 'flow_pdf.js'), 'w').write(js)
subprocess.run(['node', os.path.join(D, 'flow_pdf.js')], check=True)
for s in STORIES:
    for i, c in enumerate(s['clips'], 1):
        extra = c[5].split('in the same take:')[1].split('"')[1] if 'in the same take:' in c[5] else ''
        n = words(c[4]) + words(extra)
        if n > 22: print('LONG', s['num'], i, n)
print(OUT)
