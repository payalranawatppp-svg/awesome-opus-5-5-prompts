"""Script 19: "Day in the Life of an Endodontic Start-up", three variations (script only, no prompts) -> PDF."""
import html, os, subprocess
E = html.escape
OUT = '/home/user/awesome-opus-5-5-prompts/scripts-incoming-referrals/Script-19-Day-in-the-Life-Endo-Startup.pdf'

V = [
 dict(t='"Day One" — the founder\'s vlog', angle='The owner\'s point of view: a selfie-style diary of opening day, the website decision, and the moment the referral system pays off.',
  who='The founder (an endodontist opening a solo practice; never named, filmed selfie-style), Tanya (front desk, first hire), Greg (front desk at Gentle Dental, on the phone)', length='About 2 minutes (310 spoken words); trim the 9:30 am scene for a 90 s cut', lines=[
  ('SCENE', '6:45 am. Empty parking lot, coffee in hand, keys to a brand-new office.'),
  ('Founder', 'Day one. Fourteen years of school, a bank loan I try not to think about, and a building that smells like fresh paint.'),
  ('Founder', '(walking in, flipping on lights) Two operatories, a microscope, a CBCT. What I don\'t have yet... is patients.'),
  ('SCENE', '9:30 am. Founder at a laptop in the private office, a website template on screen.'),
  ('Founder', 'So, the website. My designer sent this template. Home page, our services, and... a referral form.'),
  ('Founder', '(reading) Doctor\'s name, patient name, Social Security number? (beat) I don\'t want anyone typing that into a website.'),
  ('Founder', 'And when they hit submit, where does it go? An email. To an inbox I\'ll check between patients. Maybe.'),
  ('Founder', 'Here\'s the thing nobody tells you when you open a practice: your referrals ARE your business. And I was about to run them through a contact form.'),
  ('SCENE', '11:00 am. Founder on a video call, scrolling through the Tooth Referral form builder.'),
  ('Founder', 'So I looked at referral software instead. This one, Tooth Referral, gives me a form that sits on my own website, with my logo, my office, the insurance I take, even what I\'m known for.'),
  ('Founder', 'It\'s HIPAA compliant and encrypted. The referring office picks the procedure, taps the tooth, attaches X-rays, and can send the patient a secure link to upload their insurance. Three steps.'),
  ('Founder', 'And it\'s not the end of the road. Every referral turns into a case my team can see, track and answer.'),
  ('SCENE', '2:00 pm. Founder at the front desk with Tanya, the form now live on the site.'),
  ('Tanya', 'It\'s live. And I just sent invites to the five offices on your list.'),
  ('Founder', 'Gentle Dental was my old practice. If anyone sends us a patient first, it\'s them.'),
  ('SCENE', '4:10 pm. A notification chime. Tanya turns her screen.'),
  ('Tanya', 'Speak of the devil. New referral, Gentle Dental. Root canal, tooth nineteen. X-rays are attached, and the patient already uploaded her insurance.'),
  ('Founder', '(quietly) Our first patient.'),
  ('Tanya', 'I\'ll call her now. And Greg will see the status change on his side, so nobody has to call anybody to ask.'),
  ('SCENE', '6:30 pm. Empty office, lights going off. Founder to camera.'),
  ('Founder', 'One referral. But it came in complete, it\'s tracked, and the office that sent it knows exactly where it stands. That\'s how you start a practice.'),
 ], close='Starting a practice is hard. Losing referrals shouldn\'t be part of it. Tooth Referral sets up in about five minutes.'),

 dict(t='"The Front Desk Before the Front Desk" — the first hire', angle='The first employee\'s point of view: setting up the office systems in launch week, and why she pushes back on a plain web form.',
  who='Tanya (front desk, hired two weeks before opening), the founder (owner; never named), Amanda (office manager friend at another specialist practice, on speakerphone)', length='About 1:45 (258 spoken words)', lines=[
  ('SCENE', 'Monday of launch week. Tanya unpacks a box of pens at an empty front desk. The phone has never rung.'),
  ('Tanya', '(to camera) When you\'re the first hire, you\'re also IT, marketing and the person who figures out the phones.'),
  ('SCENE', 'Founder walks up with a laptop.'),
  ('Founder', 'Website\'s almost ready. Can you check the referral form before it goes live?'),
  ('Tanya', '(scrolling) Okay... it emails us. Who gets the email?'),
  ('Founder', 'The info inbox, I guess.'),
  ('Tanya', 'The one we\'re also using for supply orders, CE ads and voicemail transcripts?'),
  ('Founder', '(beat) ...Yeah.'),
  ('SCENE', 'Tanya calls a friend on speakerphone.'),
  ('Amanda', '(speaker) Don\'t do it. At my last office the form went to a shared inbox. We\'d find referrals three days later. The general dentists stopped sending to us, and nobody ever told us why.'),
  ('Tanya', 'So what do you use now?'),
  ('Amanda', '(speaker) Tooth Referral. Every referral comes in as a case: X-rays, insurance, the tooth, all of it. I see a status, the referring office sees the same status, and we message right on the case.'),
  ('SCENE', 'Afternoon. Tanya and the founder set up the Tooth Referral form together.'),
  ('Tanya', 'It puts our logo and our hours on the form. We can list the insurance we accept, and the things we\'re known for. Nitrous, same-week emergencies, Spanish spoken.'),
  ('Founder', 'And it\'s secure?'),
  ('Tanya', 'HIPAA compliant and encrypted. No Social Security numbers, no faxes. And if a patient\'s insurance is missing, I send them a secure link and they upload the card themselves.'),
  ('Founder', 'What happens when I\'m in surgery and you\'re at lunch?'),
  ('Tanya', 'It\'s all on the status board. Whoever\'s at the desk sees who\'s new, who needs a call back, who\'s scheduled. Nothing lives on a sticky note.'),
  ('SCENE', 'Friday. The office is open. A referral arrives; Tanya books the consultation in two minutes.'),
  ('Tanya', '(to camera) Week one: six referrals, all complete, all booked. And the phone? It finally rings. But it\'s patients, not offices asking where their patient went.'),
 ], close='Your first hire shouldn\'t have to babysit an inbox. Tooth Referral gives the whole team one place for every referral.'),

 dict(t='"Will They Send Us Patients?" — the first month, from both sides', angle='The relationship angle: a new specialist needs general dentists to trust them; the story follows one referring office deciding whether to send a second case.',
  who='The founder (owner; never named), Barbara (office manager at Gentle Dental, the referring office), Greg (front desk at Gentle Dental), Tanya (front desk at the start-up)', length='About 1:25 (208 spoken words)', lines=[
  ('SCENE', 'Week one. The founder walks into Gentle Dental with a box of pastries.'),
  ('Founder', 'Hi Barbara. I just opened the endo practice down the street. I\'d love to take care of your patients.'),
  ('Barbara', '(polite, a little tired) We hear that a lot. Honestly, our problem with specialists isn\'t the dentistry. It\'s that we send a patient and never hear back.'),
  ('Greg', '(from the desk) Then the patient calls us asking when their appointment is.'),
  ('Founder', 'That\'s exactly why I didn\'t put a normal referral form on my website.'),
  ('SCENE', 'Back at the start-up, that afternoon. The founder shows Tanya the Tooth Referral form on the website.'),
  ('Founder', 'When Gentle Dental refers, it doesn\'t go to an inbox. It becomes a case they can see too.'),
  ('Tanya', 'And they don\'t need a login or a portal password. If they already use Tooth Referral, their details fill themselves in.'),
  ('SCENE', 'Week two. Gentle Dental. Greg refers the first patient through the start-up\'s website form.'),
  ('Greg', '(typing) Tooth nineteen... X-rays attached... and I\'ll send the patient the insurance link. Done.'),
  ('SCENE', 'Later that day, a message pops up on Greg\'s screen.'),
  ('Tanya', '(V.O., reading her message) Hi Greg, thank you for the referral. We\'ve scheduled her consultation for Thursday at ten.'),
  ('Greg', '(to Barbara) They already booked her. Same day.'),
  ('SCENE', 'Week three. Barbara opens the case on her own screen.'),
  ('Barbara', 'Consultation completed, treatment done Tuesday, and the signed note is right here. I didn\'t call once.'),
  ('SCENE', 'Week four. The start-up\'s analytics on the founder\'s laptop.'),
  ('Founder', '(to camera) Month one. Every referral, who sent it, how fast we called. Gentle Dental sent us four more.'),
  ('SCENE', 'Gentle Dental. Barbara hands Greg a new chart.'),
  ('Barbara', 'Root canal on twenty-nine. Send it to the new endo office.'),
  ('Greg', 'The one that actually talks to us?'),
  ('Barbara', '(smiling) That one.'),
 ], close='General dentists don\'t leave specialists over clinical skill. They leave over silence. Tooth Referral keeps both offices on the same case.'),
]

body = []
for i, v in enumerate(V):
    ls = ''.join(f'<div class="l{" sc" if s == "SCENE" else ""}"><span class="s">{E(s)}</span><span class="x">{E(x)}</span></div>' for s, x in v['lines'])
    body.append(f'''<section{' class="pb"' if i else ''}><div class="k">Script 19 · Variation {"ABC"[i]} · Day in the Life of an Endodontic Start-up</div><h1>{E(v["t"])}</h1>
<div class="a">{E(v["angle"])}</div><div class="m"><b>Cast:</b> {E(v["who"])}<br><b>Length:</b> {E(v["length"])}</div>{ls}
<div class="l c"><span class="s">Closing VO</span><span class="x">{E(v["close"])}</span></div></section>''')

notes = '''<div class="n"><b>Notes for all three.</b> Product claims are only what the live Tooth Referral form and toothreferral.com show: HIPAA compliant and encrypted; the practice's own logo, locations, insurance accepted and "What we are known for"; procedure list, tooth chart, X-ray uploads; a secure link for the patient to upload insurance; no login for referring offices (existing users autofill with an office PIN); every referral becomes a tracked case with status, messages and a signed completion note; analytics. Client rules: no doctors' names (the founder is never named), staff only Barbara, Tanya, Amanda and Greg, "general dentist" never "GP", and the front desk is never the joke.</div>'''

doc = f'''<!doctype html><html><head><meta charset="utf-8"><style>
@page {{ size: Letter; margin: 0.6in 0.7in; }}
body {{ font-family: Inter, sans-serif; color: #1B1830; font-size: 10.6pt; line-height: 1.45; margin: 0; }}
.pb {{ page-break-before: always; }}
.k {{ color: #6D4AE8; font-weight: 700; font-size: 8.5pt; letter-spacing: .07em; text-transform: uppercase; }}
h1 {{ font-size: 21pt; margin: 4px 0 6px; }}
.a {{ font-size: 11pt; color: #3a3552; margin-bottom: 6px; }}
.m {{ color: #6B6880; font-size: 9.5pt; margin-bottom: 12px; }}
.l {{ display: flex; gap: 14px; padding: 4px 0; border-bottom: 1px solid #EEEBF5; page-break-inside: avoid; }}
.s {{ width: 92px; flex: none; font-weight: 800; font-size: 9pt; text-transform: uppercase; letter-spacing: .03em; padding-top: 2px; }}
.x {{ flex: 1; }}
.sc .s {{ color: #A0A0B0; }} .sc .x {{ font-style: italic; color: #6B6880; }}
.c {{ margin-top: 10px; background: #F1ECFE; border-radius: 8px; padding: 8px 10px; border: none; }} .c .s {{ color: #6D4AE8; }}
.n {{ margin-top: 14px; font-size: 9pt; color: #6B6880; border-left: 3px solid #6D4AE8; padding: 6px 10px; }}
</style></head><body>{''.join(body)}{notes}</body></html>'''
D = '/tmp/claude-0/-home-user-awesome-opus-5-5-prompts/61ad0f1a-77a7-5e04-8546-bd1e8a80b8f4/scratchpad/stories'
H = os.path.join(D, 's19.html'); open(H, 'w').write(doc)
js = f'''const {{ chromium }} = require('playwright');
(async () => {{ const b = await chromium.launch(); const p = await b.newPage(); await p.goto('file://{H}'); await p.evaluate(() => document.fonts.ready);
await p.pdf({{ path: '{OUT}', format: 'Letter', printBackground: true, preferCSSPageSize: true }}); await b.close(); }})();'''
open(os.path.join(D, 's19.cjs'), 'w').write(js)
subprocess.run(['node', os.path.join(D, 's19.cjs')], check=True)
for v in V: print(v['t'], sum(len(x.split()) for s, x in v['lines'] if s != 'SCENE'), 'spoken words')
