import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Star, ExternalLink, MessageSquarePlus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getTestimonials, submitCustomerTestimonial } from '../api/adminApi';
import { useAuthStore } from '../store/authStore';

interface Testimonial {
  id: string;
  name: string;
  images: string[];
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

const ShareExperienceForm: React.FC<{ onSubmitted: () => void }> = ({ onSubmitted }) => {
  const { user } = useAuthStore();
  const [open, setOpen] = useState(false);
  const [content, setContent] = useState('');
  const [rating, setRating] = useState(5);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  if (!user) {
    return (
      <div className="text-center mb-10">
        <Link
          to="/auth"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#5A4232] text-white text-sm hover:bg-[#4a3628] transition-colors"
        >
          <MessageSquarePlus size={16} />
          Sign in to share your experience
        </Link>
      </div>
    );
  }

  if (done) {
    return (
      <p className="text-center text-green-700 bg-green-50 rounded-lg py-3 mb-10 max-w-md mx-auto">
        Thanks for sharing! Your review is awaiting a quick check before it goes live.
      </p>
    );
  }

  if (!open) {
    return (
      <div className="text-center mb-10">
        <button
          onClick={() => setOpen(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#5A4232] text-white text-sm hover:bg-[#4a3628] transition-colors"
        >
          <MessageSquarePlus size={16} />
          Share your experience
        </button>
      </div>
    );
  }

  const handleSubmit = async () => {
    if (!content.trim()) return;
    setSubmitting(true);
    try {
      await submitCustomerTestimonial({
        name: user.displayName || user.email || 'Customer',
        content,
        rating,
      });
      setDone(true);
      onSubmitted();
    } catch {
      // keep it simple - just let them retry
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-lg mx-auto mb-12">
      <h3 className="font-serif text-lg text-[#5A4232] mb-3">Share your experience</h3>
      <div className="flex gap-1 mb-3">
        {[1, 2, 3, 4, 5].map((r) => (
          <button key={r} type="button" onClick={() => setRating(r)}>
            <Star size={22} fill={r <= rating ? '#C9A66B' : 'none'} stroke="#C9A66B" />
          </button>
        ))}
      </div>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={3}
        placeholder="Tell us what you thought..."
        className="w-full border border-gray-200 rounded-lg p-3 text-sm resize-none focus:outline-none focus:border-[#C9A66B]"
      />
      <div className="flex gap-3 mt-3">
        <button
          onClick={handleSubmit}
          disabled={submitting || !content.trim()}
          className="px-4 py-2 bg-[#5A4232] text-white rounded-lg text-sm disabled:opacity-50"
        >
          {submitting ? 'Submitting...' : 'Submit'}
        </button>
        <button onClick={() => setOpen(false)} className="px-4 py-2 border border-gray-300 rounded-lg text-sm">
          Cancel
        </button>
      </div>
    </div>
  );
};

const Testimonials: React.FC = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    getTestimonials()
      .then(setTestimonials)
      .catch(() => setTestimonials([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
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

          <ShareExperienceForm onSubmitted={load} />

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
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-semibold text-[#5A4232]">{t.name}</h3>
                    <div className="flex items-center space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-4 h-4 ${i < t.rating ? 'text-[#C9A66B] fill-current' : 'text-gray-300'}`} />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">{t.content}</p>
                  {t.images && t.images.length > 0 && (
                    <div className="flex gap-2 mt-4 overflow-x-auto pb-1">
                      {t.images.map((img, i) => (
                        <img
                          key={i}
                          src={img}
                          alt={`${t.name}'s photo ${i + 1}`}
                          className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                        />
                      ))}
                    </div>
                  )}
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