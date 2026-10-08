import { useState, useEffect } from 'react';
import {
  Star, Clock, Languages, Award, ArrowLeft, Calendar, Users, Phone,
  Mail, Send, CheckCircle2, ShieldCheck, MapPin
} from 'lucide-react';
import { useRouter } from '@/lib/router';
import { api } from '@/lib/api';
import { VerificationBadge } from '@/components/ui';
import type { Guide, Experience, BookingRequest } from '@/types';

export function GuideDetailPage({ slug }: { slug: string }) {
  const { navigate } = useRouter();
  const [guide, setGuide] = useState<Guide | null>(null);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [selectedExperience, setSelectedExperience] = useState<Experience | null>(null);

  // Booking Form State
  const [bookingForm, setBookingForm] = useState({
    visitor_name: '',
    visitor_email: '',
    visitor_phone: '',
    preferred_date: '',
    party_size: 2,
    special_requests: '',
  });
  const [submittedBooking, setSubmittedBooking] = useState<BookingRequest | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    (async () => {
      const g = await api.getGuide(slug);
      if (g) {
        setGuide(g);
        const allExps = await api.getExperiences();
        const guideExps = allExps.filter((e: Experience) => e.guide_id === g.id || (e as any).guide === g.id);
        setExperiences(guideExps);
        if (guideExps.length > 0) {
          setSelectedExperience(guideExps[0]);
        }
      }
    })();
  }, [slug]);

  if (!guide) {
    return (
      <div className="pt-24 min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Guide Not Found</h2>
        <p className="text-gray-500 mb-6">The requested tour guide profile could not be found.</p>
        <button
          onClick={() => navigate('#guides')}
          className="px-5 py-2.5 bg-primary-600 text-white rounded-xl text-sm font-semibold hover:bg-primary-700 transition-colors"
        >
          View All Tour Guides
        </button>
      </div>
    );
  }

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedExperience) return;

    setSubmitting(true);
    try {
      const res = await api.createBooking({
        experience_id: selectedExperience.id,
        guide_id: guide.id,
        visitor_name: bookingForm.visitor_name,
        visitor_email: bookingForm.visitor_email,
        visitor_phone: bookingForm.visitor_phone,
        preferred_date: bookingForm.preferred_date,
        party_size: bookingForm.party_size,
        special_requests: bookingForm.special_requests,
      });
      setSubmittedBooking(res);
    } catch (err: any) {
      console.error('Failed to create booking on backend:', err);
      alert('Unable to submit booking to server. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };


  return (
    <div className="pt-20 min-h-screen bg-gray-50 animate-fade-in pb-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <button
          onClick={() => navigate('#guides')}
          className="flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-primary-600 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Guides Directory
        </button>

        {/* Profile Header Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100 flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <img
            src={guide.avatar_url || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d'}
            alt={guide.name}
            className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl object-cover shadow-md shrink-0"
          />

          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-gray-900">{guide.name}</h1>
              <VerificationBadge status={guide.is_verified ? 'verified' : 'unverified'} />
            </div>

            <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-warning-400 fill-warning-400" />
                <span className="font-bold text-gray-900">{guide.rating}</span>
                <span className="text-gray-400">({guide.review_count} reviews)</span>
              </div>
              <div className="flex items-center gap-1">
                <Languages className="w-4 h-4 text-primary-500" />
                <span>{guide.languages.join(', ')}</span>
              </div>
            </div>

            <p className="mt-4 text-gray-700 text-sm leading-relaxed max-w-3xl">{guide.bio}</p>

            <div className="mt-4 flex flex-wrap gap-1.5">
              {guide.specialties.map((spec, i) => (
                <span key={i} className="px-3 py-1 bg-primary-50 text-primary-800 rounded-full text-xs font-medium">
                  {spec}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Content Layout */}
        <div className="mt-10 grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Experiences Offered */}
          <div className="lg:col-span-7 space-y-6">
            <h2 className="font-display text-xl font-bold text-gray-900">Bookable Experiences by {guide.name}</h2>

            {experiences.length === 0 ? (
              <p className="text-sm text-gray-500">No active experiences listed yet.</p>
            ) : (
              experiences.map((exp) => (
                <div
                  key={exp.id}
                  onClick={() => setSelectedExperience(exp)}
                  className={`p-6 rounded-3xl border transition-all cursor-pointer ${
                    selectedExperience?.id === exp.id
                      ? 'border-primary-500 bg-white ring-2 ring-primary-100 shadow-md'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-secondary-100 text-secondary-800">
                          {exp.duration_hours} Hours
                        </span>
                        {selectedExperience?.id === exp.id && (
                          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-primary-100 text-primary-700">
                            Selected
                          </span>
                        )}
                      </div>
                      <h3 className="font-bold text-gray-900 text-lg mt-2">{exp.title}</h3>
                      <p className="text-sm text-gray-600 mt-2 leading-relaxed">{exp.description}</p>
                    </div>

                    <div className="sm:text-right shrink-0">
                      <div className="text-xs text-gray-500">Price per group</div>
                      <div className="text-xl font-extrabold text-primary-600 mt-0.5">
                        ₦{exp.price_ngn?.toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Booking Form Card */}
          <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100 h-fit">
            <h3 className="font-display text-xl font-bold text-gray-900 mb-2">Request This Experience</h3>
            <p className="text-xs text-gray-500 mb-6">
              Send an enquiry to schedule your guided tour. Payment structure is designed for Paystack/Flutterwave escrow.
            </p>

            {submittedBooking ? (
              <div className="text-center py-6">
                <div className="w-14 h-14 bg-success-100 text-success-600 rounded-full flex items-center justify-center mx-auto mb-3">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="font-bold text-gray-900 text-lg">Booking Request Sent!</h4>
                <p className="text-xs text-gray-600 mt-2">
                  Request Ref: <span className="font-mono font-bold text-primary-600">{submittedBooking.id}</span>
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {guide.name} has been notified and will reply to confirm schedule and meeting point.
                </p>
                <button
                  onClick={() => setSubmittedBooking(null)}
                  className="mt-6 px-5 py-2 bg-primary-600 text-white rounded-xl text-xs font-semibold hover:bg-primary-700 transition-colors"
                >
                  Book Another Date
                </button>
              </div>
            ) : (
              <form onSubmit={handleBooking} className="space-y-4">
                {selectedExperience && (
                  <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 text-xs">
                    <span className="text-gray-500">Experience:</span>{' '}
                    <span className="font-bold text-gray-900">{selectedExperience.title}</span>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Your Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Osahon Ighodaro"
                    value={bookingForm.visitor_name}
                    onChange={(e) => setBookingForm({ ...bookingForm, visitor_name: e.target.value })}
                    className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:border-primary-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      required
                      placeholder="osahon@example.com"
                      value={bookingForm.visitor_email}
                      onChange={(e) => setBookingForm({ ...bookingForm, visitor_email: e.target.value })}
                      className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:border-primary-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Phone / WhatsApp</label>
                    <input
                      type="tel"
                      required
                      placeholder="+234 or +44..."
                      value={bookingForm.visitor_phone}
                      onChange={(e) => setBookingForm({ ...bookingForm, visitor_phone: e.target.value })}
                      className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:border-primary-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Preferred Date</label>
                    <input
                      type="date"
                      required
                      value={bookingForm.preferred_date}
                      onChange={(e) => setBookingForm({ ...bookingForm, preferred_date: e.target.value })}
                      className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:border-primary-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Party Size</label>
                    <input
                      type="number"
                      min={1}
                      max={30}
                      required
                      value={bookingForm.party_size}
                      onChange={(e) => setBookingForm({ ...bookingForm, party_size: parseInt(e.target.value) || 1 })}
                      className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:border-primary-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Special Requirements (Optional)</label>
                  <textarea
                    rows={2}
                    placeholder="e.g. Elderly parents in party; interest in bronze casting history."
                    value={bookingForm.special_requests}
                    onChange={(e) => setBookingForm({ ...bookingForm, special_requests: e.target.value })}
                    className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:border-primary-500 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3 bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-2 shadow-sm"
                >
                  <Send className="w-4 h-4" />
                  {submitting ? 'Submitting...' : 'Request Tour Booking'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
