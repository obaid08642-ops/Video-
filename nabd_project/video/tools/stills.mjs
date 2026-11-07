// usage: node tools/stills.mjs <CompositionId> <outDir> '<propsJSON>' <label:frame> [<label:frame> ...]
// Bundles once and renders many stills (fast review of a whole video).
import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition } from "@remotion/renderer";
import path from "node:path";
import fs from "node:fs";
const [, , id, out, propsJson, ...pairs] = process.argv;
fs.mkdirSync(out, { recursive: true });
const serveUrl = await bundle({ entryPoint: path.resolve("src/index.ts"), onProgress: () => {} });
const inputProps = JSON.parse(propsJson || "{}");
const comp = await selectComposition({ serveUrl, id, inputProps });
for (const p of pairs) {
  const [label, fr] = p.split(":");
  await renderStill({ composition: comp, serveUrl, output: path.join(out, `${id}_${label}.png`), frame: Number(fr), inputProps, logLevel: "error" });
  console.log("ok", label);
}
