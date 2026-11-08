/**
 * The effects library: 38 reusable Remotion effects for talking-head videos.
 * Each file exports `meta` (what it is, when to use it) and one component with sensible defaults.
 * Preview any of them in Studio as the composition "Fx-NN-slug"; the "EffectsShowcase" composition plays all 17.
 */
import type React from "react";
import * as e01 from "./01-orbit";
import * as e02 from "./02-couch-wall";
import * as e03 from "./03-ui-world";
import * as e04 from "./04-frame-break";
import * as e05 from "./05-digital-zoom";
import * as e06 from "./06-phone-mockup";
import * as e07 from "./07-checklist";
import * as e08 from "./08-headline-wall";
import * as e09 from "./09-zoom-through-cut";
import * as e10 from "./10-chart-grow";
import * as e11 from "./11-pull-back-reveal";
import * as e12 from "./12-green-screen";
import * as e13 from "./13-paper-cut";
import * as e14 from "./14-doodle-boil";
import * as e15 from "./15-vertigo";
import * as e16 from "./16-cover-story";
import * as e17 from "./17-glass-type";
import * as e18 from "./18-live-cursor";
import * as e19 from "./19-clone-row";
import * as e20 from "./20-day-dial";
import * as e21 from "./21-predict-keys";
import * as e22 from "./22-orbit-ring";
import * as e23 from "./23-code-body";
import * as e24 from "./24-post-wall";
import * as e25 from "./25-letter-dive";
import * as e26 from "./26-comment-drop";
import * as e27 from "./27-layer-explode";
import * as e28 from "./28-sketch-words";
import * as e29 from "./29-blade-slice";
import * as e30 from "./30-head-stack";
import * as e31 from "./31-rack-focus";
import * as e32 from "./32-banknote";
import * as e33 from "./33-voice-note";
import * as e34 from "./34-impact-frame";
import * as e35 from "./35-dolly-zoom";
import * as e36 from "./36-press-front";
import * as e37 from "./37-paper-tear";
import * as e38 from "./38-blow-away";
import type { EffectMeta, Talent } from "./shared";

export type EffectProps = { talent?: Talent; startAt?: number };
export type EffectEntry = { meta: EffectMeta; Component: React.FC<EffectProps> };

export const EFFECTS: EffectEntry[] = [
  { meta: e01.meta, Component: e01.Orbit as React.FC<EffectProps> },
  { meta: e02.meta, Component: e02.CouchWall as React.FC<EffectProps> },
  { meta: e03.meta, Component: e03.UiWorld as React.FC<EffectProps> },
  { meta: e04.meta, Component: e04.FrameBreak as React.FC<EffectProps> },
  { meta: e05.meta, Component: e05.DigitalZoom as React.FC<EffectProps> },
  { meta: e06.meta, Component: e06.PhoneMockup as React.FC<EffectProps> },
  { meta: e07.meta, Component: e07.Checklist as React.FC<EffectProps> },
  { meta: e08.meta, Component: e08.HeadlineWall as React.FC<EffectProps> },
  { meta: e09.meta, Component: e09.ZoomThroughCut as React.FC<EffectProps> },
  { meta: e10.meta, Component: e10.ChartGrow as React.FC<EffectProps> },
  { meta: e11.meta, Component: e11.PullBackReveal as React.FC<EffectProps> },
  { meta: e12.meta, Component: e12.GreenScreen as React.FC<EffectProps> },
  { meta: e13.meta, Component: e13.PaperCut as React.FC<EffectProps> },
  { meta: e14.meta, Component: e14.DoodleBoil as React.FC<EffectProps> },
  { meta: e15.meta, Component: e15.Vertigo as React.FC<EffectProps> },
  { meta: e16.meta, Component: e16.CoverStory as React.FC<EffectProps> },
  { meta: e17.meta, Component: e17.GlassType as React.FC<EffectProps> },
  // editing kit (our own versions of the effects named in the Justyn Berkovits editing-kit reel)
  { meta: e18.meta, Component: e18.LiveCursor as React.FC<EffectProps> },
  { meta: e19.meta, Component: e19.CloneRow as React.FC<EffectProps> },
  { meta: e20.meta, Component: e20.DayDial as React.FC<EffectProps> },
  { meta: e21.meta, Component: e21.PredictKeys as React.FC<EffectProps> },
  { meta: e22.meta, Component: e22.OrbitRing as React.FC<EffectProps> },
  { meta: e23.meta, Component: e23.CodeBody as React.FC<EffectProps> },
  { meta: e24.meta, Component: e24.PostWall as React.FC<EffectProps> },
  { meta: e25.meta, Component: e25.LetterDive as React.FC<EffectProps> },
  { meta: e26.meta, Component: e26.CommentDrop as React.FC<EffectProps> },
  { meta: e27.meta, Component: e27.LayerExplode as React.FC<EffectProps> },
  { meta: e28.meta, Component: e28.SketchWords as React.FC<EffectProps> },
  { meta: e29.meta, Component: e29.BladeSlice as React.FC<EffectProps> },
  { meta: e30.meta, Component: e30.HeadStack as React.FC<EffectProps> },
  { meta: e31.meta, Component: e31.RackFocus as React.FC<EffectProps> },
  { meta: e32.meta, Component: e32.Banknote as React.FC<EffectProps> },
  { meta: e33.meta, Component: e33.VoiceNote as React.FC<EffectProps> },
  { meta: e34.meta, Component: e34.ImpactFrame as React.FC<EffectProps> },
  { meta: e35.meta, Component: e35.DollyZoom as React.FC<EffectProps> },
  { meta: e36.meta, Component: e36.PressFront as React.FC<EffectProps> },
  { meta: e37.meta, Component: e37.PaperTear as React.FC<EffectProps> },
  { meta: e38.meta, Component: e38.BlowAway as React.FC<EffectProps> },
];

export { Orbit, type OrbitProps } from "./01-orbit";
export { CouchWall, type CouchWallProps } from "./02-couch-wall";
export { UiWorld, type UiWorldProps } from "./03-ui-world";
export { FrameBreak, type FrameBreakProps } from "./04-frame-break";
export { DigitalZoom, type DigitalZoomProps } from "./05-digital-zoom";
export { PhoneMockup, type PhoneMockupProps } from "./06-phone-mockup";
export { Checklist, type ChecklistProps } from "./07-checklist";
export { HeadlineWall, type HeadlineWallProps } from "./08-headline-wall";
export { ZoomThroughCut, type ZoomThroughCutProps } from "./09-zoom-through-cut";
export { ChartGrow, type ChartGrowProps } from "./10-chart-grow";
export { PullBackReveal, type PullBackRevealProps } from "./11-pull-back-reveal";
export { GreenScreen, type GreenScreenProps } from "./12-green-screen";
export { PaperCut, type PaperCutProps } from "./13-paper-cut";
export { DoodleBoil, type DoodleBoilProps } from "./14-doodle-boil";
export { Vertigo, type VertigoProps } from "./15-vertigo";
export { CoverStory, type CoverStoryProps } from "./16-cover-story";
export { GlassType, type GlassTypeProps } from "./17-glass-type";
export { LiveCursor, type LiveCursorProps } from "./18-live-cursor";
export { CloneRow, type CloneRowProps } from "./19-clone-row";
export { DayDial, type DayDialProps } from "./20-day-dial";
export { PredictKeys, type PredictKeysProps } from "./21-predict-keys";
export { OrbitRing, type OrbitRingProps } from "./22-orbit-ring";
export { CodeBody, type CodeBodyProps } from "./23-code-body";
export { PostWall, type PostWallProps } from "./24-post-wall";
export { LetterDive, type LetterDiveProps } from "./25-letter-dive";
export { CommentDrop, type CommentDropProps } from "./26-comment-drop";
export { LayerExplode, type LayerExplodeProps } from "./27-layer-explode";
export { SketchWords, type SketchWordsProps } from "./28-sketch-words";
export { BladeSlice, type BladeSliceProps } from "./29-blade-slice";
export { HeadStack, type HeadStackProps } from "./30-head-stack";
export { RackFocus, type RackFocusProps } from "./31-rack-focus";
export { Banknote, type BanknoteProps } from "./32-banknote";
export { VoiceNote, type VoiceNoteProps } from "./33-voice-note";
export { ImpactFrame, type ImpactFrameProps } from "./34-impact-frame";
export { DollyZoom, type DollyZoomProps } from "./35-dolly-zoom";
export { PressFront, type PressFrontProps } from "./36-press-front";
export { PaperTear, type PaperTearProps } from "./37-paper-tear";
export { BlowAway, type BlowAwayProps } from "./38-blow-away";
export * from "./kit";
export * from "./shared";
