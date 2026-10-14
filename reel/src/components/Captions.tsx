import React from "react";
import { AbsoluteFill, interpolate, interpolateColors, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { CAPTION_EXIT, CHUNKS, type Chunk } from "../edit";
import { useFontsReady } from "../fonts";
import { CAPTION, type CaptionLayout, layoutCaption } from "../layout";
import { COLORS, FONT_DISPLAY } from "../theme";

const layoutCache = new Map<number, CaptionLayout>();
export const captionLayoutFor = (chunk: Chunk) => {
  let l = layoutCache.get(chunk.index);
  if (!l) {
    l = layoutCaption(chunk);
    layoutCache.set(chunk.index, l);
  }
  return l;
};

export const activeChunkAt = (frame: number) => CHUNKS.find((c) => frame >= c.start && frame < c.end + CAPTION_EXIT);

/** Readable ink on light accents, white on saturated/dark ones. */
const LIGHT_ACCENTS = new Set([COLORS.amber, COLORS.mint, COLORS.cyan]);

const ChunkView: React.FC<{ chunk: Chunk; frame: number }> = ({ chunk, frame }) => {
  const { fps } = useVideoConfig();
  const layout = captionLayoutFor(chunk);
  const exitP = interpolate(frame, [chunk.end, chunk.end + CAPTION_EXIT], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const lineH = layout.fontSize * CAPTION.lineHeight;
  const pad = layout.fontSize * CAPTION.padEm;

  return (
    <AbsoluteFill
      style={{
        opacity: 1 - exitP,
        transform: `translateY(${-16 * exitP}px)`,
        filter: exitP > 0 ? `blur(${4 * exitP}px)` : undefined,
      }}
    >
      {layout.lines.flatMap((line) =>
        line.words.map(({ index, x, width }) => {
          const w = chunk.words[index];
          const next = chunk.words[index + 1];
          // The whole phrase rises in together (readable at once); words light up as spoken.
          // The hook question is fully on screen from frame 0 (cover frame + instant read).
          const enterLocal = frame - chunk.start - index;
          const s =
            chunk.index === 0
              ? 1
              : enterLocal < 0
                ? 0
                : spring({ frame: enterLocal, fps, config: { damping: 14, mass: 0.6, stiffness: 180 } });
          const appear = Math.round(w.start) - 1;
          const local = frame - appear;
          const spoken = interpolate(local, [0, 3], [0.5, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          const activeEnd = next ? Math.round(next.start) : Math.round(w.end) + 4;
          const active = frame >= appear && frame < activeEnd;
          const pillIn = local < 0 ? 0 : spring({ frame: local, fps, config: { damping: 18, stiffness: 260 }, durationInFrames: 6 });
          const pillOut = interpolate(frame, [activeEnd - 1, activeEnd + 2], [1, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          const pill = active || frame < activeEnd + 2 ? pillIn * pillOut : 0;
          const accent = w.accent;
          const pillColor = accent ?? COLORS.blue;
          const ink = accent && LIGHT_ACCENTS.has(accent) ? COLORS.ink : COLORS.white;
          const color = interpolateColors(pill, [0, 1], [accent ?? COLORS.text, ink]);
          return (
            <div
              key={`${chunk.index}-${index}`}
              style={{
                position: "absolute",
                left: x,
                top: line.y,
                width,
                height: lineH,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transform: `translateY(${(1 - s) * 22}px) scale(${0.72 + 0.28 * s + 0.05 * pill})`,
                opacity: Math.min(1, s * 1.6) * spoken,
              }}
            >
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  right: 0,
                  top: lineH * 0.06,
                  bottom: lineH * 0.06,
                  borderRadius: layout.fontSize * 0.24,
                  background: pillColor,
                  opacity: pill,
                  transform: `scale(${0.85 + 0.15 * pill}) rotate(${(index % 2 ? 1 : -1) * 1.2}deg)`,
                  boxShadow: `0 10px 30px ${pillColor}66`,
                }}
              />
              <span
                style={{
                  position: "relative",
                  fontFamily: FONT_DISPLAY,
                  fontWeight: Number(CAPTION.weight),
                  fontSize: layout.fontSize,
                  letterSpacing: CAPTION.letterSpacing,
                  lineHeight: 1,
                  color,
                  whiteSpace: "nowrap",
                  textShadow: `0 3px 0 rgba(4,6,18,${0.55 * (1 - pill)}), 0 8px 26px rgba(4,6,18,${0.65 * (1 - pill)})`,
                  paddingLeft: pad,
                  paddingRight: pad,
                }}
              >
                {w.text}
              </span>
            </div>
          );
        }),
      )}
    </AbsoluteFill>
  );
};

export const Captions: React.FC = () => {
  const frame = useCurrentFrame();
  const ready = useFontsReady();
  if (!ready) return null;
  const chunk = activeChunkAt(frame);
  if (!chunk) return null;
  return <ChunkView chunk={chunk} frame={frame} />;
};
