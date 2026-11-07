"""Build one consistent demo dataset for the Analytics page and compute every number and chart from it.

28 referrals received Oct 8 - Nov 7, 2026 (31 days), each with its own events (received, first contact attempts,
consultation scheduled, consultation completed, treatment scheduled, completed or closed) and current status. Every
KPI, table, funnel, clock, donut, status card and chart series on the page is derived from these records, so they
always agree with each other. Writes src/data/analytics-demo.json.

Client rules: no doctors' names (patients and staff only), staff Amanda / Tanya / Barbara / Greg, offices are
fictional; the receiving office is Gentle dental clinic (as in the recording) and St. Andrew's Family Dental sends to it.
The layout constraints of the real page (6 sender rows, 5 procedure rows, 3 staff rows, empty middle status row) are respected.
"""
import datetime as dt
import json
import random
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
rng = random.Random(28)
D0 = dt.datetime(2026, 10, 8)
NOW = dt.datetime(2026, 11, 7, 17, 0)
DAYS = [D0 + dt.timedelta(days=i) for i in range(31)]

SENDERS = [  # name, location, count (sum 28)
    ("St. Andrew's Family Dental", "St. George, UT", 7),
    ("Bright Smile Family Dentistry", "Cedar City, UT", 6),
    ("Maple Grove Dental", "Hurricane, UT", 5),
    ("Riverside Dental Care", "Washington, UT", 4),
    ("Lakeside Family Dentistry", "Ivins, UT", 3),
    ("Summit Dental Group", "Santa Clara, UT", 3),
]
PROCEDURES = [("Implant Restoration", 8), ("Crown Recementation", 6), ("Sleep Appliance", 5), ("New Patient Dental Exam and Dental Cleaning", 5), ("Second opinion", 4)]
SOURCES = [("Network", 19), ("Embed widget", 7), ("Manual", 2)]
STAFF = [("Amanda", "Office manager"), ("Tanya", "Front desk"), ("Barbara", "Dental assistant")]
STAFF_W = [0.42, 0.38, 0.20]
FINAL = (["Completed"] * 9 + ["Scheduled"] * 4 + ["Consultation Completed"] * 4 + ["Consultation Scheduled"] * 3 + ["Left a Voice Message"] * 3 + ["In Progress"]
         + ["New"] * 2 + ["Received"] + ["Declined Appointment"])
FIRST = ["Olivia", "Liam", "Emma", "Noah", "Ava", "Mason", "Sophia", "Lucas", "Mia", "Ethan", "Isabella", "Logan", "Harper", "Elijah", "Evelyn", "James", "Abigail", "Benjamin", "Ella", "Henry", "Grace", "Daniel", "Chloe", "Owen", "Lily", "Jack", "Zoe", "Ryan"]
LAST = ["Parker", "Reed", "Morgan", "Hayes", "Brooks", "Foster", "Bennett", "Coleman", "Russell", "Griffin", "Hughes", "Sanders", "Price", "Myers", "Long", "Ross", "Powell", "Jenkins", "Perry", "Butler", "Barnes", "Fisher", "Henderson", "Ward", "Cox", "Howard", "Kelly", "Bailey"]


def expand(pairs):
    out = [p[0] for p in pairs for _ in range(p[-1])]
    rng.shuffle(out)
    return out


senders, procs, srcs = expand(SENDERS), expand(PROCEDURES), expand(SOURCES)
# received dates: spread over the 31 days, more in the second half (growing network)
weights = [0.6 + 0.9 * i / 30 for i in range(31)]
recv_days = sorted(rng.choices(range(31), weights=weights, k=28))
# the two "New" referrals must be the most recent ones; closed/completed ones the oldest
order = sorted(range(28), key=lambda i: {"Completed": 0, "Declined Appointment": 1, "Scheduled": 2, "Consultation Completed": 3, "Consultation Scheduled": 5, "Left a Voice Message": 6, "In Progress": 6, "Received": 8, "New": 9}[FINAL[i]] + rng.random() * 0.9)
status_by_slot = [FINAL[i] for i in order]

refs = []
for k in range(28):
    st = status_by_slot[k]
    day = recv_days[k]
    if st in ("New", "Received"):
        day = max(day, 29)
    recv = DAYS[day] + dt.timedelta(hours=rng.uniform(8, 16.5))
    r = {"id": k + 1, "patient": f"{FIRST[k]} {LAST[k]}", "sender": senders[k], "procedure": procs[k], "source": srcs[k], "status": st, "received": recv, "events": []}
    def ev(t, kind, who=None, note=None):
        r["events"].append({"t": t, "kind": kind, "who": who or rng.choices([s[0] for s in STAFF], STAFF_W)[0], "note": note})
        return t
    ev(recv, "received", who=rng.choice(["Amanda", "Tanya"]))
    t = recv
    if st not in ("New", "Received"):
        t = ev(recv + dt.timedelta(hours=rng.uniform(0.4, 6.5)), "first_contact")
        r["first_contact"] = t
    if st == "Left a Voice Message" and sum(1 for x in refs if x.get("ghost")) < 2:
        r["ghost"] = True  # 3+ attempts logged, patient never reached
        for _ in range(3):
            t = ev(t + dt.timedelta(hours=rng.uniform(20, 30)), "attempt")
    if st in ("Left a Voice Message", "In Progress"):
        ev(t + dt.timedelta(hours=rng.uniform(1, 20)), "status")
    reached_sched = st in ("Consultation Scheduled", "Consultation Completed", "Scheduled", "Completed")
    if reached_sched or st == "Declined Appointment":
        t = ev(t + dt.timedelta(hours=rng.uniform(4, 30)), "consult_scheduled" if reached_sched else "declined")
        if reached_sched:
            r["consult_scheduled"] = t
            r["consult_at"] = t + dt.timedelta(days=rng.uniform(2, 6))
    if st in ("Consultation Completed", "Scheduled", "Completed"):
        t = ev(r["consult_at"], "consult_completed")
        r["consult_completed"] = t
    if st in ("Scheduled", "Completed"):
        t = ev(t + dt.timedelta(hours=rng.uniform(2, 30)), "treatment_scheduled")
        r["treatment_scheduled"] = t
        r["treatment_at"] = t + dt.timedelta(days=rng.uniform(2, 7))
    if st == "Completed":
        t = ev(r["treatment_at"], "completed")
        r["completed"] = t
    refs.append(r)

# keep every event before "now" (the page is a snapshot at NOW): push late referrals' future events back to statuses
for r in refs:
    assert all(e["t"] <= NOW for e in r["events"] if e["kind"] in ("received", "first_contact")), r
# the consultation dates of "Consultation Scheduled" referrals: one of them is past (needs a completion note)
cs = [r for r in refs if r["status"] == "Consultation Scheduled"]
cs[0]["consult_at"] = NOW - dt.timedelta(days=1, hours=3)
cs[1]["consult_at"] = NOW - dt.timedelta(hours=20)
for r in cs[2:]:
    r["consult_at"] = max(r["consult_at"], NOW + dt.timedelta(days=1))
# completed events must be in the past: clamp
for r in refs:
    for e in r["events"]:
        if e["t"] > NOW:
            e["t"] = NOW - dt.timedelta(hours=rng.uniform(1, 30))
    r["events"].sort(key=lambda e: e["t"])
    for key, kind in [("consult_completed", "consult_completed"), ("completed", "completed"), ("treatment_scheduled", "treatment_scheduled"), ("consult_scheduled", "consult_scheduled")]:
        if key in r:
            r[key] = next(e["t"] for e in r["events"] if e["kind"] == kind)

H = lambda a, b: (b - a).total_seconds() / 3600
mean = lambda xs: sum(xs) / len(xs) if xs else 0
pct = lambda a, b: round(100 * a / b) if b else 0

# ------------------------------------------------------------------ KPIs
N = len(refs)
prior_daily = [0] * 31
for _ in range(22):
    prior_daily[rng.choices(range(31), weights=[0.6 + 0.5 * i / 30 for i in range(31)])[0]] += 1
cur_daily = [0] * 31
for r in refs:
    cur_daily[(r["received"] - D0).days] += 1
contacted = [r for r in refs if "first_contact" in r]
ttfc = mean([H(r["received"], r["first_contact"]) for r in contacted])
consult_done = [r for r in refs if "consult_completed" in r]
accepted = [r for r in consult_done if r["status"] in ("Scheduled", "Completed")]
ghosts = [r for r in refs if r.get("ghost")]
sched = [r for r in refs if "consult_scheduled" in r]
done = [r for r in refs if r["status"] == "Completed"]


def by_day(items, f, mode="mean"):
    """daily series over the 31 days: value per day from items whose day matches."""
    out = []
    for i, d in enumerate(DAYS):
        xs = [f(r) for r in items if (r["received"].date() == d.date())]
        out.append(round(mean(xs), 2) if xs else None)
    return out


def running(items, f):
    """running average of everything received up to each day; the last point equals the headline value"""
    out = []
    for d in DAYS:
        xs = [f(r) for r in items if r["received"].date() <= d.date()]
        out.append(round(mean(xs), 2) if xs else None)
    return out


def cumulative_pct(pred_num, pred_den):
    out = []
    for d in DAYS:
        end = d + dt.timedelta(days=1)
        den = [r for r in refs if r["received"] < end and pred_den(r)]
        num = [r for r in den if pred_num(r)]
        out.append(round(100 * len(num) / len(den), 1) if den else 0)
    return out


def fill(xs):
    """carry the last value forward (a clock line between data points)"""
    out, last = [], None
    for x in xs:
        last = x if x is not None else last
        out.append(last)
    return out


kpi = {
    "volume": N,
    "volume_prior": sum(prior_daily),
    "volume_vs_prior": pct(N - sum(prior_daily), sum(prior_daily)),
    "ttfc_h": round(ttfc, 1),
    "case_acceptance": pct(len(accepted), len(consult_done)),
    "ghost_rate": pct(len(ghosts), N),
    "spark_volume": cur_daily,
    "spark_ttfc": running(contacted, lambda r: H(r["received"], r["first_contact"])),
    "spark_acceptance": cumulative_pct(lambda r: r["status"] in ("Scheduled", "Completed"), lambda r: "consult_completed" in r),
    "spark_ghost": cumulative_pct(lambda r: r.get("ghost", False), lambda r: True),
}
# ------------------------------------------------------------------ tables
def tally(key, names):
    return [{"name": n, "count": sum(1 for r in refs if r[key] == n), "pct": pct(sum(1 for r in refs if r[key] == n), N)} for n in names]


senders_t = sorted([dict(x, loc=dict((s[0], s[1]) for s in SENDERS)[x["name"]]) for x in tally("sender", [s[0] for s in SENDERS])], key=lambda x: -x["count"])
procs_t = sorted(tally("procedure", [p[0] for p in PROCEDURES]), key=lambda x: -x["count"])
sources_t = tally("source", ["Embed widget", "Network", "Manual"])
# ------------------------------------------------------------------ funnel
stages = [("Received", N), ("Contacted", len(contacted)), ("Scheduled", len(sched)), ("Completed", len(done))]
funnel = []
for i, (n_, c) in enumerate(stages):
    row = {"name": n_, "count": c, "pct": pct(c, N)}
    if i < 3:
        drop = c - stages[i + 1][1]
        row.update(dropped=drop, leak=pct(drop, c))
    funnel.append(row)
# ------------------------------------------------------------------ lifecycle clocks (values + daily lines)
tts = mean([H(r["first_contact"], r["consult_scheduled"]) for r in sched])
ttc = mean([H(r["received"], r["completed"]) / 24 for r in done])
wait = mean([H(r["consult_scheduled"], r["consult_at"]) / 24 for r in sched])
open_refs = [r for r in refs if r["status"] not in ("Completed", "Declined Appointment")]
age_now = mean([H(r["received"], NOW) / 24 for r in open_refs])


def open_age_series():
    out = []
    for d in DAYS:
        at = d + dt.timedelta(hours=17)
        live = [r for r in refs if r["received"] <= at and not (("completed" in r and r["completed"] <= at) or any(e["kind"] == "declined" and e["t"] <= at for e in r["events"]))]
        out.append(round(mean([H(r["received"], at) / 24 for r in live]), 2) if live else None)
    return out


def prior(series, f=0.82, jitter=0.18):
    return [None if v is None else round(v * (f + rng.uniform(-jitter, jitter)), 2) for v in series]


clocks = {
    "ttfc": {"value": round(ttfc, 1), "unit": "hours", "line": running(contacted, lambda r: H(r["received"], r["first_contact"]))},
    "tts": {"value": round(tts, 1), "unit": "hours", "line": running(sched, lambda r: H(r["first_contact"], r["consult_scheduled"]))},
    "ttc": {"value": round(ttc, 1), "unit": "days", "line": running(done, lambda r: H(r["received"], r["completed"]) / 24)},
    "wait": {"value": round(wait, 1), "unit": "days", "line": running(sched, lambda r: H(r["consult_scheduled"], r["consult_at"]) / 24)},
    "age": {"value": round(age_now, 1), "unit": "days", "line": open_age_series()},
}
for c in clocks.values():
    c["prior"] = prior(c["line"], 1.18)
# ------------------------------------------------------------------ consultations
cons_daily = [0] * 31
for r in sched:
    cons_daily[(r["consult_scheduled"] - D0).days] += 1 if (r["consult_scheduled"] - D0).days < 31 else 0
cons_prior = [0] * 31
for _ in range(14):
    cons_prior[rng.randrange(31)] += 1
c2c = mean([H(r["consult_completed"], r["completed"]) / 24 for r in done])
consult = {
    "scheduled": len(sched),
    "consult_to_completion_d": round(c2c),
    "referrals_to_consultation": pct(len(sched), N),
    "consultations_completed": pct(len(consult_done), len(sched)),
    "daily": cons_daily,
    "prior": cons_prior,
}
assert sum(cons_daily) == len(sched)
# ------------------------------------------------------------------ needs attention
past_no_note = [r for r in refs if r["status"] == "Consultation Scheduled" and r["consult_at"] < NOW]
needs = {"past_appointments": len(past_no_note), "ghosts": len(ghosts), "insurance": 3}
# ------------------------------------------------------------------ staff responsiveness (changes = their logged events)
staff = []
for name, role in STAFF:
    ch = sum(1 for r in refs for e in r["events"] if e["who"] == name)
    staff.append({"name": name, "role": role, "changes": ch})
logins = {"Amanda": 24, "Tanya": 21, "Barbara": 11}
avg = {"Amanda": "38m", "Tanya": "31m", "Barbara": "14m"}
for s in staff:
    s["logins"], s["avg"] = logins[s["name"]], avg[s["name"]]
staff.sort(key=lambda s: -s["changes"])
# ------------------------------------------------------------------ outcomes + status board
group = {"New": "Awaiting contact", "Received": "Awaiting contact", "In Progress": "Working", "Left a Voice Message": "Working", "Voicemail Not Set Up": "Working",
         "Other": "Working", "Callback Requested": "Working", "Unable to Contact": "Working", "Consultation Scheduled": "Consultation", "Consultation Completed": "Consultation",
         "Scheduled": "Scheduled", "Completed": "Completed", "Cancelled": "Closed w/o completion", "Declined Appointment": "Closed w/o completion", "Referred Out": "Closed w/o completion"}
outcome_names = ["Awaiting contact", "Working", "Consultation", "Scheduled", "Completed", "Closed w/o completion"]
outcomes = [{"name": g, "count": sum(1 for r in refs if group[r["status"]] == g)} for g in outcome_names]
for o in outcomes:
    o["pct"] = pct(o["count"], N)
board_open = ["New", "Received", "In Progress", "Left a Voice Message", "Voicemail Not Set Up", "Other", "Callback Requested", "Unable to Contact", "Consultation Scheduled", "Consultation Completed", "Scheduled"]


def since_status(r):
    last = r["events"][-1]["t"]
    return H(last, NOW)


def fmt_dh(h):
    d, hh = int(h // 24), int(round(h % 24))
    if hh == 24:
        d, hh = d + 1, 0
    return f"{d}d {hh}h" if d else f"{hh}h"


board = []
for s in board_open:
    rs = sorted([r for r in refs if r["status"] == s], key=lambda r: -since_status(r))
    hs = [since_status(r) for r in rs]
    board.append({"status": s, "count": len(rs), "avg": fmt_dh(mean(hs)) if rs else None, "longest": fmt_dh(max(hs)) if rs else None,
                  "rows": [{"patient": r["patient"], "initials": ".".join(w[0] for w in r["patient"].split()) + ".", "age": fmt_dh(since_status(r))} for r in rs[:3]]})
closed = [{"status": s, "count": sum(1 for r in refs if r["status"] == s)} for s in ["Completed", "Cancelled", "Declined Appointment", "Referred Out"]]
# ------------------------------------------------------------------ checks: everything adds up
assert sum(o["count"] for o in outcomes) == N
assert sum(b["count"] for b in board) + sum(c["count"] for c in closed) == N
assert sum(x["count"] for x in senders_t) == N and sum(x["count"] for x in procs_t) == N and sum(x["count"] for x in sources_t) == N
assert sum(cur_daily) == N
assert all(b["count"] == 0 for b in board if b["status"] in ("Voicemail Not Set Up", "Other", "Callback Requested", "Unable to Contact"))
assert len(ghosts) == 2
for c in clocks.values():
    assert round(c["line"][-1], 1) == c["value"], c
assert funnel[0]["count"] - funnel[0]["dropped"] == funnel[1]["count"]

out = {
    "office": "Gentle dental clinic",
    "user": {"name": "Amanda", "role": "Office Manager", "initials": "AM"},
    "period": {"from": D0.strftime("%b %-d"), "to": DAYS[-1].strftime("%b %-d"), "labels": [d.strftime("%b %-d") for d in DAYS]},
    "received_tab": N, "sent_tab": 3, "notifications": 26,
    "kpi": kpi, "prior_daily": prior_daily, "senders": senders_t, "procedures": procs_t, "sources": sources_t, "funnel": funnel,
    "conversion": funnel[3]["pct"], "clocks": clocks, "consult": consult, "needs": needs, "staff": staff, "outcomes": outcomes,
    "board": board, "closed": closed,
}
json.dump(out, open(ROOT / "src/data/analytics-demo.json", "w"), indent=1, default=str)
print(json.dumps({k: out[k] for k in ["kpi", "funnel", "consult", "needs", "outcomes", "sources", "closed"]}, default=str)[:2500])
print("staff", staff)
print("board", [(b["status"], b["count"], b["avg"], b["longest"]) for b in board])
print("clocks", {k: (v["value"], v["unit"]) for k, v in clocks.items()})
