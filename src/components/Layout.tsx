import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router';
import Header from './Header';

/** The shell around every page: header, page content, footer. */
export default function Layout() {
  const { pathname, search } = useLocation();

  // Start each new page at the top.
  // (Braces matter: an effect may only return a cleanup function, and newer
  // browsers make scrollTo() return a value.)
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname, search]);

  return (
    <>
      <Header />
      <main className="min-h-[calc(100vh-160px)]">
        <Outlet />
      </main>
      <footer className="mt-10 flex flex-wrap justify-between gap-3 border-t border-line px-4 py-7 text-[13px] text-muted md:px-6">
        <span className="font-display font-extrabold text-cream">Reel</span>
        <span>Data from TMDB. This product uses the TMDB API but is not endorsed or certified by TMDB.</span>
      </footer>
    </>
  );
}
