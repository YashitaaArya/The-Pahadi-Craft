import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Droplets, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

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

  // Woody & Earthy
  { name: 'Sandalwood', family: 'Woody & Earthy', mood: 'Grounding, sacred, timeless' },
  { name: 'Pine', family: 'Woody & Earthy', mood: 'Crisp, forest-fresh, awakening' },
  { name: 'Cedarwood', family: 'Woody & Earthy', mood: 'Warm, woody, comforting' },
  { name: 'Mahogany', family: 'Woody & Earthy', mood: 'Rich, deep, sophisticated' },
  { name: 'Patchouli', family: 'Woody & Earthy', mood: 'Earthy, bohemian, grounding' },
  { name: 'Vetiver', family: 'Woody & Earthy', mood: 'Smoky, earthy, distinguished' },
  { name: 'Juniper', family: 'Woody & Earthy', mood: 'Crisp, resinous, clean' },
  { name: 'Eucalyptus', family: 'Woody & Earthy', mood: 'Cooling, medicinal, clarifying' },

  // Gourmand & Sweet
  { name: 'Chocolate', family: 'Gourmand & Sweet', mood: 'Indulgent, rich, comforting' },
  { name: 'Vanilla', family: 'Gourmand & Sweet', mood: 'Warm, sweet, universally loved' },
  { name: 'Coffee', family: 'Gourmand & Sweet', mood: 'Bold, energizing, cozy' },
  { name: 'Baby Powder', family: 'Gourmand & Sweet', mood: 'Soft, clean, nostalgic' },
  { name: 'Bubble Gum', family: 'Gourmand & Sweet', mood: 'Playful, sweet, nostalgic' },

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

  return (
    <div className="min-h-screen pt-24 pb-20 bg-[#FFF8F2] px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="text-center mb-4">
            <div className="w-14 h-14 rounded-full bg-[#F5E9DA] flex items-center justify-center mx-auto mb-4">
              <Droplets className="w-7 h-7 text-[#C9A66B]" />
            </div>
            <h1 className="text-4xl md:text-5xl font-serif text-[#5A4232] mb-4">Fragrance Guide</h1>
            <p className="text-[#7A6A5A] max-w-2xl mx-auto text-lg leading-relaxed">
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
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                  activeFamily === family
                    ? 'bg-[#5A4232] text-white'
                    : 'bg-white text-[#5A4232] border border-[#E6DFD7] hover:bg-[#F5E9DA]'
                }`}
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
                  className="bg-white rounded-xl p-5 border border-[#E6DFD7] hover:border-[#C9A66B] hover:shadow-md transition-all"
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <h3 className="font-serif text-lg text-[#5A4232]">{fragrance.name}</h3>
                    <Sparkles className="w-4 h-4 text-[#C9A66B] flex-shrink-0 mt-1" />
                  </div>
                  <p className="text-sm text-gray-500 mb-3">{fragrance.mood}</p>
                  <Link
                    to={`/shop?q=${encodeURIComponent(fragrance.name)}`}
                    className="text-xs text-[#C9A66B] hover:text-[#5A4232] font-medium inline-flex items-center gap-1"
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