import { useState, useEffect, useMemo } from 'react';
import { MapPin, ArrowLeft, Crown, Landmark, Palette, UtensilsCrossed, BedDouble, Calendar, ShoppingBag, Briefcase, X, Navigation } from 'lucide-react';
import { useRouter } from '@/lib/router';
import { store } from '@/lib/dataStore';
import { api } from '@/lib/api';
import type { Attraction, EventItem, Business } from '@/types';
import { VerificationBadge, LoadingSpinner } from '@/components/ui';

interface MapPoint {
  id: string;
  name: string;
  type: 'attraction' | 'event' | 'business';
  subtype: string;
  latitude: number;
  longitude: number;
  category: string;
  image_url: string | null;
  slug: string;
}

const categoryFilters = [
  { key: 'all', label: 'All', icon: MapPin, color: 'bg-gray-700' },
  { key: 'royal-heritage', label: 'Royal Heritage', icon: Crown, color: 'bg-primary-600' },
  { key: 'museums', label: 'Museums', icon: Landmark, color: 'bg-secondary-600' },
  { key: 'culture', label: 'Culture', icon: Palette, color: 'bg-accent-500' },
  { key: 'food', label: 'Food', icon: UtensilsCrossed, color: 'bg-warning-500' },
  { key: 'hotels', label: 'Hotels', icon: BedDouble, color: 'bg-success-600' },
  { key: 'events', label: 'Events', icon: Calendar, color: 'bg-error-500' },
  { key: 'shopping', label: 'Shopping', icon: ShoppingBag, color: 'bg-primary-500' },
  { key: 'services', label: 'Services', icon: Briefcase, color: 'bg-gray-600' },
];

export function MapPage() {
  const { navigate } = useRouter();
  const [points, setPoints] = useState<MapPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedPoint, setSelectedPoint] = useState<MapPoint | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const [attrList, eventList, bizList] = await Promise.all([
          api.getAttractions(),
          api.getEvents(),
          api.getBusinesses(),
        ]);

        const allPoints: MapPoint[] = [
          ...attrList
            .filter((a) => a.latitude !== null && a.longitude !== null)
            .map((a) => ({
              id: a.id,
              name: a.name,
              type: 'attraction' as const,
              subtype: a.category?.slug || 'royal-heritage',
              latitude: a.latitude!,
              longitude: a.longitude!,
              category: a.category?.slug || 'royal-heritage',
              image_url: a.image_url,
              slug: a.slug,
            })),
          ...eventList
            .filter((e) => e.latitude !== null && e.longitude !== null)
            .map((e) => ({
              id: e.id,
              name: e.title,
              type: 'event' as const,
              subtype: 'events',
              latitude: e.latitude!,
              longitude: e.longitude!,
              category: 'events',
              image_url: e.cover_image,
              slug: e.slug,
            })),
          ...bizList
            .filter((b) => b.latitude !== null && b.longitude !== null)
            .map((b) => ({
              id: b.id,
              name: b.name,
              type: 'business' as const,
              subtype: b.category?.slug || b.business_type,
              latitude: b.latitude!,
              longitude: b.longitude!,
              category: b.category?.slug || (b.business_type === 'hotel' ? 'hotels' : 'food'),
              image_url: b.image_url,
              slug: b.slug,
            })),
        ];

        setPoints(allPoints);
      } catch {
        const attrList = store.getAttractions();
        const eventList = store.getEvents();
        const bizList = store.getBusinesses();

        const allPoints: MapPoint[] = [
          ...attrList
            .filter((a) => a.latitude !== null && a.longitude !== null)
            .map((a) => ({
              id: a.id,
              name: a.name,
              type: 'attraction' as const,
              subtype: a.category?.slug || 'royal-heritage',
              latitude: a.latitude!,
              longitude: a.longitude!,
              category: a.category?.slug || 'royal-heritage',
              image_url: a.image_url,
              slug: a.slug,
            })),
          ...eventList
            .filter((e) => e.latitude !== null && e.longitude !== null)
            .map((e) => ({
              id: e.id,
              name: e.title,
              type: 'event' as const,
              subtype: 'events',
              latitude: e.latitude!,
              longitude: e.longitude!,
              category: 'events',
              image_url: e.cover_image,
              slug: e.slug,
            })),
          ...bizList
            .filter((b) => b.latitude !== null && b.longitude !== null)
            .map((b) => ({
              id: b.id,
              name: b.name,
              type: 'business' as const,
              subtype: b.category?.slug || b.business_type,
              latitude: b.latitude!,
              longitude: b.longitude!,
              category: b.category?.slug || (b.business_type === 'hotel' ? 'hotels' : 'food'),
              image_url: b.image_url,
              slug: b.slug,
            })),
        ];

        setPoints(allPoints);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filteredPoints = useMemo(() => {
    if (activeFilter === 'all') return points;
    return points.filter((p) => p.category === activeFilter || p.subtype === activeFilter);
  }, [points, activeFilter]);

  // Calibrated bounding box for Benin City landmarks (Ring Road, GRA, Airport, Sakponba)
  const minLat = 6.310, maxLat = 6.358, minLng = 5.602, maxLng = 5.638;
  const toX = (lng: number) => {
    const val = ((lng - minLng) / (maxLng - minLng)) * 100;
    return Math.max(5, Math.min(95, val));
  };
  const toY = (lat: number) => {
    const val = ((maxLat - lat) / (maxLat - minLat)) * 100;
    return Math.max(5, Math.min(95, val));
  };


  const getCategoryColor = (category: string): string => {
    const cat = categoryFilters.find((c) => c.key === category);
    return cat?.color || 'bg-gray-700';
  };

  if (loading) return <LoadingSpinner message="Loading map..." />;

  return (
    <div className="pt-16 min-h-screen bg-gray-100 animate-fade-in">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <button onClick={() => navigate('#/')} className="flex items-center gap-1 text-sm text-gray-500 hover:text-primary-600 mb-4">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </button>

        <h1 className="font-display text-3xl font-bold text-gray-900">Interactive Benin Map</h1>
        <p className="mt-1 text-sm text-gray-500">Explore heritage sites, events, hotels and services across Benin City</p>

        {/* Filter buttons */}
        <div className="mt-6 flex flex-wrap gap-2">
          {categoryFilters.map((filter) => (
            <button
              key={filter.key}
              onClick={() => setActiveFilter(filter.key)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                activeFilter === filter.key
                  ? `${filter.color} text-white shadow-md`
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-primary-300'
              }`}
            >
              <filter.icon className="w-4 h-4" />
              {filter.label}
            </button>
          ))}
        </div>

        {/* Map canvas */}
        <div className="mt-6 relative bg-gradient-to-br from-secondary-50 via-gray-50 to-primary-50 rounded-2xl border border-gray-200 overflow-hidden" style={{ height: '70vh' }}>
          {/* Grid overlay for map feel */}
          <div className="absolute inset-0 opacity-20" style={{
            backgroundImage: `linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
          }} />

          {/* Benin pattern overlay */}
          <div className="absolute inset-0 benin-pattern opacity-10" />

          {/* River/road suggestion */}
          <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
            <path d="M 0 40% Q 30% 35%, 50% 50% T 100% 45%" stroke="#c3e8e0" strokeWidth="12" fill="none" opacity="0.5" />
            <path d="M 20% 0 Q 25% 40%, 35% 60% T 30% 100%" stroke="#e8d5c3" strokeWidth="8" fill="none" opacity="0.4" />
          </svg>

          {/* Map points */}
          {filteredPoints.map((point) => {
            const x = toX(point.longitude);
            const y = toY(point.latitude);
            if (x < 0 || x > 100 || y < 0 || y > 100) return null;
            return (
              <button
                key={`${point.type}-${point.id}`}
                onClick={() => setSelectedPoint(point)}
                className="absolute -translate-x-1/2 -translate-y-full group"
                style={{ left: `${x}%`, top: `${y}%` }}
              >
                <div className={`w-8 h-8 rounded-full ${getCategoryColor(point.category)} flex items-center justify-center shadow-lg ring-2 ring-white group-hover:scale-125 transition-all relative z-10`}>
                  <MapPin className="w-4 h-4 text-white" />
                </div>
                <div className="absolute left-1/2 -translate-x-1/2 top-full mt-1 bg-black/70 text-white text-[10px] px-2 py-0.5 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20">
                  {point.name}
                </div>
              </button>
            );
          })}

          {/* Scale/legend */}
          <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur rounded-lg px-3 py-2 shadow-md">
            <div className="text-xs font-medium text-gray-700 mb-1">Benin City Center</div>
            <div className="flex items-center gap-1">
              <div className="w-8 h-0.5 bg-gray-400"></div>
              <span className="text-[10px] text-gray-500">~2km</span>
            </div>
          </div>

          {/* Count badge */}
          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur rounded-lg px-3 py-2 shadow-md">
            <span className="text-xs font-medium text-gray-700">{filteredPoints.length} locations</span>
          </div>
        </div>

        {/* Detail card for selected point */}
        {selectedPoint && (
          <div className="mt-4 bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden animate-slide-up">
            <div className="flex flex-col sm:flex-row">
              {selectedPoint.image_url && (
                <div className="sm:w-48 h-32 sm:h-auto overflow-hidden shrink-0">
                  <img src={selectedPoint.image_url} alt={selectedPoint.name} className="w-full h-full object-cover" />
                </div>
              )}
              <div className="p-5 flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-xs font-medium text-white px-2 py-0.5 rounded capitalize ${getCategoryColor(selectedPoint.category)}`}>
                        {selectedPoint.type}
                      </span>
                    </div>
                    <h3 className="font-semibold text-gray-900">{selectedPoint.name}</h3>
                  </div>
                  <button onClick={() => setSelectedPoint(null)} className="p-1 hover:bg-gray-100 rounded-lg">
                    <X className="w-5 h-5 text-gray-400" />
                  </button>
                </div>

                <div className="mt-3 flex items-center gap-2 text-xs text-gray-400">
                  <span>{selectedPoint.latitude.toFixed(4)}, {selectedPoint.longitude.toFixed(4)}</span>
                  <VerificationBadge status="unverified" />
                </div>

                <div className="mt-4 flex gap-2">
                  {selectedPoint.type === 'attraction' && (
                    <button onClick={() => navigate(`#attractions/${selectedPoint.slug}`)} className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-medium flex items-center gap-1 transition-colors">
                      View Details <ArrowLeft className="w-3.5 h-3.5 rotate-180" />
                    </button>
                  )}
                  {selectedPoint.type === 'event' && (
                    <button onClick={() => navigate(`#events/${selectedPoint.slug}`)} className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-medium flex items-center gap-1 transition-colors">
                      View Event <ArrowLeft className="w-3.5 h-3.5 rotate-180" />
                    </button>
                  )}
                  <a
                    href={`https://www.google.com/maps?q=${selectedPoint.latitude},${selectedPoint.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-white border border-gray-200 hover:border-primary-300 text-gray-700 rounded-lg text-sm font-medium flex items-center gap-1 transition-colors"
                  >
                    <Navigation className="w-3.5 h-3.5" /> Directions
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="mt-4 bg-warning-50 border border-warning-200 rounded-lg px-4 py-3">
          <p className="text-xs text-warning-800">
            Map coordinates are DEMO DATA for illustration. Precise coordinates should be verified by administrators before publication.
          </p>
        </div>
      </div>
    </div>
  );
}
