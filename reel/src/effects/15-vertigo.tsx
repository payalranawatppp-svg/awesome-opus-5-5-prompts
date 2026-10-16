/**
 * 15 Vertigo: a dolly zoom built from the clean plate and the cutout.
 *
 * The speaker (cutout) holds his size and place while the room (plate) shrinks around his face, as if the
 * camera pushed in while the lens zoomed out: the room stretches away. The room only ever SHRINKS from its
 * true framing, so the plate's soft inpaint (where the speaker was) stays hidden behind him; a scale-up
 * would spread that smudge around his outline. A small custom effect does the shrink inside the plate's
 * own canvas and clamps its edges outward, so the frame stays covered; depth-of-field blur and a light
 * radial zoom blur hide that edge stretch and sell the depth. The room cools and dims; the speaker picks up
 * a cool rim light. In the last few frames the room snaps back, so the shot hands over clean.
 */
import React from "react";
import { blur } from "@remotion/effects/blur";
import { zoomBlur } from "@remotion/effects/zoom-blur";
import { AbsoluteFill, Img, createEffect, interpolate, staticFile, type InteractivitySchema } from "remotion";
import {
  DEFAULT_TALENT,
  EASE,
  Finish,
  TalentLayer,
  clamp,
  frameOnFace,
  meanFace,
  useEnvelope,
  type EffectMeta,
  type Talent,
} from "./shared";
import { COLORS } from "../theme";

export const meta: EffectMeta = {
  n: 15,
  slug: "vertigo",
  name: "Vertigo",
  durationInFrames: 90,
  needs: ["cutout", "plate", "face"],
  what: "A dolly zoom: the speaker holds still while the room behind him stretches away, goes soft and cools, then snaps back.",
  bestFor: "A realisation or dramatic beat (\"and then it hit me\", \"that's when I knew\").",
  avoid: "Calm explainer passages, and more than once per video.",
};

export type VertigoProps = {
  talent?: Talent;
  /** seconds into the clip at the effect's first frame */
  startAt?: number;
  /** How far the room falls away: 0.32 means it shrinks to 68% of its size. Keep it <= 0.4. */
  depth?: number;
  /** Snap the room back over the last frames so the shot ends on the clean framing. */
  release?: boolean;
  /** Colour the room is pushed towards (and the speaker's rim light). */
  tint?: string;
};

// ---------------------------------------------------------------------------------------------------
// dollyScale(): shrink the source around (cx, cy) inside its own canvas, clamping the edges outward

type DollyParams = { readonly k: number; readonly cx: number; readonly cy: number };

const dollySchema = {
  k: { type: "number", min: 0.3, max: 1, step: 0.01, default: 1, description: "Scale", hiddenFromList: false },
  cx: { type: "number", min: 0, max: 1, step: 0.01, default: 0.5, description: "Centre x", hiddenFromList: false },
  cy: { type: "number", min: 0, max: 1, step: 0.01, default: 0.5, description: "Centre y", hiddenFromList: false },
} as const satisfies InteractivitySchema;

const dollyScale = createEffect<DollyParams, null>({
  type: "com.signalreach.dollyScale",
  label: "dollyScale()",
  documentationLink: null,
  backend: "2d",
  calculateKey: ({ k, cx, cy }) => `dolly-${k.toFixed(5)}-${cx.toFixed(4)}-${cy.toFixed(4)}`,
  setup: () => null,
  apply: ({ source, target, width: W, height: H, params }) => {
    const ctx = target.getContext("2d");
    if (!ctx) throw new Error("Could not get a 2D context for dollyScale().");
    const { k, cx, cy } = params;
    // Work from a rect inset by a few px: generated plates can carry dark/black edge columns, and the
    // clamp below would stretch them into bands.
    const e = 4;
    const sw = W - 2 * e;
    const sh = H - 2 * e;
    const l = cx * W * (1 - k) + k * e;
    const t = cy * H * (1 - k) + k * e;
    const r = l + k * sw;
    const b = t + k * sh;
    ctx.save();
    ctx.clearRect(0, 0, W, H);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    // clamp-to-edge: stretch the outermost rows/columns (and corner pixels) over the uncovered border
    const L = e;
    const T = e;
    const R = W - e - 1;
    const B = H - e - 1;
    ctx.drawImage(source, L, T, sw, 1, l, 0, r - l, t + 1);
    ctx.drawImage(source, L, B, sw, 1, l, b - 1, r - l, H - b + 1);
    ctx.drawImage(source, L, T, 1, sh, 0, t, l + 1, b - t);
    ctx.drawImage(source, R, T, 1, sh, r - 1, t, W - r + 1, b - t);
    ctx.drawImage(source, L, T, 1, 1, 0, 0, l + 1, t + 1);
    ctx.drawImage(source, R, T, 1, 1, r - 1, 0, W - r + 1, t + 1);
    ctx.drawImage(source, L, B, 1, 1, 0, b - 1, l + 1, H - b + 1);
    ctx.drawImage(source, R, B, 1, 1, r - 1, b - 1, W - r + 1, H - b + 1);
    ctx.drawImage(source, L, T, sw, sh, l, t, r - l, b - t);
    ctx.restore();
  },
  cleanup: () => undefined,
  schema: dollySchema,
  validateParams: ({ k, cx, cy }) => {
    if (![k, cx, cy].every((v) => typeof v === "number" && Number.isFinite(v))) throw new TypeError("k, cx, cy must be finite numbers");
    if (k <= 0 || k > 1) throw new TypeError("k must be in (0, 1]");
  },
});

// ---------------------------------------------------------------------------------------------------

export const Vertigo: React.FC<VertigoProps> = ({ talent = DEFAULT_TALENT, startAt = 0, depth = 0.32, release = true, tint = COLORS.cyan }) => {
  const { frame, fps, durationInFrames } = useEnvelope();
  const framing = frameOnFace(talent);
  const last = durationInFrames - 1;

  // Timeline: a beat of stillness, the long dolly, a held breath, then (optionally) the snap back
  const dollyStart = Math.round(0.2 * fps);
  const releaseLen = release ? Math.round(0.3 * fps) : 0;
  const dollyEnd = release ? last - releaseLen - Math.round(0.15 * fps) : last - Math.round(0.1 * fps);
  const pAt = (f: number) => {
    const t = interpolate(f, [dollyStart, dollyEnd], [0, 1], { ...clamp, easing: EASE.inOut });
    const r = release ? interpolate(f, [last - releaseLen, last], [0, 1], { ...clamp, easing: EASE.inOut }) : 0;
    return t * (1 - r);
  };
  const p = pAt(frame);

  // Room scale (log-space, so the fall-off feels even) and its speed for the radial blur
  const kAt = (q: number) => Math.exp(Math.log(1 - depth) * q);
  const k = kAt(p);
  const speed = Math.abs(Math.log(kAt(pAt(frame + 0.5))) - Math.log(kAt(pAt(frame - 0.5))));

  // Vanishing point: the speaker's mean face centre (source px -> plate UV)
  const face = meanFace(talent);
  const cx = (face.x + face.w / 2) / talent.w;
  const cy = (face.y + face.h / 2) / talent.h;

  const dof = 7 * Math.pow(p, 1.3); // plate px (x2 on screen)
  const zoom = Math.min(60, speed * 720 * 2.4);
  const effects = [
    dollyScale({ k, cx, cy }),
    blur({ radius: Math.max(0.01, dof), disabled: dof < 0.05 }),
    // zoomBlur's centre is in GL texture space: y is measured from the BOTTOM of the source
    zoomBlur({ amount: Math.max(0.01, zoom), center: [cx, 1 - cy], samples: 24, disabled: zoom < 0.5 }),
  ];

  // The speaker barely breathes (a 2% push over the move) so the frame never feels frozen
  const push = 1 + 0.02 * p;
  const faceOut = { x: framing.x + (face.x + face.w / 2) * framing.scale, y: framing.y + (face.y + face.h / 2) * framing.scale };
  const speaker = {
    scale: framing.scale * push,
    x: faceOut.x + (framing.x - faceOut.x) * push,
    y: faceOut.y + (framing.y - faceOut.y) * push,
  };

  // Grade: the room cools and dims, the speaker gets a cool rim
  const roomFilter = `saturate(${1 - 0.3 * p}) brightness(${1 - 0.16 * p}) contrast(${1 + 0.06 * p})`;
  const rimO = interpolate(p, [0.2, 1], [0, 0.24], { ...clamp, easing: EASE.out });

  return (
    <AbsoluteFill style={{ background: COLORS.ink }}>
      {/* room */}
      <Img
        src={staticFile(talent.plate)}
        effects={effects}
        style={{
          position: "absolute",
          left: framing.x,
          top: framing.y,
          width: talent.w * framing.scale,
          height: talent.h * framing.scale,
          filter: roomFilter,
        }}
      />
      <AbsoluteFill style={{ backgroundColor: tint, mixBlendMode: "soft-light", opacity: 0.32 * p }} />
      <AbsoluteFill
        style={{
          opacity: p,
          background: `radial-gradient(ellipse 75% 60% at ${(faceOut.x / 1080) * 100}% ${(faceOut.y / 1920) * 100}%, rgba(7,11,26,0) 35%, rgba(7,11,26,0.55) 100%)`,
        }}
      />

      {/* speaker: same size, same place */}
      <TalentLayer
        talent={talent}
        layer="cutout"
        framing={speaker}
        startAt={startAt}
        style={{ filter: rimO > 0.01 ? `drop-shadow(0 0 30px ${tint}${alpha(rimO)})` : undefined }}
      />

      <Finish grade={COLORS.indigo} gradeOpacity={0.08 + 0.12 * p} />
    </AbsoluteFill>
  );
};

/** 0..1 -> two hex digits for an #RRGGBBAA colour */
const alpha = (a: number) =>
  Math.round(Math.max(0, Math.min(1, a)) * 255)
    .toString(16)
    .padStart(2, "0");
