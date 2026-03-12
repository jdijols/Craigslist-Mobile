import { Home, Star, Plus, MessageCircle, User } from "lucide-react";
import type { ScreenId } from "./types";

const tabs = [
  { id: "home", label: "home", icon: Home, screen: "home" as ScreenId },
  { id: "favorites", label: "favorites", icon: Star, screen: "saved" as ScreenId },
  { id: "post", label: "post", icon: Plus, screen: "create-post" as ScreenId },
  { id: "chats", label: "chats", icon: MessageCircle, screen: "chat" as ScreenId },
  { id: "account", label: "account", icon: User, screen: "my-listings" as ScreenId },
];

interface TabBarProps {
  activeTab: string;
  onNavigate?: (screen: ScreenId) => void;
}

export function TabBar({ activeTab, onNavigate }: TabBarProps) {
  return (
    <div className="absolute bottom-0 left-0 right-0 z-30 flex h-[72px] border-t-[0.5px] border-cl-border bg-cl-surface pb-[21px]">
      {tabs.map((tab) => {
        const active = tab.id === activeTab;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onNavigate?.(tab.screen)}
            className="flex flex-1 cursor-pointer flex-col items-center justify-center gap-0.5 outline-none"
            aria-label={tab.label}
          >
            <div className="flex h-6 w-6 shrink-0 items-center justify-center overflow-hidden">
              <tab.icon
                className={`h-6 w-6 transition-colors duration-150 ${
                  active ? "text-cl-purple-light" : "text-cl-text"
                }`}
                strokeWidth={1.8}
                fill={active ? "currentColor" : "none"}
              />
            </div>
            <span
              className={`text-[11px] font-semibold leading-none whitespace-nowrap transition-colors duration-150 ${
                active ? "text-cl-purple-light" : "text-cl-text"
              }`}
            >
              {tab.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
