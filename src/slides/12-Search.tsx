import type { PrototypeStep } from "@/components/prototype";

function SearchText() {
  return (
    <>
      <p className="text-[13px] font-extrabold uppercase tracking-[0.1875rem] text-lf-navy">
        Journey 1 &mdash; The Furnished Move
      </p>
      <h2 className="mt-3 font-serif text-4xl text-lf-navy">Search</h2>
      <div className="mt-4 h-px w-16 bg-lf-blue/25" />
      <p className="mt-4 text-sm text-lf-body">
        A user furnishing their new home searches for "mid-century dresser."
        They know what they want — the app needs to get out of the way
        and deliver results fast.
      </p>
      <div className="mt-4 rounded-xl bg-lf-blue-bg px-4 py-3">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-lf-blue">
          Who this serves
        </p>
        <p className="mt-1 text-xs leading-relaxed text-lf-body">
          The <strong>Buyer with Intent</strong>: precise search, filters, and
          repeat queries. Suggested categories and recent searches also support
          casual buyers who open search without a specific term.
        </p>
      </div>

      <div className="mt-8 space-y-5">
        {[
          {
            title: "Recent searches + suggested categories",
            detail:
              "Recent searches acknowledge that users repeat queries (checking for new listings). Suggested categories help users who open search without a specific term.",
            tag: "Retention",
          },
          {
            title: "Cross-category results",
            detail:
              'A query for "desk" surfaces results from Furniture, Free, and Services. Broadest possible view — search intent shouldn\'t be artificially constrained.',
            tag: "Discovery",
          },
          {
            title: "Shared card layout with Browse",
            detail:
              "Visual consistency — users learn one scanning pattern. The difference between browse and search is the entry point, not the output.",
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

export const searchSteps: PrototypeStep[] = [
  { screen: "search", text: <SearchText /> },
];
