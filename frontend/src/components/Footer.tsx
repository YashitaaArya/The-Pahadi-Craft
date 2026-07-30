import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Mail, MapPin, Phone, ArrowRight, Send } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-[#5A4232] to-[#3A2A20] text-white">
      {/* Decorative top border */}
      <div className="h-1 bg-gradient-to-r from-transparent via-[#C9A66B] to-transparent"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Newsletter signup section */}
        <div className="mb-12 pb-12 border-b border-[#6B5242]">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="max-w-lg">
              <h3 className="text-2xl font-serif font-light mb-2">Join Our <span className="text-[#C9A66B] font-medium">Newsletter</span></h3>
              <p className="text-gray-300">Subscribe to receive updates, access to exclusive deals, and more.</p>
            </div>
            <div className="w-full md:w-auto">
              <div className="flex">
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  className="px-4 py-3 bg-[#3A2A20]/60 border border-[#6B5242] rounded-l-md w-full md:w-80 focus:outline-none focus:border-[#C9A66B]"
                />
                <button className="bg-[#C9A66B] hover:bg-[#D9B67B] px-4 rounded-r-md transition-colors duration-300">
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div>
            <div className="mb-6">
              <h3 className="text-3xl font-serif font-light tracking-wider mb-2">Pahadi<span className="text-[#C9A66B] font-normal">craft</span></h3>
              <div className="h-0.5 w-16 bg-[#C9A66B] mb-4"></div>
            </div>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Illuminating spaces with handcrafted elegance since 2020. Artisan crafts that bring the essence of mountain craftsmanship to your home.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 rounded-full bg-[#3A2A20] flex items-center justify-center hover:bg-[#C9A66B] transition-colors duration-300">
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="https://www.instagram.com/pahadi_craft?igsh=MWZja2s0cXNycTNnZA=="
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-[#3A2A20] flex items-center justify-center hover:bg-[#C9A66B] transition-colors duration-300"
              >
                <Instagram className="w-5 h-5" />
              </a>
              {/* <a href="#" className="w-10 h-10 rounded-full bg-[#3A2A20] flex items-center justify-center hover:bg-[#C9A66B] transition-colors duration-300">
                <Twitter className="w-5 h-5" />
              </a> */}
            </div>
          </div>

          <div>
            <h4 className="font-serif text-xl mb-6 font-light tracking-wide">Quick Links</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/shop" className="hover:text-[#C9A66B] transition-colors flex items-center group">
                  <ArrowRight className="w-4 h-4 mr-2 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                  <span>Shop</span>
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-[#C9A66B] transition-colors flex items-center group">
                  <ArrowRight className="w-4 h-4 mr-2 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                  <span>About Us</span>
                </Link>
              </li>
              <li>
                <Link to="/blog" className="hover:text-[#C9A66B] transition-colors flex items-center group">
                  <ArrowRight className="w-4 h-4 mr-2 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                  <span>Blog</span>
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-[#C9A66B] transition-colors flex items-center group">
                  <ArrowRight className="w-4 h-4 mr-2 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                  <span>Contact</span>
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-serif text-xl mb-6 font-light tracking-wide">Customer Service</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/shipping" className="hover:text-[#C9A66B] transition-colors flex items-center group">
                  <ArrowRight className="w-4 h-4 mr-2 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                  <span>Shipping Info</span>
                </Link>
              </li>
              <li>
                <Link to="/returns" className="hover:text-[#C9A66B] transition-colors flex items-center group">
                  <ArrowRight className="w-4 h-4 mr-2 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                  <span>Returns & Exchanges</span>
                </Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-[#C9A66B] transition-colors flex items-center group">
                  <ArrowRight className="w-4 h-4 mr-2 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                  <span>FAQ</span>
                </Link>
              </li>
              <li>
                <Link to="/care-guide" className="hover:text-[#C9A66B] transition-colors flex items-center group">
                  <ArrowRight className="w-4 h-4 mr-2 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                  <span>Candle Care Guide</span>
                </Link>
              </li>
              <li>
                <Link to="/terms-conditions" className="hover:text-[#C9A66B] transition-colors flex items-center group">
                  <ArrowRight className="w-4 h-4 mr-2 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                  <span>Terms and Conditions</span>
                </Link>
              </li>
              <li>
                <Link to="/privacy-policy" className="hover:text-[#C9A66B] transition-colors flex items-center group">
                  <ArrowRight className="w-4 h-4 mr-2 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                  <span>Privacy Policy</span>
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-serif text-xl mb-6 font-light tracking-wide">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="min-w-10 h-10 rounded-full bg-[#3A2A20] flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-[#C9A66B]" />
                </div>
                <span className="text-gray-300">Pahadi Craft, Gagret, Distt.Una, Himachal Pradesh-177201</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="min-w-10 h-10 rounded-full bg-[#3A2A20] flex items-center justify-center">
                  <Phone className="w-5 h-5 text-[#C9A66B]" />
                </div>
                <span className="text-gray-300">(+91) 7660077316</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="min-w-10 h-10 rounded-full bg-[#3A2A20] flex items-center justify-center">
                  <Mail className="w-5 h-5 text-[#C9A66B]" />
                </div>
                <span className="text-gray-300">pahadicraft@gmail.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom section with copyright */}
        <div className="mt-12 pt-8 text-center text-gray-400">
          <div className="flex justify-center mb-6">
            <div className="h-px w-24 bg-gradient-to-r from-transparent via-[#C9A66B] to-transparent"></div>
          </div>
          <p className="text-sm">&copy; {new Date().getFullYear()} <span className="text-[#C9A66B]">Pahadicraft</span>. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;