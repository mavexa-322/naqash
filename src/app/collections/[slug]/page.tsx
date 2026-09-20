import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getCollectionBySlug, getProducts } from '@/lib/catalog';
import { ProductCard } from '@/components/ui/ProductCard';
import { ChevronLeft, ArrowRight, PackageOpen, Layers } from 'lucide-react';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const collection = await getCollectionBySlug(slug);

  if (!collection) {
    return {
      title: 'Collection Not Found | Naqash Carpets',
    };
  }

  return {
    title: `${collection.name} Collection | Naqash Carpets Gallery`,
    description: collection.description || `Explore the handcrafted rugs in our ${collection.name} collection.`,
  };
}

export default async function CollectionDetailsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const collection = await getCollectionBySlug(slug);

  if (!collection) {
    notFound();
  }

  const products = await getProducts({
    collectionSlug: collection.slug,
    collectionId: collection.id,
  });

  return (
    <div className="min-h-screen bg-ivory pb-28 pt-24 md:pt-32">
      <div className="container max-w-7xl mx-auto px-4 md:px-8 space-y-10">
        {/* Navigation Breadcrumb */}
        <div>
          <Link
            href="/collections"
            className="inline-flex items-center text-xs uppercase tracking-wider text-text-muted hover:text-burgundy font-medium transition-colors"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Back to All Collections
          </Link>
        </div>

        {/* Collection Hero Showcase */}
        <section className="relative rounded-3xl overflow-hidden bg-white border border-[#DFD7C9] shadow-xs">
          <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[360px]">
            {/* Left Content Column */}
            <div className="lg:col-span-7 p-8 sm:p-12 lg:p-14 flex flex-col justify-center bg-gradient-to-br from-white via-ivory/50 to-cream-alt/40">
              {/* Crest Motif */}
              <div className="flex items-center gap-2 mb-4">
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 40 40"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="text-burgundy"
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
                </svg>
                <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-burgundy">
                  Curated Lineage
                </span>
              </div>

              {/* Title */}
              <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-medium text-text-dark mb-4 tracking-tight">
                {collection.name}
              </h1>

              {/* Description */}
              <p className="text-text-muted text-sm sm:text-base leading-relaxed font-light mb-8 max-w-xl">
                {collection.description ||
                  'Explore our authentic handcrafted pieces from this collection, each meticulously knotted with generational expertise.'}
              </p>

              {/* Stats & Badge Pill */}
              <div className="flex flex-wrap items-center gap-3">
                <span className="bg-cream-alt border border-[#DFD7C9] text-burgundy font-semibold text-xs uppercase tracking-wider px-4 py-2 rounded-full shadow-xs">
                  {products.length} {products.length === 1 ? 'Piece Available' : 'Pieces Available'}
                </span>
                <Link
                  href="/shop"
                  className="text-xs uppercase tracking-wider text-text-muted hover:text-burgundy font-medium underline underline-offset-4 transition-colors"
                >
                  View All Rugs →
                </Link>
              </div>
            </div>

            {/* Right Banner Image Column */}
            <div className="lg:col-span-5 relative min-h-[260px] lg:min-h-full bg-cream-alt border-t lg:border-t-0 lg:border-l border-[#DFD7C9]">
              {collection.image ? (
                <Image
                  src={collection.image}
                  alt={collection.name}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 1024px) 100vw, 40vw"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-text-muted bg-cream-alt">
                  <Layers className="w-12 h-12 opacity-30" />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
            </div>
          </div>
        </section>

        {/* Collection Products Section */}
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b border-[#DFD7C9] pb-4">
            <div>
              <h2 className="font-heading text-xl sm:text-2xl font-medium text-text-dark">
                Rugs in this Collection
              </h2>
              <p className="text-xs text-text-muted mt-0.5">
                Every rug is unique, washed in mountain spring water, and hand-finished.
              </p>
            </div>
            <span className="text-xs uppercase tracking-wider text-text-muted font-medium">
              Showing {products.length}
            </span>
          </div>

          {products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            /* Empty State for Collection with 0 Rugs */
            <div className="bg-white border border-[#DFD7C9] rounded-3xl p-10 sm:p-14 text-center max-w-lg mx-auto shadow-xs">
              <div className="w-14 h-14 rounded-full bg-cream-alt text-burgundy mx-auto flex items-center justify-center mb-5">
                <PackageOpen className="w-7 h-7" />
              </div>
              <h3 className="font-heading text-2xl font-medium text-text-dark mb-2">
                No Rugs Currently Available
              </h3>
              <p className="text-text-muted text-sm font-light leading-relaxed mb-6">
                Our weavers are currently crafting new additions for the {collection.name} collection. In the meantime, discover other handcrafted treasures in our full catalog.
              </p>
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 px-7 py-3 bg-burgundy hover:bg-burgundy-deep text-white rounded-full text-xs uppercase tracking-widest font-medium transition-colors shadow-xs"
              >
                Browse Shop Catalog
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
