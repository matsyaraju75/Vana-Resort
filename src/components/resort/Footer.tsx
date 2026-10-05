/**
 * @file Footer.tsx
 * @description Eco-luxury footer with resort policies, quick links, and environmental sustainability pledge.
 */

import React from 'react';
import { Compass, Leaf, Heart } from 'lucide-react';
import { RESORT_CONTACT } from '../../data/resortData';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-vana-950 text-sand-100 pt-16 pb-12 border-t border-vana-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-vana-900">
          {/* Brand Col */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-vana-700 flex items-center justify-center text-sand-100">
                <Compass className="w-5 h-5" />
              </div>
              <span className="font-serif text-xl font-bold tracking-tight text-white">
                VANA RESORT ARAKU
              </span>
            </div>
            <p className="text-xs sm:text-sm text-sand-300/80 leading-relaxed max-w-sm">
              An eco-conscious mountain sanctuary dedicated to preserving the indigenous heritage and flora of the
              Eastern Ghats while delivering world-class hospitality.
            </p>
            <div className="inline-flex items-center gap-2 text-xs text-vana-300 bg-vana-900/60 px-3 py-1.5 rounded-full border border-vana-800">
              <Leaf className="w-3.5 h-3.5 text-emerald-400" />
              <span>100% Single-Use Plastic Free • Solar Heated</span>
            </div>
          </div>

          {/* Quick Nav */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs uppercase font-bold tracking-widest text-sand-200">Quick Navigation</h4>
            <ul className="space-y-2 text-xs text-sand-300/80">
              <li><a href="#rooms" className="hover:text-white transition-colors">Villas & Cottages</a></li>
              <li><a href="#amenities" className="hover:text-white transition-colors">Resort Amenities</a></li>
              <li><a href="#attractions" className="hover:text-white transition-colors">Araku Sightseeing Guide</a></li>
              <li><a href="#contact" className="hover:text-white transition-colors">Contact Front Desk</a></li>
            </ul>
          </div>

          {/* Policies & Info */}
          <div className="lg:col-span-4 space-y-3">
            <h4 className="text-xs uppercase font-bold tracking-widest text-sand-200">Resort Information</h4>
            <p className="text-xs text-sand-300/80 leading-relaxed">
              {RESORT_CONTACT.address}
            </p>
            <div className="text-xs text-sand-300/80 space-y-1 pt-1">
              <div>Check-in: {RESORT_CONTACT.checkIn} | Check-out: {RESORT_CONTACT.checkOut}</div>
              <div>Direct Bookings: {RESORT_CONTACT.phoneDisplay}</div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-sand-300/60">
          <p>© {new Date().getFullYear()} Vana Resort Araku. All rights reserved.</p>
          <div className="flex items-center gap-1 text-sand-300/60">
            <span>Crafted with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>for peaceful travelers in Araku Valley</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
