/**
 * 37 Paper tear: the frame tears like paper along a jagged vertical line; the two halves peel apart (with a
 * white fibrous edge and a drop shadow) to reveal a second layer behind: a word card, or the same shot in a
 * different grade (a before/after).
 */
import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { FONT_DISPLAY } from "../theme";
import { EASE, Finish, TalentLayer, clamp, rand, useEnvelope, type EffectMeta } from "./shared";
import { useStage, type KitProps } from "./kit";

export const meta: EffectMeta = {
  n: 37, slug: "paper-tear", name: "Paper tear", durationInFrames: 75, needs: ["face"],
  what: "The frame rips down the middle like paper and the halves peel apart to show what's underneath.",
  bestFor: "Before vs after, \"the old way\" to \"the new way\", tearing up the paperwork.",
  avoid: "Mid-sentence when the speaker must stay whole on screen.",
};

export type PaperTearProps = KitProps & { color?: string; bg?: string };

const jag = (side: "L" | "R", cx: number) => {
  const pts: string[] = [];
  for (let i = 0; i <= 40; i++) {
    const y = (i / 40) * 100;
    const x = cx + (rand(i * 3.7) - 0.5) * 3.2;
    pts.push(`${x.toFixed(2)}% ${y}%`);
  }
  return side === "L" ? `polygon(0 0, ${pts.join(", ")}, 0 100%)` : `polygon(${pts.join(", ")}, 100% 100%, 100% 0)`;
};

export const PaperTear: React.FC<PaperTearProps> = ({ talent, startAt = 0, text = "THE NEW WAY", color = "#151226", bg = "#F4F1FF" }) => {
  const s = useStage(talent, startAt);
  const { frame, durationInFrames } = useEnvelope();
  const open = interpolate(frame, [6, 24], [0, 1], { ...clamp, easing: EASE.expoOut }) * (1 - interpolate(frame, [durationInFrames - 14, durationInFrames - 2], [0, 1], { ...clamp, easing: EASE.in }));
  const d = open * 420;
  const shot = <TalentLayer talent={s.tl} layer="full" framing={s.framing} startAt={startAt} />;
  const half = (side: "L" | "R") => (
    <AbsoluteFill style={{ translate: `${side === "L" ? -d : d}px 0`, rotate: `${(side === "L" ? -1 : 1) * open * 4}deg`, transformOrigin: side === "L" ? "0% 100%" : "100% 100%", filter: "drop-shadow(0 20px 30px rgba(0,0,0,0.5))" }}>
      <AbsoluteFill style={{ clipPath: jag(side, side === "L" ? 50.6 : 49.4), background: "#fff" }} />
      <AbsoluteFill style={{ clipPath: jag(side, 50) }}>{shot}</AbsoluteFill>
    </AbsoluteFill>
  );
  return (
    <AbsoluteFill style={{ background: bg }}>
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: 130, color, textAlign: "center", lineHeight: 1, width: 700, opacity: open }}>{text}</div>
      </AbsoluteFill>
      {half("L")}
      {half("R")}
      <Finish />
    </AbsoluteFill>
  );
};
