export const WIDTH = 1080;
export const HEIGHT = 1920;
export const FPS = 30;

export const COLORS = {
  ink: "#070B1A",
  navy: "#0B1230",
  indigo: "#1B1F5E",
  white: "#FFFFFF",
  text: "#F4F6FF",
  muted: "#9AA3C7",
  glass: "rgba(255,255,255,0.08)",
  glassStrong: "rgba(255,255,255,0.13)",
  glassBorder: "rgba(255,255,255,0.18)",
  blue: "#4C7DFF",
  cyan: "#2FD4F0",
  violet: "#9B6BFF",
  coral: "#FF7A59",
  amber: "#FFC247",
  mint: "#35E0A1",
  rose: "#FF5C7A",
  grey: "#5B6385",
};

export const BRAND_GRADIENT = `linear-gradient(120deg, ${COLORS.cyan} 0%, ${COLORS.blue} 48%, ${COLORS.violet} 100%)`;

export const FONT_DISPLAY = "Plus Jakarta Sans";
export const FONT_UI = "Inter";

/**
 * Fixed safe zones (output pixels). Overlays live strictly above the avatar:
 *   caption band  → stage (motion graphics) → gap → avatar (head top and below).
 * The camera is constrained so the avatar's head never rises above AVATAR_MIN_TOP;
 * src/layout.ts verifies this per frame and the LayoutQA composition renders it.
 */
export const ZONES = {
  sideMargin: 64,
  caption: { top: 150, bottom: 372 },
  stage: { top: 392, bottom: 806 },
  avatarGap: 28,
};
export const AVATAR_MIN_TOP = ZONES.stage.bottom + ZONES.avatarGap;
