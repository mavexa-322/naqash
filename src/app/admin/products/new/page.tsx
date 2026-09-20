import { getCollections } from '@/lib/catalog';
import { AddProductForm } from './AddProductForm';

export const dynamic = 'force-dynamic';

export default async function AddProductPage() {
  const collections = await getCollections();

  return <AddProductForm collections={collections} />;
}
