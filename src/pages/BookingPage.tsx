/**
 * @file BookingPage.tsx
 * @description Dedicated reservation inquiry page hosting the interactive booking form and stay guidelines.
 */

import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { Clock, ShieldCheck, Phone } from 'lucide-react';
import { RESORT_INFO } from '../data/resortInfo';
import { SectionTitle } from '../components/common/SectionTitle';
import { BookingForm } from '../components/booking/BookingForm';

export const BookingPage: React.FC = () => {
  const [searchParams] = useSearchParams();

  const initialRoom = searchParams.get('room') || undefined;
  const initialCheckIn = searchParams.get('checkIn') || undefined;
  const initialCheckOut = searchParams.get('checkOut') || undefined;
  const initialGuests = searchParams.get('guests') ? Number(searchParams.get('guests')) : 2;
  const initialRooms = searchParams.get('rooms') ? Number(searchParams.get('rooms')) : 1;

  return (
    <div className="pt-32 pb-24 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      <SectionTitle
        tag="Online Reservation"
        title="Book Your Stay at Vana Resort"
        subtitle="Submit your travel dates and preferred accommodation. Our front desk reviews requests and confirms availability directly."
      />

      {/* Booking Guidelines Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-5 bg-sand-surface rounded-2xl border border-sand-border text-xs text-slate-700">
        <div className="flex items-center gap-2.5">
          <Clock className="w-4 h-4 text-vana-600 flex-shrink-0" />
          <span>Check-in: <strong>{RESORT_INFO.checkIn}</strong> • Check-out: <strong>{RESORT_INFO.checkOut}</strong></span>
        </div>
        <div className="flex items-center gap-2.5">
          <ShieldCheck className="w-4 h-4 text-vana-600 flex-shrink-0" />
          <span>Transparent 3-Star verified property rates</span>
        </div>
        <div className="flex items-center gap-2.5">
          <Phone className="w-4 h-4 text-vana-600 flex-shrink-0" />
          <span>Direct Desk: <strong>{RESORT_INFO.contact.phone}</strong></span>
        </div>
      </div>

      {/* Main Booking Form */}
      <BookingForm
        initialRoomSlug={initialRoom}
        initialCheckIn={initialCheckIn}
        initialCheckOut={initialCheckOut}
        initialGuests={initialGuests}
        initialRoomsCount={initialRooms}
      />
    </div>
  );
};
