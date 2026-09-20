'use server';

import { createClient } from '@/utils/supabase/server';
import { setProductSaleOverride } from '@/lib/productsStorage';
import { revalidatePath } from 'next/cache';

export async function toggleBestSellerAction(productId: string, currentBadge?: string | null) {
  const supabase = await createClient();
  const nextBadge = currentBadge === 'bestseller' ? null : 'bestseller';

  try {
    await setProductSaleOverride(productId, undefined as any, nextBadge);
  } catch (err) {
    console.warn('Local override update failed:', err);
  }

  const { error } = await supabase
    .from('products')
    .update({ 
      badge: nextBadge,
      updated_at: new Date().toISOString()
    })
    .eq('id', productId);

  if (error) {
    console.error('Error toggling bestseller:', error);
    return { success: false, error: error.message };
  }

  revalidatePath('/');
  revalidatePath('/sale');
  revalidatePath('/admin/products');
  revalidatePath('/shop');
  return { success: true, badge: nextBadge };
}

export async function updateProductSaleAction(
  productId: string,
  salePrice: number | null,
  badge?: 'sale' | 'bestseller' | 'new' | null
) {
  try {
    await setProductSaleOverride(productId, salePrice, badge);

    revalidatePath('/');
    revalidatePath('/sale');
    revalidatePath('/shop');
    revalidatePath('/admin/products');

    return { success: true };
  } catch (err) {
    console.error('Error updating product sale:', err);
    return { success: false, error: (err as Error).message || 'Failed to update sale' };
  }
}

export interface CreateProductInput {
  title: string;
  slug?: string;
  description?: string;
  basePrice: number;
  salePrice?: number | null;
  badge?: 'bestseller' | 'new' | 'sale' | null;
  collectionId?: string | null;
  images: string[];
}

export async function createProductAction(input: CreateProductInput) {
  const supabase = await createClient();

  // Generate URL slug from title if not explicitly provided
  const slug = (input.slug || input.title)
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/--+/g, '-')
    .trim() + `-${Date.now().toString().slice(-4)}`;

  // 1. Insert product row
  const { data: product, error: productError } = await supabase
    .from('products')
    .insert({
      title: input.title,
      slug,
      description: input.description ?? '',
      base_price: input.basePrice,
      sale_price: input.salePrice || null,
      badge: input.badge || null,
      featured: input.badge === 'bestseller',
      status: 'published',
      collection_id: input.collectionId || null,
    })
    .select('id, slug')
    .single();

  if (productError || !product) {
    console.error('Error creating product:', productError);
    return { success: false, error: productError?.message || 'Failed to create product' };
  }

  // 2. Insert Cloudinary image URLs into product_images
  if (input.images && input.images.length > 0) {
    const imageRows = input.images.map((url, index) => ({
      product_id: product.id,
      cloudinary_url: url,
      is_primary: index === 0,
      display_order: index,
    }));

    const { error: imageError } = await supabase
      .from('product_images')
      .insert(imageRows);

    if (imageError) {
      console.warn('Error associating images with product:', imageError);
    }
  }

  // 3. Create a default variant
  await supabase
    .from('product_variants')
    .insert({
      product_id: product.id,
      size: "Standard (5' x 8')",
      price: input.basePrice,
      stock: 1,
      sku: `NQ-${Date.now().toString().slice(-6)}`,
    });

  revalidatePath('/');
  revalidatePath('/admin/products');
  revalidatePath('/shop');

  return { success: true, productId: product.id, slug: product.slug };
}

export async function deleteProductAction(productId: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', productId);

  if (error) {
    console.error('Error deleting product:', error);
    return { success: false, error: error.message };
  }

  revalidatePath('/');
  revalidatePath('/admin/products');
  revalidatePath('/shop');
  return { success: true };
}
