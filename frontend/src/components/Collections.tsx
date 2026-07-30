import React from 'react';
import { motion } from 'framer-motion';

import luxuryImg from '../images1/11.png';
import festive from  '../images1/festive.png';

const collections = [
  {
    id: 1,
    name: 'Luxury Collection',
    description: 'Premium candles crafted with the finest ingredients',
    image: luxuryImg,
  },
  {
    id: 2,
    name: 'Seasonal Favorites',
    description: 'Special editions for every season',
    image: festive,
  },
];

const Collections = () => {
  return (
    <section className="py-16 bg-[#F5E9DA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl font-serif text-center text-[#5A4232] mb-12">Our Collections</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {collections.map((collection) => (
              <div
                key={collection.id}
                className="relative h-96 rounded-lg overflow-hidden group cursor-pointer"
              >
                <img
                  src={collection.image}
                  alt={collection.name}
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <div className="text-center">
                    <h3 className="text-3xl font-serif text-white mb-2">{collection.name}</h3>
                    <p className="text-[#FFF8F2] max-w-xs mx-auto">{collection.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Collections;