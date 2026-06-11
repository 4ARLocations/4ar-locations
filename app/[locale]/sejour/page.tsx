import Link from 'next/link';
import { properties } from '@/lib/properties';
import { useTranslations } from 'next-intl';



export default async function SejourPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ bien?: string; nom?: string }>;
}) {
  const { locale } = await params;
  const { bien, nom } = await searchParams;
  const t = useTranslations();

  const property = bien ? properties.find((p) => p.id === bien) : null;

  const nextSteps = [
    { icon: '📧', title: 'Email de confirmation', desc: 'Vous allez recevoir un email récapitulatif dans quelques minutes.' },
    { icon: '📅', title: 'Confirmation sous 24h', desc: 'Nous vérifions les disponibilités et vous confirmons la réservation sous 24 heures.' },
    { icon: '🔑', title: 'Infos d\'accès', desc: 'Quelques jours avant votre arrivée, vous recevrez toutes les informations pratiques.' },
    { icon: '💬', title: 'Besoin d\'aide ?', desc: 'Contactez-nous à tout moment à loc4ar@gmail.com.' },
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
      {/* Hero confirmation */}
      <div className="text-center mb-12">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
          <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-[#2C2416] mb-3">
          {nom ? `Merci ${nom} !` : 'Demande envoyée !'}
        </h1>
        <p className="text-[#5C4F3A] text-lg">
          {property
            ? `Votre demande pour ${t(property.nameKey)} a bien été reçue.`
            : 'Votre demande de réservation a bien été reçue.'}
        </p>
      </div>

      {/* Prochaines étapes */}
      <div className="bg-white border border-[#E8DCC8] rounded-2xl p-6 shadow-sm mb-6">
        <h2 className="font-bold text-[#2C2416] text-lg mb-5">Que se passe-t-il maintenant ?</h2>
        <div className="space-y-4">
          {nextSteps.map((step, i) => (
            <div key={i} className="flex items-start gap-4">
              <div className="w-10 h-10 bg-[#FAF7F2] border border-[#E8DCC8] rounded-full flex items-center justify-center flex-shrink-0 text-lg">
                {step.icon}
              </div>
              <div>
                <p className="font-semibold text-[#2C2416] text-sm">{step.title}</p>
                <p className="text-[#5C4F3A] text-sm mt-0.5">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Liens utiles */}
      <div className="flex flex-col sm:flex-row gap-3">
        {property && (
          <Link
            href={`/${locale}/guide`}
            className="flex-1 flex items-center justify-center gap-2 border border-[#E8DCC8] hover:border-[#C8763A] text-[#5C4F3A] hover:text-[#C8763A] font-semibold py-3 px-4 rounded-xl transition-colors text-sm"
          >
            🗺️ Voir le guide de voyage
          </Link>
        )}
        <Link
          href={`/${locale}`}
          className="flex-1 flex items-center justify-center gap-2 bg-[#C8763A] hover:bg-[#A85E28] text-white font-semibold py-3 px-4 rounded-xl transition-colors text-sm"
        >
          🏡 Retour à l'accueil
        </Link>
      </div>
    </div>
  );
}
