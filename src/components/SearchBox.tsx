import { useEffect, useState, type FormEvent } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { SearchIcon } from './Icons';

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
      className="flex h-12 w-full items-center gap-3 rounded-full border border-border bg-surface px-5 text-muted transition-colors focus-within:border-muted md:h-14 md:w-[min(480px,40vw)]"
    >
      <SearchIcon />
      <input
        type="search"
        name="q"
        placeholder="Search movies & TV"
        aria-label="Search movies and TV"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        className="min-w-0 flex-1 bg-transparent text-base text-cream outline-none placeholder:text-muted md:text-xl"
      />
    </form>
  );
}
