/**
 * @file Header.tsx
 * @description Sticky, responsive navigation bar with glassmorphism, mobile drawer, and direct call/WhatsApp triggers.
 */

import React, { useState } from 'react';
import { Phone, MessageCircle, Menu, X, Compass } from 'lucide-react';
import { RESORT_CONTACT } from '../../data/resortData';
import { Button } from '../ui/Button';

interface HeaderProps {
  onBookClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onBookClick }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Villas & Rooms', href: '#rooms' },
    { name: 'Resort Amenities', href: '#amenities' },
    { name: 'Araku Guide', href: '#attractions' },
    { name: 'Contact & Directions', href: '#contact' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-sand-base/90 backdrop-blur-md border-b border-sand-border/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <a href="#" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-vana-600 flex items-center justify-center text-white shadow-soft group-hover:bg-vana-700 transition-colors">
            <Compass className="w-5 h-5 text-sand-100" />
          </div>
          <div>
            <span className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-vana-900 block leading-tight">
              VANA RESORT
            </span>
            <span className="text-[10px] uppercase font-semibold tracking-widest text-timber-600 block">
              Araku Valley • 3,200 FT
            </span>
          </div>
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-sm font-medium text-slate-700 hover:text-vana-700 transition-colors"
            >
              {link.name}
            </a>
          ))}
        </nav>

        {/* Contact & Booking Actions */}
        <div className="hidden lg:flex items-center gap-3">
          <a
            href={`tel:${RESORT_CONTACT.phonePrimary}`}
            className="flex items-center gap-1.5 text-xs font-semibold text-timber-700 hover:text-vana-700 px-3 py-2 rounded-lg hover:bg-sand-surface transition-colors"
          >
            <Phone className="w-3.5 h-3.5 text-vana-600" />
            <span>{RESORT_CONTACT.phoneDisplay}</span>
          </a>

          <a
            href={`https://wa.me/${RESORT_CONTACT.whatsappNumber}?text=Hi%20Vana%20Resort,%20I%20would%20like%20to%20inquire%20about%20room%20availability`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-3 py-2 rounded-lg transition-colors"
          >
            <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
            <span>WhatsApp</span>
          </a>

          <Button size="sm" variant="primary" onClick={onBookClick}>
            Book Stay
          </Button>
        </div>

        {/* Mobile menu toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-slate-700 hover:text-vana-700 focus:outline-none"
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-sand-border bg-sand-base px-5 py-6 space-y-4 shadow-xl">
          <nav className="flex flex-col space-y-3">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-base font-medium text-slate-800 hover:text-vana-700 py-1"
              >
                {link.name}
              </a>
            ))}
          </nav>
          <div className="pt-4 border-t border-sand-border/80 flex flex-col gap-2.5">
            <Button
              size="md"
              variant="primary"
              className="w-full"
              onClick={() => {
                setMobileMenuOpen(false);
                onBookClick();
              }}
            >
              Check Availability & Book
            </Button>
            <a
              href={`tel:${RESORT_CONTACT.phonePrimary}`}
              className="flex items-center justify-center gap-2 text-sm font-semibold text-timber-700 bg-white border border-sand-border py-2.5 rounded-lg"
            >
              <Phone className="w-4 h-4 text-vana-600" />
              Call {RESORT_CONTACT.phoneDisplay}
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
