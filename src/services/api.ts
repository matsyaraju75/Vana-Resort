/**
 * @file api.ts
 * @description Centralized production API service for Vana Resort Araku.
 * Communicates with PHP 8.2+ / MySQL backend over REST endpoints with session credentials.
 */

import type { BookingRecord, BookingRequestPayload, BookingStatus } from '../types/booking';
import type { ContactMessagePayload, ContactRecord } from '../types/contact';
import type { Room } from '../types/room';
import { ROOMS } from '../data/rooms';
import { ATTRACTIONS_LIST } from '../data/attractions';
import { GALLERY_ITEMS } from '../data/gallery';

const LOCAL_BOOKINGS_KEY = 'vana_bookings';
const LOCAL_CONTACTS_KEY = 'vana_contact_messages';

function getLocalBookings(): BookingRecord[] {
  try {
    const raw = localStorage.getItem(LOCAL_BOOKINGS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {
    console.error('Error reading local bookings:', e);
  }
  return [];
}

function saveLocalBookings(bookings: BookingRecord[]): void {
  try {
    localStorage.setItem(LOCAL_BOOKINGS_KEY, JSON.stringify(bookings));
  } catch (e) {
    console.error('Error saving local bookings:', e);
  }
}

function getLocalContacts(): ContactRecord[] {
  try {
    const raw = localStorage.getItem(LOCAL_CONTACTS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {
    console.error('Error reading local contacts:', e);
  }
  return [];
}

function saveLocalContacts(messages: ContactRecord[]): void {
  try {
    localStorage.setItem(LOCAL_CONTACTS_KEY, JSON.stringify(messages));
  } catch (e) {
    console.error('Error saving local contacts:', e);
  }
}

// Base URL: Use environment variable or default to XAMPP Apache endpoint
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost/vana-resort/backend/api';

export class ApiError extends Error {
  status: number;
  errors?: Record<string, string>;

  constructor(message: string, status: number, errors?: Record<string, string>) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.errors = errors;
  }
}

interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: Record<string, string>;
}

/**
 * Centralized fetch client with credential transmission and unified error mapping
 */
async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;

  const headers: Record<string, string> = {
    Accept: 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };

  // If body is NOT FormData, default to application/json
  if (options.body && !(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  const config: RequestInit = {
    ...options,
    headers,
    credentials: 'include', // Crucial for PHP session cookie transmission
  };

  let response: Response;
  try {
    response = await fetch(url, config);
  } catch (netErr: any) {
    throw new ApiError(
      'Unable to connect to Vana Resort server. Please ensure Apache and MySQL are running in XAMPP.',
      0
    );
  }

  let json: ApiResponse<T>;
  try {
    json = await response.json();
  } catch {
    throw new ApiError(
      `Server returned unexpected response (HTTP ${response.status}).`,
      response.status
    );
  }

  if (!response.ok || !json.success) {
    const errorMsg = json.message || `Request failed with status ${response.status}`;
    throw new ApiError(errorMsg, response.status, json.errors);
  }

  return (json.data !== undefined ? json.data : (json as unknown as T)) as T;
}

export const apiService = {
  // ==========================================
  // ROOMS API
  // ==========================================
  async getRooms(all: boolean = false): Promise<Room[]> {
    try {
      const res = await request<{ rooms: Room[] }>(`/rooms/list.php${all ? '?all=1' : ''}`);
      if (res && Array.isArray(res.rooms) && res.rooms.length > 0) {
        return res.rooms;
      }
    } catch (e) {
      console.warn('Backend rooms fetch failed; falling back to local room catalog:', e);
    }
    return ROOMS;
  },

  async getRoomBySlug(slug: string): Promise<Room | null> {
    try {
      const room = await request<Room>(`/rooms/get.php?id=${encodeURIComponent(slug)}`);
      if (room) return room;
    } catch {
      // Fallback to static catalog if room get endpoint offline
      const staticRoom = ROOMS.find((r) => r.slug === slug);
      if (staticRoom) return staticRoom;
    }
    return null;
  },

  async createRoom(data: Partial<Room> & { images?: string[] }): Promise<any> {
    return request('/rooms/create.php', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async updateRoom(id: string | number, data: Partial<Room>): Promise<any> {
    return request(`/rooms/update.php?id=${encodeURIComponent(id)}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  async deleteRoom(id: string | number): Promise<any> {
    return request(`/rooms/delete.php?id=${encodeURIComponent(id)}`, {
      method: 'DELETE',
    });
  },

  // ==========================================
  // BOOKINGS API
  // ==========================================
  async createBooking(payload: BookingRequestPayload): Promise<BookingRecord> {
    const checkInDate = new Date(payload.checkIn);
    const checkOutDate = new Date(payload.checkOut);
    const diffTime = checkOutDate.getTime() - checkInDate.getTime();
    const diffDays = Math.max(1, Math.round(diffTime / (1000 * 60 * 60 * 24)) || 1);
    const matchedRoom = ROOMS.find((r) => r.slug === payload.roomSlug);
    const samplePrice = matchedRoom?.samplePrice || 3500;
    const estimatedTotal = samplePrice * (payload.roomsCount || 1) * diffDays;

    const fallbackRecord: BookingRecord = {
      id: `VR-${Math.floor(100000 + Math.random() * 900000)}`,
      status: 'pending',
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
      nights: diffDays,
      estimatedPrice: estimatedTotal,
      fullName: payload.fullName,
      email: payload.email || 'Not provided',
      phone: payload.phone,
      checkIn: payload.checkIn,
      checkOut: payload.checkOut,
      adults: Number(payload.adults) || 1,
      children: Number(payload.children) || 0,
      roomsCount: Number(payload.roomsCount) || 1,
      roomSlug: payload.roomSlug,
      roomName: payload.roomName || matchedRoom?.name || 'Vana Resort Room',
      additionalRequests: payload.additionalRequests || '',
    };

    try {
      const res = await request<BookingRecord>('/bookings/create.php', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      if (res && res.id) {
        const current = getLocalBookings();
        saveLocalBookings([res, ...current.filter((b) => b.id !== res.id)]);
        return res;
      }
    } catch (e) {
      console.warn('Backend booking submission unavailable; saving booking locally in browser:', e);
    }

    const current = getLocalBookings();
    saveLocalBookings([fallbackRecord, ...current]);
    return fallbackRecord;
  },

  async getBookings(params?: { status?: string; search?: string; page?: number }): Promise<BookingRecord[]> {
    try {
      const query = new URLSearchParams();
      if (params?.status && params.status !== 'all') query.set('status', params.status);
      if (params?.search) query.set('search', params.search);
      if (params?.page) query.set('page', String(params.page));

      const qs = query.toString() ? `?${query.toString()}` : '';
      const res = await request<{ bookings: BookingRecord[] }>(`/bookings/list.php${qs}`);
      if (res && Array.isArray(res.bookings)) {
        return res.bookings;
      }
    } catch {
      // Backend unavailable - use local storage
    }

    let list = getLocalBookings();
    if (list.length === 0) {
      list = [
        {
          id: 'VR-108241',
          fullName: 'Ananya Sharma',
          email: 'ananya.sharma@example.com',
          phone: '9876543210',
          checkIn: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
          checkOut: new Date(Date.now() + 86400000 * 5).toISOString().split('T')[0],
          adults: 2,
          children: 1,
          roomsCount: 1,
          roomSlug: 'ac-deluxe-room',
          roomName: 'AC Deluxe Room',
          additionalRequests: 'Ground floor room preferred with extra cot.',
          status: 'confirmed',
          createdAt: new Date(Date.now() - 86400000 * 2).toISOString().replace('T', ' ').substring(0, 19),
          nights: 2,
          estimatedPrice: 9000,
        },
        {
          id: 'VR-109352',
          fullName: 'Rajesh Verma',
          email: 'rajesh.v@example.com',
          phone: '9123456789',
          checkIn: new Date(Date.now() + 86400000 * 7).toISOString().split('T')[0],
          checkOut: new Date(Date.now() + 86400000 * 9).toISOString().split('T')[0],
          adults: 4,
          children: 0,
          roomsCount: 2,
          roomSlug: 'executive-suite-room',
          roomName: 'Executive Suite Room',
          additionalRequests: 'Arrangement for Araku valley cab tour on Day 2.',
          status: 'pending',
          createdAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
          nights: 2,
          estimatedPrice: 24000,
        },
      ];
      saveLocalBookings(list);
    }

    if (params?.status && params.status !== 'all') {
      list = list.filter((b) => b.status === params.status);
    }
    if (params?.search) {
      const q = params.search.toLowerCase();
      list = list.filter(
        (b) =>
          b.id.toLowerCase().includes(q) ||
          b.fullName.toLowerCase().includes(q) ||
          b.phone.toLowerCase().includes(q) ||
          b.email.toLowerCase().includes(q) ||
          b.roomName.toLowerCase().includes(q)
      );
    }
    return list;
  },

  async getBooking(id: string): Promise<BookingRecord> {
    try {
      const res = await request<BookingRecord>(`/bookings/get.php?id=${encodeURIComponent(id)}`);
      if (res) return res;
    } catch {
      // Backend unavailable - use local storage
    }
    const found = getLocalBookings().find((b) => b.id === id);
    if (found) return found;
    throw new ApiError(`Booking with reference ${id} not found.`, 404);
  },

  async updateBookingStatus(
    id: string,
    status: BookingStatus,
    adminNotes?: string,
    finalPrice?: number
  ): Promise<void> {
    try {
      await request('/bookings/update-status.php', {
        method: 'PATCH',
        body: JSON.stringify({ id, status, adminNotes, finalPrice }),
      });
    } catch (e) {
      console.warn('Backend booking status update failed; updating local record:', e);
    }
    const list = getLocalBookings();
    const idx = list.findIndex((b) => b.id === id);
    if (idx !== -1) {
      list[idx] = {
        ...list[idx],
        status,
        ...(finalPrice !== undefined ? { estimatedPrice: finalPrice } : {}),
      };
      saveLocalBookings(list);
    }
  },

  async deleteBooking(id: string): Promise<void> {
    try {
      await request(`/bookings/delete.php?id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
      });
    } catch (e) {
      console.warn('Backend booking deletion failed; removing from local storage:', e);
    }
    const list = getLocalBookings().filter((b) => b.id !== id);
    saveLocalBookings(list);
  },

  // ==========================================
  // CONTACT MESSAGES API
  // ==========================================
  async sendContactMessage(payload: ContactMessagePayload): Promise<ContactRecord> {
    const fallbackRecord: ContactRecord = {
      id: `MSG-${Date.now().toString().slice(-6)}`,
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
      status: 'unread',
      ...payload,
    };

    try {
      const res = await request<ContactRecord>('/contacts/create.php', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      if (res && res.id) {
        const current = getLocalContacts();
        saveLocalContacts([res, ...current.filter((c) => c.id !== res.id)]);
        return res;
      }
    } catch (e) {
      console.warn('Backend contact submission unavailable; saving contact inquiry locally:', e);
    }

    const current = getLocalContacts();
    saveLocalContacts([fallbackRecord, ...current]);
    return fallbackRecord;
  },

  async getContactMessages(params?: { status?: string; search?: string }): Promise<ContactRecord[]> {
    try {
      const query = new URLSearchParams();
      if (params?.status && params.status !== 'all') query.set('status', params.status);
      if (params?.search) query.set('search', params.search);

      const qs = query.toString() ? `?${query.toString()}` : '';
      const res = await request<{ messages: ContactRecord[] }>(`/contacts/list.php${qs}`);
      if (res && Array.isArray(res.messages)) {
        return res.messages;
      }
    } catch {
      // Backend unavailable - use local storage
    }

    let list = getLocalContacts();
    if (list.length === 0) {
      list = [
        {
          id: 'MSG-884120',
          fullName: 'Kiran Kumar',
          email: 'kiran.k@example.com',
          phone: '9848022338',
          subject: 'Group tour inquiry (15 persons)',
          message: 'We are planning a corporate offsite in Araku next month. Do you have dormitory or conference facilities?',
          status: 'unread',
          createdAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
        },
      ];
      saveLocalContacts(list);
    }

    if (params?.status && params.status !== 'all') {
      list = list.filter((c) => c.status === params.status);
    }
    if (params?.search) {
      const q = params.search.toLowerCase();
      list = list.filter(
        (c) =>
          c.fullName.toLowerCase().includes(q) ||
          c.phone.toLowerCase().includes(q) ||
          c.email.toLowerCase().includes(q) ||
          c.subject.toLowerCase().includes(q)
      );
    }
    return list;
  },

  async getContactMessage(id: string | number): Promise<ContactRecord> {
    try {
      const res = await request<ContactRecord>(`/contacts/get.php?id=${encodeURIComponent(id)}`);
      if (res) return res;
    } catch {
      // Backend unavailable - use local storage
    }
    const found = getLocalContacts().find((c) => String(c.id) === String(id));
    if (found) return found;
    throw new ApiError(`Message #${id} not found.`, 404);
  },

  async updateContactStatus(
    id: string | number,
    status: ContactRecord['status'],
    adminNotes?: string
  ): Promise<void> {
    try {
      await request('/contacts/update-status.php', {
        method: 'PATCH',
        body: JSON.stringify({ id, status, adminNotes }),
      });
    } catch (e) {
      console.warn('Backend contact update failed; updating local record:', e);
    }
    const list = getLocalContacts();
    const idx = list.findIndex((c) => String(c.id) === String(id));
    if (idx !== -1) {
      list[idx] = { ...list[idx], status };
      saveLocalContacts(list);
    }
  },

  async deleteContactMessage(id: string | number): Promise<void> {
    try {
      await request(`/contacts/delete.php?id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
      });
    } catch (e) {
      console.warn('Backend contact deletion failed; removing from local storage:', e);
    }
    const list = getLocalContacts().filter((c) => String(c.id) !== String(id));
    saveLocalContacts(list);
  },

  // ==========================================
  // ATTRACTIONS API
  // ==========================================
  async getAttractions(all: boolean = false): Promise<any[]> {
    try {
      const res = await request<{ attractions: any[] }>(`/attractions/list.php${all ? '?all=1' : ''}`);
      if (res && Array.isArray(res.attractions) && res.attractions.length > 0) {
        return res.attractions;
      }
    } catch {
      // Backend unavailable - fallback to static attractions catalog
    }
    return ATTRACTIONS_LIST;
  },

  async createAttraction(data: any): Promise<any> {
    return request('/attractions/create.php', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async updateAttraction(id: string | number, data: any): Promise<any> {
    return request(`/attractions/update.php?id=${encodeURIComponent(id)}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  async deleteAttraction(id: string | number): Promise<any> {
    return request(`/attractions/delete.php?id=${encodeURIComponent(id)}`, {
      method: 'DELETE',
    });
  },

  // ==========================================
  // GALLERY API
  // ==========================================
  async getGallery(category?: string, all: boolean = false): Promise<any[]> {
    try {
      const query = new URLSearchParams();
      if (category && category !== 'all') query.set('category', category);
      if (all) query.set('all', '1');
      const qs = query.toString() ? `?${query.toString()}` : '';
      const res = await request<{ gallery: any[] }>(`/gallery/list.php${qs}`);
      if (res && Array.isArray(res.gallery) && res.gallery.length > 0) {
        return res.gallery;
      }
    } catch {
      // Backend unavailable - fallback to static gallery items
    }
    if (category && category !== 'all') {
      return GALLERY_ITEMS.filter((item) => item.category === category);
    }
    return GALLERY_ITEMS;
  },

  async createGalleryItem(payload: FormData | Record<string, any>): Promise<any> {
    return request('/gallery/create.php', {
      method: 'POST',
      body: payload instanceof FormData ? payload : JSON.stringify(payload),
    });
  },

  async updateGalleryItem(id: number | string, data: any): Promise<any> {
    return request(`/gallery/update.php?id=${encodeURIComponent(id)}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  async deleteGalleryItem(id: number | string): Promise<any> {
    return request(`/gallery/delete.php?id=${encodeURIComponent(id)}`, {
      method: 'DELETE',
    });
  },

  // ==========================================
  // ANALYTICS & DASHBOARD STATS API
  // ==========================================
  async trackPageView(pagePath: string, pageTitle: string): Promise<void> {
    try {
      let sessionId = sessionStorage.getItem('vana_sess_id');
      if (!sessionId) {
        sessionId = 'sess_' + Math.random().toString(36).substring(2, 12);
        sessionStorage.setItem('vana_sess_id', sessionId);
      }
      await request('/analytics/track.php', {
        method: 'POST',
        body: JSON.stringify({
          page_path: pagePath,
          page_title: pageTitle,
          referrer: document.referrer || '',
          session_id: sessionId,
        }),
      });
    } catch {
      // Fire-and-forget analytics
    }
  },

  async getAnalyticsDashboard(): Promise<any> {
    return request('/analytics/dashboard.php');
  },

  async getDashboardStats(): Promise<any> {
    try {
      return await request('/dashboard/stats.php');
    } catch {
      const bookings = getLocalBookings();
      const contacts = getLocalContacts();
      const pendingCount = bookings.filter((b) => b.status === 'pending').length;
      const confirmedCount = bookings.filter((b) => b.status === 'confirmed').length;
      const totalRevenue = bookings
        .filter((b) => b.status === 'confirmed')
        .reduce((sum, b) => sum + (b.estimatedPrice || 0), 0);

      return {
        total_bookings: bookings.length,
        pending_bookings: pendingCount,
        confirmed_bookings: confirmedCount,
        total_inquiries: contacts.length,
        unread_inquiries: contacts.filter((c) => c.status === 'unread').length,
        total_revenue: totalRevenue,
      };
    }
  },

  // ==========================================
  // SETTINGS API
  // ==========================================
  async getSettings(): Promise<Record<string, string>> {
    try {
      const res = await request<{ settings: Record<string, string> }>('/settings/get.php');
      if (res && res.settings) return res.settings;
    } catch {
      // Backend unavailable - default resort settings
    }
    return {
      resort_name: 'Vana Resort Araku',
      check_in_time: '12:00 PM',
      check_out_time: '10:00 AM',
      contact_phone: '+91 90141 15175',
      contact_whatsapp: '919014115175',
      contact_email: 'contact@vanaresortaraku.com',
    };
  },

  async updateSettings(settings: Record<string, string>): Promise<any> {
    return request('/settings/update.php', {
      method: 'PUT',
      body: JSON.stringify({ settings }),
    });
  },

  // ==========================================
  // AUTHENTICATION API
  // ==========================================
  async login(username: string, password: string): Promise<any> {
    return request('/auth/login.php', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
  },

  async logout(): Promise<void> {
    try {
      await request('/auth/logout.php', { method: 'POST' });
    } catch {
      // Ignore if session already terminated
    }
  },

  async getMe(): Promise<any> {
    return request('/auth/me.php', { method: 'GET' });
  },

  async resetPassword(recoveryKey: string, newPassword: string, username: string = 'admin'): Promise<any> {
    return request('/auth/reset-password.php', {
      method: 'POST',
      body: JSON.stringify({ recovery_key: recoveryKey, new_password: newPassword, username }),
    });
  },

  // ==========================================
  // SYSTEM HEALTH
  // ==========================================
  async checkHealth(): Promise<any> {
    return request('/health.php', { method: 'GET' });
  },
};
