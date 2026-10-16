import React, { useMemo } from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { fitText } from "@remotion/layout-utils";
import { FONT_DISPLAY, FONT_MONO, FONT_SERIF, FONT_UI, HEIGHT, WIDTH } from "../theme";
import {
  DEFAULT_TALENT,
  EASE,
  Finish,
  SPRING,
  TalentLayer,
  breathe,
  clamp,
  meanFace,
  rampAt,
  rand,
  springAt,
  useEnvelope,
  type EffectMeta,
  type Framing,
  type Talent,
} from "./shared";

export const meta: EffectMeta = {
  n: 16,
  slug: "cover-story",
  name: "Cover story",
  durationInFrames: 90,
  needs: ["cutout", "face"],
  what: "A camera flash turns the shot into a live magazine cover: bold studio colour, a huge serif masthead behind the speaker's head, cover lines, a sticker, a big headline and a barcode in front; a second flash returns to the room.",
  bestFor: "Personal brand, case studies and \"the story of\" hooks; also works as a thumbnail.",
  avoid: "Real magazine names or trade dress; long lines (cover lines are 2-4 words).",
};

export type CoverLine = { big: string; small: string };

export type CoverStoryProps = {
  talent?: Talent;
  /** seconds into the clip at the effect's first frame */
  startAt?: number;
  /** generic masthead word (never a real magazine name) */
  masthead?: string;
  /** studio backdrop colour */
  color?: string;
  /** short line under the masthead, left (keep it under ~14 characters: the head sits to its right) */
  label?: string;
  issue?: string;
  date?: string;
  lines?: CoverLine[];
  kicker?: string;
  headline?: string;
  dek?: string;
  /** sticker text: [small, big] */
  sticker?: [string, string];
};

// Magazine palette (local: print colours, not the brand UI).
const COVER = {
  studio: "#FF6A3D",
  ink: "#16131A",
  paper: "#FFF5EA",
  accent: "#FFD84A",
  barcodeBg: "#FFFFFF",
};

const SIDE = 64;

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** Full-frame framing led by the face, with the clip's unusable rows kept below the frame. */
const coverFraming = (tl: Talent, scale = 2.0): Framing => {
  const f = meanFace(tl);
  const cx = f.x + f.w / 2;
  const cy = f.y + f.h / 2;
  return {
    scale,
    x: Math.min(0, Math.max(WIDTH - tl.w * scale, WIDTH / 2 - cx * scale)),
    y: Math.min(0, Math.max(HEIGHT - tl.usableBottom * scale, HEIGHT * 0.42 - cy * scale)),
  };
};

/** Cover framing: big head whose hair overlaps the masthead's lower half; the cutout's soft
 *  bottom edge stays below the frame. */
const portraitFraming = (tl: Talent, hairY: number, scale = 1.95): Framing => {
  const f = meanFace(tl);
  const cx = f.x + f.w / 2;
  const hairRow = f.y - f.h * 0.33;
  return { scale, x: WIDTH / 2 - cx * scale, y: Math.max(hairY - hairRow * scale, HEIGHT - tl.usableBottom * scale + 4) };
};

/** Deterministic EAN-style barcode. */
const Barcode: React.FC<{ seed?: number }> = ({ seed = 7 }) => {
  const bars: { x: number; w: number; tall: boolean }[] = [];
  let x = 0;
  for (let i = 0; i < 46; i++) {
    const w = 1 + Math.floor(rand(seed + i * 3.1) * 3);
    const gap = 1 + Math.floor(rand(seed + i * 7.7) * 2);
    const guard = i < 2 || i > 43 || i === 22 || i === 23;
    bars.push({ x, w: guard ? 1.5 : w, tall: guard });
    x += (guard ? 1.5 : w) + gap;
  }
  const scale = 150 / x;
  return (
    <div style={{ background: COVER.barcodeBg, padding: "10px 12px 6px", borderRadius: 3, display: "flex", flexDirection: "column", alignItems: "center" }}>
      <svg width={150} height={70} viewBox="0 0 150 70">
        {bars.map((b, i) => (
          <rect key={i} x={b.x * scale} y={0} width={b.w * scale} height={b.tall ? 70 : 60} fill={COVER.ink} />
        ))}
      </svg>
      <div style={{ fontFamily: FONT_MONO, fontWeight: 500, fontSize: 15, letterSpacing: 2.5, color: COVER.ink, marginTop: 2 }}>7 41852 00907 3</div>
    </div>
  );
};

export const CoverStory: React.FC<CoverStoryProps> = ({
  talent = DEFAULT_TALENT,
  startAt = 0,
  masthead = "REACH",
  color = COVER.studio,
  label = "GROWTH ISSUE",
  issue = "No. 07",
  date = "AUTUMN 2026",
  lines = [
    { big: "3 posts", small: "a week is all it really takes" },
    { big: "1 hour", small: "the reply rule that wins clients" },
    { big: "0 ads", small: "how the inbox became a pipeline" },
  ],
  kicker = "COVER STORY",
  headline = "The Inbound Engine",
  dek = "How useful posts turned into a sales pipeline",
  sticker = ["NEW", "90-day playbook"],
}) => {
  const { frame, fps, durationInFrames } = useEnvelope();

  // Masthead size: fits the cover width.
  const mastSize = useMemo(
    () => Math.min(430, fitText({ text: masthead, withinWidth: WIDTH - 2 * 52, fontFamily: FONT_SERIF, fontWeight: 400, letterSpacing: "-0.01em" }).fontSize),
    [masthead],
  );
  const mastTop = 235;
  const capBottom = mastTop + mastSize * 0.86;
  const hairY = mastTop + mastSize * 0.6;

  // Timeline: flash in → masthead drops → lines → sticker → headline → barcode → gloss; flash out.
  const flashIn = Math.round(0.2 * fps);
  const outAt = durationInFrames - Math.round(0.4 * fps);
  const flashOut = durationInFrames - Math.round(0.17 * fps);
  const onCover = frame >= flashIn && frame < flashOut;
  const flash = Math.max(
    interpolate(frame, [flashIn - 2, flashIn, flashIn + Math.round(0.3 * fps)], [0, 0.92, 0], { ...clamp, easing: EASE.out }),
    interpolate(frame, [flashOut - 2, flashOut, durationInFrames - 1], [0, 0.92, 0.0], { ...clamp, easing: EASE.out }),
  );
  const out = (i: number) => interpolate(frame, [outAt + i, outAt + i + Math.round(0.17 * fps)], [0, 1], { ...clamp, easing: EASE.in });

  const full = coverFraming(talent);
  const pose = portraitFraming(talent, hairY);
  const settle = springAt(frame, fps, flashIn, SPRING.heavy) * (1 - interpolate(frame, [outAt, flashOut], [0, 1], { ...clamp, easing: EASE.inOut }));
  const fr: Framing = onCover
    ? { scale: lerp(full.scale, pose.scale, settle), x: lerp(full.x, pose.x, settle), y: lerp(full.y, pose.y, settle) }
    : full;

  const letters = masthead.split("");
  const mastAt = flashIn + 4;
  const linesAt = mastAt + letters.length * 3 + 4;
  const stickerAt = linesAt + lines.length * 5 + 2;
  const headAt = linesAt + 8;
  const barAt = stickerAt + 6;
  const gloss = rampAt(frame, barAt + 4, Math.round(0.65 * fps), EASE.inOut);
  const live = rampAt(frame, mastAt, fps, EASE.inOut);
  const cover = 1 + (breathe(frame, 0.004, 36) - 1) * live;

  const words = headline.split(" ");

  return (
    <AbsoluteFill style={{ background: color, overflow: "hidden" }}>
      {!onCover ? (
        // The room, before the first flash and after the last one.
        <TalentLayer talent={talent} layer="full" framing={full} startAt={startAt} />
      ) : (
        <AbsoluteFill style={{ transform: `scale(${cover})`, transformOrigin: "50% 45%" }}>
          {/* 1. Studio sweep */}
          <AbsoluteFill
            style={{
              background: `radial-gradient(ellipse 900px 1100px at 50% 42%, rgba(255,255,255,0.30), rgba(255,255,255,0) 70%), radial-gradient(ellipse 140% 100% at 50% 50%, rgba(0,0,0,0) 55%, rgba(40,6,0,0.42) 100%)`,
            }}
          />

          {/* 2. Masthead and its date line: behind the head */}
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: mastTop,
              display: "flex",
              justifyContent: "center",
              fontFamily: FONT_SERIF,
              fontWeight: 400,
              fontSize: mastSize,
              lineHeight: 0.86,
              letterSpacing: "-0.01em",
              color: COVER.paper,
            }}
          >
            {letters.map((ch, i) => {
              const p = springAt(frame, fps, mastAt + i * 3, SPRING.snappy);
              const o = out(i * 0.6);
              return (
                <span
                  key={i}
                  style={{
                    display: "inline-block",
                    opacity: Math.min(1, p * 1.6) * (1 - o),
                    transform: `translateY(${(1 - p) * -150 - o * 60}px) rotate(${(1 - p) * (i % 2 ? 6 : -6)}deg)`,
                    filter: p < 0.98 ? `blur(${(1 - p) * 10}px)` : undefined,
                    whiteSpace: "pre",
                  }}
                >
                  {ch}
                </span>
              );
            })}
          </div>
          <div
            style={{
              position: "absolute",
              left: SIDE,
              right: SIDE,
              top: capBottom + 18,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              fontFamily: FONT_UI,
              fontWeight: 800,
              fontSize: 20,
              letterSpacing: 2.5,
              color: COVER.paper,
              opacity: rampAt(frame, linesAt - 4, 8) * (1 - out(0)),
            }}
          >
            <div>{label}</div>
            <div style={{ textAlign: "right", lineHeight: 1.3 }}>
              {issue}
              <br />
              {date}
            </div>
          </div>

          {/* 3. The speaker (live), with a soft studio shadow on the sweep */}
          <TalentLayer
            talent={talent}
            layer="cutout"
            framing={fr}
            startAt={startAt}
            style={{ filter: `drop-shadow(18px 22px 28px rgba(60,10,0,${0.35 * settle}))` }}
          />

          {/* 4. Front matter */}
          <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(10,6,12,0) 62%, rgba(10,6,12,0.5) 82%, rgba(10,6,12,0.7) 100%)" }} />

          {/* cover lines, left column */}
          <div style={{ position: "absolute", left: SIDE, top: capBottom + 150, width: 236, display: "flex", flexDirection: "column", gap: 34 }}>
            {lines.map((l, i) => {
              const p = springAt(frame, fps, linesAt + i * 5, SPRING.snappy);
              const o = out(1 + i);
              return (
                <div
                  key={i}
                  style={{
                    opacity: Math.min(1, p * 1.4) * (1 - o),
                    transform: `translateX(${(1 - p) * -70 - o * 90}px)`,
                    filter: p < 0.97 ? `blur(${(1 - p) * 6}px)` : undefined,
                  }}
                >
                  <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: 64, lineHeight: 1, letterSpacing: -2, color: COVER.ink }}>{l.big}</div>
                  <div style={{ fontFamily: FONT_UI, fontWeight: 700, fontSize: 26, lineHeight: 1.18, color: COVER.paper, marginTop: 8, textShadow: "0 1px 10px rgba(80,14,0,0.25)" }}>
                    {l.small}
                  </div>
                </div>
              );
            })}
          </div>

          {/* sticker */}
          {(() => {
            const p = springAt(frame, fps, stickerAt, SPRING.bouncy);
            const o = out(0);
            return (
              <div
                style={{
                  position: "absolute",
                  left: WIDTH - SIDE - 196,
                  top: capBottom + 470,
                  width: 196,
                  height: 196,
                  borderRadius: "50%",
                  background: COVER.accent,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  textAlign: "center",
                  color: COVER.ink,
                  boxShadow: "0 14px 30px rgba(60,10,0,0.35)",
                  transform: `rotate(${lerp(-30, 10, p) + Math.sin(frame / 30) * 2}deg) scale(${p * (1 - o)})`,
                }}
              >
                <div style={{ fontFamily: FONT_UI, fontWeight: 800, fontSize: 22, letterSpacing: 3 }}>{sticker[0]}</div>
                <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: 31, lineHeight: 1.02, letterSpacing: -0.5, marginTop: 4, width: 150 }}>{sticker[1]}</div>
              </div>
            );
          })()}

          {/* cover headline */}
          <div style={{ position: "absolute", left: SIDE, right: SIDE, top: 1278 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                fontFamily: FONT_UI,
                fontWeight: 800,
                fontSize: 24,
                letterSpacing: 5,
                color: COVER.paper,
                opacity: rampAt(frame, headAt, 8) * (1 - out(2)),
                transform: `translateY(${(1 - rampAt(frame, headAt, 10)) * 16}px)`,
              }}
            >
              <div style={{ width: 46, height: 5, background: COVER.paper, transform: `scaleX(${rampAt(frame, headAt, 12)})`, transformOrigin: "0 50%" }} />
              {kicker}
            </div>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                columnGap: 26,
                marginTop: 10,
                fontFamily: FONT_DISPLAY,
                fontWeight: 800,
                fontSize: 108,
                lineHeight: 0.98,
                letterSpacing: -4,
                color: COVER.paper,
                textShadow: "0 6px 30px rgba(10,6,12,0.35)",
              }}
            >
              {words.map((w, i) => {
                const p = springAt(frame, fps, headAt + 3 + i * 3, SPRING.snappy);
                const o = out(2 + i);
                return (
                  <span key={i} style={{ display: "inline-block", opacity: Math.min(1, p * 1.4) * (1 - o), transform: `translateY(${(1 - p) * 50 + o * 40}px)` }}>
                    {w}
                  </span>
                );
              })}
            </div>
            <div
              style={{
                fontFamily: FONT_SERIF,
                fontStyle: "italic",
                fontWeight: 400,
                fontSize: 46,
                lineHeight: 1.1,
                color: COVER.paper,
                marginTop: 14,
                maxWidth: 760,
                opacity: rampAt(frame, headAt + 3 + words.length * 3 + 2, 10) * (1 - out(3)),
                transform: `translateY(${(1 - rampAt(frame, headAt + 3 + words.length * 3 + 2, 12)) * 18}px)`,
                textShadow: "0 2px 16px rgba(10,6,12,0.45)",
              }}
            >
              {dek}
            </div>
          </div>

          {/* barcode */}
          <div
            style={{
              position: "absolute",
              right: SIDE,
              top: 1660,
              opacity: rampAt(frame, barAt, 8) * (1 - out(1)),
              transform: `translateY(${(1 - rampAt(frame, barAt, 12)) * 30}px)`,
              boxShadow: "0 8px 20px rgba(0,0,0,0.3)",
            }}
          >
            <Barcode />
          </div>

          {/* one gloss pass across the cover once it's built */}
          <AbsoluteFill
            style={{
              background: "linear-gradient(115deg, rgba(255,255,255,0) 40%, rgba(255,255,255,0.22) 50%, rgba(255,255,255,0) 60%)",
              backgroundSize: "300% 100%",
              backgroundPosition: `${lerp(100, 0, gloss)}% 0%`,
              opacity: Math.sin(Math.PI * gloss),
              mixBlendMode: "screen",
            }}
          />
        </AbsoluteFill>
      )}

      {/* 5. Grain/vignette, then the camera flash on top */}
      <Finish />
      <AbsoluteFill style={{ background: COVER.paper, opacity: flash, pointerEvents: "none" }} />
    </AbsoluteFill>
  );
};
