import { useState, useRef, useEffect, useLayoutEffect, useCallback, useMemo, type UIEvent } from "react";
import {
  Search as SearchIcon,
  Bookmark,
  Trash2,
  Clock,
  Sofa,
  Building2,
  Paintbrush,
  Smartphone,
  UtensilsCrossed,
  Code2,
  Home,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { ScreenId } from "../types";
import { CloseButton } from "../../ui/CloseButton";
import { CategoryRow } from "../../ui/CategoryRow";
import {
  useSavedSearches,
  removeSavedSearch,
  clearAllSaved,
} from "@/data/savedSearches";
import {
  useRecentSearches,
  removeRecentSearch,
  clearAllRecent,
  filterCountFor,
} from "@/data/recentSearches";
import { getSearchSuggestions } from "@/data/searchSuggestions";
import { ConfirmDialog } from "../components/ConfirmDialog";

const SEARCH_TABS = ["recent", "saved"];

const POPULAR_CATEGORIES: { label: string; icon: LucideIcon; category: string; subcategory: string }[] = [
  { label: "furniture for sale", icon: Sofa, category: "for sale", subcategory: "furniture" },
  { label: "apartments for rent", icon: Building2, category: "housing", subcategory: "apartments / housing for rent" },
  { label: "design & media jobs", icon: Paintbrush, category: "jobs", subcategory: "art/media/design" },
  { label: "cell phones for sale", icon: Smartphone, category: "for sale", subcategory: "cell phones" },
  { label: "food & hospitality jobs", icon: UtensilsCrossed, category: "jobs", subcategory: "food/beverage/hospitality" },
  { label: "software & tech jobs", icon: Code2, category: "jobs", subcategory: "software/qa/dba/etc" },
  { label: "homes for sale", icon: Home, category: "housing", subcategory: "real estate" },
];

interface SearchScreenProps {
  onNavigate?: (screen: ScreenId) => void;
  searchTerm?: string | null;
  searchPlaceholder?: string;
  onSubmitSearch?: (term: string) => void;
  onCancelSearch?: () => void;
  onBrowseCategory?: (category: string, subcategory: string) => void;
  onRestoreSavedSearch?: (search: import("@/data/savedSearches").SavedSearch) => void;
}

type ConfirmAction =
  | { kind: "delete-saved"; id: string }
  | { kind: "clear-recent" }
  | { kind: "clear-saved" };

export function SearchScreen({
  onNavigate,
  searchTerm,
  searchPlaceholder = "search craigslist",
  onSubmitSearch,
  onCancelSearch,
  onBrowseCategory,
  onRestoreSavedSearch,
}: SearchScreenProps) {
  const saved = useSavedSearches();
  const recents = useRecentSearches();
  const [draft, setDraft] = useState(searchTerm ?? "");
  const [activeTab, setActiveTab] = useState<"recent" | "saved">(
    () => (saved.length > 0 ? "saved" : "recent")
  );
  const inputRef = useRef<HTMLInputElement>(null);

  const [confirmAction, setConfirmAction] = useState<ConfirmAction | null>(null);

  const contentScrollRef = useRef<HTMLDivElement>(null);
  const lastScrollTop = useRef(0);
  const collapsedRef = useRef(false);
  const [headerCollapsed, setHeaderCollapsed] = useState(false);

  const isTyping = draft.trim().length > 0;

  // Reset header to expanded when switching views (matches HomeScreen behavior on category change)
  const prevIsTypingRef = useRef(isTyping);
  const prevActiveTabRef = useRef(activeTab);
  useLayoutEffect(() => {
    if (prevIsTypingRef.current !== isTyping || prevActiveTabRef.current !== activeTab) {
      collapsedRef.current = false;
      setHeaderCollapsed(false);
      prevIsTypingRef.current = isTyping;
      prevActiveTabRef.current = activeTab;
    }
  }, [isTyping, activeTab]);

  /** Option C: when typing, 48px (4px gap + search bar). When !typing, fixed 92px (4px gap + search bar + 44px buffer). Recent/saved row overlays buffer. */
  const headerPaddingTop = isTyping ? 48 : 92;

  const handleContentScroll = useCallback((e: UIEvent<HTMLDivElement>) => {
    if (isTyping) return;
    const scrollTop = e.currentTarget.scrollTop;
    const delta = scrollTop - lastScrollTop.current;

    if (scrollTop <= 0) {
      if (collapsedRef.current) {
        collapsedRef.current = false;
        setHeaderCollapsed(false);
      }
    } else if (delta > 6 && !collapsedRef.current) {
      collapsedRef.current = true;
      setHeaderCollapsed(true);
    } else if (delta < -6 && collapsedRef.current) {
      collapsedRef.current = false;
      setHeaderCollapsed(false);
    }

    lastScrollTop.current = scrollTop;
  }, [isTyping]);

  useEffect(() => {
    inputRef.current?.focus();
    const raf = requestAnimationFrame(() => inputRef.current?.focus());
    return () => cancelAnimationFrame(raf);
  }, []);

  const handleSubmit = useCallback(
    (term: string) => {
      const trimmed = term.trim();
      if (!trimmed) return;
      if (onSubmitSearch) {
        onSubmitSearch(trimmed);
      } else {
        onNavigate?.("home");
      }
    },
    [onSubmitSearch, onNavigate],
  );

  const handleCancel = useCallback(() => {
    if (onCancelSearch) {
      onCancelSearch();
    } else {
      onNavigate?.("home");
    }
  }, [onCancelSearch, onNavigate]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        e.preventDefault();
        handleSubmit(draft);
      }
    },
    [draft, handleSubmit],
  );

  // --- Typing view data ---
  const draftLower = draft.trim().toLowerCase();

  const filteredSaved = useMemo(
    () =>
      isTyping
        ? saved.filter(
            (s) =>
              s.category.toLowerCase().startsWith(draftLower) ||
              (s.subcategory?.toLowerCase().startsWith(draftLower) ?? false) ||
              (s.searchTerm?.toLowerCase().startsWith(draftLower) ?? false),
          )
        : [],
    [isTyping, saved, draftLower],
  );

  const filteredRecent = useMemo(
    () =>
      isTyping
        ? recents.filter((r) => r.term.toLowerCase().startsWith(draftLower))
        : [],
    [isTyping, recents, draftLower],
  );

  const excludeTerms = useMemo(() => {
    const set = new Set<string>();
    for (const s of filteredSaved) {
      if (s.searchTerm) set.add(s.searchTerm.toLowerCase());
    }
    for (const r of filteredRecent) {
      set.add(r.term.toLowerCase());
    }
    return set;
  }, [filteredSaved, filteredRecent]);

  const suggestions = useMemo(
    () => (isTyping ? getSearchSuggestions(draftLower, excludeTerms) : []),
    [isTyping, draftLower, excludeTerms],
  );

  const contentIsEmpty =
    isTyping
      ? filteredSaved.length + filteredRecent.length + suggestions.length === 0
      : activeTab === "recent"
        ? recents.length === 0
        : saved.length === 0;

  // --- Confirm dialog helpers ---
  const confirmDialogProps = useMemo(() => {
    if (!confirmAction) return null;
    switch (confirmAction.kind) {
      case "delete-saved":
        return {
          title: "delete saved search?",
          message: "this saved search will be permanently removed.",
          confirmLabel: "delete",
          destructive: true,
          onConfirm: () => removeSavedSearch(confirmAction.id),
        };
      case "clear-recent":
        return {
          title: "reset all recent searches?",
          message: "this action is permanent.",
          confirmLabel: "reset searches",
          destructive: true,
          onConfirm: () => clearAllRecent(),
        };
      case "clear-saved":
        return {
          title: "reset all saved searches?",
          message: "this action is permanent.",
          confirmLabel: "reset searches",
          destructive: true,
          onConfirm: () => clearAllSaved(),
        };
    }
  }, [confirmAction]);

  function savedFilterCount(s: { filters?: Record<string, string>; sortBy?: string }): number {
    return filterCountFor(s);
  }

  function formatSavedSecondLine(s: import("@/data/savedSearches").SavedSearch): string {
    const count = filterCountFor(s);
    const parts: string[] = [];
    if (s.searchTerm) parts.push(`"${s.searchTerm}"`);
    if (count > 0) parts.push(`${count} filter${count !== 1 ? "s" : ""} applied`);
    return parts.join(" · ");
  }

  return (
    <div className="relative h-full bg-cl-bg">
      {/* Header — Layer 1: safe-area + search bar (fixed). Layer 2: recent/saved row overlay when !typing. */}
      <div className="absolute top-0 left-0 right-0 z-10">
        {/* Layer 1: safe-area + 4px gap + search bar — always in layout flow */}
        <div
          className={`bg-cl-surface ${isTyping || headerCollapsed ? "border-b-[0.5px] border-cl-border" : ""}`}
        >
          <div style={{ height: "var(--safe-area-top)" }} aria-hidden />
          <div style={{ height: 4 }} aria-hidden />
          <div className="flex h-header-bar items-center gap-2 px-4">
            <div
              className="flex flex-1 items-center gap-2.5 rounded-[--radius-button] border-2 border-cl-border bg-cl-surface px-3 h-search-input cursor-text focus-within:border-cl-accent transition-colors"
              onClick={() => inputRef.current?.focus()}
            >
              <SearchIcon className="h-4 w-4 shrink-0 text-cl-text-muted pointer-events-none" />
              <input
                ref={inputRef}
                type="text"
                autoFocus
                enterKeyHint="search"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={searchPlaceholder}
                className="w-0 flex-1 bg-transparent text-base text-cl-text placeholder:text-cl-text-muted outline-none text-ellipsis"
              />
              {draft.length > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    setDraft("");
                    inputRef.current?.focus();
                  }}
                  className="flex shrink-0 items-center justify-center rounded-full bg-cl-text-muted/80 p-[2px] outline-none active:opacity-70"
                  aria-label="Clear text"
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="text-white">
                    <path d="M4 4l6 6M10 4l-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                  </svg>
                </button>
              )}
            </div>
            <CloseButton onClick={handleCancel} aria-label="Cancel search" />
          </div>
        </div>

        {/* Layer 2: recent/saved row overlay — overlays the 44px buffer when !typing (4px overlap eliminates gap) */}
        {!isTyping && (
          <div
            className={`absolute left-0 right-0 z-10 overflow-hidden bg-cl-surface ${!headerCollapsed ? "border-b-[0.5px] border-cl-border" : ""}`}
            style={{ top: "calc(var(--safe-area-top) + 4px + 40px)" }}
          >
            <CategoryRow
              labels={SEARCH_TABS}
              activeLabel={activeTab}
              onLabelChange={(label) => setActiveTab(label as typeof activeTab)}
              collapsed={headerCollapsed}
              preventFocusSteal
              rightSlot={
                (activeTab === "recent" && recents.length > 0) ? (
                  <button
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => setConfirmAction({ kind: "clear-recent" })}
                    className="text-[13px] font-medium text-cl-accent outline-none active:opacity-70 whitespace-nowrap"
                  >
                    reset recent
                  </button>
                ) : (activeTab === "saved" && saved.length > 0) ? (
                  <button
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => setConfirmAction({ kind: "clear-saved" })}
                    className="text-[13px] font-medium text-cl-accent outline-none active:opacity-70 whitespace-nowrap"
                  >
                    reset saved
                  </button>
                ) : undefined
              }
            />
          </div>
        )}
      </div>

      {/* Content area — full height from top, padding-top reserves space for header */}
      <div
        ref={contentScrollRef}
        className={`absolute inset-0 overflow-y-auto overscroll-contain scrollbar-none pb-[72px] ${contentIsEmpty ? "bg-cl-bg" : "bg-cl-surface"}`}
        style={{ paddingTop: `calc(var(--safe-area-top) + ${headerPaddingTop}px)` }}
        onScroll={handleContentScroll}
      >
        {isTyping ? (
          /* ─── Typing view ─── */
          <TypingView
            filteredSaved={filteredSaved}
            filteredRecent={filteredRecent}
            suggestions={suggestions}
            savedFilterCount={savedFilterCount}
            formatSavedSecondLine={formatSavedSecondLine}
            filterCountFor={filterCountFor}
            onSubmit={handleSubmit}
            onDeleteSaved={(id) => setConfirmAction({ kind: "delete-saved", id })}
            onDeleteRecent={(id) => removeRecentSearch(id)}
          />
        ) : activeTab === "recent" ? (
          <>
            {recents.length > 0 ? (
              <ul>
                {recents.map((r, i) => {
                  const count = filterCountFor(r);
                  return (
                    <li key={r.id}>
                      {i > 0 && <div className="ml-[52px] border-t-[0.5px] border-cl-border" />}
                      <button
                        type="button"
                        onClick={() => handleSubmit(r.term)}
                        className="flex h-[56px] w-full items-center gap-3 px-5 py-3 text-left outline-none active:bg-cl-bg-secondary transition-colors"
                      >
                        <Clock className="h-5 w-5 shrink-0 text-cl-accent" />
                        <div className="flex-1 min-w-0">
                          <span className="block text-[15px] text-cl-text truncate">
                            {r.term}
                          </span>
                          {r.newSinceSearched != null && r.newSinceSearched > 0 && (
                            <span className="flex items-center gap-1.5 text-[12px] text-cl-text-muted">
                              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-cl-accent" aria-hidden />
                              +{r.newSinceSearched} since you searched
                            </span>
                          )}
                          {count > 0 && (
                            <span className="block text-[12px] text-cl-text-muted">
                              {count} filter{count !== 1 ? "s" : ""} applied
                            </span>
                          )}
                        </div>
                        <div
                          role="button"
                          tabIndex={0}
                          onClick={(e) => { e.stopPropagation(); removeRecentSearch(r.id); }}
                          onKeyDown={(e) => { if (e.key === "Enter") { e.stopPropagation(); removeRecentSearch(r.id); } }}
                          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[--radius-button] outline-none text-cl-destructive"
                          aria-label="Remove recent search"
                        >
                          <Trash2 className="h-5 w-5" />
                        </div>
                      </button>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <>
                {/* Empty state hero */}
                <div className="flex flex-col items-center px-6 pt-12">
                  <div className="flex h-16 w-16 items-center justify-center rounded-[--radius-card-lg] bg-cl-accent/10">
                    <SearchIcon className="h-6 w-6 text-cl-accent" strokeWidth={1.8} aria-hidden />
                  </div>
                  <p className="mt-4 text-[17px] font-semibold text-cl-text">
                    no recent searches
                  </p>
                  <p className="mt-1 text-[12px] text-cl-text-muted text-center">
                    your search history will appear here.
                  </p>
                </div>

                {/* Popular categories */}
                <div className="pt-8">
                  <span className="px-5 text-[11px] font-semibold text-cl-text-muted uppercase tracking-wide">
                    popular categories
                  </span>
                  <ul className="mt-1">
                    {POPULAR_CATEGORIES.map(({ label, icon: Icon, category, subcategory }) => (
                      <li key={label}>
                        <button
                          type="button"
                          onClick={() => onBrowseCategory?.(category, subcategory)}
                          className="flex w-full items-center gap-3 px-5 py-3 min-h-[44px] text-left outline-none active:bg-cl-bg-secondary transition-colors"
                        >
                          <Icon className="h-5 w-5 shrink-0 text-cl-accent" strokeWidth={2.5} />
                          <span className="text-[15px] font-semibold text-cl-accent truncate">
                            {label}
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </>
            )}
          </>
        ) : (
          <>
            {saved.length === 0 ? (
              <div className="flex flex-col items-center px-6 pt-12">
                <div className="flex h-16 w-16 items-center justify-center rounded-[--radius-card-lg] bg-cl-accent/10">
                  <Bookmark className="h-6 w-6 text-cl-accent" strokeWidth={1.8} aria-hidden />
                </div>
                <p className="mt-4 text-[17px] font-semibold text-cl-text">
                  no saved searches
                </p>
                <p className="mt-1 text-[12px] text-cl-text-muted text-center">
                  searches you save will appear here.
                </p>
              </div>
            ) : (
              <ul>
                {saved.map((s, i) => (
                  <li key={s.id}>
                    {i > 0 && <div className="ml-[52px] border-t-[0.5px] border-cl-border" />}
                    <button
                      type="button"
                      onClick={() => onRestoreSavedSearch?.(s)}
                      className="flex h-[56px] w-full items-center gap-3 px-5 py-3 text-left outline-none active:bg-cl-bg-secondary transition-colors"
                    >
                      <Bookmark className="h-5 w-5 shrink-0 text-cl-accent" />
                      <div className="flex-1 min-w-0">
                        <span className="block text-[15px] text-cl-text truncate">
                          {s.subcategory
                            ? `${s.category} › ${s.subcategory}`
                            : s.category}
                        </span>
                        <span className="block text-[12px] text-cl-text-muted truncate">
                          {formatSavedSecondLine(s)}
                        </span>
                      </div>
                      <div
                        role="button"
                        tabIndex={0}
                        onClick={(e) => { e.stopPropagation(); setConfirmAction({ kind: "delete-saved", id: s.id }); }}
                        onKeyDown={(e) => { if (e.key === "Enter") { e.stopPropagation(); setConfirmAction({ kind: "delete-saved", id: s.id }); } }}
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[--radius-button] outline-none text-cl-destructive"
                        aria-label="Remove saved search"
                      >
                        <Trash2 className="h-5 w-5" />
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </div>

      {/* Confirm dialog */}
      {confirmDialogProps && (
        <ConfirmDialog
          open={confirmAction !== null}
          onClose={() => setConfirmAction(null)}
          {...confirmDialogProps}
        />
      )}
    </div>
  );
}

// ─── Typing View ─────────────────────────────────────────────

interface TypingViewProps {
  filteredSaved: ReturnType<typeof useSavedSearches>;
  filteredRecent: ReturnType<typeof useRecentSearches>;
  suggestions: string[];
  savedFilterCount: (s: { filters?: Record<string, string>; sortBy?: string }) => number;
  formatSavedSecondLine: (s: import("@/data/savedSearches").SavedSearch) => string;
  filterCountFor: (s: { filters?: Record<string, string>; sortBy?: string }) => number;
  onSubmit: (term: string) => void;
  onDeleteSaved: (id: string) => void;
  onDeleteRecent: (id: string) => void;
}

function TypingView({
  filteredSaved,
  filteredRecent,
  suggestions,
  savedFilterCount: _savedFilterCount,
  formatSavedSecondLine,
  filterCountFor: getFilterCount,
  onSubmit,
  onDeleteSaved,
  onDeleteRecent,
}: TypingViewProps) {
  const totalItems =
    filteredSaved.length + filteredRecent.length + suggestions.length;

  if (totalItems === 0) return null;

  let idx = 0;

  return (
    <ul>
      {filteredSaved.map((s) => {
        const isFirst = idx === 0;
        idx++;
        return (
          <li key={`saved-${s.id}`}>
            {!isFirst && <div className="ml-[52px] border-t-[0.5px] border-cl-border" />}
            <button
              type="button"
              onClick={() => onSubmit(s.searchTerm ?? s.subcategory ?? s.category)}
              className="flex h-[56px] w-full items-center gap-3 px-5 py-3 text-left outline-none active:bg-cl-bg-secondary transition-colors"
            >
              <Bookmark className="h-5 w-5 shrink-0 text-cl-accent" />
              <div className="flex-1 min-w-0">
                <span className="block text-[15px] text-cl-text truncate">
                  {s.subcategory
                    ? `${s.category} › ${s.subcategory}`
                    : s.category}
                </span>
                {formatSavedSecondLine(s) && (
                  <span className="block text-[12px] text-cl-text-muted truncate">
                    {formatSavedSecondLine(s)}
                  </span>
                )}
              </div>
              <div
                role="button"
                tabIndex={0}
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteSaved(s.id);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") { e.stopPropagation(); onDeleteSaved(s.id); }
                }}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[--radius-button] outline-none text-cl-destructive"
                aria-label="Remove saved search"
              >
                <Trash2 className="h-5 w-5" />
              </div>
            </button>
          </li>
        );
      })}

      {filteredRecent.map((r) => {
        const isFirst = idx === 0;
        idx++;
        const count = getFilterCount(r);
        return (
          <li key={`recent-${r.id}`}>
            {!isFirst && <div className="ml-[52px] border-t-[0.5px] border-cl-border" />}
            <button
              type="button"
              onClick={() => onSubmit(r.term)}
              className="flex h-[56px] w-full items-center gap-3 px-5 py-3 text-left outline-none active:bg-cl-bg-secondary transition-colors"
            >
              <Clock className="h-5 w-5 shrink-0 text-cl-accent" />
              <div className="flex-1 min-w-0">
                <span className="block text-[15px] text-cl-text truncate">
                  {r.term}
                </span>
                {r.newSinceSearched != null && r.newSinceSearched > 0 && (
                  <span className="flex items-center gap-1.5 text-[12px] text-cl-text-muted">
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-cl-accent" aria-hidden />
                    +{r.newSinceSearched} since you searched
                  </span>
                )}
                {count > 0 && (
                  <span className="block text-[12px] text-cl-text-muted">
                    {count} filter{count !== 1 ? "s" : ""} applied
                  </span>
                )}
              </div>
              <div
                role="button"
                tabIndex={0}
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteRecent(r.id);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") { e.stopPropagation(); onDeleteRecent(r.id); }
                }}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[--radius-button] outline-none text-cl-destructive"
                aria-label="Remove recent search"
              >
                <Trash2 className="h-5 w-5" />
              </div>
            </button>
          </li>
        );
      })}

      {suggestions.map((term) => {
        const isFirst = idx === 0;
        idx++;
        return (
          <li key={`sug-${term}`}>
            {!isFirst && <div className="ml-[52px] border-t-[0.5px] border-cl-border" />}
            <button
              type="button"
              onClick={() => onSubmit(term)}
              className="flex h-[56px] w-full items-center gap-3 px-5 py-3 text-left outline-none active:bg-cl-bg-secondary transition-colors"
            >
              <SearchIcon className="h-5 w-5 shrink-0 text-cl-accent" />
              <span className="min-w-0 flex-1 text-[15px] text-cl-text truncate">
                {term}
              </span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
