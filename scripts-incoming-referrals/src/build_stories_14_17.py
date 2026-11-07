"""Four conversational story scripts (14-17) for ToothReferral -> HTML -> PDF (Chrome)."""
import html, subprocess, os

REF = '/home/user/awesome-opus-5-5-prompts/reel/public/analytics-ref/'
OUT = '/home/user/awesome-opus-5-5-prompts/scripts-incoming-referrals/Conversational-Stories-14-17.pdf'

STORIES = [
    dict(
        num=14, title='Nothing to Fill Out', tag='Patient story',
        pov="The patient's point of view: what a good referral feels like from the waiting room.",
        problem='Patients become the courier between two offices: clipboards, insurance cards read out loud, X-rays that never arrive by fax.',
        fix='Referral, X-rays and insurance arrive together, shared with both offices. The insurance card comes from the patient\'s own phone through "Request from patient".',
        length='About 80 s (10 clips of 8 s)', look='Handheld, warm morning light; one desaturated flashback; split screen for the two offices; two dashboard inserts.',
        cast=[('Bob Smith', 'Patient, early 50s, friendly, a little nervous about an implant consult'),
              ('Greg', 'Front desk, St. Andrew\'s Family Dental (the specialist office)'),
              ('Tanya', 'Front desk, Gentle Dental (the referring general dentist office)')],
        scenes=[
            ('Natural opening', '0:00', 'Parking lot. Bob sits in his car, phone on speaker, a fat folder on the passenger seat.', [
                ('Bob', 'Yeah, I just parked. ... I know, I know. I brought everything this time. Insurance card, the X-ray CD, the letter from Gentle Dental.'),
                ('Bob', '(laughs) Last time I sat there forty minutes with a clipboard. Okay. Love you. Wish me luck.')]),
            ('Walk-in', '0:12', 'Bright, calm reception. Greg looks up and smiles before Bob reaches the desk.', [
                ('Greg', 'Morning! You must be Bob. Gentle Dental sent you over for the implant consult, right?'),
                ('Bob', '(already opening the folder) That\'s me. So I\'ve got my insurance card here, and the X-rays are on this CD somewhere...'),
                ('Greg', 'You can keep those. We already have them. Front and back of your card, your group number, and the X-rays Gentle Dental took on Tuesday.')]),
            ('The surprise', '0:24', 'Close on Bob. He holds the folder like he doesn\'t know what to do with it.', [
                ('Bob', 'Wait... I didn\'t fill anything out.'),
                ('Greg', 'You did, actually. Remember the secure link we sent you on Tuesday? You took a photo of your card. Took you about thirty seconds.'),
                ('Bob', '(laughs) That was it? I thought that was a reminder.')]),
            ('The problem (flashback)', '0:34', 'Desaturated, slightly cooler. A different, busier waiting room. Bob on a clipboard; a phone call at the desk.', [
                ('Bob (VO)', 'The last time I saw a specialist, I spelled my group number out loud. Twice.'),
                ('Front desk (flashback)', '(on the phone, apologetic) We never got the X-rays... could you fax them again?'),
                ('Bob (VO)', 'The fax never showed up, so they took the X-rays again. I paid for them again.'),
                ('On screen', 'When two offices don\'t share one system, the patient carries the paperwork.')]),
            ('How it works (split screen)', '0:46', 'Left: Tanya at Gentle Dental. Right: Greg at St. Andrew\'s. Same case open on both screens.', [
                ('Tanya', 'On our side it\'s one referral. I attach the X-rays, hit send, done.'),
                ('Greg', 'And it lands here with everything. If the insurance is missing, I tap "Request from patient" and they send it from their phone.'),
                ('Insert', 'Case detail: Attachments "shared with both offices" - X-rays, Insurance cards, Request from patient. (Real recording, cs-01-case-detail.)')]),
            ('Closing the loop', '0:58', 'Checkout after the consult. Bob is relaxed now.', [
                ('Bob', 'Do I need to call my dentist and tell them how it went?'),
                ('Greg', 'Nope. They\'ll get the consult note, signed, today. When it\'s time for your crown, they\'ll already know.'),
                ('Insert', 'Sign and Send Completion Note -> "Consultation Note signed and sent successfully." (cs-07-signed-success.)')]),
            ('Button', '1:08', 'Back in the parking lot. Bob calls home again, folder untouched on the seat.', [
                ('Bob', 'Honestly? Best dental visit I\'ve had. I didn\'t even sit down in the waiting room.'),
                ('VO (female presenter)', 'When the referral, the X-rays and the insurance arrive together, your patient walks in ready. Set up in about five minutes. Check out ToothReferral.')]),
        ],
        roi='Smooth intake protects case acceptance (76% on the analytics reference) and saves the cost of repeat X-rays and re-verification. One case that doesn\'t walk out pays for the software.',
        unique='Only story told by a patient. No dashboard talk until the split screen; the value is felt before it\'s explained.',
    ),
    dict(
        num=15, title='The Sick Day', tag='Front desk story',
        pov='Two front-desk colleagues at the specialist office, the morning after one of them was out sick.',
        problem='A voicemail was left, then the person who left it was out sick. Nobody else knew a call-back was pending, so the patient waited.',
        fix='"Left a Voice Message" is a status everyone can see; Needs attention lists ghost referrals (3+ attempts) with Re-assign; the activity log shows who called and when.',
        length='About 75 s (9-10 clips of 8 s)', look='Two-shot at the front desk, natural office sound, one push-in on a sticky note; two dashboard inserts from the analytics reference.',
        cast=[('Tanya', 'Front desk, St. Andrew\'s Family Dental; back after a sick day'),
              ('Amanda', 'Office manager, St. Andrew\'s Family Dental'),
              ('Chloe Henderson', 'Patient (voice on the phone), waiting for a bone graft consult')],
        scenes=[
            ('Natural opening', '0:00', 'Morning. Tanya hangs her coat, a little pale. Amanda slides a tea across the desk.', [
                ('Amanda', 'Look who\'s back! Feeling better?'),
                ('Tanya', 'Mostly. I lived on soup and bad TV for two days. (sips) Okay. What did I miss?'),
                ('Amanda', 'Honestly, a quiet Monday.')]),
            ('The question', '0:12', 'Tanya scans her monitor. A sticky note is curled at the edge of the screen.', [
                ('Tanya', 'Did Chloe Henderson ever call back? I left her a voicemail Friday about her consult.'),
                ('Amanda', '(beat) ...I didn\'t know you\'d called her.'),
                ('Tanya', '(peels off the sticky note: "call back Henderson") Yeah. That was the plan.')]),
            ('The problem', '0:24', 'Slow push-in on the sticky note. Office ambience drops out.', [
                ('VO (female presenter)', 'Nobody did anything wrong. Tanya called, then she got sick. The follow-up only lived on a sticky note and in her head.'),
                ('On screen', 'Left a voice message. Nobody followed up.'),
                ('VO', 'And a patient who doesn\'t hear back usually books somewhere else.')]),
            ('The fix', '0:38', 'Amanda pulls her chair over. Tanya opens ToothReferral.', [
                ('Amanda', 'Okay, new rule. If you leave a voicemail, it goes in here, not on a sticky note.'),
                ('Tanya', '(sets the status) "Left a Voice Message." Done. Now it\'s on the board for everybody.'),
                ('Insert', 'Status board card "Left a Voice Message - 3" with Lily Cox, Chloe Henderson, Owen Ward and wait times. (analytics-ref/08-status-board.)')]),
            ('Coverage', '0:50', 'Amanda points at the screen.', [
                ('Amanda', 'So if you\'re out, I open this card and I know exactly who\'s waiting for a call.'),
                ('Tanya', 'And if somebody\'s been tried three times?'),
                ('Amanda', 'It shows up under Needs attention. One click, Re-assign.'),
                ('Insert', 'Needs attention: "2 ghost referrals - patients we have not reached, 3+ attempts logged - Re-assign". (analytics-ref/06-needs-staff.)')]),
            ('Payoff', '1:02', 'The phone rings. Amanda answers while Tanya watches.', [
                ('Amanda', 'St. Andrew\'s Family Dental, this is Amanda. ... Hi Chloe! Yes, Tanya left you a message Friday about your consult. I can book you right now.'),
                ('Tanya', '(mouths) Thank you.')]),
            ('Button', '1:10', 'Two-shot, both relaxed.', [
                ('VO (female presenter)', 'People get sick. People forget. The follow-up shouldn\'t. ToothReferral sets up in about five minutes.')]),
        ],
        roi='One referral that doesn\'t slip through the cracks pays for the software. Saving referrals like this one adds up to potentially about $5,000 a year.',
        unique='About coverage between colleagues (sick days, days off, lunch breaks), not about lost emails. The staff are the heroes; the sticky note is the problem.',
    ),
    dict(
        num=16, title='"Where\'s My Patient?"', tag='Referring office story',
        pov='The general dentist\'s office: the patient keeps calling them, and they have no idea what the specialist did.',
        problem='The communication black hole: the referral goes out and then silence. The patient blames their own dentist; the office spends its lunch break on hold.',
        fix='Both offices see the same case in their own dashboard: live status, Office Communication chat with @mentions, and a signed completion note sent automatically. No access codes, no portal links.',
        length='About 85 s (10-11 clips of 8 s)', look='Starts at Gentle Dental, cuts to St. Andrew\'s; split screen for the chat; hold music as a sound gag.',
        cast=[('Barbara', 'Office manager, Gentle Dental (the referring general dentist office)'),
              ('Greg', 'Front desk, Gentle Dental'),
              ('Amanda', 'Office manager, St. Andrew\'s Family Dental (the specialist office)'),
              ('Mrs. Parker', 'Patient (voice on the phone), waiting on wisdom teeth surgery')],
        scenes=[
            ('Natural opening', '0:00', 'Gentle Dental break room, lunch. Barbara and Greg with takeout.', [
                ('Greg', 'How\'s your daughter liking college?'),
                ('Barbara', 'She calls me every day about laundry. So, great.'),
                ('Greg', '(phone buzzes, he checks the desk line) And... Mrs. Parker\'s on line two. Again.')]),
            ('The problem', '0:10', 'Barbara takes the call, food abandoned.', [
                ('Barbara', 'Hi Mrs. Parker. ... Your surgery date? We sent the referral two weeks ago. ... I understand. Let me call them and get right back to you.'),
                ('Barbara', '(hangs up, to Greg) She thinks we forgot about her.')]),
            ('Old way (montage)', '0:22', 'Barbara on hold, phone wedged on her shoulder. Hold music. A clock on the wall jumps forward.', [
                ('Hold message', 'Your call is important to us. Please continue to hold.'),
                ('Barbara (VO)', 'Nine minutes on hold. Then "we\'ll check and call you back." Nobody called back.'),
                ('On screen', 'General dentists don\'t stop referring over clinical skill. They stop over silence.')]),
            ('The switch', '0:36', 'Same desk, a few weeks later. Barbara opens ToothReferral on her own screen.', [
                ('Barbara', 'Now I just look. Outgoing... Parker. "Consultation Scheduled", Thursday.'),
                ('Barbara', '(types) "@Amanda, is Mrs. Parker all set for Thursday?"'),
                ('Insert', 'Office Communication with @mention; "All communications are HIPAA compliant and encrypted". (cs-08-case-messages.)')]),
            ('Split screen', '0:48', 'Left: Barbara. Right: Amanda at St. Andrew\'s, sees the @mention and replies.', [
                ('Amanda', '(typing, reading aloud) "Yes, Thursday at 10. We already have her insurance and X-rays."'),
                ('Barbara', '(already dialing) Mrs. Parker? You\'re booked Thursday at ten. ... You\'re welcome!')]),
            ('Closing the loop', '1:00', 'A few days later. A notification on Barbara\'s screen.', [
                ('Barbara', 'And there\'s the signed consult note. "Thank you for referring Mrs. Parker..."'),
                ('Insert', 'DocuSign completion note signed inside ToothReferral; list row shows "Signed Referral". (cs-06-signed-done / cs-07-signed-success.)')]),
            ('Button', '1:10', 'Barbara turns to Greg.', [
                ('Barbara', 'Next wisdom teeth case? St. Andrew\'s. They actually talk to us.'),
                ('VO (female presenter)', 'One shared dashboard for both offices. No access codes, no portal links. Set up in about five minutes. Check out ToothReferral.')]),
        ],
        roi='Offices refer more to specialists who keep them updated. New referrals from the network are worth potentially $5,000-$10,000 a year; St. Andrew\'s Family Dental is already the top sender on the analytics reference (7 of 28).',
        unique='The only story told from the referring office\'s side. The specialist wins because the general dentist\'s staff see the value.',
    ),
    dict(
        num=17, title='First Day, No Notebook', tag='Turnover and owner story',
        pov='A new front-desk hire on day one, and the practice owner checking in that evening.',
        problem='When a coordinator leaves, nobody knows what still needs to be done: pending call-backs, consults with no note, half-verified insurance.',
        fix='Everything lives in the system, not in one person: the status board shows every patient, wait time and next step; the owner sees it all on the analytics page any time.',
        length='About 85 s (10-11 clips of 8 s)', look='Walk-and-talk tour (people moving, per the client call); dashboard screen recordings; an evening scene at home for the owner.',
        cast=[('Greg', 'New front desk hire, St. Andrew\'s Family Dental, first day'),
              ('Amanda', 'Office manager, St. Andrew\'s Family Dental'),
              ('The owner', 'The specialist who owns the practice (no name, seen from behind or in a wide shot; voice only is fine)')],
        scenes=[
            ('Natural opening', '0:00', 'Walk-and-talk through the office. Amanda hands Greg a coffee.', [
                ('Amanda', 'Break room, bathroom, and the coffee machine. Be nice to it, it has moods.'),
                ('Greg', '(laughs) Noted. So, did the last coordinator leave notes? Like a list of who needs a call back?')]),
            ('The problem', '0:10', 'Amanda stops walking. Honest beat.', [
                ('Amanda', 'When she left last year, we found three sticky notes and forty voicemails. She was great. It was all just in her head.'),
                ('Amanda', 'It took us weeks to figure out who was still waiting.'),
                ('On screen', 'A coordinator leaves, and nobody knows what still needs to be done.')]),
            ('The fix', '0:24', 'At the desk. Amanda opens ToothReferral on Greg\'s screen.', [
                ('Amanda', 'This time, your notebook is the status board.'),
                ('Insert', 'Status board: New 2, Received 1, In Progress 1, Left a Voice Message 3, Consultation Scheduled 3, Consultation Completed 4, Scheduled 4 - each with names and wait times. (analytics-ref/08-status-board.)'),
                ('Amanda', 'New: two patients waiting for a first call. Start with Ryan Bailey.')]),
            ('Day one, doing real work', '0:38', 'Greg on the phone, then updates the case.', [
                ('Greg', 'Hi Ryan, this is Greg from St. Andrew\'s Family Dental...'),
                ('Insert', 'Update Status -> toast "Success - Status updated successfully! A notification has been created." (real recording.)'),
                ('Greg', '(to Amanda) That\'s it? It even tells the referring office?'),
                ('Amanda', 'Automatically.')]),
            ('The owner (evening)', '0:52', 'Evening at home. The owner on a laptop at the kitchen table; we see the screen, not the face.', [
                ('Owner (VO)', 'I used to find out about problems months later. Now I just look.'),
                ('Insert', 'Analytics: 28 received (+27% vs prior), time to first contact 3.7 h, case acceptance 76%, Needs attention 2 / 2 / 3. (analytics-ref/01-header-kpis, 06-needs-staff.)'),
                ('Owner (VO)', 'Twenty-eight referrals this month, first contact in under four hours. And I didn\'t have to ask anyone.')]),
            ('Button', '1:06', 'Back at the office next morning. Greg already at the desk, coffee in hand, board open.', [
                ('Amanda', 'Look at you. Day two and you already know everything.'),
                ('Greg', 'It\'s all right here.'),
                ('VO (female presenter)', 'Even if your whole front desk changes tomorrow, your referrals don\'t skip a beat. And a practice that runs on a system, not on memory, is worth more when you sell. Set up in about five minutes. Check out ToothReferral.')]),
        ],
        roi='One referral missed because someone left can pay for a whole year of the software. A turnkey, data-backed referral system can raise practice value about 5-10% (about $50,000-$100,000 on a $1M practice).',
        unique='The only story about staff turnover and the owner\'s view. It shows the analytics page as the owner\'s peace of mind.',
    ),
]

E = html.escape


def story_html(s):
    cast = ''.join(f'<tr><td class="who">{E(n)}</td><td>{E(r)}</td></tr>' for n, r in s['cast'])
    scenes = []
    for i, (name, t, action, lines) in enumerate(s['scenes'], 1):
        ls = []
        for who, line in lines:
            cls = 'ins' if who in ('Insert', 'On screen') else ('vo' if 'VO' in who or 'message' in who.lower() else 'line')
            ls.append(f'<div class="{cls}"><span class="sp">{E(who)}</span><span class="tx">{E(line)}</span></div>')
        scenes.append(f'''<div class="scene"><div class="sh"><span class="sn">{i:02d}</span><span class="st">{E(name)}</span><span class="tc">{t}</span></div>
          <div class="act">{E(action)}</div>{''.join(ls)}</div>''')
    return f'''
<section class="story">
  <div class="kicker">Script {s['num']} · {E(s['tag'])}</div>
  <h1>{E(s['title'])}</h1>
  <p class="pov">{E(s['pov'])}</p>
  <div class="grid">
    <div class="box prob"><div class="bl">Everyday problem</div>{E(s['problem'])}</div>
    <div class="box fix"><div class="bl">How ToothReferral fixes it</div>{E(s['fix'])}</div>
  </div>
  <table class="meta"><tr><td class="k">Length</td><td>{E(s['length'])}</td></tr><tr><td class="k">Look</td><td>{E(s['look'])}</td></tr></table>
  <h2>Cast</h2><table class="cast">{cast}</table>
  <h2>Story</h2>
  {''.join(scenes)}
  <div class="grid end">
    <div class="box roi"><div class="bl">Why it pays (ROI line)</div>{E(s['roi'])}</div>
    <div class="box uniq"><div class="bl">What makes this one different</div>{E(s['unique'])}</div>
  </div>
</section>'''


overview = ''.join(f'<tr><td class="n">{s["num"]}</td><td><b>{E(s["title"])}</b><br><span class="mut">{E(s["tag"])}</span></td><td>{E(s["problem"])}</td></tr>' for s in STORIES)

doc = f'''<!doctype html><html><head><meta charset="utf-8"><style>
@page {{ size: Letter; margin: 0.5in 0.6in 0.6in; }}
:root {{ --p:#6D4AE8; --pl:#F1ECFE; --ink:#1B1830; --mut:#6B6880; --line:#E6E3EF; --amb:#E89D15; --ambl:#FFF4DE; --grn:#1F9D6B; --grnl:#E7F7F0; }}
* {{ box-sizing: border-box; }}
body {{ font-family: Inter, sans-serif; color: var(--ink); font-size: 9.8pt; line-height: 1.38; margin: 0; }}
.cover {{ page-break-after: always; padding-top: 0.5in; }}
.cover .brand {{ color: var(--p); font-weight: 700; letter-spacing: .08em; font-size: 10pt; text-transform: uppercase; }}
.cover h1 {{ font-size: 34pt; line-height: 1.08; margin: 14px 0 12px; letter-spacing: -.01em; }}
.cover .sub {{ font-size: 13pt; color: var(--mut); max-width: 5.6in; }}
.arc {{ display:flex; gap:10px; margin: 22px 0 18px; }}
.arc div {{ flex:1; background: var(--pl); border-radius: 10px; padding: 12px 14px; font-size: 10pt; }}
.arc b {{ display:block; color: var(--p); font-size: 9pt; text-transform: uppercase; letter-spacing:.06em; margin-bottom: 3px; }}
table {{ border-collapse: collapse; width: 100%; }}
.ov td {{ border-top: 1px solid var(--line); padding: 9px 8px; vertical-align: top; font-size: 10pt; }}
.ov td.n {{ color: var(--p); font-weight: 700; font-size: 14pt; width: 34px; }}
.mut {{ color: var(--mut); font-size: 9pt; }}
.rules {{ margin-top: 22px; font-size: 9pt; color: var(--mut); border-left: 3px solid var(--p); padding: 6px 12px; }}
.story {{ page-break-before: always; }}
.kicker {{ color: var(--p); font-weight: 700; font-size: 9pt; letter-spacing: .08em; text-transform: uppercase; }}
h1 {{ font-size: 24pt; margin: 4px 0 4px; letter-spacing: -.01em; }}
.pov {{ color: var(--mut); margin: 0 0 12px; font-size: 11pt; }}
h2 {{ font-size: 10pt; text-transform: uppercase; letter-spacing: .07em; color: var(--p); margin: 11px 0 4px; }}
.grid {{ display: flex; gap: 10px; }}
.box {{ flex: 1; border-radius: 10px; padding: 10px 12px; font-size: 10pt; }}
.box .bl {{ font-weight: 700; font-size: 8.5pt; text-transform: uppercase; letter-spacing: .06em; margin-bottom: 4px; }}
.prob {{ background: var(--ambl); }} .prob .bl {{ color: #A86B00; }}
.fix {{ background: var(--grnl); }} .fix .bl {{ color: var(--grn); }}
.roi, .uniq {{ background: var(--pl); }} .roi .bl, .uniq .bl {{ color: var(--p); }}
.end {{ margin-top: 8px; page-break-inside: avoid; }}
.meta {{ margin-top: 10px; font-size: 9.5pt; }} .meta td {{ padding: 2px 8px 2px 0; vertical-align: top; }} .meta .k {{ color: var(--mut); width: 60px; font-weight: 600; }}
.cast td {{ padding: 4px 8px 4px 0; border-top: 1px solid var(--line); font-size: 10pt; vertical-align: top; }} .cast .who {{ font-weight: 700; width: 130px; }}
.scene {{ border: 1px solid var(--line); border-radius: 10px; padding: 7px 11px 6px; margin: 6px 0; page-break-inside: avoid; }}
.sh {{ display: flex; align-items: baseline; gap: 8px; margin-bottom: 3px; }}
.sn {{ color: var(--p); font-weight: 800; font-size: 10pt; }} .st {{ font-weight: 700; flex: 1; }} .tc {{ color: var(--mut); font-size: 9pt; font-variant-numeric: tabular-nums; }}
.act {{ font-style: italic; color: var(--mut); font-size: 9.5pt; margin-bottom: 5px; }}
.line, .vo, .ins {{ display: flex; gap: 10px; padding: 2px 0; }}
.sp {{ width: 128px; flex: none; font-weight: 700; font-size: 9pt; text-transform: uppercase; letter-spacing: .03em; padding-top: 1px; }}
.vo .sp {{ color: var(--p); }}
.ins {{ background: #F7F6FB; border-radius: 6px; padding: 4px 8px; margin: 3px 0; font-size: 9.5pt; }}
.ins .sp {{ color: var(--mut); width: 120px; }}
.tx {{ flex: 1; }}
</style></head><body>
<div class="cover">
  <div class="brand">ToothReferral · Conversational story scripts</div>
  <h1>Four stories that start as a conversation and end with the fix</h1>
  <div class="sub">Scripts 14-17. Each one opens on a natural, everyday moment, turns to a real front-office problem, then shows how ToothReferral solves it. Every story uses a different problem and a different point of view.</div>
  <div class="arc"><div><b>1 · Conversation</b>A real moment between real people: coffee, small talk, a phone call.</div><div><b>2 · Problem</b>An everyday problem shown as human error, never as anyone's fault.</div><div><b>3 · Fix</b>What ToothReferral does, shown on the real product, plus one ROI line and "about five minutes to set up".</div></div>
  <table class="ov">{overview}</table>
  <div class="rules">Client rules applied: "general dentist", never "GP"; offices Gentle Dental (referring) and St. Andrew's Family Dental (specialist); staff only Barbara, Tanya, Amanda, Greg; no doctors' names; no red in our graphics; the front desk is always the hero. Dashboard numbers come from the canonical analytics reference (reel/public/analytics-ref). ROI figures are "potential" and come from the client call of Nov 5.</div>
</div>
{''.join(story_html(s) for s in STORIES)}
</body></html>'''

H = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'stories.html')
open(H, 'w').write(doc)
js = f'''const {{ chromium }} = require('playwright');
(async () => {{ const b = await chromium.launch(); const p = await b.newPage();
  await p.goto('file://{H}'); await p.evaluate(() => document.fonts.ready);
  await p.pdf({{ path: '{OUT}', format: 'Letter', printBackground: true, preferCSSPageSize: true,
    displayHeaderFooter: true, headerTemplate: '<div></div>',
    footerTemplate: '<div style="font-family:Inter;font-size:8px;color:#8a879a;width:100%;padding:0 0.65in;display:flex;justify-content:space-between"><span>ToothReferral · Conversational stories 14-17</span><span class="pageNumber"></span></div>' }});
  await b.close(); }})();'''
open('/tmp/claude-0/-home-user-awesome-opus-5-5-prompts/61ad0f1a-77a7-5e04-8546-bd1e8a80b8f4/scratchpad/stories/pdf.js', 'w').write(js)
subprocess.run(['node', '/tmp/claude-0/-home-user-awesome-opus-5-5-prompts/61ad0f1a-77a7-5e04-8546-bd1e8a80b8f4/scratchpad/stories/pdf.js'], check=True)
print(OUT)
