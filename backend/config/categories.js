// Fixed top-level categories - the real business taxonomy from the owner.
// Prime/secondary subcategories stay free text (not enforced here) since the
// real catalog has far more variety than any hardcoded list could keep up
// with - but we seed suggestions below so the admin form shows real options
// immediately, not an empty box waiting for products to exist first.

const MAIN_CATEGORIES = [
  'Candles',
  'Resin, Concrete, Wax & Wooden Artifacts',
  'Cleansing, Healing & Wellness',
  'Spell & Occult Products',
  'Room Fragrances',
  'Seven Chakra Range',
  'Gifting & Gift Hampers',
  'Festival Hampers',
  'Manufacturing & Branding',
];

// Suggested Prime Subcategory values per main category, seeded from the
// owner's real product taxonomy. These merge with whatever's already in use
// on real products when the admin form asks the backend for suggestions.
const SUGGESTED_SUBCATEGORIES = {
  'Candles': [
    'Glass Jar', 'Metal Jar', 'Clay Jar', 'Tin', 'Pillar Candles', 'Dessert Candles',
    'Mini Candles', 'Kids Candles', 'Love Candles', 'Floral Candles', 'Coconut Jar',
    'Concrete Jar', 'Candle Testers',
  ],
  'Resin, Concrete, Wax & Wooden Artifacts': [
    'Resin Jewellery', 'Resin Photo Frames', 'Resin Jars', 'Resin Candle Holders',
    'Resin Trays', 'Resin Wall Clocks', 'Concrete Jars', 'Concrete Candle Holders',
    'Concrete Trays', 'Resin Pens', 'Concrete Models', 'Wax Figurines',
    'Resin Paperweights', 'Resin Coasters', 'Concrete Coasters', 'Resin Shagun Thali',
    'Wooden Trays', 'Wooden Wall Hangings',
  ],
  'Cleansing, Healing & Wellness': [
    'Intention Candles', 'Bath Salts', 'Intention Oils', 'Herbal Bath Soaps',
    'Roll-On Oils', 'Solid Perfumes', 'Herbal Teas', 'Wellness Kits', 'Intention Sprays',
  ],
  'Spell & Occult Products': [
    'Figurine Candles', 'Ritual Candles', 'Ritual Herbs', 'Ritual Kits', 'Anointed Candles',
  ],
  'Room Fragrances': [
    'Room Mist Sprays', 'Reed Diffusers', 'Wax Tablets', 'Potpourri',
  ],
  'Seven Chakra Range': [
    'Chakra Candles', 'Chakra Oils', 'Chakra Sprays', 'Chakra Bath Salts',
    'Chakra Soaps', 'Chakra Teas', 'Chakra Tealights', 'Chakra Kits',
  ],
  'Gifting & Gift Hampers': [
    'Candle Gifts', 'Spiritual Gifts', 'Wellness Gifts', 'Wedding Gifts', 'Birthday Gifts',
    'Anniversary Gifts', 'Occasion-Specific Gifts', 'Customised Gifts',
    'Hotel & Hospitality Hampers', 'Corporate Hampers', 'Premium Hampers', 'Resort Gifts',
  ],
  'Festival Hampers': [
    'Rakhi', 'Diwali', "Valentine's", 'Christmas', 'Ganesh Chaturthi',
  ],
  'Manufacturing & Branding': [
    'Custom Product Development', 'Custom Packaging & Branding',
  ],
};

module.exports = { MAIN_CATEGORIES, SUGGESTED_SUBCATEGORIES };