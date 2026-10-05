/**
 * @file gallery.ts
 * @description 50 comprehensive property and destination photos for Vana Resort Araku.
 */

export type GalleryCategory =
  | 'all'
  | 'screenshots'
  | 'resort'
  | 'rooms'
  | 'suites'
  | 'pool'
  | 'restaurant'
  | 'nature'
  | 'surroundings';

export interface GalleryImage {
  id: string;
  title: string;
  category: GalleryCategory;
  src: string;
  alt: string;
  caption?: string;
}

export const GALLERY_CATEGORIES: { id: GalleryCategory; label: string }[] = [
  { id: 'all', label: 'All Photos (50)' },
  { id: 'screenshots', label: 'Property Snaps (24)' },
  { id: 'resort', label: 'Resort & Grounds' },
  { id: 'rooms', label: 'Rooms & Bathrooms' },
  { id: 'suites', label: 'Suites & Lounges' },
  { id: 'pool', label: 'Swimming Pool' },
  { id: 'nature', label: 'Araku Mist & Hills' },
  { id: 'surroundings', label: 'Nearby Attractions' },
];

export const GALLERY_ITEMS: GalleryImage[] = [
  {
    "id": "g-shot-1",
    "title": "Executive Suite Living Lounge",
    "category": "suites",
    "src": "./images/gallery/suite-living-room.png",
    "alt": "Spacious living room suite with comfortable leather sofa, wall-mounted TV, mood ceiling illumination, and glass balcony access",
    "caption": "Executive Suite Living Lounge"
  },
  {
    "id": "g-shot-2",
    "title": "Deluxe Bedroom and Nightstand",
    "category": "rooms",
    "src": "./images/gallery/deluxe-bedroom-bed.png",
    "alt": "Neatly made queen bed with cushioned headboard, wall artwork, and bedside telephone",
    "caption": "Deluxe Bedroom and Nightstand"
  },
  {
    "id": "g-shot-3",
    "title": "AC Deluxe Bedroom Interior",
    "category": "rooms",
    "src": "./images/gallery/ac-deluxe-room-interior.png",
    "alt": "AC Deluxe bedroom featuring wall-mounted air conditioner, ceiling fan, and glossy marble flooring",
    "caption": "AC Deluxe Bedroom Interior"
  },
  {
    "id": "g-shot-4",
    "title": "Misty Sunrise over Resort and Valley",
    "category": "nature",
    "src": "./images/gallery/misty-morning-valley-view.png",
    "alt": "Magical early morning fog and sunrise glow rolling over Vana Resort lawns and Araku Valley hills",
    "caption": "Misty Sunrise over Resort and Valley"
  },
  {
    "id": "g-shot-5",
    "title": "Childrens Playground and Gazebos",
    "category": "resort",
    "src": "./images/gallery/kids-playground-mountain-view.png",
    "alt": "Outdoor play equipment, swings, slides, thatched roof gazebos, and green mountain range",
    "caption": "Childrens Playground and Gazebos"
  },
  {
    "id": "g-shot-6",
    "title": "Angel Fountain in Misty Night",
    "category": "resort",
    "src": "./images/gallery/angel-statue-mist-night.png",
    "alt": "Evening mist swirling around the illuminated angel statue fountain in front of Vana Resort",
    "caption": "Angel Fountain in Misty Night"
  },
  {
    "id": "g-shot-7",
    "title": "Garden Photo-Booth and Mountain Steps",
    "category": "resort",
    "src": "./images/gallery/garden-photo-booth-view.png",
    "alt": "Circular stone photo-booth seat and manicured lawns framed against the Eastern Ghats",
    "caption": "Garden Photo-Booth and Mountain Steps"
  },
  {
    "id": "g-shot-8",
    "title": "Resort Lawns and Mountain Panorama",
    "category": "resort",
    "src": "./images/gallery/resort-gardens-mountain-panorama.png",
    "alt": "Expansive view of landscaped green grounds, blooming flowerbeds, and majestic mountains",
    "caption": "Resort Lawns and Mountain Panorama"
  },
  {
    "id": "g-shot-9",
    "title": "Resort Facade and Thatched Gazebo",
    "category": "resort",
    "src": "./images/gallery/resort-facade-lawns-view.png",
    "alt": "Modern hotel architecture, paved walkways, and quiet thatched gazebos",
    "caption": "Resort Facade and Thatched Gazebo"
  },
  {
    "id": "g-shot-10",
    "title": "Glass Balcony Mountain View Lounge",
    "category": "rooms",
    "src": "./images/gallery/glass-balcony-sitting-area.png",
    "alt": "Enclosed sunlit glass balcony with coffee table and chairs overlooking the rolling hills",
    "caption": "Glass Balcony Mountain View Lounge"
  },
  {
    "id": "g-shot-11",
    "title": "Hillside Swimming Pool and Gazebos",
    "category": "pool",
    "src": "./images/gallery/swimming-pool-hill-view.png",
    "alt": "Curved outdoor pool overlooking Araku hill vistas with gazebo shelters",
    "caption": "Hillside Swimming Pool and Gazebos"
  },
  {
    "id": "g-shot-12",
    "title": "Grand Resort Frontage and Angel Fountain",
    "category": "resort",
    "src": "./images/gallery/resort-facade-central-fountain.png",
    "alt": "Wide front angle of Vana Resort main entrance, circular blue windows, and tiered angel fountain",
    "caption": "Grand Resort Frontage and Angel Fountain"
  },
  {
    "id": "g-shot-13",
    "title": "Resort Campus Under Blue Skies",
    "category": "resort",
    "src": "./images/gallery/resort-exterior-blue-sky.png",
    "alt": "Clear blue sky over Vana Resort facade, visitor driveway, and lush shrubbery",
    "caption": "Resort Campus Under Blue Skies"
  },
  {
    "id": "g-shot-14",
    "title": "Western Bathroom Sanitary Fittings",
    "category": "rooms",
    "src": "./images/gallery/room-sanitary-fittings.png",
    "alt": "Clean, sanitized modern western commode with tiled bathroom walls",
    "caption": "Western Bathroom Sanitary Fittings"
  },
  {
    "id": "g-shot-15",
    "title": "Resort Lobby and Ganesha Centerpiece",
    "category": "resort",
    "src": "./images/gallery/lobby-reception-ganesha.png",
    "alt": "Welcoming resort lobby decorated with indoor potted palms and Lord Ganesha sculpture",
    "caption": "Resort Lobby and Ganesha Centerpiece"
  },
  {
    "id": "g-shot-16",
    "title": "Evening Lobby with Illuminated Columns",
    "category": "resort",
    "src": "./images/gallery/evening-lobby-shrine.png",
    "alt": "Ambient evening lighting, decorative lattice columns, and traditional floral urli",
    "caption": "Evening Lobby with Illuminated Columns"
  },
  {
    "id": "g-shot-17",
    "title": "Polished Curved Guest Corridor",
    "category": "resort",
    "src": "./images/gallery/ground-floor-corridor.png",
    "alt": "Pristine ground-floor hallway with recessed ceiling lighting leading to guest rooms",
    "caption": "Polished Curved Guest Corridor"
  },
  {
    "id": "g-shot-18",
    "title": "Pergola Garden Trellis Walkway",
    "category": "resort",
    "src": "./images/gallery/garden-pergola-walkway.png",
    "alt": "Arched garden trellis covered in dense green climbing vines over floral patterned path",
    "caption": "Pergola Garden Trellis Walkway"
  },
  {
    "id": "g-shot-19",
    "title": "Night Swimming Pool Session",
    "category": "pool",
    "src": "./images/gallery/night-swimming-pool.png",
    "alt": "Guests swimming under the stars in the night-lit pool surrounded by cypress trees",
    "caption": "Night Swimming Pool Session"
  },
  {
    "id": "g-shot-20",
    "title": "Aerial Campus and Valley Panorama",
    "category": "resort",
    "src": "./images/gallery/aerial-campus-panorama.png",
    "alt": "Sweeping panoramic vantage capturing the entire resort campus, pool, gazebos, and misty mountains",
    "caption": "Aerial Campus and Valley Panorama"
  },
  {
    "id": "g-shot-21",
    "title": "Designer Floral-Tiled Bathroom",
    "category": "rooms",
    "src": "./images/gallery/designer-tiled-bathroom.png",
    "alt": "Contemporary en-suite bathroom with elegant floral motif tiles and wall-hung toilet",
    "caption": "Designer Floral-Tiled Bathroom"
  },
  {
    "id": "g-shot-22",
    "title": "Front Reception and Concierge Desk",
    "category": "resort",
    "src": "./images/gallery/resort-reception-counter.png",
    "alt": "Front desk check-in counter with warm textured walls, artistic decor, and indoor plants",
    "caption": "Front Reception and Concierge Desk"
  },
  {
    "id": "g-shot-23",
    "title": "Grand Banquet and Celebration Hall",
    "category": "resort",
    "src": "./images/gallery/grand-banquet-event-hall.png",
    "alt": "Spacious event hall with drapery canopy, elevated floral stage, and theater seating",
    "caption": "Grand Banquet and Celebration Hall"
  },
  {
    "id": "g-shot-24",
    "title": "Upper Floor Guest Corridor Rooms 301-310",
    "category": "resort",
    "src": "./images/gallery/upper-floor-guest-corridor.png",
    "alt": "Naturally lit curved guest hallway on the 3rd floor with scenic outdoor window portals",
    "caption": "Upper Floor Guest Corridor Rooms 301-310"
  },
  {
    "id": "g-resort-1",
    "title": "Resort Lawns and Architecture",
    "category": "resort",
    "src": "./images/resort/resort.jpeg",
    "alt": "Exterior facade and landscaped lawns of Vana Resort nestled in Araku Valley",
    "caption": "Landscaped grounds and resort facade"
  },
  {
    "id": "g-resort-2",
    "title": "Resort Grand Entrance",
    "category": "resort",
    "src": "./images/resort/entrance.jpeg",
    "alt": "Main entry gate welcoming guests to Vana Resort Araku",
    "caption": "Welcome gate to Vana Resort"
  },
  {
    "id": "g-suite-1",
    "title": "Executive Suite Room",
    "category": "suites",
    "src": "./images/rooms/executive-suite.png",
    "alt": "Spacious 600 sq.ft Executive Suite with climate control and premium furnishings",
    "caption": "Executive Suite master bedroom"
  },
  {
    "id": "g-suite-2",
    "title": "Junior Suite Room",
    "category": "suites",
    "src": "./images/rooms/junior-suite.png",
    "alt": "Junior Suite with in-suite heater and Araku hill comfort",
    "caption": "Cozy Junior Suite accommodation"
  },
  {
    "id": "g-room-1",
    "title": "AC Deluxe Room",
    "category": "rooms",
    "src": "./images/rooms/ac-deluxe.png",
    "alt": "Comfortable AC Deluxe bedroom with workstation and sitting area",
    "caption": "AC Deluxe room workstation and seating"
  },
  {
    "id": "g-room-2",
    "title": "Standard Non AC Room",
    "category": "rooms",
    "src": "./images/rooms/standard-non-ac-room.png",
    "alt": "Cozy and clean Standard Non AC Room with natural mountain airflow",
    "caption": "Standard Non AC comfortable queen bed"
  },
  {
    "id": "g-room-3",
    "title": "Standard Non AC Room View",
    "category": "rooms",
    "src": "./images/rooms/standard-non-ac.png",
    "alt": "Standard Non AC Room queen bed interior",
    "caption": "Standard room interior ambiance"
  },
  {
    "id": "g-room-4",
    "title": "Standard Non AC Bathroom",
    "category": "rooms",
    "src": "./images/rooms/standard-non-ac-bathroom.png",
    "alt": "Clean, sanitized private bathroom attached to Standard Non AC Room",
    "caption": "Private bathroom with hot water"
  },
  {
    "id": "g-pool-1",
    "title": "Hillside Swimming Pool",
    "category": "pool",
    "src": "./images/resort/swimming-pool.jpeg",
    "alt": "Clean outdoor swimming pool overlooking Araku hill vistas",
    "caption": "Sparkling outdoor pool with sun loungers"
  },
  {
    "id": "g-pool-2",
    "title": "Swimming Pool Deck and Loungers",
    "category": "pool",
    "src": "./images/resort/swimming-pool-1.jpeg",
    "alt": "Relaxation deck by the resort swimming pool",
    "caption": "Poolside sun deck and loungers"
  },
  {
    "id": "g-garden-1",
    "title": "Lush Resort Garden",
    "category": "resort",
    "src": "./images/resort/garden.jpeg",
    "alt": "Vibrant green gardens and flower beds within Vana Resort",
    "caption": "Botanical garden beds and green hedges"
  },
  {
    "id": "g-garden-2",
    "title": "Garden Walkway",
    "category": "resort",
    "src": "./images/resort/garden-walkway.jpeg",
    "alt": "Paved garden walkway winding through resort greenery",
    "caption": "Garden walking path around the property"
  },
  {
    "id": "g-nature-1",
    "title": "Araku Valley Mountain Ridges",
    "category": "nature",
    "src": "./images/nature/mountains.jpeg",
    "alt": "Misty Eastern Ghats mountains surrounding Araku Valley",
    "caption": "Eastern Ghats mountain ridges"
  },
  {
    "id": "g-nature-2",
    "title": "Serene Araku Scenery",
    "category": "nature",
    "src": "./images/nature/scenery.jpeg",
    "alt": "Scenic valley landscapes and rolling hills around the resort",
    "caption": "Scenic valley hills and plantation views"
  },
  {
    "id": "g-statue-1",
    "title": "Resort Garden Sculpture",
    "category": "resort",
    "src": "./images/resort/statue.jpeg",
    "alt": "Decorative sculpture and stone artwork in the resort grounds",
    "caption": "Artistic garden statue on resort lawns"
  },
  {
    "id": "g-attract-1",
    "title": "Madagada View Point",
    "category": "surroundings",
    "src": "./images/attractions/madagada-view-point.webp",
    "alt": "Sea of clouds and panoramic sunrise over Eastern Ghats at Madagada View Point",
    "caption": "Madagada sunrise sea of clouds"
  },
  {
    "id": "g-attract-2",
    "title": "Araku Coffee Museum",
    "category": "surroundings",
    "src": "./images/attractions/coffee-museum.jpg",
    "alt": "Araku organic coffee history and artisanal brew museum in Araku Valley",
    "caption": "Artisanal organic coffee tasting and museum"
  },
  {
    "id": "g-attract-3",
    "title": "Araku Tribal Museum",
    "category": "surroundings",
    "src": "./images/attractions/tribal-museum.jpg",
    "alt": "Mud and clay architecture preserving indigenous culture at Araku Tribal Museum",
    "caption": "Indigenous Eastern Ghats tribal culture and arts"
  },
  {
    "id": "g-attract-4",
    "title": "Chaparai Waterfalls",
    "category": "surroundings",
    "src": "./images/attractions/chaparai-waterfalls.jpg",
    "alt": "Scenic natural stream cascading over smooth sloping rocks at Chaparai Waterfalls",
    "caption": "Gentle natural rock water slides at Chaparai"
  },
  {
    "id": "g-attract-5",
    "title": "Araku Pinery",
    "category": "surroundings",
    "src": "./images/attractions/araku-pinery.jpg",
    "alt": "Dense canopy of towering pine trees at Araku Pinery",
    "caption": "Pine forest woodland walking trails"
  },
  {
    "id": "g-attract-6",
    "title": "Padmapuram Gardens",
    "category": "surroundings",
    "src": "./images/attractions/padmapuram-gardens.jpg",
    "alt": "Historic WWII botanical sanctuary and tree cottages at Padmapuram Gardens",
    "caption": "Botanical gardens and treetop hanging cottages"
  },
  {
    "id": "g-attract-7",
    "title": "Galikonda View Point",
    "category": "surroundings",
    "src": "./images/attractions/galikonda-view-point.jpg",
    "alt": "High altitude mountain ridge vista at Galikonda View Point",
    "caption": "Highest vantage point (3,800+ ft) in Visakhapatnam region"
  },
  {
    "id": "g-attract-8",
    "title": "Wooden Bridge",
    "category": "surroundings",
    "src": "./images/attractions/wooden-bridge.jpg",
    "alt": "Charming rustic timber footbridge traversing mountain streams",
    "caption": "Rustic timber bridge over mountain stream"
  },
  {
    "id": "g-attract-9",
    "title": "Sunkarimetta Church",
    "category": "surroundings",
    "src": "./images/attractions/sunkarimetta-church.jpg",
    "alt": "Century-old British colonial stone gothic chapel at Sunkarimetta",
    "caption": "Century-old British colonial stone chapel"
  },
  {
    "id": "g-attract-10",
    "title": "Katiki Waterfalls",
    "category": "surroundings",
    "src": "./images/attractions/katiki-waterfalls.jpg",
    "alt": "50-foot jungle cascade in the deep forests near Borra Caves",
    "caption": "50ft pristine jungle waterfall cascade"
  },
  {
    "id": "g-attract-11",
    "title": "Borra Caves",
    "category": "surroundings",
    "src": "./images/attractions/borra-caves.jpg",
    "alt": "Spectacular stalactite and stalagmite limestone caves at Borra Caves",
    "caption": "Million-year-old limestone karst formations"
  }
];
