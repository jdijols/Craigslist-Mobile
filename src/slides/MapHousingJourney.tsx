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
        A user relocating to Minneapolis explores rent prices by
        neighborhood. No specific listing — just spatial context.
      </p>
      <div className="mt-4 rounded-xl bg-lf-blue-bg px-4 py-3">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-lf-blue">
          Who this serves
        </p>
        <p className="mt-1 text-xs leading-relaxed text-lf-body">
          <strong>Buyer without Intent</strong>: comparing neighborhoods,
          building a mental model before committing.
        </p>
      </div>

      <div className="mt-8 space-y-5">
        {[
          {
            title: "Dots for listings, favorites at a glance",
            detail:
              "Listings show as easy-to-see dots. Tap for price and photo preview. Favorites are apparent at a glance.",
            tag: "Discovery",
          },
          {
            title: "Spatial browsing",
            detail:
              "Neighborhood comparison at a glance — something text lists can't offer.",
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
        Same Post Detail screen, adapted for housing. Monthly rent replaces
        one-time price.
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
            Same layout across categories — photo, price, seller, reply CTA —
            with contextual details per vertical.
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
            Sticky Reply CTA works identically. Universal conversion action
            across all categories.
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
