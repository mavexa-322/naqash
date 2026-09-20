'use server';

import { addStoredCategory, deleteStoredCategory, updateStoredCategory } from '@/lib/categoriesStorage';
import { revalidatePath } from 'next/cache';
import { verifyAdminSession } from '@/lib/auth/adminAuth';

export interface CreateCategoryInput {
  name: string;
  slug?: string;
  description?: string;
  imageUrl?: string;
}

export async function createCategoryAction(input: CreateCategoryInput) {
  const session = await verifyAdminSession();
  if (!session.isAuthenticated) {
    return { success: false, error: 'Unauthorized: Administrator privileges required.' };
  }

  if (!input.name || input.name.trim().length === 0) {
    return { success: false, error: 'Category name is required.' };
  }

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
    const newCategory = await addStoredCategory({
      name: input.name.trim(),
      slug,
      description: input.description?.trim() || null,
      image_url: input.imageUrl?.trim() || null,
    });

    revalidatePath('/admin/categories');
    revalidatePath('/admin');
    revalidatePath('/shop');
    revalidatePath('/');

    return { success: true, category: newCategory };
  } catch (error) {
    console.error('Error creating category:', error);
    return { success: false, error: (error as Error).message || 'Failed to create category.' };
  }
}

export interface UpdateCategoryInput {
  name?: string;
  slug?: string;
  description?: string;
  imageUrl?: string;
}

export async function updateCategoryAction(categoryId: string, input: UpdateCategoryInput) {
  const session = await verifyAdminSession();
  if (!session.isAuthenticated) {
    return { success: false, error: 'Unauthorized: Administrator privileges required.' };
  }

  if (!categoryId) {
    return { success: false, error: 'Category ID is required.' };
  }

  try {
    const updated = await updateStoredCategory(categoryId, {
      name: input.name,
      slug: input.slug,
      description: input.description,
      image_url: input.imageUrl,
    });

    if (!updated) {
      return { success: false, error: 'Category not found.' };
    }

    revalidatePath('/admin/categories');
    revalidatePath('/admin');
    revalidatePath('/shop');
    revalidatePath('/');

    return { success: true, category: updated };
  } catch (error) {
    console.error('Error updating category:', error);
    return { success: false, error: (error as Error).message || 'Failed to update category.' };
  }
}

export async function deleteCategoryAction(categoryId: string) {
  const session = await verifyAdminSession();
  if (!session.isAuthenticated) {
    return { success: false, error: 'Unauthorized: Administrator privileges required.' };
  }

  if (!categoryId) {
    return { success: false, error: 'Category ID is required.' };
  }

  try {
    await deleteStoredCategory(categoryId);

    revalidatePath('/admin/categories');
    revalidatePath('/admin');
    revalidatePath('/shop');
    revalidatePath('/');

    return { success: true };
  } catch (error) {
    console.error('Error deleting category:', error);
    return { success: false, error: (error as Error).message || 'Failed to delete category.' };
  }
}
