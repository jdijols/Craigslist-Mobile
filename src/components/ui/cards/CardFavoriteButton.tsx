import { Star } from "lucide-react";
import type { ListingData } from "./types";
import { toggleFavorite, useIsFavorited } from "../../../data/favorites";

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
  const favorited = useIsFavorited(data.id);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite(data);
  };

  const alignClass =
    align === "center"
      ? "items-center justify-center"
      : "items-start justify-start";

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`flex h-[44px] w-[44px] shrink-0 ${alignClass} outline-none ${className}`}
      aria-label={favorited ? "Remove from favorites" : "Add to favorites"}
    >
      <Star
        className="h-6 w-6 drop-shadow-sm"
        strokeWidth={1.8}
        stroke="white"
        fill={favorited ? "var(--color-cl-favorite)" : "var(--color-cl-text-muted)"}
      />
    </button>
  );
}
