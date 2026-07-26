'use client';
import dynamic from 'next/dynamic';

const PropertiesMap = dynamic(() => import('./PropertiesMap'), {
  ssr: false,
  loading: () => (
    <div className="rounded-2xl bg-[#E8DCC8]/40 border border-[#E8DCC8]" style={{ height: '420px' }}>
      <div className="flex items-center justify-center h-full text-[#9B8A74] text-sm gap-2">
        <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
        </svg>
        Chargement de la carte…
      </div>
    </div>
  ),
});

export default function PropertiesMapClient({ focusId }: { focusId?: string | null }) {
  return <PropertiesMap focusId={focusId} />;
}
