/**
 * "The Website PDF Dead End": ToothReferral short, edited to its script's turn from problem to fix.
 *
 *   0  the confession (wry)          title "the digital dead end", a website referral form + PDF, "modern." struck
 *   1  the black hole (ominous)      one-way digital = black hole: the form is pulled into a vortex; /effects
 *                                    spotlight drops the room dark with BLACK HOLE behind him; an endless loader;
 *                                    files scatter; the front desk's hours count up; missing details
 *   2  the shift (decisive)          one-way arrow turns two-way; ToothReferral; a two-way engine; the live status
 *                                    dashboard while /effects apple-toggles flips each feature on as he names it
 *   3  the close (confident)         the old form gets stamped DEAD END; toothreferral.com | connect at a higher
 *                                    level; /effects glitter-spotlight GROWTH; end card
 *
 * One continuous take: eight takes colour-matched (scripts/match_grade.py), cut with natural pauses
 * (scripts/cut_by_words.py), joins hidden with morph cuts (scripts/morph_cuts.py), one continuous camera move, one
 * voice (ElevenLabs speech-to-speech, timing kept to the frame). The three /effects are baked into the footage
 * (src/data/pd-effects.json -> footage/pd-fx.webm); while one plays, nothing is drawn behind the speaker.
 * Captions follow the Chocolate Box style. Demo data; practice and patient names are fictional.
 */
import React from "react";
import { AbsoluteFill, Audio, Freeze, Sequence, interpolate, spring, staticFile, useCurrentFrame } from "remotion";
import { FontGate, TALENT, TalentLayer, type Framing } from "../effects";
import transcript from "../data/transcript-pd.json";
import cut from "../data/pd-cut-segments.json";
import fx from "../data/pd-effects.json";
import { FONT_UI } from "../theme";
import { LogoReveal, easeIO, easeOut, ramp } from "../tr/motion";
import { ICON, Icon, TR, clamp } from "../tr/ui";

const TL = TALENT["pd-cut"];
const FPS = 30;
const CUT_FRAMES = Math.round(cut.duration * FPS);
const TAIL = 75;
export const PD_DURATION = CUT_FRAMES + TAIL;

// ---------------------------------------------------------------------------------------------------
// Look

const YELLOW = "#F3DD72";
const RED = "#FF5A5F";
const INK = "#16131F";
const W = "#FFFFFF";
const TYPE: React.CSSProperties = { fontFamily: FONT_UI, fontWeight: 800, letterSpacing: "-0.045em", lineHeight: 0.98 };
const SOFT = "0 2px 16px rgba(10,6,24,0.5), 0 1px 3px rgba(10,6,24,0.45)";
const CARD: React.CSSProperties = { background: "#fff", borderRadius: 30, boxShadow: "0 28px 70px rgba(10,6,30,0.35), 0 2px 6px rgba(10,6,30,0.12)", fontFamily: FONT_UI, color: INK };

// ---------------------------------------------------------------------------------------------------
// Timing

const WORDS = transcript["pd-cut"].words;
const norm = (w: string) => w.toLowerCase().replace(/[^a-z0-9]/g, "");
const at = (word: string, n = 1) => {
  const hits = WORDS.filter((w) => norm(w.word) === word);
  if (!hits[n - 1]) throw new Error(`"${word}" #${n} not in transcript`);
  return Math.round(hits[n - 1].start * FPS);
};
const sp = (frame: number, a: number, damping = 15, stiffness = 160) =>
  frame < a ? 0 : spring({ frame: frame - a, fps: FPS, config: { damping, stiffness, mass: 0.75 } });
/** Visibility window: spring in at `from`, quick blur-out ending at `to`. */
const win = (frame: number, from: number, to: number, outLen = 8) => ({
  p: sp(frame, from),
  out: interpolate(frame, [to - outLen, to], [0, 1], clamp),
  on: frame >= from - 1 && frame <= to,
});

const T = {
  referral: at("referral", 1),
  pdf: at("pdf"),
  meant: at("meant"),
  modern: at("modern"),
  heres: at("heres"),
  truth: at("truth"),
  stat: at("static"),
  deadEnd: at("dead", 1),
  submitted: at("submitted"),
  black: at("black"),
  waits: at("waits"),
  dark: at("dark"),
  files: at("files"),
  misplaced: at("misplaced"),
  front: at("front"),
  hours: at("hours"),
  chasing: at("chasing"),
  missing: at("missing"),
  details: at("details"),
  manually: at("manually"),
  shift: at("shift"),
  one: at("one", 1),
  two: at("two", 1),
  tooth1: at("toothreferral", 1),
  active: at("active"),
  engine1: at("engine", 1),
  referring: at("referring"),
  real: at("real"),
  progress: at("progress"),
  automated: at("automated"),
  transfers: at("transfers"),
  phone: at("phone"),
  stop: at("stop"),
  kill: at("kill"),
  momentum: at("momentum"),
  upgrade: at("upgrade"),
  tooth2: at("toothreferral", 2),
  pipeline: at("pipeline"),
  growth: at("growth"),
};

/** The /effects windows baked into the footage, in frames. Nothing is drawn behind the speaker inside them. */
const FX = fx.effects.map((e) => ({ fx: e.fx, from: Math.round(e.start * FPS), to: Math.round(e.end * FPS) }));
const fxAt = (frame: number) => FX.find((e) => frame >= e.from && frame < e.to);
const TOGGLES = FX.find((e) => e.fx === "apple-toggles")!;

// ---------------------------------------------------------------------------------------------------
// Camera: one continuous eased move for the whole film (never a framing jump; the joins are morph cuts).

const FACE = { x: 373, y: 622 };
const onFace = (s: number): Framing => ({ scale: s, x: FACE.x * 1.5 - FACE.x * s, y: FACE.y * 1.5 - FACE.y * s });
const CAMERA: [number, number][] = [
  [0, 1.5],
  [T.meant, 1.56], // "...meant we were modern."
  [T.stat, 1.53],
  [FX[0].from, 1.6], // pushing into the dark
  [FX[0].to, 1.6],
  [T.front, 1.54],
  [T.manually, 1.58],
  [T.shift, 1.52], // pulls back for the shift: an arrival
  [T.engine1, 1.55],
  [TOGGLES.from, 1.5], // wide while the toggles card sits under his chin
  [TOGGLES.to, 1.5],
  [T.upgrade, 1.56],
  [FX[2].from, 1.6],
  [CUT_FRAMES, 1.66], // the close
];
const framingAt = (frame: number): Framing => {
  let i = 0;
  while (i + 2 < CAMERA.length && CAMERA[i + 1][0] <= frame) i++;
  const [a, sa] = CAMERA[i];
  const [b, sb] = CAMERA[i + 1];
  return onFace(sa + (sb - sa) * easeIO(interpolate(frame, [a, b], [0, 1], clamp)));
};

// ---------------------------------------------------------------------------------------------------
// Captions (the Chocolate Box style: lowercase heavy grotesk, built word by word on the chest)

type Tok = { t: string; at: number; end: number };
const TOKS: Tok[] = (() => {
  const out: Tok[] = [];
  for (const w of WORDS) {
    const t = w.word.trim().replace(/^offices\?$/i, "offices");
    const prev = out[out.length - 1];
    if (prev && (t.startsWith("-") || t.startsWith(".com"))) {
      prev.t = prev.t + t;
      prev.end = Math.round(w.end * FPS);
      continue;
    }
    out.push({ t, at: Math.round(w.start * FPS), end: Math.round(w.end * FPS) });
  }
  return out.map((x) => ({ ...x, t: x.t.toLowerCase() }));
})();
type Chunk = { words: Tok[]; from: number; to: number };
const CHUNKS: Chunk[] = (() => {
  const chunks: Chunk[] = [];
  let cur: Tok[] = [];
  const flush = () => {
    if (cur.length) chunks.push({ words: cur, from: cur[0].at - 1, to: cur[cur.length - 1].end + 10 });
    cur = [];
  };
  for (const tk of TOKS) {
    const len = cur.map((x) => x.t).join(" ").length;
    if (cur.length && (cur.length >= 3 || len + tk.t.length > 19)) flush();
    cur.push(tk);
    if (/[.,?!]$/.test(tk.t)) flush();
  }
  flush();
  for (let i = 0; i < chunks.length - 1; i++) chunks[i].to = Math.min(chunks[i].to, chunks[i + 1].from);
  return chunks;
})();

const Captions: React.FC = () => {
  const frame = useCurrentFrame();
  const c = CHUNKS.find((x) => frame >= x.from && frame < x.to);
  if (!c) return null;
  const out = interpolate(frame, [c.to - 4, c.to], [0, 1], clamp);
  // while the toggles card sits under his chin, the caption rides in the gap between chin and card
  const up = frame >= TOGGLES.from - 2 && frame < TOGGLES.to;
  return (
    <div style={{ position: "absolute", left: 60, right: 60, top: up ? 1262 : 1440, textAlign: "center", ...TYPE, fontSize: up ? 60 : 70, color: W, textShadow: SOFT, opacity: 1 - out, filter: out > 0 ? `blur(${out * 6}px)` : undefined }}>
      {c.words.map((w, i) => {
        const k = interpolate(frame, [w.at - 2, w.at + 3], [0, 1], clamp);
        return (
          <span key={i} style={{ display: "inline-block", marginRight: i < c.words.length - 1 ? "0.24em" : 0, opacity: k, translate: `0px ${(1 - k) * 10}px`, filter: k < 1 ? `blur(${(1 - k) * 5}px)` : undefined }}>
            {w.t}
          </span>
        );
      })}
    </div>
  );
};

// ---------------------------------------------------------------------------------------------------
// Type pieces

/** A huge word behind the head (the speaker cutout sits in front of it). */
const BigWord: React.FC<{ from: number; to: number; text: string; size?: number; color?: string; top?: number; strikeAt?: number; count?: { to: number; suffix?: string; dur?: number } }> = ({
  from,
  to,
  text,
  size = 220,
  color = YELLOW,
  top = 300,
  strikeAt,
  count,
}) => {
  const frame = useCurrentFrame();
  const { p, out, on } = win(frame, from, to, 9);
  if (!on) return null;
  let shown = text;
  if (count) {
    const v = count.to * easeOut(interpolate(frame, [from, from + (count.dur ?? 30)], [0, 1], clamp));
    shown = Math.round(v) + (count.suffix ?? "");
  }
  const strike = strikeAt !== undefined ? ramp(frame, strikeAt, strikeAt + 8, easeOut) : 0;
  return (
    <div style={{ position: "absolute", left: -60, right: -60, top, display: "flex", justifyContent: "center", opacity: Math.min(1, p * 1.6) * (1 - out), filter: p < 0.7 ? `blur(${(0.7 - p) * 18}px)` : out > 0 ? `blur(${out * 12}px)` : undefined }}>
      <div style={{ position: "relative", ...TYPE, fontSize: size, color, fontVariantNumeric: "tabular-nums", scale: String(interpolate(p, [0, 1], [1.14, 1])), textShadow: "0 8px 40px rgba(10,6,24,0.25)" }}>
        {shown}
        {strike > 0 && <div style={{ position: "absolute", left: -10, top: "52%", height: size * 0.09, width: `${strike * 104}%`, background: RED, borderRadius: 8, rotate: "-4deg", boxShadow: "0 4px 18px rgba(10,6,24,0.3)" }} />}
      </div>
    </div>
  );
};

/** A stop sign, drawn (no emoji), for the title. */
const StopSign: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 100 100">
    <polygon points="30,2 70,2 98,30 98,70 70,98 30,98 2,70 2,30" fill="#E5383B" stroke="#fff" strokeWidth={6} />
    <rect x={24} y={44} width={52} height={12} rx={4} fill="#fff" />
  </svg>
);

/** Opening title, two lines as in the caption reference: small line with one yellow word, big line below. */
const OpeningTitle: React.FC<{ to: number }> = ({ to }) => {
  const frame = useCurrentFrame();
  const a = sp(frame, 2, 15, 150);
  const b = sp(frame, 8, 14, 140);
  const s = sp(frame, 16, 10, 200);
  const out = interpolate(frame, [to - 8, to], [0, 1], clamp);
  if (frame > to) return null;
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: 150, textAlign: "center", opacity: 1 - out, filter: out > 0 ? `blur(${out * 10}px)` : undefined }}>
      <div style={{ ...TYPE, fontSize: 50, color: W, textShadow: SOFT, opacity: a, translate: `0px ${(1 - a) * 16}px` }}>
        the <span style={{ color: YELLOW }}>digital</span>
      </div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 24 }}>
        <div style={{ ...TYPE, fontSize: 150, color: W, textShadow: SOFT, opacity: Math.min(1, b * 1.5), scale: String(interpolate(b, [0, 1], [1.1, 1])), filter: b < 0.7 ? `blur(${(0.7 - b) * 18}px)` : undefined }}>dead end.</div>
        <div style={{ scale: String(s), rotate: `${(1 - s) * -40}deg`, filter: "drop-shadow(0 10px 24px rgba(10,6,24,0.45))" }}>
          <StopSign size={110} />
        </div>
      </div>
    </div>
  );
};

/** A script overlay as a small label: dark pill, one yellow part. */
const Label: React.FC<{ from: number; to: number; top?: number; children: React.ReactNode }> = ({ from, to, top = 96, children }) => {
  const frame = useCurrentFrame();
  const { p, out, on } = win(frame, from, to, 8);
  if (!on) return null;
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top, display: "flex", justifyContent: "center", opacity: Math.min(1, p * 1.5) * (1 - out), translate: `0px ${(1 - p) * -20}px` }}>
      <div style={{ padding: "14px 28px", borderRadius: 999, background: "rgba(16,12,30,0.78)", border: "1.5px solid rgba(255,255,255,0.16)", ...TYPE, letterSpacing: "-0.025em", fontSize: 40, color: W, whiteSpace: "nowrap", boxShadow: "0 14px 34px rgba(10,6,24,0.35)" }}>{children}</div>
    </div>
  );
};

// ---------------------------------------------------------------------------------------------------
// 0  the confession: the website referral form (and its PDF)

const Field: React.FC<{ label: string; w?: number; k: number }> = ({ label, w = 100, k }) => (
  <div style={{ marginTop: 12, opacity: Math.min(1, k * 2), translate: `0px ${(1 - k) * 10}px` }}>
    <div style={{ fontSize: 17, fontWeight: 700, color: "#8A8799" }}>{label}</div>
    <div style={{ height: 36, width: `${w}%`, borderRadius: 10, border: "2px solid #E7E5EE", background: "#FAFAFC", marginTop: 5 }} />
  </div>
);

/** A practice website's "Refer a patient" form with a PDF to download. Also comes back, stamped, at the end. */
const FormCard: React.FC<{ from: number; to: number; stampAt?: number }> = ({ from, to, stampAt }) => {
  const frame = useCurrentFrame();
  const { p, out, on } = win(frame, from, to, 9);
  if (!on) return null;
  const pdf = sp(frame, Math.max(from, T.pdf - 4), 12, 190);
  const stamp = stampAt !== undefined ? sp(frame, stampAt, 9, 220) : 0;
  return (
    <div style={{ position: "absolute", left: 230, top: 70, width: 620, opacity: Math.min(1, p * 1.5) * (1 - out), translate: `0px ${(1 - p) * -40}px`, rotate: "-1.5deg", filter: out > 0 ? `blur(${out * 8}px)` : undefined }}>
      <div style={{ ...CARD, overflow: "hidden" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "14px 18px", background: "#F1F0F5", borderBottom: "1px solid #E7E5EE" }}>
          {["#FF5F57", "#FEBC2E", "#28C840"].map((c) => (
            <div key={c} style={{ width: 13, height: 13, borderRadius: 7, background: c }} />
          ))}
          <div style={{ marginLeft: 12, flex: 1, padding: "6px 14px", borderRadius: 8, background: "#fff", fontSize: 16, color: "#8A8799" }}>yourpractice.com/refer</div>
        </div>
        <div style={{ padding: "18px 26px 24px" }}>
          <div style={{ fontSize: 30, fontWeight: 800, letterSpacing: "-0.02em" }}>Refer a patient</div>
          <Field label="Patient name" k={sp(frame, from + 4)} />
          <Field label="Reason for referral" k={sp(frame, from + 8)} />
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 18 }}>
            <div style={{ padding: "12px 26px", borderRadius: 12, background: "#2F6BFF", color: W, fontSize: 20, fontWeight: 800 }}>Submit</div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 14px", borderRadius: 12, border: "2px solid #E7E5EE", scale: String(pdf), opacity: Math.min(1, pdf * 2) }}>
              <div style={{ width: 30, height: 36, borderRadius: 5, background: RED, color: W, fontSize: 11, fontWeight: 900, display: "flex", alignItems: "flex-end", justifyContent: "center", paddingBottom: 4 }}>PDF</div>
              <div style={{ fontSize: 18, fontWeight: 700 }}>referral-form.pdf</div>
            </div>
          </div>
        </div>
      </div>
      {stamp > 0 && (
        <div style={{ position: "absolute", left: "50%", top: "52%", translate: "-50% -50%", padding: "10px 26px", border: `7px solid ${RED}`, color: RED, borderRadius: 14, ...TYPE, letterSpacing: "0.02em", fontSize: 70, rotate: "-12deg", scale: String(interpolate(stamp, [0, 1], [2.2, 1])), opacity: Math.min(1, stamp * 2), background: "rgba(255,255,255,0.86)", whiteSpace: "nowrap" }}>DEAD END</div>
      )}
    </div>
  );
};

// ---------------------------------------------------------------------------------------------------
// 1  the black hole

/** A vortex: rotating spiral arms around a black core with a warm accretion ring. Spins as it should (it is the
 * subject), and on "submitted" the static form flies down the arrow into it, spiralling and shrinking. */
const BlackHole: React.FC = () => {
  const frame = useCurrentFrame();
  const from = T.stat - 4;
  const to = FX[0].from + 4;
  const { p, on } = win(frame, from, to, 10);
  if (!on) return null;
  // hand-off to the dark room: the vortex swells and fades as the spotlight drops the lights
  const swell = ramp(frame, to - 14, to, easeIO);
  const rot = (frame - from) * 4.2;
  const pull = ramp(frame, T.submitted, T.black + 4, easeIO);
  const cx = 760;
  const cy = 250;
  const formX = interpolate(pull, [0, 1], [140, cx]);
  const formY = interpolate(pull, [0, 1], [250, cy]) - Math.sin(pull * Math.PI) * 60;
  const arrow = ramp(frame, T.deadEnd - 6, T.deadEnd + 8, easeOut);
  return (
    <AbsoluteFill style={{ opacity: Math.min(1, p * 1.5) * (1 - swell * 0.9) }}>
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <radialGradient id="bh-core">
            <stop offset="0%" stopColor="#000" />
            <stop offset="34%" stopColor="#05030C" />
            <stop offset="48%" stopColor="#FF9A4A" stopOpacity={0.95} />
            <stop offset="56%" stopColor="#7A3CFF" stopOpacity={0.55} />
            <stop offset="100%" stopColor="#120A2A" stopOpacity={0} />
          </radialGradient>
        </defs>
        {/* the one-way arrow from the form to the hole */}
        <line x1={250} y1={250} x2={250 + (cx - 150 - 250) * arrow} y2={250} stroke={W} strokeWidth={8} strokeLinecap="round" strokeDasharray="2 18" opacity={0.9} />
        {arrow > 0.95 && <path d={`M${cx - 168} 232 L${cx - 140} 250 L${cx - 168} 268`} fill="none" stroke={W} strokeWidth={8} strokeLinecap="round" strokeLinejoin="round" />}
        <g transform={`translate(${cx} ${cy}) scale(${(0.6 + 0.4 * p) * (1 + swell * 2.2)})`}>
          <circle r={130} fill="url(#bh-core)" />
          {[0, 1, 2, 3, 4].map((k) => (
            <path
              key={k}
              d="M0 -22 C 40 -30, 80 -10, 112 30 C 90 4, 46 -10, 0 -22 Z"
              fill={k % 2 ? "#B78CFF" : "#FFB36B"}
              opacity={0.55}
              transform={`rotate(${rot + k * 72})`}
            />
          ))}
          <circle r={44} fill="#000" />
          <circle r={46} fill="none" stroke="#FFC48A" strokeWidth={2} opacity={0.8} />
        </g>
      </svg>
      {/* the form being pulled in */}
      <div style={{ position: "absolute", left: formX - 95, top: formY - 60, width: 190, height: 120, scale: String(1 - pull * 0.92), rotate: `${pull * 540}deg`, opacity: 1 - ramp(frame, T.black, T.black + 6) }}>
        <div style={{ ...CARD, borderRadius: 16, width: "100%", height: "100%", padding: "14px 16px" }}>
          <div style={{ fontSize: 19, fontWeight: 800 }}>Static form</div>
          {[0, 1].map((i) => (
            <div key={i} style={{ height: 14, borderRadius: 5, background: "#EDEBF3", marginTop: 10, width: i ? "60%" : "90%" }} />
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
};

/** "The patient waits in the dark": a loader that never finishes. */
const Loader: React.FC = () => {
  const frame = useCurrentFrame();
  const { p, out, on } = win(frame, T.waits - 4, FX[0].to + 2, 8);
  if (!on) return null;
  const days = Math.min(9, 1 + Math.floor((frame - T.waits) / 9));
  return (
    <div style={{ position: "absolute", left: 40, top: 640, display: "flex", alignItems: "center", gap: 14, padding: "14px 22px", borderRadius: 999, background: "rgba(16,12,30,0.82)", border: "1.5px solid rgba(255,255,255,0.14)", opacity: Math.min(1, p * 1.5) * (1 - out), translate: `${(1 - p) * -40}px 0px` }}>
      <svg width={40} height={40} viewBox="0 0 40 40" style={{ rotate: `${(frame - T.waits) * 14}deg` }}>
        <circle cx={20} cy={20} r={16} fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth={5} />
        <path d="M20 4 A16 16 0 0 1 36 20" fill="none" stroke={W} strokeWidth={5} strokeLinecap="round" />
      </svg>
      <div style={{ fontFamily: FONT_UI, color: W }}>
        <div style={{ fontSize: 24, fontWeight: 800 }}>waiting for a reply…</div>
        <div style={{ fontSize: 18, color: "rgba(255,255,255,0.6)", fontVariantNumeric: "tabular-nums" }}>day {days}</div>
      </div>
    </div>
  );
};

/** "Files get misplaced": a stack of referral files spills and tumbles out of frame. */
const FilesScatter: React.FC = () => {
  const frame = useCurrentFrame();
  const from = T.files - 4;
  const { p, on } = win(frame, from, T.front + 4, 8);
  if (!on) return null;
  const files = [
    { n: "x-ray.pdf", vx: -330, vy: 120, r: -38 },
    { n: "insurance.pdf", vx: -90, vy: 260, r: 22 },
    { n: "referral.pdf", vx: 160, vy: 200, r: -18 },
    { n: "notes.pdf", vx: 360, vy: 140, r: 34 },
  ];
  const k = ramp(frame, T.misplaced - 2, T.front + 4, (t) => t * t);
  return (
    <AbsoluteFill style={{ opacity: Math.min(1, p * 2) }}>
      {files.map((f, i) => (
        <div
          key={f.n}
          style={{ position: "absolute", left: 470 + i * 8 + f.vx * k, top: 200 - i * 10 + f.vy * k + 900 * k * k, rotate: `${(i - 1.5) * 5 + f.r * k}deg`, display: "flex", alignItems: "center", gap: 10, padding: "12px 16px", ...CARD, borderRadius: 16 }}
        >
          <div style={{ width: 28, height: 34, borderRadius: 5, background: RED, color: W, fontSize: 10, fontWeight: 900, display: "flex", alignItems: "flex-end", justifyContent: "center", paddingBottom: 4 }}>PDF</div>
          <div style={{ fontSize: 20, fontWeight: 700 }}>{f.n}</div>
        </div>
      ))}
    </AbsoluteFill>
  );
};

/** "...chasing down missing details manually": the details the form never asked for, flagged one by one. */
const Missing: React.FC = () => {
  const frame = useCurrentFrame();
  const { p, out, on } = win(frame, T.chasing - 2, T.shift - 6, 8);
  if (!on) return null;
  const items = [
    { t: "x-ray", a: T.missing - 2 },
    { t: "insurance", a: T.details - 2 },
    { t: "date of birth", a: T.manually - 2 },
  ];
  return (
    <div style={{ position: "absolute", left: 40, top: 600, width: 300, opacity: Math.min(1, p * 1.5) * (1 - out), translate: `${(1 - p) * -40}px 0px`, filter: out > 0 ? `blur(${out * 8}px)` : undefined }}>
      <div style={{ ...CARD, padding: "16px 20px" }}>
        <div style={{ fontSize: 20, fontWeight: 800, color: "#8A8799" }}>Front desk · to chase</div>
        {items.map((it) => {
          const k = sp(frame, it.a, 12, 220);
          return (
            <div key={it.t} style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 10, opacity: Math.min(1, k * 2) }}>
              <div style={{ width: 28, height: 28, borderRadius: 14, background: RED, color: W, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: 900, scale: String(k) }}>?</div>
              <div style={{ fontSize: 22, fontWeight: 700 }}>{it.t}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------------------------------
// 2  the shift

/** One-way arrow that becomes two-way on "two-way". */
const ShiftArrow: React.FC = () => {
  const frame = useCurrentFrame();
  const { p, out, on } = win(frame, T.one - 6, T.tooth1 - 4, 8);
  if (!on) return null;
  const back = sp(frame, T.two - 2, 12, 200);
  const node = (label: string, x: number, hl: boolean) => (
    <div style={{ position: "absolute", left: x, top: 200, translate: "-50% -50%", padding: "14px 26px", borderRadius: 999, background: hl ? YELLOW : W, color: INK, ...TYPE, letterSpacing: "-0.03em", fontSize: 38, boxShadow: "0 14px 34px rgba(10,6,24,0.35)", whiteSpace: "nowrap" }}>{label}</div>
  );
  return (
    <AbsoluteFill style={{ opacity: Math.min(1, p * 1.5) * (1 - out), filter: out > 0 ? `blur(${out * 8}px)` : undefined }}>
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        <line x1={330} y1={186} x2={330 + 420 * ramp(frame, T.one - 4, T.one + 10, easeOut)} y2={186} stroke={W} strokeWidth={8} strokeLinecap="round" />
        <path d="M728 168 L752 186 L728 204" fill="none" stroke={W} strokeWidth={8} strokeLinecap="round" strokeLinejoin="round" opacity={ramp(frame, T.one + 6, T.one + 10)} />
        {back > 0 && (
          <>
            <line x1={750} y1={218} x2={750 - 420 * back} y2={218} stroke={YELLOW} strokeWidth={8} strokeLinecap="round" />
            <path d="M352 200 L328 218 L352 236" fill="none" stroke={YELLOW} strokeWidth={8} strokeLinecap="round" strokeLinejoin="round" opacity={Math.min(1, back * 1.5)} />
          </>
        )}
      </svg>
      {node("GP office", 230, false)}
      {node("you", 850, back > 0.5)}
    </AbsoluteFill>
  );
};

/** "...an active communication engine": dots flowing both ways between the GP and you. */
const EngineLink: React.FC = () => {
  const frame = useCurrentFrame();
  const { p, out, on } = win(frame, T.active - 6, T.referring - 2, 8);
  if (!on) return null;
  const node = (label: string, x: number, hl: boolean) => (
    <div style={{ position: "absolute", left: x, top: 330, translate: "-50% -50%", padding: "12px 24px", borderRadius: 999, background: hl ? TR.purple : W, color: hl ? W : INK, ...TYPE, letterSpacing: "-0.03em", fontSize: 34, boxShadow: "0 14px 34px rgba(10,6,24,0.35)", whiteSpace: "nowrap" }}>{label}</div>
  );
  return (
    <AbsoluteFill style={{ opacity: Math.min(1, p * 1.5) * (1 - out) }}>
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        <line x1={330} y1={318} x2={750} y2={318} stroke="rgba(255,255,255,0.4)" strokeWidth={4} />
        <line x1={330} y1={342} x2={750} y2={342} stroke="rgba(255,255,255,0.4)" strokeWidth={4} />
        {[0, 1, 2, 3].map((k) => {
          const t = (((frame - T.active) / 26 + k / 4) % 1 + 1) % 1;
          return (
            <React.Fragment key={k}>
              <circle cx={330 + 420 * t} cy={318} r={8} fill={YELLOW} />
              <circle cx={750 - 420 * t} cy={342} r={8} fill="#B78CFF" />
            </React.Fragment>
          );
        })}
      </svg>
      {node("GP office", 230, false)}
      {node("toothreferral", 850, true)}
    </AbsoluteFill>
  );
};

/** "Referring offices get real-time status tracking...": the live status dashboard above his head. */
const Dashboard: React.FC = () => {
  const frame = useCurrentFrame();
  const { p, out, on } = win(frame, T.referring - 4, T.stop - 4, 9);
  if (!on) return null;
  const steps = [
    { t: "Received", a: T.referring + 6 },
    { t: "Scheduled", a: T.real - 2 },
    { t: "Records in", a: T.transfers - 2 },
    { t: "Treated", a: T.phone - 2 },
  ];
  const pulse = 0.5 + 0.5 * Math.cos((frame - T.referring) / 7);
  return (
    <div style={{ position: "absolute", left: 140, top: 60, width: 800, opacity: Math.min(1, p * 1.5) * (1 - out), translate: `0px ${(1 - p) * -40}px`, filter: out > 0 ? `blur(${out * 8}px)` : undefined }}>
      <div style={{ ...CARD, padding: "20px 26px 22px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ fontSize: 22, fontWeight: 800, color: TR.purple, letterSpacing: "-0.01em" }}>ToothReferral · live status</div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 17, fontWeight: 800, color: "#1F9D55" }}>
            <div style={{ width: 11, height: 11, borderRadius: 6, background: "#22C55E", boxShadow: `0 0 ${6 + 10 * pulse}px #22C55E` }} />
            LIVE
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginTop: 8 }}>
          <div style={{ fontSize: 30, fontWeight: 800, letterSpacing: "-0.02em" }}>Maria Alvarez</div>
          <div style={{ fontSize: 19, color: "#8A8799" }}>referred by Dr. Lee · endo</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 16 }}>
          {steps.map((s, i) => {
            const k = sp(frame, s.a, 12, 220);
            return (
              <React.Fragment key={s.t}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, width: 120 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 20, background: k > 0.5 ? TR.purple : "#E7E5EE", display: "flex", alignItems: "center", justifyContent: "center", scale: String(1 + 0.15 * Math.sin(Math.PI * Math.min(1, k))), boxShadow: k > 0.5 ? `0 0 18px ${TR.purple}88` : undefined }}>
                    {k > 0.5 && <Icon d={ICON.check} size={22} color={W} />}
                  </div>
                  <div style={{ fontSize: 18, fontWeight: 700, color: k > 0.5 ? INK : "#A9A6B8" }}>{s.t}</div>
                </div>
                {i < steps.length - 1 && <div style={{ flex: 1, height: 5, borderRadius: 3, marginBottom: 26, background: `linear-gradient(90deg, ${TR.purple} ${ramp(frame, steps[i].a, steps[i + 1].a) * 100}%, #E7E5EE 0)` }} />}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------------------------------
// 3  the close

/** Script overlay "Toothreferral.com | Connect at a Higher Level". */
const UrlLabel: React.FC = () => {
  const frame = useCurrentFrame();
  const { p, out, on } = win(frame, T.upgrade - 2, FX[2].from + 2, 9);
  if (!on) return null;
  const tag = sp(frame, T.tooth2 + 4, 13, 170);
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: 120, display: "flex", flexDirection: "column", alignItems: "center", gap: 18, opacity: Math.min(1, p * 1.5) * (1 - out), filter: out > 0 ? `blur(${out * 8}px)` : undefined }}>
      <div style={{ filter: "drop-shadow(0 4px 18px rgba(8,4,24,0.55))" }}>
        <Sequence from={T.upgrade - 2} layout="none">
          <LogoReveal at={0} width={420} revealDur={18} shineDur={28} />
        </Sequence>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 0, borderRadius: 999, overflow: "hidden", boxShadow: "0 14px 34px rgba(10,6,24,0.4)", scale: String(interpolate(tag, [0, 1], [0.85, 1])), opacity: Math.min(1, tag * 2) }}>
        <div style={{ padding: "14px 24px", background: YELLOW, color: INK, ...TYPE, letterSpacing: "-0.025em", fontSize: 36 }}>toothreferral.com</div>
        <div style={{ padding: "14px 24px", background: "rgba(16,12,30,0.85)", color: W, ...TYPE, letterSpacing: "-0.025em", fontSize: 36 }}>connect at a higher level</div>
      </div>
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
      <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 45%, rgba(27,18,64,0.55), rgba(16,10,40,0.92))`, opacity: card }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 640, display: "flex", justifyContent: "center", opacity: card, scale: String(interpolate(card, [0, 1], [0.9, 1.2])), filter: "drop-shadow(0 4px 18px rgba(8,4,24,0.55))" }}>
        <Sequence from={CUT_FRAMES - 6} layout="none">
          <LogoReveal at={0} width={440} revealDur={18} shineDur={28} />
        </Sequence>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 960, textAlign: "center", opacity: url, translate: `0px ${(1 - url) * 16}px`, ...TYPE, fontSize: 52, color: W, letterSpacing: "-0.03em" }}>toothreferral.com</div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 1030, textAlign: "center", opacity: url, ...TYPE, fontSize: 34, color: "rgba(255,255,255,0.7)", letterSpacing: "-0.02em", fontWeight: 700 }}>connect at a higher level</div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 1120, display: "flex", justifyContent: "center", opacity: Math.min(1, btn * 1.5), scale: String(interpolate(btn, [0, 1], [0.8, 1])) }}>
        <div style={{ padding: "22px 40px", borderRadius: 22, background: YELLOW, color: INK, ...TYPE, letterSpacing: "-0.03em", fontSize: 40, boxShadow: "0 16px 40px rgba(10,6,24,0.45)" }}>upgrade to two-way →</div>
      </div>
    </>
  );
};

// ---------------------------------------------------------------------------------------------------
// The edit

/** Static mask of the mic and the laptop edge (camera locked off); keeps them in front of graphics behind him. */
const MIC: React.CSSProperties = {
  maskImage: `url(${staticFile("cutouts/pd-cut-mic.png")})`,
  WebkitMaskImage: `url(${staticFile("cutouts/pd-cut-mic.png")})`,
  maskSize: "100% 100%",
  WebkitMaskSize: "100% 100%",
};

export const PdfDeadEnd: React.FC = () => {
  const frame = useCurrentFrame();
  const f0 = Math.min(frame, CUT_FRAMES - 1);
  const fr = framingAt(f0);
  const freeze = frame >= CUT_FRAMES - 1;
  // one grade over the whole film, on top of the per-take colour match
  const grade: React.CSSProperties = { filter: "contrast(1.05) saturate(1.06) brightness(1.01)" };
  const speaker = (layer: "full" | "cutout", style?: React.CSSProperties) => {
    const el = <TalentLayer talent={TL} layer={layer} framing={fr} style={{ ...grade, ...style }} />;
    return freeze ? <Freeze frame={CUT_FRAMES - 2}>{el}</Freeze> : el;
  };
  // inside a baked /effects window the footage already carries its own depth (text behind him): no extra layers
  const inFx = !!fxAt(f0);
  const endBlur = interpolate(frame, [CUT_FRAMES - 6, CUT_FRAMES + 10], [0, 14], clamp);
  return (
    <AbsoluteFill style={{ background: "#0F0B1C" }}>
      <FontGate>
        <AbsoluteFill style={{ filter: endBlur > 0 ? `blur(${endBlur}px)` : undefined }}>
          {speaker("full")}
          {/* behind the speaker */}
          <BigWord from={T.modern - 4} to={T.stat - 6} text="modern." strikeAt={T.truth} />
          <BlackHole />
          <FilesScatter />
          <BigWord from={T.hours - 4} to={T.shift - 6} text="hours" size={200} top={330} count={{ to: 3, suffix: " hrs", dur: 26 }} />
          <ShiftArrow />
          <BigWord from={T.two + 2} to={T.tooth1 - 4} text="two-way." size={200} top={330} />
          <EngineLink />
          <BigWord from={T.momentum - 3} to={T.upgrade - 6} text="momentum." size={180} top={330} />
          {!inFx && speaker("cutout")}
          {!inFx && speaker("full", MIC)}
        </AbsoluteFill>
        {/* in front */}
        <OpeningTitle to={T.referral - 4} />
        <FormCard from={T.referral - 4} to={T.meant} />
        <Label from={T.stat - 4} to={FX[0].from - 2}>
          one-way digital = <span style={{ color: YELLOW }}>black hole</span>
        </Label>
        <Loader />
        <Missing />
        <Label from={T.shift - 4} to={T.tooth1 - 4} top={60}>
          shift to digital <span style={{ color: YELLOW }}>two-way</span>
        </Label>
        <Sequence from={T.tooth1 - 4} durationInFrames={T.active - T.tooth1 - 2} layout="none">
          <div style={{ position: "absolute", left: 0, right: 0, top: 130, display: "flex", justifyContent: "center", filter: "drop-shadow(0 4px 18px rgba(8,4,24,0.55))" }}>
            <LogoReveal at={0} width={480} revealDur={18} shineDur={28} />
          </div>
        </Sequence>
        <Dashboard />
        <FormCard from={T.stop - 4} to={T.momentum + 4} stampAt={T.kill} />
        <UrlLabel />
        {frame < CUT_FRAMES - 4 && <Captions />}
        <EndCard />
        {/* finish: a soft vignette over everything */}
        <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 42%, transparent 55%, rgba(8,5,18,0.38) 100%)", pointerEvents: "none" }} />
      </FontGate>

      <Audio src={staticFile("audio/voice/pd-cut.wav")} />
      <Audio src={staticFile("audio/music/cb-bed.ogg")} volume={(f) => 0.07 * interpolate(f, [0, 20, FX[0].from - 10, FX[0].from, FX[0].to, FX[0].to + 15, PD_DURATION - 45, PD_DURATION - 1], [0, 1, 1, 0.45, 0.45, 1, 1, 0], clamp)} />
      {[
        { f: 2, s: "impact", v: 0.16 },
        { f: 16, s: "pop-1", v: 0.12 },
        { f: T.referral - 4, s: "whoosh-short", v: 0.12 },
        { f: T.pdf - 4, s: "pop-2", v: 0.12 },
        { f: T.modern - 4, s: "pop-3", v: 0.12 },
        { f: T.truth, s: "click", v: 0.16 },
        { f: T.stat - 4, s: "whoosh-short", v: 0.12 },
        { f: T.deadEnd - 6, s: "riser", v: 0.1 },
        { f: T.submitted, s: "whoosh-long", v: 0.16 },
        { f: T.black + 4, s: "thud", v: 0.18 },
        { f: FX[0].from, s: "flatline", v: 0.06 },
        { f: T.waits - 4, s: "blip-1", v: 0.12 },
        { f: T.files - 4, s: "whoosh-short", v: 0.12 },
        { f: T.misplaced, s: "thud", v: 0.1 },
        { f: T.hours - 4, s: "tick-1", v: 0.12 },
        { f: T.missing - 2, s: "blip-2", v: 0.12 },
        { f: T.details - 2, s: "blip-2", v: 0.12 },
        { f: T.manually - 2, s: "blip-3", v: 0.12 },
        { f: T.one - 4, s: "whoosh-short", v: 0.12 },
        { f: T.two - 2, s: "pop-1", v: 0.14 },
        { f: T.tooth1 - 4, s: "shimmer", v: 0.16 },
        { f: T.active - 6, s: "chime", v: 0.1 },
        { f: T.referring - 4, s: "whoosh-short", v: 0.1 },
        { f: TOGGLES.from + 30, s: "tick-2", v: 0.14 },
        { f: TOGGLES.from + 66, s: "tick-3", v: 0.14 },
        { f: TOGGLES.from + 162, s: "tick-4", v: 0.14 },
        { f: T.phone - 2, s: "chime", v: 0.12 },
        { f: T.stop - 4, s: "whoosh-short", v: 0.12 },
        { f: T.kill, s: "impact", v: 0.18 },
        { f: T.upgrade - 2, s: "shimmer", v: 0.14 },
        { f: T.tooth2 + 4, s: "pop-2", v: 0.12 },
        { f: FX[2].from, s: "riser", v: 0.1 },
        { f: T.growth, s: "shimmer", v: 0.16 },
        { f: CUT_FRAMES - 6, s: "whoosh-long", v: 0.16 },
      ].map((x, i) => (
        <Sequence key={i} from={Math.max(0, x.f)} layout="none">
          <Audio src={staticFile(`audio/sfx/${x.s}.wav`)} volume={x.v} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
