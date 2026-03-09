import type { ListingData } from "./types";

interface SlideCardProps {
  data: ListingData;
  onClick?: () => void;
}

export function SlideCard({ data, onClick }: SlideCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-[220px] shrink-0 flex-col text-left outline-none"
    >
      <img
        src={data.image}
        alt={data.title}
        loading="lazy"
        className="aspect-[4/3] w-full rounded-[--radius-card-lg] object-cover"
      />
      <span className="mt-2 block h-[40px] text-[15px] font-bold leading-snug text-cl-text line-clamp-2">
        {data.title}
      </span>
    </button>
  );
}
