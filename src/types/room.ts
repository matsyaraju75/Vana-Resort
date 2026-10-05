/**
 * @file room.ts
 * @description Type definitions for room inventory, specifications, and amenity categories.
 */

export type RoomCategoryFilter = 'all' | 'non-ac' | 'ac' | 'suites';

export interface RoomSpecs {
  sizeSqFt: number;
  sizeSqM: number;
  maxGuests: number;
  bed: string;
  bathrooms: number;
  bedrooms?: number;
}

export interface RoomAmenitySection {
  title: string;
  items: string[];
}

export interface Room {
  id: string;
  slug: string;
  name: string;
  category: 'non-ac' | 'ac' | 'suites';
  categoryLabel: string;
  tagline: string;
  description: string;
  specs: RoomSpecs;
  features: string[];
  amenities: string[];
  amenitySections?: RoomAmenitySection[];
  image: string;
  gallery: string[];
  samplePrice?: number;
  priceLabel?: string;
  featured?: boolean;
  status?: 'active' | 'inactive' | 'maintenance';
  availableRooms?: number;
}
