/**
 * @file NotFoundPage.tsx
 * @description Serene, nature-luxury 404 error page with clear navigation routes.
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, Home, Bed, MapPin, Phone, ArrowLeft } from 'lucide-react';
import { Button } from '../components/ui/Button';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-[80vh] flex items-center justify-center pt-32 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full text-center space-y-8 glass-card p-8 sm:p-12 rounded-3xl shadow-elevated relative overflow-hidden">
        {/* Ambient Glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-vana-500/10 rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl -z-10" />

        {/* Icon & Badge */}
        <div className="space-y-3">
          <div className="w-16 h-16 rounded-2xl bg-vana-100 border border-vana-200 text-vana-800 flex items-center justify-center mx-auto shadow-soft">
            <Compass className="w-8 h-8 animate-spin-slow" />
          </div>
          <span className="text-xs uppercase font-bold tracking-widest text-vana-800 bg-vana-100/80 px-3.5 py-1.5 rounded-full border border-vana-200 inline-block">
            Error 404 • Mountain Trail Not Found
          </span>
        </div>

        {/* Heading & Text */}
        <div className="space-y-3">
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
            Lost in the Mist of Araku?
          </h1>
          <p className="text-sm sm:text-base text-slate-600 max-w-lg mx-auto leading-relaxed">
            The page you are looking for may have been moved, renamed, or never existed. Let us guide you back to our peaceful hillside retreat.
          </p>
        </div>

        {/* Action Routes */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link to="/" className="w-full sm:w-auto">
            <Button size="lg" variant="primary" className="w-full" icon={<Home className="w-4 h-4" />}>
              Return to Homepage
            </Button>
          </Link>
          <Link to="/rooms" className="w-full sm:w-auto">
            <Button size="lg" variant="outline" className="w-full" icon={<Bed className="w-4 h-4" />}>
              View Rooms & Suites
            </Button>
          </Link>
        </div>

        {/* Secondary Helpful Links */}
        <div className="pt-6 border-t border-sand-border/70 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500">
          <Link to="/nearby-attractions" className="hover:text-vana-800 transition-colors flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-vana-600" />
            <span>Nearby Attractions</span>
          </Link>
          <Link to="/contact" className="hover:text-vana-800 transition-colors flex items-center gap-1">
            <Phone className="w-3.5 h-3.5 text-vana-600" />
            <span>Contact Front Desk</span>
          </Link>
          <Link to="/location" className="hover:text-vana-800 transition-colors flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5 text-vana-600" />
            <span>Directions & Transit</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
