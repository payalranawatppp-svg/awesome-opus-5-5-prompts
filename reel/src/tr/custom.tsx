/**
 * Custom ToothReferral animations, improvised from how the product works (not 1:1 screens).
 * Same kit and stage as scenes.tsx; content sits between y≈300 and y≈1650 so the horizontal and
 * transparent formats (formats.tsx) can frame it. Demo data; funnel numbers are illustrative.
 */
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Avatar, Badge, Card, ICON, Icon, Stage, TR, clamp, rise, useExit, useIn } from "./ui";

const Exit: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const e = useExit();
  return <AbsoluteFill style={{ opacity: 1 - e, scale: String(1 - e * 0.04), filter: e > 0 ? `blur(${e * 6}px)` : undefined }}>{children}</AbsoluteFill>;
};
const Caption: React.FC<{ at: number; top: number; children: React.ReactNode }> = ({ at, top, children }) => (
  <div style={{ position: "absolute", left: 0, right: 0, top, textAlign: "center", ...rise(useIn(at)) }}>
    <Badge color="#fff" bg="rgba(119,74,238,0.92)" style={{ fontSize: 32, padding: "14px 30px", boxShadow: "0 12px 30px rgba(0,0,0,0.3)" }}>{children}</Badge>
  </div>
);
const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

// ---------------------------------------------------------------------------------------------------
// A. Referral journey: the package flies from the general dentist to the specialist.

const Office: React.FC<{ name: string; role: string; initials: string; top: number; at: number; badge?: React.ReactNode }> = ({ name, role, initials, top, at, badge }) => (
  <div style={{ position: "absolute", left: 90, right: 90, top, ...rise(useIn(at), 40) }}>
    <Card style={{ display: "flex", alignItems: "center", gap: 24, padding: "30px 34px" }}>
      <Avatar initials={initials} size={86} />
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 36, fontWeight: 700 }}>{name}</div>
        <div style={{ fontSize: 25, color: TR.muted, marginTop: 4 }}>{role}</div>
      </div>
      {badge}
    </Card>
  </div>
);
export const ReferralJourney: React.FC = () => {
  const frame = useCurrentFrame();
  const fly = ease(interpolate(frame, [30, 78], [0, 1], clamp));
  const landed = frame >= 80;
  const land = useIn(80, 12, 200);
  // cubic path from the sender card (y≈470) to the receiver card (y≈1330), bowing to the right
  const P = (t: number) => {
    const p0 = [540, 560], p1 = [980, 760], p2 = [100, 1080], p3 = [540, 1290];
    const u = 1 - t;
    return [0, 1].map((k) => u * u * u * p0[k] + 3 * u * u * t * p1[k] + 3 * u * t * t * p2[k] + t * t * t * p3[k]);
  };
  const [x, y] = P(fly);
  const trail = Array.from({ length: 7 }, (_, i) => P(Math.max(0, fly - (i + 1) * 0.035)));
  const dash = interpolate(frame, [14, 34], [0, 1], clamp);
  return (
    <Stage>
      <Exit>
        <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0 }}>
          <path d="M540 560 C980 760 100 1080 540 1290" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth={5} strokeDasharray="4 18" strokeLinecap="round" pathLength={1} strokeDashoffset={0} opacity={dash} />
        </svg>
        <Office name="Bright Smile Family Dental" role="General dentist · Dr. Patel" initials="BS" top={380} at={0} />
        <Office
          name="Endo Specialists"
          role="Endodontist · Dr. Reyes"
          initials="ES"
          top={1250}
          at={8}
          badge={landed ? <div style={{ scale: String(0.6 + 0.4 * land) }}><Badge>New referral</Badge></div> : null}
        />
        {frame >= 30 && !landed && (
          <>
            {trail.map(([tx, ty], i) => (
              <div key={i} style={{ position: "absolute", left: tx - 14, top: ty - 14, width: 28, height: 28, borderRadius: 14, background: TR.purple, opacity: 0.4 - i * 0.05, filter: "blur(4px)" }} />
            ))}
            <div style={{ position: "absolute", left: x - 190, top: y - 70, rotate: `${Math.sin(fly * Math.PI) * -8}deg` }}>
              <Card style={{ width: 380, padding: "20px 24px", borderRadius: 22 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <Avatar initials="MA" size={52} />
                  <div style={{ fontSize: 27, fontWeight: 700 }}>Maria Alvarez</div>
                </div>
                <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
                  {[ICON.clip, ICON.shield, ICON.check].map((d, i) => (
                    <div key={i} style={{ width: 52, height: 52, borderRadius: 14, background: TR.purpleSoft, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Icon d={d} size={28} />
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </>
        )}
        {landed && (
          <div style={{ position: "absolute", left: 540 - 120 * land, top: 1290 - 120 * land, width: 240 * land, height: 240 * land, borderRadius: "50%", border: `5px solid ${TR.purple}`, opacity: 1 - land }} />
        )}
        <Caption at={92} top={1530}>Sent in 2 minutes · no fax, no phone tag</Caption>
      </Exit>
    </Stage>
  );
};

// ---------------------------------------------------------------------------------------------------
// B. Insurance link: the patient adds insurance from a secure link and arrives verified.

export const InsuranceLink: React.FC = () => {
  const frame = useCurrentFrame();
  const phone = useIn(0, 18, 120);
  const sms = useIn(14);
  const form = frame >= 50;
  const formIn = useIn(50, 16, 160);
  const member = "XXX-4821".slice(0, Math.max(0, Math.floor((frame - 64) * 0.6)));
  const verified = frame >= 92;
  const v = useIn(92, 12, 200);
  const chip = useIn(104);
  return (
    <Stage>
      <Exit>
        <div style={{ position: "absolute", left: 255, top: 330, width: 570, height: 1160, ...rise(phone, 80) }}>
          <div style={{ position: "absolute", inset: 0, borderRadius: 86, background: "#0E0B1F", boxShadow: "0 50px 120px rgba(0,0,0,0.55), inset 0 0 0 3px #3a3550" }} />
          <div style={{ position: "absolute", inset: 18, borderRadius: 70, background: "#F6F5FB", overflow: "hidden", padding: "90px 34px 34px" }}>
            <div style={{ position: "absolute", left: "50%", top: 20, width: 150, height: 40, marginLeft: -75, borderRadius: 20, background: "#0E0B1F" }} />
            {!form ? (
              <div style={{ ...rise(sms, 30) }}>
                <div style={{ textAlign: "center", fontSize: 22, color: TR.muted }}>Today 9:00 AM</div>
                <div style={{ marginTop: 20, padding: "24px 26px", borderRadius: 28, background: "#E9E7F2", fontSize: 27, lineHeight: 1.35 }}>
                  Hi Maria, your specialist needs your insurance before your visit.
                  <div style={{ marginTop: 18, padding: "16px 20px", borderRadius: 16, background: TR.purple, color: "#fff", fontWeight: 700, display: "flex", gap: 10, alignItems: "center", justifyContent: "center" }}>
                    <Icon d={ICON.shield} color="#fff" size={26} /> Open secure link
                  </div>
                </div>
              </div>
            ) : (
              <div style={{ ...rise(formIn, 40) }}>
                <div style={{ fontSize: 36, fontWeight: 700 }}>Add your insurance</div>
                <div style={{ fontSize: 23, color: TR.muted, marginTop: 6 }}>For Endo Specialists</div>
                {[
                  ["Carrier", "Delta Dental"],
                  ["Member ID", member],
                  ["Group", "7720"],
                ].map(([l, val]) => (
                  <div key={l} style={{ marginTop: 26 }}>
                    <div style={{ fontSize: 20, color: TR.muted, fontWeight: 600 }}>{l}</div>
                    <div style={{ marginTop: 8, height: 74, borderRadius: 16, background: "#fff", border: `2px solid ${TR.border}`, display: "flex", alignItems: "center", padding: "0 20px", fontSize: 28, fontWeight: 600 }}>{val}</div>
                  </div>
                ))}
                <div style={{ marginTop: 34, height: 86, borderRadius: 18, background: verified ? TR.greenSoft : TR.purple, color: verified ? "#0D8A52" : "#fff", display: "flex", alignItems: "center", justifyContent: "center", gap: 12, fontSize: 28, fontWeight: 700, scale: String(verified ? 0.92 + 0.08 * v : 1) }}>
                  {verified ? (
                    <>
                      <Icon d={ICON.check} color="#0D8A52" size={32} /> Verified before your visit
                    </>
                  ) : (
                    "Submit"
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
        <div style={{ position: "absolute", right: 40, top: 1180, ...rise(chip, 30), scale: String(0.7 + 0.3 * chip) }}>
          <Card style={{ padding: "22px 28px", display: "flex", alignItems: "center", gap: 16, borderRadius: 22 }}>
            <div style={{ width: 54, height: 54, borderRadius: 27, background: TR.green, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Icon d={ICON.check} color="#fff" size={30} />
            </div>
            <div>
              <div style={{ fontSize: 26, fontWeight: 700 }}>Insurance verified</div>
              <div style={{ fontSize: 21, color: TR.muted }}>Added to the referral</div>
            </div>
          </Card>
        </div>
      </Exit>
    </Stage>
  );
};

// ---------------------------------------------------------------------------------------------------
// C. Notification stack: the day's events cascade in, newest on top.

const EVENTS = [
  { t: "New referral created", s: "Toledo Family Dental · Maria Alvarez", c: TR.purple, d: ICON.inbox },
  { t: "Patient added insurance", s: "Delta Dental · verified", c: TR.green, d: ICON.shield },
  { t: "New message", s: "Dr. Sally Smith: When can you see her?", c: TR.purple, d: ICON.chat },
  { t: "Appointment scheduled", s: "Thursday · 2:30 PM", c: TR.amber, d: ICON.calendar },
  { t: "Case completed", s: "Notes shared with both offices", c: TR.green, d: ICON.check },
];
export const NotificationStack: React.FC = () => {
  const frame = useCurrentFrame();
  const step = 20;
  const shown = EVENTS.filter((_, i) => frame >= 6 + i * step).length;
  return (
    <Stage>
      <Exit>
        <div style={{ position: "absolute", left: 70, right: 70, top: 390 }}>
          {EVENTS.map((e, i) => {
            const p = useIn(6 + i * step, 15, 170);
            if (i >= shown) return null;
            const depth = shown - 1 - i; // 0 = newest, on top
            const y = depth * 196;
            return (
              <div key={e.t} style={{ position: "absolute", left: 0, right: 0, top: y, zIndex: 10 - depth, opacity: Math.min(1, p * 1.4) * (1 - depth * 0.12), translate: `0px ${interpolate(p, [0, 1], [-80, 0])}px`, scale: String(interpolate(p, [0, 1], [0.92, 1]) - depth * 0.025) }}>
                <Card style={{ display: "flex", alignItems: "center", gap: 24, padding: "30px 32px", borderRadius: 26 }}>
                  <div style={{ width: 70, height: 70, borderRadius: 20, background: e.c, display: "flex", alignItems: "center", justifyContent: "center", flex: "none" }}>
                    <Icon d={e.d} color="#fff" size={36} />
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: 32, fontWeight: 700 }}>{e.t}</div>
                    <div style={{ fontSize: 25, color: TR.muted, marginTop: 4, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{e.s}</div>
                  </div>
                  <div style={{ marginLeft: "auto", fontSize: 21, color: TR.faint, whiteSpace: "nowrap" }}>now</div>
                </Card>
              </div>
            );
          })}
        </div>
        <Caption at={110} top={1460}>Both offices see every step</Caption>
      </Exit>
    </Stage>
  );
};

// ---------------------------------------------------------------------------------------------------
// D. Referral funnel: Received → Contacted → Scheduled → Completed (illustrative numbers).

const FUNNEL = [
  { t: "Received", n: 50, c: TR.purple },
  { t: "Contacted", n: 46, c: TR.purple },
  { t: "Scheduled", n: 41, c: "#9A79F5" },
  { t: "Completed", n: 37, c: TR.green },
];
export const ReferralFunnel: React.FC = () => {
  const frame = useCurrentFrame();
  const card = useIn(0, 18, 130);
  return (
    <Stage>
      <Exit>
        <div style={{ position: "absolute", left: 60, right: 60, top: 470, ...rise(card, 70) }}>
          <Card style={{ padding: 46 }}>
            <div style={{ fontSize: 42, fontWeight: 700 }}>Referral funnel</div>
            <div style={{ fontSize: 25, color: TR.muted, marginTop: 6 }}>From received to completed · last 30 days</div>
            {FUNNEL.map((f, i) => {
              const at = 14 + i * 12;
              const g = interpolate(frame, [at, at + 26], [0, 1], { ...clamp, easing: ease });
              const pct = Math.round((f.n / FUNNEL[0].n) * 100);
              return (
                <div key={f.t} style={{ marginTop: 34, ...rise(useIn(at - 4), 16) }}>
                  <div style={{ display: "flex", fontSize: 28, fontWeight: 700 }}>
                    <span style={{ flex: 1 }}>{f.t}</span>
                    <span style={{ fontVariantNumeric: "tabular-nums" }}>{Math.round(f.n * g)}</span>
                    <span style={{ color: TR.muted, fontWeight: 600, marginLeft: 16, width: 90, textAlign: "right" }}>{Math.round(pct * g)}%</span>
                  </div>
                  <div style={{ marginTop: 12, height: 30, borderRadius: 15, background: TR.purpleSoft }}>
                    <div style={{ height: 30, borderRadius: 15, background: f.c, width: `${pct * g}%` }} />
                  </div>
                </div>
              );
            })}
            <div style={{ display: "flex", gap: 14, marginTop: 40, ...rise(useIn(80)) }}>
              <Badge color={TR.green} bg={TR.greenSoft}>74% completed</Badge>
              <Badge color={TR.amber} bg={TR.amberSoft}>Ghost rate 4%</Badge>
            </div>
          </Card>
        </div>
      </Exit>
    </Stage>
  );
};

export const TR_CUSTOM = [
  { id: "TR-08-referral-journey", C: ReferralJourney, dur: 135 },
  { id: "TR-09-insurance-link", C: InsuranceLink, dur: 140 },
  { id: "TR-10-notification-stack", C: NotificationStack, dur: 150 },
  { id: "TR-11-referral-funnel", C: ReferralFunnel, dur: 120 },
];
