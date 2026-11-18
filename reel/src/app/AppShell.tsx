/**
 * Tooth Referral app, rebuilt in code to match the real UI pixel for pixel (reference: the user's screen recordings,
 * captured at 1920 px wide, cleaned stills in public/dash3c). Shared shell: the light-blue sidebar with the logo and
 * navigation, the top bar with the "Ask ToothReferral" box, and the grey page with a white content card.
 * Every page is a 1920x912 frame in the same coordinates as the references, so any page can go straight into a
 * dashboard video, and scripts/app_diff.py checks each one against its reference.
 */
import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { FontGate } from "../effects";

export const APP_W = 1920;
export const APP_H = 912;

export const C = {
  sidebar: "#D8E8F8", navText: "#0E2A5C", activeA: "#C9CFF3", activeB: "#D9E2F9", page: "#F9F9F9", card: "#FFFFFF",
  border: "#EAEAEA", inputBorder: "#D4D7DD", text: "#111827", text2: "#4B5563", muted: "#6B7280", faint: "#9CA3AF",
  purple: "#774AED", purpleText: "#5B34D6", link: "#1D4E9E", green: "#22C55E", rowHl: "#F6F5FD", row: "#F0F4FF", rowLine: "#E3E7F3",
};
export const FONT = "Inter, sans-serif";

/** Lucide-style outline icons (the app uses this icon family). */
export const PATHS: Record<string, string> = {
  analytics: "M4 20V10M10 20V4M16 20v-7M22 20H2",
  users: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75",
  incoming: "M12 3v12M7 10l5 5 5-5M4 21h16", outgoing: "M12 21V9M7 14l5-5 5 5M4 3h16", check: "M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0zM8 12l3 3 5-6",
  bell: "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2zM8 9h8M8 13h5",
  notes: "M3 5h14v10H3zM7 9h10v10H7z", code: "M16 18l6-6-6-6M8 6l-6 6 6 6M14 4l-4 16",
  gear: "M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z",
  office: "M4 21V3h12v18M16 9h4v12M8 7h4M8 11h4M8 15h4M10 21v-3", chev: "M6 9l6 6 6-6", chevUp: "M18 15l-6-6-6 6",
  search: "M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16zM21 21l-4.3-4.3", sparkle: "M12 3l1.9 5.6L19.5 10l-5.6 1.9L12 17.5l-1.9-5.6L4.5 10l5.6-1.4z",
  mail: "M4 4h16v16H4zM4 6l8 7 8-7", chat: "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z",
};
export const Icon: React.FC<{ n: string; s?: number; c?: string; w?: number; style?: React.CSSProperties }> = ({ n, s = 22, c = C.navText, w = 2, style }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" style={style}><path d={PATHS[n]} /></svg>
);

/** The app's sidebar icons (filled / duotone where the app uses them). */
const NavIcon: React.FC<{ n: string; x: number; y: number; sub?: boolean }> = ({ n, x, y, sub }) => {
  const c = "#1E3F86", s = sub ? 20 : 24;
  const st: React.CSSProperties = { position: "absolute", left: x - (sub ? 0 : 1), top: y - s / 2 };
  const svg = (k: React.ReactNode) => <svg width={s} height={s} viewBox="0 0 24 24" style={st}>{k}</svg>;
  switch (n) {
    case "analytics": return svg(<g fill="none" stroke={c} strokeWidth={2}><rect x="3" y="11" width="4" height="9" rx="1" /><rect x="10" y="4" width="4" height="16" rx="1" /><rect x="17" y="8" width="4" height="12" rx="1" /></g>);
    case "users": return svg(<g fill={c}><circle cx="12" cy="7.5" r="3.2" /><circle cx="5" cy="9" r="2.4" /><circle cx="19" cy="9" r="2.4" /><path d="M6 20c0-3.6 2.7-6 6-6s6 2.4 6 6zM1 19c0-2.6 1.6-4.3 4-4.4.9 0 1.3.2 1.3.2C5.4 16.2 5 17.5 5 19zM23 19c0-2.6-1.6-4.3-4-4.4-.9 0-1.3.2-1.3.2.9 1.4 1.3 2.7 1.3 4.2z" /></g>);
    case "bell": return svg(<g><path d="M20 15a2 2 0 0 1-2 2H8l-4 4V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2z" fill="none" stroke={c} strokeWidth={2} /><path d="M8 9h8M8 13h5" stroke={c} strokeWidth={2} /></g>);
    case "notes": return svg(<g><rect x="2" y="4" width="16" height="12" rx="2" fill="none" stroke={c} strokeWidth={2} /><rect x="7" y="9" width="15" height="11" rx="2" fill={c} /></g>);
    case "office": return svg(<g fill="none" stroke={c} strokeWidth={2}><rect x="5" y="2" width="14" height="20" rx="1" /><path d="M9 6h1M14 6h1M9 10h1M14 10h1M9 14h1M14 14h1M10 22v-4h4v4" /></g>);
    default: return <Icon n={n} s={s} c={c} w={2} style={st} />;
  }
};

const NAV: { n: string; t: string; y: number; sub?: boolean; chev?: "up" | "down"; badge?: number }[] = [
  { n: "analytics", t: "Analytics", y: 211 },
  { n: "users", t: "Referrals", y: 276, chev: "up" },
  { n: "incoming", t: "Incoming", y: 341, sub: true },
  { n: "outgoing", t: "Outgoing", y: 401, sub: true },
  { n: "check", t: "Cases Completed", y: 461, sub: true },
  { n: "bell", t: "Notifications", y: 519, badge: 3 },
  { n: "notes", t: "Notes", y: 585 },
  { n: "code", t: "Website Lead Forms", y: 650 },
  { n: "gear", t: "Settings", y: 748, chev: "down" },
  { n: "office", t: "Offices", y: 813, chev: "down" },
];

export type NavKey = "Analytics" | "Referrals" | "Incoming" | "Outgoing" | "Cases Completed" | "Notifications" | "Notes" | "Website Lead Forms" | "Settings" | "Offices";

export const Sidebar: React.FC<{ active?: NavKey; group?: NavKey }> = ({ active = "Incoming", group = "Referrals" }) => (
  <div style={{ position: "absolute", left: 0, top: 0, width: 320, height: APP_H, background: C.sidebar, fontFamily: FONT }}>
    <Img src={staticFile("tr/logo.png")} style={{ position: "absolute", left: 30, top: -6, width: 262 }} />
    {NAV.map((it) => {
      const isActive = it.t === active, isGroup = it.t === group;
      const x = it.sub ? 76 : 41, tx = it.sub ? 105 : 80;
      return (
        <React.Fragment key={it.t}>
          {(isActive || isGroup) && (
            <div style={{ position: "absolute", left: it.sub ? 50 : 20, top: it.y - (it.sub ? 27 : 32), width: it.sub ? 250 : 280, height: it.sub ? 54 : 64, borderRadius: 12,
              background: isActive ? "linear-gradient(90deg, #CDCDF3 0%, #D3D8F6 60%, rgba(216,232,248,0) 100%)" : "linear-gradient(90deg, #CACCF2 0%, #D2D6F5 55%, rgba(216,232,248,.2) 100%)" }} />
          )}
          <NavIcon n={it.n} x={x} y={it.y} sub={it.sub} />
          {it.badge && <div style={{ position: "absolute", left: x + 10, top: it.y - 21, width: 18, height: 18, borderRadius: 18, background: "#E89D15", color: "#fff", font: `700 11px ${FONT}`, display: "flex", alignItems: "center", justifyContent: "center" }}>{it.badge}</div>}
          <div style={{ position: "absolute", left: tx, top: it.y - 14, font: `400 21px ${FONT}`, color: "#1B3A78", letterSpacing: "-0.005em", whiteSpace: "nowrap" }}>{it.t}</div>
          {it.chev && <Icon n={it.chev === "up" ? "chevUp" : "chev"} s={16} c={C.navText} style={{ position: "absolute", left: 266, top: it.y - 8 }} />}
        </React.Fragment>
      );
    })}
    <div style={{ position: "absolute", left: 20, top: 699, width: 280, height: 1, background: "#BFD2EA" }} />
  </div>
);

export const TopBar: React.FC = () => (
  <>
    <div style={{ position: "absolute", left: 320, top: 0, right: 0, height: 76, background: "#fff", borderBottom: `1px solid ${C.border}` }} />
    <div style={{ position: "absolute", left: 350, top: -2, width: 400, height: 55, borderRadius: "0 0 12px 12px", border: `1px solid ${C.border}`, borderTop: "none", background: "#fff", display: "flex", alignItems: "center", gap: 10, paddingLeft: 16, boxSizing: "border-box" }}>
      <Icon n="sparkle" s={22} c="#8B5CF6" w={1.6} />
      <span style={{ font: `400 18.5px ${FONT}`, color: C.faint }}>Ask how to embed, forward, invite...</span>
    </div>
  </>
);

/** Floating support chat button, bottom right. */
export const ChatFab: React.FC<{ x?: number; y?: number }> = ({ x = 1841, y = 820 }) => (
  <div style={{ position: "absolute", left: x, top: y, width: 70, height: 70, borderRadius: 70, background: C.purple, boxShadow: "0 8px 20px rgba(119,74,237,.35)", display: "flex", alignItems: "center", justifyContent: "center" }}>
    <Icon n="chat" s={30} c="#fff" w={2} />
  </div>
);

export const AppFrame: React.FC<{ active?: NavKey; group?: NavKey; children: React.ReactNode }> = ({ active, group, children }) => (
  <FontGate>
    <AbsoluteFill style={{ background: C.page, fontFamily: FONT, overflow: "hidden" }}>
      <TopBar />
      {children}
      <Sidebar active={active} group={group} />
    </AbsoluteFill>
  </FontGate>
);
