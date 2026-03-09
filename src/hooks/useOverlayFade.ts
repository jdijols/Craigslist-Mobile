import { useRef, useState, useCallback } from "react";

const BOTTOM_THRESHOLD = 40;

export function useOverlayFade() {
  const [overlayVisible, setOverlayVisible] = useState(true);
  const lastScrollTop = useRef(0);
  const visibleRef = useRef(true);

  const handleOverlayScroll = useCallback(
    (e: React.UIEvent<HTMLDivElement>) => {
      const el = e.currentTarget;
      const { scrollTop, scrollHeight, clientHeight } = el;
      const distanceFromBottom = scrollHeight - scrollTop - clientHeight;
      const scrollingUp = scrollTop < lastScrollTop.current;
      const atBottom = distanceFromBottom <= BOTTOM_THRESHOLD;

      if (atBottom && visibleRef.current) {
        visibleRef.current = false;
        setOverlayVisible(false);
      } else if (scrollingUp && !atBottom && !visibleRef.current) {
        visibleRef.current = true;
        setOverlayVisible(true);
      }

      lastScrollTop.current = scrollTop;
    },
    [],
  );

  const restoreOverlay = useCallback(() => {
    if (!visibleRef.current) {
      visibleRef.current = true;
      setOverlayVisible(true);
    }
  }, []);

  return { overlayVisible, handleOverlayScroll, restoreOverlay };
}
