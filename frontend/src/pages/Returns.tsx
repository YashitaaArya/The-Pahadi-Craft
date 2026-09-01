import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCcw, Box, ShieldCheck, Mail, ArrowLeftRight, CircleDollarSign } from 'lucide-react';

const Returns: React.FC = () => {
  const [activeSection, setActiveSection] = useState('return-window');

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, []);

  const sections = [
    { id: 'return-window', title: 'Return Window', icon: RefreshCcw },
    { id: 'non-returnable', title: 'Non-returnable Items', icon: Box },
    { id: 'damaged', title: 'Damaged or Defective', icon: ShieldCheck },
    { id: 'initiate', title: 'How to Initiate a Return', icon: ArrowLeftRight },
    { id: 'refunds', title: 'Refund Process', icon: CircleDollarSign },
  ];

  const content = {
    'return-window': {
      title: 'Return Window',
      description: 'How long you have to return an item',
      details: [
        'Returns are accepted within 7 days of delivery.',
        'Items must be unused, in their original condition, and packed in the original packaging.',
        'The return request must be raised through our support email before the window closes.',
        'We review all return requests to ensure the item qualifies under our policy.',
      ],
    },
    'non-returnable': {
      title: 'Non-returnable Items',
      description: 'Items that cannot be returned once delivered',
      details: [
        'Used candles or partially burned products are not eligible for return.',
        'Custom or personalized orders are non-returnable and non-exchangeable.',
        'Gift cards cannot be returned or refunded.',
        'Products damaged due to misuse or improper storage will not qualify.',
      ],
    },
    'damaged': {
      title: 'Damaged or Defective Products',
      description: 'What to do if your order arrives damaged',
      details: [
        'If your item arrived damaged or defective, email us at candlelightduke@gmail.com with photo proof within 48 hours of receiving the order.',
        'We may ask for additional information to verify the issue before approving the claim.',
        'Once approved, we will arrange a replacement or refund depending on your preference.',
        'We treat all damage claims with priority so your issue is resolved as quickly as possible.',
      ],
    },
    'initiate': {
      title: 'How to Initiate a Return',
      description: 'Simple steps to start your return request',
      details: [
        'Email us with your order ID and the reason for your return.',
        'Wait for return confirmation and shipping instructions from our support team.',
        'Ship the item back using a trackable courier for your safety and convenience.',
        'Please keep the tracking number until the return is completed and verified.',
      ],
    },
    'refunds': {
      title: 'Refund Process',
      description: 'When refunds are issued and how long they take',
      details: [
        'Refunds are initiated once the returned item has been inspected and accepted.',
        'Approved refunds are processed back to the original payment method.',
        'Refunds may take 5-7 business days to reflect depending on your bank or payment provider.',
        'We keep you updated at every step so you always know the status of your request.',
      ],
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF8F2] to-[#F5E9DA] pt-24 pb-20 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="w-16 h-16 rounded-full bg-[#F5E9DA] flex items-center justify-center mx-auto mb-6">
            <RefreshCcw className="w-8 h-8 text-[#C9A66B]" />
          </div>
          <h1 className="text-5xl font-serif text-[#5A4232] mb-4">Returns & Exchanges</h1>
          <p className="text-[#8B6B47] max-w-2xl mx-auto text-lg">
            We stand by the quality of our products and want you to be fully satisfied with every order.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-1"
          >
            <div className="bg-white rounded-xl p-6 shadow-lg sticky top-24 h-fit">
              <h3 className="text-lg font-serif text-[#5A4232] mb-4 pb-3 border-b-2 border-[#C9A66B]">
                Quick Info
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
                  const Icon = sections.find((s) => s.id === activeSection)?.icon || RefreshCcw;

                  return (
                    <>
                      <div className="flex items-center gap-4 mb-6 pb-6 border-b-2 border-[#F5E9DA]">
                        <div className="w-12 h-12 rounded-full bg-[#F5E9DA] flex items-center justify-center flex-shrink-0">
                          <Icon className="w-6 h-6 text-[#C9A66B]" />
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
                    </>
                  );
                })()}
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-12 bg-gradient-to-r from-[#F5E9DA] to-[#FBE7D4] rounded-xl p-6 border border-[#E9D7C1]"
        >
          <p className="text-[#5A4232] font-semibold mb-2 flex items-center gap-2">
            <Mail className="w-5 h-5" /> Need Help?
          </p>
          <p className="text-[#6B5849] leading-relaxed">
            Reach out to our customer support team for any questions or help with the return process. We are here to assist you.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Returns;


