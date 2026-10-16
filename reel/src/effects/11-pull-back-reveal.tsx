import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { ChatIcon, PlaneIcon } from "../components/kit";
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
  n: 11,
  slug: "pull-back-reveal",
  name: "Pull-back reveal",
  durationInFrames: 105,
  needs: [],
  what: "Starts full frame on the speaker, then the camera pulls back (with blur on the fast part) to reveal the clip is a post in a social feed on a desk monitor in a lit creator setup; ends on a settled hold with an optional callout.",
  bestFor: "Reveals, \"this is what your customers see\", and landing on the product or the feed.",
  avoid: "The first second of a video; it needs the full-frame setup to pay off.",
};

export type PullBackRevealProps = {
  talent?: Talent;
  /** seconds into the clip at the effect's first frame */
  startAt?: number;
  /** callout over the final hold ("" hides it) */
  label?: string;
  /** name on the post */
  author?: string;
};

// Desk scene palette (local: walnut, graphite, warm lamp).
const SCENE = {
  wallTop: "#10131D",
  wallMid: "#1A1C26",
  slatLight: "rgba(255,226,190,0.05)",
  slatDark: "rgba(0,0,0,0.22)",
  lamp: "#FFC98F",
  deskBack: "#3A271B",
  deskFront: "#6E4A31",
  deskEdge: "#24170F",
  floor: "#07080D",
  graphite: "#0C0D12",
  graphiteHi: "#2A2D38",
  keys: "#2A2D37",
  keyboard: "#17181F",
  ceramic: "#ECE6DC",
  ceramicShade: "#B9B1A4",
  coffee: "#2B1A10",
  pot: "#B8643E",
  leaf: "#2F5A3C",
  leafHi: "#4E8A5A",
};

// App UI palette (dark-mode feed on the monitor).
const APP = {
  bg: "#0D1226",
  panel: "#151B36",
  panelHi: "#1E2650",
  line: "rgba(255,255,255,0.08)",
  text: "#E9ECFA",
  dim: "rgba(233,236,250,0.5)",
  faint: "rgba(233,236,250,0.18)",
};

// World layout (px in the final, settled view).
const MON = { x: 70, y: 610, w: 940, h: 588, bezel: 12, chin: 28 };
const SCR = { x: MON.x + MON.bezel, y: MON.y + MON.bezel, w: MON.w - 2 * MON.bezel, h: MON.h - MON.bezel - MON.chin };
const TOPBAR = 34;
const CARD = { x: 222, y: TOPBAR + 14, w: 316 };
const MEDIA = { w: 216, h: 384 };
const MEDIA_LOCAL = { x: CARD.x + (CARD.w - MEDIA.w) / 2, y: CARD.y + 50 };
const MEDIA_WORLD = { x: SCR.x + MEDIA_LOCAL.x, y: SCR.y + MEDIA_LOCAL.y };
const DESK_Y = 1340;
const DESK_FRONT = 1724;

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

const Bar: React.FC<{ w: number | string; h?: number; c?: string; style?: React.CSSProperties }> = ({ w, h = 7, c = APP.faint, style }) => (
  <div style={{ width: w, height: h, borderRadius: h / 2, background: c, ...style }} />
);

/** The monitor's screen: a dark-mode social feed with the clip as the centre post. */
const FeedApp: React.FC<{ talent: Talent; startAt: number; author: string; liked: number }> = ({ talent, startAt, author, liked }) => {
  const full = coverFraming(talent);
  const k = MEDIA.w / WIDTH;
  const bars = [0.32, 0.38, 0.35, 0.5, 0.58, 0.72, 0.94];
  return (
    <AbsoluteFill style={{ background: APP.bg, fontFamily: FONT_UI, color: APP.text }}>
      {/* top bar */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: TOPBAR, background: APP.panel, borderBottom: `1px solid ${APP.line}`, display: "flex", alignItems: "center", padding: "0 14px", gap: 7 }}>
        {[0, 1, 2].map((i) => (
          <div key={i} style={{ width: 10, height: 10, borderRadius: 5, background: "rgba(255,255,255,0.18)" }} />
        ))}
        <div style={{ flex: 1, display: "flex", justifyContent: "center" }}>
          <div style={{ width: 300, height: 20, borderRadius: 10, background: "rgba(255,255,255,0.07)", display: "flex", alignItems: "center", paddingLeft: 12, fontSize: 11, fontWeight: 500, color: APP.dim }}>
            Search
          </div>
        </div>
        <div style={{ width: 20, height: 20, borderRadius: 10, background: `linear-gradient(135deg, ${COLORS.cyan}, ${COLORS.violet})` }} />
      </div>

      {/* left nav */}
      <div style={{ position: "absolute", left: 18, top: TOPBAR + 18, width: 176, display: "flex", flexDirection: "column", gap: 14 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
          <div style={{ width: 22, height: 22, borderRadius: 7, background: `linear-gradient(135deg, ${COLORS.cyan}, ${COLORS.blue})` }} />
          <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: 15 }}>feed</div>
        </div>
        {[0.62, 0.48, 0.7, 0.4, 0.55].map((w, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, opacity: i === 0 ? 1 : 0.7 }}>
            <div style={{ width: 16, height: 16, borderRadius: 5, background: i === 0 ? APP.text : APP.faint }} />
            <Bar w={`${w * 100}%`} h={7} c={i === 0 ? "rgba(233,236,250,0.7)" : APP.faint} />
          </div>
        ))}
        <div style={{ marginTop: 14, background: APP.panel, borderRadius: 12, padding: 12, border: `1px solid ${APP.line}` }}>
          <div style={{ width: 34, height: 34, borderRadius: 17, background: `linear-gradient(135deg, ${COLORS.blue}, ${COLORS.violet})`, marginBottom: 8 }} />
          <Bar w="80%" h={8} c="rgba(233,236,250,0.55)" />
          <Bar w="55%" h={6} style={{ marginTop: 6 }} />
          <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
            <div style={{ fontSize: 12, fontWeight: 700 }}>4,812</div>
            <div style={{ fontSize: 11, color: APP.dim }}>followers</div>
          </div>
        </div>
      </div>

      {/* the post */}
      <div style={{ position: "absolute", left: CARD.x, top: CARD.y, width: CARD.w, bottom: 16, background: APP.panel, borderRadius: 14, border: `1px solid ${APP.line}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 12px" }}>
          <div style={{ width: 28, height: 28, borderRadius: 14, background: `linear-gradient(135deg, ${COLORS.cyan}, ${COLORS.violet})` }} />
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <div style={{ fontSize: 12, fontWeight: 700 }}>{author}</div>
            <div style={{ fontSize: 10, fontWeight: 500, color: APP.dim }}>2h · Following</div>
          </div>
        </div>
        <div style={{ position: "absolute", left: (CARD.w - MEDIA.w) / 2 - 22, right: (CARD.w - MEDIA.w) / 2 - 22, top: 50, height: MEDIA.h, background: "#000" }} />
        <div style={{ position: "absolute", left: (CARD.w - MEDIA.w) / 2, top: 50, width: MEDIA.w, height: MEDIA.h, overflow: "hidden" }}>
          <TalentLayer talent={talent} layer="full" framing={{ scale: full.scale * k, x: full.x * k, y: full.y * k }} startAt={startAt} />
        </div>
        <div style={{ position: "absolute", left: 14, right: 14, top: 50 + MEDIA.h + 10, display: "flex", alignItems: "center", gap: 14 }}>
          <svg width={20} height={20} viewBox="0 0 100 100" fill={liked > 0.5 ? COLORS.rose : "none"} stroke={liked > 0.5 ? COLORS.rose : APP.text} strokeWidth={8} strokeLinejoin="round" style={{ transform: `scale(${1 + 0.25 * Math.sin(Math.min(1, liked) * Math.PI)})` }}>
            <path d="M50 84C26 68 12 54 12 36a20 20 0 0 1 38-9 20 20 0 0 1 38 9c0 18-14 32-38 48z" />
          </svg>
          <ChatIcon size={20} stroke={8} color={APP.text} />
          <PlaneIcon size={19} stroke={8} color={APP.text} />
          <div style={{ flex: 1 }} />
          <div style={{ fontSize: 11, fontWeight: 600, color: APP.dim }}>{liked > 0.5 ? "1,285" : "1,284"} likes</div>
        </div>
      </div>

      {/* right column: weekly stats + messages */}
      <div style={{ position: "absolute", left: 560, top: TOPBAR + 14, width: SCR.w - 560 - 18, display: "flex", flexDirection: "column", gap: 12 }}>
        <div style={{ background: APP.panel, borderRadius: 14, padding: 14, border: `1px solid ${APP.line}` }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: APP.dim, letterSpacing: 0.4 }}>THIS WEEK</div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginTop: 6 }}>
            <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: 30 }}>+212%</div>
            <div style={{ fontSize: 11, color: APP.dim }}>profile views</div>
          </div>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 84, marginTop: 10 }}>
            {bars.map((h, i) => (
              <div
                key={i}
                style={{
                  flex: 1,
                  height: `${h * 100}%`,
                  borderRadius: 4,
                  background: i === bars.length - 1 ? `linear-gradient(180deg, ${COLORS.cyan}, ${COLORS.blue})` : "rgba(255,255,255,0.14)",
                }}
              />
            ))}
          </div>
        </div>
        <div style={{ background: APP.panel, borderRadius: 14, padding: 14, border: `1px solid ${APP.line}`, display: "flex", flexDirection: "column", gap: 11 }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: APP.dim, letterSpacing: 0.4 }}>MESSAGES</div>
            <div style={{ fontSize: 10, fontWeight: 700, color: APP.bg, background: COLORS.mint, borderRadius: 8, padding: "1px 7px" }}>3 new</div>
          </div>
          {[0.75, 0.6, 0.68].map((w, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 24, height: 24, borderRadius: 12, background: [COLORS.blue, COLORS.violet, COLORS.cyan][i], opacity: 0.85 }} />
              <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 5 }}>
                <Bar w={`${w * 70}%`} h={7} c="rgba(233,236,250,0.5)" />
                <Bar w={`${w * 100}%`} h={6} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
};

/** The desk, monitor and wall around the screen (world px = settled view px). */
const DeskScene: React.FC<{ children: React.ReactNode; frame: number }> = ({ children, frame }) => {
  const flicker = 1 + Math.sin(frame / 9) * 0.012;
  return (
    <>
      {/* wall: dark slats lit from above-left by a warm lamp, bias light behind the monitor */}
      <div style={{ position: "absolute", left: 0, top: 0, width: WIDTH, height: DESK_Y, background: `linear-gradient(180deg, ${SCENE.wallTop}, ${SCENE.wallMid})` }} />
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: WIDTH,
          height: DESK_Y,
          background: `repeating-linear-gradient(90deg, ${SCENE.slatLight} 0px, ${SCENE.slatLight} 30px, ${SCENE.slatDark} 30px, ${SCENE.slatDark} 36px)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: -420,
          top: -380,
          width: 1300,
          height: 1300,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${SCENE.lamp}3A 0%, ${SCENE.lamp}14 35%, rgba(0,0,0,0) 65%)`,
          opacity: flicker,
        }}
      />
      {/* wall lamp */}
      <div style={{ position: "absolute", left: 132, top: 236, width: 88, height: 36, borderRadius: "8px 8px 44px 44px", background: "linear-gradient(180deg, #C9A46A, #7A5A2E)", boxShadow: `0 0 40px ${SCENE.lamp}88, 0 18px 60px ${SCENE.lamp}55` }} />
      <div style={{ position: "absolute", left: 172, top: 214, width: 8, height: 24, background: "#5A4424" }} />
      <div
        style={{
          position: "absolute",
          left: 16,
          top: -60,
          width: 320,
          height: 1000,
          background: `radial-gradient(ellipse 140px 400px at 50% 50%, ${SCENE.lamp}48, ${SCENE.lamp}14 55%, rgba(0,0,0,0) 100%)`,
        }}
      />
      {/* bias light */}
      <div
        style={{
          position: "absolute",
          left: MON.x - 160,
          top: MON.y - 170,
          width: MON.w + 320,
          height: MON.h + 300,
          background: `radial-gradient(ellipse 50% 50% at 50% 50%, ${COLORS.blue}88, ${COLORS.blue}2A 58%, rgba(0,0,0,0) 74%)`,
        }}
      />

      {/* desk */}
      <div style={{ position: "absolute", left: 0, top: DESK_Y, width: WIDTH, height: HEIGHT - DESK_Y, background: SCENE.floor }} />
      <div
        style={{
          position: "absolute",
          left: 0,
          top: DESK_Y,
          width: WIDTH,
          height: DESK_FRONT - DESK_Y,
          background: `linear-gradient(180deg, ${SCENE.deskBack} 0%, ${SCENE.deskFront} 100%)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 0,
          top: DESK_Y,
          width: WIDTH,
          height: DESK_FRONT - DESK_Y,
          background:
            "repeating-linear-gradient(178deg, rgba(0,0,0,0.0) 0px, rgba(0,0,0,0.07) 3px, rgba(0,0,0,0) 9px, rgba(255,255,255,0.025) 17px, rgba(0,0,0,0) 26px)",
        }}
      />
      {/* screen light spilling on the desk + shadow line at the wall */}
      <div
        style={{
          position: "absolute",
          left: 60,
          top: DESK_Y,
          width: WIDTH - 120,
          height: 330,
          background: `radial-gradient(ellipse 50% 60% at 50% 0%, ${COLORS.blue}30, rgba(0,0,0,0) 100%)`,
        }}
      />
      <div style={{ position: "absolute", left: 0, top: DESK_Y, width: WIDTH, height: 26, background: "linear-gradient(180deg, rgba(0,0,0,0.45), rgba(0,0,0,0))" }} />
      <div style={{ position: "absolute", left: 0, top: DESK_FRONT, width: WIDTH, height: 34, background: `linear-gradient(180deg, ${SCENE.deskEdge}, #140C07)` }} />
      <div style={{ position: "absolute", left: 0, top: DESK_FRONT, width: WIDTH, height: 2, background: "rgba(255,220,180,0.18)" }} />
      <div style={{ position: "absolute", left: 0, top: DESK_FRONT + 34, width: WIDTH, height: 120, background: "linear-gradient(180deg, rgba(0,0,0,0.6), rgba(0,0,0,0))" }} />

      {/* plant, back right */}
      <div style={{ position: "absolute", left: 892, top: 1290, width: 120, height: 40, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(0,0,0,0.5), rgba(0,0,0,0) 70%)" }} />
      {[
        { x: 930, y: 1150, w: 40, h: 120, r: -24 },
        { x: 958, y: 1132, w: 42, h: 140, r: 8 },
        { x: 985, y: 1168, w: 38, h: 110, r: 34 },
        { x: 945, y: 1185, w: 34, h: 90, r: -48 },
      ].map((l, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: l.x - l.w / 2,
            top: l.y,
            width: l.w,
            height: l.h,
            borderRadius: "50% 50% 50% 50% / 70% 70% 30% 30%",
            background: `linear-gradient(90deg, ${SCENE.leaf}, ${SCENE.leafHi} 60%, ${SCENE.leaf})`,
            transform: `rotate(${l.r + Math.sin(frame / 40 + i) * 1.2}deg)`,
            transformOrigin: "50% 100%",
          }}
        />
      ))}
      <div style={{ position: "absolute", left: 912, top: 1246, width: 90, height: 64, borderRadius: "6px 6px 18px 18px", background: `linear-gradient(90deg, #7E3F22, ${SCENE.pot} 45%, #7E3F22)` }} />

      {/* monitor stand */}
      <div style={{ position: "absolute", left: 384, top: 1384, width: 312, height: 44, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(0,0,0,0.65), rgba(0,0,0,0) 70%)" }} />
      <div style={{ position: "absolute", left: 506, top: MON.y + MON.h - 40, width: 68, height: 1400 - (MON.y + MON.h - 40), background: `linear-gradient(90deg, #15161C, ${SCENE.graphiteHi} 50%, #15161C)` }} />
      <div style={{ position: "absolute", left: 404, top: 1380, width: 272, height: 30, borderRadius: "14px 14px 8px 8px", background: `linear-gradient(180deg, ${SCENE.graphiteHi}, #111217)`, boxShadow: "0 3px 0 rgba(0,0,0,0.5)" }} />

      {/* monitor */}
      <div
        style={{
          position: "absolute",
          left: MON.x,
          top: MON.y,
          width: MON.w,
          height: MON.h,
          borderRadius: 16,
          background: `linear-gradient(180deg, #17181F, ${SCENE.graphite})`,
          boxShadow: "inset 0 0 0 1.5px rgba(255,255,255,0.10), 0 30px 60px rgba(0,0,0,0.55)",
        }}
      >
        <div style={{ position: "absolute", left: MON.w / 2 - 4, bottom: 10, width: 8, height: 8, borderRadius: 4, background: "rgba(255,255,255,0.18)" }} />
      </div>
      <div style={{ position: "absolute", left: SCR.x, top: SCR.y, width: SCR.w, height: SCR.h, overflow: "hidden", borderRadius: 4 }}>
        {children}
      </div>

      {/* keyboard, mouse, mug */}
      <div style={{ position: "absolute", left: 270, top: 1576, width: 540, height: 40, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(0,0,0,0.55), rgba(0,0,0,0) 70%)" }} />
      <div
        style={{
          position: "absolute",
          left: 262,
          top: 1462,
          width: 556,
          height: 124,
          clipPath: "polygon(5% 0, 95% 0, 100% 100%, 0 100%)",
          background: `linear-gradient(180deg, #23252E, ${SCENE.keyboard})`,
        }}
      >
        {Array.from({ length: 5 }).map((_, r) => {
          const rowW = 452 + r * 16;
          const keys = r === 4 ? [1, 1, 6, 1, 1] : Array.from({ length: 13 }).map(() => 1);
          return (
            <div key={r} style={{ position: "absolute", left: (556 - rowW) / 2, top: 12 + r * 21, width: rowW, height: 16, display: "flex", gap: 4 }}>
              {keys.map((w, k) => (
                <div
                  key={k}
                  style={{
                    flex: w,
                    borderRadius: 3,
                    background: `linear-gradient(180deg, #343744, ${SCENE.keys})`,
                    boxShadow: "inset 0 -2px 0 rgba(0,0,0,0.4), 0 1px 0 rgba(0,0,0,0.3)",
                  }}
                />
              ))}
            </div>
          );
        })}
      </div>
      <div style={{ position: "absolute", left: 850, top: 1570, width: 110, height: 30, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(0,0,0,0.55), rgba(0,0,0,0) 70%)" }} />
      <div style={{ position: "absolute", left: 868, top: 1488, width: 70, height: 100, borderRadius: "35px 35px 32px 32px", background: `radial-gradient(ellipse at 40% 25%, #3A3D4A, ${SCENE.keyboard} 70%)` }} />
      <div style={{ position: "absolute", left: 96, top: 1580, width: 190, height: 40, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(0,0,0,0.6), rgba(0,0,0,0) 70%)" }} />
      <div style={{ position: "absolute", left: 92, top: 1478, width: 54, height: 72, borderRadius: "28px 10px 10px 28px", border: `14px solid ${SCENE.ceramicShade}`, borderRight: "none" }} />
      <div
        style={{
          position: "absolute",
          left: 128,
          top: 1446,
          width: 132,
          height: 158,
          borderRadius: "8px 8px 30px 30px / 8px 8px 22px 22px",
          background: `linear-gradient(90deg, ${SCENE.ceramicShade}, ${SCENE.ceramic} 40%, #FFFFFF 55%, ${SCENE.ceramicShade})`,
        }}
      />
      <div style={{ position: "absolute", left: 128, top: 1432, width: 132, height: 30, borderRadius: "50%", background: SCENE.ceramic }} />
      <div style={{ position: "absolute", left: 138, top: 1437, width: 112, height: 21, borderRadius: "50%", background: `radial-gradient(ellipse at 50% 40%, #4A2E1A, ${SCENE.coffee})` }} />
    </>
  );
};

export const PullBackReveal: React.FC<PullBackRevealProps> = ({
  talent = DEFAULT_TALENT,
  startAt = 0,
  label = "What your customers see",
  author = "Signal Reach",
}) => {
  const { frame, fps, durationInFrames } = useEnvelope();

  const holdIn = Math.round(0.4 * fps);
  const pullLen = Math.round(1.55 * fps);
  const land = holdIn + pullLen;
  const s0 = HEIGHT / MEDIA.h;

  // Camera: log-space zoom from the post's media (full frame) out to the whole desk.
  const eAt = (f: number) => interpolate(f, [holdIn, land], [0, 1], { ...clamp, easing: EASE.inOut });
  const e = eAt(frame);
  const settle = interpolate(frame, [land, durationInFrames], [0, 1], { ...clamp, easing: EASE.out });
  const scaleAt = (ee: number) => Math.exp(Math.log(s0) * (1 - ee));
  const s = scaleAt(e) * (1 + 0.025 * settle);
  const zoomSpeed = Math.abs(Math.log(scaleAt(e)) - Math.log(scaleAt(eAt(frame - 1))));
  const blurPx = Math.min(5, Math.max(0, zoomSpeed - 0.02) * 90);

  const M = { x: MEDIA_WORLD.x + MEDIA.w / 2, y: MEDIA_WORLD.y + MEDIA.h / 2 };
  const V = { x: WIDTH / 2, y: HEIGHT / 2 };
  const C = { x: M.x - ((M.x - V.x) * e) / scaleAt(e), y: M.y - ((M.y - V.y) * e) / scaleAt(e) };
  const camera = `translate(${V.x}px, ${V.y}px) scale(${s}) translate(${-C.x}px, ${-C.y}px)`;

  const glass = interpolate(e, [0.15, 0.7], [0, 1], { ...clamp, easing: EASE.out });
  const liked = rampAt(frame, land + Math.round(0.5 * fps), 8, EASE.out);

  // Callout (screen space), points at the post in the settled view.
  const outLen = Math.round(0.27 * fps);
  const labelOut = interpolate(frame, [durationInFrames - outLen, durationInFrames - 1], [0, 1], { ...clamp, easing: EASE.in });
  const words = label ? label.split(" ") : [];
  const labelStart = land - Math.round(0.15 * fps);
  const arrow = rampAt(frame, labelStart + words.length * 3 + 4, Math.round(0.45 * fps), EASE.inOut);
  const underline = rampAt(frame, labelStart + words.length * 3 + 2, Math.round(0.35 * fps), EASE.inOut);
  const mediaTop = { x: M.x, y: MEDIA_WORLD.y };

  return (
    <AbsoluteFill style={{ background: SCENE.floor, overflow: "hidden" }}>
      {/* 1–2. World: wall, desk, monitor; the clip is the post on screen */}
      <AbsoluteFill style={{ filter: blurPx > 0.3 ? `blur(${blurPx}px)` : undefined }}>
        <div style={{ position: "absolute", left: 0, top: 0, width: WIDTH, height: HEIGHT, transformOrigin: "0 0", transform: camera }}>
          <DeskScene frame={frame}>
            <FeedApp talent={talent} startAt={startAt} author={author} liked={liked} />
            {/* glass: glare + slight sheen, fading in as the screen becomes a screen */}
            <AbsoluteFill
              style={{
                opacity: glass,
                background: "linear-gradient(122deg, rgba(255,255,255,0) 22%, rgba(255,255,255,0.09) 34%, rgba(255,255,255,0.02) 46%, rgba(255,255,255,0) 60%)",
              }}
            />
            <AbsoluteFill style={{ opacity: glass, boxShadow: "inset 0 0 40px rgba(0,0,0,0.45)" }} />
          </DeskScene>
        </div>
      </AbsoluteFill>

      {/* 3. Callout */}
      {label ? (
        <AbsoluteFill style={{ opacity: 1 - labelOut, transform: `translateY(${-24 * labelOut}px)` }}>
          <div
            style={{
              position: "absolute",
              left: 64,
              right: 64,
              top: 330,
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              columnGap: 16,
              rowGap: 4,
              fontFamily: FONT_DISPLAY,
              fontWeight: 800,
              fontSize: 62,
              lineHeight: 1.08,
              letterSpacing: -1.2,
              color: COLORS.white,
              textShadow: "0 4px 24px rgba(0,0,0,0.6)",
            }}
          >
            {words.map((w, i) => {
              const p = springAt(frame, fps, labelStart + i * 3, SPRING.snappy);
              const last = i === words.length - 1;
              return (
                <span key={i} style={{ position: "relative", display: "inline-block", opacity: p, transform: `translateY(${(1 - p) * 30}px) scale(${0.94 + 0.06 * p})` }}>
                  {w}
                  {last ? (
                    <span
                      style={{
                        position: "absolute",
                        left: 0,
                        bottom: -6,
                        height: 8,
                        width: `${underline * 100}%`,
                        borderRadius: 4,
                        background: COLORS.cyan,
                        boxShadow: `0 0 18px ${COLORS.cyan}88`,
                      }}
                    />
                  ) : null}
                </span>
              );
            })}
          </div>
          <svg width={WIDTH} height={HEIGHT} style={{ position: "absolute", left: 0, top: 0 }}>
            <path
              d={`M ${mediaTop.x + 150} 500 C ${mediaTop.x + 170} 590, ${mediaTop.x + 110} 640, ${mediaTop.x + 40} ${mediaTop.y - 26}`}
              fill="none"
              stroke={COLORS.white}
              strokeWidth={6}
              strokeLinecap="round"
              pathLength={1}
              strokeDasharray={1}
              strokeDashoffset={1 - arrow}
              style={{ filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.5))" }}
            />
            <path
              d={`M ${mediaTop.x + 30} ${mediaTop.y - 62} L ${mediaTop.x + 38} ${mediaTop.y - 24} L ${mediaTop.x + 74} ${mediaTop.y - 40}`}
              fill="none"
              stroke={COLORS.white}
              strokeWidth={6}
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity={interpolate(arrow, [0.85, 1], [0, 1], { ...clamp, easing: EASE.out })}
            />
          </svg>
          <div
            style={{
              position: "absolute",
              left: mediaTop.x + 172,
              top: 512,
              fontFamily: FONT_HAND,
              fontWeight: 700,
              fontSize: 40,
              color: "rgba(255,255,255,0.85)",
              transform: `rotate(-6deg) translateY(${(1 - arrow) * 10}px)`,
              opacity: arrow,
              whiteSpace: "nowrap",
            }}
          >
            your post
          </div>
        </AbsoluteFill>
      ) : null}

      {/* 4. Grade + grain/vignette */}
      <Finish grade={COLORS.blue} gradeOpacity={0.1 * glass} />
    </AbsoluteFill>
  );
};
