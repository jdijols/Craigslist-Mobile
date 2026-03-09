import type { PrototypeStep } from "@/components/prototype";

function MapExploreText() {
  return (
    <>
      <p className="text-[13px] font-extrabold uppercase tracking-[0.1875rem] text-lf-navy">
        Journey 2 &mdash; Scoping a New City
      </p>
      <h2 className="mt-3 font-serif text-4xl text-lf-navy">
        Exploring the Map
      </h2>
      <div className="mt-4 h-px w-16 bg-lf-blue/25" />
      <p className="mt-4 text-sm text-lf-body">
        A user relocating to Minneapolis wants to understand rent prices
        by neighborhood. They tap Housing on Home, then switch to the map
        view — no specific listing in mind, just spatial context.
      </p>
      <div className="mt-4 rounded-xl bg-lf-blue-bg px-4 py-3">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-lf-blue">
          Who this serves
        </p>
        <p className="mt-1 text-xs leading-relaxed text-lf-body">
          The <strong>Buyer without Intent</strong>: browsing geographically,
          comparing neighborhoods, building a mental model of the market before
          committing to a viewing.
        </p>
      </div>

      <div className="mt-8 space-y-5">
        {[
          {
            title: "Pins and clusters",
            detail:
              "Individual listings show as pins; dense areas group into numbered clusters. Tapping a pin reveals a callout with price and photo — enough to decide whether to drill in.",
            tag: "Discovery",
          },
          {
            title: "Spatial browsing",
            detail:
              "Map view lets users compare neighborhoods at a glance — something text-list Craigslist fundamentally cannot offer. It turns the feed into geography.",
            tag: "Engagement",
          },
        ].map((a) => (
          <div key={a.title} className="border-l-2 border-lf-blue/25 pl-4">
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-bold text-lf-navy">{a.title}</h4>
              <span className="rounded-full bg-lf-blue-bg px-2 py-0.5 text-[10px] font-semibold text-lf-blue">
                {a.tag}
              </span>
            </div>
            <p className="mt-1 text-xs leading-relaxed text-lf-body">
              {a.detail}
            </p>
          </div>
        ))}
      </div>
    </>
  );
}

function HousingDetailText() {
  return (
    <>
      <p className="text-[13px] font-extrabold uppercase tracking-[0.1875rem] text-lf-navy">
        Journey 2 &rsaquo; Detail
      </p>
      <h2 className="mt-3 font-serif text-4xl text-lf-navy">
        The Apartment Listing
      </h2>
      <div className="mt-4 h-px w-16 bg-lf-blue/25" />
      <p className="mt-4 text-sm text-lf-body">
        Tapping a pin opens the listing detail — the same Post Detail screen,
        adapted for housing. Monthly rent replaces a one-time price, and the
        description surfaces move-in details.
      </p>
      <div className="mt-6 space-y-5">
        <div className="border-l-2 border-lf-blue/25 pl-4">
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-bold text-lf-navy">
              One component, many categories
            </h4>
            <span className="rounded-full bg-lf-blue-bg px-2 py-0.5 text-[10px] font-semibold text-lf-blue">
              System
            </span>
          </div>
          <p className="mt-1 text-xs leading-relaxed text-lf-body">
            Post Detail adapts its content to the listing category. The layout
            stays the same — photo, price, seller, reply CTA — but the
            contextual details change. One pattern, every vertical.
          </p>
        </div>
        <div className="border-l-2 border-lf-blue/25 pl-4">
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-bold text-lf-navy">
              Reply converts to inquiry
            </h4>
            <span className="rounded-full bg-lf-blue-bg px-2 py-0.5 text-[10px] font-semibold text-lf-blue">
              Conversion
            </span>
          </div>
          <p className="mt-1 text-xs leading-relaxed text-lf-body">
            The sticky Reply CTA works identically for housing — the buyer
            composes a message, the landlord receives it anonymized. The
            conversion action is universal across categories.
          </p>
        </div>
      </div>
    </>
  );
}

export const mapHousingSteps: PrototypeStep[] = [
  {
    screen: "home",
    text: <MapExploreText />,
    homeCategory: "housing",
    homeSubcategory: "apartments / housing for rent",
    homeViewMode: "map",
  },
  { screen: "post-detail", text: <HousingDetailText />, postDetailVariant: "apartment" },
];
