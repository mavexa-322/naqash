'use server';

import { addStoredCollection, deleteStoredCollection } from '@/lib/collectionsStorage';
import { revalidatePath } from 'next/cache';
import { verifyAdminSession } from '@/lib/auth/adminAuth';

export interface CreateCollectionInput {
  name: string;
  slug?: string;
  description?: string;
  bannerUrl?: string;
}

export async function createCollectionAction(input: CreateCollectionInput) {
  const session = await verifyAdminSession();
  if (!session.isAuthenticated) {
    return { success: false, error: 'Unauthorized: Administrator privileges required.' };
  }

  if (!input.name || input.name.trim().length === 0) {
    return { success: false, error: 'Collection name is required.' };
  }

  // Generate URL slug from title if not explicitly provided
  const slug = (input.slug || input.name)
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/--+/g, '-')
    .trim();

  if (!slug) {
    return { success: false, error: 'A valid URL slug could not be generated.' };
  }

  try {
    const newCollection = await addStoredCollection({
      name: input.name.trim(),
      slug,
      description: input.description?.trim() || null,
      banner_url: input.bannerUrl?.trim() || null,
    });

    revalidatePath('/collections');
    revalidatePath(`/collections/${slug}`);
    revalidatePath('/admin/collections');
    revalidatePath('/shop');
    revalidatePath('/');

    return { success: true, collection: newCollection };
  } catch (error) {
    console.error('Error creating collection:', error);
    return { success: false, error: (error as Error).message || 'Failed to create collection.' };
  }
}

export async function deleteCollectionAction(collectionId: string) {
  const session = await verifyAdminSession();
  if (!session.isAuthenticated) {
    return { success: false, error: 'Unauthorized: Administrator privileges required.' };
  }

  if (!collectionId) {
    return { success: false, error: 'Collection ID is required.' };
  }

  try {
    await deleteStoredCollection(collectionId);

    revalidatePath('/collections');
    revalidatePath('/admin/collections');
    revalidatePath('/shop');
    revalidatePath('/');

    return { success: true };
  } catch (error) {
    console.error('Error deleting collection:', error);
    return { success: false, error: (error as Error).message || 'Failed to delete collection.' };
  }
}
