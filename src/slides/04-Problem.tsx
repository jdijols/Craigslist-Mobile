import type { PrototypeStep } from "@/components/prototype";

function HomeText() {
  return (
    <>
      <p className="text-[13px] font-extrabold uppercase tracking-[0.1875rem] text-lf-navy">
        The Current Experience
      </p>
      <h2 className="mt-3 font-serif text-4xl text-lf-navy">Home</h2>
      <div className="mt-4 h-px w-16 bg-lf-blue/25" />
      <p className="mt-4 text-sm text-lf-body">
        The first screen is text-forward. We see an opportunity for more
        imagery, clearer hierarchy, and a sense of what&rsquo;s nearby.
      </p>

      <div className="mt-8 space-y-5">
        {[
          {
            title: "Category drill-down is text-heavy",
            detail:
              "Multiple taps to orient. We’d add visual cues to guide the eye.",
            tag: "Navigation",
          },
          {
            title: "Limited visual hierarchy",
            detail:
              "Categories carry similar weight. We’d differentiate to invite exploration.",
            tag: "Visual Design",
          },
          {
            title: "Room for personalization and local context",
            detail:
              "Location, history, and trending could make the experience feel more relevant per visitor.",
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

function BrowseText() {
  return (
    <>
      <p className="text-[13px] font-extrabold uppercase tracking-[0.1875rem] text-lf-navy">
        The Current Experience
      </p>
      <h2 className="mt-3 font-serif text-4xl text-lf-navy">Browse</h2>
      <div className="mt-4 h-px w-16 bg-lf-blue/25" />
      <p className="mt-4 text-sm text-lf-body">
        Browsing could feel more like window shopping. Today there are
        several views — we’d unify them so each shows what matters most.
      </p>

      <div className="mt-8 space-y-5">
        {[
          {
            title: "Photos could be more central",
            detail:
              "Default view is text-first. Gallery exists via the menu; we’d make imagery the default.",
            tag: "Visual Design",
          },
          {
            title: "Views could be more consistent",
            detail:
              "Each view shows different info. We’d align so users don’t have to hop to piece it together.",
            tag: "Discovery",
          },
          {
            title: "Filter and sort could be more visible",
            detail:
              "They live in the hamburger menu. We’d surface them so they’re always at hand.",
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

function SearchText() {
  return (
    <>
      <p className="text-[13px] font-extrabold uppercase tracking-[0.1875rem] text-lf-navy">
        The Current Experience
      </p>
      <h2 className="mt-3 font-serif text-4xl text-lf-navy">Search</h2>
      <div className="mt-4 h-px w-16 bg-lf-blue/25" />
      <p className="mt-4 text-sm text-lf-body">
        When users know what they want, speed matters. CL already offers
        search help and save/history — we see room to surface them more
        and to make results easier to scan.
      </p>

      <div className="mt-8 space-y-5">
        {[
          {
            title: "Autocomplete and suggestions could be more prominent",
            detail:
              "They exist (see second screenshot). We’d surface them more and make them more helpful.",
            tag: "Efficiency",
          },
          {
            title: "Results could show more at a glance",
            detail:
              "Title and price are there; distance, neighborhood, and condition would reduce taps to evaluate.",
            tag: "Information",
          },
          {
            title: "Saved search, alerts, and history could be easier to find",
            detail:
              "All exist — save search, email/text alerts, history — but live in the hamburger. We’d give them a clearer home.",
            tag: "Retention",
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

function ItemDetailText() {
  return (
    <>
      <p className="text-[13px] font-extrabold uppercase tracking-[0.1875rem] text-lf-navy">
        The Current Experience
      </p>
      <h2 className="mt-3 font-serif text-4xl text-lf-navy">Post Detail</h2>
      <div className="mt-4 h-px w-16 bg-lf-blue/25" />
      <p className="mt-4 text-sm text-lf-body">
        Post detail is where trust matters most. We see an opportunity:
        larger photos, clearer seller context, and keeping the reply
        flow inside the app.
      </p>

      <div className="mt-8 space-y-5">
        {[
          {
            title: "Photos could have more prominence",
            detail:
              "Photos drive trust. We’d give them more space so buyers can evaluate at a glance.",
            tag: "Trust",
          },
          {
            title: "Seller context could be stronger",
            detail:
              "Ratings, join date, or listing history would help buyers feel more confident.",
            tag: "Trust",
          },
          {
            title: "Reply currently goes to email",
            detail:
              "Tapping reply opens mailto. We’d keep the conversation in-app so both sides stay engaged.",
            tag: "Conversion",
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

export const problemSteps: PrototypeStep[] = [
  {
    screen: "home",
    text: <HomeText />,
    screenshotPlaceholder: "craigslist iOS — home screen",
    screenshotImage: "/slides/current-experience-home.png",
  },
  {
    screen: "home",
    text: <BrowseText />,
    screenshotPlaceholder: "craigslist iOS — browse (click to cycle)",
    screenshotImage: [
      "/slides/current-experience-browse-1.png",
      "/slides/current-experience-browse-2.png",
      "/slides/current-experience-browse-3.png",
      "/slides/current-experience-browse-4.png",
      "/slides/current-experience-browse-5.png",
      "/slides/current-experience-browse-6.png",
    ],
  },
  {
    screen: "home",
    text: <SearchText />,
    screenshotPlaceholder: "craigslist iOS — search (click to cycle)",
    screenshotImage: [
      "/slides/current-experience-search-1.png",
      "/slides/current-experience-search-2.png",
      "/slides/current-experience-search-3.png",
    ],
  },
  {
    screen: "home",
    text: <ItemDetailText />,
    screenshotPlaceholder: "craigslist iOS — item detail (click to cycle)",
    screenshotImage: [
      "/slides/current-experience-item-detail-1.png",
      "/slides/current-experience-item-detail-2.png",
    ],
  },
];
