/**
 * 33 Voice note: a chat voice-note bubble pops up beside the speaker's head; its waveform bars play from left
 * to right with a moving playhead and a running timer, as if the line he says were a voice message.
 */
import React from "react";
import { interpolate } from "remotion";
import { FONT_UI } from "../theme";
import { clamp, rand, springAt, useEnvelope, type EffectMeta } from "./shared";
import { Sandwich, useStage, type KitProps } from "./kit";

export const meta: EffectMeta = {
  n: 33, slug: "voice-note", name: "Voice note", durationInFrames: 105, needs: ["face"],
  what: "A messenger voice-note bubble plays beside the head, waveform and timer moving with the line.",
  bestFor: "Quoting someone (\"my office manager sent me this...\"), voicemails, messages.",
  avoid: "Lines that are not a message or a quote.",
};

export type VoiceNoteProps = KitProps & { name?: string; color?: string; seconds?: number };

export const VoiceNote: React.FC<VoiceNoteProps> = ({ talent, startAt = 0, name = "Tanya · Front desk", color = "#7B4CF0", seconds }) => {
  const s = useStage(talent, startAt);
  const { frame, fps, exit, durationInFrames } = useEnvelope();
  const k = springAt(frame, fps, 2, { damping: 12, stiffness: 180 });
  const len = seconds ?? (durationInFrames - 20) / fps;
  const prog = interpolate(frame, [8, 8 + len * fps], [0, 1], clamp);
  const bars = 34;
  const side = s.face.cx > 540 ? -1 : 1;
  const w = 600;
  const x = Math.max(30, Math.min(1080 - w - 30, s.face.cx - w / 2));
  const t = Math.floor(prog * len);
  return (
    <Sandwich s={s} front={
      <div style={{ position: "absolute", left: x, top: s.face.y + s.face.h * 1.3, width: w, scale: String(k), transformOrigin: side > 0 ? "left bottom" : "right bottom", opacity: 1 - exit, fontFamily: FONT_UI }}>
        <div style={{ fontSize: 26, fontWeight: 700, color: "#fff", marginBottom: 8, textShadow: "0 2px 8px rgba(0,0,0,0.6)" }}>{name}</div>
        <div style={{ display: "flex", alignItems: "center", gap: 18, padding: "22px 26px", borderRadius: 40, borderBottomLeftRadius: side > 0 ? 8 : 40, background: color, boxShadow: "0 18px 44px rgba(0,0,0,0.4)" }}>
          <div style={{ width: 64, height: 64, borderRadius: 32, background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", flex: "none" }}>
            <div style={{ display: "flex", gap: 7 }}><div style={{ width: 8, height: 26, background: color, borderRadius: 2 }} /><div style={{ width: 8, height: 26, background: color, borderRadius: 2 }} /></div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 5, flex: 1, height: 70 }}>
            {Array.from({ length: bars }, (_, i) => {
              const played = i / bars < prog;
              const live = Math.abs(i / bars - prog) < 0.04 ? 1 + 0.4 * Math.sin(frame) : 1;
              const h = (14 + rand(i * 3.1) * 50) * live;
              return <div key={i} style={{ width: 7, height: h, borderRadius: 4, background: played ? "#fff" : "rgba(255,255,255,0.45)" }} />;
            })}
          </div>
          <div style={{ fontSize: 28, fontWeight: 700, color: "#fff", fontVariantNumeric: "tabular-nums" }}>0:{String(t).padStart(2, "0")}</div>
        </div>
      </div>
    } />
  );
};
