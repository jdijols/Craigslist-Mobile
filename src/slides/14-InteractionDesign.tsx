import {
  Search,
  ChevronRight,
  GripHorizontal,
  SlidersHorizontal,
  Smartphone,
  Hand,
  ArrowDown,
  Vibrate,
  Layers,
} from "lucide-react";

function MiniPhone({
  children,
  label,
}: {
  children: React.ReactNode;
  label?: string;
}) {
  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className="h-20 w-10 rounded-lg border-2 border-lf-navy/15 bg-slide-surface overflow-hidden flex flex-col">
        {children}
      </div>
      {label && (
        <span className="text-[8px] text-lf-secondary">{label}</span>
      )}
    </div>
  );
}

const interactions = [
  {
    icon: Search,
    gesture: "Search Bar Expand",
    description:
      "Search bar morphs from collapsed Home state to full-screen overlay. Background dims with spring animation.",
    screens: "Home → Search",
    pattern: "iOS shared element transition",
    diagram: (
      <div className="flex items-center gap-2">
        <MiniPhone label="Home">
          <div className="mt-3 mx-1 h-2 rounded-full bg-lf-blue/15" />
          <div className="mx-1 mt-1.5 grid grid-cols-3 gap-0.5">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-2 rounded-sm bg-lf-border" />
            ))}
          </div>
        </MiniPhone>
        <ChevronRight className="h-3 w-3 text-lf-blue" />
        <MiniPhone label="Search">
          <div className="mt-3 mx-1 h-2.5 rounded-full bg-lf-blue/30 ring-1 ring-lf-blue/20" />
          <div className="mx-1 mt-1 space-y-0.5">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-1 rounded-sm bg-lf-border/60" />
            ))}
          </div>
        </MiniPhone>
      </div>
    ),
  },
  {
    icon: ChevronRight,
    gesture: "iOS Push Navigation",
    description:
      "Standard iOS push: new screen slides from right, previous slides left and dims. Back gesture from left edge.",
    screens: "All screen transitions",
    pattern: "UINavigationController push/pop",
    diagram: (
      <div className="flex items-center gap-2">
        <MiniPhone label="Browse">
          <div className="mt-3 mx-1 space-y-1">
            {[1, 2, 3].map((n) => (
              <div key={n} className="flex gap-0.5">
                <div className="h-3 w-3 rounded-sm bg-lf-border" />
                <div className="flex-1 h-3 rounded-sm bg-lf-border/50" />
              </div>
            ))}
          </div>
        </MiniPhone>
        <div className="flex flex-col items-center gap-0.5">
          <ChevronRight className="h-3 w-3 text-lf-blue" />
          <span className="text-[6px] text-lf-secondary">slide</span>
        </div>
        <MiniPhone label="Detail">
          <div className="mt-3 mx-0.5 h-6 rounded-sm bg-lf-blue/10" />
          <div className="mx-1 mt-1 space-y-0.5">
            <div className="h-1.5 w-4 rounded-sm bg-lf-blue/20" />
            <div className="h-1 rounded-sm bg-lf-border/50" />
          </div>
        </MiniPhone>
      </div>
    ),
  },
  {
    icon: GripHorizontal,
    gesture: "Image Carousel Swipe",
    description:
      "Horizontal drag with momentum and snap-to-page. Pagination dots sync with position. Physics-based feel.",
    screens: "Post Details",
    pattern: "UIPageViewController + UIPanGesture",
    diagram: (
      <div className="flex flex-col items-center gap-1.5">
        <div className="flex items-center gap-1">
          <div className="h-10 w-12 rounded-lg bg-lf-blue/8 border border-lf-blue/10 flex items-center justify-center">
            <span className="text-[7px] text-lf-secondary">← swipe →</span>
          </div>
        </div>
        <div className="flex gap-1">
          {[0, 1, 2, 3].map((d) => (
            <div
              key={d}
              className={`rounded-full ${d === 0 ? "h-1.5 w-3 bg-lf-blue" : "h-1.5 w-1.5 bg-lf-border"}`}
            />
          ))}
        </div>
      </div>
    ),
  },
  {
    icon: SlidersHorizontal,
    gesture: "Chip Filtering",
    description:
      "Tapping a chip filters the grid with smooth layout animation. Cards reflow naturally as items enter/exit.",
    screens: "Browse Category",
    pattern: "UICollectionView animated batch update",
    diagram: (
      <div className="flex flex-col items-center gap-1.5">
        <div className="flex gap-1">
          {["All", "Furn.", "Elec."].map((c, i) => (
            <span
              key={c}
              className={`rounded-full px-1.5 py-0.5 text-[6px] ${
                i === 1
                  ? "bg-lf-blue text-white"
                  : "bg-lf-border/50 text-lf-secondary"
              }`}
            >
              {c}
            </span>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-0.5">
          {[1, 2, 3, 4].map((n) => (
            <div
              key={n}
              className={`h-3 w-5 rounded-sm ${n > 2 ? "bg-lf-border/30" : "bg-lf-blue/10"}`}
            />
          ))}
        </div>
      </div>
    ),
  },
  {
    icon: Smartphone,
    gesture: "Tab Bar Switching",
    description:
      "Active icon fills, inactive outlines. Content crossfades — tab switches are lateral, not hierarchical. No push animation.",
    screens: "Global navigation",
    pattern: "UITabBarController crossfade",
    diagram: (
      <div className="flex flex-col items-center gap-1">
        <div className="h-8 w-14 rounded-md bg-lf-border/20" />
        <div className="flex items-end gap-1 rounded-md bg-lf-border/15 px-1.5 py-0.5">
          {[false, true, false, false].map((active, i) => (
            <div
              key={i}
              className={`h-1.5 w-1.5 rounded-full ${active ? "bg-lf-blue" : "bg-lf-border"}`}
            />
          ))}
        </div>
      </div>
    ),
  },
  {
    icon: ArrowDown,
    gesture: "Bottom Sheet Filters",
    description:
      "iOS-style modal sheet for price, distance, and sort. Drag-to-dismiss with velocity detection. Detent support.",
    screens: "Browse, Search",
    pattern: "UISheetPresentationController",
    diagram: (
      <div className="flex flex-col items-center gap-1">
        <div className="relative h-12 w-12 rounded-md bg-lf-border/15 overflow-hidden">
          <div className="absolute bottom-0 left-0 right-0 h-7 rounded-t-lg bg-slide-surface border-t border-lf-border shadow-sm">
            <div className="mx-auto mt-1 h-0.5 w-4 rounded-full bg-lf-border" />
            <div className="mx-1.5 mt-1 space-y-0.5">
              <div className="h-1 rounded-sm bg-lf-border/60" />
              <div className="h-1 w-3/4 rounded-sm bg-lf-border/40" />
            </div>
          </div>
        </div>
      </div>
    ),
  },
];

const nativeOnly = [
  {
    icon: ArrowDown,
    gesture: "Pull to Refresh",
    detail:
      "iOS spring animation on overscroll. Content refreshes with haptic confirmation.",
    api: "UIRefreshControl",
  },
  {
    icon: Vibrate,
    gesture: "Haptic Feedback",
    detail:
      "Light impact on chip taps, save actions, tab switches. Selection haptic on filter changes.",
    api: "UIImpactFeedbackGenerator",
  },
  {
    icon: Layers,
    gesture: "Shared Element Transition",
    detail:
      "Card image morphs into carousel hero on detail open. Zoom + position interpolation.",
    api: "UIViewControllerAnimatedTransitioning",
  },
  {
    icon: Hand,
    gesture: "Interactive Back Swipe",
    detail:
      "Edge swipe from left to pop. Progress tracks finger position with parallax on the underlying view.",
    api: "UIPercentDrivenInteractiveTransition",
  },
];

export function InteractionDesignSlide() {
  return (
    <div className="flex h-full w-full items-center justify-center px-12">
      <div className="w-full max-w-5xl">
        <p className="text-[13px] font-extrabold uppercase tracking-[0.1875rem] text-lf-navy">
          Interaction Design
        </p>
        <h2 className="mt-3 font-serif text-4xl text-lf-navy">
          Native iOS gestures &amp; transitions
        </h2>
        <div className="mt-4 h-px w-16 bg-lf-blue/25" />

        <div className="mt-7 grid grid-cols-3 gap-3">
          {interactions.map((item) => (
            <div
              key={item.gesture}
              className="rounded-[1.5rem] border border-slide-border bg-slide-surface p-4 shadow-card"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-lf-blue-bg">
                    <item.icon className="h-3.5 w-3.5 text-lf-blue" />
                  </div>
                  <h3 className="text-xs font-bold text-lf-navy">
                    {item.gesture}
                  </h3>
                </div>
              </div>
              <div className="mt-3 flex justify-center">
                {item.diagram}
              </div>
              <p className="mt-3 text-[10px] leading-snug text-lf-body">
                {item.description}
              </p>
              <div className="mt-2 flex items-center justify-between">
                <span className="rounded-full bg-lf-blue-bg px-2 py-0.5 text-[8px] font-semibold text-lf-blue">
                  {item.screens}
                </span>
                <span className="text-[8px] text-lf-secondary">
                  {item.pattern}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-5">
          <p className="mb-2 text-[10px] font-extrabold uppercase tracking-wider text-lf-secondary">
            Native-only (described for production)
          </p>
          <div className="grid grid-cols-4 gap-3">
            {nativeOnly.map((item) => (
              <div
                key={item.gesture}
                className="rounded-xl border border-dashed border-slide-border bg-slide-surface/60 p-3"
              >
                <div className="flex items-center gap-1.5">
                  <item.icon className="h-3 w-3 text-lf-secondary" />
                  <h4 className="text-[10px] font-semibold text-lf-navy">
                    {item.gesture}
                  </h4>
                </div>
                <p className="mt-1.5 text-[9px] leading-snug text-lf-secondary">
                  {item.detail}
                </p>
                <p className="mt-1.5 rounded bg-lf-pill-bg px-1.5 py-0.5 text-[7px] font-mono text-lf-secondary inline-block">
                  {item.api}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
