"""Builds TOOTH-REFERRAL-DASHBOARD-GUIDE.md (+ chapter list json) with video timecodes from the compendium plan."""
import json, pathlib
H = pathlib.Path(__file__).parent
FPS = 30
INTRO = 120
CH = [  # (key, title, frames)
 ("incoming", "Incoming Referrals", 150), ("case", "Case Details", 450), ("messages", "Messages tab", 150),
 ("consult", "Prepare Consultation Note", 150), ("leadforms", "Website Lead Forms", 180), ("analytics", "Analytics", 540),
 ("dayprep", "Provider's Day-Prep Station", 480), ("casechat", "Case chat (Office Communication)", 500),
 ("completion", "Completion note, route to doctor, e-sign", 1020), ("anwalk", "Analytics walk-through", 1800),
]
TR = [("TR-01", "Dashboard overview", 135), ("TR-02", "New referral", 150), ("TR-03", "Incoming referral", 135), ("TR-04", "Office Communication", 135),
      ("TR-05", "Case lifecycle", 150), ("TR-06", "Analytics KPIs", 135), ("TR-07", "Needs attention", 135), ("TR-08", "Referral journey", 135),
      ("TR-09", "Insurance link", 140), ("TR-10", "Notification stack", 150), ("TR-11", "Referral funnel", 120), ("TR-12", "Before and after", 150),
      ("TR-13", "Referral network", 150), ("TR-14", "Case stack", 150), ("TR-15", "Big stats", 135), ("TR-16", "Set up in about 5 minutes", 120)]
rows, t = [], INTRO
for k, ti, d in CH + [(a, b, c) for a, b, c in TR]:
    rows.append(dict(key=k, title=ti, start=t / FPS, end=(t + d) / FPS)); t += d
TOTAL = t + 90
def tc(s): s = int(round(s)); return f"{s // 60}:{s % 60:02d}"
T = {r["key"]: f"{tc(r['start'])}–{tc(r['end'])}" for r in rows}
(H / "chapters.json").write_text(json.dumps(dict(total=TOTAL / FPS, chapters=rows), indent=1))
tpl = (H / "guide.template.md").read_text()
for k, v in T.items(): tpl = tpl.replace("{{" + k + "}}", v)
tpl = tpl.replace("{{TOTAL}}", tc(TOTAL / FPS))
(H / "TOOTH-REFERRAL-DASHBOARD-GUIDE.md").write_text(tpl)
print("total", tc(TOTAL / FPS), len(rows), "chapters")
