import { Easing, interpolate } from "remotion";
import faces from "./data/faces.json";
import { CUES, CUT_END, DURATION, SEGMENTS, type ClipId, segmentAt, sourceTimeAt } from "./edit";
import { WIDTH } from "./theme";

/** Source footage is 720x1280. Base framing scales it to 1123px wide and drops it so the
 *  head sits in the lower ~55% of the frame; the bottom of the source (burned-in captions
 *  and generator watermark below y≈1040) never reaches the visible area. */
export const SRC_W = 720;
export const SRC_H = 1280;
export const BASE_SCALE = 1.56;
export const BASE_LEFT = WIDTH / 2 - (SRC_W / 2) * BASE_SCALE;
export const BASE_TOP = 676;

type Box = { x0: number; y0: number; x1: number; y1: number };

const faceTrack = faces as Record<ClipId, { fps: number; faces: number[][] }>;

const faceAt = (clip: ClipId, t: number) => {
  const track = faceTrack[clip];
  const i = Math.max(0, Math.min(track.faces.length - 1, Math.floor(t * track.fps + 1e-6)));
  const [x, y, w, h] = track.faces[i];
  return { x, y, w, h };
};

/** Zoom anchor per clip: mean face centre, in base-framed output pixels. Fixed per clip so zooms never drift. */
const ANCHORS: Record<ClipId, { x: number; y: number }> = Object.fromEntries(
  (Object.keys(faceTrack) as ClipId[]).map((clip) => {
    const list = faceTrack[clip].faces;
    const cx = list.reduce((s, f) => s + f[0] + f[2] / 2, 0) / list.length;
    const cy = list.reduce((s, f) => s + f[1] + f[3] / 2, 0) / list.length;
    return [clip, { x: BASE_LEFT + cx * BASE_SCALE, y: BASE_TOP + cy * BASE_SCALE }];
  }),
) as Record<ClipId, { x: number; y: number }>;

const ease = Easing.bezier(0.22, 1, 0.36, 1);
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

const TRANSITION_IN = 9;
const TRANSITION_OUT = 4;
/** Output frames where a new story section starts (= where the previous one ends). */
export const SECTION_CUTS = new Set(
  SEGMENTS.filter((s, i) => i > 0 && s.section !== SEGMENTS[i - 1].section).map((s) => s.from),
);

/** Per-segment framing. Jump cuts alternate between wide and punched-in framings. */
const SEGMENT_ZOOM: Record<string, [number, number]> = {
  "hook-a": [1.0, 1.02],
  "hook-b": [1.075, 1.095],
  "hook-c": [1.0, 1.03],
  solution: [1.02, 1.06],
  outcome: [1.0, 1.04],
  "cta-a": [1.0, 1.03],
  "cta-b": [1.075, 1.09],
  "cta-c": [1.0, 1.05],
};

export type Camera = { z: number; ax: number; ay: number; dx: number; dy: number; blur: number; clip: ClipId };

export const cameraAt = (frame: number): Camera => {
  const seg = segmentAt(frame);
  const local = frame - seg.from;
  const span = seg.id === "cta-c" ? DURATION - seg.from : seg.duration;
  const [z0, z1] = SEGMENT_ZOOM[seg.id];
  let z = interpolate(local, [0, span], [z0, z1], clamp);
  let blur = 0;

  // Hook: start punched in and pull back to reveal the speaker.
  if (seg.id === "hook-a") z += interpolate(frame, [0, 14], [0.1, 0], { ...clamp, easing: ease });

  // Section transitions: zoom-through with motion blur either side of the cut.
  if (SECTION_CUTS.has(seg.from)) {
    z += interpolate(local, [0, TRANSITION_IN], [0.09, 0], { ...clamp, easing: ease });
    blur = Math.max(blur, interpolate(local, [0, TRANSITION_IN], [9, 0], { ...clamp, easing: ease }));
  }
  const toEnd = seg.from + seg.duration - frame;
  if (SECTION_CUTS.has(seg.from + seg.duration) && toEnd <= TRANSITION_OUT) {
    z += interpolate(toEnd, [0, TRANSITION_OUT], [0.05, 0], clamp);
    blur = Math.max(blur, interpolate(toEnd, [0, TRANSITION_OUT], [6, 0], clamp));
  }

  // "The aim?" — snap punch-in with a short decaying shake, released at "A more active page".
  let dx = 0;
  let dy = 0;
  if (seg.id === "outcome") {
    const hit = CUES.aimHit;
    const punch = interpolate(frame, [hit - 3, hit], [0, 0.06], { ...clamp, easing: Easing.out(Easing.cubic) });
    const release = interpolate(frame, [CUES.outActive - 2, CUES.outActive + 10], [1, 0], { ...clamp, easing: ease });
    z += punch * release;
    const s = frame - hit;
    if (s >= 0 && s < 10) {
      const amp = 7 * Math.exp(-s / 3);
      dx = amp * Math.sin(s * 2.6);
      dy = amp * 0.6 * Math.cos(s * 3.1);
    }
  }

  const anchor = ANCHORS[seg.clip];
  return { z, ax: anchor.x, ay: anchor.y, dx, dy, blur, clip: seg.clip };
};

/** Map a source-pixel point through base framing + camera into output pixels. */
export const project = (cam: Camera, sx: number, sy: number) => {
  const bx = BASE_LEFT + sx * BASE_SCALE;
  const by = BASE_TOP + sy * BASE_SCALE;
  return { x: cam.ax + (bx - cam.ax) * cam.z + cam.dx, y: cam.ay + (by - cam.ay) * cam.z + cam.dy };
};

/** Head-and-body keep-out box of the avatar in output pixels for a frame.
 *  Face detector boxes run brow-to-chin; measured hair height above the box is at most 37% of
 *  the face height across all clips, so 40% is used. */
export const avatarBoxAt = (frame: number): Box => {
  const cam = cameraAt(frame);
  const { clip, t } = sourceTimeAt(Math.min(frame, CUT_END - 1));
  const f = faceAt(clip, t);
  const tl = project(cam, f.x - 0.18 * f.w, f.y - 0.4 * f.h);
  const br = project(cam, f.x + 1.18 * f.w, SRC_H);
  return { x0: tl.x, y0: tl.y, x1: br.x, y1: br.y };
};

/** Highest point the avatar reaches over a frame range (stable layout input for a scene). */
export const minAvatarTop = (from: number, to: number): number => {
  let top = Infinity;
  for (let f = Math.max(0, from); f <= Math.min(DURATION - 1, to); f++) top = Math.min(top, avatarBoxAt(f).y0);
  return top;
};
