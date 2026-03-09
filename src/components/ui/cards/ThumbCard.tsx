import type { ListingData } from "./types";
import { CardFavoriteButton } from "./CardFavoriteButton";

interface ThumbCardProps {
  data: ListingData;
  onClick?: () => void;
}

export function ThumbCard({ data, onClick }: ThumbCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full h-[108px] items-start gap-3 overflow-hidden bg-cl-surface pr-3 text-left outline-none"
    >
      <div className="relative h-full shrink-0 aspect-square">
        <img
          src={data.image}
          alt={data.title}
          loading="lazy"
          className="h-full w-full object-cover"
        />
        <CardFavoriteButton
          data={data}
          className="absolute left-2 top-2"
        />
      </div>
      <div className="min-w-0 flex-1 pt-2.5">
        {data.price && (
          <p className="text-[14px] font-bold text-cl-price">{data.price}</p>
        )}
        <p className="text-[14px] text-cl-text line-clamp-2">
          {data.title}
        </p>
        <p className="mt-1 text-[12px] text-cl-text-muted">
          {[data.hood, data.dist, data.time].filter(Boolean).join(" · ")}
        </p>
      </div>
    </button>
  );
}
