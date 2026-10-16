import React from "react";
import { AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS, FONT_MONO, FONT_SERIF, HEIGHT, WIDTH } from "../theme";
import { DEFAULT_TALENT, EASE, Finish, TalentLayer, clamp, meanFace, rampAt, rand, type EffectMeta, type Framing, type Talent } from "./shared";

export const meta: EffectMeta = {
  n: 8,
  slug: "headline-wall",
  name: "Headline wall",
  durationInFrames: 120,
  needs: ["cutout", "plate", "face"],
  what: "Newsprint headline cards slam onto the darkened wall behind the speaker one by one, each impact shaking the wall, until they cover it; the last, biggest one carries the point.",
  bestFor: "Problem framing, trends and \"everyone is talking about this\" lines.",
  avoid: "Real outlets' names or branding (keep mastheads generic); upbeat or celebratory moments.",
};

// ---------------------------------------------------------------------------------------------------
// Look: newsprint

const PAPER = {
  sheet: "#F1ECE1",
  sheetHero: "#F6F2E8",
  edge: "rgba(110,92,60,0.22)",
  ink: "#1B1713",
  inkSoft: "rgba(27,23,19,0.62)",
  rule: "rgba(27,23,19,0.85)",
  line: "rgba(27,23,19,0.16)",
  photoA: "#CFC7B8",
  photoB: "#7E7566",
  red: "#C23A1E",
  wall: "#0A0B10",
};

const NOISE = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 0.35 0 0 0 0 0.3 0 0 0 0 0.22 0 0 0 0.55 0'/%3E%3C/filter%3E%3Crect width='180' height='180' filter='url(%23n)'/%3E%3C/svg%3E")`;

export type Headline = { masthead: string; kicker: string; headline: string };

const DEFAULT_HEADLINES: Headline[] = [
  { masthead: "The Daily Feed", kicker: "Small business", headline: "Small businesses are going quiet online" },
  { masthead: "Market Wire", kicker: "Buyers", headline: "Buyers check your page before they ever call" },
  { masthead: "Growth Weekly", kicker: "Opinion", headline: "Posting once a month isn't a strategy" },
  { masthead: "The Local Ledger", kicker: "Trends", headline: "Comments are the new sales conversations" },
  { masthead: "Owner's Digest", kicker: "Analysis", headline: "Why the quiet page loses the deal" },
  { masthead: "The Daily Feed", kicker: "Survey", headline: "Consistency beats going viral, owners say" },
  { masthead: "Market Wire", kicker: "Local", headline: "Your next client is reading your replies" },
  { masthead: "Growth Weekly", kicker: "This week", headline: "Silence online now reads as “closed”" },
];

export type HeadlineWallProps = {
  talent?: Talent;
  /** seconds into the clip at the effect's first frame */
  startAt?: number;
  /** up to 8 cards in slam order; the LAST one is the big hero card */
  headlines?: Headline[];
  /** date line printed on every card */
  dateline?: string;
  /** hero colour (the hero card's kicker and rule) */
  accent?: string;
  /** speaker scale; the cutout's soft bottom edge always stays below the frame */
  scale?: number;
};

// ---------------------------------------------------------------------------------------------------
// Layout: slots in slam order (centre x/y, width, height, rotation, headline size, photo?)

type Slot = { x: number; y: number; w: number; h: number; rot: number; size: number; photo?: boolean };
const SLOTS: Slot[] = [
  { x: 274, y: 300, w: 420, h: 300, rot: -4, size: 44 },
  { x: 900, y: 826, w: 300, h: 400, rot: 4, size: 38, photo: true },
  { x: 210, y: 846, w: 312, h: 380, rot: -3, size: 38 },
  { x: 822, y: 290, w: 420, h: 300, rot: 3.5, size: 44 },
  { x: 200, y: 1236, w: 300, h: 320, rot: 3, size: 35, photo: true },
  { x: 906, y: 1236, w: 290, h: 320, rot: -3, size: 35 },
  { x: 540, y: 112, w: 380, h: 230, rot: 1.5, size: 36 },
  { x: 540, y: 500, w: 610, h: 330, rot: -2, size: 62 },
];

/** Small texture cards in the unsafe top corners: masthead and column lines only. */
const FILLERS: Slot[] = [
  { x: 70, y: 96, w: 340, h: 250, rot: 6, size: 0 },
  { x: 1010, y: 80, w: 360, h: 240, rot: -5, size: 0 },
];

const Columns: React.FC<{ rows: number; cols?: number }> = ({ rows, cols = 2 }) => (
  <div style={{ display: "flex", gap: 18, flex: 1, overflow: "hidden" }}>
    {Array.from({ length: cols }, (_, c) => (
      <div key={c} style={{ flex: 1, display: "flex", flexDirection: "column", gap: 9 }}>
        {Array.from({ length: rows }, (_, r) => (
          <div key={r} style={{ height: 6, borderRadius: 1, background: PAPER.line, width: `${r === rows - 1 ? 40 + rand(c * 13 + r) * 40 : 88 + rand(c * 7 + r) * 12}%` }} />
        ))}
      </div>
    ))}
  </div>
);

const Photo: React.FC<{ seed: number }> = ({ seed }) => (
  <div
    style={{
      height: 110,
      flexShrink: 0,
      borderRadius: 2,
      background: `radial-gradient(${PAPER.ink}55 32%, transparent 36%) 0 0 / 7px 7px, radial-gradient(circle at ${30 + rand(seed) * 40}% 40%, ${PAPER.photoA}, ${PAPER.photoB} 75%)`,
      filter: "grayscale(1)",
    }}
  />
);

const Card: React.FC<{ slot: Slot; h?: Headline; hero: boolean; dateline: string; accent: string; seed: number }> = ({ slot, h, hero, dateline, accent, seed }) => (
  <div
    style={{
      width: slot.w,
      height: slot.h,
      background: hero ? PAPER.sheetHero : PAPER.sheet,
      backgroundImage: NOISE,
      backgroundSize: "180px 180px",
      boxShadow: `inset 0 0 40px ${PAPER.edge}`,
      padding: hero ? "22px 30px 26px" : "18px 24px 22px",
      display: "flex",
      flexDirection: "column",
      gap: hero ? 12 : 10,
      overflow: "hidden",
    }}
  >
    {/* masthead */}
    <div style={{ textAlign: "center", fontFamily: FONT_SERIF, fontSize: hero ? 40 : 30, lineHeight: 1, color: PAPER.ink, letterSpacing: 0.2 }}>{h?.masthead ?? "The Weekly Post"}</div>
    <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
      <div style={{ height: 1.5, background: PAPER.rule }} />
      <div style={{ height: 4, background: hero ? accent : PAPER.rule }} />
    </div>
    {/* kicker + date */}
    <div style={{ display: "flex", justifyContent: "space-between", fontFamily: FONT_MONO, fontWeight: hero ? 700 : 500, fontSize: hero ? 17 : 14, letterSpacing: 2, textTransform: "uppercase" }}>
      <span style={{ color: hero ? accent : PAPER.inkSoft }}>{h ? h.kicker : "Section B"}</span>
      <span style={{ color: PAPER.inkSoft, fontWeight: 500 }}>{dateline}</span>
    </div>
    {/* headline */}
    {h && slot.size > 0 ? (
      <div style={{ fontFamily: FONT_SERIF, fontSize: slot.size, lineHeight: 0.98, letterSpacing: -0.6, color: PAPER.ink, textWrap: "balance" }}>{h.headline}</div>
    ) : null}
    {slot.photo ? <Photo seed={seed} /> : null}
    <Columns rows={slot.size > 0 ? 6 : 12} cols={slot.w > 420 ? 3 : 2} />
  </div>
);

// ---------------------------------------------------------------------------------------------------

/** Cutout framing: speaker smaller and lower than the full shot, soft bottom edge below the frame. */
const framingFor = (tl: Talent, s: number): Framing => {
  const f = meanFace(tl);
  const cx = f.x + f.w / 2;
  const x = Math.min(0, Math.max(WIDTH - tl.w * s, WIDTH / 2 - cx * s));
  return { scale: s, x, y: HEIGHT + 2 - tl.usableBottom * s };
};

export const HeadlineWall: React.FC<HeadlineWallProps> = ({
  talent = DEFAULT_TALENT,
  startAt = 0,
  headlines = DEFAULT_HEADLINES,
  dateline = "Oct 14",
  accent = PAPER.red,
  scale = 1.55,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const s = Math.max(scale, WIDTH / talent.w);
  const framing = framingFor(talent, s);

  const list = headlines.slice(0, SLOTS.length);
  const n = list.length;
  // the hero (last) card always takes the hero slot; the others fill slots in order
  const slotOf = (i: number) => (i === n - 1 ? SLOTS[SLOTS.length - 1] : SLOTS[i]);

  // slam schedule: accelerating rhythm, then a beat of air before the hero lands
  const unit = fps / 30;
  const gaps = [0, 10, 8, 7, 6, 5, 4];
  const slamAt: number[] = [];
  let t = Math.round(4 * unit);
  for (let i = 0; i < n - 1; i++) {
    t += Math.round((gaps[i] ?? 4) * unit);
    slamAt.push(t);
  }
  const fillerAt = slamAt.length ? slamAt[slamAt.length - 1] + Math.round(2 * unit) : Math.round(6 * unit);
  slamAt.push(fillerAt + Math.round(9 * unit)); // hero

  const fall = Math.round(5 * unit); // frames from launch to impact
  const exitLen = Math.round(0.36 * fps);
  // the staggered drop-off must be finished on the last rendered frame (durationInFrames - 1):
  // the last card to leave has exit order 3 + (n - 1)
  const lastExitOrder = 3 + Math.max(0, n - 1);
  const exitStart = durationInFrames - 1 - (lastExitOrder * 0.45 * unit + exitLen * 0.58);

  // wall shake: every impact rings the wall; the hero rings it harder
  const impacts = [...slamAt.map((a, i) => ({ at: a + fall, amp: i === n - 1 ? 16 : 7 })), ...FILLERS.map((_, k) => ({ at: fillerAt + k * 2 + fall, amp: 3 }))];
  let shakeX = 0;
  let shakeY = 0;
  for (const im of impacts) {
    const dt = frame - im.at;
    if (dt < 0 || dt > 14) continue;
    const e = Math.exp(-dt / 3.2) * im.amp;
    shakeX += Math.sin(dt * 2.1 + im.at) * e * 0.6;
    shakeY += Math.sin(dt * 2.6) * e;
  }

  const darken = rampAt(frame, 0, Math.round(0.8 * fps), EASE.out);
  // the wall drifts toward the lens over the whole effect (a slow push that keeps the hold alive)
  const drift = interpolate(frame, [0, durationInFrames], [1, 1.035], { ...clamp, easing: EASE.inOut });

  const renderCard = (slot: Slot, h: Headline | undefined, hero: boolean, at: number, key: string, seed: number, exitOrder: number) => {
    const p = interpolate(frame, [at, at + fall], [0, 1], { ...clamp, easing: EASE.in }); // flight
    const landed = frame >= at + fall;
    const settle = landed ? spring({ frame: frame - at - fall, fps, config: { damping: 11, stiffness: 260, mass: 0.6 } }) : 0;
    const squash = landed ? 1 - 0.035 * (1 - settle) : 1;
    const flightScale = interpolate(p, [0, 1], [hero ? 1.75 : 1.5, 1]);
    const spinFrom = (rand(seed + 3) > 0.5 ? 1 : -1) * (hero ? 9 : 14);
    const rot = slot.rot + spinFrom * (1 - p) + (landed ? (1 - settle) * slot.rot * 0.3 : 0);
    const dropY = interpolate(p, [0, 1], [-60, 0]);
    // exit: the cards drop off the wall, staggered
    const exAt = exitStart + exitOrder * 0.45 * unit;
    const ex = interpolate(frame, [exAt, exAt + exitLen * 0.58], [0, 1], { ...clamp, easing: EASE.in });
    const exY = ex * 1200;
    const exRot = ex * (rand(seed + 9) - 0.5) * 50;
    // motion blur while flying in (fast scale change) and while dropping off
    const blur = !landed ? interpolate(p, [0, 0.85, 1], [7, 3, 0], clamp) : ex * 9;
    if (frame < at) return null;
    const lift = 1 - p; // in the air: big soft shadow far below; on the wall: tight and dark
    return (
      <div
        key={key}
        style={{
          position: "absolute",
          left: slot.x - slot.w / 2,
          top: slot.y - slot.h / 2,
          width: slot.w,
          height: slot.h,
          opacity: interpolate(p, [0, 0.35], [0, 1], clamp) * (1 - interpolate(ex, [0.6, 1], [0, 1], clamp)),
          transform: `translateY(${dropY + exY}px) rotate(${rot + exRot}deg) scale(${flightScale * squash})`,
          boxShadow: `0 ${6 + lift * 60}px ${12 + lift * 70}px rgba(0,0,0,${(0.55 - lift * 0.25).toFixed(3)}), 0 1px 2px rgba(0,0,0,0.4)`,
          filter: blur > 0.2 ? `blur(${blur.toFixed(2)}px)` : undefined,
        }}
      >
        <Card slot={slot} h={h} hero={hero} dateline={dateline} accent={accent} seed={seed} />
      </div>
    );
  };

  return (
    <AbsoluteFill style={{ background: PAPER.wall, overflow: "hidden" }}>
      {/* the wall: the room's clean plate, pushed back into darkness */}
      <AbsoluteFill style={{ transform: `translate(${shakeX}px, ${shakeY}px) scale(${drift})`, transformOrigin: "50% 36%" }}>
        <Img
          src={staticFile(talent.plate)}
          style={{
            position: "absolute",
            left: -40,
            top: -40,
            width: WIDTH + 80,
            height: HEIGHT + 80,
            objectFit: "cover",
            // The plate's inpainted speaker area is larger and higher than this smaller cutout, so it
            // must never read as a shape: heavy blur and darkness from the first frame on.
            filter: `blur(${(16 + darken * 12).toFixed(2)}px) brightness(${(0.42 - darken * 0.2).toFixed(3)}) saturate(0.75)`,
          }}
        />
        <AbsoluteFill style={{ background: "radial-gradient(ellipse 80% 60% at 50% 38%, rgba(10,11,16,0.15), rgba(10,11,16,0.75))", opacity: darken }} />
        {FILLERS.map((sl, k) => renderCard(sl, undefined, false, fillerAt + k * 2, `f${k}`, 100 + k, k))}
        {list.map((h, i) => renderCard(slotOf(i), h, i === n - 1, slamAt[i], `c${i}`, i * 7 + 1, 3 + (n - 1 - i)))}
        {/* light falloff: a pool of light behind the speaker, the edges sink */}
        <AbsoluteFill style={{ background: "radial-gradient(ellipse 70% 52% at 50% 40%, rgba(8,9,14,0) 40%, rgba(8,9,14,0.55) 100%)" }} />
      </AbsoluteFill>
      {/* the speaker in front, casting a soft shadow onto the cards */}
      <TalentLayer
        talent={talent}
        layer="cutout"
        framing={framing}
        startAt={startAt}
        style={{ filter: "drop-shadow(0px 10px 18px rgba(0,0,0,0.5)) drop-shadow(30px 20px 34px rgba(0,0,0,0.5))" }}
      />
      <Finish grade={COLORS.amber} gradeOpacity={0.08} />
    </AbsoluteFill>
  );
};
