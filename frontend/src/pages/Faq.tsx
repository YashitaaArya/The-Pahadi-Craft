import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle } from 'lucide-react';

interface FaqItem {
  question: string;
  answer: string;
  category: string;
}

const FAQ_ITEMS: FaqItem[] = [
  {
    category: 'Products',
    question: 'What kinds of products do you offer?',
    answer: 'Handcrafted candles, bath salts and soaps, resin jewellery, resin artifacts (trays, jars, candle holders), concrete artifacts, terracotta and clay pieces, and occasion-based collections for festivals like Diwali, Christmas, Rakhi, and Ganesh Chaturthi.',
  },
  {
    category: 'Products',
    question: 'Are your candles scented or unscented?',
    answer: 'Both — each product page tells you whether it\'s scented, and if so, which fragrance notes it carries. We use skin-safe, lead-free wicks and quality wax throughout.',
  },
  {
    category: 'Products',
    question: 'Can I customize a candle scent or design?',
    answer: 'Yes! Visit our Custom Order page to choose your preferred fragrance, container, and packaging.',
  },
  {
    category: 'Products',
    question: 'Where are your products made?',
    answer: 'Every piece is hand-crafted by artisans in Himachal Pradesh, India — rooted in the region\'s craft traditions.',
  },
  {
    category: 'Orders & Payment',
    question: 'How can I place an order?',
    answer: 'Browse our Shop page, add items to your cart, and check out securely online. You\'ll need an account to track your order and orders history.',
  },
  {
    category: 'Orders & Payment',
    question: 'Can I cancel or change my order after placing it?',
    answer: 'Orders can be changed or canceled within 12 hours of placement. Email us at pahadicraft@gmail.com with your order details as soon as possible.',
  },
  {
    category: 'Orders & Payment',
    question: 'What if my order arrives damaged?',
    answer: 'Contact us within 48 hours of delivery with a photo of the damaged item, and we\'ll arrange a replacement or refund.',
  },
  {
    category: 'Shipping',
    question: 'Do you ship across India?',
    answer: 'Yes, we ship nationwide. See our Shipping Info page for delivery timelines and charges.',
  },
  {
    category: 'Shipping',
    question: 'How do I track my order?',
    answer: 'Once your order ships, you\'ll get tracking details by email so you can follow it in real time.',
  },
  {
    category: 'Shipping',
    question: 'Do you ship internationally?',
    answer: 'Not yet — we currently ship within India only, but international shipping is on our roadmap.',
  },
  {
    category: 'Other',
    question: 'Do you offer gift wrapping?',
    answer: 'Yes, we offer beautiful, eco-friendly gift wrapping — just select the option at checkout.',
  },
];

const CATEGORIES = ['All', ...Array.from(new Set(FAQ_ITEMS.map((f) => f.category)))];

const Faq: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [activeCategory, setActiveCategory] = useState('All');

  const visibleItems = FAQ_ITEMS.filter((f) => activeCategory === 'All' || f.category === activeCategory);

  return (
    <div className="min-h-screen bg-[#FFF8F2] pt-24 pb-20 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <div className="w-14 h-14 rounded-full bg-[#F5E9DA] flex items-center justify-center mx-auto mb-4">
            <HelpCircle className="w-7 h-7 text-[#C9A66B]" />
          </div>
          <h1 className="text-4xl font-serif text-[#5A4232] mb-3">Frequently Asked Questions</h1>
          <p className="text-gray-500">Everything you need to know before you shop with us.</p>
        </div>

        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => { setActiveCategory(cat); setOpenIndex(null); }}
              className={`px-4 py-1.5 rounded-full text-sm transition-colors ${
                activeCategory === cat
                  ? 'bg-[#5A4232] text-white'
                  : 'bg-white text-[#5A4232] border border-[#E6DFD7] hover:bg-[#F5E9DA]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="space-y-3">
          {visibleItems.map((item, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div key={item.question} className="bg-white rounded-xl border border-[#E6DFD7] overflow-hidden">
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left"
                >
                  <span className="font-serif text-[#5A4232] text-lg">{item.question}</span>
                  <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                    <ChevronDown className="w-5 h-5 text-[#C9A66B] flex-shrink-0" />
                  </motion.div>
                </button>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <p className="px-5 pb-4 text-gray-600 leading-relaxed">{item.answer}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        <div className="text-center mt-10 text-gray-500 text-sm">
          Still have a question? <a href="/contact" className="text-[#C9A66B] hover:text-[#5A4232] underline">Reach out to us</a> — we're happy to help.
        </div>
      </div>
    </div>
  );
};

export default Faq;