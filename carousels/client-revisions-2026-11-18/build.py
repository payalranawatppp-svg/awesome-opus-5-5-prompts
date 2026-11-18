"""Client revisions, 18 Nov 2026 (Vejay's notes): two LinkedIn carousels, 1080x1350.

  A  "3 tasks oral surgery practices can do more efficiently in 2026"  (oral surgeons, assistants, practice managers)
  B  "Insurance cards, without the chase"                               (endodontic front desks; works for any specialist)

Vejay asked: remove vague terms, make each slide connect to the next, say plainly who it is for, what problem it
solves and what we are asking for. Each slide ends with a "next" line that leads into the following slide.
Claims kept to what the platform does and what the user confirmed (Cloudflare spam protection, 18 Nov). Absolute
promises from the draft ("guarantees", "zero security breaches", "zero compliance risks") are rewritten as
what the product does. Brand rules: "general dentist" written out, no "EHR", no red, no doctors' names,
CTA "Set up in about 5 minutes" at toothreferral.com."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'episodes-2-4'))
import build as base
HERE = os.path.dirname(os.path.abspath(__file__))
I = lambda p: 'file://' + os.path.join(HERE, 'img', p)
base.HERE = HERE  # write outputs here
base.I = I

NEXT = lambda t: f'<div style="position:absolute;left:0;right:0;top:1040px;font-size:28px;font-weight:700;color:#6D4AE8">Next → {t}</div>'
CARD = lambda img, mt=30, w=None: f'<div class="card" style="margin-top:{mt}px{"; width:%dpx" % w if w else ""}"><img src="{I(img)}"></div>'
LIST = lambda items: ''.join(f'<div class="li"><b class="n">{i}</b><span>{t}</span></div>' for i, t in enumerate(items, 1))
CHIPS = lambda *c: '<div class="chips">' + ''.join(f'<span class="chip {k}">{t}</span>' for k, t in c) + '</div>'
WHO = lambda rows: '<div style="margin-top:20px">' + ''.join(
    f'<div class="who"{" style=\"border:none\"" if i == len(rows) - 1 else ""}><b>{a}</b><span>{b}</span></div>' for i, (a, b) in enumerate(rows)) + '</div>'

# ------------------------------------------------------------------ A. oral surgery, 3 tasks
OS = [
 f'''<div class="k">For oral surgery practices · 2026</div>
<h1>3 tasks your oral surgery team can stop doing by hand.</h1>
<div class="p">Your website or paper referral form sends one message and stops. Tooth Referral replaces it with a referral system that both your office and the referring general dentist work in.</div>
<div style="display:flex;gap:22px;margin-top:34px;align-items:flex-start"><div class="card" style="width:400px;flex:none"><img src="{I('mock.png')}"></div><div class="card" style="flex:1"><img src="{I('incoming.png')}"></div></div>
{NEXT('Task 1: case emails that get lost')}''',
 f'''<span class="day">TASK 1</span>
<h2>Stop sending case updates by email.</h2>
<div class="p">Emailed PDFs and texts to referring offices get lost in inboxes. In Tooth Referral, the referring general dentist and your team message on the same patient case, and X-rays and files are saved there for both offices.</div>
{CARD('messages.png')}
{CHIPS(('pu','Messages on the case'),('pu','Files for both offices'),('gr','No email chains'))}
{NEXT('Task 2: statuses nobody logged')}''',
 f'''<span class="day">TASK 2</span>
<h2>Know every referral's status, even when someone is out sick.</h2>
<div class="p">When a status is not entered in your practice management software (PMS), nobody knows where the patient stands. Every status change in Tooth Referral is recorded with a name and time, and the note is ready to copy into your PMS.</div>
{CARD('statuses.png', 26, 560)}
{CHIPS(('pu','Status on every referral'),('gr','Note ready to copy into your PMS'))}
{NEXT('Task 3: consultation notes')}''',
 f'''<span class="day">TASK 3</span>
<h2>Assistants prepare the note. The surgeon signs it.</h2>
<div class="p">A surgical assistant picks your template; the patient, tooth number, dates and X-rays fill in from the case. The note is routed to the oral surgeon, who signs with DocuSign, and the signed note goes to the referring office.</div>
{CARD('route.png', 26)}
<div style="display:flex;justify-content:flex-end;margin-top:-70px;position:relative">{CARD('sign.png', 0, 500)}</div>
{NEXT('what this means for your practice')}''',
 f'''<div class="k">Why switch</div>
<h2>Software your referring dentists can rely on.</h2>
<div class="p">Tooth Referral is purpose-built referral software with set rules: every referral, message, status and signed note is stored on the case, encrypted, with a record of who did what.</div>
{WHO([('Secure', 'Encrypted, HIPAA-compliant messaging and files on each case.'),
      ('Fast to start', 'Set up in about 5 minutes, with no IT project.'),
      ('Visible', 'Referring dentists see each update without calling you.')])}
<span class="cta">Set up in about 5 minutes</span>''',
]

# ------------------------------------------------------------------ B. insurance, endodontists
INS = [
 f'''<div class="k">For endodontic front desks</div>
<h1>Endodontists, put down the microscope for a second.</h1>
<div class="p">(You'll still find the MB2.) Picture being the patient: how does your office get a referred patient's dental insurance card today?</div>
<div class="photo" style="margin-top:36px;height:520px;border-radius:30px;overflow:hidden"><img src="{I('mock.png')}" style="width:100%;height:100%;object-fit:cover;object-position:0 0"></div>
{NEXT('what usually happens')}''',
 f'''<div class="k">The problem</div>
<h2>The insurance card chase.</h2>
{LIST(['Card photos sent to a staff member\'s personal phone.',
       'Blurry faxes, and the back of the card missing.',
       'Patients rescheduled because coverage was not checked in time.'])}
<div class="p" style="margin-top:40px">A static, one-way referral form does not collect the card, so your front desk has to chase it.</div>
{NEXT('one button instead of the chase')}''',
 f'''<div class="k">The solution · Tooth Referral</div>
<h2>One click sends the patient a secure link.</h2>
<div class="p">Tooth Referral is referral software that replaces your website form. On any referral, click Request from patient: the patient gets a HIPAA-compliant secure link, protected by Cloudflare spam protection.</div>
{CARD('tr-insurance.jpg', 30)}
{NEXT('what the patient does')}''',
 f'''<div class="k">The patient's side</div>
<h2>The patient photographs the card. No account needed.</h2>
<div class="p">From their phone, the patient uploads the front and back of the card. It is saved to the referral with the policy and group numbers, and the activity log shows who asked and when.</div>
{CARD('insurance.png', 30)}
{NEXT('out-of-network offices')}''',
 f'''<div class="k">Out-of-network offices</div>
<h2>Filing insurance for referred patients?</h2>
<div class="p">Out-of-network endodontic offices get the card details before the first call, without phoning the patient or the referring office. Patients know what to expect, which makes it easier to accept treatment.</div>
{CHIPS(('gr','Card on file before the consultation'),('pu','No phone calls for the card'),('pu','Logged on the case'))}
{NEXT('who else gains')}''',
 f'''<div class="k">Value for everyone</div>
<h2>Why practices replace web forms with Tooth Referral.</h2>
{WHO([('Front desk', 'No unencrypted uploads, missing backs of cards or verification calls.'),
      ('Specialist office', 'Policy, group and card images on the case before the consultation.'),
      ('General dentist', 'Refers right away, without collecting the card first.'),
      ('Patient', 'One secure upload from their phone, no account.')])}
{NEXT('how to start')}''',
 f'''<div class="k">Just refer it</div>
<h1>Replace your referral form. Stop chasing insurance cards.</h1>
<div class="p">Tooth Referral works for endodontists, oral surgeons and other specialists, and for the general dentists who refer to them.</div>
<span class="cta">Set up in about 5 minutes</span>''',
]

if __name__ == '__main__':
    base.build('carousel-A-oral-surgery-3-tasks', OS, '3 TASKS')
    base.build('carousel-B-endo-insurance', INS, 'INSURANCE')
