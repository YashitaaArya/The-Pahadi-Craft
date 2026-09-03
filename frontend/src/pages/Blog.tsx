import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Eye, Heart, Calendar, User } from 'lucide-react';
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  image: string;
  author: string;
  category: string;
  featured: boolean;
  views: number;
  likes: number;
  createdAt: string;
}

const Blog: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(6);
  const [email, setEmail] = useState('');
  const [subStatus, setSubStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [subMessage, setSubMessage] = useState('');

  useEffect(() => {
    axios.get(`${BASE_URL}/blog`)
      .then((res) => setPosts(res.data))
      .catch(() => setPosts([]))
      .finally(() => setLoading(false));
  }, []);

  const featured = posts.find((p) => p.featured) || posts[0];
  const rest = posts.filter((p) => p.id !== featured?.id);
  const visiblePosts = rest.slice(0, visibleCount);
  const hasMore = visibleCount < rest.length;

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubStatus('loading');
    setSubMessage('');
    try {
      const res = await axios.post(`${BACKEND_URL}/api/newsletter/subscribe`, { email });
      setSubStatus('success');
      setSubMessage(res.data.alreadySubscribed ? "You're already on the list!" : 'Thanks for subscribing!');
      setEmail('');
    } catch (err: any) {
      setSubStatus('error');
      setSubMessage(err?.response?.data?.error || 'Something went wrong, please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center bg-[#FFF8F2]">
        <div className="w-10 h-10 border-4 border-[#C9A66B] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFF8F2] pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-serif text-[#5A4232] mb-4">Our Journal</h1>
          <p className="text-[#7A6A5A] max-w-2xl mx-auto text-lg">
            Stories on candle craft, care tips, and the entrepreneurial journey behind Pahadi Craft.
          </p>
        </motion.div>

        {posts.length === 0 ? (
          <p className="text-center text-gray-400 py-20">No posts yet - check back soon.</p>
        ) : (
          <>
            {/* Featured post */}
            {featured && (
              <Link to={`/blog/${featured.slug}`}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="relative rounded-3xl overflow-hidden shadow-lg mb-16 group cursor-pointer"
                >
                  <div className="h-80 md:h-[420px] w-full">
                    {featured.image && (
                      <img src={featured.image} alt={featured.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    )}
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col justify-end p-8 md:p-12">
                    {featured.category && (
                      <span className="text-xs uppercase tracking-widest text-[#C9A66B] font-semibold mb-2">{featured.category}</span>
                    )}
                    <h2 className="text-2xl md:text-4xl font-serif text-white mb-3 max-w-2xl">{featured.title}</h2>
                    <p className="text-white/80 max-w-xl mb-3 hidden md:block">{featured.excerpt}</p>
                    <div className="flex items-center gap-4 text-white/70 text-sm">
                      <span className="flex items-center gap-1"><User size={14} />{featured.author}</span>
                      <span className="flex items-center gap-1"><Eye size={14} />{featured.views}</span>
                      <span className="flex items-center gap-1"><Heart size={14} />{featured.likes}</span>
                    </div>
                  </div>
                </motion.div>
              </Link>
            )}

            {/* Grid of remaining posts */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {visiblePosts.map((post, idx) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: idx * 0.05 }}
                  viewport={{ once: true }}
                >
                  <Link to={`/blog/${post.slug}`} className="block bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow group h-full">
                    <div className="h-48 overflow-hidden">
                      {post.image && (
                        <img src={post.image} alt={post.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                      )}
                    </div>
                    <div className="p-6">
                      {post.category && (
                        <span className="text-xs uppercase tracking-wide text-[#C9A66B] font-semibold">{post.category}</span>
                      )}
                      <h3 className="font-serif text-xl text-[#5A4232] mt-1 mb-2 line-clamp-2">{post.title}</h3>
                      <p className="text-gray-500 text-sm line-clamp-2 mb-4">{post.excerpt}</p>
                      <div className="flex items-center justify-between text-xs text-gray-400">
                        <span className="flex items-center gap-1"><User size={12} />{post.author}</span>
                        <div className="flex items-center gap-3">
                          <span className="flex items-center gap-1"><Eye size={12} />{post.views}</span>
                          <span className="flex items-center gap-1"><Heart size={12} />{post.likes}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>

            {rest.length > 0 && (
              <div className="text-center mb-20">
                {hasMore ? (
                  <button
                    onClick={() => setVisibleCount((c) => c + 6)}
                    className="px-6 py-3 border border-[#C9A66B] text-[#5A4232] rounded-full hover:bg-[#F5E9DA] transition-colors font-medium"
                  >
                    Load More Articles
                  </button>
                ) : (
                  <p className="text-[#C9A66B] font-serif text-lg">Enjoy reading! You've seen all our articles. ✨</p>
                )}
              </div>
            )}
          </>
        )}

        {/* Newsletter - same real backend as the footer's */}
        <div className="bg-[#5A4232] rounded-3xl p-10 md:p-14 text-center">
          <h3 className="text-2xl md:text-3xl font-serif text-white mb-3">Never Miss a Story</h3>
          <p className="text-white/70 mb-6 max-w-md mx-auto">
            Subscribe for new posts, product updates, and a peek behind the scenes.
          </p>
          {subStatus === 'success' ? (
            <p className="text-[#C9A66B] font-medium">{subMessage}</p>
          ) : (
            <form onSubmit={handleSubscribe} className="max-w-md mx-auto flex gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email"
                required
                disabled={subStatus === 'loading'}
                className="flex-1 px-4 py-3 rounded-full bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-[#C9A66B] disabled:opacity-60"
              />
              <button
                type="submit"
                disabled={subStatus === 'loading'}
                className="px-6 py-3 bg-[#C9A66B] text-white rounded-full hover:bg-[#D9B67B] transition-colors font-medium disabled:opacity-60"
              >
                {subStatus === 'loading' ? '...' : 'Subscribe'}
              </button>
            </form>
          )}
          {subStatus === 'error' && <p className="text-red-300 text-sm mt-2">{subMessage}</p>}
        </div>
      </div>
    </div>
  );
};

export default Blog;
