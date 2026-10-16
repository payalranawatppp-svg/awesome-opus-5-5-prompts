import React from "react";
import { AbsoluteFill } from "remotion";
import { EFFECTS } from "./index";
import { FontGate } from "./shared";

/** Studio preview of one effect with its default props (composition "Fx-NN-slug"). */
export const FxPreview: React.FC<{ n: number }> = ({ n }) => {
  const { Component } = EFFECTS[n - 1];
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <FontGate>
        <Component />
      </FontGate>
    </AbsoluteFill>
  );
};
