/** Referrals > Incoming > a referral (case detail page), matched to the dashboard-3 recording (1920x912).
 * Content coordinates: y = 0 is HEAD px down the unscrolled page (see AppShell). */
import React from "react";
import { Img, staticFile } from "remotion";
import { AppFrame, C, ChatFab, FONT, HEAD } from "./AppShell";
import { LeftSections, RightSections } from "./CaseSections";

export type CaseData = {
  clinic: string; doctor: string; patient: string; dob: string; age: string; pronoun: string; gender: string; phone: string; email: string;
  partner: string;
};
export const RECORDED_CASE: CaseData = {
  clinic: "Gentle dental clinic", doctor: "Dr Lee Davis DDS, DDS", patient: "Carter Wiley", dob: "11/21/2001", age: "24", pronoun: "He/Him",
  gender: "Male", phone: "789-568-4265", email: "umairasma31@gmail.com", partner: "Apex Dental",
};

const y0 = (y: number) => y - HEAD; // unscrolled page y -> content y

const ABtn: React.FC<{ x: number; w: number; t: string; icon: React.ReactNode; red?: boolean }> = ({ x, w, t, icon, red }) => (
  <div style={{ position: "absolute", left: x, top: y0(250), width: w, height: 57, borderRadius: 4, boxSizing: "border-box", border: `1.5px solid ${red ? "#DC2626" : C.purple}`, background: "#fff", color: red ? "#DC2626" : C.purpleText, font: `500 20px ${FONT}`, display: "flex", alignItems: "center", justifyContent: "center", gap: 10, whiteSpace: "nowrap" }}>{icon}{t}</div>
);
const ico = (d: string, c: string) => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d={d} /></svg>;
const PEN = "M17 3a2.8 2.8 0 0 1 4 4L7.5 20.5 2 22l1.5-5.5z", DL = "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3",
  BIN = "M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M10 11v6M14 11v6";

const Txt: React.FC<{ x: number; y: number; f: string; c?: string; children: React.ReactNode; lh?: number; w?: number }> = ({ x, y, f, c = C.text, children, lh, w }) => (
  <div style={{ position: "absolute", left: x, top: y0(y), font: f, color: c, whiteSpace: w ? "normal" : "nowrap", width: w, lineHeight: lh ? `${lh}px` : undefined }}>{children}</div>
);

type Msg = { av: "A" | "logo"; name: string[]; role: string; time: string; body: React.ReactNode; quote?: [string, string] };
const MENTION = "#1D4E7E";
export const RECORDED_MSGS: Msg[] = [
  { av: "A", name: ["Tom Colpack, DDS (Apex Dental)"], role: "Owner Dentist", time: "Nov 7, 9:54 AM", body: <><span style={{ color: MENTION }}>@Barbara Smith</span> I updated the latest xray let me know if you need anything</> },
  { av: "logo", name: ["Dr Lee Davis DDS, DDS (Gentle dental", "clinic)"], role: "Associate Dentist", time: "Nov 7, 9:55 AM", quote: ["Tom Colpack, DDS (Apex Dental)", "@Barbara Smith I updated the latest xray let me know"], body: <><span style={{ color: MENTION }}>@Tom Colpack, DDS</span> Got the updated x-rays thank you</> },
];

/** The Office Communication side panel (x 1371..1870). `top` is the unscrolled page y of the card. */
export const OfficeComm: React.FC<{ top?: number; partner: string; msgs?: Msg[]; listScroll?: number; height?: number }> = ({ top = 418, partner, msgs = RECORDED_MSGS, listScroll = 17, height = 640 }) => (
  <div style={{ position: "absolute", left: 1371, top: y0(top), width: 500, height, background: "#fff", border: `1px solid ${C.border}`, borderRadius: 8, boxSizing: "border-box", overflow: "hidden" }}>
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={C.purple} strokeWidth="2" strokeLinejoin="round" style={{ position: "absolute", left: 21, top: 23 }}><path d="M4 4h16v12H8l-4 4z" /></svg>
    <div style={{ position: "absolute", left: 50, top: 20, font: `700 19.9px ${FONT}`, color: C.text }}>Office Communication</div>
    <div style={{ position: "absolute", right: 20, top: 19, font: `600 14.9px ${FONT}`, color: C.purpleText }}>Expand</div>
    <div style={{ position: "absolute", left: 20, top: 53, font: `400 15px ${FONT}`, color: C.muted }}>Messaging with {partner}</div>
    <div style={{ position: "absolute", left: 0, top: 91, width: 500, height: 1, background: C.border }} />
    <div style={{ position: "absolute", left: 0, top: 92, width: 482, height: 378, overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 0, top: -listScroll, width: 482 }}>
        <div style={{ padding: "0 0 0 90px", font: `400 18.7px ${FONT}`, color: "#1F2937", lineHeight: "29px", width: 380 }}>from may 2022 do you have the updated x-rays</div>
        {msgs.map((m, i) => (
          <div key={i} style={{ position: "relative", padding: "20px 20px 0 90px" }}>
            {m.av === "A"
              ? <div style={{ position: "absolute", left: 20, top: 23, width: 46, height: 49, borderRadius: 8, background: "#2F7A1F", color: "#fff", font: `400 24px ${FONT}`, display: "flex", alignItems: "center", justifyContent: "center" }}>A</div>
              : <Img src={staticFile("app/dcare-avatar.png")} style={{ position: "absolute", left: 20, top: 20, width: 48 }} />}
            <div style={{ font: `700 17.55px ${FONT}`, color: C.text, lineHeight: "27px" }}>{m.name.map((n, k) => <div key={k}>{n}</div>)}</div>
            <div style={{ font: `400 15.3px ${FONT}`, color: C.muted, marginTop: 9, lineHeight: "22px" }}>{m.role}&nbsp;&nbsp;{m.time}</div>
            {m.quote && <div style={{ margin: "8px 0 4px", padding: "4px 12px", borderLeft: "2px solid #C4B5FD", background: "#F9FAFB", borderRadius: 4, font: `400 15px ${FONT}`, color: C.muted, lineHeight: "21px", whiteSpace: "nowrap", overflow: "hidden" }}><div style={{ font: `600 15.5px ${FONT}`, color: "#374151" }}>{m.quote[0]}</div>{m.quote[1]}</div>}
            <div style={{ font: `400 18.7px ${FONT}`, color: "#1F2937", lineHeight: "29px", marginTop: 2 }}>{m.body}</div>
          </div>
        ))}
      </div>
    </div>
    {/* list scrollbar */}
    <svg width="12" height="10" viewBox="0 0 12 10" style={{ position: "absolute", left: 483, top: 99 }}><path d="M1 9h10L6 1z" fill="#9CA3AF" /></svg>
    <div style={{ position: "absolute", left: 485, top: 217, width: 9, height: 245, borderRadius: 5, background: "#8A8A8A" }} />
    <div style={{ position: "absolute", left: 0, top: 470, width: 500, height: 1, background: C.border }} />
    <div style={{ position: "absolute", left: 16, top: 479, width: 468, height: 120, border: `1px solid ${C.border}`, borderRadius: 8, overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 15, top: 13, font: `400 18px ${FONT}`, color: C.faint }}>Message {partner}</div>
      <div style={{ position: "absolute", left: 0, top: 62, width: 468, height: 58, background: "#FAFAFA", borderTop: `1px solid ${C.border}` }} />
      <div style={{ position: "absolute", left: 20, top: 78, font: `400 20px ${FONT}`, color: "#4B5563" }}>@</div>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4B5563" strokeWidth="2" strokeLinecap="round" style={{ position: "absolute", left: 62, top: 81 }}><circle cx="12" cy="12" r="10" /><path d="M8 14s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01" /></svg>
    </div>
    <div style={{ position: "absolute", right: 16, top: 603, font: `400 15px ${FONT}`, color: C.faint }}>Enter to send · Shift+Enter for new line</div>
  </div>
);

export const CaseDetailPage: React.FC<{ data?: CaseData; scroll?: number; tab?: "Details" | "Messages"; chrome?: boolean }> = ({ data = RECORDED_CASE, scroll = 0, tab = "Details", chrome = true }) => {
  const rows: [string[], string, number][] = [
    [["Patient Name:"], data.patient, 478], [["DOB:"], data.dob, 521], [["Age:"], data.age, 565], [["Preferred", "pronoun:"], data.pronoun, 608],
    [["Gender:"], data.gender, 684], [["Patient's Phone:"], data.phone, 727], [["Patient's Email:"], data.email, 770],
  ];
  return (
    <AppFrame active="Incoming" group="Referrals" title="Incoming Referrals" clinic={data.clinic} scroll={scroll}
      fixed={chrome && <>
        <ChatFab x={1800} y={806} />
        {/* browser page scrollbar */}
        <div style={{ position: "absolute", left: 1900, top: 0, width: 20, height: 912, background: "#fff" }} />
        <svg width="12" height="10" viewBox="0 0 12 10" style={{ position: "absolute", left: 1904, top: 4 }}><path d="M1 9h10L6 1z" fill="#6B6B6B" /></svg>
        <svg width="12" height="10" viewBox="0 0 12 10" style={{ position: "absolute", left: 1904, top: 897 }}><path d="M1 1h10L6 9z" fill="#6B6B6B" /></svg>
        <div style={{ position: "absolute", left: 1904, top: 25 + scroll * 0.06, width: 11, height: 186, borderRadius: 6, background: "#A3A3A3" }} />
      </>}>
      {/* back + actions */}
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ position: "absolute", left: 350, top: y0(267) }}><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
      <Txt x={380} y={265} f={`400 20px ${FONT}`} c="#4B5563">Back to Referrals</Txt>
      <ABtn x={890} w={188} t="Edit Referral" icon={ico(PEN, C.purpleText)} />
      <ABtn x={1093} w={216} t="Download PDF" icon={ico(DL, C.purpleText)} />
      <ABtn x={1324} w={319} t="Download PDF for patient" icon={ico(DL, C.purpleText)} />
      <ABtn x={1658} w={213} t="Delete Referral" icon={ico(BIN, "#DC2626")} red />
      {/* tabs */}
      <Txt x={370} y={342} f={`500 20px ${FONT}`} c={tab === "Details" ? C.purpleText : "#374151"}>Details</Txt>
      <Txt x={475} y={343} f={`500 20px ${FONT}`} c={tab === "Messages" ? C.purpleText : "#374151"}>Messages</Txt>
      <div style={{ position: "absolute", left: 350, top: y0(384), width: 1521, height: 1, background: C.border }} />
      <div style={{ position: "absolute", left: tab === "Details" ? 350 : 455, top: y0(382), width: tab === "Details" ? 105 : 130, height: 3, background: C.purple }} />
      {/* details card */}
      <div style={{ position: "absolute", left: 350, top: y0(418), width: 981, height: 3400, background: "#fff", border: `1px solid ${C.border}`, borderRadius: 8, boxSizing: "border-box" }} />
      <Txt x={391} y={466} f={`400 17.6px ${FONT}`} c={C.muted}>Referred to</Txt>
      <Txt x={391} y={488} f={`400 24.4px ${FONT}`} c="#374151" lh={38}><div>{data.clinic}</div><div>{data.doctor}</div></Txt>
      {rows.map(([l, v, y]) => (
        <React.Fragment key={l[0]}>
          <Txt x={856} y={y - 16} f={`600 20px ${FONT}`} lh={33}>{l.map((t) => <div key={t}>{t}</div>)}</Txt>
          <Txt x={1051} y={y - 16} f={`400 20px ${FONT}`} c="#1F2937" lh={33}>{v}</Txt>
        </React.Fragment>
      ))}
      <div style={{ position: "absolute", left: 391, top: y0(820), width: 899, height: 1, background: C.border }} />
      <Txt x={391} y={857} f={`600 20.1px ${FONT}`}>Referral Status</Txt>
      <Txt x={391} y={895} f={`400 17.4px ${FONT}`} c={C.muted}>Status and requested treatment for this referral.</Txt>
      <OfficeComm partner={data.partner} />
      <LeftSections />
      <RightSections />
    </AppFrame>
  );
};
