/**
 * 05 Digital zoom: a camera-HUD punch-in on the face.
 *
 * The viewfinder HUD draws on (corner marks, REC + timecode, zoom bar). Focus brackets hunt in from wide
 * and lock on the face. On the beat the shot SNAPS to a tight crop on the face with a digital artefact
 * (pixel blocks, RGB split, scanlines, radial smear) that resolves in a few frames; the crop then tracks
 * the face (smoothed, like an auto-framing camera) and eases back out to the wide shot before the end.
 */
import React from "react";
import { chromaticAberration } from "@remotion/effects/chromatic-aberration";
import { pixelate } from "@remotion/effects/pixelate";
import { scanlines } from "@remotion/effects/scanlines";
import { zoomBlur } from "@remotion/effects/zoom-blur";
import { AbsoluteFill, interpolate, interpolateColors } from "remotion";
import {
  DEFAULT_TALENT,
  EASE,
  Finish,
  SPRING,
  TalentLayer,
  clamp,
  faceAt,
  frameOnFace,
  springAt,
  useEnvelope,
  type Box,
  type EffectMeta,
  type Framing,
  type Talent,
} from "./shared";
import { COLORS, FONT_MONO, HEIGHT, WIDTH } from "../theme";

export const meta: EffectMeta = {
  n: 5,
  slug: "digital-zoom",
  name: "Digital zoom",
  durationInFrames: 90,
  needs: ["face"],
  what: "A camera-HUD punch-in: focus brackets lock on the face, then the shot snaps to a tight crop with a quick digital glitch, holds and eases back out.",
  bestFor: "Emphasis on one word or a reaction (\"wait\", \"this is the part\", \"look at this\").",
  avoid: "Overuse: once or twice per video at most, and not on calm, reflective lines.",
};

export type DigitalZoomProps = {
  talent?: Talent;
  /** seconds into the clip at the effect's first frame */
  startAt?: number;
  /** punch-in factor over the wide shot (the readout shows it), 1.3 to 2.0 */
  zoom?: number;
  /** seconds into the effect when the snap lands (put it on the word you want to hit) */
  snapAt?: number;
};

// ---------------------------------------------------------------------------------------------------
// Look

const HUD = {
  line: COLORS.white,
  lock: COLORS.amber,
  rec: COLORS.rose,
  shadow: "0 2px 10px rgba(7,11,26,0.55)",
  stroke: 4,
  inset: { x: 72, top: 236, bottom: 1690 },
};

/** Face box (source px) averaged over t ± win seconds: steadier than the raw per-frame track. */
const smoothFace = (tl: Talent, t: number, win: number): Box => {
  const n = 9;
  const acc = { x: 0, y: 0, w: 0, h: 0 };
  for (let i = 0; i < n; i++) {
    const b = faceAt(tl, Math.max(0, Math.min(tl.seconds - 0.01, t + ((i / (n - 1)) * 2 - 1) * win)));
    acc.x += b.x / n;
    acc.y += b.y / n;
    acc.w += b.w / n;
    acc.h += b.h / n;
  }
  return acc;
};

/** Keep any framing legal: clip covers the frame and the unusable rows stay below it. */
const legal = (tl: Talent, f: Framing): Framing => ({
  scale: f.scale,
  x: Math.min(0, Math.max(WIDTH - tl.w * f.scale, f.x)),
  y: Math.min(0, Math.max(HEIGHT - tl.usableBottom * f.scale, f.y)),
});

const timecode = (seconds: number, fps: number) => {
  const total = Math.max(0, Math.round(seconds * fps));
  const ff = total % fps;
  const s = Math.floor(total / fps);
  const p = (v: number) => String(v).padStart(2, "0");
  return `${p(Math.floor(s / 3600))}:${p(Math.floor(s / 60) % 60)}:${p(s % 60)}:${p(ff)}`;
};

// ---------------------------------------------------------------------------------------------------
// HUD pieces

/** One L-shaped corner mark. `dir` is which way the arms point (1 = right/down, -1 = left/up). */
const Corner: React.FC<{ x: number; y: number; dx: 1 | -1; dy: 1 | -1; arm: number; color: string; opacity: number; width?: number }> = ({
  x,
  y,
  dx,
  dy,
  arm,
  color,
  opacity,
  width = HUD.stroke,
}) => (
  <div
    style={{
      position: "absolute",
      left: dx > 0 ? x : x - arm,
      top: dy > 0 ? y : y - arm,
      width: arm,
      height: arm,
      opacity,
      borderColor: color,
      borderStyle: "solid",
      borderWidth: 0,
      [dy > 0 ? "borderTopWidth" : "borderBottomWidth"]: width,
      [dx > 0 ? "borderLeftWidth" : "borderRightWidth"]: width,
      filter: "drop-shadow(0 1px 4px rgba(7,11,26,0.5))",
    }}
  />
);

const Mono: React.FC<{ children: React.ReactNode; size?: number; weight?: 500 | 700; color?: string; style?: React.CSSProperties }> = ({
  children,
  size = 30,
  weight = 500,
  color = HUD.line,
  style,
}) => (
  <div
    style={{
      fontFamily: FONT_MONO,
      fontWeight: weight,
      fontSize: size,
      color,
      letterSpacing: 1,
      whiteSpace: "nowrap",
      textShadow: HUD.shadow,
      fontVariantNumeric: "tabular-nums",
      ...style,
    }}
  >
    {children}
  </div>
);

// ---------------------------------------------------------------------------------------------------

export const DigitalZoom: React.FC<DigitalZoomProps> = ({ talent = DEFAULT_TALENT, startAt = 0, zoom = 1.6, snapAt = 1.0 }) => {
  const { frame, fps, durationInFrames } = useEnvelope();
  const last = durationInFrames - 1;
  const t = startAt + frame / fps;
  const base = frameOnFace(talent);

  // ----- timeline (fps-relative; exits key off the end)
  const snap = Math.round(snapAt * fps);
  const snapLen = Math.max(3, Math.round(0.13 * fps));
  const outEnd = last - Math.round(0.2 * fps);
  const outStart = outEnd - Math.round(0.6 * fps);
  const hudExit = interpolate(frame, [last - Math.round(0.3 * fps), last], [0, 1], { ...clamp, easing: EASE.in });

  // zoom progress: snap in (fast, expo), ease out (slow) near the end
  const zIn = interpolate(frame, [snap, snap + snapLen], [0, 1], { ...clamp, easing: EASE.expoOut });
  const zOut = interpolate(frame, [outStart, outEnd], [0, 1], { ...clamp, easing: EASE.inOut });
  const zp = zIn * (1 - zOut);
  const creep = 1 + 0.03 * interpolate(frame, [snap + snapLen, outStart], [0, 1], { ...clamp, easing: EASE.inOut }) * (1 - zOut);
  const ratio = Math.exp(Math.log(zoom) * zp) * creep;

  // ----- camera: the smoothed face goes from where it sits in the wide shot to a fixed spot in the crop
  const sf = smoothFace(talent, t, 0.35);
  const a = { x: sf.x + sf.w / 2, y: sf.y + sf.h / 2 };
  const scale = base.scale * ratio;
  const o0 = { x: base.x + a.x * base.scale, y: base.y + a.y * base.scale };
  const target = { x: WIDTH / 2, y: HEIGHT * 0.47 };
  const op = Math.min(1, zp * 1.05);
  const o = { x: o0.x + (target.x - o0.x) * op, y: o0.y + (target.y - o0.y) * op };
  const cam = legal(talent, { scale, x: o.x - a.x * scale, y: o.y - a.y * scale });

  // ----- the snap artefact (resolves over ~7 frames); a light smear on the way out
  const d = frame - snap;
  const BLOCKS = [16, 11, 7, 5, 3, 2];
  const block = d >= 0 && d < BLOCKS.length ? BLOCKS[d] : 1;
  const glitch = d >= -1 ? interpolate(d, [-1, 0, 9], [0, 1, 0], { ...clamp, easing: EASE.out }) : 0;
  const zoomSpeed = (f: number) => {
    const r = (q: number) =>
      Math.log(Math.exp(Math.log(zoom) * interpolate(q, [snap, snap + snapLen], [0, 1], { ...clamp, easing: EASE.expoOut }) * (1 - interpolate(q, [outStart, outEnd], [0, 1], { ...clamp, easing: EASE.inOut }))));
    return Math.abs(r(f + 0.5) - r(f - 0.5));
  };
  // strong smear on the snap (hidden under the pixel blocks), only a hint on the slower move back out
  const smear = Math.min(70, zoomSpeed(frame) * 720 * (frame < outStart ? 0.9 : 0.18));
  // zoomBlur's centre is in GL texture space: y is measured from the BOTTOM of the source
  const faceUv: [number, number] = [a.x / talent.w, 1 - a.y / talent.h];
  const effects = [
    zoomBlur({ amount: Math.max(0.01, smear), center: faceUv, samples: 20, disabled: smear < 0.6 }),
    pixelate({ blockSize: block, disabled: block <= 1 }),
    chromaticAberration({ amount: Math.max(0.01, 10 * glitch), angle: 0, disabled: glitch < 0.03 }),
    scanlines({ amount: Math.max(0.01, 0.45 * glitch), spacing: 3, thickness: 1, offset: frame * 2, disabled: glitch < 0.03 }),
  ];
  const flash = d >= 0 ? interpolate(d, [0, 4], [0.22, 0], { ...clamp, easing: EASE.out }) : 0;

  // ----- HUD in (staggered), HUD out (fast, all together but slightly offset)
  const hudIn = (i: number) => springAt(frame, fps, Math.round(0.05 * fps) + i * 3, SPRING.smooth);
  const hudVis = (i: number) => hudIn(i) * (1 - hudExit);
  const cornerPush = (i: number) => (1 - hudIn(i)) * 40 + hudExit * 26;

  // focus brackets: hunt in from wide, overshoot, lock just before the snap; ride the face into the zoom and fade
  const lockAt = Math.max(Math.round(0.35 * fps), snap - Math.round(0.25 * fps));
  const hunt = springAt(frame, fps, Math.round(0.15 * fps), SPRING.bouncy);
  const lock = springAt(frame, fps, lockAt, SPRING.snappy);
  const fb = smoothFace(talent, t, 0.15);
  const fbox = { x: cam.x + fb.x * cam.scale, y: cam.y + fb.y * cam.scale, w: fb.w * cam.scale, h: fb.h * cam.scale };
  const spread = interpolate(hunt, [0, 1], [1.9, 1.12]) - 0.04 * lock + 0.05 * Math.max(0, 1 - Math.abs(frame - lockAt) / 3);
  const bw = fbox.w * spread;
  const bh = fbox.h * spread * 1.08;
  const bcx = fbox.x + fbox.w / 2;
  const bcy = fbox.y + fbox.h / 2 - fbox.h * 0.04;
  const bracketO = Math.min(1, hunt * 1.4) * (1 - interpolate(frame, [snap - 1, snap + 2], [0, 1], { ...clamp, easing: EASE.in }));
  const bracketCol = interpolateColors(lock, [0, 1], [HUD.line, HUD.lock]);
  const arm = Math.min(bw, bh) * 0.2;

  // zoom bar
  const zMax = Math.max(2, Math.ceil(zoom * 2) / 2);
  const barW = 520;
  const barX = (WIDTH - barW) / 2;
  const barY = 1585;
  const ind = barX + ((ratio - 1) / (zMax - 1)) * barW;
  const zoomed = zp > 0.5;
  const ticks = Math.round((zMax - 1) * 10);

  const recOn = Math.floor((frame / fps) * 2) % 2 === 0;
  const rise = (i: number) => (1 - hudIn(i)) * 18;

  return (
    <AbsoluteFill style={{ background: COLORS.ink, overflow: "hidden" }}>
      <TalentLayer talent={talent} layer="full" framing={cam} startAt={startAt} effects={effects} />
      <AbsoluteFill style={{ background: COLORS.white, opacity: flash, mixBlendMode: "soft-light" }} />

      {/* monitor texture while the HUD is up */}
      <AbsoluteFill
        style={{
          opacity: 0.5 * hudVis(0),
          backgroundImage: "repeating-linear-gradient(180deg, rgba(255,255,255,0.05) 0px, rgba(255,255,255,0.05) 1px, rgba(0,0,0,0) 1px, rgba(0,0,0,0) 4px)",
          mixBlendMode: "overlay",
        }}
      />

      {/* focus brackets on the face */}
      {bracketO > 0.01 ? (
        <>
          <Corner x={bcx - bw / 2} y={bcy - bh / 2} dx={1} dy={1} arm={arm} color={bracketCol} opacity={bracketO} />
          <Corner x={bcx + bw / 2} y={bcy - bh / 2} dx={-1} dy={1} arm={arm} color={bracketCol} opacity={bracketO} />
          <Corner x={bcx - bw / 2} y={bcy + bh / 2} dx={1} dy={-1} arm={arm} color={bracketCol} opacity={bracketO} />
          <Corner x={bcx + bw / 2} y={bcy + bh / 2} dx={-1} dy={-1} arm={arm} color={bracketCol} opacity={bracketO} />
          <div
            style={{
              position: "absolute",
              left: bcx - bw / 2,
              top: bcy - bh / 2 - 46,
              opacity: bracketO * lock,
              transform: `translateY(${(1 - lock) * 10}px)`,
            }}
          >
            <Mono size={24} weight={700} color={COLORS.ink} style={{ background: HUD.lock, padding: "3px 10px", borderRadius: 6, textShadow: "none" }}>
              AF · FACE
            </Mono>
          </div>
        </>
      ) : null}

      {/* viewfinder corners */}
      {(
        [
          [HUD.inset.x, HUD.inset.top, 1, 1],
          [WIDTH - HUD.inset.x, HUD.inset.top, -1, 1],
          [HUD.inset.x, HUD.inset.bottom, 1, -1],
          [WIDTH - HUD.inset.x, HUD.inset.bottom, -1, -1],
        ] as const
      ).map(([x, y, dx, dy], i) => (
        <Corner key={i} x={x - dx * cornerPush(i)} y={y - dy * cornerPush(i)} dx={dx} dy={dy} arm={84} color={HUD.line} opacity={0.9 * hudVis(i)} />
      ))}

      {/* top bar: REC + timecode | format + battery */}
      <div style={{ position: "absolute", left: HUD.inset.x + 34, top: HUD.inset.top + 30, display: "flex", alignItems: "center", gap: 16, opacity: hudVis(1), transform: `translateY(${rise(1)}px)` }}>
        <div style={{ width: 20, height: 20, borderRadius: 10, background: HUD.rec, opacity: recOn ? 1 : 0.25, boxShadow: `0 0 12px ${HUD.rec}` }} />
        <Mono weight={700}>REC</Mono>
        <Mono style={{ marginLeft: 8 }}>{timecode(t, fps)}</Mono>
      </div>
      <div
        style={{
          position: "absolute",
          right: HUD.inset.x + 34,
          top: HUD.inset.top + 30,
          display: "flex",
          alignItems: "center",
          gap: 18,
          opacity: hudVis(2),
          transform: `translateY(${rise(2)}px)`,
        }}
      >
        <Mono>4K · 30P</Mono>
        <div style={{ display: "flex", alignItems: "center" }}>
          <div style={{ width: 46, height: 24, border: `3px solid ${HUD.line}`, borderRadius: 5, padding: 3, boxSizing: "border-box", display: "flex", gap: 3 }}>
            {[0, 1, 2].map((k) => (
              <div key={k} style={{ flex: 1, background: HUD.line, borderRadius: 1 }} />
            ))}
          </div>
          <div style={{ width: 4, height: 10, background: HUD.line, borderRadius: 1, marginLeft: 2 }} />
        </div>
      </div>

      {/* zoom readout + bar */}
      <div
        style={{
          position: "absolute",
          left: 0,
          width: WIDTH,
          top: barY - 118,
          display: "flex",
          justifyContent: "center",
          alignItems: "baseline",
          gap: 14,
          opacity: hudVis(3),
          transform: `translateY(${rise(3)}px) scale(${1 + 0.08 * glitch})`,
        }}
      >
        <Mono size={26} color={zoomed ? HUD.lock : HUD.line} style={{ opacity: 0.85 }}>
          {zoomed ? "DIGITAL" : "ZOOM"}
        </Mono>
        <Mono size={64} weight={700} color={zoomed ? HUD.lock : HUD.line}>
          {(ratio / creep).toFixed(1)}×
        </Mono>
      </div>
      <div style={{ position: "absolute", left: 0, top: 0, opacity: hudVis(4), transform: `translateY(${rise(4)}px)` }}>
        {Array.from({ length: ticks + 1 }).map((_, i) => {
          const major = i % 5 === 0;
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: barX + (i / ticks) * barW - 1.5,
                top: barY - (major ? 14 : 8),
                width: 3,
                height: major ? 28 : 16,
                borderRadius: 2,
                background: HUD.line,
                opacity: major ? 0.95 : 0.55,
                boxShadow: HUD.shadow,
              }}
            />
          );
        })}
        <Mono size={24} style={{ position: "absolute", left: barX - 54, top: barY - 15 }}>
          W
        </Mono>
        <Mono size={24} style={{ position: "absolute", left: barX + barW + 30, top: barY - 15 }}>
          T
        </Mono>
        {/* indicator */}
        <div
          style={{
            position: "absolute",
            left: ind - 13,
            top: barY + 22,
            width: 0,
            height: 0,
            borderLeft: "13px solid transparent",
            borderRight: "13px solid transparent",
            borderBottom: `18px solid ${zoomed ? HUD.lock : HUD.line}`,
            filter: "drop-shadow(0 2px 6px rgba(7,11,26,0.5))",
          }}
        />
      </div>

      <Finish grade={COLORS.indigo} gradeOpacity={0.1} />
    </AbsoluteFill>
  );
};
