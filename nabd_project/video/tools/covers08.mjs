import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition } from "@remotion/renderer";
import path from "node:path";
const C = [
 ["ep08_cover_long", "دكتور شرب جرثومة!", "وخد عليها نوبل", "long"],
 ["ep08_cover_short01_story", "دكتور شرب جرثومة المعدة!", "وخد عليها نوبل", "glass"],
 ["ep08_cover_short02_data", "نص العالم عنده الجرثومة", "وأغلبهم مش عارف", "pie"],
 ["ep08_cover_short03_blood_test", "التحليل طلع موجب؟", "استنى!", "tube"],
 ["ep08_cover_short04_alarm_signs", "5 علامات", "ممنوع تتجاهلها", "warn"],
 ["ep08_cover_short05_four_drugs", "ليه 4 أدوية؟", "مش دوا واحد", "pills"],
 ["ep08_cover_short06_food", "عسل وثوم وزبادي؟", "بيقتلوا الجرثومة؟", "food"],
 ["ep08_cover_short07_old_myth", "القرحة من التوتر؟", "مش بالظبط", "myth"],
 ["ep08_cover_short07b_stress", "التوتر والمعدة", "إيه الحقيقة؟", "stress"],
 ["ep08_cover_short07c_why_some_get_sick", "ليه ناس بتمرض وناس لأ؟", "", "crowd"],
 ["ep08_cover_short08_children", "جرثومة المعدة معدية؟", "ووجع بطن طفلك؟", "kid"],
];
const serveUrl = await bundle({ entryPoint: path.resolve("src/index.ts"), onProgress: () => {} });
const browserExecutable = process.env.REMOTION_BROWSER || null; const chromiumOptions = { gl: "swangle" };
for (const [file, title, sub, art] of C) {
  const inputProps = { title, sub, art };
  const composition = await selectComposition({ serveUrl, id: "Cover08", inputProps, browserExecutable, chromiumOptions });
  await renderStill({ composition, serveUrl, output: `/home/user/Video-/out/${file}.png`, inputProps, browserExecutable, chromiumOptions, logLevel: "error" });
  console.log("ok", file);
}
