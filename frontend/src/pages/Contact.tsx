import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Mail, MapPin, Phone, Instagram, Clock, Loader2, CheckCircle2 } from 'lucide-react';
import axios from 'axios';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    setErrorMsg('');
    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/contact`, formData);
      setStatus('sent');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (err: any) {
      setStatus('error');
      setErrorMsg(err?.response?.data?.error || 'Something went wrong, please try again.');
    }
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
                {status === 'sent' ? (
                  <div className="flex flex-col items-center text-center py-10">
                    <CheckCircle2 className="w-12 h-12 text-green-600 mb-4" />
                    <p className="text-[#5A4232] font-serif text-xl mb-2">Message sent!</p>
                    <p className="text-[#7A6A5A]">We've received your message and will get back to you soon.</p>
                    <button
                      onClick={() => setStatus('idle')}
                      className="mt-6 text-[#C9A66B] hover:text-[#5A4232] text-sm underline"
                    >
                      Send another message
                    </button>
                  </div>
                ) : (
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

                  {status === 'error' && (
                    <p className="text-red-600 text-sm text-center">{errorMsg}</p>
                  )}

                  <button
                    type="submit"
                    disabled={status === 'sending'}
                    className="w-full bg-[#C9A66B] text-white py-4 rounded-lg hover:bg-[#5A4232] transition-colors shadow-md hover:shadow-lg font-medium text-lg disabled:opacity-60 flex items-center justify-center gap-2"
                  >
                    {status === 'sending' && <Loader2 className="w-5 h-5 animate-spin" />}
                    {status === 'sending' ? 'Sending...' : 'Send Message'}
                  </button>
                </form>
                )}
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
                      <a href="tel:+917660077316" className="text-white/90 hover:text-[#C9A66B] transition-colors">+91 7660077316</a>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-[#C9A66B]/20 p-2 rounded-full mr-4">
                      <Mail className="h-5 w-5 text-[#C9A66B]" />
                    </div>
                    <div>
                      <h3 className="font-serif text-[#C9A66B]">Email</h3>
                      <a href="mailto:pahadicraft@gmail.com" className="text-white/90 hover:text-[#C9A66B] transition-colors">pahadicraft@gmail.com</a>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-[#C9A66B]/20 p-2 rounded-full mr-4">
                      <MapPin className="h-5 w-5 text-[#C9A66B]" />
                    </div>
                    <div>
                      <h3 className="font-serif text-[#C9A66B]">Address</h3>
                      <a
                        href="https://www.google.com/maps/place/?q=place_id:ChIJAQAAADkfGzkRJBhBd1C3LOI"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-white/90 hover:text-[#C9A66B] transition-colors"
                      >
                        Pahadi Craft, Gagret, Distt.Una, Himachal Pradesh-177201
                      </a>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-[#C9A66B]/20 p-2 rounded-full mr-4">
                      <Instagram className="h-5 w-5 text-[#C9A66B]" />
                    </div>
                    <div>
                      <h3 className="font-serif text-[#C9A66B]">Instagram</h3>
                      <a
                        href="https://www.instagram.com/pahadi_craft"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-white/90 hover:text-[#C9A66B] transition-colors"
                      >
                        @pahadi_craft
                      </a>
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
                  <a
                    href="https://www.instagram.com/pahadi_craft"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-[#5A4232] p-3 rounded-full text-white hover:bg-[#C9A66B] transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                    </svg>
                  </a>
                  <a
                    href="https://www.facebook.com/neetyarya/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-[#5A4232] p-3 rounded-full text-white hover:bg-[#C9A66B] transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                    </svg>
                  </a>
                  {/* YouTube link goes here once the channel URL is confirmed */}
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

          {/* FAQ */}
          <div className="bg-[#F5E9DA]/50 rounded-xl p-8 shadow-sm mb-12 text-center">
            <h2 className="text-2xl font-serif text-[#5A4232] mb-3">Have Questions?</h2>
            <p className="text-[#7A6A5A] mb-6 max-w-xl mx-auto">
              We've answered the most common questions about our products, orders, and shipping on one page.
            </p>
            <Link
              to="/faq"
              className="inline-block px-6 py-3 bg-[#C9A66B] text-white rounded-lg hover:bg-[#5A4232] transition-colors font-medium"
            >
              View All FAQs
            </Link>
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