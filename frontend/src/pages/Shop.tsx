import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, X, ShoppingCart, ChevronLeft, ChevronRight, Star, Heart, Share2, Truck, Package, ShieldCheck } from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import { getDriveImage } from '../utils/driveImage';
import { useProductStore } from '../store/productStore';
import { useNavigate } from 'react-router-dom';
import ProductImageCarousel from '../components/ProductImageCarousel';
import { getProductImageUrls } from '../utils/productImages';

const Shop = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCartStore();
  const { products, loading, fetchProducts } = useProductStore();
  const navigate = useNavigate();

  // Fetch products on mount
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const categories = useMemo(() => {
    const uniqueCategories = Array.from(
      new Set(products.map((product) => product.category).filter(Boolean))
    );
    return ['All', ...uniqueCategories];
  }, [products]);

  const handleAddToCart = (product, qty = 1) => {
    addItem({...product, quantity: qty});
  };

  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      selectedCategory === 'All' || product.category === selectedCategory;
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Function to get additional images, handling both property names
  const getAdditionalImages = (product) => {
    if (product?.additionalImages) {
      return product.additionalImages;
    } 
    if (product?.addtionalImages) { // Handle typo in some products
      return product.addtionalImages;
    }
    return [];
  };

  const nextImage = (e) => {
    e.stopPropagation();
    const images = getAdditionalImages(selectedProduct);
    if (images.length === 0) return;
    
    const totalImages = images.length + 1; // +1 for main image
    setCurrentImageIndex((prev) => (prev + 1) % totalImages);
  };

  const prevImage = (e) => {
    e.stopPropagation();
    const images = getAdditionalImages(selectedProduct);
    if (images.length === 0) return;
    
    const totalImages = images.length + 1;
    setCurrentImageIndex((prev) => (prev - 1 + totalImages) % totalImages);
  };

  const getCurrentImage = () => {
    if (!selectedProduct) return '';
    
    // Get the additionalImages array or empty array if not present
    const images = getAdditionalImages(selectedProduct);
    
    if (currentImageIndex === 0 || images.length === 0) {
      return selectedProduct.image;
    }
    
    return images[currentImageIndex - 1];
  };

  // Determine if we should show navigation arrows
  const shouldShowNavigation = (product) => {
    return getAdditionalImages(product).length > 0;
  };

  // Reset image index and quantity when product changes
  React.useEffect(() => {
    setCurrentImageIndex(0);
    setQuantity(1);
  }, [selectedProduct]);

  return (
    <div className="min-h-screen pt-20 bg-[#FFF8F2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl font-serif text-[#5A4232] mb-8 text-center">
            Our Collection
          </h1>

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div className="relative">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#F5E9DA] text-[#5A4232] hover:bg-[#e8d9c5] transition"
              >
                <Filter className="w-4 h-4" />
                {selectedCategory === 'All' ? 'All Filters' : selectedCategory}
              </button>
              {showFilters && (
                <div className="absolute mt-3 z-10 w-[300px] sm:w-[500px] md:w-[700px] lg:w-[900px] p-4 rounded-xl backdrop-blur-md bg-[#5A4232]/30 shadow-xl">
                  <h2 className="text-lg font-serif text-white mb-4">Select a Category</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2 max-h-[300px] overflow-y-auto">
                    {categories.map((category) => (
                      <button
                        key={category}
                        onClick={() => {
                          setSelectedCategory(category);
                          setShowFilters(false);
                        }}
                        className={`text-sm px-3 py-2 rounded-full transition ${
                          selectedCategory === category
                            ? 'bg-white text-[#5A4232]'
                            : 'bg-white/20 text-[#5A4232] hover:bg-white/30'
                        }`}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={() => navigate('/special-occult-candles')}
              className="px-4 py-2 bg-[#3E2A1F] text-white rounded-full hover:bg-[#5A4232] transition"
            >
              Special Occult Candles
            </button>

            <div className="relative w-full sm:w-1/2">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#C9A66B] focus:border-transparent"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <motion.div
                key={product.id}
                className="bg-white rounded-xl overflow-hidden shadow hover:shadow-md cursor-pointer transition-all"
                whileHover={{ scale: 1.02 }}
                onClick={() => setSelectedProduct(product)}
              >
                <ProductImageCarousel
                  images={getProductImageUrls(product)}
                  alt={product.name}
                  className="h-60"
                  showThumbnails={false}
                  onImageClick={() => setSelectedProduct(product)}
                />
                <div className="p-4">
                  <h3 className="text-xl font-serif text-[#5A4232] font-semibold mb-1">{product.name}</h3>
                  <p className="text-sm text-[#6B5849] mb-2">{product.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-base font-semibold text-[#C9A66B]">₹{product.price}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddToCart(product);
                      }}
                      className="bg-[#5A4232] text-white text-sm px-4 py-1 rounded-full hover:bg-[#7a5b45] transition"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      <AnimatePresence>
        {selectedProduct && (
          <motion.div
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center px-4 overflow-y-auto py-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedProduct(null)}
          >
            <motion.div
              className="bg-gradient-to-br from-white to-[#F9F4EF] rounded-2xl w-full max-w-4xl relative shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] overflow-hidden border border-[#E6DFD7]"
              initial={{ scale: 0.9, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#F5E9DA]/30 rounded-full -translate-y-1/2 translate-x-1/4"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#F5E9DA]/20 rounded-full translate-y-1/2 -translate-x-1/3"></div>
              
              <button
                onClick={() => setSelectedProduct(null)}
                className="absolute top-3 right-3 text-[#5A4232] hover:text-black z-10 bg-white/80 hover:bg-white rounded-full p-1.5 shadow-md transition-all duration-300"
              >
                <X className="w-4 h-4" strokeWidth={2.5} />
              </button>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
                {/* Image Gallery Section with gradient overlay */}
                <div className="relative bg-gradient-to-b from-[#F5E9DA]/20 to-[#F5E9DA]/10 p-5">
                  <div className="relative h-[280px] sm:h-[350px] rounded-lg overflow-hidden bg-white/50 shadow-inner">
                    <motion.img
                      key={currentImageIndex}
                      src={getDriveImage(getCurrentImage())}
                      alt={selectedProduct.name}
                      className="w-full h-full object-contain p-4"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    />
                    
                    {shouldShowNavigation(selectedProduct) && (
                      <>
                        <button
                          onClick={prevImage}
                          className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-1.5 shadow-md transition-all hover:shadow-lg"
                        >
                          <ChevronLeft className="w-4 h-4 text-[#5A4232]" />
                        </button>
                        <button
                          onClick={nextImage}
                          className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-1.5 shadow-md transition-all hover:shadow-lg"
                        >
                          <ChevronRight className="w-4 h-4 text-[#5A4232]" />
                        </button>
                      </>
                    )}
                    
                    {/* Product badge */}
                    <div className="absolute top-3 left-3 bg-[#C9A66B] text-white text-xs font-medium px-2.5 py-0.5 rounded-full shadow-md">
                      Bestseller
                    </div>
                  </div>

                  {/* Thumbnail Gallery - show for any product with images */}
                  {getAdditionalImages(selectedProduct).length > 0 && (
                    <div className="flex mt-3 space-x-2 justify-center">
                      <div 
                        className={`w-[50px] h-[50px] rounded-md overflow-hidden border-2 cursor-pointer shadow-sm hover:shadow transition-all ${
                          currentImageIndex === 0 ? 'border-[#C9A66B] ring-2 ring-[#C9A66B]/30' : 'border-white'
                        }`}
                        onClick={() => setCurrentImageIndex(0)}
                      >
                        <img 
                          src={getDriveImage(selectedProduct.image)} 
                          alt="thumbnail" 
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {getAdditionalImages(selectedProduct).map((img, i) => (
                        <div 
                          key={i} 
                          className={`w-[50px] h-[50px] rounded-md overflow-hidden border-2 cursor-pointer shadow-sm hover:shadow transition-all ${
                            currentImageIndex === i + 1 ? 'border-[#C9A66B] ring-2 ring-[#C9A66B]/30' : 'border-white'
                          }`}
                          onClick={() => setCurrentImageIndex(i + 1)}
                        >
                          <img 
                            src={getDriveImage(img)} 
                            alt={`thumbnail ${i + 1}`} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Product Info Section */}
                <div className="flex flex-col p-5 md:p-6 bg-white/60">
                  <div className="mb-4 flex items-start justify-between">
                    <div>
                      <h2 className="text-2xl font-serif font-bold text-[#5A4232] mb-1 leading-tight">
                        {selectedProduct.name}
                      </h2>
                      <div className="flex items-center mb-1">
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className="w-3.5 h-3.5 mr-0.5"
                              fill="#FFD700"
                              color="#FFD700"
                            />
                          ))}
                        </div>
                        <span className="text-xs ml-1.5 text-gray-500 font-medium">(32 reviews)</span>
                      </div>
                    </div>
                    <div className="flex space-x-1">
                      <button className="p-1.5 rounded-full hover:bg-[#F5E9DA] transition-all group">
                        <Heart className="w-4 h-4 text-gray-400 group-hover:text-[#C9A66B] transition-colors" />
                      </button>
                      <button className="p-1.5 rounded-full hover:bg-[#F5E9DA] transition-all group">
                        <Share2 className="w-4 h-4 text-gray-400 group-hover:text-[#C9A66B] transition-colors" />
                      </button>
                    </div>
                  </div>

                  <div className="flex items-baseline mb-3">
                    <div className="text-2xl font-bold text-[#C9A66B]">
                      ₹{selectedProduct.price}
                    </div>
                    <div className="ml-2 text-xs text-gray-500 line-through">₹{(selectedProduct.price * 1.2).toFixed(0)}</div>
                    <div className="ml-1.5 text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full font-medium">
                      20% OFF
                    </div>
                  </div>

                  <div className="prose prose-sm text-gray-600 mb-3 leading-relaxed text-sm max-h-16 overflow-y-auto">
                    <p>{selectedProduct.description}</p>
                  </div>

                  <div className="space-y-2 mb-4 bg-[#F9F4EF] p-3 rounded-lg text-sm">
                    <div className="flex">
                      <span className="w-1/3 font-medium text-[#5A4232]">Category:</span>
                      <span className="text-gray-800">{selectedProduct.category}</span>
                    </div>
                    {selectedProduct.fragranceNotes && (
                      <div className="flex">
                        <span className="w-1/3 font-medium text-[#5A4232]">Fragrance:</span>
                        <span className="text-gray-800">{selectedProduct.fragranceNotes.join(', ')}</span>
                      </div>
                    )}
                    {selectedProduct.burnTime && (
                      <div className="flex">
                        <span className="w-1/3 font-medium text-[#5A4232]">Burn Time:</span>
                        <span className="text-gray-800">{selectedProduct.burnTime}</span>
                      </div>
                    )}
                    <div className="flex">
                      <span className="w-1/3 font-medium text-[#5A4232]">Availability:</span>
                      <span className="text-green-600 font-medium flex items-center">
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full inline-block mr-1"></span>
                        In Stock
                      </span>
                    </div>
                  </div>

                  {/* Benefits section */}
                  <div className="flex justify-between mb-4 border-y border-gray-100 py-2.5">
                    <div className="flex items-center text-xs text-gray-600">
                      <Truck className="w-3.5 h-3.5 mr-1 text-[#5A4232]" />
                      <span>Free Delivery</span>
                    </div>
                    <div className="flex items-center text-xs text-gray-600">
                      <Package className="w-3.5 h-3.5 mr-1 text-[#5A4232]" />
                      <span>Premium Box</span>
                    </div>
                    <div className="flex items-center text-xs text-gray-600">
                      <ShieldCheck className="w-3.5 h-3.5 mr-1 text-[#5A4232]" />
                      <span>Quality Assured</span>
                    </div>
                  </div>

                  <div className="mb-4">
                    <h3 className="font-medium text-[#5A4232] mb-2 text-xs uppercase tracking-wider">Additional Features</h3>
                    <ul className="text-xs text-gray-700 grid grid-cols-2 gap-1.5">
                      <li className="flex items-center">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#C9A66B] mr-1.5"></span>
                        Premium quality materials
                      </li>
                      <li className="flex items-center">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#C9A66B] mr-1.5"></span>
                        Hand-poured in small batches
                      </li>
                      <li className="flex items-center">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#C9A66B] mr-1.5"></span>
                        Eco-friendly & sustainable
                      </li>
                      <li className="flex items-center">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#C9A66B] mr-1.5"></span>
                        Perfect for gifting
                      </li>
                    </ul>
                  </div>

                  <div className="mt-auto flex flex-col space-y-3">
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center border border-gray-200 rounded-md overflow-hidden shadow-sm">
                        <button 
                          className="px-2 py-1.5 text-[#5A4232] hover:bg-[#F5E9DA] transition-colors"
                          onClick={() => setQuantity(prev => Math.max(prev - 1, 1))}
                        >
                          <span className="font-bold">−</span>
                        </button>
                        <span className="px-3 py-1.5 border-x border-gray-200 font-medium text-gray-800 w-9 text-center text-sm">{quantity}</span>
                        <button 
                          className="px-2 py-1.5 text-[#5A4232] hover:bg-[#F5E9DA] transition-colors"
                          onClick={() => setQuantity(prev => prev + 1)}
                        >
                          <span className="font-bold">+</span>
                        </button>
                      </div>
                      
                      <button
                        onClick={() => handleAddToCart(selectedProduct, quantity)}
                        className="flex-1 bg-gradient-to-r from-[#5A4232] to-[#6B5344] text-white py-2 px-4 rounded-md hover:shadow-md transition-all duration-300 flex items-center justify-center gap-1.5 font-medium text-sm"
                      >
                        <ShoppingCart className="w-4 h-4" />
                        Add to Cart
                      </button>
                    </div>
                    
                    <button 
                      onClick={() => {
                        setSelectedProduct(null);
                        navigate('/custom-order');
                      }}
                      className="w-full border border-[#C9A66B] text-[#C9A66B] hover:bg-[#C9A66B]/10 py-2 px-4 rounded-md transition-colors flex items-center justify-center gap-1.5 font-medium text-sm"
                    >
                      <svg 
                        className="w-4 h-4" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24" 
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth={2} 
                          d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" 
                        />
                      </svg>
                      Create Custom Order
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Shop;




