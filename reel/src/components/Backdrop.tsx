import React from "react";
import { AbsoluteFill, Easing, interpolate, interpolateColors, useCurrentFrame } from "remotion";
import { SECTION_CUTS } from "../camera";
import { SEGMENTS } from "../edit";
import { COLORS, HEIGHT, WIDTH } from "../theme";

/** Section mood colours: muted rose for the problem, brand blues for the fix,
 *  mint/violet for outcomes, warm amber for the call to action. */
const MOODS: Record<string, [string, string]> = {
  problem: ["#7A2E52", "#2B2F6B"],
  solution: [COLORS.blue, COLORS.cyan],
  outcome: [COLORS.mint, COLORS.violet],
  cta: [COLORS.amber, COLORS.blue],
};

const sectionStarts = SEGMENTS.filter((s, i) => i === 0 || s.section !== SEGMENTS[i - 1].section).map((s) => ({
  from: s.from,
  section: s.section,
}));

const moodAt = (frame: number, which: 0 | 1) => {
  const frames: number[] = [];
  const colors: string[] = [];
  sectionStarts.forEach((s, i) => {
    const c = MOODS[s.section][which];
    if (i === 0) {
      frames.push(0);
      colors.push(c);
      return;
    }
    frames.push(s.from - 6, s.from + 10);
    colors.push(colors[colors.length - 1], c);
  });
  return interpolateColors(frame, frames, colors);
};

export const Backdrop: React.FC = () => {
  const frame = useCurrentFrame();
  const a = moodAt(frame, 0);
  const b = moodAt(frame, 1);
  const drift = Math.sin(frame / 45) * 40;
  const drift2 = Math.cos(frame / 60) * 50;
  return (
    <AbsoluteFill>
      <AbsoluteFill
        style={{
          mixBlendMode: "screen",
          opacity: 0.55,
          WebkitMaskImage: "linear-gradient(180deg, #000 0px, #000 560px, rgba(0,0,0,0) 820px)",
          maskImage: "linear-gradient(180deg, #000 0px, #000 560px, rgba(0,0,0,0) 820px)",
        }}
      >
        <div
          style={{
            position: "absolute",
            width: 900,
            height: 900,
            left: -260 + drift,
            top: 40 + drift2 * 0.5,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${a} 0%, rgba(0,0,0,0) 62%)`,
            opacity: 0.55,
          }}
        />
        <div
          style={{
            position: "absolute",
            width: 820,
            height: 820,
            left: WIDTH - 520 - drift,
            top: 230 - drift2 * 0.4,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${b} 0%, rgba(0,0,0,0) 62%)`,
            opacity: 0.45,
          }}
        />
      </AbsoluteFill>
      {/* Faint dot grid in the graphics area for depth. */}
      <AbsoluteFill
        style={{
          backgroundImage: "radial-gradient(rgba(255,255,255,0.13) 1.4px, transparent 1.6px)",
          backgroundSize: "36px 36px",
          backgroundPosition: `${(frame * 0.3) % 36}px 0px`,
          WebkitMaskImage: "linear-gradient(180deg, rgba(0,0,0,0) 80px, #000 260px, #000 560px, rgba(0,0,0,0) 780px)",
          maskImage: "linear-gradient(180deg, rgba(0,0,0,0) 80px, #000 260px, #000 560px, rgba(0,0,0,0) 780px)",
          opacity: 0.5,
        }}
      />
    </AbsoluteFill>
  );
};

/** Art-directed wash over the top of the frame: dark behind captions/graphics for contrast,
 *  and laid over both the blurred room and the footage so their join has no visible seam.
 *  Fades to zero just above the speaker's hairline. */
export const TopWash: React.FC = () => (
  <AbsoluteFill
    style={{
      background:
        "linear-gradient(180deg, rgba(7,11,26,0.93) 0px, rgba(8,12,32,0.86) 380px, rgba(10,15,40,0.62) 560px, rgba(11,17,46,0.32) 720px, rgba(11,18,48,0.1) 860px, rgba(11,18,48,0) 960px)",
    }}
  />
);

/** Procedural film grain + vignette: the top of the layer stack, so footage, graphics and
 *  type share one texture (remotion-motion-graphics skill: grain + vignette on top). */
const NOISE = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='220'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='220' height='220' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E")`;
export const GrainVignette: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <AbsoluteFill
        style={{
          backgroundImage: NOISE,
          backgroundSize: "220px",
          backgroundPosition: `${(frame * 7) % 220}px ${(frame * 13) % 220}px`,
          opacity: 0.06,
          mixBlendMode: "overlay",
        }}
      />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 55%, rgba(0,0,0,0) 60%, rgba(0,0,0,0.2) 100%)" }} />
    </AbsoluteFill>
  );
};

/** Diagonal light sweep across section cuts (paired with a whoosh in the sound design). */
export const LightSweep: React.FC = () => {
  const frame = useCurrentFrame();
  const cut = [...SECTION_CUTS].find((c) => frame >= c - 5 && frame <= c + 9);
  if (cut === undefined) return null;
  const p = interpolate(frame, [cut - 5, cut + 9], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });
  const x = interpolate(p, [0, 1], [-WIDTH * 0.9, WIDTH * 1.1]);
  const o = interpolate(p, [0, 0.35, 0.65, 1], [0, 0.55, 0.45, 0]);
  return (
    <AbsoluteFill style={{ mixBlendMode: "screen", pointerEvents: "none" }}>
      <div
        style={{
          position: "absolute",
          left: x,
          top: -HEIGHT * 0.1,
          width: WIDTH * 0.6,
          height: HEIGHT * 1.2,
          transform: "rotate(14deg)",
          background: `linear-gradient(90deg, rgba(0,0,0,0) 0%, ${COLORS.cyan}55 40%, #ffffff88 50%, ${COLORS.violet}55 60%, rgba(0,0,0,0) 100%)`,
          filter: "blur(30px)",
          opacity: o,
        }}
      />
    </AbsoluteFill>
  );
};
