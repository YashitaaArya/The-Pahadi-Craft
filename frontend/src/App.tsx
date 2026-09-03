import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import MaintenancePage from './pages/MaintenancePage';
import ScrollToTop from './components/ScrollToTop';
import Navbar from './components/Navbar';
import Cart from './components/Cart';
import ContactSlider from './components/ContactSlider';
import Hero from './components/Hero';
import FeaturedProducts from './components/FeaturedProducts';
import Collections from './components/Collections';
import WhyChooseUs from './components/WhyChooseUs';
import Testimonials from './components/Testimonials';
import Instagram from './components/Instagram';
import Footer from './components/Footer';
import Shop from './pages/Shop';
import About from './pages/About';
import FragranceGuide from './pages/FragranceGuide';
import CustomOrder from './pages/CustomOrder';
import Blog from './pages/Blog';
import Contact from './pages/Contact';
import Auth from './components/Auth';
import ProtectedRoute from './components/ProtectedRoute';
import Shipping from './pages/Shipping';
import Returns from './pages/Returns';
import Faq from './pages/Faq';
import CareGuide from './pages/CareGuide';
import Dashboard from './pages/Dashboard';
import Checkout from './components/Checkout';
import UserProfile from './pages/UserProfile';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsConditions from './pages/TermsConditions';
import PremiumCandles from './pages/PremiumCandles';

// Admin Components
import AdminLogin from './components/admin/AdminLogin';
import AdminLayout from './components/admin/AdminLayout';
import AdminDashboard from './components/admin/Dashboard';
import ProductManager from './components/admin/ProductManager';
import OrderManager from './components/admin/OrderManager';
import UserManager from './components/admin/UserManager';
import TeamManager from './components/admin/TeamManager';
import TestimonialManager from './components/admin/TestimonialManager';
import BannerManager from './components/admin/BannerManager';
import CollectionsManager from './components/admin/CollectionsManager';
import ContactMessages from './components/admin/ContactMessages';
import PressManager from './components/admin/PressManager';
import AboutPageManager from './components/admin/AboutPageManager';
import BlogManager from './components/admin/BlogManager';
import { useAdminAuthStore, initializeAdminAuth } from './store/adminAuthStore';
import { ToastContainer } from './components/admin/common';

// Protected Admin Route Component
interface ProtectedAdminRouteProps {
  children: React.ReactNode;
}

const ProtectedAdminRoute: React.FC<ProtectedAdminRouteProps> = ({ children }) => {
  const { isAuthenticated, loading } = useAdminAuthStore();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#C9A66B] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return <>{children}</>;
};

// Gates a specific admin section behind a permission, on top of the
// auth check ProtectedAdminRoute already does. Shows a friendly message
// instead of the page contents if the logged-in admin lacks it.
const RequirePermission: React.FC<{ permission: string; children: React.ReactNode }> = ({ permission, children }) => {
  const { adminUser } = useAdminAuthStore();
  const permissions = adminUser?.permissions || [];
  const allowed = permissions.includes('all') || permissions.includes(permission);

  if (!allowed) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-600">You don't have access to this section.</p>
        <p className="text-gray-400 text-sm mt-1">Ask a developer/owner login to change your role if this is unexpected.</p>
      </div>
    );
  }

  return <>{children}</>;
};

const MAINTENANCE_MODE = import.meta.env.VITE_MAINTENANCE_MODE === 'true';

function AppRoutes() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  const { isAuthenticated } = useAdminAuthStore();

  // Random visitors see the maintenance page, but anyone logged into admin
  // can still browse the real storefront to check their work.
  if (MAINTENANCE_MODE && !isAdminRoute && !isAuthenticated) {
    return <MaintenancePage />;
  }

  return (
    <Routes>
      {/* Admin Routes - always accessible, even in maintenance mode */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route
        path="/admin/*"
        element={
          <ProtectedAdminRoute>
            <AdminLayout>
              <Routes>
                <Route path="/" element={<RequirePermission permission="analytics:read"><AdminDashboard /></RequirePermission>} />
                {/* Add more admin routes here as you build them */}
                <Route path="products" element={<RequirePermission permission="products:read"><ProductManager /></RequirePermission>} />
                <Route path="orders" element={<RequirePermission permission="orders:read"><OrderManager /></RequirePermission>} />
                <Route path="customers" element={<RequirePermission permission="customers:read"><UserManager /></RequirePermission>} />
                <Route path="reviews" element={<RequirePermission permission="content:write"><TestimonialManager /></RequirePermission>} />
                <Route path="banners" element={<RequirePermission permission="content:write"><BannerManager /></RequirePermission>} />
                <Route path="collections" element={<RequirePermission permission="content:write"><CollectionsManager /></RequirePermission>} />
                <Route path="messages" element={<RequirePermission permission="customers:read"><ContactMessages /></RequirePermission>} />
                <Route path="press" element={<RequirePermission permission="content:write"><PressManager /></RequirePermission>} />
                <Route path="about-page" element={<RequirePermission permission="content:write"><AboutPageManager /></RequirePermission>} />
                <Route path="blog" element={<RequirePermission permission="content:write"><BlogManager /></RequirePermission>} />
                <Route path="analytics" element={<RequirePermission permission="analytics:read"><div className="text-center py-12">Analytics coming soon...</div></RequirePermission>} />
                <Route path="settings" element={<RequirePermission permission="admins:manage"><TeamManager /></RequirePermission>} />
              </Routes>
            </AdminLayout>
          </ProtectedAdminRoute>
        }
      />

      {/* Customer Routes */}
      <Route
        path="/"
        element={
          <div className="min-h-screen bg-[#FFF8F2]">
            <Navbar />
            <Cart />
            <ContactSlider />
            <HomePage />
            <Footer />
          </div>
        }
      />
      <Route
        path="/shop"
        element={
          <div className="min-h-screen bg-[#FFF8F2]">
            <Navbar />
            <Cart />
            <ContactSlider />
            <Shop />
            <Footer />
          </div>
        }
      />
      <Route
        path="/about"
        element={
          <div className="min-h-screen bg-[#FFF8F2]">
            <Navbar />
            <Cart />
            <ContactSlider />
            <About />
            <Footer />
          </div>
        }
      />
      <Route
        path="/fragrance-guide"
        element={
          <div className="min-h-screen bg-[#FFF8F2]">
            <Navbar />
            <Cart />
            <ContactSlider />
            <FragranceGuide />
            <Footer />
          </div>
        }
      />
      <Route
        path="/custom-order"
        element={
          <div className="min-h-screen bg-[#FFF8F2]">
            <Navbar />
            <Cart />
            <ContactSlider />
            <CustomOrder />
            <Footer />
          </div>
        }
      />
      <Route
        path="/blog"
        element={
          <div className="min-h-screen bg-[#FFF8F2]">
            <Navbar />
            <Cart />
            <ContactSlider />
            <Blog />
            <Footer />
          </div>
        }
      />
      <Route
        path="/blog/:slug"
        element={
          <div className="min-h-screen bg-[#FFF8F2]">
            <Navbar />
            <Cart />
            <ContactSlider />
            <BlogPost />
            <Footer />
          </div>
        }
      />
      <Route
        path="/contact"
        element={
          <div className="min-h-screen bg-[#FFF8F2]">
            <Navbar />
            <Cart />
            <ContactSlider />
            <Contact />
            <Footer />
          </div>
        }
      />
      <Route
        path="/auth"
        element={
          <div className="min-h-screen bg-[#FFF8F2]">
            <Navbar />
            <Cart />
            <ContactSlider />
            <Auth />
            <Footer />
          </div>
        }
      />
      <Route
        path="/shipping"
        element={
          <div className="min-h-screen bg-[#FFF8F2]">
            <Navbar />
            <Cart />
            <ContactSlider />
            <Shipping />
            <Footer />
          </div>
        }
      />
      <Route
        path="/returns"
        element={
          <div className="min-h-screen bg-[#FFF8F2]">
            <Navbar />
            <Cart />
            <ContactSlider />
            <Returns />
            <Footer />
          </div>
        }
      />
      <Route
        path="/faq"
        element={
          <div className="min-h-screen bg-[#FFF8F2]">
            <Navbar />
            <Cart />
            <ContactSlider />
            <Faq />
            <Footer />
          </div>
        }
      />
      <Route
        path="/terms-conditions"
        element={
          <div className="min-h-screen bg-[#FFF8F2]">
            <Navbar />
            <Cart />
            <ContactSlider />
            <TermsConditions />
            <Footer />
          </div>
        }
      />
      <Route
        path="/privacy-policy"
        element={
          <div className="min-h-screen bg-[#FFF8F2]">
            <Navbar />
            <Cart />
            <ContactSlider />
            <PrivacyPolicy />
            <Footer />
          </div>
        }
      />
      <Route
        path="/care-guide"
        element={
          <div className="min-h-screen bg-[#FFF8F2]">
            <Navbar />
            <Cart />
            <ContactSlider />
            <CareGuide />
            <Footer />
          </div>
        }
      />
      <Route
        path="/dashboard"
        element={
          <div className="min-h-screen bg-[#FFF8F2]">
            <Navbar />
            <Cart />
            <ContactSlider />
            <Dashboard />
            <Footer />
          </div>
        }
      />
      <Route
        path="/profile"
        element={
          <div className="min-h-screen bg-[#FFF8F2]">
            <Navbar />
            <Cart />
            <ContactSlider />
            <UserProfile />
            <Footer />
          </div>
        }
      />
      <Route
        path="/checkout"
        element={
          <div className="min-h-screen bg-[#FFF8F2]">
            <Navbar />
            <Cart />
            <ContactSlider />
            <Checkout />
            <Footer />
          </div>
        }
      />
      <Route
        path="/premium-candles"
        element={
          <div className="min-h-screen bg-[#FFF8F2]">
            <Navbar />
            <Cart />
            <ContactSlider />
            <PremiumCandles />
            <Footer />
          </div>
        }
      />
    </Routes>
  );
}

function App() {
  // Initialize admin auth on mount
  useEffect(() => {
    initializeAdminAuth();
  }, []);

  return (
    <Router>
      <ScrollToTop />
      <ToastContainer />
      <AppRoutes />
    </Router>
  );
}

import PopupOffer from './components/PopupOffer';
import BlogPost from './pages/BlogPost';

const HomePage = () => {
  const [showPopup, setShowPopup] = React.useState(false);

  React.useEffect(() => {
    const hasVisited = sessionStorage.getItem('hasVisitedBefore');
    
    if (!hasVisited) {
      sessionStorage.setItem('hasVisitedBefore', 'true');
    } else {
      const timer = setTimeout(() => {
        setShowPopup(true);
      }, 1500);
      
      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <main className="pt-20">
      <Hero />
      <FeaturedProducts />
      <Collections />
      <WhyChooseUs />
      <Testimonials />
      <Instagram />
      <PopupOffer isOpen={showPopup} onClose={() => setShowPopup(false)} />
    </main>
  );
};

export default App;