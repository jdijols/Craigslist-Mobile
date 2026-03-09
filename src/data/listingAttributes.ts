/**
 * Category-specific listing attributes (Craigslist filter inputs).
 * Keys align with platform filter schema for future filter modal integration.
 */

export type ListingAttributeValue = string | number | boolean;

export const HOUSING_ATTRIBUTE_KEYS = [
  "bedrooms",
  "bathrooms",
  "area",
  "rent_period",
  "move_in_date",
  "application_fee",
  "availability",
  "housing_type",
  "laundry",
  "parking",
  "cats_ok",
  "dogs_ok",
  "no_smoking",
  "air_conditioning",
  "wheelchair_accessible",
  "ev_charging",
  "furnished",
  "no_application_fee",
  "no_broker_fee",
  "private_bath",
  "private_room",
  "posted_today",
] as const;

export type HousingAttributeKey = (typeof HOUSING_ATTRIBUTE_KEYS)[number];

const HOUSING_LABELS: Record<HousingAttributeKey, string> = {
  bedrooms: "bedrooms",
  bathrooms: "bathrooms",
  area: "area",
  rent_period: "rent period",
  move_in_date: "move-in date",
  application_fee: "application fee details",
  availability: "availability",
  housing_type: "housing type",
  laundry: "laundry",
  parking: "parking",
  cats_ok: "cats are OK",
  dogs_ok: "dogs are OK",
  no_smoking: "no smoking",
  air_conditioning: "air conditioning",
  wheelchair_accessible: "wheelchair accessible",
  ev_charging: "EV charging",
  furnished: "furnished",
  no_application_fee: "no application fee",
  no_broker_fee: "no broker fee",
  private_bath: "private bath",
  private_room: "private room",
  posted_today: "posted today",
};

export function getHousingAttributeLabel(key: HousingAttributeKey): string {
  return HOUSING_LABELS[key] ?? key;
}

export function formatAttributeValue(
  key: HousingAttributeKey,
  value: ListingAttributeValue
): string {
  if (typeof value === "boolean") {
    return value ? "yes" : "no";
  }
  if (typeof value === "number") {
    if (key === "bedrooms") return `${value} bed${value !== 1 ? "s" : ""}`;
    if (key === "bathrooms") return `${value} bath${value !== 1 ? "s" : ""}`;
    return String(value);
  }
  if (key === "area" && typeof value === "string" && !value.includes("ft²")) {
    return `${value} ft²`;
  }
  if (key === "availability" && typeof value === "string") {
    if (value === "within_30_days") return "within 30 days";
    if (value === "beyond_30_days") return "beyond 30 days";
  }
  return String(value);
}

/** Group definitions for housing attributes layout */
export const HOUSING_GROUPS = {
  size: ["bedrooms", "bathrooms", "area"] as const,
  lease: ["rent_period", "move_in_date", "application_fee", "availability"] as const,
  pets: ["cats_ok", "dogs_ok"] as const,
  amenities: [
    "housing_type",
    "laundry",
    "parking",
    "no_smoking",
    "air_conditioning",
    "wheelchair_accessible",
    "ev_charging",
    "furnished",
    "no_application_fee",
    "no_broker_fee",
    "private_bath",
    "private_room",
  ] as const,
  options: ["posted_today"] as const,
} as const;

export const HOUSING_GROUP_LABELS: Record<keyof typeof HOUSING_GROUPS, string> = {
  size: "size & layout",
  lease: "lease",
  pets: "pets",
  amenities: "amenities",
  options: "options",
};

// ── For Sale ───────────────────────────────────────────────────────────────

export const FOR_SALE_ATTRIBUTE_KEYS = [
  "make_and_model",
  "condition",
  "posted_today",
  "delivery_available",
  "cryptocurrency_ok",
  "language_of_posting",
] as const;

export type ForSaleAttributeKey = (typeof FOR_SALE_ATTRIBUTE_KEYS)[number];

const FOR_SALE_LABELS: Record<ForSaleAttributeKey, string> = {
  make_and_model: "make and model",
  condition: "condition",
  posted_today: "posted today",
  delivery_available: "delivery available",
  cryptocurrency_ok: "cryptocurrency ok",
  language_of_posting: "language of posting",
};

export function getForSaleAttributeLabel(key: ForSaleAttributeKey): string {
  return FOR_SALE_LABELS[key] ?? key;
}

export function formatForSaleAttributeValue(
  _key: ForSaleAttributeKey,
  value: ListingAttributeValue
): string {
  if (typeof value === "boolean") {
    return value ? "yes" : "no";
  }
  return String(value);
}

/** Group definitions for for-sale attributes layout */
export const FOR_SALE_GROUPS = {
  condition: ["condition"] as const,
  options: ["posted_today", "delivery_available", "cryptocurrency_ok"] as const,
  language: ["language_of_posting"] as const,
} as const;

export const FOR_SALE_GROUP_LABELS: Record<keyof typeof FOR_SALE_GROUPS, string> = {
  condition: "condition",
  options: "options",
  language: "language",
};

// ── Jobs ────────────────────────────────────────────────────────────────────

export const JOBS_ATTRIBUTE_KEYS = [
  "employment_type",
  "internship",
  "non_profit_organization",
  "telecommuting_ok",
  "posted_today",
] as const;

export type JobsAttributeKey = (typeof JOBS_ATTRIBUTE_KEYS)[number];

const JOBS_LABELS: Record<JobsAttributeKey, string> = {
  employment_type: "employment type",
  internship: "internship",
  non_profit_organization: "non-profit organization",
  telecommuting_ok: "telecommuting ok",
  posted_today: "posted today",
};

export function getJobsAttributeLabel(key: JobsAttributeKey): string {
  return JOBS_LABELS[key] ?? key;
}

export function formatJobsAttributeValue(
  _key: JobsAttributeKey,
  value: ListingAttributeValue
): string {
  if (typeof value === "boolean") {
    return value ? "yes" : "no";
  }
  return String(value);
}

/** Group definitions for jobs attributes layout */
export const JOBS_GROUPS = {
  employment_type: ["employment_type"] as const,
  options: ["internship", "non_profit_organization", "telecommuting_ok", "posted_today"] as const,
} as const;

export const JOBS_GROUP_LABELS: Record<keyof typeof JOBS_GROUPS, string> = {
  employment_type: "employment type",
  options: "options",
};

// ── Gigs ────────────────────────────────────────────────────────────────────

export const GIGS_ATTRIBUTE_KEYS = [
  "paid",
  "posted_today",
] as const;

export type GigsAttributeKey = (typeof GIGS_ATTRIBUTE_KEYS)[number];

const GIGS_LABELS: Record<GigsAttributeKey, string> = {
  paid: "paid",
  posted_today: "posted today",
};

export function getGigsAttributeLabel(key: GigsAttributeKey): string {
  return GIGS_LABELS[key] ?? key;
}

const GIGS_BOOLEAN_DISPLAY_LABELS: Partial<Record<GigsAttributeKey, { true: string; false?: string }>> = {
  paid: { true: "paid", false: "unpaid" },
  posted_today: { true: "posted today" },
};

export function formatGigsAttributeValue(
  key: GigsAttributeKey,
  value: ListingAttributeValue
): string {
  if (typeof value === "boolean") {
    const labels = GIGS_BOOLEAN_DISPLAY_LABELS[key];
    if (labels) {
      if (value && labels.true) return labels.true;
      if (!value && labels.false) return labels.false;
    }
    return value ? "yes" : "no";
  }
  return String(value);
}

/** Group definitions for gigs attributes layout */
export const GIGS_GROUPS = {
  options: ["paid", "posted_today"] as const,
} as const;

export const GIGS_GROUP_LABELS: Record<keyof typeof GIGS_GROUPS, string> = {
  options: "options",
};

// ── Resumes ──────────────────────────────────────────────────────────────────

export const RESUMES_ATTRIBUTE_KEYS = [
  "available_afternoons",
  "available_evenings",
  "available_mornings",
  "available_overnight",
  "available_weekdays",
  "available_weekends",
  "education_completed",
  "posted_today",
] as const;

export type ResumesAttributeKey = (typeof RESUMES_ATTRIBUTE_KEYS)[number];

const RESUMES_LABELS: Record<ResumesAttributeKey, string> = {
  available_afternoons: "available afternoons",
  available_evenings: "available evenings",
  available_mornings: "available mornings",
  available_overnight: "available overnight",
  available_weekdays: "available weekdays",
  available_weekends: "available weekends",
  education_completed: "education completed",
  posted_today: "posted today",
};

export function getResumesAttributeLabel(key: ResumesAttributeKey): string {
  return RESUMES_LABELS[key] ?? key;
}

const RESUMES_BOOLEAN_DISPLAY_LABELS: Partial<Record<ResumesAttributeKey, string>> = {
  available_afternoons: "available afternoons",
  available_evenings: "available evenings",
  available_mornings: "available mornings",
  available_overnight: "available overnight",
  available_weekdays: "available weekdays",
  available_weekends: "available weekends",
  posted_today: "posted today",
};

const EDUCATION_OPTIONS: Record<string, string> = {
  "less than high school": "less than high school",
  "high school/GED": "high school/GED",
  "some college": "some college",
  associates: "associates",
  bachelors: "bachelors",
  masters: "masters",
  doctoral: "doctoral",
};

export function formatResumesAttributeValue(
  key: ResumesAttributeKey,
  value: ListingAttributeValue
): string {
  if (key === "education_completed" && typeof value === "string") {
    return EDUCATION_OPTIONS[value] ?? value;
  }
  if (typeof value === "boolean") {
    return RESUMES_BOOLEAN_DISPLAY_LABELS[key] ?? (value ? "yes" : "no");
  }
  return String(value);
}

/** Group definitions for resumes attributes layout */
export const RESUMES_GROUPS = {
  availability: [
    "available_afternoons",
    "available_evenings",
    "available_mornings",
    "available_overnight",
    "available_weekdays",
    "available_weekends",
  ] as const,
  education: ["education_completed"] as const,
  options: ["posted_today"] as const,
} as const;

export const RESUMES_GROUP_LABELS: Record<keyof typeof RESUMES_GROUPS, string> = {
  availability: "availability",
  education: "education completed",
  options: "options",
};

// ── Services ─────────────────────────────────────────────────────────────────

export const SERVICES_ATTRIBUTE_KEYS = ["posted_today"] as const;

export type ServicesAttributeKey = (typeof SERVICES_ATTRIBUTE_KEYS)[number];

const SERVICES_LABELS: Record<ServicesAttributeKey, string> = {
  posted_today: "posted today",
};

export function getServicesAttributeLabel(key: ServicesAttributeKey): string {
  return SERVICES_LABELS[key] ?? key;
}

export function formatServicesAttributeValue(
  _key: ServicesAttributeKey,
  value: ListingAttributeValue
): string {
  if (typeof value === "boolean") {
    return value ? "posted today" : "no";
  }
  return String(value);
}

/** Group definitions for services attributes layout */
export const SERVICES_GROUPS = {
  options: ["posted_today"] as const,
} as const;

export const SERVICES_GROUP_LABELS: Record<keyof typeof SERVICES_GROUPS, string> = {
  options: "options",
};

// ── Community ───────────────────────────────────────────────────────────────

export const COMMUNITY_ATTRIBUTE_KEYS = ["lost_or_found", "posted_today"] as const;

export type CommunityAttributeKey = (typeof COMMUNITY_ATTRIBUTE_KEYS)[number];

const COMMUNITY_LABELS: Record<CommunityAttributeKey, string> = {
  lost_or_found: "lost or found",
  posted_today: "posted today",
};

export function getCommunityAttributeLabel(key: CommunityAttributeKey): string {
  return COMMUNITY_LABELS[key] ?? key;
}

const LOST_OR_FOUND_OPTIONS: Record<string, string> = {
  lost: "lost",
  found: "found",
};

export function formatCommunityAttributeValue(
  key: CommunityAttributeKey,
  value: ListingAttributeValue
): string {
  if (key === "lost_or_found" && typeof value === "string") {
    return LOST_OR_FOUND_OPTIONS[value] ?? value;
  }
  if (typeof value === "boolean") {
    return value ? "posted today" : "no";
  }
  return String(value);
}

/** Group definitions for community attributes layout */
export const COMMUNITY_GROUPS = {
  lost_or_found: ["lost_or_found"] as const,
  options: ["posted_today"] as const,
} as const;

export const COMMUNITY_GROUP_LABELS: Record<keyof typeof COMMUNITY_GROUPS, string> = {
  lost_or_found: "lost or found",
  options: "options",
};
