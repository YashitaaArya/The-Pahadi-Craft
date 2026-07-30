import React from 'react';

const Terms: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#FFF8F2] pt-24 px-8">
      <h1 className="text-3xl font-serif text-[#5A4232] mb-6">Terms and Conditions</h1>
      <p className="text-gray-700 leading-7 mb-4">
        By accessing and using our website, you agree to comply with the following terms and conditions. Please read them carefully before placing any orders.
      </p>
      <h2 className="text-2xl font-serif text-[#5A4232] mb-4">Use of Website</h2>
      <p className="text-gray-700 leading-7 mb-4">
        This website is intended for personal and non-commercial use only. You may not use our content, images, or products for any unauthorized or illegal purpose.
      </p>
      <h2 className="text-2xl font-serif text-[#5A4232] mb-4">Product Availability</h2>
      <p className="text-gray-700 leading-7 mb-4">
        All products displayed on the website are subject to availability. We reserve the right to discontinue or modify products without prior notice.
      </p>
      <h2 className="text-2xl font-serif text-[#5A4232] mb-4">Pricing & Payment</h2>
      <p className="text-gray-700 leading-7 mb-4">
        All prices are listed in INR and are inclusive of applicable taxes unless stated otherwise. Payment must be completed in full before an order is confirmed and shipped.
      </p>
      <h2 className="text-2xl font-serif text-[#5A4232] mb-4">Returns & Refunds</h2>
      <p className="text-gray-700 leading-7 mb-4">
        Please refer to our return policy for detailed information. Eligible refunds will be processed to the original payment method within 5-7 business days.
      </p>
      <h2 className="text-2xl font-serif text-[#5A4232] mb-4">Changes to Terms</h2>
      <p className="text-gray-700 leading-7 mb-4">
        We reserve the right to update these terms at any time. Changes will be posted on this page and your continued use of the site constitutes acceptance of those changes.
      </p>
    </div>
  );
};

export default Terms;
