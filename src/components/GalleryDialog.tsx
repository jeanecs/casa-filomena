"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { ImageWithFallback } from "./figma/ImageWithFallback";

export function GalleryDialog({ villaId, open, onClose }: { villaId: number; open: boolean; onClose: () => void }) {
  const [images, setImages] = useState<string[]>([]);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!open) return;
    (async () => {
      try {
        const res = await fetch(`/admin/api/gallery/${villaId}`);
        const data = await res.json();
        const list: string[] = Array.isArray(data.images) ? data.images : [];
        setImages(list);
        setCurrent(0);
      } catch {}
    })();
  }, [open, villaId]);

  const hasImages = images.length > 0;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Villa Gallery</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {/* Large preview / carousel */}
          <div className="relative h-80 bg-gray-100 rounded">
            {hasImages ? (
              <ImageWithFallback src={images[current]} alt="gallery" className="w-full h-full object-cover rounded" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-500">No images yet</div>
            )}
            {hasImages && (
              <div className="absolute inset-x-0 bottom-2 flex justify-center gap-2">
                <Button size="sm" variant="outline" disabled={current === 0} onClick={() => setCurrent((c) => Math.max(0, c - 1))}>Prev</Button>
                <Button size="sm" variant="outline" disabled={current === images.length - 1} onClick={() => setCurrent((c) => Math.min(images.length - 1, c + 1))}>Next</Button>
              </div>
            )}
          </div>

          {/* Thumbnails grid */}
          {hasImages && (
            <div className="grid grid-cols-5 gap-2">
              {images.map((src, idx) => (
                <button key={src} onClick={() => setCurrent(idx)} className={`h-20 rounded overflow-hidden border ${idx === current ? 'border-yellow-800' : 'border-transparent'}`}>
                  <ImageWithFallback src={src} alt={`thumb-${idx}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
