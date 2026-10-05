/**
 * @file useBookingModal.ts
 * @description State coordinator for opening, closing, and prefilling the booking reservation modal.
 */

import { useState, useCallback } from 'react';
import type { Room } from '../types/resort';

export function useBookingModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);

  // Helper to format ISO date strings for date inputs (YYYY-MM-DD)
  const getFormattedDate = (daysFromToday: number) => {
    const d = new Date();
    d.setDate(d.getDate() + daysFromToday);
    return d.toISOString().split('T')[0];
  };

  const [prefilledDates, setPrefilledDates] = useState({
    checkIn: getFormattedDate(2),
    checkOut: getFormattedDate(4),
    guests: 2,
  });

  const openBooking = useCallback((room?: Room, customDates?: { checkIn: string; checkOut: string; guests: number }) => {
    if (room) setSelectedRoom(room);
    if (customDates) setPrefilledDates(customDates);
    setIsOpen(true);
  }, []);

  const closeBooking = useCallback(() => {
    setIsOpen(false);
  }, []);

  return {
    isOpen,
    selectedRoom,
    prefilledDates,
    openBooking,
    closeBooking,
    setSelectedRoom,
  };
}
