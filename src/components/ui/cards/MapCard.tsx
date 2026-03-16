import { useState, useRef, useCallback, useEffect } from "react";
import { formatDist, formatTime, type ListingData } from "./types";
import { CardFavoriteButton } from "./CardFavoriteButton";

const GESTURE_GAP_MS = 150;
const NAV_COOLDOWN_MS = 1000;
const POST_NAV_MIN_DELTA = 30;
const SWIPE_THRESHOLD = 30;
const SWIPE_LOCK_ANGLE = 1.2;

interface MapCardProps {
  data: ListingData;
  onClick?: () => void;
}

export function MapCard({ data, onClick }: MapCardProps) {
  const images = data.images ?? [data.image];

  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLButtonElement>(null);
  const lastWheelEvent = useRef(0);
  const lastNavTime = useRef(0);
  const indexRef = useRef(0);

  useEffect(() => {
    indexRef.current = activeIndex;
  }, [activeIndex]);

  const goTo = useCallback(
    (idx: number) => {
      const clamped = Math.max(0, Math.min(images.length - 1, idx));
      indexRef.current = clamped;
      setActiveIndex(clamped);
    },
    [images.length],
  );

  /* ── Touch swipe state ── */
  const touchRef = useRef<{ startX: number; startY: number; locked: boolean; swiped: boolean } | null>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || images.length <= 1) return;

    const handleWheel = (e: WheelEvent) => {
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

    /* ── Touch handlers for iPhone ── */
    const onTouchStart = (e: TouchEvent) => {
      const t = e.touches[0];
      touchRef.current = { startX: t.clientX, startY: t.clientY, locked: false, swiped: false };
    };

    const onTouchMove = (e: TouchEvent) => {
      const tr = touchRef.current;
      if (!tr || tr.swiped) return;
      const t = e.touches[0];
      const dx = t.clientX - tr.startX;
      const dy = t.clientY - tr.startY;
      const absDx = Math.abs(dx);
      const absDy = Math.abs(dy);

      if (!tr.locked && (absDx > 8 || absDy > 8)) {
        tr.locked = true;
        if (absDx < absDy * SWIPE_LOCK_ANGLE) {
          touchRef.current = null;
          return;
        }
      }
      if (!tr.locked) return;

      e.preventDefault();

      if (absDx >= SWIPE_THRESHOLD) {
        tr.swiped = true;
        const cur = indexRef.current;
        goTo(cur + (dx < 0 ? 1 : -1));
      }
    };

    const onTouchEnd = () => {
      touchRef.current = null;
    };

    el.addEventListener("wheel", handleWheel, { passive: false });
    el.addEventListener("touchstart", onTouchStart, { passive: true });
    el.addEventListener("touchmove", onTouchMove, { passive: false });
    el.addEventListener("touchend", onTouchEnd, { passive: true });
    return () => {
      el.removeEventListener("wheel", handleWheel);
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchmove", onTouchMove);
      el.removeEventListener("touchend", onTouchEnd);
    };
  }, [images.length, goTo]);

  return (
    <div className="w-full overflow-hidden bg-cl-surface text-left">
      <div className="relative">
        <button
          type="button"
          ref={containerRef}
          onClick={onClick}
          className="block w-full overflow-hidden outline-none text-left"
        >
          <div
            className="flex transition-transform duration-300 ease-out"
            style={{ transform: `translateX(-${activeIndex * 100}%)` }}
          >
            {images.map((src, i) => (
              <img
                key={i}
                src={src}
                alt={`${data.title} ${i + 1}`}
                className="aspect-video w-full shrink-0 object-cover"
                loading="lazy"
                draggable={false}
              />
            ))}
          </div>
        </button>
        <CardFavoriteButton
          data={data}
          className="absolute left-1.5 top-1.5"
        />

        {images.length > 1 && (
          <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-1 pointer-events-none">
            {images.map((_, i) => (
              <span
                key={i}
                className={`h-1 rounded-full transition-all duration-200 ${
                  i === activeIndex ? "w-4 bg-white" : "w-1 bg-white/40"
                }`}
              />
            ))}
          </div>
        )}
      </div>

      <button
        type="button"
        onClick={onClick}
        className="w-full px-3 py-2 text-left outline-none"
      >
        <p className="text-[13px] text-cl-text line-clamp-1">
          {data.price && (
            <span className="font-bold text-cl-price">{data.price} · </span>
          )}
          {data.title}
        </p>
        <p className="mt-0.5 text-[11px] text-cl-text-muted">
          {[data.hood, formatDist(data.dist), formatTime(data.time)].filter(Boolean).join(" · ")}
        </p>
      </button>
    </div>
  );
}
