/**
 * "Don't / Do" hand-gesture series: 12 Google Flow clips of the male host (public/gx/cNN.mp4, 8 s, 1080x1920) cut into one
 * take. On every "Don't…" line his right hand points to the top-left of the frame; on every "Do…" line his left hand points to
 * the top-right. Each pointing finger gets its own animation, anchored just above the tracked fingertip
 * (src/data/gx-anchors.json, MediaPipe hand landmarks smoothed):
 *   - Don't: a moving 3D amber scene of the old way (paper forms, faxes, phone tag, sticky notes…), built in CSS 3D.
 *   - Do: a 3D transparent glass card with the real Tooth Referral screens, coded in src/app/ and filmed by a camera that
 *     pans and zooms to the part the line talks about.
 * Silences are removed with speed ramps inside each clip (spoken lines at 1x, the lift / hand switch / return to rest
 * at 2.2-2.6x) and zoom-through seams between clips, so it plays as one flow. Voice: an ElevenLabs instant clone of
 * the host's own Flow voice (speech-to-speech, same timing).
 * Every card sits BEHIND the host: the person cutout (public/gx/cNN-cut.webm, RVM matte) is layered on top, so no graphic
 * ever covers his face, hands or body. Voice: ElevenLabs speech-to-speech (one voice, Chris) at the original timing.
 * Captions from faster-whisper word timings. Clip 12 is cut before the repeated "together".
 */
import React from "react";
import { AbsoluteFill, Audio, Img, OffthreadVideo, Sequence, interpolate, spring, staticFile, useCurrentFrame } from "remotion";
import anchorsJson from "../data/gx-anchors.json";
import wordsJson from "../data/gx-voice2-words.json";
import speechJson from "../data/gx-speech.json";
import { FontGate } from "../effects";
import { CaseDetailPage } from "../app/CaseDetail";
import { IncomingPage } from "../app/Incoming";
import { AnalyticsPage } from "../app/Analytics";
import { ConsultNoteModal } from "../app/ConsultNote";
import { LeadFormsPage } from "../app/LeadForms";

const FPS = 30;
const RF = (s: number) => Math.round(s * FPS);
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const F = "Inter, 'Plus Jakarta Sans', sans-serif";
const AMBER = "#FFB020", GREEN = "#22C58B", INK = "#16132B";

type Anchor = { t0: number; t1: number; pts: [number, number, number][] } | null;
const ANCH = anchorsJson as unknown as Record<string, { dont: Anchor; do: Anchor }>;
type Wd = { word: string; start: number; end: number };
const WORDS = wordsJson as unknown as Record<string, { words: Wd[] }>;

// ------------------------------------------------------------------ edit decision list
type Clip = { n: string; a: number; b: number; dont: string; dontLabel: string; doLabel: string; scene: DoScene };
type DoScene = { page: "incoming" | "case" | "messages" | "analytics" | "consult" | "leads"; cam: [number, number, number, number][]; h?: number };

const CLIPS: Clip[] = [
  { n: "01", a: 0.2, b: 7.7, dont: "forms", dontLabel: "The old way", doLabel: "Tooth Referral",
    scene: { page: "incoming", cam: [[0, 160, 150, 1.05], [0.45, 640, 560, 0.62], [1, 700, 610, 0.72]] } },
  { n: "02", a: 0.3, b: 7.7, dont: "fax", dontLabel: "Faxes · PDFs · Voicemails", doLabel: "Complete, X-rays attached",
    scene: { page: "case", h: 3053, cam: [[0, 900, 690, 0.62], [0.5, 640, 1560, 0.74], [1, 560, 1700, 0.86]] } },
  { n: "03", a: 0.3, b: 7.7, dont: "email", dontLabel: "Email chains", doLabel: "One case, both offices",
    scene: { page: "messages", cam: [[0, 980, 560, 0.66], [0.5, 1090, 700, 0.74], [1, 1100, 790, 0.82]] } },
  { n: "04", a: 0.3, b: 7.7, dont: "phone", dontLabel: "Phone tag", doLabel: "Every message on the case",
    scene: { page: "case", h: 3053, cam: [[0, 1620, 520, 0.8], [0.5, 1620, 640, 0.86], [1, 1620, 760, 0.9]] } },
  { n: "05", a: 0.3, b: 7.7, dont: "sticky", dontLabel: "Sticky notes", doLabel: "Every step logged",
    scene: { page: "case", h: 3053, cam: [[0, 1620, 1960, 0.78], [0.5, 1620, 2120, 0.84], [1, 780, 2980, 0.7]] } },
  { n: "06", a: 0.3, b: 7.7, dont: "photo", dontLabel: "Blurry card photos", doLabel: "Card requested · tracked",
    scene: { page: "case", h: 3053, cam: [[0, 1180, 2310, 0.86], [0.45, 840, 2520, 0.62], [1, 800, 2600, 0.7]] } },
  { n: "07", a: 0.3, b: 7.7, dont: "typing", dontLabel: "Typed by hand", doLabel: "Templates · e-signature",
    scene: { page: "consult", h: 869, cam: [[0, 700, 470, 0.66], [0.55, 760, 560, 0.7], [1, 1440, 780, 0.9]] } },
  { n: "08", a: 0.3, b: 7.7, dont: "triple", dontLabel: "Same data × 3", doLabel: "Enter once",
    scene: { page: "case", h: 3053, cam: [[0, 1060, 640, 0.66], [0.5, 1100, 700, 0.76], [1, 1120, 740, 0.82]] } },
  { n: "09", a: 0.3, b: 7.7, dont: "inbox", dontLabel: "Leads stuck in inboxes", doLabel: "Leads → your list",
    scene: { page: "incoming", cam: [[0, 1100, 160, 0.7], [0.45, 700, 640, 0.66], [1, 1150, 700, 0.8]] } },
  { n: "10", a: 0.3, b: 7.7, dont: "guess", dontLabel: "Gut feeling", doLabel: "Live analytics",
    scene: { page: "analytics", h: 1700, cam: [[0, 620, 520, 0.7], [0.5, 1000, 520, 0.66], [1, 820, 1180, 0.6]] } },
  { n: "11", a: 0.3, b: 7.7, dont: "hype", dontLabel: "Forms & AI hype", doLabel: "Two-way · HIPAA compliant",
    scene: { page: "messages", cam: [[0, 1100, 700, 0.62], [0.5, 1200, 760, 0.7], [1, 760, 560, 0.86]] } },
  { n: "12", a: 0.3, b: 6.5, dont: "chase", dontLabel: "Chasing referrals", doLabel: "Working them, together",
    scene: { page: "incoming", cam: [[0, 1100, 620, 0.62], [0.5, 900, 680, 0.66], [1, 700, 560, 0.74]] } },
];
/** Each clip becomes pieces: the spoken Don't and Do lines at normal speed, and the silent parts (the lift, the hand switch
 * between the two sides, the return to rest) speed-ramped, so the pauses disappear without a single jump cut. */
type Piece = { a: number; b: number; rate: number; f0: number; f1: number };
const SPEECH = speechJson as unknown as Record<string, { d0: number; d1: number; o0: number; o1: number }>;
const RAMP = { lead: 2.2, gap: 2.6, tail: 2.2 };
const SEGS = (() => {
  let at = 0;
  return CLIPS.map((c) => {
    const sp = SPEECH[c.n]; const end = c.n === "12" ? sp.o1 : c.b;
    const raw: [number, number, number][] = [[c.a, sp.d0, RAMP.lead], [sp.d0, sp.d1, 1], [sp.d1, sp.o0, RAMP.gap], [sp.o0, sp.o1, 1], [sp.o1, end, RAMP.tail]];
    const f0 = RF(at); const pieces: Piece[] = [];
    for (const [a, b, rate] of raw) { if (b - a < 0.02) continue; const p0 = RF(at); at += (b - a) / rate; pieces.push({ a, b, rate, f0: p0, f1: RF(at) }); }
    return { ...c, b: end, f0, f1: RF(at), pieces };
  });
})();
/** Clip time at global frame g inside segment s. */
const clipT = (s: (typeof SEGS)[number], g: number) => {
  const p = s.pieces.find((q) => g < q.f1) ?? s.pieces[s.pieces.length - 1];
  return p.a + ((g - p.f0) / FPS) * p.rate;
};
/** Global frame of clip time t inside segment s. */
const frameOf = (s: (typeof SEGS)[number], t: number) => {
  const p = s.pieces.find((q) => t < q.b) ?? s.pieces[s.pieces.length - 1];
  return p.f0 + RF((Math.max(p.a, t) - p.a) / p.rate);
};
const END_AT = SEGS[SEGS.length - 1].f1;
export const GX_DURATION = END_AT + RF(3.4);

// ------------------------------------------------------------------ helpers
const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const sp = (f: number, a: number, d = 15, k = 170) => (f < a ? 0 : spring({ frame: f - a, fps: FPS, config: { damping: d, stiffness: k } }));
/** Anchor point (fingertip) at clip time t, held at the ends. */
const anchorAt = (A: NonNullable<Anchor>, t: number): [number, number] => {
  const p = A.pts;
  if (t <= p[0][0]) return [p[0][1], p[0][2]];
  if (t >= p[p.length - 1][0]) return [p[p.length - 1][1], p[p.length - 1][2]];
  let i = 0; while (i < p.length - 2 && p[i + 1][0] < t) i++;
  const k = (t - p[i][0]) / Math.max(1e-6, p[i + 1][0] - p[i][0]);
  return [p[i][1] + (p[i + 1][1] - p[i][1]) * k, p[i][2] + (p[i + 1][2] - p[i][2]) * k];
};
/** Slow push-in per clip, applied identically to footage, cutout and anchors so everything stays locked. */
const zoomOf = (g: number, s: (typeof SEGS)[number]) => 1 + 0.035 * interpolate(g, [s.f0, s.f1], [0, 1], clamp);
const ZX = 540, ZY = 760;

// ------------------------------------------------------------------ Do side: glass card with a live app screen
const AppScene: React.FC<{ sc: DoScene; k: number; w: number; h: number }> = ({ sc, k, w, h }) => {
  // camera keyframes [progress, x, y, zoom]
  const c = sc.cam; let i = 0; while (i < c.length - 2 && c[i + 1][0] < k) i++;
  const u = ease(Math.min(1, Math.max(0, (k - c[i][0]) / (c[i + 1][0] - c[i][0]))));
  const x = c[i][1] + (c[i + 1][1] - c[i][1]) * u, y = c[i][2] + (c[i + 1][2] - c[i][2]) * u, z = c[i][3] + (c[i + 1][3] - c[i][3]) * u;
  const H = sc.h ?? 912, vh = sc.page === "analytics" ? 842 : sc.page === "consult" || sc.page === "leads" ? 869 : 912;
  const page = sc.page === "incoming" ? <IncomingPage scroll={0} />
    : sc.page === "case" ? <CaseDetailPage scroll={0} chrome={false} />
      : sc.page === "messages" ? <CaseDetailPage scroll={0} tab="Messages" chrome={false} />
        : sc.page === "analytics" ? <AnalyticsPage chrome={false} />
          : sc.page === "leads" ? <LeadFormsPage vh={869} scroll={0} />
            : <AbsoluteFill style={{ background: "#EEF0F6" }}><ConsultNoteModal backdrop={false} state={k > 0.62 ? "ready" : "preparing"} /></AbsoluteFill>;
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", borderRadius: 18, background: "#F7F8FC" }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: Math.max(H, vh), transformOrigin: "0 0", transform: `translate(${w / 2 - x * z}px, ${h / 2 - y * z}px) scale(${z})` }}>
        {page}
      </div>
    </div>
  );
};

const GlassDo: React.FC<{ s: (typeof SEGS)[number]; g: number; zoom: number }> = ({ s, g, zoom }) => {
  const A = ANCH[`c${s.n}`].do; if (!A) return null;
  const t = clipT(s, g);
  const fin = 1 - interpolate(t, [A.t1 - 0.05, A.t1 + 0.3], [0, 1], clamp);
  const pin = sp(g, frameOf(s, A.t0 + 0.05), 14, 150);
  const vis = Math.min(pin, fin); if (vis <= 0.01) return null;
  const [fx0, fy0] = anchorAt(A, t);
  const fx = ZX + (fx0 - ZX) * zoom, fy = ZY + (fy0 - ZY) * zoom;
  const W = 380, H = 462, right = 1036;
  const left = Math.min(right - W, Math.max(660, fx - W * 0.62));
  const top = Math.max(70, Math.min(fy - 56 - H, 520));
  const k = interpolate(t, [A.t0 + 0.2, A.t1], [0, 1], clamp);
  const bob = Math.sin(g / 22) * 4;
  return (
    <div style={{ position: "absolute", left, top: top + bob, width: W, height: H, perspective: 1100, opacity: vis, transformStyle: "preserve-3d" }}>
      {/* light beam from the fingertip to the card */}
      <div style={{ position: "absolute", left: fx - left - 2, top: H, width: 4, height: Math.max(0, fy - top - H - 14), background: "linear-gradient(180deg, rgba(124,77,240,.0), rgba(170,140,255,.75))", borderRadius: 4, opacity: pin }} />
      <div style={{ position: "absolute", left: fx - left - 9, top: fy - top - 22, width: 18, height: 18, borderRadius: 18, background: "radial-gradient(circle, #fff 0%, rgba(170,140,255,.85) 45%, rgba(124,77,240,0) 72%)", opacity: pin }} />
      <div style={{ position: "absolute", inset: 0, transformOrigin: "60% 100%", transform: `rotateY(${(1 - pin) * 70 - 9}deg) rotateX(${(1 - pin) * -25 + 4}deg) translateZ(${(1 - pin) * -200}px) scale(${0.7 + 0.3 * pin})`, transformStyle: "preserve-3d" }}>
        <div style={{ position: "absolute", inset: 0, borderRadius: 26, background: "linear-gradient(145deg, rgba(255,255,255,.34), rgba(255,255,255,.08))", border: "1.5px solid rgba(255,255,255,.55)", boxShadow: "0 30px 60px rgba(6,4,20,.55), inset 0 1px 0 rgba(255,255,255,.6)", backdropFilter: "blur(18px) saturate(1.3)", WebkitBackdropFilter: "blur(18px) saturate(1.3)" }} />
        <div style={{ position: "absolute", left: 14, top: 14, right: 14, height: 46, display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ padding: "6px 14px", borderRadius: 999, background: `linear-gradient(135deg, ${GREEN}, #6FF0C0)`, color: INK, font: `800 20px ${F}`, letterSpacing: ".04em" }}>DO</div>
          <div style={{ color: "#fff", font: `700 19px ${F}`, textShadow: "0 2px 8px rgba(0,0,0,.45)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{s.doLabel}</div>
        </div>
        <div style={{ position: "absolute", left: 14, top: 70, right: 14, bottom: 14, borderRadius: 18, overflow: "hidden", boxShadow: "0 0 0 1px rgba(255,255,255,.35)", opacity: 0.95 }}>
          <AppScene sc={s.scene} k={k} w={W - 28} h={H - 84} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(160deg, rgba(255,255,255,.22) 0%, rgba(255,255,255,0) 38%)", pointerEvents: "none" }} />
        </div>
      </div>
    </div>
  );
};

// ------------------------------------------------------------------ Don't side: moving 3D amber scenes
const Paper: React.FC<{ x: number; y: number; z: number; rx: number; ry: number; rz: number; w?: number; h?: number; tint?: string; lines?: number; label?: string; blur?: number }> = ({ x, y, z, rx, ry, rz, w = 120, h = 154, tint = "#FFFDF6", lines = 6, label, blur = 0 }) => (
  <div style={{ position: "absolute", left: x - w / 2, top: y - h / 2, width: w, height: h, transform: `translateZ(${z}px) rotateX(${rx}deg) rotateY(${ry}deg) rotateZ(${rz}deg)`, background: tint, borderRadius: 6, boxShadow: "0 14px 26px rgba(0,0,0,.4)", padding: 12, boxSizing: "border-box", filter: blur ? `blur(${blur}px)` : undefined }}>
    {label && <div style={{ font: `800 13px ${F}`, color: "#8A5A00", marginBottom: 6, letterSpacing: ".05em" }}>{label}</div>}
    {Array.from({ length: lines }).map((_, i) => <div key={i} style={{ height: 6, borderRadius: 3, background: "#D9D3C4", width: `${92 - (i % 3) * 18}%`, marginBottom: 8 }} />)}
  </div>
);
const Chip3: React.FC<{ x: number; y: number; z: number; text: string; rot?: number; tone?: "amber" | "dark" }> = ({ x, y, z, text, rot = 0, tone = "amber" }) => (
  <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%,-50%) translateZ(${z}px) rotate(${rot}deg)`, padding: "8px 16px", borderRadius: 999, background: tone === "amber" ? `linear-gradient(135deg, ${AMBER}, #FFD36E)` : "rgba(20,14,40,.86)", color: tone === "amber" ? INK : "#FFE6A8", font: `800 18px ${F}`, whiteSpace: "nowrap", boxShadow: "0 10px 24px rgba(0,0,0,.4)" }}>{text}</div>
);
const Icon3: React.FC<{ x: number; y: number; z: number; s: number; d: string; bg: string; fg?: string; rx?: number; ry?: number }> = ({ x, y, z, s, d, bg, fg = INK, rx = 0, ry = 0 }) => (
  <div style={{ position: "absolute", left: x - s / 2, top: y - s / 2, width: s, height: s, borderRadius: s * 0.26, background: bg, transform: `translateZ(${z}px) rotateX(${rx}deg) rotateY(${ry}deg)`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 14px 28px rgba(0,0,0,.45), inset 0 2px 0 rgba(255,255,255,.4)" }}>
    <svg width={s * 0.56} height={s * 0.56} viewBox="0 0 24 24" fill="none" stroke={fg} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d={d} /></svg>
  </div>
);
const I = {
  phone: "M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.3 1.8.6 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.5 2.7.6a2 2 0 0 1 1.7 2z",
  mail: "M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zM22 6l-10 7L2 6",
  fax: "M6 9V2h12v7M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2M6 14h12v8H6z",
  pdf: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6M9 15h6",
  vm: "M5.5 15a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM18.5 15a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM5.5 15h13",
  inbox: "M22 12h-6l-2 3h-4l-2-3H2M5.5 5.1 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.5-6.9A2 2 0 0 0 16.8 4H7.2a2 2 0 0 0-1.7 1.1z",
  kb: "M2 6h20v12H2zM6 10h.01M10 10h.01M14 10h.01M18 10h.01M7 14h10",
  q: "M9.1 9a3 3 0 0 1 5.8 1c0 2-3 3-3 3M12 17h.01",
  spark: "M12 3l1.9 5.6L19.5 10l-5.6 1.9L12 17.5l-1.9-5.6L4.5 10l5.6-1.4z",
};

const DontScene: React.FC<{ kind: string; t: number }> = ({ kind, t }) => {
  const sw = (a: number, f = 1, ph = 0) => Math.sin(t * f * 2.2 + ph) * a;
  switch (kind) {
    case "forms": return <>{[0, 1, 2, 3].map((i) => <Paper key={i} x={150 + sw(14, 0.8, i)} y={170 - i * 22 + sw(8, 1.1, i)} z={i * 30} rx={20 + sw(10, 0.9, i)} ry={-25 + i * 12 + sw(14, 0.7, i)} rz={-12 + i * 8} label={i === 3 ? "REFERRAL FORM" : undefined} />)}<Chip3 x={150} y={300} z={140} text="Submit… then?" /></>;
    case "fax": return <><Icon3 x={80 + sw(8)} y={110 + sw(10, 1.2)} z={60} s={84} d={I.fax} bg="linear-gradient(135deg,#FFE29A,#FFB020)" rx={sw(14)} ry={20 + sw(18, 0.8)} /><Icon3 x={215 + sw(8, 1, 1)} y={150 + sw(10, 1, 2)} z={110} s={84} d={I.pdf} bg="linear-gradient(135deg,#FFF1D6,#E8C88A)" rx={sw(12, 1, 1)} ry={-20 + sw(18, 0.9, 1)} /><Icon3 x={130 + sw(10, 0.9, 2)} y={245 + sw(8, 1.1, 1)} z={30} s={84} d={I.vm} bg="linear-gradient(135deg,#3A2E5C,#211A38)" fg="#FFD36E" rx={sw(14, 0.8, 2)} ry={sw(20, 1, 2)} /><Chip3 x={145} y={300} z={150} text="Missing pages" rot={-4} /></>;
    case "email": return <>{[0, 1, 2, 3, 4].map((i) => <div key={i} style={{ position: "absolute", left: 60 + i * 18, top: 60 + i * 46 + sw(6, 1, i), width: 190, height: 40, borderRadius: 10, background: "rgba(255,248,232,.95)", transform: `translateZ(${i * 26}px) rotateX(${28 + sw(8, 0.8, i)}deg) rotateY(${-18 + sw(10, 0.6, i)}deg)`, boxShadow: "0 10px 20px rgba(0,0,0,.35)", display: "flex", alignItems: "center", gap: 8, padding: "0 12px", font: `700 15px ${F}`, color: "#6B4A00" }}>✉ {"RE: ".repeat(Math.min(i + 1, 3))}FW: patient</div>)}<Chip3 x={145} y={300} z={160} text="Buried in threads" /></>;
    case "phone": {
      const ring = (t * 1.6) % 1;
      return <>{[[70, 120], [230, 230]].map(([x, y], i) => <React.Fragment key={i}><div style={{ position: "absolute", left: x - 70 * (ring + 0.3), top: y - 70 * (ring + 0.3), width: 140 * (ring + 0.3), height: 140 * (ring + 0.3), borderRadius: 999, border: `3px solid rgba(255,176,32,${0.8 * (1 - ring)})` }} /><Icon3 x={x} y={y} z={60} s={88} d={I.phone} bg="linear-gradient(135deg,#FFE29A,#FFB020)" rx={sw(12, 2, i)} ry={sw(30, 2.5, i)} /></React.Fragment>)}<svg width="300" height="300" style={{ position: "absolute", left: 0, top: 0 }}><path d="M110 150 C 160 120, 170 200, 200 205" stroke="#FFD36E" strokeWidth="4" strokeDasharray="10 10" strokeDashoffset={-t * 60} fill="none" /></svg><Chip3 x={145} y={300} z={150} text="Missed call × 3" rot={3} /></>;
    }
    case "sticky": return <>{[["#FFE57A", -10], ["#FFD36E", 8], ["#FFF1A8", -4], ["#FFC85C", 12]].map(([c, r], i) => <div key={i} style={{ position: "absolute", left: 40 + (i % 2) * 120, top: 50 + Math.floor(i / 2) * 120 + sw(5, 1, i), width: 112, height: 108, background: c as string, transform: `translateZ(${i * 22}px) rotateZ(${(r as number) + sw(4, 0.8, i)}deg) rotateX(${sw(18, 1.2, i)}deg)`, transformOrigin: "50% 0", boxShadow: "0 12px 22px rgba(0,0,0,.35)", padding: 10, boxSizing: "border-box", font: `700 14px 'Comic Sans MS', ${F}`, color: "#5A4300" }}>{["Call back?", "Pano??", "Who has this?", "Ins. pending"][i]}</div>)}<Chip3 x={145} y={300} z={150} text="Who has this?" /></>;
    case "photo": return <><div style={{ position: "absolute", left: 70, top: 40, width: 160, height: 270, borderRadius: 26, background: "#141024", border: "5px solid #2C2440", transform: `translateZ(40px) rotateY(${18 + sw(10, 0.7)}deg) rotateX(${8 + sw(6, 0.9)}deg)`, boxShadow: "0 20px 40px rgba(0,0,0,.5)" }}><div style={{ position: "absolute", left: 12, top: 30, right: 12, padding: 8, borderRadius: 12, background: "#3B3158", color: "#FFE6A8", font: `600 12px ${F}` }}>Here's my card 📷</div><div style={{ position: "absolute", left: 16, top: 84, width: 118, height: 78, borderRadius: 8, background: "linear-gradient(135deg,#8FD1B5,#3E8F73)", filter: `blur(${3 + sw(1.5, 2)}px)` }} /><div style={{ position: "absolute", left: 16, top: 172, right: 12, padding: 8, borderRadius: 12, background: "#5A4A8A", color: "#fff", font: `600 12px ${F}` }}>Back side?</div></div><Chip3 x={145} y={300} z={150} text="Back side missing" /></>;
    case "typing": return <><Icon3 x={150} y={250} z={30} s={110} d={I.kb} bg="linear-gradient(135deg,#3A2E5C,#211A38)" fg="#FFD36E" rx={40} ry={sw(10)} /><Paper x={150 + sw(6)} y={120} z={80} rx={10} ry={-14 + sw(8, 0.6)} rz={-4} w={170} h={150} lines={Math.min(8, 2 + Math.floor(t * 2.2))} label="CONSULT NOTE" /><Chip3 x={145} y={300} z={150} text="Typed. Faxed." /></>;
    case "triple": return <>{[0, 1, 2].map((i) => { const u = Math.min(1, Math.max(0, t * 1.2 - i * 0.35)); return <Paper key={i} x={90 + i * 62} y={150 + i * 12} z={i * 40} rx={16} ry={-22 + i * 6 + sw(8, 0.8, i)} rz={-6 + i * 5} w={112} h={140} label={`SYSTEM ${i + 1}`} lines={5} blur={0} tint={u > 0.5 ? "#FFFDF6" : "rgba(255,253,246,.4)"} />; })}<Chip3 x={145} y={300} z={160} text="Typed 3 times" /></>;
    case "inbox": {
      const n = Math.min(47, Math.floor(t * 14) + 3);
      return <><Icon3 x={150} y={170} z={50} s={140} d={I.inbox} bg="linear-gradient(135deg,#FFE29A,#FFB020)" rx={18 + sw(6)} ry={-16 + sw(10, 0.7)} /><div style={{ position: "absolute", left: 200, top: 70, transform: "translateZ(120px)", padding: "6px 12px", borderRadius: 999, background: "#211A38", color: "#FFD36E", font: `800 22px ${F}` }}>{n}</div>{[0, 1, 2].map((i) => <div key={i} style={{ position: "absolute", left: 60 + i * 70, top: 40 + ((t * 80 + i * 40) % 120), width: 46, height: 30, borderRadius: 6, background: "#FFF8E8", transform: `translateZ(80px) rotate(${sw(20, 1, i)}deg)`, opacity: 0.9 }} />)}<Chip3 x={145} y={300} z={150} text="Unread leads" /></>;
    }
    case "guess": return <>{[0, 1, 2].map((i) => <div key={i} style={{ position: "absolute", left: 50 + i * 80, top: 90 + sw(30, 1.1, i * 2), transform: `translateZ(${40 + i * 30}px) rotateY(${t * 140 + i * 60}deg)`, font: `900 ${96 - i * 12}px ${F}`, color: i === 1 ? "#FFD36E" : AMBER, textShadow: "0 10px 24px rgba(0,0,0,.45)" }}>?</div>)}<Chip3 x={145} y={300} z={150} text="Just hunches" /></>;
    case "hype": return <><Paper x={100 + sw(6)} y={150} z={20} rx={14} ry={22 + sw(10, 0.8)} rz={-8} w={120} h={150} label="WEB FORM" /><div style={{ position: "absolute", left: 160, top: 70, width: 130, height: 130, borderRadius: 999, background: "radial-gradient(circle at 35% 30%, #FFF1C2, #FFB020 60%, #C77A00)", transform: `translateZ(90px) scale(${1 + sw(0.08, 2)})`, display: "flex", alignItems: "center", justifyContent: "center", font: `900 40px ${F}`, color: INK, boxShadow: "0 18px 36px rgba(0,0,0,.45)" }}>AI?</div><Chip3 x={145} y={300} z={150} text="No real system" /></>;
    case "chase": return <>{[0, 1, 2].map((i) => { const a = t * 2.6 + i * 2.09; return <Icon3 key={i} x={150 + Math.cos(a) * 95} y={170 + Math.sin(a) * 70} z={60 + Math.sin(a) * 50} s={70} d={[I.phone, I.mail, I.fax][i]} bg="linear-gradient(135deg,#FFE29A,#FFB020)" ry={a * 40} />; })}<Chip3 x={145} y={300} z={150} text="Round and round" /></>;
    default: return null;
  }
};

const DontCard: React.FC<{ s: (typeof SEGS)[number]; g: number; zoom: number }> = ({ s, g, zoom }) => {
  const A = ANCH[`c${s.n}`].dont; if (!A) return null;
  const t = clipT(s, g);
  const fin = 1 - interpolate(t, [A.t1 - 0.05, A.t1 + 0.3], [0, 1], clamp);
  const pin = sp(g, frameOf(s, Math.max(s.a, A.t0) + 0.05), 13, 150);
  const vis = Math.min(pin, fin); if (vis <= 0.01) return null;
  const [fx0, fy0] = anchorAt(A, t);
  const fx = ZX + (fx0 - ZX) * zoom, fy = ZY + (fy0 - ZY) * zoom;
  const W = 356, H = 440;
  const left = Math.max(20, Math.min(390 - W, fx - W * 0.38));
  const top = Math.max(70, Math.min(fy - 50 - H, 520));
  const bob = Math.sin(g / 20 + 1) * 4;
  return (
    <div style={{ position: "absolute", left, top: top + bob, width: W, height: H, perspective: 900, opacity: vis }}>
      <div style={{ position: "absolute", left: fx - left - 2, top: H, width: 4, height: Math.max(0, fy - top - H - 14), background: "linear-gradient(180deg, rgba(255,176,32,0), rgba(255,200,90,.8))", borderRadius: 4 }} />
      <div style={{ position: "absolute", inset: 0, transformOrigin: "40% 100%", transform: `rotateY(${(1 - pin) * -70 + 12}deg) rotateX(${(1 - pin) * -25 + 4}deg) scale(${0.7 + 0.3 * pin})`, transformStyle: "preserve-3d" }}>
        <div style={{ position: "absolute", inset: 0, borderRadius: 26, background: "linear-gradient(150deg, rgba(60,40,10,.55), rgba(30,20,40,.35))", border: "1.5px solid rgba(255,210,120,.55)", boxShadow: "0 30px 60px rgba(6,4,20,.55), inset 0 1px 0 rgba(255,230,170,.5)", backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)" }} />
        <div style={{ position: "absolute", left: 14, top: 14, right: 14, height: 46, display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ padding: "6px 14px", borderRadius: 999, background: `linear-gradient(135deg, ${AMBER}, #FFD36E)`, color: INK, font: `800 20px ${F}`, letterSpacing: ".04em" }}>DON’T</div>
          <div style={{ color: "#FFE6A8", font: `700 19px ${F}`, textShadow: "0 2px 8px rgba(0,0,0,.5)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{s.dontLabel}</div>
        </div>
        <div style={{ position: "absolute", left: 0, top: 56, width: 320, height: 370, perspective: 700, transformStyle: "preserve-3d", marginLeft: 18 }}>
          <div style={{ position: "absolute", inset: 0, transformStyle: "preserve-3d" }}><DontScene kind={s.dont} t={Math.max(0, t - A.t0)} /></div>
        </div>
      </div>
    </div>
  );
};

// ------------------------------------------------------------------ footage, cutout, captions, end card
const Shot: React.FC<{ s: (typeof SEGS)[number]; p: Piece; layer: "plate" | "cut" }> = ({ s, p, layer }) => {
  const f = useCurrentFrame(); const g = f + p.f0; const z = zoomOf(g, s);
  const st: React.CSSProperties = { position: "absolute", left: 0, top: 0, width: 1080, height: 1920, transformOrigin: `${ZX}px ${ZY}px`, transform: `scale(${z})` };
  return layer === "plate"
    ? <OffthreadVideo src={staticFile(`gx/c${s.n}.mp4`)} muted trimBefore={RF(p.a)} playbackRate={p.rate} style={st} />
    : <OffthreadVideo src={staticFile(`gx/c${s.n}-cut.webm`)} transparent muted trimBefore={RF(p.a)} playbackRate={p.rate} style={st} />;
};

const Captions: React.FC = () => {
  const f = useCurrentFrame();
  const s = SEGS.find((x) => f >= x.f0 && f < x.f1); if (!s) return null;
  const t = clipT(s, f);
  const raw = (WORDS[`w${s.n}.wav`]?.words ?? []).filter((w) => w.end > s.a + 0.05 && w.start < s.b - 0.05).map((w) => (w.word.trim().startsWith("Don") && w.end - w.start > 0.75 ? { ...w, start: w.end - 0.55 } : w));
  const ws: Wd[] = [];
  for (const w of raw) {
    const prev = ws[ws.length - 1];
    if (prev && w.word.trim().startsWith("-")) { ws[ws.length - 1] = { ...prev, word: prev.word.trim() + w.word.trim(), end: w.end }; continue; }
    ws.push({ ...w, word: w.word.trim() });
  }
  const FIX: Record<string, string> = { "tooth": "Tooth", "referral.": "Referral.", "referral,": "Referral,", "x-rays": "X-rays", "Live": "live", "Analytics.": "analytics.", "3": "three" };
  for (let i = 0; i < ws.length; i++) {
    const w = ws[i].word, lw = w.toLowerCase();
    if (lw === "tooth") ws[i].word = "Tooth";
    else if (lw.startsWith("referral") && i > 0 && ws[i - 1].word === "Tooth") ws[i].word = "R" + w.slice(1);
    else if (FIX[w]) ws[i].word = FIX[w];
  }
  if (ws.length) { const L = ws[ws.length - 1]; ws[ws.length - 1] = { ...L, word: L.word.replace(/,$/, ".") }; }
  const isDont = t < 4.0;
  const group = ws.filter((w) => (isDont ? w.start < 4.0 : w.start >= 4.0));
  if (!group.length || t < group[0].start - 0.15 || t > group[group.length - 1].end + 0.5) return null;
  const tone = isDont ? AMBER : GREEN;
  const p = sp(f, frameOf(s, group[0].start - 0.15), 16, 220);
  return (
    <div style={{ position: "absolute", left: 60, right: 60, top: 1560, display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "6px 14px", transform: `translateY(${(1 - p) * 30}px)`, opacity: p }}>
      {group.map((w, i) => {
        const on = t >= w.start - 0.03; const cur = t >= w.start - 0.03 && t < w.end + 0.05;
        const first = i === 0;
        return <span key={i} style={{ font: `900 ${first ? 64 : 58}px ${F}`, letterSpacing: "-0.02em", color: first ? tone : cur ? "#FFFFFF" : on ? "rgba(255,255,255,.95)" : "rgba(255,255,255,.35)", textShadow: "0 4px 18px rgba(0,0,0,.75), 0 0 2px rgba(0,0,0,.9)", transform: cur ? "scale(1.06)" : undefined, display: "inline-block" }}>{w.word.trim()}</span>;
      })}
    </div>
  );
};

const EndCard: React.FC = () => {
  const f = useCurrentFrame(); if (f < END_AT - 6) return null;
  const p = sp(f, END_AT - 6, 16, 120);
  return (
    <AbsoluteFill style={{ background: `rgba(14,10,30,${0.78 * p})`, backdropFilter: `blur(${18 * p}px)`, alignItems: "center", justifyContent: "center" }}>
      <div style={{ transform: `translateY(${(1 - p) * 60}px) scale(${0.9 + 0.1 * p})`, opacity: p, textAlign: "center" }}>
        <div style={{ display: "inline-block", padding: "26px 40px", borderRadius: 30, background: "rgba(255,255,255,.94)" }}><Img src={staticFile("tr/logo.png")} style={{ width: 520 }} /></div>
        <div style={{ marginTop: 46, font: `900 78px ${F}`, color: "#fff", letterSpacing: "-0.02em" }}>Don’t chase.<br /><span style={{ color: GREEN }}>Just refer it.</span></div>
        <div style={{ marginTop: 30, font: `700 40px ${F}`, color: "#CFC6FF" }}>toothreferral.com</div>
      </div>
    </AbsoluteFill>
  );
};

const Cards: React.FC = () => {
  const f = useCurrentFrame();
  const s = SEGS.find((x) => f >= x.f0 && f < x.f1); if (!s) return null;
  const z = zoomOf(f, s);
  return <><DontCard s={s} g={f} zoom={z} /><GlassDo s={s} g={f} zoom={z} /></>;
};

const Sfx: React.FC = () => (
  <>
    {SEGS.map((s) => {
      const A = ANCH[`c${s.n}`];
      const out: React.ReactNode[] = [];
      if (A.dont) out.push(<Sequence key={`${s.n}d`} from={frameOf(s, Math.max(s.a, A.dont.t0))} durationInFrames={RF(1)}><Audio src={staticFile("audio/sfx/whoosh-short.wav")} volume={0.16} /></Sequence>);
      if (A.do) out.push(<Sequence key={`${s.n}o`} from={frameOf(s, A.do.t0)} durationInFrames={RF(1.2)}><Audio src={staticFile("audio/sfx/shimmer.wav")} volume={0.14} /></Sequence>);
      return out;
    })}
    <Sequence from={END_AT - 6} durationInFrames={RF(2)}><Audio src={staticFile("audio/sfx/chime.wav")} volume={0.25} /></Sequence>
  </>
);

/** Zoom-through seam between clips (cut-the-curve skill): the outgoing shot pushes in and blurs over the last 6 frames,
 * the swap happens at peak blur, and the incoming shot keeps pushing in from slightly small while the blur clears. Same
 * sign of motion on both sides, so the cut reads as one continuous camera move. */
const SEAM = 6;
const seamAt = (g: number) => {
  for (const s of SEGS.slice(0, -1)) {
    const d = g - s.f1; // <0 before the cut, >=0 after
    if (d >= -SEAM && d < 0) { const k = ease((d + SEAM) / SEAM); return { scale: 1 + 0.09 * k, blur: 16 * k }; }
    if (d >= 0 && d < SEAM) { const k = ease(1 - d / SEAM); return { scale: 1 - 0.04 * k, blur: 16 * k }; }
  }
  return { scale: 1, blur: 0 };
};
const SEAMS = SEGS.slice(0, -1).map((s) => s.f1);

const Scene: React.FC = () => {
  const f = useCurrentFrame(); const m = seamAt(f);
  return (
    <AbsoluteFill style={{ transform: `scale(${1.045 * m.scale})`, transformOrigin: `${ZX}px ${ZY}px`, filter: m.blur > 0.3 ? `blur(${m.blur}px)` : undefined }}>
      {SEGS.map((s) => s.pieces.map((p, i) => <Sequence key={`${s.n}p${i}`} from={p.f0} durationInFrames={p.f1 - p.f0}><Shot s={s} p={p} layer="plate" /></Sequence>))}
      {/* last frame held under the end card */}
      <Sequence from={END_AT} durationInFrames={GX_DURATION - END_AT}><OffthreadVideo src={staticFile("gx/c12.mp4")} muted trimBefore={RF(SEGS[SEGS.length - 1].b - 0.05)} style={{ position: "absolute", width: 1080, height: 1920, transform: `scale(1.035)`, transformOrigin: `${ZX}px ${ZY}px` }} /></Sequence>
      <Cards />
      {SEGS.map((s) => s.pieces.map((p, i) => <Sequence key={`${s.n}c${i}`} from={p.f0} durationInFrames={p.f1 - p.f0}><Shot s={s} p={p} layer="cut" /></Sequence>))}
    </AbsoluteFill>
  );
};

export const GestureStory: React.FC = () => (
  <FontGate>
    <AbsoluteFill style={{ background: "#0B0914" }}>
      <Scene />
      <Captions />
      <EndCard />
      {/* voice: only the spoken pieces (normal speed); the speed-ramped pieces are silent */}
      {SEGS.map((s) => s.pieces.filter((p) => p.rate === 1).map((p, i) => <Sequence key={`${s.n}v${i}`} from={p.f0} durationInFrames={p.f1 - p.f0}><Audio src={staticFile(`gx/voice2/c${s.n}.mp3`)} trimBefore={RF(p.a)} volume={(fr) => Math.min(1, fr / 2, (p.f1 - p.f0 - fr) / 3)} /></Sequence>))}
      <Audio src={staticFile("audio/music/s13-bed.wav")} volume={(fr) => (fr < END_AT ? 0.07 : 0.13)} loop />
      {SEAMS.map((f, i) => <Sequence key={`sw${i}`} from={f - 5} durationInFrames={RF(0.8)}><Audio src={staticFile("audio/sfx/whoosh-short.wav")} volume={0.1} /></Sequence>)}
      <Sfx />
      <AbsoluteFill style={{ pointerEvents: "none", opacity: 0.05, backgroundImage: "radial-gradient(rgba(255,255,255,.6) 0.6px, transparent 0.6px)", backgroundSize: "3px 3px", mixBlendMode: "overlay" }} />
    </AbsoluteFill>
  </FontGate>
);
