import Image from 'next/image';
import Link from 'next/link';
import { getCollections } from '@/lib/catalog';
import { ArrowRight, Layers, Sparkles } from 'lucide-react';

export const metadata = {
  title: 'Our Curated Collections | Naqash Carpets Gallery',
  description: 'Explore our curated collections of authentic hand-knotted and handcrafted heirloom rugs.',
};

export const dynamic = 'force-dynamic';

export default async function CollectionsPage() {
  const collections = await getCollections();

  return (
    <div className="min-h-screen bg-ivory pb-28 pt-24 md:pt-32">
      {/* Hero Section */}
      <section className="relative px-4 md:px-8 max-w-7xl mx-auto mb-12 md:mb-16">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-b from-cream-alt/80 via-ivory to-cream-alt/40 border border-[#DFD7C9] py-16 md:py-24 px-6 md:px-12 text-center shadow-xs">
          {/* Subtle Ambient Glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-gold/10 rounded-full blur-3xl pointer-events-none" />

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
            <span className="text-[11px] md:text-xs font-semibold uppercase tracking-[0.25em] text-burgundy block mb-3">
              Naqash Heritage Atelier
            </span>

            {/* Main Title */}
            <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl font-medium text-text-dark tracking-tight mb-5">
              Our Collections
            </h1>

            {/* Subtitle */}
            <p className="text-text-muted text-base sm:text-lg md:text-xl font-light leading-relaxed max-w-2xl mx-auto">
              Discover our carefully curated selection of handcrafted rugs, from timeless Persian masterpieces to contemporary minimalist designs.
            </p>

            {/* Micro Strip */}
            <div className="inline-flex items-center gap-3 mt-8 px-5 py-2 rounded-full bg-white/80 border border-[#DFD7C9] text-xs uppercase tracking-wider text-text-muted shadow-xs">
              <span className="text-burgundy font-semibold">
                {collections.length} {collections.length === 1 ? 'Collection' : 'Collections'}
              </span>
              <span className="w-1 h-1 rounded-full bg-gold" />
              <span>Hand-Knotted Wool & Silk</span>
              <span className="w-1 h-1 rounded-full bg-gold hidden sm:inline-block" />
              <span className="hidden sm:inline-block">Master Weavers</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="container max-w-7xl mx-auto px-4 md:px-8">
        {collections.length > 0 ? (
          /* Collections Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            {collections.map((collection, index) => {
              const targetUrl = `/collections/${collection.slug}`;
              const formattedIndex = String(index + 1).padStart(2, '0');

              return (
                <div
                  key={collection.id}
                  className="group bg-white rounded-3xl border border-[#DFD7C9] overflow-hidden shadow-xs hover:shadow-xl transition-all duration-500 flex flex-col"
                >
                  {/* Banner Image Container */}
                  <Link href={targetUrl} className="block relative aspect-[16/10] overflow-hidden bg-cream-alt">
                    {collection.image ? (
                      <Image
                        src={collection.image}
                        alt={collection.name}
                        fill
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-text-muted bg-cream-alt">
                        <Layers className="w-8 h-8 opacity-40" />
                      </div>
                    )}

                    {/* Gradient Scrim */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-500" />

                    {/* Rug Count Badge */}
                    <div className="absolute top-4 right-4 z-10">
                      <span className="bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-full text-[11px] uppercase tracking-widest font-semibold text-burgundy shadow-sm border border-white/60">
                        {collection.productCount} {collection.productCount === 1 ? 'Rug' : 'Rugs'}
                      </span>
                    </div>

                    {/* Sequence Badge */}
                    <div className="absolute bottom-4 left-4 z-10">
                      <span className="bg-black/40 backdrop-blur-xs text-white/90 px-3 py-1 rounded-full text-[10px] uppercase tracking-[0.2em] font-medium border border-white/20">
                        Lineage {formattedIndex}
                      </span>
                    </div>
                  </Link>

                  {/* Body Details */}
                  <div className="p-6 sm:p-8 flex flex-col flex-1">
                    <div className="flex items-center justify-between gap-4 mb-2.5">
                      <h2 className="font-heading text-2xl sm:text-3xl font-medium text-text-dark group-hover:text-burgundy transition-colors">
                        <Link href={targetUrl}>{collection.name}</Link>
                      </h2>
                    </div>

                    <p className="text-text-muted text-sm sm:text-base line-clamp-3 leading-relaxed font-light mb-8 flex-1">
                      {collection.description ||
                        'Handcrafted rugs showcasing signature weaving motifs and exceptional craftsmanship.'}
                    </p>

                    <div className="mt-auto pt-4 border-t border-[#F0EAE1] flex items-center justify-between">
                      <Link
                        href={targetUrl}
                        className="inline-flex items-center gap-2 px-6 py-2.5 bg-burgundy hover:bg-burgundy-deep text-white rounded-full text-xs uppercase tracking-widest font-medium transition-all duration-200 shadow-xs group/btn cursor-pointer"
                      >
                        Explore Collection
                        <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover/btn:translate-x-1" />
                      </Link>

                      <span className="text-xs uppercase tracking-wider text-text-muted font-medium">
                        View Pieces
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Empty State: If there are no collections, show elegant no collections view */
          <div className="bg-white border border-[#DFD7C9] rounded-3xl p-10 sm:p-16 max-w-xl mx-auto text-center shadow-xs">
            <div className="w-16 h-16 rounded-full bg-cream-alt text-burgundy mx-auto flex items-center justify-center mb-6 shadow-xs">
              <Layers className="w-8 h-8" />
            </div>
            <h2 className="font-heading text-2xl sm:text-3xl font-medium text-text-dark mb-3">
              No Collections Found
            </h2>
            <p className="text-text-muted text-sm sm:text-base leading-relaxed font-light mb-8 max-w-md mx-auto">
              There are currently no curated collections published in the gallery. You can explore all available rugs in our main shop, or add a collection via the admin dashboard.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/shop"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3 bg-burgundy hover:bg-burgundy-deep text-white rounded-full text-xs uppercase tracking-widest font-medium transition-colors shadow-xs"
              >
                Shop All Rugs
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                href="/admin/collections"
                className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 border border-[#DFD7C9] hover:border-burgundy bg-white text-text-dark rounded-full text-xs uppercase tracking-wider font-medium transition-colors"
              >
                Admin Collections
              </Link>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
