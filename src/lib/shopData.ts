export interface ShopProduct {
  id: string;
  title: string;
  slug: string;
  description: string;
  basePrice: number;
  salePrice?: number;
  image: string;
  images: string[];
  sizes: string[];
  colors: string[];
  materials: string[];
  collection: string;
  collectionSlug: string;
  badge?: "new" | "sale" | "bestseller";
  featured: boolean;
  createdAt: string;
}
