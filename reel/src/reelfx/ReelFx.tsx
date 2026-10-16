/**
 * Signal Reach reel, re-edited with the effects library (src/effects).
 *
 * Same cut, voice and music as SignalReachReel; the picture is rebuilt around three effects, each on the
 * line it illustrates, with plain talking-head shots in between (the speaker stays the hero):
 *   "Quiet page, hardly any updates?"            Green screen over a neglected company page
 *   "Useful posts, ... managing your inbox."      Orbit: each chip reaches the front on its word
 *   "Start with one useful post and a few ..."   Checklist: each item ticks on its word
 * plus a brand super on "At Signal Reach", a punch-in on "leads", and an end panel for the CTA.
 */
import React from "react";
import { Audio } from "@remotion/media";
import { AbsoluteFill, Freeze, Sequence, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { ChunkView } from "../components/Captions";
import { GrainVignette } from "../components/Backdrop";
import { SignalMark } from "../components/kit";
import { Music, Voice } from "../components/SoundTrack";
import { CAPTION_EXIT, CHUNKS, DURATION, SEGMENTS, WORDS, at, type Chunk, type ClipId } from "../edit";
import {
  Checklist,
  EASE,
  FontGate,
  GreenScreen,
  Orbit,
  SPRING,
  TALENT,
  TalentLayer,
  breathe,
  clamp,
  frameOnFace,
  meanFace,
  rampAt,
  springAt,
  type Framing,
  type Talent,
} from "../effects";
import { layoutCaption, type CaptionLayout } from "../layout";
import { BRAND_GRADIENT, COLORS, FONT_DISPLAY, FONT_UI, HEIGHT, WIDTH } from "../theme";
import { QUIET_PAGE_SCROLL, QuietPage } from "./QuietPage";

const seg = (id: string) => SEGMENTS.find((s) => s.id === id)!;
const srcAt = (id: string, frame: number) => {
  const s = seg(id);
  return (s.in + frame - s.from) / 30; // source seconds shown at an output frame of that segment
};

// ---------------------------------------------------------------------------------------------------
// The three effect windows (output frames). Each sits inside one continuous segment, so the clip it
// plays stays in sync with the voice.

const GREEN = { from: seg("hook-b").from, to: seg("hook-b").from + seg("hook-b").duration, clip: "01-hook" as ClipId };
const ORBIT = { from: at("whole") - 4, to: seg("solution").from + seg("solution").duration, clip: "02-solution" as ClipId };
const CHECK = { from: seg("cta-a").from, to: seg("cta-a").from + seg("cta-a").duration, clip: "04-cta" as ClipId };
const END_PANEL = at("Let's") + 2;

/** Orbit's own full-frame framing (scale 1.97, bottom-anchored): the shot before it uses the same, so
 *  the orbit fades in without a jump. */
const orbitFraming = (tl: Talent): Framing => {
  const s = Math.max(1.97, (HEIGHT + 2) / tl.usableBottom);
  const f = meanFace(tl);
  const cx = f.x + f.w / 2;
  return { scale: s, x: Math.min(0, Math.max(WIDTH - tl.w * s, WIDTH / 2 - cx * s)), y: HEIGHT + 2 - tl.usableBottom * s };
};

/** Zoom a framing by z around the clip's mean face centre (punch-ins keep the face in place). */
const zoomed = (tl: Talent, f: Framing, z: number): Framing => {
  const m = meanFace(tl);
  const fx = f.x + (m.x + m.w / 2) * f.scale;
  const fy = f.y + (m.y + m.h / 2) * f.scale;
  return { scale: f.scale * z, x: fx - (fx - f.x) * z, y: fy - (fy - f.y) * z };
};

// ---------------------------------------------------------------------------------------------------
// Plain shots

type Shot = {
  from: number;
  to: number;
  clip: ClipId;
  framing: "face" | "orbit";
  /** camera zoom over the shot (output frame → multiplier) */
  zoom: (f: number) => number;
  /** zoom-in transition from the previous section (a short settle with blur) */
  enter?: boolean;
  /** whip out into the next section */
  exit?: boolean;
  /** hold the frame from this output frame on (the generated clip fades to grey at its end) */
  freezeFrom?: number;
};

const push = (from: number, to: number, a: number, b: number) => (f: number) =>
  interpolate(f, [from, to], [a, b], { ...clamp, easing: EASE.inOut });

const SHOTS: Shot[] = [
  { from: 0, to: GREEN.from, clip: "01-hook", framing: "face", zoom: push(0, GREEN.from, 1.0, 1.045) },
  {
    from: seg("hook-c").from,
    to: seg("hook-c").from + seg("hook-c").duration,
    clip: "01-hook",
    framing: "face",
    zoom: (f) => 1.1 + 0.035 * rampAt(f, at("little") - 2, 10, EASE.out),
    exit: true,
  },
  { from: seg("solution").from, to: ORBIT.from, clip: "02-solution", framing: "orbit", zoom: () => 1, enter: true },
  {
    from: seg("outcome").from,
    to: seg("outcome").from + seg("outcome").duration,
    clip: "03-outcome",
    framing: "face",
    // the payoff word: a quick punch-in on "leads", held through the end of the line
    zoom: (f) => 1 + 0.02 * rampAt(f, seg("outcome").from, 150, EASE.inOut) + 0.13 * rampAt(f, at("leads,") - 3, 7, EASE.expoOut),
    enter: true,
  },
  { from: seg("cta-b").from, to: seg("cta-b").from + seg("cta-b").duration, clip: "04-cta", framing: "face", zoom: () => 1.1 },
  {
    from: seg("cta-c").from,
    to: DURATION,
    clip: "04-cta",
    framing: "face",
    zoom: push(seg("cta-c").from, DURATION, 1.0, 1.035),
    freezeFrom: seg("cta-c").from + seg("cta-c").duration - 1,
  },
];

const ShotView: React.FC<{ shot: Shot }> = ({ shot }) => {
  const local = useCurrentFrame();
  const f = shot.from + local;
  const tl = TALENT[shot.clip];
  const base = shot.framing === "orbit" ? orbitFraming(tl) : frameOnFace(tl);
  const settle = shot.enter ? interpolate(local, [0, 9], [1.1, 1], { ...clamp, easing: EASE.expoOut }) : 1;
  const whip = shot.exit ? interpolate(f, [shot.to - 5, shot.to], [1, 1.09], { ...clamp, easing: EASE.in }) : 1;
  const blur =
    (shot.enter ? interpolate(local, [0, 6], [7, 0], { ...clamp, easing: EASE.out }) : 0) +
    (shot.exit ? interpolate(f, [shot.to - 5, shot.to], [0, 8], { ...clamp, easing: EASE.in }) : 0);
  const framing = zoomed(tl, base, shot.zoom(f) * settle * whip);
  const segId = SEGMENTS.find((s) => shot.from >= s.from && shot.from < s.from + s.duration)!.id;
  const startAt = srcAt(segId, shot.from);
  const layer = <TalentLayer talent={tl} layer="full" framing={framing} startAt={startAt} style={{ filter: blur > 0.2 ? `blur(${blur.toFixed(2)}px)` : undefined }} />;
  const freezeAt = shot.freezeFrom !== undefined ? shot.freezeFrom - shot.from : undefined;
  return (
    <AbsoluteFill style={{ background: COLORS.ink }}>
      {freezeAt !== undefined ? (
        <Freeze frame={freezeAt} active={(x) => x >= freezeAt}>
          {layer}
        </Freeze>
      ) : (
        layer
      )}
      {/* the same light finish the effects carry, so plain shots and effects match */}
      <AbsoluteFill style={{ backgroundColor: COLORS.blue, mixBlendMode: "soft-light", opacity: 0.06 }} />
      <GrainVignette />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------------------------------
// Brand super on "At Signal Reach"

const BrandSuper: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const p = springAt(frame, fps, 0, SPRING.snappy);
  const mark = rampAt(frame, 2, 18, EASE.out);
  const out = interpolate(frame, [durationInFrames - 8, durationInFrames - 1], [0, 1], { ...clamp, easing: EASE.in });
  return (
    <AbsoluteFill>
      <div
        style={{
          position: "absolute",
          left: 64,
          top: 1196,
          display: "flex",
          alignItems: "center",
          gap: 20,
          padding: "16px 34px 16px 18px",
          borderRadius: 30,
          background: "linear-gradient(150deg, rgba(30,38,84,0.82), rgba(10,14,36,0.9))",
          border: "1.5px solid rgba(255,255,255,0.2)",
          boxShadow: "0 18px 44px rgba(2,4,14,0.5)",
          opacity: Math.min(1, p * 1.5) * (1 - out),
          translate: `${interpolate(p, [0, 1], [-40, 0]) - out * 30}px 0px`,
          scale: String(interpolate(p, [0, 1], [0.94, 1])),
        }}
      >
        <SignalMark size={76} p={mark} />
        <div>
          <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: 44, letterSpacing: -1, color: COLORS.text, lineHeight: 1.05 }}>Signal Reach</div>
          <div style={{ fontFamily: FONT_UI, fontWeight: 600, fontSize: 24, color: COLORS.muted, marginTop: 4 }}>LinkedIn content & outreach</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------------------------------
// End panel: rises under the chin on "Let's build your plan", the button clicks on "plan."

const END_WORDS = ["Let's", "build", "your", "plan."];
/** Output frame of a word's first occurrence at or after `from`. */
const wordAfter = (text: string, from: number) => {
  const w = WORDS.find((x) => x.start >= from - 6 && x.text.toLowerCase().startsWith(text.toLowerCase().replace(/[^a-z']/g, "")));
  if (!w) throw new Error(`"${text}" not found after ${from}`);
  return Math.round(w.start);
};

const EndPanel: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const f = END_PANEL + frame; // output frame
  const p = springAt(frame, fps, 0, { damping: 20, stiffness: 140, mass: 0.9 });
  const click = at("plan.");
  const press = f >= click ? 1 - 0.06 * Math.sin(Math.PI * Math.min(1, (f - click) / 7)) : 1;
  const ripple = rampAt(f, click, 16, EASE.out);
  const sweep = rampAt(f, click + 2, 18, EASE.inOut);
  const bio = springAt(f, fps, click + 16, SPRING.snappy);
  return (
    <AbsoluteFill>
      <div
        style={{
          position: "absolute",
          left: 56,
          right: 56,
          top: 1178,
          borderRadius: 48,
          background: "linear-gradient(160deg, rgba(27,31,94,0.9) 0%, rgba(9,13,34,0.94) 70%)",
          border: "1.5px solid rgba(255,255,255,0.18)",
          boxShadow: "0 30px 70px rgba(2,4,14,0.6), inset 0 1px 0 rgba(255,255,255,0.12)",
          backdropFilter: "blur(16px)",
          opacity: Math.min(1, p * 1.4),
          translate: `0px ${interpolate(p, [0, 1], [260, 0]) + Math.sin(frame / 26) * 2}px`,
          padding: "40px 48px",
          display: "flex",
          flexDirection: "column",
          gap: 26,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <SignalMark size={60} p={rampAt(frame, 4, 18, EASE.out)} />
          <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: 36, color: COLORS.text, letterSpacing: -0.6 }}>Signal Reach</div>
        </div>
        {/* headline: each word lights as it is spoken */}
        <div style={{ display: "flex", gap: 18, fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: 74, letterSpacing: -2, lineHeight: 1 }}>
          {END_WORDS.map((w, i) => {
            const t = wordAfter(w, END_PANEL);
            const lit = rampAt(f, t - 1, 4, EASE.out);
            const isPlan = w === "plan.";
            return (
              <span key={w} style={{ color: isPlan ? (lit > 0.5 ? COLORS.amber : COLORS.grey) : lit > 0.5 ? COLORS.text : COLORS.grey, opacity: 0.55 + 0.45 * lit }}>
                {w}
              </span>
            );
          })}
        </div>
        <div style={{ position: "relative", alignSelf: "flex-start" }}>
          <div
            style={{
              position: "absolute",
              inset: -8,
              borderRadius: 999,
              border: `3px solid ${COLORS.cyan}`,
              opacity: (1 - ripple) * (f >= click ? 1 : 0),
              scale: String(1 + ripple * 0.25),
            }}
          />
          <div
            style={{
              position: "relative",
              overflow: "hidden",
              display: "flex",
              alignItems: "center",
              gap: 16,
              height: 100,
              padding: "0 46px",
              borderRadius: 999,
              background: BRAND_GRADIENT,
              boxShadow: `0 14px 40px ${COLORS.blue}66`,
              scale: String(press * breathe(frame, 0.008, 18)),
              fontFamily: FONT_DISPLAY,
              fontWeight: 800,
              fontSize: 42,
              color: COLORS.white,
            }}
          >
            Build your plan
            <span style={{ fontSize: 40 }}>→</span>
            <div
              style={{
                position: "absolute",
                top: 0,
                bottom: 0,
                width: 120,
                left: `${-20 + sweep * 130}%`,
                background: "linear-gradient(100deg, transparent, rgba(255,255,255,0.45), transparent)",
                opacity: sweep > 0 && sweep < 1 ? 1 : 0,
              }}
            />
          </div>
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 1590,
          textAlign: "center",
          fontFamily: FONT_UI,
          fontWeight: 600,
          fontSize: 30,
          color: COLORS.text,
          textShadow: "0 2px 12px rgba(0,0,0,0.7)",
          opacity: bio,
          translate: `0px ${interpolate(bio, [0, 1], [14, 0])}px`,
        }}
      >
        Link in bio
      </div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------------------------------
// Captions: the reel's own style, placed per moment so they never sit on the speaker's face

const BAND = {
  low: { top: 1372, bottom: 1600 }, // over the shirt in the default framing
  top: { top: 168, bottom: 372 }, // over the page header while he is small (green screen)
  mid: { top: 690, bottom: 860 }, // between the checklist card and his head
};
const placementOf = (c: Chunk): { band: keyof typeof BAND; end: number } | null => {
  const s = c.start;
  if (s >= END_PANEL - 4) return null; // the end panel's headline speaks the line
  if (s >= GREEN.from - 4 && s < GREEN.to) return { band: "top", end: Math.min(c.end, GREEN.to - CAPTION_EXIT - 1) };
  if (s >= CHECK.from - 4 && s < CHECK.to) return { band: "mid", end: Math.min(c.end, CHECK.to - CAPTION_EXIT - 1) };
  return { band: "low", end: Math.min(c.end, END_PANEL - 1) };
};
const layoutCache = new Map<number, CaptionLayout>();
const layoutFor = (c: Chunk, band: keyof typeof BAND) => {
  let l = layoutCache.get(c.index);
  if (!l) {
    l = layoutCaption(c, BAND[band]);
    layoutCache.set(c.index, l);
  }
  return l;
};

const CaptionsFx: React.FC = () => {
  const frame = useCurrentFrame();
  const placed = CHUNKS.map((c) => ({ c, p: placementOf(c) })).filter((x) => x.p !== null) as { c: Chunk; p: { band: keyof typeof BAND; end: number } }[];
  const active = placed.find(({ c, p }) => frame >= c.start && frame < p.end + CAPTION_EXIT);
  if (!active) return null;
  const chunk = { ...active.c, end: active.p.end };
  return <ChunkView chunk={chunk} frame={frame} layout={layoutFor(active.c, active.p.band)} />;
};

// ---------------------------------------------------------------------------------------------------
// Sound effects for this cut (voice and music are the reel's own)

type Sfx = { at: number; file: string; volume: number; peak?: number };
const PEAK = { "whoosh-long": 0.42 * 30, "whoosh-short": 0.2 * 30, riser: 1.6 * 30 } as const;
const SFX: Sfx[] = [
  { at: 0, file: "impact", volume: 0.26 },
  // green screen: the room keys out on "Quiet", the loop lands on "updates?"
  { at: GREEN.from + 6, file: "whoosh-short", volume: 0.28, peak: PEAK["whoosh-short"] },
  { at: at("Quiet"), file: "pop-1", volume: 0.3 },
  { at: at("updates?") - 4, file: "blip-1", volume: 0.24 },
  { at: GREEN.to - 4, file: "whoosh-short", volume: 0.2, peak: PEAK["whoosh-short"] },
  // into the solution
  { at: seg("solution").from, file: "riser", volume: 0.1, peak: PEAK.riser },
  { at: seg("solution").from, file: "whoosh-long", volume: 0.34, peak: PEAK["whoosh-long"] },
  { at: at("Signal"), file: "chime", volume: 0.2 },
  { at: at("Signal") + 4, file: "shimmer", volume: 0.12 },
  // orbit: the ring opens on "whole picture", a chip lands on each service
  { at: ORBIT.from + 8, file: "whoosh-short", volume: 0.22, peak: PEAK["whoosh-short"] },
  { at: at("Useful") - 3, file: "pop-1", volume: 0.32 },
  { at: at("thoughtful") - 3, file: "pop-2", volume: 0.32 },
  { at: at("personalized") - 3, file: "pop-3", volume: 0.32 },
  { at: at("managing") - 3, file: "pop-3", volume: 0.34 },
  { at: at("managing") - 1, file: "click", volume: 0.2 },
  { at: ORBIT.to - 4, file: "whoosh-short", volume: 0.24, peak: PEAK["whoosh-short"] },
  // outcome
  { at: seg("outcome").from, file: "whoosh-long", volume: 0.34, peak: PEAK["whoosh-long"] },
  { at: at("leads,") - 2, file: "whoosh-short", volume: 0.16, peak: PEAK["whoosh-short"] },
  { at: at("leads,"), file: "chime", volume: 0.16 },
  // checklist: card drops, each item ticks on its word
  { at: CHECK.from + 2, file: "whoosh-long", volume: 0.3, peak: PEAK["whoosh-long"] },
  { at: CHECK.from + 10, file: "pop-1", volume: 0.22 },
  { at: at("post"), file: "pop-2", volume: 0.32 },
  { at: at("post") + 2, file: "click", volume: 0.2 },
  { at: at("replies.", 2), file: "pop-3", volume: 0.32 },
  { at: at("replies.", 2) + 2, file: "click", volume: 0.2 },
  // end panel
  { at: END_PANEL + 6, file: "whoosh-short", volume: 0.24, peak: PEAK["whoosh-short"] },
  { at: at("plan."), file: "click", volume: 0.34 },
  { at: at("plan.") + 1, file: "shimmer", volume: 0.2 },
];
const SFX_GAIN = 1.5;

const SfxTrack: React.FC = () => (
  <>
    {SFX.map((s, i) => (
      <Sequence key={`${s.file}-${i}`} from={Math.round(s.at - (s.peak ?? 0))} layout="none" name={`sfx ${s.file}`}>
        <Audio src={staticFile(`audio/sfx/${s.file}.wav`)} volume={Math.min(1, s.volume * SFX_GAIN)} />
      </Sequence>
    ))}
  </>
);

// ---------------------------------------------------------------------------------------------------

export const ReelFx: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ background: COLORS.ink }}>
      <FontGate>
        {SHOTS.map((s) => (
          <Sequence key={s.from} from={s.from} durationInFrames={s.to - s.from} premountFor={fps} name={`shot ${s.clip} ${s.from}`}>
            <ShotView shot={s} />
          </Sequence>
        ))}
        <Sequence from={GREEN.from} durationInFrames={GREEN.to - GREEN.from} premountFor={fps} name="green screen">
          <GreenScreen
            talent={TALENT[GREEN.clip]}
            startAt={srcAt("hook-b", GREEN.from)}
            scroll={QUIET_PAGE_SCROLL}
            background={<QuietPage circleAt={at("updates?") - GREEN.from - 6} />}
          />
        </Sequence>
        <Sequence from={ORBIT.from} durationInFrames={ORBIT.to - ORBIT.from} premountFor={fps} name="orbit">
          <Orbit
            talent={TALENT[ORBIT.clip]}
            startAt={srcAt("solution", ORBIT.from)}
            dim={0.5}
            items={[
              { label: "Posts", icon: "post", at: (at("Useful") - ORBIT.from) / 30 },
              { label: "Replies", icon: "chat", at: (at("thoughtful") - ORBIT.from) / 30 },
              { label: "Outreach", icon: "plane", at: (at("personalized") - ORBIT.from) / 30 },
              { label: "Inbox", icon: "inbox", at: (at("managing") - ORBIT.from) / 30 },
            ]}
          />
        </Sequence>
        <Sequence from={CHECK.from} durationInFrames={CHECK.to - CHECK.from} premountFor={fps} name="checklist">
          <Checklist
            talent={TALENT[CHECK.clip]}
            startAt={srcAt("cta-a", CHECK.from)}
            eyebrow="Day one"
            title="Start here"
            items={["One useful post", "A few genuine replies"]}
            tickAt={[(at("post") - CHECK.from) / 30, (at("replies.", 2) - CHECK.from) / 30]}
          />
        </Sequence>
        <Sequence from={at("Signal") - 2} durationInFrames={ORBIT.from - at("Signal") - 2} premountFor={fps} name="brand super">
          <BrandSuper />
        </Sequence>
        <Sequence from={END_PANEL} durationInFrames={DURATION - END_PANEL} premountFor={fps} name="end panel">
          <EndPanel />
        </Sequence>
        <CaptionsFx />
      </FontGate>
      <Voice />
      <Music />
      <SfxTrack />
    </AbsoluteFill>
  );
};
