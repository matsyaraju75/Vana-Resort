/**
 * @file HomeCTA.tsx
 * @description Prominent call-to-action banner inviting guests to reserve their stay.
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Phone } from 'lucide-react';
import { RESORT_IMAGES } from '../../data/images';
import { RESORT_INFO } from '../../data/resortInfo';
import { Button } from '../ui/Button';

export const HomeCTA: React.FC = () => {
  return (
    <section className="relative py-24 overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <img
          src={RESORT_IMAGES.cta}
          alt="Lush green Araku valley landscape"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-vana-950/85" />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white space-y-6">
        <span className="text-xs uppercase font-bold tracking-widest text-sand-200 bg-white/10 px-3.5 py-1 rounded-full border border-white/20">
          Reservations Open
        </span>

        <h2 className="font-serif text-3xl sm:text-5xl font-extrabold tracking-tight">
          Plan Your Araku Escape
        </h2>

        <p className="text-sm sm:text-base text-sand-200 max-w-xl mx-auto font-light leading-relaxed">
          Experience the quiet charm of Ranajilleda Waterfalls Road and Padmapuram. Submit a booking request online or
          connect directly with our front desk.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <Link to="/booking">
            <Button size="lg" variant="primary" icon={<ArrowRight className="w-4 h-4" />}>
              Book Your Stay
            </Button>
          </Link>
          <a href={`tel:${RESORT_INFO.contact.phone}`}>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10" icon={<Phone className="w-4 h-4" />}>
              Call Front Desk
            </Button>
          </a>
        </div>
      </div>
    </section>
  );
};
