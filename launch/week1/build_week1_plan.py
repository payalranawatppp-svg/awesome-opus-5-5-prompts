"""Week 1 launch plan for Vejay (Excel): the plan, each item's message and goal, beat-by-beat breakdowns of both videos,
the carousel slides, captions, a guideline check and open actions. Transcripts: reel/src/data/transcript-s13.json
(Buried in Emails v1) and transcript-b2.json (v2); carousel text from carousels/feature-posts (build.py, captions.json)."""
import json, os
from openpyxl import Workbook
from openpyxl.styles import Alignment, Border, Font, PatternFill, Side
from openpyxl.utils import get_column_letter

ROOT = '/home/user/awesome-opus-5-5-prompts'
OUT = os.path.join(ROOT, 'launch/week1/ToothReferral-Week-1-Launch-Plan.xlsx')
LINK = {
    'v1': 'https://drive.google.com/file/d/1DNz7KdbK5SxNp_ety7PHv6eoF8lnVMW4/view?usp=drivesdk',
    'c1': 'https://drive.google.com/file/d/1RIHICtpyWQeK_K8T0G82aFyFj_K9a0zE/view?usp=drivesdk',
    'v2': 'https://drive.google.com/file/d/1HUm8GC_l8n0KYs1QtYH9PG5unF8gZL4E/view?usp=drivesdk',
    'c2': 'https://drive.google.com/file/d/1hB9hVRxQ5aVdVPxo42TG061KXbiGxV4q/view?usp=drivesdk',
}
PURPLE, LILAC, AMBER_SOFT, GREEN_SOFT, GREY = '6D4AE8', 'F1ECFE', 'FFF1D6', 'E6F6EC', 'F7F7FA'
thin = Side(style='thin', color='E4DBFF')
BORDER = Border(left=thin, right=thin, top=thin, bottom=thin)
WRAP = Alignment(wrap_text=True, vertical='top')


def sheet(wb, title, headers, rows, widths, first=False, fills=None):
    ws = wb.active if first else wb.create_sheet()
    ws.title = title
    ws.append(headers)
    for c in ws[1]:
        c.font = Font(bold=True, color='FFFFFF'); c.fill = PatternFill('solid', fgColor=PURPLE); c.alignment = Alignment(wrap_text=True, vertical='center'); c.border = BORDER
    for r in rows:
        ws.append(r)
    for i, row in enumerate(ws.iter_rows(min_row=2), 2):
        for c in row:
            c.alignment = WRAP; c.border = BORDER
            if isinstance(c.value, str) and c.value.startswith('https://'):
                c.hyperlink = c.value; c.font = Font(color='1D4ED8', underline='single')
        if fills and fills(i - 2):
            for c in row: c.fill = PatternFill('solid', fgColor=fills(i - 2))
    for i, w in enumerate(widths, 1):
        ws.column_dimensions[get_column_letter(i)].width = w
    ws.freeze_panes = 'B2'
    ws.row_dimensions[1].height = 32
    return ws


wb = Workbook()

# ------------------------------------------------------------------ 1. overview
ov = wb.active; ov.title = 'Overview'
lines = [
    ('ToothReferral · Week 1 launch plan', None),
    ('Prepared for Vejay · 5 posts, one per weekday', None),
    ('', None),
    ('Campaign idea', 'Tooth Referral is not just a form; it is a system for the whole team (Vejay, 11 Nov). Week 1 opens on the problem every dental office recognises, referrals lost between emails, voicemails and faxes, and then shows, one feature at a time, how one shared case fixes it.'),
    ('Week 1 goal', 'Brand awareness with the front desk and office managers (the people who make most buying decisions), on both sides of the referral: the general dentist\'s office that refers and the specialist\'s office that receives. Make them recognise the problem, like the brand, and remember one idea: "one referral, one case, everyone on it".'),
    ('Sequence logic', 'Story, feature, story, feature, summary. Videos carry the emotion (Day 1 the problem, Day 3 the system for the team); carousels prove it with one concrete feature each (Day 2 insurance, Day 4 notes); Day 5 sums the week up in one image.'),
    ('Rules applied to every item', 'Problem framed as human error, never staff fault · "general dentist", never the abbreviation · "electronic health record" written out · no "shared inbox" · no red in our graphics · staff names Tanya, Amanda, Greg, Barbara only · no doctors\' names · demo data only · one message per post · no contact CTA.'),
    ('Primary platform', 'LinkedIn (carousels uploaded as PDF documents so they swipe in the feed); videos are vertical 9:16 and also suit Instagram Reels / Facebook.'),
    ('How to read this file', 'Week 1 Plan = one row per day with message, goal, audience and status. Video sheets = beat-by-beat breakdown with timestamps. Carousel Slides = every slide. Captions = ready-to-post copy for every day. Guideline Check = each post against your guidelines.'),
]
for a, b in lines:
    ov.append([a, b])
ov['A1'].font = Font(bold=True, size=18, color=PURPLE); ov['A2'].font = Font(italic=True, color='6B7085')
for r in range(4, ov.max_row + 1):
    ov.cell(r, 1).font = Font(bold=True, color=PURPLE); ov.cell(r, 1).alignment = WRAP; ov.cell(r, 2).alignment = WRAP
ov.column_dimensions['A'].width = 26; ov.column_dimensions['B'].width = 120

# ------------------------------------------------------------------ 2. plan
PLAN_H = ['Day', 'Format', 'Item', 'Drive link', 'Length', 'Intended message (one line)', 'Goal', 'Primary audience',
          'Hook (first seconds / first line)', 'Story or structure', 'Product features shown', 'Value for each team member',
          'Call to action', 'Why this day']
PLAN = [
    ['Day 1', 'Video (9:16)', 'Buried in Emails, version 1', LINK['v1'], '1:10',
     'Referrals don\'t get lost because people fail; they get lost because the work is spread across emails, voicemails and faxes. Tooth Referral puts it in one system.',
     'Stop the scroll with a problem every front desk knows; make the viewer feel it, then introduce Tooth Referral by name and what it is.',
     'Front desk and office managers at general dentist and specialist offices',
     'Amanda: "Hey, what happened? You look really stressed." Tanya: "We lost eight referrals this month."',
     'Problem (8 referrals lost, buried in emails) → chaos (faxes, voicemails, inbox threads) → "that\'s not on you, that\'s the old way" → Tooth Referral introduced → product on screen → free trial.',
     'Incoming referral list · referral network between offices · audit trail (who added X-rays, who changed the status) · secure messages with the general dentist on the case · administrative notes for the team · X-rays and insurance on the case.',
     'Front desk: no digging, no calling around · whole team: administrative notes instead of internal calls · referring office: answered on the case, not by phone.',
     'Spoken: "They\'re offering a free trial. Why don\'t you try it?" · end card: toothreferral.com',
     'Opens the campaign on the pain, not the product. Introduces the characters (Tanya, Amanda) used all week.'],
    ['Day 2', 'Carousel (7 slides)', 'Stop chasing insurance cards (LinkedIn carousel 3 of 3)', LINK['c1'], '7 slides',
     'One click, "Request from patient", sends a HIPAA-secure link; the patient uploads their own card and it lands on the referral.',
     'Prove Day 1 with one concrete, daily time-saver that either office can use from day one.',
     'Front desk at both offices; office managers',
     '"Can you text us a photo of your insurance card?" There\'s a better way to ask.',
     'Hook → sound familiar (photos in texts, blurry faxes, missing back side) → the feature → the patient\'s side → the card on the referral → value for everyone → close "No more insurance chaos. Just refer it."',
     'Request from patient (secure link, no patient account) · front and back of card · policy and group details · activity log (who asked, when).',
     'General dentist\'s office: refers without chasing the card · specialist: coverage on file before the consultation · patient: shares it once.',
     'Close line "Just refer it." (no contact CTA)',
     'A small, believable win right after the emotional Day 1 video.'],
    ['Day 3', 'Video (9:16)', 'Buried in Emails, version 2 (supports video 1)', LINK['v2'], '1:16',
     'Tooth Referral is a system for the team, not a form: every referral comes in as one case, so the office keeps running no matter who is out.',
     'Deepen the Day 1 story with the brand-awareness foundation Vejay approved: continuity, the whole team, and the referring office.',
     'Office managers and front desk; also the owner who wants the office to run without one key person',
     '"You\'ve been staring at that screen since lunch. What\'s going on?"',
     'Tanya can\'t tell where one referral stands (email, voicemail, fax don\'t match) → a patient called upset → "it\'s not you, half the team\'s been out" → "every referral lives in someone\'s inbox or someone\'s head" → "we replaced the form on our website with Tooth Referral" → one case → Greg can pick it up → the dentist\'s office sees the status → "the whole office just ran" → bring it to the team meeting.',
     'Website referral form replaced by Tooth Referral · one case per referral · X-rays, insurance, messages and status together · status visible to the referring office · messages on the case.',
     'Front desk: no digging through anyone\'s email · whoever covers (Greg): knows exactly where it stands · referring office: sees status itself, stops calling · owner: the office doesn\'t depend on who is working that day.',
     'Soft: "I\'m bringing this to the team meeting." · end card: toothreferral.com',
     'Mid-week return to the story; turns Day 1\'s problem into the "system for the team" idea.'],
    ['Day 4', 'Carousel (8 slides)', 'Notes that write themselves (LinkedIn carousel 2 of 3)', LINK['c2'], '8 slides',
     'Consultation and completion letters write themselves from your own templates, are routed to the doctor to e-sign, and land on the case for both offices.',
     'Show value for the doctor and the owner as well as the front desk (time saved on every case), and show it works for both general dentists and specialists.',
     'Office managers, assistants, doctors/owners at both offices',
     'How many times this month did someone retype the same consultation letter?',
     'Hook → the old way (retyped, printed, faxed) → smart variables → fully customisable templates → copy into your electronic health record → route to the doctor → signed note visible to both offices → close "Notes that write themselves. Letters that sign themselves."',
     'Note templates with smart variables · your letterhead and wording · import your existing Word/PDF letter · copy into your electronic health record · route to a doctor / sign on behalf · e-signature · signed note on the case for both offices.',
     'Assistant: drafts in seconds · doctor: signs from anywhere · referring office: gets the signed note on the case · owner: no printing, no fax.',
     'Close line (no contact CTA)',
     'Second proof point, higher value (doctor/owner time), before the Friday summary.'],
    ['Day 5', 'Single image (1080x1350)', 'Week summary image (proposed)', 'To be shared for approval', '1 image',
     'A web form sends an email and stops. Tooth Referral starts a case that the whole team, and the referring office, can work on.',
     'Close the week with one clear positioning line people can repeat; recap Days 1-4 in one glance.',
     'Everyone who saw the week; new viewers',
     'Proposed: "A web form sends an email. Tooth Referral starts a case."',
     'One headline, a simple form-vs-system comparison (email vs case, no status vs live status, phone calls vs messages on the case), brand mark.',
     'Summary only (one case, live status, messages, notes, insurance).',
     'Whole team and the referring office, in one line each.',
     '"Set up in about 5 minutes" · toothreferral.com',
     'Friday recap; strongest single-image format for the positioning line.'],
]
sheet(wb, 'Week 1 Plan', PLAN_H, PLAN, [7, 14, 24, 30, 9, 40, 36, 26, 36, 52, 44, 44, 26, 30],
      fills=lambda i: [LILAC, None, LILAC, None, GREY][i])

# ------------------------------------------------------------------ 3/4. video beats


def sents(words):
    out, cur = [], []
    for w in words:
        cur.append(w)
        if w['word'].strip()[-1:] in '.?!':
            out.append(cur); cur = []
    if cur: out.append(cur)
    return out


def mmss(t):
    return f'{int(t // 60)}:{t % 60:04.1f}'


v1 = json.load(open(os.path.join(ROOT, 'reel/src/data/transcript-s13.json')))['s13']['words']
WHO = {'A': 'Amanda', 'T': 'Tanya'}
V1_SECTION = [(0, 'Hook', 'Tanya alone at the desk; Amanda walks in.', 'Open on emotion, a moment every office knows.'),
              (2, 'The problem', 'Amber counter: "8 referrals lost this month", emails piling up.', 'Make the cost concrete and believable.'),
              (4, 'The chaos', 'Faxes, voicemails and inbox threads fly in; close-up on Tanya.', 'Name the scattered tools, not the people.'),
              (7, 'The old way', 'The chips get stamped THE OLD WAY; Tooth Referral logo on "tooth referral?".', 'Human error framing: "that\'s not on you".'),
              (13, 'The product', 'Split screen: dashboard on top, Tanya and Amanda below. Incoming list.', 'What Tooth Referral is: one system for referrals.'),
              (15, 'Network', 'The referral network between offices; analytics with volume up.', 'Why it brings more referrals.'),
              (16, 'Audit trail', 'A patient\'s case: who added the X-rays, who changed the status, when.', 'Accountability without blame.'),
              (18, 'Messages', 'Secure messages with the general dentist on the case.', 'Direct communication instead of phone tag.'),
              (21, 'Team notes', 'Administrative notes, private to the team.', 'Value for the internal team.'),
              (23, 'Everything in one place', 'X-rays and insurance on the case.', 'No calling around for patient info.'),
              (25, 'Call to action', 'Free trial; end card with the logo and toothreferral.com.', 'Low-friction next step.')]
rows = []
for i, s in enumerate(sents(v1)):
    sec = [x for x in V1_SECTION if x[0] <= i][-1]
    first = sec[0] == i
    rows.append([mmss(s[0]['start']), WHO.get(s[0].get('who'), ''), ' '.join(w['word'].strip() for w in s).replace('x -rays', 'X-rays').replace('tooth referral', 'Tooth Referral'),
                 sec[1] if first else '', sec[2] if first else '', sec[3] if first else ''])
sheet(wb, 'Video 1 · Buried v1', ['Time', 'Speaker', 'Line', 'Section', 'On screen', 'Purpose'], rows, [8, 11, 60, 18, 50, 40],
      fills=lambda i: LILAC if rows[i][3] else None)

d = json.load(open(os.path.join(ROOT, 'reel/src/data/transcript-b2.json'))); k = list(d)[0]
v2 = d[k]['words'] if isinstance(d[k], dict) else d[k]
V2_WHO = ['Amanda', 'Amanda', 'Tanya', 'Tanya', 'Tanya', 'Tanya', 'Tanya', 'Amanda', 'Amanda', 'Amanda', 'Tanya', 'Tanya', 'Tanya', 'Amanda',
          'Amanda', 'Amanda', 'Amanda', 'Amanda', 'Amanda', 'Amanda', 'Tanya / Amanda', 'Amanda', 'Tanya', 'Tanya', 'Amanda', 'Amanda', 'Amanda',
          'Amanda', 'Amanda', 'Tanya', 'Tanya', 'Amanda', 'Amanda']
V2_SECTION = [(0, 'Hook', 'Tanya at the screen since lunch; Amanda checks in.', 'Open on a relatable, low-key moment.'),
              (2, 'The problem', 'Email, voicemail and fax that don\'t match; an upset patient.', 'One referral, no single truth.'),
              (7, 'Not your fault', '"It\'s not you": the team is out, the holidays.', 'Human error, never staff fault (Vejay\'s rule).'),
              (11, 'Root cause', '"Every referral lives in someone\'s inbox or someone\'s head."', 'The real leak: work tied to people.'),
              (13, 'The old way', 'THE OLD WAY beat.', 'Mark the contrast.'),
              (14, 'Form vs system', 'Full-screen graphic: website form replaced by Tooth Referral.', 'Web form vs system, said plainly.'),
              (15, 'One case', 'Product panel: one case with X-rays, insurance, messages, status.', 'What the system is.'),
              (20, 'Anyone can pick it up', 'Greg opens it and knows where it stands.', 'Continuity when someone is out.'),
              (22, 'The referring office', 'Status visible to the dentist\'s office; messages on the case.', 'Both sides of the referral; no phone tag.'),
              (26, 'The payoff', '"It didn\'t depend on who was working that day. The whole office just ran."', 'The system-for-the-team idea, felt.'),
              (29, 'Close', 'Bringing it to the team meeting; end card.', 'Soft, internal-champion CTA.')]
rows2 = []
for i, s in enumerate(sents(v2)):
    sec = [x for x in V2_SECTION if x[0] <= i][-1]
    first = sec[0] == i
    rows2.append([mmss(s[0]['start']), V2_WHO[i] if i < len(V2_WHO) else '', ' '.join(w['word'].strip() for w in s).replace('X -rays', 'X-rays').replace('tooth referral', 'Tooth Referral'),
                  sec[1] if first else '', sec[2] if first else '', sec[3] if first else ''])
sheet(wb, 'Video 2 · Buried v2', ['Time', 'Speaker', 'Line', 'Section', 'On screen', 'Purpose'], rows2, [8, 14, 60, 20, 50, 40],
      fills=lambda i: LILAC if rows2[i][3] else None)

# ------------------------------------------------------------------ 5. carousel slides
C1 = [('1', 'Tooth Referral · Insurance', 'Stop chasing insurance cards.', 'One click sends the patient a secure link. Their card lands on the case.', 'Hook / promise'),
      ('2', 'Sound familiar?', '"Can you text us a photo of your card?"', 'Insurance chaos: photos in personal texts, blurry faxes, missing backs and patients sent home because coverage wasn\'t checked.', 'Problem recognition'),
      ('3', 'The feature', 'One click: Request from patient.', 'Either office, general or specialist, sends a HIPAA-secure link from the referral. No account needed for the patient.', 'The feature, both sides'),
      ('4', 'The patient\'s side', 'Snap the front and back. Done.', 'Patients upload their own card from their phone, securely, before the first visit.', 'Ease for the patient'),
      ('5', 'On the case', 'The card lands right on the referral.', 'Front and back, policy and group, logged with who asked and when.', 'Proof: it\'s on the case'),
      ('6', 'Value for everyone', 'Fewer calls to verify insurance.', 'General dentist\'s office, specialist and patient each gain.', 'Value per role'),
      ('7', 'Close', 'No more insurance chaos. Just refer it.', 'The patient uploads their own card through a HIPAA-secure link, and it arrives on the referral, ready to verify.', 'Brand close')]
C2 = [('1', 'Tooth Referral · Notes', 'Your consultation letter, already written.', 'Templates fill in the patient, offices, dates and X-rays for you.', 'Hook / promise'),
      ('2', 'The old way', 'The same letter, retyped for every patient.', 'Referral letters, consultation notes, completion letters. Names, dates and tooth numbers copied by hand, printed and faxed. Every single time.', 'Problem recognition'),
      ('3', 'Smart templates', 'Variables fill themselves in.', 'Build a template once. Patient, DOB, both offices, specialty, X-ray images and dates appear on every note.', 'The feature'),
      ('4', 'Fully customisable', 'Make every template your own.', 'Your wording, your letterhead and logo, one template per situation. Start from scratch or import the letter you already use.', 'Fits the practice'),
      ('5', 'Works with your records', 'Copy notes into your electronic health record.', 'Whether you refer or receive, each note is ready to paste into your own patient health record, so your charts stay in sync.', 'Works with existing systems'),
      ('6', 'Staff prepare, doctors sign', 'Route the note to the doctor.', 'An assistant drafts it from the template. The doctor signs it themselves, or a teammate signs on their behalf.', 'Value for the doctor'),
      ('7', 'Closing the loop', 'Signed, sent and visible to both offices.', 'The signed note lands on the case for both the general dentist and the specialist. No printing, no fax.', 'Both sides of the referral'),
      ('8', 'Close', 'Notes that write themselves. Letters that sign themselves.', 'Templates, smart variables, notes ready for your electronic health record and e-signatures, built in for general dentists and specialists alike.', 'Brand close')]
rows3 = [['Day 2 · Stop chasing insurance cards', *r] for r in C1] + [['Day 4 · Notes that write themselves', *r] for r in C2]
sheet(wb, 'Carousel Slides', ['Carousel', 'Slide', 'Label', 'Headline', 'Body', 'Purpose'], rows3, [30, 7, 24, 40, 70, 26],
      fills=lambda i: LILAC if i < len(C1) else None)

# ------------------------------------------------------------------ 6. captions
CAPTIONS = [
    ['Day 1', 'Buried in Emails, version 1',
     "Eight referrals were lost at one front desk this month. Nobody ignored them. They were spread across an inbox, a voicemail box and a fax tray, and by the time anyone pieced them together, the patients had waited too long.\n\n"
     "Most dental offices will recognise this. Referral work tends to stay wherever it first arrived, so the follow-up depends on someone remembering to look in the right place on the right day.\n\n"
     "Tooth Referral gives each referral one case. Your team sees every message, X-ray and status change on it, with a record of who did what and when, and the general dentist's office can message you on the same case instead of calling.\n\n"
     "Watch Tanya and Amanda work through it in the video.",
     '#DentalReferrals #DentalFrontDesk #DentalOfficeManager #DentalPracticeManagement'],
    ['Day 2', 'Carousel 1: Stop chasing insurance cards',
     "Most front desks have asked a patient to text a photo of their insurance card. What comes back is often a blurry picture without the back of the card, sent to someone's personal phone the day before the appointment.\n\n"
     "Tooth Referral has a Request from patient button on every referral. Either office, the general dentist's or the specialist's, can use it to send the patient a HIPAA-secure link. The patient photographs the front and back of the card on their phone, with no account to create, and the card arrives on the case with the policy and group numbers. The activity log shows who requested it and when.\n\n"
     "The specialist has coverage on file before the consultation, and the patient only has to share it once. Swipe through to see how it works.",
     '#DentalInsurance #DentalReferrals #DentalFrontDesk #PatientExperience'],
    ['Day 3', 'Buried in Emails, version 2',
     "When a referral lives in one person's inbox, it is only as reliable as that person's schedule. Holidays, sick days and busy weeks are when referrals stall, and the patient is usually the first to notice.\n\n"
     "In this second episode, Amanda describes how her previous office replaced the referral form on its website with Tooth Referral. Each referral arrived as one case holding the X-rays, insurance, messages and status, so whoever opened it could see where things stood. When someone was out, a colleague picked it up without searching anyone's email, and the referring dentist's office checked the status itself rather than phoning.\n\n"
     "For an office manager, that means the work keeps moving regardless of who is in that day.",
     '#DentalReferrals #DentalTeam #DentalOfficeManager #DentalPracticeManagement'],
    ['Day 4', 'Carousel 2: Notes that write themselves',
     "How many times this month did someone on your team retype the same consultation letter with a new name, date and tooth number, then print it, get it signed and fax it?\n\n"
     "Tooth Referral builds that letter from your own templates. Smart variables fill in the patient, date of birth, both offices, the specialty, dates and X-ray images. You can keep your letterhead and wording, set up a template for each situation, or import the Word or PDF letter you already use, and your team can paste the finished note into your electronic health record.\n\n"
     "An assistant can prepare the note and route it to the doctor, who signs it electronically. The signed note then appears on the case for both the general dentist and the specialist, with nothing to print or fax. The carousel walks through each step.",
     '#DentalReferrals #GeneralDentistry #DentalSpecialist #ElectronicHealthRecords'],
    ['Day 5', 'Image post: week summary',
     "A website referral form sends an email and stops there. Someone still has to find that email, call the patient, chase the X-rays and let the referring office know what happened.\n\n"
     "This week we showed what changes when each referral becomes a case: insurance cards that patients upload themselves, letters that fill in from your templates and go to the doctor to sign, and a status both offices can see without picking up the phone.\n\n"
     "Tooth Referral works for the general dentist's office that sends the referral and the specialist's office that receives it. Setup takes about five minutes.",
     '#DentalReferrals #DentalPracticeManagement #DentalFrontDesk #GeneralDentistry'],
]
sheet(wb, 'Captions', ['Day', 'Post', 'Caption', 'Hashtags'], CAPTIONS, [7, 30, 110, 48])

# ------------------------------------------------------------------ 7. guideline check
CHK = ['Problem framed as human error, never staff fault', 'One clear message', 'Both sides of the referral (general dentist + specialist)',
       '"General dentist" written out (no abbreviation)', '"Electronic health record" written out', 'No "shared inbox"', 'No red in our graphics',
       'Staff names only Tanya/Amanda/Greg/Barbara; no doctors\' names', 'No contact CTA', 'Shows the value to each team member']
GRID = {
    'Day 1 · Buried v1': ['Yes ("that\'s not on you")', 'Yes', 'Yes (messages with the general dentist)', 'Yes', 'n/a', 'Yes', 'Yes (amber)', 'Yes', 'Yes (spoken free-trial line)', 'Partly (front desk, team notes)'],
    'Day 2 · Insurance carousel': ['Yes (insurance chaos)', 'Yes (one feature)', 'Yes', 'Yes', 'n/a', 'Yes', 'Yes', 'Yes', 'Yes', 'Yes'],
    'Day 3 · Buried v2': ['Yes ("it\'s not you")', 'Yes (system for the team)', 'Yes (dentist\'s office sees status)', 'Yes', 'n/a', 'Yes', 'Yes', 'Yes', 'Yes', 'Yes'],
    'Day 4 · Notes carousel': ['Yes', 'Yes (one feature)', 'Yes', 'Yes', 'Yes', 'Yes', 'Yes', 'Yes', 'Yes', 'Yes'],
    'Day 5 · Summary image': ['Yes', 'Yes', 'Yes', 'Yes', 'n/a', 'Yes', 'Yes', 'Yes', 'Yes ("Set up in about 5 minutes")', 'Yes'],
}
rows5 = [[c, *[GRID[k][i] for k in GRID]] for i, c in enumerate(CHK)]
ws = sheet(wb, 'Guideline Check', ['Guideline (Vejay)', *GRID], rows5, [46, 30, 30, 30, 30, 30])
for row in ws.iter_rows(min_row=2, min_col=2):
    for c in row:
        v = str(c.value)
        c.fill = PatternFill('solid', fgColor=AMBER_SOFT if ('no' in v.lower().split('(')[0] and not v.startswith('Yes'))  else GREEN_SOFT)

os.makedirs(os.path.dirname(OUT), exist_ok=True)
wb.save(OUT)
print(OUT)
