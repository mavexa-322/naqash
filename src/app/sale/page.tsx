import { getSaleProducts } from '@/lib/catalog';
import { SaleClient } from './SaleClient';

export const metadata = {
  title: 'The Archive Sale | Handcrafted Heirloom Rugs | Naqash Carpets Gallery',
  description: 'Acquire rare master-woven Persian, Bokhara, and contemporary collector rugs at exceptional archive pricing.',
};

export const dynamic = 'force-dynamic';

export default async function SalePage() {
  const saleProducts = await getSaleProducts();

  return <SaleClient initialProducts={saleProducts} />;
}
