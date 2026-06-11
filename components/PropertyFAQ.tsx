'use client';
import { useState } from 'react';

type FAQItem = { q: string; a: string };

const FAQ_DATA: Record<string, FAQItem[]> = {
  risoul: [
    { q: 'Y a-t-il un parking ?', a: "Oui, un parking couvert est inclus dans la résidence Altaïr, à proximité immédiate de l'appartement." },
    { q: 'Le linge de lit est-il fourni ?', a: 'Oui, le linge de lit est fourni. Les serviettes de bain sont disponibles sur demande.' },
    { q: 'L\'accès aux pistes est-il direct ?', a: 'Oui, l\'appartement est ski aux pieds — accès direct aux pistes depuis la résidence.' },
    { q: 'Peut-on louer en dehors des vacances scolaires ?', a: 'Oui, le logement est disponible hors vacances scolaires, sous réserve de disponibilité. Nous contacter pour les tarifs.' },
    { q: 'Les animaux sont-ils acceptés ?', a: 'Non, les animaux de compagnie ne sont pas acceptés dans cet appartement.' },
  ],
  avignon: [
    { q: 'Où se garer à Avignon ?', a: 'L\'appartement est en intramuros ; nous recommandons le parking du Palais des Papes ou les parkings payants à proximité des remparts.' },
    { q: 'Y a-t-il la climatisation ?', a: 'Oui, l\'appartement est équipé de la climatisation pour les nuits d\'été.' },
    { q: 'Est-il possible d\'accueillir plus de 2 personnes ?', a: 'Le logement est conçu pour 2 personnes. Nous contacter pour toute demande particulière.' },
    { q: 'Quel est l\'accès au logement ?', a: 'Un accès autonome est prévu avec boîte à clés. Les instructions vous seront envoyées avant l\'arrivée.' },
  ],
  'lauris-meme': [
    { q: 'Peut-on privatiser les 3 maisons ensemble ?', a: 'Oui ! Les 3 maisons de Lauris (Mémé, l\'Atelier, Maison d\'Alain) peuvent être combinées pour accueillir jusqu\'à 20 personnes. Tarif préférentiel sur demande.' },
    { q: 'Le ménage est-il inclus ?', a: 'Un ménage de fin de séjour est en option (120€). Vous pouvez aussi effectuer le ménage vous-même.' },
    { q: 'Y a-t-il un jardin ou une terrasse ?', a: 'Oui, la maison dispose d\'espaces extérieurs — une cour et une terrasse ombragée.' },
    { q: 'Les animaux sont-ils acceptés ?', a: 'Oui, les animaux de compagnie sont acceptés sous réserve d\'accord préalable.' },
    { q: 'Quelle est la durée minimum de séjour ?', a: '2 nuits minimum. Pour les longues durées (semaine ou plus), un tarif préférentiel est appliqué.' },
  ],
  'lauris-atelier': [
    { q: 'L\'Atelier est-il accessible aux personnes à mobilité réduite ?', a: 'Non, le logement comporte un escalier abrupt — il n\'est pas adapté aux personnes à mobilité réduite.' },
    { q: 'Peut-on combiner avec les maisons voisines ?', a: 'Oui, l\'Atelier peut être combiné avec la Maison de Mémé et la Maison d\'Alain pour des groupes jusqu\'à 20 personnes.' },
    { q: 'Le ménage est-il inclus ?', a: 'Un ménage de fin de séjour est en option (80€). Vous pouvez aussi effectuer le ménage vous-même.' },
    { q: 'Y a-t-il la climatisation ?', a: 'Non, mais les épaisses murs en pierre gardent la maison fraîche naturellement, même en été.' },
  ],
  'lauris-alain': [
    { q: 'Peut-on privatiser les 3 maisons ensemble ?', a: 'Oui ! Les 3 maisons de Lauris peuvent être combinées pour accueillir jusqu\'à 20 personnes. Tarif préférentiel sur demande.' },
    { q: 'Y a-t-il une terrasse ?', a: 'Oui, la grande terrasse du 1er étage offre une vue sur le village — idéale pour les dîners en plein air.' },
    { q: 'La salle voûtée est-elle disponible pour des événements ?', a: 'La salle voûtée au rez-de-chaussée est parfaite pour des repas en famille, mais les fêtes sont interdites.' },
    { q: 'Quelle est la durée minimum de séjour ?', a: '2 nuits minimum. Pour les longues durées, un tarif préférentiel est appliqué.' },
  ],
};

export default function PropertyFAQ({ propertyId }: { propertyId: string }) {
  const items = FAQ_DATA[propertyId];
  const [open, setOpen] = useState<number | null>(null);

  if (!items || items.length === 0) return null;

  return (
    <div className="py-8 border-t border-[#E8DCC8]">
      <h2 className="text-xl font-bold text-[#2C2416] mb-5 flex items-center gap-2">
        <span>💬</span> Questions fréquentes
      </h2>
      <div className="space-y-2">
        {items.map((item, i) => (
          <div key={i} className="border border-[#E8DCC8] rounded-xl overflow-hidden">
            <button
              onClick={() => setOpen(open === i ? null : i)}
              className="w-full flex items-center justify-between px-5 py-4 text-left bg-white hover:bg-[#FAF7F2] transition-colors"
            >
              <span className="font-medium text-[#2C2416] text-sm pr-4">{item.q}</span>
              <span className={`text-[#C8763A] flex-shrink-0 transition-transform duration-200 ${open === i ? 'rotate-45' : ''}`}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </span>
            </button>
            {open === i && (
              <div className="px-5 pb-4 pt-1 bg-[#FAF7F2] text-[#5C4F3A] text-sm leading-relaxed border-t border-[#E8DCC8]">
                {item.a}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
