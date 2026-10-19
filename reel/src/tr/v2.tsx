/**
 * ToothReferral v2: original brand animations (not screen rebuilds), built on the motion toolkit in motion.tsx.
 * Look: dark purple stage, white product cards or dark glass, one purple hero accent, kinetic type, springs,
 * light sweeps on hero moments. Content stays between y≈300 and y≈1650 so formats.tsx can frame it
 * horizontally and transparently. Demo data; counts and claims marked illustrative in the docs.
 */
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { FONT_DISPLAY } from "../theme";
import { Counter, FlowDot, KineticLine, LightSweep, LogoWhite, easeIO, easeOut, glass, ramp, useSpring } from "./motion";
import { Avatar, Badge, Button, Card, Cursor, ICON, Icon, Stage, TR, clamp, rise, useExit } from "./ui";

const Exit: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const e = useExit(8);
  return <AbsoluteFill style={{ opacity: 1 - e, scale: String(1 + e * 0.05), filter: e > 0 ? `blur(${e * 8}px)` : undefined }}>{children}</AbsoluteFill>;
};

const Check: React.FC<{ p: number; size?: number }> = ({ p, size = 44 }) => (
  <div style={{ width: size, height: size, borderRadius: size, background: TR.green, display: "flex", alignItems: "center", justifyContent: "center", scale: String(p), flex: "none", boxShadow: `0 0 ${18 * p}px ${TR.green}88` }}>
    <Icon d={ICON.check} size={size * 0.6} color="#fff" />
  </div>
);

// ---------------------------------------------------------------------------------------------------
// TR-12 Before / after: the fax-and-phone mess collapses into one clean referral.

const FaxSheet: React.FC<{ x: number; y: number; r: number; at: number }> = ({ x, y, r, at }) => {
  const frame = useCurrentFrame();
  const p = useSpring(at, { damping: 11, stiffness: 120 });
  const wob = Math.sin((frame + at * 7) / 9) * 3;
  return (
    <div style={{ position: "absolute", left: x, top: y, width: 300, height: 380, background: "#E9E7E2", borderRadius: 6, padding: 28, rotate: `${r * p + wob}deg`, translate: `0px ${(1 - p) * -500}px`, opacity: Math.min(1, p * 2), boxShadow: "0 18px 40px rgba(0,0,0,0.35)", filter: "grayscale(1) contrast(0.9)" }}>
      <div style={{ fontFamily: "monospace", fontSize: 22, fontWeight: 700, color: "#555", letterSpacing: 4 }}>FAX</div>
      {[90, 70, 84, 60, 78, 50, 88].map((w, i) => (
        <div key={i} style={{ height: 10, width: `${w}%`, background: "#B9B6AF", borderRadius: 3, marginTop: 20, opacity: 0.8 }} />
      ))}
    </div>
  );
};

const Pain: React.FC<{ text: string; x: number; y: number; at: number }> = ({ text, x, y, at }) => {
  const p = useSpring(at, { damping: 10, stiffness: 220 });
  return (
    <div style={{ position: "absolute", left: x, top: y, scale: String(p), opacity: Math.min(1, p * 2) }}>
      <Badge color="#fff" bg={TR.red} style={{ fontSize: 30, padding: "12px 26px", boxShadow: `0 12px 30px ${TR.red}66` }}>
        <Icon d={ICON.alert} size={28} color="#fff" />
        {text}
      </Badge>
    </div>
  );
};

const AfterRow: React.FC<{ label: string; detail: string; at: number }> = ({ label, detail, at }) => {
  const p = useSpring(at, { damping: 12, stiffness: 220 });
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 22, padding: "22px 0", borderTop: `1.5px solid ${TR.border}`, ...rise(p, 18) }}>
      <Check p={p} />
      <div style={{ flex: 1, fontSize: 32, fontWeight: 600, color: TR.ink }}>{label}</div>
      <div style={{ fontSize: 26, color: TR.muted }}>{detail}</div>
    </div>
  );
};

export const BeforeAfter: React.FC = () => {
  const frame = useCurrentFrame();
  const out = ramp(frame, 62, 74);
  const ring = interpolate(frame, [66, 92], [0, 1], clamp);
  const card = useSpring(74, { damping: 14, stiffness: 150 });
  const sent = useSpring(116, { damping: 12, stiffness: 200 });
  const shake = frame > 26 && frame < 60 ? Math.sin(frame * 2.4) * 6 : 0;
  return (
    <Stage>
      <Exit>
        {/* Before */}
        {out < 1 && (
          <AbsoluteFill style={{ opacity: 1 - out, scale: String(1 - out * 0.12), filter: out > 0 ? `blur(${out * 14}px) grayscale(${out})` : undefined }}>
            <div style={{ position: "absolute", left: 0, right: 0, top: 330 }}>
              <KineticLine text="Referrals today" at={0} size={92} />
            </div>
            <FaxSheet x={150} y={600} r={-9} at={4} />
            <FaxSheet x={600} y={640} r={8} at={10} />
            <FaxSheet x={380} y={760} r={-2} at={16} />
            <div style={{ position: "absolute", left: 470, top: 1240, translate: `${shake}px 0px`, ...glass(32), width: 140, height: 140, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Icon d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" size={70} color="#fff" />
            </div>
            <Pain text="Phone tag" x={90} y={1210} at={28} />
            <Pain text="Missing X-rays" x={600} y={1130} at={36} />
            <Pain text="Insurance unknown" x={300} y={1440} at={44} />
          </AbsoluteFill>
        )}
        {/* Wipe: a purple shock ring clears the frame */}
        {ring > 0 && ring < 1 && (
          <div style={{ position: "absolute", left: 540, top: 960, width: 0, height: 0 }}>
            <div style={{ position: "absolute", width: 1600, height: 1600, left: -800, top: -800, borderRadius: "50%", border: `${60 * (1 - ring)}px solid ${TR.purpleBright}`, scale: String(easeOut(ring)), opacity: 1 - ring, boxShadow: `0 0 120px ${TR.purple}` }} />
          </div>
        )}
        {/* After */}
        {frame >= 72 && (
          <>
            <div style={{ position: "absolute", left: 0, right: 0, top: 330 }}>
              <KineticLine text="With ToothReferral" accent={["ToothReferral"]} at={74} size={92} />
            </div>
            <div style={{ position: "absolute", left: 90, right: 90, top: 600, ...rise(card, 80) }}>
              <Card style={{ padding: "40px 44px 26px", position: "relative", overflow: "hidden" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 24, marginBottom: 22 }}>
                  <Avatar initials="MA" size={92} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 38, fontWeight: 700, color: TR.ink }}>Maria Alvarez</div>
                    <div style={{ fontSize: 27, color: TR.muted, marginTop: 4 }}>Referral to Endo Specialists</div>
                  </div>
                  <Badge>Routine</Badge>
                </div>
                <AfterRow label="Clinical notes" detail="Attached" at={84} />
                <AfterRow label="X-rays" detail="2 images" at={92} />
                <AfterRow label="Insurance" detail="Verified" at={100} />
                <LightSweep at={118} opacity={0.6} />
              </Card>
            </div>
            <div style={{ position: "absolute", left: 0, right: 0, top: 1120, display: "flex", justifyContent: "center", ...rise(sent, 30) }}>
              <Button primary style={{ height: 96, fontSize: 36, padding: "0 46px", borderRadius: 20, background: sent > 0.5 ? TR.green : TR.purple, boxShadow: `0 16px 40px ${TR.green}55` }}>
                <Icon d={ICON.send} size={36} color="#fff" />
                Sent securely · 2 min
              </Button>
            </div>
          </>
        )}
      </Exit>
    </Stage>
  );
};

// ---------------------------------------------------------------------------------------------------
// TR-13 Referral network: practices orbit a ToothReferral hub; referrals flow in and out.

const HUB = [540, 950];
const NODES = [
  { i: "BS", n: "Bright Smile" },
  { i: "ES", n: "Endo Specialists" },
  { i: "TF", n: "Toledo Family" },
  { i: "OS", n: "Oral Surgery" },
  { i: "HG", n: "Holland General" },
  { i: "PP", n: "Perio Partners" },
  { i: "KD", n: "Kids Dental" },
  { i: "OR", n: "Ortho Studio" },
].map((o, k) => {
  const a = (k / 8) * Math.PI * 2 - Math.PI / 2;
  return { ...o, x: HUB[0] + Math.cos(a) * 340, y: HUB[1] + Math.sin(a) * 340 };
});
const FLOWS = [
  { k: 0, at: 46, inward: true },
  { k: 3, at: 54, inward: false },
  { k: 5, at: 62, inward: true },
  { k: 2, at: 72, inward: true },
  { k: 6, at: 80, inward: false },
  { k: 1, at: 88, inward: false },
  { k: 4, at: 96, inward: true },
  { k: 7, at: 104, inward: true },
];

const Node: React.FC<{ x: number; y: number; i: string; n: string; at: number; hit: number }> = ({ x, y, i, n, at, hit }) => {
  const p = useSpring(at, { damping: 12, stiffness: 190 });
  const frame = useCurrentFrame();
  const flash = hit > 0 ? Math.max(0, 1 - (frame - hit) / 14) * (frame >= hit ? 1 : 0) : 0;
  return (
    <div style={{ position: "absolute", left: x - 70, top: y - 70, width: 140, scale: String(p), opacity: Math.min(1, p * 2), display: "flex", flexDirection: "column", alignItems: "center" }}>
      <div style={{ ...glass(70), width: 140, height: 140, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 44, fontWeight: 800, fontFamily: FONT_DISPLAY, boxShadow: `0 20px 50px rgba(4,2,20,0.45), 0 0 ${50 * flash}px ${TR.purpleBright}`, borderColor: flash > 0 ? TR.purpleBright : "rgba(255,255,255,0.22)" }}>{i}</div>
      <div style={{ marginTop: 12, fontSize: 24, fontWeight: 600, color: "rgba(255,255,255,0.85)", whiteSpace: "nowrap" }}>{n}</div>
    </div>
  );
};

export const NetworkMap: React.FC = () => {
  const frame = useCurrentFrame();
  const hub = useSpring(8, { damping: 13, stiffness: 140 });
  const cam = 1 + ramp(frame, 0, 150) * 0.05;
  const stat = useSpring(100, { damping: 14, stiffness: 180 });
  return (
    <Stage>
      <Exit>
        <div style={{ position: "absolute", left: 0, right: 0, top: 330 }}>
          <KineticLine text="Your whole network, connected" accent={["connected"]} at={0} size={84} />
        </div>
        <AbsoluteFill style={{ scale: String(cam), transformOrigin: `${HUB[0]}px ${HUB[1]}px` }}>
          <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0 }}>
            {NODES.map((o, k) => {
              const d = ramp(frame, 18 + k * 3, 40 + k * 3);
              return <line key={k} x1={HUB[0]} y1={HUB[1]} x2={HUB[0] + (o.x - HUB[0]) * d} y2={HUB[1] + (o.y - HUB[1]) * d} stroke="rgba(255,255,255,0.28)" strokeWidth={3} strokeDasharray="2 12" strokeLinecap="round" />;
            })}
          </svg>
          {/* hub pulses */}
          {[0, 1, 2].map((r) => {
            const t = ((frame - 20 - r * 16) % 48) / 48;
            if (frame < 20 + r * 16) return null;
            return <div key={r} style={{ position: "absolute", left: HUB[0] - 130, top: HUB[1] - 130, width: 260, height: 260, borderRadius: "50%", border: `3px solid ${TR.purpleBright}`, scale: String(1 + t * 0.9), opacity: (1 - t) * 0.6 }} />;
          })}
          {FLOWS.map((f) => {
            const o = NODES[f.k];
            return <FlowDot key={f.at} from={f.inward ? [o.x, o.y] : HUB} to={f.inward ? HUB : [o.x, o.y]} at={f.at} dur={24} size={22} color={f.inward ? TR.purpleBright : TR.green} />;
          })}
          <div style={{ position: "absolute", left: HUB[0] - 130, top: HUB[1] - 130, width: 260, height: 260, borderRadius: "50%", background: `radial-gradient(circle at 35% 30%, ${TR.purpleBright}, ${TR.purple} 70%)`, display: "flex", alignItems: "center", justifyContent: "center", scale: String(hub), boxShadow: `0 0 90px ${TR.purple}AA, inset 0 2px 0 rgba(255,255,255,0.35)` }}>
            <LogoWhite width={190} />
          </div>
          {NODES.map((o, k) => {
            const hitFlow = FLOWS.find((f) => f.k === k);
            const hit = hitFlow ? hitFlow.at + (hitFlow.inward ? 0 : 24) : 0;
            return <Node key={k} {...o} at={12 + k * 3} hit={hit} />;
          })}
        </AbsoluteFill>
        <div style={{ position: "absolute", left: 0, right: 0, top: 1460, display: "flex", justifyContent: "center", ...rise(stat, 30) }}>
          <div style={{ ...glass(999), padding: "22px 40px", display: "flex", alignItems: "baseline", gap: 16, fontSize: 32, fontWeight: 600 }}>
            <Counter to={38} at={100} dur={30} style={{ fontFamily: FONT_DISPLAY, fontSize: 56, fontWeight: 800, color: TR.purpleBright }} />
            referrals this week
          </div>
        </div>
      </Exit>
    </Stage>
  );
};

// ---------------------------------------------------------------------------------------------------
// TR-14 Case stack: four layers of one referral fan out in 3D, then flatten into a column.

const XRay: React.FC = () => (
  <svg width={210} height={120} viewBox="0 0 210 120" style={{ borderRadius: 14, background: "radial-gradient(ellipse at 50% 60%, #3A3F55, #0E1020)", flex: "none" }}>
    <path d="M18 52 Q105 10 192 52" stroke="#C9CCD8" strokeWidth={3} fill="none" opacity={0.5} />
    <path d="M18 70 Q105 112 192 70" stroke="#C9CCD8" strokeWidth={3} fill="none" opacity={0.5} />
    {Array.from({ length: 12 }, (_, k) => {
      const x = 28 + k * 14.5;
      const top = 44 - Math.sin((k / 11) * Math.PI) * 18;
      const bot = 76 + Math.sin((k / 11) * Math.PI) * 18;
      return (
        <g key={k} fill="#E6E8F0" opacity={0.85}>
          <rect x={x} y={top} width={10} height={16} rx={4} />
          <rect x={x} y={bot - 16} width={10} height={16} rx={4} />
        </g>
      );
    })}
  </svg>
);

const LAYERS: { title: string; body: React.ReactNode }[] = [
  {
    title: "Patient",
    body: (
      <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
        <Avatar initials="MA" size={84} />
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 34, fontWeight: 700, color: TR.ink }}>Maria Alvarez</div>
          <div style={{ fontSize: 25, color: TR.muted, marginTop: 4 }}>DOB 04/12/1986 · Crown recementation</div>
        </div>
        <Badge>Routine</Badge>
      </div>
    ),
  },
  {
    title: "X-rays",
    body: (
      <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
        <XRay />
        <div>
          <div style={{ fontSize: 32, fontWeight: 700, color: TR.ink }}>Panoramic X-ray</div>
          <div style={{ fontSize: 25, color: TR.muted, marginTop: 4 }}>+ 1 more attachment</div>
        </div>
      </div>
    ),
  },
  {
    title: "Insurance",
    body: (
      <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
        <div style={{ width: 84, height: 84, borderRadius: 22, background: TR.greenSoft, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon d={ICON.shield} size={46} color={TR.green} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 34, fontWeight: 700, color: TR.ink }}>Delta Dental PPO</div>
          <div style={{ fontSize: 25, color: TR.muted, marginTop: 4 }}>Submitted by the patient</div>
        </div>
        <Badge color={TR.green} bg={TR.greenSoft}>Verified</Badge>
      </div>
    ),
  },
  {
    title: "Messages",
    body: (
      <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
        <div style={{ width: 84, height: 84, borderRadius: 22, background: TR.purpleSoft, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon d={ICON.chat} size={44} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 30, fontWeight: 700, color: TR.ink }}>Dr. Reyes</div>
          <div style={{ fontSize: 26, color: TR.text, marginTop: 4 }}>“Can we see her Thursday?”</div>
        </div>
        <Badge color="#fff" bg={TR.purple}>2 new</Badge>
      </div>
    ),
  },
];

const StackCard: React.FC<{ k: number; spread: number; flat: number }> = ({ k, spread, flat }) => {
  const p = useSpring(4 + (3 - k) * 5, { damping: 14, stiffness: 150 });
  const z = ((3 - k) * (26 + spread * 120) + (1 - p) * 500) * (1 - flat);
  const y = (k - 1.5) * 232 * flat;
  return (
    <div style={{ position: "absolute", left: -400, top: -105 + y, width: 800, height: 210, transform: `translateZ(${z}px)`, opacity: Math.min(1, p * 2) }}>
      <Card style={{ height: "100%", boxSizing: "border-box", padding: "26px 34px", position: "relative", overflow: "hidden" }}>
        <div style={{ fontSize: 20, fontWeight: 700, color: TR.purple, letterSpacing: 2, textTransform: "uppercase", marginBottom: 14 }}>{LAYERS[k].title}</div>
        {LAYERS[k].body}
        <LightSweep at={118 + k * 4} opacity={0.5} />
      </Card>
    </div>
  );
};

export const CaseStack3D: React.FC = () => {
  const frame = useCurrentFrame();
  const spread = useSpring(34, { damping: 13, stiffness: 110 });
  const flat = ramp(frame, 78, 108);
  const rx = 56 * (1 - flat);
  const rz = -38 * (1 - flat) + Math.sin(frame / 30) * 2 * (1 - flat);
  return (
    <Stage>
      <Exit>
        <div style={{ position: "absolute", left: 0, right: 0, top: 320 }}>
          <KineticLine text="One referral. Everything inside." accent={["Everything"]} at={2} size={80} style={{ padding: "0 60px" }} />
        </div>
        <div style={{ position: "absolute", left: 540, top: 1060, width: 0, height: 0, perspective: 2600 }}>
          <div style={{ transformStyle: "preserve-3d", transform: `rotateX(${rx}deg) rotateZ(${rz}deg)` }}>
            {[3, 2, 1, 0].map((k) => (
              <StackCard key={k} k={k} spread={spread} flat={flat} />
            ))}
          </div>
        </div>
      </Exit>
    </Stage>
  );
};

// ---------------------------------------------------------------------------------------------------
// TR-15 Big stats: three kinetic numbers in a row of beats.

const BEAT = 44;
const Beat: React.FC<{ i: number; eyebrow: string; label: string; children: (at: number) => React.ReactNode; last?: boolean; size?: number }> = ({ i, eyebrow, label, children, last, size = 230 }) => {
  const frame = useCurrentFrame();
  const at = i * BEAT;
  const p = useSpring(at, { damping: 13, stiffness: 170 });
  const out = last ? 0 : ramp(frame, at + BEAT - 8, at + BEAT, easeIO);
  const ring = ramp(frame, at + 2, at + 34, easeOut);
  if (frame < at || out >= 1) return null;
  return (
    <AbsoluteFill style={{ opacity: 1 - out, translate: `0px ${-out * 120}px`, filter: out > 0 ? `blur(${out * 10}px)` : undefined }}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 420, display: "flex", justifyContent: "center", ...rise(p, 30) }}>
        <div style={{ ...glass(999), padding: "14px 34px", fontSize: 28, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase" }}>{eyebrow}</div>
      </div>
      <svg width={640} height={640} viewBox="0 0 640 640" style={{ position: "absolute", left: 220, top: 600, rotate: "-90deg" }}>
        <circle cx={320} cy={320} r={300} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth={10} />
        <circle cx={320} cy={320} r={300} fill="none" stroke={TR.purpleBright} strokeWidth={10} strokeLinecap="round" strokeDasharray={`${ring * 1885} 1885`} style={{ filter: `drop-shadow(0 0 14px ${TR.purpleBright})` }} />
      </svg>
      <div style={{ position: "absolute", left: 0, right: 0, top: 920 - size * 0.56, textAlign: "center", fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: size, lineHeight: 1, letterSpacing: -8, color: "#fff", scale: String(interpolate(p, [0, 1], [0.7, 1])), opacity: Math.min(1, p * 2), textShadow: `0 0 60px ${TR.purple}` }}>
        {children(at)}
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 1330 }}>
        <KineticLine text={label} at={at + 10} size={64} style={{ padding: "0 80px" }} />
      </div>
    </AbsoluteFill>
  );
};

const CountDown: React.FC<{ from: number; at: number; dur: number }> = ({ from, at, dur }) => {
  const frame = useCurrentFrame();
  return <span style={{ fontVariantNumeric: "tabular-nums" }}>{Math.round(from * (1 - easeOut(interpolate(frame, [at, at + dur], [0, 1], clamp))))}</span>;
};

export const BigStats: React.FC = () => (
  <Stage>
    <Exit>
      <Beat i={0} eyebrow="Speed" label="to send a complete referral">
        {(at) => (
          <>
            <Counter to={2} at={at + 4} dur={20} />
            <span style={{ fontSize: 110, color: TR.purpleBright, letterSpacing: -2 }}> min</span>
          </>
        )}
      </Beat>
      <Beat i={1} eyebrow="Paperless" label="faxes, phone tag or lost X-rays">
        {(at) => <CountDown from={12} at={at + 4} dur={22} />}
      </Beat>
      <Beat i={2} eyebrow="Security" label="HIPAA-secure messaging" last size={170}>
        {(at) => <Counter to={100} at={at + 4} dur={24} suffix="%" />}
      </Beat>
    </Exit>
  </Stage>
);

// ---------------------------------------------------------------------------------------------------
// TR-16 CTA end card: logo reveal with a light sweep, offer, button click. Holds at the end (no exit).

export const CtaEndCard: React.FC = () => {
  const frame = useCurrentFrame();
  const logo = useSpring(0, { damping: 15, stiffness: 120 });
  const reveal = ramp(frame, 2, 26, easeOut);
  const pill = useSpring(34, { damping: 12, stiffness: 200 });
  const btn = useSpring(44, { damping: 13, stiffness: 180 });
  const press = interpolate(frame, [84, 92], [0, 1], clamp);
  const ripple = interpolate(frame, [86, 110], [0, 1], clamp);
  const url = useSpring(60, { damping: 14, stiffness: 160 });
  return (
    <Stage>
      <div style={{ position: "absolute", left: 140, right: 140, top: 520, height: 300, display: "flex", justifyContent: "center", alignItems: "center", overflow: "hidden", scale: String(interpolate(logo, [0, 1], [0.86, 1])) }}>
        <div style={{ clipPath: `inset(0 ${(1 - reveal) * 100}% 0 0)`, position: "relative" }}>
          <LogoWhite width={620} />
        </div>
        <LightSweep at={26} dur={26} opacity={0.7} />
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 880 }}>
        <KineticLine text="Refer patients in minutes." accent={["minutes."]} at={18} size={82} style={{ padding: "0 60px" }} />
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 1110, display: "flex", justifyContent: "center", scale: String(pill), opacity: Math.min(1, pill * 2) }}>
        <div style={{ ...glass(999), padding: "16px 36px", fontSize: 32, fontWeight: 600, display: "flex", alignItems: "center", gap: 14 }}>
          <Check p={pill} size={38} />
          Free for general dentists
        </div>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 1250, display: "flex", justifyContent: "center", ...rise(btn, 40) }}>
        <div style={{ position: "relative" }}>
          {ripple > 0 && ripple < 1 && <div style={{ position: "absolute", inset: -10, borderRadius: 30, border: `4px solid ${TR.purpleBright}`, scale: String(1 + ripple * 0.35), opacity: 1 - ripple }} />}
          <Button primary press={press} style={{ height: 110, fontSize: 40, padding: "0 60px", borderRadius: 24, boxShadow: `0 20px 60px ${TR.purple}AA` }}>
            Start referring
            <svg width={36} height={36} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </Button>
        </div>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 1430, textAlign: "center", fontSize: 34, fontWeight: 600, color: "rgba(255,255,255,0.75)", letterSpacing: 1, ...rise(url, 20) }}>toothreferral.com</div>
      <Cursor path={[{ f: 58, x: 900, y: 1600 }, { f: 82, x: 600, y: 1315 }, { f: 120, x: 600, y: 1315 }]} clicks={[86]} />
    </Stage>
  );
};

export const TR_V2 = [
  { id: "TR-12-before-after", C: BeforeAfter, dur: 150 },
  { id: "TR-13-referral-network", C: NetworkMap, dur: 150 },
  { id: "TR-14-case-stack", C: CaseStack3D, dur: 150 },
  { id: "TR-15-big-stats", C: BigStats, dur: 135 },
  { id: "TR-16-cta", C: CtaEndCard, dur: 120 },
];
