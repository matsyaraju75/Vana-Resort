/**
 * @file NearbyAttractions.tsx
 * @description Local Araku guide section highlighting Ranajilleda Waterfalls, Borra Caves, and Padmapuram Gardens.
 */

import React from 'react';
import { Navigation, Clock, Compass } from 'lucide-react';
import { ATTRACTIONS_DATA } from '../../data/resortData';
import type { Attraction } from '../../types/resort';

export const NearbyAttractions: React.FC = () => {
  return (
    <section id="attractions" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
        <div>
          <span className="text-xs uppercase font-bold tracking-widest text-vana-700 bg-vana-100 px-3 py-1 rounded-full border border-vana-200">
            Explore Araku Valley
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-slate-900 mt-3">
            Top Attractions Around Vana
          </h2>
        </div>
        <p className="text-sm text-slate-600 max-w-md">
          Our travel concierge arranges sunrise safari jeeps, local tribal market guides, and pre-booked tickets for
          all major valley destinations.
        </p>
      </div>

      {/* Attractions Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {ATTRACTIONS_DATA.map((spot: Attraction) => (
          <div
            key={spot.id}
            className="bg-white rounded-2xl border border-sand-border p-5 shadow-soft hover:shadow-card transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-bold uppercase tracking-wider text-timber-700 bg-sand-surface px-2.5 py-0.5 rounded-full border border-sand-border">
                  {spot.tag}
                </span>
                <Compass className="w-4 h-4 text-vana-600" />
              </div>

              <h3 className="font-serif text-lg font-bold text-slate-900 mb-2">{spot.name}</h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">{spot.description}</p>
            </div>

            <div className="pt-3 border-t border-sand-border/80 space-y-1.5 text-xs text-slate-500">
              <div className="flex items-center gap-1.5 font-medium text-vana-800">
                <Navigation className="w-3.5 h-3.5 text-vana-600" />
                <span>{spot.distance} from resort</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-timber-500" />
                <span>{spot.travelTime}</span>
              </div>
              <div className="text-[11px] text-amber-700 font-medium bg-amber-50 rounded-md p-1.5 mt-2">
                Tip: {spot.highlight}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
