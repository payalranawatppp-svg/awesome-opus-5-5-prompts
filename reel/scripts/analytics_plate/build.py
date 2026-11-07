"""Edit the stitched page plate into the new dataset. All coordinates are device px on the page."""
import json, sys
sys.path.insert(0, '.')
from lib import Ed, PLATE
from util import adv, inkbox, monotone, series_pts, poly
D = json.load(open('/home/user/awesome-opus-5-5-prompts/reel/src/data/analytics-demo.json'))
e = Ed()
INK = (24, 27, 47); GRAY = (117, 107, 104); GRAY2 = (113, 109, 122); DARK = (24, 16, 30)
PURPLE = (120, 72, 236); GREEN = (57, 194, 139); AMBER = (234, 181, 80); WHITE = (255, 255, 255)
def put(xink, base, s, size, w, color, align='left'):
    """place text so its ink starts (left) / ends (right) at xink, baseline at base"""
    l, t, r, b = inkbox(s, size, w)
    x = xink - l if align == 'left' else xink - r
    e.text(round(x, 2), base, s, size, w, color)
    return x + l, x + r  # ink extent
# ---------------------------------------------------------------- header: user block (no doctor names)
e.fill((1562, 16, 1846, 80), WHITE)
cx, cy, R = 1586, 47, 19
e.raw(f'<circle cx="{cx}" cy="{cy}" r="{R}" fill="rgb(237,233,254)"/>')
put(cx - inkbox('AM', 10.5, 700)[2] / 2 - 0.5, cy + 5, 'AM', 10.5, 700, (116, 81, 199))
put(1618, 44, D['user']['name'], 15.75, 500, (64, 56, 52))
put(1617, 69, D['user']['role'], 14, 400, GRAY)
# ---------------------------------------------------------------- toolbar: Received badge 9 -> 28 (pill grows, rest shifts 9px)
SH = 9
e.copy((503, 222, 905, 278), SH, 0)
e.fill_rows((503, 222, 503 + SH, 278), 502)
e.fill((484, 234, 486 + 34, 264), None)
e.rect(487, 237, 24 + SH, 24, (121, 81, 238), rx=12)
w = inkbox('28', 11.25, 600)
put(487 + (24 + SH) / 2 - (w[2] - w[0]) / 2, 254, '28', 11.25, 600, (255, 255, 255))
# ---------------------------------------------------------------- KPI cards
K = D['kpi']
def kpi(x, num, unit, base=499):
    e.fill((x - 3, 458, x + 130, 506), WHITE)
    a, b = put(x, base, num, 36, 700, INK)
    if unit:
        put(b + 8, base, unit, 16, 600, GRAY)
kpi(420, str(K['volume']), None)
kpi(788, f"{K['ttfc_h']}", 'h')
kpi(1152, str(K['case_acceptance']), '%')
kpi(1518, str(K['ghost_rate']), '%')
# pill: "↑ 27%  vs prior" in green
e.fill((416, 514, 546, 548), WHITE)
pw = 0
parts = [('↑', 12, 600), (f" {K['volume_vs_prior']}%", 12.25, 700), ('  vs prior', 12, 400)]
txt_w = sum(adv(s, sz, w) for s, sz, w in parts)
e.rect(419, 517, txt_w + 22, 28, (232, 248, 239), rx=7)
x = 430
for s, sz, w in parts:
    e.text(round(x, 2), 536, s, sz, w, (22, 128, 74)); x += adv(s, sz, w)
# sparklines
def spark(x0, x1, vals, color, prior=None, vmax=None, top=563, base=592):
    e.fill((x0 - 4, 552, x1 + 8, 602), WHITE)
    if prior is not None:
        pts = series_pts(prior, x0, x1, base, top, vmax=vmax or max(max(vals), max(prior)))
        e.raw(f'<path d="{monotone(pts)}" fill="none" stroke="rgb(205,205,215)" stroke-width="1.6" stroke-dasharray="5 5"/>')
    pts = series_pts(vals, x0, x1, base, top, vmax=vmax or (max(max(vals), max(prior or [0])) or 1))
    e.raw(f'<path d="{monotone(pts)}" fill="none" stroke="rgb{color}" stroke-width="2.6" stroke-linejoin="round" stroke-linecap="round"/>')
    e.raw(f'<circle cx="{pts[-1][0]:.1f}" cy="{pts[-1][1]:.1f}" r="3.6" fill="rgb{color}"/>')
spark(421, 702, K['spark_volume'], PURPLE, prior=D['prior_daily'])
tt = [v if v is not None else K['spark_ttfc'][1] for v in K['spark_ttfc']]
spark(786, 1069, tt, GREEN, vmax=max(tt) * 1.05)
acc = K['spark_acceptance'][:]; first = next(i for i, v in enumerate(acc) if v); acc[:first] = [acc[first]] * first
spark(1153, 1435, acc, PURPLE, vmax=100)
spark(1519, 1803, K['spark_ghost'], AMBER, vmax=max(K['spark_ghost']) * 1.15)
# ---------------------------------------------------------------- top senders (6 rows) / top procedures (5 rows)
BAR = (243, 238, 254)
def initials(name):
    w = [x for x in name.replace("'s", '').split() if x[0].isupper()]
    return (w[0][0] + w[1][0]).upper()
mx = max(r['count'] for r in D['senders'])
for i, r in enumerate(D['senders']):
    top = 751 + 55 * i
    e.fill((416, top - 3, 1196, top + 39), WHITE)
    e.rect(421, top, 767 * r['count'] / mx, 36, BAR, rx=8)
    e.raw(f'<circle cx="440.5" cy="{top + 17.5}" r="14.5" fill="rgb(221,210,254)"/>')
    ini = initials(r['name']); l, t, rr, b = inkbox(ini, 10.5, 700)
    put(441.5 - (rr - l) / 2, top + 21, ini, 10.5, 700, (116, 81, 199))
    a, b2 = put(467, top + 24, r['name'], 13, 400, DARK)
    put(b2 + 16, top + 24, r['loc'], 11, 500, GRAY2)
    put(1135, top + 24, str(r['count']), 13, 600, DARK, align='right')
    put(1144, top + 24, f"{r['pct']}%", 11.25, 500, GRAY2)
mx = max(r['count'] for r in D['procedures'])
for i, r in enumerate(D['procedures']):
    top = 748 + 49 * i + (1 if i >= 2 else 0)
    e.fill((1262, top - 3, 1812, top + 39), WHITE)
    e.rect(1276, top, 524 * r['count'] / mx, 36, BAR, rx=8)
    put(1292, top + 24, r['name'], 13, 400, DARK)
    put(1746, top + 24, str(r['count']), 13, 600, DARK, align='right')
    put(1754, top + 24, f"{r['pct']}%", 11.25, 500, GRAY2)
# ---------------------------------------------------------------- volume received chart (daily, current vs prior)
GRID = (240, 240, 242)
cur, pri = K['spark_volume'], D['prior_daily']
vmax = max(max(cur), max(pri))  # 3
e.fill((440, 1228, 1312, 1393), WHITE)
y0, ytop = 1386.5, 1241.5
for k in range(vmax + 1):
    yy = y0 - (y0 - ytop) * k / vmax
    if k: e.raw(f'<line x1="462" y1="{yy}" x2="1297" y2="{yy}" stroke="rgb{GRID}" stroke-width="1"/>')
    put(454, round(yy + 3.5), str(k), 8, 400, (113, 110, 111), align='right')
pts = series_pts(pri, 462, 1297, y0, ytop, vmax=vmax)
e.raw(f'<path d="{monotone(pts)}" fill="none" stroke="rgb(205,195,240)" stroke-width="1.5" stroke-dasharray="4 4"/>')
pts = series_pts(cur, 462, 1297, y0, ytop, vmax=vmax)
e.raw(f'<path d="{monotone(pts)}" fill="none" stroke="rgb{PURPLE}" stroke-width="2.2" stroke-linejoin="round"/>')
e.raw(f'<circle cx="1297" cy="{pts[-1][1]:.1f}" r="6" fill="rgb(225,215,252)"/><circle cx="1297" cy="{pts[-1][1]:.1f}" r="3.6" fill="rgb{PURPLE}"/>')
# ---------------------------------------------------------------- referral funnel (leak rows in amber, not red)
F = D['funnel']
AMB_BG, AMB_TX = (254, 246, 231), (186, 112, 22)
rows = [(1228, 1479, 1241), (1313, 1488, 1326), (1398, 1491, 1412), (1483, 1493, 1497)]
for i, (base, cx, bar) in enumerate(rows):
    r = F[i]
    e.fill((cx - 2, base - 15, cx + 30, base + 3), WHITE)
    put(cx, base, str(r['count']), 11.75, 400, GRAY2)
    e.fill((1740, base - 15, 1808, base + 3), WHITE)
    put(1804, base, f"{r['pct']}%", 13.25, 700, DARK, align='right')
    e.fill((1392, bar - 1, 1807, bar + 13), WHITE)
    e.rect(1394, bar, 410, 12, (241, 242, 245), rx=6)
    if r['pct']:
        e.raw('<defs><linearGradient id="fg" x1="0" x2="1"><stop offset="0" stop-color="rgb(117,77,240)"/><stop offset="1" stop-color="rgb(144,96,248)"/></linearGradient></defs>' if i == 0 else '')
        e.raw(f'<rect x="1394" y="{bar}" width="{410 * r["pct"] / 100:.1f}" height="12" rx="6" fill="url(#fg)"/>')
for i, top in enumerate([1261, 1346, 1432]):
    r = F[i]
    e.fill((1392, top - 1, 1806, top + 26), WHITE)
    e.rect(1394, top, 410, 25, AMB_BG, rx=4)
    base = top + 17
    put(1412, base, '↓', 11, 500, AMB_TX)
    a, b = put(1431, base, str(r['dropped']), 11, 700, AMB_TX)
    a, b = put(b + 5, base, 'dropped', 11, 500, AMB_TX)
    e.raw(f'<circle cx="{b + 9.5:.1f}" cy="{base - 4.5}" r="1.05" fill="rgb{AMB_TX}"/>')
    put(b + 20, base, f"{r['leak']}% leak", 11, 500, AMB_TX)
conv = f"{D['conversion']}%"
e.fill((1634, 1549, 1680, 1570), WHITE); put(1636, 1563, conv, 10.75, 700, DARK)
e.fill((1627, 1155, 1680, 1176), WHITE); put(1631, 1169, conv, 12, 700, DARK)
# ---------------------------------------------------------------- lifecycle clocks
CL = D['clocks']
def fmt(v, unit):
    v = round(v, 1)
    s = (f'{v:.1f}' if v % 1 else f'{int(v)}')
    return s + ('h' if unit == 'hours' else 'd')
def clock(key, left, x1, nbase, gtop, gbot, xlab_y):
    c = CL[key]
    # value + unit
    e.fill_bg((left - 4, nbase - 27, left + 140, nbase + 6))
    a, b = put(left + 1, nbase, f"{c['value']}", 24, 700, INK)
    put(b + 8, nbase, c['unit'], 11.5, 400, GRAY)
    # chart
    e.fill_bg((left - 4, gtop - 8, x1 + 10, xlab_y + 5))
    vals = [v for v in c['line'] if v is not None]
    hi, lo = max(vals), min(vals)
    lh, ll = fmt(hi, c['unit']), fmt(lo, c['unit'])
    wlab = max(adv(lh, 8.75, 400), adv(ll, 8.75, 400))
    R = left + wlab
    put(R, gtop + 4, lh, 8.75, 400, (113, 110, 111), align='right')
    put(R, gbot + 3, ll, 8.75, 400, (113, 110, 111), align='right')
    x0 = R + 8
    for yy in (gtop, gbot):
        e.raw(f'<line x1="{x0 - 2}" y1="{yy}" x2="{x1}" y2="{yy}" stroke="rgb(232,231,234)" stroke-width="1.4" stroke-dasharray="6 5"/>')
    n = len(c['line'])
    pts = [(x0 + (x1 - x0) * i / (n - 1), gbot - (gbot - gtop) * (v - lo) / ((hi - lo) or 1)) for i, v in enumerate(c['line']) if v is not None]
    e.raw(f'<path d="{poly(pts)}" fill="none" stroke="rgb{PURPLE}" stroke-width="2.4" stroke-linejoin="round"/>')
    e.raw(f'<circle cx="{pts[-1][0]:.1f}" cy="{pts[-1][1]:.1f}" r="4.4" fill="rgb{PURPLE}"/>')
    put(x0, xlab_y, 'Oct 8', 8.75, 400, (113, 110, 111))
    l, t, r_, bb = inkbox('Oct 23', 8.75, 400)
    put((x0 + x1) / 2 - (r_ - l) / 2, xlab_y, 'Oct 23', 8.75, 400, (113, 110, 111))
    put(x1, xlab_y, 'Nov 7', 8.75, 400, (113, 110, 111), align='right')
clock('ttfc', 419, 842, 1791, 1830.5, 1912, 1938)
clock('tts', 899, 1322, 1791, 1830.5, 1912, 1938)
clock('wait', 419, 842, 2049, 2088.5, 2170, 2196)
clock('age', 899, 1322, 2049, 2088.5, 2170, 2196)
# time to completion: was "No data yet" -> now has data, same layout as its neighbours
e.fill_bg((1372, 1765, 1808, 1950))
clock('ttc', 1379, 1802, 1791, 1830.5, 1912, 1938)
# ---------------------------------------------------------------- consultations: KPI row + chart
C = D['consult']
def ckpi(x, num, unit):
    e.fill_bg((x - 3, 2298, x + 150, 2347))
    a, b_ = put(x, 2340, num, 36, 700, INK)
    if unit: put(b_ + 8, 2340, unit, 16, 600, GRAY)
ckpi(420, str(C['scheduled']), None)
ckpi(786, str(C['consult_to_completion_d']), 'd')
ckpi(1152, str(C['referrals_to_consultation']), '%')
ckpi(1522, str(C['consultations_completed']), '%')
# sparkline in the first card
e.fill_bg((414, 2352, 712, 2402))
vm = max(max(C['daily']), max(C['prior']))
pts = series_pts(C['prior'], 421, 702, 2393, 2363, vmax=vm)
e.raw(f'<path d="{monotone(pts)}" fill="none" stroke="rgb(205,205,215)" stroke-width="1.6" stroke-dasharray="5 5"/>')
pts = series_pts(C['daily'], 421, 702, 2393, 2363, vmax=vm)
e.raw(f'<path d="{monotone(pts)}" fill="none" stroke="rgb{PURPLE}" stroke-width="2.6" stroke-linejoin="round"/><circle cx="702" cy="{pts[-1][1]:.1f}" r="3.6" fill="rgb{PURPLE}"/>')
# big chart
e.fill_bg((450, 2590, 1792, 2840))
vm = max(max(C['daily']), max(C['prior']))
y0c, ytc = 2831, 2606
for k in range(vm + 1):
    yy = y0c - (y0c - ytc) * k / vm
    if k: e.raw(f'<line x1="483" y1="{yy}" x2="1779" y2="{yy}" stroke="rgb(236,236,239)" stroke-width="1.3"/>')
    put(471, round(yy + 5), str(k), 12, 400, (113, 110, 111), align='right')
pts = series_pts(C['prior'], 483, 1779, y0c, ytc, vmax=vm)
e.raw(f'<path d="{monotone(pts)}" fill="none" stroke="rgb(205,195,240)" stroke-width="1.8" stroke-dasharray="5 5"/>')
pts = series_pts(C['daily'], 483, 1779, y0c, ytc, vmax=vm)
e.raw(f'<path d="{monotone(pts)}" fill="none" stroke="rgb{PURPLE}" stroke-width="2.8" stroke-linejoin="round"/>')
e.raw(f'<circle cx="1779" cy="{pts[-1][1]:.1f}" r="7.5" fill="rgb(225,215,252)"/><circle cx="1779" cy="{pts[-1][1]:.1f}" r="4.5" fill="rgb{PURPLE}"/>')
# ---------------------------------------------------------------- needs attention (only the counts change) + staff table
N_ = D['needs']
for base, n in [(3068, N_['past_appointments']), (3121, N_['ghosts']), (3175, N_['insurance'])]:
    e.fill_bg((458, base - 15, 474, base + 3))
    put(461, base, str(n), 13, 700, DARK)
AV = e.color(1279, 3101)
for i, s_ in enumerate(D['staff']):
    nb = 3106 + 64 * i
    e.fill_bg((1268, nb - 15, 1812, nb + 26))
    cy_ = nb + 5.5
    e.raw(f'<circle cx="1291.5" cy="{cy_}" r="17.5" fill="rgb{AV}"/>')
    ini = s_['name'][:2].upper(); l, t, r_, bb = inkbox(ini, 10.5, 700)
    put(1292.5 - (r_ - l) / 2, round(cy_ + 4), ini, 10.5, 700, (116, 81, 199))
    put(1322, nb, s_['name'], 12, 500, DARK)
    put(1322, nb + 21, s_['role'], 11, 400, GRAY)
    put(1612, nb + 10, str(s_['logins']), 12, 400, DARK, align='right')
    put(1712, nb + 10, s_['avg'], 12, 400, DARK, align='right')
    put(1802, nb + 10, str(s_['changes']), 12, 700, DARK, align='right')
# ---------------------------------------------------------------- donuts: referral outcomes + sources
import math
def donut(cx, cy, segs, total):
    e.fill_bg((cx - 92, cy - 92, cx + 93, cy + 93))
    r, w = 74.75, 27.5
    a = 0.0
    nz = [s for s in segs if s[0]]
    gap = 0 if len(nz) < 2 else 1.4 / r
    for cnt, col in segs:
        if not cnt: continue
        a1 = a + 2 * math.pi * cnt / total
        s0, s1 = a + gap, a1 - gap
        x0, y0 = cx + r * math.sin(s0), cy - r * math.cos(s0)
        x1, y1 = cx + r * math.sin(s1), cy - r * math.cos(s1)
        large = 1 if s1 - s0 > math.pi else 0
        e.raw(f'<path d="M{x0:.2f},{y0:.2f} A{r},{r} 0 {large} 1 {x1:.2f},{y1:.2f}" fill="none" stroke="rgb{col}" stroke-width="{w}"/>')
        a = a1
    l, t, r_, bb = inkbox(str(total), 24, 700)
    put(cx + 0.5 - (r_ - l) / 2, 3517, str(total), 24, 700, INK)
    l, t, r_, bb = inkbox('referrals', 11, 400)
    put(cx + 0.5 - (r_ - l) / 2, 3540, 'referrals', 11, 400, GRAY)
OC = [(161, 64, 240), (234, 156, 16), (19, 157, 174), (42, 95, 228), (29, 204, 127), (152, 155, 168)]
O = D['outcomes']
donut(518.5, 3517.5, [(o['count'], c) for o, c in zip(O, OC)], sum(o['count'] for o in O))
e.fill_bg((645, 3595, 665, 3615)); e.rect(648.6, 3598.6, 12.4, 12.4, OC[5], rx=2.6)  # closed w/o completion: grey, not red
for i, o in enumerate(O):
    base = 3435 + 35 * i
    e.fill_bg((990, base - 14, 1080, base + 4))
    put(1014, base, str(o['count']), 12, 600, DARK, align='right')
    put(1068, base, f"{o['pct']}%", 10.75, 500, GRAY2, align='right')
SC = [(119, 73, 238), (65, 128, 239), (33, 200, 167)]
S_ = D['sources']
donut(1251.5, 3517.5, [(s_['count'], c) for s_, c in zip(S_, SC)], sum(s_['count'] for s_ in S_))
for i, s_ in enumerate(S_):
    base = 3487 + 35 * i
    e.fill_bg((1722, base - 14, 1808, base + 4))
    put(1748, base, str(s_['count']), 12, 600, DARK, align='right')
    put(1801, base, f"{s_['pct']}%", 10.75, 500, GRAY2, align='right')
# ---------------------------------------------------------------- status board
COLS = [419, 785, 1152, 1518]
BD = {x['status']: x for x in D['board']}
AVC = e.color(434, 3866)
def card(col, dy, st):
    x = COLS[col]; c = BD[st]
    e.fill_bg((x - 6, 3768 + dy, x + 296, 3990 + dy))
    put(x, 3801 + dy, str(c['count']), 30, 700, INK)
    if not c['count']:
        e.rect(x, 3828.5 + dy, 15, 1.4, (150, 145, 155)); put(x + 1, 3871 + dy, 'No referrals in this status', 12, 400, (150, 147, 160))
        return
    put(x, 3834 + dy, f"Avg {c['avg']} · Longest {c['longest']}", 12, 400, GRAY2)
    for j, row in enumerate(c['rows']):
        nb = 3882 + dy + 45 * j
        e.raw(f'<circle cx="{x + 15}" cy="{nb - 4}" r="15" fill="rgb{AVC}"/>')
        l, t, r_, bb = inkbox(row['initials'], 8.5, 700)
        put(x + 15.5 - (r_ - l) / 2, nb - 1, row['initials'], 8.5, 700, (116, 81, 199))
        put(x + 42, nb, row['patient'], 12, 600, DARK)
        put(x + 288, nb, row['age'], 11.5, 500, GRAY2, align='right')
for i, st in enumerate(['New', 'Received', 'In Progress', 'Left a Voice Message']):
    card(i, 0, st)
for i, st in enumerate(['Consultation Scheduled', 'Consultation Completed', 'Scheduled']):
    card(i, 546, st)
for i, c in enumerate(D['closed']):
    x = COLS[i]
    e.fill_bg((x + 230, 4615, x + 292, 4650))
    put(x + 284, 4643, str(c['count']), 24, 700, INK, align='right')
if __name__ == '__main__':
    out = e.render('edit.png', blur=0.4)
