/**
 * "Same referral, two ways": one endodontic referral on a realistic timeline (sent Monday 9:41, patient called and
 * consultation booked the same afternoon, consultation Thursday, root canal completed the next Tuesday; close to the
 * canonical analytics averages), shown as Tooth Referral activity-log entries and office messages beside the typical
 * web-form path (email, phone tag, fax, no status).
 */
import React from "react";
import { AbsoluteFill, Audio, Img, interpolate, spring, staticFile, useCurrentFrame } from "remotion";
import transcript from "../data/transcript-camp.json";
import { FONT_DISPLAY, FONT_MONO, FONT_UI } from "../theme";
import { FontGate } from "../effects/shared";

const FPS = 30;
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const PURPLE = "#6D4AE8", INK = "#16132B", AMBER = "#C9800E", GREEN = "#1F9D6B", GREY = "#8A8796";
const sp = (t: number, at: number, d = 14) => (t < at ? 0 : spring({ frame: Math.round((t - at) * FPS), fps: FPS, config: { damping: d, stiffness: 170, mass: 0.7 } }));
const ramp = (t: number, a: number, b: number) => interpolate(t, [a, b], [0, 1], clamp);

type CardT = { at: number; h: number; icon?: string; who?: string; time?: string; text: string; sub?: string; tone: "bad" | "log" | "msg" | "good" };
const LEFT: CardT[] = [
  { at: 12.5, h: 140, icon: "✉", text: "Becomes an email", sub: "in a shared inbox", tone: "bad" },
  { at: 14.1, h: 104, icon: "?", text: "Nobody assigned", tone: "bad" },
  { at: 25.5, h: 140, icon: "☎", text: "Call about the X-ray", sub: "voicemail, call back", tone: "bad" },
  { at: 27.0, h: 140, icon: "⎙", text: "New X-ray by fax", sub: "or email, if it arrives", tone: "bad" },
  { at: 39.2, h: 140, icon: "☎", text: "\"Was she scheduled?\"", sub: "the dentist has to call", tone: "bad" },
  { at: 42.6, h: 104, icon: "∅", text: "No update sent", tone: "bad" },
  { at: 46.4, h: 140, icon: "⎙", text: "Completion letter", sub: "print, sign, fax", tone: "bad" },
];
const RIGHT: CardT[] = [
  { at: 9.1, h: 152, who: "Greg · Gentle Dental", time: "Mon 9:41 am", text: "New referral: root canal, tooth #19 · X-rays + insurance attached", tone: "log" },
  { at: 16.2, h: 96, who: "Amanda", time: "Mon 9:58 am", text: "received Referral", tone: "log" },
  { at: 28.0, h: 214, who: "Amanda · St. Andrew's", time: "Mon 11:20 am", text: "Hi Greg, thank you for the referral. The radiograph on file is from May 2022. Could you upload a current PA of #19?", tone: "msg" },
  { at: 31.1, h: 182, who: "Greg · Gentle Dental", time: "Mon 2:05 pm", text: "Of course, Amanda. A current PA of #19 is on the case now. Let us know if you need anything else.", tone: "msg" },
  { at: 33.0, h: 128, who: "Amanda", time: "Mon 2:12 pm", text: "Received, thank you. We'll call her today.", tone: "msg" },
  { at: 35.3, h: 152, who: "Amanda", time: "Mon 3:40 pm", text: "Consultation Scheduled · Thu 10:00 am · Gentle Dental notified", tone: "log" },
  { at: 42.2, h: 152, who: "Barbara", time: "Thu 10:45 am", text: "Consultation Completed · root canal booked for Tue", tone: "log" },
  { at: 45.6, h: 152, who: "Tanya", time: "Tue 4:30 pm", text: "Completed · signed note sent to Gentle Dental", tone: "good" },
];
const CLOCK: [number, string, string][] = [[0, "", "one referral"], [6.7, "9:41", "AM · Monday"], [16.2, "9:58", "AM · Monday"], [21.0, "11:20", "AM · Monday"], [30.9, "2:05", "PM · Monday"], [34.0, "3:40", "PM · Monday"], [41.6, "10:45", "AM · Thursday"], [43.8, "4:30", "PM · next Tuesday"]];

const Card: React.FC<{ c: CardT; t: number; y: number }> = ({ c, t, y }) => {
  const k = sp(t, c.at);
  const age = t - c.at;
  const bg = c.tone === "bad" ? "#FFF6E5" : c.tone === "msg" ? "#F1ECFE" : c.tone === "good" ? "#E7F7F0" : "#FFFFFF";
  const bd = c.tone === "bad" ? "#F2D6A2" : c.tone === "good" ? "#9ED9BF" : "rgba(109,74,232,0.25)";
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: y, height: c.h - 14, opacity: Math.min(1, k * 1.4) * (age > 6 ? 0.82 : 1), translate: `${(1 - k) * 60}px 0`, scale: String(0.9 + 0.1 * k),
      background: bg, border: `2px solid ${bd}`, borderRadius: 22, padding: "14px 18px", boxShadow: "0 10px 26px rgba(40,20,110,0.10)", fontFamily: FONT_UI, overflow: "hidden" }}>
      {c.tone === "bad" ? (
        <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
          <div style={{ width: 52, height: 52, flex: "none", borderRadius: 26, background: "#FBE3B5", color: AMBER, fontSize: 30, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center" }}>{c.icon}</div>
          <div><div style={{ fontSize: 31, fontWeight: 800, color: INK, lineHeight: 1.12 }}>{c.text}</div>{c.sub ? <div style={{ fontSize: 25, color: "#7A6A55", marginTop: 4 }}>{c.sub}</div> : null}</div>
        </div>
      ) : c.tone === "good" ? (
        <>
          <div style={{ fontSize: 24, color: GREY }}><b style={{ color: INK }}>{c.who}</b> · {c.time}</div>
          <div style={{ fontSize: 27, fontWeight: 800, color: GREEN, marginTop: 4, lineHeight: 1.2 }}>✓ {c.text}</div>
        </>
      ) : (
        <>
          <div style={{ fontSize: 24, color: GREY }}><b style={{ color: INK }}>{c.who}</b> · {c.time}</div>
          <div style={{ fontSize: 27, color: INK, marginTop: 4, lineHeight: 1.2, fontWeight: c.tone === "msg" ? 600 : 500 }}>{c.text}</div>
        </>
      )}
    </div>
  );
};

const Column: React.FC<{ cards: CardT[]; t: number; x: number; w: number }> = ({ cards, t, x, w }) => {
  let y = 0;
  const els = cards.map((c, i) => { if (t < c.at) return null; const el = <Card key={i} c={c} t={t} y={y} />; y += c.h * sp(t, c.at); return el; });
  const off = Math.max(0, y - 1010);
  return (
    <div style={{ position: "absolute", left: x, top: 630, width: w, height: 1030, overflow: "hidden", WebkitMaskImage: off > 0 ? "linear-gradient(180deg, transparent 0, #000 90px)" : undefined }}>
      <div style={{ position: "absolute", inset: 0, translate: `0 ${-off}px` }}>{els}</div>
    </div>
  );
};

const Captions: React.FC<{ t: number }> = ({ t }) => {
  const words = (transcript as Record<string, { words: { word: string; start: number; end: number }[] }>)["two-ways.16k.wav"].words;
  const chunks: (typeof words)[] = []; let cur: typeof words = [];
  words.forEach((w) => { cur.push(w); if (cur.length >= 5 || /[.,?!]$/.test(w.word.trim())) { chunks.push(cur); cur = []; } });
  if (cur.length) chunks.push(cur);
  const c = chunks.find((ch, i) => t >= ch[0].start - 0.05 && t < (chunks[i + 1]?.[0].start ?? 1e9) - 0.05 && t < ch[ch.length - 1].end + 0.7);
  if (!c) return null;
  return (
    <div style={{ position: "absolute", left: 50, right: 50, top: 1700, textAlign: "center", fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: 52, lineHeight: 1.15, letterSpacing: "-0.02em" }}>
      {c.map((w, i) => { const on = t >= w.start - 0.03; const now = on && t < w.end + 0.05; const raw = w.word.trim();
        const txt = /^tooth$/i.test(raw) ? "Tooth" : /^referral/i.test(raw) && /^tooth$/i.test(c[i - 1]?.word.trim() ?? "") ? raw.replace(/^r/, "R") : raw;
        return <span key={i} style={{ color: now ? PURPLE : INK, opacity: on ? 1 : 0.28 }}>{txt} </span>; })}
    </div>
  );
};

const Inner: React.FC = () => {
  const t = useCurrentFrame() / FPS;
  const clockIdx = CLOCK.reduce((a, [at], i) => (t >= at ? i : a), 0);
  const clockK = sp(t, CLOCK[clockIdx][0], 12);
  const summary = t >= 49.0 && t < 52.4;
  const bigA = t >= 52.4 && t < 54.4, bigB = t >= 54.4 && t < 56.2, end = t >= 56.2;
  const main = !summary && !bigA && !bigB && !end;
  const intro = sp(t, 0.2);
  return (
    <AbsoluteFill style={{ background: "linear-gradient(170deg, #FBFAFF 0%, #EFEAFF 60%, #E6DEFF 100%)", fontFamily: FONT_UI, color: INK }}>
      <Audio src={staticFile("audio/voice/camp-two-ways.wav")} />
      <AbsoluteFill style={{ backgroundImage: "radial-gradient(rgba(109,74,232,0.16) 2px, transparent 2.2px)", backgroundSize: "36px 36px", backgroundPosition: `${(t * 22) % 36}px ${(t * 34) % 36}px` }} />
      <div style={{ position: "absolute", top: 70, left: 60, right: 60, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Img src={staticFile("tr/logo.png")} style={{ height: 70 }} />
        <div style={{ fontSize: 26, fontWeight: 700, color: PURPLE, letterSpacing: "0.12em" }}>SAME REFERRAL · TWO WAYS</div>
      </div>
      {main ? (
        <AbsoluteFill style={{ scale: String(1 + 0.025 * Math.sin(t / 3.2)), translate: `${Math.sin(t / 2.1) * 6}px ${Math.cos(t / 2.7) * 5}px` }}>
          {/* the clock */}
          <div style={{ position: "absolute", top: 200, left: 60, right: 60, display: "flex", alignItems: "baseline", gap: 24 }}>
            <div style={{ fontFamily: FONT_MONO, fontWeight: 700, fontSize: 150, letterSpacing: "-0.04em", color: INK, scale: String(0.9 + 0.1 * clockK), transformOrigin: "left bottom" }}>{CLOCK[clockIdx][1] || "Day 1"}{clockIdx ? <span style={{ fontSize: 70, color: PURPLE }}>:{String(Math.floor((t - CLOCK[clockIdx][0]) * 7) % 60).padStart(2, "0")}</span> : null}</div>
            <div style={{ fontSize: 34, fontWeight: 700, color: GREY }}>{CLOCK[clockIdx][2]}</div>
          </div>
          <div style={{ position: "absolute", top: 400, left: 60, right: 60, height: 10, borderRadius: 5, background: "rgba(109,74,232,0.15)" }}>
            <div style={{ width: `${Math.min(100, (t / 49.0) * 100)}%`, height: 10, borderRadius: 5, background: PURPLE }} />
          </div>
          {/* column heads */}
          {[["WEB FORM", AMBER, 40], ["TOOTH REFERRAL", PURPLE, 555]].map(([l, c, x], i) => (
            <div key={i} style={{ position: "absolute", top: 450 + (1 - intro) * 40, left: x as number, width: 485, opacity: intro }}>
              <div style={{ fontSize: 34, fontWeight: 800, letterSpacing: "0.1em", color: c as string }}>{l}</div>
              <div style={{ height: 6, borderRadius: 3, background: c as string, marginTop: 12, width: `${100 * ramp(t, 0.6 + i * 0.3, 1.6 + i * 0.3)}%` }} />
            </div>
          ))}
          {/* the two forms, before the first event */}
          {t < 9.1 ? [["camp/mock.png", 2004, 1600, { x: 0, y: 0, w: 1400 }], ["camp/tr-locations.jpg", 980, 800, { x: 0, y: 0, w: 980 }]].map(([src, iw, ih, c], i) => {
            const cr = c as { x: number; y: number; w: number }; const s = 485 / cr.w; const k = sp(t, 2.7 + i * 1.6) * (1 - ramp(t, 8.6, 9.1));
            return <div key={i} style={{ position: "absolute", left: i ? 555 : 40, top: 640, width: 485, height: 620, borderRadius: 24, overflow: "hidden", background: "#fff", opacity: k, translate: `0 ${(1 - k) * 80}px`, boxShadow: "0 30px 70px rgba(40,20,110,0.2)" }}>
              <Img src={staticFile(src as string)} style={{ position: "absolute", left: -cr.x * s, top: -cr.y * s, width: (iw as number) * s, height: (ih as number) * s, maxWidth: "none" }} />
            </div>;
          }) : null}
          <Column cards={LEFT} t={t} x={40} w={485} />
          <Column cards={RIGHT} t={t} x={555} w={485} />
          <div style={{ position: "absolute", left: 539, top: 450, width: 2, height: 1170, background: "rgba(109,74,232,0.18)" }} />
        </AbsoluteFill>
      ) : null}
      {summary ? (
        <div style={{ position: "absolute", top: 210, left: 50, right: 50, opacity: sp(t, 49.0), translate: `0 ${-(t - 49.0) * 8}px` }}>
          <div style={{ fontSize: 30, fontWeight: 800, letterSpacing: "0.14em", color: PURPLE }}>MONDAY → NEXT TUESDAY</div>
          <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: 210, letterSpacing: "-0.05em", lineHeight: 1, color: INK }}>{Math.round(8 * (1 - Math.pow(1 - ramp(t, 49.0, 49.6), 3)))} days</div>
          <div style={{ fontSize: 40, fontWeight: 700, color: "#4a4562", marginTop: 6 }}>from referral to completed treatment</div>
          <div style={{ display: "flex", gap: 16, marginTop: 34 }}>
            {[["Same day", "patient called", 49.9], ["3", "messages", 50.6], ["0", "phone tag", 51.2]].map(([n, l, at], i) => (
              <div key={i} style={{ flex: 1, padding: "22px 20px", borderRadius: 26, background: "#fff", boxShadow: "0 18px 40px rgba(40,20,110,0.16)", opacity: sp(t, at as number), scale: String(0.85 + 0.15 * sp(t, at as number)) }}>
                <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: i === 0 ? 50 : 90, color: i === 2 ? GREEN : PURPLE, lineHeight: 1.1 }}>{n}</div>
                <div style={{ fontSize: 28, fontWeight: 700, color: "#4a4562", marginTop: 6 }}>{l}</div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 44, padding: "30px 30px", borderRadius: 26, background: "#fff", boxShadow: "0 18px 40px rgba(40,20,110,0.14)" }}>
            {[["Mon 9:41", "Referral sent, X-rays + insurance attached"], ["Mon 3:40", "Patient called, consultation booked"], ["Thu 10:45", "Consultation completed"], ["Tue 4:30", "Root canal done, signed note sent"]].map(([d, l], i) => (
              <div key={i} style={{ display: "flex", gap: 20, alignItems: "center", padding: "12px 0", borderTop: i ? "1px solid #ECE8F6" : "none", opacity: sp(t, 49.3 + i * 0.35) }}>
                <div style={{ width: 22, height: 22, borderRadius: 11, background: i === 3 ? GREEN : PURPLE, flex: "none" }} />
                <div style={{ width: 190, fontFamily: FONT_MONO, fontWeight: 700, fontSize: 30 }}>{d}</div>
                <div style={{ fontSize: 30, color: "#3a3552" }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      ) : null}
      {bigA || bigB ? (
        <div style={{ position: "absolute", top: 640, left: 60, right: 60, fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: 112, lineHeight: 1.04, letterSpacing: "-0.04em", whiteSpace: "pre-line", color: bigA ? AMBER : PURPLE, opacity: sp(t, bigA ? 52.4 : 54.4), scale: String(0.9 + 0.1 * sp(t, bigA ? 52.4 : 54.4) + (t - (bigA ? 52.4 : 54.4)) * 0.03), transformOrigin: "left top" }}>
          {bigA ? "A web form\nsends an email." : "Tooth Referral\nruns the referral."}
        </div>
      ) : null}
      {end ? (
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", opacity: sp(t, 56.2) }}>
          <Img src={staticFile("tr/logo.png")} style={{ width: 640, scale: String(1 + (t - 56.2) * 0.02) }} />
          <div style={{ marginTop: 60, fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: 64, textAlign: "center", lineHeight: 1.1 }}>Replace your web form<br />with referral software.</div>
          <div style={{ marginTop: 34, padding: "18px 40px", borderRadius: 999, background: PURPLE, color: "#fff", fontSize: 40, fontWeight: 700 }}>Set up in about 5 minutes</div>
          <div style={{ marginTop: 26, fontSize: 36, color: PURPLE, fontWeight: 700 }}>toothreferral.com</div>
        </AbsoluteFill>
      ) : null}
      {!end ? <Captions t={t} /> : null}
    </AbsoluteFill>
  );
};

export const TwoWays: React.FC = () => <FontGate><Inner /></FontGate>;
export const TWOWAYS_DURATION = Math.round(59.5 * FPS);
