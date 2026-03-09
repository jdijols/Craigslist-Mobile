import { useSyncExternalStore } from "react";

export interface SavedSearch {
  id: string;
  category: string;
  subcategory?: string;
  searchTerm?: string;
  sortBy?: string;
  filters?: Record<string, string>;
  createdAt: string;
}

const DEFAULT_SAVED: SavedSearch = {
  id: "saved-default-dresser",
  category: "for-sale",
  subcategory: "furniture",
  searchTerm: "dresser",
  sortBy: "price: low → high",
  filters: { distance: "100", maxPrice: "200" },
  createdAt: "just now",
};

let savedSearches: SavedSearch[] = [DEFAULT_SAVED];
const listeners = new Set<() => void>();

function emit() {
  for (const l of listeners) l();
}

function getSnapshot(): SavedSearch[] {
  return savedSearches;
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

export function addSavedSearch(entry: Omit<SavedSearch, "id" | "createdAt">) {
  savedSearches = [
    {
      ...entry,
      id: `saved-${Date.now()}`,
      createdAt: "just now",
    },
    ...savedSearches,
  ];
  emit();
}

export function removeSavedSearch(id: string) {
  savedSearches = savedSearches.filter((s) => s.id !== id);
  emit();
}

export function clearAllSaved() {
  savedSearches = [];
  emit();
}

export function useSavedSearches(): SavedSearch[] {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}

export function formatSavedDetail(s: SavedSearch): string {
  const parts: string[] = [];
  if (s.searchTerm) parts.push(`"${s.searchTerm}"`);
  if (s.sortBy) parts.push(s.sortBy);
  if (s.filters) {
    const { distance, minPrice, maxPrice } = s.filters;
    if (distance) parts.push(`within ${distance}`);
    if (minPrice && maxPrice) parts.push(`$${minPrice}–$${maxPrice}`);
    else if (minPrice) parts.push(`$${minPrice}+`);
    else if (maxPrice) parts.push(`up to $${maxPrice}`);
  }
  if (parts.length === 0) return "no search terms or filters";
  return parts.join(" · ");
}
