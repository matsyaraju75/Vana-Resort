import { Router, Request, Response } from 'express';

const router = Router();

const HOTEL_ID = 'vana_resort_araku';
const RESORT_NAME = 'Vana Resort Araku Valley';
const RESORT_ADDRESS = 'Ranajilleda Waterfalls Road, Padmapuram';
const RESORT_PHONE = '+919491234567';
const LATITUDE = 18.3334;
const LONGITUDE = 82.8821;

const ROOMS_DATA = [
  {
    id: 'room-standard-non-ac',
    slug: 'standard-non-ac',
    name: 'Standard Non AC',
    maxGuests: 3,
    samplePrice: 2299,
    tagline: 'Cozy and economical retreat surrounded by Araku mountain air',
    feature: 'Mineral Water & Wi-Fi',
  },
  {
    id: 'room-ac-deluxe',
    slug: 'ac-deluxe',
    name: 'AC Deluxe Room',
    maxGuests: 3,
    samplePrice: 3299,
    tagline: 'Air-conditioned luxury with valley garden views',
    feature: 'Air Conditioning & Balcony',
  },
  {
    id: 'room-executive-suite',
    slug: 'executive-suite',
    name: 'Executive Suite',
    maxGuests: 4,
    samplePrice: 5499,
    tagline: 'Spacious 600 sq.ft suite with private heater',
    feature: 'Room Heater & Living Area',
  },
  {
    id: 'room-junior-suite',
    slug: 'junior-suite',
    name: 'Junior Suite',
    maxGuests: 3,
    samplePrice: 4499,
    tagline: 'Refined retreat with living space & mountain vistas',
    feature: 'Room Heater & Sofa Seating',
  },
];

/**
 * 1. Google Hotel Center - Hotel List Feed
 * Spec: https://developers.google.com/hotels/hotel-prices/xml-reference/hotel-list-feed
 */
router.get('/hotel-list.xml', (req: Request, res: Response) => {
  const host = req.get('host') || 'localhost:5173';
  const protocol = req.protocol || 'http';
  const domain = `${protocol}://${host}`;

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<listings>
  <language>en</language>
  <listing>
    <id>${HOTEL_ID}</id>
    <name>${RESORT_NAME}</name>
    <address format="simple">
      <component name="addr1">${RESORT_ADDRESS}</component>
      <component name="city">Araku Valley</component>
      <component name="province">Andhra Pradesh</component>
      <component name="postal_code">531149</component>
      <component name="country">IN</component>
    </address>
    <country>IN</country>
    <latitude>${LATITUDE}</latitude>
    <longitude>${LONGITUDE}</longitude>
    <phone type="main">${RESORT_PHONE}</phone>
    <category>hotel</category>
    <website>${domain}</website>
  </listing>
</listings>`.trim();

  res.setHeader('Content-Type', 'application/xml');
  res.send(xml);
});

/**
 * 2. Google Hotel Prices - Transaction Message Feed (<Transaction> XML)
 * Spec: https://developers.google.com/hotels/hotel-prices/xml-reference/transaction-messages
 */
router.get('/price-feed.xml', (req: Request, res: Response) => {
  const host = req.get('host') || 'localhost:5173';
  const protocol = req.protocol || 'http';
  const domain = `${protocol}://${host}`;

  const nights = parseInt(req.query.nights as string, 10) || 1;
  const guests = parseInt(req.query.guests as string, 10) || 2;

  const defaultCheckIn = new Date();
  defaultCheckIn.setDate(defaultCheckIn.getDate() + 1);
  const checkIn = (req.query.checkIn as string) || defaultCheckIn.toISOString().split('T')[0];

  const checkOutDate = new Date(checkIn);
  checkOutDate.setDate(checkOutDate.getDate() + nights);
  const checkOut = checkOutDate.toISOString().split('T')[0];

  const now = new Date().toISOString();
  const txId = `tx-${Date.now()}`;

  const lowestRoom = ROOMS_DATA[0];
  const totalBase = (lowestRoom.samplePrice * nights).toFixed(2);
  const totalTax = (lowestRoom.samplePrice * nights * 0.12).toFixed(2);

  const roomBundles = ROOMS_DATA.map((room) => {
    const taxRate = room.samplePrice > 7500 ? 0.18 : 0.12;
    const roomBase = (room.samplePrice * nights).toFixed(2);
    const roomTax = (room.samplePrice * nights * taxRate).toFixed(2);
    const bookingUrl = `${domain}/booking?room=${room.slug}&amp;checkIn=${checkIn}&amp;checkOut=${checkOut}&amp;guests=${guests}`;

    return `    <RoomBundle>
      <RoomID>${room.id}</RoomID>
      <PackageID>standard-rate</PackageID>
      <RatePlanID>best-available-rate</RatePlanID>
      <Capacity>${room.maxGuests}</Capacity>
      <Occupancy>${Math.min(guests, room.maxGuests)}</Occupancy>
      <Custom1>${room.feature}</Custom1>
      <Custom2>${room.tagline}</Custom2>
      <Baserate currency="INR">${roomBase}</Baserate>
      <Tax currency="INR">${roomTax}</Tax>
      <OtherFees currency="INR">0.00</OtherFees>
      <URL>${bookingUrl}</URL>
    </RoomBundle>`;
  }).join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<Transaction timestamp="${now}" id="${txId}">
  <Result>
    <Property>${HOTEL_ID}</Property>
    <Checkin>${checkIn}</Checkin>
    <Nights>${nights}</Nights>
    <Baserate currency="INR">${totalBase}</Baserate>
    <Tax currency="INR">${totalTax}</Tax>
    <OtherFees currency="INR">0.00</OtherFees>
${roomBundles}
  </Result>
</Transaction>`.trim();

  res.setHeader('Content-Type', 'application/xml');
  res.send(xml);
});

/**
 * 3. Status and Metadata JSON
 */
router.get('/status', (req: Request, res: Response) => {
  const host = req.get('host') || 'localhost:5173';
  const protocol = req.protocol || 'http';
  const domain = `${protocol}://${host}`;

  res.json({
    service: 'Google Hotel Prices & Travel Partner Feed Service',
    hotelId: HOTEL_ID,
    hotelName: RESORT_NAME,
    apiReference: 'https://developers.google.com/hotels/hotel-prices/api-reference',
    travelPartnerApiBaseUrl: 'https://travelpartner.googleapis.com/v3',
    authScope: 'https://www.googleapis.com/auth/travelpartner',
    feeds: {
      hotelListFeedXml: `${domain}/api/google-hotels/hotel-list.xml`,
      priceFeedXml: `${domain}/api/google-hotels/price-feed.xml`,
    },
    roomsConfigured: ROOMS_DATA.length,
    currency: 'INR',
    taxScheme: 'Indian GST (12% standard, 18% luxury suites)',
    readyForIngestion: true,
  });
});

export default router;
