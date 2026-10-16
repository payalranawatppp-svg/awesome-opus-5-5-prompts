import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { COLORS, FONT_HAND, HEIGHT, WIDTH } from "../theme";
import {
  DEFAULT_TALENT,
  EASE,
  Finish,
  MeshBackground,
  SPRING,
  TalentLayer,
  breathe,
  clamp,
  float,
  meanFace,
  rampAt,
  springAt,
  useEnvelope,
  type EffectMeta,
  type Framing,
  type Talent,
} from "./shared";

export const meta: EffectMeta = {
  n: 4,
  slug: "frame-break",
  name: "Frame break",
  durationInFrames: 90,
  needs: ["cutout", "plate", "face"],
  what: "The shot shrinks into a tilted photo print on a brand backdrop and the speaker's head pops out over the print's top edge, casting a shadow on it; it opens back to full frame at the end.",
  bestFor: "A hook or a big claim; turning a plain talking-head line into a pop-out moment.",
  avoid: "Shots where the head is cropped at the top, or a speaker who leans far out of the centre.",
};

export type FrameBreakProps = {
  talent?: Talent;
  /** seconds into the clip at the effect's first frame */
  startAt?: number;
  /** handwritten line on the print's bottom border ("" hides it) */
  caption?: string;
  /** resting tilt of the print, degrees */
  tilt?: number;
};

// Print stock: a local palette for the photo-print look.
const PRINT = {
  paper: "#F7F3EA",
  paperShade: "#E6DED0",
  ink: "#23222B",
  tape: "rgba(250,243,224,0.86)",
  tapeEdge: "rgba(236,226,204,0.86)",
  shadow: "rgba(3,5,16,0.55)",
};

const BORDER = 26;
const BORDER_BOTTOM = 140;
const INNER_W = 848;
const IN_SCALE = 1.3;

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** Full-frame framing led by the face, with the clip's unusable rows kept below the frame. */
const coverFraming = (tl: Talent, scale = 2.0): Framing => {
  const f = meanFace(tl);
  const cx = f.x + f.w / 2;
  const cy = f.y + f.h / 2;
  return {
    scale,
    x: Math.min(0, Math.max(WIDTH - tl.w * scale, WIDTH / 2 - cx * scale)),
    y: Math.min(0, Math.max(HEIGHT - tl.usableBottom * scale, HEIGHT * 0.42 - cy * scale)),
  };
};

/**
 * Where the print lands. Its inner top edge sits just under the chin (so the whole head breaks out
 * above it) and its inner bottom edge stops above the clip's unusable rows; the thick bottom border
 * of the print covers the rest. Head + print are centred vertically.
 */
const printLayout = (tl: Talent) => {
  const f = meanFace(tl);
  const cx = f.x + f.w / 2;
  const s = IN_SCALE;
  const hairRow = f.y - f.h * 0.36;
  const edgeRow = f.y + f.h * 1.1;
  const lastRow = tl.usableBottom - 8;
  const headH = (edgeRow - hairRow) * s;
  const innerH = (lastRow - edgeRow) * s;
  const total = headH + innerH + BORDER_BOTTOM;
  const top = Math.round(HEIGHT / 2 + 12 - total / 2 + headH);
  const left = (WIDTH - INNER_W) / 2;
  const right = left + INNER_W;
  const framing: Framing = {
    scale: s,
    x: Math.min(left, Math.max(right - tl.w * s, WIDTH / 2 - cx * s)),
    y: top - edgeRow * s,
  };
  return { left, right, top, bottom: Math.round(top + innerH), framing, pivotX: framing.x + cx * s };
};

export const FrameBreak: React.FC<FrameBreakProps> = ({
  talent = DEFAULT_TALENT,
  startAt = 0,
  caption = "the week it all clicked",
  tilt = -2.5,
}) => {
  const { frame, fps, durationInFrames } = useEnvelope();
  const full = coverFraming(talent);
  const L = printLayout(talent);

  // Timeline (seconds → frames). Exit keys off the end and is faster than the entrance.
  const tIn = Math.round(0.25 * fps);
  const inLen = Math.round(0.8 * fps);
  const land = tIn + inLen;
  const outLen = Math.round(0.34 * fps);
  const progressAt = (f: number) => {
    const enter = interpolate(f, [tIn, land], [0, 1], { ...clamp, easing: EASE.inOut });
    const exit = interpolate(f, [durationInFrames - outLen, durationInFrames - 1], [0, 1], { ...clamp, easing: EASE.inOut });
    return enter * (1 - exit);
  };
  const p = progressAt(frame);
  const speed = Math.abs(p - progressAt(frame - 1));
  const exiting = interpolate(frame, [durationInFrames - outLen, durationInFrames - outLen + 3], [0, 1], { ...clamp, easing: EASE.in });

  // The head pops out with an overshoot once the print has landed, then settles slightly proud.
  const pop = springAt(frame, fps, land - Math.round(0.12 * fps), SPRING.bouncy) * (1 - exiting);
  const popScale = 1 + 0.045 * pop;
  const shadow = Math.min(1, pop) * p;

  // Inner photo rect and footage framing, interpolated together so the clip's unusable rows stay hidden.
  const inner = {
    left: lerp(0, L.left, p),
    top: lerp(0, L.top, p),
    right: lerp(WIDTH, L.right, p),
    bottom: lerp(HEIGHT, L.bottom, p),
  };
  const fr: Framing = {
    scale: lerp(full.scale, L.framing.scale, p),
    x: lerp(full.x, L.framing.x, p),
    y: lerp(full.y, L.framing.y, p),
  };
  const b = BORDER * p;
  const bb = BORDER_BOTTOM * p;
  const pivotX = fr.x + (L.pivotX - L.framing.x) * (fr.scale / L.framing.scale);

  // Hold: the print breathes and drifts a touch.
  const hold = rampAt(frame, land, Math.round(0.6 * fps), EASE.inOut) * (1 - exiting);
  const rot = tilt * p + Math.sin(frame / 38) * 0.35 * hold;
  const drift = float(frame, 5, 34) * hold;
  const sc = 1 + (breathe(frame, 0.006, 40) - 1) * hold;
  const originY = (inner.top + inner.bottom) / 2;
  const groupTransform = `translateY(${drift}px) rotate(${rot}deg) scale(${sc})`;
  const blurPx = Math.min(3.5, speed * 32);

  // Cutout lives above the print's top edge, plus a feathered band just inside it (where it lines
  // up with the footage) so the neck crosses the border seamlessly.
  const band = 46;
  const E = inner.top;
  const clipPath = `polygon(-400px -600px, ${WIDTH + 400}px -600px, ${WIDTH + 400}px ${E}px, ${inner.right}px ${E}px, ${inner.right}px ${E + band}px, ${inner.left}px ${E + band}px, ${inner.left}px ${E}px, -400px ${E}px)`;
  const mask = `linear-gradient(180deg, #000 0px, #000 ${E + 12}px, rgba(0,0,0,0) ${E + band}px)`;

  // Details that arrive after the landing.
  const tape1 = springAt(frame, fps, land + 2, SPRING.snappy) * (1 - exiting);
  const tape2 = springAt(frame, fps, land + 6, SPRING.snappy) * (1 - exiting);
  const write = rampAt(frame, land + 8, Math.round(0.6 * fps), EASE.inOut);
  const captionOut = interpolate(frame, [durationInFrames - outLen - 2, durationInFrames - outLen + 4], [1, 0], { ...clamp, easing: EASE.in });
  const glare = rampAt(frame, land + 3, Math.round(0.75 * fps), EASE.inOut);
  const glareOn = Math.sin(Math.PI * glare);

  const paperBox = {
    left: inner.left - b,
    top: inner.top - b,
    width: inner.right - inner.left + 2 * b,
    height: inner.bottom - inner.top + b + bb,
  };

  return (
    <AbsoluteFill style={{ background: COLORS.ink, overflow: "hidden" }}>
      {/* 1. Background: brand mesh with the room's plate, defocused, and a light behind the head */}
      <MeshBackground a={COLORS.blue} b={COLORS.violet} />
      <TalentLayer
        talent={talent}
        layer="plate"
        framing={full}
        style={{ filter: "blur(34px) saturate(0.9) brightness(0.62)", opacity: 0.55, transform: "scale(1.08)" }}
      />
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 620px 560px at ${WIDTH / 2}px ${L.top - 250}px, ${COLORS.cyan}55, rgba(0,0,0,0) 70%)`,
          opacity: p,
        }}
      />
      <AbsoluteFill
        style={{
          backgroundImage: "radial-gradient(rgba(255,255,255,0.16) 1.5px, transparent 1.7px)",
          backgroundSize: "38px 38px",
          backgroundPosition: `${(frame * 0.4) % 38}px 0px`,
          opacity: 0.35 * p,
          WebkitMaskImage: "radial-gradient(ellipse 80% 60% at 50% 50%, #000 30%, rgba(0,0,0,0) 85%)",
          maskImage: "radial-gradient(ellipse 80% 60% at 50% 50%, #000 30%, rgba(0,0,0,0) 85%)",
        }}
      />

      {/* 2. The print and the head that breaks out of it (one tilted group, so they stay aligned) */}
      <AbsoluteFill style={{ filter: blurPx > 0.3 ? `blur(${blurPx}px)` : undefined }}>
        <AbsoluteFill style={{ transform: groupTransform, transformOrigin: `${WIDTH / 2}px ${originY}px` }}>
          {/* paper */}
          <div
            style={{
              position: "absolute",
              ...paperBox,
              borderRadius: 10 * p,
              background: `linear-gradient(170deg, ${PRINT.paper} 0%, ${PRINT.paper} 55%, ${PRINT.paperShade} 100%)`,
              boxShadow: `0 ${60 * p}px ${110 * p}px ${PRINT.shadow}, 0 ${14 * p}px ${28 * p}px rgba(3,5,16,${0.35 * p})`,
            }}
          />
          {/* photo */}
          <div
            style={{
              position: "absolute",
              left: inner.left,
              top: inner.top,
              width: inner.right - inner.left,
              height: inner.bottom - inner.top,
              overflow: "hidden",
              borderRadius: 4 * p,
            }}
          >
            <TalentLayer
              talent={talent}
              layer="full"
              framing={{ scale: fr.scale, x: fr.x - inner.left, y: fr.y - inner.top }}
              startAt={startAt}
            />
            {/* print gloss and a single glare pass after it lands */}
            <AbsoluteFill
              style={{
                background: "linear-gradient(160deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0) 40%, rgba(0,0,0,0.12) 100%)",
                opacity: p,
              }}
            />
            <AbsoluteFill
              style={{
                background: "linear-gradient(115deg, rgba(255,255,255,0) 38%, rgba(255,255,255,0.28) 50%, rgba(255,255,255,0) 62%)",
                backgroundSize: "300% 100%",
                backgroundPosition: `${lerp(110, -10, glare)}% 0%`,
                opacity: glareOn,
                mixBlendMode: "screen",
              }}
            />
            <AbsoluteFill style={{ boxShadow: `inset 0 0 0 1.5px rgba(0,0,0,${0.18 * p}), inset 0 8px 18px rgba(0,0,0,${0.18 * p})` }} />
          </div>

          {/* handwritten caption on the bottom border */}
          {caption ? (
            <div
              style={{
                position: "absolute",
                left: inner.left,
                width: inner.right - inner.left,
                top: inner.bottom + bb * 0.18,
                height: bb * 0.7,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: FONT_HAND,
                fontWeight: 700,
                fontSize: 66,
                color: PRINT.ink,
                transform: `rotate(-1.5deg) translateY(${(1 - write) * 8}px)`,
                clipPath: `inset(-20px ${(1 - write) * 100}% -20px 0)`,
                opacity: captionOut * Math.min(1, p * 1.2),
                whiteSpace: "nowrap",
              }}
            >
              {caption}
            </div>
          ) : null}

          {/* tape on the top corners */}
          {[
            { x: paperBox.left + 18, y: paperBox.top + 6, r: -36, s: tape1 },
            { x: paperBox.left + paperBox.width - 18, y: paperBox.top + 6, r: 34, s: tape2 },
          ].map((t, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                left: t.x - 82,
                top: t.y - 24,
                width: 164,
                height: 48,
                transform: `rotate(${t.r}deg) scale(${lerp(1.35, 1, t.s)})`,
                opacity: Math.min(1, t.s * 1.4),
                background: `linear-gradient(180deg, rgba(255,255,255,0.35), rgba(255,255,255,0) 45%), repeating-linear-gradient(90deg, ${PRINT.tape} 0px, ${PRINT.tape} 14px, ${PRINT.tapeEdge} 14px, ${PRINT.tapeEdge} 16px)`,
                boxShadow: "0 2px 6px rgba(0,0,0,0.18)",
                clipPath: "polygon(3% 0, 97% 4%, 100% 50%, 96% 100%, 2% 96%, 0 52%)",
              }}
            />
          ))}

          {/* the break: cutout above the print's top edge, popping forward with a cast shadow */}
          <AbsoluteFill style={{ clipPath, WebkitMaskImage: mask, maskImage: mask }}>
            <AbsoluteFill style={{ transform: `scale(${popScale})`, transformOrigin: `${pivotX}px ${E}px` }}>
              <TalentLayer
                talent={talent}
                layer="cutout"
                framing={fr}
                startAt={startAt}
                style={{
                  filter: `drop-shadow(${8 * shadow}px ${24 * shadow}px ${20 * shadow}px rgba(3,5,16,${0.62 * shadow}))`,
                }}
              />
            </AbsoluteFill>
          </AbsoluteFill>
        </AbsoluteFill>
      </AbsoluteFill>

      {/* 3. Grade + grain/vignette */}
      <Finish grade={COLORS.blue} gradeOpacity={0.1 * p} />
    </AbsoluteFill>
  );
};
