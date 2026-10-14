import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { CUES, DURATION, SEGMENTS } from "../edit";
import { useFontsReady } from "../fonts";
import { stageBox } from "../layout";
import { ZONES } from "../theme";
import { clamp } from "./kit";
import { CtaCard, Consistency, StartSmall } from "./scenes/CtaScenes";
import { AimTarget, Outcomes, YourDay } from "./scenes/OutcomeScenes";
import { QuietProfile, type SceneProps, TimeSqueeze } from "./scenes/ProblemScenes";
import { BrandServices } from "./scenes/SolutionScenes";

const seg = (id: string) => SEGMENTS.find((s) => s.id === id)!.from;

/** Scenes run back-to-back: each one has fully exited before the next appears,
 *  so two graphics never share the stage. */
export const SCENES: { name: string; from: number; to: number; C: React.FC<SceneProps> }[] = [
  { name: "quiet-profile", from: CUES.profileIn, to: seg("hook-c"), C: QuietProfile },
  { name: "time-squeeze", from: seg("hook-c"), to: CUES.toSolution, C: TimeSqueeze },
  { name: "brand-services", from: CUES.toSolution, to: CUES.toOutcome, C: BrandServices },
  { name: "aim", from: CUES.toOutcome, to: CUES.outActive - 4, C: AimTarget },
  { name: "outcomes", from: CUES.outActive - 4, to: CUES.yourDay - 2, C: Outcomes },
  { name: "your-day", from: CUES.yourDay - 2, to: CUES.toCta, C: YourDay },
  { name: "start-small", from: CUES.toCta, to: seg("cta-b"), C: StartSmall },
  { name: "consistency", from: seg("cta-b"), to: seg("cta-c"), C: Consistency },
  { name: "cta", from: seg("cta-c"), to: DURATION, C: CtaCard },
];

const EXIT = 6;

export const Stage: React.FC = () => {
  const frame = useCurrentFrame();
  const ready = useFontsReady();
  if (!ready) return null;
  const scene = SCENES.find((s) => frame >= s.from && frame < s.to);
  if (!scene) return null;
  const box = stageBox(scene.from, scene.to);
  const w = box.x1 - box.x0;
  const h = ZONES.stage.bottom - ZONES.stage.top;
  const out =
    scene.to >= DURATION
      ? 0
      : interpolate(frame, [scene.to - EXIT, scene.to], [0, 1], { ...clamp, easing: Easing.in(Easing.cubic) });
  return (
    <AbsoluteFill>
      <div
        style={{
          position: "absolute",
          left: box.x0,
          top: box.y0,
          width: w,
          height: h,
          transformOrigin: "50% 0%",
          transform: `scale(${box.scale * (1 - 0.06 * out)}) translateY(${-24 * out}px)`,
          opacity: 1 - out,
          filter: out > 0 ? `blur(${out * 6}px)` : undefined,
        }}
      >
        <scene.C frame={frame} from={scene.from} to={scene.to} w={w} h={h} />
      </div>
    </AbsoluteFill>
  );
};
