"""Tooth Referral app screens rebuilt in HTML/CSS, matching the real app (layout, Inter type, purple #774AEE actions,
status pill colours, white cards with light grey borders), so they print as VECTOR in the PDF and stay sharp at any zoom.
Demo data only (Gentle Dental, St. Andrew's Family Dental; staff Tanya, Amanda, Greg, Barbara; fictional patients).
Each function returns HTML at a base width; ui(name, width) scales it with a 2D transform (stays vector)."""
import html
E = html.escape

P = '#774AEE'
CSS = '''
.app { font-family: I, Inter, sans-serif; color: #1C1F33; background: #fff; border: 1px solid #E5E7EB; border-radius: 12px; overflow: hidden; }
.app .hd { padding: 18px 22px 12px; } .app h3 { font: 600 21px I; margin: 0; } .app .sub { font: 500 14px I; color: #6B7085; margin-top: 4px; }
.app .btn { display: inline-flex; align-items: center; gap: 6px; padding: 7px 14px; border: 1.5px solid #B9A4F5; border-radius: 6px; color: #5B34D6; font: 500 14px I; background: #fff; }
.app .btn.solid { background: #774AEE; border-color: #774AEE; color: #fff; }
.app .pill { display: inline-block; padding: 4px 10px; border-radius: 6px; font: 500 13px I; }
.app .row { display: flex; align-items: center; gap: 10px; border: 0; background: none; padding: 0; border-radius: 0; font-size: inherit; line-height: normal; }
.app .row b { width: auto; flex: initial; color: inherit; }
.app .muted { color: #6B7085; } .app .lbl { font: 600 11px I; letter-spacing: .06em; color: #8A8FA0; text-transform: uppercase; }
.app .av { width: 34px; height: 34px; border-radius: 34px; display: flex; align-items: center; justify-content: center; color: #fff; font: 700 12px I; flex: none; }
.app .var { display: inline-block; padding: 1px 6px; border-radius: 4px; background: #F2EDFF; border: 1px solid #D9CCFB; color: #5B34D6; }
.app .line { height: 8px; border-radius: 4px; background: #E9EBF0; }
'''
PILLS = {'grey': ('#EEF0F4', '#4A5068'), 'green': ('#E3F6E9', '#25744A'), 'teal': ('#DDF3F1', '#1F6F6A'), 'peach': ('#FDEBDC', '#A3561D'),
         'lilac': ('#EFE8FF', '#5B34D6'), 'yellow': ('#FBF3C9', '#7A6410'), 'blue': ('#E6EEFB', '#2E4E9E'), 'pink': ('#FBE7F3', '#9A2F74')}
pill = lambda t, c: f'<span class="pill" style="background:{PILLS[c][0]};color:{PILLS[c][1]}">{E(t)}</span>'
ICO = {'shield': 'M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z', 'cal': 'M7 3v4M17 3v4M3 9h18M5 5h14v16H5z', 'doc': 'M14 3H6v18h12V7zM14 3v4h4',
       'chat': 'M4 4h16v12H8l-4 4z', 'search': 'M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14zM21 21l-5-5', 'check': 'M5 12l5 5 9-10', 'plus': 'M12 5v14M5 12h14',
       'dl': 'M12 4v12M7 11l5 5 5-5M5 20h14', 'pen': 'M4 20l4-1 11-11-3-3L5 16z', 'copy': 'M9 9h11v11H9zM5 15H4V4h11v1'}
ico = lambda k, c='#6B7085', s=16: f'<svg width="{s}" height="{s}" viewBox="0 0 24 24" fill="none" stroke="{c}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="{ICO[k]}"/></svg>'


def static_form():
    f = ''.join(f'<div style="margin-top:14px"><div style="font:15px Georgia;color:#333">* {t}</div><div style="height:30px;width:{w}%;border:1px solid #9a9a9a;margin-top:5px;background:#fff"></div></div>'
                for t, w in [("Referring Doctor's Name", 96), ("Doctor's Phone", 55), ('Patient Name', 96), ('Social Security Number', 55), ('Birthdate', 55)])
    return 600, f'''<div class="app" style="background:#F6F2E8;border-color:#CFC8B6;border-radius:4px"><div style="padding:26px 30px 30px">
<div style="font:400 30px Georgia;color:#2b2b2b">Patient Referral Form</div><div style="font:italic 14px Georgia;color:#666;margin-top:6px">If you are a doctor referring a patient to us, please fill out and submit the following form.</div>
{f}<div style="margin-top:14px;font:15px Georgia;color:#333">Concerns and Comments</div><div style="height:70px;border:1px solid #9a9a9a;margin-top:5px;background:#fff"></div>
<div style="margin-top:16px;display:inline-block;padding:6px 20px;border:1px solid #888;background:#e8e8e8;font:15px Georgia">Submit</div></div></div>'''


def _card_front():
    return f'''<div style="width:300px;height:186px;border-radius:12px;background:#fff;border:1px solid #DADDE4;box-shadow:0 2px 6px rgba(0,0,0,.06);position:relative;overflow:hidden;font-family:I">
<div style="padding:14px 16px"><div class="row" style="gap:8px"><div style="width:22px;height:22px;border-radius:6px;background:#1FA463"></div><b style="font:800 15px I;color:#1F7A4A;letter-spacing:.04em">DENTAL PPO</b></div>
<div style="margin-top:12px;font:500 10px I;color:#8A8FA0">Primary Enrollee</div><div style="font:600 17px I;color:#1F7A4A">John Doe</div><div style="font:500 11px I;color:#555;margin-top:6px">Dental PPO™ · Provided by Example Dental Plan</div></div>
<div style="position:absolute;left:0;right:0;bottom:0;height:46px;background:#1FA463;color:#fff;font:500 10px I;display:flex;gap:30px;padding:8px 16px"><div>Enrollee ID<br><b style="font-size:11px">XXXXXXXXXX</b></div><div>Group number<br><b style="font-size:11px">00000-00000</b></div></div></div>'''


def _card_back():
    lines = ''.join(f'<div class="line" style="width:{w}%;height:5px;margin-top:5px"></div>' for w in [96, 88, 92, 70, 95, 84, 90, 60])
    return f'''<div style="width:300px;height:186px;border-radius:12px;background:#fff;border:1px solid #DADDE4;padding:12px 14px;box-sizing:border-box;font-family:I">
<div style="font:700 10px I;text-align:center">Member Services · Claims · Provider Information</div>{lines}
<div class="row" style="justify-content:space-between;margin-top:10px;font:600 9px I;color:#1F7A4A"><span>Dental PPO Network</span><span>Payer ID 00000</span></div></div>'''


def ins_cards():
    fb = lambda c, t: f'<div style="border:1px solid #E5E7EB;border-radius:10px;padding:10px;position:relative">{c}<span style="position:absolute;right:16px;top:16px;background:#3A3F55;color:#fff;font:700 11px I;padding:3px 8px;border-radius:4px">{t}</span></div>'
    kv = lambda k, v: f'<div><div class="lbl">{k}</div><div style="font:500 16px I;margin-top:3px">{v}</div></div>'
    return 760, f'''<div class="app"><div class="hd row" style="justify-content:space-between;align-items:flex-start"><div><h3>Insurance cards (1)</h3><div class="sub">Primary / secondary cards for this patient.</div></div>
<div class="row"><span class="btn">{ico("plus", "#5B34D6", 14)} Add card</span><span class="btn">Request from patient</span></div></div>
<div style="margin:6px 22px 22px;border:1px solid #E5E7EB;border-radius:12px;padding:16px">
<div class="row" style="justify-content:space-between"><div class="row">{pill("PRIMARY", "lilac")}<span class="muted" style="font:500 14px I">Submitted by patient · secure link</span></div><span style="font:500 14px I;color:#5B34D6">Edit</span></div>
<div class="row" style="gap:14px;margin-top:14px">{fb(_card_front(), "FRONT")}{fb(_card_back(), "BACK")}</div>
<div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-top:16px">{kv("Policy", "785694")}{kv("Group", "2568715")}{kv("Subscriber", "Same as patient")}{kv("Subscriber DOB", "—")}</div></div></div>'''


def secure_link():
    return 760, f'''<div class="app"><div class="hd"><h3>Patient Insurance (Optional)</h3><div class="sub">You may submit your patient's insurance information to the specialist's office using one of the following methods.</div></div>
<div style="margin:4px 22px;padding:10px 14px;border-left:3px solid #C9C4DD;background:#F7F7FA;font:500 14px I"><b>Note:</b> These options are mutually exclusive.</div>
<div style="padding:14px 22px"><div style="font:600 17px I">Option 1: Send a Secure Link to the Patient</div><div class="sub" style="margin-top:6px">Select this to have the patient enter their own insurance details via a secure email.</div>
<ul style="font:500 14px I;margin:10px 0 0 18px;padding:0;line-height:1.6"><li><b>Requirements:</b> A valid email address must be entered in the Patient Email field above.</li><li><b>Patient Instructions:</b> The patient receives a secure email from no-reply@inbound.toothreferral.com</li></ul>
<div class="row" style="margin-top:12px;font:500 14px I;align-items:flex-start"><span style="width:16px;height:16px;border:1.5px solid #774AEE;border-radius:3px;background:#774AEE;display:flex;align-items:center;justify-content:center;flex:none;margin-top:2px">{ico("check", "#fff", 12)}</span><span><b>Consent:</b> By selecting this box, you confirm the patient has consented to receive this communication.</span></div>
<div style="height:1px;background:#E5E7EB;margin:16px 0"></div><div style="font:600 17px I">Option 2: Upload Information Manually</div><div class="sub" style="margin-top:6px">Select this if you have the patient's insurance card and policy details ready to upload.</div>
<div class="row" style="justify-content:flex-end;margin-top:16px"><span class="btn solid" style="padding:10px 22px;font-size:15px">Continue</span></div></div></div>'''


def activity():
    rows = [('Barbara', '11/7/2026 9:41 am', 'sent secure insurance request to patient'), ('Patient', '11/7/2026 10:12 am', 'submitted insurance (front and back)'),
            ('Amanda', '11/7/2026 10:30 am', 'verified coverage and scheduled Referral'), ('Tanya', '11/7/2026 10:31 am', 'updated: x-rays added'),
            ('Greg', '11/7/2026 9:20 am', "new referral created for St. Andrew's Family Dental")]
    r = ''.join(f'<div class="row" style="align-items:flex-start;padding:7px 0"><span style="width:7px;height:7px;border-radius:7px;background:#774AEE;margin-top:8px;flex:none"></span><div style="font:500 15px I"><b>{a}</b> <span class="muted">({t})</span> {E(x)}</div></div>' for a, t, x in rows)
    return 700, f'<div class="app"><div class="hd"><h3>Activity log</h3><div class="sub">Every step, with who did it and when.</div></div><div style="padding:0 22px 18px">{r}</div></div>'


def incoming():
    rows = [('CW', '#B5179E', 'Carter Wiley', '11/21/2001', 'Gentle Dental', ('Consultation completed', 'pink')), ('CS', '#4CC9F0', 'Conrad Smith', '11/03/2000', 'North Carolina Hospital Dentistry', ('New', 'grey')),
            ('JC', '#3A0CA3', 'John Carter', '11/06/1990', 'The Dental Center', ('New', 'grey')), ('GM', '#E09F3E', 'George Miranda', '11/11/1997', 'Great West Endodontics', ('Insurance received', 'green'))]
    tr = ''.join(f'''<tr><td><div class="row"><span class="av" style="background:{c}">{i}</span><b style="font:600 14px I">{n}</b></div></td><td>{d}</td><td><span style="color:#1FA463">●</span> {o}</td><td>St. Andrew's Family Dental</td><td>{pill(*s)}</td><td style="color:#5B34D6">View</td></tr>''' for i, c, n, d, o, s in rows)
    return 980, f'''<div class="app"><div class="hd row" style="gap:12px"><div style="flex:1;border:1px solid #DADDE4;border-radius:8px;padding:9px 12px;font:500 14px I;color:#8A8FA0" class="row">{ico("search")} Search patients, DOB, referring office…</div>
<span style="border:1px solid #DADDE4;border-radius:8px;padding:9px 12px;font:500 14px I">Status: All referrals ▾</span><span class="btn solid">Add patient</span></div>
<div style="padding:0 22px 4px;font:500 13px I" class="muted"><span style="color:#1FA463">●</span> Connected Network Member</div>
<table style="width:100%;border-collapse:collapse;font:500 14px I"><tr style="color:#4A5068;font-weight:600;text-align:left">{''.join(f'<th style="padding:12px 14px;border-bottom:1px solid #E5E7EB">{h}</th>' for h in ['Patient Name', 'DOB', 'Referring Office', 'Receiving Office', 'Status', ''])}</tr>
{tr.replace('<td>', '<td style="padding:13px 14px;border-bottom:1px solid #F0F1F4">')}</table></div>'''


def messages():
    m = [('SA', '#774AEE', "Amanda (St. Andrew's Family Dental)", 'Office Manager · Nov 7, 9:52 AM', None, '<span style="color:#19557A">@Greg</span> Seems like the x-rays are from May 2022. Do you have updated x-rays?'),
         ('A', '#2E7D5B', 'Greg (Gentle Dental)', 'Front Desk · Nov 7, 9:54 AM', None, '<span style="color:#19557A">@Amanda</span> I updated the latest x-ray. Let me know if you need anything.'),
         ('SA', '#774AEE', "Amanda (St. Andrew's Family Dental)", 'Office Manager · Nov 7, 9:55 AM', 'Greg (Gentle Dental): I updated the latest x-ray…', '<span style="color:#19557A">@Greg</span> Got the updated x-ray, thank you!')]
    r = ''.join(f'''<div class="row" style="align-items:flex-start;padding:10px 0"><span class="av" style="background:{c}">{i}</span><div style="flex:1"><div style="font:600 16px I">{n} <span class="muted" style="font:500 13px I;margin-left:6px">{t}</span></div>
{f'<div style="margin-top:6px;padding:6px 10px;border-left:2px solid #9F8ACD;background:#F6F4FE;font:500 13px I;color:#6B7085">{q}</div>' if q else ''}<div style="font:500 15px I;margin-top:5px">{b}</div></div></div>''' for i, c, n, t, q, b in m)
    return 820, f'''<div class="app"><div class="hd row">{ico("chat", "#1C1F33", 18)}<div><h3 style="font-size:18px">Office Communication</h3><div class="sub">Messaging with Gentle Dental</div></div></div>
<div style="padding:0 22px">{r}</div><div style="margin:8px 22px 0;border:1px solid #E5E7EB;border-radius:8px;padding:12px 14px;font:500 15px I;color:#A3A6B1">Message Gentle Dental</div>
<div class="row" style="padding:12px 22px 16px;font:500 13px I;color:#25744A">{ico("shield", "#25744A", 14)} All communications are HIPAA compliant and encrypted · Secure</div></div>'''


def status_schedule():
    chips = [('Left a Voicemail', 'green'), ('Voicemail Not Set Up', 'teal'), ('Unable to Contact', 'peach'), ('Declined Appointment', 'grey'), ('Referred Out', 'lilac'),
             ('Cancelled', 'peach'), ('Spoke with Patient / Scheduled', 'yellow'), ('Other', 'grey')]
    return 520, f'''<div class="app"><div class="hd row" style="align-items:flex-start">{ico("cal", "#774AEE", 20)}<div><h3>Status &amp; Schedule</h3><div class="sub">Update referral status, call the office, or schedule an appointment.</div></div></div>
<div style="margin:0 22px 20px;border:1px solid #E5E7EB;border-radius:10px;padding:14px"><div class="muted" style="font:500 13px I">Log a contact attempt</div>
<div style="display:flex;flex-wrap:wrap;gap:8px;margin-top:10px">{''.join(pill(t, c) for t, c in chips)}</div>
<div class="row" style="margin-top:14px"><span style="flex:1;border:1px solid #DADDE4;border-radius:6px;padding:8px 10px;font:500 14px I">Consultation Completed ▾</span><span class="btn">Update Status</span></div>
<div class="row" style="margin-top:14px"><span class="btn">{ico("cal", "#5B34D6", 14)} Schedule</span><span class="btn">{ico("doc", "#5B34D6", 14)} Create a Note</span></div></div></div>'''


def admin_journey():
    j = [('Spoke with Patient / Scheduled', '11/07/2026', 'Spoke with patient and scheduled on 12/07/2026'), ('Consultation Completed', '11/07/2026', 'Consultation completed on 11/07/2026. Patient has scheduled surgery.')]
    r = ''.join(f'<div class="row" style="align-items:flex-start;padding:8px 0"><span style="width:10px;height:10px;border-radius:10px;background:{c};margin-top:5px;flex:none"></span><div style="flex:1"><div class="row" style="justify-content:space-between"><b style="font:600 15px I">{t}</b><span class="muted" style="font:500 13px I">{d}</span></div><div class="muted" style="font:500 14px I;margin-top:3px">{x}</div></div></div>'
                for (t, d, x), c in zip(j, ['#1FA463', '#774AEE']))
    return 520, f'''<div class="app"><div class="hd row" style="justify-content:space-between"><div class="row">{ico("doc", "#774AEE", 20)}<h3>Administrative Notes</h3>{pill("9", "lilac")}</div></div>
<div style="padding:0 22px" class="sub">Company-private notes. Not shared with other parties.</div>
<div style="padding:10px 22px 0">{pill("3 unread @mentions", "lilac")} <span style="font:500 13px I;color:#5B34D6;margin-left:6px">Mark all as read</span></div>
<div style="margin:12px 22px 20px;border:1px solid #E5E7EB;border-radius:10px;padding:12px 14px"><div class="row" style="justify-content:space-between"><b style="font:600 15px I">Journey</b><span class="btn" style="font-size:13px">Copy note to PMS</span></div>{r}</div></div>'''


def template():
    return 860, f'''<div class="app"><div class="hd row" style="justify-content:space-between"><div><h3>Prepare Consultation Note</h3><div class="sub">Review, edit, and sign the consultation note before sending it.</div></div><span style="font:20px I">×</span></div>
<div style="padding:4px 22px 0" class="row"><span style="border:1px solid #774AEE;border-radius:6px;padding:8px 12px;font:500 14px I;width:320px">Oakridge Letterhead · Implant Consult ▾</span><span class="btn">Preview</span></div>
<div style="margin:14px 22px 0;border:1px solid #E5E7EB;border-radius:8px;padding:18px 22px;font:500 15px/1.7 I">
<div style="font:400 22px Georgia;letter-spacing:.04em;border-bottom:2px solid #1F2A44;padding-bottom:6px;margin-bottom:10px">ORAL SURGERY PRACTICE</div>
<span class="var">11/16/2026</span><br><span class="var">Gentle Dental</span> · <span class="var">88 Willow Ave, Austin, TX</span><br>
Re: <span class="var">ROBERT TURNER</span> <span class="var">DOB 04/22/1968</span> · Tooth <span class="var">#30</span> · <span class="var">Implant Consultation</span><br>
Thank you for referring <span class="var">ROBERT TURNER</span> for an implant consultation on <span class="var">11/16/2026</span>.</div>
<div style="margin:14px 22px 20px;border:1px solid #E5E7EB;border-radius:8px;padding:14px 18px"><div style="font:600 15px I;margin-bottom:8px">Who signs this note?</div>
{''.join(f'<div class="row" style="font:500 15px I;padding:4px 0"><span style="width:15px;height:15px;border-radius:15px;border:1.5px solid {"#774AEE" if on else "#8A8FA0"};display:flex;align-items:center;justify-content:center">{"<i style=width:7px;height:7px;border-radius:7px;background:#774AEE;display:block></i>" if on else ""}</span>{t}</div>' for t, on in [("I'll sign it myself", False), ('Sign on behalf of a doctor', False), ('Route to a doctor to sign', True)])}
<div class="row" style="justify-content:flex-end;margin-top:8px"><span class="btn solid">Route to the Doctor to Sign</span></div></div></div>'''


def docusign():
    fields = ''.join(f'<div class="row" style="padding:6px 0;font:500 14px I;color:#3A3F55">{ico(i, "#3A3F55", 15)} {t}</div>' for i, t in [('pen', 'Signature'), ('doc', 'Initial'), ('cal', 'Date Signed'), ('doc', 'Name'), ('doc', 'Title')])
    return 900, f'''<div class="app"><div class="hd row" style="justify-content:space-between"><div class="row"><h3 style="font-size:18px">Sign Completion Note</h3><span style="font:700 16px I"><span style="color:#4C00FF">■</span> docusign</span></div><span style="font:20px I">×</span></div>
<div class="row" style="justify-content:space-between;margin:0 22px;background:#ADD9E0;padding:10px 14px;border-radius:4px"><span style="font:500 15px I">Drag and drop fields from the left panel onto the document</span><span class="btn solid" style="background:#4C2BB8;border-color:#4C2BB8">Finish</span></div>
<div style="display:flex;margin:12px 22px 20px;border:1px solid #E5E7EB;border-radius:6px;min-height:300px"><div style="width:190px;background:#F4F4F4;padding:14px 18px"><div style="font:700 12px I;letter-spacing:.1em;color:#2B2A6B;margin-bottom:6px">FIELDS</div>{fields}</div>
<div style="flex:1;padding:22px 26px;font:400 14px/1.6 Arial">Re: Robert Turner DOB (04/22/1968)<br><br>Dear Gentle Dental team,<br><br>Thank you for referring Robert Turner to our office for treatment. We truly appreciate the opportunity to participate in his care.<br><br>Sincerely,<br>
<div style="display:inline-block;margin-top:8px;border:2px solid #774AEE;border-radius:3px;padding:4px 10px"><div style="font:700 10px I">Signed by:</div><svg width="150" height="40" viewBox="0 0 150 40"><path d="M5 30 C 15 5, 25 5, 28 22 S 40 35, 48 18 S 62 10, 66 26 S 80 34, 90 16 S 110 20, 116 28 S 132 22, 145 14" fill="none" stroke="#1B2A6B" stroke-width="2.4" stroke-linecap="round"/></svg></div></div></div></div>'''


def signed_doc():
    return 640, f'''<div class="app"><div class="hd row" style="justify-content:space-between"><h3>Documents</h3><span class="btn">Edit Documents</span></div>
<div style="margin:0 22px 22px;border:1px solid #E5E7EB;border-radius:10px;padding:16px"><div class="row" style="align-items:flex-start"><span style="width:38px;height:46px;border-radius:6px;background:#F2EDFF;display:flex;align-items:center;justify-content:center">{ico("doc", "#774AEE", 20)}</span>
<div><div style="font:600 16px I">Consultation Note · Robert Turner</div><div class="muted" style="font:500 14px I;margin-top:3px">Signed by the doctor · Nov 16, 4:31 PM</div>
<div class="row" style="margin-top:8px">{pill("✓ Signed", "green")}{pill("Shared with Gentle Dental", "blue")}</div></div></div>
<div class="row" style="margin-top:14px"><span class="btn">{ico("dl", "#5B34D6", 14)} Download</span><span class="btn solid" style="background:#14804A;border-color:#14804A">{ico("check", "#fff", 14)} Copied to PMS</span></div></div></div>'''


SCREENS = {'ui-static-form.png': static_form, 'ui-insurance-cards.png': ins_cards, 'ui-secure-link.png': secure_link, 'ui-activity.png': activity,
           'ui-incoming.png': incoming, 'ui-messages.png': messages, 'ui-status-schedule.png': status_schedule, 'ui-statuses.png': status_schedule,
           'ui-admin-journey.png': admin_journey, 'ui-template.png': template, 'ui-docusign.png': docusign, 'ui-doc.png': signed_doc}


def ui(name, width):
    base, h = SCREENS[name]()
    return f'<div style="width:{base}px;zoom:{width / base:.4f}">{h}</div>'
