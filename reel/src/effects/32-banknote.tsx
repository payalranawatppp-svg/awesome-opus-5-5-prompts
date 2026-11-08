/**
 * 32 Banknote: the frame becomes a banknote. Engraved green paper with guilloche rings and a value in each
 * corner; the speaker sits in the oval portrait window (monochrome, engraved tint), the note slides in and
 * flutters slightly.
 */
import React from "react";
import { AbsoluteFill } from "remotion";
import { FONT_SERIF } from "../theme";
import { Finish, TalentLayer, springAt, useEnvelope, type EffectMeta } from "./shared";
import { useStage, type KitProps } from "./kit";

export const meta: EffectMeta = {
  n: 32, slug: "banknote", name: "Banknote", durationInFrames: 90, needs: ["face"],
  what: "The speaker becomes the portrait on an engraved banknote with the value in the corners.",
  bestFor: "Money lines: ROI, \"it pays for itself\", \"thousands a month\".",
  avoid: "Lines with no money angle.",
};

export type BanknoteProps = KitProps & { value?: string; title?: string; ink?: string };

export const Banknote: React.FC<BanknoteProps> = ({ talent, startAt = 0, value = "$5,000", title = "SAVED REFERRALS · ONE YEAR", ink = "#1E4D3A" }) => {
  const s = useStage(talent, startAt);
  const { frame, fps, exit } = useEnvelope();
  const k = springAt(frame, fps, 0, { damping: 16, stiffness: 120 });
  const W = 980, H = 470;
  const flutter = Math.sin(frame / 9) * 2;
  // a framing that puts the face in the oval
  const ovalW = 300, ovalH = 360;
  const fr = { ...s.framing };
  const scale = (ovalH * 0.62) / (s.face.h / s.framing.scale);
  const srcCx = (s.face.cx - s.framing.x) / s.framing.scale, srcCy = (s.face.cy - s.framing.y) / s.framing.scale;
  fr.scale = scale; fr.x = W / 2 - srcCx * scale; fr.y = H / 2 + 20 - srcCy * scale;
  return (
    <AbsoluteFill style={{ background: "#0d0f0c", alignItems: "center", justifyContent: "center" }}>
      <AbsoluteFill style={{ filter: "blur(18px) brightness(0.45)" }}><TalentLayer talent={s.tl} layer="full" framing={s.framing} startAt={startAt} /></AbsoluteFill>
      <div style={{ position: "relative", width: W, height: H, translate: `${(1 - k) * 1200}px 0`, rotate: `${-4 + flutter}deg`, opacity: 1 - exit, borderRadius: 14, overflow: "hidden", boxShadow: "0 40px 90px rgba(0,0,0,0.6)",
        background: `repeating-radial-gradient(circle at 20% 50%, #e9efd9 0 3px, #dfe8cb 3px 6px), #e6ecd6` }}>
        <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
          {Array.from({ length: 26 }, (_, i) => <ellipse key={i} cx={W / 2} cy={H / 2} rx={180 + i * 14} ry={150 + i * 8} fill="none" stroke={ink} strokeOpacity={0.12} strokeWidth={1.2} />)}
          <rect x={14} y={14} width={W - 28} height={H - 28} fill="none" stroke={ink} strokeWidth={6} rx={8} />
          <rect x={26} y={26} width={W - 52} height={H - 52} fill="none" stroke={ink} strokeWidth={1.5} rx={6} />
        </svg>
        <div style={{ position: "absolute", left: W / 2 - ovalW / 2, top: H / 2 - ovalH / 2 + 20, width: ovalW, height: ovalH, borderRadius: "50%", overflow: "hidden", border: `6px solid ${ink}`, background: "#cfd8bd" }}>
          <div style={{ position: "absolute", left: -(W / 2 - ovalW / 2), top: -(H / 2 - ovalH / 2 + 20), width: W, height: H, filter: "grayscale(1) sepia(0.5) hue-rotate(60deg) contrast(1.3) brightness(1.05)" }}>
            <TalentLayer talent={s.tl} layer="full" framing={fr} startAt={startAt} />
          </div>
        </div>
        {[[40, 60], [W - 40, 60], [40, H - 20], [W - 40, H - 20]].map(([x, y], i) => (
          <div key={i} style={{ position: "absolute", left: x, top: y - 60, translate: i % 2 ? "-100% 0" : "0 0", fontFamily: FONT_SERIF, fontSize: 64, color: ink }}>{value}</div>
        ))}
        <div style={{ position: "absolute", top: 34, width: "100%", textAlign: "center", fontFamily: FONT_SERIF, fontSize: 30, letterSpacing: "0.2em", color: ink }}>{title}</div>
      </div>
      <Finish />
    </AbsoluteFill>
  );
};
