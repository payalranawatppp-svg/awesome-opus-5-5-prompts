/**
 * 38 Blow away: a word (or a stack of "old way" items) sitting beside the speaker disintegrates into dust that
 * blows off the frame, Thanos-style: the text is cut into a grid of tiles that drift, rotate and fade with a
 * sweeping delay from left to right.
 */
import React from "react";
import { interpolate } from "remotion";
import { FONT_DISPLAY } from "../theme";
import { EASE, clamp, rand, springAt, useEnvelope, type EffectMeta } from "./shared";
import { Sandwich, splitItems, useStage, type KitProps } from "./kit";

export const meta: EffectMeta = {
  n: 38, slug: "blow-away", name: "Blow away", durationInFrames: 90, needs: ["cutout", "face"],
  what: "Words beside the speaker crumble into dust and blow off the screen.",
  bestFor: "Getting rid of the old way (\"faxes, voicemails, inbox threads, gone\").",
  avoid: "Positive words you want to keep on screen.",
};

export type BlowAwayProps = KitProps & { color?: string };

export const BlowAway: React.FC<BlowAwayProps> = ({ talent, startAt = 0, text, color = "#FFFFFF" }) => {
  const s = useStage(talent, startAt);
  const { frame, fps, durationInFrames } = useEnvelope(1);
  const words = splitItems(text, "FAXES|VOICEMAILS|INBOX THREADS");
  const blowAt = Math.round(durationInFrames * 0.45);
  const cols = 14, rows = 5;
  const W = 760, Hh = 140;
  return (
    <Sandwich s={s} behind={
      <>
        {words.map((w, wi) => {
          const top = s.face.y - 200 + wi * 170;
          const k = springAt(frame, fps, 2 + wi * 5);
          return (
            <div key={wi} style={{ position: "absolute", left: 540 - W / 2, top, width: W, height: Hh }}>
              {Array.from({ length: cols * rows }, (_, i) => {
                const c = i % cols, r = Math.floor(i / cols);
                const delay = blowAt + wi * 3 + c * 1.6 + rand(i + wi * 99) * 6;
                const p = interpolate(frame, [delay, delay + 26], [0, 1], { ...clamp, easing: EASE.in });
                const dx = p * (300 + rand(i * 1.3 + wi) * 500);
                const dy = p * (-120 - rand(i * 2.1 + wi) * 260);
                return (
                  <div key={i} style={{ position: "absolute", left: (c * W) / cols, top: (r * Hh) / rows, width: W / cols + 0.5, height: Hh / rows + 0.5, overflow: "hidden", translate: `${dx}px ${dy}px`, rotate: `${p * (rand(i) - 0.5) * 220}deg`, opacity: k * (1 - p), scale: String(1 - 0.6 * p) }}>
                    <div style={{ position: "absolute", left: -(c * W) / cols, top: -(r * Hh) / rows, width: W, height: Hh, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: 120, color, letterSpacing: "-0.02em", textShadow: "0 6px 24px rgba(0,0,0,0.5)" }}>{w}</div>
                  </div>
                );
              })}
            </div>
          );
        })}
      </>
    } />
  );
};
