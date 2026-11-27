import React from "react";
import { Composition } from "remotion";
import { DURATION, FPS } from "./edit";
import { EFFECTS } from "./effects";
import { CampFx, CAMPFX_DURATION } from "./camp/CampFx";
import { TwoWays, TWOWAYS_DURATION } from "./camp/TwoWays";
import { DayOne, DAYONE_DURATION } from "./camp/DayOne";
import { FxPreview } from "./effects/FxPreview";
import { LayoutQA } from "./LayoutQA";
import { Reel } from "./Reel";
import { ReelFx } from "./reelfx/ReelFx";
import { TOOTH_DURATION, ToothFx } from "./reelfx/ToothFx";
import { DEPTH_DURATION, ToothDepth } from "./reelfx/ToothDepth";
import { UGC2_DURATION, ToothUgc2 } from "./reelfx/ToothUgc2";
import { UGC2_REF_DURATION, ToothUgc2Ref } from "./reelfx/ToothUgc2Ref";
import { CB_DURATION, ChocolateBox } from "./reelfx/ChocolateBox";
import { PD_DURATION, PdfDeadEnd } from "./reelfx/PdfDeadEnd";
import { RR_DURATION, RefRoast } from "./reelfx/RefRoast";
import { XR_DURATION, XrayHunt } from "./reelfx/XrayHunt";
import { LK_DURATION, LeakInside } from "./reelfx/LeakInside";
import { MS_DURATION, MagicShow } from "./reelfx/MagicShow";
import { BuriedInEmails, S13_DURATION } from "./reelfx/BuriedInEmails";
import { BuriedInEmails2, B2_DURATION } from "./reelfx/BuriedInEmails2";
import { S20Story, S20_DURATION } from "./reelfx/S20Story";
import { Ep2Story, EP2_DURATION } from "./reelfx/Ep2Story";
import { DayPrepClean, DAYPREP_DURATION, DAYPREP_W, DAYPREP_H } from "./reelfx/DayPrepClean";
import { CaseChat, CASECHAT_DURATION, CASECHAT_W, CASECHAT_H } from "./reelfx/CaseChat";
import { CompletionNote, CN_DURATION, CN_W, CN_H } from "./reelfx/CompletionNote";
import { Ep4Story, EP4_DURATION } from "./reelfx/Ep4Story";
import { UGC17, UGC17_DURATION } from "./ugc17/UGC17";
import { IncomingPage } from "./app/Incoming";
import { CaseDetailPage } from "./app/CaseDetail";
import { LeadFormsPage } from "./app/LeadForms";
import { AnalyticsPage } from "./app/Analytics";
import { ConsultNoteModal, SuccessToast } from "./app/ConsultNote";
import { AbsoluteFill } from "remotion";
import { GestureStory, GX_DURATION } from "./reelfx/GestureStory";
import { Compendium, CP_DURATION } from "./reelfx/Compendium";
import { APP_W, APP_H } from "./app/AppShell";
import { KawasakiReveal, KAW_W, KAW_H, KAW_FPS, KAW_DURATION } from "./reelfx/KawasakiReveal";
import { AN_DURATION, AN_H, AN_W, AnalyticsDemo } from "./reelfx/AnalyticsDemo";
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
    <Composition id="PdfDeadEnd" component={PdfDeadEnd} durationInFrames={PD_DURATION} fps={30} width={WIDTH} height={HEIGHT} />
    <Composition id="RefRoast" component={RefRoast} durationInFrames={RR_DURATION} fps={30} width={WIDTH} height={HEIGHT} />
    <Composition id="XrayHunt" component={XrayHunt} durationInFrames={XR_DURATION} fps={30} width={WIDTH} height={HEIGHT} />
    <Composition id="LeakInside" component={LeakInside} durationInFrames={LK_DURATION} fps={30} width={WIDTH} height={HEIGHT} />
    <Composition id="MagicShow" component={MagicShow} durationInFrames={MS_DURATION} fps={30} width={WIDTH} height={HEIGHT} />
    <Composition id="AnalyticsDemo" component={AnalyticsDemo} durationInFrames={AN_DURATION} fps={30} width={AN_W} height={AN_H} />
    <Composition id="Camp-FormVsSoftware" component={() => <CampFx id="form-vs-software" />} durationInFrames={CAMPFX_DURATION("form-vs-software")} fps={30} width={1080} height={1920} />
    <Composition id="Camp-FormCompare" component={() => <CampFx id="form-compare" />} durationInFrames={CAMPFX_DURATION("form-compare")} fps={30} width={1080} height={1920} />
    <Composition id="Camp-FormCompare2" component={() => <CampFx id="form-compare2" />} durationInFrames={CAMPFX_DURATION("form-compare2")} fps={30} width={1080} height={1920} />
    <Composition id="Camp-TwoWays" component={TwoWays} durationInFrames={TWOWAYS_DURATION} fps={30} width={1080} height={1920} />
    <Composition id="Camp-DayInTheLife" component={() => <CampFx id="day-in-the-life" />} durationInFrames={CAMPFX_DURATION("day-in-the-life")} fps={30} width={1080} height={1920} />
    <Composition id="Camp-DayOne" component={DayOne} durationInFrames={DAYONE_DURATION} fps={30} width={1080} height={1920} />
    <Composition id="App-Incoming" component={IncomingPage} durationInFrames={60} fps={30} width={APP_W} height={APP_H} />
    <Composition id="App-Incoming-Top" component={IncomingPage} defaultProps={{ scroll: 0 }} durationInFrames={60} fps={30} width={APP_W} height={APP_H} />
    <Composition id="App-CaseDetail" component={CaseDetailPage} durationInFrames={60} fps={30} width={APP_W} height={APP_H} />
    <Composition id="App-CaseMessages" component={CaseDetailPage} defaultProps={{ tab: "Messages" }} durationInFrames={60} fps={30} width={APP_W} height={APP_H} />
    <Composition id="App-LeadForms" component={LeadFormsPage} defaultProps={{ vh: 912 }} durationInFrames={60} fps={30} width={APP_W} height={APP_H} />
    <Composition id="App-LeadForms-869" component={LeadFormsPage} defaultProps={{ vh: 869 }} durationInFrames={60} fps={30} width={APP_W} height={869} />
    <Composition id="App-Analytics" component={AnalyticsPage} durationInFrames={60} fps={30} width={APP_W} height={842} />
    <Composition id="App-Analytics-FullPage" component={AnalyticsPage} defaultProps={{ chrome: false }} durationInFrames={1} fps={30} width={APP_W} height={4785} />
    <Composition id="App-ConsultNote-Modal" component={() => <AbsoluteFill style={{ background: "#fff" }}><ConsultNoteModal backdrop={false} /><SuccessToast /></AbsoluteFill>} durationInFrames={60} fps={30} width={APP_W} height={869} />
    <Composition id="App-CaseDetail-FullPage" component={CaseDetailPage} defaultProps={{ chrome: false }} durationInFrames={1} fps={30} width={APP_W} height={3053} />
    <Composition id="Gesture-DontDo" component={GestureStory} durationInFrames={GX_DURATION} fps={30} width={1080} height={1920} />
    <Composition id="Kawasaki-Reveal" component={KawasakiReveal} durationInFrames={KAW_DURATION} fps={KAW_FPS} width={KAW_W} height={KAW_H} />
    <Composition id="Ep4-FrontRow" component={Ep4Story} durationInFrames={EP4_DURATION} fps={30} width={1080} height={1920} />
    <Composition id="UGC17-FiveMoments" component={UGC17} durationInFrames={UGC17_DURATION} fps={30} width={1080} height={1920} />
    <Composition id="CompletionNote-Ep4" component={CompletionNote} durationInFrames={CN_DURATION} fps={30} width={CN_W} height={CN_H} />
    <Composition id="CaseChat-Clean"component={CaseChat} durationInFrames={CASECHAT_DURATION} fps={30} width={CASECHAT_W} height={CASECHAT_H} />
    <Composition id="DayPrep-Clean" component={DayPrepClean} durationInFrames={DAYPREP_DURATION} fps={30} width={DAYPREP_W} height={DAYPREP_H} />
    <Composition id="Ep2-NoMorePhoneTag" component={Ep2Story} durationInFrames={EP2_DURATION} fps={30} width={1080} height={1920} />
    <Composition id="S20-DidTheyEverSendIt" component={S20Story} durationInFrames={S20_DURATION} fps={30} width={1080} height={1920} />
    <Composition id="BuriedInEmails2" component={BuriedInEmails2} durationInFrames={B2_DURATION} fps={30} width={1080} height={1920} />
    <Composition id="BuriedInEmails" component={BuriedInEmails} durationInFrames={S13_DURATION} fps={30} width={WIDTH} height={HEIGHT} />
    <Composition id="ToothReferralUgc2Ad" component={ToothUgc2Ref} durationInFrames={UGC2_REF_DURATION} fps={30} width={WIDTH} height={HEIGHT} />
    <Composition id="ToothReferralUgc2" component={ToothUgc2} durationInFrames={UGC2_DURATION} fps={30} width={WIDTH} height={HEIGHT} />
    <Composition id="ToothReferralDepth" component={ToothDepth} durationInFrames={DEPTH_DURATION} fps={30} width={WIDTH} height={HEIGHT} />
    <Composition id="ToothReferralFx" component={ToothFx} durationInFrames={TOOTH_DURATION} fps={30} width={WIDTH} height={HEIGHT} />
    <Composition id="Dashboard-Compendium" component={Compendium} durationInFrames={CP_DURATION} fps={30} width={1920} height={1080} />
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
