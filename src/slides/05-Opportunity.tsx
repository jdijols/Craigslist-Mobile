import { ArrowRight, AlertTriangle } from "lucide-react";

const feeCategories = [
  { category: "Jobs", fee: "$10–$75/post", role: "Largest revenue source" },
  { category: "Vehicles", fee: "$5/post", role: "High volume" },
  { category: "Housing", fee: "$5–$10/post", role: "Market-dependent" },
  { category: "Services & Gigs", fee: "$3–$10/post", role: "Steady volume" },
  { category: "Dealer Sales", fee: "$3–$5/post", role: "Commercial sellers" },
];

const opportunities = [
  "No engagement feedback for sellers — they post and hope",
  "No retention mechanics beyond saved searches — no notifications, no reason to come back daily",
];

export function OpportunitySlide() {
  return (
    <div className="flex h-full w-full items-center justify-center px-12">
      <div className="w-full max-w-5xl">
        <p className="text-[13px] font-extrabold uppercase tracking-[0.1875rem] text-lf-navy">
          The Opportunity
        </p>
        <h2 className="mt-3 font-serif text-4xl text-lf-navy">
          How Craigslist sustains itself — and where design fits
        </h2>
        <div className="mt-4 h-px w-16 bg-lf-blue/25" />

        <div className="mt-8 grid grid-cols-2 gap-8">
          {/* Left: Business model */}
          <div>
            <p className="text-sm leading-relaxed text-lf-body">
              No ads. No data selling. Revenue comes from{" "}
              <span className="font-semibold text-lf-navy">listing fees</span>{" "}
              in specific categories, while ~99% of listings remain free. An
              estimated{" "}
              <span className="font-semibold text-lf-navy">$297M/year</span> on
              roughly 50 employees.
            </p>

            <div className="mt-5 space-y-2">
              {feeCategories.map((f) => (
                <div
                  key={f.category}
                  className="flex items-center justify-between rounded-lg border border-slide-border bg-slide-surface px-4 py-2.5"
                >
                  <div className="flex items-baseline gap-2">
                    <span className="text-sm font-semibold text-lf-navy">
                      {f.category}
                    </span>
                    <span className="text-xs text-lf-secondary">{f.fee}</span>
                  </div>
                  <span className="text-[10px] text-lf-secondary">
                    {f.role}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Flywheel */}
          <div className="rounded-[1.5rem] border border-slide-border bg-slide-surface p-6 shadow-card">
            <p className="text-xs font-extrabold uppercase tracking-wider text-lf-secondary">
              The Marketplace Flywheel
            </p>
            <div className="mt-4 space-y-3">
              {[
                "Better buyer experience",
                "More buyers browse & engage",
                "Listings get more responses",
                "Sellers see value in posting (and paying)",
                "More and better listings",
              ].map((step, i, arr) => (
                <div key={step} className="flex items-center gap-3">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-lf-blue-bg text-[10px] font-bold text-lf-blue">
                    {i + 1}
                  </div>
                  <span className="text-xs text-lf-body">{step}</span>
                  {i < arr.length - 1 && (
                    <ArrowRight className="ml-auto h-3 w-3 text-lf-secondary" />
                  )}
                </div>
              ))}
            </div>
            <p className="mt-4 text-xs font-semibold text-lf-blue">
              A redesigned buyer experience isn't just a UX improvement — it's
              a revenue lever.
            </p>
          </div>
        </div>

        {/* Bottom row: Opportunity on the table (left) + Competitive reality (right) */}
        <div className="mt-6 grid grid-cols-2 gap-8">
          <div className="space-y-2">
            <p className="text-[10px] font-extrabold uppercase tracking-wider text-lf-secondary">
              Opportunity on the table
            </p>
            {opportunities.map((opp) => (
              <div
                key={opp}
                className="flex items-start gap-2 rounded-lg border border-slide-border bg-lf-blue-bg px-4 py-2.5"
              >
                <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-lf-blue" />
                <span className="text-xs text-lf-body">{opp}</span>
              </div>
            ))}
          </div>

          <div className="space-y-2">
            <p className="text-[10px] font-extrabold uppercase tracking-wider text-lf-secondary">
              &nbsp;
            </p>
            <div className="flex items-start gap-3 rounded-xl border border-slide-border bg-slide-surface px-4 py-3 shadow-card">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-lf-blue" />
              <p className="text-xs leading-relaxed text-lf-body">
                <span className="font-bold text-lf-navy">
                  The competitive reality:
                </span>{" "}
                Facebook Marketplace and OfferUp win CL's users with
                photo-forward browsing, integrated profiles, and identity-backed
                trust. CL has in-app chat, but most users default to the email
                relay — the overall mobile experience still feels frozen in 2005.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
