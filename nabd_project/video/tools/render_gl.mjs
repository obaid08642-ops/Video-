// usage: node tools/render_gl.mjs <CompositionId> '<propsJSON>' <out.mov>   (API render; works with @react-three/fiber, software GL)
import { bundle } from "@remotion/bundler";
import { renderMedia, selectComposition } from "@remotion/renderer";
import path from "node:path";
const [, , id, propsJson, out] = process.argv;
const serveUrl = await bundle({ entryPoint: path.resolve("src/index.ts"), onProgress: () => {} });
const inputProps = JSON.parse(propsJson || "{}");
const browserExecutable = process.env.REMOTION_BROWSER || null;
const chromiumOptions = { gl: process.env.GL || "swangle" };
const composition = await selectComposition({ serveUrl, id, inputProps, browserExecutable, chromiumOptions });
let last = -1;
await renderMedia({
  composition, serveUrl, inputProps, browserExecutable, chromiumOptions, outputLocation: out,
  codec: "h264", crf: 14, audioCodec: "pcm-16", concurrency: Number(process.env.CONC || 4), logLevel: "error",
  onProgress: ({ progress }) => { const p = Math.floor(progress * 20); if (p !== last) { last = p; console.log(`progress ${p * 5}%`); } },
});
console.log("rendered", out);
