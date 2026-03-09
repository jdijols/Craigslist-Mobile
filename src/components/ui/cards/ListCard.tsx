import { formatDist, formatTime, type ListingData } from "./types";
import { CardFavoriteButton } from "./CardFavoriteButton";

interface ListCardProps {
  data: ListingData;
  onClick?: () => void;
}

export function ListCard({ data, onClick }: ListCardProps) {
  return (
    <div className="flex w-full h-[76px] items-start bg-cl-surface text-left">
      <CardFavoriteButton
        data={data}
        align="center"
        className="shrink-0 mt-2"
      />
      <button
        type="button"
        onClick={onClick}
        className="min-w-0 flex-1 pt-2.5 pr-3 outline-none text-left"
      >
        <p className="text-[14px] text-cl-text line-clamp-2">
          {data.price && (
            <span className="font-bold text-cl-price">{data.price} · </span>
          )}
          {data.title}
        </p>
        <p className="mt-1 text-[12px] text-cl-text-muted">
          {[data.hood, formatDist(data.dist), formatTime(data.time)].filter(Boolean).join(" · ")}
        </p>
      </button>
    </div>
  );
}
