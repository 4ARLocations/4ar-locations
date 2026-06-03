export type Property = {
  id: string;
  slug: string;
  nameKey: string;
  locationKey: string;
  typeKey: string;
  descriptionKey: string;
  badgeKey: string;
  guests: number;
  bedrooms: number;
  bathrooms: number;
  priceFrom: number;
  airbnbUrl: string;
  abritelUrl?: string;
  image: string;
  images: string[];
  region: 'alpes' | 'avignon' | 'luberon';
};

export const properties: Property[] = [
  {
    id: 'risoul',
    slug: 'risoul',
    nameKey: 'property_risoul.name',
    locationKey: 'property_risoul.location',
    typeKey: 'property_risoul.type',
    descriptionKey: 'property_risoul.description',
    badgeKey: 'property_risoul.badge',
    guests: 6,
    bedrooms: 2,
    bathrooms: 1,
    priceFrom: 0,
    airbnbUrl: 'https://www.airbnb.fr/rooms/28044230',
    image: '/images/risoul.jpg',
    images: ['/images/risoul.jpg', '/images/risoul2.jpg'],
    region: 'alpes',
  },
  {
    id: 'avignon',
    slug: 'avignon',
    nameKey: 'property_avignon.name',
    locationKey: 'property_avignon.location',
    typeKey: 'property_avignon.type',
    descriptionKey: 'property_avignon.description',
    badgeKey: 'property_avignon.badge',
    guests: 2,
    bedrooms: 1,
    bathrooms: 1,
    priceFrom: 0,
    airbnbUrl: 'https://www.airbnb.fr/rooms/1439243184509708331',
    image: '/images/avignon.jpg',
    images: ['/images/avignon.jpg', '/images/avignon2.jpg'],
    region: 'avignon',
  },
  {
    id: 'lauris-meme',
    slug: 'lauris-meme',
    nameKey: 'property_lauris1.name',
    locationKey: 'property_lauris1.location',
    typeKey: 'property_lauris1.type',
    descriptionKey: 'property_lauris1.description',
    badgeKey: 'property_lauris1.badge',
    guests: 8,
    bedrooms: 4,
    bathrooms: 2,
    priceFrom: 0,
    airbnbUrl: 'https://www.airbnb.fr/rooms/1175438485297975130',
    abritelUrl: 'https://www.abritel.fr/location-vacances/p2476917?dateless=true',
    image: '/images/lauris-meme.jpg',
    images: ['/images/lauris-meme.jpg', '/images/lauris-meme2.jpg', '/images/lauris-meme3.jpg'],
    region: 'luberon',
  },
  {
    id: 'lauris-atelier',
    slug: 'lauris-atelier',
    nameKey: 'property_lauris2.name',
    locationKey: 'property_lauris2.location',
    typeKey: 'property_lauris2.type',
    descriptionKey: 'property_lauris2.description',
    badgeKey: 'property_lauris2.badge',
    guests: 4,
    bedrooms: 2,
    bathrooms: 1,
    priceFrom: 0,
    airbnbUrl: 'https://www.airbnb.fr/rooms/1175460558277880811',
    abritelUrl: 'https://www.abritel.fr/location-vacances/p2476923?dateless=true',
    image: '/images/lauris-atelier.jpg',
    images: ['/images/lauris-atelier.jpg', '/images/lauris-atelier2.jpg'],
    region: 'luberon',
  },
  {
    id: 'lauris-alain',
    slug: 'lauris-alain',
    nameKey: 'property_lauris3.name',
    locationKey: 'property_lauris3.location',
    typeKey: 'property_lauris3.type',
    descriptionKey: 'property_lauris3.description',
    badgeKey: 'property_lauris3.badge',
    guests: 6,
    bedrooms: 3,
    bathrooms: 1,
    priceFrom: 120,
    airbnbUrl: '#',
    image: '/images/lauris-meme.jpg',
    images: ['/images/lauris-meme.jpg'],
    region: 'luberon',
  },
];
