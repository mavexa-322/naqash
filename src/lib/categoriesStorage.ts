import fs from 'fs';
import path from 'path';
import { createClient } from '@/utils/supabase/server';

export interface StoredCategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
}

const DATA_FILE_PATH = path.join(process.cwd(), 'src', 'data', 'categories.json');

const DEFAULT_CATEGORIES: StoredCategory[] = [
  {
    id: '22222222-2222-2222-2222-222222222201',
    name: 'Traditional & Persian',
    slug: 'traditional-persian',
    description: 'Timeless artisanal rugs featuring historic motifs and medallion patterns hand-knotted by generational masters.',
    image_url: '/rugs/persian-heritage.jpg',
  },
  {
    id: '22222222-2222-2222-2222-222222222202',
    name: 'Modern & Contemporary',
    slug: 'modern-contemporary',
    description: 'Clean architectural lines and serene palettes crafted for modern living and architectural spaces.',
    image_url: '/rugs/modern-minimal.jpg',
  },
  {
    id: '22222222-2222-2222-2222-222222222203',
    name: 'Vintage & Overdyed',
    slug: 'vintage-overdyed',
    description: 'Distressed antique heirlooms renewed through artisanal over-dyeing and sun-fading techniques.',
    image_url: '/rugs/vintage-overdyed.jpg',
  },
  {
    id: '22222222-2222-2222-2222-222222222204',
    name: 'Tribal & Kilim',
    slug: 'tribal-kilim',
    description: 'Nomadic geometric flat-weaves and authentic cultural storytelling from heritage weaving centers.',
    image_url: '/rugs/bokhara-red.jpg',
  },
];

function readLocalCategories(): StoredCategory[] {
  try {
    if (!fs.existsSync(DATA_FILE_PATH)) {
      writeLocalCategories(DEFAULT_CATEGORIES);
      return DEFAULT_CATEGORIES;
    }
    const content = fs.readFileSync(DATA_FILE_PATH, 'utf-8');
    const parsed = JSON.parse(content) as StoredCategory[];
    if (parsed.length === 0) {
      writeLocalCategories(DEFAULT_CATEGORIES);
      return DEFAULT_CATEGORIES;
    }
    return parsed;
  } catch (error) {
    console.error('Error reading local categories file:', error);
    return DEFAULT_CATEGORIES;
  }
}

function writeLocalCategories(categories: StoredCategory[]): void {
  try {
    const dir = path.dirname(DATA_FILE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE_PATH, JSON.stringify(categories, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error writing local categories file:', error);
  }
}

/**
 * Fetch all categories: tries Supabase first, falls back to local JSON store
 */
export async function getStoredCategories(): Promise<StoredCategory[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('categories')
      .select('id, name, slug, description, image_url')
      .order('name');

    if (!error && data && data.length > 0) {
      return data as StoredCategory[];
    }
  } catch {
    // Supabase unreachable or failed; fall back to local storage
  }

  return readLocalCategories();
}

/**
 * Add a new category to local storage and Supabase
 */
export async function addStoredCategory(category: Omit<StoredCategory, 'id'> & { id?: string }): Promise<StoredCategory> {
  const newCategory: StoredCategory = {
    id: category.id || crypto.randomUUID(),
    name: category.name.trim(),
    slug: category.slug.trim(),
    description: category.description || null,
    image_url: category.image_url || null,
  };

  const current = readLocalCategories();
  const updated = [...current.filter((c) => c.slug !== newCategory.slug && c.id !== newCategory.id), newCategory];
  writeLocalCategories(updated);

  try {
    const supabase = await createClient();
    await supabase.from('categories').upsert({
      id: newCategory.id,
      name: newCategory.name,
      slug: newCategory.slug,
      description: newCategory.description,
      image_url: newCategory.image_url,
    });
  } catch (err) {
    console.warn('Supabase sync skipped for new category:', err);
  }

  return newCategory;
}

/**
 * Update an existing category
 */
export async function updateStoredCategory(
  id: string,
  data: { name?: string; slug?: string; description?: string | null; image_url?: string | null }
): Promise<StoredCategory | null> {
  const current = readLocalCategories();
  const index = current.findIndex((c) => c.id === id);
  if (index === -1) return null;

  const updatedItem: StoredCategory = {
    ...current[index],
    ...(data.name !== undefined ? { name: data.name.trim() } : {}),
    ...(data.slug !== undefined ? { slug: data.slug.trim() } : {}),
    ...(data.description !== undefined ? { description: data.description ? data.description.trim() : null } : {}),
    ...(data.image_url !== undefined ? { image_url: data.image_url ? data.image_url.trim() : null } : {}),
  };

  current[index] = updatedItem;
  writeLocalCategories(current);

  try {
    const supabase = await createClient();
    await supabase
      .from('categories')
      .update({
        ...(data.name !== undefined ? { name: updatedItem.name } : {}),
        ...(data.slug !== undefined ? { slug: updatedItem.slug } : {}),
        ...(data.description !== undefined ? { description: updatedItem.description } : {}),
        ...(data.image_url !== undefined ? { image_url: updatedItem.image_url } : {}),
      })
      .eq('id', id);
  } catch (err) {
    console.warn('Supabase category update sync skipped:', err);
  }

  return updatedItem;
}

/**
 * Delete a category by ID
 */
export async function deleteStoredCategory(id: string): Promise<boolean> {
  const current = readLocalCategories();
  const filtered = current.filter((c) => c.id !== id);
  writeLocalCategories(filtered);

  try {
    const supabase = await createClient();
    await supabase.from('categories').delete().eq('id', id);
  } catch (err) {
    console.warn('Supabase sync skipped for delete category:', err);
  }

  return true;
}
