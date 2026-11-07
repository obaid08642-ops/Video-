// Word-timing JSON produced by tools/voice/gen_episode.py. Everything on screen and every
// sound cue is anchored to these times, so changing the voice = new JSON + render.

export type Word = {
  w: string;
  punct: string;
  kw: boolean;
  tags: string[];
  start: number;
  end: number;
};
export type Line = {
  id: string;
  scene: number;
  raw: string;
  start: number;
  end: number;
  words: Word[];
};
export type Timing = {
  voice: string;
  audio: string;
  duration: number;
  sampleRate: number;
  pauseScale: number;
  scenes: { id: number; start: number; end: number }[];
  lines: Line[];
};

export const FPS = 30;

const DIAC = /[ً-ْٰـ]/g;
export const norm = (s: string) =>
  s
    .toLowerCase()
    .replace(DIAC, "")
    .replace(/[أإآٱ]/g, "ا")
    .replace(/ة/g, "ه")
    .replace(/ى/g, "ي")
    .replace(/[^a-z0-9ء-ي]/g, "");

/** Anchor = "lineId" | "lineId:wordIndex" | "lineId:wordText" with optional "@end" / "+0.2" offset. */
export class T {
  constructor(public timing: Timing) {}

  line(id: string): Line {
    const l = this.timing.lines.find((x) => x.id === id);
    if (!l) throw new Error(`line ${id} not in timing`);
    return l;
  }

  /** does the timing contain this line? (Shorts only carry some lines of a scene) */
  has(id: string): boolean {
    return this.timing.lines.some((x) => x.id === id);
  }

  word(id: string, key: number | string): Word {
    const l = this.line(id);
    if (typeof key === "number") return l.words[key < 0 ? l.words.length + key : key];
    const k = norm(key);
    const hit = l.words.find((w) => norm(w.w) === k) ?? l.words.find((w) => norm(w.w).includes(k));
    if (!hit) throw new Error(`word "${key}" not in ${id}`);
    return hit;
  }

  /** seconds for an anchor string like "s1l2:جبار", "s1l2:-1@end", "s1l3@end", "s1l4+0.3" */
  s(anchor: string): number {
    const m = anchor.match(/^(s\d+l\d+)(?::([^@+\-]+|-?\d+))?(@end)?([+-]\d*\.?\d+)?$/);
    if (!m) throw new Error(`bad anchor ${anchor}`);
    const [, id, key, end, off] = m;
    let t: number;
    if (key === undefined) {
      const l = this.line(id);
      t = end ? l.end : l.start;
    } else {
      const n = /^-?\d+$/.test(key) ? Number(key) : key;
      const w = this.word(id, n);
      t = end ? w.end : w.start;
    }
    return t + (off ? Number(off) : 0);
  }

  /** frame for an anchor */
  f(anchor: string): number {
    return Math.round(this.s(anchor) * FPS);
  }

  scene(id: number) {
    const s = this.timing.scenes.find((x) => x.id === id);
    if (!s) throw new Error(`scene ${id} missing`);
    return s;
  }

  /** frames during which speech is active (for music ducking) */
  speechMask(totalFrames: number): Float32Array {
    const m = new Float32Array(totalFrames);
    for (const l of this.timing.lines)
      for (const w of l.words) {
        const a = Math.max(0, Math.floor((w.start - 0.05) * FPS));
        const b = Math.min(totalFrames - 1, Math.ceil((w.end + 0.05) * FPS));
        for (let i = a; i <= b; i++) m[i] = 1;
      }
    return m;
  }

  /** keyword spans in seconds (SFX must never start on top of one) */
  keywordSpans(): [number, number][] {
    const out: [number, number][] = [];
    for (const l of this.timing.lines) for (const w of l.words) if (w.kw) out.push([w.start, w.end]);
    return out;
  }
}
