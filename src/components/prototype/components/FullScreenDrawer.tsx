import type { ReactNode } from "react";
import { SheetHeader } from "../../ui/SheetHeader";

export interface FullScreenDrawerProps {
  title: string;
  onClose: () => void;
  closeAriaLabel?: string;
  /** Optional content below the header bar (e.g. search input) */
  headerContent?: ReactNode;
  children: ReactNode;
  /** Optional bottom CTA area (e.g. apply/publish button) */
  bottomSlot?: ReactNode;
}

/**
 * Standard layout for full-screen drawers that slide up from the bottom.
 * Used by CreatePost, LocationPicker, and other sheet-style screens.
 * Provides: safe area filler, header with close, content area, optional bottom slot.
 */
export function FullScreenDrawer({
  title,
  onClose,
  closeAriaLabel = "Close",
  headerContent,
  children,
  bottomSlot,
}: FullScreenDrawerProps) {
  return (
    <div className="flex h-full flex-col bg-cl-surface">
      <div className="shrink-0 border-b-[0.5px] border-cl-border bg-cl-surface">
        <div style={{ height: "var(--safe-area-top)" }} aria-hidden />
        <SheetHeader
          title={title}
          onClose={onClose}
          closeAriaLabel={closeAriaLabel}
        />
        {headerContent != null && (
          <div className="px-4 pb-3 pt-0">{headerContent}</div>
        )}
      </div>

      <div className="flex-1 min-h-0 overflow-hidden">{children}</div>

      {bottomSlot != null && (
        <div className="shrink-0 flex flex-col border-t-[0.5px] border-cl-border bg-cl-surface px-4 pt-3 pb-[34px]">
          {bottomSlot}
        </div>
      )}
    </div>
  );
}
