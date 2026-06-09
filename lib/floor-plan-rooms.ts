// Données statiques du plan SVG — positions des pièces pour chaque propriété
// Les photos associées à chaque pièce sont stockées dans Redis (modifiables via admin)

export type RoomDef = {
  id: string;
  label: string;         // Nom affiché sur le plan
  icon: string;          // Emoji
  x: number;             // Position SVG
  y: number;
  w: number;
  h: number;
  fill: string;          // Couleur de fond de la pièce
  defaultPhotos: string[]; // Photos par défaut (si rien dans Redis)
};

export type FloorDef = {
  id: string;
  label: string;         // "Rez-de-chaussée", "1er étage", etc.
  viewBox: string;
  width: number;
  height: number;
  rooms: RoomDef[];
};

// ─── Maison de Mémé ────────────────────────────────────────────────────────
const memeFloors: FloorDef[] = [
  {
    id: 'rdc',
    label: 'Rez-de-chaussée',
    viewBox: '0 0 500 280',
    width: 500,
    height: 280,
    rooms: [
      { id: 'sejour-rdc',  label: 'Séjour & Cuisine', icon: '🛋️', x: 20,  y: 20,  w: 340, h: 240, fill: '#FFF3E8', defaultPhotos: ['/images/lauris-meme5.jpg', '/images/lauris-meme.jpg'] },
      { id: 'wc-rdc',      label: 'WC',               icon: '🚽', x: 370, y: 20,  w: 110, h: 110, fill: '#E8F0F8', defaultPhotos: [] },
      { id: 'entree-rdc',  label: 'Entrée',            icon: '🚪', x: 370, y: 140, w: 110, h: 120, fill: '#F0EBE3', defaultPhotos: [] },
    ],
  },
  {
    id: 'r1',
    label: '1er étage',
    viewBox: '0 0 500 340',
    width: 500,
    height: 340,
    rooms: [
      { id: 'salon-tv',   label: 'Salon TV',      icon: '📺', x: 20,  y: 20,  w: 150, h: 160, fill: '#FFF3E8', defaultPhotos: ['/images/lauris-meme2.jpg'] },
      { id: 'chambre1',   label: 'Chambre 1',      icon: '🛏️', x: 190, y: 20,  w: 140, h: 160, fill: '#F0F4E8', defaultPhotos: ['/images/lauris-meme3.jpg'] },
      { id: 'chambre2',   label: 'Chambre 2',      icon: '🛏️', x: 350, y: 20,  w: 130, h: 160, fill: '#F0F4E8', defaultPhotos: ['/images/lauris-meme4.jpg'] },
      { id: 'wc-r1',      label: 'WC',             icon: '🚽', x: 20,  y: 200, w: 80,  h: 120, fill: '#E8F0F8', defaultPhotos: [] },
      { id: 'dressing-r1',label: 'Dressing',       icon: '👗', x: 120, y: 200, w: 100, h: 120, fill: '#F5F0EB', defaultPhotos: [] },
      { id: 'sde-r1',     label: "Salle d'eau",    icon: '🚿', x: 240, y: 200, w: 120, h: 120, fill: '#E8F0F8', defaultPhotos: [] },
      { id: 'couloir-r1', label: 'Couloir',        icon: '↕️', x: 380, y: 200, w: 100, h: 120, fill: '#F0EBE3', defaultPhotos: [] },
    ],
  },
  {
    id: 'r2',
    label: '2e étage',
    viewBox: '0 0 500 300',
    width: 500,
    height: 300,
    rooms: [
      { id: 'chambre3',   label: 'Chambre 3',       icon: '🛏️', x: 20,  y: 20,  w: 220, h: 180, fill: '#F0F4E8', defaultPhotos: ['/images/lauris-meme6.jpg'] },
      { id: 'chambre4',   label: 'Chambre 4',       icon: '🛏️', x: 260, y: 20,  w: 220, h: 180, fill: '#F0F4E8', defaultPhotos: ['/images/lauris-meme7.jpg'] },
      { id: 'sde-r2',     label: "Salle d'eau + WC",icon: '🚿', x: 20,  y: 220, w: 220, h: 60,  fill: '#E8F0F8', defaultPhotos: [] },
      { id: 'terrasse-r2',label: 'Terrasse',        icon: '☀️', x: 260, y: 220, w: 220, h: 60,  fill: '#E8F5E8', defaultPhotos: [] },
    ],
  },
];

// ─── L'Atelier ─────────────────────────────────────────────────────────────
const atelierFloors: FloorDef[] = [
  {
    id: 'rdc',
    label: 'Rez-de-chaussée',
    viewBox: '0 0 400 260',
    width: 400,
    height: 260,
    rooms: [
      { id: 'sejour-at',  label: 'Séjour & Cuisine', icon: '🛋️', x: 20,  y: 20,  w: 270, h: 220, fill: '#FFF3E8', defaultPhotos: ['/images/lauris-atelier4.jpg', '/images/lauris-atelier3.jpg'] },
      { id: 'wc-at-rdc',  label: 'WC',               icon: '🚽', x: 310, y: 20,  w: 70,  h: 110, fill: '#E8F0F8', defaultPhotos: [] },
      { id: 'entree-at',  label: 'Entrée',            icon: '🚪', x: 310, y: 150, w: 70,  h: 90,  fill: '#F0EBE3', defaultPhotos: [] },
    ],
  },
  {
    id: 'r1',
    label: '1er étage',
    viewBox: '0 0 400 280',
    width: 400,
    height: 280,
    rooms: [
      { id: 'buanderie',   label: 'Buanderie & WC',  icon: '🧺', x: 20,  y: 20,  w: 150, h: 120, fill: '#E8F0F8', defaultPhotos: [] },
      { id: 'dressing-at', label: 'Dressing',        icon: '👗', x: 190, y: 20,  w: 100, h: 120, fill: '#F5F0EB', defaultPhotos: [] },
      { id: 'sde-at',      label: "Salle d'eau",     icon: '🚿', x: 310, y: 20,  w: 70,  h: 120, fill: '#E8F0F8', defaultPhotos: [] },
      { id: 'suite-at-r1', label: 'Suite parentale', icon: '🛏️', x: 20,  y: 160, w: 360, h: 100, fill: '#F0F4E8', defaultPhotos: ['/images/lauris-atelier.jpg', '/images/lauris-atelier2.jpg'] },
    ],
  },
  {
    id: 'r2',
    label: '2e étage',
    viewBox: '0 0 400 260',
    width: 400,
    height: 260,
    rooms: [
      { id: 'suite-at-r2', label: 'Suite parentale', icon: '🛏️', x: 20, y: 20,  w: 360, h: 160, fill: '#F0F4E8', defaultPhotos: ['/images/lauris-atelier5.jpg'] },
      { id: 'terrasse-at', label: 'Terrasse',        icon: '☀️', x: 20, y: 200, w: 360, h: 40,  fill: '#E8F5E8', defaultPhotos: [] },
    ],
  },
];

export const FLOOR_PLAN_ROOMS: Record<string, FloorDef[]> = {
  'lauris-meme': memeFloors,
  'lauris-atelier': atelierFloors,
};
