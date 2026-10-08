import { useState, useEffect, useMemo } from 'react';
import { Calendar, Clock, MapPin, ArrowLeft, Search, CalendarPlus, Navigation } from 'lucide-react';
import { api } from '@/lib/api';
import { useRouter } from '@/lib/router';
import { store } from '@/lib/dataStore';
import { formatDate, formatDateShort } from '@/lib/utils';
import type { EventItem } from '@/types';
import { VerificationBadge, LoadingSpinner, EmptyState } from '@/components/ui';

export function EventsPage() {
  const { navigate } = useRouter();
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'upcoming' | 'today' | 'past' | 'all'>('upcoming');
  const [search, setSearch] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const data = await api.getEvents();
        setEvents(data);
      } catch {
        setEvents(store.getEvents());
      } finally {
        setLoading(false);
      }
    })();
  }, []);


  const filteredEvents = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayStr = today.toISOString().split('T')[0];

    return events.filter((e) => {
      // Search filter
      if (search && !e.title.toLowerCase().includes(search.toLowerCase()) && !e.description?.toLowerCase().includes(search.toLowerCase()) && !e.venue?.toLowerCase().includes(search.toLowerCase())) {
        return false;
      }

      const eDate = new Date(e.start_date);
      eDate.setHours(0, 0, 0, 0);

      if (filter === 'today') {
        const isStartDateToday = e.start_date === todayStr;
        const isSpanningToday = e.end_date ? (e.start_date <= todayStr && e.end_date >= todayStr) : false;
        return isStartDateToday || isSpanningToday;
      }
      if (filter === 'upcoming') {
        return eDate >= today || (e.end_date && new Date(e.end_date) >= today);
      }
      if (filter === 'past') {
        return eDate < today && (!e.end_date || new Date(e.end_date) < today);
      }
      return true;
    }).sort((a, b) => a.start_date.localeCompare(b.start_date));
  }, [events, filter, search]);

  if (loading) return <LoadingSpinner message="Loading events..." />;

  return (
    <div className="pt-20 min-h-screen bg-gray-50 animate-fade-in pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <button
          onClick={() => navigate('#/')}
          className="flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-primary-600 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </button>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-primary-100 text-primary-800 mb-3">
              <Calendar className="w-3.5 h-3.5" />
              Official & Community Event Calendar
            </div>
            <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-gray-900">
              Coronation Anniversary & Cultural Events
            </h1>
            <p className="mt-2 text-sm text-gray-600 max-w-2xl">
              Verified ceremonial calendar for the 10th Coronation Anniversary of the Oba of Benin, guild exhibitions, symposiums, and year-round cultural activities.
            </p>
          </div>
        </div>



        {/* Filter and Search Bar */}
        <div className="mt-8 flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="flex flex-wrap gap-2 w-full sm:w-auto">
            {(['upcoming', 'today', 'past', 'all'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all capitalize ${
                  filter === f
                    ? 'bg-primary-600 text-white shadow-md'
                    : 'bg-white text-gray-600 border border-gray-200 hover:border-primary-300'
                }`}
              >
                {f === 'today' ? "Today's Events" : f}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search title, venue, keywords..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary-500"
            />
          </div>
        </div>

        {/* Event List */}
        {filteredEvents.length === 0 ? (
          <div className="mt-8 bg-white rounded-3xl p-12 text-center border border-gray-100">
            <EmptyState message={`No ${filter} events found matching your search.`} />
            <button
              onClick={() => { setFilter('all'); setSearch(''); }}
              className="mt-4 px-4 py-2 bg-primary-50 text-primary-700 rounded-xl text-xs font-semibold hover:bg-primary-100"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => (
              <button
                key={event.id}
                onClick={() => navigate(`#events/${event.slug}`)}
                className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 text-left border border-gray-100 flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-48 overflow-hidden bg-gray-100">
                    {event.cover_image && (
                      <img
                        src={event.cover_image}
                        alt={event.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    )}
                    <div className="absolute top-3 left-3 bg-white/95 backdrop-blur rounded-xl px-3 py-1.5 shadow-md">
                      <div className="text-xs font-extrabold text-primary-600">{formatDateShort(event.start_date)}</div>
                      {event.end_date && event.end_date !== event.start_date && (
                        <div className="text-[10px] text-gray-500">to {formatDateShort(event.end_date)}</div>
                      )}
                    </div>
                    <div className="absolute top-3 right-3">
                      <VerificationBadge status={event.verification_status} />
                    </div>
                  </div>

                  <div className="p-5">
                    {event.category && (
                      <span className="text-[11px] font-semibold text-primary-600 uppercase tracking-wider">
                        {event.category}
                      </span>
                    )}
                    <h3 className="font-bold text-gray-900 group-hover:text-primary-600 transition-colors line-clamp-2 text-base mt-1">
                      {event.title}
                    </h3>
                    <p className="text-xs text-gray-600 mt-2 line-clamp-2 leading-relaxed">
                      {event.description}
                    </p>
                  </div>
                </div>

                <div className="p-5 pt-0 border-t border-gray-50 space-y-1.5 text-xs text-gray-500">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-primary-500 shrink-0" />
                    <span>{event.start_time || 'Time TBA'}{event.end_time ? ` - ${event.end_time}` : ''}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-secondary-500 shrink-0" />
                    <span className="truncate">{event.venue || 'Benin City'}</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
