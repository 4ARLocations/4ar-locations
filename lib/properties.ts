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
  beds: number;
  bathrooms: number;
  priceFrom: number;
  priceTo?: number;         // pour les tarifs variables (ex: Risoul 75-180€)
  priceOnRequest?: boolean; // "Nous contacter pour les tarifs"
  cleaningFee?: number;     // frais de ménage
  minNights?: number;       // durée minimum de séjour
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
    bedrooms: 1,
    beds: 6,
    bathrooms: 1,
    priceFrom: 75,
    priceTo: 180,
    priceOnRequest: true,
    airbnbUrl: 'https://www.airbnb.fr/rooms/28044230',
    image: '/images/risoul3.jpg',
    images: ['/images/risoul3.jpg', '/images/risoul4.jpg', '/images/risoul.jpg', '/images/risoul5.jpg', '/images/risoul2.jpg'],
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
    beds: 2,
    bathrooms: 1,
    priceFrom: 0,
    airbnbUrl: 'https://www.airbnb.fr/rooms/1439243184509708331',
    image: '/images/avignon.jpg',
    images: ['/images/avignon.jpg', '/images/avignon2.jpg', '/images/avignon3.jpg', '/images/avignon4.jpg'],
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
    beds: 5,
    bathrooms: 2,
    priceFrom: 142,
    cleaningFee: 120,
    minNights: 2,
    airbnbUrl: 'https://www.airbnb.fr/rooms/1175438485297975130',
    abritelUrl: 'https://www.abritel.fr/location-vacances/p2476917?dateless=true',
    image: '/images/lauris-meme5.jpg',
    images: ['/images/lauris-meme5.jpg', '/images/lauris-meme.jpg', '/images/lauris-meme4.jpg', '/images/lauris-meme6.jpg', '/images/lauris-meme7.jpg', '/images/lauris-meme2.jpg', '/images/lauris-meme3.jpg'],
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
    beds: 2,
    bathrooms: 2,
    priceFrom: 115,
    cleaningFee: 80,
    minNights: 2,
    airbnbUrl: 'https://www.airbnb.fr/rooms/1175460558277880811',
    abritelUrl: 'https://www.abritel.fr/location-vacances/p2476923?dateless=true',
    image: '/images/lauris-atelier4.jpg',
    images: ['/images/lauris-atelier4.jpg', '/images/lauris-atelier3.jpg', '/images/lauris-atelier.jpg', '/images/lauris-atelier5.jpg', '/images/lauris-atelier2.jpg'],
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
    guests: 8,
    bedrooms: 4,
    beds: 2,
    bathrooms: 3,
    priceFrom: 200,
    cleaningFee: 100,
    minNights: 2,
    airbnbUrl: 'https://www.airbnb.fr/rooms/1336390142884366353',
    image: '/images/alain/alain-terrasse.jpg',
    images: [
      '/images/alain/alain-terrasse.jpg',
      '/images/alain/alain-salon-1.jpg',
      '/images/alain/alain-salon-2.jpg',
      '/images/alain/alain-salon-rdc-1.jpg',
      '/images/alain/alain-salon-rdc-2.jpg',
      '/images/alain/alain-sam-1.jpg',
      '/images/alain/alain-cuisine-1.jpg',
      '/images/alain/alain-cuisine-2.jpg',
      '/images/alain/alain-sdb-1er.jpg',
      '/images/alain/alain-sdb-2e-1.jpg',
      '/images/alain/alain-ch1-1er.jpg',
      '/images/alain/alain-ch1-2e.jpg',
      '/images/alain/alain-ch2-2e-1.jpg',
      '/images/alain/alain-ch3-1er-1.jpg',
      '/images/alain/alain-ch4-2e-1.jpg',
      '/images/alain/alain-ch4-2e-2.jpg',
    ],
    region: 'luberon',
  },
];
