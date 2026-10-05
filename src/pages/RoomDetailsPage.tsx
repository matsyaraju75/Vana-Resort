/**
 * @file RoomDetailsPage.tsx
 * @description Dynamic room details page with image gallery, specs breakdown, and booking trigger.
 */

import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { Users, Maximize2, Bed, Bath, ArrowLeft, ArrowRight, CheckCircle, Check } from 'lucide-react';
import { ROOMS } from '../data/rooms';
import { RoomGallery } from '../components/rooms/RoomGallery';
import { RoomCard } from '../components/rooms/RoomCard';
import { Button } from '../components/ui/Button';

export const RoomDetailsPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const room = ROOMS.find((r) => r.slug === slug);

  if (!room) {
    return <Navigate to="/rooms" replace />;
  }

  const relatedRooms = ROOMS.filter((r) => r.slug !== room.slug).slice(0, 2);

  return (
    <div className="pt-32 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
      {/* Back Link */}
      <div>
        <Link
          to="/rooms"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-timber-700 hover:text-vana-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Rooms</span>
        </Link>
      </div>

      {/* Main Grid: Gallery + Specs Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Gallery & Description */}
        <div className="lg:col-span-7 space-y-8">
          <RoomGallery images={room.gallery} roomName={room.name} />

          <div className="space-y-4">
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900">{room.name}</h2>
            <p className="text-sm text-slate-700 leading-relaxed">{room.description}</p>
          </div>

          {/* Room Amenities Categorized Display */}
          {room.amenitySections && room.amenitySections.length > 0 ? (
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-sand-border shadow-soft space-y-6">
              <h3 className="font-serif text-2xl font-bold text-slate-900 border-b border-sand-border pb-3">
                Room Amenities
              </h3>
              <div className="space-y-6">
                {room.amenitySections.map((section) => (
                  <div key={section.title} className="space-y-3">
                    <h4 className="text-sm font-bold text-slate-800 tracking-wide">
                      {section.title}
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-2.5 gap-x-4">
                      {section.items.map((item) => (
                        <div key={item} className="flex items-center gap-2 text-xs sm:text-sm text-slate-700">
                          <Check className="w-4 h-4 text-slate-700 stroke-[2.5] flex-shrink-0" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="p-6 bg-sand-surface rounded-2xl border border-sand-border space-y-3">
              <h3 className="font-serif text-lg font-bold text-slate-900">Room Highlights & Inclusions</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
                {room.features.map((feature) => (
                  <div key={feature} className="flex items-center gap-2 text-xs sm:text-sm text-slate-700">
                    <CheckCircle className="w-4 h-4 text-vana-600 flex-shrink-0" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Specs & Booking Card */}
        <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-2xl border border-sand-border shadow-elevated space-y-6 sticky top-28">
          <div>
            <span className="text-xs uppercase font-bold tracking-widest text-vana-700 bg-vana-100 px-3 py-1 rounded-full">
              {room.categoryLabel}
            </span>
            <h3 className="font-serif text-2xl font-bold text-slate-900 mt-3">{room.name}</h3>
            <p className="text-xs text-timber-600 mt-1">{room.tagline}</p>
          </div>

          {/* Key Specs Breakdown */}
          <div className="space-y-3 pt-4 border-t border-sand-border text-xs text-slate-700">
            <div className="flex items-center justify-between py-1.5 border-b border-sand-border/60">
              <span className="flex items-center gap-2 text-slate-500"><Maximize2 className="w-4 h-4 text-vana-600" /> Room Area</span>
              <strong className="text-slate-900">{room.specs.sizeSqFt} sq.ft ({room.specs.sizeSqM} sq.m)</strong>
            </div>
            <div className="flex items-center justify-between py-1.5 border-b border-sand-border/60">
              <span className="flex items-center gap-2 text-slate-500"><Users className="w-4 h-4 text-vana-600" /> Max Occupancy</span>
              <strong className="text-slate-900">Up to {room.specs.maxGuests} Guests</strong>
            </div>
            <div className="flex items-center justify-between py-1.5 border-b border-sand-border/60">
              <span className="flex items-center gap-2 text-slate-500"><Bed className="w-4 h-4 text-vana-600" /> Bedding</span>
              <strong className="text-slate-900">{room.specs.bed}</strong>
            </div>
            <div className="flex items-center justify-between py-1.5">
              <span className="flex items-center gap-2 text-slate-500"><Bath className="w-4 h-4 text-vana-600" /> Bathrooms</span>
              <strong className="text-slate-900">{room.specs.bathrooms} Private Bathroom</strong>
            </div>
          </div>

          {/* Booking Action */}
          <div className="pt-4 border-t border-sand-border space-y-3">
            <Link to={`/booking?room=${room.slug}`} className="block w-full">
              <Button size="lg" variant="primary" className="w-full" icon={<ArrowRight className="w-4 h-4" />}>
                Request Booking for this Room
              </Button>
            </Link>
            <p className="text-[11px] text-center text-slate-500">
              Instant submission • Front desk confirms availability & final tariff
            </p>
          </div>
        </div>
      </div>

      {/* Related Rooms */}
      <div className="pt-8 border-t border-sand-border">
        <h3 className="font-serif text-2xl font-bold text-slate-900 mb-6">Other Accommodations</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {relatedRooms.map((r) => (
            <RoomCard key={r.id} room={r} />
          ))}
        </div>
      </div>
    </div>
  );
};
