/**
 * UGC 17 dashboard beats, on the REAL Tooth Referral interface (real.tsx, 1920x842, exactly as recorded).
 * Each beat runs inside its own <Sequence> (frame 0 = first frame of the line). Every action is keyed to W(beat, word).
 * Camera rule (user brief): every screen first shows the WHOLE dashboard (z = 1); then the cursor moves to the section
 * being talked about and the camera zooms into that section on the word. A screen change inside a beat is a nested
 * <Sequence>, so its camera/cursor frames restart at 0.
 */
import React from "react";
import { AbsoluteFill, Img, interpolate, Sequence, staticFile, useCurrentFrame } from "remotion";
import { AN_OLIVIA, CHIPS, DECLINE_NOTE, HARBORVIEW, LAKESIDE, NOTE_RACHEL, OC_DANIEL, OC_DECLINE, OC_OLIVIA, P } from "./data";
import { AMBER, CARD, Camera, type Cam, Chips, type CK, Cursor, DH, DW, FONT, GlassCard, GlassStage, Hl, LEN, Sweep, TRLogo, W, camAt, clamp, ramp, sp } from "./kit";
import {
  AN_PRIVATE, AN_TOP, type CaseData, type CaseView, CasePage, chipBox, ConsultModal, CREATE_NOTE, DayPrep, type DpNote, DP_ADD, DP_INPUT, OC, ocMsgH, type Seg,
  SIGN_BTN, STATUS_TOP, Toast, XR_TOP, signedTop,
} from "./real";

const FULL = (f: number): Cam => ({ f, x: DW / 2, y: DH / 2, z: 1 });
const camZoom = (keys: Cam[]) => camAt(keys, useCurrentFrame()).z;
/** Typed text: the first n chars of s between frames a and b. */
const typed = (s: string, f: number, a: number, b: number) => s.slice(0, Math.round(interpolate(f, [a, b], [0, s.length], clamp)));

const OLIVIA_CASE: CaseData = {
  office: HARBORVIEW, doctor: "Dr. Elena Ruiz, DDS", priority: "Routine", item: "Implant Consultation", dx: "#19",
  pt: { name: "OLIVIA BENNETT", dob: "04/12/1988", age: "38", pronoun: "She/Her", gender: "Female", phone: "555-014-2286", email: "olivia.bennett@example.com" },
  xrays: [{ src: "ugc17/real/xr-grey.png", name: "olivia-pano-2023.jpg", date: "03/14/2023" }, { src: "ugc17/real/xr-blue.png", name: "olivia-pano-2021.jpg", date: "08/09/2021" }],
};
const DANIEL_CASE: CaseData = {
  ...OLIVIA_CASE, item: "Implant Placement", dx: "#30",
  pt: { name: "DANIEL ORTIZ", dob: "09/03/1971", age: "55", pronoun: "He/Him", gender: "Male", phone: "555-019-7734", email: "daniel.ortiz@example.com" },
  xrays: [{ src: "ugc17/real/xr-blue.png", name: "daniel-pano.jpg", date: "11/05/2026" }],
};
const base = (over: Partial<CaseView>): CaseView => ({
  scroll: 0, other: LAKESIDE, c: OLIVIA_CASE, oc: { msgs: OC_OLIVIA }, status: "Spoke with Patient / Scheduled", notes: AN_OLIVIA, ...over,
});
const ocMax = () => Math.max(0, OC_OLIVIA.reduce((a, m) => a + ocMsgH(m), 0) - (OC.listBot - OC.listTop) + 8);
const OC_CX = OC.x + OC.w / 2;

// =========================================================================================== FIX 1 · history stays on the case
export const Fix1: React.FC = () => {
  const f = useCurrentFrame();
  const len = LEN("fix1");
  const every = W("fix1", "every"), message = W("fix1", "message"), stays = W("fix1", "stays"), platform = W("fix1", "platform"), person = W("fix1", "person's");
  const z = { x: OC_CX, y: 590, z: 2.1 };
  const cam: Cam[] = [FULL(0), FULL(every - 22), { f: every - 6, ...z }, { f: platform - 6, ...z }, FULL(platform + 10), FULL(len)];
  // the list scrolls up through Jenna's whole thread on "every update and message", then back down to the newest
  const up = ramp(f, every, message + 4) - ramp(f, stays + 26, stays + 44);
  const cur: CK[] = [{ f: 0, x: 900, y: 380 }, { f: every - 24, x: 900, y: 380 }, { f: every - 6, x: 1700, y: 560 }, { f: stays, x: 1760, y: 520 }, { f: platform + 4, x: 1760, y: 620 }, { f: len, x: 1760, y: 620 }];
  return (
    <AbsoluteFill>
      <GlassStage scene="e1" len={len + 200} />
      <GlassCard len={len}>
        <Camera keys={cam}>
          <CasePage v={base({ oc: { msgs: OC_OLIVIA, listScroll: up * ocMax(), hoverIdx: 1, hover: ramp(f, stays, stays + 6) - ramp(f, platform - 8, platform) } })} />
          <Hl a={stays} b={platform - 2} x={OC.x + 6} y={OC.listTop + 4} w={OC.w - 12} h={OC.listBot - OC.listTop - 8} r={8} />
          <Cursor keys={cur} zoom={camZoom(cam)} />
        </Camera>
      </GlassCard>
      <Chips a={person - 4} b={len} old={CHIPS.fix1[0]} neu={CHIPS.fix1[1]} />
    </AbsoluteFill>
  );
};

// =========================================================================================== FIX 2 · X-rays stay on the case
/** Old way, our own overlay (not app UI): a personal phone texting the X-ray, struck through. */
const PhoneMock: React.FC<{ a: number; b: number }> = ({ a, b }) => {
  const f = useCurrentFrame();
  const p = sp(f, a, 14, 170), out = ramp(f, b - 8, b);
  const strike = interpolate(f, [a + 18, a + 28], [0, 1], clamp);
  if (f < a || f > b) return null;
  return (
    <div style={{ position: "absolute", left: 40 + (p - 1) * 300 - out * 340, top: 330, width: 250, height: 470, borderRadius: 38, background: "rgba(255,190,70,0.16)", border: `2px solid ${AMBER}`, backdropFilter: "blur(16px)", boxShadow: `0 20px 50px rgba(0,0,0,0.35), 0 0 30px ${AMBER}55`, transform: `rotate(${-8 + 4 * p}deg)`, zIndex: 20 }}>
      <div style={{ position: "absolute", left: 14, right: 14, top: 40, bottom: 40, borderRadius: 22, background: "rgba(16,12,30,0.75)", padding: 14 }}>
        <div style={{ font: `700 15px ${FONT}`, color: "#fff", opacity: 0.8 }}>Messages · Dr. Ruiz</div>
        <div style={{ marginTop: 16, marginLeft: "auto", width: 170, borderRadius: 16, background: "#3B82F6", padding: 6 }}><Img src={staticFile("ugc17/real/xr-grey.png")} style={{ display: "block", width: 158, height: 106, objectFit: "cover", borderRadius: 10 }} /></div>
        <div style={{ marginTop: 10, marginLeft: "auto", width: "fit-content", borderRadius: 14, background: "#3B82F6", padding: "8px 12px", font: `600 14px ${FONT}`, color: "#fff" }}>Olivia's X-ray 📎</div>
      </div>
      <svg width="250" height="470" style={{ position: "absolute", inset: 0 }}><path d="M40 80 L210 390 M210 80 L40 390" stroke={AMBER} strokeWidth={14} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - strike} /></svg>
    </div>
  );
};
export const Fix2: React.FC = () => {
  const f = useCurrentFrame();
  const len = LEN("fix2");
  const slips = W("fix2", "slip-ups"), keep = W("fix2", "keep"), open = W("fix2", "open"), browser = W("fix2", "browser.");
  const S = 760;  // scroll that brings the X-rays box to the top of the window
  const scroll = S * ramp(f, keep - 16, keep - 2);
  const th = { x: 520, y: XR_TOP + 71 + 72 - S };  // first thumbnail image (viewport coords after the scroll)
  const cam: Cam[] = [FULL(0), FULL(keep), { f: keep + 14, x: 600, y: 470, z: 2.1 }, { f: browser - 4, x: 600, y: 470, z: 2.1 }, FULL(browser + 10), FULL(len)];
  const cur: CK[] = [{ f: 0, x: 960, y: 420 }, { f: keep - 2, x: 960, y: 420 }, { f: keep + 12, x: th.x + 40, y: th.y + 10 }, { f: open, x: th.x, y: th.y, click: true }, { f: len, x: th.x, y: th.y }];
  return (
    <AbsoluteFill>
      <GlassStage scene="s2" len={len} />
      <GlassCard len={len}>
        <Camera keys={cam}>
          <CasePage v={base({ scroll, xrGlow: [ramp(f, open, open + 6) - ramp(f, browser + 4, browser + 12), 0] })} />
          <Hl a={keep + 12} b={open} x={352} y={XR_TOP - S} w={493} h={420} r={8} />
          <Cursor keys={cur} zoom={camZoom(cam)} />
        </Camera>
      </GlassCard>
      <PhoneMock a={2} b={slips + 6} />
      <Chips a={browser - 2} b={len} old={CHIPS.fix2[0]} neu={CHIPS.fix2[1]} />
    </AbsoluteFill>
  );
};

// =========================================================================================== FIX 3 · private note, tag the doctor
const DP_OLDER: DpNote = { who: "Kevin Tran", when: "Nov 7, 2026, 4:12 PM", body: "Insurance verified. Delta Dental PPO, card on the case." };
const Fix3DayPrep: React.FC<{ len: number }> = ({ len }) => {
  const f = useCurrentFrame();
  const put = W("fix3", "put"), tag = W("fix3", "tag"), doctor = W("fix3", "doctor.");
  const mEnd = put + 14, tEnd = doctor + 2, add = doctor + 6;
  const cam: Cam[] = [FULL(0), FULL(put - 8), { f: put + 6, x: 1685, y: 300, z: 2.2 }, { f: len, x: 1685, y: 300, z: 2.2 }];
  const inp = { x: DP_INPUT.x + 120, y: DP_INPUT.y + 30 };
  const cur: CK[] = [{ f: 0, x: 900, y: 420 }, { f: put - 10, x: 900, y: 420 }, { f: put + 2, ...inp, click: true }, { f: tEnd, ...inp }, { f: add, x: DP_ADD.x + 28, y: DP_ADD.y + 18, click: true }, { f: len, x: DP_ADD.x + 28, y: DP_ADD.y + 18 }];
  const posted = f >= add + 2;
  const notes: DpNote[] = posted ? [{ who: P.rachel.name, when: "Nov 10, 2026, 9:20 AM", m: NOTE_RACHEL.mention, body: NOTE_RACHEL.text }, DP_OLDER] : [DP_OLDER];
  return (
    <Camera keys={cam}>
      <DayPrep patient="Olivia Bennett" dob="04/12/1988" age="38" office={LAKESIDE} referrer={`${P.whitaker.name.replace("Dr. ", "")}, DDS`} reason="Implant Consultation: #19" doctor="Elena Ruiz"
        draftMention={posted ? "" : typed(NOTE_RACHEL.mention, f, put + 4, mEnd)} draft={posted ? "" : typed(NOTE_RACHEL.text, f, mEnd + 2, tEnd)} caret={!posted && f > put + 2}
        notes={notes} newP={posted ? ramp(f, add + 2, add + 10) : 1} addHot={ramp(f, add - 2, add + 2) - ramp(f, add + 4, add + 8)} />
      <Hl a={tag - 2} b={doctor + 4} x={DP_INPUT.x + 8} y={DP_INPUT.y + 6} w={150} h={28} r={6} />
      <Cursor keys={cur} zoom={camZoom(cam)} />
    </Camera>
  );
};
const Fix3Case: React.FC<{ waits: number; other: number; L: number }> = ({ waits, other, L }) => {
  const S = AN_TOP - 50;
  const n0y = AN_TOP + 530 + 100 - S, py = AN_PRIVATE.y - S + 60;
  const cam: Cam[] = [FULL(0), FULL(waits + 4), { f: waits + 16, x: OC_CX, y: n0y, z: 2.1 }, { f: other - 6, x: OC_CX, y: n0y, z: 2.1 }, { f: other + 8, x: OC_CX, y: py, z: 2.2 }, { f: L, x: OC_CX, y: py, z: 2.2 }];
  const cur: CK[] = [{ f: 0, x: 1100, y: 420 }, { f: waits, x: 1100, y: 420 }, { f: waits + 14, x: 1700, y: n0y - 40 }, { f: other + 6, x: 1760, y: py - 30 }, { f: L, x: 1760, y: py - 30 }];
  return (
    <Camera keys={cam}>
      <CasePage v={base({ scroll: S })} />
      <Hl a={waits + 14} b={other - 4} x={1438} y={AN_TOP + 530 - S} w={408} h={232} r={6} />
      <Hl a={other + 6} b={L} x={AN_PRIVATE.x} y={AN_PRIVATE.y - S} w={AN_PRIVATE.w} h={AN_PRIVATE.h} r={6} />
      <Cursor keys={cur} zoom={camZoom(cam)} />
    </Camera>
  );
};
export const Fix3: React.FC = () => {
  const f = useCurrentFrame();
  const len = LEN("fix3");
  const cut = W("fix3", "the", 1);  // "The answer waits on the case": Day-Prep -> the case page
  return (
    <AbsoluteFill>
      <GlassStage scene="s3" len={len} />
      {f < cut ? (
        <GlassCard len={len} exit={false}><Fix3DayPrep len={cut} /></GlassCard>
      ) : (
        <Sequence from={cut} layout="none">
          <GlassCard len={len - cut} enter={false}>
            <Fix3Case waits={W("fix3", "waits") - cut} other={W("fix3", "other") - cut} L={len - cut} />
          </GlassCard>
        </Sequence>
      )}
      <Chips a={W("fix3", "sees") - 4} b={len} old={CHIPS.fix3[0]} neu={CHIPS.fix3[1]} />
    </AbsoluteFill>
  );
};

// =========================================================================================== FIX 4 · template, auto-fill, e-sign
const vr = (name: string, val: string, at: number): Seg => ({ v: `{{${name}}}`, val, at });
export const Fix4: React.FC = () => {
  const f = useCurrentFrame();
  const len = LEN("fix4");
  const template = W("fix4", "template"), patient = W("fix4", "patient"), signs = W("fix4", "signs"), and2 = W("fix4", "and", 1), back = W("fix4", "back.");
  const click = 20, mOpen = 24;
  const at = (i: number) => patient + i * 6;
  const pn = (i: number) => vr("patientName", "OLIVIA BENNETT", at(i)), rd = (i: number) => vr("referringDoctorName", P.whitaker.name, at(i));
  const letter: Seg[][] = [
    [rd(0)], [vr("referringOfficeName", LAKESIDE, at(1))], [],
    ["Re: ", pn(2), " ", vr("patientDob", "DOB (04/12/1988)", at(3))], [],
    ["Dear ", rd(4), ","], [],
    ["Thank you for referring ", pn(5), " to our office for treatment."], [],
    [rd(6), ", thank you again for the kind referral and I appreciate the opportunity to participate in ", pn(7), " care. If you have any questions, please do not hesitate to contact me."], [],
    ["Sincerely,"], [vr("receivingDoctorName", P.ruiz.name, at(8))],
  ];
  const sClick = signs + 4, close = sClick + 8;
  const S0 = 700, S1 = signedTop(OLIVIA_CASE) - 160;
  const scroll = f < close ? S0 : S0 + (S1 - S0) * ramp(f, close, close + 14);
  const sig = { x: SIGN_BTN.x + SIGN_BTN.w / 2, y: SIGN_BTN.y + SIGN_BTN.h / 2 };
  const cn = { x: CREATE_NOTE.x + 80, y: CREATE_NOTE.y + 20 - S0 };
  const cam: Cam[] = [FULL(0), FULL(template + 4), { f: template + 18, x: 760, y: 400, z: 1.9 }, { f: signs - 12, x: 760, y: 460, z: 1.9 }, { f: signs - 2, x: 1180, y: 680, z: 2.0 },
    { f: close, x: 1180, y: 680, z: 2.0 }, FULL(close + 12), FULL(and2 + 2), { f: and2 + 14, x: 850, y: 235, z: 1.9 }, { f: len, x: 850, y: 235, z: 1.9 }];
  const cur: CK[] = [{ f: 0, x: 1200, y: 420 }, { f: click, ...cn, click: true }, { f: template + 16, x: 900, y: 330 }, { f: signs - 4, x: 1000, y: 560 }, { f: sClick, ...sig, click: true },
    { f: and2 + 12, x: 1000, y: 260 }, { f: len, x: 1000, y: 260 }];
  const mp = f < close ? ramp(f, mOpen, mOpen + 8) : 1 - ramp(f, close, close + 6);
  return (
    <AbsoluteFill>
      <GlassStage scene="s4" len={len} />
      <GlassCard len={len}>
        <Camera keys={cam}>
          <CasePage v={base({ scroll, c: { ...OLIVIA_CASE, signed: f >= and2 ? { by: P.ruiz.name, date: "11/14/2026" } : undefined }, signedP: ramp(f, and2, and2 + 8), status: "Consultation Completed" })}
            overlay={mp > 0 ? <ConsultModal p={mp} f={f} letter={letter} signHot={ramp(f, sClick - 2, sClick + 2)} /> : null} />
          <Hl a={and2 + 10} b={len} x={352} y={signedTop(OLIVIA_CASE) - S1} w={999} h={151} r={8} />
          <Cursor keys={cur} zoom={camZoom(cam)} />
        </Camera>
      </GlassCard>
      <Chips a={back + 2} b={len} old={CHIPS.fix4[0]} neu={CHIPS.fix4[1]} />
    </AbsoluteFill>
  );
};

// =========================================================================================== FIX 5 · decline, same-day update
const Fix5Lakeside: React.FC<{ L: number }> = ({ L }) => {
  const g = useCurrentFrame();
  const cam: Cam[] = [FULL(0), FULL(14), { f: 28, x: OC_CX, y: 640, z: 2.1 }, { f: L, x: OC_CX, y: 640, z: 2.1 }];
  const cur: CK[] = [{ f: 0, x: 1100, y: 420 }, { f: 14, x: 1100, y: 420 }, { f: 28, x: 1720, y: 700 }, { f: L, x: 1720, y: 700 }];
  return (
    <Camera keys={cam}>
      <CasePage v={base({ scroll: 0, user: P.megan, clinic: LAKESIDE, other: HARBORVIEW, title: "Outgoing Referrals", active: "Outgoing", c: DANIEL_CASE, status: "Declined Appointment", notes: [],
        oc: { msgs: [...OC_DANIEL, OC_DECLINE] }, badge: 4, badgePop: 1 + 0.35 * Math.sin(Math.PI * ramp(g, 2, 12)) })} />
      <Hl a={28} b={L} x={OC.x + 6} y={OC.listBot - 180} w={OC.w - 12} h={176} r={8} />
      <Cursor keys={cur} zoom={camZoom(cam)} />
    </Camera>
  );
};
export const Fix5: React.FC = () => {
  const f = useCurrentFrame();
  const len = LEN("fix5");
  const mark = W("fix5", "mark"), short = W("fix5", "short"), referring = W("fix5", "referring"), sees = W("fix5", "sees"), recall = W("fix5", "recall.");
  const S = 520;
  const dec = chipBox("Declined Appointment", STATUS_TOP);
  const dc = { x: dec.x + dec.w / 2, y: dec.y + 15 - S };
  const comp = { x: OC.x + 140, y: OC.y + 453 + 24 - S }, send = { x: OC.x + 15 + 392, y: OC.y + 453 + 79 - S };
  const tA = short - 4, tM = tA + 8, tB = referring - 2, sent = referring + 2, swap = sees - 10;
  const msgs = f >= sent ? [...OC_DANIEL, OC_DECLINE] : OC_DANIEL;
  const declined = f >= mark + 2;
  const cam: Cam[] = [FULL(0), FULL(mark - 4), { f: mark + 10, x: OC_CX, y: 640, z: 2.0 }, { f: tA - 6, x: OC_CX, y: 640, z: 2.0 }, { f: tA + 6, x: OC_CX, y: 250, z: 2.0 }, { f: len, x: OC_CX, y: 250, z: 2.0 }];
  const cur: CK[] = [{ f: 0, x: 960, y: 420 }, { f: mark - 14, x: 960, y: 420 }, { f: mark, ...dc, click: true }, { f: tA - 2, ...comp, click: true }, { f: sent - 2, ...send, click: true }, { f: len, ...send }];
  return (
    <AbsoluteFill>
      <GlassStage scene="s5" len={len + 200} />
      {f < swap ? (
        <GlassCard len={len} exit={false}>
          <Camera keys={cam}>
            <CasePage v={base({ scroll: S, c: DANIEL_CASE, status: declined ? "Declined Appointment" : "Spoke with Patient / Scheduled", statusP: ramp(f, mark + 2, mark + 10), notes: [],
              oc: { msgs, newFrom: OC_DANIEL.length, newP: ramp(f, sent, sent + 8), draftMention: f < sent ? typed(OC_DECLINE.m!, f, tA, tM) : "", draft: f < sent ? typed(` ${DECLINE_NOTE}`, f, tM, tB) : "" } })}
              overlay={<Toast p={ramp(f, mark + 4, mark + 10) - ramp(f, tA - 8, tA - 2)} text="Status updated successfully! A notification has been created." />} />
            <Cursor keys={cur} zoom={camAt(cam, f).z} />
          </Camera>
        </GlassCard>
      ) : (
        // Lakeside's own dashboard (the referring office): the same case and message, the same day
        <Sequence from={swap} layout="none">
          <GlassCard len={len - swap} enter={false}><Fix5Lakeside L={len - swap} /></GlassCard>
        </Sequence>
      )}
      <Chips a={recall - 4} b={len} old={CHIPS.fix5[0]} neu={CHIPS.fix5[1]} />
    </AbsoluteFill>
  );
};

// =========================================================================================== END CARD
export const EndCard: React.FC = () => {
  const f = useCurrentFrame();
  const t = sp(f, 10, 14, 140), u = sp(f, 20, 14, 140);
  return (
    <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 38%, #4A2BB8 0%, #22145A 55%, #0E0828 100%)", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 44 }}>
      <div style={{ padding: "46px 60px", borderRadius: 34, background: "rgba(255,255,255,0.12)", border: "1.5px solid rgba(255,255,255,0.4)", backdropFilter: "blur(24px)", boxShadow: "0 30px 70px rgba(0,0,0,0.4), inset 0 1.5px 0 rgba(255,255,255,0.6)", position: "relative", overflow: "hidden", transform: `scale(${0.92 + 0.08 * sp(f, 0, 14, 150)})` }}>
        <TRLogo s={2.6} light />
        <Sweep a={4} d={22} o={0.6} />
      </div>
      <div style={{ font: `800 50px ${FONT}`, color: "#fff", letterSpacing: "-0.02em", opacity: t, transform: `translateY(${(1 - t) * 24}px)` }}>toothreferral.com</div>
      <div style={{ font: `700 38px ${FONT}`, color: "#D9CFFF", opacity: u, transform: `translateY(${(1 - u) * 20}px)`, textAlign: "center", padding: "0 60px" }}>Save this for your next team meeting.</div>
    </AbsoluteFill>
  );
};

export const BEAT_VIEWS: Record<string, React.FC> = { fix1: Fix1, fix2: Fix2, fix3: Fix3, fix4: Fix4, fix5: Fix5, end: EndCard };
export { CARD };
