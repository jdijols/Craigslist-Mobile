import type { ReactNode } from "react";

interface ResultsCaptionProps {
  children: ReactNode;
}

export function ResultsCaption({ children }: ResultsCaptionProps) {
  return (
    <p className="text-center text-[13px] font-medium text-cl-text py-2">
      {children}
    </p>
  );
}
