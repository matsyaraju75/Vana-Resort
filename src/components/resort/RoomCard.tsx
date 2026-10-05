/**
 * @file RoomCard.tsx
 * @description Card component displaying room photography, specs (sqft, bed, view), amenities, and booking trigger.
 */

import React from 'react';
import { Users, Maximize2, Mountain, Bed } from 'lucide-react';
import type { Room } from '../../types/resort';
import { formatINR } from '../../hooks/useBookingCalculator';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

interface RoomCardProps {
  room: Room;
  onSelect: (room: Room) => void;
}

export const RoomCard: React.FC<RoomCardProps> = ({ room, onSelect }) => {
  return (
    <div className="group bg-white rounded-2xl border border-sand-border shadow-card hover:shadow-elevated transition-all duration-300 flex flex-col overflow-hidden">
      {/* Photography & Badges */}
      <div className="relative aspect-[16/10] overflow-hidden bg-sand-100">
        <img
          src={room.image}
          alt={room.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute top-3 left-3 flex gap-2">
          {room.badge && <Badge variant="gold">{room.badge}</Badge>}
          <Badge variant="sand" className="capitalize">
            {room.category}
          </Badge>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <h3 className="font-serif text-xl font-bold text-slate-900 group-hover:text-vana-700 transition-colors">
            {room.title}
          </h3>
          <p className="text-xs text-timber-600 mt-1 line-clamp-2">{room.tagline}</p>

          {/* Specs Grid */}
          <div className="grid grid-cols-2 gap-2.5 my-4 pt-3 border-t border-sand-border text-xs text-slate-600">
            <div className="flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-vana-600" />
              <span>Up to {room.specs.maxGuests} Guests</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Maximize2 className="w-3.5 h-3.5 text-vana-600" />
              <span>{room.specs.sqft} sq.ft</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Bed className="w-3.5 h-3.5 text-vana-600" />
              <span>{room.specs.bedType}</span>
            </div>
            <div className="flex items-center gap-1.5 truncate">
              <Mountain className="w-3.5 h-3.5 text-vana-600 flex-shrink-0" />
              <span className="truncate">{room.specs.view}</span>
            </div>
          </div>

          {/* Amenities Badges */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {room.amenities.slice(0, 3).map((amenity) => (
              <span key={amenity} className="text-[11px] bg-sand-surface text-slate-600 px-2 py-0.5 rounded-md border border-sand-border/60">
                {amenity}
              </span>
            ))}
          </div>
        </div>

        {/* Pricing & CTA */}
        <div className="pt-4 border-t border-sand-border flex items-center justify-between">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="font-serif text-2xl font-bold text-vana-900">
                {formatINR(room.pricePerNight)}
              </span>
              {room.originalPricePerNight && (
                <span className="text-xs text-slate-400 line-through">
                  {formatINR(room.originalPricePerNight)}
                </span>
              )}
            </div>
            <span className="text-[11px] text-slate-500 font-medium block">per night + taxes</span>
          </div>

          <Button size="sm" variant="primary" onClick={() => onSelect(room)}>
            Book Now
          </Button>
        </div>
      </div>
    </div>
  );
};
