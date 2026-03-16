import { useState, useMemo, useRef, useLayoutEffect, useCallback, useEffect } from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import {
  Star, MapPin, Clock, X, Phone, Mail, ExternalLink, Copy,
  ShoppingBag, Home, Briefcase, Wrench, Users, Zap, FileText,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { ShareIcon } from "../../ui/ShareIcon";
import type { ScreenId } from "../types";
import {
  postDetailVariants,
  type PostDetailVariantId,
  type PostDetailVariant,
} from "../../../data/listings";
import { toggleFavorite, useIsFavorited } from "../../../data/favorites";
import type { ListingData } from "../../ui/cards/types";
import { ShareSheet } from "../components/ShareSheet";
import { ImageViewer } from "../components/ImageViewer";
import { ListingAttributes } from "../components/ListingAttributes";
import { HOOD_COORDS } from "../components/MapView";
import { StaticMapLayer } from "../components/StaticMapLayer";
import type { PostCategory } from "../../ui/cards/types";
import { useStatusBarColor } from "../../../contexts/StatusBarColorContext";

const CATEGORY_ICONS: Record<string, LucideIcon> = {
  "for sale": ShoppingBag,
  housing: Home,
  jobs: Briefcase,
  services: Wrench,
  community: Users,
  gigs: Zap,
  resumes: FileText,
};

const CTA_H = 138;
const HEADER_H = 112;
const OVERLAY_BTN_GAP = 12; /* gap between safe-area-top and overlay buttons */
const OVERLAY_BTN_H = 40; /* button h-10 */
const OVERLAY_GAP = 16; /* gap between overlay bottom and sheet top when expanded */
/** Velocity (px/s) above which a downward flick snaps toward collapsed */
const VELOCITY_DOWN_THRESHOLD = 350;
/** Velocity (px/s) above which an upward flick snaps toward expanded */
const VELOCITY_UP_THRESHOLD = 350;
/** Max movement (px) to treat as a click rather than drag */
const CLICK_THRESHOLD = 8;
/** Momentum decay per frame (0–1, higher = more glide) */
const MOMENTUM_DECAY = 0.95;
/** Stop momentum when velocity drops below this (px/frame) */
const MOMENTUM_STOP = 0.5;
/** Delay (ms) after last wheel event to snap the sheet */
const WHEEL_SNAP_DELAY = 150;

interface GestureData {
  active: boolean;
  startClientY: number;
  prevClientY: number;
  prevTime: number;
  didMove: boolean;
  samples: Array<{ dy: number; dt: number }>;
}

interface PostDetailProps {
  onNavigate?: (screen: ScreenId) => void;
  onDismiss?: () => void;
  onReplySubmit?: (message: string, variant: PostDetailVariant) => void;
  variantId?: PostDetailVariantId;
  variant?: PostDetailVariant;
  listing?: ListingData | null;
  hasExistingChat?: boolean;
}

export function PostDetail({
  onNavigate,
  onDismiss,
  onReplySubmit,
  variantId = "dresser",
  variant: variantProp,
  listing,
  hasExistingChat,
}: PostDetailProps) {
  const defaultMessage = hasExistingChat ? "" : "hi, i'm interested in your post!";
  const [shareOpen, setShareOpen] = useState(false);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [viewerIndex, setViewerIndex] = useState(0);
  const [message, setMessage] = useState(defaultMessage);
  const [copyToast, setCopyToast] = useState<string | null>(null);
  const copyTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const contactInfo = { phone: "7325478709", email: "jasondijols@gmail.com" };

  /* Set Safari safe-area tints: black top (images), surface bottom (CTA) */
  const { setStatusBarColor } = useStatusBarColor();
  useEffect(() => {
    const surface = getComputedStyle(document.documentElement)
      .getPropertyValue("--color-cl-surface").trim() || "#ffffff";
    setStatusBarColor("#000000", surface);
    return () => setStatusBarColor(null);
  }, [setStatusBarColor]);

  const handleCopy = useCallback((type: "phone" | "email") => {
    const value = type === "phone" ? contactInfo.phone : contactInfo.email;
    navigator.clipboard.writeText(value).catch(() => {});
    if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current);
    setCopyToast(`${type === "phone" ? "phone number" : "email"} copied`);
    copyTimeoutRef.current = setTimeout(() => setCopyToast(null), 1800);
  }, []);
  const variant = variantProp ?? postDetailVariants[variantId];

  const effectiveListing: ListingData = listing ?? {
    id: variant.id,
    title: variant.title,
    image: variant.image,
    images: variant.images,
    price: variant.price,
    hood: variant.hood,
  };
  const isFav = useIsFavorited(effectiveListing.id);

  const detailCategory: PostCategory | undefined = effectiveListing.category ?? (() => {
    const prefix = variant.categoryLabel?.split(" › ")[0]?.toLowerCase();
    if (prefix === "housing") return "housing";
    if (prefix === "for sale") return "for-sale";
    if (prefix === "jobs") return "jobs";
    if (prefix === "gigs") return "gigs";
    if (prefix === "resumes") return "resumes";
    if (prefix === "services") return "services";
    if (prefix === "community") return "community";
    return undefined;
  })();

  const detailAttributes = variant.attributes ?? effectiveListing.attributes;

  const images = useMemo(
    () => (variant.images?.length ? variant.images : [variant.image]),
    [variant.images, variant.image],
  );

  const handleClose = () => {
    if (onDismiss) onDismiss();
    else onNavigate?.("home");
  };

  const handleSend = () => {
    const text = (message || defaultMessage).trim();
    if (!text) return;
    if (onReplySubmit) {
      onReplySubmit(text, variant);
    } else {
      onNavigate?.("chat");
    }
  };

  /* ── Sheet snap state ── */
  const containerRef = useRef<HTMLDivElement>(null);
  const imagesRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const sheetY = useMotionValue(0);
  const [snapIdx, setSnapIdx] = useState(1);
  const [ready, setReady] = useState(false);

  const [containerH, setContainerH] = useState(700);
  const [containerW, setContainerW] = useState(390);
  const [modalExtendsUp, setModalExtendsUp] = useState(0);
  const [safeAreaTop, setSafeAreaTop] = useState(44);
  const [firstImageH, setFirstImageH] = useState<number | null>(null);
  const sheetHeaderRef = useRef<HTMLDivElement>(null);
  const [sheetHeaderH, setSheetHeaderH] = useState(70);

  const snapPoints = useMemo(() => {
    const overlayBottom = safeAreaTop + OVERLAY_BTN_GAP + modalExtendsUp + OVERLAY_BTN_H;
    const fullSnap = overlayBottom + OVERLAY_GAP;
    const imageH = firstImageH ?? Math.round(containerW * 0.75);
    const firstImageBottom = modalExtendsUp + imageH;
    const allImagesBottom = modalExtendsUp + imageH * images.length;
    const maxDefault = containerH - CTA_H - HEADER_H;
    const defaultSnap = Math.max(firstImageBottom, Math.min(allImagesBottom, maxDefault));
    return [fullSnap, defaultSnap];
  }, [containerH, containerW, modalExtendsUp, safeAreaTop, images.length, firstImageH]);

  const imagesPadding = containerH - snapPoints[1];

  /** Bottom padding for sheet content so the last element (map) can scroll
   *  fully into view with a consistent gap above the CTA bar. */
  const MAP_SECTION_H = 230; /* label row + 180px map + caption ≈ 230px */
  const CONTENT_END_GAP = 20;
  const expandedContentH = containerH - CTA_H - snapPoints[0] - sheetHeaderH;
  const contentBottomPad = Math.max(CONTENT_END_GAP, expandedContentH - MAP_SECTION_H);

  /* ── Measure first image actual height ── */
  const measureFirstImage = useCallback((el: HTMLImageElement | null) => {
    if (!el) return;
    const measure = () => {
      const h = el.offsetHeight;
      if (h > 0) setFirstImageH(h);
    };
    if (el.complete && el.naturalHeight > 0) {
      measure();
    } else {
      el.addEventListener("load", measure, { once: true });
    }
  }, []);

  /* Re-snap to default when firstImageH changes (image loads after initial layout) */
  useEffect(() => {
    if (firstImageH == null || !ready) return;
    if (snapIdx === 1) {
      sheetY.set(snapPoints[1]);
    }
  }, [firstImageH]); // eslint-disable-line react-hooks/exhaustive-deps

  useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const h = el.clientHeight;
    const w = el.clientWidth;
    const me = parseInt(
      getComputedStyle(el).getPropertyValue("--modal-extends-up").trim() || "0",
      10
    );
    const sa = parseInt(
      getComputedStyle(el).getPropertyValue("--safe-area-top").trim() || "0",
      10
    );
    setContainerH(h);
    setContainerW(w);
    setModalExtendsUp(Number.isNaN(me) ? 0 : me);
    setSafeAreaTop(Number.isNaN(sa) ? 0 : sa);
    if (sheetHeaderRef.current) setSheetHeaderH(sheetHeaderRef.current.offsetHeight);

    const imgH = firstImageH ?? Math.round(w * 0.75);
    const meVal = Number.isNaN(me) ? 0 : me;
    const firstImageBottom = meVal + imgH;
    const allImagesBottom = meVal + imgH * images.length;
    const maxDefault = h - CTA_H - HEADER_H;
    const initialSheetY = Math.max(firstImageBottom, Math.min(allImagesBottom, maxDefault));
    sheetY.set(initialSheetY);
    setReady(true);
  }, [sheetY, images.length, firstImageH]);

  /* ── Resize observer for keyboard / viewport changes ── */
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      setContainerH(el.clientHeight);
      setContainerW(el.clientWidth);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const prefersReducedMotion = useMemo(
    () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    [],
  );

  const springConfig = useMemo(
    () => prefersReducedMotion
      ? { duration: 0.2, ease: "easeOut" as const }
      : { type: "spring" as const, damping: 25, stiffness: 250 },
    [prefersReducedMotion],
  );

  const snapTo = useCallback(
    (idx: number) => {
      const clamped = Math.max(0, Math.min(snapPoints.length - 1, idx));
      setSnapIdx(clamped);
      animate(sheetY, snapPoints[clamped], springConfig);
    },
    [snapPoints, sheetY, springConfig],
  );

  const findNearestSnapIndex = useCallback(
    (y: number, velocityY: number) => {
      const pts = snapPoints;
      if (velocityY > VELOCITY_DOWN_THRESHOLD) {
        const idx = pts.findIndex((p) => p >= y);
        return idx >= 0 ? idx : pts.length - 1;
      }
      if (velocityY < -VELOCITY_UP_THRESHOLD) {
        for (let i = pts.length - 1; i >= 0; i--) {
          if (pts[i] <= y) return i;
        }
        return 0;
      }
      let nearest = 0;
      let minDist = Math.abs(y - pts[0]);
      for (let i = 1; i < pts.length; i++) {
        const d = Math.abs(y - pts[i]);
        if (d < minDist) {
          minDist = d;
          nearest = i;
        }
      }
      return nearest;
    },
    [snapPoints],
  );

  /* ── Unified gesture coordinator ── */
  const gestureRef = useRef<GestureData | null>(null);
  const lastDragDidMove = useRef(false);
  const momentumRaf = useRef(0);
  const wheelEndTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  /** Route a pointer/wheel delta through the three-phase system.
   *  delta > 0 = finger moved DOWN, delta < 0 = finger moved UP. */
  const routeGestureDelta = useCallback(
    (delta: number) => {
      const currentY = sheetY.get();
      const atExpanded = currentY <= snapPoints[0] + 1;
      const atDefault = currentY >= snapPoints[1] - 1;
      const imgEl = imagesRef.current;
      const cntEl = contentRef.current;

      if (delta < 0) {
        /* ── UPWARD gesture ── */
        if (!atDefault && !atExpanded) {
          // Sheet mid-drag → keep moving up
          sheetY.set(Math.max(snapPoints[0], currentY + delta));
        } else if (atDefault) {
          const maxImgScroll = imgEl ? imgEl.scrollHeight - imgEl.clientHeight : 0;
          const imgAtBottom = maxImgScroll <= 0 || (imgEl ? imgEl.scrollTop >= maxImgScroll - 2 : true);
          if (!imgAtBottom && imgEl) {
            // Scroll images up
            imgEl.scrollTop = Math.min(maxImgScroll, imgEl.scrollTop - delta);
          } else {
            // Images at bottom → start expanding sheet
            sheetY.set(Math.max(snapPoints[0], currentY + delta));
          }
        } else if (atExpanded && cntEl) {
          // Scroll content up
          const maxScroll = cntEl.scrollHeight - cntEl.clientHeight;
          cntEl.scrollTop = Math.min(maxScroll, cntEl.scrollTop - delta);
        }
      } else if (delta > 0) {
        /* ── DOWNWARD gesture ── */
        if (atExpanded || (!atDefault && !atExpanded)) {
          const contentAtTop = !cntEl || cntEl.scrollTop <= 1;
          if (!contentAtTop && cntEl) {
            // Content not at top → scroll content down
            cntEl.scrollTop = Math.max(0, cntEl.scrollTop - delta);
          } else if (!atDefault) {
            // Content at top → collapse sheet
            sheetY.set(Math.min(snapPoints[1], currentY + delta));
          }
        } else if (atDefault && imgEl) {
          // Scroll images down
          imgEl.scrollTop = Math.max(0, imgEl.scrollTop - delta);
        }
      }
    },
    [sheetY, snapPoints],
  );

  function computeVelocity(samples: Array<{ dy: number; dt: number }>): number {
    if (samples.length === 0) return 0;
    let totalDy = 0;
    let totalDt = 0;
    for (const s of samples) {
      totalDy += s.dy;
      totalDt += s.dt;
    }
    if (totalDt < 1) return 0;
    return (totalDy / totalDt) * 1000; // px/s
  }

  /** Determine which phase the sheet is in right now for momentum. */
  const getCurrentPhase = useCallback((): "images" | "sheet" | "content" => {
    const currentY = sheetY.get();
    const atExpanded = currentY <= snapPoints[0] + 1;
    const atDefault = currentY >= snapPoints[1] - 1;
    if (atExpanded) return "content";
    if (atDefault) return "images";
    return "sheet";
  }, [sheetY, snapPoints]);

  const cancelMomentum = useCallback(() => {
    if (momentumRaf.current) {
      cancelAnimationFrame(momentumRaf.current);
      momentumRaf.current = 0;
    }
  }, []);

  /* ── Pointer event handlers ── */
  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest("[data-no-gesture]") || target.tagName === "INPUT") return;

      cancelMomentum();
      e.preventDefault();

      const now = Date.now();
      gestureRef.current = {
        active: true,
        startClientY: e.clientY,
        prevClientY: e.clientY,
        prevTime: now,
        didMove: false,
        samples: [],
      };
    },
    [cancelMomentum],
  );

  useEffect(() => {
    if (!ready || snapPoints.length === 0) return;

    const onPointerMove = (e: PointerEvent) => {
      const g = gestureRef.current;
      if (!g || !g.active) return;

      const clientY = e.clientY;
      const delta = clientY - g.prevClientY;
      const totalDelta = Math.abs(clientY - g.startClientY);

      if (totalDelta > CLICK_THRESHOLD) g.didMove = true;

      if (g.didMove) {
        routeGestureDelta(delta);
      }

      const now = Date.now();
      g.samples.push({ dy: delta, dt: now - g.prevTime });
      if (g.samples.length > 5) g.samples.shift();
      g.prevClientY = clientY;
      g.prevTime = now;
    };

    const onPointerUp = () => {
      const g = gestureRef.current;
      if (!g || !g.active) return;
      g.active = false;
      lastDragDidMove.current = g.didMove;

      const velocity = computeVelocity(g.samples); // px/s, positive = down
      const currentY = sheetY.get();
      const sheetBetween = currentY > snapPoints[0] + 1 && currentY < snapPoints[1] - 1;

      if (sheetBetween) {
        // Sheet is mid-drag → snap
        const targetIdx = findNearestSnapIndex(currentY, velocity);
        setSnapIdx(targetIdx);
        animate(sheetY, snapPoints[targetIdx], springConfig);
      } else {
        // Apply momentum to image or content scroll
        const phase = getCurrentPhase();
        if ((phase === "images" || phase === "content") && Math.abs(velocity) > 100) {
          const el = phase === "images" ? imagesRef.current : contentRef.current;
          if (el) {
            let v = -velocity / 60; // px/frame (negate: positive velocity = finger down = scrollTop decreases)
            const step = () => {
              v *= MOMENTUM_DECAY;
              if (Math.abs(v) < MOMENTUM_STOP) return;
              const max = el.scrollHeight - el.clientHeight;
              el.scrollTop = Math.max(0, Math.min(max, el.scrollTop + v));
              momentumRaf.current = requestAnimationFrame(step);
            };
            momentumRaf.current = requestAnimationFrame(step);
          }
        }
      }

      gestureRef.current = null;
    };

    const onPointerCancel = () => {
      const g = gestureRef.current;
      if (!g || !g.active) return;
      g.active = false;
      lastDragDidMove.current = g.didMove;

      const currentY = sheetY.get();
      if (currentY > snapPoints[0] + 1 && currentY < snapPoints[1] - 1) {
        const targetIdx = findNearestSnapIndex(currentY, 0);
        setSnapIdx(targetIdx);
        animate(sheetY, snapPoints[targetIdx], springConfig);
      }
      gestureRef.current = null;
    };

    document.addEventListener("pointermove", onPointerMove, { passive: true });
    document.addEventListener("pointerup", onPointerUp);
    document.addEventListener("pointercancel", onPointerCancel);
    return () => {
      document.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("pointerup", onPointerUp);
      document.removeEventListener("pointercancel", onPointerCancel);
    };
  }, [ready, snapPoints, sheetY, findNearestSnapIndex, springConfig, routeGestureDelta, getCurrentPhase]);

  /* ── Wheel handler (needs passive:false to preventDefault) ── */
  useEffect(() => {
    const el = containerRef.current;
    if (!el || !ready) return;

    const onWheel = (e: WheelEvent) => {
      if ((e.target as HTMLElement).closest("[data-no-gesture]")) return;
      e.preventDefault();

      routeGestureDelta(-e.deltaY * 0.5);

      // Debounced snap when sheet is between snap points
      if (wheelEndTimer.current) clearTimeout(wheelEndTimer.current);
      wheelEndTimer.current = setTimeout(() => {
        const currentY = sheetY.get();
        if (currentY > snapPoints[0] + 1 && currentY < snapPoints[1] - 1) {
          const targetIdx = findNearestSnapIndex(currentY, 0);
          setSnapIdx(targetIdx);
          animate(sheetY, snapPoints[targetIdx], springConfig);
        }
      }, WHEEL_SNAP_DELAY);
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [ready, snapPoints, sheetY, findNearestSnapIndex, springConfig, routeGestureDelta]);

  /* ── Cleanup momentum on unmount ── */
  useEffect(() => () => cancelMomentum(), [cancelMomentum]);

  const isExpanded = snapIdx === 0;

  const imageOverlayOpacity = useTransform(
    sheetY,
    [snapPoints[0], snapPoints[1]],
    [0.4, 0],
    { clamp: true },
  );

  const chevronAngle = useTransform(
    sheetY,
    [snapPoints[0], snapPoints[1]],
    [18, 0],
  );
  const chevronAngleNeg = useTransform(chevronAngle, (v) => -v);
  const chevronShift = useTransform(
    sheetY,
    [snapPoints[0], snapPoints[1]],
    [3, 0],
  );

  /* ── Click on handle bar toggles between expanded / default (not when it was a drag) ── */
  const handleHandleClick = useCallback(() => {
    if (lastDragDidMove.current) return;
    snapTo(isExpanded ? 1 : 0);
  }, [isExpanded, snapTo]);

  return (
    <div
      ref={containerRef}
      className="relative flex h-full flex-col overflow-hidden bg-black"
      style={{ touchAction: "none" }}
      onPointerDown={handlePointerDown}
    >
      {/* ── Floating glass navigation ── */}
      <div
        data-no-gesture
        className="pointer-events-none absolute left-4 right-4 z-30 flex items-start justify-between"
        style={{ top: "calc(var(--safe-area-top) + 12px + var(--modal-extends-up, 0px))" }}
      >
        <button
          type="button"
          onClick={handleClose}
          className="pointer-events-auto flex h-10 w-10 items-center justify-center rounded-[--radius-button] bg-cl-surface/90 shadow-md backdrop-blur-[6px] outline-none active:opacity-90"
          aria-label="Close"
        >
          <X className="h-5 w-5 text-cl-text" strokeWidth={2} />
        </button>

        <div className="pointer-events-auto flex flex-row overflow-hidden rounded-[--radius-button] bg-cl-surface/90 shadow-md backdrop-blur-[6px]">
          <button
            type="button"
            onClick={() => toggleFavorite(effectiveListing)}
            className="relative flex h-10 w-10 items-center justify-center outline-none active:opacity-90"
            aria-label={isFav ? "Remove from favorites" : "Add to favorites"}
          >
            <Star
              className="h-5 w-5"
              strokeWidth={1.8}
              stroke={isFav ? "var(--color-cl-favorite)" : "var(--color-cl-text)"}
              fill="transparent"
            />
            {isFav && (
              <span className="absolute bottom-1 left-1/2 -translate-x-1/2 h-1 w-1 rounded-full bg-cl-favorite" />
            )}
          </button>
          <button
            type="button"
            onClick={() => setShareOpen(true)}
            className="flex h-10 w-10 items-center justify-center border-l border-cl-border outline-none active:opacity-90"
            aria-label="Share"
          >
            <ShareIcon className="h-[18px] w-[18px] text-cl-text" />
          </button>
        </div>
      </div>

      {/* ── Images — scroll behind the sheet (driven by gesture coordinator) ── */}
      <div
        ref={imagesRef}
        className="relative flex-1 overflow-hidden overscroll-contain scrollbar-none"
        style={{
          paddingTop: modalExtendsUp > 0 ? `${modalExtendsUp}px` : undefined,
          paddingBottom: `${imagesPadding}px`,
          pointerEvents: isExpanded ? "none" : undefined,
        }}
      >
        {images.map((src, i) => (
          <button
            key={i}
            type="button"
            className="relative block w-full outline-none active:opacity-95"
            onClick={() => {
              if (lastDragDidMove.current) return;
              setViewerIndex(i);
              setViewerOpen(true);
            }}
          >
            <img
              ref={i === 0 ? measureFirstImage : undefined}
              src={src}
              alt={`${variant.title} ${i + 1}`}
              className="block w-full h-auto"
              loading={i === 0 ? "eager" : "lazy"}
              draggable={false}
            />

          </button>
        ))}
      </div>

      {/* Progressive scrim over images as sheet rises */}
      <motion.div
        className="absolute inset-0 z-10 bg-black"
        style={{ opacity: imageOverlayOpacity, pointerEvents: "none" }}
      />

      {/* ── Bottom sheet ── */}
      <motion.div
        className="absolute inset-x-0 top-0 z-20 flex flex-col bg-cl-surface shadow-[var(--shadow-sheet)]"
        style={{ y: sheetY, bottom: CTA_H, visibility: ready ? "visible" : "hidden" }}
      >
        {/* Header — handle + title + price */}
        <div ref={sheetHeaderRef} className="shrink-0 select-none" style={{ cursor: "grab" }}>
          <button
            type="button"
            className="flex w-full justify-center pt-2.5 pb-1 outline-none"
            onClick={handleHandleClick}
            aria-label={isExpanded ? "Collapse details" : "Expand details"}
          >
            <motion.div className="flex items-center" style={{ y: chevronShift }}>
              <motion.div
                className="-mr-px h-1 w-[21px] rounded-full bg-cl-border"
                style={{ transformOrigin: "100% 50%", rotate: chevronAngle }}
              />
              <motion.div
                className="-ml-px h-1 w-[21px] rounded-full bg-cl-border"
                style={{ transformOrigin: "0% 50%", rotate: chevronAngleNeg }}
              />
            </motion.div>
          </button>
          <div className="px-4 pt-1">
            <p className="text-[16px] font-bold text-cl-price">
              {variant.price}
            </p>
            <p className="mt-0.5 text-[19px] leading-snug text-cl-text">
              {variant.title}
            </p>
          </div>
        </div>

        {/* Content — scrollable (driven by gesture coordinator) */}
        <div
          ref={contentRef}
          className="min-h-0 flex-1 overflow-hidden overscroll-contain scrollbar-none"
        >
          {/* Quick-info chips */}
          <div className="mt-3 flex flex-wrap gap-2 px-4">
            <div className="flex items-center gap-1.5 rounded-[--radius-card] border border-cl-border px-3 py-2">
              <MapPin className="h-4 w-4 shrink-0 text-cl-text-muted" strokeWidth={2} />
              <span className="text-[12px] text-cl-text">
                {variant.hood} · {variant.distance}
              </span>
            </div>
            <div className="flex items-center gap-1.5 rounded-[--radius-card] border border-cl-border px-3 py-2">
              <Clock className="h-4 w-4 shrink-0 text-cl-text-muted" strokeWidth={2} />
              <span className="text-[12px] text-cl-text">{variant.timeAgo}</span>
            </div>
            {(() => {
              const prefix = variant.categoryLabel?.split(" › ")[0]?.toLowerCase() ?? "";
              const CatIcon = CATEGORY_ICONS[prefix] ?? ShoppingBag;
              return (
                <div className="flex items-center gap-1.5 rounded-[--radius-card] border border-cl-border px-3 py-2">
                  <CatIcon className="h-4 w-4 shrink-0 text-cl-text-muted" strokeWidth={2} />
                  <span className="text-[12px] text-cl-text">{variant.categoryLabel}</span>
                </div>
              );
            })()}
          </div>

          <div className="mx-4 mt-4 border-t-[0.5px] border-cl-border" />

          {/* Description */}
          <div className="mt-4 px-4">
            <span className="text-[11px] text-cl-text-muted">description</span>
            <p className="mt-0.5 text-[14px] leading-relaxed text-cl-text">
              {variant.description}
            </p>
            {variant.dimensions && (
              <p className="mt-1.5 text-[12px] text-cl-text-muted">
                {variant.dimensions}
              </p>
            )}
          </div>

          {detailCategory && detailAttributes && Object.keys(detailAttributes).length > 0 && (
            <>
              <div className="mx-4 mt-4 border-t-[0.5px] border-cl-border" />
              <ListingAttributes category={detailCategory} attributes={detailAttributes} />
            </>
          )}

          <div className="mx-4 mt-4 border-t-[0.5px] border-cl-border" />

          {/* Location / Map */}
          <div className="mt-4 px-4" style={{ paddingBottom: `${contentBottomPad}px` }}>
            <div className="mb-2 flex items-center justify-between">
              <p className="text-[13px] font-medium text-cl-text">
                {variant.hood}
              </p>
              <button
                type="button"
                className="flex items-center gap-1 outline-none active:opacity-70"
                data-no-gesture
              >
                <span className="text-[12px] font-medium text-cl-accent">open in maps</span>
                <ExternalLink className="h-3.5 w-3.5 text-cl-accent" strokeWidth={2} />
              </button>
            </div>
            <div className="relative h-[180px] w-full overflow-hidden rounded-[--radius-card-lg]">
              <StaticMapLayer
                center={{
                  longitude: (HOOD_COORDS[variant.hood.toLowerCase()] ?? { lng: -93.265 }).lng,
                  latitude: (HOOD_COORDS[variant.hood.toLowerCase()] ?? { lat: 44.978 }).lat,
                }}
              />
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                <MapPin
                  className="h-8 w-8 text-cl-accent drop-shadow-md"
                  fill="var(--color-cl-accent)"
                  strokeWidth={1.5}
                  stroke="white"
                />
              </div>
              <div className="absolute inset-0 z-10" />
            </div>
            <p className="mt-1.5 text-[11px] text-cl-text-muted">
              location is approximate
            </p>
          </div>
        </div>

      </motion.div>

      {/* ── Fixed CTA — always pinned to bottom, outside the sheet ── */}
      <div data-no-gesture className="absolute inset-x-0 bottom-0 z-30 border-t-[0.5px] border-cl-border bg-cl-surface px-4 pt-3" style={{ paddingBottom: "max(34px, env(safe-area-inset-bottom, 34px))", touchAction: "auto" }}>
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") handleSend(); }}
            placeholder={hasExistingChat ? "write something..." : defaultMessage}
            className="h-11 min-w-0 flex-1 rounded-[--radius-button] bg-cl-bg-secondary px-3 text-base text-cl-text outline-none placeholder:text-cl-text-muted transition-colors"
          />
          {(!hasExistingChat || message.trim()) && (
            <button
              type="button"
              onClick={handleSend}
              className="flex h-11 shrink-0 items-center justify-center rounded-[--radius-button] bg-cl-accent px-4 outline-none active:opacity-90"
              aria-label="Send message"
            >
              <span className="text-[14px] font-semibold text-cl-accent-text">send</span>
            </button>
          )}
        </div>
        <div className="mt-2 flex gap-2">
          <div className="flex min-h-[40px] flex-1 items-center rounded-[--radius-button] border border-cl-border bg-cl-surface">
            <a
              href={`tel:${contactInfo.phone}`}
              className="flex flex-1 items-center gap-1.5 py-2 pl-3 outline-none active:opacity-90"
            >
              <Phone className="h-4 w-4 text-cl-text-muted" strokeWidth={2} />
              <span className="text-[13px] font-medium text-cl-text">call</span>
            </a>
            <button
              type="button"
              onClick={() => handleCopy("phone")}
              className="flex items-center self-stretch border-l border-cl-border px-2.5 outline-none active:opacity-70"
              aria-label="Copy phone number"
            >
              <Copy className="h-3.5 w-3.5 text-cl-text-muted" strokeWidth={2} />
            </button>
          </div>
          <div className="flex min-h-[40px] flex-1 items-center rounded-[--radius-button] border border-cl-border bg-cl-surface">
            <a
              href={`mailto:${contactInfo.email}`}
              className="flex flex-1 items-center gap-1.5 py-2 pl-3 outline-none active:opacity-90"
            >
              <Mail className="h-4 w-4 text-cl-text-muted" strokeWidth={2} />
              <span className="text-[13px] font-medium text-cl-text">email</span>
            </a>
            <button
              type="button"
              onClick={() => handleCopy("email")}
              className="flex items-center self-stretch border-l border-cl-border px-2.5 outline-none active:opacity-70"
              aria-label="Copy email address"
            >
              <Copy className="h-3.5 w-3.5 text-cl-text-muted" strokeWidth={2} />
            </button>
          </div>
        </div>

        {/* Copy toast */}
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: copyToast ? 1 : 0, y: copyToast ? 0 : 6 }}
          transition={{ duration: 0.18 }}
          className="pointer-events-none absolute inset-x-0 -top-10 flex justify-center"
        >
          <span className="rounded-[--radius-button] bg-cl-text px-3 py-1.5 text-[12px] font-medium text-cl-surface">
            {copyToast}
          </span>
        </motion.div>
      </div>

      <ShareSheet
        open={shareOpen}
        onClose={() => setShareOpen(false)}
        variant="post"
        title={variant.title}
        image={variant.image}
      />

      {viewerOpen && (
        <ImageViewer
          images={images}
          initialIndex={viewerIndex}
          onClose={() => setViewerOpen(false)}
        />
      )}
    </div>
  );
}
