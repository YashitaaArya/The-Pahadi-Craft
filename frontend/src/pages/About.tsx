import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Award, Users } from 'lucide-react';
import aboutimg from '../images1/homedecor.png';
import decor1 from '../Home Decor Candles/decor5.jpg';
import decor2 from '../Home Decor Candles/decor6.jpg';
import decor3 from '../Home Decor Candles/decor7.jpg';
import craft from '../Metal Craft Candles/carft6.jpeg';

const About = () => {
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8 }
  };

  return (
    <div className="min-h-screen pt-20 bg-gradient-to-br from-[#FCF7F0] to-[#F8E3CC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2 }}
        >
          {/* Hero Section with Elegant Typography */}
          <div className="text-center mb-24 px-4">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2 }}
            >
              <h1 className="text-6xl font-serif text-[#4A3220] mb-2">Our Story</h1>
              <div className="w-24 h-1 bg-[#C9A66B] mx-auto mb-8 rounded-full"></div>
            </motion.div>

            <motion.p
              className="text-gray-700 max-w-3xl mx-auto text-lg leading-relaxed mb-6 font-light tracking-wide"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              Since 2017, <span className="font-semibold text-[#5A4232]">Pahadicraft</span> has been a name synonymous with premium handcrafted candles. We proudly wholesale and distribute a vast collection including Scented, Decorative, Pillar, Healing, Aromatherapy, Gel Aroma, and Festive candles—each crafted to ignite emotions.
            </motion.p>

            <motion.p
              className="text-gray-700 max-w-3xl mx-auto text-lg leading-relaxed italic"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.7 }}
            >
              Our success is guided by the unwavering vision of <span className="font-medium text-[#5A4232]">Miss Neety Arya</span>, whose dedication continues to inspire us in delivering joy, warmth, and elegance to homes across the country.
            </motion.p>
          </div>

          {/* Crafted with Love Section - Enhanced Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center mb-32">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1 }}
              viewport={{ once: true }}
              className="rounded-3xl overflow-hidden shadow-2xl border-2 border-[#E0C9A6] transform hover:scale-[1.02] transition-transform duration-500"
            >
              <img
                src={aboutimg}
                alt="Candle making process"
                className="w-full h-full object-cover"
              />
            </motion.div>

            <motion.div
              variants={fadeIn}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-serif text-[#4A3220] mb-4">Crafted with Love</h2>
              <div className="w-16 h-0.5 bg-[#C9A66B] mb-8"></div>
              <p className="text-gray-700 text-lg mb-10 leading-relaxed font-light">
                Each candle is hand-poured using eco-friendly wax, essential oils, and a heart full of passion. Our artisans blend tradition and innovation to create timeless pieces for your space.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                {[
                  { icon: Heart, label: 'Handcrafted', value: '100%' },
                  { icon: Award, label: 'Premium Quality', value: 'Guaranteed' },
                  { icon: Users, label: 'Happy Customers', value: '10,000+' },
                ].map((stat, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.2 }}
                    viewport={{ once: true }}
                    className="bg-white/80 backdrop-blur-lg text-center p-7 rounded-2xl shadow-lg border border-[#E0C9A6] hover:shadow-xl transition-all"
                  >
                    <stat.icon className="w-8 h-8 text-[#C9A66B] mx-auto mb-3" />
                    <div className="font-serif text-[#4A3220] text-2xl font-medium mb-1">{stat.value}</div>
                    <div className="text-gray-600">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Our Process Section - Refined Design */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="bg-white/90 backdrop-blur-xl rounded-3xl p-16 shadow-xl border-2 border-[#E0C9A6]"
          >
            <h2 className="text-4xl font-serif text-[#4A3220] mb-4 text-center">Our Process</h2>
            <div className="w-24 h-0.5 bg-[#C9A66B] mx-auto mb-16"></div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {[
                {
                  title: 'Selection',
                  description: 'Sourcing the finest wax, wicks, and fragrance oils that are safe and sustainable.',
                  image: aboutimg,
                },
                {
                  title: 'Crafting',
                  description: 'Hand-poured in small batches to ensure quality, consistency, and love in each candle.',
                  image: decor2,
                },
                {
                  title: 'Testing',
                  description: 'Each batch is rigorously tested for scent throw, burn quality, and customer delight.',
                  image: craft,
                },
              ].map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.3 }}
                  viewport={{ once: true }}
                  className="text-center bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-500 transform hover:scale-[1.03]"
                >
                  <div className="h-64 overflow-hidden">
                    <img
                      src={step.image}
                      alt={step.title}
                      className="h-full w-full object-cover transition-transform duration-700 hover:scale-110"
                    />
                  </div>
                  <div className="p-8">
                    <h3 className="font-serif text-[#4A3220] text-2xl mb-3">{step.title}</h3>
                    <div className="w-10 h-0.5 bg-[#C9A66B] mx-auto mb-4"></div>
                    <p className="text-gray-600 leading-relaxed font-light">{step.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default About;
