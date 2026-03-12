import { useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useOverlayPortal } from "../../layout/OverlayPortal";
import { OVERLAY_FADE } from "../transitions";

interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  message: string;
  confirmLabel: string;
  onConfirm: () => void;
  destructive?: boolean;
}

const DIALOG_SPRING = { type: "spring" as const, damping: 32, stiffness: 400 };

export function ConfirmDialog({
  open,
  onClose,
  title,
  message,
  confirmLabel,
  onConfirm,
  destructive = false,
}: ConfirmDialogProps) {
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
          className="absolute inset-0 z-[60] flex items-center justify-center"
          style={{ pointerEvents: "auto" }}
        >
          <motion.div
            key="confirm-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={OVERLAY_FADE}
            className="absolute inset-0 bg-black/40"
            onClick={onClose}
          />

          <motion.div
            key="confirm-dialog"
            className="relative z-10 w-[270px] overflow-hidden rounded-[14px] bg-cl-bg-secondary/95 backdrop-blur-xl shadow-xl"
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.85 }}
            transition={DIALOG_SPRING}
          >
            <div className="px-4 pt-5 pb-4">
              <p className="text-center text-[17px] font-semibold text-cl-text">
                {title}
              </p>
              <p className="mt-1 text-center text-[13px] text-cl-text-muted leading-[18px]">
                {message}
              </p>
            </div>

            <div className="border-t-[0.5px] border-cl-border">
              <button
                type="button"
                onClick={() => {
                  onConfirm();
                  onClose();
                }}
                className={`flex w-full min-h-[44px] items-center justify-center outline-none active:bg-cl-active ${
                  destructive ? "text-cl-destructive" : "text-cl-accent"
                } text-[17px]`}
              >
                {confirmLabel}
              </button>
            </div>

            <div className="border-t-[0.5px] border-cl-border">
              <button
                type="button"
                onClick={onClose}
                className="flex w-full min-h-[44px] items-center justify-center text-[17px] font-semibold text-cl-accent outline-none active:bg-cl-active"
              >
                cancel
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  if (!portalTarget) return content;
  return createPortal(content, portalTarget);
}
