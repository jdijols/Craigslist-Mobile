import { useState } from "react";
import { MessageCircle, Search } from "lucide-react";
import type { ScreenId } from "../types";
import { useChatThreads, resetChats } from "../../../data/chats";
import type { ChatThread as ChatThreadData } from "../../../data/chats";
import { ConfirmDialog } from "../components/ConfirmDialog";

interface ChatsScreenProps {
  onNavigate?: (screen: ScreenId) => void;
  onOpenThread?: (thread: ChatThreadData) => void;
}

export function ChatsScreen({ onNavigate, onOpenThread }: ChatsScreenProps) {
  const threads = useChatThreads();
  const hasThreads = threads.length > 0;
  const [confirmResetOpen, setConfirmResetOpen] = useState(false);

  const headerPaddingTop = 44;

  return (
    <div className="relative h-full">
      <div className="absolute top-0 left-0 right-0 z-10 bg-cl-surface border-b-[0.5px] border-cl-border">
        <div style={{ height: "var(--safe-area-top)" }} aria-hidden />
        <div className="flex h-header-bar items-center px-4">
        <span className="text-[17px] font-semibold text-cl-text">chats</span>
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

      <div className="absolute inset-0 flex flex-col">
      {hasThreads ? (
        <div className="flex-1 overflow-y-auto overscroll-contain scrollbar-none pb-[72px]" style={{ paddingTop: `calc(var(--safe-area-top) + ${headerPaddingTop}px)` }}>
          <div className="flex items-center justify-between px-4 py-2">
            <p className="text-left text-[13px] font-medium text-cl-text">
              {threads.length} results
            </p>
            <button
              type="button"
              onClick={() => setConfirmResetOpen(true)}
              className="text-right text-[13px] font-medium text-cl-purple outline-none active:opacity-70"
            >
              reset
            </button>
          </div>
          <div className="space-y-0.5">
            {threads.map((thread) => (
              <button
                key={thread.id}
                type="button"
                className="flex w-full items-center gap-3 bg-cl-surface px-3 py-2.5 text-left outline-none active:bg-cl-bg-secondary"
                onClick={() => onOpenThread?.(thread)}
              >
                {thread.listingImage ? (
                  <img
                    src={thread.listingImage}
                    alt=""
                    className="h-16 w-16 shrink-0 rounded-[--radius-card] object-cover"
                  />
                ) : (
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-[--radius-card] bg-cl-accent/10">
                    <span className="text-[16px] font-bold text-cl-accent">
                      {thread.posterInitial}
                    </span>
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline justify-between gap-2">
                    <span
                      className={`text-[14px] truncate ${
                        thread.unread
                          ? "font-semibold text-cl-text"
                          : "font-medium text-cl-text"
                      }`}
                    >
                      {thread.listingTitle}
                    </span>
                    <span className="shrink-0 text-[11px] text-cl-text-muted">
                      {thread.timestamp}
                    </span>
                  </div>
                  <p className="mt-0.5 text-[12px] text-cl-text-muted truncate">
                    {thread.listingCategory}{thread.listingSubcategory ? ` › ${thread.listingSubcategory}` : ""}
                  </p>
                  <p
                    className={`mt-0.5 text-[12px] truncate ${
                      thread.unread ? "font-medium text-cl-text" : "text-cl-text-muted"
                    }`}
                  >
                    {thread.lastMessage}
                  </p>
                </div>
                {thread.unread && (
                  <div className="flex h-11 w-11 min-h-[44px] min-w-[44px] shrink-0 items-center justify-center">
                    <div className="h-3 w-3 rounded-full bg-cl-accent" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex flex-1 flex-col items-center px-6" style={{ paddingTop: `calc(var(--safe-area-top) + ${headerPaddingTop + 48}px)` }}>
          <div className="flex h-16 w-16 items-center justify-center rounded-[--radius-card-lg] bg-cl-accent/10">
            <MessageCircle className="h-6 w-6 text-cl-accent" strokeWidth={1.8} aria-hidden />
          </div>
          <p className="mt-4 text-[17px] font-semibold text-cl-text">no chats yet</p>
          <p className="mt-1 text-[12px] text-cl-text-muted text-center">
            chat replies to your postings will appear here.
          </p>
        </div>
      )}
      </div>

      <ConfirmDialog
        open={confirmResetOpen}
        onClose={() => setConfirmResetOpen(false)}
        title="reset all chats?"
        message="this action is permanent."
        confirmLabel="reset chats"
        destructive
        onConfirm={() => resetChats()}
      />
    </div>
  );
}
