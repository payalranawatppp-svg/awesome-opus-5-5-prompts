/**
 * Kawasaki logo flip, 5 s, 4K vertical (2160x3840, 60 fps), after the user's 1.2 s reference clip: the emblem and the
 * wordmark turn together in 3D around the vertical axis, zooming in and brightening as they face the camera. Improvised:
 * the logo is a solid 3D badge (extruded layers) that spins in about one and a half turns with motion blur, lands front
 * on the bass hit (spark burst, shockwave, flash, camera shake), then sways gently under a light sweep with rising embers.
 * Emblem vectorised (potrace) from the clean logo the user supplied: public/kaw/emblem.svg, rendered to
 * emblem-alpha.png; the wordmark is set in a heavy typeface.
 * Sound: the reference's own audio with an ElevenLabs sound-effects tail (bass boom and engine rev) and an
 * ElevenLabs engine-rumble bed under the hold, public/kaw/kawasaki-5s.wav. The landing sits on the sub-bass drop at 0.88 s
 * and the showcase turn on the thud at 2.33 s (both measured with earshot timeline).
 */
import React from "react";
import { AbsoluteFill, Audio, interpolate, random, staticFile, useCurrentFrame } from "remotion";
import { FontGate } from "../effects";
import { FONT_UI } from "../theme";

export const KAW_W = 2160;
export const KAW_H = 3840;
export const KAW_FPS = 60;
export const KAW_DURATION = 300; // 5 s

const G1 = "#3DFF7A";
const G2 = "#00C247";
const G3 = "#056B26";
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const HIT = 53; // the flip lands on the sub-bass drop (0.88 s, measured with earshot timeline)
const TURN = 140; // showcase turn starts on the heavy thud at 2.33 s
const FADE = 272; // fade to black
const EMB = 1120; // emblem size (square)
const BOX_W = 1900; // badge width (the wordmark is wider than the emblem)
const DEPTH = 16; // extrusion layers
const STEP = 5; // px between layers
const LOGO_H = EMB + 120 + 420; // emblem + gap + wordmark

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
const easeOutBack = (t: number) => { const c = 1.25; return 1 + (c + 1) * Math.pow(t - 1, 3) + c * Math.pow(t - 1, 2); };

/** Flip angle (deg): one and a half turns, landing front-on at HIT with a small overshoot, then a gentle sway. */
const flipAngle = (f: number) => {
  if (f <= 4) return -540;
  if (f < HIT) return -540 + 540 * easeOutBack((f - 4) / (HIT - 4));
  const sway = 6 * Math.sin((f - HIT) / 22) * Math.exp(-(f - HIT) / 80);
  // one slow showcase turn out and back, easing in and out
  const t = Math.min(1, Math.max(0, (f - TURN) / 120));
  return sway + 28 * Math.sin(Math.PI * 2 * t) * Math.sin(Math.PI * t);
};

const Embers: React.FC<{ f: number }> = ({ f }) => (
  <>
    {Array.from({ length: 70 }).map((_, i) => {
      const x = random(`x${i}`) * KAW_W;
      const speed = 6 + random(`s${i}`) * 14;
      const y = KAW_H * 1.05 - ((KAW_H * (0.7 * random(`y${i}`) + 0.35) * 1 + f * speed) % (KAW_H * 1.15));
      const size = 3 + random(`r${i}`) * 9;
      const tw = 0.4 + 0.6 * Math.abs(Math.sin(f / (5 + random(`t${i}`) * 9) + i));
      const o = interpolate(f, [8, 30], [0, 1], clamp) * tw * (0.25 + random(`o${i}`) * 0.6);
      return <div key={i} style={{ position: "absolute", left: x + Math.sin(f / 14 + i) * 20, top: y, width: size, height: size, borderRadius: size, background: i % 5 ? G1 : "#E9FFF0", opacity: o * 0.7, boxShadow: `0 0 ${size * 1.5}px ${G1}` }} />;
    })}
  </>
);

const Sparks: React.FC<{ f: number; cx: number; cy: number }> = ({ f, cx, cy }) => {
  if (f < HIT) return null;
  const t = f - HIT;
  return (
    <>
      {Array.from({ length: 50 }).map((_, i) => {
        const ang = random(`a${i}`) * Math.PI * 2;
        const v = 34 + random(`v${i}`) * 60;
        const d = 560 + v * t * (1 - t / 90);
        const len = 30 + random(`l${i}`) * 100;
        const o = interpolate(t, [0, 3, 24 + random(`d${i}`) * 22], [0, 1, 0], clamp);
        return <div key={i} style={{ position: "absolute", left: cx + Math.cos(ang) * d, top: cy + Math.sin(ang) * d + t * t * 0.25, width: len, height: 5, borderRadius: 5, background: `linear-gradient(90deg, transparent, ${i % 3 ? G1 : "#FFFFFF"})`, transform: `rotate(${ang}rad)`, transformOrigin: "0 50%", opacity: o * 0.8, boxShadow: `0 0 6px ${G1}` }} />;
      })}
    </>
  );
};

/** One layer of the badge: emblem + wordmark, filled with `fill` (a CSS background). Only the front layer glows. */
const Layer: React.FC<{ fill: string; z: number; front?: boolean; glow?: number; sweep?: number }> = ({ fill, z, front, glow = 0, sweep = -1 }) => (
  <div style={{ position: "absolute", left: 0, top: 0, width: BOX_W, height: LOGO_H, transform: `translateZ(${z}px)` }}>
    <div style={{ position: "absolute", left: (BOX_W - EMB) / 2, top: 0, width: EMB, height: EMB, filter: front ? `drop-shadow(0 0 ${14 * glow}px ${G1}) drop-shadow(0 0 ${40 * glow}px ${G2})` : undefined }}>
      <div style={{ position: "absolute", inset: 0, WebkitMaskImage: `url(${staticFile("kaw/emblem-alpha.png")})`, WebkitMaskSize: "100% 100%", maskImage: `url(${staticFile("kaw/emblem-alpha.png")})`, maskSize: "100% 100%", background: fill }}>
        {front && <div style={{ position: "absolute", inset: 0, background: `linear-gradient(115deg, transparent ${(sweep - 0.12) * 100}%, rgba(230,255,240,0.95) ${sweep * 100}%, transparent ${(sweep + 0.12) * 100}%)`, mixBlendMode: "screen" }} />}
      </div>
    </div>
    <div style={{ position: "absolute", left: 0, width: BOX_W, top: EMB + 110, textAlign: "center", fontFamily: FONT_UI, fontWeight: 800, fontSize: 330, letterSpacing: "-0.01em", lineHeight: 1.15, backgroundImage: fill, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent", filter: front ? `drop-shadow(0 0 ${8 * glow}px ${G1}) drop-shadow(0 0 ${22 * glow}px ${G2})` : undefined }}>Kawasaki</div>
  </div>
);

export const KawasakiReveal: React.FC = () => {
  const f = useCurrentFrame();
  const angle = flipAngle(f);
  const spinV = Math.abs(angle - flipAngle(f - 1)); // deg per frame, for motion blur
  const facing = Math.abs(Math.cos((angle * Math.PI) / 180));
  const appear = interpolate(f, [2, 10], [0, 1], clamp) * interpolate(f, [FADE, KAW_DURATION - 2], [1, 0], clamp);
  const hit = f >= HIT ? Math.exp(-(f - HIT) / 7) : 0;
  const zoom = interpolate(f, [4, HIT], [0.62, 1], { ...clamp, easing: easeOutCubic }) + 0.08 * (f / KAW_DURATION) + 0.03 * hit;
  const tiltZ = interpolate(f, [4, HIT], [-9, 0], { ...clamp, easing: easeOutCubic });
  const tiltX = interpolate(f, [4, HIT], [10, 0], { ...clamp, easing: easeOutCubic });
  const shake = hit * 14;
  const sx = Math.sin(f * 2.3) * shake, sy = Math.cos(f * 1.7) * shake;
  const cx = KAW_W / 2, cy = 1540;
  const sweep = f < 150 ? interpolate(f, [HIT + 20, HIT + 60], [-0.6, 1.6], clamp) : interpolate(f, [195, 240], [-0.6, 1.6], clamp);
  const ring = f >= HIT ? (f - HIT) / 40 : -1;
  const breathe = 0.92 + 0.08 * Math.sin(f / 9);
  const light = appear * (0.35 + 0.65 * facing); // brighter as it faces the camera, as in the reference
  const glow = light * (0.6 + 0.35 * hit) * breathe;
  const front = `linear-gradient(160deg, ${G1} 0%, ${G2} 45%, ${G3} 100%)`;
  const blur = Math.min(10, spinV * 0.25);

  return (
    <FontGate>
      <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
        <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 40%, rgba(0,194,71,${0.08 * light + 0.1 * hit}) 0%, rgba(0,60,20,${0.05 * light}) 28%, transparent 55%)` }} />
        <AbsoluteFill style={{ transform: `translate(${sx}px, ${sy}px)` }}>
          <Embers f={f} />
          {ring >= 0 && ring < 1 && (
            <div style={{ position: "absolute", left: cx - 900 * ring - 260, top: cy - 900 * ring - 260, width: (900 * ring + 260) * 2, height: (900 * ring + 260) * 2, borderRadius: "50%", border: `${18 * (1 - ring)}px solid ${G1}`, opacity: (1 - ring) * 0.35, boxShadow: `0 0 24px ${G1}, inset 0 0 24px ${G1}` }} />
          )}
          {/* the badge: emblem + wordmark, extruded, flipping in 3D */}
          <div style={{ position: "absolute", left: cx - BOX_W / 2, top: cy - EMB / 2, width: BOX_W, height: LOGO_H, perspective: 3200, perspectiveOrigin: `50% ${EMB / 2}px`, opacity: appear, filter: `brightness(${0.55 + 0.45 * facing})${blur > 0.4 ? ` blur(${blur.toFixed(1)}px)` : ""}` }}>
            <div style={{ position: "absolute", inset: 0, transformStyle: "preserve-3d", transformOrigin: `50% ${EMB / 2}px`, transform: `scale(${zoom}) rotateZ(${tiltZ}deg) rotateX(${tiltX}deg) rotateY(${angle}deg)` }}>
              {Array.from({ length: DEPTH }).map((_, k) => {
                const shade = 0.3 + 0.4 * (k / DEPTH);
                return <Layer key={k} z={-(DEPTH - k) * STEP} fill={`linear-gradient(160deg, rgba(20,150,64,${shade}) 0%, rgba(4,64,26,${Math.min(1, shade + 0.3)}) 100%)`} />;
              })}
              <Layer z={0} front fill={front} glow={glow} sweep={sweep} />
            </div>
          </div>
          <Sparks f={f} cx={cx} cy={cy} />
        </AbsoluteFill>
        <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 40%, rgba(160,255,190,${0.14 * hit}) 0%, transparent 40%)`, mixBlendMode: "screen" }} />
        <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 45%, transparent 45%, rgba(0,0,0,0.75) 100%)" }} />
        <AbsoluteFill style={{ opacity: 0.07, mixBlendMode: "overlay", backgroundImage: "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='300' height='300'><filter id='g'><feTurbulence baseFrequency='0.9' numOctaves='2' seed='" + (f % 7) + "'/></filter><rect width='100%' height='100%' filter='url(%23g)'/></svg>\")" }} />
        <AbsoluteFill style={{ background: "#000", opacity: interpolate(f, [FADE, KAW_DURATION - 1], [0, 1], clamp) }} />
        <Audio src={staticFile("kaw/kawasaki-5s.wav")} />
      </AbsoluteFill>
    </FontGate>
  );
};
