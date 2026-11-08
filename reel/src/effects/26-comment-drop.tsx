/**
 * 26 Comment drop: comment bubbles fall from the top of the frame, bounce and stack beside the speaker's head,
 * each with an avatar, a name and a like count that ticks up.
 */
import React from "react";
import { interpolate } from "remotion";
import { FONT_UI } from "../theme";
import { clamp, springAt, useEnvelope, type EffectMeta } from "./shared";
import { Sandwich, splitItems, useStage, type KitProps } from "./kit";

export const meta: EffectMeta = {
  n: 26, slug: "comment-drop", name: "Comment drop", durationInFrames: 105, needs: ["face"],
  what: "Comments drop in from the top and stack beside the head, likes ticking up.",
  bestFor: "Questions people ask, objections, \"you asked, so here it is\".",
  avoid: "More than four comments.",
};

export type CommentDropProps = KitProps;

/** text: "name::comment|name::comment" */
export const CommentDrop: React.FC<CommentDropProps> = ({ talent, startAt = 0, text }) => {
  const s = useStage(talent, startAt);
  const { frame, fps, exit } = useEnvelope();
  const items = splitItems(text, "barbara.gentledental::Does it work with our general dentists?|tanya_frontdesk::How long does setup take?|greg.dental::Can I see the X-rays in it?").map((x) => x.split("::"));
  const side = s.face.cx > 540 ? -1 : 1;
  const x = side > 0 ? Math.min(1080 - 560, s.face.x + s.face.w * 1.3) : 40;
  return (
    <Sandwich s={s} front={
      <>
        {items.map(([n, c], i) => {
          const at = 4 + i * 12;
          const k = springAt(frame, fps, at, { damping: 11, stiffness: 160, mass: 0.8 });
          const yEnd = s.face.y - 80 + (items.length - 1 - i) * 170;
          const likes = Math.round(interpolate(frame, [at, at + 40], [0, 40 + i * 37], clamp));
          return (
            <div key={i} style={{ position: "absolute", left: x, top: -200 + (yEnd + 200) * k, width: 540, opacity: Math.min(1, k * 2) * (1 - exit), display: "flex", gap: 16, padding: "18px 22px", borderRadius: 26, background: "rgba(255,255,255,0.95)", boxShadow: "0 16px 40px rgba(0,0,0,0.35)", fontFamily: FONT_UI }}>
              <div style={{ width: 56, height: 56, flex: "none", borderRadius: 28, background: ["#7B4CF0", "#1FA463", "#E89D15"][i % 3], color: "#fff", fontWeight: 800, fontSize: 26, display: "flex", alignItems: "center", justifyContent: "center" }}>{n[0].toUpperCase()}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 24, color: "#111" }}>{n}</div>
                <div style={{ fontSize: 28, color: "#222", lineHeight: 1.25, marginTop: 4 }}>{c}</div>
              </div>
              <div style={{ fontSize: 22, color: "#666", textAlign: "center" }}>♡<br />{likes}</div>
            </div>
          );
        })}
      </>
    } />
  );
};
