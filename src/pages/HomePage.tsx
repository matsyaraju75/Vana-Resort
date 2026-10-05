/**
 * @file HomePage.tsx
 * @description Cinematic resort homepage assembling hero, welcome, rooms, amenities, why choose us, gallery, and CTA.
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, MapPin } from 'lucide-react';
import { ROOMS } from '../data/rooms';
import { AMENITIES_CATEGORIES } from '../data/amenities';
import { RESORT_IMAGES } from '../data/images';
import { ATTRACTIONS_LIST } from '../data/attractions';
import { Hero } from '../components/home/Hero';
import { Welcome } from '../components/home/Welcome';
import { WhyChooseUs } from '../components/home/WhyChooseUs';
import { Testimonials } from '../components/home/Testimonials';
import { HomeCTA } from '../components/home/HomeCTA';
import { RoomCard } from '../components/rooms/RoomCard';
import { SectionTitle } from '../components/common/SectionTitle';
import { Button } from '../components/ui/Button';
import { RESORT_INFO } from '../data/resortInfo';
import { InstagramIcon } from '../components/common/InstagramIcon';

export const HomePage: React.FC = () => {
  const basicFacilities = AMENITIES_CATEGORIES.find((c) => c.id === 'basic-facilities')?.items || [];
  const generalAmenities = basicFacilities.filter((i) =>
    ['bf-pool', 'bf-power-backup', 'bf-free-parking', 'bf-wifi'].includes(i.id)
  );

  const featuredAttractions = ATTRACTIONS_LIST.filter((a) =>
    ['padmapuram-gardens', 'chaparai-waterfalls', 'madagada-view-point', 'coffee-museum'].includes(a.id)
  );

  return (
    <div className="space-y-0">
      <Hero />
      <Welcome />

      {/* Featured Rooms */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          tag="Accommodations"
          title="Featured Rooms & Suites"
          subtitle="Explore our four verified room categories, each thoughtfully designed for peaceful mountain rest."
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {ROOMS.map((room) => (
            <RoomCard key={room.id} room={room} />
          ))}
        </div>
        <div className="text-center mt-12">
          <Link to="/rooms">
            <Button size="lg" variant="outline" icon={<ArrowRight className="w-4 h-4" />}>
              View All Accommodations
            </Button>
          </Link>
        </div>
      </section>

      {/* Resort Amenities Preview */}
      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle
            tag="Facilities"
            title="Resort Amenities"
            subtitle="Comforts designed to make your Araku Valley getaway relaxing and memorable."
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {generalAmenities.map((amenity) => (
              <div
                key={amenity.id}
                className="glass-card glass-card-hover p-6 rounded-3xl space-y-3 h-full flex flex-col"
              >
                <div className="w-12 h-12 rounded-2xl bg-vana-50 border border-vana-200 flex items-center justify-center text-vana-700 font-bold text-lg">
                  {amenity.title.charAt(0)}
                </div>
                <h3 className="font-serif text-lg font-bold text-slate-900">{amenity.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{amenity.description}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link to="/amenities">
              <Button size="md" variant="outline">
                Explore Full Amenities List
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <WhyChooseUs />

      {/* Araku Attractions Preview */}
      <section className="py-20 relative bg-sand-surface/60 border-y border-sand-border/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
            <div>
              <span className="text-xs uppercase font-bold tracking-widest text-vana-800 bg-vana-100 px-3 py-1 rounded-full border border-vana-200">
                Explore The Valley
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-slate-900 mt-2">
                Nearby Araku Attractions
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-xl">
                Discover iconic waterfalls, historical gardens, and viewpoints within easy reach of Vana Resort.
              </p>
            </div>
            <Link to="/nearby-attractions">
              <Button size="md" variant="outline" icon={<ArrowRight className="w-4 h-4" />}>
                View All 11 Attractions
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredAttractions.map((spot) => (
              <div
                key={spot.id}
                className="glass-card glass-card-hover rounded-3xl overflow-hidden flex flex-col group"
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-sand-200">
                  <img
                    src={spot.image}
                    alt={spot.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <span className="absolute top-3 left-3 bg-black/60 backdrop-blur-md text-white text-[11px] font-medium px-2.5 py-1 rounded-full">
                    {spot.categoryLabel}
                  </span>
                </div>
                <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <h3 className="font-serif text-lg font-bold text-slate-900 group-hover:text-vana-700 transition-colors">
                      {spot.name}
                    </h3>
                    <p className="text-xs text-vana-700 font-semibold mt-1 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 shrink-0" />
                      <span>{spot.distance}</span>
                    </p>
                    <p className="text-xs text-slate-600 line-clamp-2 mt-2 leading-relaxed">
                      {spot.description}
                    </p>
                  </div>
                  <div className="pt-2 border-t border-sand-border/70 flex items-center justify-between text-[11px] text-slate-500">
                    <span>{spot.entryPrice.split('|')[0].trim()}</span>
                    <Link
                      to="/nearby-attractions"
                      className="text-vana-700 font-semibold hover:underline flex items-center gap-0.5"
                    >
                      <span>Explore</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Preview */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
          <div>
            <span className="text-xs uppercase font-bold tracking-widest text-vana-800 bg-vana-100 px-3 py-1 rounded-full">
              Visual Tour
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-slate-900 mt-2">
              Moments at Vana Resort
            </h2>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <a
              href={RESORT_INFO.contact.instagram.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 via-rose-500 to-purple-600 text-white font-semibold text-xs px-4 py-2.5 rounded-xl shadow-soft hover:shadow-card hover:opacity-95 transition-all"
            >
              <InstagramIcon className="w-4 h-4" />
              <span>Follow {RESORT_INFO.contact.instagram.displayHandle}</span>
            </a>
            <Link to="/gallery">
              <Button size="md" variant="outline" icon={<ArrowRight className="w-4 h-4" />}>
                View Full Gallery
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {RESORT_IMAGES.gallery.slice(0, 8).map((img, i) => (
            <div key={i} className="aspect-[4/3] rounded-3xl overflow-hidden glass-card group">
              <img
                src={img.src}
                alt={img.alt}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </section>

      {/* Location Summary */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="glass-card rounded-3xl p-8 sm:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-3">
              <span className="text-xs uppercase font-bold tracking-widest text-timber-700">Prime Padmapuram Setting</span>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900">
                Convenient Access in Araku Valley
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-2xl">
                Located on Ranajilleda Waterfalls Road near Padmapuram, only ~4.6 km from Araku Railway Station. Enjoy
                easy day excursions to Padmapuram Gardens and Chaparai Waterfalls.
              </p>
            </div>
            <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3 justify-end">
              <Link to="/location">
                <Button size="md" variant="primary" className="w-full" icon={<MapPin className="w-4 h-4" />}>
                  View Location & Directions
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Testimonials />
      <HomeCTA />
    </div>
  );
};
