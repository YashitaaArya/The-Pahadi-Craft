import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { getCollections, CollectionCard } from '../api/adminApi';

const PLACEHOLDER = 'https://images.unsplash.com/photo-1602874801007-bd48c7c8f89a?q=80&w=800&auto=format&fit=crop';

const Collections: React.FC = () => {
  const [cards, setCards] = useState<CollectionCard[]>([]);

  useEffect(() => {
    getCollections()
      .then(setCards)
      .catch(() => setCards([]));
  }, []);

  if (cards.length === 0) return null;

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-serif text-[#5A4232] mb-3">Our Collections</h2>
          <p className="text-gray-500 max-w-2xl mx-auto">
            Explore handcrafted pieces across every category, each rooted in Himachali tradition.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map((card, idx) => (
            <motion.div
              key={card.category}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: idx * 0.08 }}
              viewport={{ once: true }}
            >
              <Link
                to={`/shop?category=${encodeURIComponent(card.category)}`}
                className="group block relative rounded-xl overflow-hidden aspect-[4/5] shadow-md"
              >
                <img
                  src={card.image || PLACEHOLDER}
                  alt={card.category}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
                  <h3 className="font-serif text-xl mb-1">{card.category}</h3>
                  {card.tagline && (
                    <p className="text-sm text-white/80">{card.tagline}</p>
                  )}
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Collections;