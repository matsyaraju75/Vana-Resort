/**
 * @file images.ts
 * @description Centralized image repository for Vana Resort Araku.
 * Property photographs loaded directly from verified assets.
 * Note: Homepage hero background is preserved as requested.
 */

export const RESORT_IMAGES = {
  // Preserve homepage hero background untouched
  hero: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1920&q=85',
  welcome: './images/resort/entrance.jpeg',
  cta: './images/nature/mountains.jpeg',
  about: './images/resort/garden-walkway.jpeg',
  rooms: {
    standardNonAc: {
      primary: './images/rooms/standard-non-ac-room.png',
      gallery: [
        './images/rooms/standard-non-ac-room.png',
        './images/rooms/standard-non-ac.png',
        './images/rooms/standard-non-ac-bathroom.png',
        './images/gallery/room-sanitary-fittings.png',
      ],
    },
    acDeluxe: {
      primary: './images/rooms/ac-deluxe.png',
      gallery: [
        './images/rooms/ac-deluxe.png',
        './images/gallery/ac-deluxe-room-interior.png',
        './images/gallery/deluxe-bedroom-bed.png',
        './images/gallery/designer-tiled-bathroom.png',
        './images/gallery/room-sanitary-fittings.png',
        './images/gallery/glass-balcony-sitting-area.png',
      ],
    },
    juniorSuite: {
      primary: './images/rooms/junior-suite.png',
      gallery: [
        './images/rooms/junior-suite.png',
        './images/gallery/suite-living-room.png',
        './images/gallery/designer-tiled-bathroom.png',
        './images/gallery/room-sanitary-fittings.png',
        './images/gallery/glass-balcony-sitting-area.png',
      ],
    },
    executiveSuite: {
      primary: './images/rooms/executive-suite.png',
      gallery: [
        './images/rooms/executive-suite.png',
        './images/gallery/suite-living-room.png',
        './images/gallery/designer-tiled-bathroom.png',
        './images/gallery/room-sanitary-fittings.png',
        './images/gallery/glass-balcony-sitting-area.png',
      ],
    },
  },
  amenities: {
    pool: './images/resort/swimming-pool.jpeg',
    restaurant: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80',
    parking: './images/resort/entrance.jpeg',
    wifi: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80',
  },
  gallery: [
    {
      id: 'g-resort-1',
      title: 'Resort Lawns & Architecture',
      category: 'resort',
      src: './images/resort/resort.jpeg',
      alt: 'Exterior facade and landscaped lawns of Vana Resort nestled in Araku Valley',
    },
    {
      id: 'g-resort-2',
      title: 'Resort Grand Entrance',
      category: 'resort',
      src: './images/resort/entrance.jpeg',
      alt: 'Main entry gate welcoming guests to Vana Resort Araku',
    },
    {
      id: 'g-suite-1',
      title: 'Executive Suite Room',
      category: 'suites',
      src: './images/rooms/executive-suite.png',
      alt: 'Spacious 600 sq.ft Executive Suite with climate control and premium furnishings',
    },
    {
      id: 'g-suite-2',
      title: 'Junior Suite Room',
      category: 'suites',
      src: './images/rooms/junior-suite.png',
      alt: 'Junior Suite with in-suite heater and Araku hill comfort',
    },
    {
      id: 'g-room-1',
      title: 'AC Deluxe Room',
      category: 'rooms',
      src: './images/rooms/ac-deluxe.png',
      alt: 'Comfortable AC Deluxe bedroom with workstation and sitting area',
    },
    {
      id: 'g-room-2',
      title: 'Standard Non AC Room',
      category: 'rooms',
      src: './images/rooms/standard-non-ac-room.png',
      alt: 'Cozy and clean Standard Non AC Room with natural mountain airflow',
    },
    {
      id: 'g-room-3',
      title: 'Standard Non AC Room View',
      category: 'rooms',
      src: './images/rooms/standard-non-ac.png',
      alt: 'Standard Non AC Room queen bed interior',
    },
    {
      id: 'g-room-4',
      title: 'Standard Non AC Bathroom',
      category: 'rooms',
      src: './images/rooms/standard-non-ac-bathroom.png',
      alt: 'Clean, sanitized private bathroom attached to Standard Non AC Room',
    },
    {
      id: 'g-pool-1',
      title: 'Hillside Swimming Pool',
      category: 'pool',
      src: './images/resort/swimming-pool.jpeg',
      alt: 'Clean outdoor swimming pool overlooking Araku hill vistas',
    },
    {
      id: 'g-pool-2',
      title: 'Swimming Pool Deck & Loungers',
      category: 'pool',
      src: './images/resort/swimming-pool-1.jpeg',
      alt: 'Relaxation deck by the resort swimming pool',
    },
    {
      id: 'g-garden-1',
      title: 'Lush Resort Garden',
      category: 'resort',
      src: './images/resort/garden.jpeg',
      alt: 'Vibrant green gardens and flower beds within Vana Resort',
    },
    {
      id: 'g-garden-2',
      title: 'Garden Walkway',
      category: 'resort',
      src: './images/resort/garden-walkway.jpeg',
      alt: 'Paved garden walkway winding through resort greenery',
    },
    {
      id: 'g-nature-1',
      title: 'Araku Valley Mountain Ridges',
      category: 'nature',
      src: './images/nature/mountains.jpeg',
      alt: 'Misty Eastern Ghats mountains surrounding Araku Valley',
    },
    {
      id: 'g-nature-2',
      title: 'Serene Araku Scenery',
      category: 'nature',
      src: './images/nature/scenery.jpeg',
      alt: 'Scenic valley landscapes and rolling hills around the resort',
    },
    {
      id: 'g-statue-1',
      title: 'Resort Garden Sculpture',
      category: 'resort',
      src: './images/resort/statue.jpeg',
      alt: 'Decorative sculpture and stone artwork in the resort grounds',
    },
  ],
};
