/**
 * Kawasaki logo reveal, 2 s, 4K vertical (2160x3840, 60 fps), after the user's 1.2 s reference clip (green emblem
 * glowing in on black with sparkles). Improvised: neon flicker-on with a 3D swing, spark burst and shockwave on the bass
 * hit, the wordmark wiping in with a glowing edge, a light sweep across the emblem, rising embers, slow push-in.
 * Emblem vectorised (potrace) from the clean logo the user supplied: public/kaw/emblem.svg, rendered to emblem-alpha.png;
 * the wordmark is set in a heavy typeface.
 * Sound: the reference's own audio with an ElevenLabs sound-effects tail (bass boom and engine rev), public/kaw/kawasaki-2s.wav.
 */
import React from "react";
import { AbsoluteFill, Audio, interpolate, random, spring, staticFile, useCurrentFrame } from "remotion";
import { FontGate } from "../effects";
import { FONT_UI } from "../theme";

export const KAW_W = 2160;
export const KAW_H = 3840;
export const KAW_FPS = 60;
export const KAW_DURATION = 120;

const G1 = "#3DFF7A";
const G2 = "#00C247";
const G3 = "#056B26";
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const HIT = 36; // bass hit (0.6 s)
const EMB_W = 1180;
const EMB_H = EMB_W; // square emblem, vectorised from the user's clean logo (public/kaw/emblem.svg)

/** Neon flicker: on/off pattern while the tube warms up, then steady. */
const flicker = (f: number) => {
  const seq: [number, number][] = [[6, 0], [8, 0.9], [10, 0.1], [13, 1], [15, 0.25], [17, 0.85], [19, 0.4], [22, 1]];
  if (f < 6) return 0;
  for (let i = seq.length - 1; i >= 0; i--) if (f >= seq[i][0]) return seq[i][1];
  return 0;
};

const Embers: React.FC<{ f: number }> = ({ f }) => (
  <>
    {Array.from({ length: 70 }).map((_, i) => {
      const x = random(`x${i}`) * KAW_W;
      const speed = 6 + random(`s${i}`) * 14;
      const y = KAW_H * (0.35 + random(`y${i}`) * 0.7) - f * speed;
      const size = 3 + random(`r${i}`) * 9;
      const tw = 0.4 + 0.6 * Math.abs(Math.sin(f / (5 + random(`t${i}`) * 9) + i));
      const o = interpolate(f, [10, 30], [0, 1], clamp) * tw * (0.25 + random(`o${i}`) * 0.6);
      return <div key={i} style={{ position: "absolute", left: x + Math.sin(f / 14 + i) * 20, top: y, width: size, height: size, borderRadius: size, background: i % 5 ? G1 : "#E9FFF0", opacity: o, boxShadow: `0 0 ${size * 4}px ${G1}` }} />;
    })}
  </>
);

/** Spark burst on the hit. */
const Sparks: React.FC<{ f: number; cx: number; cy: number }> = ({ f, cx, cy }) => {
  if (f < HIT) return null;
  const t = f - HIT;
  return (
    <>
      {Array.from({ length: 46 }).map((_, i) => {
        const ang = random(`a${i}`) * Math.PI * 2;
        const v = 30 + random(`v${i}`) * 55;
        const d = v * t * (1 - t / 90);
        const len = 30 + random(`l${i}`) * 90;
        const o = interpolate(t, [0, 3, 26 + random(`d${i}`) * 20], [0, 1, 0], clamp);
        return <div key={i} style={{ position: "absolute", left: cx + Math.cos(ang) * d, top: cy + Math.sin(ang) * d + t * t * 0.25, width: len, height: 5, borderRadius: 5, background: `linear-gradient(90deg, transparent, ${i % 3 ? G1 : "#FFFFFF"})`, transform: `rotate(${ang}rad)`, transformOrigin: "0 50%", opacity: o, boxShadow: `0 0 18px ${G1}` }} />;
      })}
    </>
  );
};

export const KawasakiReveal: React.FC = () => {
  const f = useCurrentFrame();
  const on = flicker(f);
  const swing = spring({ frame: f - 6, fps: KAW_FPS, config: { damping: 16, stiffness: 70 } });
  const hit = f >= HIT ? Math.exp(-(f - HIT) / 7) : 0;
  const push = 1 + 0.07 * (f / KAW_DURATION);
  const shake = hit * 14;
  const sx = Math.sin(f * 2.3) * shake, sy = Math.cos(f * 1.7) * shake;
  const cx = KAW_W / 2, cy = 1580;
  const sweep = interpolate(f, [58, 96], [-0.6, 1.6], clamp);
  const wordWipe = interpolate(f, [44, 74], [0, 1], { ...clamp, easing: (t) => 1 - Math.pow(1 - t, 3) });
  const wordRise = spring({ frame: f - 42, fps: KAW_FPS, config: { damping: 18, stiffness: 90 } });
  const ring = f >= HIT ? (f - HIT) / 40 : -1;
  const breathe = 0.85 + 0.15 * Math.sin(f / 9);
  const glow = (on * (0.75 + 0.6 * hit)) * breathe;
  const fill = `linear-gradient(160deg, ${G1} 0%, ${G2} 45%, ${G3} 100%)`;

  return (
    <FontGate>
      <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
        {/* green haze behind the emblem */}
        <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 41%, rgba(0,194,71,${0.22 * on + 0.25 * hit}) 0%, rgba(0,60,20,${0.12 * on}) 28%, transparent 55%)` }} />
        <AbsoluteFill style={{ transform: `translate(${sx}px, ${sy}px) scale(${push})`, transformOrigin: `50% 45%` }}>
          <Embers f={f} />
          {/* shockwave ring */}
          {ring >= 0 && ring < 1 && (
            <div style={{ position: "absolute", left: cx - 900 * ring - 200, top: cy - 900 * ring - 200, width: (900 * ring + 200) * 2, height: (900 * ring + 200) * 2, borderRadius: "50%", border: `${18 * (1 - ring)}px solid ${G1}`, opacity: (1 - ring) * 0.55, boxShadow: `0 0 80px ${G1}, inset 0 0 80px ${G1}` }} />
          )}
          {/* emblem: neon flicker-on with a 3D swing */}
          <div style={{ position: "absolute", left: cx - EMB_W / 2, top: cy - EMB_H / 2, width: EMB_W, height: EMB_H, perspective: 2400 }}>
            <div style={{ position: "absolute", inset: 0, transform: `rotateY(${(1 - swing) * 38}deg) rotateX(${(1 - swing) * -10}deg) scale(${0.84 + 0.16 * swing + 0.03 * hit})`, filter: `drop-shadow(0 0 ${40 * glow}px ${G1}) drop-shadow(0 0 ${120 * glow}px ${G2})`, opacity: on }}>
              <div style={{ position: "absolute", inset: 0, WebkitMaskImage: `url(${staticFile("kaw/emblem-alpha.png")})`, WebkitMaskSize: "100% 100%", maskImage: `url(${staticFile("kaw/emblem-alpha.png")})`, maskSize: "100% 100%", background: fill }}>
                {/* specular light sweep */}
                <div style={{ position: "absolute", inset: 0, background: `linear-gradient(115deg, transparent ${(sweep - 0.12) * 100}%, rgba(230,255,240,0.95) ${sweep * 100}%, transparent ${(sweep + 0.12) * 100}%)`, mixBlendMode: "screen" }} />
                {/* subtle inner texture */}
                <div style={{ position: "absolute", inset: 0, opacity: 0.18, mixBlendMode: "overlay", backgroundImage: "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='600' height='600'><filter id='n'><feTurbulence baseFrequency='0.012' numOctaves='3' seed='4'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")", backgroundSize: "600px 600px" }} />
              </div>
            </div>
          </div>
          <Sparks f={f} cx={cx} cy={cy} />
          {/* wordmark: wipes in left to right with a glowing edge */}
          <div style={{ position: "absolute", left: 0, right: 0, top: cy + EMB_H / 2 + 120 + (1 - wordRise) * 80, display: "flex", justifyContent: "center" }}>
            <svg width={1900} height={520} viewBox="0 0 1900 520" style={{ overflow: "visible", clipPath: `inset(-200px ${(1 - wordWipe) * 100}% -200px -200px)` }}>
              <defs>
                <linearGradient id="kawFill" x1="0" y1="0" x2="0.35" y2="1"><stop offset="0" stopColor={G1} /><stop offset="0.5" stopColor={G2} /><stop offset="1" stopColor={G3} /></linearGradient>
                <filter id="kawGlow" x="-30%" y="-60%" width="160%" height="220%">
                  <feGaussianBlur in="SourceAlpha" stdDeviation={14 + 10 * hit} result="b1" />
                  <feGaussianBlur in="SourceAlpha" stdDeviation={45} result="b2" />
                  <feFlood floodColor={G1} floodOpacity={0.9 * on} /><feComposite in2="b1" operator="in" result="g1" />
                  <feFlood floodColor={G2} floodOpacity={0.6 * on} /><feComposite in2="b2" operator="in" result="g2" />
                  <feMerge><feMergeNode in="g2" /><feMergeNode in="g1" /><feMergeNode in="SourceGraphic" /></feMerge>
                </filter>
              </defs>
              <text x="950" y="400" textAnchor="middle" fontFamily={FONT_UI} fontWeight={800} fontSize={350} letterSpacing="-3" fill="url(#kawFill)" filter="url(#kawGlow)">Kawasaki</text>
            </svg>
            {wordWipe > 0 && wordWipe < 1 && (
              <div style={{ position: "absolute", left: `calc(50% - 900px + ${wordWipe * 1800}px)`, top: -40, width: 16, height: 480, borderRadius: 16, background: "#EFFFF4", boxShadow: `0 0 60px 20px ${G1}`, opacity: Math.sin(wordWipe * Math.PI) }} />
            )}
          </div>
        </AbsoluteFill>
        {/* flash on the hit, vignette, grain */}
        <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 41%, rgba(160,255,190,${0.35 * hit}) 0%, transparent 45%)`, mixBlendMode: "screen" }} />
        <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 45%, transparent 45%, rgba(0,0,0,0.75) 100%)" }} />
        <AbsoluteFill style={{ opacity: 0.07, mixBlendMode: "overlay", backgroundImage: "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='300' height='300'><filter id='g'><feTurbulence baseFrequency='0.9' numOctaves='2' seed='" + (f % 7) + "'/></filter><rect width='100%' height='100%' filter='url(%23g)'/></svg>\")" }} />
        <Audio src={staticFile("kaw/kawasaki-2s.wav")} />
      </AbsoluteFill>
    </FontGate>
  );
};
