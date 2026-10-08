import { useState, useEffect } from 'react';
import {
  Compass, Calendar, Clock, Users, Phone, Mail, ShieldCheck, CheckCircle2,
  ArrowLeft, RefreshCw, MapPin, Award, AlertCircle, Send
} from 'lucide-react';
import { useRouter } from '@/lib/router';
import { api } from '@/lib/api';
import { formatNGN } from '@/lib/utils';

import type { BookingRequest, Experience, User } from '@/types';

export function GuideDashboardPage({ user }: { user?: User | null }) {
  const { navigate } = useRouter();
  const [activeTab, setActiveTab] = useState<'bookings' | 'experiences' | 'protocol'>('bookings');
  const [bookings, setBookings] = useState<BookingRequest[]>([]);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const [exps, bks] = await Promise.all([
        api.getExperiences(),
        api.getBookings(),
      ]);
      setExperiences(exps);
      setBookings(bks);
    } catch (err) {
      console.error('Failed to load guide dashboard data from backend:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleUpdateStatus = async (id: string, status: BookingRequest['status']) => {
    try {
      await api.updateBookingStatus(id, status);
      await loadData();
    } catch (err) {
      console.error('Failed to update booking status:', err);
    }
  };

  return (
    <div className="pt-20 min-h-screen bg-emerald-50/40 animate-fade-in pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <button
          onClick={() => navigate('#/')}
          className="flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-emerald-700 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Platform
        </button>

        {/* Guide Header */}
        <div className="bg-gradient-to-r from-stone-900 via-emerald-950 to-stone-900 rounded-3xl p-6 sm:p-10 text-white relative overflow-hidden shadow-xl border border-emerald-800/40 mb-8">
          <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-15 benin-pattern pointer-events-none" />
          <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-400 shrink-0 shadow-lg">
                <Compass className="w-8 h-8" />
              </div>
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 mb-2">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Certified Senior Heritage Guide Portal
                </div>
                <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-white">
                  {user?.first_name ? `${user.first_name} ${user.last_name || ''}` : 'Osaro Obasogie'}
                </h1>
                <p className="text-sm text-emerald-200/80 mt-1 flex items-center gap-2">
                  <Award className="w-3.5 h-3.5" />
                  Accreditation: BEN-GUIDE-2024-042 | Languages: English, Edo, French, Pidgin
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto">
              <button
                onClick={loadData}
                className="p-2.5 bg-white/10 hover:bg-white/20 rounded-xl text-white transition-colors border border-white/10"
                title="Refresh Bookings"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Guide KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8 mb-8">
          <div className="p-5 bg-white rounded-2xl border border-emerald-100 shadow-sm">
            <div className="text-xs font-semibold text-emerald-600 uppercase">Tours Guided</div>
            <div className="text-2xl font-black text-stone-900 mt-1">{bookings.filter(b => b.status === 'confirmed').length}</div>
            <div className="text-[11px] text-emerald-700 font-medium mt-1">Confirmed tours</div>
          </div>

          <div className="p-5 bg-white rounded-2xl border border-emerald-100 shadow-sm">
            <div className="text-xs font-semibold text-emerald-600 uppercase">Incoming Bookings</div>
            <div className="text-2xl font-black text-emerald-700 mt-1">{bookings.length}</div>
            <div className="text-[11px] text-stone-500 font-medium mt-1">Coronation special trails</div>
          </div>

          <div className="p-5 bg-white rounded-2xl border border-emerald-100 shadow-sm">
            <div className="text-xs font-semibold text-emerald-600 uppercase">Active Trails</div>
            <div className="text-2xl font-black text-stone-900 mt-1">{experiences.length}</div>
            <div className="text-[11px] text-stone-400 font-medium mt-1">Palace & Moat expeditions</div>
          </div>

          <div className="p-5 bg-white rounded-2xl border border-emerald-100 shadow-sm">
            <div className="text-xs font-semibold text-emerald-600 uppercase">Protocol Clearance</div>
            <div className="text-xl font-extrabold text-emerald-700 mt-1 flex items-center gap-1.5">
              <span>Palace Verified</span>
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-[11px] text-stone-500 font-medium mt-1">Royal Courtyard Access</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-emerald-200/80 gap-4 mb-6">
          <button
            onClick={() => setActiveTab('bookings')}
            className={`pb-3 text-sm font-bold transition-all border-b-2 flex items-center gap-2 ${
              activeTab === 'bookings'
                ? 'border-emerald-600 text-emerald-950'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <Calendar className="w-4 h-4" />
            Visitor Tour Bookings ({bookings.length})
          </button>
          <button
            onClick={() => setActiveTab('experiences')}
            className={`pb-3 text-sm font-bold transition-all border-b-2 flex items-center gap-2 ${
              activeTab === 'experiences'
                ? 'border-emerald-600 text-emerald-950'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <Compass className="w-4 h-4" />
            My Tour Experiences ({experiences.length})
          </button>
          <button
            onClick={() => setActiveTab('protocol')}
            className={`pb-3 text-sm font-bold transition-all border-b-2 flex items-center gap-2 ${
              activeTab === 'protocol'
                ? 'border-emerald-600 text-emerald-950'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            Royal Palace Protocol
          </button>
        </div>

        {/* Tab 1: Bookings */}
        {activeTab === 'bookings' && (
          <div className="space-y-4">
            {bookings.length === 0 ? (
              <div className="p-12 text-center bg-white rounded-3xl border border-emerald-100">
                <Calendar className="w-12 h-12 text-stone-300 mx-auto mb-3" />
                <h4 className="font-bold text-stone-900 text-lg">No tour bookings yet</h4>
                <p className="text-xs text-stone-500 mt-1">Tour bookings submitted by visitors will be routed here.</p>
              </div>
            ) : (
              bookings.map((bk) => (
                <div
                  key={bk.id}
                  className="p-5 bg-white rounded-2xl border border-emerald-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-stone-500">{bk.id}</span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        bk.status === 'confirmed' ? 'bg-emerald-100 text-emerald-800' :
                        bk.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                        'bg-amber-100 text-amber-800'
                      }`}>
                        {bk.status}
                      </span>
                    </div>
                    <h4 className="font-bold text-stone-900 text-base mt-1">
                      {bk.experience?.title || 'Royal Palace Walking Tour'} (Party Size: {bk.party_size})
                    </h4>
                    <p className="text-xs text-stone-600 mt-1">
                      Visitor: <span className="font-semibold">{bk.visitor_name}</span> | Date: {bk.preferred_date} | Phone: {bk.visitor_phone}
                    </p>
                    {bk.special_requests && (
                      <p className="text-xs italic text-stone-500 mt-1">Special notes: "{bk.special_requests}"</p>
                    )}
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleUpdateStatus(bk.id, 'confirmed')}
                      className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-700 transition-colors"
                    >
                      Confirm Booking
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(bk.id, 'completed')}
                      className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors"
                    >
                      Mark Completed
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Tab 2: Experiences */}
        {activeTab === 'experiences' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {experiences.map((exp) => (
              <div
                key={exp.id}
                className="bg-white rounded-3xl overflow-hidden border border-emerald-100 shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="h-44 bg-stone-100 overflow-hidden">
                    <img
                      src={exp.image_url || 'https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f'}
                      alt={exp.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-5">
                    <h4 className="font-bold text-stone-900 text-base leading-snug">{exp.title}</h4>
                    <p className="text-xs text-stone-600 mt-1.5 line-clamp-2">{exp.description}</p>
                    <div className="mt-4 flex items-center justify-between text-xs">
                      <span className="font-semibold text-stone-500">Duration: {exp.duration_hours} hours</span>
                      <span className="font-extrabold text-emerald-700 text-base">
                        {exp.price_ngn ? formatNGN(exp.price_ngn) : 'Free Tour'}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-emerald-50/50 border-t border-emerald-100 flex items-center justify-between text-xs">
                  <span className="font-semibold text-emerald-800">Status: Active Trail</span>
                  <button
                    onClick={() => navigate('#/guides')}
                    className="text-emerald-700 font-bold hover:underline"
                  >
                    View Public Profile
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 3: Protocol */}
        {activeTab === 'protocol' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-emerald-100 shadow-sm space-y-4">
            <h3 className="font-display text-xl font-bold text-stone-900">Palace Cultural Protocols for Certified Guides</h3>
            <div className="space-y-3 text-xs text-stone-600 leading-relaxed">
              <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200">
                <h4 className="font-bold text-amber-900 mb-1">Dress Code Strictures</h4>
                <p className="text-amber-800">
                  Advise all tour participants to dress respectfully. Black clothing is strictly avoided within the royal palace enclosures as black signifies bereavement in ancient Edo monarchical customs.
                </p>
              </div>
              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200">
                <h4 className="font-bold text-emerald-900 mb-1">Photography Etiquette</h4>
                <p className="text-emerald-800">
                  Outer grounds and King's Square monuments are open for photography. Guides must seek clearance before photographing royal courtiers or sacred altars.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
