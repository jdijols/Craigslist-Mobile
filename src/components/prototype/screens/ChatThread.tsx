import { useState, useRef, useEffect } from "react";
import { ChevronLeft, Send } from "lucide-react";
import type { ScreenId } from "../types";
import type { ChatThread as ChatThreadData } from "../../../data/chats";
import { addMessageToThread } from "../../../data/chats";

interface ChatThreadProps {
  thread: ChatThreadData;
  onNavigate?: (screen: ScreenId) => void;
}

export function ChatThread({ thread, onNavigate }: ChatThreadProps) {
  const [draft, setDraft] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [thread.messages.length]);

  const handleSend = () => {
    const text = draft.trim();
    if (!text) return;
    addMessageToThread(thread.id, text);
    setDraft("");
  };

  return (
    <div className="flex h-full flex-col bg-cl-bg-secondary">
      {/* Header */}
      <div className="flex h-header-bar items-center gap-1 border-b-[0.5px] border-cl-border bg-cl-surface px-2">
        <button
          type="button"
          onClick={() => onNavigate?.("chat")}
          className="flex h-11 w-11 min-h-[44px] min-w-[44px] shrink-0 items-center justify-center rounded-[--radius-button] outline-none active:opacity-70"
          aria-label="Back"
        >
          <ChevronLeft className="h-6 w-6 text-cl-accent" strokeWidth={1.8} />
        </button>
        <div className="min-w-0 flex-1">
          <p className="text-[14px] font-semibold text-cl-text truncate">
            {thread.listingTitle}
          </p>
          <p className="text-[10px] text-cl-text-muted truncate">
            {thread.listingCategory}{thread.listingSubcategory ? ` › ${thread.listingSubcategory}` : ""}
          </p>
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto overscroll-contain px-4 py-4 space-y-3 scrollbar-none">
        {thread.messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.fromUser ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[75%] rounded-2xl px-3.5 py-2.5 ${
                msg.fromUser
                  ? "rounded-br-md bg-cl-accent text-white"
                  : "rounded-bl-md bg-cl-surface border border-cl-border text-cl-text"
              }`}
            >
              <p className="text-[14px] leading-relaxed">{msg.text}</p>
              <p
                className={`mt-1 text-[10px] ${
                  msg.fromUser ? "text-white/60" : "text-cl-text-muted"
                }`}
              >
                {msg.timestamp}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Input bar */}
      <div className="flex items-center gap-2 border-t-[0.5px] border-cl-border bg-cl-surface px-4 py-3">
        <div className="flex flex-1 items-center rounded-full border border-cl-border bg-white px-4 min-h-[44px]">
          <input
            type="text"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") handleSend(); }}
            placeholder="message..."
            className="w-full bg-transparent text-[14px] text-black outline-none placeholder:text-cl-text-muted"
          />
        </div>
        <button
          type="button"
          onClick={handleSend}
          className="flex h-11 w-11 min-h-[44px] min-w-[44px] shrink-0 items-center justify-center rounded-full bg-cl-accent shadow-[--shadow-card] active:opacity-90"
        >
          <Send className="h-5 w-5 text-white" />
        </button>
      </div>
    </div>
  );
}
