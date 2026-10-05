/**
 * @file attractions.ts
 * @description Comprehensive catalog of 11 verified nearby attractions in Araku Valley
 * with distance, recommended time to visit, and entry fees.
 */

export interface AttractionItem {
  id: string;
  name: string;
  category: 'viewpoint' | 'waterfall' | 'culture' | 'nature' | 'heritage';
  categoryLabel: string;
  distance: string;
  timeToVisit: string;
  entryPrice: string;
  description: string;
  highlights: string[];
  travelTips: string;
  image: string;
  googleQuery: string;
}

export const ATTRACTIONS_LIST: AttractionItem[] = [
  {
    id: 'madagada-view-point',
    name: 'Madagada View Point',
    category: 'viewpoint',
    categoryLabel: 'Scenic Viewpoint',
    distance: 'Approx. 16 km from resort',
    timeToVisit: '6:00 AM – 5:30 PM (Best for sunrise; 1–2 hours)',
    entryPrice: 'Free Entry',
    description:
      'Perched high in the Eastern Ghats, Madagada is famed for its mystical early morning sea-of-clouds phenomenon and panoramic valley horizons.',
    highlights: ['Sunrise cloud sea', '360° Eastern Ghats panoramic vistas', 'Photography hotspot'],
    travelTips: 'Arrive before 6:30 AM during winter months (Nov–Feb) for the most breathtaking mist and cloud inversion views.',
    image: './images/attractions/madagada-view-point.webp',
    googleQuery: 'Madagada View Point Araku Valley Andhra Pradesh',
  },
  {
    id: 'coffee-museum',
    name: 'Coffee Museum',
    category: 'culture',
    categoryLabel: 'Culture & Cafe',
    distance: 'Approx. 3.5 km from resort',
    timeToVisit: '9:00 AM – 8:00 PM (45 mins – 1 hour)',
    entryPrice: '₹10 – ₹20 per person (Coffee tasting & museum)',
    description:
      'Celebrates the rich heritage of organic Araku Arabica coffee. Features historical exhibits on tribal coffee farming, roasting dioramas, and freshly brewed artisanal coffee treats.',
    highlights: ['Artisanal Araku coffee tasting', 'Tribal farming history exhibits', 'Fresh roasted coffee beans & chocolates shop'],
    travelTips: 'Do not miss sampling the signature coffee-flavored chocolates and freshly ground single-origin roast to take home.',
    image: './images/attractions/coffee-museum.jpg',
    googleQuery: 'Coffee Museum Araku Valley',
  },
  {
    id: 'tribal-museum',
    name: 'Tribal Museum',
    category: 'culture',
    categoryLabel: 'Heritage & Art',
    distance: 'Approx. 3.8 km from resort',
    timeToVisit: '9:00 AM – 7:00 PM (1 – 1.5 hours)',
    entryPrice: 'Adults ₹40 | Children ₹20',
    description:
      'A cultural treasure trove constructed using red mud and natural clay, showcasing indigenous lifestyle artifacts, traditional attire, hunting tools, and dioramas of 19 native tribes.',
    highlights: ['Clay architecture and tribal huts', 'Traditional metalwork & archery displays', 'Handmade tribal arts and crafts counter'],
    travelTips: 'Great for families and children to learn about Eastern Ghats indigenous culture; tribal handicraft souvenirs available at entrance.',
    image: './images/attractions/tribal-museum.jpg',
    googleQuery: 'Araku Tribal Museum Padmapuram',
  },
  {
    id: 'chaparai-waterfalls',
    name: 'Chaparai Waterfalls',
    category: 'waterfall',
    categoryLabel: 'Cascade & Stream',
    distance: 'Approx. 15 km from resort',
    timeToVisit: '8:00 AM – 6:00 PM (1.5 – 2 hours)',
    entryPrice: '₹10 – ₹20 per person',
    description:
      'Also known as Dumbriguda Waterfalls, this picturesque natural stream glides gently over smooth, expansive sloping granite rock formations surrounded by dense green forest.',
    highlights: ['Gentle natural rock water slides', 'Shallow wading pools', 'Popular Telugu cinema filming spot'],
    travelTips: 'Exercise caution while walking over wet granite slabs as rocks can be slippery. Enjoy fresh bamboo chicken prepared by local vendors nearby.',
    image: './images/attractions/chaparai-waterfalls.jpg',
    googleQuery: 'Chaparai Water Cascades Dumbriguda Araku',
  },
  {
    id: 'araku-pinery',
    name: 'Araku Pinery',
    category: 'nature',
    categoryLabel: 'Pine Forest & Woodland',
    distance: 'Approx. 4.2 km from resort',
    timeToVisit: 'Open All Day (Best: 8:00 AM – 5:30 PM; 1 hour)',
    entryPrice: 'Free Entry',
    description:
      'A dense forest of soaring pine trees casting soft geometric shadows on forest trails. Famed for its cool mountain scent, gentle breeze, and cinematic ambiance.',
    highlights: ['Towering pine tree canopies', 'Peaceful woodland nature walks', 'Ideal picnic and photoshoot destination'],
    travelTips: 'Visit in the early morning or late afternoon when sunlight filters through the pine needles creating magical photo opportunities.',
    image: './images/attractions/araku-pinery.jpg',
    googleQuery: 'Pine Forest Araku Pinery Araku Valley',
  },
  {
    id: 'padmapuram-gardens',
    name: 'Padmapuram Gardens',
    category: 'nature',
    categoryLabel: 'Botanical Gardens',
    distance: 'Approx. 2.5 km from resort',
    timeToVisit: '8:30 AM – 6:00 PM (1.5 – 2 hours)',
    entryPrice: 'Adults ₹40 | Children ₹20 | Toy Train ₹30',
    description:
      'Historic WWII botanical sanctuary built in 1942 to supply vegetables to allied soldiers. Today it features treetop hanging wooden huts, exotic botanical nurseries, and a charming toy train ride.',
    highlights: ['Iconic treetop wooden hanging cottages', 'Miniature toy train winding through flora', 'Orchidarium and exotic rose garden'],
    travelTips: 'Located just down the road from Vana Resort; ideal for an easy post-breakfast stroll or family outing.',
    image: './images/attractions/padmapuram-gardens.jpg',
    googleQuery: 'Padmapuram Botanical Garden Araku Valley',
  },
  {
    id: 'galikonda-view-point',
    name: 'Galikonda View Point',
    category: 'viewpoint',
    categoryLabel: 'High-Altitude Ridge',
    distance: 'Approx. 18 km from resort',
    timeToVisit: 'Open All Day (Best at sunrise & golden hour; 45 mins)',
    entryPrice: 'Free Entry',
    description:
      'The highest vantage point in the Visakhapatnam Eastern Ghats range at an elevation of 3,800+ ft. Provides an awe-inspiring birds-eye view of valley coffee estates and railway bridges.',
    highlights: ['Highest summit vantage in the region', 'Refreshing brisk mountain breeze', 'Roadside stalls serving hot Araku tea & roasted corn'],
    travelTips: 'Carry a light jacket as winds at this altitude can be brisk and cold even during sunny afternoons.',
    image: './images/attractions/galikonda-view-point.jpg',
    googleQuery: 'Galikonda View Point Araku Valley Andhra Pradesh',
  },
  {
    id: 'wooden-bridge',
    name: 'Wooden Bridge',
    category: 'nature',
    categoryLabel: 'River Crossing',
    distance: 'Approx. 3.0 km from resort',
    timeToVisit: '8:00 AM – 6:00 PM (30 – 45 mins)',
    entryPrice: '₹10 – ₹20 per person',
    description:
      'A rustic timber footbridge traversing shallow gushing mountain streams, framed by bamboo thickets and emerald paddy fields. An iconic local landmark for calm nature walks.',
    highlights: ['Rustic timber craftsmanship', 'Babbling freshwater streams below', 'Peaceful rural Araku landscape'],
    travelTips: 'Perfect for a tranquil morning walk directly accessible from Padmapuram access roads.',
    image: './images/attractions/wooden-bridge.jpg',
    googleQuery: 'Wooden Hanging Bridge Araku Valley',
  },
  {
    id: 'sunkarimetta-church',
    name: 'Sunkarimetta Church',
    category: 'heritage',
    categoryLabel: 'Colonial Heritage',
    distance: 'Approx. 14 km from resort',
    timeToVisit: '9:00 AM – 5:00 PM (30 – 45 mins)',
    entryPrice: 'Free Entry',
    description:
      'A century-old stone chapel built in the British colonial era around 1937 by foreign missionaries. Known for its gothic stone architecture, towering bell tower, and tranquil pine backdrop.',
    highlights: ['Historic colonial stone architecture', 'Tranquil meditative mountain setting', 'Gothic stained windows and vintage wooden benches'],
    travelTips: 'Located along the road to Galikonda; a serene and quiet heritage detour away from main tourist crowds.',
    image: './images/attractions/sunkarimetta-church.jpg',
    googleQuery: 'Sunkarimetta Church Araku Valley',
  },
  {
    id: 'katiki-waterfalls',
    name: 'Katiki Waterfalls',
    category: 'waterfall',
    categoryLabel: 'Jungle Cascade',
    distance: 'Approx. 38 km from resort',
    timeToVisit: '7:00 AM – 5:00 PM (2 – 3 hours including trek)',
    entryPrice: 'Free Entry (4x4 Jeep Safari ride ~₹250–₹350 per seat)',
    description:
      'Originating from the Gosthani River, this majestic 50ft natural waterfall plunges deep inside untouched forested hills near Borra Caves. Requires an exciting off-road jeep drive followed by a scenic short jungle trek.',
    highlights: ['Thrilling 4x4 rugged hill jeep safari', 'Crystal-clear freshwater pool at base', 'Natural lush jungle trekking trail'],
    travelTips: 'Wear sturdy non-slip footwear for the 20-minute trail from the jeep drop point. Combine this with your visit to Borra Caves.',
    image: './images/attractions/katiki-waterfalls.jpg',
    googleQuery: 'Katiki Waterfalls Borra Caves Araku',
  },
  {
    id: 'borra-caves',
    name: 'Borra Caves',
    category: 'heritage',
    categoryLabel: 'Natural Wonder',
    distance: 'Approx. 35 km from resort',
    timeToVisit: '10:00 AM – 5:00 PM (1.5 – 2 hours)',
    entryPrice: 'Adults ₹80 | Children ₹60 | Camera ₹100',
    description:
      'One of the largest and deepest million-year-old limestone karst cave systems in India, carved by the Gosthani River. Featuring spectacular stalactite and stalagmite formations illuminated with multicolored lights.',
    highlights: ['Magnificent stalactites and stalagmites', 'Multi-hued ambient rock illumination', 'Ancient Shivling formation revered by pilgrims'],
    travelTips: 'Wear comfortable walking shoes for descending and climbing cave steps. Guides are available at the counter to explain cave formations.',
    image: './images/attractions/borra-caves.jpg',
    googleQuery: 'Borra Caves Visakhapatnam Araku Valley',
  },
];
