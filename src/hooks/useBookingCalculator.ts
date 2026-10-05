/**
 * @file useBookingCalculator.ts
 * @description Custom hook for real-time resort booking price calculations, weekend surcharges, and taxes.
 */

import { useMemo } from 'react';
import type { PriceBreakdown } from '../types/booking';

interface UseBookingCalculatorProps {
  checkIn: string;
  checkOut: string;
  baseRatePerNight: number;
  guests: number;
  includedGuests?: number;
}

/**
 * Calculates itemized tariff breakdown including nights, weekend surge, extra guest fees, and GST.
 */
export function useBookingCalculator({
  checkIn,
  checkOut,
  baseRatePerNight,
  guests,
  includedGuests = 2,
}: UseBookingCalculatorProps): PriceBreakdown {
  return useMemo(() => {
    const startDate = new Date(checkIn);
    const endDate = new Date(checkOut);

    // Default to 1 night if dates are invalid or inverted
    const diffTime = endDate.getTime() - startDate.getTime();
    const calculatedNights = Math.max(1, Math.round(diffTime / (1000 * 60 * 60 * 24)));
    const nights = isNaN(calculatedNights) || calculatedNights < 1 ? 1 : calculatedNights;

    // Count weekend nights (Friday = 5, Saturday = 6)
    let weekendNights = 0;
    const cursorDate = new Date(startDate);
    for (let i = 0; i < nights; i++) {
      const day = cursorDate.getDay();
      if (day === 5 || day === 6) {
        weekendNights++;
      }
      cursorDate.setDate(cursorDate.getDate() + 1);
    }

    // Tariff math
    const baseSubtotal = baseRatePerNight * nights;
    const weekendSurcharge = weekendNights * (baseRatePerNight * 0.15); // 15% weekend premium
    const extraGuests = Math.max(0, guests - includedGuests);
    const extraGuestFee = extraGuests * 999 * nights;

    const subtotal = Math.round(baseSubtotal + weekendSurcharge + extraGuestFee);
    const taxesAndService = Math.round(subtotal * 0.12); // 12% GST
    const totalEstimated = subtotal + taxesAndService;

    return {
      nights,
      baseRatePerNight,
      subtotal,
      weekendNights,
      weekendSurcharge: Math.round(weekendSurcharge),
      extraGuestFee,
      taxesAndService,
      totalEstimated,
    };
  }, [checkIn, checkOut, baseRatePerNight, guests, includedGuests]);
}

/**
 * Helper to format Indian Rupee values with proper grouping
 */
export function formatINR(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}
