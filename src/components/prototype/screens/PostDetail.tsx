import { useState, useMemo, useRef, useLayoutEffect, useCallback } from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import {
  Star, MapPin, Clock, X, Phone, Mail, ExternalLink,
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
const HANDLE_H = 24;
const NAV_CLEARANCE = 60;
const SWIPE_THRESHOLD = 30;

interface PostDetailProps {
  onNavigate?: (screen: ScreenId) => void;
  onDismiss?: () => void;
  onReplySubmit?: (message: string, variant: PostDetailVariant) => void;
  variantId?: PostDetailVariantId;
  variant?: PostDetailVariant;
  listing?: ListingData | null;
}

export function PostDetail({
  onNavigate,
  onDismiss,
  onReplySubmit,
  variantId = "dresser",
  variant: variantProp,
  listing,
}: PostDetailProps) {
  const defaultMessage = "hi, i'm interested in your post!";
  const [shareOpen, setShareOpen] = useState(false);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [viewerIndex, setViewerIndex] = useState(0);
  const [message, setMessage] = useState(defaultMessage);
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
  const sheetY = useMotionValue(0);
  const [snapIdx, setSnapIdx] = useState(1);
  const [ready, setReady] = useState(false);

  const [containerH, setContainerH] = useState(700);
  const [containerW, setContainerW] = useState(390);
  const [chromeOff, setChromeOff] = useState(47);

  const snapPoints = useMemo(() => {
    const fullSnap = chromeOff + NAV_CLEARANCE;
    const allImagesBottom = chromeOff + Math.round(containerW * 0.75) * images.length;
    const maxDefault = containerH - CTA_H - HEADER_H;
    const defaultSnap = Math.min(allImagesBottom, maxDefault);
    const collapsedSnap = containerH - CTA_H - HANDLE_H;
    return [fullSnap, defaultSnap, collapsedSnap];
  }, [containerH, containerW, chromeOff, images.length]);

  const imagesPadding = containerH - snapPoints[1];

  useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const h = el.clientHeight;
    const w = el.clientWidth;
    const parsed = parseInt(getComputedStyle(el).paddingTop, 10);
    const co = Number.isNaN(parsed) ? 47 : parsed;
    setContainerH(h);
    setContainerW(w);
    setChromeOff(co);

    const allImagesBottom = co + Math.round(w * 0.75) * images.length;
    const maxDefault = h - CTA_H - HEADER_H;
    const initialSheetY = Math.min(allImagesBottom, maxDefault);
    sheetY.set(initialSheetY);
    setReady(true);
  }, [sheetY, images.length]);

  const snapTo = useCallback(
    (idx: number) => {
      const clamped = Math.max(0, Math.min(snapPoints.length - 1, idx));
      setSnapIdx(clamped);
      animate(sheetY, snapPoints[clamped], {
        type: "spring",
        damping: 30,
        stiffness: 300,
      });
    },
    [snapPoints, sheetY, snapIdx],
  );

  /* ── Swipe detection on header ── */
  const touchRef = useRef({ y: 0, time: 0 });

  const onSwipeStart = useCallback((clientY: number) => {
    touchRef.current = { y: clientY, time: Date.now() };
  }, []);

  const onSwipeEnd = useCallback(
    (clientY: number) => {
      const dy = clientY - touchRef.current.y;
      if (dy < -SWIPE_THRESHOLD) {
        snapTo(snapIdx - 1);
      } else if (dy > SWIPE_THRESHOLD) {
        snapTo(snapIdx + 1);
      }
    },
    [snapIdx, snapTo],
  );

  const handleHeaderTouchStart = useCallback(
    (e: React.TouchEvent) => onSwipeStart(e.touches[0].clientY),
    [onSwipeStart],
  );
  const handleHeaderTouchEnd = useCallback(
    (e: React.TouchEvent) => onSwipeEnd(e.changedTouches[0].clientY),
    [onSwipeEnd],
  );
  const handleHeaderMouseDown = useCallback(
    (e: React.MouseEvent) => onSwipeStart(e.clientY),
    [onSwipeStart],
  );
  const handleHeaderMouseUp = useCallback(
    (e: React.MouseEvent) => onSwipeEnd(e.clientY),
    [onSwipeEnd],
  );

  /* ── Scroll-wheel on header: scroll up → expand, scroll down → collapse ── */
  const handleHeaderWheel = useCallback(
    (e: React.WheelEvent) => {
      e.preventDefault();
      if (e.deltaY < -10) {
        snapTo(snapIdx - 1);
      } else if (e.deltaY > 10) {
        snapTo(snapIdx + 1);
      }
    },
    [snapIdx, snapTo],
  );

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

  /* ── Click on handle bar toggles between expanded / default ── */
  const handleHandleClick = useCallback(() => {
    snapTo(isExpanded ? 1 : 0);
  }, [isExpanded, snapTo]);

  /* ── Magnet: scroll past last image → pull drawer up ── */
  const imgTouchStartY = useRef(0);

  const isImagesAtBottom = useCallback(() => {
    const el = imagesRef.current;
    if (!el) return true;
    return el.scrollHeight <= el.clientHeight ||
      el.scrollTop + el.clientHeight >= el.scrollHeight - 4;
  }, []);

  const handleContainerWheel = useCallback(
    (e: React.WheelEvent) => {
      if (isExpanded) return;
      const atBottom = isImagesAtBottom();
      if (e.deltaY > 0 && atBottom) {
        snapTo(0);
      }
    },
    [isExpanded, snapTo, isImagesAtBottom],
  );

  const handleContainerTouchStart = useCallback((e: React.TouchEvent) => {
    imgTouchStartY.current = e.touches[0].clientY;
  }, []);

  const handleContainerTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      if (isExpanded) return;
      const dy = imgTouchStartY.current - e.changedTouches[0].clientY;
      const atBottom = isImagesAtBottom();
      if (dy > SWIPE_THRESHOLD && atBottom) {
        snapTo(0);
      }
    },
    [isExpanded, snapTo, isImagesAtBottom],
  );

  const handleImagesScroll = useCallback(() => {
    // Scroll handler for sheet magnet logic — no-op, magnet triggered by wheel/touch
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative flex h-full flex-col overflow-hidden bg-black"
      style={{ paddingTop: "var(--chrome-offset)" }}
      onWheel={handleContainerWheel}
      onTouchStart={handleContainerTouchStart}
      onTouchEnd={handleContainerTouchEnd}
    >
      {/* ── Floating glass navigation ── */}
      <div
        className="pointer-events-none absolute left-4 right-4 z-30 flex items-start justify-between"
        style={{ top: "calc(var(--chrome-offset) + 12px)" }}
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
            className="flex h-10 w-10 items-center justify-center outline-none active:opacity-90"
            aria-label={isFav ? "Remove from favorites" : "Add to favorites"}
          >
            <Star
              className="h-5 w-5"
              strokeWidth={1.8}
              stroke="var(--color-cl-text)"
              fill={isFav ? "var(--color-cl-favorite)" : "transparent"}
            />
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

      {/* ── Images — scroll behind the sheet ── */}
      <div
        ref={imagesRef}
        className="relative flex-1 overflow-y-auto overscroll-contain scrollbar-none"
        onScroll={handleImagesScroll}
        style={{
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
              setViewerIndex(i);
              setViewerOpen(true);
            }}
          >
            <img
              src={src}
              alt={`${variant.title} ${i + 1}`}
              className="block w-full h-auto"
              loading={i === 0 ? "eager" : "lazy"}
              draggable={false}
            />
            {i === 0 && images.length > 1 && (
              <span className="absolute bottom-3 right-3 rounded-[0] bg-black/60 px-2.5 py-1 text-[11px] font-medium text-white">
                1 / {images.length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Progressive scrim over images as sheet rises */}
      <motion.div
        className="absolute inset-0 z-10 bg-black"
        style={{ opacity: imageOverlayOpacity, pointerEvents: "none" }}
      />

      {/* ── Bottom sheet (swipe-to-snap, no drag-following) ── */}
      <motion.div
        className="absolute inset-x-0 top-0 z-20 flex flex-col bg-cl-surface shadow-[var(--shadow-sheet)]"
        style={{ y: sheetY, bottom: CTA_H, visibility: ready ? "visible" : "hidden" }}
      >
        {/* Header — swipe / scroll / click target (handle + title + price) */}
        <div
          className="shrink-0 select-none"
          style={{ cursor: "grab", touchAction: "none" }}
          onTouchStart={handleHeaderTouchStart}
          onTouchEnd={handleHeaderTouchEnd}
          onMouseDown={handleHeaderMouseDown}
          onMouseUp={handleHeaderMouseUp}
          onWheel={handleHeaderWheel}
        >
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
            <p className="text-[19px] font-bold leading-snug text-cl-text">
              {variant.title}
            </p>
            <p className="mt-0.5 text-[16px] font-bold text-cl-price">
              {variant.price}
            </p>
          </div>
        </div>

        {/* Content — scrollable so user can reach map, attributes, etc. */}
        <div
          className="min-h-0 flex-1 overflow-y-auto overscroll-contain scrollbar-none"
          style={{ touchAction: "pan-y" }}
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
          <div className="mt-4 px-4 pb-36">
            <div className="mb-2 flex items-center justify-between">
              <p className="text-[13px] font-medium text-cl-text">
                {variant.hood}
              </p>
              <button
                type="button"
                className="flex items-center gap-1 outline-none active:opacity-70"
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
      <div className="absolute inset-x-0 bottom-0 z-30 border-t-[0.5px] border-cl-border bg-cl-surface px-4 pt-3 pb-[34px]">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") handleSend(); }}
            placeholder={defaultMessage}
            className="h-11 min-w-0 flex-1 rounded-[--radius-button] border-2 border-cl-border bg-cl-surface px-3 text-base text-cl-text outline-none placeholder:text-cl-text-muted focus:border-cl-accent transition-colors"
          />
          <button
            type="button"
            onClick={handleSend}
            className="flex h-11 shrink-0 items-center justify-center rounded-[--radius-button] bg-cl-accent px-4 outline-none active:opacity-90"
            aria-label="Send message"
          >
            <span className="text-[14px] font-semibold text-cl-accent-text">send</span>
          </button>
        </div>
        <div className="mt-2 flex gap-2">
          <button
            type="button"
            className="flex min-h-[40px] flex-1 items-center justify-center gap-1.5 rounded-[--radius-button] border border-cl-border bg-cl-surface outline-none active:opacity-90"
          >
            <Phone className="h-4 w-4 text-cl-text-muted" strokeWidth={2} />
            <span className="text-[13px] font-medium text-cl-text">call</span>
          </button>
          <button
            type="button"
            className="flex min-h-[40px] flex-1 items-center justify-center gap-1.5 rounded-[--radius-button] border border-cl-border bg-cl-surface outline-none active:opacity-90"
          >
            <Mail className="h-4 w-4 text-cl-text-muted" strokeWidth={2} />
            <span className="text-[13px] font-medium text-cl-text">email</span>
          </button>
        </div>
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
