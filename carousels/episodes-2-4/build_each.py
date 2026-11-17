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

EP2 = [
 f'''<span class="day">EPISODE 2</span><span class="ep">PHONE TAG</span>
<h1>Two offices. One X-ray. A morning of voicemails.</h1>
<div class="p">The specialist needs a patient's newest X-ray before a 10:00 consult. Here's how it usually goes.</div>
{PHOTO('tanya-phone.jpg', 600, '40% 30%', -1.5)}''',
 f'''<div class="k">The real problem</div>
<h2>Phone tag isn't anyone's fault.</h2>
{LIST(['You call the general dentist\'s office. They\'re with a patient. <b>Voicemail.</b>',
       'They call back while you\'re checking someone out. <b>Missed call.</b>',
       'By the time you connect, the consult is in an hour, and nobody has the X-ray.'])}
<div class="p" style="margin-top:44px">Both front desks did everything right. The phone is just the wrong tool for a question about one patient.</div>''',
 f'''<div class="k">The fix</div>
<h2>Ask on the case, not on the phone.</h2>
<div class="p">Amanda @mentions Barbara on the patient's case. Barbara answers in the same thread and drops the X-ray in. It saves to the case for both offices.</div>
<div style="display:flex; justify-content:center">{CARD('chat-ortiz.png', 26, 540)}</div>
{CHIPS(('pu', '@mention the other office'), ('pu', 'Reply in the thread'), ('gr', 'Saved to the case'))}''',
 f'''<div class="k">It works both ways</div>
<h2>Either office can ask. Either office can answer.</h2>
<div class="p">Here the specialist's office asks the general dentist's front desk for newer X-rays, and gets them in two minutes.</div>
{CARD('messages.png', 32)}
<div class="note">Secure messages on the case: no voicemail, no email chains, no "did you get my fax?"</div>''',
 f'''<div class="k">What changes</div>
<h2>Fewer calls, on both sides of the referral.</h2>
{WHO([('Specialist front desk', 'One message instead of a morning of call-backs.'),
      ('General dentist\'s office', 'Answers when it suits them, in one place, with the file attached.'),
      ('The doctor', 'Walks in with the X-ray already on the case.'),
      ('The patient', 'Never hears "we\'re still waiting on your X-rays".')])}''',
 f'''<div class="k">Tooth Referral</div>
<h1>Stop calling. Start collaborating.</h1>
<div class="p">Every question, answer and file lives on the patient's case, where both offices can see it.</div>
{PHOTO('barbara.jpg', 470, '30% 35%')}
<span class="cta">Set up in about 5 minutes</span>''',
]

EP3 = [
 f'''<span class="day">EPISODE 3</span><span class="ep">TANYA'S DAY OFF</span>
<h1>Tanya's out sick. Greg's been here three weeks.</h1>
<div class="p">A patient calls: "Somebody called me yesterday. I've been waiting all morning." Greg didn't call him.</div>
{PHOTO('greg.jpg', 600, '55% 30%', 1.5)}''',
 f'''<div class="k">The real problem</div>
<h2>When someone's out, their follow-ups go with them.</h2>
{LIST(['Tanya left the patient a voicemail at 4:10 and meant to call back.',
       'The details are <b>on a sticky note and in her head</b>.',
       'Greg is covering alone, and the patient is getting frustrated.'])}
<div class="p" style="margin-top:44px">Nobody dropped the ball. The work just lived with one person instead of on the referral.</div>''',
 f'''<div class="k">Step 1</div>
<h2>Every call gets a status.</h2>
<div class="p">Left a voicemail. Callback requested. Unable to contact. One tap after every call, so the next person never starts from zero.</div>
<div style="display:flex; justify-content:center">{CARD('statuses.png', 30, 600)}</div>''',
 f'''<div class="k">Step 2</div>
<h2>Greg sees exactly where Tanya left off.</h2>
<div class="p">Every call, status change and note is on the case, with a name and a time. He books the patient in one call.</div>
{CARD('activity.png', 32)}
{CHIPS(('pu', 'Who did what, and when'), ('pu', 'Next-step reminders'))}''',
 f'''<div class="k">Step 3</div>
<h2>The referring office already knows.</h2>
<div class="p">Every status change shows up for the general dentist's office too. They saw "scheduled" before Greg hung up.</div>
{CARD('incoming.png', 32)}
{CHIPS(('gr', 'Live status for both offices'), ('pu', 'One list'))}''',
 f'''<div class="k">Bonus</div>
<h2>Missing insurance? Send the patient a link.</h2>
<div class="p">"Request from patient" sends a secure link. The card lands on the case, and a notification tells whoever is on shift.</div>
{CARD('insurance.png', 32)}''',
 f'''<div class="k">Tooth Referral</div>
<h1>Whoever opens it knows where it stands.</h1>
<div class="p">The work lives on the case, not in someone's head. So a sick day is just a day off.</div>
{PHOTO('team.jpg', 470, '50% 40%')}
<span class="cta">Set up in about 5 minutes</span>''',
]

EP4 = [
 f'''<span class="day">EPISODE 4</span><span class="ep">FRONT ROW</span>
<h1>4:17 PM. Three letters. A recital at 5:30.</h1>
<div class="p">Tanya promised her daughter a front-row seat. Three finished cases still need completion letters.</div>
{PHOTO('tanya-photo.jpg', 600, '45% 35%', -1.5)}''',
 f'''<div class="k">The real problem</div>
<h2>Completion letters eat the end of the day.</h2>
{LIST(['Open Word and <b>retype</b> the patient, tooth and referring office.',
       'Print it, find the doctor, get a signature, <b>scan it, fax it</b>.',
       'The referring office waits days to hear how their patient did.'])}
<div class="p" style="margin-top:44px">Last spring, it cost Tanya the first half of the recital.</div>''',
 f'''<div class="k">Step 1</div>
<h2>Start from your own letter template.</h2>
<div class="p">Import the letters your office already uses. Pick one, and Tooth Referral does the typing.</div>
{CARD('template.png', 32)}''',
 f'''<div class="k">Step 2</div>
<h2>It fills itself in.</h2>
<div class="p">Patient, date of birth, tooth number, referring office and X-rays come straight from the case. Add your final note.</div>
{CARD('letter.png', 32)}
{CHIPS(('gr', 'Patient info'), ('gr', 'Tooth #'), ('gr', 'Referring office'), ('gr', 'X-rays'))}''',
 f'''<div class="k">Step 3</div>
<h2>Route it to the doctor to sign.</h2>
<div class="p">No hunting down the doctor. The letter goes to their tablet, and they sign with a finger between patients.</div>
{CARD('route.png', 30)}
<div style="display:flex; justify-content:flex-end; margin-top:-60px; position:relative">{CARD('sign.png', 0, 520)}</div>''',
 f'''<div class="k">Step 4</div>
<h2>Signed, shared and in your system.</h2>
<div class="p">The signed letter lands on the case for both offices. One click copies it into your practice management software.</div>
<div style="display:flex; justify-content:center">{CARD('doc.png', 32, 760)}</div>
{CHIPS(('gr', 'Both offices see it'), ('pu', 'Copy to PMS'), ('am', 'No scanning, printing or faxing'))}''',
 f'''<div class="k">Tooth Referral</div>
<h1>Close the loop on time. Everybody wins.</h1>
<div class="p">Three letters done by 4:38. Tanya made the front row, with time to park.</div>
{PHOTO('tanya-amanda.jpg', 450, '50% 38%')}
<span class="cta">Set up in about 5 minutes</span>''',
]

if __name__ == '__main__':
    build('carousel-ep2-phone-tag', EP2, 'EPISODE 2')
    build('carousel-ep3-tanyas-day-off', EP3, 'EPISODE 3')
    build('carousel-ep4-front-row', EP4, 'EPISODE 4')
