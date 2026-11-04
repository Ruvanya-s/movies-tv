import { cache } from 'react';
import type { MediaType, Title, TmdbList, TmdbListItem } from './types';

// TMDB client. TMDB_API_KEY has no NEXT_PUBLIC_ prefix, so Next.js only exposes it
// on the server — it never reaches visitors' browsers.
const KEY = (process.env.TMDB_API_KEY ?? '').trim();
const BASE = 'https://api.themoviedb.org/3';
const IS_TOKEN = KEY.length > 40; // v4 read tokens are long JWTs

export const hasApiKey = KEY.length > 0;

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000').replace(/\/$/, '');

export type ImageSize = 'w185' | 'w342' | 'w500' | 'w1280' | 'original';

export function img(path: string | null | undefined, size: ImageSize = 'w500'): string | null {
  return path ? `https://image.tmdb.org/t/p/${size}${path}` : null;
}

type Params = Record<string, string | number | boolean | undefined>;

/**
 * Fetch from TMDB. Results are cached and refreshed every hour.
 * Returns null when no key is set or the item doesn't exist; throws on other errors.
 */
export const tmdb = cache(async <T = unknown>(path: string, params: Params = {}): Promise<T | null> => {
  if (!hasApiKey) return null;
  const url = new URL(BASE + path);
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== '') url.searchParams.set(k, String(v));
  }
  const headers: Record<string, string> = { accept: 'application/json' };
  if (IS_TOKEN) headers.Authorization = `Bearer ${KEY}`;
  else url.searchParams.set('api_key', KEY);

  const res = await fetch(url, { headers, next: { revalidate: 3600 } });
  if (res.status === 404) return null;
  if (!res.ok) {
    if (res.status === 401) throw new Error('Your TMDB key was rejected. Check TMDB_API_KEY in .env.local.');
    throw new Error(`TMDB request failed (${res.status})`);
  }
  return (await res.json()) as T;
}) as <T = unknown>(path: string, params?: Params) => Promise<T | null>;

/** Same as tmdb() but never throws — for optional sections like rows. */
export async function tmdbSafe<T = unknown>(path: string, params?: Params): Promise<T | null> {
  try {
    return await tmdb<T>(path, params);
  } catch {
    return null;
  }
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

export function listOf(data: TmdbList | null, type?: MediaType): Title[] {
  return (data?.results ?? [])
    .filter((r) => r.media_type !== 'person')
    .map((r) => normalize(r, type));
}
