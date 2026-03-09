import type { PrototypeStep } from "@/components/prototype";

function CategoryBrowseText() {
  return (
    <>
      <p className="text-[13px] font-extrabold uppercase tracking-[0.1875rem] text-lf-navy">
        Capability (b)
      </p>
      <h2 className="mt-3 font-serif text-4xl text-lf-navy">
        Browse Category
      </h2>
      <div className="mt-4 h-px w-16 bg-lf-blue/25" />
      <p className="mt-4 text-sm text-lf-body">
        One level deep, as the brief specifies. The user taps a category on
        Home and lands here.
      </p>
      <div className="mt-4 rounded-xl bg-lf-blue-bg px-4 py-3">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-lf-blue">
          Who this serves
        </p>
        <p className="mt-1 text-xs leading-relaxed text-lf-body">
          <strong>Buyers</strong> scanning with filters and price/distance
          (efficiency for power buyers, visual browse for casual). Every card
          is also a <strong>seller's</strong> listing — serve both sides.
        </p>
      </div>

      <div className="mt-8 space-y-5">
        {[
          {
            title: "Chips instead of nested pages",
            detail:
              "Current CL requires navigating in and out of subcategory pages. Chips keep the user on one screen with one-tap filtering.",
            tag: "Usability",
          },
          {
            title: "Image-forward cards",
            detail:
              "Single biggest upgrade over text-only results. Buyers decide visually in milliseconds. Competitive parity with Marketplace / OfferUp.",
            tag: "Engagement",
          },
          {
            title: "Consistent card component",
            detail:
              'Same ItemCard on Home, Browse, and Search. What helps buyers scan also helps sellers present — "serve both sides."',
            tag: "System",
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

function CategoryToDetailText() {
  return (
    <>
      <p className="text-[13px] font-extrabold uppercase tracking-[0.1875rem] text-lf-navy">
        Capability (b) &rsaquo; Transition
      </p>
      <h2 className="mt-3 font-serif text-4xl text-lf-navy">
        Opening a Listing
      </h2>
      <div className="mt-4 h-px w-16 bg-lf-blue/25" />
      <p className="mt-4 text-sm text-lf-body">
        Tapping a listing card pushes to the full detail view. The card image
        expands to a full-bleed carousel — continuity between the browse card
        and the detail hero builds spatial context.
      </p>
      <div className="mt-6 space-y-5">
        <div className="border-l-2 border-lf-blue/25 pl-4">
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-bold text-lf-navy">
              Seamless drill-down
            </h4>
            <span className="rounded-full bg-lf-blue-bg px-2 py-0.5 text-[10px] font-semibold text-lf-blue">
              Usability
            </span>
          </div>
          <p className="mt-1 text-xs leading-relaxed text-lf-body">
            Standard iOS push navigation. The tab bar hides on detail to
            maximize content real estate. Back button and edge-swipe return
            to the browse list.
          </p>
        </div>
      </div>
    </>
  );
}

export const categoryBrowseSteps: PrototypeStep[] = [
  { screen: "home", text: <CategoryBrowseText /> },
  { screen: "post-detail", text: <CategoryToDetailText /> },
];
