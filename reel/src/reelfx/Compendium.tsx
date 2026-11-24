/**
 * "Tooth Referral dashboard compendium": every coded dashboard screen and animation made so far, in one 1080p film with
 * a chapter caption under each (what the section is and what it does). Companion to docs/dashboard/TOOTH-REFERRAL-DASHBOARD-GUIDE.md.
 *   A  The coded app, live pages (reel/src/app): Incoming, Case Details (scrolled), Messages, Consultation Note, Website Lead Forms, Analytics (scrolled)
 *   B  Animated flows (reel/src/reelfx): Day-Prep Station, Case chat, completion note + e-sign, Analytics walk-through
 *   C  16 glass motion scenes TR-01…TR-16 (reel/src/tr)
 */
import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { FontGate } from "../effects";
import { FONT_UI } from "../theme";
import { IncomingPage } from "../app/Incoming";
import { CaseDetailPage } from "../app/CaseDetail";
import { LeadFormsPage } from "../app/LeadForms";
import { AnalyticsPage } from "../app/Analytics";
import { ConsultNoteModal, SuccessToast } from "../app/ConsultNote";
import { DayPrepClean, DAYPREP_DURATION } from "./DayPrepClean";
import { CaseChat, CASECHAT_DURATION } from "./CaseChat";
import { CompletionNote, CN_DURATION } from "./CompletionNote";
import { AnalyticsDemo, AN_DURATION } from "./AnalyticsDemo";
import { TR_ALL, TrFormatted } from "../tr/formats";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

type Ch = { part: string; title: string; text: string; dur: number; h: number; render: (f: number, dur: number) => React.ReactNode };
const scrollTo = (f: number, dur: number, from: number, to: number) => from + (to - from) * ease(interpolate(f, [18, dur - 24], [0, 1], clamp));

const TRD: Record<string, [string, string]> = {
  "TR-01-overview": ["Dashboard overview", "The whole app builds in: sidebar (Analytics, Referrals, Notifications, Notes, Offices), top bar and the KPI row."],
  "TR-02-new-referral": ["New referral", "The referral form fills itself (patient, treatment, tooth, urgency, X-rays) and goes out securely to the specialist."],
  "TR-03-incoming": ["Incoming referral", "A new referral lands in the receiving office’s list with an unread badge and a status pill."],
  "TR-04-office-chat": ["Office Communication", "Secure two-way chat between the two offices on the case, with @mentions and attachments."],
  "TR-05-case-lifecycle": ["Case lifecycle", "One shared case moves through sent, contacted, insurance added, scheduled and completed; both offices see each step."],
  "TR-06-analytics": ["Analytics KPIs", "The four KPI cards count up (volume, time to first contact, acceptance, ghost rate); volume draws against the prior period."],
  "TR-07-needs-attention": ["Needs attention", "The dashboard flags what slipped and offers a one-click fix (mark complete, re-assign, send reminder)."],
  "TR-08-referral-journey": ["Referral journey", "A timeline of one referral from sent to completed, so nobody has to ask where it is."],
  "TR-09-insurance-link": ["Insurance link", "The patient adds their insurance card from a secure link (no account); it arrives verified on the case."],
  "TR-10-notification-stack": ["Notification stack", "Messages, scheduled visits and completed cases arrive as notifications for the team."],
  "TR-11-referral-funnel": ["Referral funnel", "Received to contacted to scheduled to completed, with the drop-off between each step."],
  "TR-12-before-after": ["Before and after", "The old way (forms, faxes, phone tag) against one shared case in Tooth Referral."],
  "TR-13-referral-network": ["Referral network", "Connected offices, general dentists and specialists, on one network that carries both directions."],
  "TR-14-case-stack": ["Case stack", "3D stack of case cards: X-rays, notes, insurance and messages all in one place."],
  "TR-15-big-stats": ["Big stats", "Headline numbers (illustrative) that summarise the benefit of one shared system."],
  "TR-16-cta": ["Set up in about 5 minutes", "Closing end card with the logo and the offer."],
};

const CH: Ch[] = [
  { part: "A · The coded app", title: "Incoming Referrals", text: "Every referral the office receives, in one list: patient, DOB, referring office (green dot = connected network member), status pill, received and last update. Search and filter by status or month.", dur: 150, h: 912, render: (f) => <div style={{ position: "absolute", inset: 0, transform: `scale(${1 + f * 0.00018})`, transformOrigin: "50% 30%" }}><IncomingPage scroll={0} /></div> },
  { part: "A · The coded app", title: "Case Details", text: "One case shared by both offices. Patient block, referral status, requested treatment, attachments (X-rays, documents, insurance cards), activity log and Office Communication; the page scrolls through every section.", dur: 450, h: 912, render: (f, d) => <CaseDetailPage scroll={scrollTo(f, d, 0, 2140)} /> },
  { part: "A · The coded app", title: "Messages tab", text: "Office Communication in full: two-way messages with the referring office, @mentions, replies, X-ray requests, and the referral snapshot (from, to, status).", dur: 150, h: 912, render: () => <CaseDetailPage tab="Messages" /> },
  { part: "A · The coded app", title: "Prepare Consultation Note", text: "When the status is Consultation Completed: pick a template, edit the letter, insert smart variables ({{patientName}}…), then sign and send. The success toast confirms it.", dur: 150, h: 869, render: () => <AbsoluteFill style={{ background: "#fff" }}><ConsultNoteModal backdrop={false} /><SuccessToast /></AbsoluteFill> },
  { part: "A · The coded app", title: "Website Lead Forms", text: "Build an embeddable referral form or a Contact Us page: logo, welcome message, what we are known for, insurance and no-insurance buttons, live patient preview, then go live on the website.", dur: 180, h: 869, render: () => <LeadFormsPage vh={869} /> },
  { part: "A · The coded app", title: "Analytics", text: "Received and Sent views: KPI cards, volume chart, funnel, top senders and procedures, lifecycle clocks, needs attention, staff responsiveness, outcomes, sources and the status board.", dur: 540, h: 842, render: (f, d) => <AnalyticsPage chrome={true} scroll={scrollTo(f, d, 0, 3940)} /> },
  { part: "B · Animated flows", title: "Provider’s Day-Prep Station", text: "The surgeon’s pre-op view: patient, referring office, the X-ray, and Administrative Notes. Dr. Vance @mentions Amanda to ask for the newest pano; it arrives on the case.", dur: DAYPREP_DURATION, h: 842, render: () => <DayPrepClean /> },
  { part: "B · Animated flows", title: "Case chat (Office Communication)", text: "Amanda and Barbara talk on the case: @mention, typing indicator, quoted reply, X-ray saved to the case, hover to reply or delete.", dur: CASECHAT_DURATION, h: 842, render: () => <CaseChat /> },
  { part: "B · Animated flows", title: "Completion note, route to doctor, e-sign", text: "Status to Consultation Completed, letterhead template fills in the case, route to the doctor to sign, signed note attached for both offices, then copy to the PMS.", dur: CN_DURATION, h: 842, render: () => <CompletionNote /> },
  { part: "B · Animated flows", title: "Analytics walk-through", text: "The canonical Analytics page scrolling top to bottom with one consistent dataset: 28 referrals, 3.7 h to first contact, 76% case acceptance, 7% ghost rate, funnel 28 to 25 to 20 to 9.", dur: AN_DURATION, h: 842, render: () => <AnalyticsDemo /> },
  ...TR_ALL.map((s, i): Ch => ({
    part: "C · Glass motion scenes", title: `TR-${String(i + 1).padStart(2, "0")} · ${TRD[s.id][0]}`, text: TRD[s.id][1], dur: s.dur, h: 1080,
    render: () => <TrFormatted id={s.id} horizontal />,
  })),
];

const INTRO = 120, OUTRO = 90;
export const CP_STARTS: number[] = [];
{ let t = INTRO; CH.forEach((c) => { CP_STARTS.push(t); t += c.dur; }); }
export const CP_DURATION = INTRO + CH.reduce((s, c) => s + c.dur, 0) + OUTRO;
export const CP_CHAPTERS = CH.map((c, i) => ({ part: c.part, title: c.title, start: CP_STARTS[i] / 30, dur: c.dur / 30 }));

const BG = "#0f0a24";
const Frame: React.FC<{ c: Ch; i: number }> = ({ c, i }) => {
  const f = useCurrentFrame();
  const a = interpolate(f, [0, 8, c.dur - 8, c.dur], [0, 1, 1, 0], clamp);
  const AREA = 892, vis = c.h, scale = Math.min(1, AREA / vis);
  const w = (c.h === 1080 ? 1920 : 1920) * scale, h = vis * scale;
  const y = 44 + (AREA - h) / 2;
  return (
    <AbsoluteFill style={{ background: BG, opacity: a, fontFamily: FONT_UI }}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 44, display: "flex", alignItems: "center", padding: "0 40px", color: "#C9BDF5", fontSize: 20, letterSpacing: 2, textTransform: "uppercase", fontWeight: 600, justifyContent: "space-between" }}>
        <span>Tooth Referral · Dashboard guide</span><span>{c.part}</span>
      </div>
      <div style={{ position: "absolute", left: (1920 - w) / 2, top: y, width: w, height: h, overflow: "hidden", borderRadius: c.h === 1080 ? 0 : 4 }}>
        <div style={{ width: 1920, height: vis, transform: `scale(${scale})`, transformOrigin: "0 0", position: "relative", overflow: "hidden" }}>
          <FontGate>{c.render(f, c.dur)}</FontGate>
        </div>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 144, background: "linear-gradient(180deg, rgba(15,10,36,0) 0%, #0f0a24 35%)", display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: "0 40px 14px" }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 18 }}>
          <span style={{ fontSize: 36, fontWeight: 800, color: "#fff" }}>{c.title}</span>
          <span style={{ fontSize: 20, color: "#9C8FD0", fontWeight: 600 }}>{i + 1} / {CH.length}</span>
        </div>
        <div style={{ fontSize: 23, lineHeight: 1.3, color: "#E4DEFA", marginTop: 4, maxWidth: 1760 }}>{c.text}</div>
      </div>
    </AbsoluteFill>
  );
};

const Card: React.FC<{ big: string; small: string; dur: number }> = ({ big, small, dur }) => {
  const f = useCurrentFrame();
  const a = interpolate(f, [0, 14, dur - 14, dur], [0, 1, 1, 0], clamp);
  return (
    <AbsoluteFill style={{ background: `radial-gradient(1200px 700px at 50% 40%, #3b1fa8 0%, ${BG} 70%)`, justifyContent: "center", alignItems: "center", opacity: a, fontFamily: FONT_UI, textAlign: "center" }}>
      <div style={{ fontSize: 88, fontWeight: 800, color: "#fff", transform: `translateY(${(1 - a) * 20}px)` }}>{big}</div>
      <div style={{ fontSize: 34, color: "#CDBFFF", marginTop: 18, maxWidth: 1400, lineHeight: 1.35 }}>{small}</div>
    </AbsoluteFill>
  );
};

export const Compendium: React.FC = () => (
  <AbsoluteFill style={{ background: BG }}>
    <Audio src={staticFile("audio/music/s13-bed.wav")} volume={0.10} loop />
    <Sequence from={0} durationInFrames={INTRO}><Card big="Tooth Referral dashboard" small="Every screen and animation built so far: the coded app, the animated flows and the 16 glass motion scenes" dur={INTRO} /></Sequence>
    {CH.map((c, i) => <Sequence key={i} from={CP_STARTS[i]} durationInFrames={c.dur}><Frame c={c} i={i} /></Sequence>)}
    <Sequence from={CP_DURATION - OUTRO} durationInFrames={OUTRO}><Card big="Not just a form" small="A system for the team: one shared case, two offices, set up in about 5 minutes" dur={OUTRO} /></Sequence>
  </AbsoluteFill>
);
