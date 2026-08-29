import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Heart,
  Award,
  Users,
  Quote,
  Mountain,
  Hammer,
  ArrowRight,
  X,
  ExternalLink,
  Sparkles,
  Target,
} from 'lucide-react';
import axios from 'axios';
import aboutimg from '../images1/homedecor.png';
import decor2 from '../Home Decor Candles/decor6.jpg';
import craft from '../Metal Craft Candles/carft6.jpeg';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

interface PressMention {
  id: string;
  title: string;
  source: string;
  description: string;
  image: string;
  link: string;
  date: string;
}

interface AboutContent {
  candlelightDukeLogo: string;
  pahadiCraftLogo: string;
  founderPhoto: string;
  founderName: string;
  founderTitle: string;
  founderBio: string;
  historyIntro: string;
  historyJourney: string;
  historyToday: string;
  vision: string;
}

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8 },
};

const defaultFounderBio = `My journey with Pahadicraft did not begin with a business plan, a large investment, or a clear roadmap. It began with curiosity, creativity, courage, and a strong desire to create something of my own.

After returning from Hyderabad in 2017, I initially explored the possibility of pursuing a conventional career. During an interview for a school-teaching position, I heard words that stayed with me and changed the direction of my journey: “You are not made for a job. You are made to give jobs.”

Those words made me pause and look at my future differently. Instead of asking which job I should do, I began asking: “What can I create that is truly mine?”

In September 2017, with limited resources but a strong desire to begin, I took my first step into the world of handmade products with just 5 kilograms of wax. There was no large manufacturing facility, no established brand, and no certainty about where the journey would lead. There was simply an idea, a willingness to experiment, and the determination to learn. That small beginning became Candlelight Duke.

For approximately five years, Candlelight Duke became my learning ground. I explored waxes, fragrances, colours, shapes and designs while learning about product development, packaging, presentation, quality, customer expectations and the realities of building a business independently. There were successful experiments, failed experiments and countless lessons. Every product and every customer interaction helped me become better.

By 2023, I realised that my vision was no longer limited to candles. I wanted to explore fragrances, wellness, spirituality, gifting and handcrafted lifestyle products. That growing vision led to the birth of Pahadicraft.

Pahadi represents the mountains, my roots, nature and my connection with Himachal Pradesh. Craft represents the hands, patience, imagination, creativity and human effort behind every creation. Pahadicraft was therefore not a rejection of Candlelight Duke; it was the evolution of everything I had learned and built through it.

I believe a handcrafted product can be much more than an object. A candle can represent love, peace, celebration, spirituality, memories, intention and hope. A fragrance can transform an atmosphere. A thoughtful gift can express an emotion. A spiritual product can become part of someone's personal ritual. A customised hamper can create a memorable experience.

This is the philosophy I want Pahadicraft to carry: creativity, craftsmanship, quality and experience, while preserving the warmth and individuality that make handmade products special.

The journey has not always been easy. There have been uncertainties, failed experiments, difficult decisions and countless lessons. But I have learned that every challenge is part of the journey.

I started with 5 kilograms of wax without knowing where it would lead me. Today, I see a much larger dream—one that extends across handcrafted products, fragrances, wellness, spiritual products, gifting, customised creations and much more.

My dream is to build Pahadicraft into a recognised premium handcrafted brand originating from Himachal Pradesh and reaching customers across India and, eventually, beyond. I want every product that carries the Pahadicraft name to reflect the imagination behind its creation and the care that goes into making it.

The journey that began with a small idea has brought me much further than I could have imagined in 2017. And I believe this is still only the beginning.

Pahadicraft — The Divine Imagination.`;

const defaultHistoryIntro = `The story of Pahadicraft began long before the name itself came into existence. It began in September 2017, with a small idea, a willingness to take a different path and just 5 kilograms of wax. What started as an experiment in handmade candles would gradually become a journey of entrepreneurship, creativity, learning and the vision of building something meaningful from the hills of Himachal Pradesh.`;

const defaultHistoryJourney = `For approximately five years, Candlelight Duke became the foundation on which the larger vision was built. The journey involved experimenting with waxes, fragrances, colours, designs and handmade products while learning about craftsmanship, product development, packaging, presentation, customer expectations and business.

By 2023, the vision had expanded beyond candles. The experience accumulated through Candlelight Duke became the foundation for a broader handcrafted lifestyle and gifting brand. Pahadicraft emerged as the natural evolution of that journey — bringing together handcrafted products, fragrances, wellness-inspired offerings, spiritual and intention products, gifting and customised creations.

The name reflects that larger identity. “Pahadi” represents the mountains, roots, nature and the connection with Himachal Pradesh, while “Craft” represents the hands, imagination, patience and creativity behind every creation.`;

const defaultHistoryToday = `Today, Pahadicraft carries forward the journey that began with Candlelight Duke. The brand continues to explore handcrafted candles, spiritual and intention products, fragrances, wellness-inspired products, bath and body products, room fragrances, customised gifting and hampers.

The aim is not simply to sell products, but to create experiences — a candle that brings warmth to an evening, a fragrance that evokes a memory, a gift that expresses an emotion, or a customised hamper that becomes part of a special occasion.

The journey is still being written, with the ambition of building a recognised premium handcrafted brand originating from Himachal Pradesh and reaching customers across India and eventually beyond.`;

const defaultVision = `To build a recognised premium handcrafted brand originating from Himachal Pradesh and reaching customers across India and eventually beyond — bringing together Creativity, Craftsmanship, Quality and Experience while keeping the human character of handmade creation alive.`;

const About = () => {
  const [pressMentions, setPressMentions] = useState<PressMention[]>([]);
  const [aboutContent, setAboutContent] = useState<AboutContent | null>(null);
  const [selectedPress, setSelectedPress] = useState<PressMention | null>(null);

  useEffect(() => {
    axios.get(`${BASE_URL}/press`)
      .then((res) => setPressMentions(res.data))
      .catch(() => setPressMentions([]));

    axios.get(`${BASE_URL}/about`)
      .then((res) => setAboutContent(res.data))
      .catch(() => setAboutContent(null));
  }, []);

  const founderBio = aboutContent?.founderBio || defaultFounderBio;
  const historyIntro = aboutContent?.historyIntro || defaultHistoryIntro;
  const historyJourney = aboutContent?.historyJourney || defaultHistoryJourney;
  const historyToday = aboutContent?.historyToday || defaultHistoryToday;
  const vision = aboutContent?.vision || defaultVision;

  return (
    <div className="min-h-screen pt-20 bg-gradient-to-br from-[#FCF7F0] to-[#F8E3CC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.2 }}>

          {/* Hero */}
          <div className="text-center mb-20 px-4">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2 }}
            >
              <p className="text-sm tracking-[0.25em] uppercase text-[#C9A66B] font-medium mb-3">
                The Journey Behind the Brand
              </p>
              <h1 className="text-6xl font-serif text-[#4A3220] mb-2">Our Story</h1>
              <div className="w-24 h-1 bg-[#C9A66B] mx-auto mb-8 rounded-full"></div>
            </motion.div>

            <motion.p
              className="text-gray-700 max-w-3xl mx-auto text-lg leading-relaxed font-light tracking-wide"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              From <span className="font-semibold text-[#5A4232]">Candlelight Duke</span> to{' '}
              <span className="font-semibold text-[#5A4232]">Pahadicraft</span> — a journey that began with
              5 kilograms of wax, grew through years of learning, and became a dream much bigger than candles.
            </motion.p>
          </div>

          {/* Brand Evolution */}
          {aboutContent && (aboutContent.candlelightDukeLogo || aboutContent.pahadiCraftLogo) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="flex flex-col items-center justify-center gap-8 mb-24"
            >
              <p className="text-sm tracking-[0.2em] uppercase text-[#C9A66B] font-medium">Our Evolution</p>
              <div className="flex items-center gap-8 sm:gap-14">
                <div className="flex flex-col items-center gap-4">
                  {aboutContent.candlelightDukeLogo ? (
                    <div className="w-40 h-40 sm:w-52 sm:h-52 rounded-full bg-white/60 backdrop-blur-sm border border-[#C9A66B]/25 shadow-lg flex items-center justify-center p-4">
                      <img src={aboutContent.candlelightDukeLogo} alt="Candlelight Duke" className="w-full h-full object-contain" />
                    </div>
                  ) : (
                    <div className="w-40 h-40 sm:w-52 sm:h-52 rounded-full bg-white/50 border border-dashed border-[#C9A66B]/40" />
                  )}
                  <span className="text-sm text-gray-500 font-serif">Candlelight Duke</span>
                </div>

                <ArrowRight className="w-8 h-8 text-[#C9A66B] flex-shrink-0" />

                <motion.div
                  initial={{ x: '-60%', opacity: 0 }}
                  whileInView={{ x: 0, opacity: 1 }}
                  transition={{ duration: 1.1, ease: 'easeOut', delay: 0.3 }}
                  viewport={{ once: true }}
                  className="flex flex-col items-center gap-4"
                >
                  {aboutContent.pahadiCraftLogo ? (
                    <div className="w-40 h-40 sm:w-52 sm:h-52 rounded-full bg-white/60 backdrop-blur-sm border border-[#C9A66B]/25 shadow-lg flex items-center justify-center p-4">
                      <img src={aboutContent.pahadiCraftLogo} alt="Pahadicraft" className="w-full h-full object-contain" />
                    </div>
                  ) : (
                    <div className="w-40 h-40 sm:w-52 sm:h-52 rounded-full bg-white/50 border border-dashed border-[#C9A66B]/40" />
                  )}
                  <span className="text-sm text-[#5A4232] font-serif font-medium">Pahadicraft</span>
                </motion.div>
              </div>
            </motion.div>
          )}

          {/* History */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mb-24"
          >
            <div className="text-center mb-12">
              <p className="text-sm tracking-[0.2em] uppercase text-[#C9A66B] font-medium mb-2">
                History & Establishment
              </p>
              <h2 className="text-4xl md:text-5xl font-serif text-[#4A3220] mb-4">
                From Candlelight Duke to Pahadicraft
              </h2>
              <div className="w-24 h-0.5 bg-[#C9A66B] mx-auto"></div>
            </div>

            <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-8 md:p-14 shadow-xl border-2 border-[#E0C9A6]">
              <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] gap-10 lg:gap-12 items-stretch">
                <div>
                  <span className="text-[#C9A66B] font-serif text-lg">September 2017</span>
                  <h3 className="text-3xl font-serif text-[#4A3220] mt-1 mb-5">The Beginning</h3>
                  <div className="w-16 h-0.5 bg-[#C9A66B] mb-6"></div>
                  <p className="text-gray-700 leading-relaxed font-light whitespace-pre-line">{historyIntro}</p>
                </div>

                <div className="hidden lg:flex items-center justify-center">
                  <div className="h-full w-px bg-[#C9A66B]/40 relative">
                    <div className="absolute top-1/2 -translate-y-1/2 -left-2 w-4 h-4 rounded-full bg-[#C9A66B] ring-8 ring-[#F8E3CC]" />
                  </div>
                </div>

                <div>
                  <span className="text-[#C9A66B] font-serif text-lg">2023 → Today</span>
                  <h3 className="text-3xl font-serif text-[#4A3220] mt-1 mb-5">The Vision Expands</h3>
                  <div className="w-16 h-0.5 bg-[#C9A66B] mb-6"></div>
                  <p className="text-gray-700 leading-relaxed font-light whitespace-pre-line">{historyJourney}</p>
                </div>
              </div>

              <div className="mt-12 pt-10 border-t border-[#E0C9A6]">
                <div className="flex items-start gap-4">
                  <Mountain className="w-8 h-8 text-[#C9A66B] flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-2xl font-serif text-[#4A3220] mb-4">Pahadicraft Today</h3>
                    <p className="text-gray-700 leading-relaxed font-light whitespace-pre-line">{historyToday}</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.section>

          {/* Founder */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mb-24"
          >
            <div className="text-center mb-10">
              <p className="text-sm tracking-[0.2em] uppercase text-[#C9A66B] font-medium mb-2">The Person Behind the Dream</p>
              <h2 className="text-4xl md:text-5xl font-serif text-[#4A3220] mb-4">Meet the Founder</h2>
              <div className="w-24 h-0.5 bg-[#C9A66B] mx-auto"></div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-10 items-start bg-white/90 backdrop-blur-xl rounded-3xl p-8 md:p-12 shadow-xl border-2 border-[#E0C9A6]">
              <div className="flex flex-col items-center lg:sticky lg:top-28">
                {aboutContent?.founderPhoto ? (
                  <img
                    src={aboutContent.founderPhoto}
                    alt={aboutContent.founderName || 'Founder'}
                    className="w-56 h-56 rounded-full object-cover border-4 border-[#F5E9DA] shadow-lg"
                  />
                ) : (
                  <div className="w-56 h-56 rounded-full bg-[#F5E9DA] flex items-center justify-center text-7xl font-serif text-[#C9A66B]">
                    {(aboutContent?.founderName || 'Neety Arya').charAt(0)}
                  </div>
                )}
                <div className="text-center mt-5">
                  <h3 className="text-2xl font-serif text-[#4A3220]">{aboutContent?.founderName || 'Neety Arya'}</h3>
                  <p className="text-[#C9A66B] font-serif mt-1">{aboutContent?.founderTitle || 'Founder, Pahadicraft'}</p>
                </div>
              </div>

              <div className="max-w-4xl">
                <div className="flex items-center gap-3 mb-5">
                  <Quote className="w-8 h-8 text-[#C9A66B]" />
                  <p className="font-serif italic text-xl text-[#5A4232]">
                    “You are not made for a job. You are made to give jobs.”
                  </p>
                </div>

                <div className="space-y-5 text-gray-700 leading-relaxed font-light whitespace-pre-line">
                  {founderBio}
                </div>

                <div className="mt-8 pt-7 border-t border-[#E0C9A6]">
                  <p className="text-sm tracking-[0.18em] uppercase text-[#C9A66B] font-medium mb-2">
                    The philosophy
                  </p>
                  <p className="font-serif text-2xl text-[#4A3220]">
                    Create something meaningful. Imagine something bigger. Build something of your own.
                  </p>
                </div>
              </div>
            </div>
          </motion.section>

          {/* Vision */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mb-24"
          >
            <div className="bg-[#5A4232] text-white rounded-3xl p-10 md:p-14 shadow-xl relative overflow-hidden">
              <div className="absolute -right-16 -top-16 w-48 h-48 rounded-full border border-[#C9A66B]/30"></div>
              <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full border border-[#C9A66B]/20"></div>

              <div className="relative max-w-4xl mx-auto text-center">
                <Target className="w-9 h-9 text-[#C9A66B] mx-auto mb-4" />
                <p className="text-sm tracking-[0.25em] uppercase text-[#E0C9A6] font-medium mb-3">Looking Ahead</p>
                <h2 className="text-4xl font-serif mb-6">Our Vision</h2>
                <div className="w-20 h-0.5 bg-[#C9A66B] mx-auto mb-7"></div>
                <p className="text-[#F5E9DA] text-lg leading-relaxed font-light whitespace-pre-line">{vision}</p>
                <div className="mt-8 flex flex-wrap justify-center gap-3">
                  {['Creativity', 'Craftsmanship', 'Quality', 'Experience'].map((item) => (
                    <span key={item} className="px-4 py-2 rounded-full border border-[#C9A66B]/50 text-sm text-[#F5E9DA]">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.section>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-24">
            {[
              { icon: Heart, label: 'Handcrafted', value: '100%' },
              { icon: Award, label: 'Premium Quality', value: 'Guaranteed' },
              { icon: Users, label: 'Happy Customers', value: '10,000+' },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="bg-white/80 backdrop-blur-lg text-center p-7 rounded-2xl shadow-lg border border-[#E0C9A6] hover:shadow-xl transition-all"
              >
                <stat.icon className="w-8 h-8 text-[#C9A66B] mx-auto mb-3" />
                <div className="font-serif text-[#4A3220] text-2xl font-medium mb-1">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </div>

          {/* Our Process */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="bg-white/90 backdrop-blur-xl rounded-3xl p-10 md:p-16 shadow-xl border-2 border-[#E0C9A6] mb-24"
          >
            <div className="text-center mb-12">
              <Sparkles className="w-8 h-8 text-[#C9A66B] mx-auto mb-3" />
              <h2 className="text-4xl font-serif text-[#4A3220] mb-4">Our Process</h2>
              <div className="w-24 h-0.5 bg-[#C9A66B] mx-auto mb-4"></div>
              <p className="max-w-2xl mx-auto text-gray-600 font-light leading-relaxed">
                From thoughtful selection to careful crafting and testing, we continue to build on the hands-on
                learning that shaped the journey from Candlelight Duke to Pahadicraft.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {[
                { title: 'Selection', description: 'Choosing materials, waxes, wicks and fragrance oils with attention to the character and quality of each creation.', image: aboutimg },
                { title: 'Crafting', description: 'Creating products with patience, imagination and the handmade character that remains at the heart of Pahadicraft.', image: decor2 },
                { title: 'Testing', description: 'Reviewing each creation for quality, presentation and the experience we want it to offer our customers.', image: craft },
              ].map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.3 }}
                  viewport={{ once: true }}
                  className="text-center bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-500 transform hover:scale-[1.03]"
                >
                  <div className="h-64 overflow-hidden">
                    <img src={step.image} alt={step.title} className="h-full w-full object-cover transition-transform duration-700 hover:scale-110" />
                  </div>
                  <div className="p-8">
                    <h3 className="font-serif text-[#4A3220] text-2xl mb-3">{step.title}</h3>
                    <div className="w-10 h-0.5 bg-[#C9A66B] mx-auto mb-4"></div>
                    <p className="text-gray-600 leading-relaxed font-light">{step.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Press */}
          {pressMentions.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-serif text-[#4A3220] mb-4 text-center">Press & Recognition</h2>
              <div className="w-24 h-0.5 bg-[#C9A66B] mx-auto mb-12"></div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {pressMentions.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setSelectedPress(m)}
                    className="text-left bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow h-full"
                  >
                    {m.image && <img src={m.image} alt={m.title} className="w-full h-44 object-cover" />}
                    <div className="p-5">
                      <h3 className="font-serif text-[#4A3220] text-lg mb-1">{m.title}</h3>
                      <p className="text-sm text-gray-500 mb-2">{[m.source, m.date].filter(Boolean).join(' — ')}</p>
                      {m.description && <p className="text-sm text-gray-600 leading-relaxed line-clamp-2">{m.description}</p>}
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Press lightbox */}
      <AnimatePresence>
        {selectedPress && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedPress(null)}
            className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.25 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl overflow-hidden shadow-2xl w-full sm:w-[50vw] max-w-2xl max-h-[85vh] overflow-y-auto relative"
            >
              <button
                onClick={() => setSelectedPress(null)}
                className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-white/90 shadow flex items-center justify-center text-[#5A4232] hover:bg-white"
              >
                <X className="w-5 h-5" />
              </button>
              {selectedPress.image && (
                <img src={selectedPress.image} alt={selectedPress.title} className="w-full max-h-[45vh] object-cover" />
              )}
              <div className="p-6 sm:p-8">
                <h3 className="font-serif text-[#4A3220] text-2xl mb-2">{selectedPress.title}</h3>
                <p className="text-sm text-gray-500 mb-4">{[selectedPress.source, selectedPress.date].filter(Boolean).join(' — ')}</p>
                {selectedPress.description && (
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line mb-4">{selectedPress.description}</p>
                )}
                {selectedPress.link && (
                  <a
                    href={selectedPress.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-[#C9A66B] hover:text-[#5A4232] font-medium"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Read full article
                  </a>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default About;
