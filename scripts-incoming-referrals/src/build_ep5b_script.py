"""Episode 5B "The Voicemail" (variation of Episode 5) -> script (Markdown + PDF). Data section differs; layout shared.

Analytics-focused episode after Episode 4 ("Dr. Vance should see this from the owner's side." / "The numbers? That's a
whole other story."). Every number in the dialogue is on the canonical Analytics page (reel/public/analytics-ref,
data reel/src/data/analytics-demo.json) and they reconcile: 28 received (+27% vs 22), time to first contact 3.7 h,
case acceptance 76%, ghost rate 7% (2), funnel 28 -> 25 -> 20 -> 9 (3 / 5 / 11 dropped), sources Network 19 /
Embed widget 7 / Manual 2, needs attention 2 past-date appointments with no completion note / 2 ghost referrals /
3 insurance requests over 48 h. Sender names are customised for the series (Gentle Dental takes the top slot, 7)."""
import html, os, subprocess
E = html.escape
D = '/home/user/awesome-opus-5-5-prompts/scripts-incoming-referrals'
NAME = 'Episode-5B-The-Voicemail-Script'
MD, PDF = os.path.join(D, NAME + '.md'), os.path.join(D, NAME + '.pdf')
FONTS = '/home/user/awesome-opus-5-5-prompts/reel/public/fonts'

TITLE = 'Episode 5B · The Voicemail'
LOGLINE = ('Variation of Episode 5. A Monday message from Barbara at Gentle Dental ("any update on Chloe?") uncovers a small, '
           'human slip: Tanya left a voicemail Thursday, was out Friday, and nobody followed up. Nobody is blamed. Amanda opens '
           'ToothReferral Analytics and shows the team the slip was never just one patient: the status board lists every '
           'referral sitting on "left a voice message", by name and by wait time. They fix it in minutes, Barbara sees the update '
           'on the case without calling, and Dr. Vance sees why one saved case pays for the system.')
SETTING = ('Oakridge Oral Surgery front desk, Monday 8:40 AM, with a split screen to Gentle Dental (the referring general dentist\'s '
           'office). About 2:15, vertical 9:16, 17 clips of 8 seconds. Same cast and looks as Episode 4.')

CAST = [
    ('Tanya', 'Front desk coordinator, Oakridge. Left the voicemail Thursday, was out sick Friday.', 'Caught off guard → relieved → back in control.'),
    ('Greg', 'Front desk coordinator, Oakridge. Thought someone had called back.', 'Puzzled → practical.'),
    ('Amanda', 'Office manager, Oakridge. Turns a slip into a system, not a blame session.', 'Calm, kind, clear.'),
    ('Dr. Vance', 'Owner and oral surgeon. Walks in mid-way and asks the owner\'s questions.', 'Curious → convinced.'),
    ('Barbara', 'Office manager at Gentle Dental, the referring general dentist\'s office.', 'Concerned → reassured → loyal.'),
]

PROBLEMS = [
    ('Human error: "I left a voicemail" becomes the last thing anyone did.', 'Status board: "Left a Voice Message" lists every patient by name with how long they have waited (3 patients, longest 3 days 17 hours).'),
    ('Someone is out, and their follow-ups stop with them.', 'Every referral lives on the case, not in one person\'s memory: anyone on the team picks it up.'),
    ('The referring office has to call to find out what happened.', 'Barbara asks on the case (secure message) and sees the new status herself, no phone tag.'),
    ('Nobody knows how many slipped, only the one that got noticed.', 'Referral funnel: 3 of 28 never reached first contact, now visible by name.'),
    ('Slow first contact loses patients.', 'Time to first contact: 3.7 hours on average, tracked against last period.'),
    ('The owner can\'t see the team\'s follow-up without asking.', 'Analytics any time: volume, funnel, clocks, needs attention, staff responsiveness.'),
    ('"Is it worth paying for?"', 'One saved implant referral can cover the system for a year (potential, typical usage, not a guarantee).'),
    ('"Switching takes forever."', 'Set up in about 5 minutes.'),
]

CLIPS = [
    ('01', 'Gentle Dental (split screen)', 'Barbara at her desk at Gentle Dental, typing a short message.',
     'Barbara types, glances at a sticky note with a patient\'s name, presses Enter.', 'Concerned, polite.',
     [('Barbara', 'Morning! Any update on Chloe Henderson? Her mom asked me on Friday.', 'polite, a little concerned')],
     'Office Communication on Chloe\'s case: Barbara\'s message arrives at Oakridge.', 'The referring office asks'),
    ('02', 'Oakridge front desk', 'Greg reading the message; Tanya at the next workstation.',
     'Greg reads, frowns, turns his chair toward Tanya.', 'Puzzled.',
     [('Greg', 'Chloe Henderson... didn\'t we leave her a voicemail Thursday?', 'puzzled, trying to remember')],
     'None (people only).', 'Human error'),
    ('03', 'Oakridge front desk', 'Tanya, close.',
     'Tanya stops typing, closes her eyes for a second, nods.', 'Caught off guard, honest.',
     [('Tanya', 'I did. Then I was out sick Friday, and I guess nobody called her back.', 'honest, a small wince')],
     'None (people only).', 'Human error'),
    ('04', 'Oakridge front desk', 'Amanda arrives behind them with a coffee.',
     'Amanda puts a hand on the back of Tanya\'s chair, calm and kind.', 'Calm, reassuring.',
     [('Amanda', 'Nobody did anything wrong. A voicemail just isn\'t a follow-up.', 'kind, matter-of-fact')],
     'None (people only).', 'No blame'),
    ('05', 'Oakridge front desk', 'Amanda leans in to Tanya\'s monitor (screen angled away).',
     'Amanda takes the mouse, clicks twice, points.', 'Clear.',
     [('Amanda', 'Look. ToothReferral\'s status board: three patients on "left a voice message".', 'clear, calm')],
     'Analytics → Status board: "Left a Voice Message · 3", avg 2d 11h, longest 3d 17h, patients listed.', 'Seeing every slip'),
    ('06', 'Oakridge front desk', 'Greg, surprised.',
     'Greg leans closer to the screen, eyebrows up.', 'Surprised.',
     [('Greg', 'Three? I only knew about Chloe.', 'surprised')],
     'Status board rows: three names with their wait times.', 'Seeing every slip'),
    ('07', 'Oakridge front desk', 'Amanda, steady.',
     'Amanda straightens up and smiles.', 'Steady, warm.',
     [('Amanda', 'That\'s the point. The case remembers, so nobody has to.', 'warm, certain')],
     'None (people only).', 'A system, not memory'),
    ('08', 'Oakridge front desk', 'Tanya with her headset on, dialling.',
     'Tanya puts the headset on, dials, smiles as someone answers.', 'Back in control.',
     [('Tanya', 'Calling Chloe now. When she books, I\'ll update the case and Barbara will see it.', 'quick, upbeat')],
     'Chloe\'s case: status → Consultation Scheduled.', 'Anyone can pick it up'),
    ('09', 'Gentle Dental (split screen)', 'Barbara at her desk, a soft chime.',
     'Barbara reads her screen (angled away), smiles, sits back.', 'Relieved.',
     [('Barbara', 'Scheduled for Thursday. Perfect, I\'ll let her mom know.', 'relieved, warm')],
     'Barbara\'s view of the same case: "Consultation Scheduled" + Tanya\'s reply.', 'Both offices see it'),
    ('10', 'Oakridge front desk', 'Dr. Vance walks up from the hallway, tablet in hand.',
     'Dr. Vance stops behind Amanda and looks at the screen.', 'Curious.',
     [('Dr. Vance', 'Morning, team. What are we looking at?', 'friendly, curious')],
     'None (people only).', 'The owner'),
    ('11', 'Oakridge front desk', 'Amanda turns to Dr. Vance.',
     'Amanda scrolls up to the top cards.', 'Confident.',
     [('Amanda', 'Our numbers. Twenty-eight referrals this month, and we reach new ones in under four hours.', 'confident, easy')],
     'Volume received 28 (+27%) · Time to first contact 3.7 h.', 'Speed'),
    ('12', 'Oakridge front desk', 'Dr. Vance, the owner\'s question.',
     'He taps the screen edge, serious for a moment.', 'Probing.',
     [('Dr. Vance', 'And the ones that slip through the cracks?', 'probing')],
     'None (people only).', 'Leakage'),
    ('13', 'Oakridge front desk', 'Amanda points down the page.',
     'Amanda scrolls to the funnel and taps the first step.', 'Calm.',
     [('Amanda', 'Three of twenty-eight never got a first call. Now we see them by name, every morning.', 'calm, precise')],
     'Referral funnel: Received 28 → Contacted 25, "3 dropped" (amber) → Needs attention.', 'Leakage'),
    ('14', 'Oakridge front desk', 'Dr. Vance, half to himself.',
     'He nods slowly, does the maths in his head.', 'Convinced.',
     [('Dr. Vance', 'One saved implant case pays for this whole system for a year.', 'thoughtful, convinced')],
     'Small on-screen note in the edit: "One saved referral can cover a year (potential)."', 'ROI'),
    ('15', 'Oakridge front desk', 'Greg, practical.',
     'Greg points at the case on screen, then at the phone.', 'Practical, pleased.',
     [('Greg', 'And Gentle Dental doesn\'t have to call us anymore. They just check the case.', 'easy, pleased')],
     'Office Communication on the case: Barbara\'s question, Tanya\'s answer, status.', 'Direct communication'),
    ('16', 'Oakridge front desk', 'Amanda, to Dr. Vance.',
     'Amanda shrugs with a small smile.', 'Light, confident.',
     [('Amanda', 'And setting it up took about five minutes.', 'light, a little proud')],
     'None (people only).', 'Easy to start'),
    ('17', 'Gentle Dental (split screen)', 'Barbara turns to a colleague (off screen) holding a new referral slip.',
     'Barbara holds up a new referral form, smiles.', 'Loyal, warm.',
     [('Barbara', 'When an office keeps us posted like that, they\'re the first one we refer to.', 'warm, certain')],
     'End card: ToothReferral · "The case remembers, so nobody has to." · toothreferral.com', 'Relationship → referrals'),
]

NOTES = [
    'Variation of Episode 5: same analytics, different angle. Version A is the owner meeting (where referrals leak); version B '
    'starts from one human slip (a voicemail nobody followed up on) and grows into the whole team, the owner and the referring office.',
    'Follows Vejay\'s brand-awareness order: the problem as human error (never staff fault), the system that fixes it, the numbers '
    '(ROI as "potential"), and the relationship that brings more referrals. Answers what / why / how (set up in about 5 minutes).',
    'Both sides of the referral: Barbara (general dentist\'s office) asks on the case and sees the answer herself; Oakridge '
    '(specialist) fixes it. Direct communication through secure messages on the case, no phone tag.',
    'Every number is on the canonical Analytics page: status board "Left a Voice Message" 3 (avg 2d 11h, longest 3d 17h), '
    '28 received (+27%), time to first contact 3.7 h, funnel 28 → 25 (3 never contacted).',
    'Names follow Vejay\'s rules: staff are only Barbara, Tanya, Amanda and Greg; Dr. Vance is the only doctor named (series '
    'exception). Patient name Chloe Henderson is from the canonical status board.',
    'Dashboard inserts are rebuilt from the real Analytics page in 3D glass (like Episodes 2 and 4); our own highlights use amber, no red.',
    'One line per clip, each under about 7 seconds of speech.',
]

# ---------------- Markdown
md = [f'# {TITLE}', '', f'**Logline.** {LOGLINE}', '', f'**Setting.** {SETTING}', '', '## Cast', '']
md += [f'- **{n}**: {r} Arc: {a}' for n, r, a in CAST]
md += ['', '## The real problems, and how ToothReferral answers each one', '', '| Problem | What ToothReferral shows / does |', '|---|---|']
md += [f'| {p} | {s} |' for p, s in PROBLEMS]
md += ['', '## Script', '']
for no, place, onscreen, direction, emo, lines, dash, tag in CLIPS:
    md += [f'### Clip {no} · {place} · {tag}', f'*On screen:* {onscreen}  ', f'*Direction:* {direction}  ', f'*Emotion:* {emo}  ']
    md += [f'**{sp}:** "{ln}" *({how})*  ' for sp, ln, how in lines]
    md += [f'*Dashboard:* {dash}', '']
md += ['## Notes', ''] + [f'- {n}' for n in NOTES]
open(MD, 'w').write('\n'.join(md))

# ---------------- PDF
css = f'''@page {{ size: A4; margin: 16mm 15mm; }}
@font-face {{ font-family: Jakarta; src: url(file://{FONTS}/plus-jakarta-sans-latin-800-normal.woff2); font-weight: 800; }}
@font-face {{ font-family: InterW; src: url(file://{FONTS}/inter-latin-500-normal.woff2); font-weight: 500; }}
@font-face {{ font-family: InterW; src: url(file://{FONTS}/inter-latin-700-normal.woff2); font-weight: 700; }}
body {{ font-family: InterW, sans-serif; color: #16132B; font-size: 10.3pt; line-height: 1.5; }}
h1 {{ font-family: Jakarta; font-size: 28pt; letter-spacing: -.02em; margin: 2mm 0 3mm; line-height: 1.1; }}
h2 {{ font-family: Jakarta; font-size: 15pt; margin: 6mm 0 2mm; }}
.k {{ color: #6D4AE8; font-weight: 700; font-size: 9pt; letter-spacing: .12em; text-transform: uppercase; }}
.box {{ border: 1px solid #E4DBFF; border-radius: 3mm; padding: 4mm 5mm; margin: 3mm 0; background: #FBFAFF; }}
table {{ width: 100%; border-collapse: collapse; }}
td, th {{ vertical-align: top; padding: 2mm 2.4mm; border-bottom: 1px solid #ECE8FA; text-align: left; font-size: 9.3pt; }}
th {{ font-size: 8pt; letter-spacing: .1em; text-transform: uppercase; color: #6D4AE8; border-bottom: 1.5px solid #6D4AE8; }}
.clip {{ border: 1px solid #E4DBFF; border-radius: 3mm; padding: 3.5mm 4.5mm; margin: 3.2mm 0; page-break-inside: avoid; }}
.clip .h {{ display: flex; justify-content: space-between; align-items: baseline; }}
.clip .n {{ font-family: Jakarta; font-size: 13pt; }}
.tag {{ font-size: 8.5pt; font-weight: 700; color: #8A5A00; background: #FFF3D6; border-radius: 99px; padding: .6mm 2.6mm; }}
.meta {{ color: #555A70; font-size: 9.2pt; margin: 1mm 0; }}
.ln {{ font-size: 11.5pt; margin: 2mm 0 1mm; }}
.sp {{ font-weight: 700; color: #4B2BB8; }}
.how {{ color: #6B7085; font-size: 9pt; }}
.dash {{ font-size: 9pt; background: #F6F3FF; border-left: 3px solid #6D4AE8; padding: 1.6mm 3mm; border-radius: 1.5mm; margin-top: 2mm; }}
ul {{ margin: 1mm 0; padding-left: 5mm; }}'''
parts = [f'<div class="k">Tooth Referral · Episode 5B · Variation · Script</div><h1>The Voicemail</h1>',
         f'<div class="box"><b>Logline.</b> {E(LOGLINE)}<br><br><b>Setting.</b> {E(SETTING)}</div>',
         '<h2>Cast</h2><table><tr><th>Character</th><th>Who</th><th>Arc</th></tr>' +
         ''.join(f'<tr><td><b>{E(n)}</b></td><td>{E(r)}</td><td>{E(a)}</td></tr>' for n, r, a in CAST) + '</table>',
         '<h2>The real problems, and how ToothReferral answers each one</h2><table><tr><th>Problem</th><th>What ToothReferral shows / does</th></tr>' +
         ''.join(f'<tr><td>{E(p)}</td><td>{E(s)}</td></tr>' for p, s in PROBLEMS) + '</table>',
         '<h2 style="page-break-before: always">Script</h2>']
for no, place, onscreen, direction, emo, lines, dash, tag in CLIPS:
    ls = ''.join(f'<div class="ln"><span class="sp">{E(sp)}:</span> “{E(ln)}” <span class="how">({E(how)})</span></div>' for sp, ln, how in lines)
    parts.append(f'''<div class="clip"><div class="h"><span class="n">Clip {no} · {E(place)}</span><span class="tag">{E(tag)}</span></div>
<div class="meta"><b>On screen:</b> {E(onscreen)}<br><b>Direction:</b> {E(direction)} · <b>Emotion:</b> {E(emo)}</div>{ls}
<div class="dash"><b>Dashboard:</b> {E(dash)}</div></div>''')
parts.append('<h2>Notes</h2><ul>' + ''.join(f'<li>{E(n)}</li>' for n in NOTES) + '</ul>')
doc = os.path.join(D, 'src', '_ep5b.html'); js = os.path.join(D, 'src', '_ep5b.cjs')
open(doc, 'w').write(f'<html><head><meta charset="utf-8"><style>{css}</style></head><body>{"".join(parts)}</body></html>')
open(js, 'w').write(f'''const {{ chromium }} = require('playwright');
(async () => {{ const b = await chromium.launch(); const p = await b.newPage(); await p.goto('file://{doc}');
await p.evaluate(() => document.fonts.ready); await p.pdf({{ path: '{PDF}', format: 'A4', printBackground: true }}); await b.close(); }})();''')
subprocess.run(['node', js], check=True)
os.remove(doc); os.remove(js)
for no, *_, lines, dash, tag in CLIPS:
    w = sum(len(l[1].split()) for l in lines)
    print(no, w, 'words', round(w / 2.7, 1), 's')
