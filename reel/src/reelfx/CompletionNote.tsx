/**
 * Episode 4 "Front Row": the completion-note flow, rebuilt from the user's recording (screen-capture_7, 95 s) with the
 * story's names. Same interface, same order of screens, Episode 4 contents:
 *   Mr. Turner's case at Oakridge Oral Surgery → status "Consultation Completed" → the Consultation Completed form
 *   (date, surgery date, status update, PMS note, preview) → "Create official note" → Prepare Consultation Note:
 *   template "Oakridge Letterhead · Implant Consult" fills the patient, tooth, referring doctor at Gentle Dental and
 *   the X-rays → Tanya types two sentences → Who signs: "Route to a doctor to sign" → Dr. Vance → Dr. Vance's signing
 *   screen (signature field + finger signature + Finish) → back on the case: the signed note is attached for both
 *   offices, Office Communication shows it went to Gentle Dental → "Copy to PMS" → Copied.
 * Plate: one frame of the recording (public/ep4/plate-case-cn.png); every real name on it is covered and redrawn.
 * Everything else (modals, letter, signing screen) is drawn here in the app's fonts and colours. 1920×842, 30 fps.
 *
 * Beats for the Episode 4 split screens (frames): see CN_BEATS.
 */
import React from "react";
import { AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame } from "remotion";
import { FontGate } from "../effects";
import { FONT_MONO, FONT_SERIF, FONT_UI } from "../theme";

export const CN_W = 1920;
export const CN_H = 842;
const FPS = 30;

/** Timeline (frames). */
const K = {
  chip: 34, m1: 46, sDate: 78, sDateSet: 92, status: 112, pms: 120, scroll1: 150, official: 212,
  m2: 226, tplOpen: 250, tplPick: 274, fill: 284, type: 372, typeEnd: 492, scroll2: 504, route: 548, doc: 566, sendBtn: 600,
  sign: 640, field: 676, stroke: 690, strokeEnd: 738, finish: 768, signed: 774,
  back: 828, docCard: 838, chatMsg: 858, copy: 930, end: 1020,
};
export const CN_DURATION = K.end;
/** Where each Episode 4 beat starts, for the edit. */
export const CN_BEATS = {
  createNote: 0, // clip 05: case → Consultation Completed → Create official note
  autoFill: K.m2, // clip 06: template picked and auto-filled
  typeAndRoute: K.type, // clip 07: two sentences → Route to Dr. Vance
  eSign: K.sign, // clip 08: Dr. Vance signs
  onTheCase: K.back, // clip 09 / 09B: signed note on the case for both offices
  copyToPms: K.copy - 40, // clip 10: Copy to PMS
};

const C = {
  ink: "#1C1F33", text: "#3A3F55", muted: "#6B7085", faint: "#A3A6B1", line: "#E5E7EB", soft: "#F9FAFB",
  purple: "#774AEE", purpleDark: "#5B34D6", purpleOff: "#C9B8F7", purpleTint: "#F1ECFE", varBg: "#F5F1FF", varEdge: "#D9CCFB", varTxt: "#5B34D6",
  link: "#1D4ED8", green: "#14804A", greenBg: "#E6F6EC", amber: "#B45309", teal: "#ADD9E0", overlay: "rgba(17,20,33,0.5)",
};
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const sp = (f: number, a: number, d = 18) => (f < a ? 0 : spring({ frame: f - a, fps: FPS, config: { damping: d, stiffness: 170 } }));
const ease = (f: number, a: number, b: number, from: number, to: number) =>
  interpolate(f, [a, b], [from, to], { ...clamp, easing: (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2) });

const T: React.CSSProperties = { fontFamily: FONT_UI, position: "absolute", whiteSpace: "nowrap", lineHeight: 1.25 };
const Box: React.FC<{ x: number; y: number; w: number; h: number; bg?: string; style?: React.CSSProperties; children?: React.ReactNode }> = ({ x, y, w, h, bg, style, children }) => (
  <div style={{ position: "absolute", left: x, top: y, width: w, height: h, background: bg, ...style }}>{children}</div>
);
const Txt: React.FC<{ x: number; y: number; t: React.ReactNode; s?: number; w?: number; c?: string; style?: React.CSSProperties }> = ({ x, y, t, s = 16, w = 400, c = C.ink, style }) => (
  <div style={{ ...T, left: x, top: y, fontSize: s, fontWeight: w, color: c, ...style }}>{t}</div>
);
const Svg: React.FC<{ d: string; s?: number; c?: string; w?: number }> = ({ d, s = 18, c = C.muted, w = 2 }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round"><path d={d} /></svg>
);
const I_X = "M18 6 6 18M6 6l12 12";
const I_CHEV = "m6 9 6 6 6-6";
const I_CAL = "M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z";
const I_EYE = "M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12zm10 3a3 3 0 1 0 0-6 3 3 0 0 0 0 6z";
const I_COPY = "M9 9h11v11H9zM5 15H4V4h11v1";
const I_CHECK = "M20 6 9 17l-5-5";
const I_FILE = "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6M8 13h8M8 17h5";
const I_PEN = "M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z";

/** Story data. */
const D = {
  office: "Oakridge Oral Surgery", officeAddr: "1450 Oakridge Pkwy, Suite 200 · Austin, TX 78746", doctor: "Dr. Vance", doctorFull: "Dr. Daniel Vance, DMD",
  refDoc: "Dr. Rachel Moore", refOffice: "Gentle Dental", refAddr: "88 Willow Ave, Austin, TX 78704",
  patient: "ROBERT TURNER", patientNice: "Robert Turner", dob: "04/22/1968", tooth: "#30", today: "11/16/2026", surgery: "12/03/2026",
};
const NAMED = { ...D };
/** No doctors' names, for public posts (Vejay's rule): `anon` swaps them for roles while rendering. */
const ANON = { doctor: "the doctor", doctorFull: "Oakridge Oral Surgery", refDoc: "Doctor" };
const TYPED = "Mr. Turner is a good candidate for an implant at #30, with healthy bone and gums. We have scheduled placement for December 3 and will send you a restoration timeline after healing.";

// ------------------------------------------------------------------ case page (plate + renames)
const Chip: React.FC<{ x: number; y: number; t: string; bg: string; c: string; on?: number }> = ({ x, y, t, bg, c, on = 0 }) => (
  <div style={{ ...T, left: x, top: y, height: 30, padding: "0 12px", borderRadius: 15, background: bg, color: c, fontSize: 14, fontWeight: 500, lineHeight: "30px", boxShadow: on > 0 ? `0 0 0 ${2 * on}px #8D8FC3` : undefined }}>{t}</div>
);

const CasePage: React.FC<{ f: number }> = ({ f }) => {
  const completed = f >= K.chip + 4;
  const kCard = sp(f, K.docCard);
  const kMsg = sp(f, K.chatMsg);
  const copied = f >= K.copy + 3;
  return (
    <>
      <Img src={staticFile("ep4/plate-case-cn.png")} style={{ position: "absolute", left: 0, top: 0, width: CN_W, height: CN_H }} />
      {/* Office Communication: the last message, redrawn with the story's people */}
      <Box x={1438} y={0} w={414} h={147} bg="#fff">
        <div style={{ position: "absolute", left: 8, top: 14 - 60 * kMsg, width: 400 }}>
          <Msg who="Barbara (Gentle Dental)" role="Front Desk Coordinator" time="Nov 14, 9:02 AM" logo={["GD", "#2E7D5B"]} body="@Tanya Mr. Turner's X-rays are attached. Thank you!" />
          {kMsg > 0 && <div style={{ opacity: kMsg, marginTop: 10 }}>
            <Msg who="Oakridge Oral Surgery" role="Automatic" time="Today, 4:31 PM" logo={["OO", "#6D4AE8"]} body={<span>Signed consultation note shared with <b>Gentle Dental</b>.</span>} />
          </div>}
        </div>
      </Box>
      {/* the recording's own arrow cursor sits on this line of the plate: redraw the line */}
      <Box x={1450} y={368} w={380} h={22} bg="#fff"><Txt x={2} y={2} t="Update referral status, call the office, or schedule an" s={14} c={C.muted} /></Box>
      <Box x={1450} y={168} w={330} h={28} bg="#fff"><Txt x={3} y={3} t="Message Gentle Dental" s={16} c={C.faint} /></Box>
      {/* treatment */}
      <Box x={398} y={204} w={260} h={70} bg="#fff">
        <Txt x={4} y={4} t="Implant Consultation" s={18} w={600} />
        <Txt x={4} y={42} t={`Tooth: ${D.tooth}`} s={16} c={C.text} />
      </Box>
      {/* status chips: the outline moves from Scheduled to Completed */}
      {completed && <>
        <Chip x={1558} y={434} t="Consultation Scheduled" bg="#DEE6F8" c="#3F4E9E" />
        <Chip x={1468} y={468} t="Consultation Completed" bg="#FAE8FF" c="#A1309F" on={sp(f, K.chip + 4)} />
      </>}
      {/* Documents: the signed note lands */}
      <Box x={866} y={470} w={474} h={300} bg="#fff">
        {kCard <= 0 ? <Txt x={9} y={6} t="No documents attached" s={16} c={C.muted} /> : (
          <div style={{ position: "absolute", left: 6, top: 4, width: 460, borderRadius: 10, border: `1px solid ${C.line}`, background: "#fff", padding: "16px 16px 14px", boxSizing: "border-box", opacity: kCard, transform: `translateY(${(1 - kCard) * 20}px) scale(${0.96 + 0.04 * kCard})`, boxShadow: `0 ${10 * kCard}px 24px rgba(28,31,51,${0.08 * kCard})` }}>
            <div style={{ display: "flex", gap: 12, alignItems: "flex-start", fontFamily: FONT_UI }}>
              <div style={{ width: 40, height: 48, borderRadius: 6, background: C.purpleTint, display: "flex", alignItems: "center", justifyContent: "center", flex: "none" }}><Svg d={I_FILE} s={22} c={C.purple} /></div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 16, fontWeight: 600, color: C.ink }}>Consultation Note · Robert Turner</div>
                <div style={{ fontSize: 14, color: C.muted, marginTop: 3 }}>Signed by {D.doctor} · Nov 16, 4:31 PM</div>
                <div style={{ display: "flex", gap: 8, marginTop: 9 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: C.green, background: C.greenBg, borderRadius: 11, padding: "3px 10px", display: "inline-flex", alignItems: "center", gap: 4 }}><Svg d={I_CHECK} s={13} c={C.green} w={3} />Signed</span>
                  <span style={{ fontSize: 13, fontWeight: 500, color: "#3F4E9E", background: "#E8EDFB", borderRadius: 11, padding: "3px 10px" }}>Shared with Gentle Dental</span>
                </div>
              </div>
            </div>
            <div style={{ display: "flex", gap: 10, marginTop: 14, fontFamily: FONT_UI }}>
              <Btn label="Download" />
              <Btn label={copied ? "Copied to PMS" : "Copy to PMS"} icon={copied ? I_CHECK : I_COPY} solid={copied} press={f >= K.copy - 3 && f < K.copy + 3} green={copied} />
            </div>
          </div>
        )}
      </Box>
      {f >= K.copy + 3 && <Toast f={f} at={K.copy + 3} t="Copied. Paste it into your practice management system." x={880} y={720} />}
    </>
  );
};

const Msg: React.FC<{ who: string; role: string; time: string; logo: [string, string]; body: React.ReactNode }> = ({ who, role, time, logo, body }) => (
  <div style={{ display: "flex", gap: 14, fontFamily: FONT_UI }}>
    <div style={{ width: 40, height: 40, borderRadius: 8, background: "#EDF2F8", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 13, color: logo[1], flex: "none" }}>{logo[0]}</div>
    <div style={{ width: 340 }}>
      <div style={{ fontSize: 16, fontWeight: 600, color: C.ink }}>{who}</div>
      <div style={{ fontSize: 14, color: C.muted, marginTop: 6 }}>{role} · {time}</div>
      <div style={{ fontSize: 16, color: C.ink, marginTop: 6, lineHeight: 1.45, whiteSpace: "normal" }}>{typeof body === "string" && body.startsWith("@") ? <><span style={{ color: "#19557A" }}>{body.split(" ")[0]}</span>{body.slice(body.indexOf(" "))}</> : body}</div>
    </div>
  </div>
);

const Btn: React.FC<{ label: string; icon?: string; solid?: boolean; press?: boolean; green?: boolean; dim?: boolean; s?: number }> = ({ label, icon, solid, press, green, dim, s = 15 }) => (
  <div style={{ display: "inline-flex", alignItems: "center", gap: 7, height: 38, padding: "0 16px", borderRadius: 6, fontFamily: FONT_UI, fontSize: s, fontWeight: 500, whiteSpace: "nowrap",
    background: solid ? (green ? C.green : C.purple) : "#fff", color: solid ? "#fff" : dim ? C.purpleOff : C.purple, border: `1px solid ${solid ? "transparent" : dim ? "#DCD2FB" : C.purple}`,
    transform: `scale(${press ? 0.95 : 1})` }}>
    {icon && <Svg d={icon} s={16} c={solid ? "#fff" : C.purple} w={2.2} />}{label}
  </div>
);

const Toast: React.FC<{ f: number; at: number; t: string; x: number; y: number; sub?: string }> = ({ f, at, t, x, y, sub }) => {
  const k = sp(f, at);
  return (
    <div style={{ position: "absolute", left: x, top: y + (1 - k) * 16, opacity: k, display: "flex", gap: 10, alignItems: "flex-start", background: "#fff", border: `1px solid #BFE5CC`, borderLeft: `4px solid ${C.green}`, borderRadius: 8, padding: "12px 18px 12px 14px", boxShadow: "0 12px 30px rgba(28,31,51,0.14)", fontFamily: FONT_UI }}>
      <div style={{ width: 22, height: 22, borderRadius: 11, background: C.green, display: "flex", alignItems: "center", justifyContent: "center", flex: "none" }}><Svg d={I_CHECK} s={14} c="#fff" w={3} /></div>
      <div><div style={{ fontSize: 15, fontWeight: 600, color: C.ink, whiteSpace: "nowrap" }}>{t}</div>{sub && <div style={{ fontSize: 13, color: C.muted, marginTop: 3, whiteSpace: "nowrap" }}>{sub}</div>}</div>
    </div>
  );
};

// ------------------------------------------------------------------ modal 1: Consultation Completed
const Field: React.FC<{ x: number; y: number; w: number; label?: string; value?: string; ph?: string; focus?: boolean; select?: boolean; icon?: string }> = ({ x, y, w, label, value, ph, focus, select, icon }) => (
  <>
    {label && <Txt x={x} y={y - 26} t={label} s={16} w={500} />}
    <div style={{ position: "absolute", left: x, top: y, width: w, height: 50, boxSizing: "border-box", borderRadius: 6, border: `1px solid ${focus ? C.purple : "#E3E5EA"}`, boxShadow: focus ? `0 0 0 3px ${C.purpleTint}` : undefined, background: select ? "#fff" : "#F5F6F8" }}>
      <Txt x={18} y={14} t={value || ph} s={16} c={value ? C.ink : C.faint} />
      {select && <div style={{ position: "absolute", right: 10, top: 15 }}><Svg d={I_CHEV} s={18} c={C.ink} /></div>}
      {icon && <div style={{ position: "absolute", right: 14, top: 15 }}><Svg d={icon} s={18} c={C.muted} /></div>}
    </div>
  </>
);

const Modal1: React.FC<{ f: number }> = ({ f }) => {
  const k = sp(f, K.m1, 20);
  const out = interpolate(f, [K.official + 6, K.m2 + 4], [1, 0], clamp);
  const scroll = ease(f, K.scroll1, K.scroll1 + 40, 0, 600);
  const surg = f >= K.sDateSet ? D.surgery : "";
  const pms1 = `Consultation completed on ${D.today}.`;
  const pms2 = f >= K.pms ? `Patient has scheduled surgery on ${D.surgery}.` : "";
  const pmsShown = pms2.slice(0, Math.max(0, Math.floor((f - K.pms) * 1.6)));
  const statusFocus = f >= K.status - 6 && f < K.status + 14;
  return (
    <div style={{ position: "absolute", left: 708, top: 42, width: 504, height: 758, borderRadius: 8, background: "#fff", overflow: "hidden", opacity: k * out, transform: `translateY(${(1 - k) * 24}px) scale(${0.97 + 0.03 * k})`, boxShadow: "0 24px 60px rgba(0,0,0,0.25)" }}>
      <div style={{ position: "absolute", left: 0, top: -scroll, width: 504, height: 1400 }}>
        <Txt x={27} y={30} t="Consultation Completed" s={21} w={600} />
        {[["Internal Audit Trail:", " Keep your staff updated with a", "private, internal record."], ["Manual PMS Export:", " Copy and paste this note into", "your dental patient management software."], ["One-Click Automation:", " Sign your note with DocuSign", "to have it sent automatically to your referring office."]].map(([b, r, l2], i) => (
          <div key={i} style={{ position: "absolute", left: 30, top: 76 + i * 49, fontFamily: FONT_UI, fontSize: 16, lineHeight: "22px", color: C.text, width: 430 }}>
            <span style={{ position: "absolute", left: -2, top: 0 }}>•</span>
            <div style={{ paddingLeft: 20 }}><b style={{ color: C.ink, fontWeight: 600 }}>{b}</b>{r}<br />{l2}</div>
          </div>
        ))}
        <Field x={27} y={258} w={208} label="Date" value={D.today} select={false} />
        <Field x={249} y={258} w={208} label="Surgery date" value={surg} ph="Select date" focus={f >= K.sDate - 4 && f < K.sDateSet + 10} />
        <Txt x={249} y={314} t="Optional. Shown on the timeline." s={14} c={C.muted} />
        <Box x={27} y={350} w={430} h={68} bg="#F7F7F8" style={{ borderRadius: 6, border: "1px solid #EEEFF2" }}>
          <Txt x={14} y={14} t="Referral Progress Audit:" s={14} w={600} c={C.text} />
          <Txt x={14} y={38} t="11/14 Consultation Scheduled" s={14} c={C.text} />
        </Box>
        <Txt x={27} y={438} t="Status update" s={16} w={500} />
        <div style={{ position: "absolute", left: 27, top: 462, width: 430, fontFamily: FONT_UI, fontSize: 13.5, color: C.muted, lineHeight: "18px" }}>Only "Patient scheduled" also moves the referral to Scheduled; the other choices just go in the note.</div>
        <Field x={27} y={504} w={430} value={f >= K.status ? "Patient scheduled" : "Select an update"} select focus={statusFocus} />
        <Txt x={27} y={572} t="PMS Note:" s={16} w={500} />
        <Box x={27} y={598} w={430} h={130} bg="#fff" style={{ borderRadius: 6, border: "1px solid #E3E5EA", boxSizing: "border-box" }}>
          <div style={{ position: "absolute", left: 14, top: 12, fontFamily: FONT_UI, fontSize: 16, lineHeight: "22px", color: C.ink, width: 400 }}>{pms1}<br />{pmsShown}</div>
        </Box>
        <Txt x={27} y={740} t="Copy and paste into your patient's chart as a note" s={14} c={C.muted} />
        <Txt x={27} y={776} t="Edit templates" s={14} w={500} c="#1D4E89" />
        <Box x={27} y={812} w={430} h={126} bg="#F2F0FD" style={{ borderRadius: 6, border: "1px solid #D9D3F6" }}>
          <Txt x={14} y={14} t="Next Step" s={16} w={600} c="#2B2A6B" />
          <Txt x={14} y={46} t="Remind me on (optional)" s={14} w={500} c={C.ink} />
          <Box x={14} y={68} w={400} h={46} bg="#fff" style={{ borderRadius: 6, border: "1px solid #E3E5EA" }}><Txt x={18} y={13} t="Select date" s={16} c={C.faint} /></Box>
        </Box>
        <Txt x={27} y={958} t="PMS note preview" s={16} w={500} />
        <Box x={27} y={986} w={430} h={216} bg="#F7F7F8" style={{ borderRadius: 6, border: "1px solid #EEEFF2", overflow: "hidden" }}>
          <div style={{ position: "absolute", left: 14, top: 10, fontFamily: FONT_UI, fontSize: 14, lineHeight: "19px", color: C.text, whiteSpace: "pre" }}>
            {`${D.today}\nReferral Status Update\nPatient Name: ${D.patient}  DOB: ${D.dob}\nTo: ${D.refOffice}\n\n${pms1}\n${pms2}\n\n${D.refDoc}, should you have any questions please\ndon't hesitate to reach out.\n\nSincerely\n${D.doctor}\n${D.office}`}
          </div>
        </Box>
        <div style={{ position: "absolute", right: 47, top: 1222, display: "flex", gap: 10 }}>
          <Btn label="Cancel" /><Btn label="Skip" /><Btn label="Copy to PMS" icon={I_COPY} />
        </div>
        <div style={{ position: "absolute", right: 47, top: 1274, display: "flex", gap: 10 }}>
          <Btn label="Create official note" press={f >= K.official - 3 && f < K.official + 3} /><Btn label="Save & update status" solid />
        </div>
      </div>
      {/* calendar popover for the surgery date */}
      {f >= K.sDate && f < K.sDateSet + 6 && <Calendar f={f} />}
    </div>
  );
};

const Calendar: React.FC<{ f: number }> = ({ f }) => {
  const k = sp(f, K.sDate);
  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  return (
    <div style={{ position: "absolute", left: 214, top: 314, width: 270, padding: 12, background: "#fff", borderRadius: 8, boxShadow: "0 14px 34px rgba(0,0,0,0.18)", border: `1px solid ${C.line}`, opacity: k, transform: `translateY(${(1 - k) * -8}px)`, fontFamily: FONT_UI }}>
      <div style={{ textAlign: "center", fontSize: 14, fontWeight: 600, color: C.ink, marginBottom: 8 }}>December 2026</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4, fontSize: 12, textAlign: "center", color: C.muted }}>
        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => <div key={d} style={{ fontWeight: 600 }}>{d}</div>)}
        {[0, 0].map((_, i) => <div key={"e" + i} />)}
        {days.map((d) => {
          const pick = d === 3 && f >= K.sDateSet - 4;
          return <div key={d} style={{ height: 26, lineHeight: "26px", borderRadius: 13, background: pick ? C.purple : "transparent", color: pick ? "#fff" : C.ink, fontWeight: pick ? 600 : 400 }}>{d}</div>;
        })}
      </div>
    </div>
  );
};

// ------------------------------------------------------------------ modal 2: Prepare Consultation Note
const V: React.FC<{ f: number; at: number; children: React.ReactNode }> = ({ f, at, children }) => {
  const k = sp(f, at, 14);
  const flash = interpolate(f, [at, at + 10, at + 30], [1, 1, 0], clamp);
  return (
    <span style={{ display: "inline-block", padding: "0 5px", borderRadius: 4, border: `1px solid ${C.varEdge}`, background: flash > 0 ? `rgba(119,74,238,${0.06 + 0.16 * flash})` : C.varBg, color: C.varTxt, opacity: k, transform: `scale(${0.8 + 0.2 * k})`, transformOrigin: "left center", lineHeight: "26px", margin: "1px 0" }}>{children}</span>
  );
};

const TEMPLATES = ["General", "Oakridge Letterhead · Implant Consult", "Oakridge Letterhead · Extraction", "Oakridge Letterhead · Declined Treatment"];

const Modal2: React.FC<{ f: number }> = ({ f }) => {
  const k = sp(f, K.m2, 20);
  const out = interpolate(f, [K.sendBtn + 26, K.sign + 4], [1, 0], clamp);
  const picked = f >= K.tplPick;
  const scroll = ease(f, K.type - 26, K.type - 4, 0, 150) + ease(f, K.scroll2, K.scroll2 + 34, 0, 470);
  const vt = (i: number) => K.fill + i * 9;
  const n = Math.max(0, Math.min(TYPED.length, Math.floor((f - K.type) * (TYPED.length / (K.typeEnd - K.type)))));
  const typing = f >= K.type && f < K.typeEnd + 12;
  const caret = typing && Math.floor(f / 8) % 2 === 0;
  const route = f >= K.route;
  const docSel = f >= K.doc;
  const btnLabel = route ? `Route to ${D.doctor === "Dr. Vance" ? "Dr. Vance" : "the Doctor"} to Sign` : "Sign and Send Consultation Note";
  return (
    <div style={{ position: "absolute", left: 375, top: 42, width: 1152, height: 758, borderRadius: 10, background: "#fff", overflow: "hidden", opacity: k * out, transform: `translateY(${(1 - k) * 24}px) scale(${0.97 + 0.03 * k})`, boxShadow: "0 24px 60px rgba(0,0,0,0.25)" }}>
      {/* header */}
      <Box x={0} y={0} w={1152} h={96} bg={C.soft} style={{ borderBottom: `1px solid ${C.line}` }}>
        <Txt x={27} y={20} t="Prepare Consultation Note" s={22} w={600} />
        <Txt x={27} y={56} t="Review, edit, and sign the consultation note before sending it." s={16} c={C.text} />
        <div style={{ position: "absolute", right: 28, top: 38 }}><Svg d={I_X} s={20} c={C.ink} w={2.6} /></div>
      </Box>
      {/* scrolling body */}
      <div style={{ position: "absolute", left: 0, top: 97, width: 1152, height: 538, overflow: "hidden" }}>
        <div style={{ position: "absolute", left: 0, top: -scroll, width: 1152 }}>
          <Txt x={27} y={28} t="Template" s={16} w={500} />
          <div style={{ position: "absolute", left: 27, top: 56, width: 432, height: 44, borderRadius: 6, border: `1px solid ${f >= K.tplOpen - 4 && f < K.tplPick + 12 ? C.purple : "#D7DAE0"}`, boxSizing: "border-box", background: "#fff" }}>
            <Txt x={16} y={11} t={picked ? TEMPLATES[1] : TEMPLATES[0]} s={17} />
            <div style={{ position: "absolute", right: 10, top: 12 }}><Svg d={I_CHEV} s={18} c={C.ink} /></div>
          </div>
          <div style={{ position: "absolute", right: 46, top: 58, height: 38, padding: "0 16px", border: `1px solid ${C.purple}`, borderRadius: 6, display: "flex", alignItems: "center", gap: 8, fontFamily: FONT_UI, fontSize: 16, color: C.purple }}><Svg d={I_EYE} s={17} c={C.purple} />Preview</div>
          <div style={{ position: "absolute", left: 27, top: 118, display: "flex", border: `1px solid ${C.line}`, borderRadius: 6, padding: 3, fontFamily: FONT_UI, fontSize: 16 }}>
            <div style={{ background: C.purple, color: "#fff", borderRadius: 4, padding: "6px 12px" }}>Show values</div>
            <div style={{ color: C.text, padding: "6px 12px" }}>Show codes</div>
          </div>
          {/* editor */}
          <div style={{ position: "absolute", left: 27, top: 166, width: 1078, borderRadius: 8, border: `1px solid ${C.line}`, overflow: "hidden" }}>
            <div style={{ height: 96, background: C.soft, borderBottom: `1px solid ${C.line}`, position: "relative", fontFamily: FONT_UI }}>
              <div style={{ position: "absolute", left: 16, top: 12, display: "flex", gap: 22, alignItems: "center", fontSize: 16, color: C.ink }}>
                <span>↶</span><b>B</b><span style={{ fontFamily: FONT_MONO, fontSize: 14 }}>&lt;/&gt;</span><span>≡</span><span>🔗</span>
                <span style={{ border: `1px solid ${C.line}`, borderRadius: 4, padding: "3px 10px", background: "#fff" }}>Paragraph ⌄</span>
                <span style={{ border: `1px solid ${C.line}`, borderRadius: 4, padding: "3px 10px", background: "#fff" }}>Size ⌄</span>
                <span>☰</span><span>#</span><span>⫷</span><span>☷</span><span>⫸</span><span>▣</span>
              </div>
              <div style={{ position: "absolute", left: 10, top: 56, width: 360, height: 30, border: `1px solid ${C.line}`, borderRadius: 4, background: "#fff", fontSize: 16, lineHeight: "30px", paddingLeft: 12, color: C.ink }}>Insert Variable...</div>
            </div>
            {/* the letter */}
            <div style={{ position: "relative", padding: "22px 34px 30px", fontFamily: FONT_UI, fontSize: 17, lineHeight: "27px", color: C.ink }}>
              {picked ? (
                <>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", borderBottom: `2px solid #1F2A44`, paddingBottom: 10, marginBottom: 18, opacity: sp(f, K.fill - 6) }}>
                    <div>
                      <div style={{ fontFamily: FONT_SERIF, fontSize: 30, lineHeight: "32px", color: "#1F2A44", letterSpacing: "0.04em" }}>OAKRIDGE ORAL SURGERY</div>
                      <div style={{ fontSize: 13, color: C.muted, marginTop: 4 }}>{D.doctorFull} · Oral &amp; Maxillofacial Surgery</div>
                    </div>
                    <div style={{ fontSize: 13, color: C.muted, textAlign: "right", lineHeight: "18px" }}>{D.officeAddr}<br />(512) 555-0142</div>
                  </div>
                  <div><V f={f} at={vt(0)}>{D.today}</V></div>
                  <div><V f={f} at={vt(1)}>{D.refDoc}</V>, <V f={f} at={vt(2)}>{D.refOffice}</V></div>
                  <div><V f={f} at={vt(3)}>{D.refAddr}</V></div>
                  <div style={{ marginTop: 18 }}>Re: <V f={f} at={vt(4)}>{D.patient}</V> <V f={f} at={vt(5)}>DOB ({D.dob})</V> · Tooth <V f={f} at={vt(6)}>{D.tooth}</V> · <V f={f} at={vt(7)}>Implant Consultation</V></div>
                  <div style={{ marginTop: 18 }}>Dear <V f={f} at={vt(1)}>{D.refDoc}</V>,</div>
                  <div style={{ marginTop: 14 }}>Thank you for referring <V f={f} at={vt(4)}>{D.patient}</V> to our office for an implant consultation on <V f={f} at={vt(0)}>{D.today}</V>.</div>
                  <div style={{ marginTop: 14, minHeight: 54, background: f >= K.type - 10 && f < K.typeEnd + 20 ? "rgba(119,74,238,0.04)" : undefined, borderRadius: 4 }}>
                    {TYPED.slice(0, n)}{caret && <span style={{ borderLeft: `2px solid ${C.ink}`, marginLeft: 1 }} />}
                  </div>
                  <div style={{ marginTop: 14, display: "flex", gap: 14, alignItems: "center", opacity: sp(f, vt(8)) }}>
                    <span>X-rays:</span>
                    {["preop/newpano.png", "preop/oldpano.png"].map((s, i) => (
                      <Img key={s} src={staticFile(s)} style={{ width: 150, height: 76, objectFit: "cover", borderRadius: 4, border: `1px solid ${C.varEdge}`, transform: `scale(${0.85 + 0.15 * sp(f, vt(8) + i * 5)})` }} />
                    ))}
                  </div>
                  <div style={{ marginTop: 18 }}>If you have any questions, please do not hesitate to contact me.</div>
                  <div style={{ marginTop: 18 }}>Sincerely,<br /><V f={f} at={vt(9)}>{D.doctorFull}</V></div>
                </>
              ) : (
                <>
                  <div><V f={f} at={-99}>{D.today}</V></div>
                  <div><V f={f} at={-99}>{D.refDoc}</V></div>
                  <div style={{ marginTop: 18 }}>Re: <V f={f} at={-99}>{D.patient}</V></div>
                  <div style={{ marginTop: 18 }}>Dear <V f={f} at={-99}>{D.refDoc}</V>,</div>
                </>
              )}
            </div>
          </div>
          {/* who signs */}
          <div style={{ position: "absolute", left: 27, top: 930, width: 1078, borderRadius: 8, border: `1px solid ${C.line}`, padding: "18px 20px", boxSizing: "border-box", fontFamily: FONT_UI }}>
            <div style={{ fontSize: 16, fontWeight: 600, color: C.ink, marginBottom: 12 }}>Who signs this note?</div>
            {["I'll sign it myself", "Sign on behalf of a doctor", "Route to a doctor to sign"].map((o, i) => {
              const on = route ? i === 2 : i === 0;
              return (
                <div key={o} style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 16, color: C.ink, height: 32 }}>
                  <div style={{ width: 16, height: 16, borderRadius: 8, border: `1.5px solid ${on ? C.purple : "#8A8FA0"}`, display: "flex", alignItems: "center", justifyContent: "center" }}>{on && <div style={{ width: 8, height: 8, borderRadius: 4, background: C.purple }} />}</div>{o}
                </div>
              );
            })}
            <div style={{ height: route ? 74 : 0, overflow: "hidden", opacity: sp(f, K.route) }}>
              <div style={{ marginTop: 10, marginLeft: 28, fontSize: 14, color: C.muted }}>Doctor</div>
              <div style={{ marginTop: 6, marginLeft: 28, width: 360, height: 40, borderRadius: 6, border: `1px solid ${docSel ? C.purple : "#D7DAE0"}`, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 12px", boxSizing: "border-box", fontSize: 16, color: docSel ? C.ink : C.faint }}>
                {docSel ? `${D.doctorFull} · Oral Surgeon` : "Select a doctor"}<Svg d={I_CHEV} s={16} c={C.ink} />
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* template dropdown */}
      {f >= K.tplOpen && f < K.tplPick + 6 && (
        <div style={{ position: "absolute", left: 27, top: 199, width: 432, background: "#fff", borderRadius: 6, border: `1px solid ${C.line}`, boxShadow: "0 14px 34px rgba(0,0,0,0.16)", padding: 4, opacity: sp(f, K.tplOpen), fontFamily: FONT_UI }}>
          {TEMPLATES.map((t, i) => {
            const hi = i === 1 && f >= K.tplOpen + 12;
            return <div key={t} style={{ padding: "9px 12px", fontSize: 16, borderRadius: 4, background: hi ? C.purpleTint : "transparent", color: hi ? C.purpleDark : C.ink, fontWeight: hi ? 600 : 400 }}>{t}</div>;
          })}
        </div>
      )}
      {/* footer */}
      <Box x={0} y={634} w={1152} h={124} bg={C.soft} style={{ borderTop: `1px solid ${C.line}` }}>
        <div style={{ position: "absolute", left: 27, top: 18, display: "flex", alignItems: "center", gap: 6, fontFamily: FONT_UI, fontSize: 20, fontWeight: 600, color: C.ink, letterSpacing: "-0.01em" }}>
          <div style={{ width: 16, height: 16, borderRadius: 3, background: "linear-gradient(135deg,#4C00FF,#FF5252 160%)" }} />docusign
        </div>
        <div style={{ position: "absolute", left: 27, top: 60, display: "flex", gap: 14 }}>
          <Btn label="Cancel" s={17} /><Btn label="Save Draft" s={17} /><Btn label="Save Changes" dim s={17} /><Btn label="Save as New Template" dim s={17} />
          <Btn label={btnLabel} solid s={17} press={f >= K.sendBtn - 3 && f < K.sendBtn + 3} />
        </div>
      </Box>
      {f >= K.sendBtn + 2 && <Toast f={f} at={K.sendBtn + 2} t={`Routed to ${D.doctor} to sign`} sub="On the doctor's tablet now." x={760} y={20} />}
    </div>
  );
};

// ------------------------------------------------------------------ Dr. Vance's signing screen
const SIG = "M10 52 C 18 20, 30 10, 34 30 C 37 46, 30 58, 26 50 C 22 40, 44 22, 52 38 C 58 50, 60 52, 66 40 C 70 32, 74 34, 74 44 C 74 52, 80 52, 86 42 C 90 34, 96 36, 96 44 C 96 50, 104 50, 110 40 C 114 34, 120 36, 120 46 C 122 52, 128 48, 134 42 C 140 36, 146 40, 150 46 M 40 60 C 80 56, 120 56, 160 52";
const SignScreen: React.FC<{ f: number }> = ({ f }) => {
  const k = sp(f, K.sign, 22);
  const out = interpolate(f, [K.back - 6, K.back + 6], [1, 0], clamp);
  const kField = sp(f, K.field, 13);
  const draw = interpolate(f, [K.stroke, K.strokeEnd], [0, 1], { ...clamp, easing: (t) => 1 - Math.pow(1 - t, 1.6) });
  const done = f >= K.signed;
  const kDone = sp(f, K.signed, 16);
  const fields = [["Signature", I_PEN], ["Initial", ""], ["Stamp", ""], ["Date Signed", I_CAL], ["Name", ""], ["First Name", ""], ["Last Name", ""], ["Email Address", ""], ["Company", ""], ["Title", ""]];
  return (
    <AbsoluteFill style={{ background: "#fff", opacity: k * out, transform: `scale(${0.985 + 0.015 * k})` }}>
      <Txt x={27} y={20} t="Sign Consultation Note" s={20} w={600} />
      <div style={{ position: "absolute", left: 262, top: 18, display: "flex", alignItems: "center", gap: 5, fontFamily: FONT_UI, fontSize: 20, fontWeight: 600, color: C.ink }}><div style={{ width: 15, height: 15, borderRadius: 3, background: "linear-gradient(135deg,#4C00FF,#FF5252 160%)" }} />docusign</div>
      <div style={{ position: "absolute", right: 46, top: 22 }}><Svg d={I_X} s={20} c={C.ink} w={2.6} /></div>
      <Box x={27} y={91} w={1847} h={63} bg={done ? "#CFEBD9" : C.teal}>
        <Txt x={18} y={20} t={done ? `Signed by ${D.doctor} · sending to Gentle Dental and saving to Mr. Turner's case` : "Drag and drop fields from the left panel onto the document"} s={20} c={C.ink} />
        <div style={{ position: "absolute", right: 72, top: 9, height: 45, borderRadius: 4, background: done ? C.green : C.purple, display: "flex", alignItems: "center", padding: "0 22px", fontFamily: FONT_UI, fontSize: 18, fontWeight: 600, color: "#fff", transform: `scale(${f >= K.finish - 3 && f < K.finish + 3 ? 0.94 : 1})` }}>{done ? "✓ Finished" : "Finish"}</div>
        <div style={{ position: "absolute", right: 16, top: 9, width: 45, height: 45, borderRadius: 4, background: "#E6EEF0", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, color: C.ink }}>⋮</div>
      </Box>
      <Box x={27} y={154} w={420} h={597} bg="#F4F4F4">
        <Txt x={195} y={20} t="FIELDS" s={15} w={600} c="#2B2A6B" style={{ letterSpacing: "0.06em" }} />
        {fields.map(([t, ic], i) => (
          <div key={t} style={{ position: "absolute", left: 195, top: 82 + i * 35 + (i >= 4 ? 37 : 0), display: "flex", alignItems: "center", gap: 12, fontFamily: FONT_UI, fontSize: 15, color: C.text, background: i === 0 && f >= K.field - 18 && f < K.field ? "#E2E6F3" : undefined, padding: "2px 6px", borderRadius: 3 }}>
            {ic ? <Svg d={ic} s={17} c={C.ink} /> : <div style={{ width: 17, height: 17, borderRadius: 3, background: "#2B2F3E", opacity: 0.85 }} />}{t}
          </div>
        ))}
      </Box>
      <Box x={447} y={154} w={918} h={597} bg="#fff" style={{ borderLeft: "1px solid #E5E5E5", borderRight: "1px solid #E5E5E5" }}>
        <div style={{ position: "absolute", left: 75, top: 30, width: 780, fontFamily: "Arial, " + FONT_UI, fontSize: 17, lineHeight: "24px", color: "#111" }}>
          <div style={{ fontFamily: FONT_SERIF, fontSize: 22, letterSpacing: "0.04em", color: "#1F2A44", borderBottom: "1.5px solid #1F2A44", paddingBottom: 4, marginBottom: 10 }}>OAKRIDGE ORAL SURGERY</div>
          {D.today}<br />{D.refDoc}, {D.refOffice}<br />{D.refAddr}<br />Re: {D.patient} DOB ({D.dob}) · Tooth {D.tooth}
          <div style={{ marginTop: 14 }}>Dear {D.refDoc},</div>
          <div style={{ marginTop: 12 }}>Thank you for referring {D.patient} to our office for an implant consultation on {D.today}.</div>
          <div style={{ marginTop: 12 }}>{TYPED}</div>
          <div style={{ marginTop: 12 }}>Sincerely,<br />{D.doctorFull}</div>
        </div>
        {kField > 0 && (
          <div style={{ position: "absolute", left: 66, top: 440 + (1 - kField) * -40, width: 210, height: 86, borderRadius: 3, border: `2px solid ${done ? C.green : "#6D4AE8"}`, background: "#fff", opacity: kField, transform: `scale(${0.9 + 0.1 * kField})` }}>
            <Txt x={10} y={4} t="Signed by:" s={11} w={700} c="#111" />
            <svg style={{ position: "absolute", left: 18, top: 14 }} width="180" height="64" viewBox="0 0 170 66">
              <path d={SIG} fill="none" stroke="#1B2A6B" strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - draw} />
            </svg>
            <Txt x={10} y={68} t={`${D.doctor === "Dr. Vance" ? "Daniel Vance" : "Signer"} · 7A3F9C21E4`} s={10} c="#555" style={{ fontFamily: FONT_MONO, opacity: draw }} />
          </div>
        )}
      </Box>
      <Box x={1365} y={154} w={425} h={597} bg="#F7F7F7" />
      {[["✦", "Summarize"], ["⌕", "Search"], ["▤", "View Pages"], ["⤓", "Download"], ["⎙", "Print"]].map(([g, t], i) => (
        <div key={t} style={{ position: "absolute", left: 1800, top: 180 + i * 82, width: 70, textAlign: "center", fontFamily: FONT_UI, fontSize: 12, color: "#2B2A6B" }}><div style={{ fontSize: 24, marginBottom: 8 }}>{g}</div>{t}</div>
      ))}
      <Txt x={54} y={772} t="Powered by docusign" s={12} c={C.text} />
      <Txt x={1600} y={772} t="Copyright © 2026 Docusign, Inc. All rights reserved" s={11} c={C.text} />
      {done && (
        <div style={{ position: "absolute", left: 906 - 190, top: 330, width: 380, padding: "26px 24px", borderRadius: 14, background: "#fff", boxShadow: "0 24px 60px rgba(0,0,0,0.22)", textAlign: "center", fontFamily: FONT_UI, opacity: kDone, transform: `scale(${0.85 + 0.15 * kDone})` }}>
          <div style={{ width: 56, height: 56, borderRadius: 28, background: C.green, margin: "0 auto 12px", display: "flex", alignItems: "center", justifyContent: "center" }}><Svg d={I_CHECK} s={30} c="#fff" w={3} /></div>
          <div style={{ fontSize: 22, fontWeight: 700, color: C.ink }}>Signed and sent</div>
          <div style={{ fontSize: 15, color: C.muted, marginTop: 6 }}>Attached to Mr. Turner's case for Oakridge and Gentle Dental.</div>
        </div>
      )}
    </AbsoluteFill>
  );
};

// ------------------------------------------------------------------ pointer
/** [frame, x, y] keyframes. */
const PATH: [number, number, number][] = [
  [0, 1300, 640], [30, 1560, 486], [K.m1 + 10, 1560, 486],
  [K.sDate - 6, 1060, 324], [K.sDateSet - 10, 1060, 324], [K.sDateSet - 2, 830, 485], [K.status - 10, 900, 570], [K.status + 6, 900, 570],
  [K.official - 14, 880, 710], [K.official + 10, 880, 710],
  [K.tplOpen - 8, 640, 220], [K.tplPick - 10, 640, 220], [K.tplPick - 2, 600, 272], [K.tplPick + 30, 680, 330],
  [K.type - 16, 760, 440], [K.typeEnd, 760, 440],
  [K.route - 10, 436, 584], [K.route + 6, 436, 584], [K.doc - 6, 620, 654], [K.doc + 8, 620, 654], [K.sendBtn - 6, 1170, 760], [K.sendBtn + 20, 1170, 760],
  [K.field - 30, 280, 245], [K.field - 18, 280, 245], [K.field, 610, 640], [K.field + 8, 610, 640], [K.stroke, 560, 650], [K.strokeEnd, 680, 640],
  [K.finish - 8, 1712, 122], [K.finish + 20, 1712, 122],
  [K.back + 10, 1300, 600], [K.copy - 10, 1180, 650], [K.copy + 30, 1180, 650], [K.end, 1240, 690],
];
const Pointer: React.FC<{ f: number }> = ({ f }) => {
  let i = PATH.findIndex((p) => p[0] > f); if (i < 0) i = PATH.length; const a = PATH[Math.max(0, i - 1)], b = PATH[Math.min(PATH.length - 1, i)];
  const t = b[0] === a[0] ? 1 : Math.min(1, (f - a[0]) / (b[0] - a[0]));
  const e = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
  const x = a[1] + (b[1] - a[1]) * e, y = a[2] + (b[2] - a[2]) * e;
  const clicks = [K.chip, K.sDate, K.sDateSet, K.status, K.official, K.tplOpen, K.tplPick, K.route, K.doc, K.sendBtn, K.field - 18, K.finish, K.copy];
  const down = clicks.some((c) => f >= c - 2 && f < c + 3) || (f >= K.stroke && f < K.strokeEnd);
  const finger = f >= K.sign && f < K.back; // Dr. Vance signs on his tablet: a fingertip, not an arrow
  const hand = !finger && clicks.some((c) => f >= c - 10 && f < c + 6);
  const hide = f >= K.type - 6 && f < K.typeEnd + 4;
  if (hide) return null;
  if (finger) return <div style={{ position: "absolute", left: x - 22, top: y - 22, width: 44, height: 44, borderRadius: 22, background: `rgba(30,30,40,${down ? 0.28 : 0.16})`, border: "2px solid rgba(255,255,255,0.9)", transform: `scale(${down ? 0.86 : 1})` }} />;
  return (
    <svg style={{ position: "absolute", left: x, top: y, transform: `scale(${down ? 0.85 : 1})`, transformOrigin: "0 0" }} width="22" height="30" viewBox="0 0 22 30">
      {hand ? <path d="M8 13V3.5a2 2 0 0 1 4 0V12m0-1.5a2 2 0 0 1 4 0V13m0-1a2 2 0 0 1 4 0v6.5A8.5 8.5 0 0 1 11.5 27h-1A7.5 7.5 0 0 1 4 23l-3-5.5a2 2 0 0 1 3.4-2L8 19" fill="#fff" stroke="#111" strokeWidth="1.4" strokeLinejoin="round" /> : <path d="M1 1v24l6-6 4 9 4-2-4-9h9z" fill="#fff" stroke="#111" strokeWidth="1.5" strokeLinejoin="round" />}
    </svg>
  );
};

// ------------------------------------------------------------------ composition
export const CompletionNote: React.FC<{ cursor?: boolean; anon?: boolean }> = ({ cursor = true, anon = false }) => {
  Object.assign(D, NAMED, anon ? ANON : {});
  const f = useCurrentFrame();
  const dim = interpolate(f, [K.m1, K.m1 + 10, K.sign - 4, K.sign + 4, K.back - 4, K.back + 6], [0, 1, 1, 1, 1, 0], clamp);
  const showCase = f < K.sign + 6 || f >= K.back - 6;
  return (
    <FontGate>
      <AbsoluteFill style={{ background: "#fff", overflow: "hidden" }}>
        {showCase && <CasePage f={f} />}
        {dim > 0 && f < K.back + 6 && <AbsoluteFill style={{ background: C.overlay, opacity: dim }} />}
        {f >= K.m1 && f < K.m2 + 6 && <Modal1 f={f} />}
        {f >= K.m2 && f < K.sign + 6 && <Modal2 f={f} />}
        {f >= K.sign && f < K.back + 6 && <SignScreen f={f} />}
        {cursor && <Pointer f={f} />}
      </AbsoluteFill>
    </FontGate>
  );
};
