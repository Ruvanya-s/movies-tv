import { Link, NavLink, useLocation } from 'react-router';
import SearchBox from './SearchBox';

const navClass = ({ isActive }: { isActive: boolean }) =>
  `text-[15px] font-medium transition-colors md:text-base ${isActive ? 'text-accent' : 'text-cream hover:text-accent'}`;

export default function Header() {
  // decides whehter Movies or TV Shows should be highlighted in the navigation
  const { pathname, search } = useLocation();
  const onBrowse = pathname === '/browse';
  const onTv = onBrowse && new URLSearchParams(search).get('type') === 'tv';
  const onMovies = onBrowse && !onTv;

  return (
    <header className="sticky top-0 z-20 flex flex-wrap items-center justify-between gap-3 px-4 py-3.5 md:px-10 lg:h-[76px] lg:flex-nowrap lg:gap-6 lg:px-16 lg:py-0">
      <div className="absolute inset-0 -z-10 bg-bg/60 backdrop-blur-md" />
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 sm:flex-nowrap md:gap-9">
        <Link to="/" className="flex items-center gap-2.5" aria-label="SlateQue home">
          <img src="/favicon.svg" alt="" width={30} height={30} />
          <span className="text-coral font-display text-[26px] font-extrabold tracking-tight">SlateQue</span>
        </Link>
        <nav className="flex gap-3.5 whitespace-nowrap md:gap-[30px]">
          <NavLink to="/" end className={navClass}>
            Home
          </NavLink>
          <Link
            to="/browse"
            className={navClass({ isActive: onMovies })}
            aria-current={onMovies ? 'page' : undefined}
          >
            Movies
          </Link>
          <Link
            to="/browse?type=tv"
            className={navClass({ isActive: onTv })}
            aria-current={onTv ? 'page' : undefined}
          >
            TV Shows
          </Link>
        </nav>
      </div>
      <SearchBox />
      <div className="absolute inset-x-0 bottom-0 h-[3px] bg-linear-to-r from-[#ffc5b6] via-accent to-accent/15" />
    </header>
  );
}
