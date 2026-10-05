/**
 * @file Testimonials.tsx
 * @description Guest ratings and clearly labeled sample feedback cards.
 */

import React from 'react';
import { Star, Info } from 'lucide-react';
import { RESORT_INFO } from '../../data/resortInfo';
import { SectionTitle } from '../common/SectionTitle';

const SAMPLE_REVIEWS = [
  {
    author: 'Family Traveler (Demo)',
    stay: 'Stayed in AC Deluxe Room',
    text: 'Good quiet location near Padmapuram road. The kids enjoyed the swimming pool and the morning mountain air was very refreshing.',
  },
  {
    author: 'Couples Getaway (Demo)',
    stay: 'Stayed in Junior Suite',
    text: 'The in-suite heater was very helpful during the cold Araku evening. Friendly front desk staff and hassle-free car parking.',
  },
  {
    author: 'Weekend Explorer (Demo)',
    stay: 'Stayed in Standard Non AC',
    text: 'Affordable and clean option for sightseeing around Chaparai and Padmapuram gardens. Peaceful night sleep.',
  },
];

export const Testimonials: React.FC = () => {
  return (
    <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <SectionTitle
        tag="Guest Feedback"
        title="Guest Ratings & Experiences"
        subtitle="Transparent traveler impressions based on verified reference listing data."
      />

      {/* Verified Rating Score Card */}
      <div className="max-w-xl mx-auto mb-12 p-8 glass-card rounded-3xl text-center">
        <div className="flex items-center justify-center gap-1 text-amber-500 mb-2">
          {[...Array(3)].map((_, i) => (
            <Star key={i} className="w-5 h-5 fill-current" />
          ))}
          <Star className="w-5 h-5 fill-amber-500/40 text-amber-500" />
          <Star className="w-5 h-5 text-slate-300" />
        </div>
        <div className="font-serif text-3xl font-extrabold text-slate-900">
          {RESORT_INFO.rating.score} / {RESORT_INFO.rating.scale}
        </div>
        <p className="text-xs text-slate-500 mt-1">
          Based on {RESORT_INFO.rating.count} ratings across {RESORT_INFO.rating.photosCount} traveler photographs
        </p>

        <div className="mt-4 pt-4 border-t border-sand-border/80 flex items-center justify-center gap-1.5 text-[11px] text-timber-700">
          <Info className="w-3.5 h-3.5" />
          <span>Note: Below sample guest reviews are illustrative demo cards for layout preview.</span>
        </div>
      </div>

      {/* Illustrative Demo Reviews */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {SAMPLE_REVIEWS.map((rev) => (
          <div
            key={rev.author}
            className="glass-card glass-card-hover p-6 rounded-3xl flex flex-col justify-between space-y-4 h-full"
          >
            <p className="text-xs sm:text-sm text-slate-700 italic leading-relaxed">
              "{rev.text}"
            </p>
            <div className="pt-3 border-t border-sand-border/70 text-xs">
              <strong className="block text-slate-900">{rev.author}</strong>
              <span className="text-slate-500">{rev.stay}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
