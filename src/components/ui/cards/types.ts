export type PostCategory =
  | "for-sale"
  | "housing"
  | "jobs"
  | "services"
  | "gigs"
  | "resumes"
  | "community";

/**
 * Unified listing data type. Every card variant renders the fields
 * it needs from this single shape, so the same post can appear in
 * any view mode (thumb, grid, list, gallery, map, scroll-row, etc.).
 */
export interface ListingData {
  id: string;
  title: string;
  image: string;
  images?: string[];
  price?: string;
  originalPrice?: string;
  priceNote?: string;
  hood?: string;
  /** Optional lat/lng; when present, hood can be derived via getNeighborhoodFromCoords */
  lat?: number;
  lng?: number;
  dist?: string;
  time?: string;
  subtitle?: string;
  details?: string[];
  badge?: string;
  rating?: number;
  ratingLabel?: string;
  isFavorited?: boolean;
  category?: PostCategory;
  subcategory?: string;
  /** When "subcategory", card navigates to category browse; requires browseCategory + browseSubcategory */
  linkType?: "post" | "subcategory";
  browseCategory?: string;
  browseSubcategory?: string;
  /** Category-specific filter attributes (e.g. bedrooms, housing_type for housing) */
  attributes?: Record<string, string | number | boolean>;
}

export type ViewMode = "gallery" | "grid" | "thumb" | "list" | "map";

/** Expand shorthand dist like "3.0 mi" → "3.0 miles away" */
export function formatDist(dist?: string): string | undefined {
  if (!dist) return undefined;
  return dist.replace(/\bmi\b/, "miles") + " away";
}

/** Expand shorthand time like "2h" → "2 hours ago", "45m" → "45 minutes ago", "1d" → "1 day ago" */
export function formatTime(time?: string): string | undefined {
  if (!time) return undefined;
  const match = time.match(/^(\d+)(m|h|d)$/);
  if (!match) return time;
  const [, n, unit] = match;
  const num = Number(n);
  const labels: Record<string, [string, string]> = {
    m: ["minute", "minutes"],
    h: ["hour", "hours"],
    d: ["day", "days"],
  };
  const [singular, plural] = labels[unit];
  return `${n} ${num === 1 ? singular : plural} ago`;
}
