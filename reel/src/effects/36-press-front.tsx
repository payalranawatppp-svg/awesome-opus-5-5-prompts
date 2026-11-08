/**
 * 36 Press front: a newspaper front page spins in (the classic "extra, extra" spin) and lands; the speaker is
 * the front-page photo (halftone-ish, black and white), under a masthead and a big headline.
 */
import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { FONT_DISPLAY, FONT_SERIF } from "../theme";
import { EASE, Finish, TalentLayer, clamp, useEnvelope, type EffectMeta } from "./shared";
import { useStage, type KitProps } from "./kit";

export const meta: EffectMeta = {
  n: 36, slug: "press-front", name: "Press front", durationInFrames: 90, needs: ["face"],
  what: "A newspaper spins in and lands; the speaker is the front-page photo under a big headline.",
  bestFor: "News-style claims (\"breaking:\", \"the industry doesn't want you to know\"), results.",
  avoid: "Quiet personal lines.",
};

export type PressFrontProps = KitProps & { masthead?: string; date?: string };

export const PressFront: React.FC<PressFrontProps> = ({ talent, startAt = 0, text = "Front Desk Never Loses a Referral Again", masthead = "The Dental Times", date = "SATURDAY, NOVEMBER 8, 2026" }) => {
  const s = useStage(talent, startAt);
  const { frame, exit } = useEnvelope();
  const k = interpolate(frame, [0, 22], [0, 1], { ...clamp, easing: EASE.expoOut });
  const spin = (1 - k) * 720;
  const sc = 0.2 + 0.8 * k;
  const W = 940, H = 1400;
  const photo = { x: 50, y: 470, w: W - 100, h: 760 };
  const fr = { ...s.framing };
  const srcCx = (s.face.cx - s.framing.x) / s.framing.scale, srcCy = (s.face.cy - s.framing.y) / s.framing.scale;
  fr.scale = s.framing.scale * 0.8; fr.x = photo.w / 2 - srcCx * fr.scale; fr.y = photo.h * 0.4 - srcCy * fr.scale;
  return (
    <AbsoluteFill style={{ background: "#16130f", alignItems: "center", justifyContent: "center" }}>
      <AbsoluteFill style={{ filter: "blur(20px) brightness(0.35)" }}><TalentLayer talent={s.tl} layer="full" framing={s.framing} startAt={startAt} /></AbsoluteFill>
      <div style={{ position: "relative", width: W, height: H, background: "#F3EEE2", rotate: `${spin - 3}deg`, scale: String(sc * (1 - exit * 0.1)), opacity: 1 - exit, boxShadow: "0 50px 120px rgba(0,0,0,0.7)", color: "#151515", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: 40, width: "100%", textAlign: "center", fontFamily: FONT_SERIF, fontSize: 108 }}>{masthead}</div>
        <div style={{ position: "absolute", top: 172, left: 50, right: 50, borderTop: "3px solid #151515", borderBottom: "1px solid #151515", padding: "6px 0", fontFamily: FONT_SERIF, fontSize: 24, letterSpacing: "0.12em", display: "flex", justifyContent: "space-between" }}><span>{date}</span><span>LATE EDITION</span></div>
        <div style={{ position: "absolute", top: 232, left: 50, right: 50, fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: 82, lineHeight: 1.02, letterSpacing: "-0.02em" }}>{text}</div>
        <div style={{ position: "absolute", left: photo.x, top: photo.y, width: photo.w, height: photo.h, overflow: "hidden", filter: "grayscale(1) contrast(1.35) brightness(1.05)" }}>
          <TalentLayer talent={s.tl} layer="full" framing={fr} startAt={startAt} />
          <AbsoluteFill style={{ backgroundImage: "radial-gradient(rgba(0,0,0,0.22) 1px, transparent 1.6px)", backgroundSize: "6px 6px", mixBlendMode: "multiply" }} />
        </div>
        <div style={{ position: "absolute", top: photo.y + photo.h + 18, left: 50, right: 50, columnCount: 3, columnGap: 24, fontFamily: FONT_SERIF, fontSize: 20, lineHeight: 1.3, color: "#333" }}>
          {"Specialist offices report fewer missed call-backs, faster first contact and signed consult notes sent the same day, after moving every referral into one shared system. ".repeat(3)}
        </div>
      </div>
      <Finish />
    </AbsoluteFill>
  );
};
