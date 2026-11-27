/**
 * UGC 17 kit: the 3D transparent glass dashboard, built from scratch (reads only from data.ts).
 * GlassStage (frozen, blurred last frame of the previous scene + purple glow) · GlassCard (frosted 3D card with entrance,
 * light sweep and zoom-through exit) · AppFrame (1440x900 desktop app: sidebar + top bar) · Cursor (eased Bezier moves,
 * click ripple) · camera keys (full view first, then zoom on the target) · Hl (purple glow outline) · Chips · Tracker.
 */
import { Video } from "@remotion/media";
import React from "react";
import { AbsoluteFill, Freeze, interpolate, spring, staticFile, useCurrentFrame } from "remotion";
import { HARBORVIEW, P, type Person, PILL, type Status } from "./data";
import edl from "./edl.json";

export const FPS = 30;
export const PURPLE = "#6D4AE8";
export const PURPLE_L = "#9A80FF";
export const INK = "#17142A";
export const MUTED = "#6B7280";
export const LINE = "#E6E3F0";
export const AMBER = "#FFB020";
export const GREEN = "#22C55E";
export const PANEL = "rgba(255,255,255,0.88)";
export const FONT = "Inter, sans-serif";
export const DW = 1920;
export const DH = 842;
export const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

export const easeIO = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
export const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
export const ramp = (f: number, a: number, b: number, ease = easeIO) => ease(Math.min(1, Math.max(0, (f - a) / Math.max(1, b - a))));
export const sp = (f: number, a: number, damping = 14, stiffness = 170) =>
  f < a ? 0 : spring({ frame: f - a, fps: FPS, config: { damping, stiffness, mass: 0.7 } });
export const life = (f: number, a: number, b: number, inD = 8, outD = 8) =>
  Math.min(interpolate(f, [a, a + inD], [0, 1], clamp), interpolate(f, [b - outD, b], [1, 0], clamp));

// ------------------------------------------------------------------------------------------- timing from edl.json
type Beat = { id: string; kind: string; f0: number; f1: number; words?: { w: string; f: number }[]; pieces?: { a: number; b: number; f0: number; f1: number; punch: boolean }[] };
export const BEATS = edl.beats as Beat[];
export const BEAT = Object.fromEntries(BEATS.map((b) => [b.id, b])) as Record<string, Beat>;
export const TOTAL = edl.total;
const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "");
/** Local frame (inside its beat) where `word` starts; `nth` picks a repeat ("case" twice etc.). */
export const W = (beat: string, word: string, nth = 0) => {
  const ws = BEAT[beat].words ?? [];
  const hits = ws.filter((w) => norm(w.w) === norm(word));
  if (!hits[nth]) throw new Error(`word "${word}" #${nth} not in ${beat}`);
  return hits[nth].f;
};
export const LEN = (beat: string) => BEAT[beat].f1 - BEAT[beat].f0;

// ------------------------------------------------------------------------------------------- stage + card
/** Background of every dashboard beat: the previous scene's last frame, frozen, blurred, darkened, slowly scaled. */
export const GlassStage: React.FC<{ scene: string; len: number }> = ({ scene, len }) => {
  const f = useCurrentFrame();
  const src = BEAT[scene];
  const last = src.pieces![src.pieces!.length - 1];
  const k = ramp(f, 0, 8, easeOut);
  const sc = 1.04 * (1 + 0.04 * (f / Math.max(1, len)));
  return (
    <AbsoluteFill style={{ background: "#0E0A22" }}>
      <AbsoluteFill style={{ transform: `scale(${sc})`, filter: `blur(${22 * k}px) brightness(${1 - 0.45 * k}) saturate(${1 - 0.2 * k})` }}>
        <Freeze frame={Math.round(last.b * FPS) - 1}>
          <Video src={staticFile(`ugc17/${scene}.mp4`)} muted style={{ width: 1080, height: 1920 }} />
        </Freeze>
      </AbsoluteFill>
      <AbsoluteFill style={{ background: `radial-gradient(ellipse 70% 45% at 50% 46%, rgba(109,74,232,${0.18 * k}) 0%, rgba(109,74,232,0) 70%)` }} />
      <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 50%, transparent 55%, rgba(6,3,18,${0.45 * k}) 100%)` }} />
    </AbsoluteFill>
  );
};

/** Light sweep crossing a box once between frames a and a+d. */
export const Sweep: React.FC<{ a: number; d?: number; o?: number }> = ({ a, d = 18, o = 0.55 }) => {
  const f = useCurrentFrame();
  if (f < a || f > a + d) return null;
  const x = -40 + ((f - a) / d) * 180;
  return <AbsoluteFill style={{ pointerEvents: "none", background: `linear-gradient(105deg, transparent ${x - 18}%, rgba(255,255,255,${o}) ${x}%, transparent ${x + 18}%)`, mixBlendMode: "screen" }} />;
};

export const CARD = { x: 50, y: 500, w: 980, pad: 14 };
export const CARD_SCALE = (CARD.w - CARD.pad * 2) / DW;
export const CARD_H = DH * CARD_SCALE + CARD.pad * 2;

/** The frosted 3D glass card. Entrance over 14 frames (spring, damping 18); exit = zoom-through (scale 1 -> 1.35,
 * blur 16 px) over the last 6 frames when `exit`. `tilt` adds extra rotation (deg) for in-beat moves. */
export const GlassCard: React.FC<{ len: number; enter?: boolean; exit?: boolean; y?: number; ry?: number; rx?: number; sc?: number; tx?: number; children: React.ReactNode }> = ({ len, enter = true, exit = true, y = CARD.y, ry = 0, rx = 0, sc = 1, tx = 0, children }) => {
  const f = useCurrentFrame();
  const e = enter ? spring({ frame: f, fps: FPS, durationInFrames: 14, config: { damping: 18, stiffness: 140, mass: 0.8 } }) : 1;
  const x = exit ? ramp(f, len - 6, len, (t) => t * t) : 0;
  const rotX = 14 + (3 - 14) * e + rx, rotY = -12 + (-2 + 12) * e + ry;
  const s = (0.86 + 0.14 * e) * (1 + 0.35 * x) * sc;
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: 1080, height: 1920, perspective: 1600 }}>
      <div style={{
        position: "absolute", left: CARD.x + tx, top: y, width: CARD.w, height: CARD_H, borderRadius: 28, opacity: Math.min(1, e * 1.4) * (1 - x),
        transform: `rotateX(${rotX}deg) rotateY(${rotY}deg) scale(${s})`, transformOrigin: "50% 50%", transformStyle: "preserve-3d",
        background: "rgba(255,255,255,0.16)", border: "1.5px solid rgba(255,255,255,0.45)",
        backdropFilter: "blur(28px) saturate(140%)", WebkitBackdropFilter: "blur(28px) saturate(140%)",
        boxShadow: "0 40px 80px rgba(8,4,24,0.45), 0 0 40px rgba(109,74,232,0.25), inset 0 1.5px 0 rgba(255,255,255,0.7), inset 0 -1px 0 rgba(255,255,255,0.15)",
        filter: x > 0 ? `blur(${16 * x}px)` : undefined, overflow: "hidden",
      }}>
        <div style={{ position: "absolute", left: CARD.pad, top: CARD.pad, width: CARD.w - CARD.pad * 2, height: CARD_H - CARD.pad * 2, borderRadius: 18, overflow: "hidden" }}>
          {children}
        </div>
        <AbsoluteFill style={{ borderRadius: 28, pointerEvents: "none", background: "linear-gradient(180deg, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0) 22%)" }} />
        <Sweep a={6} d={20} />
      </div>
    </div>
  );
};

// ------------------------------------------------------------------------------------------- camera
export type Cam = { f: number; x: number; y: number; z: number };
/** Camera over the 1440x900 design: keys hold (x, y) = design point at the viewport centre and zoom z. Eased between
 * keys; the visible window is clamped inside the page so no edge ever shows. Returns transform + speed for blur. */
export const camAt = (keys: Cam[], f: number) => {
  const at = (ff: number) => {
    if (ff <= keys[0].f) return keys[0];
    for (let i = 1; i < keys.length; i++) {
      if (ff <= keys[i].f) {
        const a = keys[i - 1], b = keys[i], t = easeIO((ff - a.f) / Math.max(1, b.f - a.f));
        return { f: ff, x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t, z: a.z + (b.z - a.z) * t };
      }
    }
    return keys[keys.length - 1];
  };
  const c = at(f), p = at(f - 1);
  const vw = DW / c.z, vh = DH / c.z;
  const x = Math.min(DW - vw / 2, Math.max(vw / 2, c.x)), y = Math.min(DH - vh / 2, Math.max(vh / 2, c.y));
  const speed = Math.hypot(c.x - p.x, c.y - p.y) * c.z + Math.abs(c.z - p.z) * 400;
  return { z: c.z, x, y, moving: speed > 1.5 };
};
/** Wraps a design-space page in the camera. */
export const Camera: React.FC<{ keys: Cam[]; children: React.ReactNode }> = ({ keys, children }) => {
  const f = useCurrentFrame();
  const c = camAt(keys, f);
  const k = CARD_SCALE;
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>{/* no motion blur: inside the 3D card a filter rasterises the UI soft */}
      <div style={{
        position: "absolute", left: 0, top: 0, width: DW, height: DH, transformOrigin: "0 0",
        transform: `scale(${k}) translate(${DW / 2}px, ${DH / 2}px) scale(${c.z}) translate(${-c.x}px, ${-c.y}px)`,
      }}>{children}</div>
    </div>
  );
};

// ------------------------------------------------------------------------------------------- cursor
export type CK = { f: number; x: number; y: number; click?: boolean };
/** macOS-style arrow, 1.4x, soft shadow. Moves along eased quadratic Bezier arcs taking 12 frames to reach each key;
 * on a click it dips to 0.85 and drops a purple ripple. Always visible during dashboard beats. */
export const Cursor: React.FC<{ keys: CK[]; zoom?: number }> = ({ keys, zoom = 1 }) => {
  const f = useCurrentFrame();
  let x = keys[0].x, y = keys[0].y;
  for (let i = 1; i < keys.length; i++) {
    const a = keys[i - 1], b = keys[i];
    const dur = Math.min(16, Math.max(10, b.f - a.f));
    const s = b.f - dur;
    if (f >= b.f) { x = b.x; y = b.y; continue; }
    if (f > s) {
      const t = easeIO((f - s) / dur);
      const mx = (a.x + b.x) / 2 - (b.y - a.y) * 0.18, my = (a.y + b.y) / 2 + (b.x - a.x) * 0.18;  // arc, never a straight line
      x = (1 - t) * (1 - t) * a.x + 2 * (1 - t) * t * mx + t * t * b.x;
      y = (1 - t) * (1 - t) * a.y + 2 * (1 - t) * t * my + t * t * b.y;
    }
    break;
  }
  const clicks = keys.filter((k) => k.click && f >= k.f && f < k.f + 14);
  const press = keys.some((k) => k.click && f >= k.f && f < k.f + 4);
  const s = (1.4 / Math.sqrt(zoom)) * (press ? 0.85 : 1);
  return (
    <>
      {clicks.map((c, i) => {
        const t = (f - c.f) / 14;
        return <div key={i} style={{ position: "absolute", left: c.x - 40 * t, top: c.y - 40 * t, width: 80 * t, height: 80 * t, borderRadius: 999, border: `3px solid ${PURPLE}`, background: "rgba(109,74,232,0.18)", opacity: 1 - t }} />;
      })}
      <svg width={24 * s} height={34 * s} viewBox="0 0 24 34" style={{ position: "absolute", left: x - 2 * s, top: y - 2 * s, filter: "drop-shadow(0 3px 5px rgba(0,0,0,0.35))", zIndex: 50 }}>
        <path d="M2 2 L2 26 L8 20.5 L12.5 31 L16.5 29.3 L12.2 19 L20 19 Z" fill="#111" stroke="#fff" strokeWidth={1.8} strokeLinejoin="round" />
      </svg>
    </>
  );
};

// ------------------------------------------------------------------------------------------- highlight
/** 2 px purple outline that glows (60 %) + 4 % lift while [a, b]. */
export const Hl: React.FC<{ a: number; b: number; x: number; y: number; w: number; h: number; r?: number }> = ({ a, b, x, y, w, h, r = 12 }) => {
  const f = useCurrentFrame();
  const o = life(f, a, b, 6, 6);
  if (o <= 0) return null;
  return <div style={{ position: "absolute", left: x - 4, top: y - 4, width: w + 8, height: h + 8, borderRadius: r, border: `2px solid ${PURPLE}`, boxShadow: `0 0 18px rgba(109,74,232,0.6), 0 0 0 4px rgba(109,74,232,${0.12 * o})`, opacity: o, transform: `scale(${1 + 0.04 * o})`, pointerEvents: "none", zIndex: 30 }} />;
};
/** Lift + glow for an element that is itself being talked about. */
export const lift = (f: number, a: number, b: number): React.CSSProperties => {
  const o = life(f, a, b, 6, 6);
  return o > 0 ? { transform: `scale(${1 + 0.04 * o})`, boxShadow: `0 0 0 2px ${PURPLE}, 0 0 22px rgba(109,74,232,${0.6 * o})`, zIndex: 20, position: "relative" } : {};
};

// ------------------------------------------------------------------------------------------- app primitives
export const Avatar: React.FC<{ p: { ini: string; col: string; inactive?: boolean }; s?: number; style?: React.CSSProperties }> = ({ p, s = 36, style }) => (
  <div style={{ width: s, height: s, borderRadius: s, background: p.col, color: "#fff", font: `700 ${s * 0.38}px ${FONT}`, display: "flex", alignItems: "center", justifyContent: "center", flex: "none", filter: p.inactive ? "grayscale(1)" : undefined, ...style }}>{p.ini}</div>
);
export const Pill: React.FC<{ s: Status; size?: number; style?: React.CSSProperties }> = ({ s, size = 15, style }) => (
  <span style={{ display: "inline-flex", alignItems: "center", height: size * 1.9, padding: `0 ${size * 0.75}px`, borderRadius: 999, background: PILL[s][0], color: PILL[s][1], font: `600 ${size}px ${FONT}`, whiteSpace: "nowrap", ...style }}>{s}</span>
);
export const Dot: React.FC<{ c?: string; s?: number }> = ({ c = GREEN, s = 10 }) => <span style={{ display: "inline-block", width: s, height: s, borderRadius: s, background: c, marginRight: 8, flex: "none" }} />;
export const Btn: React.FC<{ t: string; solid?: boolean; style?: React.CSSProperties }> = ({ t, solid, style }) => (
  <div style={{ height: 40, padding: "0 16px", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", whiteSpace: "nowrap", font: `600 15px ${FONT}`, background: solid ? PURPLE : "#fff", color: solid ? "#fff" : PURPLE, border: solid ? "none" : `1.5px solid ${PURPLE}`, ...style }}>{t}</div>
);
export const Panel: React.FC<{ x: number; y: number; w: number; h: number; style?: React.CSSProperties; children?: React.ReactNode }> = ({ x, y, w, h, style, children }) => (
  <div style={{ position: "absolute", left: x, top: y, width: w, height: h, background: PANEL, borderRadius: 14, border: `1px solid rgba(255,255,255,0.9)`, boxShadow: "0 6px 20px rgba(23,20,42,0.08)", overflow: "hidden", ...style }}>{children}</div>
);
const IC: Record<string, string> = {
  analytics: "M4 20V10M10 20V4M16 20v-7M22 20H2", users: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75",
  incoming: "M12 3v12M7 10l5 5 5-5M4 21h16", outgoing: "M12 21V9M7 14l5-5 5 5M4 3h16", check: "M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0zM8 12l3 3 5-6",
  bell: "M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.7 21a2 2 0 0 1-3.4 0", notes: "M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9zM14 3v6h6M8 13h8M8 17h5",
  code: "M16 18l6-6-6-6M8 6l-6 6 6 6", gear: "M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z",
  lock: "M5 11h14v10H5zM8 11V7a4 4 0 0 1 8 0v4", search: "M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16zM21 21l-4.3-4.3", file: "M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9zM14 3v6h6", chev: "M6 9l6 6 6-6",
  send: "M22 2L11 13M22 2l-7 20-4-9-9-4z", x: "M18 6L6 18M6 6l12 12", ok: "M20 6L9 17l-5-5", upload: "M12 16V4M7 9l5-5 5 5M4 20h16", plane: "M22 2L11 13M22 2l-7 20-4-9-9-4z",
  phone: "M7 2h10a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2zM11 18h2", globe: "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM2 12h20M12 2a15 15 0 0 1 0 20M12 2a15 15 0 0 0 0 20",
  pen: "M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z", clock: "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM12 6v6l4 2", msg: "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z",
};
export const Ico: React.FC<{ n: string; s?: number; c?: string; w?: number; style?: React.CSSProperties }> = ({ n, s = 18, c = INK, w = 2, style }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" style={{ flex: "none", ...style }}><path d={IC[n]} /></svg>
);

export type Nav = "Analytics" | "Incoming" | "Outgoing" | "Cases Completed" | "Notifications" | "Notes" | "Website Lead Forms" | "Settings";
const NAV: { t: Nav | "Referrals"; i: string; sub?: boolean }[] = [
  { t: "Analytics", i: "analytics" }, { t: "Referrals", i: "users" }, { t: "Incoming", i: "incoming", sub: true }, { t: "Outgoing", i: "outgoing", sub: true },
  { t: "Cases Completed", i: "check", sub: true }, { t: "Notifications", i: "bell" }, { t: "Notes", i: "notes" }, { t: "Website Lead Forms", i: "code" }, { t: "Settings", i: "gear" },
];
export const SIDE_W = 250;
export const TOP_H = 84;
/** Tooth Referral logo mark + word, drawn (no bitmap). */
export const TRLogo: React.FC<{ s?: number; light?: boolean }> = ({ s = 1, light }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 10 * s }}>
    <svg width={34 * s} height={34 * s} viewBox="0 0 34 34"><rect width="34" height="34" rx="9" fill={PURPLE} />
      <path d="M10 9c2.5-1.6 4.6-.6 7 .4 2.4-1 4.5-2 7-.4 2.6 1.7 2.3 5.6 1.3 8.6-.9 2.7-1.4 6.8-3.2 7.6-1.8.8-2.3-3.6-3.2-5.6-.4-.9-.8-1.3-1.9-1.3s-1.5.4-1.9 1.3c-.9 2-1.4 6.4-3.2 5.6-1.8-.8-2.3-4.9-3.2-7.6-1-3-1.3-6.9 1.3-8.6z" fill="#fff" /></svg>
    <span style={{ font: `800 ${22 * s}px ${FONT}`, color: light ? "#fff" : INK, letterSpacing: "-0.02em", whiteSpace: "nowrap" }}>Tooth<span style={{ color: light ? "#C9BBFF" : PURPLE }}>Referral</span></span>
  </div>
);

/** The desktop app at 1440x900: left sidebar and top bar; children are absolutely positioned in page coordinates. */
export const AppFrame: React.FC<{ active?: Nav; title: string; user?: Person; office?: string; badge?: number; badgePop?: number; children?: React.ReactNode }> = ({ active = "Incoming", title, user = P.rachel, office = HARBORVIEW, badge = 2, badgePop, children }) => {
  const f = useCurrentFrame();
  const pop = badgePop !== undefined ? sp(f, badgePop, 9, 240) : 1;
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: DW, height: DH, fontFamily: FONT, color: INK, background: "rgba(246,244,252,0.86)" }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: SIDE_W, height: DH, background: "rgba(216,232,248,0.9)", borderRight: "1px solid rgba(255,255,255,0.8)" }}>
        <div style={{ position: "absolute", left: 22, top: 22 }}><TRLogo s={0.92} /></div>
        <div style={{ position: "absolute", left: 22, right: 16, top: 74, padding: "9px 12px", borderRadius: 10, background: "rgba(255,255,255,0.7)", font: `700 14.5px ${FONT}`, color: "#0E2A5C", display: "flex", alignItems: "center", gap: 8, whiteSpace: "nowrap" }}>
          <Ico n="users" s={16} c="#0E2A5C" />{office}
        </div>
        {NAV.map((n, i) => {
          const on = n.t === active;
          const y = 140 + i * 50;
          return (
            <div key={n.t} style={{ position: "absolute", left: n.sub ? 34 : 14, right: 14, top: y, height: 42, borderRadius: 10, display: "flex", alignItems: "center", gap: 12, paddingLeft: 12, background: on ? "linear-gradient(90deg, #CDC6F6, rgba(216,232,248,0))" : undefined, font: `${on ? 700 : 500} 16px ${FONT}`, color: "#1B3A78", whiteSpace: "nowrap" }}>
              <Ico n={n.i} s={19} c="#1E3F86" />{n.t}
              {n.t === "Notifications" && badge > 0 && <span style={{ marginLeft: 4, minWidth: 22, height: 22, borderRadius: 22, background: AMBER, color: INK, font: `800 12.5px ${FONT}`, display: "inline-flex", alignItems: "center", justifyContent: "center", transform: `scale(${0.6 + 0.4 * pop})` }}>{badge}</span>}
            </div>
          );
        })}
      </div>
      <div style={{ position: "absolute", left: SIDE_W, right: 0, top: 0, height: TOP_H, background: "rgba(255,255,255,0.92)", borderBottom: `1px solid ${LINE}`, display: "flex", alignItems: "center", padding: "0 22px 0 28px", gap: 12 }}>
        <div style={{ font: `800 24px ${FONT}`, letterSpacing: "-0.02em", whiteSpace: "nowrap", flex: 1 }}>{title}</div>
        <Btn t="Provider's Day-Prep Station" style={{ height: 38, font: `600 13.5px ${FONT}` }} />
        <Btn t="Invite your Network" style={{ height: 38, font: `600 13.5px ${FONT}` }} />
        <Btn t="New Referral" solid style={{ height: 38, font: `600 13.5px ${FONT}` }} />
        <div style={{ display: "flex", alignItems: "center", gap: 9, marginLeft: 6, padding: "5px 12px 5px 6px", borderRadius: 999, background: "#F3F0FD" }}>
          <Avatar p={user} s={32} />
          <div style={{ lineHeight: 1.15 }}><div style={{ font: `700 13.5px ${FONT}`, whiteSpace: "nowrap" }}>{user.name}</div><div style={{ font: `500 11.5px ${FONT}`, color: MUTED, whiteSpace: "nowrap" }}>{user.role}</div></div>
        </div>
      </div>
      {children}
    </div>
  );
};

// ------------------------------------------------------------------------------------------- overlays (screen space)
/** Two stacked glass chips near y 1380: old way (amber ✕) then new way (green ✓). */
export const Chips: React.FC<{ a: number; b: number; old: string; neu: string }> = ({ a, b, old, neu }) => {
  const f = useCurrentFrame();
  const chip = (t: string, ok: boolean, at: number, y: number) => {
    const p = sp(f, at, 13, 180), o = Math.min(p, interpolate(f, [b - 6, b], [1, 0], clamp));
    const c = ok ? GREEN : AMBER;
    return (
      <div style={{ position: "absolute", left: 0, right: 0, top: y, display: "flex", justifyContent: "center", opacity: o, transform: `translateY(${(1 - p) * 26}px) scale(${0.9 + 0.1 * p})` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "12px 26px 12px 14px", borderRadius: 999, background: "rgba(20,14,44,0.55)", backdropFilter: "blur(18px)", border: `1.5px solid ${c}AA`, boxShadow: `0 10px 30px rgba(0,0,0,0.3), 0 0 22px ${c}44`, font: `800 36px ${FONT}`, color: "#fff", letterSpacing: "-0.01em", textDecoration: ok ? undefined : "line-through", textDecorationColor: `${AMBER}CC`, textDecorationThickness: 3 }}>
          <span style={{ width: 44, height: 44, borderRadius: 44, background: c, display: "flex", alignItems: "center", justifyContent: "center" }}><Ico n={ok ? "ok" : "x"} s={26} c={ok ? "#fff" : INK} w={3.2} /></span>{t}
        </div>
      </div>
    );
  };
  if (f < a - 1 || f > b) return null;
  return <>{chip(old, false, a, 1300)}{chip(neu, true, a + 7, 1386)}</>;
};

/** Five dots at top-left (x 60, y 120): current case fills purple, finished cases get a check. */
export const Tracker: React.FC<{ at: number; cur: number; done: number; popAt?: number }> = ({ cur, done, popAt }) => {
  const f = useCurrentFrame();
  return (
    <div style={{ position: "absolute", left: 60, top: 120, display: "flex", gap: 14 }}>
      {[1, 2, 3, 4, 5].map((n) => {
        const p = popAt !== undefined ? sp(f, popAt + (n - 1) * 3, 11, 220) : 1;
        const isDone = n <= done, isCur = n === cur && !isDone;
        return (
          <div key={n} style={{ width: 46, height: 46, borderRadius: 46, transform: `scale(${p})`, opacity: Math.min(1, p * 1.5), display: "flex", alignItems: "center", justifyContent: "center",
            background: isDone ? GREEN : isCur ? PURPLE : "rgba(20,14,44,0.45)", border: `2px solid ${isDone ? "#8FF0B5" : isCur ? PURPLE_L : "rgba(255,255,255,0.55)"}`, backdropFilter: "blur(10px)",
            boxShadow: isCur ? `0 0 22px ${PURPLE}` : "0 4px 14px rgba(0,0,0,0.3)", font: `800 21px ${FONT}`, color: "#fff" }}>
            {isDone ? <Ico n="ok" s={24} c="#fff" w={3.4} /> : n}
          </div>
        );
      })}
    </div>
  );
};
