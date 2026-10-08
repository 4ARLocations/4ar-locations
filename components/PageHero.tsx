import React from 'react';

const GRAIN = "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")";

interface PageHeroProps {
  tag?: string;
  title: React.ReactNode;
  subtitle?: string;
  children?: React.ReactNode;
  compact?: boolean;
}

export default function PageHero({ tag, title, subtitle, children, compact = false }: PageHeroProps) {
  return (
    <section
      className="relative text-white overflow-hidden"
      style={{ minHeight: compact ? 'max(14vw, 200px)' : 'max(18vw, 260px)' }}
    >
      {/* Fond sombre */}
      <div className="absolute inset-0" style={{ background: '#090A0C' }} />

      {/* Aurora orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="page-orb-1" />
        <div className="page-orb-2" />
      </div>

      {/* Vignette */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 118% 105% at 28% 52%, transparent 18%, rgba(5,2,0,.66) 100%)' }} />

      {/* Grain */}
      <div className="absolute inset-0 opacity-[.07] pointer-events-none"
        style={{ backgroundImage: GRAIN, backgroundSize: '160px 160px' }} />

      <div
        className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 w-full flex items-end"
        style={{ minHeight: 'inherit', paddingTop: '5.5rem', paddingBottom: '2.8rem' }}
      >
        <div>
          {tag && (
            <p className="hero-a text-[10px] font-bold uppercase tracking-[.30em] text-[#C8763A] mb-4">
              {tag}
            </p>
          )}
          <h1
            className="hero-b font-serif font-normal leading-[.92] tracking-tight"
            style={{ fontSize: 'clamp(24px, 3.6vw, 54px)', marginBottom: subtitle || children ? '1rem' : 0 }}
          >
            {title}
          </h1>
          {subtitle && (
            <p className="hero-c text-[14px] text-white/42 max-w-[460px] leading-relaxed">
              {subtitle}
            </p>
          )}
          {children && (
            <div className="hero-d mt-6">{children}</div>
          )}
        </div>
      </div>
    </section>
  );
}
