/**
 * @file RoomsShowcase.tsx
 * @description Catalog section displaying filterable room categories and inventory cards.
 */

import React from 'react';
import type { Room, RoomCategory } from '../../types/resort';
import { RoomCard } from './RoomCard';

interface RoomsShowcaseProps {
  rooms: Room[];
  activeCategory: RoomCategory;
  onSelectCategory: (cat: RoomCategory) => void;
  onBookRoom: (room: Room) => void;
}

const CATEGORIES: { id: RoomCategory; label: string }[] = [
  { id: 'all', label: 'All Sanctuaries' },
  { id: 'villa', label: 'Villas' },
  { id: 'cottage', label: 'Plantation Cottages' },
  { id: 'suite', label: 'Cloud Suites' },
  { id: 'chalet', label: 'Family Chalets' },
];

export const RoomsShowcase: React.FC<RoomsShowcaseProps> = ({
  rooms,
  activeCategory,
  onSelectCategory,
  onBookRoom,
}) => {
  const filtered =
    activeCategory === 'all'
      ? rooms
      : rooms.filter((r) => r.category === activeCategory);

  return (
    <section id="rooms" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Section Heading */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <span className="text-xs uppercase font-bold tracking-widest text-vana-700 bg-vana-100 px-3 py-1 rounded-full border border-vana-200">
          Handcrafted Stays
        </span>
        <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-slate-900 mt-3 mb-4">
          Hill Sanctuaries Crafted for Serenity
        </h2>
        <p className="text-sm sm:text-base text-slate-600">
          From secluded couples’ plunge villas to multi-room family timber chalets, every sanctuary is
          surrounded by Arabica coffee estates and raw Eastern Ghats wilderness.
        </p>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mt-8">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition-all duration-200 ${
                activeCategory === cat.id
                  ? 'bg-vana-600 text-white shadow-soft'
                  : 'bg-white text-slate-700 border border-sand-border hover:bg-sand-surface'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Room Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
          {filtered.map((room) => (
            <RoomCard key={room.id} room={room} onSelect={onBookRoom} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-2xl border border-sand-border">
          <p className="text-slate-500 text-sm">No sanctuaries found matching your selected category.</p>
          <button
            onClick={() => onSelectCategory('all')}
            className="mt-3 text-xs font-semibold text-vana-700 underline"
          >
            Reset Filters
          </button>
        </div>
      )}
    </section>
  );
};
