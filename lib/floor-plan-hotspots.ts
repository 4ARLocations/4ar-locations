/**
 * Positions initiales des hotspots sur les images de plans
 *
 * Coordonnées en % de la largeur/hauteur de l'image (0–100).
 * Modifiables via l'admin (/admin/floor-plans).
 *
 * Images de référence :
 *   /images/plans/plan-rdc.jpg  (2700 × 1155 px)
 *   /images/plans/plan-r1.jpg   (2699 × 1286 px)
 *   /images/plans/plan-r2.jpg   (2725 × 1369 px)
 */

export type HotspotDef = {
  id: string;
  label: string;
  area?: string;
  // Position en % de l'image (0–100)
  x: number;
  y: number;
  hasPhotos: boolean;
  defaultPhotos: string[];
};

export type FloorHotspots = {
  id: string;
  label: string;
  image: string;      // chemin de l'image de fond
  hotspots: HotspotDef[];
};

// ─── ATELIER ──────────────────────────────────────────────────────────────────
const atelierFloors: FloorHotspots[] = [
  {
    id: 'rdc',
    label: 'Rez-de-chaussée',
    image: '/images/plans/plan-rdc.jpg',
    hotspots: [
      { id: 'at-sejour',   label: 'Cuisine & Séjour', area: '33.4 m²', x: 14.5, y: 29, hasPhotos: true,  defaultPhotos: ['/images/lauris-atelier4.jpg', '/images/lauris-atelier3.jpg'] },
      { id: 'at-lavoir',   label: 'Lavoir',                             x: 17.5, y: 18, hasPhotos: false, defaultPhotos: [] },
      { id: 'at-wc-rdc',   label: 'WC',               area: '1.4 m²',  x:  9.5, y: 49, hasPhotos: false, defaultPhotos: [] },
      { id: 'at-dgt-rdc',  label: 'Dégagement',        area: '1.6 m²',  x: 12.5, y: 49, hasPhotos: false, defaultPhotos: [] },
    ],
  },
  {
    id: 'r1',
    label: '1er étage',
    image: '/images/plans/plan-r1.jpg',
    hotspots: [
      { id: 'at-chambre-r1',    label: 'Suite parentale',    area: '12 m²',    x: 18,   y: 30, hasPhotos: true,  defaultPhotos: ['/images/lauris-atelier.jpg', '/images/lauris-atelier2.jpg'] },
      { id: 'at-sde-r1',        label: "Salle d'eau",        area: '4.8 m²',   x: 26,   y: 27, hasPhotos: false, defaultPhotos: [] },
      { id: 'at-dressing-r1',   label: 'Dressing',           area: '2.5 m²',   x: 26,   y: 40, hasPhotos: false, defaultPhotos: [] },
      { id: 'at-buanderie-r1',  label: 'Buanderie & Rangement', area: '10 m²', x: 17,   y: 55, hasPhotos: false, defaultPhotos: [] },
      { id: 'at-wc-r1',         label: 'WC',                               x: 24,   y: 55, hasPhotos: false, defaultPhotos: [] },
    ],
  },
  {
    id: 'r2',
    label: '2e étage',
    image: '/images/plans/plan-r2.jpg',
    hotspots: [
      { id: 'at-chambre-r2',  label: 'Suite parentale', area: '12.5 m²', x: 19, y: 73, hasPhotos: true,  defaultPhotos: ['/images/lauris-atelier5.jpg'] },
      { id: 'at-sde-r2',      label: "Salle d'eau",     area: '4 m²',    x: 25, y: 68, hasPhotos: false, defaultPhotos: [] },
      { id: 'at-terrasse-r2', label: 'Terrasse',         area: '10.4 m²', x: 25, y: 48, hasPhotos: false, defaultPhotos: [] },
    ],
  },
];

// ─── MAISON DE MÉMÉ ───────────────────────────────────────────────────────────
const memeFloors: FloorHotspots[] = [
  {
    id: 'rdc',
    label: 'Rez-de-chaussée',
    image: '/images/plans/plan-rdc.jpg',
    hotspots: [
      { id: 'me-cuisine',  label: 'Cuisine',              area: '10.4 m²', x: 28.5, y: 21, hasPhotos: true,  defaultPhotos: ['/images/lauris-meme2.jpg'] },
      { id: 'me-sam',      label: 'Salle à Manger',       area: '12.3 m²', x: 32.5, y: 38, hasPhotos: true,  defaultPhotos: ['/images/lauris-meme5.jpg', '/images/lauris-meme.jpg'] },
      { id: 'me-wc-rdc',   label: 'WC',                   area: '1.5 m²',  x: 25.5, y: 50, hasPhotos: false, defaultPhotos: [] },
      { id: 'me-dgt-rdc',  label: 'Dégagement',           area: '2.25 m²', x: 28.0, y: 50, hasPhotos: false, defaultPhotos: [] },
    ],
  },
  {
    id: 'r1',
    label: '1er étage',
    image: '/images/plans/plan-r1.jpg',
    hotspots: [
      { id: 'me-chambre1',   label: 'Chambre 1',       area: '2 lits simples', x: 36,   y: 27, hasPhotos: true,  defaultPhotos: ['/images/lauris-meme3.jpg'] },
      { id: 'me-chambre2',   label: 'Chambre 2',       area: 'Lit double',     x: 44,   y: 27, hasPhotos: true,  defaultPhotos: ['/images/lauris-meme4.jpg'] },
      { id: 'me-sde-r1',     label: "Salle d'eau",                             x: 38,   y: 51, hasPhotos: false, defaultPhotos: [] },
      { id: 'me-wc-r1',      label: 'WC',                                      x: 33.5, y: 55, hasPhotos: false, defaultPhotos: [] },
      { id: 'me-salon',      label: 'Salon TV',                                x: 32,   y: 72, hasPhotos: true,  defaultPhotos: ['/images/lauris-meme6.jpg'] },
      { id: 'me-dressing',   label: 'Grand Dressing',                          x: 35,   y: 64, hasPhotos: false, defaultPhotos: [] },
    ],
  },
  {
    id: 'r2',
    label: '2e étage',
    image: '/images/plans/plan-r2.jpg',
    hotspots: [
      { id: 'me-chambre3',   label: 'Chambre 3', area: '15.4 m²', x: 37,   y: 19, hasPhotos: true,  defaultPhotos: ['/images/lauris-meme7.jpg'] },
      { id: 'me-chambre4',   label: 'Chambre 4', area: '9 m²',    x: 44.5, y: 19, hasPhotos: true,  defaultPhotos: ['/images/lauris-meme.jpg'] },
      { id: 'me-sde-r2',     label: "Salle d'eau + WC", area: '4.5 m²', x: 37.5, y: 38, hasPhotos: false, defaultPhotos: [] },
      { id: 'me-terrasse',   label: 'Terrasse Tropézienne', area: '19.5 m²',  x: 43,   y: 52, hasPhotos: false, defaultPhotos: [] },
    ],
  },
];

export const FLOOR_HOTSPOTS: Record<string, FloorHotspots[]> = {
  'lauris-atelier': atelierFloors,
  'lauris-meme': memeFloors,
};
