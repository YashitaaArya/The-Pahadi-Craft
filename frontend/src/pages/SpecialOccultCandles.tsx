import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingCart, Info, Star, Heart, Clock, Weight, PenTool, ChevronLeft, ChevronRight } from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import { getDriveImage } from '../utils/driveImage';
import { showCartNotification } from '../components/admin/common';
import { useNavigate } from 'react-router-dom';
import { Product } from '../types';
import { useProductStore } from '../store/productStore';

const occultCandles = [
  {
    id: 'occult1',
    name: 'Witch Candle',
    description: 'Infused with ancient ritual herbs for meditation.',
    image: 'https://res.cloudinary.com/dwkexvdus/image/upload/v1756711581/20240911_162213_jsfnxx.jpg',
    additionalImages: [
      'https://res.cloudinary.com/dwkexvdus/image/upload/v1756711579/IMG-20231211-WA0024_cjqpa9.jpg',
      'https://res.cloudinary.com/dwkexvdus/image/upload/v1756711582/20240911_162226_je278p.jpg',
      'https://res.cloudinary.com/dwkexvdus/image/upload/v1756711577/20250709_155945_vbf68m.jpg',
      'https://res.cloudinary.com/dwkexvdus/image/upload/v1756711583/20240911_162116_ymbtl9.jpg',
    ],
    category: 'Occult',
    price: 300,
    fragranceNotes: ['Frankincense', 'Myrrh'],
    burnTime: '40 hours',
    weight: '200g',
  },
  {
    id: 'occult2',
    name: 'Star of David Candle ',
    description: 'A sacred candle symbolizing protection and spirituality.',
    image: 'https://res.cloudinary.com/dwkexvdus/image/upload/v1756711575/IMG-20231211-WA0053_fxtdku.jpg',
    additionalImages: [
      'https://res.cloudinary.com/dwkexvdus/image/upload/v1756711575/WhatsApp_Image_2023-07-09_at_9.54.09_AM_1_qssejl.jpg',
      
    ],
    category: 'Occult',
    price: 100,
    fragranceNotes: ['Lavender', 'Jasmine'],
    burnTime: '50 hours',
    weight: '250g',
  },
  {
    id: 'occult3',
    name: 'Skull Candle',
    description: 'Embrace the power of transformation and protection.',
    image: 'https://res.cloudinary.com/dwkexvdus/image/upload/v1756711585/WhatsApp_Image_2023-07-09_at_9.54.08_AM_1_m70sfo.jpg',
    additionalImages: [
      'https://res.cloudinary.com/dwkexvdus/image/upload/v1756711584/0045_p1iwhe.jpg',
      
    ],
    category: 'Occult',
    price: 100,
    fragranceNotes: ['Black Rose', 'Patchouli'],
    burnTime: '45 hours',
    weight: '220g',
  },
  {
    id: 'occult4',
    name: 'Wolf Candle',
    description: 'Channel the spirit of the wild with this earthy blend.',
    image: 'https://res.cloudinary.com/dwkexvdus/image/upload/v1756711571/IMG-20220903-WA0024_cvnz8s.jpg',
    additionalImages: [
      'https://res.cloudinary.com/dwkexvdus/image/upload/v1756711572/IMG_20221003_001553_513_odhb42.jpg',
      'https://res.cloudinary.com/dwkexvdus/image/upload/v1756711571/IMG_20221003_001720_213_1_b4zucm.jpg',
      'https://res.cloudinary.com/dwkexvdus/image/upload/v1756711571/IMG_20221003_001705_533_appie0.jpg'
    ],
    category: 'Occult',
    price: 120,
    fragranceNotes: ['Amber', 'Sandalwood'],
    burnTime: '55 hours',
    weight: '240g',
  },
  {
    id: 'occult5',
    name: 'Male Cat Candle',
    description: 'Invoke mystery and independence with this unique scent.',
    image: 'https://res.cloudinary.com/dwkexvdus/image/upload/v1756711607/IMG-20231211-WA0059_wwlnvl.jpg',
    additionalImages: [
      'https://res.cloudinary.com/dwkexvdus/image/upload/v1756711645/IMG-20220903-WA0017_vsosvp.jpg',
      'https://res.cloudinary.com/dwkexvdus/image/upload/v1756711643/IMG_20220509_221346_728_dksooy.jpg'
    ],
    category: 'Occult',
    price: 100,
    fragranceNotes: ['Vanilla', 'Blue Lotus'],
    burnTime: '42 hours',
    weight: '210g',
  },
  {
    id: 'occult6',
    name: 'Couple Candle',
    description: 'Perfect for rituals of love and harmony.',
    image: 'https://res.cloudinary.com/dwkexvdus/image/upload/v1756711635/20210523_103702_rvwhvv.jpg',
    additionalImages: [
      'https://res.cloudinary.com/dwkexvdus/image/upload/v1756711602/41Mt-y4RacL._AC_UL600_SR480_600__krujhj.jpg',
      'https://res.cloudinary.com/dwkexvdus/image/upload/v1756711632/WhatsApp_Image_2023-12-30_at_10.09.17_172fc788_qtgctp.jpg',
      'https://res.cloudinary.com/dwkexvdus/image/upload/v1756711602/0033_psdoqo.jpg',
      'https://res.cloudinary.com/dwkexvdus/image/upload/v1756711604/hug_candle_oxmu2c.jpg',
      'https://res.cloudinary.com/dwkexvdus/image/upload/v1756711637/HI-21583442-figurine-candle_a4ts8b.jpg'
    ],
    category: 'Occult',
    price: 100,
    fragranceNotes: ['Mugwort', 'Cedar'],
    burnTime: '48 hours',
    weight: '230g',
  },
  {
    id: 'occult7',
    name: 'Skull Candle',
    description: 'A powerful symbol for transformation and protection.',
    image: 'https://res.cloudinary.com/dwkexvdus/image/upload/v1756711584/0045_p1iwhe.jpg',
    additionalImages: [
      'https://res.cloudinary.com/dwkexvdus/image/upload/v1756711585/WhatsApp_Image_2023-07-09_at_9.54.08_AM_1_m70sfo.jpg',

    ],
    category: 'Occult',
    price: 300,
    fragranceNotes: ['Cinnamon', 'Clove'],
    burnTime: '60 hours',
    weight: '280g',
  },
  {
    id: 'occult8',
    name: 'Cross candles',
    description: 'A powerful symbol for transformation and protection.',
    image: 'https://res.cloudinary.com/dwkexvdus/image/upload/v1756711612/WhatsApp_Image_2023-07-09_at_9.54.06_AM_qu0fc8.jpg',
    additionalImages: [
      'https://res.cloudinary.com/dwkexvdus/image/upload/v1756711609/IMG-20231211-WA0097_l78cgu.jpg',
      
    ],
    category: 'Occult',
    price: 130,
    fragranceNotes: ['Cinnamon', 'Clove'],
    burnTime: '60 hours',
    weight: '280g',
  },
  {
    id: 'occult9',
    name: 'Male Female Candles',
    description: 'A powerful symbol for transformation and protection.',
    image: 'https://res.cloudinary.com/dwkexvdus/image/upload/v1756711602/41Mt-y4RacL._AC_UL600_SR480_600__krujhj.jpg',
    additionalImages: [
      'https://res.cloudinary.com/dwkexvdus/image/upload/v1756711602/IMG-20210526-WA0037_ljll5a.jpg',
    ],
    category: 'Occult',
    price: 240,
    fragranceNotes: ['Cinnamon', 'Clove'],
    burnTime: '60 hours',
    weight: '280g',
  },
  {
    id: 'occult10',
    name: 'Lip Candle',
    description: 'A powerful symbol for transformation and protection.',
    image: 'https://res.cloudinary.com/dwkexvdus/image/upload/v1756711597/IMG_20220928_112545_406_jpx0f6.jpg',
    additionalImages: [
      'https://res.cloudinary.com/dwkexvdus/image/upload/v1756711595/IMG-20221009-WA0002_mwllbv.jpg',
     'https://res.cloudinary.com/dwkexvdus/image/upload/v1756711595/IMG-20221009-WA0003_jchrcl.jpg',

    ],
    category: 'Occult',
    price: 100,
    fragranceNotes: ['Cinnamon', 'Clove'],
    burnTime: '60 hours',
    weight: '280g',
  },
  {
    id: 'occult11',
    name: 'Rupee candle',
    description: 'A powerful symbol for transformation and protection.',
    image: 'https://res.cloudinary.com/dwkexvdus/image/upload/v1756711641/IMG_20221003_002729_443_xtouwq.jpg',
    additionalImages: [
      'https://res.cloudinary.com/dwkexvdus/image/upload/v1756711638/IMG_20221019_120350_303_2_si5ik4.jpg',
     'https://res.cloudinary.com/dwkexvdus/image/upload/v1756711640/IMG_20221030_194038_120_ko6ncx.webp'
    ],
    category: 'Occult',
    price: 150,
    fragranceNotes: ['Cinnamon', 'Clove'],
    burnTime: '60 hours',
    weight: '280g',
  },
  {
    id: 'occult12',
    name: 'Bee Wax Taper Candles',
    description: 'A powerful symbol for transformation and protection.',
    image: 'https://res.cloudinary.com/dwkexvdus/image/upload/v1756711588/IMG-20220903-WA0013_jev8gm.jpg',
    additionalImages: [
      'https://res.cloudinary.com/dwkexvdus/image/upload/v1756711588/IMG-20221020-WA0006_mt1tth.jpg',
    'https://res.cloudinary.com/dwkexvdus/image/upload/v1756711587/0040_n6zcsk.jpg',
    'https://res.cloudinary.com/dwkexvdus/image/upload/v1756711586/WhatsApp_Image_2023-07-08_at_23.40.52_tno3i3.jpg'
    ],
    category: 'Occult',
    price: 500,
    fragranceNotes: ['Cinnamon', 'Clove'],
    burnTime: '60 hours',
    weight: '280g',
  },
  
  
  {
    id: 'occult15',
    name: '7 Knob Candle (2 Candles)',
    description: 'A powerful symbol for transformation and protection.',
    image: 'https://res.cloudinary.com/dwkexvdus/image/upload/v1756711643/0037_zski2i.jpg',
    additionalImages: [
      'https://res.cloudinary.com/dwkexvdus/image/upload/v1756711643/0037_zski2i.jpg',
      'https://res.cloudinary.com/dwkexvdus/image/upload/v1756711642/0038_u5mym4.jpg'
    ],
    category: 'Occult',
    price: 240 ,
    fragranceNotes: ['Cinnamon', 'Clove'],
    burnTime: '60 hours',
    weight: '280g',
  },
  {
    id: 'occult16',
    name: 'Evil Eye Protection Candle',
    description: 'A powerful symbol for transformation and protection.',
    image: 'https://res.cloudinary.com/dwkexvdus/image/upload/v1756711622/20241206_131746_cd7gj9.jpg',
    additionalImages: [
    
    ],
    category: 'Occult',
    price: 199,
    fragranceNotes: ['Cinnamon', 'Clove'],
    burnTime: '60 hours',
    weight: '280g',
  },
  {
    id: 'occult17',
    name: 'Owl Candle',
    description: 'A powerful symbol for transformation and protection.',
    image: 'https://res.cloudinary.com/dwkexvdus/image/upload/v1756711620/0043_el4bjl.jpg',
    additionalImages: [
    
    ],
    category: 'Occult',
    price: 100,
    fragranceNotes: ['Cinnamon', 'Clove'],
    burnTime: '60 hours',
    weight: '280g',
  },
  {
    id: 'occult18',
    name: 'Hug Candle',
    description: 'A powerful symbol for transformation and protection.',
    image: 'https://res.cloudinary.com/dwkexvdus/image/upload/v1756711604/hug_candle_oxmu2c.jpg',
    additionalImages: [
      'https://res.cloudinary.com/dwkexvdus/image/upload/v1756711635/20210523_103702_rvwhvv.jpg',
      'https://res.cloudinary.com/dwkexvdus/image/upload/v1756711634/IMG_20221002_152951_527_ydlto8.jpg'

    ],
    category: 'Occult',
    price: 120,
    fragranceNotes: ['Cinnamon', 'Clove'],
    burnTime: '60 hours',
    weight: '280g',
  },
  
  
  {
    id: 'occult21',
    name: 'Cross Candle',
    description: 'A powerful symbol for transformation and protection.',
    image: 'https://res.cloudinary.com/dwkexvdus/image/upload/v1756711611/WhatsApp_Image_2023-07-09_at_9.54.04_AM_1_zxplpy.jpg',
    additionalImages: [
     
    ],
    category: 'Occult',
    price: 130,
    fragranceNotes: ['Cinnamon', 'Clove'],
    burnTime: '60 hours',
    weight: '280g',
  },
   {
    id: 'occult22',
    name: 'Merlin Candle',
    description: 'A powerful symbol for transformation and protection.',
    image: 'https://res.cloudinary.com/dwkexvdus/image/upload/v1756711630/IMG_20220509_221632_975_jebotu.jpg',
    additionalImages: [
      'https://res.cloudinary.com/dwkexvdus/image/upload/v1756711631/IMG_20220509_221731_000_eyks1u.jpg',
      
    ],
    category: 'Occult',
    price: 150,
    fragranceNotes: ['Cinnamon', 'Clove'],
    burnTime: '60 hours',
    weight: '280g',
  },
   
   {
    id: 'occult24',
    name: 'Sun and Moon (per Pieces)',
    description: 'A powerful symbol for transformation and protection.',
    image: 'https://res.cloudinary.com/dwkexvdus/image/upload/v1756711572/0042_l7ling.jpg',
    additionalImages: [
    'https://res.cloudinary.com/dwkexvdus/image/upload/v1756711573/IMG_20221002_160524_481_or6r2e.jpg',

    ],
    category: 'Occult',
    price: 100,
    fragranceNotes: ['Cinnamon', 'Clove'],
    burnTime: '60 hours',
    weight: '280g',
  },
   
   {
    id: 'occult26',
    name: 'Key Candle(4 Pieces)',
    description: 'A powerful symbol for transformation and protection.',
    image: 'https://res.cloudinary.com/dwkexvdus/image/upload/v1756711624/IMG-20221221-WA0014_pfck7k.jpg',
    additionalImages: [
     
    ],
    category: 'Occult',
    price: 400,
    fragranceNotes: ['Cinnamon', 'Clove'],
    burnTime: '60 hours',
    weight: '280g',
  },
   
   
   {
    id: 'occult29',
    name: 'Scissors Candles',
    description: 'A powerful symbol for transformation and protection.',
    image: 'https://res.cloudinary.com/dwkexvdus/image/upload/v1756711647/IMG_20220509_222153_232_yh9id0.jpg',
    additionalImages: [
    
    ],
    category: 'Occult',
    price: 100,
    fragranceNotes: ['Cinnamon', 'Clove'],
    burnTime: '60 hours',
    weight: '280g',
  },
    {
    id: 'occult30',
    name: 'Angle Candle',
    description: 'A powerful symbol for transformation and protection.',
    image: 'https://res.cloudinary.com/dwkexvdus/image/upload/v1756711589/IMG-20231211-WA0098_jssrbq.jpg',
    additionalImages: [
      'https://res.cloudinary.com/dwkexvdus/image/upload/v1756711589/IMG-20231211-WA0061_ml8pgg.jpg',
      'https://res.cloudinary.com/dwkexvdus/image/upload/v1756711592/WhatsApp_Image_2023-07-09_at_9.54.06_AM_1_q1tchr.jpg'
    ],
    category: 'Occult',
    price: 150,
    fragranceNotes: ['Cinnamon', 'Clove'],
    burnTime: '60 hours',
    weight: '280g',
  },
  
  
  
];

const OccultCandlesPage = () => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { addItem } = useCartStore();
  const navigate = useNavigate();
  const { products, fetchProducts } = useProductStore();

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const occultProducts = React.useMemo(
    () => products.filter((product) =>
      product.category === 'Occult' || product.tags?.includes('occult')
    ),
    [products]
  );

  const handleAddToCart = (product: Product) => {
    addItem(product);
    showCartNotification(product.name);
  };

  // Reset the current image index when a new product is selected
  const handleSelectProduct = (product) => {
    setSelectedProduct(product);
    setCurrentImageIndex(0);
  };

  // Get all images for a product including the main image and additional images
  const getAllProductImages = (product) => {
    if (!product) return [];
    
    // Start with the main image
    const allImages = [product.image];
    
    // Add any additional images if they exist
    if (product.additionalImages && Array.isArray(product.additionalImages)) {
      allImages.push(...product.additionalImages);
    }
    
    return allImages;
  };

  // Handle navigation between images
  const nextImage = (e) => {
    e.stopPropagation();
    if (!selectedProduct) return;
    
    const images = getAllProductImages(selectedProduct);
    if (images.length <= 1) return;
    
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const prevImage = (e) => {
    e.stopPropagation();
    if (!selectedProduct) return;
    
    const images = getAllProductImages(selectedProduct);
    if (images.length <= 1) return;
    
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  return (
    <div className="min-h-screen pt-20 bg-[#3E2A1F] px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-7xl mx-auto py-10"
      >
        {/* Back to Shop Button */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/shop')}
            className="bg-[#F5E9DA] text-[#5A4232] px-4 py-2 rounded-full font-medium hover:bg-[#e8d9c5] transition"
          >
            ← Back to Shop
          </button>
        </div>

        <h1 className="text-4xl font-serif text-white text-center mb-4 tracking-wide">
          OCCULT CANDLES
        </h1>
        <p className="text-center text-[#E5D8CC] max-w-2xl mx-auto mb-10 text-base font-light">
          Discover our mystical collection of handcrafted occult candles designed<br />
          to enhance energy, intuition, and sacred rituals.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
          {occultProducts.length === 0 ? (
            <div className="col-span-full text-center py-20 text-white/80">
              No occult products are available yet. Add them from the admin panel to display them here.
            </div>
          ) : (
            occultProducts.map((product) => {
              return (
                <motion.div
                  key={product.id}
                  className="bg-[#F5E9DA] rounded-xl shadow-lg hover:shadow-xl cursor-pointer overflow-hidden transition-all duration-300 group"
                  whileHover={{ y: -5 }}
                >
              <div className="relative overflow-hidden h-60">
                <img
                  src={getDriveImage(product.image)}
                  alt={product.name}
                  className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-4 left-0 right-0 flex justify-center">
                    <button 
                      onClick={() => handleSelectProduct(product)}
                      className="bg-white/90 backdrop-blur-sm text-[#5A4232] px-4 py-2 rounded-full text-sm font-medium shadow-lg hover:bg-white transition-colors flex items-center gap-1.5"
                    >
                      <Info size={16} />
                      Read More
                    </button>
                  </div>
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-xl font-serif text-[#5A4232] font-semibold mb-1">{product.name}</h3>
                <p className="text-sm text-[#6B5849] mb-3 line-clamp-2">{product.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-[#C9A66B]">₹{product.price}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddToCart(product);
                    }}
                    className="bg-[#5A4232] text-white text-sm px-4 py-1.5 rounded-full hover:bg-[#7a5b45] transition shadow-sm flex items-center gap-1.5"
                  >
                    <ShoppingCart size={15} />
                    Add to Cart
                  </button>
                </div>
              </div>
            </motion.div>
              );
            })
          )}
        </div>
      </motion.div>

      {/* Enhanced Premium Modal with Image Navigation */}
      <AnimatePresence>
        {selectedProduct && (
          <motion.div
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedProduct(null)}
          >
            <motion.div
              className="bg-gradient-to-b from-[#FDF9F5] to-[#F6EFE8] rounded-2xl overflow-hidden max-w-3xl w-full relative shadow-2xl"
              initial={{ scale: 0.9, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="grid grid-cols-1 md:grid-cols-2">
                <div className="relative h-[300px] md:h-full">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#3E2A1F]/10 to-[#3E2A1F]/5"></div>
                  
                  {/* Main Product Image */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <AnimatePresence mode="wait">
                      <motion.img
                        key={currentImageIndex}
                        src={getDriveImage(getAllProductImages(selectedProduct)[currentImageIndex])}
                        alt={`${selectedProduct.name} - view ${currentImageIndex + 1}`}
                        className="w-full h-full object-contain p-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      />
                    </AnimatePresence>
                  </div>
                  
                  {/* Collection Badge */}
                  <div className="absolute top-3 left-3 bg-[#C9A66B] px-3 py-1 rounded-full text-white text-xs font-medium shadow-md">
                    Occult Collection
                  </div>
                  
                  {/* Image Counter */}
                  {getAllProductImages(selectedProduct).length > 1 && (
                    <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-xs">
                      {currentImageIndex + 1} / {getAllProductImages(selectedProduct).length}
                    </div>
                  )}
                  
                  {/* Navigation Arrows - only show if there are multiple images */}
                  {getAllProductImages(selectedProduct).length > 1 && (
                    <>
                      <button 
                        className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/70 p-1.5 rounded-full shadow-md hover:bg-white transition-colors"
                        onClick={prevImage}
                      >
                        <ChevronLeft className="w-5 h-5 text-[#5A4232]" />
                      </button>
                      <button 
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/70 p-1.5 rounded-full shadow-md hover:bg-white transition-colors"
                        onClick={nextImage}
                      >
                        <ChevronRight className="w-5 h-5 text-[#5A4232]" />
                      </button>
                    </>
                  )}
                  
                  {/* Thumbnail Navigation */}
                  {getAllProductImages(selectedProduct).length > 1 && (
                    <div className="absolute bottom-12 left-0 right-0 flex justify-center gap-2">
                      {getAllProductImages(selectedProduct).map((img, idx) => (
                        <button
                          key={idx}
                          onClick={(e) => {
                            e.stopPropagation();
                            setCurrentImageIndex(idx);
                          }}
                          className={`w-2 h-2 rounded-full transition-all ${
                            idx === currentImageIndex ? 'bg-white scale-125' : 'bg-white/50'
                          }`}
                          aria-label={`View image ${idx + 1}`}
                        />
                      ))}
                    </div>
                  )}
                </div>
                
                {/* Product Details */}
                <div className="p-6 md:p-8 relative">
                  <button
                    onClick={() => setSelectedProduct(null)}
                    className="absolute top-4 right-4 bg-[#F5E9DA] text-[#5A4232] p-1.5 rounded-full hover:bg-[#E0D5C8] transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                  
                  <h2 className="text-2xl md:text-3xl font-serif font-bold text-[#3E2A1F] mb-2">
                    {selectedProduct.name}
                  </h2>
                  
                  <div className="flex items-center gap-2 mb-4">
                    <Star className="h-4 w-4 fill-[#C9A66B] text-[#C9A66B]" />
                    <Star className="h-4 w-4 fill-[#C9A66B] text-[#C9A66B]" />
                    <Star className="h-4 w-4 fill-[#C9A66B] text-[#C9A66B]" />
                    <Star className="h-4 w-4 fill-[#C9A66B] text-[#C9A66B]" />
                    <Star className="h-4 w-4 fill-[#C9A66B] text-[#C9A66B]" />
                  </div>
                  
                  <div className="mb-6">
                    <span className="inline-block text-2xl font-bold text-[#C9A66B] mb-1">
                      ₹{selectedProduct.price}
                    </span>
                    <span className="text-[#6B5849] text-sm ml-2">Inclusive of all taxes</span>
                  </div>
                  
                  <div className="mb-6">
                    <h3 className="text-sm uppercase tracking-wider text-[#6B5849]/80 font-medium mb-2">Description</h3>
                    <p className="text-[#5A4232] text-base">{selectedProduct.description}</p>
                  </div>
                  
                  <div className="flex flex-wrap gap-3 mb-6">
                    {selectedProduct.fragranceNotes.map((note, index) => (
                      <span 
                        key={index} 
                        className="bg-[#F5E9DA] text-[#5A4232] text-xs px-3 py-1.5 rounded-full border border-[#E0D5C8]"
                      >
                        {note}
                      </span>
                    ))}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="flex items-center gap-2 bg-white/70 backdrop-blur-sm p-3 rounded-lg shadow-sm">
                      <Clock className="h-5 w-5 text-[#C9A66B]" />
                      <div>
                        <p className="text-xs text-[#6B5849]">Burn Time</p>
                        <p className="text-sm font-medium text-[#3E2A1F]">{selectedProduct.burnTime}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 bg-white/70 backdrop-blur-sm p-3 rounded-lg shadow-sm">
                      <Weight className="h-5 w-5 text-[#C9A66B]" />
                      <div>
                        <p className="text-xs text-[#6B5849]">Weight</p>
                        <p className="text-sm font-medium text-[#3E2A1F]">{selectedProduct.weight}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border-t border-[#E0D5C8] pt-5 mb-6">
                    <div className="flex items-center gap-2 mb-4">
                      <PenTool className="h-5 w-5 text-[#C9A66B]" />
                      <div>
                        <p className="text-sm font-medium text-[#3E2A1F]">Artisan Craftsmanship</p>
                        <p className="text-xs text-[#6B5849]">Handcrafted with traditional methods</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        handleAddToCart(selectedProduct);
                        setSelectedProduct(null);
                      }}
                      className="flex-1 bg-[#5A4232] hover:bg-[#4A3222] text-white py-3 rounded-xl font-medium transition-colors flex items-center justify-center gap-2 shadow-md"
                    >
                      <ShoppingCart className="w-5 h-5" />
                      Add to Cart
                    </button>
                    
                    <button className="bg-white border border-[#E0D5C8] p-3 rounded-xl text-[#5A4232] hover:bg-[#F5E9DA] transition-colors shadow-sm">
                      <Heart className="w-5 h-5" />
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

export default OccultCandlesPage;


