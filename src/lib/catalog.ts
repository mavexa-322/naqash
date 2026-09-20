import { createClient } from "@/utils/supabase/server";
import { getStoredCollections } from "@/lib/collectionsStorage";
import { getProductOverrides } from "@/lib/productsStorage";
import type { ShopProduct } from "@/lib/shopData";

function applyProductOverrides(products: ShopProduct[]): ShopProduct[] {
  const overrides = getProductOverrides();
  if (!overrides || Object.keys(overrides).length === 0) return products;

  return products.map((p) => {
    const override = overrides[p.id];
    if (!override) return p;

    return {
      ...p,
      title: override.title !== undefined ? override.title : p.title,
      description: override.description !== undefined ? override.description : p.description,
      basePrice: override.basePrice !== undefined ? override.basePrice : p.basePrice,
      salePrice: override.salePrice !== undefined ? (override.salePrice ?? undefined) : p.salePrice,
      badge: override.badge !== undefined ? (override.badge ?? undefined) : p.badge,
      collection: override.collection !== undefined ? override.collection : p.collection,
      collectionSlug: override.collectionSlug !== undefined ? override.collectionSlug : p.collectionSlug,
      materials: override.materials !== undefined ? override.materials : p.materials,
      sizes: override.sizes !== undefined ? override.sizes : p.sizes,
      colors: override.colors !== undefined ? override.colors : p.colors,
      image: override.image !== undefined ? override.image : p.image,
      images: override.images !== undefined ? override.images : p.images,
    };
  });
}

export interface CatalogCollection {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  productCount: number;
}

type ProductRow = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  base_price: number;
  sale_price: number | null;
  badge: ShopProduct["badge"] | null;
  featured: boolean;
  created_at: string;
  collection_id: string | null;
  collections: Array<{ name: string; slug: string }> | { name: string; slug: string } | null;
  product_variants: Array<{
    size: string | null;
    color: string | null;
    material: string | null;
  }>;
  product_images: Array<{
    cloudinary_url: string;
    is_primary: boolean;
    display_order: number;
  }>;
};

function toShopProduct(row: ProductRow): ShopProduct {
  const images = [...(row.product_images ?? [])]
    .sort((a, b) => Number(b.is_primary) - Number(a.is_primary) || a.display_order - b.display_order)
    .map((image) => image.cloudinary_url);

  const colObj = Array.isArray(row.collections)
    ? row.collections[0]
    : (row.collections as unknown as { name?: string; slug?: string } | null);

  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    description: row.description ?? "",
    basePrice: row.base_price,
    salePrice: row.sale_price ?? undefined,
    image: images[0] ?? "",
    images,
    sizes: [...new Set((row.product_variants ?? []).map((variant) => variant.size).filter(Boolean) as string[])],
    colors: [...new Set((row.product_variants ?? []).map((variant) => variant.color).filter(Boolean) as string[])],
    materials: [...new Set((row.product_variants ?? []).map((variant) => variant.material).filter(Boolean) as string[])],
    collection: colObj?.name ?? "",
    collectionSlug: colObj?.slug ?? "",
    badge: row.badge ?? undefined,
    featured: row.featured,
    createdAt: row.created_at,
  };
}

export const FALLBACK_PRODUCTS: ShopProduct[] = [
  {
    id: "33333333-3333-3333-3333-333333333301",
    title: "Royal Bokhara Classic",
    slug: "royal-bokhara-classic",
    description: "A masterpiece of Turkmen weaving tradition, this Bokhara rug features repeating elephant foot (gul) motifs in deep crimson red. Hand-knotted with premium New Zealand wool on a cotton foundation.",
    basePrice: 185000,
    image: "/rugs/bokhara-red.jpg",
    images: ["/rugs/bokhara-red.jpg", "/rugs/persian-heritage.jpg"],
    sizes: ["3x5", "5x8", "8x10"],
    colors: ["Red & Burgundy"],
    materials: ["Wool"],
    collection: "Bokhara",
    collectionSlug: "bokhara",
    badge: "bestseller",
    featured: true,
    createdAt: "2026-01-01T00:00:00Z",
  },
  {
    id: "33333333-3333-3333-3333-333333333302",
    title: "Isfahan Silk Medallion",
    slug: "isfahan-silk-medallion",
    description: "An exquisite Isfahan rug crafted from pure silk with an intricate floral medallion design in sapphire blue and gold. Museum-quality craftsmanship with over 400 knots per square inch.",
    basePrice: 450000,
    image: "/rugs/isfahan-blue.jpg",
    images: ["/rugs/isfahan-blue.jpg"],
    sizes: ["3x5", "5x8"],
    colors: ["Blue & Navy"],
    materials: ["Silk"],
    collection: "Persian Heritage",
    collectionSlug: "persian-heritage",
    badge: "new",
    featured: true,
    createdAt: "2026-01-02T00:00:00Z",
  },
  {
    id: "33333333-3333-3333-3333-333333333303",
    title: "Geo Lines Contemporary",
    slug: "geo-lines-contemporary",
    description: "Bold geometric patterns meet modern minimalism in this hand-tufted area rug. Charcoal grey and mustard yellow create a striking contrast that elevates any contemporary space.",
    basePrice: 78000,
    image: "/rugs/modern-geometric.jpg",
    images: ["/rugs/modern-geometric.jpg", "/rugs/modern-minimal.jpg"],
    sizes: ["5x8", "8x10"],
    colors: ["Charcoal & Grey"],
    materials: ["Wool"],
    collection: "Modern Minimal",
    collectionSlug: "modern-minimal",
    featured: true,
    createdAt: "2026-01-03T00:00:00Z",
  },
  {
    id: "33333333-3333-3333-3333-333333333304",
    title: "Emerald Overdyed Vintage",
    slug: "emerald-overdyed-vintage",
    description: "A reclaimed vintage Turkish rug reborn through the overdyeing process in stunning emerald teal. Each piece is unique with its own character and perfectly imperfect charm.",
    basePrice: 125000,
    salePrice: 95000,
    image: "/rugs/overdyed-teal.jpg",
    images: ["/rugs/overdyed-teal.jpg", "/rugs/vintage-overdyed.jpg"],
    sizes: ["5x8"],
    colors: ["Jewel Tones"],
    materials: ["Wool"],
    collection: "Vintage & Overdyed",
    collectionSlug: "vintage-overdyed",
    badge: "sale",
    featured: true,
    createdAt: "2026-01-04T00:00:00Z",
  },
  {
    id: "33333333-3333-3333-3333-333333333305",
    title: "Coastal Diamond Jute",
    slug: "coastal-diamond-jute",
    description: "An eco-friendly handwoven jute rug with diamond pattern in warm natural tones. Perfect for coastal, bohemian, or farmhouse-inspired interiors. Durable and sustainable.",
    basePrice: 42000,
    image: "/rugs/jute-natural.jpg",
    images: ["/rugs/jute-natural.jpg"],
    sizes: ["5x8"],
    colors: ["Ivory & Cream"],
    materials: ["Jute"],
    collection: "Modern Minimal",
    collectionSlug: "modern-minimal",
    featured: false,
    createdAt: "2026-01-05T00:00:00Z",
  },
  {
    id: "33333333-3333-3333-3333-333333333306",
    title: "Tabriz Garden of Eden",
    slug: "tabriz-garden-of-eden",
    description: "An heirloom-quality Tabriz rug with exquisite all-over floral design in soft ivory, rose pink, and sage green. Hand-knotted with a blend of fine wool and silk for an unmatched sheen.",
    basePrice: 320000,
    image: "/rugs/tabriz-floral.jpg",
    images: ["/rugs/tabriz-floral.jpg"],
    sizes: ["5x8"],
    colors: ["Ivory & Cream"],
    materials: ["Wool & Silk Blend"],
    collection: "Persian Heritage",
    collectionSlug: "persian-heritage",
    badge: "new",
    featured: true,
    createdAt: "2026-01-06T00:00:00Z",
  },
  {
    id: "33333333-3333-3333-3333-333333333307",
    title: "Heriz Medallion Runner",
    slug: "heriz-medallion-runner",
    description: "A striking Heriz runner with a bold geometric medallion in terracotta, navy, and ivory. Perfect for hallways and entryways. Hand-knotted with durable highland wool.",
    basePrice: 68000,
    image: "/rugs/persian-heritage.jpg",
    images: ["/rugs/persian-heritage.jpg"],
    sizes: ["2.5x8", "2.5x10"],
    colors: ["Red & Burgundy", "Blue & Navy"],
    materials: ["Wool"],
    collection: "Persian Heritage",
    collectionSlug: "persian-heritage",
    featured: false,
    createdAt: "2026-01-07T00:00:00Z",
  },
  {
    id: "33333333-3333-3333-3333-333333333308",
    title: "Kazak Tribal Wool",
    slug: "kazak-tribal-wool",
    description: "A vibrant Kazak rug with bold tribal motifs in jewel tones — ruby red, emerald green, and sapphire blue. Hand-knotted with vegetable-dyed highland wool for exceptional durability.",
    basePrice: 195000,
    image: "/rugs/rug-showcase.jpg",
    images: ["/rugs/rug-showcase.jpg"],
    sizes: ["4x6", "5x8"],
    colors: ["Jewel Tones"],
    materials: ["Wool"],
    collection: "Persian Heritage",
    collectionSlug: "persian-heritage",
    badge: "bestseller",
    featured: true,
    createdAt: "2026-01-08T00:00:00Z",
  },
  {
    id: "33333333-3333-3333-3333-333333333309",
    title: "Minimalist Loom Weave",
    slug: "minimalist-loom-weave",
    description: "A handwoven flat-weave rug in soothing neutral tones with subtle textural stripes. Made from premium New Zealand wool, ideal for layering or as a standalone piece in modern interiors.",
    basePrice: 55000,
    image: "/rugs/modern-minimal.jpg",
    images: ["/rugs/modern-minimal.jpg"],
    sizes: ["5x8", "8x10"],
    colors: ["Ivory & Cream"],
    materials: ["Wool"],
    collection: "Modern Minimal",
    collectionSlug: "modern-minimal",
    featured: false,
    createdAt: "2026-01-09T00:00:00Z",
  },
  {
    id: "33333333-3333-3333-3333-333333333310",
    title: "Sunset Overdyed Kilim",
    slug: "sunset-overdyed-kilim",
    description: "A vintage kilim reborn in warm sunset hues of terracotta, coral, and burnt orange. The flat-weave construction makes it lightweight and versatile. A true conversation piece.",
    basePrice: 88000,
    salePrice: 72000,
    image: "/rugs/vintage-overdyed.jpg",
    images: ["/rugs/vintage-overdyed.jpg"],
    sizes: ["4x6", "5x7"],
    colors: ["Red & Burgundy"],
    materials: ["Wool"],
    collection: "Vintage & Overdyed",
    collectionSlug: "vintage-overdyed",
    badge: "sale",
    featured: false,
    createdAt: "2026-01-10T00:00:00Z",
  },
  {
    id: "33333333-3333-3333-3333-333333333311",
    title: "Pure Silk Qom",
    slug: "pure-silk-qom",
    description: "An ultra-fine pure silk Qom rug featuring a Tree of Life design in rich burgundy and gold. With over 600 knots per square inch, this is truly a collector piece and art for your floor.",
    basePrice: 480000,
    image: "/rugs/isfahan-blue.jpg",
    images: ["/rugs/isfahan-blue.jpg"],
    sizes: ["3x5", "4x6"],
    colors: ["Red & Burgundy"],
    materials: ["Silk"],
    collection: "Persian Heritage",
    collectionSlug: "persian-heritage",
    featured: false,
    createdAt: "2026-01-11T00:00:00Z",
  },
  {
    id: "33333333-3333-3333-3333-333333333312",
    title: "Bokhara Princess",
    slug: "bokhara-princess",
    description: "A fine Bokhara rug with smaller, more intricate gul patterns in traditional crimson and navy. Hand-knotted with a wool pile on a cotton foundation for everyday luxury.",
    basePrice: 145000,
    image: "/rugs/bokhara-red.jpg",
    images: ["/rugs/bokhara-red.jpg"],
    sizes: ["4x6", "5x8"],
    colors: ["Red & Burgundy", "Blue & Navy"],
    materials: ["Wool"],
    collection: "Bokhara",
    collectionSlug: "bokhara",
    featured: false,
    createdAt: "2026-01-12T00:00:00Z",
  },
  {
    id: "33333333-3333-3333-3333-333333333313",
    title: "Scandinavian Blend",
    slug: "scandinavian-blend",
    description: "A luxuriously soft area rug crafted from a blend of wool and cotton in cool grey tones with subtle geometric texturing. Designed for modern Nordic-inspired living spaces.",
    basePrice: 62000,
    image: "/rugs/modern-geometric.jpg",
    images: ["/rugs/modern-geometric.jpg"],
    sizes: ["5x8", "8x10"],
    colors: ["Charcoal & Grey"],
    materials: ["Wool"],
    collection: "Modern Minimal",
    collectionSlug: "modern-minimal",
    badge: "new",
    featured: false,
    createdAt: "2026-01-13T00:00:00Z",
  },
  {
    id: "33333333-3333-3333-3333-333333333314",
    title: "Heritage Wool Runner",
    slug: "heritage-wool-runner",
    description: "A timeless hand-knotted runner featuring classic Persian palmette motifs in warm ivory and soft terracotta. Perfect for adding heritage charm to hallways and corridors.",
    basePrice: 52000,
    image: "/rugs/tabriz-floral.jpg",
    images: ["/rugs/tabriz-floral.jpg"],
    sizes: ["2.5x8", "2.5x12"],
    colors: ["Ivory & Cream"],
    materials: ["Wool"],
    collection: "Persian Heritage",
    collectionSlug: "persian-heritage",
    featured: false,
    createdAt: "2026-01-14T00:00:00Z",
  },
  {
    id: "33333333-3333-3333-3333-333333333315",
    title: "Overdyed Amethyst",
    slug: "overdyed-amethyst",
    description: "A stunning vintage rug overdyed in deep amethyst purple with undertones of the original traditional pattern. A bold statement piece for eclectic and contemporary interiors.",
    basePrice: 135000,
    salePrice: 110000,
    image: "/rugs/overdyed-teal.jpg",
    images: ["/rugs/overdyed-teal.jpg"],
    sizes: ["5x8", "6x9"],
    colors: ["Jewel Tones"],
    materials: ["Wool"],
    collection: "Vintage & Overdyed",
    collectionSlug: "vintage-overdyed",
    badge: "sale",
    featured: false,
    createdAt: "2026-01-15T00:00:00Z",
  },
  {
    id: "33333333-3333-3333-3333-333333333316",
    title: "Natural Sisal Weave",
    slug: "natural-sisal-weave",
    description: "A tightly woven natural sisal and jute blend rug with a clean, minimalist appearance. Extremely durable and ideal for high-traffic areas. Available in oversized dimensions.",
    basePrice: 35000,
    image: "/rugs/jute-natural.jpg",
    images: ["/rugs/jute-natural.jpg"],
    sizes: ["6x9", "8x10"],
    colors: ["Ivory & Cream"],
    materials: ["Jute"],
    collection: "Modern Minimal",
    collectionSlug: "modern-minimal",
    featured: false,
    createdAt: "2026-01-16T00:00:00Z",
  },
  {
    id: "33333333-3333-3333-3333-333333333317",
    title: "Grand Bokhara Royal",
    slug: "grand-bokhara-royal",
    description: "Our largest Bokhara offering — a grand 9x12 hand-knotted masterpiece with traditional elephant foot guls in deep burgundy and navy. A true investment piece for spacious rooms.",
    basePrice: 295000,
    image: "/rugs/bokhara-red.jpg",
    images: ["/rugs/bokhara-red.jpg"],
    sizes: ["8x10", "9x12"],
    colors: ["Red & Burgundy", "Blue & Navy"],
    materials: ["Wool"],
    collection: "Bokhara",
    collectionSlug: "bokhara",
    badge: "bestseller",
    featured: true,
    createdAt: "2026-01-17T00:00:00Z",
  },
  {
    id: "33333333-3333-3333-3333-333333333318",
    title: "Silk & Wool Isfahan",
    slug: "silk-wool-isfahan",
    description: "A magnificent Isfahan rug crafted from a luxurious blend of silk and fine wool. Features an elaborate central medallion with curvilinear arabesques in midnight blue and ivory.",
    basePrice: 380000,
    image: "/rugs/isfahan-blue.jpg",
    images: ["/rugs/isfahan-blue.jpg"],
    sizes: ["5x8", "6x9"],
    colors: ["Blue & Navy", "Ivory & Cream"],
    materials: ["Wool & Silk Blend"],
    collection: "Persian Heritage",
    collectionSlug: "persian-heritage",
    featured: true,
    createdAt: "2026-01-18T00:00:00Z",
  },
  {
    id: "33333333-3333-3333-3333-333333333319",
    title: "Abstract Brushstroke",
    slug: "abstract-brushstroke",
    description: "A contemporary hand-tufted rug with abstract brushstroke patterns in charcoal, taupe, and subtle gold accents. Adds artistic flair to any modern living space.",
    basePrice: 92000,
    image: "/rugs/modern-minimal.jpg",
    images: ["/rugs/modern-minimal.jpg"],
    sizes: ["5x8", "8x10"],
    colors: ["Charcoal & Grey"],
    materials: ["Wool"],
    collection: "Modern Minimal",
    collectionSlug: "modern-minimal",
    badge: "new",
    featured: false,
    createdAt: "2026-01-19T00:00:00Z",
  },
  {
    id: "33333333-3333-3333-3333-333333333320",
    title: "Vintage Kashan Rose",
    slug: "vintage-kashan-rose",
    description: "A beautifully preserved vintage Kashan rug with a classic floral medallion in soft rose, ivory, and faded navy. Over 40 years old with patina that adds timeless character.",
    basePrice: 210000,
    image: "/rugs/tabriz-floral.jpg",
    images: ["/rugs/tabriz-floral.jpg"],
    sizes: ["5x7", "6x9"],
    colors: ["Red & Burgundy", "Ivory & Cream"],
    materials: ["Wool"],
    collection: "Vintage & Overdyed",
    collectionSlug: "vintage-overdyed",
    featured: false,
    createdAt: "2026-01-20T00:00:00Z",
  },
];

export async function getProducts(options?: { collectionId?: string; collectionSlug?: string }): Promise<ShopProduct[]> {
  try {
    const supabase = await createClient();
    let query = supabase
      .from("products")
      .select(`
        id, title, slug, description, base_price, sale_price, badge, featured, created_at, collection_id,
        collections(name, slug),
        product_variants(size, color, material),
        product_images(cloudinary_url, is_primary, display_order)
      `)
      .eq("status", "published")
      .order("created_at", { ascending: false });

    if (options?.collectionId) {
      query = query.eq("collection_id", options.collectionId);
    }

    const { data, error } = await query;
    const targetSlug = options?.collectionSlug;
    const targetId = options?.collectionId;

    if (error || !data || data.length === 0) {
      if (error) console.error("Unable to load products from Supabase, using curated fallback", error);
      const fallbackList = applyProductOverrides(FALLBACK_PRODUCTS);
      if (targetSlug || targetId) {
        return fallbackList.filter((p) =>
          (targetSlug && (p.collectionSlug === targetSlug || p.collection.toLowerCase() === targetSlug.toLowerCase())) ||
          (targetId && (p.collectionSlug === targetId || p.collection.toLowerCase() === targetId.toLowerCase()))
        );
      }
      return fallbackList;
    }

    const products = applyProductOverrides((data as unknown as ProductRow[]).map(toShopProduct));
    if (targetSlug) {
      return products.filter((p) => p.collectionSlug === targetSlug || p.collection.toLowerCase() === targetSlug.toLowerCase());
    }
    return products;
  } catch (err) {
    console.error("Supabase client error, falling back to curated products", err);
    const targetSlug = options?.collectionSlug;
    const targetId = options?.collectionId;
    const fallbackList = applyProductOverrides(FALLBACK_PRODUCTS);
    if (targetSlug || targetId) {
      return fallbackList.filter((p) =>
        (targetSlug && (p.collectionSlug === targetSlug || p.collection.toLowerCase() === targetSlug.toLowerCase())) ||
        (targetId && (p.collectionSlug === targetId || p.collection.toLowerCase() === targetId.toLowerCase()))
      );
    }
    return fallbackList;
  }
}

export async function getProductBySlug(slug: string): Promise<ShopProduct | null> {
  const products = await getProducts();
  return products.find((product) => product.slug === slug) ?? null;
}

export async function getSaleProducts(): Promise<ShopProduct[]> {
  const products = await getProducts();
  return products.filter(
    (product) =>
      (product.salePrice != null && product.salePrice < product.basePrice) ||
      product.badge === "sale"
  );
}

export async function getCollections(): Promise<CatalogCollection[]> {
  try {
    const [storedCollections, products] = await Promise.all([
      getStoredCollections(),
      getProducts(),
    ]);

    return storedCollections.map((collection) => ({
      id: collection.id,
      name: collection.name,
      slug: collection.slug,
      description: collection.description,
      image: collection.banner_url,
      productCount: products.filter(
        (product) =>
          product.collectionSlug === collection.slug ||
          product.collection.toLowerCase() === collection.name.toLowerCase()
      ).length,
    }));
  } catch (error) {
    console.error("Error retrieving collections:", error);
    return [];
  }
}

export async function getCollectionBySlug(slug: string): Promise<CatalogCollection | null> {
  const collections = await getCollections();
  return collections.find((collection) => collection.slug === slug) ?? null;
}

export async function getBestSellers(limit: number = 4): Promise<ShopProduct[]> {
  const products = await getProducts();
  const bestsellers = products.filter((p) => p.badge === "bestseller" || p.featured);
  
  if (bestsellers.length >= limit) {
    return bestsellers.slice(0, limit);
  }
  
  // Backfill with top products so the section always displays items elegantly
  const remaining = products.filter((p) => !bestsellers.some((b) => b.id === p.id));
  return [...bestsellers, ...remaining].slice(0, limit);
}
