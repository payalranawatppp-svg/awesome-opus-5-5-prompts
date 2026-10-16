import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { EASE, SPRING, clamp, rampAt, springAt } from "../effects";
import { COLORS, FONT_DISPLAY, FONT_UI, WIDTH } from "../theme";

/** Neglected company page (dark mode, generic: no real network's branding), the green-screen
 *  background for "Quiet page, hardly any updates?". Everything in it says "quiet". */
const PAGE = {
  bg: "#0A1030",
  bar: "#0E1538",
  banner: "linear-gradient(120deg, #1A2148 0%, #151B3C 60%, #121735 100%)",
  card: "rgba(255,255,255,0.045)",
  cardBorder: "rgba(255,255,255,0.08)",
  line: "rgba(255,255,255,0.12)",
  dim: "#7E87AE",
  flat: "#5B6385",
  mark: COLORS.coral,
};

export const QUIET_PAGE_SCROLL = 30; // small: the logo tile must stay clear of the caption band above it

/** `circleAt`: frame (inside the effect) when the loop around "4 months" starts drawing. */
export const QuietPage: React.FC<{ circleAt: number }> = ({ circleAt }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const rise = (at: number) => {
    const p = springAt(frame, fps, at, SPRING.snappy);
    return { opacity: Math.min(1, p * 1.5), translate: `0px ${interpolate(p, [0, 1], [26, 0])}px` };
  };
  const lineDraw = rampAt(frame, 14, 20, EASE.inOut);
  const loop = rampAt(frame, circleAt, 9, EASE.out);

  return (
    <AbsoluteFill style={{ background: PAGE.bg, fontFamily: FONT_UI, color: COLORS.text }}>
      {/* app bar */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 150, background: PAGE.bar, borderBottom: `1px solid ${PAGE.line}` }}>
        <div style={{ position: "absolute", left: 64, top: 78, width: 38, height: 6, borderRadius: 3, background: PAGE.dim, opacity: 0.6 }} />
        <div style={{ position: "absolute", left: 140, right: 64, top: 60, height: 52, borderRadius: 26, background: "rgba(255,255,255,0.06)" }} />
      </div>
      {/* empty cover banner */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 150, height: 300, background: PAGE.banner }} />
      {/* logo tile + name */}
      <div style={{ position: "absolute", left: 64, top: 372, ...rise(4) }}>
        <div
          style={{
            width: 168,
            height: 168,
            borderRadius: 32,
            background: "#1C2452",
            border: `6px solid ${PAGE.bg}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: FONT_DISPLAY,
            fontWeight: 800,
            fontSize: 58,
            color: PAGE.dim,
          }}
        >
          YB
        </div>
      </div>
      <div style={{ position: "absolute", left: 64, top: 568, ...rise(6) }}>
        <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: 58, letterSpacing: -1.2 }}>Your Business</div>
        <div style={{ marginTop: 10, fontSize: 30, fontWeight: 500, color: PAGE.dim }}>Consulting · 212 followers</div>
      </div>
      {/* stats: the second tile is the one that hurts */}
      <div style={{ position: "absolute", left: 64, right: 64, top: 742, display: "flex", gap: 20 }}>
        {[
          ["0", "posts this month"],
          ["4 months", "since the last post"],
          ["—", "engagement"],
        ].map(([n, l], i) => (
          <div
            key={l}
            style={{
              flex: i === 1 ? 1.35 : 1,
              background: PAGE.card,
              border: `1px solid ${PAGE.cardBorder}`,
              borderRadius: 24,
              padding: "26px 26px 24px",
              ...rise(9 + i * 3),
            }}
          >
            <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: 46, letterSpacing: -0.8, color: i === 1 ? COLORS.text : PAGE.dim }}>{n}</div>
            <div style={{ marginTop: 6, fontSize: 23, fontWeight: 500, color: PAGE.dim }}>{l}</div>
          </div>
        ))}
      </div>
      {/* hand-drawn loop around "4 months" (drawn on "updates?") */}
      <svg width={WIDTH} height={420} viewBox={`0 0 ${WIDTH} 420`} style={{ position: "absolute", left: 0, top: 650, overflow: "visible" }}>
        <path
          d="M 360 102 C 470 66, 700 72, 742 120 C 784 172, 700 236, 540 244 C 400 250, 318 214, 322 160 C 326 116, 398 92, 470 86"
          fill="none"
          stroke={PAGE.mark}
          strokeWidth={7}
          strokeLinecap="round"
          pathLength={1}
          strokeDasharray={1}
          strokeDashoffset={1 - loop}
          style={{ filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.5))" }}
        />
      </svg>
      {/* flat activity chart */}
      <div
        style={{
          position: "absolute",
          left: 64,
          right: 64,
          top: 950,
          height: 250,
          background: PAGE.card,
          border: `1px solid ${PAGE.cardBorder}`,
          borderRadius: 28,
          ...rise(15),
        }}
      >
        <div style={{ position: "absolute", left: 30, top: 26, fontSize: 25, fontWeight: 600, color: PAGE.dim }}>Page activity · last 90 days</div>
        <svg width={WIDTH - 128} height={250} style={{ position: "absolute", left: 0, top: 0 }}>
          <line x1={30} x2={WIDTH - 158} y1={196} y2={196} stroke={PAGE.line} strokeWidth={2} />
          <path
            d={`M 30 186 L 180 188 L 330 186 L 470 190 L 620 189 L 770 190 L ${WIDTH - 158} 190`}
            fill="none"
            stroke={PAGE.flat}
            strokeWidth={6}
            strokeLinecap="round"
            strokeLinejoin="round"
            pathLength={1}
            strokeDasharray={1}
            strokeDashoffset={1 - lineDraw}
          />
        </svg>
      </div>
      <div style={{ position: "absolute", left: 64, right: 64, top: 1240, fontSize: 26, fontWeight: 500, color: PAGE.dim, opacity: interpolate(frame, [18, 26], [0, 0.8], { ...clamp, easing: EASE.out }) }}>
        No new posts this quarter
      </div>
    </AbsoluteFill>
  );
};
