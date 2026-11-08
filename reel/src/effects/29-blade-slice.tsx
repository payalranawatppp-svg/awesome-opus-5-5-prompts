/**
 * 29 Blade slice: a bright blade flash cuts the frame on a diagonal; the two halves slide apart along the cut,
 * revealing a word (or the next scene colour) behind, then close again.
 */
import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { FONT_DISPLAY } from "../theme";
import { EASE, Finish, TalentLayer, clamp, useEnvelope, type EffectMeta } from "./shared";
import { useStage, type KitProps } from "./kit";

export const meta: EffectMeta = {
  n: 29, slug: "blade-slice", name: "Blade slice", durationInFrames: 60, needs: ["face"],
  what: "A blade flash slices the frame diagonally; the halves slide apart to show a word, then snap shut.",
  bestFor: "Cutting something out (\"cut the phone tag\", \"no more...\"), a hard topic change.",
  avoid: "Gentle, reassuring lines.",
};

export type BladeSliceProps = KitProps & { color?: string; bg?: string };

export const BladeSlice: React.FC<BladeSliceProps> = ({ talent, startAt = 0, text = "NO MORE PHONE TAG", color = "#FFFFFF", bg = "#7B4CF0" }) => {
  const s = useStage(talent, startAt);
  const { frame, durationInFrames } = useEnvelope();
  const cut = interpolate(frame, [4, 10], [0, 1], { ...clamp, easing: EASE.in });
  const open = interpolate(frame, [10, 22], [0, 1], { ...clamp, easing: EASE.expoOut }) * (1 - interpolate(frame, [durationInFrames - 16, durationInFrames - 4], [0, 1], { ...clamp, easing: EASE.in }));
  const d = open * 260; // separation along the normal
  // cut line from (0, 1300) to (1080, 700): normal ~ (0.49, 0.87)
  const nx = 0.49, ny = 0.87;
  const A = "polygon(0 0, 100% 0, 100% 36.5%, 0 67.7%)";
  const B = "polygon(0 67.7%, 100% 36.5%, 100% 100%, 0 100%)";
  const shot = <TalentLayer talent={s.tl} layer="full" framing={s.framing} startAt={startAt} />;
  return (
    <AbsoluteFill style={{ background: bg }}>
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: 120, color, rotate: "-29deg", textAlign: "center", lineHeight: 1, opacity: open, scale: String(0.8 + 0.2 * open) }}>{text}</div>
      </AbsoluteFill>
      <AbsoluteFill style={{ clipPath: A, translate: `${-nx * d}px ${-ny * d}px` }}>{shot}</AbsoluteFill>
      <AbsoluteFill style={{ clipPath: B, translate: `${nx * d}px ${ny * d}px` }}>{shot}</AbsoluteFill>
      {/* the blade flash travelling along the cut */}
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, opacity: interpolate(frame, [4, 8, 16], [0, 1, 0], clamp) }}>
        <line x1={-40} y1={1323} x2={-40 + 1160 * cut} y2={1323 - 645 * cut} stroke="#fff" strokeWidth={10} style={{ filter: "drop-shadow(0 0 18px #fff) drop-shadow(0 0 40px #9F7BFF)" }} />
      </svg>
      <Finish />
    </AbsoluteFill>
  );
};
