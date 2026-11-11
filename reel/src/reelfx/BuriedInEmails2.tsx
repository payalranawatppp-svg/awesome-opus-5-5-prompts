/**
 * "Buried in Emails" v2 (Script 13 v2, after Nitesh's notes). Eleven Google Flow clips of Tanya and Amanda at the
 * front desk, cut into one take (scratchpad b2/cut.py), colour-matched per clip, both voices re-made with ElevenLabs
 * speech-to-speech (Tanya: Matilda, Amanda: Jessica) at 0 ms offset, so the emotion and lip sync are the takes' own.
 *
 * Clean-up:
 *  - clip 1 opens on a camera tripod in the corners: the edit starts just before Amanda speaks, slightly punched in
 *  - clip 5: Amanda's mug sip over "that's the old way" is covered by the full-screen THE OLD WAY beat
 *  - clip 6 lost "we replaced the form on our website with Tooth Referral" and repeated "One case": the missing line is
 *    spoken in Amanda's voice over a full-screen graphic (no lips on screen), the repeat is cut
 *
 * The product panel fixes v1's border problem: every screen is cropped on the app's own card edges and shown whole
 * inside a white card with padding (no text is ever sliced by the panel edge), the card sizes itself to each screen,
 * and the footage slides down per segment (data/b2-faces.json) so the panel never covers a face.
 * Demo data; offices, patients and staff are fictional.
 */
import React from "react";
import { AbsoluteFill, Audio, Freeze, Img, OffthreadVideo, Sequence, interpolate, spring, staticFile, useCurrentFrame } from "remotion";
import transcript from "../data/transcript-b2.json";
import edl from "../data/b2-edl.json";
import faces from "../data/b2-faces.json";
import { FontGate } from "../effects";
import { FONT_UI } from "../theme";
import { LogoReveal, easeIO, easeOut, ramp } from "../tr/motion";
import { ICON, Icon, TR, clamp } from "../tr/ui";

const FPS = 30;
const CUT_FRAMES = Math.round(edl.duration * FPS);
const TAIL = 90;
export const B2_DURATION = CUT_FRAMES + TAIL;

const YELLOW = "#F3DD72";
const AMBER = "#FFB020";
const AMBER_DK = "#E89D15";
const INK = "#16131F";
const W = "#FFFFFF";
const BG = "#0F0B1C";
const GREEN = "#1FA463";
const TYPE: React.CSSProperties = { fontFamily: FONT_UI, fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 0.98 };
const SOFT = "0 2px 16px rgba(10,6,24,0.55), 0 1px 3px rgba(10,6,24,0.5)";

const sp = (frame: number, a: number, damping = 15, stiffness = 160) =>
  frame < a ? 0 : spring({ frame: frame - a, fps: FPS, config: { damping, stiffness, mass: 0.75 } });

// ---------------------------------------------------------------------------------------------------
// Timing from the word timestamps (frames)

type Word = { word: string; start: number; end: number };
const WORDS = (transcript as unknown as { b2: { words: Word[] } }).b2.words;
const norm = (w: string) => w.toLowerCase().replace(/[^a-z0-9]/g, "");
const at = (word: string, n = 1) => {
  const hits = WORDS.filter((w) => norm(w.word) === word);
  if (!hits[n - 1]) throw new Error(`"${word}" #${n} not in transcript`);
  return Math.round(hits[n - 1].start * FPS);
};
const SEG = edl.segments.map((s) => ({ ...s, f0: Math.round(s.start * FPS), f1: Math.round((s.start + s.dur) * FPS) }));
const segAt = (f: number) => Math.max(0, SEG.findIndex((s, i) => f >= s.f0 && (i === SEG.length - 1 || f < SEG[i + 1].f0)));
const INS = SEG.find((s) => s.clip === "INS")!;
const C = (clip: string, k = 0) => SEG.filter((s) => s.clip === clip)[k];

const T = {
  email: at("email", 1), voicemail: at("voicemail"), fax: at("fax"), none: at("none"),
  patient: at("patient"), nobody: at("nobody"), right: at("right", 1),
  out: at("out", 2), holidays: at("holidays"), losing: at("losing"),
  inbox: at("inbox"), head: at("head"), gone: at("gone"), old: at("old"),
  replaced: at("replaced"), tooth: at("tooth"), every2: at("every", 2), one2: at("one", 3),
  communication: at("communication"), place: at("place"), xrays: at("x", 1), insurance: at("insurance"), messages: at("messages"),
  status1: at("status", 1), whoever: at("whoever"), everything: at("everything"),
  tomorrow: at("tomorrow"), greg: at("greg"), exactly: at("exactly"), digging: at("digging"),
  dentists: at("dentists"), constantly: at("constantly"), status2: at("status", 2), message: at("message"),
  depend: at("depend"), working: at("working"), ran: at("ran"), need: at("need"),
  meeting: at("meeting"), lunch: at("lunch", 2),
};

// ---------------------------------------------------------------------------------------------------
// Layout: full frame, or split (product panel on top, the footage slid down so both faces stay below it)

const PANEL_BOTTOM = 830;
const SPLIT = [INS.f1 - 2, C("11").f0] as const; // the split runs from the end of the insert to the last clip
const FACES = faces as { i: number; top: number; bot: number }[];
const SHIFT = FACES.map((f) => Math.max(380, Math.min(720, PANEL_BOTTOM + 40 - f.top)));
const splitK = (f: number) => Math.min(ramp(f, SPLIT[0], SPLIT[0] + 14, easeIO), 1 - ramp(f, SPLIT[1] - 2, SPLIT[1] + 12, easeIO));

/** Small zoom alternation on joins inside one clip, a punch-in on clip 1 (hides the tripod), slow drift. */
const camera = (f: number) => {
  const i = segAt(f);
  const s = SEG[i];
  let run = 0;
  for (let k = i; k > 0 && SEG[k - 1].clip === s.clip; k--) run++;
  const drift = 0.015 * ramp(f, s.f0, s.f1, (t) => t);
  const base = s.clip === "01" ? 1.16 : 1.02;
  return { s: base + (run % 2 ? 0.06 : 0) + drift, origin: s.clip === "01" ? "55% 32%" : "50% 40%" };
};

// ---------------------------------------------------------------------------------------------------
// Captions (word by word, one key word marked)

const KEY = new Set(["staring", "referral", "email", "voicemail", "fax", "match", "upset", "right", "holidays", "steam", "inbox", "head", "gone", "old", "toothreferral", "case", "communication", "place", "everything", "greg", "stands", "constantly", "status", "message", "depend", "ran", "need", "meeting", "lunch"]);
type Tok = { t: string; at: number; end: number; key: boolean };
const TOKS: Tok[] = (() => {
  const out: Tok[] = [];
  for (const w of WORDS) {
    let t = w.word.trim();
    const prev = out[out.length - 1];
    if (prev && t.startsWith("-")) { prev.t += t; prev.end = Math.round(w.end * FPS); continue; }
    if (prev && prev.t.toLowerCase() === "tooth" && /^referral/i.test(t)) { prev.t = "Tooth Referral" + t.slice(8); prev.end = Math.round(w.end * FPS); continue; }
    if (t === "X") t = "X";
    out.push({ t, at: Math.round(w.start * FPS), end: Math.round(w.end * FPS), key: false });
  }
  // "One case." (Tanya) is a question in the script
  const oc = out.findIndex((x, i) => x.t === "One" && out[i + 1]?.t.startsWith("case") && i > 0 && out[i - 1].t.startsWith("case"));
  if (oc >= 0) out[oc + 1].t = "case?";
  return out;
})();
const CHUNKS = (() => {
  const chunks: { words: Tok[]; from: number; to: number }[] = [];
  let cur: Tok[] = [];
  const flush = () => { if (cur.length) chunks.push({ words: cur, from: cur[0].at - 1, to: cur[cur.length - 1].end + 10 }); cur = []; };
  for (const tk of TOKS) {
    const len = cur.map((x) => x.t).join(" ").length;
    if (cur.length && (cur.length >= 4 || len + tk.t.length > 22)) flush();
    cur.push(tk);
    if (/[.,?!:]$/.test(tk.t)) flush();
  }
  flush();
  for (let i = 0; i < chunks.length - 1; i++) chunks[i].to = Math.min(chunks[i].to, chunks[i + 1].from);
  for (const c of chunks) { let n = 0; for (const w of c.words) { w.key = KEY.has(norm(w.t)) && n === 0; if (w.key) n++; } }
  return chunks;
})();

const Captions: React.FC<{ k: number; light?: boolean }> = ({ k }) => {
  const frame = useCurrentFrame();
  const c = CHUNKS.find((x) => frame >= x.from && frame < x.to);
  if (!c || frame >= CUT_FRAMES - 4) return null;
  const out = interpolate(frame, [c.to - 4, c.to], [0, 1], clamp);
  const top = interpolate(k, [0, 1], [1500, 1730]);
  return (
    <div style={{ position: "absolute", left: 50, right: 50, top, textAlign: "center", fontFamily: FONT_UI, fontWeight: 800, letterSpacing: "-0.025em", lineHeight: 1.12, fontSize: 60, color: W, textShadow: SOFT, opacity: 1 - out, filter: out > 0 ? `blur(${out * 6}px)` : undefined }}>
      {c.words.map((w, i) => {
        const kk = interpolate(frame, [w.at - 2, w.at + 3], [0, 1], clamp);
        const hot = w.key && frame >= w.at;
        return (
          <span key={i} style={{ display: "inline-block", marginRight: i < c.words.length - 1 ? (hot ? "0.14em" : "0.22em") : 0, marginLeft: hot ? "-0.08em" : 0, opacity: kk, translate: `0px ${(1 - kk) * 10}px`, filter: kk < 1 ? `blur(${(1 - kk) * 5}px)` : undefined, padding: hot ? "0 0.14em" : undefined, borderRadius: 12, background: hot ? YELLOW : undefined, color: hot ? INK : W, textShadow: hot ? "none" : SOFT, WebkitTextStroke: hot ? undefined : "8px rgba(12,8,26,0.6)", paintOrder: "stroke fill", boxShadow: hot ? "0 8px 24px rgba(10,6,24,0.35)" : undefined }}>
            {w.t}
          </span>
        );
      })}
    </div>
  );
};

// ---------------------------------------------------------------------------------------------------
// Product screens: crops sit on the app's own card edges, so nothing is cut mid-word

type Box = [number, number, number, number]; // x0, y0, x1, y1 in image px
type Scr = { src: string; crop: { x: number; y: number; w: number; h: number }; label: string };
const D = (n: string) => `dash3c/${n}.jpg`;
const S: Record<string, Scr> = {
  incoming: { src: D("r3c-incoming"), crop: { x: 375, y: 160, w: 1500, h: 500 }, label: "Incoming referrals" },
  messages: { src: D("r3c-messages"), crop: { x: 715, y: 285, w: 1160, h: 430 }, label: "Messages with the referring office" },
  xrays: { src: D("r3c-status-xrays"), crop: { x: 385, y: 440, w: 910, h: 440 }, label: "X-rays on the case" },
  insurance: { src: D("r3c-insurance"), crop: { x: 385, y: 235, w: 915, h: 550 }, label: "Insurance cards" },
  status: { src: D("r3c-status-xrays"), crop: { x: 1370, y: 225, w: 500, h: 610 }, label: "Status & schedule" },
  activity: { src: D("r3c-activity-log"), crop: { x: 375, y: 30, w: 925, h: 420 }, label: "Activity log" },
};
const PAD = 22;
const HEAD = 54;
const MAXW = 1032;
const MAXH = PANEL_BOTTOM - 40 - 30;
/** panel size for a screen: the whole crop fits, plus padding and the header */
const fit = (s: Scr) => {
  const inW = MAXW - 2 * PAD;
  const inH = MAXH - 2 * PAD - HEAD;
  const sc = Math.min(inW / s.crop.w, inH / s.crop.h);
  return { sc, w: s.crop.w * sc + 2 * PAD, h: s.crop.h * sc + 2 * PAD + HEAD };
};

const Hl: React.FC<{ s: Scr; sc: number; box: Box; k: number; color?: string }> = ({ s, sc, box, k, color = TR.purple }) => {
  if (k <= 0) return null;
  const pad = 5;
  return (
    <div style={{ position: "absolute", left: (box[0] - s.crop.x) * sc - pad, top: (box[1] - s.crop.y) * sc - pad, width: (box[2] - box[0]) * sc + 2 * pad, height: (box[3] - box[1]) * sc + 2 * pad, borderRadius: 12, border: `4px solid ${color}`, background: `${color}18`, opacity: Math.min(1, k * 1.5), scale: String(interpolate(k, [0, 1], [1.05, 1])) }} />
  );
};

const Screen: React.FC<{ s: Scr; hl?: { box: Box; at: number; until?: number; color?: string }[] }> = ({ s, hl = [] }) => {
  const frame = useCurrentFrame();
  const { sc } = fit(s);
  return (
    <div style={{ position: "relative", width: s.crop.w * sc, height: s.crop.h * sc, overflow: "hidden", borderRadius: 14, background: "#fff" }}>
      <Img src={staticFile(s.src)} style={{ position: "absolute", left: -s.crop.x * sc, top: -s.crop.y * sc, width: 1920 * sc, maxWidth: "none" }} />
      {hl.map((h, i) => <Hl key={i} s={s} sc={sc} box={h.box} color={h.color} k={sp(frame, h.at, 14, 200) * (h.until ? 1 - ramp(frame, h.until, h.until + 6) : 1)} />)}
    </div>
  );
};

/** "It puts all the communication about that referral in one place": the email, voicemail and fax fly into one case */
const Merge: React.FC = () => {
  const frame = useCurrentFrame();
  const fly = ramp(frame, T.place - 10, T.place + 6, easeIO);
  const card = sp(frame, T.place - 2, 14, 180);
  const items = [{ i: "M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zM22 6l-10 7L2 6", t: "Email", x: -320, y: -110 },
    { i: "M5.5 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM18.5 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM5.5 15.5h13", t: "Voicemail", x: 0, y: -170 },
    { i: "M6 9V2h12v7M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2M6 14h12v8H6z", t: "Fax", x: 320, y: -110 }];
  return (
    <div style={{ position: "relative", width: 900, height: 520, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT_UI }}>
      {items.map((it, i) => {
        const k = sp(frame, T.communication + i * 4, 13, 200);
        return (
          <div key={it.t} style={{ position: "absolute", left: 450 - 110 + it.x * (1 - fly), top: 280 + it.y * (1 - fly), width: 220, opacity: Math.min(1, k * 1.5) * (1 - ramp(frame, T.place, T.place + 8)), scale: String((0.7 + 0.3 * k) * (1 - fly * 0.5)), display: "flex", alignItems: "center", gap: 12, padding: "14px 18px", borderRadius: 999, background: "#F3F0FB", color: INK, fontWeight: 800, fontSize: 30 }}>
            <Icon d={it.i} size={30} color={AMBER_DK} />{it.t}
          </div>
        );
      })}
      <div style={{ position: "absolute", left: 210, top: 150, width: 480, opacity: card, scale: String(0.8 + 0.2 * card), borderRadius: 22, background: "#fff", boxShadow: "0 18px 50px rgba(40,20,110,0.22)", padding: "24px 26px", border: `3px solid ${TR.purple}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ width: 54, height: 54, borderRadius: 27, background: "#C02AD0", color: W, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 22 }}>CW</div>
          <div><div style={{ fontWeight: 800, fontSize: 30, color: INK }}>Carter Wiley</div><div style={{ fontSize: 22, color: TR.muted, fontWeight: 600 }}>from Gentle Dental · one case</div></div>
        </div>
        <div style={{ display: "flex", gap: 10, marginTop: 18, flexWrap: "wrap" }}>
          {["Messages", "Call notes", "Status"].map((x, i) => (
            <span key={x} style={{ opacity: sp(frame, T.place + 4 + i * 3, 13, 220), padding: "8px 16px", borderRadius: 999, background: TR.purpleSoft, color: TR.purple, fontWeight: 800, fontSize: 22 }}>{x}</span>
          ))}
        </div>
      </div>
    </div>
  );
};

/** X-rays, insurance, messages, status: four real screens, each whole, one per word */
const Grid: React.FC = () => {
  const frame = useCurrentFrame();
  const tiles: [Scr, number, string][] = [[S.xrays, T.xrays, "X-rays"], [S.insurance, T.insurance, "Insurance"], [S.messages, T.messages, "Messages"], [S.status, T.status1, "Status"]];
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, width: 960, fontFamily: FONT_UI }}>
      {tiles.map(([s, a, label]) => {
        const k = sp(frame, a - 2, 14, 200);
        const tw = 472, th = 300;
        const sc = Math.min((tw - 20) / s.crop.w, (th - 62) / s.crop.h);
        return (
          <div key={label} style={{ height: th, borderRadius: 18, background: "#fff", boxShadow: "0 10px 30px rgba(40,20,110,0.16)", padding: 10, opacity: Math.min(1, k * 1.4), scale: String(0.85 + 0.15 * k), display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div style={{ alignSelf: "flex-start", display: "flex", alignItems: "center", gap: 8, padding: "4px 6px 10px", fontWeight: 800, fontSize: 24, color: INK }}>
              <Icon d={ICON.check} size={22} color={GREEN} />{label}
            </div>
            <div style={{ position: "relative", width: s.crop.w * sc, height: s.crop.h * sc, overflow: "hidden", borderRadius: 10 }}>
              <Img src={staticFile(s.src)} style={{ position: "absolute", left: -s.crop.x * sc, top: -s.crop.y * sc, width: 1920 * sc, maxWidth: "none" }} />
            </div>
          </div>
        );
      })}
    </div>
  );
};

type Shot = { from: number; to: number; s?: Scr; label?: string; node?: React.ReactNode; hl?: { box: Box; at: number; until?: number; color?: string }[]; w?: number; h?: number };
const SHOTS = (): Shot[] => [
  // c06: "Every referral came in as one case." "One case?"
  { from: SPLIT[0], to: C("07").f0, s: S.incoming, hl: [{ box: [388, 382, 1852, 505], at: T.one2 - 4 }] },
  // c07: all the communication in one place -> X-rays, insurance, messages, status -> sees everything
  { from: C("07").f0, to: T.xrays - 4, node: <Merge />, label: "One referral, one case", w: 960, h: 600 },
  { from: T.xrays - 4, to: T.whoever - 2, node: <Grid />, label: "Everything on the case", w: 1004, h: 700 },
  // "Whoever opens it sees everything" + c08: Greg opens it and knows exactly where it stands
  { from: T.whoever - 2, to: C("09").f0, s: S.activity, hl: [
    { box: [380, 100, 1110, 190], at: T.everything, until: T.greg - 4 },
    { box: [380, 410, 1080, 442], at: T.greg - 2, color: GREEN },
    { box: [380, 200, 860, 235], at: T.exactly, color: AMBER_DK },
    { box: [380, 245, 860, 282], at: T.exactly + 6, color: AMBER_DK } ] },
  // c09: they see the status themselves, and message us right on the case
  { from: C("09").f0, to: T.message - 6, s: S.status, hl: [{ box: [1415, 512, 1668, 557], at: T.status2 }, { box: [1415, 565, 1626, 618], at: T.status2 + 8, color: GREEN }] },
  { from: T.message - 6, to: C("10").f0, s: S.messages, hl: [{ box: [725, 432, 1520, 498], at: T.message }, { box: [725, 505, 1480, 568], at: T.message + 10, color: GREEN }] },
  // c10: it didn't depend on who was working that day; the whole office just ran
  { from: C("10").f0, to: SPLIT[1] + 12, s: S.incoming, hl: [{ box: [388, 382, 1852, 505], at: T.depend }, { box: [388, 505, 1852, 655], at: T.depend + 6 }, { box: [1040, 382, 1260, 655], at: T.ran - 2, color: GREEN }] },
];

const Panel: React.FC<{ k: number }> = ({ k }) => {
  const frame = useCurrentFrame();
  if (k <= 0.001) return null;
  const shots = SHOTS();
  const i = Math.max(0, shots.findIndex((s) => frame >= s.from && frame < s.to));
  const cur = shots[i];
  const size = (s: Shot) => (s.s ? fit(s.s) : { w: s.w ?? 960, h: s.h ?? 600, sc: 1 });
  // the card eases from the previous shot's size to this one's
  const prev = shots[Math.max(0, i - 1)];
  const m = i > 0 ? ramp(frame, cur.from, cur.from + 10, easeIO) : 1;
  const a = size(prev), b = size(cur);
  const w = a.w + (b.w - a.w) * m, h = a.h + (b.h - a.h) * m;
  const top = 40 + (MAXH - h) / 2 + (1 - k) * -(PANEL_BOTTOM + 60);
  const inn = ramp(frame, cur.from, cur.from + 9, easeOut);
  return (
    <div style={{ position: "absolute", left: (1080 - w) / 2, top, width: w, height: h, borderRadius: 28, background: "#FFFFFF", boxShadow: "0 30px 70px rgba(0,0,0,0.45)", overflow: "hidden", fontFamily: FONT_UI }}>
      <div style={{ position: "absolute", left: PAD, right: PAD, top: PAD - 4, height: HEAD - 10, display: "flex", alignItems: "center", gap: 12 }}>
        <Img src={staticFile("tr/logo.png")} style={{ height: 34 }} />
        <div style={{ width: 1.5, height: 26, background: "#E4E2EE" }} />
        <div style={{ fontWeight: 800, fontSize: 24, color: TR.purple, letterSpacing: "0.02em", whiteSpace: "nowrap" }}>{cur.s?.label ?? cur.label}</div>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: PAD + HEAD - 6, bottom: PAD, display: "flex", justifyContent: "center", alignItems: "flex-start", opacity: inn, translate: `${(1 - inn) * 40}px 0px` }}>
        {cur.s ? <Screen s={cur.s} hl={cur.hl} /> : cur.node}
      </div>
    </div>
  );
};

/** Chips under the panel (over the wall behind them), never over the screens' text */
type Call = { from: number; to: number; t: string; c: string; i: string };
const CALLS = (): Call[] => [
  { from: T.one2 - 4, to: C("07").f0 - 2, t: "every referral, one case", c: TR.purple, i: ICON.inbox },
  { from: T.place, to: T.xrays - 6, t: "all communication, one place", c: TR.purple, i: ICON.chat },
  { from: T.greg - 2, to: T.digging - 2, t: "anyone on the team can pick it up", c: GREEN, i: ICON.check },
  { from: T.digging, to: C("09").f0 - 2, t: "no digging through inboxes", c: AMBER_DK, i: ICON.inbox },
  { from: T.status2, to: T.message - 8, t: "the dentist's office sees the status", c: GREEN, i: ICON.check },
  { from: T.message + 4, to: C("10").f0 - 2, t: "messages right on the case", c: TR.purple, i: ICON.chat },
  { from: T.ran - 4, to: SPLIT[1] - 4, t: "the whole office keeps moving", c: GREEN, i: ICON.check },
];
const Callouts: React.FC<{ k: number }> = ({ k }) => {
  const frame = useCurrentFrame();
  if (k < 0.6) return null;
  const g = CALLS().find((c) => frame >= c.from - 1 && frame <= c.to + 6);
  if (!g) return null;
  const s = sp(frame, g.from, 12, 230);
  const out = ramp(frame, g.to, g.to + 6);
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: PANEL_BOTTOM + 6, display: "flex", justifyContent: "center", opacity: 1 - out }}>
      <div style={{ scale: String(s), display: "flex", alignItems: "center", gap: 10, padding: "12px 24px 12px 14px", borderRadius: 999, background: g.c, color: W, fontFamily: FONT_UI, fontWeight: 800, fontSize: 32, whiteSpace: "nowrap", boxShadow: "0 14px 30px rgba(0,0,0,0.3)" }}>
        <div style={{ width: 38, height: 38, borderRadius: 19, background: "rgba(255,255,255,0.25)", display: "flex", alignItems: "center", justifyContent: "center" }}><Icon d={g.i} size={22} color={W} /></div>
        {g.t}
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------------------------------
// Story beats over the full frame (clips 1-5)

const Chip: React.FC<{ icon: string; text: string; k: number; color?: string; strike?: number }> = ({ icon, text, k, color = YELLOW, strike = 0 }) => (
  <div style={{ position: "relative", scale: String(k), opacity: Math.min(1, k * 1.5), display: "flex", alignItems: "center", gap: 12, padding: "12px 24px 12px 12px", borderRadius: 999, background: "rgba(16,12,30,0.88)", boxShadow: "0 14px 34px rgba(10,6,24,0.4)", fontFamily: FONT_UI, fontWeight: 800, fontSize: 32, color: W, whiteSpace: "nowrap" }}>
    <div style={{ width: 48, height: 48, borderRadius: 24, background: color, display: "flex", alignItems: "center", justifyContent: "center" }}><Icon d={icon} size={26} color={INK} /></div>
    {text}
    {strike > 0 && <div style={{ position: "absolute", left: 12, top: "50%", height: 6, width: `calc(${strike * 100}% - 24px)`, background: AMBER, borderRadius: 4, rotate: "-3deg" }} />}
  </div>
);
const I = {
  mail: "M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zM22 6l-10 7L2 6",
  vm: "M5.5 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM18.5 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM5.5 15.5h13",
  fax: "M6 9V2h12v7M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2M6 14h12v8H6z",
  clock: "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM12 6v6l4 2",
  user: "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z",
  cal: "M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z",
  head: "M12 2a7 7 0 0 0-7 7c0 3 2 5 2 8h10c0-3 2-5 2-8a7 7 0 0 0-7-7zM9 21h6",
};
const Beats: React.FC = () => {
  const frame = useCurrentFrame();
  const row = (items: React.ReactNode, from: number, to: number) => {
    if (frame < from - 2 || frame > to + 8) return null;
    const out = ramp(frame, to, to + 8);
    return <div style={{ position: "absolute", left: 40, right: 40, top: 110, display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 14, opacity: 1 - out, filter: out > 0 ? `blur(${out * 6}px)` : undefined }}>{items}</div>;
  };
  const c3 = C("03"), c4 = C("04"), c5 = C("05"), c2 = C("02");
  return (
    <>
      {frame < c2.f0 + 4 ? (() => {
        const p = sp(frame, 4, 16, 150); const out = ramp(frame, c2.f0 - 8, c2.f0);
        return (
          <div style={{ position: "absolute", left: 60, top: 120, opacity: Math.min(1, p * 1.5) * (1 - out), translate: `0px ${(1 - p) * 20}px`, fontFamily: FONT_UI, color: W, textShadow: SOFT }}>
            <div style={{ fontSize: 26, fontWeight: 800, letterSpacing: "0.16em", color: YELLOW }}>HOLIDAY WEEK · 2:40 PM</div>
            <div style={{ ...TYPE, fontSize: 52, marginTop: 8 }}>The front desk.</div>
          </div>
        );
      })() : null}
      {row(<>
        <Chip icon={I.mail} text="An email" k={sp(frame, T.email - 3, 12, 220)} />
        <Chip icon={I.vm} text="A voicemail" k={sp(frame, T.voicemail - 3, 12, 220)} />
        <Chip icon={I.fax} text="A fax" k={sp(frame, T.fax - 3, 12, 220)} />
        {frame >= T.none ? <Chip icon={"M18 6 6 18M6 6l12 12"} text="none of them match" color={AMBER} k={sp(frame, T.none, 12, 220)} /> : null}
      </>, T.email - 3, c3.f0 + 6)}
      {row(<>
        <Chip icon={I.user} text="Patient waiting for a call back" color={AMBER} k={sp(frame, T.patient - 2, 12, 220)} />
        <Chip icon={I.clock} text="nobody got back to her" k={sp(frame, T.nobody, 12, 220)} />
      </>, T.patient - 2, c4.f0 - 2)}
      {row(<>
        <Chip icon={I.cal} text="2 team members out" k={sp(frame, T.out - 2, 12, 220)} />
        <Chip icon={I.cal} text="Holiday week" k={sp(frame, T.holidays - 2, 12, 220)} />
        {frame >= T.losing - 2 ? <Chip icon={I.clock} text="losing steam" color={AMBER} k={sp(frame, T.losing - 2, 12, 220)} /> : null}
      </>, T.out - 2, c5.f0 - 2)}
      {row(<>
        <Chip icon={I.mail} text="someone's inbox" k={sp(frame, T.inbox - 2, 12, 220)} strike={ramp(frame, T.gone - 2, T.gone + 6)} />
        <Chip icon={I.head} text="someone's head" k={sp(frame, T.head - 2, 12, 220)} strike={ramp(frame, T.gone, T.gone + 8)} />
      </>, T.inbox - 2, T.old - 14)}
    </>
  );
};

/** "Yeah, that's the old way." Full-frame beat (it also covers the mug sip in clip 5) */
const OldWay: React.FC = () => {
  const frame = useCurrentFrame();
  const from = T.old - 14, to = C("06").f0;
  if (frame < from || frame >= to + 2) return null;
  const k = ramp(frame, from, from + 6, easeOut);
  const out = ramp(frame, to - 6, to);
  const stamp = sp(frame, T.old - 2, 11, 260);
  const items = [{ i: I.mail, t: "Emails" }, { i: I.vm, t: "Voicemails" }, { i: I.fax, t: "Faxes" }, { i: I.head, t: "Sticky notes & memory" }];
  return (
    <AbsoluteFill style={{ opacity: k * (1 - out), background: "radial-gradient(ellipse at 50% 42%, rgba(42,27,94,0.92), rgba(15,11,28,0.97))", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 18, paddingTop: 260 }}>
      {items.map((x, i) => <div key={x.t} style={{ opacity: 0.85 }}><Chip icon={x.i} text={x.t} k={sp(frame, from + i * 3, 12, 220)} strike={ramp(frame, T.old - 6 + i * 2, T.old + 4 + i * 2)} /></div>)}
      <div style={{ position: "absolute", top: 520, rotate: "-6deg", padding: "12px 30px", border: `8px solid ${YELLOW}`, color: YELLOW, borderRadius: 16, background: "rgba(15,11,28,0.6)", ...TYPE, fontSize: 92, letterSpacing: "0.01em", scale: String(interpolate(stamp, [0, 1], [2.2, 1])), opacity: Math.min(1, stamp * 2) }}>THE OLD WAY</div>
    </AbsoluteFill>
  );
};

/** Clip 6's missing line, full screen: the website's referral form becomes Tooth Referral */
const Replace: React.FC = () => {
  const frame = useCurrentFrame();
  const from = INS.f0 - 2, to = INS.f1 + 2;
  if (frame < from || frame >= to + 8) return null;
  const k = ramp(frame, from, from + 6, easeOut);
  const out = ramp(frame, to - 2, to + 8);
  const sw = ramp(frame, T.tooth - 8, T.tooth + 6, easeIO);
  return (
    <AbsoluteFill style={{ opacity: k * (1 - out), background: "linear-gradient(170deg, #FBFAFF 0%, #EFEAFF 60%, #E6DEFF 100%)", fontFamily: FONT_UI }}>
      <AbsoluteFill style={{ backgroundImage: "radial-gradient(rgba(109,74,232,0.10) 1.5px, transparent 1.6px)", backgroundSize: "36px 36px" }} />
      <div style={{ position: "absolute", top: 230, left: 0, right: 0, textAlign: "center", color: TR.purple, fontWeight: 800, fontSize: 30, letterSpacing: "0.14em" }}>ON OUR WEBSITE</div>
      <div style={{ position: "absolute", left: 90, top: 300, width: 900, borderRadius: 24, overflow: "hidden", background: "#fff", boxShadow: "0 30px 70px rgba(40,20,110,0.25)" }}>
        <div style={{ height: 60, background: "#F1F0F6", display: "flex", alignItems: "center", gap: 10, padding: "0 22px", borderBottom: "1px solid #E4E2EE" }}>
          {[0, 1, 2].map((i) => <div key={i} style={{ width: 14, height: 14, borderRadius: 14, background: "#CFCBDD" }} />)}
          <div style={{ marginLeft: 14, flex: 1, height: 36, borderRadius: 18, background: "#fff", display: "flex", alignItems: "center", padding: "0 16px", fontSize: 22, color: TR.muted, fontWeight: 600 }}>ourpractice.com/referrals</div>
        </div>
        <div style={{ position: "relative", height: 900 }}>
          <div style={{ position: "absolute", inset: 0, opacity: 1 - sw, filter: sw > 0 ? `blur(${sw * 8}px)` : undefined, display: "flex", justifyContent: "center", paddingTop: 24 }}>
            <Img src={staticFile("camp/mock.png")} style={{ width: 860, height: 686, objectFit: "contain" }} />
          </div>
          <div style={{ position: "absolute", inset: 0, opacity: sw, display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 20, gap: 16 }}>
            <Img src={staticFile("tr/logo.png")} style={{ height: 70 }} />
            <Img src={staticFile("camp/tr-embed-form.jpg")} style={{ width: 700, height: 806, objectFit: "contain" }} />
          </div>
        </div>
      </div>
      <div style={{ position: "absolute", top: 1290, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 18 }}>
        <div style={{ opacity: 1 - sw, padding: "14px 28px", borderRadius: 999, background: "#E8E4DA", color: "#6B5E45", fontWeight: 800, fontSize: 32 }}>Web form</div>
        <div style={{ fontSize: 40, color: TR.purple, fontWeight: 800, opacity: 0.6 }}>→</div>
        <div style={{ opacity: Math.max(0.35, sw), padding: "14px 28px", borderRadius: 999, background: TR.purple, color: W, fontWeight: 800, fontSize: 32 }}>Tooth Referral</div>
      </div>
    </AbsoluteFill>
  );
};

const EndCard: React.FC = () => {
  const frame = useCurrentFrame();
  if (frame < CUT_FRAMES - 8) return null;
  const card = ramp(frame, CUT_FRAMES - 6, CUT_FRAMES + 10, easeIO);
  const url = sp(frame, CUT_FRAMES + 6, 14, 160);
  return (
    <>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 45%, rgba(27,18,64,0.62), rgba(16,10,40,0.95))", opacity: card }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 640, display: "flex", justifyContent: "center", opacity: card, scale: String(interpolate(card, [0, 1], [0.9, 1.2]) + 0.0006 * Math.max(0, frame - CUT_FRAMES)), filter: "drop-shadow(0 4px 18px rgba(8,4,24,0.55))" }}>
        <Sequence from={CUT_FRAMES - 6} layout="none"><LogoReveal at={0} width={440} revealDur={18} shineDur={28} /></Sequence>
      </div>
      <div style={{ position: "absolute", left: 60, right: 60, top: 930, textAlign: "center", opacity: url, translate: `0px ${(1 - url) * 16}px`, ...TYPE, fontSize: 50, color: W, lineHeight: 1.12 }}>Every conversation about a referral,<br />in one place.</div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 1080, textAlign: "center", opacity: url, ...TYPE, fontSize: 40, color: YELLOW }}>toothreferral.com</div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 1860, textAlign: "center", opacity: url * 0.6, fontFamily: FONT_UI, fontSize: 18, color: W }}>Dashboard values are illustrative demo data. Names are fictional.</div>
    </>
  );
};

const Grain: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ pointerEvents: "none", opacity: 0.08, mixBlendMode: "overlay" }}>
      <svg width={1080} height={1920}>
        <filter id="b2-grain"><feTurbulence type="fractalNoise" baseFrequency={0.85} numOctaves={2} seed={frame % 24} stitchTiles="stitch" /><feColorMatrix type="saturate" values="0" /></filter>
        <rect width={1080} height={1920} filter="url(#b2-grain)" />
      </svg>
    </AbsoluteFill>
  );
};

// soft UI sounds only, low under the voices (no whooshes, no music)
const SFX = (): { f: number; s: string; v: number }[] => [
  { f: T.email - 3, s: "pop-1", v: 0.07 }, { f: T.voicemail - 3, s: "pop-2", v: 0.07 }, { f: T.fax - 3, s: "pop-3", v: 0.07 }, { f: T.none, s: "tick-2", v: 0.06 },
  { f: T.patient - 2, s: "blip-1", v: 0.06 }, { f: T.out - 2, s: "tick-1", v: 0.06 }, { f: T.holidays - 2, s: "tick-3", v: 0.06 },
  { f: T.old - 2, s: "thud", v: 0.1 }, { f: T.tooth - 8, s: "shimmer", v: 0.08 }, { f: SPLIT[0], s: "click", v: 0.08 },
  { f: T.one2 - 4, s: "pop-2", v: 0.07 }, { f: T.place - 2, s: "chime", v: 0.07 },
  { f: T.xrays - 2, s: "tick-1", v: 0.07 }, { f: T.insurance - 2, s: "tick-2", v: 0.07 }, { f: T.messages - 2, s: "tick-3", v: 0.07 }, { f: T.status1 - 2, s: "tick-4", v: 0.07 },
  { f: T.greg - 2, s: "pop-3", v: 0.07 }, { f: T.status2, s: "tick-1", v: 0.07 }, { f: T.message, s: "blip-2", v: 0.07 },
  { f: T.ran - 2, s: "chime", v: 0.07 }, { f: SPLIT[1], s: "click", v: 0.07 }, { f: CUT_FRAMES - 4, s: "shimmer", v: 0.09 },
];

export const BuriedInEmails2: React.FC = () => {
  const frame = useCurrentFrame();
  const f0 = Math.min(frame, CUT_FRAMES - 1);
  const k = splitK(f0);
  const cam = camera(f0);
  const dy = k * SHIFT[segAt(f0)];
  const endBlur = interpolate(frame, [CUT_FRAMES - 6, CUT_FRAMES + 10], [0, 14], clamp);
  const video = (
    <OffthreadVideo src={staticFile("footage/b2-cut.mp4")} muted style={{ position: "absolute", left: 0, top: 0, width: 1080, height: 1920, transformOrigin: cam.origin, transform: `scale(${cam.s})` }} />
  );
  return (
    <AbsoluteFill style={{ background: BG }}>
      <FontGate>
        <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 22%, #2A1B5E, ${BG} 70%)` }} />
        <AbsoluteFill style={{ filter: endBlur > 0 ? `blur(${endBlur}px)` : undefined }}>
          {/* footage band: one solid shape that slides down, rounded top corners only in split mode, no hairline borders */}
          <AbsoluteFill style={{ translate: `0px ${dy}px`, overflow: "hidden", borderTopLeftRadius: 40 * k, borderTopRightRadius: 40 * k, boxShadow: k > 0.01 ? `0 -16px 50px rgba(0,0,0,${0.45 * k})` : undefined }}>
            {frame >= CUT_FRAMES - 1 ? <Freeze frame={CUT_FRAMES - 2}>{video}</Freeze> : video}
            <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(8,6,20,0) 66%, rgba(8,6,20,0.42) 100%)" }} />
          </AbsoluteFill>
          <Beats />
          <Panel k={k} />
          <Callouts k={k} />
        </AbsoluteFill>
        <OldWay />
        <Replace />
        <Captions k={k} />
        <EndCard />
        <Grain />
      </FontGate>
      <Audio src={staticFile("audio/voice/b2-voice.wav")} />
      {SFX().map((x, i) => (
        <Sequence key={i} from={x.f} durationInFrames={45} layout="none"><Audio src={staticFile(`audio/sfx/${x.s}.wav`)} volume={x.v} /></Sequence>
      ))}
    </AbsoluteFill>
  );
};
