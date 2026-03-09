import { MessageCircle, Search } from "lucide-react";
import type { ScreenId } from "../types";
import { useChatThreads } from "../../../data/chats";
import type { ChatThread as ChatThreadData } from "../../../data/chats";

interface ChatsScreenProps {
  onNavigate?: (screen: ScreenId) => void;
  onOpenThread?: (thread: ChatThreadData) => void;
}

export function ChatsScreen({ onNavigate, onOpenThread }: ChatsScreenProps) {
  const threads = useChatThreads();
  const hasThreads = threads.length > 0;

  return (
    <div className="flex h-full flex-col">
      <div className="flex h-header-bar items-center border-b-[0.5px] border-cl-border bg-cl-surface px-4">
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

      {hasThreads ? (
        <div className="flex-1 overflow-y-auto overscroll-contain scrollbar-none">
          {threads.map((thread) => (
            <button
              key={thread.id}
              type="button"
              className="flex w-full items-center gap-3 border-b-[0.5px] border-cl-border px-4 py-3 text-left outline-none active:bg-cl-bg-secondary"
              onClick={() => onOpenThread?.(thread)}
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[--radius-card] bg-cl-accent/10">
                <span className="text-[13px] font-bold text-cl-accent">
                  {thread.posterInitial}
                </span>
              </div>
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
                <p className="mt-0.5 text-[11px] text-cl-text-muted truncate">
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
                <div className="h-2.5 w-2.5 shrink-0 rounded-full bg-cl-accent" />
              )}
            </button>
          ))}
        </div>
      ) : (
        <div className="flex flex-1 flex-col items-center px-6 pt-32">
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
  );
}
