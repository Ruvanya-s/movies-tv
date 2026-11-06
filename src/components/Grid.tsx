import Card, { CardSkeleton } from './Card';
import type { Title } from '@/lib/types';

const grid = 'mb-10 grid grid-cols-[repeat(auto-fill,minmax(130px,1fr))] gap-x-5 gap-y-8 md:grid-cols-[repeat(auto-fill,minmax(160px,1fr))]';

export default function Grid({ items }: { items: Title[] }) {
  return (
    <div className={grid}>
      {items.map((item, i) => (
        <Card key={`${item.type}-${item.id}`} item={item} priority={i < 6} />
      ))}
    </div>
  );
}

export function GridSkeleton() {
  return (
    <div className={grid} aria-hidden="true">
      {Array.from({ length: 12 }, (_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
}
