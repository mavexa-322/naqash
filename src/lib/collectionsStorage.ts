import fs from 'fs';
import path from 'path';
import { createClient } from '@/utils/supabase/server';

export interface StoredCollection {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  banner_url: string | null;
}

const DATA_FILE_PATH = path.join(process.cwd(), 'src', 'data', 'collections.json');

/**
 * Read local collections JSON file safely
 */
function readLocalCollections(): StoredCollection[] {
  try {
    if (!fs.existsSync(DATA_FILE_PATH)) {
      return [];
    }
    const content = fs.readFileSync(DATA_FILE_PATH, 'utf-8');
    return JSON.parse(content) as StoredCollection[];
  } catch (error) {
    console.error('Error reading local collections file:', error);
    return [];
  }
}

/**
 * Write local collections JSON file safely
 */
function writeLocalCollections(collections: StoredCollection[]): void {
  try {
    const dir = path.dirname(DATA_FILE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE_PATH, JSON.stringify(collections, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error writing local collections file:', error);
  }
}

/**
 * Fetch all collections: tries Supabase first, falls back to local JSON store
 */
export async function getStoredCollections(): Promise<StoredCollection[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('collections')
      .select('id, name, slug, description, banner_url')
      .order('name');

    if (!error && data && data.length > 0) {
      return data as StoredCollection[];
    }
  } catch {
    // Supabase unreachable or failed; fall back to local storage
  }

  return readLocalCollections();
}

/**
 * Add a new collection to local storage and Supabase
 */
export async function addStoredCollection(collection: Omit<StoredCollection, 'id'> & { id?: string }): Promise<StoredCollection> {
  const newCollection: StoredCollection = {
    id: collection.id || crypto.randomUUID(),
    name: collection.name.trim(),
    slug: collection.slug.trim(),
    description: collection.description || null,
    banner_url: collection.banner_url || null,
  };

  // 1. Update local JSON storage
  const current = readLocalCollections();
  // Filter out any duplicate slug just in case
  const updated = [...current.filter((c) => c.slug !== newCollection.slug && c.id !== newCollection.id), newCollection];
  writeLocalCollections(updated);

  // 2. Try persisting to Supabase in parallel
  try {
    const supabase = await createClient();
    await supabase.from('collections').upsert({
      id: newCollection.id,
      name: newCollection.name,
      slug: newCollection.slug,
      description: newCollection.description,
      banner_url: newCollection.banner_url,
    });
  } catch (err) {
    console.warn('Supabase sync skipped for new collection:', err);
  }

  return newCollection;
}

/**
 * Delete a collection by ID from local storage and Supabase
 */
export async function deleteStoredCollection(id: string): Promise<boolean> {
  // 1. Update local JSON storage
  const current = readLocalCollections();
  const filtered = current.filter((c) => c.id !== id);
  writeLocalCollections(filtered);

  // 2. Try deleting from Supabase
  try {
    const supabase = await createClient();
    await supabase.from('collections').delete().eq('id', id);
  } catch (err) {
    console.warn('Supabase sync skipped for delete collection:', err);
  }

  return true;
}
