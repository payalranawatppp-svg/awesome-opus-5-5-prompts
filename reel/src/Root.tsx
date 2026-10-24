import React from "react";
import { Composition } from "remotion";
import { DURATION, FPS } from "./edit";
import { EFFECTS } from "./effects";
import { FxPreview } from "./effects/FxPreview";
import { LayoutQA } from "./LayoutQA";
import { Reel } from "./Reel";
import { ReelFx } from "./reelfx/ReelFx";
import { TOOTH_DURATION, ToothFx } from "./reelfx/ToothFx";
import { DEPTH_DURATION, ToothDepth } from "./reelfx/ToothDepth";
import { UGC2_DURATION, ToothUgc2 } from "./reelfx/ToothUgc2";
import { UGC2_REF_DURATION, ToothUgc2Ref } from "./reelfx/ToothUgc2Ref";
import { CB_DURATION, ChocolateBox } from "./reelfx/ChocolateBox";
import { TrDashboardTour } from "./tr/scenes";
import { TR_ALL, TrFormatted } from "./tr/formats";
import { TR_V2 } from "./tr/v2";
import { FontGate } from "./effects";
import { EffectsShowcase, SHOWCASE_DURATION } from "./showcase/EffectsShowcase";
import { HEIGHT, WIDTH } from "./theme";

export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="SignalReachReel" component={Reel} durationInFrames={DURATION} fps={FPS} width={WIDTH} height={HEIGHT} />
    <Composition id="LayoutQA" component={LayoutQA} durationInFrames={DURATION} fps={FPS} width={WIDTH * 3} height={HEIGHT} />
    <Composition id="SignalReachReelFx" component={ReelFx} durationInFrames={DURATION} fps={FPS} width={WIDTH} height={HEIGHT} />
    <Composition id="ChocolateBox" component={ChocolateBox} durationInFrames={CB_DURATION} fps={30} width={WIDTH} height={HEIGHT} />
    <Composition id="ToothReferralUgc2Ad" component={ToothUgc2Ref} durationInFrames={UGC2_REF_DURATION} fps={30} width={WIDTH} height={HEIGHT} />
    <Composition id="ToothReferralUgc2" component={ToothUgc2} durationInFrames={UGC2_DURATION} fps={30} width={WIDTH} height={HEIGHT} />
    <Composition id="ToothReferralDepth" component={ToothDepth} durationInFrames={DEPTH_DURATION} fps={30} width={WIDTH} height={HEIGHT} />
    <Composition id="ToothReferralFx" component={ToothFx} durationInFrames={TOOTH_DURATION} fps={30} width={WIDTH} height={HEIGHT} />
    <Composition id="TR-Dashboard-Tour" component={() => <FontGate><TrDashboardTour scenes={TR_ALL} /></FontGate>} durationInFrames={TR_ALL.reduce((s, x) => s + x.dur, 0)} fps={30} width={WIDTH} height={HEIGHT} />
    <Composition id="TR-V2-Showreel" component={() => <FontGate><TrDashboardTour scenes={TR_V2} /></FontGate>} durationInFrames={TR_V2.reduce((s, x) => s + x.dur, 0)} fps={30} width={WIDTH} height={HEIGHT} />
    {TR_ALL.map(({ id, dur }) => (
      <React.Fragment key={id}>
        <Composition id={id} component={TrFormatted} defaultProps={{ id }} durationInFrames={dur} fps={30} width={WIDTH} height={HEIGHT} />
        <Composition id={`${id}-h`} component={TrFormatted} defaultProps={{ id, horizontal: true }} durationInFrames={dur} fps={30} width={1920} height={1080} />
      </React.Fragment>
    ))}
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
