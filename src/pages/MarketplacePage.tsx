import { useState, useEffect, useMemo } from 'react';
import {
  ShoppingBag, Search, Tag, CheckCircle2, ArrowLeft, Send,
  ShieldCheck, Sparkles, X, Heart
} from 'lucide-react';
import { useRouter } from '@/lib/router';
import { store } from '@/lib/dataStore';
import { api } from '@/lib/api';
import { formatNGN } from '@/lib/utils';
import { DemoBanner } from '@/components/ui';
import type { Product, MarketplaceOrder } from '@/types';

export function MarketplacePage() {
  const { navigate } = useRouter();
  const [products, setProducts] = useState<Product[]>(() => store.getProducts());

  useEffect(() => {
    api.getProducts().then(setProducts).catch(() => {});
  }, []);

  const [categoryFilter, setCategoryFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Order modal state
  const [orderModalOpen, setOrderModalOpen] = useState(false);
  const [orderForm, setOrderForm] = useState({
    quantity: 1,
    buyer_name: '',
    buyer_phone: '',
    buyer_email: '',
    delivery_address: '',
    notes: '',
  });
  const [submittedOrder, setSubmittedOrder] = useState<MarketplaceOrder | null>(null);
  const [ordering, setOrdering] = useState(false);

  const categories = ['All', 'Bronze & Brasswork', 'Jewelry & Beads', 'Fashion & Regalia', 'Books & Literature'];

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      if (categoryFilter !== 'All' && p.category !== categoryFilter) return false;
      if (search && !p.title.toLowerCase().includes(search.toLowerCase()) && !p.description?.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [products, categoryFilter, search]);

  const handleOpenOrder = (prod: Product) => {
    setSelectedProduct(prod);
    setSubmittedOrder(null);
    setOrderModalOpen(true);
  };

  const handleOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;

    setOrdering(true);
    try {
      const ord = await api.createMarketplaceOrder({
        product_id: selectedProduct.id,
        quantity: orderForm.quantity,
        buyer_name: orderForm.buyer_name,
        buyer_phone: orderForm.buyer_phone,
        buyer_email: orderForm.buyer_email,
        delivery_address: orderForm.delivery_address,
        notes: orderForm.notes,
      });
      setSubmittedOrder(ord);
    } catch {
      const ord = store.submitOrder({
        product_id: selectedProduct.id,
        quantity: orderForm.quantity,
        buyer_name: orderForm.buyer_name,
        buyer_phone: orderForm.buyer_phone,
        buyer_email: orderForm.buyer_email,
        delivery_address: orderForm.delivery_address,
        notes: orderForm.notes,
      });
      setSubmittedOrder(ord);
    } finally {
      setOrdering(false);
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

        {/* Hero Banner */}
        <div className="bg-gradient-to-r from-stone-900 via-primary-950 to-stone-900 rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden shadow-xl mb-10">
          <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-20 benin-pattern" />
          <div className="relative max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-primary-500/30 text-primary-200 backdrop-blur mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              Authentic Benin Crafts & Souvenirs
            </div>
            <h1 className="font-display text-3xl sm:text-5xl font-extrabold leading-tight">
              Edo Artisan Marketplace
            </h1>
            <p className="mt-3 text-base text-gray-300">
              Support certified guild artisans, bronze casters, and bead makers. Order genuine Benin bronzes, royal coral beads, and cultural literature directly.
            </p>
          </div>
        </div>

        <DemoBanner message="Product listings represent authentic Edo craft categories with verified guild vendors. Orders initiate direct artisan fulfillment with escrow payment integration ready." />

        {/* Search & Category Filter */}
        <div className="mt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2 w-full md:w-auto">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setCategoryFilter(c)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                  categoryFilter === c
                    ? 'bg-primary-600 text-white shadow-md'
                    : 'bg-white text-gray-600 border border-gray-200 hover:border-primary-300'
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search crafts & beads..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary-500"
            />
          </div>
        </div>

        {/* Product Grid */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((prod) => (
            <div
              key={prod.id}
              className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                <div className="relative h-60 overflow-hidden bg-gray-100">
                  <img
                    src={prod.image_url || 'https://images.unsplash.com/photo-1577717903315-1691ae25ab3f'}
                    alt={prod.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/90 backdrop-blur text-gray-800 shadow-sm">
                      {prod.category}
                    </span>
                  </div>
                  {prod.is_featured && (
                    <div className="absolute top-3 right-3">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-primary-600 text-white shadow-sm">
                        Featured Guild Work
                      </span>
                    </div>
                  )}
                </div>

                <div className="p-6">
                  <div className="text-xs font-semibold text-primary-600 uppercase tracking-wide">
                    {prod.vendor_name || 'Benin Artisan Guild'}
                  </div>
                  <h3 className="font-bold text-gray-900 text-lg mt-1 group-hover:text-primary-600 transition-colors">
                    {prod.title}
                  </h3>
                  <p className="text-xs text-gray-600 mt-2 line-clamp-3 leading-relaxed">
                    {prod.description}
                  </p>
                </div>
              </div>

              <div className="p-6 pt-0 border-t border-gray-50 flex items-center justify-between">
                <div>
                  <div className="text-[10px] text-gray-400 uppercase font-semibold">Price</div>
                  <div className="text-lg font-extrabold text-primary-600">
                    {formatNGN(prod.price_ngn)}
                  </div>
                </div>

                <button
                  onClick={() => handleOpenOrder(prod)}
                  className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-xs font-semibold transition-colors shadow-sm flex items-center gap-1.5"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  Order / Enquire
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Vendor Self-Registration Box (PDF section 11 requirement) */}
        <div className="mt-16 bg-white rounded-3xl p-8 border border-gray-200 text-center max-w-2xl mx-auto shadow-sm">
          <h3 className="font-display text-xl font-bold text-gray-900">Are you a Benin Artisan, Brand or Fashion Maker?</h3>
          <p className="mt-2 text-sm text-gray-600">
            Submit your authentic crafts, coral beads, regalia, or books to the BENIN360 directory for verification and worldwide visitor reach.
          </p>
          <button
            onClick={() => alert('Artisan registration portal: Please contact vendor@benin360.example or reach out through the admin liaison desk.')}
            className="mt-5 px-6 py-2.5 bg-gray-900 hover:bg-black text-white rounded-xl text-sm font-semibold transition-colors inline-flex items-center gap-2"
          >
            Apply as Verified Vendor
          </button>
        </div>

        {/* Order Modal */}
        {orderModalOpen && selectedProduct && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative animate-scale-up max-h-[90vh] overflow-y-auto">
              <button
                onClick={() => setOrderModalOpen(false)}
                className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>

              {submittedOrder ? (
                <div className="text-center py-6">
                  <div className="w-14 h-14 bg-success-100 text-success-600 rounded-full flex items-center justify-center mx-auto mb-3">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="font-display text-2xl font-bold text-gray-900">Order Enquiry Received!</h3>
                  <p className="text-xs text-gray-600 mt-2">
                    Reference: <span className="font-mono font-bold text-primary-600">{submittedOrder.id}</span>
                  </p>
                  <p className="text-xs text-gray-500 mt-2 max-w-sm mx-auto">
                    The artisan vendor (<span className="font-semibold">{selectedProduct.vendor_name}</span>) has received your request.
                    You will be contacted via WhatsApp/Phone with dispatch timeline and payment confirmation.
                  </p>
                  <button
                    onClick={() => setOrderModalOpen(false)}
                    className="mt-6 px-6 py-2.5 bg-primary-600 text-white rounded-xl text-sm font-semibold hover:bg-primary-700 transition-colors"
                  >
                    Close Window
                  </button>
                </div>
              ) : (
                <form onSubmit={handleOrderSubmit} className="space-y-4">
                  <div>
                    <span className="text-xs font-semibold text-primary-600 uppercase tracking-wide">Place Order Enquiry</span>
                    <h3 className="font-bold text-gray-900 text-xl mt-0.5">{selectedProduct.title}</h3>
                    <div className="mt-1 text-sm font-extrabold text-primary-600">{formatNGN(selectedProduct.price_ngn)} each</div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Your Full Name</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Osasuyi"
                        value={orderForm.buyer_name}
                        onChange={(e) => setOrderForm({ ...orderForm, buyer_name: e.target.value })}
                        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:border-primary-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Quantity</label>
                      <input
                        type="number"
                        min={1}
                        max={100}
                        required
                        value={orderForm.quantity}
                        onChange={(e) => setOrderForm({ ...orderForm, quantity: parseInt(e.target.value) || 1 })}
                        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:border-primary-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Phone / WhatsApp</label>
                      <input
                        type="tel"
                        required
                        placeholder="+234..."
                        value={orderForm.buyer_phone}
                        onChange={(e) => setOrderForm({ ...orderForm, buyer_phone: e.target.value })}
                        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:border-primary-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Email</label>
                      <input
                        type="email"
                        required
                        placeholder="buyer@example.com"
                        value={orderForm.buyer_email}
                        onChange={(e) => setOrderForm({ ...orderForm, buyer_email: e.target.value })}
                        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:border-primary-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Delivery Address or Hotel Pickup in Benin</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Protea Hotel GRA, Benin City or Overseas shipping address"
                      value={orderForm.delivery_address}
                      onChange={(e) => setOrderForm({ ...orderForm, delivery_address: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:border-primary-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Custom Notes / Sizing (Optional)</label>
                    <textarea
                      rows={2}
                      placeholder="e.g. Coral bead necklace length, special gift packaging..."
                      value={orderForm.notes}
                      onChange={(e) => setOrderForm({ ...orderForm, notes: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:border-primary-500 resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={ordering}
                    className="w-full py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-2 shadow-sm"
                  >
                    <Send className="w-4 h-4" />
                    {ordering ? 'Sending Request...' : 'Confirm Order Enquiry'}
                  </button>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
