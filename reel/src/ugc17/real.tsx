/**
 * UGC 17 real-app replica: the Tooth Referral app exactly as in the 1920x842 recordings (Nov 2026: CONSUALTATION NOTE,
 * INCMING REFFERAL DASHBARD, screen-capture 2/4/5/7), measured pixel by pixel. Layout, fonts (Inter), colours, tags,
 * reply quotes, chips and buttons are the app's own; only names and messages come from data.ts (UGC 17 cast).
 * Page coordinates = the recording's page coordinates at scroll 0; `scroll` moves the whole page like the browser does.
 */
import { loadFont } from "@remotion/fonts";
import React from "react";
import { Img, staticFile } from "remotion";
import { type AdNote, ACTIVITY_OLIVIA, HARBORVIEW, LAKESIDE, type OcMsg, P, type Person, fullName } from "./data";

for (const w of ["400", "500", "600", "700"]) loadFont({ family: "Inter", url: staticFile(`fonts/inter-latin-${w}-normal.woff2`), weight: w });

export const RW = 1920, RH = 842;
const F = "Inter, sans-serif";
export const RC = {
  ink: "#111827", g8: "#1F2937", g7: "#374151", g6: "#4B5563", g5: "#6B7280", g4: "#9CA3AF", line: "#E5E7EB",
  bg: "#F9F9F9", side: "#D9E8F8", nav: "#12396A", pur: "#774AED", ocM: "#1F5F99", anM: "#5B50C8", red: "#DC2626",
};
const t = (size: number, weight = 400, color: string = RC.ink): React.CSSProperties => ({ font: `${weight} ${size}px ${F}`, color, whiteSpace: "nowrap" });
const abs = (x: number, y: number, extra?: React.CSSProperties): React.CSSProperties => ({ position: "absolute", left: x, top: y, ...extra });
/** Text whose vertical centre is at cy (the measurements are text centres). */
const Tx: React.FC<{ x: number; cy: number; s: number; w?: number; c?: string; style?: React.CSSProperties; children: React.ReactNode }> = ({ x, cy, s, w = 400, c = RC.ink, style, children }) => (
  <div style={{ ...abs(x, cy - s * 0.62), ...t(s, w, c), lineHeight: `${s * 1.24}px`, ...style }}>{children}</div>
);

// ------------------------------------------------------------------------------------------- icons (lucide, as in the app)
const PATHS: Record<string, string> = {
  chart: "M3 3v18h18M18 17V9M13 17V5M8 17v-3", users: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75",
  down: "M12 3v12M7 10l5 5 5-5M5 21h14", up: "M12 21V9M7 14l5-5 5 5M5 3h14", circleCheck: "M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0zM8 12l3 3 5-6",
  bell: "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z", notes: "M4 5h16v14H4zM4 9h16M8 13h8M8 16h5", code: "M16 18l6-6-6-6M8 6l-6 6 6 6",
  gear: "M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z",
  building: "M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18zM6 12H4a2 2 0 0 0-2 2v8h4M18 9h2a2 2 0 0 1 2 2v11h-4M10 6h4M10 10h4M10 14h4M10 18h4",
  chevD: "M6 9l6 6 6-6", chevU: "M18 15l-6-6-6 6", chevL: "M15 18l-6-6 6-6", chevR: "M9 18l6-6-6-6", arrowL: "M19 12H5M12 19l-7-7 7-7",
  pen: "M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z", trash: "M3 6h18M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6M10 11v6M14 11v6M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2",
  msg: "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z", clip: "M9 3h6v3H9zM16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2M9 12h6M9 16h6",
  file: "M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9zM14 3v6h6", fileTxt: "M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9zM14 3v6h6M8 13h8M8 17h8",
  fileEdit: "M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h4M14 3v6h6M18.4 12.6a1.9 1.9 0 0 1 2.7 2.7L15.5 21 12 22l1-3.5z", fileSig: "M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9zM14 3v6h6M8 18c1.5-2 3-2 4 0s2.5 2 4 0",
  cal: "M3 6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2zM16 2v4M8 2v4M3 10h18", eye: "M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12zM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z",
  tag: "M20.6 13.4l-7.2 7.2a2 2 0 0 1-2.8 0L2 12V2h10l8.6 8.6a2 2 0 0 1 0 2.8zM7 7h.01", at: "M12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-4 8",
  smile: "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM8 14s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01", send: "M22 2L11 13M22 2l-7 20-4-9-9-4z",
  refresh: "M21 12a9 9 0 1 1-3-6.7L21 8M21 3v5h-5", reply: "M9 17l-5-5 5-5M20 18v-2a4 4 0 0 0-4-4H4", x: "M18 6L6 18M6 6l12 12",
  shield: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z", sparkle: "M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9zM19 3v4M21 5h-4",
  undo: "M9 14L4 9l5-5M4 9h11a5 5 0 0 1 0 10h-3", bold: "M6 4h8a4 4 0 0 1 0 8H6zM6 12h9a4 4 0 0 1 0 8H6z", list: "M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01",
  link: "M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.7 1.7M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.7-1.7", img: "M3 5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2zM8.5 10a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zM21 15l-5-5L5 21",
  alignL: "M3 6h18M3 12h12M3 18h16", alignC: "M3 6h18M6 12h12M4 18h16", alignR: "M3 6h18M9 12h12M5 18h16", hash: "M4 9h16M4 15h16M10 3L8 21M16 3l-2 18",
};
export const RI: React.FC<{ n: string; s?: number; c?: string; w?: number; x?: number; cy?: number; style?: React.CSSProperties }> = ({ n, s = 20, c = RC.g7, w = 2, x, cy, style }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round"
    style={{ flex: "none", ...(x !== undefined && cy !== undefined ? abs(x, cy - s / 2) : {}), ...style }}><path d={PATHS[n]} /></svg>
);

// ------------------------------------------------------------------------------------------- primitives
/** Outline / solid buttons of the app (1 px purple border, 4 px radius). */
export const RBtn: React.FC<{ x: number; y: number; w: number; h: number; label: string; icon?: string; s?: number; solid?: boolean; red?: boolean; muted?: boolean; style?: React.CSSProperties }> = ({ x, y, w, h, label, icon, s = 18, solid, red, muted, style }) => {
  const c = red ? RC.red : muted ? "#B8A6F4" : RC.pur;
  return (
    <div style={{ ...abs(x, y), width: w, height: h, boxSizing: "border-box", borderRadius: 4, border: `1px solid ${solid ? RC.pur : c}`, background: solid ? RC.pur : "#fff",
      display: "flex", alignItems: "center", justifyContent: "center", gap: 10, ...t(s, solid ? 600 : 500, solid ? "#fff" : c), ...style }}>
      {icon && <RI n={icon} s={s + 1} c={solid ? "#fff" : c} />}{label}
    </div>
  );
};
const Card: React.FC<{ x: number; y: number; w: number; h: number; bg?: string; r?: number; children?: React.ReactNode; style?: React.CSSProperties }> = ({ x, y, w, h, bg = "#fff", r = 8, children, style }) => (
  <div style={{ ...abs(x, y), width: w, height: h, boxSizing: "border-box", background: bg, border: `1px solid ${RC.line}`, borderRadius: r, ...style }}>{children}</div>
);
const Hr: React.FC<{ x: number; y: number; w: number; c?: string }> = ({ x, y, w, c = RC.line }) => <div style={{ ...abs(x, y), width: w, height: 1, background: c }} />;
/** Office avatar in Office Communication: a 40 px rounded tile with the office initial (offices without a logo). */
const OfficeTile: React.FC<{ office: string; x: number; y: number }> = ({ office, x, y }) => (
  <div style={{ ...abs(x, y), width: 40, height: 40, borderRadius: 6, background: office === LAKESIDE ? "#2E7D4F" : "#5B3FC4", display: "flex", alignItems: "center", justifyContent: "center", ...t(19, 600, "#fff") }}>{office[0]}</div>
);
const Mention: React.FC<{ c: string; children: React.ReactNode }> = ({ c, children }) => <span style={{ color: c }}>{children}</span>;

// ------------------------------------------------------------------------------------------- status chips (Status & Schedule)
type Chip = { t: string; x: number; w: number; bg: string; fg: string };
const ROW = (cy: number, chips: Chip[]) => chips.map((c) => ({ ...c, cy }));
/** Chip rows exactly as in the app (x, width, Tailwind 100/800 pairs). cy relative to the Status card top. */
export const CHIP_ROWS = [
  ...ROW(132, [{ t: "New", x: 1466, w: 58, bg: "#EEF0FF", fg: "#7C7FD6" }, { t: "Received", x: 1531, w: 84, bg: "#E0F2FE", fg: "#075985" }, { t: "Consultation Scheduled", x: 1624, w: 182, bg: "#E0E7FF", fg: "#3730A3" }]),
  ...ROW(166, [{ t: "Consultation Completed", x: 1468, w: 182, bg: "#FAE8FF", fg: "#86198F" }]),
  ...ROW(200, [{ t: "Spoke with Patient / Scheduled", x: 1468, w: 227, bg: "#FEF9C3", fg: "#854D0E" }]),
  ...ROW(234, [{ t: "Left a Voicemail", x: 1468, w: 128, bg: "#DCFCE7", fg: "#166534" }, { t: "Voicemail Not Set Up", x: 1604, w: 163, bg: "#CFFAFE", fg: "#155E75" }]),
  ...ROW(268, [{ t: "Callback Requested", x: 1468, w: 154, bg: "#ECFCCB", fg: "#3F6212" }, { t: "In Progress", x: 1631, w: 99, bg: "#DBEAFE", fg: "#1E40AF" }]),
  ...ROW(301, [{ t: "Completed", x: 1468, w: 96, bg: "#D1FAE5", fg: "#065F46" }, { t: "Cancelled", x: 1572, w: 91, bg: "#FEE2E2", fg: "#991B1B" }, { t: "Referred Out", x: 1671, w: 110, bg: "#F3E8FF", fg: "#6B21A8" }]),
  ...ROW(335, [{ t: "Unable to Contact", x: 1468, w: 141, bg: "#FFEDD5", fg: "#9A3412" }, { t: "Declined Appointment", x: 1618, w: 171, bg: "#FFE4E6", fg: "#9F1239" }]),
  ...ROW(369, [{ t: "Other", x: 1468, w: 61, bg: "#E5E7EB", fg: "#1F2937" }]),
];
export const chipBox = (name: string, top: number) => {
  const c = CHIP_ROWS.find((r) => r.t === name)!;
  return { x: c.x, y: top + c.cy - 15, w: c.w, h: 30 };
};

// ------------------------------------------------------------------------------------------- shell
type NavT = "Analytics" | "Incoming" | "Outgoing" | "Cases Completed" | "Notifications" | "Notes" | "Website Lead Forms";
/** Sidebar + page header (both scroll with the page, as in the recordings). */
const Shell: React.FC<{ title: string; active: NavT; office: string; user: Person; badge: number; badgePop?: number }> = ({ title, active, office, user, badge, badgePop = 1 }) => {
  const nav = (label: string, icon: string, cy: number, sub = false) => {
    const on = label === active;
    return (
      <React.Fragment key={label}>
        {on && <div style={{ ...abs(45, cy - 22), width: 212, height: 44, borderRadius: 8, background: "#D5D9F8" }} />}
        <RI n={icon} s={20} c={RC.nav} x={sub ? 61 : 37} cy={cy} />
        <Tx x={sub ? 94 : 72} cy={cy} s={18.5} w={on ? 500 : 400} c={RC.nav}>{label}</Tx>
      </React.Fragment>
    );
  };
  return (
    <>
      <div style={{ ...abs(0, 0), width: 288, height: 4000, background: RC.side }} />
      <Tx x={0} cy={43} s={21} w={600} c="#1E3A6E" style={{ width: 288, textAlign: "center" }}>{office}</Tx>
      <Img src={staticFile("tr/logo.png")} style={{ ...abs(28, 70), width: 234, height: 107 }} />
      {nav("Analytics", "chart", 256)}
      <div style={{ ...abs(18, 284), width: 252, height: 52, borderRadius: 8, background: "#CFD5F5" }} />
      <RI n="users" s={20} c={RC.nav} x={37} cy={310} /><Tx x={72} cy={310} s={18.5} w={500} c={RC.nav}>Referrals</Tx><RI n="chevU" s={16} c={RC.nav} x={240} cy={310} />
      {nav("Incoming", "down", 364, true)}{nav("Outgoing", "up", 413, true)}{nav("Cases Completed", "circleCheck", 463, true)}
      {nav("Notifications", "bell", 512)}
      {badge > 0 && <div style={{ ...abs(39, 497), width: 24, height: 18, borderRadius: 9, background: RC.red, transform: `scale(${badgePop})`, display: "flex", alignItems: "center", justifyContent: "center", ...t(11.5, 700, "#fff") }}>{badge}</div>}
      {nav("Notes", "notes", 566)}{nav("Website Lead Forms", "code", 620)}
      <Hr x={20} y={661} w={250} c="#BFD0E3" />
      {nav("Settings", "gear", 702)}<RI n="chevD" s={16} c={RC.nav} x={240} cy={702} />
      {nav("Offices", "building", 756)}<RI n="chevD" s={16} c={RC.nav} x={240} cy={756} />
      {/* header */}
      <Tx x={315} cy={43} s={27.5} w={600}>{title}</Tx>
      <div style={{ ...abs(315, 77), width: 359, height: 48, boxSizing: "border-box", border: `1px solid ${RC.line}`, borderRadius: 10, background: "#fff" }}>
        <RI n="sparkle" s={20} c="#8B6CF0" x={14} cy={23} /><Tx x={43} cy={23} s={16} c={RC.g4}>Ask how to embed, forward, invite...</Tx>
      </div>
      {/* right-aligned flex row, as in the app: the clinic label grows to the left, buttons keep their gaps */}
      <div style={{ ...abs(700, 19), width: 957, height: 47, display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 10 }}>
        <RI n="building" s={17} c={RC.g6} /><span style={{ ...t(17, 400, RC.g7), marginRight: 0 }}>{office}</span>
        {[["Provider's Day-Prep Station", 274], ["Invite your Network", 204]].map(([l, w]) => (
          <div key={l} style={{ width: w as number, height: 47, boxSizing: "border-box", border: `1px solid ${RC.pur}`, borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center", ...t(18, 500, RC.pur) }}>{l}</div>
        ))}
        <div style={{ width: 145, height: 47, borderRadius: 4, background: RC.pur, display: "flex", alignItems: "center", justifyContent: "center", ...t(18, 600, "#fff") }}>New Referral</div>
      </div>
      <div style={{ ...abs(1670, 27), width: 30, height: 30, borderRadius: 30, background: "#EEF0F4", border: `1px solid ${RC.line}`, display: "flex", alignItems: "center", justifyContent: "center", ...t(11, 600, RC.g6) }}>{user.ini}</div>
      <Tx x={1712} cy={31} s={18} c={RC.g8}>{user.name}</Tx>
      <Tx x={1712} cy={55} s={16} c={RC.g5}>{user.role}</Tx>
      <RI n="chevD" s={18} c={RC.g5} x={1854} cy={43} />
      <Hr x={288} y={145} w={1612} c="#EFEFEF" />
    </>
  );
};

// ------------------------------------------------------------------------------------------- Office Communication
export const OC = { x: 1424, y: 349, w: 449, h: 588, listTop: 424, listBot: 788 };
const ocLong = (m: OcMsg) => fullName(m.who).length > 30;
/** Height of one message block (matches the recording: 25 px body lines, ~44 chars per line). */
const lines = (s: string, per = 40) => Math.max(1, Math.ceil(s.length / per));
export const ocMsgH = (m: OcMsg) => 31 + (ocLong(m) ? 23 : 0) + (m.quote ? 48 : 0) + lines((m.m ?? "") + m.body) * 25 + 22;
const OcMessage: React.FC<{ m: OcMsg; hover?: number }> = ({ m, hover = 0 }) => {
  const long = ocLong(m);
  return (
    <div style={{ position: "relative", height: ocMsgH(m), background: hover > 0 ? `rgba(243,244,246,${hover})` : undefined }}>
      <OfficeTile office={m.who.office} x={19} y={4} />
      <div style={{ ...abs(82, 0), width: 340 }}>
        <div style={{ ...t(16.5, 600), lineHeight: "23px", whiteSpace: "normal" }}>
          {fullName(m.who)}{!long && <span style={{ ...t(14, 400, RC.g5), marginLeft: 10 }}>{m.who.role}</span>}
        </div>
        <div style={{ ...t(14, 400, RC.g5), marginTop: 8, lineHeight: "17px" }}>{long && <span style={{ marginRight: 10 }}>{m.who.role}</span>}{m.when}</div>
        {m.quote && (
          <div style={{ marginTop: 6, width: 330, boxSizing: "border-box", background: "#F3F4F6", borderLeft: "2px solid #C4B5FD", borderRadius: "0 4px 4px 0", padding: "4px 10px" }}>
            <div style={{ ...t(14, 600, RC.g8), lineHeight: "18px" }}>{m.quote.who}</div>
            <div style={{ ...t(14, 400, RC.g6), lineHeight: "18px", overflow: "hidden", textOverflow: "ellipsis" }}>{m.quote.text}</div>
          </div>
        )}
        <div style={{ ...t(17.3, 400, RC.ink), whiteSpace: "normal", lineHeight: "25px", marginTop: 2 }}>{m.m && <Mention c={RC.ocM}>{m.m}</Mention>}{m.body}</div>
      </div>
      {hover > 0 && <div style={{ ...abs(396, 2), width: 30, height: 26, borderRadius: 4, background: "#fff", border: `1px solid ${RC.line}`, opacity: hover, display: "flex", alignItems: "center", justifyContent: "center" }}><RI n="reply" s={15} c={RC.g6} /></div>}
    </div>
  );
};
export type OcState = { msgs: OcMsg[]; listScroll?: number; draft?: string; draftMention?: string; hoverIdx?: number; hover?: number; newFrom?: number; newP?: number; replyTo?: string };
/** Office Communication card. listScroll = px scrolled up from the bottom (0 = newest visible, as the app opens). */
export const OfficeComm: React.FC<{ s: OcState; other: string }> = ({ s, other }) => {
  const total = s.msgs.reduce((a, m) => a + ocMsgH(m), 0);
  const view = OC.listBot - OC.listTop;
  const off = Math.max(0, total - view + 8) - (s.listScroll ?? 0);
  const typing = (s.draft ?? "").length > 0 || (s.draftMention ?? "").length > 0;
  return (
    <Card x={OC.x} y={OC.y} w={OC.w} h={OC.h}>
      <RI n="msg" s={19} c={RC.pur} x={18} cy={27} />
      <Tx x={45} cy={27} s={18.5} w={600}>Office Communication</Tx>
      <Tx x={381} cy={23} s={14} w={600} c="#4F46E5">Expand</Tx>
      <Tx x={18} cy={52} s={14.5} c={RC.g6}>Messaging with {other}</Tx>
      <Hr x={0} y={75} w={447} />
      <div style={{ ...abs(0, 76), width: 447, height: view - 1, overflow: "hidden" }}>
        <div style={{ position: "absolute", left: 0, top: 6 - off, width: 430 }}>
          {s.msgs.map((m, i) => (
            <div key={i} style={i >= (s.newFrom ?? 99) ? { opacity: s.newP ?? 1, transform: `translateY(${(1 - (s.newP ?? 1)) * 14}px)` } : undefined}>
              <OcMessage m={m} hover={i === s.hoverIdx ? s.hover ?? 1 : 0} />
            </div>
          ))}
        </div>
        <div style={{ ...abs(434, 4), width: 8, height: view - 10, borderRadius: 4, background: "#F1F1F1" }}>
          <div style={{ ...abs(0, Math.max(0, (1 - (off + view) / Math.max(total, view)) * 0 + (off / Math.max(total, 1)) * (view - 10))), width: 8, height: Math.min(view - 10, (view / Math.max(total, view)) * (view - 10)), borderRadius: 4, background: "#B4B4B4" }} />
        </div>
      </div>
      {s.replyTo && (
        <div style={{ ...abs(15, OC.listBot - OC.y - 30), width: 420, height: 30, background: "#F5F3FF", borderLeft: "2px solid #C4B5FD", display: "flex", alignItems: "center", paddingLeft: 10, boxSizing: "border-box", ...t(13.5, 500, RC.g7) }}>Replying to {s.replyTo}<RI n="x" s={14} c={RC.g5} style={{ marginLeft: "auto", marginRight: 10 }} /></div>
      )}
      <div style={{ ...abs(15, 453), width: 421, height: 104, boxSizing: "border-box", border: `1px solid ${typing ? "#C4B5FD" : RC.line}`, borderRadius: 6, background: "#fff", overflow: "hidden" }}>
        <div style={{ ...abs(13, 9), width: 395, ...t(16.5, 400, typing ? RC.ink : RC.g4), whiteSpace: "normal", lineHeight: "22px", height: 44, overflow: "hidden" }}>
          {typing ? <>{s.draftMention && <Mention c={RC.ocM}>{s.draftMention}</Mention>}{s.draft}</> : `Message ${other}`}
        </div>
        <div style={{ ...abs(0, 54), width: 421, height: 50, background: "#FAFAFA" }}>
          <RI n="at" s={19} c={RC.g6} x={18} cy={25} /><RI n="smile" s={19} c={RC.g6} x={56} cy={25} />
          <div style={{ ...abs(374, 7), width: 36, height: 36, borderRadius: 4, background: typing ? RC.pur : "#B6A2F2", display: "flex", alignItems: "center", justifyContent: "center" }}><RI n="send" s={18} c="#fff" /></div>
        </div>
      </div>
      <Tx x={0} cy={567} s={14} c={RC.g4} style={{ width: 435, textAlign: "right" }}>Enter to send · Shift+Enter for new line</Tx>
    </Card>
  );
};

// ------------------------------------------------------------------------------------------- Status & Schedule
export const STATUS_TOP = 957;
const StatusCard: React.FC<{ sel: string; selP?: number }> = ({ sel, selP = 1 }) => {
  const y0 = STATUS_TOP;
  return (
    <Card x={1424} y={y0} w={449} h={561}>
      <RI n="clip" s={21} c="#7C5CEB" x={28} cy={33} />
      <Tx x={59} cy={33} s={20.5} w={600}>Status &amp; Schedule</Tx>
      <div style={{ ...abs(27, 52), width: 400, ...t(14.5, 400, RC.g6), whiteSpace: "normal", lineHeight: "18px" }}>Update referral status, call the office, or schedule an appointment. <span style={{ color: "#4F46E5" }}>Email notification settings</span></div>
      <div style={{ ...abs(27, 104), width: 394, height: 439, boxSizing: "border-box", background: "#FAFAFA", border: `1px solid ${RC.line}`, borderRadius: 8 }} />
      {CHIP_ROWS.map((c) => {
        const on = c.t === sel;
        return (
          <div key={c.t} style={{ ...abs(c.x - 1424, c.cy - 15), width: c.w, height: 30, boxSizing: "border-box", borderRadius: 999, background: c.bg, display: "flex", alignItems: "center", justifyContent: "center", ...t(14.5, 600, c.fg),
            boxShadow: on ? `0 0 0 ${2 * selP}px ${c.fg}99` : undefined, transform: on ? `scale(${1 + 0.06 * Math.sin(Math.PI * Math.min(1, selP))})` : undefined }}>{c.t}</div>
        );
      })}
      <div style={{ ...abs(44, 398), width: 14, height: 14, boxSizing: "border-box", border: "1px solid #9CA3AF", borderRadius: 3, background: "#fff" }} />
      <Tx x={66} cy={405} s={17} c={RC.g8}>Hide Note Creator</Tx>
      <div style={{ ...abs(66, 420), width: 340, ...t(14.5, 400, RC.g6), whiteSpace: "normal", lineHeight: "18px" }}>Don't prompt for a note when changing to Completed, Cancelled, or Consultation Completed. You can still use Create a Note.</div>
      <div style={{ ...abs(43, 487), width: 125, height: 40, boxSizing: "border-box", border: `1px solid ${RC.line}`, borderRadius: 6, background: "#fff", display: "flex", alignItems: "center", gap: 9, paddingLeft: 13, ...t(17, 400, RC.g8) }}><RI n="cal" s={18} c={RC.g7} />Schedule</div>
      <div style={{ ...abs(178, 487), width: 158, height: 40, boxSizing: "border-box", border: `1px solid ${RC.line}`, borderRadius: 6, background: "#fff", display: "flex", alignItems: "center", gap: 9, paddingLeft: 13, ...t(17, 400, RC.g8) }}><RI n="fileTxt" s={18} c={RC.g7} />Create a Note</div>
    </Card>
  );
};
/** "Create a Note" button, page coordinates. */
export const CREATE_NOTE = { x: 1602, y: STATUS_TOP + 487, w: 158, h: 40 };

// ------------------------------------------------------------------------------------------- Administrative Notes
export const AN_TOP = 1538;
const anNoteH = (n: AdNote) => 54 + (n.quote ? 52 : 0) + lines((n.m ?? "") + n.body, 39) * 25.5 + 22;
export const AdminNotes: React.FC<{ notes: AdNote[]; newP?: number; unread?: boolean }> = ({ notes, newP = 1, unread = true }) => {
  let y = 530;
  const h = 530 + notes.reduce((a, n) => a + anNoteH(n), 0) + 10;
  return (
    <Card x={1424} y={AN_TOP} w={449} h={h}>
      <RI n="file" s={21} c="#7C5CEB" x={28} cy={34} />
      <Tx x={59} cy={34} s={20.5} w={600}>Administrative Notes</Tx>
      <div style={{ ...abs(271, 23), height: 22, padding: "0 8px", borderRadius: 999, background: "#E6DBFF", display: "flex", alignItems: "center", ...t(13, 600, "#6D3FE0") }}>{notes.length + 1}</div>
      <div style={{ ...abs(341, 17), width: 35, height: 35, borderRadius: 6, background: "#F3F4F6", display: "flex", alignItems: "center", justifyContent: "center" }}><RI n="fileTxt" s={18} c={RC.g7} /></div>
      <div style={{ ...abs(386, 17), width: 35, height: 35, borderRadius: 6, background: "#7949EE", display: "flex", alignItems: "center", justifyContent: "center" }}><RI n="fileEdit" s={18} c="#fff" /></div>
      <div style={{ ...abs(27, 54), width: 310, ...t(14.5, 400, RC.g6), whiteSpace: "normal", lineHeight: "18px" }}>Company-private notes. Not shared with other parties.</div>
      {unread && <div style={{ ...abs(27, 104), height: 22, padding: "0 9px", borderRadius: 999, background: "#7C5CEB", display: "flex", alignItems: "center", ...t(13.5, 600, "#fff") }}>1 unread @mention</div>}
      {unread && <Tx x={180} cy={115} s={14.5} w={600} c="#5B3FC4">Mark all as read</Tx>}
      <div style={{ ...abs(27, 145), width: 394, height: 300, boxSizing: "border-box", border: `1px solid ${RC.line}`, borderRadius: 8 }}>
        <Tx x={18} cy={42} s={16.5} w={600}>Referral Timeline</Tx>
        <div style={{ ...abs(162, 18), width: 212, height: 49, boxSizing: "border-box", border: "1px solid #1E3A8A", borderRadius: 4, display: "flex", alignItems: "center", gap: 8, paddingLeft: 16, ...t(14.5, 600, "#1E3A8A") }}><RI n="fileTxt" s={17} c="#1E3A8A" />Consultation Notes</div>
        <div style={{ ...abs(23, 92), width: 2, height: 88, background: "#D1D5DB" }} />
        <div style={{ ...abs(18, 87), width: 12, height: 12, borderRadius: 12, background: "#1F8D3F" }} />
        <Tx x={45} cy={93} s={16.5} w={600}>Received</Tx><Tx x={300} cy={93} s={14} c={RC.g6}>11/03/2026</Tx>
        <div style={{ ...abs(45, 106), width: 330, ...t(16.5, 400, RC.g7), whiteSpace: "normal", lineHeight: "22px" }}>Referral received from {LAKESIDE}.</div>
        <div style={{ ...abs(18, 175), width: 12, height: 12, borderRadius: 12, background: "#6A11D4" }} />
        <Tx x={45} cy={181} s={16.5} w={600}>Spoke with Patient / Scheduled</Tx>
        <div style={{ ...abs(45, 194), width: 330, ...t(16.5, 400, RC.g7), whiteSpace: "normal", lineHeight: "22px" }}>Spoke with patient and scheduled on 11/14/2026.</div>
        <div style={{ ...abs(45, 246), height: 22, padding: "0 9px", borderRadius: 999, background: "#ECE6FB", display: "flex", alignItems: "center", ...t(14, 600, "#5B21B6") }}>Consult 11/14/2026</div>
      </div>
      <Tx x={27} cy={484} s={16.5} w={500} c="#6D3FE0">Show all {notes.length + 1} notes</Tx>
      {notes.map((n, i) => {
        const top = y; y += anNoteH(n);
        const p = i === 0 ? newP : 1;
        return (
          <div key={i} style={{ ...abs(14, top), width: 408, height: anNoteH(n) - 10, opacity: p, transform: `translateY(${(1 - p) * 16}px)`, background: n.unread && unread ? "#F7F5FE" : undefined, borderLeft: n.unread && unread ? "2px solid #8B5CF6" : "2px solid transparent" }}>
            <div style={{ ...abs(13, 12), width: 38, height: 38, borderRadius: 38, background: "#5455B0", display: "flex", alignItems: "center", justifyContent: "center", ...t(15, 600, "#fff") }}>{n.who.ini}</div>
            <Tx x={63} cy={22} s={16.5} w={500}>{n.who.name}</Tx>
            <Tx x={63} cy={43} s={14} c={RC.g6}>{n.when}</Tx>
            <RI n="reply" s={14} c={RC.g4} x={384} cy={46} />
            <div style={{ ...abs(63, 58), width: 340 }}>
              {n.quote && (
                <div style={{ marginBottom: 6, boxSizing: "border-box", background: "#F3F4F6", borderLeft: "2px solid #C4B5FD", padding: "4px 10px", borderRadius: "0 4px 4px 0" }}>
                  <div style={{ ...t(14, 600, RC.g8), lineHeight: "18px" }}>{n.quote.who}</div>
                  <div style={{ ...t(14, 400, RC.g6), lineHeight: "18px", overflow: "hidden", textOverflow: "ellipsis" }}>{n.quote.text}</div>
                </div>
              )}
              <div style={{ ...t(16.5, 400, RC.g8), whiteSpace: "normal", lineHeight: "25.5px" }}>{n.m && <Mention c={RC.anM}>{n.m}</Mention>}{n.body}</div>
            </div>
          </div>
        );
      })}
    </Card>
  );
};
/** Page box of the newest admin note and of the "Company-private notes" line. */
export const AN_NOTE0 = { x: 1438, y: AN_TOP + 530, w: 408, h: 200 };
export const AN_PRIVATE = { x: 1451, y: AN_TOP + 54, w: 320, h: 38 };

// ------------------------------------------------------------------------------------------- left column
export type XrayT = { src: string; name: string; date: string };
export const XR_TOP = 1046;
const XrayCard: React.FC<{ x: XrayT; top: number; glow?: number }> = ({ x, top, glow = 0 }) => (
  <Card x={369} y={top} w={301} h={247} style={{ boxShadow: glow > 0 ? `0 0 0 ${3 * glow}px ${RC.pur}` : undefined }}>
    <Img src={staticFile(x.src)} style={{ ...abs(14, 15), width: 271, height: 113, objectFit: "cover", borderRadius: 4 }} />
    <div style={{ ...abs(242, 24), width: 32, height: 32, borderRadius: 32, background: "rgba(40,40,40,0.75)", display: "flex", alignItems: "center", justifyContent: "center" }}><RI n="refresh" s={15} c="#fff" /></div>
    <Tx x={14} cy={153} s={16.5} c={RC.g8}>{x.name}</Tx>
    <Tx x={14} cy={188} s={14} c={RC.g6}>{x.date}</Tx>
    <Tx x={14} cy={220} s={16.5} c={RC.pur}>Download</Tx>
  </Card>
);
export type CaseData = {
  office: string; doctor: string; pt: { name: string; dob: string; age: string; pronoun: string; gender: string; phone: string; email: string };
  priority: string; item: string; dx: string; xrays: XrayT[]; signed?: { by: string; date: string };
};
export const signedTop = (c: CaseData) => XR_TOP + 71 + c.xrays.length * 263 + 16;
const LeftCard: React.FC<{ c: CaseData; xrGlow?: number[]; signedP?: number }> = ({ c, xrGlow = [], signedP = 1 }) => {
  const xrH = 71 + c.xrays.length * 263 + 3;
  const sTop = signedTop(c);
  const insTop = sTop + (c.signed ? 151 + 28 : 0) + 20;
  const actTop = insTop + 520;
  const rows: [string, string][] = [["Patient Name:", c.pt.name], ["DOB:", c.pt.dob], ["Age:", c.pt.age], ["Preferred pronoun:", c.pt.pronoun], ["Gender:", c.pt.gender], ["Patient's Phone:", c.pt.phone], ["Patient's Email:", c.pt.email]];
  return (
    <>
      <Card x={316} y={349} w={1071} h={actTop + 300 - 349} />
      <Tx x={352} cy={395} s={15.5} c={RC.g6}>Referred to</Tx>
      <Tx x={352} cy={424} s={22} c={RC.g8}>{c.office}</Tx>
      <Tx x={352} cy={455} s={22} c={RC.g8}>{c.doctor}</Tx>
      {rows.map(([k, v], i) => <React.Fragment key={k}><Tx x={865} cy={398 + 36 * i} s={17.5} w={600}>{k}</Tx><Tx x={1045} cy={398 + 36 * i} s={17.5} c={RC.g8}>{v}</Tx></React.Fragment>)}
      <Hr x={352} y={655} w={999} />
      <Tx x={352} cy={696} s={17.5} w={600}>Referral Status</Tx>
      <Tx x={352} cy={725} s={15.5} c={RC.g6}>Status and requested treatment for this referral.</Tx>
      <Tx x={352} cy={765} s={14} w={500} c={RC.g6} style={{ letterSpacing: "0.04em" }}>STATUS</Tx>
      <div style={{ ...abs(418, 748), height: 34, padding: "0 14px", borderRadius: 999, background: "#F4E3DD", display: "flex", alignItems: "center", ...t(16.5, 500, "#3F2A1F") }}>{c.priority}</div>
      <Tx x={352} cy={811} s={17} w={600} c={RC.g7}>Please consult and treat</Tx>
      <Card x={352} y={836} w={999} h={86}>
        <div style={{ ...abs(15, 14), width: 24, height: 24, borderRadius: 24, background: "#EDE9FE", display: "flex", alignItems: "center", justifyContent: "center", ...t(13, 600, RC.pur) }}>1</div>
        <Tx x={50} cy={26} s={18.5} w={600}>{c.item}</Tx>
        <Tx x={50} cy={61} s={16.5} c={RC.g7}>Diagnosis: {c.dx}</Tx>
        <RI n="pen" s={16} c={RC.pur} x={830} cy={26} /><Tx x={852} cy={26} s={16.5} w={500} c={RC.pur}>Edit</Tx>
        <RI n="trash" s={16} c={RC.red} x={904} cy={26} /><Tx x={927} cy={26} s={16.5} w={500} c={RC.red}>Delete</Tx>
      </Card>
      <Hr x={352} y={949} w={999} />
      <Tx x={352} cy={990} s={17.5} w={600}>Attachments</Tx>
      <Tx x={352} cy={1019} s={15.5} c={RC.g6}>Imaging, documents, and signed notes shared with both offices.</Tx>
      <Card x={352} y={XR_TOP} w={493} h={xrH} bg="#FAFAFA">
        <Tx x={16} cy={34} s={17.5} w={600}>X-rays <span style={{ ...t(16, 400, RC.g5), marginLeft: 6 }}>({c.xrays.length})</span></Tx>
      </Card>
      <RBtn x={716} y={XR_TOP + 16} w={112} h={35} label="Edit X-rays" s={16.5} />
      {c.xrays.map((x, i) => <XrayCard key={i} x={x} top={XR_TOP + 71 + i * 263} glow={xrGlow[i]} />)}
      <Card x={858} y={XR_TOP} w={493} h={xrH} bg="#FAFAFA">
        <Tx x={16} cy={34} s={17.5} w={600}>Documents</Tx>
        <Tx x={16} cy={81} s={16.5} c={RC.g6}>No documents attached</Tx>
      </Card>
      <RBtn x={1187} y={XR_TOP + 16} w={147} h={35} label="Edit Documents" s={16.5} />
      {c.signed && (
        <div style={{ opacity: signedP, transform: `translateY(${(1 - signedP) * 12}px)` }}>
          <Card x={352} y={sTop} w={999} h={151} bg="#FAFAFA">
            <RI n="fileSig" s={19} c="#16A34A" x={16} cy={27} />
            <Tx x={44} cy={27} s={17} w={500}>Signed notes</Tx>
            <Tx x={44} cy={50} s={14.5} c={RC.g6}>Visible to both offices.</Tx>
            <Card x={16} y={68} w={965} h={68}>
              <Tx x={14} cy={23} s={16.5}>Consultation Note</Tx>
              <Tx x={14} cy={46} s={14.5} c={RC.g6}>Signed {c.signed.date} · by {c.signed.by}</Tx>
            </Card>
          </Card>
          <RBtn x={885} y={sTop + 80} w={88} h={38} label="View" icon="eye" s={17} />
          <RBtn x={982} y={sTop + 80} w={113} h={38} label="Rename" icon="tag" s={17} />
          <RBtn x={1104} y={sTop + 80} w={80} h={38} label="Edit" icon="pen" s={17} />
          <RBtn x={1193} y={sTop + 80} w={127} h={38} label="Download" icon="down" s={17} />
        </div>
      )}
      <Hr x={352} y={insTop} w={999} />
      <Tx x={352} cy={insTop + 41} s={18.5} w={600}>Insurance cards (1)</Tx>
      <Tx x={352} cy={insTop + 70} s={16.5} c={RC.g6}>Primary / secondary cards for this patient.</Tx>
      <RBtn x={1043} y={insTop + 22} w={113} h={38} label="+ Add card" s={17} />
      <RBtn x={1165} y={insTop + 22} w={186} h={38} label="Request from patient" s={17} />
      <Card x={352} y={insTop + 98} w={999} h={380} bg="#FAFAFA">
        <div style={{ ...abs(18, 16), height: 24, padding: "0 9px", borderRadius: 4, background: "#EDE9FE", display: "flex", alignItems: "center", ...t(14, 600, "#5B21B6") }}>PRIMARY</div>
        <Tx x={106} cy={28} s={14.5} c={RC.g6}>Submitted by Staff</Tx>
        <RI n="pen" s={15} c={RC.pur} x={850} cy={28} /><Tx x={871} cy={28} s={16} c={RC.pur}>Edit</Tx>
        <RI n="trash" s={15} c={RC.red} x={911} cy={28} /><Tx x={931} cy={28} s={16} c={RC.red}>Delete</Tx>
        <Img src={staticFile("app/ins-front.png")} style={{ ...abs(18, 54), width: 323, height: 200, objectFit: "contain", background: "#fff", border: `1px solid ${RC.line}`, borderRadius: 4 }} />
        <Img src={staticFile("app/ins-back.png")} style={{ ...abs(357, 54), width: 323, height: 200, objectFit: "contain", background: "#fff", border: `1px solid ${RC.line}`, borderRadius: 4 }} />
        <Tx x={18} cy={278} s={13.5} c={RC.g6}>POLICY</Tx><Tx x={18} cy={298} s={16.5} c={RC.g8}>DLT-4471920</Tx>
        <Tx x={367} cy={278} s={13.5} c={RC.g6}>GROUP</Tx><Tx x={367} cy={298} s={16.5} c={RC.g8}>2568715</Tx>
        <Tx x={18} cy={327} s={13.5} c={RC.g6}>SUBSCRIBER</Tx><Tx x={18} cy={347} s={16.5} c={RC.g8}>Same as patient</Tx>
      </Card>
      <Tx x={352} cy={actTop + 20} s={18.5} w={600}>Activity log</Tx>
      {ACTIVITY_OLIVIA.map((a, i) => (
        <React.Fragment key={i}>
          <div style={{ ...abs(353, actTop + 52 + 36 * i), width: 8, height: 8, borderRadius: 8, background: "#6D3FE0" }} />
          <Tx x={376} cy={actTop + 56 + 36 * i} s={16.5} c={RC.g7}><b style={{ fontWeight: 600, color: RC.g8 }}>{a.who}</b> <span style={{ color: RC.g4 }}>({a.when})</span> {a.text}</Tx>
        </React.Fragment>
      ))}
      <div style={{ ...abs(357, actTop + 56), width: 1, height: 36 * (ACTIVITY_OLIVIA.length - 1), background: RC.line }} />
    </>
  );
};

// ------------------------------------------------------------------------------------------- case page
export type CaseView = {
  scroll: number; user?: Person; clinic?: string; other: string; title?: string; active?: NavT; c: CaseData; oc: OcState; status: string; statusP?: number;
  notes: AdNote[]; notesNewP?: number; unread?: boolean; xrGlow?: number[]; signedP?: number; badge?: number; badgePop?: number;
};
/** The case page (Details tab), whole browser viewport 1920x842. */
export const CasePage: React.FC<{ v: CaseView; overlay?: React.ReactNode }> = ({ v, overlay }) => {
  const user = v.user ?? P.rachel, clinic = v.clinic ?? HARBORVIEW;
  const pageH = 3300;
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: RW, height: RH, overflow: "hidden", background: RC.bg, fontFamily: F }}>
      <div style={{ position: "absolute", left: 0, top: -v.scroll, width: RW, height: pageH }}>
        <Shell title={v.title ?? "Incoming Referrals"} active={v.active ?? "Incoming"} office={clinic} user={user} badge={v.badge ?? 3} badgePop={v.badgePop} />
        <RI n="arrowL" s={20} c={RC.g6} x={316} cy={231} /><Tx x={342} cy={231} s={18} c={RC.g6}>Back to Referrals</Tx>
        <RBtn x={990} y={208} w={169} h={46} label="Edit Referral" icon="pen" />
        <RBtn x={1173} y={208} w={194} h={46} label="Download PDF" icon="down" />
        <RBtn x={1381} y={208} w={287} h={46} label="Download PDF for patient" icon="down" />
        <RBtn x={1682} y={208} w={191} h={46} label="Delete Referral" icon="trash" red />
        <Tx x={333} cy={296} s={18} w={500} c={RC.pur}>Details</Tx>
        <Tx x={427} cy={296} s={18} w={500} c={RC.g6}>Messages</Tx>
        <Hr x={315} y={320} w={1558} />
        <div style={{ ...abs(315, 317), width: 93, height: 3, background: RC.pur }} />
        <LeftCard c={v.c} xrGlow={v.xrGlow} signedP={v.signedP} />
        <OfficeComm s={v.oc} other={v.other} />
        <StatusCard sel={v.status} selP={v.statusP} />
        <AdminNotes notes={v.notes} newP={v.notesNewP} unread={v.unread} />
        <Card x={1424} y={AN_TOP + 530 + v.notes.reduce((a, n) => a + anNoteH(n), 0) + 30} w={449} h={70}>
          <Tx x={27} cy={23} s={14.5} c={RC.g6}>All communications are HIPAA compliant and encrypted</Tx>
          <RI n="shield" s={14} c={RC.g6} x={27} cy={45} /><Tx x={46} cy={45} s={14.5} c={RC.g6}>Secure</Tx><Tx x={104} cy={45} s={14.5} c={RC.g6}>Last updated: 11/10/2026</Tx>
        </Card>
      </div>
      {/* browser scrollbar + chat button (fixed) */}
      <div style={{ ...abs(1900, 0), width: 20, height: RH, background: "#F1F1F1" }}>
        <div style={{ ...abs(5, 14 + (v.scroll / pageH) * 810), width: 10, height: (RH / pageH) * 810, borderRadius: 5, background: "#A8A8A8" }} />
      </div>
      <div style={{ ...abs(1811, 752), width: 62, height: 62, borderRadius: 62, background: "#744CDD", boxShadow: "0 6px 16px rgba(80,50,180,0.35)", display: "flex", alignItems: "center", justifyContent: "center" }}><RI n="msg" s={24} c="#fff" /></div>
      {overlay}
    </div>
  );
};

/** Success toast (top right), as in the recording. */
export const Toast: React.FC<{ p: number; title?: string; text: string }> = ({ p, title = "Success", text }) => (
  <div style={{ ...abs(1434, 36), width: 431, height: 91, boxSizing: "border-box", padding: "14px 18px", borderRadius: 8, background: "#F0FDF4", border: "1px solid #BBF7D0", boxShadow: "0 8px 20px rgba(0,0,0,0.08)", opacity: p, transform: `translateY(${(1 - p) * -14}px)`, zIndex: 40 }}>
    <div style={t(16.5, 600, "#166534")}>{title}</div>
    <div style={{ ...t(14.5, 400, RC.g7), whiteSpace: "normal", lineHeight: "18px", marginTop: 6, width: 360 }}>{text}</div>
    <RI n="x" s={14} c={RC.g5} x={398} cy={33} />
  </div>
);

// ------------------------------------------------------------------------------------------- Prepare Consultation Note
export type Seg = string | { v: string; val: string; at: number };
/** One filled variable: the {{variable}} chip turns into its value at p >= 1 (crossfade over its width). */
const VarChip: React.FC<{ s: Exclude<Seg, string>; f: number }> = ({ s, f }) => {
  const k = Math.min(1, Math.max(0, (f - s.at) / 6));
  return (
    <span style={{ display: "inline-block", background: k < 1 ? `rgba(245,243,255,1)` : "#F5F3FF", border: "1px solid #DDD6FE", borderRadius: 3, padding: "0 4px", color: "#6D28D9", lineHeight: "24px", fontFamily: k < 0.5 ? "JetBrains Mono, monospace" : F, fontSize: k < 0.5 ? 15 : 18.5, boxShadow: k > 0 && k < 1 ? `0 0 0 3px rgba(124,92,235,${0.35 * (1 - k)})` : undefined }}>
      {k < 0.5 ? s.v : s.val}
    </span>
  );
};
export const ConsultModal: React.FC<{ p: number; f: number; letter: Seg[][]; signHot?: number }> = ({ p, f, letter, signHot = 0 }) => (
  <>
    <div style={{ ...abs(0, 0), width: RW, height: RH, background: `rgba(0,0,0,${0.5 * p})`, zIndex: 30 }} />
    <div style={{ ...abs(375, 42), width: 1152, height: 758, borderRadius: 10, background: "#fff", overflow: "hidden", zIndex: 31, opacity: p, transform: `scale(${0.96 + 0.04 * p})`, boxShadow: "0 25px 50px rgba(0,0,0,0.25)" }}>
      <Tx x={26} cy={34} s={22.5} w={600}>Prepare Consultation Note</Tx>
      <Tx x={26} cy={64} s={16.5} c={RC.g6}>Review, edit, and sign the consultation note before sending it.</Tx>
      <RI n="x" s={20} c={RC.g8} w={2.6} x={1105} cy={48} />
      <Hr x={0} y={95} w={1152} />
      <div style={{ ...abs(27, 95), width: 1079, height: 539, boxSizing: "border-box", border: `1px solid ${RC.line}`, borderTop: "none", borderRadius: "0 0 6px 6px", overflow: "hidden" }}>
        <div style={{ ...abs(0, 0), width: 1079, height: 96, background: "#FAFAFA", borderBottom: `1px solid ${RC.line}` }}>
          {[["undo", 28], ["bold", 83], ["code", 123], ["list", 163], ["link", 203]].map(([n, x]) => <RI key={n} n={n as string} s={19} c={RC.g7} x={x as number} cy={27} />)}
          <div style={{ ...abs(241, 11), width: 120, height: 32, boxSizing: "border-box", border: `1px solid ${RC.line}`, borderRadius: 4, background: "#fff", display: "flex", alignItems: "center", paddingLeft: 12, ...t(16.5, 400, RC.g8) }}>Paragraph<RI n="chevD" s={14} c={RC.g8} style={{ marginLeft: "auto", marginRight: 8 }} /></div>
          <div style={{ ...abs(381, 11), width: 89, height: 32, boxSizing: "border-box", border: `1px solid ${RC.line}`, borderRadius: 4, background: "#fff", display: "flex", alignItems: "center", paddingLeft: 12, ...t(16.5, 400, RC.g8) }}>Size<RI n="chevD" s={14} c={RC.g8} style={{ marginLeft: "auto", marginRight: 8 }} /></div>
          {[["list", 497], ["hash", 538], ["alignL", 594], ["alignC", 634], ["alignR", 674], ["img", 730]].map(([n, x]) => <RI key={(n as string) + x} n={n as string} s={18} c={RC.g7} x={x as number} cy={27} />)}
          <div style={{ ...abs(10, 55), width: 361, height: 31, boxSizing: "border-box", border: `1px solid ${RC.line}`, borderRadius: 4, background: "#fff", display: "flex", alignItems: "center", paddingLeft: 12, ...t(16.5, 400, RC.g8) }}>Insert Variable...<RI n="chevD" s={14} c={RC.g8} style={{ marginLeft: "auto", marginRight: 8 }} /></div>
        </div>
        <div style={{ ...abs(36, 136), width: 1000, ...t(18.5, 400, RC.ink), whiteSpace: "normal", lineHeight: "27px" }}>
          {letter.map((ln, i) => (
            <div key={i} style={{ minHeight: 27, marginBottom: ln.length === 0 ? 0 : 0 }}>
              {ln.map((s, j) => (typeof s === "string" ? <span key={j}>{s}</span> : <VarChip key={j} s={s} f={f} />))}
            </div>
          ))}
        </div>
      </div>
      <div style={{ ...abs(0, 633), width: 1152, height: 125, background: "#FAFAFA", borderTop: `1px solid ${RC.line}` }}>
        <Img src={staticFile("app/docusign-logo.png")} style={{ ...abs(26, 18), width: 113, height: 27 }} />
        <RBtn x={27} y={60} w={97} h={46} label="Cancel" />
        <RBtn x={137} y={60} w={127} h={46} label="Save Draft" />
        <RBtn x={277} y={60} w={161} h={46} label="Save Changes" muted />
        <RBtn x={451} y={60} w={231} h={46} label="Save as New Template" muted />
        <RBtn x={696} y={60} w={318} h={46} label="Sign and Send Consultation Note" solid style={{ boxShadow: signHot > 0 ? `0 0 0 ${4 * signHot}px rgba(119,74,237,0.35)` : undefined }} />
      </div>
    </div>
  </>
);
/** Page-space box of the modal's Sign and Send button. */
export const SIGN_BTN = { x: 1071, y: 735, w: 318, h: 46 };
export const LETTER_BOX = { x: 402, y: 270, w: 1079, h: 400 };

// ------------------------------------------------------------------------------------------- Provider's Day-Prep Station (dark)
export type DpNote = { who: string; when: string; m?: string; body: string };
const DK = { main: "#101725", bar: "#1F2835", line: "#334155", txt: "#F3F4F6", sub: "#9CA3AF" };
export const DayPrep: React.FC<{ patient: string; dob: string; age: string; office: string; referrer: string; reason: string; doctor: string;
  draft?: string; draftMention?: string; notes: DpNote[]; newP?: number; addHot?: number; caret?: boolean }> = (p) => {
  const typing = (p.draft ?? "").length + (p.draftMention ?? "").length > 0;
  const sel = (x: number, w: number, label: string) => (
    <div style={{ ...abs(x, 16), width: w, height: 35, boxSizing: "border-box", borderRadius: 4, background: "#2B3544", border: `1px solid #4B5563`, display: "flex", alignItems: "center", paddingLeft: 18, ...t(16.5, 500, DK.txt) }}>{label}<RI n="chevD" s={15} c={DK.txt} style={{ marginLeft: "auto", marginRight: 8 }} /></div>
  );
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: RW, height: RH, overflow: "hidden", background: DK.main, fontFamily: F }}>
      <div style={{ ...abs(0, 0), width: 1900, height: 68, background: DK.bar, borderBottom: `1px solid ${DK.line}` }} />
      <Tx x={27} cy={34} s={20} w={700} c="#fff">Provider's Day-Prep Station</Tx>
      {sel(312, 160, p.doctor)}
      <Tx x={484} cy={34} s={16.5} c="#D1D5DB">Today: 11/10/2026</Tx>
      <div style={{ ...abs(626, 16), width: 161, height: 35, boxSizing: "border-box", borderRadius: 4, background: "#2B3544", border: "1px solid #4B5563", display: "flex", alignItems: "center", paddingLeft: 11, ...t(16.5, 500, DK.txt) }}>11/14/2026<RI n="cal" s={15} c={DK.txt} style={{ marginLeft: "auto", marginRight: 12 }} /></div>
      {sel(797, 470, `${p.patient.toUpperCase()} (${p.dob}) — Consultation`)}
      <div style={{ ...abs(1795, 15), width: 78, height: 37, borderRadius: 4, background: RC.red, display: "flex", alignItems: "center", justifyContent: "center", ...t(16.5, 600, "#fff") }}>Close</div>
      {/* patient card */}
      <div style={{ ...abs(18, 88), width: 431, height: 244, boxSizing: "border-box", border: `1px solid ${DK.line}`, borderRadius: 8, background: DK.main, boxShadow: "0 6px 18px rgba(0,0,0,0.4)" }}>
        <Tx x={18} cy={28} s={16.5} w={700} c="#fff">Patient &amp; Referring Info</Tx>
        <RI n="x" s={15} c={DK.sub} x={405} cy={18} />
        <Tx x={18} cy={63} s={13} w={600} c={DK.sub} style={{ letterSpacing: "0.03em" }}>PATIENT NAME</Tx>
        <Tx x={18} cy={82} s={16.5} w={600} c="#fff">{p.patient.toUpperCase().split(" ")[0]}</Tx>
        <Tx x={18} cy={104} s={16.5} w={600} c="#fff">{p.patient.toUpperCase().split(" ")[1]}<span style={{ marginLeft: 9, padding: "1px 9px", borderRadius: 999, background: "#134E4A", ...t(11.5, 700, "#5EEAD4"), letterSpacing: "0.04em" }}>CONSULTATION</span></Tx>
        <Tx x={224} cy={63} s={13} w={600} c={DK.sub}>DOB</Tx>
        <Tx x={224} cy={82} s={16.5} c="#fff">{p.dob} (Age {p.age})</Tx>
        <Tx x={18} cy={140} s={13} w={600} c={DK.sub}>REFERRING OFFICE</Tx><Tx x={18} cy={159} s={16.5} c="#fff">{p.office}</Tx>
        <Tx x={224} cy={140} s={13} w={600} c={DK.sub}>REFERRING DOCTOR</Tx><Tx x={224} cy={159} s={16.5} c="#fff">{p.referrer}</Tx>
        <Tx x={18} cy={194} s={13} w={600} c={DK.sub}>REFERRED FOR</Tx><Tx x={18} cy={213} s={16.5} c="#fff">{p.reason}</Tx>
        <RI n="pen" s={13} c="#A78BFA" x={371} cy={194} /><Tx x={388} cy={194} s={14} c="#A78BFA">Edit</Tx>
      </div>
      <div style={{ ...abs(1243, 87), width: 208, height: 35, borderRadius: 4, background: "#8B5CF6", display: "flex", alignItems: "center", gap: 10, paddingLeft: 14, boxSizing: "border-box", ...t(16.5, 500, "#fff") }}><RI n="fileTxt" s={16} c="#fff" />Administrative Notes</div>
      <Img src={staticFile("ugc17/real/dp-pano.png")} style={{ ...abs(583, 277), width: 303, height: 167 }} />
      {[[40, "chevL"], [1428, "chevR"]].map(([x, n]) => <div key={n} style={{ ...abs((x as number) - 22, 412), width: 44, height: 44, borderRadius: 44, background: "#374151", display: "flex", alignItems: "center", justifyContent: "center" }}><RI n={n as string} s={20} c="#fff" /></div>)}
      <div style={{ ...abs(714, 656), width: 40, height: 40, borderRadius: 40, background: "#374151", display: "flex", alignItems: "center", justifyContent: "center" }}><RI n="refresh" s={18} c="#fff" /></div>
      <div style={{ ...abs(0, 711), width: 1469, height: 90, background: DK.bar }} />
      <div style={{ ...abs(658, 721), width: 71, height: 69, boxSizing: "border-box", border: "2px solid #8B5CF6", borderRadius: 4, overflow: "hidden" }}><Img src={staticFile("ugc17/real/dp-pano.png")} style={{ width: 67, height: 65, objectFit: "cover" }} /></div>
      <Img src={staticFile("ugc17/real/dp-thumb2.png")} style={{ ...abs(741, 722), width: 67, height: 67, borderRadius: 3 }} />
      <Tx x={0} cy={821} s={16.5} c={DK.sub} style={{ width: 1900, textAlign: "center" }}>1 of 2</Tx>
      {/* admin notes panel */}
      <div style={{ ...abs(1469, 68), width: 431, height: 733, background: DK.main, borderLeft: `1px solid ${DK.line}` }}>
        <Tx x={15} cy={20} s={16.5} w={700} c="#fff">Administrative notes (company only)</Tx>
        <RI n="x" s={16} c={DK.sub} x={402} cy={21} />
        <Hr x={0} y={41} w={431} c={DK.line} />
        <div style={{ ...abs(15, 48), width: 380, ...t(14, 400, DK.sub), whiteSpace: "normal", lineHeight: "18px" }}>Medical history, medications, etc. Not shared with other companies.</div>
        <Hr x={0} y={92} w={431} c={DK.line} />
        <div style={{ ...abs(15, 107), width: 403, height: 101, boxSizing: "border-box", borderRadius: 6, border: `1px solid ${typing ? "#8B5CF6" : "#4B5563"}`, background: DK.bar }}>
          <div style={{ ...abs(13, 9), width: 375, ...t(16.5, 400, typing ? "#fff" : DK.sub), whiteSpace: "normal", lineHeight: "22px", height: 44, overflow: "hidden" }}>
            {typing ? <>{p.draftMention && <span style={{ color: "#A78BFA" }}>{p.draftMention}</span>}{p.draft}{p.caret && <span style={{ display: "inline-block", width: 2, height: 18, background: "#fff", verticalAlign: "-3px" }} />}</> : "Add a note..."}
          </div>
          <div style={{ ...abs(0, 54), width: 401, height: 1, background: "#4B5563" }} />
          <RI n="at" s={18} c={DK.sub} x={18} cy={77} /><RI n="smile" s={18} c={DK.sub} x={56} cy={77} />
        </div>
        <Tx x={0} cy={219} s={13.5} c={DK.sub} style={{ width: 418, textAlign: "right" }}>@ to mention</Tx>
        <div style={{ ...abs(15, 237), width: 57, height: 35, borderRadius: 4, background: typing ? "#6D3FE0" : "#4C3A9E", display: "flex", alignItems: "center", justifyContent: "center", ...t(16.5, 600, typing ? "#fff" : "#C4B5FD"), boxShadow: (p.addHot ?? 0) > 0 ? `0 0 0 ${4 * (p.addHot ?? 0)}px rgba(139,92,246,0.4)` : undefined }}>Add</div>
        <Hr x={0} y={287} w={431} c={DK.line} />
        {p.notes.map((n, i) => {
          const k = i === 0 ? p.newP ?? 1 : 1;
          const h = 52 + lines((n.m ?? "") + n.body, 42) * 23;
          const top = 302 + p.notes.slice(0, i).reduce((a, m) => a + 62 + lines((m.m ?? "") + m.body, 42) * 23, 0);
          return (
            <div key={i} style={{ ...abs(15, top), width: 403, height: h, boxSizing: "border-box", borderRadius: 8, background: DK.bar, padding: "16px 13px", opacity: k, transform: `translateY(${(1 - k) * 14}px)` }}>
              <div style={t(14, 400, DK.sub)}>{n.who} · {n.when}</div>
              <RI n="pen" s={15} c={DK.sub} x={348} cy={26} /><RI n="trash" s={15} c={DK.sub} x={377} cy={26} />
              <div style={{ ...t(16.5, 400, "#fff"), whiteSpace: "normal", lineHeight: "23px", marginTop: 8 }}>{n.m && <span style={{ color: "#A78BFA" }}>{n.m}</span>}{n.body}</div>
            </div>
          );
        })}
      </div>
      <div style={{ ...abs(1900, 0), width: 20, height: RH, background: "#2B2B2B" }} />
    </div>
  );
};
export const DP_INPUT = { x: 1484, y: 175, w: 403, h: 101 };
export const DP_ADD = { x: 1484, y: 305, w: 57, h: 35 };
export const DP_PANEL = { x: 1469, y: 68, w: 431, h: 733 };
