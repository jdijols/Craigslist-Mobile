import { motion } from "framer-motion";

interface SlideItem {
  id: string;
  title: string;
}

interface DockNavProps {
  slides: SlideItem[];
  activeIndex: number;
  onSelect: (index: number) => void;
}

export function DockNav({ slides, activeIndex, onSelect }: DockNavProps) {
  return (
    <nav className="group/dock absolute left-5 top-1/2 z-20 flex -translate-y-1/2 flex-col items-start py-2 pl-1 pr-4">
      {slides.map((slide, i) => {
        const isActive = i === activeIndex;
        return (
          <button
            key={slide.id}
            onClick={() => onSelect(i)}
            className="group/dot flex cursor-pointer items-center gap-2.5 py-1.5 outline-none"
            aria-label={slide.title}
            aria-current={isActive ? "step" : undefined}
          >
            <div className="relative h-1.5 w-5 flex-shrink-0">
              {isActive && (
                <motion.div
                  layoutId="active-dot"
                  className="absolute inset-y-0 left-0 h-1.5 w-5 rounded-full bg-lf-blue"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              {!isActive && (
                <div className="absolute inset-y-0 left-0 h-1.5 w-1.5 rounded-full bg-lf-secondary transition-colors duration-200 group-hover/dot:bg-lf-body" />
              )}
            </div>

            <span
              className={`whitespace-nowrap text-[11px] leading-none transition-[opacity,color] duration-200 ${
                isActive
                  ? "font-semibold text-lf-blue"
                  : "text-lf-secondary opacity-0 group-hover/dot:opacity-100"
              }`}
            >
              {slide.title}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
