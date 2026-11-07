/**
 * "Buried in Emails": ToothReferral short (Script 13). Two front-desk colleagues: Tanya lost 20 referrals in her inbox,
 * Amanda shows her ToothReferral. Ten Google Flow clips, colour-matched, cut at the pauses into one scene
 * (scratchpad s13/cut.py), both voices matched to one reference each (Seed-VC), answered on the real dashboard
 * (recording 3, cleaned per the client rules by scripts/client_stills_r3.py -> public/dash3c).
 *
 *   1  hook (full)            Tanya alone at the desk, Amanda walks in
 *   2  the problem (full)     "20 referrals" counter, emails piling up
 *   3  the chaos (full)       faxes, voicemails, inbox threads; then a close-up on Tanya (it also hides a continuity
 *                             slip in the generated take: Amanda's mug goes down on the desk and reappears in her hand)
 *   4  the old way (full)     the chips get stamped THE OLD WAY; the logo on "Tooth Referral?"
 *   5-10 the product (split)  dashboard panel on top, the two of them below: Incoming list, the network, the audit
 *                             trail, messages with the general dentist, administrative notes, X-rays and insurance
 *   10 call to action (full)  free trial, end card
 *
 * Every cut is a hard cut with a small jump zoom (no morphs: two people never morph cleanly).
 * Demo data; patients, offices and staff are fictional.
 */
import React from "react";
import { AbsoluteFill, Audio, Freeze, Img, OffthreadVideo, Sequence, interpolate, spring, staticFile, useCurrentFrame } from "remotion";
import transcript from "../data/transcript-s13.json";
import cut from "../data/s13-cut.json";
import { FontGate } from "../effects";
import { FONT_UI } from "../theme";
import { LogoReveal, easeIO, easeOut, ramp } from "../tr/motion";
import { ICON, Icon, TR, clamp } from "../tr/ui";

const FPS = 30;
const CUT_FRAMES = Math.round(cut.duration * FPS);
const TAIL = 75;
export const S13_DURATION = CUT_FRAMES + TAIL;

const YELLOW = "#F3DD72";
const AMBER = "#FFB020";
const AMBER_DK = "#E89D15";
const INK = "#16131F";
const W = "#FFFFFF";
const BG = "#0F0B1C";
const GREEN = "#1FA463";
const TYPE: React.CSSProperties = { fontFamily: FONT_UI, fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 0.98 };
const SOFT = "0 2px 16px rgba(10,6,24,0.55), 0 1px 3px rgba(10,6,24,0.5)";
const CARD: React.CSSProperties = { background: "#fff", borderRadius: 24, boxShadow: "0 24px 60px rgba(10,6,30,0.35), 0 2px 6px rgba(10,6,30,0.12)", fontFamily: FONT_UI, color: INK };

// ---------------------------------------------------------------------------------------------------
// Timing (frames of the cut), from the word timestamps

type Word = { word: string; start: number; end: number; who: string };
const WORDS = (transcript as unknown as { s13: { words: Word[] } }).s13.words;
const norm = (w: string) => w.toLowerCase().replace(/[^a-z0-9]/g, "");
const at = (word: string, n = 1) => {
  const hits = WORDS.filter((w) => norm(w.word) === word);
  if (!hits[n - 1]) throw new Error(`"${word}" #${n} not in transcript`);
  return Math.round(hits[n - 1].start * FPS);
};
const sp = (frame: number, a: number, damping = 15, stiffness = 160) =>
  frame < a ? 0 : spring({ frame: frame - a, fps: FPS, config: { damping, stiffness, mass: 0.75 } });
const win = (frame: number, from: number, to: number, outLen = 8) => ({ p: sp(frame, from), out: interpolate(frame, [to - outLen, to], [0, 1], clamp), on: frame >= from - 1 && frame <= to });

const T = {
  hey: at("hey", 1),
  twenty: at("20"),
  buried: at("buried"),
  emails: at("emails", 1),
  nobody: at("nobody"),
  faxes: at("faxes"),
  voicemails: at("voicemails"),
  inbox: at("inbox"),
  threads: at("threads"),
  frustrated: at("frustrated"),
  hey2: at("hey", 2),
  old: at("old"),
  why: at("why", 1),
  tooth2: at("tooth", 1),
  let: at("let"),
  centralized: at("centralized"),
  referrals3: at("referrals", 2),
  just: at("just", 2),
  network: at("network"),
  offices: at("offices"),
  coming: at("coming"),
  open: at("open"),
  audit: at("audit"),
  added: at("added"),
  changed: at("changed"),
  when: at("when"),
  everything: at("everything"),
  something: at("something"),
  message: at("message"),
  platform: at("platform"),
  no: at("no", 1),
  no2: at("no", 2),
  saves: at("saves"),
  team: at("team"),
  administrative: at("administrative"),
  inside2: at("inside", 2),
  single: at("single"),
  calling: at("calling"),
  patient2: at("patient", 2),
  everythings: at("everythings"),
  place: at("place"),
  free: at("free"),
  try: at("try"),
};

/** Joins (frames where one kept piece of a take meets the next). */
const JOINS = cut.segments.slice(1).map((s) => Math.round(s.at * FPS));

// ---------------------------------------------------------------------------------------------------
// Layout: full frame, or split (dashboard panel on top, the two of them in the band below)

const PANEL = 840;
const TA = [T.let - 14, T.let + 4] as const; // full -> split
const TF = [T.free - 4, T.free + 14] as const; // split -> full
const SPLIT_Y = 560; // the band shows source y 280..1360 (both faces) in output 840..1920
type Lay = { k: number; top: number; dashTop: number };
const layoutAt = (f: number): Lay => {
  const k = f < TF[0] ? ramp(f, TA[0], TA[1], easeIO) : 1 - ramp(f, TF[0], TF[1], easeIO);
  return { k, top: PANEL * k, dashTop: interpolate(k, [0, 1], [-PANEL - 40, 0]) };
};

/** The close-up on Tanya that hides the mug slip (clip 3, from just after "threads." to the end of the take). */
const CLOSE = [Math.round((cut.segments[3].at + (3.0 - cut.segments[3].in)) * FPS), Math.round(cut.segments[6].at * FPS)] as const;

/** Transition punches: a quick zoom with motion blur where the story turns (into the problem, into the close-up,
 *  into "the old way", into and out of the product). */
const PUNCHES = (): number[] => [JOINS[0], CLOSE[0], CLOSE[1], TA[0] + 2, TF[0] + 2];
const punchAt = (f: number) => PUNCHES().reduce((m, p) => (f >= p - 1 && f < p + 9 ? Math.max(m, Math.sin(((f - p + 1) / 10) * Math.PI)) : m), 0);

/** Camera: a slow push on the opening shot, the close-up, and a 6% jump zoom that flips on every join. */
const camera = (f: number, lay: Lay) => {
  let flips = 0;
  for (const j of JOINS) if (f >= j) flips++;
  const jump = flips % 2 ? 0.06 : 0;
  const open = f < JOINS[0] ? 0.05 * ramp(f, 0, JOINS[0], (t) => t) : 0;
  if (f >= CLOSE[0] && f < CLOSE[1]) return { s: 1.5 + jump, cx: 420, cy: 860, ty: 0 };
  return { s: 1 + open + jump * (1 - lay.k * 0.4), cx: 540, cy: 860, ty: SPLIT_Y * lay.k };
};

// ---------------------------------------------------------------------------------------------------
// Captions (word by word, sentence case, one key word marked)

const KEY = new Set(["20", "referrals", "emails", "frustrated", "old", "way", "toothreferral", "centralized", "network", "audit", "trail", "everything", "platform", "calls", "emails", "time", "administrative", "notes", "single", "place", "free", "trial"]);
type Tok = { t: string; at: number; end: number; key: boolean };
const TOKS: Tok[] = (() => {
  const out: Tok[] = [];
  for (const w of WORDS) {
    const t = w.word.trim();
    const prev = out[out.length - 1];
    if (prev && t.startsWith("-")) {
      prev.t += t;
      prev.end = Math.round(w.end * FPS);
      continue;
    }
    if (prev && prev.t.toLowerCase() === "tooth" && /^referral/i.test(t)) {
      prev.t = "ToothReferral" + t.slice(8);
      prev.end = Math.round(w.end * FPS);
      continue;
    }
    out.push({ t, at: Math.round(w.start * FPS), end: Math.round(w.end * FPS), key: false });
  }
  for (const o of out) o.key = KEY.has(norm(o.t));
  return out;
})();
const CHUNKS = (() => {
  const chunks: { words: Tok[]; from: number; to: number }[] = [];
  let cur: Tok[] = [];
  const flush = () => {
    if (cur.length) chunks.push({ words: cur, from: cur[0].at - 1, to: cur[cur.length - 1].end + 10 });
    cur = [];
  };
  for (const tk of TOKS) {
    const len = cur.map((x) => x.t).join(" ").length;
    if (cur.length && (cur.length >= 4 || len + tk.t.length > 22)) flush();
    cur.push(tk);
    if (/[.,?!:]$/.test(tk.t)) flush();
  }
  flush();
  for (let i = 0; i < chunks.length - 1; i++) chunks[i].to = Math.min(chunks[i].to, chunks[i + 1].from);
  return chunks;
})();

const Captions: React.FC<{ lay: Lay }> = ({ lay }) => {
  const frame = useCurrentFrame();
  const c = CHUNKS.find((x) => frame >= x.from && frame < x.to);
  if (!c || frame >= CUT_FRAMES - 4) return null;
  const out = interpolate(frame, [c.to - 4, c.to], [0, 1], clamp);
  const top = interpolate(lay.k, [0, 1], [1480, 1720]);
  return (
    <div style={{ position: "absolute", left: 50, right: 50, top, textAlign: "center", fontFamily: FONT_UI, fontWeight: 800, letterSpacing: "-0.025em", lineHeight: 1.12, fontSize: 60, color: W, textShadow: SOFT, opacity: 1 - out, filter: out > 0 ? `blur(${out * 6}px)` : undefined }}>
      {c.words.map((w, i) => {
        const k = interpolate(frame, [w.at - 2, w.at + 3], [0, 1], clamp);
        const hot = w.key && frame >= w.at;
        return (
          <span key={i} style={{ display: "inline-block", marginRight: i < c.words.length - 1 ? (hot ? "0.14em" : "0.22em") : 0, marginLeft: hot ? "-0.08em" : 0, opacity: k, translate: `0px ${(1 - k) * 10}px`, filter: k < 1 ? `blur(${(1 - k) * 5}px)` : undefined, padding: hot ? "0 0.14em" : undefined, borderRadius: 12, background: hot ? YELLOW : undefined, color: hot ? INK : W, textShadow: hot ? "none" : SOFT, boxShadow: hot ? "0 8px 24px rgba(10,6,24,0.35)" : undefined }}>
            {w.t}
          </span>
        );
      })}
    </div>
  );
};

// ---------------------------------------------------------------------------------------------------
// The dashboard panel (a screen recording look: camera moves, cursor, highlights, chips)

const PW = 1032;
const PH = PANEL - 48;
type Img2 = { src: string; w: number; h: number };
const D3 = (n: string): Img2 => ({ src: `dash3c/${n}.jpg`, w: 1920, h: 912 });
/** The canonical analytics page (reel/public/analytics-ref, same frames as renders/analytics-demo.mp4). */
const AN = (n: string, h = 868): Img2 => ({ src: `analytics-ref/stills/${n}.jpg`, w: 1904, h });
type Crop = { x: number; y: number; w: number };
type Map = (x: number, y: number) => readonly [number, number];
const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
const mapper = (c: Crop): Map => {
  const s = PW / c.w;
  return (x: number, y: number) => [(x - c.x) * s, (y - c.y) * s] as const;
};
type CK = [number, Crop];
const camAt = (frame: number, keys: CK[]): Crop => {
  if (frame <= keys[0][0]) return keys[0][1];
  for (let i = 0; i < keys.length - 1; i++) {
    const [a, ca] = keys[i];
    const [b, cb] = keys[i + 1];
    if (frame < b) {
      const k = easeIO(interpolate(frame, [a, b], [0, 1], clamp));
      return { x: lerp(ca.x, cb.x, k), y: lerp(ca.y, cb.y, k), w: lerp(ca.w, cb.w, k) };
    }
  }
  return keys[keys.length - 1][1];
};
type PK = [number, number, number];
const pathAt = (frame: number, keys: PK[]): [number, number] => {
  if (frame <= keys[0][0]) return [keys[0][1], keys[0][2]];
  for (let i = 0; i < keys.length - 1; i++) {
    const [a, xa, ya] = keys[i];
    const [b, xb, yb] = keys[i + 1];
    if (frame < b) {
      const k = easeIO(interpolate(frame, [a, b], [0, 1], clamp));
      return [lerp(xa, xb, k), lerp(ya, yb, k)];
    }
  }
  const l = keys[keys.length - 1];
  return [l[1], l[2]];
};

const Shot: React.FC<{ img: Img2; from: number; to: number; keys: CK[]; children?: (m: Map) => React.ReactNode }> = ({ img, from, to, keys, children }) => {
  const frame = useCurrentFrame();
  if (frame < from - 1 || frame > to + 9) return null;
  const c = camAt(frame, keys);
  const s = PW / c.w;
  // push transition: the next screen slides in from the right and pushes this one out to the left
  const inn = ramp(frame, from, from + 12, easeOut);
  const gone = ramp(frame, to, to + 9, easeIO);
  const x = (1 - inn) * PW * 0.9 - gone * PW * 0.35;
  const sc = interpolate(inn, [0, 1], [0.94, 1]) * interpolate(gone, [0, 1], [1, 0.94]);
  const blur = Math.max(1 - inn, gone) * 6;
  return (
    <AbsoluteFill style={{ translate: `${x}px 0px`, scale: String(sc), opacity: 1 - gone * 0.6, filter: blur > 0.2 ? `blur(${blur}px)` : undefined, background: TR.bg, boxShadow: inn < 1 ? "-30px 0 60px rgba(0,0,0,0.25)" : undefined }}>
      <Img src={staticFile(img.src)} style={{ position: "absolute", left: -c.x * s, top: -c.y * s, width: img.w * s, height: img.h * s, maxWidth: "none" }} />
      {children?.(mapper(c))}
    </AbsoluteFill>
  );
};

const Hl: React.FC<{ box: number[]; m: Map; k: number; color?: string; label?: string; labelSide?: "top" | "bottom"; fill?: boolean }> = ({ box, m, k, color = TR.purple, label, labelSide = "top", fill = true }) => {
  if (k <= 0) return null;
  const [x0, y0] = m(box[0], box[1]);
  const [x1, y1] = m(box[2], box[3]);
  const pad = 6;
  return (
    <div style={{ position: "absolute", left: x0 - pad, top: y0 - pad, width: x1 - x0 + 2 * pad, height: y1 - y0 + 2 * pad, borderRadius: 14, border: `4px solid ${color}`, background: fill ? `${color}1F` : undefined, opacity: Math.min(1, k * 1.6), scale: String(interpolate(k, [0, 1], [1.06, 1])), boxShadow: `0 0 0 6px ${color}22` }}>
      {label && (
        <div style={{ position: "absolute", left: 0, [labelSide === "top" ? "bottom" : "top"]: "calc(100% + 8px)", padding: "6px 14px", borderRadius: 999, background: color, color: color === YELLOW ? INK : W, fontFamily: FONT_UI, fontWeight: 800, fontSize: 26, whiteSpace: "nowrap" }}>{label}</div>
      )}
    </div>
  );
};

const Mouse: React.FC<{ path: PK[]; clicks: number[]; m: Map; show: [number, number] }> = ({ path, clicks, m, show }) => {
  const frame = useCurrentFrame();
  if (frame < show[0] || frame > show[1]) return null;
  const vis = ramp(frame, show[0], show[0] + 6) * (1 - ramp(frame, show[1] - 6, show[1]));
  const [x, y] = m(...pathAt(frame, path));
  const press = clicks.reduce((p, c) => (frame >= c && frame < c + 8 ? Math.max(p, Math.sin(((frame - c) / 8) * Math.PI)) : p), 0);
  return (
    <div style={{ position: "absolute", left: 0, top: 0, opacity: vis }}>
      {clicks.map((c) => {
        const k = ramp(frame, c, c + 16, easeOut);
        if (frame < c || k >= 1) return null;
        const [cx, cy] = m(...pathAt(c, path));
        return <div key={c} style={{ position: "absolute", left: cx - 40, top: cy - 40, width: 80, height: 80, borderRadius: 40, border: `5px solid ${TR.purple}`, background: `${TR.purple}22`, scale: String(0.3 + k * 1.3), opacity: 1 - k }} />;
      })}
      <svg width={46} height={54} viewBox="0 0 22 26" style={{ position: "absolute", left: x - 4, top: y - 2, scale: String(1 - 0.16 * press), transformOrigin: "4px 2px", filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.35))" }}>
        <path d="M2 2 L2 20 L7 15 L11 24 L14 22.5 L10 14 L17 14 Z" fill={INK} stroke={W} strokeWidth={1.6} strokeLinejoin="round" />
      </svg>
    </div>
  );
};

const I = {
  fax: "M6 9V2h12v7M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2M6 14h12v8H6z",
  voicemail: "M5.5 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM18.5 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM5.5 15.5h13",
  mail: "M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zM22 6l-10 7L2 6",
  x: "M18 6 6 18M6 6l12 12",
  lock: "M5 11h14v10H5zM8 11V7a4 4 0 0 1 8 0v4",
  net: "M12 5a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM5 23a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM19 23a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM12 5v6M12 11l-6 8M12 11l6 8",
  clock: "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM12 6v6l4 2",
};

const DashPanel: React.FC<{ lay: Lay }> = ({ lay }) => {
  const frame = useCurrentFrame();
  if (lay.k <= 0.001) return null;
  const S_LIST = TA[0];
  const S_NET = T.just - 4;
  const S_AN = T.offices - 2;
  const S_LOG = T.open - 6;
  const S_MSG = T.something - 10;
  const S_NOTE = T.team - 14;
  const S_XRAY = T.calling - 10;
  const S_INS = T.everythings - 8;
  const S_ALL = T.place - 2;
  const S_END = TF[1];
  return (
    <div style={{ position: "absolute", left: 24, top: lay.dashTop + 24, width: PW, height: PH, borderRadius: 30, overflow: "hidden", background: TR.bg, boxShadow: "0 24px 60px rgba(0,0,0,0.45)", border: "1.5px solid rgba(255,255,255,0.18)", filter: lay.k > 0.02 && lay.k < 0.98 ? `blur(${(Math.sin(lay.k * Math.PI) * 5).toFixed(1)}px)` : undefined }}>
      {/* one centralized system: the Incoming list */}
      <Shot img={D3("r3c-incoming")} from={S_LIST} to={S_NET} keys={[[S_LIST, { x: 380, y: 130, w: 1520 }], [T.centralized, { x: 380, y: 130, w: 1520 }], [T.centralized + 30, { x: 430, y: 300, w: 1420 }]]}>
        {(m) => (
          <>
            {[[440, 398, 1836, 486], [440, 532, 1836, 650], [440, 672, 1836, 770], [440, 800, 1836, 895]].map((b, i) => (
              <Hl key={i} box={b} m={m} k={sp(frame, T.centralized + 6 + i * 5, 14, 200) * (1 - ramp(frame, T.referrals3 + 12, T.referrals3 + 20))} fill />
            ))}
            <Mouse path={[[S_LIST + 4, 1300, 700], [T.centralized + 20, 1000, 440], [S_NET, 1000, 450]]} clicks={[]} m={m} show={[S_LIST + 6, S_NET]} />
          </>
        )}
      </Shot>
      {/* the network: the referring office is a connected network member */}
      <Shot img={D3("r3c-referral-source")} from={S_NET} to={S_AN} keys={[[S_NET, { x: 400, y: 60, w: 1080 }], [T.network - 8, { x: 400, y: 470, w: 760 }]]}>
        {(m) => (
          <>
            <Hl box={[386, 660, 612, 732]} m={m} k={sp(frame, T.network, 12, 200)} color={GREEN} />
          </>
        )}
      </Shot>
      {/* "so the referrals keep coming": the analytics page, volume up and the network's top sender */}
      <Shot img={AN("an-kpis-senders")} from={S_AN} to={S_LOG} keys={[[S_AN, { x: 380, y: 0, w: 1520 }], [T.coming, { x: 390, y: 10, w: 1000 }]]}>
        {(m) => (
          <>
            <Hl box={[392, 22, 732, 246]} m={m} k={sp(frame, S_AN + 8, 12, 220)} color={GREEN} fill={false} />
            <Hl box={[420, 370, 1190, 408]} m={m} k={sp(frame, T.coming - 6, 12, 220)} color={GREEN} />
            <Mouse path={[[S_AN + 6, 1100, 300], [T.coming - 4, 900, 390]]} clicks={[]} m={m} show={[S_AN + 8, S_LOG]} />
          </>
        )}
      </Shot>
      {/* the audit trail */}
      <Shot img={D3("r3c-activity-log")} from={S_LOG} to={S_MSG} keys={[[S_LOG, { x: 400, y: 0, w: 1080 }], [T.audit, { x: 400, y: 90, w: 800 }]]}>
        {(m) => (
          <>
            <Hl box={[412, 251, 900, 283]} m={m} k={sp(frame, T.added - 2, 12, 220)} />
            <Hl box={[412, 208, 870, 239]} m={m} k={sp(frame, T.changed - 2, 12, 220)} color={AMBER_DK} />
            <Mouse path={[[S_LOG + 4, 1000, 120], [T.added, 760, 268], [T.changed, 760, 224], [T.when, 600, 330]]} clicks={[]} m={m} show={[S_LOG + 6, S_MSG]} />
          </>
        )}
      </Shot>
      {/* messages with the referring general dentist */}
      <Shot img={D3("r3c-messages")} from={S_MSG} to={S_NOTE} keys={[[S_MSG, { x: 340, y: 290, w: 1400 }], [T.message, { x: 720, y: 360, w: 960 }]]}>
        {(m) => (
          <>
            <Hl box={[798, 430, 1600, 498]} m={m} k={sp(frame, T.message, 12, 220) * (1 - ramp(frame, T.platform + 6, T.platform + 12))} />
            <Hl box={[798, 505, 1480, 568]} m={m} k={sp(frame, T.platform, 12, 220)} color={GREEN} />
          </>
        )}
      </Shot>
      {/* administrative notes */}
      <Shot img={D3("r3c-admin-notes")} from={S_NOTE} to={S_XRAY} keys={[[S_NOTE, { x: 1000, y: 380, w: 900 }], [T.administrative, { x: 1360, y: 470, w: 540 }]]}>
        {(m) => (
          <>
            <Hl box={[1396, 496, 1832, 590]} m={m} k={sp(frame, T.administrative - 2, 12, 220)} />
            <Hl box={[1412, 672, 1834, 846]} m={m} k={sp(frame, T.inside2 - 2, 12, 220)} color={GREEN} fill={false} />
          </>
        )}
      </Shot>
      {/* X-rays */}
      <Shot img={D3("r3c-status-xrays")} from={S_XRAY} to={S_INS} keys={[[S_XRAY, { x: 380, y: 430, w: 1000 }], [T.patient2, { x: 380, y: 520, w: 820 }]]}>
        {(m) => <Hl box={[398, 546, 826, 864]} m={m} k={sp(frame, T.patient2 - 2, 12, 220)} />}
      </Shot>
      {/* insurance, front and back */}
      <Shot img={D3("r3c-insurance")} from={S_INS} to={S_ALL} keys={[[S_INS, { x: 380, y: 220, w: 960 }]]}>
        {(m) => (
          <>
            <Hl box={[402, 332, 1292, 772]} m={m} k={sp(frame, T.everythings, 12, 220)} color={GREEN} />
          </>
        )}
      </Shot>
      {/* "everything's in one place": a slow pass down the whole analytics page */}
      <Shot img={AN("an-full-page", 4785)} from={S_ALL} to={S_END} keys={[[S_ALL, { x: 330, y: 0, w: 1574 }], [S_END, { x: 330, y: 1500, w: 1574 }]]} />
    </div>
  );
};

/** Callouts: chips in the strip just under the dashboard panel (over the wall behind the two of them), so they never
 *  cover the screenshot's own text. One group at a time, centred. */
type Call = { from: number; to: number; chips: { t: string; c: string; i: string; at?: number }[] };
const CALLS = (): Call[] => [
  { from: T.centralized + 12, to: T.just - 6, chips: [{ t: "every referral, one place", c: TR.purple, i: ICON.inbox }] },
  { from: T.network + 6, to: T.open - 8, chips: [{ t: "one shared network", c: GREEN, i: I.net }, { t: "more referrals", c: TR.purple, i: ICON.check, at: T.coming - 4 }] },
  { from: T.added - 2, to: T.changed - 4, chips: [{ t: "who added the X-rays", c: TR.purple, i: ICON.check }] },
  { from: T.changed - 2, to: T.when - 4, chips: [{ t: "who changed the status", c: AMBER_DK, i: ICON.check }] },
  { from: T.when - 2, to: T.something - 12, chips: [{ t: "every step, time-stamped", c: GREEN, i: I.clock }] },
  { from: T.message, to: T.no - 4, chips: [{ t: "message the general dentist", c: TR.purple, i: ICON.chat }] },
  { from: T.no - 2, to: T.saves - 4, chips: [{ t: "No phone calls", c: AMBER_DK, i: I.x }, { t: "No emails", c: AMBER_DK, i: I.x, at: T.no2 - 2 }] },
  { from: T.saves - 2, to: T.team - 16, chips: [{ t: "saves both offices time", c: GREEN, i: I.clock }] },
  { from: T.administrative - 2, to: T.inside2 - 4, chips: [{ t: "Administrative Notes", c: TR.purple, i: ICON.check }] },
  { from: T.inside2 - 2, to: T.calling - 12, chips: [{ t: "private to your team", c: TR.purple, i: I.lock }] },
  { from: T.patient2 - 2, to: T.everythings - 6, chips: [{ t: "X-rays on the referral", c: TR.purple, i: ICON.check }] },
  { from: T.everythings - 4, to: T.place - 4, chips: [{ t: "insurance, front and back", c: GREEN, i: ICON.check }] },
  { from: T.place - 2, to: TF[0] + 2, chips: [{ t: "everything in one place", c: TR.purple, i: ICON.check }] },
];
const Callouts: React.FC<{ lay: Lay }> = ({ lay }) => {
  const frame = useCurrentFrame();
  if (lay.k < 0.5) return null;
  const g = CALLS().find((c) => frame >= c.from - 1 && frame <= c.to + 6);
  if (!g) return null;
  const out = ramp(frame, g.to, g.to + 6);
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: lay.dashTop + 24 + PH + 22, display: "flex", justifyContent: "center", gap: 14, opacity: 1 - out }}>
      {g.chips.map((c) => {
        const k = sp(frame, c.at ?? g.from, 12, 230);
        if (k <= 0) return null;
        return (
          <div key={c.t} style={{ scale: String(k), display: "flex", alignItems: "center", gap: 10, padding: "12px 24px 12px 14px", borderRadius: 999, background: c.c, color: W, fontFamily: FONT_UI, fontWeight: 800, fontSize: 32, whiteSpace: "nowrap", boxShadow: "0 14px 30px rgba(0,0,0,0.3)" }}>
            <div style={{ width: 38, height: 38, borderRadius: 19, background: "rgba(255,255,255,0.25)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Icon d={c.i} size={22} color={W} />
            </div>
            {c.t}
          </div>
        );
      })}
    </div>
  );
};

// ---------------------------------------------------------------------------------------------------
// The story beats over the footage (full frame)

const Chip: React.FC<{ icon: string; text: string; k: number; color?: string; strike?: number }> = ({ icon, text, k, color = W, strike = 0 }) => (
  <div style={{ position: "relative", scale: String(k), display: "flex", alignItems: "center", gap: 12, padding: "14px 26px 14px 14px", borderRadius: 999, background: "rgba(16,12,30,0.88)", border: "1.5px solid rgba(255,255,255,0.16)", boxShadow: "0 14px 34px rgba(10,6,24,0.4)", fontFamily: FONT_UI, fontWeight: 800, fontSize: 34, color: W, whiteSpace: "nowrap" }}>
    <div style={{ width: 52, height: 52, borderRadius: 26, background: color, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <Icon d={icon} size={28} color={INK} />
    </div>
    {text}
    {strike > 0 && <div style={{ position: "absolute", left: 14, top: "50%", height: 7, width: `calc(${strike * 100}% - 28px)`, background: AMBER, borderRadius: 4, rotate: "-3deg" }} />}
  </div>
);

const Opening: React.FC = () => {
  const frame = useCurrentFrame();
  const { p, out, on } = win(frame, 6, T.hey - 2, 10);
  if (!on) return null;
  return (
    <div style={{ position: "absolute", left: 60, top: 150, opacity: Math.min(1, p * 1.5) * (1 - out), translate: `0px ${(1 - p) * 20}px`, fontFamily: FONT_UI, color: W, textShadow: SOFT }}>
      <div style={{ fontSize: 26, fontWeight: 800, letterSpacing: "0.16em", color: YELLOW }}>MONDAY · 8:14 AM</div>
      <div style={{ ...TYPE, fontSize: 52, marginTop: 8 }}>The front desk.</div>
    </div>
  );
};

/** "We lost 20 referrals this month... buried in a pile of emails" */
const Lost: React.FC = () => {
  const frame = useCurrentFrame();
  const from = T.twenty - 4;
  const { p, out, on } = win(frame, from, T.faxes - 4, 9);
  if (!on) return null;
  const n = Math.round(ramp(frame, from, from + 14, easeOut) * 20);
  const pile = ramp(frame, T.buried - 4, T.emails + 6, (t) => t);
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: 150, display: "flex", flexDirection: "column", alignItems: "center", gap: 8, opacity: 1 - out, filter: out > 0 ? `blur(${out * 8}px)` : undefined }}>
      <div style={{ ...TYPE, fontSize: 170, color: AMBER, scale: String(interpolate(p, [0, 1], [1.3, 1])), opacity: Math.min(1, p * 2), textShadow: "0 0 40px rgba(255,176,32,0.4), 0 6px 24px rgba(10,6,24,0.5)", fontVariantNumeric: "tabular-nums" }}>{n}</div>
      <div style={{ ...TYPE, fontSize: 44, color: W, textShadow: SOFT, opacity: Math.min(1, p * 2) }}>referrals lost this month</div>
      <div style={{ position: "relative", width: 520, height: 230, marginTop: 20 }}>
        {Array.from({ length: 8 }).map((_, i) => {
          const k = interpolate(pile * 8 - i, [0, 1], [0, 1], clamp);
          if (k <= 0) return null;
          const x = 60 + ((i * 97) % 340);
          const y = 150 - i * 16 + (1 - k) * -120;
          return (
            <div key={i} style={{ position: "absolute", left: x, top: y, rotate: `${((i * 37) % 24) - 12}deg`, opacity: Math.min(1, k * 2), ...CARD, borderRadius: 14, width: 170, padding: "12px 14px", display: "flex", gap: 10, alignItems: "center" }}>
              <Icon d={I.mail} size={26} color={TR.purple} />
              <div style={{ flex: 1 }}>
                <div style={{ height: 8, width: "80%", borderRadius: 4, background: "#D9D6E6" }} />
                <div style={{ height: 8, width: "55%", borderRadius: 4, background: "#ECEAF4", marginTop: 6 }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

/** "Faxes, voicemails, inbox threads" and, later, "That's the old way" */
const Chaos: React.FC = () => {
  const frame = useCurrentFrame();
  const show1 = frame >= T.faxes - 4 && frame < CLOSE[0] + 6;
  const show2 = frame >= T.old - 10 && frame < T.why + 10;
  if (!show1 && !show2) return null;
  const items = [
    { i: I.fax, t: "Faxes", at: T.faxes - 3 },
    { i: I.voicemail, t: "Voicemails", at: T.voicemails - 3 },
    { i: I.mail, t: "Inbox threads", at: T.inbox - 3 },
  ];
  const stamp = show2 ? sp(frame, T.old + 6, 11, 260) : 0;
  const opacity = show1 ? 1 - ramp(frame, CLOSE[0] - 4, CLOSE[0] + 4) : 1 - ramp(frame, T.why + 2, T.why + 10);
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: 170, display: "flex", flexDirection: "column", alignItems: "center", gap: 16, opacity }}>
      {items.map((x) => (
        <div key={x.t} style={{ opacity: 1 - 0.8 * stamp }}>
          <Chip icon={x.i} text={x.t} k={show1 ? sp(frame, x.at, 12, 220) : sp(frame, T.old - 10, 12, 220)} color={YELLOW} strike={show2 ? ramp(frame, T.old - 6, T.old + 2) : 0} />
        </div>
      ))}
      {stamp > 0 && (
        <div style={{ position: "absolute", top: 62, rotate: "-6deg", padding: "10px 26px", border: `7px solid ${TR.purple}`, color: TR.purple, borderRadius: 14, background: "rgba(255,255,255,0.94)", ...TYPE, fontSize: 66, letterSpacing: "0.01em", scale: String(interpolate(stamp, [0, 1], [2.2, 1])), opacity: Math.min(1, stamp * 2), boxShadow: "0 20px 50px rgba(10,6,24,0.35)" }}>THE OLD WAY</div>
      )}
    </div>
  );
};

/** "Why don't you use Tooth Referral?" -> the logo. */
const AskLogo: React.FC = () => {
  const frame = useCurrentFrame();
  const from = T.tooth2 - 6;
  const { p, out, on } = win(frame, from, TA[0] + 4, 8);
  if (!on) return null;
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: 170, display: "flex", justifyContent: "center", opacity: Math.min(1, p * 1.5) * (1 - out), translate: `0px ${(1 - p) * 40}px`, filter: "drop-shadow(0 4px 18px rgba(8,4,24,0.6))" }}>
      <Sequence from={from} layout="none">
        <LogoReveal at={0} width={460} revealDur={16} shineDur={26} />
      </Sequence>
    </div>
  );
};

/** "...they're offering a free trial. Why don't you try it?" */
const Cta: React.FC = () => {
  const frame = useCurrentFrame();
  const from = TF[1] - 2;
  const { p, out, on } = win(frame, from, CUT_FRAMES - 2, 8);
  if (!on) return null;
  const btn = sp(frame, T.try - 4, 12, 220);
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: 150, display: "flex", flexDirection: "column", alignItems: "center", gap: 22, opacity: 1 - out }}>
      <div style={{ opacity: Math.min(1, p * 1.5), translate: `0px ${(1 - p) * 30}px`, filter: "drop-shadow(0 4px 18px rgba(8,4,24,0.6))" }}>
        <Sequence from={from} layout="none">
          <LogoReveal at={0} width={420} revealDur={16} shineDur={26} />
        </Sequence>
      </div>
      {btn > 0 && <div style={{ scale: String(btn), padding: "18px 36px", borderRadius: 999, background: YELLOW, color: INK, ...TYPE, fontSize: 44, letterSpacing: "-0.025em", boxShadow: "0 14px 34px rgba(10,6,24,0.45)" }}>Start your free trial →</div>}
    </div>
  );
};

const EndCard: React.FC = () => {
  const frame = useCurrentFrame();
  if (frame < CUT_FRAMES - 8) return null;
  const card = ramp(frame, CUT_FRAMES - 6, CUT_FRAMES + 10, easeIO);
  const url = sp(frame, CUT_FRAMES + 6, 14, 160);
  const btn = sp(frame, CUT_FRAMES + 12, 13, 170);
  return (
    <>
      <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 45%, rgba(27,18,64,0.62), rgba(16,10,40,0.95))`, opacity: card }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 640, display: "flex", justifyContent: "center", opacity: card, scale: String(interpolate(card, [0, 1], [0.9, 1.2])), filter: "drop-shadow(0 4px 18px rgba(8,4,24,0.55))" }}>
        <Sequence from={CUT_FRAMES - 6} layout="none">
          <LogoReveal at={0} width={440} revealDur={18} shineDur={28} />
        </Sequence>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 960, textAlign: "center", opacity: url, translate: `0px ${(1 - url) * 16}px`, ...TYPE, fontSize: 52, color: W }}>toothreferral.com</div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 1030, textAlign: "center", opacity: url, ...TYPE, fontSize: 34, color: "rgba(255,255,255,0.72)", fontWeight: 700, letterSpacing: "-0.02em" }}>never lose a referral in your inbox again</div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 1120, display: "flex", justifyContent: "center", opacity: Math.min(1, btn * 1.5), scale: String(interpolate(btn, [0, 1], [0.8, 1])) }}>
        <div style={{ padding: "22px 40px", borderRadius: 22, background: YELLOW, color: INK, ...TYPE, fontSize: 40, letterSpacing: "-0.03em", boxShadow: "0 16px 40px rgba(10,6,24,0.45)" }}>Start your free trial →</div>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 1860, textAlign: "center", opacity: url * 0.6, fontFamily: FONT_UI, fontSize: 18, color: W }}>Dashboard values are illustrative demo data. Names are fictional.</div>
    </>
  );
};

const Grain: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ pointerEvents: "none", opacity: 0.09, mixBlendMode: "overlay" }}>
      <svg width={1080} height={1920}>
        <filter id="s13-grain">
          <feTurbulence type="fractalNoise" baseFrequency={0.85} numOctaves={2} seed={frame % 24} stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width={1080} height={1920} filter="url(#s13-grain)" />
      </svg>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------------------------------
// Sound effects: soft UI sounds only (no whooshes), low under the voices

const SFX = (): { f: number; s: string; v: number }[] => [
  { f: T.twenty - 4, s: "impact", v: 0.09 },
  ...[0, 3, 6, 9, 12].map((d) => ({ f: T.twenty - 4 + d, s: "tick-2", v: 0.045 })),
  ...[0, 5, 10, 15].map((d) => ({ f: T.buried - 2 + d, s: "pop-1", v: 0.045 })),
  { f: T.faxes - 3, s: "pop-2", v: 0.08 },
  { f: T.voicemails - 3, s: "pop-3", v: 0.08 },
  { f: T.inbox - 3, s: "pop-1", v: 0.08 },
  { f: CLOSE[0], s: "tick-1", v: 0.06 },
  { f: T.old - 6, s: "tick-3", v: 0.06 },
  { f: T.old + 6, s: "thud", v: 0.1 },
  { f: T.tooth2 - 6, s: "shimmer", v: 0.09 },
  { f: TA[0] + 2, s: "click", v: 0.09 },
  { f: T.centralized + 12, s: "pop-2", v: 0.08 },
  { f: T.just - 4, s: "tick-1", v: 0.07 },
  { f: T.network + 6, s: "chime", v: 0.08 },
  { f: T.coming - 4, s: "pop-3", v: 0.07 },
  { f: T.open - 6, s: "tick-1", v: 0.07 },
  { f: T.added - 2, s: "tick-2", v: 0.08 },
  { f: T.changed - 2, s: "tick-3", v: 0.08 },
  { f: T.when - 2, s: "pop-3", v: 0.07 },
  { f: T.something - 10, s: "tick-1", v: 0.07 },
  { f: T.message, s: "blip-1", v: 0.08 },
  { f: T.no - 2, s: "pop-1", v: 0.07 },
  { f: T.no2 - 2, s: "pop-2", v: 0.07 },
  { f: T.saves - 2, s: "chime", v: 0.08 },
  { f: T.team - 14, s: "tick-1", v: 0.07 },
  { f: T.administrative - 2, s: "pop-3", v: 0.07 },
  { f: T.inside2 - 2, s: "pop-1", v: 0.07 },
  { f: T.calling - 10, s: "tick-1", v: 0.07 },
  { f: T.patient2 - 2, s: "pop-2", v: 0.07 },
  { f: T.everythings - 8, s: "tick-1", v: 0.07 },
  { f: T.place - 2, s: "chime", v: 0.08 },
  { f: TF[0] + 2, s: "click", v: 0.08 },
  { f: T.try - 4, s: "pop-2", v: 0.09 },
  { f: CUT_FRAMES - 4, s: "shimmer", v: 0.1 },
];

// ---------------------------------------------------------------------------------------------------
// The edit

export const BuriedInEmails: React.FC = () => {
  const frame = useCurrentFrame();
  const f0 = Math.min(frame, CUT_FRAMES - 1);
  const lay = layoutAt(f0);
  const cam = camera(f0, lay);
  const endBlur = interpolate(frame, [CUT_FRAMES - 6, CUT_FRAMES + 10], [0, 14], clamp);
  const punch = punchAt(f0);
  const video = (
    <OffthreadVideo
      src={staticFile("footage/s13-cut.mp4")}
      muted
      style={{ position: "absolute", left: 0, top: 0, width: 1080, height: 1920, transformOrigin: `${cam.cx}px ${cam.cy}px`, transform: `translateY(${cam.ty}px) scale(${cam.s * (1 + 0.05 * punch)})`, filter: `contrast(1.04) saturate(1.03)${punch > 0.05 ? ` blur(${(punch * 7).toFixed(1)}px)` : ""}` }}
    />
  );
  const band: React.CSSProperties = { clipPath: `inset(${lay.top}px 0px 0px 0px round ${lay.k > 0.01 ? 30 : 0}px)` };
  return (
    <AbsoluteFill style={{ background: BG }}>
      <FontGate>
        <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 30%, #2A1B5E, ${BG} 70%)` }} />
        <AbsoluteFill style={{ filter: endBlur > 0 ? `blur(${endBlur}px)` : undefined }}>
          <AbsoluteFill style={band}>
            {frame >= CUT_FRAMES - 1 ? <Freeze frame={CUT_FRAMES - 2}>{video}</Freeze> : video}
            <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(10,6,24,0.30) 0%, transparent 22%, transparent 62%, rgba(10,6,24,0.42) 100%)" }} />
          </AbsoluteFill>
          <DashPanel lay={lay} />
          <Callouts lay={lay} />
          <Opening />
          <Lost />
          <Chaos />
          <AskLogo />
          <Cta />
        </AbsoluteFill>
        <Captions lay={lay} />
        <EndCard />
        <Grain />
        <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 42%, transparent 55%, rgba(8,5,18,0.34) 100%)", pointerEvents: "none" }} />
      </FontGate>

      <Audio src={staticFile("audio/voice/s13-cut.wav")} volume={(f) => interpolate(f, [CUT_FRAMES - 4, CUT_FRAMES + 4], [1, 0], clamp)} />
      {/* audio: the two ElevenLabs voices (speech-to-speech from the original takes, so timing and emotion are the
          originals') and soft UI sound effects; no music, no whooshes */}
      {SFX().map((x, i) => (
        <Sequence key={i} from={Math.max(0, x.f)} layout="none">
          <Audio src={staticFile(`audio/sfx/${x.s}.wav`)} volume={x.v} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
