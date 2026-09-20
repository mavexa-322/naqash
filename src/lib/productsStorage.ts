import fs from 'fs';
import path from 'path';
import { createClient } from '@/utils/supabase/server';

export interface ProductOverride {
  title?: string;
  description?: string;
  basePrice?: number;
  salePrice?: number | null;
  badge?: 'sale' | 'bestseller' | 'new' | null;
  collection?: string;
  collectionSlug?: string;
  materials?: string[];
  sizes?: string[];
  colors?: string[];
  image?: string;
  images?: string[];
}

const DATA_FILE_PATH = path.join(process.cwd(), 'src', 'data', 'productOverrides.json');

/**
 * Safely read local product overrides
 */
export function getProductOverrides(): Record<string, ProductOverride> {
  try {
    if (!fs.existsSync(DATA_FILE_PATH)) {
      return {};
    }
    const content = fs.readFileSync(DATA_FILE_PATH, 'utf-8');
    return JSON.parse(content || '{}');
  } catch (err) {
    console.error('Error reading product overrides:', err);
    return {};
  }
}

/**
 * Safely write local product overrides
 */
export function writeProductOverrides(overrides: Record<string, ProductOverride>): void {
  try {
    const dir = path.dirname(DATA_FILE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE_PATH, JSON.stringify(overrides, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing product overrides:', err);
  }
}

/**
 * Update sale price and badge for a product in local JSON and Supabase
 */
export async function setProductSaleOverride(
  productId: string,
  salePrice: number | null,
  badge?: 'sale' | 'bestseller' | 'new' | null
): Promise<void> {
  // 1. Update local JSON override
  const current = getProductOverrides();
  current[productId] = {
    ...current[productId],
    salePrice,
    badge,
  };
  writeProductOverrides(current);

  // 2. Try updating in Supabase
  try {
    const supabase = await createClient();
    await supabase
      .from('products')
      .update({
        sale_price: salePrice,
        badge: badge,
        updated_at: new Date().toISOString(),
      })
      .eq('id', productId);
  } catch (err) {
    console.warn('Supabase sync skipped for product sale update:', err);
  }
}

/**
 * Update full product attributes in local JSON and Supabase
 */
export async function setProductFullOverride(
  productId: string,
  override: Partial<ProductOverride> & { collectionId?: string | null }
): Promise<void> {
  // 1. Update local JSON override
  const current = getProductOverrides();
  current[productId] = {
    ...current[productId],
    ...override,
  };
  writeProductOverrides(current);

  // 2. Try updating in Supabase
  try {
    const supabase = await createClient();
    const updatePayload: Record<string, any> = {
      updated_at: new Date().toISOString(),
    };
    if (override.title !== undefined) updatePayload.title = override.title;
    if (override.description !== undefined) updatePayload.description = override.description;
    if (override.basePrice !== undefined) updatePayload.base_price = override.basePrice;
    if (override.salePrice !== undefined) updatePayload.sale_price = override.salePrice;
    if (override.badge !== undefined) updatePayload.badge = override.badge;
    if (override.collectionId !== undefined) updatePayload.collection_id = override.collectionId;

    await supabase
      .from('products')
      .update(updatePayload)
      .eq('id', productId);
  } catch (err) {
    console.warn('Supabase sync skipped for full product update:', err);
  }
}
