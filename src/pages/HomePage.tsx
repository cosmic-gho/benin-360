import { useState, useEffect } from 'react';
import {
  Calendar, MapPin, Compass, UtensilsCrossed, BedDouble, Crown,
  ShoppingBag, Bus, MessageCircle, Stamp, ArrowRight, Star, Clock, Sparkles
} from 'lucide-react';
import { api } from '@/lib/api';
import { store } from '@/lib/dataStore';
import { useRouter } from '@/lib/router';
import { formatDate, formatDateShort } from '@/lib/utils';
import type { EventItem, Attraction, Business, Experience } from '@/types';
import { DemoBanner, VerificationBadge } from '@/components/ui';

export function HomePage() {
  const { navigate } = useRouter();
  const [events, setEvents] = useState<EventItem[]>([]);
  const [attractions, setAttractions] = useState<Attraction[]>([]);
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [evData, atData, bzData, exData] = await Promise.all([
          api.getEvents({ filter: 'upcoming' }),
          api.getAttractions({ featured: true }),
          api.getBusinesses({ type: 'hotel' }),
          api.getExperiences(),
        ]);

        setEvents(evData.slice(0, 3));
        setAttractions(atData.slice(0, 4));
        setBusinesses(bzData.slice(0, 3));
        setExperiences(exData.slice(0, 3));
      } catch {
        setEvents(store.getEvents().slice(0, 3));
        setAttractions(store.getAttractions().slice(0, 4));
        setBusinesses(store.getBusinesses('hotel').slice(0, 3));
        setExperiences(store.getExperiences().slice(0, 3));
      } finally {
        setLoading(false);
      }
    })();
  }, []);



  const exploreCards = [
    { icon: Calendar, label: 'Events', desc: 'Coronation anniversary & year-round events', route: '/events', color: 'bg-error-500' },
    { icon: MapPin, label: 'Interactive Map', desc: 'Navigate Benin with category filters', route: '/map', color: 'bg-secondary-500' },
    { icon: Crown, label: 'Heritage Sites', desc: 'Royal palaces, bronzes & cultural landmarks', route: '/attractions', color: 'bg-primary-600' },
    { icon: BedDouble, label: 'Hotels', desc: 'Find accommodation in Benin City', route: '/hotels', color: 'bg-success-600' },
    { icon: UtensilsCrossed, label: 'Food Guide', desc: 'Edo cuisine & local restaurants', route: '/food', color: 'bg-warning-500' },
    { icon: Compass, label: 'Tour Guides', desc: 'Book local guides & experiences', route: '/guides', color: 'bg-accent-500' },
    { icon: Bus, label: 'Transport', desc: 'Airport transfers & private drivers', route: '/transport', color: 'bg-gray-700' },
    { icon: ShoppingBag, label: 'Marketplace', desc: 'Benin crafts, beads & souvenirs', route: '/marketplace', color: 'bg-primary-500' },
  ];

  return (
    <div className="animate-fade-in">
      {/* Hero */}
      <section className="relative min-h-[100vh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/hero-benin-bronze.jpg"
            alt="Authentic Benin Bronze Plaques & Royal Coral Beads"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-black/60" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/40" />
          <div className="absolute inset-0 benin-pattern opacity-10" />
        </div>


        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-24 pb-12 w-full">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-primary-600/90 backdrop-blur text-white px-4 py-2 rounded-full text-sm font-medium mb-6 animate-slide-up">
              <Sparkles className="w-4 h-4" />
              10th Coronation Anniversary - Coming Soon
            </div>

            <h1 className="font-display text-4xl sm:text-5xl lg:text-7xl font-extrabold text-white leading-tight animate-slide-up">
              Connecting the World
              <br />
              to <span className="text-primary-400">Benin</span>
            </h1>

            <p className="mt-6 text-lg sm:text-xl text-white/90 leading-relaxed max-w-2xl animate-slide-up">
              Discover, navigate and experience Benin City and the Benin Kingdom.
              Heritage sites, events, hotels, food, local guides and authentic crafts -
              all in one place.
            </p>

            <div className="mt-8 flex flex-wrap gap-3 animate-slide-up">
              <button
                onClick={() => navigate('#events')}
                className="px-6 py-3.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl flex items-center gap-2 group"
              >
                Explore Benin
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={() => navigate('#map')}
                className="px-6 py-3.5 bg-white/10 backdrop-blur border border-white/30 hover:bg-white/20 text-white rounded-xl font-semibold transition-all flex items-center gap-2"
              >
                <MapPin className="w-5 h-5" />
                Open Map
              </button>
              <button
                onClick={() => navigate('#assistant')}
                className="px-6 py-3.5 bg-white/10 backdrop-blur border border-white/30 hover:bg-white/20 text-white rounded-xl font-semibold transition-all flex items-center gap-2"
              >
                <MessageCircle className="w-5 h-5" />
                Ask AI Guide
              </button>
            </div>

            <div className="mt-8 flex items-center gap-2 text-white/70 text-sm animate-fade-in">
              <span>Scan to discover Benin</span>
              <div className="w-20 h-20 bg-white rounded-lg flex items-center justify-center ml-2">
                <div className="grid grid-cols-7 gap-0.5 p-2">
                  {Array.from({ length: 49 }).map((_, i) => {
                    const corners = [0, 6, 42, 48];
                    const isCorner = corners.includes(i);
                    const pattern = [3, 5, 9, 11, 15, 17, 19, 21, 23, 25, 27, 29, 33, 35, 39, 41, 45, 47];
                    const isOn = isCorner || pattern.includes(i);
                    return (
                      <div
                        key={i}
                        className={`w-1.5 h-1.5 rounded-sm ${isOn ? 'bg-black' : 'bg-white'}`}
                      />
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Explore Grid */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-gray-900">Explore Benin</h2>
            <p className="mt-2 text-gray-500">Everything you need to discover the Benin Kingdom</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {exploreCards.map((card) => (
              <button
                key={card.label}
                onClick={() => navigate(`#${card.route.slice(1)}`)}
                className="group relative overflow-hidden rounded-2xl border border-gray-200 p-5 text-left hover:shadow-lg transition-all hover:-translate-y-1"
              >
                <div className={`w-12 h-12 rounded-xl ${card.color} flex items-center justify-center mb-3`}>
                  <card.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
                  {card.label}
                </h3>
                <p className="text-xs text-gray-500 mt-1">{card.desc}</p>
                <ArrowRight className="absolute top-5 right-5 w-5 h-5 text-gray-300 group-hover:text-primary-500 group-hover:translate-x-1 transition-all" />
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Events */}
      {!loading && events.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="flex items-end justify-between mb-8">
              <div>
                <h2 className="font-display text-3xl font-bold text-gray-900">Featured Events</h2>
                <p className="mt-1 text-sm text-gray-500">Upcoming events in Benin City</p>
              </div>
              <button
                onClick={() => navigate('#events')}
                className="text-sm font-medium text-primary-600 hover:text-primary-700 flex items-center gap-1"
              >
                View all <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {events.map((event) => (
                <button
                  key={event.id}
                  onClick={() => navigate(`#events/${event.slug}`)}
                  className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all text-left"
                >
                  <div className="relative h-48 overflow-hidden">
                    {event.cover_image && (
                      <img
                        src={event.cover_image}
                        alt={event.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    )}
                    <div className="absolute top-3 left-3 bg-white/95 backdrop-blur rounded-lg px-3 py-1.5">
                      <div className="text-xs font-bold text-primary-600">{formatDateShort(event.start_date)}</div>
                    </div>
                  </div>
                  <div className="p-5">
                    <div className="flex items-center gap-2 mb-2">
                      <VerificationBadge status={event.verification_status} />
                      {event.category && (
                        <span className="text-xs text-gray-500">{event.category}</span>
                      )}
                    </div>
                    <h3 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors line-clamp-2">
                      {event.title}
                    </h3>
                    <p className="text-sm text-gray-500 mt-2 line-clamp-2">{event.description}</p>
                    <div className="mt-3 flex items-center gap-3 text-xs text-gray-400">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" /> {event.start_time}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" /> {event.venue}
                      </span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Heritage Sites */}
      {!loading && attractions.length > 0 && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="flex items-end justify-between mb-8">
              <div>
                <h2 className="font-display text-3xl font-bold text-gray-900">Heritage & Attractions</h2>
                <p className="mt-1 text-sm text-gray-500">Discover the cultural treasures of Benin</p>
              </div>
              <button
                onClick={() => navigate('#attractions')}
                className="text-sm font-medium text-primary-600 hover:text-primary-700 flex items-center gap-1"
              >
                View all <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {attractions.map((attr) => (
                <button
                  key={attr.id}
                  onClick={() => navigate(`#attractions/${attr.slug}`)}
                  className="group rounded-2xl overflow-hidden bg-white border border-gray-200 hover:shadow-xl transition-all text-left"
                >
                  <div className="relative h-40 overflow-hidden">
                    {attr.image_url && (
                      <img
                        src={attr.image_url}
                        alt={attr.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-3 left-3 right-3">
                      <span className="text-xs font-medium text-white/90 bg-black/40 backdrop-blur px-2 py-1 rounded">
                        {attr.category?.name}
                      </span>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors text-sm line-clamp-2">
                      {attr.name}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">{attr.short_desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Experiences */}
      {!loading && experiences.length > 0 && (
        <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="flex items-end justify-between mb-8">
              <div>
                <h2 className="font-display text-3xl font-bold text-gray-900">Bookable Experiences</h2>
                <p className="mt-1 text-sm text-gray-500">Tours and cultural activities led by local guides</p>
              </div>
              <button
                onClick={() => navigate('#guides')}
                className="text-sm font-medium text-primary-600 hover:text-primary-700 flex items-center gap-1"
              >
                View all <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {experiences.map((exp) => (
                <div
                  key={exp.id}
                  className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all"
                >
                  <div className="relative h-44 overflow-hidden">
                    {exp.image_url && (
                      <img
                        src={exp.image_url}
                        alt={exp.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    )}
                  </div>
                  <div className="p-5">
                    <h3 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
                      {exp.title}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1 line-clamp-2">{exp.description}</p>
                    <div className="mt-4 flex items-center justify-between">
                      <div className="text-sm">
                        <span className="text-gray-400">From </span>
                        <span className="font-bold text-primary-600">
                          {exp.price_ngn ? `\u20A6${exp.price_ngn.toLocaleString()}` : 'On request'}
                        </span>
                      </div>
                      {exp.guide && (
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <Star className="w-3.5 h-3.5 text-warning-400 fill-warning-400" />
                          {exp.guide.rating} ({exp.guide.review_count})
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Hotels & Food */}
      {!loading && businesses.length > 0 && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="flex items-end justify-between mb-8">
              <div>
                <h2 className="font-display text-3xl font-bold text-gray-900">Featured Places to Stay & Eat</h2>
                <p className="mt-1 text-sm text-gray-500">Hotels and restaurants in Benin City</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {businesses.map((biz) => (
                <div
                  key={biz.id}
                  className="group bg-white rounded-2xl overflow-hidden border border-gray-200 hover:shadow-xl transition-all"
                >
                  <div className="relative h-40 overflow-hidden">
                    {biz.image_url && (
                      <img
                        src={biz.image_url}
                        alt={biz.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    )}
                    {biz.is_featured && (
                      <div className="absolute top-3 right-3 bg-primary-600 text-white text-xs font-medium px-2 py-1 rounded-lg">
                        Featured
                      </div>
                    )}
                  </div>
                  <div className="p-5">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-medium text-secondary-600 bg-secondary-50 px-2 py-0.5 rounded capitalize">
                        {biz.business_type}
                      </span>
                      {biz.price_band && (
                        <span className="text-xs text-gray-400 capitalize">{biz.price_band}</span>
                      )}
                    </div>
                    <h3 className="font-semibold text-gray-900">{biz.name}</h3>
                    <p className="text-sm text-gray-500 mt-1 line-clamp-2">{biz.short_desc}</p>
                    {biz.address && (
                      <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" /> {biz.address}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Passport CTA */}
      <section className="py-16 bg-gradient-to-br from-primary-700 via-primary-800 to-gray-900 relative overflow-hidden">
        <div className="absolute inset-0 benin-pattern opacity-20" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur flex items-center justify-center mx-auto mb-6">
            <Stamp className="w-8 h-8 text-primary-300" />
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-white">
            Collect Your Digital Passport Stamps
          </h2>
          <p className="mt-4 text-white/80 max-w-2xl mx-auto">
            Visit heritage sites and attend events to collect digital stamps.
            Build your Benin visitor passport and share your journey.
          </p>
          <button
            onClick={() => navigate('#passport')}
            className="mt-8 px-6 py-3.5 bg-white text-primary-700 rounded-xl font-semibold hover:bg-primary-50 transition-all shadow-lg flex items-center gap-2 mx-auto"
          >
            <Stamp className="w-5 h-5" />
            Start Your Passport
          </button>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="py-8 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <DemoBanner message="All listings on this platform are currently DEMO DATA for demonstration purposes. No official affiliation with the Oba's Palace, Coronation Anniversary Secretariat, or any government body. Event details must be verified through official sources." />
        </div>
      </section>
    </div>
  );
}
