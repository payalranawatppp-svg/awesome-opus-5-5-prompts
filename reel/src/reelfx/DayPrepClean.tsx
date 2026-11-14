/**
 * The Provider's Day-Prep Station, cleaned for Script 21 v2 "No More Phone Tag" (user's screen recording 2026-11-14,
 * screen-capture_6.webm). The recording's own frame is the plate (public/preop/plate.png): layout, colours, X-ray,
 * thumbnails and chrome stay pixel-for-pixel. Only the text that carried real names is redrawn on top, in Inter at the
 * app's sizes and Tailwind-gray colours, and the Administrative Notes panel is rebuilt so the note can be retyped.
 *
 * Renames (story names from the user's cast list, 2026-11-14: Dr. Vance is the oral surgeon):
 *   provider dropdown "Lee Davis" → "Dr. Vance" · patient "JONATHAN KILBOURN (10/11/1994)" → "MARIA ORTIZ (03/14/1962)"
 *   referring office "The Dental Center" → "Gentle Dental" · "REFERRING DOCTOR Gary Charlson, DDS" → "REFERRED BY Barbara · Gentle Dental"
 *   referred for "Implant Restoration: #4" → "Implant Consultation: #19" · mention list "Davis General Dentistry / Lee Davis,
 *   Barbara Smith, Jane White" → "St. Andrew's Family Dental / Amanda, Tanya, Greg" · note author "Lee Davis" → "Dr. Vance"
 *   note "@Barbara Smith these are old pano scand i need the latest one!" → a professional note to @Amanda.
 *
 * DayPrepClean (1920×842, 16 s): idle → @ → mention list → @Amanda → typed note → Add → note posted → Amanda's reply note
 * → the newest pano arrives (new thumbnail, main image swaps, "taken Nov 2026"). Sub-ranges are cut in the episode edit.
 */
import React from "react";
import { AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame } from "remotion";
import { FontGate } from "../effects";
import { FONT_UI } from "../theme";

export const DAYPREP_W = 1920;
export const DAYPREP_H = 842;
export const DAYPREP_DURATION = 640;
const FPS = 30;
const C = {
  page: "#101725", panel: "#1f2835", border: "#374151", cardBorder: "#4c5361", drop: "#384050",
  white: "#F9FAFB", gray300: "#D1D5DB", gray400: "#9CA3AF", purple: "#774AEE", purpleDim: "#443089",
  focus: "#8B5CF6", mention: "#8B7CF6", menuBg: "#F9F9F9", menuSel: "#F4F0FD", menuInk: "#111827", menuSub: "#6B7280",
  badgeBg: "#0E4F5C", badgeInk: "#5EEAD4", quoteBg: "#283243", replyBg: "#28264A", hoverCard: "#263142",
};
const T: React.CSSProperties = { fontFamily: FONT_UI, position: "absolute", whiteSpace: "nowrap", lineHeight: 1.2 };
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const sp = (f: number, a: number) => (f < a ? 0 : spring({ frame: f - a, fps: FPS, config: { damping: 18, stiffness: 180 } }));

// ---------------------------------------------------------------------------------------------------
// Timeline (frames)
const K = { click: 32, at: 42, menu: 46, mhover: 62, pick: 74, type0: 82, add: 284, posted: 300, onit: 336, thumb: 396, swap: 412, reply: 440, hover: 470, rclick: 486, type1: 496, add2: 552, posted2: 568 };
const NOTE2 = "Thanks, Amanda. Bringing her back now.";
const NOTE = " Mrs. Ortiz's newest pano isn't on file. Ours is from 2022. Could you request it from Gentle Dental before her 10:00 consult?";
const CPF = 0.62; // characters per frame while typing

// ---------------------------------------------------------------------------------------------------

const Patch: React.FC<{ x: number; y: number; w: number; h: number; bg: string; r?: number; children?: React.ReactNode }> = ({ x, y, w, h, bg, r = 0, children }) => (
  <div style={{ position: "absolute", left: x, top: y, width: w, height: h, background: bg, borderRadius: r }}>{children}</div>
);
const Chevron: React.FC<{ x: number; y: number }> = ({ x, y }) => (
  <svg style={{ position: "absolute", left: x, top: y }} width="12" height="8" viewBox="0 0 12 8"><path d="M1 1.5 6 6.5 11 1.5" stroke="#E5E7EB" strokeWidth="2" fill="none" /></svg>
);
const Label: React.FC<{ x: number; y: number; t: string }> = ({ x, y, t }) => (
  <div style={{ ...T, left: x, top: y, fontSize: 13, fontWeight: 500, letterSpacing: "0.04em", color: C.gray400 }}>{t}</div>
);
const Val: React.FC<{ x: number; y: number; t: string; w?: number }> = ({ x, y, t, w = 500 }) => (
  <div style={{ ...T, left: x, top: y, fontSize: 16, fontWeight: w, color: C.white }}>{t}</div>
);

/** Left card + top bar renames over the plate. */
const Renames: React.FC = () => (
  <>
    {/* provider dropdown */}
    <Patch x={313} y={17} w={123} h={34} bg={C.drop} r={4}>
      <div style={{ ...T, left: 11, top: 8, fontSize: 16, fontWeight: 500, color: C.white }}>Dr. Vance</div>
      <Chevron x={107} y={13} />
    </Patch>
    {/* patient dropdown */}
    <Patch x={761} y={17} w={433} h={34} bg={C.drop} r={4}>
      <div style={{ ...T, left: 18, top: 7, fontSize: 16, fontWeight: 500, color: C.white }}>MARIA ORTIZ (03/14/1962) — Consultation</div>
      <Chevron x={416} y={13} />
    </Patch>
    {/* card values (card interior bg = page) */}
    <Patch x={30} y={158} w={410} h={50} bg={C.page} />
    <Val x={37} y={161} t="MARIA" w={700} />
    <Val x={37} y={183} t="ORTIZ" w={700} />
    <div style={{ ...T, left: 93, top: 185, fontSize: 11, fontWeight: 700, letterSpacing: "0.06em", color: C.badgeInk, background: C.badgeBg, padding: "2px 8px", borderRadius: 999 }}>CONSULTATION</div>
    <Val x={243} y={161} t="03/14/1962 (Age 64)" w={400} />
    <Patch x={30} y={218} w={410} h={42} bg={C.page} />
    <Label x={37} y={220} t="REFERRING OFFICE" />
    <Val x={37} y={238} t="Gentle Dental" w={400} />
    <Label x={243} y={220} t="REFERRED BY" />
    <Val x={243} y={238} t="Barbara · Gentle Dental" w={400} />
    <Patch x={30} y={290} w={340} h={24} bg={C.page} />
    <Val x={37} y={292} t="Implant Consultation: #19" w={400} />
  </>
);

const Icon: React.FC<{ d: string; x: number; y: number; s?: number; c?: string }> = ({ d, x, y, s = 20, c = C.gray400 }) => (
  <svg style={{ position: "absolute", left: x, top: y }} width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d={d} /></svg>
);
const I_AT = "M16 12a4 4 0 1 0-8 0 4 4 0 0 0 8 0zm0 0v1.5a2.5 2.5 0 0 0 5 0V12a9 9 0 1 0-9 9h4";
const I_SMILE = "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM8 14s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01";
const I_PEN = "M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z";
const I_TRASH = "M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6";
const I_REPLY = "M9 14 4 9l5-5M4 9h11a5 5 0 0 1 5 5v6";
const I_X = "M18 6 6 18M6 6l12 12";

type Note = { who: string; when: string; body: React.ReactNode; h: number; quote?: [string, string] };
const QuoteBox: React.FC<{ q: [string, string]; w: number }> = ({ q, w }) => (
  <div style={{ width: w, boxSizing: "border-box", padding: "4px 10px 5px", borderLeft: `2px solid ${C.mention}`, background: C.quoteBg, borderRadius: 4, fontFamily: FONT_UI }}>
    <div style={{ fontSize: 13.5, fontWeight: 600, color: C.gray300, whiteSpace: "nowrap" }}>{q[0]}</div>
    <div style={{ fontSize: 13.5, color: C.gray400, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{q[1]}</div>
  </div>
);
const NoteCard: React.FC<{ n: Note; y: number; k?: number; hover?: boolean; pressed?: boolean }> = ({ n, y, k = 1, hover = false, pressed = false }) => {
  const qh = n.quote ? 52 : 0;
  return (
    <div style={{ position: "absolute", left: 1484, top: y, width: 404, height: n.h + qh, borderRadius: 8, background: hover ? C.hoverCard : C.panel, opacity: k, transform: `translateY(${(1 - k) * -14}px)` }}>
      <div style={{ ...T, left: 13, top: 18, fontSize: 13.5, fontWeight: 400, color: C.gray400 }}>{n.who} · {n.when}</div>
      {hover && <div style={{ position: "absolute", left: 302, top: 10, width: 30, height: 30, borderRadius: 6, background: pressed ? "#3B3270" : "#374151" }} />}
      {hover && <Icon d={I_REPLY} x={309} y={17} s={16} c={pressed ? "#C4B5FD" : C.gray300} />}
      <Icon d={I_PEN} x={340} y={17} s={16} />
      <Icon d={I_TRASH} x={370} y={17} s={16} />
      {n.quote && <div style={{ position: "absolute", left: 13, top: 42 }}><QuoteBox q={n.quote} w={378} /></div>}
      <div style={{ position: "absolute", left: 13, top: 42 + qh, width: 378, fontFamily: FONT_UI, fontSize: 16, lineHeight: "23px", color: C.white, whiteSpace: "normal" }}>{n.body}</div>
    </div>
  );
};
const M: React.FC<{ t: string }> = ({ t }) => <span style={{ color: C.mention }}>@{t}</span>;

const OLD: Note = { who: "Tanya", when: "Nov 12, 2026, 3:40 PM", h: 101, body: "Spoke to Maria Ortiz on 11/12/2026. Consultation scheduled for 11/14/2026, 10:00 AM." };
const MINE: Note = { who: "Dr. Vance", when: "Nov 14, 2026, 9:02 AM", h: 124, body: <><M t="Amanda" />{NOTE}</> };
const VQ: [string, string] = ["Dr. Vance", "@Amanda" + NOTE];
const ONIT: Note = { quote: VQ, who: "Amanda", when: "Nov 14, 2026, 9:03 AM", h: 78, body: <>On it. Asking Gentle Dental on her case now.</> };
const REPLY: Note = { quote: VQ, who: "Amanda", when: "Nov 14, 2026, 9:04 AM", h: 101, body: <><M t="Dr. Vance" /> Her newest pano is on the case (taken Nov 2026). She's ready for you.</> };
const THANKS: Note = { quote: ["Amanda", "@Dr. Vance Her newest pano is on the case (taken Nov 2026). She's ready for you."], who: "Dr. Vance", when: "Nov 14, 2026, 9:05 AM", h: 78, body: NOTE2 };

const MENU = [
  { n: "Amanda", r: "Office Manager / Treatment Coordinator", i: "AM", c: "#D97706" },
  { n: "Tanya", r: "Front Desk Coordinator", i: "TA", c: "#6D4AE8" },
  { n: "Greg", r: "Front Desk Coordinator", i: "GR", c: "#0E9F6E" },
];

/** Administrative notes panel, rebuilt below the header. */
const NotesPanel: React.FC = () => {
  const f = useCurrentFrame();
  const second = f >= K.rclick;
  const focused = (f >= K.click && f < K.add) || (f >= K.rclick && f < K.add2);
  const typed = second ? (f < K.posted2 ? NOTE2.slice(0, Math.max(0, Math.floor((f - K.type1) * CPF))) : "") : f < K.at ? "" : f < K.pick ? "@" : NOTE.slice(0, Math.max(0, Math.floor((f - K.type0) * CPF)));
  const kBar = f >= K.rclick && f < K.posted2 ? sp(f, K.rclick) : 0;
  const dy = 52 * kBar;
  const picked = f >= K.pick && !second;
  const posted = second ? f >= K.posted2 : f >= K.posted;
  const menu = f >= K.menu && f < K.pick;
  const caret = focused && Math.floor(f / 15) % 2 === 0;
  const adding = (f >= K.add && f < K.posted) || (f >= K.add2 && f < K.posted2);
  const hasText = (picked || typed.length > 0) && !posted;
  const hoverReply = f >= K.hover && f < K.rclick + 8;
  const kMine = sp(f, K.posted), kReply = sp(f, K.reply), kOnit = sp(f, K.onit);
  const notes: { n: Note; k: number }[] = [];
  if (f >= K.posted2) notes.push({ n: THANKS, k: sp(f, K.posted2) });
  if (f >= K.reply) notes.push({ n: REPLY, k: kReply });
  if (f >= K.onit) notes.push({ n: ONIT, k: kOnit });
  if (f >= K.posted) notes.push({ n: MINE, k: kMine });
  notes.push({ n: OLD, k: 1 });
  let y = 370 + dy;
  return (
    <>
      <Patch x={1470} y={162} w={430} h={680} bg={C.page} />
      {/* input */}
      <div style={{ position: "absolute", left: 1484, top: 174, width: 404, height: 102 + dy, borderRadius: 8, background: C.panel, boxShadow: `inset 0 0 0 ${focused ? 2 : 1}px ${focused ? C.focus : C.border}` }}>
        {kBar > 0 && (
          <div style={{ position: "absolute", left: 8, top: 8, width: 388, height: 44, borderRadius: 6, background: C.replyBg, borderLeft: `2px solid ${C.focus}`, opacity: kBar, fontFamily: FONT_UI }}>
            <div style={{ ...T, left: 10, top: 5, fontSize: 13.5, fontWeight: 600, color: C.gray300 }}>Replying to Amanda</div>
            <div style={{ ...T, left: 10, top: 23, fontSize: 13.5, color: C.gray400, width: 340, overflow: "hidden", textOverflow: "ellipsis" }}>@Dr. Vance Her newest pano is on the case (taken Nov 2026). She's ready for you.</div>
            <Icon d={I_X} x={362} y={13} s={14} />
          </div>
        )}
        <div style={{ position: "absolute", left: 14, top: 12 + dy, width: 376, fontFamily: FONT_UI, fontSize: 16, lineHeight: "22px", color: C.white, whiteSpace: "normal", maxHeight: 44, overflow: "hidden", display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
          {posted || (!picked && typed === "") ? (
            <span style={{ color: "#6B7280" }}>{adding ? "" : "Add a note..."}</span>
          ) : (
            <span>{picked ? <><M t="Amanda" />{typed}</> : typed}{caret && <span style={{ borderLeft: `1.5px solid ${C.white}`, marginLeft: 1 }} />}</span>
          )}
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, top: 56 + dy, height: 1, background: "#18212e" }} />
        <Icon d={I_AT} x={19} y={69 + dy} />
        <Icon d={I_SMILE} x={57} y={69 + dy} />
      </div>
      <div style={{ ...T, left: 1803, top: 280 + dy, fontSize: 13, color: C.gray400 }}>@ to mention</div>
      <div style={{ position: "absolute", left: 1484, top: 305 + dy, width: adding ? 88 : 57, height: 35, borderRadius: 6, background: hasText ? C.purple : C.purpleDim, color: hasText ? C.white : "#B9AEE0", fontFamily: FONT_UI, fontWeight: 600, fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${[K.add, K.add2].some((a) => f >= a - 3 && f < a + 3) ? 0.95 : 1})` }}>
        {adding ? "Adding..." : "Add"}
      </div>
      <div style={{ position: "absolute", left: 1470, top: 355 + dy, width: 430, height: 1, background: C.border }} />
      <div style={{ position: "absolute", left: 0, top: 356 + dy, width: 1900, height: 486 - dy, overflow: "hidden" }}><div style={{ position: "absolute", left: 0, top: -356 - dy, width: 1900, height: 842 }}>
      {notes.map(({ n, k }, i) => {
        const yy = y; y += (n.h + (n.quote ? 52 : 0) + 10) * Math.min(1, k * 1.2);
        return <NoteCard key={i} n={n} y={yy} k={k} hover={n === REPLY && hoverReply} pressed={n === REPLY && f >= K.rclick - 2} />;
      })}
      </div></div>
      {/* mention menu */}
      {menu && (
        <div style={{ position: "absolute", left: 1484, top: 282, width: 404, height: 190, borderRadius: 8, background: C.menuBg, boxShadow: "0 10px 25px rgba(0,0,0,0.35)", overflow: "hidden", opacity: interpolate(f, [K.menu, K.menu + 4], [0, 1], clamp) }}>
          <div style={{ ...T, left: 14, top: 7, fontSize: 14, color: C.menuSub }}>St. Andrew's Family Dental</div>
          {MENU.map((m, i) => (
            <div key={i} style={{ position: "absolute", left: 0, top: 27 + i * 54, width: 404, height: 54, background: (i === 0 && f >= K.mhover) ? C.menuSel : "transparent" }}>
              <div style={{ position: "absolute", left: 14, top: 14, width: 26, height: 26, borderRadius: 26, background: m.c, color: "#fff", fontFamily: FONT_UI, fontWeight: 700, fontSize: 10, display: "flex", alignItems: "center", justifyContent: "center" }}>{m.i}</div>
              <div style={{ ...T, left: 50, top: 8, fontSize: 16, color: C.menuInk }}>{m.n}</div>
              <div style={{ ...T, left: 50, top: 30, fontSize: 14, color: C.menuSub }}>{m.r}</div>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

/** The newest pano arriving: new thumbnail, main image swap, date line. */
const Xray: React.FC = () => {
  const f = useCurrentFrame();
  const kT = sp(f, K.thumb);
  const swap = interpolate(f, [K.swap, K.swap + 12], [0, 1], clamp);
  return (
    <>
      <div style={{ ...T, left: 583, top: 452, width: 303, textAlign: "center", fontSize: 13, color: C.gray400 }}>
        {swap < 0.5 ? "Panoramic X-ray · taken Mar 2022" : "Panoramic X-ray · taken Nov 2026"}
      </div>
      {f >= K.swap && <Img src={staticFile("preop/newpano.png")} style={{ position: "absolute", left: 583, top: 277, width: 303, height: 167, opacity: swap }} />}
      {f >= K.thumb && (
        <>
          {f >= K.swap && <div style={{ position: "absolute", left: 658, top: 720, width: 72, height: 71, boxShadow: `inset 0 0 0 2px ${C.page}`, borderRadius: 4 }} />}
          <div style={{ position: "absolute", left: 820, top: 720, width: 72, height: 71, borderRadius: 4, overflow: "hidden", boxShadow: `0 0 0 2px ${f >= K.swap ? C.purple : "transparent"}`, transform: `scale(${kT})`, opacity: kT }}>
            <Img src={staticFile("preop/newpano.png")} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
        </>
      )}
    </>
  );
};

/** Mouse pointer moving between targets. */
const PATH: [number, number, number][] = [[0, 1250, 520], [28, 1640, 205], [56, 1640, 205], [66, 1590, 336], [80, 1700, 470], [276, 1512, 323], [310, 1600, 520], [400, 856, 756], [430, 1000, 600], [462, 1700, 430], [474, 1700, 430], [486, 1798, 391], [536, 1798, 391], [550, 1512, 374], [580, 1512, 374], [620, 1300, 600]];
const Cursor: React.FC = () => {
  const f = useCurrentFrame();
  let i = PATH.findIndex((p) => p[0] > f); if (i < 0) i = PATH.length; const a = PATH[Math.max(0, i - 1)], b = PATH[Math.min(PATH.length - 1, i)];
  const t = b[0] === a[0] ? 1 : Math.min(1, (f - a[0]) / (b[0] - a[0]));
  const e = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
  const x = a[1] + (b[1] - a[1]) * e, y = a[2] + (b[2] - a[2]) * e;
  const down = [K.click, K.pick, K.add, K.rclick - 2, K.add2].some((c) => f >= c && f < c + 4);
  return (
    <svg style={{ position: "absolute", left: x, top: y, transform: `scale(${down ? 0.85 : 1})`, transformOrigin: "0 0" }} width="22" height="30" viewBox="0 0 22 30">
      <path d="M1 1v24l6-6 4 9 4-2-4-9h9z" fill="#fff" stroke="#111" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
};

export const DayPrepClean: React.FC<{ cursor?: boolean }> = ({ cursor = true }) => (
  <FontGate>
    <AbsoluteFill style={{ background: C.page }}>
      <Img src={staticFile("preop/plate.png")} style={{ position: "absolute", left: 0, top: 0, width: DAYPREP_W, height: DAYPREP_H }} />
      <Renames />
      <Xray />
      <NotesPanel />
      {cursor && <Cursor />}
    </AbsoluteFill>
  </FontGate>
);
