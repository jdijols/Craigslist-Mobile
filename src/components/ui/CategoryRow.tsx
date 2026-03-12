import { useRef, useCallback, useEffect } from "react";

interface CategoryRowProps {
  labels: string[];
  activeLabel: string;
  onLabelChange: (label: string) => void;
  collapsed?: boolean;
  /** Render a trailing element inside the active chip (e.g. a chevron icon). */
  renderTrailing?: (label: string) => React.ReactNode;
  /** Called on long-press of a chip (~500ms). */
  onLongPress?: (label: string) => void;
  /** When true, tapping chips won't steal focus from the currently focused element (e.g. an input). */
  preventFocusSteal?: boolean;
  /** Optional element rendered right-aligned inside the tab row (e.g. a reset button). */
  rightSlot?: React.ReactNode;
}

const LONG_PRESS_MS = 500;

export function CategoryRow({
  labels,
  activeLabel,
  onLabelChange,
  collapsed = false,
  renderTrailing,
  onLongPress,
  preventFocusSteal = false,
  rightSlot,
}: CategoryRowProps) {
  const rowRef = useRef<HTMLDivElement>(null);
  const chipRefs = useRef<Map<string, HTMLButtonElement>>(new Map());
  const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const longPressFired = useRef(false);

  const scrollChipTowardCenter = useCallback((chipLabel: string) => {
    const container = rowRef.current;
    const chip = chipRefs.current.get(chipLabel);
    if (!container || !chip) return;

    const containerWidth = container.clientWidth;
    const maxScroll = container.scrollWidth - containerWidth;
    if (maxScroll <= 0) return;

    const chipCenter = chip.offsetLeft + chip.offsetWidth / 2;
    const targetScroll = chipCenter - containerWidth / 2;

    container.scrollTo({
      left: Math.max(0, Math.min(targetScroll, maxScroll)),
      behavior: "smooth",
    });
  }, []);

  useEffect(() => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => scrollChipTowardCenter(activeLabel));
    });
  }, [activeLabel, scrollChipTowardCenter]);

  useEffect(() => {
    const el = rowRef.current;
    if (!el) return;

    const trapScroll = (e: WheelEvent) => {
      const { scrollLeft, scrollWidth, clientWidth } = el;
      const maxScroll = scrollWidth - clientWidth;
      const atStart = scrollLeft <= 0;
      const atEnd = scrollLeft >= maxScroll;

      if ((atStart && e.deltaX < 0) || (atEnd && e.deltaX > 0)) {
        e.preventDefault();
      }
    };

    el.addEventListener("wheel", trapScroll, { passive: false });
    return () => el.removeEventListener("wheel", trapScroll);
  }, []);

  const handleSelect = useCallback(
    (name: string) => {
      onLabelChange(name);
      requestAnimationFrame(() => scrollChipTowardCenter(name));
    },
    [onLabelChange, scrollChipTowardCenter],
  );

  const handlePointerDown = useCallback(
    (name: string) => {
      if (!onLongPress) return;
      longPressFired.current = false;
      longPressTimer.current = setTimeout(() => {
        longPressFired.current = true;
        handleSelect(name);
        onLongPress(name);
      }, LONG_PRESS_MS);
    },
    [onLongPress, handleSelect],
  );

  const handlePointerUp = useCallback(
    (name: string) => {
      if (longPressTimer.current) {
        clearTimeout(longPressTimer.current);
        longPressTimer.current = null;
      }
      if (!longPressFired.current) {
        handleSelect(name);
      }
    },
    [handleSelect],
  );

  const handlePointerCancel = useCallback(() => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  }, []);

  return (
    <div
      className={`overflow-hidden transition-[max-height] duration-300 ease-in-out ${
        collapsed ? "max-h-0" : "max-h-[44px]"
      }`}
    >
      <div className="flex items-center">
        <div
          ref={rowRef}
          className="flex flex-1 min-w-0 overflow-x-auto overscroll-x-contain pl-1.5 pr-2 scrollbar-none"
        >
          {labels.map((name) => {
            const active = name === activeLabel;
            return (
              <button
                key={name}
                type="button"
                ref={(el) => {
                  if (el) chipRefs.current.set(name, el);
                }}
                onMouseDown={preventFocusSteal ? (e) => e.preventDefault() : undefined}
                onPointerDown={onLongPress ? () => handlePointerDown(name) : undefined}
                onPointerUp={onLongPress ? () => handlePointerUp(name) : undefined}
                onPointerLeave={onLongPress ? handlePointerCancel : undefined}
                onClick={onLongPress ? undefined : () => handleSelect(name)}
                className="shrink-0 px-2.5 pb-0 pt-1 outline-none min-h-[44px] flex items-end select-none"
              >
                <span
                  className={`inline-flex items-center gap-0.5 border-b-2 pb-2.5 text-sm font-semibold transition-colors ${
                    active
                      ? "border-cl-accent text-cl-accent"
                      : "border-transparent text-cl-text-muted"
                  }`}
                >
                  {name}
                  {active && renderTrailing?.(name)}
                </span>
              </button>
            );
          })}
        </div>
        {rightSlot && (
          <div className="shrink-0 pr-5 flex items-center min-h-[44px]">
            {rightSlot}
          </div>
        )}
      </div>
    </div>
  );
}
