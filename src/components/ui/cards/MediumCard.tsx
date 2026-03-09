import type { ListingData } from "./types";
import { CardFavoriteButton } from "./CardFavoriteButton";

interface MediumCardProps {
  data: ListingData;
  onClick?: () => void;
}

export function MediumCard({ data, onClick }: MediumCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-[170px] shrink-0 flex-col text-left outline-none"
    >
      <div className="relative">
        <img
          src={data.image}
          alt={data.title}
          loading="lazy"
          className="aspect-square w-full rounded-[--radius-card-lg] object-cover"
        />
        <CardFavoriteButton
          data={data}
          className="absolute left-2 top-2"
        />
      </div>
      <div className="mt-2">
        <p className="text-[14px] font-medium text-cl-text line-clamp-2">
          {data.title}
        </p>
        {data.subtitle && (
          <span className="mt-0.5 block text-[12px] text-cl-text-muted">{data.subtitle}</span>
        )}
        {data.price && (
          <span className="mt-1 block text-[13px] font-bold text-cl-price">{data.price}</span>
        )}
      </div>
    </button>
  );
}
