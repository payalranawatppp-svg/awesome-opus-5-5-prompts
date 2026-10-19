/**
 * ToothReferral dashboard UI kit for animated UGC inserts (src/tr/scenes.tsx).
 * Rebuilt from screen captures of the real dashboard: same palette, type, radii and components,
 * so the animations read as the product without being screenshots.
 */
import React from "react";
import { AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { FONT_UI } from "../theme";

export const TR = {
  purple: "#774AEE",
  purpleBright: "#9B7BFF",
  purpleSoft: "#F3EEFE",
  purpleLine: "#E7E3F7",
  sidebar: "#D9E8F8",
  sidebarActive: "#C9D8F5",
  bg: "#F9F9FB",
  card: "#FFFFFF",
  border: "#E7E8EE",
  ink: "#1C1F33",
  text: "#3A3F55",
  muted: "#6B7085",
  faint: "#A3A8BA",
  green: "#1FCA7A",
  greenSoft: "#E3F8EE",
  amber: "#E89D15",
  amberSoft: "#FDF1DC",
  red: "#E5484D",
  routine: "#F7E1DF",
  stage1: "#1B1240",
  stage2: "#3B1E8F",
};

export const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/** 0→1 spring from frame `at`. */
export const useIn = (at: number, damping = 16, stiffness = 170) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return frame < at ? 0 : spring({ frame: frame - at, fps, config: { damping, stiffness, mass: 0.7 } });
};

/** Rise-in style: fade + lift + slight scale (2-3 properties, never a lone fade). */
export const rise = (p: number, dy = 26): React.CSSProperties => ({
  opacity: Math.min(1, p * 1.4),
  translate: `0px ${interpolate(p, [0, 1], [dy, 0])}px`,
  scale: String(interpolate(p, [0, 1], [0.97, 1])),
});

/** Scene exit over the last frames (faster than the entrance). */
export const useExit = (len = 9) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  return interpolate(frame, [durationInFrames - 1 - len, durationInFrames - 1], [0, 1], clamp);
};

/** Transparent mode: the stage drops its background so only the floating UI renders (for alpha overlays). */
export const TransparentContext = React.createContext(false);

/** Deep purple stage the white UI floats on (matches the UI inserts in the brand's UGC videos). */
export const Stage: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const frame = useCurrentFrame();
  const transparent = React.useContext(TransparentContext);
  if (transparent) {
    // no background; darker glass so the dark-stage elements still read over bright footage
    const glassVar = { "--tr-glass": "linear-gradient(150deg, rgba(27,18,64,0.62), rgba(27,18,64,0.42))" } as React.CSSProperties;
    return <AbsoluteFill style={{ fontFamily: FONT_UI, color: TR.ink, ...glassVar }}>{children}</AbsoluteFill>;
  }
  const d = Math.sin(frame / 50) * 40;
  return (
    <AbsoluteFill style={{ background: `linear-gradient(165deg, ${TR.stage1} 0%, #24145C 55%, ${TR.stage2} 100%)`, fontFamily: FONT_UI, color: TR.ink }}>
      <div style={{ position: "absolute", width: 1300, height: 1300, borderRadius: "50%", left: -420 + d, top: -380, background: `radial-gradient(circle, ${TR.purple}55, transparent 62%)`, filter: "blur(40px)" }} />
      <div style={{ position: "absolute", width: 1100, height: 1100, borderRadius: "50%", right: -380 - d, bottom: -300, background: "radial-gradient(circle, #4C7DFF33, transparent 64%)", filter: "blur(50px)" }} />
      {children}
    </AbsoluteFill>
  );
};

export const Card: React.FC<{ style?: React.CSSProperties; children: React.ReactNode }> = ({ style, children }) => (
  <div style={{ background: TR.card, border: `1.5px solid ${TR.border}`, borderRadius: 28, boxShadow: "0 30px 80px rgba(10,6,40,0.45), 0 2px 6px rgba(10,6,40,0.08)", ...style }}>{children}</div>
);

export const Badge: React.FC<{ children: React.ReactNode; color?: string; bg?: string; style?: React.CSSProperties }> = ({ children, color = TR.purple, bg = TR.purpleSoft, style }) => (
  <span style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 16px", borderRadius: 999, background: bg, color, fontWeight: 600, fontSize: 24, ...style }}>{children}</span>
);

export const Avatar: React.FC<{ initials: string; size?: number; bg?: string; color?: string }> = ({ initials, size = 64, bg = TR.purpleSoft, color = TR.purple }) => (
  <div style={{ width: size, height: size, borderRadius: "50%", background: bg, color, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: size * 0.36, flex: "none" }}>{initials}</div>
);

export const Button: React.FC<{ children: React.ReactNode; primary?: boolean; press?: number; style?: React.CSSProperties }> = ({ children, primary, press = 0, style }) => (
  <div
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 12,
      height: 72,
      padding: "0 30px",
      borderRadius: 14,
      fontWeight: 600,
      fontSize: 28,
      background: primary ? TR.purple : TR.card,
      color: primary ? "#fff" : TR.purple,
      border: primary ? "none" : `2px solid ${TR.purple}`,
      boxShadow: primary ? `0 12px 30px ${TR.purple}55` : "none",
      scale: String(1 - 0.06 * Math.sin(Math.PI * Math.min(1, Math.max(0, press)))),
      ...style,
    }}
  >
    {children}
  </div>
);

export const Logo: React.FC<{ width?: number; style?: React.CSSProperties }> = ({ width = 260, style }) => (
  <Img src={staticFile("tr/logo.png")} style={{ width, height: "auto", ...style }} />
);

/** Mouse pointer gliding along keyframes; `clicks` are frames where it presses. */
export const Cursor: React.FC<{ path: { f: number; x: number; y: number }[]; clicks?: number[] }> = ({ path, clicks = [] }) => {
  const frame = useCurrentFrame();
  const fs = path.map((p) => p.f);
  const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
  let x = path[0].x;
  let y = path[0].y;
  for (let i = 0; i < path.length - 1; i++) {
    if (frame >= fs[i] && frame <= fs[i + 1]) {
      const t = ease((frame - fs[i]) / Math.max(1, fs[i + 1] - fs[i]));
      x = path[i].x + (path[i + 1].x - path[i].x) * t;
      y = path[i].y + (path[i + 1].y - path[i].y) * t;
    } else if (frame > fs[i + 1]) {
      x = path[i + 1].x;
      y = path[i + 1].y;
    }
  }
  const click = clicks.map((c) => frame - c).find((d) => d >= 0 && d < 14);
  const ring = click === undefined ? 0 : click / 14;
  const press = click !== undefined && click < 5 ? 0.86 : 1;
  const appear = interpolate(frame, [fs[0], fs[0] + 6], [0, 1], clamp);
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: appear, zIndex: 50 }}>
      {click !== undefined && (
        <div style={{ position: "absolute", left: -36, top: -36, width: 72, height: 72, borderRadius: "50%", border: `4px solid ${TR.purple}`, opacity: 1 - ring, scale: String(0.4 + ring) }} />
      )}
      <svg width={54} height={60} viewBox="0 0 18 20" style={{ scale: String(press), transformOrigin: "0 0", filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.35))" }}>
        <path d="M1 1 L1 16 L5 12.5 L7.8 18.5 L10.4 17.3 L7.7 11.4 L13 11.4 Z" fill="#fff" stroke="#111" strokeWidth={1.2} strokeLinejoin="round" />
      </svg>
    </div>
  );
};

/** Notification toast that drops in from the top. */
export const Toast: React.FC<{ at: number; title: string; body: string; icon?: string }> = ({ at, title, body, icon = "🔔" }) => {
  const p = useIn(at, 15, 180);
  void icon;
  return (
    <div style={{ position: "absolute", left: 60, right: 60, top: 320, ...rise(p, -60) }}>
      <Card style={{ display: "flex", gap: 22, alignItems: "center", padding: "26px 30px", borderRadius: 26 }}>
        <div style={{ width: 64, height: 64, borderRadius: 18, background: TR.purple, display: "flex", alignItems: "center", justifyContent: "center", flex: "none" }}>
          <svg width={34} height={34} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 8a6 6 0 1 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
            <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
          </svg>
        </div>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontWeight: 700, fontSize: 30, color: TR.ink }}>{title}</div>
          <div style={{ fontSize: 25, color: TR.muted, marginTop: 4 }}>{body}</div>
        </div>
      </Card>
    </div>
  );
};

/** Small icons drawn as strokes (no emoji). */
export const Icon: React.FC<{ d: string; size?: number; color?: string }> = ({ d, size = 30, color = TR.purple }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);
export const ICON = {
  check: "M20 6 9 17l-5-5",
  send: "M22 2 11 13M22 2l-7 20-4-9-9-4 20-7z",
  inbox: "M22 12h-6l-2 3h-4l-2-3H2M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z",
  clip: "m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48",
  shield: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
  calendar: "M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z",
  chat: "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z",
  alert: "M12 9v4M12 17h.01M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z",
};
