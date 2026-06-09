import { redirect } from 'next/navigation';
import { isAdminAuthenticated } from '@/lib/auth';
import { redis } from '@/lib/redis';
import { properties } from '@/lib/properties';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

// Noms lisibles (on ne peut pas utiliser next-intl côté admin sans locale)
const PROPERTY_NAMES: Record<string, string> = {
  'risoul': 'Appartement Risoul 1850',
  'avignon': 'Appartement Avignon Intramuros',
  'lauris-meme': 'Maison de Mémé',
  'lauris-atelier': 'L\'Atelier',
  'lauris-alain': 'Maison d\'Alain',
};

export default async function AdminPhotosPage() {
  const ok = await isAdminAuthenticated();
  if (!ok) redirect('/admin/login');

  // Pour chaque bien, compter les photos (Redis > défaut)
  const propertiesWithCounts = await Promise.all(
    properties.map(async (p) => {
      let images = p.images;
      let isOverride = false;
      try {
        const stored = await redis.get(`property-photos:${p.id}`);
        if (Array.isArray(stored) && stored.length > 0) {
          images = stored as string[];
          isOverride = true;
        }
      } catch { /* use defaults */ }
      return { ...p, currentImages: images, isOverride };
    })
  );

  return (
    <div className="min-h-screen bg-[#FAF7F2] p-4 sm:p-6">
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div>
            <a href="/admin" className="text-sm text-[#9B8A74] hover:text-[#5C4F3A] transition-colors">
              ← Tableau de bord
            </a>
            <h1 className="text-2xl font-bold text-[#2C2416] mt-1">Gestion des photos</h1>
            <p className="text-sm text-[#9B8A74]">Modifiez, réordonnez et uploadez les photos de chaque bien</p>
          </div>
        </div>

        {/* Liste des biens */}
        <div className="space-y-3">
          {propertiesWithCounts.map(p => (
            <Link
              key={p.id}
              href={`/admin/photos/${p.id}`}
              className="flex items-center gap-4 bg-white rounded-2xl border border-[#EDE6DC] p-4 hover:border-[#C8763A]/40 hover:shadow-md transition-all group"
            >
              {/* Miniature */}
              <div
                className="w-16 h-16 rounded-xl bg-cover bg-center flex-shrink-0 border border-[#EDE6DC]"
                style={{ backgroundImage: `url(${p.currentImages[0]})` }}
              />

              {/* Infos */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="font-semibold text-[#2C2416] group-hover:text-[#C8763A] transition-colors">
                    {PROPERTY_NAMES[p.id] ?? p.id}
                  </h2>
                  {p.isOverride && (
                    <span className="text-[10px] font-bold bg-[#C8763A]/10 text-[#C8763A] px-2 py-0.5 rounded-full">
                      Personnalisé
                    </span>
                  )}
                </div>
                <p className="text-sm text-[#9B8A74]">
                  {p.currentImages.length} photo{p.currentImages.length > 1 ? 's' : ''}
                </p>
              </div>

              {/* Flèche */}
              <div className="text-[#9B8A74] group-hover:text-[#C8763A] transition-colors text-xl flex-shrink-0">
                →
              </div>
            </Link>
          ))}
        </div>

      </div>
    </div>
  );
}
