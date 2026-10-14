import React from "react";
import { interpolate } from "remotion";
import { CUES } from "../../edit";
import { BRAND_GRADIENT, COLORS, FONT_DISPLAY } from "../../theme";
import { ChatIcon, CheckBadge, InboxIcon, Label, PlaneIcon, PostIcon, SignalMark, clamp, easeOut, glass, pop, ramp } from "../kit";
import type { SceneProps } from "./ProblemScenes";

const SERVICES = [
  { label: "Useful posts", Icon: PostIcon, color: COLORS.blue, at: CUES.svcPosts },
  { label: "Comment replies", Icon: ChatIcon, color: COLORS.violet, at: CUES.svcReplies },
  { label: "Personal outreach", Icon: PlaneIcon, color: COLORS.coral, at: CUES.svcOutreach },
  { label: "Inbox management", Icon: InboxIcon, color: COLORS.mint, at: CUES.svcInbox },
];

/** "At Signal Reach, we help with the whole picture." → brand reveal that becomes the hub
 *  of a 2x2 grid; each service lights up exactly when it is named. */
export const BrandServices: React.FC<SceneProps> = ({ frame, w, h }) => {
  const reveal = ramp(frame, CUES.brand - 5, 22);
  const wordmark = pop(frame, CUES.brand + 2, { damping: 16 });
  const toHub = ramp(frame, CUES.wholePicture - 2, 12);
  const pulseP = ((frame - CUES.brand) % 30) / 30;

  // Logo: centred and large, then shrinks into the hub at the grid centre.
  const markSize = interpolate(toHub, [0, 1], [190, 92]);
  const hubCY = interpolate(toHub, [0, 1], [h / 2 - 70, h / 2]);
  const wordOpacity = 1 - ramp(frame, CUES.wholePicture - 4, 6);

  const tileW = 440;
  const tileH = 186;
  const gapX = 32;
  const gapY = 26;
  const gridX = (w - (tileW * 2 + gapX)) / 2;
  const gridY = (h - (tileH * 2 + gapY)) / 2;
  const complete = pop(frame, CUES.servicesComplete, { damping: 9, stiffness: 200 });
  const shimmer = ramp(frame, CUES.servicesComplete, 14);

  const lastActivation = [...SERVICES].reverse().find((s) => frame >= s.at);
  const ping = lastActivation ? ramp(frame, lastActivation.at, 14) : 1;

  return (
    <div style={{ position: "absolute", inset: 0 }}>
      {SERVICES.map((s, i) => {
        const col = i % 2;
        const row = Math.floor(i / 2);
        const tx = gridX + col * (tileW + gapX);
        const ty = gridY + row * (tileH + gapY);
        const fly = pop(frame, CUES.wholePicture + 2 + i * 2, { damping: 15, stiffness: 150 });
        const fromX = w / 2 - tileW / 2 - tx;
        const fromY = h / 2 - tileH / 2 - ty;
        const on = pop(frame, s.at, { damping: 11, stiffness: 210 });
        const lit = frame >= s.at;
        const iconBounce = lit ? 1 + 0.18 * Math.sin(Math.min(1, (frame - s.at) / 9) * Math.PI) : 1;
        return (
          <div
            key={s.label}
            style={{
              position: "absolute",
              left: tx,
              top: ty,
              width: tileW,
              height: tileH,
              transform: `translate(${(1 - fly) * fromX}px, ${(1 - fly) * fromY}px) scale(${(0.4 + 0.6 * fly) * (1 + 0.03 * complete * (1 - shimmer))})`,
              opacity: Math.min(1, fly * 1.4),
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: 0,
                ...glass(lit ? s.color : undefined, 0.6 + 0.4 * on),
                borderStyle: lit ? "solid" : "dashed",
              }}
            />
            {/* "whole picture" shimmer sweep once all four are lit */}
            <div style={{ position: "absolute", inset: 0, borderRadius: 34, overflow: "hidden" }}>
              <div
                style={{
                  position: "absolute",
                  top: -40,
                  bottom: -40,
                  width: 120,
                  left: interpolate(shimmer, [0, 1], [-160, tileW + 160]) - (col * 60 + row * 30),
                  transform: "rotate(18deg)",
                  background: "linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,0.35), rgba(255,255,255,0))",
                  opacity: shimmer > 0 && shimmer < 1 ? 1 : 0,
                }}
              />
            </div>
            <div
              style={{
                position: "absolute",
                left: col === 0 ? 30 : 92,
                top: 0,
                bottom: 0,
                display: "flex",
                alignItems: "center",
                gap: 22,
                opacity: lit ? 1 : 0.42,
              }}
            >
              <div
                style={{
                  width: 96,
                  height: 96,
                  borderRadius: 26,
                  background: lit ? s.color : "rgba(255,255,255,0.08)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transform: `scale(${iconBounce})`,
                  boxShadow: lit ? `0 10px 30px ${s.color}77` : "none",
                }}
              >
                <s.Icon size={62} color={lit ? COLORS.white : COLORS.muted} stroke={8} />
              </div>
              <Label size={34} weight={700} style={{ whiteSpace: "normal", width: col === 0 ? 270 : 230 }}>
                {s.label}
              </Label>
            </div>
            {/* Check sits on the tile's outer corner, away from the central hub. */}
            <CheckBadge
              frame={frame}
              at={s.at + 3}
              size={56}
              style={{
                position: "absolute",
                ...(col === 0 ? { left: -14 } : { right: -14 }),
                ...(row === 0 ? { top: -12 } : { bottom: -8 }),
              }}
            />
          </div>
        );
      })}

      {/* Brand mark → hub */}
      <div
        style={{
          position: "absolute",
          left: w / 2 - 70,
          top: hubCY - 70,
          width: 140,
          height: 140,
          borderRadius: "50%",
          background: `rgba(10,14,36,${0.92 * toHub})`,
          border: `3px solid rgba(47,212,240,${0.7 * toHub})`,
          boxShadow: toHub > 0 ? `0 0 ${30 + 30 * complete}px rgba(47,212,240,${0.45 * toHub})` : "none",
          transform: `scale(${1 + 0.12 * complete * (1 - shimmer)})`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 5,
        }}
      >
        {toHub > 0.6 && (
          <div
            style={{
              position: "absolute",
              inset: -6,
              borderRadius: "50%",
              border: `4px solid ${lastActivation?.color ?? COLORS.cyan}`,
              transform: `scale(${1 + ping * 0.9})`,
              opacity: (1 - ping) * 0.9,
            }}
          />
        )}
        <SignalMark size={markSize} p={reveal} pulse={toHub < 0.1 && frame > CUES.brand + 14 ? pulseP : 0} />
      </div>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: h / 2 + 30,
          display: "flex",
          justifyContent: "center",
          opacity: wordOpacity * Math.min(1, wordmark * 1.3),
          transform: `translateY(${(1 - wordmark) * 40}px)`,
          letterSpacing: interpolate(wordmark, [0, 1], [18, -1.5], { ...clamp, easing: easeOut }),
        }}
      >
        <span
          style={{
            fontFamily: FONT_DISPLAY,
            fontWeight: 800,
            fontSize: 96,
            background: BRAND_GRADIENT,
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            color: "transparent",
            filter: "drop-shadow(0 8px 26px rgba(76,125,255,0.45))",
          }}
        >
          Signal Reach
        </span>
      </div>
    </div>
  );
};
