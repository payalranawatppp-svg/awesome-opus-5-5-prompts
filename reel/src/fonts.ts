import { loadFont } from "@remotion/fonts";
import { useEffect, useState } from "react";
import { cancelRender, continueRender, delayRender, staticFile } from "remotion";
import { FONT_DISPLAY, FONT_HAND, FONT_MONO, FONT_SERIF, FONT_UI } from "./theme";

const FACES: { family: string; weight: string; file: string; style?: "normal" | "italic" }[] = [
  { family: FONT_DISPLAY, weight: "700", file: "plus-jakarta-sans-latin-700-normal.woff2" },
  { family: FONT_DISPLAY, weight: "800", file: "plus-jakarta-sans-latin-800-normal.woff2" },
  { family: FONT_UI, weight: "500", file: "inter-latin-500-normal.woff2" },
  { family: FONT_UI, weight: "600", file: "inter-latin-600-normal.woff2" },
  { family: FONT_UI, weight: "700", file: "inter-latin-700-normal.woff2" },
  { family: FONT_UI, weight: "800", file: "inter-latin-800-normal.woff2" },
  { family: FONT_SERIF, weight: "400", file: "instrument-serif-latin-400-normal.woff2" },
  { family: FONT_SERIF, weight: "400", file: "instrument-serif-latin-400-italic.woff2", style: "italic" },
  { family: FONT_HAND, weight: "700", file: "caveat-latin-700-normal.woff2" },
  { family: FONT_MONO, weight: "500", file: "jetbrains-mono-latin-500-normal.woff2" },
  { family: FONT_MONO, weight: "700", file: "jetbrains-mono-latin-700-normal.woff2" },
];

let loading: Promise<void> | null = null;
const loadAll = () => {
  loading ??= Promise.all(
    FACES.map((f) =>
      loadFont({ family: f.family, url: staticFile(`fonts/${f.file}`), weight: f.weight, style: f.style ?? "normal" }),
    ),
  ).then(() => undefined);
  return loading;
};

/**
 * Text measurement must only happen once the real fonts are available, otherwise
 * line breaks are computed against a fallback face. Components that measure text
 * render nothing until this returns true; the frame is held with delayRender.
 */
export const useFontsReady = (): boolean => {
  const [ready, setReady] = useState(false);
  const [handle] = useState(() => delayRender("Loading fonts"));
  useEffect(() => {
    loadAll()
      .then(() => {
        setReady(true);
        continueRender(handle);
      })
      .catch((err) => cancelRender(err));
  }, [handle]);
  return ready;
};
