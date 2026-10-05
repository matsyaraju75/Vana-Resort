import { Request, Response } from 'express';
import { RoomModel } from '../models/Room.js';

export const getRooms = async (_req: Request, res: Response) => {
  try {
    const rooms = await RoomModel.find();
    return res.json(rooms);
  } catch (error) {
    console.error('Get rooms error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const getRoomBySlug = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    const room = await RoomModel.findOne({ slug });
    if (!room) {
      return res.status(404).json({ error: 'Room category not found' });
    }
    return res.json(room);
  } catch (error) {
    console.error('Get room by slug error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};
