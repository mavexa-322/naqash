import { notFound } from "next/navigation";
import { getProductBySlug } from "@/lib/catalog";
import { ProductDetailClient } from "./ProductDetailClient";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return {
      title: "Product Not Found | Naqash Carpets Gallery",
    };
  }

  return {
    title: `${product.title} | Naqash Carpets Gallery`,
    description: product.description || `Handcrafted ${product.title} handmade carpet from Naqash Carpets Gallery.`,
  };
}

// In Next.js 15, `params` is a promise in page components
export default async function ProductDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  return <ProductDetailClient product={product} />;
}
