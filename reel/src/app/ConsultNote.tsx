/** "Prepare Consultation Note" modal (rich-text editor + DocuSign footer) and the green success toast, matched to the
 * dashboard-2 recording. Viewport coordinates (the modal is fixed, it doesn't scroll with the page). */
import React from "react";
import { Img, staticFile } from "remotion";
import { C, FONT } from "./AppShell";

const ico = (d: string, c = "#1F2937", s = 20) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d={d} /></svg>;
const At: React.FC<{ x: number; cy: number; children: React.ReactNode; s?: number }> = ({ x, cy, children, s = 20 }) => <div style={{ position: "absolute", left: x - s / 2, top: cy - s / 2, width: s, height: s }}>{children}</div>;
const T: React.FC<{ x: number; cy: number; s: number; w?: number; c?: string; children: React.ReactNode }> = ({ x, cy, s, w = 400, c = C.text, children }) => (
  <div style={{ position: "absolute", left: x, top: cy - s * 0.7 - 1, font: `${w} ${s}px ${FONT}`, color: c, lineHeight: `${s * 1.4}px`, whiteSpace: "nowrap" }}>{children}</div>
);
const Sel: React.FC<{ x: number; y: number; w: number; h: number; t: string; s?: number; c?: string; px?: number }> = ({ x, y, w, h, t, s = 19, c = C.text, px = 12 }) => (
  <div style={{ position: "absolute", left: x, top: y, width: w, height: h, border: `1px solid ${C.inputBorder}`, borderRadius: 6, boxSizing: "border-box", background: "#fff", display: "flex", alignItems: "center", justifyContent: "space-between", padding: `0 ${px - 4}px 0 ${px}px`, font: `400 ${s}px ${FONT}`, color: c }}>{t}{ico("M6 9l6 6 6-6", "#111", 18)}</div>
);
const Btn: React.FC<{ x: number; w: number; t: React.ReactNode; primary?: boolean; disabled?: boolean }> = ({ x, w, t, primary, disabled }) => (
  <div style={{ position: "absolute", left: x, top: 755, width: w, height: 51, borderRadius: 4, boxSizing: "border-box", border: primary ? "none" : `1.5px solid ${disabled ? "#C9BBFB" : C.purple}`, background: primary ? (disabled ? "#A98BF5" : C.purple) : "#fff", color: primary ? "#fff" : disabled ? "#A98BF5" : C.purpleText, font: `500 19.5px ${FONT}`, display: "flex", alignItems: "center", justifyContent: "center", gap: 10, whiteSpace: "nowrap" }}>{t}</div>
);

export const NOTE_LINES = ["{{completionDate}}", "{{referringDoctorName}}", "{{referringDoctorAddress}}", "", "", "Re: {{patientName}} {{patientDob}}", "", "Dear {{referringDoctorName}},", "", "Thank you for referring {{patientName}} to our office for treatment."];

export const ConsultNoteModal: React.FC<{ lines?: string[]; state?: "ready" | "preparing"; backdrop?: boolean }> = ({ lines = NOTE_LINES, state = "preparing", backdrop = true }) => {
  const busy = state === "preparing";
  return (
    <>
      {backdrop && <div style={{ position: "absolute", inset: 0, background: "rgba(17,24,39,.5)" }} />}
      <div style={{ position: "absolute", left: 311, top: 43, width: 1280, height: 783, background: "#fff", borderRadius: 8, overflow: "hidden", boxShadow: "0 20px 50px rgba(0,0,0,.25)" }} />
      <T x={341} cy={80} s={24.6} w={600}>Prepare Consultation Note</T>
      <T x={341} cy={116} s={17.3} c="#4B5563">Review, edit, and sign the consultation note before sending it.</T>
      <div style={{ position: "absolute", left: 311, top: 148, width: 1280, height: 1, background: C.border }} />
      <T x={341} cy={191} s={17.5} w={500} c="#374151">Template</T>
      <Sel x={341} y={214} w={481} h={48} t="General" s={19.5} c="#6B7280" px={20} />
      <div style={{ position: "absolute", left: 1415, top: 220, width: 127, height: 42, borderRadius: 4, border: "1.5px solid #C9BBFB", boxSizing: "border-box", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, font: `500 17.5px ${FONT}`, color: "#A98BF5" }}>{ico("M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12zM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z", "#A98BF5", 18)}Preview</div>
      {/* editor */}
      <div style={{ position: "absolute", left: 341, top: 282, width: 1201, height: 470, border: `1px solid ${C.border}`, borderRadius: 6, boxSizing: "border-box", overflow: "hidden" }}>
        <div style={{ position: "absolute", left: 0, top: 0, right: 0, height: 106, background: "#F9FAFB", borderBottom: `1px solid ${C.border}` }} />
      </div>
      {[402, 598, 753, 873, 980, 1130, 1191, 765].map((x, i) => <div key={i} style={{ position: "absolute", left: x, top: i === 7 ? 346 : 297, width: 1, height: 32, background: "#D1D5DB" }} />)}
      <At x={372} cy={313}>{ico("M9 14L4 9l5-5M4 9h10.5a5.5 5.5 0 0 1 0 11H11")}</At>
      <T x={425} cy={313} s={19} w={700} c="#1F2937">B</T>
      <At x={478} cy={313}>{ico("M16 18l6-6-6-6M8 6l-6 6 6 6M14 4l-4 16")}</At>
      <At x={523} cy={313}>{ico("M4 6h16M4 12h16M4 18h16")}</At>
      <At x={568} cy={313}>{ico("M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.7 1.7M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.7-1.7")}</At>
      <Sel x={610} y={296} w={132} h={34} t="Paragraph" s={16.3} c="#111" px={13} />
      <Sel x={764} y={296} w={99} h={34} t="Size" s={16.8} c="#111" px={13} />
      <At x={904} cy={313}>{ico("M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01")}</At>
      <T x={941} cy={313} s={19} w={700} c="#1F2937">#</T>
      <At x={1010} cy={313}>{ico("M3 6h18M3 12h12M3 18h16")}</At>
      <At x={1055} cy={313}>{ico("M3 6h18M3 12h18M3 18h18")}</At>
      <At x={1100} cy={313}>{ico("M3 6h18M9 12h12M5 18h16")}</At>
      <At x={1161} cy={313}>{ico("M3 5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2zM8.5 10a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zM21 15l-5-5L5 21")}</At>
      <Sel x={353} y={343} w={401} h={35} t="Insert Variable..." s={17.4} c="#111" px={14} />
      <div style={{ position: "absolute", left: 382, top: 428, width: 1140, height: 304, overflow: "hidden", font: `400 19.8px ${FONT}`, color: C.text, lineHeight: "30px" }}>
        {lines.map((l, i) => <div key={i} style={{ height: 30 }}>{l}</div>)}
      </div>
      {/* modal scrollbar */}
      <svg width="12" height="9" viewBox="0 0 12 9" style={{ position: "absolute", left: 1576, top: 155 }}><path d="M1 8h10L6 1z" fill="#6B6B6B" /></svg>
      <div style={{ position: "absolute", left: 1576, top: 172, width: 11, height: 233, borderRadius: 6, background: "#8F8F8F" }} />
      <svg width="12" height="9" viewBox="0 0 12 9" style={{ position: "absolute", left: 1576, top: 718 }}><path d="M1 1h10L6 8z" fill="#6B6B6B" /></svg>
      {/* footer */}
      <div style={{ position: "absolute", left: 311, top: 733, width: 1280, height: 1, background: C.border }} />
      <Img src={staticFile("app/docusign-logo.png")} style={{ position: "absolute", left: 338, top: 762, width: 132 }} />
      <Btn x={637} w={108} t="Cancel" disabled={busy} />
      <Btn x={760} w={141} t="Save Draft" disabled={busy} />
      <Btn x={916} w={178} t="Save Changes" disabled={busy} />
      <Btn x={1109} w={256} t="Save as New Template" disabled={busy} />
      <Btn x={1380} w={181} primary disabled={busy} t={busy ? <><span style={{ width: 16, height: 16, borderRadius: 16, border: "2.5px solid rgba(255,255,255,.45)", borderTopColor: "#fff", boxSizing: "border-box" }} />Preparing...</> : "Sign and Send Completion Note"} />
    </>
  );
};

export const SuccessToast: React.FC<{ title?: string; text?: string[]; x?: number; y?: number }> = ({ title = "Success", text = ["Status updated successfully! A notification has been", "created."], x = 1383, y = 40 }) => (
  <div style={{ position: "absolute", left: x, top: y, width: 478, height: 101, background: "#F0FDF4", border: "1px solid #BBF7D0", borderRadius: 6, boxSizing: "border-box", boxShadow: "0 4px 12px rgba(0,0,0,.08)", fontFamily: FONT }}>
    <div style={{ position: "absolute", left: 19, top: 16, font: `600 17.5px ${FONT}`, color: "#166534" }}>{title}</div>
    <div style={{ position: "absolute", left: 19, top: 45, width: 400, font: `400 15px ${FONT}`, color: "#166534", lineHeight: "20px" }}>{text.map((t) => <div key={t}>{t}</div>)}</div>
    <div style={{ position: "absolute", right: 22, top: 26 }}>{ico("M18 6L6 18M6 6l12 12", "#166534", 16)}</div>
  </div>
);
