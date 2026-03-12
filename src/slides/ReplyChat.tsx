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
        Tapping Reply opens a compose sheet. The action that turns browsing
        into a transaction — and the one CL currently buries behind email.
      </p>
      <div className="mt-4 rounded-xl bg-lf-blue-bg px-4 py-3">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-lf-blue">
          Why in-app messaging matters
        </p>
        <p className="mt-1 text-xs leading-relaxed text-lf-body">
          User stays engaged, seller gets instant notifications, and CL
          retains visibility into marketplace activity — a prerequisite
          for trust, moderation, and monetization.
        </p>
      </div>

      <div className="mt-8 space-y-5">
        {[
          {
            title: "Anonymized identity",
            detail:
              "Both sides use anonymized handles. No emails exposed until users opt in. Privacy by default.",
            tag: "Trust",
          },
          {
            title: "Contextual pre-fill",
            detail:
              "Pre-filled opening message referencing the listing. User just taps Send.",
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
        Conversations live in the Chats tab, tied to their listing.
        Context is never lost.
      </p>

      <div className="mt-8 space-y-5">
        {[
          {
            title: "Listing-anchored threads",
            detail:
              "Tap the thread header to jump back to the listing. Both sides always know what they're discussing.",
            tag: "Usability",
          },
          {
            title: "Chats tab as inbox",
            detail:
              "All conversations in one place. Unread indicators and timestamps surface urgent threads.",
            tag: "Retention",
          },
          {
            title: "Seller notification loop",
            detail:
              "Buyer replies notify the seller. Seller responds back to the buyer's Chats tab. A loop that keeps both sides in the app.",
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
