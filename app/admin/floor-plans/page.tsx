import { redirect } from 'next/navigation';
import { isAdminAuthenticated } from '@/lib/auth';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

const PROPERTIES_WITH_PLANS = [
  { id: 'lauris-alain',   name: "Maison d'Alain",  emoji: '🏡' },
  { id: 'lauris-meme',    name: 'Maison de Mémé',  emoji: '🌿' },
  { id: 'lauris-atelier', name: "L'Atelier",        emoji: '🛠️' },
];

export default async function FloorPlansAdminPage() {
  const ok = await isAdminAuthenticated();
  if (!ok) redirect('/admin/login');

  return (
    <div className="min-h-screen bg-[#FAF7F2] p-6">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <Link href="/admin/calendar" className="text-[#9B8A74] hover:text-[#5C4F3A] transition-colors">
            ← Retour calendrier
          </Link>
        </div>

        <h1 className="text-2xl font-bold text-[#2C2416] mb-2">Plans interactifs</h1>
        <p className="text-[#9B8A74] text-sm mb-8">
          Cliquez sur un logement pour placer ou modifier les points cliquables sur ses plans.
        </p>

        <div className="space-y-3">
          {PROPERTIES_WITH_PLANS.map((p) => (
            <Link
              key={p.id}
              href={`/admin/floor-plans/${p.id}`}
              className="flex items-center gap-4 bg-white border border-[#E8DCC8] rounded-xl px-5 py-4 hover:border-[#C8763A] hover:shadow-sm transition-all group"
            >
              <span className="text-2xl">{p.emoji}</span>
              <div className="flex-1">
                <div className="font-semibold text-[#2C2416] group-hover:text-[#C8763A] transition-colors">
                  {p.name}
                </div>
                <div className="text-xs text-[#9B8A74] mt-0.5">Modifier les points et photos</div>
              </div>
              <svg className="w-4 h-4 text-[#C8763A] opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
