/**
 * 21 Predict keys: a phone-keyboard strip slides up under the speaker; keys light up as a word is typed into a
 * text field, and the predictive-text bar above the keys offers three suggestions; the right one is tapped
 * and fills the field.
 */
import React from "react";
import { interpolate } from "remotion";
import { FONT_UI } from "../theme";
import { clamp, springAt, useEnvelope, type EffectMeta } from "./shared";
import { Sandwich, splitItems, useStage, type KitProps } from "./kit";

export const meta: EffectMeta = {
  n: 21, slug: "predict-keys", name: "Predict keys", durationInFrames: 105, needs: ["face"],
  what: "A phone keyboard types a word, the suggestion bar predicts the rest, and the right suggestion is tapped.",
  bestFor: "\"You already know what I'm going to say\", search intent, the obvious answer.",
  avoid: "Long phrases (one short word or two).",
};

const ROWS = ["qwertyuiop", "asdfghjkl", "zxcvbnm"];

export type PredictKeysProps = KitProps & { typed?: string; pick?: number };

/** text: "typed|suggestion1|suggestion2|suggestion3"; `pick` is the suggestion that gets tapped (0-2). */
export const PredictKeys: React.FC<PredictKeysProps> = ({ talent, startAt = 0, text, pick = 1 }) => {
  const s = useStage(talent, startAt);
  const { frame, fps, enter, exit } = useEnvelope();
  const [typed, ...sugg] = splitItems(text, "tooth|toothpaste|Tooth Referral|toothbrush");
  const perKey = 5;
  const nTyped = Math.min(typed.length, Math.max(0, Math.floor((frame - 12) / perKey) + 1));
  const cur = frame >= 12 && nTyped > 0 && nTyped <= typed.length ? typed[nTyped - 1].toLowerCase() : "";
  const keyHit = interpolate((frame - 12) % perKey, [0, 2, 4], [1, 0.4, 0], clamp);
  const tapAt = 12 + typed.length * perKey + 14;
  const tapped = frame >= tapAt;
  const field = tapped ? sugg[pick] : typed.slice(0, nTyped);
  const y = 1920 - 700 + (1 - enter) * 700 + exit * 700;
  return (
    <Sandwich s={s} front={
      <div style={{ position: "absolute", left: 0, top: y, width: 1080, height: 700, background: "rgba(210,213,222,0.94)", borderTop: "1px solid #fff", fontFamily: FONT_UI }}>
        <div style={{ position: "absolute", left: 40, right: 40, top: -150, height: 110, borderRadius: 55, background: "#fff", boxShadow: "0 12px 40px rgba(0,0,0,0.3)", display: "flex", alignItems: "center", paddingLeft: 44, fontSize: 52, fontWeight: 600, color: "#111" }}>
          {field}<span style={{ opacity: frame % 20 < 10 && !tapped ? 1 : 0, color: "#3478F6", marginLeft: 4 }}>|</span>
        </div>
        <div style={{ display: "flex", height: 100, borderBottom: "1px solid rgba(0,0,0,0.1)" }}>
          {sugg.map((g, i) => {
            const show = springAt(frame, fps, 12 + 2 * perKey + i * 2);
            const hit = tapped && i === pick;
            return <div key={i} style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 40, fontWeight: i === pick ? 700 : 500, color: "#111", opacity: show, background: hit ? "rgba(52,120,246,0.25)" : "transparent", borderLeft: i ? "1px solid rgba(0,0,0,0.12)" : "none" }}>{g}</div>;
          })}
        </div>
        {ROWS.map((r, ri) => (
          <div key={ri} style={{ display: "flex", justifyContent: "center", gap: 12, marginTop: 22 }}>
            {r.split("").map((k) => {
              const on = k === cur ? keyHit : 0;
              return <div key={k} style={{ width: 88, height: 112, borderRadius: 14, background: on ? "#9aa0ad" : "#fff", boxShadow: "0 2px 0 rgba(0,0,0,0.3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 50, color: "#111", translate: `0 ${-on * 40}px`, scale: String(1 + on * 0.35) }}>{k}</div>;
            })}
          </div>
        ))}
      </div>
    } />
  );
};
