/**
 * "The Front Desk Magic Show": ToothReferral short (Script 5, male presenter, humour). The front desk "makes referrals
 * disappear"; the new Analytics shows where (the funnel, the ghost rate, Needs attention), then the math, the signed
 * DocuSign completion note to the GP, and a five-minute setup.
 *
 *   1  hook (full)                red flash, stacked "I SHOULDN'T BE SAYING THIS", punch-ins
 *   2  the magician (full)        a marquee billboard, a stage spotlight; a referral card goes up in smoke
 *   3  the trick (full)           a GP's referral slides in, one voicemail, poof, "0 callbacks" (the "Ta-da!" line
 *                                 was cut)
 *   4  the best trick (full)      "Scheduled" with no appointment behind it; it fogs over: nobody can tell
 *   5  the cost (full)            "Here's the problem": the Glass type effect, a slow push-in, the room dims; a loss counter ticking to -$10,000+
 *   6  the analytics (split A)    the real Referral funnel row by row, the leak rows; the Ghost rate card with a ghost
 *                                 that turns into "very fixable"; Needs attention, a cold case re-assigned in one click
 *   7  the math (full)            1 rescued referral = system paid for; 1 saved after turnover = 12 months covered
 *   8  the signed note (split B)  DocuSign completion note, signed, sent to the GP; the top sender sends more patients
 *   9  setup + CTA (full)         a ring of chips (network, analytics, lead forms, DocuSign), logo behind his head, the link, "magic act: RETIRED", end card
 *
 * One continuous take: ten takes colour-matched, cut at the pauses, morph-cut (scripts/build_ms_src.sh). Takes 9-10 are
 * framed closer; that join is a hard cut hidden under the move into split B. One voice: Seed-VC to take 1's voice.
 * Demo data; patients, offices and staff are fictional.
 */
import React from "react";
import { AbsoluteFill, Audio, Freeze, Img, Sequence, interpolate, spring, staticFile, useCurrentFrame } from "remotion";
import { FontGate, TALENT, TalentLayer, faceAt, type Framing } from "../effects";
import { GlassType } from "../effects/17-glass-type";
import transcript from "../data/transcript-ms.json";
import cut from "../data/ms-cut-segments.json";
import handsData from "../data/hands-ms.json";
import { FONT_UI } from "../theme";
import { LogoReveal, easeIO, easeOut, ramp } from "../tr/motion";
import { ICON, Icon, TR, clamp } from "../tr/ui";

const TL = TALENT["ms-cut"];
const FPS = 30;
const CUT_FRAMES = Math.round(cut.duration * FPS);
const TAIL = 75;
export const MS_DURATION = CUT_FRAMES + TAIL;

// ---------------------------------------------------------------------------------------------------
// Look

const YELLOW = "#F3DD72";
const RED = "#FF4D5A";
const INK = "#16131F";
const W = "#FFFFFF";
const BG = "#0F0B1C";
const GREEN = "#1FA463";
const TYPE: React.CSSProperties = { fontFamily: FONT_UI, fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 0.98 };
const SOFT = "0 2px 16px rgba(10,6,24,0.55), 0 1px 3px rgba(10,6,24,0.5)";
const CARD: React.CSSProperties = { background: "#fff", borderRadius: 24, boxShadow: "0 24px 60px rgba(10,6,30,0.35), 0 2px 6px rgba(10,6,30,0.12)", fontFamily: FONT_UI, color: INK };

// ---------------------------------------------------------------------------------------------------
// Timing

const WORDS = transcript["ms-cut"].words;
const norm = (w: string) => w.toLowerCase().replace(/[^a-z0-9]/g, "");
const at = (word: string, n = 1) => {
  const hits = WORDS.filter((w) => norm(w.word) === word);
  if (!hits[n - 1]) throw new Error(`"${word}" #${n} not in transcript`);
  return Math.round(hits[n - 1].start * FPS);
};
const sp = (frame: number, a: number, damping = 15, stiffness = 160) =>
  frame < a ? 0 : spring({ frame: frame - a, fps: FPS, config: { damping, stiffness, mass: 0.75 } });
const win = (frame: number, from: number, to: number, outLen = 8) => ({
  p: sp(frame, from),
  out: interpolate(frame, [to - outLen, to], [0, 1], clamp),
  on: frame >= from - 1 && frame <= to,
});

// ---------------------------------------------------------------------------------------------------
// Timing

const T = {
  shouldnt: at("shouldnt"),
  but: at("but"),
  front: at("front", 1),
  magician: at("magician"),
  town: at("town"),
  they: at("they"),
  disappear: at("disappear"),
  watch: at("watch"),
  gp1: at("gp", 1),
  patient: at("patient"),
  voicemail: at("voicemail"),
  poof: at("poof"),
  nobody2: at("nobody", 1),
  back: at("back", 1),
  their: at("their"),
  trick: at("trick"),
  marking: at("marking"),
  sched1: at("scheduled", 1),
  nobody3: at("nobody", 2),
  sched2: at("scheduled", 2),
  audience: at("audience"),
  heres: at("heres"),
  problem: at("problem"),
  disappearing: at("disappearing"),
  tens: at("tens"),
  thousands: at("thousands"),
  month: at("month"),
  so: at("so"),
  checked: at("checked"),
  analytics: at("analytics"),
  leak: at("leak"),
  received: at("received"),
  contacted: at("contacted"),
  sched3: at("scheduled", 3),
  dropped: at("dropped"),
  ghost: at("ghost"),
  real: at("real"),
  spooky: at("spooky"),
  fixable: at("fixable"),
  needs: at("needs"),
  cold: at("cold"),
  anyone: at("anyone"),
  team: at("team"),
  reassign: at("reassign"),
  click: at("click"),
  now: at("now", 2),
  math: at("math"),
  rescued: at("rescued"),
  pays: at("pays"),
  system: at("system"),
  saved: at("saved"),
  turnover: at("turnover"),
  year: at("year"),
  when: at("when", 2),
  treatment: at("treatment"),
  signed: at("signed"),
  straight: at("straight"),
  happy: at("happy"),
  patients: at("patients"),
  setup: at("setup"),
  five: at("five"),
  check: at("check"),
  retire: at("retire"),
  magic: at("magic"),
  good: at("good"),
};
/** Take 9 is framed closer than takes 1-8: that join is a hard cut (scripts/build_ms_src.sh), hidden by the layout move. */
const CUT9 = Math.round((cut.segments.find((s) => s.in > 63.3) ?? cut.segments[cut.segments.length - 1]).at * FPS);

// ---------------------------------------------------------------------------------------------------
// Layout: full, split A (dashboard top, him below), split B (him top, dashboard below). Eased, never a cut.

const PANEL = 840;
const SPLIT_A = { y: 675, top: 840, bottom: 1920 };
const SPLIT_B = { y: -90, top: 0, bottom: 1080 };
const FULL = { y: 0, top: 0, bottom: 1920 };
const TA = [T.so - 16, T.so + 4] as const; // full -> A (analytics)
const TF = [T.now - 14, T.now + 4] as const; // A -> full (the math)
const TB = [CUT9 - 9, CUT9 + 9] as const; // full -> B, across the take 9 hard cut
const TC = [T.setup - 16, T.setup + 2] as const; // B -> full

const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
type Lay = { y: number; top: number; bottom: number; dashTop: number; mode: "full" | "A" | "B" };
const mix = (a: typeof FULL, b: typeof FULL, k: number) => ({ y: lerp(a.y, b.y, k), top: lerp(a.top, b.top, k), bottom: lerp(a.bottom, b.bottom, k) });
const layoutAt = (frame: number): Lay => {
  if (frame < TA[1]) {
    const k = ramp(frame, TA[0], TA[1], easeIO);
    return { ...mix(FULL, SPLIT_A, k), dashTop: lerp(-PANEL - 40, 0, k), mode: k > 0.5 ? "A" : "full" };
  }
  if (frame < TF[1]) {
    const k = ramp(frame, TF[0], TF[1], easeIO);
    return { ...mix(SPLIT_A, FULL, k), dashTop: lerp(0, -PANEL - 40, k), mode: k > 0.5 ? "full" : "A" };
  }
  if (frame < TB[1]) {
    const k = ramp(frame, TB[0], TB[1], easeIO);
    return { ...mix(FULL, SPLIT_B, k), dashTop: lerp(1960, 1920 - PANEL, k), mode: k > 0.5 ? "B" : "full" };
  }
  const k = ramp(frame, TC[0], TC[1], easeIO);
  return { ...mix(SPLIT_B, FULL, k), dashTop: lerp(1920 - PANEL, 1960, k), mode: k > 0.5 ? "full" : "B" };
};

/** Joins between takes (scripts/morph_cuts.py targets) and how different the two sides look. A morph between two
 *  very different poses double-exposes the face for a few frames, which reads as an AI artefact, so those joins are
 *  played as clean hard cuts (the morphed frames are skipped: the outgoing frame holds, then the incoming one) and
 *  the camera steps between two zoom levels on each such cut, the way a jump cut is edited. Near-identical joins keep
 *  their morph. */
const JOINS: [number, number][] = [
  [213, 7.2], [223, 19.9], [429, 24.3], [456, 11.4], [556, 13.5], [620, 29.3], [836, 47.5], [938, 22.3],
  [1056, 31.5], [1129, 7.3], [1214, 12.2], [1248, 7.9], [1422, 9.0], [1447, 3.4], [1522, 2.0], [1742, 10.4], [1817, 24.4],
  [1871, 2.6], [1914, 8.1], [2006, 3.3],
];
const HARD = JOINS.filter(([, j]) => j > 4).map(([k]) => k);
/** The "Ta-da!" line was dropped after the matte and voice (scripts/drop_span.py ms-cut 429 456); its old morph into
 *  "Their best trick?" now starts right at that cut. */
const DROPPED = [429];
/** The source frame to show: inside a hard join's morph window, hold the clean frames either side. */
const srcFrame = (f: number) => {
  for (const k of HARD) {
    // at the dropped line the frames before the cut were never morphed; the first three after it still are
    if (f >= k - 3 && f < k && !DROPPED.includes(k)) return k - 4;
    if (f >= k && f <= k + 2) return k + 3;
  }
  return f;
};
/** Jump-cut zoom: each hard join flips between the wide and a 5% tighter frame (reset on the take-9 cut). */
const jumpZoom = (f: number) => {
  let n = 0;
  for (const k of HARD) if (f >= k && k > (f >= CUT9 ? CUT9 : 0)) n++;
  return n % 2 ? 0.05 : 0;
};

/** Installed effects (reel/src/effects), one each, where they fit the line:
 *  Glass type: "Here's the problem." (frosted words over his chest as the humour drops);
 *  The installed Orbit effect re-frames tighter than this closer last take allows (it crops his head), so the setup
 *  line gets a ring of the same glass chips drawn in the normal framing instead. */
const GLASS = { from: T.heres - 4, to: T.disappearing - 2 };
const ORBIT = { from: TC[1] + 2, to: T.check - 2 };
/** "Here's the problem": the humour drops; a slow push-in, the colour cools and the room dims. */
const SERIOUS = [T.heres - 4, T.month + 10] as const;

/** Punch-in zooms on the strong words (hook-reference): instant in, hold, ease back; about his face. */
const PUNCH: [number, number][] = [
  [T.shouldnt, 0.1],
  [T.magician, 0.06],
  [T.disappear, 0.08],
  [T.poof, 0.08],
  [T.trick, 0.06],
  [T.math, 0.08],
  [T.retire, 0.06],
];
const punchAt = (frame: number) =>
  PUNCH.reduce((z, [a, amt]) => {
    if (frame < a - 1 || frame > a + 26) return z;
    const k = frame < a + 3 ? ramp(frame, a - 1, a + 3, easeOut) : 1 - ramp(frame, a + 12, a + 26, easeIO);
    return Math.max(z, amt * k);
  }, 0);
const framingFor = (l: Lay, frame: number): Framing => {
  const push = frame >= SERIOUS[0] && frame < TA[1] ? 0.09 * ramp(frame, SERIOUS[0], SERIOUS[0] + 70, easeIO) * (1 - ramp(frame, TA[0] - 6, TA[1])) : 0;
  const z = (l.mode === "full" ? Math.max(punchAt(frame), push) : 0) + jumpZoom(frame);
  const s = 1.5 * (1 + z);
  const f = faceAt(TL, frame / FPS);
  const fx = f.x + f.w / 2;
  const fy = f.y + f.h / 2;
  return { scale: s, x: fx * (1.5 - s), y: l.y + fy * (1.5 - s) };
};

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
const handOut = (frame: number, p: Pick, key: "palm" | "index" = "palm", smooth = 2): [number, number] => {
  const [x, y] = handSrc(frame, p, key, smooth);
  return [x * 1.5, y * 1.5];
};

// ---------------------------------------------------------------------------------------------------
// Captions: professional, sentence case, built word by word on her chest; one key phrase per line gets a marker.

const KEY = new Set(["magician", "disappear", "poof", "voicemail", "scheduled", "nobody", "thousands", "month", "analytics", "leak", "dropped", "ghost", "fixable", "cold", "reassign", "click", "math", "system", "year", "signed", "gp", "patients", "five", "minutes", "toothreferral", "retire"]);
type Tok = { t: string; at: number; end: number; key: boolean };
const TOKS: Tok[] = (() => {
  const out: Tok[] = [];
  for (const w of WORDS) {
    const t = w.word.trim();
    const prev = out[out.length - 1];
    if (prev && t.startsWith("-")) {
      prev.t += t;
      prev.end = Math.round(w.end * FPS);
      continue;
    }
    if (prev && prev.t.toLowerCase() === "tooth" && /^referral/i.test(t)) {
      prev.t = "ToothReferral" + t.slice(8);
      prev.end = Math.round(w.end * FPS);
      continue;
    }
    out.push({ t, at: Math.round(w.start * FPS), end: Math.round(w.end * FPS), key: false });
  }
  for (const o of out) o.key = KEY.has(norm(o.t));
  return out;
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
    if (cur.length && (cur.length >= 4 || len + tk.t.length > 22)) flush();
    cur.push(tk);
    if (/[.,?!:]$/.test(tk.t)) flush();
  }
  flush();
  for (let i = 0; i < chunks.length - 1; i++) chunks[i].to = Math.min(chunks[i].to, chunks[i + 1].from);
  return chunks;
})();

const Captions: React.FC<{ lay: Lay }> = ({ lay }) => {
  const frame = useCurrentFrame();
  if (frame < HOOK_END || (frame >= GLASS.from + 4 && frame < GLASS.to - 2) || (frame >= T.tens - 4 && frame < TA[0])) return null;
  const c = CHUNKS.find((x) => frame >= x.from && frame < x.to);
  if (!c) return null;
  const out = interpolate(frame, [c.to - 4, c.to], [0, 1], clamp);
  const top = lay.top > 0.5 ? lerp(1450, 1690, lay.top / 840) : lerp(1450, 800, (1920 - lay.bottom) / 840);
  return (
    <div style={{ position: "absolute", left: 50, right: 50, top, textAlign: "center", fontFamily: FONT_UI, fontWeight: 800, letterSpacing: "-0.025em", lineHeight: 1.12, fontSize: 64, color: W, textShadow: SOFT, opacity: 1 - out, filter: out > 0 ? `blur(${out * 6}px)` : undefined }}>
      {c.words.map((w, i) => {
        const k = interpolate(frame, [w.at - 2, w.at + 3], [0, 1], clamp);
        const hot = w.key && frame >= w.at;
        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              marginRight: i < c.words.length - 1 ? (hot ? "0.14em" : "0.22em") : 0,
              marginLeft: hot ? "-0.08em" : 0,
              opacity: k,
              translate: `0px ${(1 - k) * 10}px`,
              filter: k < 1 ? `blur(${(1 - k) * 5}px)` : undefined,
              padding: hot ? "0 0.14em" : undefined,
              borderRadius: 12,
              background: hot ? YELLOW : undefined,
              color: hot ? INK : W,
              textShadow: hot ? "none" : SOFT,
              boxShadow: hot ? "0 8px 24px rgba(10,6,24,0.35)" : undefined,
            }}
          >
            {w.t}
          </span>
        );
      })}
    </div>
  );
};
// ---------------------------------------------------------------------------------------------------
// The dashboard panel (shown like a screen recording: cursor, clicks, auto-zoom)

const PW = 1032;
const PH = PANEL - 48;
type Img2 = { src: string; w: number; h: number };
const NEW = (n: string): Img2 => ({ src: `dash2/${n}.jpg`, w: 1904, h: 868 });
type Crop = { x: number; y: number; w: number };
type Map = (x: number, y: number) => readonly [number, number];
const mapper = (c: Crop): Map => {
  const s = PW / c.w;
  return (x: number, y: number) => [(x - c.x) * s, (y - c.y) * s] as const;
};
const lerpCrop = (a: Crop, b: Crop, k: number): Crop => ({ x: lerp(a.x, b.x, k), y: lerp(a.y, b.y, k), w: lerp(a.w, b.w, k) });
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

const Shot: React.FC<{ img: Img2; from: number; to: number; keys: CK[]; dim?: number; children?: (m: Map, s: number) => React.ReactNode }> = ({ img, from, to, keys, dim = 0, children }) => {
  const frame = useCurrentFrame();
  if (frame < from - 1 || frame > to + 9) return null;
  const c = camAt(frame, keys);
  const s = PW / c.w;
  const inn = ramp(frame, from, from + 9, easeOut);
  const m = mapper(c);
  return (
    <AbsoluteFill style={{ opacity: inn, filter: inn < 1 ? `blur(${(1 - inn) * 10}px)` : undefined, background: TR.bg }}>
      <Img src={staticFile(img.src)} style={{ position: "absolute", left: -c.x * s, top: -c.y * s, width: img.w * s, height: img.h * s, maxWidth: "none" }} />
      {dim > 0 && <AbsoluteFill style={{ background: `rgba(20,14,40,${dim})` }} />}
      {children?.(m, s)}
    </AbsoluteFill>
  );
};

const Hl: React.FC<{ box: number[]; m: Map; k: number; color?: string; label?: string; labelSide?: "top" | "bottom"; fill?: boolean; dx?: number }> = ({ box, m, k, color = TR.purple, label, labelSide = "top", fill = true, dx = -4 }) => {
  if (k <= 0) return null;
  const [x0, y0] = m(box[0], box[1]);
  const [x1, y1] = m(box[2], box[3]);
  const pad = 6;
  return (
    <div style={{ position: "absolute", left: x0 - pad, top: y0 - pad, width: x1 - x0 + 2 * pad, height: y1 - y0 + 2 * pad, borderRadius: 14, border: `4px solid ${color}`, background: fill ? `${color}1F` : undefined, opacity: Math.min(1, k * 1.6), scale: String(interpolate(k, [0, 1], [1.08, 1])), boxShadow: `0 0 0 6px ${color}22` }}>
      {label && (
        <div style={{ position: "absolute", left: dx, [labelSide === "top" ? "bottom" : "top"]: "calc(100% + 8px)", padding: "6px 14px", borderRadius: 999, background: color, color: color === YELLOW ? INK : W, fontFamily: FONT_UI, fontWeight: 800, fontSize: 26, whiteSpace: "nowrap", letterSpacing: "-0.01em" }}>{label}</div>
      )}
    </div>
  );
};

const Press: React.FC<{ box: number[]; at: number; m: Map; color?: string }> = ({ box, at, m, color = TR.purple }) => {
  const frame = useCurrentFrame();
  if (frame < at - 1 || frame > at + 16) return null;
  const [x0, y0] = m(box[0], box[1]);
  const [x1, y1] = m(box[2], box[3]);
  const k = ramp(frame, at, at + 16, easeOut);
  const dip = Math.sin(Math.min(1, (frame - at) / 7) * Math.PI);
  return <div style={{ position: "absolute", left: x0, top: y0, width: x1 - x0, height: y1 - y0, borderRadius: 12, background: color, opacity: 0.35 * (1 - k) + 0.05, scale: String(1 - 0.06 * dip), boxShadow: `0 0 ${30 * (1 - k)}px ${color}` }} />;
};

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

/** A chip pinned to a panel point (source px of the still). */
const Tag: React.FC<{ x: number; y: number; m: Map; k: number; text: string; color?: string; icon?: string; anchor?: "left" | "right" | "center" }> = ({ x, y, m, k, text, color = GREEN, icon = ICON.check, anchor = "left" }) => {
  if (k <= 0) return null;
  const [px, py] = m(x, y);
  const tx = anchor === "left" ? "0%" : anchor === "right" ? "-100%" : "-50%";
  return (
    <div style={{ position: "absolute", left: px, top: py, translate: `${tx} -50%`, scale: String(k), transformOrigin: anchor === "right" ? "100% 50%" : anchor === "center" ? "50% 50%" : "0% 50%", display: "flex", alignItems: "center", gap: 10, padding: "12px 22px 12px 14px", borderRadius: 999, background: color, color: color === YELLOW ? INK : W, fontFamily: FONT_UI, fontWeight: 800, fontSize: 30, whiteSpace: "nowrap", boxShadow: "0 14px 30px rgba(0,0,0,0.28)" }}>
      <div style={{ width: 36, height: 36, borderRadius: 18, background: "rgba(255,255,255,0.25)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Icon d={icon} size={22} color={color === YELLOW ? INK : W} />
      </div>
      {text}
    </div>
  );
};

// ---------------------------------------------------------------------------------------------------
// Icons

const I = {
  phone: "M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z",
  voicemail: "M5.5 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM18.5 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM5.5 15.5h13",
  user: "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z",
  building: "M3 21h18M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16M9 7h2M13 7h2M9 11h2M13 11h2M9 15h2M13 15h2",
  drop: "M12 2.7s-6 6.8-6 11.3a6 6 0 0 0 12 0c0-4.5-6-11.3-6-11.3z",
  key: "M21 2l-2 2m-7.6 7.6a5.5 5.5 0 1 1-7.8 7.8 5.5 5.5 0 0 1 7.8-7.8zm0 0L15.5 7.5m0 0 3 3L22 7l-3-3m-3.5 3.5L19 4",
  link: "M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71",
  sync: "M21 12a9 9 0 0 0-15-6.7L3 8M3 3v5h5M3 12a9 9 0 0 0 15 6.7l3-2.7M21 21v-5h-5",
  x: "M18 6 6 18M6 6l12 12",
  clock: "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM12 6v6l4 2",
  form: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6M8 13h8M8 17h5",
};

// ---------------------------------------------------------------------------------------------------
// Small pieces

const Pill: React.FC<{ icon: string; title: React.ReactNode; sub?: React.ReactNode; color?: string; style?: React.CSSProperties }> = ({ icon, title, sub, color = YELLOW, style }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 26px 14px 14px", borderRadius: 999, background: "rgba(16,12,30,0.9)", border: "1.5px solid rgba(255,255,255,0.16)", boxShadow: "0 14px 34px rgba(10,6,24,0.4)", whiteSpace: "nowrap", fontFamily: FONT_UI, color: W, ...style }}>
    <div style={{ width: 54, height: 54, borderRadius: 27, background: color, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
      <Icon d={icon} size={30} color={INK} />
    </div>
    <div>
      <div style={{ fontSize: 34, fontWeight: 800, letterSpacing: "-0.02em" }}>{title}</div>
      {sub && <div style={{ fontSize: 22, fontWeight: 600, color: "rgba(255,255,255,0.7)" }}>{sub}</div>}
    </div>
  </div>
);

/** A small referral card (patient + referring office), like a row of the Incoming list. */
const RefCard: React.FC<{ style?: React.CSSProperties; status?: React.ReactNode }> = ({ style, status }) => (
  <div style={{ ...CARD, width: 560, padding: "16px 20px", borderRadius: 20, display: "flex", alignItems: "center", gap: 14, ...style }}>
    <div style={{ width: 54, height: 54, borderRadius: 27, background: "#E7E1FB", color: TR.purple, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 22 }}>BS</div>
    <div style={{ flex: 1, whiteSpace: "nowrap" }}>
      <div style={{ fontSize: 28, fontWeight: 800, letterSpacing: "-0.02em" }}>Bob Smith</div>
      <div style={{ fontSize: 20, color: "#6B7085", fontWeight: 600, display: "flex", alignItems: "center", gap: 6 }}>
        <span style={{ width: 10, height: 10, borderRadius: 5, background: "#22C55E", display: "inline-block" }} /> Gentle Family Smiles
      </div>
    </div>
    {status}
  </div>
);
const StatusChip: React.FC<{ text: string; bg: string; fg: string }> = ({ text, bg, fg }) => (
  <div style={{ padding: "8px 14px", borderRadius: 999, background: bg, color: fg, fontSize: 20, fontWeight: 800, whiteSpace: "nowrap" }}>{text}</div>
);

/** Smoke puff: soft discs that bloom and fade from a point. */
const Puff: React.FC<{ x: number; y: number; at: number; n?: number; r?: number }> = ({ x, y, at, n = 14, r = 160 }) => {
  const frame = useCurrentFrame();
  const k = ramp(frame, at, at + 26, easeOut);
  if (frame < at || k >= 1) return null;
  return (
    <>
      {Array.from({ length: n }).map((_, i) => {
        const a = (i / n) * Math.PI * 2 + i * 0.7;
        const d = r * (0.35 + ((i * 37) % 10) / 14) * k;
        const s = 50 + ((i * 53) % 40);
        return <div key={i} style={{ position: "absolute", left: x + Math.cos(a) * d - s / 2, top: y + Math.sin(a) * d * 0.8 - s / 2, width: s, height: s, borderRadius: s / 2, background: "rgba(255,255,255,0.85)", filter: `blur(${6 + 10 * k}px)`, opacity: (1 - k) * 0.9, scale: String(0.5 + k) }} />;
      })}
      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
        const a = (i / 8) * Math.PI * 2;
        const d = 40 + 170 * k;
        return <div key={`s${i}`} style={{ position: "absolute", left: x + Math.cos(a) * d - 7, top: y + Math.sin(a) * d - 7, width: 14, height: 14, rotate: "45deg", background: YELLOW, opacity: 1 - k, boxShadow: `0 0 12px ${YELLOW}` }} />;
      })}
    </>
  );
};

/** Stage spotlight: the room dims around him (only in the full layout). */
const Spotlight: React.FC = () => {
  const frame = useCurrentFrame();
  const a = ramp(frame, T.magician - 8, T.magician + 6) * (1 - ramp(frame, T.they - 2, T.they + 8));
  const v = a * 0.55;
  if (v <= 0) return null;
  return <AbsoluteFill style={{ background: "radial-gradient(ellipse 46% 40% at 50% 34%, transparent 55%, rgba(8,5,20,0.95) 100%)", opacity: v }} />;
};

// ---------------------------------------------------------------------------------------------------
// 1  the hook

const RedFlash: React.FC = () => {
  const frame = useCurrentFrame();
  const flash = (a: number, peak: number) => (frame >= a && frame < a + 8 ? peak * (1 - (frame - a) / 8) : 0);
  const v = Math.max(flash(0, 0.55), flash(T.shouldnt, 0.75));
  if (v <= 0) return null;
  return <AbsoluteFill style={{ background: RED, opacity: v, mixBlendMode: "screen" }} />;
};

const HOOK_END = T.but - 2;
const HookText: React.FC = () => {
  const frame = useCurrentFrame();
  if (frame > HOOK_END) return null;
  const out = ramp(frame, HOOK_END - 8, HOOK_END);
  const lines: { w: string; at: number; red?: boolean }[][] = [
    [
      { w: "I", at: T.shouldnt - 3 },
      { w: "SHOULDN'T", at: T.shouldnt, red: true },
    ],
    [
      { w: "BE SAYING", at: T.shouldnt + 7 },
      { w: "THIS", at: T.shouldnt + 14, red: true },
    ],
  ];
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: 1300, textAlign: "center", opacity: 1 - out, filter: out > 0 ? `blur(${out * 10}px)` : undefined }}>
      {lines.map((l, i) => (
        <div key={i} style={{ ...TYPE, fontSize: i === 0 ? 150 : 112, letterSpacing: "-0.03em", lineHeight: 0.95 }}>
          {l.map((x, j) => {
            const k = interpolate(frame, [x.at - 1, x.at + 4], [0, 1], clamp);
            return (
              <span key={j} style={{ display: "inline-block", marginRight: j < l.length - 1 ? "0.2em" : 0, color: x.red ? RED : W, textShadow: x.red ? "0 0 40px rgba(255,77,90,0.65), 0 6px 24px rgba(10,6,24,0.5)" : SOFT, opacity: k, scale: String(interpolate(k, [0, 1], [1.3, 1])), filter: k < 1 ? `blur(${(1 - k) * 8}px)` : undefined }}>
                {x.w}
              </span>
            );
          })}
        </div>
      ))}
    </div>
  );
};

/** "...our front desk is the best magician in town": a marquee billboard above his head. */
const Marquee: React.FC = () => {
  const frame = useCurrentFrame();
  const { p, out, on } = win(frame, T.front - 2, T.they + 2, 8);
  if (!on) return null;
  const bulbs = 18;
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: 150, display: "flex", justifyContent: "center", opacity: 1 - out, filter: out > 0 ? `blur(${out * 8}px)` : undefined }}>
      <div style={{ position: "relative", scale: String(interpolate(p, [0, 1], [0.6, 1])), opacity: Math.min(1, p * 2), padding: "26px 44px", borderRadius: 26, background: "linear-gradient(180deg,#2A1650,#170C30)", border: `4px solid ${YELLOW}`, boxShadow: `0 0 40px rgba(243,221,114,0.35), 0 20px 50px rgba(10,6,24,0.5)`, textAlign: "center", fontFamily: FONT_UI }}>
        {Array.from({ length: bulbs }).map((_, i) => {
          const t = i / bulbs;
          const per = 2 * (580 + 190);
          let d = t * per;
          let x = 0;
          let y = 0;
          if (d < 580) [x, y] = [d, 0];
          else if ((d -= 580) < 190) [x, y] = [580, d];
          else if ((d -= 190) < 580) [x, y] = [580 - d, 190];
          else [x, y] = [0, 190 - (d - 580)];
          const lit = (Math.floor(frame / 4) + i) % 3 === 0;
          return <div key={i} style={{ position: "absolute", left: x - 6 + 4, top: y - 6 + 2, width: 12, height: 12, borderRadius: 6, background: lit ? YELLOW : "rgba(243,221,114,0.3)", boxShadow: lit ? `0 0 12px ${YELLOW}` : undefined }} />;
        })}
        <div style={{ fontSize: 24, fontWeight: 800, letterSpacing: "0.18em", color: YELLOW }}>TONIGHT ONLY</div>
        <div style={{ ...TYPE, fontSize: 58, color: W, marginTop: 6, letterSpacing: "-0.02em" }}>The Great Front Desk</div>
        <div style={{ fontSize: 24, fontWeight: 700, color: "rgba(255,255,255,0.72)", marginTop: 8 }}>best magician in town</div>
      </div>
    </div>
  );
};

/** "They make referrals disappear": a referral card above his head goes up in smoke. */
const Vanish: React.FC = () => {
  const frame = useCurrentFrame();
  const from = T.they - 2;
  if (frame < from || frame > T.watch) return null;
  const k = sp(frame, from, 13, 200);
  const gone = ramp(frame, T.disappear + 2, T.disappear + 10, easeOut);
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 260, top: 250, scale: String(interpolate(k, [0, 1], [0.7, 1]) * (1 - gone * 0.4)), opacity: Math.min(1, k * 2) * (1 - gone), filter: gone > 0 ? `blur(${gone * 14}px)` : undefined }}>
        <RefCard status={<StatusChip text="New" bg={TR.purpleSoft} fg={TR.purple} />} />
      </div>
      <Puff x={540} y={295} at={T.disappear + 2} />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------------------------------
// 2  the trick: GP sends a patient, one voicemail, poof

const Trick: React.FC = () => {
  const frame = useCurrentFrame();
  const from = T.gp1 - 6;
  const end = T.their - 10;
  if (frame < from || frame > end + 10) return null;
  const out = ramp(frame, end, end + 10);
  const slide = ramp(frame, from, from + 14, easeOut);
  const vm = sp(frame, T.voicemail - 4, 12, 220);
  const gone = ramp(frame, T.poof + 2, T.poof + 10, easeOut);
  const zero = sp(frame, T.nobody2 - 2, 12, 220);
  return (
    <AbsoluteFill style={{ opacity: 1 - out }}>
      <div style={{ position: "absolute", left: lerp(-600, 260, slide), top: 230, opacity: 1 - gone, scale: String(1 - gone * 0.4), filter: gone > 0 ? `blur(${gone * 14}px)` : undefined }}>
        <RefCard status={vm > 0.5 ? <StatusChip text="Left a Voice Message" bg={TR.amberSoft} fg="#B7791F" /> : <StatusChip text="New" bg={TR.purpleSoft} fg={TR.purple} />} />
        {slide > 0 && slide < 1 && <div style={{ position: "absolute", right: "100%", top: 30, width: 200 * (1 - slide), height: 6, background: `linear-gradient(90deg, transparent, ${YELLOW})`, borderRadius: 3 }} />}
      </div>
      <Puff x={540} y={275} at={T.poof + 2} />
      {zero > 0 && (
        <div style={{ position: "absolute", left: 0, right: 0, top: 250, display: "flex", justifyContent: "center" }}>
          <div style={{ scale: String(zero) }}>
            <Pill icon={I.phone} title="0 callbacks" sub="the patient just… vanished" color="#FF9AA2" />
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------------------------------
// 3  the best trick: "Scheduled" with nothing behind it

const Scheduled: React.FC = () => {
  const frame = useCurrentFrame();
  const from = T.their - 4;
  const end = T.heres - 8;
  if (frame < from || frame > end + 10) return null;
  const out = ramp(frame, end, end + 10);
  const chip = sp(frame, from, 12, 220);
  const card = sp(frame, T.marking - 4, 12, 200);
  const empty = sp(frame, T.nobody3 - 2, 12, 220);
  const hide = ramp(frame, T.audience, T.audience + 14, easeIO);
  return (
    <AbsoluteFill style={{ opacity: 1 - out, filter: out > 0 ? `blur(${out * 8}px)` : undefined }}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 90, display: "flex", justifyContent: "center" }}>
        <div style={{ scale: String(chip), padding: "10px 24px", borderRadius: 999, background: YELLOW, color: INK, ...TYPE, fontSize: 34, letterSpacing: "0.04em" }}>THE BEST TRICK</div>
      </div>
      {card > 0 && (
        <div style={{ position: "absolute", left: 260, top: 160, scale: String(interpolate(card, [0, 1], [0.7, 1])), opacity: Math.min(1, card * 2) }}>
          <RefCard status={<StatusChip text="Scheduled" bg={TR.greenSoft} fg="#137A4B" />} />
          {empty > 0 && (
            <div style={{ marginTop: 14, ...CARD, borderRadius: 18, padding: "14px 18px", display: "flex", alignItems: "center", gap: 12, scale: String(empty), transformOrigin: "50% 0%" }}>
              <Icon d={ICON.calendar} size={32} color={TR.red} />
              <div style={{ fontSize: 26, fontWeight: 800 }}>
                Appointment: <span style={{ color: TR.red }}>none booked</span>
              </div>
            </div>
          )}
          {/* the audience never sees it: the cards fog over */}
          {hide > 0 && <div style={{ position: "absolute", inset: -20, borderRadius: 26, backdropFilter: `blur(${hide * 14}px)`, background: `rgba(240,240,248,${hide * 0.55})` }} />}
          {hide > 0.6 && (
            <div style={{ position: "absolute", left: 0, right: 0, top: "40%", display: "flex", justifyContent: "center", scale: String(sp(frame, T.audience + 10, 12, 220)) }}>
              <div style={{ padding: "10px 22px", borderRadius: 999, background: INK, color: W, fontFamily: FONT_UI, fontWeight: 800, fontSize: 28 }}>nobody can tell</div>
            </div>
          )}
        </div>
      )}
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------------------------------
// 4  the cost (serious)

/** The loss ticking down like a counter, from $0 to -$10,000+ ("tens of thousands"), digits rolling, a red pulse
 *  on each thousand. Only the brief's own figure is shown (the floor of "tens of thousands"), never a made-up total. */
const Countdown: React.FC<{ a: number }> = ({ a }) => {
  const frame = useCurrentFrame();
  const t = ramp(frame, T.tens - 2, T.thousands + 18, (x) => 1 - Math.pow(1 - x, 2.2));
  const v = Math.round(t * 10000);
  const done = t >= 1;
  const txt = "-$" + v.toLocaleString("en-US") + (done ? "+" : "");
  const pulse = (v % 1000) / 1000;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, opacity: Math.min(1, a * 2), scale: String(interpolate(a, [0, 1], [1.2, 1])) }}>
      <div style={{ ...TYPE, fontSize: 132, color: RED, letterSpacing: "-0.03em", fontVariantNumeric: "tabular-nums", textShadow: `0 0 ${30 + 20 * (1 - pulse)}px rgba(255,77,90,0.55), 0 6px 24px rgba(10,6,24,0.5)` }}>{txt}</div>
      <div style={{ fontFamily: FONT_UI, fontWeight: 800, fontSize: 30, letterSpacing: "0.14em", color: "rgba(255,255,255,0.85)", textShadow: SOFT }}>{done ? "TENS OF THOUSANDS" : "AND COUNTING"}</div>
    </div>
  );
};

const Cost: React.FC = () => {
  const frame = useCurrentFrame();
  const from = T.disappearing - 4;
  const end = TA[0] + 2;
  if (frame < from || frame > end + 10) return null;
  const out = ramp(frame, end, end + 10);
  const a = sp(frame, T.tens - 4, 12, 200);
  const b = sp(frame, T.month - 6, 12, 220);
  const drain = ramp(frame, T.tens, T.month + 10, (t) => t);
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: 110, display: "flex", flexDirection: "column", alignItems: "center", gap: 14, opacity: 1 - out, filter: out > 0 ? `blur(${out * 8}px)` : undefined }}>
      <div style={{ scale: String(sp(frame, from, 12, 220)), padding: "8px 20px", borderRadius: 999, background: "rgba(16,12,30,0.88)", color: W, fontFamily: FONT_UI, fontWeight: 800, fontSize: 26, letterSpacing: "0.06em" }}>EVERY DISAPPEARING ACT COSTS</div>
      {a > 0 && (
        <Countdown a={a} />
      )}
      {a > 0 && (
        <div style={{ width: 560, height: 18, borderRadius: 9, background: "rgba(255,255,255,0.18)", overflow: "hidden" }}>
          <div style={{ width: `${(1 - drain * 0.8) * 100}%`, height: "100%", background: `linear-gradient(90deg, ${RED}, #FF9AA2)`, borderRadius: 9 }} />
        </div>
      )}
      {b > 0 && <div style={{ scale: String(b), ...TYPE, fontSize: 46, color: W, textShadow: SOFT }}>in lost production, every month</div>}
    </div>
  );
};

const Serious: React.FC = () => {
  const frame = useCurrentFrame();
  const v = ramp(frame, SERIOUS[0], SERIOUS[0] + 24) * (1 - ramp(frame, TA[0] - 4, TA[0] + 8));
  if (v <= 0) return null;
  return <AbsoluteFill style={{ background: "radial-gradient(ellipse 55% 45% at 50% 35%, rgba(20,30,70,0.05), rgba(8,10,30,0.7) 100%)", opacity: v, mixBlendMode: "multiply" }} />;
};

// ---------------------------------------------------------------------------------------------------
// 5-7  the analytics panel (split A): the funnel, the ghost rate, needs attention

const Ghost: React.FC<{ size?: number; color?: string }> = ({ size = 90, color = W }) => (
  <svg width={size} height={size * 1.1} viewBox="0 0 100 110">
    <path d="M50 6C27 6 12 24 12 48v54l13-10 12 10 13-10 13 10 12-10 13 10V48C88 24 73 6 50 6z" fill={color} stroke={INK} strokeWidth={5} strokeLinejoin="round" />
    <circle cx={37} cy={46} r={7} fill={INK} />
    <circle cx={63} cy={46} r={7} fill={INK} />
    <ellipse cx={50} cy={66} rx={7} ry={9} fill={INK} />
  </svg>
);

const DashA: React.FC<{ lay: Lay }> = ({ lay }) => {
  const frame = useCurrentFrame();
  if (frame < TA[0] - 2 || frame > TF[1] + 2) return null;
  const S_FUN = TA[0];
  const S_GHOST = T.ghost - 14;
  const S_NEED = T.needs - 10;
  const S_END = TF[1];
  const FUNNEL: Crop = { x: 1320, y: 150, w: 560 };
  const GHOSTC: Crop = { x: 1430, y: 360, w: 460 };
  const ghostWob = Math.sin(frame / 5) * 8;
  const spooky = sp(frame, T.real - 6, 12, 200) * (1 - ramp(frame, T.fixable - 2, T.fixable + 6));
  const fixed = sp(frame, T.fixable - 2, 12, 220);
  return (
    <div style={{ position: "absolute", left: 24, top: lay.dashTop + 24, width: PW, height: PH, borderRadius: 30, overflow: "hidden", background: TR.bg, boxShadow: "0 24px 60px rgba(0,0,0,0.45)", border: "1.5px solid rgba(255,255,255,0.18)" }}>
      {/* the funnel: received, contacted, scheduled, and where patients dropped off */}
      <Shot
        img={NEW("an-03-volume-funnel")}
        from={S_FUN}
        to={S_GHOST}
        keys={[
          [S_FUN, { x: 380, y: 120, w: 1500 }],
          [T.analytics + 4, { x: 380, y: 120, w: 1500 }],
          [T.leak - 2, FUNNEL],
        ]}
      >
        {(m) => (
          <>
            <Hl box={[1393, 325, 1803, 345]} m={m} k={sp(frame, T.received - 2, 12, 220) * (1 - ramp(frame, T.contacted - 2, T.contacted + 4))} label="Received" labelSide="top" dx={0} />
            <Hl box={[1393, 410, 1803, 430]} m={m} k={sp(frame, T.contacted - 2, 12, 220) * (1 - ramp(frame, T.sched3 - 2, T.sched3 + 4))} label="Contacted" labelSide="top" dx={0} />
            <Hl box={[1393, 495, 1803, 520]} m={m} k={sp(frame, T.sched3 - 2, 12, 220) * (1 - ramp(frame, T.dropped - 4, T.dropped + 2))} label="Scheduled" labelSide="top" dx={0} />
            <Hl box={[1393, 377, 1803, 397]} m={m} k={sp(frame, T.dropped - 2, 12, 200)} color={RED} />
            <Hl box={[1393, 463, 1803, 483]} m={m} k={sp(frame, T.dropped + 3, 12, 200)} color={RED} />
            <Mouse path={[[S_FUN + 4, 900, 600], [T.leak, 1600, 390], [T.contacted, 1600, 420], [T.dropped, 1700, 473]]} clicks={[]} m={m} show={[S_FUN + 6, S_GHOST]} />
            <Tag x={1860} y={620} m={m} k={sp(frame, T.dropped + 6, 12, 200)} text="where patients dropped off" color={RED} icon={ICON.alert} anchor="right" />
          </>
        )}
      </Shot>
      {/* the ghost rate */}
      <Shot
        img={NEW("an-00-kpis-ghost-rate")}
        from={S_GHOST}
        to={S_NEED}
        keys={[
          [S_GHOST, { x: 380, y: 200, w: 1480 }],
          [T.ghost + 4, GHOSTC],
        ]}
      >
        {(m, sc) => (
          <>
            <GhostValue m={m} s={sc} />
            <Hl box={[1492, 405, 1828, 624]} m={m} k={sp(frame, T.ghost, 12, 200)} color={fixed > 0.5 ? GREEN : TR.purple} fill={false} />
            {spooky > 0 && (
              <div style={{ position: "absolute", left: m(1700, 0)[0] - 10, top: m(0, 470)[1] + ghostWob, scale: String(spooky), opacity: 0.95, filter: "drop-shadow(0 10px 20px rgba(0,0,0,0.25))" }}>
                <Ghost size={150} />
              </div>
            )}
            <Tag x={1660} y={700} m={m} k={fixed} text="very fixable" anchor="center" />
          </>
        )}
      </Shot>
      {/* needs attention: cold cases, re-assign in one click */}
      <Shot
        img={NEW("an-07-outcomes-sources")}
        from={S_NEED}
        to={S_END}
        keys={[
          [S_NEED, { x: 380, y: 300, w: 1000 }],
          [T.anyone, { x: 380, y: 300, w: 1000 }],
          [T.reassign, { x: 760, y: 400, w: 520 }],
        ]}
      >
        {(m) => (
          <>
            <Hl box={[300, 340, 1210, 570]} m={m} k={sp(frame, T.needs - 2, 12, 200) * (1 - ramp(frame, T.cold - 4, T.cold + 2))} color={YELLOW} fill={false} label="Needs attention" labelSide="top" dx={0} />
            <Hl box={[405, 476, 1200, 515]} m={m} k={sp(frame, T.cold - 2, 12, 200)} color="#E89D15" label="cold case: 3+ attempts, no reply" labelSide="top" dx={0} />
            <Press box={[1090, 482, 1195, 512]} at={T.click - 2} m={m} />
            <Mouse path={[[S_NEED + 4, 800, 640], [T.reassign, 1140, 497]]} clicks={[T.click - 2]} m={m} show={[S_NEED + 4, S_END]} />
            <Tag x={1190} y={570} m={m} k={sp(frame, T.click + 4, 12, 220)} text="re-assigned to Katie" anchor="right" />
          </>
        )}
      </Shot>
    </div>
  );
};

/** The Ghost rate card shows the industry figure instead of the empty demo account's 0%: it counts up to 46% on
 *  "ghost rate", the share of referrals to dental specialists that go unfulfilled in a national survey (Kelton
 *  Research, 2008), with a source note on the card and a footnote on the end card. */
const GHOST_PCT = 46;
const GhostValue: React.FC<{ m: Map; s: number }> = ({ m, s }) => {
  const frame = useCurrentFrame();
  const t = ramp(frame, T.ghost - 4, T.ghost + 26, (x) => 1 - Math.pow(1 - x, 3));
  const v = Math.round(t * GHOST_PCT);
  const [x0, y0] = m(1510, 452);
  const [x1, y1] = m(1700, 514);
  const note = sp(frame, T.real - 2, 12, 220) * (1 - ramp(frame, T.fixable - 4, T.fixable + 4));
  const [nx, ny] = m(1660, 560);
  return (
    <>
      <div style={{ position: "absolute", left: x0, top: y0, width: x1 - x0, height: y1 - y0, background: "#FFFFFF", display: "flex", alignItems: "baseline", gap: 10 * s, paddingLeft: 7 * s, fontFamily: FONT_UI, color: "#15132B" }}>
        <span style={{ fontSize: 50 * s, fontWeight: 700, letterSpacing: "-0.02em", lineHeight: 1, fontVariantNumeric: "tabular-nums", color: t > 0.98 ? TR.red : "#15132B" }}>{v}</span>
        <span style={{ fontSize: 22 * s, fontWeight: 600, color: "#6B7085" }}>%</span>
      </div>
      {note > 0 && (
        <div style={{ position: "absolute", left: nx, top: ny, translate: "-50% 0", scale: String(note), padding: "8px 14px", borderRadius: 12, background: INK, color: W, fontFamily: FONT_UI, fontWeight: 700, fontSize: 20, whiteSpace: "nowrap", textAlign: "center", lineHeight: 1.3 }}>
          46% of specialist referrals
          <br />
          go unfulfilled (industry)*
        </div>
      )}
    </>
  );
};

/** "anyone on the team": the team, on his side of the split. */
const Team: React.FC<{ lay: Lay }> = ({ lay }) => {
  const frame = useCurrentFrame();
  const { p, out, on } = win(frame, T.anyone - 4, T.click + 2, 8);
  if (!on) return null;
  const people = [
    { i: "BO", t: "Barbara · Office Manager", c: "#7B4CF0" },
    { i: "KD", t: "Katie · Dental Assistant", c: GREEN },
  ];
  return (
    <div style={{ position: "absolute", left: 30, top: lay.top + 40, display: "flex", flexDirection: "column", gap: 12, opacity: 1 - out }}>
      {people.map((x, i) => {
        const k = sp(frame, T.anyone - 4 + i * 5, 12, 220);
        return (
          <div key={x.i} style={{ scale: String(k * p), transformOrigin: "0% 50%", display: "flex", alignItems: "center", gap: 10, padding: "10px 20px 10px 10px", borderRadius: 999, background: W, boxShadow: "0 12px 28px rgba(10,6,24,0.35)", fontFamily: FONT_UI, fontWeight: 800, fontSize: 26, color: INK }}>
            <div style={{ width: 44, height: 44, borderRadius: 22, background: x.c, color: W, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>{x.i}</div>
            {x.t}
          </div>
        );
      })}
    </div>
  );
};

// ---------------------------------------------------------------------------------------------------
// 8  the math (full)

const MathCards: React.FC = () => {
  const frame = useCurrentFrame();
  const from = T.rescued - 4;
  const end = CUT9 - 8;
  if (frame < from || frame > end + 10) return null;
  const out = ramp(frame, end, end + 10);
  const a = sp(frame, from, 12, 220);
  const a2 = sp(frame, T.system - 4, 12, 220);
  const b = sp(frame, T.saved - 4, 12, 220);
  const months = Math.floor(ramp(frame, T.turnover, T.year + 6, (t) => t) * 12);
  const row = (k: number, left: React.ReactNode, right: React.ReactNode) => (
    <div style={{ display: "flex", alignItems: "center", gap: 14, opacity: Math.min(1, k * 2), translate: `${(1 - k) * 40}px 0px` }}>
      <div style={{ ...CARD, borderRadius: 999, padding: "14px 24px", fontSize: 30, fontWeight: 800, whiteSpace: "nowrap" }}>{left}</div>
      <div style={{ ...TYPE, fontSize: 52, color: YELLOW, textShadow: SOFT }}>=</div>
      {right}
    </div>
  );
  return (
    <div style={{ position: "absolute", left: 40, right: 40, top: 150, display: "flex", flexDirection: "column", alignItems: "center", gap: 22, opacity: 1 - out, filter: out > 0 ? `blur(${out * 8}px)` : undefined }}>
      {row(
        a,
        <span>
          <span style={{ color: TR.purple }}>1</span> rescued referral
        </span>,
        a2 > 0 && (
          <div style={{ scale: String(a2), display: "flex", alignItems: "center", gap: 10, padding: "14px 24px 14px 14px", borderRadius: 999, background: GREEN, color: W, fontFamily: FONT_UI, fontWeight: 800, fontSize: 30, whiteSpace: "nowrap" }}>
            <Icon d={ICON.check} size={28} color={W} /> system paid for
          </div>
        ),
      )}
      {b > 0 &&
        row(
          b,
          <span>
            <span style={{ color: TR.purple }}>1</span> saved after turnover
          </span>,
          <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 26px)", gap: 6, padding: 12, borderRadius: 18, background: "rgba(16,12,30,0.88)" }}>
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} style={{ width: 26, height: 26, borderRadius: 6, background: i < months ? GREEN : "rgba(255,255,255,0.15)" }} />
            ))}
          </div>,
        )}
      {months >= 12 && <div style={{ scale: String(sp(frame, T.year + 6, 12, 220)), ...TYPE, fontSize: 40, color: W, textShadow: SOFT }}>a whole year, covered</div>}
    </div>
  );
};

// ---------------------------------------------------------------------------------------------------
// 9  the signed completion note (split B, DocuSign)

const DashB: React.FC<{ lay: Lay }> = ({ lay }) => {
  const frame = useCurrentFrame();
  if (frame < TB[0] - 2 || frame > TC[1] + 2) return null;
  const S_DOC = TB[0];
  const S_SIGN = T.signed - 6;
  const S_SENT = T.straight - 6;
  const S_TOP = T.happy - 8;
  const S_END = TC[1];
  return (
    <div style={{ position: "absolute", left: 24, top: lay.dashTop + 24, width: PW, height: PH, borderRadius: 30, overflow: "hidden", background: TR.bg, boxShadow: "0 24px 60px rgba(0,0,0,0.45)", border: "1.5px solid rgba(255,255,255,0.18)" }}>
      <Shot img={NEW("cs-04b-docusign-letter")} from={S_DOC} to={S_SIGN} keys={[[S_DOC, { x: 0, y: 0, w: 1904 }], [T.treatment, { x: 380, y: 240, w: 1000 }]]}>
        {(m) => <Hl box={[470, 520, 1300, 545]} m={m} k={sp(frame, T.treatment + 4, 12, 200)} label="Thank you for referring…" labelSide="top" dx={0} />}
      </Shot>
      <Shot img={NEW("cs-05-signature-placed")} from={S_SIGN} to={S_SENT} keys={[[S_SIGN, { x: 380, y: 6, w: 1000 }], [T.signed + 10, { x: 420, y: 300, w: 700 }]]}>
        {(m) => (
          <>
            <Hl box={[518, 444, 640, 496]} m={m} k={sp(frame, T.signed, 12, 220)} color={YELLOW} label="signed" labelSide="bottom" dx={0} />
            <Mouse path={[[S_SIGN, 800, 640], [T.signed - 2, 600, 470]]} clicks={[T.signed - 2]} m={m} show={[S_SIGN, S_SENT]} />
          </>
        )}
      </Shot>
      <Shot img={NEW("cs-07-signed-success")} from={S_SENT} to={S_TOP} keys={[[S_SENT, { x: 380, y: 0, w: 1500 }], [T.straight + 8, { x: 1300, y: 20, w: 600 }]]}>
        {(m) => <Hl box={[1440, 50, 1845, 128]} m={m} k={sp(frame, T.straight + 6, 12, 200)} color={GREEN} label="sent to the referring GP" labelSide="bottom" dx={0} />}
      </Shot>
      <Shot img={NEW("an-02-senders-procedures")} from={S_TOP} to={S_END} keys={[[S_TOP, { x: 380, y: 260, w: 900 }]]}>
        {(m) => (
          <>
            <Hl box={[415, 355, 1190, 395]} m={m} k={sp(frame, T.happy, 12, 200)} color={GREEN} label="top sender" labelSide="top" dx={0} />
            <Tag x={1180} y={480} m={m} k={sp(frame, T.patients - 4, 12, 220)} text="+ more patients" anchor="right" />
          </>
        )}
      </Shot>
    </div>
  );
};

// ---------------------------------------------------------------------------------------------------
// 10  setup and the call to action

/** "Setup takes about five minutes": what gets set up rings his head (glass chips on a slow, tilted ellipse). */
const SetupRing: React.FC = () => {
  const frame = useCurrentFrame();
  const { p, out, on } = win(frame, ORBIT.from, ORBIT.to, 8);
  if (!on) return null;
  const f = faceAt(TL, frame / FPS);
  const cx = (f.x + f.w / 2) * 1.5;
  const cy = (f.y + f.h * 0.35) * 1.5;
  const items = [
    { t: "Network", d: ICON.check, at: T.setup + 6 },
    { t: "Analytics", d: ICON.check, at: T.setup + 12 },
    { t: "Lead forms", d: ICON.check, at: T.five - 6 },
    { t: "DocuSign", d: ICON.check, at: T.five + 2 },
  ];
  const slots = [
    [-320, -150],
    [320, -150],
    [-340, 70],
    [340, 70],
  ];
  return (
    <AbsoluteFill style={{ opacity: 1 - out }}>
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, opacity: 0.45 * p }}>
        <ellipse cx={cx} cy={cy - 30} rx={330} ry={150} fill="none" stroke="rgba(255,255,255,0.55)" strokeWidth={3} strokeDasharray="8 10" />
      </svg>
      {items.map((it, i) => {
        const k = sp(frame, it.at, 12, 220);
        if (k <= 0) return null;
        const [dx, dy] = slots[i];
        const bob = Math.sin((frame + i * 17) / 14) * 6;
        const x = Math.max(150, Math.min(930, cx + dx));
        return (
          <div key={it.t} style={{ position: "absolute", left: x, top: cy + dy + bob, translate: "-50% -50%", scale: String(k), display: "flex", alignItems: "center", gap: 10, padding: "10px 20px 10px 10px", borderRadius: 999, background: "rgba(16,12,30,0.8)", border: "1.5px solid rgba(255,255,255,0.25)", backdropFilter: "blur(8px)", boxShadow: "0 12px 30px rgba(10,6,24,0.35)", fontFamily: FONT_UI, fontWeight: 800, fontSize: 28, color: W, whiteSpace: "nowrap" }}>
            <div style={{ width: 38, height: 38, borderRadius: 19, background: YELLOW, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Icon d={it.d} size={22} color={INK} />
            </div>
            {it.t}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

const CtaLogo: React.FC = () => {
  const frame = useCurrentFrame();
  const from = T.check - 4;
  const { p, out, on } = win(frame, from, CUT_FRAMES - 4, 9);
  if (!on) return null;
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: 110, display: "flex", justifyContent: "center", opacity: Math.min(1, p * 1.5) * (1 - out), translate: `0px ${(1 - p) * 60}px`, filter: "drop-shadow(0 4px 18px rgba(8,4,24,0.55))" }}>
      <Sequence from={from} layout="none">
        <LogoReveal at={0} width={440} revealDur={18} shineDur={28} />
      </Sequence>
    </div>
  );
};

const CtaLink: React.FC = () => {
  const frame = useCurrentFrame();
  const from = T.check + 4;
  const { p, out, on } = win(frame, from, CUT_FRAMES - 4, 9);
  if (!on) return null;
  const [hx, hy] = handOut(from, "high", "index", 3);
  const k = ramp(frame, from, from + 14, easeOut);
  return (
    <div style={{ position: "absolute", left: lerp(hx, 540, k), top: lerp(hy, 360, k), translate: "-50% -50%", scale: String(interpolate(p, [0, 1], [0.5, 1])), opacity: Math.min(1, p * 2) * (1 - out), padding: "16px 34px", borderRadius: 999, background: YELLOW, color: INK, ...TYPE, letterSpacing: "-0.025em", fontSize: 44, boxShadow: "0 14px 34px rgba(10,6,24,0.45)", whiteSpace: "nowrap" }}>toothreferral.com</div>
  );
};

/** "...and retire your front desk's magic act for good": the marquee comes back, stamped. */
const Retired: React.FC = () => {
  const frame = useCurrentFrame();
  const from = T.retire - 4;
  const { p, out, on } = win(frame, from, CUT_FRAMES - 2, 8);
  if (!on) return null;
  const stamp = sp(frame, T.magic, 11, 260);
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: 1180, display: "flex", justifyContent: "center", opacity: 1 - out }}>
      <div style={{ position: "relative", scale: String(p), padding: "16px 30px", borderRadius: 20, background: "linear-gradient(180deg,#2A1650,#170C30)", border: `3px solid ${YELLOW}`, fontFamily: FONT_UI, color: W, textAlign: "center" }}>
        <div style={{ fontSize: 20, fontWeight: 800, letterSpacing: "0.16em", color: YELLOW }}>THE GREAT FRONT DESK</div>
        <div style={{ ...TYPE, fontSize: 40, marginTop: 4 }}>magic act</div>
        {stamp > 0 && (
          <div style={{ position: "absolute", left: "50%", top: "50%", translate: "-50% -50%", rotate: "-10deg", padding: "6px 18px", border: `6px solid ${RED}`, borderRadius: 12, color: RED, background: "rgba(255,255,255,0.94)", ...TYPE, fontSize: 52, letterSpacing: "0.02em", scale: String(interpolate(stamp, [0, 1], [2.2, 1])), opacity: Math.min(1, stamp * 2), whiteSpace: "nowrap" }}>RETIRED</div>
        )}
      </div>
    </div>
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
      <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 45%, rgba(27,18,64,0.6), rgba(16,10,40,0.94))`, opacity: card }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 640, display: "flex", justifyContent: "center", opacity: card, scale: String(interpolate(card, [0, 1], [0.9, 1.2])), filter: "drop-shadow(0 4px 18px rgba(8,4,24,0.55))" }}>
        <Sequence from={CUT_FRAMES - 6} layout="none">
          <LogoReveal at={0} width={440} revealDur={18} shineDur={28} />
        </Sequence>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 960, textAlign: "center", opacity: url, translate: `0px ${(1 - url) * 16}px`, ...TYPE, fontSize: 52, color: W, letterSpacing: "-0.03em" }}>toothreferral.com</div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 1030, textAlign: "center", opacity: url, ...TYPE, fontSize: 34, color: "rgba(255,255,255,0.72)", letterSpacing: "-0.02em", fontWeight: 700 }}>one rescued referral pays for it · live in 5 minutes</div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 1860, textAlign: "center", opacity: url * 0.6, fontFamily: FONT_UI, fontSize: 18, color: W }}>*Kelton Research national survey of dental referrals (2008). Dashboard values are illustrative demo data.</div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 1120, display: "flex", justifyContent: "center", opacity: Math.min(1, btn * 1.5), scale: String(interpolate(btn, [0, 1], [0.8, 1])) }}>
        <div style={{ padding: "22px 40px", borderRadius: 22, background: YELLOW, color: INK, ...TYPE, letterSpacing: "-0.03em", fontSize: 40, boxShadow: "0 16px 40px rgba(10,6,24,0.45)" }}>retire the magic act →</div>
      </div>
    </>
  );
};

// ---------------------------------------------------------------------------------------------------
// Sound

const SFX: { f: number; s: string; v: number }[] = [
  { f: 0, s: "impact", v: 0.16 },
  { f: T.shouldnt, s: "impact", v: 0.18 },
  { f: T.shouldnt + 7, s: "pop-1", v: 0.1 },
  { f: T.front - 2, s: "shimmer", v: 0.16 },
  { f: T.they - 2, s: "pop-2", v: 0.1 },
  { f: T.disappear + 2, s: "whoosh-short", v: 0.14 },
  { f: T.disappear + 3, s: "shimmer", v: 0.1 },
  { f: T.gp1 - 6, s: "whoosh-short", v: 0.1 },
  { f: T.voicemail - 4, s: "blip-1", v: 0.12 },
  { f: T.poof + 2, s: "whoosh-short", v: 0.16 },
  { f: T.poof + 3, s: "shimmer", v: 0.12 },
  { f: T.nobody2 - 2, s: "thud", v: 0.12 },
  { f: T.their - 4, s: "pop-1", v: 0.12 },
  { f: T.marking - 4, s: "click", v: 0.12 },
  { f: T.nobody3 - 2, s: "blip-2", v: 0.12 },
  { f: T.audience, s: "whoosh-long", v: 0.08 },
  { f: T.heres - 4, s: "riser", v: 0.1 },
  { f: T.tens - 4, s: "impact", v: 0.14 },
  ...[0, 4, 8, 12, 17, 23, 30, 38].map((d) => ({ f: T.tens + d, s: "tick-2", v: 0.07 })),
  { f: T.month - 6, s: "thud", v: 0.12 },
  { f: TA[0], s: "whoosh-short", v: 0.12 },
  { f: T.received - 2, s: "tick-1", v: 0.1 },
  { f: T.contacted - 2, s: "tick-2", v: 0.1 },
  { f: T.sched3 - 2, s: "tick-3", v: 0.1 },
  { f: T.dropped - 2, s: "thud", v: 0.12 },
  { f: T.ghost - 14, s: "whoosh-short", v: 0.1 },
  { f: T.real - 6, s: "pop-3", v: 0.1 },
  { f: T.fixable - 2, s: "chime", v: 0.12 },
  { f: T.needs - 10, s: "whoosh-short", v: 0.1 },
  { f: T.cold - 2, s: "blip-3", v: 0.1 },
  { f: T.anyone - 4, s: "pop-1", v: 0.1 },
  { f: T.click - 2, s: "click", v: 0.16 },
  { f: TF[0], s: "whoosh-short", v: 0.12 },
  { f: T.math - 1, s: "impact", v: 0.12 },
  { f: T.system - 4, s: "chime", v: 0.12 },
  { f: T.turnover, s: "tick-4", v: 0.08 },
  { f: CUT9, s: "whoosh-long", v: 0.14 },
  { f: T.signed - 2, s: "click", v: 0.14 },
  { f: T.straight + 6, s: "chime", v: 0.12 },
  { f: T.happy, s: "pop-2", v: 0.1 },
  { f: ORBIT.from, s: "whoosh-long", v: 0.12 },
  { f: T.setup + 12, s: "pop-2", v: 0.1 },
  { f: T.five - 6, s: "pop-3", v: 0.1 },
  { f: T.five + 2, s: "chime", v: 0.1 },
  { f: T.check - 4, s: "shimmer", v: 0.14 },
  { f: T.magic, s: "impact", v: 0.14 },
  { f: CUT_FRAMES - 6, s: "whoosh-long", v: 0.16 },
];


// ---------------------------------------------------------------------------------------------------
// The edit

export const MagicShow: React.FC = () => {
  const frame = useCurrentFrame();
  const f0 = Math.min(frame, CUT_FRAMES - 1);
  const lay = layoutAt(f0);
  const fr = framingFor(lay, f0);
  const freeze = frame >= CUT_FRAMES - 1;
  const grade: React.CSSProperties = { filter: "contrast(1.05) saturate(1.04) brightness(1.0)" };
  const speaker = (layer: "full" | "cutout", style?: React.CSSProperties) => {
    const el = <TalentLayer talent={TL} layer={layer} framing={fr} style={{ ...grade, ...style }} />;
    if (freeze) return <Freeze frame={CUT_FRAMES - 2}>{el}</Freeze>;
    const sf = srcFrame(frame);
    return sf !== frame ? <Freeze frame={sf}>{el}</Freeze> : el;
  };
  const full = lay.mode === "full" && lay.top < 1 && lay.bottom > 1919;
  const endBlur = interpolate(frame, [CUT_FRAMES - 6, CUT_FRAMES + 10], [0, 14], clamp);
  const band: React.CSSProperties = { clipPath: `inset(${lay.top}px 0px ${1920 - lay.bottom}px 0px round ${full ? 0 : 30}px)` };
  // a soft white flash rides the take-9 hard cut
  const cutFlash = frame >= CUT9 - 1 && frame < CUT9 + 5 ? 0.35 * (1 - Math.abs(frame - CUT9) / 5) : 0;
  return (
    <AbsoluteFill style={{ background: BG }}>
      <FontGate>
        <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 40%, #2A1B5E, ${BG} 70%)` }} />
        <AbsoluteFill style={{ filter: endBlur > 0 ? `blur(${endBlur}px)` : undefined }}>
          <AbsoluteFill style={band}>
            {speaker("full")}
            <Serious />
            <SetupRing />
            <Spotlight />
            <Sequence from={GLASS.from} durationInFrames={GLASS.to - GLASS.from} premountFor={30} name="glass type">
              <GlassType talent={TL} startAt={GLASS.from / FPS} text={"The\nproblem."} y={1180} tint="#9FB4FF" />
            </Sequence>
            {full && frame >= T.check - 6 && (
              <>
                <CtaLogo />
                {speaker("cutout")}
              </>
            )}
            <AbsoluteFill style={{ background: "linear-gradient(180deg, transparent 62%, rgba(10,6,24,0.42) 100%)" }} />
          </AbsoluteFill>
          <DashA lay={lay} />
          <DashB lay={lay} />
          <Team lay={lay} />
          <HookText />
          <Marquee />
          <Vanish />
          <Trick />
          <Scheduled />
          <Cost />
          <MathCards />
          <CtaLink />
          <Retired />
        </AbsoluteFill>
        {frame < CUT_FRAMES - 4 && <Captions lay={lay} />}
        <RedFlash />
        {cutFlash > 0 && <AbsoluteFill style={{ background: W, opacity: cutFlash }} />}
        <EndCard />
        <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 42%, transparent 55%, rgba(8,5,18,0.34) 100%)", pointerEvents: "none" }} />
      </FontGate>

      <Audio src={staticFile("audio/voice/ms-cut.wav")} volume={(f) => interpolate(f, [CUT_FRAMES - 4, CUT_FRAMES + 4], [1, 0], clamp)} />
      <Audio src={staticFile("audio/music/cb-bed.ogg")} volume={(f) => 0.07 * interpolate(f, [0, 20, MS_DURATION - 45, MS_DURATION - 1], [0, 1, 1, 0], clamp)} />
      {SFX.map((x, i) => (
        <Sequence key={i} from={Math.max(0, x.f)} layout="none">
          <Audio src={staticFile(`audio/sfx/${x.s}.wav`)} volume={x.v} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
