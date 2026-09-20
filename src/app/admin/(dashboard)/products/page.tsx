import { getProducts, getCollections } from "@/lib/catalog";
import { ProductListClient } from "./ProductListClient";

export const dynamic = 'force-dynamic';

export default async function AdminProductsPage() {
  const [products, collections] = await Promise.all([
    getProducts(),
    getCollections(),
  ]);

  return <ProductListClient initialProducts={products} collections={collections} />;
}
