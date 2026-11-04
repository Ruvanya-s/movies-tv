import { Link, useSearchParams } from 'react-router';
import Grid, { GridSkeleton } from '@/components/Grid';
import PageTitle from '@/components/PageTitle';
import Seo from '@/components/Seo';
import { NotConnected, Notice } from '@/components/States';
import { useTmdb } from '@/hooks/useTmdb';
import { hasApiKey, listOf } from '@/lib/tmdb';
import { btn, btnGhost, chip, gutter, segment } from '@/lib/ui';
import type { Genre, MediaType, TmdbList } from '@/lib/types';

const SORTS = {
  'popularity.desc': 'Most popular',
  'vote_average.desc': 'Highest rated',
  newest: 'Newest',
} as const;
type Sort = keyof typeof SORTS;

type Filters = { type: MediaType; genre: string; sort: Sort; page: number };

function readFilters(sp: URLSearchParams): Filters {
  const sort = sp.get('sort') ?? '';
  const genre = sp.get('genre') ?? '';
  return {
    type: sp.get('type') === 'tv' ? 'tv' : 'movie',
    genre: /^\d+$/.test(genre) ? genre : '',
    sort: sort in SORTS ? (sort as Sort) : 'popularity.desc',
    page: Math.min(Math.max(parseInt(sp.get('page') ?? '', 10) || 1, 1), 500),
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

const today = new Date().toISOString().slice(0, 10);

export default function Browse() {
  const [searchParams] = useSearchParams();
  const f = readFilters(searchParams);
  const { type, genre, sort, page } = f;

  const genres = useTmdb<{ genres: Genre[] }>(`/genre/${type}/list`).data?.genres ?? [];
  const sortBy = sort === 'newest' ? (type === 'movie' ? 'primary_release_date.desc' : 'first_air_date.desc') : sort;
  const { data, loading, error } = useTmdb<TmdbList>(`/discover/${type}`, {
    page,
    sort_by: sortBy,
    with_genres: genre,
    'vote_count.gte': sort === 'vote_average.desc' ? 300 : sort === 'newest' ? 20 : undefined,
    // Hide titles that haven't come out yet.
    [type === 'movie' ? 'primary_release_date.lte' : 'first_air_date.lte']: today,
  });

  const items = listOf(data, type);
  const totalPages = Math.min(data?.total_pages ?? 1, 500);
  const g = genres.find((x) => String(x.id) === genre)?.name;
  const kind = type === 'tv' ? 'TV Series' : 'Movies';
  const heading = g ? `${g} ${type === 'tv' ? 'series' : 'films'}.` : 'Every genre, every era.';

  const seo = (
    <Seo
      title={g ? `${g} ${kind}` : `Browse ${kind}`}
      description={`Browse ${g ? `${g.toLowerCase()} ` : ''}${kind.toLowerCase()}, sorted by ${SORTS[sort].toLowerCase()}, with ratings and release years.`}
    />
  );

  if (!hasApiKey) {
    return (
      <div className={gutter}>
        {seo}
        <PageTitle label="Browse" title="Every genre, every era." />
        <NotConnected />
      </div>
    );
  }

  return (
    <div className={gutter}>
      {seo}
      <PageTitle label="Browse" title={heading} />

      <div className="mb-[18px] flex flex-wrap justify-between gap-3.5">
        <div className="inline-flex flex-wrap rounded-full border border-border bg-surface p-1">
          {(
            [
              ['movie', 'Films'],
              ['tv', 'Series'],
            ] as const
          ).map(([v, label]) => (
            <Link key={v} className={segment(type === v)} to={href(f, { type: v, genre: '', page: 1 })}>
              {label}
            </Link>
          ))}
        </div>
        <div className="inline-flex flex-wrap rounded-full border border-border bg-surface p-1">
          {(Object.keys(SORTS) as Sort[]).map((v) => (
            <Link key={v} className={segment(sort === v)} to={href(f, { sort: v, page: 1 })}>
              {SORTS[v]}
            </Link>
          ))}
        </div>
      </div>

      <nav className="mb-8 flex flex-wrap gap-2.5" aria-label="Genres">
        <Link className={chip(!genre)} to={href(f, { genre: '', page: 1 })}>
          All
        </Link>
        {genres.map((x) => (
          <Link key={x.id} className={chip(genre === String(x.id))} to={href(f, { genre: String(x.id), page: 1 })}>
            {x.name}
          </Link>
        ))}
      </nav>

      {error ? (
        <Notice title="Something went wrong" text={error.message} />
      ) : loading ? (
        <GridSkeleton />
      ) : items.length === 0 ? (
        <Notice title="Nothing here yet" text="Try a different genre or sort order." />
      ) : (
        <Grid items={items} />
      )}

      {!loading && items.length > 0 && (
        <nav className="mt-2 mb-16 flex items-center justify-between gap-4" aria-label="Pagination">
          {page > 1 ? (
            <Link className={btnGhost} to={href(f, { page: page - 1 })} rel="prev">
              ← Previous
            </Link>
          ) : (
            <span />
          )}
          <span className="font-semibold text-muted">
            Page {page} of {totalPages}
          </span>
          {page < totalPages ? (
            <Link className={btn} to={href(f, { page: page + 1 })} rel="next">
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
