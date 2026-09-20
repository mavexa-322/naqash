'use server';

import { verifyAdminSession } from '@/lib/auth/adminAuth';
import { updateOrderStatus, deleteOrder, Order } from '@/lib/ordersStorage';
import { revalidatePath } from 'next/cache';

export async function updateOrderStatusAction(
  orderId: string,
  updates: {
    payment_status?: Order['payment_status'];
    order_status?: Order['order_status'];
  }
) {
  const session = await verifyAdminSession();
  if (!session.isAuthenticated) {
    return { success: false, error: 'Unauthorized: Administrator privileges required.' };
  }

  try {
    await updateOrderStatus(orderId, updates);
    revalidatePath('/admin/orders');
    return { success: true };
  } catch (err: any) {
    console.error('Error updating order status:', err);
    return { success: false, error: err.message || 'Failed to update order status.' };
  }
}

export async function deleteOrderAction(orderId: string) {
  const session = await verifyAdminSession();
  if (!session.isAuthenticated) {
    return { success: false, error: 'Unauthorized: Administrator privileges required.' };
  }

  try {
    await deleteOrder(orderId);
    revalidatePath('/admin/orders');
    return { success: true };
  } catch (err: any) {
    console.error('Error deleting order:', err);
    return { success: false, error: err.message || 'Failed to delete order.' };
  }
}
