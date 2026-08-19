import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Menu,
  X,
  LogOut,
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  FileText,
  MessageSquare,
  BarChart3,
  Settings,
  ChevronDown,
  Home,
  Image as ImageIcon,
} from 'lucide-react';
import { useAdminAuthStore } from '../../store/adminAuthStore';
import { showSuccess } from './common';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { adminUser, adminLogout } = useAdminAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const menuItems = [
    {
      label: 'Dashboard',
      icon: LayoutDashboard,
      path: '/admin',
      permission: 'analytics:read',
    },
    {
      label: 'Products',
      icon: Package,
      path: '/admin/products',
      permission: 'products:read',
    },
    {
      label: 'Orders',
      icon: ShoppingCart,
      path: '/admin/orders',
      permission: 'orders:read',
    },
    {
      label: 'Customers',
      icon: Users,
      path: '/admin/customers',
      permission: 'customers:read',
    },
    {
      label: 'Reviews',
      icon: MessageSquare,
      path: '/admin/reviews',
      permission: 'content:write',
    },
    {
      label: 'Hero Slides',
      icon: ImageIcon,
      path: '/admin/banners',
      permission: 'content:write',
    },
    {
      label: 'Collections',
      icon: Package,
      path: '/admin/collections',
      permission: 'content:write',
    },
    {
      label: 'Analytics',
      icon: BarChart3,
      path: '/admin/analytics',
      permission: 'analytics:read',
    },
    {
      label: 'Admin Logins',
      icon: Settings,
      path: '/admin/settings',
      permission: 'admins:manage',
    },
  ];

  // Filter menu items based on the logged-in admin's actual permissions
  const permissions = adminUser?.permissions || [];
  const visibleMenuItems = menuItems.filter(item =>
    permissions.includes('all') || permissions.includes(item.permission)
  );

  const handleLogout = async () => {
    try {
      await adminLogout();
      showSuccess('Logged out successfully');
      navigate('/admin/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navbar */}
      <nav className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-40">
        <div className="flex items-center justify-between px-4 py-4 md:px-8">
          {/* Left side */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors md:hidden"
            >
              {sidebarOpen ? (
                <X className="w-6 h-6 text-gray-600" />
              ) : (
                <Menu className="w-6 h-6 text-gray-600" />
              )}
            </button>
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[#C9A66B] rounded-lg flex items-center justify-center">
                <span className="text-white font-serif font-bold text-lg">P</span>
              </div>
              <span className="hidden sm:inline text-lg font-serif text-[#5A4232]">
                Pahadi Admin
              </span>
            </Link>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{adminUser?.name}</p>
                <p className="text-xs text-gray-500 capitalize">
                  {adminUser?.adminRole.replace('-', ' ')}
                </p>
              </div>
              <div className="w-10 h-10 rounded-full bg-[#F5E9DA] flex items-center justify-center">
                <span className="text-lg font-serif text-[#5A4232]">
                  {adminUser?.name.charAt(0).toUpperCase()}
                </span>
              </div>
            </div>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </nav>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ x: sidebarOpen ? 0 : -280 }}
        transition={{ duration: 0.2 }}
        className={`
          fixed top-16 left-0 bottom-0 w-64 bg-white border-r border-gray-200 z-30
          overflow-y-auto
          md:translate-x-0
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <nav className="p-4 space-y-2">
          {visibleMenuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);

            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
                  ${
                    active
                      ? 'bg-[#F5E9DA] text-[#5A4232] font-semibold'
                      : 'text-gray-600 hover:bg-gray-50'
                  }
                `}
              >
                <Icon className={`w-5 h-5 ${active ? 'text-[#C9A66B]' : ''}`} />
                <span className="text-sm">{item.label}</span>
                {active && (
                  <ChevronDown className="w-4 h-4 ml-auto rotate-180" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-gray-50">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors text-sm font-medium"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </motion.aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/50 z-20 md:hidden"
        />
      )}

      {/* Main Content */}
      <div className="md:ml-64 pt-16">
        {/* Breadcrumb & Header */}
        <div className="sticky top-16 bg-white border-b border-gray-200 px-4 md:px-8 py-4 z-10">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-serif text-[#5A4232]">Dashboard</h1>
            <div className="text-xs text-gray-500">
              Last updated: {new Date().toLocaleTimeString()}
            </div>
          </div>
        </div>

        {/* Page Content */}
        <main className="p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;