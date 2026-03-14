import { Star, Bookmark } from "lucide-react";
import type { ListingData } from "./types";
import { toggleFavorite, useIsFavorited } from "../../../data/favorites";
import {
  toggleSavedSubcategory,
  useIsSavedSubcategory,
} from "../../../data/savedSearches";

interface CardFavoriteButtonProps {
  data: ListingData;
  className?: string;
  align?: "start" | "center";
}

export function CardFavoriteButton({
  data,
  className = "",
  align = "start",
}: CardFavoriteButtonProps) {
  const isSubcategory = data.linkType === "subcategory";
  const favorited = useIsFavorited(data.id);
  const saved = useIsSavedSubcategory(data.browseCategory, data.browseSubcategory);
  const active = isSubcategory ? saved : favorited;

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isSubcategory) {
      toggleSavedSubcategory(data.browseCategory!, data.browseSubcategory!);
    } else {
      toggleFavorite(data);
    }
  };

  const alignClass =
    align === "center"
      ? "items-center justify-center"
      : "items-start justify-start";

  if (isSubcategory) {
    return (
      <button
        type="button"
        onClick={handleClick}
        className={`flex h-[44px] w-[44px] shrink-0 ${alignClass} outline-none ${className}`}
        aria-label={active ? "Remove saved search" : "Save search"}
      >
        <Bookmark
          className="h-6 w-6 drop-shadow-sm"
          strokeWidth={1.8}
          stroke="white"
          fill={active ? "var(--color-cl-accent)" : "var(--color-cl-icon-inactive)"}
        />
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`flex h-[44px] w-[44px] shrink-0 ${alignClass} outline-none ${className}`}
      aria-label={active ? "Remove from favorites" : "Add to favorites"}
    >
      <Star
        className="h-6 w-6 drop-shadow-sm"
        strokeWidth={1.8}
        stroke="white"
        fill={active ? "var(--color-cl-favorite)" : "var(--color-cl-icon-inactive)"}
      />
    </button>
  );
}
