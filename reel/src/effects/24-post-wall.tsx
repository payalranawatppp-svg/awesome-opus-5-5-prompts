/**
 * 24 Post wall: social posts (avatar, name, a line of text, likes) tile the wall behind the speaker, dropping
 * in one after another with a slight tilt, then the wall slowly drifts up.
 */
import React from "react";
import { AbsoluteFill } from "remotion";
import { FONT_UI } from "../theme";
import { rand, springAt, useEnvelope, type EffectMeta } from "./shared";
import { Sandwich, splitItems, useStage, type KitProps } from "./kit";

export const meta: EffectMeta = {
  n: 24, slug: "post-wall", name: "Post wall", durationInFrames: 105, needs: ["cutout", "plate"],
  what: "A wall of social posts fills the background behind the speaker, one card at a time.",
  bestFor: "Social proof, \"everyone's talking about...\", reviews, testimonials.",
  avoid: "Lines that need the viewer to read every card.",
};

export type PostWallProps = KitProps & { names?: string };

export const PostWall: React.FC<PostWallProps> = ({ talent, startAt = 0, text, names }) => {
  const s = useStage(talent, startAt);
  const { frame, fps, exit } = useEnvelope();
  const posts = splitItems(text, "Got my referral note the same day.|No more phone tag with the specialist.|Our front desk finally breathes.|Every X-ray in one place.|We never lose a referral now.|Set up in five minutes. Seriously.|The general dentist loves it.|Ghost rate down to 7%.");
  const who = splitItems(names, "Barbara|Tanya|Amanda|Greg");
  const cols = 3;
  const drift = -frame * 1.2;
  return (
    <Sandwich s={s} plate behind={
      <AbsoluteFill style={{ background: "rgba(10,10,24,0.55)" }}>
        {posts.concat(posts).map((p, i) => {
          const c = i % cols, r = Math.floor(i / cols);
          const at = 2 + i * 3;
          const k = springAt(frame, fps, at);
          return (
            <div key={i} style={{ position: "absolute", left: 30 + c * 350, top: 120 + r * 300 + drift + (1 - k) * -200, width: 320, padding: 22, borderRadius: 22, background: "#fff", boxShadow: "0 12px 30px rgba(0,0,0,0.35)", rotate: `${(rand(i) - 0.5) * 8}deg`, opacity: k * (1 - exit), fontFamily: FONT_UI }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 44, height: 44, borderRadius: 22, background: ["#7B4CF0", "#1FA463", "#E89D15", "#2F6FEB"][i % 4], color: "#fff", fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center" }}>{who[i % who.length][0]}</div>
                <div style={{ fontWeight: 700, fontSize: 24, color: "#111" }}>{who[i % who.length]}</div>
              </div>
              <div style={{ fontSize: 26, color: "#222", marginTop: 10, lineHeight: 1.3 }}>{p}</div>
              <div style={{ fontSize: 20, color: "#888", marginTop: 10 }}>♥ {12 + Math.round(rand(i + 3) * 300)}</div>
            </div>
          );
        })}
      </AbsoluteFill>
    } />
  );
};
