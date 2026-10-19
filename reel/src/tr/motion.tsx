/**
 * ToothReferral motion toolkit (v2 design language): the reusable pieces behind src/tr/v2.tsx.
 * New animations should be built from these so every scene shares one look:
 * dark purple stage, white product UI or dark glass, one purple hero accent, springs (never linear),
 * staggered entrances, a light sweep on hero moments, exits faster than entrances.
 */
import React from "react";
import { Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { FONT_DISPLAY } from "../theme";
import { TR, clamp } from "./ui";

/** Ease-in-out cubic for keyed moves (camera, paths). */
export const easeIO = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
/** Ease-out expo for snappy arrivals. */
export const easeOut = (t: number) => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * t));

/** Spring 0→1 from frame `at` (call at top level of a component). */
export const useSpring = (at: number, cfg: { damping?: number; stiffness?: number; mass?: number } = {}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return frame < at ? 0 : spring({ frame: frame - at, fps, config: { damping: cfg.damping ?? 15, stiffness: cfg.stiffness ?? 160, mass: cfg.mass ?? 0.75 } });
};

/** Keyed 0→1 over [a, b] with an easing. */
export const ramp = (frame: number, a: number, b: number, ease = easeIO) => ease(interpolate(frame, [a, b], [0, 1], clamp));

/** Dark glass surface for elements sitting on the stage (not product UI). */
export const glass = (radius = 28): React.CSSProperties => ({
  borderRadius: radius,
  // transparent mode (ui.tsx Stage) swaps in a darker glass so it stays legible over footage
  background: "var(--tr-glass, linear-gradient(150deg, rgba(255,255,255,0.14), rgba(255,255,255,0.05)))",
  border: "1.5px solid rgba(255,255,255,0.22)",
  boxShadow: "0 24px 60px rgba(4,2,20,0.45), inset 0 1px 0 rgba(255,255,255,0.25)",
  backdropFilter: "blur(16px)",
  color: "#fff",
});

/** A diagonal light band sweeping across its parent (parent needs overflow hidden + position relative). */
export const LightSweep: React.FC<{ at: number; dur?: number; opacity?: number }> = ({ at, dur = 22, opacity = 0.55 }) => {
  const frame = useCurrentFrame();
  const t = interpolate(frame, [at, at + dur], [0, 1], clamp);
  if (t <= 0 || t >= 1) return null;
  return (
    <div
      style={{
        position: "absolute",
        top: "-50%",
        bottom: "-50%",
        width: "35%",
        left: `${-40 + easeIO(t) * 150}%`,
        rotate: "18deg",
        background: `linear-gradient(90deg, transparent, rgba(255,255,255,${opacity}), transparent)`,
        pointerEvents: "none",
      }}
    />
  );
};

/** Big number that counts up (tabular figures so it never jitters). */
export const Counter: React.FC<{ to: number; at: number; dur?: number; decimals?: number; style?: React.CSSProperties; suffix?: string; prefix?: string }> = ({
  to,
  at,
  dur = 30,
  decimals = 0,
  style,
  suffix = "",
  prefix = "",
}) => {
  const frame = useCurrentFrame();
  const v = to * easeOut(interpolate(frame, [at, at + dur], [0, 1], clamp));
  return (
    <span style={{ fontVariantNumeric: "tabular-nums", ...style }}>
      {prefix}
      {v.toFixed(decimals)}
      {suffix}
    </span>
  );
};

/** Words rise in one by one (kinetic headline). */
export const KineticLine: React.FC<{ text: string; at: number; size: number; color?: string; accent?: string[]; stagger?: number; style?: React.CSSProperties }> = ({
  text,
  at,
  size,
  color = "#fff",
  accent = [],
  stagger = 4,
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", columnGap: size * 0.26, fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: size, lineHeight: 1.05, letterSpacing: -size * 0.03, textShadow: `0 ${size * 0.05}px ${size * 0.3}px rgba(10,5,40,0.45)`, ...style }}>
      {text.split(" ").map((w, i) => {
        const p = frame < at + i * stagger ? 0 : spring({ frame: frame - at - i * stagger, fps, config: { damping: 14, stiffness: 170, mass: 0.7 } });
        return (
          <span key={i} style={{ display: "inline-block", color: accent.includes(w) ? TR.purpleBright : color, opacity: Math.min(1, p * 1.5), translate: `0px ${interpolate(p, [0, 1], [size * 0.5, 0])}px`, filter: p < 0.6 ? `blur(${(0.6 - p) * 12}px)` : undefined }}>
            {w}
          </span>
        );
      })}
    </div>
  );
};

/** Point on a cubic Bezier (for things travelling along a path). */
export const bezier = (t: number, p0: number[], p1: number[], p2: number[], p3: number[]) => {
  const u = 1 - t;
  return [0, 1].map((k) => u * u * u * p0[k] + 3 * u * u * t * p1[k] + 3 * u * t * t * p2[k] + t * t * t * p3[k]);
};

/** A glowing dot that travels a straight segment between two points during [at, at+dur], with a short trail. */
export const FlowDot: React.FC<{ from: number[]; to: number[]; at: number; dur?: number; color?: string; size?: number }> = ({ from, to, at, dur = 26, color = TR.purpleBright, size = 18 }) => {
  const frame = useCurrentFrame();
  const t = (frame - at) / dur;
  if (t < 0 || t > 1) return null;
  return (
    <>
      {[0, 1, 2, 3].map((k) => {
        const tt = easeIO(Math.max(0, t - k * 0.05));
        const x = from[0] + (to[0] - from[0]) * tt;
        const y = from[1] + (to[1] - from[1]) * tt;
        const s = size * (1 - k * 0.18);
        return <div key={k} style={{ position: "absolute", left: x - s / 2, top: y - s / 2, width: s, height: s, borderRadius: s, background: color, opacity: 1 - k * 0.25, boxShadow: k === 0 ? `0 0 ${size * 1.6}px ${color}` : undefined }} />;
      })}
    </>
  );
};

/** The ToothReferral wordmark in white (for the dark stage). */
export const LogoWhite: React.FC<{ width?: number; style?: React.CSSProperties }> = ({ width = 420, style }) => (
  <Img src={staticFile("tr/logo.png")} style={{ width, height: "auto", filter: "brightness(0) invert(1)", ...style }} />
);
