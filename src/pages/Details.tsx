import { useState, type ReactNode } from 'react';
import { Link, useParams } from 'react-router';
import Row from '@/components/Row';
import Seo from '@/components/Seo';
import { NotConnected, Notice } from '@/components/States';
import { PlayIcon } from '@/components/Icons';
import NotFound from './NotFound';
import { useTmdb } from '@/hooks/useTmdb';
import { dataReady, findTrailer, img, NotFoundError } from '@/lib/tmdb';
import { btnGlass, chip, gutter } from '@/lib/ui';
import type { MediaType, TmdbDetail } from '@/lib/types';

const runtime = (m?: number) => (m ? `${Math.floor(m / 60)}h ${m % 60}m` : null);

const findDirector = (d: TmdbDetail) => d.credits?.crew.find((c) => c.job === 'Director');

/** One "Label: value" line in the facts list. */
function Fact({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <dt className="inline font-normal text-cream">{label}: </dt>
      <dd className="inline font-bold">{children}</dd>
    </div>
  );
}

/** The first few cast names, with a "more" link that reveals the rest. */
function CastNames({ names }: { names: string[] }) {
  const [expanded, setExpanded] = useState(false);
  const hasMore = !expanded && names.length > 3;
  return (
    <>
      {(hasMore ? names.slice(0, 3) : names).join(', ')}
      {hasMore && (
        <>
          ,{' '}
          <button type="button" onClick={() => setExpanded(true)} className="cursor-pointer italic hover:text-accent">
            more
          </button>
        </>
      )}
    </>
  );
}

/** Detail page for /movie/:id and /tv/:id. */
export default function Details({ type }: { type: MediaType }) {
  const { id = '' } = useParams();
  const validId = /^\d+$/.test(id);
  const { data, loading, error } = useTmdb<TmdbDetail>(validId ? `/${type}/${id}` : null, {
    append_to_response: 'credits,videos',
  });

  if (!validId || error instanceof NotFoundError) return <NotFound />;
  if (!dataReady) {
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
  const trailer = findTrailer(data.videos?.results);
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
        description={(data.overview || `${title}: details, cast and trailer.`).slice(0, 160)}
        image={backdrop ?? poster}
      />

      {/* Faded backdrop behind the header */}
      <div className="absolute inset-x-0 top-0 h-[70vh] overflow-hidden">
        {backdrop && <img src={backdrop} alt="" fetchPriority="high" className="h-[95%] w-full object-cover opacity-55" />}
        <div className="absolute inset-0 bg-linear-to-b from-bg/30 to-bg to-95%" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_100%_at_0%_0%,rgb(255_129_112/0.34),transparent_70%)]" />
      </div>

      <div
        className={`${gutter} relative grid grid-cols-1 gap-6 pt-[30vh] pb-14 md:grid-cols-[minmax(180px,300px)_1fr] md:gap-14 md:pt-[18vh]`}
      >
        <div className="aspect-[2/3] w-[180px] overflow-hidden rounded-2xl bg-surface shadow-[0_30px_60px_-10px_rgb(255_129_112/0.35)] md:w-auto">
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
          <h1 className="mt-3.5 mb-[18px] font-display text-[clamp(32px,5vw,68px)] leading-[1.02] font-extrabold tracking-tight">
            {title}
          </h1>
          <div className="flex flex-wrap items-center gap-3.5 font-semibold text-muted">
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

          <dl className="my-6 mb-[30px] flex max-w-[70ch] flex-col gap-2.5">
            {cast.length > 0 && (
              <Fact label="Cast">
                <CastNames names={cast.map((p) => p.name)} />
              </Fact>
            )}
            {details
              .filter(([, value]) => value)
              .map(([label, value]) => (
                <Fact key={label} label={label}>
                  {value}
                </Fact>
              ))}
          </dl>

          {trailer && (
            <a
              className={btnGlass}
              href={`https://www.youtube.com/watch?v=${trailer.key}`}
              target="_blank"
              rel="noreferrer"
            >
              <PlayIcon /> Watch trailer
            </a>
          )}
        </div>
      </div>

      <div className={`${gutter} relative`}>
        <Row title="You might also like" path={`/${type}/${id}/recommendations`} type={type} />
      </div>
    </article>
  );
}
