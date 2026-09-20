import { getProducts } from "@/lib/catalog";
import { ProductListClient } from "./ProductListClient";

export const dynamic = 'force-dynamic';

export default async function AdminProductsPage() {
  const products = await getProducts();

  return <ProductListClient initialProducts={products} />;
}
