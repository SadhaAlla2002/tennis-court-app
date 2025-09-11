import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Ensures each route change starts at the top of the page.
export const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();

  // Disable native scroll restoration so we fully control scroll position
  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      try {
        window.history.scrollRestoration = 'manual';
      } catch {}
    }
  }, []);

  useEffect(() => {
    // Use 'auto' to avoid jarring smooth scroll during navigation
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [pathname]);

  return null;
};

export default ScrollToTop;

