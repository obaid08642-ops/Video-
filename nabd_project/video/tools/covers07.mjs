import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition } from "@remotion/renderer";
import path from "node:path";
const C = [
 ["ep07_cover_long", "نزلة البرد: مفيش علاج!", "فإيه اللي بينفع فعلًا؟", "long"],
 ["ep07_cover_short01", "المضاد الحيوي والبرد", "ما بيقتلش الفيروس!", "nocure"],
 ["ep07_cover_short02", "برد ولا أنفلونزا؟", "3 فروق وحاجة بتحسم", "flu"],
 ["ep07_cover_short03", "البلغم الأخضر", "لازم مضاد حيوي؟", "mucus"],
 ["ep07_cover_short04", "عسل للكحة", "بس ناس ممنوع!", "honey"],
 ["ep07_cover_short05", "شراب الكحة", "خطر على طفلك!", "syrup"],
 ["ep07_cover_short06", "عايز ترفع مناعتك؟", "إيه اللي ليه دليل", "immune"],
 ["ep07_cover_short07", "6 ساعات نوم أو أقل", "برد أكتر 4 أضعاف!", "sleep"],
 ["ep07_cover_short09", "إمتى تروح للدكتور؟", "علامات الخطر", "danger"],
 ["ep07_cover_short10", "دوا في كل بيت", "ممنوع لطفل عنده برد!", "aspirin"],
 ["ep07_cover_short11", "الهوا البارد", "بيجيب برد؟", "cold"],
 ["ep07_cover_short12", "دوا البرد فيه", "مسكن مخفي!", "box"],
];
const serveUrl = await bundle({ entryPoint: path.resolve("src/index.ts"), onProgress: () => {} });
const browserExecutable = process.env.REMOTION_BROWSER || null; const chromiumOptions = { gl: "swangle" };
for (const [file, title, sub, art] of C) {
  const inputProps = { title, sub, art };
  const composition = await selectComposition({ serveUrl, id: "Cover07", inputProps, browserExecutable, chromiumOptions });
  await renderStill({ composition, serveUrl, output: `/home/user/Video-/out/${file}.png`, inputProps, browserExecutable, chromiumOptions, logLevel: "error" });
  console.log("ok", file);
}
