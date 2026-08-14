import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Star, ExternalLink } from 'lucide-react';
import { getTestimonials } from '../api/adminApi';

interface Testimonial {
  id: string;
  name: string;
  image: string;
  content: string;
  rating: number;
  createdAt: string;
}

// Free, no API cost: links straight to the business's real Google reviews.
const GOOGLE_REVIEWS_URL = 'https://search.google.com/local/writereview?placeid=ChIJAQAAADkfGzkRJBhBd1C3LOI';

const RatingsSummary: React.FC<{ testimonials: Testimonial[] }> = ({ testimonials }) => {
  if (testimonials.length === 0) return null;
  const total = testimonials.length;
  const average = (testimonials.reduce((sum, t) => sum + t.rating, 0) / total).toFixed(1);
  const counts = [0, 0, 0, 0, 0];
  testimonials.forEach((t) => {
    const idx = Math.min(Math.max(Math.round(t.rating), 1), 5) - 1;
    counts[idx]++;
  });

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-12">
      <div className="flex flex-col md:flex-row justify-between gap-6">
        <div className="flex flex-col items-center md:items-start">
          <p className="text-4xl font-bold text-[#5A4232]">{average} <span className="text-2xl">/ 5</span></p>
          <div className="flex space-x-1 my-2">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className={`w-5 h-5 ${i < Math.round(Number(average)) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
            ))}
          </div>
          <p className="text-gray-600">{total} Review{total !== 1 ? 's' : ''}</p>
        </div>
        <div className="flex-1">
          {[5, 4, 3, 2, 1].map((star) => {
            const percent = Math.round((counts[star - 1] / total) * 100);
            return (
              <div key={star} className="flex items-center text-sm mb-1">
                <span className="w-12">{star} Star</span>
                <div className="w-full h-3 mx-2 bg-gray-200 rounded">
                  <div className="h-full bg-green-500 rounded" style={{ width: `${percent}%` }} />
                </div>
                <span className="w-12 text-right">({percent}%)</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const Testimonials: React.FC = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getTestimonials()
      .then(setTestimonials)
      .catch(() => setTestimonials([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="py-16 bg-[#F5E9DA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl font-serif text-center text-[#5A4232] mb-4">Customer Reviews</h2>
          <div className="flex justify-center mb-8">
            <a
              href={GOOGLE_REVIEWS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-[#C9A66B] text-[#5A4232] text-sm hover:bg-white transition-colors"
            >
              <ExternalLink size={16} />
              Read our reviews on Google
            </a>
          </div>

          {!loading && <RatingsSummary testimonials={testimonials} />}

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-white p-6 rounded-lg shadow-md animate-pulse h-40" />
              ))}
            </div>
          ) : testimonials.length === 0 ? (
            <p className="text-center text-gray-500">
              Be the first to share your experience with Pahadi Craft.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {testimonials.map((t) => (
                <div key={t.id} className="bg-white p-6 rounded-lg shadow-md">
                  <div className="flex items-center gap-3 mb-3">
                    {t.image ? (
                      <img src={t.image} alt={t.name} className="w-10 h-10 rounded-full object-cover" />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-[#F5E9DA] flex items-center justify-center text-[#5A4232] font-medium">
                        {t.name.charAt(0)}
                      </div>
                    )}
                    <div>
                      <h3 className="text-lg font-semibold text-[#5A4232]">{t.name}</h3>
                      <div className="flex items-center space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`w-4 h-4 ${i < t.rating ? 'text-[#C9A66B] fill-current' : 'text-gray-300'}`} />
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">{t.content}</p>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default Testimonials;