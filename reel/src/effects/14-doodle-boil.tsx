import React, { useId } from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS, FONT_HAND, HEIGHT, WIDTH } from "../theme";
import {
  clamp,
  DEFAULT_TALENT,
  EASE,
  faceAt,
  Finish,
  frameOnFace,
  meanFace,
  rampAt,
  rand,
  SPRING,
  springAt,
  TalentLayer,
  useEnvelope,
  type EffectMeta,
  type Framing,
  type Talent,
} from "./shared";

export const meta: EffectMeta = {
  n: 14,
  slug: "doodle-boil",
  name: "Doodle boil",
  durationInFrames: 90,
  needs: ["face"],
  what: "Marker doodles draw on around the speaker (a loose circle round the head, an arrow with a handwritten note, an underline, sparkles) and keep wobbling like hand-drawn animation.",
  bestFor: "Pointing at the speaker, adding personality, a playful aside or a highlighted claim.",
  avoid: "Serious or sensitive lines, and shots where the face is small or off-centre.",
};

export type DoodleBoilProps = {
  talent?: Talent;
  /** seconds into the clip at the effect's first frame */
  startAt?: number;
  /** handwritten note at the arrow's tail (keep it short: 1-3 words) */
  label?: string;
  /** marker colour */
  color?: string;
  /** dark edge under every line so the marker reads over footage */
  outline?: string;
  /** frames between boil redraws (3 = 10 fps wobble at 30 fps) */
  boilEvery?: number;
  /** output y of the note's baseline (default: under the chin); set it to dodge burned-in captions */
  noteY?: number;
};

const INK = {
  outline: "rgba(7,11,26,0.62)",
  shadow: COLORS.ink,
};
const STROKE = 12;
const OUTLINE_W = STROKE + 10;
const LABEL_SIZE = 124;

type P = { x: number; y: number };

/** Face centre in output px, averaged over ±0.2 s so the doodles follow without the tracker's jitter. */
const useSmoothFaceCentre = (tl: Talent, f: Framing, startAt: number): P => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = startAt + frame / fps;
  let sx = 0;
  let sy = 0;
  const N = 9;
  for (let i = 0; i < N; i++) {
    const ti = Math.max(0, Math.min(tl.seconds - 0.01, t + ((i - (N - 1) / 2) / (N - 1)) * 0.4));
    const b = faceAt(tl, ti);
    sx += b.x + b.w / 2;
    sy += b.y + b.h / 2;
  }
  return { x: f.x + (sx / N) * f.scale, y: f.y + (sy / N) * f.scale };
};

/** Smooth path through points (Catmull-Rom as cubic Béziers). */
const smoothPath = (pts: P[], closed = false) => {
  const n = pts.length;
  const at = (i: number) => (closed ? pts[(i + n) % n] : pts[Math.max(0, Math.min(n - 1, i))]);
  let d = `M ${pts[0].x.toFixed(1)} ${pts[0].y.toFixed(1)}`;
  for (let i = 0; i < n - 1; i++) {
    const p0 = at(i - 1);
    const p1 = at(i);
    const p2 = at(i + 1);
    const p3 = at(i + 2);
    d += ` C ${(p1.x + (p2.x - p0.x) / 6).toFixed(1)} ${(p1.y + (p2.y - p0.y) / 6).toFixed(1)}, ${(p2.x - (p3.x - p1.x) / 6).toFixed(1)} ${(p2.y - (p3.y - p1.y) / 6).toFixed(1)}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
  }
  return d;
};

/** Deterministic boil jitter: a fresh offset per (seed, point, boil step). */
const jitter = (seed: number, i: number, boil: number, amp: number): P => ({
  x: (rand(seed * 131.7 + i * 7.31 + boil * 977.1) - 0.5) * 2 * amp,
  y: (rand(seed * 59.3 + i * 3.17 + boil * 613.9 + 0.5) - 0.5) * 2 * amp,
});
const add = (a: P, b: P): P => ({ x: a.x + b.x, y: a.y + b.y });

/** Shows the stroke between `from` and `to` (fractions of its length): draw on, then erase from the tail. */
const dash = (to: number, from = 0): React.SVGProps<SVGPathElement> => {
  const len = Math.max(0, to - from);
  return { pathLength: 1, strokeDasharray: `${len} 2`, strokeDashoffset: -from, opacity: len < 0.002 ? 0 : 1 };
};

let measureCtx: CanvasRenderingContext2D | null = null;
const textWidth = (text: string, size: number) => {
  measureCtx ??= document.createElement("canvas").getContext("2d");
  if (!measureCtx) return text.length * size * 0.42;
  measureCtx.font = `700 ${size}px "${FONT_HAND}"`;
  return measureCtx.measureText(text).width;
};

export const DoodleBoil: React.FC<DoodleBoilProps> = ({
  talent = DEFAULT_TALENT,
  startAt = 0,
  label = "listen up!",
  color = COLORS.amber,
  outline = INK.outline,
  boilEvery = 3,
  noteY,
}) => {
  const exitLen = 9;
  const { frame, fps, durationInFrames: D } = useEnvelope(exitLen);
  const k = Math.min(1, D / meta.durationInFrames);
  const T = (f: number) => Math.round(f * k);
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const boil = Math.floor(frame / Math.max(1, boilEvery));

  // --- camera: full clip, slow push-in (every frame obeys the bottom rule via placeTalent)
  const push = interpolate(frame, [0, D], [0, 1], { ...clamp, easing: EASE.inOut });
  // full clip: frameOnFace's fill keeps the frame covered and the unusable rows below it on every frame
  const cam = frameOnFace(talent, { scale: (talent.frameScale ?? 2.0) + push * 0.05, faceY: 850 });
  const c = useSmoothFaceCentre(talent, cam, startAt);
  const mf = meanFace(talent);
  const fw = mf.w * cam.scale;
  const fh = mf.h * cam.scale;

  // --- timeline: draw-on in, erase out over the last frames (faster than the entrance)
  // eraser for one stroke: starts `order` frames into the exit and always finishes by the last frame
  const out = (order: number, len = 6) => {
    const start = D - exitLen + order;
    return rampAt(frame, start, Math.max(1, Math.min(len, D - 1 - start)), EASE.in);
  };
  const circleIn = rampAt(frame, T(3), T(18), EASE.inOut);
  const shaftIn = rampAt(frame, T(19), T(10), EASE.inOut);
  const headIn = rampAt(frame, T(28), T(5), EASE.out);
  const labelIn = rampAt(frame, T(27), T(13), EASE.out);
  const underIn = rampAt(frame, T(38), T(8), EASE.inOut);

  // --- geometry (output px, relative to the face)
  const head = { x: c.x, y: c.y - fh * 0.15 };
  const rx = fw * 0.63;
  const ry = fh * 0.79;
  const onRing = (deg: number, s = 1): P => ({
    x: head.x + rx * s * Math.cos((deg * Math.PI) / 180),
    y: head.y + ry * s * Math.sin((deg * Math.PI) / 180),
  });

  // loose circle: 1.1 turns that spiral slightly outward so the ends never meet
  const ringPts: P[] = [];
  const RING_N = 36;
  for (let j = 0; j <= RING_N; j++) {
    const t = j / RING_N;
    const th = -2.15 + t * Math.PI * 2 * 1.1;
    const grow = 0.97 + 0.08 * t + 0.03 * Math.sin(3 * th + 1.3);
    ringPts.push(add({ x: head.x + rx * grow * Math.cos(th), y: head.y + ry * grow * Math.sin(th) }, jitter(1, j, boil, 4)));
  }

  // label (measured so long notes stay inside the side margins)
  const labelW = textWidth(label, LABEL_SIZE);
  const labelLeft = Math.max(72, Math.min(WIDTH - 72 - labelW, c.x + fw * 0.05));
  const baseline = noteY ?? Math.min(1640, c.y + fh * 1.07);
  const labelRot = -6 + (rand(boil * 3.7 + 11) - 0.5) * 1.6;
  const labelShift = jitter(9, 0, boil, 1.8);

  // arrow: from above the end of the note, arcing up and in to point at the face from the lower right
  const S = add({ x: labelLeft + labelW * 0.8, y: baseline - LABEL_SIZE * 0.92 }, jitter(2, 0, boil, 2.5));
  const E = add(onRing(40, 1.1), jitter(2, 1, boil, 2.5));
  const C1 = add({ x: Math.min(WIDTH - 70, S.x + 70), y: S.y - 120 }, jitter(2, 2, boil, 4));
  const C2 = add({ x: Math.min(WIDTH - 70, E.x + 130), y: E.y + 10 }, jitter(2, 3, boil, 4));
  const shaft = `M ${S.x} ${S.y} C ${C1.x} ${C1.y}, ${C2.x} ${C2.y}, ${E.x} ${E.y}`;
  const dirLen = Math.hypot(E.x - C2.x, E.y - C2.y) || 1;
  const back = { x: (C2.x - E.x) / dirLen, y: (C2.y - E.y) / dirLen };
  const wing = (deg: number, len: number): P => {
    const a = (deg * Math.PI) / 180;
    return { x: E.x + len * (back.x * Math.cos(a) - back.y * Math.sin(a)), y: E.y + len * (back.x * Math.sin(a) + back.y * Math.cos(a)) };
  };
  const w1 = add(wing(34, 50), jitter(3, 0, boil, 2.5));
  const w2 = add(wing(-30, 46), jitter(3, 1, boil, 2.5));
  const arrowHead = `M ${w1.x} ${w1.y} L ${E.x} ${E.y} L ${w2.x} ${w2.y}`;

  // underline: a quick swoosh and a return stroke
  const u0 = add({ x: labelLeft - 8, y: baseline + 24 }, jitter(4, 0, boil, 2.5));
  const u1 = add({ x: labelLeft + labelW * 0.55, y: baseline + 30 }, jitter(4, 1, boil, 2.5));
  const u2 = add({ x: labelLeft + labelW + 10, y: baseline + 16 }, jitter(4, 2, boil, 2.5));
  const u3 = add({ x: labelLeft + labelW * 0.3, y: baseline + 44 }, jitter(4, 3, boil, 2.5));
  const underline = smoothPath([u0, u1, u2, u3]);

  // sparkles just outside the circle
  const sparkles = [
    { at: onRing(-140, 1.2), r: 44, t: T(15), rot: 8, seed: 21 },
    { at: onRing(-28, 1.17), r: 34, t: T(23), rot: -10, seed: 22 },
    { at: onRing(172, 1.16), r: 26, t: T(43), rot: 14, seed: 23 },
  ].map((s) => ({ ...s, at: { x: Math.max(64 + s.r, Math.min(WIDTH - 64 - s.r, s.at.x)), y: s.at.y } }));

  const lines = (d: string, show: React.SVGProps<SVGPathElement>, key: string) => (
    <g key={key}>
      <path d={d} fill="none" stroke={outline} strokeWidth={OUTLINE_W} strokeLinecap="round" strokeLinejoin="round" {...show} />
      <path d={d} fill="none" stroke={color} strokeWidth={STROKE} strokeLinecap="round" strokeLinejoin="round" {...show} />
    </g>
  );

  const labelErase = out(2, 6);
  const clipX = labelLeft - 30 + labelErase * (labelW + 60);
  const clipW = Math.max(0, labelIn * (labelW + 60) - labelErase * (labelW + 60));

  return (
    <AbsoluteFill style={{ background: COLORS.ink, overflow: "hidden" }}>
      <TalentLayer talent={talent} layer="full" framing={cam} startAt={startAt} />

      <svg width={WIDTH} height={HEIGHT} viewBox={`0 0 ${WIDTH} ${HEIGHT}`} style={{ position: "absolute", inset: 0 }}>
        <defs>
          {/* the boil: a displacement field that changes seed every few frames */}
          <filter id={`boil-${uid}`} x="-5%" y="-5%" width="110%" height="110%">
            <feTurbulence type="fractalNoise" baseFrequency="0.018" numOctaves={2} seed={boil % 997} result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale={8} xChannelSelector="R" yChannelSelector="G" result="wobble" />
            <feDropShadow in="wobble" dx={0} dy={5} stdDeviation={5} floodColor={INK.shadow} floodOpacity={0.4} />
          </filter>
          <clipPath id={`write-${uid}`}>
            <rect x={clipX} y={baseline - LABEL_SIZE * 1.4} width={clipW} height={LABEL_SIZE * 2.2} />
          </clipPath>
        </defs>

        <g filter={`url(#boil-${uid})`}>
          {lines(smoothPath(ringPts), dash(circleIn, out(0)), "ring")}
          {lines(shaft, dash(shaftIn, out(1)), "shaft")}
          {lines(arrowHead, dash(headIn, out(1, 4)), "head")}

          {/* note: written on left to right, wiped off at the end */}
          <g
            clipPath={`url(#write-${uid})`}
            transform={`translate(${labelShift.x} ${labelShift.y}) rotate(${labelRot} ${labelLeft} ${baseline})`}
          >
            <text
              x={labelLeft}
              y={baseline}
              fontFamily={FONT_HAND}
              fontWeight={700}
              fontSize={LABEL_SIZE}
              fill={color}
              stroke={outline}
              strokeWidth={14}
              strokeLinejoin="round"
              paintOrder="stroke"
            >
              {label}
            </text>
          </g>
          <g transform={`rotate(${labelRot} ${labelLeft} ${baseline})`}>{lines(underline, dash(underIn, out(1, 6)), "under")}</g>

          {sparkles.map((s, i) => {
            const pop = springAt(frame, fps, s.t, SPRING.bouncy);
            const drawS = rampAt(frame, s.t, 7, EASE.out);
            const gone = out(2 + i, 4);
            const sc = Math.max(0, pop * (1 - gone)) * (1 + (rand(s.seed + boil * 5.1) - 0.5) * 0.08);
            const rot = s.rot + (rand(s.seed * 3 + boil * 2.3) - 0.5) * 10 + (1 - pop) * -40;
            const R = s.r;
            const q = R * 0.14;
            const star = `M 0 ${-R} Q ${q} ${-q} ${R} 0 Q ${q} ${q} 0 ${R} Q ${-q} ${q} ${-R} 0 Q ${-q} ${-q} 0 ${-R} Z`;
            return (
              <g key={i} transform={`translate(${s.at.x} ${s.at.y}) rotate(${rot}) scale(${sc})`}>
                {lines(star, dash(drawS), `s${i}`)}
              </g>
            );
          })}
        </g>
      </svg>

      <Finish />
    </AbsoluteFill>
  );
};
