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
        This is where every buyer journey converges: the user decides whether
        to reply. Every element serves one goal — give the buyer enough
        confidence to contact the seller.
      </p>
      <div className="mt-4 rounded-xl bg-lf-blue-bg px-4 py-3">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-lf-blue">
          Who this serves
        </p>
        <p className="mt-1 text-xs leading-relaxed text-lf-body">
          <strong>Buyers</strong> (both intent-driven and casual): clear
          price, location, and photos reduce friction to reply. The same
          screen is the <strong>seller's</strong> listing at its best — trust
          and conversion for both sides.
        </p>
      </div>

      <div className="mt-8 space-y-5">
        {[
          {
            title: "Sticky Reply CTA",
            detail:
              "Contact action always visible, never scrolled away. Current CL buries the reply link and sends users to email. The sticky bar keeps the action accessible and the user in the app.",
            tag: "Conversion",
          },
          {
            title: "Full-bleed image carousel",
            detail:
              "Photos get the screen real estate they deserve. Trust that no amount of description text can match. Sellers' listings look their best.",
            tag: "Trust",
          },
          {
            title: "Clear price + location hierarchy",
            detail:
              "Price is the first thing a buyer wants to know. Location is the second (is this worth the trip?). Both are instantly scannable without reading the description.",
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
