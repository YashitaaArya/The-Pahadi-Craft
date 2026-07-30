import React from 'react';

const CareGuide: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#FFF8F2] pt-24 px-8">
      <h1 className="text-3xl font-serif text-[#5A4232] mb-6">Candle Care Guide</h1>
      <p className="text-gray-700 leading-7 mb-4">
        Taking good care of your candles ensures a clean burn, longer life, and a safer experience. Follow these tips to get the best out of your artisanal candles.
      </p>

      <h2 className="text-2xl font-serif text-[#5A4232] mb-4">Before the First Burn</h2>
      <ul className="list-disc list-inside text-gray-700 mb-4">
        <li>Trim the wick to 1/4 inch before lighting to avoid soot and large flames.</li>
        <li>Place the candle on a heat-resistant surface and away from drafts, pets, or anything flammable.</li>
      </ul>

      <h2 className="text-2xl font-serif text-[#5A4232] mb-4">During the Burn</h2>
      <ul className="list-disc list-inside text-gray-700 mb-4">
        <li>Allow the wax to melt across the entire surface before extinguishing to prevent tunneling.</li>
        <li>Never burn a candle for more than 4 hours at a stretch.</li>
        <li>Keep the wick centered and upright for an even burn.</li>
      </ul>

      <h2 className="text-2xl font-serif text-[#5A4232] mb-4">Extinguishing the Flame</h2>
      <p className="text-gray-700 leading-7 mb-4">
        Use a snuffer or gently dip the wick into the wax pool with a tool to extinguish the flame. Avoid blowing out the flame directly as it can create smoke and splatter.
      </p>

      <h2 className="text-2xl font-serif text-[#5A4232] mb-4">Storage Tips</h2>
      <ul className="list-disc list-inside text-gray-700 mb-4">
        <li>Store candles in a cool, dark place to avoid discoloration and scent loss.</li>
        <li>Keep lids on when not in use to preserve the fragrance.</li>
      </ul>

      <h2 className="text-2xl font-serif text-[#5A4232] mb-4">Safety Reminders</h2>
      <ul className="list-disc list-inside text-gray-700 mb-4">
        <li>Never leave a burning candle unattended.</li>
        <li>Keep candles out of reach of children and pets.</li>
        <li>Discontinue use when 1/2 inch of wax remains to prevent glass cracking.</li>
      </ul>

      <h2 className="text-2xl font-serif text-[#5A4232] mb-4">Extra Tips for Scented Candles</h2>
      <p className="text-gray-700 leading-7 mb-4">
        For the strongest fragrance throw, light your candle in a smaller, enclosed space. Let it burn for at least 1 hour so the scent can fill the room effectively.
      </p>
    </div>
  );
};

export default CareGuide;
