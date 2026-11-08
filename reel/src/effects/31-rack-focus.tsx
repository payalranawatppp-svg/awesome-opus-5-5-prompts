/**
 * 31 Rack focus: a foreground card (a word, a stat) sits sharp in front of a blurred speaker; the focus pulls
 * to the speaker (card blurs and grows, speaker sharpens), like a lens focus pull, then the card drifts out.
 */
import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { FONT_DISPLAY, FONT_UI } from "../theme";
import { EASE, Finish, TalentLayer, clamp, useEnvelope, type EffectMeta } from "./shared";
import { useStage, type KitProps } from "./kit";

export const meta: EffectMeta = {
  n: 31, slug: "rack-focus", name: "Rack focus", durationInFrames: 90, needs: ["face"],
  what: "A sharp foreground card in front of a soft speaker; focus pulls back to the speaker as the card melts away.",
  bestFor: "Opening on a stat or word, then \"...and here's why\" back to the speaker.",
  avoid: "Long text on the card.",
};

export type RackFocusProps = KitProps & { sub?: string; color?: string };

export const RackFocus: React.FC<RackFocusProps> = ({ talent, startAt = 0, text = "20 referrals", sub = "lost in one month", color = "#7B4CF0" }) => {
  const s = useStage(talent, startAt);
  const { frame, durationInFrames } = useEnvelope();
  const pull = interpolate(frame, [durationInFrames * 0.42, durationInFrames * 0.62], [0, 1], { ...clamp, easing: EASE.inOut });
  const bg = 14 * (1 - pull);
  const fg = 26 * pull;
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <AbsoluteFill style={{ filter: bg > 0.3 ? `blur(${bg}px) brightness(${0.75 + 0.25 * pull})` : undefined }}>
        <TalentLayer talent={s.tl} layer="full" framing={s.framing} startAt={startAt} />
      </AbsoluteFill>
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", filter: fg > 0.3 ? `blur(${fg}px)` : undefined, opacity: 1 - interpolate(pull, [0.5, 1], [0, 1], clamp), scale: String(1 + pull * 0.5) }}>
        <div style={{ padding: "50px 70px", borderRadius: 40, background: "rgba(255,255,255,0.96)", boxShadow: "0 40px 100px rgba(0,0,0,0.5)", textAlign: "center" }}>
          <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: 130, color, lineHeight: 1 }}>{text}</div>
          <div style={{ fontFamily: FONT_UI, fontWeight: 600, fontSize: 48, color: "#333", marginTop: 14 }}>{sub}</div>
        </div>
      </AbsoluteFill>
      <Finish />
    </AbsoluteFill>
  );
};
