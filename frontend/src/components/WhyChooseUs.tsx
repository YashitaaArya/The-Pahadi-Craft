import React from 'react';
import { motion } from 'framer-motion';
import { Flame, Heart, Leaf, Award } from 'lucide-react';

const features = [
  {
    icon: Flame,
    title: 'Handcrafted Quality',
    description: 'Each candle is carefully handcrafted with attention to detail',
  },
  {
    icon: Heart,
    title: 'Premium Ingredients',
    description: 'We use only the finest natural ingredients and fragrances',
  },
  {
    icon: Leaf,
    title: 'Eco-Friendly',
    description: 'Sustainable practices and environmentally conscious packaging',
  },
  {
    icon: Award,
    title: 'Satisfaction Guaranteed',
    description: '100% satisfaction guarantee on all our products',
  },
];

const WhyChooseUs = () => {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl font-serif text-center text-[#5A4232] mb-12">Why Choose Us</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="inline-block p-4 bg-[#F5E9DA] rounded-full mb-4">
                  <feature.icon className="w-8 h-8 text-[#C9A66B]" />
                </div>
                <h3 className="text-xl font-serif text-[#5A4232] mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default WhyChooseUs;