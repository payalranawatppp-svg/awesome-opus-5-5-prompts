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

const NAV: { n: string; t: string; sub?: boolean; chev?: "up" | "down"; badge?: number }[] = [
  { n: "analytics", t: "Analytics" }, { n: "users", t: "Referrals", chev: "up" }, { n: "incoming", t: "Incoming", sub: true },
  { n: "outgoing", t: "Outgoing", sub: true }, { n: "check", t: "Cases Completed", sub: true }, { n: "bell", t: "Notifications", badge: 3 },
  { n: "notes", t: "Notes" }, { n: "code", t: "Website Lead Forms" }, { n: "gear", t: "Settings", chev: "down" }, { n: "office", t: "Offices", chev: "down" },
];

/** The app sizes its vertical spacing from the viewport height. Two measured presets: 912 (dashboard-3 recording,
 * the default for videos) and 869 (dashboard-2 recording, a browser with a taller toolbar). Nav y values are in the
 * sidebar's coordinates (page y - head). */
export type Vp = 912 | 869;
export const VP: Record<Vp, { head: number; nav: number[]; divider: number; logoTop: number; logoH: number; hl: number; subHl: number; btnTop: number; btnH: number; askTop: number; askH: number; titleTop: number; clinicTop: number; navDy: number; hdrDy: number }> = {
  912: { head: 97, nav: [211, 276, 341, 401, 461, 520, 585, 650, 748, 813], divider: 699, logoTop: -6, logoH: 1, hl: 64, subHl: 54, btnTop: 24, btnH: 56, askTop: 92, askH: 60, titleTop: 35, clinicTop: 38, navDy: 2, hdrDy: 0 },
  869: { head: 86, nav: [202, 262, 322, 377, 432, 487, 547, 607, 698, 758], divider: 652, logoTop: 0, logoH: 0.923, hl: 60, subHl: 50, btnTop: 25, btnH: 52, askTop: 89, askH: 54, titleTop: 32, clinicTop: 34, navDy: -1, hdrDy: -3 },
};

export type NavKey = "Analytics" | "Referrals" | "Incoming" | "Outgoing" | "Cases Completed" | "Notifications" | "Notes" | "Website Lead Forms" | "Settings" | "Offices";

/** Height of the app header above the content (page title, Ask box, header buttons). Pages lay out their content in
 * coordinates where y = 0 is HEAD px below the top of the unscrolled page, so `scroll = HEAD` shows the content flush
 * under the browser top, as in the scrolled recordings. */
export const HEAD = 97;

export const Sidebar: React.FC<{ active?: NavKey; group?: NavKey; clinic?: string; vh?: Vp }> = ({ active = "Incoming", group = "Referrals", clinic = "Gentle dental clinic", vh = 912 }) => {
  const M = VP[vh];
  return (
  <div style={{ position: "absolute", left: 0, top: 0, width: 320, height: APP_H + HEAD + 4000, background: C.sidebar, fontFamily: FONT }}>
    <div style={{ position: "absolute", left: 0, width: 320, top: M.clinicTop, textAlign: "center", font: `600 22.3px ${FONT}`, color: "#002A5D", whiteSpace: "nowrap" }}>{clinic}</div>
    <div style={{ position: "absolute", left: 0, top: M.head, width: 320 }}>
    <Img src={staticFile("tr/logo.png")} style={{ position: "absolute", left: 30, top: M.logoTop, width: 262, transform: `scaleY(${M.logoH})`, transformOrigin: "top" }} />
    {NAV.map((n, i) => ({ ...n, y: M.nav[i] })).map((it) => {
      const isActive = it.t === active, isGroup = it.t === group;
      const x = it.sub ? 76 : 41, tx = it.sub ? 105 : 80;
      return (
        <React.Fragment key={it.t}>
          {(isActive || isGroup) && (
            <div style={{ position: "absolute", left: it.sub ? 50 : 20, top: it.y - (it.sub ? M.subHl : M.hl) / 2, width: it.sub ? 250 : 280, height: it.sub ? M.subHl : M.hl, borderRadius: 12,
              background: isActive ? "linear-gradient(90deg, #CDCDF3 0%, #D3D8F6 60%, rgba(216,232,248,0) 100%)" : "linear-gradient(90deg, #CACCF2 0%, #D2D6F5 55%, rgba(216,232,248,.2) 100%)" }} />
          )}
          <NavIcon n={it.n} x={x} y={it.y} sub={it.sub} />
          {it.badge && <div style={{ position: "absolute", left: x + 10, top: it.y - 21, width: 18, height: 18, borderRadius: 18, background: "#E89D15", color: "#fff", font: `700 11px ${FONT}`, display: "flex", alignItems: "center", justifyContent: "center" }}>{it.badge}</div>}
          <div style={{ position: "absolute", left: tx, top: it.y - 14 + M.navDy, font: `400 20.1px ${FONT}`, color: "#1B3A78", letterSpacing: "-0.005em", whiteSpace: "nowrap" }}>{it.t}</div>
          {it.chev && <Icon n={it.chev === "up" ? "chevUp" : "chev"} s={16} c={C.navText} style={{ position: "absolute", left: 266, top: it.y - 8 }} />}
        </React.Fragment>
      );
    })}
    <div style={{ position: "absolute", left: 20, top: M.divider, width: 280, height: 1, background: "#BFD2EA" }} />
    </div>
  </div>
  );
};

export type User = { ini: string; name: string; role: string; img?: string };
export const DCARE_USER: User = { ini: "LD", name: "Lee Davis", role: "Associate Dentist", img: "app/dcare-avatar.png" };
export const DEFAULT_USER: User = { ini: "JW", name: "Jane White", role: "Dental Assistant" };

const HBtn: React.FC<{ w: number; t: string; solid?: boolean; h: number; dy: number }> = ({ w, t, solid, h, dy }) => (
  <div style={{ flex: "none", paddingBottom: -dy * 2, width: w, height: h, borderRadius: 4, boxSizing: "border-box", border: solid ? "none" : `1.5px solid ${C.purple}`, background: solid ? C.purple : "#fff", color: solid ? "#fff" : C.purpleText, font: `500 19.9px ${FONT}`, display: "flex", alignItems: "center", justifyContent: "center", whiteSpace: "nowrap" }}>{t}</div>
);

/** The app header: page title, office switcher, header buttons, signed-in user, and the "Ask" box under the title. */
export const TopBar: React.FC<{ title?: string; clinic?: string; user?: User; vh?: Vp }> = ({ title = "Incoming Referrals", clinic = "Gentle dental clinic", user = DEFAULT_USER, vh = 912 }) => {
  const M = VP[vh];
  return (
  <>
    <div style={{ position: "absolute", left: 320, top: 0, right: 0, height: M.head + 76, background: "#fff", borderBottom: `1px solid ${C.border}` }} />
    <div style={{ position: "absolute", left: 350, top: M.titleTop, font: `600 29.4px ${FONT}`, color: C.text, letterSpacing: "-0.01em", whiteSpace: "nowrap" }}>{title}</div>
    <div style={{ position: "absolute", right: 1920 - 1836, top: M.btnTop, height: M.btnH, display: "flex", alignItems: "center", gap: 10, whiteSpace: "nowrap" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 9, font: `500 18px ${FONT}`, color: "#374151", position: "relative", top: M.hdrDy }}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#4B5563" strokeWidth="1.6" strokeLinejoin="round"><path d="M6 21V4a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v17M16 9h3a1 1 0 0 1 1 1v11M4 21h17M9 7h4M9 11h4M9 15h4" /></svg>{clinic}
      </div>
      <HBtn w={304} t="Provider's Day-Prep Station" h={M.btnH} dy={M.hdrDy} />
      <HBtn w={228} t="Invite your Network" h={M.btnH} dy={M.hdrDy} />
      <HBtn w={162} t="New Referral" solid h={M.btnH} dy={M.hdrDy} />
      {user.img ? <Img src={staticFile(user.img)} style={{ width: 40, height: 40, borderRadius: 40, objectFit: "cover" }} />
        : <div style={{ width: 40, height: 40, borderRadius: 40, background: "#E5DEFC", color: "#5B34D6", font: `600 15px ${FONT}`, display: "flex", alignItems: "center", justifyContent: "center" }}>{user.ini}</div>}
      <div style={{ position: "relative", top: M.hdrDy }}>
        <div style={{ font: `400 20px ${FONT}`, color: C.text, lineHeight: "28px" }}>{user.name}</div>
        <div style={{ font: `400 17.5px ${FONT}`, color: C.muted, lineHeight: "26px", marginTop: 3 }}>{user.role}</div>
      </div>
    </div>
    <Icon n="chev" s={20} c={C.muted} style={{ position: "absolute", left: 1849, top: 42 }} />
    <div style={{ position: "absolute", left: 350, top: M.askTop, width: 400, height: M.askH, borderRadius: 12, border: `1.5px solid ${C.border}`, background: "#fff", display: "flex", alignItems: "center", gap: 10, paddingLeft: 16, boxSizing: "border-box" }}>
      <Icon n="sparkle" s={22} c="#8B5CF6" w={1.6} />
      <span style={{ font: `400 17.5px ${FONT}`, color: C.faint, transform: `translateY(${M.hdrDy - 1}px)` }}>Ask how to embed, forward, invite...</span>
    </div>
  </>
  );
};

/** Floating support chat button, bottom right. */
export const ChatFab: React.FC<{ x?: number; y?: number }> = ({ x = 1841, y = 820 }) => (
  <div style={{ position: "absolute", left: x, top: y, width: 70, height: 70, borderRadius: 70, background: C.purple, boxShadow: "0 8px 20px rgba(119,74,237,.35)", display: "flex", alignItems: "center", justifyContent: "center" }}>
    <Icon n="chat" s={30} c="#fff" w={2} />
  </div>
);

/** A whole app page. `scroll` is how far the page is scrolled (0 = top, HEAD = header just out of view, as in the
 * scrolled recordings). Children are laid out in content coordinates (y = 0 at HEAD px down the unscrolled page);
 * `fixed` children (chat button, modals) stay put in the viewport. */
export const AppFrame: React.FC<{ active?: NavKey; group?: NavKey; title?: string; clinic?: string; user?: User; scroll?: number; vh?: Vp; fixed?: React.ReactNode; children: React.ReactNode }> = ({ active, group, title, clinic, user, scroll = HEAD, vh = 912, fixed, children }) => (
  <FontGate>
    <AbsoluteFill style={{ background: C.page, fontFamily: FONT, overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 0, top: -scroll, width: APP_W, height: APP_H + scroll }}>
        <TopBar title={title} clinic={clinic} user={user} vh={vh} />
        <div style={{ position: "absolute", left: 0, top: VP[vh].head, width: APP_W }}>{children}</div>
        <Sidebar active={active} group={group} clinic={clinic} vh={vh} />
      </div>
      {fixed}
    </AbsoluteFill>
  </FontGate>
);
