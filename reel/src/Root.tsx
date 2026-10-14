import React from "react";
import { Composition } from "remotion";
import { DURATION, FPS } from "./edit";
import { LayoutQA } from "./LayoutQA";
import { Reel } from "./Reel";
import { HEIGHT, WIDTH } from "./theme";

export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="SignalReachReel" component={Reel} durationInFrames={DURATION} fps={FPS} width={WIDTH} height={HEIGHT} />
    <Composition id="LayoutQA" component={LayoutQA} durationInFrames={DURATION} fps={FPS} width={WIDTH * 3} height={HEIGHT} />
  </>
);
