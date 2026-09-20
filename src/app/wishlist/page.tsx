import Link from 'next/link';
import { Heart, ShoppingBag } from 'lucide-react';
import { ProductCard } from '@/components/ui/ProductCard';
import { buttonVariants } from '@/components/ui/button';
import type { ShopProduct } from '@/lib/shopData';

export const metadata = {
  title: 'My Wishlist | Naqash Carpets',
  description: 'View and manage your saved rugs.',
};

export default function WishlistPage() {
  const wishlistProducts: ShopProduct[] = [];

  return (
    <div className="container px-4 md:px-8 py-12 md:py-20 min-h-[70vh]">
      <div className="flex items-center gap-3 mb-8 border-b pb-6">
        <Heart className="w-8 h-8 text-primary" />
        <h1 className="font-heading text-3xl md:text-4xl font-bold">My Wishlist</h1>
        <span className="ml-auto bg-muted text-muted-foreground px-3 py-1 rounded-full text-sm font-medium">
          {wishlistProducts.length} Items
        </span>
      </div>

      {wishlistProducts.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-5 gap-y-10">
          {wishlistProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center bg-muted/20 rounded-2xl border border-dashed">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-6">
            <Heart className="w-8 h-8 text-muted-foreground" />
          </div>
          <h2 className="font-heading text-2xl font-semibold mb-3">Your wishlist is empty</h2>
          <p className="text-muted-foreground max-w-md mb-8">
            You haven&apos;t saved any rugs yet. Browse our collections and click the heart icon to save your favorites here.
          </p>
          <Link href="/shop" className={buttonVariants({ size: "lg", className: "rounded-full px-8" })}>
            <ShoppingBag className="w-4 h-4 mr-2" />
            Continue Shopping
          </Link>
        </div>
      )}
    </div>
  );
}
