'use client';
import { useState } from 'react';

interface Template {
  id: string;
  label: string;
  subject: string;
  body: string;
}

const TEMPLATES: Template[] = [
  {
    id: 'confirmation',
    label: '✅ Confirmation de réservation',
    subject: 'Votre réservation est confirmée — {{logement}}',
    body: `Bonjour {{prénom}},

Nous avons bien reçu votre demande de réservation et nous sommes heureux de vous confirmer votre séjour à {{logement}}.

📅 Arrivée : {{date_arrivée}}
📅 Départ : {{date_départ}}
👥 Voyageurs : {{nb_voyageurs}}

Nous vous enverrons les informations pratiques (accès, code, parking) quelques jours avant votre arrivée.

À très bientôt !
L'équipe 4AR Locations
loc4ar@gmail.com`,
  },
  {
    id: 'welcome',
    label: '🔑 Instructions d\'arrivée',
    subject: 'Votre arrivée à {{logement}} — informations pratiques',
    body: `Bonjour {{prénom}},

Votre arrivée approche ! Voici tout ce qu'il faut savoir pour accéder au logement.

🔑 Accès : [CODE / BOÎTE À CLÉS / DESCRIPTION]
📍 Adresse : [ADRESSE COMPLÈTE]
🚗 Parking : [INFOS PARKING]
📶 Wifi : Réseau : [NOM] / Mot de passe : [MDP]

En cas de problème, contactez-nous directement sur ce numéro : [TÉLÉPHONE].

Nous vous souhaitons un excellent séjour ! 🌿
L'équipe 4AR Locations`,
  },
  {
    id: 'review-request',
    label: '⭐ Demande d\'avis',
    subject: 'Comment s\'est passé votre séjour ? 😊',
    body: `Bonjour {{prénom}},

Nous espérons que votre séjour à {{logement}} s'est bien passé et que vous avez pu profiter pleinement de la région !

Votre retour nous est très précieux. Si vous avez quelques minutes, nous serions ravis que vous laissiez un avis sur notre site :
👉 [LIEN]

Merci pour votre confiance, et à bientôt peut-être ! 🌿
L'équipe 4AR Locations`,
  },
  {
    id: 'long-stay-offer',
    label: '🏷️ Offre long séjour',
    subject: 'Une offre spéciale pour votre prochain séjour',
    body: `Bonjour {{prénom}},

Nous avons quelques disponibilités sur {{logement}} et nous souhaitions vous proposer une offre préférentielle pour un séjour d'une semaine ou plus.

Pour toute réservation directe de 7 nuits ou plus, nous appliquons une réduction de [X]%.

N'hésitez pas à nous contacter pour connaître les disponibilités et tarifs.

L'équipe 4AR Locations
loc4ar@gmail.com`,
  },
  {
    id: 'checkout-reminder',
    label: '🧳 Rappel de départ',
    subject: 'Votre départ est demain — rappel',
    body: `Bonjour {{prénom}},

Votre séjour à {{logement}} touche à sa fin — votre départ est prévu pour demain, {{date_départ}}.

Pour le départ, merci de :
• Laisser les clés [LOCALISATION]
• Sortir les poubelles
• Fermer les volets et les fenêtres
• Laisser le logement dans l'état où vous l'avez trouvé

Merci pour votre séjour et à bientôt ! 🌿
L'équipe 4AR Locations`,
  },
];

export default function MessagesPage() {
  const [selected, setSelected] = useState<Template>(TEMPLATES[0]);
  const [editedSubject, setEditedSubject] = useState(TEMPLATES[0].subject);
  const [editedBody, setEditedBody] = useState(TEMPLATES[0].body);
  const [copied, setCopied] = useState(false);

  const selectTemplate = (t: Template) => {
    setSelected(t);
    setEditedSubject(t.subject);
    setEditedBody(t.body);
    setCopied(false);
  };

  const copyToClipboard = async () => {
    const text = `Objet : ${editedSubject}\n\n${editedBody}`;
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const openMailto = () => {
    const subject = encodeURIComponent(editedSubject);
    const body = encodeURIComponent(editedBody);
    window.open(`mailto:?subject=${subject}&body=${body}`);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#2C2416]">Modèles de messages</h1>
        <p className="text-sm text-[#9B8A74] mt-1">
          Sélectionnez un modèle, personnalisez-le et copiez-le dans votre client email.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Liste des modèles */}
        <div className="space-y-2">
          {TEMPLATES.map((t) => (
            <button
              key={t.id}
              onClick={() => selectTemplate(t)}
              className={`w-full text-left px-4 py-3 rounded-xl border transition-all text-sm font-medium ${
                selected.id === t.id
                  ? 'bg-[#C8763A] text-white border-[#C8763A]'
                  : 'bg-white border-[#E8DCC8] text-[#5C4F3A] hover:border-[#C8763A]/40'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Éditeur */}
        <div className="lg:col-span-2 space-y-4">
          <div>
            <label className="text-xs text-[#9B8A74] font-semibold uppercase tracking-wide block mb-1.5">
              Objet
            </label>
            <input
              type="text"
              value={editedSubject}
              onChange={(e) => setEditedSubject(e.target.value)}
              className="w-full border border-[#E8DCC8] rounded-xl px-4 py-3 text-sm text-[#2C2416] bg-white focus:outline-none focus:border-[#C8763A] transition-colors"
            />
          </div>

          <div>
            <label className="text-xs text-[#9B8A74] font-semibold uppercase tracking-wide block mb-1.5">
              Corps du message
            </label>
            <textarea
              rows={16}
              value={editedBody}
              onChange={(e) => setEditedBody(e.target.value)}
              className="w-full border border-[#E8DCC8] rounded-xl px-4 py-3 text-sm text-[#2C2416] font-mono bg-white focus:outline-none focus:border-[#C8763A] transition-colors resize-none leading-relaxed"
            />
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <button
              onClick={copyToClipboard}
              className="flex items-center gap-2 bg-[#2C2416] hover:bg-[#4A3828] text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors"
            >
              {copied ? (
                <><span>✅</span> Copié !</>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  Copier le message
                </>
              )}
            </button>

            <button
              onClick={openMailto}
              className="flex items-center gap-2 border border-[#E8DCC8] hover:border-[#C8763A] text-[#5C4F3A] hover:text-[#C8763A] font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Ouvrir dans mon email
            </button>
          </div>

          <div className="bg-[#FAF7F2] border border-[#E8DCC8] rounded-xl p-4 text-xs text-[#9B8A74]">
            <p className="font-semibold text-[#5C4F3A] mb-1">Champs à personnaliser</p>
            <p>Remplacez les variables entre doubles accolades : <code className="bg-[#E8DCC8] px-1 rounded">{'{{prénom}}'}</code>,{' '}
            <code className="bg-[#E8DCC8] px-1 rounded">{'{{logement}}'}</code>,{' '}
            <code className="bg-[#E8DCC8] px-1 rounded">{'{{date_arrivée}}'}</code>, etc.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
