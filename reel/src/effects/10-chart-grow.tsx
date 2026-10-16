import React from "react";
import { AbsoluteFill, interpolate, interpolateColors } from "remotion";
import { COLORS, FONT_DISPLAY, FONT_MONO, HEIGHT, WIDTH } from "../theme";
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
  n: 10,
  slug: "chart-grow",
  name: "Chart grow",
  durationInFrames: 90,
  needs: ["plate"],
  what: "A glass chart card tilts up above the speaker: bars grow in turn, a trend line draws across them, the last bar lights up and a counter runs to the result.",
  bestFor: "Results, growth claims and before/after numbers.",
  avoid: "Numbers that cannot be backed up, or more than about 8 data points.",
};

export type ChartGrowProps = {
  talent?: Talent;
  /** seconds into the clip at the effect's first frame */
  startAt?: number;
  /** small caps line above the title */
  eyebrow?: string;
  title?: string;
  /** one value per bar, oldest first (any unit; the bars scale to the largest) */
  values?: number[];
  /** x-axis labels, same length as values */
  labels?: string[];
  /** headline change in percent; defaults to last vs first value */
  change?: number;
  /** small line under the counter */
  changeLabel?: string;
  /** colour of the highlighted last bar (the frame's hero colour) */
  accent?: string;
};

const DEFAULT_VALUES = [1250, 1720, 2240, 2980, 3910, 5150];
const DEFAULT_LABELS = ["W1", "W2", "W3", "W4", "W5", "W6"];

/** Alpha suffix for a 6-digit hex colour. */
const withAlpha = (hex: string, a: number) => `${hex}${Math.round(Math.max(0, Math.min(1, a)) * 255).toString(16).padStart(2, "0")}`;

/** 5150 -> "5.2k" */
const compact = (v: number) => (v >= 1e6 ? `${(v / 1e6).toFixed(1)}m` : v >= 1e3 ? `${(v / 1e3).toFixed(1)}k` : `${Math.round(v)}`);

const UI = {
  cardTop: "rgba(30,38,84,0.80)",
  cardBottom: "rgba(9,12,32,0.90)",
  cardBorder: "rgba(255,255,255,0.16)",
  cardShadow: "0 40px 90px rgba(3,5,16,0.55), 0 8px 24px rgba(3,5,16,0.35), inset 0 1.5px 0 rgba(255,255,255,0.22)",
  grid: "rgba(255,255,255,0.10)",
  baseline: "rgba(255,255,255,0.22)",
  barTop: "rgba(255,255,255,0.30)",
  barBottom: "rgba(255,255,255,0.07)",
  barEdge: "rgba(255,255,255,0.45)",
  line: "rgba(255,255,255,0.95)",
  lineShadow: "rgba(4,6,20,0.55)",
  tip: COLORS.white,
  scrim: "rgba(7,11,26,",
};

// Layout (output px). The card owns the upper safe area; the speaker sits below it.
const CARD = { x: 84, top: 250, w: WIDTH - 168, padX: 44, padTop: 38, padBottom: 30 };
const PLOT = { w: CARD.w - CARD.padX * 2, h: 306, top: 24, labelH: 44, barW: 78 };
const CAM_FROM = { scale: 1.6, faceY: 1322 };
const CAM_TO = { scale: 1.64, faceY: 1292 };

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

/** Smooth path through points (Catmull-Rom as cubic Béziers). */
const smoothPath = (pts: { x: number; y: number }[]) => {
  if (pts.length < 2) return "";
  let d = `M ${pts[0].x} ${pts[0].y}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[Math.min(pts.length - 1, i + 2)];
    const t = 0.9 / 6;
    d += ` C ${p1.x + (p2.x - p0.x) * t} ${p1.y + (p2.y - p0.y) * t}, ${p2.x - (p3.x - p1.x) * t} ${p2.y - (p3.y - p1.y) * t}, ${p2.x} ${p2.y}`;
  }
  return d;
};

export const ChartGrow: React.FC<ChartGrowProps> = ({
  talent = DEFAULT_TALENT,
  startAt = 0,
  eyebrow = "Last 6 weeks",
  title = "Profile views",
  values = DEFAULT_VALUES,
  labels = DEFAULT_LABELS,
  change,
  changeLabel = "vs. week 1",
  accent = COLORS.cyan,
}) => {
  const exitLen = 9;
  const { frame, fps, durationInFrames: D } = useEnvelope(exitLen);
  // exit completes on the last rendered frame (D - 1), so nothing lingers into the cut
  const exit = rampAt(frame, D - exitLen, exitLen - 1, EASE.in);
  const k = Math.min(1, D / meta.durationInFrames);
  const n = values.length;
  const target = change ?? Math.round(((values[n - 1] - values[0]) / Math.max(1e-6, values[0])) * 100);

  // --- camera: a slow push that lifts the speaker a touch (both ends obey the bottom rule)
  const push = interpolate(frame, [0, D], [0, 1], { ...clamp, easing: EASE.inOut });
  const cam = placeTalent(
    talent,
    interpolate(push, [0, 1], [CAM_FROM.scale, CAM_TO.scale]),
    interpolate(push, [0, 1], [CAM_FROM.faceY, CAM_TO.faceY]),
  );
  const feather = `linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,1) ${((130 / talent.h) * 100).toFixed(2)}%)`;
  const plate: Framing = { scale: 1.75, x: (WIDTH - talent.w * 1.75) / 2, y: -40 };

  // --- timeline (frames)
  const T = (f: number) => Math.round(f * k);
  const cardAt = T(2);
  const headAt = T(7);
  const gridAt = T(10);
  const barsAt = T(14);
  const barStagger = Math.max(2, T(4));
  const lineAt = T(30);
  const lineLen = Math.max(12, T(28));
  const countAt = T(18);
  const countLen = lineAt + lineLen - countAt;

  // --- card envelope: tilts up from the speaker like a panel standing up
  const cardIn = springAt(frame, fps, cardAt, { damping: 16, stiffness: 120, mass: 0.9 });
  const cardO = Math.min(1, cardIn * 1.7) * (1 - exit);
  const tilt = interpolate(cardIn, [0, 1], [32, 0]) - exit * 14;
  const cardY = interpolate(cardIn, [0, 1], [90, 0]) - exit * 40 + float(frame, 4, 34);
  const cardS = interpolate(cardIn, [0, 1], [0.93, 1]) - exit * 0.03;
  const cardBlur = interpolate(cardIn, [0, 0.6], [10, 0], clamp) + exit * 6;

  // --- geometry
  // headroom above the tallest bar for the value tip
  const max = Math.max(...values) * 1.45;
  const slot = PLOT.w / n;
  const barX = (i: number) => slot * i + (slot - PLOT.barW) / 2;
  const barH = (i: number) => (values[i] / max) * PLOT.h;
  const pts = values.map((_, i) => ({ x: barX(i) + PLOT.barW / 2, y: PLOT.h - barH(i) }));
  // node i is reached at this fraction of the line (chord-length approximation of arc length)
  const seg = pts.slice(1).map((p, i) => Math.hypot(p.x - pts[i].x, p.y - pts[i].y));
  const total = seg.reduce((a, b) => a + b, 0) || 1;
  const reachAt = pts.map((_, i) => seg.slice(0, i).reduce((a, b) => a + b, 0) / total);

  const draw = rampAt(frame, lineAt, lineLen, EASE.inOut);
  const nodeAt = (i: number) => lineAt + reachAt[i] * lineLen;
  const lastLit = springAt(frame, fps, nodeAt(n - 1) - 2, SPRING.snappy);
  const tipIn = springAt(frame, fps, nodeAt(n - 1) + 2, SPRING.bouncy);
  // counts with the data: eases in with the bars, lands as the line reaches the last point
  const count = interpolate(frame, [countAt, countAt + countLen], [0, target], { ...clamp, easing: EASE.inOut });

  const eyebrowIn = springAt(frame, fps, headAt - 2, SPRING.snappy);
  const titleIn = springAt(frame, fps, headAt, SPRING.snappy);
  const counterIn = springAt(frame, fps, headAt + 4, SPRING.snappy);
  const gridIn = (i: number) => rampAt(frame, gridAt + i * 3, 16, EASE.expoOut);
  const countDone = frame >= countAt + countLen;
  const countPop = 1 + 0.08 * Math.sin(Math.PI * rampAt(frame, countAt + countLen - 2, 10, EASE.out));

  return (
    <AbsoluteFill style={{ background: COLORS.ink, overflow: "hidden" }}>
      {/* background: the room, extended upward (out of focus) */}
      <TalentLayer
        talent={talent}
        layer="plate"
        framing={plate}
        style={{ filter: "blur(34px) brightness(0.5) saturate(1.15)", transform: `scale(${1.06 + push * 0.03})` }}
      />
      <TalentLayer talent={talent} layer="full" framing={cam} startAt={startAt} style={{ WebkitMaskImage: feather, maskImage: feather }} />
      <AbsoluteFill style={{ background: `linear-gradient(180deg, ${UI.scrim}0.8) 0%, ${UI.scrim}0.5) 30%, ${UI.scrim}0) 52%)` }} />

      <div style={{ position: "absolute", inset: 0, perspective: 1500, perspectiveOrigin: `50% ${CARD.top + 500}px` }}>
        <div
          style={{
            position: "absolute",
            left: CARD.x,
            top: CARD.top,
            width: CARD.w,
            padding: `${CARD.padTop}px ${CARD.padX}px ${CARD.padBottom}px`,
            boxSizing: "border-box",
            borderRadius: 40,
            background: `linear-gradient(160deg, ${UI.cardTop}, ${UI.cardBottom})`,
            border: `1.5px solid ${UI.cardBorder}`,
            boxShadow: UI.cardShadow,
            backdropFilter: "blur(22px) saturate(1.4)",
            WebkitBackdropFilter: "blur(22px) saturate(1.4)",
            opacity: cardO,
            transform: `translateY(${cardY}px) rotateX(${tilt}deg) scale(${cardS})`,
            transformOrigin: "50% 100%",
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
                  lineHeight: "28px",
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
                  lineHeight: "62px",
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
                textAlign: "right",
                opacity: counterIn,
                transform: `translateY(${interpolate(counterIn, [0, 1], [20, 0])}px) scale(${interpolate(counterIn, [0, 1], [0.9, 1]) * countPop})`,
                transformOrigin: "100% 100%",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-end",
                  gap: 10,
                  fontFamily: FONT_DISPLAY,
                  fontWeight: 800,
                  fontSize: 80,
                  lineHeight: "84px",
                  letterSpacing: -2,
                  color: COLORS.text,
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                <TrendArrow size={50} p={rampAt(frame, headAt + 6, 14, EASE.out)} />
                <span>
                  {count >= 0 ? "+" : "−"}
                  {Math.abs(Math.round(count))}
                  <span style={{ fontSize: 52 }}>%</span>
                </span>
              </div>
              <div
                style={{
                  marginTop: 2,
                  fontFamily: FONT_MONO,
                  fontWeight: 500,
                  fontSize: 21,
                  letterSpacing: 2,
                  textTransform: "uppercase",
                  color: interpolateColors(countDone ? 1 : 0, [0, 1], [COLORS.muted, COLORS.text]),
                }}
              >
                {changeLabel}
              </div>
            </div>
          </div>

          {/* plot */}
          <div style={{ position: "relative", width: PLOT.w, height: PLOT.h + PLOT.labelH, marginTop: PLOT.top }}>
            {/* grid */}
            {[0.25, 0.5, 0.75].map((g, i) => (
              <div
                key={g}
                style={{
                  position: "absolute",
                  left: 0,
                  right: 0,
                  top: PLOT.h * (1 - g),
                  height: 0,
                  borderTop: `2px dashed ${UI.grid}`,
                  transform: `scaleX(${gridIn(2 - i)})`,
                  transformOrigin: "0% 50%",
                }}
              />
            ))}
            <div
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                top: PLOT.h,
                height: 2,
                background: UI.baseline,
                transform: `scaleX(${gridIn(0)})`,
                transformOrigin: "0% 50%",
              }}
            />

            {/* bars */}
            {values.map((_, i) => {
              const at = barsAt + i * barStagger;
              const g = springAt(frame, fps, at, SPRING.snappy);
              const isLast = i === n - 1;
              const lit = isLast ? lastLit : 0;
              const h = Math.max(0, barH(i) * g);
              return (
                <React.Fragment key={i}>
                  <div
                    style={{
                      position: "absolute",
                      left: barX(i),
                      top: PLOT.h - h,
                      width: PLOT.barW,
                      height: h,
                      borderRadius: "16px 16px 6px 6px",
                      background: `linear-gradient(180deg, ${UI.barTop}, ${UI.barBottom})`,
                      boxShadow: `inset 0 2px 0 ${UI.barEdge}`,
                      opacity: Math.min(1, g * 3),
                    }}
                  />
                  {isLast ? (
                    <div
                      style={{
                        position: "absolute",
                        left: barX(i),
                        top: PLOT.h - h,
                        width: PLOT.barW,
                        height: h,
                        borderRadius: "16px 16px 6px 6px",
                        background: `linear-gradient(180deg, ${accent}, ${withAlpha(accent, 0.45)})`,
                        boxShadow: `0 0 ${50 * lit}px ${withAlpha(accent, 0.55 * lit)}, inset 0 2px 0 rgba(255,255,255,0.6)`,
                        opacity: Math.min(1, lit),
                      }}
                    />
                  ) : null}
                  <div
                    style={{
                      position: "absolute",
                      left: barX(i) - 10,
                      width: PLOT.barW + 20,
                      top: PLOT.h + 12,
                      textAlign: "center",
                      fontFamily: FONT_MONO,
                      fontWeight: isLast ? 700 : 500,
                      fontSize: 23,
                      letterSpacing: 1,
                      color: isLast ? interpolateColors(lit, [0, 1], [COLORS.muted, COLORS.text]) : COLORS.muted,
                      opacity: Math.min(1, g * 2),
                      transform: `translateY(${interpolate(g, [0, 1], [10, 0], clamp)}px)`,
                    }}
                  >
                    {labels[i] ?? ""}
                  </div>
                </React.Fragment>
              );
            })}

            {/* trend line + nodes */}
            <svg width={PLOT.w} height={PLOT.h} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
              <path
                d={smoothPath(pts)}
                fill="none"
                stroke={UI.lineShadow}
                strokeWidth={14}
                strokeLinecap="round"
                strokeLinejoin="round"
                pathLength={1}
                strokeDasharray={1}
                strokeDashoffset={1 - draw}
                opacity={0.6}
              />
              <path
                d={smoothPath(pts)}
                fill="none"
                stroke={UI.line}
                strokeWidth={6}
                strokeLinecap="round"
                strokeLinejoin="round"
                pathLength={1}
                strokeDasharray={1}
                strokeDashoffset={1 - draw}
              />
              {pts.map((p, i) => {
                const pop = springAt(frame, fps, nodeAt(i), SPRING.bouncy);
                const isLast = i === n - 1;
                const ring = rampAt(frame, nodeAt(i), 18, EASE.out);
                return (
                  <g key={i} transform={`translate(${p.x} ${p.y})`}>
                    {isLast && frame >= nodeAt(i) ? (
                      <circle r={12 + ring * 26} fill="none" stroke={accent} strokeWidth={3} opacity={(1 - ring) * 0.8} />
                    ) : null}
                    <circle r={(isLast ? 12 : 8) * pop} fill={isLast ? accent : COLORS.navy} stroke={UI.line} strokeWidth={4 * Math.min(1, pop)} />
                  </g>
                );
              })}
            </svg>

            {/* value tip on the last point */}
            <div
              style={{
                position: "absolute",
                left: pts[n - 1].x,
                top: pts[n - 1].y - 24,
                transform: `translate(-50%, -100%) translateY(${interpolate(tipIn, [0, 1], [16, 0])}px) scale(${tipIn})`,
                transformOrigin: "50% 100%",
                opacity: Math.min(1, tipIn * 2),
              }}
            >
              <div
                style={{
                  padding: "8px 18px",
                  borderRadius: 14,
                  background: UI.tip,
                  color: COLORS.ink,
                  fontFamily: FONT_MONO,
                  fontWeight: 700,
                  fontSize: 26,
                  whiteSpace: "nowrap",
                  boxShadow: "0 10px 24px rgba(3,5,16,0.4)",
                }}
              >
                {compact(values[n - 1])}
              </div>
              <div
                style={{
                  margin: "-1px auto 0",
                  width: 0,
                  height: 0,
                  borderLeft: "10px solid transparent",
                  borderRight: "10px solid transparent",
                  borderTop: `10px solid ${UI.tip}`,
                }}
              />
            </div>
          </div>
        </div>
      </div>

      <Finish grade={COLORS.blue} gradeOpacity={0.1} />
    </AbsoluteFill>
  );
};

/** Up-and-right trend arrow that draws on (p 0→1). */
const TrendArrow: React.FC<{ size: number; p: number }> = ({ size, p }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" style={{ marginBottom: 4 }}>
    <path
      d="M12 74 40 46 56 60 86 28"
      stroke={COLORS.text}
      strokeWidth={11}
      strokeLinecap="round"
      strokeLinejoin="round"
      pathLength={1}
      strokeDasharray={1}
      strokeDashoffset={1 - p}
    />
    <path
      d="M62 26h25v25"
      stroke={COLORS.text}
      strokeWidth={11}
      strokeLinecap="round"
      strokeLinejoin="round"
      opacity={interpolate(p, [0.7, 1], [0, 1], { ...clamp, easing: EASE.out })}
    />
  </svg>
);
