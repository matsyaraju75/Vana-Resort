/**
 * @file LocationPage.tsx
 * @description Location guide featuring verified address, transit distances, Google Maps embed, and attractions.
 */

import React from 'react';
import { MapPin, Navigation, Train, ExternalLink } from 'lucide-react';
import { RESORT_INFO } from '../data/resortInfo';
import { SectionTitle } from '../components/common/SectionTitle';
import { Button } from '../components/ui/Button';

export const LocationPage: React.FC = () => {
  const directionsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    RESORT_INFO.address
  )}`;

  return (
    <div className="pt-32 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
      <SectionTitle
        tag="Destination & Transit"
        title="Find Vana Resort Araku"
        subtitle="Located along Ranajilleda Waterfalls Road in Padmapuram, within easy reach of Araku Railway Station."
      />

      {/* Address & Actions Card */}
      <div className="bg-white rounded-3xl border border-sand-border shadow-card p-6 sm:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-start gap-3">
            <div className="p-3 bg-vana-100 text-vana-700 rounded-xl mt-1">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs uppercase font-bold tracking-widest text-timber-700">Official Resort Address</span>
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-slate-900 mt-1">
                {RESORT_INFO.address}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-2">
                Situated in Padmapuram, on the scenic route leading toward Ranajilleda Waterfalls in Araku Valley.
              </p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 flex flex-col gap-3 justify-center">
          <a href={directionsUrl} target="_blank" rel="noopener noreferrer">
            <Button size="lg" variant="primary" className="w-full" icon={<Navigation className="w-4 h-4" />}>
              Get Driving Directions
            </Button>
          </a>
          <a
            href={`tel:${RESORT_INFO.contact.phone}`}
            className="text-center text-xs font-semibold text-timber-700 hover:text-vana-700 transition-colors"
          >
            Need route guidance? Call {RESORT_INFO.contact.phone}
          </a>
        </div>
      </div>

      {/* Interactive Google Maps Embed */}
      <div className="rounded-3xl overflow-hidden border border-sand-border shadow-soft h-96 w-full bg-sand-200">
        <iframe
          title="Vana Resort Araku Location Map"
          src="https://maps.google.com/maps?q=Padmapuram,+Araku+Valley,+Andhra+Pradesh&t=&z=13&ie=UTF8&iwloc=&output=embed"
          className="w-full h-full border-0"
          loading="lazy"
        />
      </div>

      {/* Transit & Attractions Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Verified Transit */}
        <div className="bg-sand-surface p-7 rounded-2xl border border-sand-border space-y-4">
          <h3 className="font-serif text-xl font-bold text-slate-900 flex items-center gap-2">
            <Train className="w-5 h-5 text-vana-600" />
            <span>Nearby Railway Transit</span>
          </h3>
          <div className="space-y-3">
            {RESORT_INFO.transit.map((t: { name: string; distance: string; description: string }) => (
              <div key={t.name} className="p-4 bg-white rounded-xl border border-sand-border/80">
                <div className="flex justify-between items-baseline mb-1">
                  <h4 className="font-bold text-slate-900 text-sm">{t.name}</h4>
                  <span className="text-xs font-bold text-vana-700 bg-vana-50 px-2 py-0.5 rounded-full">
                    {t.distance}
                  </span>
                </div>
                <p className="text-xs text-slate-600">{t.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Verified Nearby Attractions */}
        <div className="bg-sand-surface p-7 rounded-2xl border border-sand-border space-y-4">
          <h3 className="font-serif text-xl font-bold text-slate-900 flex items-center gap-2">
            <ExternalLink className="w-5 h-5 text-vana-600" />
            <span>Popular Nearby Attractions</span>
          </h3>
          <div className="space-y-3">
            {RESORT_INFO.attractions.map((a: { name: string; type: string; description: string }) => (
              <div key={a.name} className="p-4 bg-white rounded-xl border border-sand-border/80">
                <div className="flex justify-between items-baseline mb-1">
                  <h4 className="font-bold text-slate-900 text-sm">{a.name}</h4>
                  <span className="text-[11px] font-semibold text-timber-700 bg-timber-50 px-2 py-0.5 rounded-full">
                    {a.type}
                  </span>
                </div>
                <p className="text-xs text-slate-600">{a.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
