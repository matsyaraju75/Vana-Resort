/**
 * @file Lightbox.tsx
 * @description Accessible fullscreen image lightbox with keyboard (Esc, Arrow keys) and touch navigation.
 */

import React, { useEffect } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface LightboxProps {
  isOpen: boolean;
  onClose: () => void;
  images: { src: string; alt?: string; title?: string }[];
  currentIndex: number;
  onNavigate: (index: number) => void;
}

export const Lightbox: React.FC<LightboxProps> = ({
  isOpen,
  onClose,
  images,
  currentIndex,
  onNavigate,
}) => {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') onNavigate((currentIndex + 1) % images.length);
      if (e.key === 'ArrowLeft') onNavigate((currentIndex - 1 + images.length) % images.length);
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, currentIndex, images.length, onClose, onNavigate]);

  if (!isOpen || images.length === 0) return null;

  const currentImage = images[currentIndex];

  return (
    <div
      className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4 sm:p-8 animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-label="Image gallery lightbox"
    >
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-5 right-5 z-20 p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
        aria-label="Close lightbox"
      >
        <X className="w-6 h-6" />
      </button>

      {/* Counter */}
      <div className="absolute top-5 left-5 z-20 text-xs font-semibold text-white/80 bg-white/10 px-3 py-1.5 rounded-full">
        {currentIndex + 1} / {images.length}
      </div>

      {/* Prev Navigation */}
      {images.length > 1 && (
        <button
          onClick={() => onNavigate((currentIndex - 1 + images.length) % images.length)}
          className="absolute left-4 z-20 p-3 rounded-full bg-white/10 hover:bg-white/25 text-white transition-all transform hover:scale-110"
          aria-label="Previous image"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
      )}

      {/* Main Image */}
      <div className="max-w-5xl max-h-[82vh] flex flex-col items-center justify-center">
        <img
          src={currentImage.src}
          alt={currentImage.alt || 'Resort photo'}
          className="max-w-full max-h-[75vh] object-contain rounded-lg shadow-2xl transition-transform duration-200"
        />
        {currentImage.title && (
          <p className="mt-3 text-center text-sm font-medium text-white/90">
            {currentImage.title}
          </p>
        )}
      </div>

      {/* Next Navigation */}
      {images.length > 1 && (
        <button
          onClick={() => onNavigate((currentIndex + 1) % images.length)}
          className="absolute right-4 z-20 p-3 rounded-full bg-white/10 hover:bg-white/25 text-white transition-all transform hover:scale-110"
          aria-label="Next image"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      )}
    </div>
  );
};
