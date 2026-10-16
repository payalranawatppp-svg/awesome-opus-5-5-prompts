import React from "react";
import { Audio } from "@remotion/media";
import { AbsoluteFill, Sequence, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import {
  EASE,
  EFFECTS,
  Finish,
  FontGate,
  MeshBackground,
  SPRING,
  TALENT,
  breathe,
  clamp,
  springAt,
  type TalentId,
} from "../effects";
import { COLORS, FONT_DISPLAY, FONT_MONO, FONT_UI } from "../theme";

/** 120 BPM at 30 fps: one beat is 15 frames. Every section length is a whole number of beats, so each
 *  cut lands on a beat of the music bed (scripts/synth_showcase.py). */
export const BEAT = 15;
const INTRO = 6 * BEAT;
const OUTRO = 6 * BEAT;

/** Which clip, and where in it, each effect plays: consecutive effects never show the same shot. */
const CASTING: Record<number, { talent: TalentId; startAt: number }> = {
  1: { talent: "01-hook", startAt: 0 },
  2: { talent: "02-solution", startAt: 0 },
  3: { talent: "03-outcome", startAt: 0 },
  4: { talent: "04-cta", startAt: 0 },
  5: { talent: "01-hook", startAt: 3.2 },
  6: { talent: "02-solution", startAt: 3.2 },
  7: { talent: "03-outcome", startAt: 3.4 },
  8: { talent: "04-cta", startAt: 3.2 },
  9: { talent: "01-hook", startAt: 4.6 },
  10: { talent: "02-solution", startAt: 4.6 },
  11: { talent: "03-outcome", startAt: 4.2 },
  12: { talent: "04-cta", startAt: 4.6 },
  13: { talent: "01-hook", startAt: 1.4 },
  14: { talent: "02-solution", startAt: 1.4 },
  15: { talent: "03-outcome", startAt: 1.4 },
  16: { talent: "04-cta", startAt: 1.4 },
  17: { talent: "02-solution", startAt: 5.0 },
};

export const SHOWCASE = (() => {
  let from = INTRO;
  return EFFECTS.map((e) => {
    const len = Math.max(2 * BEAT, Math.round(e.meta.durationInFrames / BEAT) * BEAT);
    const cast = CASTING[e.meta.n];
    const item = { ...e, from, len, talent: TALENT[cast.talent], startAt: Math.min(cast.startAt, 8 - len / 30) };
    from += len;
    return item;
  });
})();
const last = SHOWCASE[SHOWCASE.length - 1];
export const SHOWCASE_DURATION = last.from + last.len + OUTRO;

const pad2 = (n: number) => String(n).padStart(2, "0");

// ---------------------------------------------------------------------------------------------------

const ListItem: React.FC<{ n: number; name: string; at: number }> = ({ n, name, at }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = springAt(frame, fps, at, SPRING.snappy);
  return (
    <div
      style={{
        display: "flex",
        alignItems: "baseline",
        gap: 14,
        opacity: p,
        translate: `${interpolate(p, [0, 1], [-26, 0])}px 0px`,
        height: 54,
      }}
    >
      <span style={{ fontFamily: FONT_MONO, fontWeight: 500, fontSize: 24, color: COLORS.muted, width: 40 }}>{pad2(n)}</span>
      <span style={{ fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: 40, color: COLORS.text, letterSpacing: -0.8 }}>{name}</span>
    </div>
  );
};

/** Opening card: the title and all 17 names in two columns (like the reel that inspired it). */
const Intro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const t = springAt(frame, fps, 0, SPRING.snappy);
  const exit = interpolate(frame, [durationInFrames - 8, durationInFrames], [0, 1], { ...clamp, easing: EASE.in });
  const left = EFFECTS.slice(0, 9);
  const right = EFFECTS.slice(9);
  return (
    <AbsoluteFill style={{ opacity: 1 - exit, scale: String(1 + exit * 0.06) }}>
      <MeshBackground />
      <AbsoluteFill style={{ padding: "300px 72px 0", gap: 70 }}>
        <div style={{ opacity: t, translate: `0px ${interpolate(t, [0, 1], [40, 0])}px`, scale: String(interpolate(t, [0, 1], [0.94, 1]) * breathe(frame, 0.006)) }}>
          <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: 132, lineHeight: 1.0, letterSpacing: -4, color: COLORS.text }}>
            <span style={{ color: COLORS.amber }}>17</span> video
            <br />
            effects
          </div>
          <div style={{ marginTop: 26, fontFamily: FONT_UI, fontWeight: 600, fontSize: 38, color: COLORS.muted, letterSpacing: -0.4 }}>
            Ready to drop into the next video
          </div>
        </div>
        <div style={{ display: "flex", gap: 40 }}>
          <div style={{ flex: 1 }}>
            {left.map((e, i) => (
              <ListItem key={e.meta.slug} n={e.meta.n} name={e.meta.name} at={10 + i * 3} />
            ))}
          </div>
          <div style={{ flex: 1 }}>
            {right.map((e, i) => (
              <ListItem key={e.meta.slug} n={e.meta.n} name={e.meta.name} at={13 + i * 3} />
            ))}
          </div>
        </div>
      </AbsoluteFill>
      <Finish />
    </AbsoluteFill>
  );
};

/** "NN/17 · name" label over each effect. */
const EffectLabel: React.FC<{ n: number; name: string }> = ({ n, name }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const chip = springAt(frame, fps, 3, SPRING.snappy);
  const word = springAt(frame, fps, 6, SPRING.snappy);
  const exit = interpolate(frame, [durationInFrames - 7, durationInFrames - 1], [0, 1], { ...clamp, easing: EASE.in });
  return (
    <AbsoluteFill style={{ alignItems: "center", paddingTop: 150, opacity: 1 - exit, translate: `0px ${-24 * exit}px` }}>
      <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
        <div
          style={{
            opacity: chip,
            scale: String(interpolate(chip, [0, 1], [0.7, 1])),
            fontFamily: FONT_MONO,
            fontWeight: 700,
            fontSize: 28,
            color: COLORS.text,
            padding: "10px 18px",
            borderRadius: 999,
            background: "rgba(7,11,26,0.72)",
            border: "1.5px solid rgba(255,255,255,0.22)",
            boxShadow: "0 10px 30px rgba(0,0,0,0.35)",
          }}
        >
          {`${pad2(n)}/${EFFECTS.length}`}
        </div>
        <div
          style={{
            opacity: word,
            translate: `${interpolate(word, [0, 1], [-18, 0])}px 0px`,
            fontFamily: FONT_DISPLAY,
            fontWeight: 800,
            fontSize: 58,
            letterSpacing: -1.4,
            color: COLORS.text,
            textShadow: "0 4px 24px rgba(0,0,0,0.65), 0 1px 3px rgba(0,0,0,0.6)",
          }}
        >
          {name.toLowerCase()}
        </div>
      </div>
    </AbsoluteFill>
  );
};

const Outro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const a = springAt(frame, fps, 0, SPRING.snappy);
  const b = springAt(frame, fps, 6, SPRING.snappy);
  return (
    <AbsoluteFill>
      <MeshBackground a={COLORS.violet} b={COLORS.cyan} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", gap: 28 }}>
        <div
          style={{
            opacity: a,
            translate: `0px ${interpolate(a, [0, 1], [40, 0])}px`,
            scale: String(interpolate(a, [0, 1], [0.92, 1]) * breathe(frame, 0.008)),
            fontFamily: FONT_DISPLAY,
            fontWeight: 800,
            fontSize: 120,
            letterSpacing: -4,
            color: COLORS.text,
            textAlign: "center",
            lineHeight: 1.02,
          }}
        >
          Pick one
          <br />
          <span style={{ color: COLORS.amber }}>per beat</span>
        </div>
        <div
          style={{
            opacity: b,
            translate: `0px ${interpolate(b, [0, 1], [24, 0])}px`,
            fontFamily: FONT_UI,
            fontWeight: 600,
            fontSize: 38,
            color: COLORS.muted,
          }}
        >
          17 effects, one library
        </div>
      </AbsoluteFill>
      <Finish />
    </AbsoluteFill>
  );
};

export const EffectsShowcase: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ background: COLORS.ink }}>
      <FontGate>
        <Sequence durationInFrames={INTRO} premountFor={fps}>
          <Intro />
        </Sequence>
        {SHOWCASE.map(({ meta, Component, from, len, talent, startAt }) => (
          <Sequence key={meta.slug} from={from} durationInFrames={len} premountFor={fps}>
            <Component talent={talent} startAt={startAt} />
            <EffectLabel n={meta.n} name={meta.name} />
          </Sequence>
        ))}
        <Sequence from={last.from + last.len} durationInFrames={OUTRO} premountFor={fps}>
          <Outro />
        </Sequence>
      </FontGate>
      <Audio src={staticFile("audio/music/showcase-bed.m4a")} volume={0.95} />
      {SHOWCASE.map(({ meta, from }) => (
        <Sequence key={`sfx-${meta.slug}`} from={from - 5} durationInFrames={fps} premountFor={fps}>
          <Audio src={staticFile("audio/sfx/whoosh-short.wav")} volume={0.45} />
        </Sequence>
      ))}
      <Sequence from={last.from + last.len - 5} durationInFrames={fps} premountFor={fps}>
        <Audio src={staticFile("audio/sfx/whoosh-long.wav")} volume={0.4} />
      </Sequence>
    </AbsoluteFill>
  );
};
