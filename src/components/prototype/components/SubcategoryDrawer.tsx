import { useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Check } from "lucide-react";
import { useOverlayPortal } from "../../layout/OverlayPortal";
import { SPRING_SHEET, OVERLAY_FADE } from "../transitions";

interface SubcategoryDrawerProps {
  open: boolean;
  onClose: () => void;
  categoryName: string;
  subcategories: string[];
  activeSubcategory: string | null;
  onSelect: (subcategory: string | null) => void;
}

const DRAWER_WIDTH_PERCENT = 80;

export function SubcategoryDrawer({
  open,
  onClose,
  categoryName,
  subcategories,
  activeSubcategory,
  onSelect,
}: SubcategoryDrawerProps) {
  const portalTarget = useOverlayPortal();

  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  const allLabel = `all ${categoryName.toLowerCase()}`;

  const content = (
    <AnimatePresence>
      {open && (
        <div
          className="absolute inset-0"
          style={{ pointerEvents: "auto" }}
        >
          {/* Overlay covering the left portion */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={OVERLAY_FADE}
            className="absolute inset-0 bg-black/40"
            onClick={onClose}
            aria-label="Close subcategories"
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
            {/* Fixed header — does not scroll */}
            <div className="flex min-h-[44px] shrink-0 items-center px-5 bg-cl-surface">
              <h2 className="text-[15px] font-semibold text-cl-text-muted uppercase tracking-wide">
                {categoryName}
              </h2>
            </div>

            {/* Scrollable subcategories only */}
            <ul className="scrollbar-thin flex-1 min-h-0 overflow-y-auto overscroll-contain pb-8 bg-cl-surface">
              <DrawerItem
                label={allLabel}
                active={activeSubcategory === null}
                onSelect={() => {
                  onSelect(null);
                  onClose();
                }}
              />

              {subcategories.map((sub) => (
                <DrawerItem
                  key={sub}
                  label={sub.toLowerCase()}
                  active={activeSubcategory === sub}
                  onSelect={() => {
                    onSelect(sub);
                    onClose();
                  }}
                />
              ))}
            </ul>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  if (!portalTarget) return content;
  return createPortal(content, portalTarget);
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
