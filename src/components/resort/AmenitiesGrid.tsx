/**
 * @file AmenitiesGrid.tsx
 * @description Showcase grid highlighting core resort amenities (Pool, Dining, Campfire, 24/7 Power).
 */

import React from 'react';
import { Waves, UtensilsCrossed, Flame, Zap, Coffee, Sparkles } from 'lucide-react';
import { AMENITIES_DATA } from '../../data/resortData';
import type { Amenity } from '../../types/resort';

const ICON_MAP: Record<string, React.ReactNode> = {
  Waves: <Waves className="w-6 h-6 text-vana-600" />,
  UtensilsCrossed: <UtensilsCrossed className="w-6 h-6 text-vana-600" />,
  Flame: <Flame className="w-6 h-6 text-amber-600" />,
  Zap: <Zap className="w-6 h-6 text-emerald-600" />,
  Coffee: <Coffee className="w-6 h-6 text-amber-800" />,
  Sparkles: <Sparkles className="w-6 h-6 text-vana-500" />,
};

export const AmenitiesGrid: React.FC = () => {
  return (
    <section id="amenities" className="py-20 bg-sand-surface border-y border-sand-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs uppercase font-bold tracking-widest text-vana-700 bg-vana-100 px-3 py-1 rounded-full border border-vana-200">
            Unrivaled Valley Comfort
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-slate-900 mt-3 mb-4">
            Curated Resort Amenities
          </h2>
          <p className="text-sm sm:text-base text-slate-600">
            Engineered for high-altitude luxury without compromise. Enjoy 24/7 backup, spring-fed infinity waters,
            and authentic regional delicacies.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {AMENITIES_DATA.map((item: Amenity) => (
            <div
              key={item.id}
              className="bg-white p-6 rounded-2xl border border-sand-border shadow-soft hover:shadow-card transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 bg-sand-surface rounded-xl border border-sand-border/80">
                    {ICON_MAP[item.icon] || <Sparkles className="w-6 h-6 text-vana-600" />}
                  </div>
                  {item.badge && (
                    <span className="text-[10px] uppercase font-bold text-vana-800 bg-vana-50 border border-vana-200 px-2.5 py-0.5 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </div>
                <h3 className="font-serif text-lg font-bold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
