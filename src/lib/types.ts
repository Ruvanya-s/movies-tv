// Shapes of the TMDB data this app uses. Only the fields we read are listed.

export type MediaType = 'movie' | 'tv';

/** One item in a TMDB list (trending, popular, search, discover...). */
export interface TmdbListItem {
  id: number;
  media_type?: MediaType | 'person';
  title?: string; // movies
  name?: string; // tv
  release_date?: string; // movies
  first_air_date?: string; // tv
  poster_path: string | null;
  backdrop_path: string | null;
  overview?: string;
}

export interface TmdbList {
  page: number;
  total_pages: number;
  results: TmdbListItem[];
}

export interface Genre {
  id: number;
  name: string;
}

export interface CastMember {
  credit_id: string;
  name: string;
  character?: string;
  profile_path: string | null;
}

export interface CrewMember {
  job: string;
  name: string;
}

export interface Video {
  key: string;
  site: string;
  type: string;
  published_at?: string;
}

/** Full detail for /movie/{id} or /tv/{id} with credits and videos appended. */
export interface TmdbDetail extends TmdbListItem {
  tagline?: string;
  genres?: Genre[];
  runtime?: number;
  number_of_seasons?: number;
  status?: string;
  original_language?: string;
  created_by?: { name: string }[];
  credits?: { cast: CastMember[]; crew: CrewMember[] };
  videos?: { results: Video[] };
}

/** The simplified shape our UI components use for a movie or show. */
export interface Title {
  id: number;
  type: MediaType;
  title: string;
  year: string;
  poster: string | null;
  backdrop: string | null;
  overview: string;
}
