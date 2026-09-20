import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sparkles, Compass, Feather, ShieldCheck, MapPin } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our Story & Heritage | Naqash Carpets Gallery",
  description:
    "Rooted in Islamabad, Naqash Carpets Gallery preserves the ancient art of hand-knotted rug weaving, partnering directly with generational master weavers.",
};

const CRAFT_PILLARS = [
  {
    icon: Compass,
    title: "Mountain Highland Wool & Silk",
    description:
      "We source exclusively high-altitude wool with high natural lanolin content, paired with fine mulberry silk for an enduring, luminous patina that softens over decades.",
  },
  {
    icon: Feather,
    title: "Natural Botanical Dyeing",
    description:
      "Our colors are extracted by hand from madder roots, wild indigo, pomegranate peels, and walnut husks, creating rich tonal depth that synthetic dyes can never replicate.",
  },
  {
    icon: Sparkles,
    title: "The Double Knot Technique",
    description:
      "Every piece is tied knot by individual knot on vertical timber looms. A single room-size rug represents between 8 to 18 months of disciplined human patience.",
  },
  {
    icon: ShieldCheck,
    title: "Mountain Spring Washing",
    description:
      "Finished rugs are washed repeatedly in clean mountain water and dried naturally under alpine sun, setting the pile and guaranteeing generations of resilient luxury.",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-ivory pb-28 pt-24 md:pt-32">
      {/* ── 1. Hero Section ───────────────────────────────────── */}
      <section className="relative px-4 md:px-8 max-w-7xl mx-auto mb-16 md:mb-24">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-b from-cream-alt/90 via-ivory to-cream-alt/40 border border-[#DFD7C9] py-16 sm:py-24 px-6 sm:px-12 text-center shadow-xs">
          {/* Subtle Ambient Glow */}
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
            <span className="text-[11px] md:text-xs font-semibold uppercase tracking-[0.25em] text-burgundy block mb-3">
              Established in Islamabad • Handcrafted Traditions
            </span>

            {/* Title */}
            <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl font-medium text-text-dark tracking-tight mb-5">
              Our Story
            </h1>

            {/* Lead Narrative */}
            <p className="text-text-muted text-base sm:text-lg md:text-xl font-light leading-relaxed max-w-2xl mx-auto">
              Rooted in Islamabad, Naqash Carpets Gallery is dedicated to preserving the ancient art of rug weaving while bringing timeless elegance and tactile soul to the modern home.
            </p>
          </div>
        </div>
      </section>

      <div className="container max-w-6xl mx-auto px-4 md:px-8 space-y-24 md:space-y-32">
        {/* ── 2. The Loom Panoramic Showcase ──────────────────────── */}
        <section className="relative rounded-3xl overflow-hidden border border-[#DFD7C9] bg-cream-alt shadow-sm">
          <div className="relative aspect-[16/9] md:aspect-[21/9] w-full">
            <Image
              src="/about/artisan-loom-panoramic.jpg"
              alt="Master rug weaver working on a vertical carpet loom with dyed wool skeins"
              fill
              priority
              className="object-cover"
              sizes="(max-width: 1200px) 100vw, 1200px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/10" />

            {/* Atmospheric Caption Pill */}
            <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-auto z-10">
              <div className="bg-black/60 backdrop-blur-md border border-white/20 px-4 py-2.5 rounded-2xl text-white max-w-md shadow-lg">
                <span className="text-[10px] uppercase tracking-[0.2em] text-gold font-semibold block mb-0.5">
                  The Loom Atelier
                </span>
                <p className="text-xs text-[#F0EAE1]/90 font-light leading-snug">
                  Traditional upright timber loom strung with high-tension cotton warp, where master weavers knot fine highland wool row by individual row.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── 3. Narrative: The Heritage of the Loom ─────────────────── */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cream-alt text-burgundy text-[11px] uppercase tracking-wider font-semibold border border-[#DFD7C9]">
              Generational Lineage
            </div>
            <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-medium text-text-dark tracking-tight leading-tight">
              The Heritage of the Loom
            </h2>
            <p className="text-text-muted text-base sm:text-lg font-light leading-relaxed">
              For centuries, the art of hand-knotting rugs has been passed down quietly from master to apprentice. At Naqash, we work directly alongside generational weaver communities across Central and South Asia, ensuring that every knot, motif, and vegetable dye honors this profound cultural legacy.
            </p>
            <p className="text-text-muted text-base sm:text-lg font-light leading-relaxed">
              By eliminating intermediaries and mass brokers, we do not merely provide exceptional heirloom rugs at fair value; we directly protect artisan livelihoods, guaranteeing fair wages, safe community weaving spaces, and the continuation of an ancient human craft.
            </p>
          </div>

          <div className="lg:col-span-5 relative aspect-square sm:aspect-[4/3] lg:aspect-square rounded-3xl overflow-hidden border border-[#DFD7C9] bg-cream-alt shadow-sm">
            <Image
              src="/about/knotting-hands-detail.jpg"
              alt="Artisan hands tying a fine Persian knot with a weaver knife"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 450px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />
            <div className="absolute bottom-4 left-4 z-10">
              <span className="bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-full text-[10px] uppercase tracking-widest font-semibold text-burgundy border border-[#DFD7C9] shadow-xs">
                Hand-Knotted Node by Node
              </span>
            </div>
          </div>
        </section>

        {/* ── 4. The 4 Pillars of Naqash Artistry ───────────────────── */}
        <section className="space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs uppercase tracking-[0.25em] text-burgundy font-semibold">
              The Philosophy of the Knot
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl font-medium text-text-dark tracking-tight">
              Four Pillars of Our Craft
            </h2>
            <p className="text-text-muted text-sm sm:text-base font-light leading-relaxed">
              Each rug that enters the Naqash gallery must meet four uncompromised standards of traditional provenance.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {CRAFT_PILLARS.map((pillar, idx) => {
              const Icon = pillar.icon;
              return (
                <div
                  key={idx}
                  className="bg-white border border-[#DFD7C9] rounded-3xl p-7 sm:p-9 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    <div className="w-12 h-12 rounded-2xl bg-cream-alt text-burgundy flex items-center justify-center mb-6 shadow-xs">
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="font-heading text-xl font-medium text-text-dark mb-3">
                      {pillar.title}
                    </h3>
                    <p className="text-text-muted text-sm font-light leading-relaxed">
                      {pillar.description}
                    </p>
                  </div>
                  <div className="pt-6 mt-6 border-t border-[#F0EAE1]">
                    <span className="text-[10px] uppercase tracking-[0.2em] font-semibold text-burgundy/80">
                      Standard 0{idx + 1}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ── 5. Meet the Founder: A Vision by Ibrahim Khan ─────────── */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          <div className="lg:col-span-5 relative aspect-[3/4] sm:aspect-[4/3] lg:aspect-[3/4] rounded-3xl overflow-hidden border border-[#DFD7C9] bg-cream-alt shadow-sm order-2 lg:order-1">
            <Image
              src="/about/founder-ibrahim-khan.jpg"
              alt="Ibrahim Khan, Founder and Curator of Naqash Carpets Gallery"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 450px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
            <div className="absolute bottom-4 left-4 z-10">
              <span className="bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-full text-[10px] uppercase tracking-widest font-semibold text-text-dark border border-[#DFD7C9] shadow-xs">
                Ibrahim Khan • Founder & Curator
              </span>
            </div>
          </div>

          <div className="lg:col-span-7 space-y-6 order-1 lg:order-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cream-alt text-burgundy text-[11px] uppercase tracking-wider font-semibold border border-[#DFD7C9]">
              Curator & Visionary
            </div>
            <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-medium text-text-dark tracking-tight leading-tight">
              A Vision by Ibrahim Khan
            </h2>
            <p className="text-text-muted text-base sm:text-lg font-light leading-relaxed">
              Founded by Ibrahim Khan, Naqash Carpets Gallery emerged from a lifelong devotion to Islamic geometric architecture, Persian floral symbolism, and the tactile genius of master weavers.
            </p>
            <p className="text-text-muted text-base sm:text-lg font-light leading-relaxed">
              What began as an intimate curatorial salon in Islamabad’s F-6 Market has flourished into a landmark destination for discerning architects, interior designers, and collectors across Pakistan and abroad seeking the singular soul of an authentic foundation piece.
            </p>

            {/* Founder Quote Card */}
            <div className="bg-white border-l-4 border-burgundy border-y border-r border-[#DFD7C9] rounded-2xl p-6 shadow-xs space-y-2">
              <p className="font-heading italic text-base sm:text-lg text-text-dark leading-relaxed">
                “A genuine hand-knotted rug is never merely floor covering; it is a tapestry of songs, prayers, and generational human patience that breathes life into an entire home.”
              </p>
              <span className="text-xs uppercase tracking-widest font-semibold text-burgundy block pt-1">
                — Ibrahim Khan, Founder
              </span>
            </div>
          </div>
        </section>

        {/* ── 6. Atelier Invitation & Gallery Experience ─────────────── */}
        <section className="bg-white border border-[#DFD7C9] rounded-3xl p-8 sm:p-12 lg:p-16 shadow-xs text-center space-y-6">
          <div className="w-14 h-14 rounded-full bg-cream-alt text-burgundy mx-auto flex items-center justify-center shadow-xs">
            <MapPin className="w-6 h-6" />
          </div>

          <div className="max-w-2xl mx-auto space-y-3">
            <span className="text-xs uppercase tracking-[0.25em] text-burgundy font-semibold">
              The Atelier Experience
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl font-medium text-text-dark tracking-tight">
              Experience the Craft in Person
            </h2>
            <p className="text-text-muted text-sm sm:text-base font-light leading-relaxed">
              We warmly invite you to explore our private collection at our Islamabad boutique. Receive personalized architectural styling advice, view raw loom samples, or request custom dimensions.
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/contact"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3 bg-burgundy hover:bg-burgundy-deep text-white rounded-full text-xs uppercase tracking-widest font-medium transition-colors shadow-xs"
            >
              Book a Private Consultation
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link
              href="/shop"
              className="w-full sm:w-auto inline-flex items-center justify-center px-7 py-3 border border-[#DFD7C9] hover:border-burgundy bg-white text-text-dark rounded-full text-xs uppercase tracking-wider font-medium transition-colors"
            >
              Explore Our Collection
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
