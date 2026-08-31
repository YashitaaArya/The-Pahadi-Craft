// Complete list of available fragrances organized by family
// This serves as a reference for product variants and fragrance selection

export const FRAGRANCE_FAMILIES = {
  'Floral & Romantic': [
    'Rose',
    'Lotus',
    'Jasmine',
    'Lavender',
    'Parijat',
    'Mogra',
    'Marigold',
    'Ylang Ylang',
    'Lily of Valley',
    'Nargis',
    'Chamomile',
    'Orchid',
    'Lilly',
  ],
  'Fresh & Citrus': [
    'Green Apple',
    'Lemon',
    'Lemongrass',
    'Orange',
    'Bergamot',
    'Ocean Breeze',
    'Citronella',
    'Watermelon',
    'Mango',
    'Pumpkin',
    'Banana',
    'Apple',
    'Peppermint',
    'Tea Tree',
    'Neroli',
  ],
  'Warm & Spicy': [
    'White Oudh',
    'Cinnamon',
    'Nutmeg',
    'Cardamom',
    'Basil',
    'Rosemary',
    'Thyme',
    'Fennel',
    'Camphor',
    'Ginger',
    'Elaichi',
    'Clove',
    'Clary Sage',
    'Kalimat Oud',
  ],
  'Woody & Earthy': [
    'Sandalwood',
    'Pine',
    'Cedarwood',
    'Mahogany',
    'Patchouli',
    'Vetiver',
    'Juniper',
    'Eucalyptus',
    'Juniper Berry',
    'Neem',
  ],
  'Gourmand & Sweet': [
    'Chocolate',
    'Vanilla',
    'Coffee',
    'Baby Powder',
    'Bubble Gum',
    'Strawberry',
    'Blueberry',
  ],
  'Musk & Sensual': [
    'Musk',
    'Myrrh',
    'Aphrodisia',
    'Dunhill',
    'Bengal Tuberose',
    'Loban',
  ],
};

// Flatten to get all fragrance names
export const ALL_FRAGRANCE_NAMES = Object.values(FRAGRANCE_FAMILIES).flat().sort();

// Export for use in autocomplete/dropdown in admin panel
export const getFragrancesForFamily = (family: string): string[] => {
  return FRAGRANCE_FAMILIES[family as keyof typeof FRAGRANCE_FAMILIES] || [];
};

export const getAllFamilies = (): string[] => {
  return Object.keys(FRAGRANCE_FAMILIES);
};
