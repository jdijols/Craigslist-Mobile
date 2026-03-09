import { useSyncExternalStore } from "react";

export interface RecentSearch {
  id: string;
  term: string;
  category?: string;
  subcategory?: string;
  filters?: Record<string, string>;
  sortBy?: string;
  timestamp: number;
  /** number of new results since last search; shown as "+N since you searched" */
  newSinceSearched?: number;
}

const DEFAULT_RECENT: RecentSearch = {
  id: "recent-default-midcentury",
  term: "mid-century",
  timestamp: 0,
  newSinceSearched: 3,
};

let recentSearches: RecentSearch[] = [DEFAULT_RECENT];
const listeners = new Set<() => void>();

function emit() {
  for (const l of listeners) l();
}

function getSnapshot(): RecentSearch[] {
  return recentSearches;
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

export function addRecentSearch(
  entry: Omit<RecentSearch, "id" | "timestamp">,
) {
  const lower = entry.term.toLowerCase();
  const existing = recentSearches.find(
    (r) => r.term.toLowerCase() === lower,
  );
  if (existing) {
    recentSearches = [
      { ...existing, ...entry, id: existing.id, timestamp: Date.now() },
      ...recentSearches.filter((r) => r.id !== existing.id),
    ];
  } else {
    recentSearches = [
      { ...entry, id: `recent-${Date.now()}`, timestamp: Date.now() },
      ...recentSearches,
    ];
  }
  emit();
}

export function removeRecentSearch(id: string) {
  recentSearches = recentSearches.filter((r) => r.id !== id);
  emit();
}

export function clearAllRecent() {
  recentSearches = [];
  emit();
}

export function useRecentSearches(): RecentSearch[] {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}

export function filterCountFor(
  search: Pick<RecentSearch, "filters" | "sortBy">,
): number {
  let count = 0;
  if (search.filters) count += Object.keys(search.filters).length;
  if (search.sortBy) count += 1;
  return count;
}
