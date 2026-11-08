/**
 * 28 Sketch words: hand-written marker words write themselves around the speaker's head (stroke-reveal of the
 * text outline, then fill), each with a hand-drawn arrow pointing at him.
 */
import React from "react";
import { interpolate } from "remotion";
import { FONT_HAND } from "../theme";
import { EASE, clamp, useEnvelope, type EffectMeta } from "./shared";
import { Sandwich, splitItems, useStage, type KitProps } from "./kit";

export const meta: EffectMeta = {
  n: 28, slug: "sketch-words", name: "Sketch words", durationInFrames: 105, needs: ["face"],
  what: "Marker words write themselves around the head, each with a doodled arrow.",
  bestFor: "Labelling feelings or roles (\"tired\", \"overloaded\", \"on hold\"), a quick list of pains.",
  avoid: "Serious data (it reads as playful).",
};

export type SketchWordsProps = KitProps & { color?: string };

export const SketchWords: React.FC<SketchWordsProps> = ({ talent, startAt = 0, text, color = "#FFE14D" }) => {
  const s = useStage(talent, startAt);
  const { frame, exit } = useEnvelope();
  const words = splitItems(text, "on hold|3 voicemails|no X-rays");
  const spots = [
    { x: 40, y: s.face.y - 260, ax: s.face.x - 30, ay: s.face.y + s.face.h * 0.15, r: -6 },
    { x: Math.min(1080 - 420, s.face.x + s.face.w * 0.7), y: s.face.y - 330, ax: s.face.x + s.face.w + 10, ay: s.face.y + s.face.h * 0.05, r: 5 },
    { x: 40, y: s.face.y + s.face.h * 1.55, ax: s.face.x - 10, ay: s.face.y + s.face.h * 1.0, r: -3 },
  ];
  return (
    <Sandwich s={s} front={
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, opacity: 1 - exit }}>
        {words.slice(0, 3).map((w, i) => {
          const sp = spots[i];
          const at = 6 + i * 16;
          const draw = interpolate(frame, [at, at + 18], [0, 1], { ...clamp, easing: EASE.out });
          const fill = interpolate(frame, [at + 12, at + 20], [0, 1], clamp);
          const arrow = interpolate(frame, [at + 14, at + 24], [0, 1], { ...clamp, easing: EASE.out });
          const tx = sp.x + 120, ty = sp.y + 70;
          const mx = (tx + sp.ax) / 2 + 40, my = (ty + sp.ay) / 2 - 60;
          const path = `M${tx},${ty + 20} Q${mx},${my} ${sp.ax},${sp.ay}`;
          return (
            <g key={i}>
              <text x={sp.x} y={sp.y + 60} transform={`rotate(${sp.r} ${sp.x} ${sp.y})`} fontFamily={FONT_HAND} fontWeight={700} fontSize={84} fill={color} fillOpacity={fill} stroke={color} strokeWidth={2.5} strokeDasharray={1400} strokeDashoffset={1400 * (1 - draw)} style={{ filter: "drop-shadow(0 3px 6px rgba(0,0,0,0.55))" }}>{w}</text>
              <path d={path} fill="none" stroke={color} strokeWidth={7} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - arrow} style={{ filter: "drop-shadow(0 3px 6px rgba(0,0,0,0.5))" }} />
              {arrow > 0.95 ? <path d={`M${sp.ax},${sp.ay} l${tx > sp.ax ? 26 : -26},-14 M${sp.ax},${sp.ay} l${tx > sp.ax ? 22 : -22},20`} stroke={color} strokeWidth={7} strokeLinecap="round" /> : null}
            </g>
          );
        })}
      </svg>
    } />
  );
};
