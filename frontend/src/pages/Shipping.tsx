import React from 'react';

const Shipping: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#FFF8F2] pt-24 px-8">
      <h1 className="text-3xl font-serif text-[#5A4232] mb-6">Shipping Information</h1>
      <p className="text-gray-700 leading-7 mb-4">
        We offer nationwide shipping across India. Orders are processed within 2-3 business days and delivered within 5-7 business days. All packages are carefully packed to ensure your products arrive in perfect condition.
      </p>
      <h2 className="text-2xl font-serif text-[#5A4232] mb-4">Shipping Charges</h2>
      <ul className="list-disc list-inside text-gray-700 mb-4">
        <li>Standard Shipping: ₹50</li>
        <li>Express Shipping: ₹100</li>
        <li>Free Shipping on orders above ₹500</li>
      </ul>
      <h2 className="text-2xl font-serif text-[#5A4232] mb-4">International Shipping</h2>
      <p className="text-gray-700 leading-7 mb-4">
        Currently, we do not offer international shipping. We are working on expanding our reach and will keep you posted once we start accepting international orders.
      </p>
      <h2 className="text-2xl font-serif text-[#5A4232] mb-4">Order Tracking</h2>
      <p className="text-gray-700 leading-7 mb-4">
        Once your order is shipped, you will receive an email and SMS with the tracking information. You can track your order in real-time and stay updated on its delivery status.
      </p>
      <h2 className="text-2xl font-serif text-[#5A4232] mb-4">Delivery Partners</h2>
      <p className="text-gray-700 leading-7 mb-4">
        We partner with top logistics providers like Delhivery, Blue Dart, and India Post to ensure timely and secure delivery of your products.
      </p>
      <h2 className="text-2xl font-serif text-[#5A4232] mb-4">Delivery Issues</h2>
      <p className="text-gray-700 leading-7 mb-4">
        In case your package is delayed or lost, please contact our support team within 10 days of the estimated delivery date. We will do our best to resolve the issue quickly.
      </p>
      <h2 className="text-2xl font-serif text-[#5A4232] mb-4">Tips for Smooth Delivery</h2>
      <ul className="list-disc list-inside text-gray-700 mb-4">
        <li>Ensure your address and phone number are correct before placing the order.</li>
        <li>Keep your phone switched on for delivery OTPs and updates.</li>
        <li>If unavailable, reschedule your delivery with the courier using the tracking link.</li>
      </ul>
    </div>
  );
};

export default Shipping;
