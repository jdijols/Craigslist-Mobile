import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from "react";

/** Default status bar colors by system preference (main app header).
 * Matches --color-cl-surface: light #ffffff, dark #0f0f0f from index.css tokens. */
const DEFAULT_LIGHT = "#ffffff";
const DEFAULT_DARK = "#0f0f0f";

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

function applyStatusBarColor(top: string, bottom?: string) {
  document.documentElement.style.setProperty("--status-bar-bg", top);

  const meta = document.querySelector<HTMLMetaElement>(
    'meta[name="theme-color"]',
  );
  if (meta) meta.content = top;

  const topEl = document.getElementById("safari-status-bar-tint");
  const bottomEl = document.getElementById("safari-home-indicator-tint");
  if (topEl) topEl.style.backgroundColor = top;
  if (bottomEl) bottomEl.style.backgroundColor = bottom ?? top;
}

interface StatusBarColorContextValue {
  /** Set status bar color. Pass null to revert to default (header color by theme).
   *  Optional second arg sets a different bottom (home indicator) color. */
  setStatusBarColor: (color: string | null, bottomColor?: string | null) => void;
}

const StatusBarColorContext = createContext<StatusBarColorContextValue | null>(
  null,
);

export function StatusBarColorProvider({ children }: { children: ReactNode }) {
  const [override, setOverride] = useState<string | null>(null);
  const [bottomOverride, setBottomOverride] = useState<string | null>(null);
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
    applyStatusBarColor(color, bottomOverride ?? undefined);
  }, [override, bottomOverride, defaultColor]);

  const setStatusBarColor = useCallback((color: string | null, bottomColor?: string | null) => {
    setOverride(color);
    setBottomOverride(bottomColor ?? null);
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
