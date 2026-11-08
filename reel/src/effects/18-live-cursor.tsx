/**
 * 18 Live cursor: a multiplayer cursor with a name tag (Figma style) flies in, hovers over keyword chips that
 * pop up beside the speaker's head, and clicks each one; the clicked chip fills with the cursor's colour.
 */
import React from "react";
import { interpolate } from "remotion";
import { FONT_UI } from "../theme";
import { EASE, clamp, springAt, useEnvelope, type EffectMeta } from "./shared";
import { Cursor, Sandwich, splitItems, useStage, type KitProps } from "./kit";

export const meta: EffectMeta = {
  n: 18, slug: "live-cursor", name: "Live cursor", durationInFrames: 105, needs: ["face"],
  what: "A named multiplayer cursor glides in and clicks keyword chips beside the head, one per beat.",
  bestFor: "Listing tools, features or steps (\"you open it, you click this, you're done\").",
  avoid: "Emotional lines; more than three chips.",
};

export type LiveCursorProps = KitProps & { name?: string; color?: string };

export const LiveCursor: React.FC<LiveCursorProps> = ({ talent, startAt = 0, text, name = "Amanda", color = "#7B4CF0" }) => {
  const s = useStage(talent, startAt);
  const { frame, fps, enter, exit, durationInFrames } = useEnvelope();
  const items = splitItems(text, "Referrals|X-rays|Insurance");
  const side = s.face.cx > 540 ? -1 : 1;
  const chipX = Math.max(40, Math.min(1080 - 400, side > 0 ? s.face.x + s.face.w * 1.05 : s.face.x - 420));
  const step = Math.floor((durationInFrames - 30) / items.length);
  const chips = items.map((t, i) => ({ t, x: chipX, y: s.face.y + s.face.h * 1.25 + i * 120, at: 6 + i * 6, click: 22 + i * step }));
  // cursor path: in from the far side, then to each chip just before its click
  const pts = [{ f: 0, x: side > 0 ? 1180 : -100, y: 1500 }, ...chips.map((c) => ({ f: c.click - 8, x: c.x + 200, y: c.y + 46 }))];
  let cx = pts[0].x, cy = pts[0].y;
  for (let i = 1; i < pts.length; i++) {
    const k = interpolate(frame, [pts[i - 1].f + (i === 1 ? 4 : 2), pts[i].f], [0, 1], { ...clamp, easing: EASE.inOut });
    if (frame >= pts[i - 1].f) { cx = pts[i - 1].x + (pts[i].x - pts[i - 1].x) * k; cy = pts[i - 1].y + (pts[i].y - pts[i - 1].y) * k; }
  }
  const press = chips.reduce((p, c) => Math.max(p, interpolate(frame, [c.click - 2, c.click, c.click + 4], [0, 1, 0], clamp)), 0);
  const o = enter * (1 - exit);
  return (
    <Sandwich s={s} front={
      <div style={{ position: "absolute", inset: 0, opacity: o }}>
        {chips.map((c, i) => {
          const p = springAt(frame, fps, c.at);
          const on = frame >= c.click;
          return (
            <div key={i} style={{ position: "absolute", left: c.x, top: c.y, scale: String(p * (1 + (on ? 0.04 * Math.max(0, 1 - (frame - c.click) / 8) : 0))), transformOrigin: "left center",
              padding: "18px 30px", borderRadius: 22, fontFamily: FONT_UI, fontWeight: 700, fontSize: 44, color: on ? "#fff" : "#151226",
              background: on ? color : "rgba(255,255,255,0.92)", boxShadow: "0 16px 40px rgba(0,0,0,0.35)", border: `3px solid ${on ? color : "rgba(255,255,255,0.6)"}` }}>
              {on ? "✓ " : ""}{c.t}
            </div>
          );
        })}
        <Cursor x={cx} y={cy} size={58} color={color} press={press} />
        <div style={{ position: "absolute", left: cx + 44, top: cy + 52, padding: "6px 16px", borderRadius: 12, background: color, color: "#fff", fontFamily: FONT_UI, fontWeight: 700, fontSize: 30 }}>{name}</div>
      </div>
    } />
  );
};
