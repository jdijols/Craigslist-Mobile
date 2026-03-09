/**
 * Shared motion configs for prototype overlays (sheets, drawers, modals).
 * Use these instead of ad-hoc values to keep transitions consistent.
 */

/** Spring for sliding panels/sheets (e.g. subcategory drawer, new post modal). */
export const SPRING_SHEET = {
  type: "spring" as const,
  damping: 28,
  stiffness: 300,
};

/** Duration/ease for overlay backdrops (e.g. subcategory drawer dim). */
export const OVERLAY_FADE = { duration: 0.25, ease: "easeOut" as const };
