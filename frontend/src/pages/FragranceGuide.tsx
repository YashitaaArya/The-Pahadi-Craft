import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Droplets, Sparkles, Leaf, Wind } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Fragrance {
  name: string;
  family: string;
  mood: string;
}

interface ThemeConfig {
  bgColor: string;
  accentColor: string;
  textColor: string;
  borderColor: string;
}

// Theme configurations for each fragrance family
const FAMILY_THEMES: Record<string, ThemeConfig> = {
  'All': {
    bgColor: 'bg-[#FFF8F2]',
    accentColor: '#C9A66B',
    textColor: 'text-[#5A4232]',
    borderColor: 'border-[#E6DFD7]',
  },
  'Floral & Romantic': {
    bgColor: 'bg-gradient-to-br from-[#FFF0F5] via-[#FFE4E1] to-[#FFF8F2]',
    accentColor: '#FF69B4',
    textColor: 'text-[#8B3A62]',
    borderColor: 'border-[#FFB6D9]',
  },
  'Fresh & Citrus': {
    bgColor: 'bg-gradient-to-br from-[#FFFACD] via-[#FFE4B5] to-[#FFF8F2]',
    accentColor: '#FF8C00',
    textColor: 'text-[#8B4513]',
    borderColor: 'border-[#FFD700]',
  },
  'Warm & Spicy': {
    bgColor: 'bg-gradient-to-br from-[#FFE4C4] via-[#FFD7A8] to-[#FFF8F2]',
    accentColor: '#DC143C',
    textColor: 'text-[#8B4513]',
    borderColor: 'border-[#CD853F]',
  },
  'Woody & Earthy': {
    bgColor: 'bg-gradient-to-br from-[#E8F5E9] via-[#D7CCC8] to-[#FFF8F2]',
    accentColor: '#6B4423',
    textColor: 'text-[#556B2F]',
    borderColor: 'border-[#A0826D]',
  },
  'Gourmand & Sweet': {
    bgColor: 'bg-gradient-to-br from-[#F5E6D3] via-[#FFF8DC] to-[#FFF8F2]',
    accentColor: '#D2691E',
    textColor: 'text-[#8B4513]',
    borderColor: 'border-[#DEB887]',
  },
  'Musk & Sensual': {
    bgColor: 'bg-gradient-to-br from-[#F0E6F6] via-[#E6CCE6] to-[#FFF8F2]',
    accentColor: '#9370DB',
    textColor: 'text-[#5A3A7A]',
    borderColor: 'border-[#D8BFD8]',
  },
};

// Animated floating elements for each family
const FloatingElement: React.FC<{ type: 'petal' | 'leaf' | 'sparkle' | 'fruit' | 'pod'; delay: number }> = ({ type, delay }) => {
  const animations = {
    petal: {
      y: [0, -200, 200],
      x: [0, 50, -50],
      opacity: [0, 1, 0],
      rotate: [0, 360, 0],
    },
    leaf: {
      y: [0, -150, 150],
      x: [0, -60, 60],
      opacity: [0, 1, 0],
      rotate: [0, 180, 360],
    },
    sparkle: {
      y: [0, -100, 100],
      x: [0, 30, -30],
      opacity: [0, 1, 0],
      scale: [0.5, 1.2, 0.5],
    },
    fruit: {
      y: [0, -120, 120],
      x: [0, 40, -40],
      opacity: [0, 1, 0],
      rotate: [0, 360, 0],
    },
    pod: {
      y: [0, -140, 140],
      x: [0, 50, -50],
      opacity: [0, 1, 0],
      rotate: [0, -360, 0],
    },
  };

  return (
    <motion.div
      className="absolute pointer-events-none"
      animate={animations[type]}
      transition={{ duration: 5, delay, repeat: Infinity, ease: 'easeInOut' }}
      style={{
        left: `${Math.random() * 100}%`,
        top: `-20px`,
      }}
    >
      {type === 'petal' && <div className="w-4 h-4 bg-pink-300 rounded-full opacity-60" />}
      {type === 'leaf' && <Leaf className="w-4 h-4 text-green-400 opacity-60" />}
      {type === 'sparkle' && <Sparkles className="w-3 h-3 text-yellow-300 opacity-60" />}
      {type === 'fruit' && <div className="w-3 h-3 bg-orange-400 rounded-full opacity-60" />}
      {type === 'pod' && <div className="w-2 h-4 bg-red-400 rounded-full opacity-60" />}
    </motion.div>
  );
};

interface Fragrance {
  name: string;
  family: string;
  mood: string;
}

// Real fragrance list from the owner, organized into standard scent families.
// Moods are general characteristics of each scent family, not fabricated
// specifics about proprietary blends.
const FRAGRANCES: Fragrance[] = [
  // Floral & Romantic
  { name: 'Rose', family: 'Floral & Romantic', mood: 'Classic, romantic, timeless' },
  { name: 'Lotus', family: 'Floral & Romantic', mood: 'Serene, pure, meditative' },
  { name: 'Jasmine', family: 'Floral & Romantic', mood: 'Sweet, intoxicating, sensual' },
  { name: 'Lavender', family: 'Floral & Romantic', mood: 'Calming, soothing, restful' },
  { name: 'Parijat', family: 'Floral & Romantic', mood: 'Delicate, nostalgic, night-blooming' },
  { name: 'Mogra', family: 'Floral & Romantic', mood: 'Rich, heady, quintessentially Indian' },
  { name: 'Marigold', family: 'Floral & Romantic', mood: 'Bright, festive, auspicious' },
  { name: 'Ylang Ylang', family: 'Floral & Romantic', mood: 'Exotic, floral, uplifting' },
  { name: 'Lily of Valley', family: 'Floral & Romantic', mood: 'Fresh, dainty, springlike' },
  { name: 'Nargis', family: 'Floral & Romantic', mood: 'Elegant, soft, understated' },
  { name: 'Chamomile', family: 'Floral & Romantic', mood: 'Soft, sweet, calming' },
  { name: 'Orchid', family: 'Floral & Romantic', mood: 'Exotic, elegant, mysterious' },
  { name: 'Lilly', family: 'Floral & Romantic', mood: 'Pure, pristine, timeless' },

  // Fresh & Citrus
  { name: 'Green Apple', family: 'Fresh & Citrus', mood: 'Crisp, tangy, energizing' },
  { name: 'Lemon', family: 'Fresh & Citrus', mood: 'Zesty, clean, invigorating' },
  { name: 'Lemongrass', family: 'Fresh & Citrus', mood: 'Bright, herbal, revitalizing' },
  { name: 'Orange', family: 'Fresh & Citrus', mood: 'Sunny, cheerful, warm' },
  { name: 'Bergamot', family: 'Fresh & Citrus', mood: 'Sophisticated, citrusy, uplifting' },
  { name: 'Ocean Breeze', family: 'Fresh & Citrus', mood: 'Airy, clean, expansive' },
  { name: 'Citronella', family: 'Fresh & Citrus', mood: 'Sharp, herbaceous, outdoorsy' },
  { name: 'Watermelon', family: 'Fresh & Citrus', mood: 'Juicy, playful, summery' },
  { name: 'Mango', family: 'Fresh & Citrus', mood: 'Tropical, sweet, sunny' },
  { name: 'Pumpkin', family: 'Fresh & Citrus', mood: 'Cozy, autumnal, comforting' },
  { name: 'Banana', family: 'Fresh & Citrus', mood: 'Creamy, sweet, playful' },
  { name: 'Apple', family: 'Fresh & Citrus', mood: 'Crisp, fresh, orchard-like' },
  { name: 'Peppermint', family: 'Fresh & Citrus', mood: 'Cool, invigorating, refreshing' },
  { name: 'Tea Tree', family: 'Fresh & Citrus', mood: 'Clean, medicinal, clarifying' },
  { name: 'Neroli', family: 'Fresh & Citrus', mood: 'Bitter-sweet, floral-citrus, uplifting' },

  // Warm & Spicy
  { name: 'White Oudh', family: 'Warm & Spicy', mood: 'Opulent, deep, mysterious' },
  { name: 'Cinnamon', family: 'Warm & Spicy', mood: 'Warm, festive, comforting' },
  { name: 'Nutmeg', family: 'Warm & Spicy', mood: 'Spicy, cozy, wintery' },
  { name: 'Cardamom', family: 'Warm & Spicy', mood: 'Aromatic, warm, distinctly Indian' },
  { name: 'Basil', family: 'Warm & Spicy', mood: 'Herbal, fresh, grounding' },
  { name: 'Rosemary', family: 'Warm & Spicy', mood: 'Sharp, herbal, focusing' },
  { name: 'Thyme', family: 'Warm & Spicy', mood: 'Earthy, herbal, warm' },
  { name: 'Fennel', family: 'Warm & Spicy', mood: 'Sweet, anise-like, soothing' },
  { name: 'Camphor', family: 'Warm & Spicy', mood: 'Sharp, cleansing, ritualistic' },
  { name: 'Ginger', family: 'Warm & Spicy', mood: 'Warm, peppery, invigorating' },
  { name: 'Elaichi', family: 'Warm & Spicy', mood: 'Aromatic, sweet-spicy, distinctly Indian' },
  { name: 'Clove', family: 'Warm & Spicy', mood: 'Warm, spicy, festive' },
  { name: 'Clary Sage', family: 'Warm & Spicy', mood: 'Herbal, slightly sweet, grounding' },
  { name: 'Kalimat Oud', family: 'Warm & Spicy', mood: 'Rich, resinous, profound' },

  // Woody & Earthy
  { name: 'Sandalwood', family: 'Woody & Earthy', mood: 'Grounding, sacred, timeless' },
  { name: 'Pine', family: 'Woody & Earthy', mood: 'Crisp, forest-fresh, awakening' },
  { name: 'Cedarwood', family: 'Woody & Earthy', mood: 'Warm, woody, comforting' },
  { name: 'Mahogany', family: 'Woody & Earthy', mood: 'Rich, deep, sophisticated' },
  { name: 'Patchouli', family: 'Woody & Earthy', mood: 'Earthy, bohemian, grounding' },
  { name: 'Vetiver', family: 'Woody & Earthy', mood: 'Smoky, earthy, distinguished' },
  { name: 'Juniper', family: 'Woody & Earthy', mood: 'Crisp, resinous, clean' },
  { name: 'Eucalyptus', family: 'Woody & Earthy', mood: 'Cooling, medicinal, clarifying' },
  { name: 'Juniper Berry', family: 'Woody & Earthy', mood: 'Sharp, piney, forest-like' },
  { name: 'Neem', family: 'Woody & Earthy', mood: 'Bitter-earthy, purifying, medicinal' },

  // Gourmand & Sweet
  { name: 'Chocolate', family: 'Gourmand & Sweet', mood: 'Indulgent, rich, comforting' },
  { name: 'Vanilla', family: 'Gourmand & Sweet', mood: 'Warm, sweet, universally loved' },
  { name: 'Coffee', family: 'Gourmand & Sweet', mood: 'Bold, energizing, cozy' },
  { name: 'Baby Powder', family: 'Gourmand & Sweet', mood: 'Soft, clean, nostalgic' },
  { name: 'Bubble Gum', family: 'Gourmand & Sweet', mood: 'Playful, sweet, nostalgic' },
  { name: 'Strawberry', family: 'Gourmand & Sweet', mood: 'Fresh, fruity, delightful' },
  { name: 'Blueberry', family: 'Gourmand & Sweet', mood: 'Sweet, juicy, berry-like' },

  // Musk & Sensual
  { name: 'Musk', family: 'Musk & Sensual', mood: 'Warm, skin-like, sensual' },
  { name: 'Myrrh', family: 'Musk & Sensual', mood: 'Ancient, resinous, sacred' },
  { name: 'Aphrodisia', family: 'Musk & Sensual', mood: 'Bold, alluring, distinctive' },
  { name: 'Dunhill', family: 'Musk & Sensual', mood: 'Refined, masculine, confident' },
  { name: 'Bengal Tuberose', family: 'Musk & Sensual', mood: 'Heady, luxurious, dramatic' },
  { name: 'Loban', family: 'Musk & Sensual', mood: 'Smoky, sacred, traditional' },
];

const FAMILIES = ['All', ...Array.from(new Set(FRAGRANCES.map((f) => f.family)))];

const FragranceGuide: React.FC = () => {
  const [activeFamily, setActiveFamily] = useState('All');

  const visible = useMemo(
    () => FRAGRANCES.filter((f) => activeFamily === 'All' || f.family === activeFamily),
    [activeFamily]
  );

  const currentTheme = FAMILY_THEMES[activeFamily] || FAMILY_THEMES['All'];

  // Get element types and count based on active family
  const getElementsConfig = () => {
    const configs: Record<string, { type: 'petal' | 'leaf' | 'sparkle' | 'fruit' | 'pod'; count: number }> = {
      'Floral & Romantic': { type: 'petal', count: 6 },
      'Fresh & Citrus': { type: 'fruit', count: 8 },
      'Warm & Spicy': { type: 'pod', count: 5 },
      'Woody & Earthy': { type: 'leaf', count: 7 },
      'Gourmand & Sweet': { type: 'sparkle', count: 6 },
      'Musk & Sensual': { type: 'sparkle', count: 8 },
    };
    return configs[activeFamily] || { type: 'sparkle', count: 0 };
  };

  const elementConfig = getElementsConfig();

  return (
    <div className={`min-h-screen pt-24 pb-20 ${currentTheme.bgColor} px-4 relative overflow-hidden transition-all duration-1000`}>
      {/* Animated floating elements - only show when not on All */}
      {activeFamily !== 'All' && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {Array.from({ length: elementConfig.count }).map((_, i) => (
            <FloatingElement key={i} type={elementConfig.type} delay={i * 0.3} />
          ))}
        </div>
      )}

      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="text-center mb-4">
            <div 
              className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4 transition-all duration-500"
              style={{ backgroundColor: `${currentTheme.accentColor}20` }}
            >
              <Droplets className="w-7 h-7" style={{ color: currentTheme.accentColor }} />
            </div>
            <h1 className={`text-4xl md:text-5xl font-serif ${currentTheme.textColor} mb-4 transition-colors duration-500`}>
              Fragrance Guide
            </h1>
            <p className={`${currentTheme.textColor} opacity-75 max-w-2xl mx-auto text-lg leading-relaxed transition-colors duration-500`}>
              Every Pahadi Craft scent is chosen to carry a feeling. Explore our fragrances by mood and find
              the one that matches yours.
            </p>
          </div>

          {/* Family filter tabs */}
          <div className="flex flex-wrap justify-center gap-2 my-10">
            {FAMILIES.map((family) => (
              <button
                key={family}
                onClick={() => setActiveFamily(family)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-500 ${
                  activeFamily === family
                    ? 'text-white border-0'
                    : 'bg-white text-[#5A4232] border transition-colors'
                }`}
                style={
                  activeFamily === family
                    ? {
                        backgroundColor: currentTheme.accentColor,
                        color: '#fff',
                        boxShadow: `0 4px 15px ${currentTheme.accentColor}40`,
                      }
                    : {
                        borderColor: currentTheme.borderColor.replace('border-', ''),
                      }
                }
              >
                {family}
              </button>
            ))}
          </div>

          {/* Fragrance grid - text-based, no stock imagery */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeFamily}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4"
            >
              {visible.map((fragrance) => (
                <motion.div
                  key={fragrance.name}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`bg-white rounded-xl p-5 border hover:shadow-md transition-all ${currentTheme.borderColor}`}
                  style={{
                    borderTopWidth: '3px',
                    borderTopColor: currentTheme.accentColor,
                  }}
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <h3 className={`font-serif text-lg ${currentTheme.textColor} transition-colors duration-500`}>
                      {fragrance.name}
                    </h3>
                    <Sparkles className="w-4 h-4 flex-shrink-0 mt-1" style={{ color: currentTheme.accentColor }} />
                  </div>
                  <p className="text-sm text-gray-500 mb-3">{fragrance.mood}</p>
                  <Link
                    to={`/shop?q=${encodeURIComponent(fragrance.name)}`}
                    className="text-xs font-medium inline-flex items-center gap-1 transition-colors hover:underline"
                    style={{ color: currentTheme.accentColor }}
                  >
                    Shop {fragrance.name} products →
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>

          {visible.length === 0 && (
            <p className="text-center text-gray-400 py-12">No fragrances in this family yet.</p>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default FragranceGuide;