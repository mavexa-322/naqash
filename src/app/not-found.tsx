import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button';
import { SearchX } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 py-16 text-center">
      <div className="bg-muted/30 p-6 rounded-full mb-8">
        <SearchX className="h-16 w-16 text-primary" />
      </div>
      
      <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
        Page Not Found
      </h1>
      
      <p className="text-muted-foreground text-lg max-w-md mb-8">
        We&apos;re sorry, the page you requested could not be found. It might have been moved, deleted, or perhaps you just mistyped the address.
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <Link href="/" className={buttonVariants({ size: "lg", className: "rounded-full px-8" })}>
          Return to Homepage
        </Link>
        <Link href="/shop" className={buttonVariants({ variant: "outline", size: "lg", className: "rounded-full px-8" })}>
          Explore Collections
        </Link>
      </div>
    </div>
  );
}
