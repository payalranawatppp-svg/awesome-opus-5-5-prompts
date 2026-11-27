/**
 * UGC 17 "Five moments every specialist office knows": every name, date and message shown on screen.
 * The UGC 17 cast overrides the series demo names for this video only (user brief). No screen may hard-code text
 * that contradicts this file.
 */
export type Person = { ini: string; name: string; role: string; office: string; col: string; inactive?: boolean };

export const HARBORVIEW = "Harborview Dental Group";
export const LAKESIDE = "Lakeside Family Dental";
export const TODAY = "Mon, Nov 10, 2026";

export const P = {
  rachel: { ini: "RM", name: "Rachel Moore", role: "Treatment Coordinator", office: HARBORVIEW, col: "#6D4AE8" },
  kevin: { ini: "KT", name: "Kevin Tran", role: "Front Desk", office: HARBORVIEW, col: "#2F80ED" },
  ruiz: { ini: "ER", name: "Dr. Elena Ruiz", role: "Associate Dentist", office: HARBORVIEW, col: "#0F9D8A" },
  jenna: { ini: "JP", name: "Jenna Park", role: "Front Desk", office: HARBORVIEW, col: "#9AA0AE", inactive: true },
  whitaker: { ini: "JW", name: "Dr. James Whitaker", role: "Owner Dentist", office: LAKESIDE, col: "#B7791F" },
  megan: { ini: "MC", name: "Megan Cole", role: "Office Manager", office: LAKESIDE, col: "#8E4DB8" },
} satisfies Record<string, Person>;

export type Status =
  | "New" | "Received" | "Left a Voicemail" | "Unable to Contact" | "Consultation Scheduled" | "Consultation Completed"
  | "Scheduled" | "Completed" | "Cancelled" | "Declined Appointment" | "Referred Out";
/** The real status list, in the app's order (status dropdown in FIX 5). */
export const STATUSES: Status[] = [
  "Received", "Left a Voicemail", "Unable to Contact", "Consultation Scheduled", "Consultation Completed",
  "Scheduled", "Completed", "Cancelled", "Declined Appointment", "Referred Out",
];
/** Pill colours: [background, text]. No red anywhere (client rule); declined is amber. */
export const PILL: Record<Status, [string, string]> = {
  New: ["#E6E7FD", "#3B2E7E"], Received: ["#E8F1FF", "#1D4E9E"], "Left a Voicemail": ["#FFF3D6", "#8A5A00"],
  "Unable to Contact": ["#FFF3D6", "#8A5A00"], "Consultation Scheduled": ["#EDE7FF", "#4B2FC9"],
  "Consultation Completed": ["#E3F8EC", "#16794A"], Scheduled: ["#E3F8EC", "#16794A"], Completed: ["#E3F8EC", "#16794A"],
  Cancelled: ["#EEF0F4", "#4B5563"], "Declined Appointment": ["#FFE7B3", "#7A4B00"], "Referred Out": ["#EEF0F4", "#4B5563"],
};

export type Patient = { ini: string; name: string; dob: string; reason: string; from: string; status: Status; update: string; col: string };
export const OLIVIA: Patient = {
  ini: "OB", name: "Olivia Bennett", dob: "04/12/1988", reason: "Implant consultation, tooth #19", from: LAKESIDE,
  status: "Consultation Scheduled", update: "Nov 4 · Jenna Park", col: "#C2417A",
};
export const DANIEL: Patient = {
  ini: "DO", name: "Daniel Ortiz", dob: "09/03/1971", reason: "Implant placement, tooth #30", from: LAKESIDE,
  status: "Scheduled", update: "Nov 6 · Kevin Tran", col: "#2C7A7B",
};
export const CONSULT = "Nov 14, 2026, 10:00 AM";
export const CONSULT_SHORT = "Nov 14, 10:00 AM";

/** Incoming Referrals list (HOOK). */
export const INCOMING: Patient[] = [
  OLIVIA,
  { ini: "EH", name: "Emma Hughes", dob: "02/27/1979", reason: "Endodontic evaluation", from: "Riverside Family Dentistry", status: "New", update: "Nov 9 · Kevin Tran", col: "#3F6AD8" },
  { ini: "ML", name: "Marcus Lee", dob: "07/15/1964", reason: "Extraction, tooth #1", from: "Maple Grove Dental", status: "Left a Voicemail", update: "Nov 8 · Kevin Tran", col: "#B7791F" },
  { ini: "SR", name: "Sofia Ramirez", dob: "11/30/1992", reason: "Bone graft consult", from: LAKESIDE, status: "Scheduled", update: "Nov 7 · Rachel Moore", col: "#6B46C1" },
  DANIEL,
];

/** FIX 1: activity history on Olivia's case, top to bottom. */
export const HISTORY: { when: string; who: Person; text: string; quote?: string; status?: Status }[] = [
  { when: "Nov 3, 8:41 AM", who: P.megan, text: "New referral sent · Implant consultation #19" },
  { when: "Nov 3, 9:05 AM", who: P.jenna, text: "Status → Received", status: "Received" },
  { when: "Nov 3, 2:30 PM", who: P.jenna, text: "Status → Left a Voicemail", status: "Left a Voicemail" },
  { when: "Nov 4, 10:20 AM", who: P.jenna, text: "Message to Lakeside", quote: "Reached Olivia, booking her consult for Nov 14." },
  { when: "Nov 4, 10:24 AM", who: P.jenna, text: `Status → Consultation Scheduled · ${CONSULT_SHORT}`, status: "Consultation Scheduled" },
  { when: "Nov 10, 9:12 AM", who: P.rachel, text: "Viewed case" },
];

/** FIX 2: attachments shared with both offices. */
export const XRAYS = ["Panoramic · Mar 2023", "Panoramic · Aug 2021"];
export const DOCS = ["Referral letter.pdf"];

/** FIX 3: administrative notes (private to Harborview). */
export const NOTE_RACHEL = { mention: "@Dr. Elena Ruiz", text: " Olivia's pano is from Mar 2023. Should we take a new one before her consult on Nov 14?" };
export const NOTE_RUIZ = "Yes please. Book her a 60-minute slot so we can take it before the consult.";
export const NOTE_KEVIN = `Done: ${CONSULT_SHORT}, 60 min. New pano added to the visit.`;

/** FIX 4: consultation-note template. */
export const WORD_FILE = "Dr Ruiz consult letter.docx";
export const TEMPLATE_NAME = "Harborview · Implant Consultation";
export const TEMPLATE_LINES: { label: string; v: string; value: string }[][] = [
  [{ label: "Patient: ", v: "{{patientName}}", value: OLIVIA.name }, { label: ", DOB ", v: "{{patientDob}}", value: OLIVIA.dob }],
  [{ label: "Dear ", v: "{{referringDoctorName}}", value: P.whitaker.name }, { label: ", ", v: "{{referringOfficeName}}", value: LAKESIDE }],
  [{ label: "Thank you for your referral. We saw your patient on ", v: "{{consultDate}}", value: "Nov 14, 2026" }],
  [{ label: "Sincerely, ", v: "{{doctorName}}", value: P.ruiz.name }],
];

/** FIX 5. */
export const DECLINE_NOTE = "Daniel decided not to go ahead with the implant for now. Happy to see him whenever he's ready.";
export const DECLINE_TIME = "Today 2:14 PM";
export const OUTGOING: Patient[] = [
  { ...DANIEL, status: "Declined Appointment", update: `${DECLINE_TIME} · ${HARBORVIEW}` },
  { ...OLIVIA, update: "Nov 4 · Harborview Dental Group" },
  { ...INCOMING[3], update: "Nov 7 · Harborview Dental Group" },
];

/** Chips at the end of each fix: old way (amber ✕) → new way (green ✓). */
export const CHIPS: Record<string, [string, string]> = {
  fix1: ["Jenna knew", "Full history on the case"],
  fix2: ["Personal phone", "On the case, secure"],
  fix3: ["Remind me after lunch", "Tagged, answered, private"],
  fix4: ["Retyped every time", "Template, signed, sent"],
  fix5: ["Found out at recall", "Same-day update"],
};

/** Text behind the people in each scene, in the scene's own colours. */
/** `at`: the word that brings the text in (Ethan's clips: it lands on the key word, not the cut). */
export const BEHIND: Record<string, { text: string; c1: string; c2: string; y: number; at?: string }> = {
  s1: { text: "JENNA\nKNEW", c1: "#6E5A47", c2: "#C9B8A3", y: 90 },
  s2: { text: "JUST\nTEXT IT?", c1: "#1E4E5C", c2: "#7FB5BE", y: 200 },
  s3: { text: "AFTER\nLUNCH", c1: "#1B2B4A", c2: "#6F86B0", y: 200 },
  s4: { text: "EVERY\nTIME", c1: "#C98A3D", c2: "#FFE2B0", y: 200 },
  s5: { text: "NOBODY\nTOLD US", c1: "#5E3B26", c2: "#C79A72", y: 200 },
  e1: { text: "5\nMOMENTS", c1: "#3F2F22", c2: "#9C8068", y: 170, at: "five" },
  e2: { text: "REFERRALS\nSLIP", c1: "#3F2F22", c2: "#9C8068", y: 200, at: "together," },
  e3: { text: "TOOTH\nREFERRAL", c1: "#4B2FC9", c2: "#B9A6FF", y: 200, at: "tooth" },
};
/** Caption tint per scene (stroke + glow), sampled from each scene's dominant tones. */
export const CAP_TINT: Record<string, string> = {
  s1: "#2B221B", s2: "#10262D", s3: "#111A2C", s4: "#1A1E2E", s5: "#2A1B13", e1: "#2A2119", e2: "#2A2119", e3: "#2A2119", vo: "#1B1240",
};

// ============================================================================ real-app replica (real.tsx), Harborview's view
/** Office Communication on Olivia's case (shared with Lakeside). `m` = @mention at the start of the body. */
export type OcMsg = { who: Person; when: string; m?: string; body: string; quote?: { who: string; text: string } };
const full = (p: Person) => `${p.name} (${p.office})`;
export const fullName = full;
export const OC_OLIVIA: OcMsg[] = [
  { who: P.megan, when: "Nov 3, 8:41 AM", body: "Hi team, referring Olivia Bennett for an implant consult on #19. Her pano and insurance card are attached." },
  { who: P.jenna, when: "Nov 3, 2:30 PM", m: "@Megan Cole", body: " Received, thank you. Left Olivia a voicemail, will try her again tomorrow morning." },
  { who: P.megan, when: "Nov 4, 9:02 AM", m: "@Jenna Park", body: " Thanks! She said mornings work best for her." },
  { who: P.jenna, when: "Nov 4, 10:20 AM", m: "@Megan Cole", body: " Reached Olivia. Consult booked for Nov 14 at 10:00 AM.", quote: { who: full(P.megan), text: "@Jenna Park Thanks! She said mornings work best for her." } },
];
/** FIX 5: Daniel's case. */
export const OC_DANIEL: OcMsg[] = [
  { who: P.megan, when: "Nov 5, 11:10 AM", body: "Referring Daniel Ortiz for implant placement on #30. X-rays attached." },
  { who: P.kevin, when: "Nov 6, 3:45 PM", m: "@Megan Cole", body: " Daniel is scheduled for Nov 13 at 9:00 AM." },
];
export const OC_DECLINE: OcMsg = { who: P.kevin, when: "Nov 10, 2:14 PM", m: "@Megan Cole", body: ` ${DECLINE_NOTE}` };
/** FIX 3: Administrative Notes (company-private), newest first. */
export type AdNote = { who: Person; when: string; m?: string; body: string; quote?: { who: string; text: string }; unread?: boolean };
export const AN_OLIVIA: AdNote[] = [
  { who: P.ruiz, when: "Nov 10, 9:31 AM", m: "@Rachel Moore", body: ` ${NOTE_RUIZ}`, quote: { who: P.rachel.name, text: `${NOTE_RACHEL.mention}${NOTE_RACHEL.text}` }, unread: true },
  { who: P.rachel, when: "Nov 10, 9:20 AM", m: NOTE_RACHEL.mention, body: NOTE_RACHEL.text },
];
export const ACTIVITY_OLIVIA: { who: string; when: string; text: string }[] = [
  { who: "Jenna Park", when: "11/4/2026 10:24 am", text: "scheduled Referral" },
  { who: "Jenna Park", when: "11/3/2026 2:31 pm", text: "left a voicemail Referral" },
  { who: "Jenna Park", when: "11/3/2026 9:05 am", text: "received Referral" },
  { who: "Megan Cole", when: "11/3/2026 8:41 am", text: "updated: x-rays added" },
];
