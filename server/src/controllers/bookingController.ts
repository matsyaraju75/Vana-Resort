import { Request, Response } from 'express';
import { BookingModel } from '../models/Booking.js';

export const createBooking = async (req: Request, res: Response) => {
  try {
    const { fullName, email, phone, checkIn, checkOut, adults, children, roomsCount, roomSlug, roomName, additionalRequests } = req.body;

    if (!fullName || !phone || !checkIn || !checkOut || !roomSlug) {
      return res.status(400).json({ error: 'Missing required booking fields' });
    }

    const diff = new Date(checkOut).getTime() - new Date(checkIn).getTime();
    const nights = Math.max(1, Math.round(diff / (1000 * 60 * 60 * 24)));
    const bookingId = `BK-${Math.floor(1000 + Math.random() * 9000)}`;

    const booking = new BookingModel({
      bookingId,
      fullName,
      email,
      phone,
      checkIn,
      checkOut,
      adults: Number(adults) || 1,
      children: Number(children) || 0,
      roomsCount: Number(roomsCount) || 1,
      roomSlug,
      roomName,
      additionalRequests,
      status: 'pending',
      nights,
    });

    await booking.save();
    return res.status(201).json(booking);
  } catch (error) {
    console.error('Create booking error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const getBookings = async (_req: Request, res: Response) => {
  try {
    const bookings = await BookingModel.find().sort({ createdAt: -1 });
    return res.json(bookings);
  } catch (error) {
    console.error('Get bookings error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const updateBookingStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['pending', 'confirmed', 'cancelled'].includes(status)) {
      return res.status(400).json({ error: 'Invalid booking status' });
    }

    const booking = await BookingModel.findOneAndUpdate(
      { $or: [{ _id: id }, { bookingId: id }] },
      { status },
      { new: true }
    );

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    return res.json(booking);
  } catch (error) {
    console.error('Update booking status error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};
