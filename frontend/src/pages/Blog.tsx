import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { blogPosts } from '../data/blog';
import { ArrowRight, Calendar, User, Tag, X, ChevronLeft, ChevronRight, Clock, MessageSquare, Share2, Bookmark, Heart, ThumbsUp } from 'lucide-react';

const Blog = () => {
  const [selectedPost, setSelectedPost] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(null);
  
  const openModal = (post, index) => {
    setSelectedPost(post);
    setSelectedIndex(index);
  };
  
  const closeModal = () => {
    setSelectedPost(null);
    setSelectedIndex(null);
  };

  const featuredPost = blogPosts[0];
  const slideImages = blogPosts.slice(0, 6).map((post) => post.image);
  
  // Cloudinary image links for the latest article section
  const cloudinaryImages = [
    "https://res.cloudinary.com/dwkexvdus/image/upload/v1756711659/IMG-20231204-WA0040_dcsxea.jpg",
    'https://res.cloudinary.com/dwkexvdus/image/upload/v1756711421/IMG-20250621-WA0014_hubz2w.jpg',
    "https://res.cloudinary.com/dwkexvdus/image/upload/v1756711436/WhatsApp_Image_2023-06-30_at_6.19.15_PM_4_kdlxf3.jpg"
  ];
  
  // Cloudinary image links for the Explore by Theme section
  const themeImages = [
    "https://res.cloudinary.com/dwkexvdus/image/upload/v1756711251/IMG-20230202-WA0008_rlrkl5.jpg",
    "https://res.cloudinary.com/dwkexvdus/image/upload/v1756642711/Picture_089_r70tet.png",
    "https://res.cloudinary.com/dwkexvdus/image/upload/v1756642696/IMG-20230710-WA0007_aagp1e.jpg",
    "https://res.cloudinary.com/dwkexvdus/image/upload/v1756640757/20241118_142218_vywem9.jpg"
  ];
  
  // Cloudinary image links for the Visual Stories section
  const visualStoryImages = [
    "https://res.cloudinary.com/dwkexvdus/image/upload/v1756640750/Picture_088_ikkcg0.png",
    "https://res.cloudinary.com/dwkexvdus/image/upload/v1756640699/20241024_141346_a3zszd.jpg",
    "https://res.cloudinary.com/dwkexvdus/image/upload/v1756640697/Picture_111_lrx0ga.png",
    "https://res.cloudinary.com/dwkexvdus/image/upload/v1756640692/20241025_191707_fmg6de.jpg",
    "https://res.cloudinary.com/dwkexvdus/image/upload/v1756640692/Picture_110_zfvzxn.png",
    "https://res.cloudinary.com/dwkexvdus/image/upload/v1756640680/20231027_101948_r1wbfa.jpg",
    "https://res.cloudinary.com/dwkexvdus/image/upload/v1756640670/IMG-20241026-WA0007_dmwf0f.jpg"
  ];

  // Function to calculate reading time
  const calculateReadingTime = (content) => {
    const wordsPerMinute = 200;
    const words = content.trim().split(/\s+/).length;
    const time = Math.ceil(words / wordsPerMinute);
    return time;
  };

  return (
    <div className="min-h-screen pt-20 bg-[#FFF8F2]">
      {/* Hero Section with Elegant Typography and Design */}
      <section className="relative py-20 overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-64 h-64 rounded-full bg-[#C9A66B]/20 -z-10"></div>
          <div className="absolute bottom-10 right-10 w-72 h-72 rounded-full bg-[#5A4232]/10 -z-10"></div>
          <div className="absolute top-1/4 right-1/4 w-48 h-48 rounded-full bg-[#C9A66B]/10 -z-10"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <span className="inline-block py-1 px-3 rounded-full bg-[#C9A66B]/20 text-[#C9A66B] text-sm font-medium mb-4">
                Crafting Stories
              </span>
              <h1 className="text-5xl md:text-6xl font-serif text-[#5A4232] mb-6 leading-tight">
                Insights, Tips & <span className="italic">Stories</span>
              </h1>
              <p className="text-[#7A6A5A] text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
                Explore inspiration and creativity from the heart of Pahadicraft, where tradition meets modern elegance.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured Blog Banner - Enhanced with premium styling */}
      <section className="container mx-auto px-4 py-8 -mt-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative rounded-2xl overflow-hidden shadow-2xl"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-[#5A4232]/80 to-transparent z-10"></div>
          <img
            src='https://res.cloudinary.com/dwkexvdus/image/upload/v1756711663/WhatsApp_Image_2023-07-08_at_23.42.57_h2wcra.jpg'
            alt={featuredPost.title}
            className="w-full h-[500px] object-cover object-center transform transition-transform duration-700 hover:scale-105"
          />
          <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-12 z-20">
            <div className="max-w-2xl">
              <span className="inline-block py-1 px-3 rounded-full bg-white/20 text-white text-sm font-medium mb-4 backdrop-blur-sm">
                {featuredPost.category}
              </span>
              <h2 className="text-3xl md:text-4xl font-serif text-white mb-4 leading-tight">
                {featuredPost.title}
              </h2>
              <p className="text-white/90 text-lg mb-6 line-clamp-3">
                {featuredPost.excerpt}
              </p>
              <div className="flex items-center gap-4 text-white/80 mb-6">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm">{new Date(featuredPost.date).toLocaleDateString('en-US', { 
                    day: 'numeric', 
                    month: 'long', 
                    year: 'numeric' 
                  })}</span>
                </div>
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span className="text-sm">{featuredPost.author}</span>
                </div>
              </div>
              <button 
                onClick={() => openModal(featuredPost)}
                className="flex items-center gap-2 py-3 px-6 bg-white text-[#5A4232] rounded-full hover:bg-[#C9A66B] hover:text-white transition-all duration-300"
              >
                Read Full Story <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Blog Grid Section - Redesigned with more premium card layouts */}
      <div className="container mx-auto px-4 py-16">
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          transition={{ duration: 0.8 }}
        >
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl font-serif text-[#5A4232]">
              <span className="text-[#C9A66B]">✦</span> Latest Articles
            </h2>
            <div className="hidden md:flex items-center gap-2">
              <button className="h-10 w-10 rounded-full border border-[#C9A66B] flex items-center justify-center text-[#5A4232] hover:bg-[#C9A66B] hover:text-white transition-colors">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button className="h-10 w-10 rounded-full border border-[#C9A66B] flex items-center justify-center text-[#5A4232] hover:bg-[#C9A66B] hover:text-white transition-colors">
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                onClick={() => openModal(post, index)}
                className="group cursor-pointer bg-white/60 backdrop-blur-sm rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
              >
                <div className="relative h-56 overflow-hidden">
                  <img 
                    src={index < 3 ? cloudinaryImages[index] : post.image} 
                    alt={post.title} 
                    className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-110" 
                  />
                  <div className="absolute top-4 right-4 z-10">
                    <span className="inline-block py-1 px-3 rounded-full bg-white/80 backdrop-blur-sm text-[#5A4232] text-xs font-medium">
                      {post.category}
                    </span>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex items-center gap-4 text-[#7A6A5A] text-sm mb-3">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>{new Date(post.date).toLocaleDateString('en-US', {
                        day: 'numeric',
                        month: 'short'
                      })}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <User className="w-3 h-3" />
                      <span>{post.author}</span>
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-serif text-[#5A4232] mb-3 line-clamp-2 group-hover:text-[#C9A66B] transition-colors">
                    {post.title}
                  </h3>
                  
                  <p className="text-[#7A6A5A] mb-4 line-clamp-2">
                    {post.excerpt}
                  </p>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-[#C9A66B] text-sm font-medium group-hover:underline">
                      Read more
                    </span>
                    <div className="w-8 h-8 rounded-full flex items-center justify-center bg-[#F5E9DA] text-[#C9A66B] group-hover:bg-[#C9A66B] group-hover:text-white transition-colors">
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          
          <div className="flex justify-center mt-12">
            <button className="py-3 px-8 bg-[#F5E9DA] text-[#5A4232] rounded-full hover:bg-[#C9A66B] hover:text-white transition-colors font-medium">
              Load More Articles
            </button>
          </div>
        </motion.div>
      </div>

      {/* Curated Collections Section - New premium section */}
      <section className="py-16 bg-[#5A4232]/5">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <span className="inline-block py-1 px-3 rounded-full bg-[#C9A66B]/20 text-[#C9A66B] text-sm font-medium mb-2">
              Explore by Theme
            </span>
            <h2 className="text-3xl font-serif text-[#5A4232] mb-4">Curated Collections</h2>
            <p className="text-[#7A6A5A] max-w-2xl mx-auto">
              Dive into our carefully curated collections of articles, organized by theme to inspire your creative journey.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {['Sustainability', 'Traditional Crafts', 'Home Decor', 'Fragrance Stories'].map((category, idx) => (
              <motion.div
                key={category}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="relative h-64 rounded-xl overflow-hidden cursor-pointer group"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-[#5A4232]/90 to-transparent z-10"></div>
                <img 
                  src={themeImages[idx]} 
                  alt={category}
                  className="absolute inset-0 w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 flex flex-col justify-end p-6 z-20">
                  <h3 className="text-xl font-serif text-white mb-2">{category}</h3>
                  <div className="flex items-center gap-2 text-white/80 text-sm">
                    <Tag className="w-3 h-3" />
                    <span>12 Articles</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Quote - Premium design element */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <blockquote className="max-w-4xl mx-auto text-center relative">
            <div className="absolute -top-10 left-0 md:left-10 text-9xl text-[#C9A66B]/20 font-serif">"</div>
            <p className="text-2xl md:text-3xl text-[#5A4232] italic font-serif leading-relaxed relative z-10">
              Craftsmanship is the bridge that connects our ancestral wisdom with contemporary living, 
              transforming simple moments into extraordinary experiences.
            </p>
            <footer className="mt-6 text-[#7A6A5A]">
              <cite className="font-medium">— Pahadi Craft Artisans</cite>
            </footer>
          </blockquote>
        </div>
      </section>

      {/* Sliding Image Section - Enhanced with premium styling */}
      <div className="py-16 bg-[#F5E9DA]/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h3 className="text-2xl font-serif text-[#5A4232]">
              <span className="text-[#C9A66B]">✦</span> Visual Stories
            </h3>
          </div>
          
          <div className="relative overflow-hidden">
            <div className="flex w-max gap-6 animate-[slide-left_40s_linear_infinite] hover:pause">
              {[...visualStoryImages, ...visualStoryImages.slice(0, 3)].map((src, idx) => (
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  key={idx}
                  className="relative h-72 w-80 rounded-xl overflow-hidden shadow-lg"
                >
                  <img
                    src={src}
                    alt={`Pahadi Craft Product ${idx + 1}`}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                    <span className="text-white font-medium">Discover the story</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Newsletter Section - New premium section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto bg-[#5A4232] rounded-2xl overflow-hidden shadow-xl">
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="p-8 md:p-12 flex flex-col justify-center">
                <h3 className="text-2xl md:text-3xl font-serif text-white mb-4">
                  Subscribe to our Newsletter
                </h3>
                <p className="text-white/80 mb-6">
                  Be the first to receive our latest stories, product updates and exclusive offers.
                </p>
                <form className="space-y-4">
                  <div>
                    <input 
                      type="email" 
                      placeholder="Your email address" 
                      className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-[#C9A66B]"
                    />
                  </div>
                  <button 
                    type="submit" 
                    className="px-6 py-3 bg-[#C9A66B] text-white rounded-lg hover:bg-[#C9A66B]/80 transition-colors"
                  >
                    Subscribe Now
                  </button>
                </form>
              </div>
              <div className="hidden md:block relative h-full min-h-[300px]">
                <img 
                  src={slideImages[0]} 
                  alt="Newsletter" 
                  className="absolute inset-0 h-full w-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Modal */}
      <AnimatePresence>
        {selectedPost && (
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-start z-50 p-4 overflow-y-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
          >
            <motion.div
              className="bg-white max-w-4xl w-full rounded-2xl overflow-hidden shadow-2xl relative my-12 mx-auto"
              initial={{ scale: 0.9, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 30 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                onClick={closeModal}
                className="absolute top-4 right-4 z-20 bg-white/80 backdrop-blur-sm p-2 rounded-full text-[#5A4232] hover:bg-[#5A4232] hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              
              {/* Top image section - fixed height to ensure consistency */}
              <div className="relative h-[320px]">
                <img 
                  src={selectedIndex < 3 ? cloudinaryImages[selectedIndex] : selectedPost.image} 
                  alt={selectedPost.title} 
                  className="w-full h-full object-cover" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-8">
                  <span className="inline-block py-1 px-3 rounded-full bg-white/20 text-white text-xs font-medium mb-2 backdrop-blur-sm">
                    {selectedPost.category}
                  </span>
                  <h2 className="text-3xl font-serif text-white">{selectedPost.title}</h2>
                </div>
              </div>
              
              {/* Scrollable content area */}
              <div className="p-8 overflow-auto max-h-[calc(80vh-320px)]">
                {/* Author and metadata section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 pb-4 border-b border-gray-200">
                  <div className="flex items-center gap-3 mb-4 md:mb-0">
                    <img 
                      src={selectedIndex < 3 ? themeImages[selectedIndex % themeImages.length] : (selectedPost.avatar || slideImages[0])} 
                      alt={selectedPost.author} 
                      className="w-12 h-12 rounded-full object-cover border-2 border-[#C9A66B]"
                    />
                    <div>
                      <p className="font-medium text-[#5A4232]">{selectedPost.author}</p>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>{new Date(selectedPost.date).toLocaleDateString('en-US', { 
                            day: 'numeric', 
                            month: 'long', 
                            year: 'numeric' 
                          })}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{calculateReadingTime(selectedPost.content)} min read</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>{Math.floor(Math.random() * 20) + 1} comments</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <button className="p-2 rounded-full bg-[#F5E9DA] text-[#5A4232] hover:bg-[#5A4232] hover:text-white transition-colors" title="Share">
                      <Share2 className="w-4 h-4" />
                    </button>
                    <button className="p-2 rounded-full bg-[#F5E9DA] text-[#5A4232] hover:bg-[#5A4232] hover:text-white transition-colors" title="Bookmark">
                      <Bookmark className="w-4 h-4" />
                    </button>
                    <button className="p-2 rounded-full bg-[#F5E9DA] text-[#5A4232] hover:bg-[#5A4232] hover:text-white transition-colors" title="Like">
                      <Heart className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-7 gap-6">
                  {/* Main content column - takes more space */}
                  <div className="lg:col-span-5">
                    {/* Article highlights */}
                    <div className="bg-[#F5E9DA]/30 p-4 rounded-lg mb-6">
                      <h4 className="font-medium text-[#5A4232] mb-2">Article Highlights</h4>
                      <ul className="list-disc pl-5 text-sm text-[#7A6A5A] space-y-1">
                        <li>Understanding the essence of traditional craftsmanship</li>
                        <li>How natural materials enhance product quality and sustainability</li>
                        <li>The story behind Pahadi Craft's artisanal techniques</li>
                        <li>Integrating mountain traditions into modern home decor</li>
                      </ul>
                    </div>
                    
                    {/* Main content */}
                    <article className="prose prose-lg prose-headings:font-serif prose-headings:text-[#5A4232] prose-p:text-[#7A6A5A] max-w-none mb-8">
                      <p className="text-[#4B3B2A] leading-relaxed">{selectedPost.content}</p>
                      
                      {/* Additional styled paragraph for better content formatting */}
                      <h3 className="text-xl font-serif text-[#5A4232] mt-8">The Importance of Craftsmanship</h3>
                      <p className="text-[#7A6A5A]">
                        At Pahadi Craft, each product represents hours of meticulous handwork by skilled artisans who have inherited techniques passed down through generations. This dedication to traditional methods ensures that every item not only serves its purpose but also carries cultural significance.
                      </p>
                      
                      <blockquote className="border-l-4 border-[#C9A66B] pl-4 italic my-6">
                        "The true beauty of handicrafts lies in their imperfections - each piece tells a story of human touch and artistic expression that machines can never replicate."
                      </blockquote>
                    </article>
                    
                    {/* Engagement section */}
                    <div className="flex items-center justify-between py-4 border-t border-b border-gray-200 mb-8">
                      <div className="flex items-center gap-2">
                        <button className="flex items-center gap-1 text-[#5A4232] hover:text-[#C9A66B]">
                          <ThumbsUp className="w-4 h-4" />
                          <span className="text-sm">{Math.floor(Math.random() * 100) + 10} Likes</span>
                        </button>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <span className="hidden sm:inline text-sm text-gray-500">Share this article:</span>
                        <div className="flex gap-2">
                          {['facebook', 'twitter', 'instagram'].map(platform => (
                            <a 
                              key={platform} 
                              href="#" 
                              className="w-8 h-8 rounded-full bg-[#F5E9DA] flex items-center justify-center text-[#5A4232] hover:bg-[#C9A66B] hover:text-white transition-colors"
                            >
                              <span className="text-xs uppercase">{platform.charAt(0)}</span>
                            </a>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Tags */}
                    <div>
                      <h4 className="font-serif text-lg text-[#5A4232] mb-3">Topics</h4>
                      <div className="flex flex-wrap gap-2">
                        {['Aromatherapy', 'Sustainable Living', 'Craftsmanship', 'Natural Ingredients', 'Eco-friendly', 'Handmade'].map((tag) => (
                          <span 
                            key={tag}
                            className="px-3 py-1 bg-[#F5E9DA] text-[#5A4232] rounded-full text-sm hover:bg-[#C9A66B] hover:text-white transition-colors cursor-pointer"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  {/* Sidebar column - takes less space */}
                  <div className="lg:col-span-2">
                    {/* Related articles */}
                    <div>
                      <h4 className="font-serif text-lg text-[#5A4232] mb-4">Related Articles</h4>
                      <div className="space-y-4">
                        {[1, 2, 3].map(i => (
                          <div key={i} className="group cursor-pointer">
                            <div className="h-36 rounded-lg overflow-hidden mb-2">
                              <img 
                                src={visualStoryImages[i % visualStoryImages.length]} 
                                alt={`Related article ${i}`}
                                className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-300" 
                              />
                            </div>
                            <div>
                              <h5 className="text-sm font-medium text-[#5A4232] line-clamp-2 group-hover:text-[#C9A66B] transition-colors">
                                {i === 1 ? 'Sustainable Practices in Traditional Craft Making' : 
                                 i === 2 ? 'The Healing Properties of Himalayan Beeswax Candles' :
                                 'Mountain Inspired Home Decor Trends'}
                              </h5>
                              <p className="text-xs text-gray-500 mt-1">
                                {new Date(Date.now() - i * 86400000).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric'
                                })}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Blog;



