/**
 * Episode 2 "No More Phone Tag" — 12 Google Flow clips (public/ep2/uNN.mp4: Flow watermark removed, 1080x1920, loudness
 * normalised) cut into one story, with the app's own screens rebuilt as transparent 3D glass dashboards that play in
 * time with the voice-over (DayPrepClean / CaseChat rendered live through <Freeze>, so every zoom stays sharp).
 *
 * Errors cut or covered: u02 opens on a screen grab of a video player (0-2.6 s, covered by the full-screen dashboard
 * while Dr. Vance's V.O. runs); u09 changes desk and room after 5 s (cut at 5.0); u10 has a second doctor at the left
 * edge in the first second (starts at 1.5); u06 lip movement after 6.3 s (cut); u08's V.O. breaks off at
 * "No downloading, no" (cut after "both offices").
 *
 * Layers, back to front: footage · text-behind words · person cutout · blur veil · 3D glass dashboards and chips ·
 * captions (y >= 1600) · full-screen cutaways · end card. Script: Script-21-v2-No-More-Phone-Tag.
 */
import React from "react";
import { AbsoluteFill, Audio, Freeze, OffthreadVideo, Sequence, interpolate, spring, staticFile, useCurrentFrame } from "remotion";
import words from "../data/ep2-words.json";
import vwords from "../data/ep2-voice-words.json";
import { FontGate } from "../effects";
import { FONT_DISPLAY, FONT_UI } from "../theme";
import { LogoReveal, easeIO, easeOut, ramp } from "../tr/motion";
import { ICON, Icon, clamp } from "../tr/ui";
import { LightLeak, Sparkle } from "./S20Dash";
import { DayPrepClean } from "./DayPrepClean";
import { CaseChat } from "./CaseChat";

const FPS = 30;
const RF = (s: number) => Math.round(s * FPS);
const AMBER = "#FFB020";
const PURPLE = "#8B5CF6";
const VIOLET = "#C4B5FD";
const GREEN = "#1FCA7A";
const INK = "#16131F";
const W = "#FFFFFF";
const SOFT = "0 2px 16px rgba(10,6,24,0.55), 0 1px 3px rgba(10,6,24,0.5)";
const I_PHONE = "M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z";

const sp = (frame: number, a: number, damping = 14, stiffness = 170) =>
  frame < a ? 0 : spring({ frame: frame - a, fps: FPS, config: { damping, stiffness, mass: 0.7 } });
const life = (frame: number, a: number, b: number, inD = 10, outD = 8) =>
  Math.min(interpolate(frame, [a, a + inD], [0, 1], clamp), interpolate(frame, [b - outD, b], [1, 0], clamp));

// ---------------------------------------------------------------------------------------------------
// Edit decision list (clip seconds). A "cut" segment is a full-screen cutaway with no footage of its own.

type Seg = { id: string; clip?: string; a: number; b: number; len?: number; bg?: [string, number] };
const PLAN: Seg[] = [
  { id: "hook", clip: "u01", a: 2.4, b: 6.3 },
  { id: "dayprep", clip: "u02", a: 0.7, b: 7.95 },
  { id: "note", clip: "u03", a: 0.8, b: 7.1 },
  { id: "call", clip: "u04", a: 0.6, b: 7.75 },
  { id: "voicemail", clip: "u05", a: 0.3, b: 4.8 },
  { id: "tenmin", clip: "u06", a: 0.0, b: 6.3 },
  { id: "missed", clip: "u07", a: 0.3, b: 7.9 },
  { id: "square", a: 0, b: 6.9 },
  { id: "chat", a: 0, b: 9.5 },
  { id: "barbara", clip: "u08", a: 0.0, b: 6.6 },
  { id: "tail", a: 0, b: 3.3 },
  { id: "ready", clip: "u09", a: 0.0, b: 5.0 },
  { id: "morning", clip: "u10", a: 1.5, b: 7.9 },
  { id: "thirty", clip: "u11", a: 0.6, b: 7.0 },
  { id: "greg", clip: "u12", a: 0.8, b: 6.4 },
];
const SEGS = (() => {
  let at = 0;
  return PLAN.map((s) => { const f0 = RF(at); at += s.b - s.a; return { ...s, f0, f1: RF(at) }; });
})();
const S = Object.fromEntries(SEGS.map((s) => [s.id, s])) as Record<string, (typeof SEGS)[number]>;
/** Output frame of clip time t inside segment id. */
const T = (id: string, t: number) => S[id].f0 + RF(t - S[id].a);
const END_AT = SEGS[SEGS.length - 1].f1;
export const EP2_DURATION = END_AT + RF(4.6);
/** ElevenLabs lines Flow never delivered (public/ep2/voice/<name>.wav), placed at clip time `at` of segment `seg`. */
const LINES = [
  { name: "tanya_square", seg: "square", at: 0.25 },
  { name: "amanda_stop", seg: "chat", at: 0.25 },
  { name: "amanda_mention", seg: "chat", at: 5.1 },
  { name: "amanda_tail", seg: "tail", at: 0.2 },
  { name: "amanda_anymore", seg: "thirty", at: 5.55 },
];
const L = (name: string, t: number) => { const l = LINES.find((x) => x.name === name)!; return T(l.seg, l.at + t); };
/** Clips whose speech is replaced by the ElevenLabs speech-to-speech take (same timing, one voice per character). */
const REVOICED = new Set(["u01", "u02", "u03", "u04", "u06", "u08", "u10", "u11", "u12"]);

// ---------------------------------------------------------------------------------------------------
// Footage with a slow push-in per shot, a punch on emphasis lines and whip pans between offices

const WHIPS = [S.voicemail.f0, S.tenmin.f0, S.chat.f0, S.barbara.f0, S.ready.f0, S.thirty.f0];
const PUNCH = [T("hook", 4.5), T("tenmin", 4.3), T("thirty", 1.0), T("greg", 4.1)];
const Clip: React.FC<{ s: (typeof SEGS)[number]; cutout?: boolean }> = ({ s, cutout }) => {
  const frame = useCurrentFrame();
  const g = frame + s.f0;
  let sc = 1.02 + 0.05 * ramp(g, s.f0, s.f1, (t) => t);
  for (const p of PUNCH) if (g >= p && g < s.f1) sc += 0.08 * Math.exp(-(g - p) / 8);
  let wx = 0, wb = 0;
  for (const w of WHIPS) { const k = Math.max(0, 1 - Math.abs(g - w) / 6); wx += (g < w ? -1 : 1) * k * 90; wb += k * 22; sc += k * 0.18; }
  const style: React.CSSProperties = { position: "absolute", left: 0, top: 0, width: 1080, height: 1920, transform: `translateX(${wx}px) scale(${sc})`, transformOrigin: "50% 36%", filter: wb > 0.5 ? `blur(${wb}px)` : undefined };
  const edge = (f: number) => Math.min(interpolate(f, [0, 3], [0, 1], clamp), interpolate(f, [s.f1 - s.f0 - 3, s.f1 - s.f0], [1, 0], clamp));
  return cutout
    ? <OffthreadVideo src={staticFile(`ep2/${s.clip}-cut.webm`)} transparent muted trimBefore={RF(s.a)} style={style} />
    : REVOICED.has(s.clip!)
      ? <><OffthreadVideo src={staticFile(`ep2/${s.clip}.mp4`)} muted trimBefore={RF(s.a)} style={style} /><Audio src={staticFile(`ep2/voice/${s.clip}.wav`)} trimBefore={RF(s.a)} volume={edge} /></>
      : <OffthreadVideo src={staticFile(`ep2/${s.clip}.mp4`)} trimBefore={RF(s.a)} volume={edge} style={style} />;
};
const CUTOUTS = new Set(["u01", "u06", "u11", "u12"]);
const Footage: React.FC<{ layer: "plate" | "cutout" }> = ({ layer }) => (
  <>
    {SEGS.map((s) => {
      if (!s.clip || (layer === "cutout" && !CUTOUTS.has(s.clip))) return null;
      return <Sequence key={s.id} from={s.f0} durationInFrames={s.f1 - s.f0}><Clip s={s} cutout={layer === "cutout"} /></Sequence>;
    })}
  </>
);

// ---------------------------------------------------------------------------------------------------
// Text behind the people (between footage and cutout), blur-in

type Behind = { text: string; a: number; b: number; c1: string; c2: string; y?: number };
const BEHIND: Behind[] = [
  { text: "NERVOUS", a: T("hook", 3.35), b: T("hook", 6.2), c1: AMBER, c2: "#FFE08A", y: 170 },
  { text: "10\nMINUTES", a: T("tenmin", 0.05), b: T("tenmin", 3.3), c1: AMBER, c2: "#FFE08A", y: 120 },
  { text: "PHONE\nTAG", a: T("tenmin", 4.25), b: T("tenmin", 6.25), c1: AMBER, c2: "#FFE08A", y: 120 },
  { text: "30\nSECONDS", a: T("thirty", 1.0), b: T("thirty", 3.6), c1: "#B48CFF", c2: W, y: 120 },
  { text: "TOMORROW", a: T("greg", 2.4), b: T("greg", 4.0), c1: "#B48CFF", c2: W, y: 120 },
];
const BehindWords: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <>
      {BEHIND.map((b, i) => {
        if (frame < b.a - 2 || frame > b.b) return null;
        const p = sp(frame, b.a, 12, 140);
        const o = life(frame, b.a, b.b, 6, 9);
        const longest = Math.max(...b.text.split("\n").map((l) => l.length));
        const size = Math.min(250, 960 / (Math.max(3, longest) * 0.74));
        const blur = (1 - Math.min(1, p * 1.4)) * 18 + interpolate(frame, [b.b - 9, b.b], [0, 14], clamp);
        return (
          <div key={i} style={{ position: "absolute", left: 0, right: 0, top: (b.y ?? 160) + Math.sin((frame - b.a) / 14) * 6, display: "flex", justifyContent: "center", perspective: 900, opacity: o }}>
            <div style={{
              fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: size, letterSpacing: "-0.05em", lineHeight: 0.86, textAlign: "center", whiteSpace: "pre",
              backgroundImage: `linear-gradient(180deg, ${b.c2} 0%, ${b.c1} 72%)`, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent",
              filter: `blur(${blur}px) drop-shadow(0 18px 40px ${b.c1}55)`,
              transform: `rotateX(${(1 - p) * 70}deg) translateY(${(1 - p) * 120}px) scale(${0.85 + 0.15 * p})`, transformOrigin: "50% 100%",
            }}>{b.text}</div>
          </div>
        );
      })}
    </>
  );
};

// ---------------------------------------------------------------------------------------------------
// Transparent 3D glass dashboard: a live app screen (1920x842) seen through a glass frame, with a camera inside that
// moves between regions (cx, cy, zoom) in step with the voice-over.

type Cam = { f: number; cx: number; cy: number; z: number };
const camAt = (keys: Cam[], f: number) => {
  if (f <= keys[0].f) return keys[0];
  for (let i = 1; i < keys.length; i++) {
    if (f <= keys[i].f) {
      const a = keys[i - 1], b = keys[i];
      const t = easeIO((f - a.f) / (b.f - a.f));
      return { f, cx: a.cx + (b.cx - a.cx) * t, cy: a.cy + (b.cy - a.cy) * t, z: a.z + (b.z - a.z) * t };
    }
  }
  return keys[keys.length - 1];
};
const Glass: React.FC<{
  a: number; b: number; x?: number; y: number; w: number; h: number; keys: Cam[]; screenFrame: (f: number) => number;
  screen: "dayprep" | "chat"; title: string; tilt?: number; veil?: boolean;
}> = ({ a, b, x = 540, y, w, h, keys, screenFrame, screen, title, tilt = 1, veil = true }) => {
  const frame = useCurrentFrame();
  if (frame < a - 1 || frame > b) return null;
  const p = sp(frame, a, 15, 120);
  const out = interpolate(frame, [b - 10, b], [0, 1], clamp);
  const cam = camAt(keys, frame);
  const sf = Math.max(0, Math.round(screenFrame(frame)));
  const drift = Math.sin((frame - a) / 30);
  const rx = (1 - p) * 55 + 7 + out * -25;
  const ry = tilt * (-14 * (1 - p) - 6 + drift * 3);
  const dark = screen === "dayprep";
  return (
    <>
      {veil && <AbsoluteFill style={{ backdropFilter: `blur(${10 * Math.min(p, 1 - out)}px)`, background: `rgba(8,4,20,${0.35 * Math.min(p, 1 - out)})` }} />}
      <div style={{ position: "absolute", left: x - w / 2, top: y, width: w, height: h, perspective: 1600, opacity: Math.min(1, p * 1.5) * (1 - out) }}>
        <div style={{
          position: "absolute", inset: 0, borderRadius: 34, padding: 14, boxSizing: "border-box",
          background: "linear-gradient(145deg, rgba(255,255,255,0.22), rgba(255,255,255,0.06))", border: "1.5px solid rgba(255,255,255,0.45)",
          backdropFilter: "blur(16px)", boxShadow: `0 40px 90px rgba(6,3,18,0.55), 0 0 60px ${PURPLE}44, inset 0 1px 0 rgba(255,255,255,0.5)`,
          transform: `translateY(${(1 - p) * 160 - out * 80}px) rotateX(${rx}deg) rotateY(${ry}deg) scale(${0.72 + 0.28 * p})`, transformOrigin: "50% 60%",
          filter: out > 0 ? `blur(${out * 10}px)` : undefined,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, height: 34, padding: "0 8px" }}>
            {["#F5F3FF", "#DDD6FE", "#C4B5FD"].map((c) => <div key={c} style={{ width: 13, height: 13, borderRadius: 13, background: c, opacity: 0.85 }} />)}
            <div style={{ marginLeft: 10, fontFamily: FONT_UI, fontWeight: 700, fontSize: 22, color: W, textShadow: SOFT, letterSpacing: "-0.01em" }}>{title}</div>
          </div>
          <div style={{ position: "relative", width: w - 28, height: h - 62, borderRadius: 22, overflow: "hidden", background: dark ? "#101725" : "#fff", boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.25)" }}>
            <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 842, transformOrigin: "0 0", transform: `translate(${(w - 28) / 2 - cam.cx * cam.z}px, ${(h - 62) / 2 - cam.cy * cam.z}px) scale(${cam.z})` }}>
              <Freeze frame={sf}>{screen === "dayprep" ? <DayPrepClean /> : <CaseChat />}</Freeze>
            </div>
            {/* glass sheen */}
            <div style={{ position: "absolute", inset: 0, background: `linear-gradient(${115 + drift * 8}deg, rgba(255,255,255,0.16) 0%, rgba(255,255,255,0) 32%, rgba(255,255,255,0) 70%, rgba(255,255,255,0.08) 100%)`, pointerEvents: "none" }} />
          </div>
        </div>
      </div>
    </>
  );
};

/** Linear map of output frames [o0, o1] onto screen frames [s0, s1] (clamped). */
const lin = (o0: number, o1: number, s0: number, s1: number) => (f: number) => interpolate(f, [o0, o1], [s0, s1], clamp);

// ---------------------------------------------------------------------------------------------------
// Chips and small 3D cards

const Chip: React.FC<{ a: number; b: number; icon: string; text: string; tone?: "amber" | "purple" | "green" | "dark"; y: number; size?: number; strike?: number }> = ({ a, b, icon, text, tone = "amber", y, size = 40, strike }) => {
  const frame = useCurrentFrame();
  if (frame < a - 1 || frame > b) return null;
  const p = sp(frame, a, 10, 220);
  const o = life(frame, a, b, 6, 8);
  const bg = tone === "amber" ? `linear-gradient(135deg, ${AMBER}, #FFD36E)` : tone === "green" ? `linear-gradient(135deg, ${GREEN}, #5EE6A8)` : tone === "purple" ? "linear-gradient(135deg, #7C3AED, #B48CFF)" : "rgba(22,14,48,0.86)";
  const fg = tone === "amber" || tone === "green" ? INK : W;
  const st = strike ? ramp(frame, strike, strike + 10, easeOut) : 0;
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: y, display: "flex", justifyContent: "center", perspective: 900, opacity: o }}>
      <div style={{ position: "relative", display: "inline-flex", alignItems: "center", gap: 16, padding: `${size * 0.45}px ${size * 0.8}px`, borderRadius: 999, background: bg, color: fg, fontFamily: FONT_UI, fontWeight: 800, fontSize: size, letterSpacing: "-0.02em", boxShadow: "0 18px 40px rgba(10,6,24,0.45)", transform: `rotateX(${(1 - p) * 80}deg) scale(${0.6 + 0.4 * p})`, transformOrigin: "50% 100%", filter: p < 0.6 ? `blur(${(0.6 - p) * 12}px)` : undefined }}>
        <Icon d={icon} size={size * 0.95} color={fg} />
        {text}
        {st > 0 && <div style={{ position: "absolute", left: 24, top: "50%", height: 7, width: `calc(${st * 100}% - 48px)`, background: INK, borderRadius: 7, rotate: "-4deg" }} />}
      </div>
    </div>
  );
};

/** The administrative note landing on Amanda's screen (u04 opening). */
const NoteToast: React.FC<{ a: number; b: number }> = ({ a, b }) => {
  const frame = useCurrentFrame();
  if (frame < a - 1 || frame > b) return null;
  const p = sp(frame, a, 13, 150);
  const o = life(frame, a, b, 6, 10);
  return (
    <div style={{ position: "absolute", left: 90, right: 90, top: 1010, perspective: 1200, opacity: o }}>
      <div style={{ padding: "26px 30px", borderRadius: 28, background: "rgba(16,23,37,0.88)", border: "1.5px solid rgba(139,92,246,0.7)", backdropFilter: "blur(14px)", boxShadow: `0 30px 70px rgba(6,3,18,0.55), 0 0 40px ${PURPLE}55`, transform: `rotateX(${(1 - p) * 60 + 6}deg) rotateY(${(1 - p) * -25 + 4}deg) translateY(${(1 - p) * 140}px) scale(${0.8 + 0.2 * p})`, fontFamily: FONT_UI }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 12 }}>
          <div style={{ width: 48, height: 48, borderRadius: 14, background: "linear-gradient(135deg, #7C3AED, #B48CFF)", display: "flex", alignItems: "center", justifyContent: "center" }}><Icon d={ICON.shield} size={28} color={W} /></div>
          <div>
            <div style={{ fontWeight: 800, fontSize: 28, color: W }}>New administrative note</div>
            <div style={{ fontWeight: 600, fontSize: 22, color: "#9CA3AF" }}>Dr. Vance · Maria Ortiz · private to our team</div>
          </div>
        </div>
        <div style={{ fontSize: 28, lineHeight: 1.35, color: "#F9FAFB" }}><span style={{ color: "#A78BFA" }}>@Amanda</span> Mrs. Ortiz's newest pano isn't on file. Could you request it from Gentle Dental before her 10:00 consult?</div>
      </div>
    </div>
  );
};

/** Office label, top left. */
const Label: React.FC<{ a: number; b: number; office: string; kind: string }> = ({ a, b, office, kind }) => {
  const frame = useCurrentFrame();
  if (frame < a || frame > b) return null;
  const p = sp(frame, a, 13, 160);
  return (
    <div style={{ position: "absolute", left: 50, top: 90, opacity: life(frame, a, b, 6, 8), translate: `${(1 - p) * -60}px 0px`, display: "flex", alignItems: "center", gap: 18, padding: "14px 26px 14px 16px", borderRadius: 24, background: "rgba(22,14,48,0.72)", border: "1.5px solid rgba(196,181,253,0.4)", backdropFilter: "blur(10px)", boxShadow: "0 16px 40px rgba(10,6,24,0.4)" }}>
      <div style={{ width: 52, height: 52, borderRadius: 16, background: "linear-gradient(135deg, #7C3AED, #B48CFF)", display: "flex", alignItems: "center", justifyContent: "center" }}><Icon d={ICON.shield} size={30} color={W} /></div>
      <div style={{ fontFamily: FONT_UI, color: W }}>
        <div style={{ fontWeight: 800, fontSize: 32, letterSpacing: "-0.02em" }}>{office}</div>
        <div style={{ fontWeight: 600, fontSize: 24, color: VIOLET }}>{kind}</div>
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------------------------------
// Full-screen cutaway: the shot behind it frozen and blurred, the glass dashboard on top

const Backdrop: React.FC<{ a: number; b: number; clip: string; t: number }> = ({ a, b, clip, t }) => {
  const frame = useCurrentFrame();
  if (frame < a || frame >= b) return null;
  return (
    <AbsoluteFill>
      <Freeze frame={0}><OffthreadVideo src={staticFile(`ep2/${clip}.mp4`)} muted trimBefore={RF(t)} style={{ width: 1080, height: 1920, filter: "blur(26px) brightness(0.62) saturate(1.1)", transform: "scale(1.12)" }} /></Freeze>
      <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 40%, ${PURPLE}30, rgba(8,4,20,0.55) 75%)` }} />
    </AbsoluteFill>
  );
};

/** Tanya's phone tag as a 3D call log: outgoing to voicemail, the missed call back, then "square one". */
const PhoneLog: React.FC = () => {
  const frame = useCurrentFrame();
  const a = S.square.f0, b = S.square.f1;
  if (frame < a || frame > b) return null;
  const rows = [
    { at: L("tanya_square", 0.0), dir: "Outgoing", who: "Gentle Dental", res: "Voicemail", time: "9:12 AM" },
    { at: L("tanya_square", 2.55), dir: "Incoming", who: "Gentle Dental · Barbara", res: "Missed", time: "9:16 AM" },
  ];
  const p = sp(frame, a, 15, 120);
  const o = life(frame, a, b, 6, 10);
  const sq = sp(frame, L("tanya_square", 5.0), 12, 140);
  return (
    <>
      <div style={{ position: "absolute", left: 90, right: 90, top: 560, perspective: 1400, opacity: o }}>
        <div style={{ borderRadius: 34, padding: "26px 28px", background: "linear-gradient(145deg, rgba(255,255,255,0.2), rgba(255,255,255,0.06))", border: "1.5px solid rgba(255,255,255,0.45)", backdropFilter: "blur(16px)", boxShadow: `0 40px 90px rgba(6,3,18,0.55), 0 0 50px ${AMBER}33`, transform: `rotateX(${(1 - p) * 55 + 8}deg) rotateY(${-8 + Math.sin((frame - a) / 30) * 3}deg) translateY(${(1 - p) * 160}px) scale(${0.75 + 0.25 * p})`, fontFamily: FONT_UI }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, color: W, fontWeight: 800, fontSize: 34, marginBottom: 18, textShadow: SOFT }}><Icon d={I_PHONE} size={34} color={W} />Front desk phone · today</div>
          {rows.map((r, i) => {
            const k = sp(frame, r.at, 12, 170);
            if (frame < r.at - 1) return null;
            return (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 20, padding: "20px 22px", marginTop: i ? 14 : 0, borderRadius: 22, background: "rgba(255,255,255,0.95)", opacity: k, transform: `translateX(${(1 - k) * 120}px)` }}>
                <div style={{ width: 62, height: 62, borderRadius: 18, background: "#FFF1D6", display: "flex", alignItems: "center", justifyContent: "center" }}><Icon d={I_PHONE} size={32} color="#C27A0A" /></div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 800, fontSize: 32, color: INK }}>{r.who}</div>
                  <div style={{ fontWeight: 600, fontSize: 24, color: "#6B7085" }}>{r.dir} · {r.time}</div>
                </div>
                <div style={{ padding: "10px 20px", borderRadius: 999, background: `linear-gradient(135deg, ${AMBER}, #FFD36E)`, color: INK, fontWeight: 800, fontSize: 26 }}>{r.res}</div>
              </div>
            );
          })}
        </div>
      </div>
      {frame >= L("tanya_square", 5.0) - 1 && (
        <div style={{ position: "absolute", left: 0, right: 0, top: 230, textAlign: "center", fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: 150, letterSpacing: "-0.05em", lineHeight: 0.9, opacity: Math.min(sq, o),
          backgroundImage: `linear-gradient(180deg, #FFE08A 0%, ${AMBER} 72%)`, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent",
          filter: `blur(${(1 - Math.min(1, sq * 1.3)) * 16}px) drop-shadow(0 18px 40px ${AMBER}55)`, transform: `rotateX(${(1 - sq) * 60}deg) scale(${0.85 + 0.15 * sq})` }}>SQUARE<br />ONE</div>
      )}
    </>
  );
};

// DayPrepClean key frames (its own 30 fps timeline)
const DP = { click: 32, posted: 300, onit: 336, thumb: 396, swap: 412, reply: 440 };
// CaseChat key frames
const CC = { type0: 20, send: 118, typing: 140, barbara: 186, hover: 236, click2: 262, send2: 352 };

const Product: React.FC = () => {
  const dp = S.dayprep, nt = S.note, ch = S.chat, bb = S.barbara, rd = S.ready;
  return (
    <>
      {/* u02 opening covers the player screen grab: the whole Day-Prep Station, then into Mrs. Ortiz's card */}
      <Backdrop a={dp.f0} b={T("dayprep", 3.55)} clip="u02" t={3.2} />
      <Glass a={dp.f0} b={T("dayprep", 3.55)} y={560} w={1000} h={700} screen="dayprep" title="Provider's Day-Prep Station · Dr. Vance" veil={false}
        screenFrame={() => 0}
        keys={[{ f: dp.f0, cx: 960, cy: 421, z: 0.52 }, { f: T("dayprep", 1.6), cx: 700, cy: 330, z: 0.8 }, { f: T("dayprep", 3.5), cx: 470, cy: 300, z: 1.3 }]} />
      {/* "Mrs. Ortiz's chart is ready... except her newest X-ray" */}
      <Glass a={T("dayprep", 4.2)} b={dp.f1 + 2} y={930} w={960} h={640} screen="dayprep" title="Maria Ortiz · Consultation · 10:00"
        screenFrame={() => 0}
        keys={[{ f: T("dayprep", 4.2), cx: 300, cy: 240, z: 1.35 }, { f: T("dayprep", 6.2), cx: 360, cy: 300, z: 1.35 }, { f: T("dayprep", 6.9), cx: 734, cy: 440, z: 2.0 }]} />
      <Chip a={T("dayprep", 6.5)} b={dp.f1} icon={ICON.alert} text="Newest X-ray · missing" tone="amber" y={810} />
      {/* u03: "I don't walk to the front desk or call around." → "One note on her case, and my team sees it." */}
      <Chip a={T("note", 1.6)} b={T("note", 3.7)} icon={I_PHONE} text="No walking · no calls" tone="dark" y={1380} strike={T("note", 2.9)} />
      <Glass a={T("note", 3.9)} b={nt.f1 + 2} y={790} w={900} h={790} screen="dayprep" title="Administrative notes · private to our team"
        screenFrame={lin(T("note", 4.0), T("note", 6.6), DP.click + 40, DP.posted + 12)}
        keys={[{ f: T("note", 3.9), cx: 1686, cy: 260, z: 1.85 }, { f: T("note", 6.3), cx: 1686, cy: 300, z: 1.85 }, { f: T("note", 7.0), cx: 1686, cy: 380, z: 1.75 }]} />
      {/* u04: the note lands on Amanda's screen, then Tanya picks up the phone (the old way) */}
      <NoteToast a={T("call", 0.75)} b={T("call", 3.1)} />
      <Chip a={T("call", 3.3)} b={T("call", 5.4)} icon={I_PHONE} text="Calling Gentle Dental" tone="amber" y={1360} />
      <Chip a={T("voicemail", 3.5)} b={S.voicemail.f1} icon={I_PHONE} text="Voicemail · 1" tone="amber" y={1360} />
      <Chip a={T("missed", 6.0)} b={S.missed.f1} icon={I_PHONE} text="Missed call · Gentle Dental" tone="amber" y={1360} />
      {/* the new way: Amanda moves it onto the case */}
      <Backdrop a={ch.f0} b={ch.f1} clip="u04" t={2.2} />
      <Chip a={L("amanda_stop", 0.1)} b={L("amanda_stop", 2.6)} icon={I_PHONE} text="Stop calling" tone="amber" y={860} size={52} strike={L("amanda_stop", 1.9)} />
      <Chip a={L("amanda_stop", 2.5)} b={ch.f1} icon={ICON.chat} text="Move it onto the case" tone="purple" y={150} size={38} />
      <Glass a={L("amanda_stop", 2.7)} b={ch.f1 + 3} y={330} w={1000} h={1080} screen="chat" title="Office Communication · Maria Ortiz" veil={false}
        screenFrame={lin(L("amanda_mention", 0.1), L("amanda_mention", 3.55), CC.type0, CC.send + 2)}
        keys={[{ f: L("amanda_stop", 2.7), cx: 1648, cy: 280, z: 1.6 }, { f: L("amanda_mention", 0), cx: 1648, cy: 300, z: 1.9 }, { f: L("amanda_mention", 1.6), cx: 1648, cy: 340, z: 2.12 }, { f: ch.f1, cx: 1648, cy: 350, z: 2.15 }]} />
      {/* Tanya: "We called, got voicemail. They called back while I was checking someone out. We're right back at square one." */}
      <Backdrop a={S.square.f0} b={S.square.f1} clip="u07" t={7.6} />
      <PhoneLog />
      {/* Amanda: "No downloading, no scanning, no chasing emails." */}
      <Backdrop a={S.tail.f0} b={S.tail.f1} clip="u08" t={7.6} />
      <Chip a={L("amanda_tail", 0.0)} b={S.tail.f1} icon={ICON.inbox} text="Downloading" tone="dark" y={500} size={54} strike={L("amanda_tail", 0.55)} />
      <Chip a={L("amanda_tail", 0.92)} b={S.tail.f1} icon={ICON.clip} text="Scanning" tone="dark" y={700} size={54} strike={L("amanda_tail", 1.4)} />
      <Chip a={L("amanda_tail", 1.56)} b={S.tail.f1} icon={ICON.send} text="Chasing emails" tone="dark" y={900} size={54} strike={L("amanda_tail", 2.2)} />
      <Chip a={L("amanda_tail", 2.55)} b={S.tail.f1} icon={ICON.check} text="All on the case" tone="green" y={1120} size={50} />
      {/* u08: "Barbara sees it right away, replies in the same thread, and drops the X-ray in. It saves to the case for both offices." */}
      <Glass a={T("barbara", 1.2)} b={bb.f1 + 2} y={890} w={960} h={690} screen="chat" title="Gentle Dental ↔ St. Andrew's"
        screenFrame={lin(T("barbara", 1.2), bb.f1, CC.barbara - 6, CC.barbara - 6 + (bb.f1 - T("barbara", 1.2)))}
        keys={[{ f: T("barbara", 1.2), cx: 1648, cy: 330, z: 1.9 }, { f: T("barbara", 3.2), cx: 1648, cy: 360, z: 2.05 }, { f: bb.f1, cx: 1648, cy: 380, z: 2.05 }]} />
      <Chip a={T("barbara", 4.7)} b={bb.f1} icon={ICON.check} text="Saved to the case · both offices" tone="green" y={780} size={36} />
      <Sparkle at={T("barbara", 3.4)} x={760} y={1250} color="#5EE6A8" />
      {/* u09: Dr. Vance refreshes: the newest pano is there */}
      <Glass a={rd.f0 + 2} b={rd.f1 + 2} y={930} w={960} h={640} screen="dayprep" title="Day-Prep Station · Maria Ortiz"
        screenFrame={lin(rd.f0 + 4, rd.f0 + 4 + (DP.reply + 24 - (DP.thumb - 14)), DP.thumb - 14, DP.reply + 24)}
        keys={[{ f: rd.f0, cx: 734, cy: 430, z: 1.7 }, { f: rd.f0 + 40, cx: 734, cy: 440, z: 2.05 }, { f: rd.f1, cx: 760, cy: 470, z: 2.1 }]} />
      <Chip a={T("ready", 1.4)} b={rd.f1} icon={ICON.check} text="Newest X-ray · ready" tone="green" y={810} />
      <Sparkle at={T("ready", 1.0)} x={540} y={1240} color="#5EE6A8" />
      <LightLeak at={S.chat.f0 - 4} /><LightLeak at={S.square.f0 - 4} /><LightLeak at={S.ready.f0 - 4} /><LightLeak at={END_AT - 4} dur={22} />
    </>
  );
};

// ---------------------------------------------------------------------------------------------------
// Captions: word by word, keyword pills

type Wd = { word: string; start: number; end: number };
const WMAP = words as unknown as Record<string, { words: Wd[] }>;
const HOT: Record<string, string> = {
  shaking: AMBER, xray: AMBER, note: PURPLE, voicemail: AMBER, phone: AMBER, tag: AMBER, minutes: AMBER, case: PURPLE, offices: PURPLE,
  thread: PURPLE, straightforward: GREEN, seconds: GREEN, calling: AMBER, test: PURPLE, own: AMBER, ready: GREEN, together: GREEN,
};
const norm = (w: string) => w.toLowerCase().replace(/[^a-z0-9]/g, "");
type Tok = { t: string; at: number; end: number; hot?: string };
const TOKS: Tok[] = (() => {
  const out: Tok[] = [];
  for (const s of SEGS) {
    if (!s.clip) continue;
    const list = WMAP[`${s.clip}.wav`]?.words ?? [];
    for (const w of list) {
      if (w.start < s.a - 0.05 || w.end > s.b + 0.05) continue;
      let t = w.word.trim();
      if (/^beep/i.test(t)) continue;
      const prev = out[out.length - 1];
      if (prev && t.startsWith("-")) { prev.t += t; prev.end = T(s.id, w.end); continue; }
      if (t === "30") t = "thirty";
      out.push({ t, at: T(s.id, w.start), end: T(s.id, w.end) });
    }
  }
  const VW = vwords as unknown as Record<string, { words: Wd[] }>;
  for (const l of LINES) {
    for (const w of VW[`${l.name}.wav`].words) {
      const t = w.word.trim().replace(/^mentioned/, "mention");
      out.push({ t, at: T(l.seg, l.at + w.start), end: T(l.seg, l.at + w.end) });
    }
  }
  out.sort((x, y) => x.at - y.at);
  return out;
})();
const CHUNKS = (() => {
  const chunks: { words: Tok[]; from: number; to: number }[] = [];
  let cur: Tok[] = [];
  const flush = () => { if (cur.length) chunks.push({ words: cur, from: cur[0].at - 2, to: cur[cur.length - 1].end + 12 }); cur = []; };
  for (const tk of TOKS) {
    const len = cur.map((x) => x.t).join(" ").length;
    if (cur.length && (cur.length >= 4 || len + tk.t.length > 20 || tk.at - cur[cur.length - 1].end > 18)) flush();
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
    <div style={{ position: "absolute", left: 40, right: 40, top: 1620, textAlign: "center", fontFamily: FONT_UI, fontWeight: 800, letterSpacing: "-0.025em", lineHeight: 1.15, fontSize: 62, color: W, opacity: 1 - out, filter: out > 0 ? `blur(${out * 6}px)` : undefined }}>
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
          }}>{w.t}</span>
        );
      })}
    </div>
  );
};

// ---------------------------------------------------------------------------------------------------

const EndCard: React.FC = () => {
  const frame = useCurrentFrame();
  const a = END_AT;
  if (frame < a) return null;
  const t = sp(frame, a + 18, 14, 140);
  const u = sp(frame, a + 40, 14, 140);
  const d = Math.sin(frame / 40) * 60;
  return (
    <AbsoluteFill style={{ opacity: interpolate(frame, [a, a + 6], [0, 1], clamp), background: `radial-gradient(circle at ${50 + d / 20}% 35%, #3B1E8F 0%, #1B1240 55%, #0C0820 100%)`, alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 46 }}>
      <LogoReveal at={a + 4} width={660} revealDur={18} />
      <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: 80, color: W, letterSpacing: "-0.04em", textAlign: "center", lineHeight: 1.02, opacity: t, translate: `0px ${(1 - t) * 30}px`, filter: t < 0.7 ? `blur(${(0.7 - t) * 14}px)` : undefined }}>
        Stop calling.<br /><span style={{ color: VIOLET }}>Start collaborating.</span>
      </div>
      <div style={{ padding: "16px 34px", borderRadius: 999, background: "rgba(255,255,255,0.1)", border: "1.5px solid rgba(196,181,253,0.45)", fontFamily: FONT_UI, fontWeight: 700, fontSize: 36, color: W, opacity: u, translate: `0px ${(1 - u) * 20}px` }}>
        Next episode: Greg's on his own
      </div>
    </AbsoluteFill>
  );
};

const Sfx: React.FC = () => {
  const s = (f: string, at: number, v = 0.3, dur = 3) => (
    <Sequence from={at} durationInFrames={RF(dur)}><Audio src={staticFile(`audio/sfx/${f}.wav`)} volume={v} /></Sequence>
  );
  return (
    <>
      {s("whoosh-short", S.dayprep.f0 - 3, 0.28)}{s("pop-1", T("dayprep", 6.5), 0.22)}
      {s("pop-2", T("note", 1.6), 0.2)}{s("typing", T("note", 4.1), 0.32)}{s("click", T("note", 6.55), 0.35)}{s("whoosh-short", T("note", 6.6), 0.22)}
      {s("chime", T("call", 0.75), 0.3)}{s("ring", T("call", 2.6), 0.08)}
      {s("ring", T("voicemail", 0.35), 0.32)}{s("ring", T("voicemail", 2.75), 0.32)}{s("vm-beep", T("voicemail", 4.3), 0.25)}{s("pop-1", T("voicemail", 3.5), 0.18)}
      {[0, 1, 2, 3, 4, 5].map((k) => <React.Fragment key={k}>{s(`tick-${k + 1}`, T("tenmin", 0.1 + k * 0.5), 0.14, 1)}</React.Fragment>)}
      {s("ring", T("missed", 3.9), 0.34)}{s("ring-cut", T("missed", 5.95), 0.34)}{s("thud", T("missed", 6.05), 0.25)}
      {s("whoosh-short", S.square.f0, 0.28)}{s("pop-1", L("tanya_square", 0.0), 0.22)}{s("vm-beep", L("tanya_square", 1.1), 0.12)}{s("ring-cut", L("tanya_square", 2.55), 0.22)}{s("impact", L("tanya_square", 5.0), 0.2)}
      {s("riser", S.chat.f0 - 26, 0.2)}{s("whoosh-short", S.chat.f0, 0.3)}{s("click", L("amanda_stop", 1.9), 0.3)}{s("whoosh-short", L("amanda_stop", 2.7), 0.26)}{s("typing", L("amanda_mention", 0.15), 0.3)}{s("click", L("amanda_mention", 3.5), 0.4)}{s("blip-1", L("amanda_mention", 3.55), 0.25)}
      {s("whoosh-short", S.tail.f0, 0.24)}{s("pop-1", L("amanda_tail", 0.55), 0.2)}{s("pop-2", L("amanda_tail", 1.4), 0.2)}{s("pop-3", L("amanda_tail", 2.2), 0.2)}{s("chime", L("amanda_tail", 2.55), 0.28)}
      {s("chime", T("barbara", 0.3), 0.26)}{s("whoosh-short", T("barbara", 1.2), 0.22)}{s("pop-2", T("barbara", 3.4), 0.24)}{s("chime", T("barbara", 4.7), 0.28)}
      {s("click", T("ready", 0.3), 0.3)}{s("shimmer", T("ready", 1.0), 0.28)}
      {s("impact", T("thirty", 1.0), 0.18)}{s("shimmer", END_AT, 0.32)}
    </>
  );
};

const Grain: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ pointerEvents: "none", opacity: 0.06, mixBlendMode: "overlay", backgroundImage: "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220'><filter id='n'><feTurbulence baseFrequency='0.9' numOctaves='2' seed='" + (frame % 9) + "'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")" }} />
  );
};

export const Ep2Story: React.FC = () => (
  <FontGate>
    <AbsoluteFill style={{ background: "#0C0820" }}>
      <Footage layer="plate" />
      <BehindWords />
      <Footage layer="cutout" />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 45%, transparent 55%, rgba(8,4,20,0.42) 100%)" }} />
      <Label a={T("note", 0.9)} b={T("note", 3.6)} office="St. Andrew's Family Dental" kind="Dr. Vance · oral surgeon" />
      <Label a={S.call.f0 + 4} b={T("call", 0.7)} office="St. Andrew's · front desk" kind="Amanda and Tanya" />
      <Label a={S.voicemail.f0 + 4} b={S.voicemail.f1 - 4} office="Gentle Dental" kind="The referring office" />
      <Label a={S.barbara.f0 + 4} b={T("barbara", 4.5)} office="Gentle Dental" kind="Barbara · front desk" />
      <Product />
      <Captions />
      <EndCard />
      <Grain />
      <Audio src={staticFile("audio/music/s13-bed.wav")} volume={(f) => (f < S.chat.f0 ? 0.05 : f < END_AT ? 0.075 : 0.14)} loop />
      <Sfx />
      {LINES.map((l) => <Sequence key={l.name} from={T(l.seg, l.at)}><Audio src={staticFile(`ep2/voice/${l.name}.wav`)} /></Sequence>)}
    </AbsoluteFill>
  </FontGate>
);
