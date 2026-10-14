import React from "react";
import { interpolate } from "remotion";
import { CUES } from "../../edit";
import { COLORS, FONT_DISPLAY } from "../../theme";
import { Label, PersonIcon, clamp, glass, pop, ramp } from "../kit";

export type SceneProps = { frame: number; from: number; to: number; w: number; h: number };

/** "Does your LinkedIn look like this? Quiet page, hardly any updates?"
 *  A neglected profile card: flat activity line + an empty month of posts. */
export const QuietProfile: React.FC<SceneProps> = ({ frame, w, h }) => {
  const enter = pop(frame, CUES.profileIn, { damping: 15 });
  const thisHit = pop(frame, CUES.profileThis, { damping: 8, stiffness: 260 });
  const bump = frame >= CUES.profileThis ? Math.sin(Math.min(1, (frame - CUES.profileThis) / 10) * Math.PI) * 0.035 : 0;
  const cardW = 860;
  const cardH = 360;

  // Activity line: a couple of weak blips, then it flatlines when "Quiet" is said.
  const lineW = 600;
  const draw = ramp(frame, CUES.quiet - 2, 18);
  const pts: [number, number][] = [];
  for (let i = 0; i <= 60; i++) {
    const x = (i / 60) * lineW;
    const blip = i === 9 ? -26 : i === 10 ? 18 : i === 21 ? -12 : i === 22 ? 8 : 0;
    pts.push([x, 34 + blip]);
  }
  const path = pts.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)} ${y}`).join(" ");
  const flatColor = interpolate(draw, [0.4, 1], [0, 1], clamp);

  const cells = 12;
  const zeroPop = pop(frame, CUES.updates + 10, { damping: 9, stiffness: 240 });

  return (
    <div
      style={{
        position: "absolute",
        left: (w - cardW) / 2,
        top: (h - cardH) / 2,
        width: cardW,
        height: cardH,
        transform: `translateY(${(1 - enter) * -20}px) scale(${(0.88 + 0.12 * enter) * (1 + bump)}) rotate(${(1 - enter) * -3}deg)`,
        opacity: Math.min(1, enter * 1.5),
      }}
    >
      <div style={{ position: "absolute", inset: 0, ...glass(), filter: "saturate(0.6)" }} />
      {/* "this?" highlight ring */}
      <div
        style={{
          position: "absolute",
          inset: -10,
          borderRadius: 42,
          border: `4px solid ${COLORS.amber}`,
          opacity: thisHit * interpolate(frame, [CUES.quiet + 10, CUES.quiet + 20], [1, 0.35], clamp),
          transform: `scale(${1.04 - 0.04 * thisHit})`,
          boxShadow: `0 0 40px ${COLORS.amber}55`,
        }}
      />
      <div
        style={{
          position: "absolute",
          right: -22,
          top: -26,
          width: 74,
          height: 74,
          borderRadius: "50%",
          background: COLORS.amber,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: FONT_DISPLAY,
          fontWeight: 800,
          fontSize: 50,
          color: COLORS.ink,
          transform: `scale(${thisHit}) rotate(${(1 - thisHit) * 40}deg)`,
          boxShadow: `0 10px 26px ${COLORS.amber}77`,
        }}
      >
        ?
      </div>

      <div style={{ position: "absolute", left: 36, top: 30, display: "flex", gap: 24, alignItems: "center" }}>
        <div
          style={{
            width: 92,
            height: 92,
            borderRadius: "50%",
            background: "linear-gradient(160deg, #5a6288, #2b3157)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <PersonIcon size={62} color="rgba(255,255,255,0.55)" stroke={8} />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <Label size={38} weight={800}>
            Your Business
          </Label>
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <div
              style={{
                padding: "6px 14px",
                borderRadius: 999,
                background: "rgba(255,92,122,0.16)",
                border: "1.5px solid rgba(255,92,122,0.45)",
              }}
            >
              <Label size={22} weight={600} color="#FF9AAE">
                Last post · 3 months ago
              </Label>
            </div>
          </div>
        </div>
      </div>

      <div style={{ position: "absolute", left: 36, top: 150, width: cardW - 72 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Label size={22} weight={600} color={COLORS.muted}>
            ACTIVITY
          </Label>
          <div style={{ opacity: ramp(frame, CUES.quiet + 6, 8), display: "flex", gap: 8, alignItems: "center" }}>
            <div style={{ width: 12, height: 12, borderRadius: "50%", background: COLORS.rose }} />
            <Label size={22} weight={700} color={COLORS.rose}>
              Quiet
            </Label>
          </div>
        </div>
        <svg width={lineW + 140} height={68} style={{ marginTop: 6, overflow: "visible" }}>
          <path d={`M0 34 H${lineW + 130}`} stroke="rgba(255,255,255,0.08)" strokeWidth={2} />
          <path
            d={`${path} L${lineW + 130} 34`}
            stroke={flatColor > 0.5 ? COLORS.rose : COLORS.grey}
            strokeWidth={5}
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            pathLength={1}
            strokeDasharray={1}
            strokeDashoffset={1 - Math.max(0.12, draw)}
          />
          {draw > 0.02 && (
            <circle
              cx={Math.max(0.12, draw) * (lineW + 130)}
              cy={34}
              r={9}
              fill={COLORS.rose}
              opacity={0.6 + 0.4 * Math.sin(frame / 3)}
            />
          )}
        </svg>
      </div>

      <div style={{ position: "absolute", left: 36, top: 262, width: cardW - 72, display: "flex", alignItems: "center", gap: 12 }}>
        {Array.from({ length: cells }).map((_, i) => {
          // Empty month is on the card from the start; on "updates?" a rose wave runs across it.
          const s = pop(frame, CUES.profileIn + 6 + i * 1.2, { damping: 16, stiffness: 240 });
          const wave = Math.max(0, 1 - Math.abs(frame - (CUES.updates - 4 + i * 1.3)) / 5);
          return (
            <div
              key={i}
              style={{
                width: 44,
                height: 44,
                borderRadius: 11,
                border: `2px dashed rgba(255,${Math.round(255 - 163 * wave)},${Math.round(255 - 133 * wave)},${0.22 + 0.6 * wave})`,
                background: `rgba(255,92,122,${0.03 + 0.22 * wave})`,
                transform: `scale(${s * (1 + 0.12 * wave)})`,
              }}
            />
          );
        })}
        <div
          style={{
            marginLeft: 6,
            display: "flex",
            alignItems: "baseline",
            gap: 8,
            transform: `scale(${zeroPop})`,
            transformOrigin: "left center",
          }}
        >
          <Label size={52} weight={800} color={COLORS.rose} style={{ fontFamily: FONT_DISPLAY }}>
            0
          </Label>
          <Label size={22} weight={600} color={COLORS.muted}>
            posts
          </Label>
        </div>
      </div>
    </div>
  );
};

/** "Running a business leaves little time for posting." — the week as a donut;
 *  posting gets a sliver. A clock spins in the middle. */
export const TimeSqueeze: React.FC<SceneProps> = ({ frame, from, h }) => {
  const parts = [
    { label: "Clients", value: 0.4, color: COLORS.blue, at: from + 4 },
    { label: "Operations", value: 0.3, color: COLORS.violet, at: from + 12 },
    { label: "Admin & email", value: 0.26, color: COLORS.cyan, at: from + 20 },
    { label: "Posting", value: 0.04, color: COLORS.coral, at: CUES.littleTime },
  ];
  const R = 150;
  const stroke = 56;
  const C = 2 * Math.PI * R;
  let acc = 0;
  const highlight = pop(frame, CUES.littleTime, { damping: 9, stiffness: 220 });
  const spin = interpolate(frame, [from, from + 80], [0, 720], { ...clamp, easing: (t) => 1 - (1 - t) ** 2 });
  const size = (R + stroke) * 2;

  return (
    <div style={{ position: "absolute", inset: 0 }}>
      <div style={{ position: "absolute", left: 40, top: (h - size) / 2, width: size, height: size }}>
        <svg width={size} height={size} style={{ transform: "rotate(-90deg)", overflow: "visible" }}>
          <circle cx={size / 2} cy={size / 2} r={R} stroke="rgba(255,255,255,0.08)" strokeWidth={stroke} fill="none" />
          {parts.map((p, i) => {
            const grow = ramp(frame, p.at, 12);
            const len = p.value * C * grow;
            const isPosting = i === parts.length - 1;
            const el = (
              <circle
                key={p.label}
                cx={size / 2}
                cy={size / 2}
                r={R}
                stroke={p.color}
                strokeWidth={isPosting ? stroke + 16 * highlight : stroke}
                fill="none"
                strokeDasharray={`${Math.max(0, len - 4)} ${C}`}
                strokeDashoffset={-acc * C}
                strokeLinecap="butt"
                style={isPosting ? { filter: `drop-shadow(0 0 ${14 * highlight}px ${COLORS.coral})` } : undefined}
              />
            );
            acc += p.value;
            return el;
          })}
        </svg>
        {/* Clock face in the middle */}
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ position: "absolute", inset: 0 }}>
          <circle cx={size / 2} cy={size / 2} r={88} fill="rgba(10,14,36,0.9)" stroke="rgba(255,255,255,0.25)" strokeWidth={4} />
          {Array.from({ length: 12 }).map((_, i) => {
            const a = (i / 12) * Math.PI * 2;
            return (
              <line
                key={i}
                x1={size / 2 + Math.sin(a) * 70}
                y1={size / 2 - Math.cos(a) * 70}
                x2={size / 2 + Math.sin(a) * 78}
                y2={size / 2 - Math.cos(a) * 78}
                stroke="rgba(255,255,255,0.45)"
                strokeWidth={4}
                strokeLinecap="round"
              />
            );
          })}
          <line
            x1={size / 2}
            y1={size / 2}
            x2={size / 2 + Math.sin((spin * Math.PI) / 180) * 60}
            y2={size / 2 - Math.cos((spin * Math.PI) / 180) * 60}
            stroke={COLORS.white}
            strokeWidth={6}
            strokeLinecap="round"
          />
          <line
            x1={size / 2}
            y1={size / 2}
            x2={size / 2 + Math.sin((spin * Math.PI) / 2160) * 40}
            y2={size / 2 - Math.cos((spin * Math.PI) / 2160) * 40}
            stroke={COLORS.amber}
            strokeWidth={8}
            strokeLinecap="round"
          />
          <circle cx={size / 2} cy={size / 2} r={8} fill={COLORS.amber} />
        </svg>
      </div>

      <div style={{ position: "absolute", left: size + 90, top: (h - 4 * 78) / 2, display: "flex", flexDirection: "column", gap: 18 }}>
        {parts.map((p, i) => {
          const s = pop(frame, p.at, { damping: 15 });
          const isPosting = i === parts.length - 1;
          return (
            <div
              key={p.label}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 16,
                height: 60,
                padding: "0 20px 0 14px",
                borderRadius: 18,
                background: isPosting ? `rgba(255,122,89,${0.18 * highlight})` : "transparent",
                border: isPosting ? `2px solid rgba(255,122,89,${0.8 * highlight})` : "2px solid transparent",
                transform: `translateX(${(1 - s) * 50}px) scale(${isPosting ? 1 + 0.06 * highlight : 1})`,
                transformOrigin: "left center",
                opacity: s,
              }}
            >
              <div style={{ width: 22, height: 22, borderRadius: 7, background: p.color }} />
              <Label size={32} weight={700} color={isPosting ? COLORS.coral : COLORS.text}>
                {p.label}
              </Label>
            </div>
          );
        })}
      </div>
    </div>
  );
};
