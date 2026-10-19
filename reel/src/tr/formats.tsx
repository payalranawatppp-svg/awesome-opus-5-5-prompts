/**
 * Every ToothReferral animation in three looks: vertical (1080x1920), horizontal (1920x1080) and
 * transparent (no background, alpha) for overlaying on footage.
 *
 *   Studio / render ids: "TR-05-case-lifecycle" (vertical), "TR-05-case-lifecycle-h" (horizontal)
 *   Transparent: --props='{"transparent":true}'  (+ for horizontal "side": "left" | "center" | "right")
 *   ProRes 4444 with alpha: scripts/render_tr_alpha.sh
 */
import React from "react";
import { AbsoluteFill, getInputProps } from "remotion";
import { FontGate } from "../effects";
import { TR_CUSTOM } from "./custom";
import { TR_SCENES } from "./scenes";
import { Stage, TransparentContext } from "./ui";

export const TR_ALL = [...TR_SCENES, ...TR_CUSTOM];

/** The scenes keep their content between these rows of the vertical canvas. */
const BAND = { top: 280, bottom: 1700 };

export type TrFormatProps = { id: string; horizontal?: boolean; transparent?: boolean; side?: "left" | "center" | "right" };

export const TrFormatted: React.FC<TrFormatProps> = (props) => {
  const input = getInputProps() as Partial<TrFormatProps>;
  const transparent = input.transparent ?? props.transparent ?? false;
  const side = input.side ?? props.side ?? "center";
  const scene = TR_ALL.find((s) => s.id === props.id)!;
  const C = scene.C;
  if (!props.horizontal) {
    return (
      <AbsoluteFill>
        <TransparentContext.Provider value={transparent}>
          <FontGate>
            <C />
          </FontGate>
        </TransparentContext.Provider>
      </AbsoluteFill>
    );
  }
  // horizontal: the vertical canvas's content band, scaled to fit the 1080 px height with a margin
  const s = 1000 / (BAND.bottom - BAND.top);
  const w = 1080 * s;
  const x = side === "left" ? 90 : side === "right" ? 1920 - 90 - w : (1920 - w) / 2;
  const y = (1080 - (BAND.bottom - BAND.top) * s) / 2 - BAND.top * s;
  return (
    <AbsoluteFill>
      {!transparent && <Stage>{null}</Stage>}
      <div style={{ position: "absolute", left: x, top: y, width: 1080, height: 1920, transform: `scale(${s})`, transformOrigin: "0 0" }}>
        <TransparentContext.Provider value={true}>
          <FontGate>
            <C />
          </FontGate>
        </TransparentContext.Provider>
      </div>
    </AbsoluteFill>
  );
};
