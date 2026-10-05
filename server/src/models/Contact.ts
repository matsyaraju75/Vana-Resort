import mongoose, { Schema, Document } from 'mongoose';

export interface IContact extends Document {
  fullName: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  status: 'unread' | 'read' | 'responded';
}

const ContactSchema: Schema = new Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    subject: { type: String, required: true },
    message: { type: String, required: true },
    status: {
      type: String,
      enum: ['unread', 'read', 'responded'],
      default: 'unread',
    },
  },
  { timestamps: true }
);

export const ContactModel = mongoose.model<IContact>('Contact', ContactSchema);
