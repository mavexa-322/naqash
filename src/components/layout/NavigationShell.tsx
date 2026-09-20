'use client';

import { usePathname } from 'next/navigation';
import { Header } from '@/components/ui/Header';
import { Footer } from '@/components/ui/Footer';

import { CartDrawer } from '@/components/ui/CartDrawer';

interface NavigationShellProps {
  children: React.ReactNode;
}

export function NavigationShell({ children }: NavigationShellProps) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');

  if (isAdmin) {
    // Admin routes do not include public store Header or Footer
    return <div className="flex-1 flex flex-col min-h-screen">{children}</div>;
  }

  return (
    <>
      <Header />
      <CartDrawer />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </>
  );
}
