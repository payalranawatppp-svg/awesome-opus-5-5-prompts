// Render a set of review stills (and an optional contact sheet) from one bundle.
//   node scripts/stills.mjs 0 50 120 ...        → out/stills/frame-XXXX.png
// Set REMOTION_BROWSER to use a locally installed Chrome Headless Shell.
import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition } from "@remotion/renderer";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const frames = process.argv.slice(2).map(Number);
const compositionId = process.env.COMPOSITION ?? "SignalReachReel";
const scale = Number(process.env.SCALE ?? 1);
const outDir = path.resolve("out/stills");
await mkdir(outDir, { recursive: true });

const serveUrl = await bundle({ entryPoint: path.resolve("src/index.ts") });
const browserExecutable = process.env.REMOTION_BROWSER ?? null;
const composition = await selectComposition({ serveUrl, id: compositionId, browserExecutable });
for (const frame of frames) {
  const output = path.join(outDir, `${compositionId}-${String(frame).padStart(4, "0")}.png`);
  await renderStill({ composition, serveUrl, frame, output, scale, browserExecutable });
  console.log(output);
}
