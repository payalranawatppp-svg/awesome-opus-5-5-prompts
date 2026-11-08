/**
 * v2 of the brand-awareness shorts (Vejay's brief): the same voice-overs and real screens as CampVideo, now driven
 * by the editing-kit effects, rebuilt as on-screen graphics (no talking head in these videos):
 *   Live cursor (clicks Submit, the case, Invite), Paper tear (form -> Tooth Referral), Head stack (typewriter labels
 *   for each status), Comment drop (messages between the offices), Impact stamp (SIGNED), Blow away (the web-form line
 *   crumbles), Blade slice (reveal of the Tooth Referral line), Day dial (Day 1 -> Week 4), Rack focus (the question),
 *   Predict keys (typing "tooth" -> Tooth Referral), counters on the KPI cards, Orbit ring around the logo.
 */
import React from "react";
import { AbsoluteFill, Audio, Img, interpolate, spring, staticFile, useCurrentFrame } from "remotion";
import transcript from "../data/transcript-camp.json";
import { FONT_DISPLAY, FONT_MONO, FONT_UI } from "../theme";
import { FontGate } from "../effects/shared";

const FPS = 30;
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const PURPLE = "#6D4AE8";
const INK = "#16132B";
const AMBER = "#E89D15";
const GREEN = "#1F9D6B";
const rand = (s: number) => { const x = Math.sin(s * 12.9898 + 78.233) * 43758.5453; return x - Math.floor(x); };
const ease = (x: number) => 1 - Math.pow(1 - x, 3);
const sp = (t: number, at: number, damping = 14, stiffness = 170) => (t < at ? 0 : spring({ frame: Math.round((t - at) * FPS), fps: FPS, config: { damping, stiffness, mass: 0.7 } }));
const ramp = (t: number, a: number, b: number) => interpolate(t, [a, b], [0, 1], { ...clamp, easing: ease });

type Img2 = { src: string; w: number; h: number };
type Crop = { x: number; y: number; w: number };
type Fx =
  | { k: "cursor"; path: [number, number, number][]; clicks?: number[]; img?: boolean; name?: string }
  | { k: "stack"; items: [string, string, number][]; x: number; y: number }
  | { k: "drop"; items: [string, string, number, string?][]; x: number; y: number }
  | { k: "stamp"; text: string; t: number; color?: string; x?: number; y?: number }
  | { k: "blow"; t: number }
  | { k: "dial"; labels: string[]; t0: number; t1: number; y?: number; out?: number }
  | { k: "keys"; typed: string; sugg: string[]; pick: number; t0: number }
  | { k: "count"; items: [string, number, number, string, number][]; x: number; y: number }
  | { k: "ring"; text: string };
type Scene = {
  from: number;
  kicker?: string;
  title?: string;
  big?: string;
  img?: Img2;
  keys?: [number, Crop][];
  ch?: number;
  hl?: { box: [number, number, number, number]; at: number; c?: string }[];
  chips?: { t: string; at: number; c?: string }[];
  enter?: "push" | "tear" | "blade" | "focus";
  fx?: Fx[];
  end?: boolean;
  split?: [Img2, Img2];
  bigTop?: number;
};

const D3 = (n: string): Img2 => ({ src: `dash3c/${n}.jpg`, w: 1920, h: 912 });
const D2 = (n: string): Img2 => ({ src: `dash2c/${n}.jpg`, w: 1904, h: 868 });
const FORM: Img2 = { src: "camp/mock.png", w: 2004, h: 1600 };
const MAIL: Img2 = { src: "camp/mail.png", w: 2000, h: 1600 };
const EMBED: Img2 = { src: "camp/tr-embed-form.jpg", w: 920, h: 1060 };
const KPI: Img2 = { src: "analytics-ref/01-header-kpis.png", w: 1920, h: 640 };

const CW = 1000, CH = 860, CX = 40, CY = 560;

const CFG: Record<string, { audio: string; words: string; seconds: number; tag: string; scenes: Scene[] }> = {
  "form-vs-software": {
    audio: "audio/voice/camp-form-vs-software.wav", words: "form-vs-software.16k.wav", seconds: 47.5, tag: "FORM VS SOFTWARE",
    scenes: [
      { from: 0, kicker: "SAME REFERRAL", title: "Two very different endings", split: [FORM, D3("r3c-incoming")] },
      { from: 4.0, kicker: "THE WEB FORM", title: "You hit submit…", img: FORM, keys: [[4.0, { x: 0, y: 300, w: 1500 }], [5.6, { x: 0, y: 760, w: 1100 }]],
        fx: [{ k: "cursor", img: true, path: [[4.2, 900, 900], [5.9, 190, 1440]], clicks: [6.1] }] },
      { from: 6.9, enter: "push", kicker: "THE WEB FORM", title: "…it becomes an email in somebody's inbox", img: MAIL, keys: [[6.9, { x: 0, y: 0, w: 2000 }], [9.5, { x: 0, y: 60, w: 1500 }]], hl: [{ box: [0, 132, 1800, 222], at: 7.6, c: AMBER }],
        chips: [{ t: "No confirmation", at: 9.8, c: AMBER }, { t: "No status", at: 10.9, c: AMBER }] },
      { from: 12.1, enter: "focus", big: "Did anyone call\nthe patient?", kicker: "NOBODY KNOWS", img: MAIL, keys: [[12.1, { x: 0, y: 0, w: 2000 }]] },
      { from: 14.9, enter: "tear", kicker: "TOOTH REFERRAL", title: "The referral lands as a case", img: D3("r3c-incoming"), ch: 620, keys: [[14.9, { x: 360, y: 150, w: 1500 }], [17.6, { x: 370, y: 190, w: 1150 }]], hl: [{ box: [380, 250, 1850, 330], at: 17.2, c: PURPLE }],
        fx: [{ k: "cursor", img: true, name: "Amanda", path: [[15.4, 1500, 700], [17.0, 760, 290]], clicks: [17.3] }] },
      { from: 18.0, enter: "push", kicker: "TOOTH REFERRAL", title: "X-rays and insurance attached", img: D3("r3c-insurance"), keys: [[18.0, { x: 180, y: 380, w: 900 }], [20.6, { x: 180, y: 420, w: 760 }]],
        chips: [{ t: "X-rays attached", at: 18.4, c: GREEN }, { t: "Insurance attached", at: 19.3, c: GREEN }] },
      { from: 20.8, enter: "push", kicker: "EVERY STEP LOGGED", title: "Who did what, and when", img: D3("r3c-activity-log"), keys: [[20.8, { x: 380, y: 0, w: 920 }], [24.5, { x: 380, y: 10, w: 760 }]],
        fx: [{ k: "stack", x: 70, y: 1560, items: [["Received", "Amanda · 9:45", 25.0], ["Contacted", "Tanya · 10:04", 25.9], ["Consultation", "scheduled", 27.1]] }] },
      { from: 28.5, enter: "push", kicker: "BOTH OFFICES", title: "Message the specialist right on the case", img: D3("r3c-messages"), ch: 560, keys: [[28.5, { x: 690, y: 220, w: 1100 }], [31.2, { x: 760, y: 260, w: 900 }]],
        fx: [{ k: "drop", x: 70, y: 1190, items: [["Greg · Gentle Dental", "@Amanda is she all set for Thursday?", 29.6], ["Amanda · St. Andrew's", "Yes! Thursday at 10. X-rays are in.", 31.1, "me"]] }] },
      { from: 33.7, enter: "push", kicker: "LOOP CLOSED", title: "Signed completion note, sent automatically", img: D2("cs-07-signed-success"), keys: [[33.7, { x: 380, y: 0, w: 1500 }], [36.0, { x: 1250, y: 0, w: 640 }]],
        fx: [{ k: "stamp", text: "SIGNED ✓", t: 35.3, color: GREEN, x: 540, y: 1000 }] },
      { from: 37.8, enter: "blade", big: "A web form sends\nan email.", kicker: "THE DIFFERENCE", fx: [{ k: "blow", t: 39.3 }] },
      { from: 40.0, enter: "blade", big: "Tooth Referral starts\na tracked, shared case.", kicker: "THE DIFFERENCE" },
      { from: 42.8, enter: "focus", end: true, fx: [{ k: "ring", text: "TRACKED • SHARED • SIGNED • LOGGED • " }] },
    ],
  },
  "day-in-the-life": {
    audio: "audio/voice/camp-day-in-the-life.wav", words: "day-in-the-life.16k.wav", seconds: 53.5, tag: "DAY IN THE LIFE",
    scenes: [
      { from: 0, kicker: "ENDO START-UP DIARY", fx: [{ k: "dial", labels: ["Opening", "Day 1"], t0: 0.2, t1: 1.6, y: 820 },
        { k: "stack", x: 70, y: 1520, items: [["Chairs", "in ✓", 2.6], ["CBCT", "works ✓", 3.8], ["Website", "live tomorrow", 5.6]] }] },
      { from: 7.7, enter: "push", kicker: "BUILDING THE WEBSITE", title: "Every specialist site has a referral form", img: FORM, keys: [[7.7, { x: 0, y: 0, w: 2004 }], [11.4, { x: 0, y: 500, w: 1400 }]],
        fx: [{ k: "cursor", img: true, path: [[8.4, 1500, 600], [11.0, 190, 1440]], clicks: [] }] },
      { from: 12.5, enter: "focus", big: "What happens after\na dentist hits submit?", kicker: "ONE QUESTION", img: FORM, keys: [[12.5, { x: 0, y: 700, w: 1200 }]] },
      { from: 17.2, enter: "push", kicker: "WITH A FORM", title: "It lands in an inbox", img: MAIL, keys: [[17.2, { x: 0, y: 0, w: 2000 }]], hl: [{ box: [0, 132, 1800, 222], at: 18.3, c: AMBER }] },
      { from: 19.9, enter: "tear", kicker: "WITH TOOTH REFERRAL", title: "It lands in a pipeline", img: D3("r3c-incoming"), ch: 620, keys: [[19.9, { x: 360, y: 150, w: 1500 }], [22.3, { x: 370, y: 190, w: 1150 }]],
        chips: [{ t: "New", at: 20.6, c: PURPLE }, { t: "Contacted", at: 21.0, c: PURPLE }, { t: "Scheduled", at: 21.4, c: GREEN }] },
      { from: 22.4, enter: "push", kicker: "CHOOSING REFERRAL SOFTWARE", title: "Tooth Referral, embedded on my website", img: EMBED, keys: [[22.4, { x: 0, y: 0, w: 920 }], [25.4, { x: 0, y: 0, w: 920 }], [30.0, { x: 0, y: 520, w: 920 }]],
        fx: [{ k: "keys", typed: "tooth", sugg: ["toothpaste", "Tooth Referral", "toothbrush"], pick: 1, t0: 22.5 }],
        chips: [{ t: "Pick a location", at: 26.4, c: PURPLE }, { t: "Attach X-rays", at: 27.4, c: PURPLE }, { t: "Secure insurance link", at: 30.1, c: GREEN }] },
      { from: 31.9, enter: "push", kicker: "INVITE YOUR NETWORK", title: "The dentists I already know", img: D3("r3c-referral-source"), ch: 560, keys: [[31.9, { x: 380, y: 380, w: 900 }], [34.0, { x: 380, y: 500, w: 700 }]], hl: [{ box: [395, 640, 900, 730], at: 32.9, c: GREEN }],
        fx: [{ k: "cursor", img: true, name: "You", path: [[32.0, 1100, 900], [32.8, 600, 690]], clicks: [32.9] },
          { k: "drop", x: 70, y: 1150, items: [["Gentle Dental", "accepted your invitation", 33.2], ["Bright Smile Family Dentistry", "accepted your invitation", 33.9]] }] },
      { from: 34.7, enter: "push", kicker: "ONE SHARED CASE", title: "Same case. Same messages. Same status.", img: D3("r3c-messages"), ch: 560, keys: [[34.7, { x: 690, y: 220, w: 1100 }], [38.5, { x: 760, y: 260, w: 900 }]],
        fx: [{ k: "stack", x: 70, y: 1560, items: [["Same", "case", 35.6], ["Same", "messages", 36.8], ["Same", "status", 37.8]] }] },
      { from: 39.1, enter: "blade", kicker: "WEEK 4", title: "Every referral, who sent it, how fast we called", img: KPI, ch: 420, keys: [[39.1, { x: 380, y: 360, w: 1480 }], [43.8, { x: 380, y: 380, w: 1100 }]],
        fx: [{ k: "dial", labels: ["Day 1", "Week 4"], t0: 39.2, t1: 40.4, y: 900, out: 41.4 }, { k: "count", x: 70, y: 1110, items: [["referrals", 0, 28, "", 43.9], ["h to first contact", 0, 3.7, "", 45.3], ["% case acceptance", 0, 76, "", 46.4]] }] },
      { from: 47.9, enter: "focus", big: "Starting a practice is hard.\nLosing referrals shouldn't be.", kicker: "DAY 28", fx: [{ k: "blow", t: 50.6 }] },
      { from: 51.4, enter: "focus", end: true, fx: [{ k: "ring", text: "START WITH A SYSTEM • NOT A STICKY NOTE • " }] },
    ],
  },
};

const camAt = (keys: [number, Crop][], t: number): Crop => {
  if (t <= keys[0][0]) return keys[0][1];
  for (let i = 1; i < keys.length; i++) if (t <= keys[i][0]) {
    const [t0, a] = keys[i - 1]; const [t1, b] = keys[i]; const k = ease((t - t0) / (t1 - t0));
    return { x: a.x + (b.x - a.x) * k, y: a.y + (b.y - a.y) * k, w: a.w + (b.w - a.w) * k };
  }
  return keys[keys.length - 1][1];
};
const fit = (img: Img2, c0: Crop, w: number, h: number): Crop => {
  const cw = Math.min(c0.w, (img.h * w) / h, img.w);
  return { w: cw, x: Math.max(0, Math.min(c0.x, img.w - cw)), y: Math.max(0, Math.min(c0.y, img.h - (cw * h) / w)) };
};
/** image px -> frame px for the scene's main card at time t */
const mapper = (sc: Scene, t: number) => {
  const h = sc.ch ?? CH;
  const c = fit(sc.img!, camAt(sc.keys!, t), CW, h);
  const s = CW / c.w;
  return (x: number, y: number) => [CX + (x - c.x) * s, CY + (y - c.y) * s] as const;
};

const Card: React.FC<{ img: Img2; crop: Crop; w: number; h: number; hl?: Scene["hl"]; t: number }> = ({ img, crop: c0, w, h, hl, t }) => {
  const crop = fit(img, c0, w, h);
  const s = w / crop.w;
  return (
    <div style={{ position: "relative", width: w, height: h, borderRadius: 34, overflow: "hidden", background: "#fff", boxShadow: "0 40px 90px rgba(40,20,110,0.28)", border: "1.5px solid rgba(109,74,232,0.18)" }}>
      <Img src={staticFile(img.src)} style={{ position: "absolute", left: -crop.x * s, top: -crop.y * s, width: img.w * s, height: img.h * s, maxWidth: "none" }} />
      {(hl ?? []).map((b, i) => (
        <div key={i} style={{ position: "absolute", left: (b.box[0] - crop.x) * s, top: (b.box[1] - crop.y) * s, width: (b.box[2] - b.box[0]) * s, height: (b.box[3] - b.box[1]) * s, border: `5px solid ${b.c ?? PURPLE}`, borderRadius: 14, opacity: ramp(t, b.at, b.at + 0.3), background: `${b.c ?? PURPLE}14` }} />
      ))}
    </div>
  );
};

// ------------------------------------------------------------------------------------------- effects (graphic versions)

const CursorFx: React.FC<{ fx: Extract<Fx, { k: "cursor" }>; sc: Scene; t: number }> = ({ fx, sc, t }) => {
  const m = fx.img ? mapper(sc, t) : (x: number, y: number) => [x, y] as const;
  const p = fx.path;
  if (t < p[0][0] - 0.1) return null;
  let x = p[0][1], y = p[0][2];
  for (let i = 1; i < p.length; i++) if (t >= p[i - 1][0]) { const k = ramp(t, p[i - 1][0], p[i][0]); x = p[i - 1][1] + (p[i][1] - p[i - 1][1]) * k; y = p[i - 1][2] + (p[i][2] - p[i - 1][2]) * k; }
  const [fx_, fy] = m(x, y);
  const press = (fx.clicks ?? []).reduce((a, c) => Math.max(a, interpolate(t, [c - 0.08, c, c + 0.15], [0, 1, 0], clamp)), 0);
  const ring = (fx.clicks ?? []).map((c) => (t >= c && t < c + 0.5 ? (t - c) / 0.5 : -1)).find((v) => v >= 0);
  return (
    <>
      {ring !== undefined ? <div style={{ position: "absolute", left: fx_ - 40 * (0.3 + ring), top: fy - 40 * (0.3 + ring), width: 80 * (0.3 + ring), height: 80 * (0.3 + ring), borderRadius: "50%", border: `5px solid ${PURPLE}`, opacity: 1 - ring }} /> : null}
      <svg width={62} height={74} viewBox="0 0 22 26" style={{ position: "absolute", left: fx_ - 4, top: fy - 2, scale: String(1 - 0.15 * press), transformOrigin: "4px 2px", filter: "drop-shadow(0 6px 10px rgba(0,0,0,0.35))" }}>
        <path d="M2 2 L2 20 L7 15 L11 24 L14 22.5 L10 14 L17 14 Z" fill={INK} stroke="#fff" strokeWidth={1.6} strokeLinejoin="round" />
      </svg>
      {fx.name ? <div style={{ position: "absolute", left: fx_ + 46, top: fy + 58, padding: "6px 16px", borderRadius: 12, background: PURPLE, color: "#fff", fontFamily: FONT_UI, fontWeight: 700, fontSize: 28 }}>{fx.name}</div> : null}
    </>
  );
};

const PaperChip: React.FC<{ big: string; small: string }> = ({ big, small }) => (
  <div style={{ display: "inline-flex", alignItems: "baseline", gap: 14, padding: "12px 24px 14px", background: "linear-gradient(180deg, #FBF8EF, #EFE9DA)", borderRadius: 12, boxShadow: "0 12px 28px rgba(30,20,60,0.25)", fontFamily: FONT_MONO, fontWeight: 700, color: "#141414", whiteSpace: "nowrap" }}>
    <span style={{ fontSize: 54, letterSpacing: "-0.02em" }}>{big}</span><span style={{ fontSize: 28, fontWeight: 500 }}>{small}</span>
  </div>
);

const StackFx: React.FC<{ fx: Extract<Fx, { k: "stack" }>; t: number }> = ({ fx, t }) => (
  <>
    {fx.items.map(([b, s, at], i) => {
      const k = sp(t, at, 12, 190);
      if (t < at) return null;
      return <div key={i} style={{ position: "absolute", left: fx.x + (i % 2 ? 40 : 0), top: fx.y - i * 96 - (1 - k) * 70, opacity: Math.min(1, k * 1.5), rotate: `${i % 2 ? 1.5 : -2}deg`, scale: String(0.75 + 0.25 * k), transformOrigin: "left bottom" }}><PaperChip big={b} small={s} /></div>;
    })}
  </>
);

const DropFx: React.FC<{ fx: Extract<Fx, { k: "drop" }>; t: number }> = ({ fx, t }) => (
  <>
    {fx.items.map(([n, msg, at, me], i) => {
      const k = sp(t, at, 11, 160);
      if (t < at) return null;
      const yEnd = fx.y + i * 170;
      return (
        <div key={i} style={{ position: "absolute", left: me ? fx.x + 120 : fx.x, top: -200 + (yEnd + 200) * k, width: 820, display: "flex", gap: 16, padding: "18px 24px", borderRadius: 28, background: me ? PURPLE : "#fff", color: me ? "#fff" : INK, boxShadow: "0 18px 40px rgba(30,20,60,0.25)", fontFamily: FONT_UI }}>
          <div style={{ width: 56, height: 56, flex: "none", borderRadius: 28, background: me ? "#fff" : PURPLE, color: me ? PURPLE : "#fff", fontWeight: 800, fontSize: 24, display: "flex", alignItems: "center", justifyContent: "center" }}>{n.split(" ").filter((w) => /^[A-Z]/.test(w)).slice(0, 2).map((w) => w[0]).join("")}</div>
          <div><div style={{ fontWeight: 700, fontSize: 24, opacity: 0.75 }}>{n}</div><div style={{ fontSize: 34, fontWeight: 600, marginTop: 2 }}>{msg}</div></div>
        </div>
      );
    })}
  </>
);

const StampFx: React.FC<{ fx: Extract<Fx, { k: "stamp" }>; t: number }> = ({ fx, t }) => {
  if (t < fx.t) return null;
  const k = interpolate(t, [fx.t, fx.t + 0.18], [2.4, 1], { ...clamp, easing: ease });
  const shake = t < fx.t + 0.3 ? (rand(Math.round(t * 30)) - 0.5) * 14 : 0;
  return (
    <div style={{ position: "absolute", left: (fx.x ?? 540) - 300 + shake, top: (fx.y ?? 900) - 90, width: 600, textAlign: "center", scale: String(k), rotate: "-10deg", opacity: interpolate(t, [fx.t, fx.t + 0.08], [0, 1], clamp) }}>
      <span style={{ display: "inline-block", padding: "14px 40px", border: `10px solid ${fx.color ?? GREEN}`, borderRadius: 22, color: fx.color ?? GREEN, fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: 110, letterSpacing: "0.02em", background: "rgba(255,255,255,0.85)" }}>{fx.text}</span>
    </div>
  );
};

/** A dial behind the title that spins from the first label to the last (Day dial). */
const DialFx: React.FC<{ fx: Extract<Fx, { k: "dial" }>; t: number }> = ({ fx, t }) => {
  const R = 430;
  const k = ramp(t, fx.t0, fx.t1);
  const land = sp(t, fx.t1, 8, 200);
  const n = fx.labels.length;
  const step = 40;
  const show = sp(t, Math.max(0, fx.t0 - 0.2)) * (fx.out ? 1 - ramp(t, fx.out, fx.out + 0.4) : 1);
  if (show <= 0.001) return null;
  return (
    <div style={{ position: "absolute", left: 540 - R, top: (fx.y ?? 1000) - R, width: R * 2, height: R * 2, opacity: show, scale: String(0.8 + 0.2 * show) }}>
      <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "radial-gradient(circle at 50% 40%, #FFFFFF, #EDE7FF 70%)", boxShadow: `0 0 0 14px ${PURPLE}22, 0 40px 100px rgba(40,20,110,0.25)` }} />
      <div style={{ position: "absolute", inset: 0, rotate: `${-k * (n - 1) * step}deg` }}>
        {Array.from({ length: 72 }, (_, i) => <div key={i} style={{ position: "absolute", left: R - 2, top: 16, width: 4, height: i % 6 === 0 ? 40 : 18, background: "rgba(109,74,232,0.45)", transformOrigin: `2px ${R - 16}px`, rotate: `${i * 5}deg` }} />)}
        {fx.labels.map((l, i) => (
          <div key={i} style={{ position: "absolute", inset: 0, rotate: `${i * step}deg` }}>
            <div style={{ position: "absolute", top: 70, width: "100%", textAlign: "center", fontFamily: FONT_MONO, fontWeight: 700, fontSize: 52, color: i === Math.round(k * (n - 1)) ? PURPLE : "rgba(22,19,43,0.3)" }}>{l}</div>
          </div>
        ))}
      </div>
      <div style={{ position: "absolute", left: R - 22, top: -12, borderLeft: "22px solid transparent", borderRight: "22px solid transparent", borderTop: `36px solid ${PURPLE}` }} />
      <div style={{ position: "absolute", top: R - 150, width: "100%", textAlign: "center", fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: 230, letterSpacing: "-0.05em", color: INK, scale: String(0.7 + 0.3 * land), opacity: land }}>{fx.labels[n - 1]}</div>
    </div>
  );
};

/** Phone keyboard types a word; the suggestion bar offers the product; the pick is tapped (Predict keys). */
const KeysFx: React.FC<{ fx: Extract<Fx, { k: "keys" }>; t: number }> = ({ fx, t }) => {
  const per = 0.16;
  const n = Math.min(fx.typed.length, Math.max(0, Math.floor((t - fx.t0 - 0.3) / per) + 1));
  const tap = fx.t0 + 0.3 + fx.typed.length * per + 0.45;
  const out = ramp(t, tap + 1.0, tap + 1.4);
  if (t > tap + 1.5) return null;
  const y = 1920 - 640 + (1 - sp(t, fx.t0)) * 640 + out * 700;
  const rows = ["qwertyuiop", "asdfghjkl", "zxcvbnm"];
  const cur = n > 0 ? fx.typed[n - 1] : "";
  return (
    <div style={{ position: "absolute", left: 0, top: y, width: 1080, height: 640, background: "rgba(214,217,226,0.97)", fontFamily: FONT_UI, boxShadow: "0 -20px 60px rgba(0,0,0,0.2)" }}>
      <div style={{ position: "absolute", left: 40, right: 40, top: -140, height: 104, borderRadius: 52, background: "#fff", display: "flex", alignItems: "center", paddingLeft: 40, fontSize: 48, fontWeight: 600, boxShadow: "0 12px 30px rgba(0,0,0,0.2)" }}>
        🔍&nbsp;{t >= tap ? fx.sugg[fx.pick] : fx.typed.slice(0, n)}
      </div>
      <div style={{ display: "flex", height: 96, borderBottom: "1px solid rgba(0,0,0,0.1)" }}>
        {fx.sugg.map((g, i) => <div key={i} style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 38, fontWeight: i === fx.pick ? 800 : 500, color: i === fx.pick ? PURPLE : INK, background: t >= tap && i === fx.pick ? "rgba(109,74,232,0.18)" : "transparent", opacity: n >= 2 ? 1 : 0 }}>{g}</div>)}
      </div>
      {rows.map((r, ri) => (
        <div key={ri} style={{ display: "flex", justifyContent: "center", gap: 12, marginTop: 20 }}>
          {r.split("").map((c) => { const on = c === cur && t < tap ? interpolate((t - fx.t0 - 0.3) % per, [0, per], [1, 0], clamp) : 0;
            return <div key={c} style={{ width: 86, height: 108, borderRadius: 14, background: on ? "#9aa0ad" : "#fff", boxShadow: "0 2px 0 rgba(0,0,0,0.3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 48, translate: `0 ${-on * 36}px`, scale: String(1 + on * 0.3) }}>{c}</div>; })}
        </div>
      ))}
    </div>
  );
};

const CountFx: React.FC<{ fx: Extract<Fx, { k: "count" }>; t: number }> = ({ fx, t }) => (
  <div style={{ position: "absolute", left: fx.x, right: 70, top: fx.y, display: "flex", gap: 20 }}>
    {fx.items.map(([label, a, b, suf, at], i) => {
      const k = sp(t, at - 0.3);
      const v = a + (b - a) * ramp(t, at - 0.3, at + 0.6);
      const txt = b % 1 ? v.toFixed(1) : Math.round(v).toString();
      return (
        <div key={i} style={{ flex: 1, padding: "22px 20px", borderRadius: 28, background: "#fff", boxShadow: "0 20px 46px rgba(40,20,110,0.2)", opacity: k, scale: String(0.8 + 0.2 * k) }}>
          <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: 92, color: i === 0 ? PURPLE : i === 1 ? GREEN : INK, lineHeight: 1, letterSpacing: "-0.03em" }}>{txt}{suf}</div>
          <div style={{ fontSize: 26, fontWeight: 600, marginTop: 8, color: "#4a4562" }}>{label}</div>
        </div>
      );
    })}
  </div>
);

const RingFx: React.FC<{ text: string; t: number; o: number }> = ({ text, t, o }) => {
  const chars = (text + text).split("");
  return (
    <AbsoluteFill style={{ opacity: o }}>
      {chars.map((ch, i) => {
        const a = -(i / chars.length) * Math.PI * 2 - t * 0.6;
        const x = 540 + Math.cos(a) * 490, y = 700 + Math.sin(a) * 175;
        const z = Math.sin(a); // > 0: near side (reads left to right)
        return <div key={i} style={{ position: "absolute", left: x - 25, top: y - 30, width: 50, textAlign: "center", fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: 46 * (0.7 + 0.3 * (z + 1) / 2), color: PURPLE, opacity: z > 0 ? 0.55 + 0.45 * z : 0.12 }}>{ch}</div>;
      })}
    </AbsoluteFill>
  );
};

/** Big statement; with a "blow" fx it crumbles into dust from left to right (Blow away). */
const Big: React.FC<{ text: string; t: number; inn: number; blowAt?: number; top?: number }> = ({ text, t, inn, blowAt, top = 560 }) => {
  const size = text.length < 8 ? 300 : 104;
  if (blowAt === undefined || t < blowAt) {
    return <div style={{ position: "absolute", top, left: 60, right: 60, fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: size, lineHeight: 1.04, letterSpacing: "-0.04em", whiteSpace: "pre-line", opacity: inn, scale: String(0.92 + 0.08 * inn), transformOrigin: "left top", color: INK }}>{text}</div>;
  }
  const cols = 18, rows = 6, W = 960, H = 260;
  return (
    <div style={{ position: "absolute", top, left: 60, width: W, height: H }}>
      {Array.from({ length: cols * rows }, (_, i) => {
        const c = i % cols, r = Math.floor(i / cols);
        const d = blowAt + c * 0.035 + rand(i) * 0.15;
        const p = ramp(t, d, d + 0.9);
        return (
          <div key={i} style={{ position: "absolute", left: (c * W) / cols, top: (r * H) / rows, width: W / cols + 0.6, height: H / rows + 0.6, overflow: "hidden", translate: `${p * (260 + rand(i * 2) * 420)}px ${-p * (80 + rand(i * 3) * 260)}px`, rotate: `${p * (rand(i * 5) - 0.5) * 200}deg`, opacity: 1 - p }}>
            <div style={{ position: "absolute", left: -(c * W) / cols, top: -(r * H) / rows, width: W, fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: size, lineHeight: 1.04, letterSpacing: "-0.04em", whiteSpace: "pre-line", color: INK }}>{text}</div>
          </div>
        );
      })}
    </div>
  );
};

const Captions: React.FC<{ words: { word: string; start: number; end: number }[]; t: number }> = ({ words, t }) => {
  const chunks: (typeof words)[] = []; let cur: typeof words = [];
  words.forEach((w) => { cur.push(w); if (cur.length >= 5 || /[.,?!]$/.test(w.word.trim())) { chunks.push(cur); cur = []; } });
  if (cur.length) chunks.push(cur);
  const c = chunks.find((ch, i) => t >= ch[0].start - 0.05 && t < (chunks[i + 1]?.[0].start ?? 1e9) - 0.05 && t < ch[ch.length - 1].end + 0.7);
  if (!c) return null;
  return (
    <div style={{ position: "absolute", left: 60, right: 60, top: 1690, textAlign: "center", fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: 54, lineHeight: 1.15, letterSpacing: "-0.02em" }}>
      {c.map((w, i) => {
        const on = t >= w.start - 0.03; const now = on && t < w.end + 0.05;
        const raw = w.word.trim();
        const txt = /^tooth$/i.test(raw) ? "Tooth" : /^referral/i.test(raw) && /^tooth$/i.test(c[i - 1]?.word.trim() ?? "") ? raw.replace(/^r/, "R") : raw;
        return <span key={i} style={{ color: now ? PURPLE : INK, opacity: on ? 1 : 0.28 }}>{txt} </span>;
      })}
    </div>
  );
};

const SceneView: React.FC<{ sc: Scene; t: number; tag: string }> = ({ sc, t, tag }) => {
  const st = t - sc.from;
  const inn = sp(t, sc.from, 18, 140);
  const blow = sc.fx?.find((f) => f.k === "blow") as Extract<Fx, { k: "blow" }> | undefined;
  const h = sc.ch ?? CH;
  return (
    <AbsoluteFill style={{ background: "linear-gradient(170deg, #FBFAFF 0%, #EFEAFF 60%, #E6DEFF 100%)" }}>
      <AbsoluteFill style={{ backgroundImage: "radial-gradient(rgba(109,74,232,0.10) 1.5px, transparent 1.6px)", backgroundSize: "36px 36px" }} />
      <div style={{ position: "absolute", top: 70, left: 60, right: 60, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Img src={staticFile("tr/logo.png")} style={{ height: 70 }} />
        <div style={{ fontSize: 26, fontWeight: 700, color: PURPLE, letterSpacing: "0.12em", fontFamily: FONT_UI }}>{tag}</div>
      </div>
      {sc.end ? (
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", opacity: inn }}>
          <RingFx text={(sc.fx?.find((f) => f.k === "ring") as { text: string } | undefined)?.text ?? ""} t={st} o={inn} />
          <Img src={staticFile("tr/logo.png")} style={{ width: 640, scale: String(0.85 + 0.15 * inn), marginTop: -80 }} />
          <div style={{ marginTop: 170, fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: 64, textAlign: "center", lineHeight: 1.1, color: INK }}>Replace your web form<br />with a referral pipeline.</div>
          <div style={{ marginTop: 34, padding: "18px 40px", borderRadius: 999, background: PURPLE, color: "#fff", fontSize: 40, fontWeight: 700, fontFamily: FONT_UI }}>Set up in about 5 minutes</div>
          <div style={{ marginTop: 26, fontSize: 36, color: PURPLE, fontWeight: 700, fontFamily: FONT_UI }}>toothreferral.com</div>
        </AbsoluteFill>
      ) : (
        <>
          <div style={{ position: "absolute", top: 210, left: 60, right: 60, opacity: inn, translate: `0 ${(1 - inn) * 30}px`, fontFamily: FONT_UI }}>
            {sc.kicker ? <div style={{ fontSize: 30, fontWeight: 800, letterSpacing: "0.14em", color: PURPLE }}>{sc.kicker}</div> : null}
            {sc.title ? <div style={{ marginTop: 12, fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: 66, lineHeight: 1.06, letterSpacing: "-0.03em", color: INK }}>{sc.title}</div> : null}
          </div>
          {sc.split ? (
            <div style={{ position: "absolute", top: 520, left: 40, right: 40, display: "flex", gap: 24 }}>
              {sc.split.map((im, i) => (
                <div key={i} style={{ flex: 1, translate: `0 ${(1 - sp(t, sc.from + i * 0.3, 16)) * 400}px` }}>
                  <div style={{ fontSize: 34, fontWeight: 800, marginBottom: 14, color: i ? PURPLE : "#8A7A63", fontFamily: FONT_UI }}>{i ? "Tooth Referral" : "Web form"}</div>
                  <Card img={im} crop={i ? { x: 360, y: 150, w: 900 } : { x: 0, y: 0, w: 1400 }} w={488} h={760} t={t} />
                </div>
              ))}
            </div>
          ) : null}
          {sc.img && !sc.big ? (
            <div style={{ position: "absolute", top: CY, left: CX, opacity: inn, translate: `0 ${(1 - inn) * 120}px` }}>
              <Card img={sc.img} crop={camAt(sc.keys!, t)} w={CW} h={h} hl={sc.hl} t={t} />
            </div>
          ) : null}
          {sc.big && sc.img ? (
            // rack focus: the previous screen goes soft behind the question
            <div style={{ position: "absolute", top: CY + 160, left: CX, filter: `blur(${2 + 12 * ramp(t, sc.from, sc.from + 0.6)}px)`, opacity: 0.6 }}>
              <Card img={sc.img} crop={camAt(sc.keys!, t)} w={CW} h={h} t={t} />
            </div>
          ) : null}
          {sc.big ? <Big text={sc.big} t={t} inn={inn} blowAt={blow?.t} top={sc.img ? 380 : 560} /> : null}
          <div style={{ position: "absolute", top: sc.big ? 1180 : CY + h + 40, left: 60, right: 60, display: "flex", flexWrap: "wrap", gap: 16 }}>
            {(sc.chips ?? []).map((c, i) => { if (t < c.at) return null; const k = sp(t, c.at, 12, 180);
              return <div key={i} style={{ padding: "14px 28px", borderRadius: 999, background: c.c ?? PURPLE, color: "#fff", fontSize: 38, fontWeight: 800, fontFamily: FONT_UI, scale: String(k), boxShadow: "0 12px 30px rgba(0,0,0,0.18)" }}>{c.t}</div>; })}
          </div>
          {(sc.fx ?? []).map((f, i) => {
            if (f.k === "cursor") return <CursorFx key={i} fx={f} sc={sc} t={t} />;
            if (f.k === "stack") return <StackFx key={i} fx={f} t={t} />;
            if (f.k === "drop") return <DropFx key={i} fx={f} t={t} />;
            if (f.k === "stamp") return <StampFx key={i} fx={f} t={t} />;
            if (f.k === "dial") return <DialFx key={i} fx={f} t={t} />;
            if (f.k === "keys") return <KeysFx key={i} fx={f} t={t} />;
            if (f.k === "count") return <CountFx key={i} fx={f} t={t} />;
            return null;
          })}
        </>
      )}
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 80% 70% at 50% 45%, transparent 60%, rgba(40,20,110,0.10) 100%)", pointerEvents: "none" }} />
    </AbsoluteFill>
  );
};

const jag = (side: "L" | "R") => {
  const pts: string[] = [];
  for (let i = 0; i <= 30; i++) pts.push(`${(50 + (rand(i * 3.7) - 0.5) * 4).toFixed(2)}% ${(i / 30) * 100}%`);
  return side === "L" ? `polygon(0 0, ${pts.join(", ")}, 0 100%)` : `polygon(${pts.join(", ")}, 100% 100%, 100% 0)`;
};

/** The outgoing scene, transformed by the incoming scene's `enter` (tear / blade / focus / push). */
const Transition: React.FC<{ prev: Scene; next: Scene; t: number; tag: string }> = ({ prev, next, t, tag }) => {
  const k = ramp(t, next.from, next.from + 0.6);
  if (k >= 1) return null;
  const view = <SceneView sc={prev} t={t} tag={tag} />;
  const kind = next.enter ?? "push";
  if (kind === "tear") {
    const d = k * 700;
    return (
      <>
        {(["L", "R"] as const).map((s) => (
          <AbsoluteFill key={s} style={{ translate: `${s === "L" ? -d : d}px 0`, rotate: `${(s === "L" ? -1 : 1) * k * 6}deg`, transformOrigin: s === "L" ? "0% 100%" : "100% 100%", filter: "drop-shadow(0 20px 30px rgba(0,0,0,0.35))" }}>
            <AbsoluteFill style={{ clipPath: jag(s), background: "#fff", translate: `${s === "L" ? 6 : -6}px 0` }} />
            <AbsoluteFill style={{ clipPath: jag(s) }}>{view}</AbsoluteFill>
          </AbsoluteFill>
        ))}
      </>
    );
  }
  if (kind === "blade") {
    const d = k * 900;
    const flash = interpolate(k, [0, 0.15, 0.4], [0, 1, 0], clamp);
    return (
      <>
        <AbsoluteFill style={{ clipPath: "polygon(0 0, 100% 0, 100% 36%, 0 64%)", translate: `${-0.5 * d}px ${-0.87 * d}px` }}>{view}</AbsoluteFill>
        <AbsoluteFill style={{ clipPath: "polygon(0 64%, 100% 36%, 100% 100%, 0 100%)", translate: `${0.5 * d}px ${0.87 * d}px` }}>{view}</AbsoluteFill>
        <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, opacity: flash }}><line x1={-40} y1={1250} x2={1120} y2={670} stroke="#fff" strokeWidth={12} style={{ filter: "drop-shadow(0 0 18px #fff) drop-shadow(0 0 40px #9F7BFF)" }} /></svg>
      </>
    );
  }
  if (kind === "focus") return <AbsoluteFill style={{ opacity: 1 - k, filter: `blur(${k * 24}px)`, scale: String(1 + k * 0.08) }}>{view}</AbsoluteFill>;
  return <AbsoluteFill style={{ translate: `0 ${-k * 1920 * 0.35}px`, opacity: 1 - k, scale: String(1 - 0.06 * k) }}>{view}</AbsoluteFill>;
};

const Inner: React.FC<{ id: string }> = ({ id }) => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const cfg = CFG[id];
  const words = (transcript as Record<string, { words: { word: string; start: number; end: number }[] }>)[cfg.words].words;
  const idx = Math.max(0, cfg.scenes.findIndex((s, i) => t >= s.from && t < (cfg.scenes[i + 1]?.from ?? 1e9)));
  const sc = cfg.scenes[idx];
  const prev = idx > 0 ? cfg.scenes[idx - 1] : null;
  const k = prev ? ramp(t, sc.from, sc.from + 0.6) : 1;
  const enter = sc.enter ?? "push";
  return (
    <AbsoluteFill style={{ background: "#F4F1FF" }}>
      <Audio src={staticFile(cfg.audio)} />
      {/* the incoming scene sits under a tear/blade, and slides in for a push */}
      <AbsoluteFill style={enter === "push" && prev ? { translate: `0 ${(1 - k) * 1920 * 0.25}px` } : enter === "focus" && prev ? { filter: k < 1 ? `blur(${(1 - k) * 14}px)` : undefined } : {}}>
        <SceneView sc={sc} t={t} tag={cfg.tag} />
      </AbsoluteFill>
      {prev ? <Transition prev={prev} next={sc} t={t} tag={cfg.tag} /> : null}
      {!sc.end && !(sc.fx ?? []).some((f) => f.k === "keys" && t >= f.t0 - 0.1 && t < f.t0 + 0.3 + f.typed.length * 0.16 + 2.0) ? <Captions words={words} t={t} /> : null}
    </AbsoluteFill>
  );
};

export const CampFx: React.FC<{ id: string }> = ({ id }) => <FontGate><Inner id={id} /></FontGate>;
export const CAMPFX_DURATION = (id: string) => Math.round(CFG[id].seconds * FPS);
