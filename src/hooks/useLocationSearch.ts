import { useState, useEffect, useRef, useMemo } from "react";
import { getLocationSuggestions } from "../data/locationSuggestions";

export interface LocationResult {
  id: string;
  name: string;
  state: string;
  displayName: string;
  /** Title-cased for captions, e.g. "Austin, TX" */
  captionName: string;
  lat: number;
  lng: number;
}

const NOMINATIM_BASE = "https://nominatim.openstreetmap.org/search";

function parseResult(raw: Record<string, unknown>): LocationResult | null {
  const addr = raw.address as Record<string, string> | undefined;
  if (!addr) return null;

  const city = addr.city ?? addr.town ?? addr.village ?? addr.hamlet;
  const state = addr.state;
  if (!city || !state) return null;

  const stateAbbr = STATE_ABBR[state] ?? state;

  return {
    id: String(raw.place_id),
    name: city.toLowerCase(),
    state: stateAbbr,
    displayName: `${city.toLowerCase()}, ${stateAbbr}`,
    captionName: `${city}, ${stateAbbr}`,
    lat: Number(raw.lat),
    lng: Number(raw.lon),
  };
}

function dedup(results: LocationResult[]): LocationResult[] {
  const seen = new Set<string>();
  return results.filter((r) => {
    const key = `${r.name}|${r.state}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function mergeAndDedup(
  local: LocationResult[],
  api: LocationResult[],
): LocationResult[] {
  const seen = new Set<string>();
  const merged: LocationResult[] = [];
  for (const r of local) {
    const key = `${r.name}|${r.state}`;
    if (!seen.has(key)) {
      seen.add(key);
      merged.push(r);
    }
  }
  for (const r of api) {
    const key = `${r.name}|${r.state}`;
    if (!seen.has(key)) {
      seen.add(key);
      merged.push(r);
    }
  }
  return merged;
}

export function useLocationSearch(query: string, debounceMs = 300) {
  const [apiResults, setApiResults] = useState<LocationResult[]>([]);
  const [loading, setLoading] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  const localSuggestions = useMemo(
    () => getLocationSuggestions(query, 50),
    [query],
  );

  useEffect(() => {
    const trimmed = query.trim();
    if (trimmed.length < 2) {
      setApiResults([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    const timeout = setTimeout(() => {
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      const params = new URLSearchParams({
        q: trimmed,
        countrycodes: "us",
        format: "json",
        limit: "10",
        addressdetails: "1",
        featuretype: "city",
      });

      fetch(`${NOMINATIM_BASE}?${params}`, {
        signal: controller.signal,
        headers: { "User-Agent": "CraigslistMobilePrototype/1.0" },
      })
        .then((r) => r.json())
        .then((data: Record<string, unknown>[]) => {
          const keyword = trimmed.toLowerCase();
          const parsed = data
            .map(parseResult)
            .filter(
              (r): r is LocationResult =>
                r !== null && r.name.includes(keyword),
            );
          setApiResults(dedup(parsed));
          setLoading(false);
        })
        .catch((err) => {
          if ((err as Error).name !== "AbortError") {
            setApiResults([]);
            setLoading(false);
          }
        });
    }, debounceMs);

    return () => {
      clearTimeout(timeout);
      abortRef.current?.abort();
    };
  }, [query, debounceMs]);

  const results = useMemo(
    () => mergeAndDedup(localSuggestions, apiResults),
    [localSuggestions, apiResults],
  );

  return { results, loading };
}

const STATE_ABBR: Record<string, string> = {
  Alabama: "AL",
  Alaska: "AK",
  Arizona: "AZ",
  Arkansas: "AR",
  California: "CA",
  Colorado: "CO",
  Connecticut: "CT",
  Delaware: "DE",
  Florida: "FL",
  Georgia: "GA",
  Hawaii: "HI",
  Idaho: "ID",
  Illinois: "IL",
  Indiana: "IN",
  Iowa: "IA",
  Kansas: "KS",
  Kentucky: "KY",
  Louisiana: "LA",
  Maine: "ME",
  Maryland: "MD",
  Massachusetts: "MA",
  Michigan: "MI",
  Minnesota: "MN",
  Mississippi: "MS",
  Missouri: "MO",
  Montana: "MT",
  Nebraska: "NE",
  Nevada: "NV",
  "New Hampshire": "NH",
  "New Jersey": "NJ",
  "New Mexico": "NM",
  "New York": "NY",
  "North Carolina": "NC",
  "North Dakota": "ND",
  Ohio: "OH",
  Oklahoma: "OK",
  Oregon: "OR",
  Pennsylvania: "PA",
  "Rhode Island": "RI",
  "South Carolina": "SC",
  "South Dakota": "SD",
  Tennessee: "TN",
  Texas: "TX",
  Utah: "UT",
  Vermont: "VT",
  Virginia: "VA",
  Washington: "WA",
  "West Virginia": "WV",
  Wisconsin: "WI",
  Wyoming: "WY",
  "District of Columbia": "DC",
};
