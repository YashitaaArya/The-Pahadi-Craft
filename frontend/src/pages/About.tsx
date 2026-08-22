import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Award, Users, Quote, Mountain, Hammer, ArrowRight, X, ExternalLink } from 'lucide-react';
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
}

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8 }
};

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

  return (
    <div className="min-h-screen pt-20 bg-gradient-to-br from-[#FCF7F0] to-[#F8E3CC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.2 }}>

          {/* Hero */}
          <div className="text-center mb-20 px-4">
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.2 }}>
              <h1 className="text-6xl font-serif text-[#4A3220] mb-2">Our Story</h1>
              <div className="w-24 h-1 bg-[#C9A66B] mx-auto mb-8 rounded-full"></div>
            </motion.div>
            <motion.p
              className="text-gray-700 max-w-3xl mx-auto text-lg leading-relaxed font-light tracking-wide"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.5 }}
            >
              From <span className="font-semibold text-[#5A4232]">Candlelight Duke</span> to{' '}
              <span className="font-semibold text-[#5A4232]">Pahadicraft</span> — a journey that began with 5 kilograms
              of wax and a dream of building something truly our own.
            </motion.p>
          </div>

          {/* History: Candlelight Duke -> Pahadi Craft logo transition */}
          {aboutContent && (aboutContent.candlelightDukeLogo || aboutContent.pahadiCraftLogo) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="flex flex-col items-center justify-center gap-6 mb-24"
            >
              <p className="text-sm tracking-[0.2em] uppercase text-[#C9A66B] font-medium">Our Evolution</p>
              <div className="flex items-center gap-6 sm:gap-10">
                <div className="flex flex-col items-center gap-3">
                  {aboutContent.candlelightDukeLogo ? (
                    <img src={aboutContent.candlelightDukeLogo} alt="Candlelight Duke" className="w-28 h-28 sm:w-36 sm:h-36 object-contain opacity-80 grayscale" />
                  ) : (
                    <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-full bg-white/50 border border-dashed border-[#C9A66B]/40" />
                  )}
                  <span className="text-sm text-gray-500 font-serif">Candlelight Duke</span>
                </div>
                <ArrowRight className="w-8 h-8 text-[#C9A66B] flex-shrink-0" />
                <div className="flex flex-col items-center gap-3">
                  {aboutContent.pahadiCraftLogo ? (
                    <img src={aboutContent.pahadiCraftLogo} alt="Pahadi Craft" className="w-28 h-28 sm:w-36 sm:h-36 object-contain" />
                  ) : (
                    <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-full bg-white/50 border border-dashed border-[#C9A66B]/40" />
                  )}
                  <span className="text-sm text-[#5A4232] font-serif font-medium">Pahadi Craft</span>
                </div>
              </div>
            </motion.div>
          )}

          {/* The Beginning - 2017 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center mb-24">
            <motion.div variants={fadeIn} initial="initial" whileInView="animate" viewport={{ once: true }}>
              <span className="text-[#C9A66B] font-serif text-lg">September 2017</span>
              <h2 className="text-4xl font-serif text-[#4A3220] mb-4 mt-1">The Beginning</h2>
              <div className="w-16 h-0.5 bg-[#C9A66B] mb-6"></div>
              <p className="text-gray-700 text-lg mb-6 leading-relaxed font-light">
                After returning from Hyderabad, our founder set out to build something of her own — something
                creative, something driven by imagination. During an interview for a teaching job, an interviewer
                said something that changed everything:
              </p>
              <blockquote className="border-l-4 border-[#C9A66B] pl-5 italic text-[#5A4232] text-xl font-serif mb-6">
                <Quote className="w-6 h-6 text-[#C9A66B] mb-2" />
                "You are not made for a job. You are made to give jobs."
              </blockquote>
              <p className="text-gray-700 text-lg leading-relaxed font-light">
                With no large facility, no established brand, and just <strong className="text-[#5A4232]">5 kilograms
                of wax</strong>, that idea became <em>Candlelight Duke</em> — the foundation everything else was built on.
              </p>
            </motion.div>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }} whileInView={{ scale: 1, opacity: 1 }} transition={{ duration: 1 }}
              viewport={{ once: true }}
              className="rounded-3xl overflow-hidden shadow-2xl border-2 border-[#E0C9A6] transform hover:scale-[1.02] transition-transform duration-500"
            >
              <img src={aboutimg} alt="Candle making process" className="w-full h-full object-cover" />
            </motion.div>
          </div>

          {/* Growth + Evolution to Pahadicraft */}
          <motion.div
            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="bg-white/90 backdrop-blur-xl rounded-3xl p-10 md:p-16 shadow-xl border-2 border-[#E0C9A6] mb-24"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div>
                <Hammer className="w-8 h-8 text-[#C9A66B] mb-3" />
                <h3 className="text-2xl font-serif text-[#4A3220] mb-3">Five Years of Learning</h3>
                <p className="text-gray-600 leading-relaxed font-light">
                  For nearly five years, Candlelight Duke grew through experimentation — fragrances, waxes,
                  designs, packaging, and countless customer conversations. Every product taught us something new
                  about craft, quality, and what it takes to build a brand people trust.
                </p>
              </div>
              <div>
                <Mountain className="w-8 h-8 text-[#C9A66B] mb-3" />
                <h3 className="text-2xl font-serif text-[#4A3220] mb-3">2023 — Pahadicraft is Born</h3>
                <p className="text-gray-600 leading-relaxed font-light">
                  By 2023, our vision had outgrown candles alone. We wanted a name that reflected our roots in the
                  mountains of Himachal Pradesh. <strong className="text-[#5A4232]">Pahadi</strong> represents our
                  mountains, our culture, our connection to nature. <strong className="text-[#5A4232]">Craft</strong>{' '}
                  represents the hands and heart behind every piece. Together, they carry a much larger vision.
                </p>
              </div>
            </div>
          </motion.div>

          {/* About the Founder */}
          <motion.div
            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-10 items-center mb-24 bg-white/90 backdrop-blur-xl rounded-3xl p-10 md:p-14 shadow-xl border-2 border-[#E0C9A6]"
          >
            <div className="md:col-span-1 flex justify-center">
              {aboutContent?.founderPhoto ? (
                <img
                  src={aboutContent.founderPhoto}
                  alt={aboutContent.founderName}
                  className="w-48 h-48 rounded-full object-cover border-4 border-[#F5E9DA] shadow-lg"
                />
              ) : (
                <div className="w-48 h-48 rounded-full bg-[#F5E9DA] flex items-center justify-center text-6xl font-serif text-[#C9A66B]">
                  {(aboutContent?.founderName || 'Neety Arya').charAt(0)}
                </div>
              )}
            </div>
            <div className="md:col-span-2 text-center md:text-left">
              <p className="text-sm tracking-[0.2em] uppercase text-[#C9A66B] font-medium mb-2">About the Founder</p>
              <h2 className="text-3xl font-serif text-[#4A3220] mb-1">{aboutContent?.founderName || 'Neety Arya'}</h2>
              <p className="text-[#C9A66B] font-serif mb-4">{aboutContent?.founderTitle || 'Founder, Pahadi Craft'}</p>
              <p className="text-gray-700 leading-relaxed font-light whitespace-pre-line">
                {aboutContent?.founderBio ||
                  'Our journey is guided by the unwavering vision of Neety Arya, whose dedication continues to inspire us in delivering joy, warmth, and elegance to homes across the country.'}
              </p>
            </div>
          </motion.div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-24">
            {[
              { icon: Heart, label: 'Handcrafted', value: '100%' },
              { icon: Award, label: 'Premium Quality', value: 'Guaranteed' },
              { icon: Users, label: 'Happy Customers', value: '10,000+' },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }} viewport={{ once: true }}
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
            initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="bg-white/90 backdrop-blur-xl rounded-3xl p-16 shadow-xl border-2 border-[#E0C9A6] mb-24"
          >
            <h2 className="text-4xl font-serif text-[#4A3220] mb-4 text-center">Our Process</h2>
            <div className="w-24 h-0.5 bg-[#C9A66B] mx-auto mb-16"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {[
                { title: 'Selection', description: 'Sourcing the finest wax, wicks, and fragrance oils that are safe and sustainable.', image: aboutimg },
                { title: 'Crafting', description: 'Hand-poured in small batches to ensure quality, consistency, and love in each piece.', image: decor2 },
                { title: 'Testing', description: 'Each batch is rigorously tested for scent throw, burn quality, and customer delight.', image: craft },
              ].map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.3 }} viewport={{ once: true }}
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

          {/* Press & Recognition - only shows if the owner has added any */}
          {pressMentions.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}
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

      {/* Press mention lightbox - zooms to ~50% of the screen, centered */}
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