/**
 * 09 Zoom-through cut: a transition from clip A into clip B through a card.
 *
 * A glass "up next" card floats in over clip A with clip B already playing inside it. The camera dips
 * (anticipation), then dives into the card: everything scales up around the card with a radial zoom blur
 * while the card straightens, sheds its chrome (label, border, shadow, corner radius) and lands exactly on
 * the frame, so clip B arrives at its normal full-frame framing. No hard cut: by the time A is gone the
 * card fills the frame. The camera is one transform, screen = Q + (p - P) * z, where P is the card centre,
 * z the zoom and Q slides from P to the frame centre as z goes 1 -> K (K = frame width / card width).
 */
import React from "react";
import { zoomBlur } from "@remotion/effects/zoom-blur";
import { AbsoluteFill, Easing, interpolate } from "remotion";
import {
  EASE,
  Finish,
  SPRING,
  TALENT,
  TalentLayer,
  clamp,
  float,
  frameOnFace,
  springAt,
  useEnvelope,
  type EffectMeta,
  type Framing,
  type Talent,
} from "./shared";
import { COLORS, FONT_DISPLAY, FONT_UI, HEIGHT, WIDTH } from "../theme";

export const meta: EffectMeta = {
  n: 9,
  slug: "zoom-through-cut",
  name: "Zoom-through cut",
  durationInFrames: 75,
  needs: [],
  what: "A transition: an \"up next\" card with the next clip playing inside floats in, and the camera dives into it until the next clip fills the frame.",
  bestFor: "Chapter changes and \"let me show you\" moments that lead into a result or a demo.",
  avoid: "Every cut: keep it for section changes. Both clips need at least the effect's length left to play.",
};

export type ZoomThroughCutProps = {
  /** clip A: the shot we leave */
  talent?: Talent;
  /** seconds into clip A at the effect's first frame */
  startAt?: number;
  /** clip B: the shot we arrive in (plays inside the card from the first frame) */
  talentB?: Talent;
  /** seconds into clip B at the effect's first frame */
  startAtB?: number;
  /** small label on the card */
  kicker?: string;
  /** card title */
  title?: string;
};

// ---------------------------------------------------------------------------------------------------
// Look

const CARD = {
  /** card size at rest (frame aspect, so it lands exactly on the frame) */
  w: 280,
  /** card centre at rest (right of the speaker, under his face) */
  x: 806,
  y: 1330,
  rot: -4,
  radius: 40,
  accent: COLORS.cyan,
};
const CARD_H = (CARD.w * HEIGHT) / WIDTH;

/** zoomBlur's centre is in GL texture space: y is measured from the BOTTOM of the source. */
const glUv = (u: number, vFromTop: number): [number, number] => [
  Math.min(1, Math.max(0, u)),
  Math.min(1, Math.max(0, 1 - vFromTop)),
];

// ---------------------------------------------------------------------------------------------------

export const ZoomThroughCut: React.FC<ZoomThroughCutProps> = ({
  talent = TALENT["01-hook"],
  startAt = 0,
  talentB = TALENT["03-outcome"],
  startAtB = 0.4,
  kicker = "UP NEXT",
  title = "The results",
}) => {
  const { frame, fps, durationInFrames } = useEnvelope();
  const last = durationInFrames - 1;

  // ----- timeline: card in, hold, dip, dive, B settles (dive keys off the end)
  const settle = Math.round(0.4 * fps);
  const diveLen = Math.round(0.8 * fps);
  const diveEnd = last - settle;
  const diveStart = diveEnd - diveLen;
  const cardIn = springAt(frame, fps, Math.round(0.08 * fps), SPRING.snappy);
  const cardInSoft = springAt(frame, fps, Math.round(0.08 * fps), SPRING.smooth);
  const chipIn = springAt(frame, fps, Math.round(0.08 * fps) + 5, SPRING.smooth);
  const titleIn = springAt(frame, fps, Math.round(0.08 * fps) + 9, SPRING.smooth);

  // ----- camera
  const K = WIDTH / CARD.w;
  const P = { x: CARD.x, y: CARD.y };
  const C = { x: WIDTH / 2, y: HEIGHT / 2 };
  const DIVE = Easing.bezier(0.72, 0, 0.36, 1);
  const eAt = (f: number) => interpolate(f, [diveStart, diveEnd], [0, 1], { ...clamp, easing: DIVE });
  const zAt = (f: number) => Math.exp(Math.log(K) * eAt(f));
  const e = eAt(frame);
  const z = zAt(frame);
  const u = (z - 1) / (K - 1);
  const Q = { x: P.x + (C.x - P.x) * u, y: P.y + (C.y - P.y) * u };
  const speed = Math.abs(Math.log(zAt(frame + 0.5)) - Math.log(zAt(frame - 0.5))); // log-zoom per frame
  // fixed point of the move (stays put on screen AND in the scene): the zoom-blur centre
  const F = { x: P.x + (P.x - C.x) / (K - 1), y: P.y + (P.y - C.y) / (K - 1) };
  const blurAmt = Math.min(90, speed * 720 * 0.65);

  // anticipation: the card dips just before the dive
  const dip = interpolate(frame, [diveStart - 6, diveStart, diveStart + 4], [0, 1, 0], { ...clamp, easing: EASE.inOut });

  // ----- card pose in the scene (entrance + breathing fade out as the dive takes over, so it lands exactly)
  const settleIn = 1 - e;
  const cardScale = interpolate(cardIn, [0, 1], [0.72, 1]) * (1 - 0.035 * dip);
  const cardDy = interpolate(cardInSoft, [0, 1], [160, 0]) + float(frame, 7, 24) * settleIn;
  const cardRot = interpolate(cardInSoft, [0, 1], [-11, CARD.rot]) * settleIn;
  const cardO = Math.min(1, cardIn * 1.5);
  const chrome = 1 - interpolate(e, [0.0, 0.3], [0, 1], { ...clamp, easing: EASE.out }); // labels, bar
  const land = interpolate(e, [0.55, 1], [0, 1], { ...clamp, easing: EASE.inOut }); // radius, border, shadow

  // ----- clip A (speaker left of centre to make room for the card); clip B framed for the card
  const fa = frameOnFace(talent, { faceX: 410 });
  const fbFull = frameOnFace(talentB);
  const fbLocal: Framing = { scale: fbFull.scale / K, x: fbFull.x / K, y: fbFull.y / K };
  // A steps back when the card arrives, then sinks into a dark, defocused border while the card lands
  const sink = interpolate(e, [0.35, 0.95], [0, 1], { ...clamp, easing: EASE.inOut });
  const aFilter = `brightness(${(1 - 0.18 * cardInSoft) * (1 - 0.55 * sink)}) saturate(${1 - 0.3 * sink})${sink > 0.01 ? ` blur(${(18 * sink).toFixed(2)}px)` : ""}`;

  // zoom-blur centres in each source's texture space
  const uvA = glUv((F.x - fa.x) / (talent.w * fa.scale), (F.y - fa.y) / (talent.h * fa.scale));
  const rr = (-cardRot * Math.PI) / 180;
  const lx = F.x - P.x;
  const ly = F.y - (P.y + cardDy);
  const local = {
    x: (lx * Math.cos(rr) - ly * Math.sin(rr)) / cardScale + CARD.w / 2,
    y: (lx * Math.sin(rr) + ly * Math.cos(rr)) / cardScale + CARD_H / 2,
  };
  const uvB = glUv((local.x - fbLocal.x) / (talentB.w * fbLocal.scale), (local.y - fbLocal.y) / (talentB.h * fbLocal.scale));
  const blurOn = blurAmt > 0.6;
  const fxA = [zoomBlur({ amount: Math.max(0.01, blurAmt), center: uvA, samples: 28, disabled: !blurOn })];
  const fxB = [zoomBlur({ amount: Math.max(0.01, blurAmt * 0.8), center: uvB, samples: 28, disabled: !blurOn })];
  const chromeBlur = speed * 140;

  // B's progress bar (it is "playing")
  const progress = interpolate(frame, [0, diveStart], [0.18, 0.46], { ...clamp, easing: EASE.inOut });
  const ripple = interpolate(frame, [diveStart - 10, diveStart + 2], [0, 1], { ...clamp, easing: EASE.out });

  const cardBox: React.CSSProperties = {
    position: "absolute",
    left: P.x - CARD.w / 2,
    top: P.y - CARD_H / 2,
    width: CARD.w,
    height: CARD_H,
    transform: `translateY(${cardDy}px) rotate(${cardRot}deg) scale(${cardScale})`,
    transformOrigin: "50% 50%",
  };
  const radius = CARD.radius * (1 - land);

  return (
    <AbsoluteFill style={{ background: COLORS.ink, overflow: "hidden" }}>
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: WIDTH,
          height: HEIGHT,
          transformOrigin: "0 0",
          transform: `translate(${Q.x}px, ${Q.y}px) scale(${z}) translate(${-P.x}px, ${-P.y}px)`,
        }}
      >
        {/* clip A: gone once the card covers the frame */}
        {e < 0.999 ? (
          <>
            <TalentLayer talent={talent} layer="full" framing={fa} startAt={startAt} effects={fxA} style={{ filter: aFilter }} />
            {/* soft pool of shadow under the card */}
            <div
              style={{
                ...cardBox,
                transform: `translateY(${cardDy + 34}px) rotate(${cardRot}deg) scale(${cardScale * 1.02})`,
                borderRadius: radius,
                background: "rgba(4,6,20,0.55)",
                filter: "blur(34px)",
                opacity: cardO * (1 - land),
              }}
            />
            {/* tap ripple that cues the dive */}
            <div
              style={{
                ...cardBox,
                borderRadius: radius + 10 * ripple,
                border: `3px solid ${CARD.accent}`,
                opacity: (1 - ripple) * Math.min(1, ripple * 6) * 0.9,
                transform: `translateY(${cardDy}px) rotate(${cardRot}deg) scale(${cardScale * (1 + 0.16 * ripple)})`,
              }}
            />
          </>
        ) : null}

        {/* the card: clip B inside */}
        <div style={{ ...cardBox, opacity: cardO, borderRadius: radius, overflow: "hidden", background: COLORS.navy }}>
          <TalentLayer talent={talentB} layer="full" framing={fbLocal} startAt={startAtB} effects={fxB} />
          {/* label scrim + text */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              opacity: chrome,
              background: "linear-gradient(180deg, rgba(7,11,26,0.72) 0%, rgba(7,11,26,0) 34%, rgba(7,11,26,0) 72%, rgba(7,11,26,0.6) 100%)",
            }}
          />
          <div style={{ position: "absolute", left: 22, top: 22, right: 22, opacity: chrome, filter: chromeBlur > 0.3 ? `blur(${chromeBlur}px)` : undefined }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                fontFamily: FONT_UI,
                fontWeight: 700,
                fontSize: 17,
                letterSpacing: 2.4,
                color: COLORS.ink,
                background: CARD.accent,
                padding: "5px 11px",
                borderRadius: 999,
                opacity: chipIn,
                transform: `translateY(${(1 - chipIn) * 14}px) scale(${0.9 + 0.1 * chipIn})`,
                transformOrigin: "0 50%",
              }}
            >
              <svg width={11} height={12} viewBox="0 0 11 12">
                <path d="M1 1 L10 6 L1 11 Z" fill={COLORS.ink} />
              </svg>
              {kicker}
            </div>
            <div
              style={{
                marginTop: 12,
                fontFamily: FONT_DISPLAY,
                fontWeight: 800,
                fontSize: 36,
                lineHeight: 1.05,
                letterSpacing: -0.6,
                color: COLORS.white,
                textShadow: "0 2px 14px rgba(7,11,26,0.6)",
                opacity: titleIn,
                transform: `translateY(${(1 - titleIn) * 18}px)`,
              }}
            >
              {title}
            </div>
          </div>
          {/* progress bar */}
          <div style={{ position: "absolute", left: 22, right: 22, bottom: 24, height: 5, borderRadius: 3, background: "rgba(255,255,255,0.28)", opacity: chrome * titleIn }}>
            <div style={{ width: `${progress * 100}%`, height: "100%", borderRadius: 3, background: COLORS.white }} />
          </div>
        </div>

        {/* glass rim on top of the card */}
        <div
          style={{
            ...cardBox,
            borderRadius: radius,
            opacity: cardO * (1 - land),
            border: "2.5px solid rgba(255,255,255,0.55)",
            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.5), inset 0 0 0 1px rgba(255,255,255,0.08)",
            background: "linear-gradient(155deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0) 32%)",
            filter: chromeBlur > 0.3 ? `blur(${chromeBlur * 0.5}px)` : undefined,
          }}
        />
      </div>

      <Finish grade={COLORS.indigo} gradeOpacity={0.1} />
    </AbsoluteFill>
  );
};
