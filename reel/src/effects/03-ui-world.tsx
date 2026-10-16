import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { ChatIcon, PersonIcon } from "../components/kit";
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
  rand,
  springAt,
  type EffectMeta,
  type Framing,
  type Talent,
} from "./shared";

export const meta: EffectMeta = {
  n: 3,
  slug: "ui-world",
  name: "UI world",
  durationInFrames: 105,
  needs: ["cutout"],
  what: "The speaker stands inside a deep 3D space: a glowing grid floor and floating app panels (chart, post, profile, alerts, chat) at different depths, some behind him and two in front; the camera arcs so they parallax.",
  bestFor: "Product explanations and \"here is how it works\" walkthroughs; naming what the service touches.",
  avoid: "Videos with no product or interface to show; intimate or serious lines.",
};

// ---------------------------------------------------------------------------------------------------
// Content

export type UiWorldContent = {
  chartLabel: string;
  chartValue: string;
  chartSub: string;
  profileName: string;
  profileStats: [string, string][];
  alertTitle: string;
  alertBody: string;
  chatIn: string;
  chatOut: string;
  doneTitle: string;
  doneBody: string;
};

const DEFAULT_CONTENT: UiWorldContent = {
  chartLabel: "Engagement",
  chartValue: "+38%",
  chartSub: "Last 30 days",
  profileName: "Your page",
  profileStats: [
    ["48", "Posts"],
    ["2.1k", "Followers"],
    ["312", "Replies"],
  ],
  alertTitle: "New lead",
  alertBody: "from your latest post",
  chatIn: "Saw your post. Do you do audits?",
  chatOut: "We do! Free for a quick call?",
  doneTitle: "Post scheduled",
  doneBody: "Tuesday, 9:00",
};

export type UiWorldProps = {
  talent?: Talent;
  /** seconds into the clip at the effect's first frame */
  startAt?: number;
  /** panel copy */
  content?: Partial<UiWorldContent>;
  /** hero colour: grid glow, chart line, reply bubble */
  accent?: string;
  /** speaker scale (the soft bottom edge of the cutout always stays below the frame) */
  scale?: number;
  /** camera arc, degrees either side */
  arc?: number;
};

// ---------------------------------------------------------------------------------------------------
// Space

/** perspective distance, px */
const P = 1500;
/** eye level on screen (perspective origin), as a fraction of the face box from its top */
const EYE = 0.42;

const glassPanel = (radius = 30): React.CSSProperties => ({
  borderRadius: radius,
  background: "linear-gradient(155deg, rgba(40,50,110,0.92) 0%, rgba(14,19,48,0.95) 100%)",
  border: "2px solid rgba(255,255,255,0.16)",
  boxShadow: "0 40px 80px rgba(2,4,14,0.55), inset 0 1px 0 rgba(255,255,255,0.22)",
  overflow: "hidden",
});

const Bar: React.FC<{ w: number; h?: number; color?: string }> = ({ w, h = 12, color = "rgba(255,255,255,0.18)" }) => (
  <div style={{ width: w, height: h, borderRadius: h / 2, background: color, flexShrink: 0 }} />
);

const label = (size: number, color: string = COLORS.muted, weight = 500): React.CSSProperties => ({
  fontFamily: FONT_UI,
  fontWeight: weight,
  fontSize: size,
  color,
  lineHeight: 1.2,
  whiteSpace: "nowrap",
});

// --- panels (drawn at their native size; the 3D projection scales them) ---

const ChartPanel: React.FC<{ c: UiWorldContent; accent: string; draw: number }> = ({ c, accent, draw }) => {
  const pts = [0.2, 0.28, 0.24, 0.4, 0.36, 0.52, 0.5, 0.66, 0.74, 0.9];
  const W = 400;
  const H = 150;
  const d = pts.map((v, i) => `${i === 0 ? "M" : "L"} ${(i / (pts.length - 1)) * W} ${H - v * H}`).join(" ");
  return (
    <div style={{ ...glassPanel(), width: 480, height: 360, padding: 36, display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <span style={label(26, COLORS.text, 700)}>{c.chartLabel}</span>
        <span style={label(20)}>{c.chartSub}</span>
      </div>
      <span style={{ fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: 74, letterSpacing: -2, color: COLORS.text, marginTop: 6 }}>{c.chartValue}</span>
      <div style={{ flex: 1 }} />
      <svg width={W} height={H} viewBox={`0 -8 ${W} ${H + 8}`} style={{ overflow: "visible" }}>
        <defs>
          <linearGradient id="uiw-chart" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={accent} stopOpacity={0.5} />
            <stop offset="100%" stopColor={accent} stopOpacity={0} />
          </linearGradient>
          <clipPath id="uiw-chart-clip">
            <rect x={0} y={-20} width={W * draw} height={H + 40} />
          </clipPath>
        </defs>
        {[0.25, 0.5, 0.75].map((g) => (
          <line key={g} x1={0} x2={W} y1={H * g} y2={H * g} stroke="rgba(255,255,255,0.08)" strokeWidth={2} />
        ))}
        <g clipPath="url(#uiw-chart-clip)">
          <path d={`${d} L ${W} ${H} L 0 ${H} Z`} fill="url(#uiw-chart)" />
          <path d={d} fill="none" stroke={accent} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" />
        </g>
      </svg>
    </div>
  );
};

const PostPanel: React.FC = () => (
  <div style={{ ...glassPanel(), width: 400, height: 500, padding: 30, display: "flex", flexDirection: "column", gap: 16 }}>
    <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
      <div style={{ width: 56, height: 56, borderRadius: 28, background: `linear-gradient(135deg, ${COLORS.cyan}, ${COLORS.violet})` }} />
      <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
        <Bar w={140} h={14} color="rgba(255,255,255,0.6)" />
        <Bar w={90} h={10} />
      </div>
    </div>
    <Bar w={330} />
    <Bar w={280} />
    <Bar w={200} />
    <div
      style={{
        flex: 1,
        borderRadius: 20,
        background: `radial-gradient(circle at 30% 30%, ${COLORS.violet}cc, transparent 60%), radial-gradient(circle at 80% 90%, ${COLORS.cyan}aa, transparent 55%), linear-gradient(140deg, ${COLORS.blue}, ${COLORS.indigo})`,
      }}
    />
    <div style={{ display: "flex", gap: 22, alignItems: "center" }}>
      <Bar w={70} h={12} color="rgba(255,255,255,0.3)" />
      <Bar w={70} h={12} />
      <Bar w={70} h={12} />
    </div>
  </div>
);

const ProfilePanel: React.FC<{ c: UiWorldContent }> = ({ c }) => (
  <div style={{ ...glassPanel(), width: 400, height: 250, padding: 30, display: "flex", flexDirection: "column", gap: 22 }}>
    <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
      <div
        style={{
          width: 76,
          height: 76,
          borderRadius: 38,
          background: "rgba(255,255,255,0.12)",
          border: "2px solid rgba(255,255,255,0.3)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <PersonIcon size={44} color={COLORS.text} stroke={8} />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <span style={label(30, COLORS.text, 700)}>{c.profileName}</span>
        <Bar w={120} h={10} />
      </div>
    </div>
    <div style={{ display: "flex", justifyContent: "space-between" }}>
      {c.profileStats.map(([v, l]) => (
        <div key={l} style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <span style={{ fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: 34, color: COLORS.text, letterSpacing: -0.6 }}>{v}</span>
          <span style={label(18)}>{l}</span>
        </div>
      ))}
    </div>
  </div>
);

const BellGlyph: React.FC<{ size: number; color: string }> = ({ size, color }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" stroke={color} strokeWidth={8} strokeLinecap="round" strokeLinejoin="round">
    <path d="M26 68V46a24 24 0 0 1 48 0v22l8 8H18z" />
    <path d="M42 84a8 8 0 0 0 16 0" />
  </svg>
);

const AlertPanel: React.FC<{ c: UiWorldContent; accent: string }> = ({ c, accent }) => (
  <div style={{ ...glassPanel(60), width: 420, height: 116, padding: "0 30px 0 22px", display: "flex", alignItems: "center", gap: 18 }}>
    <div style={{ width: 72, height: 72, borderRadius: 36, background: accent, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
      <BellGlyph size={40} color={COLORS.white} />
    </div>
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <span style={label(28, COLORS.text, 700)}>{c.alertTitle}</span>
      <span style={label(21)}>{c.alertBody}</span>
    </div>
    <div style={{ flex: 1 }} />
    <span style={label(19)}>2m</span>
  </div>
);

const ChatPanel: React.FC<{ c: UiWorldContent; accent: string; reveal: number }> = ({ c, accent, reveal }) => {
  const bubble: React.CSSProperties = { ...label(25, COLORS.text, 600), whiteSpace: "normal", textWrap: "balance", padding: "16px 20px", borderRadius: 24, maxWidth: 290 };
  return (
    <div style={{ ...glassPanel(), width: 370, padding: 24, display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <ChatIcon size={30} color={COLORS.muted} stroke={8} />
        <span style={label(20)}>Messages</span>
      </div>
      <div style={{ ...bubble, background: "rgba(255,255,255,0.12)", borderBottomLeftRadius: 8, alignSelf: "flex-start" }}>{c.chatIn}</div>
      <div
        style={{
          ...bubble,
          background: accent,
          color: COLORS.white,
          borderBottomRightRadius: 8,
          alignSelf: "flex-end",
          opacity: reveal,
          transform: `translateY(${(1 - reveal) * 16}px) scale(${0.9 + reveal * 0.1})`,
          transformOrigin: "100% 100%",
        }}
      >
        {c.chatOut}
      </div>
    </div>
  );
};

const DonePanel: React.FC<{ c: UiWorldContent; accent: string; check: number }> = ({ c, accent, check }) => (
  <div style={{ ...glassPanel(28), width: 330, padding: "22px 24px", display: "flex", alignItems: "center", gap: 16 }}>
    <div
      style={{
        width: 58,
        height: 58,
        borderRadius: 29,
        flexShrink: 0,
        border: `3px solid ${accent}`,
        background: `${accent}33`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <svg width={34} height={34} viewBox="0 0 100 100" fill="none">
        <path
          d="M22 53 42 72 79 30"
          stroke={COLORS.white}
          strokeWidth={13}
          strokeLinecap="round"
          strokeLinejoin="round"
          pathLength={1}
          strokeDasharray={1}
          strokeDashoffset={1 - check}
        />
      </svg>
    </div>
    <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
      <span style={label(25, COLORS.text, 700)}>{c.doneTitle}</span>
      <span style={label(20)}>{c.doneBody}</span>
    </div>
  </div>
);

const GhostPanel: React.FC<{ w: number; h: number; seed: number }> = ({ w, h, seed }) => (
  <div style={{ ...glassPanel(24), width: w, height: h, padding: 22, display: "flex", flexDirection: "column", gap: 12, opacity: 0.85 }}>
    <Bar w={w * (0.4 + rand(seed) * 0.2)} h={14} color="rgba(255,255,255,0.35)" />
    <Bar w={w * 0.7} h={10} />
    <Bar w={w * 0.5} h={10} />
  </div>
);

// ---------------------------------------------------------------------------------------------------

type PanelSpec = {
  key: string;
  /** world position: px right / down of the eye point, z toward the camera */
  x: number;
  y: number;
  z: number;
  ry: number;
  rx: number;
  /** entrance order */
  order: number;
  front: boolean;
  render: (frame: number) => React.ReactNode;
};

const framingFor = (tl: Talent, s: number): Framing => {
  const f = meanFace(tl);
  const cx = f.x + f.w / 2;
  const x = Math.min(0, Math.max(WIDTH - tl.w * s, WIDTH / 2 - cx * s));
  // the cutout fades out between source rows usableBottom and +60: keep that edge below the frame
  return { scale: s, x, y: HEIGHT + 2 - tl.usableBottom * s };
};

export const UiWorld: React.FC<UiWorldProps> = ({
  talent = DEFAULT_TALENT,
  startAt = 0,
  content: contentProp,
  accent = COLORS.blue,
  scale = 1.6,
  arc = 7,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const c: UiWorldContent = { ...DEFAULT_CONTENT, ...contentProp };
  // never narrower than the frame, so the source's side edges stay off screen
  const s = Math.max(scale, WIDTH / talent.w);
  const framing = framingFor(talent, s);
  const mf = meanFace(talent);
  const eyeY = framing.y + (mf.y + mf.h * EYE) * s;
  const eyeX = framing.x + (mf.x + mf.w / 2) * s;

  const exitLen = Math.round(0.32 * fps);
  const exitStart = durationInFrames - exitLen;
  const exit = interpolate(frame, [exitStart, durationInFrames], [0, 1], { ...clamp, easing: EASE.in });

  // camera: an arc around the speaker (world rotates about the speaker's plane) + a slow dolly in.
  // On entry the world itself flies in from depth while the speaker holds still.
  const ry = interpolate(frame, [0, durationInFrames], [arc, -arc], { ...clamp, easing: EASE.inOut });
  const rxCam = interpolate(frame, [0, durationInFrames], [2.5, -1], { ...clamp, easing: EASE.inOut });
  const dolly = interpolate(frame, [0, durationInFrames], [0, 70], { ...clamp, easing: EASE.inOut });
  const flyIn = interpolate(frame, [0, Math.round(1.1 * fps)], [-900, 0], { ...clamp, easing: EASE.expoOut });
  const camZ = dolly + flyIn;
  const speakerScale = P / (P - dolly);

  const panelIn = (order: number) => springAt(frame, fps, 2 + order * 4, SPRING.smooth);

  const panels: PanelSpec[] = [
    { key: "ghost1", x: -40, y: -820, z: -1500, ry: 6, rx: 0, order: 0, front: false, render: () => <GhostPanel w={360} h={220} seed={1} /> },
    { key: "ghost2", x: 640, y: -360, z: -1700, ry: -14, rx: 0, order: 0, front: false, render: () => <GhostPanel w={320} h={380} seed={2} /> },
    { key: "ghost3", x: -700, y: 40, z: -1600, ry: 16, rx: 0, order: 1, front: false, render: () => <GhostPanel w={300} h={200} seed={3} /> },
    { key: "ghost4", x: -420, y: -1450, z: -1300, ry: 10, rx: 4, order: 0, front: false, render: () => <GhostPanel w={380} h={240} seed={4} /> },
    { key: "ghost5", x: 460, y: -1250, z: -1500, ry: -12, rx: 4, order: 1, front: false, render: () => <GhostPanel w={300} h={300} seed={5} /> },
    {
      key: "chart",
      x: -300,
      y: -560,
      z: -520,
      ry: 14,
      rx: 3,
      order: 1,
      front: false,
      render: (f) => <ChartPanel c={c} accent={accent} draw={rampAt(f, 2 + 1 * 4 + 8, Math.round(0.9 * fps), EASE.inOut)} />,
    },
    { key: "post", x: 360, y: -520, z: -820, ry: -16, rx: 2, order: 2, front: false, render: () => <PostPanel /> },
    { key: "profile", x: 320, y: 190, z: -380, ry: -18, rx: 0, order: 3, front: false, render: () => <ProfilePanel c={c} /> },
    { key: "alert", x: -330, y: 120, z: -300, ry: 16, rx: 0, order: 4, front: false, render: () => <AlertPanel c={c} accent={accent} /> },
    {
      key: "chat",
      x: -235,
      y: 380,
      z: 140,
      ry: 12,
      rx: -4,
      order: 5,
      front: true,
      render: (f) => <ChatPanel c={c} accent={accent} reveal={springAt(f, fps, 2 + 5 * 4 + 14, SPRING.snappy)} />,
    },
    {
      key: "done",
      x: 230,
      y: 380,
      z: 160,
      ry: -12,
      rx: -4,
      order: 6,
      front: true,
      render: (f) => <DonePanel c={c} accent={accent} check={rampAt(f, 2 + 6 * 4 + 10, Math.round(0.4 * fps), EASE.out)} />,
    },
  ];

  const renderPanel = (p: PanelSpec, i: number) => {
    const pin = panelIn(p.order);
    const z = p.z - (1 - pin) * 700 + exit * (p.front ? 650 : 900);
    const bob = float(frame, 7, 26 + i * 3, i * 1.3);
    const depthBlur = interpolate(p.z, [-1700, -900, -500], [3.2, 1.4, 0], clamp);
    const exitBlur = exit * 10;
    const opacity = Math.min(1, pin * 1.3) * (1 - interpolate(exit, [0.3, 1], [0, 1], clamp));
    return (
      <div
        key={p.key}
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          transformOrigin: "0 0",
          transform: `translate3d(${p.x}px, ${p.y + bob}px, ${z}px) rotateY(${p.ry + (1 - pin) * 20 * Math.sign(p.ry || 1)}deg) rotateX(${p.rx}deg) translate(-50%, -50%)`,
          opacity,
          filter: depthBlur + exitBlur > 0.2 ? `blur(${(depthBlur + exitBlur).toFixed(2)}px)` : undefined,
        }}
      >
        {p.render(frame)}
      </div>
    );
  };

  const stage = (children: React.ReactNode) => (
    <AbsoluteFill style={{ perspective: P, perspectiveOrigin: `${eyeX}px ${eyeY}px` }}>
      <div
        style={{
          position: "absolute",
          left: eyeX,
          top: eyeY,
          width: 0,
          height: 0,
          transformStyle: "preserve-3d",
          transform: `translateZ(${camZ}px) rotateX(${rxCam}deg) rotateY(${ry}deg)`,
        }}
      >
        {children}
      </div>
    </AbsoluteFill>
  );

  // floor: a grid plane below eye level, receding to the horizon
  const floorY = 560;
  const floorIn = rampAt(frame, 0, Math.round(0.8 * fps), EASE.out);
  const gridScroll = (frame * 2.2) % 140;
  const floor = (
    <div
      style={{
        position: "absolute",
        left: -2400,
        top: floorY - 2400,
        width: 4800,
        height: 4800,
        transform: `translateZ(-2600px) rotateX(90deg)`,
        backgroundImage: `linear-gradient(${accent}aa 3px, transparent 3px), linear-gradient(90deg, ${accent}aa 3px, transparent 3px)`,
        backgroundSize: "140px 140px",
        backgroundPosition: `0px ${gridScroll}px`,
        WebkitMaskImage: "linear-gradient(180deg, transparent 0%, #000 40%, #000 88%, transparent 100%)",
        maskImage: "linear-gradient(180deg, transparent 0%, #000 40%, #000 88%, transparent 100%)",
        opacity: floorIn * (1 - exit) * 0.75,
      }}
    />
  );

  // floating motes: depth cues that parallax with the camera
  const motes = Array.from({ length: 34 }, (_, k) => {
    const mx = (rand(k * 3 + 1) - 0.5) * 2600;
    const my = (rand(k * 3 + 2) - 0.62) * 2200 + float(frame, 14, 40 + k, k);
    const mz = -300 - rand(k * 3 + 3) * 2600;
    const size = 4 + rand(k + 50) * 6;
    return (
      <div
        key={`m${k}`}
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: size,
          height: size,
          borderRadius: "50%",
          background: k % 3 === 0 ? accent : COLORS.white,
          opacity: (0.25 + rand(k + 70) * 0.45) * floorIn * (1 - exit),
          transform: `translate3d(${mx}px, ${my}px, ${mz}px)`,
          boxShadow: `0 0 ${size * 2}px ${k % 3 === 0 ? accent : COLORS.white}`,
        }}
      />
    );
  });

  const back = panels.filter((p) => !p.front).sort((a, b) => a.z - b.z);
  const front = panels.filter((p) => p.front).sort((a, b) => a.z - b.z);

  return (
    <AbsoluteFill style={{ background: COLORS.ink, overflow: "hidden" }}>
      {/* deep gradient + horizon glow behind the head */}
      <AbsoluteFill
        style={{
          background: `linear-gradient(180deg, #04060F 0%, ${COLORS.navy} 38%, ${COLORS.indigo} ${(eyeY / HEIGHT) * 100}%, #0A0E26 ${(eyeY / HEIGHT) * 100 + 8}%, ${COLORS.ink} 100%)`,
        }}
      />
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 60% 22% at ${eyeX}px ${eyeY}px, ${accent}66 0%, ${accent}00 100%)`,
          opacity: floorIn,
        }}
      />
      {stage(
        <>
          {floor}
          {motes}
          {back.map((p) => renderPanel(p, panels.indexOf(p)))}
        </>,
      )}
      {/* rim glow so the speaker separates from the dark space */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle 520px at ${eyeX}px ${eyeY - 40}px, ${accent}40 0%, ${accent}00 70%)`,
          mixBlendMode: "screen",
        }}
      />
      <TalentLayer
        talent={talent}
        layer="cutout"
        framing={framing}
        startAt={startAt}
        style={{
          transformOrigin: `${eyeX - framing.x}px ${eyeY - framing.y}px`,
          transform: `scale(${speakerScale})`,
          filter: "drop-shadow(0 0 30px rgba(2,4,14,0.6))",
        }}
      />
      {stage(front.map((p) => renderPanel(p, panels.indexOf(p))))}
      <Finish grade={accent} gradeOpacity={0.12} />
    </AbsoluteFill>
  );
};
