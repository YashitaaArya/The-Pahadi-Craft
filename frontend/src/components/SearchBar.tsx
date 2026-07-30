import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X } from 'lucide-react';

interface SearchBarProps {
  isOpen: boolean;
  onClose: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="absolute top-full left-0 right-0 bg-white shadow-lg border-t border-[#C9A66B]/20 p-4"
        >
          <div className="max-w-3xl mx-auto relative">
            <input
              type="text"
              placeholder="Search products..."
              className="w-full px-12 py-3 rounded-full border border-[#C9A66B]/30 focus:outline-none focus:ring-2 focus:ring-[#C9A66B] focus:border-transparent"
              autoFocus
            />
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#5A4232] w-5 h-5" />
            <button
              onClick={onClose}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#5A4232] hover:text-[#C9A66B] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SearchBar;