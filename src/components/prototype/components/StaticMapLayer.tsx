/**
 * Shared interactive Minneapolis map layer used by LocationPicker and MapView.
 * Uses Carto basemaps (free, no API key) with theme-aware light/dark styles.
 */
import "maplibre-gl/dist/maplibre-gl.css";
import { useState, useEffect } from "react";
import MapGL from "react-map-gl/maplibre";
import type { MapRef } from "react-map-gl/maplibre";

export const MAP_CENTER = { longitude: -93.2650, latitude: 44.9778 };
export const MAP_ZOOM = 11.5;
export const STYLE_LIGHT = "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json";
export const STYLE_DARK = "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json";

export function useMapStyle() {
  const [isDark, setIsDark] = useState(() =>
    typeof window !== "undefined"
      ? window.matchMedia("(prefers-color-scheme: dark)").matches
      : false,
  );
  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = (e: MediaQueryListEvent) => setIsDark(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  return isDark ? STYLE_DARK : STYLE_LIGHT;
}

interface StaticMapLayerProps {
  mapRef?: React.RefObject<MapRef | null>;
  center?: { longitude: number; latitude: number };
  zoom?: number;
}

export function StaticMapLayer({ mapRef, center, zoom }: StaticMapLayerProps) {
  const mapStyle = useMapStyle();
  const initialCenter = center ?? MAP_CENTER;
  return (
    <div className="static-map-layer absolute inset-0 z-0">
      <MapGL
        ref={mapRef}
        initialViewState={{ ...initialCenter, zoom: zoom ?? MAP_ZOOM }}
        mapStyle={mapStyle}
        style={{ width: "100%", height: "100%" }}
        attributionControl={false}
        dragRotate={false}
        touchPitch={false}
        minZoom={6}
        maxZoom={15}
      />
    </div>
  );
}
