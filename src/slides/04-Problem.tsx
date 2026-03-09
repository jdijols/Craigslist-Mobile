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
        The first screen users see looks and feels like a spreadsheet.
        A plain-text category list with no imagery, no hierarchy, and
        no sense of what&rsquo;s happening nearby.
      </p>

      <div className="mt-8 space-y-5">
        {[
          {
            title: "Plain text category drill-down",
            detail:
              "Two-panel text lists require multiple taps just to orient. No visual cues guide the eye or suggest what's popular.",
            tag: "Navigation",
          },
          {
            title: "No images or visual hierarchy",
            detail:
              "Without icons, photos, or typographic weight, every category feels equally unimportant — nothing invites exploration.",
            tag: "Visual Design",
          },
          {
            title: "No personalization or local context",
            detail:
              "Nothing reflects the user's location, history, or what's trending nearby. The experience is identical for every visitor.",
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
        Exploring what&rsquo;s available should feel like window shopping.
        Instead it feels like reading a spreadsheet &mdash; across five
        different views that each leave out something important.
      </p>

      <div className="mt-8 space-y-5">
        {[
          {
            title: "Photos are optional, not default",
            detail:
              "The default list view shows no images at all. A gallery mode exists, but it's buried behind a hamburger menu → \"change view.\" The most important signal in marketplace browsing is treated as an advanced feature.",
            tag: "Visual Design",
          },
          {
            title: "Five views, zero coherence",
            detail:
              "Text list, thumbnail list, gallery grid, map clusters — each shows different information, none shows enough. Users hop between modes trying to piece together what's available.",
            tag: "Discovery",
          },
          {
            title: "Controls hide behind a menu",
            detail:
              "Filtering, sorting, and switching views all require opening a dropdown from a hamburger icon. There's no persistent UI for the actions users need most while browsing.",
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
        When a user knows what they want, speed is everything. But
        searching on craigslist means typing blind into a bare text
        field &mdash; then scrolling through results that hide the
        information needed to make a quick decision.
      </p>

      <div className="mt-8 space-y-5">
        {[
          {
            title: "No autocomplete or suggestions",
            detail:
              "Users type into a plain text field with zero assistance. No trending terms, no category-aware suggestions, no recent searches to pick from.",
            tag: "Efficiency",
          },
          {
            title: "Results lack decision-making context",
            detail:
              "Listings show a title and price but no distance, neighborhood, or condition. Users open every item just to determine if it's worth pursuing.",
            tag: "Information",
          },
          {
            title: "No way to save or revisit a search",
            detail:
              "There are no saved searches, no alerts, no history. Every search starts from scratch — even for users checking the same category daily.",
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
        Would you send $500 to this person based on what you see here?
        Small photos, no seller context, and a reply flow that leaves the
        app entirely — the moment trust matters most, the experience fails.
      </p>

      <div className="mt-8 space-y-5">
        {[
          {
            title: "Small, low-quality images",
            detail:
              "Photos are the #1 trust signal in peer-to-peer commerce. Here they're cropped, tiny, and hard to evaluate.",
            tag: "Trust",
          },
          {
            title: "No meaningful seller information",
            detail:
              "No ratings, join date, response time, or listing history. Buyers have zero basis for evaluating the person behind the post.",
            tag: "Trust",
          },
          {
            title: "Reply goes to email",
            detail:
              "Tapping reply exits the app and opens a mailto link. The conversation leaves craigslist — and so does the user.",
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
