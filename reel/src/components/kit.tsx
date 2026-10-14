import React from "react";
import { Easing, interpolate, spring } from "remotion";
import { COLORS, FONT_UI } from "../theme";

export const FPS = 30;
export const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
export const easeOut = Easing.bezier(0.22, 1, 0.36, 1);

/** 0→1 spring that starts at `at`. */
export const pop = (frame: number, at: number, cfg: { damping?: number; stiffness?: number; mass?: number } = {}) =>
  frame < at
    ? 0
    : spring({
        frame: frame - at,
        fps: FPS,
        config: { damping: cfg.damping ?? 13, stiffness: cfg.stiffness ?? 170, mass: cfg.mass ?? 0.7 },
      });

/** Linear-eased 0→1 over [at, at+dur]. */
export const ramp = (frame: number, at: number, dur: number, easing = easeOut) =>
  interpolate(frame, [at, at + dur], [0, 1], { ...clamp, easing });

/** Shared enter/exit envelope for a stage scene. */
export const sceneEnvelope = (frame: number, from: number, to: number, enter = 10, exit = 6) => {
  const i = ramp(frame, from, enter);
  const o = ramp(frame, to - exit, exit, Easing.in(Easing.cubic));
  return { in: i, out: o, opacity: Math.min(i * 1.4, 1) * (1 - o) };
};

export const glass = (accent?: string, strength = 1): React.CSSProperties => ({
  background: accent
    ? `linear-gradient(150deg, ${accent}${Math.round(0x33 * strength).toString(16).padStart(2, "0")} 0%, rgba(16,22,52,0.86) 70%)`
    : "linear-gradient(150deg, rgba(36,44,92,0.82) 0%, rgba(14,19,46,0.9) 100%)",
  border: `2px solid ${accent ? `${accent}aa` : "rgba(255,255,255,0.14)"}`,
  boxShadow: `0 14px 34px rgba(2,4,14,0.45)${accent ? `, 0 0 30px ${accent}2a` : ""}, inset 0 1px 0 rgba(255,255,255,0.12)`,
  borderRadius: 34,
});

export const Label: React.FC<{
  children: React.ReactNode;
  size?: number;
  weight?: number;
  color?: string;
  style?: React.CSSProperties;
}> = ({ children, size = 30, weight = 700, color = COLORS.text, style }) => (
  <div style={{ fontFamily: FONT_UI, fontSize: size, fontWeight: weight, color, letterSpacing: -0.3, lineHeight: 1.15, whiteSpace: "nowrap", ...style }}>
    {children}
  </div>
);

/** Rounded placeholder line, used for mock text in UI cards. */
export const Bar: React.FC<{ w: number; h?: number; color?: string; style?: React.CSSProperties }> = ({
  w,
  h = 14,
  color = "rgba(255,255,255,0.22)",
  style,
}) => <div style={{ width: w, height: h, borderRadius: h / 2, background: color, ...style }} />;

// ---------------------------------------------------------------------------
// Icons (stroke-based, 100x100 viewBox)
// ---------------------------------------------------------------------------
type IconProps = { size?: number; color?: string; stroke?: number; style?: React.CSSProperties };
const Svg: React.FC<IconProps & { children: React.ReactNode }> = ({ size = 80, color = COLORS.white, stroke = 7, style, children }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 100 100"
    fill="none"
    stroke={color}
    strokeWidth={stroke}
    strokeLinecap="round"
    strokeLinejoin="round"
    style={style}
  >
    {children}
  </svg>
);

export const PostIcon: React.FC<IconProps> = (p) => (
  <Svg {...p}>
    <rect x="18" y="12" width="64" height="76" rx="10" />
    <path d="M31 32h38M31 47h38M31 62h22" />
  </Svg>
);
export const ChatIcon: React.FC<IconProps> = (p) => (
  <Svg {...p}>
    <path d="M14 22a9 9 0 0 1 9-9h40a9 9 0 0 1 9 9v24a9 9 0 0 1-9 9H38l-14 12V55h-1a9 9 0 0 1-9-9z" />
    <path d="M80 38h0a8 8 0 0 1 8 8v20a8 8 0 0 1-8 8h-2v11L66 74H48" />
  </Svg>
);
export const PlaneIcon: React.FC<IconProps> = (p) => (
  <Svg {...p}>
    <path d="M88 13 12 45l30 11 11 31z" />
    <path d="M88 13 42 56" />
  </Svg>
);
export const InboxIcon: React.FC<IconProps> = (p) => (
  <Svg {...p}>
    <path d="M14 56 26 18h48l12 38v22a8 8 0 0 1-8 8H22a8 8 0 0 1-8-8z" />
    <path d="M14 56h22l6 11h16l6-11h22" />
  </Svg>
);
export const PersonIcon: React.FC<IconProps> = (p) => (
  <Svg {...p}>
    <circle cx="50" cy="36" r="16" />
    <path d="M20 86c4-17 16-26 30-26s26 9 30 26" />
  </Svg>
);
export const CheckPath: React.FC<{ progress: number; color?: string; stroke?: number; size?: number }> = ({
  progress,
  color = COLORS.ink,
  stroke = 13,
  size = 100,
}) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
    <path
      d="M24 53 42 70 77 32"
      stroke={color}
      strokeWidth={stroke}
      strokeLinecap="round"
      strokeLinejoin="round"
      pathLength={1}
      strokeDasharray={1}
      strokeDashoffset={1 - progress}
    />
  </svg>
);

/** Round check badge that pops at `at`. */
export const CheckBadge: React.FC<{ frame: number; at: number; size?: number; color?: string; style?: React.CSSProperties }> = ({
  frame,
  at,
  size = 64,
  color = COLORS.mint,
  style,
}) => {
  const s = pop(frame, at, { damping: 10, stiffness: 220 });
  const draw = ramp(frame, at + 2, 7);
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: color,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transform: `scale(${s})`,
        boxShadow: `0 8px 24px ${color}88`,
        ...style,
      }}
    >
      <CheckPath progress={draw} size={size * 0.8} />
    </div>
  );
};

/** Signal Reach mark: a source dot radiating three arcs. `p` animates the arcs 0→1. */
export const SignalMark: React.FC<{ size: number; p?: number; pulse?: number }> = ({ size, p = 1, pulse = 0 }) => {
  const arc = (r: number, i: number) => {
    const a = interpolate(p, [i * 0.22, i * 0.22 + 0.5], [0, 1], clamp);
    return (
      <path
        key={r}
        d={`M ${50 - r * 0.866} ${70 - r * 0.5} A ${r} ${r} 0 0 1 ${50 + r * 0.866} ${70 - r * 0.5}`}
        stroke="url(#sr-grad)"
        strokeWidth={8}
        strokeLinecap="round"
        fill="none"
        pathLength={1}
        strokeDasharray={1}
        strokeDashoffset={1 - a}
        opacity={0.35 + 0.65 * a}
      />
    );
  };
  return (
    <svg width={size} height={size} viewBox="0 0 100 100">
      <defs>
        <linearGradient id="sr-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={COLORS.cyan} />
          <stop offset="55%" stopColor={COLORS.blue} />
          <stop offset="100%" stopColor={COLORS.violet} />
        </linearGradient>
      </defs>
      {pulse > 0 && <circle cx="50" cy="70" r={10 + pulse * 40} stroke={COLORS.cyan} strokeWidth={3} fill="none" opacity={1 - pulse} />}
      {arc(18, 0)}
      {arc(32, 1)}
      {arc(46, 2)}
      <circle cx="50" cy="70" r={interpolate(p, [0, 0.2], [0, 9], clamp)} fill="url(#sr-grad)" />
    </svg>
  );
};
