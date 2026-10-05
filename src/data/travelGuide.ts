/**
 * @file travelGuide.ts
 * @description Curated experiences, Things to Do, and comprehensive travel guide for Araku Valley.
 */

export interface ActivityItem {
  id: string;
  title: string;
  category: string;
  duration: string;
  bestTime: string;
  description: string;
  iconName: string;
  highlights: string[];
  image: string;
}

export interface TravelTipSection {
  title: string;
  items: {
    heading: string;
    details: string;
    iconName: string;
  }[];
}

export const THINGS_TO_DO: ActivityItem[] = [
  {
    id: 'coffee-trail',
    title: 'Araku Coffee Plantation Trail & Tasting',
    category: 'Gastronomy & Nature',
    duration: '2 – 3 Hours',
    bestTime: 'Morning (8:00 AM – 11:00 AM)',
    description:
      'Walk alongside shade-grown Arabica coffee bushes under silver oak canopies. Learn about red cherry harvesting, pulping, sun-drying, and finish with a cupping session of fresh valley brew.',
    iconName: 'Coffee',
    highlights: ['Interactive estate walking tour', 'Learn hand-picking & bean roasting', 'Artisanal single-origin coffee tasting'],
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=1000&q=80',
  },
  {
    id: 'vistadome-journey',
    title: 'Vistadome Glass-Coach Train Journey',
    category: 'Scenic Transit',
    duration: '3.5 Hours',
    bestTime: 'Morning Train (Visakhapatnam to Araku)',
    description:
      'Ride the iconic railway line traversing 58 tunnels and over 84 bridges cutting through the Eastern Ghats. 360-degree glass ceiling and large observation windows provide unmatched valley views.',
    iconName: 'Train',
    highlights: ['58 tunnels & mountain viaducts', 'Rotatable comfortable reclining seats', 'Panoramic mist-covered hill scenery'],
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1000&q=80',
  },
  {
    id: 'dhimsa-dance',
    title: 'Dhimsa Tribal Folk Dance Evenings',
    category: 'Culture & Performing Arts',
    duration: '1 – 1.5 Hours',
    bestTime: 'Sunset / Nightly campfire',
    description:
      'Experience the spirited rhythmic chain dance of indigenous Valmiki and Bagata tribes performed during festivals and harvest celebrations to the beat of traditional drums and Mori wind instruments.',
    iconName: 'Music',
    highlights: ['Authentic tribal attire and ornaments', 'Rhythmic communal circle dance', 'Audience participation welcome'],
    image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1000&q=80',
  },
  {
    id: 'bamboo-chicken',
    title: 'Savor Authentic Bamboo Chicken & Tribal Cuisine',
    category: 'Culinary Delight',
    duration: '1 Hour',
    bestTime: 'Lunch / Dinner',
    description:
      'Taste meat or country vegetables marinated in local hill spices, stuffed into green hollow bamboo stalks, and slow-cooked over burning hardwood embers without adding extra cooking oil.',
    iconName: 'UtensilsCrossed',
    highlights: ['Zero-oil traditional tribal recipe', 'Smoky aromatic bamboo flavor', 'Available near Chaparai & Padmapuram'],
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=1000&q=80',
  },
  {
    id: 'cloud-sunrise-trek',
    title: 'Sunrise Cloud Sea Watching at Madagada & Galikonda',
    category: 'Adventure & Trekking',
    duration: '2 – 3 Hours',
    bestTime: 'Early Dawn (5:30 AM – 7:30 AM)',
    description:
      'Ascend the high ridgelines before daybreak to witness clouds blanket the valleys below like a tranquil white ocean while the sun peaks over the Eastern Ghats mountains.',
    iconName: 'Sun',
    highlights: ['Breathtaking cloud inversion', 'Cool 3,800 ft mountain winds', 'Golden hour valley photography'],
    image: './images/nature/mountains.jpeg',
  },
  {
    id: 'handicrafts-shopping',
    title: 'Tribal Handicrafts & Organic Honey Shopping',
    category: 'Local Markets',
    duration: '1 – 2 Hours',
    bestTime: 'Afternoon / Evening',
    description:
      'Browse indigenous bazaars for raw forest honey, handmade bamboo crafts, wrought iron decor, colorful Dhurrie textiles, and Araku pepper.',
    iconName: 'ShoppingBag',
    highlights: ['Certified 100% wild tribal honey', 'Hand-carved wooden sculptures', 'Direct support to local artisan communities'],
    image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=1000&q=80',
  },
];

export const TRAVEL_GUIDE_SECTIONS = {
  overview:
    'Araku Valley is a picturesque hill retreat nestled at 3,200 ft in the Eastern Ghats of Andhra Pradesh, famous for its aromatic Arabica coffee, indigenous tribal heritage, cascading waterfalls, and cool mountain breezes.',
  howToReach: [
    {
      mode: 'By Train (Vistadome Line)',
      details:
        'The most scenic route is the daily Visakhapatnam–Kirandul Passenger (Train No. 18514 / 18551) with dedicated Vistadome coaches. Reaches Araku Railway Station (~4.6 km from resort) in approx. 3.5 hours.',
    },
    {
      mode: 'By Road (Scenic Ghat Road)',
      details:
        'A picturesque 115 km drive from Visakhapatnam via SH 39. The winding ghat road passes through Tyda, offering roadside viewpoints and forest canopies. Private cabs and state APSRTC buses ply regularly.',
    },
    {
      mode: 'By Air',
      details:
        'Nearest airport is Visakhapatnam International Airport (VTZ), situated approximately 110 km away with daily flights connecting all major Indian metropolises.',
    },
  ],
  bestTimeToVisit: [
    {
      season: 'Winter (October to March)',
      temp: '10°C – 25°C',
      description: 'Peak season with cool mornings, dense valley mist, cloud seas, and pleasant daytime sightseeing temperatures.',
    },
    {
      season: 'Monsoon (July to September)',
      temp: '18°C – 28°C',
      description: 'The valley turns emerald green and waterfalls roar at maximum volume. Ideal for nature lovers and cloud enthusiasts.',
    },
    {
      season: 'Summer (April to June)',
      temp: '22°C – 34°C',
      description: 'Significantly cooler than coastal Visakhapatnam plains. Evenings are pleasant with fresh mountain breezes.',
    },
  ],
  packingTips: [
    'Light woolens, jackets, and shawls for chilly evenings (especially Nov–Feb)',
    'Comfortable trekking or walking shoes for Borra Caves and waterfalls',
    'Rain poncho or umbrella during monsoon or winter morning mist',
    'Extra memory cards and cameras for valley photography',
    'Cash in small denominations as remote rural stalls might have patchy digital payments',
  ],
};
