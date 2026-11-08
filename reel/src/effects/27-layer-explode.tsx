/**
 * 27 Layer explode: the shot splits into its layers (the room, the speaker, the graphics) which separate in 3D
 * like an exploded view, rotate a little to show their depth, then click back together.
 */
import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { FONT_DISPLAY, FONT_MONO } from "../theme";
import { EASE, Finish, TalentLayer, clamp, useEnvelope, type EffectMeta } from "./shared";
import { useStage, type KitProps } from "./kit";

export const meta: EffectMeta = {
  n: 27, slug: "layer-explode", name: "Layer explode", durationInFrames: 105, needs: ["cutout", "plate", "face"],
  what: "The frame splits into stacked 3D layers (room, speaker, title) that fan apart and snap back.",
  bestFor: "\"Let me break it down\", how something is built, behind the scenes.",
  avoid: "Fast talking sections with lots of cuts.",
};

export type LayerExplodeProps = KitProps & { color?: string };

export const LayerExplode: React.FC<LayerExplodeProps> = ({ talent, startAt = 0, text = "BREAK IT DOWN", color = "#7B4CF0" }) => {
  const s = useStage(talent, startAt);
  const { frame, durationInFrames } = useEnvelope();
  const open = interpolate(frame, [4, 30], [0, 1], { ...clamp, easing: EASE.expoOut }) * (1 - interpolate(frame, [durationInFrames - 26, durationInFrames - 4], [0, 1], { ...clamp, easing: EASE.inOut }));
  const ry = open * -32;
  const rx = open * 10;
  const sc = 1 - open * 0.32;
  const gap = open * 260;
  const layer = (z: number, label: string, child: React.ReactNode, frameBox = false) => (
    <AbsoluteFill style={{ transform: `translateZ(${z * gap}px)`, transformStyle: "preserve-3d" }}>
      {child}
      {frameBox ? <AbsoluteFill style={{ border: `${4 * open}px solid ${color}`, borderRadius: 20 * open, opacity: open }} /> : null}
      <div style={{ position: "absolute", left: 30, top: 30, opacity: open, fontFamily: FONT_MONO, fontWeight: 700, fontSize: 34, color: "#fff", background: color, padding: "6px 16px", borderRadius: 10 }}>{label}</div>
    </AbsoluteFill>
  );
  return (
    <AbsoluteFill style={{ background: "#0B0A18", perspective: 2400 }}>
      <AbsoluteFill style={{ transformStyle: "preserve-3d", transform: `scale(${sc}) rotateX(${rx}deg) rotateY(${ry}deg)` }}>
        {layer(-1, "ROOM", <TalentLayer talent={s.tl} layer="plate" framing={s.framing} startAt={startAt} />, true)}
        {layer(0, "SPEAKER", <TalentLayer talent={s.tl} layer="cutout" framing={s.framing} startAt={startAt} />, true)}
        {layer(1, "TITLE", <div style={{ position: "absolute", top: 1380, width: "100%", textAlign: "center", fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: 96, color: "#fff", textShadow: "0 6px 24px rgba(0,0,0,0.6)" }}>{text}</div>, true)}
      </AbsoluteFill>
      <Finish />
    </AbsoluteFill>
  );
};
