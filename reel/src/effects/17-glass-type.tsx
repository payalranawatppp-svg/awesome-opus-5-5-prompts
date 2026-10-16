/**
 * 17 Glass type: one to three huge words made of frosted glass over the footage.
 *
 * Inside the letters you see a second copy of the clip, blurred (frost), brightened and slightly magnified
 * and shifted (refraction). The copy is cut to the letter shapes with a CSS mask that points at an SVG
 * <mask> of per-letter <text> nodes, so every letter can rise, scale, blur and fade on its own. On top, an
 * SVG pass draws the glass body: inner shadow + inner light (bevel), a specular rim and a soft drop shadow.
 */
import React, { useId } from "react";
import { measureText } from "@remotion/layout-utils";
import { AbsoluteFill, interpolate } from "remotion";
import {
  DEFAULT_TALENT,
  EASE,
  Finish,
  SPRING,
  TalentLayer,
  clamp,
  float,
  frameOnFace,
  springAt,
  useEnvelope,
  type EffectMeta,
  type Framing,
  type Talent,
} from "./shared";
import { COLORS, FONT_DISPLAY, HEIGHT, WIDTH } from "../theme";

/** Map a spring value (0..1, may overshoot on purpose) onto a range. Springs drive these, never linear time. */
const mix = (s: number, a: number, b: number) => a + (b - a) * s;

export const meta: EffectMeta = {
  n: 17,
  slug: "glass-type",
  name: "Glass type",
  durationInFrames: 90,
  needs: [],
  what: "One to three huge frosted-glass words over the footage: the letters refract a blurred, brighter copy of the shot, with a lit rim and a soft shadow.",
  bestFor: "A one-word or short-phrase punch, titles and hooks (\"Be seen\", \"Stay visible\").",
  avoid: "Long sentences (glass type needs one to three short words) and busy moments where the face must stay clear.",
};

export type GlassTypeProps = {
  talent?: Talent;
  /** seconds into the clip at the effect's first frame */
  startAt?: number;
  /** One to three words. Each word gets its own line; use "\n" to set the lines yourself. */
  text?: string;
  /** Output y of the centre of the word block. The default sits the words under the face, over the chest. */
  y?: number;
  /** Colour of the light caught in the glass rim. */
  tint?: string;
};

// ---------------------------------------------------------------------------------------------------
// Look

const GLASS = {
  /** blur of the copy seen through the glass (output px). CSS filters: they work whether the clip is
   *  decoded in the browser or by the compositor (WebGL effects are dropped on the OffthreadVideo fallback). */
  frost: 17,
  /** magnification of the copy (refraction) */
  magnify: 1.16,
  /** max type size and the box the words must fit */
  maxSize: 340,
  maxWidth: WIDTH - 2 * 80,
  maxHeight: 560,
  lineGap: 0.93,
  capHeight: 0.72,
  letterSpacing: -0.035,
  shadowInk: COLORS.ink,
  rimLight: COLORS.white,
};

// ---------------------------------------------------------------------------------------------------
// Layout: per-letter positions (prefix widths keep the font's kerning)

type Glyph = { ch: string; x: number; w: number; baseline: number; i: number };

const layoutWords = (text: string, centerY: number) => {
  const lines = (text.includes("\n") ? text.split("\n") : text.trim().split(/\s+/)).map((l) => l.trim()).filter(Boolean);
  const m = (t: string, size: number) =>
    measureText({ text: t, fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: size, letterSpacing: `${GLASS.letterSpacing}em` }).width;
  const widest = Math.max(...lines.map((l) => m(l, 100) / 100));
  const fitW = GLASS.maxWidth / widest;
  const fitH = GLASS.maxHeight / (GLASS.capHeight + (lines.length - 1) * GLASS.lineGap);
  const size = Math.min(GLASS.maxSize, fitW, fitH);
  const blockH = size * (GLASS.capHeight + (lines.length - 1) * GLASS.lineGap);
  const top = centerY - blockH / 2;
  const glyphs: Glyph[] = [];
  let i = 0;
  lines.forEach((line, li) => {
    const baseline = top + size * GLASS.capHeight + li * size * GLASS.lineGap;
    const lw = m(line, size);
    const x0 = WIDTH / 2 - lw / 2;
    [...line].forEach((ch, ci) => {
      const x = x0 + m(line.slice(0, ci), size);
      const w = m(line.slice(0, ci + 1), size) - (x - x0);
      if (ch !== " ") glyphs.push({ ch, x, w, baseline, i: i++ });
    });
  });
  return { glyphs, size, top, blockH };
};

// ---------------------------------------------------------------------------------------------------

export const GlassType: React.FC<GlassTypeProps> = ({
  talent = DEFAULT_TALENT,
  startAt = 0,
  text = "Be seen",
  y = 1325,
  tint = COLORS.cyan,
}) => {
  const { frame, fps, durationInFrames } = useEnvelope();
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const ids = { mask: `gt-mask-${uid}`, inner: `gt-inner-${uid}`, rim: `gt-rim-${uid}`, spec: `gt-spec-${uid}`, shadow: `gt-shadow-${uid}` };

  const framing = frameOnFace(talent);
  const { glyphs, size, top, blockH } = layoutWords(text, y);
  const n = glyphs.length;

  // Timing (all from fps / duration so the effect stretches to any length)
  const enterAt = Math.round(0.08 * fps);
  const stagger = Math.max(2, Math.round(Math.min(0.1 * fps, (0.6 * fps) / Math.max(1, n - 1))));
  // Exit: ~10 frames in all, letters leave 1 frame apart (less for long words) and all are gone by the end
  const exitLen = Math.round(0.34 * fps);
  const lastFrame = durationInFrames - 1;
  const exitStart = lastFrame - exitLen;
  const exitStagger = Math.min(1, (0.45 * exitLen) / Math.max(1, n - 1));
  const exitEach = exitLen - exitStagger * (n - 1);

  // Scene dim: the world steps back so the glass can catch the light
  const dimIn = interpolate(frame, [0, Math.round(0.4 * fps)], [0, 1], { ...clamp, easing: EASE.out });
  const dimOut = interpolate(frame, [exitStart, lastFrame], [0, 1], { ...clamp, easing: EASE.in });
  const dim = dimIn * (1 - dimOut);

  // Whole block breathes; the refraction drifts so the glass feels alive
  const bob = float(frame, 5, 26);
  const refrX = Math.sin(frame / 31) * 7;
  const refrY = -26 + Math.cos(frame / 37) * 6;

  // Per-letter state
  const letters = glyphs.map((g) => {
    const enter = springAt(frame, fps, enterAt + g.i * stagger, SPRING.smooth);
    const pop = springAt(frame, fps, enterAt + g.i * stagger, SPRING.snappy);
    const ex = interpolate(frame, [exitStart + g.i * exitStagger, exitStart + g.i * exitStagger + exitEach], [0, 1], {
      ...clamp,
      easing: EASE.in,
    });
    const rise = mix(enter, 110, 0) - ex * 70;
    const scale = mix(pop, 0.82, 1) + ex * 0.12;
    const opacity = Math.min(1, enter * 1.6) * (1 - ex);
    const blurPx = Math.max(0, mix(enter, 22, 0)) + ex * 16;
    const breathe = Math.sin(frame / 24 + g.i * 0.9) * 2.2 * enter;
    const cx = g.x + g.w / 2;
    const dy = rise + bob + breathe;
    const transform = `translate(${cx} ${g.baseline + dy}) scale(${scale}) translate(${-cx} ${-g.baseline})`;
    /** bevel + rim fade in as the letter comes into focus */
    const sharp = interpolate(blurPx, [0, 10], [1, 0], { ...clamp, easing: EASE.out });
    return { g, opacity, blurPx, transform, sharp };
  });

  // Specular sweep: a band of light crosses the word once after it lands, then a slow second pass
  const sweepStart = enterAt + (n - 1) * stagger + Math.round(0.15 * fps);
  const sweep = interpolate(frame, [sweepStart, sweepStart + Math.round(0.9 * fps)], [-0.4, 1.4], { ...clamp, easing: EASE.inOut });

  // Refracted copy: magnified around the word block, nudged up (light bends through the glass)
  const cxBlock = WIDTH / 2;
  const cyBlock = top + blockH / 2;
  const refr: Framing = {
    scale: framing.scale * GLASS.magnify,
    x: cxBlock + (framing.x - cxBlock) * GLASS.magnify + refrX,
    y: cyBlock + (framing.y - cyBlock) * GLASS.magnify + refrY,
  };

  const textProps = { fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: size } as const;
  const letterNodes = (fill: string, extra: (l: (typeof letters)[number]) => React.SVGProps<SVGTextElement> = () => ({})) =>
    letters.map((l) => (
      <text key={l.g.i} x={l.g.x} y={l.g.baseline} transform={l.transform} {...textProps} fill={fill} {...extra(l)}>
        {l.g.ch}
      </text>
    ));

  return (
    <AbsoluteFill style={{ background: COLORS.ink }}>
      {/* 1. footage, stepped back a touch */}
      <TalentLayer
        talent={talent}
        layer="full"
        framing={framing}
        startAt={startAt}
        style={{ filter: `brightness(${1 - 0.16 * dim}) saturate(${1 - 0.18 * dim})` }}
      />
      <AbsoluteFill
        style={{
          opacity: dim,
          background: `radial-gradient(ellipse 70% 32% at 50% ${((cyBlock + 40) / HEIGHT) * 100}%, rgba(7,11,26,0.42), rgba(7,11,26,0) 100%)`,
        }}
      />

      {/* 2. SVG defs + drop shadow under the glass */}
      <svg width={WIDTH} height={HEIGHT} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
        <defs>
          {letters.map((l) =>
            l.blurPx > 0.05 ? (
              <filter key={l.g.i} id={`${ids.mask}-b${l.g.i}`} x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation={l.blurPx} />
              </filter>
            ) : null,
          )}
          <mask id={ids.mask} maskUnits="userSpaceOnUse" x={0} y={0} width={WIDTH} height={HEIGHT}>
            {letterNodes("white", (l) => ({
              opacity: l.opacity,
              filter: l.blurPx > 0.05 ? `url(#${ids.mask}-b${l.g.i})` : undefined,
            }))}
          </mask>
          <filter id={ids.shadow} x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation={size * 0.1} />
          </filter>
          {/* glass body: thick dark edge all round, darker inner edge at the bottom, a bright inner lip at the top */}
          <filter id={ids.inner} x="-10%" y="-10%" width="120%" height="120%">
            <feComponentTransfer in="SourceAlpha" result="inv">
              <feFuncA type="table" tableValues="1 0" />
            </feComponentTransfer>
            <feGaussianBlur in="inv" stdDeviation={size * 0.03} result="edgeBlur" />
            <feComposite in="edgeBlur" in2="SourceAlpha" operator="in" result="edgeIn" />
            <feFlood floodColor={GLASS.shadowInk} floodOpacity={0.42} result="edgeCol" />
            <feComposite in="edgeCol" in2="edgeIn" operator="in" result="edge" />
            <feOffset in="inv" dx={-size * 0.01} dy={-size * 0.035} result="lowOff" />
            <feGaussianBlur in="lowOff" stdDeviation={size * 0.02} result="lowBlur" />
            <feComposite in="lowBlur" in2="SourceAlpha" operator="in" result="lowIn" />
            <feFlood floodColor={GLASS.shadowInk} floodOpacity={0.5} result="lowCol" />
            <feComposite in="lowCol" in2="lowIn" operator="in" result="low" />
            <feOffset in="inv" dx={size * 0.006} dy={size * 0.018} result="hiOff" />
            <feGaussianBlur in="hiOff" stdDeviation={size * 0.007} result="hiBlur" />
            <feComposite in="hiBlur" in2="SourceAlpha" operator="in" result="hiIn" />
            <feFlood floodColor={GLASS.rimLight} floodOpacity={0.85} result="hiCol" />
            <feComposite in="hiCol" in2="hiIn" operator="in" result="hi" />
            <feMerge>
              <feMergeNode in="edge" />
              <feMergeNode in="low" />
              <feMergeNode in="hi" />
            </feMerge>
          </filter>
          {/* specular rim: the outer few px of each letter (alpha erode, so overlapping glyph contours never show) */}
          <filter id={ids.rim} x="-5%" y="-5%" width="110%" height="110%">
            <feMorphology in="SourceAlpha" operator="erode" radius={Math.max(2, size * 0.011)} result="er" />
            <feComposite in="SourceGraphic" in2="er" operator="out" result="band" />
            <feGaussianBlur in="band" stdDeviation={0.7} />
          </filter>
          <linearGradient id={ids.spec} gradientUnits="userSpaceOnUse" x1={0} y1={top - size * 0.2} x2={WIDTH * 0.35} y2={top + blockH + size * 0.3}>
            <stop offset="0%" stopColor={GLASS.rimLight} stopOpacity={0.95} />
            <stop offset="40%" stopColor={tint} stopOpacity={0.3} />
            <stop offset="75%" stopColor={GLASS.rimLight} stopOpacity={0.12} />
            <stop offset="100%" stopColor={GLASS.rimLight} stopOpacity={0.35} />
          </linearGradient>
        </defs>
        <g filter={`url(#${ids.shadow})`} transform={`translate(0 ${size * 0.05})`}>
          {letterNodes(GLASS.shadowInk, (l) => ({ opacity: 0.5 * l.opacity * l.opacity }))}
        </g>
      </svg>

      {/* 3. glass body: the refracted copy, cut to the letters */}
      <AbsoluteFill style={{ maskImage: `url(#${ids.mask})`, WebkitMaskImage: `url(#${ids.mask})` }}>
        <TalentLayer
          talent={talent}
          layer="full"
          framing={refr}
          startAt={startAt}
          style={{ filter: `blur(${GLASS.frost}px) brightness(1.26) saturate(1.2) contrast(0.92)` }}
        />
        {/* frost tint: lighter at the top of each line, like light pooling in thick glass */}
        <AbsoluteFill
          style={{
            background: `linear-gradient(180deg, rgba(255,255,255,0.2) ${((top - size * 0.1) / HEIGHT) * 100}%, rgba(255,255,255,0.04) ${((top + blockH) / HEIGHT) * 100}%)`,
          }}
        />
        {/* specular sweep */}
        <AbsoluteFill
          style={{
            background: `linear-gradient(105deg, rgba(255,255,255,0) ${sweep * 100 - 14}%, rgba(255,255,255,0.55) ${sweep * 100}%, rgba(255,255,255,0) ${sweep * 100 + 14}%)`,
            mixBlendMode: "screen",
          }}
        />
      </AbsoluteFill>

      {/* 4. bevel + rim on top of the glass */}
      <svg width={WIDTH} height={HEIGHT} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
        <g filter={`url(#${ids.inner})`}>{letterNodes("black", (l) => ({ opacity: l.opacity * l.sharp }))}</g>
        <g filter={`url(#${ids.rim})`}>{letterNodes(`url(#${ids.spec})`, (l) => ({ opacity: l.opacity * l.sharp }))}</g>
      </svg>

      <Finish grade={COLORS.indigo} gradeOpacity={0.1 * dim} />
    </AbsoluteFill>
  );
};
