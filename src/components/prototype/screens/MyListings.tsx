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
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { ScreenId } from "../types";
import { ConfirmDialog } from "../components/ConfirmDialog";

interface MyListingsProps {
  onNavigate?: (screen: ScreenId) => void;
}

const sellerListings = [
  { title: "standing desk", price: "$180", views: 47, saves: 3, replies: 2, img: "/assets/listing-desk.svg" },
  { title: "vintage table lamp", price: "$65", views: 23, saves: 1, replies: 0, img: "/assets/listing-lamp.svg" },
  { title: "ikea bookshelf", price: "$45", views: 89, saves: 5, replies: 4, img: "/assets/listing-bookshelf.svg" },
];

function Toast({ message, visible }: { message: string; visible: boolean }) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.2 }}
          className="absolute bottom-24 left-1/2 z-50 -translate-x-1/2 rounded-full bg-cl-text/90 px-5 py-2.5 shadow-lg"
        >
          <span className="whitespace-nowrap text-[13px] font-medium text-white">{message}</span>
        </motion.div>
      )}
    </AnimatePresence>
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

  return (
    <div className="relative flex h-full flex-col">
      <div className="flex h-header-bar items-center border-b-[0.5px] border-cl-border bg-cl-surface px-4">
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

      <div className="flex-1 overflow-y-auto overscroll-contain overflow-x-hidden pb-24 scrollbar-none">
        {/* Profile card */}
        <div className="mx-4 mt-4 rounded-[--radius-card] border border-cl-border bg-cl-surface p-4 shadow-[--shadow-card]">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-cl-accent/10">
              <span className="text-[16px] font-bold text-cl-accent">T</span>
            </div>
            <div>
              <p className="text-[15px] font-semibold text-cl-text">trystate</p>
              <p className="text-[12px] text-cl-text-muted">
                member since 2024 · minneapolis
              </p>
            </div>
          </div>
        </div>

        {/* My posts section */}
        <div className="px-4 pt-5 pb-2">
          <span className="text-[11px] font-semibold text-cl-text-muted">
            my posts
          </span>
          <p className="mt-0.5 text-[12px] text-cl-text-muted">
            3 active · 1 expired
          </p>
        </div>

        <div className="mx-4 space-y-2.5">
          {sellerListings.map((listing) => (
            <div
              key={listing.title}
              className="rounded-[--radius-card] border border-cl-border bg-cl-surface overflow-hidden shadow-[--shadow-card]"
            >
              <div className="flex gap-3 p-3">
                <img
                  src={listing.img}
                  alt={listing.title}
                  className="h-16 w-16 shrink-0 rounded-[--radius-card] object-cover"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline justify-between">
                    <span className="text-[13px] font-semibold text-cl-text">
                      {listing.title}
                    </span>
                    <span className="text-[13px] font-bold text-cl-price">
                      {listing.price}
                    </span>
                  </div>
                  <div className="mt-2 flex gap-3">
                    <span className="flex items-center gap-1 text-[11px] text-cl-text-muted">
                      <Eye className="h-4 w-4" strokeWidth={2.5} aria-hidden />
                      {listing.views}
                    </span>
                    <span className="flex items-center gap-1 text-[11px] text-cl-text-muted">
                      <Star className="h-4 w-4" strokeWidth={2.5} aria-hidden />
                      {listing.saves}
                    </span>
                    <span className="flex items-center gap-1 text-[11px] text-cl-text-muted">
                      <MessageSquare className="h-4 w-4" strokeWidth={2.5} aria-hidden />
                      {listing.replies}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2 border-t-[0.5px] border-cl-border px-3 py-2">
                <button
                  type="button"
                  onClick={() => showToast("edit coming soon")}
                  className="flex min-h-[44px] items-center gap-1 rounded-[--radius-button] bg-cl-bg-secondary px-3 py-2 text-[12px] text-cl-text-muted outline-none active:opacity-70"
                >
                  <Pencil className="h-4 w-4" strokeWidth={2.5} aria-hidden /> edit
                </button>
                <button
                  type="button"
                  onClick={() => showToast("listing renewed")}
                  className="flex min-h-[44px] items-center gap-1 rounded-[--radius-button] bg-cl-bg-secondary px-3 py-2 text-[12px] text-cl-text-muted outline-none active:opacity-70"
                >
                  <RotateCcw className="h-4 w-4" strokeWidth={2.5} aria-hidden /> renew
                </button>
                <button
                  type="button"
                  onClick={() =>
                    showConfirm({
                      title: "remove listing?",
                      message: `"${listing.title}" will be permanently deleted.`,
                      confirmLabel: "remove",
                      destructive: true,
                      onConfirm: () => showToast("listing removed"),
                    })
                  }
                  className="flex min-h-[44px] items-center gap-1 rounded-[--radius-button] bg-cl-bg-secondary px-3 py-2 text-[12px] text-cl-text-muted outline-none active:opacity-70"
                >
                  <Trash2 className="h-4 w-4" strokeWidth={2.5} aria-hidden /> remove
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Settings section */}
        <div className="px-4 pt-5 pb-2">
          <span className="text-[11px] font-semibold text-cl-text-muted">
            settings
          </span>
        </div>

        <div className="mx-4 mb-4 rounded-[--radius-card] border border-cl-border bg-cl-surface overflow-hidden shadow-[--shadow-card]">
          <SettingsRow icon={Settings} label="preferences" onClick={() => showToast("preferences coming soon")} />
          <div className="border-t-[0.5px] border-cl-border" />
          <SettingsRow icon={Bell} label="notifications" onClick={() => showToast("notifications coming soon")} />
          <div className="border-t-[0.5px] border-cl-border" />
          <SettingsRow icon={HelpCircle} label="help & support" onClick={() => showToast("help & support coming soon")} />
          <div className="border-t-[0.5px] border-cl-border" />
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
            className="flex w-full items-center gap-3 px-4 min-h-[44px] text-left outline-none active:opacity-70"
          >
            <LogOut className="h-5 w-5 text-cl-destructive" aria-hidden />
            <span className="text-[15px] text-cl-destructive">sign out</span>
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
      className="flex w-full items-center gap-3 px-4 min-h-[44px] text-left outline-none active:opacity-70"
    >
      <Icon className="h-5 w-5 text-cl-text-muted" />
      <span className="flex-1 text-[15px] text-cl-text">{label}</span>
      <ChevronRight className="h-4 w-4 text-cl-text-muted" strokeWidth={2.5} aria-hidden />
    </button>
  );
}
