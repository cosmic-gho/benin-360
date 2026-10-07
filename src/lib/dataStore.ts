import type {
  Category,
  Attraction,
  EventItem,
  Business,
  Guide,
  Experience,
  TransportProvider,
  Product,
  Review,
  PassportStamp,
  BookingRequest,
  TransportRequest,
  MarketplaceOrder,
  PassportBadge,
  PlatformMetrics
} from '@/types';

export const INITIAL_CATEGORIES: Category[] = [
  { id: 'cat-1', slug: 'royal-heritage', name: 'Royal Heritage', description: 'Palaces, historical monarchical monuments & royal shrines', icon: 'Crown', sort_order: 1 },
  { id: 'cat-2', slug: 'museums', name: 'Museums & Antiquities', description: 'Curated Benin bronzes, art galleries and national historical collections', icon: 'Landmark', sort_order: 2 },
  { id: 'cat-3', slug: 'culture', name: 'Living Culture & Guilds', description: 'Bronze casters street, ancient guilds, bead makers and festivals', icon: 'Palette', sort_order: 3 },
  { id: 'cat-4', slug: 'food', name: 'Edo Cuisine & Dining', description: 'Traditional Banga soup, Owo soup, Black soup, and top Benin restaurants', icon: 'UtensilsCrossed', sort_order: 4 },
  { id: 'cat-5', slug: 'hotels', name: 'Hotels & Accommodation', description: 'Verified lodging, boutique hotels and executive suites across Benin', icon: 'BedDouble', sort_order: 5 },
  { id: 'cat-6', slug: 'events', name: 'Events & Ceremonies', description: '10th Coronation Anniversary schedule and year-round cultural activities', icon: 'Calendar', sort_order: 6 },
  { id: 'cat-7', slug: 'shopping', name: 'Crafts & Souvenirs', description: 'Authentic Benin bronze replicas, coral beads, fashion and books', icon: 'ShoppingBag', sort_order: 7 },
  { id: 'cat-8', slug: 'services', name: 'Transport & Services', description: 'Airport pick-ups, private chauffeurs, logistics and tourism services', icon: 'Briefcase', sort_order: 8 },
];

export const INITIAL_ATTRACTIONS: Attraction[] = [
  {
    id: 'attr-1',
    slug: 'palace-of-the-oba-of-benin',
    name: 'Palace of the Oba of Benin',
    category_id: 'cat-1',
    short_desc: 'The historic royal residence and epicentre of the Benin Kingdom monarchical heritage.',
    description: 'The Royal Palace of the Oba of Benin is the sacred administrative and cultural seat of the Edo people, rebuilt by Oba Eweka II in 1914 on the grounds of the ancient palace complex. Listed as a UNESCO World Heritage site candidate, the palace houses centuries of intact traditions, royal courtiers, sacred guilds, and monarchical protocol. Visitors must observe cultural dress standards and respect palace photography regulations.',
    latitude: 6.3350,
    longitude: 5.6200,
    address: 'King\'s Square (Ring Road), Benin City, Edo State',
    opening_hours: 'Mon - Fri: 9:00 AM - 4:00 PM (Exterior guided courtyard tours by appointment; core royal chambers restricted)',
    visitor_tips: 'Modest attire required. Avoid black clothing or items deemed incompatible with palace protocols. Photography is permitted only in designated outer court areas with guide approval.',
    image_url: 'https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1577717903315-1691ae25ab3f?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=80'
    ],
    is_featured: true,
    is_verified: true,
    verification_status: 'verified',
    source_name: 'Benin Traditional Council Archives & National Commission for Museums and Monuments (NCMM)',
    source_url: 'https://ncmm.gov.ng',
    verified_at: '2026-09-15T10:00:00Z',
    created_at: '2026-09-01T08:00:00Z',
  },
  {
    id: 'attr-2',
    slug: 'national-museum-benin-city',
    name: 'National Museum Benin City',
    category_id: 'cat-2',
    short_desc: 'Houses an invaluable collection of antique bronze castings, terracotta, ivory carvings and kingdom artifacts.',
    description: 'Located right in the historic King\'s Square (Ring Road) roundabout, the National Museum Benin City was opened in 1973. It contains three galleries showcasing authentic antiquities from the pre-colonial Benin Empire, including royal terracotta heads, bronze bells, iron weapons, and historical documentation detailing the Benin expedition of 1897 and subsequent repatriation efforts.',
    latitude: 6.3375,
    longitude: 5.6231,
    address: 'Ring Road Roundabout, City Centre, Benin City',
    opening_hours: 'Daily: 9:00 AM - 5:00 PM',
    visitor_tips: 'Guided educational tours are available at the reception desk. Flash photography inside galleries requires special museum authorization.',
    image_url: 'https://images.unsplash.com/photo-1566127444979-b3d2b654e3d7?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1566127444979-b3d2b654e3d7?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1200&q=80'
    ],
    is_featured: true,
    is_verified: true,
    verification_status: 'verified',
    source_name: 'National Commission for Museums and Monuments (NCMM)',
    source_url: 'https://ncmm.gov.ng/national-museum-benin',
    verified_at: '2026-09-18T14:30:00Z',
    created_at: '2026-09-01T08:00:00Z',
  },
  {
    id: 'attr-3',
    slug: 'igun-bronze-casters-street',
    name: 'Igun Street (Guild of Bronze Casters)',
    category_id: 'cat-3',
    short_desc: 'UNESCO-recognized historic guild street where master artisans practice the sacred cire-perdue (lost wax) bronze casting.',
    description: 'Igun Street is the legendary home of the Igun Eronmwon guild, established by royal charter under Oba Oguola in the 13th century. By monarchical decree, the secret techniques of casting bronze and brass using the lost-wax process were conserved exclusively among family lineages on this street. Today, visitors can walk into workshops, watch artisans shape beeswax models and pour molten bronze, and purchase certified authentic replicas.',
    latitude: 6.3312,
    longitude: 5.6178,
    address: 'Igun Street, off Sakponba Road, Benin City',
    opening_hours: 'Mon - Sat: 8:00 AM - 6:30 PM',
    visitor_tips: 'Engage respectfully with artisans. You can commission bespoke works or buy certified bronze miniatures directly from guild shops.',
    image_url: 'https://images.unsplash.com/photo-1577717903315-1691ae25ab3f?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1577717903315-1691ae25ab3f?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=80'
    ],
    is_featured: true,
    is_verified: true,
    verification_status: 'verified',
    source_name: 'Igun Eronmwon Guild of Bronze Casters & Edo State Ministry of Arts, Culture & Tourism',
    source_url: 'https://edostate.gov.ng/tourism',
    verified_at: '2026-09-20T11:00:00Z',
    created_at: '2026-09-01T08:00:00Z',
  },
  {
    id: 'attr-4',
    slug: 'benin-moat-earthworks-iya',
    name: 'The Benin Moat & Earthworks (Iya)',
    category_id: 'cat-1',
    short_desc: 'Ancient defensive earthworks that once spanned over 16,000 kilometres—one of humanity\'s largest historical earth movements.',
    description: 'The Walls and Moats of Benin (known locally as Iya) were constructed in two major phases between the 9th and 15th centuries to protect the Kingdom against outside invaders. Recorded in the Guinness Book of Records as one of the largest man-made earthworks prior to the mechanical era, prominent sections remain visible along Sakponba Road, Siluko Road, and near the city perimeter.',
    latitude: 6.3420,
    longitude: 5.6140,
    address: 'Multiple access points: Sakponba Road / Ekenwan Road segments, Benin City',
    opening_hours: 'Open daylight hours (best visited with a certified local heritage guide)',
    visitor_tips: 'Wear sturdy walking footwear. We strongly recommend visiting with a registered tour guide who can guide you to preserved embankment viewpoints.',
    image_url: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1200&q=80'
    ],
    is_featured: true,
    is_verified: true,
    verification_status: 'verified',
    source_name: 'NCMM & Edo State Heritage Preservation Agency',
    source_url: 'https://ncmm.gov.ng',
    verified_at: '2026-09-21T09:15:00Z',
    created_at: '2026-09-01T08:00:00Z',
  },
  {
    id: 'attr-5',
    slug: 'emotan-statue',
    name: 'Emotan Statue & Memorial Shrine',
    category_id: 'cat-1',
    short_desc: 'Historic shrine honouring Emotan, the revered Edo trader and heroine who aided Oba Ewuare the Great.',
    description: 'Standing opposite Oba Market, this life-size bronze statue was sculpted by British artist John Danford and unveiled in 1954 by Oba Akenzua II. It commemorates Emotan, a beloved market woman of the 15th century whose courage, loyalty, and intelligence protected Prince Ogun (later Oba Ewuare the Great). Every newly initiated chief and royal bride visits the shrine to pay homage.',
    latitude: 6.3361,
    longitude: 5.6215,
    address: 'Opposite Oba Market, King\'s Square, Benin City',
    opening_hours: 'Accessible 24/7 (Public monument)',
    visitor_tips: 'Convenient to combine with a tour of the adjacent Oba Market and King\'s Square Ring Road landmarks.',
    image_url: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=80'
    ],
    is_featured: false,
    is_verified: true,
    verification_status: 'verified',
    source_name: 'Edo State Cultural Archives',
    source_url: 'https://edostate.gov.ng',
    verified_at: '2026-09-22T10:00:00Z',
    created_at: '2026-09-01T08:00:00Z',
  },
  {
    id: 'attr-6',
    slug: 'sir-victor-uwaifo-sound-city-museum',
    name: 'Sir Victor Uwaifo Sound City & Art Centre',
    category_id: 'cat-2',
    short_desc: 'A vibrant celebration of highlife music, kinetic sculpture, musical guitars and legendary Nigerian culture.',
    description: 'Founded by the iconic musical virtuoso, professor, and visual artist Sir Victor Uwaifo (MON), this multi-storey gallery houses his private collection of sculpted musical figures, hand-crafted double-neck guitars, patents, bronze busts, and memorabilia documenting five decades of Nigerian musical and artistic history.',
    latitude: 6.3510,
    longitude: 5.6320,
    address: 'College Road, off Ekehuan Road, Benin City',
    opening_hours: 'Mon - Sat: 10:00 AM - 5:00 PM',
    visitor_tips: 'A must-visit for music enthusiasts and fans of highlife, Joromi, and Nigerian visual arts.',
    image_url: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1200&q=80'
    ],
    is_featured: false,
    is_verified: true,
    verification_status: 'verified',
    source_name: 'Sir Victor Uwaifo Heritage Trust',
    source_url: 'https://victoruwaifo.example',
    verified_at: '2026-09-24T12:00:00Z',
    created_at: '2026-09-01T08:00:00Z',
  },
  {
    id: 'attr-7',
    slug: 'holy-aruosa-cathedral',
    name: 'Holy Aruosa Cathedral (Edo National Church)',
    category_id: 'cat-1',
    short_desc: 'The ancient indigenous Edo church founded in the 15th century by Oba Esigie with Portuguese emissaries.',
    description: 'Holy Aruosa Cathedral is an exceptional religious institution blending ancient monotheistic Benin cosmology (worship of Osanobua) with historic liturgical traditions dating back to the 15th century. Chants, prayers, and sermons are delivered strictly in the classical Edo language. The Oba of Benin is the traditional head of the church.',
    latitude: 6.3400,
    longitude: 5.6265,
    address: 'Akpakpava Road, Benin City',
    opening_hours: 'Sunday Services: 9:00 AM - 12:00 PM; Visiting hours weekdays by inquiry',
    visitor_tips: 'Sunday services provide an extraordinary musical and linguistic immersion into Edo liturgical hymns and royal horns.',
    image_url: 'https://images.unsplash.com/photo-1548625361-16a7f5a896aa?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1548625361-16a7f5a896aa?auto=format&fit=crop&w=1200&q=80'
    ],
    is_featured: false,
    is_verified: true,
    verification_status: 'verified',
    source_name: 'Holy Aruosa Administrative Council',
    source_url: 'https://edostate.gov.ng',
    verified_at: '2026-09-25T11:00:00Z',
    created_at: '2026-09-01T08:00:00Z',
  },
  {
    id: 'attr-8',
    slug: 'ogiamien-ancient-palace',
    name: 'Ogiamien Ancient Palace',
    category_id: 'cat-1',
    short_desc: 'Pre-1897 architectural landmark and home of Chief Ogiamien, surviving the punitive expedition intact.',
    description: 'The Chief Ogiamien Palace is one of the only pre-colonial royal compounds in Benin City that survived the 1897 British punitive expedition without destruction. Constructed with traditional fluted mud walls and timber structural beams, it provides rare architectural insight into pre-19th-century Edo domestic palatial engineering.',
    latitude: 6.3325,
    longitude: 5.6240,
    address: 'Sakponba Road, Benin City',
    opening_hours: 'Daily: 10:00 AM - 4:00 PM (Requires greeting and permission from the compound custodians)',
    visitor_tips: 'Ensure proper traditional protocol: greet the custodians politely and follow the guide\'s directions.',
    image_url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80'
    ],
    is_featured: true,
    is_verified: true,
    verification_status: 'verified',
    source_name: 'National Commission for Museums and Monuments (NCMM)',
    source_url: 'https://ncmm.gov.ng',
    verified_at: '2026-09-26T15:00:00Z',
    created_at: '2026-09-01T08:00:00Z',
  }
];

export const INITIAL_EVENTS: EventItem[] = [
  {
    id: 'evt-1',
    slug: '10th-coronation-royal-thanksgiving-symposium',
    title: '10th Coronation Anniversary: Grand Royal Symposium & Exhibition',
    description: 'An international academic symposium and ceremonial exhibition commemorating a decade on the sacred throne of the Benin Kingdom. Features presentations by prominent historians, display of newly repatriated artifacts, and addresses by dignitaries from Nigeria and the African diaspora.',
    start_date: '2026-10-18',
    end_date: '2026-10-20',
    start_time: '10:00 AM',
    end_time: '4:30 PM',
    venue: 'Oba Akenzua Cultural Centre / Banquet Grounds, Airport Road',
    address: 'Airport Road, GRA, Benin City',
    latitude: 6.3260,
    longitude: 5.6120,
    category: 'Anniversary Special',
    cover_image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80',
    source_name: 'Coronation Anniversary Preparatory Committee [Demo Record]',
    source_url: 'https://benin360.example/events/demo-record',
    verification_status: 'pending',
    verified_at: null,
    is_featured: true,
    related_attraction_id: 'attr-1',
    created_at: '2026-09-05T09:00:00Z',
  },
  {
    id: 'evt-2',
    slug: 'grand-durbar-procession-of-palace-chiefs',
    title: 'Grand Royal Procession of Palace Chiefs & Traditional Guilds',
    description: 'A breathtaking ceremonial procession featuring the noble societies of Benin (Uzama N\'Ihinron, Eghaevbo N\'Ore, and Eghaevbo N\'Ogbe) adorned in ceremonial scarlet and royal coral regalia, accompanied by historic bronze trumpeters and traditional drums.',
    start_date: '2026-10-22',
    end_date: '2026-10-22',
    start_time: '1:00 PM',
    end_time: '6:00 PM',
    venue: 'Palace Grounds to King\'s Square Environs',
    address: 'King\'s Square, Ring Road, Benin City',
    latitude: 6.3350,
    longitude: 5.6200,
    category: 'Ceremonial Procession',
    cover_image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=80',
    source_name: 'Traditional Guild Heritage Bureau [Demo Record]',
    source_url: 'https://benin360.example/events/demo-record',
    verification_status: 'pending',
    verified_at: null,
    is_featured: true,
    related_attraction_id: 'attr-1',
    created_at: '2026-09-05T09:30:00Z',
  },
  {
    id: 'evt-3',
    slug: 'igun-street-master-bronze-festival',
    title: 'Igun Street Master Bronze Casting Festival & Live Exhibition',
    description: 'An open-air guild showcase along historic Igun Street. Watch master craftsmen demonstrate live smelting and lost-wax casting, with public masterclasses and curated sales of authenticated bronze souvenirs.',
    start_date: '2026-10-24',
    end_date: '2026-10-26',
    start_time: '9:00 AM',
    end_time: '7:00 PM',
    venue: 'Igun Bronze Casters Guild Street',
    address: 'Igun Street, off Sakponba Road, Benin City',
    latitude: 6.3312,
    longitude: 5.6178,
    category: 'Art & Heritage',
    cover_image: 'https://images.unsplash.com/photo-1577717903315-1691ae25ab3f?auto=format&fit=crop&w=1200&q=80',
    source_name: 'Igun Eronmwon Guild Public Liaison [Demo Record]',
    source_url: 'https://benin360.example/events/demo-record',
    verification_status: 'pending',
    verified_at: null,
    is_featured: true,
    related_attraction_id: 'attr-3',
    created_at: '2026-09-06T11:00:00Z',
  },
  {
    id: 'evt-4',
    slug: 'edo-cuisine-and-flavours-food-fair',
    title: 'Benin Food & Culinary Heritage Gala',
    description: 'Celebrate authentic Edo gastronomy with master chefs and heritage cooks preparing Banga soup, Owo soup with ripe plantains, Black soup (Omoebe), roasted catfish, and indigenous palm wine pairings.',
    start_date: '2026-10-28',
    end_date: '2026-10-29',
    start_time: '12:00 PM',
    end_time: '9:00 PM',
    venue: 'Samuel Ogbemudia Stadium Grounds / Banquet Park',
    address: 'Stadium Road, Benin City',
    latitude: 6.3300,
    longitude: 5.6150,
    category: 'Food & Culture',
    cover_image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80',
    source_name: 'Edo Hospitality Association [Demo Record]',
    source_url: 'https://benin360.example/events/demo-record',
    verification_status: 'pending',
    verified_at: null,
    is_featured: false,
    related_attraction_id: null,
    created_at: '2026-09-08T14:00:00Z',
  },
  {
    id: 'evt-5',
    slug: 'edo-traditional-wrestling-festival',
    title: 'Edo Traditional Wrestling & Folk Arts Championship',
    description: 'High-energy traditional Edo wrestling bouts between representative athletes from Benin City, Esanland, and Afemai communities, accompanied by warrior flutes and heroic folk balladeers.',
    start_date: '2026-11-05',
    end_date: '2026-11-06',
    start_time: '2:00 PM',
    end_time: '7:00 PM',
    venue: 'Ogbe Stadium Indoor Arena',
    address: 'Stadium Road, Benin City',
    latitude: 6.3290,
    longitude: 5.6140,
    category: 'Sports & Folklore',
    cover_image: 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?auto=format&fit=crop&w=1200&q=80',
    source_name: 'Edo State Sports Commission [Demo Record]',
    source_url: 'https://benin360.example/events/demo-record',
    verification_status: 'pending',
    verified_at: null,
    is_featured: false,
    related_attraction_id: null,
    created_at: '2026-09-10T16:00:00Z',
  }
];

export const INITIAL_BUSINESSES: Business[] = [
  // Hotels
  {
    id: 'biz-1',
    slug: 'protea-hotel-select-benin-city',
    name: 'Protea Hotel by Marriott Benin City Select',
    category_id: 'cat-5',
    business_type: 'hotel',
    short_desc: 'International-standard hotel located in the quiet, secure Government Reserved Area (GRA).',
    description: 'Offering modern amenities, stylish air-conditioned rooms, a swimming pool, 24-hour business centre, and an upscale restaurant serving both international delicacies and local Nigerian fare. Ideal for business travellers and diaspora visitors.',
    address: 'Plot 4, Central School Road, GRA, Benin City',
    latitude: 6.3220,
    longitude: 5.6110,
    phone: '+234 52 293 000',
    email: 'reservations@proteabenin.example',
    website: 'https://www.marriott.com',
    price_band: 'luxury',
    image_url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80',
    is_featured: true,
    is_verified: true,
    verification_status: 'verified',
    created_at: '2026-09-01T08:00:00Z',
  },
  {
    id: 'biz-2',
    slug: 'randekhi-royal-hotel',
    name: 'Randekhi Royal Hotel',
    category_id: 'cat-5',
    business_type: 'hotel',
    short_desc: 'One of Benin City\'s most prominent premier hotels with lush gardens and regal decor.',
    description: 'Randekhi Royal Hotel combines executive comfort with Edo hospitality. Situated in the heart of GRA, it features suites, conferencing facilities, a swimming pool, and an outdoor poolside lounge.',
    address: '6, Moromi Street, off Ihama Road, GRA, Benin City',
    latitude: 6.3245,
    longitude: 5.6140,
    phone: '+234 803 555 0192',
    email: 'info@randekhiroyal.example',
    website: 'https://randekhiroyal.example',
    price_band: 'premium',
    image_url: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1200&q=80',
    is_featured: true,
    is_verified: true,
    verification_status: 'verified',
    created_at: '2026-09-01T08:00:00Z',
  },
  {
    id: 'biz-3',
    slug: 'best-western-plus-benin',
    name: 'Best Western Plus Benin City',
    category_id: 'cat-5',
    business_type: 'hotel',
    short_desc: 'Comfortable mid-to-premium business hotel situated minutes from Benin Airport.',
    description: 'Conveniently located for arrivals via Benin Airport (BNI). Offers soundproofed accommodations, high-speed WiFi, fitness center, and express airport transfers.',
    address: '10, Boundary Road, GRA, Benin City',
    latitude: 6.3190,
    longitude: 5.6090,
    phone: '+234 812 345 6789',
    email: 'stay@bestwesternbenin.example',
    website: 'https://www.bestwestern.com',
    price_band: 'mid-range',
    image_url: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80',
    is_featured: false,
    is_verified: true,
    verification_status: 'verified',
    created_at: '2026-09-02T10:00:00Z',
  },
  {
    id: 'biz-4',
    slug: 'golden-tulip-essential-benin',
    name: 'Golden Tulip Essential Benin',
    category_id: 'cat-5',
    business_type: 'hotel',
    short_desc: 'Chic modern hotel featuring executive workspaces, cocktails, and fine dining.',
    description: 'A contemporary business and lifestyle sanctuary with round-the-clock power, gourmet breakfast buffet, and dedicated diaspora concierge assistance.',
    address: 'Ihama Road, GRA, Benin City',
    latitude: 6.3270,
    longitude: 5.6160,
    phone: '+234 809 112 3344',
    email: 'concierge@goldentulipbenin.example',
    website: 'https://goldentulip.example',
    price_band: 'premium',
    image_url: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=80',
    is_featured: true,
    is_verified: true,
    verification_status: 'verified',
    created_at: '2026-09-03T11:00:00Z',
  },

  // Restaurants
  {
    id: 'biz-5',
    slug: 'kq-restaurant-and-lounge',
    name: 'K&Q Restaurant & Cultural Lounge',
    category_id: 'cat-4',
    business_type: 'restaurant',
    short_desc: 'Renowned for Edo delicacies: authentic Banga with Starch, Owo soup, and fresh catfish pepper soup.',
    description: 'A benchmark culinary destination in Benin City where visitors can experience traditional Edo banqueting in air-conditioned comfort or outdoor cabanas. Serves freshly pounded yam, Owo soup with potash & smoked fish, and rich Banga soup.',
    address: 'Ihama Road, GRA, Benin City',
    latitude: 6.3260,
    longitude: 5.6150,
    phone: '+234 802 888 1234',
    email: 'info@kqrestaurant.example',
    website: 'https://kqrestaurant.example',
    price_band: 'mid-range',
    image_url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80',
    is_featured: true,
    is_verified: true,
    verification_status: 'verified',
    created_at: '2026-09-01T08:00:00Z',
  },
  {
    id: 'biz-6',
    slug: 'mama-eki-traditional-kitchen',
    name: 'Mama Eki Traditional Edo Kitchen',
    category_id: 'cat-4',
    business_type: 'restaurant',
    short_desc: 'Famed for traditional Edo Black Soup (Omoebe) and bushmeat delicacies cooked over woodfire.',
    description: 'An iconic local kitchen cherished by residents and cultural explorers for deeply authentic home-style Edo flavours. Their Black Soup simmered with scent leaves and bitter leaf is widely celebrated across the city.',
    address: 'Airport Road, near Ogba Zoo Junction, Benin City',
    latitude: 6.3150,
    longitude: 5.6080,
    phone: '+234 803 777 9900',
    email: 'mamaeki@example.com',
    website: null,
    price_band: 'budget',
    image_url: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80',
    is_featured: true,
    is_verified: true,
    verification_status: 'verified',
    created_at: '2026-09-02T12:00:00Z',
  },
  {
    id: 'biz-7',
    slug: 'bini-heritage-garden-restaurant',
    name: 'Bini Heritage Garden & Grill',
    category_id: 'cat-4',
    business_type: 'restaurant',
    short_desc: 'Lush garden restaurant serving grilled fish, goat meat pepper soup, and cold palm wine.',
    description: 'A serene open-air setting perfect for relaxing evening dinners, family reunions, and listening to live acoustic highlife music on weekend evenings.',
    address: 'Boundary Road, GRA, Benin City',
    latitude: 6.3210,
    longitude: 5.6130,
    phone: '+234 818 444 5566',
    email: 'garden@biniheritage.example',
    website: 'https://biniheritage.example',
    price_band: 'mid-range',
    image_url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80',
    is_featured: false,
    is_verified: true,
    verification_status: 'verified',
    created_at: '2026-09-04T15:00:00Z',
  }
];

export const INITIAL_GUIDES: Guide[] = [
  {
    id: 'guide-1',
    slug: 'osaro-obasogie',
    name: 'Osaro Obasogie',
    bio: 'Descendant of historic palace chroniclers and certified senior heritage guide. 14 years leading educational walking tours through the Oba\'s Palace exterior, Igun Bronze guild, and the ancient Moats. Specializes in monarchical history and royal symbology.',
    languages: ['English', 'Edo', 'French', 'Nigerian Pidgin'],
    specialties: ['Royal Palace Protocol', 'Bronze Guild History', 'Monarchy & Genealogies', 'Diaspora Ancestral Tours'],
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
    rating: 4.9,
    review_count: 84,
    is_verified: true,
    phone: '+234 803 222 1100',
    email: 'osaro.heritage@benin360.example',
    created_at: '2026-09-01T08:00:00Z',
  },
  {
    id: 'guide-2',
    slug: 'efe-osagie',
    name: 'Efe Osagie',
    bio: 'Cultural anthropologist and documentary photographer born and raised in Benin City. Specializes in immersive architecture tours of the Benin Moats, historical preservation, and contemporary Edo youth arts.',
    languages: ['English', 'Edo', 'Nigerian Pidgin'],
    specialties: ['Benin Moats & Architecture', 'Cultural Photography', 'National Museum In-depth', 'Student & Academic Groups'],
    avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80',
    rating: 4.8,
    review_count: 52,
    is_verified: true,
    phone: '+234 812 999 4433',
    email: 'efe.tours@benin360.example',
    created_at: '2026-09-02T09:00:00Z',
  },
  {
    id: 'guide-3',
    slug: 'adesuwa-omoregbe',
    name: 'Adesuwa Omoregbe',
    bio: 'Passionate culinary researcher and artisanal market curator. Leads flavour-packed food trails through Oba Market and local restaurants, teaching visitors traditional spice blending and Edo cooking.',
    languages: ['English', 'Edo', 'Yoruba', 'Nigerian Pidgin'],
    specialties: ['Edo Gastronomy', 'Oba Market Spice Walks', 'Artisanal Coral & Textile Guilds', 'Family-Friendly Tours'],
    avatar_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80',
    rating: 5.0,
    review_count: 67,
    is_verified: true,
    phone: '+234 805 111 7788',
    email: 'adesuwa.culinary@benin360.example',
    created_at: '2026-09-03T10:00:00Z',
  }
];

export const INITIAL_EXPERIENCES: Experience[] = [
  {
    id: 'exp-1',
    slug: 'royal-palace-and-kingdom-chronicles-walk',
    title: 'Royal Palace Grounds & Ancient Kingdom Chronicles Walking Tour',
    guide_id: 'guide-1',
    description: 'An authoritative 3-hour journey through the history of the Benin Empire. Explore the outer courtyard monuments of the Oba\'s Palace, the Emotan Statue, the National Museum highlights, and hear oral histories passed down through royal chroniclers.',
    duration_hours: 3.5,
    price_ngn: 25000,
    image_url: 'https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?auto=format&fit=crop&w=1200&q=80',
    is_active: true,
    created_at: '2026-09-01T08:00:00Z',
  },
  {
    id: 'exp-2',
    slug: 'master-bronze-casting-workshop-igun-street',
    title: 'Master Bronze Casting Apprentice Workshop at Igun Street',
    guide_id: 'guide-1',
    description: 'Step inside a genuine guild workshop on Igun Street. Watch master founders demonstrate the centuries-old cire perdue (lost wax) process, carve your own small wax talisman, and take home a personal keepsake cast in brass.',
    duration_hours: 3.0,
    price_ngn: 35000,
    image_url: 'https://images.unsplash.com/photo-1577717903315-1691ae25ab3f?auto=format&fit=crop&w=1200&q=80',
    is_active: true,
    created_at: '2026-09-02T10:00:00Z',
  },
  {
    id: 'exp-3',
    slug: 'edo-culinary-masterclass-and-market-trail',
    title: 'Edo Culinary Trail: Oba Market Spice Walk & Banga Cooking Masterclass',
    guide_id: 'guide-3',
    description: 'Shop for native Edo herbs, ataiko, rigije, and fresh river catfish at Oba Market, followed by a hands-on kitchen workshop cooking rich Banga soup and yellow starch under expert tutelage.',
    duration_hours: 4.0,
    price_ngn: 30000,
    image_url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80',
    is_active: true,
    created_at: '2026-09-03T11:00:00Z',
  },
  {
    id: 'exp-4',
    slug: 'benin-moats-and-lost-architecture-expedition',
    title: 'Ancient Earthworks Expedition: Tracking the Great Benin Moats',
    guide_id: 'guide-2',
    description: 'An archaeological excursion navigating the preserved ramparts of the Iya earthworks. Discover how the ancient engineers constructed the defensive systems and visit the surviving Ogiamien Palace.',
    duration_hours: 3.5,
    price_ngn: 20000,
    image_url: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1200&q=80',
    is_active: true,
    created_at: '2026-09-04T12:00:00Z',
  }
];

export const INITIAL_TRANSPORT_PROVIDERS: TransportProvider[] = [
  {
    id: 'tp-1',
    slug: 'benin-airport-executive-shuttle',
    name: 'Benin Airport Executive Transfer (BNI)',
    service_type: 'Airport Shuttle & Concierge',
    description: 'Punctual airport pick-up and drop-off service with air-conditioned SUVs and sedans. Driver meets you inside the terminal with your name placard.',
    phone: '+234 803 100 2030',
    email: 'airport@benin360.example',
    area_covered: 'Benin Airport (BNI) to all hotels across GRA, City Centre, Ugbowo, and Ekenwan',
    is_verified: true,
    created_at: '2026-09-01T08:00:00Z',
  },
  {
    id: 'tp-2',
    slug: 'royal-heritage-private-chauffeur',
    name: 'Royal Heritage Private Chauffeur Services',
    service_type: 'Daily Dedicated Driver',
    description: 'Full-day and multi-day dedicated vehicle hire with professional, security-vetted drivers familiar with historic landmarks and anniversary venues.',
    phone: '+234 818 200 3040',
    email: 'chauffeur@benin360.example',
    area_covered: 'Greater Benin City, Ogba, bypass corridor, and inter-city trips to Asaba/Lagos connector',
    is_verified: true,
    created_at: '2026-09-02T09:00:00Z',
  },
  {
    id: 'tp-3',
    slug: 'coronation-event-shuttle-group-charter',
    name: 'Coronation Event Shuttle & Group Coaster Charters',
    service_type: 'Group Transit & Coaster Buses',
    description: '14-seater HiAce and 30-seater Coaster buses for diaspora family groups, church delegations, and corporate parties attending anniversary events.',
    phone: '+234 805 300 4050',
    email: 'shuttle@benin360.example',
    area_covered: 'Special event shuttles between major GRA hotels and coronation ceremonial grounds',
    is_verified: true,
    created_at: '2026-09-03T10:00:00Z',
  }
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    slug: 'queen-idia-bronze-mask-replica',
    title: 'Certified Queen Mother Idia Bronze Mask (Authentic Replica)',
    vendor_name: 'Igun Eronmwon Master Guild Cooperative',
    category: 'Bronze & Brasswork',
    description: 'Handcrafted using the ancient 16th-century cire-perdue (lost wax) casting method by a master artisan on Igun Street. Represents Queen Idia, mother of Oba Esigie, whose iconic visage is immortalized globally.',
    price_ngn: 75000,
    image_url: 'https://images.unsplash.com/photo-1577717903315-1691ae25ab3f?auto=format&fit=crop&w=1200&q=80',
    is_available: true,
    is_featured: true,
    created_at: '2026-09-01T08:00:00Z',
  },
  {
    id: 'prod-2',
    slug: 'benin-royal-coral-bead-ivie-necklace',
    title: 'Edo Ceremonial Coral Bead (Ivie) Royal Necklace',
    vendor_name: 'Oba Market Heritage Guild Artisans',
    category: 'Jewelry & Beads',
    description: 'Polished authentic coral beads hand-strung in traditional ceremonial geometry. Suitable for traditional weddings, coronation attendance, and cultural celebrations.',
    price_ngn: 95000,
    image_url: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=1200&q=80',
    is_available: true,
    is_featured: true,
    created_at: '2026-09-02T10:00:00Z',
  },
  {
    id: 'prod-3',
    slug: 'bronze-royal-leopard-statue',
    title: 'Royal Benin Aquamanile Bronze Leopard Statuette',
    vendor_name: 'Sakponba Bronze Atelier',
    category: 'Bronze & Brasswork',
    description: 'A stately lost-wax bronze representation of the royal leopard—the emblem of monarchical kingship and speed in Benin art. Polished to a rich patina.',
    price_ngn: 85000,
    image_url: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=80',
    is_available: true,
    is_featured: true,
    created_at: '2026-09-03T11:00:00Z',
  },
  {
    id: 'prod-4',
    slug: 'the-benin-kingdom-illustrated-history-book',
    title: '"Chronicles of the Great Benin Kingdom" (Hardcover Collector\'s Edition)',
    vendor_name: 'Edo Heritage Academic Press',
    category: 'Books & Literature',
    description: 'A richly illustrated 280-page hardback book documenting the dynasties of the Ogiso and Oba, the architecture of the Moats, and historical accounts of royal art.',
    price_ngn: 18000,
    image_url: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=1200&q=80',
    is_available: true,
    is_featured: false,
    created_at: '2026-09-04T12:00:00Z',
  },
  {
    id: 'prod-5',
    slug: 'traditional-edo-velvet-wrapper-set',
    title: 'Traditional Embroidered Edo Red Velvet Wrapper Set',
    vendor_name: 'Akenzua Royal Textiles',
    category: 'Fashion & Regalia',
    description: 'Deep crimson velvet fabric enriched with golden embroidery and traditional Edo royal motifs, crafted for festive ceremonies.',
    price_ngn: 60000,
    image_url: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=1200&q=80',
    is_available: true,
    is_featured: true,
    created_at: '2026-09-05T14:00:00Z',
  }
];

export const INITIAL_BADGES: PassportBadge[] = [
  {
    id: 'b-1',
    slug: 'royal-pilgrim',
    title: 'Royal Heritage Pilgrim',
    description: 'Visited the sacred Palace of the Oba of Benin or Holy Aruosa Cathedral.',
    icon: 'Crown',
    requirementCount: 1,
    category: 'royal-heritage'
  },
  {
    id: 'b-2',
    slug: 'bronze-master',
    title: 'Bronze Master Trailblazer',
    description: 'Walked the historic Igun Bronze Casters Guild Street.',
    icon: 'Hammer',
    requirementCount: 1,
    category: 'culture'
  },
  {
    id: 'b-3',
    slug: 'coronation-witness',
    title: 'Coronation Anniversary Witness',
    description: 'Attended an official or verified 10th Coronation Anniversary festival event.',
    icon: 'Sparkles',
    requirementCount: 1,
    category: 'events'
  },
  {
    id: 'b-4',
    slug: 'earthworks-explorer',
    title: 'Ancient Earthworks Explorer',
    description: 'Documented and stood before the historic Benin Moat (Iya) or Ogiamien Palace.',
    icon: 'Shield',
    requirementCount: 1,
    category: 'royal-heritage'
  },
  {
    id: 'b-5',
    slug: 'edo-epicurean',
    title: 'Edo Gastronomy Connoisseur',
    description: 'Savoured traditional Banga, Owo, or Black soup at a certified restaurant.',
    icon: 'Utensils',
    requirementCount: 1,
    category: 'food'
  }
];

// Local state manager for persistent browser experience
class DataStore {
  private categories: Category[];
  private attractions: Attraction[];
  private events: EventItem[];
  private businesses: Business[];
  private guides: Guide[];
  private experiences: Experience[];
  private transportProviders: TransportProvider[];
  private products: Product[];
  private stamps: PassportStamp[];
  private bookingRequests: BookingRequest[];
  private transportRequests: TransportRequest[];
  private marketplaceOrders: MarketplaceOrder[];

  constructor() {
    this.categories = this.load('b360_categories', INITIAL_CATEGORIES);
    this.attractions = this.load('b360_attractions', INITIAL_ATTRACTIONS);
    this.events = this.load('b360_events', INITIAL_EVENTS);
    this.businesses = this.load('b360_businesses', INITIAL_BUSINESSES);
    this.guides = this.load('b360_guides', INITIAL_GUIDES);
    this.experiences = this.load('b360_experiences', INITIAL_EXPERIENCES);
    this.transportProviders = this.load('b360_transports', INITIAL_TRANSPORT_PROVIDERS);
    this.products = this.load('b360_products', INITIAL_PRODUCTS);
    this.stamps = this.load('b360_stamps', [
      {
        id: 'stamp-init-1',
        visitor_name: 'Visitor',
        stamp_type: 'attraction',
        target_id: 'attr-1',
        target_name: 'Palace of the Oba of Benin',
        claimed_at: new Date(Date.now() - 86400000 * 2).toISOString(),
      }
    ]);
    this.bookingRequests = this.load('b360_bookings', []);
    this.transportRequests = this.load('b360_trans_reqs', []);
    this.marketplaceOrders = this.load('b360_orders', []);
  }

  private load<T>(key: string, fallback: T): T {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : fallback;
    } catch {
      return fallback;
    }
  }

  private save(key: string, val: unknown): void {
    try {
      localStorage.setItem(key, JSON.stringify(val));
    } catch {
      // Storage unavailable or quota exceeded
    }
  }

  // Getters
  getCategories(): Category[] { return [...this.categories]; }
  getAttractions(): Attraction[] {
    return this.attractions.map(a => ({
      ...a,
      category: this.categories.find(c => c.id === a.category_id) || null
    }));
  }
  getAttractionBySlug(slug: string): Attraction | undefined {
    const a = this.attractions.find(item => item.slug === slug);
    if (!a) return undefined;
    return {
      ...a,
      category: this.categories.find(c => c.id === a.category_id) || null
    };
  }

  getEvents(): EventItem[] { return [...this.events]; }
  getEventBySlug(slug: string): EventItem | undefined {
    return this.events.find(e => e.slug === slug);
  }

  getBusinesses(type?: string): Business[] {
    let list = this.businesses;
    if (type) list = list.filter(b => b.business_type === type);
    return list.map(b => ({
      ...b,
      category: this.categories.find(c => c.id === b.category_id) || null
    }));
  }

  getGuides(): Guide[] { return [...this.guides]; }
  getGuideBySlug(slug: string): Guide | undefined {
    return this.guides.find(g => g.slug === slug);
  }

  getExperiences(): Experience[] {
    return this.experiences.map(e => ({
      ...e,
      guide: this.guides.find(g => g.id === e.guide_id) || null
    }));
  }

  getTransportProviders(): TransportProvider[] { return [...this.transportProviders]; }
  getProducts(): Product[] { return [...this.products]; }
  getBadges(): PassportBadge[] { return [...INITIAL_BADGES]; }
  getStamps(): PassportStamp[] { return [...this.stamps]; }
  getBookings(): BookingRequest[] { return [...this.bookingRequests]; }
  getTransportRequests(): TransportRequest[] { return [...this.transportRequests]; }
  getOrders(): MarketplaceOrder[] { return [...this.marketplaceOrders]; }

  // Actions
  claimStamp(stamp: Omit<PassportStamp, 'id' | 'claimed_at'>): { success: boolean; message: string; stamp?: PassportStamp } {
    const existing = this.stamps.find(s => s.target_id === stamp.target_id);
    if (existing) {
      return { success: false, message: 'You have already collected this passport stamp!' };
    }

    const newStamp: PassportStamp = {
      ...stamp,
      id: `stamp-${Date.now()}`,
      claimed_at: new Date().toISOString(),
    };

    this.stamps.push(newStamp);
    this.save('b360_stamps', this.stamps);
    return { success: true, message: 'Stamp successfully added to your Benin360 Digital Passport!', stamp: newStamp };
  }

  submitBooking(booking: Omit<BookingRequest, 'id' | 'status' | 'created_at'>): BookingRequest {
    const newReq: BookingRequest = {
      ...booking,
      id: `bk-${Date.now()}`,
      status: 'pending',
      created_at: new Date().toISOString(),
      experience: this.experiences.find(e => e.id === booking.experience_id)
    };
    this.bookingRequests.unshift(newReq);
    this.save('b360_bookings', this.bookingRequests);
    return newReq;
  }

  submitTransportRequest(req: Omit<TransportRequest, 'id' | 'status' | 'created_at'>): TransportRequest {
    const newReq: TransportRequest = {
      ...req,
      id: `tr-${Date.now()}`,
      status: 'pending',
      created_at: new Date().toISOString(),
    };
    this.transportRequests.unshift(newReq);
    this.save('b360_trans_reqs', this.transportRequests);
    return newReq;
  }

  submitOrder(order: Omit<MarketplaceOrder, 'id' | 'status' | 'created_at'>): MarketplaceOrder {
    const newOrder: MarketplaceOrder = {
      ...order,
      id: `ord-${Date.now()}`,
      status: 'pending',
      created_at: new Date().toISOString(),
      product: this.products.find(p => p.id === order.product_id)
    };
    this.marketplaceOrders.unshift(newOrder);
    this.save('b360_orders', this.marketplaceOrders);
    return newOrder;
  }

  updateVerification(type: 'attraction' | 'event' | 'business', id: string, status: 'verified' | 'pending' | 'unverified' | 'rejected') {
    if (type === 'attraction') {
      const item = this.attractions.find(a => a.id === id);
      if (item) {
        item.verification_status = status;
        item.is_verified = status === 'verified';
        item.verified_at = status === 'verified' ? new Date().toISOString() : null;
        this.save('b360_attractions', this.attractions);
      }
    } else if (type === 'event') {
      const item = this.events.find(e => e.id === id);
      if (item) {
        item.verification_status = status;
        item.verified_at = status === 'verified' ? new Date().toISOString() : null;
        this.save('b360_events', this.events);
      }
    } else if (type === 'business') {
      const item = this.businesses.find(b => b.id === id);
      if (item) {
        item.verification_status = status;
        item.is_verified = status === 'verified';
        this.save('b360_businesses', this.businesses);
      }
    }
  }

  updateBookingStatus(id: string, status: BookingRequest['status']) {
    const b = this.bookingRequests.find(req => req.id === id);
    if (b) {
      b.status = status;
      this.save('b360_bookings', this.bookingRequests);
    }
  }

  updateTransportStatus(id: string, status: TransportRequest['status']) {
    const t = this.transportRequests.find(req => req.id === id);
    if (t) {
      t.status = status;
      this.save('b360_trans_reqs', this.transportRequests);
    }
  }

  getMetrics(): PlatformMetrics {
    const verifiedAttractions = this.attractions.filter(a => a.verification_status === 'verified').length;
    const verifiedEvents = this.events.filter(e => e.verification_status === 'verified').length;
    const verifiedBiz = this.businesses.filter(b => b.verification_status === 'verified').length;
    const pendingCount =
      this.attractions.filter(a => a.verification_status === 'pending').length +
      this.events.filter(e => e.verification_status === 'pending').length +
      this.businesses.filter(b => b.verification_status === 'pending').length;

    return {
      totalVisitors: 12480,
      totalEventViews: 38240,
      totalAttractionViews: 45610,
      totalEnquiries: this.marketplaceOrders.length + 142,
      totalBookings: this.bookingRequests.length + this.transportRequests.length + 95,
      totalPassportClaims: this.stamps.length + 1850,
      verifiedCount: verifiedAttractions + verifiedEvents + verifiedBiz,
      pendingVerificationCount: pendingCount,
    };
  }
}

export const store = new DataStore();
