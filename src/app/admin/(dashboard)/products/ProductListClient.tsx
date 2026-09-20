'use client';

import { useState, useTransition, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { toggleBestSellerAction, deleteProductAction, updateProductSaleAction, updateProductAction } from './actions';
import { Sparkles, Plus, Trash2, ExternalLink, Search, Tag, Percent, X, Check, Pencil, CheckCircle2 } from 'lucide-react';
import { CloudinaryUploadWidget } from '@/components/ui/CloudinaryUploadWidget';
import type { ShopProduct } from '@/lib/shopData';
import type { CatalogCollection } from '@/lib/catalog';

interface ProductListClientProps {
  initialProducts: ShopProduct[];
  collections?: CatalogCollection[];
}

const DISCOUNT_PRESETS = [10, 15, 20, 25, 30, 40];

export function ProductListClient({ initialProducts, collections }: ProductListClientProps) {
  const [products, setProducts] = useState<ShopProduct[]>(initialProducts);
  const [search, setSearch] = useState('');
  const [filterBestsellerOnly, setFilterBestsellerOnly] = useState(false);
  const [filterSaleOnly, setFilterSaleOnly] = useState(false);
  const [isPending, startTransition] = useTransition();

  // Full Edit Product state
  const [editingProduct, setEditingProduct] = useState<ShopProduct | null>(null);
  const [editingSaleProduct, setEditingSaleProduct] = useState<ShopProduct | null>(null);
  const [modalSalePrice, setModalSalePrice] = useState<string>('');
  const [modalPercent, setModalPercent] = useState<string>('');
  const [editTitle, setEditTitle] = useState('');
  const [editBasePrice, setEditBasePrice] = useState('');
  const [editSalePrice, setEditSalePrice] = useState('');
  const [editCollectionSlug, setEditCollectionSlug] = useState('');
  const [editBadge, setEditBadge] = useState<string>('');
  const [editMaterials, setEditMaterials] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editImages, setEditImages] = useState<string[]>([]);
  const [editError, setEditError] = useState('');

  // Close modals on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setEditingProduct(null);
        setEditingSaleProduct(null);
      }
    };
    if (editingProduct || editingSaleProduct) {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [editingProduct, editingSaleProduct]);

  const openEditProductModal = (product: ShopProduct) => {
    setEditingProduct(product);
    setEditTitle(product.title);
    setEditBasePrice(String(product.basePrice));
    setEditSalePrice(product.salePrice != null ? String(product.salePrice) : '');
    setEditCollectionSlug(product.collectionSlug || '');
    setEditBadge(product.badge || '');
    setEditMaterials(product.materials.join(', '));
    setEditDescription(product.description || '');
    const imgs = product.images && product.images.length > 0 ? product.images : (product.image ? [product.image] : []);
    setEditImages(imgs);
    setEditError('');
  };

  const handleRemoveEditImage = (indexToRemove: number) => {
    setEditImages((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleSetPrimaryEditImage = (indexToPrimary: number) => {
    setEditImages((prev) => {
      const selected = prev[indexToPrimary];
      const rest = prev.filter((_, idx) => idx !== indexToPrimary);
      return [selected, ...rest];
    });
  };

  const handleSaveProductEdit = () => {
    if (!editingProduct) return;
    if (!editTitle.trim()) {
      setEditError('Product title is required.');
      return;
    }
    const parsedBase = parseFloat(editBasePrice);
    if (isNaN(parsedBase) || parsedBase <= 0) {
      setEditError('Valid base price is required.');
      return;
    }

    const selectedCollection = collections?.find((c) => c.slug === editCollectionSlug);
    const parsedSale = editSalePrice ? parseFloat(editSalePrice) : null;
    const materialsArray = editMaterials
      .split(',')
      .map((m) => m.trim())
      .filter(Boolean);

    startTransition(async () => {
      const res = await updateProductAction(editingProduct.id, {
        title: editTitle.trim(),
        description: editDescription.trim(),
        basePrice: parsedBase,
        salePrice: parsedSale,
        badge: (editBadge as any) || null,
        collectionId: selectedCollection?.id || null,
        collectionName: selectedCollection?.name || (editCollectionSlug ? editCollectionSlug : null),
        collectionSlug: editCollectionSlug || null,
        materials: materialsArray.length > 0 ? materialsArray : undefined,
        images: editImages,
        image: editImages[0] || editingProduct.image,
      });

      if (!res.success) {
        setEditError(res.error || 'Failed to update product.');
        return;
      }

      setProducts((prev) =>
        prev.map((p) =>
          p.id === editingProduct.id
            ? {
                ...p,
                title: editTitle.trim(),
                description: editDescription.trim(),
                basePrice: parsedBase,
                salePrice: parsedSale ?? undefined,
                badge: (editBadge as any) || undefined,
                collection: selectedCollection?.name || (editCollectionSlug ? editCollectionSlug : p.collection),
                collectionSlug: editCollectionSlug || p.collectionSlug,
                materials: materialsArray.length > 0 ? materialsArray : p.materials,
                images: editImages,
                image: editImages[0] || p.image,
              }
            : p
        )
      );

      setEditingProduct(null);
    });
  };

  // Sale Modal state


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
                          <button
                            type="button"
                            onClick={() => openEditProductModal(product)}
                            className="p-2 text-text-muted hover:text-burgundy hover:bg-cream-alt rounded-lg transition-colors cursor-pointer"
                            title="Edit product"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
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

      {/* Full Edit Product Modal */}
      {editingProduct && (
        <div 
          className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs p-3 sm:p-6 flex justify-center items-start animate-in fade-in duration-200"
          onClick={(e) => {
            if (e.target === e.currentTarget) setEditingProduct(null);
          }}
        >
          <div 
            className="relative bg-white border border-[#DFD7C9] rounded-2xl sm:rounded-3xl max-w-lg w-full shadow-2xl flex flex-col max-h-[calc(100vh-2rem)] sm:max-h-[calc(100vh-3rem)] my-auto overflow-hidden animate-in zoom-in-95 duration-200 shrink-0"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Sticky Header */}
            <div className="flex items-center justify-between px-6 py-4 sm:px-8 sm:py-5 border-b border-[#F0EAE1] bg-white sticky top-0 z-30 shrink-0 shadow-2xs">
              <div>
                <span className="text-[10px] uppercase tracking-widest font-semibold text-burgundy block mb-0.5">
                  Edit Rug Details
                </span>
                <h3 className="font-heading text-lg sm:text-xl font-semibold text-text-dark">
                  Edit Product
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setEditingProduct(null)}
                className="w-8 h-8 rounded-full bg-cream-alt hover:bg-burgundy hover:text-white text-text-dark flex items-center justify-center transition-colors cursor-pointer shrink-0 shadow-2xs"
                title="Close modal (Esc)"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Scrollable Body */}
            <div className="p-5 sm:p-7 space-y-4 overflow-y-auto flex-1 min-h-0 text-left">
              {editError && (
                <div className="p-3 text-xs bg-red-50 border border-red-200 text-red-700 rounded-xl">
                  {editError}
                </div>
              )}

              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-text-dark mb-1">
                  Product Title *
                </label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full px-4 py-2.5 bg-ivory/50 border border-[#DFD7C9] rounded-xl text-sm font-medium text-text-dark focus:outline-none focus:border-burgundy"
                  placeholder="e.g. Royal Bokhara Classic"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-text-dark mb-1">
                    Base Price (PKR) *
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={editBasePrice}
                    onChange={(e) => setEditBasePrice(e.target.value)}
                    className="w-full px-4 py-2.5 bg-ivory/50 border border-[#DFD7C9] rounded-xl text-sm font-medium text-text-dark focus:outline-none focus:border-burgundy"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-text-dark mb-1">
                    Sale Price (PKR, optional)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={editSalePrice}
                    onChange={(e) => setEditSalePrice(e.target.value)}
                    placeholder="Leave empty if not on sale"
                    className="w-full px-4 py-2.5 bg-ivory/50 border border-[#DFD7C9] rounded-xl text-sm font-medium text-burgundy focus:outline-none focus:border-burgundy"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-text-dark mb-1">
                    Collection
                  </label>
                  <select
                    value={editCollectionSlug}
                    onChange={(e) => setEditCollectionSlug(e.target.value)}
                    className="w-full px-3 py-2.5 bg-ivory/50 border border-[#DFD7C9] rounded-xl text-sm font-medium text-text-dark focus:outline-none focus:border-burgundy cursor-pointer"
                  >
                    <option value="">-- No Collection / Unassigned --</option>
                    {collections && collections.map((col) => (
                      <option key={col.slug} value={col.slug}>
                        {col.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-text-dark mb-1">
                    Curatorial Badge
                  </label>
                  <select
                    value={editBadge}
                    onChange={(e) => setEditBadge(e.target.value)}
                    className="w-full px-3 py-2.5 bg-ivory/50 border border-[#DFD7C9] rounded-xl text-sm font-medium text-text-dark focus:outline-none focus:border-burgundy cursor-pointer"
                  >
                    <option value="">None</option>
                    <option value="bestseller">Best Seller</option>
                    <option value="new">New Arrival</option>
                    <option value="exclusive">Exclusive Atelier</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-text-dark mb-1">
                  Materials (comma-separated)
                </label>
                <input
                  type="text"
                  value={editMaterials}
                  onChange={(e) => setEditMaterials(e.target.value)}
                  placeholder="e.g. Pure Silk, Handspun Wool"
                  className="w-full px-4 py-2.5 bg-ivory/50 border border-[#DFD7C9] rounded-xl text-sm font-medium text-text-dark focus:outline-none focus:border-burgundy"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-text-dark mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  placeholder="Artisanal description and heritage craftsmanship details..."
                  className="w-full px-4 py-2.5 bg-ivory/50 border border-[#DFD7C9] rounded-xl text-sm font-medium text-text-dark focus:outline-none focus:border-burgundy resize-none"
                />
              </div>

              {/* Product Images (Cloudinary) */}
              <div className="space-y-3 pt-2 border-t border-[#F0EAE1]">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="block text-xs uppercase tracking-wider font-semibold text-text-dark">
                      Product Images (Cloudinary)
                    </label>
                    <p className="text-[11px] text-text-muted mt-0.5">
                      Upload from computer directly to Cloudinary or paste URL. First image is the primary cover.
                    </p>
                  </div>
                  <span className="text-[11px] font-mono text-text-muted">
                    {editImages.length} image{editImages.length === 1 ? '' : 's'}
                  </span>
                </div>

                {/* Image Previews */}
                {editImages.length > 0 && (
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 py-1">
                    {editImages.map((url, idx) => (
                      <div key={idx} className="group relative aspect-square rounded-xl overflow-hidden border border-[#DFD7C9] bg-ivory shadow-xs">
                        <Image src={url} alt={`Preview ${idx + 1}`} fill className="object-cover" />
                        {idx === 0 ? (
                          <span className="absolute top-1.5 left-1.5 bg-[#C9A15C] text-[#1C1815] text-[9px] font-bold px-1.5 py-0.5 rounded-full shadow-xs flex items-center gap-0.5">
                            <CheckCircle2 className="w-2.5 h-2.5" />
                            Primary
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleSetPrimaryEditImage(idx)}
                            className="absolute top-1.5 left-1.5 bg-black/70 hover:bg-black text-white text-[8px] px-1.5 py-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                          >
                            Set Primary
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => handleRemoveEditImage(idx)}
                          className="absolute top-1.5 right-1.5 p-1 bg-red-600 hover:bg-red-700 text-white rounded-full shadow-xs transition-transform group-hover:scale-110 cursor-pointer"
                          title="Remove image"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <CloudinaryUploadWidget
                  compact={true}
                  onUploadSuccess={(url) => setEditImages((prev) => [...prev, url])}
                />
              </div>
            </div>

            {/* Sticky Footer */}
            <div className="flex items-center justify-end gap-3 px-6 py-3.5 sm:px-8 sm:py-4 border-t border-[#F0EAE1] bg-white/95 backdrop-blur-xs sticky bottom-0 z-30 shrink-0">
              <Button
                type="button"
                variant="outline"
                onClick={() => setEditingProduct(null)}
                className="rounded-full px-5 text-xs uppercase tracking-wider cursor-pointer"
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleSaveProductEdit}
                disabled={isPending}
                className="bg-burgundy hover:bg-burgundy-deep text-white rounded-full px-6 text-xs uppercase tracking-wider shadow-xs cursor-pointer"
              >
                {isPending ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Sale Price Management Modal */}
      {editingSaleProduct && (
        <div 
          className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs p-3 sm:p-6 flex justify-center items-start animate-in fade-in duration-200"
          onClick={(e) => {
            if (e.target === e.currentTarget) setEditingSaleProduct(null);
          }}
        >
          <div 
            className="relative bg-white border border-[#DFD7C9] rounded-2xl sm:rounded-3xl max-w-md w-full shadow-2xl flex flex-col max-h-[calc(100vh-2rem)] sm:max-h-[calc(100vh-3rem)] my-auto overflow-hidden animate-in zoom-in-95 duration-200 shrink-0"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4 sm:px-8 sm:py-5 border-b border-[#F0EAE1] bg-white sticky top-0 z-30 shrink-0 shadow-2xs">
              <div>
                <span className="text-[10px] uppercase tracking-widest font-semibold text-burgundy block mb-0.5">
                  Manage Product Sale
                </span>
                <h3 className="font-heading text-lg sm:text-xl font-semibold text-text-dark">
                  {editingSaleProduct.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setEditingSaleProduct(null)}
                className="w-8 h-8 rounded-full bg-cream-alt hover:bg-burgundy hover:text-white text-text-dark flex items-center justify-center transition-colors cursor-pointer shrink-0 shadow-2xs"
                title="Close modal (Esc)"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 sm:p-7 space-y-5 overflow-y-auto flex-1 min-h-0 text-left">
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
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between px-6 py-3.5 sm:px-8 sm:py-4 border-t border-[#F0EAE1] bg-white/95 backdrop-blur-xs sticky bottom-0 z-30 shrink-0">
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
                  className="rounded-full px-4 text-xs uppercase tracking-wider cursor-pointer"
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
