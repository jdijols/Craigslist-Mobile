import { useState, useMemo } from "react";
import {
  Star,
  Search,
  Map as MapIcon,
  LayoutList,
  SlidersHorizontal,
  ArrowUpDown,
} from "lucide-react";
import type { ViewMode, ListingData } from "../../ui/cards";
import { useFavorites, resetFavorites } from "../../../data/favorites";
import { useOverlayFade } from "../../../hooks/useOverlayFade";
import { ShareIcon } from "../../ui/ShareIcon";
import { ShareSheet } from "../components/ShareSheet";
import { ConfirmDialog } from "../components/ConfirmDialog";
import { SortFilterDrawer, DEFAULT_SORT, DEFAULT_DISTANCE, type SortOption, type FilterSection } from "../components/SortFilterDrawer";
import { ViewModeDrawer } from "../components/ViewModeDrawer";
import { ThumbCard } from "../../ui/cards/ThumbCard";
import { GridCard } from "../../ui/cards/GridCard";
import { ListCard } from "../../ui/cards/ListCard";
import { GalleryCard } from "../../ui/cards/GalleryCard";
import { MapView, HOOD_COORDS } from "../components/MapView";
import { MAP_CENTER } from "../components/StaticMapLayer";
import { haversineMiles } from "../../../utils/geo";
import { parsePriceToCents, parseTimeToMinutes, parseDistanceOption } from "../../../utils/format";
import { useLocation } from "../../../contexts/LocationContext";
import type { ScreenId } from "../types";

interface FavoritesScreenProps {
  onNavigate?: (screen: ScreenId) => void;
  onOpenListing?: (listing: ListingData) => void;
}

export function FavoritesScreen({ onNavigate, onOpenListing }: FavoritesScreenProps) {
  const favorites = useFavorites();
  const [viewMode, setViewMode] = useState<ViewMode>("thumb");
  const [viewDrawerOpen, setViewDrawerOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [confirmResetOpen, setConfirmResetOpen] = useState(false);
  const [activeSort, setActiveSort] = useState<SortOption>(DEFAULT_SORT);
  const [activeDistance, setActiveDistance] = useState(DEFAULT_DISTANCE);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [filterInitialSections, setFilterInitialSections] = useState<FilterSection[] | undefined>();
  const { overlayVisible, handleOverlayScroll } = useOverlayFade();
  const { selectedLocation } = useLocation();
  const isMapView = viewMode === "map";
  const hasActiveSort = activeSort !== DEFAULT_SORT;
  const hasActiveFilters = activeDistance !== DEFAULT_DISTANCE || !!minPrice || !!maxPrice;
  const nav = (item: ListingData) => onOpenListing?.(item);

  const filteredFavorites = useMemo(() => {
    const sLat = selectedLocation.lat;
    const sLng = selectedLocation.lng;

    const enriched = favorites.map((item) => {
      const coords = HOOD_COORDS[item.hood?.toLowerCase() ?? ""] ?? { lng: MAP_CENTER.longitude, lat: MAP_CENTER.latitude };
      const miles = haversineMiles(sLat, sLng, coords.lat, coords.lng);
      return { ...item, dist: `${miles < 10 ? miles.toFixed(1) : Math.round(miles)} mi`, _miles: miles };
    });

    const maxMiles = parseDistanceOption(activeDistance);
    const minP = minPrice ? parsePriceToCents(minPrice) : 0;
    const maxP = maxPrice ? parsePriceToCents(maxPrice) : Infinity;

    let result = enriched.filter((item) => {
      if (item._miles > maxMiles) return false;
      const p = parsePriceToCents(item.price);
      return p >= minP && p <= maxP;
    });

    switch (activeSort) {
      case "newest first":
        result.sort((a, b) => parseTimeToMinutes(a.time) - parseTimeToMinutes(b.time));
        break;
      case "oldest first":
        result.sort((a, b) => parseTimeToMinutes(b.time) - parseTimeToMinutes(a.time));
        break;
      case "price: low → high":
        result.sort((a, b) => parsePriceToCents(a.price) - parsePriceToCents(b.price));
        break;
      case "price: high → low":
        result.sort((a, b) => parsePriceToCents(b.price) - parsePriceToCents(a.price));
        break;
      case "closest":
        result.sort((a, b) => a._miles - b._miles);
        break;
    }

    return result;
  }, [favorites, activeSort, activeDistance, minPrice, maxPrice, selectedLocation]);

  const headerPaddingTop = 44;

  return (
    <div className="relative h-full">
      <div className="absolute top-0 left-0 right-0 z-10 bg-cl-surface border-b-[0.5px] border-cl-border">
        <div style={{ height: "var(--safe-area-top)" }} aria-hidden />
        <div className="flex h-header-bar items-center px-4">
        <span className="text-[17px] font-semibold text-cl-text">favorites</span>
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
        </div>
      </div>

      <div className="absolute inset-0 flex flex-col">
      {filteredFavorites.length === 0 && favorites.length === 0 ? (
        <div className="flex flex-1 flex-col items-center px-6" style={{ paddingTop: `calc(var(--safe-area-top) + ${headerPaddingTop + 48}px)` }}>
          <div className="flex h-16 w-16 items-center justify-center rounded-[--radius-card-lg] bg-cl-accent/10">
            <Star className="h-6 w-6 text-cl-accent" strokeWidth={1.8} aria-hidden />
          </div>
          <p className="mt-4 text-[17px] font-semibold text-cl-text">no favorites yet</p>
          <p className="mt-1 text-[12px] text-cl-text-muted text-center">
            posts that you favorite will appear here.
          </p>
        </div>
      ) : (
        <>
          {isMapView ? (
            <div className="flex-1 min-h-0 flex flex-col pb-[72px]" style={{ paddingTop: `calc(var(--safe-area-top) + ${headerPaddingTop}px)` }}>
              <MapView listings={filteredFavorites} onOpenListing={onOpenListing} />
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto overscroll-contain pb-24 scrollbar-none" style={{ paddingTop: `calc(var(--safe-area-top) + ${headerPaddingTop}px)` }} onScroll={handleOverlayScroll}>
              <div className="flex items-center justify-between px-4 py-2">
                <p className="text-left text-[13px] font-medium text-cl-text">
                  {filteredFavorites.length} results
                </p>
                <button
                  type="button"
                  onClick={() => setConfirmResetOpen(true)}
                  className="text-right text-[13px] font-medium text-cl-purple outline-none active:opacity-70"
                >
                  reset
                </button>
              </div>

              {viewMode === "thumb" && (
                <div className="space-y-0.5">
                  {filteredFavorites.map((item) => (
                    <ThumbCard key={item.id} data={item} onClick={() => nav(item)} />
                  ))}
                </div>
              )}

              {viewMode === "grid" && (
                <div className="grid grid-cols-2 gap-0.5">
                  {filteredFavorites.map((item) => (
                    <GridCard key={item.id} data={item} onClick={() => nav(item)} />
                  ))}
                </div>
              )}

              {viewMode === "list" && (
                <div className="space-y-0.5">
                  {filteredFavorites.map((item) => (
                    <ListCard key={item.id} data={item} onClick={() => nav(item)} />
                  ))}
                </div>
              )}

              {viewMode === "gallery" && (
                <div className="space-y-0.5">
                  {filteredFavorites.map((item) => (
                    <GalleryCard key={item.id} data={item} onClick={() => nav(item)} />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── Overlay buttons ── */}

          {/* Bottom-left: Change view */}
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
                <LayoutList className="h-5 w-5 text-cl-text shrink-0" />
              ) : (
                <MapIcon className="h-5 w-5 text-cl-text shrink-0" />
              )}
            </button>
          </div>

          {/* Bottom-right: Sort + Filter + Share */}
          <div
            className={`absolute bottom-[84px] right-3 z-20 flex min-w-[44px] w-11 flex-col overflow-hidden rounded-[--radius-button] bg-cl-surface/90 shadow-md backdrop-blur-[6px] transition-transform duration-300 ease-in-out ${overlayVisible ? "translate-x-0" : "translate-x-[calc(100%+12px)]"}`}
            style={{ minHeight: isMapView ? 80 : 120 }}
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
              onClick={() => setShareOpen(true)}
              className="flex flex-1 w-full min-h-[44px] min-w-[44px] items-center justify-center outline-none"
              aria-label="Share"
            >
              <ShareIcon className="h-5 w-5 text-cl-text shrink-0" />
            </button>
          </div>
        </>
      )}
      </div>

      {/* Confirm reset favorites */}
      <ConfirmDialog
        open={confirmResetOpen}
        onClose={() => setConfirmResetOpen(false)}
        title="reset all favorites?"
        message="this action is permanent."
        confirmLabel="reset favorites"
        destructive
        onConfirm={() => resetFavorites()}
      />

      {/* Share sheet */}
      <ShareSheet
        open={shareOpen}
        onClose={() => setShareOpen(false)}
        variant="search"
        title="favorites"
      />

      {/* Sort & filter drawer */}
      <SortFilterDrawer
        open={showFilters}
        onClose={() => {
          setShowFilters(false);
          setFilterInitialSections(undefined);
        }}
        initialSections={filterInitialSections}
        activeSort={activeSort}
        onSortChange={setActiveSort}
        activeDistance={activeDistance}
        onDistanceChange={setActiveDistance}
        minPrice={minPrice}
        maxPrice={maxPrice}
        onMinPriceChange={setMinPrice}
        onMaxPriceChange={setMaxPrice}
        onReset={() => {
          setActiveSort(DEFAULT_SORT);
          setActiveDistance(DEFAULT_DISTANCE);
          setMinPrice("");
          setMaxPrice("");
        }}
      />

      {/* View mode drawer */}
      <ViewModeDrawer
        open={viewDrawerOpen}
        onClose={() => setViewDrawerOpen(false)}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />
    </div>
  );
}

