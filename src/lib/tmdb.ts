import type { MediaType, Title, TmdbList, TmdbListItem, Video } from './types';

// TMDB client. Runs in the browser, so the key comes from VITE_TMDB_API_KEY in .env.local.
const KEY = (import.meta.env.VITE_TMDB_API_KEY ?? '').trim();
const BASE = 'https://api.themoviedb.org/3';
const IS_TOKEN = KEY.length > 40; // v4 read tokens are long JWTs

/** No key while developing: show made-up sample data from demo.ts. Never used in a production build. */
export const isDemo = !KEY && import.meta.env.DEV;

/** True when pages have something to load, from TMDB or the sample data. */
export const dataReady = KEY.length > 0 || isDemo;

export type ImageSize = 'w185' | 'w342' | 'w500' | 'w1280' | 'original';

export function img(path: string | null | undefined, size: ImageSize = 'w500'): string | null {
  if (path?.startsWith('data:')) return path; // sample artwork is already a full image
  return path ? `https://image.tmdb.org/t/p/${size}${path}` : null;
}

export const findTrailer = (videos?: Video[]) => videos?.find((v) => v.site === 'YouTube' && v.type === 'Trailer');

export type Params = Record<string, string | number | boolean | undefined>;

export class NotFoundError extends Error {}

// Remember responses for 10 minutes so going back to a page is instant.
const CACHE_MS = 10 * 60 * 1000;
const cache = new Map<string, { at: number; promise: Promise<unknown> }>();

/** Build the full request URL (also used as the cache key). */
function buildUrl(path: string, params: Params = {}): URL {
  const url = new URL(BASE + path);
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== '') url.searchParams.set(k, String(v));
  }
  if (!IS_TOKEN) url.searchParams.set('api_key', KEY);
  return url;
}

/** Fetch from TMDB. Throws NotFoundError for missing items and Error for other failures. */
export function tmdb<T>(path: string, params?: Params): Promise<T> {
  if (isDemo) return import('./demo').then((demo) => demo.demoResponse(path, params) as T);
  if (!dataReady) return Promise.reject(new Error('NO_KEY'));
  const url = buildUrl(path, params);
  const key = url.toString();

  const hit = cache.get(key);
  if (hit && Date.now() - hit.at < CACHE_MS) return hit.promise as Promise<T>;

  const headers: Record<string, string> = { accept: 'application/json' };
  if (IS_TOKEN) headers.Authorization = `Bearer ${KEY}`;

  const promise = fetch(url, { headers }).then(async (res) => {
    if (res.status === 404) throw new NotFoundError('Not found');
    if (res.status === 401) throw new Error('Your TMDB key was rejected. Check VITE_TMDB_API_KEY in .env.local.');
    if (!res.ok) throw new Error(`TMDB request failed (${res.status})`);
    return (await res.json()) as T;
  });

  cache.set(key, { at: Date.now(), promise });
  promise.catch(() => cache.delete(key)); // don't cache failures
  return promise;
}

export function normalize(item: TmdbListItem, fallbackType?: MediaType): Title {
  const type: MediaType =
    item.media_type === 'movie' || item.media_type === 'tv'
      ? item.media_type
      : fallbackType ?? (item.title ? 'movie' : 'tv');
  const date = item.release_date || item.first_air_date || '';
  return {
    id: item.id,
    type,
    title: item.title || item.name || 'Untitled',
    year: date.slice(0, 4),
    poster: img(item.poster_path, 'w342'),
    backdrop: img(item.backdrop_path, 'w1280'),
    rating: item.vote_average ? item.vote_average.toFixed(1) : null,
    overview: item.overview ?? '',
  };
}

export function listOf(data: TmdbList | null | undefined, type?: MediaType): Title[] {
  return (data?.results ?? [])
    .filter((r) => r.media_type !== 'person')
    .map((r) => normalize(r, type));
}
