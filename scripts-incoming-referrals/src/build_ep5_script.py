"""Episode 5 "The Numbers" -> script (Markdown + PDF).

Analytics-focused episode after Episode 4 ("Dr. Vance should see this from the owner's side." / "The numbers? That's a
whole other story."). Every number in the dialogue is on the canonical Analytics page (reel/public/analytics-ref,
data reel/src/data/analytics-demo.json) and they reconcile: 28 received (+27% vs 22), time to first contact 3.7 h,
case acceptance 76%, ghost rate 7% (2), funnel 28 -> 25 -> 20 -> 9 (3 / 5 / 11 dropped), sources Network 19 /
Embed widget 7 / Manual 2, needs attention 2 past-date appointments with no completion note / 2 ghost referrals /
3 insurance requests over 48 h. Sender names are customised for the series (Gentle Dental takes the top slot, 7)."""
import html, os, subprocess
E = html.escape
D = '/home/user/awesome-opus-5-5-prompts/scripts-incoming-referrals'
NAME = 'Episode-5-The-Numbers-Script'
MD, PDF = os.path.join(D, NAME + '.md'), os.path.join(D, NAME + '.pdf')
FONTS = '/home/user/awesome-opus-5-5-prompts/reel/public/fonts'

TITLE = 'Episode 5 · The Numbers'
LOGLINE = ('Dr. Vance thinks his referrals are fine because the schedule is full. Amanda opens ToothReferral Analytics and shows '
           'him what a full schedule hides: referrals that leak between "received" and "completed", a loyal referring office that '
           'has gone quiet because it never hears back, patients nobody can reach, and insurance checks stuck for days. By the end '
           'of the meeting they have fixed every item on the list, and Dr. Vance knows exactly which call to make.')
SETTING = ('Oakridge Oral Surgery. Monday, 8:05 AM, before the first patient: Dr. Vance\'s private office (monthly owner '
           'meeting), then the front desk. About 2:15, vertical 9:16, 17 clips of 8 seconds. Same cast and looks as Episode 4.')

CAST = [
    ('Dr. Vance', 'Owner and oral surgeon, Oakridge Oral Surgery. Smart, busy, runs on instinct and lunch-and-learns.',
     'Comfortable → surprised → uneasy → focused → decisive.'),
    ('Amanda', 'Office manager / treatment coordinator. Calm, prepared, lets the numbers do the talking.',
     'Prepared, steady, quietly confident.'),
    ('Tanya', 'Front desk coordinator. Fast, organised, owns the follow-ups.', 'Matter-of-fact, relieved.'),
    ('Greg', 'Front desk coordinator. Handles scheduling and insurance.', 'Easy-going, practical.'),
    ('Lakeside front desk (voice only)', 'The referring general dentist\'s office that has gone quiet. Heard on the phone, never named or shown.', 'Warm, a little surprised.'),
]

# The real problems this episode puts on screen, and the Analytics section that answers each one.
PROBLEMS = [
    ('"The schedule is full, so referrals must be fine."', 'Volume received + Referral funnel: 28 received, only 9 completed (32% conversion).'),
    ('Referrals leak between steps and nobody sees where.', 'Funnel shows each drop: 3 never contacted, 5 never scheduled, 11 scheduled with no completion recorded.'),
    ('Patients are seen, but the referring dentist never hears back, so they quietly stop sending.', 'Needs attention: scheduled appointments past date with no completion note → Mark complete (2). Status board shows whose cases are waiting.'),
    ('You only find out a referrer has gone quiet months later.', 'Top senders, with a click-through to what each office sent this period.'),
    ('Slow first calls lose patients to the next practice.', 'Time to first contact: 3.7 hours, tracked every day against the prior period.'),
    ('Patients who never answer sit in limbo.', 'Ghost referrals (3+ attempts logged): 2, ghost rate 7% → Re-assign, or tell the referring office.'),
    ('Insurance verifications stall and push the appointment back.', 'Insurance requests outstanding over 48 h: 3 → Send reminder.'),
    ('No idea where referrals actually come from.', 'Referral sources: Network 19, website request form (Embed widget) 7, Manual 2.'),
    ('Owner reports built by hand in a spreadsheet.', 'Export PDF, same report every month.'),
]

# (no, place, on screen, direction, emotion, [(speaker, line, delivery)], dashboard insert, problem tag)
CLIPS = [
    ('01', 'Dr. Vance\'s office', 'Dr. Vance at his desk, coffee, a printed schedule; Amanda in the chair opposite with a laptop.',
     'Dr. Vance taps the printed schedule, relaxed and sure of himself.', 'Comfortable, confident.',
     [('Dr. Vance', 'Schedule\'s full, phones are ringing. Our referrals are fine, right?', 'easy, confident')],
     'None (people only).', 'The assumption'),
    ('02', 'Dr. Vance\'s office', 'Amanda turns the laptop toward him.',
     'Amanda smiles, opens the laptop and turns it to face him.', 'Calm, prepared.',
     [('Amanda', 'Busy isn\'t the same as fine. Let me show you ToothReferral\'s Analytics.', 'calm, friendly, a little knowing')],
     'Analytics header: Received tab, Last 30 days, KPI cards.', 'The assumption'),
    ('03', 'Dr. Vance\'s office', 'Close on Amanda, laptop between them.',
     'Amanda points to the first card, then lower down the page.', 'Steady.',
     [('Amanda', 'Twenty-eight referrals this month, up twenty-seven percent. But only nine are completed.', 'even, letting it land')],
     'Volume received 28 (+27% vs 22) → scroll to the Referral funnel: 28 → 25 → 20 → 9.', 'Volume vs outcome'),
    ('04', 'Dr. Vance\'s office', 'Dr. Vance leans in toward the screen.',
     'He puts the schedule down and leans forward, frowning.', 'Surprised, uneasy.',
     [('Dr. Vance', 'Nine? Then where did the other nineteen go?', 'surprised, quieter')],
     'Funnel with the drop between each step highlighted.', 'Leakage'),
    ('05', 'Dr. Vance\'s office', 'Amanda traces the funnel with her pen (screen angled away).',
     'Amanda counts the three steps on the screen with her pen.', 'Matter-of-fact.',
     [('Amanda', 'Three never got a call, five never booked, and eleven were scheduled with no completion recorded.', 'clear, unhurried')],
     'Funnel: "3 dropped · 11% leak", "5 dropped · 20% leak", "11 dropped · 55% leak" (shown in amber).', 'Leakage'),
    ('06', 'Front desk (cutaway)', 'Greg at the front desk, phone in hand, looking at a sticky note.',
     'Greg hangs up the desk phone, sighs, and pulls a sticky note off the monitor.', 'Frustrated, honest.',
     [('Greg', 'Before, we found out a referral was lost when the dentist called asking about it.', 'honest, a little rueful')],
     'None (people only).', 'Finding out too late'),
    ('07', 'Dr. Vance\'s office', 'Two-shot, Amanda turned to Dr. Vance.',
     'Amanda opens the Needs attention panel and turns back to him.', 'Serious, calm.',
     [('Amanda', 'Most of those patients were seen. The notes just never went back. To the dentist, that\'s silence.', 'serious, quiet')],
     'Needs attention: "Scheduled appointments past date with no completion note · 2" with Mark complete.', 'Closing the loop'),
    ('08', 'Dr. Vance\'s office', 'Close on Dr. Vance.',
     'He sits back, rubs his beard, the penny dropping.', 'Realisation.',
     [('Dr. Vance', 'And a dentist who hears silence starts sending patients somewhere else.', 'slow, realising')],
     'None (people only).', 'Why referrers go quiet'),
    ('09', 'Dr. Vance\'s office', 'Amanda scrolls up to Top senders.',
     'Amanda scrolls, stops, and points at the bottom of a list.', 'Calm.',
     [('Amanda', 'Gentle Dental sent seven. Lakeside only sent three, and two are still waiting on a note from us.', 'calm, precise')],
     'Top senders: Gentle Dental 7, Bright Smile 6, Maple Grove 5, Riverside 4, Lakeside 3, Summit 3 → click Lakeside → its cases on the Status board.', 'Silent decline'),
    ('10', 'Dr. Vance\'s office', 'Dr. Vance, half to himself.',
     'He shakes his head slowly, looking at the screen.', 'Uneasy, a little guilty.',
     [('Dr. Vance', 'Lakeside used to send us one a week. I thought it was the economy.', 'quiet, rueful')],
     'Lakeside\'s two cases, both "Scheduled · past date".', 'Silent decline'),
    ('11', 'Dr. Vance\'s office', 'Amanda, encouraging.',
     'Amanda clicks once; two rows flip to Completed.', 'Steady, a small smile.',
     [('Amanda', 'Tanya already signed those notes. One click, and Lakeside has both on the case.', 'reassuring')],
     'Mark complete → the signed completion notes attach to the case for both offices (Episode 4 flow, short).', 'Closing the loop'),
    ('12', 'Front desk', 'Tanya at her workstation, headset on.',
     'Tanya looks at a short list on her screen (angled away), taps twice.', 'Practical, relieved.',
     [('Tanya', 'These two patients never pick up. Three tries each. Now I reassign them, or tell the dentist.', 'practical, quick')],
     'Needs attention: Ghost referrals (3+ attempts logged) · 2 → Re-assign. Ghost rate 7%.', 'Unreachable patients'),
    ('13', 'Front desk', 'Greg at the next workstation.',
     'Greg clicks once and gives a small nod.', 'Easy, satisfied.',
     [('Greg', 'Three insurance checks were stuck over two days. One click sends the reminder.', 'easy, matter-of-fact')],
     'Needs attention: Insurance requests outstanding > 48 h · 3 → Send reminder.', 'Insurance delays'),
    ('14', 'Dr. Vance\'s office', 'Amanda back with Dr. Vance.',
     'Amanda scrolls to the clocks and the sources chart.', 'Quietly proud.',
     [('Amanda', 'We call new referrals within four hours now. And seven came straight from our website.', 'quietly proud')],
     'Time to first contact 3.7 h (vs prior) → Referral sources: Network 19, Embed widget 7, Manual 2.', 'Speed + where referrals come from'),
    ('15', 'Dr. Vance\'s office', 'Dr. Vance, decisive.',
     'He pushes the printed schedule aside and picks up his phone.', 'Focused, decisive.',
     [('Dr. Vance', 'So I don\'t need another lunch-and-learn. I need to call Lakeside.', 'decisive, a small smile')],
     'None (people only).', 'Owner decision'),
    ('16', 'Dr. Vance\'s office', 'Dr. Vance on the phone; Amanda smiling in the background.',
     'He dials, waits a beat, then smiles as she answers.', 'Warm, sincere.',
     [('Dr. Vance', 'It\'s Dr. Vance at Oakridge. Both notes are on the case. What else can we do?', 'warm, sincere'),
      ('Lakeside front desk (phone, off screen)', 'Honestly? Just this.', 'warm, surprised')],
     'None (people only). Edit: Lakeside\'s front desk is a voice on the phone, not shown or named.', 'Rebuilding the relationship'),
    ('17', 'Dr. Vance\'s office', 'Amanda closes the laptop, turns slightly toward camera.',
     'Amanda clicks Export PDF, closes the laptop and smiles.', 'Satisfied.',
     [('Amanda', 'Referrals don\'t disappear. They leak. Now we can see exactly where.', 'calm, satisfied')],
     'Export PDF → end card: ToothReferral · "See every referral, and every leak." · Next episode teaser.', 'The takeaway'),
]

NOTES = [
    'One line per clip, all under about 6.5 seconds of speech, so each fits one 8-second Flow clip.',
    'Every number spoken is on the canonical Analytics page and they add up: 28 received; 3 + 5 + 11 = 19 lost between steps; '
    '9 completed; 2 past-date appointments, 2 ghost referrals, 3 insurance requests; 3.7 h to first contact; 7 from the website form.',
    'Top senders keep the canonical counts (7, 6, 5, 4, 3, 3); names are customised for the series so Gentle Dental (Barbara\'s '
    'office) is the top sender and Lakeside Family Dentistry is the one that has gone quiet.',
    'Names follow Vejay\'s rules: staff are only Barbara, Tanya, Amanda and Greg, and Dr. Vance is the only doctor named (series exception). '
    'Say "general dentist", never the abbreviation.',
    'The front desk is never the problem: the leaks come from things nobody could see. Tanya and Greg fix their items in one click.',
    'Dashboard inserts are rebuilt from the real Analytics page (3D glass, like Episodes 2 and 4). Funnel leak rows are shown '
    'in amber in our graphics (no red).',
    'Monitors and laptops stay angled away in Flow; all screens go in during the edit.',
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
parts = [f'<div class="k">Tooth Referral · Episode 5 · Script</div><h1>The Numbers</h1>',
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
doc = os.path.join(D, 'src', '_ep5.html'); js = os.path.join(D, 'src', '_ep5.cjs')
open(doc, 'w').write(f'<html><head><meta charset="utf-8"><style>{css}</style></head><body>{"".join(parts)}</body></html>')
open(js, 'w').write(f'''const {{ chromium }} = require('playwright');
(async () => {{ const b = await chromium.launch(); const p = await b.newPage(); await p.goto('file://{doc}');
await p.evaluate(() => document.fonts.ready); await p.pdf({{ path: '{PDF}', format: 'A4', printBackground: true }}); await b.close(); }})();''')
subprocess.run(['node', js], check=True)
os.remove(doc); os.remove(js)
for no, *_, lines, dash, tag in CLIPS:
    w = sum(len(l[1].split()) for l in lines)
    print(no, w, 'words', round(w / 2.7, 1), 's')
