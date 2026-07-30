import React from 'react';

const Faq: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#FFF8F2] pt-24 px-8">
      <h1 className="text-3xl font-serif text-[#5A4232] mb-6">Frequently Asked Questions</h1>
      <div className="text-gray-700 leading-7">
        <h2 className="text-2xl font-serif text-[#5A4232] mt-6 mb-2">1. What types of candles do you offer?</h2>
        <p>We offer a wide variety of handcrafted soy wax candles including scented jars, tea lights, pillar candles, and more.</p>

        <h2 className="text-2xl font-serif text-[#5A4232] mt-6 mb-2">2. Are your products eco-friendly?</h2>
        <p>Yes, our candles are made from 100% soy wax and use lead-free wicks, making them safe for you and the environment.</p>

        <h2 className="text-2xl font-serif text-[#5A4232] mt-6 mb-2">3. How long do your candles burn?</h2>
        <p>Burn time varies by size. Our standard jar candles burn for 30–40 hours when used properly.</p>

        <h2 className="text-2xl font-serif text-[#5A4232] mt-6 mb-2">4. Can I customize a candle scent?</h2>
        <p>Absolutely! Visit our Custom Order page to select your preferred fragrance, container, and packaging.</p>

        <h2 className="text-2xl font-serif text-[#5A4232] mt-6 mb-2">5. What if my candle arrives broken?</h2>
        <p>Please contact us within 48 hours of receiving your order and include a photo of the damaged item. We'll send a replacement or issue a refund.</p>

        <h2 className="text-2xl font-serif text-[#5A4232] mt-6 mb-2">6. Do you offer gift wrapping?</h2>
        <p>Yes, we provide beautiful, eco-friendly gift wrapping. You can choose this option during checkout.</p>

        <h2 className="text-2xl font-serif text-[#5A4232] mt-6 mb-2">7. Where are your candles made?</h2>
        <p>All our candles are hand-poured with love in the hills of Uttarakhand, India.</p>

        <h2 className="text-2xl font-serif text-[#5A4232] mt-6 mb-2">8. Do you ship internationally?</h2>
        <p>Currently, we only ship within India. Stay tuned as we plan to expand our reach in the future.</p>

        <h2 className="text-2xl font-serif text-[#5A4232] mt-6 mb-2">9. How can I track my order?</h2>
        <p>After your order is dispatched, you’ll receive a tracking number via email and SMS to monitor the delivery status.</p>

        <h2 className="text-2xl font-serif text-[#5A4232] mt-6 mb-2">10. Can I cancel or change my order?</h2>
        <p>Orders can be changed or canceled within 12 hours of placement. Please email us at <strong>candlelightduke@gmail.com</strong>.</p>
      </div>
    </div>
  );
};

export default Faq;
