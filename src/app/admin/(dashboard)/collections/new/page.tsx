'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { CloudinaryUploadWidget } from '@/components/ui/CloudinaryUploadWidget';
import { createCollectionAction } from '../actions';
import { ChevronLeft, Layers, Image as ImageIcon, Sparkles } from 'lucide-react';

const SUGGESTED_BANNER_PRESETS = [
  { label: 'Persian Heritage', url: '/rugs/persian-heritage.jpg' },
  { label: 'Modern Minimal', url: '/rugs/modern-minimal.jpg' },
  { label: 'Vintage Overdyed', url: '/rugs/vintage-overdyed.jpg' },
  { label: 'Royal Bokhara', url: '/rugs/bokhara-red.jpg' },
  { label: 'Isfahan Silk', url: '/rugs/isfahan-blue.jpg' },
  { label: 'Tabriz Garden', url: '/rugs/tabriz-floral.jpg' },
];

export default function AddNewCollectionPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);
  const [description, setDescription] = useState('');
  const [bannerUrl, setBannerUrl] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Auto-generate slug when name changes, unless user edited it manually
  const handleNameChange = (val: string) => {
    setName(val);
    if (!slugManuallyEdited) {
      const generated = val
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/--+/g, '-')
        .trim();
      setSlug(generated);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMsg('Please enter a collection name.');
      return;
    }

    setErrorMsg('');
    startTransition(async () => {
      const res = await createCollectionAction({
        name,
        slug,
        description,
        bannerUrl,
      });

      if (res.success) {
        router.push('/admin/collections');
        router.refresh();
      } else {
        setErrorMsg(res.error || 'Failed to create collection.');
      }
    });
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-16">
      {/* Top Breadcrumb */}
      <div>
        <Link
          href="/admin/collections"
          className="inline-flex items-center text-xs uppercase tracking-wider text-text-muted hover:text-burgundy font-medium transition-colors"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Back to Collections
        </Link>
      </div>

      {/* Header */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#DFD7C9] shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-cream-alt text-burgundy flex items-center justify-center">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl font-heading font-semibold text-text-dark">Create New Collection</h1>
            <p className="text-xs text-text-muted mt-0.5">
              Add a curated lineage or thematic collection with its own dedicated page.
            </p>
          </div>
        </div>
      </div>

      {/* Form Card */}
      <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-2xl border border-[#DFD7C9] shadow-xs space-y-6">
        {errorMsg && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 font-medium">
            {errorMsg}
          </div>
        )}

        {/* Collection Name */}
        <div className="space-y-1.5">
          <label className="block text-xs uppercase tracking-wider font-semibold text-text-dark">
            Collection Name <span className="text-burgundy">*</span>
          </label>
          <input
            type="text"
            required
            placeholder="e.g. Kashmir Imperial, Royal Bokhara, Silk & Loom"
            value={name}
            onChange={(e) => handleNameChange(e.target.value)}
            className="w-full px-4 py-2.5 bg-ivory/50 border border-[#DFD7C9] rounded-xl text-sm text-text-dark placeholder:text-text-muted/70 focus:outline-none focus:border-burgundy focus:ring-2 focus:ring-burgundy/10"
          />
        </div>

        {/* URL Slug */}
        <div className="space-y-1.5">
          <label className="block text-xs uppercase tracking-wider font-semibold text-text-dark">
            URL Slug
          </label>
          <div className="flex items-center">
            <span className="bg-ivory border border-r-0 border-[#DFD7C9] px-3.5 py-2.5 rounded-l-xl text-xs text-text-muted font-mono select-none">
              /collections/
            </span>
            <input
              type="text"
              required
              placeholder="kashmir-imperial"
              value={slug}
              onChange={(e) => {
                setSlugManuallyEdited(true);
                setSlug(e.target.value.toLowerCase().replace(/\s+/g, '-'));
              }}
              className="flex-1 px-4 py-2.5 bg-ivory/50 border border-[#DFD7C9] rounded-r-xl text-sm text-text-dark font-mono placeholder:text-text-muted/70 focus:outline-none focus:border-burgundy focus:ring-2 focus:ring-burgundy/10"
            />
          </div>
          <p className="text-[11px] text-text-muted">
            The collection will be available at <span className="font-mono text-burgundy">/collections/{slug || 'your-slug'}</span>
          </p>
        </div>

        {/* Description */}
        <div className="space-y-1.5">
          <label className="block text-xs uppercase tracking-wider font-semibold text-text-dark">
            Curatorial Story & Description
          </label>
          <textarea
            rows={4}
            placeholder="Describe the weaving technique, region of origin, wool & silk blend, or interior styling notes..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-2.5 bg-ivory/50 border border-[#DFD7C9] rounded-xl text-sm text-text-dark placeholder:text-text-muted/70 focus:outline-none focus:border-burgundy focus:ring-2 focus:ring-burgundy/10"
          />
        </div>

        {/* Banner Image */}
        <div className="space-y-3 pt-2 border-t border-[#F0EAE1]">
          <div>
            <label className="block text-xs uppercase tracking-wider font-semibold text-text-dark">
              Collection Banner Image
            </label>
            <p className="text-[11px] text-text-muted mt-0.5">
              Upload via Cloudinary, paste an image URL, or choose from Naqash presets below.
            </p>
          </div>

          <CloudinaryUploadWidget
            multiple={false}
            compact={true}
            onUploadSuccess={(url) => setBannerUrl(url)}
          />

          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Or paste direct image URL (https://... or /rugs/...)"
              value={bannerUrl}
              onChange={(e) => setBannerUrl(e.target.value)}
              className="flex-1 px-4 py-2 bg-ivory/50 border border-[#DFD7C9] rounded-xl text-xs text-text-dark placeholder:text-text-muted/70 focus:outline-none focus:border-burgundy"
            />
            {bannerUrl && (
              <button
                type="button"
                onClick={() => setBannerUrl('')}
                className="px-3 py-2 text-xs text-text-muted hover:text-red-600 cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>

          {/* Quick Presets */}
          <div>
            <p className="text-[11px] uppercase tracking-wider text-text-muted font-medium mb-2 flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-gold" /> Quick Gallery Presets:
            </p>
            <div className="flex flex-wrap gap-2">
              {SUGGESTED_BANNER_PRESETS.map((p) => (
                <button
                  key={p.url}
                  type="button"
                  onClick={() => setBannerUrl(p.url)}
                  className={`text-xs px-3 py-1.5 rounded-lg border transition-colors cursor-pointer ${
                    bannerUrl === p.url
                      ? 'bg-burgundy text-white border-burgundy'
                      : 'bg-cream-alt/70 text-text-dark border-[#DFD7C9] hover:border-burgundy'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Banner Live Preview */}
          <div className="mt-4">
            <p className="text-xs uppercase tracking-wider text-text-muted font-medium mb-2">Banner Preview</p>
            <div className="relative w-full h-52 rounded-2xl overflow-hidden bg-ivory border border-[#DFD7C9] shadow-inner flex items-center justify-center">
              {bannerUrl ? (
                <Image
                  src={bannerUrl}
                  alt="Collection Preview"
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex flex-col items-center text-text-muted/60">
                  <ImageIcon className="w-8 h-8 mb-2" />
                  <span className="text-xs">No banner image selected</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Submit Actions */}
        <div className="flex items-center justify-end gap-3 pt-6 border-t border-[#F0EAE1]">
          <Link href="/admin/collections">
            <Button type="button" variant="outline" className="rounded-full px-5 py-2.5 text-xs uppercase tracking-wider">
              Cancel
            </Button>
          </Link>
          <Button
            type="submit"
            disabled={isPending}
            className="bg-burgundy hover:bg-burgundy-deep text-white rounded-full px-7 py-2.5 text-xs uppercase tracking-wider shadow-xs cursor-pointer"
          >
            {isPending ? 'Publishing Collection...' : 'Publish Collection'}
          </Button>
        </div>
      </form>
    </div>
  );
}
