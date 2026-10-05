import mongoose, { Schema, Document } from 'mongoose';

export interface IBooking extends Document {
  bookingId: string;
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
  status: 'pending' | 'confirmed' | 'cancelled';
  nights: number;
  estimatedPrice?: number | null;
}

const BookingSchema: Schema = new Schema(
  {
    bookingId: { type: String, required: true, unique: true },
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    checkIn: { type: String, required: true },
    checkOut: { type: String, required: true },
    adults: { type: Number, required: true, min: 1 },
    children: { type: Number, default: 0 },
    roomsCount: { type: Number, required: true, min: 1 },
    roomSlug: { type: String, required: true },
    roomName: { type: String, required: true },
    additionalRequests: { type: String },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled'],
      default: 'pending',
    },
    nights: { type: Number, required: true },
    estimatedPrice: { type: Number, default: null },
  },
  { timestamps: true }
);

export const BookingModel = mongoose.model<IBooking>('Booking', BookingSchema);
