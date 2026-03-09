import type { ReactNode } from "react";
import { TabBar } from "./TabBar";
import { TAB_FOR_SCREEN } from "./types";
import type { ScreenId } from "./types";

interface AppShellProps {
  screen: ScreenId;
  onNavigate?: (screen: ScreenId) => void;
  children: ReactNode;
  hideTabBar?: boolean;
}

export function AppShell({
  screen,
  onNavigate,
  children,
  hideTabBar = false,
}: AppShellProps) {
  const activeTab = TAB_FOR_SCREEN[screen];

  return (
    <div className="relative h-full overflow-hidden bg-cl-bg" style={{ fontFamily: "var(--font-cl-sans)" }}>
      <div className="h-full overflow-hidden">
        {children}
      </div>
      {!hideTabBar && <TabBar activeTab={activeTab} onNavigate={onNavigate} />}
    </div>
  );
}
