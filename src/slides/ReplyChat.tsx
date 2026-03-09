import type { PrototypeStep } from "@/components/prototype";

function ReplyCTAText() {
  return (
    <>
      <p className="text-[13px] font-extrabold uppercase tracking-[0.1875rem] text-lf-navy">
        Reply &amp; Chat
      </p>
      <h2 className="mt-3 font-serif text-4xl text-lf-navy">
        The conversion moment
      </h2>
      <div className="mt-4 h-px w-16 bg-lf-blue/25" />
      <p className="mt-4 text-sm text-lf-body">
        Every buyer journey ends here: tapping Reply opens a compose sheet
        where the user writes a message to the anonymized poster. This is
        the action that turns browsing into a transaction — and the action
        current Craigslist buries behind email.
      </p>
      <div className="mt-4 rounded-xl bg-lf-blue-bg px-4 py-3">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-lf-blue">
          Why in-app messaging matters
        </p>
        <p className="mt-1 text-xs leading-relaxed text-lf-body">
          Keeping replies inside the app means the user stays engaged, the
          seller gets notified instantly, and Craigslist retains visibility
          into marketplace activity — a prerequisite for trust features,
          moderation, and future monetization.
        </p>
      </div>

      <div className="mt-8 space-y-5">
        {[
          {
            title: "Anonymized identity",
            detail:
              "Both sides communicate through anonymized handles. No email addresses are exposed until the users choose to share — privacy by default, as Craigslist users expect.",
            tag: "Trust",
          },
          {
            title: "Contextual pre-fill",
            detail:
              "The reply sheet pre-fills with a natural opening message referencing the listing title. Reduces friction — the user just taps Send.",
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

function ChatThreadText() {
  return (
    <>
      <p className="text-[13px] font-extrabold uppercase tracking-[0.1875rem] text-lf-navy">
        Reply &amp; Chat &rsaquo; Thread
      </p>
      <h2 className="mt-3 font-serif text-4xl text-lf-navy">
        Chat threads
      </h2>
      <div className="mt-4 h-px w-16 bg-lf-blue/25" />
      <p className="mt-4 text-sm text-lf-body">
        After sending a reply, the conversation appears in the Chats tab.
        Each thread is tied to a specific listing — context is never lost.
        The seller sees the same thread on their end, anchored to their
        My Listings dashboard.
      </p>

      <div className="mt-8 space-y-5">
        {[
          {
            title: "Listing-anchored threads",
            detail:
              "Every thread references the listing it originated from. Tap the header to jump back to the post. Both sides always know what they're talking about.",
            tag: "Usability",
          },
          {
            title: "Chats tab as inbox",
            detail:
              "All conversations — as buyer or seller — live in one place. Unread indicators and timestamps surface the most urgent threads. The tab badge tells you at a glance.",
            tag: "Retention",
          },
          {
            title: "Seller notification loop",
            detail:
              "When a buyer replies, the seller is notified and the reply count on My Listings increments. The seller's response flows back to the buyer's Chats tab — a feedback loop that keeps both sides in the app.",
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

export const replyChatSteps: PrototypeStep[] = [
  { screen: "post-detail", text: <ReplyCTAText /> },
  { screen: "chat", text: <ChatThreadText /> },
];
