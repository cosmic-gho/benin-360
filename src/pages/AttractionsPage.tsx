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
