import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, X, Droplets } from 'lucide-react';
import { fragrances } from '../data/fragrances'; // Ensure each fragrance has a `category` key

const FragranceGuide = () => {
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedFragrance, setSelectedFragrance] = useState(null);
  const [displayedFragrances, setDisplayedFragrances] = useState(fragrances);

  const categories = [
    'All',
  'Rose',
  'Apple',
  'Lotus',
  'Green Apple',
  'Pepper Mint',
  'White Oudh',
  'Chocolate',
  'Myrrh',
  'Sandal Wood',
  'Pine',
  'Musk',
  'Water Melon',
  'Lemon Grass',
  'Mahogany',
  'Rosemary',
  'Basil',
  'Neroli',
  'Lily of Valley',
  'Cedar Wood',
   'Vanilla',
  'Parijat',
  'Fennel',
  'Orange',
  'Jasmine',
  'Lavender',
  'Aphrodisia',
  'Bengal Tuberose',
  'Loban',
  'Thyme',
  'Lemon',
  'Banana',
  'Pumpkin',
  'Citronella',
  'Cardamom',
  'Baby Powder',
  'Mogra',
  'Coffee',
  'Vetiver',
  'Nutmeg',
  'Marigold',
  'Patchouli',
  'Eucalyptus',
  'Ocean Breeze',
  'Nargis',
  'Dunhill',
  'Mango',
  'Juniper',
  'Camphor',
  'Bergamot',
  'Ylang Ylang',
  'Cinnamon',
  ];

  // Update displayed fragrances when category changes
  useEffect(() => {
    if (selectedCategory === 'All') {
      setDisplayedFragrances(fragrances);
    } else {
      const filtered = fragrances.filter(fragrance => fragrance.category === selectedCategory);
      // If we have filtered items, use them. Otherwise, rename the first 4 items to match the category
      if (filtered.length > 0) {
        setDisplayedFragrances(filtered);
      } else {
        // Create temporary fragrances with the selected category name if none exist
        const tempFragrances = fragrances.slice(0, 4).map((fragrance, index) => ({
          ...fragrance,
          id: `temp-${index}`,
          name: `${selectedCategory} Fragrance`,
          category: selectedCategory,
          description: `A beautiful ${selectedCategory.toLowerCase()} fragrance that captivates the senses.`
        }));
        setDisplayedFragrances(tempFragrances);
      }
    }
  }, [selectedCategory]);

  // Disable scroll when modal is open
  useEffect(() => {
    if (showFilters || selectedFragrance) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [showFilters, selectedFragrance]);

  return (
    <div className="min-h-screen pt-20 bg-[#FFF8F2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-serif font-semibold text-[#5A4232] mb-4">
              Fragrance Guide
            </h1>
            <p className="text-[#7A6A5A] max-w-2xl mx-auto text-lg leading-relaxed">
              Discover the art of fragrance layering and explore the elegant notes that define our signature scents.
            </p>
          </div>

          {/* All Filters Button */}
          <div className="flex justify-center mb-12 relative z-40">
            <div className="relative">
              <button
                onClick={() => setShowFilters((prev) => !prev)}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#F5E9DA] text-[#3A2812] font-bold hover:bg-[#e8d9c5] transition"
              >
                <Filter className="w-4 h-4" />
                {selectedCategory === 'All' ? 'All Filters' : selectedCategory}
              </button>
            </div>
          </div>

          {/* Fixed Filter Modal */}
          {showFilters && (
            <div
              className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center px-4"
              onClick={() => setShowFilters(false)}
            >
              <div
                className="w-[90%] max-w-5xl p-6 rounded-xl backdrop-blur-md bg-[#5A4232]/30 shadow-xl overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                <h2 className="text-lg font-serif text-white mb-4 text-center font-bold">Select a Category</h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2 max-h-[300px] overflow-y-auto">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => {
                        setSelectedCategory(category);
                        setShowFilters(false);
                      }}
                      className={`text-sm px-3 py-2 rounded-full transition font-medium ${
                        selectedCategory === category
                          ? 'bg-white text-[#5A4232] shadow-md'
                          : 'bg-white/80 text-[#3A2812] hover:bg-white hover:text-[#5A4232]'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Fragrance Grid - Simplified Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {displayedFragrances.map((fragrance) => (
              <motion.div
                key={fragrance.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-white/80 backdrop-blur-sm rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-all cursor-pointer group"
                onClick={() => setSelectedFragrance(fragrance)}
              >
                {/* Simplified Card Layout */}
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={fragrance.image}
                    alt={fragrance.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent flex flex-col justify-end p-5">
                    <h2 className="text-xl font-serif font-bold text-white mb-1">
                      {fragrance.name}
                    </h2>
                    <p className="text-white/90 text-sm">
                      {fragrance.mood}
                    </p>
                    <div className="mt-2 inline-flex items-center text-white/70 text-xs">
                      <span>View Details</span>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Fragrance Detail Modal */}
      <AnimatePresence>
        {selectedFragrance && (
          <motion.div
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedFragrance(null)}
          >
            <motion.div
              className="bg-white max-w-3xl w-full rounded-2xl overflow-hidden shadow-2xl"
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 30 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative">
                <button
                  className="absolute right-4 top-4 bg-white/80 rounded-full p-1.5 backdrop-blur-sm z-10 hover:bg-white transition-colors"
                  onClick={() => setSelectedFragrance(null)}
                >
                  <X className="h-4 w-4 text-[#5A4232]" />
                </button>
              </div>

              <div className="flex flex-col md:flex-row">
                {/* Left Side - Image */}
                <div className="md:w-1/2 h-64 md:h-auto relative">
                  <img 
                    src={selectedFragrance.image}
                    alt={selectedFragrance.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent md:bg-gradient-to-t flex md:hidden items-end p-6">
                    <h2 className="text-3xl font-serif text-white">{selectedFragrance.name}</h2>
                  </div>
                </div>

                {/* Right Side - Content */}
                <div className="md:w-1/2 p-6 md:p-8 relative">
                  <div className="hidden md:block">
                    <h2 className="text-3xl font-serif font-bold text-[#5A4232] mb-2">{selectedFragrance.name}</h2>
                    <div className="w-12 h-1 bg-[#C9A66B] mb-4"></div>
                  </div>

                  <div className="inline-block px-3 py-1 bg-[#F5E9DA] text-[#5A4232] rounded-full text-xs font-medium mb-4">
                    {selectedFragrance.mood}
                  </div>

                  <p className="text-[#6B5849] mb-6 leading-relaxed">
                    {selectedFragrance.description}
                  </p>

                  {/* Notes Section */}
                  <div className="space-y-4">
                    <div className="bg-[#FFF8F2] rounded-xl p-4">
                      <h3 className="font-serif text-[#5A4232] mb-3 flex items-center text-sm font-medium">
                        <Droplets className="w-4 h-4 mr-1.5 text-[#C9A66B]" />
                        Top Notes
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedFragrance.topNotes.map((note, index) => (
                          <span
                            key={index}
                            className="px-2.5 py-1 bg-[#C9A66B]/10 text-[#C9A66B] rounded-md text-xs font-medium"
                          >
                            {note}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="bg-[#FFF8F2] rounded-xl p-4">
                      <h3 className="font-serif text-[#5A4232] mb-3 flex items-center text-sm font-medium">
                        <Droplets className="w-4 h-4 mr-1.5 text-[#5A4232]" />
                        Middle Notes
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedFragrance.middleNotes.map((note, index) => (
                          <span
                            key={index}
                            className="px-2.5 py-1 bg-[#5A4232]/10 text-[#5A4232] rounded-md text-xs font-medium"
                          >
                            {note}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="bg-[#FFF8F2] rounded-xl p-4">
                      <h3 className="font-serif text-[#5A4232] mb-3 flex items-center text-sm font-medium">
                        <Droplets className="w-4 h-4 mr-1.5 text-[#86957F]" />
                        Base Notes
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedFragrance.baseNotes.map((note, index) => (
                          <span
                            key={index}
                            className="px-2.5 py-1 bg-[#86957F]/10 text-[#86957F] rounded-md text-xs font-medium"
                          >
                            {note}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Shop this fragrance button */}
                  <div className="mt-6">
                    <button className="w-full bg-[#5A4232] hover:bg-[#4A3222] text-white py-3 rounded-lg font-medium transition-colors">
                      Shop Candles with this Fragrance
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

export default FragranceGuide;


