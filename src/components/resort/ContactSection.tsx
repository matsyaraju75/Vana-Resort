/**
 * @file ContactSection.tsx
 * @description Direct contact triggers (Phone, WhatsApp), resort location details, and Araku travel tips.
 */

import React from 'react';
import { Phone, MessageCircle, Mail, MapPin, Train, Car, CloudRain } from 'lucide-react';
import { RESORT_CONTACT } from '../../data/resortData';
import { Button } from '../ui/Button';

export const ContactSection: React.FC = () => {
  return (
    <section id="contact" className="py-20 bg-sand-surface border-t border-sand-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Contact Details */}
          <div className="lg:col-span-6 space-y-6">
            <div>
              <span className="text-xs uppercase font-bold tracking-widest text-vana-700 bg-vana-100 px-3 py-1 rounded-full border border-vana-200">
                Direct Reservations & Help
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-slate-900 mt-3 mb-3">
                Plan Your Araku Escape
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                Connect directly with our hill front desk for customized stay packages, private corporate offsites, or
                sightseeing arrangements.
              </p>
            </div>

            <div className="space-y-4 text-sm text-slate-700">
              <div className="flex items-start gap-3 p-4 bg-white rounded-xl border border-sand-border">
                <MapPin className="w-5 h-5 text-vana-600 flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-slate-900 font-semibold">Resort Location</strong>
                  <span>{RESORT_CONTACT.address}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <a
                  href={`tel:${RESORT_CONTACT.phonePrimary}`}
                  className="flex items-center gap-3 p-4 bg-white rounded-xl border border-sand-border hover:border-vana-500 transition-colors"
                >
                  <Phone className="w-5 h-5 text-vana-600 flex-shrink-0" />
                  <div>
                    <span className="block text-xs text-slate-500">Front Desk</span>
                    <strong className="text-slate-900 text-sm">{RESORT_CONTACT.phoneDisplay}</strong>
                  </div>
                </a>

                <a
                  href={`mailto:${RESORT_CONTACT.email}`}
                  className="flex items-center gap-3 p-4 bg-white rounded-xl border border-sand-border hover:border-vana-500 transition-colors"
                >
                  <Mail className="w-5 h-5 text-vana-600 flex-shrink-0" />
                  <div className="truncate">
                    <span className="block text-xs text-slate-500">Reservations Email</span>
                    <strong className="text-slate-900 text-xs truncate block">{RESORT_CONTACT.email}</strong>
                  </div>
                </a>
              </div>
            </div>

            {/* Quick Action Button */}
            <div className="pt-2">
              <a
                href={`https://wa.me/${RESORT_CONTACT.whatsappNumber}?text=Hi%20Vana%20Resort,%20I%20have%20an%20inquiry%20regarding%20a%20stay`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button size="lg" variant="primary" icon={<MessageCircle className="w-5 h-5" />}>
                  Chat with Araku Concierge on WhatsApp
                </Button>
              </a>
            </div>
          </div>

          {/* Travel Advisory & Route Tips */}
          <div className="lg:col-span-6 bg-white p-7 rounded-2xl border border-sand-border shadow-soft space-y-6">
            <h3 className="font-serif text-xl font-bold text-slate-900">How to Reach Araku Valley</h3>

            <div className="space-y-4 text-xs sm:text-sm text-slate-600">
              <div className="flex gap-3">
                <div className="p-2 bg-sand-surface rounded-lg h-fit text-vana-700">
                  <Car className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900">By Scenic Road Drive (115 km)</h4>
                  <p className="mt-0.5 text-xs">
                    3 to 3.5 hours from Visakhapatnam via SH39 ghat road. Breathtaking views of coffee terraces and mist.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="p-2 bg-sand-surface rounded-lg h-fit text-timber-700">
                  <Train className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900">Vistadome Glass Train</h4>
                  <p className="mt-0.5 text-xs">
                    Famous daily scenic train from Vizag passing through 58 tunnels and 84 mountain bridges.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="p-2 bg-sand-surface rounded-lg h-fit text-amber-700">
                  <CloudRain className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900">Best Season to Visit</h4>
                  <p className="mt-0.5 text-xs">
                    September to March brings lush waterfalls and pleasant 12°C–22°C temperatures.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-sand-surface rounded-xl border border-sand-border/80 text-xs text-timber-800">
              Check-in: <strong>{RESORT_CONTACT.checkIn}</strong> | Check-out: <strong>{RESORT_CONTACT.checkOut}</strong>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
