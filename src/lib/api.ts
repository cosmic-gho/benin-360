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
    // Ignore localStorage access failures
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
    const data = await fetchJson<any>('categories/?limit=100');
    return unwrapResults<Category>(data);
  },

  // Attractions
  async getAttractions(params?: { category?: string; featured?: boolean; search?: string }): Promise<Attraction[]> {
    const q = new URLSearchParams();
    if (params?.category) q.set('category', params.category);
    if (params?.featured) q.set('featured', 'true');
    if (params?.search) q.set('search', params.search);

    const qs = q.toString() ? `?${q.toString()}` : '';
    const data = await fetchJson<any>(`attractions/${qs}`);
    return unwrapResults<any>(data).map((item) => ({
      ...item,
      category: item.category_details || (typeof item.category === 'object' ? item.category : null),
      latitude: item.latitude ? parseFloat(item.latitude) : null,
      longitude: item.longitude ? parseFloat(item.longitude) : null,
    }));
  },

  async getAttraction(slugOrId: string): Promise<Attraction | undefined> {
    try {
      const item = await fetchJson<any>(`attractions/${slugOrId}/`);
      return {
        ...item,
        category: item.category_details || (typeof item.category === 'object' ? item.category : null),
        latitude: item.latitude ? parseFloat(item.latitude) : null,
        longitude: item.longitude ? parseFloat(item.longitude) : null,
      };
    } catch {
      return undefined;
    }
  },

  // Events
  async getEvents(params?: { filter?: 'upcoming' | 'today' | 'past' | 'all'; search?: string }): Promise<EventItem[]> {
    const q = new URLSearchParams();
    if (params?.filter && params.filter !== 'all') q.set('filter', params.filter);
    if (params?.search) q.set('search', params.search);

    const qs = q.toString() ? `?${q.toString()}` : '';
    const data = await fetchJson<any>(`events/${qs}`);
    return unwrapResults<any>(data).map((item) => ({
      ...item,
      latitude: item.latitude ? parseFloat(item.latitude) : null,
      longitude: item.longitude ? parseFloat(item.longitude) : null,
    }));
  },

  async getEvent(slugOrId: string): Promise<EventItem | undefined> {
    try {
      const item = await fetchJson<any>(`events/${slugOrId}/`);
      return {
        ...item,
        latitude: item.latitude ? parseFloat(item.latitude) : null,
        longitude: item.longitude ? parseFloat(item.longitude) : null,
      };
    } catch {
      return undefined;
    }
  },

  // Businesses (Hotels & Restaurants)
  async getBusinesses(params?: { type?: string; price_band?: string }): Promise<Business[]> {
    const q = new URLSearchParams();
    if (params?.type) q.set('type', params.type);
    if (params?.price_band && params.price_band !== 'all') q.set('price_band', params.price_band);

    const qs = q.toString() ? `?${q.toString()}` : '';
    const data = await fetchJson<any>(`businesses/${qs}`);
    return unwrapResults<any>(data).map((item) => ({
      ...item,
      category: item.category_details || (typeof item.category === 'object' ? item.category : null),
      latitude: item.latitude ? parseFloat(item.latitude) : null,
      longitude: item.longitude ? parseFloat(item.longitude) : null,
    }));
  },

  async getBusiness(slugOrId: string): Promise<Business | undefined> {
    try {
      const item = await fetchJson<any>(`businesses/${slugOrId}/`);
      return {
        ...item,
        category: item.category_details || (typeof item.category === 'object' ? item.category : null),
        latitude: item.latitude ? parseFloat(item.latitude) : null,
        longitude: item.longitude ? parseFloat(item.longitude) : null,
      };
    } catch {
      return undefined;
    }
  },

  // Tour Guides & Experiences
  async getGuides(): Promise<Guide[]> {
    const data = await fetchJson<any>('guides/');
    return unwrapResults<Guide>(data);
  },

  async getGuide(slugOrId: string): Promise<Guide | undefined> {
    try {
      return await fetchJson<Guide>(`guides/${slugOrId}/`);
    } catch {
      return undefined;
    }
  },

  async getExperiences(): Promise<Experience[]> {
    const data = await fetchJson<any>('experiences/');
    return unwrapResults<any>(data).map((item) => ({
      ...item,
      duration_hours: item.duration_hours ? parseFloat(item.duration_hours) : null,
      price_ngn: item.price_ngn ? parseFloat(item.price_ngn) : null,
    }));
  },

  async getExperience(slugOrId: string): Promise<Experience | undefined> {
    try {
      const item = await fetchJson<any>(`experiences/${slugOrId}/`);
      return {
        ...item,
        duration_hours: item.duration_hours ? parseFloat(item.duration_hours) : null,
        price_ngn: item.price_ngn ? parseFloat(item.price_ngn) : null,
      };
    } catch {
      return undefined;
    }
  },

  async getBookings(): Promise<BookingRequest[]> {
    const data = await fetchJson<any>('bookings/');
    return unwrapResults<BookingRequest>(data);
  },

  async createBooking(booking: Omit<BookingRequest, 'id' | 'status' | 'created_at'>): Promise<BookingRequest> {
    const payload = {
      experience: booking.experience_id,
      guide: booking.guide_id || null,
      visitor_name: booking.visitor_name,
      visitor_email: booking.visitor_email,
      visitor_phone: booking.visitor_phone,
      preferred_date: booking.preferred_date,
      party_size: booking.party_size,
      special_requests: booking.special_requests || '',
      status: 'pending',
    };

    return await fetchJson<BookingRequest>('bookings/', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async updateBookingStatus(id: string, status: string): Promise<BookingRequest> {
    return await fetchJson<BookingRequest>(`bookings/${id}/`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  },

  // Transport
  async getTransportProviders(): Promise<TransportProvider[]> {
    const data = await fetchJson<any>('transport-providers/');
    return unwrapResults<TransportProvider>(data);
  },

  async getTransportRequests(): Promise<TransportRequest[]> {
    const data = await fetchJson<any>('transport-requests/');
    return unwrapResults<TransportRequest>(data);
  },

  async createTransportRequest(req: Omit<TransportRequest, 'id' | 'status' | 'created_at'>): Promise<TransportRequest> {
    const payload = {
      service_type: req.service_type,
      provider: req.provider_id || null,
      pickup_location: req.pickup_location,
      destination: req.destination,
      pickup_date: req.pickup_date,
      pickup_time: req.pickup_time,
      passengers: req.passengers,
      contact_name: req.contact_name,
      contact_phone: req.contact_phone,
      contact_email: req.contact_email,
      special_notes: req.special_notes || '',
      status: 'pending',
    };

    return await fetchJson<TransportRequest>('transport-requests/', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async updateTransportStatus(id: string, status: string): Promise<TransportRequest> {
    return await fetchJson<TransportRequest>(`transport-requests/${id}/`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  },

  // Marketplace
  async getProducts(): Promise<Product[]> {
    const data = await fetchJson<any>('products/');
    return unwrapResults<any>(data).map((item) => ({
      ...item,
      price_ngn: item.price_ngn ? parseFloat(item.price_ngn) : null,
    }));
  },

  async createProduct(product: Partial<Product>): Promise<Product> {
    return await fetchJson<Product>('products/', {
      method: 'POST',
      body: JSON.stringify(product),
    });
  },

  async getOrders(): Promise<MarketplaceOrder[]> {
    const data = await fetchJson<any>('orders/');
    return unwrapResults<MarketplaceOrder>(data);
  },

  async createMarketplaceOrder(order: Omit<MarketplaceOrder, 'id' | 'status' | 'created_at'>): Promise<MarketplaceOrder> {
    const payload = {
      product: order.product_id,
      quantity: order.quantity,
      buyer_name: order.buyer_name,
      buyer_phone: order.buyer_phone,
      buyer_email: order.buyer_email,
      delivery_address: order.delivery_address,
      notes: order.notes || '',
      status: 'pending',
    };

    return await fetchJson<MarketplaceOrder>('orders/', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async updateOrderStatus(id: string, status: string): Promise<MarketplaceOrder> {
    return await fetchJson<MarketplaceOrder>(`orders/${id}/`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  },

  // Digital Passport Stamps
  async getPassportStamps(): Promise<PassportStamp[]> {
    const data = await fetchJson<any>('passport-stamps/');
    return unwrapResults<PassportStamp>(data);
  },

  async claimPassportStamp(stamp: Omit<PassportStamp, 'id' | 'claimed_at'>): Promise<{ success: boolean; message: string; stamp?: PassportStamp }> {
    const payload = {
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
      return { success: true, message: 'Stamp recorded on BENIN360 database!', stamp: created };
    } catch (err: any) {
      return { success: false, message: err?.message || 'Could not record passport stamp' };
    }
  },

  // Platform Metrics
  async getMetrics(): Promise<PlatformMetrics> {
    try {
      const data = await fetchJson<any>('metrics/');
      return {
        totalVisitors: data.total_visitors ?? 0,
        totalEventViews: data.total_event_views ?? 0,
        totalAttractionViews: data.total_attraction_views ?? 0,
        totalEnquiries: data.total_enquiries ?? 0,
        totalBookings: data.total_bookings ?? 0,
        totalPassportClaims: data.total_passport_claims ?? 0,
        verifiedCount: data.verified_count ?? 0,
        pendingVerificationCount: data.pending_count ?? 0,
      };
    } catch {
      return {
        totalVisitors: 0,
        totalEventViews: 0,
        totalAttractionViews: 0,
        totalEnquiries: 0,
        totalBookings: 0,
        totalPassportClaims: 0,
        verifiedCount: 0,
        pendingVerificationCount: 0,
      };
    }
  },

  // Verification Management (Admin)
  async updateVerification(type: 'attraction' | 'event' | 'business', id: string, status: 'verified' | 'rejected' | 'pending') {
    const endpoint = type === 'attraction' ? 'attractions' : type === 'event' ? 'events' : 'businesses';
    return await fetchJson(`${endpoint}/${id}/`, {
      method: 'PATCH',
      body: JSON.stringify({
        verification_status: status,
        is_verified: status === 'verified',
      }),
    });
  },

  // AI Assistant Chat
  async askAI(message: string): Promise<{ reply: string; source: string; disclaimer?: string }> {
    try {
      return await fetchJson<{ reply: string; source: string; disclaimer?: string }>('ai/chat/', {
        method: 'POST',
        body: JSON.stringify({ message }),
      });
    } catch {
      return {
        reply: `Thank you for asking about "${message}". Explore the verified live directory on BENIN360 for the Palace of the Oba of Benin, Igun Street Bronze Casters, and upcoming Coronation Anniversary events.`,
        source: 'benin360_backend_ai',
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
        provider: 'Cloudflare R2',
        bucket_name: '(not connected)',
        endpoint_url: '',
        public_url: '',
        storage_type: 'offline',
      };
    }
  },

  getStoredUser,
  getStoredToken,
};
