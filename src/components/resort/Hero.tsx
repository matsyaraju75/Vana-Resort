/**
 * @file Hero.tsx
 * @description Hero banner showcasing Araku Valley nature aesthetic with value propositions and primary CTA.
 */

import React from 'react';
import { Sparkles, ArrowRight, ShieldCheck, MapPin } from 'lucide-react';
import { RESORT_HIGHLIGHTS } from '../../data/resortData';
import { Button } from '../ui/Button';

interface HeroProps {
  onCheckAvailability: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onCheckAvailability }) => {
  return (
    <section className="relative overflow-hidden pt-12 pb-20 lg:pt-16 lg:pb-28">
      {/* Background Subtle Gradient & Organic Glow */}
      <div className="absolute inset-0 bg-gradient-to-b from-sand-surface/80 via-sand-base to-sand-base -z-10" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-vana-200/30 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-10 left-0 w-80 h-80 bg-timber-200/20 rounded-full blur-2xl -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Text Content Column */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-vana-100 border border-vana-200 text-vana-800 text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-vana-600" />
              <span>Eco-Sanctuary in the Eastern Ghats</span>
            </div>

            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-extrabold text-vana-950 leading-[1.15] tracking-tight">
              Awaken to the Whisper of{' '}
              <span className="text-vana-700 italic font-medium">Araku’s Mist</span> & Coffee Groves.
            </h1>

            <p className="text-base sm:text-lg text-slate-700 leading-relaxed max-w-2xl">
              Immerse in sustainable hill luxury at 3,200 ft elevation. Handcrafted teak villas, private cedar plunge
              tubs, authentic tribal bamboo cuisine, and unobstructed valley sunrise views.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Button size="lg" variant="primary" onClick={onCheckAvailability} icon={<ArrowRight className="w-4 h-4" />}>
                Check Availability
              </Button>
              <a href="#rooms">
                <Button size="lg" variant="outline">
                  Explore Villas
                </Button>
              </a>
            </div>

            {/* Quick Guarantees */}
            <div className="flex flex-wrap items-center gap-6 pt-3 text-xs text-timber-700 font-medium">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-vana-600" />
                <span>Best Tariff Guarantee</span>
              </div>
              <div className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-vana-600" />
                <span>Padmapuram Road, Araku</span>
              </div>
            </div>
          </div>

          {/* Media Showcase Column */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Main Visual Image */}
              <div className="relative rounded-3xl overflow-hidden shadow-elevated border-4 border-white aspect-[4/5] group">
                <img
                  src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1000&q=80"
                  alt="Vana Resort Araku Valley Mountain View Villa"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <span className="text-xs uppercase tracking-widest text-sand-200 font-medium">Flagship Sanctuary</span>
                  <h3 className="font-serif text-xl font-bold">Panoramic Valley Ridge Villa</h3>
                </div>
              </div>

              {/* Floating Highlight Pill */}
              <div className="absolute -bottom-6 -left-6 bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-sand-border shadow-card flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-vana-600 flex items-center justify-center text-white font-serif font-bold text-lg">
                  4.9
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-800">Top Rated Hill Resort</div>
                  <div className="text-[11px] text-slate-500">850+ Verified Guest Reviews</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Highlights Bar */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 p-6 bg-sand-surface rounded-2xl border border-sand-border">
          {RESORT_HIGHLIGHTS.map((item) => (
            <div key={item.label} className="text-center sm:text-left border-r last:border-r-0 border-sand-border/80 pr-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-timber-600 block">{item.label}</span>
              <span className="font-serif text-2xl font-bold text-vana-900 block my-0.5">{item.value}</span>
              <span className="text-xs text-slate-500">{item.sub}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
