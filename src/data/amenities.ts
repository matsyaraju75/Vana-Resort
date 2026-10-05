/**
 * @file amenities.ts
 * @description Comprehensive verified resort amenities architecture.
 * Exactly mapped to user-specified categories, notes, and guest ratings.
 */

export interface AmenityDetail {
  id: string;
  name: string;
  tag?: string;
  icon: string;
  description?: string;
}

export interface AmenityCategory {
  id: string;
  title: string;
  subtitle?: string;
  icon: string;
  items: AmenityDetail[];
}

export const GUEST_AMENITIES_FEEDBACK = {
  rating: 2.5,
  scale: 5,
  summary:
    'Guests appreciated the cleanliness of the rooms and the beautiful views. However, frequent complaints mentioned the lack of WiFi in rooms, poor maintenance of pools, and insufficient basic amenities. Many noted the challenges in getting needed items like towels and toiletries, impacting overall satisfaction.',
  positives: ['Room Cleanliness', 'Beautiful Scenic Views'],
  critiques: ['WiFi in Rooms', 'Pool Maintenance', 'Basic Toiletries Availability'],
};

export const RESORT_AMENITIES_DATA: AmenityCategory[] = [
  {
    id: 'couples',
    title: 'Amenities for Couples',
    subtitle: 'Special leisure facilities recommended for pairs and couples traveling together',
    icon: 'Heart',
    items: [
      {
        id: 'couple-pool',
        name: 'Swimming Pool',
        tag: 'Leisure & Relaxation',
        icon: 'Waves',
        description: 'Outdoor swimming pool surrounded by mountain nature.',
      },
      {
        id: 'couple-restaurant',
        name: 'Restaurant',
        tag: 'Dine-In & Dining',
        icon: 'UtensilsCrossed',
        description: 'Multi-cuisine restaurant serving freshly prepared breakfast, lunch, and dinner.',
      },
    ],
  },
  {
    id: 'basic-facilities',
    title: 'Basic Facilities',
    subtitle: 'Essential property infrastructure and foundational conveniences',
    icon: 'Building2',
    items: [
      { id: 'bf-pool', name: 'Swimming Pool', icon: 'Waves', description: 'Property outdoor swimming pool.' },
      { id: 'bf-smoking-rooms', name: 'Smoking Rooms', icon: 'Cigarette', description: 'Designated smoking-friendly rooms and zones.' },
      { id: 'bf-power-backup', name: 'Power Backup', icon: 'Zap', description: 'Standby generator power backup for uninterrupted valley stays.' },
      { id: 'bf-elevator', name: 'Elevator/Lift', icon: 'ArrowUpDown', description: 'Lift access across guest floor levels.' },
      { id: 'bf-housekeeping', name: 'Housekeeping', icon: 'Sparkles', description: 'Daily room cleaning and linen servicing.' },
      { id: 'bf-umbrellas', name: 'Umbrellas', icon: 'Umbrella', description: 'Rain gear available on request for Araku seasonal showers.' },
      { id: 'bf-room-service', name: 'Room Service', tag: 'Limited duration', icon: 'BellRing', description: 'Food and refreshment delivery to guest rooms during service hours.' },
      { id: 'bf-ac', name: 'Air Conditioning', tag: 'Room controlled', icon: 'Wind', description: 'In-room climate control available in specified rooms.' },
      { id: 'bf-smoke-detector', name: 'Smoke Detector', tag: 'Lobby', icon: 'Flame', description: 'Fire and smoke safety detection equipped in lobby.' },
      { id: 'bf-newspaper', name: 'Newspaper', tag: 'English, Local Language', icon: 'Newspaper', description: 'Daily national and vernacular regional newspapers available.' },
      { id: 'bf-free-parking', name: 'Free Parking', tag: 'Free - Onsite', icon: 'Car', description: 'Complimentary secure on-site self-parking.' },
      { id: 'bf-wifi', name: 'Wi-Fi', tag: 'Property-wide', icon: 'Wifi', description: 'Wireless internet connectivity available on property.' },
      { id: 'bf-laundry', name: 'Laundry Service', icon: 'Shirt', description: 'Washing and pressing support on request.' },
    ],
  },
  {
    id: 'general-services',
    title: 'General Services',
    subtitle: 'Dedicated hospitality staff and accessibility assistance',
    icon: 'Users',
    items: [
      { id: 'gs-butler', name: 'Butler Services', icon: 'UserCheck', description: 'Personalized assistance for specialty requests.' },
      { id: 'gs-multilingual', name: 'Multilingual Staff', icon: 'Languages', description: 'Helpful local staff conversant in Telugu, Hindi, and English.' },
      { id: 'gs-luggage', name: 'Luggage Assistance', icon: 'Briefcase', description: 'Porter help with check-in and check-out bags.' },
      { id: 'gs-disabilities', name: 'Facilities for Guests with Disabilities', icon: 'Accessibility', description: 'Step-free access and assistance for differently abled guests.' },
      { id: 'gs-towels', name: 'Pool/ Beach Towels', icon: 'Bath', description: 'Fresh towels provided for pool use.' },
    ],
  },
  {
    id: 'health-wellness',
    title: 'Health and Wellness',
    subtitle: 'First-aid and emergency medical preparedness',
    icon: 'HeartPulse',
    items: [
      { id: 'hw-firstaid', name: 'First-aid Services', icon: 'HeartPulse', description: 'Essential medical kit and emergency first-aid on site.' },
    ],
  },
  {
    id: 'room-amenities',
    title: 'Room Amenities',
    subtitle: 'In-room furnishings, appliances, and personal care accessories',
    icon: 'BedDouble',
    items: [
      { id: 'ra-heater', name: 'Heater', tag: 'Available in some rooms', icon: 'Flame', description: 'Winter room heater provided in selected suites.' },
      { id: 'ra-water', name: 'Mineral Water', tag: 'Additional charge', icon: 'Droplets', description: 'Packaged mineral water bottles available.' },
      { id: 'ra-sofa', name: 'Sofa', tag: 'Available in some rooms', icon: 'Armchair', description: 'Comfortable living lounge sofa in suites.' },
      { id: 'ra-ac', name: 'Air Conditioning', tag: 'Available in some rooms', icon: 'Wind', description: 'Split air-conditioner in AC Deluxe & Suites.' },
      { id: 'ra-dental', name: 'Dental Kit', tag: 'Available in some rooms', icon: 'Sparkles', description: 'Toothbrush and paste kit provided on request.' },
      { id: 'ra-iron', name: 'Iron/Ironing Board', tag: 'Available in some rooms', icon: 'Shirt', description: 'Garment iron provided in select suites.' },
      { id: 'ra-geyser', name: 'Geyser/Water Heater', tag: 'Available in some rooms', icon: 'ThermometerSun', description: 'Hot water geyser installed in attached bathrooms.' },
      { id: 'ra-toiletries', name: 'Toiletries', tag: 'Available in some rooms', icon: 'Bath', description: 'Soap, shampoo, and bath essentials provided.' },
      { id: 'ra-workdesk', name: 'Work Desk', icon: 'Laptop', description: 'Dedicated writing table and seating chair.' },
      { id: 'ra-balcony', name: 'Balcony', tag: 'Available in some rooms', icon: 'Eye', description: 'Private outdoor balcony overlooking surrounding Araku hills.' },
    ],
  },
  {
    id: 'food-drinks',
    title: 'Food and Drinks',
    subtitle: 'Culinary experiences and refreshment options',
    icon: 'UtensilsCrossed',
    items: [
      { id: 'fd-restaurant', name: 'Restaurant', icon: 'UtensilsCrossed', description: 'Full service dining hall with regional cuisine.' },
    ],
  },
  {
    id: 'safety-security',
    title: 'Safety and Security',
    subtitle: '24/7 premises monitoring and fire protection',
    icon: 'ShieldCheck',
    items: [
      { id: 'ss-cctv', name: 'CCTV', icon: 'Camera', description: 'Security cameras monitoring public zones and entry gates.' },
      { id: 'ss-fire', name: 'Fire Extinguishers', icon: 'ShieldAlert', description: 'Maintained fire safety equipment placed across key hallways.' },
    ],
  },
  {
    id: 'media-tech',
    title: 'Media and Technology',
    subtitle: 'In-room audio-visual entertainment',
    icon: 'Tv',
    items: [
      { id: 'mt-tv', name: 'TV', tag: 'LED', icon: 'Tv', description: 'LED television installed with regional cable channels.' },
    ],
  },
  {
    id: 'common-area',
    title: 'Common Area',
    subtitle: 'Shared gathering places and welcoming lobby',
    icon: 'Coffee',
    items: [
      { id: 'ca-lounge', name: 'Lounge', tag: 'Private', icon: 'Coffee', description: 'Quiet lounge seating area for relaxing between sightseeing.' },
      { id: 'ca-reception', name: 'Reception', icon: 'ConciergeBell', description: 'Welcoming front desk assisting with check-ins and travel inquiries.' },
    ],
  },
  {
    id: 'other-facilities',
    title: 'Other Facilities',
    subtitle: 'Additional property facilities for guest convenience',
    icon: 'Package',
    items: [
      { id: 'of-cloak', name: 'Cloak Room', icon: 'Archive', description: 'Secure luggage storage and cloakroom for transit guests.' },
    ],
  },
];

// Backward-compatible export mapping to support HomePage preview
export const AMENITIES_CATEGORIES = RESORT_AMENITIES_DATA.map((category) => ({
  id: category.id,
  title: category.title,
  subtitle: category.subtitle || '',
  items: category.items.map((item) => ({
    id: item.id,
    title: item.name,
    description: item.description || item.name,
    iconName: item.icon,
    scope: 'global' as const,
    availabilityNote: item.tag,
  })),
}));
