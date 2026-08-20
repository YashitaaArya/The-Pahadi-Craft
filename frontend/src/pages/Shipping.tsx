import React from 'react';
import { motion } from 'framer-motion';
import { Truck, Clock, MapPin, PackageCheck, IndianRupee, Globe2 } from 'lucide-react';

const InfoCard: React.FC<{ icon: React.ReactNode; title: string; children: React.ReactNode }> = ({ icon, title, children }) => (
  <motion.div
    initial={{ opacity: 0, y: 15 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5 }}
    className="bg-white rounded-xl p-6 border border-[#E6DFD7]"
  >
    <div className="w-11 h-11 rounded-full bg-[#F5E9DA] flex items-center justify-center mb-4">
      {icon}
    </div>
    <h3 className="font-serif text-lg text-[#5A4232] mb-2">{title}</h3>
    <div className="text-gray-600 text-sm leading-relaxed">{children}</div>
  </motion.div>
);

const Shipping: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#FFF8F2] pt-24 pb-20 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <div className="w-14 h-14 rounded-full bg-[#F5E9DA] flex items-center justify-center mx-auto mb-4">
            <Truck className="w-7 h-7 text-[#C9A66B]" />
          </div>
          <h1 className="text-4xl font-serif text-[#5A4232] mb-3">Shipping Information</h1>
          <p className="text-gray-500 max-w-xl mx-auto">
            We ship handcrafted pieces across India with care — here's everything you need to know.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
          <InfoCard icon={<Clock className="w-5 h-5 text-[#C9A66B]" />} title="Processing & Delivery">
            Orders are processed within 2-3 business days and typically delivered within 5-7 business days,
            depending on your location. Every package is carefully packed to travel safely.
          </InfoCard>

          <InfoCard icon={<IndianRupee className="w-5 h-5 text-[#C9A66B]" />} title="Shipping Charges">
            <ul className="space-y-1">
              <li>Standard Shipping: ₹50</li>
              <li>Express Shipping: ₹100</li>
              <li>Free Shipping on orders above ₹500</li>
            </ul>
          </InfoCard>

          <InfoCard icon={<PackageCheck className="w-5 h-5 text-[#C9A66B]" />} title="Our Delivery Partners">
            We ship through trusted logistics partners including Delhivery, Expressbees, and Blue Dart,
            chosen for their reliability across both metro and smaller towns.
          </InfoCard>

          <InfoCard icon={<MapPin className="w-5 h-5 text-[#C9A66B]" />} title="Order Tracking">
            Once your order ships, you'll receive tracking details by email so you can follow it in real time,
            right up to your doorstep.
          </InfoCard>
        </div>

        <div className="bg-[#F5E9DA]/60 border border-[#E6DFD7] rounded-xl p-6 mb-8">
          <h3 className="font-serif text-lg text-[#5A4232] mb-2">Pay on Delivery — Coming Soon</h3>
          <p className="text-gray-600 text-sm leading-relaxed">
            We're working on adding Cash/Pay on Delivery as a checkout option. For now, all orders are paid
            securely online at checkout. We'll update this page the moment it's live.
          </p>
        </div>

        <InfoCard icon={<Globe2 className="w-5 h-5 text-[#C9A66B]" />} title="International Shipping">
          We currently ship within India only. International shipping is on our roadmap — check back here for updates.
        </InfoCard>

        <div className="mt-8 text-center text-gray-500 text-sm">
          Delayed or missing package? Reach out within 10 days of the estimated delivery date at{' '}
          <a href="mailto:pahadicraft@gmail.com" className="text-[#C9A66B] hover:text-[#5A4232] underline">pahadicraft@gmail.com</a>{' '}
          and we'll sort it out quickly.
        </div>
      </div>
    </div>
  );
};

export default Shipping;