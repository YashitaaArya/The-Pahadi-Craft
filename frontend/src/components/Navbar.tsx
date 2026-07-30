import React, { Profiler } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Menu, X, Search, User, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCartStore } from '../store/cartStore';
import { useAuth } from '../context/AuthContext';
import { NavLink } from '../types';
import SearchBar from './SearchBar';

import icon1 from '../images1/iconew.png';



const navLinks: NavLink[] = [
  { path: '/', label: 'Home' },
  { path: '/shop', label: 'Shop' },
  { path: '/about', label: 'About' },
  { path: '/fragrance-guide', label: 'Fragrance Guide' },
  { path: '/custom-order', label: 'Custom Order' },
  { path: '/blog', label: 'Blog' },
  { path: '/contact', label: 'Contact' },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [isSearchOpen, setIsSearchOpen] = React.useState(false);
  const { user, logout, isAuthenticated } = useAuth();
  const toggleCart = useCartStore((state) => state.toggleCart);
  const items = useCartStore((state) => state.items);
  const navigate = useNavigate();

  const handleAuthClick = async () => {
    if (isAuthenticated) {
      navigate('/profile');
    } else {
      navigate('/auth');
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
      className="fixed w-full z-50 bg-white/30 backdrop-blur-lg border-b border-[#C9A66B]/20 shadow-md"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link 
            to="/" 
            className="text-2xl font-serif text-[#3B2A1C]  hover:text-[#C9A66B] transition-colors duration-300"
          >
            <img className="h-20 w-auto ml-2   filter sepia brightness-90 hue-rotate-[10deg] saturate-200 drop-shadow-lg" src={icon1} alt="Icon" />
            {/* Pahadi Craft */}
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="relative text-[#3B2A1C]  hover:text-[#C9A66B] transition-colors duration-300 after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-[#C9A66B] after:scale-x-0 after:origin-right after:transition-transform hover:after:scale-x-100 hover:after:origin-left"
              >
                {link.label}
              </Link>
            ))}
            {user?.role === 'admin' && (
              <Link
                to="/admin"
                className="relative text-[#3B2A1C]  hover:text-[#C9A66B] transition-colors duration-300"
              >
                Admin
              </Link>
            )}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsSearchOpen(true)}
              className="relative p-2 hover:bg-[#F5E9DA] rounded-full transition-colors duration-300"
            >
              <Search className="w-6 h-6 text-[#3B2A1C] " />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={toggleCart}
              className="relative p-2 hover:bg-[#F5E9DA] rounded-full transition-colors duration-300"
            >
              <ShoppingBag className="w-6 h-6 text-[#3B2A1C] " />
              {items.length > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 w-5 h-5 bg-[#C9A66B] text-white text-xs rounded-full flex items-center justify-center"
                >
                  {items.length}
                </motion.span>
              )}
            </motion.button>
            <motion.div className="flex items-center gap-2">
              {isAuthenticated ? (
                <>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleAuthClick}
                    className="relative p-2 hover:bg-[#F5E9DA] rounded-full"
                  >
                    <User className="w-6 h-6 text-[#3B2A1C]" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleLogout}
                    className="relative p-2 hover:bg-[#F5E9DA] rounded-full"
                  >
                    <LogOut className="w-6 h-6 text-[#3B2A1C]" />
                  </motion.button>
                </>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleAuthClick}
                  className="relative p-2 hover:bg-[#F5E9DA] rounded-full"
                >
                  <User className="w-6 h-6 text-[#3B2A1C]" />
                </motion.button>
              )}
            </motion.div>
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden flex items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsSearchOpen(true)}
              className="relative p-2 hover:bg-[#F5E9DA] rounded-full transition-colors duration-300"
            >
              <Search className="w-6 h-6 text-[#5A4232]" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={toggleCart}
              className="relative p-2 hover:bg-[#F5E9DA] rounded-full transition-colors duration-300"
            >
              <ShoppingBag className="w-6 h-6 text-[#5A4232]" />
              {items.length > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 w-5 h-5 bg-[#C9A66B] text-white text-xs rounded-full flex items-center justify-center"
                >
                  {items.length}
                </motion.span>
              )}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 hover:bg-[#F5E9DA] rounded-full transition-colors duration-300"
            >
              {isOpen ? (
                <X className="w-6 h-6 text-[#5A4232]" />
              ) : (
                <Menu className="w-6 h-6 text-[#5A4232]" />
              )}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <SearchBar isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden overflow-hidden"
          >
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white/90 backdrop-blur-md">
              {navLinks.map((link) => (
                <motion.div
                  key={link.path}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -20, opacity: 0 }}
                >
                  <Link
                    to={link.path}
                    className="block px-3 py-2 text-[#5A4232] hover:text-[#C9A66B] hover:bg-[#F5E9DA] rounded-md transition-all duration-300"
                    onClick={() => setIsOpen(false)}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              {user?.role === 'admin' && (
                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -20, opacity: 0 }}
                >
                  <Link
                    to="/admin"
                    className="block px-3 py-2 text-[#5A4232] hover:text-[#C9A66B] hover:bg-[#F5E9DA] rounded-md transition-all duration-300"
                    onClick={() => setIsOpen(false)}
                  >
                    Admin
                  </Link>
                </motion.div>
              )}
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -20, opacity: 0 }}
              >
                <button
                  onClick={() => {
                    handleAuthClick();
                    setIsOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 text-[#5A4232] hover:text-[#C9A66B] hover:bg-[#F5E9DA] rounded-md transition-all duration-300"
                >
                  {user ? 'Sign Out' : 'Sign In'}
                </button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;