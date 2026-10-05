/**
 * @file Welcome.tsx
 * @description Welcome narrative introducing Vana Resort Araku with original copy and imagery.
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Mountain, ShieldCheck, Coffee } from 'lucide-react';
import { RESORT_IMAGES } from '../../data/images';
import { Button } from '../ui/Button';

export const Welcome: React.FC = () => {
  return (
    <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Visual Column */}
        <div className="lg:col-span-6 relative">
          <div className="relative rounded-3xl overflow-hidden shadow-elevated border-4 border-white aspect-[4/3]">
            <img
              src={RESORT_IMAGES.welcome}
              alt="Peaceful gardens and resort buildings at Vana Resort Araku"
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
          <div className="absolute -bottom-6 -right-6 bg-sand-base rounded-2xl p-5 border border-sand-border shadow-card max-w-xs hidden sm:block">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-vana-100 text-vana-700 rounded-xl">
                <Mountain className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-serif font-bold text-slate-900 text-sm">Padmapuram Serenity</h4>
                <p className="text-xs text-slate-500">Minutes from valleys & falls</p>
              </div>
            </div>
          </div>
        </div>

        {/* Narrative Column */}
        <div className="lg:col-span-6 space-y-6">
          <span className="text-xs uppercase font-bold tracking-widest text-vana-800 bg-vana-100/80 px-3.5 py-1 rounded-full border border-vana-200">
            About Our Property
          </span>

          <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-slate-900 leading-tight">
            Welcome to Vana Resort Araku
          </h2>

          <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
            Perched along Ranajilleda Waterfalls Road near Padmapuram, Vana Resort Araku offers a quiet, relaxing base
            in the heart of the Eastern Ghats. Surrounded by gentle hills, aromatic coffee groves, and crisp mountain
            breezes, our property invites you to slow down and enjoy the scenic rhythm of Araku Valley.
          </p>

          <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
            Whether you are here for a weekend family retreat, a scenic holiday with friends, or a peaceful escape from
            city routines, our clean guest accommodations, outdoor swimming pool, in-house dining, and warm hospitality
            ensure a restful visit.
          </p>

          <div className="grid grid-cols-2 gap-4 pt-2">
            <div className="flex items-start gap-2.5 text-xs text-slate-700">
              <ShieldCheck className="w-4 h-4 text-vana-600 flex-shrink-0 mt-0.5" />
              <span>3-Star Comfort with In-house Dining</span>
            </div>
            <div className="flex items-start gap-2.5 text-xs text-slate-700">
              <Coffee className="w-4 h-4 text-vana-600 flex-shrink-0 mt-0.5" />
              <span>Surrounded by Coffee & Nature</span>
            </div>
          </div>

          <div className="pt-2">
            <Link to="/about">
              <Button size="md" variant="outline" icon={<ArrowRight className="w-4 h-4" />}>
                Read Our Full Story
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
