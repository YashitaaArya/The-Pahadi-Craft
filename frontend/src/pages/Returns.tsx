import React from 'react';

const Returns: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#FFF8F2] pt-24 px-8">
      <h1 className="text-3xl font-serif text-[#5A4232] mb-6">Returns & Exchanges</h1>
      <p className="text-gray-700 leading-7 mb-4">
        We stand by the quality of our products and want you to be fully satisfied with your purchase. If you're not happy with your order, here's what you need to know about our return and exchange policy.
      </p>

      <h2 className="text-2xl font-serif text-[#5A4232] mb-4">Return Window</h2>
      <p className="text-gray-700 leading-7 mb-4">
        Returns are accepted within 7 days of delivery. Items must be unused, in their original condition, and in the original packaging.
      </p>

      <h2 className="text-2xl font-serif text-[#5A4232] mb-4">Non-returnable Items</h2>
      <ul className="list-disc list-inside text-gray-700 mb-4">
        <li>Used candles or partially burned products</li>
        <li>Custom or personalized orders</li>
        <li>Gift cards</li>
      </ul>

      <h2 className="text-2xl font-serif text-[#5A4232] mb-4">Damaged or Defective Products</h2>
      <p className="text-gray-700 leading-7 mb-4">
        If your item arrived damaged or defective, please email us at <strong>candlelightduke@gmail.com</strong> with photo proof within 48 hours of receiving the order. We will initiate a replacement or refund as per your preference.
      </p>

      <h2 className="text-2xl font-serif text-[#5A4232] mb-4">How to Initiate a Return</h2>
      <ol className="list-decimal list-inside text-gray-700 mb-4">
        <li>Email us your order ID and reason for return.</li>
        <li>Wait for return confirmation and shipping instructions.</li>
        <li>Ship the product back using a trackable courier.</li>
      </ol>

      <h2 className="text-2xl font-serif text-[#5A4232] mb-4">Refund Process</h2>
      <p className="text-gray-700 leading-7 mb-4">
        Refunds will be initiated once the returned item passes inspection. Refunds may take 5-7 business days to reflect in your original payment method.
      </p>

      <h2 className="text-2xl font-serif text-[#5A4232] mb-4">Exchange Policy</h2>
      <p className="text-gray-700 leading-7 mb-4">
        We offer one-time exchanges for unused items. Please contact our support team with the product details and your preferred replacement.
      </p>

      <h2 className="text-2xl font-serif text-[#5A4232] mb-4">Need Help?</h2>
      <p className="text-gray-700 leading-7">
        Reach out to our customer support team for any questions or help with the return process.
      </p>
    </div>
  );
};

export default Returns;


