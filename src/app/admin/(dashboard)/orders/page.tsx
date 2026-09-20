import { getAllOrders } from '@/lib/ordersStorage';
import { OrdersListClient } from './OrdersListClient';

export const dynamic = 'force-dynamic';

export default async function AdminOrdersPage() {
  const orders = await getAllOrders();

  return <OrdersListClient initialOrders={orders} />;
}
