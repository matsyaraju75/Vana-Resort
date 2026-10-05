/**
 * @file useRoomFilter.ts
 * @description Hook managing room catalog filtering by category, guest capacity, and pricing.
 */

import { useState, useMemo } from 'react';
import type { Room, RoomCategory } from '../types/resort';

export type SortOrder = 'featured' | 'price-asc' | 'price-desc';

interface UseRoomFilterProps {
  rooms: Room[];
}

export function useRoomFilter({ rooms }: UseRoomFilterProps) {
  const [activeCategory, setActiveCategory] = useState<RoomCategory>('all');
  const [minGuests, setMinGuests] = useState<number>(1);
  const [sortBy, setSortBy] = useState<SortOrder>('featured');

  const filteredRooms = useMemo(() => {
    return rooms
      .filter((room) => {
        const matchesCategory = activeCategory === 'all' || room.category === activeCategory;
        const matchesGuests = room.specs.maxGuests >= minGuests;
        return matchesCategory && matchesGuests;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.pricePerNight - b.pricePerNight;
        if (sortBy === 'price-desc') return b.pricePerNight - a.pricePerNight;
        // Default featured: featured first, then original order
        return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
      });
  }, [rooms, activeCategory, minGuests, sortBy]);

  return {
    activeCategory,
    setActiveCategory,
    minGuests,
    setMinGuests,
    sortBy,
    setSortBy,
    filteredRooms,
    totalCount: filteredRooms.length,
  };
}
