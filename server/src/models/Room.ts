import mongoose, { Schema, Document } from 'mongoose';

export interface IRoom extends Document {
  id: string;
  slug: string;
  name: string;
  category: string;
  categoryLabel: string;
  tagline: string;
  description: string;
  specs: {
    sizeSqFt: number;
    sizeSqM: number;
    maxGuests: number;
    bed: string;
    bathrooms: number;
    bedrooms?: number;
  };
  features: string[];
  amenities: string[];
  image: string;
  gallery: string[];
  samplePrice?: number;
  priceLabel?: string;
}

const RoomSchema: Schema = new Schema(
  {
    slug: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    category: { type: String, required: true },
    categoryLabel: { type: String, required: true },
    tagline: { type: String, required: true },
    description: { type: String, required: true },
    specs: {
      sizeSqFt: { type: Number, required: true },
      sizeSqM: { type: Number, required: true },
      maxGuests: { type: Number, required: true },
      bed: { type: String, required: true },
      bathrooms: { type: Number, required: true },
      bedrooms: { type: Number },
    },
    features: [{ type: String }],
    amenities: [{ type: String }],
    image: { type: String, required: true },
    gallery: [{ type: String }],
    samplePrice: { type: Number },
    priceLabel: { type: String },
  },
  { timestamps: true }
);

export const RoomModel = mongoose.model<IRoom>('Room', RoomSchema);
