/**
 * "The Leak Is Inside Your Own Office": ToothReferral short (Script 4, female presenter). The referral problem isn't
 * GPs who stop sending, it's the front office: one beat per line, answered on the real dashboard (the Incoming
 * Referrals recording and the newer Analytics / Website Lead Forms recording).
 *
 *   1  hook (full)                 red flash, stacked "NOBODY TELLS YOU THIS", punch-ins on the trigger words
 *   2  the myth (full)             "GPs stopped sending" is struck out
 *   3  the leak (full)             "your front office", then three leaks drop in above her head: Left a Voice
 *                                  Message, a status clicked by accident, a coordinator who quit; they drain away
 *   4  the cost (-> split A)       the real Referral funnel, its "% leak" steps highlighted; tens of thousands a month
 *   5  the fix (split A)           the leaks seal; "not another web form"; one shared network (connected offices)
 *   6  same dashboard (split A)    case, X-ray and message, each a dive into the dashboard; synced to both offices
 *   7  no codes (full)            access codes and portal links struck by her hands; then the Orbit effect: messages,
 *                                  notes, status and the team ring her head ("visible to your whole team")
 *   8  the math (split B -> full)  Needs attention: Re-assign ("anyone can pick up any case"); the Digital zoom effect
 *                                  snaps on "math"; 1 referral that doesn't leak = the system paid for
 *   9  setup (full-screen card)    set up in about five minutes (the spoken "Setup" was re-made in her voice, so the
 *                                  card covers her mouth for that word)
 *  10  call to action (full)       logo behind her, the link, end card
 *
 * One continuous take: eight takes with Flow's burned-in subtitles removed (scripts/remove_subtitles.py), colour-matched,
 * cut at hand-picked pauses and two garbled phrases (scripts/build_lk_src.sh), joins morph-cut. One voice: Seed-VC to
 * take 1's voice. Demo data; patients and offices are fictional.
 */
import React from "react";
import { AbsoluteFill, Audio, Freeze, Img, Sequence, interpolate, spring, staticFile, useCurrentFrame } from "remotion";
import { FontGate, TALENT, TalentLayer, type Framing } from "../effects";
import { Orbit } from "../effects/01-orbit";
import { DigitalZoom } from "../effects/05-digital-zoom";
import transcript from "../data/transcript-lk.json";
import cut from "../data/lk-cut-segments.json";
import handsData from "../data/hands-lk.json";
import { FONT_UI } from "../theme";
import { LogoReveal, easeIO, easeOut, ramp } from "../tr/motion";
import { ICON, Icon, TR, clamp } from "../tr/ui";

const TL = TALENT["lk-cut"];
const FPS = 30;
const CUT_FRAMES = Math.round(cut.duration * FPS);
const TAIL = 75;
export const LK_DURATION = CUT_FRAMES + TAIL;

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

const WORDS = transcript["lk-cut"].words;
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

const T = {
  nobody: at("nobody", 1),
  tells: at("tells"),
  this: at("this"),
  biggest: at("biggest"),
  problem: at("problem"),
  isnt: at("isnt", 1),
  gps: at("gps"),
  stop: at("stop", 1),
  cases: at("cases"),
  its: at("its", 1),
  front: at("front"),
  office: at("office", 1),
  voicemail: at("voicemail"),
  returns: at("returns"),
  status: at("status", 1),
  clicked: at("clicked"),
  accident: at("accident"),
  coordinator: at("coordinator"),
  quits: at("quits"),
  them: at("them"),
  quietly: at("quietly"),
  costs: at("costs"),
  specialists: at("specialists"),
  tens: at("tens"),
  thousands: at("thousands"),
  month: at("month"),
  tooth1: at("tooth", 1),
  fixes: at("fixes"),
  leak1: at("leak", 1),
  web: at("web"),
  form: at("form"),
  shared: at("shared"),
  network: at("network"),
  referring: at("referring"),
  same: at("same"),
  dashboard: at("dashboard"),
  case1: at("case", 1),
  xray: at("x"),
  message1: at("message", 1),
  syncs: at("syncs"),
  both: at("both"),
  access: at("access"),
  codes: at("codes"),
  portal: at("portal"),
  links: at("links"),
  every4: at("every", 4),
  note: at("note"),
  status2: at("status", 2),
  visible: at("visible"),
  whole: at("whole"),
  anyone: at("anyone"),
  case2: at("case", 2),
  heres: at("heres"),
  math: at("math"),
  one2: at("one", 2),
  leak2: at("leak", 2),
  pays: at("pays"),
  system: at("system"),
  setup: at("setup"),
  five: at("five"),
  minutes: at("minutes"),
  check: at("check"),
  stop2: at("stop", 2),
  leak3: at("leak", 3),
};

// ---------------------------------------------------------------------------------------------------
// Layout: full, split A (dashboard top, her below), split B (her top, dashboard below). Eased, never a cut.

const PANEL = 840;
const SPLIT_A = { y: 675, top: 840, bottom: 1920 };
const SPLIT_B = { y: -90, top: 0, bottom: 1080 };
const FULL = { y: 0, top: 0, bottom: 1920 };
const TA = [T.quietly - 16, T.quietly + 4] as const; // full -> A
const TF = [T.access - 18, T.access + 2] as const; // A -> full (no codes, her hands)
const TB = [T.anyone - 16, T.anyone + 2] as const; // full -> B
const TC = [T.heres - 18, T.heres] as const; // B -> full

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

/** Installed effects (reel/src/effects), used where they fit the line, one each:
 *  Orbit: "every message, note and status update is visible to your whole team" (the chips ring her head);
 *  Digital zoom: "and here's the math" (the snap lands on "math"). */
const ORBIT = { from: T.every4 - 8, to: TB[0] + 2 };
const ZOOM = { from: TC[1], to: T.one2 - 2 };

/** Punch-in zooms on the strong words (hook-reference): instant in, hold, ease back; about her face. */
const PUNCH: [number, number][] = [
  [T.nobody, 0.1],
  [T.this, 0.07],
  [T.front, 0.09],
  [T.tens, 0.07],
  [T.fixes, 0.06],
];
const punchAt = (frame: number) =>
  PUNCH.reduce((z, [a, amt]) => {
    if (frame < a - 1 || frame > a + 26) return z;
    const k = frame < a + 3 ? ramp(frame, a - 1, a + 3, easeOut) : 1 - ramp(frame, a + 12, a + 26, easeIO);
    return Math.max(z, amt * k);
  }, 0);
const FACE = [360, 460]; // source px, her face centre (scripts/facetrack.py, mean)
const framingFor = (l: Lay, frame: number): Framing => {
  const z = l.mode === "full" ? punchAt(frame) : 0;
  const s = 1.5 * (1 + z);
  return { scale: s, x: FACE[0] * (1.5 - s), y: l.y + FACE[1] * (1.5 - s) };
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

const KEY = new Set(["leak", "front", "office", "voicemail", "accident", "quits", "thousands", "toothreferral", "network", "dashboard", "syncs", "codes", "links", "team", "math", "pays", "system", "five", "minutes", "everything"]);
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
const HOOK_END = T.biggest - 4; // the stacked hook text replaces captions until here

const Captions: React.FC<{ lay: Lay }> = ({ lay }) => {
  const frame = useCurrentFrame();
  if (frame < HOOK_END) return null;
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
              marginRight: i < c.words.length - 1 ? "0.22em" : 0,
              opacity: k,
              translate: `0px ${(1 - k) * 10}px`,
              filter: k < 1 ? `blur(${(1 - k) * 5}px)` : undefined,
              padding: hot ? "0 0.14em" : undefined,
              margin: hot ? "0 -0.08em" : undefined,
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
const OLD = (n: string): Img2 => ({ src: `dash/${n}.jpg`, w: 1920, h: 842 });
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
// 1  hook: red flash, stacked lower-third text, punch-ins

const RedFlash: React.FC = () => {
  const frame = useCurrentFrame();
  const flash = (a: number, peak: number) => (frame >= a && frame < a + 8 ? peak * (1 - (frame - a) / 8) : 0);
  const v = Math.max(flash(T.nobody, 0.75), flash(T.this, 0.35));
  if (v <= 0) return null;
  return <AbsoluteFill style={{ background: RED, opacity: v, mixBlendMode: "screen" }} />;
};

const HookText: React.FC = () => {
  const frame = useCurrentFrame();
  if (frame > HOOK_END + 10) return null;
  const out = ramp(frame, HOOK_END, HOOK_END + 10);
  const lines: { w: string; at: number; red?: boolean }[][] = [
    [{ w: "NOBODY", at: T.nobody, red: true }],
    [
      { w: "TELLS", at: T.tells },
      { w: "YOU", at: T.tells + 6 },
      { w: "THIS", at: T.this, red: true },
    ],
  ];
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: 1300, textAlign: "center", opacity: 1 - out, filter: out > 0 ? `blur(${out * 10}px)` : undefined }}>
      {lines.map((l, i) => (
        <div key={i} style={{ ...TYPE, fontSize: i === 0 ? 170 : 116, letterSpacing: "-0.03em", lineHeight: 0.92 }}>
          {l.map((x, j) => {
            const k = interpolate(frame, [x.at - 1, x.at + 4], [0, 1], clamp);
            return (
              <span key={j} style={{ display: "inline-block", marginRight: j < l.length - 1 ? "0.18em" : 0, color: x.red ? RED : W, textShadow: x.red ? "0 0 40px rgba(255,77,90,0.65), 0 6px 24px rgba(10,6,24,0.5)" : SOFT, opacity: k, scale: String(interpolate(k, [0, 1], [1.3, 1])), filter: k < 1 ? `blur(${(1 - k) * 8}px)` : undefined }}>
                {x.w}
              </span>
            );
          })}
        </div>
      ))}
    </div>
  );
};

// ---------------------------------------------------------------------------------------------------
// 2  the myth: "GPs stopped sending" struck out

const Myth: React.FC = () => {
  const frame = useCurrentFrame();
  const from = T.isnt - 2;
  const { p, out, on } = win(frame, from, T.its + 4, 9);
  if (!on) return null;
  const strike = ramp(frame, T.cases - 2, T.cases + 8, easeOut);
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: 210, display: "flex", justifyContent: "center", opacity: 1 - out, filter: out > 0 ? `blur(${out * 8}px)` : undefined }}>
      <div style={{ position: "relative", scale: String(p), display: "flex", alignItems: "center", gap: 16, padding: "18px 30px 18px 18px", borderRadius: 999, background: "rgba(16,12,30,0.88)", border: "1.5px solid rgba(255,255,255,0.16)", boxShadow: "0 16px 40px rgba(10,6,24,0.45)", fontFamily: FONT_UI, color: W }}>
        <div style={{ width: 60, height: 60, borderRadius: 30, background: "rgba(255,255,255,0.12)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon d={I.building} size={32} color={W} />
        </div>
        <div>
          <div style={{ fontSize: 22, fontWeight: 700, opacity: 0.6, letterSpacing: "0.04em" }}>THE USUAL GUESS</div>
          <div style={{ fontSize: 40, fontWeight: 800, letterSpacing: "-0.02em" }}>GPs stopped sending cases</div>
        </div>
        {strike > 0 && <div style={{ position: "absolute", left: 10, top: "50%", height: 9, width: `calc(${strike * 100}% - 20px)`, background: RED, borderRadius: 6, rotate: "-3deg", boxShadow: "0 4px 14px rgba(10,6,24,0.35)" }} />}
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------------------------------
// 3  the leak: your front office; three leaks above her head

const FrontOffice: React.FC = () => {
  const frame = useCurrentFrame();
  const { p, out, on } = win(frame, T.front - 4, T.voicemail - 2, 8);
  if (!on) return null;
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: 250, display: "flex", justifyContent: "center", opacity: 1 - out, filter: out > 0 ? `blur(${out * 8}px)` : undefined }}>
      <div style={{ scale: String(interpolate(p, [0, 1], [0.6, 1])), opacity: Math.min(1, p * 2), display: "flex", alignItems: "center", gap: 16, padding: "18px 34px 18px 18px", borderRadius: 999, background: YELLOW, color: INK, ...TYPE, letterSpacing: "-0.03em", fontSize: 54, boxShadow: "0 16px 40px rgba(10,6,24,0.45)" }}>
        <div style={{ width: 64, height: 64, borderRadius: 32, background: INK, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon d={I.building} size={34} color={YELLOW} />
        </div>
        your front office
      </div>
    </div>
  );
};

const LeakCard: React.FC<{ at: number; y: number; icon: string; title: React.ReactNode; sub: React.ReactNode; drain: number; i: number }> = ({ at, y, icon, title, sub, drain, i }) => {
  const frame = useCurrentFrame();
  const k = sp(frame, at, 13, 190);
  if (k <= 0) return null;
  const fall = ramp(frame, drain + i * 3, drain + i * 3 + 16, (t) => t * t);
  const drip = ((frame - at) % 30) / 30;
  return (
    <div style={{ position: "absolute", left: 120, right: 120, top: y, scale: String(interpolate(k, [0, 1], [0.7, 1])), opacity: Math.min(1, k * 2) * (1 - fall), translate: `0px ${fall * 220}px`, filter: fall > 0.05 ? `blur(${fall * 10}px)` : undefined }}>
      <div style={{ ...CARD, display: "flex", alignItems: "center", gap: 18, padding: "16px 22px", borderRadius: 22, borderLeft: `8px solid ${RED}` }}>
        <div style={{ width: 62, height: 62, borderRadius: 16, background: "#FFE7E9", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <Icon d={icon} size={34} color={TR.red} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 32, fontWeight: 800, letterSpacing: "-0.02em" }}>{title}</div>
          <div style={{ fontSize: 23, fontWeight: 600, color: "#6B7085", marginTop: 2 }}>{sub}</div>
        </div>
        <div style={{ position: "relative", width: 40, height: 60, flexShrink: 0 }}>
          <div style={{ position: "absolute", left: 6, top: 6 + drip * 30, opacity: 1 - drip }}>
            <Icon d={I.drop} size={28} color={TR.red} />
          </div>
        </div>
      </div>
    </div>
  );
};

const Leaks: React.FC = () => {
  const frame = useCurrentFrame();
  const drain = T.quietly - 14;
  if (frame < T.voicemail - 4 || frame > drain + 40) return null;
  return (
    <AbsoluteFill>
      <LeakCard
        i={0}
        at={T.voicemail - 4}
        y={120}
        icon={I.voicemail}
        drain={drain}
        title={
          <span>
            Status: <span style={{ color: "#B7791F" }}>Left a Voice Message</span>
          </span>
        }
        sub="no one called back · 6 days"
      />
      <LeakCard
        i={1}
        at={T.status - 4}
        y={250}
        icon={ICON.alert}
        drain={drain}
        title={
          <span>
            Marked <span style={{ color: TR.red }}>“Scheduled”</span> by mistake
          </span>
        }
        sub="no appointment behind it · case vanished"
      />
      <LeakCard i={2} at={T.coordinator - 4} y={380} icon={I.user} drain={drain} title="Coordinator left the practice" sub="12 follow-ups left with them" />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------------------------------
// 4-6  the dashboard panel (split A)

const LIST: Crop = { x: 340, y: 0, w: 1100 };
const FUNNEL: Crop = { x: 1300, y: 160, w: 600 };

/** "Not just another web form": a generic contact form, stamped. */
const WebForm: React.FC<{ from: number; to: number }> = ({ from, to }) => {
  const frame = useCurrentFrame();
  if (frame < from - 1 || frame > to + 9) return null;
  const inn = ramp(frame, from, from + 9, easeOut);
  const stamp = sp(frame, T.form - 2, 11, 260);
  return (
    <AbsoluteFill style={{ opacity: inn * (1 - ramp(frame, to, to + 9)), background: "#EEF0F5", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ ...CARD, width: 620, padding: 36, borderRadius: 22, boxShadow: "0 16px 40px rgba(10,6,30,0.15)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 30, fontWeight: 800, color: "#5C6070" }}>
          <Icon d={I.form} size={34} color="#8A8F9E" /> Contact us
        </div>
        {["Name", "Phone", "Referring doctor", "Attach PDF"].map((f) => (
          <div key={f} style={{ marginTop: 18 }}>
            <div style={{ fontSize: 20, color: "#8A8F9E", fontWeight: 700 }}>{f}</div>
            <div style={{ height: 50, borderRadius: 10, border: "2px solid #DADDE5", marginTop: 6 }} />
          </div>
        ))}
        <div style={{ marginTop: 22, height: 58, borderRadius: 12, background: "#B8BCC8", color: W, fontSize: 26, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center" }}>Submit → someone's inbox</div>
      </div>
      {stamp > 0 && (
        <div style={{ position: "absolute", left: 0, right: 0, top: 300, display: "flex", justifyContent: "center" }}>
          <div style={{ padding: "12px 30px", border: `8px solid ${RED}`, color: RED, borderRadius: 16, ...TYPE, letterSpacing: "0.01em", fontSize: 70, lineHeight: 0.95, textAlign: "center", rotate: "-8deg", scale: String(interpolate(stamp, [0, 1], [2.2, 1])), opacity: Math.min(1, stamp * 2), background: "rgba(255,255,255,0.92)", boxShadow: "0 20px 50px rgba(10,6,24,0.35)" }}>
            NOT ANOTHER
            <br />
            WEB FORM
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
};

/** The logo card for "ToothReferral fixes the leak". */
const LogoCard: React.FC<{ from: number; to: number }> = ({ from, to }) => {
  const frame = useCurrentFrame();
  if (frame < from - 1 || frame > to + 9) return null;
  const inn = ramp(frame, from, from + 9, easeOut);
  const ok = sp(frame, T.leak1 - 2, 12, 220);
  return (
    <AbsoluteFill style={{ opacity: inn * (1 - ramp(frame, to, to + 9)), background: `radial-gradient(ellipse at 50% 40%, #3B1E8F, #1B1240 75%)`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 40 }}>
      <Sequence from={from} layout="none">
        <LogoReveal at={0} width={520} revealDur={16} shineDur={26} />
      </Sequence>
      {ok > 0 && (
        <div style={{ scale: String(ok), display: "flex", alignItems: "center", gap: 14, padding: "16px 30px 16px 16px", borderRadius: 999, background: GREEN, color: W, ...TYPE, letterSpacing: "-0.025em", fontSize: 46, boxShadow: "0 0 40px rgba(31,164,99,0.5)" }}>
          <div style={{ width: 54, height: 54, borderRadius: 27, background: "rgba(255,255,255,0.25)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Icon d={ICON.check} size={30} color={W} />
          </div>
          leak sealed
        </div>
      )}
    </AbsoluteFill>
  );
};

/** Two offices, one dashboard: "synced to both" between them. */
const SyncBoth: React.FC = () => {
  const frame = useCurrentFrame();
  const { p, out, on } = win(frame, T.syncs - 4, TF[0] + 2, 8);
  if (!on) return null;
  const flow = (frame % 30) / 30;
  return (
    <div style={{ position: "absolute", left: 0, right: 0, bottom: 34, display: "flex", justifyContent: "center", opacity: 1 - out }}>
      <div style={{ scale: String(p), display: "flex", alignItems: "center", gap: 16, padding: "14px 24px", borderRadius: 999, background: "rgba(16,12,30,0.92)", boxShadow: "0 16px 40px rgba(10,6,24,0.45)", fontFamily: FONT_UI, color: W, fontWeight: 800, fontSize: 30 }}>
        <span>Your office</span>
        <div style={{ position: "relative", width: 150, height: 6, borderRadius: 3, background: "rgba(255,255,255,0.2)" }}>
          <div style={{ position: "absolute", left: `${flow * 100}%`, top: -7, width: 20, height: 20, borderRadius: 10, background: "#22C55E", translate: "-50% 0", boxShadow: "0 0 14px #22C55E" }} />
          <div style={{ position: "absolute", left: `${(1 - flow) * 100}%`, top: -7, width: 20, height: 20, borderRadius: 10, background: YELLOW, translate: "-50% 0", boxShadow: `0 0 14px ${YELLOW}` }} />
        </div>
        <span>GP office</span>
        <div style={{ marginLeft: 6, padding: "6px 14px", borderRadius: 999, background: GREEN, fontSize: 24 }}>synced</div>
      </div>
    </div>
  );
};

const DashA: React.FC<{ lay: Lay }> = ({ lay }) => {
  const frame = useCurrentFrame();
  if (frame < TA[0] - 2 || frame > TF[1] + 2) return null;
  // shot boundaries
  const S_FUN = TA[0];
  const S_LOGO = T.tooth1 - 6;
  const S_FORM = T.web - 12;
  const S_NET = T.shared - 6;
  const S_CASE = T.case1 - 8;
  const S_XRAY = T.xray - 6;
  const S_MSG = T.message1 - 6;
  const S_END = TF[1];
  const rows = [
    [392, 445, 1440, 556],
    [392, 560, 1440, 672],
    [392, 676, 1440, 764],
  ];
  return (
    <div style={{ position: "absolute", left: 24, top: lay.dashTop + 24, width: PW, height: PH, borderRadius: 30, overflow: "hidden", background: TR.bg, boxShadow: "0 24px 60px rgba(0,0,0,0.45)", border: "1.5px solid rgba(255,255,255,0.18)" }}>
      {/* the cost: the real Referral funnel; the leak steps light up */}
      <Shot
        img={NEW("an-03-volume-funnel")}
        from={S_FUN}
        to={S_LOGO}
        keys={[
          [S_FUN, { x: 380, y: 140, w: 1500 }],
          [T.quietly + 10, { x: 380, y: 140, w: 1500 }],
          [T.costs + 6, FUNNEL],
        ]}
      >
        {(m) => (
          <>
            <Hl box={[1393, 377, 1803, 397]} m={m} k={sp(frame, T.costs + 6, 12, 200)} color={RED} label="50% leak" labelSide="bottom" dx={250} />
            <Hl box={[1393, 463, 1803, 483]} m={m} k={sp(frame, T.specialists, 12, 200)} color={RED} />
            <Mouse path={[[S_FUN + 4, 900, 600], [T.costs + 2, 1560, 388], [T.tens, 1560, 474]]} clicks={[]} m={m} show={[S_FUN + 4, S_LOGO]} />
            <Tag x={1880} y={640} m={m} k={sp(frame, T.tens - 2, 12, 200)} text="tens of thousands / month" color={RED} icon={I.drop} anchor="right" />
          </>
        )}
      </Shot>
      <LogoCard from={S_LOGO} to={S_FORM} />
      <WebForm from={S_FORM} to={S_NET} />
      {/* one shared referral network: the connected offices */}
      <Shot
        img={OLD("rec-2")}
        from={S_NET}
        to={S_CASE}
        keys={[
          [S_NET, { x: 330, y: 0, w: 1180 }],
          [T.network - 4, { x: 600, y: 380, w: 560 }],
          [T.referring - 2, { x: 600, y: 380, w: 560 }],
          [T.same, LIST],
        ]}
      >
        {(m) => (
          <>
            {[
              [797, 476],
              [797, 592],
              [797, 720],
            ].map(([x, y], i) => (
              <Pulse key={i} x={x} y={y} at={T.network - 2 + i * 3} m={m} />
            ))}
            <Hl box={[392, 380, 1440, 790]} m={m} k={sp(frame, T.dashboard - 4, 12, 180)} color={YELLOW} fill={false} label="the same dashboard, both offices" labelSide="top" />
            {rows.map((r, i) => (
              <Hl key={i} box={r} m={m} k={sp(frame, T.network + i * 4, 14, 200) * (1 - ramp(frame, T.referring - 2, T.referring + 4))} fill />
            ))}
            <Mouse path={[[S_NET + 4, 1300, 300], [T.network, 840, 600], [T.same, 1200, 400], [S_CASE, 1697, 502]]} clicks={[S_CASE - 2]} m={m} show={[S_NET + 4, S_CASE + 4]} />
            <Press box={[1675, 488, 1720, 514]} at={S_CASE - 2} m={m} />
          </>
        )}
      </Shot>
      {/* every case ... */}
      <Shot
        img={OLD("rec-18")}
        from={S_CASE}
        to={S_XRAY}
        keys={[
          [S_CASE, { x: 160, y: 40, w: 1100 }],
          [T.case1 + 10, { x: 170, y: 60, w: 900 }],
        ]}
      >
        {(m) => <Hl box={[195, 85, 660, 235]} m={m} k={sp(frame, T.case1 - 2, 12, 200)} label="the case" labelSide="bottom" />}
      </Shot>
      {/* ... X-ray ... */}
      <Shot
        img={OLD("rec-27.5")}
        from={S_XRAY}
        to={S_MSG}
        keys={[
          [S_XRAY, { x: 380, y: 100, w: 960 }],
          [T.xray + 10, { x: 400, y: 230, w: 420 }],
        ]}
      >
        {(m) => <Hl box={[427, 290, 657, 381]} m={m} k={sp(frame, T.xray, 12, 200)} color={GREEN} label="X-ray" labelSide="bottom" />}
      </Shot>
      {/* ... and message */}
      <Shot
        img={OLD("rec-47")}
        from={S_MSG}
        to={S_END}
        keys={[
          [S_MSG, { x: 1100, y: 140, w: 820 }],
          [T.message1 + 10, { x: 1300, y: 230, w: 600 }],
        ]}
      >
        {(m) => <Hl box={[1322, 610, 1886, 690]} m={m} k={sp(frame, T.message1, 12, 200)} label="message" labelSide="top" />}
      </Shot>
      <SyncBoth />
    </div>
  );
};

// ---------------------------------------------------------------------------------------------------
// 7  no access codes, no portal links (full: her hands strike them)

const NoCodes: React.FC = () => {
  const frame = useCurrentFrame();
  const from = T.access - 6;
  const { p, out, on } = win(frame, from, ORBIT.from + 6, 8);
  if (!on) return null;
  const items = [
    { t: "access code", icon: I.key, at: T.access - 6, strike: T.codes + 2, hand: "left" as Pick },
    { t: "portal link", icon: I.link, at: T.portal - 6, strike: T.links + 2, hand: "right" as Pick },
  ];
  return (
    <AbsoluteFill style={{ opacity: Math.min(1, p * 2) * (1 - out) }}>
      {items.map((it) => {
        const k = sp(frame, it.at, 12, 220);
        if (k <= 0) return null;
        const s = ramp(frame, it.strike, it.strike + 8, easeOut);
        // each chip rides above the hand that strikes it (horizontally only, so it never covers her face)
        const [hx] = handOut(Math.min(frame, it.strike + 6), it.hand, "palm", 3);
        const x = it.hand === "left" ? Math.max(30, Math.min(hx - 260, 300)) : Math.max(520, Math.min(hx - 120, 650));
        return (
          <div key={it.t} style={{ position: "absolute", left: x, top: 300, scale: String(k), transformOrigin: "50% 50%" }}>
            <div style={{ position: "relative", display: "flex", alignItems: "center", gap: 14, padding: "16px 28px 16px 16px", borderRadius: 999, background: W, color: INK, fontFamily: FONT_UI, fontWeight: 800, fontSize: 40, boxShadow: "0 16px 40px rgba(10,6,24,0.45)", whiteSpace: "nowrap" }}>
              <div style={{ width: 56, height: 56, borderRadius: 28, background: "#FFE7E9", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Icon d={it.icon} size={30} color={TR.red} />
              </div>
              {it.t}
              {s > 0 && <div style={{ position: "absolute", left: 12, top: "48%", height: 9, width: `calc(${s * 100}% - 24px)`, background: RED, borderRadius: 6, rotate: "-4deg" }} />}
            </div>
          </div>
        );
      })}
      {frame >= T.links + 6 && (
        <div style={{ position: "absolute", left: 0, right: 0, top: 440, display: "flex", justifyContent: "center" }}>
          <div style={{ scale: String(sp(frame, T.links + 6, 12, 220)), padding: "12px 26px", borderRadius: 999, background: GREEN, color: W, fontFamily: FONT_UI, fontWeight: 800, fontSize: 34, boxShadow: "0 14px 30px rgba(10,6,24,0.35)" }}>both offices just log in</div>
        </div>
      )}
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------------------------------
// 7-8  status board, visible to the whole team; needs attention: anyone can pick up (split B)

const DashB: React.FC<{ lay: Lay }> = ({ lay }) => {
  const frame = useCurrentFrame();
  if (frame < TB[0] - 2 || frame > TC[1] + 2) return null;
  const S_NEED = TB[0];
  return (
    <div style={{ position: "absolute", left: 24, top: lay.dashTop + 24, width: PW, height: PH, borderRadius: 30, overflow: "hidden", background: TR.bg, boxShadow: "0 24px 60px rgba(0,0,0,0.45)", border: "1.5px solid rgba(255,255,255,0.18)" }}>
      <Shot
        img={NEW("an-07-outcomes-sources")}
        from={S_NEED}
        to={TC[1]}
        keys={[
          [S_NEED, { x: 380, y: 300, w: 1000 }],
          [T.case2, { x: 760, y: 400, w: 520 }],
        ]}
      >
        {(m) => (
          <>
            <Hl box={[405, 476, 1200, 515]} m={m} k={sp(frame, T.anyone, 12, 200)} color="#E89D15" label="ghost referral" labelSide="top" />
            <Press box={[1090, 482, 1195, 512]} at={T.case2 + 2} m={m} />
            <Mouse path={[[S_NEED + 4, 800, 640], [T.case2 + 1, 1140, 497]]} clicks={[T.case2 + 2]} m={m} show={[S_NEED + 4, TC[1]]} />
            <Tag x={1190} y={570} m={m} k={sp(frame, T.case2 + 8, 12, 220)} text="re-assigned · picked up" anchor="right" />
          </>
        )}
      </Shot>
    </div>
  );
};

// ---------------------------------------------------------------------------------------------------
// 8  the math (full): 1 referral that doesn't leak = the system, paid for

const Math1: React.FC = () => {
  const frame = useCurrentFrame();
  const from = T.one2 - 4;
  const { p, out, on } = win(frame, from, T.setup - 6, 8);
  if (!on) return null;
  const eq = sp(frame, T.pays - 2, 12, 220);
  const paid = sp(frame, T.system - 2, 11, 240);
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: 150, display: "flex", flexDirection: "column", alignItems: "center", gap: 14, opacity: 1 - out, filter: out > 0 ? `blur(${out * 8}px)` : undefined }}>
      <div style={{ scale: String(p), display: "flex", alignItems: "center", gap: 14, padding: "16px 30px 16px 16px", borderRadius: 999, background: W, color: INK, fontFamily: FONT_UI, fontWeight: 800, fontSize: 40, boxShadow: "0 16px 40px rgba(10,6,24,0.45)" }}>
        <div style={{ width: 56, height: 56, borderRadius: 28, background: TR.purple, color: W, display: "flex", alignItems: "center", justifyContent: "center", ...TYPE, fontSize: 34 }}>1</div>
        referral that doesn't leak
      </div>
      {eq > 0 && <div style={{ ...TYPE, fontSize: 90, color: YELLOW, textShadow: SOFT, scale: String(eq), lineHeight: 0.9 }}>=</div>}
      {paid > 0 && (
        <div style={{ scale: String(paid), display: "flex", alignItems: "center", gap: 14, padding: "16px 30px 16px 16px", borderRadius: 999, background: GREEN, color: W, fontFamily: FONT_UI, fontWeight: 800, fontSize: 40, boxShadow: "0 0 40px rgba(31,164,99,0.5)" }}>
          <div style={{ width: 56, height: 56, borderRadius: 28, background: "rgba(255,255,255,0.25)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Icon d={ICON.check} size={32} color={W} />
          </div>
          ToothReferral, paid for
        </div>
      )}
    </div>
  );
};

// ---------------------------------------------------------------------------------------------------
// 9  setup: a full-screen card (covers her mouth while the re-made "Setup" plays)

const SETUP_IN = T.setup - 5;
const SETUP_OUT = T.check - 6;
const SetupCard: React.FC = () => {
  const frame = useCurrentFrame();
  if (frame < SETUP_IN - 1 || frame > SETUP_OUT + 12) return null;
  const inn = ramp(frame, SETUP_IN, SETUP_IN + 6, easeOut);
  const out = ramp(frame, SETUP_OUT, SETUP_OUT + 12, easeIO);
  const prog = ramp(frame, T.setup, T.minutes + 10, (t) => t);
  const steps = [
    { t: "Invite your network", at: T.setup + 6 },
    { t: "Go live on your website", at: T.five - 4 },
    { t: "Referrals start landing", at: T.minutes },
  ];
  return (
    <AbsoluteFill style={{ clipPath: `inset(0px 0px ${out * 100}% 0px)`, opacity: inn }}>
      <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 35%, #3B1E8F, #140C30 75%)` }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 300, display: "flex", flexDirection: "column", alignItems: "center", scale: String(interpolate(inn, [0, 1], [1.08, 1])) }}>
        <svg width={320} height={320} viewBox="0 0 320 320">
          <circle cx={160} cy={160} r={140} fill="none" stroke="rgba(255,255,255,0.14)" strokeWidth={18} />
          <circle cx={160} cy={160} r={140} fill="none" stroke={YELLOW} strokeWidth={18} strokeLinecap="round" strokeDasharray={`${prog * 880} 880`} transform="rotate(-90 160 160)" />
          <text x={160} y={186} textAnchor="middle" fontFamily={FONT_UI} fontWeight={800} fontSize={86} fill={W} letterSpacing="-3">
            {`${Math.floor(prog * 5)}:${String(Math.floor((prog * 300) % 60)).padStart(2, "0")}`}
          </text>
        </svg>
        <div style={{ ...TYPE, fontSize: 96, color: W, marginTop: 36, textAlign: "center" }}>
          set up in
          <br />
          <span style={{ color: YELLOW }}>about 5 minutes</span>
        </div>
        <div style={{ marginTop: 50, display: "flex", flexDirection: "column", gap: 16 }}>
          {steps.map((s) => {
            const k = sp(frame, s.at, 12, 220);
            return (
              <div key={s.t} style={{ display: "flex", alignItems: "center", gap: 16, opacity: Math.min(1, k * 2), translate: `${(1 - k) * 30}px 0px`, fontFamily: FONT_UI, fontWeight: 800, fontSize: 40, color: W }}>
                <div style={{ width: 54, height: 54, borderRadius: 27, background: GREEN, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Icon d={ICON.check} size={30} color={W} />
                </div>
                {s.t}
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------------------------------
// 10  call to action

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

const CtaLink: React.FC = () => {
  const frame = useCurrentFrame();
  const from = T.check + 4;
  const { p, out, on } = win(frame, from, CUT_FRAMES - 4, 9);
  if (!on) return null;
  return (
    <div style={{ position: "absolute", left: 540, top: 380, translate: "-50% -50%", scale: String(interpolate(p, [0, 1], [0.5, 1])), opacity: Math.min(1, p * 2) * (1 - out), padding: "16px 34px", borderRadius: 999, background: YELLOW, color: INK, ...TYPE, letterSpacing: "-0.025em", fontSize: 44, boxShadow: "0 14px 34px rgba(10,6,24,0.45)", whiteSpace: "nowrap" }}>toothreferral.com</div>
  );
};

/** "...and stop the leak inside your own office": the leak drop turns into a green check. */
const Sealed: React.FC = () => {
  const frame = useCurrentFrame();
  const from = T.stop2 - 4;
  const { p, out, on } = win(frame, from, CUT_FRAMES - 2, 8);
  if (!on) return null;
  const ok = ramp(frame, T.leak3, T.leak3 + 10, easeOut);
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: 470, display: "flex", justifyContent: "center", opacity: 1 - out }}>
      <div style={{ scale: String(p), display: "flex", alignItems: "center", gap: 12, padding: "12px 26px 12px 12px", borderRadius: 999, background: ok > 0.5 ? GREEN : "rgba(16,12,30,0.88)", color: W, fontFamily: FONT_UI, fontWeight: 800, fontSize: 32, boxShadow: "0 14px 30px rgba(10,6,24,0.4)" }}>
        <div style={{ width: 48, height: 48, borderRadius: 24, background: ok > 0.5 ? "rgba(255,255,255,0.25)" : "#FFE7E9", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon d={ok > 0.5 ? ICON.check : I.drop} size={26} color={ok > 0.5 ? W : TR.red} />
        </div>
        {ok > 0.5 ? "leak stopped" : "the leak"}
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
      <div style={{ position: "absolute", left: 0, right: 0, top: 1030, textAlign: "center", opacity: url, ...TYPE, fontSize: 34, color: "rgba(255,255,255,0.72)", letterSpacing: "-0.02em", fontWeight: 700 }}>one shared referral network · live in 5 minutes</div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 1120, display: "flex", justifyContent: "center", opacity: Math.min(1, btn * 1.5), scale: String(interpolate(btn, [0, 1], [0.8, 1])) }}>
        <div style={{ padding: "22px 40px", borderRadius: 22, background: YELLOW, color: INK, ...TYPE, letterSpacing: "-0.03em", fontSize: 40, boxShadow: "0 16px 40px rgba(10,6,24,0.45)" }}>stop the leak in your office →</div>
      </div>
    </>
  );
};

// ---------------------------------------------------------------------------------------------------
// Sound: one voice, a quiet bed, and a hit / pop / click on every visual change

const SFX: { f: number; s: string; v: number }[] = [
  { f: T.nobody, s: "impact", v: 0.2 },
  { f: T.tells, s: "pop-1", v: 0.1 },
  { f: T.this - 1, s: "pop-2", v: 0.12 },
  { f: T.isnt - 2, s: "whoosh-short", v: 0.1 },
  { f: T.cases - 2, s: "thud", v: 0.12 },
  { f: T.front - 4, s: "pop-1", v: 0.12 },
  { f: T.voicemail - 4, s: "blip-1", v: 0.12 },
  { f: T.status - 4, s: "blip-2", v: 0.12 },
  { f: T.coordinator - 4, s: "blip-3", v: 0.12 },
  { f: T.quietly - 14, s: "whoosh-long", v: 0.12 },
  { f: T.costs + 6, s: "tick-1", v: 0.12 },
  { f: T.tens - 2, s: "thud", v: 0.12 },
  { f: T.tooth1 - 6, s: "shimmer", v: 0.16 },
  { f: T.leak1 - 2, s: "chime", v: 0.12 },
  { f: T.form - 2, s: "impact", v: 0.12 },
  { f: T.shared - 6, s: "whoosh-short", v: 0.1 },
  { f: T.network - 2, s: "pop-2", v: 0.1 },
  { f: T.dashboard - 4, s: "pop-3", v: 0.1 },
  { f: T.case1 - 10, s: "click", v: 0.14 },
  { f: T.xray - 6, s: "whoosh-short", v: 0.08 },
  { f: T.message1 - 6, s: "whoosh-short", v: 0.08 },
  { f: T.syncs - 4, s: "chime", v: 0.1 },
  { f: TF[0], s: "whoosh-short", v: 0.12 },
  { f: T.codes + 2, s: "pop-1", v: 0.12 },
  { f: T.links + 2, s: "pop-2", v: 0.12 },
  { f: ORBIT.from, s: "whoosh-long", v: 0.12 },
  { f: T.note - 2, s: "pop-2", v: 0.1 },
  { f: T.status2 - 2, s: "pop-3", v: 0.1 },
  { f: T.whole - 2, s: "chime", v: 0.1 },
  { f: TB[0], s: "whoosh-short", v: 0.12 },
  { f: T.case2 + 2, s: "click", v: 0.14 },
  { f: TC[0], s: "whoosh-short", v: 0.12 },
  { f: T.math - 3, s: "impact", v: 0.12 },
  { f: T.pays - 2, s: "tick-3", v: 0.12 },
  { f: T.system - 2, s: "chime", v: 0.14 },
  { f: SETUP_IN, s: "whoosh-long", v: 0.14 },
  { f: T.five - 4, s: "tick-4", v: 0.1 },
  { f: SETUP_OUT, s: "whoosh-short", v: 0.12 },
  { f: T.check - 4, s: "shimmer", v: 0.14 },
  { f: T.leak3, s: "chime", v: 0.12 },
  { f: CUT_FRAMES - 6, s: "whoosh-long", v: 0.16 },
];

// ---------------------------------------------------------------------------------------------------
// The edit

export const LeakInside: React.FC = () => {
  const frame = useCurrentFrame();
  const f0 = Math.min(frame, CUT_FRAMES - 1);
  const lay = layoutAt(f0);
  const fr = framingFor(lay, f0);
  const freeze = frame >= CUT_FRAMES - 1;
  const grade: React.CSSProperties = { filter: "contrast(1.05) saturate(1.05) brightness(1.01)" };
  const speaker = (layer: "full" | "cutout", style?: React.CSSProperties) => {
    const el = <TalentLayer talent={TL} layer={layer} framing={fr} style={{ ...grade, ...style }} />;
    return freeze ? <Freeze frame={CUT_FRAMES - 2}>{el}</Freeze> : el;
  };
  const full = lay.mode === "full" && lay.top < 1 && lay.bottom > 1919;
  const endBlur = interpolate(frame, [CUT_FRAMES - 6, CUT_FRAMES + 10], [0, 14], clamp);
  const band: React.CSSProperties = { clipPath: `inset(${lay.top}px 0px ${1920 - lay.bottom}px 0px round ${full ? 0 : 30}px)` };
  return (
    <AbsoluteFill style={{ background: BG }}>
      <FontGate>
        <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 40%, #2A1B5E, ${BG} 70%)` }} />
        <AbsoluteFill style={{ filter: endBlur > 0 ? `blur(${endBlur}px)` : undefined }}>
          <AbsoluteFill style={band}>
            {speaker("full")}
            <Sequence from={ORBIT.from} durationInFrames={ORBIT.to - ORBIT.from} premountFor={30} name="orbit">
              <Orbit
                talent={TL}
                startAt={ORBIT.from / FPS}
                dim={0.45}
                accent={YELLOW}
                items={[
                  { label: "Messages", icon: "chat", at: (T.every4 + 4 - ORBIT.from) / FPS },
                  { label: "Notes", icon: "post", at: (T.note - 2 - ORBIT.from) / FPS },
                  { label: "Status", icon: "bell", at: (T.status2 - 2 - ORBIT.from) / FPS },
                  { label: "Team", icon: "person", at: (T.whole - 2 - ORBIT.from) / FPS },
                ]}
              />
            </Sequence>
            <Sequence from={ZOOM.from} durationInFrames={ZOOM.to - ZOOM.from} premountFor={30} name="digital zoom">
              <DigitalZoom talent={TL} startAt={ZOOM.from / FPS} zoom={1.35} snapAt={(T.math - 2 - ZOOM.from) / FPS} />
            </Sequence>
            {full && frame >= T.check - 6 && (
              <>
                <CtaLogo />
                {speaker("cutout")}
              </>
            )}
            {/* a soft bottom shade keeps captions readable and the frame's lower edge calm */}
            <AbsoluteFill style={{ background: "linear-gradient(180deg, transparent 62%, rgba(10,6,24,0.42) 100%)" }} />
          </AbsoluteFill>
          <DashA lay={lay} />
          <DashB lay={lay} />
          <HookText />
          <Myth />
          <FrontOffice />
          <Leaks />
          <NoCodes />
          <Math1 />
          <CtaLink />
          <Sealed />
          <SetupCard />
        </AbsoluteFill>
        {frame < CUT_FRAMES - 4 && <Captions lay={lay} />}
        <RedFlash />
        <EndCard />
        <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 42%, transparent 55%, rgba(8,5,18,0.36) 100%)", pointerEvents: "none" }} />
      </FontGate>

      <Audio src={staticFile("audio/voice/lk-cut.wav")} volume={(f) => interpolate(f, [CUT_FRAMES - 4, CUT_FRAMES + 4], [1, 0], clamp)} />
      <Audio src={staticFile("audio/music/cb-bed.ogg")} volume={(f) => 0.07 * interpolate(f, [0, 20, LK_DURATION - 45, LK_DURATION - 1], [0, 1, 1, 0], clamp)} />
      {SFX.map((x, i) => (
        <Sequence key={i} from={Math.max(0, x.f)} layout="none">
          <Audio src={staticFile(`audio/sfx/${x.s}.wav`)} volume={x.v} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
