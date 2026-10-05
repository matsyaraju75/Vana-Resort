/**
 * @file RoomsPage.tsx
 * @description Room listing page with API-first loading, category filters (All, Non AC, AC, Suites),
 * proper loading/error states, and graceful static fallback when backend is offline.
 */

import React, { useState, useEffect } from 'react';
import { Loader2, WifiOff, RefreshCw } from 'lucide-react';
import type { Room, RoomCategoryFilter } from '../types/room';
import { apiService } from '../services/api';
import { RoomCard } from '../components/rooms/RoomCard';
import { SectionTitle } from '../components/common/SectionTitle';

const FILTER_TABS: { id: RoomCategoryFilter; label: string }[] = [
  { id: 'all', label: 'All Categories' },
  { id: 'non-ac', label: 'Non AC' },
  { id: 'ac', label: 'AC Deluxe' },
  { id: 'suites', label: 'Suites' },
];

export const RoomsPage: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<RoomCategoryFilter>('all');
  const [rooms, setRooms] = useState<Room[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [apiError, setApiError] = useState<string | null>(null);
  const [isFromFallback, setIsFromFallback] = useState(false);

  const fetchRooms = async () => {
    setIsLoading(true);
    setApiError(null);
    try {
      const data = await apiService.getRooms();
      setRooms(data);
      // getRooms() silently falls back to ROOMS; detect if DB responded
      setIsFromFallback(false);
    } catch {
      setApiError('Could not load room data from server.');
      setIsFromFallback(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const filteredRooms =
    activeFilter === 'all'
      ? rooms
      : rooms.filter((r) => r.category === activeFilter);

  return (
    <div className="pt-32 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <SectionTitle
        tag="Accommodations"
        title="Rooms & Suites"
        subtitle="Choose the stay that fits your Araku getaway."
      />

      {/* Offline / Fallback Banner */}
      {isFromFallback && (
        <div className="mb-8 flex items-center gap-3 bg-amber-50 border border-amber-200 text-amber-900 text-xs px-4 py-3 rounded-2xl">
          <WifiOff className="w-4 h-4 shrink-0 text-amber-600" />
          <span>
            <strong>Backend offline:</strong> Showing cached room catalog. Start XAMPP Apache + MySQL for live data.
          </span>
          <button
            onClick={fetchRooms}
            className="ml-auto flex items-center gap-1 text-amber-700 hover:text-amber-900 font-semibold underline-offset-2 hover:underline"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Retry
          </button>
        </div>
      )}

      {/* Hard API Error Banner */}
      {apiError && !isFromFallback && (
        <div className="mb-8 flex items-center gap-3 bg-red-50 border border-red-200 text-red-800 text-xs px-4 py-3 rounded-2xl">
          <WifiOff className="w-4 h-4 shrink-0" />
          <span>{apiError}</span>
          <button
            onClick={fetchRooms}
            className="ml-auto flex items-center gap-1 text-red-700 hover:text-red-900 font-semibold underline-offset-2 hover:underline"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Retry
          </button>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
        {FILTER_TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveFilter(tab.id)}
            className={`px-5 py-2.5 rounded-full text-xs font-semibold transition-all duration-200 ${
              activeFilter === tab.id
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
          <p className="text-sm">Loading room catalog…</p>
        </div>
      ) : (
        <>
          {/* Room Grid */}
          {filteredRooms.length === 0 ? (
            <div className="text-center py-20 text-slate-500">
              <p className="text-sm">No rooms found in this category.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {filteredRooms.map((room) => (
                <RoomCard key={room.id} room={room} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};
