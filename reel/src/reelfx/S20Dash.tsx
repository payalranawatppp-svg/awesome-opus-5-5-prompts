/**
 * Script 20 product screens, rebuilt in the Tooth Referral app style with the story's own people and conversations
 * (user, 2026-11-12: "use different names and make the conversation"): Sarah Collins' implant case, David Ross'
 * crown case, Barbara/Greg at Gentle Dental, Tanya/Amanda at St. Andrew's Family Dental. Every screen floats in 3D
 * inside the card band (y 960-1500) and animates step by step on the dialogue. Demo data; all names are fictional.
 */
import React from "react";
import { AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame } from "remotion";
import { FONT_DISPLAY, FONT_UI } from "../theme";
import { easeIO, easeOut, ramp } from "../tr/motion";
import { ICON, Icon, TR, clamp } from "../tr/ui";

export const FPS = 30;
const AMBER = "#FFB020";
const AMBER_DK = "#C98400";
const GREEN = "#1FA463";
const GREEN_SOFT = "#E3F8EE";
const INK = "#1C1F33";
const MUTED = "#6B7085";
const LINE = "#E7E8EE";
const P = TR.purple;
const PS = TR.purpleSoft;
const W = "#FFFFFF";

export const sp = (frame: number, a: number, damping = 14, stiffness = 170) =>
  frame < a ? 0 : spring({ frame: frame - a, fps: FPS, config: { damping, stiffness, mass: 0.7 } });
export const life = (frame: number, a: number, b: number, inD = 10, outD = 8) =>
  Math.min(interpolate(frame, [a, a + inD], [0, 1], clamp), interpolate(frame, [b - outD, b], [1, 0], clamp));

const ui: React.CSSProperties = { fontFamily: FONT_UI, color: INK, letterSpacing: "-0.01em" };

/** 3D floating app window. */
export const AppWindow: React.FC<{ a: number; b: number; w: number; y: number; x?: number; title: string; sub?: string; from?: 1 | -1; children: React.ReactNode; scale?: number; glow?: number }> = ({ a, b, w, y, x = 540, title, sub, from = 1, children, scale = 1, glow = 0 }) => {
  const frame = useCurrentFrame();
  if (frame < a - 1 || frame > b) return null;
  const p = sp(frame, a, 16, 115);
  const o = life(frame, a, b, 8, 10);
  const t = frame - a;
  const ry = (1 - p) * 55 * from + Math.sin(t / 34) * 3.5;
  const rx = 7 + Math.cos(t / 40) * 2;
  const sweep = interpolate(frame, [a + 10, a + 34], [-30, 140], clamp);
  return (
    <div style={{ position: "absolute", left: x - w / 2, top: y, width: w, perspective: 1600, opacity: o }}>
      <div style={{ transform: `translateX(${(1 - p) * 480 * from}px) translateZ(${-(1 - p) * 260}px) rotateY(${ry}deg) rotateX(${rx}deg) scale(${scale})`, transformOrigin: "50% 0%", transformStyle: "preserve-3d" }}>
        <div style={{ position: "relative", borderRadius: 26, background: W, overflow: "hidden", boxShadow: `0 40px 90px rgba(12,6,30,0.55), 0 0 0 1.5px rgba(139,92,246,${0.3 + glow * 0.5}), 0 0 ${60 * glow}px rgba(139,92,246,${0.6 * glow})` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "16px 22px", borderBottom: `1.5px solid ${LINE}`, background: "#FBFAFF" }}>
            <div style={{ display: "flex", gap: 7 }}>{["#E7E3F7", "#E7E3F7", "#E7E3F7"].map((c, i) => <div key={i} style={{ width: 12, height: 12, borderRadius: 12, background: c }} />)}</div>
            <div style={{ width: 30, height: 30, borderRadius: 9, background: `linear-gradient(135deg, ${P}, #B48CFF)`, display: "flex", alignItems: "center", justifyContent: "center" }}><Icon d={ICON.shield} size={18} color={W} /></div>
            <div style={{ ...ui, fontWeight: 800, fontSize: 26 }}>{title}</div>
            {sub && <div style={{ ...ui, fontWeight: 600, fontSize: 21, color: MUTED, marginLeft: "auto" }}>{sub}</div>}
          </div>
          <div style={{ padding: 22 }}>{children}</div>
          <div style={{ position: "absolute", inset: 0, background: `linear-gradient(110deg, transparent ${sweep - 16}%, rgba(255,255,255,0.6) ${sweep}%, transparent ${sweep + 16}%)`, pointerEvents: "none" }} />
        </div>
      </div>
    </div>
  );
};

const Av: React.FC<{ n: string; c: string; s?: number }> = ({ n, c, s = 44 }) => (
  <div style={{ width: s, height: s, borderRadius: s, background: c, color: W, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT_UI, fontWeight: 800, fontSize: s * 0.4, flex: "none" }}>{n}</div>
);
const Pill: React.FC<{ t: string; bg: string; c: string; s?: number }> = ({ t, bg, c, s = 20 }) => (
  <span style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: `${s * 0.25}px ${s * 0.6}px`, borderRadius: 99, background: bg, color: c, fontFamily: FONT_UI, fontWeight: 800, fontSize: s, whiteSpace: "nowrap" }}>{t}</span>
);
/** Row that flips up into place at `at`. */
const Rise: React.FC<{ at: number; children: React.ReactNode; style?: React.CSSProperties }> = ({ at, children, style }) => {
  const frame = useCurrentFrame();
  const p = sp(frame, at, 13, 190);
  if (frame < at) return null;
  return <div style={{ transform: `perspective(700px) rotateX(${(1 - p) * -60}deg) translateY(${(1 - p) * 24}px)`, transformOrigin: "50% 0%", opacity: Math.min(1, p * 1.6), ...style }}>{children}</div>;
};

export const Bubble: React.FC<{ at: number; n: string; c: string; who: string; role: string; time: string; text: React.ReactNode }> = ({ at, n, c, who, role, time, text }) => (
  <Rise at={at} style={{ display: "flex", gap: 14, padding: "10px 0" }}>
    <Av n={n} c={c} s={46} />
    <div style={{ ...ui, flex: 1 }}>
      <div style={{ display: "flex", alignItems: "baseline", gap: 10, flexWrap: "nowrap" }}>
        <span style={{ fontWeight: 800, fontSize: 24 }}>{who}</span>
        <span style={{ fontWeight: 600, fontSize: 19, color: MUTED }}>{role} · {time}</span>
      </div>
      <div style={{ fontWeight: 500, fontSize: 23, color: "#3A3F55", marginTop: 3, lineHeight: 1.3 }}>{text}</div>
    </div>
  </Rise>
);
const At: React.FC<{ t: string }> = ({ t }) => <span style={{ color: P, fontWeight: 700 }}>@{t} </span>;

// ---------------------------------------------------------------------------------------------------
// Act 1 — Greg searches his email: nothing from the specialist

export const InboxSearch: React.FC<{ a: number; b: number; typeAt: number; resAt: number; emptyAt: number }> = ({ a, b, typeAt, resAt, emptyAt }) => {
  const frame = useCurrentFrame();
  const q = "Sarah Collins completion note";
  const n = Math.round(interpolate(frame, [typeAt, typeAt + 26], [0, q.length], clamp));
  const caret = Math.floor(frame / 8) % 2 === 0 && frame < resAt;
  const empty = sp(frame, emptyAt, 11, 200);
  return (
    <AppWindow a={a} b={b} w={880} y={990} title="Email · Gentle Dental" sub="Front desk inbox" from={-1}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 18px", borderRadius: 14, border: `2px solid ${P}`, ...ui, fontSize: 25, fontWeight: 600 }}>
        <Icon d={ICON.inbox} size={26} color={MUTED} />
        <span>{q.slice(0, n)}{caret ? "|" : ""}</span>
      </div>
      {[["Re: Sarah Collins — referral sent", "To St. Andrew's · Nov 3"], ["Re: Sarah Collins — any update?", "To St. Andrew's · Nov 6"]].map(([t, s], i) => (
        <Rise key={i} at={resAt + i * 5} style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 4px", borderBottom: `1.5px solid ${LINE}` }}>
          <Icon d={ICON.send} size={26} color={MUTED} />
          <div style={{ ...ui, flex: 1 }}>
            <div style={{ fontWeight: 700, fontSize: 24 }}>{t}</div>
            <div style={{ fontWeight: 500, fontSize: 20, color: MUTED }}>{s}</div>
          </div>
          <Pill t="No reply" bg="#FFF1D6" c={AMBER_DK} />
        </Rise>
      ))}
      {frame >= emptyAt && (
        <div style={{ marginTop: 16, display: "flex", alignItems: "center", gap: 14, padding: "16px 20px", borderRadius: 16, background: "#FFF6E5", border: `2px solid ${AMBER}`, transform: `scale(${0.85 + 0.15 * empty})`, opacity: empty, ...ui }}>
          <Icon d={ICON.alert} size={30} color={AMBER_DK} />
          <div style={{ fontWeight: 800, fontSize: 25 }}>Completion note: not found</div>
          <div style={{ marginLeft: "auto", fontWeight: 600, fontSize: 20, color: AMBER_DK }}>Crown prep today</div>
        </div>
      )}
    </AppWindow>
  );
};

// ---------------------------------------------------------------------------------------------------
// "Messages, X-rays, insurance, the signed note. All on the case. Gentle Dental sees it too."

export const SarahCase: React.FC<{ a: number; b: number; msg: number; xr: number; ins: number; sig: number; all: number; sees: number }> = ({ a, b, msg, xr, ins, sig, all, sees }) => {
  const frame = useCurrentFrame();
  const g = Math.max(0, Math.sin(Math.min(1, Math.max(0, (frame - all) / 24)) * Math.PI)) * (frame >= all ? 1 : 0);
  const done = frame >= sig;
  const seeK = sp(frame, sees, 13, 150);
  return (
    <>
      <AppWindow a={a} b={b} w={940} y={985} title="Sarah Collins · Implant #19" sub="Gentle Dental → St. Andrew's" glow={g} scale={1 - 0.04 * g}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
          {done ? <Pill t="✓ Treatment completed" bg={GREEN_SOFT} c={GREEN} /> : <Pill t="Consultation scheduled" bg={PS} c={P} />}
          <Pill t="Shared with both offices" bg="#F1F2F6" c={MUTED} />
        </div>
        <div style={{ ...ui, fontWeight: 800, fontSize: 21, color: MUTED, letterSpacing: "0.04em", margin: "8px 0 2px" }}>OFFICE COMMUNICATION</div>
        <Bubble at={msg} n="B" c="#2E7D5B" who="Barbara (Gentle Dental)" role="Office Manager" time="Nov 3" text={<><At t="Tanya" />Sending Sarah Collins for implant #19. Pano attached.</>} />
        <Bubble at={msg + 5} n="T" c={P} who="Tanya (St. Andrew's)" role="Front Desk" time="Nov 3" text="Got it! Consult booked for Tuesday, 9:00 AM." />
        <div style={{ display: "flex", gap: 16, marginTop: 8 }}>
          <Rise at={xr} style={{ flex: 1.1, border: `1.5px solid ${LINE}`, borderRadius: 16, padding: 12 }}>
            <div style={{ ...ui, fontWeight: 800, fontSize: 21, marginBottom: 8 }}>X-rays (2)</div>
            <div style={{ display: "flex", gap: 8 }}>
              {["pano1", "pano2"].map((s) => <Img key={s} src={staticFile(`s20/${s}.png`)} style={{ width: "50%", height: 92, objectFit: "cover", borderRadius: 10 }} />)}
            </div>
          </Rise>
          <Rise at={ins} style={{ flex: 1, border: `1.5px solid ${LINE}`, borderRadius: 16, padding: 12 }}>
            <div style={{ ...ui, fontWeight: 800, fontSize: 21, marginBottom: 8, display: "flex", alignItems: "center" }}>Insurance <span style={{ marginLeft: "auto" }}><Pill t="✓ Verified" bg={GREEN_SOFT} c={GREEN} s={17} /></span></div>
            <div style={{ borderRadius: 12, overflow: "hidden", border: `1.5px solid ${LINE}` }}>
              <div style={{ padding: "8px 12px", ...ui, fontWeight: 800, fontSize: 18, color: GREEN }}>△ DELTA DENTAL · PPO</div>
              <div style={{ padding: "0 12px 6px", ...ui, fontWeight: 600, fontSize: 18 }}>Primary: Sarah Collins</div>
              <div style={{ height: 22, background: "#2E9B3E" }} />
            </div>
          </Rise>
        </div>
        <Rise at={sig} style={{ marginTop: 14, display: "flex", alignItems: "center", gap: 14, padding: "14px 16px", borderRadius: 16, border: `2px solid ${P}`, background: "#FBFAFF" }}>
          <Icon d={ICON.check} size={28} color={GREEN} />
          <div style={{ ...ui, flex: 1 }}>
            <div style={{ fontWeight: 800, fontSize: 23 }}>Completion Note</div>
            <div style={{ fontWeight: 600, fontSize: 19, color: MUTED }}>Signed by Amanda · Nov 12 · visible to both offices</div>
          </div>
          <Pill t="Signed" bg={GREEN_SOFT} c={GREEN} />
          <Pill t="View" bg={PS} c={P} />
        </Rise>
      </AppWindow>
      {frame >= sees && frame < b && (
        <div style={{ position: "absolute", left: 0, right: 0, top: 905, display: "flex", justifyContent: "center", opacity: life(frame, sees, b, 6, 8) }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, transform: `scale(${0.7 + 0.3 * seeK})` }}>
            {[["GD", "Gentle Dental", "#2E7D5B"], null, ["SA", "St. Andrew's", P]].map((o, i) => o ? (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 18px 8px 8px", borderRadius: 99, background: "rgba(22,14,48,0.85)", border: "1.5px solid rgba(196,181,253,0.5)" }}>
                <Av n={o[0]} c={o[2]} s={38} /><span style={{ fontFamily: FONT_UI, fontWeight: 800, fontSize: 24, color: W }}>{o[1]}</span>
              </div>
            ) : (
              <div key={i} style={{ position: "relative", width: 120, height: 6, borderRadius: 6, background: "rgba(196,181,253,0.3)" }}>
                {[0, 1, 2].map((d) => <div key={d} style={{ position: "absolute", top: -4, left: `${((frame * 3 + d * 40) % 120)}px`, width: 14, height: 14, borderRadius: 14, background: "#C4B5FD", boxShadow: "0 0 12px #C4B5FD" }} />)}
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

// ---------------------------------------------------------------------------------------------------
// "Let's invite them today." → "And... invite sent to Gentle Dental."

export const InviteFlow: React.FC<{ a: number; b: number; typeAt: number; sendAt: number }> = ({ a, b, typeAt, sendAt }) => {
  const frame = useCurrentFrame();
  const email = "barbara@gentledental.com";
  const n = Math.round(interpolate(frame, [typeAt, typeAt + 30], [0, email.length], clamp));
  const press = frame >= sendAt - 4 && frame < sendAt + 3 ? 0.94 : 1;
  const sent = sp(frame, sendAt, 11, 200);
  return (
    <AppWindow a={a} b={b} w={820} y={990} title="Invite your network" sub="St. Andrew's Family Dental" from={-1}>
      <div style={{ ...ui, fontWeight: 500, fontSize: 22, color: MUTED, marginBottom: 14 }}>Invite a referring office. They join free and see every shared case.</div>
      {[["Office", "Gentle Dental"], ["Email", email.slice(0, n) + (frame < sendAt && Math.floor(frame / 8) % 2 === 0 ? "|" : "")]].map(([l, v], i) => (
        <div key={i} style={{ marginBottom: 12 }}>
          <div style={{ ...ui, fontWeight: 700, fontSize: 19, color: MUTED, marginBottom: 6 }}>{l}</div>
          <div style={{ padding: "12px 16px", borderRadius: 12, border: `2px solid ${i === 1 && frame < sendAt ? P : LINE}`, ...ui, fontWeight: 600, fontSize: 24 }}>{v || " "}</div>
        </div>
      ))}
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 6 }}>
        <div style={{ padding: "14px 28px", borderRadius: 14, background: `linear-gradient(135deg, ${P}, #9B7BFF)`, color: W, fontFamily: FONT_UI, fontWeight: 800, fontSize: 24, transform: `scale(${press})` }}>Send invite</div>
        {frame >= sendAt && (
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 20px", borderRadius: 14, background: GREEN_SOFT, border: `2px solid ${GREEN}`, transform: `translateX(${(1 - sent) * 40}px)`, opacity: sent }}>
            <Icon d={ICON.check} size={24} color={GREEN} /><span style={{ ...ui, fontWeight: 800, fontSize: 22, color: GREEN }}>Invite sent to Gentle Dental</span>
          </div>
        )}
      </div>
    </AppWindow>
  );
};

// ---------------------------------------------------------------------------------------------------
// One month later: the calendar runs a month, both offices connected, cases flowing between them

export const MonthLater: React.FC<{ a: number; b: number }> = ({ a, b }) => {
  const frame = useCurrentFrame();
  if (frame < a || frame > b) return null;
  const o = life(frame, a, b, 6, 8);
  const t = frame - a, dur = b - a;
  const day = Math.min(30, Math.floor(interpolate(t, [8, dur * 0.55], [1, 30], clamp)));
  const flip = (t * 1.6) % 1;
  const net = sp(frame, a + Math.round(dur * 0.42), 14, 120);
  const cases: [string, string, string][] = [["Sarah Collins", "Completed", GREEN], ["David Ross", "Crown #30 · completed", GREEN], ["Michael Turner", "Consult booked", P]];
  return (
    <AbsoluteFill style={{ opacity: o, background: "radial-gradient(circle at 50% 30%, #3B1E8F 0%, #1B1240 55%, #0C0820 100%)" }}>
      <AbsoluteFill style={{ alignItems: "center", paddingTop: 300, perspective: 1300 }}>
        <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: 120, color: W, letterSpacing: "-0.05em", lineHeight: 0.95, textAlign: "center", transform: `translateY(${(1 - sp(frame, a, 13, 140)) * 60}px)` }}>
          One month <span style={{ color: "#C4B5FD" }}>later</span>
        </div>
        <div style={{ marginTop: 50, display: "flex", gap: 26, alignItems: "center", transform: `rotateX(14deg) rotateY(${Math.sin(t / 20) * 6}deg)` }}>
          <div style={{ width: 300, borderRadius: 26, overflow: "hidden", background: W, boxShadow: "0 30px 70px rgba(0,0,0,0.5)" }}>
            <div style={{ background: `linear-gradient(135deg, ${P}, #B48CFF)`, color: W, fontFamily: FONT_UI, fontWeight: 800, fontSize: 30, textAlign: "center", padding: "12px 0" }}>{day < 20 ? "NOVEMBER" : "DECEMBER"}</div>
            <div style={{ position: "relative", height: 210, perspective: 600 }}>
              <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT_DISPLAY, fontWeight: 800, fontSize: 150, color: INK, transform: day < 30 ? `rotateX(${flip * 80}deg)` : undefined, transformOrigin: "50% 0%" }}>
                {day < 20 ? day + 11 : day - 19}
              </div>
            </div>
          </div>
          <div style={{ fontFamily: FONT_UI, fontWeight: 800, fontSize: 38, color: "#C4B5FD" }}>Day {day}</div>
        </div>
        <div style={{ marginTop: 80, width: 960, opacity: net, transform: `translateY(${(1 - net) * 60}px)` }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
            {[["GD", "Gentle Dental", "#2E7D5B"], ["SA", "St. Andrew's Family Dental", P]].map((x, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 22px 10px 10px", borderRadius: 99, background: "rgba(255,255,255,0.1)", border: "1.5px solid rgba(196,181,253,0.5)" }}>
                <Av n={x[0]} c={x[2]} s={48} /><span style={{ fontFamily: FONT_UI, fontWeight: 800, fontSize: 28, color: W }}>{x[1]}</span>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 26, display: "flex", flexDirection: "column", gap: 14 }}>
            {cases.map(([nm, st, c], i) => {
              const k = sp(frame, a + Math.round(dur * 0.5) + i * 6, 13, 170);
              return (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 16, padding: "16px 22px", borderRadius: 18, background: W, boxShadow: "0 16px 40px rgba(0,0,0,0.35)", transform: `translateX(${(1 - k) * (i % 2 ? 300 : -300)}px)`, opacity: k }}>
                  <Icon d={ICON.clip} size={28} color={P} />
                  <span style={{ ...ui, fontWeight: 800, fontSize: 28 }}>{nm}</span>
                  <span style={{ marginLeft: "auto" }}><Pill t={(c === GREEN ? "✓ " : "") + st} bg={c === GREEN ? GREEN_SOFT : PS} c={c} s={22} /></span>
                </div>
              );
            })}
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------------------------------
// Act 2 — Greg's screen: David's case, signed note already there, copied into the electronic health record

export const DavidCase: React.FC<{ a: number; b: number; copyAt: number }> = ({ a, b, copyAt }) => {
  const frame = useCurrentFrame();
  const steps: [string, string][] = [["Referred", "Nov 18"], ["Consultation", "Nov 25"], ["Treatment completed", "Dec 9"]];
  const press = frame >= copyAt - 4 && frame < copyAt + 3 ? 0.93 : 1;
  const ok = sp(frame, copyAt + 3, 11, 200);
  return (
    <AppWindow a={a} b={b} w={900} y={1000} title="David Ross · Crown #30" sub="From St. Andrew's" from={-1}>
      <div style={{ display: "flex", alignItems: "center", marginBottom: 14 }}>
        {steps.map(([s, d], i) => {
          const k = sp(frame, a + 6 + i * 6, 12, 200);
          return (
            <React.Fragment key={i}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, opacity: 0.3 + 0.7 * k }}>
                <div style={{ width: 34, height: 34, borderRadius: 34, background: GREEN, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${k})` }}><Icon d={ICON.check} size={20} color={W} /></div>
                <div style={ui}><div style={{ fontWeight: 800, fontSize: 20 }}>{s}</div><div style={{ fontWeight: 600, fontSize: 17, color: MUTED }}>{d}</div></div>
              </div>
              {i < 2 && <div style={{ flex: 1, height: 4, margin: "0 10px", borderRadius: 4, background: k > 0.5 ? GREEN : LINE }} />}
            </React.Fragment>
          );
        })}
      </div>
      <Rise at={a + 20} style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 16px", borderRadius: 16, border: `2px solid ${P}`, background: "#FBFAFF" }}>
        <Icon d={ICON.check} size={28} color={GREEN} />
        <div style={{ ...ui, flex: 1 }}>
          <div style={{ fontWeight: 800, fontSize: 23 }}>Completion Note · signed</div>
          <div style={{ fontWeight: 600, fontSize: 19, color: MUTED }}>Signed by Amanda, St. Andrew's · Dec 9</div>
        </div>
        <div style={{ padding: "12px 18px", borderRadius: 12, background: `linear-gradient(135deg, ${P}, #9B7BFF)`, color: W, fontFamily: FONT_UI, fontWeight: 800, fontSize: 19, transform: `scale(${press})`, textAlign: "center", lineHeight: 1.15 }}>Copy into electronic<br />health record</div>
      </Rise>
      {frame >= copyAt + 3 && (
        <div style={{ marginTop: 12, display: "flex", alignItems: "center", gap: 10, padding: "12px 18px", borderRadius: 14, background: GREEN_SOFT, border: `2px solid ${GREEN}`, opacity: ok, transform: `translateY(${(1 - ok) * 16}px)` }}>
          <Icon d={ICON.check} size={24} color={GREEN} /><span style={{ ...ui, fontWeight: 800, fontSize: 22, color: GREEN }}>Copied into Gentle Dental's electronic health record</span>
        </div>
      )}
    </AppWindow>
  );
};

/** "No phone calls?" — the follow-up question answered on the case. */
export const FollowUp: React.FC<{ a: number; b: number }> = ({ a, b }) => (
  <AppWindow a={a} b={b} w={880} y={1040} title="Office Communication" sub="David Ross · Crown #30">
    <Bubble at={a + 4} n="B" c="#2E7D5B" who="Barbara (Gentle Dental)" role="Office Manager" time="10:02 AM" text={<><At t="Amanda" />Is David's follow-up booked?</>} />
    <Bubble at={a + 16} n="A" c="#5B3FD9" who="Amanda (St. Andrew's)" role="Treatment Coordinator" time="10:03 AM" text="Yes! Thursday, 2:30 PM. Note is on the case." />
  </AppWindow>
);

/** St. Andrew's incoming list: every Gentle Dental referral, no calls needed. */
export const ReferralList: React.FC<{ a: number; b: number }> = ({ a, b }) => {
  const rows: [string, string, string, string][] = [
    ["Sarah Collins", "Implant #19", "Completed", GREEN], ["David Ross", "Crown #30", "Completed", GREEN],
    ["Michael Turner", "Extraction #19", "Consult booked", P], ["Emma Park", "Implant consult", "New", AMBER_DK],
  ];
  return (
    <AppWindow a={a} b={b} w={900} y={985} title="Incoming referrals" sub="From Gentle Dental">
      {rows.map(([n, p, s, c], i) => (
        <Rise key={i} at={a + 6 + i * 4} style={{ display: "flex", alignItems: "center", gap: 14, padding: "11px 4px", borderBottom: i < rows.length - 1 ? `1.5px solid ${LINE}` : undefined }}>
          <Av n={n.split(" ").map((x) => x[0]).join("")} c={["#7C3AED", "#2E7D5B", "#5B3FD9", "#B7791F"][i]} s={42} />
          <div style={{ ...ui, flex: 1 }}><div style={{ fontWeight: 800, fontSize: 23 }}>{n}</div><div style={{ fontWeight: 600, fontSize: 18, color: MUTED }}>{p}</div></div>
          <Pill t={(c === GREEN ? "✓ " : "") + s} bg={c === GREEN ? GREEN_SOFT : c === P ? PS : "#FFF1D6"} c={c} />
        </Rise>
      ))}
      <Rise at={a + 26} style={{ marginTop: 12, display: "flex", alignItems: "center", gap: 10, padding: "12px 16px", borderRadius: 14, background: PS }}>
        <Icon d={ICON.chat} size={24} color={P} /><span style={{ ...ui, fontWeight: 800, fontSize: 22, color: P }}>Every update on the case · 0 phone calls this week</span>
      </Rise>
    </AppWindow>
  );
};

/** Success sparkles. */
export const Sparkle: React.FC<{ at: number; x: number; y: number; color?: string }> = ({ at, x, y, color = "#C4B5FD" }) => {
  const frame = useCurrentFrame();
  const t = frame - at;
  if (t < 0 || t > 24) return null;
  const k = easeOut(t / 24);
  return (
    <>
      {Array.from({ length: 12 }).map((_, i) => {
        const ang = (i / 12) * Math.PI * 2;
        const r = 30 + k * 130;
        return <div key={i} style={{ position: "absolute", left: x + Math.cos(ang) * r, top: y + Math.sin(ang) * r, width: 10, height: 10, borderRadius: 10, background: i % 2 ? color : "#FFE08A", opacity: 1 - k, boxShadow: `0 0 10px ${color}` }} />;
      })}
    </>
  );
};

/** Warm light leak sweeping across on transitions. */
export const LightLeak: React.FC<{ at: number; dur?: number }> = ({ at, dur = 18 }) => {
  const frame = useCurrentFrame();
  const t = (frame - at) / dur;
  if (t < 0 || t > 1) return null;
  const x = -40 + easeIO(t) * 180;
  return <AbsoluteFill style={{ pointerEvents: "none", mixBlendMode: "screen", opacity: Math.sin(t * Math.PI) * 0.75, background: `linear-gradient(115deg, transparent ${x - 30}%, rgba(255,176,32,0.55) ${x - 8}%, rgba(196,140,255,0.6) ${x}%, transparent ${x + 25}%)` }} />;
};

export { ramp };
