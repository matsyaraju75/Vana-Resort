/**
 * @file BookingForm.tsx
 * @description Validated booking request form with dynamic night count and tariff estimation.
 */

import React, { useState, useMemo } from 'react';
import { Calendar, Users, Home, CheckCircle2, MessageCircle, AlertCircle } from 'lucide-react';
import type { BookingRequestPayload, BookingRecord, BookingFormErrors } from '../../types/booking';
import { ROOMS } from '../../data/rooms';
import { RESORT_INFO } from '../../data/resortInfo';
import { apiService } from '../../services/api';
import { formatINR } from '../../hooks/useBookingCalculator';
import { Input, Textarea } from '../ui/Input';
import { Button } from '../ui/Button';

interface BookingFormProps {
  initialRoomSlug?: string;
  initialCheckIn?: string;
  initialCheckOut?: string;
  initialGuests?: number;
  initialRoomsCount?: number;
}

export const BookingForm: React.FC<BookingFormProps> = ({
  initialRoomSlug,
  initialCheckIn,
  initialCheckOut,
  initialGuests = 2,
  initialRoomsCount = 1,
}) => {
  const todayStr = new Date().toISOString().split('T')[0];
  const tomorrowStr = new Date(Date.now() + 86400000).toISOString().split('T')[0];
  const dayAfterTomorrowStr = new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0];

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [checkIn, setCheckIn] = useState(initialCheckIn || tomorrowStr);
  const [checkOut, setCheckOut] = useState(initialCheckOut || dayAfterTomorrowStr);
  const [adults, setAdults] = useState(initialGuests);
  const [children, setChildren] = useState(0);
  const [roomsCount, setRoomsCount] = useState(initialRoomsCount);
  const [roomSlug, setRoomSlug] = useState(initialRoomSlug || ROOMS[0].slug);
  const [notes, setNotes] = useState('');

  const [errors, setErrors] = useState<BookingFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [submittedBooking, setSubmittedBooking] = useState<BookingRecord | null>(null);

  const selectedRoom = useMemo(() => ROOMS.find((r) => r.slug === roomSlug) || ROOMS[0], [roomSlug]);

  const nights = useMemo(() => {
    const diff = new Date(checkOut).getTime() - new Date(checkIn).getTime();
    return Math.max(1, Math.round(diff / (1000 * 60 * 60 * 24)));
  }, [checkIn, checkOut]);

  const estimatedTotal = selectedRoom.samplePrice
    ? selectedRoom.samplePrice * roomsCount * nights
    : null;

  const validate = (): boolean => {
    const errs: BookingFormErrors = {};
    if (!fullName.trim()) errs.fullName = 'Full Name is required';
    if (!phone.trim() || phone.replace(/\D/g, '').length < 10) errs.phone = 'Valid 10-digit mobile number required';
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = 'Enter a valid email address';
    if (checkIn < todayStr) errs.checkIn = 'Check-in date cannot be in the past';
    if (checkOut <= checkIn) errs.checkOut = 'Check-out must be after check-in date';
    if (adults < 1) errs.adults = 'At least 1 adult is required';
    if (roomsCount < 1) errs.roomsCount = 'At least 1 room is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);
    setApiError(null);

    const payload: BookingRequestPayload = {
      fullName,
      email: email || 'Not provided',
      phone,
      checkIn,
      checkOut,
      adults,
      children,
      roomsCount,
      roomSlug: selectedRoom.slug,
      roomName: selectedRoom.name,
      additionalRequests: notes,
    };

    try {
      const record = await apiService.createBooking(payload);
      setSubmittedBooking(record);
    } catch (err: any) {
      setApiError(
        err?.message ||
          'We could not submit your request right now. Please verify your connection or contact our front desk directly.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submittedBooking) {
    const whatsappText = encodeURIComponent(
      `Hello Vana Resort Araku!\nI have submitted a booking inquiry:\n- ID: ${submittedBooking.id}\n- Room: ${selectedRoom.name}\n- Guest: ${fullName}\n- Phone: ${phone}\n- Dates: ${checkIn} to ${checkOut} (${nights} Nights)\n- Rooms: ${roomsCount}, Guests: ${adults} Adults, ${children} Children\n- Estimated Tariff: ${estimatedTotal ? formatINR(estimatedTotal) : 'Contact for rate'}`
    );

    return (
      <div className="bg-white rounded-2xl border border-sand-border shadow-elevated p-8 text-center space-y-6 max-w-xl mx-auto">
        <div className="w-16 h-16 bg-vana-100 text-vana-700 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <div>
          <span className="text-xs uppercase font-bold tracking-widest text-vana-800 bg-vana-100 px-3 py-1 rounded-full">
            Inquiry Ref: {submittedBooking.id}
          </span>
          <h3 className="font-serif text-2xl font-bold text-slate-900 mt-3">
            Your booking request has been submitted successfully.
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 mt-2">
            Our Araku front desk will review room inventory and connect with you to confirm availability.
          </p>
        </div>

        <div className="p-4 bg-sand-surface rounded-xl border border-sand-border text-left text-xs space-y-1.5">
          <div className="flex justify-between"><span className="text-slate-500">Room Category:</span><strong className="text-slate-900">{selectedRoom.name}</strong></div>
          <div className="flex justify-between"><span className="text-slate-500">Dates:</span><strong className="text-slate-900">{checkIn} to {checkOut} ({nights} Nights)</strong></div>
          <div className="flex justify-between"><span className="text-slate-500">Stay Breakdown:</span><strong className="text-slate-900">{roomsCount} Room(s) • {adults} Adults {children > 0 ? `• ${children} Children` : ''}</strong></div>
          <div className="flex justify-between pt-2 border-t border-sand-border/80"><span className="text-slate-500">Estimated Total:</span><strong className="text-vana-800">{estimatedTotal ? formatINR(estimatedTotal) : 'Final price will be confirmed by resort'}</strong></div>
        </div>

        <div className="pt-2 flex flex-col gap-2.5">
          <a href={`https://wa.me/${RESORT_INFO.contact.whatsapp}?text=${whatsappText}`} target="_blank" rel="noopener noreferrer">
            <Button size="lg" variant="primary" className="w-full" icon={<MessageCircle className="w-5 h-5" />}>
              Notify Concierge on WhatsApp
            </Button>
          </a>
          <Button size="sm" variant="ghost" onClick={() => setSubmittedBooking(null)}>
            Submit Another Request
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="glass-card rounded-3xl p-6 sm:p-10 shadow-elevated space-y-6">
      {apiError && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-800 text-xs sm:text-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-fadeIn">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
            <span>{apiError}</span>
          </div>
          <a
            href={`https://wa.me/${RESORT_INFO.contact.whatsapp}?text=${encodeURIComponent(
              `Hi Vana Resort Araku, I would like to book ${selectedRoom.name} from ${checkIn} to ${checkOut}. Guest: ${fullName || 'Guest'}, Phone: ${phone || 'Pending'}.`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 font-semibold text-emerald-800 bg-emerald-100/80 px-3 py-1.5 rounded-xl border border-emerald-300 hover:bg-emerald-200 transition-colors whitespace-nowrap"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Book via WhatsApp</span>
          </a>
        </div>
      )}

      {/* Guest Information */}
      <div>
        <h4 className="font-serif text-lg font-bold text-slate-900 mb-3 border-b border-sand-border pb-2">
          1. Guest Information
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Input label="Full Name *" placeholder="Your Name" value={fullName} onChange={(e) => setFullName(e.target.value)} error={errors.fullName} />
          <Input label="Mobile Number *" placeholder="10-digit number" value={phone} onChange={(e) => setPhone(e.target.value)} error={errors.phone} />
          <Input label="Email Address" type="email" placeholder="name@email.com" value={email} onChange={(e) => setEmail(e.target.value)} error={errors.email} />
        </div>
      </div>

      {/* Stay Information */}
      <div>
        <h4 className="font-serif text-lg font-bold text-slate-900 mb-3 border-b border-sand-border pb-2">
          2. Stay Dates & Party Size
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-timber-700 mb-1">
              <Calendar className="w-3.5 h-3.5 text-vana-600" /><span>Check-In *</span>
            </label>
            <input type="date" value={checkIn} min={todayStr} onChange={(e) => setCheckIn(e.target.value)} className="w-full bg-sand-50/70 border border-sand-border rounded-lg p-2.5 text-sm" />
            {errors.checkIn && <p className="text-xs text-red-600 mt-1">{errors.checkIn}</p>}
          </div>
          <div>
            <label className="flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-timber-700 mb-1">
              <Calendar className="w-3.5 h-3.5 text-vana-600" /><span>Check-Out *</span>
            </label>
            <input type="date" value={checkOut} min={checkIn} onChange={(e) => setCheckOut(e.target.value)} className="w-full bg-sand-50/70 border border-sand-border rounded-lg p-2.5 text-sm" />
            {errors.checkOut && <p className="text-xs text-red-600 mt-1">{errors.checkOut}</p>}
          </div>
          <div>
            <label className="flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-timber-700 mb-1">
              <Users className="w-3.5 h-3.5 text-vana-600" /><span>Adults *</span>
            </label>
            <select value={adults} onChange={(e) => setAdults(Number(e.target.value))} className="w-full bg-sand-50/70 border border-sand-border rounded-lg p-2.5 text-sm">
              {[1, 2, 3, 4, 5, 6].map((n) => <option key={n} value={n}>{n} Adults</option>)}
            </select>
          </div>
          <div>
            <label className="flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-timber-700 mb-1">
              <Users className="w-3.5 h-3.5 text-vana-600" /><span>Children</span>
            </label>
            <select value={children} onChange={(e) => setChildren(Number(e.target.value))} className="w-full bg-sand-50/70 border border-sand-border rounded-lg p-2.5 text-sm">
              {[0, 1, 2, 3, 4].map((n) => <option key={n} value={n}>{n} Children</option>)}
            </select>
          </div>
          <div>
            <label className="flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-timber-700 mb-1">
              <Home className="w-3.5 h-3.5 text-vana-600" /><span>Number of Rooms *</span>
            </label>
            <select value={roomsCount} onChange={(e) => setRoomsCount(Number(e.target.value))} className="w-full bg-sand-50/70 border border-sand-border rounded-lg p-2.5 text-sm">
              {[1, 2, 3, 4].map((n) => <option key={n} value={n}>{n} Room{n > 1 ? 's' : ''}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Room Selection */}
      <div>
        <h4 className="font-serif text-lg font-bold text-slate-900 mb-3 border-b border-sand-border pb-2">
          3. Room Category
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {ROOMS.map((r) => (
            <div
              key={r.slug}
              onClick={() => setRoomSlug(r.slug)}
              className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all flex items-center justify-between ${
                roomSlug === r.slug ? 'border-vana-600 bg-vana-50/60' : 'border-sand-border hover:bg-sand-50'
              }`}
            >
              <div>
                <strong className="block text-sm text-slate-900">{r.name}</strong>
                <span className="text-xs text-slate-500">{r.specs.sizeSqFt} sq.ft • {r.specs.bed} • Max {r.specs.maxGuests} Guests</span>
              </div>
              <span className="text-xs font-bold text-vana-800">{r.samplePrice ? `${formatINR(r.samplePrice)}/n` : 'On Request'}</span>
            </div>
          ))}
        </div>
      </div>

      <Textarea label="Additional Requests (Optional)" placeholder="Airport/train pickup, early arrival, ground floor request..." value={notes} onChange={(e) => setNotes(e.target.value)} />

      {/* Pricing Summary */}
      <div className="p-4 bg-sand-surface rounded-xl border border-sand-border flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div>
          <span className="font-semibold text-slate-800 block">{nights} Night(s) Stay • {roomsCount} Room(s)</span>
          <span className="text-slate-500">{selectedRoom.samplePrice ? 'Estimated total based on indicative rates:' : 'Final price will be confirmed by the resort.'}</span>
        </div>
        <div className="text-right">
          {estimatedTotal ? (
            <span className="font-serif text-2xl font-bold text-vana-900">{formatINR(estimatedTotal)}</span>
          ) : (
            <span className="font-bold text-timber-700">Rates upon request</span>
          )}
        </div>
      </div>

      <Button type="submit" size="lg" variant="primary" className="w-full" isLoading={isSubmitting}>
        Request Booking
      </Button>
    </form>
  );
};
