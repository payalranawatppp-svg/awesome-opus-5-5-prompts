/**
 * "The Referral Roast": ToothReferral short. A roast of the fax-voicemail-sticky-note referral mess, then an easy
 * walk through the Incoming Referrals dashboard.
 *
 *   0  the roast (full frame)        "fax paper, voicemail, and prayer" pop off his counting fingers; "workflow" struck
 *                                    behind his head; HOSTAGE SITUATION stamp as his hands go up
 *   1  the mess (full frame)         every graphic rides a gesture (scripts/handtrack.py): an email, a ringing phone at
 *                                    his ear, a sticky note slapped where his palm hits, a waiting clock at his wrist
 *   2  the clean-up (full -> split)  the mess is swept off, ToothReferral reveals behind his head, then the frame splits:
 *                                    the real dashboard on top (stills from the screen recording), him below
 *   3  the board (split, dash top)   rows cascade, every referring office lights up, the list framed like his L-hands;
 *                                    green "connected" dots; new referrals flow in; one referral opened and its
 *                                    diagnosis, tooth numbers and treatment ticked off one finger at a time
 *   4  the conversation (swap)       panels swap: him on top, the office chat below (the burned-in captions of that take
 *                                    sit under the panel edge); status updated, consult scheduled, GP notified; the
 *                                    two "zero"s sit in his O-hands
 *   5  the close (full frame)        a network of offices joins on his interlocked fingers; the call to action rides his
 *                                    pointing hand; end card
 *
 * One continuous take: nine takes colour-matched (scripts/match_grade.py), faded clip ends replaced by their last
 * clean frame, cut at hand-picked pauses (scripts/cut_spans.py), joins hidden with morph cuts (scripts/morph_cuts.py),
 * one voice (ElevenLabs speech-to-speech, timing kept to the frame). Demo data; patients and offices are fictional.
 */
import React from "react";
import { AbsoluteFill, Audio, Freeze, Img, Sequence, interpolate, spring, staticFile, useCurrentFrame } from "remotion";
import { FontGate, TALENT, TalentLayer, type Framing } from "../effects";
import transcript from "../data/transcript-rr.json";
import cut from "../data/rr-cut-segments.json";
import handsData from "../data/hands-rr.json";
import { FONT_UI } from "../theme";
import { LogoReveal, easeIO, easeOut, ramp } from "../tr/motion";
import { ICON, Icon, TR, clamp } from "../tr/ui";

const TL = TALENT["rr-cut"];
const FPS = 30;
const CUT_FRAMES = Math.round(cut.duration * FPS);
const TAIL = 75;
export const RR_DURATION = CUT_FRAMES + TAIL;

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

const WORDS = transcript["rr-cut"].words;
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
  fax: at("fax"),
  voicemail: at("voicemail"),
  prayer: at("prayer"),
  thats1: at("thats", 1),
  workflow: at("workflow"),
  hostage: at("hostage"),
  every1: at("every", 1),
  email: at("email"),
  call: at("call"),
  note: at("note"),
  hell: at("hell"),
  patient: at("patient"),
  now: at("now"),
  tooth1: at("tooth", 1),
  heres: at("heres"),
  every2: at("every", 2),
  from: at("from"),
  lands: at("lands"),
  list: at("list"),
  each: at("each"),
  green: at("green"),
  connected1: at("connected", 1),
  build: at("build"),
  referrals: at("referrals"),
  flow: at("flow"),
  click: at("click"),
  diagnosis: at("diagnosis"),
  numbers: at("numbers"),
  what: at("what", 2),
  there: at("there", 2),
  detective: at("detective"),
  do: at("do"),
  message: at("message"),
  they: at("they", 2),
  adults: at("adults"),
  update: at("update"),
  schedule: at("schedule"),
  notified: at("notified"),
  zero1: at("zero", 1),
  zero2: at("zero", 2),
  thats3: at("thats", 3),
  connected2: at("connected", 2),
  place: at("place"),
  nobody: at("nobody"),
  want: at("want", 2),
  check2: at("check", 2),
  start: at("start"),
  connecting: at("connecting"),
};

// ---------------------------------------------------------------------------------------------------
// Layout: full frame, split A (dashboard on top, him below), split B (him on top, dashboard below).
// The changes are eased moves of one picture and one panel, never a cut.

const PANEL = 840; // dashboard panel height
const SPLIT_A = { y: 675, top: 840, bottom: 1920 }; // talent framing y and visible band
const SPLIT_B = { y: -90, top: 0, bottom: 1080 };
const FULL = { y: 0, top: 0, bottom: 1920 };
const TA = [T.heres - 18, T.heres + 2] as const; // full -> A
const TB = [T.do - 22, T.do - 2] as const; // A -> B (the swap)
const TC = [Math.round(49.95 * FPS), Math.round(50.55 * FPS)] as const; // B -> full (after the captioned take ends)

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
    if (prev && t.startsWith("-")) {
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
  const size = lay.mode === "full" ? 70 : 62;
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

/** A huge word behind the head (the speaker cutout sits in front of it). */
const BigWord: React.FC<{ from: number; to: number; text: string; size?: number; color?: string; top?: number; strikeAt?: number }> = ({ from, to, text, size = 220, color = YELLOW, top = 300, strikeAt }) => {
  const frame = useCurrentFrame();
  const { p, out, on } = win(frame, from, to, 9);
  if (!on) return null;
  const strike = strikeAt !== undefined ? ramp(frame, strikeAt, strikeAt + 8, easeOut) : 0;
  return (
    <div style={{ position: "absolute", left: -60, right: -60, top, display: "flex", justifyContent: "center", opacity: Math.min(1, p * 1.6) * (1 - out), filter: p < 0.7 ? `blur(${(0.7 - p) * 18}px)` : out > 0 ? `blur(${out * 12}px)` : undefined }}>
      <div style={{ position: "relative", ...TYPE, fontSize: size, color, scale: String(interpolate(p, [0, 1], [1.14, 1])), textShadow: "0 8px 40px rgba(10,6,24,0.25)" }}>
        {text}
        {strike > 0 && <div style={{ position: "absolute", left: -10, top: "52%", height: size * 0.09, width: `${strike * 104}%`, background: RED, borderRadius: 8, rotate: "-4deg", boxShadow: "0 4px 18px rgba(10,6,24,0.3)" }} />}
      </div>
    </div>
  );
};

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
  building: "M3 21h18M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16M9 7h2M13 7h2M9 11h2M13 11h2M9 15h2M13 15h2",
};

// ---------------------------------------------------------------------------------------------------
// 0  the roast

/** "Your referral process is fax paper, voicemail, and prayer.": each item pops off his hand, then lines up on top. */
const RoastList: React.FC = () => {
  const frame = useCurrentFrame();
  const end = T.thats1 - 2;
  if (frame > end + 10) return null;
  const out = interpolate(frame, [end, end + 10], [0, 1], clamp);
  const items = [
    { t: "fax paper", icon: I.fax, a: T.fax - 3, slot: [110, 236] },
    { t: "voicemail", icon: I.voicemail, a: T.voicemail - 3, slot: [405, 236] },
    { t: "& prayer", icon: I.prayer, a: T.prayer - 3, slot: [710, 236] },
  ];
  const title = sp(frame, 0, 16, 160);
  return (
    <AbsoluteFill style={{ opacity: 1 - out, filter: out > 0 ? `blur(${out * 10}px)` : undefined }}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 150, textAlign: "center", ...TYPE, fontSize: 52, color: W, textShadow: SOFT, opacity: title, translate: `0px ${(1 - title) * 14}px` }}>
        your referral <span style={{ color: YELLOW }}>process</span> =
      </div>
      {items.map((it) => {
        if (frame < it.a) return null;
        // born on his hand (the counting finger, then the praying palms), flies to its slot
        const [hx, hy] = handOut(it.a + 2, "high", "index", 2);
        const k = ramp(frame, it.a, it.a + 12, easeOut);
        const pop = sp(frame, it.a, 11, 220);
        const x = lerp(hx - 140, it.slot[0], k);
        const y = lerp(hy - 50, it.slot[1], k) - Math.sin(k * Math.PI) * 60;
        return (
          <div key={it.t} style={{ position: "absolute", left: x, top: y, scale: String(0.4 + 0.6 * pop) }}>
            <Chip icon={it.icon} text={it.t} />
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

/** "That's a hostage situation.": a red stamp slams down as his hands go up. */
const HostageStamp: React.FC = () => {
  const frame = useCurrentFrame();
  const from = T.hostage - 2;
  const { out, on } = win(frame, from, T.every1 - 4, 8);
  if (!on) return null;
  const s = sp(frame, from, 9, 230);
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: 150, display: "flex", justifyContent: "center", opacity: Math.min(1, s * 2) * (1 - out), filter: out > 0 ? `blur(${out * 8}px)` : undefined }}>
      <div style={{ padding: "12px 30px", border: `8px solid ${RED}`, color: RED, borderRadius: 16, ...TYPE, letterSpacing: "0.01em", fontSize: 84, lineHeight: 0.95, textAlign: "center", rotate: "-8deg", scale: String(interpolate(s, [0, 1], [2.4, 1])), background: "rgba(255,255,255,0.9)", boxShadow: "0 20px 50px rgba(10,6,24,0.4)" }}>
        HOSTAGE
        <br />
        SITUATION
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------------------------------
// 1  the mess: graphics on his gestures

const SWEEP = T.now; // "Now, check out ToothReferral": he sweeps the mess away
const swept = (frame: number) => ramp(frame, SWEEP, SWEEP + 12, (t) => t * t);
const sweptStyle = (frame: number, dir = -1): React.CSSProperties => {
  const k = swept(frame);
  return { translate: `${dir * k * 1100}px ${-k * 80}px`, rotate: `${dir * k * 18}deg`, opacity: 1 - ramp(frame, SWEEP + 6, SWEEP + 12), filter: k > 0.05 ? `blur(${k * 14}px)` : undefined };
};

/** "An email here": the email that never had the attachment. Comes off his gesturing hand. */
const EmailCard: React.FC = () => {
  const frame = useCurrentFrame();
  const from = T.email - 4;
  if (frame < from || frame > SWEEP + 14) return null;
  const p = sp(frame, from, 14, 170);
  const [hx, hy] = handOut(from + 4, "right", "palm");
  const x = lerp(hx - 160, 40, p);
  const y = lerp(hy - 120, 560, p);
  const dim = ramp(frame, T.hell, T.hell + 10) * 0.45;
  return (
    <div style={{ position: "absolute", left: x, top: y, width: 330, rotate: "-4deg", scale: String(0.5 + 0.5 * p), opacity: Math.min(1, p * 2) * (1 - dim), ...sweptStyle(frame) }}>
      <div style={{ ...CARD, borderRadius: 18, padding: "14px 18px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Icon d={I.mail} size={26} color={TR.purple} />
          <div style={{ fontSize: 20, fontWeight: 800 }}>Re: Re: FW: referral</div>
        </div>
        <div style={{ fontSize: 17, color: "#6B7085", marginTop: 6 }}>pls see attached x-ray</div>
        <div style={{ marginTop: 8, display: "inline-block", padding: "4px 10px", borderRadius: 8, background: "#FDE8E8", color: TR.red, fontSize: 16, fontWeight: 800 }}>0 attachments</div>
      </div>
    </div>
  );
};

/** "A call there": ringing bubble at the hand he holds to his ear; ends in voicemail. */
const PhoneBubble: React.FC = () => {
  const frame = useCurrentFrame();
  const from = T.call - 4;
  if (frame < from || frame > SWEEP + 14) return null;
  const p = sp(frame, from, 12, 200);
  // follows the phone hand while it is up, then stays where it was
  const [hx, hy] = handOut(Math.min(frame, T.note - 6), "high", "palm", 3);
  const shake = frame < T.note ? Math.sin(frame * 2.2) * 3 : 0;
  const vm = frame >= T.call + 14;
  const dim = ramp(frame, T.hell, T.hell + 10) * 0.45;
  return (
    <div style={{ position: "absolute", left: Math.min(hx + 40, 690), top: hy - 210, scale: String(p), opacity: Math.min(1, p * 2) * (1 - dim), rotate: `${shake}deg`, ...sweptStyle(frame, 1) }}>
      <Chip icon={I.phone} text={vm ? "voicemail…" : "ring… ring…"} color={vm ? RED : "#7EE2A8"} />
    </div>
  );
};

/** "A sticky note somewhere": a sticky note slapped exactly where his palm hits the glass. Stays on the glass. */
const StickyNote: React.FC = () => {
  const frame = useCurrentFrame();
  const from = T.note - 6;
  if (frame < from || frame > SWEEP + 14) return null;
  const s = sp(frame, from, 10, 260);
  const [hx, hy] = handOut(from + 3, "high", "palm", 2);
  const dim = ramp(frame, T.hell, T.hell + 10) * 0.35;
  return (
    <div style={{ position: "absolute", left: hx - 135, top: hy - 135, width: 270, height: 250, rotate: "-7deg", scale: String(interpolate(s, [0, 1], [1.5, 1])), opacity: Math.min(1, s * 2.5) * (1 - dim), ...sweptStyle(frame, -1) }}>
      <div style={{ width: "100%", height: "100%", background: "#FFE874", borderRadius: 6, boxShadow: "0 18px 40px rgba(10,6,24,0.35), inset 0 -18px 30px rgba(180,140,0,0.12)", padding: "26px 22px", fontFamily: FONT_UI, color: "#2B2600" }}>
        <div style={{ fontSize: 30, fontWeight: 800, lineHeight: 1.1, fontStyle: "italic", letterSpacing: "-0.02em" }}>referral pt??</div>
        <div style={{ fontSize: 24, fontWeight: 700, marginTop: 10, fontStyle: "italic" }}>call Dr. ___ back</div>
        <div style={{ fontSize: 22, fontWeight: 700, marginTop: 8, fontStyle: "italic", opacity: 0.7 }}>(which Dr?)</div>
      </div>
    </div>
  );
};

/** "Hell, the patient just waits": a clock on the wrist he taps; the rest of the mess dims behind it. */
const WaitClock: React.FC = () => {
  const frame = useCurrentFrame();
  const from = T.hell - 2;
  if (frame < from || frame > SWEEP + 14) return null;
  const p = sp(frame, from, 13, 190);
  const [hx, hy] = handOut(from + 6, "low", "palm", 3);
  const days = Math.min(21, 3 + Math.floor((frame - from) / 2));
  return (
    <div style={{ position: "absolute", left: Math.max(30, Math.min(hx - 200, 600)), top: Math.min(hy - 300, 1200), scale: String(p), opacity: Math.min(1, p * 2), ...sweptStyle(frame, 1) }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 24px 14px 16px", borderRadius: 999, background: "rgba(16,12,30,0.88)", border: "1.5px solid rgba(255,255,255,0.16)", boxShadow: "0 14px 34px rgba(10,6,24,0.4)" }}>
        <svg width={48} height={48} viewBox="0 0 48 48">
          <circle cx={24} cy={24} r={20} fill="none" stroke={W} strokeWidth={4} />
          <line x1={24} y1={24} x2={24 + 13 * Math.sin((frame - from) * 0.5)} y2={24 - 13 * Math.cos((frame - from) * 0.5)} stroke={YELLOW} strokeWidth={4} strokeLinecap="round" />
          <line x1={24} y1={24} x2={24} y2={14} stroke={W} strokeWidth={4} strokeLinecap="round" />
        </svg>
        <div style={{ fontFamily: FONT_UI, color: W }}>
          <div style={{ fontSize: 30, fontWeight: 800, letterSpacing: "-0.02em" }}>patient waiting…</div>
          <div style={{ fontSize: 22, color: "rgba(255,255,255,0.65)", fontVariantNumeric: "tabular-nums" }}>day {days}</div>
        </div>
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------------------------------
// 2..4  the dashboard panel

const PW = 1032;
const ZOOM = 1.34; // the rebuilt dashboard cards, scaled up so they read on a phone
const PH = PANEL - 48;
type Crop = { x: number; y: number; w: number };
/** Maps source px of a dashboard still to panel px for a crop. */
const mapper = (c: Crop) => {
  const s = PW / c.w;
  return (x: number, y: number) => [(x - c.x) * s, (y - c.y) * s] as const;
};
const lerpCrop = (a: Crop, b: Crop, k: number): Crop => ({ x: lerp(a.x, b.x, k), y: lerp(a.y, b.y, k), w: lerp(a.w, b.w, k) });

/** One shot of the panel: a still from the screen recording, slowly pushing from one crop to another, with
 *  overlays placed in the still's own pixels. Fades and de-blurs in, so shots dissolve into each other. */
const Shot: React.FC<{ img: string; from: number; to: number; a: Crop; b: Crop; dim?: number; children?: (m: (x: number, y: number) => readonly [number, number], s: number) => React.ReactNode }> = ({ img, from, to, a, b, dim = 0, children }) => {
  const frame = useCurrentFrame();
  if (frame < from - 1 || frame > to + 9) return null;
  const k = easeIO(interpolate(frame, [from, to + 9], [0, 1], clamp));
  const c = lerpCrop(a, b, k);
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
const Hl: React.FC<{ box: number[]; m: (x: number, y: number) => readonly [number, number]; k: number; color?: string; label?: string; labelSide?: "top" | "bottom"; fill?: boolean; dx?: number }> = ({ box, m, k, color = TR.purple, label, labelSide = "top", fill = true, dx = -4 }) => {
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

/** A click: a ring that expands and fades at a source point. */
const Tap: React.FC<{ x: number; y: number; at: number; m: (x: number, y: number) => readonly [number, number] }> = ({ x, y, at, m }) => {
  const frame = useCurrentFrame();
  if (frame < at - 8 || frame > at + 18) return null;
  const [px, py] = m(x, y);
  const k = ramp(frame, at, at + 16, easeOut);
  const press = frame < at ? 1 : 1 - 0.18 * Math.sin(Math.min(1, (frame - at) / 6) * Math.PI);
  return (
    <>
      <div style={{ position: "absolute", left: px - 40, top: py - 40, width: 80, height: 80, borderRadius: 40, border: `5px solid ${TR.purple}`, scale: String(0.3 + k * 1.4), opacity: frame < at ? 0 : 1 - k }} />
      <svg width={44} height={52} viewBox="0 0 22 26" style={{ position: "absolute", left: px - 4, top: py - 2, scale: String(press), filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.35))", opacity: ramp(frame, at - 8, at - 3) }}>
        <path d="M2 2 L2 20 L7 15 L11 24 L14 22.5 L10 14 L17 14 Z" fill={W} stroke={INK} strokeWidth={1.6} strokeLinejoin="round" />
      </svg>
    </>
  );
};

/** Green "connected" dots: pulsing rings. */
const Pulse: React.FC<{ x: number; y: number; at: number; m: (x: number, y: number) => readonly [number, number] }> = ({ x, y, at, m }) => {
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

/** "...and referrals just flow in": new referral cards stream into the panel. */
const FlowIn: React.FC = () => {
  const frame = useCurrentFrame();
  const cards = [
    { n: "Maria Lopez", o: "Oral Surgery Associates", i: "ML", c: "#2F9E6E", a: T.referrals - 4 },
    { n: "James Park", o: "R Dental", i: "JP", c: "#3B6FE0", a: T.referrals + 6 },
    { n: "Ava Chen", o: "Holland General", i: "AC", c: "#C2410C", a: T.flow - 2 },
  ];
  const out = ramp(frame, T.click - 12, T.click - 2);
  return (
    <AbsoluteFill style={{ opacity: 1 - out }}>
      {cards.map((cd, i) => {
        const k = sp(frame, cd.a, 14, 170);
        if (k <= 0) return null;
        // newest on top: each later card pushes the earlier ones down
        const below = cards.filter((x, j) => j > i && frame >= x.a).reduce((s, x) => s + sp(frame, x.a, 14, 170), 0);
        return (
          <div key={cd.n} style={{ position: "absolute", left: 120, top: 150 + below * 150, width: 790, translate: `0px ${(1 - k) * -220}px`, opacity: Math.min(1, k * 2) }}>
            <div style={{ ...CARD, borderRadius: 22, padding: "20px 24px", display: "flex", alignItems: "center", gap: 18, boxShadow: "0 22px 50px rgba(30,16,80,0.35)" }}>
              <div style={{ width: 62, height: 62, borderRadius: 31, background: cd.c, color: W, fontSize: 24, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center" }}>{cd.i}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 30, fontWeight: 800, letterSpacing: "-0.02em" }}>{cd.n}</div>
                <div style={{ fontSize: 22, color: "#6B7085", display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ width: 12, height: 12, borderRadius: 6, background: "#22C55E" }} />
                  from {cd.o}
                </div>
              </div>
              <div style={{ padding: "8px 18px", borderRadius: 999, background: TR.purpleSoft, color: TR.purple, fontSize: 22, fontWeight: 800 }}>New</div>
            </div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

/** The office chat: "Message the referring office right inside the case. They answer." */
const ChatCard: React.FC = () => {
  const frame = useCurrentFrame();
  const typed = "Can you send me a different x-ray?";
  const t0 = T.message - 2;
  const n = Math.max(0, Math.min(typed.length, Math.floor((frame - t0) * 1.6)));
  const sent = frame >= t0 + typed.length / 1.6 + 4;
  const sentK = sp(frame, Math.round(t0 + typed.length / 1.6 + 4), 14, 200);
  const typing = frame >= T.they - 16 && frame < T.they;
  const reply = sp(frame, T.they, 13, 190);
  const badge = sp(frame, T.adults - 2, 12, 220);
  const bubble = (who: string, org: string, text: React.ReactNode, mine: boolean, k: number, extra?: React.ReactNode) => (
    <div style={{ display: "flex", gap: 14, marginTop: 18, opacity: Math.min(1, k * 2), translate: `0px ${(1 - k) * 24}px` }}>
      <div style={{ width: 54, height: 54, borderRadius: 27, flexShrink: 0, background: mine ? TR.purpleSoft : "#FCE7D6", color: mine ? TR.purple : "#B4541C", fontWeight: 800, fontSize: 21, display: "flex", alignItems: "center", justifyContent: "center" }}>{mine ? "LD" : "SC"}</div>
      <div style={{ flex: 1, padding: "14px 18px", borderRadius: 18, background: mine ? "#F6F4FB" : TR.purpleSoft }}>
        <div style={{ fontSize: 21, fontWeight: 800 }}>
          {who} <span style={{ fontWeight: 600, color: "#8A8799" }}>· {org}</span>
        </div>
        <div style={{ fontSize: 27, marginTop: 4, letterSpacing: "-0.01em" }}>{text}</div>
        {extra}
      </div>
    </div>
  );
  return (
    <AbsoluteFill style={{ padding: "34px 40px", background: TR.bg }}>
      <div style={{ ...CARD, position: "relative", zoom: ZOOM, padding: "26px 30px", height: `${100 / ZOOM}%`, boxShadow: "0 10px 30px rgba(30,16,80,0.12)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Icon d={ICON.chat} size={32} color={TR.purple} />
          <div style={{ fontSize: 32, fontWeight: 800, letterSpacing: "-0.02em" }}>Office Communication</div>
        </div>
        <div style={{ fontSize: 22, color: "#6B7085", marginTop: 4 }}>Bob Smith · messaging with Oral Surgery Associates</div>
        <div style={{ display: "inline-block", marginTop: 10, padding: "6px 14px", borderRadius: 999, background: TR.purple, color: W, fontSize: 19, fontWeight: 800 }}>inside the referral, saved with the patient</div>
        {sent && bubble("Lee Davis", "D Care Alliance", typed, true, sentK)}
        {typing && (
          <div style={{ display: "flex", gap: 8, marginTop: 22, marginLeft: 70 }}>
            {[0, 1, 2].map((d) => (
              <div key={d} style={{ width: 14, height: 14, borderRadius: 7, background: "#A3A8BA", translate: `0px ${-6 * Math.max(0, Math.sin((frame + d * 4) / 3))}px` }} />
            ))}
          </div>
        )}
        {reply > 0 &&
          bubble(
            "Sarah Chen, DDS",
            "Oral Surgery Associates",
            <>
              <span style={{ color: TR.purple, fontWeight: 700 }}>@Lee Davis</span> Sure, I can. New one attached.
            </>,
            false,
            reply,
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 10, padding: "8px 12px", borderRadius: 12, background: W, width: "fit-content", border: "1.5px solid #E7E3F7" }}>
              <Icon d={ICON.clip} size={22} color={TR.purple} />
              <div style={{ fontSize: 21, fontWeight: 700 }}>panoramic-xray-2.jpg</div>
            </div>,
          )}
        {/* typing field */}
        <div style={{ position: "absolute", left: 30, right: 30, bottom: 26, height: 64, borderRadius: 14, border: "2px solid #E7E8EE", display: "flex", alignItems: "center", padding: "0 18px", fontSize: 25, opacity: 1 - sentK, color: sent || n === 0 ? "#A3A8BA" : INK }}>
          {sent || n === 0 ? "Message Oral Surgery Associates" : typed.slice(0, n)}
          {!sent && n > 0 && <div style={{ width: 3, height: 30, background: TR.purple, marginLeft: 2, opacity: Math.floor(frame / 8) % 2 ? 1 : 0.2 }} />}
        </div>
        {badge > 0 && (
          <div style={{ position: "absolute", right: 28, top: 26, padding: "10px 18px", borderRadius: 999, background: TR.greenSoft, color: "#137A4B", fontSize: 23, fontWeight: 800, scale: String(badge), display: "flex", alignItems: "center", gap: 8 }}>
            <Icon d={ICON.check} size={22} color="#137A4B" />
            answered in 2 min
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};

/** "Update the status, schedule the consult, and the GP is notified." */
const StatusCard: React.FC = () => {
  const frame = useCurrentFrame();
  const pick = frame >= T.update + 8;
  const press1 = sp(frame, T.update + 8, 10, 260);
  const sched = sp(frame, T.schedule, 12, 220);
  const toast = sp(frame, T.notified - 6, 14, 170);
  const fly = ramp(frame, T.notified - 2, T.notified + 18, easeIO);
  const steps = ["New", "Consultation Scheduled"];
  return (
    <AbsoluteFill style={{ padding: "34px 40px", background: TR.bg }}>
      <div style={{ ...CARD, position: "relative", zoom: ZOOM, padding: "26px 32px", height: `${100 / ZOOM}%`, boxShadow: "0 10px 30px rgba(30,16,80,0.12)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Icon d={ICON.calendar} size={32} color={TR.purple} />
          <div style={{ fontSize: 32, fontWeight: 800, letterSpacing: "-0.02em" }}>Status &amp; Schedule</div>
        </div>
        <div style={{ fontSize: 22, color: "#6B7085", marginTop: 4 }}>Bob Smith · referred by Oral Surgery Associates</div>
        <div style={{ display: "flex", gap: 16, marginTop: 26, alignItems: "center" }}>
          <div style={{ flex: 1, height: 74, borderRadius: 14, border: `2.5px solid ${pick ? TR.purple : "#E7E8EE"}`, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 22px", fontSize: 28, fontWeight: 700, background: pick ? TR.purpleSoft : W }}>
            <span style={{ display: "inline-block", translate: `0px ${pick ? (1 - press1) * 18 : 0}px`, opacity: pick ? press1 : 1 }}>{pick ? steps[1] : steps[0]}</span>
            <span style={{ fontSize: 22 }}>▾</span>
          </div>
          <div style={{ height: 74, padding: "0 26px", borderRadius: 14, background: pick ? TR.purple : W, color: pick ? W : TR.purple, border: `2.5px solid ${TR.purple}`, display: "flex", alignItems: "center", fontSize: 26, fontWeight: 800, scale: String(1 - 0.06 * Math.sin(Math.min(1, press1) * Math.PI)) }}>Update Status</div>
        </div>
        {/* schedule */}
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 24, opacity: Math.min(1, sched * 2), translate: `0px ${(1 - sched) * 20}px` }}>
          <div style={{ width: 70, height: 70, borderRadius: 16, background: TR.purpleSoft, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Icon d={ICON.calendar} size={34} color={TR.purple} />
          </div>
          <div>
            <div style={{ fontSize: 28, fontWeight: 800 }}>Consult booked · Thu 10:30 AM</div>
            <div style={{ fontSize: 22, color: "#6B7085" }}>Dr. Lee Davis · D Care Alliance</div>
          </div>
        </div>
        {/* GP notified: a dot flies from the card to the referring office */}
        <div style={{ position: "absolute", left: 30, right: 30, bottom: 26, display: "flex", alignItems: "center", gap: 14, padding: "16px 20px", borderRadius: 18, background: "#F6F4FB", opacity: Math.min(1, toast * 2) }}>
          <div style={{ width: 58, height: 58, borderRadius: 29, background: "#FCE7D6", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
            <Icon d={I.bell} size={30} color="#B4541C" />
            <div style={{ position: "absolute", right: -2, top: -2, width: 20, height: 20, borderRadius: 10, background: TR.red, scale: String(sp(frame, T.notified + 12, 9, 260)) }} />
          </div>
          <div>
            <div style={{ fontSize: 25, fontWeight: 800 }}>Oral Surgery Associates</div>
            <div style={{ fontSize: 21, color: "#6B7085" }}>notified: Bob Smith's consult is scheduled</div>
          </div>
        </div>
        {fly > 0 && fly < 1 && <div style={{ position: "absolute", left: lerp(600, 70, fly), top: lerp(130, 420, fly) - Math.sin(fly * Math.PI) * 120, width: 24, height: 24, borderRadius: 12, background: TR.purple, boxShadow: `0 0 20px ${TR.purple}` }} />}
      </div>
      {/* the real success toast */}
      <div style={{ position: "absolute", left: 70, right: 70, top: 40, padding: "20px 28px", borderRadius: 20, background: "#EAFBF1", border: "2px solid #BDEBD0", boxShadow: "0 18px 44px rgba(20,60,40,0.25)", fontFamily: FONT_UI, translate: `0px ${(1 - toast) * -220}px`, opacity: Math.min(1, toast * 2) }}>
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
  const S2 = T.each - 4;
  const S3 = T.build - 6;
  const S4 = T.click - 8;
  const S5 = T.click + 10;
  const SB1 = TB[0];
  const SB2 = T.update - 10;
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
      {/* the list: every referral, every office, one list */}
      <Shot img="rec-2.jpg" from={S1} to={S2} a={{ x: 330, y: 0, w: 1180 }} b={LIST}>
        {(m) => (
          <>
            {rows.map((r, i) => (
              <Hl key={i} box={r} m={m} k={sp(frame, T.every2 + i * 5, 14, 200) * (1 - ramp(frame, T.from - 2, T.from + 4))} fill />
            ))}
            {offices.map((r, i) => (
              <Hl key={i} box={r} m={m} k={sp(frame, T.from + i * 6, 13, 220) * (1 - ramp(frame, T.lands - 2, T.lands + 4))} color="#1FA463" label={i === 0 ? "every office" : undefined} />
            ))}
            <Hl box={[392, 380, 1440, 790]} m={m} k={sp(frame, T.lands, 12, 180)} color={YELLOW} fill={false} label="one list" labelSide="top" />
          </>
        )}
      </Shot>
      {/* green dots: connected offices */}
      <Shot img="rec-2.jpg" from={S2} to={S3} a={{ x: 360, y: 290, w: 700 }} b={{ x: 372, y: 300, w: 600 }}>
        {(m) => (
          <>
            <Hl box={[388, 316, 620, 340]} m={m} k={sp(frame, T.green - 2, 13, 200)} color="#1FA463" label="connected network member" labelSide="bottom" />
            {[
              [396, 328],
              [797, 476],
              [797, 592],
              [797, 720],
              [797, 799],
            ].map(([x, y], i) => (
              <Pulse key={i} x={x} y={y} at={T.green + i * 3} m={m} />
            ))}
          </>
        )}
      </Shot>
      {/* build the network once: invite, then referrals flow in */}
      <Shot img="rec-2.jpg" from={S3} to={S4} a={{ x: 700, y: 0, w: 800 }} b={LIST} dim={ramp(frame, T.referrals - 8, T.referrals) * 0.55}>
        {(m) => (
          <>
            <Hl box={[1232, 22, 1460, 74]} m={m} k={sp(frame, T.build, 13, 200) * (1 - ramp(frame, T.referrals - 8, T.referrals))} label="build it once" labelSide="bottom" />
            <Tap x={1345} y={48} at={T.build + 8} m={m} />
          </>
        )}
      </Shot>
      {frame >= S3 && frame < S5 + 4 && <FlowIn />}
      {/* "Click one." */}
      <Shot img="rec-2.jpg" from={S4} to={S5} a={LIST} b={{ x: 900, y: 380, w: 900 }}>
        {(m) => <Tap x={1697} y={500} at={T.click + 2} m={m} />}
      </Shot>
      {/* the referral: diagnosis, tooth numbers, what they want done */}
      <Shot img="rec-61.5.jpg" from={S5} to={SB1 + 6} a={{ x: 380, y: 150, w: 840 }} b={{ x: 392, y: 196, w: 760 }}>
        {(m) => (
          <>
            <Hl box={[444, 358, 528, 388]} m={m} k={sp(frame, T.diagnosis - 2, 12, 220)} label="diagnosis" labelSide="bottom" dx={-70} />
            <Hl box={[530, 358, 614, 388]} m={m} k={sp(frame, T.numbers - 6, 12, 220)} color="#1FA463" label="tooth #s" labelSide="bottom" dx={60} />
            <Hl box={[398, 306, 1286, 344]} m={m} k={sp(frame, T.what - 2, 12, 220)} color="#E89D15" label="what they want done" labelSide="top" />
            <Magnifier m={m} />
          </>
        )}
      </Shot>
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

/** "No detective work is required": a lens slides over the x-ray and finds everything already there. */
const Magnifier: React.FC<{ m: (x: number, y: number) => readonly [number, number] }> = ({ m }) => {
  const frame = useCurrentFrame();
  const from = T.detective - 6;
  if (frame < from) return null;
  const k = ramp(frame, from, from + 22, easeIO);
  const [ax, ay] = m(470, 700);
  const [bx, by] = m(620, 716);
  const x = lerp(ax, bx, k);
  const y = lerp(ay, by, k);
  const done = sp(frame, from + 24, 11, 230);
  return (
    <>
      <div style={{ position: "absolute", left: x - 80, top: y - 80, width: 160, height: 160, borderRadius: 80, border: `10px solid ${INK}`, background: "rgba(255,255,255,0.18)", boxShadow: "0 14px 30px rgba(0,0,0,0.35), inset 0 0 30px rgba(255,255,255,0.5)", opacity: ramp(frame, from, from + 6) * (1 - done) }}>
        <div style={{ position: "absolute", left: 130, top: 130, width: 90, height: 22, borderRadius: 11, background: INK, rotate: "45deg", transformOrigin: "0 50%" }} />
      </div>
      {done > 0 && (
        <div style={{ position: "absolute", left: x - 150, top: y - 40, padding: "14px 24px", borderRadius: 999, background: "#1FA463", color: W, fontFamily: FONT_UI, fontWeight: 800, fontSize: 32, display: "flex", alignItems: "center", gap: 10, scale: String(done), boxShadow: "0 14px 30px rgba(0,0,0,0.3)" }}>
          <Icon d={ICON.check} size={30} color={W} />
          case closed
        </div>
      )}
    </>
  );
};

// ---------------------------------------------------------------------------------------------------
// 4  the zeros on his O-hands (split B: him on top)

const Zeros: React.FC<{ lay: Lay }> = ({ lay }) => {
  const frame = useCurrentFrame();
  const z = [
    { a: T.zero1 - 2, label: "phone tag" },
    { a: T.zero2 - 2, label: "“just checking in”" },
  ];
  const end = T.thats3 - 10;
  if (frame < z[0].a || frame > end + 8) return null;
  const out = ramp(frame, end, end + 8);
  return (
    <AbsoluteFill style={{ opacity: 1 - out }}>
      {z.map((it, i) => {
        const k = sp(frame, it.a, 11, 220);
        if (k <= 0) return null;
        // ride the O made by his hand (left O first, then right), frozen at the moment it forms
        const [sx, sy] = handSrc(it.a + 4, i === 0 ? "left" : "right", "palm", 2);
        const x = sx * 1.5;
        const y = sy * 1.5 + lay.y;
        return (
          <div key={i} style={{ position: "absolute", left: x - 70, top: Math.min(y - 70, lay.bottom - 150), width: 140, height: 140, borderRadius: 70, border: `10px solid ${YELLOW}`, display: "flex", alignItems: "center", justifyContent: "center", ...TYPE, fontSize: 92, color: YELLOW, textShadow: SOFT, boxShadow: "0 0 40px rgba(243,221,114,0.45)", scale: String(k) }}>0</div>
        );
      })}
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------------------------------
// 5  the close

const NODES = [
  { t: "GP office", x: 150, y: 330 },
  { t: "Oral Surgery", x: 905, y: 300 },
  { t: "R Dental", x: 140, y: 560 },
  { t: "Holland General", x: 920, y: 560 },
];

/** "That's what a referral network should feel like": offices behind him wire into his interlocked hands, then to
 *  each other as his hands open ("connected offices, one place, and nobody left guessing"). */
const Network: React.FC = () => {
  const frame = useCurrentFrame();
  const from = T.thats3 + 2;
  const { p, out, on } = win(frame, from, T.want - 6, 10);
  if (!on) return null;
  const [hx, hy] = handOut(T.thats3 + 20, "low", "palm", 4);
  const hub = [hx, hy];
  const spread = ramp(frame, T.connected2 - 4, T.connected2 + 14, easeIO);
  const ring = ramp(frame, T.connected2 + 4, T.place, easeIO);
  const sure = (i: number) => sp(frame, T.nobody + i * 4, 12, 220);
  return (
    <AbsoluteFill style={{ opacity: Math.min(1, p * 1.5) * (1 - out), filter: out > 0 ? `blur(${out * 8}px)` : undefined }}>
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        {NODES.map((n, i) => {
          const k = ramp(frame, from + i * 4, from + i * 4 + 16, easeOut);
          return <line key={i} x1={n.x} y1={n.y} x2={lerp(n.x, hub[0], k * (1 - spread))} y2={lerp(n.y, hub[1], k * (1 - spread))} stroke="rgba(255,255,255,0.55)" strokeWidth={4} strokeDasharray="10 10" strokeDashoffset={-frame * 2} />;
        })}
        {[0, 1, 3, 2].map((a, i, arr) => {
          const b = arr[(i + 1) % arr.length];
          return <line key={`r${i}`} x1={NODES[a].x} y1={NODES[a].y} x2={lerp(NODES[a].x, NODES[b].x, ring)} y2={lerp(NODES[a].y, NODES[b].y, ring)} stroke={YELLOW} strokeWidth={5} strokeLinecap="round" opacity={0.9} />;
        })}
        {[0, 1, 2, 3].map((i) => {
          const t = (((frame - T.connected2) / 30 + i / 4) % 1 + 1) % 1;
          const a = NODES[[0, 1, 3, 2][i]];
          const b = NODES[[1, 3, 2, 0][i]];
          return ring > 0.98 ? <circle key={`d${i}`} cx={lerp(a.x, b.x, t)} cy={lerp(a.y, b.y, t)} r={9} fill={W} /> : null;
        })}
      </svg>
      {NODES.map((n, i) => {
        const k = sp(frame, from + i * 4, 13, 200);
        const s = sure(i);
        return (
          <div key={n.t} style={{ position: "absolute", left: n.x, top: n.y, translate: "-50% -50%", scale: String(k), display: "flex", alignItems: "center", gap: 10, padding: "12px 20px 12px 12px", borderRadius: 999, background: W, boxShadow: "0 14px 34px rgba(10,6,24,0.4)", fontFamily: FONT_UI, whiteSpace: "nowrap" }}>
            <div style={{ width: 40, height: 40, borderRadius: 20, background: s > 0.5 ? "#1FA463" : TR.purpleSoft, display: "flex", alignItems: "center", justifyContent: "center" }}>
              {s > 0.5 ? <Icon d={ICON.check} size={22} color={W} /> : <Icon d={I.building} size={22} color={TR.purple} />}
            </div>
            <div style={{ fontSize: 27, fontWeight: 800, color: INK, letterSpacing: "-0.02em" }}>{n.t}</div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

/** "Want to see it for yourself?": ripples off the finger he points at the lens. */
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

/** "Check out ToothReferral": the logo and the link rise behind his head as he points. */
const CtaLogo: React.FC = () => {
  const frame = useCurrentFrame();
  const from = T.check2 - 4;
  const { p, out, on } = win(frame, from, CUT_FRAMES - 4, 9);
  if (!on) return null;
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: 70, display: "flex", justifyContent: "center", opacity: Math.min(1, p * 1.5) * (1 - out), translate: `0px ${(1 - p) * 60}px`, filter: "drop-shadow(0 4px 18px rgba(8,4,24,0.55))" }}>
      <Sequence from={from} layout="none">
        <LogoReveal at={0} width={440} revealDur={18} shineDur={28} />
      </Sequence>
    </div>
  );
};

/** The link, rising off the finger he points down with. */
const CtaLink: React.FC = () => {
  const frame = useCurrentFrame();
  const from = T.check2 - 2;
  const { p, out, on } = win(frame, from, CUT_FRAMES - 4, 9);
  if (!on) return null;
  const [hx, hy] = handOut(from, "high", "index", 3);
  const k = ramp(frame, from, from + 14, easeOut);
  const x = lerp(hx, 540, k);
  const y = lerp(hy, 1250, k);
  return (
    <div style={{ position: "absolute", left: x, top: y, translate: "-50% -50%", scale: String(interpolate(p, [0, 1], [0.4, 1])), opacity: Math.min(1, p * 2) * (1 - out), padding: "16px 34px", borderRadius: 999, background: YELLOW, color: INK, ...TYPE, letterSpacing: "-0.025em", fontSize: 44, boxShadow: "0 14px 34px rgba(10,6,24,0.45)", whiteSpace: "nowrap" }}>toothreferral.com</div>
  );
};

/** "...start connecting your referral network": offices on the two fingertips he draws the line between. */
const FingerOffices: React.FC = () => {
  const frame = useCurrentFrame();
  const from = T.connecting - 4;
  const { p, out, on } = win(frame, from, T.connecting + 52, 8);
  if (!on) return null;
  // pinned to the fingertips while the drawn line is up (the tracker swaps hands once they drop)
  const fh = Math.max(T.connecting + 12, Math.min(frame, T.connecting + 42));
  const a = handOut(fh, "left", "index", 3);
  const b = handOut(fh, "right", "index", 3);
  const node = (t: string, [x, y]: [number, number], c: string) => (
    <div style={{ position: "absolute", left: x, top: y - 70, translate: "-50% -100%", scale: String(p), padding: "10px 18px", borderRadius: 999, background: c, color: c === W ? INK : W, fontFamily: FONT_UI, fontWeight: 800, fontSize: 28, whiteSpace: "nowrap", boxShadow: "0 12px 28px rgba(10,6,24,0.4)" }}>{t}</div>
  );
  const t = (((frame - from) / 22) % 1 + 1) % 1;
  return (
    <AbsoluteFill style={{ opacity: Math.min(1, p * 1.5) * (1 - out) }}>
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        <circle cx={lerp(a[0], b[0], t)} cy={lerp(a[1], b[1], t) - 6} r={10} fill={YELLOW} style={{ filter: "drop-shadow(0 0 8px #F3DD72)" }} />
      </svg>
      {node("your office", a, TR.purple)}
      {node("GP office", b, W)}
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
      <div style={{ position: "absolute", left: 0, right: 0, top: 1030, textAlign: "center", opacity: url, ...TYPE, fontSize: 34, color: "rgba(255,255,255,0.7)", letterSpacing: "-0.02em", fontWeight: 700 }}>every office, one place</div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 1120, display: "flex", justifyContent: "center", opacity: Math.min(1, btn * 1.5), scale: String(interpolate(btn, [0, 1], [0.8, 1])) }}>
        <div style={{ padding: "22px 40px", borderRadius: 22, background: YELLOW, color: INK, ...TYPE, letterSpacing: "-0.03em", fontSize: 40, boxShadow: "0 16px 40px rgba(10,6,24,0.45)" }}>see it for yourself →</div>
      </div>
    </>
  );
};

// ---------------------------------------------------------------------------------------------------
// The edit

export const RefRoast: React.FC = () => {
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
  // the hostage stamp lands with a short shake
  const shake = frame >= T.hostage - 2 && frame < T.hostage + 8 ? Math.sin(frame * 3.1) * (T.hostage + 8 - frame) * 1.6 : 0;
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
                <BigWord from={T.thats1 - 2} to={T.hostage - 4} text="workflow" size={170} top={40} strikeAt={T.workflow + 6} />
                {frame >= T.tooth1 - 6 && frame < T.heres - 10 && (
                  <Sequence from={T.tooth1 - 6} layout="none">
                    <div style={{ position: "absolute", left: 0, right: 0, top: 120, display: "flex", justifyContent: "center", filter: "drop-shadow(0 4px 18px rgba(8,4,24,0.55))", opacity: 1 - ramp(frame, T.heres - 20, T.heres - 10) }}>
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
          <RoastList />
          <HostageStamp />
          <EmailCard />
          <PhoneBubble />
          <StickyNote />
          <WaitClock />
          <Zeros lay={lay} />
          <PointRipple />
          <CtaLink />
          <FingerOffices />
        </AbsoluteFill>
        {frame < CUT_FRAMES - 4 && <Captions lay={lay} />}
        <EndCard />
        <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 42%, transparent 55%, rgba(8,5,18,0.38) 100%)", pointerEvents: "none" }} />
      </FontGate>

      <Audio src={staticFile("audio/voice/rr-cut.wav")} volume={(f) => interpolate(f, [CUT_FRAMES - 4, CUT_FRAMES + 4], [1, 0], clamp)} />
      <Audio src={staticFile("audio/music/cb-bed.ogg")} volume={(f) => 0.07 * interpolate(f, [0, 20, RR_DURATION - 45, RR_DURATION - 1], [0, 1, 1, 0], clamp)} />
      {[
        { f: 0, s: "impact", v: 0.14 },
        { f: T.fax - 3, s: "pop-1", v: 0.13 },
        { f: T.voicemail - 3, s: "pop-2", v: 0.13 },
        { f: T.prayer - 3, s: "pop-3", v: 0.13 },
        { f: T.thats1 - 2, s: "whoosh-short", v: 0.1 },
        { f: T.workflow + 6, s: "click", v: 0.16 },
        { f: T.hostage - 2, s: "impact", v: 0.2 },
        { f: T.email - 4, s: "blip-1", v: 0.12 },
        { f: T.call - 4, s: "blip-2", v: 0.12 },
        { f: T.call + 6, s: "blip-2", v: 0.1 },
        { f: T.note - 6, s: "thud", v: 0.16 },
        { f: T.hell - 2, s: "tick-1", v: 0.12 },
        { f: SWEEP, s: "whoosh-long", v: 0.16 },
        { f: T.tooth1 - 6, s: "shimmer", v: 0.16 },
        { f: TA[0], s: "whoosh-short", v: 0.12 },
        { f: T.every2, s: "tick-2", v: 0.1 },
        { f: T.from, s: "tick-3", v: 0.1 },
        { f: T.lands, s: "pop-1", v: 0.12 },
        { f: T.green - 2, s: "chime", v: 0.1 },
        { f: T.build + 8, s: "click", v: 0.14 },
        { f: T.referrals - 4, s: "pop-1", v: 0.1 },
        { f: T.referrals + 6, s: "pop-2", v: 0.1 },
        { f: T.flow - 2, s: "pop-3", v: 0.1 },
        { f: T.click + 2, s: "click", v: 0.16 },
        { f: T.diagnosis - 2, s: "tick-4", v: 0.12 },
        { f: T.numbers - 6, s: "tick-5", v: 0.12 },
        { f: T.what - 2, s: "tick-6", v: 0.12 },
        { f: T.detective + 18, s: "chime", v: 0.12 },
        { f: TB[0], s: "whoosh-short", v: 0.12 },
        { f: T.they, s: "blip-3", v: 0.12 },
        { f: T.update + 8, s: "click", v: 0.14 },
        { f: T.schedule, s: "pop-2", v: 0.12 },
        { f: T.notified - 6, s: "chime", v: 0.14 },
        { f: T.zero1 - 2, s: "pop-1", v: 0.14 },
        { f: T.zero2 - 2, s: "pop-2", v: 0.14 },
        { f: TC[0], s: "whoosh-short", v: 0.12 },
        { f: T.thats3 + 2, s: "riser", v: 0.08 },
        { f: T.connected2, s: "shimmer", v: 0.12 },
        { f: T.want, s: "blip-1", v: 0.1 },
        { f: T.check2 - 4, s: "shimmer", v: 0.14 },
        { f: CUT_FRAMES - 6, s: "whoosh-long", v: 0.16 },
      ].map((x, i) => (
        <Sequence key={i} from={Math.max(0, x.f)} layout="none">
          <Audio src={staticFile(`audio/sfx/${x.s}.wav`)} volume={x.v} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
