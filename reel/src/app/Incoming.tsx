/** Referrals > Incoming list, matched to public/dash3c/r3c-incoming.jpg (1920x912). Demo data. */
import React from "react";
import { AppFrame, C, ChatFab, FONT, Icon } from "./AppShell";

type Row = { ini: string; col: string; name: string[]; dob: string; from: string[]; to: string[]; status: [string, string, string]; rec: string; upd: string; h: number; hl?: boolean; mail?: boolean; at?: number };
const STATUS = { done: ["Consultation completed", "#FCE7F3", "#8A1D5E"] as [string, string, string], fresh: ["New", "#E6E7FD", "#3B2E7E"] as [string, string, string] };
export const ROWS: Row[] = [
  { ini: "CW", col: "#D21BD0", name: ["Carter", "Wiley"], dob: "11/21/2001", from: [". Gentle", "Dental"], to: ["St. Andrew's", "Family", "Dental"], status: STATUS.done, rec: "11/07/2026, 9:41 AM", upd: "11/07/2026, 10:09 AM", h: 125, hl: true, mail: true, at: 3 },
  { ini: "CS", col: "#5BD5F2", name: ["Conrad Smith"], dob: "11/03/2000", from: ["North", "Carolina", "Hospital", "Dentistry"], to: ["St. Andrew's", "Family", "Dental"], status: STATUS.fresh, rec: "11/04/2026, 6:39 PM", upd: "11/04/2026, 6:42 PM", h: 153 },
  { ini: "JC", col: "#5A0E8A", name: ["john carter"], dob: "11/06/1990", from: ["The", "Dental", "Center"], to: ["St. Andrew's", "Family", "Dental"], status: STATUS.fresh, rec: "11/04/2026, 9:04 AM", upd: "11/04/2026, 9:04 AM", h: 126 },
  { ini: "GM", col: "#C98712", name: ["grorge", "miranda"], dob: "11/11/1997", from: ["Great", "West", "Endodontics"], to: ["St. Andrew's", "Family", "Dental"], status: STATUS.fresh, rec: "11/02/2026, 10:40 AM", upd: "11/02/2026, 10:40 AM", h: 126 },
];
const COL = { cb: 414, name: 455, dob: 684, from: 811, to: 945, status: 1056, rec: 1282, upd: 1491, act: 1687 };

const Check: React.FC<{ x: number; y: number }> = ({ x, y }) => (
  <div style={{ position: "absolute", left: x, top: y, width: 20, height: 20, border: "1.5px solid #6B7280", borderRadius: 4, background: "#fff", boxSizing: "border-box" }} />
);
const T: React.FC<{ x: number; y: number; lines: string[]; f?: string; c?: string; lh?: number }> = ({ x, y, lines, f = `400 18px ${FONT}`, c = C.text2, lh = 27 }) => (
  <div style={{ position: "absolute", left: x, top: y - (lines.length * lh) / 2, font: f, color: c, lineHeight: `${lh}px`, whiteSpace: "nowrap" }}>{lines.map((l, i) => <div key={i}>{l}</div>)}</div>
);

export const IncomingTable: React.FC<{ rows?: Row[] }> = ({ rows = ROWS }) => {
  let y = 382;
  return (
    <>
      {/* header */}
      <Check x={COL.cb} y={325} />
      <T x={COL.name} y={337} lines={["Patient Name"]} f={`600 18px ${FONT}`} c={C.text} />
      <T x={COL.dob} y={337} lines={["DOB"]} f={`600 18px ${FONT}`} c={C.text} />
      <T x={COL.from} y={337} lines={["Referring", "Office"]} f={`600 18px ${FONT}`} c={C.text} />
      <T x={COL.to} y={337} lines={["Receiving", "Office"]} f={`600 18px ${FONT}`} c={C.text} />
      <T x={COL.status} y={337} lines={["Status"]} f={`600 18px ${FONT}`} c={C.text} />
      <T x={COL.rec} y={337} lines={["Received ↓"]} f={`600 18px ${FONT}`} c={C.text} />
      <T x={COL.upd} y={337} lines={["Last Update"]} f={`600 18px ${FONT}`} c={C.text} />
      {rows.map((r) => {
        const top = y, mid = y + r.h / 2; y += r.h;
        return (
          <React.Fragment key={r.ini}>
            <div style={{ position: "absolute", left: 390, top, width: 1492, height: r.h, background: r.hl ? C.rowHl : C.row, borderBottom: `1px solid ${C.rowLine}` }} />
            {r.hl && <div style={{ position: "absolute", left: 390, top, width: 4, height: r.h, background: "#8E65EB" }} />}
            <Check x={COL.cb} y={mid - 10} />
            <div style={{ position: "absolute", left: COL.name, top: mid - 25, width: 50, height: 50, borderRadius: 50, background: r.col, color: "#fff", font: `500 20px ${FONT}`, display: "flex", alignItems: "center", justifyContent: "center" }}>{r.ini}</div>
            {r.mail && <Icon n="mail" s={20} c="#4F6FD0" w={1.8} style={{ position: "absolute", left: 525, top: mid - 10 }} />}
            <T x={r.mail ? 555 : 525} y={mid} lines={r.name} f={`700 18px ${FONT}`} c={C.text} />
            {r.at && <div style={{ position: "absolute", left: 620, top: mid - 26, width: 34, height: 52, borderRadius: 17, background: "#7C4DEE", color: "#fff", font: `600 15px ${FONT}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", lineHeight: "18px" }}><span>@</span><span>{r.at}</span></div>}
            <T x={COL.dob} y={mid} lines={[r.dob]} />
            <div style={{ position: "absolute", left: COL.from, top: mid - (r.from.length * 27) / 2, font: `400 18px ${FONT}`, color: C.text2, lineHeight: "27px", whiteSpace: "nowrap" }}>
              {r.from.map((l, i) => <div key={i}>{i === 0 && <span style={{ display: "inline-block", width: 12, height: 12, borderRadius: 12, background: C.green, marginRight: 8, verticalAlign: "-1px" }} />}{l}</div>)}
            </div>
            <T x={COL.to} y={mid} lines={r.to} f={`400 17px ${FONT}`} c={C.muted} lh={28} />
            <div style={{ position: "absolute", left: COL.status, top: mid - 15, height: 30, padding: "0 12px", borderRadius: 15, background: r.status[1], color: r.status[2], font: `500 16px ${FONT}`, display: "flex", alignItems: "center" }}>{r.status[0]}</div>
            <T x={COL.rec} y={mid} lines={[r.rec]} c={C.muted} />
            <T x={COL.upd} y={mid} lines={[r.upd]} c={C.muted} />
            <div style={{ position: "absolute", left: COL.act, top: mid - 13, font: `500 18px ${FONT}`, color: C.link, whiteSpace: "nowrap" }}>View <span style={{ color: C.muted, margin: "0 6px" }}>•</span> Archive</div>
          </React.Fragment>
        );
      })}
    </>
  );
};

export const IncomingPage: React.FC = () => (
  <AppFrame active="Incoming" group="Referrals">
    <div style={{ position: "absolute", left: 350, top: 108, width: 1530, height: 860, background: C.card, borderRadius: 8 }} />
    {/* toolbar */}
    <div style={{ position: "absolute", left: 390, top: 179, width: 385, height: 48, border: `1px solid ${C.inputBorder}`, borderRadius: 6, display: "flex", alignItems: "center", gap: 12, paddingLeft: 16, boxSizing: "border-box", overflow: "hidden" }}>
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" style={{ flex: "none" }}><circle cx="11" cy="11" r="7" /><path d="M21 21l-4.6-4.6" /></svg><span style={{ font: `400 19px ${FONT}`, color: C.faint, whiteSpace: "nowrap" }}>Search patients, DOB, referring office, o</span>
    </div>
    <div style={{ position: "absolute", left: 796, top: 192, font: `500 18px ${FONT}`, color: C.text }}>Status:</div>
    <div style={{ position: "absolute", left: 865, top: 175, width: 297, height: 55, borderRadius: 8, background: "#F9F9F9", border: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 20px", boxSizing: "border-box", font: `400 20px ${FONT}`, color: C.text }}>All referrals<Icon n="chev" s={18} c={C.muted} /></div>
    <div style={{ position: "absolute", left: 1183, top: 192, font: `500 18px ${FONT}`, color: C.text }}>Received:</div>
    <div style={{ position: "absolute", left: 1275, top: 175, width: 223, height: 55, borderRadius: 8, background: "#F9F9F9", border: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 20px", boxSizing: "border-box", font: `400 20px ${FONT}`, color: C.text }}>All months<Icon n="chev" s={18} c={C.muted} /></div>
    <Check x={1518} y={193} />
    <div style={{ position: "absolute", left: 1549, top: 191, font: `400 18px ${FONT}`, color: C.text2 }}>Show archived</div>
    <div style={{ position: "absolute", left: 1692, top: 176, width: 150, height: 53, borderRadius: 6, background: C.purple, color: "#fff", font: `600 20px ${FONT}`, display: "flex", alignItems: "center", justifyContent: "center" }}>Add patient</div>
    <div style={{ position: "absolute", left: 390, top: 251, width: 12, height: 12, borderRadius: 12, background: C.green }} />
    <div style={{ position: "absolute", left: 410, top: 248, font: `400 15.5px ${FONT}`, color: C.muted }}>Connected Network Member</div>
    <IncomingTable />
    <ChatFab x={1841} y={783} />
  </AppFrame>
);
