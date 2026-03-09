const journeys = [
  {
    name: "The Furnished Move",
    persona: "Buyer with Intent — knows what they want, searches directly",
    steps: [
      "Home",
      'Search "mid-century dresser"',
      "Tap result",
      "Item Detail",
      "Reply",
      "Chat",
    ],
    accent: true,
  },
  {
    name: "Scoping a New City",
    persona: "Buyer without Intent — exploring rent prices, no specific listing in mind",
    steps: [
      "Home",
      "Tap Housing",
      "Explore Map",
      "Tap Pin",
      "Item Detail",
      "Reply",
      "Chat",
    ],
    accent: true,
  },
];

const disabledJourneys = [
  {
    name: "The Career Pivot",
    persona:
      "Hybrid — browsing jobs & gigs, then posting a resume or community ad",
    steps: [
      "Home",
      "Browse Jobs & Gigs",
      "View Listings",
      'Tap "+" Post',
      "Compose Post",
      "Publish",
      "My Listings",
    ],
  },
  {
    name: "The Phone Shop",
    persona: "Commercial Seller — regular poster, manages inventory at scale",
    steps: [
      'Tap "+" Post',
      "Photo-first Creation",
      "Title, Price, Category",
      "Publish",
      "Track in My Listings",
    ],
  },
];

export function UserFlowsSlide() {
  return (
    <div className="flex h-full w-full items-center justify-center px-12">
      <div className="w-full max-w-5xl">
        <p className="text-[13px] font-extrabold uppercase tracking-[0.1875rem] text-lf-navy">
          User Flows
        </p>
        <h2 className="mt-3 font-serif text-4xl text-lf-navy">
          Four users, two journeys, one marketplace
        </h2>
        <div className="mt-4 h-px w-16 bg-lf-blue/25" />
        <p className="mt-4 text-sm text-lf-body">
          Each journey ends in one of the two actions that keep the marketplace
          alive: a <span className="font-semibold text-lf-navy">reply</span>{" "}
          (buyer-side conversion) or a{" "}
          <span className="font-semibold text-lf-navy">post</span> (seller-side
          conversion). The users we defined earlier drive these paths — from
          intent-driven search to open exploration to posting on both sides.
        </p>

        <div className="mt-8 space-y-6">
          {journeys.map((journey) => (
            <div key={journey.name}>
              <div className="mb-3 flex flex-wrap items-baseline gap-2">
                <h3
                  className={`text-sm font-bold ${
                    journey.accent ? "text-lf-blue" : "text-lf-secondary"
                  }`}
                >
                  {journey.name}
                </h3>
                <span className="text-[10px] text-lf-secondary">
                  {journey.persona}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-1.5">
                {journey.steps.map((step, i) => (
                  <div key={step + i} className="flex items-center gap-1.5">
                    <div
                      className={`flex items-center gap-2 rounded-xl border px-3.5 py-2.5 shadow-sm ${
                        journey.accent
                          ? "border-slide-border bg-slide-surface"
                          : "border-dashed border-slide-border bg-slide-surface/60"
                      }`}
                    >
                      <span
                        className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold ${
                          journey.accent
                            ? "bg-lf-blue-bg text-lf-blue"
                            : "bg-lf-pill-bg text-lf-secondary"
                        }`}
                      >
                        {i + 1}
                      </span>
                      <span
                        className={`whitespace-nowrap text-xs font-medium ${
                          journey.accent ? "text-lf-off-black" : "text-lf-secondary"
                        }`}
                      >
                        {step}
                      </span>
                    </div>
                    {i < journey.steps.length - 1 && (
                      <div
                        className={`h-px w-3 shrink-0 ${
                          journey.accent
                            ? "bg-lf-secondary/40"
                            : "bg-lf-secondary/20"
                        }`}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Disabled journeys (lighter treatment) */}
          <div className="border-t border-slide-border pt-6 space-y-6">
            {disabledJourneys.map((journey) => (
              <div key={journey.name}>
                <div className="mb-3 flex flex-wrap items-baseline gap-2">
                  <h3 className="text-sm font-bold text-lf-secondary">
                    {journey.name}
                  </h3>
                  <span className="text-[10px] text-lf-secondary">
                    {journey.persona}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-1.5">
                  {journey.steps.map((step, i) => (
                    <div key={step + i} className="flex items-center gap-1.5">
                      <div className="flex items-center gap-2 rounded-xl border border-dashed border-slide-border bg-slide-surface/60 px-3.5 py-2.5">
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-lf-pill-bg text-[10px] font-bold text-lf-secondary">
                          {i + 1}
                        </span>
                        <span className="whitespace-nowrap text-xs font-medium text-lf-secondary">
                          {step}
                        </span>
                      </div>
                      {i < journey.steps.length - 1 && (
                        <div className="h-px w-3 bg-lf-secondary/20 shrink-0" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
