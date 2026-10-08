import { useState, useEffect, useMemo } from 'react';
import { MapPin, ArrowLeft, Phone, Mail, Globe, Search, BedDouble, UtensilsCrossed, Bus, ShoppingBag } from 'lucide-react';
import { api } from '@/lib/api';
import { useRouter } from '@/lib/router';
import type { Business } from '@/types';
import { VerificationBadge, LoadingSpinner, EmptyState } from '@/components/ui';

const businessTypeConfig = {
  hotel: { icon: BedDouble, label: 'Hotels', title: 'Hotels in Benin City', desc: 'Find accommodation for your stay' },
  restaurant: { icon: UtensilsCrossed, label: 'Restaurants', title: 'Restaurants in Benin City', desc: 'Discover great places to eat' },
  transport: { icon: Bus, label: 'Transport', title: 'Transport Services', desc: 'Airport transfers and private drivers' },
  shop: { icon: ShoppingBag, label: 'Shops', title: 'Shops & Markets', desc: 'Where to buy local goods' },
  service: { icon: MapPin, label: 'Services', title: 'Visitor Services', desc: 'Essential services in Benin City' },
};

export function BusinessDirectoryPage({ businessType }: { businessType: keyof typeof businessTypeConfig }) {
  const { navigate } = useRouter();
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [priceFilter, setPriceFilter] = useState<string>('all');

  const config = businessTypeConfig[businessType];

  useEffect(() => {
    (async () => {
      try {
        const list = await api.getBusinesses({ type: businessType });
        setBusinesses(list);
      } catch (err) {
        console.error('Failed to load businesses from backend:', err);
      } finally {
        setLoading(false);
      }
    })();
  }, [businessType]);



  const filtered = useMemo(() => {
    return businesses.filter((b) => {
      if (priceFilter !== 'all' && b.price_band !== priceFilter) return false;
      if (search && !b.name.toLowerCase().includes(search.toLowerCase()) && !b.short_desc?.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [businesses, search, priceFilter]);

  if (loading) return <LoadingSpinner message={`Loading ${config.label.toLowerCase()}...`} />;

  return (
    <div className="pt-20 min-h-screen bg-gray-50 animate-fade-in">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <button onClick={() => navigate('#/')} className="flex items-center gap-1 text-sm text-gray-500 hover:text-primary-600 mb-4">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </button>

        <h1 className="font-display text-3xl sm:text-4xl font-bold text-gray-900">{config.title}</h1>
        <p className="mt-2 text-gray-500">{config.desc}</p>

        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder={`Search ${config.label.toLowerCase()}...`}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
            />
          </div>
          {businessType === 'hotel' || businessType === 'restaurant' ? (
            <select
              value={priceFilter}
              onChange={(e) => setPriceFilter(e.target.value)}
              className="px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary-400"
            >
              <option value="all">All Price Bands</option>
              <option value="budget">Budget</option>
              <option value="mid-range">Mid-range</option>
              <option value="premium">Premium</option>
              <option value="luxury">Luxury</option>
            </select>
          ) : null}
        </div>



        {filtered.length === 0 ? (
          <EmptyState message={`No ${config.label.toLowerCase()} found. Try a different search.`} />
        ) : (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((biz) => (
              <div key={biz.id} className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all">
                <div className="relative h-40 overflow-hidden">
                  {biz.image_url && <img src={biz.image_url} alt={biz.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />}
                  {biz.is_featured && (
                    <div className="absolute top-3 right-3 bg-primary-600 text-white text-xs font-medium px-2 py-1 rounded-lg">Featured</div>
                  )}
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <VerificationBadge status={biz.verification_status} />
                    {biz.price_band && <span className="text-xs text-gray-400 capitalize">{biz.price_band}</span>}
                  </div>
                  <h3 className="font-semibold text-gray-900">{biz.name}</h3>
                  <p className="text-sm text-gray-500 mt-1 line-clamp-2">{biz.short_desc}</p>

                  {biz.address && (
                    <p className="text-xs text-gray-400 mt-3 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" /> {biz.address}
                    </p>
                  )}

                  <div className="mt-4 flex flex-wrap gap-2">
                    {biz.phone && (
                      <a href={`tel:${biz.phone}`} className="px-3 py-1.5 bg-gray-50 hover:bg-gray-100 rounded-lg text-xs font-medium text-gray-700 flex items-center gap-1 transition-colors">
                        <Phone className="w-3.5 h-3.5" /> Call
                      </a>
                    )}
                    {biz.email && (
                      <a href={`mailto:${biz.email}`} className="px-3 py-1.5 bg-gray-50 hover:bg-gray-100 rounded-lg text-xs font-medium text-gray-700 flex items-center gap-1 transition-colors">
                        <Mail className="w-3.5 h-3.5" /> Email
                      </a>
                    )}
                    {biz.website && (
                      <a href={biz.website} target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 bg-gray-50 hover:bg-gray-100 rounded-lg text-xs font-medium text-gray-700 flex items-center gap-1 transition-colors">
                        <Globe className="w-3.5 h-3.5" /> Website
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
