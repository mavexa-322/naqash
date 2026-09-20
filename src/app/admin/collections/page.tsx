import { getCollections } from "@/lib/catalog";
import { CollectionsListClient } from "./CollectionsListClient";

export const dynamic = 'force-dynamic';

export default async function AdminCollectionsPage() {
  const collections = await getCollections();

  return <CollectionsListClient initialCollections={collections} />;
}
