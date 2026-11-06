import type { ReactNode } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router';
import Grid, { GridSkeleton } from '@/components/Grid';
import { ChevronIcon } from '@/components/Icons';
import PageTitle from '@/components/PageTitle';
import Seo from '@/components/Seo';
import { NotConnected, Notice } from '@/components/States';
import { useTmdb } from '@/hooks/useTmdb';
import { dataReady, listOf } from '@/lib/tmdb';
import { btn, btnGhost, gutter, segment } from '@/lib/ui';
import type { Genre, MediaType, TmdbList } from '@/lib/types';

type SelectProps = { label: string; value: string; onChange: (value: string) => void; children: ReactNode };

function Select({ label, value, onChange, children }: SelectProps) {
  return (
    <label className="relative inline-flex">
      <span className="sr-only">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-12 cursor-pointer appearance-none rounded-full border-2 border-cream bg-cream pr-11 pl-5 font-semibold text-bg transition-colors outline-none hover:border-accent focus-visible:border-accent *:bg-cream"
      >
        {children}
      </select>
      <ChevronIcon size={18} className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 rotate-90 text-bg" />
    </label>
  );
}

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
  const navigate = useNavigate();
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
  const heading = g ? `${g} ${type === 'tv' ? 'series' : 'movies'}` : 'Browse';

  const seo = (
    <Seo
      title={g ? `${g} ${kind}` : `Browse ${kind}`}
      description={`Browse ${g ? `${g.toLowerCase()} ` : ''}${kind.toLowerCase()}, sorted by ${SORTS[sort].toLowerCase()}, with ratings and release years.`}
    />
  );

  if (!dataReady) {
    return (
      <div className={gutter}>
        {seo}
        <PageTitle title="Browse" />
        <NotConnected />
      </div>
    );
  }

  return (
    <div className={gutter}>
      {seo}
      <PageTitle title={heading} />

      <div className="mb-9 flex flex-wrap items-center gap-3.5">
        <div className="inline-flex h-12 items-center rounded-full bg-cream p-1">
          {(
            [
              ['movie', 'Movies'],
              ['tv', 'TV Shows'],
            ] as const
          ).map(([v, label]) => (
            <Link key={v} className={segment(type === v)} to={href(f, { type: v, genre: '', page: 1 })}>
              {label}
            </Link>
          ))}
        </div>
        <Select label="Genre" value={genre} onChange={(v) => navigate(href(f, { genre: v, page: 1 }))}>
          <option value="">All genres</option>
          {genres.map((x) => (
            <option key={x.id} value={x.id}>
              {x.name}
            </option>
          ))}
        </Select>
        <Select label="Sort by" value={sort} onChange={(v) => navigate(href(f, { sort: v as Sort, page: 1 }))}>
          {(Object.keys(SORTS) as Sort[]).map((v) => (
            <option key={v} value={v}>
              {SORTS[v]}
            </option>
          ))}
        </Select>
      </div>

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
