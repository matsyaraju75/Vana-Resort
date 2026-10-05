# Vana Resort Araku — Full-Stack Resort Web Application

A production-grade, eco-luxury resort web application for **Vana Resort Araku**, located on Ranajilleda Waterfalls Road, Padmapuram, Araku Valley, Andhra Pradesh, India. Built with a modern **React 19 + TypeScript + Vite** frontend integrated with a secure **PHP 8.2+ & MySQL 8+ REST API** backend.

---

## 🌲 Property Information Reference

- **Name:** Vana Resort Araku
- **Category:** 3-Star Hotel / Mountain Resort
- **Location:** Ranajilleda Waterfalls Road, Padmapuram, Araku Valley, Andhra Pradesh, India
- **Check-In:** 12:00 PM | **Check-Out:** 10:00 AM
- **Rating:** 3.2 / 5 (Based on 261 verified ratings across 90 guest photos)
- **Nearby Transit:**
  - Araku Railway Station: ~4.6 km
  - Karakavalasa Railway Station: ~21.6 km
- **Nearby Attractions:**
  - Padmapuram Botanical Gardens
  - Chaparai Waterfalls
  - Ranajilleda Waterfalls

---

## 🛠️ Full-Stack Technology Stack

### Frontend
- **Framework:** React 19 + TypeScript
- **Bundler:** Vite 8 with proxy routing to `/api`
- **Styling:** Tailwind CSS (Custom palette: `#2D5A27` Vana Green, Deep Timber, Warm Sand)
- **Routing:** React Router DOM (v7)
- **Icons:** Lucide React
- **API Client:** Centralized `apiService` (`src/services/api.ts`) with credential transmission and error handling.

### Backend (Production PHP & MySQL)
- **Runtime:** PHP 8.2+
- **Database:** MySQL 8+ / MariaDB 10.4+ (Default database: `vana_resort`)
- **Database Access:** PDO Singleton with Prepared Statements (`backend/config/database.php`)
- **Authentication:** PHP Native Sessions with `password_hash()` (bcrypt) verification
- **Security:** CSRF-ready, SQL injection-safe, sanitized JSON responses, HTTP-only session cookies
- **Architecture:** Modular RESTful endpoints organized under `backend/api/`

---

## 🗄️ Database Architecture (`database/vana_resort.sql`)

The database consists of 8 normalized relational tables:

1. **`admins`**: Staff and administrative user accounts with encrypted password hashes.
2. **`rooms`**: Room categories, slugs, descriptions, max occupancy, base tariffs, and inventory.
3. **`room_images`**: High-resolution gallery images linked to room categories.
4. **`bookings`**: Citizen and guest reservations with calculated nights, tariffs, status (`pending`, `confirmed`, `cancelled`, `completed`), and admin notes.
5. **`contacts`**: Traveler inquiry messages with read/responded tracking.
6. **`attractions`**: Regional tourist sights around Araku Valley.
7. **`gallery`**: Categorized resort and landscape photos.
8. **`visitor_logs`**: Privacy-friendly session traffic, visited paths, and device analytics.
9. **`settings`**: Dynamic operational variables (resort phone, WhatsApp, email, tax rate, check-in times).

---

## 🔑 Default Administrator Credentials

To access the Staff Administration Desk (`/admin`):

- **Username:** `admin`
- **Password:** `Admin@Vana2026!`
- **Role:** `super_admin`
- **Email:** `admin@vanaresortaraku.com`

---

## 🌐 Complete REST API Endpoint Directory

All endpoints return structured JSON with uniform envelope format:
```json
{
  "success": true,
  "message": "Operation completed",
  "data": { ... }
}
```

### 1. System & Authentication
- `GET  /api/health.php` — System health and database connectivity check.
- `POST /api/auth/login.php` — Staff login (verifies credentials, initiates PHP session).
- `POST /api/auth/logout.php` — Terminates active session.
- `GET  /api/auth/me.php` — Verifies current session and returns authenticated admin profile.

### 2. Booking Reservations
- `POST  /api/bookings/create.php` — Public endpoint to submit new reservation requests.
- `GET   /api/bookings/list.php` — Protected endpoint to retrieve reservations (supports `status`, `search`, and pagination).
- `GET   /api/bookings/get.php?id=REF` — Fetches detailed booking record.
- `PATCH /api/bookings/update-status.php` — Updates reservation status (`pending`, `confirmed`, `cancelled`) and notes.
- `DELETE /api/bookings/delete.php?id=REF` — Deletes reservation record.

### 3. Contact Inquiries
- `POST  /api/contacts/create.php` — Public endpoint to submit contact messages.
- `GET   /api/contacts/list.php` — Protected list of messages (`all`, `unread`, `read`, `responded`).
- `PATCH /api/contacts/update-status.php` — Marks message as read or responded.
- `DELETE /api/contacts/delete.php?id=ID` — Deletes contact inquiry.

### 4. Rooms Inventory
- `GET    /api/rooms/list.php` — Returns active rooms (or all if `?all=1` by admin).
- `GET    /api/rooms/get.php?id=SLUG` — Returns room details by slug.
- `POST   /api/rooms/create.php` — Adds new room category.
- `PUT    /api/rooms/update.php?id=ID` — Updates room tariff, status, or details.
- `DELETE /api/rooms/delete.php?id=ID` — Removes room category.

### 5. Attractions & Gallery
- `GET    /api/attractions/list.php` — Lists regional tourist spots.
- `POST   /api/attractions/create.php` — Adds new attraction.
- `PUT    /api/attractions/update.php?id=ID` — Updates attraction status/details.
- `DELETE /api/attractions/delete.php?id=ID` — Deletes attraction.
- `GET    /api/gallery/list.php` — Lists photos by category.
- `POST   /api/gallery/create.php` — Adds image to gallery.
- `DELETE /api/gallery/delete.php?id=ID` — Removes gallery image.

### 6. Analytics & Dashboard Statistics
- `POST /api/analytics/track.php` — Background pageview tracking on route changes.
- `GET  /api/analytics/dashboard.php` — Returns traffic overview, device breakdown, and top pages.
- `GET  /api/dashboard/stats.php` — Returns aggregated KPIs (bookings, revenue, inventory, messages).
- `GET  /api/settings/get.php` — Retrieves resort contact settings.
- `PUT  /api/settings/update.php` — Updates resort contact settings.

---

## 💻 XAMPP Setup & Running Instructions

### Step 1: Start Apache and MySQL
1. Open the **XAMPP Control Panel**.
2. Click **Start** next to **Apache**.
3. Click **Start** next to **MySQL**.

### Step 2: Import the Database
1. Open your browser and navigate to `http://localhost/phpmyadmin/`.
2. Click **New** in the left sidebar and create a database named `vana_resort`.
3. Select `vana_resort`, click the **Import** tab at the top.
4. Click **Choose File**, select `database/vana_resort.sql` from this repository, and click **Import**.

### Step 3: Configure Apache Document Root / Backend
Either copy or symlink the project folder into your XAMPP `htdocs` directory:
- Destination path: `C:\xampp\htdocs\vana-resort`
- Verify the backend health endpoint by opening:
  `http://localhost/vana-resort/backend/api/health.php`

### Step 4: Run the React Frontend
In a terminal inside the project directory:
```bash
# Start Vite development server
npm run dev
```
Open **`http://localhost:5173/`** in your browser.

---

## 📋 Comprehensive Admin Dashboard Features (`/admin`)

The upgraded Administration Desk includes **9 full-featured tabs**:

1. **Overview Dashboard:** Live KPI cards for Total Bookings, Confirmed Revenue, Pending Review alerts, Unread Messages, and recent activity streams.
2. **Bookings Desk:** Filter reservations by `all`, `pending`, `confirmed`, `cancelled`, real-time search, inspect modal, direct WhatsApp reply, and status updater.
3. **Contact Inquiries:** Filter by `unread`, `read`, `responded`, inspect sender details, direct email and WhatsApp shortcuts.
4. **Room Inventory:** View catalog status, toggle active/inactive availability, inspect capacities and tariffs.
5. **Attractions:** Manage regional tourist spots displayed on the website, add new attractions, toggle visibility.
6. **Photo Gallery:** Filter gallery by category (*Resort*, *Rooms*, *Nature*, *Amenities*), upload or add images with custom captions.
7. **Visitors & Traffic:** View real-time unique visitor sessions, daily/monthly counts, top visited pages, and device breakdown (Desktop, Mobile, Tablet).
8. **Resort Settings:** Update front desk contact numbers, concierge WhatsApp, tax percentage, check-in and check-out policies directly in MySQL.
9. **Google Hotel Prices API:** Test and configure live Google Hotel Price Feed APIs.

---

## 🌐 Live GitHub Pages Hosting

The frontend is fully configured for deployment on **GitHub Pages**:

- **Live URL:** **[https://matsyaraju75.github.io/Vana-Resort/](https://matsyaraju75.github.io/Vana-Resort/)**
- **Routing:** Client-side `HashRouter` ensures zero 404 reload errors on any page refresh or direct bookmark.
- **Automated CI/CD:** `.github/workflows/deploy.yml` automatically builds and publishes the site to GitHub Pages on every `git push` to `main`.
- **Manual Deploy Alternative:** Run `npm run deploy` to publish the `dist/` directory via the `gh-pages` branch.

### Enabling GitHub Pages on GitHub:
1. Go to your repository on GitHub: `https://github.com/matsyaraju75/Vana-Resort`
2. Navigate to **Settings** ➔ **Pages** (under Code and automation in the left menu).
3. Under **Build and deployment > Source**:
   - Choose **GitHub Actions** (recommended — triggers automatically on push)
   - *OR* choose **Deploy from a branch** and select `gh-pages` / `/ (root)`.
4. Your live site will be accessible at: `https://matsyaraju75.github.io/Vana-Resort/`

---

## 📽️ Project Demo Presentation
For project reviews, demonstrations, and viva:
- **PowerPoint Presentation:** [`Vana_Resort_Project_Demo.pptx`](./Vana_Resort_Project_Demo.pptx) (12 professional slides with animations and real property photographs).
- **Interactive Web Slides:** Open [`Vana_Resort_Demo_Presentation.html`](./Vana_Resort_Demo_Presentation.html) in any browser for full-screen slide transitions, keyboard controls (`Space` / `Arrow Keys`), speaker notes, and instant slide navigation.

---

## 📝 License

Private property configuration for Vana Resort Araku. All rights reserved.

