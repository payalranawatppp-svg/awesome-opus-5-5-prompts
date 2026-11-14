/**
 * Mrs. Ortiz's referral page with a custom back-and-forth in Office Communication (Script 21 v2, beats 0:58–1:20).
 * Plate: the first frame of the user's recording (public/preop/plate-case.png). Every real name, email and phone on it is
 * redrawn with the story's demo data in the app's fonts and colours; the chat thread is rebuilt and animated:
 * Amanda (St. Andrew's) @mentions Barbara (Gentle Dental) → Barbara is typing → quoted reply with the X-ray attached
 * ("saved to the case") → thank-you → good luck. 1920×842, 14 s.
 */
import React from "react";
import { AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame } from "remotion";
import { FontGate } from "../effects";
import { FONT_UI } from "../theme";

export const CASECHAT_W = 1920;
export const CASECHAT_H = 842;
export const CASECHAT_DURATION = 420;
const FPS = 30;
const C = { ink: "#1C1F33", text: "#3A3F55", muted: "#6B7085", faint: "#9CA3AF", line: "#E7E8EE", sidebar: "#D9E8F8", sideInk: "#1F3B70", mention: "#0E7490", purple: "#774AEE", quote: "#F3F4F6", green: "#1FA463" };
const T: React.CSSProperties = { fontFamily: FONT_UI, position: "absolute", whiteSpace: "nowrap", lineHeight: 1.2 };
const sp = (f: number, a: number) => (f < a ? 0 : spring({ frame: f - a, fps: FPS, config: { damping: 18, stiffness: 170 } }));

const K = { type0: 24, send: 128, typing: 150, barbara: 196, thanks: 262, luck: 330 };
const AMANDA_MSG = " Mrs. Ortiz is in the chair. Could you attach her newest pano here?";

const Patch: React.FC<{ x: number; y: number; w: number; h: number; bg?: string; children?: React.ReactNode }> = ({ x, y, w, h, bg = "#fff", children }) => (
  <div style={{ position: "absolute", left: x, top: y, width: w, height: h, background: bg }}>{children}</div>
);
const Txt: React.FC<{ x: number; y: number; t: string; s?: number; w?: number; c?: string }> = ({ x, y, t, s = 18, w = 400, c = C.ink }) => (
  <div style={{ ...T, left: x, top: y, fontSize: s, fontWeight: w, color: c }}>{t}</div>
);
const Av: React.FC<{ i: string; c: string; s?: number }> = ({ i, c, s = 40 }) => (
  <div style={{ width: s, height: s, borderRadius: 10, background: c, color: "#fff", fontFamily: FONT_UI, fontWeight: 700, fontSize: s * 0.36, display: "flex", alignItems: "center", justifyContent: "center", flex: "none" }}>{i}</div>
);
const M: React.FC<{ t: string }> = ({ t }) => <span style={{ color: C.mention }}>@{t}</span>;

/** Page renames over the plate. */
const Renames: React.FC = () => (
  <>
    <Patch x={22} y={28} w={250} h={32} bg={C.sidebar}><Txt x={8} y={4} t="St. Andrew's Family Dental" s={19} w={600} c={C.sideInk} /></Patch>
    <Patch x={575} y={14} w={30} h={34} />
    <Patch x={826} y={30} w={182} h={26}><Txt x={2} y={3} t="St. Andrew's" s={16} c={C.text} /></Patch>
    <Patch x={1666} y={18} w={186} h={52}>
      <div style={{ position: "absolute", left: 2, top: 7 }}><Av i="AM" c="#D97706" s={36} /></div>
      <Txt x={46} y={4} t="Amanda" s={18} w={500} />
      <Txt x={46} y={27} t="Office Manager" s={16} c={C.muted} />
    </Patch>
    <Patch x={350} y={410} w={300} h={62}>
      <Txt x={2} y={3} t="St. Andrew's Family Dental" s={22} />
      <Txt x={2} y={34} t="Oral Surgeon" s={22} />
    </Patch>
    <Patch x={1040} y={386} w={300} h={242}>
      {["MARIA ORTIZ", "03/14/1962", "64", "She/Her", "Female", "555-014-2266", "m.ortiz@example.com"].map((v, i) => <Txt key={i} x={5} y={4 + i * 36} t={v} s={18} />)}
    </Patch>
    <Patch x={1441} y={391} w={240} h={20}><Txt x={2} y={1} t="Messaging with Gentle Dental" s={14} c={C.muted} /></Patch>
  </>
);

type Msg = { who: string; office: string; role: string; time: string; av: [string, string]; body: React.ReactNode; quote?: string; file?: boolean; at: number };
const HISTORY: Msg[] = [
  { who: "Barbara", office: "Gentle Dental", role: "Front Desk", time: "Nov 3, 9:12 AM", av: ["BA", "#2E7D5B"], body: <><M t="Tanya" /> Sending Maria Ortiz for an implant consult, #19. Her pano is attached.</>, at: -1 },
  { who: "Tanya", office: "St. Andrew's", role: "Front Desk", time: "Nov 3, 9:40 AM", av: ["TA", "#6D4AE8"], body: "Got it, thank you! Consult booked for Nov 14 at 10:00 AM.", at: -1 },
  { who: "Barbara", office: "Gentle Dental", role: "Front Desk", time: "Nov 3, 9:42 AM", av: ["BA", "#2E7D5B"], body: "Wonderful. She's a little nervous, so thank you for taking good care of her.", at: -1 },
];
const LIVE: Msg[] = [
  { who: "Amanda", office: "St. Andrew's", role: "Office Manager", time: "Nov 14, 9:03 AM", av: ["AM", "#D97706"], body: <><M t="Barbara" />{AMANDA_MSG}</>, at: K.send },
  { who: "Barbara", office: "Gentle Dental", role: "Front Desk", time: "Nov 14, 9:03 AM", av: ["BA", "#2E7D5B"], quote: "Amanda: Mrs. Ortiz is in the chair. Could you attach her newest pano here?", body: "Of course! Here's her newest pano, taken Nov 3.", file: true, at: K.barbara },
  { who: "Amanda", office: "St. Andrew's", role: "Office Manager", time: "Nov 14, 9:04 AM", av: ["AM", "#D97706"], body: "Got it, thank you! The doctor is reviewing it now.", at: K.thanks },
  { who: "Barbara", office: "Gentle Dental", role: "Front Desk", time: "Nov 14, 9:04 AM", av: ["BA", "#2E7D5B"], body: "Perfect. Tell her we said good luck!", at: K.luck },
];

const Bubble: React.FC<{ m: Msg }> = ({ m }) => {
  const f = useCurrentFrame();
  const k = m.at < 0 ? 1 : sp(f, m.at);
  return (
    <div style={{ display: "flex", gap: 14, padding: "10px 0", opacity: k, transform: `translateY(${(1 - k) * 18}px)` }}>
      <Av i={m.av[0]} c={m.av[1]} />
      <div style={{ flex: 1, fontFamily: FONT_UI }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
          <span style={{ fontWeight: 600, fontSize: 16, color: C.ink }}>{m.who} ({m.office})</span>
          <span style={{ fontSize: 14, color: C.muted }}>{m.role}</span>
        </div>
        <div style={{ fontSize: 14, color: C.muted, marginTop: 6 }}>{m.time}</div>
        {m.quote && <div style={{ marginTop: 6, padding: "6px 10px", borderLeft: `3px solid ${C.faint}`, background: C.quote, borderRadius: 4, fontSize: 14, color: C.muted, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: 330 }}>{m.quote}</div>}
        <div style={{ fontSize: 17, lineHeight: "24px", color: C.ink, marginTop: 4 }}>{m.body}</div>
        {m.file && (
          <div style={{ marginTop: 8, display: "flex", alignItems: "center", gap: 10, padding: 8, border: `1px solid ${C.line}`, borderRadius: 10, width: 300 }}>
            <Img src={staticFile("preop/newpano.png")} style={{ width: 74, height: 41, objectFit: "cover", borderRadius: 6 }} />
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: C.ink }}>pano-ortiz-nov-2026.jpg</div>
              <div style={{ fontSize: 13, color: C.green, fontWeight: 600 }}>✓ Saved to the case</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const Chat: React.FC = () => {
  const f = useCurrentFrame();
  const visible = [...HISTORY, ...LIVE.filter((m) => f >= m.at)];
  const typing = f >= K.typing && f < K.barbara;
  const typed = f < K.type0 ? "" : AMANDA_MSG.slice(0, Math.max(0, Math.floor((f - K.type0) * 0.72)));
  const composing = f >= K.type0 && f < K.send;
  const caret = Math.floor(f / 15) % 2 === 0;
  return (
    <>
      {/* thread area */}
      <Patch x={1426} y={418} w={446} h={384} />
      <div style={{ position: "absolute", left: 1443, top: 418, width: 362, height: 384, overflow: "hidden", display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
        {visible.map((m, i) => <Bubble key={i} m={m} />)}
        {typing && <div style={{ fontFamily: FONT_UI, fontSize: 14, color: C.muted, padding: "4px 0 8px 54px" }}>Barbara is typing{".".repeat(1 + (Math.floor(f / 8) % 3))}</div>}
      </div>
      {/* composer */}
      <Patch x={1441} y={805} w={414} h={36}>
        <div style={{ position: "absolute", left: 0, top: 0, width: 412, height: 36, border: `1.5px solid ${composing ? C.purple : C.line}`, borderRadius: 8, boxSizing: "border-box" }} />
        <div style={{ ...T, left: 12, top: 8, fontSize: 16, color: composing ? C.ink : C.faint, width: 390, overflow: "hidden" }}>
          {composing ? (() => {
            const full = "@Barbara" + typed;
            const show = full.length > 44 ? "…" + full.slice(-43) : full;
            const cut = full.length > 44 ? 0 : 8;
            return <span>{cut ? <><M t="Barbara" />{typed}</> : show}{caret && <span style={{ borderLeft: `1.5px solid ${C.ink}` }} />}</span>;
          })() : "Message Gentle Dental"}
        </div>
      </Patch>
      {f >= K.send && f < K.send + 30 && <div style={{ ...T, left: 1700, top: 778, fontSize: 13, color: C.green, fontWeight: 600, opacity: interpolate(f, [K.send, K.send + 6, K.send + 24, K.send + 30], [0, 1, 1, 0]) }}>Sent</div>}
    </>
  );
};

export const CaseChat: React.FC = () => (
  <FontGate>
    <AbsoluteFill style={{ background: "#fff" }}>
      <Img src={staticFile("preop/plate-case.png")} style={{ position: "absolute", left: 0, top: 0, width: CASECHAT_W, height: CASECHAT_H }} />
      <Renames />
      <Chat />
      <div style={{ position: "absolute", left: 1811, top: 752, width: 62, height: 62, borderRadius: 62, background: C.purple, boxShadow: "0 8px 20px rgba(119,74,238,0.35)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 5h16v11H8l-4 4z" /><path d="M8 10h8M8 13h5" /></svg>
      </div>
    </AbsoluteFill>
  </FontGate>
);
