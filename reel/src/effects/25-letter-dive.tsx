/**
 * 25 Letter dive: a giant word stands behind the speaker; the camera dives into the hole of one letter
 * (the counter of an O, the gap of a U...) until the letter fills the frame and the next scene shows through it.
 */
import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { FONT_DISPLAY } from "../theme";
import { EASE, clamp, springAt, useEnvelope, type EffectMeta } from "./shared";
import { Sandwich, useStage, type KitProps } from "./kit";

export const meta: EffectMeta = {
  n: 25, slug: "letter-dive", name: "Letter dive", durationInFrames: 75, needs: ["cutout", "plate", "face"],
  what: "A giant word appears behind the speaker, then the camera dives through one of its letters to the next shot.",
  bestFor: "A transition on a key word (\"so let's go deeper\", \"inside\"), chapter changes.",
  avoid: "The middle of a sentence that continues in the same shot.",
};

export type LetterDiveProps = KitProps & { letter?: number; color?: string; next?: string };

export const LetterDive: React.FC<LetterDiveProps> = ({ talent, startAt = 0, text = "LOOP", letter = 1, color = "#7B4CF0", next = "#F4F1FF" }) => {
  const s = useStage(talent, startAt);
  const { frame, fps, durationInFrames } = useEnvelope(1);
  const show = springAt(frame, fps, 0);
  const dive = interpolate(frame, [durationInFrames * 0.45, durationInFrames - 2], [0, 1], { ...clamp, easing: EASE.in });
  const zoom = 1 + Math.pow(dive, 2.2) * 40;
  // approximate centre of the chosen letter
  const fs = 360;
  const charW = fs * 0.68;
  const wordW = charW * text.length;
  const lx = 540 - wordW / 2 + charW * (letter + 0.5);
  const ly = s.face.y - 40;
  return (
    <AbsoluteFill style={{ background: next }}>
      <AbsoluteFill style={{ transformOrigin: `${lx}px ${ly}px`, scale: String(zoom), opacity: 1 - interpolate(dive, [0.85, 1], [0, 1], clamp) }}>
        <Sandwich s={s} plate behind={
          <div style={{ position: "absolute", top: ly - fs * 0.62, width: "100%", textAlign: "center", fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: fs, letterSpacing: "-0.02em", color, opacity: show, scale: String(0.85 + 0.15 * show), textShadow: "0 30px 80px rgba(0,0,0,0.5)" }}>{text}</div>
        } style={{ opacity: 1 }} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
