import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useProductStore } from '../store/productStore';
import { getDriveImage } from '../utils/driveImage';

interface SearchBarProps {
  isOpen: boolean;
  onClose: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const { products, fetchProducts } = useProductStore();

  useEffect(() => {
    if (isOpen && products.length === 0) {
      fetchProducts();
    }
  }, [isOpen, products.length, fetchProducts]);

  useEffect(() => {
    if (!isOpen) setQuery('');
  }, [isOpen]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (q.length < 2) return [];
    return products
      .filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q) ||
          (p.mainCategory || p.category)?.toLowerCase().includes(q)
      )
      .slice(0, 6);
  }, [query, products]);

  const goToFullResults = () => {
    if (!query.trim()) return;
    navigate(`/shop?q=${encodeURIComponent(query.trim())}`);
    onClose();
  };

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
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') goToFullResults();
                if (e.key === 'Escape') onClose();
              }}
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

            {/* Live results dropdown */}
            {query.trim().length >= 2 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-[#E6DFD7] overflow-hidden max-h-96 overflow-y-auto">
                {results.length === 0 ? (
                  <p className="text-center text-gray-400 text-sm py-6">No products found for "{query}"</p>
                ) : (
                  <>
                    {results.map((product) => (
                      <button
                        key={product.id}
                        onClick={() => {
                          navigate(`/shop?q=${encodeURIComponent(product.name)}`);
                          onClose();
                        }}
                        className="w-full flex items-center gap-3 p-3 hover:bg-[#F5E9DA] transition-colors text-left"
                      >
                        {product.image ? (
                          <img src={getDriveImage(product.image)} alt={product.name} className="w-12 h-12 object-cover rounded-lg flex-shrink-0" />
                        ) : (
                          <div className="w-12 h-12 rounded-lg bg-[#F5E9DA] flex-shrink-0" />
                        )}
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-[#5A4232] truncate">{product.name}</p>
                          <p className="text-xs text-gray-400">{product.mainCategory || product.category}</p>
                        </div>
                        <span className="ml-auto text-sm text-[#C9A66B] font-medium flex-shrink-0">₹{product.price}</span>
                      </button>
                    ))}
                    <button
                      onClick={goToFullResults}
                      className="w-full text-center text-sm text-[#5A4232] font-semibold py-3 border-t border-[#E6DFD7] hover:bg-[#F5E9DA] transition-colors"
                    >
                      See all results for "{query}"
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SearchBar;