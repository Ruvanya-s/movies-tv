import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router';
import Header from './Header';

/** header, page content, footer. */
export default function Layout() {
  const { pathname, search } = useLocation();

  // Start each new page at the top.
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
      <footer className="relative mt-10 flex flex-wrap justify-between gap-3 bg-linear-to-l from-accent/20 via-accent/7 via-35% to-transparent to-65% px-4 py-7 text-[13px] text-muted md:px-10 lg:px-16">
        <div className="absolute inset-x-0 top-0 h-px bg-linear-to-l from-accent to-line to-60%" />
        <span className="text-coral font-display text-base font-extrabold">SlateQue</span>
        <span>Data from TMDB. This product uses the TMDB API but is not endorsed or certified by TMDB.</span>
      </footer>
    </>
  );
}
