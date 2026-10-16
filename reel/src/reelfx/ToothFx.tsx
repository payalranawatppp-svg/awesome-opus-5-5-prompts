/**
 * ToothReferral UGC video, finished with three effects from the library.
 *
 * The source is already edited (burned-in captions, UI inserts, side chips), so the base plays untouched
 * and full frame with its own audio, and the effects sit only in talking-head stretches, each timed to
 * the words (faster-whisper word timestamps, src/data/transcript-05.json):
 *   "...still sends dental referrals by phone and fax"   Doodle boil: "still faxing?"
 *   "...goes out as one secure package"                   Digital zoom snaps in on "secure"
 *   "It is free for general dentists"                     Glass type "Free"
 * The talent's frameScale (1.5) keeps every effect at the full frame, so the burned-in captions stay.
 */
import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useVideoConfig } from "remotion";
import { DigitalZoom, DoodleBoil, FontGate, GlassType, TALENT, TalentLayer } from "../effects";
import transcript from "../data/transcript-05.json";
import { COLORS } from "../theme";

const TL = TALENT["05-talk"];
export const TOOTH_FPS = 30;
export const TOOTH_DURATION = Math.floor(TL.seconds * TOOTH_FPS);

const WORDS = transcript["05-talk"].words;
/** Output frame (30 fps) where a word starts; `n`: occurrence. */
const at = (word: string, n = 1) => {
  const hits = WORDS.filter((w) => w.word.toLowerCase().replace(/[^a-z]/g, "") === word);
  if (!hits[n - 1]) throw new Error(`"${word}" #${n} not in transcript`);
  return Math.round(hits[n - 1].start * TOOTH_FPS);
};

/** The effect windows: talking-head stretches only (no UI insert or chip inside). */
const DOODLE = { from: at("still") - 7, to: at("fax") + 10 };
const ZOOM = { from: at("goes") - 15, to: at("package") + 22 };
const GLASS = { from: at("it") - 5, to: at("dentists") + 40 };

const FULL = { scale: 1.5, x: 0, y: 0 };

const SFX: { at: number; file: string; volume: number }[] = [
  { at: at("still") - 2, file: "pop-1", volume: 0.3 },
  { at: at("fax") - 4, file: "blip-2", volume: 0.24 },
  { at: at("secure") - 2, file: "whoosh-short", volume: 0.32 },
  { at: at("secure"), file: "click", volume: 0.24 },
  { at: at("free") - 3, file: "shimmer", volume: 0.26 },
];

export const ToothFx: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ background: COLORS.ink }}>
      <TalentLayer talent={TL} layer="full" framing={FULL} />
      <FontGate>
        <Sequence from={DOODLE.from} durationInFrames={DOODLE.to - DOODLE.from} premountFor={fps} name="doodle boil">
          <DoodleBoil talent={TL} startAt={DOODLE.from / fps} label="still faxing?" noteY={1236} />
        </Sequence>
        <Sequence from={ZOOM.from} durationInFrames={ZOOM.to - ZOOM.from} premountFor={fps} name="digital zoom">
          <DigitalZoom talent={TL} startAt={ZOOM.from / fps} zoom={1.35} snapAt={(at("secure") - ZOOM.from) / fps} />
        </Sequence>
        <Sequence from={GLASS.from} durationInFrames={GLASS.to - GLASS.from} premountFor={fps} name="glass type">
          <GlassType talent={TL} startAt={GLASS.from / fps} text="Free" y={1165} />
        </Sequence>
      </FontGate>
      <Audio src={staticFile("audio/voice/05-talk.wav")} />
      {SFX.map((s, i) => (
        <Sequence key={i} from={s.at} layout="none">
          <Audio src={staticFile(`audio/sfx/${s.file}.wav`)} volume={s.volume} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
