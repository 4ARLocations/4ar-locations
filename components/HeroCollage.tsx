import Image from 'next/image';

export default function HeroCollage() {
  return (
    <>
      {/* ── Panneau photo contenu — desktop uniquement ── */}
      <div
        className="hero-photo-reveal absolute hidden lg:block overflow-hidden"
        style={{
          right: '3.5%',
          top: '7%',
          bottom: 0,
          width: '43%',
          borderRadius: '14px 14px 0 0',
          boxShadow: '0 28px 72px rgba(0,0,0,0.52), 0 0 0 1px rgba(255,255,255,0.07)',
        }}
      >
        <Image
          src="/images/bg-lauris-panorama.jpg"
          alt="Luberon, Provence"
          fill
          priority
          className="object-cover hero-panel-kb"
          style={{ objectPosition: 'center 42%' }}
        />
        {/* Dégradé bas intérieur */}
        <div
          className="absolute inset-x-0 bottom-0 pointer-events-none"
          style={{
            height: '50%',
            background: 'linear-gradient(to top, rgba(4,2,1,0.65) 0%, transparent 100%)',
          }}
        />
        {/* Étiquette */}
        <div className="absolute bottom-5 left-5 text-white select-none">
          <p style={{ fontSize: '8px', fontWeight: 700, letterSpacing: '0.26em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.36)', marginBottom: 3 }}>
            Vaucluse · Provence
          </p>
          <p style={{ fontFamily: 'var(--font-serif)', fontSize: '16px', lineHeight: 1.2, color: 'rgba(255,255,255,0.88)' }}>
            Luberon
          </p>
        </div>
      </div>

      {/* ── Mobile : photo très sombre plein écran ── */}
      <div className="lg:hidden absolute inset-0 overflow-hidden">
        <Image
          src="/images/bg-lauris-panorama.jpg"
          alt=""
          fill
          priority
          className="object-cover"
          style={{ objectPosition: 'center 40%', filter: 'brightness(0.12)' }}
        />
      </div>
    </>
  );
}
