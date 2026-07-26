import { redirect } from 'next/navigation';
import { isAdminAuthenticated } from '@/lib/auth';
import { properties } from '@/lib/properties';
import Link from 'next/link';

const PROPERTY_NAMES: Record<string, string> = {
  risoul: 'Appartement Risoul 1850',
  avignon: 'Appartement Avignon Intramuros',
  'lauris-meme': 'Maison de Mémé',
  'lauris-atelier': "L'Atelier",
  'lauris-alain': "Maison d'Alain",
};

export default async function AdminAnnoncesPage() {
  const ok = await isAdminAuthenticated();
  if (!ok) redirect('/admin/login');

  return (
    <div className="min-h-screen bg-[#FAF7F2] p-4 sm:p-6">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-[#2C2416]">Textes des annonces</h1>
          <p className="text-sm text-[#9B8A74] mt-1">
            Modifiez les descriptions affichées sur le site (FR / EN / DE).
            Les modifications sont appliquées immédiatement.
          </p>
        </div>

        <div className="space-y-3">
          {properties.map((p) => (
            <Link
              key={p.id}
              href={`/admin/annonces/${p.id}`}
              className="flex items-center justify-between bg-white border border-[#E8DCC8] rounded-2xl px-5 py-4 hover:border-[#C8763A] hover:shadow-sm transition-all group"
            >
              <div>
                <p className="font-semibold text-[#2C2416] group-hover:text-[#C8763A] transition-colors">
                  {PROPERTY_NAMES[p.id] ?? p.id}
                </p>
                <p className="text-xs text-[#9B8A74] mt-0.5 capitalize">{p.region}</p>
              </div>
              <svg className="w-5 h-5 text-[#C8B8A0] group-hover:text-[#C8763A] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
