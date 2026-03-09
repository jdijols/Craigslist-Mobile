import { MessageSquare, Bell, BadgeCheck, Smartphone, PenLine } from "lucide-react";

const nextSteps = [
  {
    icon: PenLine,
    title: "Posting & Managing",
    detail: "Streamlined post creation with photo-first UX, category suggestions, and price guidance.",
    need: "Seller experience",
  },
  {
    icon: MessageSquare,
    title: "In-App Messaging",
    detail: "Replace reply-by-email with real-time chat. 2-3x conversion increase based on competitor data.",
    need: "Browse-to-contact conversion",
  },
  {
    icon: BadgeCheck,
    title: "Seller Verification",
    detail: "Optional identity verification for enhanced trust signals. Builds confidence for higher-value transactions.",
    need: "Trust & safety",
  },
  {
    icon: Bell,
    title: "Smart Notifications",
    detail: "Saved search alerts, price drop notifications, and new listing alerts for favorite categories.",
    need: "Retention / DAU",
  },
  {
    icon: Smartphone,
    title: "Android",
    detail: "Extend the design system to Material You patterns while maintaining brand consistency.",
    need: "Market coverage",
  },
];

export function NextStepsSlide() {
  return (
    <div className="relative flex h-full w-full items-center justify-center px-12 overflow-hidden">
      <div className="relative max-w-4xl w-full">
        <p className="text-[13px] font-extrabold uppercase tracking-[0.1875rem] text-lf-navy">
          Next Steps
        </p>
        <h2 className="mt-3 font-serif text-4xl text-lf-navy">
          Where we go from here
        </h2>
        <div className="mt-4 h-px w-16 bg-lf-blue/25" />

        <div className="mt-10 space-y-4">
          {nextSteps.map((step) => (
            <div
              key={step.title}
              className="flex items-start gap-5 rounded-[1.5rem] border border-slide-border bg-slide-surface p-5 shadow-card"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-lf-blue-bg text-lf-blue">
                <step.icon className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <h3 className="text-sm font-bold text-lf-navy">
                    {step.title}
                  </h3>
                  <span className="rounded-full bg-lf-blue-bg px-2.5 py-0.5 text-[10px] font-semibold text-lf-blue">
                    {step.need}
                  </span>
                </div>
                <p className="mt-1 text-xs leading-relaxed text-lf-body">
                  {step.detail}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
