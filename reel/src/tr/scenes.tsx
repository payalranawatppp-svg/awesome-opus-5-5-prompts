/**
 * Animated ToothReferral dashboard scenes (1080x1920, 30 fps) for UGC inserts.
 * Each scene shows one real module of the dashboard (see docs in reel/TOOTHREFERRAL-DASHBOARD.md).
 * Demo data only: patient and office names are fictional; analytics numbers are illustrative.
 */
import React from "react";
import { AbsoluteFill, Series, interpolate, useCurrentFrame } from "remotion";
import { Avatar, Badge, Button, Card, Cursor, ICON, Icon, Logo, Stage, TR, Toast, clamp, rise, useExit, useIn } from "./ui";

const typed = (text: string, frame: number, at: number, cps = 1.6) => text.slice(0, Math.max(0, Math.floor((frame - at) * cps)));
const count = (frame: number, at: number, dur: number, to: number) => {
  const t = interpolate(frame, [at, at + dur], [0, 1], clamp);
  return to * (1 - Math.pow(1 - t, 3));
};
const Exit: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const e = useExit();
  return <AbsoluteFill style={{ opacity: 1 - e, scale: String(1 - e * 0.04), filter: e > 0 ? `blur(${e * 6}px)` : undefined }}>{children}</AbsoluteFill>;
};
const Label: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => (
  <div style={{ fontSize: 22, fontWeight: 600, color: TR.muted, textTransform: "uppercase", letterSpacing: 1.5, ...style }}>{children}</div>
);

// ---------------------------------------------------------------------------------------------------
// 1. Dashboard overview: the whole app builds in, then the camera pushes into the KPI row.

const NAV = ["Analytics", "Referrals", "  Incoming", "  Outgoing", "  Cases Completed", "Notifications", "Notes", "Company", "Offices", "Memberships", "My Settings"];
export const DashboardOverview: React.FC = () => {
  const frame = useCurrentFrame();
  const frameIn = useIn(0, 18, 120);
  const push = interpolate(frame, [70, 115], [0, 1], { ...clamp, easing: (t) => 1 - Math.pow(1 - t, 3) });
  const W = 1920;
  const H = 1080;
  const s = 0.53 + push * 0.17; // ends with all four KPI cards in frame
  const kpis = [
    ["Volume received", "24", TR.purple],
    ["Time to first contact", "2 h", TR.green],
    ["Case acceptance", "86 %", TR.purple],
    ["Ghost rate", "4 %", TR.amber],
  ];
  return (
    <Stage>
      <Exit>
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
          <div style={{ scale: String(s), translate: `${-push * 112}px ${push * 160}px` }}>
          <div style={{ width: W, height: H, ...rise(frameIn, 80), borderRadius: 26, overflow: "hidden", boxShadow: "0 40px 120px rgba(0,0,0,0.5)", background: TR.bg, display: "flex" }}>
            <div style={{ width: 320, background: TR.sidebar, padding: "36px 22px", display: "flex", flexDirection: "column", gap: 6 }}>
              <div style={{ color: "#2E5BC7", fontWeight: 700, fontSize: 26, textAlign: "center" }}>D Care Alliance</div>
              <Logo width={250} style={{ margin: "14px auto 30px" }} />
              {NAV.map((n, i) => {
                const p = useIn(8 + i * 3);
                const sub = n.startsWith("  ");
                return (
                  <div key={n} style={{ ...rise(p, 14), padding: sub ? "12px 20px 12px 64px" : "14px 20px", borderRadius: 12, fontSize: sub ? 22 : 24, fontWeight: 500, color: i === 0 ? TR.ink : "#2E3B66", background: i === 0 ? TR.sidebarActive : "transparent" }}>
                    {n.trim()}
                  </div>
                );
              })}
            </div>
            <div style={{ flex: 1, padding: "34px 40px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
                <div style={{ fontSize: 42, fontWeight: 700, flex: 1 }}>Analytics</div>
                <Button style={{ height: 58, fontSize: 22 }}>Provider's Day-Prep Station</Button>
                <Button style={{ height: 58, fontSize: 22 }}>Invite your Network</Button>
                <Button primary style={{ height: 58, fontSize: 22 }}>New Referral</Button>
              </div>
              <div style={{ display: "flex", gap: 14, marginTop: 40 }}>
                <Badge>Received 24</Badge>
                <Badge color={TR.text} bg="#fff" style={{ border: `1.5px solid ${TR.border}` }}>Last 30 days · daily</Badge>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 24, marginTop: 30 }}>
                {kpis.map(([t, v, c], i) => {
                  const p = useIn(34 + i * 5);
                  return (
                    <div key={t} style={{ ...rise(p), background: "#fff", border: `1.5px solid ${TR.border}`, borderRadius: 20, padding: 26, height: 200 }}>
                      <div style={{ fontSize: 20, color: TR.muted }}>{t}</div>
                      <div style={{ fontSize: 58, fontWeight: 700, marginTop: 10 }}>{v}</div>
                      <div style={{ height: 4, borderRadius: 2, background: c, marginTop: 36, width: `${interpolate(frame, [40 + i * 5, 70 + i * 5], [0, 100], clamp)}%` }} />
                    </div>
                  );
                })}
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 24, marginTop: 24 }}>
                {["Top senders", "Top procedures"].map((t, i) => (
                  <div key={t} style={{ ...rise(useIn(50 + i * 6)), background: "#fff", border: `1.5px solid ${TR.border}`, borderRadius: 20, padding: 26, height: 300 }}>
                    <div style={{ fontSize: 24, fontWeight: 700 }}>{t}</div>
                    {[0.9, 0.6, 0.4].map((w, k) => (
                      <div key={k} style={{ height: 40, borderRadius: 10, background: TR.purpleSoft, marginTop: 20, width: `${w * 100}%` }} />
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
          </div>
        </AbsoluteFill>
      </Exit>
    </Stage>
  );
};

// ---------------------------------------------------------------------------------------------------
// 2. New referral: the form fills itself and goes out securely.

export const NewReferral: React.FC = () => {
  const frame = useCurrentFrame();
  const card = useIn(0, 18, 130);
  const chips = [useIn(58), useIn(64), useIn(70)];
  const sent = frame >= 104;
  const sentP = useIn(104, 14, 200);
  const Field: React.FC<{ label: string; children: React.ReactNode; at: number }> = ({ label, children, at }) => (
    <div style={{ ...rise(useIn(at)), marginTop: 30 }}>
      <Label>{label}</Label>
      <div style={{ marginTop: 12, minHeight: 84, border: `2px solid ${TR.border}`, borderRadius: 16, display: "flex", alignItems: "center", gap: 16, padding: "0 24px", fontSize: 32, fontWeight: 600 }}>{children}</div>
    </div>
  );
  return (
    <Stage>
      <Exit>
        <div style={{ position: "absolute", left: 70, right: 70, top: 560, ...rise(card, 70) }}>
          <Card style={{ padding: 44 }}>
            <div style={{ display: "flex", alignItems: "baseline" }}>
              <div style={{ fontSize: 46, fontWeight: 700, flex: 1 }}>New Referral</div>
              <div style={{ fontSize: 26, color: TR.muted }}>Case #4821</div>
            </div>
            <div style={{ fontSize: 26, color: TR.muted, marginTop: 6 }}>From Dr. Patel · Bright Smile Family Dental</div>
            <Field label="Patient" at={8}>
              <Avatar initials="MA" size={52} />
              {typed("Maria Alvarez", frame, 14)}
            </Field>
            <Field label="Refer to" at={14}>
              <Icon d={ICON.send} />
              {typed("Endodontist · Root canal #3", frame, 32, 2.2)}
            </Field>
            <div style={{ ...rise(useIn(52)), marginTop: 30 }}>
              <Label>Attachments</Label>
              <div style={{ display: "flex", gap: 14, marginTop: 14, flexWrap: "wrap" }}>
                {["Clinical notes", "X-rays", "Insurance"].map((c, i) => (
                  <div key={c} style={{ ...rise(chips[i], 10), scale: String(0.6 + 0.4 * chips[i]) }}>
                    <Badge>
                      <Icon d={ICON.check} size={24} /> {c}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 46 }}>
              {sent ? (
                <div style={{ scale: String(0.8 + 0.2 * sentP) }}>
                  <Button primary style={{ background: TR.green, boxShadow: `0 12px 30px ${TR.green}55` }}>
                    <Icon d={ICON.shield} color="#fff" /> Sent securely
                  </Button>
                </div>
              ) : (
                <Button primary press={(frame - 98) / 6}>
                  <Icon d={ICON.send} color="#fff" /> Send referral
                </Button>
              )}
            </div>
          </Card>
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, top: 1300, textAlign: "center", ...rise(useIn(112)) }}>
          <Badge color="#fff" bg="rgba(255,255,255,0.14)" style={{ fontSize: 30, padding: "12px 26px" }}>
            Notes, X-rays and insurance in one package
          </Badge>
        </div>
        <Cursor path={[{ f: 70, x: 760, y: 1650 }, { f: 92, x: 880, y: 1435 }, { f: 130, x: 880, y: 1435 }]} clicks={[98]} />
      </Exit>
    </Stage>
  );
};

// ---------------------------------------------------------------------------------------------------
// 3. Incoming referrals: a new referral lands at the top of the list.

const ROWS = [
  { i: "JK", name: "Jonathan Kilbourn", office: "R Dental", st: "Scheduled", c: TR.green, bg: TR.greenSoft },
  { i: "SS", name: "Sam Smith", office: "Holland General Dentistry", st: "Contacted", c: TR.amber, bg: TR.amberSoft },
];
export const IncomingReferral: React.FC = () => {
  const frame = useCurrentFrame();
  const card = useIn(0, 18, 130);
  const drop = useIn(46, 13, 150);
  const glow = interpolate(frame, [52, 70, 110], [0, 1, 0.25], clamp);
  const Row: React.FC<{ i: string; name: string; office: string; st: string; c: string; bg: string; hi?: number }> = ({ i, name, office, st, c, bg, hi = 0 }) => (
    <div style={{ display: "flex", alignItems: "center", gap: 20, padding: "26px 22px", borderRadius: 18, background: hi ? `rgba(119,74,238,${0.08 * hi})` : "transparent", boxShadow: hi ? `inset 0 0 0 2px rgba(119,74,238,${0.5 * hi})` : "none" }}>
      <Avatar initials={i} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 31, fontWeight: 700 }}>{name}</div>
        <div style={{ fontSize: 24, color: TR.muted, marginTop: 4, display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ width: 12, height: 12, borderRadius: 6, background: TR.green }} /> {office}
        </div>
      </div>
      <Badge color={c} bg={bg}>{st}</Badge>
    </div>
  );
  return (
    <Stage>
      <Exit>
        <Toast at={30} title="New referral" body="Toledo Family Dental sent Maria Alvarez" />
        <div style={{ position: "absolute", left: 60, right: 60, top: 640, ...rise(card, 70) }}>
          <Card style={{ padding: "40px 30px" }}>
            <div style={{ display: "flex", alignItems: "center", padding: "0 14px" }}>
              <div style={{ fontSize: 44, fontWeight: 700, flex: 1 }}>Incoming Referrals</div>
              <Badge>Received {frame >= 52 ? 3 : 2}</Badge>
            </div>
            <div style={{ display: "flex", gap: 12, padding: "24px 14px 10px", color: TR.muted, fontSize: 22, fontWeight: 600 }}>
              <span style={{ flex: 1 }}>PATIENT · REFERRING OFFICE</span>
              <span>STATUS</span>
            </div>
            <div style={{ height: interpolate(drop, [0, 1], [0, 140]), overflow: "hidden" }}>
              <div style={{ ...rise(drop, -40) }}>
                <Row i="MA" name="Maria Alvarez" office="Toledo Family Dental" st="New" c={TR.purple} bg={TR.purpleSoft} hi={glow} />
              </div>
            </div>
            {ROWS.map((r) => (
              <Row key={r.i} {...r} />
            ))}
          </Card>
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, top: 1240, textAlign: "center", ...rise(useIn(80)) }}>
          <Badge color="#fff" bg="rgba(255,255,255,0.14)" style={{ fontSize: 30, padding: "12px 26px" }}>
            Every referral in one list · nothing lost in the fax
          </Badge>
        </div>
      </Exit>
    </Stage>
  );
};

// ---------------------------------------------------------------------------------------------------
// 4. Office communication: secure chat between the two practices, with @mentions.

export const OfficeChat: React.FC = () => {
  const frame = useCurrentFrame();
  const card = useIn(0, 18, 130);
  const msgs = [
    { at: 16, me: false, who: "Dr. Sally Smith", org: "Holland General Dentistry", text: "When can you see this patient?", mention: "@Lee Davis" },
    { at: 50, me: true, who: "Lee Davis", org: "D Care Alliance", text: "We can get the patient in this week." },
    { at: 84, me: false, who: "Dr. Sally Smith", org: "Holland General Dentistry", text: "Perfect, X-rays are attached. Thank you!" },
  ];
  const typing = frame >= 34 && frame < 50;
  const unread = frame < 56 ? 2 : 0;
  return (
    <Stage>
      <Exit>
        <div style={{ position: "absolute", left: 60, right: 60, top: 420, ...rise(card, 70) }}>
          <Card style={{ padding: 40 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <Icon d={ICON.chat} size={40} />
              <div style={{ fontSize: 40, fontWeight: 700, flex: 1 }}>Office Communication</div>
            </div>
            <div style={{ fontSize: 25, color: TR.muted, marginTop: 8 }}>Messaging with Holland General Dentistry</div>
            <div style={{ marginTop: 16, height: 50 }}>
              {unread > 0 ? <Badge color="#fff" bg={TR.purple}>2 unread @mentions</Badge> : <Badge color={TR.green} bg={TR.greenSoft}>All caught up</Badge>}
            </div>
            <div style={{ marginTop: 24, display: "flex", flexDirection: "column", gap: 22, minHeight: 640 }}>
              {msgs.map((m) => {
                const p = useIn(m.at, 15, 190);
                if (frame < m.at) return null;
                return (
                  <div key={m.at} style={{ ...rise(p, 30), alignSelf: m.me ? "flex-end" : "flex-start", maxWidth: "86%" }}>
                    <div style={{ fontSize: 22, color: TR.muted, marginBottom: 8, textAlign: m.me ? "right" : "left" }}>
                      <b style={{ color: TR.text }}>{m.who}</b> · {m.org}
                    </div>
                    <div style={{ padding: "22px 26px", borderRadius: 24, fontSize: 31, lineHeight: 1.35, background: m.me ? TR.purple : TR.purpleSoft, color: m.me ? "#fff" : TR.ink, borderBottomRightRadius: m.me ? 6 : 24, borderBottomLeftRadius: m.me ? 24 : 6 }}>
                      {m.mention && <span style={{ color: TR.purple, fontWeight: 700 }}>{m.mention} </span>}
                      {m.text}
                    </div>
                  </div>
                );
              })}
              {typing && (
                <div style={{ alignSelf: "flex-end", display: "flex", gap: 10, padding: "22px 26px", borderRadius: 24, background: TR.purpleSoft }}>
                  {[0, 1, 2].map((k) => (
                    <div key={k} style={{ width: 14, height: 14, borderRadius: 7, background: TR.purple, opacity: 0.35 + 0.65 * Math.max(0, Math.sin((frame - k * 4) / 4)) }} />
                  ))}
                </div>
              )}
            </div>
            <div style={{ marginTop: 20, display: "flex", alignItems: "center", gap: 12, fontSize: 24, color: TR.muted }}>
              <Icon d={ICON.shield} size={28} color={TR.green} /> HIPAA-secure · encrypted, instead of texts
            </div>
          </Card>
        </div>
      </Exit>
    </Stage>
  );
};

// ---------------------------------------------------------------------------------------------------
// 5. Status & lifecycle: the case moves Received → Contacted → Scheduled → Completed, logged.

const STEPS = [
  { t: "Received", d: "Mon 9:02" },
  { t: "Contacted", d: "Mon 11:40" },
  { t: "Scheduled", d: "Tue 9:12" },
  { t: "Completed", d: "Thu 2:30" },
];
const LOG = [
  "Referral created by Toledo Family Dental",
  "Secure insurance request sent to patient",
  "Patient added insurance · verified",
  "Appointment scheduled for Thu 2:30",
  "Treatment completed · notes shared",
];
export const CaseLifecycle: React.FC = () => {
  const frame = useCurrentFrame();
  const card = useIn(0, 18, 130);
  const stepAt = (i: number) => 18 + i * 22;
  const fill = interpolate(frame, [stepAt(0), stepAt(3)], [0, 1], clamp);
  const status = STEPS.reduce((s, st, i) => (frame >= stepAt(i) ? st.t : s), "New");
  return (
    <Stage>
      <Exit>
        <div style={{ position: "absolute", left: 60, right: 60, top: 400, ...rise(card, 70) }}>
          <Card style={{ padding: 44 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
              <Avatar initials="MA" size={70} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 38, fontWeight: 700 }}>Maria A. · #4821</div>
                <div style={{ fontSize: 24, color: TR.muted }}>Endodontist · Root canal #3</div>
              </div>
              <Badge color={status === "Completed" ? TR.green : TR.purple} bg={status === "Completed" ? TR.greenSoft : TR.purpleSoft}>{status}</Badge>
            </div>
            <div style={{ position: "relative", marginTop: 60, height: 170 }}>
              <div style={{ position: "absolute", left: 40, right: 40, top: 30, height: 8, borderRadius: 4, background: TR.purpleLine }} />
              <div style={{ position: "absolute", left: 40, top: 30, height: 8, borderRadius: 4, background: TR.purple, width: `calc((100% - 80px) * ${fill})` }} />
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                {STEPS.map((s, i) => {
                  const p = useIn(stepAt(i), 12, 200);
                  return (
                    <div key={s.t} style={{ width: 160, display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
                      <div style={{ width: 68, height: 68, borderRadius: 34, background: p > 0.5 ? TR.purple : "#fff", border: `4px solid ${p > 0.05 ? TR.purple : TR.purpleLine}`, display: "flex", alignItems: "center", justifyContent: "center", scale: String(1 + 0.25 * Math.sin(Math.PI * Math.min(1, p))), zIndex: 1 }}>
                        {p > 0.5 && <Icon d={ICON.check} color="#fff" size={34} />}
                      </div>
                      <div style={{ fontSize: 25, fontWeight: 700 }}>{s.t}</div>
                      <div style={{ fontSize: 21, color: TR.muted, opacity: p }}>{s.d}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </Card>
        </div>
        <div style={{ position: "absolute", left: 60, right: 60, top: 920, ...rise(useIn(12, 18, 130), 70) }}>
          <Card style={{ padding: 40 }}>
            <div style={{ fontSize: 34, fontWeight: 700 }}>Activity log</div>
            {LOG.map((l, i) => {
              const p = useIn(24 + i * 16);
              return (
                <div key={l} style={{ ...rise(p, 16), display: "flex", alignItems: "center", gap: 18, marginTop: 24, fontSize: 28 }}>
                  <div style={{ width: 16, height: 16, borderRadius: 8, background: i === LOG.length - 1 ? TR.green : TR.purple, flex: "none" }} />
                  {l}
                </div>
              );
            })}
          </Card>
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, top: 1560, textAlign: "center", ...rise(useIn(100)) }}>
          <Badge color="#fff" bg="rgba(255,255,255,0.14)" style={{ fontSize: 30, padding: "12px 26px" }}>
            Both offices track the same case
          </Badge>
        </div>
      </Exit>
    </Stage>
  );
};

// ---------------------------------------------------------------------------------------------------
// 6. Analytics: the four KPI cards count up, the volume chart draws against the prior period.

const VOL = [1, 2, 1, 3, 2, 4, 3, 5, 4, 6, 5, 7, 6, 8];
const PRIOR = [1, 1, 2, 1, 2, 2, 1, 3, 2, 2, 3, 2, 3, 3];
export const AnalyticsKpis: React.FC = () => {
  const frame = useCurrentFrame();
  const kpis = [
    { t: "Volume received", v: count(frame, 14, 40, 24), f: (n: number) => Math.round(n).toString(), u: "", c: TR.purple, delta: "+33% vs prior" },
    { t: "Time to first contact", v: count(frame, 18, 40, 2), f: (n: number) => n.toFixed(1), u: "h", c: TR.green, delta: "−1.5 h vs prior" },
    { t: "Case acceptance", v: count(frame, 22, 40, 86), f: (n: number) => Math.round(n).toString(), u: "%", c: TR.purple, delta: "+12% vs prior" },
    { t: "Ghost rate", v: count(frame, 26, 40, 4), f: (n: number) => Math.round(n).toString(), u: "%", c: TR.amber, delta: "−6% vs prior" },
  ];
  const draw = interpolate(frame, [56, 100], [0, 1], clamp);
  const w = 880;
  const h = 300;
  const pts = (arr: number[]) => arr.map((v, i) => `${(i / (arr.length - 1)) * w},${h - (v / 8) * (h - 20)}`).join(" ");
  return (
    <Stage>
      <Exit>
        <div style={{ position: "absolute", left: 60, right: 60, top: 360, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 28 }}>
          {kpis.map((k, i) => {
            const p = useIn(4 + i * 5);
            return (
              <Card key={k.t} style={{ ...rise(p, 50), padding: 34, borderRadius: 26 }}>
                <div style={{ fontSize: 25, color: TR.muted }}>{k.t}</div>
                <div style={{ fontSize: 86, fontWeight: 700, marginTop: 10, fontVariantNumeric: "tabular-nums", lineHeight: 1 }}>
                  {k.f(k.v)}
                  <span style={{ fontSize: 40, color: TR.muted, marginLeft: 6 }}>{k.u}</span>
                </div>
                <div style={{ marginTop: 18 }}>
                  <Badge color={k.c} bg={k.c === TR.amber ? TR.amberSoft : k.c === TR.green ? TR.greenSoft : TR.purpleSoft} style={{ fontSize: 21 }}>{k.delta}</Badge>
                </div>
                <div style={{ height: 6, borderRadius: 3, background: k.c, marginTop: 24, width: `${interpolate(frame, [20 + i * 5, 60 + i * 5], [0, 100], clamp)}%` }} />
              </Card>
            );
          })}
        </div>
        <div style={{ position: "absolute", left: 60, right: 60, top: 1130, ...rise(useIn(44), 60) }}>
          <Card style={{ padding: 40 }}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 34, fontWeight: 700 }}>Volume received</div>
                <div style={{ fontSize: 23, color: TR.muted, marginTop: 4 }}>Daily receipts · last 30 days</div>
              </div>
              <div style={{ display: "flex", gap: 20, fontSize: 22, color: TR.muted }}>
                <span><span style={{ display: "inline-block", width: 16, height: 16, borderRadius: 4, background: TR.purple, marginRight: 8 }} />Current</span>
                <span><span style={{ display: "inline-block", width: 16, height: 16, borderRadius: 4, background: "#CFC3F7", marginRight: 8 }} />Prior</span>
              </div>
            </div>
            <svg width={w} height={h} style={{ marginTop: 30, overflow: "visible" }}>
              <polyline points={pts(PRIOR)} fill="none" stroke="#CFC3F7" strokeWidth={5} strokeDasharray="12 10" opacity={draw > 0 ? 1 : 0} />
              <polyline points={pts(VOL)} fill="none" stroke={TR.purple} strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - draw} />
            </svg>
          </Card>
        </div>
      </Exit>
    </Stage>
  );
};

// ---------------------------------------------------------------------------------------------------
// 7. Needs attention: the dashboard flags what slipped, one click fixes it.

export const NeedsAttention: React.FC = () => {
  const frame = useCurrentFrame();
  const card = useIn(0, 18, 130);
  const items = [
    { t: "2 appointments past date", s: "no completion note", a: "Mark complete" },
    { t: "1 ghost referral", s: "3+ contact attempts", a: "Re-assign" },
    { t: "1 insurance request outstanding", s: "older than 48 h", a: "Send reminder" },
  ];
  const doneAt = 92;
  return (
    <Stage>
      <Exit>
        <div style={{ position: "absolute", left: 60, right: 60, top: 600, ...rise(card, 70) }}>
          <Card style={{ padding: 44 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <Icon d={ICON.alert} size={40} color={TR.amber} />
              <div style={{ fontSize: 42, fontWeight: 700 }}>Needs attention</div>
            </div>
            <div style={{ fontSize: 25, color: TR.muted, marginTop: 8 }}>{frame >= doneAt ? 2 : 3} items · tap a row to act</div>
            {items.map((it, i) => {
              const p = useIn(14 + i * 8);
              const done = i === 2 && frame >= doneAt;
              const dp = useIn(doneAt, 14, 200);
              return (
                <div key={it.t} style={{ ...rise(p, 20), display: "flex", alignItems: "center", gap: 20, marginTop: 30, padding: "26px 24px", borderRadius: 20, background: done ? TR.greenSoft : TR.bg, border: `2px solid ${done ? TR.green : TR.border}` }}>
                  <div style={{ width: 20, height: 20, borderRadius: 10, background: done ? TR.green : TR.amber, flex: "none" }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 30, fontWeight: 700 }}>{it.t}</div>
                    <div style={{ fontSize: 23, color: TR.muted, marginTop: 4 }}>{it.s}</div>
                  </div>
                  {done ? (
                    <div style={{ scale: String(0.7 + 0.3 * dp) }}>
                      <Badge color={TR.green} bg="#fff"><Icon d={ICON.check} size={24} color={TR.green} /> Reminder sent</Badge>
                    </div>
                  ) : (
                    <div style={{ fontSize: 25, fontWeight: 700, color: TR.purple, whiteSpace: "nowrap" }}>{it.a} →</div>
                  )}
                </div>
              );
            })}
          </Card>
        </div>
        <Cursor path={[{ f: 50, x: 640, y: 1580 }, { f: 82, x: 900, y: 1220 }, { f: 130, x: 900, y: 1220 }]} clicks={[88]} />
      </Exit>
    </Stage>
  );
};

// ---------------------------------------------------------------------------------------------------

export const TR_SCENES = [
  { id: "TR-01-overview", C: DashboardOverview, dur: 135 },
  { id: "TR-02-new-referral", C: NewReferral, dur: 150 },
  { id: "TR-03-incoming", C: IncomingReferral, dur: 135 },
  { id: "TR-04-office-chat", C: OfficeChat, dur: 135 },
  { id: "TR-05-case-lifecycle", C: CaseLifecycle, dur: 150 },
  { id: "TR-06-analytics", C: AnalyticsKpis, dur: 135 },
  { id: "TR-07-needs-attention", C: NeedsAttention, dur: 135 },
];

/** All seven scenes back to back, for review. */
export const TrDashboardTour: React.FC = () => (
  <Series>
    {TR_SCENES.map(({ id, C, dur }) => (
      <Series.Sequence key={id} durationInFrames={dur}>
        <C />
      </Series.Sequence>
    ))}
  </Series>
);
export const TR_TOUR_DURATION = TR_SCENES.reduce((s, x) => s + x.dur, 0);
