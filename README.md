# Reel — Movies & TV

A movie and TV browsing site built with **Next.js**, **TypeScript** and **Tailwind CSS**,
using data from the TMDB API. Pages are rendered on the server, so search engines
and link previews see full content.

## Run it

1. Open a terminal in this folder and install dependencies:

   ```
   npm install
   ```

2. Start the dev server:

   ```
   npm run dev
   ```

   Open http://localhost:3000. Without a key you'll see "Movie data isn't connected yet" — that's expected.

The first run needs an internet connection: Next.js downloads the two fonts (Unbounded and Manrope)
from Google Fonts and then serves them from your own site.

## Connect movie data (TMDB)

1. Create a free account at https://www.themoviedb.org and go to **Settings → API** to get a key.
2. Copy `.env.example` to a new file named `.env.local` in this folder.
3. Paste your key: `TMDB_API_KEY=your_key_here`
   (the short "API Key" or the long "API Read Access Token" both work).
4. Stop the dev server (Ctrl + C) and run `npm run dev` again.

The key is only used on the server — it never appears in visitors' browsers.

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Development server with hot reload |
| `npm run typecheck` | Check the TypeScript types |
| `npm run build` | Production build |
| `npm start` | Run the production build |

## Pages

| URL | What it is |
| --- | --- |
| `/` | Hero, trending spotlight, rows for trending, in theaters, popular and top rated |
| `/browse` | Films / Series, genre filter, sort, page links (`?type=tv&genre=18&sort=newest&page=2`) |
| `/search?q=...` | Search across movies and TV (kept out of Google on purpose) |
| `/movie/[id]`, `/tv/[id]` | Detail page: backdrop, facts, genres, trailer, cast, recommendations |

## Styling (Tailwind)

- Colors and fonts are defined once in `app/globals.css` under `@theme`.
  Each becomes a class: `--color-accent` → `bg-accent`, `text-accent`, `border-accent`.
- Class groups used in several places (buttons, chips, page padding) live in `lib/ui.ts`.

## TypeScript

- TMDB response shapes are in `lib/types.ts`.
- `lib/tmdb.ts` is the typed API client: `tmdb<TmdbList>('/movie/popular')`.

## SEO built in

- Unique `<title>`, description and canonical URL on every page.
- Open Graph and Twitter tags, so shared links show the poster/backdrop and title.
- Structured data (schema.org `Movie` / `TVSeries` with rating, cast, director, trailer).
- `/sitemap.xml` with the main pages plus ~300 popular titles, refreshed daily.
- `/robots.txt` pointing to the sitemap and excluding search result pages.
- Browse filters and pagination are real links, so crawlers can follow them.
- Pages are cached and refreshed in the background (home hourly, titles daily).

## Deploying

1. Push this folder to GitHub and import it on Vercel (or any host that runs Node.js).
2. Add two environment variables in the host's settings:
   - `TMDB_API_KEY` — your key
   - `NEXT_PUBLIC_SITE_URL` — your real address, e.g. `https://reel.example.com`
3. Deploy. `NEXT_PUBLIC_SITE_URL` is read at build time, so redeploy after changing it.
4. Submit `https://your-site/sitemap.xml` in Google Search Console.

## Project layout

```
app/
  layout.tsx            page shell, fonts, default SEO tags
  globals.css           Tailwind import + design tokens (@theme)
  page.tsx              home
  browse/page.tsx       browse with filters + pagination
  search/page.tsx       search results
  movie/[id]/page.tsx   movie detail
  tv/[id]/page.tsx      TV detail
  sitemap.ts, robots.ts
components/             Header, Card, Row, Grid, DetailView, ...
lib/
  tmdb.ts               TMDB client (server only)
  types.ts              TypeScript types for TMDB data
  ui.ts                 shared Tailwind class groups
```
