/**
 * "Where The Hell Is That X-Ray?": ToothReferral short (Script 3). A 4:58 PM panic over a missing x-ray, then the
 * Incoming Referrals dashboard answering it, one beat per line of the script.
 *
 *   1  the hook (full frame)          a 4:58 PM clock, "patient: in the chair", the GP's "I sent it!", an empty inbox
 *                                     and question marks bursting when his arms open
 *   2  the usual suspects (full)      inbox, fax tray and an endless June email chain pop off his counting fingers;
 *                                     his flick blows them away
 *   3  meet ToothReferral (-> split)  the chaos is swept off, the logo reveals behind his head; the frame splits, the
 *                                     real Incoming Referrals list on top: rows, every office, one list you can trust
 *   4  there it is (split, dash top)  the cursor opens the patient, the camera dives into the x-ray, the insurance card
 *                                     flips front to back
 *   5  ask in the case (swap)         panels swap: the office chat, a missing-item flag, typing, an @mention, the reply,
 *                                     saved to the case
 *   6  no callbacks (split, him top)  status updated, the referring office notified instantly; "callback" crossed out,
 *                                     an "any update?" email swiped away
 *   7  the network (full)             office badges behind him snap into one hub as his hands meet
 *   8  the close (full)               the 4:58 clock comes back with the x-ray found; calm, collected, connected
 *   9  the call to action (full)      a ripple off his finger, the logo and the link, every office gathered into his
 *                                     hands; end card
 *
 * One continuous take: nine takes colour-matched (scripts/match_grade.py), the foreign frames at the end of take 8
 * replaced by its last clean frame, cut at hand-picked pauses (scripts/cut_spans.py), joins morph-cut
 * (scripts/morph_cuts.py), one voice (ElevenLabs speech-to-speech; the one word it misheard, "calm", re-made with the
 * same voice and fitted into the same frames). Graphics ride the tracked hands (scripts/handtrack.py). The dashboard is
 * shown like a screen recording (cursor, clicks, pressed buttons, auto-zoom). Demo data; patients and offices are
 * fictional.
 */
import React from "react";
import { AbsoluteFill, Audio, Freeze, Img, Sequence, interpolate, spring, staticFile, useCurrentFrame } from "remotion";
import { FontGate, TALENT, TalentLayer, type Framing } from "../effects";
import transcript from "../data/transcript-xr.json";
import cut from "../data/xr-cut-segments.json";
import handsData from "../data/hands-xr.json";
import { FONT_UI } from "../theme";
import { LogoReveal, easeIO, easeOut, ramp } from "../tr/motion";
import { ICON, Icon, TR, clamp } from "../tr/ui";

const TL = TALENT["xr-cut"];
const FPS = 30;
const CUT_FRAMES = Math.round(cut.duration * FPS);
const TAIL = 75;
export const XR_DURATION = CUT_FRAMES + TAIL;

// ---------------------------------------------------------------------------------------------------
// Look

const YELLOW = "#F3DD72";
const RED = "#FF5A5F";
const INK = "#16131F";
const W = "#FFFFFF";
const BG = "#0F0B1C";
const TYPE: React.CSSProperties = { fontFamily: FONT_UI, fontWeight: 800, letterSpacing: "-0.045em", lineHeight: 0.98 };
const SOFT = "0 2px 16px rgba(10,6,24,0.5), 0 1px 3px rgba(10,6,24,0.45)";
const CARD: React.CSSProperties = { background: "#fff", borderRadius: 26, boxShadow: "0 28px 70px rgba(10,6,30,0.35), 0 2px 6px rgba(10,6,30,0.12)", fontFamily: FONT_UI, color: INK };

// ---------------------------------------------------------------------------------------------------
// Timing

const WORDS = transcript["xr-cut"].words;
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
  t458a: at("4", 1),
  patient1: at("patient", 1),
  chair: at("chair"),
  swears: at("swears"),
  sent: at("sent"),
  where1: at("where", 1),
  spoiler: at("spoiler"),
  inbox: at("inbox"),
  fax: at("fax"),
  page: at("page"),
  email: at("email"),
  june: at("june"),
  now: at("now"),
  tooth1: at("tooth", 1),
  heres: at("heres"),
  every1: at("every", 1),
  from2: at("from", 2),
  lands: at("lands"),
  trust: at("trust"),
  open: at("open"),
  rays: at("rays"),
  shared: at("shared"),
  insurance: at("insurance"),
  card: at("card"),
  front: at("front"),
  back: at("back"),
  something: at("something"),
  missing: at("missing"),
  message: at("message"),
  tag: at("tag"),
  answer: at("answer"),
  saved: at("saved"),
  update1: at("update", 1),
  status: at("status"),
  referring1: at("referring", 1),
  sees: at("sees"),
  instantly: at("instantly"),
  callbacks: at("callbacks"),
  update2: at("update", 2),
  emails: at("emails"),
  every3: at("every", 3),
  work: at("work"),
  stays: at("stays"),
  thats1: at("thats", 1),
  network1: at("network", 1),
  so: at("so"),
  t458b: at("4", 2),
  know: at("know"),
  calm1: at("calm", 1),
  collected: at("collected"),
  connected2: at("connected", 2),
  want: at("want"),
  check: at("check"),
  bring: at("bring"),
  place: at("place"),
};

// ---------------------------------------------------------------------------------------------------
// Layout: full frame, split A (dashboard on top, him below), split B (him on top, dashboard below).
// The changes are eased moves of one picture and one panel, never a cut.

const PANEL = 840; // dashboard panel height
const SPLIT_A = { y: 675, top: 840, bottom: 1920 }; // talent framing y and visible band
const SPLIT_B = { y: -90, top: 0, bottom: 1080 };
const FULL = { y: 0, top: 0, bottom: 1920 };
const TA = [T.heres - 18, T.heres + 2] as const; // full -> A
const TB = [T.something - 24, T.something - 4] as const; // A -> B (the swap)
const TC = [T.every3 - 22, T.every3 - 4] as const; // B -> full

const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
type Lay = { y: number; top: number; bottom: number; dashTop: number; mode: "full" | "A" | "B" };
const layoutAt = (frame: number): Lay => {
  const mix = (a: typeof FULL, b: typeof FULL, k: number) => ({ y: lerp(a.y, b.y, k), top: lerp(a.top, b.top, k), bottom: lerp(a.bottom, b.bottom, k) });
  if (frame < TA[1]) {
    const k = ramp(frame, TA[0], TA[1], easeIO);
    return { ...mix(FULL, SPLIT_A, k), dashTop: lerp(-PANEL - 40, 0, k), mode: k > 0.5 ? "A" : "full" };
  }
  if (frame < TB[1]) {
    const k = ramp(frame, TB[0], TB[1], easeIO);
    return { ...mix(SPLIT_A, SPLIT_B, k), dashTop: lerp(0, 1920 - PANEL, k), mode: k > 0.5 ? "B" : "A" };
  }
  const k = ramp(frame, TC[0], TC[1], easeIO);
  return { ...mix(SPLIT_B, FULL, k), dashTop: lerp(1920 - PANEL, 1960, k), mode: k > 0.5 ? "full" : "B" };
};
const framingFor = (l: Lay): Framing => ({ scale: 1.5, x: 0, y: l.y });

// ---------------------------------------------------------------------------------------------------
// Hands (scripts/handtrack.py, source px per frame of the cut)

type Hand = { side: string; palm: number[]; index: number[]; thumb: number[]; score: number };
const HF = (handsData as unknown as { frames: Hand[][] }).frames;
type Pick = "high" | "left" | "right" | "low";
const pick = (hs: Hand[], p: Pick) => {
  if (!hs || !hs.length) return undefined;
  const s = [...hs];
  if (p === "high") s.sort((a, b) => a.palm[1] - b.palm[1]);
  if (p === "low") s.sort((a, b) => b.palm[1] - a.palm[1]);
  if (p === "left") s.sort((a, b) => a.palm[0] - b.palm[0]);
  if (p === "right") s.sort((a, b) => b.palm[0] - a.palm[0]);
  return s[0];
};
/** Smoothed source-px point of a hand at `frame` (nearest tracked frame if this one has no hand). */
const handSrc = (frame: number, p: Pick, key: "palm" | "index" = "palm", smooth = 2): [number, number] => {
  let n = 0;
  let x = 0;
  let y = 0;
  for (let f = frame - smooth; f <= frame + smooth; f++) {
    const h = pick(HF[Math.max(0, Math.min(HF.length - 1, f))], p);
    if (h) {
      x += h[key][0];
      y += h[key][1];
      n++;
    }
  }
  if (n) return [x / n, y / n];
  for (let d = 1; d < 20; d++) {
    for (const f of [frame - d, frame + d]) {
      const h = pick(HF[Math.max(0, Math.min(HF.length - 1, f))], p);
      if (h) return [h[key][0], h[key][1]];
    }
  }
  return [360, 900];
};
/** The same point in output px, in the full-frame layout. */
const handOut = (frame: number, p: Pick, key: "palm" | "index" = "palm", smooth = 2, yOff = 0): [number, number] => {
  const [x, y] = handSrc(frame, p, key, smooth);
  return [x * 1.5, y * 1.5 + yOff];
};

// ---------------------------------------------------------------------------------------------------
// Captions (the Chocolate Box style: lowercase heavy grotesk, built word by word on the chest)

type Tok = { t: string; at: number; end: number };
const TOKS: Tok[] = (() => {
  const out: Tok[] = [];
  for (const w of WORDS) {
    const t = w.word.trim();
    const prev = out[out.length - 1];
    if (prev && (t.startsWith("-") || (/^\.\d/.test(t) && /\d$/.test(prev.t)))) {
      if (!t.startsWith("-")) {
        prev.t = prev.t.replace(/^\$/, "") + ":" + t.slice(1);
        prev.end = Math.round(w.end * FPS);
        continue;
      }
      prev.t = prev.t + t;
      prev.end = Math.round(w.end * FPS);
      continue;
    }
    if (prev && prev.t.toLowerCase() === "tooth" && /^referral/i.test(t)) {
      prev.t = "toothreferral" + t.slice(8);
      prev.end = Math.round(w.end * FPS);
      continue;
    }
    out.push({ t, at: Math.round(w.start * FPS), end: Math.round(w.end * FPS) });
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
    if (/[.,?!:]$/.test(tk.t)) flush();
  }
  flush();
  for (let i = 0; i < chunks.length - 1; i++) chunks[i].to = Math.min(chunks[i].to, chunks[i + 1].from);
  return chunks;
})();

const Captions: React.FC<{ lay: Lay }> = ({ lay }) => {
  const frame = useCurrentFrame();
  const c = CHUNKS.find((x) => frame >= x.from && frame < x.to);
  if (!c) return null;
  const out = interpolate(frame, [c.to - 4, c.to], [0, 1], clamp);
  // on his chest in every layout: full 1440, split A 1680, split B 905
  const top = lay.top > 0.5 ? lerp(1440, 1680, lay.top / 840) : lerp(1440, 770, (1920 - lay.bottom) / 840);
  const size = 70;
  return (
    <div style={{ position: "absolute", left: 60, right: 60, top, textAlign: "center", ...TYPE, fontSize: size, color: W, textShadow: SOFT, opacity: 1 - out, filter: out > 0 ? `blur(${out * 6}px)` : undefined }}>
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

// ---------------------------------------------------------------------------------------------------
// Small pieces

/** Dark pill with a small icon, for the roast items. */
const Chip: React.FC<{ icon: string; text: string; color?: string; style?: React.CSSProperties }> = ({ icon, text, color = YELLOW, style }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 22px 12px 14px", borderRadius: 999, background: "rgba(16,12,30,0.84)", border: "1.5px solid rgba(255,255,255,0.16)", boxShadow: "0 14px 34px rgba(10,6,24,0.35)", whiteSpace: "nowrap", ...style }}>
    <div style={{ width: 44, height: 44, borderRadius: 22, background: color, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <Icon d={icon} size={24} color={INK} />
    </div>
    <div style={{ ...TYPE, letterSpacing: "-0.025em", fontSize: 38, color: W }}>{text}</div>
  </div>
);

const I = {
  fax: "M6 9V2h12v7M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2M6 14h12v8H6z",
  voicemail: "M5.5 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM18.5 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM5.5 15.5h13",
  prayer: "M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 16.8l-6.2 4.5 2.4-7.4L2 9.4h7.6z",
  phone: "M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z",
  mail: "M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zM22 6l-10 7L2 6",
  clock: "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM12 6v6l4 2",
  bell: "M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0",
  user: "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z",
  building: "M3 21h18M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16M9 7h2M13 7h2M9 11h2M13 11h2M9 15h2M13 15h2",
};

// ---------------------------------------------------------------------------------------------------
// 2..4  the dashboard panel
//
// Shown like a screen recording: a cursor moves to what he talks about and clicks it (ripple, pressed button), and the
// camera zooms in on the click and back out, the way screen-recording tools auto-zoom.

const PW = 1032;
const PH = PANEL - 48;
type Crop = { x: number; y: number; w: number };
type Map = (x: number, y: number) => readonly [number, number];
/** Maps source px of a dashboard still to panel px for a crop. */
const mapper = (c: Crop): Map => {
  const s = PW / c.w;
  return (x: number, y: number) => [(x - c.x) * s, (y - c.y) * s] as const;
};
const lerpCrop = (a: Crop, b: Crop, k: number): Crop => ({ x: lerp(a.x, b.x, k), y: lerp(a.y, b.y, k), w: lerp(a.w, b.w, k) });
/** Camera keyframes [frame, crop]: eased moves between them, held before the first and after the last. */
type CK = [number, Crop];
const camAt = (frame: number, keys: CK[]): Crop => {
  if (frame <= keys[0][0]) return keys[0][1];
  for (let i = 0; i < keys.length - 1; i++) {
    const [a, ca] = keys[i];
    const [b, cb] = keys[i + 1];
    if (frame < b) return lerpCrop(ca, cb, easeIO(interpolate(frame, [a, b], [0, 1], clamp)));
  }
  return keys[keys.length - 1][1];
};
/** Cursor keyframes [frame, x, y], eased between. */
type PK = [number, number, number];
const pathAt = (frame: number, keys: PK[]): [number, number] => {
  if (frame <= keys[0][0]) return [keys[0][1], keys[0][2]];
  for (let i = 0; i < keys.length - 1; i++) {
    const [a, xa, ya] = keys[i];
    const [b, xb, yb] = keys[i + 1];
    if (frame < b) {
      const k = easeIO(interpolate(frame, [a, b], [0, 1], clamp));
      return [lerp(xa, xb, k), lerp(ya, yb, k)];
    }
  }
  const l = keys[keys.length - 1];
  return [l[1], l[2]];
};

/** One shot of the panel: a still from the screen recording under a keyframed camera, with overlays placed in the
 *  still's own pixels. Fades and de-blurs in, so shots dissolve into each other. */
const Shot: React.FC<{ img: string; from: number; to: number; keys: CK[]; dim?: number; children?: (m: Map, s: number) => React.ReactNode }> = ({ img, from, to, keys, dim = 0, children }) => {
  const frame = useCurrentFrame();
  if (frame < from - 1 || frame > to + 9) return null;
  const c = camAt(frame, keys);
  const s = PW / c.w;
  const inn = ramp(frame, from, from + 9, easeOut);
  const m = mapper(c);
  return (
    <AbsoluteFill style={{ opacity: inn, filter: inn < 1 ? `blur(${(1 - inn) * 10}px)` : undefined }}>
      <Img src={staticFile(`dash/${img}`)} style={{ position: "absolute", left: -c.x * s, top: -c.y * s, width: 1920 * s, height: 842 * s, maxWidth: "none" }} />
      {dim > 0 && <AbsoluteFill style={{ background: `rgba(20,14,40,${dim})` }} />}
      {children?.(m, s)}
    </AbsoluteFill>
  );
};

/** A highlight box in panel px. */
const Hl: React.FC<{ box: number[]; m: Map; k: number; color?: string; label?: string; labelSide?: "top" | "bottom"; fill?: boolean; dx?: number }> = ({ box, m, k, color = TR.purple, label, labelSide = "top", fill = true, dx = -4 }) => {
  if (k <= 0) return null;
  const [x0, y0] = m(box[0], box[1]);
  const [x1, y1] = m(box[2], box[3]);
  const pad = 6;
  return (
    <div style={{ position: "absolute", left: x0 - pad, top: y0 - pad, width: x1 - x0 + 2 * pad, height: y1 - y0 + 2 * pad, borderRadius: 14, border: `4px solid ${color}`, background: fill ? `${color}22` : undefined, opacity: Math.min(1, k * 1.6), scale: String(interpolate(k, [0, 1], [1.08, 1])), boxShadow: `0 0 0 6px ${color}22` }}>
      {label && (
        <div style={{ position: "absolute", left: dx, [labelSide === "top" ? "bottom" : "top"]: "calc(100% + 8px)", padding: "6px 14px", borderRadius: 999, background: color, color: W, fontFamily: FONT_UI, fontWeight: 800, fontSize: 26, whiteSpace: "nowrap", letterSpacing: "-0.01em" }}>{label}</div>
      )}
    </div>
  );
};

/** A button being pressed: the button's area dips, fills purple and glows for a moment (source px box). */
const Press: React.FC<{ box: number[]; at: number; m: Map; color?: string }> = ({ box, at, m, color = TR.purple }) => {
  const frame = useCurrentFrame();
  if (frame < at - 1 || frame > at + 16) return null;
  const [x0, y0] = m(box[0], box[1]);
  const [x1, y1] = m(box[2], box[3]);
  const k = ramp(frame, at, at + 16, easeOut);
  const dip = Math.sin(Math.min(1, (frame - at) / 7) * Math.PI);
  return <div style={{ position: "absolute", left: x0, top: y0, width: x1 - x0, height: y1 - y0, borderRadius: 12, background: color, opacity: 0.35 * (1 - k) + 0.05, scale: String(1 - 0.06 * dip), boxShadow: `0 0 ${30 * (1 - k)}px ${color}` }} />;
};

/** The mouse: follows a keyframed path (in the coordinates `m` maps from), clicks with a ripple and a press. */
const Mouse: React.FC<{ path: PK[]; clicks: number[]; m: Map; show: [number, number] }> = ({ path, clicks, m, show }) => {
  const frame = useCurrentFrame();
  if (frame < show[0] || frame > show[1]) return null;
  const vis = ramp(frame, show[0], show[0] + 6) * (1 - ramp(frame, show[1] - 6, show[1]));
  const [sx, sy] = pathAt(frame, path);
  const [x, y] = m(sx, sy);
  const press = clicks.reduce((p, c) => (frame >= c && frame < c + 8 ? Math.max(p, Math.sin(((frame - c) / 8) * Math.PI)) : p), 0);
  return (
    <div style={{ position: "absolute", left: 0, top: 0, opacity: vis }}>
      {clicks.map((c) => {
        const k = ramp(frame, c, c + 16, easeOut);
        if (frame < c || k >= 1) return null;
        const [cx, cy] = m(...pathAt(c, path));
        return <div key={c} style={{ position: "absolute", left: cx - 40, top: cy - 40, width: 80, height: 80, borderRadius: 40, border: `5px solid ${TR.purple}`, background: `${TR.purple}22`, scale: String(0.3 + k * 1.3), opacity: 1 - k }} />;
      })}
      <svg width={46} height={54} viewBox="0 0 22 26" style={{ position: "absolute", left: x - 4, top: y - 2, scale: String(1 - 0.16 * press), transformOrigin: "4px 2px", filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.35))" }}>
        <path d="M2 2 L2 20 L7 15 L11 24 L14 22.5 L10 14 L17 14 Z" fill={INK} stroke={W} strokeWidth={1.6} strokeLinejoin="round" />
      </svg>
    </div>
  );
};

/** Green "connected" dots: pulsing rings. */
const Pulse: React.FC<{ x: number; y: number; at: number; m: Map }> = ({ x, y, at, m }) => {
  const frame = useCurrentFrame();
  if (frame < at) return null;
  const [px, py] = m(x, y);
  const k = sp(frame, at, 10, 200);
  const ring = ((frame - at) % 24) / 24;
  return (
    <>
      <div style={{ position: "absolute", left: px - 34, top: py - 34, width: 68, height: 68, borderRadius: 34, border: "5px solid #22C55E", scale: String(0.4 + ring * 1.2), opacity: (1 - ring) * k }} />
      <div style={{ position: "absolute", left: px - 13, top: py - 13, width: 26, height: 26, borderRadius: 13, background: "#22C55E", scale: String(k), boxShadow: "0 0 18px #22C55E" }} />
    </>
  );
};

/** Camera for the rebuilt cards: keyframes [frame, scale, focus x, focus y] in panel px; zooms about the focus. */
type ZK = [number, number, number, number];
const zoomAt = (frame: number, keys: ZK[]) => {
  if (frame <= keys[0][0]) return keys[0].slice(1) as [number, number, number];
  for (let i = 0; i < keys.length - 1; i++) {
    const a = keys[i];
    const b = keys[i + 1];
    if (frame < b[0]) {
      const k = easeIO(interpolate(frame, [a[0], b[0]], [0, 1], clamp));
      return [lerp(a[1], b[1], k), lerp(a[2], b[2], k), lerp(a[3], b[3], k)] as [number, number, number];
    }
  }
  return keys[keys.length - 1].slice(1) as [number, number, number];
};
const Cam: React.FC<{ keys: ZK[]; children: React.ReactNode }> = ({ keys, children }) => {
  const frame = useCurrentFrame();
  const [s, fx, fy] = zoomAt(frame, keys);
  // the focus slides toward the panel centre as the zoom grows, so a zoomed corner never sits at the edge
  const t = Math.min(1, (s - 1) / 0.5);
  const tx = lerp(fx, PW / 2, t * 0.6) - fx * s;
  const ty = lerp(fy, PH / 2, t * 0.6) - fy * s;
  return <AbsoluteFill style={{ transform: `translate(${tx}px, ${ty}px) scale(${s})`, transformOrigin: "0 0" }}>{children}</AbsoluteFill>;
};
const ident: Map = (x, y) => [x, y] as const;


// ---------------------------------------------------------------------------------------------------
// 1  the hook: 4:58, the patient in the chair, the GP swears, where the hell is it?

/** A dark pill with an icon and two lines. */
const Pill: React.FC<{ icon: string; title: string; sub?: React.ReactNode; color?: string; style?: React.CSSProperties }> = ({ icon, title, sub, color = YELLOW, style }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 24px 14px 14px", borderRadius: 999, background: "rgba(16,12,30,0.88)", border: "1.5px solid rgba(255,255,255,0.16)", boxShadow: "0 14px 34px rgba(10,6,24,0.4)", whiteSpace: "nowrap", fontFamily: FONT_UI, color: W, ...style }}>
    <div style={{ width: 52, height: 52, borderRadius: 26, background: color, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
      <Icon d={icon} size={28} color={INK} />
    </div>
    <div>
      <div style={{ fontSize: 32, fontWeight: 800, letterSpacing: "-0.02em" }}>{title}</div>
      {sub && <div style={{ fontSize: 22, color: "rgba(255,255,255,0.68)", fontVariantNumeric: "tabular-nums" }}>{sub}</div>}
    </div>
  </div>
);

const ClockFace: React.FC<{ t: number; size?: number }> = ({ t, size = 52 }) => (
  <svg width={size} height={size} viewBox="0 0 48 48">
    <circle cx={24} cy={24} r={20} fill="none" stroke={W} strokeWidth={4} />
    <line x1={24} y1={24} x2={24 + 13 * Math.sin(t * 0.5)} y2={24 - 13 * Math.cos(t * 0.5)} stroke={YELLOW} strokeWidth={4} strokeLinecap="round" />
    <line x1={24} y1={24} x2={24 + 8 * Math.sin(5.9)} y2={24 - 8 * Math.cos(5.9)} stroke={W} strokeWidth={4} strokeLinecap="round" />
  </svg>
);

/** "It's 4:58, the patient is in the chair, and the GP swears they sent the X-ray. Where the hell is it?" */
const Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const end = T.spoiler - 4;
  if (frame > end + 10) return null;
  const out = ramp(frame, end, end + 10);
  const clock = sp(frame, T.t458a - 4, 12, 210);
  const chair = sp(frame, T.chair - 6, 13, 200);
  const gp = sp(frame, T.swears - 4, 12, 210);
  const inbox = sp(frame, T.where1 - 2, 11, 220);
  // seconds tick past 4:58 while he panics
  const secs = Math.min(59, Math.floor((frame - T.t458a) / 2));
  const [lx, ly] = handOut(T.where1 + 8, "left", "palm", 3);
  const [rx, ry] = handOut(T.where1 + 8, "right", "palm", 3);
  return (
    <AbsoluteFill style={{ opacity: 1 - out, filter: out > 0 ? `blur(${out * 10}px)` : undefined }}>
      {clock > 0 && (
        <div style={{ position: "absolute", left: 28, top: 330, scale: String(clock), transformOrigin: "0% 50%" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 26px 14px 16px", borderRadius: 999, background: RED, boxShadow: "0 14px 34px rgba(10,6,24,0.45)", fontFamily: FONT_UI, color: W }}>
            <ClockFace t={frame - T.t458a} />
            <div>
              <div style={{ fontSize: 40, fontWeight: 800, letterSpacing: "-0.02em", fontVariantNumeric: "tabular-nums" }}>4:58 PM</div>
              <div style={{ fontSize: 20, fontWeight: 700, opacity: 0.85, fontVariantNumeric: "tabular-nums" }}>closing in {Math.max(0, 120 - secs)}s</div>
            </div>
          </div>
        </div>
      )}
      {chair > 0 && (
        <div style={{ position: "absolute", left: 28, top: 470, scale: String(chair), transformOrigin: "0% 50%" }}>
          <Pill icon={I.user} title="patient: in the chair" color="#7EE2A8" />
        </div>
      )}
      {gp > 0 && (
        <div style={{ position: "absolute", right: 24, top: 560, scale: String(gp), transformOrigin: "100% 50%" }}>
          <div style={{ position: "relative", padding: "16px 24px", borderRadius: 24, background: W, color: INK, fontFamily: FONT_UI, boxShadow: "0 16px 40px rgba(10,6,24,0.4)" }}>
            <div style={{ fontSize: 20, fontWeight: 800, color: "#8A8799" }}>GP office</div>
            <div style={{ fontSize: 34, fontWeight: 800, letterSpacing: "-0.02em" }}>“We sent it!”</div>
            <div style={{ position: "absolute", left: 30, bottom: -14, width: 28, height: 28, background: W, rotate: "45deg", borderRadius: 4 }} />
          </div>
        </div>
      )}
      {inbox > 0 && (
        <>
          <div style={{ position: "absolute", left: 0, right: 0, top: 120, display: "flex", justifyContent: "center", scale: String(interpolate(inbox, [0, 1], [0.6, 1])), opacity: Math.min(1, inbox * 2) }}>
            <div style={{ ...CARD, borderRadius: 22, padding: "16px 26px", display: "flex", alignItems: "center", gap: 16 }}>
              <Icon d={ICON.inbox} size={40} color={TR.purple} />
              <div>
                <div style={{ fontSize: 30, fontWeight: 800 }}>Inbox</div>
                <div style={{ fontSize: 22, color: TR.red, fontWeight: 800 }}>0 x-rays found</div>
              </div>
            </div>
          </div>
          {[
            [lx - 60, ly - 260, -14, 0],
            [rx + 10, ly - 300, 12, 3],
            [lx - 140, ly - 120, -24, 6],
            [rx + 70, ry - 160, 20, 9],
          ].map(([x, y, r, d], i) => {
            const k = sp(frame, T.where1 + d, 10, 240);
            return (
              <div key={i} style={{ position: "absolute", left: Math.max(10, Math.min(x, 980)), top: y, rotate: `${r}deg`, scale: String(k), ...TYPE, fontSize: 120, color: YELLOW, textShadow: "0 8px 30px rgba(10,6,24,0.5)" }}>?</div>
            );
          })}
        </>
      )}
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------------------------------
// 2  the usual suspects

const FLICK = T.june + 6; // his flick blows the suspects away
const blown = (frame: number, dir = 1): React.CSSProperties => {
  const k = ramp(frame, FLICK, FLICK + 12, (t) => t * t);
  return { translate: `${dir * k * 1100}px ${-k * 120}px`, rotate: `${dir * k * 20}deg`, opacity: 1 - ramp(frame, FLICK + 6, FLICK + 12), filter: k > 0.05 ? `blur(${k * 14}px)` : undefined };
};

/** "Spoiler: it's buried in someone's inbox, in a fax tray, or on page three of an email chain from June." */
const Suspects: React.FC = () => {
  const frame = useCurrentFrame();
  if (frame < T.spoiler - 4 || frame > FLICK + 14) return null;
  const title = sp(frame, T.spoiler - 2, 15, 170);
  const items = [
    { t: "someone's inbox", icon: ICON.inbox, a: T.inbox - 6, slot: [36, 230] },
    { t: "a fax tray", icon: I.fax, a: T.fax - 6, slot: [560, 230] },
  ];
  const chain = sp(frame, T.page - 6, 13, 190);
  const scroll = (frame - T.page) * 9;
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 0, right: 0, top: 120, textAlign: "center", ...TYPE, fontSize: 56, color: W, textShadow: SOFT, opacity: title, translate: `0px ${(1 - title) * 14}px`, ...blown(frame, -1) }}>
        where it <span style={{ color: YELLOW }}>really</span> is:
      </div>
      {items.map((it, i) => {
        if (frame < it.a) return null;
        const [hx, hy] = handOut(it.a + 4, "high", "index", 2);
        const k = ramp(frame, it.a, it.a + 12, easeOut);
        const pop = sp(frame, it.a, 11, 220);
        return (
          <div key={it.t} style={{ position: "absolute", left: lerp(hx - 140, it.slot[0], k), top: lerp(hy - 60, it.slot[1], k) - Math.sin(k * Math.PI) * 60, scale: String(0.4 + 0.6 * pop), ...blown(frame, i ? 1 : -1) }}>
            <Chip icon={it.icon} text={it.t} />
          </div>
        );
      })}
      {/* the email chain from June that scrolls forever */}
      {chain > 0 && (
        <div style={{ position: "absolute", right: 26, top: 620, width: 330, height: 330, scale: String(chain), transformOrigin: "100% 0%", ...blown(frame, 1) }}>
          <div style={{ ...CARD, borderRadius: 20, width: "100%", height: "100%", overflow: "hidden", position: "relative" }}>
            <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 58, background: "#F1F0F5", display: "flex", alignItems: "center", gap: 10, padding: "0 16px", zIndex: 2 }}>
              <Icon d={I.mail} size={24} color={TR.purple} />
              <div style={{ fontSize: 19, fontWeight: 800 }}>page 3 of 9 · June</div>
            </div>
            <div style={{ position: "absolute", left: 16, right: 16, top: 70 - (scroll % 120) }}>
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} style={{ height: 112, borderBottom: "1.5px solid #EEE", paddingTop: 10 }}>
                  <div style={{ fontSize: 18, fontWeight: 800 }}>Re: Re: FW: referral – {["Jun 3", "Jun 5", "Jun 9", "Jun 12"][i % 4]}</div>
                  <div style={{ height: 10, borderRadius: 5, background: "#EDEBF3", marginTop: 10, width: "92%" }} />
                  <div style={{ height: 10, borderRadius: 5, background: "#EDEBF3", marginTop: 8, width: "70%" }} />
                  <div style={{ fontSize: 15, color: "#A3A8BA", marginTop: 8 }}>see below ↓</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------------------------------
// 3..6  the dashboard panel (screen-recording style: cursor, clicks, pressed buttons, auto-zoom)

/** "...and the X-rays are right there": a lens over the x-ray it zooms into, then "found". */
const XrayFound: React.FC<{ m: Map }> = ({ m }) => {
  const frame = useCurrentFrame();
  const from = T.rays - 4;
  if (frame < from) return null;
  const k = sp(frame, from + 6, 12, 220);
  const [x0, y0] = m(427, 290);
  const [x1, y1] = m(657, 381);
  return (
    <>
      <div style={{ position: "absolute", left: x0 - 8, top: y0 - 8, width: x1 - x0 + 16, height: y1 - y0 + 16, borderRadius: 14, border: `5px solid #1FA463`, boxShadow: "0 0 0 8px rgba(31,164,99,0.2)", opacity: Math.min(1, k * 2), scale: String(interpolate(k, [0, 1], [1.1, 1])) }} />
      <div style={{ position: "absolute", left: x0, top: y1 + 18, padding: "8px 18px", borderRadius: 999, background: "#1FA463", color: W, fontFamily: FONT_UI, fontWeight: 800, fontSize: 28, display: "flex", alignItems: "center", gap: 8, scale: String(k), transformOrigin: "0% 0%" }}>
        <Icon d={ICON.check} size={26} color={W} />
        right there
      </div>
    </>
  );
};

/** "...shared with both offices": the two offices joined over the attachments. */
const SharedBoth: React.FC<{ m: Map }> = ({ m }) => {
  const frame = useCurrentFrame();
  const from = T.shared - 2;
  if (frame < from) return null;
  const k = sp(frame, from, 13, 200);
  const [x, y] = m(840, 170);
  const node = (t: string, c: string) => (
    <div style={{ padding: "10px 18px", borderRadius: 999, background: c, color: c === W ? INK : W, fontFamily: FONT_UI, fontWeight: 800, fontSize: 26, whiteSpace: "nowrap", boxShadow: "0 10px 24px rgba(30,16,80,0.25)" }}>{t}</div>
  );
  return (
    <div style={{ position: "absolute", left: x, top: y, translate: "-50% -50%", display: "flex", alignItems: "center", gap: 10, scale: String(k), opacity: Math.min(1, k * 2) }}>
      {node("D Care Alliance", TR.purple)}
      <div style={{ ...TYPE, fontSize: 40, color: TR.purple }}>⇄</div>
      {node("Oral Surgery Assoc.", W)}
    </div>
  );
};

/** "The insurance card is too, front and back": the card lifts out of the page and flips. */
const CardFlip: React.FC = () => {
  const frame = useCurrentFrame();
  const from = T.card - 2;
  const end = TB[0] + 4;
  if (frame < from || frame > end + 8) return null;
  const lift = sp(frame, from, 14, 170);
  const flip = ramp(frame, T.front + 6, T.back + 10, easeIO);
  const out = ramp(frame, end, end + 8);
  const face = (x: number, label: string, back: boolean) => (
    <div style={{ position: "absolute", inset: 0, backfaceVisibility: "hidden", transform: back ? "rotateY(180deg)" : undefined, borderRadius: 22, overflow: "hidden", background: W, boxShadow: "0 30px 70px rgba(20,10,60,0.45)" }}>
      <div style={{ position: "absolute", left: -x * 1.85, top: -364 * 1.85, width: 1920 * 1.85, height: 842 * 1.85 }}>
        <Img src={staticFile("dash/rec-30.5.jpg")} style={{ width: "100%", height: "100%" }} />
      </div>
      <div style={{ position: "absolute", left: 16, bottom: 14, padding: "6px 16px", borderRadius: 10, background: INK, color: W, fontFamily: FONT_UI, fontWeight: 800, fontSize: 24 }}>{label}</div>
    </div>
  );
  return (
    <div style={{ position: "absolute", left: (PW - 640) / 2, top: 150, width: 640, height: 400, perspective: 1600, opacity: Math.min(1, lift * 2) * (1 - out), scale: String(interpolate(lift, [0, 1], [0.7, 1])), translate: `0px ${(1 - lift) * 120}px` }}>
      <div style={{ position: "absolute", inset: 0, transformStyle: "preserve-3d", transform: `rotateY(${flip * 180}deg) rotateX(${Math.sin(flip * Math.PI) * 8}deg)` }}>
        {face(416, "FRONT", false)}
        {face(790, "BACK", true)}
      </div>
    </div>
  );
};

/** The office chat, rebuilt from the dashboard's Office Communication panel (panel px). "Is something missing? Message
 *  the GP inside the case. Tag them, and when they answer, it's saved with the patient." */
const ChatCard: React.FC = () => {
  const frame = useCurrentFrame();
  const typed1 = "Can you send the bitewing x-rays too? ";
  const t0 = T.message - 2;
  const tagAt = T.tag - 2;
  const n1 = Math.max(0, Math.min(typed1.length, Math.floor((frame - t0) * 1.7)));
  const tagged = frame >= tagAt;
  const sendAt = tagAt + 14;
  const sent = frame >= sendAt;
  const sentK = sp(frame, sendAt, 14, 200);
  const typing = frame >= T.answer - 14 && frame < T.answer;
  const reply = sp(frame, T.answer, 13, 190);
  const saved = sp(frame, T.saved - 2, 12, 220);
  const flag = sp(frame, T.missing - 4, 12, 220);
  const got = frame >= T.saved;
  const mention = (k = 1) => (
    <span style={{ display: "inline-block", padding: "0 10px", borderRadius: 10, background: TR.purpleSoft, color: TR.purple, fontWeight: 800, scale: String(k) }}>@Sarah Chen</span>
  );
  const bubble = (top: number, who: string, org: string, text: React.ReactNode, mine: boolean, k: number, extra?: React.ReactNode) => (
    <div style={{ position: "absolute", left: 64, right: 64, top, display: "flex", gap: 18, opacity: Math.min(1, k * 2), translate: `0px ${(1 - k) * 30}px` }}>
      <div style={{ width: 70, height: 70, borderRadius: 35, flexShrink: 0, background: mine ? TR.purpleSoft : "#FCE7D6", color: mine ? TR.purple : "#B4541C", fontWeight: 800, fontSize: 27, display: "flex", alignItems: "center", justifyContent: "center" }}>{mine ? "LD" : "SC"}</div>
      <div style={{ flex: 1, padding: "16px 22px", borderRadius: 22, background: mine ? "#F6F4FB" : TR.purpleSoft }}>
        <div style={{ fontSize: 26, fontWeight: 800 }}>
          {who} <span style={{ fontWeight: 600, color: "#8A8799" }}>· {org}</span>
        </div>
        <div style={{ fontSize: 32, marginTop: 4, letterSpacing: "-0.01em", lineHeight: 1.25 }}>{text}</div>
        {extra}
      </div>
    </div>
  );
  const cam: ZK[] = [
    [T.missing - 10, 1, 516, 396],
    [T.missing + 4, 1.2, 760, 150], // the missing flag
    [T.message - 4, 1.2, 760, 150],
    [T.message + 8, 1.24, 420, 680], // into the message field
    [sendAt + 4, 1.24, 560, 660],
    [T.answer - 6, 1.0, 516, 396],
    [T.answer + 10, 1.22, 520, 470], // lean in on the reply
    [T.saved + 14, 1.22, 600, 400],
    [T.saved + 30, 1.0, 516, 396],
  ];
  return (
    <AbsoluteFill style={{ background: TR.bg, fontFamily: FONT_UI, color: INK }}>
      <Cam keys={cam}>
        <div style={{ ...CARD, position: "absolute", left: 28, top: 28, width: PW - 56, height: PH - 56, boxShadow: "0 10px 30px rgba(30,16,80,0.12)" }} />
        <div style={{ position: "absolute", left: 64, top: 54, display: "flex", alignItems: "center", gap: 14 }}>
          <Icon d={ICON.chat} size={42} color={TR.purple} />
          <div style={{ fontSize: 44, fontWeight: 800, letterSpacing: "-0.03em" }}>Office Communication</div>
        </div>
        <div style={{ position: "absolute", left: 64, top: 116, fontSize: 28, color: "#6B7085" }}>Bob Smith · with Oral Surgery Associates</div>
        {/* the missing item, flagged on the case; it turns green once the reply lands */}
        {flag > 0 && (
          <div style={{ position: "absolute", right: 64, top: 112, padding: "10px 18px", borderRadius: 999, background: got ? TR.greenSoft : "#FDE8E8", color: got ? "#137A4B" : TR.red, fontSize: 25, fontWeight: 800, scale: String(flag), display: "flex", alignItems: "center", gap: 8 }}>
            <Icon d={got ? ICON.check : ICON.alert} size={24} color={got ? "#137A4B" : TR.red} />
            {got ? "bitewings received" : "missing: bitewing x-rays"}
          </div>
        )}
        {sent && bubble(196, "Lee Davis", "D Care Alliance", <>{typed1}{mention()}</>, true, sentK)}
        {typing && (
          <div style={{ position: "absolute", left: 160, top: 400, display: "flex", gap: 10 }}>
            {[0, 1, 2].map((d) => (
              <div key={d} style={{ width: 16, height: 16, borderRadius: 8, background: "#A3A8BA", translate: `0px ${-7 * Math.max(0, Math.sin((frame + d * 4) / 3))}px` }} />
            ))}
          </div>
        )}
        {reply > 0 &&
          bubble(
            372,
            "Sarah Chen, DDS",
            "Oral Surgery Assoc.",
            <>
              <span style={{ color: TR.purple, fontWeight: 700 }}>@Lee Davis</span> Here you go!
            </>,
            false,
            reply,
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 10, padding: "8px 14px", borderRadius: 12, background: W, width: "fit-content", border: "1.5px solid #E7E3F7" }}>
              <Icon d={ICON.clip} size={26} color={TR.purple} />
              <div style={{ fontSize: 26, fontWeight: 700 }}>bitewings-L-R.jpg</div>
            </div>,
          )}
        {/* saved with the patient */}
        {saved > 0 && (
          <div style={{ position: "absolute", left: 64, top: 572, display: "flex", alignItems: "center", gap: 10, padding: "10px 20px", borderRadius: 999, background: "#1FA463", color: W, fontSize: 27, fontWeight: 800, scale: String(saved), transformOrigin: "0% 50%" }}>
            <Icon d={ICON.check} size={26} color={W} />
            saved to Bob Smith's case
          </div>
        )}
        {/* the message field and its send button */}
        <div style={{ position: "absolute", left: 64, width: 790, top: 636, height: 88, borderRadius: 18, border: `2.5px solid ${n1 > 0 && !sent ? TR.purple : "#E7E8EE"}`, display: "flex", alignItems: "center", padding: "0 24px", fontSize: 29, color: sent || n1 === 0 ? "#A3A8BA" : INK, background: W, overflow: "hidden", whiteSpace: "nowrap" }}>
          {sent || n1 === 0 ? (
            "Message Oral Surgery Associates"
          ) : (
            <>
              <span style={{ overflow: "hidden", textOverflow: "clip" }}>{tagged ? typed1.slice(14) : typed1.slice(0, n1)}</span>
              {tagged && mention(sp(frame, tagAt, 10, 260))}
            </>
          )}
          {!sent && n1 > 0 && <div style={{ width: 3, height: 34, background: TR.purple, marginLeft: 2, opacity: Math.floor(frame / 8) % 2 ? 1 : 0.2 }} />}
        </div>
        {tagged && !sent && (
          <div style={{ position: "absolute", left: 330, top: 520, width: 380, borderRadius: 16, background: W, boxShadow: "0 18px 40px rgba(30,16,80,0.22)", border: "1.5px solid #E7E3F7", padding: "8px 0", opacity: 1 - ramp(frame, tagAt + 6, tagAt + 12) }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 18px", background: TR.purpleSoft, fontSize: 25, fontWeight: 800, color: TR.purple }}>
              <div style={{ width: 40, height: 40, borderRadius: 20, background: "#FCE7D6", color: "#B4541C", fontSize: 17, display: "flex", alignItems: "center", justifyContent: "center" }}>SC</div>
              Sarah Chen, DDS
            </div>
          </div>
        )}
        <div style={{ position: "absolute", left: 874, top: 636, width: 94, height: 88, borderRadius: 18, background: TR.purple, display: "flex", alignItems: "center", justifyContent: "center", scale: String(1 - 0.1 * Math.sin(Math.min(1, Math.max(0, frame - sendAt) / 7) * Math.PI)) }}>
          <Icon d={ICON.send} size={40} color={W} />
        </div>
        <Mouse
          path={[
            [T.missing - 10, 760, 420],
            [T.missing + 2, 800, 140],
            [T.message - 4, 420, 690],
            [tagAt, 430, 700],
            [tagAt + 6, 500, 560],
            [sendAt - 2, 921, 690],
            [T.saved + 30, 921, 690],
          ]}
          clicks={[T.message - 4, tagAt + 6, sendAt - 1]}
          m={ident}
          show={[T.missing - 10, T.answer + 4]}
        />
      </Cam>
    </AbsoluteFill>
  );
};

/** Status & Schedule, rebuilt from the dashboard's panel (panel px). "Then update the status, and the referring office
 *  sees it instantly." The cursor opens the status menu, picks Consultation Scheduled and presses Update Status; the
 *  referring office is notified and sees it. */
const StatusCard: React.FC = () => {
  const frame = useCurrentFrame();
  const open = T.update1 - 8;
  const pickAt = T.update1 + 4;
  const updAt = T.status + 4;
  const menu = frame >= open + 2 && frame < pickAt + 3 ? sp(frame, open + 2, 14, 240) : 0;
  const picked = frame >= pickAt;
  const pk = sp(frame, pickAt, 12, 220);
  const toast = sp(frame, T.referring1, 14, 170);
  const note = sp(frame, T.referring1 + 4, 13, 200);
  const seen = sp(frame, T.instantly - 2, 11, 240);
  const fly = ramp(frame, updAt + 2, T.referring1 + 8, easeIO);
  const press = (at: number) => 1 - 0.07 * Math.sin(Math.min(1, Math.max(0, frame - at) / 7) * Math.PI) * (frame >= at ? 1 : 0);
  const opts = ["New", "Consultation Scheduled", "Treatment Completed", "Cancelled"];
  const cam: ZK[] = [
    [open - 10, 1, 516, 396],
    [open + 2, 1.28, 340, 330], // into the status menu
    [updAt, 1.24, 560, 250],
    [T.referring1 - 2, 1.0, 516, 396], // out for the toast and the notification
    [T.instantly - 4, 1.0, 516, 396],
    [T.instantly + 8, 1.22, 520, 600], // in on "seen"
    [T.callbacks - 4, 1.22, 520, 600],
    [T.callbacks + 10, 1.0, 516, 396],
  ];
  return (
    <AbsoluteFill style={{ background: TR.bg, fontFamily: FONT_UI, color: INK }}>
      <Cam keys={cam}>
        <div style={{ ...CARD, position: "absolute", left: 28, top: 28, width: PW - 56, height: PH - 56, boxShadow: "0 10px 30px rgba(30,16,80,0.12)" }} />
        <div style={{ position: "absolute", left: 64, top: 54, display: "flex", alignItems: "center", gap: 14 }}>
          <Icon d={ICON.calendar} size={42} color={TR.purple} />
          <div style={{ fontSize: 44, fontWeight: 800, letterSpacing: "-0.03em" }}>Status &amp; Schedule</div>
        </div>
        <div style={{ position: "absolute", left: 64, top: 118, fontSize: 29, color: "#6B7085" }}>Bob Smith · referred by Oral Surgery Associates</div>
        <div style={{ position: "absolute", left: 64, top: 190, width: 560, height: 96, borderRadius: 18, border: `3px solid ${menu > 0 || picked ? TR.purple : "#E7E8EE"}`, background: picked ? TR.purpleSoft : W, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 26px", fontSize: 34, fontWeight: 700 }}>
          <span style={{ display: "inline-block", translate: `0px ${picked ? (1 - pk) * 20 : 0}px`, opacity: picked ? pk : 1 }}>{picked ? opts[1] : opts[0]}</span>
          <span style={{ fontSize: 26, rotate: `${menu > 0 ? 180 : 0}deg` }}>▾</span>
        </div>
        <div style={{ position: "absolute", left: 650, top: 190, width: 290, height: 96, borderRadius: 18, background: frame >= updAt ? TR.purple : W, color: frame >= updAt ? W : TR.purple, border: `3px solid ${TR.purple}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32, fontWeight: 800, scale: String(press(updAt)), boxShadow: frame >= updAt && frame < updAt + 14 ? `0 0 30px ${TR.purple}88` : undefined }}>Update Status</div>
        {/* timeline of the referral */}
        <div style={{ position: "absolute", left: 64, top: 330, display: "flex", alignItems: "center", gap: 16, opacity: Math.min(1, pk * 2) }}>
          <div style={{ width: 70, height: 70, borderRadius: 18, background: TR.purpleSoft, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Icon d={ICON.calendar} size={36} color={TR.purple} />
          </div>
          <div>
            <div style={{ fontSize: 33, fontWeight: 800, letterSpacing: "-0.02em" }}>Consultation Scheduled</div>
            <div style={{ fontSize: 25, color: "#6B7085" }}>updated by Dr. Lee Davis · just now</div>
          </div>
        </div>
        {/* the referring office, notified, and seeing it */}
        <div style={{ position: "absolute", left: 64, width: 904, top: 520, height: 160, borderRadius: 22, background: "#F6F4FB", display: "flex", alignItems: "center", gap: 20, padding: "0 26px", opacity: Math.min(1, note * 2), translate: `0px ${(1 - note) * 24}px` }}>
          <div style={{ width: 84, height: 84, borderRadius: 42, background: "#FCE7D6", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", rotate: `${Math.sin((frame - T.referring1) * 0.9) * 14 * (1 - ramp(frame, T.referring1 + 4, T.referring1 + 24))}deg` }}>
            <Icon d={I.bell} size={42} color="#B4541C" />
            <div style={{ position: "absolute", right: -2, top: -2, width: 26, height: 26, borderRadius: 13, background: TR.red, scale: String(sp(frame, T.referring1 + 10, 9, 260)) }} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 33, fontWeight: 800 }}>Oral Surgery Associates</div>
            <div style={{ fontSize: 26, color: "#6B7085" }}>Bob Smith · Consultation Scheduled</div>
          </div>
          {seen > 0 && (
            <div style={{ padding: "10px 18px", borderRadius: 999, background: TR.greenSoft, color: "#137A4B", fontSize: 26, fontWeight: 800, display: "flex", alignItems: "center", gap: 8, scale: String(seen) }}>
              <Icon d={ICON.check} size={24} color="#137A4B" />
              seen · 0:01
            </div>
          )}
        </div>
        {fly > 0 && fly < 1 && <div style={{ position: "absolute", left: lerp(800, 130, fly), top: lerp(240, 600, fly) - Math.sin(fly * Math.PI) * 140, width: 26, height: 26, borderRadius: 13, background: TR.purple, boxShadow: `0 0 22px ${TR.purple}` }} />}
        {menu > 0 && (
          <div style={{ position: "absolute", left: 64, top: 296, width: 560, borderRadius: 18, background: W, boxShadow: "0 24px 50px rgba(30,16,80,0.25)", border: "1.5px solid #E7E3F7", overflow: "hidden", opacity: Math.min(1, menu * 2), translate: `0px ${(1 - menu) * -16}px` }}>
            {opts.map((o, i) => {
              const hover = i === 1 && frame >= open + 6;
              return (
                <div key={o} style={{ height: 70, display: "flex", alignItems: "center", padding: "0 26px", fontSize: 30, fontWeight: i === 1 ? 800 : 600, background: hover ? TR.purpleSoft : W, color: hover ? TR.purple : INK }}>
                  {o}
                </div>
              );
            })}
          </div>
        )}
        <Mouse
          path={[
            [open - 12, 760, 600],
            [open, 360, 240],
            [open + 6, 380, 400],
            [pickAt + 1, 380, 400],
            [updAt - 1, 790, 240],
            [T.instantly + 20, 790, 240],
          ]}
          clicks={[open, pickAt, updAt - 1]}
          m={ident}
          show={[open - 12, T.referring1 + 4]}
        />
      </Cam>
      <div style={{ position: "absolute", left: 60, right: 60, top: 40, padding: "20px 28px", borderRadius: 20, background: "#EAFBF1", border: "2px solid #BDEBD0", boxShadow: "0 18px 44px rgba(20,60,40,0.25)", fontFamily: FONT_UI, translate: `0px ${(1 - toast) * -220}px`, opacity: Math.min(1, toast * 2) * (1 - ramp(frame, T.callbacks - 6, T.callbacks + 2)) }}>
        <div style={{ fontSize: 34, fontWeight: 800, color: "#137A4B" }}>Success</div>
        <div style={{ fontSize: 27, color: "#2D5B45", marginTop: 4 }}>Status updated successfully! A notification has been created.</div>
      </div>
    </AbsoluteFill>
  );
};

/** The dashboard panel: shots over time. */
const Dash: React.FC<{ lay: Lay }> = ({ lay }) => {
  const frame = useCurrentFrame();
  if (frame < TA[0] - 2 || frame > TC[1] + 2) return null;
  const LIST: Crop = { x: 340, y: 0, w: 1100 };
  const S1 = T.heres - 16;
  const S2 = T.open - 10;
  const S3 = T.open + 10;
  const S4 = T.insurance - 8;
  const SB1 = TB[0];
  const SB2 = T.update1 - 16;
  const rows = [
    [392, 445, 1440, 556],
    [392, 560, 1440, 672],
    [392, 676, 1440, 764],
  ];
  const offices = [
    [786, 462, 886, 540],
    [786, 578, 886, 656],
    [786, 708, 900, 735],
  ];
  return (
    <div style={{ position: "absolute", left: 24, top: lay.dashTop + 24, width: PW, height: PH, borderRadius: 30, overflow: "hidden", background: TR.bg, boxShadow: "0 24px 60px rgba(0,0,0,0.45)", border: "1.5px solid rgba(255,255,255,0.18)" }}>
      {/* every incoming referral (zoom on the rows), from every office (the column), one list you can trust (out) */}
      <Shot
        img="rec-2.jpg"
        from={S1}
        to={S2}
        keys={[
          [S1, { x: 330, y: 0, w: 1180 }],
          [T.every1 - 4, { x: 360, y: 60, w: 1040 }],
          [T.every1 + 10, { x: 380, y: 182, w: 860 }],
          [T.from2 - 2, { x: 380, y: 182, w: 860 }],
          [T.from2 + 12, { x: 600, y: 380, w: 560 }],
          [T.lands - 8, { x: 600, y: 380, w: 560 }],
          [T.lands + 8, LIST],
        ]}
      >
        {(m) => (
          <>
            {rows.map((r, i) => (
              <Hl key={i} box={r} m={m} k={sp(frame, T.every1 + i * 5, 14, 200) * (1 - ramp(frame, T.from2 - 2, T.from2 + 4))} fill />
            ))}
            {offices.map((r, i) => (
              <Hl key={i} box={r} m={m} k={sp(frame, T.from2 + 6 + i * 6, 13, 220) * (1 - ramp(frame, T.lands - 2, T.lands + 4))} color="#1FA463" label={i === 0 ? "every office" : undefined} />
            ))}
            <Hl box={[392, 380, 1440, 790]} m={m} k={sp(frame, T.lands + 4, 12, 180)} color={YELLOW} fill={false} label="one list" labelSide="top" />
            {[
              [797, 476],
              [797, 592],
              [797, 720],
            ].map(([x, y], i) => (
              <Pulse key={i} x={x} y={y} at={T.trust - 4 + i * 3} m={m} />
            ))}
            {frame >= T.trust - 4 && (
              <div style={{ position: "absolute", right: 30, top: 30, padding: "12px 22px", borderRadius: 999, background: "#1FA463", color: W, fontFamily: FONT_UI, fontWeight: 800, fontSize: 30, display: "flex", alignItems: "center", gap: 10, scale: String(sp(frame, T.trust - 4, 12, 220)), boxShadow: "0 12px 30px rgba(0,0,0,0.25)" }}>
                <Icon d={ICON.shield} size={28} color={W} />
                connected offices only
              </div>
            )}
            <Mouse
              path={[
                [S1, 1400, 260],
                [T.every1, 700, 500],
                [T.from2 + 6, 836, 500],
                [T.from2 + 14, 836, 616],
                [T.from2 + 22, 836, 722],
                [T.lands + 6, 1200, 300],
              ]}
              clicks={[]}
              m={m}
              show={[S1 + 4, S2]}
            />
          </>
        )}
      </Shot>
      {/* "Open the patient": the cursor clicks View, the camera dives into the click */}
      <Shot
        img="rec-2.jpg"
        from={S2}
        to={S3}
        keys={[
          [S2, LIST],
          [T.open + 2, { x: 1300, y: 300, w: 600 }],
          [S3 + 9, { x: 1600, y: 440, w: 200 }],
        ]}
      >
        {(m) => (
          <>
            <Press box={[1675, 488, 1720, 514]} at={T.open + 2} m={m} />
            <Mouse path={[[S2, 1200, 300], [T.open + 1, 1697, 502]]} clicks={[T.open + 2]} m={m} show={[S2, S3 + 6]} />
          </>
        )}
      </Shot>
      {/* the x-rays, right there (zoom in on one), shared with both offices (out) */}
      <Shot
        img="rec-27.5.jpg"
        from={S3}
        to={S4}
        keys={[
          [S3, { x: 440, y: 220, w: 520 }],
          [S3 + 12, { x: 380, y: 100, w: 960 }],
          [T.rays - 6, { x: 380, y: 100, w: 960 }],
          [T.rays + 6, { x: 400, y: 250, w: 340 }],
          [T.shared - 6, { x: 400, y: 250, w: 340 }],
          [T.shared + 6, { x: 380, y: 100, w: 960 }],
        ]}
      >
        {(m) => (
          <>
            <Hl box={[388, 120, 925, 178]} m={m} k={sp(frame, T.shared - 2, 12, 200)} color={TR.purple} fill />
            <XrayFound m={m} />
            <SharedBoth m={m} />
            <Press box={[427, 290, 657, 381]} at={T.rays + 1} m={m} color="#1FA463" />
            <Mouse path={[[S3 + 4, 900, 500], [T.rays, 540, 335], [T.shared + 4, 560, 340]]} clicks={[T.rays + 1]} m={m} show={[S3 + 6, T.shared]} />
          </>
        )}
      </Shot>
      {/* the insurance card, front and back */}
      <Shot
        img="rec-30.5.jpg"
        from={S4}
        to={SB1 + 6}
        keys={[
          [S4, { x: 380, y: 150, w: 960 }],
          [T.card, { x: 380, y: 200, w: 900 }],
        ]}
        dim={ramp(frame, T.card - 2, T.card + 8) * 0.55}
      >
        {(m) => <Hl box={[390, 226, 740, 282]} m={m} k={sp(frame, T.insurance - 4, 12, 200) * (1 - ramp(frame, T.card - 2, T.card + 6))} label="insurance cards" labelSide="bottom" />}
      </Shot>
      <CardFlip />
      {/* the conversation and the status, rebuilt crisp from the dashboard's own components */}
      {frame >= SB1 - 2 && frame < SB2 + 10 && (
        <AbsoluteFill style={{ opacity: ramp(frame, SB1 + 4, SB1 + 14) * (1 - ramp(frame, SB2, SB2 + 10)) }}>
          <ChatCard />
        </AbsoluteFill>
      )}
      {frame >= SB2 && (
        <AbsoluteFill style={{ opacity: ramp(frame, SB2, SB2 + 10), filter: frame < SB2 + 10 ? `blur(${(1 - ramp(frame, SB2, SB2 + 10)) * 8}px)` : undefined }}>
          <StatusCard />
        </AbsoluteFill>
      )}
    </div>
  );
};

/** "No more callbacks or 'any update?' emails": on his side of the split, the callback is crossed out and the email
 *  is brushed away with his hand. */
const NoChase: React.FC<{ lay: Lay }> = ({ lay }) => {
  const frame = useCurrentFrame();
  const from = T.callbacks - 6;
  const end = T.emails + 10;
  if (frame < from || frame > end + 10) return null;
  const out = ramp(frame, end, end + 10);
  const a = sp(frame, from, 12, 220);
  const strike = ramp(frame, T.callbacks + 6, T.callbacks + 14, easeOut);
  const b = sp(frame, T.update2 - 10, 12, 220);
  const brush = ramp(frame, T.emails - 4, T.emails + 8, (t) => t * t);
  const top = Math.min(lay.bottom - 240, 640);
  return (
    <AbsoluteFill style={{ opacity: 1 - out }}>
      <div style={{ position: "absolute", left: 30, top, scale: String(a), transformOrigin: "0% 50%" }}>
        <div style={{ position: "relative" }}>
          <Pill icon={I.phone} title="callback #4" sub="“just checking on Bob…”" color="#FFB36B" />
          {strike > 0 && <div style={{ position: "absolute", left: -6, top: "48%", height: 10, width: `${strike * 104}%`, background: RED, borderRadius: 6, rotate: "-5deg", boxShadow: "0 4px 14px rgba(10,6,24,0.35)" }} />}
        </div>
      </div>
      {b > 0 && (
        <div style={{ position: "absolute", right: 30, top: top + 10, scale: String(b), transformOrigin: "100% 50%", translate: `${brush * 700}px ${-brush * 60}px`, rotate: `${brush * 18}deg`, opacity: 1 - ramp(frame, T.emails + 2, T.emails + 8), filter: brush > 0.05 ? `blur(${brush * 12}px)` : undefined }}>
          <div style={{ ...CARD, borderRadius: 20, padding: "14px 20px", width: 330 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <Icon d={I.mail} size={26} color={TR.red} />
              <div style={{ fontSize: 24, fontWeight: 800 }}>Re: any update??</div>
            </div>
            <div style={{ fontSize: 19, color: "#6B7085", marginTop: 4 }}>3rd follow-up this week</div>
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------------------------------
// 7  the network

const NODES = [
  { t: "GP office", x: 150, y: 200 },
  { t: "Oral Surgery", x: 540, y: 120 },
  { t: "Holland General", x: 930, y: 200 },
  { t: "R Dental", x: 140, y: 470 },
  { t: "D Care Alliance", x: 940, y: 470 },
];

/** "Every office you work with stays connected. That's not just software; it's a referral network that works." Badges
 *  appear behind him and wire to each other; when his hands meet they snap into one hub. */
const Network: React.FC = () => {
  const frame = useCurrentFrame();
  const from = T.every3 - 2;
  const { p, out, on } = win(frame, from, T.so - 6, 10);
  if (!on) return null;
  const snap = ramp(frame, T.thats1 - 2, T.thats1 + 22, easeIO);
  // the hub sits above his head (the clear band), so the badges stay visible as they snap in
  const hub: [number, number] = [540, 470];
  const glow = sp(frame, T.network1 - 4, 12, 200);
  const appear = [T.every3, T.every3 + 6, T.work, T.work + 6, T.stays];
  const pos = NODES.map((n) => [lerp(n.x, hub[0], snap * 0.8), lerp(n.y, hub[1] - 260, snap * 0.8)] as [number, number]);
  const ring = [0, 1, 2, 4, 3];
  return (
    <AbsoluteFill style={{ opacity: Math.min(1, p * 1.5) * (1 - out), filter: out > 0 ? `blur(${out * 8}px)` : undefined }}>
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, opacity: 1 - Math.min(1, glow * 1.2) }}>
        {ring.map((a, i) => {
          const b = ring[(i + 1) % ring.length];
          const k = ramp(frame, appear[Math.max(a, b)], appear[Math.max(a, b)] + 10, easeOut);
          return <line key={i} x1={pos[a][0]} y1={pos[a][1]} x2={lerp(pos[a][0], pos[b][0], k)} y2={lerp(pos[a][1], pos[b][1], k)} stroke={YELLOW} strokeWidth={5} strokeLinecap="round" opacity={0.85} />;
        })}
        {snap > 0 &&
          pos.map(([x, y], i) => <line key={`h${i}`} x1={x} y1={y} x2={lerp(x, hub[0], snap)} y2={lerp(y, hub[1] - 260, snap)} stroke="rgba(255,255,255,0.6)" strokeWidth={4} strokeDasharray="10 10" strokeDashoffset={-frame * 2} />)}
      </svg>
      {glow > 0 && (
        <div style={{ position: "absolute", left: hub[0], top: hub[1] - 260, translate: "-50% -50%", scale: String(glow), padding: "16px 28px", borderRadius: 999, background: YELLOW, color: INK, ...TYPE, letterSpacing: "-0.025em", fontSize: 40, whiteSpace: "nowrap", boxShadow: "0 0 50px rgba(243,221,114,0.6)" }}>one referral network</div>
      )}
      {NODES.map((n, i) => {
        const k = sp(frame, appear[i], 13, 200);
        return (
          <div key={n.t} style={{ position: "absolute", left: pos[i][0], top: pos[i][1], translate: "-50% -50%", scale: String(k * (1 - glow * 0.7)), opacity: 1 - Math.min(1, glow * 1.2), display: "flex", alignItems: "center", gap: 10, padding: "12px 20px 12px 12px", borderRadius: 999, background: W, boxShadow: "0 14px 34px rgba(10,6,24,0.4)", fontFamily: FONT_UI, whiteSpace: "nowrap" }}>
            <div style={{ width: 40, height: 40, borderRadius: 20, background: "#1FA463", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Icon d={ICON.check} size={22} color={W} />
            </div>
            <div style={{ fontSize: 27, fontWeight: 800, color: INK, letterSpacing: "-0.02em" }}>{n.t}</div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------------------------------
// 8  the close: the 4:58 clock comes back, the x-ray found; calm, collected, connected

const Found: React.FC = () => {
  const frame = useCurrentFrame();
  const from = T.t458b - 6;
  const { p, out, on } = win(frame, from, T.want - 6, 9);
  if (!on) return null;
  const ok = sp(frame, T.know, 12, 220);
  return (
    <div style={{ position: "absolute", left: 28, top: 380, scale: String(p), transformOrigin: "0% 50%", opacity: 1 - out }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 26px 14px 16px", borderRadius: 999, background: ok > 0.5 ? "#1FA463" : "rgba(16,12,30,0.88)", boxShadow: "0 14px 34px rgba(10,6,24,0.45)", fontFamily: FONT_UI, color: W }}>
        <ClockFace t={0.4} />
        <div>
          <div style={{ fontSize: 40, fontWeight: 800, letterSpacing: "-0.02em" }}>4:58 PM</div>
          <div style={{ fontSize: 22, fontWeight: 700, opacity: 0.9 }}>{ok > 0.5 ? "x-ray: right there ✓" : "next time…"}</div>
        </div>
      </div>
      {ok > 0 && (
        <div style={{ marginTop: 14, width: 260, height: 104, borderRadius: 16, overflow: "hidden", border: "4px solid #1FA463", boxShadow: "0 14px 30px rgba(10,6,24,0.4)", scale: String(ok), transformOrigin: "0% 0%", position: "relative" }}>
          <div style={{ position: "absolute", left: -427 * 1.13, top: -290 * 1.13, width: 1920 * 1.13, height: 842 * 1.13 }}>
            <Img src={staticFile("dash/rec-27.5.jpg")} style={{ width: "100%", height: "100%" }} />
          </div>
        </div>
      )}
    </div>
  );
};

/** "Calm, collected, and connected.": one check per beat of his hand, on the right. */
const ThreeC: React.FC = () => {
  const frame = useCurrentFrame();
  const words = [
    { t: "calm", a: T.calm1 - 2 },
    { t: "collected", a: T.collected - 2 },
    { t: "connected", a: T.connected2 - 2 },
  ];
  const end = T.want - 6;
  if (frame < words[0].a || frame > end + 9) return null;
  const out = ramp(frame, end, end + 9);
  return (
    <div style={{ position: "absolute", right: 30, top: 380, display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 14, opacity: 1 - out }}>
      {words.map((w) => {
        const k = sp(frame, w.a, 11, 230);
        if (k <= 0) return null;
        return (
          <div key={w.t} style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 22px 12px 14px", borderRadius: 999, background: YELLOW, color: INK, ...TYPE, letterSpacing: "-0.025em", fontSize: 40, scale: String(k), transformOrigin: "100% 50%", boxShadow: "0 12px 30px rgba(10,6,24,0.4)" }}>
            <div style={{ width: 40, height: 40, borderRadius: 20, background: INK, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Icon d={ICON.check} size={24} color={YELLOW} />
            </div>
            {w.t}.
          </div>
        );
      })}
    </div>
  );
};

// ---------------------------------------------------------------------------------------------------
// 9  the call to action

/** "Want that calm for your office?": ripples off the finger he points at the lens. */
const PointRipple: React.FC = () => {
  const frame = useCurrentFrame();
  const from = T.want;
  if (frame < from || frame > from + 40) return null;
  const [x, y] = handOut(from + 6, "high", "index", 3);
  return (
    <>
      {[0, 8, 16].map((d) => {
        const k = ramp(frame, from + d, from + d + 22, easeOut);
        if (k <= 0 || k >= 1) return null;
        return <div key={d} style={{ position: "absolute", left: x - 60, top: y - 60, width: 120, height: 120, borderRadius: 60, border: `6px solid ${YELLOW}`, scale: String(0.3 + k * 2.6), opacity: 1 - k }} />;
      })}
    </>
  );
};

/** "Check out ToothReferral": the logo behind his head. */
const CtaLogo: React.FC = () => {
  const frame = useCurrentFrame();
  const from = T.check - 4;
  const { p, out, on } = win(frame, from, CUT_FRAMES - 4, 9);
  if (!on) return null;
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: 120, display: "flex", justifyContent: "center", opacity: Math.min(1, p * 1.5) * (1 - out), translate: `0px ${(1 - p) * 60}px`, filter: "drop-shadow(0 4px 18px rgba(8,4,24,0.55))" }}>
      <Sequence from={from} layout="none">
        <LogoReveal at={0} width={460} revealDur={18} shineDur={28} />
      </Sequence>
    </div>
  );
};

/** The link, rising off the finger he points with. */
const CtaLink: React.FC = () => {
  const frame = useCurrentFrame();
  const from = T.check - 2;
  const { p, out, on } = win(frame, from, CUT_FRAMES - 4, 9);
  if (!on) return null;
  const [hx, hy] = handOut(from, "high", "index", 3);
  const k = ramp(frame, from, from + 14, easeOut);
  return (
    <div style={{ position: "absolute", left: lerp(hx, 540, k), top: lerp(hy, 300, k), translate: "-50% -50%", scale: String(interpolate(p, [0, 1], [0.4, 1])), opacity: Math.min(1, p * 2) * (1 - out), padding: "16px 34px", borderRadius: 999, background: YELLOW, color: INK, ...TYPE, letterSpacing: "-0.025em", fontSize: 44, boxShadow: "0 14px 34px rgba(10,6,24,0.45)", whiteSpace: "nowrap" }}>toothreferral.com</div>
  );
};

/** "...and bring every referring office into one place": offices fly in from the edges to his gathering hands. */
const Gather: React.FC = () => {
  const frame = useCurrentFrame();
  const from = T.bring - 4;
  const { p, out, on } = win(frame, from, CUT_FRAMES - 2, 8);
  if (!on) return null;
  const [, hy] = handOut(Math.min(frame, T.place + 4), "low", "palm", 4);
  const hub: [number, number] = [540, Math.min(hy - 170, 1230)];
  const offs = [
    { t: "GP office", x: -120, y: 640, d: 0 },
    { t: "Oral Surgery", x: 1200, y: 700, d: 4 },
    { t: "R Dental", x: -120, y: 980, d: 8 },
    { t: "Holland General", x: 1200, y: 1020, d: 12 },
  ];
  const one = sp(frame, T.place - 8, 12, 220);
  return (
    <AbsoluteFill style={{ opacity: Math.min(1, p * 2) * (1 - out) }}>
      {offs.map((o, i) => {
        const k = ramp(frame, from + o.d, from + o.d + 22, easeIO);
        const x = lerp(o.x, hub[0] + (i % 2 ? 110 : -110), k);
        const y = lerp(o.y, hub[1] + (i < 2 ? -40 : 40), k);
        return (
          <div key={o.t} style={{ position: "absolute", left: x, top: y, translate: "-50% -50%", scale: String(1 - 0.25 * k), padding: "10px 18px", borderRadius: 999, background: W, color: INK, fontFamily: FONT_UI, fontWeight: 800, fontSize: 26, whiteSpace: "nowrap", boxShadow: "0 12px 28px rgba(10,6,24,0.4)", opacity: 1 - one * 0.6 }}>{o.t}</div>
        );
      })}
      {one > 0 && (
        <div style={{ position: "absolute", left: hub[0], top: hub[1], translate: "-50% -50%", scale: String(one), padding: "14px 28px", borderRadius: 999, background: TR.purple, color: W, ...TYPE, letterSpacing: "-0.025em", fontSize: 38, whiteSpace: "nowrap", boxShadow: `0 0 40px ${TR.purple}` }}>one place</div>
      )}
    </AbsoluteFill>
  );
};

const EndCard: React.FC = () => {
  const frame = useCurrentFrame();
  if (frame < CUT_FRAMES - 8) return null;
  const card = ramp(frame, CUT_FRAMES - 6, CUT_FRAMES + 10, easeIO);
  const url = sp(frame, CUT_FRAMES + 6, 14, 160);
  const btn = sp(frame, CUT_FRAMES + 12, 13, 170);
  return (
    <>
      <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 45%, rgba(27,18,64,0.55), rgba(16,10,40,0.92))`, opacity: card }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 640, display: "flex", justifyContent: "center", opacity: card, scale: String(interpolate(card, [0, 1], [0.9, 1.2])), filter: "drop-shadow(0 4px 18px rgba(8,4,24,0.55))" }}>
        <Sequence from={CUT_FRAMES - 6} layout="none">
          <LogoReveal at={0} width={440} revealDur={18} shineDur={28} />
        </Sequence>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 960, textAlign: "center", opacity: url, translate: `0px ${(1 - url) * 16}px`, ...TYPE, fontSize: 52, color: W, letterSpacing: "-0.03em" }}>toothreferral.com</div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 1030, textAlign: "center", opacity: url, ...TYPE, fontSize: 34, color: "rgba(255,255,255,0.7)", letterSpacing: "-0.02em", fontWeight: 700 }}>calm, collected, connected</div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 1120, display: "flex", justifyContent: "center", opacity: Math.min(1, btn * 1.5), scale: String(interpolate(btn, [0, 1], [0.8, 1])) }}>
        <div style={{ padding: "22px 40px", borderRadius: 22, background: YELLOW, color: INK, ...TYPE, letterSpacing: "-0.03em", fontSize: 40, boxShadow: "0 16px 40px rgba(10,6,24,0.45)" }}>bring every office into one place →</div>
      </div>
    </>
  );
};

// ---------------------------------------------------------------------------------------------------
// The edit

export const XrayHunt: React.FC = () => {
  const frame = useCurrentFrame();
  const f0 = Math.min(frame, CUT_FRAMES - 1);
  const lay = layoutAt(f0);
  const fr = framingFor(lay);
  const freeze = frame >= CUT_FRAMES - 1;
  // one grade over the whole film, on top of the per-take colour match
  const grade: React.CSSProperties = { filter: "contrast(1.05) saturate(1.06) brightness(1.01)" };
  const speaker = (layer: "full" | "cutout", style?: React.CSSProperties) => {
    const el = <TalentLayer talent={TL} layer={layer} framing={fr} style={{ ...grade, ...style }} />;
    return freeze ? <Freeze frame={CUT_FRAMES - 2}>{el}</Freeze> : el;
  };
  const full = lay.mode === "full" && lay.top < 1 && lay.bottom > 1919;
  // "Where the hell is it?" lands with a short shake
  const shake = frame >= T.where1 - 2 && frame < T.where1 + 8 ? Math.sin(frame * 3.1) * (T.where1 + 8 - frame) * 1.2 : 0;
  const endBlur = interpolate(frame, [CUT_FRAMES - 6, CUT_FRAMES + 10], [0, 14], clamp);
  const band: React.CSSProperties = { clipPath: `inset(${lay.top}px 0px ${1920 - lay.bottom}px 0px round ${full ? 0 : 30}px)` };
  return (
    <AbsoluteFill style={{ background: BG }}>
      <FontGate>
        <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 40%, #2A1B5E, ${BG} 70%)` }} />
        <AbsoluteFill style={{ filter: endBlur > 0 ? `blur(${endBlur}px)` : undefined, translate: `${shake}px ${shake * 0.4}px` }}>
          <AbsoluteFill style={band}>
            {speaker("full")}
            {full && (
              <>
                {/* behind the speaker */}
                {frame >= T.tooth1 - 6 && frame < T.heres - 10 && (
                  <Sequence from={T.tooth1 - 6} layout="none">
                    <div style={{ position: "absolute", left: 0, right: 0, top: 110, display: "flex", justifyContent: "center", filter: "drop-shadow(0 4px 18px rgba(8,4,24,0.55))", opacity: 1 - ramp(frame, T.heres - 20, T.heres - 10) }}>
                      <LogoReveal at={0} width={520} revealDur={18} shineDur={28} />
                    </div>
                  </Sequence>
                )}
                <Network />
                <CtaLogo />
                {speaker("cutout")}
              </>
            )}
          </AbsoluteFill>
          <Dash lay={lay} />
          {/* in front */}
          <Hook />
          <Suspects />
          <NoChase lay={lay} />
          <Found />
          <ThreeC />
          <PointRipple />
          <CtaLink />
          <Gather />
        </AbsoluteFill>
        {frame < CUT_FRAMES - 4 && <Captions lay={lay} />}
        <EndCard />
        <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 42%, transparent 55%, rgba(8,5,18,0.38) 100%)", pointerEvents: "none" }} />
      </FontGate>

      <Audio src={staticFile("audio/voice/xr-cut.wav")} volume={(f) => interpolate(f, [CUT_FRAMES - 4, CUT_FRAMES + 4], [1, 0], clamp)} />
      <Audio src={staticFile("audio/music/cb-bed.ogg")} volume={(f) => 0.07 * interpolate(f, [0, 20, XR_DURATION - 45, XR_DURATION - 1], [0, 1, 1, 0], clamp)} />
      {[
        { f: 0, s: "impact", v: 0.12 },
        { f: T.t458a - 4, s: "tick-1", v: 0.14 },
        { f: T.chair - 6, s: "pop-1", v: 0.12 },
        { f: T.swears - 4, s: "pop-2", v: 0.12 },
        { f: T.where1 - 2, s: "impact", v: 0.18 },
        { f: T.spoiler - 2, s: "whoosh-short", v: 0.1 },
        { f: T.inbox - 6, s: "pop-1", v: 0.13 },
        { f: T.fax - 6, s: "pop-2", v: 0.13 },
        { f: T.page - 6, s: "pop-3", v: 0.13 },
        { f: FLICK, s: "whoosh-long", v: 0.16 },
        { f: T.tooth1 - 6, s: "shimmer", v: 0.16 },
        { f: TA[0], s: "whoosh-short", v: 0.12 },
        { f: T.every1, s: "tick-2", v: 0.1 },
        { f: T.from2 + 6, s: "tick-3", v: 0.1 },
        { f: T.lands + 4, s: "pop-1", v: 0.12 },
        { f: T.trust - 4, s: "chime", v: 0.1 },
        { f: T.open + 2, s: "click", v: 0.16 },
        { f: T.rays + 1, s: "click", v: 0.14 },
        { f: T.shared - 2, s: "pop-2", v: 0.1 },
        { f: T.card - 2, s: "whoosh-short", v: 0.1 },
        { f: T.front + 6, s: "whoosh-short", v: 0.1 },
        { f: TB[0], s: "whoosh-short", v: 0.12 },
        { f: T.missing - 4, s: "blip-1", v: 0.12 },
        { f: T.message - 4, s: "click", v: 0.13 },
        { f: T.tag + 4, s: "click", v: 0.12 },
        { f: T.answer, s: "blip-3", v: 0.12 },
        { f: T.saved - 2, s: "chime", v: 0.12 },
        { f: T.update1 - 8, s: "click", v: 0.12 },
        { f: T.status + 3, s: "click", v: 0.14 },
        { f: T.referring1, s: "chime", v: 0.14 },
        { f: T.callbacks + 6, s: "thud", v: 0.12 },
        { f: T.emails - 4, s: "whoosh-short", v: 0.12 },
        { f: TC[0], s: "whoosh-short", v: 0.12 },
        { f: T.every3, s: "pop-1", v: 0.1 },
        { f: T.work, s: "pop-2", v: 0.1 },
        { f: T.stays, s: "pop-3", v: 0.1 },
        { f: T.thats1 - 2, s: "riser", v: 0.08 },
        { f: T.network1 - 4, s: "shimmer", v: 0.12 },
        { f: T.t458b - 6, s: "tick-4", v: 0.12 },
        { f: T.know, s: "chime", v: 0.12 },
        { f: T.calm1 - 2, s: "pop-1", v: 0.12 },
        { f: T.collected - 2, s: "pop-2", v: 0.12 },
        { f: T.connected2 - 2, s: "pop-3", v: 0.12 },
        { f: T.want, s: "blip-1", v: 0.1 },
        { f: T.check - 4, s: "shimmer", v: 0.14 },
        { f: T.bring - 4, s: "whoosh-short", v: 0.1 },
        { f: T.place - 8, s: "pop-1", v: 0.12 },
        { f: CUT_FRAMES - 6, s: "whoosh-long", v: 0.16 },
      ].map((x, i) => (
        <Sequence key={i} from={Math.max(0, x.f)} layout="none">
          <Audio src={staticFile(`audio/sfx/${x.s}.wav`)} volume={x.v} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
