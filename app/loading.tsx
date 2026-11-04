import { GridSkeleton } from '@/components/Grid';
import { gutter } from '@/lib/ui';

export default function Loading() {
  return (
    <div className={`${gutter} pt-10`}>
      <GridSkeleton />
    </div>
  );
}
