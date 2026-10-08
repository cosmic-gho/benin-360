import type {
  Category,
  Attraction,
  EventItem,
  Business,
  Guide,
  Experience,
  TransportProvider,
  TransportRequest,
  BookingRequest,
  Product,
  MarketplaceOrder,
  PassportStamp,
  PlatformMetrics,
  User,
  UserRole,
  AuthResponse,
  UploadResponse,
  StorageStatusResponse,
} from '@/types';
import { store } from './dataStore';

const BASE_URL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? 'https://benin360-api.fly.dev/api/v1' : 'http://127.0.0.1:8000/api/v1');

const TOKEN_KEY = 'benin360_auth_token';
const USER_KEY = 'benin360_current_user';

export function getStoredToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setStoredToken(token: string | null) {
  try {
    if (token) localStorage.setItem(TOKEN_KEY, token);
    else localStorage.removeItem(TOKEN_KEY);
  } catch (_e) {
    // Ignore localStorage access failures (e.g. private browsing)
  }
}

export function getStoredUser(): User | null {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setStoredUser(user: User | null) {
  try {
    if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));
    else localStorage.removeItem(USER_KEY);
  } catch (_e) {
    // Ignore localStorage access failures
  }
}

async function fetchJson<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${BASE_URL.replace(/\/$/, '')}/${endpoint.replace(/^\//, '')}`;
  const token = getStoredToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Token ${token}` } : {}),
    ...(options?.headers as Record<string, string> | undefined),
  };

  const res = await fetch(url, {
    ...options,
    headers,
  });

  if (!res.ok) {
    const errorBody = await res.text().catch(() => '');
    throw new Error(`API ${res.status}: ${res.statusText} - ${errorBody}`);
  }

  return res.json();
}

function unwrapResults<T>(data: any): T[] {
  if (Array.isArray(data)) return data;
  if (data && Array.isArray(data.results)) return data.results;
  return [];
}

export const api = {
  baseUrl: BASE_URL,

  // Health check
  async checkConnection(): Promise<boolean> {
    try {
      await fetchJson('categories/');
      return true;
    } catch {
      return false;
    }
  },

  // Categories
  async getCategories(): Promise<Category[]> {
    try {
      const data = await fetchJson<any>('categories/');
      const list = unwrapResults<Category>(data);
      return list.length > 0 ? list : store.getCategories();
    } catch {
      return store.getCategories();
    }
  },

  // Attractions
  async getAttractions(params?: { category?: string; featured?: boolean; search?: string }): Promise<Attraction[]> {
    try {
      const q = new URLSearchParams();
      if (params?.category) q.set('category', params.category);
      if (params?.featured) q.set('featured', 'true');
      if (params?.search) q.set('search', params.search);

      const qs = q.toString() ? `?${q.toString()}` : '';
      const data = await fetchJson<any>(`attractions/${qs}`);
      const list = unwrapResults<any>(data).map((item) => ({
        ...item,
        category: item.category_details || store.getCategories().find((c) => c.id === item.category) || null,
        latitude: item.latitude ? parseFloat(item.latitude) : null,
        longitude: item.longitude ? parseFloat(item.longitude) : null,
      }));
      return list.length > 0 ? list : store.getAttractions();
    } catch {
      return store.getAttractions();
    }
  },

  async getAttraction(slug: string): Promise<Attraction | undefined> {
    try {
      const item = await fetchJson<any>(`attractions/${slug}/`);
      return {
        ...item,
        category: item.category_details || store.getCategories().find((c) => c.id === item.category) || null,
        latitude: item.latitude ? parseFloat(item.latitude) : null,
        longitude: item.longitude ? parseFloat(item.longitude) : null,
      };
    } catch {
      return store.getAttractionBySlug(slug);
    }
  },

  // Events
  async getEvents(params?: { filter?: 'upcoming' | 'today' | 'past' | 'all'; search?: string }): Promise<EventItem[]> {
    try {
      const q = new URLSearchParams();
      if (params?.filter && params.filter !== 'all') q.set('filter', params.filter);
      if (params?.search) q.set('search', params.search);

      const qs = q.toString() ? `?${q.toString()}` : '';
      const data = await fetchJson<any>(`events/${qs}`);
      const list = unwrapResults<any>(data).map((item) => ({
        ...item,
        latitude: item.latitude ? parseFloat(item.latitude) : null,
        longitude: item.longitude ? parseFloat(item.longitude) : null,
      }));
      return list.length > 0 ? list : store.getEvents();
    } catch {
      return store.getEvents();
    }
  },

  async getEvent(slug: string): Promise<EventItem | undefined> {
    try {
      const item = await fetchJson<any>(`events/${slug}/`);
      return {
        ...item,
        latitude: item.latitude ? parseFloat(item.latitude) : null,
        longitude: item.longitude ? parseFloat(item.longitude) : null,
      };
    } catch {
      return store.getEventBySlug(slug);
    }
  },

  // Businesses (Hotels & Restaurants)
  async getBusinesses(params?: { type?: string; price_band?: string }): Promise<Business[]> {
    try {
      const q = new URLSearchParams();
      if (params?.type) q.set('type', params.type);
      if (params?.price_band && params.price_band !== 'all') q.set('price_band', params.price_band);

      const qs = q.toString() ? `?${q.toString()}` : '';
      const data = await fetchJson<any>(`businesses/${qs}`);
      const list = unwrapResults<any>(data).map((item) => ({
        ...item,
        category: item.category_details || store.getCategories().find((c) => c.id === item.category) || null,
        latitude: item.latitude ? parseFloat(item.latitude) : null,
        longitude: item.longitude ? parseFloat(item.longitude) : null,
      }));
      return list.length > 0 ? list : store.getBusinesses(params?.type);
    } catch {
      return store.getBusinesses(params?.type);
    }
  },

  // Tour Guides & Experiences
  async getGuides(): Promise<Guide[]> {
    try {
      const data = await fetchJson<any>('guides/');
      const list = unwrapResults<Guide>(data);
      return list.length > 0 ? list : store.getGuides();
    } catch {
      return store.getGuides();
    }
  },

  async getGuide(slug: string): Promise<Guide | undefined> {
    try {
      const item = await fetchJson<Guide>(`guides/${slug}/`);
      return item || store.getGuideBySlug(slug);
    } catch {
      return store.getGuideBySlug(slug);
    }
  },

  async getExperiences(): Promise<Experience[]> {
    try {
      const data = await fetchJson<any>('experiences/');
      const list = unwrapResults<any>(data).map((item) => ({
        ...item,
        duration_hours: item.duration_hours ? parseFloat(item.duration_hours) : null,
        price_ngn: item.price_ngn ? parseFloat(item.price_ngn) : null,
      }));
      return list.length > 0 ? list : store.getExperiences();
    } catch {
      return store.getExperiences();
    }
  },

  async createBooking(booking: Omit<BookingRequest, 'id' | 'status' | 'created_at'>): Promise<BookingRequest> {
    const payload = {
      id: `bk-${Date.now()}`,
      experience: booking.experience_id,
      guide: booking.guide_id,
      visitor_name: booking.visitor_name,
      visitor_email: booking.visitor_email,
      visitor_phone: booking.visitor_phone,
      preferred_date: booking.preferred_date,
      party_size: booking.party_size,
      special_requests: booking.special_requests,
      status: 'pending',
    };

    try {
      const res = await fetchJson<BookingRequest>('bookings/', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      store.submitBooking(booking);
      return res;
    } catch {
      return store.submitBooking(booking);
    }
  },

  // Transport
  async getTransportProviders(): Promise<TransportProvider[]> {
    try {
      const data = await fetchJson<any>('transport-providers/');
      const list = unwrapResults<TransportProvider>(data);
      return list.length > 0 ? list : store.getTransportProviders();
    } catch {
      return store.getTransportProviders();
    }
  },

  async createTransportRequest(req: Omit<TransportRequest, 'id' | 'status' | 'created_at'>): Promise<TransportRequest> {
    const payload = {
      id: `tr-${Date.now()}`,
      service_type: req.service_type,
      pickup_location: req.pickup_location,
      destination: req.destination,
      pickup_date: req.pickup_date,
      pickup_time: req.pickup_time,
      passengers: req.passengers,
      contact_name: req.contact_name,
      contact_phone: req.contact_phone,
      contact_email: req.contact_email,
      special_notes: req.special_notes,
      status: 'pending',
    };

    try {
      const res = await fetchJson<TransportRequest>('transport-requests/', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      store.submitTransportRequest(req);
      return res;
    } catch {
      return store.submitTransportRequest(req);
    }
  },

  // Marketplace
  async getProducts(): Promise<Product[]> {
    try {
      const data = await fetchJson<any>('products/');
      const list = unwrapResults<any>(data).map((item) => ({
        ...item,
        price_ngn: item.price_ngn ? parseFloat(item.price_ngn) : null,
      }));
      return list.length > 0 ? list : store.getProducts();
    } catch {
      return store.getProducts();
    }
  },

  async createMarketplaceOrder(order: Omit<MarketplaceOrder, 'id' | 'status' | 'created_at'>): Promise<MarketplaceOrder> {
    const payload = {
      id: `ord-${Date.now()}`,
      product: order.product_id,
      quantity: order.quantity,
      buyer_name: order.buyer_name,
      buyer_phone: order.buyer_phone,
      buyer_email: order.buyer_email,
      delivery_address: order.delivery_address,
      notes: order.notes,
      status: 'pending',
    };

    try {
      const res = await fetchJson<MarketplaceOrder>('orders/', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      store.submitOrder(order);
      return res;
    } catch {
      return store.submitOrder(order);
    }
  },

  // Digital Passport Stamps
  async getPassportStamps(): Promise<PassportStamp[]> {
    try {
      const data = await fetchJson<any>('passport-stamps/');
      const list = unwrapResults<PassportStamp>(data);
      return list.length > 0 ? list : store.getStamps();
    } catch {
      return store.getStamps();
    }
  },

  async claimPassportStamp(stamp: Omit<PassportStamp, 'id' | 'claimed_at'>): Promise<{ success: boolean; message: string; stamp?: PassportStamp }> {
    const payload = {
      id: `stamp-${Date.now()}`,
      visitor_name: stamp.visitor_name,
      stamp_type: stamp.stamp_type,
      target_id: stamp.target_id,
      target_name: stamp.target_name,
    };

    try {
      const created = await fetchJson<PassportStamp>('passport-stamps/', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      store.claimStamp(stamp);
      return { success: true, message: 'Stamp recorded on BENIN360 database!', stamp: created };
    } catch (err: any) {
      // If already claimed or server error, use store validation
      return store.claimStamp(stamp);
    }
  },

  // Platform Metrics
  async getMetrics(): Promise<PlatformMetrics> {
    try {
      const data = await fetchJson<any>('metrics/');
      const fallback = store.getMetrics();
      return {
        totalVisitors: data.total_visitors ?? fallback.totalVisitors,
        totalEventViews: data.total_event_views ?? fallback.totalEventViews,
        totalAttractionViews: data.total_attraction_views ?? fallback.totalAttractionViews,
        totalEnquiries: data.total_enquiries ?? fallback.totalEnquiries,
        totalBookings: data.total_bookings ?? fallback.totalBookings,
        totalPassportClaims: data.total_passport_claims ?? fallback.totalPassportClaims,
        verifiedCount: data.verified_count ?? fallback.verifiedCount,
        pendingVerificationCount: data.pending_count ?? fallback.pendingVerificationCount,
      };
    } catch {
      return store.getMetrics();
    }
  },

  // AI Assistant Chat
  async askAI(message: string): Promise<{ reply: string; source: string; disclaimer?: string }> {
    try {
      const data = await fetchJson<{ reply: string; source: string; disclaimer?: string }>('ai/chat/', {
        method: 'POST',
        body: JSON.stringify({ message }),
      });
      return data;
    } catch {
      // Fallback response
      return {
        reply: `Thank you for asking about "${message}". On BENIN360, explore the verified directories for the Palace of the Oba of Benin, Igun Street Bronze Casters, upcoming coronation events, and local tour guides.`,
        source: 'local_curated_knowledge',
        disclaimer: 'BENIN360 is an independent digital tourism platform.',
      };
    }
  },

  // Authentication & Role-Based Personas
  async login(credentials: { username: string; password: string }): Promise<AuthResponse> {
    const data = await fetchJson<AuthResponse>('auth/login/', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    setStoredToken(data.token);
    setStoredUser(data.user);
    return data;
  },

  async register(payload: {
    username: string;
    email: string;
    password: string;
    role: UserRole;
    first_name?: string;
    last_name?: string;
    phone?: string;
    guild_name?: string;
    specialty_craft?: string;
    company_name?: string;
    business_type?: string;
  }): Promise<AuthResponse> {
    const data = await fetchJson<AuthResponse>('auth/register/', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    setStoredToken(data.token);
    setStoredUser(data.user);
    return data;
  },

  async getCurrentUser(): Promise<User | null> {
    const token = getStoredToken();
    if (!token) return getStoredUser();
    try {
      const data = await fetchJson<{ user: User }>('auth/me/');
      setStoredUser(data.user);
      return data.user;
    } catch {
      return getStoredUser();
    }
  },

  logout() {
    fetchJson('auth/logout/', { method: 'POST' }).catch(() => {});
    setStoredToken(null);
    setStoredUser(null);
  },

  // Cloudflare R2 & Image Uploads
  async uploadImage(file: File, folder: string = 'uploads'): Promise<UploadResponse> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);

    const url = `${BASE_URL.replace(/\/$/, '')}/upload/`;
    const token = getStoredToken();
    const headers: Record<string, string> = {};
    if (token) headers['Authorization'] = `Token ${token}`;

    try {
      const res = await fetch(url, {
        method: 'POST',
        headers,
        body: formData,
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({ detail: res.statusText }));
        throw new Error(err.detail || `Upload failed with status ${res.status}`);
      }

      return await res.json();
    } catch (err: any) {
      console.warn('Backend upload server unreachable or error, falling back to client preview:', err);
      // Offline fallback: data URL so offline testing works without interruption
      const dataUrl = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });
      return {
        success: true,
        url: dataUrl,
        key: `local/${file.name}`,
        filename: file.name,
        size: file.size,
        content_type: file.type,
        storage: 'local_fallback',
        message: 'Offline fallback (data preview URL)',
      };
    }
  },

  async getUploadPresignedUrl(filename: string, contentType: string, folder: string = 'uploads') {
    return await fetchJson<{
      upload_url: string;
      public_url: string;
      key: string;
      bucket: string;
    }>('upload/presign/', {
      method: 'POST',
      body: JSON.stringify({ filename, content_type: contentType, folder }),
    });
  },

  async getStorageStatus(): Promise<StorageStatusResponse> {
    try {
      return await fetchJson<StorageStatusResponse>('upload/status/');
    } catch {
      return {
        configured: false,
        provider: 'Cloudflare R2 (Offline / Local)',
        bucket_name: '(not connected)',
        endpoint_url: '',
        public_url: '',
        storage_type: 'local_fallback',
      };
    }
  },

  getStoredUser,
  getStoredToken,
};

