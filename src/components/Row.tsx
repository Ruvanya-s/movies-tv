import Card, { CardSkeleton } from './Card';
import RowTrack from './RowTrack';
import { useTmdb } from '@/hooks/useTmdb';
import { listOf } from '@/lib/tmdb';
import type { MediaType, TmdbList } from '@/lib/types';

type RowProps = {
  title: string;
  /** TMDB endpoint, e.g. "/movie/popular". */
  path: string;
  type?: MediaType;
  seeAll?: string;
};

/** Loads a TMDB list and shows it as a scrolling row of cards. */
export default function Row({ title, path, type, seeAll }: RowProps) {
  const { data, loading, error } = useTmdb<TmdbList>(path);
  const items = listOf(data, type);

  // Hide the row if it failed or came back empty.
  if (error || (!loading && items.length === 0)) return null;

  return (
    <RowTrack title={title} seeAll={seeAll}>
      {loading
        ? Array.from({ length: 8 }, (_, i) => <CardSkeleton key={i} />)
        : items.map((item) => <Card key={`${item.type}-${item.id}`} item={item} />)}
    </RowTrack>
  );
}
