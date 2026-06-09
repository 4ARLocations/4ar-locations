// Types pour les plans interactifs
export type Hotspot = {
  id: string;
  label: string;       // "Cuisine", "WC", "Chambre 1", etc.
  x: number;           // position en % (0-100) sur le plan
  y: number;           // position en % (0-100)
  photoUrl?: string;   // URL de la photo à afficher
};

export type FloorPlanFloor = {
  id: string;          // "rdc", "r1", "r2"
  label: string;       // "Rez-de-chaussée", "1er étage", "2e étage"
  imageUrl: string;
  hotspots: Hotspot[];
};

export type PropertyFloorPlan = {
  propertyId: string;
  floors: FloorPlanFloor[];
};

// Plans statiques initiaux (les positions des points peuvent être modifiées dans l'admin)
// Les coordonnées x,y sont en pourcentage par rapport à l'image
export const defaultFloorPlans: Record<string, PropertyFloorPlan> = {
  'lauris-alain': {
    propertyId: 'lauris-alain',
    floors: [
      {
        id: 'rdc',
        label: 'Rez-de-chaussée',
        imageUrl: '/images/plans/alain-rdc.png',
        hotspots: [],
      },
      {
        id: 'r1',
        label: '1er étage',
        imageUrl: '/images/plans/alain-r1.png',
        hotspots: [],
      },
      {
        id: 'r2',
        label: '2e étage',
        imageUrl: '/images/plans/alain-r2.png',
        hotspots: [],
      },
    ],
  },
  'lauris-meme': {
    propertyId: 'lauris-meme',
    floors: [
      {
        id: 'rdc',
        label: 'Rez-de-chaussée',
        imageUrl: '/images/plans/meme-atelier-rdc.png',
        hotspots: [],
      },
      {
        id: 'r1',
        label: '1er étage',
        imageUrl: '/images/plans/meme-atelier-r1.png',
        hotspots: [],
      },
      {
        id: 'r2',
        label: '2e étage',
        imageUrl: '/images/plans/meme-atelier-r2.png',
        hotspots: [],
      },
    ],
  },
  'lauris-atelier': {
    propertyId: 'lauris-atelier',
    floors: [
      {
        id: 'rdc',
        label: 'Rez-de-chaussée',
        imageUrl: '/images/plans/meme-atelier-rdc.png',
        hotspots: [],
      },
      {
        id: 'r1',
        label: '1er étage',
        imageUrl: '/images/plans/meme-atelier-r1.png',
        hotspots: [],
      },
      {
        id: 'r2',
        label: '2e étage',
        imageUrl: '/images/plans/meme-atelier-r2.png',
        hotspots: [],
      },
    ],
  },
};
