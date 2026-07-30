import React from 'react';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import { useWishlistStore } from '../store/wishlistStore';
import { Product } from '../types';

interface WishlistButtonProps {
  product: Product;
}

const WishlistButton: React.FC<WishlistButtonProps> = ({ product }) => {
  const { addItem, removeItem, isInWishlist } = useWishlistStore();
  const isWishlisted = isInWishlist(product.id);

  const handleToggleWishlist = () => {
    if (isWishlisted) {
      removeItem(product.id);
    } else {
      addItem(product);
    }
  };

  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={handleToggleWishlist}
      className={`p-2 rounded-full transition-colors ${
        isWishlisted
          ? 'bg-red-50 text-red-500'
          : 'bg-gray-50 text-gray-400 hover:text-red-500 hover:bg-red-50'
      }`}
    >
      <Heart
        className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`}
      />
    </motion.button>
  );
};

export default WishlistButton;