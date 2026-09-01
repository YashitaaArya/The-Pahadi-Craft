import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, DollarSign, RotateCcw, Edit3, CheckCircle } from 'lucide-react';

const Terms: React.FC = () => {
  const [activeSection, setActiveSection] = useState('use-of-website');

  const sections = [
    { id: 'use-of-website', title: 'Use of Website', icon: ShieldAlert },
    { id: 'product-availability', title: 'Product Availability', icon: CheckCircle },
    { id: 'pricing-payment', title: 'Pricing & Payment', icon: DollarSign },
    { id: 'returns-refunds', title: 'Returns & Refunds', icon: RotateCcw },
    { id: 'changes-to-terms', title: 'Changes to Terms', icon: Edit3 },
  ];

  const content = {
    'use-of-website': {
      title: 'Use of Website',
      description: 'How you can use our website',
      details: [
        'This website is intended for personal and non-commercial use only.',
        'You may not use our content, images, or products for any unauthorized or illegal purpose.',
        'Any attempt to breach, bypass, or circumvent our security measures is prohibited.',
        'You agree not to engage in any activity that could damage, overload, or impair our website.',
      ],
    },
    'product-availability': {
      title: 'Product Availability',
      description: 'Important information about product stock and availability',
      details: [
        'All products displayed on the website are subject to availability.',
        'We reserve the right to discontinue or modify products without prior notice.',
        'Product images shown are for representation purposes and may vary slightly from the actual product.',
        'Stock levels may change rapidly, and availability is confirmed upon order placement.',
      ],
    },
    'pricing-payment': {
      title: 'Pricing & Payment',
      description: 'How we handle pricing and payments',
      details: [
        'All prices are listed in INR and are inclusive of applicable taxes unless stated otherwise.',
        'Payment must be completed in full before an order is confirmed and shipped.',
        'We accept multiple payment methods including credit/debit cards and digital wallets.',
        'Promotional codes and discounts are non-transferable and valid only as specified.',
      ],
    },
    'returns-refunds': {
      title: 'Returns & Refunds',
      description: 'Our policy on returns and refunds',
      details: [
        'Please refer to our return policy page for detailed information.',
        'Eligible returns must be initiated within 7 days of delivery.',
        'Refunds will be processed to the original payment method within 5-7 business days.',
        'Shipping costs for returns are non-refundable unless the return is due to our error.',
      ],
    },
    'changes-to-terms': {
      title: 'Changes to Terms',
      description: 'How we handle updates to these terms',
      details: [
        'We reserve the right to update these terms at any time.',
        'Changes will be posted on this page with an updated date.',
        'Your continued use of the site constitutes acceptance of those changes.',
        'We recommend reviewing this page periodically for any updates.',
      ],
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF8F2] to-[#F5E9DA] pt-24 pb-20 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="w-16 h-16 rounded-full bg-[#FFE4E1] flex items-center justify-center mx-auto mb-6">
            <ShieldAlert className="w-8 h-8 text-[#DC143C]" />
          </div>
          <h1 className="text-5xl font-serif text-[#5A4232] mb-4">Terms and Conditions</h1>
          <p className="text-[#8B6B47] max-w-2xl mx-auto text-lg">
            Please read these terms carefully before using our website and placing orders. By accessing our site, you agree to comply with all terms outlined below.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar - Table of Contents */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-1"
          >
            <div className="bg-white rounded-xl p-6 shadow-lg sticky top-24 h-fit">
              <h3 className="text-lg font-serif text-[#5A4232] mb-4 pb-3 border-b-2 border-[#C9A66B]">
                Quick Navigation
              </h3>
              <nav className="space-y-2">
                {sections.map((section) => {
                  const Icon = section.icon;
                  return (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-left ${
                        activeSection === section.id
                          ? 'bg-[#C9A66B] text-white shadow-md'
                          : 'text-[#5A4232] hover:bg-[#F5E9DA]'
                      }`}
                    >
                      <Icon className="w-5 h-5 flex-shrink-0" />
                      <span className="text-sm font-medium">{section.title}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </motion.div>

          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-3"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSection}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-xl p-8 shadow-lg"
              >
                {(() => {
                  const section = content[activeSection as keyof typeof content];
                  const Icon = sections.find((s) => s.id === activeSection)?.icon || ShieldAlert;

                  return (
                    <>
                      <div className="flex items-center gap-4 mb-6 pb-6 border-b-2 border-[#F5E9DA]">
                        <div className="w-12 h-12 rounded-full bg-[#FFE4E1] flex items-center justify-center flex-shrink-0">
                          <Icon className="w-6 h-6 text-[#DC143C]" />
                        </div>
                        <div>
                          <h2 className="text-3xl font-serif text-[#5A4232]">{section.title}</h2>
                          <p className="text-[#8B6B47] text-sm">{section.description}</p>
                        </div>
                      </div>

                      <div className="space-y-4">
                        {section.details.map((detail, idx) => (
                          <motion.div
                            key={idx}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="flex gap-4 items-start group"
                          >
                            <div className="w-6 h-6 rounded-full bg-[#C9A66B] flex items-center justify-center flex-shrink-0 mt-1 group-hover:scale-110 transition-transform">
                              <span className="text-white text-xs font-bold">{idx + 1}</span>
                            </div>
                            <p className="text-[#6B5849] leading-relaxed flex-1 group-hover:text-[#5A4232] transition-colors">
                              {detail}
                            </p>
                          </motion.div>
                        ))}
                      </div>

                      <div className="mt-8 pt-6 border-t border-[#F5E9DA] bg-[#FFF8F2] rounded-lg p-4">
                        <p className="text-sm text-[#8B6B47]">
                          📌 <strong>Last Updated:</strong> September 2026. Please check back periodically for updates to our Terms and Conditions.
                        </p>
                      </div>
                    </>
                  );
                })()}
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Footer Note */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-12 text-center"
        >
          <p className="text-[#8B6B47] max-w-2xl mx-auto">
            If you have any questions about these terms, please don't hesitate to{' '}
            <a href="/contact" className="text-[#C9A66B] font-semibold hover:text-[#5A4232] transition-colors underline">
              contact us
            </a>
            .
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Terms;
