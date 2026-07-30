import React from 'react';
import { motion } from 'framer-motion';
import { Star, ShoppingBag } from 'lucide-react';
import { Product } from '../types';
import { useCartStore } from '../store/cartStore';
import ProductImageCarousel from './ProductImageCarousel';
import { getProductImageUrls } from '../utils/productImages';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const addItem = useCartStore((state) => state.addItem);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      whileHover={{ y: -5 }}
      className="group relative bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
    >
      <div className="aspect-square overflow-hidden">
        <motion.div
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.4 }}
          className="w-full h-full"
        >
          <ProductImageCarousel
            images={getProductImageUrls(product)}
            alt={product.name}
            className="w-full h-full"
            showThumbnails={false}
          />
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </motion.div>
      </div>
      <div className="p-6">
        <h3 className="font-serif text-lg text-[#5A4232] mb-1 group-hover:text-[#C9A66B] transition-colors duration-300">
          {product.name}
        </h3>
        <p className="text-gray-600 text-sm mb-2">{product.description}</p>
        <div className="flex items-center justify-between">
          <span className="text-[#C9A66B] font-semibold">₹ {product.price}</span>
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i} 
                className="w-4 h-4 text-[#C9A66B] fill-current transition-transform duration-300 hover:scale-125" 
              />
            ))}
          </div>
        </div>
        <motion.button
          onClick={() => addItem(product)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="mt-4 w-full bg-[#5A4232] text-white py-3 rounded-full flex items-center justify-center gap-2 hover:bg-[#C9A66B] transition-all duration-300 group/btn"
        >
          <ShoppingBag className="w-4 h-4 transition-transform duration-300 group-hover/btn:scale-110" />
          <span className="relative after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-white after:scale-x-0 after:origin-right after:transition-transform group-hover/btn:after:scale-x-100 group-hover/btn:after:origin-left">
            Add to Cart
          </span>
        </motion.button>
      </div>
    </motion.div>
  );
};

export default ProductCard;