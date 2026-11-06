import Hero from '@/components/Hero';
import Row from '@/components/Row';
import Seo from '@/components/Seo';
import JsonLd from '@/components/JsonLd';
import { NotConnected, Notice } from '@/components/States';
import { useTmdb } from '@/hooks/useTmdb';
import { dataReady } from '@/lib/tmdb';
import { gutter } from '@/lib/ui';

export default function Home() {
  // A cheap request to check the key works before drawing all the rows.
  const probe = useTmdb('/configuration');
  const origin = window.location.origin;

  return (
    <>
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

      {/* The banner shows a film's name, so the page's main heading is for screen readers and search engines. */}
      <h1 className="sr-only">Reel: find your next favorite film or series</h1>

      {!dataReady ? (
        <div className={gutter}>
          <NotConnected />
        </div>
      ) : probe.error ? (
        <div className={gutter}>
          <Notice title="Something went wrong" text={probe.error.message} />
        </div>
      ) : (
        <>
          <Hero />
          <div className={`${gutter} pt-10 md:pt-14`}>
            <Row title="Trending this week" path="/trending/all/week" seeAll="/browse" />
            <Row title="Now in theaters" path="/movie/now_playing" type="movie" seeAll="/browse?type=movie" />
            <Row title="Popular series" path="/tv/popular" type="tv" seeAll="/browse?type=tv" />
            <Row title="Top rated films" path="/movie/top_rated" type="movie" seeAll="/browse?sort=vote_average.desc" />
            <Row
              title="Top rated series"
              path="/tv/top_rated"
              type="tv"
              seeAll="/browse?type=tv&sort=vote_average.desc"
            />
          </div>
        </>
      )}
    </>
  );
}
