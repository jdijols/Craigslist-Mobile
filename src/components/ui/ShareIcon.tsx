/**
 * Share icon matching the overlay button (upload-from-box style).
 * Use this instead of Lucide Share2 for consistent share affordance.
 */
interface ShareIconProps {
  className?: string;
}

export function ShareIcon({ className = "h-5 w-5 text-cl-text shrink-0" }: ShareIconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M12 3v12" />
      <path d="M8 7l4-4 4 4" />
      <path d="M7 10H5v11h14V10h-2" />
    </svg>
  );
}
