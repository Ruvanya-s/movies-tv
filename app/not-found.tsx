import type { Metadata } from 'next';
import Link from 'next/link';
import PageTitle from '@/components/PageTitle';
import { btn, gutter } from '@/lib/ui';

export const metadata: Metadata = { title: 'Page not found' };

export default function NotFound() {
  return (
    <div className={gutter}>
      <PageTitle label="404" title="This reel is missing." />
      <Link className={btn} href="/">
        Back to home
      </Link>
    </div>
  );
}
