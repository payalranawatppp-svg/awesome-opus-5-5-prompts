import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { avatarBoxAt } from "./camera";
import { Captions } from "./components/Captions";
import { Stage } from "./components/Stage";
import { HEIGHT, WIDTH } from "./theme";

/**
 * Layout verification render. Three 1080x1920 panels side by side on black:
 *   [0] captions, [1] motion-graphics stage, [2] avatar keep-out box.
 * Every visible pixel is forced to white, so scripts/check_layout_qa.py can AND the
 * panels together per frame and fail on any caption/graphic/avatar collision in the
 * real rendered output (including animation overshoot, shadows and glows).
 */
const Silhouette: React.FC<{ index: number; children: React.ReactNode }> = ({ index, children }) => (
  <div style={{ position: "absolute", left: index * WIDTH, top: 0, width: WIDTH, height: HEIGHT, overflow: "hidden" }}>
    <AbsoluteFill style={{ filter: "brightness(0) invert(1)" }}>{children}</AbsoluteFill>
  </div>
);

const AvatarBox: React.FC = () => {
  const frame = useCurrentFrame();
  const b = avatarBoxAt(frame);
  return (
    <div
      style={{
        position: "absolute",
        left: b.x0,
        top: b.y0,
        width: b.x1 - b.x0,
        height: b.y1 - b.y0,
        background: "#fff",
        borderRadius: "40% 40% 0 0",
      }}
    />
  );
};

export const LayoutQA: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#000" }}>
    <Silhouette index={0}>
      <Captions />
    </Silhouette>
    <Silhouette index={1}>
      <Stage />
    </Silhouette>
    <Silhouette index={2}>
      <AvatarBox />
    </Silhouette>
  </AbsoluteFill>
);
