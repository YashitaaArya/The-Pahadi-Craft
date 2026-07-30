import { BlogPost } from '../types';
import festive from '../images1/festive.png';
import resin from '../images1/resinheart.png';
import piller from '../images1/piller.png';

export const blogPosts: BlogPost[] = [
  {
    id: '1',
    title: 'The Art of Candle Making',
    excerpt: 'Discover the ancient craft of candle making and how it has evolved.',
    content: `The art of candle making dates back thousands of years...`,
    image: festive,
    date: '2024-03-15',
    author: 'Emma Thompson',
    category: 'Crafts',
  },
  {
    id: '2',
    title: 'Creating the Perfect Ambiance',
    excerpt: 'Learn how to use candles to transform your living space.',
    content: `The right combination of candles can completely transform...`,
    image: resin,
    date: '2024-03-10',
    author: 'Michael Chen',
    category: 'Home Decor',
  },
  {
    id: '3',
    title: 'Understanding Fragrance Notes',
    excerpt: 'A guide to understanding the complexity of candle fragrances.',
    content: `Just like perfumes, candle fragrances are composed of...`,
    image: piller,
    date: '2024-03-05',
    author: 'Sophie Williams',
    category: 'Education',
  },
];