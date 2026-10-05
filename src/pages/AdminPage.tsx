/**
 * @file AdminPage.tsx
 * @description Comprehensive administration dashboard for Vana Resort Araku.
 * Supports Overview KPI stats, Bookings, Contacts, Room Management, Attractions,
 * Gallery, Visitor Analytics, Resort Settings, and Google Hotel Prices.
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  CheckCircle2,
  XCircle,
  Clock,
  Mail,
  Phone,
  MessageSquare,
  MessageCircle,
  Search,
  RefreshCw,
  Calendar,
  X,
  Trash2,
  ShieldCheck,
  Lock,
  User,
  LogOut,
  Globe,
  LayoutDashboard,
  BedDouble,
  Compass,
  Image as ImageIcon,
  BarChart3,
  Settings as SettingsIcon,
  Plus,
  TrendingUp,
  Monitor,
  Save,
} from 'lucide-react';
import type { BookingRecord } from '../types/booking';
import type { ContactRecord } from '../types/contact';
import { apiService } from '../services/api';
import { formatINR } from '../hooks/useBookingCalculator';
import { Button } from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';
import { GoogleHotelsManager } from '../components/admin/GoogleHotelsManager';

type AdminTab =
  | 'overview'
  | 'bookings'
  | 'contacts'
  | 'rooms'
  | 'attractions'
  | 'gallery'
  | 'visitors'
  | 'settings'
  | 'googleHotels';

type BookingFilter = 'all' | 'pending' | 'confirmed' | 'cancelled';
type ContactFilter = 'all' | 'unread' | 'read' | 'responded';

export const AdminPage: React.FC = () => {
  const { role, user, loginManagement, logout } = useAuth();
  const [gateUsername, setGateUsername] = useState('admin');
  const [gatePassword, setGatePassword] = useState('');
  const [gateError, setGateError] = useState('');
  const [gateLoading, setGateLoading] = useState(false);

  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [isLoading, setIsLoading] = useState(false);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  // Data states
  const [dashboardStats, setDashboardStats] = useState<any>(null);
  const [bookings, setBookings] = useState<BookingRecord[]>([]);
  const [contacts, setContacts] = useState<ContactRecord[]>([]);
  const [rooms, setRooms] = useState<any[]>([]);
  const [attractions, setAttractions] = useState<any[]>([]);
  const [gallery, setGallery] = useState<any[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);
  const [_settings, setSettings] = useState<Record<string, string>>({});

  // Filter & Search states
  const [bookingFilter, setBookingFilter] = useState<BookingFilter>('all');
  const [contactFilter, setContactFilter] = useState<ContactFilter>('all');
  const [galleryCategoryFilter, setGalleryCategoryFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Selected records for inspection / edit modals
  const [selectedBooking, setSelectedBooking] = useState<BookingRecord | null>(null);
  const [selectedContact, setSelectedContact] = useState<ContactRecord | null>(null);
  const [isAddGalleryOpen, setIsAddGalleryOpen] = useState(false);
  const [newGalleryItem, setNewGalleryItem] = useState({
    title: '',
    category: 'resort',
    image_path: '',
    caption: '',
  });

  const [isAddAttractionOpen, setIsAddAttractionOpen] = useState(false);
  const [newAttraction, setNewAttraction] = useState({
    name: '',
    slug: '',
    category: 'nature',
    distance: '5 km',
    short_description: '',
    image: '',
    highlights: '',
  });

  // Settings form state
  const [settingsForm, setSettingsForm] = useState<Record<string, string>>({});
  const [isSavingSettings, setIsSavingSettings] = useState(false);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [statsRes, bRes, cRes, rRes, attRes, galRes, analRes, setRes] =
        await Promise.allSettled([
          apiService.getDashboardStats(),
          apiService.getBookings(),
          apiService.getContactMessages(),
          apiService.getRooms(true),
          apiService.getAttractions(true),
          apiService.getGallery('all', true),
          apiService.getAnalyticsDashboard(),
          apiService.getSettings(),
        ]);

      if (statsRes.status === 'fulfilled') setDashboardStats(statsRes.value);
      if (bRes.status === 'fulfilled') setBookings(bRes.value || []);
      if (cRes.status === 'fulfilled') setContacts(cRes.value || []);
      if (rRes.status === 'fulfilled') setRooms(rRes.value || []);
      if (attRes.status === 'fulfilled') setAttractions(attRes.value || []);
      if (galRes.status === 'fulfilled') setGallery(galRes.value || []);
      if (analRes.status === 'fulfilled') setAnalytics(analRes.value || null);
      if (setRes.status === 'fulfilled') {
        const s = setRes.value || {};
        setSettings(s);
        setSettingsForm(s);
      }
    } catch (e) {
      console.error('Error loading admin data:', e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (role === 'management') {
      loadData();
    }
  }, [role, loadData]);

  const notifyAction = (msg: string) => {
    setActionMessage(msg);
    setTimeout(() => setActionMessage(null), 3500);
  };

  // Booking handlers
  const handleUpdateBookingStatus = async (id: string, status: BookingRecord['status']) => {
    try {
      await apiService.updateBookingStatus(id, status);
      if (selectedBooking && selectedBooking.id === id) {
        setSelectedBooking({ ...selectedBooking, status });
      }
      notifyAction(`Booking ${id} status updated to ${status}.`);
      loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to update booking status.');
    }
  };

  const handleDeleteBooking = async (id: string) => {
    if (window.confirm(`Are you sure you want to delete reservation ${id}?`)) {
      try {
        await apiService.deleteBooking(id);
        setSelectedBooking(null);
        notifyAction(`Booking ${id} has been permanently removed.`);
        loadData();
      } catch (err: any) {
        alert(err.message || 'Failed to delete booking.');
      }
    }
  };

  // Contact handlers
  const handleUpdateContactStatus = async (
    id: string | number,
    status: ContactRecord['status']
  ) => {
    try {
      await apiService.updateContactStatus(id, status);
      if (selectedContact && selectedContact.id === id) {
        setSelectedContact({ ...selectedContact, status });
      }
      notifyAction(`Message ${id} marked as ${status}.`);
      loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to update message status.');
    }
  };

  const handleDeleteContact = async (id: string | number) => {
    if (window.confirm(`Are you sure you want to delete inquiry message ${id}?`)) {
      try {
        await apiService.deleteContactMessage(id);
        setSelectedContact(null);
        notifyAction(`Message ${id} removed.`);
        loadData();
      } catch (err: any) {
        alert(err.message || 'Failed to delete contact inquiry.');
      }
    }
  };

  // Room status toggle
  const handleToggleRoomStatus = async (room: any) => {
    const newStatus: 'active' | 'inactive' = room.status === 'active' ? 'inactive' : 'active';
    try {
      await apiService.updateRoom(room.databaseId || room.id, {
        status: newStatus,
      });
      notifyAction(`Room "${room.name}" is now ${newStatus}.`);
      loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to toggle room status.');
    }
  };

  // Attraction handlers
  const handleToggleAttractionStatus = async (item: any) => {
    const newStatus = item.status === 'active' ? 'inactive' : 'active';
    try {
      await apiService.updateAttraction(item.databaseId || item.id, {
        status: newStatus,
      });
      notifyAction(`Attraction "${item.name}" is now ${newStatus}.`);
      loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to update attraction status.');
    }
  };

  const handleDeleteAttraction = async (item: any) => {
    if (window.confirm(`Delete attraction "${item.name}"?`)) {
      try {
        await apiService.deleteAttraction(item.databaseId || item.id);
        notifyAction(`Attraction "${item.name}" deleted.`);
        loadData();
      } catch (err: any) {
        alert(err.message || 'Failed to delete attraction.');
      }
    }
  };

  const handleCreateAttraction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAttraction.name.trim()) return;
    try {
      const slug =
        newAttraction.slug.trim() ||
        newAttraction.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      await apiService.createAttraction({
        ...newAttraction,
        slug,
        highlights: newAttraction.highlights
          ? newAttraction.highlights.split(',').map((s) => s.trim())
          : [],
      });
      setIsAddAttractionOpen(false);
      setNewAttraction({
        name: '',
        slug: '',
        category: 'nature',
        distance: '5 km',
        short_description: '',
        image: '',
        highlights: '',
      });
      notifyAction('New attraction added successfully!');
      loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to create attraction.');
    }
  };

  // Gallery handlers
  const handleDeleteGallery = async (id: number | string) => {
    if (window.confirm('Delete this gallery photo?')) {
      try {
        await apiService.deleteGalleryItem(id);
        notifyAction('Gallery photo deleted.');
        loadData();
      } catch (err: any) {
        alert(err.message || 'Failed to delete gallery item.');
      }
    }
  };

  const handleCreateGallery = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGalleryItem.image_path.trim()) {
      alert('Please enter an image path or URL.');
      return;
    }
    try {
      await apiService.createGalleryItem({
        title: newGalleryItem.title || 'Resort Photo',
        category: newGalleryItem.category,
        image_path: newGalleryItem.image_path,
        caption: newGalleryItem.caption,
      });
      setIsAddGalleryOpen(false);
      setNewGalleryItem({ title: '', category: 'resort', image_path: '', caption: '' });
      notifyAction('Photo added to resort gallery!');
      loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to add gallery photo.');
    }
  };

  // Settings Save handler
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingSettings(true);
    try {
      await apiService.updateSettings(settingsForm);
      setSettings(settingsForm);
      notifyAction('Resort operational settings saved to database.');
    } catch (err: any) {
      alert(err.message || 'Failed to update resort settings.');
    } finally {
      setIsSavingSettings(false);
    }
  };

  // Filtered lists
  const filteredBookings = bookings.filter((b) => {
    const matchesFilter = bookingFilter === 'all' || b.status === bookingFilter;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      b.fullName.toLowerCase().includes(q) ||
      b.id.toLowerCase().includes(q) ||
      b.phone.includes(q) ||
      b.roomName.toLowerCase().includes(q);
    return matchesFilter && matchesSearch;
  });

  const filteredContacts = contacts.filter((c) => {
    const matchesFilter = contactFilter === 'all' || c.status === contactFilter;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      c.fullName.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q) ||
      c.subject.toLowerCase().includes(q) ||
      c.message.toLowerCase().includes(q);
    return matchesFilter && matchesSearch;
  });

  const filteredGallery = gallery.filter((g) => {
    if (galleryCategoryFilter === 'all') return true;
    return g.category === galleryCategoryFilter;
  });

  // RESTRICTED ACCESS GATE: Visible if not logged in as management
  if (role !== 'management') {
    return (
      <div className="pt-36 pb-24 min-h-[85vh] flex items-center justify-center px-4 sm:px-6">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-sand-border shadow-soft space-y-6">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-700 flex items-center justify-center mx-auto shadow-inner">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <span className="text-[11px] uppercase font-bold tracking-widest text-amber-700 bg-amber-100 px-3 py-0.5 rounded-full border border-amber-200">
              Restricted Staff Access
            </span>
            <h2 className="font-serif text-2xl font-bold text-slate-900">
              Management Portal
            </h2>
            <p className="text-xs text-slate-600">
              Sign in with resort administration credentials to access reservations, room inventories, guest contacts, and analytics.
            </p>
          </div>

          {gateError && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
              <XCircle className="w-4 h-4 shrink-0" />
              <span>{gateError}</span>
            </div>
          )}

          <form
            onSubmit={async (e) => {
              e.preventDefault();
              setGateError('');
              setGateLoading(true);
              try {
                const res = await loginManagement(gatePassword, gateUsername);
                if (!res.success) {
                  setGateError(res.message || 'Invalid username or password.');
                }
              } catch (err: any) {
                setGateError(err?.message || 'Login failed. Please verify MySQL connection.');
              } finally {
                setGateLoading(false);
              }
            }}
            className="space-y-4"
          >
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Admin Username
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={gateUsername}
                  onChange={(e) => setGateUsername(e.target.value)}
                  placeholder="admin"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Security Key / Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={gatePassword}
                  onChange={(e) => setGatePassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600"
                />
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={gateLoading}
              className="w-full justify-center bg-amber-700 hover:bg-amber-800 text-white"
            >
              <Lock className="w-4 h-4" />
              <span>Log In to Admin Dashboard</span>
            </Button>
          </form>

          <div className="pt-2 border-t border-slate-100 flex flex-col items-center gap-3">
            <button
              type="button"
              onClick={() => {
                setGateUsername('admin');
                setGatePassword('Admin@Vana2026!');
                setGateError('');
              }}
              className="text-xs text-amber-800 hover:text-amber-950 font-medium hover:underline"
            >
              Auto-fill Default Credentials (admin / Admin@Vana2026!)
            </button>
            <Link to="/" className="text-xs text-slate-500 hover:text-slate-800">
              ← Return to Resort Homepage
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // KPI Calculations
  const totalBookingsCount = dashboardStats?.bookings?.total ?? bookings.length;
  const pendingBookingsCount =
    dashboardStats?.bookings?.pending ?? bookings.filter((b) => b.status === 'pending').length;
  const confirmedBookingsCount =
    dashboardStats?.bookings?.confirmed ?? bookings.filter((b) => b.status === 'confirmed').length;
  const unreadContactsCount =
    dashboardStats?.contacts?.unread ?? contacts.filter((c) => c.status === 'unread').length;
  const totalRevenue =
    dashboardStats?.bookings?.revenue ??
    bookings
      .filter((b) => b.status === 'confirmed')
      .reduce((sum, b) => sum + (b.estimatedPrice || 0), 0);

  return (
    <div className="pt-28 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Action Notification Toast */}
      {actionMessage && (
        <div className="fixed top-24 right-6 z-50 bg-vana-800 text-white px-5 py-3 rounded-2xl shadow-elevated text-xs font-semibold flex items-center gap-2 border border-vana-600 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{actionMessage}</span>
        </div>
      )}

      {/* Management Active Session Top Banner */}
      <div className="bg-amber-500/10 border border-amber-500/30 p-3.5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5 text-amber-900 font-semibold">
          <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0" />
          <span>
            Active Staff Session: <strong>{user?.name || user?.username || 'Administrator'}</strong>
          </span>
          <span className="hidden md:inline text-amber-700/60">• Connected to MySQL (vana_resort)</span>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/" className="text-slate-600 hover:text-slate-900 underline font-medium">
            View Live Website
          </Link>
          <button
            type="button"
            onClick={logout}
            className="flex items-center gap-1.5 text-rose-700 hover:text-rose-900 font-bold bg-white/70 border border-rose-200 px-3 py-1 rounded-lg shadow-xs hover:bg-rose-50 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Header Title & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="text-xs uppercase font-bold tracking-widest text-vana-800 bg-vana-100 px-3.5 py-1 rounded-full border border-vana-200">
            Resort Operations
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-slate-900 mt-2">
            Staff Administration Desk
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Real-time management for reservations, guest inquiries, room catalogs, attractions, and analytics.
          </p>
        </div>

        <Button
          size="sm"
          variant="outline"
          onClick={loadData}
          isLoading={isLoading}
          icon={<RefreshCw className="w-3.5 h-3.5" />}
        >
          Refresh Data
        </Button>
      </div>

      {/* Top Level Navigation Tabs */}
      <div className="glass-card rounded-3xl p-3 flex flex-wrap items-center gap-1.5 shadow-card overflow-x-auto">
        <button
          onClick={() => {
            setActiveTab('overview');
            setSearchQuery('');
          }}
          className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeTab === 'overview'
              ? 'bg-vana-700 text-white shadow-soft'
              : 'text-slate-700 hover:bg-white/80'
          }`}
        >
          <LayoutDashboard className="w-4 h-4" />
          <span>Overview</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('bookings');
            setSearchQuery('');
          }}
          className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeTab === 'bookings'
              ? 'bg-vana-700 text-white shadow-soft'
              : 'text-slate-700 hover:bg-white/80'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Bookings</span>
          <span className="ml-1 px-2 py-0.2 rounded-full text-[10px] bg-white/20">
            {bookings.length}
          </span>
        </button>

        <button
          onClick={() => {
            setActiveTab('contacts');
            setSearchQuery('');
          }}
          className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeTab === 'contacts'
              ? 'bg-vana-700 text-white shadow-soft'
              : 'text-slate-700 hover:bg-white/80'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>Contacts</span>
          {unreadContactsCount > 0 && (
            <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-amber-500 text-white">
              {unreadContactsCount}
            </span>
          )}
        </button>

        <button
          onClick={() => {
            setActiveTab('rooms');
            setSearchQuery('');
          }}
          className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeTab === 'rooms'
              ? 'bg-vana-700 text-white shadow-soft'
              : 'text-slate-700 hover:bg-white/80'
          }`}
        >
          <BedDouble className="w-4 h-4" />
          <span>Rooms</span>
          <span className="ml-1 px-2 py-0.2 rounded-full text-[10px] bg-slate-200 text-slate-800">
            {rooms.length}
          </span>
        </button>

        <button
          onClick={() => {
            setActiveTab('attractions');
            setSearchQuery('');
          }}
          className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeTab === 'attractions'
              ? 'bg-vana-700 text-white shadow-soft'
              : 'text-slate-700 hover:bg-white/80'
          }`}
        >
          <Compass className="w-4 h-4" />
          <span>Attractions</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('gallery');
            setSearchQuery('');
          }}
          className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeTab === 'gallery'
              ? 'bg-vana-700 text-white shadow-soft'
              : 'text-slate-700 hover:bg-white/80'
          }`}
        >
          <ImageIcon className="w-4 h-4" />
          <span>Gallery</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('visitors');
            setSearchQuery('');
          }}
          className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeTab === 'visitors'
              ? 'bg-vana-700 text-white shadow-soft'
              : 'text-slate-700 hover:bg-white/80'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Visitors & Traffic</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('settings');
            setSearchQuery('');
          }}
          className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeTab === 'settings'
              ? 'bg-vana-700 text-white shadow-soft'
              : 'text-slate-700 hover:bg-white/80'
          }`}
        >
          <SettingsIcon className="w-4 h-4" />
          <span>Settings</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('googleHotels');
            setSearchQuery('');
          }}
          className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeTab === 'googleHotels'
              ? 'bg-blue-600 text-white shadow-soft'
              : 'text-blue-800 hover:bg-blue-50'
          }`}
        >
          <Globe className="w-4 h-4 text-blue-500" />
          <span>Google Hotels API</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: OVERVIEW DASHBOARD */}
      {/* ========================================================================= */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="glass-card p-5 rounded-3xl space-y-1">
              <span className="text-xs uppercase font-bold text-slate-500 block">Total Bookings</span>
              <strong className="text-2xl font-serif text-slate-900 block">{totalBookingsCount}</strong>
              <span className="text-[11px] text-slate-400">All submitted reservations</span>
            </div>

            <div className="glass-card p-5 rounded-3xl space-y-1 border-amber-200/80 bg-amber-50/40">
              <span className="text-xs uppercase font-bold text-amber-700 flex items-center justify-between">
                <span>Pending Review</span>
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
              </span>
              <strong className="text-2xl font-serif text-amber-800 block">{pendingBookingsCount}</strong>
              <span className="text-[11px] text-amber-700/80">Requires staff attention</span>
            </div>

            <div className="glass-card p-5 rounded-3xl space-y-1 border-emerald-200/80 bg-emerald-50/40">
              <span className="text-xs uppercase font-bold text-emerald-800 block">Confirmed Revenue</span>
              <strong className="text-2xl font-serif text-emerald-900 block">
                {totalRevenue ? formatINR(totalRevenue) : '₹0'}
              </strong>
              <span className="text-[11px] text-emerald-700/80">{confirmedBookingsCount} confirmed stays</span>
            </div>

            <div className="glass-card p-5 rounded-3xl space-y-1 border-indigo-200/80 bg-indigo-50/40">
              <span className="text-xs uppercase font-bold text-indigo-800 flex items-center justify-between">
                <span>Inquiries</span>
                {unreadContactsCount > 0 && (
                  <span className="text-[10px] font-bold bg-indigo-600 text-white px-2 py-0.5 rounded-full">
                    {unreadContactsCount} New
                  </span>
                )}
              </span>
              <strong className="text-2xl font-serif text-indigo-900 block">{contacts.length}</strong>
              <span className="text-[11px] text-indigo-700/80">{unreadContactsCount} unread messages</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div
              onClick={() => setActiveTab('bookings')}
              className="p-5 rounded-3xl bg-white border border-sand-border shadow-soft hover:shadow-elevated transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-vana-100 text-vana-700 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">Manage Bookings</h4>
                  <p className="text-xs text-slate-500">Confirm, review or cancel reservation requests</p>
                </div>
              </div>
            </div>

            <div
              onClick={() => setActiveTab('contacts')}
              className="p-5 rounded-3xl bg-white border border-sand-border shadow-soft hover:shadow-elevated transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">Guest Inquiries</h4>
                  <p className="text-xs text-slate-500">Read messages & reply directly via WhatsApp</p>
                </div>
              </div>
            </div>

            <div
              onClick={() => setActiveTab('rooms')}
              className="p-5 rounded-3xl bg-white border border-sand-border shadow-soft hover:shadow-elevated transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <BedDouble className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">Room Inventory</h4>
                  <p className="text-xs text-slate-500">Control active status, tariffs & guest capacities</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-3xl border border-sand-border shadow-soft p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-sand-border pb-3">
                <h3 className="font-serif text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-vana-700" />
                  <span>Recent Reservations</span>
                </h3>
                <button
                  onClick={() => setActiveTab('bookings')}
                  className="text-xs font-semibold text-vana-700 hover:underline"
                >
                  View All ({bookings.length}) →
                </button>
              </div>

              <div className="divide-y divide-sand-border/70">
                {bookings.slice(0, 5).map((b) => (
                  <div
                    key={b.id}
                    onClick={() => setSelectedBooking(b)}
                    className="py-3 flex items-center justify-between hover:bg-sand-50/80 px-2 rounded-xl cursor-pointer transition-colors"
                  >
                    <div>
                      <strong className="block text-xs text-slate-900">{b.fullName}</strong>
                      <span className="text-[11px] text-slate-500">
                        {b.roomName} • {b.nights}n ({b.checkIn})
                      </span>
                    </div>
                    <div className="text-right">
                      <span
                        className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                          b.status === 'confirmed'
                            ? 'bg-emerald-100 text-emerald-800'
                            : b.status === 'cancelled'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {b.status}
                      </span>
                      <strong className="block text-xs text-slate-800 mt-0.5">
                        {b.estimatedPrice ? formatINR(b.estimatedPrice) : 'On Request'}
                      </strong>
                    </div>
                  </div>
                ))}
                {bookings.length === 0 && (
                  <p className="text-xs text-slate-400 py-6 text-center">No bookings recorded yet.</p>
                )}
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-sand-border shadow-soft p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-sand-border pb-3">
                <h3 className="font-serif text-lg font-bold text-slate-900 flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-indigo-700" />
                  <span>Recent Traveler Messages</span>
                </h3>
                <button
                  onClick={() => setActiveTab('contacts')}
                  className="text-xs font-semibold text-indigo-700 hover:underline"
                >
                  View All ({contacts.length}) →
                </button>
              </div>

              <div className="divide-y divide-sand-border/70">
                {contacts.slice(0, 5).map((c) => (
                  <div
                    key={c.id}
                    onClick={() => setSelectedContact(c)}
                    className="py-3 flex items-center justify-between hover:bg-sand-50/80 px-2 rounded-xl cursor-pointer transition-colors"
                  >
                    <div className="max-w-[70%]">
                      <strong className="block text-xs text-slate-900 truncate">{c.fullName}</strong>
                      <span className="text-[11px] text-slate-500 truncate block">
                        {c.subject}: {c.message}
                      </span>
                    </div>
                    <span
                      className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                        c.status === 'unread'
                          ? 'bg-amber-100 text-amber-800'
                          : c.status === 'responded'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {c.status}
                    </span>
                  </div>
                ))}
                {contacts.length === 0 && (
                  <p className="text-xs text-slate-400 py-6 text-center">No messages received yet.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: ROOM BOOKINGS */}
      {/* ========================================================================= */}
      {activeTab === 'bookings' && (
        <div className="glass-card rounded-3xl overflow-hidden shadow-card space-y-0">
          <div className="p-5 border-b border-sand-border/80 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-1.5">
              {(['all', 'pending', 'confirmed', 'cancelled'] as BookingFilter[]).map((f) => (
                <button
                  key={f}
                  onClick={() => setBookingFilter(f)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all ${
                    bookingFilter === f
                      ? 'bg-vana-700 text-white shadow-sm'
                      : 'bg-white/60 text-slate-600 hover:bg-white'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>

            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search guest, ref, phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-xs bg-white/80 border border-sand-border rounded-xl focus:outline-none focus:ring-2 focus:ring-vana-500"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-sand-surface/60 uppercase font-bold tracking-wider text-slate-600 border-b border-sand-border">
                <tr>
                  <th className="p-4">Ref #</th>
                  <th className="p-4">Guest Information</th>
                  <th className="p-4">Room Category</th>
                  <th className="p-4">Dates & Nights</th>
                  <th className="p-4">Estimated</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-center">Quick Action</th>
                  <th className="p-4 text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sand-border/60">
                {filteredBookings.length > 0 ? (
                  filteredBookings.map((b) => (
                    <tr
                      key={b.id}
                      className="hover:bg-sand-50/70 transition-colors cursor-pointer group"
                      onClick={() => setSelectedBooking(b)}
                    >
                      <td className="p-4 font-mono font-bold text-slate-900">{b.id}</td>
                      <td className="p-4">
                        <strong className="block text-slate-900 group-hover:text-vana-700 transition-colors">
                          {b.fullName}
                        </strong>
                        <span className="text-slate-500">{b.phone}</span>
                      </td>
                      <td className="p-4 font-medium text-slate-900">{b.roomName}</td>
                      <td className="p-4">
                        <div className="font-medium text-slate-800">
                          {b.checkIn} → {b.checkOut}
                        </div>
                        <span className="text-slate-500">
                          {b.nights} Nights • {b.roomsCount} Room
                        </span>
                      </td>
                      <td className="p-4 font-bold text-vana-900">
                        {b.estimatedPrice ? formatINR(b.estimatedPrice) : 'On Request'}
                      </td>
                      <td className="p-4">
                        <span
                          className={`inline-block px-2.5 py-1 rounded-full font-bold uppercase text-[10px] ${
                            b.status === 'confirmed'
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                              : b.status === 'cancelled'
                              ? 'bg-rose-100 text-rose-800 border border-rose-200'
                              : 'bg-amber-100 text-amber-800 border border-amber-200'
                          }`}
                        >
                          {b.status}
                        </span>
                      </td>
                      <td className="p-4 text-center" onClick={(e) => e.stopPropagation()}>
                        <div className="inline-flex items-center gap-1 bg-white/80 p-1 rounded-xl border border-sand-border">
                          <button
                            onClick={() => handleUpdateBookingStatus(b.id, 'confirmed')}
                            className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-colors ${
                              b.status === 'confirmed'
                                ? 'bg-emerald-600 text-white'
                                : 'text-emerald-700 hover:bg-emerald-50'
                            }`}
                          >
                            Confirm
                          </button>
                          <button
                            onClick={() => handleUpdateBookingStatus(b.id, 'pending')}
                            className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-colors ${
                              b.status === 'pending'
                                ? 'bg-amber-500 text-white'
                                : 'text-amber-700 hover:bg-amber-50'
                            }`}
                          >
                            Pending
                          </button>
                          <button
                            onClick={() => handleUpdateBookingStatus(b.id, 'cancelled')}
                            className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-colors ${
                              b.status === 'cancelled'
                                ? 'bg-rose-600 text-white'
                                : 'text-rose-700 hover:bg-rose-50'
                            }`}
                          >
                            Cancel
                          </button>
                        </div>
                      </td>
                      <td className="p-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => setSelectedBooking(b)}
                          className="px-3 py-1.5 bg-vana-50 hover:bg-vana-100 text-vana-800 font-semibold rounded-lg border border-vana-200 transition-colors"
                        >
                          Inspect
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="p-12 text-center text-slate-500">
                      No reservations found matching your filter.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: CONTACT MESSAGES */}
      {/* ========================================================================= */}
      {activeTab === 'contacts' && (
        <div className="glass-card rounded-3xl overflow-hidden shadow-card">
          <div className="p-5 border-b border-sand-border/80 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-1.5">
              {(['all', 'unread', 'read', 'responded'] as ContactFilter[]).map((f) => (
                <button
                  key={f}
                  onClick={() => setContactFilter(f)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all ${
                    contactFilter === f
                      ? 'bg-vana-700 text-white shadow-sm'
                      : 'bg-white/60 text-slate-600 hover:bg-white'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>

            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search name, subject, message..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-xs bg-white/80 border border-sand-border rounded-xl focus:outline-none focus:ring-2 focus:ring-vana-500"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-sand-surface/60 uppercase font-bold tracking-wider text-slate-600 border-b border-sand-border">
                <tr>
                  <th className="p-4">ID</th>
                  <th className="p-4">Sender Details</th>
                  <th className="p-4">Subject</th>
                  <th className="p-4">Received Date</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-center">Quick Update</th>
                  <th className="p-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sand-border/60">
                {filteredContacts.length > 0 ? (
                  filteredContacts.map((c) => (
                    <tr
                      key={c.id}
                      className="hover:bg-sand-50/70 transition-colors cursor-pointer group"
                      onClick={() => setSelectedContact(c)}
                    >
                      <td className="p-4 font-mono font-bold text-slate-900">{c.id}</td>
                      <td className="p-4">
                        <strong className="block text-slate-900 group-hover:text-vana-700 transition-colors">
                          {c.fullName}
                        </strong>
                        <span className="text-slate-500">
                          {c.phone} • {c.email}
                        </span>
                      </td>
                      <td className="p-4 font-medium text-slate-800 max-w-xs truncate">{c.subject}</td>
                      <td className="p-4 text-slate-500">
                        {new Date(c.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </td>
                      <td className="p-4">
                        <span
                          className={`inline-block px-2.5 py-1 rounded-full font-bold uppercase text-[10px] ${
                            c.status === 'unread'
                              ? 'bg-amber-100 text-amber-800 border border-amber-200'
                              : c.status === 'responded'
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                              : 'bg-slate-100 text-slate-700 border border-slate-200'
                          }`}
                        >
                          {c.status}
                        </span>
                      </td>
                      <td className="p-4 text-center" onClick={(e) => e.stopPropagation()}>
                        <div className="inline-flex items-center gap-1 bg-white/80 p-1 rounded-xl border border-sand-border">
                          <button
                            onClick={() => handleUpdateContactStatus(c.id, 'responded')}
                            className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-colors ${
                              c.status === 'responded'
                                ? 'bg-emerald-600 text-white'
                                : 'text-emerald-700 hover:bg-emerald-50'
                            }`}
                          >
                            Responded
                          </button>
                          <button
                            onClick={() =>
                              handleUpdateContactStatus(c.id, c.status === 'read' ? 'unread' : 'read')
                            }
                            className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-colors ${
                              c.status === 'read'
                                ? 'bg-slate-600 text-white'
                                : 'text-slate-700 hover:bg-slate-50'
                            }`}
                          >
                            {c.status === 'read' ? 'Read' : 'Mark Read'}
                          </button>
                        </div>
                      </td>
                      <td className="p-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => setSelectedContact(c)}
                          className="px-3 py-1.5 bg-vana-50 hover:bg-vana-100 text-vana-800 font-semibold rounded-lg border border-vana-200 transition-colors"
                        >
                          Read Message
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="p-12 text-center text-slate-500">
                      No traveler inquiries found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: ROOMS MANAGEMENT */}
      {/* ========================================================================= */}
      {activeTab === 'rooms' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-xl font-bold text-slate-900">
              Resort Room Catalog ({rooms.length} categories)
            </h3>
            <span className="text-xs text-slate-500">
              Persisted in MySQL table: <code className="bg-slate-100 px-2 py-0.5 rounded">rooms</code>
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rooms.map((r) => (
              <div
                key={r.slug || r.id}
                className="bg-white rounded-3xl border border-sand-border shadow-soft overflow-hidden flex flex-col justify-between"
              >
                <div>
                  <div className="h-44 bg-slate-100 relative overflow-hidden">
                    {r.image ? (
                      <img src={r.image} alt={r.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-400">
                        <BedDouble className="w-12 h-12" />
                      </div>
                    )}
                    <span
                      className={`absolute top-3 right-3 text-[10px] font-bold uppercase px-3 py-1 rounded-full shadow-sm ${
                        r.status === 'active'
                          ? 'bg-emerald-600 text-white'
                          : 'bg-rose-600 text-white'
                      }`}
                    >
                      {r.status || 'active'}
                    </span>
                  </div>

                  <div className="p-5 space-y-2">
                    <span className="text-[10px] uppercase font-bold text-vana-700 tracking-wider">
                      {r.categoryLabel || r.category}
                    </span>
                    <h4 className="font-serif text-lg font-bold text-slate-900">{r.name}</h4>
                    <p className="text-xs text-slate-600 line-clamp-2">{r.description}</p>
                    <div className="pt-2 flex items-center justify-between text-xs text-slate-500 border-t border-sand-border">
                      <span>Max Guests: <strong>{r.specs?.maxGuests || r.maxGuests || 2}</strong></span>
                      <span>Tariff: <strong className="text-vana-800 font-bold">{formatINR(r.samplePrice || r.base_price_inr || 2500)}</strong></span>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-sand-surface/60 border-t border-sand-border flex items-center justify-between gap-2">
                  <Button
                    size="sm"
                    variant={r.status === 'active' ? 'outline' : 'primary'}
                    onClick={() => handleToggleRoomStatus(r)}
                  >
                    {r.status === 'active' ? 'Deactivate Room' : 'Activate Room'}
                  </Button>
                  <Link to={`/rooms/${r.slug}`} target="_blank" className="text-xs text-vana-800 font-semibold hover:underline">
                    Preview Page ↗
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 5: ATTRACTIONS MANAGEMENT */}
      {/* ========================================================================= */}
      {activeTab === 'attractions' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-serif text-xl font-bold text-slate-900">
                Araku Valley Attractions ({attractions.length})
              </h3>
              <p className="text-xs text-slate-500">Manage tourist destinations displayed across the resort website</p>
            </div>
            <Button
              size="sm"
              variant="primary"
              onClick={() => setIsAddAttractionOpen(true)}
              icon={<Plus className="w-4 h-4" />}
            >
              Add Attraction
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {attractions.map((att) => (
              <div
                key={att.slug || att.id}
                className="bg-white rounded-3xl border border-sand-border shadow-soft overflow-hidden flex flex-col justify-between"
              >
                <div>
                  <div className="h-40 bg-slate-100 relative overflow-hidden">
                    {att.image ? (
                      <img src={att.image} alt={att.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-400">
                        <Compass className="w-10 h-10" />
                      </div>
                    )}
                    <span
                      className={`absolute top-3 right-3 text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full ${
                        att.status === 'active'
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-600 text-white'
                      }`}
                    >
                      {att.status || 'active'}
                    </span>
                  </div>

                  <div className="p-5 space-y-2">
                    <span className="text-[10px] uppercase font-bold text-amber-700 tracking-wider">
                      {att.distance || '5 km from resort'}
                    </span>
                    <h4 className="font-serif text-base font-bold text-slate-900">{att.name}</h4>
                    <p className="text-xs text-slate-600 line-clamp-2">
                      {att.short_description || att.description}
                    </p>
                  </div>
                </div>

                <div className="p-4 bg-sand-surface/60 border-t border-sand-border flex items-center justify-between">
                  <button
                    onClick={() => handleToggleAttractionStatus(att)}
                    className="text-xs font-semibold text-slate-700 hover:text-slate-900"
                  >
                    {att.status === 'active' ? 'Disable' : 'Enable'}
                  </button>
                  <button
                    onClick={() => handleDeleteAttraction(att)}
                    className="text-xs font-semibold text-rose-600 hover:text-rose-800"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

          {isAddAttractionOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md">
              <div className="bg-white rounded-3xl p-6 max-w-md w-full border border-sand-border shadow-2xl space-y-4">
                <div className="flex justify-between items-center border-b border-sand-border pb-3">
                  <h4 className="font-serif text-lg font-bold text-slate-900">Add New Attraction</h4>
                  <button onClick={() => setIsAddAttractionOpen(false)}>
                    <X className="w-5 h-5 text-slate-400" />
                  </button>
                </div>

                <form onSubmit={handleCreateAttraction} className="space-y-3 text-xs">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Chaparai Waterfalls"
                      value={newAttraction.name}
                      onChange={(e) => setNewAttraction({ ...newAttraction, name: e.target.value })}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Distance</label>
                    <input
                      type="text"
                      placeholder="e.g. 15 km from resort"
                      value={newAttraction.distance}
                      onChange={(e) =>
                        setNewAttraction({ ...newAttraction, distance: e.target.value })
                      }
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Image URL / Path</label>
                    <input
                      type="text"
                      placeholder="/scenery.jpeg or http://..."
                      value={newAttraction.image}
                      onChange={(e) => setNewAttraction({ ...newAttraction, image: e.target.value })}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Description</label>
                    <textarea
                      rows={2}
                      placeholder="Short tourist summary"
                      value={newAttraction.short_description}
                      onChange={(e) =>
                        setNewAttraction({ ...newAttraction, short_description: e.target.value })
                      }
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                    />
                  </div>
                  <div className="pt-2 flex justify-end gap-2">
                    <Button size="sm" variant="ghost" type="button" onClick={() => setIsAddAttractionOpen(false)}>
                      Cancel
                    </Button>
                    <Button size="sm" variant="primary" type="submit">
                      Save Attraction
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 6: GALLERY MANAGEMENT */}
      {/* ========================================================================= */}
      {activeTab === 'gallery' && (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h3 className="font-serif text-xl font-bold text-slate-900">
                Resort Photo Gallery ({gallery.length} photos)
              </h3>
              <p className="text-xs text-slate-500">Manage high-resolution images shown on the public gallery page</p>
            </div>
            <div className="flex items-center gap-2">
              <select
                value={galleryCategoryFilter}
                onChange={(e) => setGalleryCategoryFilter(e.target.value)}
                className="px-3 py-1.5 bg-white border border-sand-border rounded-xl text-xs font-semibold"
              >
                <option value="all">All Categories</option>
                <option value="resort">Resort Grounds</option>
                <option value="rooms">Rooms & Suites</option>
                <option value="nature">Valley & Scenery</option>
                <option value="amenities">Amenities</option>
              </select>
              <Button
                size="sm"
                variant="primary"
                onClick={() => setIsAddGalleryOpen(true)}
                icon={<Plus className="w-4 h-4" />}
              >
                Add Image
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {filteredGallery.map((g) => (
              <div
                key={g.id || g.databaseId}
                className="bg-white rounded-2xl border border-sand-border overflow-hidden shadow-xs group relative flex flex-col"
              >
                <div className="h-32 bg-slate-100 overflow-hidden relative">
                  <img
                    src={g.src || g.image_path}
                    alt={g.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <button
                    onClick={() => handleDeleteGallery(g.id || g.databaseId)}
                    className="absolute top-2 right-2 p-1.5 bg-rose-600/90 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Delete image"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="p-2.5 text-center">
                  <strong className="block text-[11px] text-slate-900 truncate">{g.title}</strong>
                  <span className="text-[10px] text-slate-400 capitalize">{g.category}</span>
                </div>
              </div>
            ))}
          </div>

          {isAddGalleryOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md">
              <div className="bg-white rounded-3xl p-6 max-w-md w-full border border-sand-border shadow-2xl space-y-4">
                <div className="flex justify-between items-center border-b border-sand-border pb-3">
                  <h4 className="font-serif text-lg font-bold text-slate-900">Add Gallery Image</h4>
                  <button onClick={() => setIsAddGalleryOpen(false)}>
                    <X className="w-5 h-5 text-slate-400" />
                  </button>
                </div>

                <form onSubmit={handleCreateGallery} className="space-y-3 text-xs">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Image Title</label>
                    <input
                      type="text"
                      placeholder="e.g. Araku Valley Sunrise View"
                      value={newGalleryItem.title}
                      onChange={(e) => setNewGalleryItem({ ...newGalleryItem, title: e.target.value })}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Category</label>
                    <select
                      value={newGalleryItem.category}
                      onChange={(e) => setNewGalleryItem({ ...newGalleryItem, category: e.target.value })}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                    >
                      <option value="resort">Resort Grounds</option>
                      <option value="rooms">Rooms & Suites</option>
                      <option value="nature">Valley & Scenery</option>
                      <option value="amenities">Amenities & Dining</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Image Path / URL *</label>
                    <input
                      type="text"
                      required
                      placeholder="/garden.jpeg or https://..."
                      value={newGalleryItem.image_path}
                      onChange={(e) =>
                        setNewGalleryItem({ ...newGalleryItem, image_path: e.target.value })
                      }
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                    />
                  </div>
                  <div className="pt-2 flex justify-end gap-2">
                    <Button size="sm" variant="ghost" type="button" onClick={() => setIsAddGalleryOpen(false)}>
                      Cancel
                    </Button>
                    <Button size="sm" variant="primary" type="submit">
                      Add to Gallery
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 7: VISITORS & TRAFFIC ANALYTICS */}
      {/* ========================================================================= */}
      {activeTab === 'visitors' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-serif text-xl font-bold text-slate-900">
                Visitor & Website Traffic Analytics
              </h3>
              <p className="text-xs text-slate-500">Lightweight, privacy-first session logging via PHP & MySQL</p>
            </div>
            <span className="text-xs font-semibold bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full">
              Live Tracker Active
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-3xl border border-sand-border shadow-soft space-y-1">
              <span className="text-xs uppercase font-bold text-slate-400 block">Today's Visitors</span>
              <strong className="text-2xl font-serif text-slate-900 block">
                {analytics?.summary?.todayVisitors ?? 0}
              </strong>
              <span className="text-[11px] text-slate-400">Unique user sessions</span>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-sand-border shadow-soft space-y-1">
              <span className="text-xs uppercase font-bold text-slate-400 block">Yesterday</span>
              <strong className="text-2xl font-serif text-slate-900 block">
                {analytics?.summary?.yesterdayVisitors ?? 0}
              </strong>
              <span className="text-[11px] text-slate-400">Previous day</span>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-sand-border shadow-soft space-y-1">
              <span className="text-xs uppercase font-bold text-slate-400 block">Last 30 Days</span>
              <strong className="text-2xl font-serif text-slate-900 block">
                {analytics?.summary?.last30DaysVisitors ?? 0}
              </strong>
              <span className="text-[11px] text-slate-400">Monthly reach</span>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-sand-border shadow-soft space-y-1">
              <span className="text-xs uppercase font-bold text-slate-400 block">Total Page Views</span>
              <strong className="text-2xl font-serif text-vana-800 block">
                {analytics?.summary?.totalPageViews ?? 0}
              </strong>
              <span className="text-[11px] text-slate-400">Cumulative hits</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white rounded-3xl border border-sand-border shadow-soft p-5 space-y-4">
              <h4 className="font-serif text-base font-bold text-slate-900 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-vana-700" />
                <span>Top Visited Pages</span>
              </h4>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-sand-surface uppercase font-bold text-slate-500 border-b border-sand-border">
                    <tr>
                      <th className="p-3">Page Path</th>
                      <th className="p-3">Page Title</th>
                      <th className="p-3 text-right">Views</th>
                      <th className="p-3 text-right">Unique Visitors</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-sand-border/60">
                    {analytics?.popularPages && analytics.popularPages.length > 0 ? (
                      analytics.popularPages.map((p: any, idx: number) => (
                        <tr key={idx} className="hover:bg-sand-50/50">
                          <td className="p-3 font-mono font-semibold text-slate-800">{p.page_path}</td>
                          <td className="p-3 text-slate-600 truncate max-w-xs">{p.page_title}</td>
                          <td className="p-3 text-right font-bold text-slate-900">{p.view_count}</td>
                          <td className="p-3 text-right text-slate-500">{p.unique_visitors}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4} className="p-6 text-center text-slate-400">
                          Visit logging is enabled. As visitors browse the resort website, metrics will appear here.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-sand-border shadow-soft p-5 space-y-4">
              <h4 className="font-serif text-base font-bold text-slate-900 flex items-center gap-2">
                <Monitor className="w-4 h-4 text-indigo-700" />
                <span>Device Usage</span>
              </h4>

              <div className="space-y-4 pt-2">
                {analytics?.deviceBreakdown && analytics.deviceBreakdown.length > 0 ? (
                  analytics.deviceBreakdown.map((dev: any, idx: number) => (
                    <div key={idx} className="space-y-1.5">
                      <div className="flex justify-between text-xs font-semibold text-slate-700 capitalize">
                        <span>{dev.device_type}</span>
                        <span>{dev.count} visits</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                        <div
                          className="bg-vana-600 h-full rounded-full"
                          style={{
                            width: `${Math.min(
                              100,
                              Math.round(
                                (dev.count / (analytics.summary?.totalPageViews || 1)) * 100
                              )
                            )}%`,
                          }}
                        />
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-xs text-slate-400 text-center py-8">
                    No device analytics recorded yet.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 8: RESORT OPERATIONAL SETTINGS */}
      {/* ========================================================================= */}
      {activeTab === 'settings' && (
        <div className="bg-white rounded-3xl border border-sand-border shadow-soft p-6 sm:p-8 max-w-3xl space-y-6">
          <div className="border-b border-sand-border pb-4">
            <h3 className="font-serif text-2xl font-bold text-slate-900">
              Resort Operational Settings
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Update front desk contact numbers, email, physical address, check-in policies, and GST tax percentages stored in MySQL.
            </p>
          </div>

          <form onSubmit={handleSaveSettings} className="space-y-5 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Resort Primary Phone</label>
                <input
                  type="text"
                  value={settingsForm['resort_phone'] || ''}
                  onChange={(e) =>
                    setSettingsForm({ ...settingsForm, resort_phone: e.target.value })
                  }
                  placeholder="+91 94943 45678"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">WhatsApp Concierge Phone</label>
                <input
                  type="text"
                  value={settingsForm['whatsapp_phone'] || ''}
                  onChange={(e) =>
                    setSettingsForm({ ...settingsForm, whatsapp_phone: e.target.value })
                  }
                  placeholder="919494345678"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Inquiry Email</label>
                <input
                  type="email"
                  value={settingsForm['resort_email'] || ''}
                  onChange={(e) =>
                    setSettingsForm({ ...settingsForm, resort_email: e.target.value })
                  }
                  placeholder="info@vanaresortaraku.com"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">GST Tax Rate (%)</label>
                <input
                  type="number"
                  step="0.5"
                  value={settingsForm['tax_rate_percent'] || '12'}
                  onChange={(e) =>
                    setSettingsForm({ ...settingsForm, tax_rate_percent: e.target.value })
                  }
                  placeholder="12"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Check-in Standard Time</label>
                <input
                  type="text"
                  value={settingsForm['check_in_time'] || '12:00 PM'}
                  onChange={(e) =>
                    setSettingsForm({ ...settingsForm, check_in_time: e.target.value })
                  }
                  placeholder="12:00 PM"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Check-out Standard Time</label>
                <input
                  type="text"
                  value={settingsForm['check_out_time'] || '10:00 AM'}
                  onChange={(e) =>
                    setSettingsForm({ ...settingsForm, check_out_time: e.target.value })
                  }
                  placeholder="10:00 AM"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="font-bold text-slate-700 block mb-1">Full Physical Address</label>
                <input
                  type="text"
                  value={settingsForm['resort_address'] || ''}
                  onChange={(e) =>
                    setSettingsForm({ ...settingsForm, resort_address: e.target.value })
                  }
                  placeholder="Near Coffee Plantations, Padmapuram Road, Araku Valley, AP 531149"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-sand-border flex justify-end">
              <Button
                type="submit"
                variant="primary"
                size="md"
                isLoading={isSavingSettings}
                icon={<Save className="w-4 h-4" />}
              >
                Save Settings to MySQL
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 9: GOOGLE HOTEL PRICES & TRAVEL PARTNER API */}
      {/* ========================================================================= */}
      {activeTab === 'googleHotels' && <GoogleHotelsManager />}

      {/* ========================================================================= */}
      {/* MODAL 1: BOOKING DETAILS MODAL */}
      {/* ========================================================================= */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-in fade-in duration-200">
          <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-md" onClick={() => setSelectedBooking(null)} />
          <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-sand-border overflow-hidden z-10 p-6 sm:p-8 space-y-6 animate-in zoom-in-95 duration-200">
            <div className="flex items-start justify-between border-b border-sand-border pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-vana-800 bg-vana-100 px-3 py-1 rounded-full">
                    {selectedBooking.id}
                  </span>
                  <span
                    className={`text-[10px] font-bold uppercase px-2.5 py-1 rounded-full ${
                      selectedBooking.status === 'confirmed'
                        ? 'bg-emerald-100 text-emerald-800'
                        : selectedBooking.status === 'cancelled'
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {selectedBooking.status}
                  </span>
                </div>
                <h3 className="font-serif text-2xl font-bold text-slate-900 mt-2">
                  {selectedBooking.roomName} Reservation
                </h3>
              </div>
              <button
                onClick={() => setSelectedBooking(null)}
                className="p-2 rounded-full hover:bg-sand-surface text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs text-slate-700">
              <div className="p-4 rounded-2xl bg-sand-surface/70 border border-sand-border space-y-2">
                <span className="font-bold uppercase tracking-wider text-timber-700 block">
                  Guest Information
                </span>
                <div>
                  <strong className="text-sm text-slate-900 block">{selectedBooking.fullName}</strong>
                  <div className="flex items-center gap-2 pt-1 text-slate-600">
                    <Phone className="w-3.5 h-3.5 text-vana-600" />
                    <a href={`tel:${selectedBooking.phone}`} className="hover:text-vana-700 font-semibold underline">
                      {selectedBooking.phone}
                    </a>
                  </div>
                  <div className="flex items-center gap-2 pt-1 text-slate-600">
                    <Mail className="w-3.5 h-3.5 text-vana-600" />
                    <span>{selectedBooking.email}</span>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-sand-surface/70 border border-sand-border space-y-2">
                <span className="font-bold uppercase tracking-wider text-timber-700 block">
                  Stay Breakdown
                </span>
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Check-in:</span>
                    <strong>{selectedBooking.checkIn}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Check-out:</span>
                    <strong>{selectedBooking.checkOut}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Duration:</span>
                    <strong>{selectedBooking.nights} Night(s)</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Party:</span>
                    <strong>
                      {selectedBooking.roomsCount} Room(s) • {selectedBooking.adults} Adults
                      {selectedBooking.children > 0 ? ` • ${selectedBooking.children} Kids` : ''}
                    </strong>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-sand-surface/70 border border-sand-border text-xs space-y-1">
              <span className="font-bold uppercase tracking-wider text-timber-700 block">Special Requests</span>
              <p className="text-slate-700 italic">
                {selectedBooking.additionalRequests || 'No special requests submitted by guest.'}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-vana-50/80 border border-vana-200 flex items-center justify-between text-xs">
              <div>
                <span className="text-vana-800 font-semibold block">Total Estimated Tariff</span>
                <span className="text-slate-500">Night rates & GST estimate</span>
              </div>
              <span className="font-serif text-2xl font-bold text-vana-900">
                {selectedBooking.estimatedPrice ? formatINR(selectedBooking.estimatedPrice) : 'On Request'}
              </span>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
                Update Reservation Status:
              </span>
              <div className="flex flex-wrap gap-2">
                <Button
                  size="sm"
                  variant={selectedBooking.status === 'confirmed' ? 'primary' : 'outline'}
                  onClick={() => handleUpdateBookingStatus(selectedBooking.id, 'confirmed')}
                  icon={<CheckCircle2 className="w-3.5 h-3.5" />}
                >
                  Confirm Reservation
                </Button>
                <Button
                  size="sm"
                  variant={selectedBooking.status === 'pending' ? 'gold' : 'outline'}
                  onClick={() => handleUpdateBookingStatus(selectedBooking.id, 'pending')}
                  icon={<Clock className="w-3.5 h-3.5" />}
                >
                  Mark as Pending
                </Button>
                <Button
                  size="sm"
                  variant={selectedBooking.status === 'cancelled' ? 'secondary' : 'outline'}
                  onClick={() => handleUpdateBookingStatus(selectedBooking.id, 'cancelled')}
                  icon={<XCircle className="w-3.5 h-3.5" />}
                >
                  Cancel Booking
                </Button>
              </div>
            </div>

            <div className="pt-4 border-t border-sand-border flex flex-wrap items-center justify-between gap-3">
              <div className="flex gap-2">
                <a
                  href={`https://wa.me/91${selectedBooking.phone.replace(/\D/g, '')}?text=${encodeURIComponent(
                    `Hello ${selectedBooking.fullName}! Regarding your booking inquiry (${selectedBooking.id}) for ${selectedBooking.roomName} at Vana Resort Araku. Your reservation status is: ${selectedBooking.status.toUpperCase()}.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button size="sm" variant="primary" icon={<MessageCircle className="w-3.5 h-3.5" />}>
                    Chat on WhatsApp
                  </Button>
                </a>
                <a href={`tel:${selectedBooking.phone}`}>
                  <Button size="sm" variant="outline" icon={<Phone className="w-3.5 h-3.5" />}>
                    Call Guest
                  </Button>
                </a>
              </div>

              <button
                onClick={() => handleDeleteBooking(selectedBooking.id)}
                className="text-xs text-rose-600 hover:text-rose-800 flex items-center gap-1 font-semibold"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Remove Reservation</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: CONTACT MESSAGE DETAILS MODAL */}
      {/* ========================================================================= */}
      {selectedContact && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-in fade-in duration-200">
          <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-md" onClick={() => setSelectedContact(null)} />
          <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-sand-border overflow-hidden z-10 p-6 sm:p-8 space-y-6 animate-in zoom-in-95 duration-200">
            <div className="flex items-start justify-between border-b border-sand-border pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-slate-800 bg-sand-surface px-3 py-1 rounded-full border border-sand-border">
                    {selectedContact.id}
                  </span>
                  <span
                    className={`text-[10px] font-bold uppercase px-2.5 py-1 rounded-full ${
                      selectedContact.status === 'unread'
                        ? 'bg-amber-100 text-amber-800'
                        : selectedContact.status === 'responded'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {selectedContact.status}
                  </span>
                </div>
                <h3 className="font-serif text-2xl font-bold text-slate-900 mt-2">
                  {selectedContact.subject}
                </h3>
                <span className="text-xs text-slate-400">
                  Received on {new Date(selectedContact.createdAt).toLocaleString('en-IN')}
                </span>
              </div>
              <button
                onClick={() => setSelectedContact(null)}
                className="p-2 rounded-full hover:bg-sand-surface text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-sand-surface/70 border border-sand-border space-y-2 text-xs">
              <span className="font-bold uppercase tracking-wider text-timber-700 block">Sender Details</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <span className="text-slate-500 block">Sender Name:</span>
                  <strong className="text-slate-900 text-sm">{selectedContact.fullName}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block">Mobile Phone:</span>
                  <a href={`tel:${selectedContact.phone}`} className="font-bold text-vana-700 hover:underline">
                    {selectedContact.phone}
                  </a>
                </div>
                <div className="sm:col-span-2">
                  <span className="text-slate-500 block">Email Address:</span>
                  <a href={`mailto:${selectedContact.email}`} className="text-slate-800 font-medium hover:underline">
                    {selectedContact.email}
                  </a>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-timber-700 block">
                Message Content:
              </span>
              <div className="p-4 rounded-2xl bg-sand-50 border border-sand-border text-sm text-slate-800 leading-relaxed whitespace-pre-wrap">
                {selectedContact.message}
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
                Update Status:
              </span>
              <div className="flex flex-wrap gap-2">
                <Button
                  size="sm"
                  variant={selectedContact.status === 'responded' ? 'primary' : 'outline'}
                  onClick={() => handleUpdateContactStatus(selectedContact.id, 'responded')}
                  icon={<CheckCircle2 className="w-3.5 h-3.5" />}
                >
                  Mark as Responded
                </Button>
                <Button
                  size="sm"
                  variant={selectedContact.status === 'read' ? 'secondary' : 'outline'}
                  onClick={() => handleUpdateContactStatus(selectedContact.id, 'read')}
                >
                  Mark as Read
                </Button>
                <Button
                  size="sm"
                  variant={selectedContact.status === 'unread' ? 'gold' : 'outline'}
                  onClick={() => handleUpdateContactStatus(selectedContact.id, 'unread')}
                >
                  Mark as Unread
                </Button>
              </div>
            </div>

            <div className="pt-4 border-t border-sand-border flex flex-wrap items-center justify-between gap-3">
              <div className="flex gap-2">
                <a
                  href={`https://wa.me/91${selectedContact.phone.replace(/\D/g, '')}?text=${encodeURIComponent(
                    `Hello ${selectedContact.fullName}! Greetings from Vana Resort Araku regarding your message: "${selectedContact.subject}".`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button size="sm" variant="primary" icon={<MessageCircle className="w-3.5 h-3.5" />}>
                    Reply on WhatsApp
                  </Button>
                </a>
                <a href={`mailto:${selectedContact.email}?subject=Re: ${encodeURIComponent(selectedContact.subject)}`}>
                  <Button size="sm" variant="outline" icon={<Mail className="w-3.5 h-3.5" />}>
                    Reply by Email
                  </Button>
                </a>
              </div>

              <button
                onClick={() => handleDeleteContact(selectedContact.id)}
                className="text-xs text-rose-600 hover:text-rose-800 flex items-center gap-1 font-semibold"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPage;
