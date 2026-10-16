import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { ChatIcon } from "../components/kit";
import { COLORS, FONT_DISPLAY, FONT_SERIF, FONT_UI, HEIGHT, WIDTH } from "../theme";
import {
  DEFAULT_TALENT,
  EASE,
  Finish,
  TalentLayer,
  clamp,
  meanFace,
  rampAt,
  rand,
  type EffectMeta,
  type Framing,
  type Talent,
} from "./shared";

export const meta: EffectMeta = {
  n: 2,
  slug: "couch-wall",
  name: "Couch wall",
  durationInFrames: 105,
  needs: ["cutout"],
  what: "The room behind the speaker is papered over, row by row, with a wall of content tiles (posts, thumbnails, stats); the camera eases back to show the whole wall while the speaker stays in front, casting a soft shadow on it.",
  bestFor: "Showing volume or a body of work (\"30 posts a month\", \"everything you've published\") and social proof.",
  avoid: "Serious or personal lines; moments where the face needs all the attention.",
};

// ---------------------------------------------------------------------------------------------------
// Look

/** Local palette: white "paper" cards and navy cards on a deep navy backing. */
const WALL = {
  backing: COLORS.ink,
  backingLift: "#121A40",
  card: "#F5F6FA",
  cardInk: "#141933",
  cardSub: "#8C93AE",
  cardLine: "#E2E5EE",
  dark: "linear-gradient(160deg, #1B2252 0%, #0E1335 100%)",
  darkLine: "rgba(255,255,255,0.14)",
};

const THUMBS: [string, string, string][] = [
  [COLORS.blue, COLORS.violet, COLORS.indigo],
  [COLORS.cyan, COLORS.blue, COLORS.navy],
  [COLORS.violet, COLORS.indigo, COLORS.blue],
  [COLORS.indigo, COLORS.blue, COLORS.cyan],
  [COLORS.blue, COLORS.navy, COLORS.violet],
];

export type CouchWallContent = {
  /** big titles on thumbnail tiles */
  thumbs: string[];
  /** [label, value] on stat tiles */
  stats: [string, string][];
  /** one-liners on quote tiles */
  quotes: string[];
  /** [incoming, reply] on comment tiles */
  comments: [string, string][];
  /** [label, title] on bar-chart tiles */
  charts: [string, string][];
};

const DEFAULT_CONTENT: CouchWallContent = {
  thumbs: ["Post weekly", "3 hooks that work", "Reply within the hour", "Behind the scenes", "A client story", "Start here", "What we fixed"],
  stats: [
    ["Profile views", "+38%"],
    ["Replies", "142"],
    ["New leads", "+12"],
    ["Reach", "24.1k"],
    ["Saves", "318"],
    ["Followers", "+204"],
  ],
  quotes: ["Consistency beats volume.", "Show up where buyers look.", "Every comment is a conversation.", "Be useful, every week."],
  comments: [
    ["Great point, saving this", "Thanks! Sent you a DM"],
    ["How do you plan posts?", "One hour every Monday"],
    ["Do you work with cafés?", "Yes! Let's talk"],
    ["Love the new posts", "That means a lot!"],
    ["Booked a call for Friday", "See you then"],
  ],
  charts: [
    ["This month", "Steady growth"],
    ["Inbox", "Replies sent"],
    ["Pipeline", "Leads up"],
  ],
};

export type CouchWallProps = {
  talent?: Talent;
  /** seconds into the clip at the effect's first frame */
  startAt?: number;
  /** what the tiles say */
  content?: Partial<CouchWallContent>;
  /** hero colour: stat lines, the reply bubble, follow buttons */
  accent?: string;
  /** speaker scale once the camera has eased back (1.97 = no pull-back) */
  pullBackScale?: number;
};

// ---------------------------------------------------------------------------------------------------
// Tiles

type Kind = "post" | "thumb" | "stat" | "quote" | "comment" | "bars" | "profile";
const KINDS: Kind[] = ["post", "thumb", "stat", "thumb", "quote", "comment", "post", "bars", "thumb", "profile"];

const TW = 240;
const TH = 290;
const GAP = 18;
const COLS = 6;
const ROWS = 7;

/** Kind grid: deterministic, no tile matches its left or upper neighbour. */
const GRID: Kind[][] = (() => {
  const g: Kind[][] = [];
  for (let r = 0; r < ROWS; r++) {
    const row: Kind[] = [];
    for (let c = 0; c < COLS; c++) {
      let k = Math.floor(rand(r * 31 + c * 7 + 1) * KINDS.length);
      for (let tries = 0; tries < KINDS.length; tries++) {
        const kind = KINDS[k % KINDS.length];
        if (kind !== row[c - 1] && kind !== g[r - 1]?.[c - 1] && kind !== g[r - 1]?.[c] && kind !== g[r - 1]?.[c + 1]) break;
        k++;
      }
      row.push(KINDS[k % KINDS.length]);
    }
    g.push(row);
  }
  return g;
})();

/** Per tile: how many tiles of the same kind came before it, so each kind cycles through its copy. */
const NTH: number[][] = (() => {
  const seen: Partial<Record<Kind, number>> = {};
  return GRID.map((row) =>
    row.map((k) => {
      const n = seen[k] ?? 0;
      seen[k] = n + 1;
      return n;
    }),
  );
})();

const Bar: React.FC<{ w: number | string; h?: number; color: string; style?: React.CSSProperties }> = ({ w, h = 12, color, style }) => (
  <div style={{ width: w, height: h, borderRadius: h / 2, background: color, flexShrink: 0, ...style }} />
);

const cardBase: React.CSSProperties = {
  position: "absolute",
  inset: 0,
  borderRadius: 22,
  overflow: "hidden",
};

const thumbBg = (seed: number) => {
  const [a, b, c] = THUMBS[seed % THUMBS.length];
  const ang = 120 + Math.round(rand(seed + 5) * 90);
  return `radial-gradient(circle at ${20 + rand(seed) * 60}% ${15 + rand(seed + 1) * 40}%, ${a}ee 0%, ${a}00 55%), radial-gradient(circle at ${30 + rand(seed + 2) * 60}% 95%, ${c}ff 0%, ${c}00 60%), linear-gradient(${ang}deg, ${b} 0%, ${COLORS.navy} 100%)`;
};

const Avatar: React.FC<{ size: number; seed: number }> = ({ size, seed }) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: "50%",
      flexShrink: 0,
      background: `linear-gradient(135deg, ${THUMBS[seed % THUMBS.length][0]}, ${THUMBS[seed % THUMBS.length][2]})`,
      boxShadow: "inset 0 0 0 3px rgba(255,255,255,0.7)",
    }}
  />
);

const Tile: React.FC<{ kind: Kind; seed: number; nth: number; content: CouchWallContent; accent: string }> = ({ kind, seed, nth, content, accent }) => {
  const pick = <T,>(list: T[]) => list[nth % list.length];
  switch (kind) {
    case "post":
      return (
        <div style={{ ...cardBase, background: WALL.card, padding: 18, display: "flex", flexDirection: "column", gap: 11 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Avatar size={36} seed={seed} />
            <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
              <Bar w={90} h={10} color={WALL.cardInk} style={{ opacity: 0.8 }} />
              <Bar w={56} h={8} color={WALL.cardLine} />
            </div>
          </div>
          <Bar w="92%" h={10} color={WALL.cardLine} />
          <Bar w="74%" h={10} color={WALL.cardLine} />
          <div style={{ flex: 1, borderRadius: 16, background: thumbBg(seed + 3) }} />
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 15, height: 15, borderRadius: 8, background: accent }} />
            <span style={{ fontFamily: FONT_UI, fontWeight: 600, fontSize: 15, color: WALL.cardSub }}>{40 + Math.round(rand(seed) * 180)}</span>
            <div style={{ flex: 1 }} />
            <Bar w={46} h={10} color={WALL.cardLine} />
          </div>
        </div>
      );
    case "thumb":
      return (
        <div style={{ ...cardBase, background: thumbBg(seed), display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                background: "rgba(255,255,255,0.22)",
                border: "1.5px solid rgba(255,255,255,0.45)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg width={18} height={18} viewBox="0 0 20 20">
                <path d="M6 3.5v13l11-6.5z" fill={COLORS.white} />
              </svg>
            </div>
            <span style={{ fontFamily: FONT_UI, fontWeight: 600, fontSize: 15, color: COLORS.white, background: "rgba(7,11,26,0.45)", padding: "3px 9px", borderRadius: 9 }}>
              0:{String(18 + Math.round(rand(seed + 4) * 40)).padStart(2, "0")}
            </span>
          </div>
          <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: 31, lineHeight: 1.04, letterSpacing: -0.8, color: COLORS.white, textShadow: "0 2px 18px rgba(7,11,26,0.45)" }}>
            {pick(content.thumbs)}
          </div>
        </div>
      );
    case "stat": {
      const [label, value] = pick(content.stats);
      const pts = Array.from({ length: 8 }, (_, i) => 70 - i * 6 - rand(seed * 3 + i) * 22);
      const line = pts.map((y, i) => `${i === 0 ? "M" : "L"} ${i * 36} ${y}`).join(" ");
      return (
        <div style={{ ...cardBase, background: WALL.dark, border: `1.5px solid ${WALL.darkLine}`, padding: 20, display: "flex", flexDirection: "column" }}>
          <span style={{ fontFamily: FONT_UI, fontWeight: 500, fontSize: 18, color: COLORS.muted }}>{label}</span>
          <span style={{ fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: 56, letterSpacing: -1.6, color: COLORS.text, marginTop: 4 }}>{value}</span>
          <div style={{ flex: 1 }} />
          <svg width={200} height={80} viewBox="0 -10 252 96" style={{ overflow: "visible" }}>
            <defs>
              <linearGradient id={`cw-fill-${seed}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={accent} stopOpacity={0.45} />
                <stop offset="100%" stopColor={accent} stopOpacity={0} />
              </linearGradient>
            </defs>
            <path d={`${line} L 252 86 L 0 86 Z`} fill={`url(#cw-fill-${seed})`} />
            <path d={line} fill="none" stroke={accent} strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      );
    }
    case "quote":
      return (
        <div style={{ ...cardBase, background: WALL.card, padding: 22, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <span style={{ fontFamily: FONT_SERIF, fontSize: 76, lineHeight: 0.6, color: WALL.cardInk, opacity: 0.18, height: 34 }}>&ldquo;</span>
          <span style={{ fontFamily: FONT_SERIF, fontStyle: "italic", fontSize: 33, lineHeight: 1.08, color: WALL.cardInk }}>{pick(content.quotes)}</span>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Avatar size={30} seed={seed + 2} />
            <Bar w={90} h={10} color={WALL.cardLine} />
          </div>
        </div>
      );
    case "comment": {
      const [a, b] = pick(content.comments);
      const bubble: React.CSSProperties = { fontFamily: FONT_UI, fontWeight: 600, fontSize: 17, lineHeight: 1.2, padding: "11px 13px", borderRadius: 17, maxWidth: 160 };
      return (
        <div style={{ ...cardBase, background: WALL.card, padding: 18, display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
            <ChatIcon size={26} color={WALL.cardSub} stroke={8} />
            <Bar w={76} h={9} color={WALL.cardLine} />
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "flex-end" }}>
            <Avatar size={28} seed={seed + 1} />
            <div style={{ ...bubble, background: "#E9ECF4", color: WALL.cardInk, borderBottomLeftRadius: 6 }}>{a}</div>
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <div style={{ ...bubble, background: accent, color: COLORS.white, borderBottomRightRadius: 6 }}>{b}</div>
          </div>
        </div>
      );
    }
    case "bars": {
      const hs = Array.from({ length: 6 }, (_, i) => 0.3 + i * 0.12 + rand(seed + i) * 0.12);
      const [label, title] = pick(content.charts);
      return (
        <div style={{ ...cardBase, background: WALL.dark, border: `1.5px solid ${WALL.darkLine}`, padding: 20, display: "flex", flexDirection: "column", gap: 8 }}>
          <span style={{ fontFamily: FONT_UI, fontWeight: 500, fontSize: 18, color: COLORS.muted }}>{label}</span>
          <span style={{ fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: 32, lineHeight: 1.05, letterSpacing: -0.8, color: COLORS.text }}>{title}</span>
          <div style={{ flex: 1, display: "flex", alignItems: "flex-end", gap: 10 }}>
            {hs.map((h, i) => (
              <div
                key={i}
                style={{
                  flex: 1,
                  height: `${Math.min(100, h * 100)}%`,
                  borderRadius: 8,
                  background: i === hs.length - 1 ? accent : "rgba(255,255,255,0.16)",
                }}
              />
            ))}
          </div>
        </div>
      );
    }
    default:
      return (
        <div style={{ ...cardBase, background: WALL.card, display: "flex", flexDirection: "column" }}>
          <div style={{ height: 88, background: thumbBg(seed + 7) }} />
          <div style={{ padding: "0 20px 20px", display: "flex", flexDirection: "column", gap: 10, flex: 1 }}>
            <div style={{ marginTop: -36 }}>
              <Avatar size={72} seed={seed} />
            </div>
            <Bar w={120} h={13} color={WALL.cardInk} style={{ opacity: 0.85 }} />
            <Bar w={160} h={9} color={WALL.cardLine} />
            <Bar w={96} h={9} color={WALL.cardLine} />
            <div style={{ flex: 1 }} />
            <div
              style={{
                alignSelf: "flex-start",
                fontFamily: FONT_UI,
                fontWeight: 700,
                fontSize: 17,
                color: COLORS.white,
                background: accent,
                padding: "8px 18px",
                borderRadius: 18,
              }}
            >
              Follow
            </div>
          </div>
        </div>
      );
  }
};

// ---------------------------------------------------------------------------------------------------
// Camera

const SRC_ANCHOR = 2; // px the usable bottom row sits below the frame

/** Framing at speaker scale `s`: the usable bottom row stays just below the frame (the cutout's soft
 *  bottom edge is never on screen), the clip covers the frame sideways, the face stays centred. */
const framingAt = (tl: Talent, s: number): Framing => {
  const f = meanFace(tl);
  const cx = f.x + f.w / 2;
  const x = Math.min(0, Math.max(WIDTH - tl.w * s, WIDTH / 2 - cx * s));
  return { scale: s, x, y: HEIGHT + SRC_ANCHOR - tl.usableBottom * s };
};

export const CouchWall: React.FC<CouchWallProps> = ({
  talent = DEFAULT_TALENT,
  startAt = 0,
  content: contentProp,
  accent = COLORS.blue,
  pullBackScale = 1.55,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const content: CouchWallContent = { ...DEFAULT_CONTENT, ...contentProp };

  // Full-clip scale: big enough that the clip covers the frame with its unusable rows below it.
  const s0 = Math.max(1.97, (HEIGHT + SRC_ANCHOR) / talent.usableBottom);
  const s1 = Math.min(s0, pullBackScale);

  const coverAt = Math.round(0.5 * fps); // backing fully opaque: the room is gone
  const pullStart = coverAt + 2;
  const pullLen = Math.round(1.25 * fps);
  const exitLen = Math.round(0.36 * fps);
  const exitStart = durationInFrames - exitLen;

  const pull = interpolate(frame, [pullStart, pullStart + pullLen], [0, 1], { ...clamp, easing: EASE.inOut });
  const s = s0 + (s1 - s0) * pull;
  const framing = framingAt(talent, s);
  // the wall is further from the lens than the speaker: it shrinks a little less during the pull-back
  const wallZoom = Math.pow(s / s1, 0.8);
  const panX = interpolate(frame, [0, durationInFrames], [40, -110], { ...clamp, easing: EASE.inOut });
  const panY = interpolate(frame, [0, durationInFrames], [10, -30], { ...clamp, easing: EASE.inOut });

  const backing = rampAt(frame, 4, coverAt - 4, EASE.inOut);
  const showRoom = frame < pullStart; // the full clip is only on screen at the safe full-clip scale

  /** Horizontal offset of tile (r, c) at frame f: slides in from alternating sides, leaves the same way it travels. */
  const tileX = (r: number, c: number, f: number) => {
    const dir = r % 2 === 0 ? -1 : 1;
    const lead = dir === -1 ? COLS - 1 - c : c; // the tile nearest its destination side moves first
    const at = r * 2.2 + lead * 1.1;
    const p = f < at ? 0 : spring({ frame: f - at, fps, config: { damping: 20, stiffness: 190, mass: 0.75 } });
    const out = interpolate(f, [exitStart + r * 1.2, exitStart + r * 1.2 + exitLen * 0.75], [0, 1], { ...clamp, easing: EASE.in });
    return dir * (1 - p) * 1150 - dir * out * 1500;
  };

  const tiles: React.ReactNode[] = [];
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const x0 = -200 + c * (TW + GAP) + (r % 2) * ((TW + GAP) / 2);
      const y0 = -60 + r * (TH + GAP);
      const dx = tileX(r, c, frame);
      const v = Math.abs(dx - tileX(r, c, frame - 1));
      const blur = interpolate(v, [25, 120], [0, 9], clamp);
      const tilt = interpolate(dx, [-1150, 0, 1150], [-4, 0, 4], clamp);
      if (Math.abs(dx) > 1600) continue;
      const seed = r * COLS + c;
      tiles.push(
        <div
          key={seed}
          style={{
            position: "absolute",
            left: x0,
            top: y0,
            width: TW,
            height: TH,
            transform: `translateX(${dx}px) rotate(${tilt}deg)`,
            filter: blur > 0.2 ? `blur(${blur.toFixed(2)}px)` : undefined,
            borderRadius: 22,
            boxShadow: "0 14px 32px rgba(2,4,14,0.45)",
          }}
        >
          <Tile kind={GRID[r][c]} seed={seed + 1} nth={NTH[r][c]} content={content} accent={accent} />
        </div>,
      );
    }
  }

  return (
    <AbsoluteFill style={{ background: WALL.backing, overflow: "hidden" }}>
      {showRoom ? <TalentLayer talent={talent} layer="full" framing={framingAt(talent, s0)} startAt={startAt} /> : null}
      {/* the backing: the room dims to navy as the first rows land */}
      <AbsoluteFill
        style={{
          opacity: backing,
          background: `radial-gradient(ellipse 80% 60% at 50% 40%, ${WALL.backingLift} 0%, ${WALL.backing} 100%)`,
        }}
      />
      {/* the wall */}
      <AbsoluteFill
        style={{
          transformOrigin: `${WIDTH / 2}px ${HEIGHT * 0.62}px`,
          transform: `translate(${panX}px, ${panY}px) scale(${wallZoom})`,
        }}
      >
        {tiles}
      </AbsoluteFill>
      {/* light falloff on the wall: brightest behind the speaker, so the edges stay calm */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 75% 55% at 50% 45%, rgba(7,11,26,0) 30%, rgba(7,11,26,0.5) 100%)`,
          opacity: backing,
        }}
      />
      {/* the speaker, with a contact shadow on the wall */}
      <TalentLayer
        talent={talent}
        layer="cutout"
        framing={framing}
        startAt={startAt}
        style={{
          filter: `drop-shadow(0px 8px 16px rgba(2,4,14,${(0.5 * backing).toFixed(3)})) drop-shadow(${Math.round(28 * s)}px ${Math.round(18 * s)}px ${Math.round(24 * s)}px rgba(2,4,14,${(0.62 * backing).toFixed(3)}))`,
        }}
      />
      <Finish grade={accent} gradeOpacity={0.08} />
    </AbsoluteFill>
  );
};
