/**
 * Shared building blocks for the effects library (src/effects/NN-*.tsx).
 *
 * Every effect works on a "talent": one talking-head clip in three layers, made by scripts/matte.py:
 *   full    the original clip
 *   cutout  the speaker alone, with an alpha channel (VP9 WebM)
 *   plate   the background with the speaker removed (still image)
 * A Framing places the 720x1280 source in the 1080x1920 frame; useFace() follows the speaker's face so
 * graphics can sit around (or behind) the head.
 */
import React from "react";
import { Video } from "@remotion/media";
import {
  AbsoluteFill,
  Easing,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  type SpringConfig,
} from "remotion";
import { GrainVignette } from "../components/Backdrop";
import faces from "../data/faces.json";
import { useFontsReady } from "../fonts";
import { COLORS, FONT_DISPLAY, HEIGHT, WIDTH } from "../theme";

// ---------------------------------------------------------------------------------------------------
// Motion vocabulary (remotion-motion-graphics rules: never linear, always clamped, exits faster)

export const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
export const EASE = {
  out: Easing.bezier(0.22, 1, 0.36, 1),
  in: Easing.bezier(0.55, 0, 1, 0.45),
  inOut: Easing.bezier(0.65, 0, 0.35, 1),
  /** fast start, long settle: camera moves */
  expoOut: Easing.bezier(0.16, 1, 0.3, 1),
};
export const SPRING: Record<"smooth" | "snappy" | "bouncy" | "heavy", Partial<SpringConfig>> = {
  smooth: { damping: 200 },
  snappy: { damping: 14, stiffness: 170, mass: 0.7 },
  bouncy: { damping: 9, stiffness: 150, mass: 0.8 },
  heavy: { damping: 22, stiffness: 90, mass: 1.2 },
};

/** 0→1 spring starting at frame `at` (0 before it). */
export const springAt = (frame: number, fps: number, at: number, config: Partial<SpringConfig> = SPRING.snappy) =>
  frame < at ? 0 : spring({ frame: frame - at, fps, config });

/** Eased 0→1 over [at, at + dur]. */
export const rampAt = (frame: number, at: number, dur: number, easing = EASE.out) =>
  interpolate(frame, [at, at + dur], [0, 1], { ...clamp, easing });

/**
 * Enter/exit envelope for the current Sequence (useVideoConfig() inside a Sequence reports the
 * Sequence's own duration). `enter` springs 0→1; `exit` eases 0→1 over the last `exitFrames`.
 */
export const useEnvelope = (exitFrames?: number) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const exitLen = exitFrames ?? Math.round(0.33 * fps);
  const enter = springAt(frame, fps, 0, SPRING.snappy);
  // the last rendered frame is durationInFrames - 1: the exit must be complete there
  const exit = interpolate(frame, [durationInFrames - 1 - exitLen, durationInFrames - 1], [0, 1], { ...clamp, easing: EASE.in });
  return { frame, fps, durationInFrames, enter, exit };
};

/** Idle breathing for anything on screen > 2 s. */
export const breathe = (frame: number, amount = 0.012, period = 22, phase = 0) =>
  1 + Math.sin(frame / period + phase) * amount;
export const float = (frame: number, px = 4, period = 30, phase = 0) => Math.sin(frame / period + phase) * px;

/** Deterministic pseudo-random in [0, 1) (no Math.random in renders). */
export const rand = (seed: number) => {
  const x = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
  return x - Math.floor(x);
};

// ---------------------------------------------------------------------------------------------------
// Talent: the clip, its cutout and its clean plate

export type TalentId = "01-hook" | "02-solution" | "03-outcome" | "04-cta" | "05-talk" | "tr2-cut" | "cb-cut" | "pd-cut" | "rr-cut";
export type Talent = {
  id: TalentId;
  /** public/ paths. `video` is a VP9 WebM copy of the clip: the render browser cannot decode H.264, and
   *  an H.264 source silently falls back to a decoder that ignores `effects`. */
  video: string;
  cutout: string;
  plate: string;
  /** source size and frame rate */
  w: number;
  h: number;
  fps: number;
  /** clip length in seconds */
  seconds: number;
  /** Source rows at and below this are unusable (burned-in captions, generator watermark).
   *  The cutout already fades out between 980 and 1040; keep the full clip's rows below this off screen. */
  usableBottom: number;
  /** Default framing scale for frameOnFace (2.0 when absent). 1.5 shows a 720x1280 clip whole, e.g. an
   *  already-edited video whose burned-in captions must stay in frame. */
  frameScale?: number;
};

type FaceTrack = { fps: number; w: number; h: number; faces: number[][] };
const TRACKS = faces as Record<TalentId, FaceTrack>;

/**
 * A talent from the standard file layout (public/footage/<id>.webm, public/cutouts/<id>.webm and
 * <id>-plate.jpg, a face track under <id> in src/data/faces.json). Pass the clip's real size, fps and
 * length; `usableBottom` defaults to the full height (no burned-in text to hide).
 */
export const makeTalent = (
  id: TalentId,
  spec: { w: number; h: number; fps: number; seconds: number; usableBottom?: number; frameScale?: number },
): Talent => ({
  id,
  video: `footage/${id}.webm`,
  cutout: `cutouts/${id}.webm`,
  plate: `cutouts/${id}-plate.jpg`,
  ...spec,
  usableBottom: spec.usableBottom ?? spec.h,
});

/** The four reel clips: 720x1280, 24 fps, 8 s, burned-in captions and a watermark from row 980 down. */
const REEL_CLIP = { w: 720, h: 1280, fps: 24, seconds: 8, usableBottom: 980 };
export const TALENT: Record<TalentId, Talent> = {
  "01-hook": makeTalent("01-hook", REEL_CLIP),
  "02-solution": makeTalent("02-solution", REEL_CLIP),
  "03-outcome": makeTalent("03-outcome", REEL_CLIP),
  "04-cta": makeTalent("04-cta", REEL_CLIP),
  /** ToothReferral UGC video: already edited (burned-in captions, UI inserts), so effects keep it whole. */
  "05-talk": makeTalent("05-talk", { w: 720, h: 1280, fps: 24, seconds: 43.7, frameScale: 1.5 }),
  /** ToothReferral UGC #2: eight takes joined by scripts/build_cut.py (clean studio wall, no burned-in text). */
  "tr2-cut": makeTalent("tr2-cut", { w: 720, h: 1280, fps: 24, seconds: 43.04, frameScale: 1.5 }),
  /** "The Chocolate Box Delusion" podcast take, tightened by scripts/cut_by_words.py (30 fps). */
  "cb-cut": makeTalent("cb-cut", { w: 720, h: 1280, fps: 30, seconds: 127.43, frameScale: 1.5 }),
  /** "The website PDF dead end": eight takes colour-matched (scripts/match_grade.py), cut, morph-cut, then three
   * /effects baked in (src/data/pd-effects.json), so the full layer plays footage/pd-fx.webm. */
  "pd-cut": { ...makeTalent("pd-cut", { w: 720, h: 1280, fps: 30, seconds: 48.13, frameScale: 1.5 }), video: "footage/pd-fx.webm" },
  /** "The Referral Roast": nine takes colour-matched, cut (scripts/cut_spans.py) and morph-cut into one take. */
  "rr-cut": makeTalent("rr-cut", { w: 720, h: 1280, fps: 30, seconds: 63.07, frameScale: 1.5 }),
};
export const DEFAULT_TALENT = TALENT["01-hook"];

export type Box = { x: number; y: number; w: number; h: number };

/** Face box (source px) at `t` seconds into the clip. */
export const faceAt = (tl: Talent, t: number): Box => {
  const tr = TRACKS[tl.id];
  const i = Math.max(0, Math.min(tr.faces.length - 1, Math.floor(t * tr.fps + 1e-6)));
  const [x, y, w, h] = tr.faces[i];
  return { x, y, w, h };
};

/** Mean face box over the whole clip (source px): a stable anchor for framing. */
export const meanFace = (tl: Talent): Box => {
  const list = TRACKS[tl.id].faces;
  const n = list.length;
  const sum = list.reduce((s, f) => [s[0] + f[0], s[1] + f[1], s[2] + f[2], s[3] + f[3]], [0, 0, 0, 0]);
  return { x: sum[0] / n, y: sum[1] / n, w: sum[2] / n, h: sum[3] / n };
};

/** Source → output placement: output = (x + sx * scale, y + sy * scale). */
export type Framing = { scale: number; x: number; y: number };

/**
 * Framing that puts the clip's mean face centre at (faceX, faceY) in output px (default: centred,
 * 42% down), showing the speaker from mid-chest up.
 *
 * With `fill` (default true) the result is clamped so the clip covers the whole 1080x1920 frame AND its
 * unusable rows stay below the frame; that needs scale >= HEIGHT / usableBottom (1.96 for these clips),
 * so the scale is raised to that minimum if needed. The face then lands as close to (faceX, faceY) as
 * the clamp allows. Pass `fill: false` when the clip sits inside a smaller frame (a card, a phone
 * screen) and check `usableBottomY` against that frame yourself.
 */
export const frameOnFace = (
  tl: Talent,
  opts: { scale?: number; faceX?: number; faceY?: number; fill?: boolean } = {},
): Framing => {
  const fill = opts.fill ?? true;
  const minScale = Math.max(HEIGHT / tl.usableBottom, WIDTH / tl.w);
  const want = opts.scale ?? tl.frameScale ?? 2.0;
  const scale = fill ? Math.max(want, minScale) : want;
  const f = meanFace(tl);
  const cx = f.x + f.w / 2;
  const cy = f.y + f.h / 2;
  let x = (opts.faceX ?? WIDTH / 2) - cx * scale;
  let y = (opts.faceY ?? HEIGHT * 0.42) - cy * scale;
  if (fill) {
    x = Math.min(0, Math.max(WIDTH - tl.w * scale, x));
    y = Math.min(0, Math.max(HEIGHT - tl.usableBottom * scale, y));
  }
  return { scale, x, y };
};

/** Output y of the clip's last usable row: with the full clip, keep this >= the visible bottom edge. */
export const usableBottomY = (tl: Talent, f: Framing) => f.y + tl.usableBottom * f.scale;

export type Face = Box & { cx: number; cy: number; /** top of the hair (40% of face height above the box) */ top: number };

/** Face box averaged over t ± `window` seconds (the raw track jitters a little frame to frame). */
export const smoothFaceAt = (tl: Talent, t: number, window: number): Box => {
  if (window <= 0) return faceAt(tl, t);
  const step = 1 / TRACKS[tl.id].fps;
  const n = Math.max(1, Math.round(window / step));
  const acc = { x: 0, y: 0, w: 0, h: 0 };
  for (let k = -n; k <= n; k++) {
    const b = faceAt(tl, Math.max(0, t + k * step));
    acc.x += b.x;
    acc.y += b.y;
    acc.w += b.w;
    acc.h += b.h;
  }
  const c = 2 * n + 1;
  return { x: acc.x / c, y: acc.y / c, w: acc.w / c, h: acc.h / c };
};

/** Face box in output px for the current frame. `startAt`: seconds into the clip at Sequence frame 0.
 *  `smooth`: average the track over ± this many seconds (0.2 suits graphics that follow the head). */
export const useFace = (tl: Talent, f: Framing, startAt = 0, smooth = 0): Face => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const b = smoothFaceAt(tl, startAt + frame / fps, smooth);
  const x = f.x + b.x * f.scale;
  const y = f.y + b.y * f.scale;
  const w = b.w * f.scale;
  const h = b.h * f.scale;
  return { x, y, w, h, cx: x + w / 2, cy: y + h / 2, top: y - h * 0.4 };
};

export type TalentLayerProps = {
  talent?: Talent;
  layer: "full" | "cutout" | "plate";
  framing: Framing;
  /** seconds into the clip at Sequence frame 0 */
  startAt?: number;
  /** @remotion/effects stack (WebGL), e.g. [outline({ width: 14, color: "#fff" })] */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  effects?: any[];
  style?: React.CSSProperties;
};

/** One layer of the talent, placed by a Framing. Always muted: sound is the composition's job. */
export const TalentLayer: React.FC<TalentLayerProps> = ({ talent: tl = DEFAULT_TALENT, layer, framing, startAt = 0, effects, style }) => {
  const { fps } = useVideoConfig();
  const box: React.CSSProperties = {
    position: "absolute",
    left: framing.x,
    top: framing.y,
    width: tl.w * framing.scale,
    height: tl.h * framing.scale,
    ...style,
  };
  if (layer === "plate") return <Img src={staticFile(tl.plate)} style={{ ...box, objectFit: "cover" }} />;
  return (
    <Video
      src={staticFile(layer === "full" ? tl.video : tl.cutout)}
      muted
      trimBefore={Math.round(startAt * fps)}
      effects={effects}
      style={box}
    />
  );
};

// ---------------------------------------------------------------------------------------------------
// Surfaces and finishing

/** Dark brand mesh background (never a flat fill). Drifts slowly. */
export const MeshBackground: React.FC<{ a?: string; b?: string; base?: string }> = ({
  a = COLORS.blue,
  b = COLORS.violet,
  base = COLORS.ink,
}) => {
  const frame = useCurrentFrame();
  const d1 = Math.sin(frame / 55) * 50;
  const d2 = Math.cos(frame / 70) * 40;
  return (
    <AbsoluteFill style={{ background: base }}>
      <div
        style={{
          position: "absolute",
          width: 1500,
          height: 1500,
          borderRadius: "50%",
          top: -520,
          left: -520 + d1,
          filter: "blur(60px)",
          background: `radial-gradient(circle, ${a}55, transparent 62%)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 1300,
          height: 1300,
          borderRadius: "50%",
          bottom: -480,
          right: -460 - d2,
          filter: "blur(70px)",
          background: `radial-gradient(circle, ${b}44, transparent 65%)`,
        }}
      />
    </AbsoluteFill>
  );
};

/** Top of every effect's stack: optional colour grade, then grain + vignette. */
export const Finish: React.FC<{ grade?: string; gradeOpacity?: number }> = ({ grade, gradeOpacity = 0.14 }) => (
  <>
    {grade ? <AbsoluteFill style={{ backgroundColor: grade, mixBlendMode: "soft-light", opacity: gradeOpacity, pointerEvents: "none" }} /> : null}
    <GrainVignette />
  </>
);

/** Frosted glass surface for cards on top of footage. */
export const glassCard = (opts: { radius?: number; tint?: string; dark?: boolean } = {}): React.CSSProperties => ({
  borderRadius: opts.radius ?? 32,
  background: opts.dark
    ? "linear-gradient(150deg, rgba(30,38,84,0.78), rgba(10,14,36,0.86))"
    : `linear-gradient(150deg, ${opts.tint ?? "rgba(255,255,255,0.24)"}, rgba(255,255,255,0.08))`,
  border: "1.5px solid rgba(255,255,255,0.28)",
  boxShadow: "0 24px 60px rgba(4,6,20,0.45), inset 0 1px 0 rgba(255,255,255,0.35)",
  backdropFilter: "blur(18px) saturate(1.4)",
  WebkitBackdropFilter: "blur(18px) saturate(1.4)",
});

/** Holds the frame until the bundled fonts are loaded, so text never renders in a fallback face. */
export const FontGate: React.FC<{ children: React.ReactNode }> = ({ children }) =>
  useFontsReady() ? <>{children}</> : null;

// ---------------------------------------------------------------------------------------------------
// Catalogue metadata: what each effect is for (read by the showcase and by the reel-effects skill)

export type EffectNeed = "cutout" | "plate" | "face";
export type EffectMeta = {
  n: number;
  slug: string;
  name: string;
  /** demo length at 30 fps */
  durationInFrames: number;
  needs: EffectNeed[];
  /** one line: what the viewer sees */
  what: string;
  /** the kind of line or moment in a script it suits */
  bestFor: string;
  /** when not to reach for it */
  avoid: string;
};

/** Placeholder used until an effect is built (renders the clip with its name). */
export const Placeholder: React.FC<{ meta: EffectMeta; talent?: Talent; startAt?: number }> = ({ meta, talent: tl = DEFAULT_TALENT, startAt }) => (
  <AbsoluteFill style={{ background: COLORS.ink }}>
    <TalentLayer talent={tl} layer="full" framing={frameOnFace(tl)} startAt={startAt} />
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: 90, color: "white", textShadow: "0 4px 30px #000" }}>
        {String(meta.n).padStart(2, "0")} {meta.name}
      </div>
    </AbsoluteFill>
  </AbsoluteFill>
);
