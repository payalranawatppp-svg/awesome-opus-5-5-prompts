"""One carousel per episode (1080x1350, 6-7 slides each), same look and rules as build.py (Vejay's guidelines):
one message per carousel, problem as human error (never staff fault), both sides of the referral, staff only
Tanya/Greg/Amanda/Barbara, no doctors' names (screens rendered with anon=true, Episode 2 chat cropped before Dr. Vance
is mentioned), "general dentist" written out, no "shared inbox", no red in our graphics, CTA "Set up in about 5 minutes",
every conversation slide its own conversation.
  Episode 2 · Phone Tag         -> carousel-ep2-phone-tag.pdf
  Episode 3 · Tanya's Day Off   -> carousel-ep3-tanyas-day-off.pdf
  Episode 4 · Front Row         -> carousel-ep4-front-row.pdf"""
from build import build, I

LIST = lambda items: ''.join(f'<div class="li"><b class="n">{i}</b><span>{t}</span></div>' for i, t in enumerate(items, 1))
WHO = lambda rows: '<div style="margin-top:26px">' + ''.join(
    f'<div class="who"{" style=\"border:none\"" if i == len(rows) - 1 else ""}><b>{a}</b><span>{b}</span></div>' for i, (a, b) in enumerate(rows)) + '</div>'
PHOTO = lambda img, h=640, pos='50% 30%', rot=0: f'<div class="photo" style="margin-top:40px; height:{h}px; transform: rotate({rot}deg)"><img src="{I(img)}" style="object-position:{pos}"></div>'
CARD = lambda img, mt=32, w=None: f'<div class="card" style="margin-top:{mt}px{"; width:%dpx" % w if w else ""}"><img src="{I(img)}"></div>'
CHIPS = lambda *c: '<div class="chips">' + ''.join(f'<span class="chip {k}">{t}</span>' for k, t in c) + '</div>'

CHECK = '<svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>'
SUMMARY = lambda title, rows: (f'<div style="margin-top:44px; padding:34px 38px; border-radius:30px; background:#fff; border:1.5px solid rgba(109,74,232,.18); box-shadow:0 30px 70px rgba(40,20,110,.16)">'
    f'<div style="font-family:Jakarta; font-size:30px; color:#6D4AE8; letter-spacing:.08em; text-transform:uppercase; margin-bottom:10px">{title}</div>'
    + ''.join(f'<div style="display:flex; gap:22px; align-items:center; padding:22px 0;{" border-top:1.5px solid rgba(109,74,232,.12);" if i else ""}">'
              f'<div style="width:58px; height:58px; border-radius:18px; background:#6D4AE8; display:flex; align-items:center; justify-content:center; flex:none">{CHECK}</div>'
              f'<div style="font-size:33px; line-height:1.3"><b>{a}</b><br><span style="color:#5a5472; font-size:28px">{b}</span></div></div>' for i, (a, b) in enumerate(rows))
    + '</div>')

EP2 = [
 f'''<span class="day">EPISODE 2</span><span class="ep">PHONE TAG</span>
<h1>Replace phone tag with direct communication.</h1>
<div class="p">A specialist needs a patient's latest X-ray before a 10:00 consultation. Here is how the request usually travels, and how it should.</div>
{PHOTO('tanya-phone.jpg', 540, '40% 30%', -1.5)}''',
 f'''<div class="k">The challenge</div>
<h2>Phone tag is a process problem, not a people problem.</h2>
{LIST(['You call the general dentist\'s office. They\'re with a patient. <b>Voicemail.</b>',
       'They call back while you\'re checking someone out. <b>Missed call.</b>',
       'By the time you connect, the consult is in an hour, and nobody has the X-ray.'])}
<div class="p" style="margin-top:44px">Both front desks did everything right. The phone is just the wrong tool for a question about one patient.</div>''',
 f'''<div class="k">The solution</div>
<h2>Ask and answer on the patient's case.</h2>
<div class="p">Amanda @mentions Barbara on the patient's case. Barbara answers in the same thread and drops the X-ray in. It saves to the case for both offices.</div>
<div style="display:flex; justify-content:center">{CARD('chat-ortiz.png', 26, 540)}</div>
{CHIPS(('pu', '@mention the other office'), ('pu', 'Reply in the thread'), ('gr', 'Saved to the case'))}''',
 f'''<div class="k">Two-way communication</div>
<h2>Referring and receiving offices, in one secure thread.</h2>
<div class="p">Here the specialist's office asks the general dentist's front desk for newer X-rays, and gets them in two minutes.</div>
{CARD('messages.png', 32)}
<div class="note">Secure messages on the case: no voicemail, no email chains, no "did you get my fax?"</div>''',
 f'''<div class="k">The outcome</div>
<h2>Fewer calls and faster answers for both offices.</h2>
{WHO([('Specialist front desk', 'One message instead of a morning of call-backs.'),
      ('General dentist\'s office', 'Answers when it suits them, in one place, with the file attached.'),
      ('The doctor', 'Walks in with the X-ray already on the case.'),
      ('The patient', 'Never hears "we\'re still waiting on your X-rays".')])}''',
 f'''<div class="k">Tooth Referral</div>
<h1>Direct, secure communication on every referral.</h1>
{SUMMARY('What your team gets', [('Secure messages and @mentions', 'On each patient\'s case, for both offices.'), ('Files saved to the case', 'X-rays and documents, available to everyone involved.'), ('A complete record', 'Every question and answer, with names and times.')])}
<span class="cta">Set up in about 5 minutes</span>''',
]

EP3 = [
 f'''<span class="day">EPISODE 3</span><span class="ep">TANYA'S DAY OFF</span>
<h1>Referral follow-up that doesn't depend on who is in the office.</h1>
<div class="p">Tanya is out sick. Greg, three weeks into the job, takes a call from a patient Tanya contacted yesterday.</div>
{PHOTO('greg.jpg', 520, '55% 30%', 1.5)}''',
 f'''<div class="k">The challenge</div>
<h2>Follow-ups kept in one person's memory are at risk.</h2>
{LIST(['Tanya left the patient a voicemail at 4:10 and meant to call back.',
       'The details are <b>on a sticky note and in her head</b>.',
       'Greg is covering alone, and the patient is getting frustrated.'])}
<div class="p" style="margin-top:44px">Nobody dropped the ball. The work just lived with one person instead of on the referral.</div>''',
 f'''<div class="k">Step 1</div>
<h2>Every patient contact is recorded with a status.</h2>
<div class="p">Left a voicemail. Callback requested. Unable to contact. One tap after every call, so the next person never starts from zero.</div>
<div style="display:flex; justify-content:center">{CARD('statuses.png', 30, 600)}</div>''',
 f'''<div class="k">Step 2</div>
<h2>A complete activity history on every referral.</h2>
<div class="p">Every call, status change and note is on the case, with a name and a time. He books the patient in one call.</div>
{CARD('activity.png', 32)}
{CHIPS(('pu', 'Who did what, and when'), ('pu', 'Next-step reminders'))}''',
 f'''<div class="k">Step 3</div>
<h2>Referring offices see status updates in real time.</h2>
<div class="p">Every status change shows up for the general dentist's office too. They saw "scheduled" before Greg hung up.</div>
{CARD('incoming.png', 32)}
{CHIPS(('gr', 'Live status for both offices'), ('pu', 'One list'))}''',
 f'''<div class="k">Step 4</div>
<h2>Request insurance details with a secure patient link.</h2>
<div class="p">"Request from patient" sends a secure link. The card lands on the case, and a notification tells whoever is on shift.</div>
{CARD('insurance.png', 32)}''',
 f'''<div class="k">Tooth Referral</div>
<h1>Every referral documented, and ready for anyone on your team.</h1>
{SUMMARY('What your team gets', [('Contact statuses and reminders', 'Every call recorded; nothing waits on memory.'), ('Full activity history', 'Who did what, and when, on every case.'), ('Automatic updates', 'The referring office sees each status change.')])}
<span class="cta">Set up in about 5 minutes</span>''',
]

EP4 = [
 f'''<span class="day">EPISODE 4</span><span class="ep">FRONT ROW</span>
<h1>Close every referral with a signed letter, the same day.</h1>
<div class="p">4:17 PM. Three finished cases still need completion letters, and the team wants to leave on time.</div>
{PHOTO('tanya-photo.jpg', 520, '45% 35%', -1.5)}''',
 f'''<div class="k">The challenge</div>
<h2>Manual completion letters delay your team and the referring office.</h2>
{LIST(['Open Word and <b>retype</b> the patient, tooth and referring office.',
       'Print it, find the doctor, get a signature, <b>scan it, fax it</b>.',
       'The referring office waits days to hear how their patient did.'])}
<div class="p" style="margin-top:44px">The result: late evenings for the team, and a referring office left waiting.</div>''',
 f'''<div class="k">Step 1</div>
<h2>Begin with your practice's own letter templates.</h2>
<div class="p">Import the letters your office already uses. Pick one, and Tooth Referral does the typing.</div>
{CARD('template.png', 32)}''',
 f'''<div class="k">Step 2</div>
<h2>Patient and case details fill in automatically.</h2>
<div class="p">Patient, date of birth, tooth number, referring office and X-rays come straight from the case. Add your final note.</div>
{CARD('letter.png', 32)}
{CHIPS(('gr', 'Patient info'), ('gr', 'Tooth #'), ('gr', 'Referring office'), ('gr', 'X-rays'))}''',
 f'''<div class="k">Step 3</div>
<h2>Route the letter to the doctor for e-signature.</h2>
<div class="p">No hunting down the doctor. The letter goes to their tablet, and they sign with a finger between patients.</div>
{CARD('route.png', 30)}
<div style="display:flex; justify-content:flex-end; margin-top:-60px; position:relative">{CARD('sign.png', 0, 520)}</div>''',
 f'''<div class="k">Step 4</div>
<h2>Shared with both offices and copied to your practice software.</h2>
<div class="p">The signed letter lands on the case for both offices. One click copies it into your practice management software.</div>
<div style="display:flex; justify-content:center">{CARD('doc.png', 32, 760)}</div>
{CHIPS(('gr', 'Both offices see it'), ('pu', 'Copy to PMS'), ('am', 'No scanning, printing or faxing'))}''',
 f'''<div class="k">Tooth Referral</div>
<h1>Complete referrals, signed and shared before the end of the day.</h1>
{SUMMARY('What your team gets', [('Your own templates', 'Letters fill in from the case, with no retyping.'), ('E-signature routing', 'The doctor signs from a tablet, between patients.'), ('Shared and exported', 'On the case for both offices; one click to your practice software.')])}
<span class="cta">Set up in about 5 minutes</span>''',
]

if __name__ == '__main__':
    build('carousel-ep2-phone-tag', EP2, 'EPISODE 2')
    build('carousel-ep3-tanyas-day-off', EP3, 'EPISODE 3')
    build('carousel-ep4-front-row', EP4, 'EPISODE 4')
