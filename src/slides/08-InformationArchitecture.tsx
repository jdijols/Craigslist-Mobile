import { Home, Search, PlusCircle, Star, User } from "lucide-react";

const categories = [
  { name: "For Sale", note: "~12 subcats", revenue: true },
  { name: "Jobs", note: "simplified", revenue: true },
  { name: "Housing", note: "", revenue: true },
  { name: "Services", note: "grouped", revenue: true },
  { name: "Community", note: "grouped", revenue: false },
  { name: "Gigs", note: "", revenue: true },
];

const tabBar = [
  { icon: Home, label: "Home", role: "Discovery feed, category grid, search entry" },
  { icon: Search, label: "Search", role: "Dedicated search with filters" },
  { icon: PlusCircle, label: "Post", role: "Create a new listing (seller entry)" },
  { icon: Star, label: "Saved", role: "Saved listings & searches (retention)" },
  { icon: User, label: "Account", role: "Settings, profile, my listings" },
];

export function InformationArchitectureSlide() {
  return (
    <div className="flex h-full w-full items-center justify-center px-12">
      <div className="w-full max-w-5xl">
        <p className="text-[13px] font-extrabold uppercase tracking-[0.1875rem] text-lf-navy">
          Information Architecture
        </p>
        <h2 className="mt-3 font-serif text-4xl text-lf-navy">
          130+ categories &rarr; 6 navigable groups
        </h2>
        <div className="mt-4 h-px w-16 bg-lf-blue/25" />

        <div className="mt-8 grid grid-cols-2 gap-8">
          {/* Left: Tab bar */}
          <div>
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-lf-secondary">
              Primary navigation — iOS tab bar
            </h3>
            <div className="mt-4 space-y-2">
              {tabBar.map((tab) => (
                <div
                  key={tab.label}
                  className="flex items-center gap-4 rounded-xl border border-slide-border bg-slide-surface px-4 py-3"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-lf-blue-bg text-lf-blue">
                    <tab.icon className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-lf-navy">
                      {tab.label}
                    </p>
                    <p className="text-xs text-lf-secondary">{tab.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Categories */}
          <div>
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-lf-secondary">
              Home screen categories (ordered by traffic & revenue)
            </h3>
            <div className="mt-4 grid grid-cols-3 gap-3">
              {categories.map((cat, i) => (
                <div
                  key={cat.name}
                  className="flex flex-col items-center gap-2 rounded-xl border border-slide-border bg-slide-surface p-4 shadow-sm"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-lf-blue-bg text-sm font-bold text-lf-blue">
                    {i + 1}
                  </div>
                  <span className="text-xs font-semibold text-lf-off-black">
                    {cat.name}
                  </span>
                  {cat.revenue && (
                    <span className="rounded-full bg-lf-green/10 px-2 py-0.5 text-[9px] font-semibold text-lf-green">
                      Revenue
                    </span>
                  )}
                  {cat.note && (
                    <span className="text-[10px] text-lf-secondary">
                      {cat.note}
                    </span>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-4 rounded-xl bg-lf-blue-bg px-5 py-3">
              <p className="text-xs text-lf-body">
                <span className="font-semibold text-lf-navy">
                  Browse depth: one level.
                </span>{" "}
                Tap "For Sale" → subcategory chips + filterable feed. No deeper
                nesting. Discussion Forums and Resumes collapse into Account.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
