/**
 * Shared pieces for the "editing kit" effects (18-37): our own versions of the effects named in the
 * Justyn Berkovits editing-kit reel (Live cursor, Clone row, Day dial, Predict keys, Orbit ring, Code body,
 * Post wall, Letter dive, Comment drop, Layer explode, Sketch words, Blade slice, Head stack, Rack focus,
 * Banknote, Voice note, Impact frame, Dolly zoom, Press front, Paper tear, Blow away). Built from scratch
 * from the names and the look of that reel; none of the kit's own files are used.
 */
import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS, FONT_MONO } from "../theme";
import { DEFAULT_TALENT, Finish, TalentLayer, frameOnFace, useFace, type Face, type Framing, type Talent } from "./shared";

export type KitProps = {
  talent?: Talent;
  /** seconds into the clip at the effect's first frame */
  startAt?: number;
  /** main text (lines or items joined with "|") */
  text?: string;
};

export const splitItems = (text: string | undefined, fallback: string) => (text ?? fallback).split("|").map((s) => s.trim()).filter(Boolean);

/** Framing + smoothed face for the current frame. */
export const useStage = (tl: Talent = DEFAULT_TALENT, startAt = 0, scale?: number) => {
  const framing: Framing = frameOnFace(tl, scale ? { scale } : {});
  const face: Face = useFace(tl, framing, startAt, 0.2);
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  return { tl, framing, face, frame, fps, durationInFrames, startAt };
};
export type Stage = ReturnType<typeof useStage>;

/** The usual sandwich: the full clip, `behind` graphics, the speaker's cutout on top, `front` graphics, grain. */
export const Sandwich: React.FC<{ s: Stage; behind?: React.ReactNode; front?: React.ReactNode; plate?: boolean; grade?: string; style?: React.CSSProperties }> = ({ s, behind, front, plate, grade, style }) => (
  <AbsoluteFill style={{ background: COLORS.ink, ...style }}>
    <TalentLayer talent={s.tl} layer={plate ? "plate" : "full"} framing={s.framing} startAt={s.startAt} />
    {behind}
    {behind || plate ? <TalentLayer talent={s.tl} layer="cutout" framing={s.framing} startAt={s.startAt} /> : null}
    {front}
    <Finish grade={grade} />
  </AbsoluteFill>
);

/** Typewriter-style paper label (the "head stack" chip look): big word + small word. */
export const PaperChip: React.FC<{ big: string; small?: string; size?: number; style?: React.CSSProperties }> = ({ big, small, size = 64, style }) => (
  <div
    style={{
      display: "inline-flex",
      alignItems: "baseline",
      gap: size * 0.22,
      padding: `${size * 0.16}px ${size * 0.34}px ${size * 0.2}px`,
      background: "linear-gradient(180deg, #FBF8EF, #EFE9DA)",
      borderRadius: size * 0.16,
      boxShadow: "0 10px 26px rgba(0,0,0,0.35), 0 2px 0 rgba(255,255,255,0.8) inset",
      fontFamily: FONT_MONO,
      fontWeight: 700,
      color: "#141414",
      whiteSpace: "nowrap",
      ...style,
    }}
  >
    <span style={{ fontSize: size, letterSpacing: "-0.02em" }}>{big}</span>
    {small ? <span style={{ fontSize: size * 0.48, fontWeight: 500 }}>{small}</span> : null}
  </div>
);

/** Small macOS-style arrow cursor. */
export const Cursor: React.FC<{ x: number; y: number; size?: number; color?: string; press?: number }> = ({ x, y, size = 46, color = "#111", press = 0 }) => (
  <svg width={size} height={size * 1.2} viewBox="0 0 22 26" style={{ position: "absolute", left: x - 3, top: y - 2, scale: String(1 - 0.15 * press), transformOrigin: "3px 2px", filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.35))" }}>
    <path d="M2 2 L2 20 L7 15 L11 24 L14 22.5 L10 14 L17 14 Z" fill={color} stroke="#fff" strokeWidth={1.6} strokeLinejoin="round" />
  </svg>
);
