import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, Heart, User, Calendar, Share2, ArrowLeft } from 'lucide-react';
import axios from 'axios';
import { useAuthStore } from '../store/authStore';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

interface BlogPostData {
  id: string;
  title: string;
  slug: string;
  content: string;
  image: string;
  author: string;
  category: string;
  tags: string[];
  views: number;
  likes: number;
  likedByViewer: boolean;
  createdAt: string;
}

const BlogPost: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { user } = useAuthStore();
  const [post, setPost] = useState<BlogPostData | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [liking, setLiking] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    setLoading(true);
    setNotFound(false);
    axios
      .get(`${BASE_URL}/blog/${slug}`, { params: user ? { uid: user.uid } : {} })
      .then((res) => setPost(res.data))
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [slug, user]);

  const handleLike = async () => {
    if (!user) {
      window.location.href = '/auth';
      return;
    }
    if (!post || liking) return;
    setLiking(true);
    try {
      const res = await axios.post(`${BASE_URL}/blog/${post.slug}/like`, { uid: user.uid });
      setPost({ ...post, likes: res.data.likes, likedByViewer: res.data.liked });
    } catch {
      // ignore - button just won't update
    } finally {
      setLiking(false);
    }
  };

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title: post?.title, url });
        return;
      } catch {
        // fall through to clipboard
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      alert('Link copied to clipboard!');
    } catch {
      // nothing more we can do
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center bg-[#FFF8F2]">
        <div className="w-10 h-10 border-4 border-[#C9A66B] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (notFound || !post) {
    return (
      <div className="min-h-screen pt-24 flex flex-col items-center justify-center bg-[#FFF8F2] px-4 text-center">
        <p className="text-2xl font-serif text-[#5A4232] mb-4">Post not found</p>
        <Link to="/blog" className="text-[#C9A66B] hover:text-[#5A4232] underline">Back to the journal</Link>
      </div>
    );
  }

  const paragraphs = post.content.split(/\n\s*\n/).filter(Boolean);

  return (
    <div className="min-h-screen bg-[#FFF8F2] pt-24 pb-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <Link to="/blog" className="inline-flex items-center gap-2 text-sm text-[#5A4232] hover:text-[#C9A66B] mb-6">
          <ArrowLeft size={16} />
          Back to the journal
        </Link>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          {post.category && (
            <span className="text-xs uppercase tracking-widest text-[#C9A66B] font-semibold">{post.category}</span>
          )}
          <h1 className="text-3xl md:text-5xl font-serif text-[#5A4232] mt-2 mb-6">{post.title}</h1>

          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-8 pb-8 border-b border-[#E6DFD7]">
            <span className="flex items-center gap-1.5"><User size={14} />{post.author}</span>
            <span className="flex items-center gap-1.5">
              <Calendar size={14} />
              {new Date(post.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
            </span>
            <span className="flex items-center gap-1.5"><Eye size={14} />{post.views} views</span>
          </div>

          {post.image && (
            <img src={post.image} alt={post.title} className="w-full h-64 md:h-96 object-cover rounded-2xl mb-10 shadow-md" />
          )}

          <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed space-y-5">
            {paragraphs.map((para, idx) => (
              <p key={idx}>{para}</p>
            ))}
          </div>

          {post.tags?.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-10">
              {post.tags.map((tag) => (
                <span key={tag} className="px-3 py-1 bg-[#F5E9DA] text-[#5A4232] rounded-full text-xs">
                  #{tag}
                </span>
              ))}
            </div>
          )}

          <div className="flex items-center gap-3 mt-10 pt-8 border-t border-[#E6DFD7]">
            <button
              onClick={handleLike}
              disabled={liking}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full border transition-colors ${
                post.likedByViewer
                  ? 'bg-red-50 border-red-200 text-red-600'
                  : 'border-[#C9A66B] text-[#5A4232] hover:bg-[#F5E9DA]'
              }`}
              title={user ? 'Like this post' : 'Sign in to like this post'}
            >
              <Heart size={16} className={post.likedByViewer ? 'fill-red-500 text-red-500' : ''} />
              {post.likes} {post.likes === 1 ? 'Like' : 'Likes'}
            </button>
            <button
              onClick={handleShare}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-[#C9A66B] text-[#5A4232] hover:bg-[#F5E9DA] transition-colors"
            >
              <Share2 size={16} />
              Share
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default BlogPost;