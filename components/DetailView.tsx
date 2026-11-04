import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Row from './Row';
import RowTrack from './RowTrack';
import JsonLd from './JsonLd';
import { NotConnected, Notice } from './States';
import { StarIcon } from './Icons';
import { hasApiKey, tmdb, img, SITE_URL } from '@/lib/tmdb';
import { btn, chip, gutter, pill } from '@/lib/ui';
import type { MediaType, TmdbDetail } from '@/lib/types';

const runtime = (m?: number) => (m ? `${Math.floor(m / 60)}h ${m % 60}m` : null);

export function getTitle(type: MediaType, id: string) {
  if (!/^\d+$/.test(id)) return Promise.resolve(null);
  return tmdb<TmdbDetail>(`/${type}/${id}`, { append_to_response: 'credits,videos' });
}

const findTrailer = (d: TmdbDetail) =>
  d.videos?.results.find((v) => v.site === 'YouTube' && v.type === 'Trailer');
const findDirector = (d: TmdbDetail) => d.credits?.crew.find((c) => c.job === 'Director');

/** Page title, description and link-preview tags for /movie/[id] and /tv/[id]. */
export async function detailMetadata(type: MediaType, id: string): Promise<Metadata> {
  let data: TmdbDetail | null;
  try {
    data = await getTitle(type, id);
  } catch {
    return { title: 'Not available' };
  }
  if (!data) return { title: 'Not found' };

  const name = data.title || data.name || 'Untitled';
  const year = (data.release_date || data.first_air_date || '').slice(0, 4);
  const title = year ? `${name} (${year})` : name;
  const description = (data.overview || `${name}: details, cast and ratings.`).slice(0, 160);
  const path = `/${type}/${id}`;
  const backdrop = img(data.backdrop_path, 'w1280');
  const poster = img(data.poster_path, 'w500');
  const images = [
    ...(backdrop ? [{ url: backdrop, width: 1280, height: 720, alt: name }] : []),
    ...(poster ? [{ url: poster, width: 500, height: 750, alt: `${name} poster` }] : []),
  ];

  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: type === 'tv' ? 'video.tv_show' : 'video.movie',
      title,
      description,
      url: path,
      images,
    },
    twitter: { card: 'summary_large_image', title, description, images: images.map((i) => i.url) },
  };
}

/** schema.org Movie / TVSeries data so Google can show rich results. */
function structuredData(type: MediaType, d: TmdbDetail): Record<string, unknown> {
  const name = d.title || d.name;
  const director = findDirector(d);
  const trailer = findTrailer(d);
  return {
    '@context': 'https://schema.org',
    '@type': type === 'tv' ? 'TVSeries' : 'Movie',
    name,
    url: `${SITE_URL}/${type}/${d.id}`,
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

export default async function DetailView({ type, id }: { type: MediaType; id: string }) {
  if (!hasApiKey) {
    return (
      <div className={gutter}>
        <NotConnected />
      </div>
    );
  }

  let data: TmdbDetail | null;
  try {
    data = await getTitle(type, id);
  } catch (e) {
    return (
      <div className={gutter}>
        <Notice title="Something went wrong" text={(e as Error).message} />
      </div>
    );
  }
  if (!data) notFound();

  const title = data.title || data.name || 'Untitled';
  const date = data.release_date || data.first_air_date || '';
  const trailer = findTrailer(data);
  const director = findDirector(data);
  const cast = data.credits?.cast.slice(0, 12) ?? [];
  const creators = data.created_by?.map((c) => c.name).join(', ');
  const seasons = data.number_of_seasons;
  const backdrop = img(data.backdrop_path, 'w1280');
  const poster = img(data.poster_path, 'w500');

  const facts = [
    date.slice(0, 4),
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
      <JsonLd data={structuredData(type, data)} />

      {/* Faded backdrop behind the header */}
      <div className="absolute inset-x-0 top-0 -z-0 h-[70vh] overflow-hidden">
        {backdrop && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={backdrop} alt="" fetchPriority="high" className="h-full w-full object-cover opacity-55" />
        )}
        <div className="absolute inset-0 bg-linear-to-b from-bg/30 to-bg to-95%" />
      </div>

      <div
        className={`${gutter} relative grid grid-cols-1 gap-6 pt-[30vh] pb-14 md:grid-cols-[minmax(180px,300px)_1fr] md:gap-14 md:pt-[18vh]`}
      >
        <div className="aspect-[2/3] w-[180px] overflow-hidden rounded-[14px] border border-border bg-surface shadow-[0_30px_60px_rgba(0,0,0,0.45)] md:w-auto">
          {poster ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={poster} alt={`${title} poster`} width={500} height={750} className="h-full w-full object-cover" />
          ) : (
            <div className="grid h-full place-items-center p-3 text-center font-display text-sm text-muted">
              {title}
            </div>
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
              <Link key={g.id} className={chip()} href={`/browse?${type === 'tv' ? 'type=tv&' : ''}genre=${g.id}`}>
                {g.name}
              </Link>
            ))}
          </div>
          <p className="max-w-[70ch] text-lg leading-relaxed text-cream-2">
            {data.overview || 'No overview available.'}
          </p>

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
                    // eslint-disable-next-line @next/next/no-img-element
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
