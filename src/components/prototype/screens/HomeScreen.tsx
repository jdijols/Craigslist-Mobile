import { useState, useRef, useCallback, useEffect, useLayoutEffect, useMemo } from "react";
import {
  Search,
  MapPin,
  ChevronDown,
  Navigation,
  ArrowUpDown,
  Bookmark,
  SlidersHorizontal,
} from "lucide-react";
import { MapIcon, ThumbViewIcon } from "../components/ViewModeDrawer";
import type { ScreenId } from "../types";
import type { ViewMode, ListingData } from "../../ui/cards";
import { SearchChip } from "../../ui/SearchChip";
import { CategoryRow } from "../../ui/CategoryRow";
import { categories as categoryData, getCategoryById } from "../../../data/categories";
import { addSavedSearch, useSavedSearches, removeSavedSearch } from "../../../data/savedSearches";
import { useOverlayFade } from "../../../hooks/useOverlayFade";
import { SubcategoryDrawer } from "../components/SubcategoryDrawer";
import { ViewModeDrawer } from "../components/ViewModeDrawer";
import { LocationPicker } from "../components/LocationPicker";
import { useLocation } from "../../../contexts/LocationContext";
import { ShareIcon } from "../../ui/ShareIcon";
import { MapView } from "../components/MapView";
import { MAP_CENTER, MAP_ZOOM } from "../components/StaticMapLayer";
import { haversineMiles, getListingCoords } from "../../../utils/geo";
import { parsePriceToCents, parseTimeToMinutes, parseDistanceOption } from "../../../utils/format";
import { useMapSync } from "../../../hooks/useMapSync";
import { ShareSheet } from "../components/ShareSheet";
import { SortFilterDrawer, DEFAULT_SORT, DEFAULT_DISTANCE, type SortOption, type FilterSection } from "../components/SortFilterDrawer";
import { MicroCard } from "../../ui/cards/MicroCard";
import { ThumbCard } from "../../ui/cards/ThumbCard";
import { MediumCard } from "../../ui/cards/MediumCard";
import { GalleryCard } from "../../ui/cards/GalleryCard";
import { SlideCard } from "../../ui/cards/SlideCard";
import { GridCard } from "../../ui/cards/GridCard";
import { ListCard } from "../../ui/cards/ListCard";
import { CollectionSection } from "../../ui/collections/CollectionSection";
import { ScrollRow } from "../../ui/collections/ScrollRow";
import { ThumbGrid } from "../../ui/collections/ThumbGrid";
import { ResultsCaption } from "../../ui/ResultsCaption";
import { EndOfFeed } from "../../ui/EndOfFeed";
import {
  servicesMicro,
  popularForSale,
  popularItemsHennepin,
  jobsRamsey,
  homesDakotaScott,
  housingMedium,
  communitySlides,
  gigsMicro,
  trendingFurniture,
  getListingsForCategory,
  searchAllListings,
  searchCategoryListings,
} from "../../../data/feed";

const CHIP_LABELS = ["all CL", ...categoryData.map((c) => c.name.toLowerCase())];

function chipLabelToCategoryId(label: string): string {
  const cat = categoryData.find((c) => c.name.toLowerCase() === label);
  return cat?.id ?? label;
}

function getSubcategories(chipLabel: string): string[] {
  const id = chipLabelToCategoryId(chipLabel);
  return getCategoryById(id)?.subcategories ?? [];
}

function getCategoryDisplayName(chipLabel: string): string {
  const cat = categoryData.find((c) => c.name.toLowerCase() === chipLabel);
  return cat?.name ?? chipLabel;
}

export interface RestoreData {
  sortBy?: string;
  distance?: string;
  minPrice?: string;
  maxPrice?: string;
}

interface HomeScreenProps {
  onNavigate?: (screen: ScreenId) => void;
  onOpenListing?: (listing: ListingData) => void;
  activeCategory: string;
  onCategoryChange: (category: string) => void;
  activeSubcategory: string | null;
  onSubcategoryChange: (subcategory: string | null) => void;
  searchTerm?: string | null;
  onClearSearch?: () => void;
  resetSignal?: number;
  restoreSignal?: number;
  restoreDataRef?: React.RefObject<RestoreData | null>;
  onScrollToTopRequest?: () => void;
  initialViewMode?: ViewMode;
  /** When true, opens the subcategory drawer (e.g. for presentation slides). */
  initialSubcategoryDrawerOpen?: boolean;
}

export function HomeScreen({
  onNavigate,
  onOpenListing,
  activeCategory,
  onCategoryChange,
  activeSubcategory,
  onSubcategoryChange,
  searchTerm,
  onClearSearch,
  resetSignal,
  restoreSignal,
  restoreDataRef,
  onScrollToTopRequest,
  initialViewMode,
  initialSubcategoryDrawerOpen,
}: HomeScreenProps) {
  const [drawerOpen, setDrawerOpen] = useState(initialSubcategoryDrawerOpen ?? false);
  useEffect(() => {
    setDrawerOpen(initialSubcategoryDrawerOpen === true);
  }, [initialSubcategoryDrawerOpen]);
  const [showFilters, setShowFilters] = useState(false);
  const [filterInitialSections, setFilterInitialSections] = useState<FilterSection[] | undefined>(undefined);
  const [viewMode, setViewMode] = useState<ViewMode>(initialViewMode ?? "thumb");
  const [activeSort, setActiveSort] = useState<SortOption>(DEFAULT_SORT);

  useEffect(() => {
    if (initialViewMode != null) setViewMode(initialViewMode);
  }, [initialViewMode]);
  const [activeDistance, setActiveDistance] = useState(DEFAULT_DISTANCE);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [locationPickerOpen, setLocationPickerOpen] = useState(false);
  const { selectedLocation, setSelectedLocation, locationName } = useLocation();
  const [viewDrawerOpen, setViewDrawerOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const { overlayVisible, handleOverlayScroll, restoreOverlay } = useOverlayFade();

  const hasActiveSort = activeSort !== DEFAULT_SORT;
  const hasActiveFilters =
    activeDistance !== DEFAULT_DISTANCE ||
    minPrice !== "" ||
    maxPrice !== "";

  const handleFilterReset = useCallback(() => {
    setActiveSort(DEFAULT_SORT);
    setActiveDistance(DEFAULT_DISTANCE);
    setMinPrice("");
    setMaxPrice("");
  }, []);

  const contentScrollRef = useRef<HTMLDivElement>(null);

  const lastScrollTop = useRef(0);
  const collapsedRef = useRef(false);
  const scrollCooldown = useRef(0);
  const [headerCollapsed, setHeaderCollapsed] = useState(false);

  const scrollPositionsRef = useRef<Record<string, number>>({});
  const prevViewKeyRef = useRef<string | null>(null);

  const isHome = activeCategory === "all CL";
  const isMapView = viewMode === "map";
  const showOverlay = !isHome || !!searchTerm;

  const viewKey = searchTerm ? `search|${searchTerm}` : isHome ? "all CL" : `${activeCategory}|${activeSubcategory ?? ""}`;

  useLayoutEffect(() => {
    const el = contentScrollRef.current;
    const restore = scrollPositionsRef.current[viewKey] ?? 0;
    collapsedRef.current = false;
    setHeaderCollapsed(false);
    lastScrollTop.current = restore;
    scrollCooldown.current = Date.now() + 150;
    if (el) el.scrollTop = restore;
    prevViewKeyRef.current = viewKey;
  }, [viewKey]);

  const wrappedOnCategoryChange = useCallback(
    (cat: string) => {
      const currentKey = searchTerm ? `search|${searchTerm}` : isHome ? "all CL" : `${activeCategory}|${activeSubcategory ?? ""}`;
      scrollPositionsRef.current[currentKey] = contentScrollRef.current?.scrollTop ?? 0;
      onCategoryChange(cat);
    },
    [searchTerm, isHome, activeCategory, activeSubcategory, onCategoryChange],
  );

  const wrappedOnSubcategoryChange = useCallback(
    (sub: string | null) => {
      const currentKey = searchTerm ? `search|${searchTerm}` : isHome ? "all CL" : `${activeCategory}|${activeSubcategory ?? ""}`;
      scrollPositionsRef.current[currentKey] = contentScrollRef.current?.scrollTop ?? 0;
      onSubcategoryChange(sub);
    },
    [searchTerm, isHome, activeCategory, activeSubcategory, onSubcategoryChange],
  );

  const savedSearches = useSavedSearches();
  const categoryIdForSave = chipLabelToCategoryId(activeCategory);

  const buildFilters = useCallback((): Record<string, string> | undefined => {
    const f: Record<string, string> = {};
    if (activeDistance !== DEFAULT_DISTANCE) f.distance = activeDistance;
    if (minPrice) f.minPrice = minPrice;
    if (maxPrice) f.maxPrice = maxPrice;
    return Object.keys(f).length > 0 ? f : undefined;
  }, [activeDistance, minPrice, maxPrice]);

  const savedEntry = savedSearches.find((s) => {
    if (s.category !== categoryIdForSave) return false;
    if ((s.subcategory ?? undefined) !== (activeSubcategory ?? undefined)) return false;
    if ((s.searchTerm ?? undefined) !== (searchTerm ?? undefined)) return false;
    const currentSort = activeSort !== DEFAULT_SORT ? activeSort : undefined;
    if ((s.sortBy ?? undefined) !== (currentSort ?? undefined)) return false;
    const currentFilters = buildFilters();
    const savedFilters = s.filters;
    if (!currentFilters && !savedFilters) return true;
    if (!currentFilters || !savedFilters) return false;
    const cKeys = Object.keys(currentFilters).sort();
    const sKeys = Object.keys(savedFilters).sort();
    if (cKeys.length !== sKeys.length) return false;
    return cKeys.every((k) => currentFilters[k] === savedFilters[k]);
  });
  const isSaved = !!savedEntry;
  const handleSave = useCallback(() => {
    if (isSaved && savedEntry) {
      removeSavedSearch(savedEntry.id);
    } else {
      addSavedSearch({
        category: categoryIdForSave,
        subcategory: activeSubcategory ?? undefined,
        searchTerm: searchTerm ?? undefined,
        sortBy: activeSort !== DEFAULT_SORT ? activeSort : undefined,
        filters: buildFilters(),
      });
    }
  }, [isSaved, savedEntry, categoryIdForSave, activeSubcategory, searchTerm, activeSort, buildFilters]);

  useEffect(() => {
    if (!resetSignal) return;
    scrollPositionsRef.current["all CL"] = 0;
    prevViewKeyRef.current = "all CL";
    contentScrollRef.current?.scrollTo({ top: 0, behavior: "smooth" });
    setViewMode("thumb");
    setActiveSort(DEFAULT_SORT);
    setActiveDistance(DEFAULT_DISTANCE);
    setMinPrice("");
    setMaxPrice("");
    setDrawerOpen(false);
    setShowFilters(false);
    setLocationPickerOpen(false);
    collapsedRef.current = false;
    setHeaderCollapsed(false);
    lastScrollTop.current = 0;
  }, [resetSignal]);

  useEffect(() => {
    if (!restoreSignal) return;
    const data = restoreDataRef?.current;
    setActiveSort((data?.sortBy as SortOption) ?? DEFAULT_SORT);
    setActiveDistance(data?.distance ?? DEFAULT_DISTANCE);
    setMinPrice(data?.minPrice ?? "");
    setMaxPrice(data?.maxPrice ?? "");
    contentScrollRef.current?.scrollTo({ top: 0, behavior: "smooth" });
    collapsedRef.current = false;
    setHeaderCollapsed(false);
    lastScrollTop.current = 0;
  }, [restoreSignal]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleContentScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const now = Date.now();
    const scrollTop = e.currentTarget.scrollTop;

    if (now < scrollCooldown.current) {
      lastScrollTop.current = scrollTop;
      return;
    }

    const delta = scrollTop - lastScrollTop.current;

    if (scrollTop <= 0) {
      if (collapsedRef.current) {
        collapsedRef.current = false;
        setHeaderCollapsed(false);
        scrollCooldown.current = now + 400;
      }
    } else if (delta > 6 && !collapsedRef.current) {
      collapsedRef.current = true;
      setHeaderCollapsed(true);
      scrollCooldown.current = now + 400;
    } else if (delta < -6 && collapsedRef.current) {
      collapsedRef.current = false;
      setHeaderCollapsed(false);
      scrollCooldown.current = now + 400;
    }

    lastScrollTop.current = scrollTop;
  }, []);

  const chipLabels = useMemo(
    () => CHIP_LABELS.map((name) =>
      name === activeCategory && activeSubcategory
        ? activeSubcategory.toLowerCase()
        : name
    ),
    [activeCategory, activeSubcategory],
  );

  const activeChipLabel = activeSubcategory
    ? activeSubcategory.toLowerCase()
    : activeCategory;

  const handleCategoryChange = useCallback(
    (label: string) => {
      const originalName = CHIP_LABELS.find(
        (c) => c === label || (c === activeCategory && label === activeSubcategory?.toLowerCase()),
      ) ?? label;

      if (originalName === activeCategory && originalName !== "all CL" && getSubcategories(originalName).length > 0) {
        setDrawerOpen(true);
        return;
      }

      if (originalName === "all CL" && activeCategory === "all CL" && searchTerm) {
        onClearSearch?.();
        onSubcategoryChange(null);
        return;
      }

      if (originalName === "all CL" && activeCategory === "all CL" && !searchTerm) {
        onScrollToTopRequest?.();
        return;
      }

      const currentKey = searchTerm ? `search|${searchTerm}` : isHome ? "all CL" : `${activeCategory}|${activeSubcategory ?? ""}`;
      scrollPositionsRef.current[currentKey] = contentScrollRef.current?.scrollTop ?? 0;
      onCategoryChange(originalName);
      onSubcategoryChange(null);
    },
    [activeCategory, activeSubcategory, isHome, searchTerm, onCategoryChange, onSubcategoryChange, onClearSearch, onScrollToTopRequest],
  );

  const handleCategoryLongPress = useCallback(
    (label: string) => {
      const originalName = CHIP_LABELS.find(
        (c) => c === label || (c === activeCategory && label === activeSubcategory?.toLowerCase()),
      ) ?? label;
      if (originalName === "all CL") return;
      if (getSubcategories(originalName).length > 0) setDrawerOpen(true);
    },
    [activeCategory, activeSubcategory],
  );

  const renderChevron = useCallback(
    (label: string) => {
      const originalName = CHIP_LABELS.find(
        (c) => c === label || (c === activeCategory && label === activeSubcategory?.toLowerCase()),
      ) ?? label;
      if (originalName === "all CL") return null;
      if (getSubcategories(originalName).length === 0) return null;
      return <ChevronDown className="h-3 w-3 ml-0.5" />;
    },
    [activeCategory, activeSubcategory],
  );

  return (
    <div className="relative flex h-full flex-col">
      {/* Header */}
      <div className="bg-cl-surface border-b-[0.5px] border-cl-border">
        {/* Locator / search row */}
        <div className="flex h-header-bar items-center gap-3 pl-1.5 pr-4">
          <button
            type="button"
            onClick={() => setLocationPickerOpen(true)}
            className="flex shrink-0 min-h-[44px] items-center gap-1.5 outline-none px-2.5"
            aria-label="Change location"
          >
            <MapPin className="h-5 w-5 text-cl-accent" />
            <span className="text-base font-semibold leading-[25px] text-cl-accent">
              {locationName}
            </span>
          </button>

          {searchTerm ? (
            <div className="flex min-w-0 flex-1 justify-end">
              <SearchChip
                term={searchTerm}
                onClear={() => onClearSearch?.()}
                onEdit={() => onNavigate?.("search")}
              />
            </div>
          ) : (
            <div className="flex flex-1 justify-end">
              <button
                type="button"
                onClick={() => onNavigate?.("search")}
                className="flex h-11 w-11 min-h-[44px] min-w-[44px] shrink-0 cursor-pointer items-center justify-center rounded-[--radius-button] outline-none active:opacity-70"
                aria-label="Search"
              >
                <Search className="h-6 w-6 text-cl-text" strokeWidth={1.8} />
              </button>
            </div>
          )}
        </div>

        {/* Category chip row */}
        <CategoryRow
          labels={chipLabels}
          activeLabel={activeChipLabel}
          onLabelChange={handleCategoryChange}
          collapsed={headerCollapsed}
          onLongPress={handleCategoryLongPress}
          renderTrailing={renderChevron}
        />
      </div>

      {/* Content area */}
      {searchTerm ? (
        <SearchResultsContent
          searchTerm={searchTerm}
          activeCategory={activeCategory}
          activeSubcategory={activeSubcategory}
          onOpenListing={onOpenListing}
          onContentScroll={handleContentScroll}
          onOverlayScroll={handleOverlayScroll}
          activeSort={activeSort}
          activeDistance={activeDistance}
          onDistanceChange={setActiveDistance}
          minPrice={minPrice}
          maxPrice={maxPrice}
          viewMode={viewMode}
          scrollRef={contentScrollRef}
        />
      ) : isHome ? (
        <CuratedFeed
          onNavigate={onNavigate}
          onOpenListing={onOpenListing}
          onCategoryChange={wrappedOnCategoryChange}
          onSubcategoryChange={wrappedOnSubcategoryChange}
          onContentScroll={handleContentScroll}
          scrollRef={contentScrollRef}
          locationName={locationName}
        />
      ) : (
        <CategoryContent
          onNavigate={onNavigate}
          onOpenListing={onOpenListing}
          onShowFilters={(sections) => {
            setFilterInitialSections(sections);
            setShowFilters(true);
          }}
          onContentScroll={handleContentScroll}
          onOverlayScroll={handleOverlayScroll}
          overlayVisible={overlayVisible}
          restoreOverlay={restoreOverlay}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          activeCategory={activeCategory}
          activeSubcategory={activeSubcategory}
          activeSort={activeSort}
          activeDistance={activeDistance}
          onDistanceChange={setActiveDistance}
          minPrice={minPrice}
          maxPrice={maxPrice}
          hasActiveFilters={hasActiveFilters}
          hasActiveSort={hasActiveSort}
          onFilterReset={handleFilterReset}
          headerCollapsed={headerCollapsed}
          onRestoreHeader={() => {
            if (collapsedRef.current) {
              collapsedRef.current = false;
              setHeaderCollapsed(false);
            }
          }}
          scrollRef={contentScrollRef}
        />
      )}

      {/* ── Persistent overlay buttons (visible in category + search) ── */}
      {showOverlay && (
        <>
          <div
            className={`absolute bottom-[84px] left-3 z-20 flex min-w-[44px] min-h-[44px] w-11 flex-col overflow-hidden rounded-[--radius-button] bg-cl-surface/90 shadow-md backdrop-blur-[6px] transition-transform duration-300 ease-in-out ${overlayVisible ? "translate-x-0" : "-translate-x-[calc(100%+12px)]"}`}
          >
            <button
              type="button"
              onClick={() => setViewDrawerOpen(true)}
              className="flex flex-1 w-full min-h-[44px] min-w-[44px] items-center justify-center outline-none"
              aria-label="Change view"
            >
              {isMapView ? (
                <ThumbViewIcon className="h-5 w-5 text-cl-text shrink-0" />
              ) : (
                <MapIcon className="h-5 w-5 text-cl-text shrink-0" />
              )}
            </button>
          </div>

          <div
            className={`absolute bottom-[84px] right-3 z-20 flex min-w-[44px] w-11 flex-col overflow-hidden rounded-[--radius-button] bg-cl-surface/90 shadow-md backdrop-blur-[6px] transition-transform duration-300 ease-in-out ${overlayVisible ? "translate-x-0" : "translate-x-[calc(100%+12px)]"}`}
            style={{ minHeight: isMapView ? 120 : 160 }}
          >
            {!isMapView && (
              <>
                <button
                  type="button"
                  onClick={() => {
                    setFilterInitialSections(["sort"]);
                    setShowFilters(true);
                  }}
                  className="flex flex-1 w-full min-h-[44px] min-w-[44px] items-center justify-center outline-none"
                  aria-label="Sort"
                >
                  <div className="relative">
                    <ArrowUpDown className={`h-5 w-5 shrink-0 ${hasActiveSort ? "text-cl-accent" : "text-cl-text"}`} />
                    {hasActiveSort && <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 h-1 w-1 rounded-full bg-cl-accent" />}
                  </div>
                </button>
                <div className="shrink-0 border-t-[0.5px] border-cl-border" />
              </>
            )}
            <button
              type="button"
              onClick={() => {
                const sections: FilterSection[] = [];
                if (activeDistance !== DEFAULT_DISTANCE) sections.push("distance");
                if (minPrice || maxPrice) sections.push("price");
                setFilterInitialSections(sections.length > 0 ? sections : undefined);
                setShowFilters(true);
              }}
              className="flex flex-1 w-full min-h-[44px] min-w-[44px] items-center justify-center outline-none"
              aria-label="Filter"
            >
              <div className="relative">
                <SlidersHorizontal className={`h-5 w-5 shrink-0 ${hasActiveFilters ? "text-cl-accent" : "text-cl-text"}`} />
                {hasActiveFilters && <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 h-1 w-1 rounded-full bg-cl-accent" />}
              </div>
            </button>
            <div className="shrink-0 border-t-[0.5px] border-cl-border" />
            <button
              type="button"
              onClick={handleSave}
              className="flex flex-1 w-full min-h-[44px] min-w-[44px] items-center justify-center outline-none"
              aria-label={isSaved ? "Search saved" : "Save this search"}
            >
              <div className="relative">
                <Bookmark
                  className={`h-5 w-5 shrink-0 ${isSaved ? "text-cl-accent" : "text-cl-text"}`}
                  fill="none"
                />
                {isSaved && <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 h-1 w-1 rounded-full bg-cl-accent" />}
              </div>
            </button>
            <div className="shrink-0 border-t-[0.5px] border-cl-border" />
            <button
              type="button"
              onClick={() => setShareOpen(true)}
              className="flex flex-1 w-full min-h-[44px] min-w-[44px] items-center justify-center outline-none"
              aria-label="Share"
            >
              <ShareIcon className="h-5 w-5 text-cl-text shrink-0" />
            </button>
          </div>
        </>
      )}

      {/* Sort & filter drawer */}
      <SortFilterDrawer
        open={showFilters}
        onClose={() => {
          setShowFilters(false);
          setFilterInitialSections(undefined);
        }}
        activeSort={activeSort}
        onSortChange={setActiveSort}
        activeDistance={activeDistance}
        onDistanceChange={setActiveDistance}
        minPrice={minPrice}
        maxPrice={maxPrice}
        onMinPriceChange={setMinPrice}
        onMaxPriceChange={setMaxPrice}
        onReset={handleFilterReset}
        initialSections={filterInitialSections}
        hideSortSection={isMapView}
      />

      {/* Subcategory drawer */}
      <SubcategoryDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        categoryName={getCategoryDisplayName(activeCategory)}
        subcategories={getSubcategories(activeCategory)}
        activeSubcategory={activeSubcategory}
        onSelect={(sub) => {
          const currentKey = searchTerm ? `search|${searchTerm}` : isHome ? "all CL" : `${activeCategory}|${activeSubcategory ?? ""}`;
          scrollPositionsRef.current[currentKey] = contentScrollRef.current?.scrollTop ?? 0;
          onSubcategoryChange(sub);
          setDrawerOpen(false);
        }}
      />

      {/* Location picker */}
      <LocationPicker
        open={locationPickerOpen}
        onClose={() => {
          setLocationPickerOpen(false);
        }}
        onApply={(loc) => {
          const changed =
            loc.lat !== selectedLocation.lat ||
            loc.lng !== selectedLocation.lng;
          setSelectedLocation(loc);
          if (changed) setActiveDistance(DEFAULT_DISTANCE);
        }}
        activeDistance={activeDistance}
      />

      {/* View mode drawer */}
      <ViewModeDrawer
        open={viewDrawerOpen}
        onClose={() => setViewDrawerOpen(false)}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />

      {/* Share sheet */}
      <ShareSheet
        open={shareOpen}
        onClose={() => setShareOpen(false)}
        variant="search"
        title={searchTerm ? `"${searchTerm.toLowerCase()}"` : `${activeSubcategory ?? activeCategory} near S...`}
      />
    </div>
  );
}

// ── Curated Home Feed ───────────────────────────────────────────────────────

function CuratedFeed({
  onNavigate: _onNavigate,
  onOpenListing,
  onCategoryChange,
  onSubcategoryChange,
  onContentScroll,
  scrollRef,
  locationName,
}: {
  onNavigate?: (screen: ScreenId) => void;
  onOpenListing?: (listing: ListingData) => void;
  onCategoryChange?: (category: string) => void;
  onSubcategoryChange?: (subcategory: string | null) => void;
  onContentScroll: (e: React.UIEvent<HTMLDivElement>) => void;
  scrollRef?: React.RefObject<HTMLDivElement | null>;
  locationName: string;
}) {
  const handleCardClick = (d: ListingData) => {
    if (d.linkType === "subcategory" && d.browseCategory && d.browseSubcategory) {
      onCategoryChange?.(d.browseCategory);
      onSubcategoryChange?.(d.browseSubcategory);
    } else {
      onOpenListing?.(d);
    }
  };

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto overscroll-contain pt-4 pb-20 space-y-4 scrollbar-none"
        onScroll={onContentScroll}
      >
        <CollectionSection title={`available jobs near ${locationName}`}>
          <ScrollRow>
            {jobsRamsey.map((d) => (
              <MediumCard key={d.id} data={d} onClick={() => handleCardClick(d)} />
            ))}
          </ScrollRow>
        </CollectionSection>

        <CollectionSection title={`popular items near ${locationName}`}>
          <ThumbGrid>
            {popularItemsHennepin.map((d) => (
              <GridCard key={d.id} data={d} onClick={() => handleCardClick(d)} />
            ))}
          </ThumbGrid>
        </CollectionSection>

        <CollectionSection title={`homes for rent near ${locationName}`}>
          <ScrollRow>
            {homesDakotaScott.map((d) => (
              <MediumCard key={d.id} data={d} onClick={() => handleCardClick(d)} />
            ))}
          </ScrollRow>
        </CollectionSection>

        <CollectionSection title={`services in ${locationName}`}>
          <ScrollRow>
            {servicesMicro.map((d) => (
              <MicroCard key={d.id} data={d} onClick={() => handleCardClick(d)} />
            ))}
          </ScrollRow>
        </CollectionSection>

        <CollectionSection title={`popular for sale near ${locationName}`}>
          <ThumbGrid>
            {popularForSale.map((d) => (
              <GridCard key={d.id} data={d} onClick={() => handleCardClick(d)} />
            ))}
          </ThumbGrid>
        </CollectionSection>

        <CollectionSection title={`housing near ${locationName}`}>
          <ScrollRow>
            {housingMedium.map((d) => (
              <MediumCard key={d.id} data={d} onClick={() => handleCardClick(d)} />
            ))}
          </ScrollRow>
        </CollectionSection>

        <CollectionSection title={`community in ${locationName}`}>
          <ScrollRow>
            {communitySlides.map((d) => (
              <SlideCard key={d.id} data={d} onClick={() => handleCardClick(d)} />
            ))}
          </ScrollRow>
        </CollectionSection>

        <CollectionSection title={`gig opportunities near ${locationName}`}>
          <ScrollRow>
            {gigsMicro.map((d) => (
              <MicroCard key={d.id} data={d} onClick={() => handleCardClick(d)} />
            ))}
          </ScrollRow>
        </CollectionSection>

        <CollectionSection title={`trending furniture near ${locationName}`}>
          <ThumbGrid>
            {trendingFurniture.map((d) => (
              <GridCard key={d.id} data={d} onClick={() => handleCardClick(d)} />
            ))}
          </ThumbGrid>
        </CollectionSection>

        <EndOfFeed label={locationName} message="that's all for today" />
      </div>
    </div>
  );
}

// ── Category Browse Content ─────────────────────────────────────────────────

function CategoryContent({
  onNavigate,
  onOpenListing,
  onShowFilters,
  onContentScroll,
  onOverlayScroll,
  overlayVisible,
  restoreOverlay,
  viewMode,
  onViewModeChange: _onViewModeChange,
  activeCategory,
  activeSubcategory,
  activeSort,
  activeDistance,
  onDistanceChange,
  minPrice,
  maxPrice,
  hasActiveFilters,
  hasActiveSort: _hasActiveSort,
  onFilterReset,
  headerCollapsed,
  onRestoreHeader,
  scrollRef,
}: {
  onNavigate?: (screen: ScreenId) => void;
  onOpenListing?: (listing: ListingData) => void;
  onShowFilters: (sections?: FilterSection[]) => void;
  onContentScroll: (e: React.UIEvent<HTMLDivElement>) => void;
  onOverlayScroll: (e: React.UIEvent<HTMLDivElement>) => void;
  overlayVisible: boolean;
  restoreOverlay: () => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  activeCategory: string;
  activeSubcategory: string | null;
  activeSort: SortOption;
  activeDistance: string;
  onDistanceChange: (distance: string) => void;
  minPrice: string;
  maxPrice: string;
  hasActiveFilters: boolean;
  hasActiveSort: boolean;
  onFilterReset: () => void;
  headerCollapsed: boolean;
  onRestoreHeader: () => void;
  scrollRef?: React.RefObject<HTMLDivElement | null>;
}) {
  const { selectedLocation, setSelectedLocation, updateLocationCoords } = useLocation();
  const nav = (item: ListingData) => onOpenListing?.(item);
  const isMapView = viewMode === "map";
  const mapViewRef = useRef<import("react-map-gl/maplibre").MapRef>(null);

  const { handleMapMove } = useMapSync({
    activeDistance,
    onDistanceChange,
    selectedLocation,
    setSelectedLocation,
    updateLocationCoords,
    isMapView,
    mapRef: mapViewRef,
  });

  const fitBoundsKey = `${activeCategory}|${activeSubcategory ?? ""}`;

  const handleLocateOnMap = useCallback(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        mapViewRef.current?.flyTo({
          center: [longitude, latitude],
          zoom: MAP_ZOOM,
          duration: 1200,
        });
        updateLocationCoords((prev) => ({ ...prev, lat: latitude, lng: longitude }));
        fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&zoom=10`,
          { headers: { "User-Agent": "CraigslistMobilePrototype/1.0" } },
        )
          .then((r) => r.json())
          .then((data) => {
            const addr = data.address;
            const city = addr?.city ?? addr?.town ?? addr?.village ?? addr?.county;
            const state = addr?.state ?? "";
            if (city) {
              setSelectedLocation({
                name: city.toLowerCase(),
                state,
                displayName: `${city.toLowerCase()}, ${state}`,
                captionName: `${city}, ${state}`,
                lat: latitude,
                lng: longitude,
              });
            }
          })
          .catch(() => {});
      },
      () => {},
      { enableHighAccuracy: true, timeout: 10_000 },
    );
  }, [updateLocationCoords, setSelectedLocation]);


  const handleBackgroundTap = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if ((e.target as HTMLElement).closest("button")) return;
      if (!overlayVisible || headerCollapsed) {
        restoreOverlay();
        onRestoreHeader();
      }
    },
    [overlayVisible, headerCollapsed, restoreOverlay, onRestoreHeader],
  );

  const categoryId = chipLabelToCategoryId(activeCategory);
  const rawListings = getListingsForCategory(categoryId);

  const listings = useMemo(() => {
    const maxDist = parseDistanceOption(activeDistance);
    const pMin = minPrice ? Number(minPrice) : 0;
    const pMax = maxPrice ? Number(maxPrice) : Infinity;
    const { lat: sLat, lng: sLng } = selectedLocation;

    const withDist = rawListings.map((item) => {
      const coords = getListingCoords(item, { lat: MAP_CENTER.latitude, lng: MAP_CENTER.longitude });
      const miles = haversineMiles(sLat, sLng, coords.lat, coords.lng);
      return { ...item, dist: `${miles < 10 ? miles.toFixed(1) : Math.round(miles)} mi`, _miles: miles };
    });

    const filtered = withDist.filter((item) => {
      if (activeSubcategory && item.subcategory !== activeSubcategory) return false;
      if (item._miles > maxDist) return false;
      const price = parsePriceToCents(item.price);
      if (price !== Infinity) {
        if (price < pMin || price > pMax) return false;
      }
      return true;
    });

    const sorted = [...filtered];
    switch (activeSort) {
      case "suggested": {
        let seed = 0;
        for (let c = 0; c < activeCategory.length; c++) seed = (seed * 31 + activeCategory.charCodeAt(c)) | 0;
        for (let i = sorted.length - 1; i > 0; i--) {
          seed = (seed * 16807 + 2147483647) | 0;
          const j = ((seed >>> 0) % (i + 1));
          [sorted[i], sorted[j]] = [sorted[j], sorted[i]];
        }
        break;
      }
      case "newest first":
        sorted.sort((a, b) => parseTimeToMinutes(a.time) - parseTimeToMinutes(b.time));
        break;
      case "oldest first":
        sorted.sort((a, b) => parseTimeToMinutes(b.time) - parseTimeToMinutes(a.time));
        break;
      case "price: low → high":
        sorted.sort((a, b) => parsePriceToCents(a.price) - parsePriceToCents(b.price));
        break;
      case "price: high → low":
        sorted.sort((a, b) => parsePriceToCents(b.price) - parsePriceToCents(a.price));
        break;
      case "closest":
        sorted.sort((a, b) => a._miles - b._miles);
        break;
    }
    return sorted;
  }, [rawListings, activeSubcategory, activeSort, activeDistance, minPrice, maxPrice, selectedLocation]);
  const isEmpty = listings.length === 0;
  const emptyDueToFilters = isEmpty && hasActiveFilters && rawListings.length > 0;
  const emptyLabel = activeSubcategory ?? activeCategory;

  return (
    <div className="relative flex flex-1 flex-col overflow-hidden">
      {isEmpty ? (
        <div className="flex flex-1 flex-col items-center px-6 pt-[92px]">
          <div className="flex h-16 w-16 items-center justify-center rounded-[--radius-card-lg] bg-cl-accent/10">
            <Search className="h-6 w-6 text-cl-accent" strokeWidth={1.8} aria-hidden />
          </div>
          {emptyDueToFilters ? (
            <>
              <p className="mt-4 text-[17px] font-semibold text-cl-text">no matches</p>
              <p className="mt-1 text-[12px] text-cl-text-muted text-center">
                no posts in {emptyLabel.toLowerCase()} match your filters.
              </p>
              <p className="mt-0.5 text-[12px] text-cl-text-muted text-center">
                try adjusting your filters or clearing them.
              </p>
              <button
                type="button"
                onClick={onFilterReset}
                className="mt-4 flex w-full max-w-[220px] min-h-[48px] items-center justify-center rounded-[--radius-button] bg-cl-accent shadow-[--shadow-card] outline-none active:opacity-90"
              >
                <span className="text-[17px] font-semibold text-cl-accent-text">clear filters</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  const sections: FilterSection[] = [];
                  if (activeSort !== DEFAULT_SORT) sections.push("sort");
                  if (activeDistance !== DEFAULT_DISTANCE) sections.push("distance");
                  if (minPrice || maxPrice) sections.push("price");
                  onShowFilters(sections.length > 0 ? sections : undefined);
                }}
                className="mt-3 flex w-full max-w-[220px] min-h-[44px] items-center justify-center rounded-[--radius-button] border border-cl-border outline-none active:opacity-90"
              >
                <span className="text-[15px] font-semibold text-cl-text">adjust filters</span>
              </button>
            </>
          ) : (
            <>
              <p className="mt-4 text-[17px] font-semibold text-cl-text">no results</p>
              <p className="mt-1 text-[12px] text-cl-text-muted text-center">
                no posts found in {emptyLabel.toLowerCase()}.
              </p>
              <p className="mt-0.5 text-[12px] text-cl-text-muted text-center">
                try a different category or check back later.
              </p>
              <button
                type="button"
                onClick={() => onNavigate?.("create-post")}
                className="mt-4 flex w-full max-w-[220px] min-h-[48px] items-center justify-center rounded-[--radius-button] bg-cl-accent shadow-[--shadow-card] outline-none active:opacity-90"
              >
                <span className="text-[17px] font-semibold text-cl-accent-text">add a post here</span>
              </button>
            </>
          )}
        </div>
      ) : (
        <>
          {/* Content – map or listing cards */}
          {isMapView ? (
            <div className="flex-1 min-h-0 flex flex-col pb-[72px]">
              <MapView
                listings={listings}
                onOpenListing={onOpenListing}
                mapRef={mapViewRef}
                onCenterChange={handleMapMove}
                center={{ lat: selectedLocation.lat, lng: selectedLocation.lng }}
                fitBoundsKey={fitBoundsKey}
              />
            </div>
          ) : (
            <div
              ref={scrollRef}
              className="flex-1 overflow-y-auto overscroll-contain px-4 pb-20 scrollbar-none"
              onScroll={(e) => { onContentScroll(e); onOverlayScroll(e); }}
              onClick={handleBackgroundTap}
            >
              <ResultsCaption>{listings.length} results</ResultsCaption>
              {viewMode === "thumb" && (
                <div className="-mx-4 space-y-0.5">
                  {listings.map((item) => (
                    <ThumbCard key={item.id} data={item} onClick={() => nav(item)} />
                  ))}
                </div>
              )}

              {viewMode === "grid" && (
                <div className="-mx-4 grid grid-cols-2 gap-0.5">
                  {listings.map((item) => (
                    <GridCard key={item.id} data={item} onClick={() => nav(item)} />
                  ))}
                </div>
              )}

              {viewMode === "list" && (
                <div className="-mx-4 space-y-0.5">
                  {listings.map((item) => (
                    <ListCard key={item.id} data={item} onClick={() => nav(item)} />
                  ))}
                </div>
              )}

              {viewMode === "gallery" && (
                <div className="space-y-4">
                  {listings.map((item) => (
                    <GalleryCard
                      key={item.id}
                      data={item}
                      onClick={() => nav(item)}
                    />
                  ))}
                </div>
              )}

              <EndOfFeed count={listings.length} label={activeSubcategory ?? activeCategory} />
            </div>
          )}

          {/* ── Persistent button overlay ── */}

          {/* Top-right: Navigate (map only) */}
          {isMapView && (
            <div className={`absolute top-3 right-3 z-20 flex h-10 w-10 items-center justify-center overflow-hidden rounded-[--radius-button] bg-cl-surface/90 shadow-md backdrop-blur-[6px] transition-transform duration-300 ease-in-out ${overlayVisible ? "translate-x-0" : "translate-x-[calc(100%+12px)]"}`}>
              <button
                type="button"
                onClick={handleLocateOnMap}
                className="flex h-full w-full min-h-[44px] min-w-[44px] items-center justify-center outline-none"
                aria-label="Use current location"
              >
                <Navigation className="h-5 w-5 text-cl-text shrink-0 translate-x-[-2px] translate-y-[1px]" />
              </button>
            </div>
          )}

        </>
      )}

    </div>
  );
}

// ── Search Results Content ──────────────────────────────────────────────────

function SearchResultsContent({
  searchTerm,
  activeCategory,
  activeSubcategory,
  onOpenListing,
  onContentScroll,
  onOverlayScroll,
  activeSort,
  activeDistance,
  onDistanceChange,
  minPrice,
  maxPrice,
  viewMode = "thumb",
  scrollRef,
}: {
  searchTerm: string;
  activeCategory: string;
  activeSubcategory?: string | null;
  onOpenListing?: (listing: ListingData) => void;
  onContentScroll: (e: React.UIEvent<HTMLDivElement>) => void;
  onOverlayScroll: (e: React.UIEvent<HTMLDivElement>) => void;
  activeSort: SortOption;
  activeDistance: string;
  onDistanceChange: (distance: string) => void;
  minPrice: string;
  maxPrice: string;
  viewMode?: ViewMode;
  scrollRef?: React.RefObject<HTMLDivElement | null>;
}) {
  const { selectedLocation, setSelectedLocation, updateLocationCoords } = useLocation();
  const nav = (item: ListingData) => onOpenListing?.(item);
  const isAll = activeCategory === "all CL";
  const categoryId = chipLabelToCategoryId(activeCategory);
  const isMapView = viewMode === "map";
  const mapViewRef = useRef<import("react-map-gl/maplibre").MapRef>(null);

  const { handleMapMove } = useMapSync({
    activeDistance,
    onDistanceChange,
    selectedLocation,
    setSelectedLocation,
    updateLocationCoords,
    isMapView,
    mapRef: mapViewRef,
  });

  const fitBoundsKey = `${searchTerm}|${activeCategory}|${activeSubcategory ?? ""}`;

  const rawResults = useMemo(
    () =>
      isAll
        ? searchAllListings(searchTerm)
        : searchCategoryListings(categoryId, searchTerm, activeSubcategory),
    [searchTerm, isAll, categoryId, activeSubcategory],
  );

  const results = useMemo(() => {
    const maxDist = parseDistanceOption(activeDistance);
    const pMin = minPrice ? Number(minPrice) : 0;
    const pMax = maxPrice ? Number(maxPrice) : Infinity;
    const { lat: sLat, lng: sLng } = selectedLocation;

    const withDist = rawResults.map((item) => {
      const coords = getListingCoords(item, { lat: MAP_CENTER.latitude, lng: MAP_CENTER.longitude });
      const miles = haversineMiles(sLat, sLng, coords.lat, coords.lng);
      return { ...item, dist: `${miles < 10 ? miles.toFixed(1) : Math.round(miles)} mi`, _miles: miles };
    });

    const filtered = withDist.filter((item) => {
      if (item._miles > maxDist) return false;
      const price = parsePriceToCents(item.price);
      if (price !== Infinity) {
        if (price < pMin || price > pMax) return false;
      }
      return true;
    });

    const sorted = [...filtered];
    switch (activeSort) {
      case "suggested":
        break;
      case "newest first":
        sorted.sort((a, b) => parseTimeToMinutes(a.time) - parseTimeToMinutes(b.time));
        break;
      case "oldest first":
        sorted.sort((a, b) => parseTimeToMinutes(b.time) - parseTimeToMinutes(a.time));
        break;
      case "price: low → high":
        sorted.sort((a, b) => parsePriceToCents(a.price) - parsePriceToCents(b.price));
        break;
      case "price: high → low":
        sorted.sort((a, b) => parsePriceToCents(b.price) - parsePriceToCents(a.price));
        break;
      case "closest":
        sorted.sort((a, b) => a._miles - b._miles);
        break;
    }
    return sorted;
  }, [rawResults, activeSort, activeDistance, minPrice, maxPrice, selectedLocation]);

  if (results.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center px-6 pt-[92px] bg-cl-bg">
        <div className="flex h-16 w-16 items-center justify-center rounded-[--radius-card-lg] bg-cl-accent/10">
          <Search className="h-6 w-6 text-cl-accent" strokeWidth={1.8} aria-hidden />
        </div>
        <p className="mt-4 text-[17px] font-semibold text-cl-text">no results</p>
        <p className="mt-1 text-[12px] text-cl-text-muted text-center">
          no posts found for "{searchTerm.toLowerCase()}".
        </p>
        <p className="mt-0.5 text-[12px] text-cl-text-muted text-center">
          try a different search or browse a category.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col overflow-hidden bg-cl-surface">
      {viewMode === "map" ? (
        <div className="flex-1 min-h-0 flex flex-col pb-[72px]">
          <MapView
            listings={results}
            onOpenListing={onOpenListing}
            mapRef={mapViewRef}
            onCenterChange={handleMapMove}
            center={{ lat: selectedLocation.lat, lng: selectedLocation.lng }}
            fitBoundsKey={fitBoundsKey}
          />
        </div>
      ) : (
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto overscroll-contain px-4 pb-20 scrollbar-none"
          onScroll={(e) => { onContentScroll(e); onOverlayScroll(e); }}
        >
          <ResultsCaption>
            {results.length} {results.length === 1 ? "result" : "results"} for "{searchTerm.toLowerCase()}"
          </ResultsCaption>

          {viewMode === "thumb" && (
            <div className="-mx-4 space-y-0.5">
              {results.map((item) => (
                <ThumbCard key={item.id} data={item} onClick={() => nav(item)} />
              ))}
            </div>
          )}

          {viewMode === "grid" && (
            <div className="-mx-4 grid grid-cols-2 gap-0.5">
              {results.map((item) => (
                <GridCard key={item.id} data={item} onClick={() => nav(item)} />
              ))}
            </div>
          )}

          {viewMode === "list" && (
            <div className="-mx-4 space-y-0.5">
              {results.map((item) => (
                <ListCard key={item.id} data={item} onClick={() => nav(item)} />
              ))}
            </div>
          )}

          {viewMode === "gallery" && (
            <div className="space-y-4">
              {results.map((item) => (
                <GalleryCard key={item.id} data={item} onClick={() => nav(item)} />
              ))}
            </div>
          )}

          <EndOfFeed count={results.length} label={searchTerm.toLowerCase()} />
        </div>
      )}
    </div>
  );
}
