export function SummarySlide() {
  return (
    <div className="relative flex h-full w-full items-center justify-center px-12 overflow-hidden">
      <div className="relative max-w-3xl w-full">
        <p className="text-[13px] font-extrabold uppercase tracking-[0.1875rem] text-lf-navy">
          Summary
        </p>
        <h2 className="mt-3 font-serif text-4xl text-lf-navy">
          Where we landed
        </h2>
        <div className="mt-4 h-px w-16 bg-lf-blue/25" />

        <ul className="mt-10 space-y-5">
          <li className="flex gap-4 rounded-[1.5rem] border border-slide-border bg-slide-surface p-5 shadow-card">
            <span className="font-serif text-2xl leading-none text-lf-blue/50">
              1
            </span>
            <div>
              <h3 className="text-sm font-bold text-lf-navy">Problem</h3>
              <p className="mt-1 text-sm leading-relaxed text-lf-body">
                Craigslist’s mobile experience hasn’t evolved—users and trust are
                leaking to photo-first, in-app-messaging competitors.
              </p>
            </div>
          </li>
          <li className="flex gap-4 rounded-[1.5rem] border border-slide-border bg-slide-surface p-5 shadow-card">
            <span className="font-serif text-2xl leading-none text-lf-blue/50">
              2
            </span>
            <div>
              <h3 className="text-sm font-bold text-lf-navy">Approach</h3>
              <p className="mt-1 text-sm leading-relaxed text-lf-body">
                A native iOS app grounded in our user framework, research, and design principles, with a clear IA and key screens:
                home, browse, search, and post detail.
              </p>
            </div>
          </li>
          <li className="flex gap-4 rounded-[1.5rem] border border-slide-border bg-slide-surface p-5 shadow-card">
            <span className="font-serif text-2xl leading-none text-lf-blue/50">
              3
            </span>
            <div>
              <h3 className="text-sm font-bold text-lf-navy">Next steps</h3>
              <p className="mt-1 text-sm leading-relaxed text-lf-body">
                Posting flow, in-app messaging, seller verification, smart
                notifications, and Android are the natural priorities.
              </p>
            </div>
          </li>
        </ul>

        <p className="mt-8 text-sm leading-relaxed text-lf-body text-center">
          I’m happy to go deeper on any of this or take your questions.
        </p>
      </div>
    </div>
  );
}
