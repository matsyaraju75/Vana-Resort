/**
 * @file GalleryPage.tsx
 * @description Photo gallery with API-first loading, category filters, proper loading/error states,
 * graceful static fallback when backend is offline, and full-screen keyboard/touch lightbox.
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Maximize2, Loader2, WifiOff, RefreshCw } from 'lucide-react';
import type { GalleryCategory } from '../data/gallery';
import { GALLERY_ITEMS, GALLERY_CATEGORIES } from '../data/gallery';
import type { GalleryImage } from '../data/gallery';
import { apiService } from '../services/api';
import { SectionTitle } from '../components/common/SectionTitle';
import { Lightbox } from '../components/common/Lightbox';
import { RESORT_INFO } from '../data/resortInfo';
import { InstagramIcon } from '../components/common/InstagramIcon';

export const GalleryPage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<GalleryCategory>('all');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [galleryItems, setGalleryItems] = useState<GalleryImage[]>(GALLERY_ITEMS);
  const [isLoading, setIsLoading] = useState(true);
  const [isFromFallback, setIsFromFallback] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const fetchGallery = useCallback(async () => {
    setIsLoading(true);
    setApiError(null);
    try {
      const data = await apiService.getGallery();
      if (Array.isArray(data) && data.length > 0) {
        setGalleryItems(data as GalleryImage[]);
        setIsFromFallback(false);
      } else {
        // API returned empty — use static catalog
        setGalleryItems(GALLERY_ITEMS);
        setIsFromFallback(true);
      }
    } catch {
      setGalleryItems(GALLERY_ITEMS);
      setIsFromFallback(true);
      setApiError('Gallery server unavailable. Showing curated photo collection.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGallery();
  }, [fetchGallery]);

  const filteredItems =
    activeCategory === 'all'
      ? galleryItems
      : activeCategory === 'screenshots'
      ? galleryItems.filter((item) => item.id.startsWith('g-shot-') || item.category === 'screenshots')
      : galleryItems.filter((item) => item.category === activeCategory);

  const lightboxList = filteredItems.map((item) => ({
    src: item.src,
    title: item.title,
    alt: item.alt,
  }));

  return (
    <div className="pt-32 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <SectionTitle
        tag="Visual Journey"
        title="Resort Photo Gallery"
        subtitle="Explore our peaceful property grounds, guest accommodations, outdoor pool, and scenic Araku nature."
      />

      {/* Offline Banner */}
      {isFromFallback && (
        <div className="mb-8 flex items-center gap-3 bg-amber-50 border border-amber-200 text-amber-900 text-xs px-4 py-3 rounded-2xl">
          <WifiOff className="w-4 h-4 shrink-0 text-amber-600" />
          <span>
            <strong>Offline mode:</strong> {apiError || 'Showing curated photo catalog.'}
          </span>
          <button
            onClick={fetchGallery}
            className="ml-auto flex items-center gap-1 text-amber-700 hover:text-amber-900 font-semibold underline-offset-2 hover:underline"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Retry
          </button>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
        {GALLERY_CATEGORIES.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveCategory(tab.id)}
            className={`px-4 py-2 rounded-full text-xs font-semibold transition-all duration-200 ${
              activeCategory === tab.id
                ? 'bg-vana-600 text-white shadow-soft'
                : 'bg-white text-slate-700 border border-sand-border hover:bg-sand-surface'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Loading State */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4 text-slate-500">
          <Loader2 className="w-10 h-10 animate-spin text-vana-600" />
          <p className="text-sm">Loading gallery…</p>
        </div>
      ) : (
        <>
          {/* Grid */}
          {filteredItems.length === 0 ? (
            <div className="text-center py-20 text-slate-500">
              <p className="text-sm">No photos found in this category.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.map((item, index) => (
                <div
                  key={item.id}
                  onClick={() => setLightboxIndex(index)}
                  className="group relative rounded-2xl overflow-hidden bg-sand-200 border border-sand-border aspect-[4/3] cursor-pointer shadow-soft hover:shadow-card transition-all"
                >
                  <img
                    src={item.src}
                    alt={item.alt}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-5 text-white">
                    <span className="text-xs uppercase font-bold tracking-widest text-sand-300">
                      {item.category}
                    </span>
                    <h4 className="font-serif text-lg font-bold">{item.title}</h4>
                    <div className="absolute top-4 right-4 bg-white/20 p-2 rounded-full backdrop-blur-sm">
                      <Maximize2 className="w-4 h-4 text-white" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Instagram Community Banner */}
      <div className="mt-16 glass-card p-8 rounded-3xl border border-sand-border flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
        <div className="space-y-1">
          <div className="flex items-center justify-center sm:justify-start gap-2">
            <InstagramIcon className="w-5 h-5 text-rose-500" />
            <span className="text-xs uppercase font-bold tracking-widest text-slate-500">Live Moments</span>
          </div>
          <h3 className="font-serif text-2xl font-bold text-slate-900">Araku Valley Stories & Guest Memories</h3>
          <p className="text-xs text-slate-600 max-w-lg">
            Tag us in your photos or browse daily serene sunrise shots, misty valleys, and resort highlights.
          </p>
        </div>
        <a
          href={RESORT_INFO.contact.instagram.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2.5 bg-gradient-to-r from-amber-500 via-rose-500 to-purple-600 text-white font-bold text-sm px-6 py-3 rounded-2xl shadow-soft hover:shadow-card hover:opacity-95 transition-all flex-shrink-0"
        >
          <InstagramIcon className="w-5 h-5" />
          <span>Follow {RESORT_INFO.contact.instagram.displayHandle}</span>
        </a>
      </div>

      {/* Fullscreen Lightbox Modal */}
      <Lightbox
        isOpen={lightboxIndex !== null}
        onClose={() => setLightboxIndex(null)}
        images={lightboxList}
        currentIndex={lightboxIndex || 0}
        onNavigate={(idx) => setLightboxIndex(idx)}
      />
    </div>
  );
};
