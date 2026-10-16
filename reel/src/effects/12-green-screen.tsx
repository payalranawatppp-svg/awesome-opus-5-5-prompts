import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { COLORS, FONT_DISPLAY, FONT_HAND, FONT_UI, HEIGHT, WIDTH } from "../theme";
import {
  DEFAULT_TALENT,
  EASE,
  Finish,
  SPRING,
  TalentLayer,
  clamp,
  meanFace,
  rampAt,
  springAt,
  useEnvelope,
  type EffectMeta,
  type Framing,
  type Talent,
} from "./shared";

export const meta: EffectMeta = {
  n: 12,
  slug: "green-screen",
  name: "Green screen",
  durationInFrames: 90,
  needs: ["cutout"],
  what: "The room keys out behind the speaker, he shrinks to the bottom of the frame and a full-screen page (a results article by default) scrolls behind him, with a hand-drawn circle on the key number; he returns to full frame at the end.",
  bestFor: "Commenting on a page, post, website or results screen, creator-reaction style.",
  avoid: "Backgrounds that need the whole frame unobstructed; the bottom ~40% is the speaker.",
};

export type GreenScreenProps = {
  talent?: Talent;
  /** seconds into the clip at the effect's first frame */
  startAt?: number;
  /** anything to put behind the speaker instead of the default page; it gets a box of
   *  1080 x (1920 + scroll) px that drifts up by `scroll` px over the effect */
  background?: React.ReactNode;
  /** px the background scrolls up over the effect */
  scroll?: number;
  /** where the speaker stands */
  side?: "center" | "left" | "right";
  /** default page copy */
  headline?: string;
  stat?: string;
};

// Light article page (local palette: it must look like a real web page, not the brand UI).
const PAGE = {
  bg: "#F4F5F9",
  card: "#FFFFFF",
  ink: "#12152B",
  body: "#4B5170",
  dim: "#8A90AB",
  rule: "#E3E5EE",
  bar: "#DADDE8",
  chrome: "#E9EBF1",
  accent: COLORS.blue,
  accentTint: "#E6EDFF",
};

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

/** Half-size framing at the bottom: the cutout's soft bottom edge sits just below the frame. */
const reactFraming = (tl: Talent, side: "center" | "left" | "right", scale = 1.0): Framing => {
  const f = meanFace(tl);
  const cx = f.x + f.w / 2;
  const faceX = side === "center" ? WIDTH / 2 : side === "left" ? WIDTH * 0.3 : WIDTH * 0.7;
  return { scale, x: faceX - cx * scale, y: HEIGHT - tl.usableBottom * scale + 6 };
};

const LEADS = [12, 14, 13, 17, 18, 22, 25, 24, 30, 35, 40, 47];

/** Default background: a light results article with a chart that draws on. */
const ResultsPage: React.FC<{ headline: string; stat: string; drawAt: number; circleAt: number }> = ({ headline, stat, drawAt, circleAt }) => {
  const { frame, fps } = useEnvelope();
  const draw = rampAt(frame, drawAt, Math.round(0.9 * fps), EASE.inOut);
  const circle = rampAt(frame, circleAt, Math.round(0.5 * fps), EASE.inOut);
  const note = springAt(frame, fps, circleAt + Math.round(0.4 * fps), SPRING.snappy);
  const cw = 884;
  const ch = 250;
  const max = 50;
  const pts = LEADS.map((v, i) => [(i / (LEADS.length - 1)) * cw, ch - (v / max) * ch] as const);
  const line = pts.map((p, i) => `${i === 0 ? "M" : "L"} ${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(" ");
  const area = `${line} L ${cw} ${ch} L 0 ${ch} Z`;
  const end = pts[pts.length - 1];
  const pulse = (frame % Math.round(1.2 * fps)) / Math.round(1.2 * fps);

  return (
    <AbsoluteFill style={{ background: PAGE.bg, fontFamily: FONT_UI, color: PAGE.ink }}>
      {/* mobile browser chrome */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 150, background: PAGE.chrome, borderBottom: `2px solid ${PAGE.rule}` }}>
        <div
          style={{
            position: "absolute",
            left: 48,
            right: 130,
            top: 56,
            height: 66,
            borderRadius: 33,
            background: PAGE.card,
            display: "flex",
            alignItems: "center",
            gap: 14,
            paddingLeft: 30,
            fontSize: 28,
            fontWeight: 500,
            color: PAGE.body,
          }}
        >
          <svg width={22} height={26} viewBox="0 0 22 26" fill="none" stroke={PAGE.body} strokeWidth={2.6}>
            <rect x="2" y="11" width="18" height="13" rx="3" fill={PAGE.body} stroke="none" />
            <path d="M6 11V7a5 5 0 0 1 10 0v4" />
          </svg>
          growthnotes.example/case-study
        </div>
        <div style={{ position: "absolute", right: 48, top: 66, width: 46, height: 46, borderRadius: 12, border: `3px solid ${PAGE.body}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, fontWeight: 700, color: PAGE.body }}>
          4
        </div>
      </div>

      {/* site header */}
      <div style={{ position: "absolute", left: 64, right: 64, top: 186, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ width: 40, height: 40, borderRadius: 11, background: `linear-gradient(135deg, ${COLORS.cyan}, ${PAGE.accent})` }} />
          <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: 34, letterSpacing: -0.6 }}>Growth Notes</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
          {[0, 1, 2].map((i) => (
            <div key={i} style={{ width: 36, height: 4, borderRadius: 2, background: PAGE.ink }} />
          ))}
        </div>
      </div>

      {/* article head */}
      <div style={{ position: "absolute", left: 64, right: 64, top: 290 }}>
        <div style={{ fontSize: 24, fontWeight: 700, letterSpacing: 2.5, color: PAGE.accent }}>CASE STUDY · 6 MIN READ</div>
        <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: 74, lineHeight: 1.05, letterSpacing: -2, marginTop: 18 }}>{headline}</div>
        <div style={{ fontSize: 32, fontWeight: 500, lineHeight: 1.35, color: PAGE.body, marginTop: 24 }}>
          No ads, no hacks. Useful posts, fast replies and an inbox that never sits for a day.
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 30 }}>
          <div style={{ width: 54, height: 54, borderRadius: 27, background: `linear-gradient(135deg, ${COLORS.violet}, ${PAGE.accent})` }} />
          <div>
            <div style={{ fontSize: 25, fontWeight: 700 }}>Signal Reach team</div>
            <div style={{ fontSize: 22, fontWeight: 500, color: PAGE.dim }}>Updated this week</div>
          </div>
        </div>
      </div>

      {/* chart card */}
      <div
        style={{
          position: "absolute",
          left: 64,
          right: 64,
          top: 900,
          height: 440,
          background: PAGE.card,
          borderRadius: 28,
          boxShadow: "0 18px 40px rgba(18,21,43,0.08), 0 2px 6px rgba(18,21,43,0.05)",
          padding: "30px 34px",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 22, fontWeight: 600, color: PAGE.dim }}>Inbound leads per week</div>
            <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: 44, marginTop: 4 }}>47 this week</div>
          </div>
          <div style={{ position: "relative" }}>
            <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: 40, color: PAGE.accent, background: PAGE.accentTint, borderRadius: 18, padding: "10px 22px" }}>{stat}</div>
            {/* creator annotation: hand-drawn loop around the number */}
            <svg width={300} height={170} viewBox="0 0 300 170" style={{ position: "absolute", left: -70, top: -42, overflow: "visible" }}>
              <path
                d="M 160 18 C 60 8, 12 50, 30 98 C 48 146, 210 160, 268 112 C 312 74, 262 22, 150 24 C 120 25, 96 30, 84 36"
                fill="none"
                stroke={COLORS.coral}
                strokeWidth={7}
                strokeLinecap="round"
                pathLength={1}
                strokeDasharray={1}
                strokeDashoffset={1 - circle}
              />
            </svg>
            <div
              style={{
                position: "absolute",
                right: -6,
                top: -96,
                fontFamily: FONT_HAND,
                fontWeight: 700,
                fontSize: 52,
                color: COLORS.coral,
                transform: `rotate(-8deg) translateY(${(1 - note) * 16}px) scale(${0.9 + 0.1 * note})`,
                opacity: note,
                whiteSpace: "nowrap",
              }}
            >
              in 90 days
            </div>
          </div>
        </div>
        <svg width={cw} height={ch + 40} style={{ marginTop: 30, overflow: "visible" }}>
          <defs>
            <linearGradient id="gs-area" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={PAGE.accent} stopOpacity={0.28} />
              <stop offset="100%" stopColor={PAGE.accent} stopOpacity={0} />
            </linearGradient>
            <clipPath id="gs-reveal">
              <rect x={0} y={-20} width={cw * draw + 4} height={ch + 40} />
            </clipPath>
          </defs>
          {[0, 1, 2, 3].map((i) => (
            <line key={i} x1={0} x2={cw} y1={(i / 3) * ch} y2={(i / 3) * ch} stroke={PAGE.rule} strokeWidth={2} strokeDasharray="6 8" />
          ))}
          <g clipPath="url(#gs-reveal)">
            <path d={area} fill="url(#gs-area)" />
            <path d={line} fill="none" stroke={PAGE.accent} strokeWidth={6} strokeLinejoin="round" strokeLinecap="round" />
          </g>
          {draw > 0.98 ? (
            <>
              <circle cx={end[0]} cy={end[1]} r={10 + pulse * 26} fill="none" stroke={PAGE.accent} strokeWidth={3} opacity={1 - pulse} />
              <circle cx={end[0]} cy={end[1]} r={11} fill={PAGE.card} stroke={PAGE.accent} strokeWidth={6} />
            </>
          ) : null}
          {LEADS.map((_, i) =>
            i % 2 === 1 ? null : (
              <text key={i} x={(i / (LEADS.length - 1)) * cw} y={ch + 36} fontSize={19} fontFamily={FONT_UI} fontWeight={500} fill={PAGE.dim} textAnchor={i === 0 ? "start" : "middle"}>
                {`W${i + 1}`}
              </text>
            ),
          )}
        </svg>
      </div>

      {/* stat tiles */}
      <div style={{ position: "absolute", left: 64, right: 64, top: 1380, display: "flex", gap: 20 }}>
        {[
          ["4.8K", "new followers"],
          ["126", "qualified leads"],
          ["38%", "reply rate"],
        ].map(([n, l]) => (
          <div key={l} style={{ flex: 1, background: PAGE.card, borderRadius: 22, padding: "24px 26px", boxShadow: "0 10px 24px rgba(18,21,43,0.06)" }}>
            <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: 46 }}>{n}</div>
            <div style={{ fontSize: 22, fontWeight: 500, color: PAGE.dim, marginTop: 4 }}>{l}</div>
          </div>
        ))}
      </div>

      {/* body copy */}
      <div style={{ position: "absolute", left: 64, right: 64, top: 1600, display: "flex", flexDirection: "column", gap: 18 }}>
        <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: 44, marginBottom: 8 }}>What changed</div>
        {[1, 0.94, 0.98, 0.6, 0, 1, 0.9, 0.96, 0.72, 0, 0.97, 0.88, 0.5].map((w, i) =>
          w === 0 ? <div key={i} style={{ height: 14 }} /> : <div key={i} style={{ width: `${w * 100}%`, height: 20, borderRadius: 10, background: PAGE.bar }} />,
        )}
      </div>
    </AbsoluteFill>
  );
};

export const GreenScreen: React.FC<GreenScreenProps> = ({
  talent = DEFAULT_TALENT,
  startAt = 0,
  background,
  scroll = 240,
  side = "center",
  headline = "How three posts a week tripled our inbound leads",
  stat = "+212%",
}) => {
  const { frame, fps, durationInFrames } = useEnvelope();
  const full = coverFraming(talent);
  const react = reactFraming(talent, side);

  // Entrance: the room keys out top-down behind him, then he shrinks to the bottom of the page.
  const wipeAt = Math.round(0.1 * fps);
  const wipeLen = Math.round(0.4 * fps);
  const shrinkAt = wipeAt + wipeLen - 2;
  const landAt = shrinkAt + Math.round(0.7 * fps);
  // Exit (faster): he grows back to full frame, then the room keys back in top-down.
  const backAt = durationInFrames - Math.round(0.37 * fps);
  const rewipeAt = durationInFrames - Math.round(0.17 * fps);

  const qAt = (f: number) => {
    const inn = springAt(f, fps, shrinkAt, { damping: 19, stiffness: 120, mass: 1 });
    const out = interpolate(f, [backAt, rewipeAt], [0, 1], { ...clamp, easing: EASE.inOut });
    return inn * (1 - out);
  };
  const q = qAt(frame);
  const fr: Framing = { scale: lerp(full.scale, react.scale, q), x: lerp(full.x, react.x, q), y: lerp(full.y, react.y, q) };
  const speedPx = Math.abs(qAt(frame) - qAt(frame - 1)) * Math.abs(react.y - full.y);
  const cutBlur = Math.min(4, Math.max(0, speedPx - 25) * 0.03);

  const wipeIn = interpolate(frame, [wipeAt, wipeAt + wipeLen], [0, 1], { ...clamp, easing: EASE.inOut });
  const wipeBack = interpolate(frame, [rewipeAt, durationInFrames - 1], [0, 1], { ...clamp, easing: EASE.out });
  const exiting = frame >= rewipeAt;
  // The room (full clip) shows only while he is at full-frame framing: before the key and after the return.
  const roomVisible = frame < wipeAt + wipeLen || exiting;
  const roomClip = exiting ? `inset(0 0 ${(1 - wipeBack) * 100}% 0)` : `inset(${wipeIn * 100}% 0 0 0)`;
  const edgeY = (exiting ? wipeBack : wipeIn) * HEIGHT;
  const edgeOn = exiting ? wipeBack < 1 : frame >= wipeAt && wipeIn < 1;

  // Page drifts up the whole time it's on screen.
  const scrollY = -scroll * interpolate(frame, [shrinkAt, durationInFrames], [0, 1], { ...clamp, easing: EASE.inOut });
  const pageIn = interpolate(frame, [wipeAt, landAt], [1.06, 1], { ...clamp, easing: EASE.out });

  // Light wrap: rim + grounding shadow fade in as he lands.
  const sit = rampAt(frame, shrinkAt + 6, Math.round(0.5 * fps), EASE.out) * (1 - interpolate(frame, [backAt, rewipeAt], [0, 1], { ...clamp, easing: EASE.out }));

  return (
    <AbsoluteFill style={{ background: PAGE.bg, overflow: "hidden" }}>
      {/* 1. The page */}
      <AbsoluteFill style={{ transform: `scale(${pageIn})`, transformOrigin: "50% 30%" }}>
        <div style={{ position: "absolute", left: 0, top: scrollY, width: WIDTH, height: HEIGHT + scroll }}>
          {background ?? <ResultsPage headline={headline} stat={stat} drawAt={landAt - Math.round(0.3 * fps)} circleAt={landAt + Math.round(0.55 * fps)} />}
        </div>
      </AbsoluteFill>
      {/* grounding: the page darkens softly where he stands */}
      <AbsoluteFill
        style={{
          opacity: sit,
          background: `radial-gradient(ellipse 620px 520px at ${react.x + (meanFace(talent).x + meanFace(talent).w / 2) * react.scale}px ${HEIGHT + 60}px, rgba(10,14,40,0.38), rgba(10,14,40,0) 100%)`,
        }}
      />

      {/* 2. The room (full clip) until it keys out, and again at the end */}
      {roomVisible ? (
        <AbsoluteFill style={{ clipPath: roomClip }}>
          <TalentLayer talent={talent} layer="full" framing={fr} startAt={startAt} />
        </AbsoluteFill>
      ) : null}
      {edgeOn ? (
        <div
          style={{
            position: "absolute",
            left: -40,
            right: -40,
            top: edgeY - 4,
            height: 8,
            background: `linear-gradient(90deg, rgba(0,0,0,0), ${COLORS.cyan}, ${COLORS.white}, ${COLORS.cyan}, rgba(0,0,0,0))`,
            boxShadow: `0 0 40px 12px ${COLORS.cyan}66`,
            filter: "blur(1.5px)",
          }}
        />
      ) : null}

      {/* 3. The speaker, keyed */}
      <AbsoluteFill style={{ filter: cutBlur > 0.3 ? `blur(${cutBlur}px)` : undefined }}>
        <TalentLayer
          talent={talent}
          layer="cutout"
          framing={fr}
          startAt={startAt}
          style={{
            filter: `drop-shadow(-5px -4px ${8 * sit}px rgba(170,205,255,${0.55 * sit})) drop-shadow(0 ${26 * sit}px ${40 * sit}px rgba(10,14,40,${0.42 * sit}))`,
          }}
        />
      </AbsoluteFill>

      {/* 4. Grade + grain/vignette */}
      <Finish grade={COLORS.blue} gradeOpacity={0.06} />
    </AbsoluteFill>
  );
};
