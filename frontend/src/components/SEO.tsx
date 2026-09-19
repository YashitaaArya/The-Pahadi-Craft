import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title: string;
  description: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'product';
}

const DEFAULT_IMAGE = 'https://res.cloudinary.com/dwkexvdus/image/upload/v1756711659/IMG-20231204-WA0040_dcsxea.jpg';
const SITE_NAME = 'Pahadi Craft';
const SITE_URL = 'https://thepahadicraft.com';

// Drop this at the top of any page component to set that page's title,
// description, and social-share preview (Open Graph + Twitter Card).
// Without this, every page shares the same generic title/description from
// index.html, which hurts both search rankings and how links look when
// shared on WhatsApp/Instagram/Facebook.
const SEO: React.FC<SEOProps> = ({ title, description, image, url, type = 'website' }) => {
  const fullTitle = `${title} | ${SITE_NAME}`;
  const fullUrl = url ? `${SITE_URL}${url}` : SITE_URL;
  const shareImage = image || DEFAULT_IMAGE;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={fullUrl} />

      {/* Open Graph - controls how this looks when shared on Facebook/WhatsApp/Instagram */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={shareImage} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:site_name" content={SITE_NAME} />

      {/* Twitter Card - same purpose, for X/Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={shareImage} />
    </Helmet>
  );
};

export default SEO;