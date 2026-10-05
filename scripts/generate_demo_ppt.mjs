import pptxgen from 'pptxgenjs';
import path from 'path';

async function buildPresentation() {
  const pptx = new pptxgen();
  pptx.layout = 'LAYOUT_16x9';
  pptx.author = 'Vana Resort Araku Development Team';
  pptx.company = 'Vana Resort Araku';
  pptx.title = 'Vana Resort Araku — Full-Stack Project Demo Presentation';
  pptx.subject = 'Project Demonstration & Technical Architecture Showcase';

  // Palette constants
  const C_DARK_GREEN = '1B4332';  // Deep Forest Green
  const C_EMERALD = '2D6A4F';     // Emerald Primary
  const C_LIGHT_GREEN = 'D8F3DC'; // Soft Mint
  const C_GOLD = 'D4A373';        // Warm Gold / Sand Accent
  const C_BG_LIGHT = 'FBF9F5';    // Warm Sand Light Background
  const C_WHITE = 'FFFFFF';
  const C_SLATE_900 = '0F172A';
  const C_SLATE_700 = '334155';
  const C_SLATE_500 = '64748B';
  const C_CARD_BORDER = 'E2E8F0';
  const C_ACCENT_AMBER = 'B45309';

  // Base path for public images
  const IMG_BASE = 'C:/Users/poitd/OneDrive/Desktop/Vana Resort/public';

  // Helper: Header on content slides
  function addSlideHeader(slide, category, title, subtitle) {
    slide.background = { color: C_BG_LIGHT };

    // Top subtle bar
    slide.addShape(pptx.shapes.RECTANGLE, {
      x: 0,
      y: 0,
      w: 13.33,
      h: 0.12,
      fill: { color: C_EMERALD },
      line: { color: C_EMERALD },
    });

    // Category Tag Badge
    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: 0.8,
      y: 0.42,
      w: 2.8,
      h: 0.32,
      rectRadius: 0.08,
      fill: { color: C_LIGHT_GREEN },
      line: { color: 'B7E4C7', width: 1 },
    });
    slide.addText(category.toUpperCase(), {
      x: 0.8,
      y: 0.42,
      w: 2.8,
      h: 0.32,
      fontSize: 9.5,
      bold: true,
      color: C_DARK_GREEN,
      align: 'center',
      valign: 'middle',
    });

    // Slide Title
    slide.addText(title, {
      x: 0.8,
      y: 0.82,
      w: 11.5,
      h: 0.52,
      fontSize: 21,
      bold: true,
      color: C_SLATE_900,
      fontFace: 'Georgia',
    });

    // Subtitle
    if (subtitle) {
      slide.addText(subtitle, {
        x: 0.8,
        y: 1.35,
        w: 11.5,
        h: 0.35,
        fontSize: 11.5,
        color: C_SLATE_500,
      });
    }

    // Bottom footer text
    slide.addText('Vana Resort Araku • Project Demonstration & Technical Showcase', {
      x: 0.8,
      y: 7.12,
      w: 8.0,
      h: 0.28,
      fontSize: 8.5,
      color: C_SLATE_500,
    });
  }

  // ==========================================
  // SLIDE 1: Title Slide (Dark Luxury Theme)
  // ==========================================
  {
    const slide = pptx.addSlide();
    slide.background = { color: C_DARK_GREEN };

    slide.addShape(pptx.shapes.RECTANGLE, {
      x: 0,
      y: 0,
      w: 13.33,
      h: 0.16,
      fill: { color: C_GOLD },
      line: { color: C_GOLD },
    });

    // Badge
    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: 0.8,
      y: 1.2,
      w: 4.4,
      h: 0.38,
      rectRadius: 0.1,
      fill: { color: '2D6A4F' },
      line: { color: C_GOLD, width: 1 },
    });
    slide.addText('PROJECT DEMONSTRATION & ARCHITECTURE', {
      x: 0.8,
      y: 1.2,
      w: 4.4,
      h: 0.38,
      fontSize: 10.5,
      bold: true,
      color: C_WHITE,
      align: 'center',
      valign: 'middle',
    });

    // Main Title
    slide.addText('VANA RESORT ARAKU', {
      x: 0.8,
      y: 1.8,
      w: 7.8,
      h: 1.0,
      fontSize: 42,
      bold: true,
      color: C_WHITE,
      fontFace: 'Georgia',
    });

    // Subtitle
    slide.addText('Full-Stack Eco-Luxury Resort Web Application & Digital Guest Experience Platform', {
      x: 0.8,
      y: 2.85,
      w: 7.6,
      h: 0.65,
      fontSize: 16,
      color: 'D8F3DC',
    });

    // Divider
    slide.addShape(pptx.shapes.LINE, {
      x: 0.8,
      y: 3.7,
      w: 7.6,
      h: 0,
      line: { color: C_GOLD, width: 2 },
    });

    // Entrance photo embedded right
    slide.addImage({
      path: `${IMG_BASE}/images/resort/entrance.jpeg`,
      x: 8.8,
      y: 1.2,
      w: 3.8,
      h: 2.7,
    });
    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: 8.8,
      y: 3.95,
      w: 3.8,
      h: 0.45,
      rectRadius: 0.08,
      fill: { color: '143628' },
      line: { color: '2D6A4F', width: 1 },
    });
    slide.addText('📍 Ranajilleda Waterfalls Road, Padmapuram', {
      x: 8.8,
      y: 3.95,
      w: 3.8,
      h: 0.45,
      fontSize: 9.5,
      bold: true,
      color: C_GOLD,
      align: 'center',
      valign: 'middle',
    });

    // 4 Key Highlight Cards across the bottom
    const highlights = [
      { label: 'FRONTEND STACK', val: 'React 19 + TypeScript + Vite' },
      { label: 'BACKEND & DATA', val: 'PHP 8.2+ REST API + MySQL 8' },
      { label: 'RESILIENCE', val: '100% Offline-First Fallback Engine' },
      { label: 'GUEST SUITE', val: '4 Verified Rooms • 11 Araku Spots' },
    ];

    highlights.forEach((h, idx) => {
      const cardX = 0.8 + idx * 2.95;
      slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
        x: cardX,
        y: 4.8,
        w: 2.8,
        h: 1.9,
        rectRadius: 0.12,
        fill: { color: '143628' },
        line: { color: '2D6A4F', width: 1 },
      });

      slide.addText(h.label, {
        x: cardX + 0.2,
        y: 5.05,
        w: 2.4,
        h: 0.28,
        fontSize: 9.5,
        bold: true,
        color: C_GOLD,
      });

      slide.addText(h.val, {
        x: cardX + 0.2,
        y: 5.45,
        w: 2.4,
        h: 1.0,
        fontSize: 13,
        bold: true,
        color: C_WHITE,
      });
    });
  }

  // ==========================================
  // SLIDE 2: Executive Summary & Project Vision
  // ==========================================
  {
    const slide = pptx.addSlide();
    addSlideHeader(slide, 'Project Vision', 'Executive Summary & Core Objectives', 'Connecting Araku Valley eco-tourism with a frictionless digital guest experience.');

    const pillars = [
      {
        title: 'The Challenge',
        tag: 'INDUSTRY NEED',
        tagColor: 'FEE2E2',
        tagTextColor: '991B1B',
        desc: 'Traditional hill resort websites suffer from outdated information, complex third-party booking commissions, lack of authentic room photos, and network downtime in remote hill terrain.',
        bullets: [
          'High OTA commissions (15–25%)',
          'Misleading photos & ambiguous room specs',
          'Lack of curated regional attraction guides',
          'No direct WhatsApp concierge interaction',
        ],
      },
      {
        title: 'The Solution',
        tag: 'OUR APPROACH',
        tagColor: C_LIGHT_GREEN,
        tagTextColor: C_DARK_GREEN,
        desc: 'A bespoke, eco-luxury web platform for Vana Resort Araku combining verified property details, room-only galleries, an offline-resilient booking engine, and direct WhatsApp concierge.',
        bullets: [
          '100% direct bookings with zero commissions',
          'Strictly verified room & bathroom photos',
          'Comprehensive guide for 11 Araku spots',
          'Offline-resilient architecture with fallback',
        ],
      },
      {
        title: 'Key Results',
        tag: 'DELIVERED IMPACT',
        tagColor: 'FEF3C7',
        tagTextColor: C_ACCENT_AMBER,
        desc: 'A seamless, full-featured web app that gives travelers instant clarity, easy booking inquiries, and empowers resort management with a full operational admin dashboard.',
        bullets: [
          '4 Verified Room & Suite categories',
          '11 Curated Araku attractions with entry fees',
          '50 High-resolution property photo snaps',
          '24/7 AI virtual concierge chatbot',
        ],
      },
    ];

    pillars.forEach((p, idx) => {
      const cardX = 0.8 + idx * 3.95;
      slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
        x: cardX,
        y: 1.9,
        w: 3.75,
        h: 4.9,
        rectRadius: 0.15,
        fill: { color: C_WHITE },
        line: { color: C_CARD_BORDER, width: 1.5 },
      });

      slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
        x: cardX + 0.3,
        y: 2.15,
        w: 1.8,
        h: 0.28,
        rectRadius: 0.08,
        fill: { color: p.tagColor },
        line: { color: p.tagColor },
      });
      slide.addText(p.tag, {
        x: cardX + 0.3,
        y: 2.15,
        w: 1.8,
        h: 0.28,
        fontSize: 9,
        bold: true,
        color: p.tagTextColor,
        align: 'center',
        valign: 'middle',
      });

      slide.addText(p.title, {
        x: cardX + 0.3,
        y: 2.55,
        w: 3.15,
        h: 0.45,
        fontSize: 18,
        bold: true,
        color: C_SLATE_900,
        fontFace: 'Georgia',
      });

      slide.addText(p.desc, {
        x: cardX + 0.3,
        y: 3.05,
        w: 3.15,
        h: 1.15,
        fontSize: 11,
        color: C_SLATE_700,
      });

      slide.addShape(pptx.shapes.LINE, {
        x: cardX + 0.3,
        y: 4.3,
        w: 3.15,
        h: 0,
        line: { color: C_CARD_BORDER, width: 1 },
      });

      slide.addText(p.bullets.map((b) => `• ${b}`).join('\n\n'), {
        x: cardX + 0.3,
        y: 4.45,
        w: 3.15,
        h: 2.1,
        fontSize: 11,
        color: C_SLATE_700,
      });
    });
  }

  // ==========================================
  // SLIDE 3: Technical Architecture & System Design
  // ==========================================
  {
    const slide = pptx.addSlide();
    addSlideHeader(slide, 'System Design', 'Technical Architecture & Engineering Stack', 'Engineered for extreme performance, offline fault-tolerance, and modern developer ergonomics.');

    const techLayers = [
      {
        layer: 'Frontend Client Layer',
        subtitle: 'SPA with Hot-Module Replacement',
        items: [
          { bold: 'React 19 & TypeScript:', detail: 'Component-driven, strictly typed UI components' },
          { bold: 'Vite 8 Bundler:', detail: 'Sub-second builds, lightning fast HMR dev server' },
          { bold: 'Tailwind CSS:', detail: 'Custom resort color tokens, glassmorphism, responsive grid' },
          { bold: 'Lucide React:', detail: 'Consistent lightweight SVG iconography across all pages' },
        ],
      },
      {
        layer: 'Resilience & Local-First Layer',
        subtitle: 'Zero-Downtime Fallback Architecture',
        items: [
          { bold: 'Transparent Fallback:', detail: 'Seamless localStorage fallback if PHP/MySQL is down' },
          { bold: 'Dynamic Price Engine:', detail: 'Calculates night totals & sample tariffs client-side' },
          { bold: 'Offline Inquiry Ref:', detail: 'Instant VR-XXXXXX booking code generation' },
          { bold: 'WhatsApp Deep-Link:', detail: 'Pre-formatted booking payload hand-off to concierge' },
        ],
      },
      {
        layer: 'Backend & Data Services Layer',
        subtitle: 'RESTful API & Database Integration',
        items: [
          { bold: 'PHP 8.2+ REST API:', detail: 'Modular endpoints for bookings, rooms, contacts, auth' },
          { bold: 'MySQL 8 Database:', detail: 'Normalized tables with relational constraints & indexes' },
          { bold: 'Session Authentication:', detail: 'Secure session cookies for admin role privileges' },
          { bold: 'Google Hotels Integration:', detail: 'XML feeds for Google Hotel Prices syndication' },
        ],
      },
    ];

    techLayers.forEach((layer, idx) => {
      const cardX = 0.8 + idx * 3.95;
      slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
        x: cardX,
        y: 1.9,
        w: 3.75,
        h: 4.9,
        rectRadius: 0.15,
        fill: { color: C_WHITE },
        line: { color: C_CARD_BORDER, width: 1.5 },
      });

      slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
        x: cardX + 0.25,
        y: 2.1,
        w: 3.25,
        h: 0.8,
        rectRadius: 0.1,
        fill: { color: C_DARK_GREEN },
        line: { color: C_DARK_GREEN },
      });

      slide.addText(layer.layer, {
        x: cardX + 0.3,
        y: 2.15,
        w: 3.15,
        h: 0.38,
        fontSize: 13,
        bold: true,
        color: C_WHITE,
      });

      slide.addText(layer.subtitle, {
        x: cardX + 0.3,
        y: 2.53,
        w: 3.15,
        h: 0.3,
        fontSize: 10,
        color: C_GOLD,
      });

      let currentY = 3.1;
      layer.items.forEach((item) => {
        slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
          x: cardX + 0.25,
          y: currentY,
          w: 3.25,
          h: 0.78,
          rectRadius: 0.08,
          fill: { color: C_BG_LIGHT },
          line: { color: C_CARD_BORDER, width: 1 },
        });

        slide.addText(
          [
            { text: item.bold + ' ', options: { bold: true, color: C_SLATE_900, fontSize: 10 } },
            { text: item.detail, options: { bold: false, color: C_SLATE_700, fontSize: 10 } },
          ],
          {
            x: cardX + 0.35,
            y: currentY + 0.06,
            w: 3.05,
            h: 0.66,
            valign: 'middle',
          }
        );

        currentY += 0.88;
      });
    });
  }

  // ==========================================
  // SLIDE 4: Accommodations & Authentic Room Galleries
  // ==========================================
  {
    const slide = pptx.addSlide();
    addSlideHeader(slide, 'Accommodations', 'The 4 Verified Room Categories', 'Strictly verified room interiors and bathroom photos in View Details — zero generic distractions.');

    const rooms = [
      {
        name: 'Standard Non AC',
        price: '₹1,500 – ₹2,199 / night',
        badge: 'NON AC COMFORT',
        badgeBg: C_LIGHT_GREEN,
        badgeText: C_DARK_GREEN,
        specs: '272 sq.ft • Queen Bed • Max 3',
        img: `${IMG_BASE}/images/rooms/standard-non-ac-room.png`,
        features: 'Natural valley breeze, mineral water, Wi-Fi, daily housekeeping, sanitized ensuite bathroom.',
      },
      {
        name: 'AC Deluxe Room',
        price: '₹2,500 – ₹3,299 / night',
        badge: 'CLIMATE CONTROL',
        badgeBg: 'E0F2FE',
        badgeText: '0369A1',
        specs: '370 sq.ft • Queen Bed • Max 3',
        img: `${IMG_BASE}/images/rooms/ac-deluxe.png`,
        features: 'Efficient AC, closet space, plush queen bed, high-speed Wi-Fi, private sitting chair, floral bathroom.',
      },
      {
        name: 'Junior Suite',
        price: '₹4,000 – ₹4,499 / night',
        badge: 'LUXURY SUITE',
        badgeBg: 'FEF3C7',
        badgeText: C_ACCENT_AMBER,
        specs: '462 sq.ft • King Bed • Max 3',
        img: `${IMG_BASE}/images/rooms/junior-suite.png`,
        features: 'In-suite room heater for chilly evenings, king bed, sofa lounge, iron & board, enclosed balcony.',
      },
      {
        name: 'Executive Suite',
        price: '₹6,000 – ₹5,799 / night',
        badge: 'PREMIER RETREAT',
        badgeBg: 'FCE7F3',
        badgeText: '9D174D',
        specs: '600 sq.ft • Master Bedroom + Lounge',
        img: `${IMG_BASE}/images/rooms/executive-suite.png`,
        features: 'Pinnacle of comfort, 600 sq.ft separate living room, leather sofa, in-room heating, private glass balcony.',
      },
    ];

    rooms.forEach((r, idx) => {
      const cardX = 0.8 + idx * 2.95;
      slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
        x: cardX,
        y: 1.85,
        w: 2.8,
        h: 4.95,
        rectRadius: 0.15,
        fill: { color: C_WHITE },
        line: { color: C_CARD_BORDER, width: 1.5 },
      });

      // Photo
      slide.addImage({
        path: r.img,
        x: cardX + 0.15,
        y: 1.98,
        w: 2.5,
        h: 1.45,
      });

      // Category badge
      slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
        x: cardX + 0.2,
        y: 3.52,
        w: 2.4,
        h: 0.24,
        rectRadius: 0.08,
        fill: { color: r.badgeBg },
        line: { color: r.badgeBg },
      });
      slide.addText(r.badge, {
        x: cardX + 0.2,
        y: 3.52,
        w: 2.4,
        h: 0.24,
        fontSize: 8,
        bold: true,
        color: r.badgeText,
        align: 'center',
        valign: 'middle',
      });

      slide.addText(r.name, {
        x: cardX + 0.2,
        y: 3.82,
        w: 2.4,
        h: 0.35,
        fontSize: 14,
        bold: true,
        color: C_SLATE_900,
        fontFace: 'Georgia',
      });

      slide.addText(r.price, {
        x: cardX + 0.2,
        y: 4.18,
        w: 2.4,
        h: 0.25,
        fontSize: 10.5,
        bold: true,
        color: C_DARK_GREEN,
      });

      slide.addText(r.specs, {
        x: cardX + 0.2,
        y: 4.45,
        w: 2.4,
        h: 0.35,
        fontSize: 9.5,
        bold: true,
        color: C_SLATE_500,
      });

      slide.addShape(pptx.shapes.LINE, {
        x: cardX + 0.2,
        y: 4.88,
        w: 2.4,
        h: 0,
        line: { color: C_CARD_BORDER, width: 1 },
      });

      slide.addText(r.features, {
        x: cardX + 0.2,
        y: 4.98,
        w: 2.4,
        h: 1.65,
        fontSize: 9.5,
        color: C_SLATE_700,
      });
    });
  }

  // ==========================================
  // SLIDE 5: 11 Curated Nearby Attractions
  // ==========================================
  {
    const slide = pptx.addSlide();
    addSlideHeader(slide, 'Explore Araku', '11 Curated Araku Valley Attractions', 'Comprehensive travel directory complete with distances, recommended hours, and entry pricing.');

    // Top 2 photos
    slide.addImage({
      path: `${IMG_BASE}/images/attractions/chaparai-waterfalls.jpg`,
      x: 0.8,
      y: 1.85,
      w: 3.2,
      h: 1.8,
    });
    slide.addText('💧 Chaparai Waterfalls (7 km)', {
      x: 0.8,
      y: 3.7,
      w: 3.2,
      h: 0.3,
      fontSize: 9.5,
      bold: true,
      color: C_DARK_GREEN,
      align: 'center',
    });

    slide.addImage({
      path: `${IMG_BASE}/images/attractions/borra-caves.jpg`,
      x: 0.8,
      y: 4.15,
      w: 3.2,
      h: 1.8,
    });
    slide.addText('🦇 Borra Caves (28 km)', {
      x: 0.8,
      y: 6.0,
      w: 3.2,
      h: 0.3,
      fontSize: 9.5,
      bold: true,
      color: C_DARK_GREEN,
      align: 'center',
    });

    // Table on the right
    const tableData = [
      [
        { text: 'Attraction Name', options: { bold: true, color: C_WHITE, fill: { color: C_DARK_GREEN } } },
        { text: 'Category', options: { bold: true, color: C_WHITE, fill: { color: C_DARK_GREEN } } },
        { text: 'Distance', options: { bold: true, color: C_WHITE, fill: { color: C_DARK_GREEN } } },
        { text: 'Visiting Time', options: { bold: true, color: C_WHITE, fill: { color: C_DARK_GREEN } } },
        { text: 'Entry Fee', options: { bold: true, color: C_WHITE, fill: { color: C_DARK_GREEN } } },
      ],
      [{ text: '1. Madagada View Point' }, { text: 'Scenic Viewpoint' }, { text: '16 km' }, { text: '6:00 AM – 5:30 PM' }, { text: 'Free Entry' }],
      [{ text: '2. Coffee Museum' }, { text: 'Culture & Museum' }, { text: '5 km' }, { text: '9:00 AM – 8:00 PM' }, { text: '₹20' }],
      [{ text: '3. Tribal Museum' }, { text: 'Heritage Museum' }, { text: '5 km' }, { text: '9:00 AM – 7:00 PM' }, { text: '₹40 Adults / ₹20 Kids' }],
      [{ text: '4. Chaparai Waterfalls' }, { text: 'Water Cascade' }, { text: '7 km' }, { text: '8:00 AM – 6:00 PM' }, { text: '₹20' }],
      [{ text: '5. Araku Pinery' }, { text: 'Nature & Forest' }, { text: '8 km' }, { text: '7:00 AM – 6:00 PM' }, { text: 'Free Entry' }],
      [{ text: '6. Padmapuram Gardens' }, { text: 'Botanical Garden' }, { text: '2 km' }, { text: '8:30 AM – 6:00 PM' }, { text: '₹40' }],
      [{ text: '7. Galikonda View Point' }, { text: 'High Altitude' }, { text: '18 km' }, { text: 'Open all day' }, { text: 'Free Entry' }],
      [{ text: '8. Wooden Bridge' }, { text: 'Scenic Spot' }, { text: '3 km' }, { text: 'Sunrise to Sunset' }, { text: 'Free Entry' }],
      [{ text: '9. Sunkarimetta Church' }, { text: 'Colonial Heritage' }, { text: '12 km' }, { text: '8:00 AM – 5:00 PM' }, { text: 'Free Entry' }],
      [{ text: '10. Katiki Waterfalls' }, { text: 'Jungle Waterfall' }, { text: '32 km' }, { text: '6:00 AM – 5:00 PM' }, { text: '₹20 (Jeep extra)' }],
      [{ text: '11. Borra Caves' }, { text: 'Geological Wonder' }, { text: '28 km' }, { text: '10:00 AM – 5:00 PM' }, { text: '₹65 Adults / ₹45 Kids' }],
    ];

    slide.addTable(tableData, {
      x: 4.3,
      y: 1.85,
      w: 8.23,
      h: 4.8,
      fontSize: 9,
      color: C_SLATE_900,
      fill: { color: C_WHITE },
      border: { color: C_CARD_BORDER, pt: 0.5 },
      rowH: [0.36, ...Array(11).fill(0.36)],
      colW: [2.2, 1.6, 1.0, 2.2, 1.23],
    });
  }

  // ==========================================
  // SLIDE 6: Booking Engine & Offline Resilience
  // ==========================================
  {
    const slide = pptx.addSlide();
    addSlideHeader(slide, 'Reservation Workflow', 'Booking Engine & Offline Resilience', 'Frictionless booking experience with dynamic tariff calculation and direct WhatsApp hand-off.');

    const steps = [
      {
        num: '01',
        title: 'Dates & Room Selection',
        desc: 'Guest selects check-in, check-out dates, guest party size, and one of the 4 room categories.',
        extra: 'Dynamic night counter & instant estimated total based on verified property room tariff.',
      },
      {
        num: '02',
        title: 'Input Validation',
        desc: 'Client-side verification ensures 10-digit phone number, valid dates (no past check-in), and party sizes.',
        extra: 'Zero page refreshes, instant feedback messages, and accessibility validation.',
      },
      {
        num: '03',
        title: 'Offline-First Resilience',
        desc: 'Attempts PHP backend API. If offline (e.g. standalone Vite dev server), it seamlessly falls back to localStorage.',
        extra: 'Generates verified tracking ref (e.g. VR-582914) with zero annoying server error banners!',
      },
      {
        num: '04',
        title: 'WhatsApp Concierge Hand-off',
        desc: 'Success card displays full stay summary and one-tap button to notify the front desk on WhatsApp.',
        extra: 'Pre-formatted message contains: ID, Room, Guest Name, Phone, Dates, Nights, and Tariff.',
      },
    ];

    steps.forEach((step, idx) => {
      const cardX = 0.8 + idx * 2.95;
      slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
        x: cardX,
        y: 1.9,
        w: 2.8,
        h: 4.9,
        rectRadius: 0.15,
        fill: { color: C_WHITE },
        line: { color: C_CARD_BORDER, width: 1.5 },
      });

      slide.addShape(pptx.shapes.OVAL, {
        x: cardX + 0.25,
        y: 2.15,
        w: 0.8,
        h: 0.8,
        fill: { color: C_LIGHT_GREEN },
        line: { color: 'B7E4C7', width: 1 },
      });
      slide.addText(step.num, {
        x: cardX + 0.25,
        y: 2.15,
        w: 0.8,
        h: 0.8,
        fontSize: 14,
        bold: true,
        color: C_DARK_GREEN,
        align: 'center',
        valign: 'middle',
      });

      slide.addText(step.title, {
        x: cardX + 0.25,
        y: 3.1,
        w: 2.3,
        h: 0.6,
        fontSize: 15,
        bold: true,
        color: C_SLATE_900,
        fontFace: 'Georgia',
      });

      slide.addText(step.desc, {
        x: cardX + 0.25,
        y: 3.8,
        w: 2.3,
        h: 1.2,
        fontSize: 11,
        color: C_SLATE_700,
      });

      slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
        x: cardX + 0.2,
        y: 5.15,
        w: 2.4,
        h: 1.4,
        rectRadius: 0.08,
        fill: { color: C_BG_LIGHT },
        line: { color: C_CARD_BORDER, width: 1 },
      });

      slide.addText(step.extra, {
        x: cardX + 0.3,
        y: 5.25,
        w: 2.2,
        h: 1.2,
        fontSize: 10,
        color: C_DARK_GREEN,
      });
    });
  }

  // ==========================================
  // SLIDE 7: Authentic Bathroom & Room Photo Policy
  // ==========================================
  {
    const slide = pptx.addSlide();
    addSlideHeader(slide, 'Media Integrity', 'Strictly Authentic Room & Bathroom Photos', 'Zero garden or resort facade distractions inside View Room Details — 100% transparency.');

    // Photo 1: Deluxe Bed
    slide.addImage({
      path: `${IMG_BASE}/images/gallery/deluxe-bedroom-bed.png`,
      x: 0.8,
      y: 1.9,
      w: 3.6,
      h: 2.3,
    });
    slide.addText('Authentic Deluxe Bedroom & Nightstand', {
      x: 0.8,
      y: 4.25,
      w: 3.6,
      h: 0.3,
      fontSize: 10,
      bold: true,
      color: C_DARK_GREEN,
      align: 'center',
    });

    // Photo 2: Designer Bathroom
    slide.addImage({
      path: `${IMG_BASE}/images/gallery/designer-tiled-bathroom.png`,
      x: 4.86,
      y: 1.9,
      w: 3.6,
      h: 2.3,
    });
    slide.addText('Designer Tiled Bathroom & Commode', {
      x: 4.86,
      y: 4.25,
      w: 3.6,
      h: 0.3,
      fontSize: 10,
      bold: true,
      color: C_DARK_GREEN,
      align: 'center',
    });

    // Right Card: Design Policy
    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: 8.93,
      y: 1.9,
      w: 3.6,
      h: 4.9,
      rectRadius: 0.15,
      fill: { color: C_WHITE },
      line: { color: C_CARD_BORDER, width: 1.5 },
    });

    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: 9.2,
      y: 2.15,
      w: 3.0,
      h: 0.3,
      rectRadius: 0.08,
      fill: { color: C_LIGHT_GREEN },
      line: { color: C_LIGHT_GREEN },
    });
    slide.addText('STRICT MEDIA POLICY', {
      x: 9.2,
      y: 2.15,
      w: 3.0,
      h: 0.3,
      fontSize: 9,
      bold: true,
      color: C_DARK_GREEN,
      align: 'center',
      valign: 'middle',
    });

    slide.addText('What Guests See:', {
      x: 9.2,
      y: 2.6,
      w: 3.0,
      h: 0.35,
      fontSize: 16,
      bold: true,
      color: C_SLATE_900,
      fontFace: 'Georgia',
    });

    const policyPoints = [
      'Genuine bedroom sleeping areas & bed setups',
      'Actual sanitized ensuite western bathrooms',
      'Modern sanitary fittings, showers, & geysers',
      'Private in-room glass balcony sitting corners',
      'Eliminated all generic garden and pool photos',
      'Prevents guest dissatisfaction upon arrival',
    ];

    slide.addText(policyPoints.map((p) => `✔  ${p}`).join('\n\n'), {
      x: 9.2,
      y: 3.05,
      w: 3.0,
      h: 3.5,
      fontSize: 10.5,
      color: C_SLATE_700,
    });

    // Bottom explanation bar
    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: 0.8,
      y: 4.75,
      w: 7.66,
      h: 2.05,
      rectRadius: 0.12,
      fill: { color: C_WHITE },
      line: { color: C_CARD_BORDER, width: 1.5 },
    });

    slide.addText('Key Guest Experience Impact', {
      x: 1.1,
      y: 4.95,
      w: 7.0,
      h: 0.35,
      fontSize: 14,
      bold: true,
      color: C_SLATE_900,
      fontFace: 'Georgia',
    });

    slide.addText(
      'By confining the "View Details" gallery strictly to verified bedroom furniture, bed angles, and real bathroom sanitary fittings, travelers get 100% confidence in the hygiene, privacy, and true layout of their room before requesting a reservation.',
      {
        x: 1.1,
        y: 5.35,
        w: 7.0,
        h: 1.25,
        fontSize: 11,
        color: C_SLATE_700,
        lineSpacing: 18,
      }
    );
  }

  // ==========================================
  // SLIDE 8: Admin Management Center (/admin)
  // ==========================================
  {
    const slide = pptx.addSlide();
    addSlideHeader(slide, 'Operations & Management', 'Admin Operations Center & KPIs', 'Comprehensive resort control room for reservations, inventory, messages, and analytics.');

    const adminCards = [
      {
        title: 'KPI Executive Stats',
        icon: '📊',
        desc: 'Real-time overview counting total bookings, pending inquiries, confirmed stays, unread messages, and estimated revenue totals.',
      },
      {
        title: 'Reservation Workflow',
        icon: '🛎️',
        desc: 'Review incoming customer requests, filter by pending/confirmed/cancelled, adjust final prices, and append internal admin notes.',
      },
      {
        title: 'Inventory & Rooms',
        icon: '🛏️',
        desc: 'Dynamic room pricing editor, amenity toggles, room specifications, and image gallery management for all 4 categories.',
      },
      {
        title: 'Attractions & Gallery',
        icon: '🗺️',
        desc: 'Create, update, or remove nearby Araku destinations. Upload new property photos and categorize under dedicated tabs.',
      },
      {
        title: 'Contact Desk',
        icon: '✉️',
        desc: 'Manage customer contact messages submitted via the website with status marking (unread, read, responded).',
      },
      {
        title: 'Security & Auth',
        icon: '🔒',
        desc: 'Protected role-based management login with session cookie support and browser-based emergency recovery keys.',
      },
    ];

    adminCards.forEach((c, idx) => {
      const col = idx % 3;
      const row = Math.floor(idx / 3);
      const cardX = 0.8 + col * 3.95;
      const cardY = 1.9 + row * 2.5;

      slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
        x: cardX,
        y: cardY,
        w: 3.75,
        h: 2.3,
        rectRadius: 0.12,
        fill: { color: C_WHITE },
        line: { color: C_CARD_BORDER, width: 1.5 },
      });

      slide.addText(`${c.icon}  ${c.title}`, {
        x: cardX + 0.25,
        y: cardY + 0.2,
        w: 3.25,
        h: 0.4,
        fontSize: 15,
        bold: true,
        color: C_SLATE_900,
        fontFace: 'Georgia',
      });

      slide.addText(c.desc, {
        x: cardX + 0.25,
        y: cardY + 0.65,
        w: 3.25,
        h: 1.45,
        fontSize: 10.5,
        color: C_SLATE_700,
      });
    });
  }

  // ==========================================
  // SLIDE 9: Google Hotels & Distribution Integration
  // ==========================================
  {
    const slide = pptx.addSlide();
    addSlideHeader(slide, 'OTA & Syndication', 'Google Hotel Prices & XML Syndication', 'Direct integration with Google Hotel Listings standards for global search discoverability.');

    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: 0.8,
      y: 1.9,
      w: 5.7,
      h: 4.9,
      rectRadius: 0.15,
      fill: { color: C_WHITE },
      line: { color: C_CARD_BORDER, width: 1.5 },
    });

    slide.addText('Google Hotel Center Feed Specs', {
      x: 1.1,
      y: 2.15,
      w: 5.1,
      h: 0.45,
      fontSize: 18,
      bold: true,
      color: C_SLATE_900,
      fontFace: 'Georgia',
    });

    const feedBullets = [
      'Generates valid Google Transaction XML with real-time rate queries',
      'Configured Hotel ID: vana_resort_araku',
      'Verified property address: Ranajilleda Waterfalls Road, Padmapuram',
      'Coordinates: Lat 18.3334, Long 82.8821 for exact Google Maps placement',
      'Live Room mapping for Standard Non AC, AC Deluxe, Junior Suite, Executive Suite',
    ];

    slide.addText(feedBullets.map((b) => `• ${b}`).join('\n\n'), {
      x: 1.1,
      y: 2.75,
      w: 5.1,
      h: 3.8,
      fontSize: 11,
      color: C_SLATE_700,
    });

    // Right Column: XML Sample code box
    slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
      x: 6.83,
      y: 1.9,
      w: 5.7,
      h: 4.9,
      rectRadius: 0.15,
      fill: { color: '0F172A' },
      line: { color: '1E293B', width: 1.5 },
    });

    slide.addText('Generated Google Hotel XML Schema', {
      x: 7.13,
      y: 2.15,
      w: 5.1,
      h: 0.35,
      fontSize: 13,
      bold: true,
      color: C_GOLD,
    });

    const xmlSample = `<?xml version="1.0" encoding="UTF-8"?>
<listings>
  <listing>
    <id>vana_resort_araku</id>
    <name>Vana Resort Araku Valley</name>
    <address format="simple">
      <component name="addr1">
        Ranajilleda Waterfalls Road, Padmapuram
      </component>
      <component name="city">Araku Valley</component>
      <component name="province">Andhra Pradesh</component>
      <component name="postal_code">531149</component>
      <component name="country">IN</component>
    </address>
    <latitude>18.3334</latitude>
    <longitude>82.8821</longitude>
  </listing>
</listings>`;

    slide.addText(xmlSample, {
      x: 7.13,
      y: 2.55,
      w: 5.1,
      h: 4.0,
      fontSize: 9.5,
      color: '38BDF8',
      fontFace: 'Consolas',
    });
  }

  // ==========================================
  // SLIDE 10: Step-by-Step Live Demo Script
  // ==========================================
  {
    const slide = pptx.addSlide();
    addSlideHeader(slide, 'Demo Guide', 'Step-by-Step Live Demonstration Script', 'Follow this 5-minute structured walkthrough to deliver a flawless project presentation.');

    const demoSteps = [
      {
        time: 'Min 0:00 – 1:00',
        title: '1. Landing Page & First Impression',
        action: 'Open http://localhost:5173/ -> Showcase the scenic hero banner, verified property rating (3.2★ across 261 reviews), quick date booking bar, and welcome introduction.',
      },
      {
        time: 'Min 1:00 – 2:00',
        title: '2. Accommodations & Authentic Photo Check',
        action: 'Click "Stay" -> "Rooms & Suites". Highlight the 4 categories. Click "View Details" on AC Deluxe Room to show strictly real bedroom interiors and designer tiled bathroom photos.',
      },
      {
        time: 'Min 2:00 – 3:00',
        title: '3. Explore Dropdown & 11 Araku Destinations',
        action: 'Hover on "Explore" -> Click "Nearby Attractions". Demonstrate the 11 curated spots (Madagada View Point, Chaparai Waterfalls, Borra Caves) with distance and entry price filters.',
      },
      {
        time: 'Min 3:00 – 4:00',
        title: '4. Booking Submission & WhatsApp Concierge',
        action: 'Click "Book Now", enter test guest name, mobile, and dates. Submit the request! Highlight instant VR-XXXXXX reference card and click the WhatsApp concierge notification button.',
      },
      {
        time: 'Min 4:00 – 5:00',
        title: '5. Admin Panel & Operational Oversight',
        action: 'Navigate to /admin, log in as admin. Demonstrate live KPI cards, view the newly submitted booking record in the table, and update status to "Confirmed" with admin notes.',
      },
    ];

    demoSteps.forEach((step, idx) => {
      const rowY = 1.85 + idx * 1.0;
      slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
        x: 0.8,
        y: rowY,
        w: 11.73,
        h: 0.88,
        rectRadius: 0.1,
        fill: { color: C_WHITE },
        line: { color: C_CARD_BORDER, width: 1.2 },
      });

      slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
        x: 1.0,
        y: rowY + 0.15,
        w: 1.8,
        h: 0.58,
        rectRadius: 0.08,
        fill: { color: C_LIGHT_GREEN },
        line: { color: C_LIGHT_GREEN },
      });
      slide.addText(step.time, {
        x: 1.0,
        y: rowY + 0.15,
        w: 1.8,
        h: 0.58,
        fontSize: 10,
        bold: true,
        color: C_DARK_GREEN,
        align: 'center',
        valign: 'middle',
      });

      slide.addText(step.title, {
        x: 3.0,
        y: rowY + 0.12,
        w: 9.3,
        h: 0.32,
        fontSize: 13,
        bold: true,
        color: C_SLATE_900,
        fontFace: 'Georgia',
      });

      slide.addText(step.action, {
        x: 3.0,
        y: rowY + 0.44,
        w: 9.3,
        h: 0.38,
        fontSize: 10,
        color: C_SLATE_700,
      });
    });
  }

  // ==========================================
  // SLIDE 11: Key Architectural Highlights
  // ==========================================
  {
    const slide = pptx.addSlide();
    addSlideHeader(slide, 'Engineering Highlights', 'Core Differentiators & Best Practices', 'What makes this project unique, robust, and production-ready.');

    const diffs = [
      {
        title: 'Zero Third-Party Dependency',
        desc: 'Direct bookings handled in-house with WhatsApp concierge hand-off, saving 15–25% in OTA commissions.',
      },
      {
        title: 'Offline-First Resilience',
        desc: 'Browser-level fallback guarantees reservation inquiries and admin review succeed even without active Apache/MySQL servers.',
      },
      {
        title: 'Strictly Authentic Media',
        desc: 'Room details showcase 100% verified room and bathroom photos — eliminating guest disappointment from generic photos.',
      },
      {
        title: 'Complete Local Destination Guide',
        desc: '11 verified Araku Valley destinations with exact distances, timings, entry prices, and visiting tips right inside the resort site.',
      },
      {
        title: 'Modern React 19 + TypeScript',
        desc: 'Full type safety, sub-second HMR dev turnaround, Tailwind design system, and clean reusable component hierarchy.',
      },
      {
        title: 'Enterprise Admin Capabilities',
        desc: 'Complete dashboard with KPI counters, booking status workflow, contact inquiry tracker, and resort settings.',
      },
    ];

    diffs.forEach((d, idx) => {
      const col = idx % 3;
      const row = Math.floor(idx / 3);
      const cardX = 0.8 + col * 3.95;
      const cardY = 1.9 + row * 2.5;

      slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
        x: cardX,
        y: cardY,
        w: 3.75,
        h: 2.3,
        rectRadius: 0.12,
        fill: { color: C_WHITE },
        line: { color: C_CARD_BORDER, width: 1.5 },
      });

      slide.addShape(pptx.shapes.OVAL, {
        x: cardX + 0.25,
        y: cardY + 0.2,
        w: 0.45,
        h: 0.45,
        fill: { color: C_LIGHT_GREEN },
        line: { color: C_EMERALD, width: 1 },
      });
      slide.addText('✓', {
        x: cardX + 0.25,
        y: cardY + 0.2,
        w: 0.45,
        h: 0.45,
        fontSize: 14,
        bold: true,
        color: C_DARK_GREEN,
        align: 'center',
        valign: 'middle',
      });

      slide.addText(d.title, {
        x: cardX + 0.8,
        y: cardY + 0.2,
        w: 2.75,
        h: 0.45,
        fontSize: 14,
        bold: true,
        color: C_SLATE_900,
        fontFace: 'Georgia',
      });

      slide.addText(d.desc, {
        x: cardX + 0.25,
        y: cardY + 0.75,
        w: 3.25,
        h: 1.35,
        fontSize: 11,
        color: C_SLATE_700,
      });
    });
  }

  // ==========================================
  // SLIDE 12: Conclusion & Q&A
  // ==========================================
  {
    const slide = pptx.addSlide();
    slide.background = { color: C_DARK_GREEN };

    slide.addShape(pptx.shapes.RECTANGLE, {
      x: 0,
      y: 0,
      w: 13.33,
      h: 0.18,
      fill: { color: C_GOLD },
      line: { color: C_GOLD },
    });

    slide.addText('THANK YOU', {
      x: 1.0,
      y: 1.4,
      w: 11.3,
      h: 0.8,
      fontSize: 42,
      bold: true,
      color: C_GOLD,
      fontFace: 'Georgia',
    });

    slide.addText('Ready for Live Demonstration & Questions', {
      x: 1.0,
      y: 2.25,
      w: 11.3,
      h: 0.6,
      fontSize: 22,
      color: C_WHITE,
    });

    slide.addShape(pptx.shapes.LINE, {
      x: 1.0,
      y: 3.1,
      w: 11.3,
      h: 0,
      line: { color: C_GOLD, width: 2 },
    });

    const contactCards = [
      { label: 'Property Address', val: 'VANA RESORT ARAKU\nRanajilleda Waterfalls Road, Padmapuram\nAraku Valley, Andhra Pradesh 531149' },
      { label: 'Front Desk Direct', val: 'Phone: +91 90141 15175\nWhatsApp: +91 90141 15175\nEmail: matsyaraju909@gmail.com' },
      { label: 'Project URL', val: 'Local Dev Server:\nhttp://localhost:5173/\nAdmin: http://localhost:5173/admin' },
    ];

    contactCards.forEach((c, idx) => {
      const cardX = 1.0 + idx * 3.85;
      slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
        x: cardX,
        y: 3.5,
        w: 3.6,
        h: 2.7,
        rectRadius: 0.15,
        fill: { color: '143628' },
        line: { color: '2D6A4F', width: 1 },
      });

      slide.addText(c.label.toUpperCase(), {
        x: cardX + 0.3,
        y: 3.75,
        w: 3.0,
        h: 0.3,
        fontSize: 11,
        bold: true,
        color: C_GOLD,
      });

      slide.addText(c.val, {
        x: cardX + 0.3,
        y: 4.25,
        w: 3.0,
        h: 1.7,
        fontSize: 12,
        color: C_WHITE,
        lineSpacing: 18,
      });
    });
  }

  // Save the presentation
  const outputPath = 'C:/Users/poitd/OneDrive/Desktop/Vana Resort/Vana_Resort_Project_Demo.pptx';
  await pptx.writeFile({ fileName: outputPath });
  console.log(`PowerPoint successfully written to: ${outputPath}`);
}

buildPresentation().catch(console.error);
