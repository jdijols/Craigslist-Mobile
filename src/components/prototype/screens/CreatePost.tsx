import { useState } from "react";
import { Camera, Check } from "lucide-react";
import { FullScreenDrawer } from "../components/FullScreenDrawer";
import type { ScreenId } from "../types";

const CATEGORIES = ["for sale", "housing", "jobs", "services", "community", "gigs"];

interface CreatePostProps {
  onNavigate?: (screen: ScreenId) => void;
  onDismiss?: () => void;
}

export function CreatePost({ onNavigate, onDismiss }: CreatePostProps) {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [published, setPublished] = useState(false);

  const handleClose = () => {
    if (onDismiss) onDismiss();
    else onNavigate?.("home");
  };

  const handlePublish = () => {
    setPublished(true);
    setTimeout(() => {
      handleClose();
    }, 1200);
  };

  return (
    <FullScreenDrawer
      title="new post"
      onClose={handleClose}
      bottomSlot={
        !published ? (
          <button
            type="button"
            onClick={handlePublish}
            disabled={!title.trim()}
            className="flex w-full min-h-[48px] items-center justify-center rounded-[--radius-button] bg-cl-accent shadow-[--shadow-card] outline-none active:opacity-90 disabled:opacity-50"
          >
            <span className="text-[17px] font-semibold text-cl-accent-text">
              publish
            </span>
          </button>
        ) : undefined
      }
    >
      {published ? (
        <div className="flex flex-1 flex-col items-center justify-center px-6">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <Check className="h-8 w-8 text-green-600" strokeWidth={1.5} aria-hidden />
          </div>
          <p className="mt-4 text-[17px] font-semibold text-cl-text">published!</p>
          <p className="mt-1 text-[12px] text-cl-text-muted text-center">
            your listing is now live on craigslist.
          </p>
        </div>
      ) : (
        <div className="h-full overflow-y-auto overscroll-contain scrollbar-none">
            {/* Photo picker */}
            <div className="mx-4 mt-4 rounded-[--radius-card] border-2 border-dashed border-cl-border bg-cl-surface p-6 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-[--radius-card-lg] bg-cl-accent/10">
                <Camera className="h-6 w-6 text-cl-accent" strokeWidth={1.8} aria-hidden />
              </div>
              <p className="mt-3 text-[15px] font-medium text-cl-text">
                add photos
              </p>
              <p className="mt-1 text-[11px] text-cl-text-muted">
                listings with photos get 4× more replies
              </p>
            </div>

            {/* Photo thumbnails */}
            <div className="mx-4 mt-3 flex gap-2">
              <div className="flex h-16 w-16 items-center justify-center rounded-[--radius-card] border border-dashed border-cl-border">
                <span className="text-lg text-cl-text-muted">+</span>
              </div>
            </div>

            {/* Form fields */}
            <div className="mx-4 mt-4 space-y-3">
              <div className="rounded-[--radius-card] border-2 border-cl-border bg-cl-surface px-4 py-3 min-h-[44px] focus-within:border-cl-accent transition-colors">
                <label className="text-[11px] text-cl-text-muted" htmlFor="cp-title">title</label>
                <input
                  id="cp-title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="mt-0.5 block w-full bg-transparent text-base text-cl-text outline-none placeholder:text-cl-text-muted"
                  placeholder="what are you posting?"
                />
              </div>
              <div className="flex gap-3">
                <div className="flex-1 rounded-[--radius-card] border-2 border-cl-border bg-cl-surface px-4 py-3 min-h-[44px] focus-within:border-cl-accent transition-colors">
                  <label className="text-[11px] text-cl-text-muted" htmlFor="cp-price">price</label>
                  <div className="mt-0.5 flex items-center">
                    <span className="text-[15px] text-cl-price">$</span>
                    <input
                      id="cp-price"
                      type="text"
                      inputMode="numeric"
                      value={price}
                      onChange={(e) => setPrice(e.target.value.replace(/[^0-9]/g, ""))}
                      className="w-full bg-transparent text-base text-cl-price outline-none placeholder:text-cl-text-muted"
                      placeholder="0"
                    />
                  </div>
                </div>
                <div className="flex-1 rounded-[--radius-card] border-2 border-cl-border bg-cl-surface px-4 py-3 min-h-[44px] focus-within:border-cl-accent transition-colors">
                  <label className="text-[11px] text-cl-text-muted" htmlFor="cp-category">category</label>
                  <select
                    id="cp-category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="mt-0.5 block w-full bg-transparent text-base text-cl-text outline-none appearance-none"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="rounded-[--radius-card] border-2 border-cl-border bg-cl-surface px-4 py-3 min-h-[44px] focus-within:border-cl-accent transition-colors">
                <span className="text-[11px] text-cl-text-muted">location</span>
                <p className="mt-0.5 text-[15px] text-cl-text-muted">
                  —
                </p>
              </div>
            </div>
          </div>
      )}
    </FullScreenDrawer>
  );
}
