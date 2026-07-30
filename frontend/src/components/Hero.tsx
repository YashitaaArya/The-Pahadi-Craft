import React from 'react';
import { motion } from 'framer-motion';
import { Flame } from 'lucide-react';
import { Link } from 'react-router-dom';


const Hero = () => {
  return (
    <div className="relative h-screen flex items-center justify-center overflow-hidden">
      <motion.div
        initial={{ scale: 1.1, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.5 }}
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1603006905003-be475563bc59?q=80&w=2940&auto=format&fit=crop)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/60" />
      </motion.div>

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

      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 1.5, repeat: Infinity, repeatType: "reverse" }}
      >
        <div className="w-6 h-10 border-2 border-white rounded-full p-1">
          <div className="w-1 h-2 bg-white rounded-full mx-auto animate-float" />
        </div>
      </motion.div>
    </div>
  );
};

export default Hero;