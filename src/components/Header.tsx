import { Link, NavLink } from 'react-router';
import { ClapperIcon } from './Icons';
import SearchBox from './SearchBox';

const navClass = ({ isActive }: { isActive: boolean }) =>
  `text-[15px] font-medium transition-colors md:text-base ${isActive ? 'text-accent' : 'text-cream hover:text-accent'}`;

export default function Header() {
  return (
    <header className="sticky top-0 z-20 flex flex-wrap items-center justify-between gap-3 px-4 py-3.5 md:h-[76px] md:flex-nowrap md:gap-6 md:px-10 md:py-0 lg:px-16">
      {/* The blur sits on its own layer: if the header itself blurred, the glass search box couldn't see the page behind it. */}
      <div className="absolute inset-0 -z-10 bg-bg/60 backdrop-blur-md" />
      <div className="flex items-center gap-5 md:gap-9">
        <Link to="/" className="flex items-center gap-2.5" aria-label="Reel home">
          <ClapperIcon className="text-accent" />
          <span className="text-coral font-display text-[26px] font-extrabold tracking-tight">Reel</span>
        </Link>
        <nav className="flex gap-[18px] md:gap-[30px]">
          <NavLink to="/" end className={navClass}>
            Home
          </NavLink>
          <NavLink to="/browse" className={navClass}>
            Browse
          </NavLink>
        </nav>
      </div>
      <SearchBox />
      {/* Coral line that fades out to the right */}
      <div className="absolute inset-x-0 bottom-0 h-[3px] bg-linear-to-r from-[#ffc5b6] via-accent to-accent/15" />
    </header>
  );
}
