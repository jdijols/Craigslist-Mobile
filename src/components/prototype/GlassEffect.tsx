const LIGHT_GLASS = {
  background: "rgba(255, 255, 255, 0.12)",
  boxShadow: "0 2px 20px rgba(0, 0, 0, 0.08), 0 0 0 0.5px rgba(0, 0, 0, 0.05)",
} as const;

const DARK_GLASS = {
  background: "rgba(30, 30, 30, 0.65)",
  boxShadow: "0 2px 20px rgba(0, 0, 0, 0.3), 0 0 0 0.5px rgba(255, 255, 255, 0.08)",
} as const;

function useIsDark() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

export function getGlassStyle(isDark: boolean) {
  const palette = isDark ? DARK_GLASS : LIGHT_GLASS;
  return {
    background: palette.background,
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
    boxShadow: palette.boxShadow,
  } as const;
}

export const glassStyle = {
  background: "rgba(255, 255, 255, 0.12)",
  backdropFilter: "blur(20px)",
  WebkitBackdropFilter: "blur(20px)",
  boxShadow: "0 2px 20px rgba(0, 0, 0, 0.08), 0 0 0 0.5px rgba(0, 0, 0, 0.05)",
} as const;

export function GlassLayers() {
  const isDark = useIsDark();
  const highlightOpacity = isDark ? 0.08 : 0.18;
  const insetTop = isDark ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.5)";
  const insetBottom = isDark ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.1)";

  return (
    <>
      <div
        className="pointer-events-none absolute inset-x-[1px] top-[0.5px] h-[30%]"
        style={{
          background: `linear-gradient(180deg, rgba(255,255,255,${highlightOpacity}) 0%, transparent 100%)`,
          borderRadius: "inherit",
        }}
      />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          borderRadius: "inherit",
          boxShadow: `inset 0 0.5px 0 ${insetTop}, inset 0 -0.5px 0 ${insetBottom}`,
        }}
      />
    </>
  );
}

export function DiagonalStroke() {
  const isDark = useIsDark();
  const strong = isDark ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.8)";
  const faint = isDark ? "rgba(255,255,255,0.02)" : "rgba(255,255,255,0.05)";

  return (
    <div
      className="pointer-events-none absolute inset-0"
      style={{
        borderRadius: "inherit",
        border: "1px solid transparent",
        backgroundImage:
          `conic-gradient(from 315deg, ${strong}, ${faint} 25%, ${faint} 37.5%, ${strong} 50%, ${faint} 75%, ${faint} 87.5%, ${strong})`,
        backgroundOrigin: "border-box",
        WebkitMask:
          "linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)",
        WebkitMaskComposite: "xor",
        maskComposite: "exclude",
      }}
    />
  );
}
