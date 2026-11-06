import { Link } from 'react-router';
import PageTitle from '@/components/PageTitle';
import Seo from '@/components/Seo';
import { btnGlass, eyebrow, gutter } from '@/lib/ui';

export default function NotFound() {
  return (
    <div className={`${gutter} relative flex min-h-[calc(100vh-160px)] flex-col justify-center`}>
      <Seo title="Page not found" noindex />
      <span className={`${eyebrow} absolute inset-x-0 top-10 text-center md:top-14`}>404</span>
      <PageTitle title="This page is not found" center />
      <div className="flex justify-center">
        <Link className={btnGlass} to="/">
          Back to home
        </Link>
      </div>
    </div>
  );
}
