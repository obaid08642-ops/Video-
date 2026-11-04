// SFX scheduling rules (CLAUDE.md "دليل المؤثرات"): at most one effect per second, never starting
// on top of a keyword (pushed to just after it), always well under the voice.
export type Cue = { at: number; sfx: string; vol?: number; prio?: boolean };

export function schedule(cues: Cue[], keywordSpans: [number, number][]): Cue[] {
  const out: Cue[] = [];
  const sorted = [...cues].sort((a, b) => a.at - b.at);
  for (const c of sorted) {
    let at = c.at;
    for (const [a, b] of keywordSpans) if (at > a + 0.02 && at < b) at = b + 0.02;
    const last = out[out.length - 1];
    if (last && at - last.at < 1.0) {
      if (!c.prio) continue;
      out.pop();
    }
    out.push({ ...c, at, vol: c.vol ?? 0.25 });
  }
  return out;
}
