import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// React Router doesn't reset scroll position on navigation by default - without
// this, clicking a nav/footer link while scrolled down lands you at the same
// scroll depth on the new page instead of its top.
//
// Two things matter here beyond the obvious scrollTo call:
//  1. 'instant' isn't reliably supported as a scroll behavior across browsers,
//     and an unsupported value can make the whole call a no-op. Setting
//     scrollTop directly on both documentElement and body is the dependable way.
//  2. Pages are lazy-loaded, so at the moment the route changes the new page's
//     content may not have rendered yet - and scrolling before layout exists
//     does nothing. A double requestAnimationFrame waits for the browser to
//     actually paint before scrolling.
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    const scrollToTop = () => {
      window.scrollTo(0, 0);
      if (document.documentElement) document.documentElement.scrollTop = 0;
      if (document.body) document.body.scrollTop = 0;
    };

    scrollToTop();
    const raf = requestAnimationFrame(() => {
      requestAnimationFrame(scrollToTop);
    });

    return () => cancelAnimationFrame(raf);
  }, [pathname]);

  return null;
};

export default ScrollToTop;