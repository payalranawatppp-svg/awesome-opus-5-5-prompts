/**
 * Brand-awareness shorts for Vejay's brief (2026-11-08): "Form vs Software" and "Day in the Life of an Endodontic
 * Start-up". Voice: ElevenLabs "Bella" (public/audio/voice/camp-*.wav); word timings in src/data/transcript-camp.json.
 * Visuals are real ToothReferral screens (dash3c, dash2c, analytics-ref, the live embed form) and two neutral mock-ups
 * of a generic web form and an inbox (no competitor named or shown).
 */
import React from "react";
import { AbsoluteFill, Audio, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import transcript from "../data/transcript-camp.json";
import { FONT_DISPLAY, FONT_UI } from "../theme";
import { FontGate } from "../effects/shared";

const FPS = 30;
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const PURPLE = "#6D4AE8";
const INK = "#16132B";
const AMBER = "#E89D15";
const GREEN = "#1F9D6B";

type Img2 = { src: string; w: number; h: number };
type Crop = { x: number; y: number; w: number };
type Chip = { t: string; at: number; c?: string };
type Scene = {
  from: number; // seconds
  kicker?: string;
  title?: string;
  img?: Img2;
  img2?: Img2; // optional second card (split)
  keys?: [number, Crop][]; // seconds, crop in image px
  chips?: Chip[];
  big?: string; // a big statement instead of an image
  end?: boolean;
  hl?: { box: [number, number, number, number]; at: number; c?: string }[];
  /** card height (px); wide crops need a shorter card */
  ch?: number;
};

const D3 = (n: string): Img2 => ({ src: `dash3c/${n}.jpg`, w: 1920, h: 912 });
const D2 = (n: string): Img2 => ({ src: `dash2c/${n}.jpg`, w: 1904, h: 868 });
const AR = (n: string, h: number): Img2 => ({ src: `analytics-ref/${n}.png`, w: n.startsWith("01") ? 1920 : 1460, h });
const FORM: Img2 = { src: "camp/mock.png", w: 2004, h: 1600 };
const MAIL: Img2 = { src: "camp/mail.png", w: 2000, h: 1600 };
const EMBED: Img2 = { src: "camp/tr-embed-form.jpg", w: 920, h: 1060 };

export const CAMP: Record<string, { audio: string; words: string; seconds: number; scenes: Scene[] }> = {
  "form-vs-software": {
    audio: "audio/voice/camp-form-vs-software.wav",
    words: "form-vs-software.16k.wav",
    seconds: 47.5,
    scenes: [
      { from: 0, kicker: "SAME REFERRAL", title: "Two very different endings", img: FORM, img2: D3("r3c-incoming"), keys: [[0, { x: 0, y: 0, w: 2004 }]] },
      { from: 4.0, kicker: "THE WEB FORM", title: "You hit submit…", img: FORM, keys: [[4.0, { x: 0, y: 0, w: 2004 }], [5.6, { x: 0, y: 900, w: 1300 }]] },
      { from: 6.9, kicker: "THE WEB FORM", title: "…it becomes an email in somebody's inbox", img: MAIL, keys: [[6.9, { x: 0, y: 0, w: 2000 }], [9.5, { x: 0, y: 60, w: 1500 }]], hl: [{ box: [0, 132, 2000, 232], at: 7.6, c: AMBER }], chips: [{ t: "No confirmation", at: 9.8, c: AMBER }, { t: "No status", at: 10.9, c: AMBER }] },
      { from: 12.1, big: "Did anyone call\nthe patient?", kicker: "NOBODY KNOWS" },
      { from: 14.9, kicker: "TOOTH REFERRAL", title: "The referral lands as a case", img: D3("r3c-incoming"), ch: 620, keys: [[14.9, { x: 360, y: 150, w: 1500 }], [17.6, { x: 370, y: 190, w: 1150 }]], hl: [{ box: [380, 250, 1850, 330], at: 17.2, c: PURPLE }] },
      { from: 18.0, kicker: "TOOTH REFERRAL", title: "X-rays and insurance attached", img: D3("r3c-insurance"), keys: [[18.0, { x: 180, y: 380, w: 900 }], [20.6, { x: 180, y: 420, w: 760 }]], chips: [{ t: "X-rays attached", at: 18.4, c: GREEN }, { t: "Insurance attached", at: 19.3, c: GREEN }] },
      { from: 20.8, kicker: "EVERY STEP LOGGED", title: "Received → contacted → scheduled", img: D3("r3c-activity-log"), keys: [[20.8, { x: 380, y: 0, w: 920 }], [24.5, { x: 380, y: 10, w: 760 }]], chips: [{ t: "Received", at: 25.0, c: PURPLE }, { t: "Contacted", at: 25.9, c: PURPLE }, { t: "Consultation scheduled", at: 27.1, c: GREEN }] },
      { from: 28.5, kicker: "BOTH OFFICES", title: "Message the specialist right on the case", img: D3("r3c-messages"), keys: [[28.5, { x: 690, y: 220, w: 1100 }], [31.2, { x: 760, y: 260, w: 900 }]] },
      { from: 33.7, kicker: "LOOP CLOSED", title: "Signed completion note, sent automatically", img: D2("cs-07-signed-success"), keys: [[33.7, { x: 380, y: 0, w: 1500 }], [36.0, { x: 1250, y: 0, w: 640 }]], chips: [{ t: "Signed & sent", at: 35.4, c: GREEN }] },
      { from: 37.8, big: "A web form sends an email.", kicker: "THE DIFFERENCE" },
      { from: 40.0, big: "Tooth Referral starts a\ntracked, shared case.", kicker: "THE DIFFERENCE" },
      { from: 42.8, end: true },
    ],
  },
  "day-in-the-life": {
    audio: "audio/voice/camp-day-in-the-life.wav",
    words: "day-in-the-life.16k.wav",
    seconds: 53.5,
    scenes: [
      { from: 0, big: "Day 1", kicker: "ENDO START-UP DIARY", chips: [{ t: "Chairs in ✓", at: 2.6, c: GREEN }, { t: "CBCT works ✓", at: 3.8, c: GREEN }, { t: "Website: tomorrow", at: 5.6, c: AMBER }] },
      { from: 7.7, kicker: "BUILDING THE WEBSITE", title: "Every specialist site has a referral form", img: FORM, keys: [[7.7, { x: 0, y: 0, w: 2004 }], [11.4, { x: 0, y: 200, w: 1600 }]] },
      { from: 12.5, big: "What happens after\na dentist hits submit?", kicker: "ONE QUESTION" },
      { from: 17.2, kicker: "WITH A FORM", title: "It lands in an inbox", img: MAIL, keys: [[17.2, { x: 0, y: 0, w: 2000 }]], hl: [{ box: [0, 132, 2000, 232], at: 18.3, c: AMBER }] },
      { from: 19.9, kicker: "WITH TOOTH REFERRAL", title: "It lands in a pipeline", img: D3("r3c-incoming"), ch: 620, keys: [[19.9, { x: 360, y: 150, w: 1500 }], [22.3, { x: 370, y: 190, w: 1150 }]] },
      { from: 22.4, kicker: "CHOOSING REFERRAL SOFTWARE", title: "Tooth Referral, embedded on my website", img: EMBED, keys: [[22.4, { x: 0, y: 0, w: 920 }], [28.0, { x: 0, y: 520, w: 920 }]], chips: [{ t: "Pick a location", at: 26.4, c: PURPLE }, { t: "Attach X-rays", at: 27.4, c: PURPLE }, { t: "Secure insurance link", at: 30.1, c: GREEN }] },
      { from: 31.9, kicker: "INVITE YOUR NETWORK", title: "The dentists I already know", img: D3("r3c-referral-source"), keys: [[31.9, { x: 380, y: 380, w: 900 }], [34.0, { x: 380, y: 500, w: 700 }]], hl: [{ box: [395, 640, 900, 730], at: 32.9, c: GREEN }] },
      { from: 34.7, kicker: "ONE SHARED CASE", title: "Same case. Same messages. Same status.", img: D3("r3c-messages"), keys: [[34.7, { x: 690, y: 220, w: 1100 }], [38.5, { x: 760, y: 260, w: 900 }]], chips: [{ t: "Same case", at: 35.6, c: PURPLE }, { t: "Same messages", at: 36.8, c: PURPLE }, { t: "Same status", at: 37.8, c: GREEN }] },
      { from: 39.1, kicker: "WEEK 4", title: "Every referral, who sent it, how fast we called", img: AR("01-header-kpis", 640), ch: 420, keys: [[39.1, { x: 380, y: 360, w: 1480 }], [43.8, { x: 380, y: 380, w: 1100 }]], chips: [{ t: "28 referrals", at: 44.0, c: PURPLE }, { t: "First contact 3.7 h", at: 45.3, c: GREEN }] },
      { from: 47.9, big: "Starting a practice is hard.\nLosing referrals shouldn't be.", kicker: "DAY 28" },
      { from: 51.4, end: true },
    ],
  },
};

const ease = (t: number) => 1 - Math.pow(1 - t, 3);

const camAt = (keys: [number, Crop][], t: number): Crop => {
  if (t <= keys[0][0]) return keys[0][1];
  for (let i = 1; i < keys.length; i++) {
    if (t <= keys[i][0]) {
      const [t0, a] = keys[i - 1];
      const [t1, b] = keys[i];
      const k = ease((t - t0) / (t1 - t0));
      return { x: a.x + (b.x - a.x) * k, y: a.y + (b.y - a.y) * k, w: a.w + (b.w - a.w) * k };
    }
  }
  return keys[keys.length - 1][1];
};

const CW = 1000;
const CH = 860;

const Card: React.FC<{ img: Img2; crop: Crop; w?: number; h?: number; hl?: Scene["hl"]; t: number }> = ({ img, crop: c0, w = CW, h = CH, hl, t }) => {
  const cw = Math.min(c0.w, (img.h * w) / h, img.w);
  const crop = { w: cw, x: Math.max(0, Math.min(c0.x, img.w - cw)), y: Math.max(0, Math.min(c0.y, img.h - (cw * h) / w)) };
  const s = w / crop.w;
  return (
    <div style={{ position: "relative", width: w, height: h, borderRadius: 34, overflow: "hidden", background: "#fff", boxShadow: "0 40px 90px rgba(40,20,110,0.28), 0 2px 0 rgba(255,255,255,0.8) inset", border: "1.5px solid rgba(109,74,232,0.18)" }}>
      <Img src={staticFile(img.src)} style={{ position: "absolute", left: -crop.x * s, top: -crop.y * s, width: img.w * s, height: img.h * s, maxWidth: "none" }} />
      {(hl ?? []).map((b, i) => {
        const k = interpolate(t, [b.at, b.at + 0.35], [0, 1], clamp);
        return <div key={i} style={{ position: "absolute", left: (b.box[0] - crop.x) * s, top: (b.box[1] - crop.y) * s, width: (b.box[2] - b.box[0]) * s, height: (b.box[3] - b.box[1]) * s, border: `5px solid ${b.c ?? PURPLE}`, borderRadius: 14, opacity: k, background: `${b.c ?? PURPLE}14` }} />;
      })}
    </div>
  );
};

const Captions: React.FC<{ words: { word: string; start: number; end: number }[]; t: number }> = ({ words, t }) => {
  // chunks of up to 5 words, broken at punctuation
  const chunks: (typeof words)[] = [];
  let cur: typeof words = [];
  words.forEach((w) => {
    cur.push(w);
    if (cur.length >= 5 || /[.,?!]$/.test(w.word.trim())) { chunks.push(cur); cur = []; }
  });
  if (cur.length) chunks.push(cur);
  const c = chunks.find((ch, i) => t >= ch[0].start - 0.05 && t < (chunks[i + 1]?.[0].start ?? 1e9) - 0.05 && t < ch[ch.length - 1].end + 0.7);
  if (!c) return null;
  return (
    <div style={{ position: "absolute", left: 60, right: 60, top: 1600, textAlign: "center", fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: 58, lineHeight: 1.15, letterSpacing: "-0.02em" }}>
      {c.map((w, i) => {
        const on = t >= w.start - 0.03;
        const now = t >= w.start - 0.03 && t < w.end + 0.05;
        const txt = w.word.trim().replace(/^tooth$/i, "Tooth").replace(/^referral([,.]?)$/i, (m, p) => (c[i - 1]?.word.trim().toLowerCase() === "tooth" ? "Referral" : "referral") + p);
        return <span key={i} style={{ color: now ? PURPLE : INK, opacity: on ? 1 : 0.28 }}>{txt} </span>;
      })}
    </div>
  );
};

export const CampVideo: React.FC<{ id: string }> = ({ id }) => (
  <FontGate>
    <CampInner id={id} />
  </FontGate>
);

const CampInner: React.FC<{ id: string }> = ({ id }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const cfg = CAMP[id];
  const words = (transcript as Record<string, { words: { word: string; start: number; end: number }[] }>)[cfg.words].words;
  const idx = cfg.scenes.findIndex((s, i) => t >= s.from && t < (cfg.scenes[i + 1]?.from ?? 1e9));
  const sc = cfg.scenes[Math.max(0, idx)];
  const st = t - sc.from;
  const inn = spring({ frame: Math.round(st * fps), fps, config: { damping: 18, stiffness: 140 } });
  return (
    <AbsoluteFill style={{ background: "linear-gradient(170deg, #FBFAFF 0%, #EFEAFF 60%, #E6DEFF 100%)", fontFamily: FONT_UI, color: INK }}>
      <Audio src={staticFile(cfg.audio)} />
      <AbsoluteFill style={{ backgroundImage: "radial-gradient(rgba(109,74,232,0.10) 1.5px, transparent 1.6px)", backgroundSize: "36px 36px" }} />
      {/* brand bar */}
      <div style={{ position: "absolute", top: 70, left: 60, right: 60, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Img src={staticFile("tr/logo.png")} style={{ height: 70 }} />
        <div style={{ fontSize: 26, fontWeight: 700, color: PURPLE, letterSpacing: "0.12em" }}>{id === "day-in-the-life" ? "DAY IN THE LIFE" : "FORM VS SOFTWARE"}</div>
      </div>
      {sc.end ? (
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", opacity: inn }}>
          <Img src={staticFile("tr/logo.png")} style={{ width: 640, scale: String(0.85 + 0.15 * inn) }} />
          <div style={{ marginTop: 50, fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: 64, textAlign: "center", lineHeight: 1.1 }}>Replace your web form<br />with a referral pipeline.</div>
          <div style={{ marginTop: 34, padding: "18px 40px", borderRadius: 999, background: PURPLE, color: "#fff", fontSize: 40, fontWeight: 700 }}>Set up in about 5 minutes</div>
          <div style={{ marginTop: 26, fontSize: 36, color: PURPLE, fontWeight: 700 }}>toothreferral.com</div>
        </AbsoluteFill>
      ) : (
        <>
          <div style={{ position: "absolute", top: 210, left: 60, right: 60, opacity: inn, translate: `0 ${(1 - inn) * 30}px` }}>
            {sc.kicker ? <div style={{ fontSize: 30, fontWeight: 800, letterSpacing: "0.14em", color: PURPLE }}>{sc.kicker}</div> : null}
            {sc.title ? <div style={{ marginTop: 12, fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: 66, lineHeight: 1.06, letterSpacing: "-0.03em" }}>{sc.title}</div> : null}
          </div>
          {sc.big ? (
            <div style={{ position: "absolute", top: 560, left: 60, right: 60, fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: sc.big.length < 8 ? 300 : 104, lineHeight: 1.04, letterSpacing: "-0.04em", whiteSpace: "pre-line", opacity: inn, scale: String(0.92 + 0.08 * inn), transformOrigin: "left top", color: INK }}>{sc.big}</div>
          ) : null}
          {sc.img && sc.img2 ? (
            <div style={{ position: "absolute", top: 520, left: 40, right: 40, display: "flex", gap: 24, opacity: inn }}>
              {[sc.img, sc.img2].map((im, i) => (
                <div key={i} style={{ flex: 1, translate: `0 ${(1 - spring({ frame: Math.max(0, Math.round(st * fps) - i * 8), fps, config: { damping: 16 } })) * 300}px` }}>
                  <div style={{ fontSize: 34, fontWeight: 800, marginBottom: 14, color: i ? PURPLE : "#8A7A63" }}>{i ? "Tooth Referral" : "Web form"}</div>
                  <Card img={im} crop={i ? { x: 180, y: 40, w: 980 } : { x: 0, y: 0, w: 1400 }} w={488} h={760} t={t} />
                </div>
              ))}
            </div>
          ) : sc.img ? (
            <div style={{ position: "absolute", top: 560, left: 40, opacity: inn, translate: `0 ${(1 - inn) * 120}px` }}>
              <Card img={sc.img} crop={camAt(sc.keys!, t)} h={sc.ch ?? CH} hl={sc.hl} t={t} />
            </div>
          ) : null}
          <div style={{ position: "absolute", top: sc.big ? 1180 : 560 + (sc.ch ?? CH) + 40, left: 60, right: 60, display: "flex", flexWrap: "wrap", gap: 16 }}>
            {(sc.chips ?? []).map((c, i) => {
              const k = spring({ frame: Math.round((t - c.at) * fps), fps, config: { damping: 12, stiffness: 180 } });
              if (t < c.at) return null;
              return <div key={i} style={{ padding: "14px 28px", borderRadius: 999, background: c.c ?? PURPLE, color: "#fff", fontSize: 38, fontWeight: 800, scale: String(k), boxShadow: "0 12px 30px rgba(0,0,0,0.18)" }}>{c.t}</div>;
            })}
          </div>
        </>
      )}
      {!sc.end ? <Captions words={words} t={t} /> : null}
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 80% 70% at 50% 45%, transparent 60%, rgba(40,20,110,0.10) 100%)", pointerEvents: "none" }} />
    </AbsoluteFill>
  );
};

export const CAMP_DURATION = (id: string) => Math.round(CAMP[id].seconds * FPS);
