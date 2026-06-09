/**
 * Plans d'étage avec coordonnées précises en mètres
 * Issues des plans architecturaux (Cabinet CLAIRE LAFFRA, 07/07/2022, éch 1/75)
 *
 * Système de coordonnées : origine = coin supérieur-gauche intérieur du bâtiment
 * x → droite, y → bas (en mètres)
 * Les pièces adjacentes partagent exactement leur coordonnée de mur.
 * L'épaisseur de mur visible est générée par le rendu SVG (inset de 5px).
 */

export type DoorSpec = {
  // Mur où s'ouvre la porte : 'top' | 'right' | 'bottom' | 'left'
  wall: 'top' | 'right' | 'bottom' | 'left';
  // Position le long du mur (0 = début, 1 = fin), en fraction de la longueur du mur
  pos: number;
  // Largeur de la porte (mètres)
  width: number;
  // Direction d'ouverture de l'arc : 'in' | 'out'
  swing: 'in' | 'out';
};

export type FurnitureItem = {
  type: 'bed-double' | 'bed-single' | 'sofa' | 'kitchen-counter' | 'island'
       | 'toilet' | 'shower' | 'bathtub' | 'washer' | 'stairs-up' | 'stairs-down'
       | 'table' | 'wardrobe' | 'tv';
  x: number; y: number; w: number; h: number;
  rotate?: number; // degrés
};

export type RoomData = {
  id: string;
  label: string;
  area?: string;        // "33.4 m²"
  x: number;           // mètres, depuis le coin int. du bâtiment
  y: number;
  w: number;
  h: number;
  fill: string;         // couleur de fond
  textColor?: string;
  furniture?: FurnitureItem[];
  doors?: DoorSpec[];
  hasPhotos: boolean;   // peut avoir des photos assignées
  defaultPhotos: string[];
};

export type FloorData = {
  id: string;
  label: string;       // "Rez-de-chaussée", "1er étage", "2e étage"
  // Bâtiment global de cet étage (peut inclure terrasses extérieures)
  buildingW: number;
  buildingH: number;
  // Décalage optionnel d'une zone extérieure (terrasse tropézienne etc.)
  rooms: RoomData[];
};

export type PropertyFloorData = {
  propertyId: string;
  floors: FloorData[];
};

// ─── Couleurs ────────────────────────────────────────────────────────────────
const C = {
  living: '#FFF3E8',    // séjour / cuisine / salle à manger
  bedroom: '#EEF4E8',   // chambre
  wet: '#E8F0F8',       // salle d'eau / WC / salle de bain
  service: '#F0EBE3',   // buanderie / rangement / dressing / débarras
  circulation: '#F5F2ED', // couloir / dégagement / entrée / palier
  stair: '#E8E0D8',     // escalier
  terrace: '#E2EDD8',   // terrasse / extérieur
};

// ═══════════════════════════════════════════════════════════════════════════
//  ATELIER
// ═══════════════════════════════════════════════════════════════════════════

const atelierRDC: FloorData = {
  id: 'rdc',
  label: 'Rez-de-chaussée',
  buildingW: 5.4,
  buildingH: 8.8,
  rooms: [
    // ── Rangée du haut (entrée) ──
    {
      id: 'lavoir', label: 'Lavoir', area: '2 m²',
      x: 0, y: 0, w: 1.8, h: 1.2,
      fill: C.service,
      furniture: [{ type: 'washer', x: 0.15, y: 0.1, w: 0.6, h: 0.6 }],
      doors: [{ wall: 'right', pos: 0.5, width: 0.8, swing: 'in' }],
      hasPhotos: false, defaultPhotos: [],
    },
    {
      id: 'escalier-at-rdc', label: 'Escalier', area: '',
      x: 1.8, y: 0, w: 1.8, h: 1.2,
      fill: C.stair,
      furniture: [{ type: 'stairs-up', x: 0.1, y: 0.1, w: 1.6, h: 1.0 }],
      hasPhotos: false, defaultPhotos: [],
    },
    {
      id: 'entree-at', label: 'Entrée', area: '',
      x: 3.6, y: 0, w: 1.8, h: 1.2,
      fill: C.circulation,
      doors: [{ wall: 'top', pos: 0.5, width: 0.9, swing: 'in' }],
      hasPhotos: false, defaultPhotos: [],
    },
    // ── Pièce principale ──
    {
      id: 'sejour-at', label: 'Cuisine & Séjour', area: '33.4 m²',
      x: 0, y: 1.2, w: 5.4, h: 6.2,
      fill: C.living,
      furniture: [
        { type: 'kitchen-counter', x: 0.2, y: 0.2, w: 3.0, h: 0.65 },
        { type: 'island',         x: 0.5, y: 1.3, w: 1.6, h: 0.9 },
        { type: 'sofa',           x: 1.5, y: 3.5, w: 2.2, h: 0.9 },
        { type: 'table',          x: 0.3, y: 4.8, w: 1.4, h: 0.9 },
      ],
      doors: [{ wall: 'top', pos: 0.5, width: 1.2, swing: 'out' }],
      hasPhotos: true,
      defaultPhotos: ['/images/lauris-atelier4.jpg', '/images/lauris-atelier3.jpg'],
    },
    // ── Rangée du bas ──
    {
      id: 'wc-at-rdc', label: 'WC', area: '1.4 m²',
      x: 0, y: 7.4, w: 1.2, h: 1.4,
      fill: C.wet,
      furniture: [{ type: 'toilet', x: 0.15, y: 0.2, w: 0.4, h: 0.7 }],
      doors: [{ wall: 'top', pos: 0.5, width: 0.7, swing: 'in' }],
      hasPhotos: false, defaultPhotos: [],
    },
    {
      id: 'dgt-at-rdc', label: 'Dégagement', area: '1.6 m²',
      x: 1.2, y: 7.4, w: 1.4, h: 1.4,
      fill: C.circulation,
      hasPhotos: false, defaultPhotos: [],
    },
    {
      id: 'stockage-at-rdc', label: 'Stockage', area: '',
      x: 2.6, y: 7.4, w: 2.8, h: 1.4,
      fill: C.service,
      hasPhotos: false, defaultPhotos: [],
    },
  ],
};

const atelierR1: FloorData = {
  id: 'r1',
  label: '1er étage',
  buildingW: 5.4,
  buildingH: 6.4,
  rooms: [
    {
      id: 'chambre-at-r1', label: 'Suite parentale', area: '12 m²',
      x: 0, y: 0, w: 3.5, h: 3.4,
      fill: C.bedroom,
      furniture: [
        { type: 'bed-double', x: 0.3, y: 0.4, w: 1.6, h: 2.0 },
        { type: 'wardrobe',   x: 2.6, y: 0.2, w: 0.7, h: 1.4 },
      ],
      doors: [{ wall: 'right', pos: 0.85, width: 0.9, swing: 'in' }],
      hasPhotos: true,
      defaultPhotos: ['/images/lauris-atelier.jpg', '/images/lauris-atelier2.jpg'],
    },
    {
      id: 'sde-at-r1', label: "Salle d'eau", area: '4.8 m²',
      x: 3.5, y: 0, w: 1.9, h: 2.3,
      fill: C.wet,
      furniture: [
        { type: 'shower',  x: 0.2, y: 0.2, w: 0.9, h: 0.9 },
        { type: 'toilet',  x: 1.2, y: 0.2, w: 0.5, h: 0.7 },
      ],
      doors: [{ wall: 'left', pos: 0.2, width: 0.8, swing: 'in' }],
      hasPhotos: false, defaultPhotos: [],
    },
    {
      id: 'dressing-at', label: 'Dressing', area: '2.5 m²',
      x: 3.5, y: 2.3, w: 1.9, h: 1.1,
      fill: C.service,
      furniture: [{ type: 'wardrobe', x: 0.1, y: 0.1, w: 1.7, h: 0.7 }],
      doors: [{ wall: 'left', pos: 0.5, width: 0.7, swing: 'in' }],
      hasPhotos: false, defaultPhotos: [],
    },
    {
      id: 'buanderie-at', label: 'Buanderie & Rangement', area: '10 m²',
      x: 0, y: 3.4, w: 3.5, h: 2.0,
      fill: C.service,
      furniture: [
        { type: 'washer', x: 0.15, y: 0.3, w: 0.6, h: 0.6 },
      ],
      doors: [{ wall: 'top', pos: 0.5, width: 0.9, swing: 'in' }],
      hasPhotos: false, defaultPhotos: [],
    },
    {
      id: 'wc-at-r1', label: 'WC', area: '1.5 m²',
      x: 3.5, y: 3.4, w: 1.0, h: 1.5,
      fill: C.wet,
      furniture: [{ type: 'toilet', x: 0.1, y: 0.3, w: 0.45, h: 0.7 }],
      doors: [{ wall: 'bottom', pos: 0.5, width: 0.7, swing: 'in' }],
      hasPhotos: false, defaultPhotos: [],
    },
    {
      id: 'rangement-at', label: 'Rangement', area: '',
      x: 4.5, y: 3.4, w: 0.9, h: 3.0,
      fill: C.service,
      hasPhotos: false, defaultPhotos: [],
    },
    {
      id: 'escalier-at-r1', label: 'Escalier', area: '',
      x: 3.5, y: 4.9, w: 1.0, h: 1.5,
      fill: C.stair,
      furniture: [{ type: 'stairs-up', x: 0.05, y: 0.05, w: 0.9, h: 1.4 }],
      hasPhotos: false, defaultPhotos: [],
    },
    {
      id: 'palier-at-r1', label: 'Palier', area: '',
      x: 0, y: 5.4, w: 3.5, h: 1.0,
      fill: C.circulation,
      hasPhotos: false, defaultPhotos: [],
    },
  ],
};

const atelierR2: FloorData = {
  id: 'r2',
  label: '2e étage',
  buildingW: 5.4,
  buildingH: 5.5,
  rooms: [
    {
      id: 'chambre-at-r2', label: 'Suite parentale', area: '12.5 m²',
      x: 0, y: 0, w: 2.8, h: 4.5,
      fill: C.bedroom,
      furniture: [
        { type: 'bed-double', x: 0.3, y: 0.5, w: 1.6, h: 2.0 },
        { type: 'wardrobe',   x: 0.2, y: 3.4, w: 1.8, h: 0.6 },
      ],
      doors: [{ wall: 'right', pos: 0.9, width: 0.9, swing: 'in' }],
      hasPhotos: true,
      defaultPhotos: ['/images/lauris-atelier5.jpg'],
    },
    {
      id: 'sde-at-r2', label: "Salle d'eau", area: '4 m²',
      x: 2.8, y: 0, w: 2.6, h: 1.6,
      fill: C.wet,
      furniture: [
        { type: 'shower', x: 0.15, y: 0.1, w: 0.9, h: 0.9 },
        { type: 'toilet', x: 1.5,  y: 0.2, w: 0.45, h: 0.7 },
      ],
      doors: [{ wall: 'left', pos: 0.3, width: 0.8, swing: 'in' }],
      hasPhotos: false, defaultPhotos: [],
    },
    {
      id: 'terrasse-at', label: 'Terrasse', area: '10.4 m²',
      x: 2.8, y: 1.6, w: 2.6, h: 3.9,
      fill: C.terrace,
      hasPhotos: false, defaultPhotos: [],
    },
    {
      id: 'vide-at', label: 'Vide / Escalier', area: '',
      x: 0, y: 4.5, w: 2.8, h: 1.0,
      fill: C.stair,
      furniture: [{ type: 'stairs-down', x: 0.1, y: 0.05, w: 2.6, h: 0.9 }],
      hasPhotos: false, defaultPhotos: [],
    },
  ],
};

// ═══════════════════════════════════════════════════════════════════════════
//  MAISON DE MÉMÉ
// ═══════════════════════════════════════════════════════════════════════════

const memeRDC: FloorData = {
  id: 'rdc',
  label: 'Rez-de-chaussée',
  buildingW: 6.5,
  buildingH: 7.5,
  rooms: [
    // Séjour-Cuisine = SAM + Cuisine dans le plan original
    {
      id: 'sejour-meme', label: 'Séjour & Salle à Manger', area: '12.3 m²',
      x: 0, y: 0, w: 3.5, h: 3.5,
      fill: C.living,
      furniture: [
        { type: 'sofa',  x: 0.2, y: 0.4, w: 2.0, h: 0.9 },
        { type: 'table', x: 0.3, y: 2.0, w: 1.4, h: 0.9 },
        { type: 'tv',    x: 2.8, y: 0.2, w: 0.5, h: 0.2 },
      ],
      doors: [{ wall: 'right', pos: 0.5, width: 1.0, swing: 'out' }],
      hasPhotos: true,
      defaultPhotos: ['/images/lauris-meme5.jpg', '/images/lauris-meme.jpg'],
    },
    {
      id: 'cuisine-meme', label: 'Cuisine', area: '10.4 m²',
      x: 3.5, y: 0, w: 3.0, h: 3.5,
      fill: C.living,
      furniture: [
        { type: 'kitchen-counter', x: 0.15, y: 0.15, w: 2.7, h: 0.65 },
        { type: 'island',          x: 0.5,  y: 1.5,  w: 1.8, h: 0.9  },
      ],
      hasPhotos: true,
      defaultPhotos: ['/images/lauris-meme2.jpg'],
    },
    {
      id: 'wc-meme-rdc', label: 'WC', area: '1.5 m²',
      x: 0, y: 3.5, w: 1.2, h: 1.25,
      fill: C.wet,
      furniture: [{ type: 'toilet', x: 0.15, y: 0.2, w: 0.45, h: 0.7 }],
      doors: [{ wall: 'top', pos: 0.5, width: 0.7, swing: 'in' }],
      hasPhotos: false, defaultPhotos: [],
    },
    {
      id: 'dgt-meme-rdc', label: 'Dégagement', area: '2.25 m²',
      x: 1.2, y: 3.5, w: 1.5, h: 1.5,
      fill: C.circulation,
      hasPhotos: false, defaultPhotos: [],
    },
    {
      id: 'debarras-meme', label: 'Débarras', area: '',
      x: 2.7, y: 3.5, w: 1.5, h: 1.5,
      fill: C.service,
      hasPhotos: false, defaultPhotos: [],
    },
    {
      id: 'escalier-meme-rdc', label: 'Escalier', area: '',
      x: 4.2, y: 3.5, w: 2.3, h: 2.0,
      fill: C.stair,
      furniture: [{ type: 'stairs-up', x: 0.1, y: 0.1, w: 2.1, h: 1.8 }],
      hasPhotos: false, defaultPhotos: [],
    },
    {
      id: 'entree-meme', label: 'Entrée', area: '',
      x: 0, y: 5.0, w: 4.2, h: 1.3,
      fill: C.circulation,
      doors: [{ wall: 'bottom', pos: 0.5, width: 1.0, swing: 'out' }],
      hasPhotos: false, defaultPhotos: [],
    },
    {
      id: 'couloir-meme-rdc', label: 'Couloir', area: '',
      x: 0, y: 6.3, w: 6.5, h: 1.2,
      fill: C.circulation,
      hasPhotos: false, defaultPhotos: [],
    },
  ],
};

const memeR1: FloorData = {
  id: 'r1',
  label: '1er étage',
  buildingW: 6.5,
  buildingH: 7.0,
  rooms: [
    {
      id: 'chambre1-meme', label: 'Chambre 1', area: '2 lits simples',
      x: 0, y: 0, w: 2.8, h: 3.2,
      fill: C.bedroom,
      furniture: [
        { type: 'bed-single', x: 0.2, y: 0.3, w: 0.9, h: 2.0 },
        { type: 'bed-single', x: 1.6, y: 0.3, w: 0.9, h: 2.0 },
      ],
      doors: [{ wall: 'bottom', pos: 0.5, width: 0.9, swing: 'in' }],
      hasPhotos: true,
      defaultPhotos: ['/images/lauris-meme3.jpg'],
    },
    {
      id: 'chambre2-meme', label: 'Chambre 2', area: 'Lit double',
      x: 2.8, y: 0, w: 3.7, h: 3.2,
      fill: C.bedroom,
      furniture: [
        { type: 'bed-double', x: 0.4, y: 0.4, w: 1.6, h: 2.0 },
        { type: 'wardrobe',   x: 2.8, y: 0.2, w: 0.7, h: 2.0 },
      ],
      doors: [{ wall: 'bottom', pos: 0.5, width: 0.9, swing: 'in' }],
      hasPhotos: true,
      defaultPhotos: ['/images/lauris-meme4.jpg'],
    },
    {
      id: 'wc-meme-r1', label: 'WC', area: '',
      x: 0, y: 3.2, w: 1.2, h: 1.4,
      fill: C.wet,
      furniture: [{ type: 'toilet', x: 0.15, y: 0.3, w: 0.45, h: 0.7 }],
      doors: [{ wall: 'top', pos: 0.5, width: 0.7, swing: 'in' }],
      hasPhotos: false, defaultPhotos: [],
    },
    {
      id: 'dressing-meme-r1', label: 'Grand Dressing', area: '',
      x: 1.2, y: 3.2, w: 2.2, h: 1.4,
      fill: C.service,
      furniture: [
        { type: 'wardrobe', x: 0.1, y: 0.1, w: 2.0, h: 0.6 },
        { type: 'wardrobe', x: 0.1, y: 0.7, w: 2.0, h: 0.6 },
      ],
      hasPhotos: false, defaultPhotos: [],
    },
    {
      id: 'sde-meme-r1', label: "Salle d'eau", area: '',
      x: 3.4, y: 3.2, w: 2.0, h: 2.0,
      fill: C.wet,
      furniture: [
        { type: 'shower', x: 0.1, y: 0.1, w: 0.9, h: 0.9 },
        { type: 'toilet', x: 1.3, y: 0.2, w: 0.45, h: 0.7 },
      ],
      doors: [{ wall: 'top', pos: 0.5, width: 0.9, swing: 'in' }],
      hasPhotos: false, defaultPhotos: [],
    },
    {
      id: 'escalier-meme-r1', label: 'Escalier', area: '',
      x: 5.4, y: 3.2, w: 1.1, h: 2.0,
      fill: C.stair,
      furniture: [{ type: 'stairs-up', x: 0.05, y: 0.05, w: 1.0, h: 1.9 }],
      hasPhotos: false, defaultPhotos: [],
    },
    {
      id: 'salon-meme', label: 'Salon TV', area: '',
      x: 0, y: 4.6, w: 3.4, h: 2.4,
      fill: C.living,
      furniture: [
        { type: 'sofa', x: 0.2, y: 0.5, w: 2.4, h: 0.9 },
        { type: 'tv',   x: 0.2, y: 0.1, w: 0.5, h: 0.2 },
      ],
      doors: [{ wall: 'top', pos: 0.5, width: 0.9, swing: 'in' }],
      hasPhotos: true,
      defaultPhotos: ['/images/lauris-meme6.jpg'],
    },
    {
      id: 'dgt-meme-r1', label: 'Dégagement', area: '',
      x: 3.4, y: 5.2, w: 2.0, h: 1.8,
      fill: C.circulation,
      hasPhotos: false, defaultPhotos: [],
    },
  ],
};

const memeR2: FloorData = {
  id: 'r2',
  label: '2e étage',
  buildingW: 6.5,
  buildingH: 7.0,
  rooms: [
    {
      id: 'chambre3-meme', label: 'Chambre 3', area: '15.4 m²',
      x: 0, y: 0, w: 4.0, h: 3.85,
      fill: C.bedroom,
      furniture: [
        { type: 'bed-double', x: 0.3, y: 0.4, w: 1.6, h: 2.0 },
        { type: 'wardrobe',   x: 3.1, y: 0.2, w: 0.7, h: 2.0 },
      ],
      doors: [{ wall: 'bottom', pos: 0.5, width: 0.9, swing: 'in' }],
      hasPhotos: true,
      defaultPhotos: ['/images/lauris-meme7.jpg'],
    },
    {
      id: 'chambre4-meme', label: 'Chambre 4', area: '9 m²',
      x: 4.0, y: 0, w: 2.5, h: 3.85,
      fill: C.bedroom,
      furniture: [
        { type: 'bed-double', x: 0.2, y: 0.4, w: 1.6, h: 2.0 },
      ],
      doors: [{ wall: 'bottom', pos: 0.5, width: 0.9, swing: 'in' }],
      hasPhotos: true,
      defaultPhotos: ['/images/lauris-meme.jpg'],
    },
    {
      id: 'sde-meme-r2', label: "Salle d'eau + WC", area: '4.5 m²',
      x: 0, y: 3.85, w: 4.0, h: 1.15,
      fill: C.wet,
      furniture: [
        { type: 'shower',  x: 0.1, y: 0.1, w: 0.9, h: 0.9 },
        { type: 'toilet',  x: 1.3, y: 0.1, w: 0.45, h: 0.7 },
        { type: 'bathtub', x: 2.3, y: 0.1, w: 1.4, h: 0.85 },
      ],
      doors: [{ wall: 'top', pos: 0.3, width: 0.9, swing: 'in' }],
      hasPhotos: false, defaultPhotos: [],
    },
    {
      id: 'palier-meme-r2', label: 'Palier', area: '4.7 m²',
      x: 4.0, y: 3.85, w: 2.5, h: 1.65,
      fill: C.circulation,
      furniture: [{ type: 'stairs-down', x: 0.1, y: 0.1, w: 2.3, h: 1.45 }],
      hasPhotos: false, defaultPhotos: [],
    },
    // Terrasse tropézienne (extérieure, montrée sous le bâtiment principal)
    {
      id: 'terrasse-meme-r2', label: 'Terrasse Tropézienne', area: '19.5 m²',
      x: 0, y: 5.0, w: 6.5, h: 2.0,
      fill: C.terrace,
      hasPhotos: false, defaultPhotos: [],
    },
  ],
};

// ─── Export ──────────────────────────────────────────────────────────────────

export const FLOOR_PLAN_DATA: Record<string, PropertyFloorData> = {
  'lauris-atelier': {
    propertyId: 'lauris-atelier',
    floors: [atelierRDC, atelierR1, atelierR2],
  },
  'lauris-meme': {
    propertyId: 'lauris-meme',
    floors: [memeRDC, memeR1, memeR2],
  },
};
