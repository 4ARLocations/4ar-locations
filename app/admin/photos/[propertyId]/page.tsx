import { redirect } from 'next/navigation';
import { isAdminAuthenticated } from '@/lib/auth';
import { properties } from '@/lib/properties';
import { getPropertyImages, getPhotoCategories } from '@/lib/property-images';
import PhotoManager from '@/components/admin/PhotoManager';

export const dynamic = 'force-dynamic';

const PROPERTY_NAMES: Record<string, string> = {
  'risoul': 'Appartement Risoul 1850',
  'avignon': 'Appartement Avignon Intramuros',
  'lauris-meme': 'Maison de Mémé',
  'lauris-atelier': 'L\'Atelier',
  'lauris-alain': 'Maison d\'Alain',
};

export default async function AdminPropertyPhotosPage({
  params,
}: {
  params: Promise<{ propertyId: string }>;
}) {
  const ok = await isAdminAuthenticated();
  if (!ok) redirect('/admin/login');

  const { propertyId } = await params;
  const property = properties.find(p => p.id === propertyId);
  if (!property) redirect('/admin/photos');

  const [images, categories] = await Promise.all([
    getPropertyImages(propertyId, property.images),
    getPhotoCategories(propertyId),
  ]);
  const hasUpload = Boolean(process.env.BLOB_READ_WRITE_TOKEN);

  return (
    <PhotoManager
      propertyId={propertyId}
      propertyName={PROPERTY_NAMES[propertyId] ?? propertyId}
      initialImages={images}
      initialCategories={categories}
      hasUpload={hasUpload}
    />
  );
}
