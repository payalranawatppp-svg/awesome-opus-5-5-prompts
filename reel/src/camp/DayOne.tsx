/**
 * "Day One": the founder's selfie story (Script 19-A, solo version). 15 Google Flow clips, cut at the pauses into one
 * take (scratchpad d1/cut.py -> public/footage/d1-cut.mp4, segment list in data/d1-edl.json), one voice for the whole
 * piece (ElevenLabs speech-to-speech, aligned at 0 ms, -14 LUFS), word timings in data/transcript-d1.json.
 *
 * Clean-up done in the cut or here:
 *   - duplicate takes dropped (u02 = u03, u09/u11 = u10; u09 had a blurred hand sweeping the frame)
 *   - burned-in captions in u01 and u03 (y 1453-1497) pushed out of frame with a 1.35x top-anchored punch-in
 *   - u14: the phone handset pops into her hand (~3.85 s in the source) -> fully covered by the live-status insert
 *   - u15: the hard jump to the glass door at ~5.2 s is cut off (the clip ends at 4.6 s)
 *   - every join inside one clip alternates a small punch-in so jump cuts read as edits, not glitches
 * Inserts use the real Tooth Referral screens (public/camp, public/dash3c) and the editing-kit motion
 * (head stack chips, checklist, impact stamp, blow away, live cursor, toast, counters).
 * Demo data: offices and the patient are fictional; the founder is never named.
 */
import React from "react";
import { AbsoluteFill, Audio, Img, OffthreadVideo, Sequence, interpolate, spring, staticFile, useCurrentFrame } from "remotion";
import transcript from "../data/transcript-d1.json";
import edl from "../data/d1-edl.json";
import faces from "../data/d1-faces.json";
import { FontGate } from "../effects/shared";
import { FONT_UI } from "../theme";
import { ICON, Icon, TR, clamp } from "../tr/ui";

const FPS = 30;
const CUT = edl.duration;
const TAIL = 3.2;
export const DAYONE_DURATION = Math.round((CUT + TAIL) * FPS);

const YELLOW = "#F3DD72";
const INK = "#16131F";
const W = "#FFFFFF";
const PURPLE = TR.purple;
const AMBER = "#E89D15";
const GREEN = "#1FA463";
const SOFT = "0 2px 16px rgba(10,6,24,0.55), 0 1px 3px rgba(10,6,24,0.5)";
const CARD: React.CSSProperties = { background: "#fff", borderRadius: 30, boxShadow: "0 30px 70px rgba(10,6,30,0.38), 0 2px 8px rgba(10,6,30,0.14)", fontFamily: FONT_UI, color: INK, overflow: "hidden" };

const easeOut = (x: number) => 1 - Math.pow(1 - Math.min(1, Math.max(0, x)), 3);
const easeIO = (x: number) => { const t = Math.min(1, Math.max(0, x)); return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; };
const ramp = (t: number, a: number, b: number, e = easeOut) => e(interpolate(t, [a, b], [0, 1], clamp));
const sp = (t: number, at: number, damping = 15, stiffness = 170) => (t < at ? 0 : spring({ frame: (t - at) * FPS, fps: FPS, config: { damping, stiffness, mass: 0.7 } }));
const rand = (s: number) => { const x = Math.sin(s * 12.9898 + 78.233) * 43758.5453; return x - Math.floor(x); };

// ---------------------------------------------------------------------------------------------------
// Words and timing

type Word = { word: string; start: number; end: number };
const WORDS = (transcript as unknown as { d1: { words: Word[] } }).d1.words;
const norm = (w: string) => w.toLowerCase().replace(/[^a-z0-9]/g, "");
const at = (word: string, n = 1) => {
  const hits = WORDS.filter((w) => norm(w.word) === word);
  if (!hits[n - 1]) throw new Error(`"${word}" #${n} not in transcript`);
  return hits[n - 1].start;
};
const T = {
  fourteen: at("14"), loan: at("one", 2), paint: at("building"),
  ops: at("two"), micro: at("microscope"), cbct: at("cbct"),
  what: at("what", 1), okay: at("okay"), doctor: at("doctors"), patientN: at("patients", 2) /* "patient's" */, social: at("social"),
  submit: at("submit"), email: at("email"), inbox: at("inbox"), maybe: at("maybe"), nobody: at("nobody", 1),
  and2: at("and", 3), contact: at("contact"), so: at("so", 1), sits: at("sits"), website2: at("website", 2), logo: at("logo"),
  ins: at("insurance", 1), known: at("known"), hipaa: at("hipaa"), encrypted: at("encrypted"),
  pick: at("pick"), tap: at("tap"), attach: at("attach"), three: at("three"), uploads: at("uploads"), secure: at("secure"),
  every: at("every", 1), track: at("track"), form3: at("form", 3), invited: at("invited"), gentle1: at("gentle", 1),
  that: at("that", 2), aRef: at("referral", 4), gentle2: at("gentle", 2), root: at("root"), tooth19: at("19"),
  xrays: at("x", 2), uploaded: at("uploaded"), our: at("our"), calling: at("calling"), and5: at("and", 6),
  sees: at("sees"), nobody2: at("nobody", 2), starting: at("starting"),
};
// the handset pops into her hand in segment 17 (clip 14b); it is covered from before the segment starts to its end
const SEG = edl.segments;
const COVER_IN = SEG[17].start - 0.22;
const COVER_OUT = SEG[18].start;

// ---------------------------------------------------------------------------------------------------
// Layout: while a product card is up, the footage slides down so her face sits in the lower half and the card gets
// a clear panel above her head (nothing is ever drawn over her face). Face spans per segment: data/d1-faces.json
// (OpenCV face detection on the cut, padded for hair and head movement, worst-case zoom).

const FACES = faces as { i: number; top: number; bot: number }[];
/** how far each segment's footage moves down in split mode: chin lands at y <= 1640, above the captions */
const SHIFT = FACES.map((f) => Math.max(300, Math.min(700, 1640 - f.bot)));
const segIndex = (t: number) => Math.max(0, SEG.findIndex((s, k) => t >= s.start && (k === SEG.length - 1 || t < SEG[k + 1].start)));
const SPLITS: [number, number][] = [[T.fourteen - 0.3, T.nobody + 0.05], [T.and2 - 0.2, COVER_IN]];
const splitK = (t: number) => Math.max(0, ...SPLITS.map(([a, b]) => Math.min(ramp(t, a, a + 0.4, easeIO), 1 - ramp(t, b - 0.05, b + 0.35, easeIO))));
/** the smallest panel any segment under this card allows */
const zoneFor = (a: number, b: number) => Math.min(...SEG.map((s, i) => (s.start < b && s.start + s.dur > a ? SHIFT[i] : 1e9)));
const ZONE_TOP = 70;

// ---------------------------------------------------------------------------------------------------
// Footage: per-segment framing

const framing = (t: number) => {
  const i = Math.max(0, SEG.findIndex((s, k) => t >= s.start && (k === SEG.length - 1 || t < SEG[k + 1].start)));
  const s = SEG[i];
  const local = t - s.start;
  const drift = 0.018 * Math.min(1, local / Math.max(1.5, s.dur));
  // alternate a punch-in on joins that stay inside the same clip
  let run = 0;
  for (let k = i; k > 0 && SEG[k - 1].clip === SEG[k].clip; k--) run++;
  const punch = run % 2 ? 0.075 : 0;
  if (s.zoom === "top135") return { scale: 1.35 + punch * 0.6 + drift, origin: "50% 0%" };
  return { scale: 1.02 + punch + drift, origin: "50% 32%" };
};

const Footage: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const f = framing(t);
  const k = splitK(t);
  const dy = k * SHIFT[segIndex(t)];
  return (
    <AbsoluteFill style={{ background: "linear-gradient(170deg, #FBFAFF 0%, #EFEAFF 60%, #E6DEFF 100%)", overflow: "hidden" }}>
      <AbsoluteFill style={{ backgroundImage: "radial-gradient(rgba(109,74,232,0.12) 1.5px, transparent 1.6px)", backgroundSize: "36px 36px", backgroundPosition: `${(t * 10) % 36}px ${(t * 6) % 36}px` }} />
      <AbsoluteFill style={{ translate: `0 ${dy}px`, borderRadius: 48 * k, overflow: "hidden", boxShadow: k > 0 ? `0 -18px 60px rgba(20,10,60,${0.3 * k})` : undefined, background: "#000" }}>
        <AbsoluteFill style={{ scale: String(f.scale), transformOrigin: f.origin }}>
          <OffthreadVideo src={staticFile("footage/d1-cut.mp4")} muted style={{ width: 1080, height: 1920, objectFit: "cover" }} />
        </AbsoluteFill>
        <AbsoluteFill style={{ background: "radial-gradient(120% 80% at 50% 35%, rgba(0,0,0,0) 55%, rgba(8,6,20,0.28) 100%)" }} />
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(8,6,20,0) 70%, rgba(8,6,20,0.45) 100%)" }} />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------------------------------
// Captions (word by word, sentence case, one key word marked), as in Buried in Emails

const KEY = new Set(["day", "loan", "patients", "website", "referral", "ssn", "email", "inbox", "maybe", "business", "contact", "toothreferral", "logo", "hipaa", "encrypted", "procedure", "tooth", "xrays", "secure", "track", "live", "five", "first", "19", "uploaded", "update", "hard"]);
type Tok = { t: string; at: number; end: number; key: boolean };
const TOKS: Tok[] = (() => {
  const out: Tok[] = [];
  for (const w of WORDS) {
    const t = w.word.trim();
    const prev = out[out.length - 1];
    if (prev && t.startsWith("-")) { prev.t += t; prev.end = w.end; continue; }
    if (prev && prev.t.toLowerCase() === "tooth" && /^referral/i.test(t) && w.start - prev.end < 0.3 && prev.at > 30 && prev.at < 40) {
      prev.t = "Tooth Referral" + t.slice(8); prev.end = w.end; prev.key = true; continue;
    }
    out.push({ t: t.toLowerCase() === "x" ? "X" : t, at: w.start, end: w.end, key: false });
  }
  const seen = new Set<string>();
  for (const o of out) {
    const n = norm(o.t);
    // mark a key word once per sentence-ish chunk
    if (o.key || (KEY.has(n) && !seen.has(n + Math.floor(o.at / 6)))) { o.key = true; seen.add(n + Math.floor(o.at / 6)); }
  }
  // the first "referral" (designer's template referral form) and "first" in "our first patient" read better unmarked
  return out;
})();
const CHUNKS = (() => {
  const chunks: { words: Tok[]; from: number; to: number }[] = [];
  let cur: Tok[] = [];
  const flush = () => { if (cur.length) chunks.push({ words: cur, from: cur[0].at - 0.04, to: cur[cur.length - 1].end + 0.35 }); cur = []; };
  for (const tk of TOKS) {
    const len = cur.map((x) => x.t).join(" ").length;
    if (cur.length && (cur.length >= 4 || len + tk.t.length > 22)) flush();
    cur.push(tk);
    if (/[.,?!:]$/.test(tk.t)) flush();
  }
  flush();
  for (let i = 0; i < chunks.length - 1; i++) chunks[i].to = Math.min(chunks[i].to, chunks[i + 1].from);
  // one key word per chunk at most
  for (const c of chunks) { let k = 0; for (const w of c.words) if (w.key && k++ > 0) w.key = false; }
  return chunks;
})();

const Captions: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const c = CHUNKS.find((x) => t >= x.from && t < x.to);
  if (!c || t >= CUT - 0.1) return null;
  const out = interpolate(t, [c.to - 0.13, c.to], [0, 1], clamp);
  const light = t >= COVER_IN + 0.15 && t < COVER_OUT; // on the light status screen the words turn dark
  const fg = light ? INK : W;
  const stroke: React.CSSProperties = light ? {} : { WebkitTextStroke: "9px rgba(12,8,26,0.72)", paintOrder: "stroke fill" };
  return (
    <div style={{ position: "absolute", left: 50, right: 50, top: 1530 + 180 * splitK(t), textAlign: "center", fontFamily: FONT_UI, fontWeight: 800, letterSpacing: "-0.025em", lineHeight: 1.12, fontSize: 62, color: fg, textShadow: light ? "none" : SOFT, opacity: 1 - out, filter: out > 0 ? `blur(${out * 6}px)` : undefined }}>
      {c.words.map((w, i) => {
        const k = interpolate(t, [w.at - 0.07, w.at + 0.1], [0, 1], clamp);
        const hot = w.key && t >= w.at;
        return (
          <span key={i} style={{ display: "inline-block", marginRight: i < c.words.length - 1 ? (hot ? "0.14em" : "0.22em") : 0, marginLeft: hot ? "-0.08em" : 0, opacity: k, translate: `0px ${(1 - k) * 10}px`, filter: k < 1 ? `blur(${(1 - k) * 5}px)` : undefined, padding: hot ? "0 0.14em" : undefined, borderRadius: 12, background: hot ? YELLOW : undefined, color: hot ? INK : fg, textShadow: hot || light ? "none" : SOFT, ...(hot ? {} : stroke), boxShadow: hot ? "0 8px 24px rgba(10,6,24,0.35)" : undefined }}>
            {w.t}
          </span>
        );
      })}
    </div>
  );
};

// ---------------------------------------------------------------------------------------------------
// Building blocks

/** Card that springs up into place and leaves with a quick scale-down and blur. */
const Pop: React.FC<{ t: number; t0: number; t1: number; h: number; w?: number; tilt?: number; children: React.ReactNode; style?: React.CSSProperties }> = ({ t, t0, t1, h, w = 900, tilt = 0, children, style }) => {
  if (t < t0 - 0.05 || t > t1 + 0.3) return null;
  const p = sp(t, t0, 16, 150);
  const g = ramp(t, t1, t1 + 0.25, easeIO);
  const avail = zoneFor(t0, t1 + 0.3) - ZONE_TOP - 55;
  const fit = Math.min(1, avail / h, 1000 / w);
  const top = ZONE_TOP + Math.max(0, (avail - h * fit) / 2);
  return (
    <div style={{ position: "absolute", left: (1080 - w) / 2, top, width: w, transformOrigin: "50% 0%", opacity: Math.min(1, p * 1.4) * (1 - g), translate: `0 ${(1 - p) * -60 - g * 20}px`, scale: String(fit * (0.9 + 0.1 * p) * (1 - g * 0.06)), rotate: `${tilt * (1 - p * 0.6)}deg`, filter: p < 0.6 || g > 0 ? `blur(${Math.max((0.6 - p) * 10, g * 8)}px)` : undefined, ...style }}>
      {children}
    </div>
  );
};

type Box = [number, number, number, number];
/** A real screen, cropped and slowly pushed in, with highlight boxes drawn in image pixels. */
const Screen: React.FC<{ t: number; t0: number; src: string; iw: number; crop: { x: number; y: number; w: number }; w: number; h: number; push?: number; hl?: { box: Box; at: number; c?: string }[]; children?: React.ReactNode }> = ({ t, t0, src, iw, crop, w, h, push = 0.05, hl = [], children }) => {
  const k = ramp(t, t0, t0 + 6, (x) => x);
  const cw = crop.w * (1 - push * k);
  const s = w / cw;
  const cx = crop.x + (crop.w - cw) / 2;
  const cy = crop.y + (crop.w - cw) * 0.25;
  return (
    <div style={{ position: "relative", width: w, height: h, overflow: "hidden", background: "#fff" }}>
      <Img src={staticFile(src)} style={{ position: "absolute", left: -cx * s, top: -cy * s, width: iw * s, maxWidth: "none" }} />
      {hl.map((b, i) => {
        const p = sp(t, b.at, 14, 190);
        if (p <= 0) return null;
        const [bx, by, bw, bh] = b.box;
        return <div key={i} style={{ position: "absolute", left: (bx - cx) * s, top: (by - cy) * s, width: bw * s, height: bh * s, borderRadius: 14, border: `5px solid ${b.c ?? PURPLE}`, background: `${b.c ?? PURPLE}14`, opacity: Math.min(1, p * 1.3), scale: String(1.15 - 0.15 * p), boxShadow: `0 0 0 ${(1 - p) * 18}px ${b.c ?? PURPLE}22` }} />;
      })}
      {children}
    </div>
  );
};

const Chip: React.FC<{ t: number; at: number; children: React.ReactNode; bg?: string; color?: string; icon?: string; size?: number; style?: React.CSSProperties }> = ({ t, at: a, children, bg = "#fff", color = INK, icon, size = 40, style }) => {
  const p = sp(t, a, 13, 200);
  if (p <= 0) return null;
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 14, padding: `${size * 0.42}px ${size * 0.7}px`, borderRadius: 999, background: bg, color, fontFamily: FONT_UI, fontWeight: 800, fontSize: size, letterSpacing: "-0.02em", boxShadow: "0 16px 40px rgba(10,6,30,0.32)", opacity: Math.min(1, p * 1.5), scale: String(0.6 + 0.4 * p), translate: `0 ${(1 - p) * 30}px`, transformOrigin: "0% 50%", ...style }}>
      {icon ? <Icon d={icon} size={size * 0.95} color={color === INK ? PURPLE : color} /> : null}
      {children}
    </div>
  );
};

/** Typewriter label (head-stack effect). */
const Type: React.FC<{ t: number; at: number; text: string; cps?: number }> = ({ t, at: a, text, cps = 26 }) => {
  const n = Math.max(0, Math.min(text.length, Math.floor((t - a) * cps)));
  const caret = t >= a && n < text.length;
  return <>{text.slice(0, n)}<span style={{ opacity: caret ? 1 : 0 }}>|</span></>;
};

const Tick: React.FC<{ t: number; at: number; size?: number; color?: string }> = ({ t, at: a, size = 46, color = GREEN }) => {
  const p = sp(t, a, 12, 220);
  return (
    <div style={{ width: size, height: size, borderRadius: size, flex: "none", background: p > 0 ? color : "#E7E8EE", display: "flex", alignItems: "center", justifyContent: "center", scale: String(0.7 + 0.3 * Math.max(p, 0.001)) }}>
      {p > 0 ? <svg width={size * 0.62} height={size * 0.62} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={3.4} strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" strokeDasharray={24} strokeDashoffset={24 * (1 - Math.min(1, p))} /></svg> : null}
    </div>
  );
};

const Browser: React.FC<{ url: string; children: React.ReactNode; logo?: boolean; t?: number; logoAt?: number }> = ({ url, children, logo, t = 0, logoAt = 0 }) => {
  const lp = logo ? sp(t, logoAt, 14, 180) : 0;
  return (
    <div style={CARD}>
      <div style={{ height: 70, background: "#F1F0F6", display: "flex", alignItems: "center", gap: 12, padding: "0 24px", borderBottom: "1px solid #E4E2EE" }}>
        {[0, 1, 2].map((i) => <div key={i} style={{ width: 16, height: 16, borderRadius: 16, background: "#CFCBDD" }} />)}
        <div style={{ marginLeft: 16, flex: 1, height: 42, borderRadius: 21, background: "#fff", display: "flex", alignItems: "center", gap: 10, padding: "0 18px", fontSize: 24, color: TR.muted, fontWeight: 600 }}>
          <Icon d="M7 11V7a5 5 0 0 1 10 0v4M5 11h14v10H5z" size={22} color={GREEN} />{url}
        </div>
      </div>
      {logo ? (
        <div style={{ height: 96, display: "flex", alignItems: "center", gap: 18, padding: "0 30px", borderBottom: "1px solid #EEE" }}>
          <div style={{ width: 62, height: 62, borderRadius: 18, background: `linear-gradient(135deg, ${PURPLE}, #9B7BFF)`, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 900, fontSize: 34, scale: String(0.4 + 0.6 * lp), opacity: lp }}>
            <svg width={38} height={38} viewBox="0 0 24 24" fill="#fff"><path d="M7 3c-2.5 0-4 2-4 4.5 0 3 1.5 4.5 2 7.5.4 2.6.8 6 2.5 6 1.6 0 1.6-3 2.2-5 .3-1 1.3-1 1.6 0 .6 2 .6 5 2.2 5 1.7 0 2.1-3.4 2.5-6 .5-3 2-4.5 2-7.5C21 5 19.5 3 17 3c-2 0-3 1-5 1S9 3 7 3z" /></svg>
          </div>
          <div style={{ opacity: lp, fontWeight: 800, fontSize: 32, letterSpacing: "-0.02em" }}>Your Practice <span style={{ color: TR.muted, fontWeight: 600 }}>Endodontics</span></div>
        </div>
      ) : null}
      {children}
    </div>
  );
};

/** Card that crumbles into tiles and blows away (blow-away effect). */
const Crumble: React.FC<{ t: number; at: number; w: number; h: number; children: React.ReactNode }> = ({ t, at: a, w, h, children }) => {
  if (t < a) return <div style={{ width: w, height: h, position: "relative" }}>{children}</div>;
  const cols = 9, rows = 7;
  return (
    <div style={{ width: w, height: h, position: "relative" }}>
      {Array.from({ length: cols * rows }).map((_, i) => {
        const c = i % cols, r = Math.floor(i / cols);
        const d = a + (c / cols) * 0.35 + rand(i) * 0.12;
        const p = ramp(t, d, d + 0.8);
        return (
          <div key={i} style={{ position: "absolute", left: (c * w) / cols, top: (r * h) / rows, width: w / cols + 0.8, height: h / rows + 0.8, overflow: "hidden", translate: `${p * (240 + rand(i * 2) * 420)}px ${-p * (60 + rand(i * 3) * 300)}px`, rotate: `${p * (rand(i * 5) - 0.5) * 220}deg`, opacity: 1 - p }}>
            <div style={{ position: "absolute", left: -(c * w) / cols, top: -(r * h) / rows, width: w, height: h }}>{children}</div>
          </div>
        );
      })}
    </div>
  );
};

const Counter: React.FC<{ t: number; label: string; from: number; to: number; at: number; color: string; sub: string }> = ({ t, label, from, to, at: a, color, sub }) => {
  const k = t >= a ? 1 : 0;
  const p = sp(t, a, 10, 220);
  const v = k ? to : from;
  return (
    <div style={{ ...CARD, padding: "34px 44px", display: "flex", alignItems: "center", gap: 40 }}>
      <div style={{ fontSize: 170, fontWeight: 900, letterSpacing: "-0.06em", color, lineHeight: 0.9, minWidth: 130, textAlign: "center", scale: String(1 + (k ? (1 - p) * 0.35 : 0)) }}>{v}</div>
      <div>
        <div style={{ fontSize: 30, fontWeight: 800, letterSpacing: "0.12em", color: TR.muted, textTransform: "uppercase" }}>{label}</div>
        <div style={{ fontSize: 44, fontWeight: 800, letterSpacing: "-0.02em", marginTop: 6 }}>{sub}</div>
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------------------------------
// The inserts, in story order

const OFFICES = ["Gentle Dental", "Maple Street Dental", "Harbor View Family Dentistry", "Oak Park Dental Care", "Bright Path Dental"];

const Inserts: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  return (
    <AbsoluteFill>
      {/* 1. Day one: the stack of what it took */}
      <Pop t={t} t0={T.fourteen - 0.25} t1={SEG[2].start - 0.3} h={220} w={980}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 18, justifyContent: "center" }}>
          <Chip t={t} at={T.fourteen - 0.2} bg={PURPLE} color={W} size={40}>DAY 1</Chip>
          <Chip t={t} at={T.fourteen} icon="M22 10 12 5 2 10l10 5 10-5zM6 12v5c3 2 9 2 12 0v-5"><Type t={t} at={T.fourteen + 0.05} text="14 years of school" /></Chip>
          <Chip t={t} at={T.loan} icon="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"><Type t={t} at={T.loan + 0.05} text="1 very big loan" /></Chip>
          <Chip t={t} at={T.paint} icon="M3 21h18M5 21V7l7-4 7 4v14M9 21v-6h6v6"><Type t={t} at={T.paint + 0.05} text="1 brand-new practice" /></Chip>
        </div>
      </Pop>

      {/* 2. The equipment checklist */}
      <Pop t={t} t0={T.ops - 0.1} t1={T.what - 0.15} h={150} w={980}>
        <div style={{ ...CARD, padding: "24px 34px" }}>
          <div style={{ fontSize: 26, fontWeight: 800, letterSpacing: "0.14em", color: PURPLE }}>OPENING CHECKLIST</div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 18 }}>
            {[["2 operatories", T.ops + 0.1], ["Microscope", T.micro], ["CBCT", T.cbct]].map(([l, a], i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 40, fontWeight: 800, letterSpacing: "-0.02em" }}>
                <Tick t={t} at={a as number} size={44} />{l}
              </div>
            ))}
          </div>
        </div>
      </Pop>

      {/* 3. What she doesn't have yet */}
      <Pop t={t} t0={T.what + 0.6} t1={T.okay - 0.1} h={240} w={860}>
        <Counter t={t} label="Patients booked" from={0} to={0} at={1e9} color={AMBER} sub="Not yet." />
      </Pop>

      {/* 4. The designer's template form: the fields, the SSN, Submit */}
      <Pop t={t} t0={T.okay + 0.35} t1={T.email - 0.05} h={660} w={940} tilt={-2}>
        <div style={CARD}>
          <Screen t={t} t0={T.okay} src="camp/mock.png" iw={2004} crop={{ x: 0, y: 0, w: 2004 }} w={940} h={640} push={0.04}
            hl={[{ box: [30, 225, 1740, 130], at: T.doctor }, { box: [30, 495, 1740, 130], at: T.patientN }, { box: [30, 640, 720, 135], at: T.social, c: AMBER }]}>
            {/* live cursor to Submit */}
            {(() => {
              const s = 940 / 2004;
              const a = T.social + 0.4, b = T.submit + 0.1;
              const k = easeIO(interpolate(t, [a, b], [0, 1], clamp));
              const x = interpolate(k, [0, 1], [760, 210]) * s * 2.1;
              const y = interpolate(k, [0, 1], [900, 1420]) * s;
              const press = t > b ? 1 - 0.15 * Math.max(0, 1 - (t - b) * 6) : 1;
              return t > a - 0.2 ? (
                <div style={{ position: "absolute", left: x, top: y, opacity: ramp(t, a - 0.2, a) }}>
                  <svg width={50} height={56} viewBox="0 0 18 20" style={{ scale: String(press), transformOrigin: "0 0", filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.35))" }}>
                    <path d="M1 1 L1 16 L5 12.5 L7.8 18.5 L10.4 17.3 L7.7 11.4 L13 11.4 Z" fill="#fff" stroke="#111" strokeWidth={1.2} strokeLinejoin="round" />
                  </svg>
                </div>
              ) : null;
            })()}
          </Screen>
        </div>
        <div style={{ position: "absolute", left: 470, top: 345 }}>
          <Chip t={t} at={T.social + 0.25} bg={AMBER} color={W} size={32} icon={ICON.alert}>SSN in a plain web form</Chip>
        </div>
      </Pop>

      {/* 5. ...it becomes an email, in an inbox */}
      <Pop t={t} t0={T.email - 0.05} t1={T.nobody - 0.2} h={620} w={940} tilt={2}>
        <div style={CARD}>
          <Screen t={t} t0={T.email} src="camp/mail.png" iw={2000} crop={{ x: 0, y: 0, w: 2000 }} w={940} h={600} push={0.06} hl={[{ box: [0, 120, 1900, 110], at: T.email + 0.35, c: AMBER }]} />
        </div>
        <div style={{ position: "absolute", right: 30, top: -40 }}>
          <Chip t={t} at={T.inbox} bg={INK} color={W} size={34} icon={ICON.inbox}>{t >= T.maybe ? "248 unread" : "247 unread"}</Chip>
        </div>
        <div style={{ position: "absolute", left: 60, top: 470 }}>
          <Chip t={t} at={T.maybe} bg={YELLOW} color={INK} size={40}>…maybe.</Chip>
        </div>
      </Pop>

      {/* 6. "...through a contact form": the form crumbles and blows away */}
      <Pop t={t} t0={T.and2 - 0.05} t1={T.so - 0.05} h={520} w={760} tilt={-3}>
        <Crumble t={t} at={T.contact + 0.45} w={760} h={520}>
          <div style={{ ...CARD, width: 760, height: 520 }}>
            <Screen t={t} t0={T.and2} src="camp/mock.png" iw={2004} crop={{ x: 0, y: 0, w: 2004 }} w={760} h={520} push={0} />
          </div>
        </Crumble>
      </Pop>

      {/* 7. So I chose Tooth Referral */}
      <Pop t={t} t0={T.so + 0.25} t1={T.sits - 0.1} h={230} w={700}>
        <div style={{ ...CARD, padding: "40px 50px", display: "flex", justifyContent: "center", position: "relative" }}>
          <Img src={staticFile("tr/logo.png")} style={{ width: 560 }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(105deg, transparent 35%, rgba(255,255,255,0.85) 50%, transparent 65%)", translate: `${interpolate(t, [T.so + 0.6, T.so + 1.4], [-800, 800], clamp)}px 0` }} />
        </div>
      </Pop>

      {/* 8. On my own website: my logo, my insurance, what I'm known for */}
      <Pop t={t} t0={T.sits - 0.05} t1={T.hipaa - 0.05} h={720} w={900}>
        <Browser url="yourpractice.com/refer" logo t={t} logoAt={T.logo}>
          <Screen t={t} t0={T.sits} src="camp/tr-embed-form.jpg" iw={920} crop={{ x: 0, y: 0, w: 920 }} w={900} h={430} push={0.06} hl={[{ box: [460, 230, 440, 70], at: T.ins }]} />
        </Browser>
        <div style={{ position: "absolute", left: -20, top: 640, display: "flex", flexWrap: "wrap", gap: 14, width: 940 }}>
          <Chip t={t} at={T.website2} size={32} icon={ICON.check}>Your website</Chip>
          <Chip t={t} at={T.logo} size={32} icon={ICON.check}>Your logo</Chip>
          <Chip t={t} at={T.ins} size={32} icon={ICON.check}>Your insurance list</Chip>
          <Chip t={t} at={T.known} size={32} icon={ICON.check}>Your procedures</Chip>
        </div>
      </Pop>

      {/* 9. HIPAA compliant and encrypted: impact stamp */}
      {t >= T.hipaa - 0.1 && t <= T.pick + 0.3 ? (() => {
        const p = sp(t, T.hipaa, 11, 260);
        const p2 = sp(t, T.encrypted, 12, 220);
        return (
          <Pop t={t} t0={T.hipaa - 0.05} t1={T.pick - 0.15} h={320} w={900}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 30, paddingTop: 30 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 22, padding: "26px 46px", borderRadius: 28, border: `8px solid ${GREEN}`, background: "rgba(255,255,255,0.94)", color: GREEN, fontFamily: FONT_UI, fontWeight: 900, fontSize: 76, letterSpacing: "0.02em", scale: String(interpolate(p, [0, 1], [2.4, 1])), rotate: "-6deg", opacity: Math.min(1, p * 2), boxShadow: "0 24px 60px rgba(10,6,30,0.35)" }}>
              <Icon d={ICON.shield} size={80} color={GREEN} />HIPAA
            </div>
            <div style={{ opacity: p2, translate: `0 ${(1 - p2) * 30}px` }}>
              <Chip t={t} at={T.encrypted} bg={INK} color={W} size={38} icon="M7 11V7a5 5 0 0 1 10 0v4M5 11h14v10H5z">Encrypted in transit and at rest</Chip>
            </div>
          </div>
          </Pop>
        );
      })() : null}

      {/* 10. Procedure -> tooth -> X-rays: three steps */}
      <Pop t={t} t0={T.pick - 0.05} t1={T.three + 0.9} h={670} w={920}>
        <div style={CARD}>
          <div style={{ display: "flex", gap: 10, padding: "22px 26px", borderBottom: "1px solid #EEE" }}>
            {[["Procedure", T.pick], ["Tooth", T.tap], ["X-rays", T.attach]].map(([l, a], i) => {
              const on = t >= (a as number);
              return (
                <div key={i} style={{ flex: 1, display: "flex", alignItems: "center", gap: 12, padding: "14px 16px", borderRadius: 16, background: on ? TR.purpleSoft : "#F6F6F9", color: on ? PURPLE : TR.faint, fontWeight: 800, fontSize: 30 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 40, background: on ? PURPLE : "#DADBE3", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24 }}>{i + 1}</div>{l}
                </div>
              );
            })}
          </div>
          {t < T.attach ? (
            <Screen t={t} t0={T.pick} src="camp/tr-chart.jpg" iw={920} crop={{ x: 0, y: 0, w: 920 }} w={920} h={560} push={0.05}
              hl={[{ box: [10, 10, 760, 60], at: T.pick + 0.2 }, { box: [598, 222, 70, 52], at: T.tap + 0.1 }]} />
          ) : (
            <Screen t={t} t0={T.attach} src="camp/tr-uploads.jpg" iw={920} crop={{ x: 0, y: 0, w: 920 }} w={920} h={560} push={0.04} hl={[{ box: [10, 150, 900, 170], at: T.attach + 0.2 }]}>
              <div style={{ position: "absolute", left: 40, top: 420 }}>
                <Chip t={t} at={T.attach + 0.5} size={30} icon={ICON.clip}>PA_tooth19.jpg · uploaded</Chip>
              </div>
            </Screen>
          )}
        </div>
      </Pop>

      {/* 11. The patient uploads their own insurance with a secure link */}
      <Pop t={t} t0={T.three + 0.9} t1={T.every - 0.1} h={670} w={920} tilt={1.5}>
        <div style={CARD}>
          <Screen t={t} t0={T.three} src="camp/tr-insurance.jpg" iw={980} crop={{ x: 0, y: 0, w: 980 }} w={920} h={560} push={0.05} hl={[{ box: [20, 135, 940, 175], at: T.secure }]} />
        </div>
        <div style={{ position: "absolute", left: 30, top: 600 }}>
          <Chip t={t} at={T.secure + 0.3} bg={GREEN} color={W} size={34} icon={ICON.send}>Secure link sent to the patient</Chip>
        </div>
      </Pop>

      {/* 12. Every referral becomes a case we can track */}
      <Pop t={t} t0={T.every - 0.05} t1={T.form3 - 0.1} h={466} w={980}>
        <div style={CARD}>
          <Screen t={t} t0={T.every} src="dash3c/r3c-incoming.jpg" iw={1920} crop={{ x: 0, y: 0, w: 1920 }} w={980} h={466} push={0.08} hl={[{ box: [160, 140, 1580, 105], at: T.track - 0.2 }]} />
        </div>
      </Pop>

      {/* 13. The form is live; five offices invited; Gentle Dental first */}
      <Pop t={t} t0={T.form3 - 0.05} t1={T.aRef - 0.15} h={600} w={860}>
        <div style={{ ...CARD, padding: "28px 34px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ fontSize: 26, fontWeight: 800, letterSpacing: "0.14em", color: PURPLE }}>INVITE YOUR NETWORK</div>
            <Chip t={t} at={T.form3 + 0.4} bg={TR.greenSoft} color={GREEN} size={26}>● Form live</Chip>
          </div>
          {OFFICES.map((o, i) => {
            const a = T.invited + 0.15 + i * 0.28;
            const first = i === 0 && t >= T.gentle1;
            return (
              <div key={o} style={{ display: "flex", alignItems: "center", gap: 18, marginTop: 16, padding: "12px 16px", borderRadius: 18, background: first ? TR.purpleSoft : "transparent", outline: first ? `3px solid ${PURPLE}` : undefined }}>
                <div style={{ width: 54, height: 54, borderRadius: 54, background: first ? PURPLE : "#ECEAF4", color: first ? "#fff" : TR.muted, fontWeight: 800, fontSize: 24, display: "flex", alignItems: "center", justifyContent: "center" }}>{o.split(" ").map((x) => x[0]).slice(0, 2).join("")}</div>
                <div style={{ flex: 1, fontSize: 34, fontWeight: 800, letterSpacing: "-0.02em" }}>{o}</div>
                {i === 0 && t >= T.that ? <Chip t={t} at={T.that} bg={YELLOW} size={24}>My old practice</Chip> : null}
                <div style={{ fontSize: 26, fontWeight: 700, color: t >= a ? GREEN : TR.faint, minWidth: 150, textAlign: "right" }}>{t >= a ? "Invited ✓" : "…"}</div>
              </div>
            );
          })}
        </div>
      </Pop>

      {/* 14. A referral: Gentle Dental, root canal, tooth #19, X-rays, insurance */}
      {(() => {
        return (
          <Pop t={t} t0={T.aRef - 0.1} t1={T.our - 0.3} h={450} w={960}>
            <div style={{ ...CARD, padding: "26px 32px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
                <div style={{ width: 70, height: 70, borderRadius: 20, background: PURPLE, display: "flex", alignItems: "center", justifyContent: "center", flex: "none" }}>
                  <svg width={38} height={38} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 1 1 12 0c0 7 3 9 3 9H3s3-2 3-9" /><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" /></svg>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 36, fontWeight: 800, letterSpacing: "-0.02em" }}>New referral</div>
                  <div style={{ fontSize: 28, color: TR.muted, fontWeight: 600 }}>from Gentle Dental · just now</div>
                </div>
                <div style={{ padding: "8px 20px", borderRadius: 999, background: TR.purpleSoft, color: PURPLE, fontWeight: 800, fontSize: 26 }}>New</div>
              </div>
              <div style={{ height: 1, background: "#EEE", margin: "22px 0 6px" }} />
              {[["Procedure", "Root canal (NSRCT)", T.root], ["Tooth", "#19", T.tooth19], ["X-rays", "2 attached", T.xrays], ["Insurance", "Uploaded by the patient", T.uploaded - 0.3]].map(([l, v, a], i) => {
                const q = sp(t, a as number, 14, 200);
                return (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 18, marginTop: 14, opacity: 0.25 + 0.75 * Math.min(1, q * 1.4) }}>
                    <Tick t={t} at={a as number} size={42} />
                    <div style={{ width: 220, fontSize: 30, fontWeight: 700, color: TR.muted }}>{l}</div>
                    <div style={{ fontSize: 34, fontWeight: 800, letterSpacing: "-0.02em" }}>{v}</div>
                  </div>
                );
              })}
            </div>
          </Pop>
        );
      })()}

      {/* 15. Our first patient */}
      <Pop t={t} t0={T.our - 0.05} t1={COVER_IN - 0.05} h={240} w={860}>
        <Counter t={t} label="Patients booked" from={0} to={1} at={T.our + 0.25} color={GREEN} sub={t >= T.calling ? "Calling her now." : "Our first patient."} />
      </Pop>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------------------------------
// Full-frame cover over the handset pop: the referring office's live view

const StatusCover: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  if (t < COVER_IN - 0.02 || t >= COVER_OUT) return null;
  const p = ramp(t, COVER_IN, COVER_IN + 0.22, easeIO);
  const steps: [string, string, number][] = [
    ["Referral received", "Today, 9:41 AM", COVER_IN + 0.3],
    ["Patient contacted", "Today, 9:46 AM", T.sees],
    ["Consultation scheduled", "Thu, 10:30 AM", T.sees + 0.9],
    ["Treatment", "Pending", 1e9],
  ];
  return (
    <AbsoluteFill style={{ clipPath: `circle(${p * 150}% at 50% 62%)`, background: "linear-gradient(170deg, #FBFAFF 0%, #EFEAFF 60%, #E6DEFF 100%)", fontFamily: FONT_UI }}>
      <AbsoluteFill style={{ backgroundImage: "radial-gradient(rgba(109,74,232,0.10) 1.5px, transparent 1.6px)", backgroundSize: "36px 36px", backgroundPosition: `${(t * 30) % 36}px ${(t * 18) % 36}px` }} />
      <div style={{ position: "absolute", top: 120, left: 70, right: 70, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Img src={staticFile("tr/logo.png")} style={{ height: 66 }} />
        <div style={{ fontSize: 26, fontWeight: 800, color: PURPLE, letterSpacing: "0.14em" }}>REFERRING OFFICE VIEW</div>
      </div>
      <div style={{ position: "absolute", left: 70, right: 70, top: 300, ...CARD, padding: "40px 44px", scale: String(0.94 + 0.06 * sp(t, COVER_IN + 0.05, 16, 150) + 0.012 * (t - COVER_IN)), translate: `0 ${-6 * (t - COVER_IN)}px` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
          <div style={{ width: 84, height: 84, borderRadius: 84, background: PURPLE, color: "#fff", fontWeight: 800, fontSize: 34, display: "flex", alignItems: "center", justifyContent: "center" }}>GD</div>
          <div>
            <div style={{ fontSize: 42, fontWeight: 800, letterSpacing: "-0.02em" }}>Gentle Dental</div>
            <div style={{ fontSize: 28, color: TR.muted, fontWeight: 600 }}>Root canal · tooth #19</div>
          </div>
          <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 10, fontSize: 26, fontWeight: 800, color: GREEN }}>
            <div style={{ width: 16, height: 16, borderRadius: 16, background: GREEN, opacity: 0.5 + 0.5 * Math.sin(t * 6) }} />LIVE
          </div>
        </div>
        <div style={{ height: 1, background: "#EEE", margin: "30px 0 10px" }} />
        {steps.map(([l, v, a], i) => {
          const done = t >= a;
          return (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 24, marginTop: 26, position: "relative" }}>
              {i < steps.length - 1 ? <div style={{ position: "absolute", left: 25, top: 56, width: 4, height: 40, background: t >= steps[i + 1][2] ? GREEN : "#E4E3EC" }} /> : null}
              <Tick t={t} at={a} size={54} />
              <div style={{ flex: 1, fontSize: 40, fontWeight: 800, letterSpacing: "-0.02em", color: done ? INK : TR.faint }}>{l}</div>
              <div style={{ fontSize: 28, fontWeight: 700, color: done ? TR.muted : TR.faint }}>{v}</div>
            </div>
          );
        })}
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 1130, display: "flex", justifyContent: "center" }}>
        <Chip t={t} at={T.nobody2 + 0.1} bg={INK} color={W} size={40} icon={ICON.check} style={{ transformOrigin: "50% 50%" }}>No “any update?” calls</Chip>
      </div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------------------------------
// End card

const EndCard: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const a = CUT - 0.35;
  if (t < a) return null;
  const p = ramp(t, a, a + 0.45, easeIO);
  const l = sp(t, a + 0.25, 15, 140);
  const b = sp(t, a + 0.9, 14, 180);
  const c = sp(t, a + 1.3, 14, 180);
  return (
    <AbsoluteFill style={{ opacity: p, background: "linear-gradient(170deg, #FBFAFF 0%, #EFEAFF 60%, #E6DEFF 100%)", alignItems: "center", justifyContent: "center", fontFamily: FONT_UI }}>
      <AbsoluteFill style={{ backgroundImage: "radial-gradient(rgba(109,74,232,0.10) 1.5px, transparent 1.6px)", backgroundSize: "36px 36px", backgroundPosition: `${(t * 30) % 36}px ${(t * 18) % 36}px` }} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", scale: String(1 + 0.012 * Math.max(0, t - a)) }}>
      <Img src={staticFile("tr/logo.png")} style={{ width: 620, scale: String(0.86 + 0.14 * l), opacity: l, marginTop: -120 }} />
      <div style={{ marginTop: 70, width: 940, fontSize: 56, fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.14, color: INK, textAlign: "center", opacity: l, translate: `0 ${(1 - l) * 30}px` }}>
        Starting a practice is hard.<br /><span style={{ color: PURPLE }}>Losing referrals<br />shouldn’t be part of it.</span>
      </div>
      <div style={{ marginTop: 50, padding: "20px 46px", borderRadius: 999, background: PURPLE, color: "#fff", fontSize: 42, fontWeight: 800, opacity: b, scale: String(0.8 + 0.2 * b) }}>Set up in about 5 minutes</div>
      <div style={{ marginTop: 28, fontSize: 40, color: PURPLE, fontWeight: 800, opacity: c }}>toothreferral.com</div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------------------------------
// Sound: the voice plus quiet UI sounds on the inserts (no whooshes, no music)

const SFX: [number, string, number][] = [
  [T.fourteen, "pop-1", 0.22], [T.loan, "pop-2", 0.22], [T.paint, "pop-3", 0.22],
  [T.ops + 0.1, "tick-1", 0.3], [T.micro, "tick-2", 0.3], [T.cbct, "tick-3", 0.3],
  [T.doctor, "blip-1", 0.18], [T.patientN, "blip-2", 0.18], [T.social + 0.25, "blip-3", 0.24], [T.submit + 0.1, "click", 0.45],
  [T.maybe, "pop-1", 0.2], [T.contact + 0.45, "thud", 0.18], [T.so + 0.6, "shimmer", 0.16],
  [T.website2, "pop-2", 0.18], [T.logo, "pop-3", 0.18], [T.ins, "pop-1", 0.18], [T.known, "pop-2", 0.18],
  [T.hipaa, "impact", 0.22], [T.pick + 0.2, "click", 0.35], [T.tap + 0.1, "click", 0.35], [T.attach + 0.5, "blip-1", 0.2],
  [T.secure + 0.3, "chime", 0.18], [T.invited + 0.15, "tick-4", 0.25], [T.invited + 0.43, "tick-5", 0.25], [T.invited + 0.71, "tick-6", 0.25], [T.invited + 0.99, "tick-7", 0.25], [T.invited + 1.27, "tick-1", 0.25],
  [T.aRef - 0.1, "chime", 0.28], [T.root, "tick-2", 0.22], [T.tooth19, "tick-3", 0.22], [T.xrays, "tick-4", 0.22], [T.uploaded - 0.3, "tick-5", 0.22],
  [T.our + 0.25, "pop-3", 0.24], [COVER_IN + 0.3, "tick-6", 0.22], [T.sees, "tick-7", 0.22], [T.sees + 0.9, "tick-1", 0.22], [T.nobody2 + 0.1, "pop-1", 0.2],
  [CUT - 0.1, "shimmer", 0.16],
];

export const DayOne: React.FC = () => (
  <FontGate>
    <AbsoluteFill style={{ background: "#000" }}>
      <Footage />
      <Inserts />
      <StatusCover />
      <Captions />
      <EndCard />
      <Audio src={staticFile("audio/voice/d1-voice.wav")} />
      {SFX.map(([a, n, v], i) => (
        <Sequence key={i} from={Math.round(a * FPS)} durationInFrames={60}>
          <Audio src={staticFile(`audio/sfx/${n}.wav`)} volume={v} />
        </Sequence>
      ))}
    </AbsoluteFill>
  </FontGate>
);
