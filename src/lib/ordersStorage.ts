import fs from 'fs';
import path from 'path';
import { createClient } from '@/utils/supabase/server';
import crypto from 'crypto';

export interface OrderItem {
  id?: string;
  order_id?: string;
  product_id?: string;
  product_title: string;
  size: string;
  price: number;
  quantity: number;
  image_url?: string;
}

export interface Order {
  id: string;
  order_number: string;
  customer_first_name: string;
  customer_last_name: string;
  customer_email: string;
  customer_phone: string;
  street_address: string;
  city: string;
  postal_code: string;
  total_amount: number;
  payment_method: string;
  payment_screenshot_url: string | null;
  payment_status: 'pending_verification' | 'verified' | 'rejected';
  order_status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  notes?: string;
  created_at: string;
  updated_at?: string;
  items: OrderItem[];
}

const ORDERS_FILE_PATH = path.join(process.cwd(), 'src', 'data', 'orders.json');

/**
 * Read local orders from src/data/orders.json
 */
function readLocalOrders(): Order[] {
  try {
    if (!fs.existsSync(ORDERS_FILE_PATH)) {
      return [];
    }
    const content = fs.readFileSync(ORDERS_FILE_PATH, 'utf-8');
    return JSON.parse(content) as Order[];
  } catch (error) {
    console.error('Error reading local orders file:', error);
    return [];
  }
}

/**
 * Write local orders to src/data/orders.json
 */
function writeLocalOrders(orders: Order[]): void {
  try {
    const dir = path.dirname(ORDERS_FILE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(ORDERS_FILE_PATH, JSON.stringify(orders, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error writing local orders file:', error);
  }
}

export interface CreateOrderInput {
  customer_first_name: string;
  customer_last_name: string;
  customer_email: string;
  customer_phone: string;
  street_address: string;
  city: string;
  postal_code: string;
  total_amount: number;
  payment_method?: string;
  payment_screenshot_url?: string | null;
  notes?: string;
  items: Array<{
    product_id?: string;
    product_title: string;
    size: string;
    price: number;
    quantity: number;
    image_url?: string;
  }>;
}

/**
 * Generate human-friendly order number: NQ-YYYY-XXXX
 */
function generateOrderNumber(): string {
  const year = new Date().getFullYear();
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  return `NQ-${year}-${randomSuffix}`;
}

/**
 * Create a new order: saves to Supabase and persists locally for fallback
 */
export async function createOrder(input: CreateOrderInput): Promise<Order> {
  const orderId = crypto.randomUUID();
  const orderNumber = generateOrderNumber();
  const now = new Date().toISOString();

  const newOrder: Order = {
    id: orderId,
    order_number: orderNumber,
    customer_first_name: input.customer_first_name,
    customer_last_name: input.customer_last_name,
    customer_email: input.customer_email,
    customer_phone: input.customer_phone,
    street_address: input.street_address,
    city: input.city,
    postal_code: input.postal_code,
    total_amount: input.total_amount,
    payment_method: input.payment_method || 'bank_transfer',
    payment_screenshot_url: input.payment_screenshot_url || null,
    payment_status: 'pending_verification',
    order_status: 'pending',
    notes: input.notes,
    created_at: now,
    updated_at: now,
    items: input.items.map(item => ({
      id: crypto.randomUUID(),
      order_id: orderId,
      product_id: item.product_id,
      product_title: item.product_title,
      size: item.size,
      price: item.price,
      quantity: item.quantity,
      image_url: item.image_url,
    })),
  };

  // 1. Always save locally first to guarantee persistence
  try {
    const localOrders = readLocalOrders();
    localOrders.unshift(newOrder);
    writeLocalOrders(localOrders);
  } catch (err) {
    console.warn('Could not write order locally:', err);
  }

  // 2. Attempt saving to Supabase
  try {
    const supabase = await createClient();
    const { error: orderError } = await supabase.from('orders').insert({
      id: newOrder.id,
      order_number: newOrder.order_number,
      customer_first_name: newOrder.customer_first_name,
      customer_last_name: newOrder.customer_last_name,
      customer_email: newOrder.customer_email,
      customer_phone: newOrder.customer_phone,
      street_address: newOrder.street_address,
      city: newOrder.city,
      postal_code: newOrder.postal_code,
      total_amount: newOrder.total_amount,
      payment_method: newOrder.payment_method,
      payment_screenshot_url: newOrder.payment_screenshot_url,
      payment_status: newOrder.payment_status,
      order_status: newOrder.order_status,
      notes: newOrder.notes,
      created_at: newOrder.created_at,
      updated_at: newOrder.updated_at,
    });

    if (!orderError && newOrder.items.length > 0) {
      await supabase.from('order_items').insert(
        newOrder.items.map(item => ({
          id: item.id,
          order_id: newOrder.id,
          product_id: item.product_id || null,
          product_title: item.product_title,
          size: item.size,
          price: item.price,
          quantity: item.quantity,
          image_url: item.image_url,
          created_at: now,
        }))
      );
    }
  } catch (supabaseErr) {
    console.warn('Supabase order insert notice (using local store):', supabaseErr);
  }

  return newOrder;
}

/**
 * Retrieve all orders: merges Supabase records with local JSON orders
 */
export async function getAllOrders(): Promise<Order[]> {
  const localOrders = readLocalOrders();
  const orderMap = new Map<string, Order>();

  // Add local orders first
  for (const order of localOrders) {
    orderMap.set(order.id, order);
  }

  // Query Supabase
  try {
    const supabase = await createClient();
    const { data: supaOrders, error } = await supabase
      .from('orders')
      .select('*, order_items(*)')
      .order('created_at', { ascending: false });

    if (!error && supaOrders) {
      for (const row of supaOrders) {
        const order: Order = {
          id: row.id,
          order_number: row.order_number,
          customer_first_name: row.customer_first_name,
          customer_last_name: row.customer_last_name,
          customer_email: row.customer_email,
          customer_phone: row.customer_phone,
          street_address: row.street_address,
          city: row.city,
          postal_code: row.postal_code,
          total_amount: Number(row.total_amount),
          payment_method: row.payment_method || 'bank_transfer',
          payment_screenshot_url: row.payment_screenshot_url,
          payment_status: row.payment_status,
          order_status: row.order_status,
          notes: row.notes,
          created_at: row.created_at,
          updated_at: row.updated_at,
          items: (row.order_items || []).map((item: any) => ({
            id: item.id,
            order_id: item.order_id,
            product_id: item.product_id,
            product_title: item.product_title,
            size: item.size,
            price: Number(item.price),
            quantity: item.quantity,
            image_url: item.image_url,
          })),
        };
        orderMap.set(order.id, order);
      }
    }
  } catch (err) {
    console.warn('Supabase query failed, returning local orders:', err);
  }

  // Sort descending by created_at
  const allOrders = Array.from(orderMap.values());
  allOrders.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  return allOrders;
}

/**
 * Update an order's payment or order status
 */
export async function updateOrderStatus(
  orderId: string,
  updates: {
    payment_status?: Order['payment_status'];
    order_status?: Order['order_status'];
  }
): Promise<boolean> {
  const now = new Date().toISOString();

  // 1. Update locally
  const localOrders = readLocalOrders();
  const index = localOrders.findIndex(o => o.id === orderId);
  if (index > -1) {
    localOrders[index] = {
      ...localOrders[index],
      ...updates,
      updated_at: now,
    };
    writeLocalOrders(localOrders);
  }

  // 2. Update in Supabase
  try {
    const supabase = await createClient();
    await supabase
      .from('orders')
      .update({
        ...updates,
        updated_at: now,
      })
      .eq('id', orderId);
  } catch (err) {
    console.warn('Supabase order update notice:', err);
  }

  return true;
}

/**
 * Delete an order by ID or order number
 */
export async function deleteOrder(orderId: string): Promise<boolean> {
  // 1. Remove from local JSON
  const localOrders = readLocalOrders();
  const filtered = localOrders.filter(o => o.id !== orderId && o.order_number !== orderId);
  writeLocalOrders(filtered);

  // 2. Remove from Supabase
  try {
    const supabase = await createClient();
    await supabase.from('orders').delete().or(`id.eq.${orderId},order_number.eq.${orderId}`);
  } catch (err) {
    console.warn('Supabase delete error:', err);
  }

  return true;
}

