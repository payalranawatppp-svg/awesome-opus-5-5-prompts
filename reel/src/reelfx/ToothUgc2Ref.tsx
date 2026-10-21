/**
 * ToothReferral UGC #2, "ad" cut: the same take re-edited in the style of a client reference (a polished
 * business ad), taken as inspiration, not a copy:
 *   - no running subtitles: only key phrases, a white line plus a bold brand-purple line, in open space;
 *   - one huge word behind the speaker, a dashed "selection box" phrase, navy tag pills beside him,
 *     a tilted 3D card, app-style icons on a dashed line, a darkened beat for the key line;
 *   - framing that changes per cut (wide / medium / close) with a slow push inside each shot;
 *   - logo watermark top-right; outro: the logo on white.
 * Shares the cut, cutout, room and voice with ToothUgc2.tsx. Demo data; names are fictional.
 */
import React from "react";
import { AbsoluteFill, Audio, Freeze, Img, Sequence, interpolate, spring, staticFile, useCurrentFrame } from "remotion";
import { FontGate, TALENT, TalentLayer, type Framing } from "../effects";
import transcript from "../data/transcript-tr2.json";
import cut from "../data/tr2-cut-segments.json";
import { FONT_DISPLAY, FONT_UI } from "../theme";
import { LogoReveal, LogoWhite, easeIO, easeOut, ramp } from "../tr/motion";
import { Avatar, Badge, Card, Cursor, ICON, Icon, TR, clamp } from "../tr/ui";
import { FACE, MIC_MASK, Room } from "./ToothUgc2";

const TL = TALENT["tr2-cut"];
const FPS = 30;
const CUT_FRAMES = Math.floor(cut.duration * FPS);
const OUTRO = 84;
export const UGC2_REF_DURATION = CUT_FRAMES + OUTRO;

const ACCENT = "#9A6BFF"; // brand purple, lifted for legibility over footage
const NAVY = "#14183A";

// ---------------------------------------------------------------------------------------------------
// Timing and framing

const WORDS = transcript["tr2-cut"].words;
const norm = (w: string) => w.toLowerCase().replace(/[^a-z]/g, "");
const at = (word: string, n = 1) => {
  const hits = WORDS.filter((w) => norm(w.word) === word);
  if (!hits[n - 1]) throw new Error(`"${word}" #${n} not in transcript`);
  return Math.round(hits[n - 1].start * FPS);
};
const sp = (frame: number, a: number, damping = 15, stiffness = 160) =>
  frame < a ? 0 : spring({ frame: frame - a, fps: FPS, config: { damping, stiffness, mass: 0.75 } });

const onFace = (s: number, dx = 0): Framing => ({ scale: s, x: FACE.x * 1.5 - FACE.x * s + dx, y: FACE.y * 1.5 - FACE.y * s });
const SEGS = cut.segments.map((s) => ({ from: Math.round(s.at * FPS), len: Math.round((s.out - s.in) * FPS) }));
/** One shot size per piece of the cut, like a multi-camera ad: wide, medium, close, never the same twice in a row. */
const SHOTS = [1.5, 1.78, 1.5, 2.0, 1.62, 1.86, 1.5, 1.95, 1.6, 1.8, 1.5, 1.9, 1.66, 1.5];
const framingAt = (frame: number): Framing => {
  let i = 0;
  while (i + 1 < SEGS.length && SEGS[i + 1].from <= frame) i++;
  const s0 = SHOTS[i % SHOTS.length];
  // slow push through the shot (about 4%), like a gimbal creeping in
  const k = ramp(frame, SEGS[i].from, SEGS[i].from + Math.max(30, SEGS[i].len), easeIO);
  return onFace(s0 * (1 + 0.04 * k));
};

// ---------------------------------------------------------------------------------------------------
// Type and graphics

const SHADOW = "0 3px 24px rgba(8,4,24,0.55), 0 1px 3px rgba(8,4,24,0.5)";

/** Two-tone key phrase: a white line, then a bold purple line; words rise in with a blur. */
const TwoTone: React.FC<{ from: number; to: number; top: number; white: string; accent: string; size?: number; accentFirst?: boolean }> = ({
  from,
  to,
  top,
  white,
  accent,
  size = 62,
  accentFirst,
}) => {
  const frame = useCurrentFrame();
  const out = interpolate(frame, [to - 7, to], [0, 1], clamp);
  if (frame < from - 1 || frame > to) return null;
  const line = (text: string, isAccent: boolean, delay: number) => (
    <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", columnGap: size * 0.26 }}>
      {text.split(" ").map((w, i) => {
        const k = interpolate(frame, [from + delay + i * 3, from + delay + i * 3 + 9], [0, 1], clamp);
        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              fontFamily: isAccent ? FONT_DISPLAY : FONT_UI,
              fontWeight: isAccent ? 800 : 600,
              fontSize: isAccent ? size * 1.12 : size,
              letterSpacing: isAccent ? -size * 0.02 : -size * 0.005,
              color: isAccent ? ACCENT : "#fff",
              opacity: k,
              translate: `0px ${(1 - easeOut(k)) * size * 0.35}px`,
              filter: k < 1 ? `blur(${(1 - k) * 10}px)` : undefined,
              textShadow: SHADOW,
            }}
          >
            {w}
          </span>
        );
      })}
    </div>
  );
  const nWhite = white.split(" ").length;
  return (
    <div style={{ position: "absolute", left: 50, right: 50, top, lineHeight: 1.08, textAlign: "center", opacity: 1 - out, filter: out > 0 ? `blur(${out * 8}px)` : undefined }}>
      {accentFirst ? line(accent, true, 0) : line(white, false, 0)}
      {accentFirst ? line(white, false, accent.split(" ").length * 3 + 2) : line(accent, true, nWhite * 3 + 2)}
    </div>
  );
};

/** A phrase inside a dashed "selection" box with corner handles, as if picked in a design tool. */
const SelectionBox: React.FC<{ from: number; to: number; top: number; white: string; accent: string; clickAt?: number }> = ({ from, to, top, white, accent, clickAt }) => {
  const frame = useCurrentFrame();
  const out = interpolate(frame, [to - 7, to], [0, 1], clamp);
  const box = ramp(frame, from, from + 12, easeOut);
  const txt = interpolate(frame, [from + 6, from + 16], [0, 1], clamp);
  const acc = interpolate(frame, [from + 12, from + 22], [0, 1], clamp);
  const clicked = clickAt !== undefined && frame >= clickAt;
  const pulse = clickAt !== undefined ? interpolate(frame, [clickAt, clickAt + 4, clickAt + 10], [0, 1, 0], clamp) : 0;
  if (frame < from || frame > to) return null;
  const handle = (pos: React.CSSProperties) => <div style={{ position: "absolute", width: 14, height: 14, background: "#fff", border: `2px solid ${ACCENT}`, borderRadius: 3, ...pos }} />;
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top, display: "flex", justifyContent: "center", opacity: 1 - out }}>
      <div style={{ position: "relative", padding: "18px 34px", textAlign: "center", scale: String(1 + pulse * 0.04), background: clicked ? "rgba(154,107,255,0.18)" : "rgba(8,4,24,0.12)", borderRadius: 4 }}>
        <div style={{ position: "absolute", inset: 0, border: "2.5px dashed rgba(255,255,255,0.95)", borderRadius: 4, opacity: box, clipPath: `inset(0 ${(1 - box) * 100}% 0 0)` }} />
        {box > 0.6 && (
          <>
            {handle({ left: -8, top: -8 })}
            {handle({ right: -8, top: -8 })}
            {handle({ left: -8, bottom: -8 })}
            {handle({ right: -8, bottom: -8 })}
          </>
        )}
        <div style={{ fontFamily: FONT_UI, fontWeight: 600, fontSize: 50, color: "#fff", textShadow: SHADOW, opacity: txt, translate: `0px ${(1 - txt) * 14}px` }}>{white}</div>
        <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: 58, color: ACCENT, textShadow: SHADOW, opacity: acc, translate: `0px ${(1 - acc) * 14}px`, letterSpacing: -1 }}>{accent}</div>
      </div>
    </div>
  );
};

/** One huge word on the wall behind the speaker. */
const BigWord: React.FC<{ from: number; to: number; text: string; top: number; size: number }> = ({ from, to, text, top, size }) => {
  const frame = useCurrentFrame();
  const k = sp(frame, from, 16, 140);
  const out = interpolate(frame, [to - 7, to], [0, 1], clamp);
  if (frame < from || frame > to) return null;
  return (
    <div style={{ position: "absolute", left: -100, right: -100, top, textAlign: "center", fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: size, letterSpacing: size * 0.02, color: "#fff", lineHeight: 1, opacity: Math.min(1, k * 1.5) * (1 - out), scale: String(interpolate(k, [0, 1], [1.25, 1])), filter: k < 0.7 ? `blur(${(0.7 - k) * 20}px)` : out > 0 ? `blur(${out * 10}px)` : undefined, textShadow: "0 10px 50px rgba(8,4,24,0.35)" }}>
      {text}
    </div>
  );
};

/** Navy tag pills that pop in one by one beside the speaker. */
const Pills: React.FC<{ items: { t: string; at: number; icon?: string }[]; to: number; left: number; top: number; gap?: number }> = ({ items, to, left, top, gap = 88 }) => {
  const frame = useCurrentFrame();
  const out = interpolate(frame, [to - 7, to], [0, 1], clamp);
  if (frame < items[0].at - 2 || frame > to) return null;
  return (
    <AbsoluteFill style={{ opacity: 1 - out }}>
      {items.map((it, i) => {
        const p = sp(frame, it.at - 2, 12, 220);
        return (
          <div key={i} style={{ position: "absolute", left, top: top + i * gap, display: "flex", alignItems: "center", gap: 12, padding: "14px 24px", borderRadius: 16, background: NAVY, border: "1.5px solid rgba(255,255,255,0.14)", color: "#fff", fontFamily: FONT_UI, fontWeight: 600, fontSize: 32, boxShadow: "0 12px 30px rgba(8,4,24,0.4)", opacity: Math.min(1, p * 2), scale: String(0.6 + p * 0.4), transformOrigin: "0% 50%", translate: `${(1 - p) * 30}px 0px` }}>
            {it.icon && <Icon d={it.icon} size={28} color={ACCENT} />}
            {it.t}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

/** App-style icons joined by a dashed line, labels below. */
const IconLink: React.FC<{ from: number; to: number; items: { label: string; at: number; d: string }[]; top: number }> = ({ from, to, items, top }) => {
  const frame = useCurrentFrame();
  const out = interpolate(frame, [to - 7, to], [0, 1], clamp);
  if (frame < from || frame > to) return null;
  const xs = [300, 780];
  const line = ramp(frame, items[0].at + 6, items[1].at + 4);
  return (
    <AbsoluteFill style={{ opacity: 1 - out }}>
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        <line x1={xs[0] + 70} y1={top + 66} x2={xs[0] + 70 + (xs[1] - xs[0] - 140) * line} y2={top + 66} stroke="#fff" strokeWidth={3} strokeDasharray="8 10" opacity={0.85} />
      </svg>
      {items.map((it, i) => {
        const p = sp(frame, it.at - 3, 11, 210);
        return (
          <div key={i} style={{ position: "absolute", left: xs[i] - 90, top, width: 180, display: "flex", flexDirection: "column", alignItems: "center", scale: String(p), opacity: Math.min(1, p * 2) }}>
            <div style={{ width: 132, height: 132, borderRadius: 34, background: `linear-gradient(150deg, #B28DFF, ${TR.purple})`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 16px 40px ${TR.purple}77, inset 0 2px 0 rgba(255,255,255,0.4)` }}>
              <Icon d={it.d} size={66} color="#fff" />
            </div>
            <div style={{ marginTop: 14, fontFamily: FONT_UI, fontWeight: 600, fontSize: 30, color: "#fff", textShadow: SHADOW, whiteSpace: "nowrap" }}>{it.label}</div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

/** The live dashboard as a 3D card that pops up and floats beside the head. */
const DashCard: React.FC<{ from: number; to: number; updateAt: number }> = ({ from, to, updateAt }) => {
  const frame = useCurrentFrame();
  const p = sp(frame, from, 13, 150);
  const out = interpolate(frame, [to - 8, to], [0, 1], clamp);
  const upd = sp(frame, updateAt, 12, 200);
  if (frame < from || frame > to) return null;
  const float = Math.sin((frame - from) / 18) * 6;
  const rows = [
    { n: "Maria Alvarez", s: "New", c: TR.purple, bg: TR.purpleSoft },
    { n: "James Carter", s: upd > 0.5 ? "Completed" : "Scheduled", c: upd > 0.5 ? TR.green : TR.amber, bg: upd > 0.5 ? TR.greenSoft : TR.amberSoft },
    { n: "Priya Shah", s: "Contacted", c: "#3B82F6", bg: "#E5EEFF" },
  ];
  return (
    <div style={{ position: "absolute", left: 36, top: 150 + float, width: 520, perspective: 1400, opacity: Math.min(1, p * 1.5) * (1 - out) }}>
      <div style={{ transform: `rotateY(${interpolate(p, [0, 1], [-60, 18])}deg) rotateX(${interpolate(p, [0, 1], [30, 6])}deg) rotateZ(-4deg) scale(${interpolate(p, [0, 1], [0.6, 1])})`, transformOrigin: "30% 60%" }}>
        <Card style={{ padding: "22px 24px 12px", borderRadius: 26, fontFamily: FONT_UI, boxShadow: "0 40px 80px rgba(8,4,24,0.55)" }}>
          <div style={{ display: "flex", alignItems: "center", marginBottom: 8 }}>
            <div style={{ flex: 1, fontSize: 26, fontWeight: 700, color: TR.ink }}>Referrals</div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 19, fontWeight: 600, color: TR.green }}>
              <div style={{ width: 10, height: 10, borderRadius: 5, background: TR.green }} />
              Live
            </div>
          </div>
          {rows.map((r, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "11px 0", borderTop: `1.5px solid ${TR.border}` }}>
              <Avatar initials={r.n.split(" ").map((x) => x[0]).join("")} size={40} />
              <div style={{ flex: 1, fontSize: 21, fontWeight: 600, color: TR.ink }}>{r.n}</div>
              <Badge color={r.c} bg={r.bg} style={{ fontSize: 17, fontWeight: 600, padding: "4px 12px" }}>
                {r.s}
              </Badge>
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
};

/** The ToothReferral wordmark, small, top-right, all the way through. */
const Watermark: React.FC = () => {
  const frame = useCurrentFrame();
  const k = interpolate(frame, [4, 16], [0, 1], clamp);
  return (
    <div style={{ position: "absolute", right: 48, top: 64, opacity: 0.92 * k, filter: "drop-shadow(0 2px 8px rgba(8,4,24,0.45))" }}>
      <LogoWhite width={180} />
    </div>
  );
};

/** Outro: the logo on white, settling out of a tilt, with the site under it. */
const Outro: React.FC<{ from: number }> = ({ from }) => {
  const frame = useCurrentFrame();
  if (frame < from) return null;
  const f = frame - from;
  const wipe = interpolate(f, [0, 10], [0, 1], clamp);
  const p = sp(frame, from + 4, 16, 110);
  const url = sp(frame, from + 26, 15, 160);
  const shine = interpolate(f, [24, 50], [0, 1], clamp);
  const band = -30 + easeIO(shine) * 160;
  const logoMask = `url(${staticFile("tr/logo.png")})`;
  return (
    <AbsoluteFill style={{ clipPath: `circle(${wipe * 1400}px at 540px 960px)`, background: "radial-gradient(circle at 50% 45%, #FFFFFF 0%, #F1EEF8 70%, #E6E1F2 100%)" }}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 760, display: "flex", justifyContent: "center", perspective: 1600 }}>
        <div style={{ position: "relative", width: 640, height: 640 * (292 / 641), transform: `rotateX(${(1 - p) * 55}deg) scale(${interpolate(p, [0, 1], [1.5, 1])})`, opacity: Math.min(1, p * 1.6), filter: p < 0.6 ? `blur(${(0.6 - p) * 16}px)` : "drop-shadow(0 18px 30px rgba(60,30,140,0.18))" }}>
          <Img src={staticFile("tr/logo.png")} style={{ width: "100%", height: "100%", display: "block" }} />
          {shine > 0 && shine < 1 && (
            <div style={{ position: "absolute", inset: 0, maskImage: logoMask, WebkitMaskImage: logoMask, maskSize: "100% 100%", WebkitMaskSize: "100% 100%", background: `linear-gradient(105deg, transparent ${band - 12}%, ${TR.purple} ${band}%, transparent ${band + 12}%)` }} />
          )}
        </div>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 1100, textAlign: "center", fontFamily: FONT_UI, fontWeight: 600, fontSize: 38, color: TR.ink, opacity: url, translate: `0px ${(1 - url) * 16}px` }}>
        toothreferral.com
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 1160, textAlign: "center", fontFamily: FONT_UI, fontWeight: 500, fontSize: 28, color: TR.purple, opacity: url }}>
        Referrals, without the chasing.
      </div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------------------------------
// The edit

const T = {
  but: at("but"),
  theyre: at("theyre"),
  ifYou: at("if"),
  endo: at("endo"),
  surgery: at("oral"),
  q1: at("did", 1),
  q2: at("where"),
  q3: at("did", 2),
  every: at("every"),
  interruption: at("interruption"),
  tooth: at("tooth"),
  one: at("one", 1),
  stands: at("stands"),
  referring: at("referring", 1),
  attached: at("attached"),
  keeping: at("keeping"),
  start: at("start"),
  once: at("once"),
  notes: at("notes"),
  click: at("click"),
  closing: at("closing"),
  instead: at("instead", 2),
  see: at("see", 2),
  your: at("your", 4),
  focus: at("focus"),
};

export const ToothUgc2Ref: React.FC = () => {
  const frame = useCurrentFrame();
  const f0 = Math.min(frame, CUT_FRAMES - 1);
  const fr = framingAt(f0);
  const freeze = frame >= CUT_FRAMES - 1;
  const speaker = (layer: "full" | "cutout", style?: React.CSSProperties) => {
    const el = <TalentLayer talent={TL} layer={layer} framing={fr} style={style} />;
    return freeze ? <Freeze frame={CUT_FRAMES - 2}>{el}</Freeze> : el;
  };
  // the punchline beat: the room and the speaker dim so the line owns the frame
  const dim = Math.min(ramp(frame, T.every - 6, T.every + 4), 1 - ramp(frame, T.tooth - 8, T.tooth));
  return (
    <AbsoluteFill style={{ background: "#120C26" }}>
      <FontGate>
        <Room style={{ filter: "brightness(0.82) saturate(1.05)" }} />
        {/* a soft top shade (as in the reference) so the key phrases and the watermark read over the light wall */}
        <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(10,6,28,0.62) 0%, rgba(10,6,28,0.25) 22%, rgba(10,6,28,0) 38%)" }} />
        {/* behind the speaker */}
        <BigWord from={0} to={T.but + 2} text="NOBODY" top={640} size={250} />

        {speaker("cutout", { filter: "drop-shadow(0 24px 50px rgba(4,2,20,0.4))" })}
        {speaker("full", MIC_MASK)}
        <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 55%, rgba(8,4,24,0.35) 0%, rgba(8,4,24,0.85) 100%)", opacity: dim }} />

        {/* in front */}
        <Sequence from={T.tooth - 2} durationInFrames={T.one - T.tooth - 2} layout="none">
          <div style={{ position: "absolute", left: 0, right: 0, top: 46, display: "flex", justifyContent: "center", filter: "drop-shadow(0 4px 18px rgba(8,4,24,0.55))" }}>
            <LogoReveal at={0} width={430} revealDur={18} shineDur={28} />
          </div>
        </Sequence>
        <SelectionBox from={T.but - 2} to={T.theyre - 2} top={1180} white="Your front office isn't" accent="underperforming" />
        <TwoTone from={T.theyre} to={T.ifYou - 2} top={150} white="Stuck chasing" accent="referrals" />
        <IconLink
          from={T.endo - 4}
          to={T.q1 - 4}
          top={150}
          items={[
            { label: "Endodontics", at: T.endo, d: "M12 2c-2.5 0-4 1.2-5.5 1.2S4 2.5 3 4c-1.6 2.4-.4 7 1 10 .8 1.7 1 5 2.5 7 .8 1 1.8.5 2-.7.3-1.8.6-4.5 3.5-4.5s3.2 2.7 3.5 4.5c.2 1.2 1.2 1.7 2 .7 1.5-2 1.7-5.3 2.5-7 1.4-3 2.6-7.6 1-10-1-1.5-2.5-.8-3.5-.8S14.5 2 12 2z" },
            { label: "Oral surgery", at: T.surgery, d: ICON.shield },
          ]}
        />
        <Pills
          to={T.every - 4}
          left={600}
          top={880}
          items={[
            { t: "Called the patient?", at: T.q1, icon: ICON.chat },
            { t: "Where's it at?", at: T.q2, icon: ICON.inbox },
            { t: "Updated X-rays?", at: T.q3, icon: ICON.clip },
          ]}
        />
        <TwoTone from={T.every} to={T.tooth - 4} top={900} white="Every answer means" accent="another interruption" size={58} />
        <DashCard from={T.one - 4} to={T.referring - 6} updateAt={T.stands - 6} />
        <Pills
          to={T.once - 4}
          left={600}
          top={860}
          items={[
            { t: "Case sent", at: T.referring, icon: ICON.send },
            { t: "X-rays attached", at: T.attached - 6, icon: ICON.clip },
            { t: "All in one place", at: T.keeping + 6, icon: ICON.check },
          ]}
        />
        <SelectionBox from={T.notes - 4} to={T.closing + 20} top={1180} white="Notes back to the dentist in" accent="one click" clickAt={T.click} />
        {frame >= T.click - 24 && frame <= T.click + 14 && <Cursor path={[{ f: T.click - 24, x: 860, y: 1480 }, { f: T.click - 2, x: 640, y: 1330 }, { f: T.click + 14, x: 640, y: 1330 }]} clicks={[T.click]} />}
        <TwoTone from={T.instead} to={T.your - 2} top={150} white="Stop asking for updates." accent="Just see them." />
        <TwoTone from={T.your} to={CUT_FRAMES + 2} top={150} white="Your team can focus on" accent="patients" size={64} />

        {(frame < T.tooth - 4 || frame > T.one - 2) && <Watermark />}
        <Outro from={CUT_FRAMES - 4} />
      </FontGate>

      <Audio src={staticFile("audio/voice/tr2-cut.wav")} />
      <Audio src={staticFile("audio/music/showcase-bed.m4a")} volume={(f) => 0.13 * interpolate(f, [0, 15, UGC2_REF_DURATION - 30, UGC2_REF_DURATION - 1], [0, 1, 1, 0], clamp)} />
      {[
        { f: 0, s: "impact", v: 0.18 },
        { f: T.but - 2, s: "click", v: 0.16 },
        { f: T.theyre, s: "whoosh-short", v: 0.16 },
        { f: T.endo - 3, s: "pop-1", v: 0.15 },
        { f: T.surgery - 3, s: "pop-2", v: 0.15 },
        { f: T.q1 - 2, s: "tick-1", v: 0.15 },
        { f: T.q2 - 2, s: "tick-2", v: 0.15 },
        { f: T.q3 - 2, s: "tick-3", v: 0.15 },
        { f: T.every - 6, s: "riser", v: 0.14 },
        { f: T.tooth - 2, s: "shimmer", v: 0.16 },
        { f: T.one - 4, s: "whoosh-short", v: 0.16 },
        { f: T.referring - 2, s: "pop-3", v: 0.14 },
        { f: T.attached - 8, s: "pop-1", v: 0.14 },
        { f: T.keeping + 4, s: "pop-2", v: 0.14 },
        { f: T.click, s: "click", v: 0.22 },
        { f: T.instead, s: "whoosh-short", v: 0.14 },
        { f: CUT_FRAMES - 4, s: "whoosh-long", v: 0.18 },
        { f: CUT_FRAMES + 22, s: "chime", v: 0.14 },
      ].map((x, i) => (
        <Sequence key={i} from={x.f} layout="none">
          <Audio src={staticFile(`audio/sfx/${x.s}.wav`)} volume={x.v} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
