/**
 * @file Hero.tsx
 * @description Cinematic resort homepage hero with dark readability overlay and floating availability bar.
 */

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Calendar, Users, Home, ArrowRight, Star } from 'lucide-react';
import { RESORT_IMAGES } from '../../data/images';
import { RESORT_INFO } from '../../data/resortInfo';
import { Button } from '../ui/Button';

export const Hero: React.FC = () => {
  const navigate = useNavigate();

  const today = new Date();
  const defaultIn = new Date(today.setDate(today.getDate() + 1)).toISOString().split('T')[0];
  const defaultOut = new Date(today.setDate(today.getDate() + 2)).toISOString().split('T')[0];

  const [checkIn, setCheckIn] = useState(defaultIn);
  const [checkOut, setCheckOut] = useState(defaultOut);
  const [guests, setGuests] = useState('2');
  const [roomsCount, setRoomsCount] = useState('1');

  const handleCheckAvailability = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/booking?checkIn=${checkIn}&checkOut=${checkOut}&guests=${guests}&rooms=${roomsCount}`);
  };

  return (
    <section className="relative min-h-[90vh] flex flex-col justify-between pt-28 pb-16 px-4 sm:px-6 lg:px-8">
      {/* Background Image & Cinematic Overlays */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <img
          src={RESORT_IMAGES.hero}
          alt="Vana Resort Araku Valley hillside view"
          className="w-full h-full object-cover scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-black/60" />
      </div>

      {/* Main Text Content */}
      <div className="max-w-4xl mx-auto text-center my-auto space-y-6 text-white pt-8">
        <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/20 text-xs font-semibold uppercase tracking-wider">
          <span className="flex items-center gap-1 text-amber-300">
            <Star className="w-3.5 h-3.5 fill-current" />
            <span>{RESORT_INFO.rating.score} / {RESORT_INFO.rating.scale}</span>
          </span>
          <span className="text-white/60">•</span>
          <span>{RESORT_INFO.category} in Araku Valley</span>
        </div>

        <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.15]">
          Escape to the Serenity of Araku
        </h1>

        <p className="text-base sm:text-xl text-sand-100/90 max-w-2xl mx-auto font-light leading-relaxed">
          A peaceful mountain retreat surrounded by the natural beauty of Araku Valley.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <Link to="/rooms">
            <Button size="lg" variant="white">
              Explore Rooms
            </Button>
          </Link>
          <Link to="/booking">
            <Button size="lg" variant="primary" icon={<ArrowRight className="w-4 h-4" />}>
              Book Your Stay
            </Button>
          </Link>
        </div>
      </div>

      {/* Floating Availability Bar */}
      <div className="w-full max-w-5xl mx-auto mt-12">
        <form
          onSubmit={handleCheckAvailability}
          className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/70 p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-end"
        >
          <div>
            <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-timber-700 mb-1">
              <Calendar className="w-3.5 h-3.5 text-vana-600" />
              <span>Check-In</span>
            </label>
            <input
              type="date"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
              className="w-full bg-sand-50/70 border border-sand-border rounded-xl px-3 py-2 text-sm text-slate-800 focus:ring-2 focus:ring-vana-600 focus:outline-none"
            />
          </div>

          <div>
            <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-timber-700 mb-1">
              <Calendar className="w-3.5 h-3.5 text-vana-600" />
              <span>Check-Out</span>
            </label>
            <input
              type="date"
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
              className="w-full bg-sand-50/70 border border-sand-border rounded-xl px-3 py-2 text-sm text-slate-800 focus:ring-2 focus:ring-vana-600 focus:outline-none"
            />
          </div>

          <div>
            <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-timber-700 mb-1">
              <Users className="w-3.5 h-3.5 text-vana-600" />
              <span>Guests</span>
            </label>
            <select
              value={guests}
              onChange={(e) => setGuests(e.target.value)}
              className="w-full bg-sand-50/70 border border-sand-border rounded-xl px-3 py-2 text-sm text-slate-800 focus:ring-2 focus:ring-vana-600 focus:outline-none"
            >
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <option key={n} value={n}>
                  {n} {n === 1 ? 'Guest' : 'Guests'}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-timber-700 mb-1">
              <Home className="w-3.5 h-3.5 text-vana-600" />
              <span>Rooms</span>
            </label>
            <select
              value={roomsCount}
              onChange={(e) => setRoomsCount(e.target.value)}
              className="w-full bg-sand-50/70 border border-sand-border rounded-xl px-3 py-2 text-sm text-slate-800 focus:ring-2 focus:ring-vana-600 focus:outline-none"
            >
              {[1, 2, 3, 4].map((n) => (
                <option key={n} value={n}>
                  {n} {n === 1 ? 'Room' : 'Rooms'}
                </option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-2 lg:col-span-1">
            <Button type="submit" size="md" variant="primary" className="w-full h-[42px] justify-center">
              Check Availability
            </Button>
          </div>
        </form>
      </div>
    </section>
  );
};
