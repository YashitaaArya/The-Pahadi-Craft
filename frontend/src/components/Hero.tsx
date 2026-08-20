import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getBanners } from '../api/adminApi';

// Shown only if no hero slides have been added in the admin dashboard yet.
const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1603006905003-be475563bc59?q=80&w=2940&auto=format&fit=crop';

const SLIDE_DURATION_MS = 4500;

interface Slide {
  id: string;
  image: string;
  link?: string;
}

const Hero = () => {
  const [slides, setSlides] = useState<Slide[]>([]);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    getBanners()
      .then((banners) => {
        if (Array.isArray(banners) && banners.length > 0) {
          setSlides(banners.map((b: any) => ({ id: b.id, image: b.image, link: b.link })));
        }
      })
      .catch(() => {
        // Falls back to the default background below - not worth showing an error for this.
      });
  }, []);

  useEffect(() => {
    if (slides.length < 2) return;
    const timer = setInterval(() => {
      setCurrent((c) => (c + 1) % slides.length);
    }, SLIDE_DURATION_MS);
    return () => clearInterval(timer);
  }, [slides.length]);

  const backgroundImage = slides.length > 0 ? slides[current].image : FALLBACK_IMAGE;

  return (
    <div className="relative h-screen flex items-center justify-center overflow-hidden">
      <AnimatePresence mode="sync">
        <motion.div
          key={backgroundImage}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: 'easeInOut' }}
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `url(${backgroundImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/60" />
        </motion.div>
      </AnimatePresence>

      {/* Slide indicator dots */}
      {slides.length > 1 && (
        <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {slides.map((slide, idx) => (
            <button
              key={slide.id}
              onClick={() => setCurrent(idx)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                idx === current ? 'w-8 bg-white' : 'w-1.5 bg-white/50 hover:bg-white/75'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      )}

      <div className="relative z-10 text-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          <motion.h1
            className="text-5xl md:text-7xl font-serif text-white mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            Illuminate Your Space
          </motion.h1>
          <motion.p
            className="text-xl text-[#FFF8F2] mb-8 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
          >
            Discover our handcrafted candles and elegant home decor pieces that transform your living space into a sanctuary of warmth and style.
          </motion.p>
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
          >
            <div className='flex flex-col lg:flex-row items-center gap-4 justify-center w-full sm:w-auto'>
            <Link to="/shop">
              <motion.button
                className="group px-8 py-3 bg-[#C9A66B] text-white rounded-full hover:bg-[#5A4232] transition-all duration-300 flex items-center justify-center gap-2 hover:shadow-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Flame className="w-5 h-5 group-hover:animate-float" />
                <span className="relative  after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-white after:scale-x-0 after:origin-right after:transition-transform group-hover:after:scale-x-100 group-hover:after:origin-left">
                  Shop Collection
                </span>
              </motion.button>
            </Link>

            <Link to="/about">
              <motion.button
                className="px-8 py-3 bg-transparent border-2 border-white text-white rounded-full hover:bg-white/10 transition-all duration-300 hover:shadow-lg backdrop-blur-sm"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Explore More
              </motion.button>
            </Link>
            </div>
          </motion.div>
        </motion.div>
      </div>

      <motion.button
        onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 text-white/90 hover:text-white transition-colors"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.8 }}
      >
        <span className="text-xs tracking-[0.2em] uppercase font-light">Explore</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
        >
          <Flame className="w-4 h-4 text-[#C9A66B]" />
        </motion.div>
      </motion.button>
    </div>
  );
};

export default Hero;