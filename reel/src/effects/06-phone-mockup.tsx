import React from "react";
import { AbsoluteFill, interpolate, spring } from "remotion";
import { ChatIcon, PlaneIcon } from "../components/kit";
import { COLORS, FONT_DISPLAY, FONT_UI, HEIGHT, WIDTH } from "../theme";
import {
  DEFAULT_TALENT,
  EASE,
  Finish,
  SPRING,
  TalentLayer,
  clamp,
  float,
  meanFace,
  rampAt,
  springAt,
  useEnvelope,
  type EffectMeta,
  type Framing,
  type Talent,
} from "./shared";

export const meta: EffectMeta = {
  n: 6,
  slug: "phone-mockup",
  name: "Phone mockup",
  durationInFrames: 90,
  needs: [],
  what: "A 3D phone tilts up into frame over the blurred, darkened clip and plays the clip as a Reel (progress bar, action rail, caption, double-tap heart); it drops away at the end.",
  bestFor: "Showing a post, a reel, an app or a DM the way the viewer would see it on their own phone.",
  avoid: "Anything that needs reading at length; the screen is small.",
};

export type PhoneMockupProps = {
  talent?: Talent;
  /** seconds into the clip at the effect's first frame */
  startAt?: number;
  /** anything to show on the screen instead of the clip + Reel UI (fills a 518x1154 px screen) */
  screen?: React.ReactNode;
  /** show the Reel-style UI over the clip (ignored when `screen` is given) */
  ui?: boolean;
  handle?: string;
  /** avatar initials */
  initials?: string;
  caption?: string;
  likes?: number;
  comments?: number;
  shares?: number;
};

// Phone hardware palette (local: titanium frame, glass, bezel).
const HW = {
  frameHi: "#8A8F9E",
  frameMid: "#4A4F5E",
  frameLo: "#1E212B",
  side: "#2A2E3A",
  sideDeep: "#14161D",
  bezel: "#050608",
  island: "#000000",
  lens: "#1A2340",
};

// Phone geometry, output px.
const PW = 560;
const PH = 1196;
const R = 92;
const RING = 8;
const INSET = 21;
const SW = PW - INSET * 2;
const SH = PH - INSET * 2;
const DEPTH = 24;
const LAYERS = 12;

const fmt = (n: number) => n.toLocaleString("en-US");
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** Full-frame framing led by the face, with the clip's unusable rows kept below the frame. */
const coverFraming = (tl: Talent, w: number, h: number, scale: number, faceY = 0.42): Framing => {
  const f = meanFace(tl);
  const cx = f.x + f.w / 2;
  const cy = f.y + f.h / 2;
  return {
    scale,
    x: Math.min(0, Math.max(w - tl.w * scale, w / 2 - cx * scale)),
    y: Math.min(0, Math.max(h - tl.usableBottom * scale, h * faceY - cy * scale)),
  };
};

// --- Small drawn icons (no emoji) -------------------------------------------------------------

const Heart: React.FC<{ size: number; fill?: string; stroke?: string; strokeWidth?: number }> = ({
  size,
  fill = "none",
  stroke = COLORS.white,
  strokeWidth = 7,
}) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill={fill} stroke={stroke} strokeWidth={strokeWidth} strokeLinejoin="round">
    <path d="M50 84C26 68 12 54 12 36a20 20 0 0 1 38-9 20 20 0 0 1 38 9c0 18-14 32-38 48z" />
  </svg>
);

const Bookmark: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" stroke={COLORS.white} strokeWidth={7} strokeLinejoin="round">
    <path d="M26 14h48v74L50 70 26 88z" />
  </svg>
);

const StatusIcons: React.FC = () => (
  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
    <svg width={30} height={20} viewBox="0 0 30 20">
      {[0, 1, 2, 3].map((i) => (
        <rect key={i} x={i * 7.5} y={14 - i * 4} width={5} height={6 + i * 4} rx={1.4} fill={COLORS.white} />
      ))}
    </svg>
    <svg width={26} height={20} viewBox="0 0 26 20" fill="none" stroke={COLORS.white} strokeWidth={2.6} strokeLinecap="round">
      <path d="M2 7a16 16 0 0 1 22 0M6 11a10 10 0 0 1 14 0M10 15a4 4 0 0 1 6 0" />
    </svg>
    <div style={{ width: 38, height: 19, borderRadius: 6, border: "2px solid rgba(255,255,255,0.55)", padding: 2, position: "relative" }}>
      <div style={{ width: "78%", height: "100%", borderRadius: 3, background: COLORS.white }} />
      <div style={{ position: "absolute", right: -6, top: 5, width: 3, height: 7, borderRadius: 2, background: "rgba(255,255,255,0.55)" }} />
    </div>
  </div>
);

// --- The default screen: the clip as a Reel ----------------------------------------------------

const ReelScreen: React.FC<{
  talent: Talent;
  startAt: number;
  ui: boolean;
  handle: string;
  initials: string;
  caption: string;
  likes: number;
  comments: number;
  shares: number;
  tapAt: number;
  uiIn: number;
}> = ({ talent, startAt, ui, handle, initials, caption, likes, comments, shares, tapAt, uiIn }) => {
  const { frame, fps } = useEnvelope();
  const framing = coverFraming(talent, SW, SH, 1.32, 0.38);
  const clipT = startAt + frame / fps;
  const progress = Math.min(1, clipT / talent.seconds);

  // Double-tap like: big heart pops, floats off; the rail heart fills and the count ticks.
  const tap = springAt(frame, fps, tapAt, SPRING.bouncy);
  const tapOut = rampAt(frame, tapAt + Math.round(0.55 * fps), Math.round(0.3 * fps), EASE.in);
  const liked = frame >= tapAt + 2;
  const railPop = springAt(frame, fps, tapAt + 2, SPRING.bouncy);
  const railScale = liked ? 0.6 + 0.4 * railPop : 1;

  const rail = [
    { icon: liked ? <Heart size={56} fill={COLORS.rose} stroke={COLORS.rose} /> : <Heart size={56} />, label: fmt(likes + (liked ? 1 : 0)), scale: railScale },
    { icon: <ChatIcon size={54} stroke={7} />, label: fmt(comments), scale: 1 },
    { icon: <PlaneIcon size={50} stroke={7} />, label: fmt(shares), scale: 1 },
    { icon: <Bookmark size={50} />, label: "", scale: 1 },
  ];
  const uiP = (i: number) => springAt(frame, fps, uiIn + i * 3, SPRING.snappy);

  return (
    <AbsoluteFill style={{ background: COLORS.ink }}>
      <TalentLayer talent={talent} layer="full" framing={framing} startAt={startAt} />
      {ui ? (
        <>
          <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.42) 0px, rgba(0,0,0,0) 210px)" }} />
          <AbsoluteFill style={{ background: `linear-gradient(0deg, rgba(4,6,16,0.78) 0px, rgba(4,6,16,0.35) 300px, rgba(4,6,16,0) 520px)` }} />

          {/* header */}
          <div
            style={{
              position: "absolute",
              left: 30,
              right: 30,
              top: 96,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              opacity: uiP(0),
              transform: `translateY(${(1 - uiP(0)) * -14}px)`,
            }}
          >
            <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: 34, color: COLORS.white, letterSpacing: -0.5 }}>Reels</div>
            <svg width={40} height={40} viewBox="0 0 100 100" fill="none" stroke={COLORS.white} strokeWidth={7} strokeLinejoin="round">
              <rect x="12" y="26" width="76" height="56" rx="14" />
              <circle cx="50" cy="54" r="15" />
              <path d="M36 26l6-10h16l6 10" />
            </svg>
          </div>

          {/* action rail */}
          <div style={{ position: "absolute", right: 18, bottom: 190, display: "flex", flexDirection: "column", alignItems: "center", gap: 26 }}>
            {rail.map((r, i) => {
              const p = uiP(i + 1);
              return (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 6,
                    opacity: p,
                    transform: `translateX(${(1 - p) * 30}px) scale(${r.scale})`,
                    filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.45))",
                  }}
                >
                  {r.icon}
                  {r.label ? (
                    <div style={{ fontFamily: FONT_UI, fontWeight: 600, fontSize: 20, color: COLORS.white, fontVariantNumeric: "tabular-nums" }}>{r.label}</div>
                  ) : null}
                </div>
              );
            })}
            <div
              style={{
                width: 46,
                height: 46,
                borderRadius: 12,
                border: "3px solid rgba(255,255,255,0.9)",
                background: `conic-gradient(from ${frame * 6}deg, ${COLORS.blue}, ${COLORS.violet}, ${COLORS.cyan}, ${COLORS.blue})`,
                opacity: uiP(5),
              }}
            />
          </div>

          {/* author, caption, audio */}
          <div style={{ position: "absolute", left: 26, right: 110, bottom: 54, display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14, opacity: uiP(2), transform: `translateY(${(1 - uiP(2)) * 18}px)` }}>
              <div
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: "50%",
                  padding: 3,
                  background: `linear-gradient(135deg, ${COLORS.cyan}, ${COLORS.violet})`,
                }}
              >
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    borderRadius: "50%",
                    background: COLORS.navy,
                    border: "2px solid #000",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: FONT_UI,
                    fontWeight: 800,
                    fontSize: 17,
                    color: COLORS.white,
                  }}
                >
                  {initials}
                </div>
              </div>
              <div style={{ fontFamily: FONT_UI, fontWeight: 700, fontSize: 24, color: COLORS.white, whiteSpace: "nowrap" }}>{handle}</div>
              <div
                style={{
                  fontFamily: FONT_UI,
                  fontWeight: 600,
                  fontSize: 19,
                  color: COLORS.white,
                  border: "1.5px solid rgba(255,255,255,0.75)",
                  borderRadius: 10,
                  padding: "5px 14px",
                }}
              >
                Follow
              </div>
            </div>
            <div
              style={{
                fontFamily: FONT_UI,
                fontWeight: 500,
                fontSize: 22,
                lineHeight: 1.35,
                color: COLORS.white,
                opacity: uiP(3),
                transform: `translateY(${(1 - uiP(3)) * 18}px)`,
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                textShadow: "0 1px 6px rgba(0,0,0,0.4)",
              }}
            >
              {caption}
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                fontFamily: FONT_UI,
                fontWeight: 500,
                fontSize: 19,
                color: "rgba(255,255,255,0.88)",
                opacity: uiP(4),
                transform: `translateY(${(1 - uiP(4)) * 18}px)`,
              }}
            >
              <svg width={20} height={20} viewBox="0 0 100 100" fill={COLORS.white}>
                <path d="M38 18l46-10v58a12 12 0 1 1-8-11V28L46 34v42a12 12 0 1 1-8-11z" />
              </svg>
              <span style={{ whiteSpace: "nowrap" }}>Original audio · {handle}</span>
            </div>
          </div>

          {/* progress bar */}
          <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 5, background: "rgba(255,255,255,0.25)" }}>
            <div style={{ width: `${progress * 100}%`, height: "100%", background: COLORS.white, borderRadius: "0 3px 3px 0" }} />
          </div>

          {/* double-tap heart */}
          {tap > 0.001 && tapOut < 1 ? (
            <div
              style={{
                position: "absolute",
                left: SW / 2 - 120,
                top: SH * 0.6 - 120,
                width: 240,
                height: 240,
                opacity: Math.min(1, tap * 1.5) * (1 - tapOut),
                transform: `translateY(${-90 * tapOut}px) rotate(${-22 + 14 * tap}deg) scale(${tap * (1 + 0.2 * tapOut)})`,
                filter: `drop-shadow(0 0 30px ${COLORS.rose}99) drop-shadow(0 10px 20px rgba(0,0,0,0.35))`,
              }}
            >
              <Heart size={240} fill={COLORS.rose} stroke={COLORS.rose} strokeWidth={2} />
            </div>
          ) : null}
        </>
      ) : null}
    </AbsoluteFill>
  );
};

// --- The phone -------------------------------------------------------------------------------------

export const PhoneMockup: React.FC<PhoneMockupProps> = ({
  talent = DEFAULT_TALENT,
  startAt = 0,
  screen,
  ui = true,
  handle = "signalreach",
  initials = "SR",
  caption = "Three useful posts a week and a reply to every comment. That's the whole system.",
  likes = 1284,
  comments = 86,
  shares = 41,
}) => {
  const { frame, fps, durationInFrames } = useEnvelope();

  const tIn = Math.round(0.12 * fps);
  const outLen = Math.round(0.34 * fps);
  const outAt = durationInFrames - outLen;
  const enter = frame < tIn ? 0 : spring({ frame: frame - tIn, fps, config: { damping: 15, stiffness: 80, mass: 1 } });
  const exit = interpolate(frame, [outAt, durationInFrames - 1], [0, 1], { ...clamp, easing: EASE.in });
  const settled = rampAt(frame, tIn + Math.round(0.9 * fps), Math.round(0.8 * fps), EASE.inOut) * (1 - exit);

  // Background: the clip itself, defocusing and dimming as the phone arrives (and back on exit).
  const bg = interpolate(frame, [tIn, tIn + Math.round(0.6 * fps)], [0, 1], { ...clamp, easing: EASE.inOut }) * (1 - interpolate(frame, [outAt + 2, durationInFrames - 1], [0, 1], { ...clamp, easing: EASE.inOut }));
  const full = coverFraming(talent, WIDTH, HEIGHT, 2.0);

  // 3D pose: rises from below, tilted, and settles into a gentle three-quarter view that drifts.
  // (enter is a spring, exit an eased ramp: mapped with plain arithmetic so the spring keeps its settle)
  const ty = lerp(1950, 0, enter) + 1750 * exit + float(frame, 8, 32) * settled;
  const rx = lerp(42, 8, enter) + 26 * exit + Math.sin(frame / 52) * 1.6 * settled;
  const ry = lerp(-40, -17, enter) + Math.sin(frame / 44) * 3.2 * settled;
  const rz = lerp(16, -4, enter) + 9 * exit + Math.sin(frame / 60) * 0.8 * settled;
  const prevEnter = frame - 1 < tIn ? 0 : spring({ frame: frame - 1 - tIn, fps, config: { damping: 15, stiffness: 80, mass: 1 } });
  const prevExit = interpolate(frame - 1, [outAt, durationInFrames - 1], [0, 1], { ...clamp, easing: EASE.in });
  const speedPx = Math.abs((enter - prevEnter) * 1950) + Math.abs((exit - prevExit) * 1750);
  const motionBlur = Math.min(5, Math.max(0, speedPx - 30) * 0.05);

  const glareShift = (ry + 15) * 6 + (rx - 8) * 3;
  const left = (WIDTH - PW) / 2;
  const top = (HEIGHT - PH) / 2 - 10;
  const tapAt = tIn + Math.round(1.25 * fps);

  return (
    <AbsoluteFill style={{ background: COLORS.ink, overflow: "hidden" }}>
      {/* 1. Background: blurred, darkened clip + brand light */}
      <TalentLayer
        talent={talent}
        layer="full"
        framing={full}
        startAt={startAt}
        style={{
          filter: `blur(${bg * 34}px) brightness(${1 - bg * 0.58}) saturate(${1 - bg * 0.15})`,
          transform: `scale(${1 + bg * 0.1})`,
          transformOrigin: "50% 40%",
        }}
      />
      <AbsoluteFill
        style={{
          opacity: bg,
          background: `radial-gradient(ellipse 760px 900px at 50% 48%, ${COLORS.blue}38, rgba(0,0,0,0) 70%), linear-gradient(180deg, rgba(7,11,26,0.35), rgba(7,11,26,0.1) 40%, rgba(7,11,26,0.55))`,
        }}
      />

      {/* 2. Contact shadow on the backdrop */}
      <div
        style={{
          position: "absolute",
          left: left + 70,
          top: top + 120,
          width: PW - 40,
          height: PH - 80,
          borderRadius: R,
          background: "rgba(2,3,10,0.85)",
          filter: "blur(60px)",
          opacity: 0.75 * enter * (1 - exit),
          transform: `translateY(${ty * 0.92 + 40}px) rotate(${rz}deg)`,
        }}
      />

      {/* 3. The phone (3D) */}
      <AbsoluteFill style={{ filter: motionBlur > 0.2 ? `blur(${motionBlur}px)` : undefined }}>
        <AbsoluteFill style={{ perspective: 2600, perspectiveOrigin: "50% 45%" }}>
          <div
            style={{
              position: "absolute",
              left,
              top,
              width: PW,
              height: PH,
              transformStyle: "preserve-3d",
              transform: `translateY(${ty}px) rotateX(${rx}deg) rotateY(${ry}deg) rotateZ(${rz}deg)`,
            }}
          >
            {/* body thickness: stacked slices behind the front face */}
            {Array.from({ length: LAYERS }).map((_, i) => {
              const z = -((i + 1) / LAYERS) * DEPTH;
              return (
                <div
                  key={i}
                  style={{
                    position: "absolute",
                    inset: 0,
                    borderRadius: R,
                    transform: `translateZ(${z}px)`,
                    background: i === LAYERS - 1 ? HW.sideDeep : `linear-gradient(90deg, ${HW.frameLo}, ${HW.side} 50%, ${HW.frameLo})`,
                  }}
                />
              );
            })}
            {/* side buttons, half-way through the body */}
            <div style={{ position: "absolute", inset: 0, transform: `translateZ(${-DEPTH / 2}px)` }}>
              {[
                { side: "left", y: 230, h: 56 },
                { side: "left", y: 320, h: 104 },
                { side: "left", y: 444, h: 104 },
                { side: "right", y: 360, h: 160 },
              ].map((b, i) => (
                <div
                  key={i}
                  style={{
                    position: "absolute",
                    top: b.y,
                    height: b.h,
                    width: 10,
                    [b.side]: -6,
                    borderRadius: 4,
                    background: `linear-gradient(90deg, ${HW.frameLo}, ${HW.frameHi}, ${HW.frameLo})`,
                  } as React.CSSProperties}
                />
              ))}
            </div>
            {/* front: titanium ring, bezel, screen */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                borderRadius: R,
                background: `linear-gradient(${135 + ry}deg, ${HW.frameHi} 0%, ${HW.frameMid} 22%, ${HW.frameLo} 50%, ${HW.frameMid} 78%, ${HW.frameHi} 100%)`,
                boxShadow: "inset 0 0 0 1.5px rgba(255,255,255,0.18)",
              }}
            >
              <div style={{ position: "absolute", inset: RING, borderRadius: R - RING, background: HW.bezel }} />
              <div
                style={{
                  position: "absolute",
                  left: INSET,
                  top: INSET,
                  width: SW,
                  height: SH,
                  borderRadius: R - INSET + 2,
                  overflow: "hidden",
                  background: COLORS.ink,
                }}
              >
                {screen ?? (
                  <ReelScreen
                    talent={talent}
                    startAt={startAt}
                    ui={ui}
                    handle={handle}
                    initials={initials}
                    caption={caption}
                    likes={likes}
                    comments={comments}
                    shares={shares}
                    tapAt={tapAt}
                    uiIn={tIn + Math.round(0.45 * fps)}
                  />
                )}
                {/* status bar + dynamic island */}
                <div
                  style={{
                    position: "absolute",
                    left: 40,
                    right: 34,
                    top: 24,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    fontFamily: FONT_UI,
                    fontWeight: 600,
                    fontSize: 23,
                    color: COLORS.white,
                  }}
                >
                  <span>9:41</span>
                  <StatusIcons />
                </div>
                <div
                  style={{
                    position: "absolute",
                    left: SW / 2 - 78,
                    top: 18,
                    width: 156,
                    height: 44,
                    borderRadius: 22,
                    background: HW.island,
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      right: 16,
                      top: 13,
                      width: 18,
                      height: 18,
                      borderRadius: "50%",
                      background: `radial-gradient(circle at 35% 35%, #3B4A7A, ${HW.lens} 55%, #000 100%)`,
                    }}
                  />
                </div>
                {/* glass glare, sliding with the tilt */}
                <AbsoluteFill
                  style={{
                    background: `linear-gradient(118deg, rgba(255,255,255,0) ${18 + glareShift * 0.4}%, rgba(255,255,255,0.13) ${30 + glareShift * 0.4}%, rgba(255,255,255,0.02) ${44 + glareShift * 0.4}%, rgba(255,255,255,0) ${60 + glareShift * 0.4}%)`,
                    mixBlendMode: "screen",
                  }}
                />
                <AbsoluteFill style={{ borderRadius: R - INSET + 2, boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.06), inset 0 0 24px rgba(0,0,0,0.35)" }} />
              </div>
            </div>
          </div>
        </AbsoluteFill>
      </AbsoluteFill>

      {/* 4. Grade + grain/vignette */}
      <Finish grade={COLORS.blue} gradeOpacity={0.12 * bg} />
    </AbsoluteFill>
  );
};
