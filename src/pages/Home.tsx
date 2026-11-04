import { Link } from 'react-router';
import Row from '@/components/Row';
import Seo from '@/components/Seo';
import JsonLd from '@/components/JsonLd';
import { NotConnected, Notice } from '@/components/States';
import { StarIcon } from '@/components/Icons';
import { useTmdb } from '@/hooks/useTmdb';
import { hasApiKey, listOf } from '@/lib/tmdb';
import { eyebrow, gutter, pill } from '@/lib/ui';
import type { TmdbList } from '@/lib/types';

function Spotlight() {
  const { data, loading } = useTmdb<TmdbList>('/trending/all/day');
  if (loading) {
    return <div className="skeleton mb-14 aspect-[4/5] min-h-[340px] rounded-[18px] md:aspect-[21/8]" />;
  }
  const pick = listOf(data).find((i) => i.backdrop);
  if (!pick) return null;

  return (
    <Link
      to={`/${pick.type}/${pick.id}`}
      className="group relative mb-14 block aspect-[4/5] min-h-[340px] overflow-hidden rounded-[18px] border border-border md:aspect-[21/8]"
    >
      <img
        src={pick.backdrop!}
        alt=""
        fetchPriority="high"
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
      />
      <div className="absolute inset-0 bg-linear-to-t from-bg from-10% via-bg/60 via-55% to-transparent md:bg-linear-to-r md:from-5% md:via-bg/75 md:via-40% md:to-80%" />
      <div className="absolute bottom-0 left-0 max-w-[640px] p-5 md:p-12">
        <span className={eyebrow}>Trending today</span>
        <h2 className="my-3 font-display text-[28px] leading-[1.05] font-extrabold md:text-[52px]">{pick.title}</h2>
        <div className="flex flex-wrap items-center gap-3.5 font-semibold text-muted">
          {pick.rating && (
            <span className={pill}>
              <StarIcon /> {pick.rating}
            </span>
          )}
          <span>{pick.year}</span>
          <span>{pick.type === 'tv' ? 'Series' : 'Film'}</span>
        </div>
        <p className="mt-4 line-clamp-3 text-[17px] leading-relaxed text-cream-2">{pick.overview}</p>
      </div>
    </Link>
  );
}

export default function Home() {
  // A cheap request to check the key works before drawing all the rows.
  const probe = useTmdb('/configuration');
  const origin = window.location.origin;

  return (
    <div className={gutter}>
      <Seo />
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: 'Reel',
          url: origin,
          potentialAction: {
            '@type': 'SearchAction',
            target: `${origin}/search?q={search_term_string}`,
            'query-input': 'required name=search_term_string',
          },
        }}
      />

      <section className="pt-[18px] pb-10 md:pb-[72px]">
        <span className={eyebrow}>Now showing</span>
        <h1 className="mt-7 max-w-[14ch] font-display text-[clamp(40px,7.4vw,96px)] leading-[1.02] font-black tracking-tight">
          Find your next favorite film or series.
        </h1>
      </section>

      {!hasApiKey ? (
        <NotConnected />
      ) : probe.error ? (
        <Notice title="Something went wrong" text={probe.error.message} />
      ) : (
        <>
          <Spotlight />
          <Row title="Trending this week" path="/trending/all/week" />
          <Row title="Now in theaters" path="/movie/now_playing" type="movie" seeAll="/browse?type=movie" />
          <Row title="Popular series" path="/tv/popular" type="tv" seeAll="/browse?type=tv" />
          <Row title="Top rated films" path="/movie/top_rated" type="movie" seeAll="/browse?sort=vote_average.desc" />
          <Row
            title="Top rated series"
            path="/tv/top_rated"
            type="tv"
            seeAll="/browse?type=tv&sort=vote_average.desc"
          />
        </>
      )}
    </div>
  );
}
