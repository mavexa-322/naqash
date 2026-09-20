import Link from 'next/link';
import Image from 'next/image';
import { getProducts, getCollections } from '@/lib/catalog';
import { getAllOrders } from '@/lib/ordersStorage';
import { 
  Package, 
  FolderTree, 
  Sparkles, 
  Tag, 
  Plus, 
  ArrowRight, 
  ExternalLink, 
  Eye,
  TrendingUp,
  Layers,
  CheckCircle2,
  CreditCard,
  Clock
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
  const [products, collections, orders] = await Promise.all([
    getProducts(),
    getCollections(),
    getAllOrders(),
  ]);

  const bestsellersCount = products.filter((p) => p.badge === 'bestseller' || p.featured).length;
  const onSaleCount = products.filter(
    (p) => (p.salePrice != null && p.salePrice < p.basePrice) || p.badge === 'sale'
  ).length;
  const pendingOrdersCount = orders.filter((o) => o.payment_status === 'pending_verification').length;

  const totalCatalogValue = products.reduce((acc, p) => acc + (p.basePrice || 0), 0);
  const recentProducts = products.slice(0, 6);

  return (
    <div className="space-y-8 max-w-7xl">
      {/* ── 1. Top Executive Banner ────────────────────────────── */}
      <div className="bg-white rounded-3xl border border-[#DFD7C9] p-6 sm:p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.2em] font-semibold text-burgundy">
              Naqash Heritage Atelier • Executive Overview
            </span>
          </div>
          <h1 className="font-heading text-2xl sm:text-4xl font-medium text-text-dark tracking-tight">
            Curatorial Dashboard
          </h1>
          <p className="text-text-muted text-xs sm:text-sm font-light mt-1 max-w-xl">
            Real-time catalog inventory, curatorial collections, and client order management for Naqash Carpets Gallery.
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
          <Link
            href="/admin/products/new"
            className="inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 bg-burgundy hover:bg-burgundy-deep text-white rounded-full text-xs uppercase tracking-wider font-semibold transition-all shadow-xs cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add New Rug</span>
          </Link>

          <Link
            href="/admin/collections/new"
            className="inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 bg-cream-alt hover:bg-[#F0EAE1] text-burgundy border border-[#DFD7C9] rounded-full text-xs uppercase tracking-wider font-semibold transition-all shadow-xs cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Collection</span>
          </Link>

          <Link
            href="/"
            target="_blank"
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 bg-white hover:bg-cream-alt text-text-dark border border-[#DFD7C9] rounded-full text-xs uppercase tracking-wider font-medium transition-all shadow-xs cursor-pointer"
            title="Open Live Public Store"
          >
            <span>Live Store</span>
            <ExternalLink className="w-3.5 h-3.5 text-text-muted" />
          </Link>
        </div>
      </div>

      {/* ── Pending Orders Alert Banner (if any) ───────────────── */}
      {pendingOrdersCount > 0 && (
        <div className="bg-amber-50 border border-amber-300/80 p-4 sm:p-5 rounded-2xl sm:rounded-3xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
          <div className="flex items-start sm:items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-semibold text-amber-950">
                {pendingOrdersCount} client {pendingOrdersCount === 1 ? 'order is' : 'orders are'} awaiting payment receipt verification
              </p>
              <p className="text-[11px] text-amber-800 font-light">
                Inspect uploaded bank transfer screenshots and approve orders for shipping.
              </p>
            </div>
          </div>
          <Link
            href="/admin/orders"
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-amber-800 hover:bg-amber-900 text-white rounded-full text-xs font-semibold uppercase tracking-wider shrink-0 transition-colors shadow-xs"
          >
            <span>Review Orders</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

      {/* ── 2. Metric Cards Grid (4 luxury cards) ───────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
        {/* Card 1: Total Rugs */}
        <div className="bg-white rounded-2xl sm:rounded-3xl border border-[#DFD7C9] p-4 sm:p-6 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] sm:text-xs uppercase tracking-wider font-semibold text-text-muted">
              Total Rug Pieces
            </span>
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-cream-alt text-burgundy flex items-center justify-center">
              <Package className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
          </div>
          <div>
            <span className="font-heading text-3xl sm:text-4xl font-medium text-text-dark">
              {products.length}
            </span>
            <p className="text-[10px] sm:text-xs text-text-muted font-light mt-1 flex items-center gap-1">
              <span className="text-emerald-700 font-medium">All active</span> in catalog
            </p>
          </div>
        </div>

        {/* Card 2: Active Collections */}
        <div className="bg-white rounded-2xl sm:rounded-3xl border border-[#DFD7C9] p-4 sm:p-6 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] sm:text-xs uppercase tracking-wider font-semibold text-text-muted">
              Active Collections
            </span>
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-cream-alt text-gold flex items-center justify-center">
              <FolderTree className="w-4 h-4 sm:w-5 sm:h-5 text-[#8F6B20]" />
            </div>
          </div>
          <div>
            <span className="font-heading text-3xl sm:text-4xl font-medium text-text-dark">
              {collections.length}
            </span>
            <p className="text-[10px] sm:text-xs text-text-muted font-light mt-1">
              Curated architectural lines
            </p>
          </div>
        </div>

        {/* Card 3: Bestseller Masterpieces */}
        <div className="bg-white rounded-2xl sm:rounded-3xl border border-[#DFD7C9] p-4 sm:p-6 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] sm:text-xs uppercase tracking-wider font-semibold text-text-muted">
              Bestseller Pieces
            </span>
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
          </div>
          <div>
            <span className="font-heading text-3xl sm:text-4xl font-medium text-text-dark">
              {bestsellersCount}
            </span>
            <p className="text-[10px] sm:text-xs text-text-muted font-light mt-1">
              Highlighted on home & shop
            </p>
          </div>
        </div>

        {/* Card 4: Orders & Payments */}
        <Link
          href="/admin/orders"
          className="bg-white rounded-2xl sm:rounded-3xl border border-[#DFD7C9] p-4 sm:p-6 shadow-xs hover:shadow-md hover:border-burgundy transition-all flex flex-col justify-between group cursor-pointer"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] sm:text-xs uppercase tracking-wider font-semibold text-text-muted">
              Client Orders
            </span>
            <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center ${
              pendingOrdersCount > 0 ? 'bg-amber-100 text-amber-800' : 'bg-cream-alt text-burgundy'
            }`}>
              <CreditCard className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="font-heading text-3xl sm:text-4xl font-medium text-text-dark group-hover:text-burgundy transition-colors">
                {orders.length}
              </span>
              {pendingOrdersCount > 0 && (
                <span className="text-[9px] sm:text-[10px] bg-amber-100 text-amber-900 border border-amber-300 font-bold px-2 py-0.5 rounded-full">
                  {pendingOrdersCount} pending
                </span>
              )}
            </div>
            <p className="text-[10px] sm:text-xs text-text-muted font-light mt-1 group-hover:text-burgundy flex items-center gap-1">
              <span>View & verify receipts</span>
              <ArrowRight className="w-3 h-3" />
            </p>
          </div>
        </Link>
      </div>

      {/* ── 3. Collections Overview Grid ────────────────────────── */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-heading text-lg sm:text-xl font-medium text-text-dark">
              Curated Collections
            </h2>
            <p className="text-xs text-text-muted font-light">
              Current weaving lineages available in the showroom and online catalog.
            </p>
          </div>
          <Link
            href="/admin/collections"
            className="text-xs uppercase tracking-wider font-semibold text-burgundy hover:underline flex items-center gap-1"
          >
            <span>Manage All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-5">
          {collections.map((collection, index) => (
            <Link
              key={collection.id}
              href={`/admin/collections`}
              className="group bg-white rounded-2xl border border-[#DFD7C9] overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col"
            >
              <div className="relative aspect-[4/3] bg-cream-alt overflow-hidden">
                {collection.image ? (
                  <Image
                    src={collection.image}
                    alt={collection.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-text-muted">
                    <Layers className="w-6 h-6 opacity-30" />
                  </div>
                )}
                <div className="absolute top-2 right-2 bg-white/95 backdrop-blur-xs px-2 py-0.5 rounded-full text-[9px] uppercase tracking-wider font-bold text-burgundy shadow-xs">
                  {collection.productCount} Rugs
                </div>
              </div>
              <div className="p-3 sm:p-4">
                <span className="text-[9px] uppercase tracking-widest text-[#8F6B20] font-semibold block mb-0.5">
                  Lineage 0{index + 1}
                </span>
                <h3 className="font-heading text-sm sm:text-base font-medium text-text-dark group-hover:text-burgundy transition-colors truncate">
                  {collection.name}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* ── 4. Recent Products Showcase ─────────────────────────── */}
      <div className="bg-white rounded-2xl sm:rounded-3xl border border-[#DFD7C9] p-5 sm:p-8 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#F0EAE1] pb-4">
          <div>
            <h2 className="font-heading text-lg sm:text-xl font-medium text-text-dark">
              Recent Catalog Additions
            </h2>
            <p className="text-xs text-text-muted font-light">
              Latest handcrafted pieces available in the inventory.
            </p>
          </div>
          <Link
            href="/admin/products"
            className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider font-semibold text-burgundy hover:underline"
          >
            <span>View Complete Catalog ({products.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Product Items Table/List */}
        <div className="divide-y divide-[#F0EAE1]">
          {recentProducts.map((product) => {
            const hasDiscount = product.salePrice != null && product.salePrice < product.basePrice;
            return (
              <div
                key={product.id}
                className="py-3.5 flex items-center justify-between gap-4 hover:bg-cream-alt/40 -mx-2 px-2 rounded-xl transition-colors"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="relative w-12 h-14 sm:w-14 sm:h-16 rounded-lg bg-cream-alt overflow-hidden shrink-0 border border-[#DFD7C9]">
                    {product.image ? (
                      <Image
                        src={product.image}
                        alt={product.title}
                        fill
                        className="object-cover"
                        sizes="60px"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[9px] text-text-muted">
                        No img
                      </div>
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium text-xs sm:text-sm text-text-dark truncate">
                        {product.title}
                      </h3>
                      {product.badge && (
                        <span
                          className={`text-[8px] sm:text-[9px] font-semibold uppercase px-1.5 py-0.5 rounded-full shrink-0 ${
                            product.badge === 'bestseller'
                              ? 'bg-amber-100 text-amber-800'
                              : product.badge === 'new'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-burgundy text-white'
                          }`}
                        >
                          {product.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-text-muted font-light truncate mt-0.5">
                      {product.collection || 'Heritage'} • {product.materials.join(', ')}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 shrink-0">
                  <div className="text-right">
                    <p className="font-semibold text-xs sm:text-sm text-text-dark">
                      PKR {(product.salePrice ?? product.basePrice).toLocaleString()}
                    </p>
                    {hasDiscount && (
                      <p className="text-[10px] text-text-muted line-through">
                        PKR {product.basePrice.toLocaleString()}
                      </p>
                    )}
                  </div>

                  <Link
                    href={`/shop/${product.slug}`}
                    target="_blank"
                    className="p-2 rounded-lg text-text-muted hover:text-burgundy hover:bg-cream-alt transition-colors"
                    title="View live piece in shop"
                  >
                    <Eye className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
