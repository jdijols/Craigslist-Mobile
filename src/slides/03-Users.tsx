import { Target, ShoppingCart, Store, Package } from "lucide-react";

const matrix = {
  power: {
    label: "Power User",
    buyer: {
      icon: Target,
      name: "Buyer with Intent",
      quote: '"mid-century dresser under $200"',
      description: "Knows what they want.",
      needs: [
        "Precise search & filters",
        "Price clarity",
        "Distance info",
        "Fast reply path",
      ],
    },
    seller: {
      icon: Store,
      name: "Commercial Seller",
      quote: "Manages 10–40 active listings",
      description: "Posts regularly. Pays fees.",
      needs: [
        "Professional listings",
        "Performance visibility",
        "Bulk management",
        "Fast responses",
      ],
    },
  },
  casual: {
    label: "Casual User",
    buyer: {
      icon: ShoppingCart,
      name: "Buyer without Intent",
      quote: '"What\'s around me?"',
      description: "Browsing. No specific goal.",
      needs: [
        "Visual feed",
        "Easy category hopping",
        "Serendipity",
        "Low friction",
      ],
    },
    seller: {
      icon: Package,
      name: "Private Seller",
      quote: "1–3 things to offload",
      description: "Posts once every few months.",
      needs: [
        "Fast posting (< 2 min)",
        "Confidence it'll be seen",
        "Quick buyer communication",
      ],
    },
  },
};

function UserCell({
  user,
  accent,
}: {
  user: (typeof matrix.power)["buyer"];
  accent: string;
}) {
  return (
    <div className="rounded-2xl border border-slide-border bg-slide-surface p-5 shadow-card">
      <div className="flex items-center gap-3">
        <div
          className="flex h-9 w-9 items-center justify-center rounded-xl"
          style={{ backgroundColor: accent + "15" }}
        >
          <user.icon className="h-4 w-4" style={{ color: accent }} />
        </div>
        <div>
          <h4 className="text-sm font-bold text-lf-navy">{user.name}</h4>
          <p className="text-xs text-lf-secondary">{user.description}</p>
        </div>
      </div>
      <p className="mt-3 text-xs italic text-lf-body">{user.quote}</p>
      <ul className="mt-3 space-y-1">
        {user.needs.map((need) => (
          <li key={need} className="flex items-start gap-2 text-xs text-lf-body">
            <span
              className="mt-1.5 h-1 w-1 shrink-0 rounded-full"
              style={{ backgroundColor: accent }}
            />
            {need}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function UsersSlide() {
  return (
    <div className="flex h-full w-full items-center justify-center px-12">
      <div className="w-full max-w-5xl">
        <p className="text-[13px] font-extrabold uppercase tracking-[0.1875rem] text-lf-navy">
          Our Users
        </p>
        <h2 className="mt-3 font-serif text-4xl text-lf-navy">
          One marketplace, two sides, two engagement tiers
        </h2>
        <div className="mt-4 h-px w-16 bg-lf-blue/25" />

        <div className="mt-8">
          {/* Column headers */}
          <div className="mb-3 grid grid-cols-[120px_1fr_1fr] gap-4">
            <div />
            <p className="text-center text-xs font-extrabold uppercase tracking-wider text-lf-secondary">
              Buyer
            </p>
            <p className="text-center text-xs font-extrabold uppercase tracking-wider text-lf-secondary">
              Seller
            </p>
          </div>

          {/* Power User row */}
          <div className="mb-4 grid grid-cols-[120px_1fr_1fr] gap-4">
            <div className="flex items-center">
              <span className="text-xs font-extrabold uppercase tracking-wider text-lf-blue">
                Power
                <br />
                User
              </span>
            </div>
            <UserCell user={matrix.power.buyer} accent="#006db0" />
            <UserCell user={matrix.power.seller} accent="#006db0" />
          </div>

          {/* Casual User row */}
          <div className="grid grid-cols-[120px_1fr_1fr] gap-4">
            <div className="flex items-center">
              <span className="text-xs font-extrabold uppercase tracking-wider text-lf-secondary">
                Casual
                <br />
                User
              </span>
            </div>
            <UserCell user={matrix.casual.buyer} accent="#66747a" />
            <UserCell user={matrix.casual.seller} accent="#66747a" />
          </div>
        </div>

        {/* The insight */}
        <div className="mt-6 rounded-xl bg-lf-blue-bg px-6 py-4">
          <p className="text-xs leading-relaxed text-lf-body">
            <span className="font-bold text-lf-blue">
              The insight:
            </span>{" "}
            Power users on both sides are repeat users with specific goals who
            value efficiency — and they're the most likely to pay. Casual users
            on both sides are occasional, driven by a momentary need, and need
            the experience to be effortless. Every screen a buyer sees is also a
            seller's listing on display.
          </p>
        </div>
      </div>
    </div>
  );
}
