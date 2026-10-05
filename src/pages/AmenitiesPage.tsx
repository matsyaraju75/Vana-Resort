/**
 * @file AmenitiesPage.tsx
 * @description Comprehensive amenities catalog organized into user-defined categories,
 * featuring guest reviews breakdown, availability tags, and category filtering.
 */

import React, { useState } from 'react';
import {
  Waves,
  UtensilsCrossed,
  Cigarette,
  Zap,
  ArrowUpDown,
  Sparkles,
  Umbrella,
  BellRing,
  Wind,
  Flame,
  Newspaper,
  Car,
  Wifi,
  Shirt,
  UserCheck,
  Languages,
  Briefcase,
  Accessibility,
  Bath,
  HeartPulse,
  Droplets,
  Armchair,
  ThermometerSun,
  Laptop,
  Eye,
  Camera,
  ShieldAlert,
  Tv,
  Coffee,
  ConciergeBell,
  Archive,
  Star,
  MessageSquareQuote,
  Building2,
  BedDouble,
  Heart,
  Users,
  ShieldCheck,
  Package,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { RESORT_AMENITIES_DATA, GUEST_AMENITIES_FEEDBACK } from '../data/amenities';
import { SectionTitle } from '../components/common/SectionTitle';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';

// Icon mapping helper
const renderAmenityIcon = (name: string, className = 'w-5 h-5 text-vana-700') => {
  switch (name) {
    case 'Waves':
      return <Waves className={className} />;
    case 'UtensilsCrossed':
      return <UtensilsCrossed className={className} />;
    case 'Cigarette':
      return <Cigarette className={className} />;
    case 'Zap':
      return <Zap className={className} />;
    case 'ArrowUpDown':
      return <ArrowUpDown className={className} />;
    case 'Sparkles':
      return <Sparkles className={className} />;
    case 'Umbrella':
      return <Umbrella className={className} />;
    case 'BellRing':
      return <BellRing className={className} />;
    case 'Wind':
      return <Wind className={className} />;
    case 'Flame':
      return <Flame className={className} />;
    case 'Newspaper':
      return <Newspaper className={className} />;
    case 'Car':
      return <Car className={className} />;
    case 'Wifi':
      return <Wifi className={className} />;
    case 'Shirt':
      return <Shirt className={className} />;
    case 'UserCheck':
      return <UserCheck className={className} />;
    case 'Languages':
      return <Languages className={className} />;
    case 'Briefcase':
      return <Briefcase className={className} />;
    case 'Accessibility':
      return <Accessibility className={className} />;
    case 'Bath':
      return <Bath className={className} />;
    case 'HeartPulse':
      return <HeartPulse className={className} />;
    case 'Droplets':
      return <Droplets className={className} />;
    case 'Armchair':
      return <Armchair className={className} />;
    case 'ThermometerSun':
      return <ThermometerSun className={className} />;
    case 'Laptop':
      return <Laptop className={className} />;
    case 'Eye':
      return <Eye className={className} />;
    case 'Camera':
      return <Camera className={className} />;
    case 'ShieldAlert':
      return <ShieldAlert className={className} />;
    case 'Tv':
      return <Tv className={className} />;
    case 'Coffee':
      return <Coffee className={className} />;
    case 'ConciergeBell':
      return <ConciergeBell className={className} />;
    case 'Archive':
      return <Archive className={className} />;
    default:
      return <Sparkles className={className} />;
  }
};

const renderCategoryIcon = (icon: string) => {
  switch (icon) {
    case 'Heart':
      return <Heart className="w-5 h-5 text-rose-600" />;
    case 'Building2':
      return <Building2 className="w-5 h-5 text-vana-700" />;
    case 'Users':
      return <Users className="w-5 h-5 text-blue-600" />;
    case 'HeartPulse':
      return <HeartPulse className="w-5 h-5 text-emerald-600" />;
    case 'BedDouble':
      return <BedDouble className="w-5 h-5 text-amber-700" />;
    case 'UtensilsCrossed':
      return <UtensilsCrossed className="w-5 h-5 text-orange-600" />;
    case 'ShieldCheck':
      return <ShieldCheck className="w-5 h-5 text-emerald-700" />;
    case 'Tv':
      return <Tv className="w-5 h-5 text-purple-600" />;
    case 'Coffee':
      return <Coffee className="w-5 h-5 text-amber-800" />;
    case 'Package':
      return <Package className="w-5 h-5 text-slate-700" />;
    default:
      return <Sparkles className="w-5 h-5 text-vana-600" />;
  }
};

export const AmenitiesPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'All Amenities' },
    ...RESORT_AMENITIES_DATA.map((c) => ({ id: c.id, label: c.title })),
  ];

  const filteredData =
    selectedCategory === 'all'
      ? RESORT_AMENITIES_DATA
      : RESORT_AMENITIES_DATA.filter((c) => c.id === selectedCategory);

  return (
    <div className="pt-32 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      {/* Title Header */}
      <SectionTitle
        tag="Verified Property Facilities"
        title="Resort Amenities & Services"
        subtitle="Explore verified amenities across rooms, dining, couple experiences, and basic property infrastructure."
      />

      {/* Guest Feedback & Rating Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-sand-border shadow-soft space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-sand-border/70 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700 shadow-inner">
              <MessageSquareQuote className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-serif text-lg sm:text-xl font-bold text-slate-900">
                What Guests Said
              </h3>
              <p className="text-xs text-slate-500">Verified traveler experiences and amenities assessment</p>
            </div>
          </div>

          {/* Rating Pill */}
          <div className="flex items-center gap-2 bg-amber-50 border border-amber-300/80 px-4 py-2 rounded-2xl w-fit">
            <div className="flex items-center gap-1 text-amber-500">
              <Star className="w-4 h-4 fill-amber-400" />
              <Star className="w-4 h-4 fill-amber-400" />
              <Star className="w-4 h-4 fill-amber-400 text-amber-300" />
            </div>
            <span className="text-sm font-extrabold text-slate-900">
              {GUEST_AMENITIES_FEEDBACK.rating} / 5
            </span>
            <span className="text-xs text-slate-500">• Amenities Rating</span>
          </div>
        </div>

        <p className="text-sm text-slate-700 leading-relaxed italic bg-sand-50/80 p-4 rounded-2xl border border-sand-border/60">
          "{GUEST_AMENITIES_FEEDBACK.summary}"
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <div className="flex items-center gap-2 text-xs text-emerald-800 bg-emerald-50/70 border border-emerald-200/80 px-3.5 py-2 rounded-xl">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
            <span><strong>Top Highlights:</strong> Cleanliness of rooms & beautiful mountain valley views.</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-amber-900 bg-amber-50/70 border border-amber-200/80 px-3.5 py-2 rounded-xl">
            <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
            <span><strong>Traveler Tips:</strong> Request toiletries/towels at front desk upon check-in.</span>
          </div>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setSelectedCategory(cat.id)}
            className={`whitespace-nowrap px-4 py-2 rounded-full text-xs font-semibold transition-all duration-200 shrink-0 ${
              selectedCategory === cat.id
                ? 'bg-vana-700 text-white shadow-sm scale-105'
                : 'bg-white text-slate-700 border border-sand-border hover:bg-sand-100'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Categorized Amenities Grids */}
      <div className="space-y-12">
        {filteredData.map((category) => (
          <section key={category.id} className="space-y-5">
            {/* Category Header */}
            <div className="flex items-center gap-3 border-b border-sand-border pb-3">
              <div className="w-9 h-9 rounded-xl bg-sand-100 border border-sand-200 flex items-center justify-center">
                {renderCategoryIcon(category.icon)}
              </div>
              <div>
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-slate-900">
                  {category.title}
                </h3>
                {category.subtitle && (
                  <p className="text-xs sm:text-sm text-slate-500">{category.subtitle}</p>
                )}
              </div>
              <span className="ml-auto text-xs font-semibold text-slate-400 bg-sand-100 px-2.5 py-1 rounded-full">
                {category.items.length} {category.items.length === 1 ? 'item' : 'items'}
              </span>
            </div>

            {/* Items Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {category.items.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl p-5 border border-sand-border/90 shadow-soft hover:shadow-card hover:border-vana-300 transition-all duration-300 flex flex-col justify-between space-y-3 group h-full"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div className="w-10 h-10 rounded-xl bg-sand-50 border border-sand-border/80 flex items-center justify-center group-hover:bg-vana-50 group-hover:border-vana-200 transition-colors">
                        {renderAmenityIcon(item.icon)}
                      </div>
                      {item.tag && (
                        <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-amber-100/70 text-amber-900 border border-amber-200/60 text-right">
                          {item.tag}
                        </span>
                      )}
                    </div>

                    <h4 className="font-serif text-base font-bold text-slate-900 group-hover:text-vana-800 transition-colors">
                      {item.name}
                    </h4>

                    {item.description && (
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {item.description}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>

      {/* CTA Box */}
      <div className="bg-gradient-to-r from-vana-900 via-vana-800 to-timber-900 rounded-3xl p-8 sm:p-10 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center sm:text-left">
          <h3 className="font-serif text-2xl sm:text-3xl font-bold text-sand-100">
            Ready to Experience Araku Valley?
          </h3>
          <p className="text-xs sm:text-sm text-sand-300 max-w-xl">
            Choose from Standard Non AC, AC Deluxe, Junior Suites, or Executive Suites with panoramic hill views.
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <Link to="/rooms">
            <Button size="lg" variant="secondary" className="bg-white text-vana-900 hover:bg-sand-100">
              View All Rooms
            </Button>
          </Link>
          <Link to="/booking">
            <Button size="lg" variant="primary">
              Book Your Stay
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
