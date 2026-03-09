import { AUTOCOMPLETE_TERMS } from "./autocompleteTerms";

export function getSearchSuggestions(
  query: string,
  excludeTerms: Set<string> = new Set(),
  limit = 8,
): string[] {
  const lower = query.toLowerCase().trim();
  if (!lower) return [];

  const results: string[] = [];
  for (const term of AUTOCOMPLETE_TERMS) {
    const tl = term.toLowerCase();
    if (tl.startsWith(lower) && !excludeTerms.has(tl)) {
      results.push(tl);
      if (results.length >= limit) break;
    }
  }
  return results;
}
