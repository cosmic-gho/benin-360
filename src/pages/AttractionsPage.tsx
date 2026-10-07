import { useState, useEffect, useMemo } from 'react';
import { MapPin, ArrowLeft, Clock, Info, Navigation, Star, Crown, Landmark, Palette, Search } from 'lucide-react';
import { api } from '@/lib/api';
import { store } from '@/lib/dataStore';
import { useRouter } from '@/lib/router';
import type { Attraction, Category } from '@/types';
import { DemoBanner, VerificationBadge, LoadingSpinner, EmptyState } from '@/components/ui';

export function AttractionsPage() {
  const { navigate } = useRouter();
  const [attractions, setAttractions] = useState<Attraction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const [attrList, catList] = await Promise.all([
          api.getAttractions(),
          api.getCategories(),
        ]);
        setAttractions(attrList);
        setCategories(catList);
      } catch {
        setAttractions(store.getAttractions());
        setCategories(store.getCategories());
      } finally {
        setLoading(false);
      }
    })();
  }, []);



  const filtered = useMemo(() => {
    return attractions.filter((a) => {
      if (filter !== 'all' && a.category?.slug !== filter) return false;
      if (search && !a.name.toLowerCase().includes(search.toLowerCase()) && !a.short_desc?.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [attractions, filter, search]);

  if (loading) return <LoadingSpinner message="Loading heritage sites..." />;

  return (
    <div className="pt-20 min-h-screen bg-gray-50 animate-fade-in">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <button onClick={() => navigate('#/')} className="flex items-center gap-1 text-sm text-gray-500 hover:text-primary-600 mb-4">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </button>

        <h1 className="font-display text-3xl sm:text-4xl font-bold text-gray-900">Heritage & Attractions</h1>
        <p className="mt-2 text-gray-500">Explore the cultural and historical landmarks of the Benin Kingdom</p>

        {/* Search */}
        <div className="mt-6 relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search attractions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
          />
        </div>

        {/* Category filter */}
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === 'all' ? 'bg-primary-600 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:border-primary-300'
            }`}
          >
            All Categories
          </button>
          {categories.filter((c) => ['royal-heritage', 'museums', 'culture'].includes(c.slug)).map((cat) => (
            <button
              key={cat.id}
              onClick={() => setFilter(cat.slug)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === cat.slug ? 'bg-primary-600 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:border-primary-300'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        <div className="mt-4">
          <DemoBanner />
        </div>

        {filtered.length === 0 ? (
          <EmptyState message="No attractions found. Try a different search or filter." />
        ) : (
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((attr) => (
              <button
                key={attr.id}
                onClick={() => navigate(`#attractions/${attr.slug}`)}
                className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all text-left"
              >
                <div className="relative h-48 overflow-hidden">
                  {attr.image_url && <img src={attr.image_url} alt={attr.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  {attr.category && (
                    <div className="absolute top-3 left-3 bg-white/95 backdrop-blur rounded-lg px-2 py-1">
                      <span className="text-xs font-medium text-gray-700">{attr.category.name}</span>
                    </div>
                  )}
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <VerificationBadge status={attr.verification_status} />
                    {attr.is_featured && <span className="text-xs text-primary-600 font-medium">Featured</span>}
                  </div>
                  <h3 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">{attr.name}</h3>
                  <p className="text-sm text-gray-500 mt-1 line-clamp-2">{attr.short_desc}</p>
                  {attr.address && (
                    <p className="text-xs text-gray-400 mt-3 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" /> {attr.address}
                    </p>
                  )}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export function AttractionDetailPage({ slug }: { slug: string }) {
  const { navigate } = useRouter();
  const [attraction, setAttraction] = useState<Attraction | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from('attractions').select('*, category:categories(*)').eq('slug', slug).maybeSingle();
      setAttraction(data);
      setLoading(false);
    })();
  }, [slug]);

  if (loading) return <LoadingSpinner message="Loading attraction..." />;

  if (!attraction) {
    return (
      <div className="pt-20 min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <EmptyState message="Attraction not found." />
          <button onClick={() => navigate('#attractions')} className="mx-auto block px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium">
            Back to Attractions
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20 min-h-screen bg-white animate-fade-in">
      <div className="relative h-64 sm:h-96 overflow-hidden">
        {attraction.image_url && <img src={attraction.image_url} alt={attraction.name} className="w-full h-full object-cover" />}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 max-w-4xl mx-auto px-4 sm:px-6 pb-6">
          <button onClick={() => navigate('#attractions')} className="flex items-center gap-1 text-sm text-white/80 hover:text-white mb-3">
            <ArrowLeft className="w-4 h-4" /> All Attractions
          </button>
          <div className="flex items-center gap-2 mb-3">
            {attraction.category && (
              <span className="text-xs text-white bg-white/20 backdrop-blur px-2 py-1 rounded">{attraction.category.name}</span>
            )}
            <VerificationBadge status={attraction.verification_status} />
          </div>
          <h1 className="font-display text-2xl sm:text-4xl font-bold text-white">{attraction.name}</h1>
          {attraction.short_desc && <p className="mt-2 text-white/80 text-sm sm:text-lg">{attraction.short_desc}</p>}
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {attraction.address && (
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="flex items-center gap-2 text-gray-400 text-xs mb-1"><MapPin className="w-4 h-4" /> Address</div>
              <div className="font-semibold text-gray-900 text-sm">{attraction.address}</div>
            </div>
          )}
          {attraction.opening_hours && (
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="flex items-center gap-2 text-gray-400 text-xs mb-1"><Clock className="w-4 h-4" /> Opening Hours</div>
              <div className="font-semibold text-gray-900 text-sm">{attraction.opening_hours}</div>
            </div>
          )}
          {attraction.latitude && attraction.longitude && (
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="flex items-center gap-2 text-gray-400 text-xs mb-1"><Navigation className="w-4 h-4" /> Coordinates</div>
              <div className="font-semibold text-gray-900 text-sm">{attraction.latitude.toFixed(4)}, {attraction.longitude.toFixed(4)}</div>
            </div>
          )}
        </div>

        <div className="flex gap-3 mb-8">
          <button onClick={() => navigate('#map')} className="px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-medium text-sm flex items-center gap-2 transition-colors">
            <MapPin className="w-4 h-4" /> View on Map
          </button>
          <a
            href={`https://www.google.com/maps?q=${attraction.latitude},${attraction.longitude}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 bg-white border border-gray-200 hover:border-primary-300 text-gray-700 rounded-xl font-medium text-sm flex items-center gap-2 transition-colors"
          >
            <Navigation className="w-4 h-4" /> Get Directions
          </a>
        </div>

        <h2 className="font-display text-xl font-bold text-gray-900 mb-3">About</h2>
        <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">{attraction.description}</p>

        {attraction.visitor_tips && (
          <div className="mt-8 bg-secondary-50 border border-secondary-200 rounded-xl p-5">
            <h3 className="font-semibold text-secondary-900 mb-2 flex items-center gap-2">
              <Info className="w-5 h-5" /> Visitor Tips
            </h3>
            <p className="text-sm text-secondary-800">{attraction.visitor_tips}</p>
          </div>
        )}

        <div className="mt-8">
          <DemoBanner message={attraction.source_name ? `Source: ${attraction.source_name}. This is DEMO DATA - verify all details before visiting.` : undefined} />
        </div>
      </div>
    </div>
  );
}
