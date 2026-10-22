/**
 * Scores how well `query` matches `text` as an in-order subsequence.
 * Returns 0 for no match; higher is better. Consecutive letters and letters at
 * the start of a word count for more, so "nv" ranks NVIDIA above "Pillora".
 */
export function fuzzyScore(query: string, text: string): number {
  const q = query.toLowerCase().replace(/\s+/g, '');
  if (!q) return 1;
  const t = text.toLowerCase();
  let score = 0;
  let from = 0;
  let previous = -2;
  for (const char of q) {
    const index = t.indexOf(char, from);
    if (index === -1) return 0;
    score += 1;
    if (index === previous + 1) score += 2;
    if (index === 0 || /[\s/·&+-]/.test(t[index - 1])) score += 3;
    previous = index;
    from = index + 1;
  }
  // Prefer shorter texts when the match is otherwise equal.
  return score - t.length * 0.01;
}
