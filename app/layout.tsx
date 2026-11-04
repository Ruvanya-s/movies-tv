import type { Metadata, Viewport } from 'next';
import { Unbounded, Manrope } from 'next/font/google';
import Header from '@/components/Header';
import { SITE_URL } from '@/lib/tmdb';
import './globals.css';

// next/font downloads these at build time and serves them from your own site.
const unbounded = Unbounded({
  subsets: ['latin'],
  weight: ['500', '700', '800', '900'],
  variable: '--font-unbounded',
  display: 'swap',
});
const manrope = Manrope({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-manrope',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Reel — Find your next favorite film or series',
    template: '%s | Reel',
  },
  description:
    'Discover trending movies and TV series, browse by genre, and see ratings, cast, trailers and recommendations.',
  applicationName: 'Reel',
  openGraph: { type: 'website', siteName: 'Reel', url: '/' },
  twitter: { card: 'summary_large_image' },
  alternates: { canonical: '/' },
};

export const viewport: Viewport = {
  themeColor: '#1f120d',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${unbounded.variable} ${manrope.variable}`}>
      <body>
        <Header />
        <main className="min-h-[calc(100vh-160px)]">{children}</main>
        <footer className="mt-10 flex flex-wrap justify-between gap-3 border-t border-line px-4 py-7 text-[13px] text-muted md:px-6">
          <span className="font-display font-extrabold text-cream">Reel</span>
          <span>Data from TMDB. This product uses the TMDB API but is not endorsed or certified by TMDB.</span>
        </footer>
      </body>
    </html>
  );
}
