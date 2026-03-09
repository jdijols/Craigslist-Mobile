import type { ReactNode } from "react";
import { useState, useCallback, useEffect, useRef } from "react";
import { StatusBar } from "./StatusBar";
import { OverlayPortalProvider } from "./OverlayPortal";
import "./PhoneFrame.css";

interface PhoneFrameProps {
  children: ReactNode;
}

/**
 * Pure-CSS iPhone 13-style bezel.
 * Display area matches iPhone 13 logical resolution (390×844 px).
 * The dynamic island is cosmetic — iPhone 13 has a notch; adjust if you prefer notch styling.
 * Stops wheel and touch propagation so interactions inside the prototype don't trigger slide navigation.
 * Shows a circle cursor when the pointer is over the phone screen (mobile simulator style).
 * All of this is scoped to the white screen area only — not the bezel or drop shadow.
 */
export function PhoneFrame({ children }: PhoneFrameProps) {
  const [cursorOverPhone, setCursorOverPhone] = useState(false);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [overlayEl, setOverlayEl] = useState<HTMLDivElement | null>(null);
  const screenRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = screenRef.current;
    if (!el) return;

    const blockWheel = (e: WheelEvent) => {
      e.stopPropagation();
      const target = e.target as HTMLElement | null;
      const scroller = target?.closest(
        "[class*='overflow-y-auto'], [class*='overflow-x-auto']",
      );
      if (!scroller) {
        e.preventDefault();
      }
    };

    el.addEventListener("wheel", blockWheel, { passive: false });
    return () => el.removeEventListener("wheel", blockWheel);
  }, []);

  const stopTouch = (e: React.TouchEvent) => {
    e.stopPropagation();
  };

  const handlePointerEnter = useCallback(() => setCursorOverPhone(true), []);
  const handlePointerLeave = useCallback(() => setCursorOverPhone(false), []);
  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    setCursorPos({ x: e.clientX, y: e.clientY });
  }, []);

  return (
    <div className="flex h-full items-center justify-center p-8">
      <div className="relative">
        <div className="phone-wrapper">
          <div className="phone-bezel">
            {/* Dynamic Island */}
            <div className="dynamic-island" />

            {/* Status bar (time, signal, battery) */}
            <StatusBar />

            {/* Screen area — circle cursor and slide-nav block only when pointer is here */}
            <div
              ref={screenRef}
              className={`phone-screen ${cursorOverPhone ? "cursor-none" : ""}`}
              onPointerEnter={handlePointerEnter}
              onPointerLeave={handlePointerLeave}
              onPointerMove={handlePointerMove}
              onTouchStart={stopTouch}
              onTouchEnd={stopTouch}
              onTouchMove={stopTouch}
            >
              <OverlayPortalProvider value={overlayEl}>
                {children}
              </OverlayPortalProvider>
              {/* Full-screen overlay target — sits above all app content including TabBar */}
              <div
                ref={setOverlayEl}
                style={{
                  position: "absolute",
                  inset: 0,
                  zIndex: 50,
                  pointerEvents: "none",
                }}
              />
            </div>

            {/* Covers escaped backdrop-filter at corners */}
            <div className="bezel-overlay" />

            {/* Home indicator */}
            <div className="home-indicator" />
          </div>
        </div>
        {cursorOverPhone && (
          <div
            className="pointer-events-none fixed z-[100] h-6 w-6 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-lf-blue bg-lf-blue-light/30"
            style={{ left: cursorPos.x, top: cursorPos.y }}
            aria-hidden
          />
        )}
      </div>
    </div>
  );
}
