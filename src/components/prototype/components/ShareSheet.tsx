import { useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useOverlayPortal } from "../../layout/OverlayPortal";
import { SPRING_SHEET, OVERLAY_FADE } from "../transitions";

interface ShareSheetProps {
  open: boolean;
  onClose: () => void;
  /** "search" shows the CL app icon; "post" shows the listing thumbnail */
  variant: "search" | "post";
  title: string;
  image?: string;
}

const CONTACTS = [
  { initials: "J", label: "Jason", color: "#d1d5db" },
  { initials: "A", label: "Adelia", color: "#93c5fd" },
  { initials: "M", label: "Group", color: "#c4b5fd" },
  { initials: "B", label: "Brandon", color: "#a5b4fc" },
];

const APPS = [
  { label: "AirDrop", bg: "bg-gradient-to-b from-sky-400 to-blue-500" },
  { label: "Messages", bg: "bg-gradient-to-b from-green-400 to-green-600" },
  { label: "Mail", bg: "bg-gradient-to-b from-sky-300 to-blue-500" },
  { label: "Notes", bg: "bg-gradient-to-b from-yellow-200 to-yellow-400" },
];

const ACTIONS = [
  { label: "Copy" },
  { label: "Quick Note" },
  { label: "View Less" },
];

export function ShareSheet({
  open,
  onClose,
  variant,
  title,
  image,
}: ShareSheetProps) {
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
        <div className="absolute inset-0 z-50" style={{ pointerEvents: "auto" }}>
          {/* Backdrop */}
          <motion.div
            key="share-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={OVERLAY_FADE}
            className="absolute inset-0 bg-black/40"
            onClick={onClose}
          />

          {/* Sheet */}
          <motion.div
            key="share-sheet"
            className="absolute bottom-0 left-0 right-0 z-50 flex flex-col rounded-t-[14px] bg-[#f2f2f7] shadow-xl"
            style={{ maxHeight: "88%" }}
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={SPRING_SHEET}
          >
            {/* ── Link preview header ── */}
            <div className="flex items-center gap-3 px-4 pt-4 pb-3">
              {variant === "search" ? (
                <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-white shadow-sm">
                  <img
                    src="/assets/cl-icon.png"
                    alt=""
                    className="h-full w-full object-contain"
                  />
                </div>
              ) : (
                <div className="h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-gray-200 shadow-sm">
                  {image ? (
                    <img src={image} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <div className="h-full w-full bg-gray-300" />
                  )}
                </div>
              )}
              <div className="min-w-0 flex-1">
                <p className="truncate text-[13px] font-semibold text-[#1c1c1e]">
                  {title}
                </p>
                <p className="text-[11px] text-[#8e8e93]">
                  minneapolis.craigslist.org
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#e5e5ea] outline-none active:bg-[#d1d1d6]"
                aria-label="Close"
              >
                <X className="h-4 w-4 text-[#8e8e93]" strokeWidth={2.5} />
              </button>
            </div>

            <Divider />

            {/* ── AirDrop contacts row ── */}
            <div className="flex gap-4 overflow-x-auto px-5 py-3 scrollbar-none">
              {CONTACTS.map((c) => (
                <div key={c.label} className="flex w-[68px] shrink-0 flex-col items-center gap-1.5">
                  <div
                    className="flex h-[52px] w-[52px] items-center justify-center rounded-full"
                    style={{ backgroundColor: c.color }}
                  >
                    <span className="text-[18px] font-semibold text-white/90">
                      {c.initials}
                    </span>
                  </div>
                  <span className="w-full truncate text-center text-[10px] text-[#1c1c1e]">
                    {c.label}
                  </span>
                </div>
              ))}
            </div>

            <Divider />

            {/* ── App icons row ── */}
            <div className="flex gap-4 overflow-x-auto px-5 py-3 scrollbar-none">
              {APPS.map((app) => (
                <div key={app.label} className="flex w-[68px] shrink-0 flex-col items-center gap-1.5">
                  <div className={`h-[52px] w-[52px] rounded-[12px] ${app.bg} shadow-sm`} />
                  <span className="w-full truncate text-center text-[10px] text-[#1c1c1e]">
                    {app.label}
                  </span>
                </div>
              ))}
            </div>

            <Divider />

            {/* ── Action icons row ── */}
            <div className="flex gap-4 overflow-x-auto px-5 py-3 scrollbar-none">
              {ACTIONS.map((action) => (
                <div key={action.label} className="flex w-[68px] shrink-0 flex-col items-center gap-1.5">
                  <div className="flex h-[52px] w-[52px] items-center justify-center rounded-[12px] bg-white shadow-sm">
                    <ActionPlaceholder label={action.label} />
                  </div>
                  <span className="w-full truncate text-center text-[10px] text-[#1c1c1e]">
                    {action.label}
                  </span>
                </div>
              ))}
            </div>

            <Divider />

            {/* ── List actions ── */}
            <div className="px-4 pt-1 pb-2">
              <ListAction icon={<ReadingListIcon />} label="Add to Reading List" />
            </div>

            {/* ── Edit actions button ── */}
            <div className="flex justify-center pb-8 pt-2">
              <div className="rounded-full border border-[#c7c7cc] bg-white px-5 py-1.5 shadow-sm">
                <span className="text-[13px] font-medium text-[#1c1c1e]">
                  Edit Actions
                </span>
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

function Divider() {
  return <div className="mx-4 border-t border-[#e5e5ea]" />;
}

function ListAction({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex min-h-[44px] items-center gap-3 px-1 py-2">
      <div className="flex h-6 w-6 shrink-0 items-center justify-center">
        {icon}
      </div>
      <span className="text-[15px] text-[#1c1c1e]">{label}</span>
    </div>
  );
}

function ReadingListIcon() {
  return (
    <svg viewBox="0 0 20 20" className="h-5 w-5" fill="none" stroke="#4b5563" strokeWidth="1.5" strokeLinecap="round" aria-hidden>
      <circle cx="5" cy="10" r="2.5" />
      <circle cx="13" cy="10" r="2.5" />
      <line x1="7.5" y1="10" x2="10.5" y2="10" />
    </svg>
  );
}

function ActionPlaceholder({ label }: { label: string }) {
  switch (label) {
    case "Copy":
      return (
        <svg viewBox="0 0 20 20" className="h-5 w-5" fill="none" stroke="#4b5563" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <rect x="7" y="3" width="9" height="11" rx="1.5" />
          <path d="M4 7v9a1.5 1.5 0 001.5 1.5H13" />
        </svg>
      );
    case "Quick Note":
      return (
        <svg viewBox="0 0 20 20" className="h-5 w-5" fill="none" stroke="#4b5563" strokeWidth="1.5" strokeLinecap="round" aria-hidden>
          <rect x="4" y="3" width="12" height="14" rx="2" />
          <line x1="7" y1="7" x2="13" y2="7" />
          <line x1="7" y1="10" x2="11" y2="10" />
        </svg>
      );
    case "View Less":
      return (
        <svg viewBox="0 0 20 20" className="h-5 w-5" fill="none" stroke="#4b5563" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <polyline points="6 12 10 8 14 12" />
        </svg>
      );
    default:
      return <div className="h-4 w-4 rounded bg-gray-300" />;
  }
}
