import { useState, useRef, useCallback, useEffect } from "react";
import { formatDist, formatTime, type ListingData } from "./types";
import { CardFavoriteButton } from "./CardFavoriteButton";

const GESTURE_GAP_MS = 150;
const NAV_COOLDOWN_MS = 1000;
const POST_NAV_MIN_DELTA = 30;

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

    el.addEventListener("wheel", handleWheel, { passive: false });
    return () => el.removeEventListener("wheel", handleWheel);
  }, [images.length, goTo]);

  return (
    <div className="w-full overflow-hidden rounded-[--radius-card-lg] bg-cl-surface text-left">
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
