/**
 * 19 Clone row: copies of the speaker (the cutout) pop in side by side behind him, smaller and tinted, so
 * he stands in front of a row of himself; they slide out again at the end.
 */
import React from "react";
import { AbsoluteFill } from "remotion";
import { FONT_DISPLAY } from "../theme";
import { TalentLayer, springAt, useEnvelope, type EffectMeta } from "./shared";
import { Sandwich, useStage, type KitProps } from "./kit";

export const meta: EffectMeta = {
  n: 19, slug: "clone-row", name: "Clone row", durationInFrames: 90, needs: ["cutout", "plate", "face"],
  what: "A row of smaller copies of the speaker pops in behind him, like a team of clones.",
  bestFor: "\"Imagine five of me\", doing many jobs at once, a team, scale.",
  avoid: "Serious or sad moments.",
};

export type CloneRowProps = KitProps & { count?: number; label?: string };

export const CloneRow: React.FC<CloneRowProps> = ({ talent, startAt = 0, count = 4, label }) => {
  const s = useStage(talent, startAt);
  const { frame, fps, exit } = useEnvelope();
  const slots = Array.from({ length: count }, (_, i) => i - (count - 1) / 2);
  return (
    <Sandwich s={s} plate behind={
      <AbsoluteFill>
        {slots.map((k, i) => {
          const p = springAt(frame, fps, 3 + Math.abs(k) * 5);
          const sc = 0.62;
          const fr = { scale: s.framing.scale * sc, x: 0, y: 0 };
          // place each clone's face centre on a row across the frame, a bit higher than the speaker
          fr.x = 540 + k * 300 * (1 - exit * 0.2) - ((s.face.cx - s.framing.x) / s.framing.scale) * fr.scale + (k === 0 ? 0 : 0);
          fr.y = s.face.cy - 120 - ((s.face.cy - s.framing.y) / s.framing.scale) * fr.scale + (1 - p) * 500 + exit * 600;
          return (
            <div key={i} style={{ position: "absolute", inset: 0, opacity: p * (1 - exit), filter: `saturate(0.7) brightness(${0.75 - Math.abs(k) * 0.06})` }}>
              <TalentLayer talent={s.tl} layer="cutout" framing={fr} startAt={startAt + i * 0.25} />
            </div>
          );
        })}
        {label ? <div style={{ position: "absolute", top: 210, width: "100%", textAlign: "center", fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: 96, color: "#fff", opacity: springAt(frame, fps, 10) * (1 - exit), textShadow: "0 6px 30px rgba(0,0,0,0.6)" }}>{label}</div> : null}
      </AbsoluteFill>
    } />
  );
};
