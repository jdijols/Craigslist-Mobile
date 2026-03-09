import { useState, useCallback, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { SlideNav } from "./SlideNav";

interface Slide {
  id: string;
  label: string;
  content: ReactNode;
}

interface SlideContainerProps {
  slides: Slide[];
  initialIndex?: number;
  showNav?: boolean;
}

const SWIPE_THRESHOLD = 50;
const SWIPE_VELOCITY = 500;

const variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? "100%" : "-100%",
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction > 0 ? "-100%" : "100%",
    opacity: 0,
  }),
};

export function SlideContainer({
  slides,
  initialIndex = 0,
  showNav = true,
}: SlideContainerProps) {
  const [[activeIndex, direction], setPage] = useState([initialIndex, 0]);

  const paginate = useCallback(
    (newDirection: number) => {
      setPage(([prev]) => {
        const next = prev + newDirection;
        if (next < 0 || next >= slides.length) return [prev, 0];
        return [next, newDirection];
      });
    },
    [slides.length],
  );

  const goTo = useCallback(
    (index: number) => {
      setPage(([prev]) => [index, index > prev ? 1 : -1]);
    },
    [],
  );

  const handleDragEnd = useCallback(
    (_: unknown, info: { offset: { x: number }; velocity: { x: number } }) => {
      const { offset, velocity } = info;
      if (
        offset.x < -SWIPE_THRESHOLD ||
        velocity.x < -SWIPE_VELOCITY
      ) {
        paginate(1);
      } else if (
        offset.x > SWIPE_THRESHOLD ||
        velocity.x > SWIPE_VELOCITY
      ) {
        paginate(-1);
      }
    },
    [paginate],
  );

  const currentSlide = slides[activeIndex];

  return (
    <div className="relative flex h-full flex-col">
      <div className="relative flex-1 overflow-hidden">
        <AnimatePresence initial={false} custom={direction} mode="popLayout">
          <motion.div
            key={currentSlide.id}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 },
            }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.15}
            onDragEnd={handleDragEnd}
            className="absolute inset-0"
          >
            {currentSlide.content}
          </motion.div>
        </AnimatePresence>
      </div>

      {showNav && (
        <SlideNav
          total={slides.length}
          activeIndex={activeIndex}
          labels={slides.map((s) => s.label)}
          onSelect={goTo}
        />
      )}
    </div>
  );
}
