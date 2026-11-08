/**
 * 20 Day dial: a big rotary dial (like a combination lock / day wheel) rises behind the speaker's head and
 * spins from the first label to the last, ticking past the ones in between, then lands with a bump.
 */
import React from "react";
import { interpolate } from "remotion";
import { FONT_DISPLAY, FONT_MONO } from "../theme";
import { EASE, clamp, springAt, useEnvelope, type EffectMeta } from "./shared";
import { Sandwich, splitItems, useStage, type KitProps } from "./kit";

export const meta: EffectMeta = {
  n: 20, slug: "day-dial", name: "Day dial", durationInFrames: 105, needs: ["cutout", "face"],
  what: "A huge dial behind the head spins from one label to another (Day 1 to Day 30, Monday to Friday).",
  bestFor: "Time passing, before and after, \"in 30 days\", \"by Friday\".",
  avoid: "Lines with no time or count in them.",
};

export type DayDialProps = KitProps & { color?: string };

export const DayDial: React.FC<DayDialProps> = ({ talent, startAt = 0, text, color = "#7B4CF0" }) => {
  const s = useStage(talent, startAt);
  const { frame, fps, enter, exit, durationInFrames } = useEnvelope();
  const labels = splitItems(text, "Day 1|Day 7|Day 14|Day 21|Day 30");
  const n = labels.length;
  const R = 520;
  const cx = s.face.cx;
  const cy = s.face.cy + 60;
  const spin = interpolate(frame, [10, durationInFrames - 26], [0, n - 1], { ...clamp, easing: EASE.inOut });
  const land = springAt(frame, fps, durationInFrames - 26, { damping: 8, stiffness: 200, mass: 0.6 });
  const step = 360 / Math.max(n * 2, 8);
  const rot = -spin * step + (1 - land) * 0;
  const idx = Math.round(spin);
  const rise = enter * (1 - exit);
  return (
    <Sandwich s={s} behind={
      <div style={{ position: "absolute", left: cx - R, top: cy - R + (1 - rise) * 600, width: R * 2, height: R * 2, opacity: rise }}>
        <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "radial-gradient(circle at 50% 40%, #2a2550, #0c0a1e 70%)", boxShadow: `0 0 0 14px ${color}55, 0 40px 120px rgba(0,0,0,0.6)` }} />
        <div style={{ position: "absolute", inset: 0, rotate: `${rot}deg` }}>
          {Array.from({ length: 72 }, (_, i) => (
            <div key={i} style={{ position: "absolute", left: R - 2, top: 18, width: 4, height: i % 6 === 0 ? 46 : 22, background: "rgba(255,255,255,0.55)", transformOrigin: `2px ${R - 18}px`, rotate: `${i * 5}deg` }} />
          ))}
          {labels.map((l, i) => (
            <div key={i} style={{ position: "absolute", left: 0, top: 0, width: R * 2, height: R * 2, rotate: `${i * step}deg` }}>
              <div style={{ position: "absolute", top: 80, width: "100%", textAlign: "center", fontFamily: FONT_MONO, fontWeight: 700, fontSize: 64, color: i === idx ? "#fff" : "rgba(255,255,255,0.4)" }}>{l}</div>
            </div>
          ))}
        </div>
        <div style={{ position: "absolute", left: R - 24, top: -14, width: 0, height: 0, borderLeft: "24px solid transparent", borderRight: "24px solid transparent", borderTop: `40px solid ${color}` }} />
      </div>
    } front={
      <div style={{ position: "absolute", top: s.face.y + s.face.h * 2.2, width: "100%", textAlign: "center", opacity: land * (1 - exit), scale: String(0.8 + 0.2 * land) }}>
        <span style={{ fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: 92, color: "#fff", padding: "10px 34px", borderRadius: 24, background: color, boxShadow: "0 20px 50px rgba(0,0,0,0.4)" }}>{labels[n - 1]}</span>
      </div>
    } />
  );
};
