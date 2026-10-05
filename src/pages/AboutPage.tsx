/**
 * @file AboutPage.tsx
 * @description Narrative page detailing Vana Resort Araku and the broader Araku Valley natural experience.
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { Mountain, Compass, Trees, CloudRain, ArrowRight } from 'lucide-react';
import { RESORT_IMAGES } from '../data/images';
import { SectionTitle } from '../components/common/SectionTitle';
import { Button } from '../components/ui/Button';

export const AboutPage: React.FC = () => {
  return (
    <div className="pt-32 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
      <SectionTitle
        tag="Our Story"
        title="About Vana Resort Araku"
        subtitle="A tranquil haven nestled amidst the coffee-scented hills of Andhra Pradesh’s Eastern Ghats."
      />

      {/* Main Narrative */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-6 space-y-6 text-slate-700 leading-relaxed text-sm sm:text-base">
          <h3 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900">
            A Peaceful Base in the Eastern Ghats
          </h3>
          <p>
            Vana Resort Araku was established to offer leisure travelers and families a calm, unhurried sanctuary along
            Ranajilleda Waterfalls Road in Padmapuram. Positioned away from dense traffic, our property serves as a
            restful launchpad to immerse yourself in Araku’s cool mountain elevation.
          </p>
          <p>
            With on-site dining, an outdoor swimming pool, dedicated room service, and verified guest categories ranging
            from practical Non AC rooms to spacious Executive Suites, we focus on providing dependable comfort,
            cleanliness, and attentive regional hospitality.
          </p>
          <div className="pt-2">
            <Link to="/rooms">
              <Button size="md" variant="primary" icon={<ArrowRight className="w-4 h-4" />}>
                Explore Accommodations
              </Button>
            </Link>
          </div>
        </div>

        <div className="lg:col-span-6">
          <div className="rounded-3xl overflow-hidden shadow-elevated border-4 border-white aspect-[4/3]">
            <img
              src={RESORT_IMAGES.about}
              alt="Misty landscape in Araku Valley"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      {/* The Araku Valley Experience */}
      <section className="bg-sand-surface rounded-3xl p-8 sm:p-12 border border-sand-border space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs uppercase font-bold tracking-widest text-vana-800 bg-vana-100 px-3.5 py-1 rounded-full border border-vana-200">
            Destination Guide
          </span>
          <h3 className="font-serif text-3xl font-bold text-slate-900">The Araku Experience</h3>
          <p className="text-xs sm:text-sm text-slate-600">
            Araku Valley sits at approximately 3,000 ft above sea level, offering a serene climate and diverse natural
            wonders across every season.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-sand-border space-y-2">
            <Mountain className="w-6 h-6 text-vana-600" />
            <h4 className="font-serif font-bold text-slate-900 text-base">Misty Mountains</h4>
            <p className="text-xs text-slate-600">Rolling Eastern Ghats ranges that catch morning fog and mountain clouds.</p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-sand-border space-y-2">
            <Trees className="w-6 h-6 text-vana-600" />
            <h4 className="font-serif font-bold text-slate-900 text-base">Coffee Plantations</h4>
            <p className="text-xs text-slate-600">Endless green canopies of Arabica coffee bushes and tall silver oak trees.</p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-sand-border space-y-2">
            <CloudRain className="w-6 h-6 text-vana-600" />
            <h4 className="font-serif font-bold text-slate-900 text-base">Waterfalls & Streams</h4>
            <p className="text-xs text-slate-600">Cascading seasonal waterfalls including nearby Chaparai and Ranajilleda.</p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-sand-border space-y-2">
            <Compass className="w-6 h-6 text-vana-600" />
            <h4 className="font-serif font-bold text-slate-900 text-base">Local Culture</h4>
            <p className="text-xs text-slate-600">Rich tribal heritage, handcrafted bamboo crafts, and colorful weekend shandies.</p>
          </div>
        </div>
      </section>
    </div>
  );
};
