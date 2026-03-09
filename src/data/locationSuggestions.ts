import { TOP_50_CITIES } from "./topCities";
import type { LocationResult } from "../hooks/useLocationSearch";

function toTitleCase(s: string): string {
  return s.replace(/\b\w/g, (c) => c.toUpperCase());
}

function cityToLocationResult(city: (typeof TOP_50_CITIES)[number], index: number): LocationResult {
  const captionName = `${toTitleCase(city.name)}, ${city.state}`;
  return {
    id: `top-city-${index}`,
    name: city.name,
    state: city.state,
    displayName: `${city.name}, ${city.state}`,
    captionName,
    lat: city.lat,
    lng: city.lng,
  };
}

/**
 * Get location suggestions from the top 50 US cities.
 * Returns [] when query is empty. When typing, filters by prefix match on city name.
 */
export function getLocationSuggestions(
  query: string,
  limit = 50,
): LocationResult[] {
  const lower = query.toLowerCase().trim();
  if (!lower) return [];

  const results: LocationResult[] = [];
  for (let i = 0; i < TOP_50_CITIES.length && results.length < limit; i++) {
    const city = TOP_50_CITIES[i];
    if (city.name.startsWith(lower)) {
      results.push(cityToLocationResult(city, i));
    }
  }
  return results;
}
