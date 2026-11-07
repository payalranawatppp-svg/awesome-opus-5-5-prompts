/**
 * "Analytics demo": a screen-recording-style walk down the ToothReferral Analytics page, rebuilt in code with one
 * consistent demo dataset (scripts/analytics_data.py -> src/data/analytics-demo.json): 28 referrals in the last
 * 30 days, and every KPI, table, chart, funnel, clock, donut and status card computed from those same 28 records.
 * Layout and type follow the real page (screen recording 4, 1920x842); the page scrolls like the recording, with a
 * cursor. No doctors' names (patients and staff only); no red (amber for leaks).
 */
import React from "react";
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import data from "../data/analytics-demo.json";
import { FontGate } from "../effects";
import { easeIO } from "../tr/motion";
import { clamp } from "../tr/ui";

export const AN_W = 1920;
export const AN_H = 842;
export const AN_DURATION = 60 * 30;

const D = data as unknown as {
  office: string; user: { name: string; role: string; initials: string }; period: { labels: string[] }; received_tab: number; sent_tab: number; notifications: number;
  kpi: { volume: number; volume_vs_prior: number; ttfc_h: number; case_acceptance: number; ghost_rate: number; spark_volume: number[]; spark_ttfc: (number | null)[]; spark_acceptance: number[]; spark_ghost: number[] };
  prior_daily: number[]; senders: { name: string; loc: string; count: number; pct: number }[]; procedures: { name: string; count: number; pct: number }[];
  sources: { name: string; count: number; pct: number }[]; funnel: { name: string; count: number; pct: number; dropped?: number; leak?: number }[]; conversion: number;
  clocks: Record<"ttfc" | "tts" | "ttc" | "wait" | "age", { value: number; unit: string; line: (number | null)[]; prior: (number | null)[] }>;
  consult: { scheduled: number; consult_to_completion_d: number; referrals_to_consultation: number; consultations_completed: number; daily: number[]; prior: number[] };
  needs: { past_appointments: number; ghosts: number; insurance: number };
  staff: { name: string; role: string; logins: number; avg: string; changes: number }[]; outcomes: { name: string; count: number; pct: number }[];
  board: { status: string; count: number; avg: string | null; longest: string | null; rows: { patient: string; initials: string; age: string }[] }[]; closed: { status: string; count: number }[];
};

const C = { ink: "#14152B", text: "#3A3F55", muted: "#6B7085", faint: "#9AA0B4", line: "#ECEDF3", card: "#FFFFFF", bg: "#F8F8FA", side: "#DBE9F8", purple: "#7146EA", purpleSoft: "#EFEAFE", green: "#1FB97A", amber: "#E0A11B", amberBg: "#FFF5E3", amberInk: "#B26F00", blue: "#3D7EF0", teal: "#1597A6" };
const F = "Inter";
const card: React.CSSProperties = { position: "absolute", background: C.card, borderRadius: 18, border: `1px solid ${C.line}`, boxShadow: "0 1px 2px rgba(20,20,50,0.04)" };

// ---------------------------------------------------------------------------------------------------
// Small charts (SVG). Smooth lines use a monotone cubic so peaks never overshoot below zero.

const monotone = (pts: [number, number][]) => {
  if (pts.length < 2) return "";
  const n = pts.length;
  const dx = (i: number) => pts[i + 1][0] - pts[i][0];
  const m = pts.slice(0, -1).map((p, i) => (pts[i + 1][1] - p[1]) / dx(i));
  const t: number[] = [m[0]];
  for (let i = 1; i < n - 1; i++) t.push(m[i - 1] * m[i] <= 0 ? 0 : (m[i - 1] + m[i]) / 2);
  t.push(m[n - 2]);
  for (let i = 0; i < n - 1; i++) {
    if (m[i] === 0) {
      t[i] = 0;
      t[i + 1] = 0;
    } else {
      const a = t[i] / m[i];
      const b = t[i + 1] / m[i];
      const s = a * a + b * b;
      if (s > 9) {
        const k = 3 / Math.sqrt(s);
        t[i] = k * a * m[i];
        t[i + 1] = k * b * m[i];
      }
    }
  }
  let d = `M${pts[0][0]},${pts[0][1]}`;
  for (let i = 0; i < n - 1; i++) {
    const h = dx(i) / 3;
    d += ` C${pts[i][0] + h},${pts[i][1] + t[i] * h} ${pts[i + 1][0] - h},${pts[i + 1][1] - t[i + 1] * h} ${pts[i + 1][0]},${pts[i + 1][1]}`;
  }
  return d;
};
const straight = (pts: [number, number][]) => pts.map((p, i) => `${i ? "L" : "M"}${p[0]},${p[1]}`).join(" ");

const Spark: React.FC<{ vals: (number | null)[]; w: number; h: number; color: string; max?: number; smooth?: boolean }> = ({ vals, w, h, color, max, smooth = true }) => {
  const v = vals.map((x) => x ?? 0);
  const mx = max ?? Math.max(1, ...v);
  const pts = v.map((x, i) => [(i / (v.length - 1)) * w, h - 2 - (x / mx) * (h - 6)] as [number, number]);
  return (
    <svg width={w + 6} height={h + 4} style={{ overflow: "visible" }}>
      <path d={smooth ? monotone(pts) : straight(pts)} fill="none" stroke={color} strokeWidth={2.4} strokeLinejoin="round" />
      <circle cx={pts[pts.length - 1][0]} cy={pts[pts.length - 1][1]} r={3.6} fill={color} />
    </svg>
  );
};

const LineChart: React.FC<{ cur: (number | null)[]; prior: (number | null)[]; w: number; h: number; ticks: number[]; labels: [number, string][]; yfmt?: (n: number) => string; smooth?: boolean; font?: number; lw?: number }> = ({ cur, prior, w, h, ticks, labels, yfmt = (n) => String(n), smooth = true, font = 11, lw = 2.4 }) => {
  const mx = ticks[ticks.length - 1];
  const mn = ticks[0];
  const X = (i: number) => 40 + (i / (cur.length - 1)) * (w - 50);
  const Y = (v: number) => 10 + (1 - (v - mn) / (mx - mn)) * (h - 40);
  const path = (vals: (number | null)[]) => {
    const pts = vals.map((v, i) => (v == null ? null : ([X(i), Y(v)] as [number, number]))).filter(Boolean) as [number, number][];
    return smooth ? monotone(pts) : straight(pts);
  };
  const last = [...cur.keys()].reverse().find((i) => cur[i] != null) ?? cur.length - 1;
  return (
    <svg width={w} height={h} style={{ overflow: "visible", fontFamily: F }}>
      {ticks.map((t) => (
        <g key={t}>
          <line x1={40} x2={w - 10} y1={Y(t)} y2={Y(t)} stroke="#EEEEF3" strokeWidth={1} strokeDasharray={t === mn ? "4 4" : undefined} />
          <text x={32} y={Y(t) + 4} fontSize={font} fill={C.faint} textAnchor="end">{yfmt(t)}</text>
        </g>
      ))}
      <path d={path(prior)} fill="none" stroke="#C9BEF5" strokeWidth={lw * 0.8} strokeDasharray="5 5" />
      <path d={path(cur)} fill="none" stroke={C.purple} strokeWidth={lw} strokeLinejoin="round" />
      {cur[last] != null && <circle cx={X(last)} cy={Y(cur[last] as number)} r={4.5} fill={C.purple} />}
      {labels.map(([i, l]) => (
        <text key={l} x={X(i)} y={h - 8} fontSize={font} fill={C.muted} textAnchor="middle">{l}</text>
      ))}
    </svg>
  );
};

const Donut: React.FC<{ parts: { v: number; c: string }[]; total: number; label: string }> = ({ parts, total, label }) => {
  const r = 76;
  const cir = 2 * Math.PI * r;
  let acc = 0;
  return (
    <svg width={190} height={190} viewBox="0 0 190 190">
      <circle cx={95} cy={95} r={r} fill="none" stroke="#F0F0F5" strokeWidth={28} />
      {parts.map((p, i) => {
        const len = (p.v / total) * cir;
        const el = p.v > 0 ? <circle key={i} cx={95} cy={95} r={r} fill="none" stroke={p.c} strokeWidth={28} strokeDasharray={`${Math.max(0, len - 2)} ${cir}`} strokeDashoffset={-acc} transform="rotate(-90 95 95)" /> : null;
        acc += len;
        return el;
      })}
      <text x={95} y={98} textAnchor="middle" fontFamily={F} fontWeight={700} fontSize={34} fill={C.ink}>{total}</text>
      <text x={95} y={124} textAnchor="middle" fontFamily={F} fontSize={14} fill={C.muted}>{label}</text>
    </svg>
  );
};

const Q: React.FC = () => <span style={{ display: "inline-flex", width: 16, height: 16, borderRadius: 8, background: "#F0F0F5", color: C.faint, fontSize: 10, alignItems: "center", justifyContent: "center", marginLeft: 8, fontWeight: 700 }}>?</span>;
const H3: React.FC<{ t: string; s?: string }> = ({ t, s }) => (
  <div>
    <div style={{ fontSize: 16, fontWeight: 600, color: C.ink }}>{t}</div>
    {s && <div style={{ fontSize: 14.5, color: C.muted, marginTop: 6 }}>{s}</div>}
  </div>
);

// ---------------------------------------------------------------------------------------------------
// The page (page coordinates; 1920 wide)

const L = 390;
const R = 1830;
const labels7: [number, string][] = [0, 5, 10, 15, 20, 25, 30].map((i) => [i, D.period.labels[i]]);
const labels3: [number, string][] = [[0, D.period.labels[0]], [15, D.period.labels[15]], [30, D.period.labels[30]]];
const niceTicks = (vals: (number | null)[], step: number) => {
  const mx = Math.max(...vals.map((v) => v ?? 0));
  const top = Math.max(step, Math.ceil(mx / step) * step);
  const out = [];
  for (let t = 0; t <= top + 1e-9; t += step) out.push(+t.toFixed(2));
  return out;
};

const KpiCard: React.FC<{ x: number; y: number; title: string; value: React.ReactNode; unit?: string; extra?: React.ReactNode; spark?: React.ReactNode; h?: number }> = ({ x, y, title, value, unit, extra, spark, h = 222 }) => (
  <div style={{ ...card, left: x, top: y, width: 341, height: h, padding: "34px 28px" }}>
    <div style={{ fontSize: 15, color: C.text, display: "flex", alignItems: "center" }}>{title}<Q /></div>
    <div style={{ marginTop: 14, display: "flex", alignItems: "baseline", gap: 8 }}>
      <span style={{ fontSize: 46, fontWeight: 700, letterSpacing: "-0.02em", color: C.ink, lineHeight: 1 }}>{value}</span>
      {unit && <span style={{ fontSize: 20, color: C.muted, fontWeight: 500 }}>{unit}</span>}
    </div>
    {extra}
    {spark && <div style={{ position: "absolute", left: 28, bottom: 30 }}>{spark}</div>}
  </div>
);

const Bar: React.FC<{ name: string; sub?: string; count: number; pct: number; max: number; initials?: string }> = ({ name, sub, count, pct, max, initials }) => (
  <div style={{ position: "relative", height: 36, margin: "0 0 19px 0", display: "flex", alignItems: "center" }}>
    <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: `${Math.max(36, (count / max) * 100)}%`, borderRadius: 8, background: C.purpleSoft }} />
    <div style={{ position: "relative", display: "flex", alignItems: "center", gap: 12, paddingLeft: initials ? 8 : 16, flex: 1 }}>
      {initials && <span style={{ width: 28, height: 28, borderRadius: 14, background: "#E2DAFD", color: C.purple, fontSize: 11, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>{initials}</span>}
      <span style={{ fontSize: 16, color: C.ink }}>{name}</span>
      {sub && <span style={{ fontSize: 14, color: C.muted }}>{sub}</span>}
    </div>
    <span style={{ position: "relative", fontSize: 16, fontWeight: 700, color: C.ink, width: 34, textAlign: "right" }}>{count}</span>
    <span style={{ position: "relative", fontSize: 14, color: C.muted, width: 56, textAlign: "right", paddingRight: 16 }}>{pct}%</span>
  </div>
);

const Clock: React.FC<{ x: number; y: number; w: number; title: string; c: { value: number; unit: string; line: (number | null)[]; prior: (number | null)[] }; step: number; suffix: string; hover?: boolean }> = ({ x, y, w, title, c, step, suffix, hover }) => {
  const ticks = niceTicks([...c.line, ...c.prior], step);
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, height: 258, padding: "24px 28px", background: hover ? "#FAFAFC" : undefined }}>
      <div style={{ fontSize: 15, fontWeight: 600, color: C.ink, display: "flex", alignItems: "center" }}>{title}<Q /></div>
      <div style={{ marginTop: 18, display: "flex", alignItems: "baseline", gap: 6 }}>
        <span style={{ fontSize: 32, fontWeight: 700, color: C.ink }}>{c.value}</span>
        <span style={{ fontSize: 15, color: C.muted }}>{c.unit}</span>
      </div>
      <div style={{ position: "absolute", left: 6, top: 120 }}>
        <LineChart cur={c.line} prior={c.prior} w={w - 30} h={128} ticks={[ticks[0], ticks[ticks.length - 1]]} labels={labels3} yfmt={(n) => `${n}${suffix}`} smooth={false} font={11} lw={2.4} />
      </div>
    </div>
  );
};

const statusColor: Record<string, string> = { "Awaiting contact": "#A24BF2", Working: C.amber, Consultation: C.teal, Scheduled: "#2F5FD9", Completed: C.green, "Closed w/o completion": "#9AA0B4" };
const sourceColor: Record<string, string> = { "Embed widget": "#7C4DF0", Network: C.blue, Manual: "#26C08E" };

export const PAGE_H = 4760;

const Page: React.FC<{ hover: string | null }> = ({ hover }) => {
  const k = D.kpi;
  const f = D.funnel;
  const sMax = D.senders[0].count;
  const pMax = D.procedures[0].count;
  const volTicks = niceTicks([...k.spark_volume, ...D.prior_daily], 1);
  const consTicks = niceTicks([...D.consult.daily, ...D.consult.prior], 1);
  const boardRows = [D.board.slice(0, 4), D.board.slice(4, 8), D.board.slice(8, 11)];
  const rowH = (row: typeof D.board) => (row.some((b) => b.count > 0) ? 304 : 192);
  let by = 3700;
  return (
    <div style={{ position: "relative", width: AN_W, height: PAGE_H, background: C.bg, fontFamily: F, color: C.ink }}>
      {/* sidebar */}
      <div style={{ position: "absolute", left: 0, top: 0, width: 320, height: PAGE_H, background: C.side }}>
        <div style={{ position: "absolute", left: 0, right: 0, top: 22, textAlign: "center", fontSize: 21, fontWeight: 600, color: "#1E4A8A" }}>{D.office}</div>
        <Img src={staticFile("tr/logo.png")} style={{ position: "absolute", left: 32, top: 62, width: 258 }} />
        {[["Analytics", 271, true], ["Referrals", 331], ["Incoming", 391, false, true], ["Outgoing", 446, false, true], ["Cases Completed", 501, false, true], ["Notifications", 556], ["Notes", 616], ["Website Lead Forms", 676], ["Settings", 767], ["Offices", 827]].map(([t, y, active, sub]) => (
          <div key={t as string} style={{ position: "absolute", left: 20, top: (y as number) - 30, width: 280, height: 60, borderRadius: 12, background: active ? "#C9DAF4" : undefined, display: "flex", alignItems: "center", paddingLeft: sub ? 85 : 60, fontSize: 20, color: "#1E4A8A" }}>
            <span style={{ position: "absolute", left: sub ? 58 : 22, width: 20, height: 20, borderRadius: 5, border: "2px solid #2B5DA8", opacity: 0.85 }} />
            {t}
            {t === "Notifications" && <span style={{ position: "absolute", left: 20, top: 2, padding: "1px 6px", borderRadius: 10, background: C.purple, color: "#fff", fontSize: 12, fontWeight: 700 }}>{D.notifications}</span>}
          </div>
        ))}
        <div style={{ position: "absolute", left: 20, top: 720, width: 280, height: 1, background: "#B9CFEA" }} />
      </div>
      {/* header */}
      <div style={{ position: "absolute", left: 320, right: 0, top: 0, height: 147, background: "#fff", borderBottom: `1px solid ${C.line}` }}>
        <div style={{ position: "absolute", left: 30, top: 16, fontSize: 30, fontWeight: 700 }}>Analytics</div>
        <div style={{ position: "absolute", left: 30, top: 72, width: 398, height: 52, borderRadius: 12, border: `1px solid ${C.line}`, display: "flex", alignItems: "center", paddingLeft: 48, fontSize: 17, color: C.faint }}>Ask how to embed, forward, invite…</div>
        <div style={{ position: "absolute", left: 335, top: 20, fontSize: 18, color: C.text }}>{D.office}</div>
        {[["Provider's Day-Prep Station", 590, 304, false], ["Invite your Network", 905, 226, false], ["New Referral", 1142, 162, true]].map(([t, x, w, solid]) => (
          <div key={t as string} style={{ position: "absolute", left: x as number, top: 8, width: w as number, height: 52, borderRadius: 6, border: `1.5px solid ${C.purple}`, background: solid ? C.purple : "#fff", color: solid ? "#fff" : C.purple, fontSize: 19, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: solid ? 600 : 500 }}>{t}</div>
        ))}
        <div style={{ position: "absolute", left: 1322, top: 14, width: 38, height: 38, borderRadius: 19, background: C.purpleSoft, color: C.purple, fontWeight: 700, fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center" }}>{D.user.initials}</div>
        <div style={{ position: "absolute", left: 1370, top: 8, fontSize: 19, color: C.ink }}>{D.user.name}</div>
        <div style={{ position: "absolute", left: 1370, top: 38, fontSize: 16, color: C.muted }}>{D.user.role}</div>
      </div>
      {/* toolbar */}
      <div style={{ position: "absolute", left: L, top: 213, height: 46, display: "flex", borderRadius: 10, overflow: "hidden", border: `1px solid ${C.line}`, background: "#fff" }}>
        <div style={{ padding: "0 16px", display: "flex", alignItems: "center", gap: 10, background: C.purpleSoft, color: C.purple, fontSize: 17 }}>Received <span style={{ background: C.purple, color: "#fff", borderRadius: 10, padding: "1px 7px", fontSize: 12, fontWeight: 700 }}>{D.received_tab}</span></div>
        <div style={{ padding: "0 16px", display: "flex", alignItems: "center", gap: 10, fontSize: 17, color: C.text }}>Sent <span style={{ color: C.muted, fontSize: 13 }}>{D.sent_tab}</span></div>
      </div>
      <div style={{ position: "absolute", left: 640, top: 213, height: 46, width: 245, borderRadius: 10, border: `1px solid ${C.line}`, background: "#fff", display: "flex", alignItems: "center", paddingLeft: 42, fontSize: 17 }}>
        Last 30 days <span style={{ color: C.muted, marginLeft: 10 }}>· daily ⌄</span>
      </div>
      <div style={{ position: "absolute", left: 1686, top: 213, height: 46, width: 144, borderRadius: 10, border: `1px solid ${C.line}`, background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17 }}>⤓ Export PDF</div>
      <div style={{ ...card, left: L, top: 284, width: R - L, height: 67, borderRadius: 12, display: "flex", alignItems: "center", paddingLeft: 22, fontSize: 16, color: C.text, gap: 14 }}>
        <span>⚲ Specialty</span>
        <span style={{ padding: "6px 14px", borderRadius: 999, border: `1px solid ${C.line}`, fontSize: 15 }}>All specialties ⌄</span>
      </div>
      {/* KPI row */}
      <KpiCard x={L} y={388} title="Volume received" value={k.volume} extra={<div style={{ marginTop: 10, display: "inline-block", padding: "4px 10px", borderRadius: 6, background: "#E9F8F1", color: "#15875A", fontSize: 15, fontWeight: 600 }}>↑ {k.volume_vs_prior}% vs prior</div>} spark={<Spark vals={k.spark_volume} w={284} h={36} color={C.purple} />} />
      <KpiCard x={757} y={388} title="Time to first contact" value={k.ttfc_h} unit="h" spark={<Spark vals={k.spark_ttfc} w={284} h={36} color={C.green} smooth={false} />} />
      <KpiCard x={1124} y={388} title="Case acceptance" value={k.case_acceptance} unit="%" spark={<Spark vals={k.spark_acceptance} w={284} h={36} color={C.purple} max={100} smooth={false} />} />
      <KpiCard x={1490} y={388} title="Ghost rate" value={k.ghost_rate} unit="%" extra={<div style={{ marginTop: 10, fontSize: 14, color: C.muted }}>vs 46% industry average*</div>} spark={<Spark vals={k.spark_ghost} w={284} h={36} color={C.amber} max={20} smooth={false} />} />
      {/* top senders / procedures */}
      <div style={{ ...card, left: L, top: 637, width: 829, height: 428, padding: "32px 26px" }}>
        <H3 t="Top senders" s="Practices sending you referrals · click any row to see what they sent" />
        <div style={{ marginTop: 26 }}>
          {D.senders.map((s) => (
            <div key={s.name} style={{ background: hover === s.name ? "#F6F4FD" : undefined, borderRadius: 8 }}>
              <Bar name={s.name} sub={s.loc} count={s.count} pct={s.pct} max={sMax} initials={s.name.split(" ").filter((w) => /^[A-Z]/.test(w)).slice(0, 2).map((w) => w[0]).join("")} />
            </div>
          ))}
        </div>
      </div>
      <div style={{ ...card, left: 1245, top: 637, width: 585, height: 428, padding: "32px 26px" }}>
        <H3 t="Top procedures" s="Most common reasons for referrals" />
        <div style={{ marginTop: 26 }}>
          {D.procedures.map((p) => <Bar key={p.name} name={p.name} count={p.count} pct={p.pct} max={pMax} />)}
        </div>
      </div>
      {/* volume chart + funnel */}
      <div style={{ ...card, left: L, top: 1092, width: 951, height: 481, padding: "32px 33px" }}>
        <H3 t="Volume received" s="Daily receipts · last 30 days" />
        <div style={{ position: "absolute", right: 32, top: 30, display: "flex", gap: 18, fontSize: 15, color: C.text }}>
          <span><span style={{ display: "inline-block", width: 12, height: 12, background: C.purple, borderRadius: 2, marginRight: 8 }} />Current</span>
          <span><span style={{ display: "inline-block", width: 12, height: 12, background: "#C9BEF5", borderRadius: 2, marginRight: 8 }} />Prior period</span>
        </div>
        <div style={{ position: "absolute", left: 20, top: 120 }}>
          <LineChart cur={k.spark_volume} prior={D.prior_daily} w={910} h={300} ticks={volTicks} labels={labels7} />
        </div>
      </div>
      <div style={{ ...card, left: 1367, top: 1092, width: 463, height: 481, padding: "30px 26px" }}>
        <H3 t="Referral funnel" s={undefined} />
        <div style={{ fontSize: 15, color: C.muted, marginTop: 6 }}>From view to completion · overall <b style={{ color: C.ink }}>{D.conversion}%</b></div>
        <div style={{ marginTop: 26 }}>
          {f.map((s) => (
            <div key={s.name} style={{ marginBottom: 8 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 17 }}>
                <span><b style={{ fontWeight: 600 }}>{s.name}</b> <span style={{ color: C.muted, marginLeft: 6 }}>{s.count}</span></span>
                <b style={{ fontWeight: 600 }}>{s.pct}%</b>
              </div>
              <div style={{ height: 11, borderRadius: 6, background: "#EFEFF4", marginTop: 8 }}>
                <div style={{ width: `${s.pct}%`, height: "100%", borderRadius: 6, background: `linear-gradient(90deg, ${C.purple}, #8F6BF3)` }} />
              </div>
              {s.dropped != null && (
                <div style={{ marginTop: 8, height: 26, borderRadius: 4, background: C.amberBg, color: C.amberInk, fontSize: 14, display: "flex", alignItems: "center", paddingLeft: 16 }}>↓ <b style={{ margin: "0 4px" }}>{s.dropped}</b> dropped <span style={{ margin: "0 8px", opacity: 0.5 }}>·</span> {s.leak}% leak</div>
              )}
            </div>
          ))}
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 52, borderTop: `1px solid ${C.line}`, display: "flex", alignItems: "center", paddingLeft: 26, fontSize: 14.5, color: C.muted }}>Conversion (Received → Completed) <b style={{ color: C.ink, marginLeft: 6 }}>{D.conversion}%</b></div>
      </div>
      {/* lifecycle clocks */}
      <div style={{ ...card, left: L, top: 1599, width: R - L, height: 604 }}>
        <div style={{ position: "absolute", left: 26, top: 32 }}><H3 t="Lifecycle clocks" s="How long each step takes. Solid line — this period; dashed — previous period." /></div>
        <Clock x={0} y={88} w={480} title="Time to first contact" c={D.clocks.ttfc} step={2} suffix="h" hover={hover === "ttfc"} />
        <Clock x={480} y={88} w={480} title="Time to schedule" c={D.clocks.tts} step={10} suffix="h" />
        <Clock x={960} y={88} w={480} title="Time to completion" c={D.clocks.ttc} step={5} suffix="d" />
        <Clock x={0} y={346} w={480} title="Waiting while scheduled" c={D.clocks.wait} step={2} suffix="d" />
        <Clock x={480} y={346} w={480} title="Open referrals age" c={D.clocks.age} step={5} suffix="d" />
        <div style={{ position: "absolute", left: 480, top: 88, width: 1, height: 516, background: C.line }} />
        <div style={{ position: "absolute", left: 960, top: 88, width: 1, height: 258, background: C.line }} />
        <div style={{ position: "absolute", left: 0, right: 0, top: 346, height: 1, background: C.line }} />
      </div>
      {/* consultations */}
      <KpiCard x={L} y={2229} h={184} title="Consultations scheduled" value={D.consult.scheduled} spark={<Spark vals={D.consult.daily} w={284} h={34} color={C.purple} />} />
      <KpiCard x={757} y={2229} h={184} title="Consult to completion" value={D.consult.consult_to_completion_d} unit="d" />
      <KpiCard x={1124} y={2229} h={184} title="Referrals to consultation" value={D.consult.referrals_to_consultation} unit="%" />
      <KpiCard x={1490} y={2229} h={184} title="Consultations completed" value={D.consult.consultations_completed} unit="%" />
      <div style={{ ...card, left: L, top: 2439, width: R - L, height: 475, padding: "32px 33px" }}>
        <H3 t="Consultations scheduled" s="Consultations booked · last 30 days" />
        <div style={{ position: "absolute", right: 32, top: 30, display: "flex", gap: 18, fontSize: 15, color: C.text }}>
          <span><span style={{ display: "inline-block", width: 12, height: 12, background: C.purple, borderRadius: 2, marginRight: 8 }} />Current</span>
          <span><span style={{ display: "inline-block", width: 12, height: 12, background: "#C9BEF5", borderRadius: 2, marginRight: 8 }} />Prior period</span>
        </div>
        <div style={{ position: "absolute", left: 30, top: 140 }}>
          <LineChart cur={D.consult.daily} prior={D.consult.prior} w={1380} h={290} ticks={consTicks} labels={labels7} font={15} lw={2.8} />
        </div>
      </div>
      {/* needs attention + staff */}
      <div style={{ ...card, left: L, top: 2940, width: 829, height: 343, padding: "30px 26px" }}>
        <H3 t="Needs attention" s={`3 items · click any row to see the referrals`} />
        {[[C.amber, D.needs.past_appointments, (D.needs.past_appointments === 1 ? "scheduled appointment past its date" : "scheduled appointments past appointment date"), "no completion note", "Mark complete"], [C.amber, D.needs.ghosts, (D.needs.ghosts === 1 ? "ghost referral — patient we have not reached" : "ghost referrals — patients we have not reached"), "3+ attempts logged", "Re-assign"], [C.purple, D.needs.insurance, (D.needs.insurance === 1 ? "insurance request outstanding" : "insurance requests outstanding"), "older than 48 h", "Send reminder"]].map(([c, n, t, s, a], i) => (
          <div key={i} style={{ position: "absolute", left: 0, right: 0, top: 88 + i * 53, height: 53, borderTop: i ? `1px solid ${C.line}` : undefined, display: "flex", alignItems: "center", paddingLeft: 36, paddingRight: 34, fontSize: 16.5 }}>
            <span style={{ width: 10, height: 10, borderRadius: 5, background: c as string, marginRight: 24 }} />
            <span style={{ color: C.ink }}><b style={{ fontWeight: 600 }}>{n}</b> {t}</span>
            <span style={{ color: C.muted, marginLeft: 8, fontSize: 15 }}>{s}</span>
            <span style={{ marginLeft: "auto", color: C.purple, fontWeight: 600, fontSize: 15.5 }}>{a} ›</span>
          </div>
        ))}
      </div>
      <div style={{ ...card, left: 1245, top: 2940, width: 585, height: 343, padding: "34px 28px" }}>
        <H3 t="Staff responsiveness" s="Log-ins, time in app and changes, last 30 days" />
        <div style={{ display: "flex", marginTop: 26, fontSize: 13, letterSpacing: "0.04em", color: C.muted, borderBottom: `1px solid ${C.line}`, paddingBottom: 12 }}>
          <span style={{ flex: 1 }}>STAFF</span><span style={{ width: 84, textAlign: "right" }}>LOG-INS</span><span style={{ width: 92, textAlign: "right" }}>AVG TIME</span><span style={{ width: 92, textAlign: "right" }}>CHANGES</span>
        </div>
        {D.staff.map((s) => (
          <div key={s.name} style={{ display: "flex", alignItems: "center", height: 49, borderBottom: `1px solid ${C.line}`, fontSize: 15.5 }}>
            <span style={{ width: 32, height: 32, borderRadius: 16, background: C.purpleSoft, color: C.purple, fontSize: 12, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", marginRight: 14 }}>{s.name.slice(0, 2).toUpperCase()}</span>
            <span style={{ flex: 1, lineHeight: 1.2 }}>{s.name}<br /><span style={{ fontSize: 13.5, color: C.muted }}>{s.role}</span></span>
            <span style={{ width: 84, textAlign: "right" }}>{s.logins}</span><span style={{ width: 92, textAlign: "right" }}>{s.avg}</span><span style={{ width: 92, textAlign: "right", fontWeight: 700 }}>{s.changes}</span>
          </div>
        ))}
      </div>
      {/* outcomes + sources */}
      <div style={{ ...card, left: L, top: 3309, width: 707, height: 321, padding: "30px 28px" }}>
        <H3 t="Referral outcomes" s="Where this period's referrals stand · last 30 days" />
        <div style={{ position: "absolute", left: 30, top: 100 }}>
          <Donut parts={D.outcomes.map((o) => ({ v: o.count, c: statusColor[o.name] }))} total={D.outcomes.reduce((a, o) => a + o.count, 0)} label="referrals" />
        </div>
        <div style={{ position: "absolute", left: 258, right: 28, top: 98 }}>
          {D.outcomes.map((o) => (
            <div key={o.name} style={{ display: "flex", alignItems: "center", height: 35, fontSize: 15.5 }}>
              <span style={{ width: 12, height: 12, borderRadius: 2, background: statusColor[o.name], marginRight: 10 }} />
              <span style={{ flex: 1 }}>{o.name}</span><b style={{ width: 30, textAlign: "right" }}>{o.count}</b><span style={{ width: 58, textAlign: "right", color: C.muted, fontSize: 14 }}>{o.pct}%</span>
            </div>
          ))}
        </div>
      </div>
      <div style={{ ...card, left: 1124, top: 3309, width: 706, height: 321, padding: "30px 28px" }}>
        <H3 t="Referral sources" s="How referrals reach you · last 30 days" />
        <div style={{ position: "absolute", left: 30, top: 100 }}>
          <Donut parts={D.sources.map((s) => ({ v: s.count, c: sourceColor[s.name] }))} total={D.sources.reduce((a, s) => a + s.count, 0)} label="referrals" />
        </div>
        <div style={{ position: "absolute", left: 258, right: 28, top: 150 }}>
          {D.sources.map((s) => (
            <div key={s.name} style={{ display: "flex", alignItems: "center", height: 35, fontSize: 15.5 }}>
              <span style={{ width: 12, height: 12, borderRadius: 2, background: sourceColor[s.name], marginRight: 10 }} />
              <span style={{ flex: 1 }}>{s.name}</span><b style={{ width: 30, textAlign: "right" }}>{s.count}</b><span style={{ width: 58, textAlign: "right", color: C.muted, fontSize: 14 }}>{s.pct}%</span>
            </div>
          ))}
        </div>
      </div>
      {/* status board */}
      <div style={{ position: "absolute", left: L, top: 3655, fontSize: 19, fontWeight: 700, display: "flex", alignItems: "center" }}>Status board<Q /><span style={{ fontSize: 15.5, fontWeight: 400, color: C.muted, marginLeft: 16 }}>Where referrals sit right now</span></div>
      {boardRows.map((row) => {
        const h = rowH(row);
        const top = by;
        by += h + 26;
        return row.map((b, i) => (
          <div key={b.status} style={{ ...card, left: L + i * 367, top, width: 341, height: h, padding: "28px 28px" }}>
            <div style={{ fontSize: 15.5, color: C.text }}>{b.status}</div>
            <div style={{ fontSize: 40, fontWeight: 700, marginTop: 6 }}>{b.count}</div>
            <div style={{ fontSize: 15, color: C.muted, marginTop: 4 }}>{b.count ? `Avg ${b.avg} · Longest ${b.longest}` : "—"}</div>
            {b.count === 0 && <div style={{ fontSize: 15, color: C.faint, marginTop: 18 }}>No referrals in this status</div>}
            <div style={{ marginTop: 14 }}>
              {b.rows.map((r) => (
                <div key={r.patient} style={{ display: "flex", alignItems: "center", height: 45, fontSize: 15 }}>
                  <span style={{ width: 30, height: 30, borderRadius: 15, background: C.purpleSoft, color: C.purple, fontSize: 11, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", marginRight: 12 }}>{r.initials}</span>
                  <b style={{ flex: 1, fontWeight: 600 }}>{r.patient}</b><span style={{ color: C.muted }}>{r.age}</span>
                </div>
              ))}
            </div>
          </div>
        ));
      })}
      {D.closed.map((c, i) => (
        <div key={c.status} style={{ ...card, left: L + i * 367, top: by, width: 341, height: 86, padding: "20px 28px", display: "flex", alignItems: "center" }}>
          <div style={{ flex: 1 }}><div style={{ fontSize: 15.5, color: C.text }}>{c.status}</div><div style={{ fontSize: 14, color: C.muted, marginTop: 4 }}>Last 30 days</div></div>
          <div style={{ fontSize: 30, fontWeight: 700 }}>{c.count}</div>
        </div>
      ))}
      <div style={{ position: "absolute", left: L, top: by + 110, fontSize: 13, color: C.faint }}>*Industry average: Kelton Research national survey of dental referrals (2008). Demo data; patients and offices are fictional.</div>
    </div>
  );
};

// ---------------------------------------------------------------------------------------------------
// The recording: scroll keyframes (time s -> page y), a cursor, a hover or two

const SCROLL: [number, number][] = [
  [0, 0], [3, 0], [5.5, 250], [9, 250], [11.5, 560], [16, 560], [18.5, 1060], [23.5, 1060], [26, 1560], [31.5, 1560], [34, 2190], [38.5, 2190], [41, 2700], [45.5, 2700], [48, 3150], [52, 3150], [54.5, PAGE_H - AN_H], [60, PAGE_H - AN_H],
];
const scrollAt = (t: number) => {
  for (let i = 0; i < SCROLL.length - 1; i++) {
    const [a, ya] = SCROLL[i];
    const [b, yb] = SCROLL[i + 1];
    if (t <= b) return ya + (yb - ya) * easeIO(interpolate(t, [a, b], [0, 1], clamp));
  }
  return SCROLL[SCROLL.length - 1][1];
};
const CURSOR: [number, number, number][] = [
  [0, 800, 290], [3, 820, 300], [6, 1150, 470], [10, 980, 330], [13, 760, 420], [17, 1500, 520], [20, 900, 420], [24, 1600, 480], [27, 650, 400], [32, 1100, 330], [36, 900, 300], [40, 1200, 360], [43, 1100, 420], [47, 1300, 330], [50, 700, 420], [55, 1200, 500], [60, 1240, 520],
];
const cursorAt = (t: number): [number, number] => {
  for (let i = 0; i < CURSOR.length - 1; i++) {
    const [a, xa, ya] = CURSOR[i];
    const [b, xb, yb] = CURSOR[i + 1];
    if (t <= b) {
      const k = easeIO(interpolate(t, [a, b], [0, 1], clamp));
      return [xa + (xb - xa) * k, ya + (yb - ya) * k];
    }
  }
  return [CURSOR[CURSOR.length - 1][1], CURSOR[CURSOR.length - 1][2]];
};

export const AnalyticsDemo: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / 30;
  const y = scrollAt(t);
  const [cx, cy] = cursorAt(t);
  const pageY = cy + y;
  const hover = pageY > 760 && pageY < 1040 && cx > 410 && cx < 1210 ? D.senders[Math.max(0, Math.min(D.senders.length - 1, Math.floor((pageY - 772) / 55)))]?.name ?? null : pageY > 1690 && pageY < 1945 && cx < 870 && cx > 390 ? "ttfc" : null;
  const thumbH = (AN_H / PAGE_H) * AN_H;
  return (
    <AbsoluteFill style={{ background: C.bg, overflow: "hidden" }}>
      <FontGate>
        <div style={{ position: "absolute", left: 0, top: -y }}>
          <Page hover={hover} />
        </div>
        {/* fixed chat bubble and scrollbar, like the recording */}
        <div style={{ position: "absolute", left: 1801, top: 742, width: 70, height: 70, borderRadius: 35, background: C.purple, boxShadow: "0 8px 20px rgba(113,70,234,0.35)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <svg width={30} height={30} viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" fill="none" stroke="#fff" strokeWidth={2} /></svg>
        </div>
        <div style={{ position: "absolute", right: 0, top: 0, width: 20, height: AN_H, background: "#F1F1F4" }} />
        <div style={{ position: "absolute", right: 6, top: 12 + (y / (PAGE_H - AN_H)) * (AN_H - 24 - thumbH), width: 8, height: thumbH, borderRadius: 4, background: "#B9B9C2" }} />
        <svg width={30} height={36} viewBox="0 0 22 26" style={{ position: "absolute", left: cx - 4, top: cy - 2, filter: "drop-shadow(0 2px 3px rgba(0,0,0,0.3))" }}>
          <path d="M2 2 L2 20 L7 15 L11 24 L14 22.5 L10 14 L17 14 Z" fill="#fff" stroke="#111" strokeWidth={1.4} strokeLinejoin="round" />
        </svg>
      </FontGate>
    </AbsoluteFill>
  );
};
