/**
 * @file BookingWidget.tsx
 * @description Floating booking filter bar with date pickers, guest selection, and real-time tariff preview.
 */

import React from 'react';
import { Calendar, Users, Home, ArrowRight } from 'lucide-react';
import type { RoomCategory } from '../../types/resort';
import { useBookingCalculator, formatINR } from '../../hooks/useBookingCalculator';
import { Button } from '../ui/Button';

interface BookingWidgetProps {
  checkIn: string;
  setCheckIn: (val: string) => void;
  checkOut: string;
  setCheckOut: (val: string) => void;
  guests: number;
  setGuests: (val: number) => void;
  roomType: RoomCategory;
  setRoomType: (val: RoomCategory) => void;
  baseRate: number;
  onProceedBooking: () => void;
}

export const BookingWidget: React.FC<BookingWidgetProps> = ({
  checkIn,
  setCheckIn,
  checkOut,
  setCheckOut,
  guests,
  setGuests,
  roomType,
  setRoomType,
  baseRate,
  onProceedBooking,
}) => {
  const calculation = useBookingCalculator({
    checkIn,
    checkOut,
    baseRatePerNight: baseRate,
    guests,
  });

  return (
    <div id="booking-widget" className="relative z-30 -mt-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-elevated border border-sand-border p-5 lg:p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
          {/* Check-In */}
          <div>
            <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-timber-700 mb-1.5">
              <Calendar className="w-3.5 h-3.5 text-vana-600" />
              <span>Check-In Date</span>
            </label>
            <input
              type="date"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
              className="w-full bg-sand-50/50 border border-sand-border rounded-xl px-3 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-vana-500"
            />
          </div>

          {/* Check-Out */}
          <div>
            <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-timber-700 mb-1.5">
              <Calendar className="w-3.5 h-3.5 text-vana-600" />
              <span>Check-Out Date</span>
            </label>
            <input
              type="date"
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
              className="w-full bg-sand-50/50 border border-sand-border rounded-xl px-3 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-vana-500"
            />
          </div>

          {/* Guests */}
          <div>
            <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-timber-700 mb-1.5">
              <Users className="w-3.5 h-3.5 text-vana-600" />
              <span>Guests Count</span>
            </label>
            <select
              value={guests}
              onChange={(e) => setGuests(Number(e.target.value))}
              className="w-full bg-sand-50/50 border border-sand-border rounded-xl px-3 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-vana-500"
            >
              {[1, 2, 3, 4, 5, 6].map((num) => (
                <option key={num} value={num}>
                  {num} {num === 1 ? 'Guest' : 'Guests'}
                </option>
              ))}
            </select>
          </div>

          {/* Room Type */}
          <div>
            <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-timber-700 mb-1.5">
              <Home className="w-3.5 h-3.5 text-vana-600" />
              <span>Sanctuary Type</span>
            </label>
            <select
              value={roomType}
              onChange={(e) => setRoomType(e.target.value as RoomCategory)}
              className="w-full bg-sand-50/50 border border-sand-border rounded-xl px-3 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-vana-500"
            >
              <option value="all">All Sanctuaries</option>
              <option value="villa">Villas</option>
              <option value="cottage">Cottages</option>
              <option value="suite">Cloud Suites</option>
              <option value="chalet">Family Chalets</option>
            </select>
          </div>

          {/* Price Estimate & CTA */}
          <div className="flex flex-col justify-end">
            <div className="flex items-baseline justify-between mb-1">
              <span className="text-xs text-slate-500 font-medium">
                {calculation.nights} {calculation.nights === 1 ? 'Night' : 'Nights'} (inc. GST)
              </span>
              <span className="text-base font-bold text-vana-800">
                {formatINR(calculation.totalEstimated)}
              </span>
            </div>
            <Button
              variant="primary"
              size="md"
              className="w-full"
              onClick={onProceedBooking}
              icon={<ArrowRight className="w-4 h-4" />}
            >
              Reserve Dates
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
