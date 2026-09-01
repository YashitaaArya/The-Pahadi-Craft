import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Database, Eye, Share2, Cookie, MailOpen } from 'lucide-react';

const PrivacyPolicy: React.FC = () => {
  const [activeSection, setActiveSection] = useState('information-we-collect');

  const sections = [
    { id: 'information-we-collect', title: 'Information We Collect', icon: Database },
    { id: 'use-of-information', title: 'Use of Information', icon: Eye },
    { id: 'cookies', title: 'Cookies', icon: Cookie },
    { id: 'third-party-services', title: 'Third-Party Services', icon: Share2 },
    { id: 'data-security', title: 'Data Security', icon: Lock },
    { id: 'contact-us', title: 'Contact Us', icon: MailOpen },
  ];

  const content = {
    'information-we-collect': {
      title: 'Information We Collect',
      description: 'Types of personal information we gather',
      details: [
        'Personal information such as your name, email address, and phone number when you create an account or place an order.',
        'Shipping address and billing information necessary to process and deliver your orders.',
        'Payment information processed securely through our payment gateway (we do not store full card details).',
        'Email address when you subscribe to our newsletter for updates and promotional offers.',
        'Browsing behavior and preferences through cookies and analytics tools.',
      ],
    },
    'use-of-information': {
      title: 'Use of Information',
      description: 'How we use your personal data',
      details: [
        'Your information is used solely to process your orders and provide the services you request.',
        'We communicate order confirmations, shipping updates, and delivery notifications via email.',
        'We may send periodic newsletters with product updates and special offers (you can unsubscribe anytime).',
        'We use aggregated, anonymized data to improve our website functionality and user experience.',
        'We do not sell, rent, or trade your personal information to third parties under any circumstances.',
      ],
    },
    'cookies': {
      title: 'Cookies',
      description: 'How we use cookies on our website',
      details: [
        'We use cookies to personalize your browsing experience and remember your preferences.',
        'Cookies help us understand how you interact with our website to improve its performance.',
        'Session cookies are temporary and are deleted when you close your browser.',
        'Persistent cookies may remain on your device for future visits to enhance your experience.',
        'You can disable cookies through your browser settings, though some website features may not work properly.',
      ],
    },
    'third-party-services': {
      title: 'Third-Party Services',
      description: 'External services we partner with',
      details: [
        'We use secure payment gateways to process transactions — these providers have their own privacy policies.',
        'Shipping and logistics partners may have access to delivery address information only.',
        'Analytics tools help us understand website usage patterns without collecting personally identifiable information.',
        'We recommend reviewing the privacy policies of third-party services as they operate independently.',
        'We ensure all third-party partners comply with data protection regulations.',
      ],
    },
    'data-security': {
      title: 'Data Security',
      description: 'How we protect your information',
      details: [
        'We implement industry-standard security measures including SSL encryption to protect your data.',
        'Your payment information is transmitted securely and never stored on our servers.',
        'We maintain secure servers with regular backups to prevent unauthorized access or data loss.',
        'Our team follows strict protocols for handling and storing customer information.',
        'However, no method of transmission over the internet is 100% secure — we cannot guarantee absolute security.',
      ],
    },
    'contact-us': {
      title: 'Contact Us',
      description: 'Get in touch with our privacy team',
      details: [
        'If you have questions about our privacy practices, please don\'t hesitate to reach out.',
        'Send us an email at pahadicraft@gmail.com with the subject "Privacy Inquiry".',
        'You can also call us during business hours for any data privacy concerns.',
        'We will respond to your privacy inquiries within 7 business days.',
        'You have the right to request access to, correction of, or deletion of your personal information.',
      ],
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF8F2] to-[#F0E6F6] pt-24 pb-20 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="w-16 h-16 rounded-full bg-[#E6CCE6] flex items-center justify-center mx-auto mb-6">
            <Lock className="w-8 h-8 text-[#9370DB]" />
          </div>
          <h1 className="text-5xl font-serif text-[#5A4232] mb-4">Privacy Policy</h1>
          <p className="text-[#8B6B47] max-w-2xl mx-auto text-lg">
            Your privacy is important to us. This policy outlines exactly how we collect, use, protect, and respect your personal information.
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
              <h3 className="text-lg font-serif text-[#5A4232] mb-4 pb-3 border-b-2 border-[#9370DB]">
                Sections
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
                          ? 'bg-[#9370DB] text-white shadow-md'
                          : 'text-[#5A4232] hover:bg-[#F0E6F6]'
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
                  const Icon = sections.find((s) => s.id === activeSection)?.icon || Lock;

                  return (
                    <>
                      <div className="flex items-center gap-4 mb-6 pb-6 border-b-2 border-[#F0E6F6]">
                        <div className="w-12 h-12 rounded-full bg-[#E6CCE6] flex items-center justify-center flex-shrink-0">
                          <Icon className="w-6 h-6 text-[#9370DB]" />
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
                            <div className="w-6 h-6 rounded-full bg-[#9370DB] flex items-center justify-center flex-shrink-0 mt-1 group-hover:scale-110 transition-transform">
                              <span className="text-white text-xs font-bold">✓</span>
                            </div>
                            <p className="text-[#6B5849] leading-relaxed flex-1 group-hover:text-[#5A4232] transition-colors">
                              {detail}
                            </p>
                          </motion.div>
                        ))}
                      </div>

                      <div className="mt-8 pt-6 border-t border-[#F0E6F6] bg-[#F9F4EF] rounded-lg p-4">
                        <p className="text-sm text-[#8B6B47]">
                          🔒 <strong>Data Protection:</strong> We are committed to protecting your privacy in accordance with applicable data protection laws.
                        </p>
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
          className="mt-12 bg-gradient-to-r from-[#E6CCE6] to-[#D8BFD8] rounded-xl p-6 border border-[#D8BFD8]"
        >
          <p className="text-[#5A3A7A] font-semibold mb-2">📋 Important Notice:</p>
          <p className="text-[#5A3A7A] leading-relaxed">
            This Privacy Policy is effective as of September 2026. We may update this policy periodically to reflect changes in our practices or applicable laws. We will notify you of any significant changes via email or by posting the updated policy on our website. Your continued use of our website after such modifications constitutes your acceptance of the updated Privacy Policy.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-8 text-center"
        >
          <p className="text-[#8B6B47] max-w-2xl mx-auto">
            For privacy-related concerns or to exercise your data rights, please{' '}
            <a href="/contact" className="text-[#9370DB] font-semibold hover:text-[#5A4232] transition-colors underline">
              contact us
            </a>
            .
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
