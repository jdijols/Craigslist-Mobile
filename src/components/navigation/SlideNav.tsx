import { motion } from "framer-motion";

interface SlideNavProps {
  total: number;
  activeIndex: number;
  labels?: string[];
  onSelect: (index: number) => void;
}

export function SlideNav({
  total,
  activeIndex,
  labels,
  onSelect,
}: SlideNavProps) {
  return (
    <nav className="flex items-center justify-center gap-3 py-3">
      {Array.from({ length: total }, (_, i) => (
        <button
          key={i}
          onClick={() => onSelect(i)}
          className="group relative flex flex-col items-center gap-1"
          aria-label={labels?.[i] ?? `Slide ${i + 1}`}
          aria-current={i === activeIndex ? "step" : undefined}
        >
          <div className="relative h-2 w-2">
            {i === activeIndex && (
              <motion.div
                layoutId="slide-dot-active"
                className="absolute inset-0 rounded-full bg-cl-accent"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
            <div
              className={`h-2 w-2 rounded-full transition-colors ${
                i === activeIndex
                  ? "bg-transparent"
                  : "bg-cl-text-muted group-hover:bg-cl-text"
              }`}
            />
          </div>

          {labels && (
            <span
              className={`text-[10px] leading-none transition-colors ${
                i === activeIndex
                  ? "font-medium text-cl-accent"
                  : "text-cl-text-muted"
              }`}
            >
              {labels[i]}
            </span>
          )}
        </button>
      ))}
    </nav>
  );
}
