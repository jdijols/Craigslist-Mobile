import {
  useState,
  useCallback,
  useEffect,
  useRef,
  type ReactNode,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, RotateCcw } from "lucide-react";
import { DockNav } from "@/components/navigation";
import { PhoneFrame, ScreenshotPlaceholder } from "@/components/layout";
import { AppPrototype } from "@/components/prototype";
import type { ScreenId, PrototypeStep } from "@/components/prototype";

export interface SlideDefinition {
  id: string;
  title: string;
  content?: ReactNode;
  prototypeSteps?: PrototypeStep[];
  /** Render phone on left, text on right (default is text-left, phone-right). */
  flipped?: boolean;
}

interface PresentationProps {
  slides: SlideDefinition[];
}

const textVariants = {
  enter: (direction: number) => ({
    opacity: 0,
    y: direction > 0 ? 40 : -40,
  }),
  center: {
    opacity: 1,
    y: 0,
  },
  exit: (direction: number) => ({
    opacity: 0,
    y: direction > 0 ? -40 : 40,
  }),
};

const SWIPE_THRESHOLD_PX = 50;
const GESTURE_GAP_MS = 150;
const NAV_COOLDOWN_MS = 1000;
const POST_NAV_MIN_DELTA = 30;

export function Presentation({ slides }: PresentationProps) {
  const [[slideIndex, stepIndex, direction], setPage] = useState([0, 0, 0]);
  const [interactiveScreen, setInteractiveScreen] = useState<ScreenId | null>(null);

  const touchStartY = useRef<number | null>(null);
  const lastWheelEvent = useRef(0);
  const lastNavTime = useRef(0);

  const getStepCount = useCallback(
    (si: number) => slides[si]?.prototypeSteps?.length ?? 0,
    [slides],
  );

  const isProtoSlide = useCallback(
    (si: number) => getStepCount(si) > 0,
    [getStepCount],
  );

  const paginate = useCallback(
    (newDirection: number) => {
      setInteractiveScreen(null);

      setPage(([si, sti]) => {
        if (newDirection > 0) {
          const totalSteps = getStepCount(si);
          if (totalSteps > 0 && sti < totalSteps - 1) {
            return [si, sti + 1, 1];
          }
          const nextSi = si + 1;
          if (nextSi >= slides.length) return [si, sti, 0];
          return [nextSi, 0, 1];
        } else {
          if (sti > 0) {
            return [si, sti - 1, -1];
          }
          const prevSi = si - 1;
          if (prevSi < 0) return [si, sti, 0];
          const prevSteps = getStepCount(prevSi);
          return [prevSi, prevSteps > 0 ? prevSteps - 1 : 0, -1];
        }
      });
    },
    [slides.length, getStepCount],
  );

  const goTo = useCallback(
    (index: number) => {
      setInteractiveScreen(null);
      setPage(([si]) => [index, 0, index > si ? 1 : -1]);
    },
    [],
  );

  const handlePrototypeNavigate = useCallback((screen: ScreenId) => {
    setInteractiveScreen(screen);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        e.preventDefault();
        paginate(1);
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault();
        paginate(-1);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [paginate]);

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();

      const now = Date.now();
      const eventGap = now - lastWheelEvent.current;
      const navGap = now - lastNavTime.current;

      const delta =
        Math.abs(e.deltaY) > Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
      const absDelta = Math.abs(delta);

      if (eventGap < GESTURE_GAP_MS) {
        lastWheelEvent.current = now;

        if (navGap >= NAV_COOLDOWN_MS && absDelta >= POST_NAV_MIN_DELTA) {
          lastNavTime.current = now;
          paginate(delta > 0 ? 1 : -1);
        }
        return;
      }

      if (absDelta < 5) return;

      lastWheelEvent.current = now;
      lastNavTime.current = now;
      paginate(delta > 0 ? 1 : -1);
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    return () => window.removeEventListener("wheel", handleWheel);
  }, [paginate]);

  useEffect(() => {
    let swipeHandled = false;

    const handleTouchStart = (e: TouchEvent) => {
      touchStartY.current = e.touches[0].clientY;
      swipeHandled = false;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (touchStartY.current === null || swipeHandled) return;
      const deltaY = touchStartY.current - e.changedTouches[0].clientY;
      touchStartY.current = null;

      if (Math.abs(deltaY) < SWIPE_THRESHOLD_PX) return;
      swipeHandled = true;
      paginate(deltaY > 0 ? 1 : -1);
    };

    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchend", handleTouchEnd, { passive: true });
    return () => {
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [paginate]);

  const currentSlide = slides[slideIndex];
  const isFirst = slideIndex === 0 && stepIndex === 0;
  const isLast =
    slideIndex === slides.length - 1 &&
    stepIndex >= (getStepCount(slideIndex) || 1) - 1;

  const showPhone = isProtoSlide(slideIndex);
  const currentStep = currentSlide.prototypeSteps?.[stepIndex];
  const guidedScreen = currentStep?.screen ?? "home";
  const displayScreen = interactiveScreen ?? guidedScreen;
  const postDetailVariant = currentStep?.postDetailVariant;
  const homeCategory = currentStep?.homeCategory;
  const homeSubcategory = currentStep?.homeSubcategory;
  const homeViewMode = currentStep?.homeViewMode;

  const animKey = `${currentSlide.id}-${stepIndex}`;

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-slide-bg">
      <AnimatePresence initial={false} custom={direction} mode="wait">
        {!showPhone ? (
          <motion.div
            key={currentSlide.id}
            custom={direction}
            variants={textVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              y: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 },
            }}
            className="absolute inset-0 flex items-center justify-center"
          >
            {currentSlide.content}
          </motion.div>
        ) : (
          <motion.div
            key="prototype-zone"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className={`absolute inset-0 flex items-center justify-center gap-16 px-12${
              currentSlide.flipped ? " flex-row-reverse" : ""
            }`}
          >
            <AnimatePresence initial={false} custom={direction} mode="wait">
              <motion.div
                key={animKey}
                custom={direction}
                variants={textVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  y: { type: "spring", stiffness: 300, damping: 30 },
                  opacity: { duration: 0.2 },
                }}
                className="max-w-sm"
              >
                {currentStep?.text}
              </motion.div>
            </AnimatePresence>

            <div className="shrink-0">
              <PhoneFrame>
                {currentStep?.screenshotPlaceholder ? (
                  <ScreenshotPlaceholder
                    label={currentStep.screenshotPlaceholder}
                    image={currentStep.screenshotImage}
                  />
                ) : (
                  <AppPrototype
                    screen={displayScreen}
                    onNavigate={handlePrototypeNavigate}
                    postDetailVariant={postDetailVariant}
                    homeCategory={homeCategory}
                    homeSubcategory={homeSubcategory}
                    homeViewMode={homeViewMode}
                  />
                )}
              </PhoneFrame>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Nav arrows */}
      <div className="absolute right-6 top-6 z-20 flex items-center gap-2">
        <button
          onClick={() => paginate(-1)}
          disabled={isFirst}
          className="group rounded-full p-2 text-lf-secondary outline-none transition-all hover:text-lf-blue disabled:pointer-events-none disabled:opacity-20"
          aria-label="Previous"
        >
          <ArrowLeft className="h-6 w-6 transition-all duration-300 ease-in-out group-hover:opacity-100 group-hover:-translate-x-1" />
        </button>
        <button
          onClick={() => (isLast ? goTo(0) : paginate(1))}
          className="group rounded-full p-2 text-lf-secondary outline-none transition-all hover:text-lf-blue disabled:pointer-events-none disabled:opacity-20"
          aria-label={isLast ? "Restart presentation" : "Next"}
        >
          {isLast ? (
            <RotateCcw className="h-6 w-6 transition-all duration-300 ease-in-out group-hover:opacity-100 group-hover:-rotate-[30deg]" />
          ) : (
            <ArrowRight className="h-6 w-6 transition-all duration-300 ease-in-out group-hover:opacity-100 group-hover:translate-x-1" />
          )}
        </button>
      </div>

      <DockNav slides={slides} activeIndex={slideIndex} onSelect={goTo} />
    </div>
  );
}
