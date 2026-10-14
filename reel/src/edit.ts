import edl from "./data/edl.json";
import transcript from "./data/transcript.json";
import { COLORS } from "./theme";

export type ClipId = keyof typeof transcript;
export type Section = "problem" | "solution" | "outcome" | "cta";

export type Segment = {
  id: string;
  clip: ClipId;
  /** Source frames (30 fps) within the clip. */
  in: number;
  out: number;
  section: Section;
  /** Output frame where this segment starts. */
  from: number;
  duration: number;
};

export const FPS = edl.fps;

export const SEGMENTS: Segment[] = (() => {
  let from = 0;
  return edl.segments.map((s) => {
    const seg = { ...s, clip: s.clip as ClipId, section: s.section as Section, from, duration: s.out - s.in };
    from += seg.duration;
    return seg;
  });
})();

const last = SEGMENTS[SEGMENTS.length - 1];
export const CUT_END = last.from + last.duration;
export const TAIL_HOLD = edl.tailHoldFrames;
export const DURATION = CUT_END + TAIL_HOLD;

export const segmentAt = (frame: number): Segment =>
  SEGMENTS.find((s) => frame >= s.from && frame < s.from + s.duration) ?? last;

/** Source time (seconds within the clip) shown at an output frame. Tail hold freezes the last frame. */
export const sourceTimeAt = (frame: number): { clip: ClipId; t: number } => {
  const seg = segmentAt(frame);
  const local = Math.min(frame, CUT_END - 1) - seg.from;
  return { clip: seg.clip, t: (seg.in + local) / FPS };
};

export type Word = { text: string; start: number; end: number; clip: ClipId };

/** Every spoken word that survives the edit, in output frames (fractional). */
export const WORDS: Word[] = SEGMENTS.flatMap((seg) =>
  transcript[seg.clip].words
    .map((w) => ({ w, mid: ((w.start + w.end) / 2) * FPS }))
    .filter(({ mid }) => mid >= seg.in && mid < seg.out)
    .map(({ w }) => ({
      text: w.word,
      clip: seg.clip,
      start: seg.from + Math.max(w.start * FPS, seg.in) - seg.in,
      end: seg.from + Math.min(w.end * FPS, seg.out) - seg.in,
    })),
);

const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9']/g, "");

/** Output frame at which the n-th occurrence of `word` starts (rounded). Throws if missing. */
export const at = (word: string, occurrence = 1): number => {
  const hits = WORDS.filter((w) => norm(w.text) === norm(word));
  const hit = hits[occurrence - 1];
  if (!hit) throw new Error(`Word "${word}" #${occurrence} not found in edit`);
  return Math.round(hit.start);
};
export const endOf = (word: string, occurrence = 1): number => {
  const hits = WORDS.filter((w) => norm(w.text) === norm(word));
  const hit = hits[occurrence - 1];
  if (!hit) throw new Error(`Word "${word}" #${occurrence} not found in edit`);
  return Math.round(hit.end);
};

// ---------------------------------------------------------------------------
// Caption chunks: phrase-sized, following the speaker's own pauses.
// Keywords get a persistent accent colour; every word pops as it is spoken.
// ---------------------------------------------------------------------------
type ChunkSpec = { text: string; accents?: Record<string, string> };

const CHUNK_SPECS: ChunkSpec[] = [
  { text: "Does your LinkedIn look like this?", accents: { LinkedIn: COLORS.cyan, "this?": COLORS.amber } },
  { text: "Quiet page,", accents: { Quiet: COLORS.rose } },
  { text: "hardly any updates?", accents: { updates: COLORS.rose } },
  { text: "Running a business", accents: { business: COLORS.cyan } },
  { text: "leaves little time for posting.", accents: { little: COLORS.amber, time: COLORS.amber } },
  { text: "At Signal Reach,", accents: { Signal: COLORS.cyan, Reach: COLORS.cyan } },
  { text: "we help with the whole picture.", accents: { whole: COLORS.amber, picture: COLORS.amber } },
  { text: "Useful posts,", accents: { Useful: COLORS.blue, posts: COLORS.blue } },
  { text: "thoughtful comment replies,", accents: { comment: COLORS.violet, replies: COLORS.violet } },
  { text: "personalized outreach,", accents: { personalized: COLORS.coral, outreach: COLORS.coral } },
  { text: "and managing your inbox.", accents: { inbox: COLORS.mint, managing: COLORS.mint } },
  { text: "The aim?", accents: { aim: COLORS.coral } },
  { text: "A more active page,", accents: { active: COLORS.mint } },
  { text: "relevant followers,", accents: { relevant: COLORS.cyan, followers: COLORS.cyan } },
  { text: "and conversations that could become leads,", accents: { conversations: COLORS.violet, leads: COLORS.amber } },
  { text: "without taking over your day.", accents: { day: COLORS.mint } },
  { text: "Start with one useful post", accents: { one: COLORS.amber, post: COLORS.blue } },
  { text: "and a few genuine replies.", accents: { genuine: COLORS.violet, replies: COLORS.violet } },
  { text: "Need a hand staying consistent?", accents: { consistent: COLORS.mint } },
  { text: "Let's build your plan.", accents: { plan: COLORS.amber, build: COLORS.amber } },
];

export type ChunkWord = Word & { accent?: string };
export type Chunk = { index: number; words: ChunkWord[]; start: number; end: number };

const LEAD_IN = 2; // frames a chunk appears before its first word
const MAX_HOLD = 36; // frames a chunk lingers after its last word when followed by a pause
const EXIT = 5; // frames for the exit animation; next chunk never overlaps it

export const CHUNKS: Chunk[] = (() => {
  let cursor = 0;
  const raw = CHUNK_SPECS.map((spec, index) => {
    const tokens = spec.text.split(/\s+/);
    const words = tokens.map((tok) => {
      const w = WORDS[cursor++];
      if (!w || norm(w.text) !== norm(tok)) {
        throw new Error(`Caption chunk ${index} expected "${tok}" but transcript has "${w?.text}"`);
      }
      const accent = Object.entries(spec.accents ?? {}).find(([k]) => norm(k) === norm(tok))?.[1];
      return { ...w, text: tok, accent };
    });
    return { index, words };
  });
  if (cursor !== WORDS.length) throw new Error(`Captions cover ${cursor} of ${WORDS.length} words`);
  return raw.map((c, i) => {
    const start = Math.max(0, Math.round(c.words[0].start) - LEAD_IN);
    const lastEnd = Math.round(c.words[c.words.length - 1].end);
    const next = raw[i + 1];
    const nextStart = next ? Math.round(next.words[0].start) - LEAD_IN : DURATION;
    const end = Math.min(nextStart - EXIT, lastEnd + MAX_HOLD, DURATION);
    return { ...c, start, end: Math.max(end, lastEnd) };
  });
})();
export const CAPTION_EXIT = EXIT;

// ---------------------------------------------------------------------------
// Story cues: one source of truth for motion-graphic triggers and SFX.
// ---------------------------------------------------------------------------
const seg = (id: string) => SEGMENTS.find((s) => s.id === id)!;

export const CUES = {
  hookPunch: 0,
  profileIn: 1,
  profileThis: at("this?"),
  quiet: at("Quiet"),
  updates: at("updates?"),
  timeIn: at("Running") - 4,
  littleTime: at("little"),
  posting: at("posting."),
  toSolution: seg("solution").from,
  brand: at("Signal"),
  wholePicture: at("whole"),
  svcPosts: at("Useful"),
  svcReplies: at("thoughtful"),
  svcOutreach: at("personalized"),
  svcInbox: at("managing"),
  servicesComplete: endOf("inbox."),
  toOutcome: seg("outcome").from,
  aimHit: endOf("aim?") - 1, // lands in the pause after the question, not over the word
  outActive: at("active"),
  outFollowers: at("relevant"),
  outConversations: at("conversations"),
  outLeads: at("leads,"),
  yourDay: at("without"),
  dayCheck: at("day."),
  toCta: seg("cta-a").from,
  onePost: at("one"),
  replies: [at("few"), at("genuine"), at("replies.", 2)],
  consistent: at("Need"),
  weekTicks: at("staying"),
  ctaIn: seg("cta-c").from,
  ctaClick: at("plan."),
  end: DURATION,
} as const;
