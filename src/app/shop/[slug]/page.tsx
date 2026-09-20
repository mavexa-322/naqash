import { Button } from "@/components/ui/button";
import { ShieldCheck, Truck, ChevronRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getProductBySlug } from "@/lib/catalog";

// In Next.js 15, `params` is a promise in page components
export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }
  
  return (
    <div className="container px-4 md:px-8 py-8">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
        <Link href="/" className="hover:text-primary">Home</Link>
        <ChevronRight className="w-4 h-4" />
        <Link href="/shop" className="hover:text-primary">Shop</Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-foreground">{product.title}</span>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24">
        {/* Image Gallery */}
        <div className="space-y-4">
          <div className="relative aspect-[4/5] bg-muted rounded-xl overflow-hidden">
            {product.image ? (
              <Image src={product.image} alt={product.title} fill className="object-cover" priority />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">No image available</div>
            )}
          </div>
          <div className="grid grid-cols-4 gap-4">
            {product.images.map((image) => (
              <div key={image} className="relative aspect-square bg-muted rounded-lg overflow-hidden cursor-pointer hover:ring-2 hover:ring-primary transition-all">
                <Image src={image} alt={product.title} fill className="object-cover" />
              </div>
            ))}
          </div>
        </div>

        {/* Product Info & Actions */}
        <div className="flex flex-col">
          <div className="mb-8">
            <h1 className="text-4xl font-heading font-bold text-foreground mb-2">{product.title}</h1>
            <p className="text-xl font-medium text-primary mb-6">
              PKR {(product.salePrice ?? product.basePrice).toLocaleString()}
            </p>
            <p className="text-muted-foreground leading-relaxed">
              {product.description}
            </p>
          </div>

          <div className="space-y-6 mb-8">
            {/* Size Selector */}
            <div>
              <h3 className="text-sm font-semibold mb-3">Select Size</h3>
              <div className="grid grid-cols-3 gap-3">
                {product.sizes.map((size) => (
                  <button key={size} className="border rounded-md py-2 text-sm font-medium hover:border-primary hover:text-primary transition-colors focus:ring-2 focus:ring-primary focus:outline-none">
                    {size}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-4 mt-auto">
            <Button size="lg" className="w-full text-lg">Add to Cart</Button>
            
            <div className="flex items-center justify-between py-4 border-t border-b text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Truck className="w-5 h-5 text-primary" />
                <span>Free nationwide delivery</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-primary" />
                <span>Authenticity guaranteed</span>
              </div>
            </div>
          </div>

          <div className="mt-8 space-y-4">
            <div className="border-b pb-4">
              <h4 className="font-semibold cursor-pointer">Material & Care</h4>
              <p className="text-sm text-muted-foreground mt-2">
                {product.materials.join(", ") || "Material details are not available yet."}
              </p>
            </div>
            <div className="border-b pb-4">
              <h4 className="font-semibold cursor-pointer">Shipping & Returns</h4>
              <p className="text-sm text-muted-foreground mt-2">
                Ships within 3-5 business days. 30-day return policy for a full refund (minus return shipping).
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
