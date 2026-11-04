import type { Metadata } from 'next';
import Grid from '@/components/Grid';
import PageTitle from '@/components/PageTitle';
import { NotConnected, Notice } from '@/components/States';
import { hasApiKey, tmdb, listOf } from '@/lib/tmdb';
import { gutter } from '@/lib/ui';
import type { Title, TmdbList } from '@/lib/types';

type SearchParams = Promise<{ q?: string | string[] }>;

async function readQuery(searchParams: SearchParams): Promise<string> {
  const q = (await searchParams).q;
  return ((Array.isArray(q) ? q[0] : q) ?? '').trim().slice(0, 100);
}

export async function generateMetadata({ searchParams }: { searchParams: SearchParams }): Promise<Metadata> {
  const q = await readQuery(searchParams);
  return {
    title: q ? `Search results for “${q}”` : 'Search',
    // Keep search result pages out of Google; the title pages themselves get indexed.
    robots: { index: false, follow: true },
  };
}

export default async function Search({ searchParams }: { searchParams: SearchParams }) {
  const q = await readQuery(searchParams);

  let items: Title[] = [];
  let error: Error | null = null;
  if (hasApiKey && q) {
    try {
      items = listOf(await tmdb<TmdbList>('/search/multi', { query: q, include_adult: false }));
    } catch (e) {
      error = e as Error;
    }
  }

  return (
    <div className={gutter}>
      <PageTitle label="Search" title={q ? `“${q}”` : 'Search movies & TV'} />

      {!hasApiKey ? (
        <NotConnected />
      ) : !q ? (
        <Notice title="Type something to search" text="Use the search box at the top of the page." />
      ) : error ? (
        <Notice title="Something went wrong" text={error.message} />
      ) : items.length === 0 ? (
        <Notice title="No matches" text="Check the spelling or try another title." />
      ) : (
        <Grid items={items} />
      )}
    </div>
  );
}
