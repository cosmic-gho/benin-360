/*
# BENIN360 Core Database Schema

## Overview
Creates the foundational database tables for the BENIN360 digital heritage, tourism & visitor experience platform.
This is a public-content platform (no sign-in required to browse), so all tables use anon+authenticated read access.
Write access (insert/update/delete) is restricted to authenticated users for user-generated content like reviews and passport stamps.

## New Tables

### categories
- Taxonomy for attractions, businesses, and map points (e.g., Royal Heritage, Museums, Food, Hotels)
- id, slug, name, description, icon, sort_order

### attractions
- Heritage sites, museums, cultural landmarks in Benin City
- id, slug, name, category_id, short_desc, description, latitude, longitude, address, opening_hours, visitor_tips, image_url, gallery (array), is_featured, is_verified, verification_status, source_name, source_url, verified_at, created_at

### events
- Event listings (coronation anniversary and year-round)
- id, slug, title, description, start_date, end_date, start_time, end_time, venue, address, latitude, longitude, category, cover_image, source_name, source_url, verification_status, verified_at, is_featured, related_attraction_id, created_at

### businesses
- General business directory (hotels, restaurants, transport, shops, services)
- id, slug, name, category_id, business_type (hotel/restaurant/transport/shop/service), short_desc, description, address, latitude, longitude, phone, email, website, price_band, image_url, is_featured, is_verified, verification_status, created_at

### guides
- Tour guide profiles
- id, slug, name, bio, languages (array), specialties (array), avatar_url, rating, review_count, is_verified, phone, email, created_at

### experiences
- Bookable tour/cultural experiences offered by guides
- id, slug, title, guide_id, description, duration_hours, price_ngn, image_url, is_active, created_at

### transport_providers
- Transport/driver services
- id, slug, name, service_type, description, phone, email, area_covered, is_verified, created_at

### products
- Marketplace items (crafts, beads, fashion, art, souvenirs)
- id, slug, title, vendor_name, category, description, price_ngn, image_url, is_available, is_featured, created_at

### reviews
- User reviews for attractions, businesses, guides, experiences
- id, target_type, target_id, author_name, rating (1-5), comment, created_at

### passport_stamps
- Visitor digital passport stamps (claimed by visitors)
- id, visitor_name, stamp_type (attraction/event), target_id, target_name, claimed_at

## Security
- RLS enabled on ALL tables
- SELECT: public (anon + authenticated) on all tables
- INSERT: authenticated only for reviews and passport_stamps
- UPDATE/DELETE: restricted (admin-level, not exposed via anon key)
*/

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  name text NOT NULL,
  description text,
  icon text,
  sort_order integer DEFAULT 0
);

-- Attractions table
CREATE TABLE IF NOT EXISTS attractions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  name text NOT NULL,
  category_id uuid REFERENCES categories(id) ON DELETE SET NULL,
  short_desc text,
  description text,
  latitude numeric(10, 7),
  longitude numeric(10, 7),
  address text,
  opening_hours text,
  visitor_tips text,
  image_url text,
  gallery text[] DEFAULT '{}',
  is_featured boolean DEFAULT false,
  is_verified boolean DEFAULT false,
  verification_status text DEFAULT 'unverified' CHECK (verification_status IN ('unverified', 'pending', 'verified', 'rejected')),
  source_name text,
  source_url text,
  verified_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Events table
CREATE TABLE IF NOT EXISTS events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  title text NOT NULL,
  description text,
  start_date date NOT NULL,
  end_date date,
  start_time text,
  end_time text,
  venue text,
  address text,
  latitude numeric(10, 7),
  longitude numeric(10, 7),
  category text,
  cover_image text,
  source_name text,
  source_url text,
  verification_status text DEFAULT 'unverified' CHECK (verification_status IN ('unverified', 'pending', 'verified', 'rejected')),
  verified_at timestamptz,
  is_featured boolean DEFAULT false,
  related_attraction_id uuid REFERENCES attractions(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now()
);

-- Businesses table
CREATE TABLE IF NOT EXISTS businesses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  name text NOT NULL,
  category_id uuid REFERENCES categories(id) ON DELETE SET NULL,
  business_type text NOT NULL CHECK (business_type IN ('hotel', 'restaurant', 'transport', 'shop', 'service')),
  short_desc text,
  description text,
  address text,
  latitude numeric(10, 7),
  longitude numeric(10, 7),
  phone text,
  email text,
  website text,
  price_band text CHECK (price_band IN ('budget', 'mid-range', 'premium', 'luxury')),
  image_url text,
  is_featured boolean DEFAULT false,
  is_verified boolean DEFAULT false,
  verification_status text DEFAULT 'unverified' CHECK (verification_status IN ('unverified', 'pending', 'verified', 'rejected')),
  created_at timestamptz DEFAULT now()
);

-- Guides table
CREATE TABLE IF NOT EXISTS guides (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  name text NOT NULL,
  bio text,
  languages text[] DEFAULT '{}',
  specialties text[] DEFAULT '{}',
  avatar_url text,
  rating numeric(2, 1) DEFAULT 0,
  review_count integer DEFAULT 0,
  is_verified boolean DEFAULT false,
  phone text,
  email text,
  created_at timestamptz DEFAULT now()
);

-- Experiences table
CREATE TABLE IF NOT EXISTS experiences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  title text NOT NULL,
  guide_id uuid REFERENCES guides(id) ON DELETE CASCADE,
  description text,
  duration_hours numeric(4, 1),
  price_ngn numeric(10, 2),
  image_url text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Transport providers table
CREATE TABLE IF NOT EXISTS transport_providers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  name text NOT NULL,
  service_type text,
  description text,
  phone text,
  email text,
  area_covered text,
  is_verified boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Products table
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  title text NOT NULL,
  vendor_name text,
  category text,
  description text,
  price_ngn numeric(10, 2),
  image_url text,
  is_available boolean DEFAULT true,
  is_featured boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  target_type text NOT NULL CHECK (target_type IN ('attraction', 'business', 'guide', 'experience')),
  target_id uuid NOT NULL,
  author_name text NOT NULL,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment text,
  created_at timestamptz DEFAULT now()
);

-- Passport stamps table
CREATE TABLE IF NOT EXISTS passport_stamps (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  visitor_name text NOT NULL,
  stamp_type text NOT NULL CHECK (stamp_type IN ('attraction', 'event')),
  target_id uuid NOT NULL,
  target_name text NOT NULL,
  claimed_at timestamptz DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE attractions ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE guides ENABLE ROW LEVEL SECURITY;
ALTER TABLE experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE transport_providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE passport_stamps ENABLE ROW LEVEL SECURITY;

-- Categories: public read
DROP POLICY IF EXISTS "public_read_categories" ON categories;
CREATE POLICY "public_read_categories" ON categories FOR SELECT TO anon, authenticated USING (true);

-- Attractions: public read
DROP POLICY IF EXISTS "public_read_attractions" ON attractions;
CREATE POLICY "public_read_attractions" ON attractions FOR SELECT TO anon, authenticated USING (true);

-- Events: public read
DROP POLICY IF EXISTS "public_read_events" ON events;
CREATE POLICY "public_read_events" ON events FOR SELECT TO anon, authenticated USING (true);

-- Businesses: public read
DROP POLICY IF EXISTS "public_read_businesses" ON businesses;
CREATE POLICY "public_read_businesses" ON businesses FOR SELECT TO anon, authenticated USING (true);

-- Guides: public read
DROP POLICY IF EXISTS "public_read_guides" ON guides;
CREATE POLICY "public_read_guides" ON guides FOR SELECT TO anon, authenticated USING (true);

-- Experiences: public read
DROP POLICY IF EXISTS "public_read_experiences" ON experiences;
CREATE POLICY "public_read_experiences" ON experiences FOR SELECT TO anon, authenticated USING (true);

-- Transport providers: public read
DROP POLICY IF EXISTS "public_read_transport" ON transport_providers;
CREATE POLICY "public_read_transport" ON transport_providers FOR SELECT TO anon, authenticated USING (true);

-- Products: public read
DROP POLICY IF EXISTS "public_read_products" ON products;
CREATE POLICY "public_read_products" ON products FOR SELECT TO anon, authenticated USING (true);

-- Reviews: public read, authenticated insert
DROP POLICY IF EXISTS "public_read_reviews" ON reviews;
CREATE POLICY "public_read_reviews" ON reviews FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "auth_insert_reviews" ON reviews;
CREATE POLICY "auth_insert_reviews" ON reviews FOR INSERT TO authenticated WITH CHECK (true);

-- Passport stamps: public read, authenticated insert
DROP POLICY IF EXISTS "public_read_passport" ON passport_stamps;
CREATE POLICY "public_read_passport" ON passport_stamps FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "auth_insert_passport" ON passport_stamps;
CREATE POLICY "auth_insert_passport" ON passport_stamps FOR INSERT TO authenticated WITH CHECK (true);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_attractions_category ON attractions(category_id);
CREATE INDEX IF NOT EXISTS idx_attractions_featured ON attractions(is_featured);
CREATE INDEX IF NOT EXISTS idx_events_start_date ON events(start_date);
CREATE INDEX IF NOT EXISTS idx_events_featured ON events(is_featured);
CREATE INDEX IF NOT EXISTS idx_businesses_type ON businesses(business_type);
CREATE INDEX IF NOT EXISTS idx_businesses_category ON businesses(category_id);
CREATE INDEX IF NOT EXISTS idx_experiences_guide ON experiences(guide_id);
CREATE INDEX IF NOT EXISTS idx_reviews_target ON reviews(target_type, target_id);
CREATE INDEX IF NOT EXISTS idx_passport_target ON passport_stamps(visitor_name, stamp_type);
