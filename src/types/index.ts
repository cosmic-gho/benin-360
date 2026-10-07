export interface Category {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  icon: string | null;
  sort_order: number;
}

export interface Attraction {
  id: string;
  slug: string;
  name: string;
  category_id: string | null;
  short_desc: string | null;
  description: string | null;
  latitude: number | null;
  longitude: number | null;
  address: string | null;
  opening_hours: string | null;
  visitor_tips: string | null;
  image_url: string | null;
  gallery: string[];
  is_featured: boolean;
  is_verified: boolean;
  verification_status: string;
  source_name: string | null;
  source_url: string | null;
  verified_at: string | null;
  created_at: string;
  category?: Category | null;
}

export interface EventItem {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  start_date: string;
  end_date: string | null;
  start_time: string | null;
  end_time: string | null;
  venue: string | null;
  address: string | null;
  latitude: number | null;
  longitude: number | null;
  category: string | null;
  cover_image: string | null;
  source_name: string | null;
  source_url: string | null;
  verification_status: string;
  verified_at: string | null;
  is_featured: boolean;
  related_attraction_id: string | null;
  created_at: string;
}

export interface Business {
  id: string;
  slug: string;
  name: string;
  category_id: string | null;
  business_type: string;
  short_desc: string | null;
  description: string | null;
  address: string | null;
  latitude: number | null;
  longitude: number | null;
  phone: string | null;
  email: string | null;
  website: string | null;
  price_band: string | null;
  image_url: string | null;
  is_featured: boolean;
  is_verified: boolean;
  verification_status: string;
  created_at: string;
  category?: Category | null;
}

export interface Guide {
  id: string;
  slug: string;
  name: string;
  bio: string | null;
  languages: string[];
  specialties: string[];
  avatar_url: string | null;
  rating: number;
  review_count: number;
  is_verified: boolean;
  phone: string | null;
  email: string | null;
  created_at: string;
}

export interface Experience {
  id: string;
  slug: string;
  title: string;
  guide_id: string;
  description: string | null;
  duration_hours: number | null;
  price_ngn: number | null;
  image_url: string | null;
  is_active: boolean;
  created_at: string;
  guide?: Guide | null;
}

export interface TransportProvider {
  id: string;
  slug: string;
  name: string;
  service_type: string | null;
  description: string | null;
  phone: string | null;
  email: string | null;
  area_covered: string | null;
  is_verified: boolean;
  created_at: string;
}

export interface Product {
  id: string;
  slug: string;
  title: string;
  vendor_name: string | null;
  category: string | null;
  description: string | null;
  price_ngn: number | null;
  image_url: string | null;
  is_available: boolean;
  is_featured: boolean;
  created_at: string;
}

export interface Review {
  id: string;
  target_type: string;
  target_id: string;
  author_name: string;
  rating: number;
  comment: string | null;
  created_at: string;
}

export interface PassportStamp {
  id: string;
  visitor_name: string;
  stamp_type: string;
  target_id: string;
  target_name: string;
  claimed_at: string;
}

export interface BookingRequest {
  id: string;
  experience_id: string;
  guide_id?: string;
  visitor_name: string;
  visitor_email: string;
  visitor_phone: string;
  preferred_date: string;
  party_size: number;
  special_requests?: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  created_at: string;
  experience?: Experience;
}

export interface TransportRequest {
  id: string;
  service_type: 'airport_transfer' | 'private_driver' | 'event_shuttle' | 'group_charter';
  provider_id?: string;
  pickup_location: string;
  destination: string;
  pickup_date: string;
  pickup_time: string;
  passengers: number;
  contact_name: string;
  contact_phone: string;
  contact_email: string;
  special_notes?: string;
  status: 'pending' | 'accepted' | 'completed' | 'cancelled';
  created_at: string;
}

export interface MarketplaceOrder {
  id: string;
  product_id: string;
  quantity: number;
  buyer_name: string;
  buyer_phone: string;
  buyer_email: string;
  delivery_address: string;
  notes?: string;
  status: 'pending' | 'contacted' | 'fulfilled' | 'cancelled';
  created_at: string;
  product?: Product;
}

export interface PassportBadge {
  id: string;
  slug: string;
  title: string;
  description: string;
  icon: string;
  requirementCount: number;
  category?: string;
}

export interface PlatformMetrics {
  totalVisitors: number;
  totalEventViews: number;
  totalAttractionViews: number;
  totalEnquiries: number;
  totalBookings: number;
  totalPassportClaims: number;
  verifiedCount: number;
  pendingVerificationCount: number;
}

export type UserRole =
  | 'visitor'
  | 'guild_artisan'
  | 'business_operator'
  | 'tour_guide'
  | 'transport_driver'
  | 'admin';

export interface GuildArtisanProfile {
  id: string;
  guild_name: string;
  workshop_address: string;
  artisan_title?: string;
  guild_id_number?: string;
  specialty_craft: string;
  is_guild_master: boolean;
}

export interface BusinessProfile {
  id: string;
  company_name: string;
  cac_number?: string;
  business_type: string;
  official_phone?: string;
  official_email?: string;
  address?: string;
  website?: string;
}

export interface TourGuideProfile {
  id: string;
  accreditation_number?: string;
  languages: string[];
  specialties: string[];
  years_experience: number;
}

export interface User {
  id: string;
  username: string;
  email: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  role: UserRole;
  is_verified_entity: boolean;
  avatar_url?: string;
  bio?: string;
  artisan_profile?: GuildArtisanProfile | null;
  business_profile?: BusinessProfile | null;
  guide_profile?: TourGuideProfile | null;
  date_joined?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
  message?: string;
}

export interface UploadResponse {
  success: boolean;
  url: string;
  key: string;
  filename: string;
  size: number;
  content_type: string;
  storage: 'cloudflare_r2' | 'local_fallback';
  bucket?: string;
  message?: string;
}

export interface StorageStatusResponse {
  configured: boolean;
  provider: string;
  bucket_name: string;
  endpoint_url: string;
  public_url: string;
  storage_type: string;
}
