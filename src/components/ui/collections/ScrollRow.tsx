interface ScrollRowProps {
  children: React.ReactNode;
  gap?: string;
}

export function ScrollRow({ children, gap = "gap-3" }: ScrollRowProps) {
  return (
    <div
      className={`flex overflow-x-auto overflow-y-hidden overscroll-x-contain pl-4 pr-4 scrollbar-none ${gap}`}
    >
      {children}
    </div>
  );
}
