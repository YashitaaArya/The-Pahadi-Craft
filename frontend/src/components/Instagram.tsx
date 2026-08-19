import { motion } from 'framer-motion';
import { Instagram as InstagramIcon } from 'lucide-react';

import {Facebook as FacebookIcon} from 'lucide-react';
import {Youtube as YoutubeIcon} from 'lucide-react';
import {Linkedin as LinkedinIcon} from 'lucide-react';

import insta2 from '../images1/insta2.png';

const instagramPosts = [
  {
    id: 1,
    image: 'https://res.cloudinary.com/dwkexvdus/image/upload/v1756711247/WhatsApp_Image_2023-07-08_at_23.43.06_1_vea6fx.jpg',
  },
  {
    id: 2,
    image: insta2,
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1602874801007-bd458bb1b8b6?q=80&w=2940&auto=format&fit=crop',
  },
  {
    id: 4,
    image: 'https://res.cloudinary.com/dwkexvdus/image/upload/v1756711239/IMG-20231208-WA0007_ebdrwb.jpg',
  },
];

const Instagram = () => {
  const instagramLink = 'https://www.instagram.com/pahadi_craft?igsh=MWZja2s0cXNycTNnZA==';
  const FacebookLink = 'https://www.facebook.com/pahadicraft';
  const YoutubeLink = 'https://www.youtube.com/@PahadiCraft';
  const LinkedinLink = 'https://www.linkedin.com/company/pahadi-craft/';

  const socialLinks = [
    { label: 'Instagram', href: instagramLink, icon: InstagramIcon },
    { label: 'Facebook', href: FacebookLink, icon: FacebookIcon },
    { label: 'YouTube', href: YoutubeLink, icon: YoutubeIcon },
    { label: 'LinkedIn', href: LinkedinLink, icon: LinkedinIcon },
  ];

  const linkedPosts = instagramPosts.map((post, index) => ({
    ...post,
    href: socialLinks[index % socialLinks.length].href,
    label: socialLinks[index % socialLinks.length].label,
  }));

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="flex items-center justify-center gap-2 mb-12">
            <InstagramIcon className="w-8 h-8 text-[#C9A66B]" />
            <h2 className="text-4xl font-serif text-center text-[#5A4232]">Follow Us on Instagram</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {linkedPosts.map((post) => (
              <a
                key={post.id}
                href={post.href}
                target="_blank"
                rel="noopener noreferrer"
                className="relative aspect-square group overflow-hidden block"
              >
                <img
                  src={post.image}
                  alt={`${post.label} post`}
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <InstagramIcon className="w-8 h-8 text-white" />
                </div>
              </a>
            ))}
          </div>
          <div className="text-center mt-8">
            <div className="flex items-center justify-center gap-5">
              {socialLinks.map(({ label, href, icon: Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Visit Pahadi Craft on ${label}`}
                  title={label}
                  className="text-[#5A4232] hover:text-[#C9A66B] transition-colors"
                >
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Instagram;
