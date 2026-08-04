import React from 'react';
import { motion } from 'framer-motion';
import { Flame, Hammer, Sparkles } from 'lucide-react';

const MaintenancePage: React.FC = () => {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-b from-[#FFF8F2] via-[#FBEFE0] to-[#F5E9DA] overflow-hidden relative px-6">
      {/* Floating ambient sparkles */}
      {[...Array(14)].map((_, i) => (
        <motion.span
          key={i}
          className="absolute text-[#C9A66B]"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          initial={{ opacity: 0, y: 0 }}
          animate={{
            opacity: [0, 1, 0],
            y: [-10, -40, -10],
          }}
          transition={{
            duration: 3 + Math.random() * 3,
            repeat: Infinity,
            delay: Math.random() * 4,
          }}
        >
          <Sparkles size={14 + Math.random() * 10} />
        </motion.span>
      ))}

      <div className="relative z-10 text-center max-w-xl">
        {/* Flickering candle flame */}
        <motion.div
          className="mx-auto mb-6 w-16 h-16 rounded-full bg-[#5A4232] flex items-center justify-center shadow-lg"
          animate={{ scale: [1, 1.05, 0.98, 1] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
        >
          <motion.div
            animate={{
              rotate: [-4, 4, -3, 3, -4],
              scale: [1, 1.1, 0.95, 1.05, 1],
            }}
            transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
          >
            <Flame className="text-[#FFB84D]" size={30} fill="#FFB84D" />
          </motion.div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-3xl md:text-4xl font-serif text-[#5A4232] mb-3"
        >
          Site is under maintenance currently!! 🔨🕯️
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-[#7A6355] text-lg mb-8"
        >
          Thoda sabar rakhiye — we're hand-arranging every last product on the shelf.
          Pahadi Craft will be back, glowing and ready, very soon.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex items-center justify-center gap-3 text-[#C9A66B]"
        >
          <motion.div
            animate={{ rotate: [0, -15, 15, 0] }}
            transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
          >
            <Hammer size={20} />
          </motion.div>
          <span className="text-sm tracking-wide uppercase">Crafting the details</span>
        </motion.div>

        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.2, delay: 0.6, ease: 'easeOut' }}
          className="h-[2px] bg-gradient-to-r from-transparent via-[#C9A66B] to-transparent mt-8 origin-center"
        />
      </div>
    </div>
  );
};

export default MaintenancePage;