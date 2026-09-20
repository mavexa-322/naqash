'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  FolderTree,
  Tag,
  CreditCard,
} from 'lucide-react';

const NAV_ITEMS = [
  {
    label: 'Dashboard',
    href: '/admin',
    icon: LayoutDashboard,
    exact: true,
  },
  {
    label: 'Products',
    href: '/admin/products',
    icon: Package,
    exact: false,
  },
  {
    label: 'Collections',
    href: '/admin/collections',
    icon: FolderTree,
    exact: false,
  },
  {
    label: 'Categories',
    href: '/admin/categories',
    icon: Tag,
    exact: false,
  },
  {
    label: 'Orders & Payments',
    href: '/admin/orders',
    icon: CreditCard,
    exact: false,
  },
];

export function AdminSidebarNav() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-1.5 mt-2">
      {NAV_ITEMS.map((item) => {
        const Icon = item.icon;
        const isActive = item.exact
          ? pathname === item.href
          : pathname.startsWith(item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
              isActive
                ? 'bg-[#5C1D24] text-white shadow-xs font-semibold'
                : 'text-[#3E3532] hover:bg-[#F5EFEB] hover:text-[#5C1D24]'
            }`}
          >
            <Icon
              className={`w-4 h-4 transition-colors ${
                isActive ? 'text-[#DFB772]' : 'text-[#8A7F79]'
              }`}
            />
            <span>{item.label}</span>
            {isActive && (
              <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#DFB772]" />
            )}
          </Link>
        );
      })}
    </nav>
  );
}
