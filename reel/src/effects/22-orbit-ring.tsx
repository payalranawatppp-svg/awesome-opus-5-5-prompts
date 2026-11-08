/**
 * 22 Orbit ring: a ring of text circles the speaker's head on a tilted ellipse, passing behind the head at
 * the back and in front at the front (two copies of the ring, clipped to the back and front halves, with
 * the cutout between them).
 */
import React from "react";
import { AbsoluteFill } from "remotion";
import { FONT_DISPLAY } from "../theme";
import { useEnvelope, type EffectMeta } from "./shared";
import { Sandwich, useStage, type KitProps } from "./kit";

export const meta: EffectMeta = {
  n: 22, slug: "orbit-ring", name: "Orbit ring", durationInFrames: 105, needs: ["cutout", "face"],
  what: "A ring of words orbits the head like a halo, going behind the head and back in front.",
  bestFor: "A mantra or slogan, the brand name, \"all I think about is...\".",
  avoid: "Long sentences (keep it to 3-6 words, repeated).",
};

export type OrbitRingProps = KitProps & { color?: string; speed?: number };

const Ring: React.FC<{ words: string; cx: number; cy: number; rx: number; ry: number; tilt: number; t: number; half: "back" | "front"; color: string; o: number }> = ({ words, cx, cy, rx, ry, tilt, t, half, color, o }) => {
  const chars = words.split("");
  return (
    <AbsoluteFill style={{ opacity: o }}>
      {chars.map((ch, i) => {
        const a = (i / chars.length) * Math.PI * 2 + t;
        const z = Math.sin(a); // >0 front
        if ((half === "front") !== z > 0) return null;
        const x = cx + Math.cos(a) * rx;
        const y = cy + Math.sin(a) * ry + Math.cos(a) * rx * Math.tan(tilt);
        const sc = 0.75 + 0.25 * (z + 1) / 2;
        return (
          <div key={i} style={{ position: "absolute", left: x - 30, top: y - 40, width: 60, textAlign: "center", fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: 92 * sc, color, opacity: 0.5 + 0.5 * (z + 1) / 2, textShadow: "0 4px 20px rgba(0,0,0,0.5)", rotate: `${(Math.cos(a) * -18).toFixed(1)}deg` }}>{ch}</div>
        );
      })}
    </AbsoluteFill>
  );
};

export const OrbitRing: React.FC<OrbitRingProps> = ({ talent, startAt = 0, text = "TOOTH REFERRAL • JUST REFER IT • ", color = "#FFFFFF", speed = 1 }) => {
  const s = useStage(talent, startAt);
  const { frame, enter, exit } = useEnvelope();
  const t = (frame / 30) * 1.1 * speed;
  const o = enter * (1 - exit);
  const geo = { cx: s.face.cx, cy: s.face.y + s.face.h * 0.15, rx: s.face.w * 1.1 * (0.6 + 0.4 * enter), ry: s.face.w * 0.28, tilt: -0.12 };
  return (
    <Sandwich s={s} behind={<Ring words={text} {...geo} t={t} half="back" color={color} o={o} />} front={<Ring words={text} {...geo} t={t} half="front" color={color} o={o} />} />
  );
};
