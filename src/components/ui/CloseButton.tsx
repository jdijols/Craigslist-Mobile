import { X } from "lucide-react";

interface CloseButtonProps {
  onClick: () => void;
  "aria-label"?: string;
  className?: string;
}

/**
 * Standard prototype close (X) button. Matches the new post header styling
 * for consistent use in sheets, drawers, and full-screen overlays.
 */
export function CloseButton({
  onClick,
  "aria-label": ariaLabel = "Close",
  className = "",
}: CloseButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      className={`min-h-[44px] min-w-[44px] flex shrink-0 items-center justify-center outline-none ${className}`.trim()}
    >
      <X className="h-6 w-6 text-cl-text" strokeWidth={1.8} />
    </button>
  );
}
