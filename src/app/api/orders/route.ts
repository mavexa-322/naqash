import { NextRequest, NextResponse } from 'next/server';
import { createOrder, CreateOrderInput } from '@/lib/ordersStorage';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Basic validation
    if (!body.customer_first_name || !body.customer_last_name || !body.customer_phone || !body.customer_email) {
      return NextResponse.json(
        { success: false, error: 'Please provide all required customer details.' },
        { status: 400 }
      );
    }

    if (!body.items || !Array.isArray(body.items) || body.items.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Order must contain at least one item.' },
        { status: 400 }
      );
    }

    if (!body.payment_screenshot_url) {
      return NextResponse.json(
        { success: false, error: 'Please upload a payment screenshot receipt to complete your order.' },
        { status: 400 }
      );
    }

    const orderInput: CreateOrderInput = {
      customer_first_name: body.customer_first_name.trim(),
      customer_last_name: body.customer_last_name.trim(),
      customer_email: body.customer_email.trim(),
      customer_phone: body.customer_phone.trim(),
      street_address: body.street_address.trim(),
      city: body.city.trim(),
      postal_code: body.postal_code?.trim() || '',
      total_amount: Number(body.total_amount),
      payment_method: body.payment_method || 'bank_transfer',
      payment_screenshot_url: body.payment_screenshot_url,
      notes: body.notes?.trim() || undefined,
      items: body.items.map((item: any) => ({
        product_id: item.productId || item.product_id,
        product_title: item.title || item.product_title,
        size: item.size || 'Standard',
        price: Number(item.price),
        quantity: Number(item.quantity) || 1,
        image_url: item.image || item.image_url,
      })),
    };

    const order = await createOrder(orderInput);

    return NextResponse.json({
      success: true,
      order: {
        id: order.id,
        order_number: order.order_number,
        total_amount: order.total_amount,
        customer_name: `${order.customer_first_name} ${order.customer_last_name}`,
      },
    });
  } catch (error: any) {
    console.error('API /api/orders error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'An error occurred while creating the order.' },
      { status: 500 }
    );
  }
}
