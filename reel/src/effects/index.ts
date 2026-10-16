/**
 * The effects library: 17 reusable Remotion effects for talking-head videos.
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
];

export * from "./shared";
