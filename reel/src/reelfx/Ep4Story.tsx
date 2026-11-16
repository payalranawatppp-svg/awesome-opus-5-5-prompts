/**
 * Episode 4 "Front Row": 16 Google Flow clips (public/ep4/eNN.mp4: Flow watermark removed, 1080x1920, loudness
 * normalised, speech re-voiced with one ElevenLabs voice per character) cut into one story, with the completion-note
 * flow (CompletionNote, rebuilt from the user's recording) playing in transparent 3D glass windows in time with each line.
 *
 * Fixes in the cut: e05 and e06 carry a screen panel Flow baked into the top right (covered by a frosted panel and the
 * glass dashboard); e08 Dr. Vance walks out of frame after 5 s (cut); e15 arrived as a 720x800 crop (reframed on Greg);
 * the recital clip (13) was not delivered, so Tanya's closing line plays over her photo-frame moment from e01.
 *
 * Layers, back to front: footage · text-behind words · person cutout · vignette · frosted covers · 3D glass dashboards
 * and chips · captions (y >= 1600) · end card.
 */
import React from "react";
import { AbsoluteFill, Audio, Freeze, OffthreadVideo, Sequence, interpolate, spring, staticFile, useCurrentFrame } from "remotion";
import words from "../data/ep4-words.json";
import { FontGate } from "../effects";
import { FONT_DISPLAY, FONT_UI } from "../theme";
import { LogoReveal, easeIO, easeOut, ramp } from "../tr/motion";
import { ICON, Icon, clamp } from "../tr/ui";
import { LightLeak, Sparkle } from "./S20Dash";
import { CompletionNote } from "./CompletionNote";

const FPS = 30;
const RF = (s: number) => Math.round(s * FPS);
const AMBER = "#FFB020";
const PURPLE = "#8B5CF6";
const VIOLET = "#C4B5FD";
const GREEN = "#1FCA7A";
const INK = "#16131F";
const W = "#FFFFFF";
const SOFT = "0 2px 16px rgba(10,6,24,0.55), 0 1px 3px rgba(10,6,24,0.5)";
const I_CLOCK = "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM12 6v6l4 2";
const I_PEN = "M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z";
const I_COPY = "M9 9h11v11H9zM5 15H4V4h11v1";
const I_CHART = "M3 3v18h18M7 15l4-4 3 3 6-6";
const I_MUSIC = "M9 18V5l12-2v13M9 18a3 3 0 1 1-6 0 3 3 0 0 1 6 0zm12-2a3 3 0 1 1-6 0 3 3 0 0 1 6 0z";

const sp = (frame: number, a: number, damping = 14, stiffness = 170) =>
  frame < a ? 0 : spring({ frame: frame - a, fps: FPS, config: { damping, stiffness, mass: 0.7 } });
const life = (frame: number, a: number, b: number, inD = 10, outD = 8) =>
  Math.min(interpolate(frame, [a, a + inD], [0, 1], clamp), interpolate(frame, [b - outD, b], [1, 0], clamp));

// ---------------------------------------------------------------------------------------------------
// Edit decision list (clip seconds). "home" is a held frame of e01 under Tanya's closing line.

type Seg = { id: string; clip: string; a: number; b: number; hold?: boolean };
const PLAN: Seg[] = [
  { id: "promise", clip: "e01", a: 0.7, b: 6.9 },
  { id: "spring", clip: "e02", a: 1.0, b: 6.8 },
  { id: "cases", clip: "e03", a: 1.3, b: 6.0 },
  { id: "clock", clip: "e04", a: 0.9, b: 6.8 },
  { id: "word", clip: "e05", a: 0.9, b: 6.3 },
  { id: "filled", clip: "e06", a: 0.45, b: 6.95 },
  { id: "route", clip: "e07", a: 0.2, b: 4.7 },
  { id: "signed", clip: "e08", a: 0.9, b: 5.0 },
  { id: "already", clip: "e09", a: 0.9, b: 5.3 },
  { id: "barbara", clip: "e09b", a: 0.5, b: 4.1 },
  { id: "pms", clip: "e10", a: 0.3, b: 7.2 },
  { id: "montage", clip: "e11", a: 0.9, b: 7.1 },
  { id: "park", clip: "e12", a: 1.1, b: 5.6 },
  { id: "home", clip: "e01", a: 0.15, b: 5.4, hold: true },
  { id: "week", clip: "e14", a: 0.35, b: 5.9 },
  { id: "owner", clip: "e15", a: 1.5, b: 4.6 },
  { id: "story", clip: "e16", a: 1.2, b: 4.5 },
];
const SEGS = (() => {
  let at = 0;
  return PLAN.map((s) => { const f0 = RF(at); at += s.b - s.a; return { ...s, f0, f1: RF(at) }; });
})();
const S = Object.fromEntries(SEGS.map((s) => [s.id, s])) as Record<string, (typeof SEGS)[number]>;
const T = (id: string, t: number) => S[id].f0 + RF(t - S[id].a);
const END_AT = SEGS[SEGS.length - 1].f1;
export const EP4_DURATION = END_AT + RF(4.8);
/** The closing line (ElevenLabs, Tanya), placed at clip time `at` of "home". */
const HOME_AT = 0.45;

// ---------------------------------------------------------------------------------------------------
// Footage: slow push-in per shot, a punch on emphasis, whip pans between scenes, a cool grade on the flashback

const WHIPS = [S.spring.f0, S.cases.f0, S.signed.f0, S.barbara.f0, S.montage.f0, S.home.f0, S.week.f0];
const PUNCH = [T("promise", 1.35), T("clock", 1.6), T("filled", 0.8), T("signed", 1.75), T("montage", 1.45), T("story", 2.15)];
const GRADE: Record<string, string> = { spring: "saturate(0.55) brightness(0.86) contrast(1.06) hue-rotate(8deg)", home: "saturate(1.15) brightness(1.04) sepia(0.12)" };
const Clip: React.FC<{ s: (typeof SEGS)[number]; cutout?: boolean }> = ({ s, cutout }) => {
  const frame = useCurrentFrame();
  const g = frame + s.f0;
  let sc = 1.02 + (s.hold ? 0.16 : 0.05) * ramp(g, s.f0, s.f1, (t) => t);
  for (const p of PUNCH) if (g >= p && g < s.f1) sc += 0.08 * Math.exp(-(g - p) / 8);
  let wx = 0, wb = 0;
  for (const w of WHIPS) { const k = Math.max(0, 1 - Math.abs(g - w) / 6); wx += (g < w ? -1 : 1) * k * 90; wb += k * 22; sc += k * 0.18; }
  const filters = [GRADE[s.id], wb > 0.5 ? `blur(${wb}px)` : ""].filter(Boolean).join(" ");
  const style: React.CSSProperties = { position: "absolute", left: 0, top: 0, width: 1080, height: 1920, transform: `translateX(${wx}px) scale(${sc})`, transformOrigin: s.hold ? "40% 52%" : "50% 36%", filter: filters || undefined };
  const edge = (f: number) => Math.min(interpolate(f, [0, 3], [0, 1], clamp), interpolate(f, [s.f1 - s.f0 - 3, s.f1 - s.f0], [1, 0], clamp));
  const src = staticFile(`ep4/${s.clip}${cutout ? "-cut.webm" : ".mp4"}`);
  const own = !cutout && !s.hold && !REVOICED.has(s.clip);
  const video = <OffthreadVideo src={src} muted={!own} volume={own ? (f: number) => 0.6 * edge(f) : undefined} transparent={cutout} trimBefore={RF(s.a)} style={style} />;
  if (s.hold) return <Freeze frame={0}>{video}</Freeze>;
  return <>{video}{!cutout && !own && <Audio src={staticFile(`ep4/voice/${s.clip}.wav`)} trimBefore={RF(s.a)} volume={edge} />}</>;
};
/** Clips with no spoken line keep their own room sound. */
const REVOICED = new Set(["e01", "e02", "e03", "e04", "e05", "e06", "e07", "e08", "e09", "e10", "e11", "e12", "e14", "e15", "e16"]);
const CUTOUTS = new Set(["clock", "montage", "park", "home"]);
const Footage: React.FC<{ layer: "plate" | "cutout" }> = ({ layer }) => (
  <>
    {SEGS.map((s) => {
      if (layer === "cutout" && !CUTOUTS.has(s.id)) return null;
      return <Sequence key={s.id} from={s.f0} durationInFrames={s.f1 - s.f0}><Clip s={s} cutout={layer === "cutout"} /></Sequence>;
    })}
  </>
);

// ---------------------------------------------------------------------------------------------------
// Text behind the people

type Behind = { text: string; a: number; b: number; c1: string; c2: string; y?: number };
const BEHIND: Behind[] = [
  { text: "43\nMINUTES", a: T("clock", 1.0), b: T("clock", 4.2), c1: AMBER, c2: "#FFE08A", y: 110 },
  { text: "3/3\nCLOSED", a: T("montage", 2.3), b: T("montage", 4.9), c1: GREEN, c2: "#C9F7DF", y: 110 },
  { text: "20 MIN\nTO SPARE", a: T("montage", 5.0), b: S.montage.f1, c1: "#B48CFF", c2: W, y: 110 },
  { text: "ON\nTIME", a: T("park", 2.6), b: S.park.f1, c1: "#B48CFF", c2: W, y: 110 },
  { text: "FRONT\nROW", a: T("home", 0.6), b: S.home.f1, c1: "#FFD36E", c2: W, y: 140 },
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
// Transparent 3D glass window onto the completion-note screens (1920x842). The camera keys are in screen frames,
// so every zoom follows what is happening on the screen.

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
const lin = (o0: number, o1: number, s0: number, s1: number) => (f: number) => interpolate(f, [o0, o1], [s0, s1], clamp);
const Glass: React.FC<{ a: number; b: number; y: number; w?: number; h: number; keys: Cam[]; screenFrame: (f: number) => number; title: string; tilt?: number; veil?: boolean }> =
  ({ a, b, y, w = 1000, h, keys, screenFrame, title, tilt = 1, veil = false }) => {
  const frame = useCurrentFrame();
  if (frame < a - 1 || frame > b) return null;
  const p = sp(frame, a, 15, 120);
  const out = interpolate(frame, [b - 10, b], [0, 1], clamp);
  const sf = Math.max(0, Math.round(screenFrame(frame)));
  const cam = camAt(keys, sf);
  const drift = Math.sin((frame - a) / 30);
  const rx = (1 - p) * 55 + 6 + out * -25;
  const ry = tilt * (-14 * (1 - p) - 5 + drift * 3);
  return (
    <>
      {veil && <AbsoluteFill style={{ backdropFilter: `blur(${10 * Math.min(p, 1 - out)}px)`, background: `rgba(8,4,20,${0.3 * Math.min(p, 1 - out)})` }} />}
      <div style={{ position: "absolute", left: 540 - w / 2, top: y, width: w, height: h, perspective: 1600, opacity: Math.min(1, p * 1.5) * (1 - out) }}>
        <div style={{
          position: "absolute", inset: 0, borderRadius: 34, padding: 14, boxSizing: "border-box",
          background: "linear-gradient(145deg, rgba(255,255,255,0.22), rgba(255,255,255,0.06))", border: "1.5px solid rgba(255,255,255,0.45)",
          backdropFilter: "blur(16px)", boxShadow: `0 40px 90px rgba(6,3,18,0.55), 0 0 60px ${PURPLE}44, inset 0 1px 0 rgba(255,255,255,0.5)`,
          transform: `translateY(${(1 - p) * 160 - out * 80}px) rotateX(${rx}deg) rotateY(${ry}deg) scale(${0.72 + 0.28 * p})`, transformOrigin: "50% 60%",
          filter: out > 0 ? `blur(${out * 10}px)` : undefined,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, height: 34, padding: "0 8px" }}>
            {["#F5F3FF", "#DDD6FE", "#C4B5FD"].map((c) => <div key={c} style={{ width: 13, height: 13, borderRadius: 13, background: c, opacity: 0.85 }} />)}
            <div style={{ marginLeft: 10, fontFamily: FONT_UI, fontWeight: 700, fontSize: 22, color: W, textShadow: SOFT, letterSpacing: "-0.01em", whiteSpace: "nowrap" }}>{title}</div>
          </div>
          <div style={{ position: "relative", width: w - 28, height: h - 62, borderRadius: 22, overflow: "hidden", background: "#fff", boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.25)" }}>
            <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 842, transformOrigin: "0 0", transform: `translate(${(w - 28) / 2 - cam.cx * cam.z}px, ${(h - 62) / 2 - cam.cy * cam.z}px) scale(${cam.z})` }}>
              <Freeze frame={sf}><CompletionNote /></Freeze>
            </div>
            <div style={{ position: "absolute", inset: 0, background: `linear-gradient(${115 + drift * 8}deg, rgba(255,255,255,0.16) 0%, rgba(255,255,255,0) 32%, rgba(255,255,255,0) 70%, rgba(255,255,255,0.08) 100%)`, pointerEvents: "none" }} />
          </div>
        </div>
      </div>
    </>
  );
};

/** Frosted panel over the screen panel Flow baked into the top right of e05/e06. */
const Cover: React.FC<{ a: number; b: number }> = ({ a, b }) => {
  const frame = useCurrentFrame();
  if (frame < a || frame >= b) return null;
  return <div style={{ position: "absolute", left: 680, top: -20, width: 440, height: 470, borderRadius: "0 0 0 60px", backdropFilter: "blur(34px) saturate(1.1)", background: "rgba(40,30,25,0.18)", opacity: interpolate(frame, [b - 8, b], [1, 0], clamp) }} />;
};

// ---------------------------------------------------------------------------------------------------
// Chips, labels, the week card

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
      <div style={{ position: "relative", display: "inline-flex", alignItems: "center", gap: 16, padding: `${size * 0.45}px ${size * 0.8}px`, borderRadius: 999, background: bg, color: fg, fontFamily: FONT_UI, fontWeight: 800, fontSize: size, letterSpacing: "-0.02em", boxShadow: "0 18px 40px rgba(10,6,24,0.45)", transform: `rotateX(${(1 - p) * 80}deg) scale(${0.6 + 0.4 * p})`, transformOrigin: "50% 100%", filter: p < 0.6 ? `blur(${(0.6 - p) * 12}px)` : undefined, whiteSpace: "nowrap" }}>
        <Icon d={icon} size={size * 0.95} color={fg} />
        {text}
        {st > 0 && <div style={{ position: "absolute", left: 24, top: "50%", height: 7, width: `calc(${st * 100}% - 48px)`, background: INK, borderRadius: 7, rotate: "-4deg" }} />}
      </div>
    </div>
  );
};

const Label: React.FC<{ a: number; b: number; office: string; kind: string; icon?: string }> = ({ a, b, office, kind, icon = ICON.shield }) => {
  const frame = useCurrentFrame();
  if (frame < a || frame > b) return null;
  const p = sp(frame, a, 13, 160);
  return (
    <div style={{ position: "absolute", left: 50, top: 90, opacity: life(frame, a, b, 6, 8), translate: `${(1 - p) * -60}px 0px`, display: "flex", alignItems: "center", gap: 18, padding: "14px 26px 14px 16px", borderRadius: 24, background: "rgba(22,14,48,0.72)", border: "1.5px solid rgba(196,181,253,0.4)", backdropFilter: "blur(10px)", boxShadow: "0 16px 40px rgba(10,6,24,0.4)" }}>
      <div style={{ width: 52, height: 52, borderRadius: 16, background: "linear-gradient(135deg, #7C3AED, #B48CFF)", display: "flex", alignItems: "center", justifyContent: "center" }}><Icon d={icon} size={30} color={W} /></div>
      <div style={{ fontFamily: FONT_UI, color: W }}>
        <div style={{ fontWeight: 800, fontSize: 32, letterSpacing: "-0.02em" }}>{office}</div>
        <div style={{ fontWeight: 600, fontSize: 24, color: VIOLET }}>{kind}</div>
      </div>
    </div>
  );
};

/** The week at Oakridge, as a 3D glass card (e14). */
const WeekCard: React.FC<{ a: number; b: number }> = ({ a, b }) => {
  const frame = useCurrentFrame();
  if (frame < a - 1 || frame > b) return null;
  const p = sp(frame, a, 15, 120);
  const o = life(frame, a, b, 6, 10);
  const rows: [string, number, string, number][] = [["Referrals received", 18, "", a + 12], ["Closed with a signed note", 18, GREEN, a + 22], ["Lost or forgotten", 0, AMBER, T("week", 1.4)], ["Tanya left on time", 5, PURPLE, T("week", 3.9)]];
  return (
    <div style={{ position: "absolute", left: 90, right: 90, top: 300, perspective: 1400, opacity: o }}>
      <div style={{ borderRadius: 34, padding: "26px 30px", background: "linear-gradient(145deg, rgba(255,255,255,0.22), rgba(255,255,255,0.06))", border: "1.5px solid rgba(255,255,255,0.45)", backdropFilter: "blur(16px)", boxShadow: `0 40px 90px rgba(6,3,18,0.55), 0 0 50px ${PURPLE}44`, transform: `rotateX(${(1 - p) * 55 + 7}deg) rotateY(${-7 + Math.sin((frame - a) / 30) * 3}deg) translateY(${(1 - p) * 160}px) scale(${0.75 + 0.25 * p})`, fontFamily: FONT_UI }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, color: W, fontWeight: 800, fontSize: 32, marginBottom: 18, textShadow: SOFT }}><Icon d={I_CHART} size={34} color={W} />Oakridge Oral Surgery · this week</div>
        {rows.map(([t, n, c, at], i) => {
          const k = sp(frame, at, 12, 170);
          const shown = Math.round(n * Math.min(1, k * 1.1));
          return (
            <div key={t} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 24px", marginTop: i ? 12 : 0, borderRadius: 20, background: "rgba(255,255,255,0.95)", opacity: k, transform: `translateX(${(1 - k) * 120}px)` }}>
              <div style={{ fontWeight: 700, fontSize: 30, color: INK }}>{t}</div>
              <div style={{ minWidth: 92, textAlign: "center", padding: "6px 18px", borderRadius: 999, fontWeight: 800, fontSize: 34, background: c ? `${c}22` : "#F1EEF9", color: c === AMBER ? "#B45309" : c === GREEN ? "#11804A" : c ? "#6D28D9" : INK }}>{i === 3 ? `${shown}/5` : shown}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

/** Folder counter for the montage. */
const Counter: React.FC = () => {
  const frame = useCurrentFrame();
  const a = S.montage.f0 + 4, b = S.montage.f1;
  if (frame < a || frame > b) return null;
  const n = frame < T("montage", 1.5) ? 1 : frame < T("montage", 3.3) ? 2 : 3;
  const ticks = [T("montage", 1.5), T("montage", 3.3)];
  const pop = Math.max(...ticks.map((t) => (frame >= t ? Math.exp(-(frame - t) / 6) : 0)));
  const p = sp(frame, a, 13, 160);
  return (
    <div style={{ position: "absolute", right: 60, top: 1290, opacity: life(frame, a, b, 6, 8), transform: `scale(${(0.7 + 0.3 * p) * (1 + 0.12 * pop)})`, transformOrigin: "100% 50%", display: "flex", alignItems: "center", gap: 16, padding: "16px 28px", borderRadius: 26, background: "rgba(22,14,48,0.78)", border: "1.5px solid rgba(94,230,168,0.6)", backdropFilter: "blur(12px)", fontFamily: FONT_UI, color: W }}>
      <Icon d={ICON.check} size={40} color="#5EE6A8" />
      <div><div style={{ fontWeight: 800, fontSize: 44, letterSpacing: "-0.02em" }}>{n}/3 closed</div><div style={{ fontWeight: 600, fontSize: 22, color: VIOLET }}>auto-fill · route · eSign · copy to PMS</div></div>
    </div>
  );
};

// CompletionNote key frames (its own 30 fps timeline; see CompletionNote.tsx)
const CN = { chip: 34, m1: 46, official: 212, m2: 226, tplOpen: 250, tplPick: 274, fill: 284, type: 372, typeEnd: 492, route: 548, doc: 566, sendBtn: 600, sign: 640, field: 676, strokeEnd: 738, finish: 768, signed: 774, back: 828, docCard: 838, chatMsg: 858, copy: 930 };

const Product: React.FC = () => {
  const wd = S.word, fl = S.filled, rt = S.route, sg = S.signed, al = S.already, bb = S.barbara, pm = S.pms;
  return (
    <>
      {/* 05 Amanda: "Don't open Word. Use the templates..." → case → Consultation Completed → Create official note */}
      <Cover a={wd.f0} b={T("filled", 3.2)} />
      <Chip a={T("word", 1.3)} b={T("word", 2.9)} icon={ICON.clip} text="Blank Word document" tone="dark" y={250} size={44} strike={T("word", 2.1)} />
      <Glass a={T("word", 2.9)} b={wd.f1 + 2} y={70} h={640} title="Mr. Turner · Implant consult · Oakridge Oral Surgery"
        screenFrame={lin(T("word", 2.95), T("word", 6.2), 0, CN.official + 8)}
        keys={[{ f: 0, cx: 1560, cy: 470, z: 1.3 }, { f: CN.chip + 6, cx: 1560, cy: 480, z: 1.45 }, { f: CN.m1 + 10, cx: 960, cy: 380, z: 0.95 }, { f: 150, cx: 960, cy: 420, z: 0.95 }, { f: CN.official, cx: 940, cy: 690, z: 1.5 }]} />
      {/* 06 Tanya: "it already filled in the patient info, the tooth number, and the referring doctor" */}
      <Glass a={fl.f0} b={fl.f1 + 2} y={70} h={640} title="Prepare Consultation Note · Oakridge letterhead"
        screenFrame={(f) => interpolate(f, [fl.f0, T("filled", 1.7), T("filled", 2.4), T("filled", 3.9), T("filled", 6.6)], [CN.m2 + 4, CN.tplPick + 2, CN.fill + 32, CN.fill + 62, CN.type - 30], clamp)}
        keys={[{ f: CN.m2 + 4, cx: 700, cy: 240, z: 1.3 }, { f: CN.tplPick + 4, cx: 640, cy: 270, z: 1.45 }, { f: CN.fill + 10, cx: 800, cy: 420, z: 1.25 }, { f: CN.fill + 60, cx: 760, cy: 520, z: 1.5 }, { f: CN.type - 30, cx: 760, cy: 470, z: 1.35 }]} />
      <Chip a={T("filled", 2.6)} b={T("filled", 3.6)} icon={ICON.check} text="Patient info" tone="green" y={760} size={36} />
      <Chip a={T("filled", 3.75)} b={T("filled", 4.7)} icon={ICON.check} text="Tooth #30" tone="green" y={760} size={36} />
      <Chip a={T("filled", 4.85)} b={fl.f1} icon={ICON.check} text="Dr. Moore · Gentle Dental" tone="green" y={760} size={36} />
      {/* 07 Amanda V.O.: "You just add the final note and route it straight to the doctor to sign." */}
      <Glass a={rt.f0} b={rt.f1 + 2} y={70} h={660} title="Final note → Route to Dr. Vance"
        screenFrame={lin(rt.f0, T("route", 4.4), CN.type, CN.sendBtn + 14)}
        keys={[{ f: CN.type, cx: 820, cy: 400, z: 1.3 }, { f: CN.typeEnd, cx: 900, cy: 420, z: 1.3 }, { f: CN.route, cx: 600, cy: 580, z: 1.5 }, { f: CN.doc + 6, cx: 640, cy: 620, z: 1.5 }, { f: CN.sendBtn, cx: 1100, cy: 740, z: 1.4 }]} />
      <Chip a={T("route", 2.5)} b={rt.f1} icon={I_PEN} text="Routed to Dr. Vance" tone="purple" y={760} size={38} />
      {/* 08 Dr. Vance signs on his tablet */}
      <Glass a={sg.f0 + 2} b={T("signed", 2.3)} y={980} h={600} title="Dr. Vance's tablet · Sign Consultation Note"
        screenFrame={lin(sg.f0 + 2, T("signed", 2.2), CN.field - 4, CN.signed + 14)}
        keys={[{ f: CN.field - 4, cx: 640, cy: 470, z: 1.35 }, { f: CN.strokeEnd, cx: 640, cy: 520, z: 1.6 }, { f: CN.finish - 4, cx: 1500, cy: 200, z: 1.2 }, { f: CN.signed + 10, cx: 906, cy: 430, z: 1.15 }]} />
      <Chip a={T("signed", 2.3)} b={sg.f1} icon={ICON.check} text="Signed · approved" tone="green" y={1380} size={42} />
      <Sparkle at={T("signed", 2.3)} x={540} y={1420} color="#5EE6A8" />
      {/* 09 Tanya: "So Gentle Dental already has the signed letter on the case?" */}
      <Glass a={al.f0} b={al.f1 + 2} y={70} h={600} title="Mr. Turner's case · both offices"
        screenFrame={lin(al.f0, al.f1, CN.back + 4, CN.chatMsg + 40)}
        keys={[{ f: CN.back + 4, cx: 1100, cy: 560, z: 1.55 }, { f: CN.chatMsg - 4, cx: 1100, cy: 560, z: 1.6 }, { f: CN.chatMsg + 20, cx: 1640, cy: 90, z: 1.7 }]} />
      {/* 09B Barbara at Gentle Dental sees it land */}
      <Label a={bb.f0 + 3} b={bb.f1 - 2} office="Gentle Dental" kind="Barbara · front desk" />
      <Glass a={T("barbara", 0.9)} b={bb.f1 + 2} y={1000} h={560} title="Gentle Dental · Mr. Turner's case" tilt={-1}
        screenFrame={() => CN.docCard + 30}
        keys={[{ f: 0, cx: 1100, cy: 555, z: 1.8 }]} />
      <Chip a={T("barbara", 1.6)} b={bb.f1} icon={ICON.check} text="Signed note · on the case" tone="green" y={860} size={36} />
      {/* 10 Amanda: "with one click you copy it straight into our PMS. No scanning, no printing, and no faxing." */}
      <Glass a={pm.f0 + 2} b={T("pms", 4.2)} y={70} h={580} title="Copy to PMS"
        screenFrame={lin(T("pms", 0.4), T("pms", 4.1), CN.copy - 56, CN.copy + 50)}
        keys={[{ f: CN.copy - 56, cx: 1090, cy: 560, z: 1.6 }, { f: CN.copy, cx: 1080, cy: 600, z: 2.05 }, { f: CN.copy + 50, cx: 1050, cy: 640, z: 1.55 }]} />
      <Chip a={T("pms", 4.5)} b={pm.f1} icon={ICON.clip} text="Scanning" tone="dark" y={300} size={50} strike={T("pms", 4.9)} />
      <Chip a={T("pms", 5.4)} b={pm.f1} icon={I_COPY} text="Printing" tone="dark" y={460} size={50} strike={T("pms", 5.8)} />
      <Chip a={T("pms", 6.2)} b={pm.f1} icon={ICON.send} text="Faxing" tone="dark" y={620} size={50} strike={T("pms", 6.6)} />
      {/* 11 montage, 12 the clock */}
      <Counter />
      <Chip a={T("park", 1.0)} b={S.park.f1} icon={I_CLOCK} text="4:38 PM · left on time" tone="green" y={1360} size={40} />
      <Chip a={T("home", 0.2)} b={S.home.f1} icon={I_MUSIC} text="5:25 PM · Lily's recital" tone="amber" y={1360} size={40} />
      {/* 14 the week, 15 analytics */}
      <WeekCard a={S.week.f0 + 3} b={S.week.f1} />
      <Chip a={T("owner", 2.3)} b={S.owner.f1} icon={I_CHART} text="Analytics · owner's view" tone="purple" y={1340} size={40} />
      <LightLeak at={S.spring.f0 - 4} /><LightLeak at={S.cases.f0 - 4} /><LightLeak at={S.home.f0 - 4} dur={22} /><LightLeak at={END_AT - 4} dur={22} />
    </>
  );
};

// ---------------------------------------------------------------------------------------------------
// Captions: word by word, keyword pills

type Wd = { word: string; start: number; end: number };
const WMAP = words as unknown as Record<string, { words: Wd[] }>;
/** Caption palette, matched to the footage: warm cream words, and keyword pills in honey (time, worry), lavender
 *  (Tanya's scrubs: the product) and sage (wins). */
const CAP = { text: "#FFF6E9", stroke: "rgba(40,22,10,0.5)", band: "rgba(34,20,12,0.34)" };
const PILL: Record<string, { bg: string; fg: string; glow: string }> = {
  honey: { bg: "linear-gradient(135deg, #F2A93B 0%, #FFD98A 100%)", fg: "#2B1605", glow: "#F2A93B" },
  lavender: { bg: "linear-gradient(135deg, #9C7BEA 0%, #D9CCFF 100%)", fg: "#1D1040", glow: "#9C7BEA" },
  sage: { bg: "linear-gradient(135deg, #4FBF8A 0%, #C6F0D9 100%)", fg: "#0C2A1B", glow: "#4FBF8A" },
};
const HOT: Record<string, string> = {
  front: "honey", recital: "honey", five: "honey", traffic: "honey", word: "honey", faxing: "honey", home: "honey", "530": "honey",
  templates: "lavender", route: "lavender", sign: "lavender", case: "lavender", click: "lavender", pms: "lavender", owners: "lavender", numbers: "lavender",
  filled: "sage", signed: "sage", easier: "sage", closed: "sage", spare: "sage", park: "sage", single: "sage",
};
const norm = (w: string) => w.toLowerCase().replace(/[^a-z0-9]/g, "");
type Tok = { t: string; at: number; end: number; hot?: string };
const TOKS: Tok[] = (() => {
  const out: Tok[] = [];
  for (const s of SEGS) {
    const key = s.hold ? "tanya_home.wav" : `${s.clip}.wav`;
    const off = s.hold ? s.a + HOME_AT : 0;
    for (const w of WMAP[key]?.words ?? []) {
      const ws = w.start + off, we = w.end + off;
      if (!s.hold && (ws < s.a - 0.05 || we > s.b + 0.05)) continue;
      let t = w.word.trim();
      if (t === "20") t = "twenty";
      if (/^gentle$/i.test(t)) t = "Gentle";
      if (/^dental\??$/i.test(t)) t = t.replace(/^d/, "D");
      if (t === "5.30") t = "5:30";
      const prev = out[out.length - 1];
      if (prev && /^\.\d/.test(t)) { prev.t = `${prev.t}:${t.slice(1)}`; prev.end = T(s.id, we); continue; }
      out.push({ t, at: T(s.id, ws), end: T(s.id, we) });
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
  const band = interpolate(frame, [c.from, c.from + 5], [0, 1], clamp) * (1 - out);
  return (
    <div style={{ position: "absolute", left: 40, right: 40, top: 1610, display: "flex", justifyContent: "center", opacity: 1 - out, filter: out > 0 ? `blur(${out * 6}px)` : undefined }}>
      <div style={{ padding: "14px 30px 18px", borderRadius: 36, background: CAP.band, backdropFilter: `blur(${10 * band}px)`, boxShadow: `0 14px 40px rgba(20,10,4,${0.25 * band})`, border: `1px solid rgba(255,236,210,${0.18 * band})`, textAlign: "center", fontFamily: FONT_UI, fontWeight: 800, letterSpacing: "-0.02em", lineHeight: 1.2, fontSize: 60, color: CAP.text }}>
        {c.words.filter((w) => frame >= w.at - 2).map((w, i, shown) => {
          const k = interpolate(frame, [w.at - 2, w.at + 3], [0, 1], clamp);
          const pill = w.hot && frame >= w.at ? PILL[w.hot] : undefined;
          const pop = pill ? sp(frame, w.at, 9, 260) : 1;
          return (
            <span key={i} style={{
              display: "inline-block", marginRight: i < shown.length - 1 ? "0.24em" : 0, opacity: k, translate: `0px ${(1 - k) * 14}px`,
              scale: String(pill ? 0.82 + 0.18 * pop : 1), filter: k < 1 ? `blur(${(1 - k) * 5}px)` : undefined,
              padding: pill ? "0.04em 0.24em 0.08em" : undefined, borderRadius: 18,
              background: pill?.bg, color: pill ? pill.fg : CAP.text,
              textShadow: pill ? "0 1px 0 rgba(255,255,255,0.35)" : "0 2px 12px rgba(30,14,4,0.55)",
              WebkitTextStroke: pill ? undefined : `6px ${CAP.stroke}`, paintOrder: "stroke fill",
              boxShadow: pill ? `0 10px 28px ${pill.glow}77, inset 0 1.5px 0 rgba(255,255,255,0.6), inset 0 -2px 0 rgba(0,0,0,0.08)` : undefined,
              rotate: pill ? "-2deg" : undefined,
            }}>{w.t}</span>
          );
        })}
      </div>
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
      <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: 78, color: W, letterSpacing: "-0.04em", textAlign: "center", lineHeight: 1.04, opacity: t, translate: `0px ${(1 - t) * 30}px`, filter: t < 0.7 ? `blur(${(0.7 - t) * 14}px)` : undefined }}>
        Close the loop on time.<br /><span style={{ color: VIOLET }}>Everybody wins.</span>
      </div>
      <div style={{ padding: "16px 34px", borderRadius: 999, background: "rgba(255,255,255,0.1)", border: "1.5px solid rgba(196,181,253,0.45)", fontFamily: FONT_UI, fontWeight: 700, fontSize: 36, color: W, opacity: u, translate: `0px ${(1 - u) * 20}px` }}>
        Next episode: the numbers
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
      {s("whoosh-short", S.spring.f0 - 3, 0.26)}{s("typing", T("spring", 1.0), 0.22, 4)}
      {s("whoosh-short", S.cases.f0 - 3, 0.24)}{[0, 1, 2, 3, 4, 5].map((k) => <React.Fragment key={k}>{s(`tick-${k + 1}`, T("clock", 0.4 + k * 0.5), 0.12, 1)}</React.Fragment>)}
      {s("pop-2", T("word", 1.3), 0.2)}{s("click", T("word", 2.1), 0.3)}{s("whoosh-short", T("word", 2.9), 0.26)}{s("click", T("word", 3.9), 0.3)}{s("click", T("word", 6.0), 0.3)}
      {s("click", T("filled", 1.4), 0.3)}{s("shimmer", T("filled", 1.9), 0.22)}{s("pop-1", T("filled", 2.6), 0.2)}{s("pop-2", T("filled", 3.75), 0.2)}{s("pop-3", T("filled", 4.85), 0.2)}
      {s("typing", rtOff(0.3), 0.3, 2.4)}{s("click", T("route", 3.3), 0.32)}{s("click", T("route", 4.2), 0.32)}{s("blip-1", T("route", 4.3), 0.25)}
      {s("chime", T("signed", 1.0), 0.28)}{s("chime", T("signed", 2.3), 0.3)}
      {s("chime", T("already", 1.0), 0.26)}{s("whoosh-short", S.barbara.f0 - 3, 0.24)}{s("chime", T("barbara", 1.0), 0.3)}
      {s("click", T("pms", 2.3), 0.35)}{s("pop-1", T("pms", 4.9), 0.2)}{s("pop-2", T("pms", 5.8), 0.2)}{s("pop-3", T("pms", 6.6), 0.2)}
      {s("pop-1", T("montage", 1.5), 0.2)}{s("pop-2", T("montage", 3.3), 0.22)}{s("shimmer", T("montage", 5.0), 0.25)}
      {s("impact", T("park", 2.6), 0.16)}{s("riser", S.home.f0 - 26, 0.18)}{s("shimmer", T("home", 0.6), 0.25)}
      {s("whoosh-short", S.week.f0 - 3, 0.24)}{s("pop-1", T("week", 1.4), 0.2)}{s("chime", T("week", 3.9), 0.24)}{s("click", T("owner", 1.6), 0.3)}
      {s("shimmer", END_AT, 0.32)}
    </>
  );
};
const rtOff = (t: number) => T("route", t);

const Grain: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ pointerEvents: "none", opacity: 0.06, mixBlendMode: "overlay", backgroundImage: "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220'><filter id='n'><feTurbulence baseFrequency='0.9' numOctaves='2' seed='" + (frame % 9) + "'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")" }} />
  );
};

export const Ep4Story: React.FC = () => (
  <FontGate>
    <AbsoluteFill style={{ background: "#0C0820" }}>
      <Footage layer="plate" />
      <BehindWords />
      <Footage layer="cutout" />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 45%, transparent 55%, rgba(8,4,20,0.42) 100%)" }} />
      <Label a={S.promise.f0 + 6} b={T("promise", 3.0)} office="Oakridge Oral Surgery" kind="Tanya · front desk coordinator" />
      <Label a={S.spring.f0 + 4} b={S.spring.f1 - 4} office="Last spring" kind="Before the templates" icon={I_CLOCK} />
      <Chip a={T("cases", 1.0)} b={S.cases.f1} icon={I_CLOCK} text="4:15 PM · 3 finished cases" tone="dark" y={250} size={38} />
      <Chip a={T("clock", 4.4)} b={S.clock.f1} icon={ICON.alert} text="Recital at 5:30 · 30 min traffic" tone="amber" y={1360} size={36} />
      <Label a={S.signed.f0 + 3} b={T("signed", 1.6)} office="Dr. Vance" kind="Oral surgeon · in the hallway" />
      <Product />
      <Captions />
      <EndCard />
      <Grain />
      <Audio src={staticFile("audio/music/s13-bed.wav")} volume={(f) => (f < S.spring.f1 ? 0.05 : f < S.home.f0 ? 0.075 : f < END_AT ? 0.11 : 0.14)} loop />
      <Sfx />
      <Sequence from={T("home", S.home.a + HOME_AT)}><Audio src={staticFile("ep4/voice/tanya_home.wav")} /></Sequence>
    </AbsoluteFill>
  </FontGate>
);
