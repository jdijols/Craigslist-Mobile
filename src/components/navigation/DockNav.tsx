import { forwardRef, useImperativeHandle, useRef, useState } from "react";
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

export interface DockNavHandle {
  focusActive: () => void;
}

export const DockNav = forwardRef<DockNavHandle, DockNavProps>(function DockNav(
  { slides, activeIndex, onSelect },
  ref
) {
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);

  useImperativeHandle(
    ref,
    () => ({
      focusActive: () => {
        buttonRefs.current[activeIndex]?.focus();
      },
    }),
    [activeIndex]
  );

  return (
    <nav className="group/dock absolute left-5 top-1/2 z-20 flex -translate-y-1/2 flex-col items-start py-2 pl-1 pr-4">
      {slides.map((slide, i) => {
        const isActive = i === activeIndex;
        const isHighlighted = focusedIndex !== null ? focusedIndex === i : isActive;
        return (
          <button
            key={slide.id}
            ref={(el) => {
              buttonRefs.current[i] = el;
            }}
            onClick={() => onSelect(i)}
            onFocus={() => setFocusedIndex(i)}
            onBlur={() => setFocusedIndex(null)}
            className="group/dot dock-nav-item flex cursor-pointer items-center gap-2.5 py-1.5 outline-none"
            aria-label={slide.title}
            aria-current={isActive ? "step" : undefined}
          >
            <div className="relative h-1.5 w-5 flex-shrink-0">
              {isHighlighted && (
                <motion.div
                  layoutId="active-dot"
                  className="absolute inset-y-0 left-0 h-1.5 w-5 rounded-full bg-lf-blue"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              {!isHighlighted && (
                <div className="absolute inset-y-0 left-0 h-1.5 w-1.5 rounded-full bg-lf-secondary transition-colors duration-200 group-hover/dot:bg-lf-body" />
              )}
            </div>

            <span
              className={`whitespace-nowrap text-[11px] leading-none transition-[opacity,color] duration-200 ${
                isHighlighted
                  ? "font-semibold text-lf-blue opacity-100"
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
});
