import type { PrototypeStep } from "@/components/prototype";

function SellerOverviewText() {
  return (
    <>
      <p className="text-[13px] font-extrabold uppercase tracking-[0.1875rem] text-lf-navy">
        Journey 4 &mdash; The Phone Shop
      </p>
      <h2 className="mt-3 font-serif text-4xl text-lf-navy">
        The other side of the marketplace
      </h2>
      <div className="mt-4 h-px w-16 bg-lf-blue/25" />
      <p className="mt-4 text-sm text-lf-body">
        The buyer journeys improve how listings are discovered and responded
        to. But the people who{" "}
        <span className="font-semibold text-lf-navy">pay</span> Craigslist
        are sellers. A cell phone shop posting refurbished devices represents
        the Commercial Seller — high volume, paying fees, needing performance
        visibility.
      </p>
      <div className="mt-4 rounded-xl bg-lf-blue-bg px-4 py-3">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-lf-blue">
          Who this serves
        </p>
        <p className="mt-1 text-xs leading-relaxed text-lf-body">
          <strong>Commercial Seller</strong> (Journey 4): My Listings,
          performance visibility, and a path to bulk management — the users
          most likely to pay. Also serves the{" "}
          <strong>hybrid user</strong> from Journey 3 who crossed from buyer
          to seller mid-session.
        </p>
      </div>

      <div className="mt-8 space-y-5">
        {[
          {
            title: "Photo-first posting",
            detail: "Higher quality → more buyer engagement.",
            tag: "Engagement",
          },
          {
            title: "Engagement metrics",
            detail: "Sellers improve listings → feedback loop.",
            tag: "Retention",
          },
          {
            title: "Transparent pricing",
            detail: "Trust with paying customers → less abandonment.",
            tag: "Trust",
          },
        ].map((item) => (
          <div key={item.title} className="border-l-2 border-lf-blue/25 pl-4">
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-bold text-lf-navy">
                {item.title}
              </h4>
              <span className="rounded-full bg-lf-blue-bg px-2 py-0.5 text-[10px] font-semibold text-lf-blue">
                {item.tag}
              </span>
            </div>
            <p className="mt-1 text-xs leading-relaxed text-lf-body">
              {item.detail}
            </p>
          </div>
        ))}
      </div>
    </>
  );
}

function CreatePostText() {
  return (
    <>
      <p className="text-[13px] font-extrabold uppercase tracking-[0.1875rem] text-lf-navy">
        Journey 4 &rsaquo; Create
      </p>
      <h2 className="mt-3 font-serif text-4xl text-lf-navy">
        New Post Flow
      </h2>
      <div className="mt-4 h-px w-16 bg-lf-blue/25" />
      <p className="mt-4 text-sm text-lf-body">
        Tapping the Post tab opens the creation flow. Photos come first —
        the single biggest quality lever for the marketplace.
      </p>
      <div className="mt-6 space-y-5">
        <div className="border-l-2 border-lf-blue/25 pl-4">
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-bold text-lf-navy">
              Photo-first, guided form
            </h4>
            <span className="rounded-full bg-lf-blue-bg px-2 py-0.5 text-[10px] font-semibold text-lf-blue">
              Quality
            </span>
          </div>
          <p className="mt-1 text-xs leading-relaxed text-lf-body">
            Camera opens immediately. Title, price, and category follow.
            Under 2 minutes from tap to publish — fast enough for casual
            sellers, structured enough for commercial ones.
          </p>
        </div>
        <div className="border-l-2 border-lf-blue/25 pl-4">
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-bold text-lf-navy">
              Transparent fee display
            </h4>
            <span className="rounded-full bg-lf-blue-bg px-2 py-0.5 text-[10px] font-semibold text-lf-blue">
              Trust
            </span>
          </div>
          <p className="mt-1 text-xs leading-relaxed text-lf-body">
            "Post for Free" or the listing fee is shown before publishing.
            No surprises — builds trust with the users who generate revenue.
          </p>
        </div>
      </div>
    </>
  );
}

export const sellerJourneySteps: PrototypeStep[] = [
  { screen: "my-listings", text: <SellerOverviewText /> },
  { screen: "create-post", text: <CreatePostText /> },
];
