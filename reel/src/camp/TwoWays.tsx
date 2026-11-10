/**
 * "Same referral, two ways": a real referral from the ToothReferral dashboard recording (Nov 7: created 9:41 by Greg at
 * Gentle Dental, received 9:45, X-ray question 9:52, new X-rays 9:54, scheduled 9:55, consultation completed 10:09),
 * replayed beside what the same referral looks like through a website referral form. The Tooth Referral column uses the
 * real audit-trail and message text; the web-form column is the typical path (email, phone tag, no status).
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
  { at: 9.3, h: 150, icon: "✉", text: "Becomes an email", sub: "in a shared inbox", tone: "bad" },
  { at: 11.2, h: 110, icon: "?", text: "Nobody assigned", tone: "bad" },
  { at: 20.2, h: 150, icon: "☎", text: "Call about the X-rays", sub: "on hold, voicemail", tone: "bad" },
  { at: 21.9, h: 110, icon: "↺", text: "Phone tag", tone: "bad" },
  { at: 35.6, h: 150, icon: "☎", text: "\"Was my patient scheduled?\"", sub: "the dentist has to call", tone: "bad" },
  { at: 40.4, h: 150, icon: "∅", text: "No record", sub: "of who did what, when", tone: "bad" },
];
const RIGHT: CardT[] = [
  { at: 12.4, h: 150, who: "Greg", time: "9:41 am", text: "new referral created for St. Andrew's Family Dental", tone: "log" },
  { at: 14.2, h: 96, who: "Amanda", time: "9:45 am", text: "received Referral", tone: "log" },
  { at: 23.0, h: 186, who: "Amanda · St. Andrew's", time: "9:52", text: "@Greg Seems like the x-rays are from May 2022. Do you have updated x-rays?", tone: "msg" },
  { at: 26.0, h: 150, who: "Greg · Gentle Dental", time: "9:54", text: "I updated the latest xray let me know if you need anything", tone: "msg" },
  { at: 30.9, h: 150, who: "Amanda", time: "9:55 am", text: "scheduled Referral · \"Spoke with patient and scheduled\"", tone: "log" },
  { at: 33.8, h: 84, text: "✓ Both offices: Scheduled", tone: "good" },
  { at: 39.8, h: 150, who: "Barbara Smith", time: "10:09 am", text: "consultation completed Referral · administrative note", tone: "log" },
];
const CLOCK: [number, string][] = [[0, "Nov 7"], [6.3, "9:41"], [14.4, "9:45"], [16.4, "9:52"], [26.0, "9:54"], [29.2, "9:55"], [38.6, "10:09"]];

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
        <div style={{ fontSize: 28, fontWeight: 800, color: GREEN, lineHeight: 1.5 }}>{c.text}</div>
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
  return (
    <div style={{ position: "absolute", left: x, top: 640, width: w, height: 1000 }}>
      {cards.map((c, i) => { if (t < c.at) return null; const el = <Card key={i} c={c} t={t} y={y} />; y += c.h * sp(t, c.at); return el; })}
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
  const summary = t >= 42.4 && t < 47.3;
  const bigA = t >= 47.3 && t < 49.6, bigB = t >= 49.6 && t < 51.3, end = t >= 51.3;
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
            <div style={{ fontFamily: FONT_MONO, fontWeight: 700, fontSize: 150, letterSpacing: "-0.04em", color: INK, scale: String(0.9 + 0.1 * clockK), transformOrigin: "left bottom" }}>{CLOCK[clockIdx][1]}{clockIdx ? <span style={{ fontSize: 70, color: PURPLE }}>:{String(Math.floor((t - CLOCK[clockIdx][0]) * 7) % 60).padStart(2, "0")}</span> : null}</div>
            <div style={{ fontSize: 34, fontWeight: 700, color: GREY }}>{clockIdx ? "AM · Nov 7" : "a real referral"}</div>
          </div>
          <div style={{ position: "absolute", top: 400, left: 60, right: 60, height: 10, borderRadius: 5, background: "rgba(109,74,232,0.15)" }}>
            <div style={{ width: `${Math.min(100, (t / 42.4) * 100)}%`, height: 10, borderRadius: 5, background: PURPLE }} />
          </div>
          {/* column heads */}
          {[["WEB FORM", AMBER, 40], ["TOOTH REFERRAL", PURPLE, 555]].map(([l, c, x], i) => (
            <div key={i} style={{ position: "absolute", top: 450 + (1 - intro) * 40, left: x as number, width: 485, opacity: intro }}>
              <div style={{ fontSize: 34, fontWeight: 800, letterSpacing: "0.1em", color: c as string }}>{l}</div>
              <div style={{ height: 6, borderRadius: 3, background: c as string, marginTop: 12, width: `${100 * ramp(t, 0.6 + i * 0.3, 1.6 + i * 0.3)}%` }} />
            </div>
          ))}
          {/* the two forms, before the first event */}
          {t < 9.3 ? [["camp/mock.png", 2004, 1600, { x: 0, y: 0, w: 1400 }], ["camp/tr-locations.jpg", 980, 800, { x: 0, y: 0, w: 980 }]].map(([src, iw, ih, c], i) => {
            const cr = c as { x: number; y: number; w: number }; const s = 485 / cr.w; const k = sp(t, 3.1 + i * 1.5) * (1 - ramp(t, 8.8, 9.3));
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
        <div style={{ position: "absolute", top: 210, left: 50, right: 50, opacity: sp(t, 42.4), translate: `0 ${-(t - 42.4) * 8}px` }}>
          <div style={{ fontSize: 30, fontWeight: 800, letterSpacing: "0.14em", color: PURPLE }}>9:41 → 10:09</div>
          <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: 210, letterSpacing: "-0.05em", lineHeight: 1, color: INK }}>{Math.round(28 * (1 - Math.pow(1 - ramp(t, 42.4, 43.0), 3)))} min</div>
          <div style={{ fontSize: 40, fontWeight: 700, color: "#4a4562", marginTop: 6 }}>from referral to completed consultation</div>
          <div style={{ display: "flex", gap: 16, marginTop: 34 }}>
            {[["6", "steps logged", 43.7], ["3", "messages", 44.1], ["0", "phone tag", 45.1]].map(([n, l, at], i) => (
              <div key={i} style={{ flex: 1, padding: "22px 20px", borderRadius: 26, background: "#fff", boxShadow: "0 18px 40px rgba(40,20,110,0.16)", opacity: sp(t, at as number), scale: String(0.85 + 0.15 * sp(t, at as number)) }}>
                <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: 90, color: i === 2 ? GREEN : PURPLE, lineHeight: 1 }}>{n}</div>
                <div style={{ fontSize: 28, fontWeight: 700, color: "#4a4562", marginTop: 6 }}>{l}</div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 34, fontSize: 26, fontWeight: 700, color: GREY }}>THE REAL AUDIT TRAIL, FROM THE DASHBOARD</div>
          <div style={{ position: "relative", marginTop: 12, width: 980, height: 440, borderRadius: 26, overflow: "hidden", background: "#fff", boxShadow: "0 30px 70px rgba(40,20,110,0.2)", opacity: sp(t, 43.4) }}>
            <Img src={staticFile("dash3c/r3c-activity-log.jpg")} style={{ position: "absolute", left: -390 * (980 / 900), top: -40 * (980 / 900), width: 1920 * (980 / 900), height: 912 * (980 / 900), maxWidth: "none" }} />
          </div>
        </div>
      ) : null}
      {bigA || bigB ? (
        <div style={{ position: "absolute", top: 640, left: 60, right: 60, fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: 112, lineHeight: 1.04, letterSpacing: "-0.04em", whiteSpace: "pre-line", color: bigA ? AMBER : PURPLE, opacity: sp(t, bigA ? 47.3 : 49.6), scale: String(0.9 + 0.1 * sp(t, bigA ? 47.3 : 49.6) + (t - (bigA ? 47.3 : 49.6)) * 0.03), transformOrigin: "left top" }}>
          {bigA ? "A web form\nsends an email." : "Tooth Referral\nruns the referral."}
        </div>
      ) : null}
      {end ? (
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", opacity: sp(t, 51.3) }}>
          <Img src={staticFile("tr/logo.png")} style={{ width: 640, scale: String(1 + (t - 51.3) * 0.02) }} />
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
export const TWOWAYS_DURATION = Math.round(54 * FPS);
