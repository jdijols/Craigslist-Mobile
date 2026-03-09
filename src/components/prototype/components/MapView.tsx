import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import MapGL, { Marker } from "react-map-gl/maplibre";
import type { MapRef } from "react-map-gl/maplibre";
import type { ListingData } from "../../ui/cards";
import { HOOD_COORDS } from "../../../data/neighborhoods";
import { MAP_CENTER, MAP_ZOOM, useMapStyle } from "./StaticMapLayer";
import { SPRING_SHEET } from "../transitions";
import { MapCard } from "../../ui/cards/MapCard";
import { useIsFavorited } from "../../../data/favorites";

interface MapViewProps {
  listings: ListingData[];
  onOpenListing?: (listing: ListingData) => void;
  mapRef?: React.RefObject<MapRef | null>;
  onCenterChange?: (center: { lat: number; lng: number; zoom: number }) => void;
  center?: { lat: number; lng: number };
  /** Change this value to trigger a fitBounds to the current listings. */
  fitBoundsKey?: string | number;
}

export { HOOD_COORDS };

const DEFAULT_CENTER = { lng: MAP_CENTER.longitude, lat: MAP_CENTER.latitude };

function seededRandom(seed: string): number {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash << 5) - hash + seed.charCodeAt(i);
    hash |= 0;
  }
  return ((hash & 0x7fffffff) % 1000) / 1000;
}

function getMarkerPosition(listing: ListingData) {
  let base: { lng: number; lat: number } | undefined;
  if (listing.lat != null && listing.lng != null) {
    base = { lng: listing.lng, lat: listing.lat };
  } else if (listing.hood) {
    const key = listing.hood.toLowerCase();
    base = HOOD_COORDS[key] ?? HOOD_COORDS[listing.hood];
  }
  base ??= DEFAULT_CENTER;
  const jitterLng = (seededRandom(listing.id + "x") - 0.5) * 0.016;
  const jitterLat = (seededRandom(listing.id + "y") - 0.5) * 0.016;
  return {
    lng: base.lng + jitterLng,
    lat: base.lat + jitterLat,
  };
}

const DOT_SIZE = 16;
const DOT_ACTIVE_SIZE = 24;
const INNER_AREA_RATIO = 0.50;
const RING_FACTOR = 1 - Math.sqrt(INNER_AREA_RATIO);

function DotMarker({ active, listingId }: { active?: boolean; listingId: string }) {
  const favorited = useIsFavorited(listingId);
  const size = active ? DOT_ACTIVE_SIZE : DOT_SIZE;
  const ring = (size / 2) * RING_FACTOR;
  const ringColor = favorited ? "white" : "var(--color-cl-accent)";
  const fillColor = favorited ? "var(--color-cl-favorite)" : "white";
  const shadow = "drop-shadow(0 1px 2px rgba(0,0,0,0.3))";
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} fill="none" xmlns="http://www.w3.org/2000/svg" style={{ filter: shadow }}>
      <circle cx={size / 2} cy={size / 2} r={size / 2} fill={ringColor} opacity={active ? 1 : 0.85} />
      <circle cx={size / 2} cy={size / 2} r={size / 2 - ring} fill={fillColor} />
    </svg>
  );
}

export function MapView({ listings, onOpenListing, mapRef, onCenterChange, center, fitBoundsKey }: MapViewProps) {
  const mapStyle = useMapStyle();
  const [activeDot, setActiveDot] = useState<string | null>(null);
  const prevCenterRef = useRef(center);
  const userGestureRef = useRef(false);
  const listingsRef = useRef(listings);
  listingsRef.current = listings;
  const cardContainerRef = useRef<HTMLDivElement>(null);

  // Fit map bounds — only runs when fitBoundsKey changes (category/search switch).
  useEffect(() => {
    if (!mapRef?.current) return;
    const current = listingsRef.current;
    if (current.length === 0) return;
    const positions = current.map(getMarkerPosition);
    const lngs = positions.map((p) => p.lng);
    const lats = positions.map((p) => p.lat);
    const minLng = Math.min(...lngs);
    const maxLng = Math.max(...lngs);
    const minLat = Math.min(...lats);
    const maxLat = Math.max(...lats);
    const pad = Math.max(0.005, (maxLng - minLng || 0.01) * 0.1, (maxLat - minLat || 0.01) * 0.1);
    const bounds: [[number, number], [number, number]] = [
      [minLng - pad, minLat - pad],
      [maxLng + pad, maxLat + pad],
    ];
    mapRef.current.getMap().fitBounds(bounds, { padding: 48, maxZoom: 14, duration: 600 });
  }, [fitBoundsKey, mapRef]);

  // Only recenter on location change when there are no listings (fitBounds handles the rest)
  useEffect(() => {
    if (!center || listings.length > 0) return;
    const prev = prevCenterRef.current;
    if (prev && prev.lat === center.lat && prev.lng === center.lng) return;
    prevCenterRef.current = center;
    mapRef?.current?.flyTo({
      center: [center.lng, center.lat],
      zoom: mapRef.current.getZoom(),
      duration: 600,
    });
  }, [center, mapRef, listings.length]);

  useEffect(() => {
    if (!activeDot || !mapRef?.current) return;
    const listing = listings.find((l) => l.id === activeDot);
    if (!listing) return;
    const pos = getMarkerPosition(listing);

    requestAnimationFrame(() => {
      const map = mapRef.current;
      if (!map) return;
      const cardH = cardContainerRef.current?.offsetHeight ?? 0;
      const dotPixel = map.project([pos.lng, pos.lat]);
      const adjustedCenter = map.unproject([dotPixel.x, dotPixel.y + cardH / 2]);
      map.easeTo({
        center: [adjustedCenter.lng, adjustedCenter.lat],
        duration: 400,
      });
    });
  }, [activeDot, listings, mapRef]);

  const activeListing = listings.find((l) => l.id === activeDot);

  return (
    <div className="relative h-full w-full overflow-hidden select-none">
      <MapGL
        ref={mapRef}
        initialViewState={{
          longitude: center?.lng ?? MAP_CENTER.longitude,
          latitude: center?.lat ?? MAP_CENTER.latitude,
          zoom: MAP_ZOOM,
        }}
        mapStyle={mapStyle}
        style={{ width: "100%", height: "100%" }}
        attributionControl={false}
        dragRotate={false}
        touchPitch={false}
        minZoom={7}
        maxZoom={15}
        onClick={() => setActiveDot(null)}
        onMoveStart={(e) => {
          userGestureRef.current = !!e.originalEvent;
          if (e.originalEvent) {
            setActiveDot(null);
          }
        }}
        onMoveEnd={(e) => {
          if (userGestureRef.current) {
            onCenterChange?.({ lat: e.viewState.latitude, lng: e.viewState.longitude, zoom: e.viewState.zoom });
          }
          userGestureRef.current = false;
        }}
      >
        {listings.map((listing) => {
          const pos = getMarkerPosition(listing);
          const isActive = activeDot === listing.id;
          return (
            <Marker
              key={listing.id}
              longitude={pos.lng}
              latitude={pos.lat}
              anchor="center"
              style={{ zIndex: isActive ? 10 : 5 }}
            >
              <motion.button
                type="button"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 400, damping: 22 }}
                className="outline-none"
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveDot(isActive ? null : listing.id);
                }}
              >
                <DotMarker active={isActive} listingId={listing.id} />
              </motion.button>
            </Marker>
          );
        })}
      </MapGL>

      <AnimatePresence>
        {activeListing && (
          <motion.div
            ref={cardContainerRef}
            key="map-card-preview"
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            transition={SPRING_SHEET}
            className="absolute bottom-0 left-0 right-0 z-30"
          >
            <div
              className="mx-3 mb-3 shadow-[--shadow-elevated] rounded-[--radius-card-lg] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <MapCard key={activeListing.id} data={activeListing} onClick={() => onOpenListing?.(activeListing)} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
