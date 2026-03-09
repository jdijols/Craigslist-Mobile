const benchmarks = [
  {
    app: "Airbnb",
    color: "#FF5A5F",
    patterns: [
      "Search-forward home screen — search is the hero element",
      "Image-first listing cards with generous sizing",
      "Horizontally scrollable category chips for one-tap filtering",
    ],
    relevance:
      "CL's home is a text wall. Airbnb proves that search prominence + visual cards + chip-based filtering dramatically improve discovery.",
  },
  {
    app: "FB Marketplace",
    color: "#0866FF",
    patterns: [
      "Full-screen modal for structured listing creation with publish CTA",
      "Photo/video-first upload with clear media counts",
      "Category-driven browsing with hyper-local relevance",
    ],
    relevance:
      "CL's closest direct competitor. Marketplace proves that structured listing forms, media-first uploads, and local filtering drive engagement in peer-to-peer commerce.",
  },
  {
    app: "eBay",
    color: "#86B817",
    patterns: [
      "Predictive type-ahead search with real-time suggestions as you type",
      "Layered filter & sort controls that refine results without full reloads",
      "Persistent saved searches with push alerts for new matches",
    ],
    relevance:
      "CL's search is bare-bones. eBay demonstrates how predictive search, smart filtering, and saved-search alerts keep buyers engaged and accelerate transactions across high-volume marketplaces.",
  },
  {
    app: "Zillow",
    color: "#006AFF",
    patterns: [
      "Rich listing detail pages with structured data, galleries, and neighborhood context",
      "Interactive map-first browsing with boundary overlays and clustering",
      "Seamless transition between list and map views for spatial discovery",
    ],
    relevance:
      "CL housing and rental listings lack spatial context. Zillow proves that map-driven discovery and information-rich detail pages are essential for high-consideration categories that represent major revenue verticals.",
  },
];

const adoptedPatterns = [
  { pattern: "Search-forward home", from: "Airbnb", applied: "Home screen: search bar as hero" },
  { pattern: "Image-first cards", from: "Airbnb", applied: "Browse, Search, Home feed" },
  { pattern: "Category chips", from: "Airbnb", applied: "Browse: subcategory filtering" },
  { pattern: "Full-screen listing creation", from: "Marketplace", applied: "Create Post: structured form flow" },
  { pattern: "Predictive search", from: "eBay", applied: "Search: type-ahead suggestions" },
  { pattern: "Saved searches", from: "eBay", applied: "Search: persistent alerts for new matches" },
  { pattern: "Rich listing detail", from: "Zillow", applied: "Post Detail: structured layout + gallery" },
  { pattern: "Map-based browsing", from: "Zillow", applied: "Housing: interactive map discovery" },
];

export function DesignBenchmarkingSlide() {
  return (
    <div className="flex h-full w-full items-center justify-center px-12">
      <div className="w-full max-w-5xl">
        <p className="text-[13px] font-extrabold uppercase tracking-[0.1875rem] text-lf-navy">
          Design Benchmarking
        </p>
        <h2 className="mt-3 font-serif text-4xl text-lf-navy">
          Learning from the marketplace landscape
        </h2>
        <div className="mt-4 h-px w-16 bg-lf-blue/25" />

        <div className="mt-8 grid grid-cols-4 gap-4">
          {benchmarks.map((b) => (
            <div
              key={b.app}
              className="flex flex-col rounded-[1.5rem] border border-slide-border bg-slide-surface p-5 shadow-card"
            >
              <div className="flex items-center gap-2">
                <div
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: b.color }}
                />
                <h3 className="text-sm font-bold text-lf-navy">{b.app}</h3>
              </div>
              <ul className="mt-4 space-y-1.5">
                {b.patterns.map((p) => (
                  <li
                    key={p}
                    className="flex items-start gap-2 text-[11px] leading-snug text-lf-body"
                  >
                    <span
                      className="mt-1.5 h-1 w-1 shrink-0 rounded-full"
                      style={{ backgroundColor: b.color }}
                    />
                    {p}
                  </li>
                ))}
              </ul>
              <div className="mt-8 border-t border-slide-border pt-5">
                <p className="text-[10px] leading-snug text-lf-secondary">
                  {b.relevance}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6">
          <p className="mb-2 text-[10px] font-extrabold uppercase tracking-wider text-lf-secondary">
            Patterns we're adopting
          </p>
          <div className="flex flex-wrap gap-2">
            {adoptedPatterns.map((p) => (
              <div
                key={p.pattern}
                className="flex items-center gap-2 rounded-full border border-slide-border bg-slide-surface px-3 py-1.5 shadow-sm"
              >
                <span className="text-[10px] font-semibold text-lf-navy">
                  {p.pattern}
                </span>
                <span className="text-[9px] text-lf-secondary">
                  via {p.from}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
