import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Star, Heart, Share2, Truck, ShieldCheck, ChevronLeft, ChevronRight } from 'lucide-react';
import { useProductStore } from '../store/productStore';
import { getDriveImage } from '../utils/driveImage';
import { useCartStore } from '../store/cartStore';
import { showCartNotification } from '../components/admin/common';
import { Product } from '../types';

const PremiumCandles: React.FC = () => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCartStore();
  const [currentSlide, setCurrentSlide] = useState(0);
  const { products, fetchProducts } = useProductStore();

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const premiumProducts = React.useMemo(() => {
    return products.filter((product) =>
      product.primeSubcategory === 'Premium' ||
      product.subcategory === 'Premium' ||
      product.tags?.includes('premium') ||
      ((product.mainCategory || product.category) === 'Candles' && (product.featured || product.trending))
    );
  }, [products]);

  const productsToShow = premiumProducts.length > 0
    ? premiumProducts
    : products.filter((product) => (product.mainCategory || product.category) === 'Candles').slice(0, 8);

  // Slideshow images and content - updated with more reliable candle images
  const slideshowContent = [
    {
      image: "https://images.pexels.com/photos/1652109/pexels-photo-1652109.jpeg",
      heading: "Luxury Premium Collection",
      subheading: "Artisan-crafted candles for refined spaces"
    },
    {
      image: "https://images.pexels.com/photos/3066868/pexels-photo-3066868.jpeg",
      heading: "Natural Wax Elegance",
      subheading: "Pure ingredients for a clean, luxurious burn"
    },
    {
      image: "https://images.pexels.com/photos/2233416/pexels-photo-2233416.jpeg",
      heading: "Aromatic Journeys",
      subheading: "Travel through scent with our exclusive fragrances"
    },
    {
      image: "https://images.pexels.com/photos/3654620/pexels-photo-3654620.jpeg",
      heading: "Artisan Craftsmanship",
      subheading: "Each candle tells a story of dedication and passion"
    }
  ];

  // Auto-advance slideshow with slower transition - changed from 5000ms to 8000ms
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slideshowContent.length);
    }, 8000); // Slower transition (8 seconds instead of 5)
    return () => clearInterval(interval);
  }, []);

  // Use premium candles from our dedicated data file
  const handleAddToCart = (product: Product, qty = 1) => {
    addItem(product, qty);
    showCartNotification(product.name);
  };

  // Function to get additional images, handling both property names
  const getAdditionalImages = (product: Product) => {
    if (product?.additionalImages) {
      return product.additionalImages;
    } 
    if (product?.addtionalImages) { // Handle typo in some products
      return product.addtionalImages;
    }
    return [];
  };

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!selectedProduct) return;
    
    const images = getAdditionalImages(selectedProduct);
    if (images.length === 0) return;
    
    const totalImages = images.length + 1; // +1 for main image
    setCurrentImageIndex((prev) => (prev + 1) % totalImages);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!selectedProduct) return;
    
    const images = getAdditionalImages(selectedProduct);
    if (images.length === 0) return;
    
    const totalImages = images.length + 1; // +1 for main image
    setCurrentImageIndex((prev) => (prev - 1 + totalImages) % totalImages);
  };

  const handleClose = () => {
    setSelectedProduct(null);
    setCurrentImageIndex(0);
    setQuantity(1);
  };

  const getCurrentImage = (product: Product) => {
    if (currentImageIndex === 0) {
      return product.image;
    } else {
      const images = getAdditionalImages(product);
      return images[currentImageIndex - 1];
    }
  };

  // Page transitions with improved animation
  const pageTransition = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1]
      }
    }
  };

  return (
    <motion.div 
      className="container mx-auto py-0 px-0 max-w-full"
      initial="hidden"
      animate="visible"
      variants={pageTransition}
    >
      {/* Premium Slideshow with Overlay Text */}
      <div className="relative w-full h-[80vh] overflow-hidden">
        {slideshowContent.map((slide, index) => (
          <motion.div 
            key={index}
            className="absolute inset-0 w-full h-full"
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: currentSlide === index ? 1 : 0,
              transition: { duration: 2.5 } // Slower fade transition (increased from 1.2 to 2.5 seconds)
            }}
          >
            <div className="absolute inset-0 bg-black/30 z-10"></div>
            <img 
              src={slide.image}
              alt={`Premium Candles - ${slide.heading}`}
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center z-20 text-center px-6">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ 
                  opacity: currentSlide === index ? 1 : 0,
                  y: currentSlide === index ? 0 : 30,
                  transition: { 
                    delay: 0.3,
                    duration: 0.8
                  }
                }}
              >
                <h1 className="text-5xl md:text-7xl font-serif text-white mb-6 tracking-tight drop-shadow-lg">
                  {slide.heading}
                </h1>
                <div className="w-32 h-1 bg-gradient-to-r from-amber-400 via-amber-600 to-amber-300 mx-auto mb-8"></div>
                <p className="max-w-2xl mx-auto text-white/90 text-xl md:text-2xl font-light leading-relaxed drop-shadow-md">
                  {slide.subheading}
                </p>
              </motion.div>
            </div>
          </motion.div>
        ))}

        {/* Slideshow Navigation */}
        <div className="absolute bottom-10 left-0 right-0 flex justify-center gap-3 z-30">
          {slideshowContent.map((_, index) => (
            <button
              key={index}
              className={`w-3 h-3 rounded-full transition-all ${
                currentSlide === index 
                  ? 'bg-white scale-110' 
                  : 'bg-white/50 hover:bg-white/70'
              }`}
              onClick={() => setCurrentSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        {/* Slideshow Controls */}
        <button 
          className="absolute left-5 top-1/2 -translate-y-1/2 z-30 p-2 rounded-full bg-black/30 hover:bg-black/50 text-white transition-all"
          onClick={() => setCurrentSlide(prev => (prev - 1 + slideshowContent.length) % slideshowContent.length)}
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button 
          className="absolute right-5 top-1/2 -translate-y-1/2 z-30 p-2 rounded-full bg-black/30 hover:bg-black/50 text-white transition-all"
          onClick={() => setCurrentSlide(prev => (prev + 1) % slideshowContent.length)}
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* Introduction Text */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-serif text-amber-900 mb-6">Discover Luxury in Every Detail</h2>
          <p className="max-w-3xl mx-auto text-amber-800 opacity-80 text-lg leading-relaxed">
            Discover our exclusive range of premium candles, meticulously handcrafted using the finest ingredients and unique artisanal techniques. 
            Each piece is a statement of luxury and refinement for your space.
          </p>
        </div>

        {/* Feature section with improved design */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-24">
          <div className="bg-gradient-to-br from-amber-50 to-amber-100 p-8 rounded-2xl text-center shadow-lg hover:shadow-xl transition-all duration-300 border border-amber-100/50">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-amber-200 to-amber-300 mb-5">
              <Truck className="w-8 h-8 text-amber-700" />
            </div>
            <h3 className="text-xl font-medium text-amber-900 mb-3">Luxury Materials</h3>
            <p className="text-amber-700">Crafted with the highest quality soy and coconut wax blends</p>
          </div>
          <div className="bg-gradient-to-br from-amber-50 to-amber-100 p-8 rounded-2xl text-center shadow-lg hover:shadow-xl transition-all duration-300 border border-amber-100/50">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-amber-200 to-amber-300 mb-5">
              <Star className="w-8 h-8 text-amber-700" />
            </div>
            <h3 className="text-xl font-medium text-amber-900 mb-3">Master Artisan Crafted</h3>
            <p className="text-amber-700">Handcrafted by skilled artisans with decades of experience</p>
          </div>
          <div className="bg-gradient-to-br from-amber-50 to-amber-100 p-8 rounded-2xl text-center shadow-lg hover:shadow-xl transition-all duration-300 border border-amber-100/50">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-amber-200 to-amber-300 mb-5">
              <ShieldCheck className="w-8 h-8 text-amber-700" />
            </div>
            <h3 className="text-xl font-medium text-amber-900 mb-3">Extended Burn Time</h3>
            <p className="text-amber-700">Enjoy up to 90+ hours of consistent, luxurious fragrance</p>
          </div>
          <div className="bg-gradient-to-br from-amber-50 to-amber-100 p-8 rounded-2xl text-center shadow-lg hover:shadow-xl transition-all duration-300 border border-amber-100/50">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-amber-200 to-amber-300 mb-5">
              <Heart className="w-8 h-8 text-amber-700" />
            </div>
            <h3 className="text-xl font-medium text-amber-900 mb-3">Exclusive Designs</h3>
            <p className="text-amber-700">Limited edition vessels that double as elegant home decor</p>
          </div>
        </div>

        {/* Products Heading */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-serif text-amber-900 mb-6">Our Premium Collection</h2>
          <div className="w-32 h-1 bg-gradient-to-r from-amber-400 via-amber-600 to-amber-300 mx-auto mb-6"></div>
        </div>

        {/* Products Grid with improved cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {productsToShow.map((product: Product) => (
            <motion.div
              key={product.id}
              className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-amber-100"
              whileHover={{ y: -8, scale: 1.02 }}
              transition={{ duration: 0.3 }}
              onClick={() => setSelectedProduct(product)}
            >
              <div className="relative h-72 overflow-hidden">
                <img
                  src={getDriveImage(product.image)}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                />
                <div className="absolute inset-x-0 top-0 bg-gradient-to-b from-black/40 to-transparent h-20" />
                <div className="absolute top-4 left-4">
                  <span className="inline-block bg-amber-800 text-white text-xs px-3 py-1.5 rounded-full font-medium">Premium</span>
                </div>
                <div className="absolute top-4 right-4">
                  <button className="p-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/40 transition-all">
                    <Heart className="w-5 h-5 text-white drop-shadow-lg cursor-pointer hover:text-rose-500 transition-colors" />
                  </button>
                </div>
                {product.stock <= 10 && (
                  <div className="absolute bottom-4 left-4">
                    <span className="inline-block bg-black/60 backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded-full font-medium">
                      Limited Stock: {product.stock}
                    </span>
                  </div>
                )}
              </div>
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-2">{product.name}</h3>
                <div className="flex items-center gap-1 mb-3">
                  <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                  <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                  <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                  <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                  <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                  <span className="text-xs text-gray-500 ml-1">(5.0)</span>
                </div>
                <p className="text-gray-600 text-sm mb-5 line-clamp-2">{product.fragranceNotes?.join(', ')}</p>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-amber-800 font-bold text-lg">₹{product.price}</p>
                    <p className="text-xs text-gray-500">{product.burnTime} burn time</p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddToCart(product);
                    }}
                    className="p-2.5 rounded-full bg-amber-100 hover:bg-amber-800 hover:text-white transition-all shadow-sm"
                  >
                    <ShoppingCart className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Product Modal with enhanced design */}
        {selectedProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={handleClose}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="bg-white rounded-2xl overflow-hidden max-w-5xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="grid grid-cols-1 md:grid-cols-2">
                <div className="relative h-[65vh] md:h-auto bg-amber-50">
                  {/* Premium Badge */}
                  <div className="absolute top-5 left-5 z-10">
                    <span className="inline-block bg-amber-800 text-white text-xs px-4 py-1.5 rounded-full font-medium shadow-md">
                      Premium Collection
                    </span>
                  </div>
                  
                  {/* Image */}
                  <div className="absolute inset-0 flex items-center justify-center p-6">
                    <img
                      src={getCurrentImage(selectedProduct)}
                      alt={selectedProduct.name}
                      className="w-full h-full object-contain shadow-lg"
                    />
                  </div>
                  
                  {/* Navigation Arrows */}
                  {getAdditionalImages(selectedProduct).length > 0 && (
                    <>
                      <button
                        onClick={prevImage}
                        className="absolute left-5 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/90 hover:bg-white shadow-lg transition-all"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute right-5 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/90 hover:bg-white shadow-lg transition-all"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </>
                  )}
                  
                  {/* Image Counter */}
                  {getAdditionalImages(selectedProduct).length > 0 && (
                    <div className="absolute bottom-5 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-sm text-white px-4 py-1.5 rounded-full text-xs font-medium shadow-lg">
                      {currentImageIndex + 1} / {getAdditionalImages(selectedProduct).length + 1}
                    </div>
                  )}
                </div>
                
                <div className="p-10 relative">
                  {/* Close Button */}
                  <button 
                    onClick={handleClose} 
                    className="absolute top-5 right-5 p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                  
                  {/* Product Details */}
                  <div>
                    <h2 className="text-3xl font-serif text-gray-900 mb-3">{selectedProduct.name}</h2>
                    
                    <div className="flex items-center gap-1 mb-4">
                      <Star className="w-5 h-5 fill-amber-500 text-amber-500" />
                      <Star className="w-5 h-5 fill-amber-500 text-amber-500" />
                      <Star className="w-5 h-5 fill-amber-500 text-amber-500" />
                      <Star className="w-5 h-5 fill-amber-500 text-amber-500" />
                      <Star className="w-5 h-5 fill-amber-500 text-amber-500" />
                      <span className="text-sm text-gray-500 ml-1">(5.0)</span>
                    </div>
                    
                    <div className="flex items-center gap-3 mb-6">
                      <span className="text-3xl font-bold text-amber-800">₹{selectedProduct.price}</span>
                      {selectedProduct.stock <= 10 && (
                        <span className="text-xs bg-red-100 text-red-700 px-3 py-1.5 rounded-full font-medium">
                          Only {selectedProduct.stock} left
                        </span>
                      )}
                    </div>
                    
                    <div className="border-t border-gray-100 pt-6 mb-6">
                      <p className="text-gray-700 mb-6 text-lg leading-relaxed">{selectedProduct.description}</p>
                    </div>
                    
                    {/* Product Specs with improved design */}
                    <div className="grid grid-cols-2 gap-4 mb-8">
                      {selectedProduct.fragranceNotes && (
                        <div className="bg-amber-50 p-4 rounded-lg border border-amber-100">
                          <p className="text-sm">
                            <span className="font-medium text-amber-800 block mb-2">Fragrance Notes</span>
                            <span className="text-gray-600">{selectedProduct.fragranceNotes.join(', ')}</span>
                          </p>
                        </div>
                      )}
                      
                      {selectedProduct.burnTime && (
                        <div className="bg-amber-50 p-4 rounded-lg border border-amber-100">
                          <p className="text-sm">
                            <span className="font-medium text-amber-800 block mb-2">Burn Time</span>
                            <span className="text-gray-600">{selectedProduct.burnTime}</span>
                          </p>
                        </div>
                      )}
                      
                      {(selectedProduct.Weight || selectedProduct.weight) && (
                        <div className="bg-amber-50 p-4 rounded-lg border border-amber-100">
                          <p className="text-sm">
                            <span className="font-medium text-amber-800 block mb-2">Weight</span>
                            <span className="text-gray-600">{selectedProduct.Weight || selectedProduct.weight}</span>
                          </p>
                        </div>
                      )}
                      
                      {selectedProduct.ingredients && (
                        <div className="bg-amber-50 p-4 rounded-lg border border-amber-100">
                          <p className="text-sm">
                            <span className="font-medium text-amber-800 block mb-2">Ingredients</span>
                            <span className="text-gray-600">{selectedProduct.ingredients.join(', ')}</span>
                          </p>
                        </div>
                      )}
                    </div>
                    
                    {/* Add to Cart with improved design */}
                    <div className="flex items-center gap-4 mb-8">
                      <div className="flex items-center border rounded-lg shadow-sm overflow-hidden">
                        <button
                          className="px-4 py-2.5 text-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                          onClick={() => setQuantity(q => Math.max(1, q - 1))}
                        >
                          -
                        </button>
                        <span className="w-12 text-center font-medium">{quantity}</span>
                        <button
                          className="px-4 py-2.5 text-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                          onClick={() => setQuantity(q => Math.min(selectedProduct.stock, q + 1))}
                        >
                          +
                        </button>
                      </div>
                      <button
                        onClick={() => {
                          handleAddToCart(selectedProduct, quantity);
                          handleClose();
                        }}
                        className="flex-1 bg-gradient-to-r from-amber-700 to-amber-900 hover:from-amber-800 hover:to-amber-950 text-white font-medium py-3.5 px-6 rounded-lg transition-all flex items-center justify-center gap-2 shadow-lg"
                      >
                        <ShoppingCart size={18} />
                        Add to Cart
                      </button>
                    </div>
                    
                    {/* SKU and Actions with improved alignment */}
                    <div className="flex items-center justify-between border-t border-gray-100 pt-6">
                      <p className="text-sm text-gray-500">SKU: <span className="font-medium">{selectedProduct.sku}</span></p>
                      <div className="flex gap-6">
                        <button className="flex items-center gap-2 text-gray-600 hover:text-amber-800 transition-colors">
                          <Heart size={18} />
                          <span className="text-sm font-medium">Wishlist</span>
                        </button>
                        <button className="flex items-center gap-2 text-gray-600 hover:text-amber-800 transition-colors">
                          <Share2 size={18} />
                          <span className="text-sm font-medium">Share</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default PremiumCandles;