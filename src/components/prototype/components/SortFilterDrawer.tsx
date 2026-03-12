import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ChevronRight } from "lucide-react";
import { useOverlayPortal } from "../../layout/OverlayPortal";
import { SPRING_SHEET, OVERLAY_FADE } from "../transitions";

export type SortOption =
  | "suggested"
  | "newest first"
  | "oldest first"
  | "price: low → high"
  | "price: high → low"
  | "closest";

export const SORT_OPTIONS: SortOption[] = [
  "suggested",
  "newest first",
  "oldest first",
  "price: low → high",
  "price: high → low",
  "closest",
];

export const DEFAULT_SORT: SortOption = "suggested";
export const DEFAULT_DISTANCE = "25 miles";

export const DISTANCE_MIN = 5;
export const DISTANCE_MAX = 100;
export const DISTANCE_STEP = 5;

function parseDistanceMiles(value: string): number {
  const n = parseFloat(value);
  return Number.isNaN(n) ? 25 : Math.max(DISTANCE_MIN, Math.min(DISTANCE_MAX, n));
}

interface SortFilterDrawerProps {
  open: boolean;
  onClose: () => void;
  activeSort: SortOption;
  onSortChange: (sort: SortOption) => void;
  activeDistance: string;
  onDistanceChange: (distance: string) => void;
  minPrice: string;
  maxPrice: string;
  onMinPriceChange: (price: string) => void;
  onMaxPriceChange: (price: string) => void;
  onReset: () => void;
  initialSections?: FilterSection[];
  hideSortSection?: boolean;
}

export type FilterSection = "sort" | "distance" | "price";

const DRAWER_WIDTH_PERCENT = 80;

export function SortFilterDrawer({ open, onClose, activeSort, onSortChange, activeDistance, onDistanceChange, minPrice, maxPrice, onMinPriceChange, onMaxPriceChange, onReset, initialSections, hideSortSection }: SortFilterDrawerProps) {
  const portalTarget = useOverlayPortal();

  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  const content = (
    <AnimatePresence>
      {open && (
        <div
          className="absolute inset-0"
          style={{ pointerEvents: "auto" }}
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={OVERLAY_FADE}
            className="absolute inset-0 bg-black/40"
            onClick={onClose}
            aria-label="Close sort & filter"
          />

          {/* Panel sliding in from the right */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={SPRING_SHEET}
            className="absolute top-0 bottom-0 right-0 flex flex-col border-l border-cl-border pt-[54px] bg-cl-surface"
            style={{ width: `${DRAWER_WIDTH_PERCENT}%` }}
          >
            {/* Fixed header */}
            <div className="flex min-h-[44px] shrink-0 items-center justify-between px-5 bg-cl-surface">
              <h2 className="text-[15px] font-semibold text-cl-text-muted uppercase tracking-wide">
                {hideSortSection ? "filter" : "sort & filter"}
              </h2>
              <button
                type="button"
                onClick={onReset}
                className="min-h-[44px] flex items-center outline-none active:opacity-70 transition-opacity"
              >
                <span className="text-[13px] font-medium text-cl-accent">
                  reset all
                </span>
              </button>
            </div>

            {/* Scrollable content */}
            <div className="scrollbar-thin flex-1 min-h-0 overflow-y-auto overscroll-contain bg-cl-surface">
              {/* ── Sort ── */}
              {!hideSortSection && (
                <CollapsibleSection label="sort by" defaultExpanded={initialSections?.includes("sort")}>
                  <ul>
                    {SORT_OPTIONS.map((opt) => (
                      <DrawerItem
                        key={opt}
                        label={opt}
                        active={activeSort === opt}
                        onSelect={() => onSortChange(opt)}
                      />
                    ))}
                  </ul>
                </CollapsibleSection>
              )}

              {/* ── Distance ── */}
              <CollapsibleSection label="distance" defaultExpanded={initialSections?.includes("distance")}>
                <DistanceSlider
                  value={parseDistanceMiles(activeDistance)}
                  min={DISTANCE_MIN}
                  max={DISTANCE_MAX}
                  step={DISTANCE_STEP}
                  onChange={(miles) => onDistanceChange(`${miles} miles`)}
                />
              </CollapsibleSection>

              {/* ── Price range ── */}
              <CollapsibleSection label="price range" defaultExpanded={initialSections?.includes("price")}>
                <div className="px-5 pb-2">
                  <div className="flex gap-3">
                    <label className="flex-1 rounded-[--radius-card] border-2 border-cl-border bg-cl-surface px-3 py-2.5 focus-within:border-cl-accent transition-colors">
                      <span className="text-[11px] text-cl-text-muted block">min</span>
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-[17px] text-cl-price">$</span>
                        <input
                          type="text"
                          inputMode="numeric"
                          value={minPrice}
                          onChange={(e) => {
                            const v = e.target.value.replace(/[^0-9]/g, "");
                            onMinPriceChange(v);
                          }}
                          placeholder="0"
                          className="w-full bg-transparent text-[17px] text-cl-price placeholder:text-cl-text-muted outline-none"
                        />
                      </div>
                    </label>
                    <label className="flex-1 rounded-[--radius-card] border-2 border-cl-border bg-cl-surface px-3 py-2.5 focus-within:border-cl-accent transition-colors">
                      <span className="text-[11px] text-cl-text-muted block">max</span>
                      <div className="flex items-baseline gap-1.5">
                        {maxPrice && <span className="text-[17px] text-cl-price">$</span>}
                        <input
                          type="text"
                          inputMode="numeric"
                          value={maxPrice}
                          onChange={(e) => {
                            const v = e.target.value.replace(/[^0-9]/g, "");
                            onMaxPriceChange(v);
                          }}
                          placeholder="none"
                          className="w-full bg-transparent text-[17px] text-cl-price placeholder:text-cl-text-muted outline-none"
                        />
                      </div>
                    </label>
                  </div>
                </div>
              </CollapsibleSection>

              {/* ── Apply ── */}
              <div className="px-5 pt-4 pb-8">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex w-full min-h-[44px] items-center justify-center rounded-[--radius-button] bg-cl-accent py-3 shadow-[--shadow-card] outline-none active:opacity-90 transition-opacity"
                >
                  <span className="text-[15px] font-semibold text-cl-accent-text">
                    show results
                  </span>
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  if (!portalTarget) return content;
  return createPortal(content, portalTarget);
}

function CollapsibleSection({
  label,
  children,
  defaultExpanded = false,
}: {
  label: string;
  children: React.ReactNode;
  defaultExpanded?: boolean;
}) {
  const [expanded, setExpanded] = useState(defaultExpanded);

  return (
    <div>
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="flex w-full items-center justify-between px-5 pt-5 pb-1 outline-none min-h-[44px] active:opacity-70 transition-opacity"
      >
        <span className="text-[11px] font-semibold text-cl-text-muted uppercase tracking-wide">
          {label}
        </span>
        <ChevronRight
          className="h-4 w-4 text-cl-text-muted transition-transform duration-200"
          style={{ transform: expanded ? "rotate(90deg)" : "rotate(0deg)" }}
        />
      </button>

      <div
        className="grid transition-[grid-template-rows] duration-200 ease-in-out"
        style={{ gridTemplateRows: expanded ? "1fr" : "0fr" }}
      >
        <div className="overflow-hidden">
          {children}
        </div>
      </div>
    </div>
  );
}

function DistanceSlider({
  value,
  min,
  max,
  step,
  onChange,
}: {
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
}) {
  const fillPercent = ((value - min) / (max - min)) * 100;
  return (
    <div className="px-5 pb-4">
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="distance-slider w-full h-1 cursor-pointer"
        style={
          { "--track-fill": `${fillPercent}%` } as React.CSSProperties
        }
      />
      <p className="mt-1 pl-8 text-[15px] text-cl-text">
        {value} miles
      </p>
    </div>
  );
}

function DrawerItem({
  label,
  active,
  onSelect,
}: {
  label: string;
  active: boolean;
  onSelect: () => void;
}) {
  return (
    <li>
      <button
        type="button"
        onClick={onSelect}
        className="flex w-full items-center gap-3 px-5 py-3 min-h-[44px] text-left outline-none active:bg-cl-bg-secondary transition-colors"
      >
        <span className="flex h-5 w-5 shrink-0 items-center justify-center">
          {active && <Check className="h-4 w-4 text-cl-accent" strokeWidth={2.5} />}
        </span>
        <span
          className={`text-[15px] ${
            active ? "font-semibold text-cl-accent" : "text-cl-text"
          }`}
        >
          {label}
        </span>
      </button>
    </li>
  );
}
