/**
 * UGC 17 app screens in 1440x900 design coordinates (inside AppFrame). Every screen is a pure function of the props
 * the beat passes in, so each beat owns its timing. Layout constants are exported so beats can aim the camera,
 * cursor and highlights at real element boxes.
 */
import React from "react";
import { Img, staticFile, useCurrentFrame } from "remotion";
import {
  CONSULT_SHORT, DECLINE_NOTE, DECLINE_TIME, DOCS, HARBORVIEW, HISTORY, INCOMING, LAKESIDE, NOTE_KEVIN, NOTE_RACHEL, NOTE_RUIZ,
  OLIVIA, OUTGOING, P, type Patient, STATUSES, type Status, TEMPLATE_LINES, TEMPLATE_NAME, WORD_FILE, XRAYS,
} from "./data";
import { AMBER, AppFrame, Avatar, Btn, Dot, FONT, GREEN, INK, Ico, LINE, MUTED, PANEL, PURPLE, Panel, Pill, clamp, lift, sp } from "./kit";
import { interpolate } from "remotion";

// ------------------------------------------------------------------------------------------- Incoming list
export const LIST = { x: 270, y: 100, w: 1150, rowY: 250, rowH: 112 };
export const rowBox = (i: number) => ({ x: LIST.x + 10, y: LIST.rowY + i * LIST.rowH, w: LIST.w - 20, h: LIST.rowH - 6 });
const COLS = { name: 300, dob: 590, from: 730, status: 1000, upd: 1215 };

export const ListPage: React.FC<{ rows: Patient[]; title: string; fromLabel?: string; hot?: number; hotLift?: [number, number]; rowIn?: number; flash?: number }> = ({ rows, title, fromLabel = "Referring Office", hot, hotLift, rowIn, flash }) => {
  const f = useCurrentFrame();
  return (
    <Panel x={LIST.x} y={LIST.y} w={LIST.w} h={780}>
      <div style={{ position: "absolute", left: 30, top: 24, font: `800 26px ${FONT}`, letterSpacing: "-0.02em" }}>{title}</div>
      <div style={{ position: "absolute", left: 30, top: 74, width: 380, height: 42, borderRadius: 10, border: `1.5px solid ${LINE}`, background: "#fff", display: "flex", alignItems: "center", gap: 10, paddingLeft: 14, font: `400 15px ${FONT}`, color: "#9CA3AF" }}><Ico n="search" s={18} c="#9CA3AF" />Search patients, DOB, office…</div>
      <div style={{ position: "absolute", right: 30, top: 84, display: "flex", alignItems: "center", font: `500 14px ${FONT}`, color: MUTED }}><Dot />Connected Network Member</div>
      {[["Patient", COLS.name], ["DOB", COLS.dob], [fromLabel, COLS.from], ["Status", COLS.status], ["Last update", COLS.upd]].map(([t, x]) => (
        <div key={t as string} style={{ position: "absolute", left: (x as number) - LIST.x, top: 132, font: `700 15px ${FONT}`, color: MUTED, textTransform: "uppercase", letterSpacing: "0.04em" }}>{t}</div>
      ))}
      {rows.map((r, i) => {
        const b = rowBox(i);
        const isHot = i === hot;
        const inP = rowIn !== undefined ? sp(f, rowIn + i * 3, 14, 180) : 1;
        const fl = flash !== undefined && isHot ? Math.max(0, 1 - Math.abs(f - flash) / 8) : 0;
        return (
          <div key={r.name} style={{ position: "absolute", left: b.x - LIST.x, top: b.y - LIST.y, width: b.w, height: b.h, borderRadius: 12, background: isHot ? `rgba(237,231,255,${0.9 + 0.1 * fl})` : "rgba(255,255,255,0.75)", border: `1px solid ${isHot ? "#CBBDFB" : LINE}`, opacity: inP, transform: `translateY(${(1 - inP) * 20}px)`, ...(hotLift && isHot ? lift(f, hotLift[0], hotLift[1]) : {}) }}>
            {isHot && <div style={{ position: "absolute", left: 0, top: 10, bottom: 10, width: 5, borderRadius: 5, background: PURPLE }} />}
            <div style={{ position: "absolute", left: COLS.name - b.x, top: 0, height: b.h, display: "flex", alignItems: "center", gap: 14 }}>
              <Avatar p={r} s={46} />
              <div><div style={{ font: `800 19px ${FONT}`, whiteSpace: "nowrap" }}>{r.name}</div><div style={{ font: `500 14px ${FONT}`, color: MUTED, whiteSpace: "nowrap", marginTop: 3, maxWidth: 230, overflow: "hidden", textOverflow: "ellipsis" }}>{r.reason}</div></div>
            </div>
            <div style={{ position: "absolute", left: COLS.dob - b.x, top: 0, height: b.h, display: "flex", alignItems: "center", font: `500 16px ${FONT}`, color: "#374151" }}>{r.dob}</div>
            <div style={{ position: "absolute", left: COLS.from - b.x, top: 0, width: 260, height: b.h, display: "flex", alignItems: "center", font: `600 16px ${FONT}`, color: "#374151" }}><Dot />{r.from}</div>
            <div style={{ position: "absolute", left: COLS.status - b.x, top: 0, height: b.h, display: "flex", alignItems: "center" }}><Pill s={r.status} size={14.5} /></div>
            <div style={{ position: "absolute", left: COLS.upd - b.x, top: 0, height: b.h, display: "flex", alignItems: "center", font: `500 15px ${FONT}`, color: MUTED, whiteSpace: "nowrap" }}>{r.update}</div>
          </div>
        );
      })}
    </Panel>
  );
};
export const Incoming: React.FC<{ hot?: number; hotLift?: [number, number]; rowIn?: number; flash?: number }> = (p) => (
  <AppFrame title="Incoming Referrals" active="Incoming"><ListPage rows={INCOMING} title="Incoming Referrals" {...p} /></AppFrame>
);

// ------------------------------------------------------------------------------------------- case view
export const HEAD = { x: 270, y: 100, w: 1150, h: 140 };
export const LEFT = { x: 270, y: 256, w: 560, h: 624 };
export const RIGHT = { x: 846, y: 256, w: 574, h: 624 };
export const PILL_BOX = { x: 1060, y: 126, w: 340, h: 44 };

export const CaseHeader: React.FC<{ p: Patient; status: Status; statusText?: string; pillStyle?: React.CSSProperties; tab?: string }> = ({ p, status, statusText, pillStyle, tab = "Details" }) => (
  <Panel x={HEAD.x} y={HEAD.y} w={HEAD.w} h={HEAD.h}>
    <Avatar p={p} s={62} style={{ position: "absolute", left: 26, top: 20 }} />
    <div style={{ position: "absolute", left: 104, top: 18, font: `800 28px ${FONT}`, letterSpacing: "-0.02em" }}>{p.name}</div>
    <div style={{ position: "absolute", left: 104, top: 58, font: `500 15.5px ${FONT}`, color: "#374151", whiteSpace: "nowrap" }}>DOB {p.dob} · {p.reason}</div>
    <div style={{ position: "absolute", left: 104, top: 84, display: "flex", alignItems: "center", font: `500 15px ${FONT}`, color: MUTED, whiteSpace: "nowrap" }}>Referred by&nbsp;<Dot /><b style={{ color: INK }}>{p.from}</b>&nbsp;· {P.whitaker.name}</div>
    <div style={{ position: "absolute", left: PILL_BOX.x - HEAD.x, top: PILL_BOX.y - HEAD.y, width: PILL_BOX.w, height: PILL_BOX.h, display: "flex", alignItems: "center", justifyContent: "flex-end" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, borderRadius: 999, ...pillStyle }}>
        <Pill s={status} size={15} style={{ height: 40, padding: "0 16px" }} />
      </div>
    </div>
    {statusText && <div style={{ position: "absolute", right: 24, top: 76, font: `600 14.5px ${FONT}`, color: "#4B2FC9", whiteSpace: "nowrap" }}>{statusText}</div>}
    <div style={{ position: "absolute", left: 104, top: 110, display: "flex", gap: 26, font: `700 15px ${FONT}` }}>
      {["Details", "Messages", "Documents"].map((t) => <span key={t} style={{ color: t === tab ? PURPLE : MUTED, borderBottom: t === tab ? `3px solid ${PURPLE}` : undefined, paddingBottom: 4 }}>{t}</span>)}
    </div>
  </Panel>
);

/** Left column: referral details + attachments (shared with both offices). */
export const XR_BOX = (i: number) => ({ x: LEFT.x + 24 + i * 262, y: LEFT.y + 330, w: 246, h: 168 });
export const DOC_BOX = { x: LEFT.x + 24, y: LEFT.y + 540, w: 512, h: 52 };
// real X-rays cropped from the Tooth Referral dashboard recordings (public/app), the big viewer uses the Day-Prep pano x4
export const XrayImg: React.FC<{ w: number; h: number; kind?: "pano" | "bw" }> = ({ w, h, kind = "pano" }) => (
  <Img src={staticFile(w > 400 ? "ugc17/xray-big.png" : kind === "bw" ? "app/xray-1.png" : "preop/oldpano.png")}
    style={{ display: "block", width: w, height: h, objectFit: "cover", background: "#0d0e10" }} />
);
export const LeftCol: React.FC<{ signedAt?: number; xrHot?: [number, number] }> = ({ signedAt, xrHot }) => {
  const f = useCurrentFrame();
  const row = (k: string, v: React.ReactNode, y: number) => (
    <div style={{ position: "absolute", left: 24, top: y, right: 24, display: "flex", justifyContent: "space-between", font: `500 15.5px ${FONT}`, color: MUTED }}><span>{k}</span><span style={{ color: INK, fontWeight: 600 }}>{v}</span></div>
  );
  const sOn = signedAt !== undefined ? sp(f, signedAt, 12, 200) : 0;
  return (
    <Panel x={LEFT.x} y={LEFT.y} w={LEFT.w} h={LEFT.h}>
      <div style={{ position: "absolute", left: 24, top: 20, font: `800 19px ${FONT}` }}>Referral details</div>
      {row("Reason", OLIVIA.reason.replace("Implant consultation, ", "Implant consult, "), 62)}
      {row("Referring dentist", P.whitaker.name, 96)}
      {row("Received", "Nov 3, 2026", 130)}
      {row("Consult", CONSULT_SHORT, 164)}
      {row("Insurance", "Delta Dental PPO · on file", 198)}
      <div style={{ position: "absolute", left: 24, right: 24, top: 246, height: 1, background: LINE }} />
      <div style={{ position: "absolute", left: 24, top: 268, display: "flex", alignItems: "center", gap: 8, font: `800 19px ${FONT}` }}>Attachments <span style={{ font: `600 14px ${FONT}`, color: "#16794A", background: "#E3F8EC", borderRadius: 999, padding: "3px 10px" }}>shared with both offices</span></div>
      {[0, 1].map((i) => {
        const b = XR_BOX(i);
        return (
          <div key={i} style={{ position: "absolute", left: b.x - LEFT.x, top: b.y - LEFT.y, width: b.w, borderRadius: 10, overflow: "hidden", border: `1px solid ${LINE}`, background: "#fff", ...(xrHot && i === 0 ? lift(f, xrHot[0], xrHot[1]) : {}) }}>
            <XrayImg w={b.w} h={b.h - 44} kind={i ? "bw" : "pano"} />
            <div style={{ height: 44, display: "flex", alignItems: "center", gap: 8, padding: "0 12px", font: `700 14.5px ${FONT}`, whiteSpace: "nowrap" }}><Ico n="file" s={16} c={PURPLE} />X-ray · {XRAYS[i]}</div>
          </div>
        );
      })}
      <div style={{ position: "absolute", left: DOC_BOX.x - LEFT.x, top: DOC_BOX.y - LEFT.y, width: DOC_BOX.w, height: DOC_BOX.h, borderRadius: 10, border: `1px solid ${LINE}`, background: "#fff", display: "flex", alignItems: "center", gap: 10, padding: "0 14px", font: `600 15px ${FONT}` }}>
        <Ico n="file" s={18} c={PURPLE} />{DOCS[0]}
        {sOn > 0 && <span style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 6, color: "#16794A", font: `700 14.5px ${FONT}`, opacity: sOn, transform: `scale(${0.8 + 0.2 * sOn})` }}><Ico n="pen" s={16} c="#16794A" />Signed note</span>}
      </div>
    </Panel>
  );
};

/** Right column, activity history. `shown` entries visible (each pops in); `hot` gets the highlight. */
export const histBox = (i: number) => ({ x: RIGHT.x + 16, y: RIGHT.y + 64 + i * 92, w: RIGHT.w - 32, h: 84 });
export const History: React.FC<{ shownAt: number[]; hot?: [number, number, number] }> = ({ shownAt, hot }) => {
  const f = useCurrentFrame();
  return (
    <Panel x={RIGHT.x} y={RIGHT.y} w={RIGHT.w} h={RIGHT.h}>
      <div style={{ position: "absolute", left: 20, top: 20, display: "flex", alignItems: "center", gap: 10, font: `800 19px ${FONT}` }}><Ico n="clock" s={20} c={PURPLE} />Activity history<span style={{ font: `500 14px ${FONT}`, color: MUTED }}>· every update stays on the case</span></div>
      {HISTORY.map((h, i) => {
        const at = shownAt[i];
        if (at === undefined || f < at) return null;
        const p = sp(f, at, 13, 200);
        const b = histBox(i);
        const isHot = hot && hot[0] === i;
        return (
          <div key={i} style={{ position: "absolute", left: b.x - RIGHT.x, top: b.y - RIGHT.y, width: b.w, height: b.h, borderRadius: 12, background: "#fff", border: `1px solid ${LINE}`, opacity: Math.min(1, p * 1.4), transform: `translateY(${(1 - p) * 18}px) scale(${0.96 + 0.04 * p})`, display: "flex", gap: 12, padding: "10px 12px", boxSizing: "border-box", ...(isHot ? lift(f, hot![1], hot![2]) : {}) }}>
            <Avatar p={h.who} s={38} />
            <div style={{ minWidth: 0, flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, font: `700 14.5px ${FONT}`, whiteSpace: "nowrap" }}>
                {h.who.name}{h.who.inactive && <span style={{ font: `700 11.5px ${FONT}`, color: "#4B5563", background: "#E5E7EB", borderRadius: 6, padding: "2px 7px" }}>inactive</span>}
                <span style={{ font: `500 13px ${FONT}`, color: MUTED }}>{h.who.office === LAKESIDE ? `(${LAKESIDE})` : ""}</span>
                <span style={{ marginLeft: "auto", font: `500 13px ${FONT}`, color: MUTED }}>{h.when}</span>
              </div>
              <div style={{ font: `600 15px ${FONT}`, color: "#374151", marginTop: 6, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{h.text}</div>
              {h.quote && <div style={{ font: `italic 500 14px ${FONT}`, color: "#4B2FC9", marginTop: 2, whiteSpace: "nowrap" }}>“{h.quote}”</div>}
            </div>
          </div>
        );
      })}
    </Panel>
  );
};

/** Right column, Administrative Notes (private). typed = chars of Rachel's note typed so far; stages by frame. */
export const COMPOSER = { x: RIGHT.x + 16, y: RIGHT.y + 92, w: RIGHT.w - 32, h: 120 };
export const noteBox = (i: number) => ({ x: RIGHT.x + 16, y: RIGHT.y + 232 + i * 126, w: RIGHT.w - 32, h: 116 });
export const AdminNotes: React.FC<{ typed: number; menuAt?: number; pickAt?: number; postAt?: number; ruizAt?: number; kevinAt?: number; lockPulse?: number; composerHot?: [number, number] }> = ({ typed, menuAt, pickAt, postAt, ruizAt, kevinAt, lockPulse, composerHot }) => {
  const f = useCurrentFrame();
  const posted = postAt !== undefined && f >= postAt;
  const picked = pickAt !== undefined && f >= pickAt;
  const menuOpen = menuAt !== undefined && f >= menuAt && !picked;
  const full = NOTE_RACHEL.mention + NOTE_RACHEL.text;
  const shown = posted ? "" : full.slice(0, typed);
  const lp = lockPulse !== undefined && f >= lockPulse ? 1 + 0.25 * Math.abs(Math.sin((f - lockPulse) / 4)) * Math.exp(-(f - lockPulse) / 30) : 1;
  const msg = (who: typeof P.rachel, body: React.ReactNode, i: number, at: number, quote?: string) => {
    const p = sp(f, at, 13, 190);
    const b = noteBox(i);
    return (
      <div style={{ position: "absolute", left: b.x - RIGHT.x, top: b.y - RIGHT.y, width: b.w, minHeight: b.h, borderRadius: 12, background: "#fff", border: `1px solid ${LINE}`, padding: "10px 14px", boxSizing: "border-box", opacity: Math.min(1, p * 1.4), transform: `translateY(${(1 - p) * 16}px)` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 9, font: `700 14.5px ${FONT}` }}><Avatar p={who} s={30} />{who.name}<span style={{ marginLeft: "auto", font: `500 12.5px ${FONT}`, color: MUTED }}>{["9:31 AM", "11:02 AM", "11:20 AM"][i]}</span></div>
        {quote && <div style={{ marginTop: 6, padding: "4px 10px", borderLeft: `3px solid #CBBDFB`, background: "#F5F2FF", borderRadius: 6, font: `500 13px ${FONT}`, color: MUTED, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{quote}</div>}
        <div style={{ marginTop: 6, font: `500 15px/1.35 ${FONT}`, color: "#1F2937" }}>{body}</div>
      </div>
    );
  };
  const mention = <span style={{ background: "#EDE7FF", color: "#4B2FC9", borderRadius: 6, padding: "1px 6px", fontWeight: 700 }}>{NOTE_RACHEL.mention}</span>;
  return (
    <Panel x={RIGHT.x} y={RIGHT.y} w={RIGHT.w} h={RIGHT.h}>
      <div style={{ position: "absolute", left: 20, top: 18, display: "flex", alignItems: "center", gap: 10, font: `800 19px ${FONT}` }}>Administrative Notes</div>
      <div style={{ position: "absolute", left: 20, top: 52, display: "flex", alignItems: "center", gap: 7, font: `600 14px ${FONT}`, color: "#4B2FC9" }}>
        <span style={{ display: "inline-flex", transform: `scale(${lp})` }}><Ico n="lock" s={16} c="#4B2FC9" w={2.4} /></span>Private · only your office
      </div>
      <div style={{ position: "absolute", left: COMPOSER.x - RIGHT.x, top: COMPOSER.y - RIGHT.y, width: COMPOSER.w, height: COMPOSER.h, borderRadius: 12, border: `1.5px solid ${typed > 0 && !posted ? PURPLE : LINE}`, background: "#fff", padding: "12px 14px", boxSizing: "border-box", font: `500 15.5px/1.4 ${FONT}`, color: "#1F2937", ...(composerHot ? lift(f, composerHot[0], composerHot[1]) : {}) }}>
        {shown.length === 0 ? <span style={{ color: "#9CA3AF" }}>Write a private note… type @ to tag a teammate</span> : (
          <>
            {picked ? mention : <span style={{ color: "#4B2FC9", fontWeight: 700 }}>{shown.slice(0, Math.min(shown.length, NOTE_RACHEL.mention.length))}</span>}
            {shown.length > NOTE_RACHEL.mention.length && shown.slice(NOTE_RACHEL.mention.length)}
            {Math.floor(f / 8) % 2 === 0 && <span style={{ display: "inline-block", width: 2, height: 18, background: INK, verticalAlign: "-3px", marginLeft: 1 }} />}
          </>
        )}
        <Btn t="Post" solid style={{ position: "absolute", right: 10, bottom: 10, height: 32, font: `700 13.5px ${FONT}` }} />
      </div>
      {menuOpen && (
        <div style={{ position: "absolute", left: 30, top: COMPOSER.y - RIGHT.y + 62, width: 300, borderRadius: 12, background: "#fff", boxShadow: "0 14px 34px rgba(23,20,42,0.2)", border: `1px solid ${LINE}`, overflow: "hidden", zIndex: 10 }}>
          {[P.ruiz, P.kevin, P.rachel].map((p, i) => (
            <div key={p.name} style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 12px", background: i === 0 ? "#F1ECFF" : undefined, font: `600 15px ${FONT}` }}><Avatar p={p} s={28} />{p.name}<span style={{ font: `500 12.5px ${FONT}`, color: MUTED }}>{p.role}</span></div>
          ))}
        </div>
      )}
      {posted && msg(P.rachel, <>{mention}{NOTE_RACHEL.text}</>, 0, postAt!)}
      {ruizAt !== undefined && f >= ruizAt && msg(P.ruiz, NOTE_RUIZ, 1, ruizAt, `Rachel: “Olivia's pano is from Mar 2023…”`)}
      {kevinAt !== undefined && f >= kevinAt && msg(P.kevin, NOTE_KEVIN, 2, kevinAt)}
    </Panel>
  );
};

/** Office Communication panel (both offices see it). */
export const OfficeComm: React.FC<{ at?: number; hotAt?: [number, number] }> = ({ at, hotAt }) => {
  const f = useCurrentFrame();
  const p = at !== undefined ? sp(f, at, 13, 190) : 1;
  return (
    <Panel x={RIGHT.x} y={RIGHT.y} w={RIGHT.w} h={RIGHT.h}>
      <div style={{ position: "absolute", left: 20, top: 18, display: "flex", alignItems: "center", gap: 10, font: `800 19px ${FONT}` }}><Ico n="msg" s={20} c={PURPLE} />Office Communication</div>
      <div style={{ position: "absolute", left: 20, top: 52, font: `600 14px ${FONT}`, color: "#16794A" }}>Shared with {HARBORVIEW} and {LAKESIDE}</div>
      <div style={{ position: "absolute", left: 16, right: 16, top: 92, borderRadius: 12, background: "#fff", border: `1px solid ${LINE}`, padding: "12px 14px", opacity: p, transform: `translateY(${(1 - p) * 16}px)`, ...(hotAt ? lift(f, hotAt[0], hotAt[1]) : {}) }}>
        <div style={{ display: "flex", alignItems: "center", gap: 9, font: `700 14.5px ${FONT}` }}><Avatar p={P.rachel} s={30} />{P.rachel.name}<span style={{ font: `500 13px ${FONT}`, color: MUTED }}>({HARBORVIEW})</span></div>
        <div style={{ marginTop: 8, display: "flex", alignItems: "center", gap: 8 }}><Pill s="Declined Appointment" size={13.5} /><span style={{ font: `700 14px ${FONT}`, color: "#7A4B00" }}>{DECLINE_TIME}</span></div>
        <div style={{ marginTop: 8, font: `500 15.5px/1.4 ${FONT}`, color: "#1F2937" }}>“{DECLINE_NOTE}”</div>
      </div>
    </Panel>
  );
};

// ------------------------------------------------------------------------------------------- templates (FIX 4)
export const DROP = { x: 300, y: 196, w: 520, h: 200 };
export const TPL_CARD = { x: 300, y: 420, w: 1090, h: 440 };
export const TemplatesPage: React.FC<{ dropAt: number; cardAt: number }> = ({ dropAt, cardAt }) => {
  const f = useCurrentFrame();
  const prog = interpolate(f, [dropAt + 6, dropAt + 16], [0, 1], clamp);
  const fileIn = sp(f, dropAt - 10, 12, 160);
  const card = sp(f, cardAt, 14, 170);
  return (
    <AppFrame title="Notes" active="Notes">
      <Panel x={270} y={100} w={1150} h={780}>
        <div style={{ position: "absolute", left: 30, top: 24, font: `800 24px ${FONT}` }}>Case Communication Templates</div>
        <div style={{ position: "absolute", left: 30, top: 62, font: `500 15px ${FONT}`, color: MUTED }}>Write it once. Every case fills in its own patient, office and doctor.</div>
        <div style={{ position: "absolute", left: 870, top: 106, width: 250, display: "flex", flexDirection: "column", gap: 10 }}>
          {["Consult received", "Post-op follow-up"].map((t) => <div key={t} style={{ borderRadius: 10, border: `1px solid ${LINE}`, background: "#fff", padding: "12px 14px", font: `600 15px ${FONT}` }}>{t}</div>)}
        </div>
      </Panel>
      <div style={{ position: "absolute", left: DROP.x, top: DROP.y, width: DROP.w, height: DROP.h, borderRadius: 14, border: `2px dashed ${f >= dropAt ? PURPLE : "#C4B8F5"}`, background: f >= dropAt ? "rgba(237,231,255,0.9)" : "rgba(255,255,255,0.8)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10 }}>
        <Ico n="upload" s={34} c={PURPLE} />
        <div style={{ font: `800 19px ${FONT}` }}>Import from Word</div>
        <div style={{ font: `500 14px ${FONT}`, color: MUTED }}>.docx or PDF · we turn it into a template</div>
        {f >= dropAt && <div style={{ width: 340, height: 8, borderRadius: 8, background: "#E5E0FA", overflow: "hidden" }}><div style={{ width: `${prog * 100}%`, height: 8, background: PURPLE }} /></div>}
      </div>
      {f < dropAt + 18 && (
        <div style={{ position: "absolute", left: DROP.x + 120 + (1 - fileIn) * 300, top: DROP.y + 70 - (1 - fileIn) * 120, opacity: Math.min(1, fileIn * 2) * interpolate(f, [dropAt + 8, dropAt + 18], [1, 0], clamp), display: "flex", alignItems: "center", gap: 10, padding: "10px 16px", borderRadius: 10, background: "#fff", boxShadow: "0 14px 30px rgba(23,20,42,0.22)", font: `700 15px ${FONT}`, transform: `rotate(${(1 - fileIn) * -8}deg)` }}>
          <span style={{ width: 30, height: 36, borderRadius: 4, background: "#2B579A", color: "#fff", font: `800 13px ${FONT}`, display: "flex", alignItems: "center", justifyContent: "center" }}>W</span>{WORD_FILE}
        </div>
      )}
      {f >= cardAt && (
        <div style={{ position: "absolute", left: TPL_CARD.x, top: TPL_CARD.y, width: TPL_CARD.w, height: TPL_CARD.h, borderRadius: 14, background: PANEL, border: `1.5px solid #CBBDFB`, boxShadow: "0 12px 30px rgba(109,74,232,0.18)", opacity: card, transform: `translateY(${(1 - card) * 30}px) scale(${0.96 + 0.04 * card})`, padding: "20px 26px", boxSizing: "border-box" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, font: `800 20px ${FONT}` }}><Ico n="file" s={22} c={PURPLE} />{TEMPLATE_NAME}<span style={{ font: `700 13px ${FONT}`, color: "#16794A", background: "#E3F8EC", borderRadius: 999, padding: "3px 10px" }}>New template</span></div>
          <Letter mode="vars" top={64} />
        </div>
      )}
    </AppFrame>
  );
};

/** The letter body. mode "vars" shows {{variables}} in purple; "values" flips line by line at swapAt[i]. */
export const LETTER_LINE_Y = (top: number, i: number) => top + i * 62;
export const Letter: React.FC<{ mode: "vars" | "values"; top: number; swapAt?: number[] }> = ({ mode, top, swapAt = [] }) => {
  const f = useCurrentFrame();
  return (
    <>
      {TEMPLATE_LINES.map((line, i) => (
        <div key={i} style={{ position: "absolute", left: 26, right: 26, top: LETTER_LINE_Y(top, i), font: `500 19px ${FONT}`, color: "#1F2937", whiteSpace: "nowrap" }}>
          {line.map((seg, j) => {
            const at = swapAt[i];
            const k = mode === "values" && at !== undefined ? interpolate(f, [at, at + 4], [0, 1], clamp) : 0;
            const showVal = k >= 0.5;
            const blur = k > 0 && k < 1 ? (1 - Math.abs(k - 0.5) * 2) * 6 : 0;
            return (
              <React.Fragment key={j}>
                {seg.label}
                <span style={{ display: "inline-block", padding: "1px 8px", borderRadius: 7, font: `${showVal ? 700 : 600} 18.5px ${FONT}`, background: showVal ? "#E3F8EC" : "#EDE7FF", color: showVal ? "#16794A" : "#4B2FC9", filter: blur ? `blur(${blur}px)` : undefined }}>{showVal ? seg.value : seg.v}</span>
              </React.Fragment>
            );
          })}
        </div>
      ))}
    </>
  );
};

/** Prepare Consultation Note modal over the case. */
export const MODAL = { x: 360, y: 110, w: 980, h: 720 };
export const SHOW_VALUES = { x: MODAL.x + 760, y: MODAL.y + 96, w: 190, h: 42 };
export const SIGN_SEND = { x: MODAL.x + 770, y: MODAL.y + 650, w: 180, h: 46 };
export const ConsultModal: React.FC<{ swapAt: number[]; valuesOn: boolean; children?: React.ReactNode }> = ({ swapAt, valuesOn, children }) => (
  <>
    <div style={{ position: "absolute", inset: 0, background: "rgba(23,20,42,0.28)" }} />
    <div style={{ position: "absolute", left: MODAL.x, top: MODAL.y, width: MODAL.w, height: MODAL.h, borderRadius: 16, background: "#fff", boxShadow: "0 30px 60px rgba(23,20,42,0.3)", overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 28, top: 22, font: `800 24px ${FONT}` }}>Prepare Consultation Note</div>
      <div style={{ position: "absolute", left: 28, top: 58, font: `500 15px ${FONT}`, color: MUTED }}>{OLIVIA.name} · {OLIVIA.reason} · to {LAKESIDE}</div>
      <div style={{ position: "absolute", left: 28, top: 96, width: 420, height: 42, borderRadius: 10, border: `1.5px solid ${LINE}`, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 14px", font: `600 15.5px ${FONT}` }}>Template: {TEMPLATE_NAME}<Ico n="chev" s={16} c={MUTED} /></div>
      <div style={{ position: "absolute", left: SHOW_VALUES.x - MODAL.x, top: SHOW_VALUES.y - MODAL.y, width: SHOW_VALUES.w, height: SHOW_VALUES.h, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, font: `700 15px ${FONT}`, background: valuesOn ? PURPLE : "#fff", color: valuesOn ? "#fff" : PURPLE, border: `1.5px solid ${PURPLE}` }}>
        <span style={{ width: 30, height: 18, borderRadius: 18, background: valuesOn ? "#fff" : "#DDD6FE", position: "relative" }}><span style={{ position: "absolute", top: 2, left: valuesOn ? 14 : 2, width: 14, height: 14, borderRadius: 14, background: valuesOn ? PURPLE : "#fff" }} /></span>Show values
      </div>
      <div style={{ position: "absolute", left: 28, right: 28, top: 160, height: 460, borderRadius: 12, border: `1px solid ${LINE}`, background: "#FBFAFF" }}>
        <Letter mode={valuesOn ? "values" : "vars"} top={30} swapAt={swapAt} />
      </div>
      <Btn t="Route to doctor" style={{ position: "absolute", left: SIGN_SEND.x - MODAL.x - 200, top: SIGN_SEND.y - MODAL.y, height: 46 }} />
      <Btn t="Sign and Send" solid style={{ position: "absolute", left: SIGN_SEND.x - MODAL.x, top: SIGN_SEND.y - MODAL.y, width: SIGN_SEND.w, height: SIGN_SEND.h }} />
      {children}
    </div>
  </>
);
/** Signing panel inside the modal: handwritten signature draws over 16 frames from drawAt; "All done" at doneAt. */
export const SignPanel: React.FC<{ at: number; drawAt: number; doneAt: number }> = ({ at, drawAt, doneAt }) => {
  const f = useCurrentFrame();
  const p = sp(f, at, 14, 180);
  const d = interpolate(f, [drawAt, drawAt + 16], [0, 1], clamp);
  const done = f >= doneAt;
  return (
    <div style={{ position: "absolute", inset: 0, background: "#fff", opacity: p, transform: `translateY(${(1 - p) * 30}px)` }}>
      <div style={{ position: "absolute", left: 28, top: 24, display: "flex", alignItems: "center", gap: 12, font: `800 24px ${FONT}` }}><Avatar p={P.ruiz} s={40} />{P.ruiz.name} · Sign consultation note</div>
      <div style={{ position: "absolute", left: 28, right: 28, top: 96, height: 300, borderRadius: 14, border: `1.5px dashed #C4B8F5`, background: "#FBFAFF" }}>
        <svg viewBox="0 0 900 300" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
          <path d="M120 200 C150 90 190 90 175 190 C168 240 230 120 260 150 C285 175 300 205 330 160 C350 130 370 150 380 175 C395 210 430 120 460 150 C480 170 470 210 510 180 C540 160 560 120 590 170 C610 200 650 175 700 150 M560 220 L760 215"
            stroke="#1B1A3A" strokeWidth={5} fill="none" strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - d} />
        </svg>
        <div style={{ position: "absolute", left: 30, bottom: 18, right: 30, borderTop: `1.5px solid ${LINE}`, paddingTop: 8, font: `500 14px ${FONT}`, color: MUTED }}>Signed electronically · {P.ruiz.name}, {P.ruiz.role}</div>
      </div>
      {done && (
        <div style={{ position: "absolute", left: 28, right: 28, top: 420, height: 120, borderRadius: 14, background: "#E3F8EC", display: "flex", alignItems: "center", gap: 16, padding: "0 24px", transform: `scale(${0.9 + 0.1 * sp(f, doneAt, 12, 220)})` }}>
          <span style={{ width: 54, height: 54, borderRadius: 54, background: GREEN, display: "flex", alignItems: "center", justifyContent: "center" }}><Ico n="ok" s={30} c="#fff" w={3.4} /></span>
          <div><div style={{ font: `800 26px ${FONT}`, color: "#14532D" }}>All done</div><div style={{ font: `500 16px ${FONT}`, color: "#166534" }}>Signed and sent back to {LAKESIDE}</div></div>
        </div>
      )}
    </div>
  );
};

/** Status dropdown under the pill (FIX 5). */
export const DD = { x: 1070, y: 178, w: 330, itemH: 40 };
export const ddItem = (i: number) => ({ x: DD.x + 6, y: DD.y + 8 + i * DD.itemH, w: DD.w - 12, h: DD.itemH - 4 });
export const StatusMenu: React.FC<{ hover?: number; at: number }> = ({ hover, at }) => {
  const f = useCurrentFrame();
  const p = sp(f, at, 15, 220);
  return (
    <div style={{ position: "absolute", left: DD.x, top: DD.y, width: DD.w, height: 16 + STATUSES.length * DD.itemH, borderRadius: 12, background: "#fff", boxShadow: "0 18px 40px rgba(23,20,42,0.25)", border: `1px solid ${LINE}`, opacity: p, transform: `translateY(${(1 - p) * -10}px) scaleY(${0.9 + 0.1 * p})`, transformOrigin: "top", zIndex: 25 }}>
      {STATUSES.map((s, i) => {
        const b = ddItem(i);
        return <div key={s} style={{ position: "absolute", left: 6, top: b.y - DD.y, width: b.w, height: b.h, borderRadius: 8, display: "flex", alignItems: "center", padding: "0 10px", background: hover === i ? "#FFF1CC" : undefined, font: `${hover === i ? 700 : 500} 15.5px ${FONT}`, color: s === "Declined Appointment" ? "#7A4B00" : INK }}>{s}</div>;
      })}
    </div>
  );
};
export const NOTEBOX = { x: 420, y: 300, w: 860, h: 300 };
export const UPDATE_BTN = { x: NOTEBOX.x + 640, y: NOTEBOX.y + 230, w: 190, h: 46 };
export const DeclineNote: React.FC<{ at: number; typed: number }> = ({ at, typed }) => {
  const f = useCurrentFrame();
  const p = sp(f, at, 14, 190);
  return (
    <>
      <div style={{ position: "absolute", inset: 0, background: "rgba(23,20,42,0.22)", opacity: p }} />
      <div style={{ position: "absolute", left: NOTEBOX.x, top: NOTEBOX.y, width: NOTEBOX.w, height: NOTEBOX.h, borderRadius: 16, background: "#fff", boxShadow: "0 24px 50px rgba(23,20,42,0.28)", opacity: p, transform: `scale(${0.94 + 0.06 * p})` }}>
        <div style={{ position: "absolute", left: 26, top: 20, display: "flex", alignItems: "center", gap: 10, font: `800 21px ${FONT}` }}>Update status <Pill s="Declined Appointment" size={14} /></div>
        <div style={{ position: "absolute", left: 26, top: 58, font: `500 14.5px ${FONT}`, color: MUTED }}>Add a short note. {LAKESIDE} is notified right away.</div>
        <div style={{ position: "absolute", left: 26, right: 26, top: 92, height: 120, borderRadius: 12, border: `1.5px solid ${PURPLE}`, padding: "12px 14px", boxSizing: "border-box", font: `500 17px/1.45 ${FONT}`, color: "#1F2937" }}>
          {DECLINE_NOTE.slice(0, typed)}{typed < DECLINE_NOTE.length && Math.floor(f / 8) % 2 === 0 && <span style={{ display: "inline-block", width: 2, height: 19, background: INK, verticalAlign: "-3px" }} />}
        </div>
        <Btn t="Update Status" solid style={{ position: "absolute", left: UPDATE_BTN.x - NOTEBOX.x, top: UPDATE_BTN.y - NOTEBOX.y, width: UPDATE_BTN.w, height: UPDATE_BTN.h, font: `700 15.5px ${FONT}` }} />
      </div>
    </>
  );
};

/** Toast at the top right of the page. */
export const Toast: React.FC<{ at: number; text: string; tone?: "green" | "purple" }> = ({ at, text, tone = "green" }) => {
  const f = useCurrentFrame();
  if (f < at) return null;
  const p = sp(f, at, 14, 200);
  const c = tone === "green" ? GREEN : PURPLE;
  return (
    <div style={{ position: "absolute", right: 30, top: 100, maxWidth: 640, display: "flex", alignItems: "center", gap: 12, padding: "14px 18px", borderRadius: 12, background: "#fff", borderLeft: `6px solid ${c}`, boxShadow: "0 16px 40px rgba(23,20,42,0.22)", font: `700 16px ${FONT}`, color: INK, opacity: p, transform: `translateX(${(1 - p) * 60}px)`, zIndex: 40 }}>
      <span style={{ width: 30, height: 30, borderRadius: 30, background: c, display: "flex", alignItems: "center", justifyContent: "center", flex: "none" }}><Ico n="ok" s={18} c="#fff" w={3.2} /></span>{text}
    </div>
  );
};

/** Lakeside's dashboard (FIX 5, after the flip): Outgoing referrals, signed in as Megan Cole. */
export const LakesideOutgoing: React.FC<{ notifAt: number; commAt?: number; commHot?: [number, number] }> = ({ notifAt, commAt, commHot }) => {
  const f = useCurrentFrame();
  const n = sp(f, notifAt, 14, 190);
  return (
    <AppFrame title="Outgoing Referrals" active="Outgoing" user={P.megan} office={LAKESIDE} badge={f >= notifAt ? 1 : 0} badgePop={notifAt}>
      <div style={{ position: "absolute", left: 270, top: 100, width: 560, height: 780 }}>
        <Panel x={0} y={0} w={560} h={780}>
          <div style={{ position: "absolute", left: 24, top: 22, font: `800 22px ${FONT}` }}>Sent to {HARBORVIEW}</div>
          {OUTGOING.map((r, i) => (
            <div key={r.name} style={{ position: "absolute", left: 16, right: 16, top: 76 + i * 118, height: 106, borderRadius: 12, background: i === 0 ? "#FFF6E0" : "#fff", border: `1px solid ${i === 0 ? "#F5D38A" : LINE}`, display: "flex", alignItems: "center", gap: 12, padding: "0 14px" }}>
              <Avatar p={r} s={44} />
              <div style={{ minWidth: 0 }}><div style={{ font: `800 18px ${FONT}` }}>{r.name}</div><div style={{ font: `500 13.5px ${FONT}`, color: MUTED, marginTop: 3 }}>{r.reason}</div>
                <div style={{ marginTop: 6 }}><Pill s={r.status} size={13} /></div></div>
            </div>
          ))}
        </Panel>
      </div>
      <OfficeComm at={commAt} hotAt={commHot} />
      {f >= notifAt && (
        <div style={{ position: "absolute", right: 24, top: 96, width: 560, padding: "14px 16px", borderRadius: 14, background: "#fff", borderLeft: `6px solid ${AMBER}`, boxShadow: "0 18px 40px rgba(23,20,42,0.25)", opacity: n, transform: `translateX(${(1 - n) * 80}px)`, zIndex: 40, display: "flex", gap: 12 }}>
          <Ico n="bell" s={24} c="#B7791F" />
          <div style={{ font: `600 15.5px/1.4 ${FONT}`, color: INK }}>{HARBORVIEW} updated <b>Daniel Ortiz</b>: Declined Appointment · <b style={{ color: "#7A4B00" }}>{DECLINE_TIME}</b></div>
        </div>
      )}
    </AppFrame>
  );
};
