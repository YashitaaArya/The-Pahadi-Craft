import React from 'react';

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#FFF8F2] pt-24 px-8">
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
