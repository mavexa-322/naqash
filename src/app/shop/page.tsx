import { ShopClient } from "@/components/ui/ShopClient";
import { getProducts } from "@/lib/catalog";

export const metadata = {
  title: "Shop All Rugs | Naqash Carpets Gallery",
  description:
    "Browse our complete collection of handcrafted rugs — Persian heritage, modern minimal, vintage overdyed, and Bokhara carpets. Filter by size, color, material, and price.",
};

export default async function ShopPage() {
  const products = await getProducts();

  return <ShopClient products={products} />;
}
