# BENIN360

### Digital Heritage, Tourism & Visitor Experience Platform
> **Positioning:** *"Connecting the World to Benin."*  
> **Attribution:** Powered by Patotec Software Solutions Ltd.

---

## 1. Project Vision

**BENIN360** is a mobile-first digital visitor platform designed to help Nigerians, diaspora visitors, and international cultural tourists discover, navigate, and experience Benin City and the wider Benin Kingdom.

The immediate launch opportunity is the **10th Coronation Anniversary of the Oba of Benin**, while the architecture is engineered as a year-round tourism, heritage, experience, and local-business marketplace.

---

## 2. Core Modules Implemented

1. **Public Homepage**: Hero message, 10th Coronation Anniversary CTA, Explore Benin directories, live counts, and cultural highlights.
2. **Coronation Event Hub & Event Detail**: Official/verified event listings with start/end time, venue, coordinates, description, source attribution, and **Add-to-Calendar** (Google Calendar & iCal `.ics` download).
3. **Interactive GIS Map**: Mobile-friendly coordinate map with category filters (Royal Heritage, Museums, Culture, Food, Hotels, Events, Shopping, Services), coordinates, detail preview drawers, and directions.
4. **Heritage & Attractions Directory & Detail Profiles**: Comprehensive profiles for the Palace of the Oba of Benin, National Museum, Igun Bronze Casters Street, Benin Moats (Iya), Emotan Statue, Victor Uwaifo Sound City, Holy Aruosa Cathedral, and Ogiamien Ancient Palace.
5. **Hotels & Accommodation Directory**: Search/filter directory for verified lodging across Benin City (Protea Hotel Select, Randekhi Royal, Best Western, Golden Tulip) with price bands and direct contact details.
6. **Benin Food & Culinary Guide**: Traditional Edo cuisine guide (Banga Soup & Starch, Owo Soup, Black Soup / Omoebe, Pepper Soup) and authentic local restaurants.
7. **Tour Guide & Experience Marketplace**: Guide profiles (languages, ratings, credentials), bookable packages, and booking request flow.
8. **Transport & Airport Transfer Module**: Airport pick-ups from Benin Airport (BNI), private chauffeurs, and group coaster charters with visitor request management.
9. **Artisan Marketplace**: Authentic Benin bronze casting replicas, royal coral beads (*Ivie*), traditional velvet regalia, books, and order/enquiry flows.
10. **AI Benin Visitor Assistant**: Interactive chat interface answering questions on itineraries, etiquette, palace dress code, transport, and cultural history using curated platform intelligence.
11. **Digital Visitor Passport**: Interactive visitor account with digital stamps/badges, duplicate claim validation, progress tracking, and printable/downloadable **Certificate of Heritage Exploration**.
12. **Admin Operations Dashboard**: Management console for reviewing pending listings, approving/rejecting verification status, managing guide bookings and driver requests, and monitoring real-time platform KPIs.
13. **QR Launch & Marketing System**: Custom QR generator with printable display standees and posters ("COMING TO BENIN FOR THE CORONATION? SCAN TO DISCOVER BENIN").
14. **PWA & Mobile Networks Optimization**: Web App Manifest (`manifest.json`), service worker offline caching strategy, and fast loading.
15. **SEO & Structured Data**: Meta tags, Open Graph, Twitter Cards, robots.txt, sitemap.xml, and schema.org JSON-LD.
16. **Data & Trust Integrity**: Verification status badges (`verified`, `pending`, `unverified`, `rejected`), source citations, and clear disclaimers.

---

## 3. Technology Stack

- **Frontend**: Next.js / React 18 + TypeScript + Tailwind CSS + Lucide Icons + Vite
- **Backend**: Django 5.x + Django REST Framework + PostgreSQL / SQLite
- **Architecture**: Monorepo with clearly separated frontend and backend services
- **Offline / State**: Resilient data store with local storage synchronization and optional remote Supabase / Django REST API integration

---

## 4. Repository Structure

```text
benin-360-main/
├── backend/                             # Django REST Framework Backend
│   ├── benin360_backend/                # Project settings & URL routing
│   │   ├── settings.py
│   │   ├── urls.py
│   │   └── wsgi.py
│   ├── core/                            # Core API app
│   │   ├── models.py                    # 14 data models (Attraction, Event, etc.)
│   │   ├── serializers.py               # DRF serializers
│   │   ├── views.py                     # ViewSets, AI chat & Metrics
│   │   ├── urls.py                      # /api/v1/ routing
│   │   ├── admin.py                     # Customized Django admin with actions
│   │   └── management/commands/
│   │       └── seed_benin360.py         # Database seeding script
│   ├── manage.py
│   ├── requirements.txt
│   └── README.md
├── src/                                 # Frontend React/TS Application
│   ├── components/
│   │   ├── Navbar.tsx                   # Responsive navigation with QR & AI links
│   │   ├── Footer.tsx                   # Footer with trust disclaimers
│   │   └── ui.tsx                       # Badges, banners, spinners, alerts
│   ├── lib/
│   │   ├── calendar.ts                  # Google Calendar & iCal .ics generator
│   │   ├── dataStore.ts                 # Resilient data layer & seed database
│   │   ├── router.ts                    # Hash router supporting all 16 modules
│   │   ├── supabase.ts                  # Supabase client connector
│   │   └── utils.ts                     # Currency & date formatters
│   ├── pages/
│   │   ├── HomePage.tsx                 # Landing page
│   │   ├── EventsPage.tsx               # Coronation & cultural events hub
│   │   ├── EventDetailPage.tsx          # Single event page with calendar action
│   │   ├── AttractionsPage.tsx          # Heritage sites directory
│   │   ├── AttractionDetailPage.tsx     # Landmark profile & stamp collection
│   │   ├── MapPage.tsx                  # Interactive GIS coordinate map
│   │   ├── BusinessDirectoryPage.tsx    # Hotels & services directory
│   │   ├── FoodGuidePage.tsx            # Benin culinary guide & dining
│   │   ├── GuidesPage.tsx               # Tour guides directory
│   │   ├── GuideDetailPage.tsx          # Guide profile & booking request
│   │   ├── TransportPage.tsx            # Airport transfer & chauffeur booking
│   │   ├── MarketplacePage.tsx          # Artisan crafts, beads & orders
│   │   ├── PassportPage.tsx             # Digital passport & visit certificate
│   │   ├── AIAssistantPage.tsx          # Curated AI guide chat
│   │   ├── AdminDashboardPage.tsx       # Content moderation & metrics
│   │   └── QRLaunchPage.tsx             # Printable QR poster generator
│   ├── App.tsx                          # Core application router
│   └── main.tsx
├── public/
│   ├── manifest.json                    # PWA installation manifest
│   ├── robots.txt                       # Search engine crawler directives
│   ├── sitemap.xml                      # SEO discovery sitemap
│   └── sw.js                            # Service worker offline caching
├── .env.example
├── package.json
└── README.md
```

---

## 5. Getting Started

### Running the Frontend

```bash
# Install dependencies
npm install

# Start the local development server
npm run dev

# Or build for production
npm run build
```

Open `http://localhost:5173` in your browser.

### Running the Backend

```bash
cd backend

# Create virtual environment
python -m venv venv
.\venv\Scripts\Activate.ps1   # (Windows PowerShell)

# Install Python requirements
pip install -r requirements.txt

# Run migrations and seed data
python manage.py makemigrations
python manage.py migrate
python manage.py seed_benin360

# Start Django server
python manage.py runserver 8000
```

---

## 6. Trust & Content Integrity

Per the product brief:
- The platform **must not** imply official affiliation with the Oba's Palace, Coronation Anniversary Secretariat, or government unless an explicit confirmed partnership exists.
- Event information clearly displays its **source name**, **reference URL**, and **verification status** (`verified`, `pending`, `unverified`, `rejected`).
- Accommodation availability is never fabricated—direct booking and inquiry links are provided.
