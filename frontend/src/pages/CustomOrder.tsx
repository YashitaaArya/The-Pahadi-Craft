import React, { useState, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const CustomOrder = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fragrance: '',
    size: '8oz',
    container: 'glass',
    label: '',
    quantity: 1,
    specialInstructions: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const body = `
      Fragrance: ${formData.fragrance}
      Size: ${formData.size}
      Container: ${formData.container}
      Custom Label Text: ${formData.label}
      Quantity: ${formData.quantity}
      Special Instructions: ${formData.specialInstructions}
    `;
    window.location.href = `mailto:pahadicraft@gmail.com?subject=Custom Candle Order&body=${encodeURIComponent(body)}`;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const controls = useAnimation();
  const slideImages = [
    'https://res.cloudinary.com/dwkexvdus/image/upload/v1754986455/20231201_143833_wwd2ih.jpg',
    'https://res.cloudinary.com/dwkexvdus/image/upload/v1754986353/IMG-20231211-WA0096_uiibbx.jpg',
    'https://res.cloudinary.com/dwkexvdus/image/upload/v1754986439/WhatsApp_Image_2023-07-09_at_9.53.01_AM_1_ndh5y0.jpg',
    'https://res.cloudinary.com/dwkexvdus/image/upload/v1754986443/WhatsApp_Image_2023-07-09_at_9.53.05_AM_vriobx.jpg',
    'https://res.cloudinary.com/dwkexvdus/image/upload/v1756711738/IMG-20250621-WA0007_dakmlp.jpg',
    'https://res.cloudinary.com/dwkexvdus/image/upload/v1756711676/Picture_087_svkjjo.png',
    'https://res.cloudinary.com/dwkexvdus/image/upload/v1756711659/IMG-20231204-WA0040_dcsxea.jpg'


  ];

  useEffect(() => {
    controls.start({
      x: ['0%', '-50%'],
      transition: {
        x: {
          repeat: Infinity,
          repeatType: 'loop',
          ease: 'linear',
          duration: 30,
        },
      },
    });
  }, [controls]);

  return (
    <div className="min-h-screen pt-20 bg-gradient-to-br from-[#FFF8F2] via-[#FCE9D6] to-[#F5E1CD]">
      {/* Hero Section with Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-64 overflow-hidden z-0">
        <div className="absolute w-64 h-64 rounded-full bg-[#C9A66B]/10 -top-32 -left-32"></div>
        <div className="absolute w-96 h-96 rounded-full bg-[#5A4232]/5 top-10 right-10"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="text-center mb-16">
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              className="inline-block mb-4"
            >
              <span className="inline-block w-20 h-1 bg-[#C9A66B] mb-4"></span>
              <h1 className="text-6xl font-serif text-[#5A4232] mb-4 tracking-wide">Craft Your Signature Candle</h1>
              <span className="inline-block w-20 h-1 bg-[#C9A66B] mt-2"></span>
            </motion.div>
            <p className="text-gray-700 text-xl max-w-2xl mx-auto font-light leading-relaxed">
              Personalize every detail—from fragrance to finish—and create a candle that's uniquely <em>yours</em>.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
            {/* Form Section - Takes 3/5 of the width on large screens */}
            <div className="lg:col-span-3">
              <motion.div 
                className="bg-white/90 backdrop-blur-md rounded-3xl p-10 shadow-xl border border-[#EBD6BD] overflow-hidden relative"
                whileHover={{ boxShadow: "0 25px 50px -12px rgba(90, 66, 50, 0.15)" }}
                transition={{ duration: 0.3 }}
              >
                <div className="absolute top-0 right-0 w-40 h-40 bg-[#C9A66B]/10 rounded-full -mr-20 -mt-20 z-0"></div>
                
                <h2 className="font-serif text-2xl mb-8 text-[#5A4232] relative z-10">Design Your Perfect Candle</h2>
                
                <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[
                      { 
                        label: 'Fragrance',
                        name: 'fragrance',
                        type: 'text',
                        placeholder: 'Lavender, Vanilla, etc.'
                      }, 
                      { 
                        label: 'Custom Label Text',
                        name: 'label',
                        type: 'text',
                        placeholder: 'Your special message'
                      }
                    ].map(({ label, name, type, placeholder }) => (
                      <div key={name} className="group">
                        <label className="block text-[#5A4232] font-serif mb-2 text-sm uppercase tracking-wider">{label}</label>
                        <input
                          type={type}
                          name={name}
                          value={formData[name]}
                          onChange={handleChange}
                          placeholder={placeholder}
                          className="w-full px-4 py-3 rounded-lg border-2 border-[#EBD6BD]/50 bg-white/70 focus:outline-none focus:ring-0 focus:border-[#C9A66B] transition-all duration-300"
                        />
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                      {
                        label: 'Size',
                        name: 'size',
                        options: [
                          { value: '4oz', label: '4 oz - Small' },
                          { value: '8oz', label: '8 oz - Medium' },
                          { value: '12oz', label: '12 oz - Large' },
                          { value: '16oz', label: '16 oz - Extra Large' }
                        ] 
                      },
                      {
                        label: 'Container',
                        name: 'container',
                        options: [
                          { value: 'glass', label: 'Elegant Glass' },
                          { value: 'ceramic', label: 'Artisan Ceramic' },
                          { value: 'metal', label: 'Vintage Metal' }
                        ] 
                      },
                      {
                        label: 'Quantity',
                        name: 'quantity',
                        type: 'number',
                        min: 1 
                      }
                    ].map((field) => (
                      <div key={field.name} className="group">
                        <label className="block text-[#5A4232] font-serif mb-2 text-sm uppercase tracking-wider">{field.label}</label>
                        {field.options ? (
                          <select
                            name={field.name}
                            value={formData[field.name]}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-lg border-2 border-[#EBD6BD]/50 bg-white/70 focus:outline-none focus:ring-0 focus:border-[#C9A66B] transition-all duration-300 appearance-none"
                            style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%235A4232'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem center', backgroundSize: '1rem' }}
                          >
                            {field.options.map(opt => (
                              <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                          </select>
                        ) : (
                          <input
                            type={field.type}
                            name={field.name}
                            value={formData[field.name]}
                            onChange={handleChange}
                            min={field.min}
                            className="w-full px-4 py-3 rounded-lg border-2 border-[#EBD6BD]/50 bg-white/70 focus:outline-none focus:ring-0 focus:border-[#C9A66B] transition-all duration-300"
                          />
                        )}
                      </div>
                    ))}
                  </div>

                  <div>
                    <label className="block text-[#5A4232] font-serif mb-2 text-sm uppercase tracking-wider">Special Instructions</label>
                    <textarea
                      name="specialInstructions"
                      value={formData.specialInstructions}
                      onChange={handleChange}
                      rows={4}
                      placeholder="Share your vision with us..."
                      className="w-full px-4 py-3 rounded-lg border-2 border-[#EBD6BD]/50 bg-white/70 focus:outline-none focus:ring-0 focus:border-[#C9A66B] transition-all duration-300"
                    />
                  </div>

                  <motion.button
                    type="submit"
                    className="w-full bg-gradient-to-r from-[#C9A66B] to-[#D4B683] text-white py-4 rounded-lg hover:from-[#5A4232] hover:to-[#785A46] transition-all duration-300 font-medium text-lg shadow-md"
                    whileHover={{ scale: 1.02 }} 
                    whileTap={{ scale: 0.98 }}
                  >
                    Submit Custom Order
                  </motion.button>
                </form>
              </motion.div>
            </div>

            {/* Info Section - Takes 2/5 of the width on large screens */}
            <div className="lg:col-span-2 space-y-8">
              <motion.div 
                className="bg-white/90 backdrop-blur-md rounded-3xl p-8 shadow-xl border border-[#EBD6BD] overflow-hidden relative"
                whileHover={{ boxShadow: "0 25px 50px -12px rgba(90, 66, 50, 0.15)" }}
                transition={{ duration: 0.3 }}
              >
                <div className="absolute bottom-0 right-0 w-32 h-32 bg-[#C9A66B]/10 rounded-full -mr-16 -mb-16"></div>
                
                <h2 className="text-2xl font-serif text-[#5A4232] mb-6 flex items-center">
                  <span className="w-8 h-8 rounded-full bg-[#C9A66B] flex items-center justify-center text-white mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                    </svg>
                  </span>
                  Why Choose Custom?
                </h2>
                
                <ul className="space-y-5 text-gray-700">
                  {[
                    {
                      title: "Personalized Experience",
                      text: "Create a unique fragrance blend tailored to your preferences"
                    },
                    {
                      title: "Quality Selection",
                      text: "Choose from various premium container styles and sizes"
                    },
                    {
                      title: "Personal Touch",
                      text: "Add meaningful details with custom labels and packaging"
                    },
                    {
                      title: "Perfect Gifting",
                      text: "Ideal for special events, celebrations, and thoughtful presents"
                    }
                  ].map((item, i) => (
                    <motion.li 
                      key={i} 
                      className="flex items-start gap-4 group"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.15 }}
                      whileHover={{ x: 5 }}
                    >
                      <span className="w-2 h-2 mt-2 rounded-full bg-[#C9A66B] group-hover:bg-[#5A4232] transition-colors" />
                      <div>
                        <h3 className="font-medium text-[#5A4232]">{item.title}</h3>
                        <p className="text-gray-600">{item.text}</p>
                      </div>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>

              <motion.div 
                className="bg-gradient-to-br from-[#5A4232] to-[#785A46] text-white rounded-3xl p-8 shadow-xl overflow-hidden relative"
                whileHover={{ boxShadow: "0 25px 50px -12px rgba(90, 66, 50, 0.25)" }}
                transition={{ duration: 0.3 }}
              >
                <div className="absolute top-0 left-0 w-40 h-40 bg-white/5 rounded-full -ml-20 -mt-20"></div>
                <div className="absolute bottom-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mb-16"></div>
                
                <h2 className="text-2xl font-serif mb-6 flex items-center">
                  <span className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                    </svg>
                  </span>
                  Need Help?
                </h2>
                
                <p className="mb-6 text-white/90 leading-relaxed">
                  Our fragrance experts are here to guide you through creating the perfect custom candle. 
                  Contact us for personalized recommendations and design assistance.
                </p>
                
                <motion.button
                  onClick={() => navigate('/contact')}
                  className="bg-white text-[#5A4232] px-8 py-3 rounded-lg hover:bg-[#F5E9DA] transition-colors shadow-md flex items-center"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                  </svg>
                  Contact Our Experts
                </motion.button>
              </motion.div>
            </div>
          </div>

          {/* Testimonials Section */}
          <div className="mt-16 mb-20">
            <div className="text-center mb-10">
              <h3 className="text-3xl font-serif text-[#5A4232]">What Our Customers Say</h3>
              <div className="w-20 h-1 bg-[#C9A66B]/50 mx-auto mt-4"></div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  text: "The custom candle exceeded all my expectations. The fragrance blend was perfect and the packaging was beautiful.",
                  author: "Emma S.",
                  role: "Repeat Customer"
                },
                {
                  text: "I ordered custom candles for my wedding favors and guests couldn't stop complimenting them. Worth every penny!",
                  author: "Michael T.",
                  role: "Wedding Client"
                },
                {
                  text: "The ability to customize every aspect made this a perfect gift for my mother. The customer service was exceptional.",
                  author: "Sarah L.",
                  role: "Gift Buyer"
                }
              ].map((testimonial, idx) => (
                <motion.div 
                  key={idx}
                  className="bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-[#EBD6BD]"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  viewport={{ once: true }}
                >
                  <svg className="h-8 w-8 text-[#C9A66B] mb-4" fill="currentColor" viewBox="0 0 32 32" aria-hidden="true">
                    <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
                  </svg>
                  <p className="text-gray-600 italic mb-4">{testimonial.text}</p>
                  <div className="flex items-center">
                    <div className="h-8 w-8 rounded-full bg-[#5A4232]/10 flex items-center justify-center text-[#5A4232] font-serif">
                      {testimonial.author[0]}
                    </div>
                    <div className="ml-3">
                      <h4 className="text-[#5A4232] font-medium">{testimonial.author}</h4>
                      <p className="text-gray-500 text-sm">{testimonial.role}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Enhanced Sliding Image Section */}
          <div className="mt-16 max-w-7xl mx-auto px-4">
            <div className="text-center mb-10">
              <h3 className="text-3xl font-serif text-[#5A4232]">Our Craft Gallery</h3>
              <p className="text-gray-600 mt-2">Handcrafted with care and attention to detail</p>
              <div className="w-20 h-1 bg-[#C9A66B]/50 mx-auto mt-4"></div>
            </div>
            
            <div className="relative overflow-hidden rounded-2xl border-2 border-[#EBD6BD] shadow-xl">
              <motion.div
                className="flex gap-6 w-max p-4"
                animate={controls}
                onMouseEnter={() => controls.stop()}
                onMouseLeave={() => {
                  controls.start({
                    x: ['0%', '-50%'],
                    transition: {
                      x: {
                        repeat: Infinity,
                        repeatType: 'loop',
                        ease: 'linear',
                        duration: 30,
                      },
                    },
                  });
                }}
              >
                {[...slideImages, ...slideImages].map((src, idx) => (
                  <motion.div
                    key={idx}
                    className="relative group"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: idx * 0.1 }}
                    viewport={{ once: true }}
                    whileHover={{ scale: 1.03 }}
                  >
                    <img
                      src={src}
                      alt={`Candle creation ${idx + 1}`}
                      className="h-64 w-96 object-cover rounded-lg shadow-md transition-all duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4 rounded-lg">
                      <p className="text-white text-center font-light text-sm">Handcrafted Premium Candle</p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
            
            <div className="text-center mt-8 mb-4">
              <motion.button
                onClick={() => navigate('/shop')}
                className="text-[#5A4232] border-b-2 border-[#C9A66B] hover:border-[#5A4232] transition-colors inline-flex items-center"
                whileHover={{ x: 5 }}
              >
                View our full gallery
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CustomOrder;


