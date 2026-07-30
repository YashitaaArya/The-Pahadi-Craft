import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, MessageCircle, X } from 'lucide-react';

const ContactSlider = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleWhatsApp = () => {
    window.open('https://wa.me/917660077316', '_blank');
  };

  const handleCall = () => {
    window.location.href = 'tel:7660077316';
  };

  return (
    <div className="fixed right-6 bottom-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="absolute bottom-16 right-0 flex flex-col gap-4"
          >
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleWhatsApp}
              className="w-12 h-12 rounded-full bg-green-500 text-white flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow"
            >
              <MessageCircle className="w-6 h-6" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleCall}
              className="w-12 h-12 rounded-full bg-[#C9A66B] text-white flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow"
            >
              <Phone className="w-6 h-6" />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full bg-[#5A4232] text-white flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Phone className="w-6 h-6" />}
      </motion.button>
    </div>
  );
};

export default ContactSlider;