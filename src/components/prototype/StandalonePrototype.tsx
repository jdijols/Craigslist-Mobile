import { useState, useCallback } from "react";
import { AppPrototype } from "./AppPrototype";
import { OverlayPortalProvider } from "../layout/OverlayPortal";
import type { ScreenId } from "./types";
import "../layout/PhoneFrame.css";

export function StandalonePrototype() {
  const [screen, setScreen] = useState<ScreenId>("home");
  const [overlayEl, setOverlayEl] = useState<HTMLDivElement | null>(null);
  const [cursorOver, setCursorOver] = useState(false);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });

  const handleNavigate = useCallback((s: ScreenId) => {
    setScreen(s);
  }, []);

  const handlePointerEnter = useCallback(() => setCursorOver(true), []);
  const handlePointerLeave = useCallback(() => setCursorOver(false), []);
  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    setCursorOver(true);
    setCursorPos({ x: e.clientX, y: e.clientY });
  }, []);

  return (
    <div
      className="h-dvh w-full flex justify-center"
      style={{ background: "linear-gradient(145deg, rgba(122, 31, 162, 0.10) 0%, rgba(122, 31, 162, 0.07) 100%), #f9fafb" }}
    >
      <div
        className={`phone-screen w-full max-w-[540px]${cursorOver ? " cursor-none" : ""}`}
        style={{
          position: "relative",
          top: "auto",
          left: "auto",
          right: "auto",
          bottom: "auto",
          paddingTop: 0,
          borderRadius: 0,
          "--chrome-offset": "0px",
        } as React.CSSProperties}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
        onPointerMove={handlePointerMove}
      >
        <OverlayPortalProvider value={overlayEl}>
          <AppPrototype
            screen={screen}
            onNavigate={handleNavigate}
          />
        </OverlayPortalProvider>
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
      {cursorOver && (
        <div
          className="pointer-events-none fixed z-[100] h-6 w-6 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-lf-blue bg-lf-blue-light/30"
          style={{ left: cursorPos.x, top: cursorPos.y }}
          aria-hidden
        />
      )}
    </div>
  );
}
