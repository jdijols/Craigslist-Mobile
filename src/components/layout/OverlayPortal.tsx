import { createContext, useContext } from "react";

/**
 * Provides a DOM element that sits above all phone screen content
 * (including TabBar, status bar area) for rendering full-screen overlays
 * like the subcategory drawer via React portals.
 */
const OverlayPortalContext = createContext<HTMLDivElement | null>(null);

export const OverlayPortalProvider = OverlayPortalContext.Provider;

export function useOverlayPortal(): HTMLDivElement | null {
  return useContext(OverlayPortalContext);
}
