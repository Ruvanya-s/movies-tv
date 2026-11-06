import { useSearchParams } from 'react-router';
import Grid, { GridSkeleton } from '@/components/Grid';
import PageTitle from '@/components/PageTitle';
import Seo from '@/components/Seo';
import { NotConnected, Notice } from '@/components/States';
import { useTmdb } from '@/hooks/useTmdb';
import { dataReady, listOf } from '@/lib/tmdb';
import { gutter } from '@/lib/ui';
import type { TmdbList } from '@/lib/types';

export default function Search() {
  const [searchParams] = useSearchParams();
  const q = (searchParams.get('q') ?? '').trim().slice(0, 100);

  // `null` path = don't search until there's a query.
  const { data, loading, error } = useTmdb<TmdbList>(q ? '/search/multi' : null, {
    query: q,
    include_adult: false,
  });
  const items = listOf(data);

  return (
    <div className={gutter}>
      {/* Search results shouldn't appear in Google; the title pages themselves should. */}
      <Seo title={q ? `Search results for “${q}”` : 'Search'} noindex />
      {q ? (
        <section className="pt-10 pb-7 md:pt-14">
          <h1 className="font-display text-2xl leading-snug font-bold tracking-tight wrap-anywhere md:text-[32px]">
            These are the results for <span className="text-coral">“{q}”</span>
          </h1>
        </section>
      ) : (
        <PageTitle label="Search" title="Search movies & TV" />
      )}

      {!dataReady ? (
        <NotConnected />
      ) : !q ? (
        <Notice title="Type something to search" text="Use the search box at the top of the page." />
      ) : error ? (
        <Notice title="Something went wrong" text={error.message} />
      ) : loading ? (
        <GridSkeleton />
      ) : items.length === 0 ? (
        <Notice title="No matches for your search" />
      ) : (
        <Grid items={items} />
      )}
    </div>
  );
}
