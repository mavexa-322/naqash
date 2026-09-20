'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Plus, Trash2, ExternalLink, Search, Layers, Image as ImageIcon } from 'lucide-react';
import { deleteCollectionAction } from './actions';
import type { CatalogCollection } from '@/lib/catalog';

interface CollectionsListClientProps {
  initialCollections: CatalogCollection[];
}

export function CollectionsListClient({ initialCollections }: CollectionsListClientProps) {
  const [collections, setCollections] = useState<CatalogCollection[]>(initialCollections);
  const [search, setSearch] = useState('');
  const [isPending, startTransition] = useTransition();

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
                      <div className="inline-flex items-center gap-2">
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
                      <p className="text-xs text-text-muted mt-1 mb-4">
                        {search
                          ? `No collection matched "${search}". Try searching for another term.`
                          : 'You currently have zero collections configured in the gallery.'}
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
    </div>
  );
}
