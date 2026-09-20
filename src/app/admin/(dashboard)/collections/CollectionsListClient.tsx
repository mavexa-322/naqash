'use client';

import { useState, useTransition, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Plus, Trash2, ExternalLink, Search, Layers, Image as ImageIcon, Pencil, X } from 'lucide-react';
import { deleteCollectionAction, updateCollectionAction } from './actions';
import { CloudinaryUploadWidget } from '@/components/ui/CloudinaryUploadWidget';
import type { CatalogCollection } from '@/lib/catalog';

interface CollectionsListClientProps {
  initialCollections: CatalogCollection[];
}

export function CollectionsListClient({ initialCollections }: CollectionsListClientProps) {
  const [collections, setCollections] = useState<CatalogCollection[]>(initialCollections);
  const [search, setSearch] = useState('');
  const [isPending, startTransition] = useTransition();

  // Edit Collection state
  const [editingCollection, setEditingCollection] = useState<CatalogCollection | null>(null);
  const [editName, setEditName] = useState('');
  const [editSlug, setEditSlug] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editBannerUrl, setEditBannerUrl] = useState('');
  const [editError, setEditError] = useState('');

  // Close modal on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setEditingCollection(null);
      }
    };
    if (editingCollection) {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [editingCollection]);

  const openEditModal = (collection: CatalogCollection) => {
    setEditingCollection(collection);
    setEditName(collection.name);
    setEditSlug(collection.slug);
    setEditDescription(collection.description || '');
    setEditBannerUrl(collection.image || '');
    setEditError('');
  };

  const handleSaveEdit = () => {
    if (!editingCollection) return;
    if (!editName.trim()) {
      setEditError('Collection name is required.');
      return;
    }

    startTransition(async () => {
      const res = await updateCollectionAction(editingCollection.id, {
        name: editName.trim(),
        slug: editSlug.trim() || undefined,
        description: editDescription.trim() || null as any,
        bannerUrl: editBannerUrl.trim() || null as any,
      });

      if (!res.success) {
        setEditError(res.error || 'Failed to update collection.');
        return;
      }

      setCollections((prev) =>
        prev.map((c) =>
          c.id === editingCollection.id
            ? {
                ...c,
                name: editName.trim(),
                slug: editSlug.trim() || c.slug,
                description: editDescription.trim() || null,
                image: editBannerUrl.trim() || null,
              }
            : c
        )
      );

      setEditingCollection(null);
    });
  };

  const handleDelete = (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete the collection "${name}"?`)) return;

    // Optimistically remove from state
    setCollections((prev) => prev.filter((c) => c.id !== id));

    startTransition(async () => {
      const res = await deleteCollectionAction(id);
      if (!res.success) {
        alert('Failed to delete collection: ' + res.error);
        // Refresh page if error
        window.location.reload();
      }
    });
  };

  const filtered = collections.filter((c) => {
    const q = search.toLowerCase();
    return c.name.toLowerCase().includes(q) || c.slug.toLowerCase().includes(q);
  });

  const totalRugs = collections.reduce((acc, c) => acc + (c.productCount || 0), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-[#DFD7C9] shadow-xs">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-heading font-semibold text-text-dark">Collections</h1>
            <span className="bg-cream-alt text-burgundy font-medium text-xs px-3 py-1 rounded-full border border-[#DFD7C9]">
              {collections.length} Total
            </span>
          </div>
          <p className="text-text-muted text-sm mt-1">
            Curate and manage rug collections shown across the Naqash gallery.
          </p>
        </div>

        <Link href="/admin/collections/new">
          <Button className="bg-burgundy hover:bg-burgundy-deep text-white gap-2 rounded-full px-5 py-2.5 shadow-xs cursor-pointer">
            <Plus className="w-4 h-4" />
            Add New Collection
          </Button>
        </Link>
      </div>

      {/* Metrics Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-[#DFD7C9] shadow-xs">
          <p className="text-xs uppercase tracking-wider text-text-muted font-medium">Published Collections</p>
          <p className="text-3xl font-heading font-semibold text-text-dark mt-2">{collections.length}</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-[#DFD7C9] shadow-xs">
          <p className="text-xs uppercase tracking-wider text-text-muted font-medium">Rugs Assigned</p>
          <p className="text-3xl font-heading font-semibold text-text-dark mt-2">{totalRugs}</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-[#DFD7C9] shadow-xs">
          <p className="text-xs uppercase tracking-wider text-text-muted font-medium">Public Gallery</p>
          <Link
            href="/collections"
            target="_blank"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-burgundy hover:underline mt-3"
          >
            View /collections
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-[#DFD7C9] shadow-xs">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input
            type="text"
            placeholder="Search collections by name or slug..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-ivory/50 border border-[#DFD7C9] rounded-xl text-sm text-text-dark placeholder:text-text-muted focus:outline-none focus:border-burgundy"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-[#DFD7C9] rounded-2xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-ivory border-b border-[#DFD7C9] text-[11px] uppercase tracking-wider text-text-muted font-semibold">
                <th className="p-4 w-24">Banner</th>
                <th className="p-4">Collection Details</th>
                <th className="p-4">Slug / URL</th>
                <th className="p-4 text-center">Rugs Count</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0EAE1]">
              {filtered.length > 0 ? (
                filtered.map((collection) => (
                  <tr key={collection.id} className="hover:bg-ivory/40 transition-colors group">
                    {/* Banner Thumbnail */}
                    <td className="p-4">
                      <div className="relative w-20 h-14 rounded-xl overflow-hidden bg-cream-alt border border-[#DFD7C9] shrink-0">
                        {collection.image ? (
                          <Image
                            src={collection.image}
                            alt={collection.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-text-muted">
                            <ImageIcon className="w-5 h-5 opacity-40" />
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Title & Description */}
                    <td className="p-4">
                      <div className="font-heading font-medium text-base text-text-dark group-hover:text-burgundy transition-colors">
                        {collection.name}
                      </div>
                      <p className="text-xs text-text-muted mt-0.5 line-clamp-1 max-w-md">
                        {collection.description || 'No description provided.'}
                      </p>
                    </td>

                    {/* Slug */}
                    <td className="p-4">
                      <Link
                        href={`/collections/${collection.slug}`}
                        target="_blank"
                        className="inline-flex items-center gap-1.5 font-mono text-xs text-burgundy hover:underline bg-cream-alt/70 px-2.5 py-1 rounded-md border border-[#DFD7C9]"
                      >
                        /{collection.slug}
                        <ExternalLink className="w-3 h-3 shrink-0" />
                      </Link>
                    </td>

                    {/* Rug Count */}
                    <td className="p-4 text-center">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-cream-alt text-text-dark">
                        {collection.productCount} {collection.productCount === 1 ? 'Rug' : 'Rugs'}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="p-4 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => openEditModal(collection)}
                          className="p-2 text-text-muted hover:text-burgundy hover:bg-cream-alt rounded-lg transition-colors cursor-pointer"
                          title="Edit Collection"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <Link
                          href={`/collections/${collection.slug}`}
                          target="_blank"
                          className="p-2 text-text-muted hover:text-burgundy hover:bg-cream-alt rounded-lg transition-colors cursor-pointer"
                          title="View Collection Page"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(collection.id, collection.name)}
                          disabled={isPending}
                          className="p-2 text-text-muted hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                          title="Delete Collection"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="p-12 text-center">
                    <div className="max-w-md mx-auto flex flex-col items-center">
                      <div className="w-12 h-12 rounded-full bg-cream-alt flex items-center justify-center text-burgundy mb-3">
                        <Layers className="w-6 h-6" />
                      </div>
                      <h3 className="font-heading text-lg font-medium text-text-dark">
                        {search ? 'No matching collections' : 'No collections found'}
                      </h3>
                      <p className="text-sm text-text-muted mt-1 mb-6 font-light">
                        {search ? 'Try clearing your search query.' : 'Get started by creating a new curated rug collection.'}
                      </p>
                      {!search && (
                        <Link href="/admin/collections/new">
                          <Button className="bg-burgundy hover:bg-burgundy-deep text-white text-xs rounded-full gap-2 px-5 py-2">
                            <Plus className="w-3.5 h-3.5" />
                            Create Your First Collection
                          </Button>
                        </Link>
                      )}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Collection Modal */}
      {editingCollection && (
        <div 
          className="fixed inset-0 z-50 flex items-start sm:items-center justify-center p-3 sm:p-4 md:p-6 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200 overflow-y-auto"
          onClick={(e) => {
            if (e.target === e.currentTarget) setEditingCollection(null);
          }}
        >
          <div 
            className="bg-white border border-[#DFD7C9] rounded-2xl sm:rounded-3xl max-w-lg w-full shadow-2xl flex flex-col max-h-[calc(100vh-1.5rem)] sm:max-h-[88vh] my-auto overflow-hidden animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Sticky Modal Header */}
            <div className="flex items-start justify-between px-6 py-4 sm:px-8 sm:py-5 border-b border-[#F0EAE1] bg-white sticky top-0 z-20 shrink-0">
              <div>
                <span className="text-[10px] uppercase tracking-widest font-semibold text-burgundy block mb-0.5">
                  Atelier Collection Management
                </span>
                <h3 className="font-heading text-lg sm:text-xl font-semibold text-text-dark">
                  Edit Collection: {editingCollection.name}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setEditingCollection(null)}
                className="p-2 -mr-2 -mt-1 rounded-xl text-text-muted hover:text-text-dark hover:bg-cream-alt transition-colors cursor-pointer"
                title="Close modal (Esc)"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Modal Body */}
            <div className="p-6 sm:p-8 space-y-4 overflow-y-auto flex-1 text-left">
              {editError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700">
                  {editError}
                </div>
              )}

              <div className="space-y-1">
                <label className="block text-xs uppercase tracking-wider font-semibold text-text-dark">
                  Collection Name <span className="text-burgundy">*</span>
                </label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-ivory/50 border border-[#DFD7C9] rounded-xl text-sm font-medium text-text-dark focus:outline-none focus:border-burgundy"
                  placeholder="e.g. Bokhara Royal"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs uppercase tracking-wider font-semibold text-text-dark">
                  URL Slug
                </label>
                <input
                  type="text"
                  value={editSlug}
                  onChange={(e) => setEditSlug(e.target.value)}
                  className="w-full px-4 py-2.5 bg-ivory/50 border border-[#DFD7C9] rounded-xl text-xs font-mono text-text-dark focus:outline-none focus:border-burgundy"
                  placeholder="e.g. bokhara-royal"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs uppercase tracking-wider font-semibold text-text-dark">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="w-full px-4 py-2.5 bg-ivory/50 border border-[#DFD7C9] rounded-xl text-xs text-text-dark focus:outline-none focus:border-burgundy"
                  placeholder="Describe the weaving heritage and motifs of this collection..."
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs uppercase tracking-wider font-semibold text-text-dark">
                  Banner Image (Cloudinary)
                </label>
                <CloudinaryUploadWidget
                  multiple={false}
                  compact={true}
                  onUploadSuccess={(url) => setEditBannerUrl(url)}
                />
                <input
                  type="text"
                  value={editBannerUrl}
                  onChange={(e) => setEditBannerUrl(e.target.value)}
                  className="w-full px-4 py-2 bg-ivory/50 border border-[#DFD7C9] rounded-xl text-xs text-text-dark focus:outline-none focus:border-burgundy"
                  placeholder="Or direct image URL / Cloudinary URL"
                />
              </div>
            </div>

            {/* Sticky Modal Footer */}
            <div className="flex items-center justify-end gap-3 px-6 py-3.5 sm:px-8 sm:py-4 border-t border-[#F0EAE1] bg-white/95 backdrop-blur-xs sticky bottom-0 z-20 shrink-0">
              <Button
                type="button"
                variant="outline"
                onClick={() => setEditingCollection(null)}
                className="rounded-full px-5 text-xs uppercase tracking-wider cursor-pointer"
              >
                Cancel
              </Button>
              <Button
                type="button"
                disabled={isPending}
                onClick={handleSaveEdit}
                className="bg-burgundy hover:bg-burgundy-deep text-white rounded-full px-6 text-xs uppercase tracking-wider shadow-xs cursor-pointer"
              >
                {isPending ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
