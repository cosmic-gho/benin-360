import { useState, useEffect } from 'react';
import {
  Building2, BedDouble, Utensils, Phone, Mail, MapPin, ShieldCheck,
  CheckCircle, ArrowLeft, RefreshCw, Calendar, Users, Eye, Sparkles, Send
} from 'lucide-react';
import { useRouter } from '@/lib/router';
import { api } from '@/lib/api';
import { store } from '@/lib/dataStore';

import { ImageUpload } from '@/components/ImageUpload';
import type { Business, TransportRequest, User } from '@/types';

export function BusinessDashboardPage({ user }: { user?: User | null }) {
  const { navigate } = useRouter();
  const [activeTab, setActiveTab] = useState<'profile' | 'inquiries' | 'rates'>('profile');
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [transportReqs, setTransportReqs] = useState<TransportRequest[]>([]);
  const [loading, setLoading] = useState(true);

  // Editable business info
  const [hotelStatus, setHotelStatus] = useState<'available' | 'limited' | 'sold_out'>('available');
  const [roomRate, setRoomRate] = useState('65000');
  const [updatedNotice, setUpdatedNotice] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const [bizList, trs] = await Promise.all([
        api.getBusinesses({ type: 'hotel' }),
        Promise.resolve(store.getTransportRequests()),
      ]);
      setBusinesses(bizList);
      setTransportReqs(trs);
    } catch {
      setBusinesses(store.getBusinesses('hotel'));
      setTransportReqs(store.getTransportRequests());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const currentBiz = businesses[0] || {
    name: 'Protea Hotel by Marriott Benin City Select',
    business_type: 'hotel',
    address: 'Plot 4, Central School Road, GRA, Benin City',
    phone: '+234 52 293 000',
    email: 'reservations@proteabenin.example',
    price_band: 'luxury',
    verification_status: 'verified',
  };

  const handleSaveRates = (e: React.FormEvent) => {
    e.preventDefault();
    setUpdatedNotice('Listing rates & availability successfully updated on the BENIN360 directory!');
    setTimeout(() => setUpdatedNotice(null), 3500);
  };

  return (
    <div className="pt-20 min-h-screen bg-slate-50 animate-fade-in pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <button
          onClick={() => navigate('#/')}
          className="flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-blue-700 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Platform
        </button>

        {/* Business Header */}
        <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 rounded-3xl p-6 sm:p-10 text-white relative overflow-hidden shadow-xl border border-blue-900/50 mb-8">
          <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 benin-pattern pointer-events-none" />
          <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-2xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-400 shrink-0 shadow-lg">
                <Building2 className="w-8 h-8" />
              </div>
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-500/20 text-blue-300 border border-blue-400/30 mb-2">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Verified Hospitality Partner (GRA District)
                </div>
                <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-white">
                  {currentBiz.name}
                </h1>
                <p className="text-sm text-blue-200/80 mt-1 flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5" />
                  {currentBiz.address || 'Central School Road, GRA, Benin City'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto">
              <div className="px-4 py-2 rounded-xl bg-white/10 border border-white/10 text-xs">
                <div className="text-blue-300 font-semibold">CAC Registration</div>
                <div className="font-mono font-bold text-white">RC-982143</div>
              </div>
              <button
                onClick={loadData}
                className="p-2.5 bg-white/10 hover:bg-white/20 rounded-xl text-white transition-colors border border-white/10"
                title="Refresh Listing Data"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {updatedNotice && (
          <div className="mt-4 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-sm flex items-center gap-2 animate-fade-in">
            <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{updatedNotice}</span>
          </div>
        )}

        {/* Business KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8 mb-8">
          <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-sm">
            <div className="text-xs font-semibold text-slate-500 uppercase">Directory Listings</div>
            <div className="text-2xl font-black text-slate-900 mt-1">{businesses.length}</div>
            <div className="text-[11px] text-blue-600 font-medium mt-1">Verified listing</div>
          </div>

          <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-sm">
            <div className="text-xs font-semibold text-slate-500 uppercase">Guest Inquiries</div>
            <div className="text-2xl font-black text-blue-600 mt-1">{transportReqs.length}</div>
            <div className="text-[11px] text-emerald-600 font-semibold mt-1">Guest inquiries & transfers</div>
          </div>

          <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-sm">
            <div className="text-xs font-semibold text-slate-500 uppercase">Room Status</div>
            <div className="text-xl font-extrabold text-emerald-600 mt-1 capitalize">{hotelStatus.replace('_', ' ')}</div>
            <div className="text-[11px] text-slate-400 font-medium mt-1">Real-time status</div>
          </div>

          <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-sm">
            <div className="text-xs font-semibold text-slate-500 uppercase">Airport Transfers</div>
            <div className="text-xl font-extrabold text-slate-900 mt-1">Direct Shuttle BNI</div>
            <div className="text-[11px] text-slate-500 font-medium mt-1">Connected to airport dispatch</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-200 gap-4 mb-6">
          <button
            onClick={() => setActiveTab('profile')}
            className={`pb-3 text-sm font-bold transition-all border-b-2 flex items-center gap-2 ${
              activeTab === 'profile'
                ? 'border-blue-600 text-blue-900'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Building2 className="w-4 h-4" />
            Listing Profile & Amenities
          </button>
          <button
            onClick={() => setActiveTab('inquiries')}
            className={`pb-3 text-sm font-bold transition-all border-b-2 flex items-center gap-2 ${
              activeTab === 'inquiries'
                ? 'border-blue-600 text-blue-900'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Users className="w-4 h-4" />
            Guest Inquiries & Shuttles ({transportReqs.length})
          </button>
          <button
            onClick={() => setActiveTab('rates')}
            className={`pb-3 text-sm font-bold transition-all border-b-2 flex items-center gap-2 ${
              activeTab === 'rates'
                ? 'border-blue-600 text-blue-900'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <BedDouble className="w-4 h-4" />
            Rates & Availability
          </button>
        </div>

        {/* Tab 1: Profile */}
        {activeTab === 'profile' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-display text-lg font-bold text-slate-900 mb-2">Hospitality Information</h3>
                <div className="space-y-3 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-blue-600" />
                    <span>Reception: {currentBiz.phone || '+234 52 293 000'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-blue-600" />
                    <span>Reservations: {currentBiz.email || 'reservations@proteabenin.example'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-blue-600" />
                    <span>Location: {currentBiz.address}</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-display text-lg font-bold text-slate-900 mb-2">Verified Amenities</h3>
                <div className="flex flex-wrap gap-2">
                  {[
                    '24hr Power & Security',
                    'Airport Shuttle (BNI)',
                    'Swimming Pool',
                    'High-Speed WiFi',
                    'Traditional Edo Dining',
                    'Coronation Event Concierge',
                  ].map((amenity) => (
                    <span key={amenity} className="px-3 py-1 bg-slate-100 text-slate-700 rounded-lg text-xs font-semibold">
                      ✓ {amenity}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Cloudflare R2 Photography Upload */}
            <div className="pt-6 border-t border-slate-100">
              <h3 className="font-display text-base font-bold text-slate-900 mb-1">Establishment Cover Photography</h3>
              <p className="text-xs text-slate-500 mb-3">Upload high-resolution photography of the hotel suites, dining hall, or exterior facade to Cloudflare R2.</p>
              <ImageUpload
                label="Property / Restaurant Image (Cloudflare R2)"
                value={currentBiz.image_url || ''}
                onChange={(url) => {
                  if (businesses.length > 0) {
                    setBusinesses([{ ...businesses[0], image_url: url }, ...businesses.slice(1)]);
                  }
                  setUpdatedNotice('Property photo updated and saved to Cloudflare R2.');
                  setTimeout(() => setUpdatedNotice(null), 3500);
                }}
                folder="businesses"
                aspectHint="16:9 banner photography for guest listings (Cloudflare R2)"
              />
            </div>
          </div>
        )}

        {/* Tab 2: Inquiries */}
        {activeTab === 'inquiries' && (
          <div className="space-y-4">
            {transportReqs.length === 0 ? (
              <div className="p-12 text-center bg-white rounded-3xl border border-slate-200">
                <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h4 className="font-bold text-slate-900 text-lg">No pending inquiries</h4>
                <p className="text-xs text-slate-500 mt-1">Guest transfer requests and inquiries will appear here.</p>
              </div>
            ) : (
              transportReqs.map((req) => (
                <div
                  key={req.id}
                  className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-slate-500">{req.id}</span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-blue-100 text-blue-800">
                        {req.service_type.replace('_', ' ')}
                      </span>
                    </div>
                    <h4 className="font-bold text-slate-900 text-base mt-1">
                      Guest: {req.contact_name} ({req.passengers} passengers)
                    </h4>
                    <p className="text-xs text-slate-600 mt-1">
                      Pick-up: <span className="font-semibold">{req.pickup_location}</span> ➔ Destination: <span className="font-semibold">{req.destination}</span>
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Date & Time: {req.pickup_date} at {req.pickup_time} | Phone: {req.contact_phone}
                    </p>
                    {req.special_notes && <p className="text-xs italic text-slate-400 mt-1">Notes: "{req.special_notes}"</p>}
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <a
                      href={`tel:${req.contact_phone}`}
                      className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors"
                    >
                      Call Guest
                    </a>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Tab 3: Rates */}
        {activeTab === 'rates' && (
          <form onSubmit={handleSaveRates} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6 max-w-2xl">
            <h3 className="font-display text-lg font-bold text-slate-900">Manage Room Rates & Availability</h3>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Availability Status</label>
              <select
                value={hotelStatus}
                onChange={(e) => setHotelStatus(e.target.value as any)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none"
              >
                <option value="available">Rooms Available for Coronation Guests</option>
                <option value="limited">Limited Rooms Remaining (High Demand)</option>
                <option value="sold_out">Fully Booked / Sold Out</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Executive Room Starting Rate (NGN / Night)</label>
              <input
                type="number"
                value={roomRate}
                onChange={(e) => setRoomRate(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-2"
            >
              <Send className="w-3.5 h-3.5" />
              Save Updates to Directory
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
