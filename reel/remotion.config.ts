import { Config } from "@remotion/cli/config";

Config.setEntryPoint("./src/index.ts");
Config.setVideoImageFormat("jpeg");
Config.setJpegQuality(92);
Config.setOverwriteOutput(true);
// @remotion/effects (used by src/effects/) draw with WebGL2; ANGLE makes that work in headless renders.
Config.setChromiumOpenGlRenderer("angle");

// Use a locally installed Chrome Headless Shell when one is provided (e.g. CI or sandboxes);
// otherwise Remotion downloads its own.
if (process.env.REMOTION_BROWSER) Config.setBrowserExecutable(process.env.REMOTION_BROWSER);
