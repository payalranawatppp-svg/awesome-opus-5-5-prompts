/**
 * 34 Impact frame: a manga-style hit on one word. For a few frames the image goes high-contrast black and
 * white (inverted on the first frame), radial speed lines burst around the face, the frame shakes and a bold
 * word slams in; then it snaps back to normal.
 */
import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { FONT_DISPLAY } from "../theme";
import { Finish, TalentLayer, clamp, rand, useEnvelope, type EffectMeta } from "./shared";
import { useStage, type KitProps } from "./kit";

export const meta: EffectMeta = {
  n: 34, slug: "impact-frame", name: "Impact frame", durationInFrames: 30, needs: ["face"],
  what: "A 1-second manga hit: inverted then ink-contrast frame, speed lines, shake and a slammed word.",
  bestFor: "The punch word (\"gone\", \"lost\", \"twenty\"), a hard realisation.",
  avoid: "Using it more than twice per video.",
};

export type ImpactFrameProps = KitProps & { color?: string };

export const ImpactFrame: React.FC<ImpactFrameProps> = ({ talent, startAt = 0, text = "LOST!", color = "#FFE14D" }) => {
  const s = useStage(talent, startAt);
  const { frame, durationInFrames } = useEnvelope(1);
  const hit = interpolate(frame, [0, 3, durationInFrames - 8, durationInFrames - 2], [1, 1, 1, 0], clamp);
  const inv = frame < 2;
  const shake = hit * (frame < 10 ? 18 : 6);
  const dx = (rand(frame) - 0.5) * shake, dy = (rand(frame + 50) - 0.5) * shake;
  const lines = 48;
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <AbsoluteFill style={{ translate: `${dx}px ${dy}px`, scale: String(1 + 0.08 * hit), filter: hit > 0.05 ? `grayscale(${hit}) contrast(${1 + 1.6 * hit}) ${inv ? "invert(1)" : ""}` : undefined }}>
        <TalentLayer talent={s.tl} layer="full" framing={s.framing} startAt={startAt} />
      </AbsoluteFill>
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, opacity: hit }}>
        {Array.from({ length: lines }, (_, i) => {
          const a = (i / lines) * Math.PI * 2 + rand(i + frame) * 0.05;
          const r0 = 420 + rand(i) * 160, r1 = 1500;
          const w = 6 + rand(i * 7) * 16;
          const x0 = s.face.cx + Math.cos(a) * r0, y0 = s.face.cy + Math.sin(a) * r0;
          const x1 = s.face.cx + Math.cos(a) * r1, y1 = s.face.cy + Math.sin(a) * r1;
          return <line key={i} x1={x0} y1={y0} x2={x1} y2={y1} stroke={inv ? "#fff" : "#000"} strokeWidth={w} strokeLinecap="round" />;
        })}
      </svg>
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "flex-end", paddingBottom: 380, opacity: hit }}>
        <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: 200, color, rotate: "-8deg", scale: String(interpolate(frame, [0, 4], [2.2, 1], clamp)), WebkitTextStroke: "10px #000", paintOrder: "stroke fill", letterSpacing: "-0.03em" }}>{text}</div>
      </AbsoluteFill>
      <Finish />
    </AbsoluteFill>
  );
};
