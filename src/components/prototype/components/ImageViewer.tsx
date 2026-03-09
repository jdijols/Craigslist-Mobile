import { useState, useRef, useCallback, useEffect } from "react";
import { X } from "lucide-react";

interface ImageViewerProps {
  images: string[];
  initialIndex?: number;
  onClose: () => void;
}

const SWIPE_THRESHOLD = 50;
const SWIPE_VELOCITY_THRESHOLD = 0.3;
const DOUBLE_TAP_MS = 300;
const MAX_SCALE = 3;
const GESTURE_GAP_MS = 150;
const NAV_COOLDOWN_MS = 1000;
const POST_NAV_MIN_DELTA = 30;

export function ImageViewer({ images, initialIndex = 0, onClose }: ImageViewerProps) {
  const [current, setCurrent] = useState(initialIndex);
  const [scale, setScale] = useState(1);
  const [translate, setTranslate] = useState({ x: 0, y: 0 });
  const [overlaysVisible, setOverlaysVisible] = useState(true);

  const rootRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartRef = useRef<{ x: number; y: number; time: number } | null>(null);
  const lastTapRef = useRef(0);
  const pinchStartRef = useRef<{ dist: number; scale: number } | null>(null);
  const panStartRef = useRef<{ x: number; y: number; tx: number; ty: number } | null>(null);
  const tapTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const suppressClickRef = useRef(false);
  const scaleRef = useRef(1);
  const translateRef = useRef({ x: 0, y: 0 });
  const indexRef = useRef(initialIndex);
  const lastWheelEvent = useRef(0);
  const lastNavTime = useRef(0);

  useEffect(() => { scaleRef.current = scale; }, [scale]);
  useEffect(() => { translateRef.current = translate; }, [translate]);
  useEffect(() => { indexRef.current = current; }, [current]);

  useEffect(() => {
    return () => { if (tapTimerRef.current) clearTimeout(tapTimerRef.current); };
  }, []);

  useEffect(() => {
    const phoneScreen = rootRef.current?.closest(".phone-screen");
    if (!phoneScreen) return;
    phoneScreen.setAttribute("data-dark-status-bar", "");
    return () => phoneScreen.removeAttribute("data-dark-status-bar");
  }, []);

  const resetTransform = useCallback(() => {
    setScale(1);
    setTranslate({ x: 0, y: 0 });
  }, []);

  const goTo = useCallback((idx: number) => {
    const clamped = Math.max(0, Math.min(images.length - 1, idx));
    resetTransform();
    indexRef.current = clamped;
    setCurrent(clamped);
  }, [images.length, resetTransform]);

  const getTouchDist = (t1: React.Touch, t2: React.Touch) =>
    Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      const dist = getTouchDist(e.touches[0], e.touches[1]);
      pinchStartRef.current = { dist, scale: scaleRef.current };
      touchStartRef.current = null;
      return;
    }

    if (e.touches.length === 1) {
      const touch = e.touches[0];
      const now = Date.now();

      if (now - lastTapRef.current < DOUBLE_TAP_MS) {
        if (tapTimerRef.current) {
          clearTimeout(tapTimerRef.current);
          tapTimerRef.current = null;
        }
        lastTapRef.current = 0;
        if (scaleRef.current > 1) {
          resetTransform();
        } else {
          setScale(2);
          const rect = containerRef.current?.getBoundingClientRect();
          if (rect) {
            const cx = touch.clientX - rect.left - rect.width / 2;
            const cy = touch.clientY - rect.top - rect.height / 2;
            setTranslate({ x: -cx, y: -cy });
          }
        }
        touchStartRef.current = null;
        return;
      }

      lastTapRef.current = now;

      if (scaleRef.current > 1) {
        panStartRef.current = {
          x: touch.clientX,
          y: touch.clientY,
          tx: translateRef.current.x,
          ty: translateRef.current.y,
        };
        touchStartRef.current = null;
      } else {
        touchStartRef.current = { x: touch.clientX, y: touch.clientY, time: now };
        panStartRef.current = null;
      }
    }
  }, [resetTransform]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 2 && pinchStartRef.current) {
      e.preventDefault();
      const dist = getTouchDist(e.touches[0], e.touches[1]);
      const ratio = dist / pinchStartRef.current.dist;
      const newScale = Math.min(MAX_SCALE, Math.max(1, pinchStartRef.current.scale * ratio));
      setScale(newScale);
      if (newScale <= 1) setTranslate({ x: 0, y: 0 });
      return;
    }

    if (e.touches.length === 1 && panStartRef.current) {
      const dx = e.touches[0].clientX - panStartRef.current.x;
      const dy = e.touches[0].clientY - panStartRef.current.y;
      setTranslate({
        x: panStartRef.current.tx + dx,
        y: panStartRef.current.ty + dy,
      });
    }
  }, []);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    suppressClickRef.current = true;

    if (pinchStartRef.current) {
      pinchStartRef.current = null;
      if (scaleRef.current <= 1.05) resetTransform();
      return;
    }

    if (panStartRef.current) {
      panStartRef.current = null;
      return;
    }

    if (!touchStartRef.current || e.changedTouches.length === 0) return;

    const touch = e.changedTouches[0];
    const dx = touch.clientX - touchStartRef.current.x;
    const dy = touch.clientY - touchStartRef.current.y;
    const dt = Date.now() - touchStartRef.current.time;
    const velocity = Math.abs(dx) / dt;

    if (Math.abs(dx) > Math.abs(dy) && (Math.abs(dx) > SWIPE_THRESHOLD || velocity > SWIPE_VELOCITY_THRESHOLD)) {
      const cur = indexRef.current;
      if (dx < 0 && cur < images.length - 1) goTo(cur + 1);
      else if (dx > 0 && cur > 0) goTo(cur - 1);
    } else if (Math.abs(dx) < 10 && Math.abs(dy) < 10 && dt < 300) {
      tapTimerRef.current = setTimeout(() => {
        setOverlaysVisible((v) => !v);
        tapTimerRef.current = null;
      }, DOUBLE_TAP_MS);
    }

    touchStartRef.current = null;
  }, [images.length, goTo, resetTransform]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || images.length <= 1) return;

    const handleWheel = (e: WheelEvent) => {
      if (scaleRef.current > 1) return;
      if (Math.abs(e.deltaY) >= Math.abs(e.deltaX)) return;

      const delta = e.deltaX;
      const absDelta = Math.abs(delta);
      const now = Date.now();
      const eventGap = now - lastWheelEvent.current;
      const navGap = now - lastNavTime.current;
      const cur = indexRef.current;

      const atStart = cur === 0 && delta < 0;
      const atEnd = cur === images.length - 1 && delta > 0;
      if (atStart || atEnd) return;

      e.preventDefault();

      if (eventGap < GESTURE_GAP_MS) {
        lastWheelEvent.current = now;
        if (navGap >= NAV_COOLDOWN_MS && absDelta >= POST_NAV_MIN_DELTA) {
          lastNavTime.current = now;
          goTo(cur + (delta > 0 ? 1 : -1));
        }
        return;
      }

      if (absDelta < 5) return;

      lastWheelEvent.current = now;
      lastNavTime.current = now;
      goTo(cur + (delta > 0 ? 1 : -1));
    };

    el.addEventListener("wheel", handleWheel, { passive: false });
    return () => el.removeEventListener("wheel", handleWheel);
  }, [images.length, goTo]);

  const handleCarouselClick = useCallback(() => {
    if (suppressClickRef.current) {
      suppressClickRef.current = false;
      return;
    }
    setOverlaysVisible((v) => !v);
  }, []);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowRight") goTo(indexRef.current + 1);
      else if (e.key === "ArrowLeft") goTo(indexRef.current - 1);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [goTo, onClose]);

  return (
    <div ref={rootRef} className="absolute inset-0 z-50 flex flex-col bg-black">
      {/* Top overlay */}
      <div
        className={`pointer-events-none absolute left-0 right-0 z-10 flex items-center justify-between px-4 pt-3 transition-opacity duration-200 ${
          overlaysVisible ? "opacity-100" : "opacity-0"
        }`}
        style={{ top: "var(--chrome-offset)" }}
      >
        <button
          type="button"
          onClick={onClose}
          className={`flex h-10 w-10 items-center justify-center rounded-[--radius-button] bg-white/15 outline-none active:opacity-70 ${
            overlaysVisible ? "pointer-events-auto" : "pointer-events-none"
          }`}
          aria-label="Close"
        >
          <X className="h-5 w-5 text-white" strokeWidth={2} />
        </button>
        {images.length > 1 && (
          <span className="pointer-events-none flex h-10 w-20 items-center justify-center rounded-[--radius-button] bg-white/15 text-[13px] font-medium text-white">
            {current + 1} / {images.length}
          </span>
        )}
      </div>

      {/* Image carousel */}
      <div
        ref={containerRef}
        className="relative flex-1 overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onClick={handleCarouselClick}
        style={{ touchAction: scale > 1 ? "none" : "pan-y" }}
      >
        <div
          className="flex h-full transition-transform duration-300 ease-out"
          style={{ transform: `translateX(-${current * 100}%)` }}
        >
          {images.map((src, i) => (
            <div
              key={i}
              className="flex h-full w-full shrink-0 items-center justify-center"
            >
              <img
                src={src}
                alt={`image ${i + 1}`}
                className="h-full w-full select-none object-contain"
                style={
                  i === current
                    ? {
                        transform: `scale(${scale}) translate(${translate.x / scale}px, ${translate.y / scale}px)`,
                        transition: scale === 1 ? "transform 0.2s ease-out" : "none",
                      }
                    : undefined
                }
                draggable={false}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Dot indicators */}
      {images.length > 1 && (
        <div
          className={`flex shrink-0 justify-center gap-1.5 pb-10 pt-4 transition-opacity duration-200 ${
            overlaysVisible ? "opacity-100" : "opacity-0"
          }`}
        >
          {images.map((_, i) => (
            <span
              key={i}
              className={`h-1.5 rounded-full transition-all duration-200 ${
                i === current ? "w-5 bg-white" : "w-1.5 bg-white/40"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
