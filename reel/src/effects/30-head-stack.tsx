/**
 * 30 Head stack: paper labels (a big word + a small word, typewriter type) stack up above the speaker's head
 * one by one, slightly offset and tilted, like the label tower in the editing-kit reel; a second, smaller
 * stack can sit at the side.
 */
import React from "react";
import { springAt, useEnvelope, type EffectMeta } from "./shared";
import { PaperChip, Sandwich, splitItems, useStage, type KitProps } from "./kit";

export const meta: EffectMeta = {
  n: 30, slug: "head-stack", name: "Head stack", durationInFrames: 105, needs: ["face"],
  what: "Typewriter paper labels stack up on top of the head, one per beat, like a tower of tags.",
  bestFor: "Lists of features, tools or problems; \"here's everything it does\".",
  avoid: "More than six labels; covering the face (they sit above the hair line).",
};

export type HeadStackProps = KitProps & { side?: string };

/** text: "Big small|Big small" (first word big, the rest small). `side`: a second stack on the side, same format. */
export const HeadStack: React.FC<HeadStackProps> = ({ talent, startAt = 0, text, side }) => {
  const s = useStage(talent, startAt);
  const { frame, fps, exit } = useEnvelope();
  const top = splitItems(text, "Referrals tracked|X-rays attached|Insurance verified|Notes signed|Network synced");
  const sideItems = side ? splitItems(side, "") : [];
  const chip = (t: string, i: number, x: number, y: number, at: number, size: number, tilt: number) => {
    const [big, ...rest] = t.split(" ");
    const k = springAt(frame, fps, at, { damping: 12, stiffness: 190, mass: 0.7 });
    return (
      <div key={`${x}-${i}`} style={{ position: "absolute", left: x, top: y - (1 - k) * 80, opacity: Math.min(1, k * 1.6) * (1 - exit), rotate: `${tilt}deg`, scale: String(0.7 + 0.3 * k), transformOrigin: "left bottom" }}>
        <PaperChip big={big} small={rest.join(" ")} size={size} />
      </div>
    );
  };
  const pitch = 92;
  const room = s.face.top - 20 - 60;
  const fits = room >= top.length * pitch;
  // above the head when it fits; otherwise a tower beside the head, on the roomier side, never over the face
  const right = 1080 - (s.face.x + s.face.w) > s.face.x;
  const sideX = right ? Math.min(1080 - 372, s.face.x + s.face.w + 16) : Math.max(10, s.face.x - 380);
  const base = fits ? s.face.top - 20 : s.face.y + s.face.h * 1.3;
  return (
    <Sandwich s={s} front={
      <>
        {top.map((t, i) => chip(t, i, fits ? s.face.cx - 260 + (i % 2 ? 40 : -10) : sideX + (i % 2 ? 18 : 0), fits ? base - (i + 1) * pitch : base - (i + 1) * 74, 4 + i * 7, fits ? 58 : 44, i % 2 ? 1.5 : -2))}
        {sideItems.map((t, i) => chip(t, i, -20, s.face.cy + 80 + i * 86, 10 + i * 7, 50, -6 + i * 2))}
      </>
    } />
  );
};
