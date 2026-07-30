import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, MapPin, Phone, Instagram, Clock } from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const body = `Name: ${formData.name}\nEmail: ${formData.email}\nSubject: ${formData.subject}\n\nMessage:\n${formData.message}`;
    window.location.href = `mailto:pahadicraft@gmail.com?subject=Contact Form: ${formData.subject}&body=${encodeURIComponent(body)}`;
  };

  return (
    <div className="min-h-screen pt-20 bg-[#FFF8F2]">
      {/* Decorative top element */}
      <div className="absolute top-0 left-0 right-0 h-72 bg-[#5A4232]/10 -z-10 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[url('/pattern.svg')] bg-repeat bg-center opacity-20"></div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10"
        >
          <div className="text-center mb-16">
            <h1 className="text-5xl font-serif text-[#5A4232] mb-4 relative inline-block">
              Contact Us
              <span className="absolute -bottom-2 left-0 right-0 h-1 bg-[#C9A66B]/60 transform -rotate-1"></span>
            </h1>
            <p className="text-[#7A6A5A] max-w-2xl mx-auto text-lg">
              Have a question or custom request? We'd love to hear from you and help bring your vision to life.
            </p>
          </div>

          {/* Contact section with refined layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-20">
            {/* Contact Form Card */}
            <div className="lg:col-span-2">
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-8 shadow-lg border border-white/50">
                <h2 className="text-2xl font-serif text-[#5A4232] mb-6">Send us a Message</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[#5A4232] font-serif mb-2 text-sm">Name</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        placeholder="Your name"
                        className="w-full px-4 py-3 rounded-lg border border-[#E8DDD0] bg-white/90 focus:outline-none focus:ring-2 focus:ring-[#C9A66B] transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-[#5A4232] font-serif mb-2 text-sm">Email</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        placeholder="Your email"
                        className="w-full px-4 py-3 rounded-lg border border-[#E8DDD0] bg-white/90 focus:outline-none focus:ring-2 focus:ring-[#C9A66B] transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[#5A4232] font-serif mb-2 text-sm">Subject</label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      placeholder="Subject of your message"
                      className="w-full px-4 py-3 rounded-lg border border-[#E8DDD0] bg-white/90 focus:outline-none focus:ring-2 focus:ring-[#C9A66B] transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-[#5A4232] font-serif mb-2 text-sm">Message</label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={6}
                      placeholder="Type your message here..."
                      className="w-full px-4 py-3 rounded-lg border border-[#E8DDD0] bg-white/90 focus:outline-none focus:ring-2 focus:ring-[#C9A66B] transition-all"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-[#C9A66B] text-white py-4 rounded-lg hover:bg-[#5A4232] transition-colors shadow-md hover:shadow-lg font-medium text-lg"
                  >
                    Send Message
                  </button>
                </form>
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-6">
              <div className="bg-[#5A4232] text-white rounded-xl p-8 shadow-lg">
                <h2 className="text-2xl font-serif mb-6">Get in Touch</h2>
                
                <div className="space-y-6">
                  <div className="flex items-start">
                    <div className="bg-[#C9A66B]/20 p-2 rounded-full mr-4">
                      <Phone className="h-5 w-5 text-[#C9A66B]" />
                    </div>
                    <div>
                      <h3 className="font-serif text-[#C9A66B]">Phone</h3>
                      <p className="text-white/90">+91 7660077316</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-[#C9A66B]/20 p-2 rounded-full mr-4">
                      <Mail className="h-5 w-5 text-[#C9A66B]" />
                    </div>
                    <div>
                      <h3 className="font-serif text-[#C9A66B]">Email</h3>
                      <p className="text-white/90">pahadicraft@gmail.com</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-[#C9A66B]/20 p-2 rounded-full mr-4">
                      <MapPin className="h-5 w-5 text-[#C9A66B]" />
                    </div>
                    <div>
                      <h3 className="font-serif text-[#C9A66B]">Address</h3>
                      <p className="text-white/90">Pahadi Craft, Gagret, Distt.Una, Himachal Pradesh-177201</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-[#C9A66B]/20 p-2 rounded-full mr-4">
                      <Instagram className="h-5 w-5 text-[#C9A66B]" />
                    </div>
                    <div>
                      <h3 className="font-serif text-[#C9A66B]">Instagram</h3>
                      <p className="text-white/90">@pahadi.craft</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="bg-[#C9A66B]/20 p-2 rounded-full mr-4">
                      <Clock className="h-5 w-5 text-[#C9A66B]" />
                    </div>
                    <div>
                      <h3 className="font-serif text-[#C9A66B]">Hours</h3>
                      <p className="text-white/90">Mon-Sat: 9:00 AM - 6:00 PM</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-8 shadow-lg border border-white/50">
                <h2 className="text-2xl font-serif text-[#5A4232] mb-4">Connect With Us</h2>
                <p className="text-[#7A6A5A] mb-6">
                  Follow us on social media for product updates, behind-the-scenes content, and more.
                </p>
                <div className="flex space-x-4">
                  <a href="#" className="bg-[#5A4232] p-3 rounded-full text-white hover:bg-[#C9A66B] transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                    </svg>
                  </a>
                  <a href="#" className="bg-[#5A4232] p-3 rounded-full text-white hover:bg-[#C9A66B] transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                    </svg>
                  </a>
                  <a href="#" className="bg-[#5A4232] p-3 rounded-full text-white hover:bg-[#C9A66B] transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
                    </svg>
                  </a>
                  <a href="https://wa.me/917660077316" target="_blank" rel="noopener noreferrer" className="bg-[#5A4232] p-3 rounded-full text-white hover:bg-[#C9A66B] transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Google Maps Section */}
          <div className="mb-12">
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/50">
              <h2 className="text-2xl font-serif text-[#5A4232] mb-6 text-center">Visit Our Location</h2>
              <div className="h-96 w-full rounded-lg overflow-hidden shadow-md">
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3457.65222052065!2d76.0630474!3d31.6680446!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x391b1f3900000001%3A0xe22cb75077411824!2sPahadiCraft%20Candles%20Himachal!5e1!3m2!1sen!2sin!4v1757180258108!5m2!1sen!2sin" 
                  width="100%" 
                  height="100%" 
                  style={{ border: 0 }} 
                  allowFullScreen={true} 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Pahadi Craft Location"
                ></iframe>
              </div>
            </div>
          </div>

          {/* FAQ or Additional Information */}
          <div className="bg-[#F5E9DA]/50 rounded-xl p-8 shadow-sm mb-12">
            <h2 className="text-2xl font-serif text-[#5A4232] mb-6 text-center">Frequently Asked Questions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-serif text-[#5A4232] text-lg mb-2">How long does shipping take?</h3>
                <p className="text-[#7A6A5A]">We typically process orders within 1-2 business days. Domestic shipping takes 3-7 business days, while international shipping can take 10-14 business days.</p>
              </div>
              <div>
                <h3 className="font-serif text-[#5A4232] text-lg mb-2">Do you offer custom orders?</h3>
                <p className="text-[#7A6A5A]">Yes! We love bringing custom ideas to life. Please reach out with your requirements and we'll be happy to discuss possibilities.</p>
              </div>
              <div>
                <h3 className="font-serif text-[#5A4232] text-lg mb-2">What payment methods do you accept?</h3>
                <p className="text-[#7A6A5A]">We accept credit/debit cards, UPI payments, and bank transfers. All transactions are secure and encrypted.</p>
              </div>
              <div>
                <h3 className="font-serif text-[#5A4232] text-lg mb-2">How can I track my order?</h3>
                <p className="text-[#7A6A5A]">Once your order ships, you'll receive a tracking number via email. You can also contact us directly for updates on your order.</p>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center">
            <p className="text-[#7A6A5A] italic">
              "Handcrafted with love in the heart of Himachal."
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Contact;
