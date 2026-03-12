import { useSyncExternalStore } from "react";
import type { ListingData } from "../components/ui/cards/types";
import { housingListings } from "./feed";

const STORAGE_KEY = "cl-favorites";

/** Default favorite must use the same id as the feed listing so map dots, cards, and PostDetail all recognize it. */
const DEFAULT_FAVORITES: ListingData[] = (() => {
  const hs5 = housingListings.find((l) => l.id === "hs-5");
  return hs5 ? [hs5] : [];
})();

function loadPersistedFavorites(): ListingData[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as ListingData[];
      if (Array.isArray(parsed)) {
        // Migrate old "apartment" id to "hs-5" so map/cards/PostDetail recognize it
        const migrated = parsed.map((item) => {
          if (item.id === "apartment") {
            const hs5 = housingListings.find((l) => l.id === "hs-5");
            return hs5 ?? item;
          }
          return item;
        });
        if (parsed.some((p) => p.id === "apartment")) {
          persistFavorites(migrated);
        }
        return migrated;
      }
    }
  } catch {
    // corrupted or unavailable — fall back to default
  }
  return DEFAULT_FAVORITES;
}

function persistFavorites(list: ListingData[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch {
    // quota exceeded or private browsing — silently ignore
  }
}

let favorites: ListingData[] = loadPersistedFavorites();
const listeners = new Set<() => void>();

function emit() {
  for (const l of listeners) l();
}

function getSnapshot(): ListingData[] {
  return favorites;
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

function updateFavorites(next: ListingData[]) {
  favorites = next;
  persistFavorites(favorites);
  emit();
}

/** "apartment" (PostDetail variant) and "hs-5" (feed listing) are the same listing. */
const EQUIVALENT_IDS: Record<string, string[]> = {
  apartment: ["apartment", "hs-5"],
  "hs-5": ["apartment", "hs-5"],
};

function idsForLookup(id: string): string[] {
  return EQUIVALENT_IDS[id] ?? [id];
}

export function addFavorite(listing: ListingData) {
  const ids = idsForLookup(listing.id);
  if (favorites.some((f) => ids.includes(f.id))) return;
  // Prefer feed id (hs-5) over variant id (apartment) so map/cards stay in sync
  const toAdd =
    listing.id === "apartment"
      ? (housingListings.find((l) => l.id === "hs-5") ?? listing)
      : listing;
  updateFavorites([toAdd, ...favorites]);
}

export function removeFavorite(id: string) {
  const ids = idsForLookup(id);
  updateFavorites(favorites.filter((f) => !ids.includes(f.id)));
}

export function resetFavorites() {
  updateFavorites([]);
}

export function toggleFavorite(listing: ListingData) {
  const ids = idsForLookup(listing.id);
  const existing = favorites.find((f) => ids.includes(f.id));
  if (existing) {
    removeFavorite(existing.id);
  } else {
    addFavorite(listing);
  }
}

export function isFavorited(id: string): boolean {
  const ids = idsForLookup(id);
  return favorites.some((f) => ids.includes(f.id));
}

export function useFavorites(): ListingData[] {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}

export function useIsFavorited(id: string): boolean {
  const all = useFavorites();
  const ids = idsForLookup(id);
  return all.some((f) => ids.includes(f.id));
}
