import { Link } from 'react-router';
import PageTitle from '@/components/PageTitle';
import Seo from '@/components/Seo';
import { btn, gutter } from '@/lib/ui';

export default function NotFound() {
  return (
    <div className={gutter}>
      <Seo title="Page not found" noindex />
      <PageTitle label="404" title="This reel is missing." />
      <Link className={btn} to="/">
        Back to home
      </Link>
    </div>
  );
}
