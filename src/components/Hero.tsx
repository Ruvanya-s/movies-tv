import { useState } from 'react';
import { Link } from 'react-router';
import { ChevronIcon, PlayIcon, StarIcon } from './Icons';
import { useTmdb } from '@/hooks/useTmdb';
import { findTrailer, listOf } from '@/lib/tmdb';
import { eyebrow, glass, glassArrow, gutter } from '@/lib/ui';
import type { Title, TmdbList, Video } from '@/lib/types';

// The negative margin (the header's height) slides the banner under the translucent header.
const height = '-mt-[127px] min-h-[680px] md:-mt-[76px] md:h-[min(100vh,856px)] md:min-h-[700px]';

/** Five stars filled in proportion to a 0-10 rating. */
function Stars({ rating }: { rating: string }) {
  const stars = [0, 1, 2, 3, 4].map((i) => <StarIcon key={i} size={20} className="shrink-0" />);
  return (
    <span className="relative inline-flex gap-1 text-cream/25" role="img" aria-label={`Rated ${rating} out of 10`}>
      {stars}
      <span
        className="absolute inset-y-0 left-0 flex gap-1 overflow-hidden text-accent"
        style={{ width: `${Number(rating) * 10}%` }}
      >
        {stars}
      </span>
    </span>
  );
}

/** A link to the title's page, plus its trailer when it has one. */
function Actions({ pick }: { pick: Title }) {
  const { data } = useTmdb<{ results: Video[] }>(`/${pick.type}/${pick.id}/videos`);
  const trailer = findTrailer(data?.results);

  return (
    <div className="mt-7 flex flex-wrap items-center gap-3.5 pr-16 md:pr-0">
      <Link
        className={`${glass} inline-flex items-center rounded-full bg-cream/25 px-7 py-3 font-extrabold transition-all hover:-translate-y-px hover:bg-cream/40`}
        to={`/${pick.type}/${pick.id}`}
      >
        More details
      </Link>
      {trailer && (
        <a
          className={`${glass} inline-flex animate-fade-in items-center gap-2 rounded-full bg-cream/12 px-6 py-3 font-bold transition-colors hover:bg-cream/25`}
          href={`https://www.youtube.com/watch?v=${trailer.key}`}
          target="_blank"
          rel="noreferrer"
        >
          <PlayIcon /> Play trailer
        </a>
      )}
    </div>
  );
}

/** Full-width carousel of trending titles, moved along by the arrow on the right. */
export default function Hero() {
  const { data, loading } = useTmdb<TmdbList>('/trending/all/day');
  const [selected, setSelected] = useState(0);
  // The title being replaced stays underneath while the new one slides over it.
  const [previous, setPrevious] = useState<number | null>(null);

  if (loading) return <div className={`skeleton ${height}`} />;
  const picks = listOf(data)
    .filter((i) => i.backdrop)
    .slice(0, 10);
  const pick = picks[selected];
  if (!pick) return null;

  const next = (selected + 1) % picks.length;
  const showNext = () => {
    setPrevious(selected);
    setSelected(next);
  };
  // Fade on page load, slide on every change after that.
  const arrived = previous === null ? 'animate-fade-in' : 'animate-slide-soft motion-reduce:animate-fade-in';

  return (
    <section className={`relative flex overflow-hidden ${height}`} aria-label="Trending titles">
      {previous !== null && previous !== selected && (
        <img src={picks[previous].backdrop!} alt="" className="absolute inset-0 h-full w-full object-cover" />
      )}
      <img
        key={pick.id}
        src={pick.backdrop!}
        alt=""
        fetchPriority="high"
        className={`absolute inset-0 h-full w-full object-cover ${
          previous === null ? 'animate-fade-in' : 'animate-slide-in motion-reduce:animate-fade-in'
        }`}
      />
      {/* Navy scrims keep the text readable; the coral wash ties the image to the brand. */}
      <div className="absolute inset-0 bg-linear-to-t from-bg via-bg/80 via-55% to-transparent md:bg-linear-to-r md:from-bg md:from-5% md:via-bg/70 md:via-40% md:to-transparent md:to-75%" />
      <div className="absolute inset-0 bg-linear-to-t from-bg to-transparent to-25%" />
      <div className="absolute inset-0 bg-linear-to-b from-bg/80 to-transparent to-25%" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_100%_at_0%_0%,rgb(255_107_91/0.34),transparent_70%)]" />

      <div
        className={`${gutter} relative flex w-full flex-col justify-end gap-8 pt-56 pb-10 md:flex-row md:items-center md:justify-between md:gap-12 md:pt-[124px] md:pb-12`}
      >
        <div key={pick.id} className={`max-w-[620px] ${arrived}`} aria-live="polite">
          <span className={eyebrow}>Trending today</span>
          <h2 className="text-headline mt-4 line-clamp-3 w-fit pb-2 font-display text-[clamp(38px,5.6vw,76px)] leading-[1.04] font-extrabold tracking-tight">
            {pick.title}
          </h2>
          <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-[15px] font-semibold text-cream-2">
            {pick.rating && (
              <>
                <Stars rating={pick.rating} />
                <span>TMDB {pick.rating}</span>
              </>
            )}
            {pick.year && <span>{pick.year}</span>}
            <span>{pick.type === 'tv' ? 'Series' : 'Film'}</span>
          </div>
          <p className="mt-4 line-clamp-3 max-w-[52ch] text-base leading-relaxed text-cream-2">{pick.overview}</p>
          <Actions key={`${pick.type}-${pick.id}`} pick={pick} />
        </div>

        {picks.length > 1 && (
          <button
            type="button"
            onClick={showNext}
            aria-label={`Next: ${picks[next].title}`}
            title="Next"
            // Phones: in line with the action buttons. Larger screens: centered on the right.
            className={`${glassArrow} absolute right-4 bottom-10 grid size-12 md:static md:size-14`}
          >
            <ChevronIcon size={26} />
          </button>
        )}
      </div>
    </section>
  );
}
