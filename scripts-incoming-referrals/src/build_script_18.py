"""Script 18: five conversational variations (dialogue only) -> PDF."""
import html, subprocess, os
E = html.escape
OUT = '/home/user/awesome-opus-5-5-prompts/scripts-incoming-referrals/Script-18-Five-Conversations.pdf'

V = [
 dict(t='The Insurance That Wasn\'t There', set="St. Andrew's Family Dental, front desk, Monday morning.", who='Amanda (office manager), Greg (front desk)', lines=[
  ('Greg', 'Good weekend?'),
  ('Amanda', 'My son had three soccer games. I\'m more tired than he is.'),
  ('Greg', 'Okay, so... bad news. Mr. Lopez is here for his 9:30 implant consult, and we can\'t verify his insurance.'),
  ('Amanda', 'Didn\'t Gentle Dental send it?'),
  ('Greg', 'They emailed a photo of the front of the card. It\'s blurry, and there\'s no back. I emailed them Thursday, they forwarded my email to the patient, and the patient replied to... someone. Not us.'),
  ('Amanda', 'So three offices, four emails, and no card.'),
  ('Greg', 'And now he\'s in the waiting room, and I either reschedule him or he pays and hopes it gets sorted out.'),
  ('Amanda', 'This is exactly why we\'re moving everything into Tooth Referral. Here, look. When a referral comes in, the insurance has its own place on the case. Front, back, policy and group number.'),
  ('Greg', 'And if it\'s missing?'),
  ('Amanda', 'You tap "Request from patient". He gets a secure link and takes a photo of both sides from his phone. It lands right on his case, and Gentle Dental sees it too, because it\'s shared with both offices.'),
  ('Greg', 'So nobody\'s forwarding anything.'),
  ('Amanda', 'Nobody. And if a request sits there more than two days, Tooth Referral puts it under Needs Attention with a "Send reminder" button. We\'d have caught this on Friday, not at 9:30 on Monday.'),
  ('Greg', 'Okay. Let me send Mr. Lopez the link right now. He\'s literally sitting right there.'),
  ('Amanda', '(smiling) Best kind of patient. Thirty seconds, and he\'s done.'),
 ], close='Insurance verified before the patient walks in, not while he waits. Tooth Referral sets up in about five minutes.'),

 dict(t='Two Calls, Two Times', set="St. Andrew's Family Dental, front desk, after lunch.", who='Tanya (front desk), Greg (front desk)', lines=[
  ('Tanya', 'How was the new taco place?'),
  ('Greg', 'Great. Too great. I need a nap.'),
  ('Tanya', '(on hold, covering the phone) Hey... did you call Mrs. Chen this morning?'),
  ('Greg', 'Yeah, I booked her consult for Thursday at two.'),
  ('Tanya', 'I called her at eleven and booked her for Wednesday at ten. She\'s on the phone right now asking which one is real.'),
  ('Greg', 'Oh no. Her referral came in twice, one by email from Gentle Dental and one by fax. I had the email, you had the fax.'),
  ('Tanya', 'So she thinks we have no idea what we\'re doing. And honestly, today she\'s not wrong.'),
  ('Greg', 'It\'s not you or me. We just had two copies of the same patient and no way to see each other\'s calls.'),
  ('Tanya', 'In Tooth Referral that can\'t happen, right?'),
  ('Greg', 'Right. Every patient is one case. Gentle Dental sends it once, through the network, and it lands in one list. When I set the status to "Consultation Scheduled", you see it immediately.'),
  ('Tanya', 'And I can see who changed it?'),
  ('Greg', 'The activity log shows who did what and exactly when. And if we need to sort something out, we @mention each other on the case, or leave an administrative note that only our office sees.'),
  ('Tanya', 'So I\'d have opened her case, seen "Scheduled, Thursday at two, by Greg", and not called her at all.'),
  ('Greg', 'Exactly. One patient, one case, one appointment.'),
  ('Tanya', '(back to the phone) Mrs. Chen? So sorry about that. You\'re confirmed for Thursday at two. And you won\'t get a second call, I promise.'),
 ], close='One patient, one case, one source of truth for the whole team. Tooth Referral sets up in about five minutes.'),

 dict(t='Tooth Twenty-Six or Twenty-Seven?', set="St. Andrew's Family Dental, a desk by the treatment rooms, and Gentle Dental's front desk.", who="Amanda (St. Andrew's office manager), Barbara (Gentle Dental office manager)", lines=[
  ('Amanda', '(to herself) Okay... the referral says implant restoration on tooth twenty-six. But the X-ray they attached is tooth twenty-seven.'),
  ('Amanda', '(on the phone) Hi, this is Amanda from St. Andrew\'s, I need to confirm a tooth number on a referral... Sure, I\'ll hold.'),
  ('Barbara', '(at Gentle Dental, on another line) Can I call you back? We\'re slammed this morning.'),
  ('Amanda', '(after a while, to the camera) Day two. Two voicemails, one callback that came while I was at lunch, and the patient\'s surgery is Friday. The surgeon won\'t start without knowing which tooth.'),
  ('Barbara', '(later, to a colleague) I called them back twice. Nobody picked up.'),
  ('Amanda', 'So we did the obvious thing. We moved our referrals to Tooth Referral.'),
  ('Barbara', 'Now when a referral comes in, the requested treatment and the tooth numbers are right on the case, next to the X-rays. Both offices see the same thing.'),
  ('Amanda', 'And if something doesn\'t match, I don\'t call. I write it on the case: "@Barbara, the referral says twenty-six, the X-ray shows twenty-seven. Which one?"'),
  ('Barbara', 'I see the @mention as soon as I\'m back at my desk. I check with our dentist, reply right in the thread, and if the X-ray is wrong, I add the right one.'),
  ('Amanda', 'And the activity log shows exactly who added which X-ray and when. So on Friday the surgeon looks at one case and knows it\'s confirmed.'),
  ('Barbara', 'Two minutes, in writing, no phone tag. And it\'s HIPAA compliant and encrypted, so I\'m not texting X-rays from my phone.'),
  ('Amanda', 'Same patient, same Friday surgery. Just without the two days of voicemails.'),
 ], close='Clinical questions answered in writing, on the case, by both offices. Tooth Referral sets up in about five minutes.'),

 dict(t='The Website Lead Nobody Saw', set="St. Andrew's Family Dental, the office manager's desk.", who='Amanda (office manager), Tanya (front desk)', lines=[
  ('Tanya', 'Did you see the new coffee machine? It talks to you.'),
  ('Amanda', 'I know. It told me I looked tired.'),
  ('Tanya', 'So, weird thing. A patient called today, a little upset. She filled out our website contact form two weeks ago for wisdom teeth and nobody ever called her.'),
  ('Amanda', 'Two weeks? Where did it go?'),
  ('Tanya', 'The form sends an email to the old info@ inbox. The one we only check... when we remember.'),
  ('Amanda', 'And she didn\'t have insurance, right? She asked about payment plans?'),
  ('Tanya', 'Yes. So she went to another office that answered the same day.'),
  ('Amanda', 'Okay. That form is basically a digital fax machine. Let\'s replace it with the Tooth Referral lead form.'),
  ('Tanya', 'What\'s different about it?'),
  ('Amanda', 'It sits on our website, but every submission comes straight into our Tooth Referral dashboard, not an inbox. It shows up in our list like a referral, so somebody sees it that day.'),
  ('Tanya', 'And patients with insurance?'),
  ('Amanda', 'There\'s a "Submit Insurance" button, so they send their insurance securely and we can verify it before they come in. And a "No Insurance" button that opens our membership plans, so patients like her see their options right away.'),
  ('Tanya', 'And the "Book now" link?'),
  ('Amanda', 'We can add our own buttons too. And in analytics, we\'ll see exactly how many patients came from the website, next to the ones from our network.'),
  ('Tanya', 'So the website stops being a brochure and starts bringing in patients.'),
  ('Amanda', 'Exactly. And no more checking the info@ inbox.'),
 ], close='Your website becomes a lead source that lands in the same dashboard as your referrals. Tooth Referral sets up in about five minutes.'),

 dict(t='Treatment Done, Nobody Knows', set="Gentle Dental's front desk, then St. Andrew's Family Dental.", who="Barbara (Gentle Dental office manager), Greg (St. Andrew's front desk)", lines=[
  ('Barbara', '(to a patient on the phone) Mr. Hayes, I know, I\'d want my crown too. Let me find out.'),
  ('Barbara', '(hangs up, to the camera) His implant was placed three weeks ago at St. Andrew\'s. We can\'t book the crown until we get their note saying he\'s healed and ready. We never got one.'),
  ('Greg', '(at St. Andrew\'s, digging through a stack of papers) Hayes... the note\'s here. It was printed and waiting for a signature. Then the doctor was out, and it went in the "to fax" pile.'),
  ('Greg', 'Nobody forgot him. The note just sat in the pile between printing and faxing.'),
  ('Barbara', 'And meanwhile my patient thinks we lost him.'),
  ('Greg', 'So here\'s how it works now, in Tooth Referral. When the consult is done, I set the status to "Consultation Completed" and the consultation note opens with our template.'),
  ('Greg', 'It fills in the patient\'s name, date of birth, the completion date and the referring office for me. I check it, and it gets signed with DocuSign right inside Tooth Referral. No printing, no scanning, no fax.'),
  ('Barbara', 'And on my side, the case shows "Signed Referral" and the signed note is right there. I book the crown the same day.'),
  ('Greg', 'And if an appointment passes and there\'s still no note, analytics flags it under Needs Attention: "scheduled appointment past date, no completion note". One click, and it\'s on someone\'s list.'),
  ('Barbara', 'So the loop closes on its own.'),
  ('Greg', 'And honestly, that\'s why offices keep sending us patients. We close the loop.'),
  ('Barbara', '(on the phone) Mr. Hayes? Good news. We have the note. Let\'s book your crown.'),
 ], close='When treatment is done, the general dentist knows the same day. Tooth Referral sets up in about five minutes.'),
]

body = []
for i, v in enumerate(V):
    lines = ''.join(f'<div class="l"><span class="s">{E(s)}</span><span class="x">{E(x)}</span></div>' for s, x in v['lines'])
    body.append(f'''<section{' class="pb"' if i else ''}><div class="k">Script 18 · Variation {"ABCDE"[i]}</div><h1>{E(v["t"])}</h1>
<div class="m">{E(v["set"])} · {E(v["who"])}</div>{lines}
<div class="l c"><span class="s">Closing VO</span><span class="x">{E(v["close"])}</span></div></section>''')

doc = f'''<!doctype html><html><head><meta charset="utf-8"><style>
@page {{ size: Letter; margin: 0.7in 0.75in; }}
body {{ font-family: Inter, sans-serif; color: #1B1830; font-size: 11pt; line-height: 1.5; margin: 0; }}
.pb {{ page-break-before: always; }}
.k {{ color: #6D4AE8; font-weight: 700; font-size: 9pt; letter-spacing: .08em; text-transform: uppercase; }}
h1 {{ font-size: 22pt; margin: 4px 0 4px; }}
.m {{ color: #6B6880; font-size: 10pt; margin-bottom: 16px; font-style: italic; }}
.l {{ display: flex; gap: 14px; padding: 5px 0; border-bottom: 1px solid #EEEBF5; page-break-inside: avoid; }}
.s {{ width: 90px; flex: none; font-weight: 800; font-size: 9.5pt; text-transform: uppercase; letter-spacing: .03em; padding-top: 2px; }}
.x {{ flex: 1; }}
.c {{ margin-top: 10px; background: #F1ECFE; border-radius: 8px; padding: 8px 10px; border: none; }}
.c .s {{ color: #6D4AE8; }}
</style></head><body>{''.join(body)}</body></html>'''
D = os.path.dirname(os.path.abspath(__file__)); H = os.path.join(D, 's18.html'); open(H, 'w').write(doc)
js = f'''const {{ chromium }} = require('playwright');
(async () => {{ const b = await chromium.launch(); const p = await b.newPage();
  await p.goto('file://{H}'); await p.evaluate(() => document.fonts.ready);
  await p.pdf({{ path: '{OUT}', format: 'Letter', printBackground: true, preferCSSPageSize: true }}); await b.close(); }})();'''
open(os.path.join(D, 's18.js'), 'w').write(js)
subprocess.run(['node', os.path.join(D, 's18.js')], check=True)
for v in V: print(v['t'], sum(len(x.split()) for _, x in v['lines']), 'words')
