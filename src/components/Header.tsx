import { Link, NavLink } from 'react-router';
import { ClapperIcon } from './Icons';
import SearchBox from './SearchBox';

const navClass = ({ isActive }: { isActive: boolean }) =>
  `text-base font-medium transition-colors md:text-xl ${isActive ? 'text-cream' : 'text-muted hover:text-cream'}`;

export default function Header() {
  return (
    <header className="sticky top-0 z-20 flex flex-wrap items-center justify-between gap-3 border-b border-line bg-bg/90 px-4 py-3.5 backdrop-blur-md md:h-[86px] md:flex-nowrap md:gap-6 md:px-6 md:py-0">
      <div className="flex items-center gap-5 md:gap-9">
        <Link to="/" className="flex items-center gap-3 text-cream" aria-label="Reel home">
          <ClapperIcon className="text-[#f1dcc0]" />
          <span className="font-display text-[26px] font-black tracking-tight">Reel</span>
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
    </header>
  );
}
