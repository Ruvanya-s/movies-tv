import { useEffect, useState, type FormEvent } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { SearchIcon } from './Icons';
import { glass } from '@/lib/ui';

export default function SearchBox() {
  const navigate = useNavigate();
  const location = useLocation();
  const [q, setQ] = useState('');

  // Keep the box in sync with /search?q=...
  useEffect(() => {
    if (location.pathname === '/search') {
      setQ(new URLSearchParams(location.search).get('q') ?? '');
    }
  }, [location.pathname, location.search]);

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const term = q.trim();
    if (term) navigate(`/search?q=${encodeURIComponent(term)}`);
  };

  return (
    <form
      role="search"
      onSubmit={submit}
      className={`${glass} flex h-12 w-full items-center gap-3 rounded-full bg-cream/12 px-5 transition-colors focus-within:border-accent focus-within:bg-cream/18 md:w-[min(440px,36vw)]`}
    >
      <SearchIcon />
      <input
        type="search"
        name="q"
        placeholder="Search movies & TV"
        aria-label="Search movies and TV"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        className="min-w-0 flex-1 bg-transparent text-base text-cream outline-none placeholder:text-cream/75 md:text-[17px]"
      />
    </form>
  );
}
