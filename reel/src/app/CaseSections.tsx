/** The case detail page below the fold, matched to the dashboard-3 recording stitched into one tall page.
 * All y values are unscrolled page y (the same numbers you read off the tall reference); P() converts. */
import React from "react";
import { Img, staticFile } from "remotion";
import { C, FONT, HEAD } from "./AppShell";

const P = (y: number) => y - HEAD;
const PURPLE_T = "#6D28D9";

/** Text centred vertically on page y `cy`. */
export const Tc: React.FC<{ x: number; cy: number; s: number; w?: number; c?: string; lh?: number; right?: boolean; children: React.ReactNode; style?: React.CSSProperties }> = ({ x, cy, s, w = 400, c = C.text, lh, right, children, style }) => {
  const L = lh ?? Math.round(s * 1.4);
  return <div style={{ position: "absolute", [right ? "right" : "left"]: right ? 1920 - x : x, top: P(cy) - L / 2, font: `${w} ${s}px ${FONT}`, color: c, lineHeight: `${L}px`, whiteSpace: "nowrap", ...style }}>{children}</div>;
};
const Box: React.FC<{ x: number; y: number; w: number; h: number; bg?: string; b?: string; r?: number; style?: React.CSSProperties; children?: React.ReactNode }> = ({ x, y, w, h, bg = "#fff", b = C.border, r = 8, style, children }) => (
  <div style={{ position: "absolute", left: x, top: P(y), width: w, height: h, background: bg, border: b === "none" ? "none" : `1px solid ${b}`, borderRadius: r, boxSizing: "border-box", ...style }}>{children}</div>
);
const HLine: React.FC<{ x: number; y: number; w: number }> = ({ x, y, w }) => <div style={{ position: "absolute", left: x, top: P(y), width: w, height: 1, background: C.border }} />;
const svgI = (d: string, c: string, s = 20, sw = 2) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"><path d={d} /></svg>;
export const D = {
  pen: "M17 3a2.8 2.8 0 0 1 4 4L7.5 20.5 2 22l1.5-5.5z", dl: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3",
  bin: "M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M10 11v6M14 11v6",
  eye: "M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12zM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z",
  cal: "M3 6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2zM16 2v4M8 2v4M3 10h18",
  doc: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6M16 13H8M16 17H8M10 9H8",
  clip: "M9 3h6v3H9zM8 4.5H6a2 2 0 0 0-2 2V20a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6.5a2 2 0 0 0-2-2h-2M8 11h8M8 15h8M8 19h5",
  shield: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z", reply: "M9 17l-5-5 5-5M4 12h11a5 5 0 0 1 5 5v2",
  signed: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6M9 15l2 2 4-4",
};
/** Outline button (purple by default) with optional icon, page coords. */
export const OBtn: React.FC<{ x: number; y: number; w: number; h: number; t: string; icon?: string; s?: number; c?: string; b?: string; bg?: string; wgt?: number }> = ({ x, y, w, h, t, icon, s = 18, c = C.purpleText, b = C.purple, bg = "#fff", wgt = 500 }) => (
  <div style={{ position: "absolute", left: x, top: P(y), width: w, height: h, borderRadius: 6, border: `1.5px solid ${b}`, background: bg, boxSizing: "border-box", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, font: `${wgt} ${s}px ${FONT}`, color: c, whiteSpace: "nowrap" }}>{icon && svgI(icon, c, s + 1)}{t}</div>
);
const Pill: React.FC<{ x: number; y: number; h: number; bg: string; c: string; t: string; s?: number; w?: number; px?: number }> = ({ x, y, h, bg, c, t, s = 16, w = 500, px = 15 }) => (
  <div style={{ position: "absolute", left: x, top: P(y), height: h, borderRadius: h / 2, background: bg, color: c, font: `${w} ${s}px ${FONT}`, padding: `0 ${px}px`, display: "flex", alignItems: "center", whiteSpace: "nowrap" }}>{t}</div>
);
const IconAt: React.FC<{ x: number; cy: number; d: string; c: string; s?: number; sw?: number }> = ({ x, cy, d, c, s = 20, sw = 2 }) => <div style={{ position: "absolute", left: x, top: P(cy) - s / 2, width: s, height: s }}>{svgI(d, c, s, sw)}</div>;

export const LeftSections: React.FC = () => (
  <>
    {/* Referral Status */}
    <Tc x={391} cy={1012 - 58} s={14.5} w={600} c="#4B5563" style={{ letterSpacing: ".04em" }}>STATUS</Tc>
    <Pill x={465} y={937} h={35} bg="#FEF9C3" c="#713F12" t="Symptomatic" s={17.5} px={15} />
    <Tc x={391} cy={1006} s={17.5} w={600} c="#374151">Chief Complaint</Tc>
    <Tc x={391} cy={1043} s={20} c={C.text}>Patient has pain in #32</Tc>
    <Tc x={391} cy={1095} s={18.5} w={600} c="#4B5563">Please consult and treat</Tc>
    <Box x={391} y={1126} w={900} h={105} r={10} />
    <div style={{ position: "absolute", left: 407, top: P(1159) - 13, width: 26, height: 26, borderRadius: 26, background: "#EDE9FE", color: PURPLE_T, font: `600 15px ${FONT}`, display: "flex", alignItems: "center", justifyContent: "center" }}>1</div>
    <Tc x={447} cy={1159} s={20.1} w={500}>Crown Recementation</Tc>
    <Tc x={447} cy={1203} s={17.6} c="#4B5563">Diagnosis: #32</Tc>
    <IconAt x={1102} cy={1160} d={D.pen} c={C.purpleText} s={19} />
    <Tc x={1127} cy={1160} s={17.8} w={500} c={C.purpleText}>Edit</Tc>
    <IconAt x={1187} cy={1160} d={D.bin} c="#BE123C" s={19} />
    <Tc x={1210} cy={1160} s={18.5} w={500} c="#BE123C">Delete</Tc>
    <HLine x={391} y={1263} w={900} />

    {/* Attachments */}
    <Tc x={391} cy={1313} s={20} w={600}>Attachments</Tc>
    <Tc x={391} cy={1349} s={17.5} c={C.muted}>Imaging, documents, and signed notes shared with both offices.</Tc>
    <Box x={391} y={1378} w={443} h={642} bg="#F9F9FA" r={12} />
    <Tc x={410} cy={1421} s={19} w={600}>X-rays <span style={{ fontWeight: 400, color: C.muted, marginLeft: 4 }}>(2)</span></Tc>
    <OBtn x={691} y={1399} w={124} h={46} t="Edit X-rays" s={17.6} />
    {[{ y: 1466, img: "xray-1.png", n: "New Pano 2026 (1).jpg", d: "11/06/2026" }, { y: 1741, img: "xray-2.png", n: "pristine (14) (1).png", d: "05/22/2022" }].map((x) => (
      <React.Fragment key={x.n}>
        <Box x={410} y={x.y} w={265} h={259} />
        <Img src={staticFile(`app/${x.img}`)} style={{ position: "absolute", left: 427, top: P(x.y + 18), width: 228, borderRadius: 6 }} />
        <Tc x={426} cy={x.y + 147} s={17.55} c="#1F2937">{x.n}</Tc>
        <Tc x={426} cy={x.y + 186} s={14.7} c={C.muted}>{x.d}</Tc>
        <Tc x={426} cy={x.y + 226} s={17.4} w={500} c={C.purpleText}>Download</Tc>
      </React.Fragment>
    ))}
    <Box x={848} y={1378} w={443} h={642} bg="#F9F9FA" r={12} />
    <Tc x={867} cy={1421} s={19} w={600}>Documents</Tc>
    <OBtn x={1108} y={1399} w={164} h={46} t="Edit Documents" s={18} />
    <Tc x={867} cy={1479} s={17.5} c={C.muted}>No documents attached</Tc>

    {/* Signed notes */}
    <Box x={391} y={2037} w={900} h={183} bg="#F9F9FA" r={12} />
    <IconAt x={410} cy={2070} d={D.signed} c="#15803D" s={20} />
    <Tc x={440} cy={2071} s={18.6} w={500}>Signed notes</Tc>
    <Tc x={440} cy={2097} s={15.6} c={C.muted}>Visible to both offices.</Tc>
    <Box x={410} y={2119} w={863} h={81} b="#8B5CF6" r={8} style={{ borderWidth: 1.5, boxShadow: "0 0 0 3px rgba(139,92,246,.12)" }} />
    <Tc x={426} cy={2148} s={18.6}>Consultation Note</Tc>
    <Tc x={426} cy={2174} s={15.6} c={C.muted}>Signed 11/07/2026 · by Barbara</Tc>
    <OBtn x={908} y={2134} w={98} h={46} t="View" icon={D.eye} s={18.3} />
    <OBtn x={1016} y={2134} w={89} h={46} t="Edit" icon={D.pen} s={18.3} />
    <OBtn x={1115} y={2134} w={141} h={46} t="Download" icon={D.dl} s={18.3} />
    <HLine x={391} y={2252} w={900} />

    {/* Insurance */}
    <Tc x={391} cy={2302} s={20.5} w={600}>Insurance cards (1)</Tc>
    <Tc x={391} cy={2338} s={17.2} c={C.muted}>Primary / secondary cards for this patient.</Tc>
    <OBtn x={949} y={2286} w={124} h={46} t="+ Add card" s={18} />
    <OBtn x={1083} y={2286} w={207} h={46} t="Request from patient" s={18} />
    <Box x={391} y={2367} w={900} h={458} bg="#F9F9FA" r={12} />
    <Pill x={412} y={2390} h={27} bg="#EDE9FE" c={PURPLE_T} t="PRIMARY" s={15} w={600} px={10} />
    <Tc x={511} cy={2404} s={15.6} c={C.muted}>Submitted by Staff</Tc>
    <IconAt x={1127} cy={2404} d={D.pen} c={C.purpleText} s={18} />
    <Tc x={1150} cy={2404} s={18} c={C.purpleText}>Edit</Tc>
    <IconAt x={1193} cy={2404} d={D.bin} c="#BE123C" s={18} />
    <Tc x={1216} cy={2404} s={18} c="#BE123C">Delete</Tc>
    <Img src={staticFile("app/ins-front.png")} style={{ position: "absolute", left: 412, top: P(2435), width: 360 }} />
    <Img src={staticFile("app/ins-back.png")} style={{ position: "absolute", left: 787, top: P(2435), width: 360 }} />
    {[[412, "POLICY", "785694"], [799, "GROUP", "2568715"]].map(([x, l, v]) => (
      <React.Fragment key={l as string}>
        <Tc x={x as number} cy={2704} s={14.8} c={C.muted} style={{ letterSpacing: ".03em" }}>{l}</Tc>
        <Tc x={x as number} cy={2729} s={17.8}>{v}</Tc>
      </React.Fragment>
    ))}
    <Tc x={412} cy={2763} s={14.8} c={C.muted} style={{ letterSpacing: ".03em" }}>SUBSCRIBER</Tc>
    <Tc x={412} cy={2789} s={17.8}>Same as patient</Tc>
    <Tc x={799} cy={2763} s={14.8} c={C.muted} style={{ letterSpacing: ".03em" }}>SUBSCRIBER DOB</Tc>
    <Tc x={799} cy={2789} s={17.8}>—</Tc>
    <HLine x={391} y={2857} w={900} />

    {/* Activity log */}
    <Tc x={391} cy={2907} s={20.5} w={600}>Activity log</Tc>
    <div style={{ position: "absolute", left: 391, top: P(2935), width: 900, height: 330, overflow: "hidden" }}>
      {ACTIVITY.map((a, i) => (
        <div key={i} style={{ position: "relative", padding: "6px 0 7px 27px", font: `400 17.6px ${FONT}`, color: "#374151", lineHeight: "30px" }}>
          <div style={{ position: "absolute", left: 2, top: 15, width: 10, height: 10, borderRadius: 10, background: "#6D3BE8" }} />
          <span style={{ fontWeight: 600 }}>{a[0]}</span> <span style={{ color: C.muted }}>({a[1]})</span> {a[2]}
          {a[3] && <div style={{ color: C.muted }}>{a[3]}</div>}
          {a[4] && <div style={{ color: C.muted }}>{a[4]}</div>}
        </div>
      ))}
    </div>
    <svg width="12" height="10" viewBox="0 0 12 10" style={{ position: "absolute", left: 1275, top: P(2948) }}><path d="M1 9h10L6 1z" fill="#9CA3AF" /></svg>
    <div style={{ position: "absolute", left: 1276, top: P(2966), width: 9, height: 140, borderRadius: 5, background: "#8A8A8A" }} />
  </>
);
export const ACTIVITY: [string, string, string, string?, string?][] = [
  ["Barbara", "11/7/2026 10:10 am", "“General” was added to the document section"],
  ["Barbara", "11/7/2026 10:09 am", "consultation completed Referral", "Administrative Note: Consultation completed on 11/07/2026.", "Patient has scheduled surgery on 11/07/2026."],
  ["Amanda", "11/7/2026 10:04 am", "scheduled Referral"],
  ["Amanda", "11/7/2026 10:02 am", "updated: x-rays added"],
  ["Tanya", "11/7/2026 9:55 am", "scheduled Referral", "Administrative Note: Spoke with patient and scheduled on 12/07/2026"],
  ["Tanya", "11/7/2026 9:45 am", "received Referral"],
  ["Barbara", "11/7/2026 9:41 am", "new referral created for St. Andrew’s Family Dental"],
];

const CHIPS: [string, number, number, string, string][] = [
  ["Left a Voicemail", 1418, 1270, "#D9F5EA", "#0F6B5C"], ["Voicemail Not Set Up", 1571, 1270, "#D9F5EA", "#0F6B5C"],
  ["Unable to Contact", 1418, 1310, "#FDE6D8", "#9A3412"], ["Declined Appointment", 1586, 1310, "#E5E7EB", "#374151"],
  ["Referred Out", 1418, 1350, "#EDE9FE", PURPLE_T], ["Cancelled", 1550, 1350, "#FEE2E2", "#B91C1C"],
  ["Spoke with Patient / Scheduled", 1418, 1391, "#FEF6C3", "#713F12"], ["Other", 1682, 1391, "#F3F4F6", "#374151"],
];

export const RightSections: React.FC = () => (
  <>
    {/* Status & Schedule */}
    <Box x={1371} y={1081} w={500} h={610} />
    <IconAt x={1392} cy={1122} d={D.clip} c={C.purple} s={24} />
    <Tc x={1437} cy={1122} s={22} w={700}>Status &amp; Schedule</Tc>
    <div style={{ position: "absolute", left: 1402, top: P(1146), width: 440, font: `400 16px ${FONT}`, color: C.muted, lineHeight: "21.5px" }}>Update referral status, call the office, or schedule an appointment. <span style={{ color: C.purpleText, fontWeight: 500 }}>Email notification settings</span></div>
    <Box x={1402} y={1206} w={438} h={465} bg="#F9FAFB" r={8} />
    <Tc x={1418} cy={1234} s={14.9} c="#374151">Log a contact attempt</Tc>
    {CHIPS.map(([t, x, cy, bg, c]) => <Pill key={t} x={x} y={cy - 16} h={32} bg={bg} c={c} t={t} s={15.3} px={15} />)}
    <Box x={1418} y={1425} w={246} h={50} r={6} b={C.inputBorder} style={{ overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 15, top: 12, font: `400 20px ${FONT}`, color: C.text, whiteSpace: "nowrap", width: 180, overflow: "hidden" }}>Consultation Completed</div>
      <svg width="12" height="8" viewBox="0 0 12 8" style={{ position: "absolute", right: 16, top: 21 }}><path d="M0 0h12L6 8z" fill="#111" /></svg>
    </Box>
    <OBtn x={1674} y={1428} w={149} h={46} t="Update Status" s={19} />
    <div style={{ position: "absolute", left: 1418, top: P(1505) - 8, width: 16, height: 16, border: "1.5px solid #6B7280", borderRadius: 3, boxSizing: "border-box", background: "#fff" }} />
    <Tc x={1444} cy={1505} s={17.3} c="#1F2937">Hide Note Creator</Tc>
    <div style={{ position: "absolute", left: 1444, top: P(1521), width: 395, font: `400 15.5px ${FONT}`, color: C.muted, lineHeight: "21.5px" }}>Don't prompt for a note when changing to Completed, Cancelled, or Consultation Completed. You can still use Create a Note.</div>
    <OBtn x={1418} y={1603} w={139} h={49} t="Schedule" icon={D.cal} s={18.5} c="#1F2937" b={C.border} wgt={400} />
    <OBtn x={1568} y={1603} w={177} h={49} t="Create a Note" icon={D.doc} s={18.5} c="#1F2937" b={C.border} wgt={400} />

    {/* Administrative Notes */}
    <Box x={1371} y={1715} w={500} h={1163} />
    <IconAt x={1392} cy={1758} d={D.doc} c={C.purple} s={24} />
    <Tc x={1437} cy={1758} s={22.7} w={500}>Administrative Notes</Tc>
    <div style={{ position: "absolute", left: 1672, top: P(1758) - 14, width: 29, height: 28, borderRadius: 14, background: "#EDE9FE", color: PURPLE_T, font: `500 15px ${FONT}`, display: "flex", alignItems: "center", justifyContent: "center" }}>9</div>
    <div style={{ position: "absolute", left: 1750, top: P(1738), width: 40, height: 42, borderRadius: 6, background: "#F1F2F4", display: "flex", alignItems: "center", justifyContent: "center" }}>{svgI(D.doc, "#374151", 20)}</div>
    <div style={{ position: "absolute", left: 1800, top: P(1738), width: 40, height: 42, borderRadius: 6, background: C.purple, display: "flex", alignItems: "center", justifyContent: "center" }}>{svgI(D.doc, "#fff", 20)}</div>
    <div style={{ position: "absolute", left: 1402, top: P(1781), width: 345, font: `400 16px ${FONT}`, color: C.muted, lineHeight: "21.5px" }}>Company-private notes. Not shared with other parties.</div>
    <Pill x={1402} y={1842} h={26} bg={C.purple} c="#fff" t="3 unread @mentions" s={15.5} w={600} px={10} />
    <Tc x={1583} cy={1854} s={15.1} w={500} c={C.purpleText}>Mark all as read</Tc>
    <Box x={1402} y={1890} w={438} h={368} r={10} />
    <Tc x={1423} cy={1931} s={18.5}>Journey</Tc>
    <Tc x={1423} cy={1955} s={16} c={C.muted}>2 steps · 11/07/2026</Tc>
    <OBtn x={1587} y={1912} w={232} h={59} t="Build journey document" icon={D.doc} s={16} c="#1E3A8A" b="#1E3A8A" wgt={600} />
    <div style={{ position: "absolute", left: 1429, top: P(2008), width: 2, height: 86, background: "#D1D5DB" }} />
    <div style={{ position: "absolute", left: 1423, top: P(2001) - 7, width: 15, height: 15, borderRadius: 15, background: "#16A34A" }} />
    <Tc x={1453} cy={2001} s={18} w={600}>Spoke with Patient / Scheduled</Tc>
    <Tc x={1819} cy={2001} s={15.5} c={C.muted} right>11/07/2026</Tc>
    <div style={{ position: "absolute", left: 1453, top: P(2016), width: 360, font: `400 17.5px ${FONT}`, color: "#374151", lineHeight: "27px" }}>Spoke with patient and scheduled on 12/07/2026</div>
    <div style={{ position: "absolute", left: 1423, top: P(2106) - 7, width: 15, height: 15, borderRadius: 15, background: "#6D28D9" }} />
    <Tc x={1453} cy={2106} s={18} w={600}>Consultation Completed</Tc>
    <Tc x={1819} cy={2106} s={15.5} c={C.muted} right>11/07/2026</Tc>
    <div style={{ position: "absolute", left: 1453, top: P(2123), width: 360, font: `400 17.5px ${FONT}`, color: "#374151", lineHeight: "27px" }}>Consultation completed on 11/07/2026. Patient has scheduled surgery on 11/07/2026.</div>
    <Pill x={1453} y={2210} h={26} bg="#EDE9FE" c={PURPLE_T} t="Surgery 11/07/2026" s={15.5} w={600} px={10} />
    <Tc x={1402} cy={2298} s={17.6} c={C.purpleText}>Show all 9 notes</Tc>
    {/* note 1 */}
    <div style={{ position: "absolute", left: 1402, top: P(2360) - 20, width: 40, height: 40, borderRadius: 40, background: "#4F4AA8", color: "#fff", font: `500 15px ${FONT}`, display: "flex", alignItems: "center", justifyContent: "center" }}>AM</div>
    <Tc x={1457} cy={2352} s={17.7}>Amanda</Tc>
    <Tc x={1457} cy={2377} s={14.9} c={C.muted}>Nov 7, 10:14 AM</Tc>
    <IconAt x={1768} cy={2380} d={D.reply} c="#9CA3AF" s={16} />
    <IconAt x={1795} cy={2380} d={D.pen} c="#9CA3AF" s={16} />
    <div style={{ position: "absolute", left: 1457, top: P(2393), width: 383, height: 55, background: "#F3F4F6", borderLeft: "2px solid #C4B5FD", borderRadius: 3, boxSizing: "border-box", padding: "3px 11px", overflow: "hidden" }}>
      <div style={{ font: `600 14.9px ${FONT}`, color: "#374151", lineHeight: "23px" }}>Barbara</div>
      <div style={{ font: `400 14.9px ${FONT}`, color: C.muted, lineHeight: "22px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>Consultation completed on 11/07/2026. Patient has scheduled surgery</div>
    </div>
    <div style={{ position: "absolute", left: 1457, top: P(2451), width: 400, font: `400 18.5px ${FONT}`, color: "#1F2937", lineHeight: "30.7px" }}><span style={{ color: C.purpleText }}>@Barbara</span> Tooth extraction completed successfully today. Could you please schedule a routine follow-up call with the patient in two weeks (around November 21) to check on healing and recovery?</div>
    <HLine x={1402} y={2618} w={438} />
    {/* note 2 */}
    <div style={{ position: "absolute", left: 1402, top: P(2655) - 20, width: 40, height: 40, borderRadius: 40, background: "#D9A021", color: "#fff", font: `500 15px ${FONT}`, display: "flex", alignItems: "center", justifyContent: "center" }}>BS</div>
    <Tc x={1457} cy={2647} s={17.7}>Barbara</Tc>
    <Tc x={1457} cy={2671} s={14.9} c={C.muted}>Nov 7, 10:09 AM</Tc>
    <IconAt x={1795} cy={2672} d={D.reply} c="#9CA3AF" s={16} />
    <Tc x={1457} cy={2701} s={18} c="#374151">Status changed to <b style={{ fontWeight: 600 }}>{"“Consultation Completed”"}</b></Tc>
    <Tc x={1457} cy={2734} s={18} w={500} c={C.text}>Consultation completed on 11/07/2026</Tc>
    <Pill x={1457} y={2752} h={27} bg="#EDE9FE" c={PURPLE_T} t="Surgery 11/07/2026" s={15.5} w={600} px={10} />
    <div style={{ position: "absolute", left: 1457, top: P(2781), width: 383, font: `400 18px ${FONT}`, color: "#1F2937", lineHeight: "31.5px", overflow: "hidden", height: 64 }}>Consultation completed on 11/07/2026.<br />Patient has scheduled surgery on 11/07/2026.</div>
    {/* HIPAA footer */}
    <Box x={1371} y={2902} w={500} h={82} bg="#FAFAFA" />
    <Tc x={1402} cy={2929} s={14.8} c={C.muted}>All communications are HIPAA compliant and encrypted</Tc>
    <IconAt x={1402} cy={2956} d={D.shield} c={C.muted} s={15} />
    <Tc x={1422} cy={2956} s={14.8} c={C.muted}>Secure &nbsp;&nbsp; Last updated: 11/07/2026</Tc>
  </>
);

/** Messages tab: referral snapshot on the left, the wide Office Communication thread on the right. */
export const MessagesTab: React.FC<{ patient: string; partner: string; clinic: string }> = ({ patient, partner, clinic }) => {
  const MENTION = "#1D4E7E";
  const msgs: { av: "A" | "logo"; name: string; role: string; time: string; cy: number; body: React.ReactNode; quote?: [string, string] }[] = [
    { av: "logo", name: "Tanya (St. Andrew’s Family Dental)", role: "Front Desk Coordinator", time: "Nov 7, 9:52 AM", cy: 589, body: <><span style={{ color: MENTION }}>@Barbara</span> Seems like the x-rays are from May 2022, do you have the updated x-rays?</> },
    { av: "A", name: "Barbara (Gentle Dental)", role: "Front Desk Coordinator", time: "Nov 7, 9:54 AM", cy: 661, body: <><span style={{ color: MENTION }}>@Tanya</span> I updated the latest xray let me know if you need anything</> },
    { av: "logo", name: "Tanya (St. Andrew’s Family Dental)", role: "Front Desk Coordinator", time: "Nov 7, 9:55 AM", cy: 734, quote: ["Barbara (Gentle Dental)", "@Tanya I updated the latest x-ray, let me know if you need anything"], body: <><span style={{ color: MENTION }}>@Barbara</span> Got the updated x-ray thank you</> },
  ];
  return (
    <>
      <Box x={350} y={418} w={325} h={600} />
      <Tc x={371} cy={455} s={17.4} w={600}>Referral snapshot</Tc>
      <Tc x={371} cy={494} s={14.9} c={C.muted}>Patient</Tc>
      <Tc x={371} cy={525} s={17.8} c="#1F2937">{patient}</Tc>
      <Pill x={371} y={558} h={29} bg="#ECFDF3" c="#15803D" t="Consultation Completed" s={15.1} px={10} />
      {[["From", partner, 617], ["To", clinic, 655], ["Type", "Symptomatic", 693]].map(([l, v, cy]) => (
        <React.Fragment key={l as string}>
          <Tc x={371} cy={cy as number} s={17.5} c={C.muted}>{l}</Tc>
          <Tc x={654} cy={cy as number} s={17.5} c="#374151" right>{v}</Tc>
        </React.Fragment>
      ))}
      <Tc x={371} cy={741} s={18} w={500} c={C.purpleText}>Open full details →</Tc>

      <Box x={716} y={418} w={1155} h={700} />
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={C.purple} strokeWidth="2" strokeLinejoin="round" style={{ position: "absolute", left: 736, top: P(451) - 11 }}><path d="M4 4h16v12H8l-4 4z" /></svg>
      <Tc x={766} cy={451} s={19.9} w={700}>Office Communication</Tc>
      <Tc x={736} cy={481} s={15} c={C.muted}>Messaging with {partner}</Tc>
      <HLine x={716} y={509} w={1155} />
      <Tc x={736} cy={539} s={15} w={500} c={C.purpleText}>Show fewer messages</Tc>
      {msgs.map((m, i) => (
        <React.Fragment key={i}>
          {m.av === "A"
            ? <div style={{ position: "absolute", left: 736, top: P(m.cy) - 11, width: 45, height: 48, borderRadius: 8, background: "#2F7A1F", color: "#fff", font: `400 24px ${FONT}`, display: "flex", alignItems: "center", justifyContent: "center" }}>B</div>
            : <Img src={staticFile("app/dcare-avatar.png")} style={{ position: "absolute", left: 734, top: P(m.cy) - 14, width: 48 }} />}
          <Tc x={806} cy={m.cy} s={17.55} w={700}>{m.name} <span style={{ font: `400 15.3px ${FONT}`, color: C.muted, marginLeft: 3 }}>{m.role}&nbsp;&nbsp;{m.time}</span></Tc>
          {m.quote && (
            <div style={{ position: "absolute", left: 806, top: P(m.cy + 18), width: 1044, height: 53, background: "#F9FAFB", borderLeft: "2px solid #D1D5DB", borderRadius: 3, boxSizing: "border-box", padding: "3px 11px" }}>
              <div style={{ font: `500 15.3px ${FONT}`, color: "#374151", lineHeight: "23px" }}>{m.quote[0]}</div>
              <div style={{ font: `400 15px ${FONT}`, color: C.muted, lineHeight: "22px" }}>{m.quote[1]}</div>
            </div>
          )}
          <Tc x={806} cy={m.cy + (m.quote ? 87 : 28)} s={18.7} c="#1F2937">{m.body}</Tc>
        </React.Fragment>
      ))}
      <HLine x={716} y={852} w={1155} />
      <Box x={731} y={871} w={1124} h={120} />
      <Tc x={747} cy={896} s={17.6} c={C.faint}>Message {partner}</Tc>
    </>
  );
};
