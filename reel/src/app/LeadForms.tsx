/** Website Lead Forms (landing), matched to the dashboard-2 recording (viewport 1920x869). */
import React from "react";
import { AppFrame, C, ChatFab, DCARE_USER, FONT, VP, Vp } from "./AppShell";

export const LeadFormsPage: React.FC<{ vh?: Vp; scroll?: number }> = ({ vh = 869, scroll }) => {
  const P = (y: number) => y - VP[vh].head; // viewport y (unscrolled) -> content y
  const T: React.FC<{ x: number; cy: number; s: number; w?: number; c?: string; center?: boolean; children: React.ReactNode }> = ({ x, cy, s, w = 400, c = C.text, center, children }) => (
    <div style={{ position: "absolute", left: center ? x - 800 : x, width: center ? 1600 : undefined, textAlign: center ? "center" : undefined, top: P(cy) - s * 0.7 - 3, font: `${w} ${s}px ${FONT}`, color: c, lineHeight: `${s * 1.4}px`, whiteSpace: "nowrap" }}>{children}</div>
  );
  const chev = (cy: number) => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4B5563" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ position: "absolute", left: 1756, top: P(cy) - 10 }}><path d="M9 6l6 6-6 6" /></svg>;
  return (
    <AppFrame active="Website Lead Forms" group="Referrals" title="Website Lead Forms" clinic="D Care Alliance" user={DCARE_USER} vh={vh} scroll={scroll ?? VP[vh].head * 0}
      fixed={<ChatFab x={1801} y={772} />}>
      <div style={{ position: "absolute", left: 351, top: P(195), width: 1520, height: 1000, background: "#fff", borderRadius: 8, boxShadow: "0 1px 3px rgba(0,0,0,.05)" }} />
      <div style={{ position: "absolute", left: 390, top: P(244), width: 1441, height: 57, background: "#FEFBEA", border: "1px solid #FBE7A1", borderRadius: 8, boxSizing: "border-box" }} />
      <T x={411} cy={273} s={17.5} c="#92400E"><b style={{ fontWeight: 600 }}>Embed trial active.</b> Your website referral embed is available until Dec 2, 2026. Upgrade to Pro to keep embeds after the trial.</T>
      <div style={{ position: "absolute", left: 390, top: P(321), width: 1441, height: 326, border: `1px solid ${C.border}`, borderRadius: 10, boxSizing: "border-box" }} />
      <T x={421} cy={370} s={22.5} w={600}>Choose a web form</T>
      <T x={421} cy={405} s={17.5} c="#4B5563">Configure and embed forms on your practice website from Office Management.</T>
      <div style={{ position: "absolute", left: 421, top: P(437), width: 1379, height: 97, border: `1px solid ${C.border}`, borderRadius: 10, boxSizing: "border-box" }} />
      <T x={442} cy={470} s={17.5} w={600}>Build a Lead Generating Referral Form</T>
      <T x={442} cy={500} s={17.5} c="#4B5563">Build your custom web embedded form.</T>
      {chev(485)}
      <div style={{ position: "absolute", left: 421, top: P(549), width: 1379, height: 67, border: `1px solid ${C.border}`, borderRadius: 10, boxSizing: "border-box" }} />
      <T x={442} cy={582} s={17.5} w={600}>Build a Lead-Generating Contact Us Page</T>
      <div style={{ position: "absolute", left: 805, top: P(571), width: 50, height: 22, borderRadius: 11, background: C.purple, color: "#fff", font: `600 12px ${FONT}`, display: "flex", alignItems: "center", justifyContent: "center", letterSpacing: ".03em" }}>NEW</div>
      {chev(582)}
      <div style={{ position: "absolute", left: 390, top: P(677), width: 1441, height: 300, border: `1px solid ${C.border}`, borderRadius: 10, boxSizing: "border-box" }} />
      <T x={1110} cy={722} s={20} w={600} center>Go live on your website</T>
      <T x={1110} cy={761} s={17.5} c="#4B5563" center>When you are ready, enable the referral embed to publish the form and get your install snippet.</T>
      <div style={{ position: "absolute", left: 980, top: P(793), width: 261, height: 49, borderRadius: 6, background: C.purple, color: "#fff", font: `600 19px ${FONT}`, display: "flex", alignItems: "center", justifyContent: "center" }}>Go live on your website</div>
    </AppFrame>
  );
};
