import type { PrototypeStep } from "@/components/prototype";

function PostDetailText() {
  return (
    <>
      <p className="text-[13px] font-extrabold uppercase tracking-[0.1875rem] text-lf-navy">
        Post Details
      </p>
      <h2 className="mt-3 font-serif text-4xl text-lf-navy">
        The decision point
      </h2>
      <div className="mt-4 h-px w-16 bg-lf-blue/25" />
      <p className="mt-4 text-sm text-lf-body">
        Every buyer journey converges here. One goal: give the buyer
        enough confidence to contact the seller.
      </p>
      <div className="mt-4 rounded-xl bg-lf-blue-bg px-4 py-3">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-lf-blue">
          Who this serves
        </p>
        <p className="mt-1 text-xs leading-relaxed text-lf-body">
          Clear price, location, and photos reduce friction to reply.
          Also the <strong>seller's</strong> listing at its best.
        </p>
      </div>

      <div className="mt-8 space-y-5">
        {[
          {
            title: "Sticky Reply CTA",
            detail:
              "Always visible, never scrolled away. Current CL buries the reply link behind email.",
            tag: "Conversion",
          },
          {
            title: "Full-bleed image carousel",
            detail:
              "Photos get the space they deserve. Trust no description text can match.",
            tag: "Trust",
          },
          {
            title: "Clear price + location hierarchy",
            detail:
              "Price first, location second. Both scannable without reading the description.",
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

export const postDetailSteps: PrototypeStep[] = [
  { screen: "post-detail", text: <PostDetailText /> },
];
