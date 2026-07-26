import { redirect } from 'next/navigation';
import { isAdminAuthenticated } from '@/lib/auth';
import { properties } from '@/lib/properties';
import { getAllCustomDescriptions } from '@/lib/property-descriptions';
import DescriptionEditor from '@/components/admin/DescriptionEditor';
import frMessages from '@/messages/fr.json';
import enMessages from '@/messages/en.json';
import deMessages from '@/messages/de.json';

export const dynamic = 'force-dynamic';

const PROPERTY_NAMES: Record<string, string> = {
  risoul: 'Appartement Risoul 1850',
  avignon: 'Appartement Avignon Intramuros',
  'lauris-meme': 'Maison de Mémé',
  'lauris-atelier': "L'Atelier",
  'lauris-alain': "Maison d'Alain",
};

const DESC_KEY: Record<string, string> = {
  risoul: 'property_risoul',
  avignon: 'property_avignon',
  'lauris-meme': 'property_lauris1',
  'lauris-atelier': 'property_lauris2',
  'lauris-alain': 'property_lauris3',
};

export default async function AdminAnnoncesPropertyPage({
  params,
}: {
  params: Promise<{ propertyId: string }>;
}) {
  const ok = await isAdminAuthenticated();
  if (!ok) redirect('/admin/login');

  const { propertyId } = await params;
  const property = properties.find(p => p.id === propertyId);
  if (!property) redirect('/admin/annonces');

  const msgKey = DESC_KEY[propertyId];
  const defaults = {
    fr: (frMessages as Record<string, Record<string, string>>)[msgKey]?.description ?? '',
    en: (enMessages as Record<string, Record<string, string>>)[msgKey]?.description ?? '',
    de: (deMessages as Record<string, Record<string, string>>)[msgKey]?.description ?? '',
  };

  const custom = await getAllCustomDescriptions(propertyId);

  return (
    <DescriptionEditor
      propertyId={propertyId}
      propertyName={PROPERTY_NAMES[propertyId] ?? propertyId}
      defaults={defaults}
      saved={{
        fr: custom.fr ?? null,
        en: custom.en ?? null,
        de: custom.de ?? null,
      }}
    />
  );
}
