import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

interface PopupOfferProps {
  isOpen: boolean;
  onClose: () => void;
}

const PopupOffer: React.FC<PopupOfferProps> = ({ isOpen, onClose }) => {
  // Animation variants for the popup
  const popupVariants = {
    hidden: {
      opacity: 0,
      scale: 0.8,
    },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
      },
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      transition: {
        duration: 0.3,
      },
    },
  };

  // Prevent scrolling when popup is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          {/* Backdrop with slight blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/75"
            onClick={onClose}
          />
          
          {/* Luxurious Popup */}
          <motion.div
            variants={popupVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="relative w-full max-w-md rounded-xl overflow-hidden"
            style={{
              backdropFilter: 'blur(20px)',
              backgroundColor: 'rgba(20, 20, 22, 0.9)',
              border: '1px solid rgba(206, 169, 113, 0.25)',
              boxShadow: '0 20px 50px rgba(0, 0, 0, 0.4), 0 0 20px rgba(206, 169, 113, 0.15)',
            }}
          >
            {/* Gold trim at the top */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#ceaa72]/60 via-[#e9d5a9] to-[#ceaa72]/60" />
            
            {/* Decorative corner accents */}
            <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-[#ceaa72]/40 rounded-tl-lg" />
            <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-[#ceaa72]/40 rounded-tr-lg" />
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-[#ceaa72]/40 rounded-bl-lg" />
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-[#ceaa72]/40 rounded-br-lg" />
            
            {/* Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-stone-900/60 via-stone-800/40 to-neutral-900/60" />
            
            {/* Subtle animated particles */}
            <div className="absolute inset-0 overflow-hidden opacity-20">
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-[#e9d5a9] rounded-full"
                  initial={{ 
                    x: `${Math.random() * 100}%`, 
                    y: `${Math.random() * 100}%`,
                    opacity: 0.3 
                  }}
                  animate={{ 
                    y: [`${Math.random() * 100}%`, `${Math.random() * 100}%`],
                    opacity: [0.3, 0.8, 0.3]
                  }}
                  transition={{
                    duration: 3 + Math.random() * 5,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
              ))}
            </div>
            
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-black/30 hover:bg-black/50 border border-[#ceaa72]/30 transition-all duration-300 hover:scale-105 hover:border-[#ceaa72]/60 z-10"
              aria-label="Close popup"
            >
              <X size={18} className="text-[#e9d5a9]" />
            </button>
            
            {/* Content */}
            <div className="relative p-10 text-center">
              <motion.div 
                className="flex items-center justify-center mb-5"
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.6 }}
              >
                <div className="p-3 rounded-full bg-gradient-to-tr from-[#ceaa72]/30 to-[#8c6d3f]/30 backdrop-blur-md border border-[#ceaa72]/30">
                  <Sparkles size={28} className="text-[#e9d5a9]" />
                </div>
              </motion.div>
              
              <motion.div
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.6 }}
              >
                <h2 className="text-3xl font-serif font-bold mb-2.5 tracking-wide">
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#e9d5a9] to-[#ceaa72]">
                    Illuminate Your Space
                  </span>
                </h2>
                
                <p className="font-light text-[#e9d5a9]/90 mb-5 leading-relaxed tracking-wide">
                  Experience our artisanal candle collection with 
                  <span className="font-semibold"> 20% off</span> your first purchase
                </p>
              </motion.div>
              
              <motion.div 
                className="mb-6"
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.6 }}
              >
                <span className="inline-block py-1 px-4 rounded-full bg-gradient-to-r from-[#8c6d3f]/40 to-[#5f4a2a]/40 text-[#e9d5a9] text-xs uppercase tracking-wider border border-[#ceaa72]/20">
                  Limited Edition Collection
                </span>
              </motion.div>
              
              <motion.div
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.6 }}
              >
                <Link
                  to="/premium-candles"
                  onClick={onClose}
                  className="inline-block w-full py-3.5 px-6 rounded-lg bg-gradient-to-r from-[#ceaa72] to-[#8c6d3f] text-stone-900 font-medium tracking-wide hover:from-[#e9d5a9] hover:to-[#ceaa72] transition-all duration-300 shadow-lg shadow-[#8c6d3f]/30 hover:shadow-[#ceaa72]/40 relative overflow-hidden group"
                >
                  <span className="relative z-10">Premium Collection</span>
                  <span className="absolute inset-0 bg-gradient-to-r from-[#e9d5a9] to-[#d4b77e] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                </Link>
              </motion.div>
              
              <motion.p 
                className="mt-5 text-xs text-[#e9d5a9]/60 font-light italic"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.8 }}
              >
                *Handcrafted with premium ingredients. Transform your living space into a sanctuary.
              </motion.p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default PopupOffer;