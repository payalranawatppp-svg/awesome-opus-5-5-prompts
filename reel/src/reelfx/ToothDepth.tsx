/**
 * ToothReferral UGC video with the TR animations dropped in without their purple background.
 *
 * At three talking-head moments the room behind the speaker frosts over (blur, dim, purple tint), the speaker
 * (RVM cutout, public/cutouts/05-talk.webm) eases back a little behind it, and the transparent animation floats on
 * top, so it reads as part of the shot instead of a cut to a slide. Timed to the words
 * (src/data/transcript-05.json):
 *   "...sends dental referrals by phone and fax"               TR-12 before / after
 *   "With ToothReferral, the whole referral goes out..."       TR-14 case stack (ends on the cut to the UI insert)
 *   "It is free for general dentists. If you refer..."         TR-16 CTA end card (holds to the end)
 */
import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { FontGate, TALENT, TalentLayer } from "../effects";
import transcript from "../data/transcript-05.json";
import { COLORS } from "../theme";
import { TrFormatted } from "../tr/formats";
import { TR, clamp } from "../tr/ui";

const TL = TALENT["05-talk"];
const FPS = 30;
export const DEPTH_DURATION = Math.floor(TL.seconds * FPS);

const WORDS = transcript["05-talk"].words;
const at = (word: string, n = 1) => {
  const hits = WORDS.filter((w) => w.word.toLowerCase().replace(/[^a-z]/g, "") === word);
  if (!hits[n - 1]) throw new Error(`"${word}" #${n} not in transcript`);
  return Math.round(hits[n - 1].start * FPS);
};

/** Footage cuts (ffmpeg scene detection): talking-head stretches end at these seconds. */
const CUT_INSERT_1 = Math.round(19.79 * FPS);

const MOMENTS = [
  { id: "TR-12-before-after", from: 12, dur: 150 },
  { id: "TR-14-case-stack", from: at("with") - 3, dur: CUT_INSERT_1 - (at("with") - 3) },
  { id: "TR-16-cta", from: at("it") - 4, dur: DEPTH_DURATION - (at("it") - 4) },
];

const FULL = { scale: 1.5, x: 0, y: 0 };
/** Burned-in captions sit around output rows 1330-1490. */
const CAPTION_MASK = "linear-gradient(180deg, #000 0px, #000 1200px, transparent 1310px)";

/** Frosted room + speaker pushed back, for one moment. `hold` keeps it on to the end (no ease-out). */
const Depth: React.FC<{ startAt: number; hold?: boolean }> = ({ startAt, hold }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const k = Math.min(interpolate(frame, [0, 12], [0, 1], clamp), hold ? 1 : interpolate(frame, [durationInFrames - 10, durationInFrames - 1], [1, 0], clamp));
  const push = 1 - 0.06 * k;
  return (
    <AbsoluteFill>
      <TalentLayer talent={TL} layer="full" framing={FULL} startAt={startAt} style={{ filter: `blur(${(k * 28).toFixed(1)}px) brightness(${1 - k * 0.4}) saturate(${1 + k * 0.2})`, scale: String(1 + k * 0.08) }} />
      <AbsoluteFill style={{ background: `linear-gradient(180deg, ${TR.stage1}CC 0%, ${TR.stage2}66 55%, ${TR.stage1}CC 100%)`, opacity: k * 0.75 }} />
      {/* the cutout carries the burned-in captions where they cross the speaker; fade it out above them */}
      <AbsoluteFill style={{ scale: String(push), transformOrigin: "50% 100%", filter: `blur(${(k * 2.5).toFixed(1)}px) brightness(${1 - k * 0.25})`, opacity: k, maskImage: CAPTION_MASK, WebkitMaskImage: CAPTION_MASK }}>
        <TalentLayer talent={TL} layer="cutout" framing={FULL} startAt={startAt} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const ToothDepth: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ background: COLORS.ink }}>
      <TalentLayer talent={TL} layer="full" framing={FULL} />
      <FontGate>
        {MOMENTS.map((m, i) => (
          <Sequence key={m.id} from={m.from} durationInFrames={m.dur} premountFor={fps} name={m.id}>
            <Depth startAt={m.from / fps} hold={i === MOMENTS.length - 1} />
            <TrFormatted id={m.id} transparent />
          </Sequence>
        ))}
      </FontGate>
      <Audio src={staticFile("audio/voice/05-talk.wav")} />
      {MOMENTS.map((m) => (
        <Sequence key={m.id} from={m.from} layout="none">
          <Audio src={staticFile("audio/sfx/whoosh-short.wav")} volume={0.25} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
