import { Link, useParams } from 'react-router';
import Row from '@/components/Row';
import RowTrack from '@/components/RowTrack';
import Seo from '@/components/Seo';
import JsonLd from '@/components/JsonLd';
import { NotConnected, Notice } from '@/components/States';
import { StarIcon } from '@/components/Icons';
import NotFound from './NotFound';
import { useTmdb } from '@/hooks/useTmdb';
import { hasApiKey, img, NotFoundError } from '@/lib/tmdb';
import { btn, chip, gutter, pill } from '@/lib/ui';
import type { MediaType, TmdbDetail } from '@/lib/types';

const runtime = (m?: number) => (m ? `${Math.floor(m / 60)}h ${m % 60}m` : null);

const findTrailer = (d: TmdbDetail) => d.videos?.results.find((v) => v.site === 'YouTube' && v.type === 'Trailer');
const findDirector = (d: TmdbDetail) => d.credits?.crew.find((c) => c.job === 'Director');

/** schema.org Movie / TVSeries data that helps search engines understand the page. */
function structuredData(type: MediaType, d: TmdbDetail): Record<string, unknown> {
  const name = d.title || d.name;
  const director = findDirector(d);
  const trailer = findTrailer(d);
  return {
    '@context': 'https://schema.org',
    '@type': type === 'tv' ? 'TVSeries' : 'Movie',
    name,
    url: `${window.location.origin}/${type}/${d.id}`,
    description: d.overview || undefined,
    image: img(d.poster_path, 'w500') ?? undefined,
    datePublished: d.release_date || d.first_air_date || undefined,
    genre: d.genres?.map((g) => g.name),
    actor: d.credits?.cast.slice(0, 10).map((p) => ({ '@type': 'Person', name: p.name })),
    director: director ? { '@type': 'Person', name: director.name } : undefined,
    creator: d.created_by?.length ? d.created_by.map((c) => ({ '@type': 'Person', name: c.name })) : undefined,
    numberOfSeasons: type === 'tv' ? d.number_of_seasons : undefined,
    duration: d.runtime ? `PT${Math.floor(d.runtime / 60)}H${d.runtime % 60}M` : undefined,
    aggregateRating:
      d.vote_count && d.vote_average
        ? {
            '@type': 'AggregateRating',
            ratingValue: Number(d.vote_average.toFixed(1)),
            bestRating: 10,
            worstRating: 0,
            ratingCount: d.vote_count,
          }
        : undefined,
    trailer: trailer
      ? {
          '@type': 'VideoObject',
          name: `${name} trailer`,
          embedUrl: `https://www.youtube.com/embed/${trailer.key}`,
          thumbnailUrl: `https://i.ytimg.com/vi/${trailer.key}/hqdefault.jpg`,
          uploadDate: trailer.published_at,
        }
      : undefined,
  };
}

/** Detail page for /movie/:id and /tv/:id. */
export default function Details({ type }: { type: MediaType }) {
  const { id = '' } = useParams();
  const validId = /^\d+$/.test(id);
  const { data, loading, error } = useTmdb<TmdbDetail>(validId ? `/${type}/${id}` : null, {
    append_to_response: 'credits,videos',
  });

  if (!validId || error instanceof NotFoundError) return <NotFound />;
  if (!hasApiKey) {
    return (
      <div className={gutter}>
        <NotConnected />
      </div>
    );
  }
  if (error) {
    return (
      <div className={gutter}>
        <Notice title="Something went wrong" text={error.message} />
      </div>
    );
  }
  if (loading || !data) {
    return (
      <div className={`${gutter} pt-6`}>
        <div className="skeleton h-[60vh] rounded-[18px]" />
      </div>
    );
  }

  const title = data.title || data.name || 'Untitled';
  const date = data.release_date || data.first_air_date || '';
  const year = date.slice(0, 4);
  const trailer = findTrailer(data);
  const director = findDirector(data);
  const cast = data.credits?.cast.slice(0, 12) ?? [];
  const creators = data.created_by?.map((c) => c.name).join(', ');
  const seasons = data.number_of_seasons;
  const backdrop = img(data.backdrop_path, 'w1280');
  const poster = img(data.poster_path, 'w500');

  const facts = [
    year,
    type === 'movie' ? runtime(data.runtime) : seasons ? `${seasons} season${seasons > 1 ? 's' : ''}` : null,
    type === 'tv' ? 'Series' : 'Film',
  ].filter(Boolean) as string[];

  const details: [string, string | undefined][] = [
    ['Director', director?.name],
    ['Created by', creators],
    ['Status', data.status],
    ['Language', data.original_language?.toUpperCase()],
  ];

  return (
    <article className="relative">
      <Seo
        title={year ? `${title} (${year})` : title}
        description={(data.overview || `${title}: details, cast and ratings.`).slice(0, 160)}
        image={backdrop ?? poster}
      />
      <JsonLd data={structuredData(type, data)} />

      {/* Faded backdrop behind the header */}
      <div className="absolute inset-x-0 top-0 h-[70vh] overflow-hidden">
        {backdrop && <img src={backdrop} alt="" fetchPriority="high" className="h-full w-full object-cover opacity-55" />}
        <div className="absolute inset-0 bg-linear-to-b from-bg/30 to-bg to-95%" />
      </div>

      <div
        className={`${gutter} relative grid grid-cols-1 gap-6 pt-[30vh] pb-14 md:grid-cols-[minmax(180px,300px)_1fr] md:gap-14 md:pt-[18vh]`}
      >
        <div className="aspect-[2/3] w-[180px] overflow-hidden rounded-[14px] border border-border bg-surface shadow-[0_30px_60px_rgba(0,0,0,0.45)] md:w-auto">
          {poster ? (
            <img src={poster} alt={`${title} poster`} width={500} height={750} className="h-full w-full object-cover" />
          ) : (
            <div className="grid h-full place-items-center p-3 text-center font-display text-sm text-muted">{title}</div>
          )}
        </div>

        <div>
          {data.tagline && (
            <span className="block text-sm font-bold tracking-[0.14em] text-accent uppercase">{data.tagline}</span>
          )}
          <h1 className="mt-3.5 mb-[18px] font-display text-[clamp(32px,5vw,68px)] leading-[1.02] font-black tracking-tight">
            {title}
          </h1>
          <div className="flex flex-wrap items-center gap-3.5 font-semibold text-muted">
            {data.vote_average ? (
              <span className={pill}>
                <StarIcon /> {data.vote_average.toFixed(1)}
              </span>
            ) : null}
            {facts.map((f) => (
              <span key={f}>{f}</span>
            ))}
          </div>
          <div className="my-[18px] flex flex-wrap gap-2.5">
            {data.genres?.map((g) => (
              <Link key={g.id} className={chip()} to={`/browse?${type === 'tv' ? 'type=tv&' : ''}genre=${g.id}`}>
                {g.name}
              </Link>
            ))}
          </div>
          <p className="max-w-[70ch] text-lg leading-relaxed text-cream-2">{data.overview || 'No overview available.'}</p>

          <dl className="my-6 mb-[30px] grid grid-cols-[max-content_1fr] gap-x-6 gap-y-2 font-semibold">
            {details
              .filter(([, value]) => value)
              .map(([label, value]) => (
                <div key={label} className="contents">
                  <dt className="text-muted">{label}</dt>
                  <dd>{value}</dd>
                </div>
              ))}
          </dl>

          {trailer && (
            <a className={btn} href={`https://www.youtube.com/watch?v=${trailer.key}`} target="_blank" rel="noreferrer">
              ▶ Watch trailer
            </a>
          )}
        </div>
      </div>

      <div className={`${gutter} relative`}>
        {cast.length > 0 && (
          <RowTrack title="Cast" size="person">
            {cast.map((p) => (
              <div key={p.credit_id} className="min-w-0 text-center">
                <div className="grid aspect-square place-items-center overflow-hidden rounded-full border border-line bg-surface font-display text-[32px] text-muted">
                  {p.profile_path ? (
                    <img src={img(p.profile_path, 'w185')!} alt={p.name} loading="lazy" className="h-full w-full object-cover" />
                  ) : (
                    p.name.charAt(0)
                  )}
                </div>
                <div className="mt-2.5 truncate text-[15px] font-bold">{p.name}</div>
                <div className="mt-0.5 truncate text-[13px] text-muted">{p.character}</div>
              </div>
            ))}
          </RowTrack>
        )}

        <Row title="You might also like" path={`/${type}/${id}/recommendations`} type={type} />
      </div>
    </article>
  );
}
