import { useEffect, useRef, useState } from "react";

interface EndOfFeedProps {
  count?: number;
  label?: string;
  message?: string;
}

function SkeletonRow({ opacity, delay }: { opacity: string; delay: string }) {
  return (
    <div
      className={`flex items-center gap-3 px-3 py-2 transition-opacity duration-700 ${opacity}`}
      style={{ transitionDelay: delay }}
    >
      <div className="h-10 w-10 shrink-0 rounded-[--radius-card] bg-cl-border/40" />
      <div className="flex-1 space-y-2">
        <div className="h-3 w-3/4 rounded bg-cl-border/40" />
        <div className="h-2.5 w-1/2 rounded bg-cl-border/30" />
      </div>
    </div>
  );
}

export function EndOfFeed({ count, label = "for sale", message = "that's everything nearby" }: EndOfFeedProps) {
  const [phase, setPhase] = useState<"idle" | "skeletons" | "message">("idle");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setPhase("skeletons");
          observer.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (phase !== "skeletons") return;
    const timer = setTimeout(() => setPhase("message"), 1400);
    return () => clearTimeout(timer);
  }, [phase]);

  const showSkeletons = phase === "skeletons";
  const showMessage = phase === "message";

  return (
    <div ref={ref} className="flex min-h-[12vh] flex-col">
      {/* skeleton cards that fade out */}
      <div
        className={`space-y-0.5 overflow-hidden transition-all duration-700 ease-out ${
          showMessage ? "max-h-0 opacity-0" : "max-h-32 opacity-100"
        }`}
      >
        <SkeletonRow
          opacity={showSkeletons ? "opacity-60" : "opacity-0"}
          delay="0ms"
        />
        <SkeletonRow
          opacity={showSkeletons ? "opacity-35" : "opacity-0"}
          delay="150ms"
        />
        <SkeletonRow
          opacity={showSkeletons ? "opacity-15" : "opacity-0"}
          delay="300ms"
        />
      </div>

      {/* end-of-feed message — vertically centered in remaining space */}
      <div
        className={`flex flex-1 flex-col items-center justify-center gap-1.5 text-center transition-opacity duration-500 ${
          showMessage
            ? "opacity-100 delay-200"
            : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="flex items-center gap-2 text-cl-text-muted">
          <div className="h-px w-8 bg-cl-border" />
          <span className="text-[12px] tracking-wide">{message}</span>
          <div className="h-px w-8 bg-cl-border" />
        </div>

        {count != null && (
          <p className="text-[11px] text-cl-purple">
            you browsed {count} listings in {label}
          </p>
        )}
      </div>
    </div>
  );
}
