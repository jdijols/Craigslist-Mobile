import { useState, useRef, useCallback, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Navigation, MapPin, Loader2 } from "lucide-react";
import type { MapRef } from "react-map-gl/maplibre";
import { useOverlayPortal } from "../../layout/OverlayPortal";
import { SheetHeader } from "../../ui/SheetHeader";
import { SPRING_SHEET } from "../transitions";
import { StaticMapLayer, MAP_ZOOM } from "./StaticMapLayer";
import {
  useLocationSearch,
  type LocationResult,
} from "../../../hooks/useLocationSearch";
import {
  useLocation,
  type SelectedLocation,
} from "../../../contexts/LocationContext";

export type { SelectedLocation };

interface LocationPickerProps {
  open: boolean;
  onClose: () => void;
  onApply?: (location: SelectedLocation) => void;
  currentLocation?: SelectedLocation;
  activeDistance?: string;
}

function distanceToZoom(miles: number): number {
  if (!miles || miles <= 0) return MAP_ZOOM;
  return Math.log2(25000 / miles);
}

function parseDistanceMiles(option: string): number {
  const n = parseFloat(option);
  return Number.isNaN(n) ? 25 : n;
}

export function LocationPicker({
  open,
  onClose,
  onApply,
  currentLocation,
  activeDistance = "25 miles",
}: LocationPickerProps) {
  const portalTarget = useOverlayPortal();
  const mapRef = useRef<MapRef>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { selectedLocation: ctxLocation } = useLocation();
  const effectiveLocation = currentLocation ?? ctxLocation;

  const openRef = useRef(open);
  openRef.current = open;

  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<SelectedLocation>(effectiveLocation);
  const [showResults, setShowResults] = useState(false);

  const { results, loading } = useLocationSearch(query);

  useEffect(() => {
    setSelected(effectiveLocation);
  }, [effectiveLocation]);

  const miles = parseDistanceMiles(activeDistance);
  const mapZoom = distanceToZoom(miles);

  const prevOpenRef = useRef(false);
  useEffect(() => {
    if (open && !prevOpenRef.current) {
      setSelected(effectiveLocation);
      setTimeout(() => {
        mapRef.current?.flyTo({
          center: [effectiveLocation.lng, effectiveLocation.lat],
          zoom: mapZoom,
          duration: 0,
        });
      }, 50);
    }
    if (!open) {
      setQuery("");
      setShowResults(false);
    }
    prevOpenRef.current = open;
  }, [open, effectiveLocation, mapZoom]);

  const handleLocate = useCallback(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        mapRef.current?.flyTo({
          center: [longitude, latitude],
          zoom: mapZoom,
          duration: 1200,
        });

        fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&zoom=10`,
          { headers: { "User-Agent": "CraigslistMobilePrototype/1.0" } },
        )
          .then((r) => r.json())
          .then((data) => {
            const addr = data.address;
            const city =
              addr?.city ?? addr?.town ?? addr?.village ?? addr?.county;
            const state = addr?.state ?? "";
            if (city) {
              setSelected({
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
  }, [mapZoom]);

  const handleSelectResult = useCallback(
    (result: LocationResult) => {
      setSelected({
        name: result.name,
        state: result.state,
        displayName: result.displayName,
        captionName: result.captionName,
        lat: result.lat,
        lng: result.lng,
      });
      setQuery("");
      setShowResults(false);
      inputRef.current?.blur();

      mapRef.current?.flyTo({
        center: [result.lng, result.lat],
        zoom: mapZoom,
        duration: 1200,
      });
    },
    [mapZoom],
  );

  const handleApply = useCallback(() => {
    onApply?.(selected);
    onClose();
  }, [onApply, onClose, selected]);

  const handleInputFocus = useCallback(() => {
    setShowResults(true);
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter" && results.length === 1) {
        e.preventDefault();
        handleSelectResult(results[0]);
      }
    },
    [results, handleSelectResult],
  );

  const content = (
    <AnimatePresence>
      {open && (
        <motion.div
          key="location-picker"
          className="absolute inset-0 z-50 flex flex-col bg-cl-surface"
          style={{ pointerEvents: "auto" }}
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={SPRING_SHEET}
          onAnimationComplete={() => {
            if (openRef.current) inputRef.current?.focus();
          }}
        >
          <div className="shrink-0" style={{ height: "var(--chrome-offset)" }} />

          <div className="shrink-0 border-b-[0.5px] border-cl-border bg-cl-surface">
            <SheetHeader
              title="location"
              onClose={onClose}
              closeAriaLabel="Close location picker"
            />
            <div className="px-4 pb-3 pt-0">
              <div className="flex items-center gap-2.5 rounded-[--radius-button] border border-cl-border bg-white px-3 h-search-input">
                <Search className="h-4 w-4 shrink-0 text-cl-text-muted" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setShowResults(true);
                  }}
                  onFocus={handleInputFocus}
                  onKeyDown={handleKeyDown}
                  placeholder="search by city or zipcode"
                  className="w-0 flex-1 bg-transparent text-[15px] text-cl-text placeholder:text-cl-text-muted outline-none text-ellipsis"
                />
                {query.length > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      setQuery("");
                      setShowResults(false);
                      inputRef.current?.focus();
                    }}
                    className="flex shrink-0 items-center justify-center rounded-full bg-cl-text-muted/80 p-[2px] outline-none active:opacity-70"
                    aria-label="Clear text"
                  >
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 14 14"
                      fill="none"
                      className="text-white"
                    >
                      <path
                        d="M4 4l6 6M10 4l-6 6"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                      />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Map + search results overlay */}
          <div className="relative flex-1 overflow-hidden">
            <StaticMapLayer
              mapRef={mapRef}
              center={{ longitude: effectiveLocation.lng, latitude: effectiveLocation.lat }}
              zoom={mapZoom}
            />

            <div className="absolute left-1/2 top-1/2 z-10 h-6 w-6 -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-white bg-cl-accent" />

            <div className="absolute top-3 right-3 z-20 flex h-10 w-10 items-center justify-center overflow-hidden rounded-[--radius-button] bg-white/80 shadow-md backdrop-blur-[6px]">
              <button
                type="button"
                onClick={handleLocate}
                className="flex h-full w-full items-center justify-center outline-none"
                aria-label="Use current location"
              >
                <Navigation className="h-5 w-5 text-cl-text shrink-0 translate-x-[-2px] translate-y-[1px]" />
              </button>
            </div>

            {/* Search results dropdown — top 50 cities + API when user types */}
            {showResults && query.trim().length > 0 && (
              <div className="absolute inset-x-0 top-0 z-30 max-h-full overflow-y-auto bg-cl-surface/95 backdrop-blur-md">
                {loading && results.length === 0 && (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-5 w-5 animate-spin text-cl-text-muted" />
                  </div>
                )}

                {!loading && results.length === 0 && (
                  <div className="px-5 py-8 text-center">
                    <p className="text-[15px] text-cl-text-muted">
                      no cities found
                    </p>
                  </div>
                )}

                {results.length > 0 && (
                  <ul>
                    {results.map((result, i) => (
                      <li key={result.id}>
                        {i > 0 && <div className="ml-[52px] border-t-[0.5px] border-cl-border" />}
                        <button
                          type="button"
                          onClick={() => handleSelectResult(result)}
                          className="flex w-full items-center gap-3 px-5 py-3 min-h-[44px] text-left outline-none active:bg-cl-bg-secondary transition-colors"
                        >
                          <MapPin className="h-4 w-4 shrink-0 text-cl-accent" />
                          <span className="text-[15px] text-cl-text">
                            {result.captionName}
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>

          <div className="flex flex-col border-t-[0.5px] border-cl-border bg-cl-surface px-4 pt-3 pb-[34px]">
            <p className="text-center text-[13px] font-medium text-cl-text">
              {selected.captionName} · {miles} mile radius
            </p>
            <button
              type="button"
              onClick={handleApply}
              className="mt-2 flex w-full min-h-[48px] items-center justify-center rounded-[--radius-button] bg-cl-accent shadow-[--shadow-card] outline-none active:opacity-90"
            >
              <span className="text-[17px] font-semibold text-white">
                apply
              </span>
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  if (!portalTarget) return content;
  return createPortal(content, portalTarget);
}
