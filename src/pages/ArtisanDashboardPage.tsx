import { useState, useEffect } from 'react';
import {
  Hammer, Package, ShoppingBag, Plus, CheckCircle2, Clock, MapPin,
  ShieldCheck, ArrowLeft, RefreshCw, AlertCircle, ExternalLink, Sparkles, Send
} from 'lucide-react';
import { useRouter } from '@/lib/router';
import { api } from '@/lib/api';
import { store } from '@/lib/dataStore';
import { formatNGN } from '@/lib/utils';
import { VerificationBadge, DemoBanner } from '@/components/ui';
import { ImageUpload } from '@/components/ImageUpload';
import type { Product, MarketplaceOrder, User } from '@/types';

export function ArtisanDashboardPage({ user }: { user?: User | null }) {
  const { navigate } = useRouter();
  const [activeTab, setActiveTab] = useState<'works' | 'orders' | 'guild'>('works');
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<MarketplaceOrder[]>([]);
  const [loading, setLoading] = useState(true);

  // New craft submission modal
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [craftForm, setCraftForm] = useState({
    title: '',
    category: 'Bronze & Brasswork',
    price_ngn: '',
    description: '',
    image_url: '',
    vendor_name: user?.first_name ? `${user.first_name} ${user.last_name || ''} (Igun Guild)` : 'Igun Street Master Guild',
  });
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const [prods, ords] = await Promise.all([
        api.getProducts(),
        Promise.resolve(store.getOrders()),
      ]);
      setProducts(prods);
      setOrders(ords);
    } catch {
      setProducts(store.getProducts());
      setOrders(store.getOrders());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateCraft = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const newCraft: Product = {
        id: `prod-${Date.now()}`,
        slug: craftForm.title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '') + `-${Date.now().toString().slice(-4)}`,
        title: craftForm.title,
        category: craftForm.category,
        price_ngn: parseFloat(craftForm.price_ngn) || 45000,
        description: craftForm.description,
        vendor_name: craftForm.vendor_name,
        image_url: craftForm.image_url || 'https://images.unsplash.com/photo-1577717903315-1691ae25ab3f',
        is_available: true,
        is_featured: true,
        created_at: new Date().toISOString(),
      };

      // Add to local store and reload
      store.addProduct(newCraft);
      setSuccessMsg(`Craft "${newCraft.title}" has been added to the BENIN360 Artisan Marketplace!`);
      setAddModalOpen(false);
      setCraftForm({
        title: '',
        category: 'Bronze & Brasswork',
        price_ngn: '',
        description: '',
        image_url: '',
        vendor_name: user?.first_name ? `${user.first_name} ${user.last_name || ''}` : 'Igun Street Master Guild',
      });
      loadData();
      setTimeout(() => setSuccessMsg(null), 4000);
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateOrderStatus = (id: string, status: MarketplaceOrder['status']) => {
    store.updateOrderStatus(id, status);
    setOrders(store.getOrders());
  };

  return (
    <div className="pt-20 min-h-screen bg-stone-50 animate-fade-in pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Navigation & Header */}
        <button
          onClick={() => navigate('#/')}
          className="flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-amber-700 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Platform
        </button>

        {/* Guild Hero Header */}
        <div className="bg-gradient-to-r from-stone-900 via-amber-950 to-stone-900 rounded-3xl p-6 sm:p-10 text-white relative overflow-hidden shadow-xl border border-amber-800/40 mb-8">
          <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-15 benin-pattern pointer-events-none" />
          <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-2xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-amber-400 shrink-0 shadow-lg">
                <Hammer className="w-8 h-8" />
              </div>
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-400/30 mb-2">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Royal Guild Verified Artisan Portal
                </div>
                <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-white">
                  {user?.first_name ? `${user.first_name} ${user.last_name || ''}` : 'Chief Nosakhare Igun'}
                </h1>
                <p className="text-sm text-amber-200/80 mt-1 flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5" />
                  {user?.artisan_profile?.workshop_address || '12 Igun Street (Guild of Bronze Casters), Benin City'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto">
              <button
                onClick={() => setAddModalOpen(true)}
                className="flex-1 md:flex-none px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-stone-950 font-bold rounded-xl text-xs sm:text-sm shadow-lg flex items-center justify-center gap-2 transition-all"
              >
                <Plus className="w-4 h-4" />
                List New Bronze / Bead Work
              </button>
              <button
                onClick={loadData}
                className="p-2.5 bg-white/10 hover:bg-white/20 rounded-xl text-white transition-colors border border-white/10"
                title="Refresh Studio Data"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Demo Notice */}
        <DemoBanner message="Artisan Studio Portal connects registered guild masters directly to the global diaspora marketplace with escrow payments and authenticity tracking." />

        {successMsg && (
          <div className="mt-4 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-sm flex items-center gap-2 animate-fade-in">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Studio KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8 mb-8">
          <div className="p-5 bg-white rounded-2xl border border-stone-200/80 shadow-sm">
            <div className="text-xs font-semibold text-stone-500 uppercase">Listed Works</div>
            <div className="text-2xl font-black text-stone-900 mt-1">{products.length}</div>
            <div className="text-[11px] text-amber-700 font-medium mt-1">Authentic lost-wax pieces</div>
          </div>

          <div className="p-5 bg-white rounded-2xl border border-stone-200/80 shadow-sm">
            <div className="text-xs font-semibold text-stone-500 uppercase">Incoming Orders</div>
            <div className="text-2xl font-black text-amber-700 mt-1">{orders.length}</div>
            <div className="text-[11px] text-emerald-600 font-semibold mt-1">Diaspora & Local collectors</div>
          </div>

          <div className="p-5 bg-white rounded-2xl border border-stone-200/80 shadow-sm">
            <div className="text-xs font-semibold text-stone-500 uppercase">Guild Status</div>
            <div className="text-xl font-extrabold text-stone-900 mt-1 flex items-center gap-1.5">
              <span>Guild Master</span>
              <ShieldCheck className="w-4 h-4 text-secondary-600" />
            </div>
            <div className="text-[11px] text-stone-500 font-medium mt-1">Igun Eronmwon Charter</div>
          </div>

          <div className="p-5 bg-white rounded-2xl border border-stone-200/80 shadow-sm">
            <div className="text-xs font-semibold text-stone-500 uppercase">Escrow Settlement</div>
            <div className="text-xl font-extrabold text-emerald-600 mt-1">Active / Verified</div>
            <div className="text-[11px] text-stone-400 font-medium mt-1">Ready for Paystack/Flutterwave</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-stone-200 gap-4 mb-6">
          <button
            onClick={() => setActiveTab('works')}
            className={`pb-3 text-sm font-bold transition-all border-b-2 flex items-center gap-2 ${
              activeTab === 'works'
                ? 'border-amber-600 text-amber-900'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <Package className="w-4 h-4" />
            My Listed Works ({products.length})
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`pb-3 text-sm font-bold transition-all border-b-2 flex items-center gap-2 ${
              activeTab === 'orders'
                ? 'border-amber-600 text-amber-900'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            Orders & Shipments ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab('guild')}
            className={`pb-3 text-sm font-bold transition-all border-b-2 flex items-center gap-2 ${
              activeTab === 'guild'
                ? 'border-amber-600 text-amber-900'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            Guild Lineage & Charter
          </button>
        </div>

        {/* Tab 1: Works Catalog */}
        {activeTab === 'works' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((prod) => (
              <div
                key={prod.id}
                className="bg-white rounded-3xl overflow-hidden border border-stone-200/80 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-48 bg-stone-100 overflow-hidden">
                    <img
                      src={prod.image_url || 'https://images.unsplash.com/photo-1577717903315-1691ae25ab3f'}
                      alt={prod.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur px-2.5 py-1 rounded-full text-[10px] font-bold text-stone-900">
                      {prod.category}
                    </div>
                    {prod.is_featured && (
                      <div className="absolute top-3 right-3 bg-amber-600 text-white px-2 py-0.5 rounded-full text-[10px] font-bold">
                        Featured
                      </div>
                    )}
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold text-stone-900 text-base leading-snug">{prod.title}</h3>
                    <p className="text-xs text-stone-500 mt-1 line-clamp-2">{prod.description}</p>
                    <div className="mt-4 flex items-center justify-between">
                      <span className="font-extrabold text-amber-700 text-lg">
                        {prod.price_ngn ? formatNGN(prod.price_ngn) : 'Price on Inquiry'}
                      </span>
                      <span className="text-[11px] px-2 py-0.5 rounded-md font-semibold bg-emerald-50 text-emerald-700">
                        Available
                      </span>
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-stone-50 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
                  <span>Vendor: {prod.vendor_name || 'Igun Street Guild'}</span>
                  <button
                    onClick={() => navigate('#/marketplace')}
                    className="text-amber-700 font-bold hover:underline flex items-center gap-1"
                  >
                    View in Market <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 2: Orders */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            {orders.length === 0 ? (
              <div className="p-12 text-center bg-white rounded-3xl border border-stone-200">
                <ShoppingBag className="w-12 h-12 text-stone-300 mx-auto mb-3" />
                <h4 className="font-bold text-stone-900 text-lg">No orders yet</h4>
                <p className="text-xs text-stone-500 mt-1">Orders placed through the marketplace will appear here.</p>
              </div>
            ) : (
              orders.map((ord) => (
                <div
                  key={ord.id}
                  className="p-5 bg-white rounded-2xl border border-stone-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-stone-500">{ord.id}</span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        ord.status === 'fulfilled' ? 'bg-emerald-100 text-emerald-800' :
                        ord.status === 'contacted' ? 'bg-blue-100 text-blue-800' :
                        'bg-amber-100 text-amber-800'
                      }`}>
                        {ord.status}
                      </span>
                    </div>
                    <h4 className="font-bold text-stone-900 text-base mt-1">
                      {ord.product?.title || 'Artisan Marketplace Craft'} (Qty: {ord.quantity})
                    </h4>
                    <p className="text-xs text-stone-600 mt-1">
                      Customer: <span className="font-semibold">{ord.buyer_name}</span> | Phone: {ord.buyer_phone} | Email: {ord.buyer_email}
                    </p>
                    <p className="text-xs text-stone-500 mt-0.5">
                      Delivery Address: {ord.delivery_address}
                    </p>
                    {ord.notes && <p className="text-xs italic text-stone-400 mt-1">Notes: "{ord.notes}"</p>}
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleUpdateOrderStatus(ord.id, 'contacted')}
                      className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors"
                    >
                      Mark Contacted
                    </button>
                    <button
                      onClick={() => handleUpdateOrderStatus(ord.id, 'fulfilled')}
                      className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-700 transition-colors"
                    >
                      Mark Fulfilled
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Tab 3: Guild Lineage */}
        {activeTab === 'guild' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-sm space-y-6">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 mb-2">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                Living Heritage Standards
              </div>
              <h3 className="font-display text-xl font-bold text-stone-900">
                Igun Eronmwon Bronze Casters Guild Protocol
              </h3>
              <p className="text-xs text-stone-600 mt-2 leading-relaxed max-w-2xl">
                The royal guild of bronze casters on Igun Street was established by monarchical decree under Oba Oguola in the 13th century. By tradition, the lost-wax (cire perdue) technique is conserved among recognized family lineages. BENIN360 verifies each guild workshop to protect visitors from mass-produced counterfeit castings and support local master artisans directly.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-stone-100">
              <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200">
                <h4 className="font-bold text-amber-950 text-sm">Lost-Wax Authenticity</h4>
                <p className="text-xs text-amber-800 mt-1">
                  Every certified piece is individually hand-molded in beeswax, encased in clay, and cast in molten bronze.
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200">
                <h4 className="font-bold text-amber-950 text-sm">Palace & Council Respect</h4>
                <p className="text-xs text-amber-800 mt-1">
                  Artisans honor sacred motifs and maintain the dignity of Queen Mother Idia and royal leopard regalia.
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200">
                <h4 className="font-bold text-amber-950 text-sm">Direct Guild Benefit</h4>
                <p className="text-xs text-amber-800 mt-1">
                  Proceeds from the marketplace flow directly to the guild artisan workshops without predatory intermediaries.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Add Craft Modal */}
      {addModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-stone-100 relative max-h-[90vh] overflow-y-auto">
            <h3 className="font-display text-xl font-bold text-stone-900 mb-1">List New Guild Craft</h3>
            <p className="text-xs text-stone-500 mb-4">Add a certified bronze sculpture or royal beadwork to the visitor marketplace.</p>

            <form onSubmit={handleCreateCraft} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Craft Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Benin Royal Ceremonial Horn Player Bronze"
                  value={craftForm.title}
                  onChange={(e) => setCraftForm({ ...craftForm, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-amber-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Category</label>
                  <select
                    value={craftForm.category}
                    onChange={(e) => setCraftForm({ ...craftForm, category: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none"
                  >
                    <option value="Bronze & Brasswork">Bronze & Brasswork</option>
                    <option value="Jewelry & Beads">Jewelry & Beads</option>
                    <option value="Fashion & Regalia">Fashion & Regalia</option>
                    <option value="Wood Carving">Wood Carving</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Price (NGN)</label>
                  <input
                    type="number"
                    required
                    placeholder="85000"
                    value={craftForm.price_ngn}
                    onChange={(e) => setCraftForm({ ...craftForm, price_ngn: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Description & Casting Notes</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Describe the lost-wax casting technique, significance, and artisan lineage..."
                  value={craftForm.description}
                  onChange={(e) => setCraftForm({ ...craftForm, description: e.target.value })}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none resize-none"
                />
              </div>

              <ImageUpload
                label="Craft Photo (Cloudflare R2 Storage)"
                value={craftForm.image_url}
                onChange={(url) => setCraftForm({ ...craftForm, image_url: url })}
                folder="products"
                aspectHint="High-res photos of lost-wax casting or beadwork (Cloudflare R2)"
              />

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setAddModalOpen(false)}
                  className="flex-1 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-bold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-2"
                >
                  <Send className="w-3.5 h-3.5" />
                  {submitting ? 'Publishing...' : 'Publish to Market'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
