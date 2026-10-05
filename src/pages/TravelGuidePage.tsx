/**
 * @file TravelGuidePage.tsx
 * @description In-depth traveler guide for Araku Valley covering transit, Vistadome train line,
 * best seasons, packing checklist, and local travel advice.
 */

import React from 'react';
import { Train, Car, Plane, Calendar, ThermometerSun, CheckCircle2, MapPin, Compass } from 'lucide-react';
import { TRAVEL_GUIDE_SECTIONS } from '../data/travelGuide';
import { SectionTitle } from '../components/common/SectionTitle';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';

export const TravelGuidePage: React.FC = () => {
  return (
    <div className="pt-32 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
      {/* Header */}
      <SectionTitle
        tag="Visitor Information"
        title="Araku Valley Travel Guide"
        subtitle="Essential advice, transit directions, weather seasons, and insider tips for planning your trip."
      />

      {/* Overview Card */}
      <div className="bg-white rounded-3xl p-8 border border-sand-border shadow-soft flex flex-col md:flex-row items-center gap-8">
        <div className="md:w-1/3 aspect-[4/3] rounded-2xl overflow-hidden shadow-md shrink-0">
          <img
            src="./images/nature/scenery.jpeg"
            alt="Scenic Araku Valley view"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="space-y-4">
          <span className="text-xs uppercase font-bold tracking-widest text-vana-800 bg-vana-100 px-3 py-1 rounded-full">
            The Ooty of Andhra Pradesh
          </span>
          <h3 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900">
            Welcome to the Eastern Ghats
          </h3>
          <p className="text-sm text-slate-700 leading-relaxed">
            {TRAVEL_GUIDE_SECTIONS.overview} Located at a pleasant altitude of over 3,200 ft, Araku offers year-round cool temperatures, pristine hill forests, and scenic vistas that draw nature enthusiasts from across India.
          </p>
          <div className="flex flex-wrap gap-4 pt-2 text-xs text-slate-600 font-semibold">
            <span className="flex items-center gap-1.5 bg-sand-50 px-3 py-1.5 rounded-xl border border-sand-border">
              <MapPin className="w-4 h-4 text-vana-600" /> Elevation: 3,200+ ft
            </span>
            <span className="flex items-center gap-1.5 bg-sand-50 px-3 py-1.5 rounded-xl border border-sand-border">
              <Compass className="w-4 h-4 text-amber-600" /> Approx. 115 km from Visakhapatnam
            </span>
          </div>
        </div>
      </div>

      {/* How to Reach Section */}
      <section className="space-y-6">
        <div className="border-b border-sand-border pb-3">
          <h3 className="font-serif text-2xl font-bold text-slate-900">How to Reach Araku Valley</h3>
          <p className="text-xs sm:text-sm text-slate-500">Multiple convenient transit options connecting from Visakhapatnam</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TRAVEL_GUIDE_SECTIONS.howToReach.map((item, idx) => {
            const icon =
              idx === 0 ? (
                <Train className="w-6 h-6 text-blue-600" />
              ) : idx === 1 ? (
                <Car className="w-6 h-6 text-vana-600" />
              ) : (
                <Plane className="w-6 h-6 text-indigo-600" />
              );

            return (
              <div
                key={item.mode}
                className="bg-white rounded-3xl p-6 border border-sand-border shadow-soft space-y-4 flex flex-col justify-between h-full"
              >
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-sand-50 border border-sand-border flex items-center justify-center">
                    {icon}
                  </div>
                  <h4 className="font-serif text-lg font-bold text-slate-900">{item.mode}</h4>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{item.details}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Seasons and Climate */}
      <section className="space-y-6">
        <div className="border-b border-sand-border pb-3">
          <h3 className="font-serif text-2xl font-bold text-slate-900">Best Time to Visit</h3>
          <p className="text-xs sm:text-sm text-slate-500">Seasonal guide to climate, temperature ranges, and highlights</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TRAVEL_GUIDE_SECTIONS.bestTimeToVisit.map((season) => (
            <div
              key={season.season}
              className="bg-white rounded-3xl p-6 border border-sand-border shadow-soft space-y-3 h-full flex flex-col"
            >
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                  <Calendar className="w-3.5 h-3.5" />
                  {season.temp}
                </span>
                <ThermometerSun className="w-5 h-5 text-amber-500" />
              </div>

              <h4 className="font-serif text-lg font-bold text-slate-900">{season.season}</h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{season.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Packing Checklist */}
      <section className="bg-sand-50 border border-sand-border rounded-3xl p-8 sm:p-10 space-y-6">
        <div>
          <h3 className="font-serif text-2xl font-bold text-slate-900">Recommended Packing Checklist</h3>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">Smart items to bring for a comfortable holiday in the valley</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {TRAVEL_GUIDE_SECTIONS.packingTips.map((tip, idx) => (
            <div
              key={idx}
              className="flex items-start gap-3 p-4 bg-white rounded-2xl border border-sand-border/80 shadow-xs text-xs sm:text-sm text-slate-700"
            >
              <CheckCircle2 className="w-5 h-5 text-vana-600 shrink-0 mt-0.5" />
              <span>{tip}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
        <Link to="/nearby-attractions">
          <Button size="lg" variant="primary">
            Explore 11 Nearby Attractions
          </Button>
        </Link>
        <Link to="/booking">
          <Button size="lg" variant="outline">
            Check Room Availability
          </Button>
        </Link>
      </div>
    </div>
  );
};
