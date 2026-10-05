/**
 * @file Navbar.tsx
 * @description Header navigation bar featuring Stay and Explore dropdown menus with robust hover buffering,
 * click-outside dismiss, mobile drawer accordion, customer/management login, and primary booking CTA.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Compass,
  Menu,
  X,
  ShieldCheck,
  LogOut,
  ChevronDown,
  Bed,
  Sparkles,
  MapPin,
  Sun,
  BookOpen,
} from 'lucide-react';
import { RESORT_INFO } from '../../data/resortInfo';
import { Button } from '../ui/Button';
import { useAuth } from '../../context/AuthContext';

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<'stay' | 'explore' | null>(null);
  const [mobileExpanded, setMobileExpanded] = useState<{ stay: boolean; explore: boolean }>({
    stay: true,
    explore: true,
  });

  const stayRef = useRef<HTMLDivElement>(null);
  const exploreRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const location = useLocation();
  const { role, openLoginModal, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileOpen(false);
    setOpenDropdown(null);
  }, [location.pathname]);

  // Handle click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        stayRef.current &&
        !stayRef.current.contains(target) &&
        exploreRef.current &&
        !exploreRef.current.contains(target)
      ) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  // Hover handlers with debounce buffer to eliminate flicker & premature closure
  const handleMouseEnter = (menu: 'stay' | 'explore') => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setOpenDropdown(menu);
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      setOpenDropdown(null);
    }, 300); // 300ms buffer keeps menu open while cursor transitions into options
  };

  const isHome = location.pathname === '/';
  const headerBg = isScrolled || !isHome
    ? 'bg-white/85 backdrop-blur-xl border-b border-white/50 shadow-soft'
    : 'bg-gradient-to-b from-black/65 via-black/30 to-transparent text-white';

  const logoColor = isScrolled || !isHome ? 'text-vana-950' : 'text-white';
  const subtitleColor = isScrolled || !isHome ? 'text-timber-700' : 'text-sand-200';
  const linkColor = isScrolled || !isHome
    ? 'text-slate-700 hover:text-vana-700'
    : 'text-white/90 hover:text-white';

  // Active state checkers
  const isStayActive = ['/rooms', '/amenities'].some((p) => location.pathname.startsWith(p));
  const isExploreActive = ['/nearby-attractions', '/things-to-do', '/travel-guide'].some((p) =>
    location.pathname.startsWith(p)
  );

  return (
    <header className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${headerBg}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-vana-600 flex items-center justify-center text-white shadow-soft group-hover:bg-vana-700 transition-colors">
            <Compass className="w-5 h-5 text-sand-100" />
          </div>
          <div>
            <span className={`font-serif text-xl sm:text-2xl font-bold tracking-tight block leading-tight ${logoColor}`}>
              {RESORT_INFO.name.toUpperCase()}
            </span>
            <span className={`text-[10px] uppercase font-bold tracking-widest block ${subtitleColor}`}>
              {RESORT_INFO.subtitle}
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-7">
          {/* Home Link */}
          <Link
            to="/"
            className={`text-sm font-medium transition-colors relative py-1 ${linkColor} ${
              location.pathname === '/' ? 'font-bold underline underline-offset-8 decoration-vana-600 decoration-2' : ''
            }`}
          >
            Home
          </Link>

          {/* 1. STAY DROPDOWN */}
          <div
            ref={stayRef}
            className="relative"
            onMouseEnter={() => handleMouseEnter('stay')}
            onMouseLeave={handleMouseLeave}
          >
            <button
              type="button"
              onClick={() => {
                if (timeoutRef.current) clearTimeout(timeoutRef.current);
                setOpenDropdown(openDropdown === 'stay' ? null : 'stay');
              }}
              className={`flex items-center gap-1.5 text-sm font-medium transition-colors py-2 px-1 cursor-pointer ${linkColor} ${
                isStayActive ? 'font-bold underline underline-offset-8 decoration-vana-600 decoration-2' : ''
              }`}
              aria-expanded={openDropdown === 'stay'}
            >
              <span>Stay</span>
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform duration-200 ${
                  openDropdown === 'stay' ? 'rotate-180 text-vana-600' : ''
                }`}
              />
            </button>

            {/* Seamless wrapper starting right at top-full without gap */}
            <div
              className={`absolute top-full left-0 pt-2 w-64 z-50 transition-all duration-200 ease-out origin-top-left ${
                openDropdown === 'stay'
                  ? 'opacity-100 translate-y-0 visible pointer-events-auto'
                  : 'opacity-0 -translate-y-2 invisible pointer-events-none'
              }`}
              onMouseEnter={() => handleMouseEnter('stay')}
              onMouseLeave={handleMouseLeave}
            >
              <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl border border-sand-border p-2 space-y-1">
                <Link
                  to="/rooms"
                  onClick={() => setOpenDropdown(null)}
                  className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-sand-50 transition-colors group"
                >
                  <div className="w-8 h-8 rounded-lg bg-vana-50 border border-vana-200 flex items-center justify-center text-vana-700 shrink-0 group-hover:bg-vana-600 group-hover:text-white transition-colors">
                    <Bed className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-900 block group-hover:text-vana-800">
                      Rooms & Suites
                    </span>
                    <span className="text-[11px] text-slate-500 block leading-tight">
                      Explore verified room categories
                    </span>
                  </div>
                </Link>

                <Link
                  to="/amenities"
                  onClick={() => setOpenDropdown(null)}
                  className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-sand-50 transition-colors group"
                >
                  <div className="w-8 h-8 rounded-lg bg-vana-50 border border-vana-200 flex items-center justify-center text-vana-700 shrink-0 group-hover:bg-vana-600 group-hover:text-white transition-colors">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-900 block group-hover:text-vana-800">
                      Resort Amenities
                    </span>
                    <span className="text-[11px] text-slate-500 block leading-tight">
                      Couples, pool, & guest reviews
                    </span>
                  </div>
                </Link>
              </div>
            </div>
          </div>

          {/* 2. EXPLORE DROPDOWN */}
          <div
            ref={exploreRef}
            className="relative"
            onMouseEnter={() => handleMouseEnter('explore')}
            onMouseLeave={handleMouseLeave}
          >
            <button
              type="button"
              onClick={() => {
                if (timeoutRef.current) clearTimeout(timeoutRef.current);
                setOpenDropdown(openDropdown === 'explore' ? null : 'explore');
              }}
              className={`flex items-center gap-1.5 text-sm font-medium transition-colors py-2 px-1 cursor-pointer ${linkColor} ${
                isExploreActive ? 'font-bold underline underline-offset-8 decoration-vana-600 decoration-2' : ''
              }`}
              aria-expanded={openDropdown === 'explore'}
            >
              <span>Explore</span>
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform duration-200 ${
                  openDropdown === 'explore' ? 'rotate-180 text-amber-600' : ''
                }`}
              />
            </button>

            {/* Seamless wrapper starting right at top-full without gap */}
            <div
              className={`absolute top-full left-0 pt-2 w-72 z-50 transition-all duration-200 ease-out origin-top-left ${
                openDropdown === 'explore'
                  ? 'opacity-100 translate-y-0 visible pointer-events-auto'
                  : 'opacity-0 -translate-y-2 invisible pointer-events-none'
              }`}
              onMouseEnter={() => handleMouseEnter('explore')}
              onMouseLeave={handleMouseLeave}
            >
              <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl border border-sand-border p-2 space-y-1">
                <Link
                  to="/nearby-attractions"
                  onClick={() => setOpenDropdown(null)}
                  className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-sand-50 transition-colors group"
                >
                  <div className="w-8 h-8 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700 shrink-0 group-hover:bg-amber-600 group-hover:text-white transition-colors">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-900 block group-hover:text-amber-800">
                      Nearby Attractions
                    </span>
                    <span className="text-[11px] text-slate-500 block leading-tight">
                      11 destinations with hours & prices
                    </span>
                  </div>
                </Link>

                <Link
                  to="/things-to-do"
                  onClick={() => setOpenDropdown(null)}
                  className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-sand-50 transition-colors group"
                >
                  <div className="w-8 h-8 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700 shrink-0 group-hover:bg-amber-600 group-hover:text-white transition-colors">
                    <Sun className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-900 block group-hover:text-amber-800">
                      Things to Do
                    </span>
                    <span className="text-[11px] text-slate-500 block leading-tight">
                      Plantation walks, Dhimsa dance & treks
                    </span>
                  </div>
                </Link>

                <Link
                  to="/travel-guide"
                  onClick={() => setOpenDropdown(null)}
                  className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-sand-50 transition-colors group"
                >
                  <div className="w-8 h-8 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700 shrink-0 group-hover:bg-amber-600 group-hover:text-white transition-colors">
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-900 block group-hover:text-amber-800">
                      Araku Travel Guide
                    </span>
                    <span className="text-[11px] text-slate-500 block leading-tight">
                      Vistadome train, weather & tips
                    </span>
                  </div>
                </Link>
              </div>
            </div>
          </div>

          {/* Regular Nav Links */}
          <Link
            to="/gallery"
            className={`text-sm font-medium transition-colors relative py-1 ${linkColor} ${
              location.pathname === '/gallery' ? 'font-bold underline underline-offset-8 decoration-vana-600 decoration-2' : ''
            }`}
          >
            Gallery
          </Link>

          <Link
            to="/about"
            className={`text-sm font-medium transition-colors relative py-1 ${linkColor} ${
              location.pathname === '/about' ? 'font-bold underline underline-offset-8 decoration-vana-600 decoration-2' : ''
            }`}
          >
            About
          </Link>

          <Link
            to="/location"
            className={`text-sm font-medium transition-colors relative py-1 ${linkColor} ${
              location.pathname === '/location' ? 'font-bold underline underline-offset-8 decoration-vana-600 decoration-2' : ''
            }`}
          >
            Location
          </Link>

          <Link
            to="/contact"
            className={`text-sm font-medium transition-colors relative py-1 ${linkColor} ${
              location.pathname === '/contact' ? 'font-bold underline underline-offset-8 decoration-vana-600 decoration-2' : ''
            }`}
          >
            Contact
          </Link>
        </nav>

        {/* Action Controls & CTA */}
        <div className="hidden lg:flex items-center gap-3">
          {/* Staff Authentication / Admin Desk */}
          {role !== 'management' ? (
            <button
              type="button"
              onClick={() => openLoginModal()}
              className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl border border-slate-300/40 hover:bg-black/5 transition-all duration-200 ${linkColor}`}
              title="Resort Staff & Management Sign In"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
              <span>Staff Login</span>
            </button>
          ) : (
            <div className="flex items-center gap-1 bg-amber-500/10 border border-amber-500/30 rounded-xl px-2.5 py-1">
              <Link
                to="/admin"
                className="flex items-center gap-1.5 text-xs font-bold text-amber-700 hover:text-amber-900 transition-colors"
                title="Open Management Dashboard"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
                <span>Admin Desk</span>
              </Link>
              <button
                type="button"
                onClick={logout}
                title="Sign Out of Management"
                className="p-1 text-slate-400 hover:text-rose-600 transition-colors ml-1"
                aria-label="Sign Out"
              >
                <LogOut className="w-3 h-3" />
              </button>
            </div>
          )}

          {/* Primary Book CTA */}
          <Link to="/booking">
            <Button size="sm" variant="primary">
              Book Your Stay
            </Button>
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className={`lg:hidden p-2 rounded-lg focus:outline-none ${isScrolled || !isHome ? 'text-slate-800' : 'text-white'}`}
          aria-label="Toggle Menu"
        >
          {isMobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {isMobileOpen && (
        <div className="lg:hidden bg-sand-base border-b border-sand-border px-6 py-6 shadow-xl space-y-4 max-h-[85vh] overflow-y-auto">
          <nav className="flex flex-col space-y-2">
            <Link
              to="/"
              className={`text-base font-semibold py-1.5 transition-colors ${
                location.pathname === '/' ? 'text-vana-700 font-bold' : 'text-slate-800'
              }`}
            >
              Home
            </Link>

            {/* Mobile Stay Accordion */}
            <div className="border-y border-sand-border/70 py-2 space-y-1.5">
              <button
                type="button"
                onClick={() => setMobileExpanded((prev) => ({ ...prev, stay: !prev.stay }))}
                className="w-full flex items-center justify-between text-base font-semibold text-slate-800 py-1"
              >
                <span className="flex items-center gap-2">
                  <Bed className="w-4 h-4 text-vana-700" />
                  <span>Stay</span>
                </span>
                <ChevronDown className={`w-4 h-4 transition-transform ${mobileExpanded.stay ? 'rotate-180' : ''}`} />
              </button>

              {mobileExpanded.stay && (
                <div className="pl-6 space-y-1.5 border-l-2 border-vana-300 ml-2 py-1">
                  <Link
                    to="/rooms"
                    className={`block text-sm py-1 ${
                      location.pathname === '/rooms' ? 'text-vana-700 font-bold' : 'text-slate-600'
                    }`}
                  >
                    Rooms & Suites
                  </Link>
                  <Link
                    to="/amenities"
                    className={`block text-sm py-1 ${
                      location.pathname === '/amenities' ? 'text-vana-700 font-bold' : 'text-slate-600'
                    }`}
                  >
                    Resort Amenities
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Explore Accordion */}
            <div className="border-b border-sand-border/70 pb-2 space-y-1.5">
              <button
                type="button"
                onClick={() => setMobileExpanded((prev) => ({ ...prev, explore: !prev.explore }))}
                className="w-full flex items-center justify-between text-base font-semibold text-slate-800 py-1"
              >
                <span className="flex items-center gap-2">
                  <Compass className="w-4 h-4 text-amber-700" />
                  <span>Explore</span>
                </span>
                <ChevronDown className={`w-4 h-4 transition-transform ${mobileExpanded.explore ? 'rotate-180' : ''}`} />
              </button>

              {mobileExpanded.explore && (
                <div className="pl-6 space-y-1.5 border-l-2 border-amber-300 ml-2 py-1">
                  <Link
                    to="/nearby-attractions"
                    className={`block text-sm py-1 ${
                      location.pathname === '/nearby-attractions' ? 'text-amber-800 font-bold' : 'text-slate-600'
                    }`}
                  >
                    Nearby Attractions (11 Spots)
                  </Link>
                  <Link
                    to="/things-to-do"
                    className={`block text-sm py-1 ${
                      location.pathname === '/things-to-do' ? 'text-amber-800 font-bold' : 'text-slate-600'
                    }`}
                  >
                    Things to Do
                  </Link>
                  <Link
                    to="/travel-guide"
                    className={`block text-sm py-1 ${
                      location.pathname === '/travel-guide' ? 'text-amber-800 font-bold' : 'text-slate-600'
                    }`}
                  >
                    Araku Travel Guide
                  </Link>
                </div>
              )}
            </div>

            <Link
              to="/gallery"
              className={`text-base font-semibold py-1.5 transition-colors ${
                location.pathname === '/gallery' ? 'text-vana-700 font-bold' : 'text-slate-800'
              }`}
            >
              Gallery
            </Link>

            <Link
              to="/about"
              className={`text-base font-semibold py-1.5 transition-colors ${
                location.pathname === '/about' ? 'text-vana-700 font-bold' : 'text-slate-800'
              }`}
            >
              About
            </Link>

            <Link
              to="/location"
              className={`text-base font-semibold py-1.5 transition-colors ${
                location.pathname === '/location' ? 'text-vana-700 font-bold' : 'text-slate-800'
              }`}
            >
              Location
            </Link>

            <Link
              to="/contact"
              className={`text-base font-semibold py-1.5 transition-colors ${
                location.pathname === '/contact' ? 'text-vana-700 font-bold' : 'text-slate-800'
              }`}
            >
              Contact
            </Link>
          </nav>

          <div className="pt-3 border-t border-sand-border space-y-2.5">
            {/* Mobile Auth Button */}
            {role !== 'management' ? (
              <button
                type="button"
                onClick={() => {
                  setIsMobileOpen(false);
                  openLoginModal();
                }}
                className="w-full flex items-center justify-center gap-2 text-xs font-bold py-2.5 px-3 rounded-xl bg-amber-50/80 border border-amber-200 text-amber-900 shadow-sm hover:bg-amber-100 transition-colors"
              >
                <ShieldCheck className="w-4 h-4 text-amber-600" />
                <span>Staff & Management Login</span>
              </button>
            ) : (
              <div className="flex items-center justify-between p-3 bg-amber-50 rounded-xl border border-amber-200">
                <Link
                  to="/admin"
                  onClick={() => setIsMobileOpen(false)}
                  className="flex items-center gap-2 text-sm font-bold text-amber-900"
                >
                  <ShieldCheck className="w-4 h-4 text-amber-700" />
                  <span>Open Admin Dashboard</span>
                </Link>
                <button
                  type="button"
                  onClick={logout}
                  className="text-xs font-semibold text-rose-600 hover:underline"
                >
                  Sign Out
                </button>
              </div>
            )}

            <Link to="/booking" className="block w-full">
              <Button size="md" variant="primary" className="w-full">
                Book Your Stay
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
