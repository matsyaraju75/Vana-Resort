/**
 * @file resort.ts
 * @description Core TypeScript definitions for Vana Resort Araku rooms, amenities, and attractions.
 */

export type RoomCategory = 'all' | 'villa' | 'cottage' | 'suite' | 'chalet';

export interface RoomSpecs {
  sqft: number;
  bedType: string;
  view: string;
  maxGuests: number;
  bathrooms: number;
}

export interface Room {
  id: string;
  title: string;
  category: 'villa' | 'cottage' | 'suite' | 'chalet';
  tagline: string;
  description: string;
  pricePerNight: number;
  originalPricePerNight?: number;
  image: string;
  specs: RoomSpecs;
  amenities: string[];
  badge?: string;
  featured?: boolean;
}

export interface Amenity {
  id: string;
  title: string;
  description: string;
  icon: string;
  badge?: string;
}

export interface Attraction {
  id: string;
  name: string;
  distance: string;
  travelTime: string;
  description: string;
  tag: string;
  highlight: string;
}

export interface ResortContact {
  brandName: string;
  tagline: string;
  address: string;
  region: string;
  phonePrimary: string;
  phoneDisplay: string;
  whatsappNumber: string;
  email: string;
  checkIn: string;
  checkOut: string;
  googleMapsUrl: string;
}

export interface Testimonial {
  id: string;
  guestName: string;
  city: string;
  rating: number;
  stayDate: string;
  roomBooked: string;
  comment: string;
}
