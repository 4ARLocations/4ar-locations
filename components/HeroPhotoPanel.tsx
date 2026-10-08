'use client';
import Image from 'next/image';
import { useEffect, useState, useCallback, useRef } from 'react';

const DESTINATIONS = [
  { src: '/images/bg-lauris-panorama.jpg', label: 'Luberon',    sub: 'Vaucluse' },
  { src: '/images/bg-risoul-mountain.jpg', label: 'Risoul 1850', sub: 'Hautes-Alpes' },
  { src: '/images/bg-palais.jpg',          label: 'Avignon',    sub: 'Vaucluse' },
];

const INTERVAL = 5500;
const PARALLAX_OFFSET = 100;

export default function HeroPhotoPanel() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const parallaxRef = useRef<HTMLDivElement>(null);

  const next = useCallback(() => setActive(prev => (prev + 1) % DESTINATIONS.length), []);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(next, INTERVAL);
    return () => clearInterval(id);
  }, [paused, next]);

  // Parallax scroll — RAF pour fluidité maximale
  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        if (!parallaxRef.current) return;
        const shift = Math.min(window.scrollY * 0.20, PARALLAX_OFFSET);
        parallaxRef.current.style.transform = `translateY(${shift}px)`;
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      className="absolute inset-0 overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Conteneur parallaxe — déborde en haut pour absorber le shift */}
      <div
        ref={parallaxRef}
        className="absolute left-0 right-0 bottom-0 will-change-transform"
        style={{ top: -PARALLAX_OFFSET }}
      >
        {DESTINATIONS.map((d, i) => (
          <div
            key={d.src}
            className="absolute inset-0"
            style={{
              opacity: i === active ? 1 : 0,
              transition: 'opacity 1800ms cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          >
            <Image
              src={d.src}
              alt={d.label}
              fill
              priority={i === 0}
              className="object-cover"
              style={{
                transform: i === active ? 'scale(1.13)' : 'scale(1.0)',
                transition: i === active
                  ? 'transform 8000ms cubic-bezier(0.25, 0.46, 0.45, 0.94)'
                  : 'transform 0ms',
              }}
            />
          </div>
        ))}
      </div>

      {/* Fondu bas — intégration sombre vers le marquee */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0A0602]/90 via-[#0A0602]/14 to-transparent pointer-events-none" />
      {/* Voile global allégé — laisse respirer les photos */}
      <div className="absolute inset-0 bg-[#0A0602]/14 pointer-events-none" />

      {/* Label destination + dots */}
      <div className="absolute bottom-8 right-6 text-right select-none">
        <p className="text-[9px] font-bold uppercase tracking-[0.24em] text-white/35 mb-1 transition-all duration-700">
          {DESTINATIONS[active].sub}
        </p>
        <p className="font-serif text-[20px] text-white/85 mb-4 leading-tight transition-all duration-700">
          {DESTINATIONS[active].label}
        </p>
        <div className="flex gap-2 justify-end items-center">
          {DESTINATIONS.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              aria-label={DESTINATIONS[i].label}
              className="transition-all duration-500"
              style={{
                width:  i === active ? '22px' : '6px',
                height: '3px',
                borderRadius: '2px',
                background: i === active ? '#C8763A' : 'rgba(255,255,255,0.28)',
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
