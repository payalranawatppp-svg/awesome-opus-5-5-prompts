/**
 * ToothReferral UGC #2: eight takes joined into one continuous talk (scripts/build_cut.py removes the dead
 * air), finished with ToothReferral animations placed by the words and the speaker's hands.
 *
 * Layers, back to front: footage → brand wall (from "ToothReferral" on) → animations behind the speaker →
 * speaker cutout (RVM, public/cutouts/tr2-cut.webm) → animations in front → captions.
 * Every cut alternates the framing between the wide shot and a gentle punch-in on the face, so the joins
 * read as camera moves, not jumps. Timings come from word timestamps (src/data/transcript-tr2.json).
 * Demo data throughout; patient and practice names are fictional.
 */
import React from "react";
import { AbsoluteFill, Audio, Freeze, Img, Sequence, interpolate, spring, staticFile, useCurrentFrame } from "remotion";
import { FontGate, TALENT, TalentLayer, type Framing } from "../effects";
import transcript from "../data/transcript-tr2.json";
import cut from "../data/tr2-cut-segments.json";
import { FONT_SERIF, FONT_UI } from "../theme";
import { LightSweep, LogoReveal, easeIO, easeOut, glass, ramp, useSpring } from "../tr/motion";
import { Avatar, Badge, Card, Cursor, ICON, Icon, TR, clamp } from "../tr/ui";

const TL = TALENT["tr2-cut"];
const FPS = 30;
const CUT_FRAMES = Math.floor(cut.duration * FPS);
const TAIL = 36;
export const UGC2_DURATION = CUT_FRAMES + TAIL;

// ---------------------------------------------------------------------------------------------------
// Timing

const WORDS = transcript["tr2-cut"].words;
const norm = (w: string) => w.toLowerCase().replace(/[^a-z]/g, "");
/** Output frame where a word starts; `n`: occurrence. */
const at = (word: string, n = 1) => {
  const hits = WORDS.filter((w) => norm(w.word) === word);
  if (!hits[n - 1]) throw new Error(`"${word}" #${n} not in transcript`);
  return Math.round(hits[n - 1].start * FPS);
};
const endOf = (word: string, n = 1) => {
  const hits = WORDS.filter((w) => norm(w.word) === word);
  return Math.round(hits[n - 1].end * FPS);
};

// ---------------------------------------------------------------------------------------------------
// Framing: wide on even pieces of the cut, a 1.1x punch-in on the face on odd ones

const WIDE: Framing = { scale: 1.5, x: 0, y: 0 };
export const FACE = { x: 412, y: 423 }; // mean face centre in the source (src/data/faces.json)
const PUNCH = (() => {
  const s = 1.65;
  return { scale: s, x: FACE.x * 1.5 - FACE.x * s, y: FACE.y * 1.5 - FACE.y * s };
})();
/** Face-centred framing at any scale (same face position as the wide shot). */
const onFace = (s: number): Framing => ({ scale: s, x: FACE.x * 1.5 - FACE.x * s, y: FACE.y * 1.5 - FACE.y * s });
const SEG_STARTS = cut.segments.map((s) => Math.round(s.at * FPS));
const framingAt = (frame: number): Framing => {
  let i = 0;
  while (i + 1 < SEG_STARTS.length && SEG_STARTS[i + 1] <= frame) i++;
  return i % 2 === 0 ? WIDE : PUNCH;
};

// ---------------------------------------------------------------------------------------------------
// Small pieces

/** Static mask of the mic and its arm (camera is locked off), built from the median frame. */
export const MIC_MASK: React.CSSProperties = {
  maskImage: `url(${staticFile("cutouts/tr2-cut-mic.png")})`,
  WebkitMaskImage: `url(${staticFile("cutouts/tr2-cut-mic.png")})`,
  maskSize: "100% 100%",
  WebkitMaskSize: "100% 100%",
};

const SERIF: React.CSSProperties = { fontFamily: FONT_SERIF, fontWeight: 400 };

/** Pure spring 0→1 from frame `at` (safe after early returns and inside loops, unlike a hook). */
const sp = (frame: number, at: number, damping = 15, stiffness = 160) =>
  frame < at ? 0 : spring({ frame: frame - at, fps: FPS, config: { damping, stiffness, mass: 0.75 } });

/** Fade + lift in from `from`, quick fade out ending at `to`. */
const useWindow = (from: number, to: number, outLen = 8) => {
  const frame = useCurrentFrame();
  const p = useSpring(from, { damping: 16, stiffness: 150 });
  const out = interpolate(frame, [to - outLen, to], [0, 1], clamp);
  return { p, out, on: frame >= from && frame <= to };
};

/** Big editorial serif words on the wall behind the speaker; each word appears when it is spoken. */
const DepthWords: React.FC<{ lines: { text: string; at: number }[][]; from: number; to: number; top: number; size: number; color: string; italic?: boolean; left?: number }> = ({
  lines,
  from,
  to,
  top,
  size,
  color,
  italic,
  left,
}) => {
  const frame = useCurrentFrame();
  const out = interpolate(frame, [to - 9, to], [0, 1], clamp);
  if (frame < from || frame > to) return null;
  return (
    <AbsoluteFill style={{ opacity: 1 - out, filter: out > 0 ? `blur(${out * 10}px)` : undefined }}>
      <div style={{ position: "absolute", left: left ?? 0, right: left === undefined ? 0 : undefined, top, textAlign: left === undefined ? "center" : "left", ...SERIF, fontStyle: italic ? "italic" : "normal", fontSize: size, lineHeight: 0.98, color, letterSpacing: -size * 0.015 }}>
        {lines.map((line, li) => (
          <div key={li}>
            {line.map((w, wi) => {
              const k = interpolate(frame, [w.at - 2, w.at + 8], [0, 1], clamp);
              return (
                <span key={wi} style={{ display: "inline-block", marginRight: size * 0.22, opacity: k, translate: `0px ${(1 - easeOut(k)) * size * 0.25}px`, filter: k < 1 ? `blur(${(1 - k) * 8}px)` : undefined }}>
                  {w.text}
                </span>
              );
            })}
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------------------------------
// Behind the speaker

/** Before ToothReferral: fax pages and pain points drifting on the wall around the head. */
const Chaos: React.FC<{ from: number; to: number }> = ({ from, to }) => {
  const frame = useCurrentFrame();
  const out = interpolate(frame, [to - 8, to], [0, 1], clamp);
  if (frame < from - 1 || frame > to) return null;
  const sheets = [
    { x: 60, y: 210, r: -12, d: 0 },
    { x: 770, y: 170, r: 9, d: 5 },
    { x: 150, y: 520, r: 6, d: 10 },
  ];
  const tags = [
    { t: "Phone tag", x: 110, y: 420, d: 8 },
    { t: "Missing X-rays", x: 690, y: 470, d: 14 },
    { t: "Insurance unknown", x: 640, y: 120, d: 20 },
  ];
  return (
    <AbsoluteFill style={{ opacity: 1 - out }}>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 30%, rgba(20,16,40,0) 30%, rgba(20,16,40,0.28) 100%)", opacity: ramp(frame, from, from + 10) }} />
      {sheets.map((s, i) => {
        const p = sp(frame, from + s.d, 13, 110);
        const drift = Math.sin((frame + i * 40) / 22) * 6;
        return (
          <div key={i} style={{ position: "absolute", left: s.x, top: s.y + drift, width: 230, height: 290, background: "#F1EFEA", borderRadius: 6, padding: 22, rotate: `${s.r + Math.sin((frame + i * 17) / 30) * 2}deg`, scale: String(0.85 + p * 0.15), opacity: Math.min(1, p * 1.6), boxShadow: "0 18px 40px rgba(20,16,40,0.28)" }}>
            <div style={{ fontFamily: "monospace", fontSize: 18, fontWeight: 700, color: "#7B786F", letterSpacing: 4 }}>FAX</div>
            {[88, 66, 80, 56, 74, 48].map((w, k) => (
              <div key={k} style={{ height: 8, width: `${w}%`, background: "#C9C5BC", borderRadius: 3, marginTop: 16 }} />
            ))}
          </div>
        );
      })}
      {tags.map((g, i) => {
        const p = sp(frame, from + g.d, 11, 210);
        return (
          <div key={i} style={{ position: "absolute", left: g.x, top: g.y + Math.sin((frame + i * 30) / 18) * 4, scale: String(p), opacity: Math.min(1, p * 2) }}>
            <Badge color="#fff" bg={TR.red} style={{ fontFamily: FONT_UI, fontSize: 26, fontWeight: 500, padding: "10px 22px", boxShadow: `0 10px 26px ${TR.red}55` }}>
              <Icon d={ICON.alert} size={24} color="#fff" />
              {g.t}
            </Badge>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

/** The studio room behind the speaker (public/bg/studio-room.jpg), a touch out of focus like a shallow lens.
 *  Scaled so the desk stays below the hands; a very slow drift keeps it alive. */
const ROOM = { w: 1674, h: 3000, x: -297, y: -40 };
export const Room: React.FC<{ blur?: number; style?: React.CSSProperties }> = ({ blur = 3, style }) => {
  const frame = useCurrentFrame();
  const drift = Math.sin(frame / 90) * 6;
  return (
    <AbsoluteFill style={style}>
      <Img src={staticFile("bg/studio-room.jpg")} style={{ position: "absolute", left: ROOM.x + drift, top: ROOM.y, width: ROOM.w, height: ROOM.h, filter: `blur(${blur}px)` }} />
    </AbsoluteFill>
  );
};

/** From "ToothReferral" on, the room racks further out of focus and takes the brand grade, wiping out from
 *  behind the head, so the product animations read clearly against it. */
const BrandGrade: React.FC<{ from: number }> = ({ from }) => {
  const frame = useCurrentFrame();
  const k = ramp(frame, from, from + 16, easeIO);
  if (frame < from) return null;
  const d = Math.sin(frame / 60) * 40;
  return (
    <AbsoluteFill style={{ clipPath: `circle(${k * 1500}px at 618px 600px)` }}>
      <Room blur={12} />
      <AbsoluteFill style={{ background: `linear-gradient(170deg, ${TR.stage1}E0 0%, #261562C8 55%, ${TR.stage2}B8 100%)` }} />
      <div style={{ position: "absolute", width: 1200, height: 1200, left: 18 + d, top: 40, borderRadius: "50%", background: `radial-gradient(circle, ${TR.purple}55, transparent 62%)`, filter: "blur(30px)" }} />
    </AbsoluteFill>
  );
};

/** "Every answer means another interruption": calls, faxes and voicemails stack up on the wall behind him. */
const Interruptions: React.FC<{ at: number[]; to: number }> = ({ at: ats, to }) => {
  const frame = useCurrentFrame();
  const out = interpolate(frame, [to - 7, to], [0, 1], clamp);
  if (frame < ats[0] - 2 || frame > to) return null;
  const items = [
    { t: "Incoming call", s: "Bright Smile Dental", icon: "M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z", c: TR.green, x: 40, y: 150, r: -4 },
    { t: "Fax received", s: "3 pages · X-rays", icon: "M6 9V2h12v7M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2M6 14h12v8H6z", c: TR.amber, x: 600, y: 120, r: 3 },
    { t: "Voicemail", s: "Toledo Family Dental", icon: "M5.5 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM18.5 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM5.5 15.5h13", c: TR.purple, x: 70, y: 400, r: 2 },
    { t: "Missed call", s: "Holland General", icon: "M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z", c: TR.red, x: 640, y: 380, r: -3 },
  ];
  return (
    <AbsoluteFill style={{ opacity: 1 - out, filter: out > 0 ? `blur(${out * 8}px)` : undefined }}>
      {items.map((it, i) => {
        const p = sp(frame, ats[i], 11, 230);
        const buzz = frame >= ats[i] && frame < ats[i] + 8 ? Math.sin((frame - ats[i]) * 2.6) * 5 * (1 - (frame - ats[i]) / 8) : 0;
        return (
          <div key={i} style={{ position: "absolute", left: it.x, top: it.y, width: 380, display: "flex", alignItems: "center", gap: 16, padding: "16px 20px", borderRadius: 24, background: "rgba(255,255,255,0.94)", boxShadow: "0 16px 40px rgba(20,12,40,0.35)", fontFamily: FONT_UI, scale: String(0.7 + p * 0.3), opacity: Math.min(1, p * 2), rotate: `${it.r}deg`, translate: `${buzz}px ${(1 - p) * -40}px` }}>
            <div style={{ width: 52, height: 52, borderRadius: 14, background: it.c, display: "flex", alignItems: "center", justifyContent: "center", flex: "none" }}>
              <Icon d={it.icon} size={28} color="#fff" />
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 24, fontWeight: 600, color: TR.ink }}>{it.t}</div>
              <div style={{ fontSize: 19, color: TR.muted }}>{it.s}</div>
            </div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

/** "ToothReferral": the wordmark lands on the wall above the head, behind the hair. */
const LogoBehind: React.FC<{ from: number; to: number; top?: number; width?: number }> = ({ from, to, top = 150, width = 640 }) => {
  const frame = useCurrentFrame();
  const p = sp(frame, from, 15, 120);
  const out = interpolate(frame, [to - 9, to], [0, 1], clamp);
  if (frame < from || frame > to) return null;
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top, display: "flex", justifyContent: "center", opacity: Math.min(1, p * 1.6) * (1 - out), scale: String(interpolate(p, [0, 1], [0.9, 1])), filter: out > 0 ? `blur(${out * 8}px)` : undefined }}>
      <LogoReveal at={from} width={width} revealDur={18} shineDur={28} />
    </div>
  );
};

/** The referral travels from the GP's office to the specialist along an arc over the head (behind it). */
const Journey: React.FC<{ from: number; to: number; sendAt: number; attachAt: number }> = ({ from, to, sendAt, attachAt }) => {
  const frame = useCurrentFrame();
  const out = interpolate(frame, [to - 8, to], [0, 1], clamp);
  if (frame < from || frame > to) return null;
  const A = [190, 330];
  const B = [890, 330];
  const C1 = [330, 40];
  const C2 = [750, 40];
  const t = ramp(frame, sendAt, sendAt + 34, easeIO);
  const u = 1 - t;
  const P = [0, 1].map((k) => u * u * u * A[k] + 3 * u * u * t * C1[k] + 3 * u * t * t * C2[k] + t * t * t * B[k]);
  const draw = ramp(frame, from + 4, from + 22);
  const landed = sp(frame, sendAt + 34, 12, 200);
  const att = sp(frame, attachAt, 12, 220);
  const Office: React.FC<{ x: number; name: string; initials: string; d: number }> = ({ x, name, initials, d }) => {
    const p = sp(frame, from + d, 14, 170);
    return (
      <div style={{ position: "absolute", left: x - 120, top: 270, width: 240, display: "flex", flexDirection: "column", alignItems: "center", scale: String(p), opacity: Math.min(1, p * 1.6) }}>
        <div style={{ ...glass(60), width: 120, height: 120, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT_UI, fontSize: 38, fontWeight: 600 }}>{initials}</div>
        <div style={{ marginTop: 10, fontFamily: FONT_UI, fontSize: 22, fontWeight: 500, color: "rgba(255,255,255,0.85)" }}>{name}</div>
      </div>
    );
  };
  return (
    <AbsoluteFill style={{ opacity: 1 - out }}>
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        <path d={`M${A} C${C1} ${C2} ${B}`} fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth={4} strokeDasharray="2 14" strokeLinecap="round" pathLength={1} style={{ strokeDashoffset: 0, opacity: draw }} />
      </svg>
      <Office x={A[0]} name="Bright Smile Dental" initials="BS" d={0} />
      <Office x={B[0]} name="Endo Specialists" initials="ES" d={5} />
      {frame >= sendAt - 6 && (
        <div style={{ position: "absolute", left: P[0] - 110, top: P[1] - 44, width: 220, background: "#fff", borderRadius: 18, padding: "14px 18px", boxShadow: `0 16px 40px rgba(4,2,20,0.45), 0 0 ${30 * (1 - landed)}px ${TR.purpleBright}`, fontFamily: FONT_UI, scale: String(interpolate(ramp(frame, sendAt - 6, sendAt + 4), [0, 1], [0.6, 1]) * (1 - landed * 0.15)) }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Avatar initials="MA" size={40} />
            <div style={{ fontSize: 20, fontWeight: 600, color: TR.ink }}>Maria Alvarez</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 8, fontSize: 17, color: TR.purple, opacity: att, translate: `0px ${(1 - att) * 6}px` }}>
            <Icon d={ICON.clip} size={18} />
            X-rays attached
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
};

/** A ring closes around the speaker: the communication loop. */
const Loop: React.FC<{ from: number; to: number; closeAt: number }> = ({ from, to, closeAt }) => {
  const frame = useCurrentFrame();
  const out = interpolate(frame, [to - 8, to], [0, 1], clamp);
  if (frame < from || frame > to) return null;
  const R = 420;
  const C = 2 * Math.PI * R;
  const k = ramp(frame, from, closeAt, easeIO);
  const done = sp(frame, closeAt, 11, 200);
  const node = (a: number, label: string, i: number) => {
    const x = 618 + Math.cos(a) * R;
    const y = 700 + Math.sin(a) * R;
    const p = sp(frame, from + i * 4, 13, 190);
    return (
      <div key={label} style={{ position: "absolute", left: x - 34, top: y - 34, width: 68, height: 68, borderRadius: 34, background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT_UI, fontWeight: 600, fontSize: 24, color: TR.purple, scale: String(p), boxShadow: `0 10px 30px rgba(4,2,20,0.4)` }}>
        {label}
      </div>
    );
  };
  return (
    <AbsoluteFill style={{ opacity: 1 - out }}>
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        <circle cx={618} cy={700} r={R} fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth={10} />
        <circle cx={618} cy={700} r={R} fill="none" stroke={TR.purpleBright} strokeWidth={10} strokeLinecap="round" strokeDasharray={`${k * C} ${C}`} transform="rotate(200 618 700)" style={{ filter: `drop-shadow(0 0 ${12 + done * 18}px ${TR.purpleBright})` }} />
      </svg>
      {node((200 * Math.PI) / 180, "GP", 0)}
      {node((340 * Math.PI) / 180, "ES", 1)}
      <div style={{ position: "absolute", left: 618 - 38, top: 700 - R - 38, width: 76, height: 76, borderRadius: 38, background: TR.green, display: "flex", alignItems: "center", justifyContent: "center", scale: String(done), boxShadow: `0 0 ${30 * done}px ${TR.green}AA` }}>
        <Icon d={ICON.check} size={44} color="#fff" />
      </div>
    </AbsoluteFill>
  );
};

/** Status updates appear on the wall on both sides of the head: no need to ask. */
const Updates: React.FC<{ from: number; to: number; at: number[] }> = ({ from, to, at: ats }) => {
  const frame = useCurrentFrame();
  const out = interpolate(frame, [to - 8, to], [0, 1], clamp);
  if (frame < from || frame > to) return null;
  const items = [
    { t: "Referral received", x: 40, y: 250 },
    { t: "Patient booked", x: 40, y: 360 },
    { t: "Consult done", x: 730, y: 250 },
    { t: "Notes sent", x: 730, y: 360 },
  ];
  return (
    <AbsoluteFill style={{ opacity: 1 - out }}>
      {items.map((it, i) => {
        const p = sp(frame, ats[i], 13, 200);
        return (
          <div key={i} style={{ position: "absolute", left: it.x, top: it.y, ...glass(999), padding: "14px 22px", display: "flex", alignItems: "center", gap: 12, fontFamily: FONT_UI, fontSize: 25, fontWeight: 500, opacity: Math.min(1, p * 1.6), translate: `${(1 - p) * (it.x < 500 ? -40 : 40)}px 0px` }}>
            <div style={{ width: 30, height: 30, borderRadius: 15, background: TR.green, display: "flex", alignItems: "center", justifyContent: "center", flex: "none" }}>
              <Icon d={ICON.check} size={20} color="#fff" />
            </div>
            {it.t}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------------------------------
// In front of the speaker

/** A soft white pill (who this is for). */
const Pill: React.FC<{ from: number; to: number; top: number; children: React.ReactNode }> = ({ from, to, top, children }) => {
  const { p, out, on } = useWindow(from, to);
  if (!on) return null;
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top, display: "flex", justifyContent: "center", opacity: Math.min(1, p * 1.6) * (1 - out), translate: `0px ${(1 - p) * 24}px` }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 28px", borderRadius: 999, background: "rgba(255,255,255,0.92)", boxShadow: "0 14px 34px rgba(20,16,40,0.25)", fontFamily: FONT_UI, fontSize: 28, fontWeight: 500, color: TR.ink }}>
        {children}
      </div>
    </div>
  );
};

/** The questions the front desk keeps fielding, popping up beside the hands that ask them. */
const Questions: React.FC<{ qs: { t: string; at: number; x: number; y: number; side: "l" | "r" }[]; to: number }> = ({ qs, to }) => {
  const frame = useCurrentFrame();
  if (frame < qs[0].at - 2 || frame > to) return null;
  return (
    <AbsoluteFill>
      {qs.map((q, i) => {
        const p = sp(frame, q.at - 3, 12, 190);
        const fall = interpolate(frame, [to - 12 + i * 2, to], [0, 1], clamp);
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: q.x,
              top: q.y + fall * 160,
              maxWidth: 470,
              padding: "20px 26px",
              borderRadius: 30,
              borderBottomLeftRadius: q.side === "l" ? 8 : 30,
              borderBottomRightRadius: q.side === "r" ? 8 : 30,
              background: "rgba(255,255,255,0.96)",
              boxShadow: "0 16px 40px rgba(20,16,40,0.28)",
              fontFamily: FONT_UI,
              fontSize: 30,
              fontWeight: 500,
              lineHeight: 1.25,
              color: TR.ink,
              transformOrigin: q.side === "l" ? "0% 100%" : "100% 100%",
              scale: String(p),
              opacity: Math.min(1, p * 2) * (1 - fall),
              filter: fall > 0 ? `blur(${fall * 6}px)` : undefined,
            }}
          >
            {q.t}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

/** "One live dashboard": a compact referral board rises from between the hands. */
const LiveBoard: React.FC<{ from: number; to: number; updateAt: number }> = ({ from, to, updateAt }) => {
  const frame = useCurrentFrame();
  const { p, out, on } = useWindow(from, to, 10);
  const upd = sp(frame, updateAt, 12, 200);
  if (!on) return null;
  const rows = [
    { n: "Maria Alvarez", o: "Bright Smile Dental", s: "New", c: TR.purple, bg: TR.purpleSoft },
    { n: "James Carter", o: "Holland General", s: "Scheduled", c: TR.amber, bg: TR.amberSoft },
    { n: "Priya Shah", o: "Toledo Family Dental", s: "Contacted", c: "#3B82F6", bg: "#E5EEFF" },
  ];
  const live = 0.5 + 0.5 * Math.sin(frame / 5);
  return (
    <div style={{ position: "absolute", left: 150, width: 780, top: 1010, opacity: Math.min(1, p * 1.5) * (1 - out), translate: `0px ${(1 - p) * 140 + out * 60}px`, scale: String(interpolate(p, [0, 1], [0.86, 1])), transformOrigin: "50% 100%" }}>
      <Card style={{ padding: "26px 30px 18px", borderRadius: 30, position: "relative", overflow: "hidden", fontFamily: FONT_UI }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 12 }}>
          <div style={{ fontSize: 30, fontWeight: 600, color: TR.ink, flex: 1 }}>Referrals</div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 22, fontWeight: 500, color: TR.green }}>
            <div style={{ width: 12, height: 12, borderRadius: 6, background: TR.green, opacity: 0.4 + live * 0.6, boxShadow: `0 0 ${8 * live}px ${TR.green}` }} />
            Live
          </div>
        </div>
        {rows.map((r, i) => {
          const rp = sp(frame, from + 8 + i * 5, 14, 190);
          const isUpd = i === 1;
          const s = isUpd && upd > 0.5 ? "Completed" : r.s;
          const c = isUpd && upd > 0.5 ? TR.green : r.c;
          const bg = isUpd && upd > 0.5 ? TR.greenSoft : r.bg;
          return (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 16, padding: "14px 0", borderTop: `1.5px solid ${TR.border}`, opacity: Math.min(1, rp * 1.6), translate: `0px ${(1 - rp) * 16}px` }}>
              <Avatar initials={r.n.split(" ").map((x) => x[0]).join("")} size={50} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 25, fontWeight: 600, color: TR.ink }}>{r.n}</div>
                <div style={{ fontSize: 20, color: TR.muted, marginTop: 2 }}>from {r.o}</div>
              </div>
              <Badge color={c} bg={bg} style={{ fontSize: 20, fontWeight: 500, scale: isUpd ? String(1 + 0.12 * Math.sin(Math.PI * Math.min(1, upd))) : undefined }}>
                {s}
              </Badge>
            </div>
          );
        })}
        <LightSweep at={from + 24} opacity={0.45} />
      </Card>
    </div>
  );
};

/** Notes, X-rays and insurance fly in from both sides and become one referral, where the hands meet. */
const Together: React.FC<{ from: number; to: number }> = ({ from, to }) => {
  const frame = useCurrentFrame();
  const { p, out, on } = useWindow(from + 16, to, 8);
  if (frame < from || !on && frame > to) return null;
  const chips = [
    { t: "Clinical notes", sx: -360, sy: -40 },
    { t: "X-rays", sx: 380, sy: -110 },
    { t: "Insurance", sx: -320, sy: 120 },
  ];
  const merge = ramp(frame, from + 2, from + 18, easeIO);
  return (
    <AbsoluteFill style={{ opacity: 1 - out }}>
      {merge < 1 &&
        chips.map((c, i) => (
          <div key={i} style={{ position: "absolute", left: 540 - 110 + c.sx * (1 - merge), top: 1180 + c.sy * (1 - merge), width: 220, textAlign: "center", padding: "14px 0", borderRadius: 999, background: "#fff", fontFamily: FONT_UI, fontSize: 25, fontWeight: 500, color: TR.ink, opacity: interpolate(frame, [from, from + 5], [0, 1], clamp) * (1 - merge * 0.6), scale: String(1 - merge * 0.4), boxShadow: "0 12px 30px rgba(4,2,20,0.35)" }}>
            {c.t}
          </div>
        ))}
      {frame >= from + 14 && (
        <div style={{ position: "absolute", left: 230, width: 620, top: 1060, opacity: Math.min(1, p * 1.5), scale: String(interpolate(p, [0, 1], [0.7, 1])) }}>
          <Card style={{ padding: "22px 28px", borderRadius: 28, fontFamily: FONT_UI, position: "relative", overflow: "hidden" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <Avatar initials="MA" size={56} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 27, fontWeight: 600, color: TR.ink }}>Maria Alvarez</div>
                <div style={{ fontSize: 20, color: TR.muted }}>One referral, everything inside</div>
              </div>
            </div>
            <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
              {["Notes", "X-rays", "Insurance"].map((t) => (
                <Badge key={t} color={TR.green} bg={TR.greenSoft} style={{ fontSize: 19, fontWeight: 500 }}>
                  <Icon d={ICON.check} size={18} color={TR.green} />
                  {t}
                </Badge>
              ))}
            </div>
            <LightSweep at={from + 24} opacity={0.5} />
          </Card>
        </div>
      )}
    </AbsoluteFill>
  );
};

/** Treatment notes on the open palm; one click sends them back to the referring dentist. */
const NotesBack: React.FC<{ from: number; to: number; clickAt: number }> = ({ from, to, clickAt }) => {
  const frame = useCurrentFrame();
  const { p, on } = useWindow(from, to + 20, 6);
  const sent = sp(frame, clickAt + 3, 12, 220);
  const fly = ramp(frame, clickAt + 10, clickAt + 26, (t) => t * t * t);
  if (!on || frame > to) return null;
  return (
    <>
      <div style={{ position: "absolute", left: 150, width: 560, top: 1000, opacity: Math.min(1, p * 1.5) * (1 - fly), translate: `${fly * 700}px ${(1 - p) * 70 - fly * 120}px`, rotate: `${fly * 8}deg`, scale: String(interpolate(p, [0, 1], [0.85, 1]) * (1 - fly * 0.3)) }}>
        <Card style={{ padding: "22px 26px", borderRadius: 26, fontFamily: FONT_UI }}>
          <div style={{ fontSize: 18, fontWeight: 600, color: TR.purple, letterSpacing: 1.5, textTransform: "uppercase" }}>Treatment notes</div>
          <div style={{ fontSize: 26, fontWeight: 600, color: TR.ink, marginTop: 6 }}>Maria Alvarez · Root canal #3</div>
          <div style={{ fontSize: 20, color: TR.muted, marginTop: 4 }}>Back to Dr. Patel, Bright Smile Dental</div>
          <div style={{ marginTop: 16, display: "inline-flex", alignItems: "center", gap: 10, padding: "12px 22px", borderRadius: 14, background: sent > 0.5 ? TR.green : TR.purple, color: "#fff", fontSize: 22, fontWeight: 600, scale: String(1 - 0.06 * Math.sin(Math.PI * Math.min(1, Math.max(0, (frame - clickAt) / 6)))) }}>
            <Icon d={sent > 0.5 ? ICON.check : ICON.send} size={22} color="#fff" />
            {sent > 0.5 ? "Sent" : "Send notes"}
          </div>
        </Card>
      </div>
      {fly === 0 && <Cursor path={[{ f: clickAt - 22, x: 760, y: 1360 }, { f: clickAt - 2, x: 290, y: 1205 }, { f: clickAt + 12, x: 290, y: 1205 }]} clicks={[clickAt]} />}
    </>
  );
};

// ---------------------------------------------------------------------------------------------------
// Captions: Instrument Serif, regular weight, sentence case, 2-4 words at a time

type Chunk = { words: { t: string; at: number }[]; from: number; to: number };
const CAPTIONS: Chunk[] = (() => {
  const toks: { t: string; at: number; end: number }[] = [];
  for (const w of WORDS) {
    const t = w.word.trim();
    const prev = toks[toks.length - 1];
    if (t.startsWith("-") && prev) {
      prev.t = (prev.t + t).replace(/^x-/i, "X-");
      prev.end = w.end * FPS;
    } else if (prev && /^tooth$/i.test(prev.t) && /^referral/i.test(t)) {
      prev.t = "ToothReferral" + t.replace(/^referral/i, "");
      prev.end = w.end * FPS;
    } else {
      toks.push({ t, at: Math.round(w.start * FPS), end: Math.round(w.end * FPS) });
    }
  }
  const chunks: Chunk[] = [];
  let cur: typeof toks = [];
  const flush = () => {
    if (!cur.length) return;
    chunks.push({ words: cur.map((x) => ({ t: x.t, at: x.at })), from: cur[0].at - 2, to: cur[cur.length - 1].end + 8 });
    cur = [];
  };
  for (const tk of toks) {
    const len = cur.map((x) => x.t).join(" ").length;
    if (cur.length && (cur.length >= 4 || len + tk.t.length > 22)) flush();
    cur.push(tk);
    if (/[.,?!]$/.test(tk.t)) flush();
  }
  flush();
  for (let i = 0; i < chunks.length - 1; i++) chunks[i].to = Math.min(chunks[i].to, chunks[i + 1].from);
  return chunks;
})();

const Captions: React.FC<{ hide: [number, number][] }> = ({ hide }) => {
  const frame = useCurrentFrame();
  const c = CAPTIONS.find((x) => frame >= x.from && frame < x.to);
  if (!c || hide.some(([a, b]) => frame >= a && frame < b)) return null;
  const k = interpolate(frame, [c.from, c.from + 5], [0, 1], clamp);
  return (
    <div style={{ position: "absolute", left: 70, right: 70, top: 1488, textAlign: "center", ...SERIF, fontSize: 70, lineHeight: 1.1, color: "#fff", letterSpacing: 0.3, opacity: k, translate: `0px ${(1 - k) * 10}px`, textShadow: "0 2px 20px rgba(10,6,30,0.65), 0 1px 4px rgba(10,6,30,0.5)" }}>
      {c.words.map((w, i) => (
        <span key={i} style={{ opacity: frame >= w.at - 1 ? 1 : 0.72 }}>
          {w.t.replace(/,$/, "")}
          {i < c.words.length - 1 ? " " : ""}
        </span>
      ))}
    </div>
  );
};

// ---------------------------------------------------------------------------------------------------
// The edit

const T = {
  hook: at("nobody"),
  but: at("but"),
  theyre: at("theyre"),
  patients1End: endOf("patients", 1),
  ifYou: at("if"),
  questions: at("questions"),
  q1: at("did", 1),
  q2: at("where"),
  q3: at("did", 2),
  every: at("every"),
  interruption: at("interruption"),
  tooth: at("tooth"),
  one: at("one", 1),
  dashboard: at("dashboard"),
  stands: at("stands"),
  referring: at("referring", 1) - 3,
  sends: at("sends"),
  attached: at("attached"),
  keeping: at("keeping"),
  start: endOf("start"),
  once: at("once"),
  notes: at("notes"),
  click: at("click"),
  closing: at("closing"),
  loop: endOf("loop"),
  instead: at("instead", 2),
  see2: at("see", 2),
  focus: at("focus"),
};
/** "Every answer means another interruption": a slow push-in on the face, released on the next cut. */
const PUSH = { from: T.every - 4, to: T.interruption + 10, scale: 1.8 };
const WALL_AT = T.tooth - 4;

export const ToothUgc2: React.FC = () => {
  const frame = useCurrentFrame();
  const f0 = Math.min(frame, CUT_FRAMES - 1);
  const base = framingAt(f0);
  const pushK = base === WIDE && f0 >= PUSH.from ? ramp(f0, PUSH.from, PUSH.to, easeIO) : 0;
  const fr = pushK > 0 ? onFace(interpolate(pushK, [0, 1], [WIDE.scale, PUSH.scale])) : base;
  const freeze = frame >= CUT_FRAMES - 1;
  const speaker = (layer: "full" | "cutout", style?: React.CSSProperties) => {
    const el = <TalentLayer talent={TL} layer={layer} framing={fr} style={style} />;
    return freeze ? <Freeze frame={CUT_FRAMES - 2}>{el}</Freeze> : el;
  };
  return (
    <AbsoluteFill style={{ background: "#1B1240" }}>
      <FontGate>
        <Room />
        <BrandGrade from={WALL_AT} />

        {/* behind the speaker */}
        <DepthWords
          from={T.hook}
          to={T.theyre - 2}
          top={110}
          left={70}
          size={116}
          color="#1E1A2E"
          italic
          lines={[
            [{ text: "Nobody", at: at("nobody") }, { text: "tells", at: at("tells") }],
            [{ text: "you", at: at("you", 1) }, { text: "this.", at: at("this", 1) }],
          ]}
        />
        <Chaos from={T.theyre - 2} to={T.ifYou} />
        <Interruptions at={[at("every"), at("answer"), at("means"), at("interruption")].map((x) => x - 2)} to={WALL_AT + 4} />
        <LogoBehind from={T.tooth} to={T.one - 4} top={36} width={500} />
        <Journey from={T.referring - 4} to={T.keeping - 2} sendAt={T.sends} attachAt={T.attached - 4} />
        <Loop from={T.closing - 6} to={T.instead - 2} closeAt={T.loop - 4} />
        <Updates from={T.instead} to={T.focus - 6} at={[T.see2 - 4, T.see2 + 2, T.see2 + 8, T.see2 + 14]} />
        <LogoBehind from={T.focus - 2} to={UGC2_DURATION + 30} top={36} width={500} />

        {speaker("cutout", { filter: "drop-shadow(0 24px 50px rgba(4,2,20,0.4))" })}
        {/* the mic sits in front of the speaker but the matte half-drops it: put it back from the footage */}
        {speaker("full", MIC_MASK)}


        {/* in front of the speaker */}
        <Pill from={T.ifYou + 10} to={T.q1 - 4} top={1300}>
          <Icon d="M12 2c-2.5 0-4 1.2-5.5 1.2S4 2.5 3 4c-1.6 2.4-.4 7 1 10 .8 1.7 1 5 2.5 7 .8 1 1.8.5 2-.7.3-1.8.6-4.5 3.5-4.5s3.2 2.7 3.5 4.5c.2 1.2 1.2 1.7 2 .7 1.5-2 1.7-5.3 2.5-7 1.4-3 2.6-7.6 1-10-1-1.5-2.5-.8-3.5-.8S14.5 2 12 2z" size={30} />
          For endo and oral surgery practices
        </Pill>
        <Questions
          to={T.every}
          qs={[
            { t: "Did anyone call this patient?", at: T.q1, x: 560, y: 930, side: "r" },
            { t: "Where does this referral stand?", at: T.q2, x: 50, y: 820, side: "l" },
            { t: "Did the GP send the updated X-rays?", at: T.q3, x: 50, y: 1040, side: "l" },
          ]}
        />
        <LiveBoard from={T.one - 4} to={T.referring - 6} updateAt={T.stands - 8} />
        <Together from={T.keeping - 2} to={T.once - 4} />
        <NotesBack from={T.notes - 8} to={T.closing - 4} clickAt={T.click} />

        <Captions hide={[[0, T.but - 2]]} />
      </FontGate>

      <Audio src={staticFile("audio/voice/tr2-cut.wav")} />
      <Audio
        src={staticFile("audio/music/showcase-bed.m4a")}
        volume={(f) => 0.1 * interpolate(f, [0, 20, UGC2_DURATION - 40, UGC2_DURATION - 2], [0, 1, 1, 0], clamp)}
      />
      {[
        { f: T.theyre - 2, s: "whoosh-short", v: 0.18 },
        { f: T.q1 - 3, s: "pop-1", v: 0.16 },
        { f: T.q2 - 3, s: "pop-2", v: 0.16 },
        { f: T.q3 - 3, s: "pop-3", v: 0.16 },
        ...["every", "answer", "means", "interruption"].map((w, i) => ({ f: at(w) - 3, s: `tick-${i + 2}`, v: 0.14 })),
        { f: WALL_AT, s: "whoosh-long", v: 0.2 },
        { f: T.tooth + 10, s: "shimmer", v: 0.16 },
        { f: T.one - 4, s: "whoosh-short", v: 0.16 },
        { f: T.sends, s: "whoosh-short", v: 0.14 },
        { f: T.keeping + 14, s: "chime", v: 0.12 },
        { f: T.click, s: "click", v: 0.24 },
        { f: T.click + 10, s: "whoosh-short", v: 0.14 },
        { f: T.loop - 4, s: "chime", v: 0.14 },
        { f: T.see2 - 4, s: "tick-1", v: 0.14 },
        { f: T.focus - 2, s: "shimmer", v: 0.14 },
      ].map((x, i) => (
        <Sequence key={i} from={x.f} layout="none">
          <Audio src={staticFile(`audio/sfx/${x.s}.wav`)} volume={x.v} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
