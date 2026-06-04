/**
 * Logo badge trilobé avec les vraies photos des 3 destinations
 * 3 cercles qui se chevauchent (style Venn diagram) + texte central
 */
export default function LogoBadge({ className = '' }: { className?: string }) {
  return (
    <div className={`relative select-none ${className}`} style={{ width: 300, height: 268 }}>

      {/* ── Cercle ALPES (haut centre) ── */}
      <div style={{
        position: 'absolute', left: 75, top: 0,
        width: 168, height: 168, borderRadius: '50%',
        overflow: 'hidden',
        border: '2.5px solid rgba(200,118,58,0.75)',
        boxShadow: '0 0 0 1px rgba(212,168,67,0.35), 0 4px 16px rgba(0,0,0,0.18)',
      }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/bg-risoul-mountain.jpg"
          alt="Risoul 1850"
          style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 25%' }}
        />
        {/* Légère vignette pour lisibilité */}
        <div style={{ position:'absolute', inset:0, background:'radial-gradient(circle, transparent 50%, rgba(0,0,0,0.15) 100%)' }}/>
      </div>

      {/* ── Cercle LAURIS (bas gauche) ── */}
      <div style={{
        position: 'absolute', left: 0, top: 100,
        width: 168, height: 168, borderRadius: '50%',
        overflow: 'hidden',
        border: '2.5px solid rgba(200,118,58,0.75)',
        boxShadow: '0 0 0 1px rgba(212,168,67,0.35), 0 4px 16px rgba(0,0,0,0.18)',
      }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/bg-lauris-mid.jpg"
          alt="Lauris, Luberon"
          style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 35%' }}
        />
        <div style={{ position:'absolute', inset:0, background:'radial-gradient(circle, transparent 50%, rgba(0,0,0,0.15) 100%)' }}/>
      </div>

      {/* ── Cercle AVIGNON (bas droite) ── */}
      <div style={{
        position: 'absolute', left: 132, top: 100,
        width: 168, height: 168, borderRadius: '50%',
        overflow: 'hidden',
        border: '2.5px solid rgba(200,118,58,0.75)',
        boxShadow: '0 0 0 1px rgba(212,168,67,0.35), 0 4px 16px rgba(0,0,0,0.18)',
      }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/bg-avignon.jpg"
          alt="Avignon"
          style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 55%' }}
        />
        <div style={{ position:'absolute', inset:0, background:'radial-gradient(circle, transparent 50%, rgba(0,0,0,0.15) 100%)' }}/>
      </div>

      {/* ── Texte central ── */}
      <div style={{
        position: 'absolute',
        left: '50%', top: '50%',
        transform: 'translate(-50%, -48%)',
        width: 118, height: 88,
        borderRadius: '50%',
        background: 'rgba(250,247,242,0.94)',
        backdropFilter: 'blur(6px)',
        border: '1.5px solid rgba(200,118,58,0.55)',
        boxShadow: '0 0 0 1px rgba(212,168,67,0.25)',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        zIndex: 10,
      }}>
        <span style={{
          color: '#C8763A',
          fontFamily: "Georgia, 'Times New Roman', serif",
          fontWeight: 700, fontSize: 28, lineHeight: 1,
        }}>4AR</span>
        <div style={{ width: 52, height: 1, background: 'rgba(200,118,58,0.35)', margin: '5px 0 4px' }}/>
        <span style={{
          color: '#2C2416',
          fontFamily: "Georgia, 'Times New Roman', serif",
          fontSize: 10, letterSpacing: '3.5px',
        }}>Locations</span>
      </div>

      {/* ── Labels destinations ── */}
      <span style={{
        position: 'absolute', top: 4, left: '50%',
        transform: 'translateX(-50%)',
        fontSize: 8.5, letterSpacing: '2.5px', fontWeight: 700,
        color: 'white', fontFamily: 'Georgia, serif',
        textShadow: '0 1px 3px rgba(0,0,0,0.6)',
        whiteSpace: 'nowrap',
      }}>RISOUL 1850</span>

      <span style={{
        position: 'absolute', bottom: 6, left: 14,
        fontSize: 8.5, letterSpacing: '2.5px', fontWeight: 700,
        color: 'white', fontFamily: 'Georgia, serif',
        textShadow: '0 1px 3px rgba(0,0,0,0.6)',
      }}>LAURIS</span>

      <span style={{
        position: 'absolute', bottom: 6, right: 10,
        fontSize: 8.5, letterSpacing: '2.5px', fontWeight: 700,
        color: 'white', fontFamily: 'Georgia, serif',
        textShadow: '0 1px 3px rgba(0,0,0,0.6)',
      }}>AVIGNON</span>
    </div>
  );
}
