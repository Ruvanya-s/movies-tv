import type { Metadata } from 'next';
import Link from 'next/link';
import Grid from '@/components/Grid';
import PageTitle from '@/components/PageTitle';
import { NotConnected, Notice } from '@/components/States';
import { hasApiKey, tmdb, tmdbSafe, listOf } from '@/lib/tmdb';
import { btn, btnGhost, chip, gutter, segment } from '@/lib/ui';
import type { Genre, MediaType, TmdbList } from '@/lib/types';

const SORTS = {
  'popularity.desc': 'Most popular',
  'vote_average.desc': 'Highest rated',
  newest: 'Newest',
} as const;
type Sort = keyof typeof SORTS;

type Filters = { type: MediaType; genre: string; sort: Sort; page: number };
type SearchParams = Promise<Record<string, string | string[] | undefined>>;

const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) ?? '';

function readFilters(sp: Awaited<SearchParams>): Filters {
  const sort = one(sp.sort);
  const genre = one(sp.genre);
  return {
    type: one(sp.type) === 'tv' ? 'tv' : 'movie',
    genre: /^\d+$/.test(genre) ? genre : '',
    sort: sort in SORTS ? (sort as Sort) : 'popularity.desc',
    page: Math.min(Math.max(parseInt(one(sp.page), 10) || 1, 1), 500),
  };
}

/** Build a /browse URL from the current filters plus some changes. */
function href(current: Filters, changes: Partial<Filters>): string {
  const next = { ...current, ...changes };
  const p = new URLSearchParams();
  if (next.type !== 'movie') p.set('type', next.type);
  if (next.genre) p.set('genre', next.genre);
  if (next.sort !== 'popularity.desc') p.set('sort', next.sort);
  if (next.page > 1) p.set('page', String(next.page));
  const s = p.toString();
  return s ? `/browse?${s}` : '/browse';
}

async function getGenres(type: MediaType): Promise<Genre[]> {
  return (await tmdbSafe<{ genres: Genre[] }>(`/genre/${type}/list`))?.genres ?? [];
}

export async function generateMetadata({ searchParams }: { searchParams: SearchParams }): Promise<Metadata> {
  const f = readFilters(await searchParams);
  const kind = f.type === 'tv' ? 'TV Series' : 'Movies';
  const g = (await getGenres(f.type)).find((x) => String(x.id) === f.genre)?.name;
  return {
    title: g ? `${g} ${kind}` : `Browse ${kind}`,
    description: `Browse ${g ? `${g.toLowerCase()} ` : ''}${kind.toLowerCase()}, sorted by ${SORTS[f.sort].toLowerCase()}, with ratings and release years.`,
    alternates: { canonical: href(f, {}) },
  };
}

export default async function Browse({ searchParams }: { searchParams: SearchParams }) {
  const f = readFilters(await searchParams);
  const { type, genre, sort, page } = f;

  if (!hasApiKey) {
    return (
      <div className={gutter}>
        <PageTitle label="Browse" title="Every genre, every era." />
        <NotConnected />
      </div>
    );
  }

  const today = new Date().toISOString().slice(0, 10);
  const sortBy = sort === 'newest' ? (type === 'movie' ? 'primary_release_date.desc' : 'first_air_date.desc') : sort;

  let data: TmdbList | null = null;
  let error: Error | null = null;
  try {
    data = await tmdb<TmdbList>(`/discover/${type}`, {
      page,
      sort_by: sortBy,
      with_genres: genre,
      'vote_count.gte': sort === 'vote_average.desc' ? 300 : sort === 'newest' ? 20 : undefined,
      // Hide titles that haven't come out yet.
      [type === 'movie' ? 'primary_release_date.lte' : 'first_air_date.lte']: today,
    });
  } catch (e) {
    error = e as Error;
  }

  const genres = await getGenres(type);
  const items = listOf(data, type);
  const totalPages = Math.min(data?.total_pages ?? 1, 500);
  const g = genres.find((x) => String(x.id) === genre)?.name;
  const heading = g ? `${g} ${type === 'tv' ? 'series' : 'films'}.` : 'Every genre, every era.';

  return (
    <div className={gutter}>
      <PageTitle label="Browse" title={heading} />

      <div className="mb-[18px] flex flex-wrap justify-between gap-3.5">
        <div className="inline-flex flex-wrap rounded-full border border-border bg-surface p-1">
          {(
            [
              ['movie', 'Films'],
              ['tv', 'Series'],
            ] as const
          ).map(([v, label]) => (
            <Link key={v} className={segment(type === v)} href={href(f, { type: v, genre: '', page: 1 })}>
              {label}
            </Link>
          ))}
        </div>
        <div className="inline-flex flex-wrap rounded-full border border-border bg-surface p-1">
          {(Object.keys(SORTS) as Sort[]).map((v) => (
            <Link key={v} className={segment(sort === v)} href={href(f, { sort: v, page: 1 })}>
              {SORTS[v]}
            </Link>
          ))}
        </div>
      </div>

      <nav className="mb-8 flex flex-wrap gap-2.5" aria-label="Genres">
        <Link className={chip(!genre)} href={href(f, { genre: '', page: 1 })}>
          All
        </Link>
        {genres.map((x) => (
          <Link key={x.id} className={chip(genre === String(x.id))} href={href(f, { genre: String(x.id), page: 1 })}>
            {x.name}
          </Link>
        ))}
      </nav>

      {error ? (
        <Notice title="Something went wrong" text={error.message} />
      ) : items.length === 0 ? (
        <Notice title="Nothing here yet" text="Try a different genre or sort order." />
      ) : (
        <Grid items={items} />
      )}

      {items.length > 0 && (
        <nav className="mt-2 mb-16 flex items-center justify-between gap-4" aria-label="Pagination">
          {page > 1 ? (
            <Link className={btnGhost} href={href(f, { page: page - 1 })} rel="prev">
              ← Previous
            </Link>
          ) : (
            <span />
          )}
          <span className="font-semibold text-muted">
            Page {page} of {totalPages}
          </span>
          {page < totalPages ? (
            <Link className={btn} href={href(f, { page: page + 1 })} rel="next">
              Next →
            </Link>
          ) : (
            <span />
          )}
        </nav>
      )}
    </div>
  );
}
