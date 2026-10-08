import { useState, useEffect } from 'react';
import {
  User, Stamp, Award, ShoppingBag, Car, Calendar, Compass, ArrowLeft,
  CheckCircle2, Clock, Trophy, MapPin, Sparkles, ExternalLink, RefreshCw
} from 'lucide-react';
import { useRouter } from '@/lib/router';
import { api } from '@/lib/api';
import { store } from '@/lib/dataStore';
import { formatDate } from '@/lib/utils';

import type { PassportStamp, BookingRequest, TransportRequest, MarketplaceOrder, User as UserType } from '@/types';

export function VisitorDashboardPage({ user }: { user?: UserType | null }) {
  const { navigate } = useRouter();
  const [activeTab, setActiveTab] = useState<'passport' | 'bookings' | 'orders' | 'itinerary'>('passport');
  const [stamps, setStamps] = useState<PassportStamp[]>([]);
  const [bookings, setBookings] = useState<BookingRequest[]>([]);
  const [transports, setTransports] = useState<TransportRequest[]>([]);
  const [orders, setOrders] = useState<MarketplaceOrder[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const [stampsList, bks, trs, ords] = await Promise.all([
        api.getPassportStamps(),
        Promise.resolve(store.getBookings()),
        Promise.resolve(store.getTransportRequests()),
        Promise.resolve(store.getOrders()),
      ]);
      setStamps(stampsList);
      setBookings(bks);
      setTransports(trs);
      setOrders(ords);
    } catch {
      setStamps(store.getStamps());
      setBookings(store.getBookings());
      setTransports(store.getTransportRequests());
      setOrders(store.getOrders());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const visitorName = user?.first_name ? `${user.first_name} ${user.last_name || ''}` : user?.username || 'Cultural Explorer';

  return (
    <div className="pt-20 min-h-screen bg-stone-50 animate-fade-in pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <button
          onClick={() => navigate('#/')}
          className="flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-primary-600 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Platform
        </button>

        {/* Visitor Header */}
        <div className="bg-gradient-to-r from-stone-900 via-primary-950 to-stone-900 rounded-3xl p-6 sm:p-10 text-white relative overflow-hidden shadow-xl border border-primary-900/50 mb-8">
          <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-15 benin-pattern pointer-events-none" />
          <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-2xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-amber-400 shrink-0 shadow-lg">
                <User className="w-8 h-8" />
              </div>
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-400/30 mb-2">
                  <Stamp className="w-3.5 h-3.5" />
                  Visitor & Explorer Personal Portal
                </div>
                <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-white">
                  {visitorName}
                </h1>
                <p className="text-sm text-amber-200/80 mt-1 flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5" />
                  Coronation Passport ID: <span className="font-mono font-bold">PASSPORT-BNI-2026</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto">
              <button
                onClick={() => navigate('#/passport')}
                className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-stone-950 font-bold rounded-xl text-xs sm:text-sm shadow-lg flex items-center gap-2 transition-all"
              >
                <Trophy className="w-4 h-4" />
                View Full Passport
              </button>
              <button
                onClick={loadData}
                className="p-2.5 bg-white/10 hover:bg-white/20 rounded-xl text-white transition-colors border border-white/10"
                title="Refresh Portal Data"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>



        {/* Visitor KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8 mb-8">
          <div className="p-5 bg-white rounded-2xl border border-stone-200 shadow-sm">
            <div className="text-xs font-semibold text-stone-500 uppercase">Stamps Collected</div>
            <div className="text-2xl font-black text-secondary-600 mt-1">{stamps.length}</div>
            <div className="text-[11px] text-stone-500 font-medium mt-1">Heritage monuments & events</div>
          </div>

          <div className="p-5 bg-white rounded-2xl border border-stone-200 shadow-sm">
            <div className="text-xs font-semibold text-stone-500 uppercase">Tour Bookings</div>
            <div className="text-2xl font-black text-primary-600 mt-1">{bookings.length}</div>
            <div className="text-[11px] text-stone-500 font-medium mt-1">Guided heritage walks</div>
          </div>

          <div className="p-5 bg-white rounded-2xl border border-stone-200 shadow-sm">
            <div className="text-xs font-semibold text-stone-500 uppercase">Airport Transfers</div>
            <div className="text-2xl font-black text-amber-600 mt-1">{transports.length}</div>
            <div className="text-[11px] text-stone-500 font-medium mt-1">Vetted private chauffeurs</div>
          </div>

          <div className="p-5 bg-white rounded-2xl border border-stone-200 shadow-sm">
            <div className="text-xs font-semibold text-stone-500 uppercase">Marketplace Orders</div>
            <div className="text-2xl font-black text-stone-900 mt-1">{orders.length}</div>
            <div className="text-[11px] text-emerald-600 font-semibold mt-1">Guild bronze & bead crafts</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-stone-200 gap-4 mb-6">
          <button
            onClick={() => setActiveTab('passport')}
            className={`pb-3 text-sm font-bold transition-all border-b-2 flex items-center gap-2 ${
              activeTab === 'passport'
                ? 'border-secondary-600 text-secondary-900'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <Stamp className="w-4 h-4" />
            My Passport Stamps ({stamps.length})
          </button>
          <button
            onClick={() => setActiveTab('bookings')}
            className={`pb-3 text-sm font-bold transition-all border-b-2 flex items-center gap-2 ${
              activeTab === 'bookings'
                ? 'border-secondary-600 text-secondary-900'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <Calendar className="w-4 h-4" />
            Tours & Transfers ({bookings.length + transports.length})
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`pb-3 text-sm font-bold transition-all border-b-2 flex items-center gap-2 ${
              activeTab === 'orders'
                ? 'border-secondary-600 text-secondary-900'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            Artisan Orders ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab('itinerary')}
            className={`pb-3 text-sm font-bold transition-all border-b-2 flex items-center gap-2 ${
              activeTab === 'itinerary'
                ? 'border-secondary-600 text-secondary-900'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <Compass className="w-4 h-4" />
            Suggested Itinerary
          </button>
        </div>

        {/* Tab 1: Passport Stamps */}
        {activeTab === 'passport' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {stamps.length === 0 ? (
              <div className="col-span-full p-12 text-center bg-white rounded-3xl border border-stone-200">
                <Stamp className="w-12 h-12 text-stone-300 mx-auto mb-3" />
                <h4 className="font-bold text-stone-900 text-lg">No stamps collected yet</h4>
                <p className="text-xs text-stone-500 mt-1">Visit heritage sites or coronation events and scan QR codes or claim stamps.</p>
                <button
                  onClick={() => navigate('#/passport')}
                  className="mt-4 px-4 py-2 bg-secondary-600 text-white rounded-xl text-xs font-semibold"
                >
                  Explore Passport Portal
                </button>
              </div>
            ) : (
              stamps.map((st) => (
                <div
                  key={st.id}
                  className="p-5 bg-white rounded-2xl border border-stone-200 shadow-sm flex items-start gap-4"
                >
                  <div className="w-12 h-12 rounded-xl bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-800 shrink-0 font-bold">
                    <Stamp className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-stone-100 text-stone-700">
                      {st.stamp_type}
                    </span>
                    <h4 className="font-bold text-stone-900 text-sm mt-1">{st.target_name}</h4>
                    <p className="text-[11px] text-stone-400 mt-1">Claimed: {formatDate(st.claimed_at)}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Tab 2: Bookings & Transfers */}
        {activeTab === 'bookings' && (
          <div className="space-y-4">
            <h4 className="font-bold text-stone-900 text-sm uppercase tracking-wide">Tour Guide Bookings</h4>
            {bookings.length === 0 ? (
              <p className="text-xs text-stone-500 italic">No tour bookings yet.</p>
            ) : (
              bookings.map((bk) => (
                <div key={bk.id} className="p-4 bg-white rounded-2xl border border-stone-200 shadow-sm">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="font-bold text-stone-900 text-sm">{bk.experience?.title || 'Heritage Walking Tour'}</span>
                      <p className="text-xs text-stone-500 mt-0.5">Date: {bk.preferred_date} | Party: {bk.party_size}</p>
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800">
                      {bk.status}
                    </span>
                  </div>
                </div>
              ))
            )}

            <h4 className="font-bold text-stone-900 text-sm uppercase tracking-wide pt-4">Airport Transfers & Chauffeurs</h4>
            {transports.length === 0 ? (
              <p className="text-xs text-stone-500 italic">No transport requests yet.</p>
            ) : (
              transports.map((tr) => (
                <div key={tr.id} className="p-4 bg-white rounded-2xl border border-stone-200 shadow-sm">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="font-bold text-stone-900 text-sm">{tr.pickup_location} ➔ {tr.destination}</span>
                      <p className="text-xs text-stone-500 mt-0.5">Date: {tr.pickup_date} at {tr.pickup_time}</p>
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-blue-100 text-blue-800">
                      {tr.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Tab 3: Marketplace Orders */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            {orders.length === 0 ? (
              <div className="p-12 text-center bg-white rounded-3xl border border-stone-200">
                <ShoppingBag className="w-12 h-12 text-stone-300 mx-auto mb-3" />
                <h4 className="font-bold text-stone-900 text-lg">No marketplace orders</h4>
                <p className="text-xs text-stone-500 mt-1">Order authentic Queen Idia masks or coral beads from verified guild artisans.</p>
                <button
                  onClick={() => navigate('#/marketplace')}
                  className="mt-4 px-4 py-2 bg-primary-600 text-white rounded-xl text-xs font-semibold"
                >
                  Browse Artisan Market
                </button>
              </div>
            ) : (
              orders.map((ord) => (
                <div key={ord.id} className="p-4 bg-white rounded-2xl border border-stone-200 shadow-sm">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="font-bold text-stone-900 text-sm">{ord.product?.title || 'Artisan Craft'} (Qty: {ord.quantity})</span>
                      <p className="text-xs text-stone-500 mt-0.5">Delivery: {ord.delivery_address}</p>
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-amber-100 text-amber-800">
                      {ord.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Tab 4: Itinerary */}
        {activeTab === 'itinerary' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-6">
            <h3 className="font-display text-xl font-bold text-stone-900">Recommended 2-Day Benin City Cultural Itinerary</h3>
            <div className="space-y-4 text-xs text-stone-700">
              <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200">
                <h4 className="font-bold text-amber-950 text-sm">Day 1: Monarchy, Antiquities & Bronze Smelting</h4>
                <ul className="mt-2 space-y-1 list-disc list-inside text-amber-900">
                  <li>Morning: National Museum Benin City at King's Square.</li>
                  <li>Midday: Palace of the Oba of Benin courtyard & Emotan Statue.</li>
                  <li>Lunch: Authentic Banga Soup with yellow starch at K&Q Restaurant.</li>
                  <li>Afternoon: Igun Street Bronze Casters workshop demonstration.</li>
                </ul>
              </div>
              <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200">
                <h4 className="font-bold text-emerald-950 text-sm">Day 2: Ancient Earthworks & Music Heritage</h4>
                <ul className="mt-2 space-y-1 list-disc list-inside text-emerald-900">
                  <li>Morning: Guided expedition along the ancient Benin Moats (Iya).</li>
                  <li>Midday: Ogiamien Ancient Palace.</li>
                  <li>Afternoon: Sir Victor Uwaifo Sound City & Art Centre.</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
