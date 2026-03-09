import { useState, useCallback, useEffect } from "react";
import { Smartphone } from "lucide-react";

interface ScreenshotPlaceholderProps {
  label: string;
  /** Single image path or array of paths (click to cycle). */
  image?: string | string[];
}

export function ScreenshotPlaceholder({ label, image }: ScreenshotPlaceholderProps) {
  const images = image
    ? Array.isArray(image) ? image : [image]
    : [];
  const [index, setIndex] = useState(0);

  const imageKey = Array.isArray(image) ? image.join(",") : image;
  useEffect(() => setIndex(0), [imageKey]);

  const cycle = useCallback(() => {
    if (images.length > 1) {
      setIndex((i) => (i + 1) % images.length);
    }
  }, [images.length]);

  if (images.length > 0) {
    const src = images[index % images.length];
    return (
      <div
        className="absolute inset-0 overflow-hidden bg-[#FAFAFA]"
        onClick={cycle}
        style={images.length > 1 ? { cursor: "pointer" } : undefined}
      >
        <img
          src={src}
          alt={label}
          className="w-full"
        />
        <div className="absolute top-0 left-0 right-0 h-[44px] bg-[#FAFAFA]" />
      </div>
    );
  }

  return (
    <div className="flex h-full w-full items-center justify-center bg-gray-50">
      <div className="flex flex-col items-center gap-3 rounded-2xl border-2 border-dashed border-gray-300 px-8 py-12">
        <Smartphone className="h-8 w-8 text-gray-300" />
        <p className="text-center text-xs font-medium text-gray-400">
          {label}
        </p>
      </div>
    </div>
  );
}
