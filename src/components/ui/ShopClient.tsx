"use client";

import { useState, useMemo, useCallback, useRef, useEffect } from "react";
import Image from "next/image";
import {
  Search,
  SlidersHorizontal,
  X,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  PackageOpen,
  Check,
} from "lucide-react";
import { ProductCard } from "@/components/ui/ProductCard";
import type { ShopProduct } from "@/lib/shopData";

const PRODUCTS_PER_PAGE = 12;

const SORT_OPTIONS = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "newest", label: "Newest Arrivals" },
] as const;

type SortOption = (typeof SORT_OPTIONS)[number]["value"];

interface Filters {
  sizes: string[];
  colors: string[];
  materials: string[];
  collections: string[];
  priceMin: number;
  priceMax: number;
  search: string;
  sort: SortOption;
}

export function ShopClient({ products }: { products: ShopProduct[] }) {
  const priceRange = useMemo(() => {
    const prices = products.map((product) => product.salePrice ?? product.basePrice);
    return {
      min: prices.length > 0 ? Math.min(...prices) : 0,
      max: prices.length > 0 ? Math.max(...prices) : 0,
    };
  }, [products]);
  const filterOptions = useMemo(() => ({
    sizes: [...new Set(products.flatMap((product) => product.sizes))].sort(),
    colors: [...new Set(products.flatMap((product) => product.colors))].sort(),
    materials: [...new Set(products.flatMap((product) => product.materials))].sort(),
    collections: [...new Set(products.map((product) => product.collection).filter(Boolean))].sort(),
    sortOptions: SORT_OPTIONS,
  }), [products]);
  const defaultFilters = useMemo<Filters>(() => ({
    sizes: [],
    colors: [],
    materials: [],
    collections: [],
    priceMin: priceRange.min,
    priceMax: priceRange.max,
    search: "",
    sort: "featured",
  }), [priceRange]);
  const [filters, setFilters] = useState<Filters>(defaultFilters);
  const [currentPage, setCurrentPage] = useState(1);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);
  const sortDropdownRef = useRef<HTMLDivElement>(null);

  // Close sort dropdown when clicking outside or pressing Escape
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (sortDropdownRef.current && !sortDropdownRef.current.contains(e.target as Node)) {
        setSortDropdownOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSortDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    sizes: false,
    colors: false,
    materials: false,
    collections: false,
    price: false,
  });

  // Toggle filter section expand/collapse
  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  // Toggle individual filter value
  const toggleFilter = useCallback(
    (category: keyof Pick<Filters, "sizes" | "colors" | "materials" | "collections">, value: string) => {
      setFilters((prev) => {
        const current = prev[category];
        const updated = current.includes(value)
          ? current.filter((v) => v !== value)
          : [...current, value];
        return { ...prev, [category]: updated };
      });
      setCurrentPage(1);
    },
    []
  );

  // Set price range
  const setPriceRange = useCallback((min: number, max: number) => {
    setFilters((prev) => ({ ...prev, priceMin: min, priceMax: max }));
    setCurrentPage(1);
  }, []);

  // Set search
  const setSearch = useCallback((search: string) => {
    setFilters((prev) => ({ ...prev, search }));
    setCurrentPage(1);
  }, []);

  // Set sort
  const setSort = useCallback((sort: SortOption) => {
    setFilters((prev) => ({ ...prev, sort }));
    setCurrentPage(1);
  }, []);

  // Clear all filters
  const clearAllFilters = useCallback(() => {
    setFilters(defaultFilters);
    setCurrentPage(1);
  }, [defaultFilters]);

  // Remove single active filter tag
  const removeFilter = useCallback(
    (category: keyof Pick<Filters, "sizes" | "colors" | "materials" | "collections">, value: string) => {
      setFilters((prev) => ({
        ...prev,
        [category]: prev[category].filter((v) => v !== value),
      }));
      setCurrentPage(1);
    },
    []
  );

  // Filter + sort logic
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Search filter
    if (filters.search) {
      const query = filters.search.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query) ||
          p.collection.toLowerCase().includes(query)
      );
    }

    // Size filter
    if (filters.sizes.length > 0) {
      result = result.filter((p) =>
        p.sizes.some((s) => filters.sizes.includes(s))
      );
    }

    // Color filter
    if (filters.colors.length > 0) {
      result = result.filter((p) =>
        p.colors.some((c) => filters.colors.includes(c))
      );
    }

    // Material filter
    if (filters.materials.length > 0) {
      result = result.filter((p) =>
        p.materials.some((m) => filters.materials.includes(m))
      );
    }

    // Collection filter
    if (filters.collections.length > 0) {
      result = result.filter((p) =>
        filters.collections.includes(p.collection)
      );
    }

    // Price filter
    result = result.filter((p) => {
      const price = p.salePrice ?? p.basePrice;
      return price >= filters.priceMin && price <= filters.priceMax;
    });

    // Sort
    switch (filters.sort) {
      case "price-asc":
        result.sort((a, b) => (a.salePrice ?? a.basePrice) - (b.salePrice ?? b.basePrice));
        break;
      case "price-desc":
        result.sort((a, b) => (b.salePrice ?? b.basePrice) - (a.salePrice ?? a.basePrice));
        break;
      case "newest":
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case "featured":
      default:
        result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
        break;
    }

    return result;
  }, [filters, products]);

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * PRODUCTS_PER_PAGE,
    currentPage * PRODUCTS_PER_PAGE
  );

  // Active filter tags
  const activeFilterTags = useMemo(() => {
    const tags: { category: keyof Pick<Filters, "sizes" | "colors" | "materials" | "collections">; value: string }[] = [];
    (["sizes", "colors", "materials", "collections"] as const).forEach((cat) => {
      filters[cat].forEach((val) => tags.push({ category: cat, value: val }));
    });
    return tags;
  }, [filters]);

  const hasActiveFilters =
    activeFilterTags.length > 0 ||
    filters.priceMin > priceRange.min ||
    filters.priceMax < priceRange.max ||
    filters.search !== "";

  // Sidebar filter content (reused in desktop sidebar + mobile drawer)
  const filterContent = (
    <div className="space-y-6">
      {/* Size */}
      <FilterSection
        title="Size"
        expanded={expandedSections.sizes}
        onToggle={() => toggleSection("sizes")}
      >
        <div className="flex flex-wrap gap-2">
          {filterOptions.sizes.map((size) => (
            <button
              key={size}
              onClick={() => toggleFilter("sizes", size)}
              className={`px-3 py-1.5 text-xs rounded-lg border transition-all duration-200 font-medium cursor-pointer ${
                filters.sizes.includes(size)
                  ? "bg-burgundy text-white border-burgundy shadow-xs"
                  : "bg-ivory border-[#DFD7C9] text-text-dark hover:border-burgundy hover:text-burgundy"
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </FilterSection>

      {/* Color */}
      <FilterSection
        title="Color"
        expanded={expandedSections.colors}
        onToggle={() => toggleSection("colors")}
      >
        <div className="space-y-2.5">
          {filterOptions.colors.map((color) => (
            <label
              key={color}
              className="flex items-center gap-3 cursor-pointer group/label"
            >
              <div
                className={`w-4 h-4 rounded border flex items-center justify-center transition-all duration-200 ${
                  filters.colors.includes(color)
                    ? "bg-burgundy border-burgundy text-white shadow-xs"
                    : "border-[#DFD7C9] bg-white group-hover/label:border-burgundy"
                }`}
              >
                {filters.colors.includes(color) && (
                  <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              <input
                type="checkbox"
                className="sr-only"
                checked={filters.colors.includes(color)}
                onChange={() => toggleFilter("colors", color)}
              />
              <span className="text-xs text-text-dark group-hover/label:text-burgundy transition-colors font-light">
                {color}
              </span>
              <span className="ml-auto text-[11px] text-text-muted">
                {products.filter((p) => p.colors.includes(color)).length}
              </span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Material */}
      <FilterSection
        title="Material"
        expanded={expandedSections.materials}
        onToggle={() => toggleSection("materials")}
      >
        <div className="space-y-2.5">
          {filterOptions.materials.map((material) => (
            <label
              key={material}
              className="flex items-center gap-3 cursor-pointer group/label"
            >
              <div
                className={`w-4 h-4 rounded border flex items-center justify-center transition-all duration-200 ${
                  filters.materials.includes(material)
                    ? "bg-burgundy border-burgundy text-white shadow-xs"
                    : "border-[#DFD7C9] bg-white group-hover/label:border-burgundy"
                }`}
              >
                {filters.materials.includes(material) && (
                  <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              <input
                type="checkbox"
                className="sr-only"
                checked={filters.materials.includes(material)}
                onChange={() => toggleFilter("materials", material)}
              />
              <span className="text-xs text-text-dark group-hover/label:text-burgundy transition-colors font-light">
                {material}
              </span>
              <span className="ml-auto text-[11px] text-text-muted">
                {products.filter((p) => p.materials.includes(material)).length}
              </span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Collection */}
      <FilterSection
        title="Collection"
        expanded={expandedSections.collections}
        onToggle={() => toggleSection("collections")}
      >
        <div className="space-y-2.5">
          {filterOptions.collections.map((collection) => (
            <label
              key={collection}
              className="flex items-center gap-3 cursor-pointer group/label"
            >
              <div
                className={`w-4 h-4 rounded border flex items-center justify-center transition-all duration-200 ${
                  filters.collections.includes(collection)
                    ? "bg-burgundy border-burgundy text-white shadow-xs"
                    : "border-[#DFD7C9] bg-white group-hover/label:border-burgundy"
                }`}
              >
                {filters.collections.includes(collection) && (
                  <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              <input
                type="checkbox"
                className="sr-only"
                checked={filters.collections.includes(collection)}
                onChange={() => toggleFilter("collections", collection)}
              />
              <span className="text-xs text-text-dark group-hover/label:text-burgundy transition-colors font-light">
                {collection}
              </span>
              <span className="ml-auto text-[11px] text-text-muted">
                {products.filter((p) => p.collection === collection).length}
              </span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Price Range */}
      <FilterSection
        title="Price Range"
        expanded={expandedSections.price}
        onToggle={() => toggleSection("price")}
      >
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="flex-1">
              <label className="text-[10px] uppercase tracking-wider text-text-muted mb-1 block">Min (PKR)</label>
              <input
                type="number"
                min={priceRange.min}
                max={filters.priceMax}
                step={5000}
                value={filters.priceMin}
                onChange={(e) =>
                  setPriceRange(Number(e.target.value), filters.priceMax)
                }
                className="w-full px-2.5 py-1.5 border border-[#DFD7C9] rounded-lg bg-ivory text-xs text-text-dark focus:outline-none focus:border-burgundy"
              />
            </div>
            <span className="text-text-muted mt-4">—</span>
            <div className="flex-1">
              <label className="text-[10px] uppercase tracking-wider text-text-muted mb-1 block">Max (PKR)</label>
              <input
                type="number"
                min={filters.priceMin}
                max={priceRange.max}
                step={5000}
                value={filters.priceMax}
                onChange={(e) =>
                  setPriceRange(filters.priceMin, Number(e.target.value))
                }
                className="w-full px-2.5 py-1.5 border border-[#DFD7C9] rounded-lg bg-ivory text-xs text-text-dark focus:outline-none focus:border-burgundy"
              />
            </div>
          </div>
          <div className="space-y-2">
            <input
              type="range"
              min={priceRange.min}
              max={priceRange.max}
              step={5000}
              value={filters.priceMin}
              onChange={(e) =>
                setPriceRange(
                  Math.min(Number(e.target.value), filters.priceMax - 5000),
                  filters.priceMax
                )
              }
              className="w-full h-1.5 bg-[#DFD7C9] rounded-full appearance-none cursor-pointer accent-burgundy"
            />
            <input
              type="range"
              min={priceRange.min}
              max={priceRange.max}
              step={5000}
              value={filters.priceMax}
              onChange={(e) =>
                setPriceRange(
                  filters.priceMin,
                  Math.max(Number(e.target.value), filters.priceMin + 5000)
                )
              }
              className="w-full h-1.5 bg-[#DFD7C9] rounded-full appearance-none cursor-pointer accent-burgundy -mt-1.5"
            />
          </div>
          <div className="flex justify-between text-[11px] text-text-muted">
            <span>PKR {filters.priceMin.toLocaleString()}</span>
            <span>PKR {filters.priceMax.toLocaleString()}</span>
          </div>
        </div>
      </FilterSection>

      {/* Clear all */}
      {hasActiveFilters && (
        <button
          onClick={clearAllFilters}
          className="w-full py-2.5 text-xs uppercase tracking-wider text-burgundy font-medium hover:bg-burgundy/10 rounded-full transition-colors flex items-center justify-center gap-2 border border-burgundy/30 cursor-pointer shadow-xs"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Clear All Filters
        </button>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-ivory text-text-dark">
      <div className="container px-4 md:px-8 pt-24 sm:pt-28 pb-20">
        {/* Page Header */}
        <div className="flex flex-col items-center justify-center mb-12 text-center">
          <Image
            src="/collection-crest.svg"
            alt="Naqash Crest"
            width={48}
            height={24}
            className="w-12 h-auto mb-3"
          />
          <span className="text-xs font-semibold tracking-[0.25em] text-burgundy uppercase mb-2">
            Naqash Carpets Gallery
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-heading font-medium text-text-dark tracking-tight mb-3">
            Shop All Rugs
          </h1>
          <p className="text-text-muted text-sm sm:text-base max-w-xl mx-auto font-light leading-relaxed">
            Explore our complete gallery of hand-knotted Persian masterpieces, geometric flat-weaves, and heritage vintage rugs.
          </p>
        </div>

        {/* Toolbar: Search + Sort + Mobile Filter Toggle */}
        <div className="flex flex-col md:flex-row gap-4 mb-8 items-stretch md:items-center">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
            <input
              type="text"
              placeholder="Search by name, pattern, or material..."
              value={filters.search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 border border-[#DFD7C9] rounded-full bg-white text-sm text-text-dark placeholder:text-text-muted/70 focus:outline-none focus:border-burgundy focus:ring-2 focus:ring-burgundy/15 transition-all shadow-xs"
            />
            {filters.search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-dark cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex gap-3 items-center justify-between md:justify-end">
            {/* Results Count */}
            <span className="text-xs uppercase tracking-[0.2em] text-text-muted font-medium whitespace-nowrap hidden sm:block">
              {filteredProducts.length} Piece{filteredProducts.length !== 1 ? "s" : ""} Available
            </span>

            {/* Custom Modern Luxury Sort Dropdown */}
            <div className="relative" ref={sortDropdownRef}>
              <button
                type="button"
                onClick={() => setSortDropdownOpen((prev) => !prev)}
                aria-haspopup="listbox"
                aria-expanded={sortDropdownOpen}
                className="group flex items-center justify-between gap-2.5 px-4 py-2.5 border border-[#DFD7C9] hover:border-burgundy/60 bg-white rounded-full text-xs uppercase tracking-wider font-medium text-text-dark transition-all duration-200 shadow-xs hover:shadow-sm cursor-pointer"
              >
                <span>
                  {filterOptions.sortOptions.find((opt) => opt.value === filters.sort)?.label || "Featured"}
                </span>
                <ChevronDown
                  className={`w-3.5 h-3.5 text-text-muted transition-transform duration-200 group-hover:text-burgundy ${
                    sortDropdownOpen ? "rotate-180 text-burgundy" : ""
                  }`}
                />
              </button>

              {sortDropdownOpen && (
                <div
                  role="listbox"
                  aria-label="Sort rugs"
                  className="absolute right-0 top-full mt-2 w-56 bg-white border border-[#DFD7C9] rounded-2xl shadow-xl shadow-stone-900/10 py-1.5 z-40 animate-in fade-in zoom-in-95 duration-150 overflow-hidden"
                >
                  <div className="px-3.5 py-2 border-b border-[#F0EAE1] mb-1">
                    <span className="text-[10px] uppercase tracking-widest font-semibold text-text-muted/80">
                      Sort Rugs
                    </span>
                  </div>
                  <div className="p-1 space-y-0.5">
                    {filterOptions.sortOptions.map((opt) => {
                      const isSelected = filters.sort === opt.value;
                      return (
                        <button
                          key={opt.value}
                          type="button"
                          role="option"
                          aria-selected={isSelected}
                          onClick={() => {
                            setSort(opt.value);
                            setSortDropdownOpen(false);
                          }}
                          className={`w-full text-left px-3 py-2 rounded-xl text-xs uppercase tracking-wider font-medium flex items-center justify-between transition-colors cursor-pointer ${
                            isSelected
                              ? "bg-cream-alt text-burgundy font-semibold"
                              : "text-text-dark hover:bg-cream-alt/60 hover:text-burgundy"
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

            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setMobileFiltersOpen(true)}
              className="lg:hidden flex items-center gap-2 px-4 py-2.5 border border-[#DFD7C9] bg-white rounded-full text-xs uppercase tracking-wider font-medium text-text-dark hover:border-burgundy transition-colors shadow-xs cursor-pointer"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              Filters
              {activeFilterTags.length > 0 && (
                <span className="bg-burgundy text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                  {activeFilterTags.length}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Active Filter Tags */}
        {activeFilterTags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8 items-center">
            <span className="text-xs uppercase tracking-wider text-text-muted mr-1 font-medium">Filters:</span>
            {activeFilterTags.map(({ category, value }) => (
              <button
                key={`${category}-${value}`}
                onClick={() => removeFilter(category, value)}
                className="inline-flex items-center gap-1.5 px-3 py-1 bg-cream-alt text-burgundy text-xs font-medium rounded-full border border-[#DFD7C9] hover:bg-burgundy hover:text-white transition-colors cursor-pointer"
              >
                {value}
                <X className="w-3 h-3" />
              </button>
            ))}
            <button
              onClick={clearAllFilters}
              className="text-xs text-text-muted hover:text-burgundy transition-colors underline underline-offset-2 ml-2 cursor-pointer font-medium"
            >
              Clear all
            </button>
          </div>
        )}

        {/* Main Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8 xl:gap-10">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block">
            <div className="sticky top-28 bg-white border border-[#DFD7C9] rounded-2xl p-6 shadow-xs">
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#DFD7C9]">
                <h2 className="font-heading font-medium text-base text-text-dark">Filter Rugs</h2>
                {hasActiveFilters && (
                  <button
                    onClick={clearAllFilters}
                    className="text-xs text-burgundy hover:underline cursor-pointer font-medium"
                  >
                    Reset
                  </button>
                )}
              </div>
              {filterContent}
            </div>
          </aside>

          {/* Product Grid */}
          <div>
            {paginatedProducts.length > 0 ? (
              <>
                <div className="grid grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-6">
                  {paginatedProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-16">
                    <button
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="px-4 py-2 border border-[#DFD7C9] bg-white rounded-full text-xs uppercase tracking-wider font-medium text-text-dark hover:border-burgundy hover:text-burgundy disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer shadow-xs"
                    >
                      Previous
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (page) => (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`w-9 h-9 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                            page === currentPage
                              ? "bg-burgundy text-white shadow-xs"
                              : "border border-[#DFD7C9] bg-white text-text-dark hover:border-burgundy hover:text-burgundy"
                          }`}
                        >
                          {page}
                        </button>
                      )
                    )}
                    <button
                      onClick={() =>
                        setCurrentPage((p) => Math.min(totalPages, p + 1))
                      }
                      disabled={currentPage === totalPages}
                      className="px-4 py-2 border border-[#DFD7C9] bg-white rounded-full text-xs uppercase tracking-wider font-medium text-text-dark hover:border-burgundy hover:text-burgundy disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer shadow-xs"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            ) : (
              /* Empty State */
              <div className="flex flex-col items-center justify-center py-20 px-6 text-center bg-white border border-[#DFD7C9] rounded-2xl shadow-xs max-w-lg mx-auto">
                <div className="p-5 rounded-full bg-cream-alt text-burgundy mb-5 shadow-xs">
                  <PackageOpen className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-heading font-medium text-text-dark mb-2">
                  No matching rugs found
                </h3>
                <p className="text-text-muted mb-6 text-sm max-w-xs font-light">
                  Try adjusting your size, color, or price filters to explore other pieces from our gallery.
                </p>
                <button
                  onClick={clearAllFilters}
                  className="inline-flex items-center gap-2 px-7 py-3 bg-burgundy hover:bg-burgundy-deep text-white rounded-full text-xs uppercase tracking-widest font-medium transition-colors shadow-xs cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Reset All Filters
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Filter Drawer */}
        {mobileFiltersOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-black/60 z-50 lg:hidden backdrop-blur-xs"
              onClick={() => setMobileFiltersOpen(false)}
            />
            {/* Drawer */}
            <div className="fixed inset-y-0 left-0 w-[320px] max-w-[85vw] bg-white z-50 lg:hidden shadow-2xl overflow-y-auto animate-in slide-in-from-left duration-300 flex flex-col justify-between">
              <div>
                <div className="sticky top-0 bg-white p-5 border-b border-[#DFD7C9] flex items-center justify-between z-10">
                  <h2 className="font-heading font-medium text-lg text-text-dark">Filter Rugs</h2>
                  <button
                    onClick={() => setMobileFiltersOpen(false)}
                    className="p-2 rounded-full hover:bg-cream-alt transition-colors cursor-pointer"
                  >
                    <X className="w-5 h-5 text-text-dark" />
                  </button>
                </div>
                <div className="p-5">
                  {filterContent}
                </div>
              </div>
              <div className="p-5 border-t border-[#DFD7C9] bg-ivory">
                <button
                  onClick={() => setMobileFiltersOpen(false)}
                  className="w-full py-3 bg-burgundy text-white rounded-full text-xs uppercase tracking-widest font-medium shadow-xs"
                >
                  Apply Filters ({filteredProducts.length})
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/* ── Reusable Filter Section ─────────────────────────────── */

function FilterSection({
  title,
  expanded,
  onToggle,
  children,
}: {
  title: string;
  expanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="border-b border-[#DFD7C9] pb-5 mb-5 last:border-0 last:pb-0 last:mb-0">
      <button
        onClick={onToggle}
        className="flex items-center justify-between w-full mb-3.5 group cursor-pointer"
      >
        <h3 className="font-heading font-semibold text-xs uppercase tracking-[0.2em] text-text-dark group-hover:text-burgundy transition-colors">
          {title}
        </h3>
        {expanded ? (
          <ChevronUp className="w-4 h-4 text-text-muted group-hover:text-burgundy transition-colors" />
        ) : (
          <ChevronDown className="w-4 h-4 text-text-muted group-hover:text-burgundy transition-colors" />
        )}
      </button>
      {expanded && <div>{children}</div>}
    </div>
  );
}
