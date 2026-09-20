'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
import Link from 'next/link';
import { ProductCard } from '@/components/ui/ProductCard';
import { Search, X, ChevronDown, Check, Tag, ArrowRight, PackageOpen } from 'lucide-react';
import type { ShopProduct } from '@/lib/shopData';

const SORT_OPTIONS = [
  { value: 'discount-desc', label: 'Biggest Discount %' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'newest', label: 'Newest Arrivals' },
] as const;

type SaleSortOption = (typeof SORT_OPTIONS)[number]['value'];

interface SaleClientProps {
  initialProducts: ShopProduct[];
}

export function SaleClient({ initialProducts }: SaleClientProps) {
  const [search, setSearch] = useState('');
  const [selectedCollection, setSelectedCollection] = useState<string>('all');
  const [sort, setSort] = useState<SaleSortOption>('discount-desc');
  const [sortOpen, setSortOpen] = useState(false);
  const sortRef = useRef<HTMLDivElement>(null);

  // Close sort dropdown when clicking outside or pressing Escape
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (sortRef.current && !sortRef.current.contains(e.target as Node)) {
        setSortOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSortOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Compute available collections for quick filter chips
  const collections = useMemo(() => {
    const set = new Set(initialProducts.map((p) => p.collection).filter(Boolean));
    return ['all', ...Array.from(set)];
  }, [initialProducts]);

  // Compute maximum discount percentage
  const maxDiscount = useMemo(() => {
    if (initialProducts.length === 0) return 0;
    const discounts = initialProducts.map((p) => {
      if (p.salePrice != null && p.salePrice < p.basePrice) {
        return Math.round(((p.basePrice - p.salePrice) / p.basePrice) * 100);
      }
      return 0;
    });
    return Math.max(...discounts, 0);
  }, [initialProducts]);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let list = initialProducts.filter((product) => {
      // Search
      const matchesSearch =
        search === '' ||
        product.title.toLowerCase().includes(search.toLowerCase()) ||
        product.collection.toLowerCase().includes(search.toLowerCase()) ||
        product.materials.some((m) => m.toLowerCase().includes(search.toLowerCase()));

      // Collection
      const matchesCollection =
        selectedCollection === 'all' || product.collection === selectedCollection;

      return matchesSearch && matchesCollection;
    });

    // Sorting
    list = [...list].sort((a, b) => {
      const aPrice = a.salePrice ?? a.basePrice;
      const bPrice = b.salePrice ?? b.basePrice;
      const aDiscount = a.salePrice ? Math.round(((a.basePrice - a.salePrice) / a.basePrice) * 100) : 0;
      const bDiscount = b.salePrice ? Math.round(((b.basePrice - b.salePrice) / b.basePrice) * 100) : 0;

      switch (sort) {
        case 'discount-desc':
          return bDiscount - aDiscount || aPrice - bPrice;
        case 'price-asc':
          return aPrice - bPrice;
        case 'price-desc':
          return bPrice - aPrice;
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        default:
          return 0;
      }
    });

    return list;
  }, [initialProducts, search, selectedCollection, sort]);

  const currentSortLabel = SORT_OPTIONS.find((o) => o.value === sort)?.label || 'Biggest Discount %';

  return (
    <div className="min-h-screen bg-ivory pb-28 pt-24 md:pt-32">
      {/* Hero Showcase Banner */}
      <section className="relative px-4 md:px-8 max-w-7xl mx-auto mb-12">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-b from-cream-alt/90 via-ivory to-cream-alt/40 border border-[#DFD7C9] py-14 sm:py-20 px-6 sm:px-12 text-center shadow-xs">
          {/* Subtle Ambient Amber Glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-gold/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl mx-auto">
            {/* Ornamental Palmette Crest */}
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-8 md:w-12 h-px bg-gold/50" />
              <svg
                width="28"
                height="28"
                viewBox="0 0 40 40"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-burgundy opacity-90"
              >
                <path
                  d="M20 3C20 3 13 11 13 18C13 23 16 27 20 27C24 27 27 23 27 18C27 11 20 3 20 3Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M20 27V37M15 33C15 33 17 31 20 31C23 31 25 33 25 33"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
                <path
                  d="M10 21C8 18 8 13 12 9"
                  stroke="currentColor"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                />
                <path
                  d="M30 21C32 18 32 13 28 9"
                  stroke="currentColor"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                />
              </svg>
              <div className="w-8 md:w-12 h-px bg-gold/50" />
            </div>

            {/* Eyebrow */}
            <span className="text-[11px] md:text-xs font-semibold uppercase tracking-[0.25em] text-burgundy block mb-2">
              Limited Curation • Archive Pricing
            </span>

            {/* Title */}
            <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl font-medium text-text-dark tracking-tight mb-4">
              The Heritage Archive Sale
            </h1>

            {/* Subtitle */}
            <p className="text-text-muted text-sm sm:text-base md:text-lg font-light leading-relaxed max-w-2xl mx-auto">
              Acquire rare master-woven Persian, Bokhara, and contemporary collector rugs at exceptional archive pricing. Each piece is hand-knotted, one-of-a-kind, and ready for worldwide delivery.
            </p>

            {/* Micro Strip Stats */}
            <div className="inline-flex items-center gap-3 mt-6 px-5 py-2 rounded-full bg-white/90 border border-[#DFD7C9] text-xs uppercase tracking-wider text-text-muted shadow-xs">
              <span className="text-burgundy font-bold">
                {initialProducts.length} Piece{initialProducts.length !== 1 ? 's' : ''} On Sale
              </span>
              {maxDiscount > 0 && (
                <>
                  <span className="w-1 h-1 rounded-full bg-gold" />
                  <span className="text-emerald-800 font-semibold">Up to {maxDiscount}% Off</span>
                </>
              )}
              <span className="w-1 h-1 rounded-full bg-gold hidden sm:inline-block" />
              <span className="hidden sm:inline-block">Authenticity Guaranteed</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Container */}
      <section className="container max-w-7xl mx-auto px-4 md:px-8 space-y-8">
        {/* Controls Toolbar: Search, Collection Chips, Sort Dropdown */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 bg-white p-4 sm:p-5 rounded-2xl border border-[#DFD7C9] shadow-xs">
          {/* Search Box */}
          <div className="relative w-full lg:w-72">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
            <input
              type="text"
              placeholder="Search sale rugs..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-9 py-2 bg-ivory/50 border border-[#DFD7C9] rounded-full text-xs uppercase tracking-wider text-text-dark placeholder:text-text-muted/70 focus:outline-none focus:border-burgundy"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-dark cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Quick Collection Filter Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
            {collections.map((col) => {
              const isSelected = selectedCollection === col;
              const label = col === 'all' ? 'All Sale Rugs' : col;
              return (
                <button
                  key={col}
                  type="button"
                  onClick={() => setSelectedCollection(col)}
                  className={`px-4 py-1.5 rounded-full text-xs uppercase tracking-wider font-medium whitespace-nowrap transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-burgundy text-white shadow-xs'
                      : 'bg-cream-alt/50 text-text-dark hover:bg-cream-alt border border-[#DFD7C9]'
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>

          {/* Custom Modern Luxury Sort Dropdown */}
          <div className="relative shrink-0 flex items-center justify-end" ref={sortRef}>
            <button
              type="button"
              onClick={() => setSortOpen((prev) => !prev)}
              aria-haspopup="listbox"
              aria-expanded={sortOpen}
              className="group flex items-center justify-between gap-2.5 px-4 py-2 bg-white border border-[#DFD7C9] hover:border-burgundy/60 rounded-full text-xs uppercase tracking-wider font-medium text-text-dark transition-all duration-200 shadow-xs cursor-pointer"
            >
              <span>{currentSortLabel}</span>
              <ChevronDown
                className={`w-3.5 h-3.5 text-text-muted transition-transform duration-200 group-hover:text-burgundy ${
                  sortOpen ? 'rotate-180 text-burgundy' : ''
                }`}
              />
            </button>

            {sortOpen && (
              <div
                role="listbox"
                aria-label="Sort sale options"
                className="absolute right-0 top-full mt-2 w-56 bg-white border border-[#DFD7C9] rounded-2xl shadow-xl shadow-stone-900/10 py-1.5 z-40 animate-in fade-in zoom-in-95 duration-150 overflow-hidden"
              >
                <div className="px-3.5 py-2 border-b border-[#F0EAE1] mb-1">
                  <span className="text-[10px] uppercase tracking-widest font-semibold text-text-muted/80">
                    Sort Sale Catalog
                  </span>
                </div>
                <div className="p-1 space-y-0.5">
                  {SORT_OPTIONS.map((opt) => {
                    const isSelected = sort === opt.value;
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        role="option"
                        aria-selected={isSelected}
                        onClick={() => {
                          setSort(opt.value);
                          setSortOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 rounded-xl text-xs uppercase tracking-wider font-medium flex items-center justify-between transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-cream-alt text-burgundy font-semibold'
                            : 'text-text-dark hover:bg-cream-alt/60 hover:text-burgundy'
                        }`}
                      >
                        <span>{opt.label}</span>
                        {isSelected && (
                          <Check className="w-3.5 h-3.5 text-burgundy stroke-[2.5] shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Products Grid or Empty State */}
        {filteredProducts.length > 0 ? (
          <div>
            <div className="flex items-center justify-between mb-6">
              <p className="text-xs uppercase tracking-[0.2em] text-text-muted font-medium">
                {filteredProducts.length} Piece{filteredProducts.length !== 1 ? 's' : ''} Available On Sale
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        ) : (
          /* Empty State: If no products are on sale */
          <div className="bg-white border border-[#DFD7C9] rounded-3xl p-10 sm:p-16 max-w-lg mx-auto text-center shadow-xs">
            <div className="w-16 h-16 rounded-full bg-cream-alt text-burgundy mx-auto flex items-center justify-center mb-6 shadow-xs">
              <Tag className="w-7 h-7" />
            </div>
            <h2 className="font-heading text-2xl sm:text-3xl font-medium text-text-dark mb-3">
              No Archive Sale Pieces Available
            </h2>
            <p className="text-text-muted text-sm leading-relaxed font-light mb-8 max-w-sm mx-auto">
              All our handcrafted rugs are currently offered at regular atelier pricing. Explore our full catalog or check back soon for our next seasonal curation.
            </p>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 px-7 py-3 bg-burgundy hover:bg-burgundy-deep text-white rounded-full text-xs uppercase tracking-widest font-medium transition-colors shadow-xs"
            >
              Explore Full Catalog
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}
