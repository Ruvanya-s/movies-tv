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
      <main className="relative isolate min-h-[calc(100vh-160px)]">
        <div className="coral-glow absolute inset-x-0 top-0 -z-10 h-[340px]" />
        <Outlet />
      </main>
      <footer className="relative mt-10 flex flex-wrap justify-between gap-3 px-4 py-7 text-[13px] text-muted md:px-10 lg:px-16">
        <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-accent to-line to-60%" />
        <span className="text-coral font-display text-base font-extrabold">SlateQue</span>
        <span>Data from TMDB. This product uses the TMDB API but is not endorsed or certified by TMDB.</span>
      </footer>
    </>
  );
}
