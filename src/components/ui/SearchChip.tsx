import { X } from "lucide-react";

interface SearchChipProps {
  term: string;
  onClear: () => void;
  onEdit: () => void;
}

export function SearchChip({ term, onClear, onEdit }: SearchChipProps) {
  return (
    <div className="flex flex-1 min-w-0 min-w-[80px] h-search-input max-w-full items-center rounded-[--radius-button] bg-cl-bg-secondary overflow-hidden">
      <button
        type="button"
        onClick={onEdit}
        className="flex-1 min-w-0 pl-3.5 text-left outline-none active:opacity-70"
        aria-label={`Edit search: ${term}`}
      >
        <span className="block truncate text-[15px] leading-[25px] text-cl-text">
          {term}
        </span>
      </button>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onClear();
        }}
        className="flex shrink-0 w-[44px] h-full items-center justify-center outline-none active:opacity-70"
        aria-label="Clear search"
      >
        <X className="h-[18px] w-[18px] text-cl-text" strokeWidth={2} />
      </button>
    </div>
  );
}
