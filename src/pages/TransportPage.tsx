import { useState, useEffect } from 'react';
import {
  Car, Plane, Calendar, Clock, Users, Phone, Mail, CheckCircle,
  ShieldCheck, AlertCircle, ArrowLeft, ArrowRight, MapPin, Send
} from 'lucide-react';
import { useRouter } from '@/lib/router';
import { store } from '@/lib/dataStore';
import { api } from '@/lib/api';
import { VerificationBadge, DemoBanner } from '@/components/ui';
import type { TransportProvider, TransportRequest } from '@/types';

export function TransportPage() {
  const { navigate } = useRouter();
  const [providers, setProviders] = useState<TransportProvider[]>(() => store.getTransportProviders());

  useEffect(() => {
    api.getTransportProviders().then(setProviders).catch(() => {});
  }, []);

  const [formData, setFormData] = useState({
    service_type: 'airport_transfer' as TransportRequest['service_type'],
    provider_id: providers[0]?.id || '',
    pickup_location: '',
    destination: '',
    pickup_date: '',
    pickup_time: '',
    passengers: 1,
    contact_name: '',
    contact_phone: '',
    contact_email: '',
    special_notes: '',
  });

  const [submittedRequest, setSubmittedRequest] = useState<TransportRequest | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const newReq = await api.createTransportRequest({
        service_type: formData.service_type,
        pickup_location: formData.pickup_location,
        destination: formData.destination,
        pickup_date: formData.pickup_date,
        pickup_time: formData.pickup_time,
        passengers: formData.passengers,
        contact_name: formData.contact_name,
        contact_phone: formData.contact_phone,
        contact_email: formData.contact_email,
        special_notes: formData.special_notes,
      });
      setSubmittedRequest(newReq);
    } catch {
      const fallbackReq = store.submitTransportRequest({
        service_type: formData.service_type,
        provider_id: formData.provider_id || undefined,
        pickup_location: formData.pickup_location,
        destination: formData.destination,
        pickup_date: formData.pickup_date,
        pickup_time: formData.pickup_time,
        passengers: formData.passengers,
        contact_name: formData.contact_name,
        contact_phone: formData.contact_phone,
        contact_email: formData.contact_email,
        special_notes: formData.special_notes,
      });
      setSubmittedRequest(fallbackReq);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="pt-20 min-h-screen bg-gray-50 animate-fade-in pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <button
          onClick={() => navigate('#/')}
          className="flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-primary-600 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </button>

        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-primary-100 text-primary-800 mb-3">
            <Car className="w-3.5 h-3.5" />
            Verified Logistics & Chauffeurs
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-gray-900 leading-tight">
            Benin Transport & Airport Transfers
          </h1>
          <p className="mt-2 text-base text-gray-600">
            Reliable airport pick-ups from Benin Airport (BNI), vetted private chauffeurs, and anniversary event shuttles.
          </p>
        </div>

        <div className="mt-6">
          <DemoBanner message="Transport providers and booking requests are connected to the live admin dashboard. Payment gateways (Paystack/Flutterwave) will activate prior to public launch." />
        </div>

        <div className="mt-10 grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Booking Request Form */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100">
            {submittedRequest ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-success-100 text-success-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-10 h-10" />
                </div>
                <h3 className="font-display text-2xl font-bold text-gray-900">Transport Request Received!</h3>
                <p className="mt-2 text-sm text-gray-600 max-w-md mx-auto">
                  Your reservation reference is <span className="font-mono font-bold text-primary-600">{submittedRequest.id}</span>.
                  A verified transport liaison will contact you via WhatsApp / Phone shortly to confirm driver dispatch.
                </p>

                <div className="mt-6 p-4 bg-gray-50 rounded-2xl max-w-md mx-auto text-left text-sm space-y-2 border border-gray-100">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Service:</span>
                    <span className="font-semibold text-gray-900 capitalize">{submittedRequest.service_type.replace('_', ' ')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Pickup:</span>
                    <span className="font-semibold text-gray-900">{submittedRequest.pickup_location}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Destination:</span>
                    <span className="font-semibold text-gray-900">{submittedRequest.destination}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Date & Time:</span>
                    <span className="font-semibold text-gray-900">{submittedRequest.pickup_date} at {submittedRequest.pickup_time}</span>
                  </div>
                </div>

                <button
                  onClick={() => setSubmittedRequest(null)}
                  className="mt-6 px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-sm font-semibold transition-colors"
                >
                  Book Another Transfer
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <h2 className="font-display text-xl font-bold text-gray-900">Request a Driver or Airport Transfer</h2>
                  <p className="text-xs text-gray-500 mt-1">Fill out your travel details and a dispatcher will contact you.</p>
                </div>

                {/* Service Type Selection */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-2">Service Type</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { key: 'airport_transfer', label: 'Airport Transfer', icon: Plane },
                      { key: 'private_driver', label: 'Private Chauffeur', icon: Car },
                      { key: 'event_shuttle', label: 'Event Shuttle', icon: Calendar },
                      { key: 'group_charter', label: 'Group Coaster', icon: Users },
                    ].map((st) => (
                      <button
                        type="button"
                        key={st.key}
                        onClick={() => setFormData({ ...formData, service_type: st.key as TransportRequest['service_type'] })}
                        className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between ${
                          formData.service_type === st.key
                            ? 'border-primary-500 bg-primary-50 text-primary-900 shadow-sm'
                            : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                        }`}
                      >
                        <st.icon className={`w-5 h-5 mb-2 ${formData.service_type === st.key ? 'text-primary-600' : 'text-gray-400'}`} />
                        <span className="text-xs font-semibold leading-tight">{st.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Pick-up Location</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Benin Airport (BNI) or Hotel"
                      value={formData.pickup_location}
                      onChange={(e) => setFormData({ ...formData, pickup_location: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:border-primary-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Destination</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Protea Hotel GRA / King's Square"
                      value={formData.destination}
                      onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:border-primary-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Date</label>
                    <input
                      type="date"
                      required
                      value={formData.pickup_date}
                      onChange={(e) => setFormData({ ...formData, pickup_date: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:border-primary-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Time</label>
                    <input
                      type="time"
                      required
                      value={formData.pickup_time}
                      onChange={(e) => setFormData({ ...formData, pickup_time: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:border-primary-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Passengers</label>
                    <input
                      type="number"
                      min={1}
                      max={40}
                      required
                      value={formData.passengers}
                      onChange={(e) => setFormData({ ...formData, passengers: parseInt(e.target.value) || 1 })}
                      className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:border-primary-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Your Full Name</label>
                    <input
                      type="text"
                      required
                      placeholder="Osahon Johnson"
                      value={formData.contact_name}
                      onChange={(e) => setFormData({ ...formData, contact_name: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:border-primary-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Phone / WhatsApp</label>
                    <input
                      type="tel"
                      required
                      placeholder="+234 or +44..."
                      value={formData.contact_phone}
                      onChange={(e) => setFormData({ ...formData, contact_phone: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:border-primary-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Email Address</label>
                    <input
                      type="email"
                      required
                      placeholder="visitor@example.com"
                      value={formData.contact_email}
                      onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:border-primary-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Flight Number or Special Notes (Optional)</label>
                  <textarea
                    rows={2}
                    placeholder="e.g. Arriving on Air Peace flight from Abuja; 2 large bags."
                    value={formData.special_notes}
                    onChange={(e) => setFormData({ ...formData, special_notes: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:border-primary-500 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3.5 bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white rounded-xl text-sm font-semibold transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  {submitting ? 'Submitting Request...' : 'Submit Transport Request'}
                </button>
              </form>
            )}
          </div>

          {/* Providers Directory & Info */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
              <h3 className="font-display text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-secondary-600" />
                Verified Transport Providers
              </h3>
              <div className="space-y-4">
                {providers.map((p) => (
                  <div key={p.id} className="p-4 rounded-2xl bg-gray-50 border border-gray-100">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-bold text-gray-900 text-sm">{p.name}</h4>
                        <div className="text-xs text-primary-600 font-medium mt-0.5">{p.service_type}</div>
                      </div>
                      <VerificationBadge status={p.is_verified ? 'verified' : 'unverified'} />
                    </div>
                    <p className="text-xs text-gray-600 mt-2">{p.description}</p>
                    <div className="mt-3 text-xs text-gray-500 flex flex-col gap-1">
                      <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-gray-400" /> {p.area_covered}</span>
                      <span className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-gray-400" /> {p.phone}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Travel Advisory Card */}
            <div className="bg-gradient-to-br from-secondary-50 to-teal-50 rounded-3xl p-6 border border-secondary-100 text-sm">
              <h4 className="font-bold text-secondary-900 flex items-center gap-2 mb-2">
                <AlertCircle className="w-4 h-4 text-secondary-600" />
                Visitor Travel Guidance
              </h4>
              <p className="text-secondary-800 text-xs leading-relaxed">
                Benin Airport (BNI) is situated within 10-15 minutes driving time from GRA and the city center.
                During peak anniversary festivities, road traffic around King's Square is managed by traffic marshals.
                Booking your transport in advance guarantees smooth transit.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
