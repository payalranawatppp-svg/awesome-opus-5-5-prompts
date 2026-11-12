"""Three single-feature brand-awareness carousels (1080x1350), each built on 3D dashboard graphics recreated in the
app's own style (from the platform recordings, VIDEO-INDEX.md) with approved demo names only:

  A  Direct messages on the case      (Office Communication + @mentions)
  B  Notes that write themselves      (templates + smart variables, copy into your electronic health record, e-sign, signed note back)
  C  The patient sends their insurance (Request from patient -> secure link -> on the case)

Look and words follow toothreferral.com: purple #6D3DF0 / #8A63F7 on near-black #0B0B14 and soft lavender,
"HIPAA-secure", "end the phone tag", "win back your front desk's hours". No doctors' names, no "GP", no red in our
graphics, no "shared inbox", no contact page. Output: slides PNG, one PDF per post (caption + slides), slides-only PDFs,
and an overflow/spacing check on every slide."""
import os, subprocess, json, html
HERE = os.path.dirname(os.path.abspath(__file__))
FONTS = '/home/user/awesome-opus-5-5-prompts/reel/public/fonts'
LOGO = 'file:///home/user/awesome-opus-5-5-prompts/reel/public/tr/logo.png'
E = html.escape

CSS = f'''
@font-face {{ font-family: Jakarta; src: url(file://{FONTS}/plus-jakarta-sans-latin-800-normal.woff2); font-weight: 800; }}
@font-face {{ font-family: Jakarta; src: url(file://{FONTS}/plus-jakarta-sans-latin-700-normal.woff2); font-weight: 700; }}
@font-face {{ font-family: InterW; src: url(file://{FONTS}/inter-latin-500-normal.woff2); font-weight: 500; }}
@font-face {{ font-family: InterW; src: url(file://{FONTS}/inter-latin-700-normal.woff2); font-weight: 700; }}
* {{ box-sizing: border-box; margin: 0; padding: 0; }}
:root {{ --p: #6D3DF0; --p2: #8A63F7; --p3: #B9A4FF; --ink: #16132B; --mut: #6B7085; --soft: #F3EEFE; --line: #E7E3F7; --gr: #1F9D6B; --am: #E89D15; --dk: #0B0B14; }}
body {{ width: 1080px; height: 1350px; overflow: hidden; position: relative; font-family: InterW, sans-serif; color: var(--ink);
  background: radial-gradient(1100px 700px at 85% 10%, #EDE6FF 0%, rgba(237,230,255,0) 60%), linear-gradient(170deg, #FBFAFF 0%, #F1ECFF 70%, #E9E1FF 100%); }}
body.dark {{ color: #fff; background: radial-gradient(900px 640px at 80% 18%, rgba(109,61,240,0.55) 0%, rgba(109,61,240,0) 62%), radial-gradient(700px 520px at 10% 95%, rgba(138,99,247,0.35) 0%, rgba(138,99,247,0) 60%), #0B0B14; }}
.grid {{ position: absolute; inset: 0; background-image: linear-gradient(rgba(109,61,240,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(109,61,240,0.06) 1px, transparent 1px); background-size: 54px 54px; mask-image: linear-gradient(180deg, transparent, #000 30%, #000 70%, transparent); }}
.dark .grid {{ background-image: linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px); }}
.top {{ position: absolute; top: 58px; left: 76px; right: 76px; display: flex; justify-content: space-between; align-items: center; z-index: 5; }}
.top img {{ height: 60px; }}
.dark .top img {{ filter: brightness(0) invert(1); }}
.tag {{ font: 700 22px InterW; letter-spacing: .14em; color: var(--p); }}
.dark .tag {{ color: var(--p3); }}
.txt {{ position: absolute; left: 76px; right: 76px; top: 168px; z-index: 4; }}
.k {{ font: 700 25px InterW; letter-spacing: .16em; text-transform: uppercase; color: var(--p); }}
.dark .k {{ color: var(--p3); }}
h1 {{ font: 800 84px/1.03 Jakarta; letter-spacing: -.035em; margin-top: 16px; }}
h2 {{ font: 800 64px/1.06 Jakarta; letter-spacing: -.03em; margin-top: 14px; }}
.p {{ font: 500 31px/1.42 InterW; color: #4A4563; margin-top: 22px; max-width: 900px; }}
.dark .p {{ color: #CFC6F5; }}
.hl {{ color: var(--p); }} .dark .hl {{ color: var(--p3); }}
.foot {{ position: absolute; bottom: 50px; left: 76px; right: 76px; display: flex; justify-content: space-between; align-items: center; font: 700 22px InterW; color: var(--p); z-index: 5; }}
.dark .foot {{ color: var(--p3); }}
.dots {{ display: flex; gap: 8px; }} .dots i {{ width: 10px; height: 10px; border-radius: 10px; background: rgba(109,61,240,.22); }} .dots i.on {{ width: 30px; background: var(--p); }}
.dark .dots i {{ background: rgba(255,255,255,.2); }} .dark .dots i.on {{ background: var(--p3); }}
.stage {{ position: absolute; left: 0; right: 0; perspective: 2200px; z-index: 3; }}
.d3 {{ position: absolute; transform-style: preserve-3d; }}
.card {{ background: #fff; border-radius: 26px; border: 1px solid var(--line); box-shadow: 0 2px 0 rgba(255,255,255,.8) inset, 0 50px 90px -30px rgba(40,20,110,.45), 0 18px 40px -20px rgba(40,20,110,.35); overflow: hidden; color: var(--ink); }}
.ch {{ display: flex; align-items: center; gap: 14px; padding: 22px 26px; border-bottom: 1px solid #EEEAF8; }}
.ch b {{ font: 800 27px Jakarta; letter-spacing: -.01em; }}
.ch small {{ display: block; font: 500 19px InterW; color: var(--mut); margin-top: 2px; }}
.ico {{ width: 44px; height: 44px; border-radius: 12px; background: var(--soft); display: flex; align-items: center; justify-content: center; flex: none; }}
.pill {{ display: inline-flex; align-items: center; gap: 8px; padding: 7px 16px; border-radius: 999px; font: 700 19px InterW; white-space: nowrap; }}
.pp {{ background: var(--p); color: #fff; }} .ps {{ background: var(--soft); color: var(--p); }} .pg {{ background: #E3F6EE; color: var(--gr); }} .pa {{ background: #FFF1D6; color: #9A6408; }}
.msg {{ display: flex; gap: 14px; padding: 16px 26px; }}
.av {{ width: 46px; height: 46px; border-radius: 46px; flex: none; display: flex; align-items: center; justify-content: center; font: 800 18px Jakarta; color: #fff; }}
.mh {{ font: 700 20px InterW; }} .mh span {{ font: 500 17px InterW; color: var(--mut); margin-left: 8px; }}
.mb {{ font: 500 21px/1.4 InterW; color: #2D2A40; margin-top: 4px; }}
.at {{ color: var(--p); font-weight: 700; background: #EFE9FF; border-radius: 6px; padding: 0 5px; }}
.quote {{ border-left: 3px solid var(--p3); background: #F7F5FC; border-radius: 8px; padding: 6px 12px; font: 500 17px InterW; color: var(--mut); margin-top: 6px; }}
.compose {{ margin: 8px 26px 22px; border: 1px solid #E4E0F2; border-radius: 16px; padding: 14px 18px; font: 500 19px InterW; color: #A3A0B8; display: flex; justify-content: space-between; align-items: center; }}
.send {{ width: 40px; height: 40px; border-radius: 12px; background: var(--p); }}
.hip {{ padding: 12px 26px 18px; font: 500 16px InterW; color: var(--mut); border-top: 1px solid #F0EDF8; display: flex; align-items: center; gap: 8px; }}
.var {{ display: inline-block; padding: 1px 9px; margin: 0 2px; border-radius: 8px; background: #EFE9FF; border: 1px solid #DCD0FF; color: var(--p); font: 700 19px InterW; }}
.code {{ font-family: ui-monospace, Menlo, monospace; font-weight: 600; font-size: 18px; }}
.row {{ display: flex; align-items: center; gap: 14px; }}
.glow {{ position: absolute; border-radius: 50%; filter: blur(40px); opacity: .55; z-index: 1; }}
.chipf {{ position: absolute; z-index: 6; display: inline-flex; align-items: center; gap: 12px; padding: 14px 24px 14px 14px; border-radius: 999px; background: #fff; box-shadow: 0 24px 50px -18px rgba(40,20,110,.5); font: 700 24px InterW; color: var(--ink); white-space: nowrap; }}
.chipf .ic {{ width: 40px; height: 40px; border-radius: 40px; display: flex; align-items: center; justify-content: center; }}
.dark .chipf {{ background: rgba(28,22,52,.92); color: #fff; border: 1px solid rgba(255,255,255,.12); }}
.li {{ display: flex; gap: 26px; align-items: flex-start; margin-top: 30px; padding: 26px 30px; border-radius: 26px; background: rgba(255,255,255,.75); border: 1px solid var(--line); box-shadow: 0 24px 50px -30px rgba(40,20,110,.35); }}
.li .n {{ width: 66px; height: 66px; border-radius: 16px; flex: none; display: flex; align-items: center; justify-content: center; background: var(--p); color: #fff; font: 800 24px Jakarta; }}
.li b {{ font: 800 36px Jakarta; letter-spacing: -.015em; display: block; }}
.li span {{ font: 500 28px/1.4 InterW; color: #4A4563; display: block; margin-top: 4px; }}
.cta {{ display: inline-flex; align-items: center; gap: 12px; margin-top: 40px; padding: 22px 40px; border-radius: 999px; background: linear-gradient(135deg, #6D3DF0, #8A63F7); color: #fff; font: 800 32px Jakarta; box-shadow: 0 20px 50px -14px rgba(109,61,240,.8); }}
'''

SVG = {
 'chat': '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>',
 'check': '<path d="M20 6 9 17l-5-5"/>',
 'lock': '<path d="M5 11h14v10H5zM8 11V7a4 4 0 0 1 8 0v4"/>',
 'phone': '<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z"/>',
 'vm': '<path d="M5.5 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM18.5 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM5.5 15.5h13"/>',
 'mail': '<path d="M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zM22 6l-10 7L2 6"/>',
 'doc': '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6M8 13h8M8 17h6"/>',
 'pen': '<path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/>',
 'copy': '<path d="M9 9h11v11H9zM5 15H4V4h11v1"/>',
 'shield': '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>',
 'card': '<path d="M3 5h18v14H3zM3 10h18"/>',
 'cam': '<path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/>',
 'send': '<path d="M22 2 11 13M22 2l-7 20-4-9-9-4 20-7z"/>',
 'at': '<circle cx="12" cy="12" r="4"/><path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-4 8"/>',
 'users': '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8"/>',
 'clock': '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
 'x': '<path d="M18 6 6 18M6 6l12 12"/>',
 'bell': '<path d="M6 8a6 6 0 1 1 12 0c0 7 3 9 3 9H3s3-2 3-9M10.3 21a1.9 1.9 0 0 0 3.4 0"/>',
}
def ic(n, c='#6D3DF0', s=24, w=2.2):
    return f'<svg width="{s}" height="{s}" viewBox="0 0 24 24" fill="none" stroke="{c}" stroke-width="{w}" stroke-linecap="round" stroke-linejoin="round">{SVG[n]}</svg>'

def chip(x, y, text, icon='check', bg='#6D3DF0', rot=0):
    return f'<div class="chipf" style="left:{x}px;top:{y}px;transform:rotate({rot}deg)"><span class="ic" style="background:{bg}">{ic(icon, "#fff", 22)}</span>{E(text)}</div>'

# --------------------------------------------------------------------------- reusable 3D app graphics (demo data)
# Each Office Communication slide shows its own conversation (never reuse one thread across slides).
# Both directions appear: the general dentist's office asking the specialist, and the specialist asking back.
PURPLE, GREEN, AMBER = '#8A63F7', '#1F9D6B', '#E08A00'
CONVOS = {
 'status': dict(sub="With St. Andrew's Family Dental · Sarah Collins", to="St. Andrew's Family Dental", msgs=[
   ('TA', GREEN, 'Tanya', 'Gentle Dental · Front Desk · 8:47 AM', None, '<span class="at">@Barbara</span> Good morning. Sarah Collins asked when she will hear from your office about her implant consultation.'),
   ('BA', PURPLE, 'Barbara', "St. Andrew's Family Dental · Office Manager · 9:02 AM", None, '<span class="at">@Tanya</span> We called her this morning. She is booked for Tuesday at 9:00 AM, and the status is updated on the case.'),
   ('TA', GREEN, 'Tanya', 'Gentle Dental · 9:05 AM', None, 'Wonderful, thank you. I will let her know we are all set.')]),
 'xray': dict(sub='With Gentle Dental · Michael Turner', to='Gentle Dental', msgs=[
   ('BA', PURPLE, 'Barbara', "St. Andrew's Family Dental · Office Manager · 9:52 AM", None, "Good morning <span class='at'>@Tanya</span>. We received Michael's referral. The radiograph on file is from May 2022. Could you share a current periapical of #19?"),
   ('TA', GREEN, 'Tanya', 'Gentle Dental · Front Desk · 10:04 AM', 'Barbara: Could you share a current periapical of #19?', "<span class='at'>@Barbara</span> Of course. Yesterday's periapical is now attached to the case."),
   ('BA', PURPLE, 'Barbara', "St. Andrew's Family Dental · 10:06 AM", None, 'Thank you. His consultation is booked for Thursday at 10:30 AM.')]),
 'reschedule': dict(sub="With St. Andrew's Family Dental · David Ross", to="St. Andrew's Family Dental", msgs=[
   ('AM', AMBER, 'Amanda', 'Gentle Dental · Treatment Coordinator · 1:15 PM', None, '<span class="at">@Barbara</span> David Ross can only come in after 2:00 PM because of work. Is there an afternoon opening this week?'),
   ('BA', PURPLE, 'Barbara', "St. Andrew's Family Dental · Office Manager · 1:22 PM", 'Amanda: Is there an afternoon opening this week?', '<span class="at">@Amanda</span> Wednesday at 2:30 PM is open. I have moved his appointment and updated the case.')]),
 'complete': dict(sub='With Gentle Dental · Michael Turner', to='Gentle Dental', msgs=[
   ('BA', PURPLE, 'Barbara', "St. Andrew's Family Dental · 3:40 PM", None, '<span class="at">@Tanya</span> Treatment on #19 is complete. The signed consultation note is on the case.'),
   ('TA', GREEN, 'Tanya', 'Gentle Dental · Front Desk · 3:52 PM', None, 'Thank you, Barbara. We have copied it into his chart and booked his crown visit with us.')]),
}

def thread(convo='xray', extra_unread=True, w=820):
    c = CONVOS[convo]
    rows = ''.join(f'''<div class="msg"><span class="av" style="background:{col}">{ini}</span><div><div class="mh">{name} <span>{meta}</span></div>
   {f'<div class="quote">{q}</div>' if q else ''}<div class="mb">{body}</div></div></div>''' for ini, col, name, meta, q, body in c['msgs'])
    return f'''<div class="card" style="width:{w}px">
  <div class="ch"><span class="ico">{ic('chat')}</span><div style="flex:1"><b>Office Communication</b><small>{c['sub']}</small></div>
  {'<span class="pill pp">2 unread @mentions</span>' if extra_unread else ''}</div>
  {rows}
  <div class="compose">Message {c['to']}…<span class="send"></span></div>
  <div class="hip">{ic('lock', '#1F9D6B', 18)} All communications are HIPAA compliant and encrypted · Secure</div></div>'''

def case_card(w=700):
    return f'''<div class="card" style="width:{w}px">
  <div class="ch"><span class="av" style="background:#6D3DF0">MT</span><div style="flex:1"><b>Michael Turner</b><small>From Gentle Dental · Root canal · Tooth #19</small></div><span class="pill ps">Consultation Scheduled</span></div>
  <div style="padding:20px 26px;display:grid;grid-template-columns:1fr 1fr;gap:16px">
   <div style="border:1px solid #EEEAF8;border-radius:16px;padding:14px"><div style="font:700 18px InterW;color:#6B7085">X-RAYS (2)</div>
     <div style="display:flex;gap:10px;margin-top:10px"><div style="width:110px;height:72px;border-radius:10px;background:linear-gradient(135deg,#2a2f3a,#555b66)"></div><div style="width:110px;height:72px;border-radius:10px;background:linear-gradient(135deg,#3a3f4a,#6b717c)"></div></div></div>
   <div style="border:1px solid #EEEAF8;border-radius:16px;padding:14px"><div style="font:700 18px InterW;color:#6B7085">INSURANCE</div>
     <div style="margin-top:12px" class="row"><span class="pill pg">{ic('check', '#1F9D6B', 16)} Front &amp; back</span></div></div>
  </div></div>'''

def status_card(w=520):
    chips = [('Received', 'ps'), ('Left a Voicemail', 'pg'), ('Consultation Scheduled', 'pp'), ('Callback Requested', 'pa'), ('Completed', 'ps')]
    return f'''<div class="card" style="width:{w}px"><div class="ch"><span class="ico">{ic('clock')}</span><div><b>Status &amp; Schedule</b><small>The referring office sees each update</small></div></div>
  <div style="padding:18px 22px;display:flex;flex-wrap:wrap;gap:10px">{''.join(f'<span class="pill {c}">{t}</span>' for t,c in chips)}</div></div>'''

def call_card(icon, title, sub, tone='#E89D15'):
    return f'''<div class="card" style="width:560px;border-radius:22px"><div class="ch" style="border:none">
  <span class="ico" style="background:#FFF1D6">{ic(icon, tone)}</span><div style="flex:1"><b style="font-size:25px">{E(title)}</b><small>{E(sub)}</small></div></div></div>'''

def note_card(codes=True, w=820):
    v = (lambda code, val: f'<span class="var code">{{{{{code}}}}}</span>' if codes else f'<span class="var">{val}</span>')
    return f'''<div class="card" style="width:{w}px">
  <div class="ch"><span class="ico">{ic('doc')}</span><div style="flex:1"><b>Prepare Consultation Note</b><small>Review, edit, and sign before sending</small></div><span class="pill ps">Template: General</span></div>
  <div style="padding:14px 26px 0" class="row"><span class="pill {'pp' if not codes else 'ps'}">Show values</span><span class="pill {'pp' if codes else 'ps'}">Show codes</span><span style="margin-left:auto" class="pill ps">+ Insert Variable</span></div>
  <div style="padding:22px 30px 26px;font:500 23px/1.75 InterW;color:#2D2A40">
   {v('todaysDate','11/12/2026')}<br>{v('referringOfficeName','Gentle Dental')}<br>
   Re: {v('patientName','Michael Turner')} · DOB {v('patientDob','04/18/1988')}<br><br>
   Thank you for referring {v('patientName','Michael Turner')} to {v('receivingOfficeName',"St. Andrew's Family Dental")} for treatment.
   The consultation is complete and treatment is scheduled. {v('xrayImages','2 X-rays')}
  </div></div>'''

def editor_card(w=860):
    tools = ''.join(f'<span style="padding:6px 10px;border-radius:8px;background:#F3F1FA;font:700 17px InterW;color:#4A4563">{t}</span>' for t in ['B', 'I', '• List', 'Link', 'Image', 'Paragraph ▾', 'Size ▾'])
    return f'''<div class="card" style="width:{w}px">
  <div class="ch"><span class="ico">{ic('pen')}</span><div style="flex:1"><b>Create Note Template</b><small>Reusable templates for your whole team</small></div><span class="pill ps">Import from Word / PDF</span></div>
  <div style="padding:18px 26px 0;display:flex;gap:16px;align-items:flex-end">
   <div style="flex:1"><div style="font:700 17px InterW;color:#6B7085">TEMPLATE TITLE</div><div style="margin-top:6px;border:1px solid #E4E0F2;border-radius:12px;padding:10px 14px;font:700 21px InterW">Endo consult · thank-you letter</div></div>
   <div style="width:300px"><div style="font:700 17px InterW;color:#6B7085">USED FOR</div><div style="margin-top:6px;border:2px solid #6D3DF0;border-radius:12px;padding:10px 14px;font:700 20px InterW;color:#6D3DF0">Consultation Completed ▾</div></div></div>
  <div style="padding:16px 26px 0;display:flex;flex-wrap:wrap;gap:8px;align-items:center">{tools}<span class="pill pp" style="margin-left:auto">+ Insert Variable</span></div>
  <div style="margin:16px 26px 24px;border:1px solid #E4E0F2;border-radius:16px;padding:18px 20px;font:500 21px/1.65 InterW;color:#2D2A40">
   <div class="row" style="justify-content:space-between"><span style="font:800 22px Jakarta;color:#16132B">Your letterhead</span><span class="var">Company Logo</span></div>
   <div style="margin-top:10px">Thank you for trusting us with <span class="var">Patient Name</span>. Here is what we found and the plan we discussed…</div>
   <div style="margin-top:8px;color:#8A90A2">Your words, your tone, your signature block.</div></div></div>'''

def ehr_modal(w=640):
    return f'''<div class="card" style="width:{w}px">
  <div class="ch"><span class="ico">{ic('doc')}</span><div><b>Consultation Scheduled</b><small>Administrative note</small></div></div>
  <div style="padding:18px 26px;font:500 19px/1.5 InterW;color:#4A4563">
   <div><b style="color:#16132B">Privacy:</b> saved for your staff only.</div>
   <div style="margin-top:6px"><b style="color:#16132B">Electronic health record export:</b> copy and paste this note into your own patient health record.</div>
   <div style="margin-top:14px;border:1px solid #E4E0F2;border-radius:14px;padding:14px 16px;color:#2D2A40;font-size:21px">Spoke with Michael Turner on 11/12/2026. Consultation booked for Thursday.</div>
   <div style="margin-top:14px;background:#F3EEFE;border-radius:14px;padding:14px 16px"><b style="color:#6D3DF0">Next step</b><div style="margin-top:4px">Check back in 2 business days?</div><span class="pill pp" style="margin-top:10px">Remind me on 11/16</span></div>
  </div></div>'''

def ehr_window(w=560):
    return f'''<div class="card" style="width:{w}px;background:#F8F9FB">
  <div style="height:46px;background:#E9ECF2;display:flex;align-items:center;gap:8px;padding:0 18px">{''.join('<i style="width:12px;height:12px;border-radius:12px;background:#C9CED8;display:block"></i>' for _ in range(3))}<span style="margin-left:12px;font:700 18px InterW;color:#5B6274">Your electronic health record · Patient chart</span></div>
  <div style="padding:20px 22px;font:500 19px/1.5 InterW;color:#3A3F55">
   <div style="font:700 17px InterW;color:#8A90A2;letter-spacing:.06em">CLINICAL NOTES</div>
   <div style="margin-top:10px;background:#fff;border:2px solid #6D3DF0;border-radius:12px;padding:12px 14px;color:#2D2A40">Spoke with Michael Turner on 11/12/2026. Consultation booked for Thursday.</div>
   <div style="margin-top:10px;height:12px;width:80%;background:#E6E8EE;border-radius:6px"></div><div style="margin-top:8px;height:12px;width:60%;background:#E6E8EE;border-radius:6px"></div></div></div>'''

def signer_card(w=640):
    opts = [("I'll sign it myself", False), ('Sign on behalf of a doctor', False), ('Route to a doctor to sign', True)]
    return f'''<div class="card" style="width:{w}px"><div class="ch"><span class="ico">{ic('pen')}</span><div><b>Who signs this note?</b><small>Staff can prepare it; the doctor signs</small></div></div>
  <div style="padding:16px 26px 24px">{''.join(f'<div class="row" style="padding:12px 0;font:700 23px InterW;color:{"#16132B" if on else "#4A4563"}"><span style="width:26px;height:26px;border-radius:26px;border:3px solid {"#6D3DF0" if on else "#C9C4DD"};display:flex;align-items:center;justify-content:center">{"<i style=\'width:12px;height:12px;border-radius:12px;background:#6D3DF0;display:block\'></i>" if on else ""}</span>{E(t)}</div>' for t,on in opts)}
  <div class="row" style="margin-top:14px;gap:10px"><span class="pill ps">Save as New Template</span><span class="pill pp">Sign and Send</span></div></div></div>'''

def signed_card(w=700):
    return f'''<div class="card" style="width:{w}px"><div class="ch"><span class="ico" style="background:#E3F6EE">{ic('check', '#1F9D6B')}</span><div style="flex:1"><b>Signed notes</b><small>Visible to both offices</small></div></div>
  <div style="padding:18px 26px 24px"><div class="row" style="border:1px solid #EEEAF8;border-radius:16px;padding:16px 18px">
   <div style="flex:1"><div style="font:800 24px Jakarta">Consultation Note</div><div style="font:500 18px InterW;color:#6B7085;margin-top:2px">Signed 11/12/2026 · e-signed</div></div>
   <span class="pill ps">View</span><span class="pill ps">Download</span></div></div></div>'''

def ins_card_graphic(side='FRONT', w=300):
    body = ('<div style="font:800 20px Jakarta;color:#2D5BD8">Dental PPO</div><div style="margin-top:14px;font:600 15px InterW;color:#5B6274">Member</div><div style="font:800 19px Jakarta">Michael Turner</div><div style="margin-top:8px;font:600 15px InterW;color:#5B6274">ID 0482 1193 77</div>'
            if side == 'FRONT' else '<div style="font:700 15px InterW;color:#5B6274">Member services</div>' + ''.join('<div style="margin-top:8px;height:9px;width:%d%%;background:#D9DDE6;border-radius:5px"></div>' % x for x in (90, 75, 85, 60, 70)))
    return f'<div style="width:{w}px;height:{int(w*0.63)}px;border-radius:16px;background:linear-gradient(135deg,#FFFFFF,#EEF2FB);border:1px solid #DDE3EF;padding:16px 18px;position:relative;box-shadow:0 12px 30px -12px rgba(30,40,80,.35)">{body}<span style="position:absolute;right:12px;bottom:10px;font:700 13px InterW;color:#8A90A2">{side}</span></div>'

def ins_dash(toast=False, w=760):
    return f'''<div class="card" style="width:{w}px"><div class="ch"><span class="ico">{ic('card')}</span><div style="flex:1"><b>Insurance cards</b><small>Primary / secondary cards for this patient</small></div>
  <span class="pill ps">+ Add card</span><span class="pill pp">Request from patient</span></div>
  <div style="padding:22px 26px;display:flex;gap:18px">{ins_card_graphic('FRONT', 300)}{ins_card_graphic('BACK', 300)}</div>
  <div style="padding:0 26px 22px;font:500 18px InterW;color:#6B7085" class="row"><span class="pill pg">Submitted by patient</span> Policy · Group · Subscriber on file</div></div>'''

def phone(w=380):
    return f'''<div style="width:{w}px;height:{int(w*2.05)}px;border-radius:56px;background:#14121F;padding:16px;box-shadow:0 60px 100px -30px rgba(20,10,60,.7), inset 0 0 0 2px #2A2640">
 <div style="width:100%;height:100%;border-radius:42px;background:#F8F6FF;overflow:hidden;position:relative">
  <div style="height:34px;display:flex;justify-content:center;align-items:center"><i style="width:110px;height:26px;border-radius:20px;background:#14121F;display:block"></i></div>
  <div style="padding:22px 24px">
   <img src="{LOGO}" style="height:44px">
   <div style="font:800 30px/1.15 Jakarta;margin-top:22px;color:#16132B">Upload your insurance card</div>
   <div style="font:500 18px/1.45 InterW;color:#6B7085;margin-top:10px">St. Andrew's Family Dental asked for your dental insurance. Secure and encrypted.</div>
   <div style="margin-top:22px;border:2px dashed #B9A4FF;border-radius:18px;padding:18px;text-align:center;background:#fff">{ic('cam', '#6D3DF0', 40)}<div style="font:700 19px InterW;color:#6D3DF0;margin-top:6px">Front of card</div><div style="margin-top:4px;font:600 16px InterW;color:#1F9D6B">✓ Uploaded</div></div>
   <div style="margin-top:12px;border:2px dashed #B9A4FF;border-radius:18px;padding:18px;text-align:center;background:#fff">{ic('cam', '#6D3DF0', 40)}<div style="font:700 19px InterW;color:#6D3DF0;margin-top:6px">Back of card</div></div>
   <div style="margin-top:20px;border-radius:999px;background:#6D3DF0;color:#fff;text-align:center;padding:16px;font:800 21px Jakarta">Submit securely</div>
   <div style="margin-top:12px;text-align:center;font:600 15px InterW;color:#6B7085">{ic('lock', '#1F9D6B', 14)} HIPAA-secure link</div>
  </div></div></div>'''

def activity(w=700, rows=None):
    rows = rows or [('Barbara', 'sent secure insurance request to patient', '9:41 AM'), ('Patient', 'submitted insurance (front and back)', '10:12 AM'), ('Amanda', 'verified coverage and scheduled the consultation', '10:30 AM')]
    return f'''<div class="card" style="width:{w}px"><div class="ch"><span class="ico">{ic('clock')}</span><div><b>Activity log</b><small>Every step, who did it and when</small></div></div>
  <div style="padding:10px 26px 22px">{''.join(f'<div class="row" style="padding:12px 0;border-bottom:1px solid #F2EFF9;font:500 21px InterW"><i style="width:12px;height:12px;border-radius:12px;background:#6D3DF0;display:block;flex:none"></i><b style="font-weight:700">{E(a)}</b><span style="color:#4A4563;flex:1">{E(b)}</span><span style="color:#8A90A2;font-size:17px">{t}</span></div>' for a,b,t in rows)}</div></div>'''

def toast(text, sub, w=520):
    return f'''<div style="width:{w}px;border-radius:20px;background:#fff;border:1px solid #CDEFE0;box-shadow:0 30px 60px -20px rgba(20,90,60,.45);padding:18px 22px" class="row">
  <span class="ico" style="background:#E3F6EE">{ic('check', '#1F9D6B')}</span><div><div style="font:800 23px Jakarta;color:#16132B">{E(text)}</div><div style="font:500 18px InterW;color:#6B7085">{E(sub)}</div></div></div>'''

def place(html_, left, top, rx=0, ry=0, rz=0, z=0, scale=1, origin='50% 50%'):
    return f'<div class="d3" style="left:{left}px;top:{top}px;transform:rotateX({rx}deg) rotateY({ry}deg) rotateZ({rz}deg) translateZ({z}px) scale({scale});transform-origin:{origin}">{html_}</div>'

def stage(top, inner, h=900):
    return f'<div class="stage" style="top:{top}px;height:{h}px">{inner}</div>'

def team_rows(rows):
    return ''.join(f'<div class="li"><span class="n">{ic(i, "#fff", 26)}</span><div><b>{E(a)}</b><span>{E(b)}</span></div></div>' for i,a,b in rows)

def brand_close(line1, line2, sub):
    return f'''<div class="txt" style="top:300px;text-align:center;left:60px;right:60px">
  <img src="{LOGO}" style="height:150px;filter:brightness(0) invert(1)">
  <h1 style="margin-top:70px;font-size:80px">{line1}<br><span class="hl">{line2}</span></h1>
  <div class="p" style="margin:30px auto 0;max-width:820px;text-align:center">{sub}</div>
  <div class="cta">Get started free</div>
  <div style="margin-top:34px;font:700 30px InterW;color:#B9A4FF">toothreferral.com</div></div>'''

# =========================================================================== POST A — direct messages on the case
A = [
 dict(dark=True, body=f'''<div class="txt"><div class="k">Tooth Referral · Office Communication</div><h1>End the phone tag<br>between offices.</h1>
  <div class="p">General dentists and specialists, talking right on the case.</div></div>
  <div class="glow" style="left:560px;top:620px;width:420px;height:420px;background:#6D3DF0"></div>
  {stage(520, place(thread('status'), 150, 0, rx=14, ry=-20, rz=2, scale=.94) + chip(600, 640, 'Tag the right person', 'at', '#6D3DF0', -3) + chip(80, -30, 'HIPAA-secure', 'lock', '#1F9D6B', -3))}'''),
 dict(body=f'''<div class="txt"><div class="k">Sound familiar?</div><h2>One small question.<br>Four phone calls.</h2>
  <div class="p">"Has she been scheduled?" or "Do you have a newer X-ray?" turns into a call, a voicemail, an email to someone's inbox and a callback while you're with a patient.</div></div>
  {stage(640, place(call_card('phone', 'Missed call', 'Gentle Dental · 11:20 AM'), 120, 0, rx=18, ry=-14, rz=-4, z=-60)
             + place(call_card('vm', 'Voicemail (0:41)', '"Calling about the X-ray…"'), 280, 150, rx=18, ry=-14, rz=-4, z=-20)
             + place(call_card('mail', 'Email', 'Re: Re: Fwd: X-ray for Michael T.'), 200, 300, rx=18, ry=-14, rz=-4, z=20)
             + place(call_card('clock', 'Callback', 'Next day · still no X-ray'), 340, 450, rx=18, ry=-14, rz=-4, z=60))}'''),
 dict(body=f'''<div class="txt"><div class="k">The feature</div><h2>Message the other office<br>right on the referral.</h2>
  <div class="p">Secure cloud messages between the general dentist's office and the specialist's office, attached to the patient's case.</div></div>
  {stage(560, place(thread('xray', False, 860), 110, 0, rx=8, ry=12, rz=-1.5))}'''),
 dict(body=f'''<div class="txt"><div class="k">@mentions</div><h2>Tag the right person.<br>They see it right away.</h2>
  <div class="p">Need an afternoon slot? An @mention reaches the right teammate at either office, with an unread badge until they've seen it.</div></div>
  {stage(560, place(thread('reschedule', True, 800), 170, 20, rx=10, ry=-16, rz=1, z=-80, scale=.86) + chip(70, 40, '@Barbara', 'at', '#6D3DF0', -5) + chip(40, 300, 'Unread until seen', 'bell', '#E89D15', 3) + chip(640, -20, 'Reply in the thread', 'chat', '#1F9D6B', -2))}'''),
 dict(body=f'''<div class="txt"><div class="k">Context included</div><h2>Every message stays<br>with the patient's case.</h2>
  <div class="p">X-rays, insurance, status and the conversation, together. Nobody digs through email to find it.</div></div>
  {stage(560, place(case_card(700), 40, 0, rx=16, ry=18, rz=-2, z=-140, scale=.9) + place(thread('complete', False, 640), 330, 190, rx=16, ry=-14, rz=2, z=80, scale=.72, origin='50% 0%') + chip(40, 430, 'X-rays · insurance · status', 'check', '#1F9D6B', -3))}'''),
 dict(body=f'''<div class="txt"><div class="k">Value for the whole team</div><h2>Less phone tag,<br>whichever side you're on.</h2>
  {team_rows([('users', 'Front desk', 'Ask once, in writing. No hold music, no voicemail.'),
              ('clock', 'Office manager', 'Every question and answer is on the case, with a time stamp.'),
              ('send', 'Both offices', 'General dentist or specialist, each side replies on their own time, from the same case.'),
              ('shield', 'Your patients', 'Details travel securely, never through texts or personal email.')])}</div>'''),
 dict(dark=True, body=brand_close('Every conversation about a referral,', 'in one secure place.', 'Tooth Referral is the HIPAA-secure network where general dentists and specialists send, track and talk about every referral.')),
]

# =========================================================================== POST B — notes that write themselves
B = [
 dict(dark=True, body=f'''<div class="txt"><div class="k">Tooth Referral · Notes</div><h1>Your consultation letter,<br>already written.</h1>
  <div class="p">Templates fill in the patient, offices, dates and X-rays for you.</div></div>
  <div class="glow" style="left:520px;top:640px;width:440px;height:440px;background:#6D3DF0"></div>
  {stage(560, place(note_card(False, 820), 140, 0, rx=12, ry=-18, rz=2, scale=.94) + chip(660, -10, 'Auto-filled', 'check', '#1F9D6B', 4) + chip(80, 590, 'Ready to sign', 'pen', '#6D3DF0', -3))}'''),
 dict(body=f'''<div class="txt"><div class="k">The old way</div><h2>The same letter,<br>retyped for every patient.</h2>
  <div class="p">Referral letters, consultation notes, completion letters. Names, dates and tooth numbers copied by hand, printed and faxed. Every single time.</div></div>
  {stage(660, ''.join(place(f'<div class="card" style="width:560px;height:330px;padding:30px"><div style="font:800 24px Jakarta">Consultation letter</div>' + ''.join(f'<div style="margin-top:16px;height:13px;width:{w}%;background:#ECE8F6;border-radius:7px"></div>' for w in (92, 80, 88, 70, 84)) + '</div>', 180 + i * 70, i * 90, rx=22, ry=-10, rz=-6 + i * 3, z=i * 30) for i in range(4))
             + chip(640, 30, 'Retype', 'pen', '#E89D15', 5) + chip(70, 520, 'Print, sign, fax', 'doc', '#E89D15', -4))}'''),
 dict(body=f'''<div class="txt"><div class="k">Smart templates</div><h2>Variables fill themselves in.</h2>
  <div class="p">Build a template once. Patient, DOB, both offices, specialty, X-ray images and dates appear on every note.</div></div>
  {stage(570, place(note_card(True, 860), 110, 0, rx=10, ry=14, rz=-1.5)
             + chip(640, 560, '17 smart variables', 'doc', '#6D3DF0', 3) + chip(70, 590, 'Import from Word or PDF', 'copy', '#1F9D6B', -3))}'''),
 dict(body=f'''<div class="txt"><div class="k">Fully customisable</div><h2>Make every template<br>your own.</h2>
  <div class="p">Your wording, your letterhead and logo, one template per situation. Start from scratch or import the letter you already use.</div></div>
  {stage(625, place(editor_card(860), 110, 0, rx=10, ry=-14, rz=1.5) + chip(50, 530, 'Your logo & wording', 'pen', '#6D3DF0', -3) + chip(620, 545, 'Import from Word or PDF', 'doc', '#1F9D6B', 3)
             + f'<div style="position:absolute;left:150px;top:-70px;z-index:6;display:flex;gap:12px">' + ''.join(f'<span class="pill {c}" style="box-shadow:0 16px 30px -14px rgba(40,20,110,.5);font-size:20px">{t}</span>' for t,c in [('General','ps'),('Consultation Completed','pp'),('Declined Appointment','ps')]) + '</div>')}'''),
 dict(body=f'''<div class="txt"><div class="k">Works with your records</div><h2>Copy notes into your<br>electronic health record.</h2>
  <div class="p">Whether you refer or receive, each note is ready to paste into your own patient health record, so your charts stay in sync.</div></div>
  {stage(560, place(ehr_modal(600), 70, 0, rx=12, ry=20, rz=-2, z=-40) + place(ehr_window(500), 530, 260, rx=12, ry=-18, rz=2, z=40)
             + f'<div style="position:absolute;left:445px;top:250px;z-index:6;width:110px;height:110px;border-radius:110px;background:linear-gradient(135deg,#6D3DF0,#8A63F7);display:flex;align-items:center;justify-content:center;box-shadow:0 20px 40px -10px rgba(109,61,240,.7)">{ic("copy", "#fff", 50)}</div>'
             + chip(110, 600, 'Copy into your electronic health record', 'copy', '#6D3DF0', -2))}'''),
 dict(body=f'''<div class="txt"><div class="k">Staff prepare, doctors sign</div><h2>Route the note to the doctor.</h2>
  <div class="p">An assistant drafts it from the template. The doctor signs it themselves, or a teammate signs on their behalf.</div></div>
  {stage(600, place(signer_card(660), 210, 0, rx=12, ry=-16, rz=1.5) + chip(90, 470, 'E-signature built in', 'pen', '#1F9D6B', -3) + chip(600, 520, 'Save as a template', 'doc', '#6D3DF0', 3))}'''),
 dict(body=f'''<div class="txt"><div class="k">Closing the loop</div><h2>Signed, sent and visible<br>to both offices.</h2>
  <div class="p">The signed note lands on the case for both the general dentist and the specialist. No printing, no fax.</div></div>
  {stage(600, place(toast('All done, your document is signed!', 'Consultation note signed and sent', 600), 120, 0, rx=14, ry=-12, rz=-2, z=60)
             + place(signed_card(760), 200, 180, rx=14, ry=-12, rz=-2) + chip(90, 520, 'On the referral', 'check', '#1F9D6B', -3) + chip(640, 560, 'No fax', 'x', '#6D3DF0', 3))}'''),
 dict(dark=True, body=brand_close('Notes that write themselves.', 'Letters that sign themselves.', 'Templates, smart variables, notes ready for your electronic health record and e-signatures, built in for general dentists and specialists alike.')),
]

# =========================================================================== POST C — the patient sends their own insurance
C = [
 dict(dark=True, body=f'''<div class="txt"><div class="k">Tooth Referral · Insurance</div><h1>Stop chasing<br>insurance cards.</h1>
  <div class="p">One click sends the patient a secure link. Their card lands on the case.</div></div>
  <div class="glow" style="left:600px;top:600px;width:420px;height:420px;background:#6D3DF0"></div>
  {stage(470, place(phone(360), 560, 0, rx=8, ry=-22, rz=3) + place(ins_card_graphic('FRONT', 360), 120, 280, rx=18, ry=24, rz=-8, z=80) + chip(80, 640, 'Front & back received', 'check', '#1F9D6B', -4))}'''),
 dict(body=f'''<div class="txt"><div class="k">Sound familiar?</div><h2>"Can you text us a photo<br>of your card?"</h2>
  <div class="p">Insurance chaos: photos in personal texts, blurry faxes, missing backs and patients sent home because coverage wasn't checked.</div></div>
  {stage(680, place(call_card('phone', 'Text from a patient', 'IMG_2231.jpg · back missing'), 140, 0, rx=18, ry=-14, rz=-4)
             + place(call_card('doc', 'Fax received', 'Page 2 of 3 unreadable'), 320, 160, rx=18, ry=-14, rz=-4, z=30)
             + place(call_card('clock', 'Appointment rescheduled', 'Coverage not verified'), 220, 320, rx=18, ry=-14, rz=-4, z=60))}'''),
 dict(body=f'''<div class="txt"><div class="k">The feature</div><h2>One click:<br>Request from patient.</h2>
  <div class="p">Either office, general or specialist, sends a HIPAA-secure link from the referral. No account needed for the patient.</div></div>
  {stage(570, place(ins_dash(False, 820), 130, 0, rx=12, ry=16, rz=-1.5) + place(toast('Insurance request sent', 'Secure link sent to the patient', 520), 470, 470, rx=12, ry=16, rz=-1.5, z=120))}'''),
 dict(body=f'''<div class="txt"><div class="k">The patient's side</div><h2>Snap the front and back.<br>Done.</h2>
  <div class="p">Patients upload their own card from their phone, securely, before the first visit.</div></div>
  {stage(540, place(phone(380), 360, 0, rx=6, ry=-18, rz=2) + chip(70, 150, 'Secure upload', 'lock', '#1F9D6B', -4) + chip(700, 520, 'No account needed', 'check', '#6D3DF0', 4))}'''),
 dict(body=f'''<div class="txt"><div class="k">On the case</div><h2>The card lands right<br>on the referral.</h2>
  <div class="p">Front and back, policy and group, logged with who asked and when.</div></div>
  {stage(540, place(ins_dash(False, 780), 70, 0, rx=12, ry=18, rz=-2, z=-40, scale=.92) + place(activity(640), 370, 360, rx=12, ry=-14, rz=1.5, z=60, scale=.9))}'''),
 dict(body=f'''<div class="txt"><div class="k">Value for everyone</div><h2>Fewer calls to verify<br>insurance.</h2>
  {team_rows([('users', 'Front desk', 'No more chasing photos, faxes or callbacks.'),
              ('card', "The specialist's office", 'Coverage is on the case before the consultation.'),
              ('send', "The general dentist's office", 'Refers the patient without chasing the card first.'),
              ('shield', 'The patient', 'Shares it once, securely, from their phone.')])}</div>'''),
 dict(dark=True, body=brand_close('No more insurance chaos.', 'Just refer it.', 'The patient uploads their own card through a HIPAA-secure link, and it arrives on the referral, ready to verify.')),
]

POSTS = [
 dict(id='post-A-direct-messages', title='End the phone tag between offices', feature='Office Communication (secure messages on the case)', tag='MESSAGES', slides=A),
 dict(id='post-B-notes', title='Notes that write themselves', feature='Customisable note templates, electronic health record copy, e-signature, signed note back', tag='NOTES', slides=B),
 dict(id='post-C-insurance', title='Stop chasing insurance cards', feature='Request from patient (secure insurance link)', tag='INSURANCE', slides=C),
]

def page(s, n, total, tag):
    dots = ''.join(f'<i class="{"on" if i == n else ""}"></i>' for i in range(1, total + 1))
    right = 'Swipe →' if n < total else 'toothreferral.com'
    return f'''<html><head><meta charset="utf-8"><style>{CSS}</style></head><body class="{'dark' if s.get('dark') else ''}"><div class="grid"></div>
<div class="top"><img src="{LOGO}"><span class="tag">{tag} · {n}/{total}</span></div>{s['body']}
<div class="foot"><div class="dots">{dots}</div><span>{right}</span></div></body></html>'''

CHECK_JS = r'''() => {
  const W = 1080, H = 1350, bad = [];
  const foot = document.querySelector('.foot').getBoundingClientRect();
  const txt = document.querySelector('.txt');
  const tb = txt ? txt.getBoundingClientRect() : null;
  document.querySelectorAll('.txt *, .card, .chipf').forEach(el => {
    const r = el.getBoundingClientRect();
    if (r.width === 0) return;
    if (r.left < 30 || r.right > W - 30 || r.top < 20 || r.bottom > H - 20) bad.push('off-canvas: ' + (el.className || el.tagName) + ' ' + Math.round(r.left) + ',' + Math.round(r.top) + ',' + Math.round(r.right) + ',' + Math.round(r.bottom));
    if (el.scrollWidth > el.clientWidth + 2 && getComputedStyle(el).overflow !== 'visible' && el.clientWidth > 0) bad.push('clipped text: ' + (el.textContent || '').slice(0, 40));
  });
  if (tb) {
    if (tb.bottom > foot.top - 10) bad.push('text runs into footer');
    document.querySelectorAll('.stage .card, .stage .chipf').forEach(el => {
      const r = el.getBoundingClientRect();
      if (r.top < tb.bottom - 4 && r.bottom > tb.top && r.right > tb.left && r.left < tb.right) bad.push('graphic overlaps headline: ' + (el.textContent || '').slice(0, 30));
    });
  }
  document.querySelectorAll('.stage .card, .stage .chipf').forEach(el => { const r = el.getBoundingClientRect(); if (r.bottom > foot.top - 6) bad.push('graphic into footer: ' + (el.textContent || '').slice(0, 30)); });
  return bad;
}'''

def render():
    out = os.path.join(HERE, 'slides'); os.makedirs(out, exist_ok=True)
    jobs = []
    for p in POSTS:
        d = os.path.join(out, p['id']); os.makedirs(d, exist_ok=True)
        for i, s in enumerate(p['slides'], 1):
            h = os.path.join(d, f'{i:02d}.html'); open(h, 'w').write(page(s, i, len(p['slides']), p['tag'])); jobs.append(h)
    js = f'''const {{ chromium }} = require('playwright');
(async () => {{ const b = await chromium.launch(); const pg = await b.newPage({{ viewport: {{ width: 1080, height: 1350 }} }}); const report = {{}};
for (const p of {json.dumps(jobs)}) {{ await pg.goto('file://' + p); await pg.evaluate(() => document.fonts.ready); await pg.waitForTimeout(250);
  report[p] = await pg.evaluate({CHECK_JS}); await pg.screenshot({{ path: p.replace('.html', '.png') }}); }}
require('fs').writeFileSync('{os.path.join(out, "check.json")}', JSON.stringify(report, null, 1)); await b.close(); }})();'''
    open(os.path.join(out, 'shot.cjs'), 'w').write(js)
    subprocess.run(['node', os.path.join(out, 'shot.cjs')], check=True)
    rep = json.load(open(os.path.join(out, 'check.json')))
    issues = {os.path.relpath(k, out): v for k, v in rep.items() if v}
    for h in jobs: os.remove(h)
    os.remove(os.path.join(out, 'shot.cjs'))
    return issues



def pdf():
    from PIL import Image
    cap = json.load(open(os.path.join(HERE, 'captions.json')))
    os.makedirs(os.path.join(HERE, 'pdf'), exist_ok=True)
    css = f'''@page {{ size: A4; margin: 16mm 14mm; }}
@font-face {{ font-family: Jakarta; src: url(file://{FONTS}/plus-jakarta-sans-latin-800-normal.woff2); font-weight: 800; }}
@font-face {{ font-family: InterW; src: url(file://{FONTS}/inter-latin-500-normal.woff2); font-weight: 500; }}
@font-face {{ font-family: InterW; src: url(file://{FONTS}/inter-latin-700-normal.woff2); font-weight: 700; }}
body {{ font-family: InterW; color: #16132B; font-size: 10.5pt; line-height: 1.5; }}
h1 {{ font-family: Jakarta; font-size: 22pt; margin: 2mm 0 2mm; letter-spacing: -.01em; }}
.meta {{ color: #6D3DF0; font-weight: 700; font-size: 9pt; letter-spacing: .1em; text-transform: uppercase; }}
.grid {{ display: grid; grid-template-columns: repeat(4, 1fr); gap: 3mm; margin: 4mm 0 5mm; }}
.grid img {{ width: 100%; border-radius: 2mm; box-shadow: 0 1mm 3mm rgba(40,20,110,.2); }}
.box {{ border: 1px solid #E4DBFF; border-radius: 3mm; padding: 4mm 5mm; margin-bottom: 4mm; background: #FBFAFF; page-break-inside: avoid; }}
.box h3 {{ font-family: Jakarta; font-size: 11pt; margin: 0 0 2mm; color: #6D3DF0; }}
.cap {{ white-space: pre-wrap; }} .tags {{ color: #3B1E8F; font-weight: 700; }}
.kw span {{ display: inline-block; background: #EFEAFF; color: #3B1E8F; border-radius: 9pt; padding: .5mm 2.5mm; margin: 0 1.5mm 1.5mm 0; font-size: 9pt; }}
.small {{ color: #6B7085; font-size: 9pt; }}
.full {{ page-break-before: always; text-align: center; }} .full img {{ height: 245mm; border-radius: 3mm; }}'''
    for i, p in enumerate(POSTS, 1):
        c = cap[p['id']]; d = os.path.join(HERE, 'slides', p['id'])
        files = [os.path.join(d, f'{k:02d}.png') for k in range(1, len(p['slides']) + 1)]
        body = f'''<div class="meta">Tooth Referral · LinkedIn carousel {i} of 3 · one feature: {E(p["feature"])}</div><h1>{E(p["title"])}</h1>
<div class="grid">{''.join(f'<img src="file://{f}">' for f in files)}</div>
<div class="box"><h3>Hook (first line)</h3><div class="cap"><b>{E(c["hook"])}</b></div></div>
<div class="box"><h3>Caption</h3><div class="cap">{E(c["linkedin"])}</div><p class="tags">{E(" ".join(c["hashtags_linkedin"]))}</p></div>
<div class="box kw"><h3>Keywords (first comment and alt text)</h3>{''.join(f"<span>{E(k)}</span>" for k in c["keywords"])}<p class="small"><b>Alt text:</b> {E(c["alt"])}</p>
<p class="small">Upload the slides-only PDF as a LinkedIn document so it swipes in the feed. Demo data; names are fictional.</p></div>''' + ''.join(f'<div class="full"><div class="meta">Slide {k} of {len(files)}</div><img src="file://{f}"></div>' for k, f in enumerate(files, 1))
        name = f'Carousel-{i}-' + p['title'].replace(' ', '-').replace("'", '')
        doc = os.path.join(HERE, '_doc.html'); open(doc, 'w').write(f'<html><head><meta charset="utf-8"><style>{css}</style></head><body>{body}</body></html>')
        out = os.path.join(HERE, 'pdf', f'{name}-LinkedIn-Caption-and-Slides.pdf')
        js = os.path.join(HERE, '_pdf.cjs'); open(js, 'w').write(f'''const {{ chromium }} = require('playwright');
(async () => {{ const b = await chromium.launch(); const pg = await b.newPage(); await pg.goto('file://{doc}'); await pg.evaluate(() => document.fonts.ready); await pg.waitForTimeout(400);
await pg.pdf({{ path: '{out}', format: 'A4', printBackground: true }}); await b.close(); }})();''')
        subprocess.run(['node', js], check=True); os.remove(doc); os.remove(js)
        ims = [Image.open(f).convert('RGB') for f in files]
        ims[0].save(os.path.join(HERE, 'pdf', f'{name}-Slides-Only.pdf'), save_all=True, append_images=ims[1:], resolution=72)
        print(name)


if __name__ == '__main__':
    issues = render()
    print(json.dumps(issues, indent=1) if issues else 'no layout issues')
    pdf()
