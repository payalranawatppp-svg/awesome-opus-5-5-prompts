import React from "react";
import { AbsoluteFill } from "remotion";
import { Backdrop, LightSweep, TopWash } from "./components/Backdrop";
import { Captions } from "./components/Captions";
import { Footage, RoomBackdrop } from "./components/Footage";
import { SoundTrack } from "./components/SoundTrack";
import { Stage } from "./components/Stage";
import { COLORS } from "./theme";

/** Layer order: room backdrop → speaker → art direction (wash + glows) → graphics → captions → transitions. */
export const Reel: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: COLORS.ink }}>
    <RoomBackdrop />
    <Footage />
    <TopWash />
    <Backdrop />
    <Stage />
    <Captions />
    <LightSweep />
    <SoundTrack />
  </AbsoluteFill>
);
