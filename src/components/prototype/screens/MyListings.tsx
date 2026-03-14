import { useState, useCallback } from "react";
import {
  Pencil,
  RotateCcw,
  Trash2,
  Eye,
  Star,
  MessageSquare,
  Search,
  ChevronRight,
  Settings,
  HelpCircle,
  Bell,
  LogOut,
  Package,
} from "lucide-react";
import { motion } from "framer-motion";
import type { ScreenId } from "../types";
import { ConfirmDialog } from "../components/ConfirmDialog";

interface MyListingsProps {
  onNavigate?: (screen: ScreenId) => void;
}

const sellerListings = [
  {
    title: "standing desk",
    price: "$180",
    views: 47,
    saves: 3,
    replies: 2,
    status: "active" as const,
    img: "https://images.unsplash.com/photo-1625655164399-6e7b172727d3?w=200&h=200&fit=crop&auto=format&q=80",
  },
  {
    title: "vintage table lamp",
    price: "$65",
    views: 23,
    saves: 1,
    replies: 0,
    status: "active" as const,
    img: "https://images.unsplash.com/photo-1696815096343-336a939e7d8f?w=200&h=200&fit=crop&auto=format&q=80",
  },
  {
    title: "ikea bookshelf",
    price: "$45",
    views: 89,
    saves: 5,
    replies: 4,
    status: "active" as const,
    img: "https://images.unsplash.com/photo-1761330439741-3dcf41ee766b?w=200&h=200&fit=crop&auto=format&q=80",
  },
];

function Toast({ message, visible }: { message: string; visible: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: visible ? 1 : 0, y: visible ? 0 : 6 }}
      transition={{ duration: 0.18 }}
      className="pointer-events-none absolute bottom-24 inset-x-0 z-50 flex justify-center"
    >
      <span className="rounded-[--radius-button] bg-cl-text px-3 py-1.5 text-[12px] font-medium text-cl-surface">
        {message}
      </span>
    </motion.div>
  );
}

export function MyListings({ onNavigate }: MyListingsProps) {
  const [toast, setToast] = useState<string | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmConfig, setConfirmConfig] = useState({
    title: "",
    message: "",
    confirmLabel: "",
    destructive: false,
    onConfirm: () => {},
  });

  const showToast = useCallback((message: string) => {
    setToast(message);
    setTimeout(() => setToast(null), 1500);
  }, []);

  const showConfirm = useCallback((config: typeof confirmConfig) => {
    setConfirmConfig(config);
    setConfirmOpen(true);
  }, []);

  const headerPaddingTop = 44;

  return (
    <div className="relative h-full">
      <div className="absolute top-0 left-0 right-0 z-10 bg-cl-surface border-b-[0.5px] border-cl-border">
        <div style={{ height: "var(--safe-area-top)" }} aria-hidden />
        <div className="flex h-header-bar items-center px-4">
        <span className="text-[17px] font-semibold text-cl-text">account</span>
        <div className="flex flex-1 justify-end">
          <button
            type="button"
            onClick={() => onNavigate?.("search")}
            className="flex h-11 w-11 min-h-[44px] min-w-[44px] shrink-0 cursor-pointer items-center justify-center rounded-[--radius-button] outline-none active:opacity-70"
            aria-label="Search"
          >
            <Search className="h-6 w-6 text-cl-text" strokeWidth={1.8} />
          </button>
        </div>
        </div>
      </div>

      <div className="absolute inset-0 overflow-y-auto overscroll-contain overflow-x-hidden pb-24 scrollbar-none" style={{ paddingTop: `calc(var(--safe-area-top) + ${headerPaddingTop}px)` }}>
        {/* Profile section */}
        <div className="flex items-center gap-3.5 px-4 py-5 border-b-[0.5px] border-cl-border">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-cl-accent/10">
            <span className="text-[18px] font-bold text-cl-accent">T</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[17px] font-semibold text-cl-text">trystate</p>
            <p className="mt-0.5 text-[12px] text-cl-text-muted">
              member since 2024 · minneapolis
            </p>
          </div>
          <ChevronRight className="h-4 w-4 shrink-0 text-cl-text-muted" strokeWidth={2.5} aria-hidden />
        </div>

        {/* My posts section */}
        <div className="flex items-baseline justify-between px-4 pt-5 pb-2">
          <span className="text-[11px] font-semibold uppercase tracking-wide text-cl-text-muted">
            my posts
          </span>
          <span className="text-[11px] text-cl-text-muted">
            3 active · 1 expired
          </span>
        </div>

        <div>
          {sellerListings.map((listing) => (
            <button
              key={listing.title}
              type="button"
              className="flex w-full items-center gap-3 border-b-[0.5px] border-cl-border px-4 py-3 text-left outline-none active:bg-cl-bg-secondary"
              onClick={() => showToast("edit coming soon")}
            >
              <img
                src={listing.img}
                alt={listing.title}
                className="h-14 w-14 shrink-0 rounded-[--radius-card] object-cover bg-cl-bg-secondary"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline justify-between gap-2">
                  <span className="text-[14px] font-medium text-cl-text truncate">
                    {listing.title}
                  </span>
                  <span className="shrink-0 text-[14px] font-bold text-cl-price">
                    {listing.price}
                  </span>
                </div>
                <div className="mt-1.5 flex gap-3">
                  <span className="flex items-center gap-1 text-[11px] text-cl-text-muted">
                    <Eye className="h-3.5 w-3.5" strokeWidth={2} aria-hidden />
                    {listing.views}
                  </span>
                  <span className="flex items-center gap-1 text-[11px] text-cl-text-muted">
                    <Star className="h-3.5 w-3.5" strokeWidth={2} aria-hidden />
                    {listing.saves}
                  </span>
                  <span className="flex items-center gap-1 text-[11px] text-cl-text-muted">
                    <MessageSquare className="h-3.5 w-3.5" strokeWidth={2} aria-hidden />
                    {listing.replies}
                  </span>
                </div>
                <div className="mt-1.5 flex gap-1.5">
                  <span
                    className="inline-flex items-center gap-1 rounded-[--radius-button] bg-cl-bg-secondary px-2 py-0.5 text-[10px] font-medium text-cl-text-muted"
                    onClick={(e) => { e.stopPropagation(); showToast("edit coming soon"); }}
                  >
                    <Pencil className="h-3 w-3" strokeWidth={2} aria-hidden /> edit
                  </span>
                  <span
                    className="inline-flex items-center gap-1 rounded-[--radius-button] bg-cl-bg-secondary px-2 py-0.5 text-[10px] font-medium text-cl-text-muted"
                    onClick={(e) => { e.stopPropagation(); showToast("listing renewed"); }}
                  >
                    <RotateCcw className="h-3 w-3" strokeWidth={2} aria-hidden /> renew
                  </span>
                  <span
                    className="inline-flex items-center gap-1 rounded-[--radius-button] bg-cl-bg-secondary px-2 py-0.5 text-[10px] font-medium text-cl-text-muted"
                    onClick={(e) => {
                      e.stopPropagation();
                      showConfirm({
                        title: "remove listing?",
                        message: `"${listing.title}" will be permanently deleted.`,
                        confirmLabel: "remove",
                        destructive: true,
                        onConfirm: () => showToast("listing removed"),
                      });
                    }}
                  >
                    <Trash2 className="h-3 w-3" strokeWidth={2} aria-hidden /> remove
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Settings section */}
        <div className="px-4 pt-5 pb-2">
          <span className="text-[11px] font-semibold uppercase tracking-wide text-cl-text-muted">
            settings
          </span>
        </div>

        <div>
          <SettingsRow icon={Package} label="my drafts" onClick={() => showToast("drafts coming soon")} />
          <SettingsRow icon={Settings} label="preferences" onClick={() => showToast("preferences coming soon")} />
          <SettingsRow icon={Bell} label="notifications" onClick={() => showToast("notifications coming soon")} />
          <SettingsRow icon={HelpCircle} label="help & support" onClick={() => showToast("help & support coming soon")} />
          <button
            type="button"
            onClick={() =>
              showConfirm({
                title: "sign out?",
                message: "you'll need to sign in again to manage your posts.",
                confirmLabel: "sign out",
                destructive: true,
                onConfirm: () => showToast("signed out"),
              })
            }
            className="flex w-full items-center gap-3 border-b-[0.5px] border-cl-border px-4 min-h-[44px] text-left outline-none active:bg-cl-bg-secondary"
          >
            <LogOut className="h-5 w-5 text-cl-destructive" aria-hidden />
            <span className="flex-1 text-[15px] text-cl-destructive">sign out</span>
          </button>
        </div>
      </div>

      <Toast message={toast ?? ""} visible={!!toast} />

      <ConfirmDialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        title={confirmConfig.title}
        message={confirmConfig.message}
        confirmLabel={confirmConfig.confirmLabel}
        onConfirm={confirmConfig.onConfirm}
        destructive={confirmConfig.destructive}
      />
    </div>
  );
}

function SettingsRow({
  icon: Icon,
  label,
  onClick,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-3 border-b-[0.5px] border-cl-border px-4 min-h-[44px] text-left outline-none active:bg-cl-bg-secondary"
    >
      <Icon className="h-5 w-5 text-cl-text-muted" />
      <span className="flex-1 text-[15px] text-cl-text">{label}</span>
      <ChevronRight className="h-4 w-4 text-cl-text-muted" strokeWidth={2.5} aria-hidden />
    </button>
  );
}
