import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { ChatIcon, InboxIcon, PersonIcon, PlaneIcon, PostIcon } from "../components/kit";
import { COLORS, FONT_UI, HEIGHT, WIDTH } from "../theme";
import {
  DEFAULT_TALENT,
  EASE,
  Finish,
  SPRING,
  TalentLayer,
  clamp,
  faceAt,
  float,
  meanFace,
  rand,
  rampAt,
  springAt,
  type EffectMeta,
  type Framing,
  type Talent,
} from "./shared";

export const meta: EffectMeta = {
  n: 1,
  slug: "orbit",
  name: "Orbit",
  durationInFrames: 90,
  needs: ["cutout", "face"],
  what: "Glass chips (icon + one word) ride a tilted ring around the speaker's head: behind the head on the far side, over the chest on the near side.",
  bestFor: "Naming several tools, features or channels in one breath (\"posts, replies, outreach and your inbox\").",
  avoid: "Lines where the viewer must read something long; one-idea moments; more than 8 items.",
};

// ---------------------------------------------------------------------------------------------------
// Content

export type OrbitIcon = "post" | "chat" | "plane" | "inbox" | "person" | "chart" | "bell" | "spark";
export type OrbitItem = { label: string; icon?: OrbitIcon };

const DEFAULT_ITEMS: OrbitItem[] = [
  { label: "Posts", icon: "post" },
  { label: "Replies", icon: "chat" },
  { label: "Outreach", icon: "plane" },
  { label: "Inbox", icon: "inbox" },
  { label: "Leads", icon: "person" },
  { label: "Insights", icon: "chart" },
];

export type OrbitProps = {
  talent?: Talent;
  /** seconds into the clip at the effect's first frame */
  startAt?: number;
  /** 3-8 chips; one short word each reads best */
  items?: OrbitItem[];
  /** hero colour: the chip passing the front lights up in it, and the glow behind the head */
  accent?: string;
  /** how much the room darkens behind the speaker, 0-1 */
  dim?: number;
  /** ring roll in degrees (positive: right side lower) */
  roll?: number;
  /** revolutions per second while holding */
  speed?: number;
  /** depth-of-field blur on the room behind the speaker, px */
  roomBlur?: number;
};

// Local icons (100x100, stroke-based, same language as kit.tsx)
type IconProps = { size: number; color: string };
const ChartIcon: React.FC<IconProps> = ({ size, color }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" stroke={color} strokeWidth={7} strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 84h68" />
    <path d="M28 70V54M46 70V40M64 70V48" />
    <path d="M22 38 42 24l16 10 22-16" />
  </svg>
);
const BellIcon: React.FC<IconProps> = ({ size, color }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" stroke={color} strokeWidth={7} strokeLinecap="round" strokeLinejoin="round">
    <path d="M26 68V46a24 24 0 0 1 48 0v22l8 8H18z" />
    <path d="M42 84a8 8 0 0 0 16 0" />
  </svg>
);
const SparkIcon: React.FC<IconProps> = ({ size, color }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" stroke={color} strokeWidth={7} strokeLinecap="round" strokeLinejoin="round">
    <path d="M50 12c3 20 10 30 38 38-28 8-35 18-38 38-3-20-10-30-38-38 28-8 35-18 38-38z" />
  </svg>
);

const Icon: React.FC<{ kind?: OrbitIcon; size: number; color: string }> = ({ kind = "spark", size, color }) => {
  const p = { size, color, stroke: 8 };
  switch (kind) {
    case "post":
      return <PostIcon {...p} />;
    case "chat":
      return <ChatIcon {...p} />;
    case "plane":
      return <PlaneIcon {...p} />;
    case "inbox":
      return <InboxIcon {...p} />;
    case "person":
      return <PersonIcon {...p} />;
    case "chart":
      return <ChartIcon size={size} color={color} />;
    case "bell":
      return <BellIcon size={size} color={color} />;
    default:
      return <SparkIcon size={size} color={color} />;
  }
};

// ---------------------------------------------------------------------------------------------------
// Geometry

/**
 * Full-clip framing that hides the unusable source rows: the clip covers the frame top to bottom and
 * source row `usableBottom` lands at or below the frame bottom (so the cutout's soft fade is off screen too).
 */
const fullClipFraming = (tl: Talent, scale = 1.97): Framing => {
  const s = Math.max(scale, (HEIGHT + 2) / tl.usableBottom);
  const mf = meanFace(tl);
  const cx = mf.x + mf.w / 2;
  const x = Math.min(0, Math.max(WIDTH - tl.w * s, WIDTH / 2 - cx * s));
  return { scale: s, x, y: HEIGHT + 2 - tl.usableBottom * s };
};

/** Face box (output px) averaged over ±0.2 s so the ring follows the head without tracker jitter. */
const smoothFace = (tl: Talent, f: Framing, t: number) => {
  const n = 5;
  let x = 0;
  let y = 0;
  let w = 0;
  let h = 0;
  for (let k = -n; k <= n; k++) {
    const b = faceAt(tl, Math.max(0, Math.min(tl.seconds - 0.01, t + k / tl.fps)));
    x += b.x;
    y += b.y;
    w += b.w;
    h += b.h;
  }
  const m = 2 * n + 1;
  return { cx: f.x + (x / m + w / m / 2) * f.scale, cy: f.y + (y / m + h / m / 2) * f.scale, w: (w / m) * f.scale, h: (h / m) * f.scale };
};

type ChipState = { x: number; y: number; depth: number; scale: number; opacity: number };

// ---------------------------------------------------------------------------------------------------

const ChipView: React.FC<{ item: OrbitItem; st: ChipState; blur: number; focus: number; accent: string; bob: number }> = ({
  item,
  st,
  blur,
  focus,
  accent,
  bob,
}) => {
  // far side: smaller, softer, darker; near side: crisp and a touch larger
  const farBlur = interpolate(st.depth, [-1, -0.2], [3.2, 0], { ...clamp, easing: EASE.inOut });
  const bright = interpolate(st.depth, [-1, 0], [0.62, 1], { ...clamp, easing: EASE.inOut });
  const b = Math.min(10, farBlur + blur);
  return (
    <div
      style={{
        position: "absolute",
        left: st.x,
        top: st.y + bob,
        transform: `translate(-50%, -50%) scale(${st.scale})`,
        opacity: st.opacity,
        filter: `blur(${b.toFixed(2)}px) brightness(${bright.toFixed(3)})`,
        willChange: "transform",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 13,
          height: 70,
          padding: "0 26px 0 12px",
          borderRadius: 35,
          background: "linear-gradient(150deg, rgba(34,42,92,0.86) 0%, rgba(10,14,36,0.9) 100%)",
          border: `2px solid rgba(255,255,255,${(0.2 + focus * 0.25).toFixed(3)})`,
          boxShadow: `0 18px 40px rgba(2,4,14,0.5), inset 0 1px 0 rgba(255,255,255,0.22)${focus > 0 ? `, 0 0 ${Math.round(40 * focus)}px ${accent}66` : ""}`,
          whiteSpace: "nowrap",
        }}
      >
        <div
          style={{
            width: 46,
            height: 46,
            borderRadius: 23,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: focus > 0 ? accent : "rgba(255,255,255,0.12)",
            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.25)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {focus > 0 && focus < 1 ? (
            <div style={{ position: "absolute", inset: 0, background: "rgba(255,255,255,0.12)", opacity: 1 - focus }} />
          ) : null}
          <div style={{ position: "relative", display: "flex" }}>
            <Icon kind={item.icon} size={26} color={COLORS.white} />
          </div>
        </div>
        <span style={{ fontFamily: FONT_UI, fontWeight: 700, fontSize: 29, letterSpacing: -0.3, color: COLORS.text }}>{item.label}</span>
      </div>
    </div>
  );
};

/** Half of the orbit ring as an SVG arc; `side` 1 = near (lower) half, -1 = far (upper) half. */
const RingArc: React.FC<{ cx: number; cy: number; rx: number; ry: number; roll: number; side: 1 | -1; opacity: number; draw: number }> = ({
  cx,
  cy,
  rx,
  ry,
  roll,
  side,
  opacity,
  draw,
}) => {
  if (rx < 1 || opacity <= 0) return null;
  // sweep from the right end (θ=0) to the left end (θ=π) through the lower (near) or upper (far) half
  const d = `M ${cx + rx} ${cy} A ${rx} ${ry} 0 0 ${side === 1 ? 1 : 0} ${cx - rx} ${cy}`;
  return (
    <svg width={WIDTH} height={HEIGHT} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
      <defs>
        <linearGradient id={`orbit-ring-${side}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={COLORS.white} stopOpacity={0.05} />
          <stop offset="50%" stopColor={COLORS.white} stopOpacity={side === 1 ? 0.75 : 0.35} />
          <stop offset="100%" stopColor={COLORS.white} stopOpacity={0.05} />
        </linearGradient>
      </defs>
      <g transform={`rotate(${roll} ${cx} ${cy})`} opacity={opacity}>
        <path
          d={d}
          fill="none"
          stroke={`url(#orbit-ring-${side})`}
          strokeWidth={side === 1 ? 3 : 2}
          strokeLinecap="round"
          pathLength={1}
          strokeDasharray={1}
          strokeDashoffset={1 - draw}
          style={{ filter: side === 1 ? undefined : "blur(1px)" }}
        />
      </g>
    </svg>
  );
};

/** Fine particles riding the ring at their own pace; split into far / near halves like the chips. */
const RingDust: React.FC<{ cx: number; cy: number; rx: number; ry: number; roll: number; side: 1 | -1; opacity: number; spin: number }> = ({
  cx,
  cy,
  rx,
  ry,
  roll,
  side,
  opacity,
  spin,
}) => {
  if (opacity <= 0) return null;
  const rr = (roll * Math.PI) / 180;
  const dots = Array.from({ length: 22 }, (_, k) => {
    const theta = (k * 2 * Math.PI) / 22 + rand(k + 3) * 0.25 - spin * (0.55 + rand(k + 40) * 0.2);
    const depth = Math.sin(theta);
    if ((side === 1) !== depth >= 0) return null;
    const rf = 1 + (rand(k + 9) - 0.5) * 0.12;
    const lx = rx * rf * Math.cos(theta);
    const ly = ry * rf * Math.sin(theta);
    const r = (1.6 + rand(k + 17) * 2.2) * interpolate(depth, [-1, 1], [0.7, 1.25], clamp);
    return (
      <circle
        key={k}
        cx={cx + lx * Math.cos(rr) - ly * Math.sin(rr)}
        cy={cy + lx * Math.sin(rr) + ly * Math.cos(rr)}
        r={r}
        fill={COLORS.white}
        opacity={(0.25 + rand(k + 23) * 0.5) * interpolate(depth, [-1, 1], [0.45, 1], clamp)}
      />
    );
  });
  return (
    <svg width={WIDTH} height={HEIGHT} style={{ position: "absolute", inset: 0, opacity, filter: side === 1 ? undefined : "blur(1.2px)" }}>
      {dots}
    </svg>
  );
};

export const Orbit: React.FC<OrbitProps> = ({
  talent = DEFAULT_TALENT,
  startAt = 0,
  items = DEFAULT_ITEMS,
  accent = COLORS.blue,
  dim = 0.62,
  roll = 8,
  speed = 0.16,
  roomBlur = 5,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const framing = fullClipFraming(talent);
  const list = items.slice(0, 8);
  const n = Math.max(1, list.length);

  const exitLen = Math.round(0.32 * fps);
  const exitStart = durationInFrames - exitLen;
  const rollRad = (roll * Math.PI) / 180;

  /** Every chip's screen state at any frame (pure, so velocity = state(f) - state(f-1)). */
  const stateAt = (f: number) => {
    const face = smoothFace(talent, framing, startAt + f / fps);
    // ring centred at mouth level: its ends pass beside the cheeks (narrower than the temples),
    // the far half rides behind the forehead, the near half over the collar
    const cx = face.cx;
    const cy = face.cy + face.h * 0.2;
    const rx = Math.min(face.w * 0.68, WIDTH / 2 - 125);
    const ry = face.h * 0.54;
    const grow = springAt(f, fps, 0, SPRING.smooth);
    const fling = interpolate(f, [exitStart, durationInFrames], [0, 1], { ...clamp, easing: EASE.in });
    // spin: steady drift plus a decelerating whip on entry and a flick on exit
    const spin =
      f * ((2 * Math.PI * speed) / fps) +
      interpolate(f, [0, Math.round(1.1 * fps)], [0, Math.PI * 0.55], { ...clamp, easing: EASE.expoOut }) +
      fling * Math.PI * 0.35;
    const chips: ChipState[] = list.map((_, i) => {
      const at = Math.round(0.1 * fps) + i * 4;
      const pop = springAt(f, fps, at, SPRING.snappy);
      const r = interpolate(pop, [0, 1], [0.72, 1]) * (1 + fling * 2.2);
      const theta = Math.PI / 2 + 0.5 + (i * 2 * Math.PI) / n - spin;
      const lx = rx * r * Math.cos(theta);
      const ly = ry * r * Math.sin(theta);
      const depth = Math.sin(theta);
      const sc = interpolate(depth, [-1, 0, 1], [0.64, 0.84, 1.06], { ...clamp, easing: EASE.inOut });
      return {
        x: cx + lx * Math.cos(rollRad) - ly * Math.sin(rollRad),
        y: cy + lx * Math.sin(rollRad) + ly * Math.cos(rollRad),
        depth,
        scale: sc * interpolate(pop, [0, 1], [0.4, 1]) * (1 + fling * 0.25),
        opacity: Math.min(1, pop * 1.4) * (1 - interpolate(fling, [0.35, 1], [0, 1], clamp)),
      };
    });
    return { spin, cx, cy, rx: rx * interpolate(grow, [0, 1], [0.3, 1]) * (1 + fling * 1.2), ry: ry * interpolate(grow, [0, 1], [0.3, 1]) * (1 + fling * 1.2), grow, fling, chips };
  };

  const now = stateAt(frame);
  const prev = stateAt(frame - 1);

  const enter = rampAt(frame, 0, Math.round(0.6 * fps), EASE.out);
  const sceneDim = enter * (1 - now.fling) * dim;
  const ringOpacity = now.grow * (1 - now.fling);
  const draw = rampAt(frame, 2, Math.round(0.9 * fps), EASE.inOut);

  const chipViews = list.map((item, i) => {
    const st = now.chips[i];
    const pv = prev.chips[i];
    const speedPx = Math.hypot(st.x - pv.x, st.y - pv.y);
    const blur = interpolate(speedPx, [22, 70], [0, 7], clamp);
    const focus = interpolate(st.depth, [0.86, 0.99], [0, 1], { ...clamp, easing: EASE.out });
    return { i, item, st, blur, focus, bob: float(frame, 4, 18, i * 1.7) };
  });
  const back = chipViews.filter((c) => c.st.depth < 0).sort((a, b) => a.st.depth - b.st.depth);
  const front = chipViews.filter((c) => c.st.depth >= 0).sort((a, b) => a.st.depth - b.st.depth);

  return (
    <AbsoluteFill style={{ background: COLORS.ink, overflow: "hidden" }}>
      {/* 1. the whole clip */}
      <TalentLayer talent={talent} layer="full" framing={framing} startAt={startAt} style={{ filter: `blur(${(roomBlur * sceneDim / Math.max(0.01, dim)).toFixed(2)}px)` }} />
      {/* 2. the room dims (the speaker is restored by the cutout above) */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 70% 55% at ${now.cx}px ${now.cy}px, rgba(7,11,26,0.35) 0%, rgba(7,11,26,0.92) 100%)`,
          opacity: sceneDim,
        }}
      />
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle 560px at ${now.cx}px ${now.cy - 60}px, ${accent}55 0%, ${accent}00 70%)`,
          mixBlendMode: "screen",
          opacity: sceneDim * 1.4,
        }}
      />
      {/* 3. far half of the ring and the chips behind the head */}
      <RingArc cx={now.cx} cy={now.cy} rx={now.rx} ry={now.ry} roll={roll} side={-1} opacity={ringOpacity} draw={draw} />
      <RingDust cx={now.cx} cy={now.cy} rx={now.rx} ry={now.ry} roll={roll} side={-1} opacity={ringOpacity} spin={now.spin} />
      {back.map((c) => (
        <ChipView key={c.i} item={c.item} st={c.st} blur={c.blur} focus={c.focus} accent={accent} bob={c.bob} />
      ))}
      {/* 4. the speaker */}
      <TalentLayer talent={talent} layer="cutout" framing={framing} startAt={startAt} />
      {/* 5. near half of the ring and the chips in front */}
      <RingArc cx={now.cx} cy={now.cy} rx={now.rx} ry={now.ry} roll={roll} side={1} opacity={ringOpacity} draw={draw} />
      <RingDust cx={now.cx} cy={now.cy} rx={now.rx} ry={now.ry} roll={roll} side={1} opacity={ringOpacity} spin={now.spin} />
      {front.map((c) => (
        <ChipView key={c.i} item={c.item} st={c.st} blur={c.blur} focus={c.focus} accent={accent} bob={c.bob} />
      ))}
      <Finish grade={accent} gradeOpacity={0.1} />
    </AbsoluteFill>
  );
};
