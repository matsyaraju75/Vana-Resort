/**
 * @file booking.ts
 * @description Types for booking inquiry requests, status tracking, and validation errors.
 */

export type BookingStatus = 'pending' | 'confirmed' | 'cancelled';

export interface BookingRequestPayload {
  fullName: string;
  email: string;
  phone: string;
  checkIn: string;
  checkOut: string;
  adults: number;
  children: number;
  roomsCount: number;
  roomSlug: string;
  roomName: string;
  additionalRequests?: string;
}

export interface PriceBreakdown {
  nights: number;
  baseRatePerNight: number;
  subtotal: number;
  weekendNights: number;
  weekendSurcharge: number;
  extraGuestFee: number;
  taxesAndService: number;
  totalEstimated: number;
}

export interface BookingRecord extends BookingRequestPayload {
  id: string;
  status: BookingStatus;
  createdAt: string;
  nights: number;
  estimatedPrice?: number | null;
}

export type BookingFormErrors = {
  [K in keyof BookingRequestPayload]?: string;
};
