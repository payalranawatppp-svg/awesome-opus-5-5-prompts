import React from "react";
import { interpolate } from "remotion";
import { CUES } from "../../edit";
import { BRAND_GRADIENT, COLORS, FONT_DISPLAY, FONT_UI } from "../../theme";
import { Bar, CheckPath, Label, PersonIcon, SignalMark, clamp, easeOut, glass, pop, ramp } from "../kit";
import type { SceneProps } from "./ProblemScenes";

const Heart: React.FC<{ size: number; color: string }> = ({ size, color }) => (
  <svg width={size} height={size} viewBox="0 0 24 24">
    <path d="M12 21s-7.5-4.6-9.6-9.2C.9 8.4 3 4.5 6.7 4.5c2.1 0 3.6 1.2 4.3 2.4.7-1.2 2.2-2.4 4.3-2.4 3.7 0 5.8 3.9 4.3 7.3C19.5 16.4 12 21 12 21z" fill={color} />
  </svg>
);

/** "Start with one useful post and a few genuine replies." */
export const StartSmall: React.FC<SceneProps> = ({ frame, from, w }) => {
  const card = pop(frame, from + 3, { damping: 15 });
  const one = pop(frame, CUES.onePost, { damping: 8, stiffness: 240 });
  const cardW = 470;
  const cardH = 398;
  const replyX = cardW + 70;
  const replyW = w - replyX - 16;

  return (
    <div style={{ position: "absolute", inset: 0 }}>
      <div
        style={{
          position: "absolute",
          left: 16,
          top: 8,
          width: cardW,
          height: cardH,
          transform: `translateY(${(1 - card) * -20}px) scale(${0.88 + 0.12 * card}) rotate(${(1 - card) * -4}deg)`,
          opacity: Math.min(1, card * 1.5),
        }}
      >
        <div style={{ position: "absolute", inset: 0, ...glass(COLORS.blue, 0.6) }} />
        <div style={{ position: "absolute", left: 26, top: 24, display: "flex", gap: 16, alignItems: "center" }}>
          <div style={{ width: 66, height: 66, borderRadius: "50%", background: BRAND_GRADIENT, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <PersonIcon size={44} color={COLORS.white} stroke={9} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <Label size={28} weight={800}>
              Your Business
            </Label>
            <Label size={20} weight={600} color={COLORS.muted}>
              Just now
            </Label>
          </div>
        </div>
        <div style={{ position: "absolute", left: 26, top: 114, display: "flex", flexDirection: "column", gap: 12 }}>
          {[400, 360, 250].map((bw, i) => (
            <Bar key={i} w={bw * ramp(frame, from + 8 + i * 3, 10)} h={14} color="rgba(255,255,255,0.5)" />
          ))}
        </div>
        <div
          style={{
            position: "absolute",
            left: 26,
            right: 26,
            top: 182,
            height: 146,
            borderRadius: 20,
            background: "linear-gradient(135deg, #2F62FF 0%, #7B4DFF 60%, #FF7A59 130%)",
            overflow: "hidden",
          }}
        >
          <svg width={418} height={146} style={{ position: "absolute", inset: 0 }}>
            <path
              d="M24 118 L110 92 L180 100 L262 58 L392 26"
              stroke="rgba(255,255,255,0.9)"
              strokeWidth={8}
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              pathLength={1}
              strokeDasharray={1}
              strokeDashoffset={1 - ramp(frame, CUES.onePost + 4, 16)}
            />
          </svg>
        </div>
        <div style={{ position: "absolute", left: 26, bottom: 22, display: "flex", gap: 22, alignItems: "center" }}>
          <Heart size={30} color={COLORS.rose} />
          <Bar w={60} h={12} />
          <svg width={30} height={30} viewBox="0 0 24 24">
            <path d="M4 5h16v11H9l-5 4z" stroke="rgba(255,255,255,0.7)" strokeWidth={2.2} fill="none" strokeLinejoin="round" />
          </svg>
          <Bar w={40} h={12} />
        </div>
        <div
          style={{
            position: "absolute",
            left: -26,
            top: -30,
            width: 88,
            height: 88,
            borderRadius: "50%",
            background: COLORS.amber,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transform: `scale(${one}) rotate(${(1 - one) * -30}deg)`,
            boxShadow: `0 10px 28px ${COLORS.amber}88`,
          }}
        >
          <span style={{ fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: 56, color: COLORS.ink, marginTop: -4 }}>1</span>
        </div>
      </div>

      {/* Thread line from the post to the replies */}
      <svg width={w} height={414} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
        {CUES.replies.map((at, i) => {
          const y = 70 + i * 132;
          const d = `M${cardW + 16} ${200} C ${cardW + 46} ${200}, ${replyX - 40} ${y}, ${replyX} ${y}`;
          return (
            <path
              key={at}
              d={d}
              stroke="rgba(155,107,255,0.7)"
              strokeWidth={4}
              strokeDasharray="2 10"
              strokeLinecap="round"
              fill="none"
              opacity={ramp(frame, at - 3, 6)}
            />
          );
        })}
      </svg>
      {CUES.replies.map((at, i) => {
        const s = pop(frame, at, { damping: 11, stiffness: 220 });
        const like = pop(frame, at + 8, { damping: 8, stiffness: 260 });
        return (
          <div
            key={at}
            style={{
              position: "absolute",
              left: replyX,
              top: 20 + i * 132,
              width: replyW,
              height: 100,
              transform: `translateX(${(1 - s) * 60}px) scale(${0.7 + 0.3 * s})`,
              transformOrigin: "left center",
              opacity: Math.min(1, s * 1.5),
            }}
          >
            <div style={{ position: "absolute", inset: 0, ...glass(COLORS.violet, 0.55), borderRadius: 26 }} />
            <div style={{ position: "absolute", left: 18, top: 21, display: "flex", gap: 14, alignItems: "center" }}>
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: "50%",
                  background: [COLORS.cyan, COLORS.coral, COLORS.mint][i],
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <PersonIcon size={38} color={COLORS.ink} stroke={10} />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <Bar w={[190, 150, 170][i]} h={13} color="rgba(255,255,255,0.75)" />
                <Bar w={[120, 160, 100][i]} h={13} color="rgba(255,255,255,0.4)" />
              </div>
            </div>
            <div style={{ position: "absolute", right: 18, top: 32, transform: `scale(${like})` }}>
              <Heart size={36} color={COLORS.rose} />
            </div>
          </div>
        );
      })}
    </div>
  );
};

/** "Need a hand staying consistent?" — the empty month from the hook, now a full week. */
export const Consistency: React.FC<SceneProps> = ({ frame, from, w, h }) => {
  const enter = pop(frame, from + 2, { damping: 15 });
  const days = ["M", "T", "W", "T", "F", "S", "S"];
  const cardW = 900;
  const cardH = 330;
  const cell = 100;
  const gap = 18;
  const startTicks = CUES.weekTicks - 6;
  const done = pop(frame, startTicks + days.length * 3 + 2, { damping: 10, stiffness: 220 });

  return (
    <div
      style={{
        position: "absolute",
        left: (w - cardW) / 2,
        top: (h - cardH) / 2,
        width: cardW,
        height: cardH,
        transform: `translateY(${(1 - enter) * -20}px) scale(${0.88 + 0.12 * enter})`,
        opacity: Math.min(1, enter * 1.5),
      }}
    >
      <div style={{ position: "absolute", inset: 0, ...glass(COLORS.mint, 0.5) }} />
      <div style={{ position: "absolute", left: 40, right: 40, top: 32, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Label size={36} weight={800}>
          Your posting week
        </Label>
        <div
          style={{
            padding: "8px 20px",
            borderRadius: 999,
            background: COLORS.mint,
            transform: `scale(${done})`,
            boxShadow: `0 8px 24px ${COLORS.mint}77`,
          }}
        >
          <Label size={26} weight={800} color={COLORS.ink}>
            Consistent
          </Label>
        </div>
      </div>
      <div style={{ position: "absolute", left: (cardW - (days.length * cell + (days.length - 1) * gap)) / 2, top: 120, display: "flex", gap }}>
        {days.map((d, i) => {
          const at = startTicks + i * 3;
          const s = pop(frame, at, { damping: 10, stiffness: 240 });
          const lit = frame >= at;
          return (
            <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
              <Label size={26} weight={700} color={COLORS.muted}>
                {d}
              </Label>
              <div
                style={{
                  width: cell,
                  height: cell,
                  borderRadius: 26,
                  border: lit ? `3px solid ${COLORS.mint}` : "2px dashed rgba(255,255,255,0.25)",
                  background: lit ? `rgba(53,224,161,${0.18 + 0.7 * s})` : "rgba(255,255,255,0.03)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transform: `scale(${lit ? 0.9 + 0.1 * s : 1})`,
                }}
              >
                <CheckPath progress={ramp(frame, at, 6)} size={78} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

/** "Let's build your plan." — logo + button; a cursor clicks it on "plan". */
export const CtaCard: React.FC<SceneProps> = ({ frame, from, w }) => {
  const logo = pop(frame, from, { damping: 14 });
  const btn = pop(frame, from + 5, { damping: 13 });
  const click = CUES.ctaClick;
  const press = frame >= click ? 1 - 0.06 * Math.sin(Math.min(1, (frame - click) / 6) * Math.PI) : 1;
  const ripple = ramp(frame, click, 16);
  const shine = ramp(frame, click + 6, 16);
  const btnW = 660;
  const btnH = 124;
  const btnX = (w - btnW) / 2;
  const btnY = 196;
  const target = { x: btnX + btnW * 0.72, y: btnY + btnH * 0.62 };
  const move = interpolate(frame, [from + 6, click - 1], [0, 1], { ...clamp, easing: easeOut });
  const cx = interpolate(move, [0, 1], [w - 90, target.x]);
  const cy = interpolate(move, [0, 1], [334, target.y]);
  const cursorScale = frame >= click ? 1 - 0.15 * Math.sin(Math.min(1, (frame - click) / 5) * Math.PI) : 1;
  const sparkle = ramp(frame, click + 1, 18);

  return (
    <div style={{ position: "absolute", inset: 0 }}>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 26,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 18,
          transform: `translateY(${(1 - logo) * -20}px) scale(${0.8 + 0.2 * logo})`,
          opacity: Math.min(1, logo * 1.5),
        }}
      >
        <SignalMark size={118} p={ramp(frame, from, 18)} />
        <span
          style={{
            fontFamily: FONT_DISPLAY,
            fontWeight: 800,
            fontSize: 78,
            letterSpacing: -1.5,
            background: BRAND_GRADIENT,
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            color: "transparent",
          }}
        >
          Signal Reach
        </span>
      </div>

      <div
        style={{
          position: "absolute",
          left: btnX,
          top: btnY,
          width: btnW,
          height: btnH,
          transform: `translateY(${(1 - btn) * 40}px) scale(${(0.85 + 0.15 * btn) * press})`,
          opacity: Math.min(1, btn * 1.5),
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: btnH / 2,
            background: BRAND_GRADIENT,
            boxShadow: `0 18px 50px rgba(76,125,255,0.55), inset 0 2px 0 rgba(255,255,255,0.35)`,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: -20,
              bottom: -20,
              width: 90,
              left: interpolate(shine, [0, 1], [-120, btnW + 40]),
              transform: "rotate(20deg)",
              background: "linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,0.55), rgba(255,255,255,0))",
              opacity: shine > 0 && shine < 1 ? 1 : 0,
            }}
          />
        </div>
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", gap: 18 }}>
          <span style={{ fontFamily: FONT_UI, fontWeight: 800, fontSize: 48, color: COLORS.white, letterSpacing: -0.5 }}>Build your plan</span>
          <svg width={44} height={44} viewBox="0 0 24 24" style={{ transform: `translateX(${frame >= click ? 6 * Math.sin(Math.min(1, (frame - click) / 8) * Math.PI) : 0}px)` }}>
            <path d="M4 12h15M13 5l7 7-7 7" stroke={COLORS.white} strokeWidth={3} fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        {ripple > 0 && ripple < 1 && (
          <div
            style={{
              position: "absolute",
              left: target.x - btnX - 40,
              top: target.y - btnY - 40,
              width: 80,
              height: 80,
              borderRadius: "50%",
              border: "4px solid rgba(255,255,255,0.9)",
              transform: `scale(${1 + ripple * 4})`,
              opacity: 1 - ripple,
            }}
          />
        )}
      </div>

      {sparkle > 0 &&
        sparkle < 1 &&
        Array.from({ length: 10 }).map((_, i) => {
          const a = (i / 10) * Math.PI * 2;
          const d = 80 + sparkle * 260;
          const sx = btnX + btnW / 2 + Math.cos(a) * d * 1.3;
          const sy = btnY + btnH / 2 + Math.sin(a) * d * 0.4;
          const col = [COLORS.cyan, COLORS.amber, COLORS.violet, COLORS.mint, COLORS.coral][i % 5];
          return (
            <svg key={i} width={34} height={34} viewBox="0 0 24 24" style={{ position: "absolute", left: sx - 17, top: sy - 17, transform: `scale(${1 - sparkle}) rotate(${sparkle * 90}deg)` }}>
              <path d="M12 0 L14.5 9.5 L24 12 L14.5 14.5 L12 24 L9.5 14.5 L0 12 L9.5 9.5 Z" fill={col} />
            </svg>
          );
        })}

      {move > 0 && (
        <svg
          width={64}
          height={64}
          viewBox="0 0 24 24"
          style={{ position: "absolute", left: cx - 8, top: cy - 4, transform: `scale(${cursorScale})`, transformOrigin: "8px 4px", filter: "drop-shadow(0 6px 10px rgba(0,0,0,0.5))" }}
        >
          <path d="M3 2 L3 19 L7.5 14.8 L10.6 21.5 L13.6 20.1 L10.6 13.6 L17 13.4 Z" fill={COLORS.white} stroke={COLORS.ink} strokeWidth={1.4} strokeLinejoin="round" />
        </svg>
      )}
    </div>
  );
};
