import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from "react";

export interface SelectedLocation {
  name: string;
  state: string;
  displayName: string;
  /** Title-cased for captions, e.g. "Austin, TX" */
  captionName: string;
  lat: number;
  lng: number;
}

export const DEFAULT_LOCATION: SelectedLocation = {
  name: "minneapolis",
  state: "MN",
  displayName: "minneapolis, MN",
  captionName: "Minneapolis, MN",
  lat: 44.9778,
  lng: -93.2650,
};

const STORAGE_KEY = "cl-selected-location";

function loadPersistedLocation(): SelectedLocation {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as SelectedLocation;
  } catch {
    // corrupted or unavailable — fall back to default
  }
  return DEFAULT_LOCATION;
}

function persistLocation(loc: SelectedLocation) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(loc));
  } catch {
    // quota exceeded or private browsing — silently ignore
  }
}

interface LocationContextValue {
  selectedLocation: SelectedLocation;
  setSelectedLocation: (loc: SelectedLocation) => void;
  updateLocationCoords: (
    updater: (prev: SelectedLocation) => SelectedLocation,
  ) => void;
  locationName: string;
}

const LocationContext = createContext<LocationContextValue | null>(null);

export function LocationProvider({ children }: { children: ReactNode }) {
  const [selectedLocation, setRaw] = useState<SelectedLocation>(
    loadPersistedLocation,
  );

  useEffect(() => {
    persistLocation(selectedLocation);
  }, [selectedLocation]);

  const setSelectedLocation = useCallback((loc: SelectedLocation) => {
    setRaw(loc);
  }, []);

  const updateLocationCoords = useCallback(
    (updater: (prev: SelectedLocation) => SelectedLocation) => {
      setRaw(updater);
    },
    [],
  );

  const locationName = selectedLocation.name;

  return (
    <LocationContext.Provider
      value={{
        selectedLocation,
        setSelectedLocation,
        updateLocationCoords,
        locationName,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
}

export function useLocation(): LocationContextValue {
  const ctx = useContext(LocationContext);
  if (!ctx) {
    throw new Error("useLocation must be used within a LocationProvider");
  }
  return ctx;
}
