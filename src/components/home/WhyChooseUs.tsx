/**
 * @file WhyChooseUs.tsx
 * @description Value proposition highlighting 6 key reasons to choose Vana Resort Araku.
 */

import React from 'react';
import { MapPin, BedDouble, Sparkles, Trees, UtensilsCrossed, Car } from 'lucide-react';
import { SectionTitle } from '../common/SectionTitle';

const REASONS = [
  {
    icon: <MapPin className="w-6 h-6 text-vana-600" />,
    title: 'Peaceful Araku Location',
    desc: 'Conveniently situated along Ranajilleda Waterfalls Road near Padmapuram, offering quiet surroundings away from highway noise.',
  },
  {
    icon: <BedDouble className="w-6 h-6 text-vana-600" />,
    title: 'Comfortable Rooms & Suites',
    desc: 'Four verified accommodation categories ranging from economical Non AC rooms to 600 sq.ft Executive Suites with heaters.',
  },
  {
    icon: <Sparkles className="w-6 h-6 text-vana-600" />,
    title: 'Resort Facilities',
    desc: 'Unwind by our outdoor swimming pool, stay connected with property Wi-Fi, and enjoy daily housekeeping.',
  },
  {
    icon: <Trees className="w-6 h-6 text-vana-600" />,
    title: 'Scenic Hillside Environment',
    desc: 'Surrounded by forested ridges, pleasant year-round valley climate, and walking trails.',
  },
  {
    icon: <UtensilsCrossed className="w-6 h-6 text-vana-600" />,
    title: 'In-House Dining & Room Service',
    desc: 'Wholesome breakfast, lunch, and dinner prepared on property with in-room dining convenience.',
  },
  {
    icon: <Car className="w-6 h-6 text-vana-600" />,
    title: 'Convenient On-Site Parking',
    desc: 'Spacious and secure vehicle parking for guests driving from Visakhapatnam or traveling with tour vans.',
  },
];

export const WhyChooseUs: React.FC = () => {
  return (
    <section className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          tag="Guest Experience"
          title="Why Choose Vana Resort?"
          subtitle="Thoughtful conveniences, authentic mountain surroundings, and practical hospitality for your Araku visit."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {REASONS.map((r) => (
            <div
              key={r.title}
              className="glass-card glass-card-hover p-6 rounded-3xl space-y-3 h-full flex flex-col"
            >
              <div className="p-3 bg-vana-50 rounded-2xl w-fit border border-vana-100">
                {r.icon}
              </div>
              <h3 className="font-serif text-lg font-bold text-slate-900">{r.title}</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{r.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
