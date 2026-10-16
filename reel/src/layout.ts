import { measureText } from "@remotion/layout-utils";
import { minAvatarTop } from "./camera";
import type { Chunk } from "./edit";
import { FONT_DISPLAY, WIDTH, ZONES } from "./theme";

export const CAPTION = {
  maxFont: 88,
  minFont: 56,
  step: 4,
  lineHeight: 1.12,
  weight: "800" as const,
  letterSpacing: -0.5,
  /** Horizontal padding inside each word box (room for the active-word highlight). */
  padEm: 0.13,
  /** Gap between word boxes. */
  gapEm: 0.05,
  maxLines: 3,
};

export type Box = { x0: number; y0: number; x1: number; y1: number };

export type CaptionLayout = {
  fontSize: number;
  lines: { words: { index: number; x: number; width: number }[]; y: number; width: number }[];
  box: Box;
};

const measure = (text: string, fontSize: number) =>
  measureText({
    text,
    fontFamily: FONT_DISPLAY,
    fontWeight: CAPTION.weight,
    fontSize,
    letterSpacing: `${CAPTION.letterSpacing}px`,
    validateFontIsLoaded: true,
  }).width;

/** Split word widths into `n` lines minimising the widest line (balanced, not greedy). */
const balancedSplit = (widths: number[], gap: number, n: number): number[][] | null => {
  const k = widths.length;
  if (n > k) return null;
  const lineWidth = (a: number, b: number) =>
    widths.slice(a, b).reduce((s, w) => s + w, 0) + gap * (b - a - 1);
  let best: { cost: number; breaks: number[] } | null = null;
  const search = (start: number, linesLeft: number, acc: number[], worst: number) => {
    if (linesLeft === 1) {
      const cost = Math.max(worst, lineWidth(start, k));
      if (!best || cost < best.cost) best = { cost, breaks: [...acc, k] };
      return;
    }
    for (let end = start + 1; end <= k - linesLeft + 1; end++) {
      search(end, linesLeft - 1, [...acc, end], Math.max(worst, lineWidth(start, end)));
    }
  };
  search(0, n, [], 0);
  if (!best) return null;
  const { breaks } = best as { cost: number; breaks: number[] };
  const lines: number[][] = [];
  let s = 0;
  for (const b of breaks) {
    lines.push(Array.from({ length: b - s }, (_, i) => s + i));
    s = b;
  }
  return lines;
};

/**
 * Fit a caption chunk inside the caption band using measured glyph widths.
 * Tries the largest font first, fewest balanced lines first; shrinks until the block
 * fits both the band and the space above the avatar for the chunk's whole lifetime.
 */
export const layoutCaption = (chunk: Chunk, band?: { top: number; bottom: number }): CaptionLayout => {
  const maxWidth = WIDTH - ZONES.sideMargin * 2;
  // Without a band: the reel's caption band, kept above the avatar. With one: the caller placed it.
  const top = band ? band.top : ZONES.caption.top;
  const bottomLimit = band ? band.bottom : Math.min(ZONES.caption.bottom, minAvatarTop(chunk.start, chunk.end) - ZONES.avatarGap);
  const available = bottomLimit - top;

  for (let fontSize = CAPTION.maxFont; fontSize >= CAPTION.minFont; fontSize -= CAPTION.step) {
    const pad = fontSize * CAPTION.padEm;
    const gap = fontSize * CAPTION.gapEm;
    const widths = chunk.words.map((w) => measure(w.text, fontSize) + pad * 2);
    const lineH = fontSize * CAPTION.lineHeight;
    for (let n = 1; n <= CAPTION.maxLines; n++) {
      if (n * lineH > available) break;
      const split = balancedSplit(widths, gap, n);
      if (!split) break;
      const lineWidths = split.map((idx) => idx.reduce((s, i) => s + widths[i], 0) + gap * (idx.length - 1));
      if (Math.max(...lineWidths) > maxWidth) continue;
      // Prefer two balanced lines over one very long line for readability on phones.
      if (n === 1 && lineWidths[0] > maxWidth * 0.82 && chunk.words.length > 3) continue;
      const blockH = n * lineH;
      const center = (top + bottomLimit) / 2;
      const y0 = Math.max(top, center - blockH / 2);
      const lines = split.map((idx, li) => {
        let x = (WIDTH - lineWidths[li]) / 2;
        const words = idx.map((i) => {
          const word = { index: i, x, width: widths[i] };
          x += widths[i] + gap;
          return word;
        });
        return { words, y: y0 + li * lineH, width: lineWidths[li] };
      });
      const x0 = Math.min(...lines.map((l) => l.words[0].x));
      const x1 = Math.max(...lines.map((l) => l.words[0].x + l.width));
      return { fontSize, lines, box: { x0, y0, x1, y1: y0 + blockH } };
    }
  }
  throw new Error(`Caption ${chunk.index} cannot fit above the avatar: "${chunk.words.map((w) => w.text).join(" ")}"`);
};

/** Stage box for a scene that is on screen during [from, to]: shrinks if the avatar would intrude. */
export const stageBox = (from: number, to: number): Box & { scale: number } => {
  const limit = Math.min(ZONES.stage.bottom, minAvatarTop(from, to) - ZONES.avatarGap);
  const fullH = ZONES.stage.bottom - ZONES.stage.top;
  const scale = Math.min(1, (limit - ZONES.stage.top) / fullH);
  return { x0: ZONES.sideMargin, x1: WIDTH - ZONES.sideMargin, y0: ZONES.stage.top, y1: ZONES.stage.top + fullH * scale, scale };
};

export const overlaps = (a: Box, b: Box) => a.x0 < b.x1 && b.x0 < a.x1 && a.y0 < b.y1 && b.y0 < a.y1;
