/**
 * @file Footer.tsx
 * @description Comprehensive footer with verified resort address, transit highlights, and navigation links.
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, MapPin, Phone, Mail, Train, ShieldCheck } from 'lucide-react';
import { RESORT_INFO } from '../../data/resortInfo';
import { InstagramIcon } from './InstagramIcon';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-vana-950 text-sand-100 pt-16 pb-10 border-t border-vana-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-vana-900/80">
          {/* Brand Info */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-vana-700 flex items-center justify-center text-sand-100">
                <Compass className="w-5 h-5" />
              </div>
              <span className="font-serif text-xl font-bold tracking-tight text-white">
                {RESORT_INFO.name.toUpperCase()}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-sand-300/80 leading-relaxed">
              A peaceful 3-star mountain retreat nestled along the green slopes of Araku Valley. Dedicated to
              refreshing travelers exploring Andhra Pradesh’s Eastern Ghats.
            </p>
            <div className="text-xs text-sand-300/70 space-y-1 pt-1">
              <div>Check-in: <strong className="text-white">{RESORT_INFO.checkIn}</strong></div>
              <div>Check-out: <strong className="text-white">{RESORT_INFO.checkOut}</strong></div>
            </div>

            {/* Instagram Connect Button */}
            <div className="pt-2">
              <a
                href={RESORT_INFO.contact.instagram.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 via-rose-500 to-purple-600 text-white font-semibold text-xs px-3.5 py-2 rounded-xl shadow-sm hover:opacity-90 transition-opacity"
              >
                <InstagramIcon className="w-4 h-4" />
                <span>Follow {RESORT_INFO.contact.instagram.displayHandle}</span>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs uppercase font-bold tracking-widest text-sand-200">Explore</h4>
            <ul className="space-y-2 text-xs text-sand-300/80">
              <li><Link to="/" className="hover:text-white transition-colors">Home</Link></li>
              <li><Link to="/rooms" className="hover:text-white transition-colors">Rooms & Suites</Link></li>
              <li><Link to="/amenities" className="hover:text-white transition-colors">Resort Amenities</Link></li>
              <li><Link to="/gallery" className="hover:text-white transition-colors">Photo Gallery</Link></li>
              <li><Link to="/about" className="hover:text-white transition-colors">About the Resort</Link></li>
              <li><Link to="/location" className="hover:text-white transition-colors">Location & Transit</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          {/* Location & Transit */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs uppercase font-bold tracking-widest text-sand-200">Location & Transit</h4>
            <div className="text-xs text-sand-300/80 space-y-2">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span>Ranajilleda Waterfalls Road, Padmapuram, Araku Valley, Andhra Pradesh, India</span>
              </div>
              <div className="flex items-center gap-2 pt-1">
                <Train className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <span>Araku Railway Station (~4.6 km)</span>
              </div>
            </div>
          </div>

          {/* Contact & Inquiries */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs uppercase font-bold tracking-widest text-sand-200">Reservations</h4>
            <div className="text-xs text-sand-300/80 space-y-2.5">
              <a href={`tel:${RESORT_INFO.contact.phone}`} className="flex items-center gap-2 hover:text-white transition-colors">
                <Phone className="w-4 h-4 text-emerald-400" />
                <span>{RESORT_INFO.contact.phone}</span>
              </a>
              <a href={`mailto:${RESORT_INFO.contact.email}`} className="flex items-center gap-2 hover:text-white transition-colors">
                <Mail className="w-4 h-4 text-emerald-400" />
                <span className="truncate">{RESORT_INFO.contact.email}</span>
              </a>
              <a
                href={RESORT_INFO.contact.instagram.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sand-200 hover:text-white transition-colors"
              >
                <InstagramIcon className="w-4 h-4 text-rose-400" />
                <span>Instagram: <span className="font-semibold text-white">{RESORT_INFO.contact.instagram.displayHandle}</span></span>
              </a>
              <div className="pt-2">
                <Link
                  to="/booking"
                  className="inline-block bg-vana-700 hover:bg-vana-600 text-white font-semibold text-xs px-4 py-2 rounded-lg transition-colors"
                >
                  Request Booking Online
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-sand-300/60">
          <p>© {new Date().getFullYear()} {RESORT_INFO.name} • Project Portfolio. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <a
              href={RESORT_INFO.contact.instagram.url}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-sand-200 transition-colors flex items-center gap-1.5"
            >
              <InstagramIcon className="w-3.5 h-3.5 text-rose-400" />
              <span>{RESORT_INFO.contact.instagram.displayHandle}</span>
            </a>
            <Link to="/admin" className="hover:text-sand-200 transition-colors flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Admin Desk</span>
            </Link>
            <span>Independent Project Showcase</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
