import { useState, useEffect } from 'react';
import { ArrowLeft, UtensilsCrossed, MapPin, Info, Flame, Soup } from 'lucide-react';
import { api } from '@/lib/api';
import { useRouter } from '@/lib/router';
import type { Business } from '@/types';
import { LoadingSpinner, EmptyState } from '@/components/ui';

const edoDishes = [
  { name: 'Banga Rice', description: 'A rich, fragrant rice dish cooked in palm nut extract with fresh fish or meat. A beloved Edo specialty.', image: 'https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg' },
  { name: 'Pepper Soup', description: 'A spicy, aromatic broth made with catfish, goat meat or chicken and traditional Edo spices.', image: 'https://images.pexels.com/photos/5409027/pexels-photo-5409027.jpeg' },
  { name: 'Owo Soup', description: 'A traditional Edo soup made with palm oil, potash and assorted meat or fish. Often served with yam or plantain.', image: 'https://images.pexels.com/photos/5848479/pexels-photo-5848479.jpeg' },
  { name: 'Black Soup (Omoebe)', description: 'A distinctive dark soup made from bitter leaf, palm oil and local spices. A true taste of Benin.', image: 'https://images.pexels.com/photos/674574/pexels-photo-674574.jpeg' },
  { name: 'Yam & Egusi', description: 'Pounded yam served with egusi (melon seed) soup and assorted meats - a Nigerian classic popular in Benin.', image: 'https://images.pexels.com/photos/533342/pexels-photo-533342.jpeg' },
  { name: 'Akara & Pap', description: 'Fried bean cakes served with hot cornmeal porridge - a popular Benin City breakfast.', image: 'https://images.pexels.com/photos/5409010/pexels-photo-5409010.jpeg' },
];

export function FoodGuidePage() {
  const { navigate } = useRouter();
  const [restaurants, setRestaurants] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const list = await api.getBusinesses({ type: 'restaurant' });
        setRestaurants(list);
      } catch (err) {
        console.error('Failed to load restaurants from backend:', err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);



  if (loading) return <LoadingSpinner message="Loading food guide..." />;

  return (
    <div className="pt-20 min-h-screen bg-gray-50 animate-fade-in">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <button onClick={() => navigate('#/')} className="flex items-center gap-1 text-sm text-gray-500 hover:text-primary-600 mb-4">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </button>

        <h1 className="font-display text-3xl sm:text-4xl font-bold text-gray-900">Benin Food Guide</h1>
        <p className="mt-2 text-gray-500">Discover Edo cuisine and the best places to eat in Benin City</p>

        {/* Featured Edo Dishes */}
        <div className="mt-8">
          <h2 className="font-display text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Flame className="w-6 h-6 text-accent-500" /> Classic Edo Dishes
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {edoDishes.map((dish) => (
              <div key={dish.name} className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all">
                <div className="relative h-36 overflow-hidden">
                  <img src={dish.image} alt={dish.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                    <Soup className="w-4 h-4 text-primary-500" /> {dish.name}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">{dish.description}</p>
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* Restaurants */}
        <div className="mt-10">
          <h2 className="font-display text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <UtensilsCrossed className="w-6 h-6 text-primary-600" /> Where to Eat
          </h2>
          {restaurants.length === 0 ? (
            <EmptyState message="No restaurants listed yet." />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {restaurants.map((rest) => (
                <div key={rest.id} className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all">
                  <div className="relative h-40 overflow-hidden">
                    {rest.image_url && <img src={rest.image_url} alt={rest.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />}
                    {rest.is_featured && <div className="absolute top-3 right-3 bg-primary-600 text-white text-xs font-medium px-2 py-1 rounded-lg">Featured</div>}
                  </div>
                  <div className="p-5">
                    <h3 className="font-semibold text-gray-900">{rest.name}</h3>
                    <p className="text-sm text-gray-500 mt-1 line-clamp-2">{rest.short_desc}</p>
                    {rest.address && (
                      <p className="text-xs text-gray-400 mt-3 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" /> {rest.address}
                      </p>
                    )}
                    {rest.price_band && (
                      <span className="mt-3 inline-block text-xs text-gray-400 capitalize">{rest.price_band}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Cultural note */}
        <div className="mt-8 bg-secondary-50 border border-secondary-200 rounded-xl p-5">
          <h3 className="font-semibold text-secondary-900 mb-2 flex items-center gap-2">
            <Info className="w-5 h-5" /> About Edo Cuisine
          </h3>
          <p className="text-sm text-secondary-800 leading-relaxed">
            Edo cuisine is known for its rich use of palm oil, fresh herbs and traditional spices. Many dishes
            are rooted in centuries of Benin Kingdom culinary tradition. Visitors should explore both restaurant
            dining and street food for the full experience. Always check food hygiene standards and ask locals
            for recommendations.
          </p>
        </div>
      </div>
    </div>
  );
}
