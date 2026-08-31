import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Database, Eye, Share2, Cookie, Server, MailOpen } from 'lucide-react';

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
      <h1 className="text-3xl font-serif text-[#5A4232] mb-6">Privacy Policy</h1>
      <p className="text-gray-700 leading-7 mb-4">
        Your privacy is important to us. This policy outlines how we collect, use, and protect your personal information when you visit or make a purchase from our website.
      </p>
      <h2 className="text-2xl font-serif text-[#5A4232] mb-4">Information We Collect</h2>
      <p className="text-gray-700 leading-7 mb-4">
        We collect personal information such as your name, email address, phone number, and shipping address when you place an order or subscribe to our newsletter.
      </p>
      <h2 className="text-2xl font-serif text-[#5A4232] mb-4">Use of Information</h2>
      <p className="text-gray-700 leading-7 mb-4">
        Your information is used solely to process your orders, communicate updates, and enhance your shopping experience. We do not sell or rent your data to third parties.
      </p>
      <h2 className="text-2xl font-serif text-[#5A4232] mb-4">Cookies</h2>
      <p className="text-gray-700 leading-7 mb-4">
        We use cookies to personalize your browsing experience and improve our website’s functionality. You can disable cookies through your browser settings at any time.
      </p>
      <h2 className="text-2xl font-serif text-[#5A4232] mb-4">Third-Party Services</h2>
      <p className="text-gray-700 leading-7 mb-4">
        We may use third-party services for payment processing and shipping. These providers have their own privacy policies, and we recommend reviewing them for details.
      </p>
      <h2 className="text-2xl font-serif text-[#5A4232] mb-4">Data Security</h2>
      <p className="text-gray-700 leading-7 mb-4">
        We implement reasonable security measures to protect your data. However, no method of transmission over the internet is 100% secure.
      </p>
      <h2 className="text-2xl font-serif text-[#5A4232] mb-4">Contact Us</h2>
      <p className="text-gray-700 leading-7 mb-4">
        If you have questions about our privacy practices, please contact us at support@yourdomain.com.
      </p>
    </div>
  );
};

export default PrivacyPolicy;
