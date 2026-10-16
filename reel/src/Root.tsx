import React from "react";
import { Composition } from "remotion";
import { DURATION, FPS } from "./edit";
import { EFFECTS } from "./effects";
import { FxPreview } from "./effects/FxPreview";
import { LayoutQA } from "./LayoutQA";
import { Reel } from "./Reel";
import { ReelFx } from "./reelfx/ReelFx";
import { EffectsShowcase, SHOWCASE_DURATION } from "./showcase/EffectsShowcase";
import { HEIGHT, WIDTH } from "./theme";

export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="SignalReachReel" component={Reel} durationInFrames={DURATION} fps={FPS} width={WIDTH} height={HEIGHT} />
    <Composition id="LayoutQA" component={LayoutQA} durationInFrames={DURATION} fps={FPS} width={WIDTH * 3} height={HEIGHT} />
    <Composition id="SignalReachReelFx" component={ReelFx} durationInFrames={DURATION} fps={FPS} width={WIDTH} height={HEIGHT} />
    <Composition id="EffectsShowcase" component={EffectsShowcase} durationInFrames={SHOWCASE_DURATION} fps={30} width={WIDTH} height={HEIGHT} />
    {EFFECTS.map(({ meta }) => (
      <Composition
        key={meta.slug}
        id={`Fx-${String(meta.n).padStart(2, "0")}-${meta.slug}`}
        component={FxPreview}
        defaultProps={{ n: meta.n }}
        durationInFrames={meta.durationInFrames}
        fps={30}
        width={WIDTH}
        height={HEIGHT}
      />
    ))}
  </>
);
