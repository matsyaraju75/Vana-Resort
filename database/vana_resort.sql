-- ============================================================================
-- Vana Resort Araku - Database Schema and Seed Data
-- Database Name: vana_resort
-- Compatible with MySQL 5.7+ / 8.0+ / MariaDB 10.4+ (XAMPP default)
-- Character Set: utf8mb4 / Collation: utf8mb4_unicode_ci
-- ============================================================================

CREATE DATABASE IF NOT EXISTS `vana_resort` 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

USE `vana_resort`;

SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS `visitor_logs`;
DROP TABLE IF EXISTS `room_images`;
DROP TABLE IF EXISTS `bookings`;
DROP TABLE IF EXISTS `contacts`;
DROP TABLE IF EXISTS `gallery`;
DROP TABLE IF EXISTS `attractions`;
DROP TABLE IF EXISTS `rooms`;
DROP TABLE IF EXISTS `admins`;
DROP TABLE IF EXISTS `settings`;
SET FOREIGN_KEY_CHECKS = 1;

-- ============================================================================
-- 1. Table: admins
-- Roles: super_admin, manager, staff
-- Passwords hashed using PHP password_hash() (PASSWORD_DEFAULT / bcrypt)
-- ============================================================================
CREATE TABLE `admins` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL,
  `username` VARCHAR(50) NOT NULL UNIQUE,
  `email` VARCHAR(100) NOT NULL UNIQUE,
  `password_hash` VARCHAR(255) NOT NULL,
  `role` ENUM('super_admin', 'manager', 'staff') NOT NULL DEFAULT 'staff',
  `status` ENUM('active', 'inactive') NOT NULL DEFAULT 'active',
  `last_login` DATETIME NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_username` (`username`),
  INDEX `idx_email` (`email`),
  INDEX `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Default Admin Seed:
-- Username: admin
-- Email: admin@vanaresortaraku.com
-- Password: Admin@Vana2026!
INSERT INTO `admins` (`id`, `name`, `username`, `email`, `password_hash`, `role`, `status`)
VALUES (
  1,
  'Resort General Manager',
  'admin',
  'admin@vanaresortaraku.com',
  '$2y$10$wwT153S.baa41SxQqALk8eIW8KSxxSX0F1PtJNk7WPRHllLk3TYze',
  'super_admin',
  'active'
);

-- ============================================================================
-- 2. Table: rooms
-- The 4 verified accommodation categories of Vana Resort Araku
-- ============================================================================
CREATE TABLE `rooms` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `slug` VARCHAR(100) NOT NULL UNIQUE,
  `name` VARCHAR(150) NOT NULL,
  `category` VARCHAR(50) NOT NULL,
  `category_label` VARCHAR(100) NOT NULL,
  `tagline` VARCHAR(255) NULL,
  `description` TEXT NULL,
  `size_sqft` INT UNSIGNED NOT NULL DEFAULT 0,
  `size_sqm` INT UNSIGNED NOT NULL DEFAULT 0,
  `max_guests` TINYINT UNSIGNED NOT NULL DEFAULT 2,
  `bed_type` VARCHAR(100) NOT NULL DEFAULT '1 Queen Bed',
  `bathroom_count` TINYINT UNSIGNED NOT NULL DEFAULT 1,
  `price_per_night` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  `sample_price` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  `price_label` VARCHAR(100) NULL,
  `available_rooms` INT UNSIGNED NOT NULL DEFAULT 5,
  `status` ENUM('active', 'inactive', 'maintenance') NOT NULL DEFAULT 'active',
  `featured` BOOLEAN NOT NULL DEFAULT FALSE,
  `features` JSON NULL,
  `amenities` JSON NULL,
  `primary_image` VARCHAR(255) NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_slug` (`slug`),
  INDEX `idx_status` (`status`),
  INDEX `idx_category` (`category`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `rooms` (
  `id`, `slug`, `name`, `category`, `category_label`, `tagline`, `description`, 
  `size_sqft`, `size_sqm`, `max_guests`, `bed_type`, `bathroom_count`, 
  `price_per_night`, `sample_price`, `price_label`, `available_rooms`, `status`, `featured`, 
  `features`, `amenities`, `primary_image`
) VALUES
(
  1,
  'standard-non-ac',
  'Standard Non AC',
  'non-ac',
  'Non AC',
  'Cozy and economical retreat surrounded by Araku mountain air',
  'Designed for budget-conscious travelers seeking tranquility. Enjoy natural valley breezes, clean queen bedding, daily housekeeping, and convenient in-room dining services.',
  272,
  25,
  3,
  '1 Queen Bed',
  1,
  2299.00,
  2299.00,
  'Starting from ₹2,299',
  6,
  'active',
  FALSE,
  JSON_ARRAY('Mineral Water', 'Wi-Fi', 'Bathroom', 'Daily Housekeeping', 'In-room Dining', 'Room Service', 'Telephone', 'Charging Points', 'Closet', 'Chair', 'Work Desk', 'Blackout Curtains', 'Blanket', 'TV', 'Dental Kit', 'Geyser/Water Heater', 'Western Toilet Seat', 'Hot & Cold Water', 'Jetspray', 'Fan', 'Balcony'),
  JSON_ARRAY('Wi-Fi', 'Mineral Water', 'Daily Housekeeping', 'Geyser/Water Heater', 'Balcony', 'Room Service'),
  '/images/rooms/standard-non-ac-room.png'
),
(
  2,
  'ac-deluxe',
  'AC Deluxe Room',
  'ac',
  'AC Deluxe',
  'Air-conditioned luxury with valley garden views and premium comforts',
  'Relax in climate-controlled mountain comfort. Features a comfortable king bed, modern ensuite with hot geyser, private balcony overlooking the resort lawns, and LCD TV.',
  320,
  30,
  3,
  '1 King Bed',
  1,
  3299.00,
  3299.00,
  'Starting from ₹3,299',
  8,
  'active',
  TRUE,
  JSON_ARRAY('Air Conditioning', 'Free Wi-Fi', 'Private Balcony', 'Hot Geyser 24/7', 'Daily Housekeeping', 'Electric Kettle & Tea Setup', 'Flat Screen TV', 'Dental Kit', 'In-room Dining', 'Garden View', 'Work Station', 'Intercom'),
  JSON_ARRAY('Air Conditioning', 'Free Wi-Fi', 'Private Balcony', 'Geyser/Water Heater', 'Room Service', 'Television'),
  '/images/rooms/ac-deluxe.png'
),
(
  3,
  'junior-suite',
  'Junior Suite',
  'suites',
  'Suites',
  'Refined retreat with living space, mountain vistas, and in-room heater',
  'Our Junior Suite blends elevated mountain charm with generous interior space. Features a comfortable seating sofa lounge, winter room heater, and scenic valley windows.',
  450,
  42,
  3,
  '1 King Bed + Sofa Bed',
  1,
  4499.00,
  4499.00,
  'Starting from ₹4,499',
  4,
  'active',
  FALSE,
  JSON_ARRAY('Room Heater', 'Living Lounge Area', 'Scenic Mountain View', 'Air Conditioning', 'King Bed + Sofa', 'Daily Housekeeping', 'High-Speed Wi-Fi', 'Mini Fridge', 'Tea/Coffee Maker', 'Premium Bathroom Amenities', 'Express In-Room Dining'),
  JSON_ARRAY('Room Heater', 'Air Conditioning', 'High-Speed Wi-Fi', 'Living Area', 'Mini Fridge', 'Mountain View'),
  '/images/rooms/junior-suite.png'
),
(
  4,
  'executive-suite',
  'Executive Suite',
  'suites',
  'Suites',
  'Spacious 600 sq.ft suite with private heater, expansive lounge & premium luxury',
  'Our premier accommodation choice for families and discerning couples. 600 sq.ft of luxurious wooden accents, private living salon, master bedroom with balcony, heater, and attentive room service.',
  600,
  56,
  4,
  '1 King Bed + Double Sofa Bed',
  2,
  5499.00,
  5499.00,
  'Starting from ₹5,499',
  3,
  'active',
  TRUE,
  JSON_ARRAY('Room Heater', 'Expansive Living Room', '2 Bathrooms', 'Private Panoramic Balcony', 'Air Conditioning', 'King Bed + Double Sofa Bed', 'Smart TV', 'Tea & Coffee Bar', 'Bathrobes & Slippers', 'Priority Room Service', 'Valley & Pool View'),
  JSON_ARRAY('Room Heater', 'Air Conditioning', 'Living Room', '2 Bathrooms', 'Panoramic Balcony', 'Smart TV', 'Priority Service'),
  '/images/rooms/executive-suite.png'
);

-- ============================================================================
-- 3. Table: room_images
-- Photos associated with each room category
-- ============================================================================
CREATE TABLE `room_images` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `room_id` INT UNSIGNED NOT NULL,
  `image_path` VARCHAR(255) NOT NULL,
  `alt_text` VARCHAR(255) NULL,
  `sort_order` TINYINT UNSIGNED NOT NULL DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`room_id`) REFERENCES `rooms`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `room_images` (`room_id`, `image_path`, `alt_text`, `sort_order`) VALUES
(1, '/images/rooms/standard-non-ac-room.png', 'Standard Non AC Bedroom Layout', 1),
(1, '/images/rooms/standard-non-ac.png', 'Standard Non AC Room Perspective', 2),
(1, '/images/rooms/standard-non-ac-bathroom.png', 'Standard Non AC Ensuite Bathroom', 3),
(1, '/images/gallery/room-sanitary-fittings.png', 'Standard Non AC Bathroom Fittings', 4),
(2, '/images/rooms/ac-deluxe.png', 'AC Deluxe Room Bed & Interior', 1),
(2, '/images/gallery/ac-deluxe-room-interior.png', 'AC Deluxe Bedroom with Air Conditioning', 2),
(2, '/images/gallery/deluxe-bedroom-bed.png', 'Deluxe Bedroom Plush Bed & Headboard', 3),
(2, '/images/gallery/designer-tiled-bathroom.png', 'Contemporary Designer Tiled Bathroom', 4),
(2, '/images/gallery/room-sanitary-fittings.png', 'Ensuite Bathroom Fittings & Western Toilet', 5),
(2, '/images/gallery/glass-balcony-sitting-area.png', 'Room Glass Balcony Seating Area', 6),
(3, '/images/rooms/junior-suite.png', 'Junior Suite King Bed & Seating', 1),
(3, '/images/gallery/suite-living-room.png', 'Junior Suite Living Lounge Area', 2),
(3, '/images/gallery/designer-tiled-bathroom.png', 'Suite Designer Bathroom', 3),
(3, '/images/gallery/room-sanitary-fittings.png', 'Suite Bathroom Sanitary Fittings', 4),
(3, '/images/gallery/glass-balcony-sitting-area.png', 'Junior Suite Enclosed Balcony Lounge', 5),
(4, '/images/rooms/executive-suite.png', 'Executive Suite Master Bedroom', 1),
(4, '/images/gallery/suite-living-room.png', 'Executive Suite Luxury Living Lounge', 2),
(4, '/images/gallery/designer-tiled-bathroom.png', 'Executive Suite Floral-Tiled Bathroom', 3),
(4, '/images/gallery/room-sanitary-fittings.png', 'Modern Western Toilet & Wash Area', 4),
(4, '/images/gallery/glass-balcony-sitting-area.png', 'Executive Suite Glass Balcony Sitting Area', 5);

-- ============================================================================
-- 4. Table: bookings
-- Guest booking inquiries with server-calculated nights, unique references
-- Format: BK-YYYYMMDD-XXXX
-- ============================================================================
CREATE TABLE `bookings` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `booking_reference` VARCHAR(50) NOT NULL UNIQUE,
  `full_name` VARCHAR(150) NOT NULL,
  `email` VARCHAR(150) NOT NULL,
  `phone` VARCHAR(50) NOT NULL,
  `check_in` DATE NOT NULL,
  `check_out` DATE NOT NULL,
  `adults` TINYINT UNSIGNED NOT NULL DEFAULT 1,
  `children` TINYINT UNSIGNED NOT NULL DEFAULT 0,
  `rooms_count` TINYINT UNSIGNED NOT NULL DEFAULT 1,
  `room_id` INT UNSIGNED NULL,
  `room_slug` VARCHAR(100) NOT NULL,
  `room_name_snapshot` VARCHAR(150) NOT NULL,
  `additional_requests` TEXT NULL,
  `nights` SMALLINT UNSIGNED NOT NULL DEFAULT 1,
  `estimated_price` DECIMAL(10,2) NULL,
  `final_price` DECIMAL(10,2) NULL,
  `status` ENUM('pending', 'confirmed', 'cancelled', 'completed') NOT NULL DEFAULT 'pending',
  `admin_notes` TEXT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_booking_ref` (`booking_reference`),
  INDEX `idx_status` (`status`),
  INDEX `idx_dates` (`check_in`, `check_out`),
  INDEX `idx_phone` (`phone`),
  FOREIGN KEY (`room_id`) REFERENCES `rooms`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `bookings` (
  `id`, `booking_reference`, `full_name`, `email`, `phone`, 
  `check_in`, `check_out`, `adults`, `children`, `rooms_count`, 
  `room_id`, `room_slug`, `room_name_snapshot`, `additional_requests`, 
  `nights`, `estimated_price`, `final_price`, `status`, `admin_notes`, `created_at`
) VALUES
(
  1,
  'BK-20261012-0001',
  'Ananya Sharma',
  'ananya@example.com',
  '9845012345',
  '2026-10-12',
  '2026-10-15',
  2,
  1,
  1,
  3,
  'junior-suite',
  'Junior Suite',
  'Require ground floor room for elderly parent.',
  3,
  13497.00,
  13497.00,
  'confirmed',
  'Allocated Suite Ground Floor 102. Paid 50% advance.',
  '2026-09-18 10:30:00'
),
(
  2,
  'BK-20261020-0002',
  'Kiran Kumar Reddy',
  'kiran.reddy@example.com',
  '9988776655',
  '2026-10-20',
  '2026-10-22',
  3,
  0,
  1,
  2,
  'ac-deluxe',
  'AC Deluxe Room',
  'Early check-in around 11 AM if possible.',
  2,
  6598.00,
  NULL,
  'pending',
  'Called guest to verify Vistadome train arrival time.',
  '2026-09-20 14:15:00'
);

-- ============================================================================
-- 5. Table: contacts
-- Traveler inquiries submitted via the website Contact form
-- ============================================================================
CREATE TABLE `contacts` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `full_name` VARCHAR(150) NOT NULL,
  `email` VARCHAR(150) NOT NULL,
  `phone` VARCHAR(50) NOT NULL,
  `subject` VARCHAR(255) NOT NULL,
  `message` TEXT NOT NULL,
  `status` ENUM('unread', 'read', 'responded') NOT NULL DEFAULT 'unread',
  `admin_notes` TEXT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_status` (`status`),
  INDEX `idx_created` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `contacts` (`id`, `full_name`, `email`, `phone`, `subject`, `message`, `status`, `admin_notes`, `created_at`) VALUES
(
  1,
  'Rajesh Naidu',
  'rajesh.naidu@example.com',
  '9014115175',
  'Group Booking & Family Gathering',
  'We are planning a family reunion in Araku Valley for 12 members during November. Can we reserve the Executive Suite along with AC Deluxe rooms? Do you offer campfire setups?',
  'unread',
  NULL,
  '2026-09-21 09:15:00'
),
(
  2,
  'Pooja Hegde',
  'pooja.h@example.com',
  '9848022334',
  'Vistadome Train Pickup Inquiry',
  'We will be arriving at Araku Railway Station via the morning Vistadome train. Does the resort arrange pickup transport to Ranajilleda Waterfalls Road?',
  'read',
  'Informed guest that auto/taxi is available right at station entrance (~4.6 km).',
  '2026-09-20 16:40:00'
);

-- ============================================================================
-- 6. Table: attractions
-- The 11 verified nearby Araku Valley destinations with exact details
-- ============================================================================
CREATE TABLE `attractions` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(150) NOT NULL,
  `slug` VARCHAR(150) NOT NULL UNIQUE,
  `description` TEXT NOT NULL,
  `distance_from_resort` VARCHAR(100) NOT NULL,
  `approximate_travel_time` VARCHAR(150) NOT NULL,
  `entry_fee` VARCHAR(150) NOT NULL,
  `opening_time` VARCHAR(50) NULL,
  `closing_time` VARCHAR(50) NULL,
  `best_time_to_visit` VARCHAR(255) NULL,
  `category` VARCHAR(50) NOT NULL,
  `category_label` VARCHAR(100) NOT NULL,
  `image` VARCHAR(255) NOT NULL,
  `google_query` VARCHAR(255) NULL,
  `highlights` JSON NULL,
  `travel_tips` TEXT NULL,
  `latitude` DECIMAL(10,7) NULL,
  `longitude` DECIMAL(10,7) NULL,
  `status` ENUM('active', 'inactive') NOT NULL DEFAULT 'active',
  `sort_order` TINYINT UNSIGNED NOT NULL DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_slug` (`slug`),
  INDEX `idx_category` (`category`),
  INDEX `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `attractions` (
  `id`, `name`, `slug`, `description`, `distance_from_resort`, 
  `approximate_travel_time`, `entry_fee`, `opening_time`, `closing_time`, 
  `best_time_to_visit`, `category`, `category_label`, `image`, `google_query`, 
  `highlights`, `travel_tips`, `sort_order`
) VALUES
(
  1,
  'Madagada View Point',
  'madagada-view-point',
  'Perched high in the Eastern Ghats, Madagada is famed for its mystical early morning sea-of-clouds phenomenon and panoramic valley horizons.',
  'Approx. 16 km from resort',
  '6:00 AM – 5:30 PM (Best for sunrise; 1–2 hours)',
  'Free Entry',
  '06:00',
  '17:30',
  'Early mornings (before 6:30 AM Nov–Feb)',
  'viewpoint',
  'Scenic Viewpoint',
  '/images/nature/mountains.jpeg',
  'Madagada View Point Araku Valley Andhra Pradesh',
  JSON_ARRAY('Sunrise cloud sea', '360° Eastern Ghats panoramic vistas', 'Photography hotspot'),
  'Arrive before 6:30 AM during winter months (Nov–Feb) for the most breathtaking mist and cloud inversion views.',
  1
),
(
  2,
  'Coffee Museum',
  'coffee-museum',
  'Celebrates the rich heritage of organic Araku Arabica coffee. Features historical exhibits on tribal coffee farming, roasting dioramas, and freshly brewed artisanal coffee treats.',
  'Approx. 3.5 km from resort',
  '9:00 AM – 8:00 PM (45 mins – 1 hour)',
  '₹10 – ₹20 per person (Coffee tasting & museum)',
  '09:00',
  '20:00',
  'Anytime during daytime hours',
  'culture',
  'Culture & Cafe',
  'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=1000&q=80',
  'Coffee Museum Araku Valley',
  JSON_ARRAY('Artisanal Araku coffee tasting', 'Tribal farming history exhibits', 'Fresh roasted coffee beans & chocolates shop'),
  'Do not miss sampling the signature coffee-flavored chocolates and freshly ground single-origin roast to take home.',
  2
),
(
  3,
  'Tribal Museum',
  'tribal-museum',
  'A rich ethnographic window into the indigenous cultures, crafts, hunting traditions, musical instruments, and mud-built housing models of indigenous communities residing across Araku hills.',
  'Approx. 3.8 km from resort',
  '9:00 AM – 7:00 PM (1 – 1.5 hours)',
  'Adults ₹40 | Children ₹20',
  '09:00',
  '19:00',
  'Morning or late afternoon',
  'culture',
  'Heritage & Art',
  'https://images.unsplash.com/photo-1578925518470-4def7a0f08bb?auto=format&fit=crop&w=1000&q=80',
  'Araku Tribal Museum',
  JSON_ARRAY('Dhimsa tribal dance dioramas', 'Traditional handmade metal crafts & archery gear', 'Tribal artifact gift gallery'),
  'Check the amphitheater schedule; live Dhimsa cultural folk dance performances often occur on weekends and holiday evenings.',
  3
),
(
  4,
  'Padmapuram Gardens',
  'padmapuram-gardens',
  'Historic World War II botanical conservatory renowned for towering treetop hanging guest huts, exotic orchard flora, stone walkways, and a charming mini toy train.',
  'Approx. 4.2 km from resort',
  '8:30 AM – 6:00 PM (1.5 – 2 hours)',
  'Adults ₹40 | Toy Train ₹30',
  '08:30',
  '18:00',
  'Late morning or sunny afternoons',
  'nature',
  'Botanical Garden',
  '/images/resort/garden.jpeg',
  'Padmapuram Gardens Araku Valley',
  JSON_ARRAY('Iconic wooden treetop hanging huts', 'Kids miniature toy train circuit', 'Rare plant species & rose gardens'),
  'The treetop huts provide unique elevated photo opportunities. Kids will thoroughly enjoy the mini train ride circling the garden.',
  4
),
(
  5,
  'Chaparai Waterfalls',
  'chaparai-waterfalls',
  'Famous natural water cascades where serene forest streams glide over broad, smooth sloped granite rocks, creating gentle bathing pools and scenic picnic spots.',
  'Approx. 14.5 km from resort',
  '8:00 AM – 5:30 PM (2 – 3 hours)',
  '₹20 per person',
  '08:00',
  '17:30',
  'Post-monsoon (September to January)',
  'waterfall',
  'Water Cascades',
  '/images/nature/scenery.jpeg',
  'Chaparai Water Cascade Araku Valley',
  JSON_ARRAY('Natural smooth rock water slides', 'Famous Araku Bamboo Chicken food stalls', 'Pine forest backdrop'),
  'Rocks can become slippery during wet monsoons. Do try the freshly smoked organic Bamboo Chicken prepared by local stalls outside the cascade.',
  5
),
(
  6,
  'Ranajilleda Waterfalls',
  'ranajilleda-waterfalls',
  'Tucked along our very own resort approach road, this secluded forest cascade offers unspoiled mountain nature, pristine running streams, and tranquil isolation away from tourist crowds.',
  'Near resort (~1.2 km)',
  'Sunrise to Sunset (1 – 1.5 hours)',
  'Free Access',
  '06:00',
  '18:00',
  'Morning or sunset trek',
  'waterfall',
  'Quiet Waterfalls',
  '/images/nature/mountains.jpeg',
  'Ranajilleda Waterfalls Araku Valley',
  JSON_ARRAY('Peaceful unspoiled natural stream', 'Walking distance from resort', 'Offbeat uncrowded photo retreat'),
  'Wear comfortable walking shoes. It is very close to Vana Resort, making it an easy morning nature stroll before breakfast.',
  6
),
(
  7,
  'Borra Caves',
  'borra-caves',
  'Million-year-old limestone cavern complex plunging over 80 meters deep, featuring spectacular naturally formed stalactites, stalagmites, and artistic multi-colored lighting.',
  'Approx. 35.8 km from resort',
  '10:00 AM – 5:00 PM (Lunch break 1:00 PM – 2:00 PM; 2 hours)',
  'Adults ₹80 | Children ₹60 | Camera fees apply',
  '10:00',
  '17:00',
  'Morning slots before crowds arrive',
  'heritage',
  'Limestone Caverns',
  'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1000&q=80',
  'Borra Caves Visakhapatnam Andhra Pradesh',
  JSON_ARRAY('Million-year-old natural Shiva lingam stalagmite', 'Gosthani River subterranean gorges', 'Dynamic colorful LED cave lighting'),
  'Expect moderate stair climbing (around 300 steps). Hire an authorized local guide at the gate to appreciate the fascinating geological formations.',
  7
),
(
  8,
  'Katiki Waterfalls',
  'katiki-waterfalls',
  'A thrilling 50-foot natural waterfall fed by the Gosthani River deep in the dense forests near Borra Caves, reached via an adventurous rugged 4x4 Jeep trail and forest hike.',
  'Approx. 38.5 km from resort (via Borra Caves road)',
  '8:00 AM – 5:00 PM (3 – 4 hours including Jeep ride)',
  'Free entry | 4x4 Jeep ride ₹1,200 – ₹1,800 per vehicle',
  '08:00',
  '17:00',
  'September to February',
  'waterfall',
  'Adventure Falls',
  '/images/nature/scenery.jpeg',
  'Katiki Waterfalls Araku',
  JSON_ARRAY('Thrilling open 4x4 off-road Jeep ride', 'Hidden natural pool beneath falls', 'Fresh forest stream breeze'),
  'Private cars cannot travel the final 6 km rough terrain. Hire local certified Jeep drivers stationed near Gate 1 of Borra Caves.',
  8
),
(
  9,
  'Ananthagiri Hills & Coffee Estates',
  'ananthagiri-hills',
  'Lush highland pass filled with towering silver oak shade trees, sweeping coffee plantations, roadside wild honey stalls, and mist-covered mountain valleys.',
  'Approx. 26 km from resort',
  'Open daily (1 – 2 hours)',
  'Free Entry (Plantation walkthroughs available)',
  '07:00',
  '18:00',
  'Morning or late afternoon drives',
  'nature',
  'Highland Estates',
  '/images/nature/mountains.jpeg',
  'Ananthagiri Hills Coffee Plantations Araku',
  JSON_ARRAY('Shaded organic Arabica coffee groves', 'Roadside pure organic forest honey vendors', 'Scenic mountain ghat driving bends'),
  'Ideal stopover when traveling between Visakhapatnam and Araku. The hillside air here is exceptionally cool and fragrant with coffee blossoms.',
  9
),
(
  10,
  'Galikonda View Point',
  'galikonda-view-point',
  'The second-highest peak in the Eastern Ghats (~4,341 ft above sea level) offering a sweeping eagle-eye vantage point of distant green rolling ridges, railway tunnels, and valleys.',
  'Approx. 19.5 km from resort',
  'Open 24 Hours (Best during daylight; 30–45 mins)',
  'Free Entry',
  '06:00',
  '18:30',
  'Clear sunny mornings or sunsets',
  'viewpoint',
  'High Altitude Peak',
  '/images/nature/scenery.jpeg',
  'Galikonda View Point Araku',
  JSON_ARRAY('Highest mountain viewpoint along the Araku ghat road', 'Bird-eye panoramic perspective of rail tunnels', 'Chilly mountain winds year-round'),
  'The wind velocity here can be quite high and cold; keep a light jacket or windbreaker handy, especially for children and seniors.',
  10
),
(
  11,
  'Tatipudi Reservoir',
  'tatipudi-reservoir',
  'Serene freshwater reservoir lake framed by lush Eastern Ghats hill slopes, offering gentle boating excursions, peaceful water reflections, and a relaxing detour.',
  'Approx. 52 km from resort (ideal on drive from Vizag)',
  '9:00 AM – 5:30 PM (1 – 1.5 hours)',
  'Entry ₹10 | Speed & pedal boating available',
  '09:00',
  '17:30',
  'Late afternoon sunset boat ride',
  'nature',
  'Lake & Boating',
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=80',
  'Tatipudi Reservoir Andhra Pradesh',
  JSON_ARRAY('Scenic lake boat cruises', 'Surrounding green mountain hills', 'Quiet family relaxation park'),
  'Best enjoyed as an afternoon pit stop on your road journey from or back to Visakhapatnam city.',
  11
);

-- ============================================================================
-- 7. Table: gallery
-- Tagged resort imagery: resort grounds, rooms, suites, pool, restaurant, nature
-- ============================================================================
CREATE TABLE `gallery` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `title` VARCHAR(150) NOT NULL,
  `category` VARCHAR(50) NOT NULL,
  `image_path` VARCHAR(255) NOT NULL,
  `alt_text` VARCHAR(255) NULL,
  `caption` TEXT NULL,
  `sort_order` TINYINT UNSIGNED NOT NULL DEFAULT 0,
  `status` ENUM('active', 'inactive') NOT NULL DEFAULT 'active',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_category` (`category`),
  INDEX `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `gallery` (`title`, `category`, `image_path`, `alt_text`, `caption`, `sort_order`) VALUES
('Resort Lawns & Architecture', 'resort', '/images/resort/resort.jpeg', 'Exterior facade and landscaped lawns of Vana Resort nestled in Araku Valley', 'Main property lawns and architecture', 1),
('Main Entrance & Welcome Portico', 'resort', '/images/resort/entrance.jpeg', 'Welcoming entry driveway and check-in lobby building', 'Peaceful entrance along Ranajilleda Road', 2),
('Outdoor Swimming Pool', 'pool', '/images/resort/swimming-pool.jpeg', 'Swimming pool surrounded by green hill views', 'Clear pool for refreshing mountain dips', 3),
('Swimming Pool Terrace', 'pool', '/images/resort/swimming-pool1.jpeg', 'Sun terrace and lounging deck beside the pool', 'Poolside relaxation area', 4),
('Garden Walkway', 'resort', '/images/resort/garden-walkway.jpeg', 'Stone walkway winding through manicured resort flora', 'Evening walking trail inside resort', 5),
('Resort Flora & Greenery', 'resort', '/images/resort/garden.jpeg', 'Vibrant mountain gardens blooming in Araku Valley', 'Peaceful natural grounds', 6),
('Cultural Stone Sculpture', 'resort', '/images/resort/statue.jpeg', 'Artistic cultural stone statue situated in garden', 'Tribal art accents across the property', 7),
('Standard Non AC Room', 'rooms', '/images/rooms/standard-non-ac-room.png', 'Clean queen bed in Standard Non AC room with natural ventilation', 'Cozy economical mountain rest', 8),
('Standard Non AC Ensuite', 'rooms', '/images/rooms/standard-non-ac-bathroom.png', 'Modern ensuite bathroom with hot geyser and western amenities', 'Fresh and sanitized bathroom setup', 9),
('AC Deluxe Room Interior', 'rooms', '/images/rooms/ac-deluxe.png', 'Climate-controlled deluxe king bedroom with mountain views', 'Air-conditioned comfort with balcony', 10),
('Junior Suite Living Space', 'suites', '/images/rooms/junior-suite.png', 'Spacious Junior Suite with king bed, sofa lounge and heater', 'Refined mountain retreat', 11),
('Executive Suite Master Suite', 'suites', '/images/rooms/executive-suite.png', '600 sq.ft premier Executive Suite featuring private heater and lounge', 'Luxury suite for families & couples', 12),
('Eastern Ghats Mountain Horizons', 'nature', '/images/nature/mountains.jpeg', 'Distant rolling peaks and morning mist over Araku Valley', 'Surrounding valley views', 13),
('Araku Valley Countryside', 'surroundings', '/images/nature/scenery.jpeg', 'Scenic mountain roads, coffee shrubs and misty mornings', 'Minutes from Padmapuram & waterfalls', 14);

-- ============================================================================
-- 8. Table: visitor_logs
-- Lightweight privacy-conscious website analytics
-- ============================================================================
CREATE TABLE `visitor_logs` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `session_id` VARCHAR(64) NOT NULL,
  `page_path` VARCHAR(255) NOT NULL,
  `page_title` VARCHAR(255) NULL,
  `referrer` VARCHAR(255) NULL,
  `device_type` VARCHAR(50) NULL,
  `browser` VARCHAR(50) NULL,
  `operating_system` VARCHAR(50) NULL,
  `ip_hash` VARCHAR(64) NOT NULL,
  `user_agent_hash` VARCHAR(64) NOT NULL,
  `visit_date` DATE NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_visit_date` (`visit_date`),
  INDEX `idx_page_path` (`page_path`),
  INDEX `idx_session` (`session_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- 9. Table: settings
-- Configurable resort settings, contact info, rules, and policies
-- ============================================================================
CREATE TABLE `settings` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `setting_key` VARCHAR(100) NOT NULL UNIQUE,
  `setting_value` TEXT NULL,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_setting_key` (`setting_key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `settings` (`setting_key`, `setting_value`) VALUES
('resort_name', 'Vana Resort Araku'),
('resort_subtitle', 'Araku Valley'),
('resort_category', '3-Star Mountain Retreat'),
('resort_address', 'Ranajilleda Waterfalls Road, Padmapuram, Araku Valley, Andhra Pradesh 531149, India'),
('phone_primary', '+91 90141 15175'),
('phone_display', '+91 90141 15175 (Front Desk)'),
('email_reservations', 'matsyaraju909@gmail.com'),
('whatsapp_number', '919014115175'),
('office_hours', '8:00 AM – 10:00 PM IST'),
('check_in_time', '12:00 PM'),
('check_out_time', '10:00 AM'),
('instagram_handle', 'mobile._.moments_'),
('instagram_url', 'https://www.instagram.com/mobile._.moments_/'),
('maintenance_mode', 'false'),
('booking_enabled', 'true'),
('booking_notice', 'Direct reservation requests are reviewed by our front desk within 30 minutes.');
