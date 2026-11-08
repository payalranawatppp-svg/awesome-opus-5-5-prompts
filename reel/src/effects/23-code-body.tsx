/**
 * 23 Code body: the speaker's body below the chin turns into scrolling code. A column of monospace lines is
 * masked by the cutout's silhouette (CSS mask with the cutout video is not available, so the code is drawn
 * over the body region and the head is re-drawn from the cutout on top, clipped above the chin).
 */
import React from "react";
import { AbsoluteFill } from "remotion";
import { Finish } from "./shared";
import { FONT_MONO } from "../theme";
import { TalentLayer, rand, useEnvelope, type EffectMeta } from "./shared";
import { useStage, type KitProps } from "./kit";

export const meta: EffectMeta = {
  n: 23, slug: "code-body", name: "Code body", durationInFrames: 90, needs: ["cutout", "face"],
  what: "Everything below the speaker's chin dissolves into glowing, scrolling code; the head stays real.",
  bestFor: "\"It's built into the system\", automation, AI, \"it runs on its own\".",
  avoid: "Warm, human moments.",
};

const SNIPS = ["referral.status = 'Scheduled'", "notify(generalDentist)", "if (attempts >= 3) reassign()", "attach(xrays, insurance)", "await sign(note)", "log(activity, who, when)", "network.sync(case)", "followUp.queue()"];

export type CodeBodyProps = KitProps & { color?: string };

export const CodeBody: React.FC<CodeBodyProps> = ({ talent, startAt = 0, color = "#7CF7C6" }) => {
  const s = useStage(talent, startAt);
  const { frame, enter, exit } = useEnvelope();
  const chin = s.face.y + s.face.h * 1.05;
  const reveal = enter * (1 - exit);
  const body = { left: s.face.cx - s.face.w * 2.6, width: s.face.w * 5.2, top: chin };
  // the body below the chin: the speaker's own silhouette (cutout, darkened) so the shape is exact, with
  // code scrolling over it (screen blend, faded at the sides so it stays on the torso)
  const code = (
    <div style={{ position: "absolute", left: body.left, top: chin, width: body.width, height: 1920 - chin, overflow: "hidden", opacity: reveal, mixBlendMode: "screen",
      WebkitMaskImage: "linear-gradient(90deg, transparent, #000 22%, #000 78%, transparent)", maskImage: "linear-gradient(90deg, transparent, #000 22%, #000 78%, transparent)" }}>
      {Array.from({ length: 44 }, (_, i) => {
        const y = ((i * 42 - frame * 6) % 1848 + 1848) % 1848;
        return <div key={i} style={{ position: "absolute", left: 40 + rand(i) * (body.width - 520), top: y, fontFamily: FONT_MONO, fontWeight: 700, fontSize: 34, color, opacity: 0.55 + rand(i + 9) * 0.45, whiteSpace: "nowrap", textShadow: `0 0 12px ${color}` }}>{SNIPS[i % SNIPS.length]}</div>;
      })}
    </div>
  );
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <TalentLayer talent={s.tl} layer="full" framing={s.framing} startAt={startAt} />
      {/* below the chin the speaker turns into a dark silhouette */}
      <AbsoluteFill style={{ clipPath: `inset(${chin}px 0 0 0)`, opacity: reveal, filter: "brightness(0.12) saturate(0) sepia(1) hue-rotate(110deg) saturate(3)" }}>
        <TalentLayer talent={s.tl} layer="cutout" framing={s.framing} startAt={startAt} />
      </AbsoluteFill>
      {code}
      <AbsoluteFill style={{ clipPath: `inset(0 0 ${1920 - chin - 10}px 0)` }}>
        <TalentLayer talent={s.tl} layer="cutout" framing={s.framing} startAt={startAt} />
      </AbsoluteFill>
      <Finish />
    </AbsoluteFill>
  );
};
