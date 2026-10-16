import React from "react";
import { outline } from "@remotion/effects/outline";
import { paper } from "@remotion/effects/paper";
import { roughenEdges } from "@remotion/effects/roughen-edges";
import { dropShadow } from "@remotion/effects/drop-shadow";
import { tear } from "@remotion/effects/tear";
import { AbsoluteFill, Freeze, interpolate, Solid, spring } from "remotion";
import { FONT_DISPLAY, FONT_HAND, FONT_MONO, FONT_SERIF, FONT_UI, HEIGHT, WIDTH } from "../theme";
import {
  DEFAULT_TALENT,
  EASE,
  Finish,
  frameOnFace,
  rand,
  TalentLayer,
  useEnvelope,
  type EffectMeta,
  type Framing,
  type Talent,
} from "./shared";

export const meta: EffectMeta = {
  n: 13,
  slug: "paper-cut",
  name: "Paper cut",
  durationInFrames: 90,
  needs: ["cutout"],
  what: "A stop-motion paper collage at 12 fps: the speaker becomes a white-edged sticker on textured paper, torn strips slide in and a ransom-note title lands letter by letter.",
  bestFor: "A playful, crafted, human tone: storytelling beats, \"let me tell you\" moments, a section title.",
  avoid: "Formal or corporate contexts, and long titles (two short words work best).",
};

export type PaperCutProps = {
  talent?: Talent;
  /** seconds into the clip at the effect's first frame */
  startAt?: number;
  /** ransom-note title; each word gets its own line (keep it to ~2 words, ≤ 6 letters each) */
  words?: string;
  /** step the speaker's video at 12 fps too (true stop-motion); false keeps the footage smooth */
  stepVideo?: boolean;
};

/** The collage palette (warm papers + a few printed colours). */
const PAPER = {
  bgFront: "#D9C6A3",
  bgBack: "#F5EBD6",
  white: "#FFFDF6",
  cream: "#F3E8D2",
  newsprint: "#E6E0D0",
  newsprintDark: "#C9C1AC",
  kraft: "#C49A6C",
  kraftDark: "#A87F55",
  mustard: "#E6A93A",
  mustardDark: "#C98B22",
  tomato: "#D9553B",
  tomatoDark: "#B8432D",
  teal: "#2E7880",
  tealDark: "#215C63",
  ink: "#1E1A16",
  tape: "rgba(244,234,204,0.74)",
  tapeLine: "rgba(190,172,130,0.55)",
  shadow: "rgba(64,40,16,0.36)",
  shadowSoft: "rgba(64,40,16,0.22)",
};

/** Stop-motion clock: poses advance at 12 fps and hold 2-3 output frames each. */
const POSE_FPS = 12;

const STICKER_SCALE = 1.5;
const STICKER_FACE_Y = 870;

/** Sticker placement: the cutout's straight right edge (source x = 720) is kept off frame. */
const placeSticker = (tl: Talent): Framing => {
  const f = frameOnFace(tl, { scale: STICKER_SCALE, faceY: STICKER_FACE_Y, fill: false });
  return { ...f, x: Math.max(f.x, WIDTH + 40 - tl.w * STICKER_SCALE) };
};

type Scrap = { bg: string; fg: string; font: string; weight: number; italic?: boolean; size: number };
const SCRAPS: Scrap[] = [
  { bg: PAPER.white, fg: PAPER.ink, font: FONT_SERIF, weight: 400, size: 150 },
  { bg: PAPER.ink, fg: PAPER.white, font: FONT_DISPLAY, weight: 800, size: 124 },
  { bg: PAPER.mustard, fg: PAPER.ink, font: FONT_MONO, weight: 700, size: 124 },
  { bg: PAPER.newsprint, fg: PAPER.tomato, font: FONT_SERIF, weight: 400, italic: true, size: 150 },
  { bg: PAPER.tomato, fg: PAPER.white, font: FONT_UI, weight: 800, size: 120 },
  { bg: PAPER.teal, fg: PAPER.cream, font: FONT_DISPLAY, weight: 800, size: 126 },
  { bg: PAPER.cream, fg: PAPER.ink, font: FONT_HAND, weight: 700, size: 150 },
  { bg: PAPER.kraft, fg: PAPER.white, font: FONT_UI, weight: 800, size: 118 },
];

/** A hand-cut polygon: a rectangle whose corners (and one mid-edge point) wander a little. */
const cutShape = (seed: number, wobble = 5) => {
  const r = (i: number) => (rand(seed * 17.3 + i * 5.1) - 0.5) * 2 * wobble;
  const pts = [
    [0 + Math.abs(r(1)), 0 + Math.abs(r(2))],
    [50 + r(3), 0 + Math.abs(r(4)) * 0.6],
    [100 - Math.abs(r(5)), 0 + Math.abs(r(6))],
    [100 - Math.abs(r(7)) * 0.6, 50 + r(8)],
    [100 - Math.abs(r(9)), 100 - Math.abs(r(10))],
    [50 + r(11), 100 - Math.abs(r(12)) * 0.6],
    [0 + Math.abs(r(13)), 100 - Math.abs(r(14))],
    [0 + Math.abs(r(15)) * 0.6, 50 + r(16)],
  ];
  return `polygon(${pts.map(([x, y]) => `${x.toFixed(1)}% ${y.toFixed(1)}%`).join(", ")})`;
};

/** Tape strip with zig-zag torn ends. */
const tapeShape = (() => {
  const left: string[] = [];
  const right: string[] = [];
  for (let i = 0; i <= 6; i++) {
    const y = (i / 6) * 100;
    left.push(`${i % 2 ? 4 : 0}% ${y}%`);
    right.unshift(`${i % 2 ? 96 : 100}% ${y}%`);
  }
  return `polygon(${[...left, ...right].join(", ")})`;
})();

/**
 * Clip-path for a sheet with a torn top edge: a slow wander plus fine fibre jaggies.
 * `lift` raises the edge (px) by a varying amount, for the white core that shows above a coloured tear.
 */
const tornTop = (seed: number, w: number, h: number, lift = 0) => {
  const pts: string[] = [];
  const steps = Math.round(w / 9);
  for (let i = 0; i <= steps; i++) {
    const x = (i / steps) * w;
    const wander = Math.sin(i * 0.09 + seed) * 9 + Math.sin(i * 0.031 + seed * 2.1) * 12;
    const fibre = (rand(seed * 13.1 + i * 1.7) - 0.5) * 9;
    const core = lift ? lift * (0.45 + 0.75 * (0.5 + 0.5 * Math.sin(i * 0.13 + seed * 0.7))) + rand(seed + i * 2.9) * 4 : 0;
    pts.push(`${x.toFixed(1)}px ${(24 + wander + fibre - core).toFixed(1)}px`);
  }
  return `polygon(${pts.join(", ")}, ${w}px ${h}px, 0px ${h}px)`;
};

export const PaperCut: React.FC<PaperCutProps> = ({ talent = DEFAULT_TALENT, startAt = 0, words = "Story time", stepVideo = true }) => {
  const exitLen = 12; // 5 poses: still much faster than the build
  const { frame, fps, durationInFrames: D } = useEnvelope(exitLen);
  const step = fps / POSE_FPS;
  const pose = Math.floor(frame / step);
  const pf = pose * step; // the frame this pose was "shot" on
  const exitPose = Math.floor((D - exitLen) / step);
  const k = Math.min(1, D / meta.durationInFrames);
  const P = (poses: number) => Math.round(poses * k); // timeline in poses, compressed on short Sequences

  /** 0→1 settle for a piece that arrives at pose `at` (spring sampled on the pose clock). */
  const arrive = (at: number, cfg = { damping: 13, stiffness: 140, mass: 0.8 }) =>
    pf < at * step ? 0 : spring({ frame: pf - at * step, fps, config: cfg });
  /** 0→1 for the exit, starting `delay` poses into the exit and taking `span` poses. */
  const leave = (delay = 0, span = 3, easing = EASE.in) =>
    interpolate(pose, [exitPose + delay, exitPose + delay + span], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing });
  /** Hand-placed jitter: a new tiny offset every pose (the stop-motion boil). */
  const jit = (seed: number, amp = 1) => ({
    r: (rand(seed * 7.7 + pose * 3.31) - 0.5) * 1.3 * amp,
    x: (rand(seed * 5.3 + pose * 1.97) - 0.5) * 3 * amp,
    y: (rand(seed * 2.9 + pose * 4.13) - 0.5) * 3 * amp,
  });

  const sticker = placeSticker(talent);
  const stickerW = talent.w * STICKER_SCALE;
  const stickerH = talent.h * STICKER_SCALE;
  // y where the cutout starts to fade (source row 980): the front strip must cover from above it
  const fadeY = sticker.y + talent.usableBottom * STICKER_SCALE;

  // --- pieces. Order matters: the front strip is down before the sticker lands, and the sticker has
  // left sideways (exit poses 0-3) before the front strip drops (poses 3-5), so the cutout's soft
  // bottom is never seen.
  const aIn = arrive(-1); // already sliding on the first frame
  const fIn = arrive(0);
  const bIn = arrive(P(1));
  const sIn = arrive(P(3), { damping: 11, stiffness: 160, mass: 0.7 });
  const lines = words.split(/\s+/).filter(Boolean);
  const letters = lines.flatMap((w, li) => w.split("").map((ch, ci) => ({ ch, li, ci })));
  const letterAt = (i: number) => P(5) + i;
  const tapeAt = letterAt(letters.length) + 1;

  const sj = jit(1, 0.9);
  const stickerMove = {
    x: interpolate(sIn, [0, 1], [-60, 0]) + sj.x + leave(0) * -1450,
    y: interpolate(sIn, [0, 1], [140, 0]) + sj.y,
    r: interpolate(sIn, [0, 1], [-9, -2]) + sj.r + leave(0) * -14,
    s: interpolate(sIn, [0, 1], [1.18, 1]),
  };

  return (
    <AbsoluteFill style={{ background: PAPER.bgBack, overflow: "hidden" }}>
      {/* paper ground */}
      <Solid
        width={WIDTH}
        height={HEIGHT}
        color={PAPER.bgBack}
        effects={[paper({ colorFront: PAPER.bgFront, colorBack: PAPER.bgBack, amount: 1, contrast: 0.25, roughness: 0.45, fiber: 0.35, crumples: 0.35, folds: 0.5, foldCount: 4, drops: 0.15, seed: 12, scale: 0.7 })]}
        style={{ position: "absolute", left: 0, top: 0 }}
      />

      {/* back strip A: mustard, torn in two, behind the head */}
      <Strip
        w={1320}
        h={340}
        x={-120 + interpolate(aIn, [0, 1], [-1400, 0]) + leave(0) * -1500}
        y={430}
        rot={-8 + jit(2).r}
        color={PAPER.mustard}
        dark={PAPER.mustardDark}
        seed={31}
        torn
      />
      {/* back strip B: teal block on the right */}
      <Strip
        w={560}
        h={900}
        x={640 + interpolate(bIn, [0, 1], [900, 0]) + leave(1) * 900}
        y={760 + jit(3).y}
        rot={6 + jit(3).r}
        color={PAPER.teal}
        dark={PAPER.tealDark}
        seed={47}
      />
      {/* back strip C: newsprint scrap low left */}
      <Strip
        w={520}
        h={420}
        x={-90 + interpolate(bIn, [0, 1], [-700, 0]) + leave(1) * -800}
        y={1060 + jit(4).y}
        rot={-12 + jit(4).r}
        color={PAPER.newsprint}
        dark={PAPER.newsprintDark}
        seed={63}
        print
      />

      {/* the speaker as a sticker */}
      {sIn > 0 ? (
        <div
          style={{
            position: "absolute",
            inset: 0,
            transform: `translate(${stickerMove.x}px, ${stickerMove.y}px) rotate(${stickerMove.r}deg) scale(${stickerMove.s})`,
            transformOrigin: `${sticker.x + stickerW / 2}px ${sticker.y + stickerH * 0.4}px`,
          }}
        >
          <Freeze frame={Math.floor(pf)} active={stepVideo}>
            <TalentLayer
              talent={talent}
              layer="cutout"
              framing={sticker}
              startAt={startAt}
              effects={[
                outline({ width: 11, color: PAPER.white }),
                dropShadow({ radius: 10, offsetX: 7, offsetY: 10, opacity: 0.4, color: PAPER.ink }),
              ]}
            />
          </Freeze>
          {/* tape holding the sticker down (rides with it) */}
          <Tape x={sticker.x + stickerW * 0.17} y={sticker.y + stickerH * 0.5} w={220} rot={-42} show={pose >= tapeAt} jit={jit(6)} />
          <Tape x={sticker.x + stickerW * 0.79} y={sticker.y + stickerH * 0.17} w={190} rot={36} show={pose >= tapeAt + 1} jit={jit(7)} />
        </div>
      ) : null}

      {/* front strip: torn kraft paper across the bottom (white torn core along the tear); hides the cutout's soft lower edge */}
      <TornSheet
        w={1400}
        h={HEIGHT - fadeY + 320}
        x={-160}
        y={fadeY - 110 + interpolate(fIn, [0, 1], [700, 0]) + leave(3, 2, EASE.out) * 700}
        rot={-3 + jit(5).r * 0.6}
        color={PAPER.kraft}
        dark={PAPER.kraftDark}
        seed={7}
      />

      {/* ransom-note title */}
      <div
        style={{
          position: "absolute",
          left: 64,
          right: 64,
          top: 1240,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 18,
        }}
      >
        {lines.map((w, li) => (
          <div key={li} style={{ display: "flex", gap: 8, alignItems: "center", marginLeft: li % 2 ? 90 : -60 }}>
            {w.split("").map((ch, ci) => {
              const idx = letters.findIndex((l) => l.li === li && l.ci === ci);
              const at = letterAt(idx);
              const s = SCRAPS[Math.floor(rand(idx * 3.7 + li * 11 + 5) * SCRAPS.length)];
              const lj = jit(20 + idx, 0.8);
              const baseRot = (rand(idx * 9.1 + 2) - 0.5) * 14;
              const baseY = (rand(idx * 4.3 + 8) - 0.5) * 22;
              const landed = pose >= at;
              const land = arrive(at, { damping: 10, stiffness: 190, mass: 0.6 });
              const out = leave(0, 2 + (idx % 2));
              const upper = rand(idx * 6.1 + 1) > 0.3;
              return (
                <div
                  key={ci}
                  style={{
                    visibility: landed ? "visible" : "hidden",
                    transform: `translate(${lj.x + out * (idx % 2 ? 900 : -900)}px, ${baseY + lj.y + out * -200}px) rotate(${baseRot + lj.r * 2 + out * 40}deg) scale(${interpolate(land, [0, 1], [1.45, 1])})`,
                    filter: `drop-shadow(3px 5px 0 ${PAPER.shadowSoft}) drop-shadow(0 10px 14px ${PAPER.shadowSoft})`,
                  }}
                >
                  <div
                    style={{
                      background: s.bg,
                      color: s.fg,
                      fontFamily: s.font,
                      fontWeight: s.weight,
                      fontStyle: s.italic ? "italic" : "normal",
                      fontSize: s.size,
                      lineHeight: 1,
                      padding: s.font === FONT_SERIF || s.font === FONT_HAND ? "8px 18px 2px" : "14px 16px 10px",
                      clipPath: cutShape(idx + li * 31 + 3),
                      minWidth: 60,
                      textAlign: "center",
                    }}
                  >
                    {upper ? ch.toUpperCase() : ch.toLowerCase()}
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>

      <Finish />
    </AbsoluteFill>
  );
};

/** A torn paper strip: textured, rough-edged, with a white fibre rim and a cast shadow. */
const Strip: React.FC<{
  w: number;
  h: number;
  x: number;
  y: number;
  rot: number;
  color: string;
  dark: string;
  seed: number;
  /** torn across into two pieces */
  torn?: boolean;
  /** printed newspaper columns on it */
  print?: boolean;
}> = ({ w, h, x, y, rot, color, dark, seed, torn, print }) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: y,
      width: w,
      height: h,
      transform: `rotate(${rot}deg)`,
      filter: `drop-shadow(4px 8px 0 ${PAPER.shadowSoft}) drop-shadow(0 16px 22px ${PAPER.shadowSoft})`,
    }}
  >
    <Solid
      width={w}
      height={h}
      color={color}
      effects={[
        paper({ colorFront: dark, colorBack: color, amount: 0.9, contrast: 0.2, roughness: 0.5, fiber: 0.4, crumples: 0.25, folds: 0.35, foldCount: 3, drops: 0.1, seed, scale: 0.5 }),
        ...(torn ? [tear({ progress: 1.08, angle: 0, rotation: 4, jaggedness: 16 })] : []),
        roughenEdges({ amount: 1, border: 16, scale: 0.09, seed: seed * 1.7 }),
        outline({ width: 4, color: PAPER.white }),
      ]}
      style={{ position: "absolute", left: 0, top: 0 }}
    />
    {print ? (
      <div
        style={{
          position: "absolute",
          inset: "34px 34px 40px",
          display: "flex",
          gap: 22,
          opacity: 0.5,
        }}
      >
        {[0, 1, 2].map((c) => (
          <div
            key={c}
            style={{
              flex: 1,
              backgroundImage: `repeating-linear-gradient(180deg, ${PAPER.newsprintDark} 0 7px, transparent 7px 17px)`,
              WebkitMaskImage: `linear-gradient(90deg, #000 ${70 + rand(seed + c) * 30}%, transparent 100%)`,
            }}
          />
        ))}
      </div>
    ) : null}
  </div>
);

/** A big sheet with a hand-torn top edge: textured colour over a white torn core. */
const TornSheet: React.FC<{ w: number; h: number; x: number; y: number; rot: number; color: string; dark: string; seed: number }> = ({
  w,
  h,
  x,
  y,
  rot,
  color,
  dark,
  seed,
}) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: y,
      width: w,
      height: h,
      transform: `rotate(${rot}deg)`,
      filter: `drop-shadow(0 -6px 0 ${PAPER.shadowSoft}) drop-shadow(0 -12px 24px ${PAPER.shadow})`,
    }}
  >
    <Solid
      width={w}
      height={h}
      color={PAPER.white}
      effects={[paper({ colorFront: PAPER.cream, colorBack: PAPER.white, amount: 0.6, fiber: 0.6, roughness: 0.6, folds: 0, crumples: 0.1, seed: seed + 5, scale: 0.4 })]}
      style={{ position: "absolute", left: 0, top: 0, clipPath: tornTop(seed, w, h, 16) }}
    />
    <Solid
      width={w}
      height={h}
      color={color}
      effects={[paper({ colorFront: dark, colorBack: color, amount: 0.9, contrast: 0.2, roughness: 0.5, fiber: 0.4, crumples: 0.3, folds: 0.3, foldCount: 3, drops: 0.1, seed, scale: 0.5 })]}
      style={{ position: "absolute", left: 0, top: 0, clipPath: tornTop(seed, w, h) }}
    />
  </div>
);

/** A piece of masking tape. */
const Tape: React.FC<{ x: number; y: number; w: number; rot: number; show: boolean; jit: { r: number; x: number; y: number } }> = ({
  x,
  y,
  w,
  rot,
  show,
  jit,
}) =>
  show ? (
    <div
      style={{
        position: "absolute",
        left: x - w / 2,
        top: y - 28,
        width: w,
        height: 56,
        transform: `translate(${jit.x}px, ${jit.y}px) rotate(${rot + jit.r}deg)`,
        filter: `drop-shadow(0 2px 2px ${PAPER.shadowSoft})`,
      }}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          background: `linear-gradient(180deg, ${PAPER.tape}, ${PAPER.tape}), repeating-linear-gradient(90deg, ${PAPER.tapeLine} 0 2px, transparent 2px 9px)`,
          clipPath: tapeShape,
        }}
      />
    </div>
  ) : null;
