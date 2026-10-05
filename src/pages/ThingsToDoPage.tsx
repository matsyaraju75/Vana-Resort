/**
 * @file ThingsToDoPage.tsx
 * @description Curated tourism activities, cultural traditions, and outdoor adventures in Araku Valley.
 */

import React from 'react';
import { Clock, Sun, CheckCircle2, Coffee, Train, Music, UtensilsCrossed, ShoppingBag, Sparkles } from 'lucide-react';
import { THINGS_TO_DO } from '../data/travelGuide';
import { SectionTitle } from '../components/common/SectionTitle';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';

const renderActivityIcon = (name: string) => {
  switch (name) {
    case 'Coffee':
      return <Coffee className="w-5 h-5 text-amber-700" />;
    case 'Train':
      return <Train className="w-5 h-5 text-blue-600" />;
    case 'Music':
      return <Music className="w-5 h-5 text-rose-600" />;
    case 'UtensilsCrossed':
      return <UtensilsCrossed className="w-5 h-5 text-orange-600" />;
    case 'Sun':
      return <Sun className="w-5 h-5 text-amber-500" />;
    case 'ShoppingBag':
      return <ShoppingBag className="w-5 h-5 text-emerald-600" />;
    default:
      return <Sparkles className="w-5 h-5 text-vana-600" />;
  }
};

export const ThingsToDoPage: React.FC = () => {
  return (
    <div className="pt-32 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      {/* Header */}
      <SectionTitle
        tag="Valley Experiences"
        title="Things to Do in Araku"
        subtitle="Immerse yourself in plantation walks, authentic tribal cuisine, mountain treks, and cultural traditions."
      />

      {/* Activities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {THINGS_TO_DO.map((act) => (
          <div
            key={act.id}
            className="bg-white rounded-3xl border border-sand-border shadow-soft hover:shadow-elevated transition-all duration-300 overflow-hidden flex flex-col justify-between group h-full"
          >
            <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
              <img
                src={act.image}
                alt={act.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
              <span className="absolute top-3.5 left-3.5 bg-white/90 backdrop-blur-md text-vana-900 text-[10px] uppercase font-bold tracking-widest px-3 py-1 rounded-full shadow-sm">
                {act.category}
              </span>
            </div>

            <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-sand-100 border border-sand-200 flex items-center justify-center shrink-0">
                    {renderActivityIcon(act.iconName)}
                  </div>
                  <h3 className="font-serif text-lg font-bold text-slate-900 leading-snug">
                    {act.title}
                  </h3>
                </div>

                <div className="flex items-center gap-3 text-xs text-slate-600 bg-sand-50 p-2.5 rounded-xl border border-sand-border/70">
                  <span className="flex items-center gap-1 font-medium">
                    <Clock className="w-3.5 h-3.5 text-amber-600" />
                    {act.duration}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Sun className="w-3.5 h-3.5 text-amber-500" />
                    {act.bestTime}
                  </span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {act.description}
                </p>

                <div className="space-y-1.5 pt-1">
                  {act.highlights.map((h, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-[11px] text-slate-700">
                      <CheckCircle2 className="w-3.5 h-3.5 text-vana-600 shrink-0" />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Explore More CTA */}
      <div className="bg-sand-100/80 border border-sand-border rounded-3xl p-8 sm:p-10 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-1.5 text-center sm:text-left">
          <h4 className="font-serif text-2xl font-bold text-slate-900">
            Want to see nearby points of interest?
          </h4>
          <p className="text-xs sm:text-sm text-slate-600">
            Check our 11 verified nearby attractions with entry tickets, distances, and optimal visiting hours.
          </p>
        </div>
        <Link to="/nearby-attractions">
          <Button size="md" variant="primary">
            View Nearby Attractions
          </Button>
        </Link>
      </div>
    </div>
  );
};
