'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { CloudinaryUploadWidget } from '@/components/ui/CloudinaryUploadWidget';
import { createProductAction } from '../actions';
import { Sparkles, X, ArrowLeft, Loader2, CheckCircle2 } from 'lucide-react';
import type { CatalogCollection } from '@/lib/catalog';

interface AddProductFormProps {
  collections: CatalogCollection[];
}

export function AddProductForm({ collections }: AddProductFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [basePrice, setBasePrice] = useState('');
  const [salePrice, setSalePrice] = useState('');
  const [collectionId, setCollectionId] = useState('');
  const [isBestseller, setIsBestseller] = useState(true); // Default to bestseller when requested
  const [images, setImages] = useState<string[]>([]);
  const [errorMsg, setErrorMsg] = useState('');

  const handleUploadSuccess = (url: string) => {
    setImages((prev) => [...prev, url]);
  };

  const handleRemoveImage = (indexToRemove: number) => {
    setImages((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleSetPrimary = (indexToMakePrimary: number) => {
    if (indexToMakePrimary === 0) return;
    setImages((prev) => {
      const selected = prev[indexToMakePrimary];
      const rest = prev.filter((_, idx) => idx !== indexToMakePrimary);
      return [selected, ...rest];
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!title.trim()) {
      setErrorMsg('Please enter a product title.');
      return;
    }

    const parsedBasePrice = parseFloat(basePrice);
    if (isNaN(parsedBasePrice) || parsedBasePrice <= 0) {
      setErrorMsg('Please enter a valid base price.');
      return;
    }

    startTransition(async () => {
      const res = await createProductAction({
        title: title.trim(),
        description: description.trim(),
        basePrice: parsedBasePrice,
        salePrice: salePrice ? parseFloat(salePrice) : null,
        badge: isBestseller ? 'bestseller' : null,
        collectionId: collectionId || null,
        images,
      });

      if (!res.success) {
        setErrorMsg(res.error || 'Failed to save product');
        return;
      }

      router.push('/admin/products');
      router.refresh();
    });
  };

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/admin/products" className="text-muted-foreground hover:text-foreground">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-heading font-semibold text-foreground">Add New Rug Product</h1>
          <p className="text-sm text-muted-foreground">
            Populate your catalog and choose whether to showcase this rug in Best Sellers.
          </p>
        </div>
      </div>

      {errorMsg && (
        <div className="bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg text-sm">
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-card border rounded-xl shadow-xs p-6 md:p-8 space-y-8">
        {/* Basic Details */}
        <div className="space-y-4">
          <h2 className="text-base font-semibold border-b pb-2">General Information</h2>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Product Title *</label>
            <input
              type="text"
              required
              placeholder="e.g. Royal Tabriz Floral Silk Rug"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border border-border rounded-lg p-3 bg-background text-sm focus:outline-none focus:ring-1 focus:ring-burgundy"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Description</label>
            <textarea
              rows={4}
              placeholder="Describe the knot density, origins, materials, and weave..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border border-border rounded-lg p-3 bg-background text-sm focus:outline-none focus:ring-1 focus:ring-burgundy"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Base Price (PKR) *</label>
              <input
                type="number"
                required
                min="1"
                placeholder="e.g. 185000"
                value={basePrice}
                onChange={(e) => setBasePrice(e.target.value)}
                className="w-full border border-border rounded-lg p-3 bg-background text-sm focus:outline-none focus:ring-1 focus:ring-burgundy"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Sale / Discount Price (PKR, optional)</label>
              <input
                type="number"
                min="0"
                placeholder="e.g. 155000"
                value={salePrice}
                onChange={(e) => setSalePrice(e.target.value)}
                className="w-full border border-border rounded-lg p-3 bg-background text-sm focus:outline-none focus:ring-1 focus:ring-burgundy"
              />
              {parseFloat(basePrice) > 0 && parseFloat(salePrice) > 0 && parseFloat(salePrice) < parseFloat(basePrice) && (
                <p className="text-xs text-emerald-800 font-medium bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200 inline-block">
                  {Math.round(((parseFloat(basePrice) - parseFloat(salePrice)) / parseFloat(basePrice)) * 100)}% OFF • Saves PKR {(parseFloat(basePrice) - parseFloat(salePrice)).toLocaleString()}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Collection</label>
            <select
              value={collectionId}
              onChange={(e) => setCollectionId(e.target.value)}
              className="w-full border border-border rounded-lg p-3 bg-background text-sm focus:outline-none focus:ring-1 focus:ring-burgundy"
            >
              <option value="">-- Select Collection (Optional) --</option>
              {collections.map((col) => (
                <option key={col.id} value={col.id}>
                  {col.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Best Seller Toggle Feature */}
        <div className="p-4 rounded-xl border border-[#C9A15C]/40 bg-[#C9A15C]/5 flex items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#C9A15C] fill-[#C9A15C]" />
              <span className="text-sm font-semibold text-foreground">Feature in Best Sellers</span>
            </div>
            <p className="text-xs text-muted-foreground">
              When toggled on, this rug immediately appears in the dynamic "Best Sellers" showcase section on the homepage.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsBestseller(!isBestseller)}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
              isBestseller ? 'bg-[#C9A15C]' : 'bg-muted'
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                isBestseller ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Cloudinary Image Upload Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b pb-2">
            <div>
              <h2 className="text-base font-semibold">Product Images (Cloudinary)</h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Upload photography directly to Cloudinary or paste URLs. The first image will be the primary thumbnail.
              </p>
            </div>
            <span className="text-xs font-mono text-muted-foreground">{images.length} images added</span>
          </div>

          {/* Previews */}
          {images.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
              {images.map((url, idx) => (
                <div key={idx} className="group relative aspect-square rounded-xl overflow-hidden border bg-muted shadow-xs">
                  <Image src={url} alt={`Product preview ${idx + 1}`} fill className="object-cover" />

                  {/* Primary Badge */}
                  {idx === 0 ? (
                    <span className="absolute top-2 left-2 bg-[#C9A15C] text-[#1C1815] text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      Primary
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleSetPrimary(idx)}
                      className="absolute top-2 left-2 bg-black/70 hover:bg-black text-white text-[9px] px-2 py-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      Set Primary
                    </button>
                  )}

                  {/* Remove Button */}
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(idx)}
                    className="absolute top-2 right-2 p-1 bg-red-600 hover:bg-red-700 text-white rounded-full shadow-md transition-transform group-hover:scale-105"
                    title="Remove image"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Upload Widget */}
          <CloudinaryUploadWidget onUploadSuccess={handleUploadSuccess} />
        </div>

        {/* Footer Actions */}
        <div className="pt-6 border-t flex items-center justify-end gap-3">
          <Link href="/admin/products">
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </Link>
          <Button
            type="submit"
            disabled={isPending}
            className="bg-burgundy hover:bg-burgundy-deep text-white px-6 flex items-center gap-2"
          >
            {isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Saving to Catalog...
              </>
            ) : (
              'Save Product'
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
