/**
 * @file ContactPage.tsx
 * @description Contact inquiry page with form validation, address cards, and direct contact placeholders.
 */

import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, CheckCircle2, ExternalLink, AlertCircle, MessageCircle } from 'lucide-react';
import { RESORT_INFO } from '../data/resortInfo';
import type { ContactMessagePayload, ContactFormErrors } from '../types/contact';
import { apiService } from '../services/api';
import { SectionTitle } from '../components/common/SectionTitle';
import { Input, Textarea } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { InstagramIcon } from '../components/common/InstagramIcon';

export const ContactPage: React.FC = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState<ContactFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const validate = (): boolean => {
    const errs: ContactFormErrors = {};
    if (!fullName.trim()) errs.fullName = 'Full Name is required';
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = 'Valid email address is required';
    if (!phone.trim() || phone.replace(/\D/g, '').length < 10) errs.phone = '10-digit phone number is required';
    if (!subject.trim()) errs.subject = 'Subject is required';
    if (!message.trim()) errs.message = 'Please enter your message';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);
    setApiError(null);

    const payload: ContactMessagePayload = { fullName, email, phone, subject, message };
    try {
      await apiService.sendContactMessage(payload);
      setIsSuccess(true);
    } catch (err: any) {
      setApiError(
        err?.message ||
          'Unable to deliver your message right now. Please reach out to our front desk via WhatsApp or phone.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pt-32 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
      <SectionTitle
        tag="Get in Touch"
        title="Contact Vana Resort Araku"
        subtitle="Have questions about rooms, directions, or family gatherings? Reach out to our front desk."
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Contact Info */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-sand-border shadow-soft space-y-4">
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-vana-600 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="block text-slate-900 text-sm">Resort Location</strong>
                <span className="text-xs text-slate-600">{RESORT_INFO.address}</span>
              </div>
            </div>

            <div className="flex items-start gap-3 pt-3 border-t border-sand-border">
              <Phone className="w-5 h-5 text-vana-600 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="block text-slate-900 text-sm">Front Desk Phone</strong>
                <a href={`tel:${RESORT_INFO.contact.phone}`} className="text-xs text-vana-700 font-semibold">
                  {RESORT_INFO.contact.phoneLabel}
                </a>
              </div>
            </div>

            <div className="flex items-start gap-3 pt-3 border-t border-sand-border">
              <Mail className="w-5 h-5 text-vana-600 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="block text-slate-900 text-sm">Email Inquiries</strong>
                <a href={`mailto:${RESORT_INFO.contact.email}`} className="text-xs text-slate-600">
                  {RESORT_INFO.contact.email}
                </a>
              </div>
            </div>

            <div className="flex items-start gap-3 pt-3 border-t border-sand-border">
              <Clock className="w-5 h-5 text-vana-600 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="block text-slate-900 text-sm">Office Hours</strong>
                <span className="text-xs text-slate-600">{RESORT_INFO.contact.officeHours}</span>
              </div>
            </div>

            <div className="flex items-start gap-3 pt-3 border-t border-sand-border">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 text-white flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm">
                <InstagramIcon className="w-4 h-4" />
              </div>
              <div>
                <strong className="block text-slate-900 text-sm">Official Instagram</strong>
                <a
                  href={RESORT_INFO.contact.instagram.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-rose-600 hover:text-rose-700 font-semibold inline-flex items-center gap-1 mt-0.5"
                >
                  <span>{RESORT_INFO.contact.instagram.displayHandle}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
                <p className="text-[11px] text-slate-500 mt-0.5">Follow for guest stories, valley photos & updates</p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-2xl border border-sand-border shadow-card">
          {isSuccess ? (
            <div className="text-center py-10 space-y-4">
              <div className="w-16 h-16 bg-vana-100 text-vana-700 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="font-serif text-2xl font-bold text-slate-900">Message Sent Successfully</h3>
              <p className="text-xs sm:text-sm text-slate-600 max-w-sm mx-auto">
                Thank you for writing to us. Our Araku front desk will review your message and reply back shortly.
              </p>
              <Button size="sm" variant="outline" onClick={() => setIsSuccess(false)}>
                Send Another Message
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {apiError && (
                <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-800 text-xs sm:text-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-fadeIn">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
                    <span>{apiError}</span>
                  </div>
                  <a
                    href={`https://wa.me/${RESORT_INFO.contact.whatsapp}?text=${encodeURIComponent(
                      `Hi Vana Resort Araku, I am reaching out regarding: ${subject || 'Inquiry'}. From: ${fullName || 'Guest'}.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 font-semibold text-emerald-800 bg-emerald-100/80 px-3 py-1.5 rounded-xl border border-emerald-300 hover:bg-emerald-200 transition-colors whitespace-nowrap"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Chat on WhatsApp</span>
                  </a>
                </div>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input label="Full Name *" placeholder="Your name" value={fullName} onChange={(e) => setFullName(e.target.value)} error={errors.fullName} />
                <Input label="Mobile Number *" placeholder="10-digit mobile" value={phone} onChange={(e) => setPhone(e.target.value)} error={errors.phone} />
              </div>
              <Input label="Email Address *" type="email" placeholder="name@email.com" value={email} onChange={(e) => setEmail(e.target.value)} error={errors.email} />
              <Input label="Subject *" placeholder="General inquiry, group stay, route info..." value={subject} onChange={(e) => setSubject(e.target.value)} error={errors.subject} />
              <Textarea label="Message *" placeholder="How can we assist your visit to Araku Valley?" value={message} onChange={(e) => setMessage(e.target.value)} error={errors.message} />
              <Button type="submit" size="lg" variant="primary" className="w-full" isLoading={isSubmitting}>
                Send Message
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
