import { Check, ArrowUpRight } from "lucide-react";

const kept = [
  {
    item: 'The lowercase "craigslist" wordmark',
    reason:
      "Iconic. No user need or KPI improves by changing it.",
  },
  {
    item: "Purple as the primary brand color",
    reason:
      "Distinctive and owned. In a market where every competitor uses blue or white, purple is a differentiator.",
  },
  {
    item: "The minimalist, no-nonsense tone",
    reason:
      "CL's stripped-down voice is trusted because it doesn't feel like marketing.",
  },
  {
    item: "No ads, no visual clutter",
    reason:
      "CL's clean aesthetic is a competitive advantage vs. ad-heavy competitors.",
  },
];

const changed = [
  {
    item: "Typography scale",
    what: "Clear Display / Title / Body / Caption scale using the platform's native type system.",
    why: "CL has no type hierarchy. Users can't scan or distinguish headings from body.",
    kpi: "Scan speed → faster time-to-tap → browse-to-detail conversion",
  },
  {
    item: "Image sizing & prominence",
    what: "Listing photos larger, edge-to-edge, primary visual on every card and detail view.",
    why: "Trust. Buyers decide in milliseconds based on photos. CL's tiny thumbnails fail this test.",
    kpi: "Trust perception → browse-to-contact conversion",
  },
  {
    item: "Touch target sizing",
    what: "All interactive elements meet iOS minimum 44pt touch targets.",
    why: "CL uses text links as navigation — small, hard to tap.",
    kpi: "Error rate → task completion → user satisfaction",
  },
  {
    item: "Card-based layout system",
    what: "Replace text lists with card components with clear boundaries and whitespace.",
    why: "Cards create visual separation. Sellers' listings look more professional automatically.",
    kpi: "Listings viewed/session → contact rate → seller satisfaction",
  },
  {
    item: "Warm neutral backgrounds",
    what: "Off-white instead of pure white for background surfaces.",
    why: "Reduces visual fatigue. Warm feel matches CL's community spirit.",
    kpi: "Session duration (retention)",
  },
];

export function BrandEvolutionSlide() {
  return (
    <div className="flex h-full w-full items-center justify-center px-12">
      <div className="w-full max-w-5xl">
        <p className="text-[13px] font-extrabold uppercase tracking-[0.1875rem] text-lf-navy">
          Brand Authenticity
        </p>
        <h2 className="mt-3 font-serif text-4xl text-lf-navy">
          If it ain't broke, don't fix it
        </h2>
        <div className="mt-4 h-px w-16 bg-lf-blue/25" />

        <div className="mt-8 grid grid-cols-2 gap-8">
          {/* Left: What we kept */}
          <div>
            <h3 className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-lf-secondary">
              <Check className="h-3.5 w-3.5 text-lf-green" />
              What we kept
            </h3>
            <div className="mt-4 space-y-3">
              {kept.map((k) => (
                <div
                  key={k.item}
                  className="rounded-xl border border-slide-border bg-slide-surface p-4"
                >
                  <p className="text-sm font-semibold text-lf-navy">{k.item}</p>
                  <p className="mt-1 text-xs text-lf-secondary">{k.reason}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right: What we changed */}
          <div>
            <h3 className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-lf-secondary">
              <ArrowUpRight className="h-3.5 w-3.5 text-lf-blue" />
              What we changed (and the KPI behind each)
            </h3>
            <div className="mt-4 space-y-3">
              {changed.map((c) => (
                <div
                  key={c.item}
                  className="rounded-xl border border-slide-border bg-slide-surface p-4"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-lf-navy">
                      {c.item}
                    </p>
                    <span className="shrink-0 rounded-full bg-lf-blue-bg px-2 py-0.5 text-[9px] font-semibold text-lf-blue">
                      {c.kpi.split("→")[0].trim()}
                    </span>
                  </div>
                  <p className="mt-1 text-[11px] text-lf-body">{c.why}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
