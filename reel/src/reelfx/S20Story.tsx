/**
 * Script 20 "Did They Ever Send It?" — Gentle Dental (Greg, Barbara, Sarah, David) and St. Andrew's Family Dental
 * (Tanya, Amanda). 17 Google Flow clips cut into one take by scripts/build_s20_cut.py (silences trimmed, Sarah's
 * stray "On it" and the c05 phone ring removed, a held beat after "I'll hold"), person matte by scripts/matte_stream.py.
 *
 * Layers, back to front: footage · text-behind words · person cutout · 3D product cards and chips (y 960-1500) ·
 * captions (y >= 1580) · full-screen cutaways. Bands never overlap, so nothing covers a caption or a face.
 * The c08 glass-door glitch (cut 31.45-33.35 s) is under the full-screen "waiting" cutaway while Greg keeps talking.
 * Product screens: dash3c stills (approved demo names) + V2/V1 Drive frames (DocuSign done, insurance request, invite).
 */
import React from "react";
import { AbsoluteFill, Audio, Img, OffthreadVideo, Sequence, interpolate, spring, staticFile, useCurrentFrame } from "remotion";
import words from "../data/s20-words.json";
import edl from "../data/s20-edl.json";
import { FontGate } from "../effects";
import { FONT_DISPLAY, FONT_UI } from "../theme";
import { LogoReveal, easeIO, easeOut, ramp } from "../tr/motion";
import { ICON, Icon, TR, clamp } from "../tr/ui";

const FPS = 30;
const F = (s: number) => Math.round(s * FPS);
const CUT = F(edl.duration);
const END_AT = F(93.62);
export const S20_DURATION = END_AT + F(4.2);

const AMBER = "#FFB020";
const AMBER_DK = "#E89D15";
const PURPLE = "#8B5CF6";
const VIOLET = "#C4B5FD";
const GREEN = "#1FCA7A";
const INK = "#16131F";
const W = "#FFFFFF";
const SOFT = "0 2px 16px rgba(10,6,24,0.55), 0 1px 3px rgba(10,6,24,0.5)";

const sp = (frame: number, a: number, damping = 14, stiffness = 170) =>
  frame < a ? 0 : spring({ frame: frame - a, fps: FPS, config: { damping, stiffness, mass: 0.7 } });
/** 0 → 1 in, 1 → 0 out around [a, b] (frames). */
const life = (frame: number, a: number, b: number, inD = 10, outD = 8) =>
  Math.min(interpolate(frame, [a, a + inD], [0, 1], clamp), interpolate(frame, [b - outD, b], [1, 0], clamp));

// ---------------------------------------------------------------------------------------------------
// Camera: the 720x1280 cut fills 1080x1920 (x1.5); joins inside one clip alternate a small punch-in

type Seg = { clip: string; in: number; out: number; at: number; freeze?: number };
const SEG = (edl.segments as Seg[]).map((s) => ({ ...s, f0: F(s.at), f1: F(s.at + (s.freeze ?? s.out - s.in)) }));
const camera = (f: number) => {
  let i = SEG.findIndex((s) => f >= s.f0 && f < s.f1);
  if (i < 0) i = SEG.length - 1;
  const s = SEG[i];
  let run = 0;
  for (let k = i; k > 0 && SEG[k - 1].clip === s.clip; k--) run++;
  const drift = 0.018 * ramp(f, s.f0, s.f1, (t) => t);
  const hold = s.freeze ? 0.05 * ramp(f, s.f0, s.f1, easeIO) : 0;
  return 1.0 + (run % 2 ? 0.07 : 0) + drift + hold;
};
const Shot: React.FC<{ cutout?: boolean }> = ({ cutout }) => {
  const frame = useCurrentFrame();
  const sc = camera(Math.min(frame, CUT - 1));
  const style: React.CSSProperties = { position: "absolute", left: 0, top: 0, width: 1080, height: 1920, transform: `scale(${sc})`, transformOrigin: "50% 36%" };
  return cutout ? (
    <OffthreadVideo src={staticFile("cutouts/s20-cut.webm")} transparent muted style={style} />
  ) : (
    <OffthreadVideo src={staticFile("footage/s20-cut.mp4")} style={style} />
  );
};

// ---------------------------------------------------------------------------------------------------
// Captions: word by word, keywords in a vibrant pill

type Wd = { word: string; start: number; end: number };
const WORDS = (words as unknown as Record<string, { words: Wd[] }>)["cut.wav"].words;
const norm = (w: string) => w.toLowerCase().replace(/[^a-z0-9]/g, "");
const HOT: Record<string, string> = {
  twice: AMBER, crown: PURPLE, note: AMBER, hold: AMBER, minutes: AMBER, fax: AMBER, pile: AMBER, waits: AMBER, different: AMBER,
  happening: AMBER, messages: PURPLE, xrays: PURPLE, insurance: PURPLE, signed: PURPLE, case: PURPLE, invite: PURPLE, sent: GREEN,
  five: GREEN, toothreferral: PURPLE, anymore: GREEN, offices: PURPLE, conversation: PURPLE, here: PURPLE, fast: GREEN,
};
type Tok = { t: string; at: number; end: number; hot?: string };
const TOKS: Tok[] = (() => {
  const out: Tok[] = [];
  for (const w of WORDS) {
    let t = w.word.trim();
    if (/^(uh|-?huh\.?)$/i.test(t)) continue;
    const prev = out[out.length - 1];
    if (prev && t.startsWith("-")) { prev.t += t; prev.end = F(w.end); continue; }
    if (prev && prev.t.toLowerCase() === "tooth" && /^referral/i.test(t)) { prev.t = "Tooth Referral" + t.slice(8); prev.end = F(w.end); continue; }
    if (t === "Andrews" || t === "Andrews?") t = t.replace("Andrews", "Andrew's");
    if (t === "10") t = "ten";
    if (/^uh$/i.test(t)) continue;
    out.push({ t, at: F(w.start), end: F(w.end) });
  }
  return out.filter((x) => !/^-?huh/i.test(x.t));
})();
const CHUNKS = (() => {
  const chunks: { words: Tok[]; from: number; to: number }[] = [];
  let cur: Tok[] = [];
  const flush = () => { if (cur.length) chunks.push({ words: cur, from: cur[0].at - 2, to: cur[cur.length - 1].end + 12 }); cur = []; };
  for (const tk of TOKS) {
    const len = cur.map((x) => x.t).join(" ").length;
    if (cur.length && (cur.length >= 4 || len + tk.t.length > 20)) flush();
    cur.push(tk);
    if (/[.,?!]$/.test(tk.t)) flush();
  }
  flush();
  for (let i = 0; i < chunks.length - 1; i++) chunks[i].to = Math.min(chunks[i].to, chunks[i + 1].from);
  for (const c of chunks) { let n = 0; for (const w of c.words) { const h = HOT[norm(w.t)]; if (h && n === 0) { w.hot = h; n++; } } }
  return chunks;
})();

const Captions: React.FC = () => {
  const frame = useCurrentFrame();
  const c = CHUNKS.find((x) => frame >= x.from && frame < x.to);
  if (!c || frame >= END_AT) return null;
  const out = interpolate(frame, [c.to - 4, c.to], [0, 1], clamp);
  return (
    <div style={{ position: "absolute", left: 40, right: 40, top: 1600, textAlign: "center", fontFamily: FONT_UI, fontWeight: 800, letterSpacing: "-0.025em", lineHeight: 1.15, fontSize: 62, color: W, opacity: 1 - out, filter: out > 0 ? `blur(${out * 6}px)` : undefined }}>
      {c.words.map((w, i) => {
        const k = interpolate(frame, [w.at - 2, w.at + 3], [0, 1], clamp);
        const hot = w.hot && frame >= w.at;
        const pop = hot ? sp(frame, w.at, 9, 260) : 1;
        return (
          <span key={i} style={{
            display: "inline-block", marginRight: i < c.words.length - 1 ? "0.24em" : 0, opacity: k, translate: `0px ${(1 - k) * 14}px`,
            scale: String(hot ? 0.8 + 0.2 * pop : 1), filter: k < 1 ? `blur(${(1 - k) * 5}px)` : undefined,
            padding: hot ? "0.02em 0.2em 0.06em" : undefined, borderRadius: 16,
            background: hot ? `linear-gradient(135deg, ${w.hot}, ${w.hot === AMBER ? "#FFD36E" : w.hot === GREEN ? "#5EE6A8" : "#B48CFF"})` : undefined,
            color: hot ? (w.hot === PURPLE ? W : INK) : W, textShadow: hot ? "none" : SOFT,
            WebkitTextStroke: hot ? undefined : "9px rgba(12,8,26,0.62)", paintOrder: "stroke fill",
            boxShadow: hot ? `0 10px 30px ${w.hot}66` : undefined, rotate: hot ? "-2deg" : undefined,
          }}>
            {w.t}
          </span>
        );
      })}
    </div>
  );
};

// ---------------------------------------------------------------------------------------------------
// Text behind the people: huge gradient words between the footage and the person cutout

type Behind = { text: string; a: number; b: number; c1: string; c2: string; y?: number };
const BEHIND: Behind[] = [
  { text: "TWICE", a: 5.5, b: 7.5, c1: AMBER, c2: "#FFE08A" },
  { text: "CROWN\nDAY", a: 9.2, b: 11.2, c1: "#B48CFF", c2: W },
  { text: "NOT\nHERE", a: 20.45, b: 22.4, c1: AMBER, c2: "#FFE08A" },
  { text: "ON\nHOLD", a: 26.5, b: 29.8, c1: AMBER, c2: "#FFE08A" },
  { text: "FAX\nPILE", a: 44.15, b: 47.5, c1: AMBER, c2: "#FFE08A" },
  { text: "STILL\nWAITING", a: 52.25, b: 53.55, c1: AMBER, c2: "#FFE08A" },
  { text: "5\nMINUTES", a: 70.8, b: 72.95, c1: GREEN, c2: "#C9FFE4" },
  { text: "ALREADY\nHERE", a: 80.6, b: 82.7, c1: "#B48CFF", c2: W },
  { text: "TWO\nOFFICES", a: 90.0, b: 91.3, c1: "#B48CFF", c2: W },
  { text: "ONE\nCONVERSATION", a: 91.3, b: 93.6, c1: "#B48CFF", c2: W },
];
const BehindWords: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <>
      {BEHIND.map((b, i) => {
        const a = F(b.a), e = F(b.b);
        if (frame < a - 2 || frame > e) return null;
        const p = sp(frame, a, 12, 140);
        const o = life(frame, a, e, 6, 9);
        const longest = Math.max(...b.text.split("\n").map((l) => l.length));
        const size = Math.min(230, 900 / (Math.max(3, longest) * 0.78));
        const float = Math.sin((frame - a) / 14) * 6;
        return (
          <div key={i} style={{ position: "absolute", left: 0, right: 0, top: (b.y ?? 250) + float, display: "flex", justifyContent: "center", perspective: 900, opacity: o }}>
            <div style={{
              fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: size, letterSpacing: "-0.05em", lineHeight: 0.88, textAlign: "center", whiteSpace: "pre",
              backgroundImage: `linear-gradient(180deg, ${b.c2} 0%, ${b.c1} 70%)`, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent",
              filter: `drop-shadow(0 18px 40px ${b.c1}55)`,
              transform: `rotateX(${(1 - p) * 70}deg) translateY(${(1 - p) * 120}px) scale(${0.85 + 0.15 * p})`, transformOrigin: "50% 100%",
            }}>
              {b.text}
            </div>
          </div>
        );
      })}
    </>
  );
};

// ---------------------------------------------------------------------------------------------------
// 3D product cards and chips (band y 960-1500)

const Card3D: React.FC<{ src: string; a: number; b: number; w: number; x?: number; y: number; label?: string; from?: "left" | "right"; z?: number; dim?: number; tilt?: number }> = ({ src, a, b, w, x = 540, y, label, from = "right", z = 0, dim = 0, tilt = 0 }) => {
  const frame = useCurrentFrame();
  if (frame < a - 1 || frame > b) return null;
  const p = sp(frame, a, 15, 120);
  const o = life(frame, a, b, 8, 10);
  const dir = from === "right" ? 1 : -1;
  const ry = (1 - p) * 70 * dir + Math.sin((frame - a) / 30) * 4 + tilt;
  const rx = 6 + Math.cos((frame - a) / 36) * 2;
  const sweep = interpolate(frame, [a + 12, a + 36], [-40, 140], clamp);
  return (
    <div style={{ position: "absolute", left: x - w / 2, top: y, width: w, perspective: 1400, opacity: o * (1 - dim * 0.35) }}>
      <div style={{ transform: `translateX(${(1 - p) * 520 * dir}px) translateZ(${z - (1 - p) * 300}px) rotateY(${ry}deg) rotateX(${rx}deg) scale(${1 - dim * 0.12})`, transformStyle: "preserve-3d" }}>
        {label && (
          <div style={{ display: "inline-flex", alignItems: "center", gap: 10, marginBottom: 14, padding: "10px 22px", borderRadius: 40, background: "rgba(22,14,48,0.82)", border: "1.5px solid rgba(196,181,253,0.5)", color: W, fontFamily: FONT_UI, fontWeight: 700, fontSize: 30, letterSpacing: "-0.01em", boxShadow: "0 10px 30px rgba(10,6,24,0.4)" }}>
            <div style={{ width: 12, height: 12, borderRadius: 12, background: VIOLET, boxShadow: `0 0 12px ${VIOLET}` }} />
            {label}
          </div>
        )}
        <div style={{ position: "relative", borderRadius: 26, padding: 16, background: "rgba(255,255,255,0.97)", boxShadow: "0 40px 80px rgba(12,6,30,0.5), 0 0 0 1.5px rgba(139,92,246,0.35)", overflow: "hidden" }}>
          <Img src={staticFile(`s20/${src}.png`)} style={{ width: "100%", display: "block", borderRadius: 14 }} />
          <div style={{ position: "absolute", inset: 0, background: `linear-gradient(110deg, transparent ${sweep - 18}%, rgba(255,255,255,0.55) ${sweep}%, transparent ${sweep + 18}%)`, pointerEvents: "none" }} />
        </div>
      </div>
    </div>
  );
};

const Chip: React.FC<{ a: number; b: number; icon: string; text: string; tone?: "amber" | "purple" | "green" | "dark"; x?: number; y: number; strike?: number; size?: number }> = ({ a, b, icon, text, tone = "amber", x = 540, y, strike, size = 40 }) => {
  const frame = useCurrentFrame();
  if (frame < a - 1 || frame > b) return null;
  const p = sp(frame, a, 10, 220);
  const o = life(frame, a, b, 6, 8);
  const bg = tone === "amber" ? `linear-gradient(135deg, ${AMBER}, #FFD36E)` : tone === "green" ? `linear-gradient(135deg, ${GREEN}, #5EE6A8)` : tone === "purple" ? `linear-gradient(135deg, #7C3AED, #B48CFF)` : "rgba(22,14,48,0.9)";
  const fg = tone === "amber" || tone === "green" ? INK : W;
  const st = strike ? ramp(frame, strike, strike + 10, easeOut) : 0;
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: y, display: "flex", justifyContent: "center", transform: `translateX(${x - 540}px)`, perspective: 900, opacity: o }}>
      <div style={{ position: "relative", display: "inline-flex", alignItems: "center", gap: 16, padding: `${size * 0.45}px ${size * 0.8}px`, borderRadius: 999, background: bg, color: fg, fontFamily: FONT_UI, fontWeight: 800, fontSize: size, letterSpacing: "-0.02em", boxShadow: "0 18px 40px rgba(10,6,24,0.45)", transform: `rotateX(${(1 - p) * 80}deg) scale(${0.6 + 0.4 * p})`, transformOrigin: "50% 100%" }}>
        <Icon d={icon} size={size * 0.95} color={fg} />
        {text}
        {st > 0 && <div style={{ position: "absolute", left: 24, top: "50%", height: 7, width: `calc(${st * 100}% - 48px)`, background: INK, borderRadius: 7, rotate: "-4deg" }} />}
      </div>
    </div>
  );
};

/** Two sent emails stacking with "No reply". */
const Emails: React.FC = () => {
  const frame = useCurrentFrame();
  const a = F(5.0), b = F(7.6);
  if (frame < a || frame > b) return null;
  return (
    <>
      {[0, 1].map((i) => {
        const p = sp(frame, a + i * F(0.5), 12, 170);
        const o = life(frame, a + i * F(0.5), b, 6, 8);
        return (
          <div key={i} style={{ position: "absolute", left: 230 + i * 70, top: 1080 + i * 120, width: 560, perspective: 1000, opacity: o }}>
            <div style={{ display: "flex", alignItems: "center", gap: 22, padding: "24px 30px", borderRadius: 24, background: "rgba(255,255,255,0.96)", boxShadow: "0 30px 60px rgba(10,6,24,0.45)", transform: `rotateY(${(1 - p) * -60 - 8}deg) rotateX(8deg) translateY(${(1 - p) * 120}px)` }}>
              <div style={{ width: 70, height: 70, borderRadius: 18, background: TR.purpleSoft, display: "flex", alignItems: "center", justifyContent: "center" }}><Icon d={ICON.send} size={40} color={TR.purple} /></div>
              <div style={{ flex: 1, fontFamily: FONT_UI }}>
                <div style={{ fontWeight: 800, fontSize: 30, color: INK }}>Re: Sarah Collins</div>
                <div style={{ fontWeight: 600, fontSize: 24, color: TR.muted }}>To St. Andrew's · completion note?</div>
              </div>
              <div style={{ padding: "8px 16px", borderRadius: 30, background: "#FFF1D6", color: AMBER_DK, fontFamily: FONT_UI, fontWeight: 800, fontSize: 22 }}>No reply</div>
            </div>
          </div>
        );
      })}
    </>
  );
};

/** Hold widget during the held beat: pulsing bars + timer. */
const OnHold: React.FC = () => {
  const frame = useCurrentFrame();
  const a = F(26.8), b = F(29.7);
  if (frame < a || frame > b) return null;
  const p = sp(frame, a, 12, 160);
  const o = life(frame, a, b, 6, 8);
  const secs = Math.floor(interpolate(frame, [a, b], [212, 247], clamp));
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: 1150, display: "flex", justifyContent: "center", perspective: 1000, opacity: o }}>
      <div style={{ display: "flex", alignItems: "center", gap: 26, padding: "26px 40px", borderRadius: 34, background: "rgba(22,14,48,0.88)", border: `2px solid ${AMBER}88`, boxShadow: `0 24px 60px rgba(10,6,24,0.5), 0 0 40px ${AMBER}33`, transform: `rotateX(${(1 - p) * 70}deg) scale(${0.7 + 0.3 * p})` }}>
        <div style={{ display: "flex", gap: 8, alignItems: "flex-end", height: 60 }}>
          {[0, 1, 2, 3, 4].map((i) => (
            <div key={i} style={{ width: 12, borderRadius: 6, background: AMBER, height: 16 + 40 * Math.abs(Math.sin((frame + i * 7) / 6)) }} />
          ))}
        </div>
        <div style={{ fontFamily: FONT_UI, color: W }}>
          <div style={{ fontWeight: 800, fontSize: 40 }}>On hold with St. Andrew's</div>
          <div style={{ fontWeight: 700, fontSize: 30, color: AMBER, fontVariantNumeric: "tabular-nums" }}>{`${Math.floor(secs / 60)}:${String(secs % 60).padStart(2, "0")}`} and counting</div>
        </div>
      </div>
    </div>
  );
};

/** A grey fax page with an amber "found" stamp. */
const FaxPage: React.FC = () => {
  const frame = useCurrentFrame();
  const a = F(43.6), b = F(47.7);
  if (frame < a || frame > b) return null;
  const p = sp(frame, a, 11, 120);
  const o = life(frame, a, b, 6, 10);
  const stamp = sp(frame, F(44.3), 8, 260);
  return (
    <div style={{ position: "absolute", left: 340, top: 1000, width: 400, perspective: 1100, opacity: o }}>
      <div style={{ position: "relative", height: 470, background: "#ECEAE4", borderRadius: 10, padding: 34, boxShadow: "0 30px 60px rgba(0,0,0,0.45)", transform: `rotateY(${(1 - p) * 80 - 10}deg) rotateZ(${-6 + Math.sin(frame / 20) * 2}deg) translateY(${(1 - p) * -300}px)`, filter: "grayscale(1)" }}>
        <div style={{ fontFamily: "monospace", fontSize: 30, fontWeight: 700, color: "#555", letterSpacing: 6 }}>FAX</div>
        {[92, 70, 84, 60, 78, 50, 88, 66].map((w, i) => <div key={i} style={{ height: 11, width: `${w}%`, background: "#B9B6AF", borderRadius: 3, marginTop: 24 }} />)}
      </div>
      <div style={{ position: "absolute", left: 40, top: 190, padding: "14px 26px", border: `6px solid ${AMBER}`, borderRadius: 14, color: AMBER, fontFamily: FONT_UI, fontWeight: 900, fontSize: 40, letterSpacing: "0.04em", rotate: "-14deg", scale: String(2 - stamp), opacity: Math.min(1, stamp * 2), background: "rgba(255,255,255,0.85)" }}>
        SINCE FRIDAY
      </div>
    </div>
  );
};

/** Every office, a different way: four scattered channels orbiting. */
const Scatter: React.FC = () => {
  const frame = useCurrentFrame();
  const a = F(50.2), b = F(53.5);
  if (frame < a || frame > b) return null;
  const items = [
    { i: ICON.send, t: "Email" }, { i: ICON.clip, t: "Fax" }, { i: ICON.chat, t: "Voicemail" }, { i: ICON.inbox, t: "Sticky note" },
  ];
  return (
    <>
      {items.map((it, k) => {
        const p = sp(frame, a + k * 5, 11, 170);
        const o = life(frame, a + k * 5, b, 6, 8);
        const ang = (k / items.length) * Math.PI * 2 + (frame - a) / 40;
        const x = 540 + Math.cos(ang) * 300 * p - 150;
        const y = 1210 + Math.sin(ang) * 140 * p - 40;
        return (
          <div key={k} style={{ position: "absolute", left: x, top: y, width: 300, display: "flex", justifyContent: "center", opacity: o, transform: `scale(${0.7 + 0.3 * p + Math.sin(ang) * 0.08})` }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 12, padding: "16px 26px", borderRadius: 999, background: "rgba(255,255,255,0.95)", color: INK, fontFamily: FONT_UI, fontWeight: 800, fontSize: 32, boxShadow: `0 16px 34px rgba(10,6,24,0.4), 0 0 0 3px ${AMBER}` }}>
              <Icon d={it.i} size={32} color={AMBER_DK} />
              {it.t}
            </div>
          </div>
        );
      })}
    </>
  );
};

// ---------------------------------------------------------------------------------------------------
// Full-screen cutaways

const Stage: React.FC<{ children: React.ReactNode; a: number; b: number }> = ({ children, a, b }) => {
  const frame = useCurrentFrame();
  if (frame < a || frame > b) return null;
  const o = life(frame, a, b, 5, 6);
  const d = Math.sin(frame / 40) * 60;
  return (
    <AbsoluteFill style={{ opacity: o, background: `radial-gradient(circle at ${50 + d / 20}% 35%, #3B1E8F 0%, #1B1240 55%, #0C0820 100%)` }}>
      <AbsoluteFill style={{ background: `radial-gradient(circle at 70% 80%, ${PURPLE}33, transparent 50%)` }} />
      {children}
    </AbsoluteFill>
  );
};

/** Covers the glass-door glitch: Sarah waiting, a ten-minute ring filling. */
const WaitCut: React.FC = () => {
  const frame = useCurrentFrame();
  const a = F(31.45), b = F(33.8);
  const p = sp(frame, a, 13, 120);
  const fill = ramp(frame, a + 4, b - 4, easeIO);
  const R = 170, C = 2 * Math.PI * R;
  return (
    <Stage a={a} b={b}>
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", perspective: 1200 }}>
        <div style={{ transform: `rotateY(${(1 - p) * 50 + Math.sin(frame / 18) * 6}deg) rotateX(10deg) scale(${0.8 + 0.2 * p})`, display: "flex", flexDirection: "column", alignItems: "center", gap: 40, marginTop: -160 }}>
          <div style={{ position: "relative", width: 420, height: 420 }}>
            <svg width={420} height={420} style={{ position: "absolute", inset: 0, rotate: "-90deg" }}>
              <circle cx={210} cy={210} r={R} stroke="rgba(255,255,255,0.12)" strokeWidth={26} fill="none" />
              <circle cx={210} cy={210} r={R} stroke={AMBER} strokeWidth={26} fill="none" strokeLinecap="round" strokeDasharray={C} strokeDashoffset={C * (1 - fill)} style={{ filter: `drop-shadow(0 0 18px ${AMBER})` }} />
            </svg>
            <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontFamily: FONT_DISPLAY, color: W }}>
              <div style={{ fontSize: 150, fontWeight: 800, letterSpacing: "-0.05em", lineHeight: 1 }}>{Math.round(fill * 10)}</div>
              <div style={{ fontSize: 40, fontWeight: 700, color: AMBER }}>minutes</div>
            </div>
          </div>
          <div style={{ fontFamily: FONT_UI, fontWeight: 800, fontSize: 64, color: W, letterSpacing: "-0.03em", textAlign: "center" }}>Sarah, still in the chair</div>
          <div style={{ display: "flex", gap: 18 }}>
            {["Crown prep", "Note: missing"].map((t, i) => (
              <div key={i} style={{ padding: "14px 26px", borderRadius: 999, background: i ? `linear-gradient(135deg, ${AMBER}, #FFD36E)` : "rgba(255,255,255,0.12)", color: i ? INK : W, fontFamily: FONT_UI, fontWeight: 800, fontSize: 32 }}>{t}</div>
            ))}
          </div>
        </div>
      </AbsoluteFill>
    </Stage>
  );
};

const LogoCut: React.FC = () => {
  const frame = useCurrentFrame();
  const a = F(59.95), b = F(61.0);
  const k = ramp(frame, a, b, easeOut);
  return (
    <Stage a={a} b={b}>
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 34, transform: `scale(${1 + k * 0.08})`, marginTop: -150 }}>
        <div style={{ fontFamily: FONT_UI, fontWeight: 700, fontSize: 44, color: VIOLET, opacity: interpolate(frame, [a, a + 6], [0, 1], clamp) }}>There's a better way</div>
        <LogoReveal at={a + 2} width={640} revealDur={14} />
      </AbsoluteFill>
    </Stage>
  );
};

const MonthCut: React.FC = () => {
  const frame = useCurrentFrame();
  const a = F(73.15), b = F(74.4);
  const p = sp(frame, a, 12, 150);
  return (
    <Stage a={a} b={b}>
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", perspective: 1000 }}>
        <div style={{ transform: `rotateX(${(1 - p) * 70}deg) scale(${0.85 + 0.15 * p})`, textAlign: "center", fontFamily: FONT_DISPLAY, color: W, marginTop: -150 }}>
          <div style={{ fontSize: 46, fontWeight: 700, color: VIOLET, letterSpacing: "0.12em" }}>GENTLE DENTAL</div>
          <div style={{ fontSize: 150, fontWeight: 800, letterSpacing: "-0.05em", lineHeight: 0.95, backgroundImage: `linear-gradient(180deg, ${W}, ${VIOLET})`, WebkitBackgroundClip: "text", color: "transparent" }}>One month<br />later</div>
        </div>
      </AbsoluteFill>
    </Stage>
  );
};

const EndCard: React.FC = () => {
  const frame = useCurrentFrame();
  const a = END_AT;
  const t = sp(frame, a + 18, 14, 140);
  const u = sp(frame, a + 34, 14, 140);
  return (
    <Stage a={a} b={S20_DURATION + 10}>
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 46 }}>
        <LogoReveal at={a + 4} width={660} revealDur={18} />
        <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: 76, color: W, letterSpacing: "-0.04em", textAlign: "center", lineHeight: 1.02, opacity: t, translate: `0px ${(1 - t) * 30}px` }}>
          Two offices.<br /><span style={{ color: VIOLET }}>One conversation.</span>
        </div>
        <div style={{ padding: "16px 34px", borderRadius: 999, background: "rgba(255,255,255,0.1)", border: "1.5px solid rgba(196,181,253,0.45)", fontFamily: FONT_UI, fontWeight: 700, fontSize: 38, color: W, opacity: u, translate: `0px ${(1 - u) * 20}px` }}>
          toothreferral.com
        </div>
      </AbsoluteFill>
    </Stage>
  );
};

// ---------------------------------------------------------------------------------------------------
// Office labels (top band, never at the same time as a text-behind word)

const Label: React.FC<{ a: number; b: number; office: string; kind: string }> = ({ a, b, office, kind }) => {
  const frame = useCurrentFrame();
  const A = F(a), B = F(b);
  if (frame < A || frame > B) return null;
  const p = sp(frame, A, 13, 160);
  const o = life(frame, A, B, 6, 8);
  return (
    <div style={{ position: "absolute", left: 50, top: 110, opacity: o, translate: `${(1 - p) * -60}px 0px`, display: "flex", alignItems: "center", gap: 18, padding: "16px 28px 16px 18px", borderRadius: 24, background: "rgba(22,14,48,0.8)", border: "1.5px solid rgba(196,181,253,0.4)", boxShadow: "0 16px 40px rgba(10,6,24,0.4)" }}>
      <div style={{ width: 56, height: 56, borderRadius: 16, background: `linear-gradient(135deg, #7C3AED, #B48CFF)`, display: "flex", alignItems: "center", justifyContent: "center" }}><Icon d={ICON.shield} size={32} color={W} /></div>
      <div style={{ fontFamily: FONT_UI, color: W }}>
        <div style={{ fontWeight: 800, fontSize: 36, letterSpacing: "-0.02em" }}>{office}</div>
        <div style={{ fontWeight: 600, fontSize: 26, color: VIOLET }}>{kind}</div>
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------------------------------

const Product: React.FC = () => (
  <>
    {/* Act 1 */}
    <Emails />
    <Chip a={F(20.3)} b={F(22.5)} icon={ICON.alert} text="Completion note: not received" y={1240} size={40} />
    <OnHold />
    <FaxPage />
    <Scatter />
    {/* "Messages, X-rays, insurance, the signed note. All on the case." */}
    <Card3D src="messages" a={F(61.0)} b={F(61.62)} w={900} y={1000} label="Messages with Gentle Dental" />
    <Card3D src="xrays" a={F(61.62)} b={F(62.26)} w={520} y={980} label="X-rays on the case" from="left" />
    <Card3D src="insurance" a={F(62.26)} b={F(63.0)} w={760} y={990} label="Insurance cards" />
    <Card3D src="signed" a={F(63.0)} b={F(64.0)} w={900} y={1150} label="Signed note" from="left" />
    <Card3D src="activity" a={F(64.0)} b={F(66.35)} w={900} y={1020} label="One case · every step, both offices" />
    <Chip a={F(65.1)} b={F(66.35)} icon={ICON.check} text="Gentle Dental sees it too" tone="green" y={1440} size={36} />
    <Card3D src="invite" a={F(66.4)} b={F(68.9)} w={420} y={960} label="Invite your network" from="left" />
    <Chip a={F(68.9)} b={F(70.7)} icon={ICON.send} text="Invite sent to Gentle Dental" tone="green" y={1240} />
    <Chip a={F(70.85)} b={F(72.95)} icon={ICON.calendar} text="Set up in about 5 minutes" tone="purple" y={1240} />
    {/* Act 2 */}
    <Card3D src="signed" a={F(80.6)} b={F(83.0)} w={900} y={1080} label="Signed note · on the case" />
    <Card3D src="done_toast" a={F(81.2)} b={F(83.0)} w={520} x={640} y={1330} from="left" />
    <Chip a={F(83.8)} b={F(85.3)} icon={ICON.chat} text="Phone tag" tone="amber" y={1240} strike={F(84.7)} />
    <Chip a={F(85.3)} b={F(86.9)} icon={ICON.check} text="All on Tooth Referral" tone="purple" y={1240} />
    <Card3D src="status" a={F(87.6)} b={F(89.95)} w={360} y={960} label="Shared status" />
  </>
);

const Sfx: React.FC = () => {
  const s = (f: string, at: number, v = 0.35) => (
    <Sequence from={F(at)} durationInFrames={F(2)}>
      <Audio src={staticFile(`audio/sfx/${f}.wav`)} volume={v} />
    </Sequence>
  );
  return (
    <>
      {s("pop-1", 5.0, 0.25)}{s("pop-2", 5.5, 0.25)}{s("blip-1", 20.3, 0.3)}{s("thud", 31.45, 0.35)}{s("tick-3", 32.2, 0.25)}
      {s("whoosh-short", 43.6, 0.3)}{s("impact", 44.3, 0.25)}{s("pop-3", 50.2, 0.22)}{s("riser", 59.0, 0.25)}{s("shimmer", 59.95, 0.35)}
      {s("whoosh-short", 61.0, 0.28)}{s("whoosh-short", 61.62, 0.24)}{s("whoosh-short", 62.26, 0.24)}{s("whoosh-short", 63.0, 0.24)}
      {s("chime", 65.1, 0.28)}{s("whoosh-short", 66.4, 0.25)}{s("chime", 68.9, 0.3)}{s("whoosh-long", 73.1, 0.3)}
      {s("whoosh-short", 80.6, 0.26)}{s("chime", 81.2, 0.28)}{s("click", 84.7, 0.35)}{s("pop-1", 85.3, 0.28)}{s("shimmer", END_AT / FPS, 0.35)}
    </>
  );
};

const Grain: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ pointerEvents: "none", opacity: 0.07, mixBlendMode: "overlay", backgroundImage: "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220'><filter id='n'><feTurbulence baseFrequency='0.9' numOctaves='2' seed='" + (frame % 9) + "'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")" }} />
  );
};

export const S20Story: React.FC = () => (
  <FontGate>
    <AbsoluteFill style={{ background: "#0C0820" }}>
      <Sequence durationInFrames={END_AT + 6}>
        <Shot />
        <BehindWords />
        <Shot cutout />
      </Sequence>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 45%, transparent 55%, rgba(8,4,20,0.45) 100%)" }} />
      <Label a={0.2} b={3.4} office="Gentle Dental" kind="General dentist" />
      <Label a={53.7} b={56.6} office="St. Andrew's Family Dental" kind="Specialist" />
      <Label a={74.4} b={76.9} office="Gentle Dental" kind="One month later" />
      <Label a={87.0} b={89.5} office="St. Andrew's Family Dental" kind="One month later" />
      <Product />
      <WaitCut />
      <LogoCut />
      <MonthCut />
      <EndCard />
      <Captions />
      <Grain />
      <Audio src={staticFile("audio/music/s13-bed.wav")} volume={0.07} loop />
      <Sfx />
    </AbsoluteFill>
  </FontGate>
);
