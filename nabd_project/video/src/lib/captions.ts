// Builds the on-screen caption cards from the word timings.
// Rule: a sentence of <= 9 words is written exactly as spoken, word by word, keyword coloured
// the moment it is spoken. Longer lines are split at "…" / sentence ends, or replaced by a
// shortened text from data/ep01_captions.json ("token@spokenWord" anchors a display token).
// Pure module (no imports at runtime) so tools/make_srt.mjs can reuse it under plain Node.

import type { Line, Timing } from "./timing";

export type Token = { text: string; kw: boolean; t: number };
export type Card = {
  id: string;
  lineId: string;
  scene: number;
  start: number; // seconds (card enters)
  end: number; // seconds (card leaves)
  rows: Token[][];
  note?: { text: string; t: number };
  source?: string;
  spoken: string; // exact spoken words covered (for SRT)
  spokenStart: number;
  spokenEnd: number;
  karaoke?: boolean; // first card: full text visible on frame 0 (cover), words light up as spoken
};
export type CardSpec = { words?: [number, number]; text?: string[]; note?: string; noteAt?: string };
export type CaptionData = {
  maxWords: number;
  overrides: Record<string, CardSpec[]>;
  sources: Record<string, string>;
  /** spoken form -> written form, on screen and in the SRT (e.g. a drug name with its English name) */
  rename?: Record<string, string>;
  /** multi-word spoken phrase -> written form, in the SRT text (e.g. «الإف دي إيه» -> «الـ FDA») */
  renamePhrase?: Record<string, string>;
};

const DIAC = /[ً-ْٰـ]/g;
const nrm = (s: string) =>
  s.toLowerCase().replace(DIAC, "").replace(/[أإآٱ]/g, "ا").replace(/ة/g, "ه").replace(/ى/g, "ي")
    .replace(/[^a-z0-9ء-ي]/g, "");

const BREAK = /[.؟?!:…]/;
const HARD = /[.؟?!]/;

/** split [0,n) into groups <= max words at break points, fewest groups then most balanced */
function partition(line: Line, max: number): [number, number][] {
  const n = line.words.length;
  if (n <= max) return [[0, n]];
  const cuts: number[] = [];
  line.words.forEach((w, i) => {
    if (i < n - 1 && BREAK.test(w.punct)) cuts.push(i + 1);
  });
  const pts = [0, ...cuts, n];
  // DP over break points: minimise (#groups, max group size, -hardBreaks)
  type S = { g: number; mx: number; path: number[] };
  const best: (S | null)[] = pts.map(() => null);
  best[0] = { g: 0, mx: 0, path: [0] };
  for (let j = 1; j < pts.length; j++)
    for (let i = 0; i < j; i++) {
      const b = best[i];
      const size = pts[j] - pts[i];
      if (!b || size > max) continue;
      const c = { g: b.g + 1, mx: Math.max(b.mx, size), path: [...b.path, pts[j]] };
      const cur = best[j];
      if (!cur || c.g < cur.g || (c.g === cur.g && c.mx < cur.mx)) best[j] = c;
    }
  const end = best[pts.length - 1];
  if (!end) return [[0, n]]; // no valid split: caller should provide an override
  const out: [number, number][] = [];
  for (let k = 1; k < end.path.length; k++) out.push([end.path[k - 1], end.path[k]]);
  return out;
}

/** break a list of tokens into <= 2 rows of <= 7 words, balanced by characters, preferring punctuation */
function toRows(tokens: Token[], puncts: string[]): Token[][] {
  const n = tokens.length;
  const len = (a: Token[]) => a.reduce((k, t) => k + t.text.length + 1, 0);
  if (n <= 3 || len(tokens) <= 20) return [tokens];
  let bestI = Math.ceil(n / 2);
  let bestScore = -1e9;
  for (let i = Math.max(1, n - 7); i <= Math.min(7, n - 1); i++) {
    const p = puncts[i - 1] ?? "";
    const diff = Math.abs(len(tokens.slice(0, i)) - len(tokens.slice(i)));
    const score = (BREAK.test(p) ? 1.5 : 0) + (p.includes("،") ? 0.5 : 0) - diff / 5;
    if (score > bestScore) {
      bestScore = score;
      bestI = i;
    }
  }
  return [tokens.slice(0, bestI), tokens.slice(bestI)];
}

function parseDisplay(rowsText: string[], line: Line, range: [number, number]): Token[][] {
  let kw = false;
  let cursor = range[0];
  const findWord = (key: string, from: number) => {
    const k = nrm(key);
    if (!k) return -1;
    for (let i = from; i < range[1]; i++) if (nrm(line.words[i].w) === k) return i;
    for (let i = from; i < range[1]; i++) {
      const w = nrm(line.words[i].w);
      if (w.includes(k) || (k.length > 2 && k.includes(w) && w.length > 2)) return i;
    }
    for (let i = range[0]; i < range[1]; i++) if (nrm(line.words[i].w) === k) return i;
    return -1;
  };
  return rowsText.map((row) =>
    row.split(/\s+/).filter(Boolean).map((raw) => {
      let s = raw;
      const open = s.startsWith("**");
      if (open) {
        kw = true;
        s = s.slice(2);
      }
      const closeIdx = s.indexOf("**");
      const isKw = kw;
      if (closeIdx >= 0) {
        kw = false;
        s = s.slice(0, closeIdx) + s.slice(closeIdx + 2);
      }
      let text = s;
      let idx: number;
      const at = s.indexOf("@");
      if (at > 0) {
        text = s.slice(0, at) + s.slice(at + 1).replace(/^[^.…؟?:،,!]*/, "");
        idx = findWord(s.slice(at + 1), range[0]);
      } else {
        idx = findWord(s, cursor);
      }
      if (idx < 0) idx = cursor;
      else cursor = Math.max(cursor, idx);
      return { text, kw: isKw, t: line.words[idx].start };
    }),
  );
}

export function buildCards(timing: Timing, data: CaptionData): Card[] {
  const cards: Card[] = [];
  const rn = (w: string) => data.rename?.[w] ?? w;
  for (const line of timing.lines) {
    const specs: CardSpec[] =
      data.overrides[line.id] ?? partition(line, data.maxWords).map((r) => ({ words: r }));
    specs.forEach((spec, k) => {
      const range: [number, number] = spec.words ?? [0, line.words.length];
      const ws = line.words.slice(range[0], range[1]);
      const rows = spec.text
        ? parseDisplay(spec.text, line, range)
        : toRows(
            ws.map((w) => ({ text: rn(w.w) + w.punct, kw: w.kw, t: w.start })),
            ws.map((w) => w.punct),
          );
      const noteIdx = spec.noteAt ? line.words.findIndex((w) => nrm(w.w) === nrm(spec.noteAt!)) : range[0];
      cards.push({
        id: `${line.id}c${k + 1}`,
        lineId: line.id,
        scene: line.scene,
        start: Math.min(...rows.flat().map((t) => t.t)) - 0.04,
        end: 0,
        rows,
        note: spec.note ? { text: spec.note, t: line.words[Math.max(0, noteIdx)].start } : undefined,
        source: data.sources[line.id],
        spoken: Object.entries(data.renamePhrase ?? {}).reduce((acc, [k, v]) => acc.split(k).join(v), ws.map((w) => rn(w.w) + w.punct).join(" ")),
        spokenStart: ws[0].start,
        spokenEnd: ws[ws.length - 1].end,
      });
    });
  }
  cards.sort((a, b) => a.start - b.start);
  const sceneEnd = (id: number) => timing.scenes.find((s) => s.id === id)!.end;
  cards.forEach((c, i) => {
    const next = cards[i + 1];
    const hold = c.spokenEnd + 1.2;
    // every card stays until the next one starts (enough reading time, also across scene changes)
    c.end = next ? next.start : Math.max(hold, sceneEnd(c.scene) + 0.6);
  });
  if (cards[0]) cards[0].karaoke = true;
  return cards;
}

// re-export for SRT tool
export const _internal = { partition, toRows, HARD };
