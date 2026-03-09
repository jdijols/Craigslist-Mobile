/**
 * Top 50 US cities by population (2020 census).
 * Used as autocomplete options for the location picker.
 */

export interface TopCity {
  name: string;
  state: string;
  lat: number;
  lng: number;
}

/** Top 50 US cities by population, sorted by rank */
export const TOP_50_CITIES: readonly TopCity[] = [
  { name: "new york", state: "NY", lat: 40.7128, lng: -74.006 },
  { name: "los angeles", state: "CA", lat: 34.0522, lng: -118.2437 },
  { name: "chicago", state: "IL", lat: 41.8781, lng: -87.6298 },
  { name: "houston", state: "TX", lat: 29.7604, lng: -95.3698 },
  { name: "phoenix", state: "AZ", lat: 33.4484, lng: -112.074 },
  { name: "philadelphia", state: "PA", lat: 39.9526, lng: -75.1652 },
  { name: "san antonio", state: "TX", lat: 29.4241, lng: -98.4936 },
  { name: "san diego", state: "CA", lat: 32.7157, lng: -117.1611 },
  { name: "dallas", state: "TX", lat: 32.7767, lng: -96.797 },
  { name: "san jose", state: "CA", lat: 37.3382, lng: -121.8863 },
  { name: "austin", state: "TX", lat: 30.2672, lng: -97.7431 },
  { name: "jacksonville", state: "FL", lat: 30.3322, lng: -81.6557 },
  { name: "fort worth", state: "TX", lat: 32.7555, lng: -97.3308 },
  { name: "columbus", state: "OH", lat: 39.9612, lng: -82.9988 },
  { name: "indianapolis", state: "IN", lat: 39.7684, lng: -86.1581 },
  { name: "charlotte", state: "NC", lat: 35.2271, lng: -80.8431 },
  { name: "san francisco", state: "CA", lat: 37.7749, lng: -122.4194 },
  { name: "seattle", state: "WA", lat: 47.6062, lng: -122.3321 },
  { name: "denver", state: "CO", lat: 39.7392, lng: -104.9903 },
  { name: "washington", state: "DC", lat: 38.9072, lng: -77.0369 },
  { name: "nashville", state: "TN", lat: 36.1627, lng: -86.7816 },
  { name: "oklahoma city", state: "OK", lat: 35.4676, lng: -97.5164 },
  { name: "el paso", state: "TX", lat: 31.7619, lng: -106.485 },
  { name: "boston", state: "MA", lat: 42.3601, lng: -71.0589 },
  { name: "portland", state: "OR", lat: 45.5152, lng: -122.6784 },
  { name: "las vegas", state: "NV", lat: 36.1699, lng: -115.1398 },
  { name: "detroit", state: "MI", lat: 42.3314, lng: -83.0458 },
  { name: "memphis", state: "TN", lat: 35.1495, lng: -90.049 },
  { name: "baltimore", state: "MD", lat: 39.2904, lng: -76.6122 },
  { name: "milwaukee", state: "WI", lat: 43.0389, lng: -87.9065 },
  { name: "albuquerque", state: "NM", lat: 35.0844, lng: -106.6504 },
  { name: "tucson", state: "AZ", lat: 32.2226, lng: -110.9747 },
  { name: "fresno", state: "CA", lat: 36.7378, lng: -119.7871 },
  { name: "sacramento", state: "CA", lat: 38.5816, lng: -121.4944 },
  { name: "kansas city", state: "MO", lat: 39.0997, lng: -94.5786 },
  { name: "mesa", state: "AZ", lat: 33.4152, lng: -112.8305 },
  { name: "atlanta", state: "GA", lat: 33.749, lng: -84.388 },
  { name: "omaha", state: "NE", lat: 41.2565, lng: -95.9345 },
  { name: "colorado springs", state: "CO", lat: 38.8339, lng: -104.8214 },
  { name: "raleigh", state: "NC", lat: 35.7796, lng: -78.6382 },
  { name: "long beach", state: "CA", lat: 33.7701, lng: -118.1937 },
  { name: "virginia beach", state: "VA", lat: 36.8529, lng: -75.978 },
  { name: "miami", state: "FL", lat: 25.7617, lng: -80.1918 },
  { name: "oakland", state: "CA", lat: 37.8044, lng: -122.2712 },
  { name: "minneapolis", state: "MN", lat: 44.9778, lng: -93.265 },
  { name: "tulsa", state: "OK", lat: 36.1539, lng: -95.9928 },
  { name: "bakersfield", state: "CA", lat: 35.3733, lng: -119.0187 },
  { name: "wichita", state: "KS", lat: 37.6872, lng: -97.3301 },
  { name: "arlington", state: "TX", lat: 32.7357, lng: -97.1081 },
  { name: "louisville", state: "KY", lat: 38.2527, lng: -85.7585 },
];
