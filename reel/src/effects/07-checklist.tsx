import React from "react";
import { AbsoluteFill, interpolate, interpolateColors } from "remotion";
import { CheckPath } from "../components/kit";
import { COLORS, FONT_DISPLAY, FONT_MONO, FONT_UI, HEIGHT, WIDTH } from "../theme";
import {
  clamp,
  DEFAULT_TALENT,
  EASE,
  Finish,
  float,
  frameOnFace,
  rampAt,
  SPRING,
  springAt,
  TalentLayer,
  useEnvelope,
  type EffectMeta,
  type Framing,
  type Talent,
} from "./shared";

export const meta: EffectMeta = {
  n: 7,
  slug: "checklist",
  name: "Checklist",
  durationInFrames: 105,
  needs: ["plate"],
  what: "The camera eases the speaker down and a dark glass checklist drops in above the head; items land one by one, then tick off in turn.",
  bestFor: "Steps, requirements, \"what you get\" and recaps (3-5 short items).",
  avoid: "More than about five items, or items longer than ~22 characters.",
};

export type ChecklistProps = {
  talent?: Talent;
  /** seconds into the clip at the effect's first frame */
  startAt?: number;
  /** small caps line above the title */
  eyebrow?: string;
  title?: string;
  /** 3-5 short items; they tick in order */
  items?: string[];
  /** seconds into the effect when each item ticks (put them on the words); default: evenly spaced */
  tickAt?: number[];
  /** colour of the active tick (the frame's hero colour) */
  accent?: string;
};

const DEFAULT_ITEMS = ["Profile refreshed", "3 posts a week", "Replies within a day", "Weekly lead report"];

/** Alpha suffix for a 6-digit hex colour. */
const withAlpha = (hex: string, a: number) => `${hex}${Math.round(Math.max(0, Math.min(1, a)) * 255).toString(16).padStart(2, "0")}`;

const UI = {
  cardTop: "rgba(30,38,84,0.80)",
  cardBottom: "rgba(9,12,32,0.90)",
  cardBorder: "rgba(255,255,255,0.16)",
  cardShadow: "0 40px 90px rgba(3,5,16,0.55), 0 8px 24px rgba(3,5,16,0.35), inset 0 1.5px 0 rgba(255,255,255,0.22)",
  hairline: "rgba(255,255,255,0.10)",
  progress: "rgba(255,255,255,0.88)",
  boxIdle: "rgba(255,255,255,0.30)",
  boxDone: "rgba(255,255,255,0.92)",
  rowIdle: "rgba(255,255,255,0.035)",
  scrim: "rgba(7,11,26,",
};

// Layout (output px). The card owns the upper safe area; the speaker sits below it.
const CARD = { x: 84, top: 250, w: WIDTH - 168, padX: 40, padTop: 38, padBottom: 36, eyebrowH: 28, titleH: 62, ruleH: 44, row: 74, gap: 8 };
const HEADER_H = CARD.padTop + CARD.eyebrowH + 8 + CARD.titleH + CARD.ruleH;
/** Speaker placement: lower in the frame and a little wider, with room above the head for the card. */
const CAM_FROM = { scale: 1.74, faceY: 1150 };
const CAM_TO = { scale: 1.6, faceY: 1262 };

/**
 * Low framing: frameOnFace without `fill` (the clip's top edge is allowed inside the frame, it is feathered
 * into the blurred room behind), then clamped so the clip covers the frame width and its unusable rows
 * (burned-in captions) stay below the frame bottom: usableBottomY >= HEIGHT.
 */
const placeTalent = (tl: Talent, scale: number, faceY: number): Framing => {
  const f = frameOnFace(tl, { scale, faceY, fill: false });
  const x = Math.min(0, Math.max(WIDTH - tl.w * scale, f.x));
  const y = Math.max(HEIGHT - tl.usableBottom * scale, f.y);
  return { scale, x, y };
};

export const Checklist: React.FC<ChecklistProps> = ({
  talent = DEFAULT_TALENT,
  startAt = 0,
  eyebrow = "This week",
  title = "Growth checklist",
  items = DEFAULT_ITEMS,
  accent = COLORS.mint,
  tickAt: tickTimes,
}) => {
  const exitLen = 10;
  const { frame, fps, durationInFrames: D } = useEnvelope(exitLen);
  // exit completes on the last rendered frame (D - 1), so nothing lingers into the cut
  const exit = rampAt(frame, D - exitLen, exitLen - 1, EASE.in);
  // Compress the build on short Sequences; long ones just hold longer.
  const k = Math.min(1, D / meta.durationInFrames);
  const n = items.length;

  // --- camera: settle from a tighter framing down to the low framing (both ends obey the bottom rule)
  const settle = springAt(frame, fps, 0, { damping: 26, stiffness: 70, mass: 1 });
  const drift = interpolate(frame, [0, D], [0, 0.025], { ...clamp, easing: EASE.inOut });
  const cam = placeTalent(
    talent,
    interpolate(settle, [0, 1], [CAM_FROM.scale, CAM_TO.scale]) + drift,
    interpolate(settle, [0, 1], [CAM_FROM.faceY, CAM_TO.faceY]),
  );
  // The clip's top edge is inside the frame: feather the ceiling rows into the extended room behind.
  const feather = `linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,1) ${((130 / talent.h) * 100).toFixed(2)}%)`;
  const plate: Framing = { scale: 1.75, x: (WIDTH - talent.w * 1.75) / 2, y: -40 };

  // --- timeline (frames)
  const cardAt = Math.round(3 * k);
  const titleAt = Math.round(9 * k);
  const rowsAt = Math.round(14 * k);
  const rowStagger = Math.max(3, Math.round(5 * k));
  const tickFirst = Math.round(0.31 * D);
  const tickLast = Math.round(0.7 * D);
  const tickGap = n > 1 ? (tickLast - tickFirst) / (n - 1) : 0;
  const tickAt = (i: number) =>
    tickTimes && tickTimes[i] !== undefined ? Math.round(tickTimes[i] * fps) : Math.round(tickFirst + i * tickGap);

  // --- card envelope
  const cardIn = springAt(frame, fps, cardAt, SPRING.snappy);
  const cardO = Math.min(1, cardIn * 1.6) * (1 - exit);
  const cardY = interpolate(cardIn, [0, 1], [-70, 0]) - exit * 46 + float(frame, 4, 32);
  const cardS = interpolate(cardIn, [0, 1], [0.94, 1]) - exit * 0.035;
  const cardBlur = interpolate(cardIn, [0, 0.6], [10, 0], clamp) + exit * 6;
  // the card unrolls downward with the rows, so it never shows as an empty slab
  const rowIn = (i: number) => springAt(frame, fps, rowsAt + i * rowStagger, SPRING.snappy);
  const cardH =
    HEADER_H - 18 + CARD.padBottom + items.reduce((s, _, i) => s + Math.min(1, rowIn(i)) * (CARD.row + (i === 0 ? 18 : CARD.gap)), 0);

  const done = items.filter((_, i) => frame >= tickAt(i) + 4).length;
  const lastTick = done > 0 ? tickAt(done - 1) + 4 : -100;
  const countPop = 1 + 0.18 * Math.sin(Math.PI * rampAt(frame, lastTick, 8, EASE.out));
  const progress = items.reduce((s, _, i) => s + springAt(frame, fps, tickAt(i) + 2, SPRING.smooth), 0) / Math.max(1, n);

  const titleIn = springAt(frame, fps, titleAt, SPRING.snappy);
  const eyebrowIn = springAt(frame, fps, titleAt - 3, SPRING.snappy);
  const pillIn = springAt(frame, fps, titleAt + 4, SPRING.bouncy);
  const ruleIn = rampAt(frame, titleAt + 2, 16, EASE.expoOut);

  return (
    <AbsoluteFill style={{ background: COLORS.ink, overflow: "hidden" }}>
      {/* background: the room, extended upward (out of focus) */}
      <TalentLayer
        talent={talent}
        layer="plate"
        framing={plate}
        style={{ filter: "blur(34px) brightness(0.5) saturate(1.15)", transform: `scale(${1.06 + drift})` }}
      />
      {/* talent */}
      <TalentLayer
        talent={talent}
        layer="full"
        framing={cam}
        startAt={startAt}
        style={{ WebkitMaskImage: feather, maskImage: feather }}
      />
      {/* scrim: settles the upper area so the card reads */}
      <AbsoluteFill
        style={{
          background: `linear-gradient(180deg, ${UI.scrim}0.78) 0%, ${UI.scrim}0.5) 28%, ${UI.scrim}0) 50%)`,
          opacity: interpolate(settle, [0, 1], [0.4, 1]),
        }}
      />

      {/* the card */}
      <div
        style={{
          position: "absolute",
          left: CARD.x,
          top: CARD.top,
          width: CARD.w,
          height: cardH,
          padding: `${CARD.padTop}px ${CARD.padX}px 0`,
          boxSizing: "border-box",
          overflow: "hidden",
          borderRadius: 40,
          background: `linear-gradient(160deg, ${UI.cardTop}, ${UI.cardBottom})`,
          border: `1.5px solid ${UI.cardBorder}`,
          boxShadow: UI.cardShadow,
          backdropFilter: "blur(22px) saturate(1.4)",
          WebkitBackdropFilter: "blur(22px) saturate(1.4)",
          opacity: cardO,
          transform: `translateY(${cardY}px) scale(${cardS})`,
          transformOrigin: "50% 0%",
          filter: cardBlur > 0.2 ? `blur(${cardBlur}px)` : undefined,
        }}
      >
        {/* header */}
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
          <div>
            <div
              style={{
                fontFamily: FONT_MONO,
                fontWeight: 500,
                fontSize: 23,
                lineHeight: `${CARD.eyebrowH}px`,
                letterSpacing: 4.5,
                textTransform: "uppercase",
                color: COLORS.muted,
                opacity: eyebrowIn,
                transform: `translateY(${interpolate(eyebrowIn, [0, 1], [14, 0])}px)`,
              }}
            >
              {eyebrow}
            </div>
            <div
              style={{
                marginTop: 8,
                fontFamily: FONT_DISPLAY,
                fontWeight: 800,
                fontSize: 56,
                lineHeight: `${CARD.titleH}px`,
                letterSpacing: -1.4,
                color: COLORS.text,
                opacity: titleIn,
                transform: `translateY(${interpolate(titleIn, [0, 1], [22, 0])}px) scale(${interpolate(titleIn, [0, 1], [0.96, 1])})`,
                transformOrigin: "0% 100%",
              }}
            >
              {title}
            </div>
          </div>
          <div
            style={{
              marginBottom: 6,
              padding: "8px 18px",
              borderRadius: 999,
              border: `1.5px solid ${UI.cardBorder}`,
              background: UI.rowIdle,
              fontFamily: FONT_MONO,
              fontWeight: 700,
              fontSize: 28,
              color: COLORS.text,
              fontVariantNumeric: "tabular-nums",
              opacity: pillIn,
              transform: `scale(${interpolate(pillIn, [0, 1], [0.6, 1]) * countPop})`,
            }}
          >
            {done}
            <span style={{ color: COLORS.muted }}>/{n}</span>
          </div>
        </div>

        {/* progress rule */}
        <div style={{ position: "relative", height: 4, marginTop: 22, marginBottom: 18, borderRadius: 2 }}>
          <div
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: 2,
              background: UI.hairline,
              transform: `scaleX(${ruleIn})`,
              transformOrigin: "0% 50%",
            }}
          />
          <div
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              bottom: 0,
              width: `${progress * 100}%`,
              borderRadius: 2,
              background: UI.progress,
            }}
          />
        </div>

        {/* rows */}
        <div style={{ display: "flex", flexDirection: "column", gap: CARD.gap }}>
          {items.map((item, i) => (
            <Row
              key={i}
              text={item}
              frame={frame}
              fps={fps}
              enterAt={rowsAt + i * rowStagger}
              tick={tickAt(i)}
              next={i < n - 1 ? tickAt(i + 1) : D + 1000}
              accent={accent}
            />
          ))}
        </div>
      </div>

      <Finish grade={COLORS.blue} gradeOpacity={0.1} />
    </AbsoluteFill>
  );
};

/** One checklist row: lands, waits muted, then ticks (fill, drawn check, highlight sweep, text to full). */
const Row: React.FC<{
  text: string;
  frame: number;
  fps: number;
  enterAt: number;
  tick: number;
  /** frame the next row ticks: this row hands the highlight over and settles */
  next: number;
  accent: string;
}> = ({ text, frame, fps, enterAt, tick, next, accent }) => {
  const enter = springAt(frame, fps, enterAt, SPRING.snappy);
  const fill = springAt(frame, fps, tick, SPRING.bouncy);
  const draw = rampAt(frame, tick + 3, 8, EASE.out);
  const textOn = rampAt(frame, tick + 2, 10, EASE.out);
  const sweep = rampAt(frame, tick, 14, EASE.expoOut);
  const ring = rampAt(frame, tick + 2, 16, EASE.out);
  const bump = Math.sin(Math.PI * rampAt(frame, tick, 12, EASE.out));
  // after the next item ticks, this one calms down: highlight out, hero fill -> white
  const calm = rampAt(frame, next, 12, EASE.inOut);
  const active = fill > 0.001 ? 1 - calm : 0;

  const boxSize = 46;
  const ticked = frame >= tick;
  const boxBg = ticked ? interpolateColors(calm, [0, 1], [accent, UI.boxDone]) : "transparent";

  return (
    <div
      style={{
        position: "relative",
        height: CARD.row,
        display: "flex",
        alignItems: "center",
        gap: 24,
        padding: "0 20px",
        borderRadius: 20,
        background: UI.rowIdle,
        opacity: Math.min(1, enter * 1.5),
        transform: `translateX(${interpolate(enter, [0, 1], [-44, 0])}px) scale(${1 + bump * 0.025})`,
        transformOrigin: "0% 50%",
        overflow: "hidden",
      }}
    >
      {/* highlight sweep (hero tint), only while this row is the active one */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: 20,
          background: `linear-gradient(90deg, ${withAlpha(accent, 0.26)}, ${withAlpha(accent, 0.06)})`,
          border: `1.5px solid ${withAlpha(accent, 0.38)}`,
          transform: `scaleX(${sweep})`,
          transformOrigin: "0% 50%",
          opacity: active,
        }}
      />
      {/* checkbox */}
      <div style={{ position: "relative", width: boxSize, height: boxSize, flexShrink: 0 }}>
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "50%",
            border: `3px solid ${UI.boxIdle}`,
            transform: `scale(${interpolate(enter, [0, 1], [0.5, 1])})`,
            opacity: 1 - Math.min(1, fill * 1.4),
          }}
        />
        {/* pulse ring */}
        {ticked ? (
          <div
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: "50%",
              border: `3px solid ${accent}`,
              transform: `scale(${1 + ring * 0.95})`,
              opacity: (1 - ring) * 0.7,
            }}
          />
        ) : null}
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "50%",
            background: boxBg,
            transform: `scale(${fill})`,
            boxShadow: active > 0.01 ? `0 0 ${28 * active}px ${withAlpha(accent, 0.6 * active)}` : undefined,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <CheckPath progress={draw} size={boxSize * 0.82} stroke={14} color={COLORS.ink} />
        </div>
      </div>
      <div
        style={{
          position: "relative",
          fontFamily: FONT_UI,
          fontWeight: 600,
          fontSize: 37,
          letterSpacing: -0.4,
          whiteSpace: "nowrap",
          color: interpolateColors(textOn, [0, 1], [COLORS.muted, COLORS.text]),
          opacity: interpolate(textOn, [0, 1], [0.78, 1]),
        }}
      >
        {text}
      </div>
    </div>
  );
};
