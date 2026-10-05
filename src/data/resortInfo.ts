/**
 * @file resortInfo.ts
 * @description Verified property information, address, check-in/out policies, and transit distances.
 */

export const RESORT_INFO = {
  name: 'Vana Resort Araku',
  subtitle: 'ARAKU VALLEY',
  category: '3-star hotel/resort',
  location: 'Araku Valley, Andhra Pradesh',
  address: 'VANA RESORT ARAKU, Ranajilleda Waterfalls Road, Padmapuram, Araku Valley, Andhra Pradesh, India',
  checkIn: '12:00 PM',
  checkOut: '10:00 AM',
  rating: {
    score: 3.2,
    scale: 5,
    count: 261,
    photosCount: 90,
    note: 'Reference rating from verified guest feedback',
  },
  contact: {
    phone: '+91 90141 15175',
    phoneDisplay: '+91 90141 15175',
    phoneLabel: '+91 90141 15175 (Front Desk)',
    email: 'matsyaraju909@gmail.com',
    whatsapp: '919014115175',
    officeHours: '8:00 AM – 10:00 PM IST',
    instagram: {
      handle: 'mobile._.moments_',
      displayHandle: '@mobile._.moments_',
      url: 'https://www.instagram.com/mobile._.moments_/',
    },
  },
  transit: [
    {
      name: 'Araku Railway Station',
      distance: 'Approx. 4.6 km',
      type: 'Train Station',
      description: 'Main rail gateway connecting Araku Valley with Visakhapatnam via the scenic Vistadome train line.',
    },
    {
      name: 'Karakavalasa Railway Station',
      distance: 'Approx. 21.6 km',
      type: 'Train Station',
      description: 'Secondary regional rail stop along the Kothavalasa–Kirandul line.',
    },
  ],
  attractions: [
    {
      name: 'Padmapuram Botanical Gardens',
      type: 'Horticulture & Nature',
      description: 'Historical WWII botanical nursery famous for treetop hanging cottages, rare exotic flora, and miniature toy train.',
    },
    {
      name: 'Chaparai Waterfalls',
      type: 'Scenic Water Cascades',
      description: 'Picturesque natural water stream cascading over smooth granite rocks, perfect for scenic strolls.',
    },
    {
      name: 'Ranajilleda Waterfalls',
      type: 'Valley Waterfall',
      description: 'Quiet seasonal cascade along the verdant access road near Padmapuram.',
    },
  ],
};
