import type { PrototypeStep } from "@/components/prototype";

function HomeScreenText() {
  return (
    <>
      <p className="text-[13px] font-extrabold uppercase tracking-[0.1875rem] text-lf-navy">
        All Journeys Start Here
      </p>
      <h2 className="mt-3 font-serif text-4xl text-lf-navy">Home Screen</h2>
      <div className="mt-4 h-px w-16 bg-lf-blue/25" />
      <p className="mt-4 text-sm text-lf-body">
        The entry point for every user journey: searching for furniture,
        exploring housing on the map, browsing jobs, or posting a listing.
        It surfaces the capabilities without forcing a choice.
      </p>
      <div className="mt-4 rounded-xl bg-lf-blue-bg px-4 py-3">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-lf-blue">
          Who this serves
        </p>
        <p className="mt-1 text-xs leading-relaxed text-lf-body">
          All four user types: Buyer with Intent (search bar), Buyer without
          Intent (categories), and entry to Post for both Private
          and Commercial sellers.
        </p>
      </div>

      <div className="mt-8 space-y-5">
        {[
          {
            title: "Search bar prominence",
            detail:
              "The #1 action on CL is searching. Here it's the first thing you see. Fast access for intent-driven buyers — reduces drop-off.",
            tag: "Conversion",
          },
          {
            title: "Photo-forward card feed",
            detail:
              "Photo-forward cards create browsability CL completely lacks. Gives users a reason to open the app without a specific goal.",
            tag: "Retention",
          },
          {
            title: "Revenue-informed category ordering",
            detail:
              "For Sale and Jobs positioned first — highest traffic and listing fee revenue. Revenue-contributing categories get the most prominent real estate.",
            tag: "Business",
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

function HomeToCategoryText() {
  return (
    <>
      <p className="text-[13px] font-extrabold uppercase tracking-[0.1875rem] text-lf-navy">
        Home Screen &rsaquo; Transition
      </p>
      <h2 className="mt-3 font-serif text-4xl text-lf-navy">
        Into the Category
      </h2>
      <div className="mt-4 h-px w-16 bg-lf-blue/25" />
      <p className="mt-4 text-sm text-lf-body">
        Tapping a category on the Home screen pushes to the browse view.
        The iOS push transition maintains spatial context — the user always
        knows where they came from.
      </p>
      <div className="mt-6 space-y-5">
        <div className="border-l-2 border-lf-blue/25 pl-4">
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-bold text-lf-navy">
              One tap, one level
            </h4>
            <span className="rounded-full bg-lf-blue-bg px-2 py-0.5 text-[10px] font-semibold text-lf-blue">
              Usability
            </span>
          </div>
          <p className="mt-1 text-xs leading-relaxed text-lf-body">
            No multi-level category tree. The brief specifies one level of depth —
            the user picks a top-level category and filters from there.
          </p>
        </div>
      </div>
    </>
  );
}

export const homeScreenSteps: PrototypeStep[] = [
  { screen: "home", text: <HomeScreenText /> },
  { screen: "home", text: <HomeToCategoryText /> },
];
