/**
 * "The Chocolate Box Delusion": ToothReferral podcast take, edited to the script's emotional arc.
 *
 *   1  the psychological joke (ironic)     swag with price tags, a $50,000 count-up, a tipping scale, a dying chart
 *   2  the market tension (serious)        GPs and specialists pulling apart, a pie eaten from both sides, an ad that
 *                                          skips the GP, front-desk "interrogation" bubbles
 *   3  flipping the script (the turn)      a self-check card, a full-frame 3D flip, what GPs actually want
 *   4  the ToothReferral fix (confident)   the wall turns brand purple; schedule embed; three feature cards
 *   5  the close (firm)                    GP and specialist reconnect (two-way); end card
 *
 * Captions take their style from the client's reference: lowercase heavy grotesk, built word by word low on the
 * chest; big pale-yellow words behind the head (speaker cutout in front); chapter titles that shrink into a small
 * top label. Footage: public/footage/cb-cut (scripts/cut_by_words.py), word timings src/data/transcript-cb.json.
 * Demo data; practice and patient names are fictional.
 */
import React from "react";
import { AbsoluteFill, Audio, Freeze, Sequence, interpolate, spring, staticFile, useCurrentFrame } from "remotion";
import { FontGate, TALENT, TalentLayer, type Framing } from "../effects";
import transcript from "../data/transcript-cb.json";
import cut from "../data/cb-cut-segments.json";
import { FONT_UI } from "../theme";
import { LogoReveal, easeIO, easeOut, ramp } from "../tr/motion";
import { Avatar, ICON, Icon, TR, clamp } from "../tr/ui";

const TL = TALENT["cb-cut"];
const FPS = 30;
const CUT_FRAMES = Math.round(cut.duration * FPS);
const TAIL = 66;
export const CB_DURATION = CUT_FRAMES + TAIL;

// ---------------------------------------------------------------------------------------------------
// Look

const YELLOW = "#F3DD72";
const RED = "#FF5A5F";
const INK = "#16131F";
const W = "#FFFFFF";
const TYPE: React.CSSProperties = { fontFamily: FONT_UI, fontWeight: 800, letterSpacing: "-0.045em", lineHeight: 0.98 };
const SOFT = "0 2px 16px rgba(10,6,24,0.5), 0 1px 3px rgba(10,6,24,0.45)";
const CARD: React.CSSProperties = { background: "#fff", borderRadius: 30, boxShadow: "0 28px 70px rgba(10,6,30,0.35), 0 2px 6px rgba(10,6,30,0.12)", fontFamily: FONT_UI, color: INK };

// ---------------------------------------------------------------------------------------------------
// Timing

const WORDS = transcript["cb-cut"].words;
const norm = (w: string) => w.toLowerCase().replace(/[^a-z0-9]/g, "");
const at = (word: string, n = 1) => {
  const hits = WORDS.filter((w) => norm(w.word) === word);
  if (!hits[n - 1]) throw new Error(`"${word}" #${n} not in transcript`);
  return Math.round(hits[n - 1].start * FPS);
};
const sp = (frame: number, a: number, damping = 15, stiffness = 160) =>
  frame < a ? 0 : spring({ frame: frame - a, fps: FPS, config: { damping, stiffness, mass: 0.75 } });
/** Visibility window: spring in at `from`, quick blur-out ending at `to`. */
const win = (frame: number, from: number, to: number, outLen = 8) => ({
  p: sp(frame, from),
  out: interpolate(frame, [to - outLen, to], [0, 1], clamp),
  on: frame >= from - 1 && frame <= to,
});

const T = {
  talk: 0,
  bottle: at("bottle"),
  plastic: at("plastic"),
  pen: at("pen"),
  chocolates: at("chocolates", 1),
  fifty: at("50"),
  profit: at("profit"),
  handshake: at("handshake"),
  swag: at("swag", 1),
  surprised: at("surprised"),
  stop: at("stop", 1),
  here: at("here"),
  general: at("general", 2),
  opposite: at("opposite"),
  pies: at("pies"),
  gps: at("gps", 1),
  implants: at("implants"),
  endo: at("endo"),
  house: at("house"),
  zero1: at("zero", 1),
  transaction: at("transaction"),
  meanwhile: at("meanwhile"),
  instagram: at("instagram"),
  bypass: at("bypass"),
  why: at("why"),
  it: at("it", 1),
  skill: at("skill"),
  cuz: at("cuz"),
  calling: at("calling"),
  hey: at("hey"),
  whats: at("whats", 2),
  there: at("there"),
  zero2: at("zero", 2),
  ask: at("ask"),
  experience: at("experience"),
  are: at("are", 5),
  or: at("or", 2),
  handouts: at("handouts"),
  flip: at("flip"),
  dentists: at("dentists", 1),
  dont: at("dont"),
  they2: at("they", 3),
  predictability: at("predictability"),
  speed: at("speed"),
  respect: at("respect"),
  that: at("that", 2),
  tooth1: at("tooth", 1),
  instead: at("instead", 1),
  phone1: at("phone", 1),
  email: at("email"),
  tooth2: at("tooth", 2),
  embeds: at("embeds"),
  workflow: at("workflow"),
  zero3: at("zero", 3),
  xrays2: at("x", 2),
  insurance2: at("insurance", 2),
  automatic: at("automatic"),
  sees: at("sees"),
  real: at("real"),
  closing: at("closing"),
  without: at("without"),
  engine: at("24"),
  you_become: at("become"),
  indispensable: at("indispensable"),
  not: at("not"),
  branded2: at("branded", 2),
  stop2: at("stop", 3),
  candy: at("candy"),
  start2: at("start", 1),
  two: at("two"),
  upgrade: at("upgrade"),
};
const CH = [
  { from: 0, label: "the psychological joke", n: 1 },
  { from: T.here - 2, label: "eating each other's pies", n: 2, big: true },
  { from: T.there - 2, label: "flipping the script", n: 3 },
  { from: T.that - 2, label: "the toothreferral fix", n: 4 },
  { from: T.stop2 - 2, label: "the close", n: 5, big: true },
];
const WALL_AT = T.that - 4;

// ---------------------------------------------------------------------------------------------------
// Camera: wide on even pieces of the cut, a punch-in on odd ones; a push + blur "kick" on chapter changes; a
// 3D flip on "flip the script".

const FACE = { x: 408, y: 423 };
const onFace = (s: number): Framing => ({ scale: s, x: FACE.x * 1.5 - FACE.x * s, y: FACE.y * 1.5 - FACE.y * s });
const SEG_STARTS = cut.segments.map((s) => Math.round(s.at * FPS));
const segIndex = (frame: number) => {
  let i = 0;
  while (i + 1 < SEG_STARTS.length && SEG_STARTS[i + 1] <= frame) i++;
  return i;
};
/** Slow emotional pushes: [from, to, extra scale]. */
const PUSHES: [number, number, number][] = [
  [at("act"), T.here - 4, 0.07], // "...and then act surprised"
  [T.it, T.calling, 0.06], // "it wasn't your clinical skill"
  [at("its"), T.they2, 0.05], // "it's time to flip the script"
  [T.stop2, CUT_FRAMES, 0.06], // the close
];
const framingAt = (frame: number): Framing => {
  const base = segIndex(frame) % 2 === 0 ? 1.5 : 1.64;
  let extra = 0;
  for (const [a, b, e] of PUSHES) if (frame >= a && frame <= b) extra = Math.max(extra, e * ramp(frame, a, Math.min(b, a + 90), easeIO));
  return onFace(base * (1 + extra));
};
const KICKS = CH.slice(1).map((c) => c.from);

// ---------------------------------------------------------------------------------------------------
// Captions

type Tok = { t: string; at: number; end: number };
const TOKS: Tok[] = (() => {
  const out: Tok[] = [];
  for (const w of WORDS) {
    let t = w.word.trim();
    const prev = out[out.length - 1];
    if (prev && (t.startsWith("-") || t.startsWith(",000"))) {
      prev.t = prev.t + t;
      prev.end = Math.round(w.end * FPS);
      continue;
    }
    t = t.replace(/^cuz$/i, "because").replace(/^Transpee\.$/i, "transparency.").replace(/^handouts\?$/i, "hand-outs?");
    out.push({ t, at: Math.round(w.start * FPS), end: Math.round(w.end * FPS) });
  }
  // "tooth referral" -> "toothreferral", "24-7" -> "24/7"
  for (let i = 0; i < out.length - 1; i++) {
    if (/^tooth$/i.test(out[i].t) && /^referral/i.test(out[i + 1].t)) {
      out[i].t = "toothreferral" + out[i + 1].t.replace(/^referral/i, "");
      out[i].end = out[i + 1].end;
      out.splice(i + 1, 1);
    }
    out[i].t = out[i].t.replace(/^24-7$/, "24/7");
  }
  return out.map((x) => ({ ...x, t: x.t.toLowerCase() }));
})();
type Chunk = { words: Tok[]; from: number; to: number };
const CHUNKS: Chunk[] = (() => {
  const chunks: Chunk[] = [];
  let cur: Tok[] = [];
  const flush = () => {
    if (cur.length) chunks.push({ words: cur, from: cur[0].at - 1, to: cur[cur.length - 1].end + 10 });
    cur = [];
  };
  for (const tk of TOKS) {
    const len = cur.map((x) => x.t).join(" ").length;
    if (cur.length && (cur.length >= 3 || len + tk.t.length > 19)) flush();
    cur.push(tk);
    if (/[.,?!]$/.test(tk.t)) flush();
  }
  flush();
  for (let i = 0; i < chunks.length - 1; i++) chunks[i].to = Math.min(chunks[i].to, chunks[i + 1].from);
  return chunks;
})();

const Captions: React.FC = () => {
  const frame = useCurrentFrame();
  const c = CHUNKS.find((x) => frame >= x.from && frame < x.to);
  if (!c) return null;
  const out = interpolate(frame, [c.to - 4, c.to], [0, 1], clamp);
  return (
    <div style={{ position: "absolute", left: 60, right: 60, top: 1196, textAlign: "center", ...TYPE, fontSize: 70, color: W, textShadow: SOFT, opacity: 1 - out, filter: out > 0 ? `blur(${out * 6}px)` : undefined }}>
      {c.words.map((w, i) => {
        const k = interpolate(frame, [w.at - 2, w.at + 3], [0, 1], clamp);
        return (
          <span key={i} style={{ display: "inline-block", marginRight: i < c.words.length - 1 ? "0.24em" : 0, opacity: k, translate: `0px ${(1 - k) * 10}px`, filter: k < 1 ? `blur(${(1 - k) * 5}px)` : undefined }}>
            {w.t}
          </span>
        );
      })}
    </div>
  );
};

/** Chapter title: big for a beat, then shrinks into the small label at the top for the rest of the chapter. */
const Chapter: React.FC<{ i: number }> = ({ i }) => {
  const frame = useCurrentFrame();
  const c = CH[i];
  const next = CH[i + 1]?.from ?? CUT_FRAMES;
  if (frame < c.from || frame >= next) return null;
  const f = frame - c.from;
  const settle = c.big ? ramp(frame, c.from + 34, c.from + 46, easeIO) : 1;
  const inK = c.big ? sp(frame, c.from, 14, 150) : interpolate(f, [0, 10], [0, 1], clamp);
  const out = interpolate(frame, [next - 6, next], [0, 1], clamp);
  const big = 1 - settle;
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: interpolate(settle, [0, 1], [150, 58]), textAlign: "center", opacity: Math.min(1, inK * 1.4) * (1 - out) }}>
      <div style={{ ...TYPE, fontSize: interpolate(settle, [0, 1], [150, 30]), color: W, textShadow: SOFT, filter: c.big && inK < 0.7 ? `blur(${(0.7 - inK) * 16}px)` : undefined, scale: String(c.big ? interpolate(inK, [0, 1], [1.12, 1]) : 1) }}>
        <span style={{ color: YELLOW }}>part {c.n}</span>
        {big < 0.5 ? <span style={{ fontWeight: 700, opacity: 1 - big * 2 }}>{"  "}{c.label}</span> : null}
      </div>
    </div>
  );
};

/** Opening title, in the reference's two-line form: a small line with one yellow word, then a big white line. */
const OpeningTitle: React.FC<{ to: number }> = ({ to }) => {
  const frame = useCurrentFrame();
  const a = sp(frame, 2, 15, 150);
  const b = sp(frame, 8, 14, 140);
  const out = interpolate(frame, [to - 8, to], [0, 1], clamp);
  if (frame > to) return null;
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: 120, textAlign: "center", opacity: 1 - out, filter: out > 0 ? `blur(${out * 10}px)` : undefined }}>
      <div style={{ ...TYPE, fontSize: 46, color: W, textShadow: SOFT, opacity: a, translate: `0px ${(1 - a) * 16}px` }}>
        the <span style={{ color: YELLOW }}>chocolate box</span>
      </div>
      <div style={{ ...TYPE, fontSize: 150, color: W, textShadow: SOFT, opacity: Math.min(1, b * 1.5), scale: String(interpolate(b, [0, 1], [1.1, 1])), filter: b < 0.7 ? `blur(${(0.7 - b) * 18}px)` : undefined }}>
        delusion.
      </div>
    </div>
  );
};

/** A huge word behind the head (the speaker cutout sits in front of it). */
const BigWord: React.FC<{ from: number; to: number; text: string; size?: number; color?: string; top?: number; strikeAt?: number; count?: { to: number; prefix?: string; dur?: number } }> = ({
  from,
  to,
  text,
  size = 230,
  color = YELLOW,
  top = 150,
  strikeAt,
  count,
}) => {
  const frame = useCurrentFrame();
  const { p, out, on } = win(frame, from, to, 9);
  if (!on) return null;
  let shown = text;
  if (count) {
    const v = count.to * easeOut(interpolate(frame, [from, from + (count.dur ?? 24)], [0, 1], clamp));
    shown = (count.prefix ?? "") + Math.round(v).toLocaleString("en-US");
  }
  const strike = strikeAt !== undefined ? ramp(frame, strikeAt, strikeAt + 8, easeOut) : 0;
  return (
    <div style={{ position: "absolute", left: -60, right: -60, top, display: "flex", justifyContent: "center", opacity: Math.min(1, p * 1.6) * (1 - out), filter: p < 0.7 ? `blur(${(0.7 - p) * 18}px)` : out > 0 ? `blur(${out * 12}px)` : undefined }}>
      <div style={{ position: "relative", ...TYPE, fontSize: size, color, fontVariantNumeric: "tabular-nums", scale: String(interpolate(p, [0, 1], [1.14, 1])), textShadow: "0 8px 40px rgba(10,6,24,0.25)" }}>
        {shown}
        {strike > 0 && <div style={{ position: "absolute", left: -10, top: "52%", height: size * 0.09, width: `${strike * 104}%`, background: YELLOW, borderRadius: 8, rotate: "-4deg", boxShadow: "0 4px 18px rgba(10,6,24,0.3)" }} />}
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------------------------------
// Illustrations (generic, unbranded)

const Bottle: React.FC<{ size?: number; grey?: boolean }> = ({ size = 200, grey }) => (
  <svg width={size * 0.42} height={size} viewBox="0 0 42 100" style={{ filter: grey ? "grayscale(1) opacity(0.6)" : undefined }}>
    <rect x={15} y={2} width={12} height={9} rx={2} fill="#3B6FE0" />
    <path d="M14 11h14l3 10v70a6 6 0 0 1-6 6H17a6 6 0 0 1-6-6V21z" fill="#CFE8FF" stroke="#8EC3F5" strokeWidth={1.5} />
    <rect x={11} y={42} width={20} height={20} fill="#fff" />
    <text x={21} y={55} fontSize={6} textAnchor="middle" fill="#3B6FE0" fontFamily="Inter" fontWeight={800}>LOGO</text>
    <path d="M14 26c4 3 10 3 14 0M14 76c4 3 10 3 14 0" stroke="#fff" strokeWidth={1.5} fill="none" opacity={0.7} />
  </svg>
);
const Pen: React.FC<{ size?: number; grey?: boolean }> = ({ size = 200, grey }) => (
  <svg width={size * 0.22} height={size} viewBox="0 0 22 100" style={{ filter: grey ? "grayscale(1) opacity(0.6)" : undefined }}>
    <rect x={5} y={4} width={12} height={74} rx={5} fill="#E4473C" />
    <rect x={14} y={8} width={4} height={30} rx={2} fill="#C9C9C9" />
    <path d="M5 78h12l-6 18z" fill="#E9E2D6" />
    <path d="M10 92l1 6 1-6z" fill="#222" />
    <text x={11} y={56} fontSize={5} textAnchor="middle" fill="#fff" fontFamily="Inter" fontWeight={800} transform="rotate(-90 11 56)">YOUR LOGO</text>
  </svg>
);
const ChocBox: React.FC<{ size?: number; grey?: boolean }> = ({ size = 240, grey }) => (
  <svg width={size} height={size * 0.62} viewBox="0 0 100 62" style={{ filter: grey ? "grayscale(1) opacity(0.6)" : undefined }}>
    <rect x={2} y={8} width={96} height={52} rx={5} fill="#5A3A22" />
    <rect x={6} y={12} width={88} height={44} rx={3} fill="#3A2416" />
    {[0, 1, 2, 3].map((c) =>
      [0, 1].map((r) => (
        <g key={`${c}${r}`}>
          <circle cx={18 + c * 21.5} cy={23 + r * 21} r={8.2} fill="#D9A93B" />
          <circle cx={15.5 + c * 21.5} cy={20 + r * 21} r={2.6} fill="#FBE7A6" opacity={0.85} />
          <path d={`M${11 + c * 21.5} ${26 + r * 21}q7 4 14 0`} stroke="#9C7420" strokeWidth={1} fill="none" />
        </g>
      )),
    )}
    <path d="M2 8h96l-6-6H8z" fill="#7A5232" />
  </svg>
);

const PriceTag: React.FC<{ text: string; p: number }> = ({ text, p }) => (
  <div style={{ marginTop: 10, padding: "6px 16px", borderRadius: 999, background: YELLOW, color: INK, ...TYPE, letterSpacing: "-0.02em", fontSize: 30, scale: String(p), boxShadow: "0 8px 20px rgba(10,6,24,0.25)" }}>{text}</div>
);

// ---------------------------------------------------------------------------------------------------
// Chapter 1: the psychological joke

/** The swag, item by item, then onto the light pan of a scale against $50,000 of cases. */
const SwagAndScale: React.FC = () => {
  const frame = useCurrentFrame();
  const end = T.swag + 20;
  if (frame < T.plastic - 4 || frame > end) return null;
  const out = interpolate(frame, [end - 8, end], [0, 1], clamp);
  const toScale = ramp(frame, T.profit, T.profit + 18, easeIO);
  const scaleIn = sp(frame, T.profit - 2, 14, 140);
  const tilt = interpolate(sp(frame, T.profit + 14, 9, 90), [0, 1], [0, -14]);
  const items = [
    { el: <Bottle size={170} />, tag: "$2", at: T.plastic - 2, x: 150 },
    { el: <Pen size={170} />, tag: "pen", at: T.pen - 4, x: 380 },
    { el: <ChocBox size={210} />, tag: "$5", at: T.chocolates - 6, x: 690 },
  ];
  // the scale: beam centred above the head
  const cx = 540;
  const by = 240;
  const arm = 330;
  const L = [cx - arm * Math.cos((tilt * Math.PI) / 180), by - arm * Math.sin((tilt * Math.PI) / 180)];
  const R = [cx + arm * Math.cos((tilt * Math.PI) / 180), by + arm * Math.sin((tilt * Math.PI) / 180)];
  return (
    <AbsoluteFill style={{ opacity: 1 - out, filter: out > 0 ? `blur(${out * 8}px)` : undefined }}>
      {scaleIn > 0 && (
        <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, opacity: Math.min(1, scaleIn * 1.5) }}>
          <line x1={cx} y1={by - 70} x2={cx} y2={by + 40} stroke={W} strokeWidth={8} strokeLinecap="round" />
          <circle cx={cx} cy={by - 76} r={12} fill={YELLOW} />
          <line x1={L[0]} y1={L[1]} x2={R[0]} y2={R[1]} stroke={W} strokeWidth={9} strokeLinecap="round" />
          {[L, R].map((P, i) => (
            <g key={i}>
              <line x1={P[0]} y1={P[1]} x2={P[0] - 80} y2={P[1] + 120} stroke={W} strokeWidth={3} opacity={0.8} />
              <line x1={P[0]} y1={P[1]} x2={P[0] + 80} y2={P[1] + 120} stroke={W} strokeWidth={3} opacity={0.8} />
              <path d={`M${P[0] - 100} ${P[1] + 120} h200 a100 34 0 0 1 -200 0z`} fill={W} opacity={0.92} />
            </g>
          ))}
        </svg>
      )}
      {scaleIn > 0 && (
        <div style={{ position: "absolute", left: L[0] - 120, top: L[1] + 30, width: 240, textAlign: "center", opacity: Math.min(1, scaleIn * 1.5) }}>
          <div style={{ ...TYPE, fontSize: 52, color: YELLOW, textShadow: SOFT }}>$50,000</div>
          <div style={{ ...TYPE, fontSize: 24, letterSpacing: "-0.02em", color: W, textShadow: SOFT, marginTop: 2 }}>of cases from them</div>
        </div>
      )}
      {items.map((it, i) => {
        const p = sp(frame, it.at, 11, 200);
        if (frame < it.at - 1) return null;
        // fly into the right pan
        const tx = interpolate(toScale, [0, 1], [it.x, R[0] - 110 + i * 60]);
        const ty = interpolate(toScale, [0, 1], [150, R[1] + 46]);
        const s = interpolate(toScale, [0, 1], [1, 0.42]);
        return (
          <div key={i} style={{ position: "absolute", left: tx, top: ty, display: "flex", flexDirection: "column", alignItems: "center", transformOrigin: "50% 100%", scale: String(p * s), opacity: Math.min(1, p * 2), rotate: `${(1 - p) * -12 + tilt * toScale * 0.5}deg`, filter: "drop-shadow(0 14px 22px rgba(10,6,24,0.35))" }}>
            {it.el}
            {toScale < 0.4 && <PriceTag text={it.tag} p={p * (1 - toScale * 2.5)} />}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

/** "...act surprised when they stop sending you patients": referrals from one GP, sliding to zero. */
const DyingChart: React.FC = () => {
  const frame = useCurrentFrame();
  const { p, out, on } = win(frame, T.surprised - 6, T.here - 2);
  if (!on) return null;
  const draw = ramp(frame, T.surprised, T.stop + 14, easeIO);
  const pts = [
    [0, 30], [1, 34], [2, 31], [3, 36], [4, 33], [5, 24], [6, 14], [7, 6], [8, 0],
  ];
  const X = (i: number) => 30 + i * 46;
  const Y = (v: number) => 210 - v * 4.8;
  const n = Math.max(1, Math.floor(draw * (pts.length - 1)) + 1);
  const d = pts.slice(0, n).map((q, i) => `${i ? "L" : "M"}${X(q[0])} ${Y(q[1])}`).join(" ");
  const last = pts[n - 1];
  return (
    <div style={{ position: "absolute", left: 600, top: 380, width: 440, opacity: Math.min(1, p * 1.5) * (1 - out), translate: `0px ${(1 - p) * 30}px`, rotate: "2deg" }}>
      <div style={{ ...CARD, padding: "20px 22px 14px" }}>
        <div style={{ fontSize: 22, fontWeight: 700, color: "#6B6880" }}>Referrals from Dr. Lee</div>
        <svg width={400} height={230}>
          {[0, 1, 2].map((g) => (
            <line key={g} x1={20} x2={400} y1={50 + g * 70} y2={50 + g * 70} stroke="#EEE" strokeWidth={2} />
          ))}
          <path d={d} fill="none" stroke={draw > 0.6 ? RED : "#7C6BE8"} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" />
          <circle cx={X(last[0])} cy={Y(last[1])} r={9} fill={draw > 0.6 ? RED : "#7C6BE8"} />
        </svg>
        <div style={{ ...TYPE, fontSize: 40, letterSpacing: "-0.03em", color: draw > 0.95 ? RED : INK }}>{draw > 0.95 ? "0 this month" : "…"}</div>
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------------------------------
// Chapter 2: the market tension

const Node: React.FC<{ label: string; x: number; y: number; color: string; s?: number }> = ({ label, x, y, color, s = 1 }) => (
  <div style={{ position: "absolute", left: x, top: y, translate: "-50% -50%", scale: String(s), padding: "16px 30px", borderRadius: 999, background: color, color: color === YELLOW ? INK : W, ...TYPE, letterSpacing: "-0.03em", fontSize: 44, boxShadow: "0 14px 34px rgba(10,6,24,0.35)", whiteSpace: "nowrap" }}>{label}</div>
);

/** GPs and specialists pull apart; a pie between them loses a slice to each side. */
const Apart: React.FC = () => {
  const frame = useCurrentFrame();
  const { p, out, on } = win(frame, T.general - 4, T.gps + 6);
  if (!on) return null;
  const apart = ramp(frame, T.opposite - 4, T.opposite + 20, easeIO);
  const pie = sp(frame, T.pies - 16, 13, 160);
  const bite = ramp(frame, T.pies - 2, T.pies + 14, easeOut);
  const gx = 540 - 150 - apart * 160;
  const sx = 540 + 150 + apart * 160;
  const y = 230;
  const wedge = (a0: number, a1: number, r: number) => {
    const x0 = Math.cos(a0) * r, y0 = Math.sin(a0) * r, x1 = Math.cos(a1) * r, y1 = Math.sin(a1) * r;
    return `M0 0 L${x0} ${y0} A${r} ${r} 0 ${a1 - a0 > Math.PI ? 1 : 0} 1 ${x1} ${y1} Z`;
  };
  return (
    <AbsoluteFill style={{ opacity: Math.min(1, p * 1.5) * (1 - out) }}>
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <marker id="ah" markerWidth="10" markerHeight="10" refX="6" refY="5" orient="auto">
            <path d="M0 0 L10 5 L0 10 z" fill={W} />
          </marker>
        </defs>
        {apart > 0.05 && (
          <>
            <line x1={gx + 20} y1={y + 70} x2={gx - 120 * apart} y2={y + 70} stroke={W} strokeWidth={5} markerEnd="url(#ah)" opacity={0.9} />
            <line x1={sx - 20} y1={y + 70} x2={sx + 120 * apart} y2={y + 70} stroke={W} strokeWidth={5} markerEnd="url(#ah)" opacity={0.9} />
          </>
        )}
        {pie > 0 && (
          <g transform={`translate(540 ${y + 20}) scale(${pie})`}>
            <circle r={92} fill="#E9B35A" />
            <circle r={78} fill="#C9792E" />
            <path d={wedge(-Math.PI * 0.5, Math.PI * 1.5, 92)} fill="none" />
            {[0, 1, 2, 3, 4, 5].map((k) => (
              <line key={k} x1={0} y1={0} x2={Math.cos((k * Math.PI) / 3) * 92} y2={Math.sin((k * Math.PI) / 3) * 92} stroke="#8B4E1E" strokeWidth={3} />
            ))}
            {/* the slices each side takes */}
            <path d={wedge(Math.PI * (2 / 3), Math.PI, 92)} fill="#E9B35A" transform={`translate(${-bite * 210} ${-bite * 10})`} stroke="#8B4E1E" strokeWidth={3} />
            <path d={wedge(0, Math.PI / 3, 92)} fill="#E9B35A" transform={`translate(${bite * 210} ${-bite * 10})`} stroke="#8B4E1E" strokeWidth={3} />
          </g>
        )}
      </svg>
      <Node label="GPs" x={gx} y={y} color={W} s={p} />
      <Node label="specialists" x={sx} y={y} color={YELLOW} s={p} />
    </AbsoluteFill>
  );
};

/** "GPs are keeping implants and endo in-house": the work lands in the GP's own office. */
const InHouse: React.FC = () => {
  const frame = useCurrentFrame();
  const { p, out, on } = win(frame, T.gps - 2, T.transaction + 30);
  if (!on) return null;
  const chip = (label: string, a: number, i: number) => {
    const k = ramp(frame, a, a + 16, easeIO);
    const q = sp(frame, a - 4, 12, 200);
    return (
      <div key={label} style={{ position: "absolute", left: interpolate(k, [0, 1], [380 + i * 20, 92 + i * 150]), top: interpolate(k, [0, 1], [560 + i * 70, 708]), padding: "10px 20px", borderRadius: 999, background: YELLOW, color: INK, ...TYPE, letterSpacing: "-0.02em", fontSize: 30, scale: String(q), opacity: Math.min(1, q * 2), boxShadow: "0 8px 20px rgba(10,6,24,0.3)" }}>
        {label}
      </div>
    );
  };
  const stamp = sp(frame, T.house - 2, 9, 220);
  return (
    <AbsoluteFill style={{ opacity: 1 - out, filter: out > 0 ? `blur(${out * 8}px)` : undefined }}>
      <div style={{ position: "absolute", left: 50, top: 520, width: 380, opacity: Math.min(1, p * 1.5), translate: `${(1 - p) * -60}px 0px`, rotate: "-2deg" }}>
        <div style={{ ...CARD, padding: "20px 24px 90px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <Icon d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z" size={36} color={INK} />
            <div style={{ fontSize: 28, fontWeight: 800, letterSpacing: "-0.02em" }}>GP office</div>
          </div>
          <div style={{ fontSize: 20, color: "#6B6880", marginTop: 4 }}>keeping it in-house</div>
        </div>
        {stamp > 0 && (
          <div style={{ position: "absolute", right: -18, top: -22, padding: "8px 16px", border: `4px solid ${RED}`, color: RED, borderRadius: 10, ...TYPE, letterSpacing: "0em", fontSize: 26, rotate: "10deg", scale: String(interpolate(stamp, [0, 1], [1.8, 1])), opacity: Math.min(1, stamp * 2), background: "rgba(255,255,255,0.9)" }}>IN-HOUSE</div>
        )}
      </div>
      {chip("implants", T.implants - 2, 0)}
      {chip("endo", T.endo - 2, 1)}
    </AbsoluteFill>
  );
};

/** Specialists "running direct-to-consumer Instagram ads to bypass the GP": a sponsored post on a phone. */
const AdPhone: React.FC = () => {
  const frame = useCurrentFrame();
  const { p, out, on } = win(frame, T.meanwhile + 4, T.why - 2);
  if (!on) return null;
  const skip = sp(frame, T.bypass - 2, 11, 200);
  return (
    <div style={{ position: "absolute", left: 50, top: 170, width: 300, height: 600, opacity: Math.min(1, p * 1.5) * (1 - out), translate: `${(1 - p) * -80}px ${(1 - p) * 40}px`, rotate: `${-5 + (1 - p) * -10}deg`, filter: out > 0 ? `blur(${out * 8}px)` : undefined }}>
      <div style={{ position: "absolute", inset: 0, borderRadius: 46, background: "#0E0E12", padding: 10, boxShadow: "0 30px 70px rgba(10,6,24,0.5)" }}>
        <div style={{ position: "relative", width: "100%", height: "100%", borderRadius: 38, overflow: "hidden", background: "#fff", fontFamily: FONT_UI }}>
          <div style={{ position: "absolute", top: 10, left: "50%", translate: "-50% 0px", width: 90, height: 24, borderRadius: 12, background: "#0E0E12" }} />
          <div style={{ position: "absolute", top: 48, left: 14, right: 14, display: "flex", alignItems: "center", gap: 8 }}>
            <Avatar initials="ES" size={34} />
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, color: INK }}>Endo Specialists</div>
              <div style={{ fontSize: 12, color: "#8A8799" }}>Sponsored</div>
            </div>
          </div>
          <div style={{ position: "absolute", top: 96, left: 0, right: 0, height: 270, background: "linear-gradient(160deg, #F6E7C8, #E6B87A)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width={120} height={140} viewBox="0 0 24 28">
              <path d="M12 2c-2.5 0-4 1.2-5.5 1.2S4 2.5 3 4c-1.6 2.4-.4 7 1 10 .8 1.7 1 5 2.5 7 .8 1 1.8.5 2-.7.3-1.8.6-4.5 3.5-4.5s3.2 2.7 3.5 4.5c.2 1.2 1.2 1.7 2 .7 1.5-2 1.7-5.3 2.5-7 1.4-3 2.6-7.6 1-10-1-1.5-2.5-.8-3.5-.8S14.5 2 12 2z" fill="#fff" stroke="#C48A3E" strokeWidth={0.8} />
            </svg>
          </div>
          <div style={{ position: "absolute", top: 380, left: 14, right: 14, fontSize: 19, fontWeight: 700, color: INK, lineHeight: 1.25 }}>Need an implant? Book direct, no referral needed.</div>
          <div style={{ position: "absolute", top: 452, left: 14, right: 14, padding: "10px 0", textAlign: "center", borderRadius: 12, background: "#2F6BFF", color: W, fontSize: 17, fontWeight: 700 }}>Book now</div>
        </div>
      </div>
      {skip > 0 && (
        <div style={{ position: "absolute", left: 150, top: 610, display: "flex", alignItems: "center", gap: 10, padding: "10px 18px", borderRadius: 999, background: INK, color: W, ...TYPE, letterSpacing: "-0.02em", fontSize: 26, scale: String(skip), whiteSpace: "nowrap", boxShadow: "0 10px 24px rgba(10,6,24,0.4)" }}>
          <span style={{ textDecoration: "line-through", textDecorationColor: RED, textDecorationThickness: 4, opacity: 0.8 }}>GP</span> skipped
        </div>
      )}
    </div>
  );
};

/** The front desk "interrogation": a ringing call, then two curt bubbles on either side of the head. */
const Interrogation: React.FC = () => {
  const frame = useCurrentFrame();
  const { p, out, on } = win(frame, T.calling - 8, T.there - 2);
  if (!on) return null;
  const ring = Math.sin((frame - T.calling) / 1.6) * 4 * (frame > T.calling && frame < T.hey ? 1 : 0);
  const b1 = sp(frame, T.hey - 3, 10, 230);
  const b2 = sp(frame, T.whats - 3, 10, 230);
  const shake = (a: number) => (frame >= a && frame < a + 9 ? Math.sin((frame - a) * 2.8) * 7 * (1 - (frame - a) / 9) : 0);
  const bubble = (txt: string, k: number, x: number, y: number, a: number, side: "l" | "r") => (
    <div style={{ position: "absolute", left: x, top: y, maxWidth: 440, padding: "20px 26px", borderRadius: 30, borderBottomLeftRadius: side === "l" ? 6 : 30, borderBottomRightRadius: side === "r" ? 6 : 30, background: W, border: `4px solid ${RED}`, color: INK, ...TYPE, letterSpacing: "-0.03em", fontSize: 40, lineHeight: 1.08, transformOrigin: side === "l" ? "0% 100%" : "100% 100%", scale: String(k), opacity: Math.min(1, k * 2), translate: `${shake(a)}px 0px`, boxShadow: "0 18px 40px rgba(10,6,24,0.35)" }}>{txt}</div>
  );
  return (
    <AbsoluteFill style={{ opacity: 1 - out, filter: out > 0 ? `blur(${out * 8}px)` : undefined }}>
      <div style={{ position: "absolute", left: 60, top: 150, width: 420, opacity: Math.min(1, p * 1.5), translate: `${ring}px ${(1 - p) * 30}px` }}>
        <div style={{ ...CARD, padding: "18px 22px", display: "flex", alignItems: "center", gap: 16, background: "#1E1B29", color: W }}>
          <div style={{ width: 62, height: 62, borderRadius: 31, background: "#2FB86E", display: "flex", alignItems: "center", justifyContent: "center", flex: "none" }}>
            <Icon d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" size={32} color={W} />
          </div>
          <div>
            <div style={{ fontSize: 24, fontWeight: 800, letterSpacing: "-0.02em" }}>Front desk → GP office</div>
            <div style={{ fontSize: 19, color: "#B9B5CC" }}>calling… again</div>
          </div>
        </div>
      </div>
      {b1 > 0 && bubble("hey, do you have the x-ray?", b1, 60, 350, T.hey - 3, "l")}
      {b2 > 0 && bubble("what's their insurance info?", b2, 560, 520, T.whats - 3, "r")}
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------------------------------
// Chapter 3: flipping the script

/** "Ask yourself": a self-check card, rating, then two honest options. */
const SelfCheck: React.FC = () => {
  const frame = useCurrentFrame();
  const { p, out, on } = win(frame, T.ask - 2, T.flip - 8);
  if (!on) return null;
  const stars = ramp(frame, T.experience - 10, T.experience + 14);
  const o1 = sp(frame, T.are - 2, 12, 200);
  const o2 = sp(frame, T.or - 2, 12, 200);
  const tick = sp(frame, T.handouts + 4, 10, 220);
  return (
    <div style={{ position: "absolute", left: 46, top: 170, width: 470, opacity: Math.min(1, p * 1.5) * (1 - out), translate: `${(1 - p) * -60}px 0px`, rotate: "-1.5deg", filter: out > 0 ? `blur(${out * 8}px)` : undefined }}>
      <div style={{ ...CARD, padding: "22px 26px" }}>
        <div style={{ fontSize: 18, fontWeight: 700, color: "#8A8799", letterSpacing: 1.5, textTransform: "uppercase" }}>Self-check</div>
        <div style={{ fontSize: 28, fontWeight: 800, letterSpacing: "-0.02em", lineHeight: 1.15, marginTop: 6 }}>How does your referral experience feel to a GP?</div>
        <div style={{ display: "flex", gap: 6, marginTop: 12 }}>
          {[0, 1, 2, 3, 4].map((k) => (
            <svg key={k} width={40} height={40} viewBox="0 0 24 24">
              <path d="m12 2 3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.8 21l1.2-6.8-5-4.9 6.9-1z" fill={stars * 5 > k + 0.5 && k < 2 ? "#F5B400" : "#E7E5EE"} />
            </svg>
          ))}
        </div>
        {[
          { t: "marketing real value", k: o1, bad: false },
          { t: "expecting hand-outs", k: o2, bad: true },
        ].map((o, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 14, padding: "12px 14px", borderRadius: 16, background: o.bad && tick > 0.5 ? "#FFECEC" : "#F5F4F8", opacity: Math.min(1, o.k * 2), translate: `0px ${(1 - o.k) * 14}px` }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, border: `3px solid ${o.bad && tick > 0.5 ? RED : "#C9C6D6"}`, display: "flex", alignItems: "center", justifyContent: "center", background: o.bad && tick > 0.5 ? RED : W }}>
              {o.bad && tick > 0.5 && <Icon d="M18 6 6 18M6 6l12 12" size={20} color={W} />}
            </div>
            <div style={{ fontSize: 25, fontWeight: 700 }}>{o.t}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

/** "General dentists don't want cheap chocolates." */
const NoChocolates: React.FC = () => {
  const frame = useCurrentFrame();
  const { p, out, on } = win(frame, T.dentists - 4, T.they2 - 2);
  if (!on) return null;
  const x = ramp(frame, T.dont, T.dont + 10, easeOut);
  return (
    <div style={{ position: "absolute", left: 70, top: 300, width: 340, display: "flex", flexDirection: "column", alignItems: "center", opacity: Math.min(1, p * 1.5) * (1 - out), scale: String(interpolate(p, [0, 1], [0.8, 1])), rotate: "-6deg", filter: "drop-shadow(0 18px 30px rgba(10,6,24,0.4))" }}>
      <div style={{ position: "relative" }}>
        <ChocBox size={300} />
        <svg width={300} height={186} style={{ position: "absolute", inset: 0 }}>
          <line x1={20} y1={20} x2={20 + 260 * x} y2={20 + 146 * x} stroke={RED} strokeWidth={14} strokeLinecap="round" />
          <line x1={280} y1={20} x2={280 - 260 * Math.max(0, x * 2 - 1)} y2={20 + 146 * Math.max(0, x * 2 - 1)} stroke={RED} strokeWidth={14} strokeLinecap="round" />
        </svg>
      </div>
    </div>
  );
};

/** What GPs actually want: three tiles in turn. */
const Wants: React.FC = () => {
  const frame = useCurrentFrame();
  const { out, on } = win(frame, T.predictability - 4, T.that - 4);
  if (!on) return null;
  const tiles = [
    { t: "predictability", d: ICON.calendar, a: T.predictability - 2 },
    { t: "speed", d: "M13 2 3 14h9l-1 8 10-12h-9l1-8z", a: T.speed - 2 },
    { t: "respect", d: "M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1 1.1L12 21l7.8-7.6 1-1.1a5.5 5.5 0 0 0 0-7.7z", a: T.respect - 2 },
  ];
  return (
    <AbsoluteFill style={{ opacity: 1 - out, filter: out > 0 ? `blur(${out * 8}px)` : undefined }}>
      {tiles.map((t, i) => {
        const q = sp(frame, t.a, 12, 190);
        return (
          <div key={i} style={{ position: "absolute", left: 40 + i * 340, top: 120, width: 320, opacity: Math.min(1, q * 2), translate: `0px ${(1 - q) * 40}px`, scale: String(interpolate(q, [0, 1], [0.85, 1])) }}>
            <div style={{ ...CARD, padding: "18px 18px", display: "flex", alignItems: "center", gap: 12, borderRadius: 24 }}>
              <div style={{ width: 54, height: 54, borderRadius: 16, background: YELLOW, display: "flex", alignItems: "center", justifyContent: "center", flex: "none" }}>
                <Icon d={t.d} size={30} color={INK} />
              </div>
              <div style={{ ...TYPE, fontSize: 32, letterSpacing: "-0.03em" }}>{t.t}</div>
            </div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------------------------------
// Chapter 4: the ToothReferral fix

/** From "That is where ToothReferral...", the studio wall turns brand purple, wiping out from behind the head. */
const BrandWall: React.FC = () => {
  const frame = useCurrentFrame();
  const k = ramp(frame, WALL_AT, WALL_AT + 16, easeIO);
  if (frame < WALL_AT) return null;
  const d = Math.sin(frame / 60) * 40;
  return (
    <AbsoluteFill style={{ clipPath: `circle(${k * 1500}px at 612px 600px)` }}>
      <AbsoluteFill style={{ background: `linear-gradient(170deg, ${TR.stage1} 0%, #2A176A 55%, ${TR.stage2} 100%)` }} />
      <div style={{ position: "absolute", width: 1200, height: 1200, left: 10 + d, top: 40, borderRadius: "50%", background: `radial-gradient(circle, ${TR.purple}66, transparent 62%)`, filter: "blur(30px)" }} />
      <div style={{ position: "absolute", width: 900, height: 900, right: -320 - d, bottom: 200, borderRadius: "50%", background: "radial-gradient(circle, #4C7DFF2E, transparent 64%)", filter: "blur(40px)" }} />
    </AbsoluteFill>
  );
};

/** "Phone tag and static email chains": a phone and an envelope chained together; the chain snaps. */
const Chains: React.FC = () => {
  const frame = useCurrentFrame();
  const { p, out, on } = win(frame, T.instead - 2, T.tooth2 + 10);
  if (!on) return null;
  const snap = ramp(frame, T.tooth2 - 4, T.tooth2 + 8, easeOut);
  const icon = (d: string, x: number) => (
    <div style={{ position: "absolute", left: x, top: 0, width: 110, height: 110, borderRadius: 28, background: W, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 14px 30px rgba(10,6,24,0.35)", translate: `${(x < 200 ? -1 : 1) * snap * 40}px ${snap * 30}px`, rotate: `${(x < 200 ? -1 : 1) * snap * 14}deg` }}>
      <Icon d={d} size={56} color={INK} />
    </div>
  );
  return (
    <div style={{ position: "absolute", left: 60, top: 260, width: 420, height: 140, opacity: Math.min(1, p * 1.5) * (1 - out) * (1 - snap * 0.6) }}>
      <svg width={420} height={140} style={{ position: "absolute", inset: 0 }}>
        {[0, 1, 2, 3, 4].map((k) => {
          const x = 120 + k * 40;
          const broken = k === 2 ? snap : 0;
          return <ellipse key={k} cx={x + (k < 2 ? -snap * 40 : k > 2 ? snap * 40 : 0)} cy={55 + snap * 30} rx={24} ry={13} fill="none" stroke={W} strokeWidth={6} opacity={1 - broken} transform={`rotate(${k % 2 ? 90 : 0} ${x} 55)`} />;
        })}
      </svg>
      {icon("M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z", 0)}
      {icon("M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zM22 6l-10 7L2 6", 300)}
    </div>
  );
};

/** "...embeds your specialty practice directly into the GP's daily workflow": the GP's day, with ToothReferral in it. */
const Workflow: React.FC = () => {
  const frame = useCurrentFrame();
  const { p, out, on } = win(frame, T.embeds - 6, T.zero3 - 4);
  if (!on) return null;
  const embed = sp(frame, T.embeds + 4, 12, 180);
  const sent = sp(frame, T.workflow, 12, 220);
  const rows = [
    { t: "8:30", n: "Cleaning · J. Carter" },
    { t: "9:15", n: "Exam · Maria Alvarez", hot: true },
    { t: "10:00", n: "Crown prep · P. Shah" },
  ];
  return (
    <div style={{ position: "absolute", left: 46, top: 170, width: 500, opacity: Math.min(1, p * 1.5) * (1 - out), translate: `${(1 - p) * -60}px 0px`, filter: out > 0 ? `blur(${out * 8}px)` : undefined }}>
      <div style={{ ...CARD, padding: "22px 24px" }}>
        <div style={{ fontSize: 18, fontWeight: 700, color: "#8A8799", letterSpacing: 1.5, textTransform: "uppercase" }}>GP's day · Bright Smile Dental</div>
        {rows.map((r, i) => (
          <div key={i} style={{ padding: "14px 0", borderTop: i ? "1.5px solid #EEECF3" : undefined, marginTop: i ? 0 : 10 }}>
            <div style={{ display: "flex", gap: 14, alignItems: "baseline" }}>
              <div style={{ width: 66, fontSize: 21, fontWeight: 700, color: "#8A8799" }}>{r.t}</div>
              <div style={{ fontSize: 24, fontWeight: 700 }}>{r.n}</div>
            </div>
            {r.hot && (
              <div style={{ marginLeft: 80, marginTop: 10, display: "inline-flex", alignItems: "center", gap: 10, padding: "10px 16px", borderRadius: 14, background: sent > 0.5 ? TR.green : TR.purple, color: W, fontSize: 21, fontWeight: 700, scale: String(embed), transformOrigin: "0% 50%", opacity: Math.min(1, embed * 2), boxShadow: `0 10px 24px ${TR.purple}55` }}>
                <Icon d={sent > 0.5 ? ICON.check : ICON.send} size={22} color={W} />
                {sent > 0.5 ? "Referral sent · Endo Specialists" : "Refer to Endo Specialists"}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

/** The three feature cards. */
const Feature: React.FC<{ n: string; title: string; from: number; to: number; children: React.ReactNode }> = ({ n, title, from, to, children }) => {
  const frame = useCurrentFrame();
  const { p, out, on } = win(frame, from, to);
  if (!on) return null;
  return (
    <div style={{ position: "absolute", left: 46, top: 170, width: 500, opacity: Math.min(1, p * 1.5) * (1 - out), translate: `${(1 - p) * -70}px 0px`, rotate: `${(1 - p) * -4}deg`, filter: out > 0 ? `blur(${out * 8}px)` : undefined }}>
      <div style={{ ...CARD, padding: "22px 26px", overflow: "hidden" }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 14 }}>
          <div style={{ ...TYPE, fontSize: 30, color: TR.purple }}>{n}</div>
          <div style={{ ...TYPE, fontSize: 40, letterSpacing: "-0.035em" }}>{title}</div>
        </div>
        <div style={{ marginTop: 14 }}>{children}</div>
      </div>
    </div>
  );
};
const Tick: React.FC<{ label: string; a: number }> = ({ label, a }) => {
  const frame = useCurrentFrame();
  const k = sp(frame, a, 12, 220);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "10px 0", opacity: Math.min(1, k * 2), translate: `0px ${(1 - k) * 12}px` }}>
      <div style={{ width: 38, height: 38, borderRadius: 19, background: TR.green, display: "flex", alignItems: "center", justifyContent: "center", scale: String(k) }}>
        <Icon d={ICON.check} size={24} color={W} />
      </div>
      <div style={{ fontSize: 26, fontWeight: 700 }}>{label}</div>
    </div>
  );
};
const Status: React.FC = () => {
  const frame = useCurrentFrame();
  const steps = [
    { t: "Received", a: T.sees - 2 },
    { t: "Scheduled", a: T.real - 6 },
    { t: "Completed", a: T.closing },
  ];
  const noPhone = sp(frame, T.without, 11, 220);
  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        {steps.map((s, i) => {
          const k = sp(frame, s.a, 12, 220);
          return (
            <React.Fragment key={i}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, width: 120 }}>
                <div style={{ width: 40, height: 40, borderRadius: 20, background: k > 0.5 ? TR.purple : "#E7E5EE", display: "flex", alignItems: "center", justifyContent: "center", scale: String(1 + 0.15 * Math.sin(Math.PI * Math.min(1, k))), boxShadow: k > 0.5 ? `0 0 18px ${TR.purple}88` : undefined }}>
                  {k > 0.5 && <Icon d={ICON.check} size={22} color={W} />}
                </div>
                <div style={{ fontSize: 19, fontWeight: 700, color: k > 0.5 ? INK : "#A9A6B8" }}>{s.t}</div>
              </div>
              {i < 2 && <div style={{ flex: 1, height: 5, borderRadius: 3, marginBottom: 26, background: `linear-gradient(90deg, ${TR.purple} ${ramp(frame, steps[i].a, steps[i + 1].a) * 100}%, #E7E5EE 0)` }} />}
            </React.Fragment>
          );
        })}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 14, opacity: Math.min(1, noPhone * 2) }}>
        <div style={{ position: "relative", width: 40, height: 40 }}>
          <Icon d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" size={40} color="#A9A6B8" />
          <div style={{ position: "absolute", left: -4, top: 18, width: 48 * noPhone, height: 5, background: RED, rotate: "-40deg", borderRadius: 3 }} />
        </div>
        <div style={{ fontSize: 23, fontWeight: 700 }}>the GP sees it live, no calls</div>
      </div>
    </div>
  );
};
const Engine: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame - T.engine;
  const chip = sp(frame, T.indispensable - 2, 12, 200);
  const dots = [0, 1, 2, 3].map((k) => ((t / 26 + k / 4) % 1 + 1) % 1);
  return (
    <div>
      <div style={{ position: "relative", height: 110 }}>
        <div style={{ position: "absolute", left: 0, top: 26, padding: "12px 20px", borderRadius: 999, background: "#F1EDFF", ...TYPE, fontSize: 28, color: TR.purple }}>GP</div>
        <div style={{ position: "absolute", right: 0, top: 26, padding: "12px 20px", borderRadius: 999, background: TR.purple, ...TYPE, fontSize: 28, color: W }}>you</div>
        <div style={{ position: "absolute", left: 80, right: 92, top: 52, height: 4, background: "#E7E5EE", borderRadius: 2 }} />
        {dots.map((u, i) => (
          <div key={i} style={{ position: "absolute", left: `calc(80px + (100% - 172px) * ${i % 2 ? 1 - u : u})`, top: 46, width: 16, height: 16, borderRadius: 8, background: i % 2 ? TR.green : TR.purple, boxShadow: `0 0 12px ${i % 2 ? TR.green : TR.purple}` }} />
        ))}
        <div style={{ position: "absolute", left: "50%", top: 70, translate: "-50% 0px", fontSize: 20, fontWeight: 800, color: "#8A8799" }}>always on · 24/7</div>
      </div>
      <div style={{ display: "inline-flex", alignItems: "center", gap: 10, marginTop: 6, padding: "10px 16px", borderRadius: 14, background: YELLOW, ...TYPE, letterSpacing: "-0.02em", fontSize: 25, scale: String(chip), transformOrigin: "0% 50%", opacity: Math.min(1, chip * 2) }}>
        their most indispensable partner
      </div>
    </div>
  );
};

/** "Not just another specialist sending branded swag": the swag line-up, greyed and struck. */
const SwagStruck: React.FC = () => {
  const frame = useCurrentFrame();
  const { p, out, on } = win(frame, T.not - 2, T.stop2 - 4);
  if (!on) return null;
  const strike = ramp(frame, T.branded2, T.branded2 + 10, easeOut);
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: 120, display: "flex", justifyContent: "center", opacity: Math.min(1, p * 1.5) * (1 - out) }}>
      <div style={{ position: "relative", display: "flex", alignItems: "flex-end", gap: 40, padding: "18px 36px", borderRadius: 28, background: "rgba(255,255,255,0.12)", border: "1.5px solid rgba(255,255,255,0.25)", scale: String(interpolate(p, [0, 1], [0.85, 1])) }}>
        <Bottle size={130} grey={strike > 0.5} />
        <Pen size={130} grey={strike > 0.5} />
        <ChocBox size={170} grey={strike > 0.5} />
        <div style={{ position: "absolute", left: 10, top: "50%", height: 10, width: `${strike * 96}%`, background: RED, borderRadius: 5, rotate: "-6deg" }} />
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------------------------------
// Chapter 5: the close

/** GPs and specialists come back together: a two-way link (the callback to chapter 2). */
const TwoWay: React.FC = () => {
  const frame = useCurrentFrame();
  const { p, out, on } = win(frame, T.start2 - 2, T.upgrade - 4);
  if (!on) return null;
  const join = ramp(frame, T.start2, T.two + 8, easeIO);
  const gx = 540 - 300 + join * 120;
  const sx = 540 + 300 - join * 120;
  const flow = ((frame - T.two) / 20) % 1;
  return (
    <AbsoluteFill style={{ opacity: Math.min(1, p * 1.5) * (1 - out) }}>
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        <line x1={gx + 70} y1={215} x2={sx - 110} y2={215} stroke={W} strokeWidth={5} opacity={join} />
        <line x1={gx + 70} y1={255} x2={sx - 110} y2={255} stroke={YELLOW} strokeWidth={5} opacity={join} />
        {frame > T.two &&
          [0, 1].map((k) => {
            const u = (flow + k * 0.5) % 1;
            return (
              <g key={k}>
                <circle cx={gx + 70 + (sx - gx - 180) * u} cy={215} r={8} fill={W} />
                <circle cx={sx - 110 - (sx - gx - 180) * u} cy={255} r={8} fill={YELLOW} />
              </g>
            );
          })}
      </svg>
      <Node label="GPs" x={gx} y={235} color={W} s={p} />
      <Node label="you" x={sx} y={235} color={YELLOW} s={p} />
    </AbsoluteFill>
  );
};

/** Close: the logo above the head while he says the line, then the end card over a soft freeze. */
const EndCard: React.FC = () => {
  const frame = useCurrentFrame();
  if (frame < T.upgrade - 2) return null;
  const card = ramp(frame, CUT_FRAMES - 6, CUT_FRAMES + 10, easeIO);
  const url = sp(frame, CUT_FRAMES + 6, 14, 160);
  const btn = sp(frame, CUT_FRAMES + 12, 13, 170);
  return (
    <>
      <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 45%, rgba(27,18,64,0.55), rgba(16,10,40,0.92))`, opacity: card }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: interpolate(card, [0, 1], [90, 690]), display: "flex", justifyContent: "center", scale: String(interpolate(card, [0, 1], [1, 1.25])), filter: "drop-shadow(0 4px 18px rgba(8,4,24,0.55))" }}>
        <Sequence from={T.upgrade - 2} layout="none">
          <LogoReveal at={0} width={440} revealDur={18} shineDur={28} />
        </Sequence>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 1000, textAlign: "center", opacity: url, translate: `0px ${(1 - url) * 16}px`, ...TYPE, fontSize: 52, color: W, letterSpacing: "-0.03em" }}>toothreferral.com</div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 1100, display: "flex", justifyContent: "center", opacity: Math.min(1, btn * 1.5), scale: String(interpolate(btn, [0, 1], [0.8, 1])) }}>
        <div style={{ padding: "22px 40px", borderRadius: 22, background: YELLOW, color: INK, ...TYPE, letterSpacing: "-0.03em", fontSize: 40, boxShadow: "0 16px 40px rgba(10,6,24,0.45)" }}>upgrade your referral pipeline →</div>
      </div>
    </>
  );
};

// ---------------------------------------------------------------------------------------------------
// The edit

/** Static mask of the mic and boom arm (camera locked off); keeps the mic in front of anything behind him. */
const MIC: React.CSSProperties = {
  maskImage: `url(${staticFile("cutouts/cb-cut-mic.png")})`,
  WebkitMaskImage: `url(${staticFile("cutouts/cb-cut-mic.png")})`,
  maskSize: "100% 100%",
  WebkitMaskSize: "100% 100%",
};

export const ChocolateBox: React.FC = () => {
  const frame = useCurrentFrame();
  const f0 = Math.min(frame, CUT_FRAMES - 1);
  const fr = framingAt(f0);
  const freeze = frame >= CUT_FRAMES - 1;
  const grade: React.CSSProperties = { filter: "contrast(1.06) saturate(1.04) brightness(1.01)" };
  const speaker = (layer: "full" | "cutout", style?: React.CSSProperties) => {
    const el = <TalentLayer talent={TL} layer={layer} framing={fr} style={{ ...grade, ...style }} />;
    return freeze ? <Freeze frame={CUT_FRAMES - 2}>{el}</Freeze> : el;
  };
  // chapter "kick": a short push with motion blur across each chapter change
  const kick = Math.max(0, ...KICKS.map((k) => Math.max(0, 1 - Math.abs(frame - k) / 7)));
  const kickScale = 1 + 0.07 * easeIO(kick);
  // "flip the script": the whole frame turns over on its vertical axis
  const F = T.flip;
  const flipA = frame >= F - 8 && frame < F ? interpolate(frame, [F - 8, F], [0, 90]) : frame >= F && frame < F + 8 ? interpolate(frame, [F, F + 8], [-90, 0]) : 0;
  const endBlur = interpolate(frame, [CUT_FRAMES - 6, CUT_FRAMES + 10], [0, 14], clamp);
  return (
    <AbsoluteFill style={{ background: "#0F0B1C" }}>
      <FontGate>
        <AbsoluteFill style={{ perspective: 2200 }}>
          <AbsoluteFill style={{ transform: `rotateY(${flipA}deg)`, backfaceVisibility: "hidden" }}>
            <AbsoluteFill style={{ scale: String(kickScale), filter: kick > 0.05 ? `blur(${kick * 5}px)` : endBlur > 0 ? `blur(${endBlur}px)` : undefined }}>
              {speaker("full")}
              <BrandWall />
              {/* behind the speaker */}
              <BigWord from={T.fifty - 4} to={T.bottle - 30} text="$50,000" size={190} count={{ to: 50000, prefix: "$", dur: 22 }} />
              <SwagAndScale />
              <BigWord from={T.swag - 3} to={T.surprised - 8} text="swag." />
              <DyingChart />
              <Apart />
              <BigWord from={T.zero1 - 4} to={T.transaction + 12} text="zero loyalty" size={150} top={170} />
              <BigWord from={T.it - 2} to={T.cuz - 2} text="skill." color={W} strikeAt={T.skill + 2} />
              <BigWord from={T.zero2 - 4} to={T.ask - 6} text="zero" size={260} />
              <BigWord from={F + 8} to={T.dentists - 6} text="flip." size={250} />
              <BigWord from={T.candy - 4} to={T.start2 - 4} text="candy." />
              <TwoWay />
              {speaker("cutout", frame >= WALL_AT ? { filter: "contrast(1.06) saturate(1.04) drop-shadow(0 24px 50px rgba(4,2,20,0.45))" } : undefined)}
              {speaker("full", MIC)}
            </AbsoluteFill>
            {/* in front */}
            <OpeningTitle to={at("you", 1) + 8} />
            <InHouse />
            <AdPhone />
            <Interrogation />
            <SelfCheck />
            <NoChocolates />
            <Wants />
            <Sequence from={T.tooth1 - 4} durationInFrames={T.instead - T.tooth1 + 2} layout="none">
              <div style={{ position: "absolute", left: 0, right: 0, top: 120, display: "flex", justifyContent: "center", filter: "drop-shadow(0 4px 18px rgba(8,4,24,0.55))" }}>
                <LogoReveal at={0} width={460} revealDur={18} shineDur={28} />
              </div>
            </Sequence>
            <Chains />
            <Workflow />
            <Feature n="01" title="zero friction" from={T.zero3 - 2} to={T.automatic - 4}>
              <Tick label="no more chasing x-rays" a={T.xrays2 - 4} />
              <Tick label="insurance details included" a={T.insurance2 - 4} />
            </Feature>
            <Feature n="02" title="automatic transparency" from={T.automatic - 2} to={T.engine - 4}>
              <Status />
            </Feature>
            <Feature n="03" title="24/7 relationship engine" from={T.engine - 2} to={T.not - 6}>
              <Engine />
            </Feature>
            <SwagStruck />
            {CH.map((_, i) => (
              <Chapter key={i} i={i} />
            ))}
            {frame < CUT_FRAMES - 4 && <Captions />}
            <EndCard />
          </AbsoluteFill>
        </AbsoluteFill>
        {/* finish: a soft vignette over everything */}
        <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 42%, transparent 55%, rgba(8,5,18,0.38) 100%)", pointerEvents: "none" }} />
      </FontGate>

      <Audio src={staticFile("audio/voice/cb-cut.wav")} />
      <Audio src={staticFile("audio/music/cb-bed.ogg")} volume={(f) => 0.075 * interpolate(f, [0, 20, CB_DURATION - 45, CB_DURATION - 1], [0, 1, 1, 0], clamp)} />
      {[
        { f: 2, s: "impact", v: 0.16 },
        { f: T.fifty - 4, s: "riser", v: 0.1 },
        { f: T.plastic - 2, s: "pop-1", v: 0.14 },
        { f: T.pen - 4, s: "pop-2", v: 0.14 },
        { f: T.chocolates - 6, s: "pop-3", v: 0.14 },
        { f: T.profit + 14, s: "thud", v: 0.16 },
        { f: T.stop, s: "flatline", v: 0.08 },
        ...KICKS.map((k) => ({ f: k - 5, s: "whoosh-short", v: 0.18 })),
        { f: T.pies - 2, s: "pop-1", v: 0.14 },
        { f: T.house - 2, s: "thud", v: 0.14 },
        { f: T.bypass - 2, s: "blip-2", v: 0.14 },
        { f: T.skill + 2, s: "click", v: 0.16 },
        { f: T.calling, s: "blip-1", v: 0.14 },
        { f: T.hey - 3, s: "pop-2", v: 0.16 },
        { f: T.whats - 3, s: "pop-3", v: 0.16 },
        { f: T.handouts + 4, s: "click", v: 0.16 },
        { f: F - 8, s: "whoosh-long", v: 0.2 },
        { f: T.dont, s: "thud", v: 0.12 },
        { f: T.predictability - 2, s: "tick-1", v: 0.14 },
        { f: T.speed - 2, s: "tick-2", v: 0.14 },
        { f: T.respect - 2, s: "tick-3", v: 0.14 },
        { f: T.tooth1, s: "shimmer", v: 0.16 },
        { f: T.tooth2 - 4, s: "impact", v: 0.1 },
        { f: T.workflow, s: "chime", v: 0.13 },
        { f: T.xrays2 - 4, s: "tick-4", v: 0.14 },
        { f: T.insurance2 - 4, s: "tick-5", v: 0.14 },
        { f: T.closing, s: "chime", v: 0.12 },
        { f: T.branded2, s: "click", v: 0.14 },
        { f: T.two, s: "shimmer", v: 0.12 },
        { f: CUT_FRAMES - 6, s: "whoosh-long", v: 0.16 },
      ].map((x, i) => (
        <Sequence key={i} from={Math.max(0, x.f)} layout="none">
          <Audio src={staticFile(`audio/sfx/${x.s}.wav`)} volume={x.v} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

