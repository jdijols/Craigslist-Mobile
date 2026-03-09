import { useRef, useCallback, useEffect } from "react";
import type { MapRef } from "react-map-gl/maplibre";
import type { SelectedLocation } from "../contexts/LocationContext";
import { zoomToMiles, milesToZoom, snapDistance } from "../utils/geo";
import {
  DISTANCE_MIN,
  DISTANCE_MAX,
  DISTANCE_STEP,
} from "../components/prototype/components/SortFilterDrawer";
import { parseDistanceOption } from "../utils/format";

const SYNC_DELAY_MS = 1000;

interface UseMapSyncOptions {
  activeDistance: string;
  onDistanceChange: (distance: string) => void;
  selectedLocation: SelectedLocation;
  setSelectedLocation: (loc: SelectedLocation) => void;
  updateLocationCoords: (
    updater: (prev: SelectedLocation) => SelectedLocation,
  ) => void;
  isMapView: boolean;
  mapRef: React.RefObject<MapRef | null>;
}

export function useMapSync({
  activeDistance,
  onDistanceChange,
  setSelectedLocation,
  updateLocationCoords,
  isMapView,
  mapRef,
}: UseMapSyncOptions) {
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const activeDistanceRef = useRef(activeDistance);
  const distanceFromMapRef = useRef(false);
  const mountedRef = useRef(false);

  useEffect(() => {
    activeDistanceRef.current = activeDistance;
  }, [activeDistance]);

  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    };
  }, []);

  useEffect(() => {
    if (!mountedRef.current) {
      mountedRef.current = true;
      return;
    }
    if (!isMapView) return;
    if (distanceFromMapRef.current) {
      distanceFromMapRef.current = false;
      return;
    }
    const miles = parseDistanceOption(activeDistance);
    if (miles === Infinity) return;
    mapRef.current?.flyTo({ zoom: milesToZoom(miles), duration: 800 });
  }, [activeDistance, isMapView, mapRef]);

  const handleMapMove = useCallback(
    (center: { lat: number; lng: number; zoom: number }) => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);

      debounceTimerRef.current = setTimeout(() => {
        const rawMiles = zoomToMiles(center.zoom);
        const snapped = snapDistance(rawMiles, DISTANCE_STEP, DISTANCE_MIN, DISTANCE_MAX);

        const currentMiles = parseDistanceOption(activeDistanceRef.current);
        if (snapped !== currentMiles) {
          distanceFromMapRef.current = true;
          onDistanceChange(`${snapped} miles`);
        }

        fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${center.lat}&lon=${center.lng}&format=json&zoom=10`,
          { headers: { "User-Agent": "CraigslistMobilePrototype/1.0" } },
        )
          .then((r) => r.json())
          .then((data) => {
            const addr = data.address;
            const city =
              addr?.city ?? addr?.town ?? addr?.village ?? addr?.county;
            const state = addr?.state ?? "";
            if (city) {
              setSelectedLocation({
                name: city.toLowerCase(),
                state,
                displayName: `${city.toLowerCase()}, ${state}`,
                captionName: `${city}, ${state}`,
                lat: center.lat,
                lng: center.lng,
              });
            } else {
              updateLocationCoords((prev) => ({
                ...prev,
                lat: center.lat,
                lng: center.lng,
              }));
            }
          })
          .catch(() => {
            updateLocationCoords((prev) => ({
              ...prev,
              lat: center.lat,
              lng: center.lng,
            }));
          });
      }, SYNC_DELAY_MS);
    },
    [onDistanceChange, updateLocationCoords, setSelectedLocation],
  );

  return { handleMapMove };
}
