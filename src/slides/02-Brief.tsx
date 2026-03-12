export function BriefSlide() {
  const capabilities = [
    { number: "01", label: "The Home screen" },
    { number: "02", label: "Browsing a category" },
    { number: "03", label: "Searching for an item" },
    { number: "04", label: "Viewing the details of a post" },
  ];

  return (
    <div className="flex h-full w-full items-center justify-center px-12">
      <div className="max-w-3xl">
        <p className="text-[13px] font-extrabold uppercase tracking-[0.1875rem] text-lf-navy">
          The Brief
        </p>
        <h2 className="mt-3 font-serif text-4xl leading-tight text-lf-navy">
          Strengthen Craigslist UX on iOS
        </h2>
        <div className="mt-6 h-px w-16 bg-lf-blue/25" />
        <p className="mt-6 text-lg leading-relaxed text-lf-body">
          Redesign the craigslist iOS app with modern native patterns.
          Four core capabilities to start:
        </p>

        <div className="mt-8 space-y-4">
          {capabilities.map((cap) => (
            <div key={cap.number} className="flex items-baseline gap-4">
              <span className="font-serif text-2xl text-lf-blue/50">
                {cap.number}
              </span>
              <span className="text-lg font-medium text-lf-navy">
                {cap.label}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-10 rounded-[1.5rem] border border-slide-border bg-slide-surface p-6 shadow-card">
          <p className="text-sm leading-relaxed text-lf-body">
            Research-first. We studied CL's users, business model, and
            competitive landscape before touching pixels.
          </p>
        </div>
      </div>
    </div>
  );
}
