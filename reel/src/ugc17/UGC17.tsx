/**
 * UGC 17 "Five moments every specialist office knows" (1080x1920, 30 fps). Built by scripts/ugc17_edl.py timings.
 *
 * Scenes S1-S5 = Google Flow clips (watermark removed, lanczos 1080x1920), every line re-dubbed with one fixed ElevenLabs
 * voice per character (speech-to-speech keeps Flow's lip-sync; public/ugc17/dub, src/ugc17/dub.json). Ethan is on camera
 * for the hook (e1) and the close (e2, e3), re-voiced to his VO voice; during the five fixes he is voice-over over the 3D
 * glass Tooth Referral dashboard (beats.tsx) showing what he says.
 * Audio is pre-mixed: mix/voice.wav (VO + dialogue) and mix/bed.wav (room tone + ducked music); SFX are placed here.
 *
 * Layers, back to front: scene plate · text behind the people (scene colours) · person cutout · vignette · dashboard
 * beats · tracker · captions · grain.
 */
import React from "react";
import { Video } from "@remotion/media";
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { FontGate } from "../effects";
import { BEHIND, CAP_TINT } from "./data";
import { AMBER, BEAT, BEATS, FONT, PURPLE_L, TOTAL, Tracker, W, clamp, life, sp } from "./kit";
import { BEAT_VIEWS } from "./beats";
import edl from "./edl.json";

export const UGC17_DURATION = TOTAL;
type Piece = { a: number; b: number; f0: number; f1: number; punch: boolean };
const SCENES = BEATS.filter((b) => b.kind === "scene");
/** Absolute frame where `word` is spoken inside a footage beat (from the caption timings). */
const capF = (beat: string, word: string) => {
  const c = (edl.captions as { w: string; f: number; beat: string }[]).find((x) => x.beat === beat && x.w.toLowerCase() === word);
  if (!c) throw new Error(`word "${word}" not in ${beat}`);
  return c.f;
};

// ------------------------------------------------------------------------------------------- footage
const ScenePiece: React.FC<{ scene: string; p: Piece; first: boolean; cutout?: boolean }> = ({ scene, p, first, cutout }) => {
  const f = useCurrentFrame();
  // enter from the dashboard: 1.08 -> 1.0 with blur 12 -> 0 over 6 frames (the second half of the zoom-through seam)
  const e = first && scene !== "s1" ? interpolate(f, [0, 6], [1, 0], clamp) : 0;
  const drift = 1 + 0.012 * (f / Math.max(1, p.f1 - p.f0));
  const sc = 1.04 * (p.punch ? 1.06 : 1) * (1 + 0.08 * e) * drift;
  const style: React.CSSProperties = { position: "absolute", left: 0, top: 0, width: 1080, height: 1920, transform: `scale(${sc})`, transformOrigin: "50% 40%", filter: e > 0 ? `blur(${12 * e}px)` : undefined };
  // @remotion/media decodes in the page: the Rust compositor kept failing with "No frame found" on these clips
  return <Video src={staticFile(`ugc17/${scene}${cutout ? "-cut.webm" : ".mp4"}`)} muted trimBefore={Math.round(p.a * 30)} style={style} />;
};
const Footage: React.FC<{ cutout?: boolean }> = ({ cutout }) => (
  <>
    {SCENES.map((s) => s.pieces!.map((p, i) => (
      <Sequence key={`${s.id}-${i}`} from={p.f0} durationInFrames={p.f1 - p.f0}><ScenePiece scene={s.id} p={p} first={i === 0} cutout={cutout} /></Sequence>
    )))}
  </>
);

/** Big words behind the people, coloured from each scene's own palette (walls, wood, scrubs, lamp light). */
const BehindWords: React.FC = () => {
  const f = useCurrentFrame();
  const s = SCENES.find((b) => f >= b.f0 && f < b.f1);
  if (!s) return null;
  const b = BEHIND[s.id];
  const a = b.at ? capF(s.id, b.at) - 2 : s.f0 + 3;
  if (f < a) return null;
  const p = sp(f, a, 13, 140);
  const o = life(f, a, s.f1, 6, 6);
  const lines = b.text.split("\n");
  const size = Math.min(250, 940 / (Math.max(...lines.map((l) => l.length)) * 0.7));
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: b.y + Math.sin((f - a) / 16) * 5, display: "flex", justifyContent: "center", perspective: 900, opacity: o }}>
      <div style={{
        font: `900 ${size}px/0.86 ${FONT}`, letterSpacing: "-0.05em", textAlign: "center", whiteSpace: "pre",
        backgroundImage: `linear-gradient(180deg, ${b.c2} 0%, ${b.c1} 78%)`, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent",
        filter: `blur(${(1 - Math.min(1, p * 1.3)) * 16}px) drop-shadow(0 16px 34px ${b.c1}66)`,
        transform: `rotateX(${(1 - p) * 65}deg) translateY(${(1 - p) * 100}px) scale(${0.86 + 0.14 * p})`, transformOrigin: "50% 100%",
      }}>{b.text}</div>
    </div>
  );
};

// ------------------------------------------------------------------------------------------- captions
type Cap = { w: string; f: number; e: number; beat: string; who: string };
const HOT = new Set(["leaves", "personal", "phone", "hallway", "retyping", "declines", "slip."]);
const nm = (s: string) => s.toLowerCase().replace(/[^a-z-]/g, "").replace("-", "");
const CHUNKS = (() => {
  const caps = edl.captions as Cap[];
  const out: { words: Cap[]; from: number; to: number; beat: string }[] = [];
  let cur: Cap[] = [];
  const flush = () => { if (cur.length) out.push({ words: cur, from: cur[0].f, to: cur[cur.length - 1].e + 8, beat: cur[0].beat }); cur = []; };
  for (const c of caps) {
    const len = cur.reduce((n, x) => n + x.w.length + 1, 0);
    if (cur.length && (c.beat !== cur[0].beat || c.who !== cur[0].who || len + c.w.length > 24)) flush();
    cur.push(c);
    if (/[.?!]$/.test(c.w)) flush();
  }
  flush();
  for (let i = 0; i < out.length - 1; i++) out[i].to = Math.min(out[i].to, out[i + 1].from);
  return out;
})();
const Captions: React.FC = () => {
  const f = useCurrentFrame();
  const c = CHUNKS.find((x) => f >= x.from && f < x.to);
  if (!c) return null;
  const tint = CAP_TINT[c.beat] ?? CAP_TINT.vo;
  const live = c.words.filter((w) => f >= w.f).pop();
  return (
    <div style={{ position: "absolute", left: 50, right: 50, top: 1520, height: 180, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ textAlign: "center", font: `800 54px/1.18 ${FONT}`, letterSpacing: "-0.015em", color: "#fff" }}>
        {c.words.map((w, i) => {
          const k = interpolate(f, [w.f - 2, w.f + 2], [0, 1], clamp);
          const hot = HOT.has(nm(w.w));
          const isLive = w === live;
          const pop = isLive ? 1 + 0.08 * Math.max(0, 1 - (f - w.f) / 5) : 1;
          return (
            <span key={i} style={{
              display: "inline-block", marginRight: "0.24em", opacity: 0.6 + 0.4 * k, transform: `scale(${pop})`,
              color: hot && f >= w.f ? AMBER : isLive ? PURPLE_L : "#fff",
              textShadow: `0 0 6px ${tint}, 0 3px 6px ${tint}, 0 6px 18px ${tint}CC`, WebkitTextStroke: `1.5px ${tint}`, paintOrder: "stroke fill",
            }}>{w.w}</span>
          );
        })}
      </div>
    </div>
  );
};

// ------------------------------------------------------------------------------------------- tracker over the whole story
const STEP: Record<string, [number, number]> = {  // beat -> [current case, cases done]
  e1: [1, 0], fix1: [1, 0], s2: [2, 1], fix2: [2, 1], s3: [3, 2], fix3: [3, 2], s4: [4, 3], fix4: [4, 3], s5: [5, 4], fix5: [5, 4], e2: [5, 4], e3: [5, 5],
};
const TrackerLayer: React.FC = () => {
  const f = useCurrentFrame();
  const b = BEATS.find((x) => f >= x.f0 && f < x.f1);
  if (!b || !STEP[b.id]) return null;
  const [cur, done0] = STEP[b.id];
  // a case gets its check as its fix ends (chips); the close shows all five checked from "Together"
  const fixEnd = b.id.startsWith("fix") && f >= b.f1 - 20 ? 1 : 0;
  const done = b.id === "e2" && f >= capF("e2", "together,") ? 5 : done0 + fixEnd;
  const out = b.id === "e3" ? interpolate(f, [capF("e3", "dashboard"), capF("e3", "dashboard") + 8], [1, 0], clamp) : 1;
  return (
    <div style={{ opacity: out }}>
      <Tracker at={0} cur={cur} done={done} popAt={b.id === "e1" ? capF("e1", "five") : undefined} />
    </div>
  );
};

// ------------------------------------------------------------------------------------------- sound effects
const G = (beat: string, word: string, nth = 0) => BEAT[beat].f0 + W(beat, word, nth);
const SFX: { f: string; at: number; v: number; d?: number }[] = (() => {
  const s: { f: string; at: number; v: number; d?: number }[] = [];
  for (const id of ["fix1", "fix2", "fix3", "fix4", "fix5"]) s.push({ f: "whoosh-short", at: BEAT[id].f0 - 2, v: 0.22 });
  for (const id of ["e1", "s2", "s3", "s4", "s5", "e2"]) s.push({ f: "whoosh-short", at: BEAT[id].f0 - 5, v: 0.14 });
  s.push({ f: "click", at: G("fix2", "keep"), v: 0.28 });
  s.push({ f: "typing", at: G("fix3", "put") + 1, v: 0.14, d: 1.6 }, { f: "click", at: G("fix3", "doctor"), v: 0.26 }, { f: "click", at: G("fix3", "answer") - 6, v: 0.28 });
  s.push({ f: "whoosh-short", at: G("fix4", "word") + 2, v: 0.12 }, { f: "click", at: G("fix4", "details") - 2, v: 0.26 }, { f: "click", at: G("fix4", "doctor", 1), v: 0.28 });
  s.push({ f: "typing", at: G("fix4", "signs"), v: 0.1, d: 0.6 }, { f: "chime", at: G("fix4", "goes") - 1, v: 0.16 }, { f: "whoosh-short", at: G("fix4", "straight") + 2, v: 0.12 });
  s.push({ f: "click", at: G("fix5", "declines"), v: 0.26 }, { f: "click", at: G("fix5", "case"), v: 0.26 }, { f: "typing", at: G("fix5", "short"), v: 0.12, d: 1.3 });
  s.push({ f: "click", at: G("fix5", "referring") - 7, v: 0.26 }, { f: "chime", at: G("fix5", "referring") + 14, v: 0.17 });
  s.push({ f: "shimmer", at: capF("e3", "tooth") + 2, v: 0.2 }, { f: "impact", at: capF("e3", "tooth") + 1, v: 0.08 });
  s.push({ f: "shimmer", at: BEAT.end.f0 + 2, v: 0.18 });
  return s;
})();

const Grain: React.FC = () => {
  const f = useCurrentFrame();
  return <AbsoluteFill style={{ pointerEvents: "none", opacity: 0.05, mixBlendMode: "overlay", backgroundImage: "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220'><filter id='n'><feTurbulence baseFrequency='0.9' numOctaves='2' seed='" + (f % 9) + "'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")" }} />;
};

export const UGC17: React.FC = () => (
  <FontGate>
    <AbsoluteFill style={{ background: "#0E0A22" }}>
      <Footage />
      <BehindWords />
      <Footage cutout />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 45%, transparent 58%, rgba(8,4,20,0.38) 100%)" }} />
      {BEATS.filter((b) => b.kind !== "scene").map((b) => {
        const V = BEAT_VIEWS[b.id];
        return <Sequence key={b.id} from={b.f0} durationInFrames={b.f1 - b.f0}><V /></Sequence>;
      })}
      <TrackerLayer />
      <Captions />
      <Grain />
      <Audio src={staticFile("ugc17/mix/voice.wav")} />
      <Audio src={staticFile("ugc17/mix/bed.wav")} />
      {SFX.map((x, i) => (
        <Sequence key={i} from={Math.max(0, x.at)} durationInFrames={Math.round((x.d ?? 2) * 30)}><Audio src={staticFile(`audio/sfx/${x.f}.wav`)} volume={x.v} /></Sequence>
      ))}
    </AbsoluteFill>
  </FontGate>
);
