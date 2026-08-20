import React from 'react';
import { motion } from 'framer-motion';
import { Flame, Wind, HandMetal, Archive, ShieldAlert, Sparkles } from 'lucide-react';

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
    <h3 className="font-serif text-lg text-[#5A4232] mb-3">{title}</h3>
    <div className="text-gray-600 text-sm leading-relaxed">{children}</div>
  </motion.div>
);

const CareGuide: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#FFF8F2] pt-24 pb-20 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <div className="w-14 h-14 rounded-full bg-[#F5E9DA] flex items-center justify-center mx-auto mb-4">
            <Flame className="w-7 h-7 text-[#C9A66B]" />
          </div>
          <h1 className="text-4xl font-serif text-[#5A4232] mb-3">Candle Care Guide</h1>
          <p className="text-gray-500 max-w-xl mx-auto">
            A little care goes a long way — follow these tips for a cleaner burn, longer life, and a safer experience.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
          <InfoCard icon={<Sparkles className="w-5 h-5 text-[#C9A66B]" />} title="Before the First Burn">
            <ul className="space-y-2 list-disc list-inside">
              <li>Trim the wick to 1/4 inch before lighting to avoid soot and large flames.</li>
              <li>Place the candle on a heat-resistant surface, away from drafts, pets, or anything flammable.</li>
            </ul>
          </InfoCard>

          <InfoCard icon={<Flame className="w-5 h-5 text-[#C9A66B]" />} title="During the Burn">
            <ul className="space-y-2 list-disc list-inside">
              <li>Let the wax melt across the entire surface before extinguishing, to prevent tunneling.</li>
              <li>Never burn for more than 4 hours at a stretch.</li>
              <li>Keep the wick centered and upright for an even burn.</li>
            </ul>
          </InfoCard>

          <InfoCard icon={<Wind className="w-5 h-5 text-[#C9A66B]" />} title="Extinguishing the Flame">
            Use a snuffer, or gently dip the wick into the wax pool with a tool. Avoid blowing it out directly —
            it can create smoke and splatter melted wax.
          </InfoCard>

          <InfoCard icon={<Archive className="w-5 h-5 text-[#C9A66B]" />} title="Storage Tips">
            <ul className="space-y-2 list-disc list-inside">
              <li>Store in a cool, dark place to avoid discoloration and scent loss.</li>
              <li>Keep lids on when not in use to preserve the fragrance.</li>
            </ul>
          </InfoCard>
        </div>

        <InfoCard icon={<ShieldAlert className="w-5 h-5 text-[#C9A66B]" />} title="Safety Reminders">
          <ul className="space-y-2 list-disc list-inside">
            <li>Never leave a burning candle unattended.</li>
            <li>Keep candles out of reach of children and pets.</li>
            <li>Stop use once 1/2 inch of wax remains, to prevent the glass from cracking.</li>
          </ul>
        </InfoCard>

        <div className="mt-5 bg-[#F5E9DA]/60 border border-[#E6DFD7] rounded-xl p-6">
          <h3 className="font-serif text-lg text-[#5A4232] mb-2 flex items-center gap-2">
            <HandMetal className="w-5 h-5 text-[#C9A66B]" />
            Extra Tip for Scented Candles
          </h3>
          <p className="text-gray-600 text-sm leading-relaxed">
            For the strongest fragrance throw, light your candle in a smaller, enclosed space and let it burn
            for at least an hour so the scent can fill the room properly.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CareGuide;