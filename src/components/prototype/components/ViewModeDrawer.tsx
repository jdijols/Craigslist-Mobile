import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Map as MapIcon } from "lucide-react";
import { useOverlayPortal } from "../../layout/OverlayPortal";
import { SheetHeader } from "../../ui/SheetHeader";
import { OVERLAY_FADE } from "../transitions";
import type { ViewMode } from "../../ui/cards/types";

interface ViewModeDrawerProps {
  open: boolean;
  onClose: () => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
}

// ── View-mode icon set ──────────────────────────────────────────────────────
// Shared base so every icon uses the same viewBox, stroke, caps, and joins.

type IconProps = React.SVGProps<SVGSVGElement>;

const ICON_BASE: IconProps = {
  xmlns: "http://www.w3.org/2000/svg",
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
};

export { MapIcon };

function ListViewIcon({ className, ...rest }: IconProps) {
  return (
    <svg className={className} {...ICON_BASE} {...rest}>
      <path d="M4 5h.01" />
      <line x1="9" y1="5" x2="21" y2="5" />
      <path d="M4 12h.01" />
      <line x1="9" y1="12" x2="21" y2="12" />
      <path d="M4 19h.01" />
      <line x1="9" y1="19" x2="21" y2="19" />
    </svg>
  );
}

export function ThumbViewIcon({ className, ...rest }: IconProps) {
  return (
    <svg className={className} {...ICON_BASE} {...rest}>
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <line x1="14" y1="4" x2="21" y2="4" />
      <line x1="14" y1="9" x2="21" y2="9" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <line x1="14" y1="15" x2="21" y2="15" />
      <line x1="14" y1="20" x2="21" y2="20" />
    </svg>
  );
}

function GridViewIcon({ className, ...rest }: IconProps) {
  return (
    <svg className={className} {...ICON_BASE} {...rest}>
      <rect x="3.5" y="1.75" width="7" height="8.75" rx="1" />
      <rect x="13.5" y="1.75" width="7" height="8.75" rx="1" />
      <rect x="3.5" y="13.5" width="7" height="8.75" rx="1" />
      <rect x="13.5" y="13.5" width="7" height="8.75" rx="1" />
    </svg>
  );
}

function GalleryViewIcon({ className, ...rest }: IconProps) {
  return (
    <svg className={className} {...ICON_BASE} {...rest}>
      <rect x="3" y="3" width="18" height="18" rx="1" />
      <circle cx="9" cy="9" r="2" />
      <path d="M3 17l5-4 3 2 4-3 6 5" />
    </svg>
  );
}

type ViewIcon = React.FC<IconProps>;

const viewOptions: { mode: ViewMode; label: string; icon: ViewIcon }[] = [
  { mode: "map", label: "map", icon: MapIcon },
  { mode: "list", label: "list", icon: ListViewIcon },
  { mode: "thumb", label: "thumb", icon: ThumbViewIcon },
  { mode: "grid", label: "grid", icon: GridViewIcon },
  { mode: "gallery", label: "gallery", icon: GalleryViewIcon },
];

export function ViewModeDrawer({
  open,
  onClose,
  viewMode,
  onViewModeChange,
}: ViewModeDrawerProps) {
  const portalTarget = useOverlayPortal();

  const content = (
    <AnimatePresence>
      {open && (
        <div
          className="absolute inset-0"
          style={{ pointerEvents: "auto" }}
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={OVERLAY_FADE}
            className="absolute inset-0 bg-black/30"
          />

          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 400, damping: 35, mass: 0.8 }}
            className="absolute inset-x-0 bottom-0 z-50 rounded-t-[--radius-card-lg] bg-cl-surface shadow-[--shadow-elevated]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col pb-[34px]">
              <SheetHeader
                title="change view"
                onClose={onClose}
                closeAriaLabel="Close change view"
              />

              <div className="space-y-1.5 px-4">
                {viewOptions.map(({ mode, label, icon: Icon }) => {
                  const active = mode === viewMode;
                  return (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => {
                        if (mode !== viewMode) {
                          onViewModeChange(mode);
                          onClose();
                        }
                      }}
                      className="flex w-full items-center gap-3 rounded-[--radius-card] border border-cl-border px-3 py-2.5 min-h-[44px] text-left outline-none active:bg-cl-border transition-colors"
                    >
                      <Icon
                        className={`h-5 w-5 shrink-0 ${active ? "text-cl-accent" : "text-cl-text"}`}
                      />
                      <span
                        className={`flex-1 text-[15px] ${
                          active ? "font-semibold text-cl-accent" : "text-cl-text"
                        }`}
                      >
                        {label}
                      </span>
                      {active && (
                        <Check className="h-4 w-4 shrink-0 text-cl-accent" strokeWidth={2.5} />
                      )}
                    </button>
                  );
                })}
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
