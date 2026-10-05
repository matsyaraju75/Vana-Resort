/**
 * @file App.tsx
 * @description Master application routing setup connecting resort pages, attractions, travel guide,
 * authentication, floating actions, and layout components.
 */

import React, { useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { apiService } from './services/api';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { ScrollToTop } from './components/common/ScrollToTop';
import { FloatingActions } from './components/common/FloatingActions';
import { LoginModal } from './components/auth/LoginModal';
import { ResortChatbot } from './components/common/ResortChatbot';

import { HomePage } from './pages/HomePage';
import { RoomsPage } from './pages/RoomsPage';
import { RoomDetailsPage } from './pages/RoomDetailsPage';
import { AmenitiesPage } from './pages/AmenitiesPage';
import { GalleryPage } from './pages/GalleryPage';
import { AboutPage } from './pages/AboutPage';
import { LocationPage } from './pages/LocationPage';
import { ContactPage } from './pages/ContactPage';
import { BookingPage } from './pages/BookingPage';
import { AdminPage } from './pages/AdminPage';
import { AttractionsPage } from './pages/AttractionsPage';
import { ThingsToDoPage } from './pages/ThingsToDoPage';
import { TravelGuidePage } from './pages/TravelGuidePage';
import { NotFoundPage } from './pages/NotFoundPage';

const PageTracker: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    const timer = setTimeout(() => {
      apiService.trackPageView(location.pathname, document.title || 'Vana Resort Araku');
    }, 150);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  return null;
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <HashRouter>
        <PageTracker />
        <ScrollToTop />
        <div className="min-h-screen flex flex-col relative text-slate-earth selection:bg-vana-200 selection:text-vana-900 overflow-x-hidden">
          {/* Subtle Ambient Scenic Glows */}
          <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-vana-500/10 rounded-full blur-3xl pointer-events-none -z-10" />
          <div className="fixed bottom-1/3 left-0 w-[450px] h-[450px] bg-amber-500/10 rounded-full blur-3xl pointer-events-none -z-10" />
          <div className="fixed bottom-0 right-1/4 w-[400px] h-[400px] bg-emerald-600/10 rounded-full blur-3xl pointer-events-none -z-10" />

          <Navbar />

          <main className="flex-1">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/rooms" element={<RoomsPage />} />
              <Route path="/rooms/:slug" element={<RoomDetailsPage />} />
              <Route path="/amenities" element={<AmenitiesPage />} />
              
              {/* Explore Suite Routes */}
              <Route path="/nearby-attractions" element={<AttractionsPage />} />
              <Route path="/explore/attractions" element={<Navigate to="/nearby-attractions" replace />} />
              <Route path="/things-to-do" element={<ThingsToDoPage />} />
              <Route path="/explore/things-to-do" element={<Navigate to="/things-to-do" replace />} />
              <Route path="/travel-guide" element={<TravelGuidePage />} />
              <Route path="/explore/travel-guide" element={<Navigate to="/travel-guide" replace />} />

              <Route path="/gallery" element={<GalleryPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/location" element={<LocationPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/booking" element={<BookingPage />} />
              <Route path="/admin" element={<AdminPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </main>

          <Footer />

          {/* Floating Action Buttons for WhatsApp & Instagram */}
          <FloatingActions />

          {/* AI Resort Concierge Chatbot */}
          <ResortChatbot />

          {/* Global Staff Authentication Modal */}
          <LoginModal />
        </div>
      </HashRouter>
    </AuthProvider>
  );
};

export default App;
