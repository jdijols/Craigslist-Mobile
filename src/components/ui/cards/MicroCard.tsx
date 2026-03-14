import type { ListingData } from "./types";
import { CardFavoriteButton } from "./CardFavoriteButton";

interface MicroCardProps {
  data: ListingData;
  onClick?: () => void;
}

export function MicroCard({ data, onClick }: MicroCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-[104px] shrink-0 flex-col text-left outline-none"
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
          className="absolute left-1.5 top-1.5"
        />
      </div>
      <div className="mt-2 h-[52px]">
        <span className="text-[14px] font-bold text-cl-text line-clamp-2">
          {data.title}
        </span>
        {data.subtitle && (
          <span className="mt-0.5 block text-[12px] text-cl-text-muted">
            {data.subtitle}
          </span>
        )}
      </div>
    </button>
  );
}
