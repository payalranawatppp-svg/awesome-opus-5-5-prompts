import React from "react";
import { AbsoluteFill, Freeze, OffthreadVideo, Sequence, staticFile, useCurrentFrame } from "remotion";
import { BASE_LEFT, BASE_SCALE, BASE_TOP, SRC_H, SRC_W, cameraAt } from "../camera";
import { CUT_END, SEGMENTS, type Segment, TAIL_HOLD } from "../edit";

const GRADE = "contrast(1.07) saturate(1.14) brightness(1.03)";

/** Footage fades in between the room's ceiling edge (source y≈116–124) and the highest the
 *  speaker's hair ever reaches (source y≈161), measured across all clips. Mask stops are in the
 *  element's own (pre-zoom) pixels, so the fade follows every camera move. */
const px = (sourceY: number) => `${(sourceY * BASE_SCALE).toFixed(0)}px`;
const FADE_MASK = `linear-gradient(to bottom, rgba(0,0,0,0) ${px(126)}, rgba(0,0,0,0.35) ${px(137)}, rgba(0,0,0,0.8) ${px(149)}, #000 ${px(157)})`;

/** One edit segment, optionally frozen on its last frame (end-card hold). */
const Clip: React.FC<{ seg: Segment; style: React.CSSProperties; freeze?: boolean }> = ({ seg, style, freeze }) => {
  const video = (
    <OffthreadVideo
      src={staticFile(`footage/${seg.clip}.mp4`)}
      trimBefore={seg.in}
      muted
      style={style}
      pauseWhenBuffering
    />
  );
  return freeze ? <Freeze frame={seg.duration - 1}>{video}</Freeze> : video;
};

const EditTrack: React.FC<{ style: React.CSSProperties }> = ({ style }) => {
  const last = SEGMENTS[SEGMENTS.length - 1];
  return (
    <>
      {SEGMENTS.map((seg) => (
        <Sequence key={seg.id} from={seg.from} durationInFrames={seg.duration} layout="none" name={seg.id}>
          <Clip seg={seg} style={style} />
        </Sequence>
      ))}
      <Sequence from={CUT_END} durationInFrames={TAIL_HOLD} layout="none" name="tail-hold">
        <Clip seg={last} style={style} freeze />
      </Sequence>
    </>
  );
};

/** Room extension behind the speaker: the wall colours sampled from the footage just below the
 *  ceiling line (sampled from all four clips, left→right; see README), so the footage can fade out above
 *  the hairline without the room's ceiling edge reading as a hard horizon. */
const WALL = ["#55432e", "#725a43", "#7a6149", "#7e664e", "#7f6851", "#7e6852", "#796655", "#746458", "#6a5f57", "#655d58", "#5d5956", "#535355"];
export const RoomBackdrop: React.FC = () => (
  <AbsoluteFill
    style={{
      background: `linear-gradient(90deg, ${WALL.map((c, i) => `${c} ${((i + 0.5) / WALL.length) * 100}%`).join(", ")})`,
      filter: GRADE,
    }}
  />
);

/** The speaker: base framing + camera moves + grade, faded into the backdrop at the top edge. */
export const Footage: React.FC = () => {
  const frame = useCurrentFrame();
  const cam = cameraAt(frame);
  const w = SRC_W * BASE_SCALE;
  const h = SRC_H * BASE_SCALE;
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <div
        style={{
          position: "absolute",
          left: BASE_LEFT,
          top: BASE_TOP,
          width: w,
          height: h,
          transformOrigin: `${cam.ax - BASE_LEFT}px ${cam.ay - BASE_TOP}px`,
          transform: `translate(${cam.dx}px, ${cam.dy}px) scale(${cam.z})`,
          WebkitMaskImage: FADE_MASK,
          maskImage: FADE_MASK,
        }}
      >
        <EditTrack
          style={{
            width: w,
            height: h,
            filter: cam.blur > 0.05 ? `${GRADE} blur(${cam.blur}px)` : GRADE,
          }}
        />
      </div>
      {/* Grade: gentle vignette + lifted shadows at the bottom for platform UI legibility. */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(120% 80% at 50% 62%, rgba(0,0,0,0) 55%, rgba(5,8,22,0.38) 100%), linear-gradient(to top, rgba(5,8,22,0.55) 0%, rgba(5,8,22,0) 18%)",
        }}
      />
    </AbsoluteFill>
  );
};
