export function safeTags(v: any): string[] {
  return Array.isArray(v) ? v.filter(Boolean).map(String) : []
}

export function overlapCount(a: string[], b: string[]) {
  const set = new Set(a.map((x) => x.toLowerCase()))
  let c = 0
  for (const t of b) if (set.has(String(t).toLowerCase())) c++
  return c
}
