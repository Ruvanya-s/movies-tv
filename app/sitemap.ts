import type { MetadataRoute } from 'next';
import { SITE_URL, tmdbSafe } from '@/lib/tmdb';
import type { MediaType, TmdbList } from '@/lib/types';

export const revalidate = 86400;

// Lists the main pages plus currently popular titles so search engines find them.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const entries: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, lastModified: now, changeFrequency: 'daily', priority: 1 },
    { url: `${SITE_URL}/browse`, lastModified: now, changeFrequency: 'daily', priority: 0.8 },
    { url: `${SITE_URL}/browse?type=tv`, lastModified: now, changeFrequency: 'daily', priority: 0.8 },
  ];

  const sources: [MediaType, string][] = [
    ['movie', '/movie/popular'],
    ['movie', '/movie/top_rated'],
    ['movie', '/movie/now_playing'],
    ['tv', '/tv/popular'],
    ['tv', '/tv/top_rated'],
  ];

  const seen = new Set<string>();
  for (const [type, path] of sources) {
    for (const page of [1, 2, 3]) {
      const data = await tmdbSafe<TmdbList>(path, { page });
      for (const item of data?.results ?? []) {
        const url = `${SITE_URL}/${type}/${item.id}`;
        if (seen.has(url)) continue;
        seen.add(url);
        entries.push({ url, lastModified: now, changeFrequency: 'weekly', priority: 0.6 });
      }
    }
  }
  return entries;
}
