/**
 * @file BookingModal.tsx
 * @description Reservation inquiry modal with form validation, price calculation, and direct WhatsApp confirmation.
 */

import React, { useState } from 'react';
import { CheckCircle2, MessageCircle, ArrowRight } from 'lucide-react';
import type { Room } from '../../types/resort';
import { ROOMS_DATA, RESORT_CONTACT } from '../../data/resortData';
import { useBookingCalculator, formatINR } from '../../hooks/useBookingCalculator';
import { Modal } from '../ui/Modal';
import { Input, Textarea } from '../ui/Input';
import { Button } from '../ui/Button';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedRoom: Room | null;
  dates: { checkIn: string; checkOut: string; guests: number };
}

export const BookingModal: React.FC<BookingModalProps> = ({ isOpen, onClose, selectedRoom, dates }) => {
  const [roomId, setRoomId] = useState(selectedRoom?.id || ROOMS_DATA[0].id);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Synchronize with room passed from prop if changed
  const activeRoom = ROOMS_DATA.find((r) => r.id === roomId) || ROOMS_DATA[0];

  const calculation = useBookingCalculator({
    checkIn: dates.checkIn,
    checkOut: dates.checkOut,
    baseRatePerNight: activeRoom.pricePerNight,
    guests: dates.guests,
  });

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = 'Full name is required';
    if (!phone.trim() || phone.replace(/\D/g, '').length < 10) errs.phone = 'Enter a valid 10-digit mobile number';
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = 'Enter a valid email address';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsSubmitted(true);
  };

  const whatsappInquiryUrl = `https://wa.me/${RESORT_CONTACT.whatsappNumber}?text=${encodeURIComponent(
    `Hello Vana Resort Araku!\nI would like to confirm my booking inquiry:\n- Sanctuary: ${activeRoom.title}\n- Guest Name: ${name}\n- Phone: ${phone}\n- Dates: ${dates.checkIn} to ${dates.checkOut} (${calculation.nights} Nights)\n- Guests: ${dates.guests}\n- Est. Tariff: ${formatINR(calculation.totalEstimated)}\n- Notes: ${notes || 'None'}`
  )}`;

  const resetForm = () => {
    setIsSubmitted(false);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={resetForm}
      title={isSubmitted ? 'Inquiry Received' : 'Reserve Your Sanctuary'}
      subtitle={isSubmitted ? 'Our Araku concierge will connect shortly' : activeRoom.title}
      maxWidth="lg"
    >
      {isSubmitted ? (
        <div className="text-center py-4 space-y-5">
          <div className="w-16 h-16 bg-vana-100 text-vana-700 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <div>
            <h4 className="font-serif text-2xl font-bold text-slate-900">Thank you, {name}!</h4>
            <p className="text-sm text-slate-600 mt-2 max-w-sm mx-auto">
              We have received your reservation request for{' '}
              <strong className="text-vana-900">{activeRoom.title}</strong> from {dates.checkIn} to {dates.checkOut}.
            </p>
          </div>

          <div className="p-4 bg-sand-surface rounded-xl border border-sand-border text-left text-xs space-y-1.5 max-w-sm mx-auto">
            <div className="flex justify-between">
              <span className="text-slate-500">Duration:</span>
              <span className="font-semibold text-slate-800">{calculation.nights} Nights ({dates.guests} Guests)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Estimated Total:</span>
              <span className="font-bold text-vana-800">{formatINR(calculation.totalEstimated)}</span>
            </div>
          </div>

          <div className="pt-2 flex flex-col gap-2.5">
            <a href={whatsappInquiryUrl} target="_blank" rel="noopener noreferrer">
              <Button size="lg" variant="primary" className="w-full" icon={<MessageCircle className="w-5 h-5" />}>
                Instant Confirm via WhatsApp
              </Button>
            </a>
            <Button size="sm" variant="ghost" onClick={resetForm}>
              Close Window
            </Button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Full Name *"
              placeholder="e.g. Rahul Varma"
              value={name}
              onChange={(e) => setName(e.target.value)}
              error={errors.name}
            />
            <Input
              label="Mobile Number *"
              placeholder="10-digit mobile"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              error={errors.phone}
            />
          </div>

          <Input
            label="Email Address (Optional)"
            type="email"
            placeholder="rahul@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={errors.email}
          />

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-timber-700 mb-1.5">
              Selected Sanctuary
            </label>
            <select
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              className="w-full bg-white border border-sand-border text-sm text-slate-earth rounded-lg p-2.5 focus:ring-2 focus:ring-vana-500 focus:outline-none"
            >
              {ROOMS_DATA.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.title} — {formatINR(r.pricePerNight)} / night
                </option>
              ))}
            </select>
          </div>

          <Textarea
            label="Special Requests (Optional)"
            placeholder="Airport/Vizag cab pickup, honeymoon floral decor, campfire setup..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />

          {/* Pricing Preview Pill */}
          <div className="p-3 bg-sand-surface rounded-xl border border-sand-border flex items-center justify-between text-xs">
            <span className="text-slate-600">
              {calculation.nights} Nights stay • {dates.guests} Guests
            </span>
            <span className="font-bold text-vana-800 text-sm">{formatINR(calculation.totalEstimated)}</span>
          </div>

          <Button type="submit" size="lg" variant="primary" className="w-full" icon={<ArrowRight className="w-4 h-4" />}>
            Submit Reservation Inquiry
          </Button>
        </form>
      )}
    </Modal>
  );
};
