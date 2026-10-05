/**
 * @file resortData.ts
 * @description Centralized typed data repository for Vana Resort Araku.
 * Any edits to room details, prices, contact info, or local spots can be made here directly.
 */

import type { Room, Amenity, Attraction, ResortContact, Testimonial } from '../types/resort';

export const RESORT_CONTACT: ResortContact = {
  brandName: 'Vana Resort Araku',
  tagline: 'Eco-Luxury Hill Sanctuary in the Eastern Ghats',
  address: 'Padmapuram Road, Araku Valley, ASR District, Andhra Pradesh 531149',
  region: 'Araku Valley, Eastern Ghats, India',
  phonePrimary: '+919014115175',
  phoneDisplay: '+91 90141 15175',
  whatsappNumber: '919014115175',
  email: 'matsyaraju909@gmail.com',
  checkIn: '01:00 PM',
  checkOut: '11:00 AM',
  googleMapsUrl: 'https://maps.google.com/?q=Araku+Valley+Andhra+Pradesh',
};

export const RESORT_HIGHLIGHTS = [
  { label: 'Elevation', value: '3,200 ft', sub: 'Cool Mountain Air' },
  { label: 'Guest Rating', value: '4.9 / 5', sub: 'Based on 850+ reviews' },
  { label: 'Eco Footprint', value: '100% Solar', sub: 'Zero Single-Use Plastic' },
  { label: 'Estate Size', value: '18 Acres', sub: 'Arabica Coffee & Teak' },
];

export const ROOMS_DATA: Room[] = [
  {
    id: 'valley-view-villa',
    title: 'Valley View Premium Villa',
    category: 'villa',
    tagline: 'Panoramic 180° misty gorge vistas with private sunrise sundeck',
    description:
      'Perched on an elevated ridge overlooking coffee terraces. Features floor-to-ceiling glass, teak furniture, a private cedar plunge tub, and tribal handloom textiles.',
    pricePerNight: 6499,
    originalPricePerNight: 7999,
    image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80',
    specs: {
      sqft: 650,
      bedType: '1 King Bed',
      view: 'Araku Gorge & Valley',
      maxGuests: 3,
      bathrooms: 1,
    },
    amenities: ['Private Sundeck', 'Cedar Plunge Tub', 'Araku Coffee Bar', 'High-Speed Wi-Fi', 'Complimentary Breakfast'],
    badge: 'Most Popular',
    featured: true,
  },
  {
    id: 'coffee-plantation-cottage',
    title: 'Coffee Plantation Wooden Cottage',
    category: 'cottage',
    tagline: 'Tucked inside aromatic Arabica coffee groves and silver oak canopies',
    description:
      'Immerse in rustic hill charm. Built with reclaimed timber and local stone, wake up to wild birdsong and the earthy aroma of wet coffee blossoms.',
    pricePerNight: 4899,
    originalPricePerNight: 5999,
    image: 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?auto=format&fit=crop&w=1200&q=80',
    specs: {
      sqft: 480,
      bedType: '1 Queen Bed',
      view: 'Coffee Plantation',
      maxGuests: 2,
      bathrooms: 1,
    },
    amenities: ['Plantation Veranda', 'Campfire Access', 'Fresh French Press', 'Forest Footpath', 'Organic Toiletries'],
    badge: 'Eco Choice',
    featured: true,
  },
  {
    id: 'araku-cloud-suite',
    title: 'Araku Cloud Suite',
    category: 'suite',
    tagline: 'Float amidst passing hill clouds with private terrace fireplace',
    description:
      'Our flagship luxury suite for honeymooners and peace-seekers. Highlights include an open-sky rain shower, private stone fireplace, and panoramic daybed.',
    pricePerNight: 7999,
    originalPricePerNight: 9500,
    image: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1200&q=80',
    specs: {
      sqft: 820,
      bedType: '1 Super King Bed',
      view: '360° Mist & Cloud Line',
      maxGuests: 2,
      bathrooms: 2,
    },
    amenities: ['Private Fireplace', 'Open Rain Shower', 'Dedicated Butler', 'Evening High Tea', 'Mini Bar'],
    badge: 'Signature Luxury',
    featured: true,
  },
  {
    id: 'misty-hills-chalet',
    title: 'Misty Hills Family Chalet',
    category: 'chalet',
    tagline: 'Two-tier forest retreat with private barbecue lawn for families',
    description:
      'Designed for family reunions and travel groups. Offers two private master bedrooms, a central living salon with board games, and an outdoor barbecue lawn.',
    pricePerNight: 9999,
    originalPricePerNight: 12499,
    image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80',
    specs: {
      sqft: 1150,
      bedType: '2 King Beds + 1 Daybed',
      view: 'Forest Canopy & Hills',
      maxGuests: 6,
      bathrooms: 2,
    },
    amenities: ['2 Master Bedrooms', 'Private BBQ Lawn', 'Living Lounge', 'Board Games & Books', 'Kids Friendly'],
    badge: 'Family Favorite',
    featured: false,
  },
];

export const AMENITIES_DATA: Amenity[] = [
  {
    id: 'pool',
    title: 'Hilltop Infinity Pool',
    description: 'Natural spring-fed pool overlooking the rolling Araku mist, temperature maintained for misty mornings.',
    icon: 'Waves',
    badge: 'Spring Fed',
  },
  {
    id: 'dining',
    title: 'Bamboo Grove Dining',
    description: 'Farm-to-table culinary feast featuring traditional Araku bamboo chicken, organic millets, and global classics.',
    icon: 'UtensilsCrossed',
    badge: 'Organic Farm',
  },
  {
    id: 'campfire',
    title: 'Tribal Lawn & Campfire',
    description: 'Nightly campfire under clear starlit skies with live acoustic guitar and weekly Dhimsa tribal folk performances.',
    icon: 'Flame',
    badge: 'Nightly',
  },
  {
    id: 'power',
    title: '24/7 Silent Power Backup',
    description: 'Dedicated eco-grade generator and solar battery bank guaranteeing uninterrupted hot water, heating, and Wi-Fi.',
    icon: 'Zap',
    badge: 'Zero Downtime',
  },
  {
    id: 'coffee',
    title: 'Organic Coffee Experience',
    description: 'Daily morning plantation walk with expert estate roasters. Brew your own freshly roasted cup of Araku Arabica.',
    icon: 'Coffee',
    badge: 'Complimentary',
  },
  {
    id: 'spa',
    title: 'Prana Ayurvedic Spa',
    description: 'Herbal therapies and deep-tissue relaxation using indigenous Eastern Ghats forest herbs and natural oils.',
    icon: 'Sparkles',
    badge: 'Wellness',
  },
];

export const ATTRACTIONS_DATA: Attraction[] = [
  {
    id: 'ranajilleda',
    name: 'Ranajilleda Waterfalls',
    distance: '3.2 km',
    travelTime: '8 mins drive',
    description: 'Tucked behind coffee plantations, a gentle 60ft cascading waterfall surrounded by serene green flora.',
    tag: 'Nature Walk',
    highlight: 'Best visited at early morning sunrise',
  },
  {
    id: 'padmapuram',
    name: 'Padmapuram Botanical Gardens',
    distance: '4.5 km',
    travelTime: '12 mins drive',
    description: 'Historic WWII botanical nursery featuring unique tree-top hanging cottages, rare orchids, and toy train rides.',
    tag: 'Heritage & Flora',
    highlight: 'Ideal for photography & rare rose species',
  },
  {
    id: 'borra-caves',
    name: 'Borra Million-Year Caves',
    distance: '28 km',
    travelTime: '45 mins scenic drive',
    description: 'Deep limestone caves discovered in 1807, filled with breathtaking stalactite & stalagmite formations.',
    tag: 'Must Visit',
    highlight: 'Illuminated with colorful lighting setups',
  },
  {
    id: 'chaparai',
    name: 'Chaparai Water Cascades',
    distance: '14 km',
    travelTime: '22 mins drive',
    description: 'A wide sloping rock surface with pristine mountain stream flowing through, popular for picnics and dipping.',
    tag: 'Water Cascades',
    highlight: 'Natural rock sliding & local tribal delicacies',
  },
];

export const TESTIMONIALS_DATA: Testimonial[] = [
  {
    id: 'rev-1',
    guestName: 'Dr. Srinivas Rao & Family',
    city: 'Hyderabad',
    rating: 5,
    stayDate: 'August 2026',
    roomBooked: 'Valley View Premium Villa',
    comment: 'Waking up to the Araku fog rolling right past our balcony while sipping fresh plantation coffee was magical. The bamboo chicken dinner is unbeatable!',
  },
  {
    id: 'rev-2',
    guestName: 'Ananya & Rohan Sharma',
    city: 'Bengaluru',
    rating: 5,
    stayDate: 'July 2026',
    roomBooked: 'Araku Cloud Suite',
    comment: 'Pure eco-luxury! The staff arranged a private bonfire and the night sky was clear with millions of stars. Best retreat in South India.',
  },
  {
    id: 'rev-3',
    guestName: 'Vikramaditya Verma',
    city: 'Visakhapatnam',
    rating: 5,
    stayDate: 'September 2026',
    roomBooked: 'Coffee Plantation Cottage',
    comment: 'The 24/7 power backup and fast Wi-Fi allowed me to work peacefully amidst raw nature. Will definitely return for another staycation.',
  },
];
