interface ThumbGridProps {
  children: React.ReactNode;
}

export function ThumbGrid({ children }: ThumbGridProps) {
  return (
    <div className="grid grid-cols-2 gap-0.5">
      {children}
    </div>
  );
}
