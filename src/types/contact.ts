/**
 * @file contact.ts
 * @description Types for contact messages and inquiries.
 */

export interface ContactMessagePayload {
  fullName: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

export interface ContactRecord extends ContactMessagePayload {
  id: string;
  createdAt: string;
  status: 'unread' | 'read' | 'responded';
}

export type ContactFormErrors = {
  [K in keyof ContactMessagePayload]?: string;
};
