import { redirect } from 'next/navigation';
import { isAdminAuthenticated } from '@/lib/auth';
import { redis } from '@/lib/redis';
import { properties } from '@/lib/properties';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

const PROPERTY_NAMES: Record<string, string> = {
  'risoul': 'Appartement Risoul 1850',
  'avignon': 'Appartement Avignon Intramuros',
  'lauris-meme': 'Maison de Mémé',
  'lauris-atelier': "L'Atelier",
  'lauris-alain': "Maison d'Alain",
};

export default async function AdminPhotosPage() {
  const ok = await isAdminAuthenticated();
  if (!ok) redirect('/admin/login');

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
    <div className="px-6 py-6 max-w-3xl">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-white">Gestion des photos</h1>
        <p className="text-sm text-white/40 mt-1">Modifiez, réordonnez et uploadez les photos de chaque bien.</p>
      </div>

      <div className="space-y-2">
        {propertiesWithCounts.map((p) => (
          <Link
            key={p.id}
            href={`/admin/photos/${p.id}`}
            className="flex items-center gap-4 bg-white/[0.04] border border-white/[0.08] rounded-2xl p-4 hover:bg-white/[0.07] hover:border-white/15 transition-all group"
          >
            {/* Miniature */}
            <div
              className="w-14 h-14 rounded-xl bg-cover bg-center flex-shrink-0 border border-white/10"
              style={{ backgroundImage: `url(${p.currentImages[0]})` }}
            />

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="font-semibold text-white/85 group-hover:text-white transition-colors text-sm">
                  {PROPERTY_NAMES[p.id] ?? p.id}
                </h2>
                {p.isOverride && (
                  <span className="text-[10px] font-bold bg-[#C8763A]/15 text-[#E8914A] px-2 py-0.5 rounded-full border border-[#C8763A]/20">
                    Personnalisé
                  </span>
                )}
              </div>
              <p className="text-xs text-white/30 mt-0.5">
                {p.currentImages.length} photo{p.currentImages.length > 1 ? 's' : ''}
              </p>
            </div>

            <svg className="w-4 h-4 text-white/20 group-hover:text-white/50 transition-colors flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        ))}
      </div>
    </div>
  );
}
