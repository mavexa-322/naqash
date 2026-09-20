import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sparkles, Eye, ChevronsDown } from "lucide-react";
import { Palette, Feather, Home as HomeIcon, Package, RefreshCcw, HeartHandshake } from "lucide-react";
import { GoogleReviews } from "@/components/ui/GoogleReviews";
import { getCollections, getBestSellers } from "@/lib/catalog";

export default async function Home() {
  const [collections, bestSellers] = await Promise.all([
    getCollections(),
    getBestSellers(4),
  ]);

  return (
    <div className="flex flex-col min-h-screen bg-ivory">
      {/* 1. Replicated Hero Section - Fully Responsive */}
      <section className="relative min-h-screen w-full flex flex-col justify-between pt-24 sm:pt-28 pb-6 sm:pb-8">
        {/* Background Image & Subtle Warm Ambient Vignette */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          {/* Mobile Background Image (< 640px) */}
          <div className="block sm:hidden absolute inset-0">
            <Image
              src="/hero-background-exact.jpg"
              alt="Authentic handwoven Persian rug curving across warm amber studio background"
              fill
              priority
              quality={95}
              className="image-grade"
              style={{ objectFit: 'cover', objectPosition: '78% 10%' }}
            />
          </div>

          {/* Desktop Background Image (>= 640px) */}
          <div className="hidden sm:block absolute inset-0">
            <Image
              src="/hero-background-exact.jpg"
              alt="Authentic handwoven Persian rug curving across warm amber studio background"
              fill
              priority
              quality={95}
              className="image-grade"
              style={{ objectFit: 'cover', objectPosition: 'center center' }}
            />
          </div>

          {/* Top vignette for navbar clarity */}
          <div className="absolute top-0 inset-x-0 h-36 md:h-44 bg-gradient-to-b from-black/75 via-black/35 to-transparent" />
          
          {/* Mobile dark ambiance overlay to ensure 100% text readability */}
          <div className="block sm:hidden absolute inset-0 bg-gradient-to-b from-transparent via-black/35 to-black/80" />

          {/* Soft bottom vignette behind cards and floor */}
          <div className="absolute bottom-0 inset-x-0 h-64 md:h-80 bg-gradient-to-t from-black/60 via-black/25 to-transparent" />
        </div>
        
        {/* Middle Row: Right-Aligned Hero Content Placed Under the Curve */}
        <div className="relative z-10 container mx-auto px-4 sm:px-6 md:px-10 lg:px-16 flex-1 flex items-center justify-end py-6 sm:py-8 lg:py-10">
          <div className="max-w-xl text-left space-y-3.5 sm:space-y-4 md:space-y-5 mt-14 sm:mt-0 pt-4 sm:pt-0">
            <h1 className="editorial-reveal text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-heading font-medium leading-[1.12] tracking-tight drop-shadow-[0_4px_16px_rgba(0,0,0,0.85)]">
              <span 
                className="block bg-clip-text text-transparent"
                style={{
                  backgroundImage: 'linear-gradient(90deg, #E5C384 0%, #F5ECE0 45%, #FFFFFF 95%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                HandMade Rugs
              </span>
              <span 
                className="block bg-clip-text text-transparent"
                style={{
                  backgroundImage: 'linear-gradient(90deg, #E5C384 0%, #F5ECE0 45%, #FFFFFF 95%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                for Every Home
              </span>
            </h1>
            <p className="editorial-reveal text-xs sm:text-sm md:text-base text-[#F5EDE3] sm:text-[#E8DCCF]/90 leading-relaxed max-w-md font-normal sm:font-light drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] sm:drop-shadow-sm">
              Contemporary and traditional styles, handwoven by master artisans. Visit our showroom for a free expert consultation.
            </p>
            <div className="pt-1 sm:pt-2">
              <Link 
                href="/contact" 
                className="inline-block border border-[#C9A15C]/80 hover:border-[#FFFDF9] bg-black/40 sm:bg-black/20 hover:bg-black/50 backdrop-blur-xs text-[#F7F2E9] uppercase text-[10px] sm:text-[11px] md:text-xs tracking-[0.18em] sm:tracking-[0.2em] px-5 sm:px-8 py-2.5 sm:py-3 transition-all duration-300 font-medium rounded-xs shadow-md hover:shadow-lg"
              >
                BOOK A VISIT TO OUR SHOWROOM
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Row: 4 Glassmorphism Feature Cards & Scroll Indicator */}
        <div className="relative z-10 container mx-auto px-4 sm:px-6 md:px-10 lg:px-16 space-y-3 sm:space-y-4 mt-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 lg:gap-5">
            {/* Card 1: Quality */}
            <div className="bg-white/[0.06] hover:bg-white/[0.09] backdrop-blur-md border border-white/[0.12] p-3 sm:p-5 rounded-xs shadow-lg transition-all duration-300 flex flex-col justify-start">
              <h3 className="font-heading text-sm sm:text-lg lg:text-xl font-medium text-[#E0C5A2] mb-1 sm:mb-1.5 tracking-wide">Quality</h3>
              <p className="text-[10px] sm:text-xs text-[#D8CCC0]/85 leading-relaxed font-light">
                Naqash Carpets offers unique, handmade rugs, carpets, and kilims at affordable prices. Crafted sustainably from 100% organic materials.
              </p>
            </div>

            {/* Card 2: Beauty */}
            <div className="bg-white/[0.06] hover:bg-white/[0.09] backdrop-blur-md border border-white/[0.12] p-3 sm:p-5 rounded-xs shadow-lg transition-all duration-300 flex flex-col justify-start">
              <h3 className="font-heading text-sm sm:text-lg lg:text-xl font-medium text-[#E0C5A2] mb-1 sm:mb-1.5 tracking-wide">Beauty</h3>
              <p className="text-[10px] sm:text-xs text-[#D8CCC0]/85 leading-relaxed font-light">
                Each rug is a vibrant work of art, blending tradition with innovation through intricate patterns and bold colors.
              </p>
            </div>

            {/* Card 3: Partners */}
            <div className="bg-white/[0.06] hover:bg-white/[0.09] backdrop-blur-md border border-white/[0.12] p-3 sm:p-5 rounded-xs shadow-lg transition-all duration-300 flex flex-col justify-start">
              <h3 className="font-heading text-sm sm:text-lg lg:text-xl font-medium text-[#E0C5A2] mb-1 sm:mb-1.5 tracking-wide">Partners</h3>
              <p className="text-[10px] sm:text-xs text-[#D8CCC0]/85 leading-relaxed font-light">
                We partner only with certified weavers, ensuring ethical, fair-trade craftsmanship with no child labor or unethical practices.
              </p>
            </div>

            {/* Card 4: Approach */}
            <div className="bg-white/[0.06] hover:bg-white/[0.09] backdrop-blur-md border border-white/[0.12] p-3 sm:p-5 rounded-xs shadow-lg transition-all duration-300 flex flex-col justify-start">
              <h3 className="font-heading text-sm sm:text-lg lg:text-xl font-medium text-[#E0C5A2] mb-1 sm:mb-1.5 tracking-wide">Approach</h3>
              <p className="text-[10px] sm:text-xs text-[#D8CCC0]/85 leading-relaxed font-light">
                Our transparent approach means no gimmicks or inflated discounts—just honest pricing and expert guidance to help you find the perfect rug.
              </p>
            </div>
          </div>

          {/* Centered Scroll Indicator */}
          <div className="flex justify-center pt-2 pb-1">
            <a href="#collections" className="text-[#C4B5A5]/70 hover:text-[#F7F2E9] transition-colors p-1" aria-label="Scroll down">
              <ChevronsDown className="w-5 h-5 text-[#C9A15C]/80 animate-bounce" />
            </a>
          </div>
        </div>
      </section>

      {/* 2. Curated Collections Intro + Cards */}
      <section id="collections" className="py-20 md:py-32 bg-ivory">
        <div className="container px-4 md:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
            {/* Ornamental Crest Motif on top of heading */}
            <div className="flex justify-center mb-1">
              <svg 
                viewBox="0 0 120 74" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2.5" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                className="w-14 h-9 md:w-16 md:h-10 text-burgundy transition-transform duration-300 hover:scale-105"
                aria-hidden="true"
              >
                {/* Central Jewel / Seed */}
                <ellipse cx="60" cy="53" rx="7" ry="9" />
                
                {/* Inner Arched Canopy */}
                <path d="M 45 49 C 51 38, 69 38, 75 49" />
                
                {/* Outer Floral Palmette Crest */}
                <path d="M 45 52 C 34 58, 20 54, 16 43 C 13 32, 22 22, 32 20 C 40 18, 44 28, 48 34 C 51 22, 53 10, 60 8 C 67 10, 69 22, 72 34 C 76 28, 80 18, 88 20 C 98 22, 107 32, 104 43 C 100 54, 86 58, 75 52" />
                
                {/* Subtle Top Crown Indentation */}
                <path d="M 52 14 C 56 10, 64 10, 68 14" />
              </svg>
            </div>

            <h2 className="text-4xl sm:text-5xl md:text-6xl font-heading font-normal text-burgundy tracking-tight">
              Curated Collections
            </h2>

            <p className="text-sm md:text-[15px] text-[#4A4036] leading-relaxed max-w-xl mx-auto font-light">
              Beautifully crafted and ethically sourced, our handmade area rugs bring warmth, style, and authenticity to any space. Expertly woven by skilled artisans, each rug tells a unique story of tradition and craftsmanship.
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-6 md:gap-8">
            {collections.map((collection) => (
              <Link href={`/collections/${collection.slug}`} key={collection.id} className="group cursor-pointer">
                <div className="relative aspect-4/5 overflow-hidden rounded-xl sm:rounded-2xl mb-2.5 sm:mb-5 bg-cream-alt border border-text-muted/20 shadow-sm transition-all duration-500 group-hover:shadow-md">
                  {collection.image ? (
                    <Image
                      src={collection.image}
                      alt={collection.name}
                      fill
                      className="object-cover image-grade transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 400px"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-sm text-text-muted">No image available</div>
                  )}
                  <div className="absolute inset-0 bg-linear-to-t from-charcoal/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-6 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                    <span className="hidden sm:inline-flex items-center gap-2 text-text-light text-sm font-medium bg-charcoal/60 backdrop-blur-xs px-4 py-2 rounded-full">
                      <Eye className="w-4 h-4 text-gold" />
                      View Collection
                    </span>
                  </div>
                </div>
                <h3 className="text-base sm:text-xl font-heading font-semibold text-center text-text-dark group-hover:text-burgundy transition-colors">
                  {collection.name}
                </h3>
                <p className="text-xs sm:text-sm text-text-muted text-center mt-1 line-clamp-2">{collection.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Best Sellers Section */}
      <section id="bestsellers" className="py-20 md:py-28 bg-cream-alt border-t border-[#DFD7C9]">
        <div className="container px-4 md:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
            {/* Ornamental Crest Motif */}
            <div className="flex justify-center mb-1">
              <svg 
                viewBox="0 0 120 74" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2.5" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                className="w-12 h-8 text-gold transition-transform duration-300 hover:scale-105"
                aria-hidden="true"
              >
                <ellipse cx="60" cy="53" rx="7" ry="9" />
                <path d="M 45 49 C 51 38, 69 38, 75 49" />
                <path d="M 45 52 C 34 58, 20 54, 16 43 C 13 32, 22 22, 32 20 C 40 18, 44 28, 48 34 C 51 22, 53 10, 60 8 C 67 10, 69 22, 72 34 C 76 28, 80 18, 88 20 C 98 22, 107 32, 104 43 C 100 54, 86 58, 75 52" />
                <path d="M 52 14 C 56 10, 64 10, 68 14" />
              </svg>
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading font-medium text-text-dark tracking-tight">
              Best Sellers
            </h2>

            <p className="text-sm md:text-base text-text-muted leading-relaxed font-light">
              Our most cherished hand-knotted pieces, celebrated for their exceptional craftsmanship and timeless allure.
            </p>
          </div>

          {/* Product Cards Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            {bestSellers.map((product) => (
              <Link 
                href={`/shop/${product.slug}`} 
                key={product.id}
                className="group flex flex-col bg-ivory rounded-xl sm:rounded-2xl overflow-hidden border border-[#DFD7C9] shadow-xs hover:shadow-lg transition-all duration-300"
              >
                <div className="relative aspect-square overflow-hidden bg-cream-alt">
                  {product.image ? (
                    <Image
                      src={product.image}
                      alt={product.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 300px"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-xs text-text-muted">
                      Naqash Rug
                    </div>
                  )}

                  {/* Best Seller Gold Badge */}
                  <div className="absolute top-2.5 left-2.5 sm:top-3 sm:left-3 z-10">
                    <span className="inline-flex items-center gap-1 bg-[#C9A15C] text-[#1C1815] text-[9px] sm:text-[10px] uppercase tracking-wider font-semibold px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full shadow-sm">
                      <Sparkles className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                      Best Seller
                    </span>
                  </div>

                  {/* Quick hover action */}
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <span className="bg-white/95 text-text-dark text-xs uppercase tracking-wider font-medium px-4 py-2 rounded-full shadow-md flex items-center gap-1.5">
                      <Eye className="w-3.5 h-3.5" />
                      View Rug
                    </span>
                  </div>
                </div>

                <div className="p-3 sm:p-4 flex-1 flex flex-col justify-between space-y-1.5 sm:space-y-2">
                  <div>
                    {product.collection && (
                      <span className="text-[10px] sm:text-[11px] uppercase tracking-wider text-text-muted font-medium block truncate">
                        {product.collection}
                      </span>
                    )}
                    <h3 className="font-heading text-xs sm:text-base font-medium text-text-dark group-hover:text-burgundy transition-colors line-clamp-1">
                      {product.title}
                    </h3>
                  </div>

                  <div className="flex items-baseline justify-between pt-1 border-t border-[#DFD7C9]/60">
                    <div className="flex flex-col sm:flex-row sm:items-baseline gap-0.5 sm:gap-2">
                      <span className="text-xs sm:text-sm font-semibold text-text-dark">
                        PKR {Number(product.salePrice ?? product.basePrice).toLocaleString()}
                      </span>
                      {product.salePrice && (
                        <span className="text-[10px] sm:text-xs text-text-muted line-through">
                          PKR {Number(product.basePrice).toLocaleString()}
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-burgundy font-medium group-hover:translate-x-0.5 transition-transform flex items-center shrink-0 ml-1">
                      <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              href="/shop?filter=bestseller"
              className="inline-flex items-center gap-2 border border-text-dark/20 hover:border-burgundy text-text-dark hover:text-burgundy bg-ivory hover:bg-cream-alt text-xs uppercase tracking-[0.2em] px-8 py-3.5 rounded-full font-medium transition-all shadow-xs"
            >
              Explore All Best Sellers
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* 4. See Our Rugs in Your Space */}
      <section className="py-20 md:py-36 bg-ivory border-t border-[#DFD7C9]">
        <div className="container px-4 md:px-8">
          <div className="text-center mb-12 md:mb-16 space-y-3 sm:space-y-4">
            <span className="text-xs font-medium tracking-[0.2em] text-text-muted uppercase">
              <Sparkles className="w-4 h-4 inline mr-1 text-gold" />
              Design Inspiration
            </span>
            <h2 className="text-3xl md:text-5xl font-heading font-medium text-text-dark">See Our Rugs in Your Space</h2>
            <p className="text-text-muted text-sm md:text-base max-w-xl mx-auto font-light">Get inspired by how our handcrafted rugs transform living spaces into works of art.</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-2 gap-3 sm:gap-6">
            {/* Large feature image - Spans full width on mobile, 1 col + 2 rows on laptop */}
            <div className="col-span-2 md:col-span-1 md:row-span-2 relative aspect-16/10 sm:aspect-4/3 md:aspect-auto overflow-hidden rounded-xl sm:rounded-2xl border border-text-muted/20 group shadow-sm">
              <Image
                src="/rug-showcase.jpg"
                alt="Elegant dining room with handwoven carpet"
                fill
                className="object-cover image-grade transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/45 to-transparent" />
              <div className="absolute bottom-0 left-0 p-4 sm:p-8">
                <span className="text-[10px] sm:text-xs text-gold uppercase tracking-wider font-semibold">Featured Space</span>
                <h3 className="text-lg sm:text-2xl md:text-3xl font-heading font-bold text-white mt-1 sm:mt-2 drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">The Grand Dining Room</h3>
                <p className="text-[#F5EDE3] text-xs sm:text-sm mt-1 max-w-sm font-light line-clamp-2 sm:line-clamp-none drop-shadow-[0_1px_4px_rgba(0,0,0,0.9)]">A heritage Bokhara carpet creating warmth and elegance under a modern dining setting.</p>
              </div>
            </div>

            {/* Two smaller images - Side-by-side 2 in a row on mobile, stacked on laptop */}
            <div className="col-span-1 relative aspect-[4/3.5] sm:aspect-4/3 overflow-hidden rounded-xl sm:rounded-2xl border border-text-muted/20 group shadow-sm">
              <Image
                src="/hero-rug.jpg"
                alt="Living room with Persian rug"
                fill
                className="object-cover image-grade transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 768px) 50vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/60 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-5 md:p-6">
                <h3 className="text-xs sm:text-base md:text-lg font-heading font-bold text-white leading-snug drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)]">
                  Living Room Elegance
                </h3>
                <p className="text-[#F0E6DA] text-[10px] sm:text-xs md:text-sm mt-0.5 sm:mt-1 line-clamp-2 leading-tight drop-shadow-[0_1px_4px_rgba(0,0,0,0.95)] font-normal">
                  Persian medallion rug as a centerpiece.
                </p>
              </div>
            </div>

            <div className="col-span-1 relative aspect-[4/3.5] sm:aspect-4/3 overflow-hidden rounded-xl sm:rounded-2xl border border-text-muted/20 group shadow-sm">
              <Image
                src="/modern-minimal.jpg"
                alt="Contemporary room with modern rug"
                fill
                className="object-cover image-grade transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 768px) 50vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/60 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-5 md:p-6">
                <h3 className="text-xs sm:text-base md:text-lg font-heading font-bold text-white leading-snug drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)]">
                  Modern Retreat
                </h3>
                <p className="text-[#F0E6DA] text-[10px] sm:text-xs md:text-sm mt-0.5 sm:mt-1 line-clamp-2 leading-tight drop-shadow-[0_1px_4px_rgba(0,0,0,0.95)] font-normal">
                  Geometric patterns for modern spaces.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Google Reviews & Naqash Collector Testimonials */}
      <GoogleReviews />

      {/* 8. Why Choose Naqash Carpets */}
      <section className="py-28 md:py-36 relative overflow-hidden bg-[#FAF7F2] border-t border-[#DFD7C9]">
        {/* Background Carpet Image provided by User */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/why-choose-carpet-light.png"
            alt="Handcrafted Naqash Carpet Background"
            fill
            className="object-cover object-center"
            sizes="100vw"
            priority={false}
          />
          {/* Subtle light ambient overlay ensuring seamless harmony with site's ivory/cream tones */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#FAF7F2]/80 via-white/20 to-[#FAF7F2]/85" />
        </div>

        <div className="container px-4 md:px-8 relative z-10">
          <div className="text-center mb-16 space-y-4">
            <span className="text-xs font-semibold tracking-[0.25em] text-burgundy uppercase">The Naqash Difference</span>
            <h2 className="text-3xl md:text-5xl font-heading font-medium text-text-dark">Why Choose Naqash Carpets</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <Palette className="h-5 w-5" />,
                title: "Authentic Artistry",
                description: "Every rug is hand-knotted by skilled artisans using centuries-old techniques passed down through generations, ensuring each piece is a unique work of art."
              },
              {
                icon: <Feather className="h-5 w-5" />,
                title: "Premium Materials",
                description: "We source only the finest New Zealand wool, Afghani wool, and pure silk, hand-spun and naturally dyed to create rugs that last for generations."
              },
              {
                icon: <HomeIcon className="h-5 w-5" />,
                title: "Design Consultation",
                description: "Our experts help you find the perfect rug for your space — from selecting the right size and pattern to matching colors with your existing décor."
              },
              {
                icon: <Package className="h-5 w-5" />,
                title: "Free Nationwide Delivery",
                description: "We offer complimentary delivery across Pakistan, with each rug carefully packaged to ensure it arrives in perfect condition at your doorstep."
              },
              {
                icon: <RefreshCcw className="h-5 w-5" />,
                title: "30-Day Returns",
                description: "Not completely in love? Return your rug within 30 days for a full refund. We want you to be absolutely delighted with your purchase."
              },
              {
                icon: <HeartHandshake className="h-5 w-5" />,
                title: "Lifetime Care Support",
                description: "Every purchase comes with a care guide and access to our cleaning and restoration experts who will help maintain your rug's beauty for decades."
              }
            ].map((item, i) => (
              <div
                key={i}
                className="text-center p-8 rounded-2xl border border-[#DFD7C9] bg-white/85 backdrop-blur-md hover:bg-white hover:border-[#C9A15C] hover:-translate-y-1.5 transition-all duration-300 group shadow-xs hover:shadow-lg"
              >
                <div className="inline-flex p-3.5 rounded-full bg-cream-alt text-burgundy border border-[#DFD7C9] mb-5 group-hover:bg-burgundy group-hover:text-white group-hover:scale-110 transition-all shadow-xs">
                  {item.icon}
                </div>
                <h3 className="text-lg font-heading font-semibold mb-3 text-text-dark group-hover:text-burgundy transition-colors">
                  {item.title}
                </h3>
                <p className="text-sm text-text-muted leading-relaxed font-light">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
