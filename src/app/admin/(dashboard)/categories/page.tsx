import { getStoredCategories } from '@/lib/categoriesStorage';
import { CategoriesListClient } from './CategoriesListClient';

export const metadata = {
  title: 'Categories Management | Naqash Admin',
};

export default async function AdminCategoriesPage() {
  const categories = await getStoredCategories();

  return <CategoriesListClient initialCategories={categories} />;
}
