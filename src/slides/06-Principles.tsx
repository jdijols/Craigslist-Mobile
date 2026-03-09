const principles = [
  {
    metric: "2x",
    metricLabel: "more views with photos",
    title: "Images earn trust",
    description:
      "Photos of real items, posted by real people, are the most powerful signal on CL. Make them large, prominent, and central. When a listing has good photos, the design should let them shine.",
    dataPoints: [
      "Listings with at least one photo get ~2x more views on peer marketplaces (eBay)",
      "Facebook Marketplace passed 1B monthly users with an entirely photo-forward browse experience — CL's #1 competitor won on images",
    ],
    source: "Trust gap (Slide 4), competitive loss to photo-first platforms (Slide 5)",
  },
  {
    metric: "−20%",
    metricLabel: "users lost per extra step",
    title: "Every tap should feel intentional",
    description:
      "Current CL requires too many taps and each one leads somewhere unpredictable. Navigation should be shallow, actions obvious, and the user should always know where they are.",
    dataPoints: [
      "Each additional step in a mobile funnel drops ~20% of users (Baymard Institute)",
    ],
    source: "iOS HIG, buyer friction (Slide 4), Lyft's minimal navigation (Slide 5)",
  },
  {
    metric: "100%",
    metricLabel: "of seller value depends on buyers",
    title: "Serve both sides of the marketplace",
    description:
      "A beautiful listing card serves the buyer (scannable) AND the seller (their item looks appealing). Design decisions should be evaluated from both perspectives. Our four user types guide where we optimize: efficiency for power users, effortless simplicity for casual users.",
    dataPoints: [
      "0% of revenue comes from buyers, but 100% of seller value depends on them",
    ],
    source: "Our Users (Slide 3), business model (Slide 6)",
  },
  {
    metric: "500M",
    metricLabel: "monthly visits, unchanged UI",
    title: "Familiar, not foreign",
    description:
      "The redesign should feel like Craigslist grew up, not like it became a different product. Preserve the simplicity and directness. Discard the datedness.",
    dataPoints: [
      "500M monthly visits despite zero visual updates in ~20 years — the brand has earned loyalty that shouldn't be discarded",
    ],
    source: "Brief's guidance to modernize, not rebrand",
  },
];

export function PrinciplesSlide() {
  return (
    <div className="flex h-full w-full items-center justify-center px-12">
      <div className="w-full max-w-4xl">
        <p className="text-[13px] font-extrabold uppercase tracking-[0.1875rem] text-lf-navy">
          Design Principles
        </p>
        <h2 className="mt-3 font-serif text-4xl text-lf-navy">
          Guiding every decision
        </h2>
        <div className="mt-4 h-px w-16 bg-lf-blue/25" />

        <div className="mt-10 grid grid-cols-2 gap-6">
          {principles.map((p) => (
            <div
              key={p.metric}
              className="rounded-[1.5rem] border border-slide-border bg-slide-surface p-6 shadow-card"
            >
              <div className="flex items-start gap-4">
                <div className="shrink-0 text-center">
                  <span className="block font-serif text-3xl font-bold leading-none text-lf-blue">
                    {p.metric}
                  </span>
                  <span className="mt-1 block max-w-[5rem] text-[9px] leading-tight text-lf-secondary">
                    {p.metricLabel}
                  </span>
                </div>
                <div className="min-w-0">
                  <h3 className="text-lg font-bold text-lf-navy">
                    "{p.title}"
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-lf-body">
                    {p.description}
                  </p>
                  <div className="mt-3 space-y-1.5">
                    {p.dataPoints.map((dp) => (
                      <div key={dp} className="flex items-start gap-1.5">
                        <span className="mt-[5px] h-1 w-1 shrink-0 rounded-full bg-lf-blue/50" />
                        <p className="text-[10px] leading-snug text-lf-secondary">
                          {dp}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
