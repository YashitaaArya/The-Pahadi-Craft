import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, X } from 'lucide-react';
import { useProductStore } from '../store/productStore';
import ProductImageCarousel from './ProductImageCarousel';
import { getProductImageUrls } from '../utils/productImages';

const FeaturedProducts = () => {
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const { products, loading, fetchProducts } = useProductStore();

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const featured = (products && products.length > 0)
    ? products.filter((p: any) => p.featured).slice(0, 6)
    : [];

  const listToShow = featured.length > 0 ? featured : products.slice(0, 6);

  return (
    <section className="py-16 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl font-serif text-center text-[#5A4232] mb-12">Featured Products</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {listToShow.map((product: any) => (
              <div
                key={product.id}
                className="group cursor-pointer"
                onClick={() => setSelectedProduct(product)}
              >
                <div className="relative overflow-hidden rounded-lg">
                  <ProductImageCarousel
                    images={getProductImageUrls(product)}
                    alt={product.name}
                    className="w-full h-80"
                    showThumbnails={false}
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-6">
                    <h3 className="text-xl font-serif text-white">{product.name}</h3>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex">
                        {Array(Math.round(product.ratings || product.rating || 0)).fill(0).map((_, i) => (
                          <Star key={i} className="w-4 h-4 text-[#C9A66B] fill-current" />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selectedProduct && (
          <motion.div
            className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-[#F3E9DD] p-6 rounded-xl max-w-md w-full relative shadow-2xl"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <button
                onClick={() => setSelectedProduct(null)}
                className="absolute top-3 right-3 text-[#3B2A1A] hover:text-black transition"
              >
                <X className="w-5 h-5" />
              </button>

              <img
                src={getDriveImage(selectedProduct.image)}
                alt={selectedProduct.name}
                className="w-full h-56 object-cover rounded-lg mb-4 shadow-md"
              />

              <h3 className="text-2xl font-serif text-[#3B2A1A] font-semibold mb-2">
                {selectedProduct.name}
              </h3>

              <div className="flex mb-3">
                {[...Array(selectedProduct.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-[#C9A66B] fill-current" />
                ))}
              </div>

              <p className="text-sm text-[#3B2A1A] leading-relaxed">
                {selectedProduct.description}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default FeaturedProducts;

