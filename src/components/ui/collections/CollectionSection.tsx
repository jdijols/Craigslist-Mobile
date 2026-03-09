import { ArrowRight } from "lucide-react";

interface CollectionSectionProps {
  title: string;
  onArrowClick?: () => void;
  children: React.ReactNode;
}

export function CollectionSection({
  title,
  onArrowClick,
  children,
}: CollectionSectionProps) {
  return (
    <section>
      <div className="flex items-center justify-between px-4 pb-3">
        <h2 className="text-[17px] font-bold text-cl-text">{title}</h2>
        {onArrowClick && (
          <button
            type="button"
            onClick={onArrowClick}
            className="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-[--radius-button] outline-none active:opacity-70"
            aria-label={`See all ${title}`}
          >
            <ArrowRight className="h-4 w-4 text-cl-text" />
          </button>
        )}
      </div>
      {children}
    </section>
  );
}
