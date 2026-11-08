/**
 * 35 Dolly zoom: the kit's name for the classic Vertigo move. Same engine as effect 15 (the speaker holds still
 * while the room stretches away), exposed under the kit name with a slightly deeper default.
 */
import React from "react";
import { Vertigo, type VertigoProps } from "./15-vertigo";
import type { EffectMeta } from "./shared";

export const meta: EffectMeta = {
  n: 35, slug: "dolly-zoom", name: "Dolly zoom", durationInFrames: 90, needs: ["cutout", "plate", "face"],
  what: "The speaker holds his size while the room behind him stretches away (Vertigo), then snaps back.",
  bestFor: "A realisation (\"and then it hit me\", \"twenty referrals, gone\").",
  avoid: "Calm explainer passages; more than once per video.",
};

export type DollyZoomProps = VertigoProps;
export const DollyZoom: React.FC<DollyZoomProps> = (p) => <Vertigo depth={0.36} {...p} />;
