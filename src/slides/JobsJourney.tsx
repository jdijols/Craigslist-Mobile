import type { PrototypeStep } from "@/components/prototype";

function JobsBrowsingText() {
  return (
    <>
      <p className="text-[13px] font-extrabold uppercase tracking-[0.1875rem] text-lf-navy">
        Journey 3 &mdash; The Career Pivot
      </p>
      <h2 className="mt-3 font-serif text-4xl text-lf-navy">
        Browsing jobs &amp; gigs
      </h2>
      <div className="mt-4 h-px w-16 bg-lf-blue/25" />
      <p className="mt-4 text-sm text-lf-body">
        A graphic designer looking for work starts by browsing Jobs and Gigs
        categories — scanning listings, comparing opportunities. This is
        Craigslist's bread and butter: connecting people with work.
      </p>
      <div className="mt-4 rounded-xl bg-lf-blue-bg px-4 py-3">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-lf-blue">
          The hybrid user
        </p>
        <p className="mt-1 text-xs leading-relaxed text-lf-body">
          This user is a <strong>buyer</strong> when scanning job listings,
          but they're also considering becoming a <strong>seller</strong> —
          posting their resume or a community ad to attract work. One user,
          both sides of the marketplace, in a single session.
        </p>
      </div>

      <div className="mt-8 space-y-5">
        {[
          {
            title: "Jobs & Gigs are high-revenue categories",
            detail:
              "Job listings are $10–$75/post — the highest fee tier on Craigslist. Gigs are $3–$10. Making these categories easy to browse directly supports listing volume and revenue.",
            tag: "Business",
          },
          {
            title: "Category-specific subcategories",
            detail:
              "Art/media/design, web/html/info design, creative gigs — the subcategory chips let a graphic designer narrow to their specialty in one tap.",
            tag: "Usability",
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

function HybridPostText() {
  return (
    <>
      <p className="text-[13px] font-extrabold uppercase tracking-[0.1875rem] text-lf-navy">
        Journey 3 &rsaquo; Posting
      </p>
      <h2 className="mt-3 font-serif text-4xl text-lf-navy">
        From buyer to seller
      </h2>
      <div className="mt-4 h-px w-16 bg-lf-blue/25" />
      <p className="mt-4 text-sm text-lf-body">
        After browsing, the graphic designer decides to also post — a resume
        in Resumes (free) or a services ad in Community. The same Create
        Post flow adapts: category selection determines the form fields and
        any applicable fee.
      </p>

      <div className="mt-6 space-y-5">
        <div className="border-l-2 border-lf-blue/25 pl-4">
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-bold text-lf-navy">
              One flow, every category
            </h4>
            <span className="rounded-full bg-lf-blue-bg px-2 py-0.5 text-[10px] font-semibold text-lf-blue">
              System
            </span>
          </div>
          <p className="mt-1 text-xs leading-relaxed text-lf-body">
            The post creation form is category-aware. Resumes and Community
            posts are free — the user sees "free to post" before publishing.
            Paid categories show the fee transparently. One flow serves every
            user type.
          </p>
        </div>
        <div className="border-l-2 border-lf-blue/25 pl-4">
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-bold text-lf-navy">
              Buyer → seller in one session
            </h4>
            <span className="rounded-full bg-lf-blue-bg px-2 py-0.5 text-[10px] font-semibold text-lf-blue">
              Conversion
            </span>
          </div>
          <p className="mt-1 text-xs leading-relaxed text-lf-body">
            The "+" tab is always visible. A user who came to browse jobs
            can post their resume without leaving the app or restarting.
            Lowering friction to post means more listings, more content,
            more reasons for the next buyer to open the app.
          </p>
        </div>
      </div>
    </>
  );
}

export const jobsJourneySteps: PrototypeStep[] = [
  { screen: "home", text: <JobsBrowsingText /> },
  { screen: "create-post", text: <HybridPostText /> },
];
