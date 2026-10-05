/**
 * @file RoomGallery.tsx
 * @description Interactive room image gallery with thumbnail strip, next/prev controls, and lightbox integration.
 */

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';
import { Lightbox } from '../common/Lightbox';

interface RoomGalleryProps {
  images: string[];
  roomName: string;
}

export const RoomGallery: React.FC<RoomGalleryProps> = ({ images, roomName }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const prevImage = () => {
    setActiveIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const nextImage = () => {
    setActiveIndex((prev) => (prev + 1) % images.length);
  };

  const lightboxItems = images.map((src, i) => ({
    src,
    title: `${roomName} — Photo ${i + 1}`,
    alt: `${roomName} photo ${i + 1}`,
  }));

  return (
    <div className="space-y-3">
      {/* Featured Large View */}
      <div className="relative aspect-[16/10] sm:aspect-[16/9] rounded-2xl overflow-hidden bg-sand-200 border border-sand-border group">
        <img
          src={images[activeIndex]}
          alt={`${roomName} view ${activeIndex + 1}`}
          className="w-full h-full object-cover transition-all duration-300 cursor-pointer"
          onClick={() => setIsLightboxOpen(true)}
        />

        {/* Action / Lightbox trigger */}
        <button
          onClick={() => setIsLightboxOpen(true)}
          className="absolute top-4 right-4 z-10 bg-black/50 hover:bg-black/75 text-white p-2.5 rounded-full backdrop-blur-sm transition-colors"
          aria-label="Enlarge image"
        >
          <Maximize2 className="w-4 h-4" />
        </button>

        {/* Prev / Next buttons */}
        {images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-3 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-white/80 hover:bg-white text-slate-800 shadow-md transition-all opacity-90 group-hover:opacity-100"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-3 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-white/80 hover:bg-white text-slate-800 shadow-md transition-all opacity-90 group-hover:opacity-100"
              aria-label="Next image"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2.5 overflow-x-auto pb-1">
          {images.map((img, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`relative flex-shrink-0 w-20 h-14 rounded-lg overflow-hidden border-2 transition-all ${
                activeIndex === index
                  ? 'border-vana-600 ring-2 ring-vana-600/30'
                  : 'border-sand-border opacity-70 hover:opacity-100'
              }`}
            >
              <img src={img} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}

      {/* Fullscreen Lightbox */}
      <Lightbox
        isOpen={isLightboxOpen}
        onClose={() => setIsLightboxOpen(false)}
        images={lightboxItems}
        currentIndex={activeIndex}
        onNavigate={(idx) => setActiveIndex(idx)}
      />
    </div>
  );
};
