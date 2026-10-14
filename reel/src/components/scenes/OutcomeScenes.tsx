import React from "react";
import { interpolate } from "remotion";
import { CUES } from "../../edit";
import { COLORS, FONT_DISPLAY } from "../../theme";
import { CheckBadge, Label, PersonIcon, clamp, glass, pop, ramp } from "../kit";
import type { SceneProps } from "./ProblemScenes";

/** "The aim?" — an arrow thuds into a bullseye exactly on the word. */
export const AimTarget: React.FC<SceneProps> = ({ frame, from, w, h }) => {
  const enter = pop(frame, from + 1, { damping: 14 });
  const hit = CUES.aimHit;
  const flight = interpolate(frame, [hit - 7, hit], [0, 1], { ...clamp, easing: (t) => t * t });
  const impact = frame >= hit ? pop(frame, hit, { damping: 7, stiffness: 260 }) : 0;
  const squash = frame >= hit ? 1 - 0.07 * Math.sin(Math.min(1, (frame - hit) / 6) * Math.PI) : 1;
  const wobble = frame >= hit ? 5 * Math.exp(-(frame - hit) / 4) * Math.sin((frame - hit) * 1.9) : 0;
  const ripple = ramp(frame, hit, 14);
  const cx = w / 2;
  const cy = h / 2;
  const rings = [180, 138, 96, 54];
  // Arrow flies in from the right, staying inside the stage (never through the caption band).
  const startX = cx + 600;
  const startY = cy - 60;
  const tipX = interpolate(flight, [0, 1], [startX, cx]);
  const tipY = interpolate(flight, [0, 1], [startY, cy]);
  const angle = Math.atan2(startY - cy, startX - cx);
  const len = 230;

  return (
    <div style={{ position: "absolute", inset: 0, transform: `scale(${enter})`, opacity: Math.min(1, enter * 1.5) }}>
      <svg width={w} height={h} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
        <g transform={`translate(${cx} ${cy}) scale(${squash}) translate(${-cx} ${-cy})`}>
          {rings.map((r, i) => (
            <circle
              key={r}
              cx={cx}
              cy={cy}
              r={r}
              fill={i % 2 === 0 ? COLORS.coral : "#FFF4EE"}
              stroke="rgba(0,0,0,0.12)"
              strokeWidth={2}
            />
          ))}
          <circle cx={cx} cy={cy} r={18} fill={COLORS.ink} />
        </g>
        {ripple > 0 && ripple < 1 && (
          <circle cx={cx} cy={cy} r={60 + ripple * 136} fill="none" stroke={COLORS.amber} strokeWidth={6} opacity={1 - ripple} />
        )}
        {flight > 0 && (
          <g transform={`rotate(${wobble} ${tipX} ${tipY})`}>
            <line
              x1={tipX}
              y1={tipY}
              x2={tipX + Math.cos(angle) * len}
              y2={tipY + Math.sin(angle) * len}
              stroke={COLORS.white}
              strokeWidth={10}
              strokeLinecap="round"
            />
            <polygon
              points={`${tipX},${tipY} ${tipX + Math.cos(angle + 0.45) * 40},${tipY + Math.sin(angle + 0.45) * 40} ${tipX + Math.cos(angle - 0.45) * 40},${tipY + Math.sin(angle - 0.45) * 40}`}
              fill={COLORS.white}
            />
            {[0, 1].map((k) => {
              const bx = tipX + Math.cos(angle) * (len - 10 - k * 26);
              const by = tipY + Math.sin(angle) * (len - 10 - k * 26);
              return (
                <g key={k}>
                  <line x1={bx} y1={by} x2={bx + Math.cos(angle + 0.7) * 38} y2={by + Math.sin(angle + 0.7) * 38} stroke={COLORS.amber} strokeWidth={9} strokeLinecap="round" />
                  <line x1={bx} y1={by} x2={bx + Math.cos(angle - 0.7) * 38} y2={by + Math.sin(angle - 0.7) * 38} stroke={COLORS.amber} strokeWidth={9} strokeLinecap="round" />
                </g>
              );
            })}
          </g>
        )}
      </svg>
      {impact > 0 &&
        Array.from({ length: 8 }).map((_, i) => {
          const a = (i / 8) * Math.PI * 2 + 0.3;
          const d = 40 + ripple * 150;
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: cx + Math.cos(a) * d - 7,
                top: cy + Math.sin(a) * d - 7,
                width: 14,
                height: 14,
                borderRadius: 4,
                background: i % 2 ? COLORS.amber : COLORS.white,
                transform: `rotate(45deg) scale(${1 - ripple})`,
              }}
            />
          );
        })}
    </div>
  );
};

const OutcomeCard: React.FC<{
  frame: number;
  at: number;
  index: number;
  accent: string;
  title: string;
  children: React.ReactNode;
}> = ({ frame, at, index, accent, title, children }) => {
  const s = pop(frame, at, { damping: 13, stiffness: 180 });
  const cardW = 290;
  const left = 20 + index * (cardW + 21);
  return (
    <div
      style={{
        position: "absolute",
        left,
        top: 8,
        width: cardW,
        height: 398,
        transform: `translateY(${(1 - s) * -20}px) scale(${0.85 + 0.15 * s})`,
        opacity: Math.min(1, s * 1.5),
      }}
    >
      <div style={{ position: "absolute", inset: 0, ...glass(accent, 0.7) }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 22, height: 238 }}>{children}</div>
      <div style={{ position: "absolute", left: 20, right: 20, bottom: 26, display: "flex", justifyContent: "center" }}>
        <Label size={33} weight={800} style={{ whiteSpace: "normal", textAlign: "center", lineHeight: 1.1 }}>
          {title}
        </Label>
      </div>
    </div>
  );
};

/** "A more active page, relevant followers, and conversations that could become leads" */
export const Outcomes: React.FC<SceneProps> = ({ frame }) => {
  // Card 1: activity bars rise (the opposite of the flatline in the hook).
  const bars = [0.28, 0.42, 0.5, 0.7, 0.95];
  const trend = ramp(frame, CUES.outActive + 10, 12);
  // Card 2: relevant followers join.
  const people = [
    [62, 62],
    [145, 40],
    [228, 62],
    [62, 150],
    [145, 128],
    [228, 150],
  ];
  // Card 3: two chat bubbles, then a lead badge.
  const lead = pop(frame, CUES.outLeads, { damping: 8, stiffness: 230 });
  const leadShine = ramp(frame, CUES.outLeads + 4, 12);

  return (
    <div style={{ position: "absolute", inset: 0 }}>
      <OutcomeCard frame={frame} at={CUES.outActive - 2} index={0} accent={COLORS.mint} title="More active page">
        <svg width={290} height={238} style={{ overflow: "visible" }}>
          {bars.map((b, i) => {
            const g = ramp(frame, CUES.outActive + i * 3, 12);
            const bh = 170 * b * g;
            return <rect key={i} x={36 + i * 46} y={205 - bh} width={32} height={bh} rx={9} fill={i === bars.length - 1 ? COLORS.mint : "rgba(53,224,161,0.55)"} />;
          })}
          <path
            d="M40 170 L95 140 L140 128 L190 96 L250 40"
            stroke={COLORS.white}
            strokeWidth={6}
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            pathLength={1}
            strokeDasharray={1}
            strokeDashoffset={1 - trend}
          />
          <polygon points="250,40 226,44 244,62" fill={COLORS.white} opacity={trend > 0.95 ? 1 : 0} />
        </svg>
      </OutcomeCard>

      <OutcomeCard frame={frame} at={CUES.outFollowers - 2} index={1} accent={COLORS.cyan} title="Relevant followers">
        {people.map(([x, y], i) => {
          const s = pop(frame, CUES.outFollowers + 2 + i * 3, { damping: 11, stiffness: 220 });
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: x - 38,
                top: y + 10,
                width: 76,
                height: 76,
                borderRadius: "50%",
                background: i % 3 === 1 ? COLORS.cyan : "rgba(47,212,240,0.28)",
                border: `3px solid ${COLORS.cyan}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transform: `scale(${s})`,
              }}
            >
              <PersonIcon size={50} color={i % 3 === 1 ? COLORS.ink : COLORS.white} stroke={9} />
            </div>
          );
        })}
        <CheckBadge frame={frame} at={CUES.outFollowers + 22} size={52} color={COLORS.cyan} style={{ position: "absolute", left: 120, top: 196 }} />
      </OutcomeCard>

      <OutcomeCard frame={frame} at={CUES.outConversations - 2} index={2} accent={COLORS.violet} title="Conversations → leads">
        {[0, 1].map((i) => {
          const s = pop(frame, CUES.outConversations + 3 + i * 7, { damping: 12, stiffness: 200 });
          const fromLeft = i === 0;
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: fromLeft ? 26 : 92,
                top: 12 + i * 70,
                width: 172,
                height: 58,
                borderRadius: 20,
                borderBottomLeftRadius: fromLeft ? 4 : 20,
                borderBottomRightRadius: fromLeft ? 20 : 4,
                background: fromLeft ? "rgba(155,107,255,0.35)" : COLORS.violet,
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "0 16px",
                transform: `translateX(${(1 - s) * (fromLeft ? -40 : 40)}px) scale(${s})`,
                transformOrigin: fromLeft ? "left bottom" : "right bottom",
              }}
            >
              {[0, 1, 2].map((d) => (
                <div key={d} style={{ width: 12, height: 12, borderRadius: "50%", background: "rgba(255,255,255,0.85)" }} />
              ))}
            </div>
          );
        })}
        <div
          style={{
            position: "absolute",
            left: 145 - 20,
            top: 146,
            width: 40,
            height: 40,
            opacity: lead,
          }}
        >
          <svg width={40} height={40} viewBox="0 0 40 40">
            <path d="M20 4v26M9 20l11 12 11-12" stroke={COLORS.amber} strokeWidth={6} fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <div
          style={{
            position: "absolute",
            left: 145 - 92,
            top: 190,
            width: 184,
            height: 56,
            borderRadius: 999,
            background: COLORS.amber,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
            transform: `scale(${lead})`,
            boxShadow: `0 10px 30px ${COLORS.amber}88`,
            overflow: "hidden",
          }}
        >
          <svg width={30} height={30} viewBox="0 0 24 24">
            <path d="M12 2l2.9 6.6 7.1.6-5.4 4.7 1.6 7L12 17.3 5.8 20.9l1.6-7L2 9.2l7.1-.6z" fill={COLORS.ink} />
          </svg>
          <span style={{ fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: 32, color: COLORS.ink }}>Lead</span>
          <div
            style={{
              position: "absolute",
              top: -10,
              bottom: -10,
              width: 40,
              left: interpolate(leadShine, [0, 1], [-60, 220]),
              transform: "rotate(20deg)",
              background: "rgba(255,255,255,0.6)",
              opacity: leadShine > 0 && leadShine < 1 ? 1 : 0,
            }}
          />
        </div>
      </OutcomeCard>
    </div>
  );
};

/** "…without taking over your day." — a calm clock; the small slice we handle gets a check. */
export const YourDay: React.FC<SceneProps> = ({ frame, from, h }) => {
  const enter = pop(frame, from + 1, { damping: 14 });
  const R = 150;
  const cx = 200;
  const cy = h / 2;
  const settle = interpolate(frame, [from, from + 26], [0, 1], { ...clamp, easing: (t) => 1 - (1 - t) ** 3 });
  const minute = -360 + settle * (360 + 60);
  const hour = 300 + settle * 30;
  const wedgeColor = frame >= CUES.dayCheck ? COLORS.mint : COLORS.coral;
  const wedge = (a0: number, a1: number) => {
    const p = (a: number) => [cx + Math.sin((a * Math.PI) / 180) * (R - 14), cy - Math.cos((a * Math.PI) / 180) * (R - 14)];
    const [x0, y0] = p(a0);
    const [x1, y1] = p(a1);
    return `M${cx} ${cy} L${x0} ${y0} A${R - 14} ${R - 14} 0 0 1 ${x1} ${y1} Z`;
  };
  const text1 = pop(frame, from + 6, { damping: 15 });
  const text2 = pop(frame, CUES.dayCheck, { damping: 12 });

  return (
    <div style={{ position: "absolute", inset: 0 }}>
      <div style={{ position: "absolute", inset: 0, transform: `scale(${0.8 + 0.2 * enter})`, opacity: Math.min(1, enter * 1.5), transformOrigin: `${cx}px ${cy}px` }}>
        <svg width={420} height={h} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
          <circle cx={cx} cy={cy} r={R} fill="rgba(255,255,255,0.94)" stroke={COLORS.mint} strokeWidth={8} />
          <path d={wedge(0, 45)} fill={wedgeColor} opacity={0.85} />
          {Array.from({ length: 12 }).map((_, i) => {
            const a = (i / 12) * Math.PI * 2;
            return (
              <line
                key={i}
                x1={cx + Math.sin(a) * (R - 26)}
                y1={cy - Math.cos(a) * (R - 26)}
                x2={cx + Math.sin(a) * (R - 12)}
                y2={cy - Math.cos(a) * (R - 12)}
                stroke={COLORS.ink}
                strokeWidth={i % 3 === 0 ? 7 : 4}
                strokeLinecap="round"
              />
            );
          })}
          <line x1={cx} y1={cy} x2={cx + Math.sin((hour * Math.PI) / 180) * 70} y2={cy - Math.cos((hour * Math.PI) / 180) * 70} stroke={COLORS.ink} strokeWidth={12} strokeLinecap="round" />
          <line x1={cx} y1={cy} x2={cx + Math.sin((minute * Math.PI) / 180) * 108} y2={cy - Math.cos((minute * Math.PI) / 180) * 108} stroke={COLORS.ink} strokeWidth={7} strokeLinecap="round" />
          <circle cx={cx} cy={cy} r={11} fill={COLORS.coral} />
        </svg>
        <CheckBadge frame={frame} at={CUES.dayCheck} size={84} style={{ position: "absolute", left: cx + 82, top: cy - R - 6 }} />
      </div>
      <div style={{ position: "absolute", left: 420, top: cy - 100, display: "flex", flexDirection: "column", gap: 4 }}>
        <div style={{ opacity: text1, transform: `translateX(${(1 - text1) * 40}px)` }}>
          <span style={{ fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: 76, color: COLORS.text }}>Your day,</span>
        </div>
        <div style={{ opacity: text2, transform: `translateX(${(1 - text2) * 40}px)` }}>
          <span style={{ fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: 76, color: COLORS.mint }}>still yours.</span>
        </div>
      </div>
    </div>
  );
};
