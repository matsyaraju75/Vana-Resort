import { Request, Response } from 'express';
import { ContactModel } from '../models/Contact.js';

export const createContact = async (req: Request, res: Response) => {
  try {
    const { fullName, email, phone, subject, message } = req.body;
    if (!fullName || !email || !message) {
      return res.status(400).json({ error: 'Missing required contact fields' });
    }

    const contact = new ContactModel({ fullName, email, phone, subject, message });
    await contact.save();
    return res.status(201).json(contact);
  } catch (error) {
    console.error('Create contact error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const getContacts = async (_req: Request, res: Response) => {
  try {
    const messages = await ContactModel.find().sort({ createdAt: -1 });
    return res.json(messages);
  } catch (error) {
    console.error('Get contacts error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};
