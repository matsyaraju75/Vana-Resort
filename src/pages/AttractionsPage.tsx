/**
 * @file AttractionsPage.tsx
 * @description Comprehensive showcase for all 11 nearby Araku Valley destinations,
 * with exact distance from resort, recommended visiting hours, and entry pricing.
 */

import React, { useState } from 'react';
import {
  Navigation,
  Clock,
  Ticket,
  Search,
  ExternalLink,
  MapPin,
  Compass,
  CheckCircle2,
} from 'lucide-react';
import { ATTRACTIONS_LIST } from '../data/attractions';
import { SectionTitle } from '../components/common/SectionTitle';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';

export const AttractionsPage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = [
    { id: 'all', label: 'All 11 Attractions' },
    { id: 'viewpoint', label: 'Scenic Viewpoints' },
    { id: 'waterfall', label: 'Waterfalls' },
    { id: 'culture', label: 'Culture & Museums' },
    { id: 'nature', label: 'Nature & Gardens' },
    { id: 'heritage', label: 'Heritage & Wonders' },
  ];

  const filteredAttractions = ATTRACTIONS_LIST.filter((item) => {
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      item.name.toLowerCase().includes(q) ||
      item.description.toLowerCase().includes(q) ||
      item.categoryLabel.toLowerCase().includes(q);
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="pt-32 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      {/* Header */}
      <SectionTitle
        tag="Araku Valley Sightseeing"
        title="Nearby Attractions"
        subtitle="Explore the 11 iconic destinations around Vana Resort, with distances, visiting hours, and entry prices."
      />

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white p-4 rounded-3xl border border-sand-border shadow-soft">
        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveCategory(cat.id)}
              className={`whitespace-nowrap px-4 py-2 rounded-full text-xs font-semibold transition-all duration-200 shrink-0 ${
                activeCategory === cat.id
                  ? 'bg-vana-700 text-white shadow-sm'
                  : 'bg-sand-50 text-slate-700 border border-sand-border hover:bg-sand-100'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72 shrink-0">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search attractions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-sand-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-vana-500/20 focus:border-vana-600"
          />
        </div>
      </div>

      {/* Attractions Grid */}
      {filteredAttractions.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-slate-200">
          <Compass className="w-12 h-12 text-slate-400 mx-auto mb-3" />
          <h3 className="font-serif text-lg font-bold text-slate-800">No destinations match your search</h3>
          <p className="text-xs text-slate-500 mt-1">Try searching with a different term or select "All 11 Attractions".</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredAttractions.map((spot) => {
            const directionsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
              spot.googleQuery
            )}`;

            return (
              <div
                key={spot.id}
                className="bg-white rounded-3xl border border-sand-border shadow-soft hover:shadow-elevated transition-all duration-300 overflow-hidden flex flex-col justify-between group h-full"
              >
                {/* Photo & Category Tag */}
                <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                  <img
                    src={spot.image}
                    alt={spot.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />
                  <span className="absolute top-3.5 left-3.5 bg-white/90 backdrop-blur-md text-vana-900 text-[10px] uppercase font-bold tracking-widest px-3 py-1 rounded-full shadow-sm">
                    {spot.categoryLabel}
                  </span>
                  <div className="absolute bottom-3.5 left-3.5 right-3.5 flex items-center justify-between text-white">
                    <span className="font-serif text-xl font-bold tracking-tight drop-shadow-sm">
                      {spot.name}
                    </span>
                  </div>
                </div>

                {/* Content Details */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  {/* Distance, Hours & Entry Specs */}
                  <div className="space-y-2.5 bg-sand-50/80 p-3.5 rounded-2xl border border-sand-border/70 text-xs">
                    {/* Distance */}
                    <div className="flex items-center gap-2 text-vana-900 font-semibold">
                      <Navigation className="w-4 h-4 text-vana-600 shrink-0" />
                      <span>{spot.distance}</span>
                    </div>

                    {/* Time to Visit */}
                    <div className="flex items-center gap-2 text-slate-700">
                      <Clock className="w-4 h-4 text-amber-600 shrink-0" />
                      <span>{spot.timeToVisit}</span>
                    </div>

                    {/* Entry Price */}
                    <div className="flex items-center gap-2 text-slate-800 font-medium">
                      <Ticket className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span className="bg-emerald-100/70 text-emerald-900 px-2 py-0.5 rounded-md font-bold">
                        {spot.entryPrice}
                      </span>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {spot.description}
                  </p>

                  {/* Highlights Checklist */}
                  <div className="space-y-1.5 pt-1">
                    {spot.highlights.map((h, i) => (
                      <div key={i} className="flex items-center gap-2 text-[11px] text-slate-700">
                        <CheckCircle2 className="w-3.5 h-3.5 text-vana-600 shrink-0" />
                        <span>{h}</span>
                      </div>
                    ))}
                  </div>

                  {/* Travel Tips Box */}
                  <div className="p-3 bg-amber-50/70 border border-amber-200/70 rounded-xl text-[11px] text-amber-900 leading-normal">
                    <strong className="block text-amber-950 font-bold mb-0.5">Traveler Tip:</strong>
                    {spot.travelTips}
                  </div>

                  {/* Driving Directions Trigger */}
                  <div className="pt-2 border-t border-sand-border/70">
                    <a
                      href={directionsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-1.5 w-full py-2.5 px-4 rounded-xl bg-vana-50 hover:bg-vana-100 text-vana-800 text-xs font-bold transition-colors"
                    >
                      <MapPin className="w-3.5 h-3.5 text-vana-600" />
                      <span>Open Directions on Google Maps</span>
                      <ExternalLink className="w-3.5 h-3.5 ml-auto opacity-60" />
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Bottom Stay CTA */}
      <div className="bg-gradient-to-r from-vana-950 via-vana-900 to-timber-900 rounded-3xl p-8 sm:p-12 text-white shadow-xl flex flex-col lg:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center lg:text-left">
          <span className="text-xs uppercase font-bold tracking-widest text-sand-300">
            Comfortable Stay in Araku Valley
          </span>
          <h3 className="font-serif text-2xl sm:text-3xl font-bold text-sand-100">
            Return to Serenity After a Day of Sightseeing
          </h3>
          <p className="text-xs sm:text-sm text-sand-300 max-w-xl">
            Vana Resort is ideally situated along Padmapuram Road, placing you within easy driving distance to all 11 valley attractions.
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <Link to="/rooms">
            <Button size="lg" variant="secondary" className="bg-white text-vana-900 hover:bg-sand-100">
              Explore Rooms
            </Button>
          </Link>
          <Link to="/booking">
            <Button size="lg" variant="primary">
              Book Your Stay
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
