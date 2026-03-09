import { type ReactNode } from "react";
import { CloseButton } from "./CloseButton";

interface SheetHeaderProps {
  title: string;
  onClose: () => void;
  closeAriaLabel?: string;
  /** Optional right-side content (e.g. "1 of 3"). When omitted, a spacer keeps title centered. */
  rightSlot?: ReactNode;
  className?: string;
}

/**
 * Standard prototype sheet/drawer header: close on left, title centered, optional right slot.
 * Uses pl-4 pr-4 so the close button aligns with page content (use px-4 on content for alignment).
 */
export function SheetHeader({
  title,
  onClose,
  closeAriaLabel = "Close",
  rightSlot,
  className = "",
}: SheetHeaderProps) {
  return (
    <div
      className={`flex h-header-bar items-center justify-start gap-3 pl-4 pr-4 ${className}`.trim()}
      role="banner"
    >
      <CloseButton onClick={onClose} aria-label={closeAriaLabel} />
      <span className="flex-1 text-center text-[17px] font-semibold text-cl-text">
        {title}
      </span>
      {rightSlot !== undefined ? rightSlot : <div className="w-11 shrink-0" aria-hidden />}
    </div>
  );
}
