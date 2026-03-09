import type { ListingData } from "./types";
import { CardFavoriteButton } from "./CardFavoriteButton";

interface GridCardProps {
  data: ListingData;
  onClick?: () => void;
}

export function GridCard({ data, onClick }: GridCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="bg-cl-surface overflow-hidden text-left outline-none"
    >
      <div className="relative">
        <img
          src={data.image}
          alt={data.title}
          loading="lazy"
          className="block aspect-[4/5] w-full object-cover"
        />
        <CardFavoriteButton
          data={data}
          className="absolute left-2 top-2"
        />
      </div>
      <div className="h-[76px] px-2.5 pt-2 pb-3">
        <p className="text-[14px] text-cl-text line-clamp-2">
          {data.price && (
            <span className="font-bold text-cl-price">{data.price} · </span>
          )}
          {data.title}
        </p>
        <p className="mt-1 text-[12px] text-cl-text-muted truncate">
          {[data.hood, data.dist, data.time].filter(Boolean).join(" · ")}
        </p>
      </div>
    </button>
  );
}
