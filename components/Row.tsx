import Card from './Card';
import RowTrack from './RowTrack';
import { tmdbSafe, listOf } from '@/lib/tmdb';
import type { MediaType, TmdbList } from '@/lib/types';

type RowProps = {
  title: string;
  /** TMDB endpoint, e.g. "/movie/popular". */
  path: string;
  type?: MediaType;
  seeAll?: string;
};

export default async function Row({ title, path, type, seeAll }: RowProps) {
  const items = listOf(await tmdbSafe<TmdbList>(path), type);
  if (items.length === 0) return null;
  return (
    <RowTrack title={title} seeAll={seeAll}>
      {items.map((item) => (
        <Card key={`${item.type}-${item.id}`} item={item} />
      ))}
    </RowTrack>
  );
}
