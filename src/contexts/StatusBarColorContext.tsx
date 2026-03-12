import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from "react";

/** Default status bar colors by system preference (main app header) */
const DEFAULT_LIGHT = "#ffffff";
const DEFAULT_DARK = "#1C1C1E";

function isTransparent(color: string): boolean {
  if (!color || color === "transparent") return true;
  const m = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
  return m ? parseFloat(m[4] ?? "1") < 0.01 : false;
}

function getDefaultColor(): string {
  if (typeof window === "undefined") return DEFAULT_LIGHT;
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? DEFAULT_DARK
    : DEFAULT_LIGHT;
}

function applyStatusBarColor(color: string) {
  document.documentElement.style.setProperty("--status-bar-bg", color);

  const meta = document.querySelector<HTMLMetaElement>(
    'meta[name="theme-color"]',
  );
  if (meta) meta.content = color;

  const topEl = document.getElementById("safari-status-bar-tint");
  const bottomEl = document.getElementById("safari-home-indicator-tint");
  if (topEl) topEl.style.backgroundColor = color;
  if (bottomEl) bottomEl.style.backgroundColor = color;
}

interface StatusBarColorContextValue {
  /** Set status bar color. Pass null to revert to default (header color by theme). */
  setStatusBarColor: (color: string | null) => void;
}

const StatusBarColorContext = createContext<StatusBarColorContextValue | null>(
  null,
);

export function StatusBarColorProvider({ children }: { children: ReactNode }) {
  const [override, setOverride] = useState<string | null>(null);
  const [defaultColor, setDefaultColor] = useState(getDefaultColor);

  useEffect(() => {
    const mql = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => {
      const next = mql.matches ? DEFAULT_DARK : DEFAULT_LIGHT;
      setDefaultColor(next);
    };
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    const color = override ?? defaultColor;
    applyStatusBarColor(color);
  }, [override, defaultColor]);

  const setStatusBarColor = useCallback((color: string | null) => {
    setOverride(color);
  }, []);

  return (
    <StatusBarColorContext.Provider value={{ setStatusBarColor }}>
      {children}
    </StatusBarColorContext.Provider>
  );
}

export function useStatusBarColor(): StatusBarColorContextValue {
  const ctx = useContext(StatusBarColorContext);
  if (!ctx) {
    throw new Error(
      "useStatusBarColor must be used within a StatusBarColorProvider",
    );
  }
  return ctx;
}

/** Returns a callback ref: attach to the root element whose background should match the status bar. */
export function useStatusBarColorFromElement() {
  const { setStatusBarColor } = useStatusBarColor();
  const [element, setElement] = useState<HTMLElement | null>(null);
  const [colorScheme, setColorScheme] = useState(() =>
    typeof window !== "undefined"
      ? window.matchMedia("(prefers-color-scheme: dark)").matches
      : false,
  );

  const ref = useCallback((node: HTMLElement | null) => {
    setElement(node);
  }, []);

  useEffect(() => {
    const mql = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => setColorScheme(mql.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    if (!element) {
      setStatusBarColor(null);
      return;
    }
    let color = getComputedStyle(element).backgroundColor;
    let parent: HTMLElement | null = element.parentElement;
    while (parent && isTransparent(color)) {
      color = getComputedStyle(parent).backgroundColor;
      parent = parent.parentElement;
    }
    if (color && !isTransparent(color)) {
      setStatusBarColor(color);
    } else {
      setStatusBarColor(null);
    }
    return () => setStatusBarColor(null);
  }, [element, setStatusBarColor, colorScheme]);

  return ref;
}
