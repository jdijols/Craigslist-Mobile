import { HOOD_COORDS } from "../data/neighborhoods";

const R_MILES = 3958.8;

/** Find the closest neighborhood to given lat/lng coordinates */
export function getNeighborhoodFromCoords(lat: number, lng: number): string | undefined {
  let closest: string | undefined;
  let minDist = Infinity;
  for (const [hood, coords] of Object.entries(HOOD_COORDS)) {
    const dist = haversineMiles(lat, lng, coords.lat, coords.lng);
    if (dist < minDist) {
      minDist = dist;
      closest = hood;
    }
  }
  return closest;
}

/** Resolve { lat, lng } for a listing: use lat/lng if present, else derive from hood via HOOD_COORDS */
export function getListingCoords(
  item: { hood?: string; lat?: number; lng?: number },
  fallback: { lat: number; lng: number }
): { lat: number; lng: number } {
  if (item.lat != null && item.lng != null) {
    return { lat: item.lat, lng: item.lng };
  }
  if (item.hood) {
    const c = HOOD_COORDS[item.hood.toLowerCase()];
    if (c) return { lat: c.lat, lng: c.lng };
  }
  return fallback;
}

export function haversineMiles(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
): number {
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return R_MILES * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

const ZOOM_DISTANCE_K = 25000;

export function zoomToMiles(zoom: number): number {
  return ZOOM_DISTANCE_K / Math.pow(2, zoom);
}

export function milesToZoom(miles: number): number {
  return Math.log2(ZOOM_DISTANCE_K / miles);
}

export function snapDistance(
  miles: number,
  step = 5,
  min = 5,
  max = 100,
): number {
  const snapped = Math.round(miles / step) * step;
  return Math.max(min, Math.min(max, snapped));
}
