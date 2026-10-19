'use client';
import { useState } from 'react';
import { useTranslations } from 'next-intl';

const FAQ_KEYS: Record<string, [string, string][]> = {
  risoul:          [['risoul_q1','risoul_a1'],['risoul_q2','risoul_a2'],['risoul_q3','risoul_a3'],['risoul_q4','risoul_a4'],['risoul_q5','risoul_a5']],
  avignon:         [['avignon_q1','avignon_a1'],['avignon_q2','avignon_a2'],['avignon_q3','avignon_a3'],['avignon_q4','avignon_a4']],
  'lauris-meme':   [['lauris_meme_q1','lauris_meme_a1'],['lauris_meme_q2','lauris_meme_a2'],['lauris_meme_q3','lauris_meme_a3'],['lauris_meme_q4','lauris_meme_a4'],['lauris_meme_q5','lauris_meme_a5']],
  'lauris-atelier':[['lauris_atelier_q1','lauris_atelier_a1'],['lauris_atelier_q2','lauris_atelier_a2'],['lauris_atelier_q3','lauris_atelier_a3'],['lauris_atelier_q4','lauris_atelier_a4']],
  'lauris-alain':  [['lauris_alain_q1','lauris_alain_a1'],['lauris_alain_q2','lauris_alain_a2'],['lauris_alain_q3','lauris_alain_a3'],['lauris_alain_q4','lauris_alain_a4']],
};

export default function PropertyFAQ({ propertyId }: { propertyId: string }) {
  const t = useTranslations('faq');
  const pairs = FAQ_KEYS[propertyId];
  const [open, setOpen] = useState<number | null>(null);

  if (!pairs || pairs.length === 0) return null;

  return (
    <div className="py-8 border-t border-[#E8DCC8]">
      <h2 className="text-xl font-bold text-[#2C2416] mb-5 flex items-center gap-2">
        <span>💬</span> {t('title')}
      </h2>
      <div className="space-y-2">
        {pairs.map(([qKey, aKey], i) => (
          <div key={i} className="border border-[#E8DCC8] rounded-xl overflow-hidden">
            <button
              onClick={() => setOpen(open === i ? null : i)}
              className="w-full flex items-center justify-between px-5 py-4 text-left bg-white hover:bg-[#FAF7F2] transition-colors"
            >
              <span className="font-medium text-[#2C2416] text-sm pr-4">{t(qKey as Parameters<typeof t>[0])}</span>
              <span className={`text-[#C8763A] flex-shrink-0 transition-transform duration-200 ${open === i ? 'rotate-45' : ''}`}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </span>
            </button>
            {open === i && (
              <div className="px-5 pb-4 pt-1 bg-[#FAF7F2] text-[#5C4F3A] text-sm leading-relaxed border-t border-[#E8DCC8]">
                {t(aKey as Parameters<typeof t>[0])}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
