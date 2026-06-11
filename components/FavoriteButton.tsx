'use client';
import { useState, useEffect } from 'react';

const STORAGE_KEY = '4ar-favorites';

export function getFavorites(): string[] {
  if (typeof window === 'undefined') return [];
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]'); }
  catch { return []; }
}

export function setFavorites(ids: string[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
}

export default function FavoriteButton({
  propertyId,
  size = 'md',
  className = '',
}: {
  propertyId: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}) {
  const [isFav, setIsFav] = useState(false);
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    setIsFav(getFavorites().includes(propertyId));
  }, [propertyId]);

  const toggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const favs = getFavorites();
    const next = favs.includes(propertyId)
      ? favs.filter((f) => f !== propertyId)
      : [...favs, propertyId];
    setFavorites(next);
    setIsFav(next.includes(propertyId));
    if (next.includes(propertyId)) { setPulse(true); setTimeout(() => setPulse(false), 400); }
  };

  const sizeClass = { sm: 'w-5 h-5', md: 'w-6 h-6', lg: 'w-7 h-7' }[size];

  return (
    <button
      onClick={toggle}
      className={`transition-transform ${pulse ? 'scale-125' : 'scale-100'} ${className}`}
      aria-label={isFav ? 'Retirer des favoris' : 'Ajouter aux favoris'}
      title={isFav ? 'Retirer des favoris' : 'Ajouter aux favoris'}
    >
      <svg
        viewBox="0 0 24 24"
        className={sizeClass}
        fill={isFav ? '#C8763A' : 'none'}
        stroke={isFav ? '#C8763A' : 'currentColor'}
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
        />
      </svg>
    </button>
  );
}
