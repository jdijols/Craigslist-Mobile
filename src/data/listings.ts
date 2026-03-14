export interface PostDetailVariant {
  id: string;
  image: string;
  images?: string[];
  price: string;
  title: string;
  hood: string;
  distance: string;
  timeAgo: string;
  sellerInitial: string;
  sellerName: string;
  categoryLabel: string;
  description: string;
  dimensions?: string;
  /** Category-specific filter attributes */
  attributes?: Record<string, string | number | boolean>;
}

export type PostDetailVariantId = "dresser" | "apartment";

export const postDetailVariants: Record<PostDetailVariantId, PostDetailVariant> = {
  dresser: {
    id: "dresser",
    image: "https://images.unsplash.com/photo-1758443487060-460f8162c282?w=400&h=400&fit=crop&auto=format&q=80",
    images: [
      "https://images.unsplash.com/photo-1758443487060-460f8162c282?w=400&h=400&fit=crop&auto=format&q=80",
      "https://images.unsplash.com/photo-1771039753570-b3a1ddf868ab?w=400&h=400&fit=crop&auto=format&q=80",
    ],
    price: "$275",
    title: "mid-century dresser. walnut, 6 drawers, dovetail. cash only",
    hood: "uptown",
    distance: "2.4 mi",
    timeAgo: "2h ago",
    sellerInitial: "S",
    sellerName: "sarah_mpls",
    categoryLabel: "for sale › furniture",
    description:
      "Beautiful mid-century modern dresser in excellent condition. Solid walnut construction with dovetail joints. Six drawers, all slide smoothly.",
    dimensions: "60\"W × 18\"D × 32\"H · Cash only, you haul.",
    attributes: {
      make_and_model: "mid-century dresser, walnut",
      condition: "excellent",
      delivery_available: false,
      language_of_posting: "english",
    },
  },
  apartment: {
    id: "apartment",
    image: "https://images.unsplash.com/photo-1638454668466-e8dbd5462f20?w=400&h=400&fit=crop&auto=format&q=80",
    images: [
      "https://images.unsplash.com/photo-1638454668466-e8dbd5462f20?w=400&h=400&fit=crop&auto=format&q=80",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400&h=400&fit=crop&auto=format&q=80",
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop&auto=format&q=80",
      "https://images.unsplash.com/photo-1507652313519-d4e9174996dd?w=400&h=400&fit=crop&auto=format&q=80",
      "https://images.unsplash.com/photo-1600573472592-401b489a3cdc?w=400&h=400&fit=crop&auto=format&q=80",
      "https://images.unsplash.com/photo-1560184897-ae75f418493e?w=400&h=400&fit=crop&auto=format&q=80",
    ],
    price: "$2,400/mo",
    title: "luxury 2br/2ba – concierge, gym, downtown views",
    hood: "downtown, minneapolis",
    distance: "2.7 mi",
    timeAgo: "2h ago",
    sellerInitial: "A",
    sellerName: "apex_living",
    categoryLabel: "housing › apartments / housing for rent",
    description:
      "Luxury 2-bed/2-bath condo in the heart of downtown. Floor-to-ceiling windows with skyline views, concierge, rooftop gym, in-unit W/D. Pets welcome, EV charging available.",
    dimensions: "1,100 sq ft · available now · cats & dogs ok",
    attributes: {
      bedrooms: 2,
      bathrooms: 2,
      area: "1100 ft²",
      rent_period: "monthly",
      availability: "within_30_days",
      housing_type: "condo",
      laundry: "w/d in unit",
      parking: "off-street parking",
      cats_ok: true,
      dogs_ok: true,
      no_smoking: true,
      air_conditioning: true,
      wheelchair_accessible: true,
      ev_charging: true,
    },
  },
};

// ── ListingData → PostDetailVariant adapter ─────────────────────────────────

import type { ListingData } from "../components/ui/cards/types";
import { formatDist, formatTime } from "../components/ui/cards/types";

const SELLER_POOL = [
  { initial: "S", name: "sarah_mpls" },
  { initial: "J", name: "jake_northeast" },
  { initial: "M", name: "maria_uptown" },
  { initial: "T", name: "tyler_mn" },
  { initial: "A", name: "alex_stpaul" },
  { initial: "R", name: "rachel_lakes" },
  { initial: "D", name: "dan_como" },
  { initial: "K", name: "kim_edina" },
];

function hashId(id: string): number {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) | 0;
  return Math.abs(h);
}

const CATEGORY_LABELS: Record<string, string> = {
  "for-sale": "for sale",
  housing: "housing",
  jobs: "jobs",
  services: "services",
  gigs: "gigs",
  community: "community",
};

export function listingToDetailVariant(listing: ListingData): PostDetailVariant {
  const seller = SELLER_POOL[hashId(listing.id) % SELLER_POOL.length];
  const catLabel = CATEGORY_LABELS[listing.category ?? ""] ?? listing.category ?? "";
  const categoryLabel = listing.subcategory
    ? `${catLabel} › ${listing.subcategory}`
    : catLabel;

  return {
    id: listing.id,
    image: listing.image,
    images: listing.images,
    price: listing.price ?? "—",
    title: listing.title,
    hood: listing.hood ?? "minneapolis",
    distance: formatDist(listing.dist) ?? listing.dist ?? "—",
    timeAgo: formatTime(listing.time) ?? listing.time ?? "recently",
    sellerInitial: seller.initial,
    sellerName: seller.name,
    categoryLabel,
    description: listing.subtitle ?? listing.title,
    attributes: listing.attributes,
  };
}
