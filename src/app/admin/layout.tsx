import { ReactNode } from 'react';
import Link from 'next/link';

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#FAF7F2] flex flex-col md:flex-row">
      <aside className="w-full md:w-64 bg-white border-r border-[#DFD7C9] p-6 flex flex-col gap-6 shrink-0 shadow-xs">
        <div>
          <Link href="/admin" className="font-heading text-xl font-bold text-burgundy tracking-tight">
            Naqash Admin
          </Link>
          <p className="text-[11px] uppercase tracking-wider text-text-muted mt-0.5">
            Gallery Management
          </p>
        </div>

        <nav className="flex flex-col gap-1.5 mt-2">
          <Link
            href="/admin"
            className="px-3 py-2 rounded-xl text-sm font-medium text-text-dark hover:bg-cream-alt hover:text-burgundy transition-colors"
          >
            Dashboard
          </Link>
          <Link
            href="/admin/products"
            className="px-3 py-2 rounded-xl text-sm font-medium text-text-dark hover:bg-cream-alt hover:text-burgundy transition-colors"
          >
            Products
          </Link>
          <Link
            href="/admin/collections"
            className="px-3 py-2 rounded-xl text-sm font-medium text-text-dark hover:bg-cream-alt hover:text-burgundy transition-colors"
          >
            Collections
          </Link>
          <Link
            href="/admin/categories"
            className="px-3 py-2 rounded-xl text-sm font-medium text-text-dark hover:bg-cream-alt hover:text-burgundy transition-colors"
          >
            Categories
          </Link>
          <Link
            href="/admin/orders"
            className="px-3 py-2 rounded-xl text-sm font-medium text-text-dark hover:bg-cream-alt hover:text-burgundy transition-colors"
          >
            Orders & Payments
          </Link>
        </nav>

        <div className="mt-auto pt-6 border-t border-[#F0EAE1]">
          <Link
            href="/collections"
            target="_blank"
            className="text-xs uppercase tracking-wider font-semibold text-burgundy hover:underline flex items-center gap-1"
          >
            View Live Site →
          </Link>
        </div>
      </aside>

      <main className="flex-1 p-6 md:p-10 max-w-7xl">
        {children}
      </main>
    </div>
  );
}
