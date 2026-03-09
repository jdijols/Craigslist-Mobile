import { useSyncExternalStore } from "react";
import type { ListingData } from "../components/ui/cards/types";

let favorites: ListingData[] = [
  {
    id: "apartment",
    title: "luxury 2br/2ba – concierge, gym, downtown views",
    image: "https://images.unsplash.com/photo-1638454668466-e8dbd5462f20?w=400&h=400&fit=crop&auto=format&q=80",
    price: "$2,400/mo",
    hood: "downtown",
    category: "housing",
    subcategory: "apartments / housing for rent",
  },
];
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

export function addFavorite(listing: ListingData) {
  if (favorites.some((f) => f.id === listing.id)) return;
  favorites = [listing, ...favorites];
  emit();
}

export function removeFavorite(id: string) {
  favorites = favorites.filter((f) => f.id !== id);
  emit();
}

export function resetFavorites() {
  favorites = [];
  emit();
}

export function toggleFavorite(listing: ListingData) {
  if (favorites.some((f) => f.id === listing.id)) {
    removeFavorite(listing.id);
  } else {
    addFavorite(listing);
  }
}

export function isFavorited(id: string): boolean {
  return favorites.some((f) => f.id === id);
}

export function useFavorites(): ListingData[] {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}

export function useIsFavorited(id: string): boolean {
  const all = useFavorites();
  return all.some((f) => f.id === id);
}
