import { useState, useEffect, useCallback } from 'react';
import {
  ShieldCheck, AlertCircle, CheckCircle, Clock, XCircle, ArrowLeft,
  Users, Eye, Calendar, MapPin, Car, ShoppingBag, Plus, RefreshCw, Filter,
  Cloud, Copy, ExternalLink, HardDrive, Check
} from 'lucide-react';
import { useRouter } from '@/lib/router';
import { store } from '@/lib/dataStore';
import { api } from '@/lib/api';
import { VerificationBadge, DemoBanner } from '@/components/ui';
import { ImageUpload } from '@/components/ImageUpload';
import { formatDate } from '@/lib/utils';
import type { BookingRequest, TransportRequest, MarketplaceOrder, Attraction, EventItem, Business, PlatformMetrics, StorageStatusResponse } from '@/types';

export function AdminDashboardPage() {
  const { navigate } = useRouter();
  const [activeTab, setActiveTab] = useState<'verification' | 'bookings' | 'transport' | 'orders' | 'storage'>('verification');
  const [metrics, setMetrics] = useState<PlatformMetrics>(() => store.getMetrics());

  // Data lists
  const [attractions, setAttractions] = useState<Attraction[]>(() => store.getAttractions());
  const [events, setEvents] = useState<EventItem[]>(() => store.getEvents());
  const [businesses, setBusinesses] = useState<Business[]>(() => store.getBusinesses());
  const [bookings, setBookings] = useState<BookingRequest[]>(() => store.getBookings());
  const [transportReqs, setTransportReqs] = useState<TransportRequest[]>(() => store.getTransportRequests());
  const [orders, setOrders] = useState<MarketplaceOrder[]>(() => store.getOrders());

  // Storage status & uploader
  const [storageStatus, setStorageStatus] = useState<StorageStatusResponse | null>(null);
  const [uploadedAssetUrl, setUploadedAssetUrl] = useState('');
  const [copiedUrl, setCopiedUrl] = useState(false);

  // Verification filter
  const [filterType, setFilterType] = useState<'all' | 'attraction' | 'event' | 'business'>('all');

  const refreshAll = useCallback(async () => {
    try {
      const [m, a, e, b, s] = await Promise.all([
        api.getMetrics(),
        api.getAttractions(),
        api.getEvents(),
        api.getBusinesses(),
        api.getStorageStatus(),
      ]);
      setMetrics(m);
      setAttractions(a);
      setEvents(e);
      setBusinesses(b);
      setStorageStatus(s);
    } catch {
      setMetrics(store.getMetrics());
      setAttractions(store.getAttractions());
      setEvents(store.getEvents());
      setBusinesses(store.getBusinesses());
    }
    setBookings(store.getBookings());
    setTransportReqs(store.getTransportRequests());
    setOrders(store.getOrders());
  }, []);

  useEffect(() => {
    refreshAll();
  }, [refreshAll]);

  const handleUpdateStatus = (
    type: 'attraction' | 'event' | 'business',
    id: string,
    status: 'verified' | 'pending' | 'unverified' | 'rejected'
  ) => {
    store.updateVerification(type, id, status);
    refreshAll();
  };

  const handleUpdateBookingStatus = (id: string, status: BookingRequest['status']) => {
    store.updateBookingStatus(id, status);
    refreshAll();
  };

  const handleUpdateTransportStatus = (id: string, status: TransportRequest['status']) => {
    store.updateTransportStatus(id, status);
    refreshAll();
  };

  return (
    <div className="pt-20 min-h-screen bg-gray-50 animate-fade-in pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <button
              onClick={() => navigate('#/')}
              className="flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-primary-600 mb-2 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Platform
            </button>
            <div className="flex items-center gap-3">
              <h1 className="font-display text-3xl font-extrabold text-gray-900">
                BENIN360 Admin & Operations
              </h1>
              <span className="px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-xs font-bold uppercase">
                Supervisor Console
              </span>
            </div>
            <p className="mt-1 text-sm text-gray-500">
              Manage content integrity, verification status, bookings, transport requests, and platform analytics.
            </p>
          </div>

          <button
            onClick={refreshAll}
            className="px-4 py-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-xl text-xs font-semibold transition-colors flex items-center gap-2 shadow-sm w-fit"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Refresh Data
          </button>
        </div>

        {/* Analytics KPIs */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <div className="p-4 bg-white rounded-2xl border border-gray-100 shadow-sm">
            <div className="text-xs text-gray-500 font-medium">Platform Visitors</div>
            <div className="text-xl font-extrabold text-gray-900 mt-1">{metrics.totalVisitors.toLocaleString()}</div>
            <div className="text-[10px] text-emerald-600 font-semibold mt-1">+14% this week</div>
          </div>

          <div className="p-4 bg-white rounded-2xl border border-gray-100 shadow-sm">
            <div className="text-xs text-gray-500 font-medium">Event Page Views</div>
            <div className="text-xl font-extrabold text-gray-900 mt-1">{metrics.totalEventViews.toLocaleString()}</div>
            <div className="text-[10px] text-primary-600 font-semibold mt-1">10th Coronation Hub</div>
          </div>

          <div className="p-4 bg-white rounded-2xl border border-gray-100 shadow-sm">
            <div className="text-xs text-gray-500 font-medium">Attraction Views</div>
            <div className="text-xl font-extrabold text-gray-900 mt-1">{metrics.totalAttractionViews.toLocaleString()}</div>
            <div className="text-[10px] text-gray-400 font-medium mt-1">Heritage sites</div>
          </div>

          <div className="p-4 bg-white rounded-2xl border border-gray-100 shadow-sm">
            <div className="text-xs text-gray-500 font-medium">Passport Claims</div>
            <div className="text-xl font-extrabold text-secondary-600 mt-1">{metrics.totalPassportClaims.toLocaleString()}</div>
            <div className="text-[10px] text-secondary-600 font-semibold mt-1">Digital badges</div>
          </div>

          <div className="p-4 bg-white rounded-2xl border border-gray-100 shadow-sm">
            <div className="text-xs text-gray-500 font-medium">Bookings / Shuttles</div>
            <div className="text-xl font-extrabold text-amber-600 mt-1">{metrics.totalBookings}</div>
            <div className="text-[10px] text-gray-400 font-medium mt-1">Tour & Driver reqs</div>
          </div>

          <div className="p-4 bg-white rounded-2xl border border-gray-100 shadow-sm">
            <div className="text-xs text-gray-500 font-medium">Pending Review</div>
            <div className="text-xl font-extrabold text-warning-600 mt-1">{metrics.pendingVerificationCount}</div>
            <div className="text-[10px] text-warning-600 font-semibold mt-1">Needs verification</div>
          </div>
        </div>

        {/* Tab Buttons */}
        <div className="flex border-b border-gray-200 gap-2 mb-6 overflow-x-auto">
          {[
            { key: 'verification', label: `Content Verification (${metrics.pendingVerificationCount} pending)` },
            { key: 'bookings', label: `Tour Bookings (${bookings.length})` },
            { key: 'transport', label: `Transport Requests (${transportReqs.length})` },
            { key: 'orders', label: `Artisan Orders (${orders.length})` },
            { key: 'storage', label: 'Cloudflare R2 Storage' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`pb-3 px-4 text-sm font-semibold border-b-2 transition-all whitespace-nowrap ${
                activeTab === tab.key
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab 1: Content Verification & Moderation */}
        {activeTab === 'verification' && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-gray-100">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-gray-400" />
                <span className="text-xs font-semibold text-gray-700">Filter Category:</span>
                {(['all', 'attraction', 'event', 'business'] as const).map((ft) => (
                  <button
                    key={ft}
                    onClick={() => setFilterType(ft)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold capitalize ${
                      filterType === ft
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {ft}
                  </button>
                ))}
              </div>

              <div className="text-xs text-gray-500">
                Rule: Content without confirmed source accreditation must not show verified status.
              </div>
            </div>

            {/* Verification Table */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead className="bg-gray-50 border-b border-gray-100 text-gray-500 font-semibold uppercase tracking-wider text-[11px]">
                    <tr>
                      <th className="p-4">Type</th>
                      <th className="p-4">Title / Name</th>
                      <th className="p-4">Source & Reference</th>
                      <th className="p-4">Current Status</th>
                      <th className="p-4 text-right">Moderation Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {/* Attractions */}
                    {(filterType === 'all' || filterType === 'attraction') &&
                      attractions.map((a) => (
                        <tr key={a.id} className="hover:bg-gray-50/50">
                          <td className="p-4">
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-primary-100 text-primary-800">
                              Attraction
                            </span>
                          </td>
                          <td className="p-4 font-bold text-gray-900">{a.name}</td>
                          <td className="p-4 text-gray-600 max-w-xs truncate">
                            {a.source_name || 'NCMM / Archives'}
                          </td>
                          <td className="p-4">
                            <VerificationBadge status={a.verification_status} />
                          </td>
                          <td className="p-4 text-right">
                            <div className="inline-flex items-center gap-1">
                              <button
                                onClick={() => handleUpdateStatus('attraction', a.id, 'verified')}
                                className="px-2 py-1 bg-success-50 text-success-700 hover:bg-success-100 rounded text-xs font-semibold"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => handleUpdateStatus('attraction', a.id, 'pending')}
                                className="px-2 py-1 bg-warning-50 text-warning-700 hover:bg-warning-100 rounded text-xs font-semibold"
                              >
                                Pending
                              </button>
                              <button
                                onClick={() => handleUpdateStatus('attraction', a.id, 'rejected')}
                                className="px-2 py-1 bg-error-50 text-error-700 hover:bg-error-100 rounded text-xs font-semibold"
                              >
                                Reject
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}

                    {/* Events */}
                    {(filterType === 'all' || filterType === 'event') &&
                      events.map((e) => (
                        <tr key={e.id} className="hover:bg-gray-50/50">
                          <td className="p-4">
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-error-100 text-error-800">
                              Event
                            </span>
                          </td>
                          <td className="p-4 font-bold text-gray-900">{e.title}</td>
                          <td className="p-4 text-gray-600 max-w-xs truncate">
                            {e.source_name || 'Coronation Liaison'}
                          </td>
                          <td className="p-4">
                            <VerificationBadge status={e.verification_status} />
                          </td>
                          <td className="p-4 text-right">
                            <div className="inline-flex items-center gap-1">
                              <button
                                onClick={() => handleUpdateStatus('event', e.id, 'verified')}
                                className="px-2 py-1 bg-success-50 text-success-700 hover:bg-success-100 rounded text-xs font-semibold"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => handleUpdateStatus('event', e.id, 'pending')}
                                className="px-2 py-1 bg-warning-50 text-warning-700 hover:bg-warning-100 rounded text-xs font-semibold"
                              >
                                Pending
                              </button>
                              <button
                                onClick={() => handleUpdateStatus('event', e.id, 'rejected')}
                                className="px-2 py-1 bg-error-50 text-error-700 hover:bg-error-100 rounded text-xs font-semibold"
                              >
                                Reject
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}

                    {/* Businesses */}
                    {(filterType === 'all' || filterType === 'business') &&
                      businesses.map((b) => (
                        <tr key={b.id} className="hover:bg-gray-50/50">
                          <td className="p-4">
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-secondary-100 text-secondary-800 capitalize">
                              {b.business_type}
                            </span>
                          </td>
                          <td className="p-4 font-bold text-gray-900">{b.name}</td>
                          <td className="p-4 text-gray-600 max-w-xs truncate">
                            {b.address || 'Benin City'}
                          </td>
                          <td className="p-4">
                            <VerificationBadge status={b.verification_status} />
                          </td>
                          <td className="p-4 text-right">
                            <div className="inline-flex items-center gap-1">
                              <button
                                onClick={() => handleUpdateStatus('business', b.id, 'verified')}
                                className="px-2 py-1 bg-success-50 text-success-700 hover:bg-success-100 rounded text-xs font-semibold"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => handleUpdateStatus('business', b.id, 'pending')}
                                className="px-2 py-1 bg-warning-50 text-warning-700 hover:bg-warning-100 rounded text-xs font-semibold"
                              >
                                Pending
                              </button>
                              <button
                                onClick={() => handleUpdateStatus('business', b.id, 'rejected')}
                                className="px-2 py-1 bg-error-50 text-error-700 hover:bg-error-100 rounded text-xs font-semibold"
                              >
                                Reject
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Tour Bookings */}
        {activeTab === 'bookings' && (
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
            <h3 className="font-display text-lg font-bold text-gray-900 mb-4">Tour & Experience Bookings</h3>
            {bookings.length === 0 ? (
              <p className="text-sm text-gray-500 py-8 text-center">No tour bookings received yet.</p>
            ) : (
              <div className="space-y-4">
                {bookings.map((bk) => (
                  <div key={bk.id} className="p-4 rounded-2xl bg-gray-50 border border-gray-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-primary-600">{bk.id}</span>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-bold capitalize ${
                          bk.status === 'confirmed' ? 'bg-success-100 text-success-700' :
                          bk.status === 'completed' ? 'bg-secondary-100 text-secondary-700' : 'bg-warning-100 text-warning-700'
                        }`}>
                          {bk.status}
                        </span>
                      </div>
                      <h4 className="font-bold text-gray-900 text-base mt-1">{bk.visitor_name}</h4>
                      <p className="text-xs text-gray-600 mt-0.5">
                        {bk.visitor_email} • {bk.visitor_phone} • Party of {bk.party_size}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">Date: {bk.preferred_date}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleUpdateBookingStatus(bk.id, 'confirmed')}
                        className="px-3 py-1.5 bg-success-600 hover:bg-success-700 text-white rounded-lg text-xs font-semibold"
                      >
                        Confirm
                      </button>
                      <button
                        onClick={() => handleUpdateBookingStatus(bk.id, 'completed')}
                        className="px-3 py-1.5 bg-secondary-600 hover:bg-secondary-700 text-white rounded-lg text-xs font-semibold"
                      >
                        Completed
                      </button>
                      <button
                        onClick={() => handleUpdateBookingStatus(bk.id, 'cancelled')}
                        className="px-3 py-1.5 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg text-xs font-semibold"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Transport Requests */}
        {activeTab === 'transport' && (
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
            <h3 className="font-display text-lg font-bold text-gray-900 mb-4">Transport & Airport Shuttle Requests</h3>
            {transportReqs.length === 0 ? (
              <p className="text-sm text-gray-500 py-8 text-center">No transport requests submitted yet.</p>
            ) : (
              <div className="space-y-4">
                {transportReqs.map((tr) => (
                  <div key={tr.id} className="p-4 rounded-2xl bg-gray-50 border border-gray-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-primary-600">{tr.id}</span>
                        <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-primary-50 text-primary-700 capitalize">
                          {tr.service_type.replace('_', ' ')}
                        </span>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-bold capitalize ${
                          tr.status === 'accepted' ? 'bg-success-100 text-success-700' :
                          tr.status === 'completed' ? 'bg-secondary-100 text-secondary-700' : 'bg-warning-100 text-warning-700'
                        }`}>
                          {tr.status}
                        </span>
                      </div>
                      <h4 className="font-bold text-gray-900 text-base mt-1">{tr.contact_name} ({tr.contact_phone})</h4>
                      <p className="text-xs text-gray-600 mt-0.5">
                        {tr.pickup_location} &rarr; {tr.destination} on {tr.pickup_date} at {tr.pickup_time}
                      </p>
                      {tr.special_notes && <p className="text-xs text-gray-500 italic mt-1">"{tr.special_notes}"</p>}
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleUpdateTransportStatus(tr.id, 'accepted')}
                        className="px-3 py-1.5 bg-success-600 hover:bg-success-700 text-white rounded-lg text-xs font-semibold"
                      >
                        Accept & Dispatch
                      </button>
                      <button
                        onClick={() => handleUpdateTransportStatus(tr.id, 'completed')}
                        className="px-3 py-1.5 bg-secondary-600 hover:bg-secondary-700 text-white rounded-lg text-xs font-semibold"
                      >
                        Completed
                      </button>
                      <button
                        onClick={() => handleUpdateTransportStatus(tr.id, 'cancelled')}
                        className="px-3 py-1.5 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg text-xs font-semibold"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 4: Orders */}
        {activeTab === 'orders' && (
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
            <h3 className="font-display text-lg font-bold text-gray-900 mb-4">Artisan Marketplace Enquiries</h3>
            {orders.length === 0 ? (
              <p className="text-sm text-gray-500 py-8 text-center">No marketplace enquiries placed yet.</p>
            ) : (
              <div className="space-y-4">
                {orders.map((ord) => (
                  <div key={ord.id} className="p-4 rounded-2xl bg-gray-50 border border-gray-200">
                    <div className="flex justify-between items-center">
                      <span className="font-mono text-xs font-bold text-primary-600">{ord.id}</span>
                      <span className="text-xs font-bold text-gray-500">{ord.created_at ? formatDate(ord.created_at) : 'Today'}</span>
                    </div>
                    <div className="mt-2 text-sm">
                      <span className="font-bold text-gray-900">{ord.buyer_name}</span> ({ord.buyer_phone} / {ord.buyer_email})
                    </div>
                    <div className="text-xs text-gray-600 mt-1">
                      Product ID: {ord.product_id} • Quantity: {ord.quantity}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      Delivery Address: {ord.delivery_address}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 5: Cloudflare R2 Media & Asset Storage */}
        {activeTab === 'storage' && (
          <div className="space-y-6">
            {/* Storage Status Banner */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                    storageStatus?.configured ? 'bg-amber-50 text-amber-600' : 'bg-gray-100 text-gray-500'
                  }`}>
                    <Cloud className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-display text-xl font-bold text-gray-900">Cloudflare R2 Object Storage</h3>
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                        storageStatus?.configured
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {storageStatus?.configured ? '● R2 Active & Connected' : '● Local Fallback Active'}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Zero-egress fee object storage for high-resolution bronze crafts, hotel suites, and heritage banners.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => api.getStorageStatus().then(setStorageStatus)}
                  className="px-3.5 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold flex items-center gap-1.5 transition-colors self-start sm:self-auto"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Test R2 Connection
                </button>
              </div>

              {/* R2 Diagnostics Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                  <div className="text-[11px] font-semibold text-gray-500 uppercase">Storage Engine</div>
                  <div className="text-sm font-bold text-gray-900 mt-1">{storageStatus?.provider || 'Cloudflare R2'}</div>
                  <div className="text-[10px] text-gray-400 mt-0.5">S3-Compatible API v4</div>
                </div>

                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                  <div className="text-[11px] font-semibold text-gray-500 uppercase">Bucket Name</div>
                  <div className="text-sm font-bold font-mono text-gray-900 mt-1 truncate">
                    {storageStatus?.bucket_name || '(not set)'}
                  </div>
                  <div className="text-[10px] text-gray-400 mt-0.5">Target R2 Bucket</div>
                </div>

                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                  <div className="text-[11px] font-semibold text-gray-500 uppercase">Public CDN Domain</div>
                  <div className="text-sm font-bold font-mono text-gray-900 mt-1 truncate">
                    {storageStatus?.public_url || '(default endpoint)'}
                  </div>
                  <div className="text-[10px] text-gray-400 mt-0.5">Global edge distribution</div>
                </div>

                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                  <div className="text-[11px] font-semibold text-gray-500 uppercase">Current Backend Mode</div>
                  <div className={`text-sm font-bold mt-1 capitalize ${
                    storageStatus?.configured ? 'text-emerald-700' : 'text-amber-700'
                  }`}>
                    {storageStatus?.storage_type.replace('_', ' ') || 'local fallback'}
                  </div>
                  <div className="text-[10px] text-gray-400 mt-0.5">
                    {storageStatus?.configured ? 'Direct upload enabled' : 'Safe offline / dev mode'}
                  </div>
                </div>
              </div>
            </div>

            {/* Upload Test & CDN Link Generator */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-8">
                <h4 className="font-display text-base font-bold text-gray-900 mb-1">
                  Upload Platform Media to Cloudflare R2
                </h4>
                <p className="text-xs text-gray-500 mb-4">
                  Drag & drop any attraction photo, festival banner, or royal bronze casting image to store it on Cloudflare R2.
                </p>

                <ImageUpload
                  label="Select Asset to Upload"
                  value={uploadedAssetUrl}
                  onChange={(url) => setUploadedAssetUrl(url)}
                  folder="uploads"
                  aspectHint="JPG, PNG, WebP up to 15MB (uploaded to Cloudflare R2)"
                />

                {uploadedAssetUrl && (
                  <div className="mt-4 p-3 bg-gray-50 rounded-xl border border-gray-200">
                    <div className="text-[11px] font-bold text-gray-700 mb-1">Public CDN Asset URL:</div>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        readOnly
                        value={uploadedAssetUrl}
                        className="flex-1 bg-white border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs font-mono text-gray-800"
                      />
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(uploadedAssetUrl);
                          setCopiedUrl(true);
                          setTimeout(() => setCopiedUrl(false), 2000);
                        }}
                        className="px-3 py-1.5 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1"
                      >
                        {copiedUrl ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedUrl ? 'Copied!' : 'Copy'}</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* R2 Credentials Quick Setup Guide */}
              <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-8">
                <h4 className="font-display text-base font-bold text-gray-900 mb-1">
                  How to Configure Cloudflare R2
                </h4>
                <p className="text-xs text-gray-500 mb-4">
                  Follow these 3 steps to connect your Cloudflare R2 bucket:
                </p>

                <ol className="space-y-3 text-xs text-gray-700 list-decimal list-inside">
                  <li className="leading-relaxed">
                    <span className="font-semibold">Create Bucket in Cloudflare:</span> Log in to Cloudflare Dashboard → R2 Object Storage → Click <em>Create Bucket</em> (e.g. <code className="bg-gray-100 px-1 py-0.5 rounded font-mono text-[11px]">benin360-assets</code>).
                  </li>
                  <li className="leading-relaxed">
                    <span className="font-semibold">Generate S3 API Token:</span> Click <em>Manage R2 API Tokens</em> → <em>Create API Token</em> with <em>Admin Read & Write</em> permissions.
                  </li>
                  <li className="leading-relaxed">
                    <span className="font-semibold">Add to backend/.env:</span> Fill the generated credentials:
                  </li>
                </ol>

                <div className="mt-4 p-3.5 bg-gray-900 rounded-xl text-gray-200 font-mono text-[11px] overflow-x-auto">
                  <div className="text-gray-400"># backend/.env</div>
                  <div className="text-amber-400">CLOUDFLARE_R2_ACCOUNT_ID=<span className="text-gray-300">your_account_id</span></div>
                  <div className="text-amber-400">CLOUDFLARE_R2_ACCESS_KEY_ID=<span className="text-gray-300">your_access_key</span></div>
                  <div className="text-amber-400">CLOUDFLARE_R2_SECRET_ACCESS_KEY=<span className="text-gray-300">your_secret_key</span></div>
                  <div className="text-amber-400">CLOUDFLARE_R2_BUCKET_NAME=<span className="text-gray-300">benin360-assets</span></div>
                  <div className="text-amber-400">CLOUDFLARE_R2_PUBLIC_URL=<span className="text-gray-300">https://pub-xxxxxx.r2.dev</span></div>
                </div>

                <div className="mt-4 flex items-center gap-2 text-xs text-emerald-700 bg-emerald-50 p-2.5 rounded-xl border border-emerald-100">
                  <CheckCircle className="w-4 h-4 shrink-0 text-emerald-600" />
                  <span>The backend hot-reloads automatically once credentials are saved!</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

