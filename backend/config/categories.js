// Fixed top-level categories. Prime/secondary subcategories are intentionally
// free text (not a fixed list here) since the real catalog has far more
// variety than any hardcoded list could keep up with - admins type it, and
// the dropdown in the admin UI suggests previously-used values so the data
// stays reasonably consistent without being rigid.

const MAIN_CATEGORIES = [
  'Candles',
  'Bath Salts & Soaps',
  'Resin Jewellery',
  'Resin Artifacts',       // trays, jars, candle holders, etc.
  'Concrete Artifacts',
  'Terracotta / Clay',
  'Occasion-Based',        // Diwali, Christmas, Valentine's, Lohri, Rakhi, Ganesh Chaturthi, etc.
];

module.exports = { MAIN_CATEGORIES };