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
        User searches "mid-century dresser." They know what they want —
        the app gets out of the way.
      </p>
      <div className="mt-4 rounded-xl bg-lf-blue-bg px-4 py-3">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-lf-blue">
          Who this serves
        </p>
        <p className="mt-1 text-xs leading-relaxed text-lf-body">
          <strong>Buyer with Intent</strong>: precise search and filters.
          Suggested categories also help casual browsers.
        </p>
      </div>

      <div className="mt-8 space-y-5">
        {[
          {
            title: "Recent searches + suggested categories",
            detail:
              "Users repeat queries daily. Recent searches and suggested categories surface both.",
            tag: "Retention",
          },
          {
            title: "Cross-category results",
            detail:
              '"Desk" surfaces results from Furniture, Free, and Services. No artificial constraints.',
            tag: "Discovery",
          },
          {
            title: "Shared card layout with Browse",
            detail:
              "Same cards as Browse. Users learn one scanning pattern.",
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
