'use client';

import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { SearchIcon } from './Icons';

type FormProps = {
  value?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  onSubmit?: (e: FormEvent<HTMLFormElement>) => void;
};

// A plain GET form to /search, so searching works even before JavaScript loads.
export function SearchForm({ value, onChange, onSubmit }: FormProps) {
  return (
    <form
      action="/search"
      method="get"
      role="search"
      onSubmit={onSubmit}
      className="flex h-12 w-full items-center gap-3 rounded-full border border-border bg-surface px-5 text-muted transition-colors focus-within:border-muted md:h-14 md:w-[min(480px,40vw)]"
    >
      <SearchIcon />
      <input
        type="search"
        name="q"
        placeholder="Search movies & TV"
        aria-label="Search movies and TV"
        value={value}
        onChange={onChange}
        className="min-w-0 flex-1 bg-transparent text-base text-cream outline-none placeholder:text-muted md:text-xl"
      />
    </form>
  );
}

export default function SearchBox() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [q, setQ] = useState('');

  // Keep the box in sync with /search?q=...
  useEffect(() => {
    if (pathname === '/search') setQ(params.get('q') ?? '');
  }, [pathname, params]);

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const term = q.trim();
    if (term) router.push(`/search?q=${encodeURIComponent(term)}`);
  };

  return <SearchForm value={q} onChange={(e) => setQ(e.target.value)} onSubmit={submit} />;
}
