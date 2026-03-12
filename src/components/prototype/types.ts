import type { ReactNode } from "react";

export type ScreenId =
  | "home"
  | "search"
  | "saved"
  | "post-detail"
  | "my-listings"
  | "create-post"
  | "chat"
  | "chat-thread";

export interface PrototypeStep {
  screen: ScreenId;
  text: ReactNode;
  /** Which PostDetail variant to display when this step is active. */
  postDetailVariant?: "dresser" | "apartment";
  /** When set, renders a static placeholder in the phone frame instead of AppPrototype. */
  screenshotPlaceholder?: string;
  /** When set with screenshotPlaceholder, shows this image instead of the dashed placeholder.
   *  Pass an array to enable click-to-cycle through multiple screenshots. */
  screenshotImage?: string | string[];
  /** Pre-select a category chip on the home screen (lowercase label, e.g. "housing"). */
  homeCategory?: string;
  /** Pre-select a subcategory within the active category. */
  homeSubcategory?: string;
  /** When true, opens the subcategory side drawer for the active category. */
  homeSubcategoryDrawerOpen?: boolean;
  /** Force the home screen view mode (e.g. "map"). */
  homeViewMode?: "thumb" | "list" | "gallery" | "grid" | "map";
}

export const SCREEN_DEPTH: Record<ScreenId, number> = {
  home: 0,
  search: 1,
  saved: 0,
  "post-detail": 1,
  "my-listings": 0,
  "create-post": 0,
  chat: 0,
  "chat-thread": 1,
};

export const TAB_FOR_SCREEN: Record<ScreenId, string> = {
  home: "home",
  search: "home",
  saved: "favorites",
  "post-detail": "home",
  "my-listings": "account",
  "create-post": "post",
  chat: "chats",
  "chat-thread": "chats",
};
