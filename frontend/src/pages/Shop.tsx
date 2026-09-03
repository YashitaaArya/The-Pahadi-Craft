import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, ShoppingCart, ChevronLeft, ChevronRight, Star, Heart, Share2, Truck, Package, ShieldCheck } from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import { getDriveImage } from '../utils/driveImage';
import { useProductStore } from '../store/productStore';
import { useNavigate, useSearchParams } from 'react-router-dom';
import ProductImageCarousel from '../components/ProductImageCarousel';
import { getProductImageUrls } from '../utils/productImages';
import { showCartNotification } from '../components/admin/common';
import { Product, ProductColorVariant, ProductFragranceVariant } from '../types';
import { useAuthStore } from '../store/authStore';
import { getLikedProductIds, toggleProductLike } from '../api/adminApi';

// Fixed top-level categories - matches backend/config/categories.js exactly.
const MAIN_CATEGORIES = [
  'Candles',
  'Resin, Concrete, Wax & Wooden Artifacts',
  'Cleansing, Healing & Wellness',
  'Spell & Occult Products',
  'Room Fragrances',
  'Seven Chakra Range',
  'Gifting & Gift Hampers',
  'Festival Hampers',
  'Manufacturing & Branding',
];

const Shop = () => {
  const [searchParams] = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedSubFilter, setSelectedSubFilter] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedColorVariant, setSelectedColorVariant] = useState<ProductColorVariant | null>(null);
  const [selectedFragranceVariant, setSelectedFragranceVariant] = useState<ProductFragranceVariant | null>(null);
  const [sortBy, setSortBy] = useState<'name' | 'price' | 'popularity'>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const { addItem } = useCartStore();
  const { products, fetchProducts } = useProductStore();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [likedProductIds, setLikedProductIds] = useState<Set<string>>(new Set());
  const [subcategoriesByCategory, setSubcategoriesByCategory] = useState<Record<string, string[]>>({});
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);

  useEffect(() => {
    if (user) {
      getLikedProductIds(user.uid)
        .then((ids) => setLikedProductIds(new Set(ids)))
        .catch(() => setLikedProductIds(new Set()));
    } else {
      setLikedProductIds(new Set());
    }
  }, [user]);

  const handleToggleLike = async (productId: string) => {
    if (!user) {
      navigate('/auth');
      return;
    }
    // Optimistic update
    setLikedProductIds((prev) => {
      const next = new Set(prev);
      if (next.has(productId)) next.delete(productId);
      else next.add(productId);
      return next;
    });
    try {
      await toggleProductLike(user.uid, productId);
    } catch {
      // Revert on failure
      setLikedProductIds((prev) => {
        const next = new Set(prev);
        if (next.has(productId)) next.delete(productId);
        else next.add(productId);
        return next;
      });
    }
  };

  const handleShare = async (product: Product) => {
    const url = `${window.location.origin}/shop?product=${product.id}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: product.name, text: `Check out ${product.name} on Pahadi Craft`, url });
        return;
      } catch {
        // user cancelled or share failed - fall through to clipboard
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      alert('Link copied to clipboard!');
    } catch {
      // ignore - nothing more we can do without clipboard permission
    }
  };

  // Fetch products on mount
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Fetch subcategory suggestions grouped per main category, for the
  // Flipkart-style tab-then-subcategory-chips filter UI below.
  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'}/products/categories`)
      .then((res) => setSubcategoriesByCategory(res.data.subcategoriesByCategory || {}))
      .catch(() => setSubcategoriesByCategory({}));
  }, []);

  // Pre-select a category when arriving via a link like /shop?category=Candles
  // (used by the homepage Collections cards).
  useEffect(() => {
    const categoryParam = searchParams.get('category');
    if (categoryParam && MAIN_CATEGORIES.includes(categoryParam)) {
      setSelectedCategory(categoryParam);
    }
    const searchParam = searchParams.get('q');
    if (searchParam) {
      setSearchQuery(searchParam);
    }
  }, [searchParams]);

  // Opens the specific product's modal when arriving via a shared /shop?product=<id> link
  useEffect(() => {
    const productId = searchParams.get('product');
    if (productId && products.length > 0) {
      const match = products.find((p) => p.id === productId);
      if (match) setSelectedProduct(match);
    }
  }, [searchParams, products]);

  const handleAddToCart = (product: Product, qty = 1) => {
    if ((product.colorVariants ?? []).length > 0 && !selectedColorVariant) {
      alert('Please choose a color before adding this product to your cart.');
      return;
    }
    if ((product.fragranceVariants ?? []).length > 0 && !selectedFragranceVariant) {
      alert('Please choose a fragrance before adding this product to your cart.');
      return;
    }
    addItem({
      ...product,
      selectedColorVariant: selectedColorVariant || undefined,
      selectedFragranceVariant: selectedFragranceVariant || undefined,
    }, qty);
    showCartNotification(product.name);
  };

  const filteredProducts = products.filter((product) => {
    const productCategory = product.mainCategory || product.category;
    const matchesCategory =
      selectedCategory === 'All' || productCategory === selectedCategory;
    const matchesSubFilter =
      !selectedSubFilter || product.primeSubcategory === selectedSubFilter;
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSubFilter && matchesSearch;
  }).sort((a, b) => {
    let compareValue = 0;
    
    if (sortBy === 'name') {
      compareValue = a.name.localeCompare(b.name);
    } else if (sortBy === 'price') {
      compareValue = (a.price || 0) - (b.price || 0);
    } else if (sortBy === 'popularity') {
      // Sort by review count (popularity metric)
      compareValue = (b.reviewCount || 0) - (a.reviewCount || 0);
    }
    
    return sortDirection === 'asc' ? compareValue : -compareValue;
  });

  // Function to get additional images, handling both property names
  const getAdditionalImages = (product: Product | null) => {
    if (product?.additionalImages) {
      return product.additionalImages;
    } 
    if (product?.addtionalImages) { // Handle typo in some products
      return product.addtionalImages;
    }
    return [];
  };

  const nextImage = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    const images = getAdditionalImages(selectedProduct);
    if (images.length === 0) return;
    
    const totalImages = images.length + 1; // +1 for main image
    setCurrentImageIndex((prev) => (prev + 1) % totalImages);
  };

  const prevImage = (e: React.MouseEvent<HTMLButtonElement>) => {
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
  const shouldShowNavigation = (product: Product) => {
    return getAdditionalImages(product).length > 0;
  };

  // Reset image index and quantity when product changes
  React.useEffect(() => {
    setCurrentImageIndex(0);
    setQuantity(1);
    setSelectedColorVariant(null);
    setSelectedFragranceVariant(null);
  }, [selectedProduct]);

  // Get subcategories for current category that have at least one product
  const getFilteredSubcategoriesForCategory = (category: string): string[] => {
    const allSubs = subcategoriesByCategory[category] || [];
    return allSubs.filter(sub => 
      products.some(p => (p.mainCategory || p.category) === category && p.primeSubcategory === sub)
    );
  };

  const filteredSubcategories = selectedCategory !== 'All' ? getFilteredSubcategoriesForCategory(selectedCategory) : [];

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

          {/* Category tab bar - equal sized tabs in a single line */}
          <div className="mb-6 -mx-4 px-4 sm:mx-0 sm:px-0 overflow-x-auto">
            <div className="flex gap-1 min-w-max sm:min-w-0 sm:flex-wrap sm:gap-2">
              <button
                onClick={() => { setSelectedCategory('All'); setSelectedSubFilter(null); setIsFilterDropdownOpen(false); }}
                className={`flex-1 min-w-max sm:min-w-0 text-sm sm:text-base font-semibold px-2 sm:px-4 py-3 sm:py-3.5 rounded-full transition whitespace-nowrap ${
                  selectedCategory === 'All'
                    ? 'bg-white text-[#5A4232] border-2 border-[#5A4232]'
                    : 'bg-[#3E2A1F] text-white hover:bg-[#5A4232]'
                }`}
              >
                All
              </button>
              {MAIN_CATEGORIES.map((category) => (
                <button
                  key={category}
                  onClick={() => {
                    setSelectedCategory(category);
                    setSelectedSubFilter(null);
                    setIsFilterDropdownOpen(false);
                  }}
                  className={`flex-1 min-w-max sm:min-w-0 text-sm sm:text-base font-semibold px-2 sm:px-4 py-3 sm:py-3.5 rounded-full transition whitespace-nowrap overflow-hidden text-ellipsis ${
                    selectedCategory === category
                      ? 'bg-white text-[#5A4232] border-2 border-[#5A4232]'
                      : 'bg-[#3E2A1F] text-white hover:bg-[#5A4232]'
                  }`}
                  title={category}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Filter dropdown for subcategories */}
          <AnimatePresence>
            {selectedCategory !== 'All' && filteredSubcategories.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-6 relative"
              >
                <div className="relative inline-block">
                  <button
                    onClick={() => setIsFilterDropdownOpen(!isFilterDropdownOpen)}
                    className="flex items-center gap-2 px-4 py-2 rounded-full border border-[#C9A66B] text-[#5A4232] font-medium text-sm hover:bg-[#C9A66B]/10 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                    </svg>
                    Filter by Collection
                    <svg className={`w-4 h-4 transition-transform ${isFilterDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                  </button>

                  {isFilterDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full left-0 mt-2 bg-white border border-[#E6DFD7] rounded-lg shadow-lg z-10 min-w-max"
                    >
                      <button
                        onClick={() => {
                          setSelectedSubFilter(null);
                          setIsFilterDropdownOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                          !selectedSubFilter
                            ? 'bg-[#C9A66B] text-white font-medium'
                            : 'text-[#5A4232] hover:bg-[#F5E9DA]'
                        }`}
                      >
                        All {selectedCategory}
                      </button>
                      {filteredSubcategories.map((sub) => (
                        <button
                          key={sub}
                          onClick={() => {
                            setSelectedSubFilter(sub);
                            setIsFilterDropdownOpen(false);
                          }}
                          className={`w-full text-left px-4 py-2 text-sm border-t border-[#E6DFD7] transition-colors ${
                            selectedSubFilter === sub
                              ? 'bg-[#C9A66B] text-white font-medium'
                              : 'text-[#5A4232] hover:bg-[#F5E9DA]'
                          }`}
                        >
                          {sub}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex flex-col sm:flex-row gap-4 mb-8 justify-between items-start sm:items-center">
            {/* Search bar */}
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

            {/* Sort controls */}
            <div className="flex gap-3 w-full sm:w-auto">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'name' | 'price' | 'popularity')}
                className="px-4 py-2 rounded-full border border-gray-200 bg-white text-[#5A4232] font-medium text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A66B] cursor-pointer hover:border-[#C9A66B]"
              >
                <option value="name">Name</option>
                <option value="price">Price</option>
                <option value="popularity">Popularity</option>
              </select>
              
              <button
                onClick={() => setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')}
                className={`px-4 py-2 rounded-full font-medium text-sm transition ${
                  sortDirection === 'asc'
                    ? 'bg-[#C9A66B] text-white'
                    : 'bg-gray-200 text-[#5A4232] hover:bg-gray-300'
                }`}
                title={sortDirection === 'asc' ? 'Ascending' : 'Descending'}
              >
                {sortDirection === 'asc' ? '↑' : '↓'}
              </button>
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
                <div className="relative">
                  <ProductImageCarousel
                    images={getProductImageUrls(product)}
                    alt={product.name}
                    className="h-60"
                    showThumbnails={false}
                    onImageClick={() => setSelectedProduct(product)}
                  />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleLike(product.id);
                    }}
                    className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/90 shadow flex items-center justify-center hover:bg-white transition-colors"
                    title={user ? 'Like this product' : 'Sign in to like this product'}
                  >
                    <Heart
                      className={`w-4 h-4 transition-colors ${
                        likedProductIds.has(product.id) ? 'text-red-500 fill-red-500' : 'text-gray-400'
                      }`}
                    />
                  </button>
                </div>
                <div className="p-4">
                  <h3 className="text-xl font-serif text-[#5A4232] font-semibold mb-1">{product.name}</h3>
                  <p className="text-sm text-[#6B5849] mb-2 truncate">{product.description}</p>
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
              className="bg-gradient-to-br from-white to-[#F9F4EF] rounded-2xl w-full max-w-4xl max-h-[90vh] relative shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] overflow-y-auto overflow-x-hidden border border-[#E6DFD7]"
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
                      className="w-full h-full object-cover"
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
                        <span className="text-xs ml-1.5 text-gray-500 font-medium">
                          {selectedProduct.reviewCount ? `(${selectedProduct.reviewCount} reviews)` : 'No reviews yet'}
                        </span>
                      </div>
                    </div>
                    <div className="flex space-x-1">
                      <button
                        onClick={() => handleToggleLike(selectedProduct.id)}
                        className="p-1.5 rounded-full hover:bg-[#F5E9DA] transition-all group"
                        title={user ? 'Like this product' : 'Sign in to like this product'}
                      >
                        <Heart
                          className={`w-4 h-4 transition-colors ${
                            likedProductIds.has(selectedProduct.id)
                              ? 'text-red-500 fill-red-500'
                              : 'text-gray-400 group-hover:text-[#C9A66B]'
                          }`}
                        />
                      </button>
                      <button
                        onClick={() => handleShare(selectedProduct)}
                        className="p-1.5 rounded-full hover:bg-[#F5E9DA] transition-all group"
                        title="Share this product"
                      >
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
                      <span className="text-gray-800">{selectedProduct.mainCategory || selectedProduct.category}</span>
                    </div>
                    {selectedProduct.primeSubcategory && (
                      <div className="flex">
                        <span className="w-1/3 font-medium text-[#5A4232]">Collection:</span>
                        <span className="text-gray-800">{selectedProduct.primeSubcategory}</span>
                      </div>
                    )}
                    {selectedProduct.secondarySubcategory && (
                      <div className="flex">
                        <span className="w-1/3 font-medium text-[#5A4232]">Type:</span>
                        <span className="text-gray-800">{selectedProduct.secondarySubcategory}</span>
                      </div>
                    )}
                    {(selectedProduct.fragranceNotes ?? []).length > 0 && (
                      <div className="flex">
                        <span className="w-1/3 font-medium text-[#5A4232]">Notes:</span>
                        <span className="text-gray-800">{(selectedProduct.fragranceNotes ?? []).join(', ')}</span>
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

                  <div className="grid grid-cols-2 gap-2 mb-4 text-xs">
                    {selectedProduct.size && <div className="rounded-md bg-white border border-[#E6DFD7] p-2"><strong className="block text-[#5A4232]">Size</strong>{selectedProduct.size}</div>}
                    {selectedProduct.material && <div className="rounded-md bg-white border border-[#E6DFD7] p-2"><strong className="block text-[#5A4232]">Material</strong>{selectedProduct.material}</div>}
                    {selectedProduct.volume && <div className="rounded-md bg-white border border-[#E6DFD7] p-2"><strong className="block text-[#5A4232]">Capacity</strong>{selectedProduct.volume}</div>}
                    {(selectedProduct.Weight || selectedProduct.weight) && <div className="rounded-md bg-white border border-[#E6DFD7] p-2"><strong className="block text-[#5A4232]">Weight</strong>{selectedProduct.Weight || selectedProduct.weight}</div>}
                    <div className="rounded-md bg-white border border-[#E6DFD7] p-2"><strong className="block text-[#5A4232]">Items</strong>{selectedProduct.numberOfItems ?? 1} per pack</div>
                    <div className="rounded-md bg-white border border-[#E6DFD7] p-2"><strong className="block text-[#5A4232]">Stock</strong>{selectedProduct.stock} available</div>
                  </div>

                  <div className="space-y-2 mb-4 text-xs text-gray-700">
                    {(selectedProduct.ingredients ?? []).length > 0 && (
                      <div><strong className="text-[#5A4232]">Ingredients:</strong> {(selectedProduct.ingredients ?? []).join(', ')}</div>
                    )}
                    {selectedProduct.artisanInfo && (
                      <div><strong className="text-[#5A4232]">Artisan information:</strong> {selectedProduct.artisanInfo}</div>
                    )}
                    {(selectedProduct.tags ?? []).length > 0 && (
                      <div className="flex flex-wrap items-center gap-1.5">
                        <strong className="text-[#5A4232]">Tags:</strong>
                        {(selectedProduct.tags ?? []).map((tag) => <span key={tag} className="rounded-full bg-[#F5E9DA] px-2 py-0.5">{tag}</span>)}
                      </div>
                    )}
                    <div className="flex flex-wrap gap-2">
                      {selectedProduct.scented && <span className="rounded-full bg-purple-50 text-purple-700 px-2 py-0.5">Scented</span>}
                      {selectedProduct.featured && <span className="rounded-full bg-yellow-100 text-yellow-800 px-2 py-0.5">Featured</span>}
                      {selectedProduct.trending && <span className="rounded-full bg-blue-100 text-blue-800 px-2 py-0.5">Trending</span>}
                      {selectedProduct.discount ? <span className="rounded-full bg-green-100 text-green-800 px-2 py-0.5">{selectedProduct.discount}% discount</span> : null}
                    </div>
                  </div>

                  {(selectedProduct.colorVariants ?? []).length > 0 && (
                    <div className="mb-4">
                      <h3 className="font-medium text-[#5A4232] mb-2 text-xs uppercase tracking-wider">Choose Color</h3>
                      <div className="flex flex-wrap gap-2">
                        {(selectedProduct.colorVariants ?? []).map((variant) => (
                          <button
                            key={`${variant.colorName}-${variant.sku}`}
                            type="button"
                            disabled={variant.stock <= 0}
                            onClick={() => setSelectedColorVariant(variant)}
                            title={`${variant.colorName}${variant.stock <= 0 ? ' - Out of stock' : ''}`}
                            className={`flex items-center gap-1.5 rounded-full border px-2 py-1 text-xs ${selectedColorVariant === variant ? 'border-[#5A4232] ring-2 ring-[#C9A66B]/40' : 'border-gray-200'} ${variant.stock <= 0 ? 'opacity-40 cursor-not-allowed' : ''}`}
                          >
                            <span className="w-4 h-4 rounded-full border border-gray-300" style={{ backgroundColor: variant.hexCode }} />
                            {variant.colorName}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {((selectedProduct.fragranceVariants ?? []).length > 0 || (selectedProduct.fragranceNotes ?? []).length > 0) && (
                    <div className="mb-4">
                      <h3 className="font-medium text-[#5A4232] mb-2 text-xs uppercase tracking-wider">Choose Fragrance</h3>
                      <div className="flex flex-wrap gap-2">
                        {(selectedProduct.fragranceVariants ?? []).map((variant) => (
                          <button
                            key={`${variant.fragranceName}-${variant.sku}`}
                            type="button"
                            disabled={variant.stock <= 0}
                            onClick={() => setSelectedFragranceVariant(variant)}
                            className={`rounded-full border px-3 py-1 text-xs ${selectedFragranceVariant === variant ? 'border-[#5A4232] bg-[#F5E9DA]' : 'border-gray-200'} ${variant.stock <= 0 ? 'opacity-40 cursor-not-allowed' : ''}`}
                          >
                            {variant.fragranceName}
                          </button>
                        ))}
                        {!(selectedProduct.fragranceVariants ?? []).length && (selectedProduct.fragranceNotes ?? []).map((note) => (
                          <span key={note} className="rounded-full border border-gray-200 px-3 py-1 text-xs">{note}</span>
                        ))}
                      </div>
                    </div>
                  )}

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