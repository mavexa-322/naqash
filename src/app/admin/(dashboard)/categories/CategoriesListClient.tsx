'use client';

import { useState, useTransition, useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Plus, Trash2, Search, Tag, Image as ImageIcon, Pencil, X } from 'lucide-react';
import { createCategoryAction, updateCategoryAction, deleteCategoryAction } from './actions';
import { CloudinaryUploadWidget } from '@/components/ui/CloudinaryUploadWidget';
import type { StoredCategory } from '@/lib/categoriesStorage';

interface CategoriesListClientProps {
  initialCategories: StoredCategory[];
}

export function CategoriesListClient({ initialCategories }: CategoriesListClientProps) {
  const [categories, setCategories] = useState<StoredCategory[]>(initialCategories);
  const [search, setSearch] = useState('');
  const [isPending, startTransition] = useTransition();

  // Create Category Modal state
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [createName, setCreateName] = useState('');
  const [createSlug, setCreateSlug] = useState('');
  const [createDescription, setCreateDescription] = useState('');
  const [createImageUrl, setCreateImageUrl] = useState('');
  const [createError, setCreateError] = useState('');

  // Edit Category Modal state
  const [editingCategory, setEditingCategory] = useState<StoredCategory | null>(null);
  const [editName, setEditName] = useState('');
  const [editSlug, setEditSlug] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editImageUrl, setEditImageUrl] = useState('');
  const [editError, setEditError] = useState('');

  // Close modals on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsCreateOpen(false);
        setEditingCategory(null);
      }
    };
    if (isCreateOpen || editingCategory) {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [isCreateOpen, editingCategory]);

  const openEditModal = (cat: StoredCategory) => {
    setEditingCategory(cat);
    setEditName(cat.name);
    setEditSlug(cat.slug);
    setEditDescription(cat.description || '');
    setEditImageUrl(cat.image_url || '');
    setEditError('');
  };

  const handleCreateCategory = () => {
    if (!createName.trim()) {
      setCreateError('Category name is required.');
      return;
    }

    startTransition(async () => {
      const res = await createCategoryAction({
        name: createName.trim(),
        slug: createSlug.trim() || undefined,
        description: createDescription.trim() || undefined,
        imageUrl: createImageUrl.trim() || undefined,
      });

      if (!res.success || !res.category) {
        setCreateError(res.error || 'Failed to create category.');
        return;
      }

      setCategories((prev) => [...prev, res.category!]);
      setIsCreateOpen(false);
      setCreateName('');
      setCreateSlug('');
      setCreateDescription('');
      setCreateImageUrl('');
      setCreateError('');
    });
  };

  const handleSaveEdit = () => {
    if (!editingCategory) return;
    if (!editName.trim()) {
      setEditError('Category name is required.');
      return;
    }

    startTransition(async () => {
      const res = await updateCategoryAction(editingCategory.id, {
        name: editName.trim(),
        slug: editSlug.trim() || undefined,
        description: editDescription.trim() || null as any,
        imageUrl: editImageUrl.trim() || null as any,
      });

      if (!res.success || !res.category) {
        setEditError(res.error || 'Failed to update category.');
        return;
      }

      setCategories((prev) =>
        prev.map((c) => (c.id === editingCategory.id ? res.category! : c))
      );

      setEditingCategory(null);
    });
  };

  const handleDelete = (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete the category "${name}"?`)) return;

    setCategories((prev) => prev.filter((c) => c.id !== id));

    startTransition(async () => {
      const res = await deleteCategoryAction(id);
      if (!res.success) {
        alert('Failed to delete category: ' + res.error);
        window.location.reload();
      }
    });
  };

  const filtered = categories.filter((c) => {
    const q = search.toLowerCase();
    return c.name.toLowerCase().includes(q) || c.slug.toLowerCase().includes(q);
  });

  return (
    <div className="space-y-6 text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <span className="text-xs uppercase tracking-widest text-burgundy font-semibold">
            Naqash Taxonomy
          </span>
          <h1 className="font-heading text-3xl font-semibold text-text-dark mt-1">
            Categories Directory
          </h1>
          <p className="text-text-muted text-sm mt-1">
            Manage rug taxonomy, aesthetic styles, and shop classifications.
          </p>
        </div>

        <Button
          onClick={() => setIsCreateOpen(true)}
          className="bg-burgundy hover:bg-burgundy-deep text-white rounded-full px-5 h-11 text-xs uppercase tracking-wider font-semibold shadow-xs flex items-center gap-2 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Add Category
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-[#FDFBF7] p-5 rounded-2xl border border-[#DFD7C9] flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-burgundy/10 flex items-center justify-center text-burgundy shrink-0">
            <Tag className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs uppercase tracking-wider text-text-muted font-medium">
              Total Categories
            </span>
            <p className="font-heading text-2xl font-bold text-text-dark mt-0.5">
              {categories.length}
            </p>
          </div>
        </div>

        <div className="bg-[#FDFBF7] p-5 rounded-2xl border border-[#DFD7C9] flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#C9A15C]/15 flex items-center justify-center text-[#997328] shrink-0">
            <ImageIcon className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs uppercase tracking-wider text-text-muted font-medium">
              Illustrated Categories
            </span>
            <p className="font-heading text-2xl font-bold text-text-dark mt-0.5">
              {categories.filter((c) => Boolean(c.image_url)).length}
            </p>
          </div>
        </div>
      </div>

      {/* Search Filter */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search categories by name or slug..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-[#FDFBF7] border border-[#DFD7C9] rounded-xl text-sm text-text-dark placeholder:text-text-muted focus:outline-none focus:border-burgundy"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-[#FDFBF7] border border-[#DFD7C9] rounded-2xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#F7F3EB] border-b border-[#DFD7C9] text-xs uppercase tracking-wider text-text-muted">
              <tr>
                <th className="p-4 font-semibold w-24">Image</th>
                <th className="p-4 font-semibold">Category Details</th>
                <th className="p-4 font-semibold">URL Slug</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0EAE1]">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-12 text-center text-text-muted">
                    <p className="font-medium text-base text-text-dark mb-1">
                      {search ? 'No categories matched your search.' : 'No categories found.'}
                    </p>
                    <p className="text-xs">
                      Click &ldquo;Add Category&rdquo; above to create your first shop category.
                    </p>
                  </td>
                </tr>
              ) : (
                filtered.map((cat) => (
                  <tr key={cat.id} className="hover:bg-cream-alt/40 transition-colors">
                    {/* Image Preview */}
                    <td className="p-4">
                      <div className="w-14 h-14 rounded-xl bg-cream-alt overflow-hidden border border-[#DFD7C9] relative shrink-0">
                        {cat.image_url ? (
                          <Image
                            src={cat.image_url}
                            alt={cat.name}
                            fill
                            className="object-cover"
                            sizes="56px"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-text-muted/50">
                            <Tag className="w-5 h-5" />
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Name & Description */}
                    <td className="p-4">
                      <div className="font-heading font-semibold text-text-dark text-base">
                        {cat.name}
                      </div>
                      {cat.description ? (
                        <p className="text-xs text-text-muted line-clamp-2 max-w-lg mt-0.5">
                          {cat.description}
                        </p>
                      ) : (
                        <span className="text-xs text-text-muted/60 italic">No description provided</span>
                      )}
                    </td>

                    {/* Slug */}
                    <td className="p-4 whitespace-nowrap">
                      <code className="text-xs px-2.5 py-1 rounded-md bg-white border border-[#DFD7C9] text-burgundy font-mono">
                        /{cat.slug}
                      </code>
                    </td>

                    {/* Actions */}
                    <td className="p-4 text-right whitespace-nowrap">
                      <div className="inline-flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => openEditModal(cat)}
                          className="p-2 text-text-muted hover:text-burgundy hover:bg-cream-alt rounded-lg transition-colors cursor-pointer"
                          title="Edit category"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(cat.id, cat.name)}
                          className="p-2 text-text-muted hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                          title="Delete category"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Category Modal */}
      {isCreateOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-start sm:items-center justify-center p-3 sm:p-4 md:p-6 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200 overflow-y-auto"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsCreateOpen(false);
          }}
        >
          <div 
            className="bg-white border border-[#DFD7C9] rounded-2xl sm:rounded-3xl max-w-lg w-full shadow-2xl flex flex-col max-h-[calc(100vh-1.5rem)] sm:max-h-[88vh] my-auto overflow-hidden animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Sticky Header */}
            <div className="flex items-start justify-between px-6 py-4 sm:px-8 sm:py-5 border-b border-[#F0EAE1] bg-white sticky top-0 z-20 shrink-0">
              <div>
                <span className="text-[10px] uppercase tracking-widest font-semibold text-burgundy block mb-0.5">
                  Taxonomy
                </span>
                <h3 className="font-heading text-lg sm:text-xl font-semibold text-text-dark">
                  Add New Category
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsCreateOpen(false)}
                className="p-2 -mr-2 -mt-1 rounded-xl text-text-muted hover:text-text-dark hover:bg-cream-alt transition-colors cursor-pointer"
                title="Close modal (Esc)"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Body */}
            <div className="p-6 sm:p-8 space-y-4 overflow-y-auto flex-1 text-left">
              {createError && (
                <div className="p-3 text-xs bg-red-50 border border-red-200 text-red-700 rounded-xl">
                  {createError}
                </div>
              )}

              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-text-dark mb-1">
                  Category Name *
                </label>
                <input
                  type="text"
                  value={createName}
                  onChange={(e) => {
                    setCreateName(e.target.value);
                    if (!createSlug) {
                      setCreateSlug(
                        e.target.value
                          .toLowerCase()
                          .replace(/[^\w\s-]/g, '')
                          .replace(/\s+/g, '-')
                      );
                    }
                  }}
                  placeholder="e.g. Traditional & Persian"
                  className="w-full px-4 py-2.5 bg-ivory/50 border border-[#DFD7C9] rounded-xl text-sm font-medium text-text-dark focus:outline-none focus:border-burgundy"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-text-dark mb-1">
                  URL Slug
                </label>
                <input
                  type="text"
                  value={createSlug}
                  onChange={(e) => setCreateSlug(e.target.value)}
                  placeholder="e.g. traditional-persian"
                  className="w-full px-4 py-2.5 bg-ivory/50 border border-[#DFD7C9] rounded-xl text-sm font-medium text-text-dark focus:outline-none focus:border-burgundy"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs uppercase tracking-wider font-semibold text-text-dark">
                  Category Image (Cloudinary)
                </label>
                <CloudinaryUploadWidget
                  multiple={false}
                  compact={true}
                  onUploadSuccess={(url) => setCreateImageUrl(url)}
                />
                <input
                  type="text"
                  value={createImageUrl}
                  onChange={(e) => setCreateImageUrl(e.target.value)}
                  placeholder="Or paste direct image URL (e.g. /rugs/persian-heritage.jpg)"
                  className="w-full px-4 py-2 bg-ivory/50 border border-[#DFD7C9] rounded-xl text-xs text-text-dark focus:outline-none focus:border-burgundy"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-text-dark mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={createDescription}
                  onChange={(e) => setCreateDescription(e.target.value)}
                  placeholder="Historical context and style taxonomy..."
                  className="w-full px-4 py-2.5 bg-ivory/50 border border-[#DFD7C9] rounded-xl text-sm font-medium text-text-dark focus:outline-none focus:border-burgundy resize-none"
                />
              </div>
            </div>

            {/* Sticky Footer */}
            <div className="flex items-center justify-end gap-3 px-6 py-3.5 sm:px-8 sm:py-4 border-t border-[#F0EAE1] bg-white/95 backdrop-blur-xs sticky bottom-0 z-20 shrink-0">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsCreateOpen(false)}
                className="rounded-full px-5 text-xs uppercase tracking-wider cursor-pointer"
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleCreateCategory}
                disabled={isPending}
                className="bg-burgundy hover:bg-burgundy-deep text-white rounded-full px-6 text-xs uppercase tracking-wider shadow-xs cursor-pointer"
              >
                {isPending ? 'Creating...' : 'Create Category'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Category Modal */}
      {editingCategory && (
        <div 
          className="fixed inset-0 z-50 flex items-start sm:items-center justify-center p-3 sm:p-4 md:p-6 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200 overflow-y-auto"
          onClick={(e) => {
            if (e.target === e.currentTarget) setEditingCategory(null);
          }}
        >
          <div 
            className="bg-white border border-[#DFD7C9] rounded-2xl sm:rounded-3xl max-w-lg w-full shadow-2xl flex flex-col max-h-[calc(100vh-1.5rem)] sm:max-h-[88vh] my-auto overflow-hidden animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Sticky Header */}
            <div className="flex items-start justify-between px-6 py-4 sm:px-8 sm:py-5 border-b border-[#F0EAE1] bg-white sticky top-0 z-20 shrink-0">
              <div>
                <span className="text-[10px] uppercase tracking-widest font-semibold text-burgundy block mb-0.5">
                  Edit Taxonomy
                </span>
                <h3 className="font-heading text-lg sm:text-xl font-semibold text-text-dark">
                  Edit Category
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setEditingCategory(null)}
                className="p-2 -mr-2 -mt-1 rounded-xl text-text-muted hover:text-text-dark hover:bg-cream-alt transition-colors cursor-pointer"
                title="Close modal (Esc)"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Body */}
            <div className="p-6 sm:p-8 space-y-4 overflow-y-auto flex-1 text-left">
              {editError && (
                <div className="p-3 text-xs bg-red-50 border border-red-200 text-red-700 rounded-xl">
                  {editError}
                </div>
              )}

              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-text-dark mb-1">
                  Category Name *
                </label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-ivory/50 border border-[#DFD7C9] rounded-xl text-sm font-medium text-text-dark focus:outline-none focus:border-burgundy"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-text-dark mb-1">
                  URL Slug
                </label>
                <input
                  type="text"
                  value={editSlug}
                  onChange={(e) => setEditSlug(e.target.value)}
                  className="w-full px-4 py-2.5 bg-ivory/50 border border-[#DFD7C9] rounded-xl text-sm font-medium text-text-dark focus:outline-none focus:border-burgundy"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs uppercase tracking-wider font-semibold text-text-dark">
                  Category Image (Cloudinary)
                </label>
                <CloudinaryUploadWidget
                  multiple={false}
                  compact={true}
                  onUploadSuccess={(url) => setEditImageUrl(url)}
                />
                <input
                  type="text"
                  value={editImageUrl}
                  onChange={(e) => setEditImageUrl(e.target.value)}
                  placeholder="Or paste direct image URL (e.g. /rugs/persian-heritage.jpg)"
                  className="w-full px-4 py-2 bg-ivory/50 border border-[#DFD7C9] rounded-xl text-xs text-text-dark focus:outline-none focus:border-burgundy"
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
                  className="w-full px-4 py-2.5 bg-ivory/50 border border-[#DFD7C9] rounded-xl text-sm font-medium text-text-dark focus:outline-none focus:border-burgundy resize-none"
                />
              </div>
            </div>

            {/* Sticky Footer */}
            <div className="flex items-center justify-end gap-3 px-6 py-3.5 sm:px-8 sm:py-4 border-t border-[#F0EAE1] bg-white/95 backdrop-blur-xs sticky bottom-0 z-20 shrink-0">
              <Button
                type="button"
                variant="outline"
                onClick={() => setEditingCategory(null)}
                className="rounded-full px-5 text-xs uppercase tracking-wider cursor-pointer"
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleSaveEdit}
                disabled={isPending}
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
