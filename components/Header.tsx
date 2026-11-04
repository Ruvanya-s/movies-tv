import Link from 'next/link';
import { Suspense } from 'react';
import { ClapperIcon } from './Icons';
import NavLinks from './NavLinks';
import SearchBox, { SearchForm } from './SearchBox';

export default function Header() {
  return (
    <header className="sticky top-0 z-20 flex flex-wrap items-center justify-between gap-3 border-b border-line bg-bg/90 px-4 py-3.5 backdrop-blur-md md:h-[86px] md:flex-nowrap md:gap-6 md:px-6 md:py-0">
      <div className="flex items-center gap-5 md:gap-9">
        <Link href="/" className="flex items-center gap-3 text-cream" aria-label="Reel home">
          <ClapperIcon className="text-[#f1dcc0]" />
          <span className="font-display text-[26px] font-black tracking-tight">Reel</span>
        </Link>
        <NavLinks />
      </div>
      {/* The search box reads the URL, so it needs a Suspense boundary. */}
      <Suspense fallback={<SearchForm />}>
        <SearchBox />
      </Suspense>
    </header>
  );
}
