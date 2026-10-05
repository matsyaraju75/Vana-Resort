/**
 * @file RoomCard.tsx
 * @description Standardized room card displaying specs (sq.ft/sq.m, bed, guests, bath), amenities, and actions.
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { Users, Maximize2, Bed, Bath, ArrowRight } from 'lucide-react';
import type { Room } from '../../types/room';
import { formatINR } from '../../hooks/useBookingCalculator';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

interface RoomCardProps {
  room: Room;
}

export const RoomCard: React.FC<RoomCardProps> = ({ room }) => {
  const isSuite = room.category === 'suites';

  return (
    <div
      className={`group glass-card glass-card-hover rounded-3xl transition-all duration-300 flex flex-col overflow-hidden h-full ${
        isSuite ? 'ring-2 ring-amber-500/30' : ''
      }`}
    >
      {/* Photography & Badges */}
      <div className="relative aspect-[16/10] overflow-hidden bg-sand-100">
        <img
          src={room.image}
          alt={room.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute top-3 left-3 flex gap-2">
          <Badge variant={isSuite ? 'gold' : 'forest'}>{room.categoryLabel}</Badge>
          {room.featured && <Badge variant="sand">Featured</Badge>}
        </div>
      </div>

      {/* Card Content */}
      <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <h3 className="font-serif text-xl font-bold text-slate-900 group-hover:text-vana-700 transition-colors">
            {room.name}
          </h3>
          <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">{room.tagline}</p>

          {/* Specs Grid */}
          <div className="grid grid-cols-2 gap-2.5 my-4 pt-3 border-t border-sand-border text-xs text-slate-600">
            <div className="flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-vana-600" />
              <span>Up to {room.specs.maxGuests} Guests</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Maximize2 className="w-3.5 h-3.5 text-vana-600" />
              <span>{room.specs.sizeSqFt} sq.ft ({room.specs.sizeSqM} m²)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Bed className="w-3.5 h-3.5 text-vana-600" />
              <span>{room.specs.bed}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Bath className="w-3.5 h-3.5 text-vana-600" />
              <span>{room.specs.bathrooms} Bathroom</span>
            </div>
          </div>

          {/* Selected Feature Badges */}
          <div className="flex flex-wrap gap-1.5">
            {room.features.slice(0, 3).map((f) => (
              <span
                key={f}
                className="text-[11px] bg-sand-surface text-slate-700 px-2 py-0.5 rounded-md border border-sand-border"
              >
                {f}
              </span>
            ))}
          </div>
        </div>

        {/* Pricing Indicator & Action Buttons */}
        <div className="pt-4 border-t border-sand-border">
          <div className="flex items-baseline justify-between mb-3">
            <div>
              {room.samplePrice ? (
                <div className="flex items-baseline gap-1">
                  <span className="font-serif text-xl font-bold text-vana-900">
                    {formatINR(room.samplePrice)}
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium">/ night (Sample)</span>
                </div>
              ) : (
                <span className="text-xs font-semibold text-timber-700">{room.priceLabel}</span>
              )}
            </div>
            <span className="text-[10px] text-slate-400">Final price on request</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Link to={`/rooms/${room.slug}`}>
              <Button size="sm" variant="outline" className="w-full text-xs">
                View Details
              </Button>
            </Link>
            <Link to={`/booking?room=${room.slug}`}>
              <Button size="sm" variant="primary" className="w-full text-xs" icon={<ArrowRight className="w-3 h-3" />}>
                Book Now
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
