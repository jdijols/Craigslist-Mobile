import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send } from "lucide-react";
import { SPRING_SHEET, OVERLAY_FADE } from "../transitions";

interface ReplySheetProps {
  open: boolean;
  listingTitle: string;
  onSend: (message: string) => void;
  onClose: () => void;
}

export function ReplySheet({ open, listingTitle, onSend, onClose }: ReplySheetProps) {
  const [message, setMessage] = useState(
    `hi, is the ${listingTitle} still available?`
  );

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="reply-backdrop"
            className="absolute inset-0 z-40 bg-black/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={OVERLAY_FADE}
            onClick={onClose}
          />
          <motion.div
            key="reply-sheet"
            className="absolute bottom-0 left-0 right-0 z-50 flex flex-col rounded-t-[--radius-card-lg] bg-cl-surface shadow-lg"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={SPRING_SHEET}
          >
            <div className="mx-auto mt-2 h-1 w-8 rounded-full bg-cl-border" />

            <div className="px-4 pt-3 pb-2">
              <p className="text-[13px] font-semibold text-cl-text">reply</p>
              <p className="mt-0.5 text-[11px] text-cl-text-muted">
                your identity is anonymized to the poster
              </p>
            </div>

            <div className="mx-4 rounded-[--radius-card] border-2 border-cl-border bg-cl-bg-secondary p-3 focus-within:border-cl-accent transition-colors">
              <textarea
                className="w-full resize-none bg-transparent text-base text-cl-text outline-none placeholder:text-cl-text-muted"
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>

            <div className="flex items-center gap-3 px-4 pt-3 pb-6">
              <button
                type="button"
                onClick={() => onSend(message)}
                className="flex flex-1 min-h-[44px] items-center justify-center gap-2 rounded-[--radius-button] bg-cl-accent py-3 shadow-[--shadow-card] active:opacity-90"
              >
                <Send className="h-4 w-4 text-cl-accent-text" />
                <span className="text-[15px] font-semibold text-cl-accent-text">send</span>
              </button>
              <button
                type="button"
                onClick={onClose}
                className="flex min-h-[44px] items-center justify-center rounded-[--radius-button] border border-cl-border bg-cl-surface px-5 py-3 shadow-[--shadow-card] active:opacity-90"
              >
                <span className="text-[15px] font-medium text-cl-text">cancel</span>
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
