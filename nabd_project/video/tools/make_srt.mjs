// SRT from the same timing JSON + caption cards used on screen (spoken words, exact timings).
// usage: node tools/make_srt.mjs public/voice/ep01_youssef_timing.json out.srt [sceneId]
import fs from "node:fs";
import { buildCards } from "../src/lib/captions.ts";
const [, , timingPath, outPath, onlyScene] = process.argv;
const timing = JSON.parse(fs.readFileSync(timingPath, "utf8"));
const data = JSON.parse(fs.readFileSync(new URL("../src/data/ep01_captions.json", import.meta.url), "utf8"));
let cards = buildCards(timing, data);
if (onlyScene) cards = cards.filter((c) => c.scene === Number(onlyScene));
const ts = (s) => {
  const ms = Math.max(0, Math.round(s * 1000));
  const p = (n, w = 2) => String(n).padStart(w, "0");
  return `${p(Math.floor(ms / 3600000))}:${p(Math.floor(ms / 60000) % 60)}:${p(Math.floor(ms / 1000) % 60)},${p(ms % 1000, 3)}`;
};
const out = cards.map((c, i) => {
  const end = Math.min(c.spokenEnd + 0.6, cards[i + 1] ? cards[i + 1].spokenStart - 0.05 : c.spokenEnd + 1.5);
  return `${i + 1}\n${ts(c.spokenStart - 0.05)} --> ${ts(end)}\n${c.spoken}\n`;
});
fs.writeFileSync(outPath, out.join("\n"), "utf8");
console.log(`${cards.length} cues -> ${outPath}`);
