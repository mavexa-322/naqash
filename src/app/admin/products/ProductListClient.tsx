'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { toggleBestSellerAction, deleteProductAction, updateProductSaleAction } from './actions';
import { Sparkles, Plus, Trash2, ExternalLink, Search, Tag, Percent, X, Check } from 'lucide-react';
import type { ShopProduct } from '@/lib/shopData';

interface ProductListClientProps {
  initialProducts: ShopProduct[];
}

const DISCOUNT_PRESETS = [10, 15, 20, 25, 30, 40];

export function ProductListClient({ initialProducts }: ProductListClientProps) {
  const [products, setProducts] = useState<ShopProduct[]>(initialProducts);
  const [search, setSearch] = useState('');
  const [filterBestsellerOnly, setFilterBestsellerOnly] = useState(false);
  const [filterSaleOnly, setFilterSaleOnly] = useState(false);
  const [isPending, startTransition] = useTransition();

  // Sale Modal state
  const [editingSaleProduct, setEditingSaleProduct] = useState<ShopProduct | null>(null);
  const [modalSalePrice, setModalSalePrice] = useState<string>('');
  const [modalPercent, setModalPercent] = useState<string>('');

  const handleToggleBestSeller = (product: ShopProduct) => {
    const isCurrentlyBestseller = product.badge === 'bestseller';
    const nextBadge = isCurrentlyBestseller ? undefined : 'bestseller';

    // Optimistic UI update
    setProducts((prev) =>
      prev.map((p) => (p.id === product.id ? { ...p, badge: nextBadge } : p))
    );

    startTransition(async () => {
      const res = await toggleBestSellerAction(product.id, product.badge);
      if (!res.success) {
        setProducts((prev) =>
          prev.map((p) => (p.id === product.id ? { ...p, badge: product.badge } : p))
        );
        alert('Could not update bestseller status: ' + res.error);
      }
    });
  };

  const handleDelete = async (productId: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return;

    setProducts((prev) => prev.filter((p) => p.id !== productId));
    startTransition(async () => {
      const res = await deleteProductAction(productId);
      if (!res.success) {
        alert('Failed to delete product: ' + res.error);
      }
    });
  };

  // Open Sale modal and initialize values
  const openSaleModal = (product: ShopProduct) => {
    setEditingSaleProduct(product);
    if (product.salePrice != null && product.salePrice < product.basePrice) {
      setModalSalePrice(String(product.salePrice));
      const pct = Math.round(((product.basePrice - product.salePrice) / product.basePrice) * 100);
      setModalPercent(String(pct));
    } else {
      // Default to 20% off
      const defaultPrice = Math.round(product.basePrice * 0.8);
      setModalSalePrice(String(defaultPrice));
      setModalPercent('20');
    }
  };

  // Handle preset click
  const handlePresetClick = (pct: number) => {
    if (!editingSaleProduct) return;
    setModalPercent(String(pct));
    const calculatedPrice = Math.round(editingSaleProduct.basePrice * (1 - pct / 100));
    setModalSalePrice(String(calculatedPrice));
  };

  // Handle percent change
  const handlePercentChange = (val: string) => {
    setModalPercent(val);
    if (!editingSaleProduct) return;
    const num = parseFloat(val);
    if (!isNaN(num) && num > 0 && num < 100) {
      const calculatedPrice = Math.round(editingSaleProduct.basePrice * (1 - num / 100));
      setModalSalePrice(String(calculatedPrice));
    }
  };

  // Handle sale price change
  const handlePriceChange = (val: string) => {
    setModalSalePrice(val);
    if (!editingSaleProduct) return;
    const num = parseFloat(val);
    if (!isNaN(num) && num > 0 && num < editingSaleProduct.basePrice) {
      const calculatedPct = Math.round(((editingSaleProduct.basePrice - num) / editingSaleProduct.basePrice) * 100);
      setModalPercent(String(calculatedPct));
    }
  };

  // Save Sale Price
  const handleSaveSale = () => {
    if (!editingSaleProduct) return;
    const numericPrice = parseFloat(modalSalePrice);
    if (isNaN(numericPrice) || numericPrice <= 0 || numericPrice >= editingSaleProduct.basePrice) {
      alert('Sale price must be greater than 0 and less than the base price of PKR ' + editingSaleProduct.basePrice.toLocaleString());
      return;
    }

    const productId = editingSaleProduct.id;
    const badge = editingSaleProduct.badge === 'bestseller' ? 'bestseller' : 'sale';

    // Optimistic UI update
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, salePrice: numericPrice, badge } : p))
    );
    setEditingSaleProduct(null);

    startTransition(async () => {
      const res = await updateProductSaleAction(productId, numericPrice, badge);
      if (!res.success) {
        alert('Failed to update sale price: ' + res.error);
        window.location.reload();
      }
    });
  };

  // Remove Product from Sale
  const handleRemoveFromSale = () => {
    if (!editingSaleProduct) return;
    const productId = editingSaleProduct.id;
    const nextBadge = editingSaleProduct.badge === 'sale' ? undefined : editingSaleProduct.badge;

    // Optimistic UI update
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, salePrice: undefined, badge: nextBadge } : p))
    );
    setEditingSaleProduct(null);

    startTransition(async () => {
      const res = await updateProductSaleAction(productId, null, nextBadge || null);
      if (!res.success) {
        alert('Failed to remove from sale: ' + res.error);
        window.location.reload();
      }
    });
  };

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.collection.toLowerCase().includes(search.toLowerCase());
    const matchesBestseller = filterBestsellerOnly ? p.badge === 'bestseller' : true;
    const matchesSale = filterSaleOnly
      ? (p.salePrice != null && p.salePrice < p.basePrice) || p.badge === 'sale'
      : true;
    return matchesSearch && matchesBestseller && matchesSale;
  });

  const bestsellerCount = products.filter((p) => p.badge === 'bestseller').length;
  const saleCount = products.filter((p) => (p.salePrice != null && p.salePrice < p.basePrice) || p.badge === 'sale').length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-heading font-semibold text-text-dark">Products Inventory</h1>
          <p className="text-text-muted mt-1 text-sm">
            Manage your rugs catalog, pricing, discounts, and homepage Best Sellers showcase.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/sale" target="_blank">
            <Button variant="outline" className="border-burgundy/40 text-burgundy hover:bg-cream-alt flex items-center gap-2 rounded-full text-xs uppercase tracking-wider">
              <Tag className="w-3.5 h-3.5" />
              View /sale Page
            </Button>
          </Link>
          <Link href="/admin/products/new">
            <Button className="bg-burgundy hover:bg-burgundy-deep text-white flex items-center gap-2 rounded-full text-xs uppercase tracking-wider shadow-xs cursor-pointer">
              <Plus className="w-4 h-4" />
              Add New Product
            </Button>
          </Link>
        </div>
      </div>

      {/* Control Bar: Search & Filter Tabs */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white border border-[#DFD7C9] rounded-2xl p-4 shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            placeholder="Search by title or collection..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm bg-ivory/50 border border-[#DFD7C9] rounded-xl text-text-dark placeholder:text-text-muted focus:outline-none focus:border-burgundy"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto justify-end">
          {/* Sale Filter Button */}
          <button
            type="button"
            onClick={() => {
              setFilterSaleOnly(!filterSaleOnly);
              if (!filterSaleOnly) setFilterBestsellerOnly(false);
            }}
            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
              filterSaleOnly
                ? 'bg-burgundy text-white border-burgundy shadow-xs'
                : 'bg-white border-[#DFD7C9] text-text-dark hover:border-burgundy'
            }`}
          >
            <Tag className="w-3.5 h-3.5" />
            On Sale ({saleCount})
          </button>

          {/* Best Seller Filter Button */}
          <button
            type="button"
            onClick={() => {
              setFilterBestsellerOnly(!filterBestsellerOnly);
              if (!filterBestsellerOnly) setFilterSaleOnly(false);
            }}
            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
              filterBestsellerOnly
                ? 'bg-[#C9A15C] text-[#1C1815] border-[#C9A15C] shadow-xs'
                : 'bg-white border-[#DFD7C9] text-text-dark hover:border-[#C9A15C]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            Best Sellers ({bestsellerCount})
          </button>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white border border-[#DFD7C9] rounded-2xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead className="bg-ivory border-b border-[#DFD7C9] text-[11px] uppercase tracking-wider text-text-muted font-semibold">
              <tr>
                <th className="p-4 w-20">Image</th>
                <th className="p-4">Product Title</th>
                <th className="p-4">Collection</th>
                <th className="p-4">Base Price</th>
                <th className="p-4 text-center">Sale & Discount</th>
                <th className="p-4 text-center">Best Seller</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0EAE1]">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-12 text-center text-text-muted">
                    No products found matching your filter.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => {
                  const isBestseller = product.badge === 'bestseller';
                  const isOnSale = product.salePrice != null && product.salePrice < product.basePrice;
                  const discountPct = isOnSale
                    ? Math.round(((product.basePrice - product.salePrice!) / product.basePrice) * 100)
                    : 0;

                  return (
                    <tr key={product.id} className="hover:bg-ivory/40 transition-colors">
                      {/* Image Thumbnail */}
                      <td className="p-4">
                        <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-cream-alt border border-[#DFD7C9]">
                          {product.image ? (
                            <Image
                              src={product.image}
                              alt={product.title}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-[10px] text-text-muted">
                              No image
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Title & Slug */}
                      <td className="p-4">
                        <span className="font-heading font-medium text-base text-text-dark block">{product.title}</span>
                        <span className="text-xs text-text-muted font-mono">/{product.slug}</span>
                      </td>

                      {/* Collection */}
                      <td className="p-4 text-text-muted text-xs uppercase tracking-wider">
                        {product.collection || 'Unassigned'}
                      </td>

                      {/* Base Price */}
                      <td className="p-4 font-semibold text-text-dark whitespace-nowrap">
                        PKR {Number(product.basePrice).toLocaleString()}
                      </td>

                      {/* Sale & Discount Management Column */}
                      <td className="p-4 text-center whitespace-nowrap">
                        {isOnSale ? (
                          <div className="inline-flex flex-col items-center gap-1">
                            <button
                              type="button"
                              onClick={() => openSaleModal(product)}
                              className="inline-flex items-center gap-1.5 px-3 py-1 bg-burgundy/10 hover:bg-burgundy/20 text-burgundy border border-burgundy/30 rounded-full text-xs font-bold transition-colors cursor-pointer"
                              title="Click to edit sale price"
                            >
                              <Tag className="w-3 h-3" />
                              -{discountPct}% OFF
                            </button>
                            <span className="text-[11px] font-semibold text-burgundy">
                              PKR {product.salePrice!.toLocaleString()}
                            </span>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => openSaleModal(product)}
                            className="inline-flex items-center gap-1 px-3 py-1 text-xs font-medium text-text-muted hover:text-burgundy bg-cream-alt/50 hover:bg-cream-alt border border-dashed border-[#DFD7C9] rounded-full transition-colors cursor-pointer"
                          >
                            <Plus className="w-3 h-3" />
                            Put on Sale
                          </button>
                        )}
                      </td>

                      {/* Best Seller 1-Click Toggle */}
                      <td className="p-4 text-center whitespace-nowrap">
                        <button
                          type="button"
                          disabled={isPending}
                          onClick={() => handleToggleBestSeller(product)}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 shadow-xs cursor-pointer ${
                            isBestseller
                              ? 'bg-[#C9A15C] text-[#1C1815] hover:brightness-110 ring-2 ring-[#C9A15C]/40'
                              : 'bg-white text-text-muted hover:text-text-dark hover:bg-cream-alt border border-[#DFD7C9]'
                          }`}
                          title={isBestseller ? 'Click to remove from Best Sellers' : 'Click to feature in Best Sellers'}
                        >
                          <Sparkles className={`w-3.5 h-3.5 ${isBestseller ? 'fill-current' : ''}`} />
                          {isBestseller ? 'Best Seller' : 'Make Best Seller'}
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="p-4 text-right whitespace-nowrap">
                        <div className="inline-flex items-center gap-2">
                          <Link
                            href={`/shop/${product.slug}`}
                            target="_blank"
                            className="p-2 text-text-muted hover:text-burgundy hover:bg-cream-alt rounded-lg transition-colors cursor-pointer"
                            title="View on store"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Link>
                          <button
                            type="button"
                            onClick={() => handleDelete(product.id, product.title)}
                            className="p-2 text-text-muted hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                            title="Delete product"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Sale Price Management Modal */}
      {editingSaleProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white border border-[#DFD7C9] rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] uppercase tracking-widest font-semibold text-burgundy block mb-1">
                  Manage Product Sale
                </span>
                <h3 className="font-heading text-xl font-semibold text-text-dark">
                  {editingSaleProduct.title}
                </h3>
              </div>
              <button
                onClick={() => setEditingSaleProduct(null)}
                className="p-1 text-text-muted hover:text-text-dark cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Base Price Display */}
            <div className="bg-ivory p-4 rounded-2xl border border-[#DFD7C9] flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider text-text-muted font-medium">Original Base Price:</span>
              <span className="font-heading text-lg font-semibold text-text-dark">
                PKR {editingSaleProduct.basePrice.toLocaleString()}
              </span>
            </div>

            {/* Quick Discount Presets */}
            <div>
              <label className="block text-xs uppercase tracking-wider font-semibold text-text-dark mb-2">
                Quick Discount Presets:
              </label>
              <div className="grid grid-cols-3 gap-2">
                {DISCOUNT_PRESETS.map((pct) => (
                  <button
                    key={pct}
                    type="button"
                    onClick={() => handlePresetClick(pct)}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                      modalPercent === String(pct)
                        ? 'bg-burgundy text-white border-burgundy shadow-xs'
                        : 'bg-cream-alt/60 hover:bg-cream-alt text-text-dark border-[#DFD7C9]'
                    }`}
                  >
                    {pct}% OFF
                  </button>
                ))}
              </div>
            </div>

            {/* Dual Inputs: % and Sale Price */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="block text-xs uppercase tracking-wider font-semibold text-text-dark">
                  Discount %
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="1"
                    max="99"
                    value={modalPercent}
                    onChange={(e) => handlePercentChange(e.target.value)}
                    className="w-full pl-4 pr-8 py-2.5 bg-ivory/50 border border-[#DFD7C9] rounded-xl text-sm font-semibold text-text-dark focus:outline-none focus:border-burgundy"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-text-muted font-bold">%</span>
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-xs uppercase tracking-wider font-semibold text-text-dark">
                  Sale Price (PKR)
                </label>
                <input
                  type="number"
                  min="1"
                  max={editingSaleProduct.basePrice - 1}
                  value={modalSalePrice}
                  onChange={(e) => handlePriceChange(e.target.value)}
                  className="w-full px-4 py-2.5 bg-ivory/50 border border-[#DFD7C9] rounded-xl text-sm font-semibold text-burgundy focus:outline-none focus:border-burgundy"
                />
              </div>
            </div>

            {/* Live Calculation Preview */}
            {parseFloat(modalSalePrice) > 0 && parseFloat(modalSalePrice) < editingSaleProduct.basePrice && (
              <div className="bg-emerald-50 border border-emerald-200/70 p-3 rounded-xl flex items-center justify-between text-xs">
                <span className="text-emerald-800 font-medium">Customer Savings:</span>
                <span className="text-emerald-900 font-bold">
                  Save PKR {(editingSaleProduct.basePrice - parseFloat(modalSalePrice)).toLocaleString()} ({modalPercent}% OFF)
                </span>
              </div>
            )}

            {/* Modal Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-[#F0EAE1]">
              {editingSaleProduct.salePrice ? (
                <button
                  type="button"
                  onClick={handleRemoveFromSale}
                  disabled={isPending}
                  className="text-xs uppercase tracking-wider font-semibold text-red-600 hover:underline cursor-pointer"
                >
                  Remove Sale
                </button>
              ) : (
                <div />
              )}

              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEditingSaleProduct(null)}
                  className="rounded-full px-4 text-xs uppercase tracking-wider"
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  onClick={handleSaveSale}
                  disabled={isPending}
                  className="bg-burgundy hover:bg-burgundy-deep text-white rounded-full px-5 text-xs uppercase tracking-wider shadow-xs cursor-pointer"
                >
                  Apply Sale
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
