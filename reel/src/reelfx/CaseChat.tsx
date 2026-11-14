/**
 * Mrs. Ortiz's referral page with a custom back-and-forth in Office Communication (Script 21 v2, beats 0:58–1:20).
 * Plate: a frame of the user's reply-flow recording (public/preop/plate-case2.png). Every real name, email and phone on
 * it is redrawn with the story's demo data in the app's fonts and colours; the chat thread and composer are rebuilt and
 * animated the way the app replies to a message:
 *   Amanda @mentions Barbara → Barbara is typing → Barbara replies (quote block + X-ray "saved to the case") →
 *   Amanda hovers Barbara's message → trash / reply pill → clicks reply → "Replying to Barbara (Gentle Dental)" bar →
 *   types → sends (her message carries the quote block) → Barbara: good luck. 1920×842, 500 frames.
 */
import React from "react";
import { AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame } from "remotion";
import { FontGate } from "../effects";
import { FONT_UI } from "../theme";

export const CASECHAT_W = 1920;
export const CASECHAT_H = 842;
export const CASECHAT_DURATION = 500;
const FPS = 30;
const C = {
  ink: "#1C1F33", text: "#3A3F55", muted: "#6B7085", faint: "#A3A6B1", line: "#E5E7EB", divider: "#E6E6E6",
  mention: "#19557A", purple: "#774AEE", purpleOff: "#B6A2F4", focus: "#8B5CF6", quoteBg: "#F3F4F7", quoteEdge: "#C9C0EC",
  replyBg: "#F6F4FE", replyEdge: "#9F8ACD", hover: "#F7F7F9", strip: "#F9F9F9", green: "#1FA463", avBg: "#EDF2F8",
};
const T: React.CSSProperties = { fontFamily: FONT_UI, position: "absolute", whiteSpace: "nowrap", lineHeight: 1.2 };
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const sp = (f: number, a: number) => (f < a ? 0 : spring({ frame: f - a, fps: FPS, config: { damping: 18, stiffness: 170 } }));

// Timeline (frames)
const K = { click: 12, type0: 20, send: 118, typing: 140, barbara: 186, hover: 236, click2: 262, type1: 274, send2: 352, typing2: 372, luck: 416 };
const CPF = 0.72;
const MSG1 = " Mrs. Ortiz is in the chair. Could you attach her newest pano here?";
const MSG2 = "Got it, thank you! Dr. Vance is reviewing it now.";
const B_TEXT = "Of course! Here's her newest pano, taken Nov 3.";

const Patch: React.FC<{ x: number; y: number; w: number; h: number; bg?: string; children?: React.ReactNode }> = ({ x, y, w, h, bg = "#fff", children }) => (
  <div style={{ position: "absolute", left: x, top: y, width: w, height: h, background: bg }}>{children}</div>
);
const Txt: React.FC<{ x: number; y: number; t: string; s?: number; w?: number; c?: string }> = ({ x, y, t, s = 18, w = 400, c = C.ink }) => (
  <div style={{ ...T, left: x, top: y, fontSize: s, fontWeight: w, color: c }}>{t}</div>
);
const Svg: React.FC<{ d: string; s?: number; c?: string; w?: number }> = ({ d, s = 18, c = C.muted, w = 2 }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round"><path d={d} /></svg>
);
const I_AT = "M16 12a4 4 0 1 0-8 0 4 4 0 0 0 8 0zm0 0v1.5a2.5 2.5 0 0 0 5 0V12a9 9 0 1 0-9 9h4";
const I_SMILE = "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM8 14s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01";
const I_SEND = "M22 2 11 13M22 2l-7 20-4-9-9-4z";
const I_TRASH = "M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6M10 11v6M14 11v6";
const I_REPLY = "M9 14 4 9l5-5M4 9h11a5 5 0 0 1 5 5v6";
const I_X = "M18 6 6 18M6 6l12 12";
const M: React.FC<{ t: string }> = ({ t }) => <span style={{ color: C.mention }}>@{t}</span>;

/** Office logo tile, as the app shows next to each message. */
const Logo: React.FC<{ i: string; c: string }> = ({ i, c }) => (
  <div style={{ width: 40, height: 40, borderRadius: 8, background: C.avBg, display: "flex", alignItems: "center", justifyContent: "center", flex: "none", fontFamily: FONT_UI, fontWeight: 800, fontSize: 13, letterSpacing: "0.02em", color: c }}>{i}</div>
);
const GD: [string, string] = ["GD", "#2E7D5B"];
const SA: [string, string] = ["SA", "#6D4AE8"];

/** Page renames over the plate. */
const Renames: React.FC = () => (
  <>
    <Patch x={350} y={84} w={330} h={64}>
      <Txt x={2} y={3} t="St. Andrew's Family Dental" s={22} />
      <Txt x={2} y={34} t="Dr. Vance, Oral Surgeon" s={22} />
    </Patch>
    <Patch x={1040} y={60} w={330} h={248}>
      {["MARIA ORTIZ", "03/14/1962", "64", "She/Her", "Female", "555-014-2266", "m.ortiz@example.com"].map((v, i) => <Txt key={i} x={5} y={4 + i * 36} t={v} s={18} />)}
    </Patch>
    <Patch x={400} y={524} w={300} h={64}>
      <Txt x={2} y={3} t="Implant Consultation" s={18} w={600} />
      <Txt x={2} y={40} t="Tooth: #19" s={16} c={C.text} />
    </Patch>
    <Patch x={1441} y={66} w={300} h={21}><Txt x={2} y={2} t="Messaging with Gentle Dental" s={14} c={C.muted} /></Patch>
  </>
);

type Msg = { who: string; office: string; role: string; time: string; logo: [string, string]; body: React.ReactNode; quote?: [string, string]; file?: boolean; at: number; id?: string };
const HISTORY: Msg[] = [
  { who: "Barbara", office: "Gentle Dental", role: "Front Desk Coordinator", time: "Nov 3, 9:12 AM", logo: GD, body: <><M t="Tanya" /> Sending Maria Ortiz for an implant consult, #19. Her pano is attached.</>, at: -1 },
  { who: "Tanya", office: "St. Andrew's", role: "Front Desk Coordinator", time: "Nov 3, 9:40 AM", logo: SA, body: "Got it, thank you! Consult booked for Nov 14 at 10:00 AM.", at: -1 },
  { who: "Barbara", office: "Gentle Dental", role: "Front Desk Coordinator", time: "Nov 3, 9:42 AM", logo: GD, body: "Wonderful. She's a little nervous, so thank you for taking good care of her.", at: -1 },
];
const LIVE: Msg[] = [
  { who: "Amanda", office: "St. Andrew's", role: "Office Manager / Treatment Coordinator", time: "9:03 AM", logo: SA, body: <><M t="Barbara" />{MSG1}</>, at: K.send },
  { id: "barb", who: "Barbara", office: "Gentle Dental", role: "Front Desk Coordinator", time: "9:03 AM", logo: GD, quote: ["Amanda (St. Andrew's)", "@Barbara" + MSG1], body: B_TEXT, file: true, at: K.barbara },
  { who: "Amanda", office: "St. Andrew's", role: "Office Manager / Treatment Coordinator", time: "9:04 AM", logo: SA, quote: ["Barbara (Gentle Dental)", B_TEXT], body: MSG2, at: K.send2 },
  { who: "Barbara", office: "Gentle Dental", role: "Front Desk Coordinator", time: "9:04 AM", logo: GD, body: "Perfect. Tell her we said good luck!", at: K.luck },
];

const Quote: React.FC<{ q: [string, string] }> = ({ q }) => (
  <div style={{ marginTop: 6, padding: "4px 10px 5px", borderLeft: `2px solid ${C.quoteEdge}`, background: C.quoteBg, borderRadius: 4, maxWidth: 322 }}>
    <div style={{ fontSize: 14, fontWeight: 500, color: C.text, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{q[0]}</div>
    <div style={{ fontSize: 14, color: C.muted, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{q[1]}</div>
  </div>
);

const Bubble: React.FC<{ m: Msg; hovered: boolean; pressed: boolean }> = ({ m, hovered, pressed }) => {
  const f = useCurrentFrame();
  const k = m.at < 0 ? 1 : sp(f, m.at);
  return (
    <div style={{ position: "relative", display: "flex", gap: 23, padding: "9px 10px 9px 13px", margin: "0 -10px 0 -13px", borderRadius: 8, background: hovered ? C.hover : "transparent", opacity: k, transform: `translateY(${(1 - k) * 18}px)` }}>
      <Logo i={m.logo[0]} c={m.logo[1]} />
      <div style={{ flex: 1, minWidth: 0, fontFamily: FONT_UI }}>
        <div style={{ fontWeight: 600, fontSize: 16, color: C.ink, whiteSpace: "nowrap" }}>{m.who} ({m.office})</div>
        <div style={{ fontSize: 13, color: C.muted, marginTop: 7, whiteSpace: "nowrap" }}>{m.role}&nbsp;&nbsp;{m.time}</div>
        {m.quote && <Quote q={m.quote} />}
        <div style={{ fontSize: 17, lineHeight: "25px", color: C.ink, marginTop: 3 }}>{m.body}</div>
        {m.file && (
          <div style={{ marginTop: 7, display: "flex", alignItems: "center", gap: 10, padding: 7, border: `1px solid ${C.line}`, borderRadius: 10, width: 300, background: "#fff" }}>
            <Img src={staticFile("preop/newpano.png")} style={{ width: 70, height: 39, objectFit: "cover", borderRadius: 6 }} />
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: C.ink }}>pano-ortiz-nov-2026.jpg</div>
              <div style={{ fontSize: 13, color: C.green, fontWeight: 600 }}>✓ Saved to the case</div>
            </div>
          </div>
        )}
      </div>
      {hovered && (
        <div style={{ position: "absolute", right: 10, top: 34, display: "flex", gap: 6 }}>
          {[I_TRASH, I_REPLY].map((d, i) => (
            <div key={i} style={{ width: 34, height: 32, borderRadius: 7, background: i === 1 && pressed ? "#EFEAFD" : "#fff", border: `1px solid ${C.line}`, boxShadow: "0 1px 3px rgba(0,0,0,0.08)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Svg d={d} s={17} c={i === 1 && pressed ? C.purple : C.text} w={1.8} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const Chat: React.FC = () => {
  const f = useCurrentFrame();
  const visible = [...HISTORY, ...LIVE.filter((m) => f >= m.at)];
  const replying = f >= K.click2 && f < K.send2;
  const kBar = replying ? sp(f, K.click2) : 0;
  const threadBottom = 462 - 58 * kBar;
  const typing = (f >= K.typing && f < K.barbara) || (f >= K.typing2 && f < K.luck);
  const hoverOn = f >= K.hover && f < K.click2 + 10;
  // composer text
  let typed: React.ReactNode = null; let hasText = false;
  if (f >= K.type0 && f < K.send) { const t = MSG1.slice(0, Math.max(0, Math.floor((f - K.type0) * CPF))); typed = <><M t="Barbara" />{t}</>; hasText = true; }
  if (f >= K.type1 && f < K.send2) { const t = MSG2.slice(0, Math.max(0, Math.floor((f - K.type1) * CPF))); typed = t; hasText = t.length > 0; }
  const focused = (f >= K.click && f < K.send) || (f >= K.click2 && f < K.send2);
  const caret = focused && Math.floor(f / 15) % 2 === 0;
  const sendPress = [K.send, K.send2].some((s) => f >= s - 4 && f < s);
  return (
    <>
      {/* thread */}
      <Patch x={1426} y={99} w={446} h={363} />
      <div style={{ position: "absolute", left: 1443, top: 99, width: 410, height: threadBottom - 99, overflow: "hidden", display: "flex", flexDirection: "column", justifyContent: "flex-end", paddingLeft: 13, marginLeft: -13, paddingRight: 3 }}>
        {visible.map((m, i) => <Bubble key={i} m={m} hovered={m.id === "barb" && hoverOn} pressed={m.id === "barb" && f >= K.click2 - 2} />)}
        {typing && <div style={{ fontFamily: FONT_UI, fontSize: 14, color: C.muted, padding: "2px 0 8px 63px" }}>Barbara is typing{".".repeat(1 + (Math.floor(f / 8) % 3))}</div>}
      </div>
      {/* scrollbar */}
      <div style={{ position: "absolute", left: 1858, top: 318 - 58 * kBar, width: 8, height: threadBottom - 340 + 58 * kBar, borderRadius: 4, background: "#8A8A8A" }} />
      <svg style={{ position: "absolute", left: 1856, top: 104 }} width="12" height="8" viewBox="0 0 12 8"><path d="M6 1 11 7H1z" fill="#898989" /></svg>
      <svg style={{ position: "absolute", left: 1856, top: threadBottom - 13 }} width="12" height="8" viewBox="0 0 12 8"><path d="M6 7 11 1H1z" fill="#898989" /></svg>
      <div style={{ position: "absolute", left: 1424, top: threadBottom, width: 449, height: 1, background: C.divider }} />
      {/* replying-to bar */}
      {kBar > 0 && (
        <div style={{ position: "absolute", left: 1438, top: 412 + (1 - kBar) * 30, width: 422, height: 52, borderRadius: 6, background: C.replyBg, borderLeft: `2px solid ${C.replyEdge}`, opacity: kBar, fontFamily: FONT_UI, boxSizing: "border-box" }}>
          <div style={{ ...T, left: 12, top: 7, fontSize: 14, fontWeight: 600, color: C.text }}>Replying to Barbara (Gentle Dental)</div>
          <div style={{ ...T, left: 12, top: 27, fontSize: 14, color: C.muted, width: 360, overflow: "hidden", textOverflow: "ellipsis" }}>{B_TEXT}</div>
          <div style={{ position: "absolute", right: 14, top: 9 }}><Svg d={I_X} s={15} c={C.muted} /></div>
        </div>
      )}
      {/* composer */}
      <Patch x={1436} y={472} w={428} h={110} />
      <div style={{ position: "absolute", left: 1439, top: 478, width: 421, height: 101, borderRadius: 8, overflow: "hidden", boxShadow: `inset 0 0 0 ${focused ? 2 : 1}px ${focused ? C.focus : C.line}`, background: "#fff" }}>
        <div style={{ position: "absolute", left: 2, right: 2, top: 55, bottom: 2, background: C.strip, borderTop: `1px solid ${C.line}` }} />
        <div style={{ position: "absolute", left: 14, top: 8, width: 390, height: 44, fontFamily: FONT_UI, fontSize: 16, lineHeight: "22px", color: C.ink, overflow: "hidden", display: "flex", flexDirection: "column", justifyContent: "flex-start" }}>
          {typed ? <span>{typed}{caret && <span style={{ borderLeft: `1.5px solid ${C.ink}`, marginLeft: 1 }} />}</span> : <span style={{ color: C.faint }}>{caret && <span style={{ borderLeft: `1.5px solid ${C.ink}`, marginRight: 1 }} />}Message Gentle Dental</span>}
        </div>
        <div style={{ position: "absolute", left: 18, top: 68 }}><Svg d={I_AT} s={19} c={C.muted} /></div>
        <div style={{ position: "absolute", left: 56, top: 68 }}><Svg d={I_SMILE} s={19} c={C.muted} /></div>
        <div style={{ position: "absolute", left: 375, top: 60, width: 36, height: 34, borderRadius: 6, background: hasText ? C.purple : C.purpleOff, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${sendPress ? 0.92 : 1})` }}>
          <Svg d={I_SEND} s={18} c="#fff" />
        </div>
      </div>
      {[K.send, K.send2].map((s) => f >= s && f < s + 30 && (
        <div key={s} style={{ ...T, left: 1440, top: 585, fontSize: 13, color: C.green, fontWeight: 600, background: "#fff", paddingRight: 8, opacity: interpolate(f, [s, s + 6, s + 24, s + 30], [0, 1, 1, 0], clamp) }}>Sent</div>
      ))}
    </>
  );
};

/** Pointer: composer → send → Barbara's message → reply icon → (types) → send. */
const PATH: [number, number, number][] = [[0, 1220, 560], [12, 1600, 505], [100, 1600, 505], [114, 1832, 557], [200, 1832, 557], [236, 1700, 330], [252, 1700, 330], [262, 1816, 284], [300, 1816, 284], [346, 1832, 557], [420, 1832, 557], [470, 1300, 640]];
const Cursor: React.FC<{ hand: boolean }> = ({ hand }) => {
  const f = useCurrentFrame();
  let i = PATH.findIndex((p) => p[0] > f); if (i < 0) i = PATH.length; const a = PATH[Math.max(0, i - 1)], b = PATH[Math.min(PATH.length - 1, i)];
  const t = b[0] === a[0] ? 1 : Math.min(1, (f - a[0]) / (b[0] - a[0]));
  const e = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
  const x = a[1] + (b[1] - a[1]) * e, y = a[2] + (b[2] - a[2]) * e;
  const down = [K.click, K.send - 4, K.click2 - 2, K.send2 - 4].some((c) => f >= c && f < c + 4);
  return (
    <svg style={{ position: "absolute", left: x, top: y, transform: `scale(${down ? 0.85 : 1})`, transformOrigin: "0 0" }} width="22" height="30" viewBox="0 0 22 30">
      {hand ? <path d="M8 13V3.5a2 2 0 0 1 4 0V12m0-1.5a2 2 0 0 1 4 0V13m0-1a2 2 0 0 1 4 0v6.5A8.5 8.5 0 0 1 11.5 27h-1A7.5 7.5 0 0 1 4 23l-3-5.5a2 2 0 0 1 3.4-2L8 19" fill="#fff" stroke="#111" strokeWidth="1.4" strokeLinejoin="round" /> : <path d="M1 1v24l6-6 4 9 4-2-4-9h9z" fill="#fff" stroke="#111" strokeWidth="1.5" strokeLinejoin="round" />}
    </svg>
  );
};

const Pointer: React.FC = () => {
  const f = useCurrentFrame();
  const hand = (f >= 108 && f < 122) || (f >= 254 && f < 270) || (f >= 340 && f < 356);
  return <Cursor hand={hand} />;
};

export const CaseChat: React.FC<{ cursor?: boolean }> = ({ cursor = true }) => (
  <FontGate>
    <AbsoluteFill style={{ background: "#fff" }}>
      <Img src={staticFile("preop/plate-case2.png")} style={{ position: "absolute", left: 0, top: 0, width: CASECHAT_W, height: CASECHAT_H }} />
      <Renames />
      <Chat />
      {cursor && <Pointer />}
    </AbsoluteFill>
  </FontGate>
);
